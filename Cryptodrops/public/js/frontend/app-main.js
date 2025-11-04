const products = [
    {
        name: 'Midnight Sonata',
        tag: 'Gala',
        meta: 'Hand-beaded silk tulle',
        price: 3200,
        image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=800&q=80',
        style: 'gala'
    },
    {
        name: 'Blushing Reverie',
        tag: 'Bridal',
        meta: 'Off-shoulder floral lace',
        price: 4500,
        image: 'https://images.unsplash.com/photo-1542060748-10c28b62716c?auto=format&fit=crop&w=800&q=80',
        style: 'bridal'
    },
    {
        name: 'Celestial Bloom',
        tag: 'Evening',
        meta: 'Sequined organza layers',
        price: 2800,
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        style: 'evening'
    },
    {
        name: 'Velvet Dawn',
        tag: 'Day-to-night',
        meta: 'Convertible midi silhouette',
        price: 1850,
        image: 'https://images.unsplash.com/photo-1553154554-1e03382aabb6?auto=format&fit=crop&w=800&q=80',
        style: 'day'
    },
    {
        name: 'Aurora Ripple',
        tag: 'Evening',
        meta: 'Bias-cut satin charmeuse',
        price: 2450,
        image: 'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?auto=format&fit=crop&w=800&q=80',
        style: 'evening'
    },
    {
        name: 'Whispering Meadow',
        tag: 'Bridal',
        meta: 'Illusion neckline & petals',
        price: 5200,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
        style: 'bridal'
    }
];

const collections = [
    {
        name: 'Moonlit Gala',
        tag: 'Gala',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        description: 'Architectural silhouettes with hand-cut crystals and velvet detailing.'
    },
    {
        name: 'Ethereal Bridal',
        tag: 'Bridal',
        image: 'https://images.unsplash.com/photo-1527416876370-fb74d128c82d?auto=format&fit=crop&w=800&q=80',
        description: 'Soft botanicals, sculpted corsetry, and heirloom-worthy veils.'
    },
    {
        name: 'Nocturne Evenings',
        tag: 'Evening',
        image: 'https://images.unsplash.com/photo-1511288590361-652a7c1f14f6?auto=format&fit=crop&w=800&q=80',
        description: 'Sculpted silk, liquid sequins, and luminous fabrics for after dark.'
    },
    {
        name: 'Daydream Stories',
        tag: 'Day-to-night',
        image: 'https://images.unsplash.com/photo-1523419409543-0c1df022bdd1?auto=format&fit=crop&w=800&q=80',
        description: 'Playful florals, airy layers, and effortless tailoring for every hour.'
    }
];

const paletteOptions = [
    { name: 'Rose Quartz', color: '#f8c4d8' },
    { name: 'Champagne', color: '#fbe3c4' },
    { name: 'Aurora Lilac', color: '#cbb8ff' },
    { name: 'Midnight', color: '#21192f' }
];

const lookbookImages = [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=700&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80'
];

const events = [
    {
        title: 'Parisian Trunk Show',
        date: 'April 12 · Paris',
        description: 'Preview 14 unreleased gowns with our creative director.',
        spots: '12 spots left'
    },
    {
        title: 'Silk Painting Workshop',
        date: 'April 19 · New York',
        description: 'Learn brush techniques with our textile artists.',
        spots: '8 spots left'
    },
    {
        title: 'Celestial Couture Preview',
        date: 'May 4 · Milan',
        description: 'Exclusive runway preview for loyalty members.',
        spots: 'Waitlist open'
    }
];

const journalStories = [
    {
        title: 'Behind the seams of Midnight Sonata',
        tag: 'Atelier',
        excerpt: 'Hand-beaded constellations stitched with Swarovski crystals and starlight embroidery.',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80'
    },
    {
        title: 'How to style heirloom lace',
        tag: 'Styling',
        excerpt: 'Layer modern silhouettes over vintage lace for unexpected texture play.',
        image: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=800&q=80'
    },
    {
        title: 'Our path to regenerative silk',
        tag: 'Sustainability',
        excerpt: 'Partnering with mulberry farms that plant biodiversity corridors across Europe.',
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80'
    }
];

const testimonials = [
    {
        quote: 'Aurora reimagined my grandmother’s gown into something profoundly modern yet sentimental.',
        name: 'Isabella Hart',
        event: 'Florence garden wedding'
    },
    {
        quote: 'The virtual fitting was a dream — I landed my look in under 10 minutes.',
        name: 'Maya Chen',
        event: 'Singapore rooftop soirée'
    },
    {
        quote: 'Every alteration felt like a celebration. I have never twirled with more joy.',
        name: 'Noor Al-Masri',
        event: 'Dubai evening reception'
    }
];

