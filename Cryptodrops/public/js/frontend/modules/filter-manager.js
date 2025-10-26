import { Utils } from './utils.js';

export class FilterManager {
  constructor(stateManager, pageLoader) {
    this.stateManager = stateManager;
    this.pageLoader = pageLoader;
  }

  handleSearch(e) {
    const searchTerm = e.target.value;
    this.stateManager.updateFilter('search', searchTerm);
    this.stateManager.setCurrentPageNumber(1);
    
    // Navigate to airdrops page if searching from homepage
    const currentPage = document.querySelector('.page.active');
    if (currentPage && currentPage.id === 'home' && searchTerm.length > 0) {
      const airdropsLink = document.querySelector('a[href="#airdrops"]');
      if (airdropsLink) {
        airdropsLink.click();
        // Small delay to ensure page has loaded before filtering
        setTimeout(() => {
          this.pageLoader.loadAirdropsPage();
          this.updateActiveFilters();
        }, 100);
      }
    } else {
      this.pageLoader.loadAirdropsPage();
      this.updateActiveFilters();
    }
    
    if (searchTerm.length > 2) {
      this.showSearchSuggestions(searchTerm);
    } else {
      this.hideSearchSuggestions();
    }
  }

  handleFilterChange(e) {
    const filterId = e.target.id;
    const value = e.target.value;

    if (filterId === 'categoryFilter') {
      this.stateManager.updateFilter('category', value);
    } else if (filterId === 'statusFilter') {
      this.stateManager.updateFilter('status', value);
    } else if (filterId === 'sortFilter') {
      this.stateManager.updateFilter('sort', value);
    }

    this.stateManager.setCurrentPageNumber(1);
    this.pageLoader.loadAirdropsPage();
    this.updateActiveFilters();
  }

  handleViewToggle(view) {
    this.stateManager.setCurrentView(view);
    this.pageLoader.renderAirdropGrid(this.stateManager.getFilteredAirdrops());

    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const viewBtn = document.querySelector(`[data-view="${view}"]`);
    if (viewBtn) {
      viewBtn.classList.add('active');
    }
  }

