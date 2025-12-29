// Main Application JavaScript
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initMobileMenu();
    initScrollEffects();
});

// Navigation functionality
function initNavigation() {
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('open');
            toggle.classList.toggle('active');

            // Animate hamburger
            const spans = toggle.querySelectorAll('span');
            if (menu.classList.contains('open')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('open');
                toggle.classList.remove('active');
                const spans = toggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking a link
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('open');
                toggle.classList.remove('active');
            });
        });
    }
}

// Scroll effects
function initScrollEffects() {
    const header = document.querySelector('.header');

    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Animate elements on scroll
    const animateOnScroll = document.querySelectorAll('.animate-on-scroll');

    if (animateOnScroll.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slideUp');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animateOnScroll.forEach(el => observer.observe(el));
    }
}

// Product detail page functionality
function initProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }

    const product = products.find(p => p.id === productId);

    if (!product) {
        window.location.href = 'shop.html';
        return;
    }

    // Update page content
    document.title = `${product.name} - ElectroMart`;

    const gallery = document.getElementById('product-gallery');
    const info = document.getElementById('product-info');

    if (gallery) {
        gallery.innerHTML = `<img src="${product.image}" alt="${product.name}" onerror="this.src='https://placehold.co/600x600/2d2d44/ffffff?text=No+Image'">`;
    }

    if (info) {
        info.innerHTML = `
      <h1>${product.name}</h1>
      <div class="product-meta">
        <span>Brand: ${product.brand}</span>
        <span>Category: ${product.category}</span>
        ${product.thickness ? `<span>Thickness: ${product.thickness}</span>` : ''}
        ${product.color ? `<span>Color: ${product.color}</span>` : ''}
      </div>
      <div class="product-price">$${product.price.toFixed(2)} <span style="font-size: 1rem; color: var(--gray-400);">/ ${product.unit || 'piece'}</span></div>
      <p class="product-description">${product.description}</p>
      <div class="product-actions">
        <div class="quantity-selector">
          <button onclick="decreaseQuantity()">−</button>
          <span id="quantity">1</span>
          <button onclick="increaseQuantity()">+</button>
        </div>
        <button class="btn btn-primary btn-lg" onclick="addToCartWithQuantity(${product.id})">
          Add to Cart
        </button>
      </div>
      <div class="product-specs">
        <h3>Specifications</h3>
        <div class="specs-list">
          <div class="spec-item">
            <span class="spec-label">Brand</span>
            <span class="spec-value">${product.brand}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Category</span>
            <span class="spec-value">${product.category}</span>
          </div>
          ${product.thickness ? `
            <div class="spec-item">
              <span class="spec-label">Thickness</span>
              <span class="spec-value">${product.thickness}</span>
            </div>
          ` : ''}
          ${product.color ? `
            <div class="spec-item">
              <span class="spec-label">Color</span>
              <span class="spec-value">${product.color}</span>
            </div>
          ` : ''}
          <div class="spec-item">
            <span class="spec-label">Stock</span>
            <span class="spec-value">${product.stock} ${product.unit || 'pieces'}</span>
          </div>
          <div class="spec-item">
            <span class="spec-label">Rating</span>
            <span class="spec-value">${'★'.repeat(Math.floor(product.rating))} ${product.rating}/5</span>
          </div>
        </div>
      </div>
    `;
    }

    // Render related products
    renderRelatedProducts(product);
}

// Quantity controls for product detail
let currentQuantity = 1;

function increaseQuantity() {
    currentQuantity++;
    document.getElementById('quantity').textContent = currentQuantity;
}

function decreaseQuantity() {
    if (currentQuantity > 1) {
        currentQuantity--;
        document.getElementById('quantity').textContent = currentQuantity;
    }
}

function addToCartWithQuantity(productId) {
    Cart.addItem(productId, currentQuantity);
    currentQuantity = 1;
    document.getElementById('quantity').textContent = 1;
}

// Render related products
function renderRelatedProducts(currentProduct) {
    const container = document.getElementById('related-products');
    if (!container) return;

    // Get products from same category or brand
    const related = products
        .filter(p => p.id !== currentProduct.id && (p.category === currentProduct.category || p.brand === currentProduct.brand))
        .slice(0, 4);

    container.innerHTML = related.map(product => Shop.createProductCard(product)).join('');
}

// Initialize product detail if on that page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-gallery')) {
        initProductDetail();
    }
});

// Toggle filter sidebar on mobile
function toggleFilters() {
    const sidebar = document.querySelector('.shop-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}
