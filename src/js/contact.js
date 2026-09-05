import { showToast, DIBAJ_CONFIG } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  setupContactPageForm();
  renderShowroomDetails();
});

function setupContactPageForm() {
  const form = document.getElementById('main-contact-form');
  const fallbackContainer = document.getElementById('contact-fallback-container');
  const fallbackTextarea = document.getElementById('contact-fallback-text');
  const copyBtn = document.getElementById('contact-copy-btn');
  const retryLink = document.getElementById('contact-retry-link');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#contact-name')?.value.trim() || '';
    const phone = form.querySelector('#contact-phone')?.value.trim() || '';
    const city = form.querySelector('#contact-city')?.value || 'طرابلس';
    const service = form.querySelector('#contact-service')?.value || 'استفسار عام وطلب تفصيل';
    const message = form.querySelector('#contact-message')?.value.trim() || '';

    let draftText = `مرحباً شركة الديباج، أود الاستفسار وطلب عرض سعر بخصوص:\n`;
    draftText += `• نوع الطلب: ${service}\n`;
    draftText += `• المدينة / المنطقة: ${city}\n`;
    if (name) draftText += `• الاسم: ${name}\n`;
    if (phone) draftText += `• رقم الهاتف: ${phone}\n`;
    if (message) draftText += `• تفاصيل وملاحظات: ${message}\n`;

    const waUrl = `https://wa.me/${DIBAJ_CONFIG.whatsappNumber}?text=${encodeURIComponent(draftText)}`;

    // Show fallback container with generated text
    if (fallbackContainer && fallbackTextarea) {
      fallbackTextarea.value = draftText;
      fallbackContainer.style.display = 'block';
      if (retryLink) retryLink.href = waUrl;
    }

    showToast('جاري فتح محادثة واتساب الرسمية لمراجعة وإرسال الاستفسار...');

    // Open WhatsApp
    const waWindow = window.open(waUrl, '_blank');
    if (!waWindow || waWindow.closed || typeof waWindow.closed === 'undefined') {
      showToast('تم تجهيز نص المسودة أدناه، يمكنك نسخه وإرساله مباشرة.');
    }
  });

  // Setup 1-click clipboard copy
  if (copyBtn && fallbackTextarea) {
    copyBtn.addEventListener('click', async () => {
      const text = fallbackTextarea.value;
      if (!text) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          fallbackTextarea.select();
          document.execCommand('copy');
        }
        showToast('✓ تم نسخ نص الاستفسار إلى الحافظة بنجاح!');
      } catch (err) {
        fallbackTextarea.select();
        showToast('يرجى تحديد النص ونسخه يدوياً.');
      }
    });
  }
}

function renderShowroomDetails() {
  const phoneLinks = document.querySelectorAll('.contact-phone-val');
  phoneLinks.forEach(link => {
    link.textContent = DIBAJ_CONFIG.phonePrimary;
    link.href = `tel:${DIBAJ_CONFIG.phonePrimary.replace(/\s+/g, '')}`;
  });

  const hoursEls = document.querySelectorAll('.contact-hours-val');
  hoursEls.forEach(el => {
    el.textContent = DIBAJ_CONFIG.showroomHours;
  });
}

