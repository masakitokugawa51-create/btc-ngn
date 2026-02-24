# BTC to NGN Converter

Bitcoin to Nigerian Naira — simple converter app inspired by Adam Lyttle's "Pesos to Dollars Conversion" ($60K+ revenue).

## Setup

```bash
# 1. Install Expo CLI
npm install -g expo-cli

# 2. Create project from this template
npx create-expo-app btc-ngn-converter --template blank
cd btc-ngn-converter

# 3. Install dependencies
npx expo install expo-font
npx expo install react-native-google-mobile-ads  # AdMob
npx expo install expo-haptics                     # Tactile feedback
npx expo install @react-native-async-storage/async-storage  # Cache rates

# 4. Copy src/ folder into your project
# 5. Replace App.js with the one from this template

# 6. Run
npx expo start
```

## AdMob Setup

1. Create account at https://admob.google.com
2. Create iOS app → get App ID
3. Create Interstitial Ad Unit → get Ad Unit ID
4. Create Banner Ad Unit → get Ad Unit ID
5. Update `src/constants/config.js` with your IDs

## App Store Submission

- Category: **Finance** (or Travel)
- Age Rating: 4+
- Privacy: "Data Not Collected"
- Keywords: bitcoin, naira, converter, btc, ngn, nigeria, crypto, exchange rate

## Revenue Model

1. Interstitial ads on field tap (every 3rd tap)
2. Weekly subscription $4.99 (remove ads + live rates)
3. Yearly subscription $17.99
