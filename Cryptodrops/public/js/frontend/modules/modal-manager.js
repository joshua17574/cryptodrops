import { Utils } from './utils.js';

export class ModalManager {
  constructor(modalElement, modalBody, stateManager, toastManager) {
    this.modal = modalElement;
    this.modalBody = modalBody;
    this.stateManager = stateManager;
    this.toastManager = toastManager;
  }

  show(airdrop) {
    console.log('[DEBUG] Modal.show called');
    console.log('[DEBUG] modal element:', this.modal);
    console.log('[DEBUG] modalBody element:', this.modalBody);
    console.log('[DEBUG] airdrop data:', airdrop);
    
    if (!this.modal || !this.modalBody || !airdrop) {
      console.error('[DEBUG] Modal show failed - missing elements');
      return;
    }

    const logoHtml = Utils.createLogoHtml(airdrop, 80);
    const bookmarked = this.stateManager.getBookmarkedAirdrops().includes(airdrop.id);
    const participating = this.stateManager.getParticipatingAirdrops().includes(airdrop.id);

    this.modalBody.innerHTML = `
      <div class="airdrop-detail">
        <div class="detail-header">
          <div class="project-logo-large">${logoHtml}</div>
          <div class="detail-title">
            <h2>${airdrop.name}</h2>
            <div class="detail-meta">
              <span class="badge badge--${airdrop.status}">${airdrop.status.toUpperCase()}</span>
              ${airdrop.verified ? '<span class="badge badge--verified">✓ VERIFIED</span>' : ''}
              ${airdrop.confirmed ? '<span class="badge badge--confirmed">✓ CONFIRMED</span>' : ''}
              ${airdrop.potential ? '<span class="badge badge--potential">⭐ POTENTIAL</span>' : ''}
            </div>
          </div>
          <button class="share-btn" data-airdrop-id="${airdrop.id}" title="Share this airdrop">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            Share
          </button>
        </div>

        <div class="detail-description">
          <h3>Description</h3>
          <p>${airdrop.description}</p>
        </div>

        <div class="detail-stats">
          <div class="stat-card">
            <h4>Estimated Reward</h4>
            <p class="stat-value">${airdrop.estimatedReward}</p>
          </div>
          <div class="stat-card">
            <h4>Total Value</h4>
            <p class="stat-value">${airdrop.totalValue || 'TBA'}</p>
          </div>
          <div class="stat-card">
            <h4>Blockchain</h4>
            <p class="stat-value">${airdrop.blockchain}</p>
          </div>
          <div class="stat-card">
            <h4>Category</h4>
            <p class="stat-value">${Utils.formatCategory(airdrop.category)}</p>
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
            ${Array.isArray(airdrop.requirements) && airdrop.requirements.length > 0 ? airdrop.requirements.map((req, index) => {
              const isNewFormat = typeof req === 'object' && req.description;
              const description = isNewFormat ? req.description : req;
              const image = isNewFormat ? req.image : '';
              const link = isNewFormat ? req.link : '';
              
              return `
              <div class="step-guide-item">
                <div class="step-header">
                  <div class="step-number">Step ${index + 1}</div>
                  <input type="checkbox" id="req-${airdrop.id}-${index}" class="step-checkbox" />
                </div>
                <div class="step-content">
                  <div class="step-description" data-checkbox-id="req-${airdrop.id}-${index}">${Utils.linkifyText(description)}</div>
                  ${image ? `
                    <div class="step-image-container">
                      <img src="${image}" alt="Step ${index + 1}" class="step-image" data-lightbox="true" />
                      <div class="tap-to-enlarge-hint">
                        <span class="enlarge-icon">🔍</span>
                        <span class="enlarge-text">Tap to enlarge photo</span>
                      </div>
                    </div>
                  ` : ''}
                  ${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer" class="step-link-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                    Visit Link
                  </a>` : ''}
                </div>
              </div>
              `;
            }).join('') : '<p class="no-steps">No step-by-step guide available yet.</p>'}
          </div>
        </div>

        ${airdrop.website || airdrop.twitter || airdrop.discord || airdrop.telegram ? `
        <div class="detail-links">
          <h3>Official Links</h3>
          <div class="social-links">
            ${airdrop.website ? `<a href="${airdrop.website}" target="_blank" class="btn btn--outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              Website</a>` : ''}
            ${airdrop.twitter ? `<a href="${airdrop.twitter}" target="_blank" class="btn btn--outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Twitter</a>` : ''}
            ${airdrop.discord ? `<a href="${airdrop.discord}" target="_blank" class="btn btn--outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Discord</a>` : ''}
            ${airdrop.telegram ? `<a href="${airdrop.telegram}" target="_blank" class="btn btn--outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12a12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472c-.18 1.898-.962 6.502-1.36 8.627c-.168.9-.499 1.201-.82 1.23c-.696.065-1.225-.46-1.9-.902c-1.056-.693-1.653-1.124-2.678-1.8c-1.185-.78-.417-1.21.258-1.91c.177-.184 3.247-2.977 3.307-3.23c.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345c-.48.33-.913.49-1.302.48c-.428-.008-1.252-.241-1.865-.44c-.752-.245-1.349-.374-1.297-.789c.027-.216.325-.437.893-.663c3.498-1.524 5.83-2.529 6.998-3.014c3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Telegram</a>` : ''}
          </div>
        </div>
        ` : ''}
      </div>
    `;

    this.modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Add click handlers for step descriptions to toggle checkboxes
    setTimeout(() => {
      const stepDescriptions = this.modalBody.querySelectorAll('.step-description');
      stepDescriptions.forEach(desc => {
        desc.addEventListener('click', (e) => {
          // Don't toggle checkbox if clicking on a link
          if (e.target.tagName === 'A' || e.target.closest('a')) {
            return;
          }
          const checkboxId = desc.getAttribute('data-checkbox-id');
          const checkbox = document.getElementById(checkboxId);
          if (checkbox) {
            checkbox.checked = !checkbox.checked;
          }
        });
      });

      // Add click handlers for lightbox images
      this.initializeLightbox();
    }, 0);
  }

  close() {
    if (this.modal) {
      this.modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  handleBookmarkToggle(airdropId) {
    const isBookmarked = this.stateManager.toggleBookmark(airdropId);
    this.toastManager.show(
      isBookmarked ? 'Airdrop bookmarked!' : 'Bookmark removed',
      isBookmarked ? 'success' : 'info'
    );
    
    const airdrop = this.stateManager.getAirdropById(airdropId);
    if (airdrop) {
      this.show(airdrop);
    }
  }

  handleParticipationToggle(airdropId) {
    const isParticipating = this.stateManager.toggleParticipation(airdropId);
    this.toastManager.show(
      isParticipating ? 'Started participating in airdrop!' : 'Stopped participating in airdrop',
      isParticipating ? 'success' : 'info'
    );
    
    const airdrop = this.stateManager.getAirdropById(airdropId);
    if (airdrop) {
      this.show(airdrop);
    }
  }

  handleShare(airdropId) {
    console.log('[DEBUG] handleShare called with airdropId:', airdropId);
    const airdrop = this.stateManager.getAirdropById(airdropId);
    if (!airdrop) {
      console.log('[DEBUG] Airdrop not found');
      return;
    }

    const url = window.location.href.split('#')[0] + `#airdrop-${airdropId}`;
    console.log('[DEBUG] Share URL created:', url);
    
    if (navigator.share) {
      console.log('[DEBUG] Using navigator.share');
      navigator.share({
        title: airdrop.name,
        text: `Check out ${airdrop.name} airdrop on CryptoDrops!`,
        url: url
      }).then(() => {
        console.log('[DEBUG] Share successful');
      }).catch((error) => {
        console.log('[DEBUG] Share failed:', error);
      });
    } else {
      console.log('[DEBUG] Using clipboard');
      navigator.clipboard.writeText(url).then(() => {
        console.log('[DEBUG] Link copied to clipboard:', url);
        this.toastManager.success('Link copied to clipboard!');
      }).catch((error) => {
        console.log('[DEBUG] Failed to copy link:', error);
        this.toastManager.error('Failed to copy link');
      });
    }
  }

  initializeLightbox() {
    const stepImages = this.modalBody.querySelectorAll('.step-image[data-lightbox="true"]');
    
    stepImages.forEach(img => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        this.openLightbox(img.src, img.alt);
      });
      
      img.style.cursor = 'pointer';
    });
  }

  openLightbox(imageSrc, imageAlt) {
    let lightbox = document.getElementById('image-lightbox');
    
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'image-lightbox';
      lightbox.className = 'image-lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-content">
          <button class="lightbox-close" aria-label="Close lightbox">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <img class="lightbox-image" src="" alt="" />
        </div>
      `;
      document.body.appendChild(lightbox);
      
      const closeBtn = lightbox.querySelector('.lightbox-close');
      const overlay = lightbox.querySelector('.lightbox-overlay');
      
      const closeLightbox = () => {
        lightbox.classList.remove('active');
        setTimeout(() => {
          lightbox.style.display = 'none';
        }, 300);
      };
      
      closeBtn.addEventListener('click', closeLightbox);
      overlay.addEventListener('click', closeLightbox);
      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          closeLightbox();
        }
      });
    }
    
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    lightboxImage.src = imageSrc;
    lightboxImage.alt = imageAlt;
    
    lightbox.style.display = 'flex';
    setTimeout(() => {
      lightbox.classList.add('active');
    }, 10);
  }
}
