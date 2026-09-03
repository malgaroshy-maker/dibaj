import { getFabricById } from '../data/fabrics.js';
import { buildWhatsAppUrl } from './common.js';

let currentFabric = null;
let currentSwatch = null;

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const fabricId = urlParams.get('id') || 'imperial-damask-gold';
  currentFabric = getFabricById(fabricId);
  currentSwatch = currentFabric.swatches[0];

  renderProductDetails();
  setupSwatchPicker();
  setupYardageCalculator();
  setupInquiryActions();
});

function renderProductDetails() {
  document.title = `${currentFabric.title} | شركة الديباج للمنسوجات`;

  // Breadcrumbs
  const breadcrumbCurrent = document.getElementById('breadcrumb-current-title');
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = currentFabric.title;

  // Header and tags
  const titleEl = document.getElementById('product-title');
  const badgeEl = document.getElementById('product-badge');
  const descEl = document.getElementById('product-desc');
  const catEl = document.getElementById('product-category');

  if (titleEl) titleEl.textContent = currentFabric.title;
  if (badgeEl) badgeEl.textContent = currentFabric.badge || currentFabric.categoryArabic;
  if (descEl) descEl.textContent = currentFabric.description;
  if (catEl) catEl.textContent = currentFabric.categoryArabic;

  // Specs
  const specList = document.getElementById('product-specs-list');
  if (specList) {
    specList.innerHTML = `
      <div class="spec-row"><strong>التركيب:</strong> <span>${currentFabric.composition}</span></div>
      <div class="spec-row"><strong>الكثافة والوزن:</strong> <span>${currentFabric.weight}</span></div>
      <div class="spec-row"><strong>العرض:</strong> <span>${currentFabric.width}</span></div>
      <div class="spec-row"><strong>المنشأ والحياكة:</strong> <span>${currentFabric.origin}</span></div>
      <div class="spec-row"><strong>مقاومة الاحتكاك:</strong> <span>${currentFabric.abrasionResistance}</span></div>
      <div class="spec-row"><strong>الاستخدام المثالي:</strong> <span>${currentFabric.idealFor}</span></div>
    `;
  }

  // Features list
  const featuresList = document.getElementById('product-features-list');
  if (featuresList) {
    featuresList.innerHTML = currentFabric.features.map(f => `
      <li class="feature-item">
        <span class="feature-bullet">✦</span>
        <span>${f}</span>
      </li>
    `).join('');
  }

  // Main Image
  updateMainImage(currentSwatch.image, currentSwatch.name);
}

function updateMainImage(imgUrl, altText) {
  const mainImg = document.getElementById('product-main-image');
  if (mainImg) {
    mainImg.style.opacity = '0.4';
    setTimeout(() => {
      mainImg.src = imgUrl;
      mainImg.alt = altText;
      mainImg.style.opacity = '1';
    }, 150);
  }
}

function setupSwatchPicker() {
  const swatchContainer = document.getElementById('product-swatches-container');
  const swatchNameEl = document.getElementById('active-swatch-name');
  const swatchDescEl = document.getElementById('active-swatch-desc');
  if (!swatchContainer) return;

  swatchContainer.innerHTML = currentFabric.swatches.map((swatch, idx) => `
    <div class="swatch-picker-item">
      <button type="button" 
              class="swatch-btn ${idx === 0 ? 'active' : ''}" 
              data-swatch-id="${swatch.id}"
              style="background-color: ${swatch.colorHex};"
              aria-label="${swatch.name}">
      </button>
      <span class="swatch-tooltip">${swatch.name}</span>
    </div>
  `).join('');

  if (swatchNameEl) swatchNameEl.textContent = currentSwatch.name;
  if (swatchDescEl) swatchDescEl.textContent = currentSwatch.textureDesc;

  swatchContainer.querySelectorAll('.swatch-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      swatchContainer.querySelectorAll('.swatch-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const swatchId = btn.getAttribute('data-swatch-id');
      currentSwatch = currentFabric.swatches.find(s => s.id === swatchId) || currentFabric.swatches[0];

      if (swatchNameEl) swatchNameEl.textContent = currentSwatch.name;
      if (swatchDescEl) swatchDescEl.textContent = currentSwatch.textureDesc;

      updateMainImage(currentSwatch.image, currentSwatch.name);
      updateActionLinks();
    });
  });

  updateActionLinks();
}

function updateActionLinks() {
  const waBtn = document.getElementById('product-wa-btn');
  if (waBtn) {
    const waUrl = buildWhatsAppUrl({
      fabricTitle: currentFabric.title,
      swatchName: currentSwatch.name,
      serviceType: currentFabric.categoryArabic
    });
    waBtn.href = waUrl;
  }
}

function setupYardageCalculator() {
  const widthInput = document.getElementById('calc-width');
  const heightInput = document.getElementById('calc-height');
  const fullnessSelect = document.getElementById('calc-fullness');
  const resultDisplay = document.getElementById('calc-result-meters');

  if (!widthInput || !heightInput || !fullnessSelect || !resultDisplay) return;

  const calculateMeters = () => {
    const width = parseFloat(widthInput.value) || 0;
    const height = parseFloat(heightInput.value) || 0;
    const fullness = parseFloat(fullnessSelect.value) || 2.0;

    if (width <= 0 || height <= 0) {
      resultDisplay.textContent = '0 متر';
      return;
    }

    // Fabric estimation formula: Total width with ripples / fabric width or drop
    const totalFabricWidth = width * fullness;
    // For standard 280-300cm width fabrics: running meters depends on window width
    const estimatedRunningMeters = (totalFabricWidth).toFixed(1);
    resultDisplay.textContent = `حوالي ${estimatedRunningMeters} متر طولي`;
  };

  widthInput.addEventListener('input', calculateMeters);
  heightInput.addEventListener('input', calculateMeters);
  fullnessSelect.addEventListener('change', calculateMeters);
  calculateMeters();
}

function setupInquiryActions() {
  const bookConsultationBtn = document.getElementById('product-consultation-btn');
  if (bookConsultationBtn) {
    bookConsultationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const productLabel = `${currentFabric.title} (خيار: ${currentSwatch.name})`;
      if (window.openConsultationModal) {
        window.openConsultationModal(productLabel);
      }
    });
  }
}
