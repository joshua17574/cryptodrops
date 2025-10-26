import { UIComponents } from './ui-components.js';
import { Utils } from './utils.js';
import { ApiService } from './api.service.js';

export class PageLoader {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  loadPageContent(pageId) {
    switch (pageId) {
      case 'home':
        this.loadHomePage();
        break;
      case 'airdrops':
        this.loadAirdropsPage();
        break;
      case 'dashboard':
        this.loadDashboard();
        break;
      case 'calendar':
        this.loadCalendar();
        break;
      case 'social':
      case 'bounty-platforms':
      case 'testnet':
      case 'mainnet':
      case 'fill-form':
      case 'role':
      case 'liquidity':
      case 'mint-nft':
      case 'gaming':
      case 'staking':
      case 'trading':
      case 'node':
      case 'depin':
      case 'mint-domain':
      case 'hold':
      case 'ambassador':
      case 'wallet-airdrop':
      case 'contract-deployment':
      case 'taskbased':
      case 'layer2':
      case 'solana':
      case 'telegram':
        this.loadCategoryPage(pageId);
        break;
      default:
        if (pageId.startsWith('airdrop-')) {
          const id = parseInt(pageId.split('-')[1]);
          const airdrop = this.stateManager.getAirdropById(id);
          if (airdrop && window.showAirdropDetail) {
            window.showAirdropDetail(id);
          }
        }
        break;
    }
  }

  loadHomePage() {
    this.loadFeaturedCarousel();
    this.animateActiveAirdropsCounter();
  }

  loadFeaturedCarousel() {
    const carousel = document.getElementById('featuredCarousel');
    if (!carousel) {
      console.error('[DEBUG] Featured carousel element not found');
      return;
    }

    const featuredAirdrops = this.stateManager.getFeaturedAirdrops();
    console.log('[DEBUG] Featured airdrops count:', featuredAirdrops.length);
    const cardsHtml = featuredAirdrops
      .map(airdrop => UIComponents.createFeaturedCard(airdrop))
      .join('');
    
    if (featuredAirdrops.length > 1) {
      // Triple the cards for seamless infinite loop
      carousel.innerHTML = cardsHtml + cardsHtml + cardsHtml;
      console.log('[DEBUG] Featured airdrops loaded with triple duplication for seamless infinite scroll');
    } else if (featuredAirdrops.length === 1) {
      // For single airdrop, duplicate multiple times to create a loop effect
      carousel.innerHTML = cardsHtml + cardsHtml + cardsHtml + cardsHtml;
      console.log('[DEBUG] Single featured airdrop duplicated for continuous display');
    } else {
      carousel.innerHTML = '';
      console.log('[DEBUG] No featured airdrops to display');
    }
  }

