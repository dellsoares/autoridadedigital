/* Major H Contextual — explicações estáticas e rápidas, sem API ou dependências externas. */
(() => {
  'use strict';

  const contexts = [...document.querySelectorAll('[data-major-h-context]')];
  if (!contexts.length) return;

  let activeContext = null;

  const getTrigger = (context) => context.querySelector('[data-major-h-context-trigger]');
  const getPanel = (context) => {
    const trigger = getTrigger(context);
    const id = trigger?.getAttribute('aria-controls');
    return id ? document.getElementById(id) : null;
  };

  // Painéis no body evitam cortes por overflow e problemas de position:fixed em blocos animados.
  contexts.forEach((context) => {
    const panel = getPanel(context);
    if (panel && panel.parentElement !== document.body) document.body.appendChild(panel);
  });

  function closeContext(context = activeContext, restoreFocus = false) {
    if (!context) return;
    const trigger = getTrigger(context);
    const panel = getPanel(context);
    if (panel) panel.hidden = true;
    trigger?.setAttribute('aria-expanded', 'false');
    context.classList.remove('is-open');
    if (activeContext === context) activeContext = null;
    if (restoreFocus) trigger?.focus();
  }

  function positionPanel(context, panel) {
    const trigger = getTrigger(context);
    if (!trigger) return;
    const anchor = trigger.getBoundingClientRect();
    const availableWidth = Math.max(220, window.innerWidth - 32);
    panel.style.width = `${Math.min(370, availableWidth)}px`;
    panel.style.left = '16px';
    panel.style.top = '16px';

    const panelRect = panel.getBoundingClientRect();
    const left = Math.max(16, Math.min(anchor.left, window.innerWidth - panelRect.width - 16));
    let top = anchor.bottom + 10;
    if (top + panelRect.height > window.innerHeight - 16) {
      top = anchor.top - panelRect.height - 10;
    }
    top = Math.max(16, Math.min(top, window.innerHeight - panelRect.height - 16));
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  }

  function openContext(context) {
    if (!context) return;
    if (activeContext && activeContext !== context) closeContext(activeContext);
    const trigger = getTrigger(context);
    const panel = getPanel(context);
    if (!trigger || !panel) return;
    if (activeContext === context && !panel.hidden) {
      closeContext(context);
      return;
    }
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    context.classList.add('is-open');
    activeContext = context;
    positionPanel(context, panel);
    panel.querySelector('[data-major-h-context-close]')?.focus({ preventScroll: true });
  }

  function openMainAssistant() {
    if (window.WSMajorH?.open) {
      window.WSMajorH.open();
      return;
    }
    window.addEventListener('ws:major-h-ready', () => window.WSMajorH?.open?.(), { once: true });
  }

  function syncCatalogTip() {
    const context = document.querySelector('[data-major-h-category="presenca"]');
    if (!context) return;
    const selected = document.querySelector('#filters [data-filter][aria-selected="true"]');
    const hasSearch = Boolean(document.getElementById('service-search')?.value.trim());
    const isPresence = !hasSearch && (!selected || selected.dataset.filter === 'presenca');
    context.hidden = !isPresence;
    if (!isPresence && activeContext === context) closeContext(context);
  }

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-major-h-context-trigger]');
    if (trigger) {
      event.preventDefault();
      openContext(trigger.closest('[data-major-h-context]'));
      return;
    }

    const closeButton = event.target.closest('[data-major-h-context-close]');
    if (closeButton) {
      const panel = closeButton.closest('.mh-context-panel');
      const owner = contexts.find((context) => getPanel(context) === panel);
      closeContext(owner, true);
      return;
    }

    if (event.target.closest('[data-major-h-open-chat]')) {
      if (activeContext) closeContext(activeContext, true);
      openMainAssistant();
      return;
    }

    if (activeContext) {
      const activePanel = getPanel(activeContext);
      if (!activeContext.contains(event.target) && !activePanel?.contains(event.target)) {
        closeContext(activeContext);
      }
    }

    if (event.target.closest('#filters [data-filter], #reset-filters')) {
      window.setTimeout(syncCatalogTip, 0);
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.id === 'service-search') window.setTimeout(syncCatalogTip, 0);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && activeContext) {
      event.preventDefault();
      closeContext(activeContext, true);
    }
  });

  window.addEventListener('scroll', () => {
    if (activeContext) closeContext(activeContext);
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (activeContext) closeContext(activeContext);
  }, { passive: true });

  syncCatalogTip();
})();
