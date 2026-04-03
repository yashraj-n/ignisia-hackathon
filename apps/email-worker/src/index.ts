import PostalMime from 'postal-mime';
import { type EmailEvent, emailEvent } from 'common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { EmailMessage } from 'cloudflare:email';

interface Env {
	AWS_ACCESS_KEY_ID: string;
	AWS_SECRET_ACCESS_KEY: string;
	AWS_REGION: string;
	S3_BUCKET: string;
	RABBITMQ_URL: string;
}

export default {
	async email(message, env: Env, ctx) {
		const correlationId = crypto.randomUUID();

		const safeFrom = (() => {
			try {
				return message?.from?.toString?.() ?? '';
			} catch {
				return '';
			}
		})();

		console.log('[email-worker] email handler start', {
			correlationId,
			s3Bucket: env.S3_BUCKET,
			region: env.AWS_REGION,
			fromHint: safeFrom,
		});

		// Send an immediate acknowledgement to the original sender while we do
		// the heavier work (S3 uploads + RabbitMQ publish).
		try {
			const originalMessageId = message.headers.get('Message-ID') ?? '';
			const originalSubject = message.headers.get('Subject') ?? '';
			const safeSubject = originalSubject.replace(/[\r\n]+/g, ' ').trim();
			const replySubject = safeSubject ? `Re: ${safeSubject}` : 'Processing your email';
			const replyBody =
				`Processing...\r\n\r\n` +
				`We received your email and will process it shortly.\r\n` +
				`(correlationId: ${correlationId})\r\n`;

			const replyRaw =
				`From: ${message.to}\r\n` +
				`To: ${message.from}\r\n` +
				`In-Reply-To: ${originalMessageId}\r\n` +
				`References: ${originalMessageId}\r\n` +
				`Subject: ${replySubject}\r\n` +
				`MIME-Version: 1.0\r\n` +
				`Date: ${new Date().toUTCString()}\r\n` +
				`Message-ID: <${correlationId}@${message.to.split('@')[1]}>\r\n` +
				`Content-Type: text/plain; charset=utf-8\r\n` +
				`\r\n` +
				replyBody;

			await message.reply(new EmailMessage(message.to, message.from, replyRaw));

			console.log('[email-worker] processing reply sent', {
				correlationId,
				to: message.from,
			});
		} catch (err) {
			console.error('[email-worker] failed to send processing reply', { correlationId, err });
		}

		const s3 = new S3Client({
			region: env.AWS_REGION,
			credentials: {
				accessKeyId: env.AWS_ACCESS_KEY_ID,
				secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
			},
		});

		let raw: ArrayBuffer;
		let parsed;
		try {
			raw = await new Response(message.raw).arrayBuffer();
			parsed = await new PostalMime().parse(raw);
		} catch (err) {
			console.error('[email-worker] failed to parse email', { correlationId, err });
			throw err;
		}

		let attachmentUrls: string[] | undefined;

		if (parsed.attachments?.length) {
			console.log('[email-worker] attachments found', {
				correlationId,
				attachmentsCount: parsed.attachments.length,
			});

			attachmentUrls = await Promise.all(
				parsed.attachments.map(async (attachment, index) => {
					const key = `attachments/${crypto.randomUUID()}/${attachment.filename || 'unnamed'}`;
					console.log('[email-worker] uploading attachment', {
						correlationId,
						index,
						filename: attachment.filename || 'unnamed',
						s3Key: key,
					});

					await s3.send(
						new PutObjectCommand({
							Bucket: env.S3_BUCKET,
							Key: key,
							Body: attachment.content instanceof ArrayBuffer ? new Uint8Array(attachment.content) : attachment.content,
							ContentType: attachment.mimeType,
						}),
					);
					console.log('[email-worker] uploaded attachment', {
						correlationId,
						index,
						s3Key: key,
					});

					return `https://${env.S3_BUCKET}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
				}),
			);
		}

		console.log('[email-worker] email parsed; publishing event', {
			correlationId,
			hasAttachments: !!attachmentUrls?.length,
		});

		const event: EmailEvent = {
			from: parsed.from?.address?.toString() ?? '',
			html: parsed.html ?? undefined,
			text: parsed.text ?? undefined,
			attachmentsUrl: attachmentUrls,
		};

		await publishToRabbitMQ(env, event, correlationId);
	},
} satisfies ExportedHandler<Env>;

async function publishToRabbitMQ(env: Env, payload: EmailEvent, correlationId: string) {
	if (!env.RABBITMQ_URL) {
		throw new Error('RABBITMQ_URL is not configured');
	}

	const amqpUrl = new URL(env.RABBITMQ_URL);
	const auth = btoa(`${amqpUrl.username}:${amqpUrl.password}`);
	const vhost = encodeURIComponent(amqpUrl.pathname.slice(1) || '/');

	const apiUrl = `https://${amqpUrl.host}/api/exchanges/${vhost}/amq.default/publish`;

	console.log('[email-worker] publishing to RabbitMQ', {
		correlationId,
		host: amqpUrl.host,
		vhost: amqpUrl.pathname.slice(1) || '/',
		exchange: 'amq.default',
		routingKey: emailEvent,
	});

	const response = await fetch(apiUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Basic ${auth}`,
		},
		body: JSON.stringify({
			properties: { content_type: 'application/json' },
			routing_key: emailEvent,
			payload: JSON.stringify(payload),
			payload_encoding: 'string',
		}),
	});

	if (!response.ok) {
		let bodyText = '';
		try {
			bodyText = await response.text();
		} catch {
		}

		console.error('[email-worker] RabbitMQ publish failed', {
			correlationId,
			status: response.status,
			statusText: response.statusText,
			body: bodyText,
		});
		throw new Error(`RabbitMQ publish failed: ${response.status} ${response.statusText}`);
	}

	console.log('[email-worker] RabbitMQ publish ok', {
		correlationId,
		status: response.status,
	});
}
