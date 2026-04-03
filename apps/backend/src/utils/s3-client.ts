import { S3Client } from "bun";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    bucket: process.env.S3_BUCKET,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default s3;