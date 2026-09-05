import { FABRICS, FABRIC_CATEGORIES } from '../data/fabrics.js';

let currentCategory = 'all';
let searchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
  renderCategoryFilterTabs();
  renderCatalogGrid();
  setupSearchAndFilters();
});

function renderCategoryFilterTabs() {
  const tabsContainer = document.getElementById('catalog-filter-tabs');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = FABRIC_CATEGORIES.map(cat => `
    <button class="filter-tab-btn ${cat.id === currentCategory ? 'active' : ''}" 
            data-category="${cat.id}">
      ${cat.name}
    </button>
  `).join('');

  tabsContainer.querySelectorAll('.filter-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderCatalogGrid();
    });
  });
}

function renderCatalogGrid() {
  const gridContainer = document.getElementById('catalog-items-grid');
  const countBadge = document.getElementById('catalog-items-count');
  if (!gridContainer) return;

  const filtered = FABRICS.filter(item => {
    const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.composition.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (countBadge) {
    countBadge.textContent = `${filtered.length} مجموعة متوفرة`;
  }

  if (filtered.length === 0) {
    gridContainer.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--color-chocolate-medium);">
        <p style="font-size: 1.2rem; font-weight: 700;">عذراً، لم نجد تشكيلات تطابق بحثك الحالي.</p>
        <p style="font-size: 0.95rem;">يمكنكم التواصل مع فريق الديباج مباشرة لتفصيل صالون أو مجلس مخصص حسب طلبكم ومقاساتكم.</p>
        <button class="btn btn-primary" onclick="window.openConsultationModal('طلب تفصيل خاص')">
          طلب تفصيل مخصص
        </button>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = filtered.map(fabric => {
    const swatchesHtml = fabric.swatches.map(swatch => `
      <span class="card-swatch-dot" 
            style="background-color: ${swatch.colorHex};" 
            title="${swatch.name}"
            data-img="${swatch.image}"
            data-fabric-id="${fabric.id}">
      </span>
    `).join('');

    return `
      <article class="catalog-card" id="catalog-card-${fabric.id}">
        <div class="card-media-wrapper">
          <img src="${fabric.mainImage}" alt="${fabric.title}" class="card-img" id="cat-img-${fabric.id}" loading="lazy" />
          <span class="card-tag">${fabric.badge || fabric.categoryArabic}</span>
        </div>
        <div class="card-content">
          <span class="card-category">${fabric.categoryArabic}</span>
          <h3 class="card-title">${fabric.title}</h3>
          <p class="card-desc">${fabric.description}</p>
          
          <div class="card-swatches">
            <span style="font-size: 0.75rem; color: var(--color-chocolate-medium); margin-left: 6px;">درجات الألوان:</span>
            ${swatchesHtml}
          </div>

          <div style="font-size: 0.8rem; color: var(--color-laurel-olive); font-weight: 600; margin-bottom: 0.75rem;">
            ✓ ${fabric.composition.split('،')[0]}
          </div>

          <div class="card-footer">
            <span class="card-price-hint">${fabric.weight}</span>
            <a href="product.html?id=${fabric.id}" class="btn btn-secondary-bespoke" style="padding: 0.45rem 1rem; font-size: 0.85rem;">
              ${fabric.category === 'curtains' ? 'تفصيل وتخصيص الستائر' : 'استعراض وتفصيل'}
            </a>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Attach swatch preview click
  gridContainer.querySelectorAll('.card-swatch-dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const fabricId = dot.getAttribute('data-fabric-id');
      const imgUrl = dot.getAttribute('data-img');
      const cardImg = document.getElementById(`cat-img-${fabricId}`);
      if (cardImg && imgUrl) {
        cardImg.src = imgUrl;
      }
    });
  });
}

function setupSearchAndFilters() {
  const searchInput = document.getElementById('catalog-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderCatalogGrid();
    });
  }

  setupFabricInquiryModal();
}

function setupFabricInquiryModal() {
  const openBtn = document.getElementById('open-fabric-inquiry-btn');
  const modal = document.getElementById('fabric-inquiry-modal');
  const closeBtn = document.getElementById('fabric-modal-close-btn');
  const form = document.getElementById('fabric-inquiry-form');
  const fallbackContainer = document.getElementById('fabric-fallback-container');
  const fallbackTextarea = document.getElementById('fabric-fallback-text');
  const copyBtn = document.getElementById('fabric-copy-btn');
  const directLink = document.getElementById('fabric-direct-link');

  if (!modal) return;

  const openModal = () => {
    if (fallbackContainer) fallbackContainer.style.display = 'none';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientType = document.getElementById('fabric-client-type')?.value || '';
      const texture = document.getElementById('fabric-texture-choice')?.value || '';
      const quantity = document.getElementById('fabric-quantity')?.value?.trim() || 'غير محددة بدقة (بحاجة لكتالوج واستشارة)';
      const city = document.getElementById('fabric-city')?.value?.trim() || 'طرابلس';
      const notes = document.getElementById('fabric-notes')?.value?.trim() || 'لا توجد ملاحظات إضافية';

      const waLines = [
        'السلام عليكم ورحمة الله — إدارة توريد الأقمشة بشركة الديباج،',
        'أرغب في الاستفسار عن توريد وعينات الأقمشة المستوردة بالمواصفات التالية:',
        '',
        `🏢 صفة الطلب: ${clientType}`,
        `✨ الخامة / النسيج المطلوب: ${texture}`,
        `📏 الكمية التقديرية: ${quantity}`,
        `📍 المدينة والتوصيل: ${city}`,
        `📝 ملاحظات خاصة: ${notes}`,
        '',
        'يرجى التكرم بتزويدي بكتالوج العينات المعتمد والأسعار المتاحة للتوريد. شكراً لكم.'
      ];

      const waMessage = waLines.join('\n');
      const waUrl = `https://wa.me/218915601703?text=${encodeURIComponent(waMessage)}`;

      if (fallbackContainer && fallbackTextarea) {
        fallbackContainer.style.display = 'block';
        fallbackTextarea.value = waMessage;
        if (directLink) directLink.href = waUrl;
      }

      if (window.showToast) {
        window.showToast('جاري فتح محادثة واتساب الرسمية مع مسودة استفسار الأقمشة لمراجعتها...');
      }

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 700);
    });
  }

  if (copyBtn && fallbackTextarea) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(fallbackTextarea.value);
        if (window.showToast) window.showToast('✓ تم نسخ مسودة طلب الأقمشة بنجاح.');
      } catch (err) {
        fallbackTextarea.select();
        document.execCommand('copy');
        if (window.showToast) window.showToast('✓ تم نسخ نص المسودة.');
      }
    });
  }
}
