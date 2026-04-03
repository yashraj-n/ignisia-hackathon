import { ChatOpenRouter } from "@langchain/openrouter";

export const flashLlm = new ChatOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  model: "google/gemini-2.5-flash-lite",
});
