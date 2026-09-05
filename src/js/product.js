import { FABRICS, getFabricById } from '../data/fabrics.js';

let currentFabric = null;
let currentSwatch = null;
let currentShape = 'l-shape';
let currentFoam = '35D';
let wantHomeMeasurement = true;
let dimensionMode = 'manual'; // 'manual' | 'help'

let comparisonState = {
  isActive: false,
  mode: 'color', // 'color' | 'curtain'
  targetSwatch: null,
  targetCurtain: null,
  sliderPos: 50,
  includeCurtainsInOrder: true,
  windowWidth: 3.0
};

const shapeState = {
  'l-shape': { sideA: 3.5, sideB: 2.5, depth: 85 },
  'u-shape': { sideA: 3.0, sideB: 4.0, sideC: 3.0, depth: 85 },
  'classic-set': { sofa3: 1, sofa2: 1, chair1: 2 },
  'majlis-floor': { perimeter: 12.0, depth: 80 }
};

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialId = urlParams.get('id') || 'salon-emerald-velvet';

  initCustomizerStudio(initialId);
});

function initCustomizerStudio(initialId) {
  currentFabric = getFabricById(initialId);
  currentSwatch = currentFabric.swatches[0];

  setupCategoryFilters();
  renderModelRibbon('all');
  setupShapeSelector();
  setupDimensionModeSelector();
  setupFoamSelector();
  setupHomeMeasurementToggle();
  setupInquiryActions();
  setupComparisonStudio();

  selectModel(currentFabric.id, false);
}

function setupCategoryFilters() {
  const filterBtns = document.querySelectorAll('.studio-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';
      renderModelRibbon(filter);
    });
  });
}

function renderModelRibbon(filter = 'all') {
  const ribbon = document.getElementById('studio-model-ribbon');
  if (!ribbon) return;

  const filtered = filter === 'all' 
    ? FABRICS 
    : FABRICS.filter(f => f.category === filter);

  ribbon.innerHTML = filtered.map(fabric => {
    const isActive = currentFabric && currentFabric.id === fabric.id;
    return `
      <div class="model-ribbon-card ${isActive ? 'active' : ''}" 
           data-id="${fabric.id}" 
           role="button" 
           tabindex="0" 
           aria-label="اختر ${fabric.title}">
        <img class="model-ribbon-thumb" 
             src="${fabric.mainImage}" 
             alt="${fabric.title}" 
             loading="lazy" />
        <div class="model-ribbon-info">
          <div class="model-ribbon-title">${fabric.title}</div>
          <div class="model-ribbon-category">${fabric.categoryArabic}</div>
        </div>
      </div>
    `;
  }).join('');

  ribbon.querySelectorAll('.model-ribbon-card').forEach(card => {
    card.addEventListener('click', () => {
      const fabricId = card.getAttribute('data-id');
      selectModel(fabricId, true);
    });
  });
}

function selectModel(fabricId, updateUrl = true) {
  currentFabric = getFabricById(fabricId);
  currentSwatch = currentFabric.swatches[0];

  if (updateUrl) {
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('id', currentFabric.id);
    window.history.replaceState(null, '', newUrl);
  }

  // Update Ribbon active card
  document.querySelectorAll('.model-ribbon-card').forEach(c => {
    if (c.getAttribute('data-id') === currentFabric.id) {
      c.classList.add('active');
      c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } else {
      c.classList.remove('active');
    }
  });

  // Initialize comparison targets for this model
  comparisonState.targetSwatch = currentFabric.swatches.find(s => s.id !== currentSwatch.id) || currentFabric.swatches[0];
  const curtains = getCuratedCurtainsForFabric(currentFabric);
  comparisonState.targetCurtain = curtains[0];

  renderProductDetails();
  setupSwatchPicker();
  renderDimensionInputs();
  updateComparisonUI();
  calculateCustomSpecs();
}

