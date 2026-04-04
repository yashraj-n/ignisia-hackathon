const SERP_API_KEY = process.env.SERP_API_KEY || "";

type PricingResult = {
  median: number;
  min: number;
  max: number;
  count: number;
} | null;

export async function getMarketPrice(productName: string): Promise<PricingResult> {
  try {
    const url = new URL("https://serpapi.com/search");
    url.searchParams.append("engine", "google_shopping");
    url.searchParams.append("q", productName);
    url.searchParams.append("hl", "en");
    url.searchParams.append("gl", "in");
    url.searchParams.append("api_key", SERP_API_KEY);

    const response = await fetch(url.toString(), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`SerpApi responded with status: ${response.status}`);
    }

    const data = await response.json();
    const prices: number[] = [];

    // Extract from shopping_results
    if (data.shopping_results) {
      for (const item of data.shopping_results) {
        if (item.extracted_price) {
          prices.push(item.extracted_price);
        }
      }
    }

    // Extract from immersive_products (important)
    if (data.immersive_products) {
      for (const item of data.immersive_products) {
        if (item.extracted_price) {
          prices.push(item.extracted_price);
        }
      }
    }

    if (prices.length === 0) return null;

    // Remove outliers using IQR
    const cleanPrices = removeOutliers(prices);

    if (cleanPrices.length === 0) return null;

    const median = getMedian(cleanPrices);

    return {
      median,
      min: Math.min(...cleanPrices),
      max: Math.max(...cleanPrices),
      count: cleanPrices.length,
    };
  } catch (error) {
    console.error("SerpApi error:", error);
    return null;
  }
}

// 🔹 Median calculation
function getMedian(prices: number[]): number {
  const sorted = [...prices].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  } else {
    return sorted[mid];
  }
}

// 🔹 IQR-based outlier removal
function removeOutliers(prices: number[]): number[] {
  const sorted = [...prices].sort((a, b) => a - b);

  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;

  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  return sorted.filter((p) => p >= lowerBound && p <= upperBound);
}
