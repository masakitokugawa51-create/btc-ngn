# 量産ガイド — 通貨ペアごとにアプリを複製する方法

## 基本原理

このアプリは `src/constants/config.js` の設定を変えるだけで、
任意の仮想通貨×法定通貨ペアに対応できる。

---

## 新しいペアを作る手順（5分）

### 1. config.js を変更

```javascript
// BTC/NGN → BTC/TRY に変更する例
export const APP_CONFIG = {
  CRYPTO_ID: "bitcoin",        // CoinGecko ID（変更なし）
  CRYPTO_SYMBOL: "BTC",        // 表示名（変更なし）
  FIAT_CURRENCY: "try",        // ← "ngn" → "try" に変更
  FIAT_SYMBOL: "TRY",          // ← "NGN" → "TRY" に変更
  FIAT_DISPLAY: "₺",           // ← "₦" → "₺" に変更
  // ... 他はそのまま
};
```

### 2. ConverterScreen.js のアイコンを変更

```javascript
// NGN flag → TRY flag
<Text style={{ fontSize: 20 }}>🇹🇷</Text>  // ← 🇳🇬 → 🇹🇷
```

### 3. COLORS の ngGreen を変更（任意）

```javascript
// トルコ国旗の赤に変更
ngGreen: "#C8102E",  // Turkish red
```

### 4. app.json を変更

```json
{
  "name": "Bitcoin to Lira Conversion",
  "slug": "btc-try-converter",
  "ios": {
    "bundleIdentifier": "com.yourcompany.btctryconverter"
  },
  "android": {
    "package": "com.yourcompany.btctryconverter"
  }
}
```

### 5. 新しいAdMob Ad Unit IDを作成

各アプリごとに別のAd Unit IDが必要。
AdMobダッシュボードで新規作成 → config.jsに設定。

---

## 量産ロードマップ

| # | ペア | CoinGecko ID | 通貨コード | 国旗 | App Store名 |
|---|------|-------------|-----------|------|-------------|
| 1 | BTC/NGN | bitcoin | ngn | 🇳🇬 | Bitcoin to Naira Conversion |
| 2 | BTC/TRY | bitcoin | try | 🇹🇷 | Bitcoin to Lira Conversion |
| 3 | BTC/USD | bitcoin | usd | 🇺🇸 | Bitcoin to Dollar Conversion |
| 4 | SOL/USD | solana | usd | 🇺🇸 | Solana to Dollar Conversion |
| 5 | BTC/ARS | bitcoin | ars | 🇦🇷 | Bitcoin to Peso Conversion |
| 6 | ETH/NGN | ethereum | ngn | 🇳🇬 | Ethereum to Naira Conversion |
| 7 | BTC/PHP | bitcoin | php | 🇵🇭 | Bitcoin to Peso PH Conversion |
| 8 | BTC/BRL | bitcoin | brl | 🇧🇷 | Bitcoin to Real Conversion |
| 9 | SOL/JPY | solana | jpy | 🇯🇵 | Solana to Yen Conversion |
|10 | BTC/INR | bitcoin | inr | 🇮🇳 | Bitcoin to Rupee Conversion |

---

## CoinGecko 対応通貨ID一覧（よく使うもの）

| 仮想通貨 | CoinGecko ID |
|---------|-------------|
| Bitcoin | bitcoin |
| Ethereum | ethereum |
| Solana | solana |
| XRP | ripple |
| Dogecoin | dogecoin |
| BNB | binancecoin |
| Cardano | cardano |

## CoinGecko 対応法定通貨コード

ngn, try, usd, eur, gbp, jpy, ars, brl, php, inr, krw, 
idr, mxn, zar, aed, pkr, thb, vnd, egp, ...

完全リスト: https://api.coingecko.com/api/v3/simple/supported_vs_currencies

---

## App Store 最適化 (ASO) テンプレート

### タイトル
`[Crypto] to [Fiat] Conversion`

### サブタイトル
`[Crypto] [Fiat] Exchange Rate Calculator`

### キーワード（100文字以内）
`bitcoin,naira,converter,btc,ngn,nigeria,crypto,exchange,rate,calculator,currency`

### 説明文テンプレート
```
Looking to quickly convert [Crypto] to [Fiat]? 

[App Name] is the simplest way to convert between [Crypto] and [Fiat Currency Name].

✓ Real-time exchange rates
✓ Simple, easy-to-use interface  
✓ Works offline
✓ Lightning fast conversions

Perfect for traders, travelers, and anyone who needs quick [Crypto] to [Fiat] conversions.
```

---

## 収益の目安（Adam氏のデータから推計）

- Adam氏: 1アプリ（ペソ/ドル）で $60K累計 ≈ 約$2,500/月
- ナイジェリアのBTC需要はメキシコのペソ→ドル需要に匹敵
- 10アプリ量産 × 平均$500/月 = $5,000/月 のポテンシャル
- さらに SOL版 → solanasniperbot.net への導線で リファラル収入を追加