const communityImages = [
    {
        image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=80',
        caption: 'Amelia &amp; the Celestial gown at Palais Garnier'
    },
    {
        image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=600&q=80',
        caption: 'Lara wearing Daydream Stories in Lisbon'
    },
    {
        image: 'https://images.unsplash.com/photo-1498931299472-c7fbc5945028?auto=format&fit=crop&w=600&q=80',
        caption: 'Zara’s custom velvet suit at the London Gala'
    },
    {
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
        caption: 'Eden’s playful reception look in Santorini'
    }
];

const stylistResponses = {
    'black-tie_romantic_lace': 'The Aurora Ripple with lace appliqués, paired with rose gold drop earrings.',
    'black-tie_dramatic_beading': 'Choose Midnight Sonata with dramatic cape sleeves and a crystal cuff.',
    'garden_romantic_movement': 'Slip into Whispering Meadow with soft tulle layers and floral crown.',
    'city_minimal_asymmetry': 'Velvet Dawn with sculpted asymmetrical neckline and sleek gloves.',
    'destination_playful_movement': 'Celestial Bloom with detachable train for beach-to-dance-floor magic.'
};

const formatCurrency = (value) => `$${value.toLocaleString()}`;

const hydrateTemplate = (template, data) => {
    const fragment = template.content.cloneNode(true);
    fragment.querySelectorAll('[data-name]').forEach((node) => {
        node.textContent = data.name;
    });
    fragment.querySelectorAll('[data-price]').forEach((node) => {
        node.textContent = formatCurrency(data.price);
    });
    fragment.querySelectorAll('[data-meta]').forEach((node) => {
        node.textContent = data.meta;
    });
    fragment.querySelectorAll('[data-image]').forEach((node) => {
        node.src = data.image;
    });
    fragment.querySelectorAll('[data-tag]').forEach((node) => {
        node.textContent = data.tag;
    });
    fragment.querySelectorAll('[data-date]').forEach((node) => {
        node.textContent = data.date;
    });
    fragment.querySelectorAll('[data-title]').forEach((node) => {
        node.textContent = data.title;
    });
    fragment.querySelectorAll('[data-description]').forEach((node) => {
        node.textContent = data.description;
    });
    fragment.querySelectorAll('[data-spots]').forEach((node) => {
        node.textContent = data.spots;
    });
    fragment.querySelectorAll('[data-quote]').forEach((node) => {
        node.textContent = data.quote;
    });
    fragment.querySelectorAll('[data-event]').forEach((node) => {
        node.textContent = data.event;
    });
    fragment.querySelectorAll('[data-tag]').forEach((node) => {
        node.textContent = data.tag;
    });
    fragment.querySelectorAll('[data-excerpt]').forEach((node) => {
        node.textContent = data.excerpt;
    });
    return fragment;
};

