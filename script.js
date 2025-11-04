// Product Data
const products = [
    {
        id: 1,
        name: "Elegant Summer Dress",
        category: "summer",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop",
        rating: 4.8,
        reviews: 124,
        sizes: ["XS", "S", "M", "L", "XL"],
        badge: "New",
        description: "Light and breezy summer dress perfect for warm days. Made with breathable cotton blend fabric."
    },
    {
        id: 2,
        name: "Classic Black Evening Gown",
        category: "evening",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=600&fit=crop",
        rating: 4.9,
        reviews: 89,
        sizes: ["S", "M", "L", "XL"],
        badge: "Bestseller",
        description: "Stunning evening gown with elegant silhouette. Perfect for formal occasions and special events."
    },
    {
        id: 3,
        name: "Floral Casual Dress",
        category: "casual",
        price: 69.99,
        image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=600&fit=crop",
        rating: 4.7,
        reviews: 156,
        sizes: ["XS", "S", "M", "L"],
        badge: "Sale",
        description: "Comfortable casual dress with beautiful floral pattern. Ideal for everyday wear and casual outings."
    },
    {
        id: 4,
        name: "Red Cocktail Dress",
        category: "evening",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1566174043783-d4e0c8b7f5f1?w=400&h=600&fit=crop",
        rating: 4.6,
        reviews: 78,
        sizes: ["S", "M", "L"],
        badge: "",
        description: "Eye-catching red cocktail dress that makes a statement. Perfect for parties and evening events."
    },
    {
        id: 5,
        name: "White Lace Formal Dress",
        category: "formal",
        price: 179.99,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop",
        rating: 4.9,
        reviews: 203,
        sizes: ["XS", "S", "M", "L", "XL"],
        badge: "New",
        description: "Elegant white lace dress with intricate detailing. Perfect for weddings and formal gatherings."
    },
    {
        id: 6,
        name: "Blue Midi Summer Dress",
        category: "summer",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=600&fit=crop",
        rating: 4.5,
        reviews: 92,
        sizes: ["S", "M", "L", "XL"],
        badge: "",
        description: "Charming blue midi dress perfect for summer adventures. Lightweight and comfortable all day long."
    },
    {
        id: 7,
        name: "Pink Casual Sundress",
        category: "casual",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400&h=600&fit=crop",
        rating: 4.7,
        reviews: 145,
        sizes: ["XS", "S", "M", "L"],
        badge: "Sale",
        description: "Sweet pink sundress with a relaxed fit. Great for casual days and weekend brunches."
    },
    {
        id: 8,
        name: "Navy Business Dress",
        category: "formal",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=600&fit=crop",
        rating: 4.8,
        reviews: 167,
        sizes: ["S", "M", "L", "XL"],
        badge: "",
        description: "Professional navy dress suitable for business meetings and office wear. Sophisticated and polished."
    },
    {
        id: 9,
        name: "Golden Evening Dress",
        category: "evening",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1566174053629-0f41f8b7d1f4?w=400&h=600&fit=crop",
        rating: 5.0,
        reviews: 234,
        sizes: ["XS", "S", "M", "L"],
        badge: "Bestseller",
        description: "Luxurious golden evening dress with shimmer. Make an unforgettable entrance at any gala event."
    },
    {
        id: 10,
        name: "Green Maxi Dress",
        category: "casual",
        price: 94.99,
        image: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=400&h=600&fit=crop",
        rating: 4.6,
        reviews: 118,
        sizes: ["S", "M", "L", "XL"],
        badge: "",
        description: "Flowing green maxi dress with elegant draping. Perfect for both casual and semi-formal occasions."
    },
    {
        id: 11,
        name: "Coral Beach Dress",
        category: "summer",
        price: 74.99,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=600&fit=crop",
        rating: 4.7,
        reviews: 89,
        sizes: ["XS", "S", "M", "L", "XL"],
        badge: "New",
        description: "Vibrant coral dress perfect for beach vacations and tropical getaways. Light and airy design."
    },
    {
        id: 12,
        name: "Burgundy Velvet Dress",
        category: "evening",
        price: 189.99,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop",
        rating: 4.9,
        reviews: 176,
        sizes: ["S", "M", "L"],
        badge: "",
        description: "Rich burgundy velvet dress with luxurious texture. Ideal for winter formal events and celebrations."
    }
];

// State Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let filteredProducts = [...products];
let currentCategory = 'all';
let maxPrice = 200;
let sortBy = 'featured';
let searchQuery = '';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    renderProducts();
    updateCartCount();
    updateWishlistCount();
    setupEventListeners();
    initLazyLoading();
    initTheme();
    initTestimonialCarousel();
}