function renderProductDetails() {
  document.title = `${currentFabric.title} | استوديو التخصيص والتفصيل — شركة الديباج`;

  const breadcrumbCurrent = document.getElementById('breadcrumb-current-title');
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = currentFabric.title;

  const titleEl = document.getElementById('product-title');
  const badgeEl = document.getElementById('product-badge');
  const descEl = document.getElementById('product-desc');
  const catEl = document.getElementById('product-category');

  if (titleEl) titleEl.textContent = currentFabric.title;
  if (badgeEl) badgeEl.textContent = currentFabric.badge || currentFabric.categoryArabic;
  if (descEl) descEl.textContent = currentFabric.description;
  if (catEl) catEl.textContent = currentFabric.categoryArabic;

  // Technical Specs Table
  const specList = document.getElementById('product-specs-list');
  if (specList) {
    specList.innerHTML = `
      <div class="spec-row"><strong>التركيب:</strong> <span>${currentFabric.composition}</span></div>
      <div class="spec-row"><strong>الكثافة والوزن:</strong> <span>${currentFabric.weight}</span></div>
      <div class="spec-row"><strong>العرض والمقاس:</strong> <span>${currentFabric.width}</span></div>
      <div class="spec-row"><strong>المنشأ والحياكة:</strong> <span>${currentFabric.origin}</span></div>
      <div class="spec-row"><strong>مقاومة الاحتكاك:</strong> <span>${currentFabric.abrasionResistance}</span></div>
      <div class="spec-row"><strong>الاستخدام المثالي:</strong> <span>${currentFabric.idealFor}</span></div>
    `;
  }

  // Features
  const featuresList = document.getElementById('product-features-list');
  if (featuresList) {
    featuresList.innerHTML = currentFabric.features.map(f => `
      <li class="feature-item">
        <span class="feature-bullet">✦</span>
        <span>${f}</span>
      </li>
    `).join('');
  }

  updateMainImage(currentSwatch.image, currentSwatch.name);
}

function updateMainImage(imgUrl, altText) {
  const mainImg = document.getElementById('product-main-image');
  if (mainImg) {
    mainImg.style.opacity = '0.35';
    setTimeout(() => {
      mainImg.src = imgUrl;
      mainImg.alt = altText;
      mainImg.style.opacity = '1';
    }, 120);
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
      updateComparisonUI();
      calculateCustomSpecs();
    });
  });
}

function setupShapeSelector() {
  const shapeCards = document.querySelectorAll('.shape-card');
  shapeCards.forEach(card => {
    card.addEventListener('click', () => {
      shapeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentShape = card.getAttribute('data-shape') || 'l-shape';
      renderDimensionInputs();
      calculateCustomSpecs();
    });
  });
}