const scrollToTarget = (target) => {
    const section = document.querySelector(target);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

const populateCollections = () => {
    const container = document.querySelector('#collectionGrid');
    if (!container) return;
    container.innerHTML = '';
    collections.forEach((collection) => {
        const card = document.createElement('article');
        card.className = 'collection-card';
        card.dataset.collection = collection.tag.toLowerCase();
        card.innerHTML = `
            <div class="tag">${collection.tag}</div>
            <img src="${collection.image}" alt="${collection.name}" loading="lazy" />
            <h3>${collection.name}</h3>
            <p>${collection.description}</p>
            <button class="btn ghost" data-scroll-target="#book-fitting">Book fitting</button>
        `;
        container.append(card);
    });
};

const populateProducts = (items) => {
    const grid = document.querySelector('#productGrid');
    const template = document.querySelector('#productTemplate');
    if (!grid || !template) return;
    grid.innerHTML = '';
    items.forEach((item) => {
        const fragment = hydrateTemplate(template, item);
        fragment.querySelector('[data-image]').alt = `${item.name} dress`;
        fragment.firstElementChild.dataset.style = item.style;
        grid.append(fragment);
    });
};

const populateFilters = () => {
    const styleFilter = document.querySelector('#styleFilter');
    if (!styleFilter) return;
    const styles = [...new Set(products.map((product) => product.style))];
    styles.forEach((style) => {
        const option = document.createElement('option');
        option.value = style;
        option.textContent = style.replace('-', ' ');
        styleFilter.append(option);
    });
};

const populateLookbook = () => {
    const grid = document.querySelector('#lookbookGrid');
    if (!grid) return;
    grid.innerHTML = '';
    lookbookImages.forEach((image, index) => {
        const card = document.createElement('article');
        card.className = 'lookbook-card';
        card.innerHTML = `
            <img src="${image}" alt="Lookbook dress ${index + 1}" loading="lazy" />
            <span>Scene ${index + 1}</span>
        `;
        grid.append(card);
    });
};

const populateEvents = () => {
    const grid = document.querySelector('#eventsGrid');
    const template = document.querySelector('#eventTemplate');
    if (!grid || !template) return;
    grid.innerHTML = '';
    events.forEach((event) => {
        const fragment = hydrateTemplate(template, event);
        grid.append(fragment);
    });
};

const populateJournal = () => {
    const grid = document.querySelector('#journalGrid');
    const template = document.querySelector('#journalTemplate');
    if (!grid || !template) return;
    grid.innerHTML = '';
    journalStories.forEach((story) => {
        const fragment = hydrateTemplate(template, story);
        fragment.querySelector('[data-image]').alt = `${story.tag} journal story`;
        grid.append(fragment);
    });
};

const populateTestimonials = () => {
    const container = document.querySelector('#testimonialSlider');
    const template = document.querySelector('#testimonialTemplate');
    if (!container || !template) return;
    container.innerHTML = '';
    testimonials.forEach((testimonial) => {
        const fragment = hydrateTemplate(template, testimonial);
        container.append(fragment);
    });
    container.dataset.index = 0;
    updateTestimonialVisibility();
};

const updateTestimonialVisibility = () => {
    const slider = document.querySelector('#testimonialSlider');
    if (!slider) return;
    const cards = slider.querySelectorAll('.testimonial-card');
    const index = Number(slider.dataset.index || 0);
    cards.forEach((card, idx) => {
        card.style.display = idx === index ? 'grid' : 'none';
    });
};

const populateCommunity = () => {
    const feed = document.querySelector('#socialFeed');
    if (!feed) return;
    feed.innerHTML = '';
    communityImages.forEach((tile) => {
        const article = document.createElement('article');
        article.className = 'social-tile';
        article.innerHTML = `
            <img src="${tile.image}" alt="${tile.caption}" loading="lazy" />
            <div class="social-overlay"><span>${tile.caption}</span></div>
        `;
        feed.append(article);
    });
};

const setupPaletteSwatches = () => {
    const container = document.querySelector('#colorSwatches');
    if (!container) return;
    container.innerHTML = '';
    paletteOptions.forEach((option, index) => {
        const swatch = document.createElement('button');
        swatch.type = 'button';
        swatch.className = `swatch${index === 0 ? ' active' : ''}`;
        swatch.style.background = option.color;
        swatch.dataset.label = option.name;
        container.append(swatch);
    });
};

const setupCollectionFilters = () => {
    const chips = document.querySelectorAll('[data-collection-filter]');
    const cards = document.querySelectorAll('.collection-card');
    chips.forEach((chip) => {
        chip.addEventListener('click', () => {
            chips.forEach((c) => c.classList.remove('active'));
            chip.classList.add('active');
            const collection = chip.dataset.collectionFilter;
            cards.forEach((card) => {
                card.style.display = collection === 'all' || card.dataset.collection === collection ? 'grid' : 'none';
            });
        });
    });
};

const filterProducts = () => {
    const styleFilter = document.querySelector('#styleFilter');
    if (!styleFilter) return products;
    const value = styleFilter.value;
    if (value === 'all') return [...products];
    return products.filter((product) => product.style === value);
};

const sortProducts = (items) => {
    const sortFilter = document.querySelector('#sortFilter');
    if (!sortFilter) return items;
    const value = sortFilter.value;
    const cloned = [...items];
    if (value === 'low-high') {
        cloned.sort((a, b) => a.price - b.price);
    }
    if (value === 'high-low') {
        cloned.sort((a, b) => b.price - a.price);
    }
    return cloned;
};

const updateProductListing = () => {
    const filtered = filterProducts();
    const sorted = sortProducts(filtered);
    populateProducts(sorted);
};

const setupProductFilters = () => {
    document.querySelector('#styleFilter')?.addEventListener('change', updateProductListing);
    document.querySelector('#sortFilter')?.addEventListener('change', updateProductListing);
};

const wishlistState = new Set();

const updateWishlistLabel = () => {
    const toggle = document.querySelector('#wishlistToggle');
    if (toggle) toggle.textContent = `Wishlist (${wishlistState.size})`;
};

const renderWishlist = () => {
    const panel = document.querySelector('#wishlistPanel');
    const container = document.querySelector('#wishlistItems');
    if (!panel || !container) return;
    panel.classList.toggle('hidden', wishlistState.size === 0);
    container.innerHTML = '';
    wishlistState.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'wishlist-item';
        row.innerHTML = `<span>${item.name}</span><span>${formatCurrency(item.price)}</span>`;
        container.append(row);
    });
};