// Event Listeners Setup
function setupEventListeners() {
    // Mobile menu toggle
    document.getElementById('mobile-menu-toggle').addEventListener('click', toggleMobileMenu);

    // Theme toggle
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Search
    document.getElementById('search-input').addEventListener('input', handleSearch);

    // Category filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleCategoryFilter);
    });

    // Price range
    document.getElementById('price-range').addEventListener('input', handlePriceFilter);

    // Sort
    document.getElementById('sort-select').addEventListener('change', handleSort);

    // Cart modal
    document.getElementById('cart-btn').addEventListener('click', openCartModal);
    document.getElementById('close-cart').addEventListener('click', closeCartModal);

    // Wishlist modal
    document.getElementById('wishlist-btn').addEventListener('click', openWishlistModal);
    document.getElementById('close-wishlist').addEventListener('click', closeWishlistModal);

    // Size guide
    document.getElementById('size-guide-btn').addEventListener('click', openSizeGuide);
    document.getElementById('close-size-guide').addEventListener('click', closeSizeGuide);

    // Quick view close
    document.getElementById('close-quickview').addEventListener('click', closeQuickView);

    // Newsletter form
    document.getElementById('newsletter-form').addEventListener('submit', handleNewsletterSubmit);

    // Contact form
    document.getElementById('contact-form').addEventListener('submit', handleContactSubmit);

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);

    // Scroll to top
    document.getElementById('scroll-top').addEventListener('click', scrollToTop);

    // Window scroll
    window.addEventListener('scroll', handleScroll);

    // Close modals on outside click
    window.addEventListener('click', handleOutsideClick);
}

// Mobile Menu
function toggleMobileMenu() {
    document.getElementById('nav-menu').classList.toggle('active');
}

// Theme Toggle
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-toggle i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Product Rendering
function renderProducts() {
    const grid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');

    if (filteredProducts.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-wrapper">
                <img src="${product.image}"
                     alt="${product.name}"
                     class="product-image"
                     data-src="${product.image}"
                     loading="lazy">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <div class="product-actions">
                    <button class="action-btn wishlist-toggle"
                            data-product-id="${product.id}"
                            title="Add to wishlist"
                            ${isInWishlist(product.id) ? 'class="action-btn wishlist-toggle active"' : ''}>
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn quick-view-btn"
                            data-product-id="${product.id}"
                            title="Quick view">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${renderStars(product.rating)}</span>
                    <span class="rating-count">(${product.reviews})</span>
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-sizes">
                    ${product.sizes.map(size => `<button class="size-btn" data-size="${size}">${size}</button>`).join('')}
                </div>
                <button class="add-to-cart-btn" data-product-id="${product.id}">
                    <i class="fas fa-shopping-bag"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join('');

    // Add event listeners to product cards
    attachProductEventListeners();
}

function attachProductEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId);
            const card = btn.closest('.product-card');
            const selectedSize = card.querySelector('.size-btn.active')?.dataset.size || 'M';
            addToCart(productId, selectedSize);
        });
    });

    // Size selection
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.product-card');
            card.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Wishlist toggle
    document.querySelectorAll('.wishlist-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId);
            toggleWishlist(productId);
        });
    });

    // Quick view
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const productId = parseInt(btn.dataset.productId);
            openQuickView(productId);
        });
    });
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// Filtering and Sorting
function handleCategoryFilter(e) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentCategory = e.target.dataset.category;
    applyFilters();
}

function handlePriceFilter(e) {
    maxPrice = parseInt(e.target.value);
    document.getElementById('price-value').textContent = maxPrice;
    applyFilters();
}

function handleSort(e) {
    sortBy = e.target.value;
    applyFilters();
}

function handleSearch(e) {
    searchQuery = e.target.value.toLowerCase();
    applyFilters();
}

function applyFilters() {
    showLoading();

    setTimeout(() => {
        filteredProducts = products.filter(product => {
            const categoryMatch = currentCategory === 'all' || product.category === currentCategory;
            const priceMatch = product.price <= maxPrice;
            const searchMatch = searchQuery === '' ||
                                product.name.toLowerCase().includes(searchQuery) ||
                                product.category.toLowerCase().includes(searchQuery);
            return categoryMatch && priceMatch && searchMatch;
        });

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Featured - original order
                break;
        }

        renderProducts();
        hideLoading();
    }, 300);
}

// Cart Functions
function addToCart(productId, size) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId && item.size === size);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            size,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    showNotification('Added to cart!');
}

function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    saveCart();
    updateCartCount();
    renderCart();
}

function updateQuantity(productId, size, change) {
    const item = cart.find(item => item.id === productId && item.size === size);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId, size);
        } else {
            saveCart();
            renderCart();
        }
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function openCartModal() {
    document.getElementById('cart-modal').classList.add('active');
    renderCart();
}

function closeCartModal() {
    document.getElementById('cart-modal').classList.remove('active');
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const emptyCart = document.getElementById('empty-cart');
    const cartTotal = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItems.style.display = 'none';
        emptyCart.style.display = 'block';
        cartTotal.textContent = '$0.00';
        return;
    }

    cartItems.style.display = 'block';
    emptyCart.style.display = 'none';

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-details">Size: ${item.size}</div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, '${item.size}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, '${item.size}', 1)">+</button>
                </div>
            </div>
            <div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id}, '${item.size}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    showNotification('Checkout feature coming soon!');
    closeCartModal();
}

