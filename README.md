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
git clone https://github.com/Ayush3698/stellarpay
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




<img width="1907" height="800" alt="image" src="https://github.com/user-attachments/assets/5a4a238e-5b48-4d79-8c8e-009eff8bd8ef" />


<img width="1380" height="956" alt="image" src="https://github.com/user-attachments/assets/08ba15d3-4458-4ad2-a4d4-696976e07499" />

<img width="1327" height="988" alt="image" src="https://github.com/user-attachments/assets/a3b6fa07-7931-4e69-8edd-fe457f67db87" />


<img width="671" height="577" alt="image" src="https://github.com/user-attachments/assets/de5b14d6-5157-4a6b-8d1a-5056726f87e3" />


<img width="652" height="972" alt="image" src="https://github.com/user-attachments/assets/959f1837-6ba2-460d-8e2a-fcf0b13725f3" />


<img width="1122" height="957" alt="image" src="https://github.com/user-attachments/assets/72652d80-33ba-4cce-b873-d92985ae9055" />


<img width="724" height="615" alt="image" src="https://github.com/user-attachments/assets/3d089970-9879-4cee-a838-10bac6fa3c1b" />
