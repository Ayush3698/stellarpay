# StellarPay ✦

A simple XLM payment dApp built on the **Stellar Testnet** using React + Vite.

Built for the **Stellar White Belt Level 1** challenge.

---

## Features

- 🔗 Connect / disconnect **Freighter wallet**
- 💰 Fetch and display **live XLM balance**
- 🚰 Fund account via **Friendbot** (free testnet XLM)
- 💸 **Send XLM** transactions with memo support
- ✅ Transaction feedback with hash + Stellar Expert link
- ⚠️ Full error handling and input validation

---

## Screenshots

> Add screenshots here after running the app:
> - Wallet connected state
> - Balance displayed
> - Successful testnet transaction
> - Transaction result shown to user

---

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Freighter Wallet](https://freighter.app) browser extension installed
- Freighter set to **Testnet** network

### Install & Run

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/stellarpay.git
cd stellarpay

# 2. Install dependencies
npm install

# 3. Start dev server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

> ⚠️ **Important:** Freighter only works on `http://` or `https://` URLs.  
> Always run via `npm run dev` — never open the HTML file directly.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Deploy (Free)

### Netlify
```bash
npm run build
# Drag the `dist/` folder to netlify.com/drop
```

### Vercel
```bash
npm install -g vercel
vercel
```

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| @stellar/stellar-sdk | Transaction building |
| @stellar/freighter-api | Wallet connection |
| Stellar Horizon Testnet | Blockchain API |

---

## Project Structure

```
stellarpay/
├── src/
│   ├── hooks/
│   │   ├── useWallet.js     # Freighter connect/disconnect/sign
│   │   └── useStellar.js    # Balance, fund, send payment
│   ├── App.jsx              # Main UI
│   ├── App.module.css       # Styles
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── vite.config.js
└── package.json
```

---

## License

MIT
