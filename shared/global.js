(() => {
  'use strict';

  // Mantém os menus sincronizados e acrescenta Beleza aos Cases em todas as páginas compartilhadas.
  function ensureBeautyLinks() {
    const beautyPath = '/beleza/';
    const currentPath = window.location.pathname.replace(/index\.html$/, '');
    const isBeautyPage = currentPath === '/beleza' || currentPath === '/beleza/';

    const addLink = (container, className = '') => {
      if (!container || container.querySelector(`a[href="${beautyPath}"]`)) return;
      const link = document.createElement('a');
      link.href = beautyPath;
      link.textContent = 'Beleza';
      if (className) link.className = className;
      if (isBeautyPage) link.setAttribute('aria-current', 'page');
      const musiciansLink = container.querySelector('a[href="/musicos/"]');
      if (musiciansLink) musiciansLink.insertAdjacentElement('afterend', link);
      else container.appendChild(link);
    };

    addLink(document.querySelector('.desktop-nav .nav-submenu[aria-label="Cases"]'));
    addLink(document.getElementById('mobile-cases-submenu'));

    const projectNode = [...document.querySelectorAll('.footer-map-node')].find((node) =>
      node.querySelector('.footer-map-copy strong')?.textContent.trim().toLowerCase() === 'projetos'
    );
    addLink(projectNode?.querySelector('.footer-map-links'));
  }

  ensureBeautyLinks();

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

  // Major H — consultor digital global, disponível em todas as páginas que carregam este arquivo.
  if (!document.querySelector('script[data-major-h-widget]')) {
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
