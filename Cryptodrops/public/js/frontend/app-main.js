import { StateManager } from './modules/state-manager.js';
import { Router } from './modules/router.js';
import { ToastManager } from './modules/toast-manager.js';
import { ModalManager } from './modules/modal-manager.js';
import { PageLoader } from './modules/page-loader.js';
import { FilterManager } from './modules/filter-manager.js';
import { ApiService } from './modules/api.service.js';
import { Utils } from './modules/utils.js';

class CryptoDropsApp {
  constructor() {
    this.stateManager = new StateManager();
    this.toastManager = null;
    this.modalManager = null;
    this.pageLoader = null;
    this.filterManager = null;
    this.router = null;
    this.elements = {};
    this.carouselAnimationId = null;
    this.carouselPosition = 0;
    this.carouselSpeed = 0.3;
    this.manualScrollOffset = 0;
    this.pauseCarousel = false;
  }

  async init() {
    this.initializeElements();
    this.initializeManagers();
    this.initializeEventListeners();
    this.initializeAnimations();
    
    await this.loadDataFromAPI();
    
    this.pageLoader.loadPageContent('home');
    this.startFloatingAnimations();
    this.startCarouselAnimation();
    
    // Check for shared airdrop after a slight delay to ensure DOM is ready
    setTimeout(() => this.checkForSharedAirdrop(), 100);
  }

