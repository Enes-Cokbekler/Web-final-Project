// External API Integration - ElectroMart
// Currency Exchange Rate API

const API = {
    // Using ExchangeRate-API (free tier)
    EXCHANGE_API_URL: 'https://api.exchangerate-api.com/v4/latest/USD',

    // Cache duration (10 minutes)
    CACHE_DURATION: 10 * 60 * 1000,
    CACHE_KEY: 'electromart_exchange_rates',

    // Fetch exchange rates
    async fetchExchangeRates() {
        try {
            // Check cache first
            const cached = this.getCachedRates();
            if (cached) {
                this.displayRates(cached);
                return cached;
            }

            // Fetch from API
            const response = await fetch(this.EXCHANGE_API_URL);

            if (!response.ok) {
                throw new Error('Failed to fetch exchange rates');
            }

            const data = await response.json();

            // Cache the results
            this.cacheRates(data);

            // Display rates
            this.displayRates(data);

            return data;
        } catch (error) {
            console.error('Exchange rate API error:', error);
            this.displayError();
            return null;
        }
    },

    // Get cached rates if still valid
    getCachedRates() {
        try {
            const cached = localStorage.getItem(this.CACHE_KEY);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            const now = Date.now();

            if (now - timestamp < this.CACHE_DURATION) {
                return data;
            }

            return null;
        } catch {
            return null;
        }
    },

    // Cache rates with timestamp
    cacheRates(data) {
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    },

    // Display rates in the header
    displayRates(data) {
        const rateElement = document.getElementById('usdRate');
        const currencyDisplay = document.getElementById('currencyDisplay');

        if (rateElement && data.rates) {
            // Show EUR rate
            const eurRate = data.rates.EUR;
            const tryRate = data.rates.TRY;

            rateElement.innerHTML = `
                <span title="1 USD = ${eurRate.toFixed(2)} EUR">€${eurRate.toFixed(2)}</span>
                <span style="color: var(--gray-500); margin: 0 4px;">|</span>
                <span title="1 USD = ${tryRate.toFixed(2)} TRY">₺${tryRate.toFixed(2)}</span>
            `;

            if (currencyDisplay) {
                currencyDisplay.style.opacity = '1';
                currencyDisplay.title = `Last updated: ${new Date(data.time_last_updated * 1000).toLocaleTimeString()}`;
            }
        }
    },

    // Display error state
    displayError() {
        const rateElement = document.getElementById('usdRate');
        if (rateElement) {
            rateElement.textContent = 'Unavailable';
            rateElement.style.opacity = '0.5';
        }
    },

    // Convert price from USD to another currency
    convertPrice(usdAmount, toCurrency = 'EUR') {
        const cached = this.getCachedRates();
        if (cached && cached.rates && cached.rates[toCurrency]) {
            return usdAmount * cached.rates[toCurrency];
        }
        return null;
    },

    // Format currency
    formatCurrency(amount, currency = 'USD') {
        const symbols = {
            USD: '$',
            EUR: '€',
            TRY: '₺',
            GBP: '£'
        };

        const symbol = symbols[currency] || currency + ' ';
        return `${symbol}${amount.toFixed(2)}`;
    },

    // Initialize on page load
    init() {
        // Don't fetch on login page
        if (!document.getElementById('currencyDisplay')) return;

        this.fetchExchangeRates();

        // Refresh rates every 10 minutes
        setInterval(() => {
            this.fetchExchangeRates();
        }, this.CACHE_DURATION);
    }
};

// Alternative: Cryptocurrency prices API (bonus feature)
const CryptoAPI = {
    API_URL: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',

    async fetchCryptoPrices() {
        try {
            const response = await fetch(this.API_URL);
            if (!response.ok) throw new Error('Failed to fetch crypto prices');

            const data = await response.json();
            return {
                bitcoin: data.bitcoin.usd,
                ethereum: data.ethereum.usd
            };
        } catch (error) {
            console.error('Crypto API error:', error);
            return null;
        }
    }
};

// Initialize API on page load
document.addEventListener('DOMContentLoaded', () => {
    API.init();
});
