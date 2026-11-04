const offer = document.querySelector('#offerConsent');
const privacy = document.querySelector('#privacyConsent');
const buyLinks = [...document.querySelectorAll('[data-buy]')];
const error = document.querySelector('#consentError');

function consentReady() {
  return Boolean(offer?.checked && privacy?.checked);
}

function syncPurchaseState() {
  const ready = consentReady();
  buyLinks.forEach((link) => {
    link.setAttribute('aria-disabled', String(!ready));
    link.tabIndex = ready ? 0 : -1;
  });
  if (ready) error?.classList.remove('show');
}

buyLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (consentReady()) return;
    event.preventDefault();
    error?.classList.add('show');
    document.querySelector('#consent')?.scrollIntoView({behavior:'smooth', block:'center'});
    offer?.focus({preventScroll:true});
  });
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
