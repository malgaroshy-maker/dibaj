/**
 * Dibaj Textiles - Common Scripts & Interactive Behaviors
 * Shared across all pages: Header, Navigation, Consultation Modal, WhatsApp Concierge
 */

export const DIBAJ_CONFIG = {
  nameArabic: 'شركة الديباج لصناعة المنسوجات والستائر والجلسات والصالونات (ذ.م.م)',
  nameEnglish: 'ALDIBAJ CO. (Limited liability)',
  facebookUrl: 'https://www.facebook.com/profile.php?id=100083410961417',
  whatsappNumber: '218915601703',
  phonePrimary: '+218 91 560 1703',
  phoneSecondary: '+218 92 141 1415',
  emailPrimary: 'aldibaj@yahoo.com',
  emailSecondary: 'aldibaj.n.a.texone@gmail.com',
  atelierLocation: 'طرابلس، ليبيا – أبوسليم (أمام المعهد الصحي بالقرب من صيدلية العاصمة)',
  showroomHours: 'السبت - الخميس: 9:00 ص - 9:00 م | الجمعة: 4:30 م - 9:30 م',
  legal: {
    industrialRegistry: '002546000567',
    licenseNumber: '72361',
    chamberOfCommerce: '3883',
    commercialRegistry: '0501020247477',
    companyType: 'شركة ذات مسؤولية محدودة (ذ.م.م)'
  }
};

/**
 * Builds an authentic Arabic WhatsApp Concierge message and URL
 */
export function buildWhatsAppUrl(details = {}) {
  const {
    fabricTitle = '',
    swatchName = '',
    serviceType = 'استشارة تفصيل أقمشة وستائر',
    notes = '',
    dimensions = ''
  } = details;

  let message = `مرحباً شركة الديباج للمنسوجات الفاخرة،\nأود الاستفسار والتنسيق مع مستشار الأتيليه بخصوص:`;
  if (serviceType) message += `\n- الخدمة: ${serviceType}`;
  if (fabricTitle) message += `\n- القماش أو المجموعة: ${fabricTitle}`;
  if (swatchName) message += `\n- خيار العينة / اللون: ${swatchName}`;
  if (dimensions) message += `\n- المقاسات التقديرية: ${dimensions}`;
  if (notes) message += `\n- ملاحظات إضافية: ${notes}`;
  message += `\n\nيرجى تزويدي بالموعد المتاح لزيارة الصالون أو تحديد موعد لرفع المقاسات.`;

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

    const closeDrawer = () => {
      drawer.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    drawer.addEventListener('click', (e) => {
      if (e.target === drawer) closeDrawer();
    });
  }

  // Active navigation highlight
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * Initializes the Global Consultation Modal
 */
export function initConsultationModal() {
  const modal = document.querySelector('#consultation-modal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  const form = modal.querySelector('#consultation-form');
  const productInput = modal.querySelector('#consultation-product-field');

  window.openConsultationModal = (productName = '') => {
    if (productInput) productInput.value = productName || 'استشارة عامة في الأقمشة والمفروشات';
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
      const name = form.querySelector('#client-name')?.value || '';
      const phone = form.querySelector('#client-phone')?.value || '';
      const service = form.querySelector('#client-service')?.value || '';
      const product = productInput?.value || '';
      const notes = form.querySelector('#client-notes')?.value || '';

      // Direct option to open WhatsApp with these exact filled details
      const waUrl = buildWhatsAppUrl({
        fabricTitle: product,
        serviceType: service,
        notes: `الاسم: ${name} | هاتف: ${phone} | تفاصيل: ${notes}`
      });

      // Show luxury confirmation toast
      showToast(`شكراً لك أستاذ ${name}، تم تسجيل طلبكم وسيتواصل معكم خبير الأتيليه. جاري تحويلكم للمحادثة المباشرة...`);
      
      setTimeout(() => {
        window.closeConsultationModal();
        window.open(waUrl, '_blank');
      }, 1400);
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
