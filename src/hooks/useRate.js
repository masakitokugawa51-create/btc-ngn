import { useState, useEffect, useRef, useCallback } from "react";
import { fetchRate } from "../services/coingecko";
import { APP_CONFIG } from "../constants/config";

/**
 * Hook that polls CoinGecko for live BTC/NGN rate
 * @param {boolean} isPremium - Premium users get faster updates
 */
export function useRate(isPremium = false) {
  const [rate, setRate] = useState(0);
  const [prevRate, setPrevRate] = useState(0);
  const [change24h, setChange24h] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const intervalRef = useRef(null);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchRate(isPremium);
      setPrevRate((prev) => prev || data.rate);
      setRate((prev) => {
        if (prev !== 0) setPrevRate(prev);
        return data.rate;
      });
      setChange24h(data.change24h);
      setLastUpdated(data.lastUpdated);
      setOffline(!!data.offline);
      setLoading(false);
    } catch (error) {
      console.log("[useRate] Error:", error.message);
      setLoading(false);
    }
  }, [isPremium]);

  // Initial fetch
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Polling
  useEffect(() => {
    const interval = isPremium
      ? APP_CONFIG.RATE_CACHE_PREMIUM
      : APP_CONFIG.RATE_POLL_INTERVAL;

    intervalRef.current = setInterval(refresh, interval);
    return () => clearInterval(intervalRef.current);
  }, [refresh, isPremium]);

  const direction =
    rate > prevRate ? "up" : rate < prevRate ? "down" : "neutral";

  return {
    rate,
    prevRate,
    change24h,
    direction,
    lastUpdated,
    loading,
    offline,
    refresh,
  };
}
