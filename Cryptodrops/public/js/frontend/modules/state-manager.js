import { StorageService } from './storage.js';

export class StateManager {
  constructor() {
    this.applicationData = {
      airdrops: [],
      stats: {
        totalAirdrops: 0,
        activeAirdrops: 0,
        totalValueDistributed: '$0',
        totalParticipants: '0',
        successfulClaims: '0%'
      }
    };

    this.currentPage = 'home';
    this.currentView = 'grid';
    this.currentPageNumber = 1;
    this.itemsPerPage = 12;
    
    this.currentFilters = {
      search: '',
      category: '',
      status: '',
      sort: 'newest'
    };
  }

  getAirdrops() {
    return this.applicationData.airdrops;
  }

  setAirdrops(airdrops) {
    if (Array.isArray(airdrops)) {
      this.applicationData.airdrops = airdrops;
    } else {
      console.error('setAirdrops called with non-array:', airdrops);
      this.applicationData.airdrops = [];
    }
  }

  getStats() {
    return this.applicationData.stats;
  }

  setStats(stats) {
    this.applicationData.stats = stats;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  getCurrentView() {
    return this.currentView;
  }

  setCurrentView(view) {
    this.currentView = view;
  }

  getCurrentPageNumber() {
    return this.currentPageNumber;
  }

  setCurrentPageNumber(page) {
    this.currentPageNumber = page;
  }

  getItemsPerPage() {
    return this.itemsPerPage;
  }

  getFilters() {
    return this.currentFilters;
  }

  updateFilter(key, value) {
    this.currentFilters[key] = value;
  }

  resetFilters() {
    this.currentFilters = {
      search: '',
      category: '',
      status: '',
      sort: 'newest'
    };
  }

  getBookmarkedAirdrops() {
    return StorageService.getBookmarkedAirdrops();
  }

  getParticipatingAirdrops() {
    return StorageService.getParticipatingAirdrops();
  }

  toggleBookmark(airdropId) {
    return StorageService.toggleBookmark(airdropId);
  }

  toggleParticipation(airdropId) {
    return StorageService.toggleParticipation(airdropId);
  }

  getFeaturedAirdrops() {
    if (!Array.isArray(this.applicationData.airdrops)) {
      console.error('airdrops is not an array in getFeaturedAirdrops');
      return [];
    }
    return this.applicationData.airdrops.filter(airdrop => airdrop.featured);
  }

  getAirdropById(id) {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    return this.applicationData.airdrops.find(airdrop => airdrop.id === numericId);
  }

  getFilteredAirdrops() {
    if (!Array.isArray(this.applicationData.airdrops)) {
      console.error('airdrops is not an array in getFilteredAirdrops');
      return [];
    }
    let airdrops = [...this.applicationData.airdrops];

    if (this.currentFilters.search) {
      const searchTerm = this.currentFilters.search.toLowerCase();
      airdrops = airdrops.filter(airdrop =>
        airdrop.name.toLowerCase().includes(searchTerm) ||
        airdrop.description.toLowerCase().includes(searchTerm) ||
        airdrop.blockchain.toLowerCase().includes(searchTerm)
      );
    }

    if (this.currentFilters.category) {
      const category = this.currentFilters.category.toLowerCase();
      if (category === 'solana') {
        airdrops = airdrops.filter(airdrop => airdrop.blockchain && airdrop.blockchain.toLowerCase() === 'solana');
      } else if (category === 'telegram') {
        airdrops = airdrops.filter(airdrop => airdrop.blockchain && airdrop.blockchain.toLowerCase() === 'ton');
      } else if (category === 'layer2') {
        airdrops = airdrops.filter(airdrop => 
          (airdrop.category && airdrop.category.toLowerCase() === 'layer2') ||
          (airdrop.category && airdrop.category.toLowerCase() === 'layer 2') ||
          (airdrop.type && airdrop.type.toLowerCase() === 'layer2')
        );
      } else if (category === 'defi') {
        airdrops = airdrops.filter(airdrop => 
          (airdrop.category && airdrop.category.toLowerCase() === 'defi') ||
          (airdrop.type && airdrop.type.toLowerCase() === 'defi')
        );
      } else if (category === 'social') {
        airdrops = airdrops.filter(airdrop => 
          (airdrop.category && airdrop.category.toLowerCase() === 'social') ||
          (airdrop.type && airdrop.type.toLowerCase() === 'social')
        );
      } else {
        airdrops = airdrops.filter(airdrop => 
          (airdrop.type && airdrop.type.toLowerCase() === category) ||
          (airdrop.category && airdrop.category.toLowerCase() === category)
        );
      }
    }

    if (this.currentFilters.status) {
      airdrops = airdrops.filter(airdrop => airdrop.status === this.currentFilters.status);
    }

    switch (this.currentFilters.sort) {
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

  getCategoryAirdrops(categoryId) {
    if (!Array.isArray(this.applicationData.airdrops)) {
      console.error('airdrops is not an array in getCategoryAirdrops');
      return [];
    }
    
    let filteredAirdrops = [];

    if (categoryId === 'solana') {
      filteredAirdrops = this.applicationData.airdrops.filter(a => a.blockchain && a.blockchain.toLowerCase() === 'solana');
    } else if (categoryId === 'layer2') {
      filteredAirdrops = this.applicationData.airdrops.filter(a => 
        (a.category && a.category.toLowerCase() === 'layer2') ||
        (a.category && a.category.toLowerCase() === 'layer 2') ||
        (a.type && a.type.toLowerCase() === 'layer2')
      );
    } else if (categoryId === 'defi') {
      filteredAirdrops = this.applicationData.airdrops.filter(a => 
        (a.category && a.category.toLowerCase() === 'defi') ||
        (a.type && a.type.toLowerCase() === 'defi')
      );
    } else if (categoryId === 'social') {
      filteredAirdrops = this.applicationData.airdrops.filter(a => 
        (a.category && a.category.toLowerCase() === 'social') ||
        (a.type && a.type.toLowerCase() === 'social')
      );
    } else if (categoryId === 'telegram') {
      filteredAirdrops = this.applicationData.airdrops.filter(a => a.blockchain && a.blockchain.toLowerCase() === 'ton');
    } else if (categoryId === 'retroactive') {
      filteredAirdrops = this.applicationData.airdrops.filter(a => 
        (a.category && a.category.toLowerCase() === 'retroactive') ||
        (a.type && a.type.toLowerCase() === 'retroactive')
      );
    } else if (categoryId === 'holders') {
      filteredAirdrops = this.applicationData.airdrops.filter(a => 
        (a.category && a.category.toLowerCase() === 'holders') ||
        (a.category && a.category.toLowerCase() === 'holder') ||
        (a.type && a.type.toLowerCase() === 'holders') ||
        (a.type && a.type.toLowerCase() === 'holder')
      );
    } else if (categoryId === 'testnet') {
      filteredAirdrops = this.applicationData.airdrops.filter(a => 
        (a.category && a.category.toLowerCase() === 'testnet') ||
        (a.type && a.type.toLowerCase() === 'testnet')
      );
    } else {
      // Generic fallback for any other category
      filteredAirdrops = this.applicationData.airdrops.filter(a => 
        (a.type && a.type.toLowerCase() === categoryId.toLowerCase()) ||
        (a.category && a.category.toLowerCase() === categoryId.toLowerCase())
      );
    }

    return filteredAirdrops;
  }

  getAirdropEventsForDate(date) {
    if (!Array.isArray(this.applicationData.airdrops)) {
      console.error('airdrops is not an array in getAirdropEventsForDate');
      return [];
    }
    
    const dateStr = date.toISOString().split('T')[0];
    const events = [];

    this.applicationData.airdrops.forEach(airdrop => {
      if (airdrop.endDate === dateStr) {
        events.push({ name: airdrop.name + ' Ends', type: 'end' });
      }
      if (airdrop.startDate === dateStr) {
        events.push({ name: airdrop.name + ' Starts', type: 'start' });
      }
    });

    return events;
  }
}
