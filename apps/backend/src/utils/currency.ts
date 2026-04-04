import type { FastifyBaseLogger } from "fastify";

export async function fetchLiveExchangeRates(logger?: FastifyBaseLogger, baseCurrency: string = "INR"): Promise<Record<string, number> | undefined> {
  const apiKey = process.env.EXCHANGERATE_API_KEY;
  
  if (!apiKey || apiKey === "your_key_here") {
    if (logger) logger.error("EXCHANGERATE_API_KEY is missing or invalid in .env. Currency conversion aborted.");
    return undefined;
  }
  
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;

  try {
    const fxRes = await fetch(url);
    if (!fxRes.ok) {
      if (logger) logger.error(`ExchangeRate-API rejected the request. Status: ${fxRes.status}`);
      return undefined;
    }
    
    // Official documentation states the rates are returned under 'conversion_rates'
    const fxData = (await fxRes.json()) as { conversion_rates?: Record<string, number> };
    return fxData.conversion_rates;
  } catch (error) {
    if (logger) logger.error({ err: error }, "Exchange Rate Fetch Error");
    return undefined;
  }
}