function renderDimensionInputs() {
  const container = document.getElementById('dynamic-dimension-inputs');
  if (!container) return;

  const s = shapeState[currentShape];

  if (currentShape === 'l-shape') {
    container.innerHTML = `
      <div class="dimension-grid">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.82rem;">طول الضلع الأول (A):</label>
          <div class="input-unit-group">
            <input type="number" id="dim-side-a" class="form-control" value="${s.sideA}" step="0.2" min="1.5" max="10.0" />
            <span class="input-unit-tag">متر</span>
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.82rem;">طول الضلع الثاني (B):</label>
          <div class="input-unit-group">
            <input type="number" id="dim-side-b" class="form-control" value="${s.sideB}" step="0.2" min="1.5" max="10.0" />
            <span class="input-unit-tag">متر</span>
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.82rem;">عمق المقعد:</label>
          <div class="input-unit-group">
            <input type="number" id="dim-depth" class="form-control" value="${s.depth}" step="5" min="70" max="110" />
            <span class="input-unit-tag">سم</span>
          </div>
        </div>
      </div>
      <p style="font-size: 0.75rem; color: var(--color-chocolate-medium); margin-top: 0.5rem; margin-bottom: 0;">
        💡 نصيحة: الضلع الأطول يوضع عادة في مواجهة واجهة الصالة أو التلفزيون، مع ارتداد مريح عن الأبواب.
      </p>
    `;
  } else if (currentShape === 'u-shape') {
    container.innerHTML = `
      <div class="dimension-grid">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.82rem;">الضلع الأيمن (A):</label>
          <div class="input-unit-group">
            <input type="number" id="dim-side-a" class="form-control" value="${s.sideA}" step="0.2" min="1.5" max="8.0" />
            <span class="input-unit-tag">متر</span>
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.82rem;">الضلع الأوسط (B):</label>
          <div class="input-unit-group">
            <input type="number" id="dim-side-b" class="form-control" value="${s.sideB}" step="0.2" min="2.0" max="10.0" />
            <span class="input-unit-tag">متر</span>
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.82rem;">الضلع الأيسر (C):</label>
          <div class="input-unit-group">
            <input type="number" id="dim-side-c" class="form-control" value="${s.sideC}" step="0.2" min="1.5" max="8.0" />
            <span class="input-unit-tag">متر</span>
          </div>
        </div>
      </div>
    `;
  } else if (currentShape === 'classic-set') {
    container.innerHTML = `
      <div class="dimension-grid">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.82rem;">كنبة ثلاثية (3 مقاعد):</label>
          <div class="input-unit-group">
            <input type="number" id="dim-sofa-3" class="form-control" value="${s.sofa3}" step="1" min="0" max="5" />
            <span class="input-unit-tag">قطعة</span>
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.82rem;">كنبة ثنائية (2 مقعد):</label>
          <div class="input-unit-group">
            <input type="number" id="dim-sofa-2" class="form-control" value="${s.sofa2}" step="1" min="0" max="5" />
            <span class="input-unit-tag">قطعة</span>
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.82rem;">كرسي مفرد (فوتيه/ونجباك):</label>
          <div class="input-unit-group">
            <input type="number" id="dim-chair-1" class="form-control" value="${s.chair1}" step="1" min="0" max="8" />
            <span class="input-unit-tag">قطعة</span>
          </div>
        </div>
      </div>
    `;
  } else if (currentShape === 'majlis-floor') {
    container.innerHTML = `
      <div class="dimension-grid">
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.82rem;">محيط جدران المجلس الإجمالي:</label>
          <div class="input-unit-group">
            <input type="number" id="dim-perimeter" class="form-control" value="${s.perimeter}" step="0.5" min="4.0" max="35.0" />
            <span class="input-unit-tag">متر</span>
          </div>
        </div>
        <div class="form-group" style="margin-bottom: 0;">
          <label class="form-label" style="font-size: 0.82rem;">عمق المسند والفرشة:</label>
          <div class="input-unit-group">
            <input type="number" id="dim-depth" class="form-control" value="${s.depth}" step="5" min="65" max="100" />
            <span class="input-unit-tag">سم</span>
          </div>
        </div>
      </div>
    `;
  }

  // Bind input changes to state and recalculate
  container.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
      syncDimensionsFromInputs();
      calculateCustomSpecs();
    });
  });
}

function syncDimensionsFromInputs() {
  const s = shapeState[currentShape];
  if (currentShape === 'l-shape') {
    const a = parseFloat(document.getElementById('dim-side-a')?.value) || s.sideA;
    const b = parseFloat(document.getElementById('dim-side-b')?.value) || s.sideB;
    const d = parseFloat(document.getElementById('dim-depth')?.value) || s.depth;
    s.sideA = a; s.sideB = b; s.depth = d;
  } else if (currentShape === 'u-shape') {
    const a = parseFloat(document.getElementById('dim-side-a')?.value) || s.sideA;
    const b = parseFloat(document.getElementById('dim-side-b')?.value) || s.sideB;
    const c = parseFloat(document.getElementById('dim-side-c')?.value) || s.sideC;
    s.sideA = a; s.sideB = b; s.sideC = c;
  } else if (currentShape === 'classic-set') {
    const s3 = parseInt(document.getElementById('dim-sofa-3')?.value) || 0;
    const s2 = parseInt(document.getElementById('dim-sofa-2')?.value) || 0;
    const c1 = parseInt(document.getElementById('dim-chair-1')?.value) || 0;
    s.sofa3 = s3; s.sofa2 = s2; s.chair1 = c1;
  } else if (currentShape === 'majlis-floor') {
    const p = parseFloat(document.getElementById('dim-perimeter')?.value) || s.perimeter;
    const d = parseFloat(document.getElementById('dim-depth')?.value) || s.depth;
    s.perimeter = p; s.depth = d;
  }
}

function setupDimensionModeSelector() {
  const radios = document.querySelectorAll('input[name="dim-mode"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      dimensionMode = radio.value;
      const dynamicInputs = document.getElementById('dynamic-dimension-inputs');
      const helpNotice = document.getElementById('dimension-help-notice');
      if (dimensionMode === 'help') {
        if (dynamicInputs) dynamicInputs.style.display = 'none';
        if (helpNotice) helpNotice.style.display = 'block';
      } else {
        if (dynamicInputs) dynamicInputs.style.display = 'block';
        if (helpNotice) helpNotice.style.display = 'none';
      }
      calculateCustomSpecs();
    });
  });
}

