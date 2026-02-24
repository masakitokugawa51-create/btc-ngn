import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import * as Haptics from "expo-haptics";
import { COLORS } from "../constants/config";

export default function PaywallScreen({ navigation, onPurchase }) {
  const [selectedPlan, setSelectedPlan] = useState("trial"); // trial | yearly

  const handlePurchase = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // TODO: Integrate with StoreKit / Google Play Billing
    // For now, just call callback
    if (onPurchase) onPurchase();
    if (navigation?.goBack) navigation.goBack();
  };

  const handleClose = () => {
    if (navigation?.goBack) navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Close */}
      <View style={styles.header}>
        <View style={{ width: 36 }} />
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Gift Icon */}
      <Text style={styles.giftEmoji}>🎁</Text>
      <Text style={styles.title}>Unlock Premium</Text>

      {/* Features */}
      <View style={styles.features}>
        {[
          ["💰", "Instantly convert BTC/NGN"],
          ["📡", "No internet connection required"],
          ["⚡", "Live conversion rates"],
          ["🚫", "Remove annoying purchase screens"],
        ].map(([emoji, text], i) => (
          <View key={i} style={styles.featureRow}>
            <Text style={styles.featureEmoji}>{emoji}</Text>
            <Text style={styles.featureText}>{text}</Text>
          </View>
        ))}
      </View>

      {/* Plan Cards */}
      <View style={styles.plans}>
        {/* Yearly */}
        <TouchableOpacity
          onPress={() => setSelectedPlan("yearly")}
          activeOpacity={0.8}
          style={[
            styles.planCard,
            selectedPlan === "yearly" && styles.planCardSelected,
          ]}
        >
          <View>
            <Text style={styles.planTitle}>Yearly Plan</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
              <Text style={styles.planOrigPrice}>$59.99</Text>
              <Text style={styles.planPrice}>$4.99/yr</Text>
            </View>
          </View>
          <View style={styles.saveBadge}>
            <Text style={styles.saveBadgeText}>SAVE 93%</Text>
          </View>
        </TouchableOpacity>

        {/* Weekly Trial */}
        <TouchableOpacity
          onPress={() => setSelectedPlan("trial")}
          activeOpacity={0.8}
          style={[
            styles.planCard,
            selectedPlan === "trial" && styles.planCardSelected,
          ]}
        >
          <View>
            <Text style={styles.planTitle}>3-Day Trial</Text>
            <Text style={styles.planSubtext}>then $4.99 per week</Text>
          </View>
          {selectedPlan === "trial" && (
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* CTA */}
      <TouchableOpacity
        onPress={handlePurchase}
        activeOpacity={0.85}
        style={styles.ctaButton}
      >
        <Text style={styles.ctaText}>
          {selectedPlan === "trial" ? "Try for Free" : "Subscribe"} →
        </Text>
      </TouchableOpacity>

      {/* Legal links */}
      <View style={styles.legalRow}>
        <TouchableOpacity>
          <Text style={styles.legalText}>Restore</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.legalText}>Terms of Use & Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      {/* Fine print */}
      <Text style={styles.finePrint}>
        Payment will be charged to your{" "}
        {Platform.OS === "ios" ? "Apple ID" : "Google Play"} account.
        Subscription automatically renews unless cancelled at least 24 hours
        before the end of the current period.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    color: COLORS.textDim,
    fontSize: 16,
    fontWeight: "600",
  },
  giftEmoji: {
    fontSize: 56,
    marginTop: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: "700",
    marginTop: 10,
  },
  features: {
    width: "100%",
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  featureEmoji: {
    fontSize: 22,
    marginRight: 14,
  },
  featureText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "500",
  },
  plans: {
    width: "100%",
    gap: 10,
  },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 14,
  },
  planCardSelected: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentGlow,
  },
  planTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
  },
  planOrigPrice: {
    color: COLORS.textMuted,
    fontSize: 14,
    textDecorationLine: "line-through",
  },
  planPrice: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  planSubtext: {
    color: COLORS.textDim,
    fontSize: 14,
    marginTop: 4,
  },
  saveBadge: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  saveBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  ctaButton: {
    width: "100%",
    paddingVertical: 18,
    marginTop: 28,
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: COLORS.accent,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: { elevation: 6 },
    }),
  },
  ctaText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  legalRow: {
    flexDirection: "row",
    gap: 20,
    marginTop: 16,
  },
  legalText: {
    color: COLORS.textMuted,
    fontSize: 12,
    textDecorationLine: "underline",
  },
  finePrint: {
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 20,
    lineHeight: 14,
  },
});
