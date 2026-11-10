(() => {
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const menuButton = $('#faq-menu-toggle');
  const mobileMenu = $('#faq-mobile-menu');
  if (menuButton && mobileMenu) {
    const setMenu = open => {
      mobileMenu.hidden = !open;
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    };
    menuButton.addEventListener('click', () => setMenu(mobileMenu.hidden));
    $$('.faq-mobile-menu a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
  }

  const search = $('#faq-search');
  const clear = $('#faq-search-clear');
  const count = $('#faq-results-count');
  const noResults = $('#faq-no-results');
  const questions = $$('.faq-question');
  const topics = $$('.faq-topic');
  const areas = $$('.faq-area');
  const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').trim();

  function filterFAQ() {
    const term = normalize(search?.value || '');
    let visible = 0;
    questions.forEach(question => {
      const matches = !term || normalize(question.dataset.search).includes(term);
      question.hidden = !matches;
      if (matches) visible++;
      if (term) question.open = matches;
      else question.open = false;
    });
    topics.forEach(topic => {
      const hasMatches = $$('.faq-question:not([hidden])', topic).length > 0;
      topic.hidden = !!term && !hasMatches;
      if (term && hasMatches) topic.open = true;
      if (!term) topic.open = false;
    });
    areas.forEach(area => {
      const hasMatches = $$('.faq-topic:not([hidden])', area).length > 0;
      area.hidden = !!term && !hasMatches;
      if (term && hasMatches) area.open = true;
      if (!term) area.open = area.id === 'macro-01';
    });
    if (count) count.textContent = term ? `${visible} ${visible === 1 ? 'resposta encontrada' : 'respostas encontradas'}` : `${questions.length} respostas disponíveis`;
    if (noResults) noResults.hidden = visible !== 0;
    if (clear) clear.hidden = !term;
  }
  if (search) search.addEventListener('input', filterFAQ);
  if (clear) clear.addEventListener('click', () => { search.value = ''; filterFAQ(); search.focus(); });

  $('#faq-expand-all')?.addEventListener('click', () => {
    $$('.faq-area, .faq-topic, .faq-question').forEach(item => { if (!item.hidden) item.open = true; });
  });
  $('#faq-collapse-all')?.addEventListener('click', () => {
    $$('.faq-area, .faq-topic, .faq-question').forEach(item => { item.open = false; });
  });

  $$('.faq-area-jump').forEach(link => link.addEventListener('click', event => {
    const id = link.dataset.openArea;
    const target = id ? document.getElementById(id) : null;
    if (target) target.open = true;
  }));

  // Deep links: abrir automaticamente área, tema e resposta quando a URL contém uma âncora.
  function openDeepLink() {
    const id = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    const area = target.closest('.faq-area');
    const topic = target.closest('.faq-topic');
    if (area) area.open = true;
    if (topic) topic.open = true;
    if (target.matches('.faq-question')) target.open = true;
    window.setTimeout(() => target.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start'}), 80);
  }
  window.addEventListener('hashchange', openDeepLink);
  if (location.hash) openDeepLink();

  // Permite copiar um link estável para cada resposta.
  $$('[data-copy-link]').forEach(link => link.addEventListener('click', async event => {
    event.preventDefault();
    const url = `${location.origin}${location.pathname}#${link.dataset.copyLink}`;
    const original = link.textContent;
    try {
      await navigator.clipboard.writeText(url);
      link.textContent = 'Link copiado';
    } catch {
      link.textContent = url;
    }
    window.setTimeout(() => { link.textContent = original; }, 2200);
  }));

  const year = $('#faq-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
