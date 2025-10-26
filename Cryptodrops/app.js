// CryptoDrops Application JavaScript

// API Configuration
const API_URL = window.location.origin;

// Application Data (loaded from API)
let applicationData = {
    "airdrops": [],
    "stats": {
        "totalAirdrops": 0,
        "activeAirdrops": 0,
        "totalValueDistributed": "$0",
        "totalParticipants": "0",
        "successfulClaims": "0%"
    }
};

// Legacy sample data removed - all data now loaded from database via API
// To add airdrops, use the admin panel at /admin.html

// Application State
let currentPage = 'home';
let currentFilters = {
    search: '',
    blockchain: '',
    status: '',
    type: '',
    sort: 'newest'
};
let currentView = 'grid';
let currentPageNumber = 1;
const itemsPerPage = 12;
let bookmarkedAirdrops = JSON.parse(localStorage.getItem('bookmarkedAirdrops') || '[]');
let participatingAirdrops = JSON.parse(localStorage.getItem('participatingAirdrops') || '[]');

// DOM Elements
let elements = {};

// Initialize Application
// Load data from API
async function loadDataFromAPI() {
    try {
        const [airdropsResponse, statsResponse] = await Promise.all([
            fetch(`${API_URL}/api/airdrops`),
            fetch(`${API_URL}/api/stats`)
        ]);
        
        if (airdropsResponse.ok) {
            const airdrops = await airdropsResponse.json();
            applicationData.airdrops = airdrops;
        }
        
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            applicationData.stats = stats;
        }
    } catch (error) {
        console.error('Error loading data from API:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    initializeElements();
    initializeEventListeners();
    initializeAnimations();
    await loadDataFromAPI();
    loadHomePage();
    startFloatingAnimations();
});

// Initialize DOM Elements
function initializeElements() {
    elements = {
        // Navigation
        navLinks: document.querySelectorAll('.nav-link'),
        mobileMenuToggle: document.getElementById('mobileMenuToggle'),

        // Pages
        pages: document.querySelectorAll('.page'),

        // Search
        heroSearch: document.getElementById('heroSearch'),
        airdropSearch: document.getElementById('airdropSearch'),
        searchSuggestions: document.getElementById('searchSuggestions'),

        // Filters
        blockchainFilter: document.getElementById('blockchainFilter'),
        statusFilter: document.getElementById('statusFilter'),
        sortFilter: document.getElementById('sortFilter'),
        activeFilters: document.getElementById('activeFilters'),

        // Grids
        airdropsGrid: document.getElementById('airdropsGrid'),
        featuredCarousel: document.getElementById('featuredCarousel'),
        latestAirdropsList: document.getElementById('latestAirdropsList'),
        freeAirdropsList: document.getElementById('freeAirdropsList'),

        // Carousel
        carouselPrev: document.getElementById('carouselPrev'),
        carouselNext: document.getElementById('carouselNext'),

        // View toggle
        viewBtns: document.querySelectorAll('.view-btn'),

        // Pagination
        pagination: document.getElementById('pagination'),
        prevPage: document.getElementById('prevPage'),
        nextPage: document.getElementById('nextPage'),
        pageNumbers: document.getElementById('pageNumbers'),

        // Newsletter
        newsletterForm: document.getElementById('newsletterForm'),
        newsletterSuccess: document.getElementById('newsletterSuccess'),

        // Dashboard
        dashboardTabs: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        savedAirdrops: document.getElementById('savedAirdrops'),

        // Modal
        modal: document.getElementById('airdropModal'),
        modalBody: document.getElementById('modalBody'),
        modalClose: document.querySelector('.modal-close'),
        modalOverlay: document.querySelector('.modal-overlay'),

        // Toast
        toastContainer: document.getElementById('toastContainer'),

        // Stats
        activeAirdropsCount: document.getElementById('activeAirdropsCount')
    };
}

// Initialize Event Listeners
function initializeEventListeners() {
    // Navigation
    elements.navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });

    // Mobile menu toggle
    if (elements.mobileMenuToggle) {
        elements.mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Dropdown menu items
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', handleNavigation);
    });

    // Dropdown toggles
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = toggle.closest('.nav-dropdown');
            const isOpen = dropdown.classList.contains('active');
            
            // Close all dropdowns
            document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
            
            // Toggle current dropdown
            if (!isOpen) {
                dropdown.classList.add('active');
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
        }
    });

    // Search
    if (elements.heroSearch) {
        elements.heroSearch.addEventListener('input', debounce(handleSearch, 300));
    }
    if (elements.airdropSearch) {
        elements.airdropSearch.addEventListener('input', debounce(handleSearch, 300));
    }

    // Filters
    if (elements.blockchainFilter) {
        elements.blockchainFilter.addEventListener('change', handleFilterChange);
    }
    if (elements.statusFilter) {
        elements.statusFilter.addEventListener('change', handleFilterChange);
    }
    if (elements.sortFilter) {
        elements.sortFilter.addEventListener('change', handleFilterChange);
    }

    // View toggle
    elements.viewBtns.forEach(btn => {
        btn.addEventListener('click', handleViewToggle);
    });

    // Carousel
    if (elements.carouselPrev) {
        elements.carouselPrev.addEventListener('click', () => scrollCarousel(-1));
    }
    if (elements.carouselNext) {
        elements.carouselNext.addEventListener('click', () => scrollCarousel(1));
    }

    // Pagination
    if (elements.prevPage) {
        elements.prevPage.addEventListener('click', () => changePage(currentPageNumber - 1));
    }
    if (elements.nextPage) {
        elements.nextPage.addEventListener('click', () => changePage(currentPageNumber + 1));
    }

    // Newsletter
    if (elements.newsletterForm) {
        elements.newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    // Dashboard tabs
    elements.dashboardTabs.forEach(tab => {
        tab.addEventListener('click', handleTabChange);
    });

    // Modal
    if (elements.modalClose) {
        elements.modalClose.addEventListener('click', closeModal);
    }
    if (elements.modalOverlay) {
        elements.modalOverlay.addEventListener('click', closeModal);
    }

    // Global click handler for dynamic elements
    document.addEventListener('click', handleGlobalClick);
}

