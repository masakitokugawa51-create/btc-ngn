import { Platform } from "react-native";
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from "react-native-google-mobile-ads";
import {
  ADMOB_INTERSTITIAL_IOS,
  ADMOB_INTERSTITIAL_ANDROID,
  ADMOB_TEST_INTERSTITIAL_IOS,
  ADMOB_TEST_INTERSTITIAL_ANDROID,
} from "../constants/config";

// Use test IDs in development, real IDs in production
const IS_DEV = __DEV__;

const getInterstitialId = () => {
  if (IS_DEV) {
    return Platform.select({
      ios: ADMOB_TEST_INTERSTITIAL_IOS,
      android: ADMOB_TEST_INTERSTITIAL_ANDROID,
    });
  }
  return Platform.select({
    ios: ADMOB_INTERSTITIAL_IOS,
    android: ADMOB_INTERSTITIAL_ANDROID,
  });
};

class AdService {
  constructor() {
    this.interstitial = null;
    this.isLoaded = false;
    this.isLoading = false;
    this.tapCount = 0;
    this.adFrequency = 3; // Show ad every N taps
    this.onAdClosed = null;
  }

  /**
   * Initialize and preload interstitial ad
   */
  init() {
    this.loadInterstitial();
  }

  loadInterstitial() {
    if (this.isLoading) return;
    this.isLoading = true;

    try {
      const adUnitId = getInterstitialId();
      this.interstitial = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: true,
      });

      // Ad loaded successfully
      this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
        this.isLoaded = true;
        this.isLoading = false;
      });

      // Ad closed by user
      this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        this.isLoaded = false;
        this.isLoading = false;

        // Preload next ad immediately
        this.loadInterstitial();

        // Callback to resume app flow
        if (this.onAdClosed) {
          this.onAdClosed();
          this.onAdClosed = null;
        }
      });

      // Ad failed to load
      this.interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
        console.log("[AdService] Failed to load:", error.message);
        this.isLoaded = false;
        this.isLoading = false;

        // Retry after 30 seconds
        setTimeout(() => this.loadInterstitial(), 30000);
      });

      this.interstitial.load();
    } catch (error) {
      console.log("[AdService] Init error:", error.message);
      this.isLoading = false;
    }
  }

  /**
   * Call this on every field tap.
   * Returns true if ad was shown (caller should pause UI).
   * Returns false if no ad shown (continue normally).
   *
   * @param {Function} onClosed - callback when ad is dismissed
   */
  onFieldTap(onClosed) {
    this.tapCount += 1;

    if (this.tapCount % this.adFrequency !== 0) {
      return false; // No ad this tap
    }

    if (!this.isLoaded || !this.interstitial) {
      // Ad not ready, skip this time
      return false;
    }

    this.onAdClosed = onClosed;

    try {
      this.interstitial.show();
      return true;
    } catch (error) {
      console.log("[AdService] Show error:", error.message);
      return false;
    }
  }

  /**
   * Reset tap counter (e.g., when user subscribes to premium)
   */
  reset() {
    this.tapCount = 0;
  }

  /**
   * Destroy ad instance
   */
  destroy() {
    if (this.interstitial) {
      this.interstitial = null;
    }
    this.isLoaded = false;
    this.isLoading = false;
  }
}

// Singleton
export default new AdService();