  checkForSharedAirdrop() {
    const hash = window.location.hash;
    console.log('[DEBUG] Checking for shared airdrop, hash:', hash);
    if (hash && hash.startsWith('#airdrop-')) {
      const airdropId = parseInt(hash.replace('#airdrop-', ''));
      console.log('[DEBUG] Found shared airdrop ID:', airdropId);
      if (!isNaN(airdropId)) {
        // Open the airdrop modal
        this.showAirdropDetail(airdropId);
        // Clean up the URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }

  initializeElements() {
    this.elements = {
      navLinks: document.querySelectorAll('.nav-link'),
      mobileMenuToggle: document.getElementById('mobileMenuToggle'),
      pages: document.querySelectorAll('.page'),
      heroSearch: document.getElementById('heroSearch'),
      airdropSearch: document.getElementById('airdropSearch'),
      searchSuggestions: document.getElementById('searchSuggestions'),
      categoryFilter: document.getElementById('categoryFilter'),
      statusFilter: document.getElementById('statusFilter'),
      sortFilter: document.getElementById('sortFilter'),
      filterToggleBtn: document.getElementById('filterToggleBtn'),
      activeFilters: document.getElementById('activeFilters'),
      airdropsGrid: document.getElementById('airdropsGrid'),
      featuredCarousel: document.getElementById('featuredCarousel'),
      carouselPrev: document.getElementById('carouselPrev'),
      carouselNext: document.getElementById('carouselNext'),
      viewBtns: document.querySelectorAll('.view-btn'),
      pagination: document.getElementById('pagination'),
      prevPage: document.getElementById('prevPage'),
      nextPage: document.getElementById('nextPage'),
      pageNumbers: document.getElementById('pageNumbers'),
      newsletterForm: document.getElementById('newsletterForm'),
      newsletterSuccess: document.getElementById('newsletterSuccess'),
      dashboardTabs: document.querySelectorAll('.tab-btn'),
      modal: document.getElementById('airdropModal'),
      modalBody: document.getElementById('modalBody'),
      modalClose: document.querySelector('.modal-close'),
      modalOverlay: document.querySelector('.modal-overlay'),
      toastContainer: document.getElementById('toastContainer'),
      exploreAllAirdropsBtn: document.getElementById('exploreAllAirdropsBtn'),
      learnAboutAirdropsBtn: document.getElementById('learnAboutAirdropsBtn')
    };
  }

  initializeManagers() {
    this.toastManager = new ToastManager(this.elements.toastContainer);
    this.modalManager = new ModalManager(
      this.elements.modal,
      this.elements.modalBody,
      this.stateManager,
      this.toastManager
    );
    this.pageLoader = new PageLoader(this.stateManager);
    this.filterManager = new FilterManager(this.stateManager, this.pageLoader);
    this.router = new Router(this.stateManager, this.pageLoader);
  }

  initializeEventListeners() {
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.router.handleNavigation(e));
    });

    if (this.elements.mobileMenuToggle) {
      this.elements.mobileMenuToggle.addEventListener('click', Router.toggleMobileMenu);
    }

    this.initializeListToggle();

    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => this.router.handleNavigation(e));
    });

    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', this.handleDropdownToggle);
    });

    // Initialize accordion event listeners
    this.initializeAccordions();

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav-dropdown')) {
        document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
      }
      if (this.elements.searchSuggestions && !e.target.closest('.search-container')) {
        this.elements.searchSuggestions.style.display = 'none';
      }
    });

    if (this.elements.heroSearch) {
      this.elements.heroSearch.addEventListener('input', Utils.debounce((e) => this.filterManager.handleSearch(e), 300));
    }
    if (this.elements.airdropSearch) {
      this.elements.airdropSearch.addEventListener('input', Utils.debounce((e) => this.filterManager.handleSearch(e), 300));
    }

    if (this.elements.categoryFilter) {
      this.elements.categoryFilter.addEventListener('change', (e) => this.filterManager.handleFilterChange(e));
    }
    if (this.elements.statusFilter) {
      this.elements.statusFilter.addEventListener('change', (e) => this.filterManager.handleFilterChange(e));
    }
    if (this.elements.sortFilter) {
      this.elements.sortFilter.addEventListener('change', (e) => this.filterManager.handleFilterChange(e));
    }

    if (this.elements.filterToggleBtn) {
      this.elements.filterToggleBtn.addEventListener('click', () => FilterManager.toggleFilters());
    }

    this.elements.viewBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const view = e.currentTarget.getAttribute('data-view');
        this.filterManager.handleViewToggle(view);
      });
    });


    if (this.elements.prevPage) {
      this.elements.prevPage.addEventListener('click', () => this.changePage(this.stateManager.getCurrentPageNumber() - 1));
    }
    if (this.elements.nextPage) {
      this.elements.nextPage.addEventListener('click', () => this.changePage(this.stateManager.getCurrentPageNumber() + 1));
    }

    if (this.elements.newsletterForm) {
      this.elements.newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
    }

    this.elements.dashboardTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const tabName = e.target.getAttribute('data-tab');
        this.pageLoader.handleTabChange(tabName);
      });
    });

    if (this.elements.modalClose) {
      this.elements.modalClose.addEventListener('click', () => this.modalManager.close());
    }
    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.addEventListener('click', () => this.modalManager.close());
    }

    // Event delegation for share button clicks
    document.addEventListener('click', (e) => {
      const shareBtn = e.target.closest('.share-btn');
      if (shareBtn) {
        e.stopPropagation();
        const airdropId = parseInt(shareBtn.dataset.airdropId);
        this.shareAirdrop(airdropId);
      }
    });

    // Event delegation for airdrop card clicks
    document.addEventListener('click', (e) => {
      const airdropCard = e.target.closest('[data-airdrop-id]');
      if (airdropCard && !e.target.closest('.share-btn')) {
        const airdropId = parseInt(airdropCard.dataset.airdropId);
        console.log('[CLICK] Airdrop card clicked, ID:', airdropId);
        this.showAirdropDetail(airdropId);
      }
    });

    // Event delegation for main pagination buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('page-number') && e.target.dataset.page && !e.target.dataset.listType) {
        e.preventDefault();
        const page = parseInt(e.target.dataset.page);
        this.changePage(page);
      }
    });

    // Event delegation for list pagination buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('page-number') && e.target.dataset.listType && e.target.dataset.page) {
        e.preventDefault();
        const type = e.target.dataset.listType;
        const page = parseInt(e.target.dataset.page);
        this.changeListPage(type, page);
      }
    });

    // Hero CTA buttons
    if (this.elements.exploreAllAirdropsBtn) {
      this.elements.exploreAllAirdropsBtn.addEventListener('click', () => {
        this.router.navigateToPage('airdrops');
      });
    }
    if (this.elements.learnAboutAirdropsBtn) {
      this.elements.learnAboutAirdropsBtn.addEventListener('click', () => {
        this.router.navigateToPage('learn-what');
      });
    }

    // Carousel hover pause functionality
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => {
        this.pauseCarousel = true;
      });
      carouselContainer.addEventListener('mouseleave', () => {
        this.pauseCarousel = false;
      });
    }
  }

  scrollCarousel(direction) {
    const carousel = document.getElementById('featuredCarousel');
    if (!carousel) return;

    const firstCard = carousel.querySelector('.airdrop-card');
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth;
    const gap = 20;
    const scrollAmount = (cardWidth + gap) * 3;
    const cards = carousel.querySelectorAll('.airdrop-card');
    const totalCardWidth = cardWidth + gap;
    
    // For tripled cards, limit scroll to one-third of total width
    const oneThirdLength = cards.length / 3;
    const maxOffset = totalCardWidth * oneThirdLength * 0.8;
    
    if (direction === 'left') {
      this.manualScrollOffset += scrollAmount;
      if (this.manualScrollOffset > maxOffset) {
        this.manualScrollOffset = maxOffset;
      }
    } else {
      this.manualScrollOffset -= scrollAmount;
      if (this.manualScrollOffset < -maxOffset) {
        this.manualScrollOffset = -maxOffset;
      }
    }
  }

  startCarouselAnimation() {
    const animate = () => {
      const carousel = document.getElementById('featuredCarousel');
      if (!carousel) {
        this.carouselAnimationId = requestAnimationFrame(animate);
        return;
      }

      const cards = carousel.querySelectorAll('.airdrop-card');
      if (cards.length === 0) {
        this.carouselAnimationId = requestAnimationFrame(animate);
        return;
      }

      // Only update position if not paused
      if (!this.pauseCarousel) {
        this.carouselPosition -= this.carouselSpeed;
        
        const firstCard = cards[0];
        const cardWidth = firstCard.offsetWidth;
        const gap = 20;
        const totalCardWidth = cardWidth + gap;
        
        // For tripled cards, reset at one-third of total width for seamless loop
        const oneThirdLength = cards.length / 3;
        const resetWidth = totalCardWidth * oneThirdLength;
        
        // Seamlessly loop when we've scrolled past one set
        if (Math.abs(this.carouselPosition) >= resetWidth) {
          this.carouselPosition = this.carouselPosition % resetWidth;
        }
        
        const finalPosition = this.carouselPosition + this.manualScrollOffset;
        carousel.style.transform = `translateX(${finalPosition}px)`;
      }
      
      this.carouselAnimationId = requestAnimationFrame(animate);
    };
    
    this.carouselAnimationId = requestAnimationFrame(animate);
  }

  stopCarouselAnimation() {
    if (this.carouselAnimationId) {
      cancelAnimationFrame(this.carouselAnimationId);
      this.carouselAnimationId = null;
    }
  }

  handleDropdownToggle(e) {
    e.stopPropagation();
    const dropdown = e.target.closest('.nav-dropdown');
    const isOpen = dropdown.classList.contains('active');
    
    document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
    
    if (!isOpen) {
      dropdown.classList.add('active');
    }
  }

  initializeAccordions() {
    // Add event listeners to all accordion headers
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        this.toggleAccordion(header);
      });
    });
    console.log('Accordion event listeners initialized');
  }

  toggleAccordion(header) {
    console.log('toggleAccordion called', header);
    
    const accordionItem = header.parentElement;
    const content = accordionItem.querySelector('.accordion-content');
    const arrow = header.querySelector('.accordion-arrow');
    
    console.log('Elements found:', { accordionItem, content, arrow });
    
    if (!content || !arrow) {
      console.error('Accordion elements not found', { content, arrow });
      return;
    }
    
    const isOpen = accordionItem.classList.contains('active');
    console.log('Is open:', isOpen);
    
    if (isOpen) {
      content.style.maxHeight = '0px';
      accordionItem.classList.remove('active');
      arrow.style.transform = 'rotate(0deg)';
      console.log('Closed accordion');
    } else {
      accordionItem.classList.add('active');
      // Force reflow to ensure padding changes are applied before measuring
      void content.offsetHeight;
      const height = content.scrollHeight;
      content.style.maxHeight = height + 'px';
      arrow.style.transform = 'rotate(180deg)';
      console.log('Opened accordion, height:', height);
    }
  }

  initializeAnimations() {
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

  startFloatingAnimations() {
    const coins = document.querySelectorAll('.coin');

    coins.forEach((coin, index) => {
      setInterval(() => {
        const randomX = Math.random() * 20 - 10;
        const randomY = Math.random() * 20 - 10;
        coin.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`;
      }, 3000 + index * 500);
    });
  }

  async loadDataFromAPI() {
    try {
      const data = await ApiService.loadData();
      
      if (data && Array.isArray(data.airdrops)) {
        this.stateManager.setAirdrops(data.airdrops);
      } else {
        console.warn('Invalid airdrops data received:', data);
        this.stateManager.setAirdrops([]);
      }
      
      if (data && data.stats) {
        this.stateManager.setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading data from API:', error);
      this.stateManager.setAirdrops([]);
      this.toastManager.error('Failed to load airdrops data');
    }
  }


  changePage(page) {
    const filteredAirdrops = this.stateManager.getFilteredAirdrops();
    const totalPages = Math.ceil(filteredAirdrops.length / this.stateManager.getItemsPerPage());

    if (page < 1 || page > totalPages) return;

    this.stateManager.setCurrentPageNumber(page);
    this.pageLoader.renderAirdropGrid(filteredAirdrops);
    this.pageLoader.renderMainPagination(filteredAirdrops.length);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    
    if (!email) {
      this.toastManager.error('Please enter your email address');
      return;
    }
    
    try {
      const result = await ApiService.subscribeNewsletter(email);
      
      if (this.elements.newsletterSuccess) {
        this.elements.newsletterSuccess.classList.remove('hidden');
      }
      
      this.toastManager.success(result.message || 'Successfully subscribed to newsletter!');
      
      if (this.elements.newsletterForm) {
        this.elements.newsletterForm.reset();
      }

      setTimeout(() => {
        if (this.elements.newsletterSuccess) {
          this.elements.newsletterSuccess.classList.add('hidden');
        }
      }, 5000);
    } catch (error) {
      this.toastManager.error(error.message || 'Failed to subscribe. Please try again.');
    }
  }

  showAirdropDetail(airdropId) {
    console.log('[DEBUG] showAirdropDetail called with:', airdropId);
    const airdrop = this.stateManager.getAirdropById(airdropId);
    console.log('[DEBUG] Airdrop retrieved:', airdrop);
    if (airdrop) {
      console.log('[DEBUG] Calling modal.show()');
      this.modalManager.show(airdrop);
    } else {
      console.error('[DEBUG] No airdrop found!');
    }
  }

  toggleBookmark(airdropId) {
    this.modalManager.handleBookmarkToggle(airdropId);
  }

  toggleParticipation(airdropId) {
    this.modalManager.handleParticipationToggle(airdropId);
  }

  shareAirdrop(airdropId) {
    this.modalManager.handleShare(airdropId);
  }

  removeFilter(filterType) {
    this.filterManager.removeFilter(filterType);
  }

  clearAllFilters() {
    this.filterManager.clearAllFilters();
  }

  selectSuggestion(airdropId) {
    this.filterManager.selectSuggestion(airdropId);
  }

  changeListPage(type, page) {
    this.pageLoader.changeListPage(type, page);
  }

  initializeListToggle() {
    document.addEventListener('click', (e) => {
      const toggleTitle = e.target.closest('.list-title-toggle');
      if (toggleTitle && window.innerWidth <= 768) {
        const section = toggleTitle.closest('.airdrop-list-section');
        const otherSections = document.querySelectorAll('.airdrop-list-section');
        
        otherSections.forEach(s => {
          if (s !== section) {
            s.classList.add('collapsed');
          }
        });
        
        section.classList.toggle('collapsed');
      }
    });

    this.setInitialMobileState();
    
    window.addEventListener('resize', () => {
      this.setInitialMobileState();
    });
  }

  setInitialMobileState() {
    if (window.innerWidth <= 768) {
      const sections = document.querySelectorAll('.airdrop-list-section');
      sections.forEach((section, index) => {
        if (index === 0) {
          section.classList.remove('collapsed');
        } else {
          section.classList.add('collapsed');
        }
      });
    } else {
      document.querySelectorAll('.airdrop-list-section').forEach(section => {
        section.classList.remove('collapsed');
      });
    }
  }
}

const app = new CryptoDropsApp();

// Expose functions to window BEFORE DOMContentLoaded to ensure they're available immediately
window.navigateToPage = (pageId) => {
  try {
    if (app.router) {
      app.router.navigateToPage(pageId);
    } else {
      console.error('Router not initialized yet');
    }
  } catch (error) {
    console.error('Error in navigateToPage:', error);
  }
};

window.showAirdropDetail = (id) => {
  try {
    console.log('[CLICK] showAirdropDetail called with ID:', id);
    if (!app) {
      console.error('App not initialized');
      return;
    }
    if (!app.stateManager) {
      console.error('StateManager not initialized');
      return;
    }
    if (!app.modalManager) {
      console.error('ModalManager not initialized');
      return;
    }
    app.showAirdropDetail(id);
  } catch (error) {
    console.error('Error in showAirdropDetail:', error);
  }
};

window.toggleBookmark = (id) => {
  try {
    if (app.modalManager) {
      app.toggleBookmark(id);
    }
  } catch (error) {
    console.error('Error in toggleBookmark:', error);
  }
};

window.shareAirdrop = (id) => {
  try {
    if (app.modalManager) {
      app.shareAirdrop(id);
    }
  } catch (error) {
    console.error('Error in shareAirdrop:', error);
  }
};

window.toggleParticipation = (id) => {
  try {
    if (app.modalManager) {
      app.toggleParticipation(id);
    }
  } catch (error) {
    console.error('Error in toggleParticipation:', error);
  }
};

window.removeFilter = (type) => {
  try {
    console.log('[window.removeFilter] Called with type:', type);
    if (app.filterManager) {
      app.filterManager.removeFilter(type);
    } else {
      console.error('[window.removeFilter] app.filterManager is not available');
    }
  } catch (error) {
    console.error('Error in removeFilter:', error);
  }
};

window.clearAllFilters = () => {
  try {
    if (app.filterManager) {
      app.filterManager.clearAllFilters();
    }
  } catch (error) {
    console.error('Error in clearAllFilters:', error);
  }
};

window.changePage = (page) => {
  try {
    app.changePage(page);
  } catch (error) {
    console.error('Error in changePage:', error);
  }
};

window.selectSuggestion = (id) => {
  try {
    if (app.filterManager) {
      app.filterManager.selectSuggestion(id);
    }
  } catch (error) {
    console.error('Error in selectSuggestion:', error);
  }
};

window.toggleFilters = () => FilterManager.toggleFilters();
window.changeListPage = (type, page) => {
  try {
    if (app.pageLoader) {
      app.changeListPage(type, page);
    }
  } catch (error) {
    console.error('Error in changeListPage:', error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
// Make toggleAccordion available globally for inline onclick handlers
window.toggleAccordion = (header) => {
  if (app && app.toggleAccordion) {
    app.toggleAccordion(header);
  } else {
    console.error('App not initialized yet');
  }
};

// Log that the module has loaded
console.log('app-main.js module loaded successfully');
