// Shop Page Functionality
const Shop = {
    currentFilters: {
        category: 'all',
        brand: 'all',
        minPrice: 0,
        maxPrice: 350,
        search: ''
    },

    // Initialize shop page
    init() {
        this.renderProducts();
        this.setupFilters();
        this.setupSearch();
    },

    // Filter products based on current filters
    getFilteredProducts() {
        return products.filter(product => {
            // Category filter
            if (this.currentFilters.category !== 'all' && product.category !== this.currentFilters.category) {
                return false;
            }

            // Brand filter
            if (this.currentFilters.brand !== 'all' && product.brand !== this.currentFilters.brand) {
                return false;
            }

            // Price filter
            if (product.price < this.currentFilters.minPrice || product.price > this.currentFilters.maxPrice) {
                return false;
            }

            // Search filter
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const searchFields = [
                    product.name,
                    product.brand,
                    product.category,
                    product.description,
                    product.color || '',
                    product.thickness || ''
                ].join(' ').toLowerCase();

                if (!searchFields.includes(searchTerm)) {
                    return false;
                }
            }

            return true;
        });
    },

    // Render products grid
    renderProducts(productsToRender = null) {
        const container = document.getElementById('products-grid');
        if (!container) return;

        const filteredProducts = productsToRender || this.getFilteredProducts();

        // Update product count
        const countEl = document.getElementById('product-count');
        if (countEl) {
            countEl.textContent = `${filteredProducts.length} products`;
        }

        if (filteredProducts.length === 0) {
            container.innerHTML = `
        <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 4rem;">
          <h3>No products found</h3>
          <p style="color: var(--gray-400);">Try adjusting your filters or search term.</p>
        </div>
      `;
            return;
        }

        container.innerHTML = filteredProducts.map(product => this.createProductCard(product)).join('');
    },

    // Create product card HTML
    createProductCard(product) {
        const badgeHTML = product.badge ? `<span class="product-card-badge badge-${product.badge}">${product.badge.toUpperCase()}</span>` : '';

        // Use API formatPrice if available, otherwise fallback to USD
        const formattedPrice = (typeof API !== 'undefined' && API.formatPrice)
            ? API.formatPrice(product.price)
            : `$${product.price.toFixed(2)}`;

        return `
      <article class="product-card" data-id="${product.id}">
        ${badgeHTML}
        <a href="product.html?id=${product.id}" class="product-card-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='https://placehold.co/400x400/2d2d44/ffffff?text=No+Image'">
        </a>
        <div class="product-card-actions">
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); addToCart(${product.id})">
            🛒 Add to Cart
          </button>
          <a href="product.html?id=${product.id}" class="btn btn-ghost btn-sm">
            View Details
          </a>
        </div>
        <div class="product-card-content">
          <span class="product-card-category">${product.category}</span>
          <h3 class="product-card-title">
            <a href="product.html?id=${product.id}">${product.name}</a>
          </h3>
          <div class="product-card-price">
            <span class="current" data-usd-price="${product.price}">${formattedPrice}</span>
            ${product.unit ? `<span style="color: var(--gray-500); font-size: 0.875rem;">/ ${product.unit}</span>` : ''}
          </div>
          <div class="product-card-footer">
            <div class="product-card-rating">
              ⭐ ${product.rating}
            </div>
            <span style="color: var(--gray-500); font-size: 0.75rem;">${product.stock} in stock</span>
          </div>
        </div>
      </article>
    `;
    },

    // Setup filter controls
    setupFilters() {
        // Category filters
        const categoryFilters = document.querySelectorAll('input[name="category"]');
        categoryFilters.forEach(input => {
            input.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.renderProducts();
            });
        });

        // Brand filters
        const brandFilters = document.querySelectorAll('input[name="brand"]');
        brandFilters.forEach(input => {
            input.addEventListener('change', (e) => {
                this.currentFilters.brand = e.target.value;
                this.renderProducts();
            });
        });

        // Price range
        const priceRange = document.getElementById('price-range');
        const priceValue = document.getElementById('price-value');
        if (priceRange) {
            priceRange.addEventListener('input', (e) => {
                this.currentFilters.maxPrice = parseInt(e.target.value);
                if (priceValue) priceValue.textContent = `$${e.target.value}`;
                this.renderProducts();
            });
        }
    },

    // Setup search functionality
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    this.currentFilters.search = e.target.value;
                    this.renderProducts();
                }, 300);
            });
        }
    },

    // Sort products
    sortProducts(sortBy) {
        let filtered = this.getFilteredProducts();

        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Default sorting by ID
                filtered.sort((a, b) => a.id - b.id);
        }

        this.renderProducts(filtered);
    }
};

// Render featured products on homepage
function renderFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    // Get popular and new products
    const featuredProducts = products
        .filter(p => p.badge === 'popular' || p.badge === 'new')
        .slice(0, 8);

    container.innerHTML = featuredProducts.map(product => Shop.createProductCard(product)).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on shop page
    if (document.getElementById('products-grid')) {
        Shop.init();
    }

    // Check if we're on homepage
    if (document.getElementById('featured-products')) {
        renderFeaturedProducts();
    }

    // Setup sort dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            Shop.sortProducts(e.target.value);
        });
    }
});

// Global addToCart function
function addToCart(productId) {
    Cart.addItem(productId, 1);
}
