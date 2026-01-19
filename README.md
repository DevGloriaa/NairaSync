# NairaSync

**A lightweight, zero-latency cryptocurrency dashboard tailored for the Nigerian market.**


## 📖 Overview
NairaSync is a real-time market monitor designed to solve a specific pain point for Nigerian crypto traders: **accessing instant NGN rates without the bloat.** While full exchanges are great for trading, they are often too heavy for quick checks. NairaSync bridges this gap by providing a dedicated, always-on dashboard that fetches live ticker data directly from the **Quidax API**.

## ✨ Key Features

* **⚡ Real-Time Data Sync:** Fetches live market rates for `BTC/NGN`, `USDT/NGN`, and `ETH/NGN` every 60 seconds.
* **🛡️ Network Resilience Protocol (Smart Fallback):** Engineered with a robust error-handling system. If the live API is unreachable (e.g., due to strict corporate/school firewalls), the application gracefully degrades to **Demo Mode**, serving cached data to ensure the UI never breaks.
* **🧮 Instant Fiat Calculator:** Features a dynamic conversion tool that calculates BTC purchasing power instantly as the user types.
* **🎨 Quidax-Aligned UI:** Designed with a clean, professional aesthetic that mirrors the Quidax design system (Purple/White theme) for visual consistency.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+).
* **Data Source:** [Quidax API v1](https://docs.quidax.com/) (Public Tickers Endpoint).
* **Architecture:** Client-side only (No backend required).

## 🚀 How to Run Locally

This project is built to be lightweight and dependency-free. You do not need `npm` or `node_modules` to run it.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/DevGloriaa/NairaSync.git
    ```
2.  **Navigate to the folder:**
    ```bash
    cd nairasync
    ```
3.  **Launch:**
    * **Option A (Easiest):** Simply double-click `index.html` to open it in your browser.
    * **Option B (Pro):** Use "Live Server" in VS Code to run it on `http://127.0.0.1:5500`.

## 📡 API Integration Details

The application consumes the Quidax Public API. To bypass CORS restrictions on local development environments, it utilizes a proxy fallback strategy.

```javascript
// Example of the fetch logic used
const API_URL = '[https://www.quidax.com/api/v1/markets/tickers](https://www.quidax.com/api/v1/markets/tickers)';
// The app routes this through a CORS proxy to ensure reliable delivery
