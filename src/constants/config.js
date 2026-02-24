// ─── AdMob IDs ───
// Replace with your actual AdMob IDs before publishing
export const ADMOB_APP_ID_IOS = "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX";
export const ADMOB_APP_ID_ANDROID = "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX";
export const ADMOB_INTERSTITIAL_IOS = "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX";
export const ADMOB_INTERSTITIAL_ANDROID = "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX";
export const ADMOB_BANNER_IOS = "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX";
export const ADMOB_BANNER_ANDROID = "ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX";

// Test IDs (use during development)
export const ADMOB_TEST_INTERSTITIAL_IOS = "ca-app-pub-3940256099942544/4411468910";
export const ADMOB_TEST_INTERSTITIAL_ANDROID = "ca-app-pub-3940256099942544/1033173712";
export const ADMOB_TEST_BANNER_IOS = "ca-app-pub-3940256099942544/2934735716";
export const ADMOB_TEST_BANNER_ANDROID = "ca-app-pub-3940256099942544/6300978111";

// ─── App Config ───
export const APP_CONFIG = {
  // How often to show interstitial ad (every N field taps)
  AD_FREQUENCY: 3,

  // CoinGecko API (free tier: 10-30 req/min)
  COINGECKO_API_BASE: "https://api.coingecko.com/api/v3",

  // Rate cache duration (ms) - 60 seconds for free users
  RATE_CACHE_FREE: 60 * 1000,
  // Rate cache duration (ms) - 10 seconds for premium
  RATE_CACHE_PREMIUM: 10 * 1000,

  // Rate update interval (ms) for live display
  RATE_POLL_INTERVAL: 15 * 1000,

  // Crypto pair config
  CRYPTO_ID: "bitcoin",      // CoinGecko ID
  CRYPTO_SYMBOL: "BTC",
  FIAT_CURRENCY: "ngn",      // CoinGecko currency code
  FIAT_SYMBOL: "NGN",
  FIAT_DISPLAY: "₦",

  // Subscription product IDs (App Store Connect / Google Play Console)
  SUBSCRIPTION_WEEKLY: "btc_ngn_premium_weekly",
  SUBSCRIPTION_YEARLY: "btc_ngn_premium_yearly",
};

// ─── Theme Colors ───
export const COLORS = {
  bg: "#0A0A0A",
  surface: "#1A1A1E",
  surfaceActive: "#222226",
  border: "#2A2A2E",
  borderActive: "#3A3A3E",
  text: "#FAFAFA",
  textDim: "#888892",
  textMuted: "#555560",

  // Bitcoin orange
  accent: "#F7931A",
  accentGlow: "rgba(247, 147, 26, 0.12)",
  accentBorder: "rgba(247, 147, 26, 0.25)",

  // Nigerian green
  ngGreen: "#008751",
  ngGreenGlow: "rgba(0, 135, 81, 0.10)",
  ngGreenBorder: "rgba(0, 135, 81, 0.25)",

  // Status
  green: "#00C853",
  greenDim: "rgba(0, 200, 83, 0.12)",
  red: "#FF3B30",
  redDim: "rgba(255, 59, 48, 0.12)",
};