// Initialize Animations
function initializeAnimations() {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll('.hero-content, .section-header, .airdrop-card');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        },
        { threshold: 0.1 }
    );

    animatedElements.forEach(el => observer.observe(el));
}

// Start Floating Animations
function startFloatingAnimations() {
    const coins = document.querySelectorAll('.coin');

    coins.forEach((coin, index) => {
        // Add random movement
        setInterval(() => {
            const randomX = Math.random() * 20 - 10;
            const randomY = Math.random() * 20 - 10;
            coin.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`;
        }, 3000 + index * 500);
    });
}

// Navigation Handlers
function handleNavigation(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('#')) {
        const pageId = href.substring(1);
        navigateToPage(pageId);
        // Close mobile menu after navigation
        const navMenu = document.getElementById('navMenu');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    }
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.classList.toggle('active');
    }
}

function navigateToPage(pageId) {
    // Hide all pages
    elements.pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;

        // Update active nav link
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + pageId) {
                link.classList.add('active');
            }
        });

        // Load page-specific content
        loadPageContent(pageId);
    }
}

// Load page content based on page ID
function loadPageContent(pageId) {
    switch (pageId) {
        case 'home':
            loadHomePage();
            break;
        case 'airdrops':
            loadAirdropsPage();
            break;
        case 'dashboard':
            loadDashboard();
            break;
        case 'calendar':
            loadCalendar();
            break;
        case 'retroactive':
        case 'holders':
        case 'testnet':
        case 'social':
        case 'defi':
        case 'layer2':
        case 'solana':
        case 'telegram':
            loadCategoryPage(pageId);
            break;
        default:
            if (pageId.startsWith('airdrop-')) {
                const id = parseInt(pageId.split('-')[1]);
                loadAirdropDetail(id);
            }
            break;
    }
}

// Home Page
function loadHomePage() {
    loadFeaturedCarousel();
    animateActiveAirdropsCounter();
}

// Load Featured Carousel
function loadFeaturedCarousel() {
    if (!elements.featuredCarousel) return;

    const featuredAirdrops = applicationData.airdrops.filter(airdrop => airdrop.featured);

    elements.featuredCarousel.innerHTML = featuredAirdrops.map(airdrop => {
    const logoHtml = airdrop.logo && (airdrop.logo.startsWith('http://') || airdrop.logo.startsWith('https://') || airdrop.logo.startsWith('data:'))
        ? `<img src="${airdrop.logo}" alt="${airdrop.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">`
        : `<span style="font-size: 40px;">${airdrop.logo || '🎁'}</span>`;
    
    return `
    <div class="airdrop-card" onclick="showAirdropDetail(${airdrop.id})">
      <div class="card-header">
        <div class="project-logo">${logoHtml}</div>
        <div class="project-info">
          <h3>${airdrop.name}</h3>
          <div class="project-blockchain">${airdrop.blockchain}</div>
        </div>
      </div>

      <div class="card-badges">
        <span class="badge badge--${airdrop.status}">${airdrop.status.toUpperCase()}</span>
      </div>

      <div class="card-details">
        <div class="detail-row">
          <span class="detail-label">Est. Reward:</span>
          <span class="detail-value">${airdrop.estimatedReward}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Raise/Funds:</span>
          <span class="detail-value">${airdrop.totalValue || 'TBA'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Category</span>
          <span class="detail-value">${formatCategory(airdrop.category)}</span>
        </div>
      </div>
    </div>
  `;
  }).join('');
}

// Animate Active Airdrops Counter
function animateActiveAirdropsCounter() {
    if (!elements.activeAirdropsCount) return;

    const target = applicationData.stats.activeAirdrops;
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        elements.activeAirdropsCount.textContent = Math.floor(current);

        if (current >= target) {
            elements.activeAirdropsCount.textContent = target;
            clearInterval(timer);
        }
    }, 20);
}

// Airdrops Page
function loadAirdropsPage() {
    const filteredAirdrops = getFilteredAirdrops();
    renderAirdropGrid(filteredAirdrops);
    renderPagination(filteredAirdrops.length);
    renderLatestAirdrops();
    renderFreeAirdrops();
}

// Get filtered airdrops based on current filters
function getFilteredAirdrops() {
    let airdrops = [...applicationData.airdrops];

    // Apply search filter
    if (currentFilters.search) {
        const searchTerm = currentFilters.search.toLowerCase();
        airdrops = airdrops.filter(airdrop =>
            airdrop.name.toLowerCase().includes(searchTerm) ||
            airdrop.description.toLowerCase().includes(searchTerm) ||
            airdrop.blockchain.toLowerCase().includes(searchTerm)
        );
    }

    // Apply blockchain filter
    if (currentFilters.blockchain) {
        airdrops = airdrops.filter(airdrop =>
            airdrop.blockchain.toLowerCase() === currentFilters.blockchain.toLowerCase()
        );
    }

    // Apply status filter
    if (currentFilters.status) {
        airdrops = airdrops.filter(airdrop => airdrop.status === currentFilters.status);
    }

    // Apply sorting
    switch (currentFilters.sort) {
        case 'newest':
            airdrops.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            break;
        case 'ending':
            airdrops.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
            break;
        case 'rewards':
            airdrops.sort((a, b) => {
                const aMax = parseInt(a.estimatedReward.split('-')[1]?.replace(/[^0-9]/g, '') || '0');
                const bMax = parseInt(b.estimatedReward.split('-')[1]?.replace(/[^0-9]/g, '') || '0');
                return bMax - aMax;
            });
            break;
        case 'participants':
            airdrops.sort((a, b) => b.participants - a.participants);
            break;
    }

    return airdrops;
}

// Render airdrop grid
function renderAirdropGrid(airdrops) {
    if (!elements.airdropsGrid) return;

    const startIndex = (currentPageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageAirdrops = airdrops.slice(startIndex, endIndex);

    elements.airdropsGrid.className = `airdrops-grid ${currentView}-view`;

    if (pageAirdrops.length === 0) {
        elements.airdropsGrid.innerHTML = `
      <div class="empty-state">
        <h3>No airdrops found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    `;
        return;
    }

    elements.airdropsGrid.innerHTML = pageAirdrops.map(airdrop => createAirdropCard(airdrop)).join('');
}

// Create airdrop card HTML
function createAirdropCard(airdrop) {
    const logoHtml = airdrop.logo && (airdrop.logo.startsWith('http://') || airdrop.logo.startsWith('https://') || airdrop.logo.startsWith('data:'))
        ? `<img src="${airdrop.logo}" alt="${airdrop.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">`
        : `<span style="font-size: 40px;">${airdrop.logo || '🎁'}</span>`;
    
    return `
    <div class="airdrop-card" onclick="showAirdropDetail(${airdrop.id})">
      <div class="card-header">
        <div class="project-logo">${logoHtml}</div>
        <div class="project-info">
          <h3>${airdrop.name}</h3>
          <div class="project-blockchain">${airdrop.blockchain}</div>
        </div>
      </div>

      <div class="card-badges">
        <span class="badge badge--${airdrop.status}">${airdrop.status.toUpperCase()}</span>
        ${airdrop.ended ? '<span class="badge badge--ended">✓ ENDED</span>' : ''}
        ${airdrop.potential ? '<span class="badge badge--potential">✓ POTENTIAL</span>' : ''}
        ${airdrop.confirmed ? '<span class="badge badge--confirmed">✓ CONFIRMED</span>' : ''}
        ${getDifficultyBadge(airdrop.difficulty)}
      </div>

      <p class="card-description">${truncateText(airdrop.description, 100)}</p>
    </div>
  `;
}

// Pagination state for Latest and Free Airdrops
let latestAirdropsPage = 1;
let freeAirdropsPage = 1;
const ITEMS_PER_LIST_PAGE = 7;

// Get latest airdrops (filtered by isLatest flag from admin panel)
function getLatestAirdrops() {
    return [...applicationData.airdrops]
        .filter(airdrop => airdrop.isLatest);
}

// Get free airdrops (filtered by isFree flag from admin panel)
function getFreeAirdrops() {
    return [...applicationData.airdrops]
        .filter(airdrop => airdrop.isFree);
}

// Create list item HTML (Card style)
function createListItem(airdrop) {
    const logoHtml = airdrop.logo && (airdrop.logo.startsWith('http://') || airdrop.logo.startsWith('https://') || airdrop.logo.startsWith('data:'))
        ? `<img src="${airdrop.logo}" alt="${airdrop.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">`
        : `<span style="font-size: 40px;">${airdrop.logo || '🎁'}</span>`;
    
    const statusBadge = airdrop.status ? `<span class="badge badge--${airdrop.status}">${airdrop.status.toUpperCase()}</span>` : '';
    const confirmedBadge = airdrop.confirmed ? `<span class="badge badge--confirmed">✓ CONFIRMED</span>` : '';
    const potentialBadge = airdrop.potential ? `<span class="badge badge--potential">⭐ POTENTIAL</span>` : '';
    const verifiedBadge = airdrop.verified ? `<span class="badge badge--verified">✓ VERIFIED</span>` : '';
    
    const description = airdrop.description 
        ? (airdrop.description.length > 100 ? airdrop.description.substring(0, 100) + '...' : airdrop.description)
        : 'Complete the tasks to qualify for potential airdrops and rewards.';
    
    return `
        <div class="airdrop-card" onclick="showAirdropDetail(${airdrop.id})">
            <div class="card-header">
                <div class="project-logo">${logoHtml}</div>
                <div class="project-info">
                    <h3>${airdrop.name}</h3>
                    <div class="project-blockchain">${airdrop.blockchain}</div>
                </div>
            </div>

            <div class="card-badges">
                ${statusBadge}
                ${verifiedBadge}
                ${confirmedBadge}
                ${potentialBadge}
            </div>

            <p class="card-description">${description}</p>

            <div class="card-details">
                <div class="detail-row">
                    <span class="detail-label">Raise/Funds:</span>
                    <span class="detail-value">${airdrop.totalValue || 'TBA'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Est. Reward:</span>
                    <span class="detail-value">${airdrop.estimatedReward || 'TBA'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">End Date:</span>
                    <span class="detail-value">${airdrop.endDate || 'Ongoing'}</span>
                </div>
            </div>
        </div>
    `;
}

// Render latest airdrops list with pagination
function renderLatestAirdrops() {
    if (!elements.latestAirdropsList) return;
    
    const latestAirdrops = getLatestAirdrops();
    
    if (latestAirdrops.length === 0) {
        elements.latestAirdropsList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No latest airdrops available</p>';
        document.getElementById('latestPagination').innerHTML = '';
        return;
    }
    
    // Calculate pagination
    const startIndex = (latestAirdropsPage - 1) * ITEMS_PER_LIST_PAGE;
    const endIndex = startIndex + ITEMS_PER_LIST_PAGE;
    const pageAirdrops = latestAirdrops.slice(startIndex, endIndex);
    
    elements.latestAirdropsList.innerHTML = pageAirdrops.map(airdrop => createListItem(airdrop)).join('');
    renderListPagination('latest', latestAirdrops.length, latestAirdropsPage);
}

// Render free airdrops list with pagination
function renderFreeAirdrops() {
    if (!elements.freeAirdropsList) return;
    
    const freeAirdrops = getFreeAirdrops();
    
    if (freeAirdrops.length === 0) {
        elements.freeAirdropsList.innerHTML = '<p style="text-align: center; color: var(--color-text-secondary);">No free airdrops available</p>';
        document.getElementById('freePagination').innerHTML = '';
        return;
    }
    
    // Calculate pagination
    const startIndex = (freeAirdropsPage - 1) * ITEMS_PER_LIST_PAGE;
    const endIndex = startIndex + ITEMS_PER_LIST_PAGE;
    const pageAirdrops = freeAirdrops.slice(startIndex, endIndex);
    
    elements.freeAirdropsList.innerHTML = pageAirdrops.map(airdrop => createListItem(airdrop)).join('');
    renderListPagination('free', freeAirdrops.length, freeAirdropsPage);
}

// Render pagination for list sections
function renderListPagination(type, totalItems, currentPage) {
    const paginationElement = document.getElementById(type === 'latest' ? 'latestPagination' : 'freePagination');
    if (!paginationElement) return;
    
    const totalPages = Math.ceil(totalItems / ITEMS_PER_LIST_PAGE);
    
    if (totalPages <= 1) {
        paginationElement.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="page-numbers-list">';
    
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage ? 'active' : '';
        paginationHTML += `<button class="page-number ${activeClass}" onclick="changeListPage('${type}', ${i})">${i}</button>`;
    }
    
    paginationHTML += '</div>';
    paginationElement.innerHTML = paginationHTML;
}

// Change page for list sections
function changeListPage(type, page) {
    if (type === 'latest') {
        latestAirdropsPage = page;
        renderLatestAirdrops();
    } else if (type === 'free') {
        freeAirdropsPage = page;
        renderFreeAirdrops();
    }
    
    // Scroll to the top of the section
    const section = document.querySelector('.airdrop-lists-container');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Search Handler
function handleSearch(e) {
    currentFilters.search = e.target.value;
    currentPageNumber = 1;

    if (currentPage === 'airdrops') {
        loadAirdropsPage();
    } else if (e.target.id === 'heroSearch') {
        showSearchSuggestions(e.target.value);
    }

    updateActiveFilters();
}

// Show search suggestions
function showSearchSuggestions(query) {
    if (!elements.searchSuggestions || query.length < 2) {
        elements.searchSuggestions.style.display = 'none';
        return;
    }

    const suggestions = applicationData.airdrops
        .filter(airdrop =>
            airdrop.name.toLowerCase().includes(query.toLowerCase()) ||
            airdrop.blockchain.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5);

    if (suggestions.length === 0) {
        elements.searchSuggestions.style.display = 'none';
        return;
    }

    elements.searchSuggestions.innerHTML = suggestions
        .map(airdrop => `
      <div class="suggestion-item" onclick="selectSuggestion('${airdrop.name}')">
        ${airdrop.logo} ${airdrop.name} - ${airdrop.blockchain}
      </div>
    `).join('');

    elements.searchSuggestions.style.display = 'block';
}

// Select suggestion
function selectSuggestion(name) {
    elements.heroSearch.value = name;
    elements.searchSuggestions.style.display = 'none';
    navigateToPage('airdrops');
    currentFilters.search = name;
    loadAirdropsPage();
}

// Filter Handlers
function handleFilterChange(e) {
    const filterType = e.target.id.replace('Filter', '');
    currentFilters[filterType] = e.target.value;
    currentPageNumber = 1;

    loadAirdropsPage();
    updateActiveFilters();
}

// Update active filters display
function updateActiveFilters() {
    if (!elements.activeFilters) return;

    const activeFilters = [];

    if (currentFilters.search) {
        activeFilters.push({ type: 'search', label: `Search: "${currentFilters.search}"`, value: currentFilters.search });
    }
    if (currentFilters.blockchain) {
        activeFilters.push({ type: 'blockchain', label: `Blockchain: ${currentFilters.blockchain}`, value: currentFilters.blockchain });
    }
    if (currentFilters.status) {
        activeFilters.push({ type: 'status', label: `Status: ${currentFilters.status}`, value: currentFilters.status });
    }

    elements.activeFilters.innerHTML = activeFilters
        .map(filter => `
      <div class="filter-chip">
        ${filter.label}
        <button onclick="removeFilter('${filter.type}')">×</button>
      </div>
    `).join('');
}

// Remove filter
function removeFilter(type) {
    currentFilters[type] = '';

    // Update UI elements
    const filterElement = document.getElementById(type + 'Filter');
    if (filterElement) {
        filterElement.value = '';
    }

    if (type === 'search') {
        if (elements.heroSearch) elements.heroSearch.value = '';
        if (elements.airdropSearch) elements.airdropSearch.value = '';
    }

    currentPageNumber = 1;
    loadAirdropsPage();
    updateActiveFilters();
}

// View Toggle Handler
function handleViewToggle(e) {
    const view = e.target.getAttribute('data-view');
    currentView = view;

    elements.viewBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    loadAirdropsPage();
}

// Carousel Controls
function scrollCarousel(direction) {
    if (!elements.featuredCarousel) return;

    const scrollAmount = 340; // Card width + gap
    elements.featuredCarousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Pagination
function renderPagination(totalItems) {
    if (!elements.pagination) return;

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        elements.pagination.style.display = 'none';
        return;
    }

    elements.pagination.style.display = 'flex';

    // Previous button
    elements.prevPage.disabled = currentPageNumber === 1;

    // Next button
    elements.nextPage.disabled = currentPageNumber === totalPages;

    // Page numbers
    elements.pageNumbers.innerHTML = generatePageNumbers(currentPageNumber, totalPages);
}

function generatePageNumbers(current, total) {
    let pages = [];

    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            pages.push(i);
        }
    } else {
        pages = [1];

        if (current > 4) {
            pages.push('...');
        }

        const start = Math.max(2, current - 2);
        const end = Math.min(total - 1, current + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (current < total - 3) {
            pages.push('...');
        }

        pages.push(total);
    }

    return pages
        .map(page =>
            page === '...'
                ? '<span class="page-ellipsis">...</span>'
                : `<a href="#" class="page-number ${page === current ? 'active' : ''}" onclick="changePage(${page}); return false;">${page}</a>`
        ).join('');
}

function changePage(page) {
    currentPageNumber = page;
    loadAirdropsPage();

    // Scroll to top of grid
    if (elements.airdropsGrid) {
        elements.airdropsGrid.scrollIntoView({ behavior: 'smooth' });
    }
}

// Newsletter Submission
function handleNewsletterSubmit(e) {
    e.preventDefault();

    const email = e.target.querySelector('input[type="email"]').value;

    // Simulate API call
    setTimeout(() => {
        elements.newsletterForm.style.display = 'none';
        elements.newsletterSuccess.classList.remove('hidden');
        showToast('Successfully subscribed to newsletter!', 'success');
    }, 1000);
}

// Bookmark Functions
function toggleBookmark(airdropId) {
    const index = bookmarkedAirdrops.indexOf(airdropId);

    if (index > -1) {
        bookmarkedAirdrops.splice(index, 1);
        showToast('Airdrop removed from bookmarks', 'info');
    } else {
        bookmarkedAirdrops.push(airdropId);
        showToast('Airdrop bookmarked successfully!', 'success');
    }

    localStorage.setItem('bookmarkedAirdrops', JSON.stringify(bookmarkedAirdrops));

    // Update UI
    if (currentPage === 'airdrops') {
        loadAirdropsPage();
    } else if (currentPage === 'dashboard') {
        loadDashboard();
    }

    // Update featured carousel if on home page
    if (currentPage === 'home') {
        loadFeaturedCarousel();
    }
}

// Share Airdrop
function shareAirdrop(airdropId) {
    const airdrop = applicationData.airdrops.find(a => a.id === airdropId);
    if (!airdrop) return;

    const shareText = `Check out ${airdrop.name} airdrop on CryptoDrops! ${airdrop.estimatedReward} potential reward.`;
    const shareUrl = `${window.location.origin}#airdrop-${airdropId}`;

    if (navigator.share) {
        navigator.share({
            title: `${airdrop.name} Airdrop`,
            text: shareText,
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        showToast('Share link copied to clipboard!', 'success');
    }
}

// Airdrop Detail Modal
function showAirdropDetail(airdropId) {
    const airdrop = applicationData.airdrops.find(a => a.id === airdropId);
    if (!airdrop || !elements.modal) return;

    const detailLogoHtml = airdrop.logo && (airdrop.logo.startsWith('http://') || airdrop.logo.startsWith('https://') || airdrop.logo.startsWith('data:'))
        ? `<img src="${airdrop.logo}" alt="${airdrop.name}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 12px;">`
        : `<span style="font-size: 60px;">${airdrop.logo || '🎁'}</span>`;
    
    elements.modalBody.innerHTML = `
    <div class="airdrop-detail">
      <div class="detail-header">
        <div class="project-logo-large">${detailLogoHtml}</div>
        <div class="detail-title">
          <h1>${airdrop.name}</h1>
          <div class="detail-badges">
            <span class="badge badge--${airdrop.status}">${airdrop.status.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div class="detail-description">
        <p>${airdrop.description}</p>
      </div>

      <div class="detail-stats">
        <div class="stat-card">
          <h4>Raise/Funds</h4>
          <p class="stat-value">${airdrop.totalValue}</p>
        </div>
        <div class="stat-card">
          <h4>Est. Reward</h4>
          <p class="stat-value">${airdrop.estimatedReward}</p>
        </div>
        <div class="stat-card">
          <h4>Blockchain</h4>
          <p class="stat-value">${airdrop.blockchain}</p>
        </div>
        <div class="stat-card">
          <h4>Category</h4>
          <p class="stat-value">${formatCategory(airdrop.category)}</p>
        </div>
      </div>

${airdrop.airdropLink ? `
      <div class="detail-actions" style="margin: 24px 0; text-align: center;">
        <a href="${airdrop.airdropLink}" target="_blank" class="btn btn--primary" style="text-decoration: none; font-size: 20px; padding: 18px 40px; font-weight: 700;">
          🚀 Join Now
        </a>
      </div>
      ` : ''}

      <div class="detail-requirements">
        <h3>Step-by-Step Guide</h3>
        <div class="steps-guide">
          ${airdrop.requirements.map((req, index) => {
            // Check if it's new format (object with description and image) or old format (string)
            const isNewFormat = typeof req === 'object' && req.description;
            const description = isNewFormat ? req.description : req;
            const image = isNewFormat ? req.image : '';
            
            return `
            <div class="step-guide-item">
              <div class="step-header">
                <div class="step-number">Step ${index + 1}</div>
                <input type="checkbox" id="req-${index}" class="step-checkbox" />
              </div>
              <div class="step-content">
                <label for="req-${index}" class="step-description">${description}</label>
                ${image ? `<img src="${image}" alt="Step ${index + 1}" class="step-image" />` : ''}
              </div>
            </div>
            `;
          }).join('')}
        </div>
      </div>

      ${airdrop.website || airdrop.twitter || airdrop.discord || airdrop.telegram ? `
      <div class="detail-links">
        <h3>Official Links</h3>
        <div class="social-links">
          ${airdrop.website ? `<a href="${airdrop.website}" target="_blank" class="btn btn--outline">🌐 Website</a>` : ''}
          ${airdrop.twitter ? `<a href="${airdrop.twitter}" target="_blank" class="btn btn--outline">𝕏 Twitter</a>` : ''}
          ${airdrop.discord ? `<a href="${airdrop.discord}" target="_blank" class="btn btn--outline">🎮 Discord</a>` : ''}
          ${airdrop.telegram ? `<a href="${airdrop.telegram}" target="_blank" class="btn btn--outline">✈️ Telegram</a>` : ''}
        </div>
      </div>
      ` : ''}

      <div class="detail-actions">
        ${airdrop.airdropLink ? `
        <a href="${airdrop.airdropLink}" target="_blank" class="btn btn--primary btn--lg" style="text-decoration: none;">
          🚀 Join Now
        </a>
        ` : ''}
      </div>
    </div>
  `;

    elements.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close Modal
function closeModal() {
    if (elements.modal) {
        elements.modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Toggle Participation
function toggleParticipation(airdropId) {
    const index = participatingAirdrops.indexOf(airdropId);

    if (index > -1) {
        participatingAirdrops.splice(index, 1);
        showToast('Stopped participating in airdrop', 'info');
    } else {
        participatingAirdrops.push(airdropId);
        showToast('Started participating in airdrop!', 'success');
    }

    localStorage.setItem('participatingAirdrops', JSON.stringify(participatingAirdrops));

    // Update modal content
    showAirdropDetail(airdropId);
}

// Dashboard
function loadDashboard() {
    loadSavedAirdrops();
}

function handleTabChange(e) {
    const tab = e.target.getAttribute('data-tab');

    elements.dashboardTabs.forEach(t => t.classList.remove('active'));
    elements.tabContents.forEach(c => c.classList.remove('active'));

    e.target.classList.add('active');
    document.getElementById(tab + '-tab').classList.add('active');

    // Load content based on tab
    switch (tab) {
        case 'saved':
            loadSavedAirdrops();
            break;
        case 'participating':
            loadParticipatingAirdrops();
            break;
        case 'completed':
            loadCompletedAirdrops();
            break;
    }
}

function loadSavedAirdrops() {
    if (!elements.savedAirdrops) return;

    if (bookmarkedAirdrops.length === 0) {
        elements.savedAirdrops.innerHTML = '<p class="empty-state">No saved airdrops yet. Start exploring and bookmark interesting opportunities!</p>';
        return;
    }

    const savedAirdropData = applicationData.airdrops.filter(a => bookmarkedAirdrops.includes(a.id));

    elements.savedAirdrops.innerHTML = `
    <div class="dashboard-grid">
      ${savedAirdropData.map(airdrop => createAirdropCard(airdrop)).join('')}
    </div>
  `;
}

function loadParticipatingAirdrops() {
    const participatingTab = document.querySelector('#participating-tab .participating-airdrops');
    if (!participatingTab) return;

    if (participatingAirdrops.length === 0) {
        participatingTab.innerHTML = '<p class="empty-state">No active participations. Join some airdrops to track your progress here!</p>';
        return;
    }

    const participatingData = applicationData.airdrops.filter(a => participatingAirdrops.includes(a.id));

    participatingTab.innerHTML = `
    <div class="dashboard-grid">
      ${participatingData.map(airdrop => `
        <div class="participation-card">
          ${createAirdropCard(airdrop)}
          <div class="progress-section">
            <h4>Progress</h4>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${Math.floor(Math.random() * 80 + 20)}%"></div>
            </div>
            <p class="progress-text">3 of 5 requirements completed</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function loadCompletedAirdrops() {
    const completedTab = document.querySelector('#completed-tab .completed-airdrops');
    if (!completedTab) return;

    // For demo purposes, show ended airdrops as completed
    const completedData = applicationData.airdrops.filter(a => a.status === 'ended');

    if (completedData.length === 0) {
        completedTab.innerHTML = '<p class="empty-state">No completed airdrops yet. Keep participating to build your history!</p>';
        return;
    }

    completedTab.innerHTML = `
    <div class="dashboard-grid">
      ${completedData.slice(0, 3).map(airdrop => `
        <div class="completed-card">
          ${createAirdropCard(airdrop)}
          <div class="completion-info">
            <span class="status status--success">✅ Completed</span>
            <p class="reward-info">Estimated reward claimed: ${airdrop.estimatedReward.split('-')[0]}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Category Pages
function loadCategoryPage(categoryId) {
    const categoryMap = {
        'retroactive': 'retroactive',
        'holders': 'holder',
        'testnet': 'testnet',
        'social': 'social',
        'defi': 'defi',
        'layer2': 'layer2',
        'solana': 'solana',
        'telegram': 'telegram'
    };

    const filterType = categoryMap[categoryId];
    let filteredAirdrops = [];

    if (filterType) {
        if (categoryId === 'solana') {
            filteredAirdrops = applicationData.airdrops.filter(a => a.blockchain === 'Solana');
        } else if (categoryId === 'layer2') {
            filteredAirdrops = applicationData.airdrops.filter(a => a.category === 'Layer 2');
        } else if (categoryId === 'defi') {
            filteredAirdrops = applicationData.airdrops.filter(a => a.category === 'DeFi');
        } else if (categoryId === 'telegram') {
            filteredAirdrops = applicationData.airdrops.filter(a => a.blockchain === 'TON');
        } else {
            filteredAirdrops = applicationData.airdrops.filter(a => a.type === filterType);
        }
    }

    const gridElement = document.getElementById(categoryId + 'Grid');
    if (gridElement) {
        if (filteredAirdrops.length === 0) {
            gridElement.innerHTML = '<p class="empty-state">No airdrops found in this category.</p>';
        } else {
            gridElement.innerHTML = filteredAirdrops.map(airdrop => createAirdropCard(airdrop)).join('');
        }
    }
}

// Airdrop History
async function loadAirdropHistory() {
    const timeline = document.getElementById('airdropHistoryTimeline');
    if (!timeline) return;

    try {
        // Fetch all airdrops from the API
        const response = await fetch(`${API_URL}/api/airdrops`);
        const airdrops = await response.json();

        // Sort by end date (most recent first) and take ended airdrops
        const historicalAirdrops = airdrops
            .filter(a => a.status === 'ended' || a.endDate)
            .sort((a, b) => {
                const dateA = new Date(a.endDate || a.createdAt);
                const dateB = new Date(b.endDate || b.createdAt);
                return dateB - dateA;
            })
            .slice(0, 10); // Show top 10 historical airdrops

        if (historicalAirdrops.length === 0) {
            timeline.innerHTML = '<p class="empty-state">No historical airdrops yet. Check back soon!</p>';
            return;
        }

        timeline.innerHTML = historicalAirdrops.map(airdrop => {
            const year = new Date(airdrop.endDate || airdrop.createdAt).getFullYear();
            return `
                <div class="timeline-item">
                    <div class="timeline-date">${year}</div>
                    <h3>${airdrop.name}</h3>
                    <p>${airdrop.description}</p>
                    ${airdrop.totalValue ? `<p class="timeline-value">Raise/Funds: ${airdrop.totalValue}</p>` : ''}
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading airdrop history:', error);
        timeline.innerHTML = '<p class="empty-state">Unable to load airdrop history. Please try again later.</p>';
    }
}

// Calendar
function loadCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');

    if (!calendarGrid || !currentMonthElement) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // Update month display
    currentMonthElement.textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Generate calendar days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    let calendarHTML = '';

    // Day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        calendarHTML += `<div class="calendar-header">${day}</div>`;
    });

    // Previous month days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = startingDay - 1; i >= 0; i--) {
        calendarHTML += `
      <div class="calendar-day other-month">
        <div class="calendar-day-number">${prevMonthDays - i}</div>
      </div>
    `;
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const events = getAirdropEventsForDate(new Date(year, month, day));

        calendarHTML += `
      <div class="calendar-day">
        <div class="calendar-day-number">${day}</div>
        ${events.map(event => `
          <div class="calendar-event" title="${event.name}">
            ${event.name}
          </div>
        `).join('')}
      </div>
    `;
    }

    // Next month days
    const remainingDays = 42 - (startingDay + daysInMonth);
    for (let day = 1; day <= remainingDays; day++) {
        calendarHTML += `
      <div class="calendar-day other-month">
        <div class="calendar-day-number">${day}</div>
      </div>
    `;
    }

    calendarGrid.innerHTML = calendarHTML;
}

function getAirdropEventsForDate(date) {
    const dateStr = date.toISOString().split('T')[0];
    const events = [];

    applicationData.airdrops.forEach(airdrop => {
        if (airdrop.endDate === dateStr) {
            events.push({ name: airdrop.name + ' Ends', type: 'end' });
        }
        if (airdrop.startDate === dateStr) {
            events.push({ name: airdrop.name + ' Starts', type: 'start' });
        }
    });

    return events;
}

// Global Click Handler
function handleGlobalClick(e) {
    // Close search suggestions when clicking outside
    if (elements.searchSuggestions && !e.target.closest('.search-container')) {
        elements.searchSuggestions.style.display = 'none';
    }
}

// Toast Notifications
function showToast(message, type = 'info') {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;

    elements.toastContainer.appendChild(toast);

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Utility Functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function getDifficultyBadge(difficulty) {
    const badges = {
        easy: '<span class="badge badge--success">EASY</span>',
        medium: '<span class="badge badge--warning">MEDIUM</span>',
        hard: '<span class="badge badge--error">HARD</span>'
    };
    return badges[difficulty] || '';
}

function formatCategory(category) {
    const categories = {
        'retroactive': '🔄 Retroactive',
        'holders': '💎 Holders',
        'holder': '💎 Holders',
        'testnet': '🧪 Testnet',
        'social': '📱 Social',
        'defi': '🏦 DeFi',
        'layer2': '⚡ Layer 2',
        'solana': '◎ Solana',
        'telegram': '✈️ Telegram'
    };
    return categories[category?.toLowerCase()] || category;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function toggleFilters() {
    const filterControls = document.getElementById('filterControls');
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    
    if (filterControls) {
        filterControls.classList.toggle('active');
        
        // Update button text
        if (filterControls.classList.contains('active')) {
            filterToggleBtn.innerHTML = '<span class="filter-icon">🎛️</span><span class="filter-text">Hide Filters</span>';
        } else {
            filterToggleBtn.innerHTML = '<span class="filter-icon">🎛️</span><span class="filter-text">Filters</span>';
        }
    }
}

function toggleAccordion(header) {
    const accordionItem = header.parentElement;
    const content = accordionItem.querySelector('.accordion-content');
    const arrow = header.querySelector('.accordion-arrow');
    
    const isOpen = accordionItem.classList.contains('active');
    
    if (isOpen) {
        accordionItem.classList.remove('active');
        content.style.maxHeight = null;
        arrow.style.transform = 'rotate(0deg)';
    } else {
        accordionItem.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
        arrow.style.transform = 'rotate(180deg)';
    }
}

// Make functions globally available
window.navigateToPage = navigateToPage;
window.showAirdropDetail = showAirdropDetail;
window.toggleBookmark = toggleBookmark;
window.shareAirdrop = shareAirdrop;
window.toggleParticipation = toggleParticipation;
window.removeFilter = removeFilter;
window.changePage = changePage;
window.selectSuggestion = selectSuggestion;
window.toggleFilters = toggleFilters;
window.toggleAccordion = toggleAccordion;
window.changeListPage = changeListPage;