function setupFoamSelector() {
  const radios = document.querySelectorAll('input[name="foam-density"]');
  radios.forEach(radio => {
    radio.addEventListener('change', () => {
      currentFoam = radio.value;
      calculateCustomSpecs();
    });
  });
}

function setupHomeMeasurementToggle() {
  const check = document.getElementById('home-measurement-check');
  if (check) {
    check.addEventListener('change', () => {
      wantHomeMeasurement = check.checked;
      calculateCustomSpecs();
    });
  }
}

function calculateCustomSpecs() {
  const shapeNames = {
    'l-shape': 'شكل زاوية (L-Shape)',
    'u-shape': 'شكل حدوة (U-Shape)',
    'classic-set': 'طقم كلاسيك مستقل',
    'majlis-floor': 'مجلس عربي متصل'
  };

  const foamLabels = {
    '35D': 'إسفنج 35 D ضغط عالي معتمد',
    'RoyalSoft': 'حشوة سوفت رويال مزدوجة فاخرة',
    '30D': 'إسفنج 30 D ضغط متوسط'
  };

  const s = shapeState[currentShape];
  let dimText = '';
  if (dimensionMode === 'help') {
    dimText = 'معاينة فنية لرفع المقاسات بالمنزل (طرابلس)';
  } else {
    if (currentShape === 'l-shape') {
      dimText = `ضلع A: ${s.sideA}م × ضلع B: ${s.sideB}م (عمق: ${s.depth}سم)`;
    } else if (currentShape === 'u-shape') {
      dimText = `ضلع A: ${s.sideA}م × وسط B: ${s.sideB}م × ضلع C: ${s.sideC}م (عمق: ${s.depth}سم)`;
    } else if (currentShape === 'classic-set') {
      dimText = `ثلاثية: ${s.sofa3} قطع، ثنائية: ${s.sofa2} قطع، مفرد: ${s.chair1} قطع`;
    } else if (currentShape === 'majlis-floor') {
      dimText = `محيط المجلس: ${s.perimeter}م (عمق: ${s.depth}سم)`;
    }
  }

  // Update Technical Specification Summary Cards
  const fabricEl = document.getElementById('summary-spec-fabric');
  const shapeEl = document.getElementById('summary-spec-shape');
  const dimEl = document.getElementById('summary-spec-dimensions');
  const foamEl = document.getElementById('summary-spec-foam');
  const curtainBadge = document.getElementById('summary-curtains-badge');
  const curtainValEl = document.getElementById('summary-spec-curtains');

  if (fabricEl) fabricEl.textContent = `${currentSwatch ? currentSwatch.name : currentFabric.title} (${currentFabric.title})`;
  if (shapeEl) shapeEl.textContent = shapeNames[currentShape] || currentShape;
  if (dimEl) dimEl.textContent = dimText;
  if (foamEl) foamEl.textContent = foamLabels[currentFoam] || currentFoam;

  // Curtain coordination summary badge
  const hasCurtain = comparisonState.mode === 'curtain' && 
                     comparisonState.includeCurtainsInOrder && 
                     comparisonState.targetCurtain;

  if (curtainBadge && curtainValEl) {
    if (hasCurtain) {
      curtainBadge.style.display = 'flex';
      curtainValEl.textContent = `مشمولة: ${comparisonState.targetCurtain.title} (عرض ${comparisonState.windowWidth} م)`;
    } else {
      curtainBadge.style.display = 'none';
    }
  }

  updateActionLinks(dimText, shapeNames, foamLabels);
}

