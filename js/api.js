// External API Integration - ElectroMart
// Currency Exchange Rate API with Currency Selector

const API = {
    // Using ExchangeRate-API (free tier)
    EXCHANGE_API_URL: 'https://api.exchangerate-api.com/v4/latest/USD',

    // Cache duration (10 minutes)
    CACHE_DURATION: 10 * 60 * 1000,
    CACHE_KEY: 'electromart_exchange_rates',
    CURRENCY_KEY: 'electromart_selected_currency',

    // Available currencies
    currencies: {
        USD: { symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
        EUR: { symbol: '€', name: 'Euro', flag: '🇪🇺' },
        TRY: { symbol: '₺', name: 'Turkish Lira', flag: '🇹🇷' },
        GBP: { symbol: '£', name: 'British Pound', flag: '🇬🇧' },
        JPY: { symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
        CHF: { symbol: 'Fr', name: 'Swiss Franc', flag: '🇨🇭' },
        CAD: { symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
        AUD: { symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' }
    },

    // Get selected currency
    getSelectedCurrency() {
        return localStorage.getItem(this.CURRENCY_KEY) || 'USD';
    },

    // Set selected currency
    setSelectedCurrency(currency) {
        localStorage.setItem(this.CURRENCY_KEY, currency);
        this.updateAllPrices();
        this.updateCurrencyDisplay();
    },

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
        const currencyDisplay = document.getElementById('currencyDisplay');
        const selectedCurrency = this.getSelectedCurrency();
        const currencyInfo = this.currencies[selectedCurrency];

        if (currencyDisplay && currencyInfo) {
            currencyDisplay.innerHTML = `
                <span>${currencyInfo.flag}</span>
                <span class="rate">${selectedCurrency}</span>
                <span style="font-size: 0.75rem;">▼</span>
            `;
            currencyDisplay.style.cursor = 'pointer';
            currencyDisplay.title = 'Click to change currency';
        }
    },

    // Update currency display
    updateCurrencyDisplay() {
        const cached = this.getCachedRates();
        if (cached) {
            this.displayRates(cached);
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

    // Convert price from USD to selected currency
    convertPrice(usdAmount, toCurrency = null) {
        const currency = toCurrency || this.getSelectedCurrency();
        if (currency === 'USD') return usdAmount;

        const cached = this.getCachedRates();
        if (cached && cached.rates && cached.rates[currency]) {
            return usdAmount * cached.rates[currency];
        }
        return usdAmount;
    },

    // Format currency
    formatCurrency(amount, currency = null) {
        const curr = currency || this.getSelectedCurrency();
        const info = this.currencies[curr];
        const symbol = info ? info.symbol : '$';
        return `${symbol}${amount.toFixed(2)}`;
    },

    // Format price from USD
    formatPrice(usdAmount) {
        const converted = this.convertPrice(usdAmount);
        return this.formatCurrency(converted);
    },

    // Update all prices on the page
    updateAllPrices() {
        // Update product card prices
        document.querySelectorAll('.product-card-price .current').forEach(el => {
            const usdPrice = parseFloat(el.dataset.usdPrice || el.textContent.replace(/[^0-9.]/g, ''));
            if (!el.dataset.usdPrice) {
                el.dataset.usdPrice = usdPrice;
            }
            el.textContent = this.formatPrice(usdPrice);
        });

        // Update cart prices
        document.querySelectorAll('.cart-item-price').forEach(el => {
            const usdPrice = parseFloat(el.dataset.usdPrice || el.textContent.replace(/[^0-9.]/g, ''));
            if (!el.dataset.usdPrice) {
                el.dataset.usdPrice = usdPrice;
            }
            el.textContent = this.formatPrice(usdPrice);
        });

        // Update checkout prices
        ['checkoutSubtotal', 'checkoutTax', 'checkoutTotal', 'subtotal', 'tax', 'total'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const usdPrice = parseFloat(el.dataset.usdPrice || el.textContent.replace(/[^0-9.]/g, ''));
                if (!el.dataset.usdPrice) {
                    el.dataset.usdPrice = usdPrice;
                }
                el.textContent = this.formatPrice(usdPrice);
            }
        });

        // Update product detail price
        const productPrice = document.querySelector('.product-price');
        if (productPrice) {
            const usdPrice = parseFloat(productPrice.dataset.usdPrice || productPrice.textContent.replace(/[^0-9.]/g, ''));
            if (!productPrice.dataset.usdPrice) {
                productPrice.dataset.usdPrice = usdPrice;
            }
            productPrice.textContent = this.formatPrice(usdPrice);
        }
    },

    // Create currency selector modal
    createCurrencyModal() {
        // Remove existing modal
        const existing = document.getElementById('currencyModal');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'currencyModal';
        modal.innerHTML = `
            <div class="currency-modal-backdrop"></div>
            <div class="currency-modal-content">
                <div class="currency-modal-header">
                    <h3>💱 Select Currency</h3>
                    <button class="currency-modal-close">✕</button>
                </div>
                <div class="currency-modal-body">
                    ${Object.entries(this.currencies).map(([code, info]) => `
                        <button class="currency-option ${code === this.getSelectedCurrency() ? 'active' : ''}" data-currency="${code}">
                            <span class="currency-flag">${info.flag}</span>
                            <span class="currency-name">${info.name}</span>
                            <span class="currency-code">${code}</span>
                            <span class="currency-symbol">${info.symbol}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Add styles
        modal.style.cssText = `
            position: fixed;
            inset: 0;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
        `;

        document.body.appendChild(modal);

        // Add modal styles if not already added
        if (!document.getElementById('currencyModalStyles')) {
            const styles = document.createElement('style');
            styles.id = 'currencyModalStyles';
            styles.textContent = `
                .currency-modal-backdrop {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.7);
                    backdrop-filter: blur(4px);
                }
                .currency-modal-content {
                    position: relative;
                    background: var(--dark-lighter);
                    border-radius: var(--radius-xl);
                    width: 90%;
                    max-width: 400px;
                    max-height: 80vh;
                    overflow: hidden;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    animation: slideUp 0.3s ease;
                }
                .currency-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-5) var(--space-6);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .currency-modal-header h3 {
                    margin: 0;
                    font-size: var(--text-xl);
                }
                .currency-modal-close {
                    background: var(--gray-700);
                    border: none;
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-md);
                    color: var(--white);
                    cursor: pointer;
                    transition: var(--transition-base);
                }
                .currency-modal-close:hover {
                    background: var(--error);
                }
                .currency-modal-body {
                    padding: var(--space-4);
                    max-height: 400px;
                    overflow-y: auto;
                }
                .currency-option {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    width: 100%;
                    padding: var(--space-4);
                    background: var(--gray-800);
                    border: 2px solid transparent;
                    border-radius: var(--radius-lg);
                    color: var(--white);
                    cursor: pointer;
                    margin-bottom: var(--space-2);
                    transition: var(--transition-base);
                    text-align: left;
                }
                .currency-option:hover {
                    background: var(--gray-700);
                    border-color: var(--primary);
                }
                .currency-option.active {
                    background: rgba(0, 102, 204, 0.2);
                    border-color: var(--primary);
                }
                .currency-flag {
                    font-size: var(--text-2xl);
                }
                .currency-name {
                    flex: 1;
                    font-weight: 500;
                }
                .currency-code {
                    color: var(--gray-400);
                    font-size: var(--text-sm);
                }
                .currency-symbol {
                    font-weight: 700;
                    color: var(--secondary);
                    min-width: 30px;
                    text-align: right;
                }
            `;
            document.head.appendChild(styles);
        }

        // Event listeners
        modal.querySelector('.currency-modal-backdrop').addEventListener('click', () => modal.remove());
        modal.querySelector('.currency-modal-close').addEventListener('click', () => modal.remove());

        modal.querySelectorAll('.currency-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const currency = btn.dataset.currency;
                this.setSelectedCurrency(currency);
                modal.remove();
            });
        });
    },

    // Initialize on page load
    init() {
        // Don't initialize on login page
        const currencyDisplay = document.getElementById('currencyDisplay');
        if (!currencyDisplay) return;

        this.fetchExchangeRates();

        // Add click handler for currency display
        currencyDisplay.addEventListener('click', () => {
            this.createCurrencyModal();
        });

        // Refresh rates every 10 minutes
        setInterval(() => {
            this.fetchExchangeRates();
        }, this.CACHE_DURATION);

        // Initial price update after rates are loaded
        setTimeout(() => {
            this.updateAllPrices();
        }, 500);
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
