/**
 * Dibaj Textiles - High-Resolution Universal Lightbox & Texture Inspector
 * Provides bank-grade, responsive image inspection with swatch/angle switching,
 * sequential product navigation, and direct customizer integration.
 */

import { FABRICS } from '../data/fabrics.js';

let currentProductIndex = 0;
let currentImageIndex = 0;
let isLightboxOpen = false;

// Gather all images for a product (main image + distinct swatch images)
function getProductImages(product) {
  if (!product) return [];
  const images = [{
    url: product.mainImage,
    title: product.title,
    desc: 'الصورة الرئيسية للموديل'
  }];

  if (Array.isArray(product.swatches)) {
    product.swatches.forEach(sw => {
      // Avoid exact duplicate main image url
      if (sw.image && sw.image !== product.mainImage) {
        images.push({
          url: sw.image,
          title: sw.name,
          desc: sw.textureDesc || 'تفاصيل وزوايا العينة'
        });
      }
    });
  }

  return images;
}

/**
 * Creates and injects the Lightbox DOM structure if missing
 */
function ensureLightboxDOM() {
  if (document.getElementById('dibaj-lightbox')) return;

  const lightboxHtml = `
    <div class="dibaj-lightbox-backdrop" id="dibaj-lightbox" role="dialog" aria-modal="true" aria-label="معاينة تفاصيل الموديل والأقمشة" style="display: none;">
      <div class="lightbox-dialog">
        <!-- Lightbox Header -->
        <div class="lightbox-header">
          <div class="lightbox-title-group">
            <span class="lightbox-badge" id="lightbox-product-category">صالون عصري</span>
            <h3 class="lightbox-title" id="lightbox-product-title">اسم الموديل</h3>
            <span class="lightbox-subtitle" id="lightbox-material-summary">خشب زان روماني مصمت · إسفنج 35 D معتمد · كفالة 10 سنوات</span>
          </div>
          <div class="lightbox-header-actions">
            <span class="lightbox-counter" id="lightbox-product-counter">1 / 13</span>
            <button type="button" class="lightbox-close-btn" id="lightbox-close-btn" aria-label="إغلاق المعاينة">✕</button>
          </div>
        </div>

        <!-- Lightbox Main Stage -->
        <div class="lightbox-stage-wrapper">
          <button type="button" class="lightbox-nav-btn lightbox-prev-btn" id="lightbox-prev-btn" aria-label="الموديل السابق" title="الموديل السابق (السهم الأيمن)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>

          <div class="lightbox-media-stage" id="lightbox-media-stage">
            <div class="lightbox-image-container">
              <img src="" alt="" id="lightbox-main-image" class="lightbox-image" />
              <div class="lightbox-img-caption" id="lightbox-img-caption">الزاوية المختارة</div>
            </div>
          </div>

          <button type="button" class="lightbox-nav-btn lightbox-next-btn" id="lightbox-next-btn" aria-label="الموديل التالي" title="الموديل التالي (السهم الأيسر)">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
        </div>

        <!-- Thumbnail Strip of Angles and Swatches -->
        <div class="lightbox-thumbnail-section">
          <div class="lightbox-thumbnail-label">الزوايا وعينات الألوان المتوفرة لهذا الموديل:</div>
          <div class="lightbox-thumbnail-strip" id="lightbox-thumbnail-strip">
            <!-- Populated dynamically -->
          </div>
        </div>

        <!-- Actions Footer -->
        <div class="lightbox-footer">
          <div class="lightbox-cta-group">
            <a href="#" id="lightbox-customizer-btn" class="btn btn-primary" style="padding: 0.85rem 1.6rem; font-size: 0.95rem; font-weight: 800;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" style="margin-left: 6px;"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              فتح في استوديو التخصيص
            </a>
            <a href="#" id="lightbox-whatsapp-btn" target="_blank" class="btn btn-whatsapp" style="padding: 0.85rem 1.4rem; font-size: 0.95rem;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style="margin-left: 6px;"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.974.553 1.776.848 2.796.848 3.181 0 5.767-2.586 5.767-5.766.001-3.18-2.585-5.767-5.767-5.767zm7.502 5.766c-.001 4.14-3.363 7.502-7.502 7.502-1.258 0-2.483-.314-3.57-.91l-3.961 1.039 1.057-3.864c-.658-1.144-1.026-2.433-1.025-3.767.001-4.14 3.363-7.502 7.502-7.502s7.499 3.363 7.499 7.502z"/></svg>
              استفسار مباشر عبر واتساب
            </a>
          </div>
          <div class="lightbox-hint">
            💡 اضغط Esc للإغلاق، أو استخدم الأسهم للتنقل بين الموديلات.
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', lightboxHtml);
  bindLightboxEvents();
}

function bindLightboxEvents() {
  const backdrop = document.getElementById('dibaj-lightbox');
  const closeBtn = document.getElementById('lightbox-close-btn');
  const prevBtn = document.getElementById('lightbox-prev-btn');
  const nextBtn = document.getElementById('lightbox-next-btn');

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', prevProduct);
  if (nextBtn) nextBtn.addEventListener('click', nextProduct);

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!isLightboxOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      // In RTL, right arrow is Previous
      e.preventDefault();
      prevProduct();
    } else if (e.key === 'ArrowLeft') {
      // In RTL, left arrow is Next
      e.preventDefault();
      nextProduct();
    }
  });

  // Touch swipe support on stage
  let touchStartX = 0;
  let touchEndX = 0;
  const stage = document.getElementById('lightbox-media-stage');
  if (stage) {
    stage.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    stage.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // Swipe Right -> RTL Prev
        prevProduct();
      } else {
        // Swipe Left -> RTL Next
        nextProduct();
      }
    }
  }
}

/**
 * Updates the contents of the Lightbox to display currentProductIndex & currentImageIndex
 */
function renderLightboxState() {
  const product = FABRICS[currentProductIndex];
  if (!product) return;

  const images = getProductImages(product);
  if (currentImageIndex >= images.length) currentImageIndex = 0;
  const currentImgObj = images[currentImageIndex] || { url: product.mainImage, title: product.title, desc: '' };

  const categoryEl = document.getElementById('lightbox-product-category');
  const titleEl = document.getElementById('lightbox-product-title');
  const summaryEl = document.getElementById('lightbox-material-summary');
  const counterEl = document.getElementById('lightbox-product-counter');
  const mainImg = document.getElementById('lightbox-main-image');
  const captionEl = document.getElementById('lightbox-img-caption');
  const thumbStrip = document.getElementById('lightbox-thumbnail-strip');
  const customizerBtn = document.getElementById('lightbox-customizer-btn');
  const waBtn = document.getElementById('lightbox-whatsapp-btn');

  if (categoryEl) categoryEl.textContent = product.categoryArabic || 'صالونات ومجالس';
  if (titleEl) titleEl.textContent = product.title;
  if (summaryEl) {
    const matText = product.composition ? product.composition.split('،')[0] : 'هيكل خشب زان مجفف';
    const foamText = product.weight ? product.weight : 'إسفنج 35 D معتمد';
    summaryEl.textContent = `${matText} · ${foamText} · كفالة مصنعية 10 سنوات`;
  }
  if (counterEl) counterEl.textContent = `${currentProductIndex + 1} / ${FABRICS.length}`;

  if (mainImg) {
    mainImg.src = currentImgObj.url;
    mainImg.alt = `${product.title} - ${currentImgObj.title}`;
  }

  if (captionEl) {
    captionEl.textContent = `${currentImgObj.title} (${currentImgObj.desc})`;
  }

  // Thumbnails
  if (thumbStrip) {
    thumbStrip.innerHTML = images.map((img, idx) => `
      <button type="button" class="lightbox-thumb-btn ${idx === currentImageIndex ? 'active' : ''}" 
              data-img-index="${idx}" aria-label="عرض ${img.title}">
        <img src="${img.url}" alt="${img.title}" />
      </button>
    `).join('');

    thumbStrip.querySelectorAll('.lightbox-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-img-index'), 10) || 0;
        selectImage(idx);
      });
    });
  }

  // Links
  if (customizerBtn) {
    customizerBtn.href = `product.html?id=${encodeURIComponent(product.id)}`;
    customizerBtn.textContent = product.category === 'curtains' ? 'تخصيص وتفصيل الستائر' : 'فتح في استوديو التخصيص';
  }

  if (waBtn) {
    const waText = encodeURIComponent(
      `السلام عليكم شركة الديباج، استفسر بخصوص موديل: ${product.title} (${product.categoryArabic}) المرفق في المعرض.`
    );
    waBtn.href = `https://wa.me/218915601703?text=${waText}`;
  }
}