// Wishlist Functions
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist!');
    }
    saveWishlist();
    updateWishlistCount();
    renderProducts();
}

function isInWishlist(productId) {
    return wishlist.includes(productId);
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function updateWishlistCount() {
    document.getElementById('wishlist-count').textContent = wishlist.length;
}

function openWishlistModal() {
    document.getElementById('wishlist-modal').classList.add('active');
    renderWishlist();
}

function closeWishlistModal() {
    document.getElementById('wishlist-modal').classList.remove('active');
}

function renderWishlist() {
    const wishlistItems = document.getElementById('wishlist-items');
    const emptyWishlist = document.getElementById('empty-wishlist');

    if (wishlist.length === 0) {
        wishlistItems.style.display = 'none';
        emptyWishlist.style.display = 'block';
        return;
    }

    wishlistItems.style.display = 'block';
    emptyWishlist.style.display = 'none';

    const wishlistProducts = products.filter(p => wishlist.includes(p.id));

    wishlistItems.innerHTML = wishlistProducts.map(item => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
            <div class="wishlist-item-info">
                <div class="wishlist-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <button class="btn btn-primary" onclick="addToCart(${item.id}, 'M')">
                    <i class="fas fa-shopping-bag"></i> Add to Cart
                </button>
            </div>
            <button class="remove-btn" onclick="toggleWishlist(${item.id}); renderWishlist();">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

// Quick View Modal
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('quickview-modal');
    const content = document.getElementById('quickview-content');

    content.innerHTML = `
        <div class="quickview-grid">
            <div>
                <img src="${product.image}" alt="${product.name}" class="quickview-image">
            </div>
            <div class="quickview-details">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${renderStars(product.rating)}</span>
                    <span class="rating-count">(${product.reviews} reviews)</span>
                </div>
                <div class="quickview-price">$${product.price.toFixed(2)}</div>
                <p class="quickview-description">${product.description}</p>
                <div class="filter-group">
                    <label>Select Size:</label>
                    <div class="product-sizes">
                        ${product.sizes.map(size => `<button class="size-btn" data-size="${size}">${size}</button>`).join('')}
                    </div>
                </div>
                <button class="btn btn-primary btn-block" onclick="addToCart(${product.id}, document.querySelector('#quickview-content .size-btn.active')?.dataset.size || 'M'); closeQuickView();">
                    <i class="fas fa-shopping-bag"></i> Add to Cart
                </button>
            </div>
        </div>
    `;

    // Add size selection listeners
    modal.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    modal.classList.add('active');
}

function closeQuickView() {
    document.getElementById('quickview-modal').classList.remove('active');
}

// Size Guide Modal
function openSizeGuide() {
    document.getElementById('size-guide-modal').classList.add('active');
}

function closeSizeGuide() {
    document.getElementById('size-guide-modal').classList.remove('active');
}

// Forms
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    const message = document.getElementById('newsletter-message');

    showLoading();
    setTimeout(() => {
        hideLoading();
        message.textContent = `Thank you for subscribing with ${email}!`;
        message.style.color = 'var(--success-color)';
        e.target.reset();

        setTimeout(() => {
            message.textContent = '';
        }, 3000);
    }, 1000);
}

function handleContactSubmit(e) {
    e.preventDefault();
    const message = document.getElementById('contact-message');

    showLoading();
    setTimeout(() => {
        hideLoading();
        message.textContent = 'Thank you for your message! We will get back to you soon.';
        message.style.color = 'var(--success-color)';
        e.target.reset();

        setTimeout(() => {
            message.textContent = '';
        }, 3000);
    }, 1000);
}

// Testimonial Carousel
let currentTestimonial = 0;

function initTestimonialCarousel() {
    document.getElementById('prev-testimonial').addEventListener('click', () => changeTestimonial(-1));
    document.getElementById('next-testimonial').addEventListener('click', () => changeTestimonial(1));

    // Auto-rotate testimonials
    setInterval(() => changeTestimonial(1), 5000);
}

function changeTestimonial(direction) {
    const testimonials = document.querySelectorAll('.testimonial');
    testimonials[currentTestimonial].classList.remove('active');

    currentTestimonial = (currentTestimonial + direction + testimonials.length) % testimonials.length;
    testimonials[currentTestimonial].classList.add('active');
}

// Lazy Loading
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        // Observe images after they're rendered
        setTimeout(() => {
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }, 100);
    }
}

// Scroll Functions
function handleScroll() {
    const scrollTop = document.getElementById('scroll-top');
    if (window.pageYOffset > 300) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Utility Functions
function showLoading() {
    document.getElementById('loading-overlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('active');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
        color: white;
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function handleOutsideClick(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
