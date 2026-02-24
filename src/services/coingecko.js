import AsyncStorage from "@react-native-async-storage/async-storage";
import { APP_CONFIG } from "../constants/config";

const { COINGECKO_API_BASE, CRYPTO_ID, FIAT_CURRENCY } = APP_CONFIG;

const CACHE_KEY = `@rate_${CRYPTO_ID}_${FIAT_CURRENCY}`;
const CACHE_TS_KEY = `@rate_ts_${CRYPTO_ID}_${FIAT_CURRENCY}`;

/**
 * Fetch current price from CoinGecko API
 * Free tier: 10-30 requests/minute, no API key needed
 *
 * Returns: { rate: number, change24h: number, lastUpdated: Date }
 */
export async function fetchRate(isPremium = false) {
  const cacheDuration = isPremium
    ? APP_CONFIG.RATE_CACHE_PREMIUM
    : APP_CONFIG.RATE_CACHE_FREE;

  // Check cache first
  try {
    const cachedTs = await AsyncStorage.getItem(CACHE_TS_KEY);
    if (cachedTs && Date.now() - parseInt(cachedTs) < cacheDuration) {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        return {
          rate: data.rate,
          change24h: data.change24h,
          lastUpdated: new Date(data.lastUpdated),
          fromCache: true,
        };
      }
    }
  } catch (e) {
    // Cache read failed, proceed to fetch
  }

  // Fetch from CoinGecko
  try {
    const url =
      `${COINGECKO_API_BASE}/simple/price` +
      `?ids=${CRYPTO_ID}` +
      `&vs_currencies=${FIAT_CURRENCY}` +
      `&include_24hr_change=true` +
      `&include_last_updated_at=true`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        // If you have a CoinGecko API key (Demo or Pro), add it here:
        // "x-cg-demo-api-key": "YOUR_API_KEY",
      },
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const json = await response.json();
    const coinData = json[CRYPTO_ID];

    if (!coinData) {
      throw new Error("No data returned from CoinGecko");
    }

    const rate = coinData[FIAT_CURRENCY];
    const change24h =
      coinData[`${FIAT_CURRENCY}_24h_change`] || 0;
    const lastUpdated = coinData.last_updated_at
      ? new Date(coinData.last_updated_at * 1000)
      : new Date();

    const result = {
      rate,
      change24h: Math.round(change24h * 100) / 100,
      lastUpdated,
      fromCache: false,
    };

    // Save to cache
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(result));
      await AsyncStorage.setItem(CACHE_TS_KEY, String(Date.now()));
    } catch (e) {
      // Cache write failed, not critical
    }

    return result;
  } catch (error) {
    // If fetch fails, try to return cached data (even if expired)
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const data = JSON.parse(cached);
        return {
          rate: data.rate,
          change24h: data.change24h,
          lastUpdated: new Date(data.lastUpdated),
          fromCache: true,
          offline: true,
        };
      }
    } catch (e) {
      // Nothing in cache either
    }

    // Absolute fallback: hardcoded approximate rate
    return {
      rate: 105_000_000,
      change24h: 0,
      lastUpdated: new Date(),
      fromCache: false,
      fallback: true,
    };
  }
}

/**
 * Get historical price data for mini chart (premium feature)
 * Returns array of { timestamp, price } for last 24h
 */
export async function fetchHistory24h() {
  try {
    const url =
      `${COINGECKO_API_BASE}/coins/${CRYPTO_ID}/market_chart` +
      `?vs_currency=${FIAT_CURRENCY}` +
      `&days=1`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const json = await response.json();
    return json.prices.map(([timestamp, price]) => ({
      timestamp,
      price,
    }));
  } catch (error) {
    return [];
  }
}