export function openLightbox(productId, imageIndex = 0) {
  ensureLightboxDOM();

  const idx = FABRICS.findIndex(f => f.id === productId);
  currentProductIndex = idx !== -1 ? idx : 0;
  currentImageIndex = imageIndex;

  renderLightboxState();

  const backdrop = document.getElementById('dibaj-lightbox');
  if (backdrop) {
    backdrop.style.display = 'flex';
    // Trigger transition
    requestAnimationFrame(() => {
      backdrop.classList.add('open');
    });
  }

  document.body.style.overflow = 'hidden';
  isLightboxOpen = true;
}

export function closeLightbox() {
  const backdrop = document.getElementById('dibaj-lightbox');
  if (backdrop) {
    backdrop.classList.remove('open');
    setTimeout(() => {
      if (!isLightboxOpen) backdrop.style.display = 'none';
    }, 280);
  }

  document.body.style.overflow = '';
  isLightboxOpen = false;
}

export function nextProduct() {
  currentProductIndex = (currentProductIndex + 1) % FABRICS.length;
  currentImageIndex = 0;
  renderLightboxState();
}

export function prevProduct() {
  currentProductIndex = (currentProductIndex - 1 + FABRICS.length) % FABRICS.length;
  currentImageIndex = 0;
  renderLightboxState();
}

export function selectImage(index) {
  currentImageIndex = index;
  renderLightboxState();
}

/**
 * Initializes global click delegates on cards and triggers
 */
export function initLightbox() {
  ensureLightboxDOM();

  // Attach to existing or dynamic elements
  document.addEventListener('click', (e) => {
    // If click originated from interactive comparison slider or toolbar elements, ignore
    if (e.target.closest('.comparison-handle, .comparison-divider-line, .comparison-overlay, .comparison-toolbar, .btn-comparison-toggle')) {
      return;
    }

    const trigger = e.target.closest('[data-lightbox-product], .card-zoom-trigger, [data-action="open-lightbox"]');
    if (!trigger) return;

    // Prevent navigation if the trigger was clicked
    e.preventDefault();
    e.stopPropagation();

    const productId = trigger.getAttribute('data-lightbox-product') || trigger.getAttribute('data-product-id');
    const imageIndex = parseInt(trigger.getAttribute('data-image-index'), 10) || 0;

    if (productId) {
      openLightbox(productId, imageIndex);
    }
  });

  window.openDibajLightbox = openLightbox;
  window.closeDibajLightbox = closeLightbox;
}
