/**
 * Utility Functions
 * Provides common utility methods for the frontend application
 * Includes XSS protection, formatting, and DOM manipulation helpers
 */

export class Utils {
  /**
   * Sanitize HTML to prevent XSS attacks
   * @param {string} str - Input string that may contain HTML
   * @returns {string} Sanitized string safe for innerHTML
   */
  static sanitizeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Escape HTML entities to prevent XSS
   * @param {string} str - Input string
   * @returns {string} Escaped string
   */
  static escapeHtml(str) {
    if (!str) return '';
    const htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    };
    return String(str).replace(/[&<>"'\/]/g, (match) => htmlEscapes[match]);
  }

  /**
   * Validate and sanitize URL
   * @param {string} url - URL to validate
   * @returns {string|null} Sanitized URL or null if invalid
   */
  static sanitizeUrl(url) {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      // Only allow http and https protocols
      if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
        return null;
      }
      return urlObj.href;
    } catch {
      return null;
    }
  }

  /**
   * Format numbers with K/M suffixes
   * @param {number} num - Number to format
   * @returns {string} Formatted number string
   */
  static formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  static formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  static truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }

  static debounce(func, wait) {
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

  static getDifficultyBadge(difficulty) {
    const badges = {
      easy: '<span class="badge badge--success">EASY</span>',
      medium: '<span class="badge badge--warning">MEDIUM</span>',
      hard: '<span class="badge badge--error">HARD</span>'
    };
    return badges[difficulty] || '';
  }

  static formatCategory(category) {
    const categories = {
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
    return categories[category?.toLowerCase()] || category;
  }

  /**
   * Create logo HTML with XSS protection
   * @param {Object} airdrop - Airdrop object
   * @param {number} size - Logo size in pixels
   * @returns {string} Safe HTML string for logo
   */
  static createLogoHtml(airdrop, size = 80) {
    const isValidUrl = airdrop.logo && (
      airdrop.logo.startsWith('http://') ||
      airdrop.logo.startsWith('https://') ||
      airdrop.logo.startsWith('data:')
    );

    // Sanitize URL and name to prevent XSS
    const sanitizedUrl = isValidUrl ? this.sanitizeUrl(airdrop.logo) : null;
    const sanitizedName = this.escapeHtml(airdrop.name);

    if (sanitizedUrl) {
      return `<img src="${sanitizedUrl}" alt="${sanitizedName}" style="width: ${size}px; height: ${size}px; object-fit: cover; border-radius: 8px;">`;
    }

    const fontSize = size / 2;
    const sanitizedLogo = this.escapeHtml(airdrop.logo || '🎁');
    return `<span style="font-size: ${fontSize}px;">${sanitizedLogo}</span>`;
  }

  /**
   * Validate email format
   * @param {string} email - Email address
   * @returns {boolean} True if valid email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate and sanitize user input
   * @param {string} input - User input
   * @param {number} maxLength - Maximum allowed length
   * @returns {string} Sanitized input
   */
  static sanitizeInput(input, maxLength = 1000) {
    if (!input) return '';
    // Trim whitespace
    let sanitized = String(input).trim();
    // Limit length
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }
    // Escape HTML
    return this.escapeHtml(sanitized);
  }
}
