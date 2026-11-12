(() => {
  'use strict';

  const menu = document.getElementById('mobile-menu');
  const menuButton = document.getElementById('menu-toggle');
  const submenu = document.getElementById('mobile-blog-submenu');
  const submenuButton = document.querySelector('[data-mobile-submenu-toggle]');

  function setSubmenu(open) {
    if (!submenu || !submenuButton) return;
    submenu.hidden = !open;
    submenuButton.setAttribute('aria-expanded', String(open));
  }

  const hasActiveCategory = Boolean(submenu?.querySelector('[aria-current="page"]'));

  function setMenu(open) {
    if (!menu || !menuButton) return;
    menu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    if (!open) setSubmenu(false);
    else if (hasActiveCategory) setSubmenu(true);
  }

  window.WSMenu = { setOpen: setMenu, close: () => setMenu(false) };

  menuButton?.addEventListener('click', () => setMenu(menu.hidden));
  submenuButton?.addEventListener('click', () => {
    setSubmenu(submenu.hidden);
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
})();
