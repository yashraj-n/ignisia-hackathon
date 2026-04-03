import { ChatOpenAI } from "@langchain/openai";

export const flashLlm = new ChatOpenAI({
  apiKey: process.env.HUGGINGFACE_API_KEY,
  model: "google/gemma-4-31B-it:novita",
  configuration: {
    baseURL: "https://router.huggingface.co/v1",
  },
});