function updateActionLinks(dimText, shapeNames, foamLabels) {
  const hasCurtain = comparisonState.mode === 'curtain' && 
                     comparisonState.includeCurtainsInOrder && 
                     comparisonState.targetCurtain;

  const curtainLines = hasCurtain ? [
    '',
    `🪟 الستائر المرافقة المنسقة: ${comparisonState.targetCurtain.title}`,
    `📐 عرض جدار النافذة: ${comparisonState.windowWidth} متر`
  ] : [];

  const waMessage = [
    'السلام عليكم ورحمة الله — شركة الديباج،',
    'أرغب في طلب عرض سعر رسمي للمواصفات التالية:',
    '',
    `🛋️ الموديل: ${currentFabric.title} (${currentFabric.categoryArabic})`,
    `🎨 القماش واللون المختار: ${currentSwatch ? currentSwatch.name : ''}`,
    `📐 شكل الجلسة: ${shapeNames[currentShape]}`,
    `📏 المقاسات: ${dimText}`,
    `🧽 نوع الإسفنج: ${foamLabels[currentFoam]}`,
    ...curtainLines,
    '',
    'يرجى التكرم بموافاتي بعرض السعر الرسمي والمواعيد المتاحة للتنفيذ بمصنع باب بن غشير. شكراً لكم.'
  ].join('\n');

  const waBtn = document.getElementById('product-wa-btn');
  if (waBtn) {
    waBtn.href = `https://wa.me/218915601703?text=${encodeURIComponent(waMessage)}`;
  }
}

/* --------------------------------------------------------------------------
   Curated Curtains Matching Logic
   -------------------------------------------------------------------------- */
function getCuratedCurtainsForFabric(fabric) {
  const allCurtains = FABRICS.filter(f => f.category === 'curtains');
  if (!allCurtains.length) return [];
  
  let preferredId = 'curtains-emerald-silk';
  const fid = (fabric?.id || '').toLowerCase();
  if (fid.includes('emerald')) {
    preferredId = 'curtains-emerald-silk';
  } else if (fid.includes('boucle') || fid.includes('cream') || fid.includes('taupe') || fid.includes('suede')) {
    preferredId = 'curtains-sheer-bronze';
  } else if (fid.includes('navy') || fid.includes('majlis') || fid.includes('terracotta') || fid.includes('ornate')) {
    preferredId = 'curtains-royal-navy';
  } else {
    preferredId = 'curtains-gold-damask';
  }

  return allCurtains.slice().sort((a, b) => {
    if (a.id === preferredId) return -1;
    if (b.id === preferredId) return 1;
    return 0;
  });
}

/* --------------------------------------------------------------------------
   Comparison Studio Setup & Handlers
   -------------------------------------------------------------------------- */
