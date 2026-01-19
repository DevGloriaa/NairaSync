let marketData = {
    btc: { price: 0, name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
    eth: { price: 0, name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
    usdt: { price: 0, name: 'Tether', symbol: 'USDT', icon: '₮' }
};

let selectedCrypto = 'btc';
let isLoading = false;
let lastUpdated = null;

const CORS_PROXIES = [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
];

const API_URL = 'https://www.quidax.com/api/v1/markets/tickers';

const DEMO_DATA = {
    "btcngn": { "ticker": { "last": "162500000.0" } },
    "ethngn": { "ticker": { "last": "4500200.0" } },
    "usdtngn": { "ticker": { "last": "1680.50" } }
};

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    fetchMarketData();
    setupEventListeners();
    setInterval(fetchMarketData, 60000);
}

function setupEventListeners() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            if (!isLoading) fetchMarketData();
        });
    }

    const nairaInput = document.getElementById('nairaInput');
    if (nairaInput) {
        nairaInput.addEventListener('input', calculateConversion);
    }

    const cryptoOptions = document.querySelectorAll('.crypto-option');
    cryptoOptions.forEach(option => {
        option.addEventListener('click', () => {
            cryptoOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            
            selectedCrypto = option.dataset.crypto;
            calculateConversion();
            updateRateDisplay();
        });
    });
}

async function fetchMarketData() {
    if (isLoading) return;

    isLoading = true;
    setLoadingState(true);

    let success = false;
    let lastError = null;

    for (const proxy of CORS_PROXIES) {
        try {
            const response = await fetch(proxy + encodeURIComponent(API_URL), {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const json = await response.json();

            if (json && json.data) {
                processMarketData(json.data);
                success = true;
                removeDemoWarning();
                break;
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            lastError = error;
            continue;
        }
    }

    if (!success) {
        processMarketData(DEMO_DATA);
        showDemoWarning(); 
    }

    isLoading = false;
    setLoadingState(false);
}

function processMarketData(data) {
    if (data['btcngn']?.ticker?.last) marketData.btc.price = parseFloat(data['btcngn'].ticker.last);
    if (data['ethngn']?.ticker?.last) marketData.eth.price = parseFloat(data['ethngn'].ticker.last);
    if (data['usdtngn']?.ticker?.last) marketData.usdt.price = parseFloat(data['usdtngn'].ticker.last);

    lastUpdated = new Date();

    updateMarketCards();
    updateHeroPrices();
    updateRateDisplay();
    updateLastUpdated();
    calculateConversion();
}

function updateMarketCards() {
    const grid = document.getElementById('marketGrid');
    if (!grid) return;

    grid.innerHTML = `
        ${createMarketCard(marketData.btc)}
        ${createMarketCard(marketData.eth)}
        ${createMarketCard(marketData.usdt)}
    `;
}

function createMarketCard(crypto) {
    const formattedPrice = formatCurrency(crypto.price);
    return `
        <div class="market-card">
            <div class="market-card-header">
                <div class="market-icon">${crypto.icon}</div>
                <div>
                    <div class="market-name">${crypto.name}</div>
                    <div class="market-pair">${crypto.symbol}/NGN</div>
                </div>
            </div>
            <div class="market-price">₦${formattedPrice}</div>
            <div class="market-change">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <circle cx="12" cy="12" r="10"></circle>
                </svg>
                Live Price
            </div>
        </div>
    `;
}

function updateHeroPrices() {
    const btcEl = document.getElementById('heroBtcPrice');
    const ethEl = document.getElementById('heroEthPrice');
    const usdtEl = document.getElementById('heroUsdtPrice');

    if (btcEl) btcEl.textContent = `₦${formatCurrency(marketData.btc.price)}`;
    if (ethEl) ethEl.textContent = `₦${formatCurrency(marketData.eth.price)}`;
    if (usdtEl) usdtEl.textContent = `₦${formatCurrency(marketData.usdt.price)}`;
}

function updateRateDisplay() {
    const rateEl = document.getElementById('currentRate');
    const currencyEl = document.getElementById('resultCurrency');

    if (rateEl) {
        const crypto = marketData[selectedCrypto];
        rateEl.textContent = `1 ${crypto.symbol} = ₦${formatCurrency(crypto.price)}`;
    }
    if (currencyEl) {
        currencyEl.textContent = marketData[selectedCrypto].symbol;
    }
}

function updateLastUpdated() {
    const el = document.getElementById('lastUpdated');
    if (el && lastUpdated) {
        const timeStr = lastUpdated.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
        el.textContent = `Last updated: ${timeStr}`;
    }
}

function calculateConversion() {
    const inputEl = document.getElementById('nairaInput');
    const resultEl = document.getElementById('cryptoResult');

    if (!inputEl || !resultEl) return;

    const nairaAmount = parseFloat(inputEl.value) || 0;
    const price = marketData[selectedCrypto].price;

    if (nairaAmount <= 0 || price === 0) {
        resultEl.textContent = '0.00000000';
        return;
    }

    const cryptoValue = (nairaAmount / price).toFixed(8);
    resultEl.textContent = cryptoValue;
}

function setLoadingState(loading) {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        if (loading) {
            refreshBtn.classList.add('loading');
            refreshBtn.textContent = "Updating...";
        } else {
            refreshBtn.classList.remove('loading');
            refreshBtn.textContent = "↻ Refresh Data";
        }
    }
}

function showDemoWarning() {
    if (document.getElementById('demo-warning')) return;

    const warning = document.createElement('div');
    warning.id = 'demo-warning';
    warning.innerHTML = "⚠️ Network blocked. Showing <b>Demo Data</b>.";
    warning.style.cssText = "background:#fff3cd; color:#856404; padding:10px; text-align:center; font-size:12px; border-bottom:1px solid #ffeeba;";
    document.body.prepend(warning);
}

function removeDemoWarning() {
    const warning = document.getElementById('demo-warning');
    if (warning) warning.remove();
}

function formatCurrency(amount) {
    if (!amount || amount === 0) return '0.00';
    return amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}