/**
 * شركة الديباج — Universal Scripts
 * Specification: dibaj-rebuild-brief.md
 * Vanilla JS, Zero Dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroChoreography();
  initMobileDrawer();
  initQuoteModal();
  initCatalogTabs();
  initGalleryColorFilter();
});

/* --------------------------------------------------------------------------
   1. Hero Cross-Fade Choreography
   -------------------------------------------------------------------------- */
function initHeroChoreography() {
  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  // Check prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Trigger choreographed 3-second load cross-fade
  // emerald -> magenta -> damask -> settles on emerald
  requestAnimationFrame(() => {
    hero.classList.add('hero-animated');
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Navigation Drawer
   -------------------------------------------------------------------------- */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Universal Dual-Channel Quote Modal
   -------------------------------------------------------------------------- */
function initQuoteModal() {
  const modal = document.getElementById('quoteModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close');
  const openTriggers = document.querySelectorAll('[data-action="open-quote"]');
  const productSelect = modal.querySelector('#quoteProduct');
  const form = modal.querySelector('#quoteForm');
  const btnWhatsapp = modal.querySelector('#sendWhatsapp');
  const btnMessenger = modal.querySelector('#sendMessenger');

  function openModal(defaultProduct = '') {
    if (defaultProduct && productSelect) {
      productSelect.value = defaultProduct;
    }
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input, select, textarea');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const prod = btn.getAttribute('data-product') || '';
      openModal(prod);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Construct message text from form inputs
  function buildMessage() {
    const name = modal.querySelector('#quoteName')?.value.trim() || 'عميل كريم';
    const phone = modal.querySelector('#quotePhone')?.value.trim() || 'غير محدد';
    const product = modal.querySelector('#quoteProduct')?.value || 'استفسار عام';
    const fabric = modal.querySelector('#quoteFabric')?.value.trim() || 'حسب الاقتراح';
    const notes = modal.querySelector('#quoteNotes')?.value.trim() || 'لا توجد ملاحظات إضافية';

    return `مرحباً شركة الديباج،
أود طلب استشارة وعرض سعر بخصوص:
• الاسم: ${name}
• رقم الهاتف: ${phone}
• نوع الطلب: ${product}
• القماش واللون المفضل: ${fabric}
• ملاحظات: ${notes}

(مرسل عبر موقع الديباج الإلكتروني)`;
  }

  // WhatsApp Action
  if (btnWhatsapp) {
    btnWhatsapp.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = buildMessage();
      const phoneNum = '218915601703';
      const url = `https://wa.me/${phoneNum}?text=${encodeURIComponent(msg)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      closeModal();
    });
  }

  // Messenger Action
  if (btnMessenger) {
    btnMessenger.addEventListener('click', (e) => {
      e.preventDefault();
      // Facebook Page Messenger link
      const pageId = '100083410961417';
      const url = `https://m.me/${pageId}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      closeModal();
    });
  }
}

/* --------------------------------------------------------------------------
   4. Catalog Filter Tabs (salons.html, majlis.html)
   -------------------------------------------------------------------------- */
function initCatalogTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  if (!tabButtons.length || !productCards.length) return;

  function setFilter(filter) {
    tabButtons.forEach(btn => {
      if (btn.getAttribute('data-filter') === filter) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    productCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      setFilter(filter);
    });
  });

  // Check URL param ?style=modern or ?style=heritage
  const urlParams = new URLSearchParams(window.location.search);
  const styleParam = urlParams.get('style');
  if (styleParam) {
    setFilter(styleParam);
  }
}

/* --------------------------------------------------------------------------
   5. Color-First Gallery Filter (gallery.html)
   -------------------------------------------------------------------------- */
function initGalleryColorFilter() {
  const colorBtns = document.querySelectorAll('.gallery-color-tabs [data-color]');
  const galleryItems = document.querySelectorAll('.gallery-item[data-color]');

  if (!colorBtns.length || !galleryItems.length) return;

  function setColorFilter(color) {
    colorBtns.forEach(btn => {
      if (btn.getAttribute('data-color') === color) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    galleryItems.forEach(item => {
      const itemColor = item.getAttribute('data-color');
      if (color === 'all' || itemColor === color) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      setColorFilter(color);
    });
  });

  // Read URL param ?color=... from homepage Colour Rail
  const urlParams = new URLSearchParams(window.location.search);
  const colorParam = urlParams.get('color');
  if (colorParam) {
    setColorFilter(colorParam);
  }
}