function setupComparisonStudio() {
  const toggleBtn = document.getElementById('toggle-comparison-btn');
  const toolbar = document.getElementById('comparison-toolbar');
  const controlsPanel = document.getElementById('comparison-controls-panel');
  const splitWrapper = document.getElementById('comparison-split-wrapper');
  const colorTab = document.getElementById('comp-mode-color-btn');
  const curtainTab = document.getElementById('comp-mode-curtain-btn');
  const curtainCard = document.getElementById('coordinated-curtains-card');
  const curtainCheck = document.getElementById('include-curtain-order-check');
  const windowWidthInput = document.getElementById('curtain-window-width');
  const mainViewBox = document.getElementById('product-main-view-box');
  const dividerLine = document.getElementById('comparison-divider-line');
  const handle = document.getElementById('comparison-handle');
  const overlay = document.getElementById('comparison-overlay');

  if (!toggleBtn) return;

  // Toggle button handler
  toggleBtn.addEventListener('click', () => {
    comparisonState.isActive = !comparisonState.isActive;
    toggleBtn.classList.toggle('active', comparisonState.isActive);
    toggleBtn.setAttribute('aria-pressed', comparisonState.isActive ? 'true' : 'false');
    toolbar?.classList.toggle('active-mode', comparisonState.isActive);
    
    if (controlsPanel) controlsPanel.style.display = comparisonState.isActive ? 'flex' : 'none';
    if (splitWrapper) splitWrapper.style.display = comparisonState.isActive ? 'block' : 'none';
    
    if (curtainCard) {
      curtainCard.style.display = (comparisonState.isActive && comparisonState.mode === 'curtain') ? 'block' : 'none';
    }

    if (comparisonState.isActive) {
      updateComparisonUI();
    } else {
      calculateCustomSpecs();
    }
  });

  // Mode switcher
  colorTab?.addEventListener('click', () => {
    comparisonState.mode = 'color';
    colorTab.classList.add('active');
    curtainTab?.classList.remove('active');
    if (curtainCard) curtainCard.style.display = 'none';
    updateComparisonUI();
  });

  curtainTab?.addEventListener('click', () => {
    comparisonState.mode = 'curtain';
    curtainTab.classList.add('active');
    colorTab?.classList.remove('active');
    if (curtainCard && comparisonState.isActive) curtainCard.style.display = 'block';
    updateComparisonUI();
  });

  // Curtain card controls
  curtainCheck?.addEventListener('change', () => {
    comparisonState.includeCurtainsInOrder = curtainCheck.checked;
    calculateCustomSpecs();
  });

  windowWidthInput?.addEventListener('input', () => {
    const val = parseFloat(windowWidthInput.value) || 3.0;
    comparisonState.windowWidth = Math.max(0.5, val);
    const hintEl = document.getElementById('curtain-meters-hint');
    if (hintEl) {
      hintEl.textContent = `(حوالي ${(comparisonState.windowWidth * 2.2).toFixed(1)} م قماش بثنيات 2.2×)`;
    }
    calculateCustomSpecs();
  });

  // Slider Dragging (Pointer Events)
  let isDragging = false;

  function updateSliderPosition(clientX) {
    if (!mainViewBox || !overlay || !dividerLine || !handle) return;
    const rect = mainViewBox.getBoundingClientRect();
    if (rect.width <= 0) return;
    let percentage = ((clientX - rect.left) / rect.width) * 100;
    percentage = Math.max(5, Math.min(95, percentage));
    comparisonState.sliderPos = percentage;

    overlay.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    dividerLine.style.left = `${percentage}%`;
    handle.setAttribute('aria-valuenow', Math.round(percentage));
  }

  function onPointerDown(e) {
    isDragging = true;
    updateSliderPosition(e.clientX);
    if (handle) handle.setPointerCapture?.(e.pointerId);
    e.preventDefault();
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    updateSliderPosition(e.clientX);
  }

  function onPointerUp(e) {
    if (isDragging) {
      isDragging = false;
      if (handle && handle.hasPointerCapture?.(e.pointerId)) {
        handle.releasePointerCapture(e.pointerId);
      }
    }
  }

  handle?.addEventListener('pointerdown', onPointerDown);
  dividerLine?.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  // Keyboard accessibility
  handle?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      comparisonState.sliderPos = Math.min(95, comparisonState.sliderPos + 5);
      updateSliderPositionFromState();
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      comparisonState.sliderPos = Math.max(5, comparisonState.sliderPos - 5);
      updateSliderPositionFromState();
      e.preventDefault();
    }
  });

  function updateSliderPositionFromState() {
    if (!overlay || !dividerLine || !handle) return;
    const p = comparisonState.sliderPos;
    overlay.style.clipPath = `polygon(0 0, ${p}% 0, ${p}% 100%, 0 100%)`;
    dividerLine.style.left = `${p}%`;
    handle.setAttribute('aria-valuenow', Math.round(p));
  }
}

/* --------------------------------------------------------------------------
   Comparison UI Refresh
   -------------------------------------------------------------------------- */
