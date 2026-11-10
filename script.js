const buyLinks = [...document.querySelectorAll('[data-buy]')];
const modal = document.querySelector('#purchaseModal');
const modalEyebrow = document.querySelector('#purchaseModalEyebrow');
const productName = document.querySelector('#purchaseProductName');
const offer = document.querySelector('#modalOfferConsent');
const offerText = document.querySelector('#modalOfferText');
const privacy = document.querySelector('#modalPrivacyConsent');
const privacyText = document.querySelector('#modalPrivacyText');
const confirmPurchase = document.querySelector('#purchaseConfirm');
const confirmLabel = document.querySelector('#purchaseConfirmLabel');
const error = document.querySelector('#purchaseError');
const closeButtons = [...document.querySelectorAll('[data-modal-close]')];
let pendingPaymentUrl = '';

function consentReady() {
  return Boolean(offer?.checked && privacy?.checked);
}

function syncPurchaseState() {
  const ready = consentReady();
  confirmPurchase?.setAttribute('aria-disabled', String(!ready));
  if (confirmPurchase) confirmPurchase.tabIndex = ready ? 0 : -1;
  if (ready) error?.classList.remove('show');
}

function openPurchaseModal(link) {
  pendingPaymentUrl = link.href;
  const isContact = link.dataset.mode === 'contact';
  if (modalEyebrow) modalEyebrow.textContent = isContact ? 'ПЕРЕД ПЕРЕХОДОМ' : 'ПЕРЕД ОПЛАТОЙ';
  if (productName) productName.textContent = link.dataset.product || 'выбранный продукт';
  if (offerText) {
    offerText.innerHTML = isContact
      ? 'Я понимаю, что это предварительная заявка: точную дату и условия участия мы обсудим лично.'
      : 'Я принимаю условия <a href="https://disk.yandex.ru/d/UmcB7vXuuUsvjw" target="_blank" rel="noopener">публичной оферты</a>.';
  }
  if (privacyText) privacyText.innerHTML = 'Я даю согласие на обработку персональных данных и ознакомилась с <a href="https://disk.yandex.ru/d/UmcB7vXuuUsvjw" target="_blank" rel="noopener">политикой обработки персональных данных</a>.';
  if (confirmLabel) confirmLabel.textContent = isContact ? 'Написать Татьяне' : 'Перейти к оплате';
  if (error) error.textContent = isContact ? 'Поставьте обе галочки, чтобы продолжить.' : 'Поставьте обе галочки, чтобы перейти к оплате.';
  if (confirmPurchase) confirmPurchase.href = pendingPaymentUrl;
  if (offer) offer.checked = false;
  if (privacy) privacy.checked = false;
  error?.classList.remove('show');
  syncPurchaseState();
  if (modal) modal.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => offer?.focus());
}

function closePurchaseModal() {
  if (modal) modal.hidden = true;
  document.body.classList.remove('modal-open');
  pendingPaymentUrl = '';
}

buyLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openPurchaseModal(link);
  });
});

confirmPurchase?.addEventListener('click', (event) => {
  if (consentReady() && pendingPaymentUrl) return;
  event.preventDefault();
  error?.classList.add('show');
  offer?.focus();
});

closeButtons.forEach((button) => button.addEventListener('click', closePurchaseModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal && !modal.hidden) closePurchaseModal();
});

offer?.addEventListener('change', syncPurchaseState);
privacy?.addEventListener('change', syncPurchaseState);
syncPurchaseState();

const deadline = new Date('2026-11-12T23:59:00+03:00').getTime();
const timerIds = ['days','hours','minutes','seconds'];

function updateTimer() {
  const remaining = Math.max(0, deadline - Date.now());
  const values = [
    Math.floor(remaining / 86400000),
    Math.floor((remaining / 3600000) % 24),
    Math.floor((remaining / 60000) % 60),
    Math.floor((remaining / 1000) % 60)
  ];
  timerIds.forEach((id, index) => {
    const node = document.getElementById(id);
    if (node) node.textContent = String(values[index]).padStart(2, '0');
  });
}

updateTimer();
setInterval(updateTimer, 1000);
