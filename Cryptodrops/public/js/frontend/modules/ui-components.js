import { Utils } from './utils.js';

export class UIComponents {
  static createAirdropCard(airdrop) {
    const logoHtml = Utils.createLogoHtml(airdrop, 80);
    
    return `
      <div class="airdrop-card" data-airdrop-id="${airdrop.id}" style="cursor: pointer;">
        <div class="card-header">
          <div class="project-logo">${logoHtml}</div>
          <div class="project-info">
            <h3>${airdrop.name}</h3>
            <div class="project-blockchain">${airdrop.blockchain}</div>
          </div>
        </div>

        <div class="card-badges">
          <span class="badge badge--${airdrop.status}">${airdrop.status.toUpperCase()}</span>
          ${airdrop.potential ? '<span class="badge badge--potential">✓ POTENTIAL</span>' : ''}
          ${airdrop.confirmed ? '<span class="badge badge--confirmed">✓ CONFIRMED</span>' : ''}
        </div>

        <p class="card-description">${Utils.truncateText(airdrop.description, 150)}</p>

        <div class="card-details">
          <div class="detail-row">
            <span class="detail-label">Category:</span>
            <span class="detail-value">${Utils.formatCategory(airdrop.category) || 'N/A'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Raised Funds:</span>
            <span class="detail-value">${airdrop.totalValue || 'TBA'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Est. Reward:</span>
            <span class="detail-value">${airdrop.estimatedReward || 'TBA'}</span>
          </div>
        </div>
      </div>
    `;
  }

  static createListItem(airdrop) {
    const logoHtml = Utils.createLogoHtml(airdrop, 80);
    
    const statusBadge = airdrop.status ? `<span class="badge badge--${airdrop.status}">${airdrop.status.toUpperCase()}</span>` : '';
    const confirmedBadge = airdrop.confirmed ? `<span class="badge badge--confirmed">✓ CONFIRMED</span>` : '';
    const potentialBadge = airdrop.potential ? `<span class="badge badge--potential">⭐ POTENTIAL</span>` : '';
    const verifiedBadge = airdrop.verified ? `<span class="badge badge--verified">✓ VERIFIED</span>` : '';
    
    const description = airdrop.description 
      ? Utils.truncateText(airdrop.description, 100)
      : 'Complete the tasks to qualify for potential airdrops and rewards.';
    
    return `
      <div class="airdrop-card" data-airdrop-id="${airdrop.id}" style="cursor: pointer;">
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

  static createFeaturedCard(airdrop) {
    const logoHtml = Utils.createLogoHtml(airdrop, 80);
    
    return `
      <div class="airdrop-card" data-airdrop-id="${airdrop.id}" style="cursor: pointer;">
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
            <span class="detail-value">${Utils.formatCategory(airdrop.category)}</span>
          </div>
        </div>
      </div>
    `;
  }

  static renderPagination(totalItems, currentPage, itemsPerPage, onPageChange) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
      return '';
    }
    
    let html = '<div class="page-numbers">';
    
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 2 && i <= currentPage + 2)
      ) {
        html += `
          <button 
            class="page-number ${i === currentPage ? 'active' : ''}" 
            data-page="${i}"
          >${i}</button>
        `;
      } else if (
        i === currentPage - 3 ||
        i === currentPage + 3
      ) {
        html += '<span class="page-ellipsis">...</span>';
      }
    }
    
    html += '</div>';
    return html;
  }

  static renderListPagination(type, totalItems, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
      return '';
    }
    
    let html = '<div class="page-numbers-list">';
    
    for (let i = 1; i <= totalPages; i++) {
      html += `
        <button 
          class="page-number ${i === currentPage ? 'active' : ''}" 
          data-list-type="${type}"
          data-page="${i}"
        >${i}</button>
      `;
    }
    
    html += '</div>';
    return html;
  }

  static createEmptyState(message, subtitle = '') {
    return `
      <div class="empty-state">
        <h3>${message}</h3>
        ${subtitle ? `<p>${subtitle}</p>` : ''}
      </div>
    `;
  }

  static createCalendarDay(day, events = [], isOtherMonth = false) {
    return `
      <div class="calendar-day ${isOtherMonth ? 'other-month' : ''}">
        <div class="calendar-day-number">${day}</div>
        ${events.map(event => `
          <div class="calendar-event" title="${event.name}">
            ${event.name}
          </div>
        `).join('')}
      </div>
    `;
  }

  static createTimelineItem(airdrop) {
    const year = new Date(airdrop.endDate || airdrop.createdAt).getFullYear();
    return `
      <div class="timeline-item">
        <div class="timeline-date">${year}</div>
        <h3>${airdrop.name}</h3>
        <p>${airdrop.description}</p>
        ${airdrop.totalValue ? `<p class="timeline-value">Raise/Funds: ${airdrop.totalValue}</p>` : ''}
      </div>
    `;
  }
}
