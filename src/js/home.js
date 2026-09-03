import { getFeaturedFabrics, FABRICS } from '../data/fabrics.js';
import { buildWhatsAppUrl } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  renderFeaturedCollections();
  setupHeroInteractions();
});

function renderFeaturedCollections() {
  const container = document.getElementById('featured-fabrics-grid');
  if (!container) return;

  const featured = getFeaturedFabrics();

  container.innerHTML = featured.map(fabric => {
    const swatchesHtml = fabric.swatches.map((swatch, idx) => `
      <span class="card-swatch-dot" 
            style="background-color: ${swatch.colorHex};" 
            title="${swatch.name}"
            data-img="${swatch.image}"
            data-fabric-id="${fabric.id}">
      </span>
    `).join('');

    return `
      <article class="catalog-card" id="card-${fabric.id}">
        <div class="card-media-wrapper">
          <img src="${fabric.mainImage}" alt="${fabric.title}" class="card-img" id="img-${fabric.id}" loading="lazy" />
          <span class="card-tag">${fabric.badge || fabric.categoryArabic}</span>
        </div>
        <div class="card-content">
          <span class="card-category">${fabric.categoryArabic}</span>
          <h3 class="card-title">${fabric.title}</h3>
          <p class="card-desc">${fabric.description}</p>
          
          <div class="card-swatches">
            <span style="font-size: 0.75rem; color: var(--color-chocolate-medium); margin-left: 6px;">خيارات الألوان:</span>
            ${swatchesHtml}
          </div>

          <div class="card-footer">
            <span class="card-price-hint">${fabric.weight} • ${fabric.origin.split('-')[0]}</span>
            <a href="product.html?id=${fabric.id}" class="btn btn-secondary-bespoke" style="padding: 0.45rem 1rem; font-size: 0.85rem;">
              تفاصيل وتخصيص
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Interactive swatch dot click updates the card image instantly
  container.querySelectorAll('.card-swatch-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const fabricId = dot.getAttribute('data-fabric-id');
      const imgUrl = dot.getAttribute('data-img');
      const cardImg = document.getElementById(`img-${fabricId}`);
      if (cardImg && imgUrl) {
        cardImg.src = imgUrl;
      }
    });
  });
}

function setupHeroInteractions() {
  const quickWaBtn = document.getElementById('hero-quick-wa-btn');
  if (quickWaBtn) {
    quickWaBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = buildWhatsAppUrl({
        serviceType: 'استفسار عن تفصيل الستائر الفاخرة والمجالس',
        notes: 'الاستفسار من الصفحة الرئيسية'
      });
      window.open(url, '_blank');
    });
  }
}