  updateActiveFilters() {
    const activeFiltersElement = document.getElementById('activeFilters');
    if (!activeFiltersElement) return;

    const filters = this.stateManager.getFilters();
    const activeFilters = [];

    if (filters.search) {
      activeFilters.push({ type: 'search', label: `Search: ${filters.search}`, value: filters.search });
    }
    if (filters.category) {
      const categoryLabels = {
        'social': 'Social',
        'bounty-platforms': 'Bounty Platforms',
        'testnet': 'Testnet',
        'mainnet': 'Mainnet',
        'fill-form': 'Fill The Form',
        'role': 'Getting a role',
        'liquidity': 'Liquidity',
        'mint-nft': 'Mint NFT',
        'gaming': 'Gaming',
        'staking': 'Staking',
        'trading': 'Trading',
        'node': 'Node',
        'depin': 'DePIN',
        'mint-domain': 'Mint Domain',
        'hold': 'Hold',
        'ambassador': 'Ambassador program',
        'wallet-airdrop': 'Wallet Airdrop Status',
        'contract-deployment': 'Contract Deployment',
        'taskbased': 'Taskbased'
      };
      const label = categoryLabels[filters.category] || filters.category;
      activeFilters.push({ type: 'category', label: `Category: ${label}`, value: filters.category });
    }
    if (filters.status) {
      activeFilters.push({ type: 'status', label: `Status: ${filters.status}`, value: filters.status });
    }

    if (activeFilters.length === 0) {
      activeFiltersElement.innerHTML = '';
      return;
    }

    activeFiltersElement.innerHTML = `
      <div class="filter-tags">
        ${activeFilters.map(filter => `
          <div class="filter-tag">
            <span>${filter.label}</span>
            <button data-filter-type="${filter.type}" class="filter-remove">×</button>
          </div>
        `).join('')}
        ${activeFilters.length > 1 ? '<button class="btn btn--sm btn--outline clear-all-filters-btn">Clear All</button>' : ''}
      </div>
    `;

    // Add event listeners using event delegation
    activeFiltersElement.querySelectorAll('.filter-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filterType = e.target.getAttribute('data-filter-type');
        this.removeFilter(filterType);
      });
    });

    const clearAllBtn = activeFiltersElement.querySelector('.clear-all-filters-btn');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', () => {
        this.clearAllFilters();
      });
    }
  }

  removeFilter(filterType) {
    console.log('[removeFilter] Removing filter:', filterType);
    this.stateManager.updateFilter(filterType, '');
    
    const filterElements = {
      'search': 'airdropSearch',
      'category': 'categoryFilter',
      'status': 'statusFilter'
    };

    const elementId = filterElements[filterType];
    if (elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.value = '';
        console.log('[removeFilter] Reset filter element:', elementId);
      }
    }

    this.stateManager.setCurrentPageNumber(1);
    this.pageLoader.loadAirdropsPage();
    this.updateActiveFilters();
    console.log('[removeFilter] Filter removed successfully');
  }

  clearAllFilters() {
    this.stateManager.resetFilters();
    
    const searchInput = document.getElementById('airdropSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (searchInput) searchInput.value = '';
    if (categoryFilter) categoryFilter.value = '';
    if (statusFilter) statusFilter.value = '';
    if (sortFilter) sortFilter.value = 'newest';

    this.stateManager.setCurrentPageNumber(1);
    this.pageLoader.loadAirdropsPage();
    this.updateActiveFilters();
  }

  showSearchSuggestions(searchTerm) {
    const suggestionsElement = document.getElementById('searchSuggestions');
    if (!suggestionsElement) return;

    const airdrops = this.stateManager.getAirdrops();
    const lowerSearch = searchTerm.toLowerCase();
    
    const matches = airdrops
      .filter(airdrop => 
        airdrop.name.toLowerCase().includes(lowerSearch) ||
        airdrop.blockchain.toLowerCase().includes(lowerSearch)
      )
      .slice(0, 5);

    if (matches.length === 0) {
      suggestionsElement.style.display = 'none';
      return;
    }

    suggestionsElement.innerHTML = matches
      .map(airdrop => `
        <div class="suggestion-item" onclick="selectSuggestion(${airdrop.id})">
          <strong>${airdrop.name}</strong>
          <span class="suggestion-blockchain">${airdrop.blockchain}</span>
        </div>
      `)
      .join('');
    
    suggestionsElement.style.display = 'block';
  }

  hideSearchSuggestions() {
    const suggestionsElement = document.getElementById('searchSuggestions');
    if (suggestionsElement) {
      suggestionsElement.style.display = 'none';
    }
  }

  selectSuggestion(airdropId) {
    this.hideSearchSuggestions();
    const searchInputs = document.querySelectorAll('#heroSearch, #airdropSearch');
    searchInputs.forEach(input => {
      if (input) input.value = '';
    });
    
    if (window.showAirdropDetail) {
      window.showAirdropDetail(airdropId);
    }
  }

  static toggleFilters() {
    console.log('[toggleFilters] Function called');
    const filterControls = document.getElementById('filterControls');
    const filterToggleBtn = document.getElementById('filterToggleBtn');
    
    console.log('[toggleFilters] Elements found:', { filterControls, filterToggleBtn });
    
    if (filterControls) {
      filterControls.classList.toggle('active');
      console.log('[toggleFilters] Toggled active class. Is active now?', filterControls.classList.contains('active'));
      
      if (filterControls.classList.contains('active')) {
        filterToggleBtn.innerHTML = '<span class="filter-icon">🎛️</span><span class="filter-text">Hide Filters</span>';
      } else {
        filterToggleBtn.innerHTML = '<span class="filter-icon">🎛️</span><span class="filter-text">Filters</span>';
      }
    } else {
      console.error('[toggleFilters] filterControls element not found!');
    }
  }
}
