// Main Application - ElectroMart
// Handles page initialization, navigation, product rendering, filtering, and search

const App = {
    // Current filter state
    filters: {
        category: 'all',
        brand: 'all',
        thickness: [],
        maxPrice: 50,
        search: '',
        sort: 'default'
    },

    // Initialize application
    init() {
        this.initNavigation();
        this.initPage();
    },

    // Initialize mobile navigation
    initNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('open');
                navToggle.classList.toggle('active');
            });

            // Close menu on link click
            navMenu.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('open');
                    navToggle.classList.remove('active');
                });
            });
        }
    },

    // Initialize based on current page
    initPage() {
        const path = window.location.pathname;

        if (path.includes('shop.html')) {
            this.initShopPage();
        } else if (path.includes('product.html')) {
            this.initProductPage();
        } else if (path.includes('index.html') || path.endsWith('/')) {
            this.initHomePage();
        }
    },

    // =========== HOME PAGE ===========
    initHomePage() {
        this.renderFeaturedProducts();
        this.renderCategories();
    },

    renderFeaturedProducts() {
        const container = document.getElementById('featuredProducts');
        if (!container) return;

        // Get featured products (with badges or high rating)
        const featured = products
            .filter(p => p.badge || p.rating >= 4.8)
            .slice(0, 8);

        container.innerHTML = featured.map(product => this.createProductCard(product)).join('');
    },

    renderCategories() {
        const container = document.getElementById('categoriesGrid');
        if (!container) return;

        const categoryIcons = {
            cables: '🔌',
            breakers: '⚡',
            outlets: '🔲',
            switches: '💡',
            lighting: '💡',
            accessories: '🔧',
            tools: '🛠️'
        };

        const mainCategories = categories.filter(c => c.id !== 'all');

        container.innerHTML = mainCategories.map(cat => `
            <a href="shop.html?category=${cat.id}" class="feature-card">
                <div class="feature-icon">${categoryIcons[cat.id] || '📦'}</div>
                <h3>${cat.name}</h3>
                <p>${products.filter(p => p.category === cat.id).length} products</p>
            </a>
        `).join('');
    },

    // =========== SHOP PAGE ===========
    initShopPage() {
        this.initFilters();
        this.parseURLParams();
        this.renderProducts();
        this.setupEventListeners();
    },

    parseURLParams() {
        const params = new URLSearchParams(window.location.search);

        if (params.has('category')) {
            this.filters.category = params.get('category');
            const radio = document.querySelector(`input[name="category"][value="${this.filters.category}"]`);
            if (radio) radio.checked = true;
        }

        if (params.has('brand')) {
            this.filters.brand = params.get('brand');
            const radio = document.querySelector(`input[name="brand"][value="${this.filters.brand}"]`);
            if (radio) radio.checked = true;
        }

        if (params.has('search')) {
            this.filters.search = params.get('search');
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = this.filters.search;
        }
    },

    initFilters() {
        // Generate category filters
        const categoryContainer = document.getElementById('categoryFilters');
        if (categoryContainer) {
            categoryContainer.innerHTML = categories.map(cat => `
                <label class="filter-option">
                    <input type="radio" name="category" value="${cat.id}" ${cat.id === 'all' ? 'checked' : ''}>
                    <span>${cat.icon} ${cat.name}</span>
                </label>
            `).join('');
        }

        // Generate brand filters
        const brandContainer = document.getElementById('brandFilters');
        if (brandContainer) {
            brandContainer.innerHTML = brands.map(brand => `
                <label class="filter-option">
                    <input type="radio" name="brand" value="${brand.id}" ${brand.id === 'all' ? 'checked' : ''}>
                    <span>${brand.name}</span>
                </label>
            `).join('');
        }
    },

    setupEventListeners() {
        // Category filter
        document.querySelectorAll('input[name="category"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.renderProducts();
            });
        });

        // Brand filter
        document.querySelectorAll('input[name="brand"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filters.brand = e.target.value;
                this.renderProducts();
            });
        });

        // Thickness filter
        document.querySelectorAll('input[name="thickness"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.filters.thickness = Array.from(
                    document.querySelectorAll('input[name="thickness"]:checked')
                ).map(cb => cb.value);
                this.renderProducts();
            });
        });

        // Price range
        const priceRange = document.getElementById('priceRange');
        const maxPriceLabel = document.getElementById('maxPriceLabel');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                this.filters.maxPrice = parseFloat(e.target.value);
                maxPriceLabel.textContent = `$${this.filters.maxPrice}`;
                this.renderProducts();
            });
        }

        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.toLowerCase();
                this.renderProducts();
            });
        }

        // Sort
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.renderProducts();
            });
        }

        // Clear filters
        const clearBtn = document.getElementById('clearFilters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.filters = {
                    category: 'all',
                    brand: 'all',
                    thickness: [],
                    maxPrice: 50,
                    search: '',
                    sort: 'default'
                };

                // Reset UI
                document.querySelector('input[name="category"][value="all"]').checked = true;
                document.querySelector('input[name="brand"][value="all"]').checked = true;
                document.querySelectorAll('input[name="thickness"]').forEach(cb => cb.checked = false);
                document.getElementById('priceRange').value = 50;
                document.getElementById('maxPriceLabel').textContent = '$50';
                document.getElementById('searchInput').value = '';
                document.getElementById('sortSelect').value = 'default';

                this.renderProducts();
            });
        }

        // Mobile filter toggle
        const filterToggle = document.getElementById('filterToggle');
        const shopSidebar = document.getElementById('shopSidebar');
        if (filterToggle && shopSidebar) {
            filterToggle.addEventListener('click', () => {
                shopSidebar.classList.toggle('open');
            });
        }
    },

    getFilteredProducts() {
        let filtered = [...products];

        // Category filter
        if (this.filters.category !== 'all') {
            filtered = filtered.filter(p => p.category === this.filters.category);
        }

        // Brand filter
        if (this.filters.brand !== 'all') {
            filtered = filtered.filter(p => p.brand === this.filters.brand);
        }

        // Thickness filter
        if (this.filters.thickness.length > 0) {
            filtered = filtered.filter(p =>
                p.thickness && this.filters.thickness.includes(p.thickness)
            );
        }

        // Price filter
        filtered = filtered.filter(p => p.price <= this.filters.maxPrice);

        // Search filter
        if (this.filters.search) {
            const search = this.filters.search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(search) ||
                p.description.toLowerCase().includes(search) ||
                p.brand.toLowerCase().includes(search) ||
                p.category.toLowerCase().includes(search)
            );
        }

        // Sort
        switch (this.filters.sort) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
        }

        return filtered;
    },

    renderProducts() {
        const container = document.getElementById('productsGrid');
        const countSpan = document.getElementById('productCount');
        const noProducts = document.getElementById('noProducts');

        if (!container) return;

        const filtered = this.getFilteredProducts();

        countSpan.textContent = filtered.length;

        if (filtered.length === 0) {
            container.innerHTML = '';
            noProducts.style.display = 'block';
            return;
        }

        noProducts.style.display = 'none';
        container.innerHTML = filtered.map(product => this.createProductCard(product)).join('');
    },

    // =========== PRODUCT PAGE ===========
    initProductPage() {
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get('id'));

        if (!productId) {
            window.location.href = 'shop.html';
            return;
        }

        const product = products.find(p => p.id === productId);

        if (!product) {
            window.location.href = 'shop.html';
            return;
        }

        this.renderProductDetail(product);
        this.renderRelatedProducts(product);
        this.setupProductActions(product);
    },

    renderProductDetail(product) {
        // Update page title
        document.title = `${product.name} - ElectroMart`;
        document.getElementById('pageTitle').textContent = product.name;
        document.getElementById('breadcrumbProduct').textContent = product.name;

        // Product image
        const img = document.getElementById('productImage');
        img.src = product.image;
        img.alt = product.name;
        img.onerror = function () {
            this.src = 'https://placehold.co/400x400/2d2d44/ffffff?text=Product';
        };

        // Badge
        const badge = document.getElementById('productBadge');
        if (product.badge) {
            badge.textContent = product.badge.toUpperCase();
            badge.className = `product-card-badge badge-${product.badge}`;
            badge.style.display = 'inline-block';
        }

        // Info
        document.getElementById('productName').textContent = product.name;
        document.getElementById('productBrand').textContent = product.brand;
        document.getElementById('productCategory').textContent =
            categories.find(c => c.id === product.category)?.name || product.category;
        document.getElementById('productRating').textContent = `⭐ ${product.rating}`;
        document.getElementById('productPrice').textContent = `$${product.price.toFixed(2)} / ${product.unit}`;
        document.getElementById('productDescription').textContent = product.description;

        // Stock info
        const stockInfo = document.getElementById('stockInfo');
        if (product.stock > 0) {
            stockInfo.innerHTML = `✓ In Stock (${product.stock} ${product.unit}s available)`;
            stockInfo.style.color = 'var(--success)';
        } else {
            stockInfo.innerHTML = '✕ Out of Stock';
            stockInfo.style.color = 'var(--error)';
        }

        // Specifications
        const specsList = document.getElementById('specsList');
        const specs = [
            { label: 'Brand', value: product.brand },
            { label: 'Category', value: categories.find(c => c.id === product.category)?.name || product.category },
            { label: 'Unit', value: product.unit },
            { label: 'Rating', value: `${product.rating} / 5` }
        ];

        if (product.thickness) {
            specs.push({ label: 'Thickness', value: product.thickness });
        }
        if (product.color) {
            specs.push({ label: 'Color', value: product.color });
        }

        specsList.innerHTML = specs.map(spec => `
            <div class="spec-item">
                <span class="spec-label">${spec.label}</span>
                <span class="spec-value">${spec.value}</span>
            </div>
        `).join('');
    },

    setupProductActions(product) {
        let quantity = 1;
        const quantitySpan = document.getElementById('quantity');
        const decreaseBtn = document.getElementById('decreaseQty');
        const increaseBtn = document.getElementById('increaseQty');
        const addToCartBtn = document.getElementById('addToCartBtn');

        decreaseBtn.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantitySpan.textContent = quantity;
            }
        });

        increaseBtn.addEventListener('click', () => {
            if (quantity < product.stock) {
                quantity++;
                quantitySpan.textContent = quantity;
            }
        });

        addToCartBtn.addEventListener('click', () => {
            Cart.addItem(product.id, quantity);
        });
    },

    renderRelatedProducts(product) {
        const container = document.getElementById('relatedProducts');
        if (!container) return;

        // Get products from same category, excluding current
        const related = products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4);

        if (related.length === 0) {
            container.parentElement.style.display = 'none';
            return;
        }

        container.innerHTML = related.map(p => this.createProductCard(p)).join('');
    },

    // =========== SHARED ===========
    createProductCard(product) {
        const badgeHtml = product.badge
            ? `<span class="product-card-badge badge-${product.badge}">${product.badge.toUpperCase()}</span>`
            : '';

        return `
            <article class="product-card">
                ${badgeHtml}
                <a href="product.html?id=${product.id}" class="product-card-image">
                    <img src="${product.image}" alt="${product.name}" 
                         loading="lazy"
                         onerror="this.src='https://placehold.co/280x280/2d2d44/ffffff?text=Product'">
                </a>
                <div class="product-card-actions">
                    <button class="btn btn-primary btn-sm" onclick="event.preventDefault(); Cart.addItem(${product.id});">
                        🛒 Add
                    </button>
                    <a href="product.html?id=${product.id}" class="btn btn-ghost btn-sm">
                        View
                    </a>
                </div>
                <div class="product-card-content">
                    <span class="product-card-category">${product.category}</span>
                    <h3 class="product-card-title">
                        <a href="product.html?id=${product.id}">${product.name}</a>
                    </h3>
                    <div class="product-card-price">
                        <span class="current">$${product.price.toFixed(2)}</span>
                        <span style="color: var(--gray-500); font-size: var(--text-sm);">/ ${product.unit}</span>
                    </div>
                    <div class="product-card-footer">
                        <div class="product-card-rating">
                            ⭐ ${product.rating}
                        </div>
                        <span style="color: var(--gray-500); font-size: var(--text-xs);">
                            ${product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                        </span>
                    </div>
                </div>
            </article>
        `;
    }
};

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
