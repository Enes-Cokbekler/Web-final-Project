// Cart Management - ElectroMart
// Handles localStorage cart operations

const Cart = {
    STORAGE_KEY: 'electromart_cart',

    // Get cart from localStorage
    getCart() {
        const cart = localStorage.getItem(this.STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    },

    // Save cart to localStorage
    saveCart(cart) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart));
        this.updateCartCount();
    },

    // Add item to cart
    addItem(productId, quantity = 1) {
        const cart = this.getCart();
        const product = products.find(p => p.id === productId);

        if (!product) {
            console.error('Product not found:', productId);
            return false;
        }

        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                unit: product.unit,
                quantity: quantity
            });
        }

        this.saveCart(cart);
        this.showNotification(`${product.name} added to cart!`);
        return true;
    },

    // Remove item from cart
    removeItem(productId) {
        let cart = this.getCart();
        cart = cart.filter(item => item.id !== productId);
        this.saveCart(cart);
    },

    // Update item quantity
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart(cart);
            }
        }
    },

    // Clear entire cart
    clearCart() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateCartCount();
    },

    // Get cart item count
    getItemCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Get cart subtotal
    getSubtotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Get tax amount (18% VAT)
    getTax() {
        return this.getSubtotal() * 0.18;
    },

    // Get total
    getTotal() {
        return this.getSubtotal() + this.getTax();
    },

    // Update cart count badge in header
    updateCartCount() {
        const countBadge = document.getElementById('cartCount');
        if (countBadge) {
            const count = this.getItemCount();
            countBadge.textContent = count;
            countBadge.style.display = count > 0 ? 'flex' : 'none';
        }
    },

    // Show notification toast
    showNotification(message) {
        // Remove existing notification
        const existing = document.querySelector('.cart-notification');
        if (existing) existing.remove();

        // Create notification
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <span>✓</span>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--success) 0%, #00a040 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(0, 200, 83, 0.3);
            z-index: 1000;
            animation: slideUp 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Render cart items on cart page
    renderCartPage() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        const cartSummary = document.getElementById('cartSummary');

        if (!cartItemsContainer) return;

        const cart = this.getCart();

        if (cart.length === 0) {
            cartItemsContainer.style.display = 'none';
            cartSummary.style.display = 'none';
            cartEmpty.style.display = 'block';
            return;
        }

        cartEmpty.style.display = 'none';
        cartItemsContainer.style.display = 'block';
        cartSummary.style.display = 'block';

        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/80x80/2d2d44/ffffff?text=Product'">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} / ${item.unit}</p>
                </div>
                <div class="cart-quantity">
                    <button onclick="Cart.updateQuantity(${item.id}, ${item.quantity - 1}); Cart.renderCartPage();" aria-label="Decrease">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="Cart.updateQuantity(${item.id}, ${item.quantity + 1}); Cart.renderCartPage();" aria-label="Increase">+</button>
                </div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="cart-item-remove" onclick="Cart.removeItem(${item.id}); Cart.renderCartPage();" aria-label="Remove">
                    ✕
                </button>
            </div>
        `).join('');

        // Update summary
        document.getElementById('subtotal').textContent = `$${this.getSubtotal().toFixed(2)}`;
        document.getElementById('tax').textContent = `$${this.getTax().toFixed(2)}`;
        document.getElementById('total').textContent = `$${this.getTotal().toFixed(2)}`;

        // Check login status for checkout
        const loginPrompt = document.getElementById('loginPrompt');
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (loginPrompt && checkoutBtn) {
            const user = Auth.getUser();
            if (!user) {
                loginPrompt.style.display = 'block';
                checkoutBtn.onclick = () => {
                    window.location.href = 'login.html';
                };
            } else {
                loginPrompt.style.display = 'none';
                checkoutBtn.onclick = () => {
                    alert('Thank you for your order! Order confirmation sent to ' + user.email);
                    Cart.clearCart();
                    Cart.renderCartPage();
                };
            }
        }
    }
};

// Add CSS for notifications animation
const cartStyles = document.createElement('style');
cartStyles.textContent = `
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; transform: translateY(-10px); }
    }
`;
document.head.appendChild(cartStyles);

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    Cart.updateCartCount();

    // If on cart page, render it
    if (document.getElementById('cartItems')) {
        Cart.renderCartPage();
    }
});
