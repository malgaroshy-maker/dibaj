/**
 * Dibaj Textiles - Common Scripts & Interactive Behaviors
 * Shared across all pages: Header, Navigation, Consultation Modal, WhatsApp Concierge
 */

export const DIBAJ_CONFIG = {
  nameArabic: 'شركة الديباج لصناعة المنسوجات والستائر والجلسات والصالونات (ذ.م.م)',
  nameEnglish: 'ALDIBAJ CO. (Limited liability)',
  facebookUrl: 'https://www.facebook.com/profile.php?id=100083410961417',
  nameShort: 'شركة الديباج',
  tagline: 'صناعة وتفصيل الصالونات والمجالس الفاخرة واستيراد أرقى خامات الأقمشة',
  primaryPhone: '+218915601703',
  primaryPhoneFormatted: '091 560 1703',
  phonePrimary: '091 560 1703',
  secondaryPhone: '+218921411415',
  secondaryPhoneFormatted: '092 141 1415',
  whatsappNumber: '218915601703',
  commercialRegistry: '0501020247477',
  industrialRegistry: '002546000567',
  workingHours: 'السبت – الخميس: 9:30 ص – 1:30 ظ ومن 4:30 ع – 9:30 م | الجمعة: 4:30 م – 9:30 م (فترة مسائية)',
  showroomHours: 'السبت – الخميس: 9:30 ص – 1:30 ظ ومن 4:30 ع – 9:30 م | الجمعة: 4:30 م – 9:30 م (فترة مسائية)',
  locations: {
    factory: 'طرابلس، ليبيا – باب بن غشير (مجمع تصنيع الهياكل والإسفنج والتفصيل والرقابة الفنية)',
    showrooms: 'طرابلس، ليبيا – سوق أبوسليم (مجمع صالات العرض - 5 وحدات متخصصة أمام المعهد الصحي)'
  }
};

/**
 * Builds an authentic, truthful WhatsApp inquiry URL
 */
export function buildWhatsAppUrl(details = {}) {
  const {
    fabricTitle = '',
    swatchName = '',
    serviceType = 'استشارة تفصيل أقمشة ومفروشات',
    notes = '',
    dimensions = ''
  } = details;

  let message = `السلام عليكم ورحمة الله — شركة الديباج،\nأود الاستفسار والتنسيق بخصوص:`;
  if (serviceType) message += `\n- نوع الخدمة: ${serviceType}`;
  if (fabricTitle) message += `\n- الموديل أو القماش: ${fabricTitle}`;
  if (swatchName) message += `\n- خيار العينة / اللون: ${swatchName}`;
  if (dimensions) message += `\n- المقاسات التقديرية: ${dimensions}`;
  if (notes) message += `\n- تفاصيل إضافية: ${notes}`;
  message += `\n\nيرجى التكرم بموافاتي بالموعد المتاح للتنسيق أو زيارة صالات العرض بأبوسليم. شكراً لكم.`;

  return `https://wa.me/${DIBAJ_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Initializes the Mobile Navigation Drawer
 */
export function initNavigation() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && drawer) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close when clicking outside drawer
  document.addEventListener('click', (e) => {
    if (drawer && drawer.classList.contains('open')) {
      if (!drawer.contains(e.target) && !toggleBtn?.contains(e.target)) {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // Active navigation highlight
  const rawPath = window.location.pathname.split('/').pop() || 'index.html';
  const currentPath = (rawPath === '' ? 'index.html' : rawPath).split('?')[0];

  document.querySelectorAll('.nav-link').forEach(link => {
    const rawHref = link.getAttribute('href') || '';
    const cleanHref = rawHref.split('?')[0].split('/').pop();
    if (cleanHref === currentPath || (currentPath === 'index.html' && (cleanHref === '' || cleanHref === 'index.html'))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Initializes the Global Consultation Modal with truthful WhatsApp handoff and fallback
 */
export function initConsultationModal() {
  const modal = document.querySelector('#consultation-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const form = modal.querySelector('#consultation-form');
  const productInput = modal.querySelector('#consultation-product-field');
  const fallbackContainer = modal.querySelector('#consultation-fallback-container');
  const fallbackTextarea = modal.querySelector('#consultation-fallback-text');
  const copyBtn = modal.querySelector('#consultation-copy-btn');
  const directLink = modal.querySelector('#consultation-direct-link');

  window.openConsultationModal = (productName = '') => {
    if (productInput) productInput.value = productName || 'استشارة عامة في الأقمشة والمفروشات';
    if (fallbackContainer) fallbackContainer.style.display = 'none';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeConsultationModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', window.closeConsultationModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) window.closeConsultationModal();
  });

  // Attach to all buttons with data-action="open-consultation"
  document.querySelectorAll('[data-action="open-consultation"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = btn.getAttribute('data-product') || '';
      window.openConsultationModal(product);
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('#client-name')?.value?.trim() || '';
      const phone = form.querySelector('#client-phone')?.value?.trim() || '';
      const service = form.querySelector('#client-service')?.value || '';
      const product = productInput?.value || '';
      const notes = form.querySelector('#client-notes')?.value?.trim() || '';

      const detailsList = [
        name ? `الاسم: ${name}` : '',
        phone ? `الهاتف: ${phone}` : '',
        notes ? `ملاحظات: ${notes}` : ''
      ].filter(Boolean);

      const waUrl = buildWhatsAppUrl({
        fabricTitle: product,
        serviceType: service,
        notes: detailsList.join(' | ')
      });

      const messageText = decodeURIComponent(waUrl.split('?text=')[1] || '');

      // Populate fallback container in case popup is blocked
      if (fallbackContainer && fallbackTextarea) {
        fallbackContainer.style.display = 'block';
        fallbackTextarea.value = messageText;
        if (directLink) directLink.href = waUrl;
      }

      showToast('جاري تحويلكم لمحادثة واتساب الرسمية مع مسودة طلبكم لمراجعتها وإرسالها...');

      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 700);
    });
  }

  if (copyBtn && fallbackTextarea) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(fallbackTextarea.value);
        showToast('✓ تم نسخ نص المسودة بنجاح. يمكنك الآن لصقها في واتساب.');
      } catch (err) {
        fallbackTextarea.select();
        document.execCommand('copy');
        showToast('✓ تم نسخ نص المسودة.');
      }
    });
  }
}

/**
 * Elegant Toast Notification
 */
export function showToast(message) {
  let toast = document.querySelector('.dibaj-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'dibaj-toast';
    document.body.appendChild(toast);

    // Apply inline luxury styles
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      zIndex: '2000',
      backgroundColor: '#5a3a22',
      color: '#faf7f2',
      border: '1px solid #c08b3e',
      borderRadius: '8px',
      padding: '1rem 1.6rem',
      fontSize: '0.95rem',
      fontWeight: '600',
      boxShadow: '0 12px 30px rgba(46, 21, 2, 0.35)',
      transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
      opacity: '0',
      transform: 'translateY(20px)',
      direction: 'rtl',
      maxWidth: '420px',
      lineHeight: '1.6'
    });
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 4000);
}

// Auto-run on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initConsultationModal();
});
