const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendVerificationEmail(opts: {
  to: string;
  verificationUrl: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey) throw new Error("RESEND_API_KEY is missing");
  if (!from) throw new Error("RESEND_FROM_EMAIL is missing");

  const res = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: opts.to,
      subject: "Verify your company email",
      html: `<p>Thanks for signing up.</p><p>Please verify your email by clicking the link below:</p><p><a href="${opts.verificationUrl}">Verify</a></p>`,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend email send failed: ${res.status} ${text}`.trim());
  }
}

