export class Router {
  constructor(stateManager, pageLoader) {
    this.stateManager = stateManager;
    this.pageLoader = pageLoader;
  }

  navigateToPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      this.stateManager.setCurrentPage(pageId);

      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + pageId) {
          link.classList.add('active');
        }
      });

      this.pageLoader.loadPageContent(pageId);
      
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  handleNavigation(e) {
    e.preventDefault();
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('#')) {
      const pageId = href.substring(1);
      this.navigateToPage(pageId);
      
      const navMenu = document.getElementById('navMenu');
      if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
      }
    }
  }

  static toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
      navMenu.classList.toggle('active');
    }
  }
}