const handleProductActions = (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const card = button.closest('.product-card');
    const name = card?.querySelector('[data-name]')?.textContent;
    const product = products.find((item) => item.name === name);
    if (!product) return;
    const action = button.dataset.action;
    if (action === 'wishlist') {
        if (wishlistState.has(product)) {
            wishlistState.delete(product);
        } else {
            wishlistState.add(product);
        }
        updateWishlistLabel();
        renderWishlist();
    }
    if (action === 'bag') {
        openModal(`
            <h2>${product.name}</h2>
            <p>${product.meta}</p>
            <p class="product-price">${formatCurrency(product.price)}</p>
            <p>Our stylists will contact you within 24 hours to finalize sizing and delivery details.</p>
        `);
    }
    if (action === 'details') {
        openModal(`
            <h2>${product.name}</h2>
            <p>${product.meta}</p>
            <ul>
                <li>Available sizes: 0 – 20</li>
                <li>Complimentary alterations for 1 year</li>
                <li>Fabric swatches on request</li>
            </ul>
        `);
    }
};

const clearWishlist = () => {
    wishlistState.clear();
    updateWishlistLabel();
    renderWishlist();
};

const handleWishlistToggle = () => {
    const panel = document.querySelector('#wishlistPanel');
    panel?.classList.toggle('hidden');
};

const handleStylistSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const key = `${data.get('occasion')}_${data.get('mood')}_${data.get('detail')}`;
    const result = stylistResponses[key] || 'The atelier will curate three bespoke looks within 24 hours.';
    const output = document.querySelector('#stylistResult');
    if (output) {
        output.textContent = result;
        output.classList.remove('hidden');
    }
};

const handleDesignUpdate = () => {
    const silhouette = document.querySelector('#silhouetteSelect').value;
    const fabric = document.querySelector('#fabricSelect').value;
    const sparkles = document.querySelector('#sparkleToggle').checked;
    const train = document.querySelector('#trainToggle').checked;
    const swatch = document.querySelector('.swatch.active');
    const preview = document.querySelector('#designPreview');
    const label = document.querySelector('#designLabel');
    if (!preview || !label) return;
    preview.style.background = `linear-gradient(160deg, ${swatch?.style.background || '#f8c4d8'}, rgba(255, 214, 196, 0.4))`;
    label.textContent = `${silhouette.replace('-', ' ')} · ${fabric.replace('-', ' ')}`;
    if (sparkles) {
        preview.classList.add('sparkle');
    } else {
        preview.classList.remove('sparkle');
    }
    const trainAccent = document.querySelector('#trainAccent');
    trainAccent?.classList.toggle('visible', train);
};

const handleSwatchClick = (event) => {
    const target = event.target.closest('.swatch');
    if (!target) return;
    document.querySelectorAll('.swatch').forEach((swatch) => swatch.classList.remove('active'));
    target.classList.add('active');
    handleDesignUpdate();
};

const savedDesigns = [];

const handleSaveDesign = () => {
    const label = document.querySelector('#designLabel')?.textContent;
    const swatch = document.querySelector('.swatch.active')?.dataset.label;
    const sparkles = document.querySelector('#sparkleToggle').checked ? 'with stardust shimmer' : 'classic finish';
    const train = document.querySelector('#trainToggle').checked ? 'cathedral train' : 'no train';
    if (!label || !swatch) return;
    savedDesigns.unshift(`${label} · ${swatch} · ${sparkles}, ${train}`);
    const list = document.querySelector('#savedDesigns');
    if (list) {
        list.innerHTML = savedDesigns.map((item) => `<li>${item}</li>`).join('');
    }
};

const handleLookbookShuffle = () => {
    lookbookImages.sort(() => Math.random() - 0.5);
    populateLookbook();
};

const handleJournalShuffle = () => {
    journalStories.sort(() => Math.random() - 0.5);
    populateJournal();
};

