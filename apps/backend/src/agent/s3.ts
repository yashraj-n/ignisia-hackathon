import s3 from "../utils/s3-client";
import { extractText } from "unpdf";

export const IMAGE_MIMES: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
};

export const TEXT_EXTENSIONS = new Set(["txt", "csv", "json", "xml", "html", "htm", "md"]);

export type ContentPart =
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string } };

function objectKeyFromInput(input: string): string {
    const s = input.trim();
    if (s.startsWith("http://") || s.startsWith("https://")) {
        try {
            return new URL(s).pathname.replace(/^\//, "");
        } catch {
            return s.replace(/^\//, "");
        }
    }
    return s.replace(/^\//, "");
}

export async function readS3File(s3Url: string): Promise<ContentPart> {
    const key = objectKeyFromInput(s3Url);
    const ext = key.split(".").pop()?.toLowerCase() ?? "";
    const filename = key.split("/").pop() ?? "file";

    if (ext in IMAGE_MIMES) {
        const buf = await s3.file(key).arrayBuffer();
        const base64 = Buffer.from(buf).toString("base64");
        return { type: "image_url", image_url: { url: `data:${IMAGE_MIMES[ext]};base64,${base64}` } };
    }

    if (ext === "pdf") {
        const buf = await s3.file(key).arrayBuffer();
        const { text } = await extractText(new Uint8Array(buf));
        return { type: "text", text: `--- ${filename} ---\n${text}\n--- END ---` };
    }

    if (TEXT_EXTENSIONS.has(ext)) {
        const text = await s3.file(key).text();
        return { type: "text", text: `--- ${filename} ---\n${text}\n--- END ---` };
    }

    return { type: "text", text: `--- ${filename} ---\n[Unsupported file type: .${ext}]\n--- END ---` };
}
