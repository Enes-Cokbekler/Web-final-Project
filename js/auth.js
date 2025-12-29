// Authentication - ElectroMart
// Handles Google Sign-In and user session

const Auth = {
    STORAGE_KEY: 'electromart_user',
    GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // Replace with actual client ID

    // Get current user from localStorage
    getUser() {
        const user = localStorage.getItem(this.STORAGE_KEY);
        return user ? JSON.parse(user) : null;
    },

    // Save user to localStorage
    saveUser(user) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        this.updateUI();
    },

    // Sign out user
    signOut() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.updateUI();
        // Redirect to login page if on profile
        if (document.getElementById('userProfile')) {
            window.location.reload();
        }
    },

    // Initialize Google Sign-In
    initGoogleSignIn() {
        // Check if Google API is loaded
        if (typeof google !== 'undefined' && google.accounts) {
            google.accounts.id.initialize({
                client_id: this.GOOGLE_CLIENT_ID,
                callback: this.handleGoogleSignIn.bind(this)
            });

            // Render the Google button
            const googleDiv = document.getElementById('googleSignInDiv');
            if (googleDiv) {
                google.accounts.id.renderButton(googleDiv, {
                    theme: 'filled_black',
                    size: 'large',
                    width: 300
                });
            }
        }
    },

    // Handle Google Sign-In response
    handleGoogleSignIn(response) {
        // Decode the JWT token (in production, verify on server)
        const payload = this.parseJwt(response.credential);

        if (payload) {
            const user = {
                id: payload.sub,
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                provider: 'google',
                createdAt: new Date().toISOString()
            };

            this.saveUser(user);
            Cart.showNotification(`Welcome, ${user.name}!`);

            // Redirect to intended page or stay
            const redirect = sessionStorage.getItem('auth_redirect');
            if (redirect) {
                sessionStorage.removeItem('auth_redirect');
                window.location.href = redirect;
            } else {
                window.location.reload();
            }
        }
    },

    // Parse JWT token
    parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Failed to parse JWT:', e);
            return null;
        }
    },

    // Handle demo login (for testing without Google)
    demoLogin(email, password, name = null) {
        // Simple demo login for development
        const user = {
            id: 'demo_' + Date.now(),
            name: name || email.split('@')[0],
            email: email,
            picture: null,
            provider: 'email',
            createdAt: new Date().toISOString()
        };

        this.saveUser(user);
        Cart.showNotification(`Welcome, ${user.name}!`);
        return true;
    },

    // Update UI based on auth state
    updateUI() {
        const user = this.getUser();

        // Header elements
        const userArea = document.getElementById('userArea');
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');

        if (userArea && userAvatar && userName) {
            if (user) {
                if (user.picture) {
                    userAvatar.innerHTML = `<img src="${user.picture}" alt="${user.name}">`;
                } else {
                    userAvatar.innerHTML = user.name.charAt(0).toUpperCase();
                }
                userName.textContent = user.name.split(' ')[0];
            } else {
                userAvatar.innerHTML = '👤';
                userName.textContent = 'Login';
            }
        }

        // Login page elements
        const authCard = document.querySelector('.auth-card:not(#userProfile)');
        const userProfile = document.getElementById('userProfile');

        if (authCard && userProfile) {
            if (user) {
                authCard.style.display = 'none';
                userProfile.style.display = 'block';

                // Update profile info
                const profileName = document.getElementById('profileName');
                const profileEmail = document.getElementById('profileEmail');
                const profileAvatar = document.getElementById('profileAvatar');
                const memberSince = document.getElementById('memberSince');
                const profileCartCount = document.getElementById('profileCartCount');

                if (profileName) profileName.textContent = `Welcome, ${user.name}!`;
                if (profileEmail) profileEmail.textContent = user.email;
                if (profileAvatar) {
                    if (user.picture) {
                        profileAvatar.innerHTML = `<img src="${user.picture}" alt="${user.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
                    } else {
                        profileAvatar.innerHTML = user.name.charAt(0).toUpperCase();
                    }
                }
                if (memberSince) {
                    const date = new Date(user.createdAt);
                    memberSince.textContent = date.toLocaleDateString();
                }
                if (profileCartCount) {
                    profileCartCount.textContent = Cart.getItemCount();
                }
            } else {
                authCard.style.display = 'block';
                userProfile.style.display = 'none';
            }
        }
    },

    // Initialize auth on page load
    init() {
        this.updateUI();
        this.initGoogleSignIn();
        this.setupFormHandlers();
    },

    // Setup form event handlers
    setupFormHandlers() {
        // Auth tabs
        const tabs = document.querySelectorAll('.auth-tab');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                if (tab.dataset.tab === 'login') {
                    if (loginForm) loginForm.style.display = 'block';
                    if (registerForm) registerForm.style.display = 'none';
                } else {
                    if (loginForm) loginForm.style.display = 'none';
                    if (registerForm) registerForm.style.display = 'block';
                }
            });
        });

        // Login form
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;

                if (this.demoLogin(email, password)) {
                    window.location.reload();
                }
            });
        }

        // Register form
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('registerName').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;

                if (this.demoLogin(email, password, name)) {
                    window.location.reload();
                }
            });
        }

        // Sign out button
        const signOutBtn = document.getElementById('signOutBtn');
        if (signOutBtn) {
            signOutBtn.addEventListener('click', () => {
                this.signOut();
            });
        }

        // Custom Google button (fallback)
        const googleBtn = document.getElementById('googleSignInBtn');
        if (googleBtn) {
            googleBtn.addEventListener('click', () => {
                // For demo purposes, show notification
                alert('Google Sign-In requires a valid Google Client ID.\n\nFor testing, please use the email login below.');
            });
        }
    }
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
