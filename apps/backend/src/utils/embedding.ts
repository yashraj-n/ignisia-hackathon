import { InferenceClient } from "@huggingface/inference";

const MODEL = "sentence-transformers/all-MiniLM-L6-v2";

export async function generateEmbedding(text: string): Promise<number[]> {
  const token = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN;
  if (!token) {
    throw new Error("HUGGINGFACE_API_KEY environment variable is not set");
  }

  const client = new InferenceClient(token);

  const output = await client.featureExtraction({
    model: MODEL,
    inputs: text,
    provider: "hf-inference",
  });

  return output as unknown as number[];
}