const handleTestimonialNav = (direction) => {
    const slider = document.querySelector('#testimonialSlider');
    if (!slider) return;
    const cards = slider.querySelectorAll('.testimonial-card');
    const current = Number(slider.dataset.index || 0);
    const next = (current + direction + cards.length) % cards.length;
    slider.dataset.index = next;
    updateTestimonialVisibility();
};

const openModal = (content) => {
    const template = document.querySelector('#modalTemplate');
    if (!template) return;
    const fragment = template.content.cloneNode(true);
    fragment.querySelector('.modal-body').innerHTML = content;
    const modal = fragment.querySelector('.modal');
    document.body.append(modal);
    modal.addEventListener('click', (event) => {
        if (event.target.dataset.close !== undefined || event.target.classList.contains('modal-close')) {
            modal.remove();
        }
    });
};

const handleBookingSubmit = (event) => {
    event.preventDefault();
    const feedback = document.querySelector('#bookingFeedback');
    if (!feedback) return;
    feedback.textContent = 'Merci! A stylist will confirm with a curated itinerary within 12 hours.';
    event.target.reset();
};

const handleNewsletterSubmit = (event) => {
    event.preventDefault();
    const feedback = document.querySelector('#newsletterFeedback');
    if (!feedback) return;
    feedback.textContent = 'Welcome to Aurora Circle. Expect our next dispatch on Sunday moonrise.';
    event.target.reset();
};

const handleFaqToggle = (event) => {
    const question = event.target.closest('.faq-question');
    if (!question) return;
    const expanded = question.getAttribute('aria-expanded') === 'true';
    question.setAttribute('aria-expanded', String(!expanded));
};

const handleScrollButtons = (event) => {
    const target = event.target.closest('[data-scroll-target]');
    if (!target) return;
    const selector = target.getAttribute('data-scroll-target');
    if (selector) {
        event.preventDefault();
        scrollToTarget(selector);
    }
};

const handleBackToTop = () => {
    const button = document.querySelector('#backToTop');
    if (!button) return;
    button.classList.toggle('visible', window.scrollY > 300);
};

const handleThemeToggle = () => {
    const body = document.body;
    const toggle = document.querySelector('#themeToggle');
    const dark = body.classList.toggle('theme-dark');
    body.classList.toggle('theme-light', !dark);
    if (toggle) toggle.textContent = dark ? '🌙' : '☀️';
};

const init = () => {
    populateCollections();
    populateFilters();
    populateProducts(products);
    populateLookbook();
    populateEvents();
    populateJournal();
    populateTestimonials();
    populateCommunity();
    setupPaletteSwatches();
    setupCollectionFilters();
    setupProductFilters();
    updateWishlistLabel();
    renderWishlist();

    document.addEventListener('click', handleScrollButtons);
    document.addEventListener('click', handleProductActions);
    document.querySelector('#wishlistToggle')?.addEventListener('click', handleWishlistToggle);
    document.querySelector('#clearWishlist')?.addEventListener('click', clearWishlist);
    document.querySelector('#stylistForm')?.addEventListener('submit', handleStylistSubmit);
    document.querySelector('#silhouetteSelect')?.addEventListener('change', handleDesignUpdate);
    document.querySelector('#fabricSelect')?.addEventListener('change', handleDesignUpdate);
    document.querySelector('#sparkleToggle')?.addEventListener('change', handleDesignUpdate);
    document.querySelector('#trainToggle')?.addEventListener('change', handleDesignUpdate);
    document.querySelector('#colorSwatches')?.addEventListener('click', handleSwatchClick);
    document.querySelector('#saveDesign')?.addEventListener('click', handleSaveDesign);
    document.querySelector('#lookbookShuffle')?.addEventListener('click', handleLookbookShuffle);
    document.querySelector('#journalShuffle')?.addEventListener('click', handleJournalShuffle);
    document.querySelector('#testimonialPrev')?.addEventListener('click', () => handleTestimonialNav(-1));
    document.querySelector('#testimonialNext')?.addEventListener('click', () => handleTestimonialNav(1));
    document.querySelector('#bookingForm')?.addEventListener('submit', handleBookingSubmit);
    document.querySelector('#newsletterForm')?.addEventListener('submit', handleNewsletterSubmit);
    document.querySelector('#faqAccordion')?.addEventListener('click', handleFaqToggle);
    document.querySelector('#themeToggle')?.addEventListener('click', handleThemeToggle);
    document.querySelector('#backToTop')?.addEventListener('click', () => scrollToTarget('#top'));
    handleDesignUpdate();

    window.addEventListener('scroll', handleBackToTop);
    handleBackToTop();
};

document.addEventListener('DOMContentLoaded', init);
