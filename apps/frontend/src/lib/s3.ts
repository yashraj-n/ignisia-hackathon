const BUCKET = import.meta.env.VITE_S3_BUCKET ?? "ignisia-hackathon";
const REGION = import.meta.env.VITE_AWS_REGION ?? "ap-south-1";

export function publicFileUrl(ref: string): string | null {
  const s = ref.trim();
  if (!s) return null;
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const key = s.replace(/^\//, "");
  const encoded = key.split("/").map(encodeURIComponent).join("/");
  return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${encoded}`;
}
