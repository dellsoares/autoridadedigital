/* Comportamento compartilhado do aviso de privacidade, igual ao da página inicial. */
(() => {
  'use strict';
  const banner = document.getElementById('privacy-notice');
  const more = document.getElementById('privacy-more');
  const details = document.getElementById('privacy-details');
  const consentKey = 'wendell_privacy_notice_v08';
  let acknowledged = false;
  try { acknowledged = localStorage.getItem(consentKey) === 'acknowledged'; } catch (_error) {}
  if (banner) banner.hidden = acknowledged;

  document.getElementById('privacy-ack')?.addEventListener('click', () => {
    try { localStorage.setItem(consentKey, 'acknowledged'); } catch (_error) {}
    if (banner) banner.hidden = true;
  });

  more?.addEventListener('click', () => {
    if (!details) return;
    details.hidden = !details.hidden;
    more.setAttribute('aria-expanded', String(!details.hidden));
  });

  document.getElementById('privacy-reopen')?.addEventListener('click', () => {
    if (banner) {
      banner.hidden = false;
      banner.scrollIntoView?.({ block: 'nearest' });
    }
    document.getElementById('privacy-ack')?.focus();
  });
})();
