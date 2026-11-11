/* Corporativo | navegação e formulário da landing page */
(() => {
  'use strict';

  const menuButton = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }

  menuButton?.addEventListener('click', () => {
    setMenu(mobileMenu.hidden);
  });

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMenu(false));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMenu(false);
  });

  const form = document.getElementById('corporate-form');
  const status = document.getElementById('corporate-form-status');

  function showStatus(message, isError = false) {
    if (!status) return;
    status.textContent = message;
    status.hidden = false;
    status.classList.toggle('is-error', isError);
  }

  // Os links dos cards levam ao formulário e já indicam o assunto de interesse.
  document.querySelectorAll('[data-interest]').forEach(link => {
    link.addEventListener('click', () => {
      const interest = link.getAttribute('data-interest') || '';
      const modality = form?.elements.namedItem('modalidade');
      const message = form?.elements.namedItem('mensagem');
      if (modality) {
        if (interest.startsWith('Palestra:')) modality.value = 'Palestra';
        else if (interest.startsWith('Consultoria')) modality.value = 'Consultoria';
        else if (interest.startsWith('Assessoria:')) modality.value = 'Assessoria política para campanha ou equipe';
        else if (interest.startsWith('Assessoria individual')) modality.value = 'Assessoria individual para liderança política';
        else if (interest.startsWith('Treinamento:')) modality.value = 'Treinamento E-E-A-T';
        else if (interest.startsWith('Workshop:')) modality.value = 'Workshop de produção de conteúdo';
      }
      if (message && !message.value.includes(interest)) {
        message.value = interest + (message.value.trim() ? '\n\n' + message.value.trim() : '');
      }
    });
  });

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const submit = form.querySelector('button[type="submit"]');
    const originalLabel = submit?.innerHTML || '';
    if (submit) {
      submit.disabled = true;
      submit.innerHTML = 'Enviando solicitação… <span aria-hidden="true">↗</span>';
    }
    if (status) {
      status.hidden = true;
      status.classList.remove('is-error');
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (!response.ok) throw new Error('form submission failed');
      showStatus('Solicitação recebida. Você receberá o retorno com a proposta em até 1 dia útil.');
      form.reset();
    } catch (error) {
      showStatus('Não foi possível enviar agora. Tente novamente em instantes.', true);
    } finally {
      if (submit) {
        submit.disabled = false;
        submit.innerHTML = originalLabel;
      }
    }
  });


  // Os cards entram em cena ao aparecer na viewport e repetem o movimento ao rolar para cima ou para baixo.
  const animatedCards = [...document.querySelectorAll('.corp-solution-card, .corp-talk, .corp-service-card, .corp-training-card')];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (animatedCards.length) {
    animatedCards.forEach((card, index) => {
      card.classList.add('corp-scroll-card');
      card.style.setProperty('--corp-card-delay', `${(index % 4) * 65}ms`);
    });

    if (!reduceMotion && 'IntersectionObserver' in window) {
      document.documentElement.classList.add('corp-motion-ready');
      const cardObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting);
        });
      }, { threshold: 0.14, rootMargin: '-4% 0px -4% 0px' });
      animatedCards.forEach(card => cardObserver.observe(card));
    } else {
      animatedCards.forEach(card => card.classList.add('is-visible'));
    }
  }
})();
