import { buildWhatsAppUrl, showToast, DIBAJ_CONFIG } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  setupContactPageForm();
  renderShowroomDetails();
});

function setupContactPageForm() {
  const form = document.getElementById('main-contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#contact-name')?.value || '';
    const phone = form.querySelector('#contact-phone')?.value || '';
    const city = form.querySelector('#contact-city')?.value || 'طرابلس';
    const service = form.querySelector('#contact-service')?.value || 'استشارة تفصيل متكاملة';
    const message = form.querySelector('#contact-message')?.value || '';

    const waUrl = buildWhatsAppUrl({
      serviceType: service,
      notes: `الاسم: ${name} | المدينة: ${city} | هاتف: ${phone} | تفاصيل الطلب: ${message}`
    });

    showToast(`شكراً لك أستاذ ${name}، تم تسجيل طلبك وسيتواصل معك فريق المبيعات والتفصيل. سيتم فتح محادثة الواتساب الآن...`);

    setTimeout(() => {
      form.reset();
      window.open(waUrl, '_blank');
    }, 1500);
  });
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