  animateActiveAirdropsCounter() {
    const counter = document.getElementById('activeAirdropsCount');
    if (!counter) return;

    const target = this.stateManager.getStats().activeAirdrops;
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
      current += increment;
      counter.textContent = Math.floor(current);

      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      }
    }, 20);
  }

  loadAirdropsPage() {
    const filteredAirdrops = this.stateManager.getFilteredAirdrops();
    this.renderAirdropGrid(filteredAirdrops);
    this.renderMainPagination(filteredAirdrops.length);
  }

  renderAirdropGrid(airdrops) {
    const grid = document.getElementById('airdropsGrid');
    if (!grid) return;

    const startIndex = (this.stateManager.getCurrentPageNumber() - 1) * this.stateManager.getItemsPerPage();
    const endIndex = startIndex + this.stateManager.getItemsPerPage();
    const pageAirdrops = airdrops.slice(startIndex, endIndex);

    grid.className = `airdrops-grid ${this.stateManager.getCurrentView()}-view`;

    if (pageAirdrops.length === 0) {
      grid.innerHTML = UIComponents.createEmptyState(
        'No airdrops found',
        'Try adjusting your filters or search terms'
      );
      return;
    }

    grid.innerHTML = pageAirdrops
      .map(airdrop => UIComponents.createAirdropCard(airdrop))
      .join('');
  }

  renderMainPagination(totalItems) {
    const paginationElement = document.getElementById('pageNumbers');
    if (!paginationElement) return;

    const html = UIComponents.renderPagination(
      totalItems,
      this.stateManager.getCurrentPageNumber(),
      this.stateManager.getItemsPerPage(),
      'changePage'
    );

    paginationElement.innerHTML = html;
  }


  loadDashboard() {
    this.loadSavedAirdrops();
  }

  loadSavedAirdrops() {
    const savedElement = document.getElementById('savedAirdrops');
    if (!savedElement) return;

    const bookmarkedIds = this.stateManager.getBookmarkedAirdrops();
    
    if (bookmarkedIds.length === 0) {
      savedElement.innerHTML = '<p class="empty-state">No saved airdrops yet. Start exploring and bookmark interesting opportunities!</p>';
      return;
    }

    const savedAirdrops = this.stateManager.getAirdrops().filter(a => bookmarkedIds.includes(a.id));

    savedElement.innerHTML = `
      <div class="dashboard-grid">
        ${savedAirdrops.map(airdrop => UIComponents.createAirdropCard(airdrop)).join('')}
      </div>
    `;
  }

  loadParticipatingAirdrops() {
    const participatingTab = document.querySelector('#participating-tab .participating-airdrops');
    if (!participatingTab) return;

    const participatingIds = this.stateManager.getParticipatingAirdrops();
    
    if (participatingIds.length === 0) {
      participatingTab.innerHTML = '<p class="empty-state">No active participations. Join some airdrops to track your progress here!</p>';
      return;
    }

    const participatingAirdrops = this.stateManager.getAirdrops().filter(a => participatingIds.includes(a.id));

    participatingTab.innerHTML = `
      <div class="dashboard-grid">
        ${participatingAirdrops.map(airdrop => `
          <div class="participation-card">
            ${UIComponents.createAirdropCard(airdrop)}
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

  loadCompletedAirdrops() {
    const completedTab = document.querySelector('#completed-tab .completed-airdrops');
    if (!completedTab) return;

    const completedData = this.stateManager.getAirdrops().filter(a => a.status === 'ended');

    if (completedData.length === 0) {
      completedTab.innerHTML = '<p class="empty-state">No completed airdrops yet. Keep participating to build your history!</p>';
      return;
    }

    completedTab.innerHTML = `
      <div class="dashboard-grid">
        ${completedData.slice(0, 3).map(airdrop => `
          <div class="completed-card">
            ${UIComponents.createAirdropCard(airdrop)}
            <div class="completion-info">
              <span class="status status--success">✅ Completed</span>
              <p class="reward-info">Estimated reward claimed: ${airdrop.estimatedReward.split('-')[0]}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  loadCategoryPage(categoryId) {
    const filteredAirdrops = this.stateManager.getCategoryAirdrops(categoryId);
    const gridElement = document.getElementById(categoryId + 'Grid');
    
    if (gridElement) {
      if (filteredAirdrops.length === 0) {
        gridElement.innerHTML = UIComponents.createEmptyState('No airdrops found in this category.');
      } else {
        gridElement.innerHTML = filteredAirdrops
          .map(airdrop => UIComponents.createAirdropCard(airdrop))
          .join('');
      }
    }
  }

  loadCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');

    if (!calendarGrid || !currentMonthElement) return;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    currentMonthElement.textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    let calendarHTML = '';

    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
      calendarHTML += `<div class="calendar-header">${day}</div>`;
    });

    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = startingDay - 1; i >= 0; i--) {
      calendarHTML += UIComponents.createCalendarDay(prevMonthDays - i, [], true);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const events = this.stateManager.getAirdropEventsForDate(new Date(year, month, day));
      calendarHTML += UIComponents.createCalendarDay(day, events);
    }

    const remainingDays = 42 - (startingDay + daysInMonth);
    for (let day = 1; day <= remainingDays; day++) {
      calendarHTML += UIComponents.createCalendarDay(day, [], true);
    }

    calendarGrid.innerHTML = calendarHTML;
  }

  handleTabChange(tab) {
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    const tabButton = document.querySelector(`[data-tab="${tab}"]`);
    if (tabButton) tabButton.classList.add('active');
    
    const tabContent = document.getElementById(tab + '-tab');
    if (tabContent) tabContent.classList.add('active');

    switch (tab) {
      case 'saved':
        this.loadSavedAirdrops();
        break;
      case 'participating':
        this.loadParticipatingAirdrops();
        break;
      case 'completed':
        this.loadCompletedAirdrops();
        break;
    }
  }
}
