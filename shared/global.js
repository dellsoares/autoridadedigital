(() => {
  'use strict';

  const menu = document.getElementById('mobile-menu');
  const menuButton = document.getElementById('menu-toggle');
  const submenuButtons = [...document.querySelectorAll('[data-mobile-submenu-toggle]')];

  function getSubmenu(button) {
    const submenuId = button?.getAttribute('aria-controls');
    return submenuId ? document.getElementById(submenuId) : null;
  }

  function setSubmenu(button, open) {
    const submenu = getSubmenu(button);
    if (!submenu || !button) return;
    submenu.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
  }

  function closeSubmenus() {
    submenuButtons.forEach(button => setSubmenu(button, false));
  }

  function submenuHasActivePage(button) {
    return Boolean(getSubmenu(button)?.querySelector('[aria-current="page"]'));
  }

  function setMenu(open) {
    if (!menu || !menuButton) return;
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');

    if (!open) {
      closeSubmenus();
      return;
    }

    submenuButtons.forEach(button => {
      setSubmenu(button, submenuHasActivePage(button));
    });
  }

  window.WSMenu = { setOpen: setMenu, close: () => setMenu(false) };

  menuButton?.addEventListener('click', () => setMenu(menu.hidden));

  submenuButtons.forEach(button => {
    button.addEventListener('click', () => {
      const submenu = getSubmenu(button);
      if (submenu) setSubmenu(button, submenu.hidden);
    });
  });

  menu?.addEventListener('click', event => {
    if (event.target.closest('a')) setMenu(false);
  });

  document.addEventListener('click', event => {
    if (menu?.hidden) return;
    if (event.target.closest('#mobile-menu, #menu-toggle')) return;
    setMenu(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu && !menu.hidden) {
      setMenu(false);
      menuButton?.focus();
    }
  });

  // Major H — consultor digital (carrega somente na página inicial).
  const isMajorHHome = window.location.pathname === '/' ||
    window.location.pathname === '/index.html';

  if (isMajorHHome && !document.querySelector('script[data-major-h-widget]')) {
    const majorHScript = document.createElement('script');
    majorHScript.src = '/shared/major-h-widget.js?v=4';
    majorHScript.async = true;
    majorHScript.dataset.majorHWidget = 'true';
    majorHScript.dataset.apiUrl = 'https://major-h-api-staging.dell-soares.workers.dev/chat';
    majorHScript.dataset.assetsBase = '/assets/major-h/';
    majorHScript.dataset.mode = 'production';
    document.head.appendChild(majorHScript);
  }

})();
