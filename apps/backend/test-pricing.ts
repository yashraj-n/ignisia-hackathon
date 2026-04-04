import { getMarketPrice } from "./src/utils/pricing";

async function run() {
  const product = "Sony WH-1000XM5 Headphones";
  console.log(`Fetching market price for '${product}'...`);
  const result = await getMarketPrice(product);
  console.log("Result:", result);
}

run();
