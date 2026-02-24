import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import * as Haptics from "expo-haptics";
import { COLORS, APP_CONFIG } from "../constants/config";
import { useRate } from "../hooks/useRate";
import adService from "../services/adService";

const { CRYPTO_SYMBOL, FIAT_SYMBOL, FIAT_DISPLAY } = APP_CONFIG;

export default function ConverterScreen({ navigation }) {
  const [amount, setAmount] = useState("0");
  const [direction, setDirection] = useState("btc"); // btc | ngn
  const [isPremium, setIsPremium] = useState(false);
  const [scaleTop] = useState(new Animated.Value(1));
  const [scaleBottom] = useState(new Animated.Value(1));

  const { rate, direction: rateDir, change24h, lastUpdated, loading, offline } =
    useRate(isPremium);

  // Init ad service
  useEffect(() => {
    if (!isPremium) {
      adService.init();
    }
    return () => adService.destroy();
  }, [isPremium]);

  // ─── Conversion Logic ───
  const converted = useCallback(() => {
    const num = parseFloat(amount) || 0;
    if (rate === 0) return "0";

    if (direction === "btc") {
      const result = num * rate;
      if (result >= 1_000_000_000)
        return (result / 1_000_000_000).toFixed(2) + "B";
      if (result >= 1_000_000) return (result / 1_000_000).toFixed(2) + "M";
      return result.toLocaleString("en-US", { maximumFractionDigits: 0 });
    } else {
      const result = num / rate;
      return result.toFixed(8);
    }
  }, [amount, rate, direction]);

  // ─── Field Tap (triggers ad every N taps) ───
  const handleFieldTap = (field) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const scale = field === "btc" ? scaleTop : scaleBottom;
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.97,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    if (!isPremium) {
      const adShown = adService.onFieldTap(() => {
        // Ad closed callback - now switch field
        setDirection(field);
        setAmount("0");
      });

      if (adShown) return; // Wait for ad to close
    }

    setDirection(field);
    setAmount("0");
  };

  // ─── Numpad Input ───
  const handleKey = (key) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (key === "C") {
      setAmount("0");
      return;
    }
    if (key === "⌫") {
      setAmount((a) => (a.length <= 1 ? "0" : a.slice(0, -1)));
      return;
    }
    if (key === "." && amount.includes(".")) return;

    if (amount === "0" && key !== ".") {
      setAmount(key);
    } else if (amount.length < 15) {
      setAmount(amount + key);
    }
  };

  // ─── Swap Direction ───
  const handleSwap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setDirection((d) => (d === "btc" ? "ngn" : "btc"));
    setAmount("0");
  };

  // ─── Format Helpers ───
  const formatRate = (r) => {
    if (!r) return "Loading...";
    return FIAT_DISPLAY + r.toLocaleString("en-US");
  };

  const formatTime = (d) => {
    if (!d) return "--:--";
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  // ─── Render ───
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Premium Banner */}
      <TouchableOpacity
        onPress={() => navigation?.navigate?.("Paywall") || setIsPremium(!isPremium)}
        style={[
          styles.premiumBanner,
          isPremium && {
            borderColor: "rgba(0,200,83,0.2)",
            backgroundColor: COLORS.greenDim,
          },
        ]}
      >
        <Text style={{ fontSize: 14 }}>{isPremium ? "✅" : "🎁"}</Text>
        <Text
          style={[
            styles.premiumText,
            isPremium && { color: COLORS.green },
          ]}
        >
          {isPremium ? "Premium Active" : "Unlock Premium"}
        </Text>
      </TouchableOpacity>

      {/* Live Rate Bar */}
      <View style={styles.rateBar}>
        <Text style={styles.rateLabel}>1 BTC =</Text>
        <Text
          style={[
            styles.rateValue,
            {
              color:
                rateDir === "up"
                  ? COLORS.green
                  : rateDir === "down"
                  ? COLORS.red
                  : COLORS.text,
            },
          ]}
        >
          {rateDir === "up" ? "▲ " : rateDir === "down" ? "▼ " : ""}
          {formatRate(rate)}
        </Text>
        {change24h !== 0 && (
          <Text
            style={[
              styles.changeBadge,
              {
                color: change24h > 0 ? COLORS.green : COLORS.red,
                backgroundColor:
                  change24h > 0 ? COLORS.greenDim : COLORS.redDim,
              },
            ]}
          >
            {change24h > 0 ? "+" : ""}
            {change24h}%
          </Text>
        )}
      </View>

      {/* Currency Fields */}
      <View style={styles.fieldsWrapper}>
        {/* BTC Field */}
        <Animated.View style={{ transform: [{ scale: scaleTop }] }}>
          <TouchableOpacity
            onPress={() => handleFieldTap("btc")}
            activeOpacity={0.8}
            style={[
              styles.field,
              direction === "btc"
                ? {
                    borderColor: COLORS.accentBorder,
                    backgroundColor: COLORS.accentGlow,
                  }
                : {
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.surface,
                  },
            ]}
          >
            <View style={styles.fieldLeft}>
              <View style={styles.btcIcon}>
                <Text style={styles.btcIconText}>₿</Text>
              </View>
              <Text style={styles.currencyLabel}>{CRYPTO_SYMBOL}</Text>
            </View>
            <Text
              style={[
                styles.fieldValue,
                {
                  color: direction === "btc" ? COLORS.text : COLORS.textDim,
                  fontSize: (direction === "btc" ? amount : converted()).length > 10 ? 22 : 28,
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {direction === "btc" ? amount : converted()}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Swap Button */}
        <TouchableOpacity onPress={handleSwap} style={styles.swapBtn}>
          <Text style={styles.swapIcon}>⇅</Text>
        </TouchableOpacity>

        {/* NGN Field */}
        <Animated.View style={{ transform: [{ scale: scaleBottom }] }}>
          <TouchableOpacity
            onPress={() => handleFieldTap("ngn")}
            activeOpacity={0.8}
            style={[
              styles.field,
              { marginTop: 10 },
              direction === "ngn"
                ? {
                    borderColor: COLORS.ngGreenBorder,
                    backgroundColor: COLORS.ngGreenGlow,
                  }
                : {
                    borderColor: COLORS.border,
                    backgroundColor: COLORS.surface,
                  },
            ]}
          >
            <View style={styles.fieldLeft}>
              <View style={styles.ngnIcon}>
                <Text style={{ fontSize: 20 }}>🇳🇬</Text>
              </View>
              <Text style={styles.currencyLabel}>{FIAT_SYMBOL}</Text>
            </View>
            <Text
              style={[
                styles.fieldValue,
                {
                  color: direction === "ngn" ? COLORS.text : COLORS.textDim,
                  fontSize: (direction === "ngn" ? amount : converted()).length > 10 ? 22 : 28,
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {direction === "ngn" ? amount : converted()}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Numpad */}
      <View style={styles.numpad}>
        {[
          ["1", "2", "3"],
          ["4", "5", "6"],
          ["7", "8", "9"],
          [".", "0", "C"],
        ].map((row, ri) => (
          <View key={ri} style={styles.numpadRow}>
            {row.map((key) => (
              <TouchableOpacity
                key={key}
                onPress={() => handleKey(key)}
                activeOpacity={0.6}
                style={[
                  styles.numKey,
                  key === "C" && { backgroundColor: COLORS.redDim },
                ]}
              >
                <Text
                  style={[
                    styles.numKeyText,
                    key === "C" && { color: COLORS.red },
                  ]}
                >
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <Text style={{ fontSize: 11 }}>🔄</Text>
          <Text style={styles.footerText}>
            {offline ? "Offline — " : ""}Last updated{" "}
            {formatTime(lastUpdated)}
          </Text>
        </View>
        {!isPremium && (
          <TouchableOpacity
            onPress={() =>
              navigation?.navigate?.("Paywall") || setIsPremium(true)
            }
          >
            <Text style={styles.footerCta}>
              Unlock premium for live exchange rates
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ───
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
  },
  premiumBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 8,
    backgroundColor: COLORS.accentGlow,
    borderWidth: 1,
    borderColor: COLORS.accentBorder,
    borderRadius: 20,
  },
  premiumText: {
    color: COLORS.accent,
    fontSize: 13,
    fontWeight: "600",
  },
  rateBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  rateLabel: {
    color: COLORS.textDim,
    fontSize: 12,
  },
  rateValue: {
    fontSize: 14,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  changeBadge: {
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  fieldsWrapper: {
    width: "100%",
    paddingHorizontal: 16,
    position: "relative",
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    borderWidth: 2,
  },
  fieldLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  btcIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F7931A",
    alignItems: "center",
    justifyContent: "center",
  },
  btcIconText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  ngnIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.ngGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  currencyLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  fieldValue: {
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
    fontVariant: ["tabular-nums"],
  },
  swapBtn: {
    position: "absolute",
    right: 28,
    top: "50%",
    marginTop: -22,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  swapIcon: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "700",
  },
  numpad: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
    justifyContent: "center",
  },
  numpadRow: {
    flexDirection: "row",
    gap: 10,
  },
  numKey: {
    flex: 1,
    height: 58,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  numKeyText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "500",
    fontVariant: ["tabular-nums"],
  },
  footer: {
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  footerCta: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: "500",
  },
});
