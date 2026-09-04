import { FABRICS, getFabricById } from '../data/fabrics.js';

let currentFabric = null;
let currentSwatch = null;
let currentShape = 'l-shape';
let currentFoam = '35D';
let wantHomeMeasurement = true;

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
  setupFoamSelector();
  setupHomeMeasurementToggle();
  setupInquiryActions();

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

  renderProductDetails();
  setupSwatchPicker();
  renderDimensionInputs();
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
      updateActionLinks();
    });
  }
}

function calculateCustomSpecs() {
  const s = shapeState[currentShape];
  let totalFabricMeters = 0;
  let capacity = 0;

  if (currentShape === 'l-shape') {
    const totalLength = s.sideA + s.sideB;
    totalFabricMeters = totalLength * 1.8;
    capacity = Math.max(4, Math.round(totalLength / 0.65));
  } else if (currentShape === 'u-shape') {
    const totalLength = s.sideA + s.sideB + s.sideC;
    totalFabricMeters = totalLength * 1.8;
    capacity = Math.max(6, Math.round(totalLength / 0.65));
  } else if (currentShape === 'classic-set') {
    totalFabricMeters = (s.sofa3 * 6.5) + (s.sofa2 * 4.8) + (s.chair1 * 2.5);
    capacity = (s.sofa3 * 3) + (s.sofa2 * 2) + (s.chair1 * 1);
  } else if (currentShape === 'majlis-floor') {
    totalFabricMeters = s.perimeter * 1.5;
    capacity = Math.max(6, Math.round(s.perimeter / 0.65));
  }

  // Adjust duration based on size
  const duration = totalFabricMeters > 25 ? '10 - 15 يوم عمل' : '7 - 12 يوم عمل';

  // Update UI badges
  const metersEl = document.getElementById('calc-result-meters');
  const capacityEl = document.getElementById('calc-result-capacity');
  const daysEl = document.getElementById('calc-result-days');

  if (metersEl) metersEl.textContent = `حوالي ${totalFabricMeters.toFixed(1)} متر طولي`;
  if (capacityEl) capacityEl.textContent = `${Math.max(1, capacity - 1)} - ${capacity + 1} أشخاص`;
  if (daysEl) daysEl.textContent = duration;

  updateActionLinks(totalFabricMeters, capacity, duration);
}

function updateActionLinks(totalMeters = 12, capacity = 8, duration = '7 - 12 يوم عمل') {
  const shapeNames = {
    'l-shape': 'شكل زاوية (L-Shape)',
    'u-shape': 'شكل حدوة (U-Shape)',
    'classic-set': 'طقم كلاسيك مستقل',
    'majlis-floor': 'مجلس عربي أرضي متصل'
  };

  const foamLabels = {
    '35D': 'إسفنج 35 D ضغط عالي ممتاز (معتمد الورشة)',
    'RoyalSoft': 'حشوة سوفت رويال مزدوجة (35 D + فايبر ناعم)',
    '30D': 'إسفنج 30 D ضغط متوسط'
  };

  const s = shapeState[currentShape];
  let dimText = '';
  if (currentShape === 'l-shape') {
    dimText = `ضلع A: ${s.sideA}م × ضلع B: ${s.sideB}م (عمق: ${s.depth}سم)`;
  } else if (currentShape === 'u-shape') {
    dimText = `ضلع A: ${s.sideA}م × وسط B: ${s.sideB}م × ضلع C: ${s.sideC}م (عمق: ${s.depth}سم)`;
  } else if (currentShape === 'classic-set') {
    dimText = `ثلاثية: ${s.sofa3} قطع، ثنائية: ${s.sofa2} قطع، مفرد: ${s.chair1} قطع`;
  } else if (currentShape === 'majlis-floor') {
    dimText = `محيط المجلس: ${s.perimeter}م (عمق: ${s.depth}سم)`;
  }

  const measurementText = wantHomeMeasurement 
    ? 'نعم، مطلوب زيارة فني لمعاينة الصالة ورفع المقاسات مجاناً في طرابلس' 
    : 'غير مطلوب حالياً، لدي المقاسات الدقيقة';

  const waMessage = [
    `السلام عليكم شركة الديباج،`,
    `أرغب في الاستفسار وطلب تفصيل من استوديو التخصيص:`,
    ``,
    `🛋️ الموديل: ${currentFabric.title} (${currentFabric.categoryArabic})`,
    `🎨 خامة ولون التنجيد: ${currentSwatch.name}`,
    `📐 شكل الجلسة: ${shapeNames[currentShape]}`,
    `📏 الأبعاد والمقاسات: ${dimText}`,
    `🧽 نوع الإسفنج: ${foamLabels[currentFoam]}`,
    `👥 سعة الجلوس التقديرية: ${capacity} أشخاص`,
    `🧵 أمتار القماش التقديرية: ${totalMeters.toFixed(1)} متر طولي`,
    `🏡 رفع مقاسات منزلية: ${measurementText}`,
    ``,
    `يرجى التكرم بموافاتي بتقدير السعر المبدئي والمواعيد المتاحة للتنفيذ. شكراً لكم.`
  ].join('\n');

  const waBtn = document.getElementById('product-wa-btn');
  if (waBtn) {
    waBtn.href = `https://wa.me/218915601703?text=${encodeURIComponent(waMessage)}`;
  }
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