function updateComparisonUI() {
  const targetBar = document.getElementById('comparison-target-bar');
  const overlayImg = document.getElementById('comparison-overlay-image');
  const baseLabel = document.getElementById('slider-base-text');
  const compareLabel = document.getElementById('slider-compare-text');
  const curtainCard = document.getElementById('coordinated-curtains-card');

  if (baseLabel && currentSwatch) {
    baseLabel.textContent = `الأساسي: ${currentSwatch.name}`;
  }

  if (comparisonState.mode === 'color') {
    // Mode A: Color swatches of current fabric
    const availableSwatches = currentFabric.swatches;
    if (!comparisonState.targetSwatch || comparisonState.targetSwatch.id === currentSwatch?.id) {
      comparisonState.targetSwatch = availableSwatches.find(s => s.id !== currentSwatch?.id) || availableSwatches[0];
    }

    if (targetBar) {
      targetBar.innerHTML = `
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-chocolate-dark);">قارن مع درجة:</span>
        ${availableSwatches.map(sw => {
          const isActive = comparisonState.targetSwatch?.id === sw.id;
          return `
            <button type="button" class="comp-swatch-chip ${isActive ? 'active' : ''}" data-swatch-id="${sw.id}">
              <span class="comp-swatch-dot" style="background-color: ${sw.colorHex};"></span>
              <span>${sw.name}</span>
            </button>
          `;
        }).join('')}
      `;

      targetBar.querySelectorAll('.comp-swatch-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const swId = chip.getAttribute('data-swatch-id');
          comparisonState.targetSwatch = availableSwatches.find(s => s.id === swId) || availableSwatches[0];
          updateComparisonUI();
        });
      });
    }

    if (overlayImg && comparisonState.targetSwatch) {
      overlayImg.src = comparisonState.targetSwatch.image;
      overlayImg.alt = comparisonState.targetSwatch.name;
    }

    if (compareLabel && comparisonState.targetSwatch) {
      compareLabel.textContent = `المقارنة: ${comparisonState.targetSwatch.name}`;
    }

    if (curtainCard) curtainCard.style.display = 'none';

  } else {
    // Mode B: Curated Curtains Coordination
    const curtains = getCuratedCurtainsForFabric(currentFabric);
    if (!comparisonState.targetCurtain || !curtains.find(c => c.id === comparisonState.targetCurtain.id)) {
      comparisonState.targetCurtain = curtains[0];
    }

    if (targetBar) {
      targetBar.innerHTML = `
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-chocolate-dark);">الستائر المطابقة:</span>
        ${curtains.map(curt => {
          const isActive = comparisonState.targetCurtain?.id === curt.id;
          return `
            <button type="button" class="comp-swatch-chip ${isActive ? 'active' : ''}" data-curtain-id="${curt.id}">
              <span>🪟 ${curt.title.replace('ستائر ', '')}</span>
            </button>
          `;
        }).join('')}
      `;

      targetBar.querySelectorAll('.comp-swatch-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const cId = chip.getAttribute('data-curtain-id');
          comparisonState.targetCurtain = curtains.find(c => c.id === cId) || curtains[0];
          updateComparisonUI();
        });
      });
    }

    if (overlayImg && comparisonState.targetCurtain) {
      overlayImg.src = comparisonState.targetCurtain.mainImage;
      overlayImg.alt = comparisonState.targetCurtain.title;
    }

    if (compareLabel && comparisonState.targetCurtain) {
      compareLabel.textContent = `ستارة مرافقة: ${comparisonState.targetCurtain.title}`;
    }

    // Update Curtains Customization Card
    if (curtainCard && comparisonState.isActive) {
      curtainCard.style.display = 'block';
      const thumb = document.getElementById('curtain-card-thumb');
      const titleEl = document.getElementById('curtain-card-title');
      const descEl = document.getElementById('curtain-card-desc');
      const hintEl = document.getElementById('curtain-meters-hint');

      if (thumb) thumb.src = comparisonState.targetCurtain.mainImage;
      if (titleEl) titleEl.textContent = comparisonState.targetCurtain.title;
      if (descEl) descEl.textContent = comparisonState.targetCurtain.description;
      if (hintEl) {
        hintEl.textContent = `(حوالي ${(comparisonState.windowWidth * 2.2).toFixed(1)} م قماش بثنيات 2.2×)`;
      }
    }
  }

  // Ensure slider clipPath is applied
  const overlay = document.getElementById('comparison-overlay');
  const dividerLine = document.getElementById('comparison-divider-line');
  const handle = document.getElementById('comparison-handle');
  if (overlay && dividerLine) {
    overlay.style.clipPath = `polygon(0 0, ${comparisonState.sliderPos}% 0, ${comparisonState.sliderPos}% 100%, 0 100%)`;
    dividerLine.style.left = `${comparisonState.sliderPos}%`;
    if (handle) handle.setAttribute('aria-valuenow', Math.round(comparisonState.sliderPos));
  }

  calculateCustomSpecs();
}

function setupInquiryActions() {
  const bookConsultationBtn = document.getElementById('product-consultation-btn');
  if (bookConsultationBtn) {
    bookConsultationBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const s = shapeState[currentShape];
      const shapeNames = {
        'l-shape': 'شكل زاوية (L)',
        'u-shape': 'شكل حدوة (U)',
        'classic-set': 'طقم كلاسيك',
        'majlis-floor': 'مجلس متصل'
      };
      const productLabel = `${currentFabric.title} — ${currentSwatch.name} (${shapeNames[currentShape]})`;
      if (window.openConsultationModal) {
        window.openConsultationModal(productLabel);
      }
    });
  }
}
