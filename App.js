import React, { useState } from "react";
import ConverterScreen from "./src/screens/ConverterScreen";
import PaywallScreen from "./src/screens/PaywallScreen";

/**
 * BTC to NGN Converter
 *
 * Simple navigation between Converter and Paywall.
 * For production, replace with React Navigation:
 *   npx expo install @react-navigation/native @react-navigation/stack
 */
export default function App() {
  const [screen, setScreen] = useState("converter"); // converter | paywall
  const [isPremium, setIsPremium] = useState(false);

  if (screen === "paywall") {
    return (
      <PaywallScreen
        navigation={{
          goBack: () => setScreen("converter"),
        }}
        onPurchase={() => {
          setIsPremium(true);
          setScreen("converter");
        }}
      />
    );
  }

  return (
    <ConverterScreen
      navigation={{
        navigate: (name) => {
          if (name === "Paywall") setScreen("paywall");
        },
      }}
    />
  );
}
