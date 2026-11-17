(() => {
  'use strict';

  const script = document.currentScript || document.querySelector('script[data-major-h-widget]');
  if (!script || window.__MAJOR_H_WIDGET_LOADED__) return;

  const mode = script.dataset.mode || 'production';
  const apiUrl = script.dataset.apiUrl || '';
  if (mode !== 'preview' && !apiUrl) return;
  window.__MAJOR_H_WIDGET_LOADED__ = true;

  const assetBase = new URL(script.dataset.assetsBase || '../assets/major-h/', document.baseURI).href;
  const assets = {
    welcome: 'major-h-avatar.webp',
    thinking: 'major-h-thinking.webp',
    confident: 'major-h-confident.webp',
    decided: 'major-h-decided.webp',
    surprised: 'major-h-surprised.webp',
    happy: 'major-h-happy.webp',
    playful: 'major-h-playful.webp',
    body: 'major-h-body.webp'
  };

  const profiles = {
    empresa: {
      label: 'Tenho uma empresa ou negócio',
      options: [
        'Quero ser mais encontrado no Google',
        'Preciso criar ou melhorar meu site',
        'Quero atrair contatos e oportunidades',
        'Quero explicar melhor meus produtos e serviços',
        'Quero fortalecer a imagem da minha marca',
        'Ainda não sei exatamente'
      ]
    },
    profissional: {
      label: 'Sou profissional ou especialista',
      options: [
        'Quero fortalecer meu nome e minha autoridade',
        'Preciso apresentar melhor minha trajetória',
        'Quero melhorar meu LinkedIn ou ter um site',
        'Quero publicar conteúdos sobre minha área',
        'Quero organizar minha presença na internet',
        'Ainda não sei exatamente'
      ]
    },
    artista: {
      label: 'Sou artista ou músico',
      options: [
        'Quero um site para apresentar meu trabalho',
        'Quero reunir músicas, vídeos e trajetória',
        'Quero facilitar contatos e contratações',
        'Quero organizar meus projetos artísticos',
        'Ainda não sei exatamente'
      ]
    },
    institucional: {
      label: 'Represento uma instituição ou liderança pública',
      options: [
        'Quero melhorar a comunicação institucional',
        'Quero organizar meu posicionamento público',
        'Preciso de site e conteúdo',
        'Quero capacitar minha equipe',
        'Ainda não sei exatamente'
      ]
    },
    indefinido: {
      label: 'Ainda não sei exatamente o que preciso',
      options: [
        'As pessoas não encontram meu negócio ou trabalho',
        'Tenho canais digitais, mas eles não explicam bem o que faço',
        'Minha presença digital está desorganizada',
        'Quero conhecer as possibilidades antes de decidir',
        'Prefiro explicar com minhas palavras'
      ]
    }
  };

  const css = `
    :host{all:initial;color-scheme:dark;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
    *,*::before,*::after{box-sizing:border-box}
    .mh-launcher{position:fixed;z-index:2147483000;right:24px;bottom:24px;display:flex;align-items:center;gap:10px;border:1px solid rgba(103,211,239,.55);border-radius:17px;background:linear-gradient(135deg,#0b2443,#071831 72%);color:#f8f7f2;padding:8px 15px 8px 8px;box-shadow:0 12px 38px rgba(0,0,0,.3),0 0 0 1px rgba(255,255,255,.05) inset;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease}
    .mh-launcher:hover{transform:translateY(-2px);box-shadow:0 16px 42px rgba(0,0,0,.38),0 0 22px rgba(74,198,228,.16)}
    .mh-launcher img{width:48px;height:48px;object-fit:contain;border-radius:50%;background:#0b2342}
    .mh-launcher-copy{display:grid;gap:2px;text-align:left}
    .mh-launcher-copy strong{font-size:13px;letter-spacing:.01em;font-weight:750}
    .mh-launcher-copy span{font-size:10px;color:#b9c9d8}
    .mh-launcher .mh-pulse{position:absolute;top:7px;left:7px;width:9px;height:9px;border-radius:50%;background:#65d7a5;border:2px solid #0b2443}
    .mh-panel{position:fixed;z-index:2147483001;right:24px;bottom:92px;width:min(410px,calc(100vw - 28px));height:min(650px,calc(100dvh - 120px));min-height:440px;display:none;grid-template-rows:auto 1fr auto;border:1px solid rgba(112,196,220,.35);border-radius:22px;overflow:hidden;background:#071831;color:#f5f7fa;box-shadow:0 24px 80px rgba(0,0,0,.45),0 0 40px rgba(52,151,194,.10)}
    .mh-panel[data-open="true"]{display:grid;animation:mh-in .2s ease-out}
    @keyframes mh-in{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
    .mh-header{display:flex;align-items:center;gap:11px;padding:13px 15px;background:radial-gradient(circle at 12% 0%,rgba(50,151,196,.24),transparent 40%),linear-gradient(120deg,#102e50,#071831 78%);border-bottom:1px solid rgba(255,255,255,.09)}
    .mh-header img{width:49px;height:49px;object-fit:contain;border-radius:50%;background:#0b2442;flex:0 0 auto}
    .mh-heading{min-width:0;flex:1}
    .mh-heading strong{display:block;font-size:14px;letter-spacing:.01em}
    .mh-heading span{display:block;margin-top:3px;font-size:10px;color:#b9cbdc}
    .mh-status{display:inline-flex;align-items:center;gap:5px;color:#9ee4c5!important}
    .mh-status::before{content:"";width:6px;height:6px;border-radius:50%;background:#65d7a5}
    .mh-icon-btn{width:33px;height:33px;display:grid;place-items:center;border:1px solid rgba(255,255,255,.14);border-radius:10px;background:rgba(255,255,255,.05);color:#e8edf3;cursor:pointer;font-size:18px}
    .mh-icon-btn:hover{background:rgba(255,255,255,.12)}
    .mh-body{padding:15px 14px 18px;overflow:auto;overscroll-behavior:contain;background:radial-gradient(ellipse at 90% 0%,rgba(34,112,158,.13),transparent 42%),#071831}
    .mh-intro{display:flex;align-items:flex-start;gap:10px;margin-bottom:13px}
    .mh-intro img{width:48px;height:48px;object-fit:contain;flex:0 0 auto}
    .mh-bubble{max-width:100%;padding:11px 13px;border:1px solid rgba(120,177,205,.18);border-radius:4px 15px 15px 15px;background:#102846;color:#edf3f8;font-size:13px;line-height:1.52;white-space:pre-wrap;overflow-wrap:anywhere}
    .mh-message{display:flex;margin:10px 0;gap:8px;align-items:flex-end}
    .mh-message.user{justify-content:flex-end}
    .mh-message.user .mh-bubble{background:#173a5b;border-color:rgba(100,194,224,.3);border-radius:15px 4px 15px 15px;max-width:88%}
    .mh-message.assistant .mh-bubble{max-width:91%}
    .mh-message img{width:28px;height:28px;object-fit:contain;flex:0 0 auto}
    .mh-quick-title{margin:16px 0 8px 2px;color:#9fb5c8;font-size:10px;letter-spacing:.1em;text-transform:uppercase;font-weight:700}
    .mh-quick-list{display:grid;gap:7px}
    .mh-quick{width:100%;padding:10px 12px;border:1px solid rgba(110,183,211,.25);border-radius:11px;background:rgba(14,42,70,.86);color:#e9f1f7;text-align:left;font-family:inherit;font-size:12px;font-weight:600;line-height:1.35;cursor:pointer;transition:background .15s,border-color .15s}
    .mh-quick:hover{background:#15395b;border-color:rgba(107,209,235,.7)}
    .mh-quick:focus-visible,.mh-send:focus-visible,.mh-icon-btn:focus-visible,.mh-launcher:focus-visible,.mh-input:focus-visible{outline:2px solid #8fe3f4;outline-offset:2px}
    .mh-card-list{display:grid;gap:8px;margin:12px 0 4px 36px}
    .mh-card{display:block;padding:11px 12px;border:1px solid rgba(214,179,93,.34);border-radius:12px;background:linear-gradient(135deg,rgba(21,49,76,.95),rgba(9,29,52,.95));color:#f4f2e9;text-decoration:none}
    .mh-card strong{display:block;font-size:12px;line-height:1.35}
    .mh-card span{display:block;margin-top:5px;color:#b7c8d8;font-size:11px;line-height:1.4}
    .mh-card em{display:block;margin-top:8px;color:#e6c36c;font-size:10px;font-style:normal;font-weight:750}
    .mh-footer{padding:11px 13px 12px;border-top:1px solid rgba(255,255,255,.09);background:#091d35}
    .mh-compose{display:flex;align-items:flex-end;gap:8px}
    .mh-input{width:100%;min-height:42px;max-height:100px;resize:none;padding:11px 12px;border:1px solid rgba(125,178,205,.28);border-radius:12px;background:#102846;color:#f6f8fa;font:13px/1.4 inherit;outline:none}
    .mh-input::placeholder{color:#9aafc2}
    .mh-send{width:43px;height:42px;flex:0 0 auto;border:0;border-radius:12px;background:linear-gradient(135deg,#e4c36e,#c49b42);color:#10233c;font-size:18px;font-weight:800;cursor:pointer}
    .mh-send:disabled{opacity:.45;cursor:not-allowed}
    .mh-privacy{margin:8px 2px 0;color:#8197aa;font-size:9px;line-height:1.4}
    .mh-privacy a{color:#d9bb72;text-decoration:underline;text-underline-offset:2px}
    .mh-typing{display:flex;align-items:center;gap:4px;padding:12px 14px}
    .mh-typing i{width:5px;height:5px;border-radius:50%;background:#a9c8d9;animation:mh-dot 1s infinite ease-in-out}
    .mh-typing i:nth-child(2){animation-delay:.15s}.mh-typing i:nth-child(3){animation-delay:.3s}
    @keyframes mh-dot{0%,70%,100%{opacity:.35;transform:translateY(0)}35%{opacity:1;transform:translateY(-3px)}}
    .mh-reset{border:0;background:none;color:#b6c8d8;font-family:inherit;font-size:10px;font-weight:600;cursor:pointer;padding:5px 0;text-decoration:underline;text-underline-offset:3px}
    .mh-reset:hover{color:#f1d37d}
    .mh-error{color:#ffd3c9!important;border-color:rgba(255,135,112,.35)!important}
    @media(max-width:600px){
      .mh-launcher{right:14px;bottom:14px;padding:6px}
      .mh-launcher img{width:52px;height:52px}
      .mh-launcher-copy{display:none}
      .mh-launcher .mh-pulse{top:5px;left:5px}
      .mh-panel{inset:8px;width:auto;height:auto;min-height:0;max-height:none;border-radius:19px}
      .mh-header{padding-top:calc(12px + env(safe-area-inset-top))}
      .mh-footer{padding-bottom:calc(10px + env(safe-area-inset-bottom))}
    }
    @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}
  `;

  const host = document.createElement('div');
  host.setAttribute('data-major-h-root', '');
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <style>${css}</style>
    <button class="mh-launcher" type="button" aria-label="Abrir consultor Major H" aria-haspopup="dialog" aria-expanded="false">
      <span class="mh-pulse" aria-hidden="true"></span>
      <img alt="" src="${assetBase + assets.welcome}">
      <span class="mh-launcher-copy"><strong>Conversar com Major H</strong><span>Seu guia de presença digital</span></span>
    </button>
    <section class="mh-panel" role="dialog" aria-modal="false" aria-label="Consultor digital Major H" data-open="false">
      <header class="mh-header">
        <img class="mh-header-avatar" alt="Major H" src="${assetBase + assets.welcome}">
        <div class="mh-heading"><strong>Major H</strong><span class="mh-status">Consultor digital</span></div>
        <button class="mh-icon-btn mh-reset-btn" type="button" aria-label="Reiniciar conversa" title="Reiniciar conversa">↻</button>
        <button class="mh-icon-btn mh-close" type="button" aria-label="Fechar conversa" title="Fechar">×</button>
      </header>
      <div class="mh-body" aria-live="polite" aria-relevant="additions text">
        <div class="mh-intro">
          <img alt="" src="${assetBase + assets.welcome}">
          <div class="mh-bubble">Oi! Eu sou o Major H, assistente virtual do Wendell. 🚀<br><br>Posso ajudar você a entender o que sua presença digital precisa — mesmo que ainda não saiba o nome do serviço.</div>
        </div>
        <div class="mh-quick-title">Por onde começamos?</div>
        <div class="mh-quick-list" data-quick-list>
          <button class="mh-quick" type="button" data-profile="empresa">Tenho uma empresa ou negócio</button>
          <button class="mh-quick" type="button" data-profile="profissional">Sou profissional ou especialista</button>
          <button class="mh-quick" type="button" data-profile="artista">Sou artista ou músico</button>
          <button class="mh-quick" type="button" data-profile="institucional">Represento uma instituição ou liderança pública</button>
          <button class="mh-quick" type="button" data-profile="indefinido">Ainda não sei exatamente o que preciso</button>
        </div>
      </div>
      <footer class="mh-footer">
        <div class="mh-compose">
          <textarea class="mh-input" rows="1" maxlength="700" placeholder="Ou escreva sua dúvida..." aria-label="Escreva sua mensagem"></textarea>
          <button class="mh-send" type="button" aria-label="Enviar mensagem">➤</button>
        </div>
        <div class="mh-privacy">Sou um assistente virtual. Não envie senhas, documentos ou dados sensíveis. <a href="https://wendellsoares.jor.br/#contato" target="_blank" rel="noopener">Falar com Wendell</a>.</div>
      </footer>
    </section>
  `;
  document.body.appendChild(host);

  const $ = (selector) => shadow.querySelector(selector);
  const launcher = $('.mh-launcher');
  const panel = $('.mh-panel');
  const body = $('.mh-body');
  const input = $('.mh-input');
  const sendButton = $('.mh-send');
  const headerAvatar = $('.mh-header-avatar');

  let isOpen = false;
  let profile = 'indefinido';
  let history = [];
  let diagnosticQuestions = 0;
  let busy = false;

  function setExpression(expression = 'welcome') {
    const file = assets[expression] || assets.welcome;
    headerAvatar.src = assetBase + file;
  }

  function openPanel() {
    isOpen = true;
    panel.dataset.open = 'true';
    launcher.setAttribute('aria-expanded', 'true');
    launcher.hidden = true;
    setTimeout(() => input.focus(), 50);
  }
  function closePanel() {
    isOpen = false;
    panel.dataset.open = 'false';
    launcher.hidden = false;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  }
  function scrollBottom() {
    body.scrollTop = body.scrollHeight;
  }
  function appendMessage(role, text, expression = 'welcome') {
    const row = document.createElement('div');
    row.className = `mh-message ${role}`;
    if (role === 'assistant') {
      const img = document.createElement('img');
      img.alt = '';
      img.src = assetBase + (assets[expression] || assets.welcome);
      row.appendChild(img);
    }
    const bubble = document.createElement('div');
    bubble.className = 'mh-bubble';
    bubble.textContent = text;
    row.appendChild(bubble);
    body.appendChild(row);
    scrollBottom();
  }
  function setQuickReplies(title, options, dataKey) {
    const oldTitle = $('.mh-quick-title');
    const oldList = $('[data-quick-list]');
    if (oldTitle) oldTitle.remove();
    if (oldList) oldList.remove();

    const heading = document.createElement('div');
    heading.className = 'mh-quick-title';
    heading.textContent = title;
    body.appendChild(heading);

    const list = document.createElement('div');
    list.className = 'mh-quick-list';
    list.dataset.quickList = '';
    options.forEach((option) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'mh-quick';
      button.textContent = option;
      button.dataset[dataKey] = option;
      list.appendChild(button);
    });
    body.appendChild(list);
    scrollBottom();
  }
  function clearQuickReplies() {
    $('[data-quick-list]')?.remove();
    $('.mh-quick-title')?.remove();
  }
  function addCards(container, items, kind) {
    if (!Array.isArray(items) || !items.length) return;
    const list = document.createElement('div');
    list.className = 'mh-card-list';
    items.slice(0, 3).forEach((item) => {
      try {
        const url = new URL(item.url);
        if (url.hostname !== 'wendellsoares.jor.br') return;
        const card = document.createElement('a');
        card.className = 'mh-card';
        card.href = url.href;
        card.target = '_blank';
        card.rel = 'noopener';
        const title = document.createElement('strong');
        title.textContent = item.name || item.title || 'Conhecer conteúdo';
        const description = document.createElement('span');
        description.textContent = item.short || item.description || '';
        const link = document.createElement('em');
        link.textContent = kind === 'article' ? 'Ler artigo ↗' : 'Conhecer solução ↗';
        card.append(title, description, link);
        list.appendChild(card);
      } catch (_) {
        // Ignore malformed or untrusted URLs.
      }
    });
    if (list.children.length) {
      container.appendChild(list);
      scrollBottom();
    }
  }
  function addActionCard(container, action) {
    if (!action || typeof action.url !== 'string') return;
    try {
      const url = new URL(action.url);
      const allowedHosts = new Set(['scanner-ws.dell-soares.workers.dev', 'wa.me']);
      if (url.protocol !== 'https:' || !allowedHosts.has(url.hostname)) return;

      const list = document.createElement('div');
      list.className = 'mh-card-list';
      const card = document.createElement('a');
      card.className = 'mh-card';
      card.href = url.href;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';

      const title = document.createElement('strong');
      title.textContent = action.title || 'Próximo passo';
      const description = document.createElement('span');
      description.textContent = action.description || '';
      const label = document.createElement('em');
      label.textContent = action.label || 'Acessar ↗';

      card.append(title, description, label);
      list.appendChild(card);
      container.appendChild(list);
      scrollBottom();
    } catch (_) {
      // Ignora ações com URL inválida.
    }
  }

  function showWhatsAppFallback(kind = 'general') {
    const messages = {
      credits: 'Nossa conexão está limitada neste momento, mas você não precisa ficar sem orientação! 😊 Converse diretamente com o Wendell pelo WhatsApp e tire suas dúvidas. Ele terá prazer em ajudar.',
      busy: 'Nossa central está recebendo muitas solicitações neste momento. Para não deixar você esperando, converse diretamente com o Wendell pelo WhatsApp. 😊',
      general: 'Tive uma dificuldade técnica momentânea ao consultar minha central de orientação. Mas você não precisa ficar sem ajuda: converse diretamente com o Wendell pelo WhatsApp e explique o que precisa.'
    };
    const topics = {
      credits: 'tirar minhas dúvidas e conversar sobre meu projeto',
      busy: 'continuar a conversa sobre meu projeto',
      general: 'tirar minhas dúvidas sobre meu projeto'
    };
    const text = `Olá, Wendell! Conversei com o Major H e gostaria de ${topics[kind] || topics.general}.`;
    appendMessage('assistant', messages[kind] || messages.general, 'thinking');
    history.push({ role: 'assistant', content: messages[kind] || messages.general });
    addActionCard(body, {
      title: 'Converse diretamente com Wendell',
      description: 'Tire suas dúvidas e encontre o melhor caminho para seu projeto.',
      label: 'Conversar pelo WhatsApp ↗',
      url: `https://wa.me/5531983073854?text=${encodeURIComponent(text)}`
    });
    setExpression('thinking');
  }

  function addAssistantResponse(data) {
    const reply = typeof data.reply === 'string' && data.reply.trim()
      ? data.reply.trim()
      : 'Entendi. Quero evitar indicar algo sem contexto. Você pode me contar um pouco mais sobre o que deseja alcançar?';
    const expression = assets[data.expression] ? data.expression : 'thinking';
    appendMessage('assistant', reply, expression);
    history.push({ role: 'assistant', content: reply });
    if (/[?？]/.test(reply)) {
      diagnosticQuestions = Math.min(4, diagnosticQuestions + 1);
    }
    addCards(body, data.recommendations, 'service');
    addCards(body, data.articles, 'article');
    addActionCard(body, data.action);
    setExpression(expression);
  }
  function resetConversation() {
    profile = 'indefinido';
    history = [];
    diagnosticQuestions = 0;
    busy = false;
    body.innerHTML = `
      <div class="mh-intro">
        <img alt="" src="${assetBase + assets.welcome}">
        <div class="mh-bubble">Oi! Eu sou o Major H, assistente virtual do Wendell. 🚀<br><br>Posso ajudar você a entender o que sua presença digital precisa — mesmo que ainda não saiba o nome do serviço.</div>
      </div>
      <div class="mh-quick-title">Por onde começamos?</div>
      <div class="mh-quick-list" data-quick-list>
        <button class="mh-quick" type="button" data-profile="empresa">Tenho uma empresa ou negócio</button>
        <button class="mh-quick" type="button" data-profile="profissional">Sou profissional ou especialista</button>
        <button class="mh-quick" type="button" data-profile="artista">Sou artista ou músico</button>
        <button class="mh-quick" type="button" data-profile="institucional">Represento uma instituição ou liderança pública</button>
        <button class="mh-quick" type="button" data-profile="indefinido">Ainda não sei exatamente o que preciso</button>
      </div>`;
    setExpression('welcome');
    input.value = '';
    input.disabled = false;
    sendButton.disabled = false;
    scrollBottom();
  }

  const mockResponses = [
    {
      test: /google|busca|aparec/i,
      reply: 'Entendi. Primeiro precisamos separar duas coisas: a ficha da empresa no Google e as páginas do seu site nos resultados de busca. Se você me disser se o negócio atende em um endereço físico ou trabalha pela internet, consigo indicar o caminho mais adequado.',
      expression: 'thinking',
      recommendations: ['google-perfil', 'auditoria']
    },
    {
      test: /site|p[aá]gina|internet/i,
      reply: 'Um site próprio ajuda a apresentar o que você faz, organizar informações e deixar claro como a pessoa pode entrar em contato. Se já existe um site, também podemos avaliar o que precisa melhorar antes de pensar em refazer tudo.',
      expression: 'confident',
      recommendations: ['sites', 'auditoria']
    },
    {
      test: /m[uú]sic|banda|artista|show/i,
      reply: 'Para um artista, um site pode funcionar como um palco próprio: reúne músicas, vídeos, trajetória e informações para quem deseja conhecer ou contratar o trabalho.',
      expression: 'happy',
      recommendations: ['sites-musicos']
    },
    {
      test: /pol[ií]tic|mandato|campanha|institui/i,
      reply: 'Nesse contexto, vale começar pela clareza da comunicação: quem é a liderança, quais informações precisam estar disponíveis e como apresentar o trabalho de forma responsável e verificável.',
      expression: 'confident',
      recommendations: ['politica', 'assessoria-politica']
    }
  ];
  function mockReply(message) {
    const found = mockResponses.find((item) => item.test.test(message));
    const selected = found || {
      reply: 'Posso ajudar a encontrar um caminho. Para não sugerir um serviço sem entender sua situação, me conte: hoje o maior desafio é ser encontrado, explicar melhor o que você faz ou transformar visitas em contatos?',
      expression: 'thinking',
      recommendations: []
    };
    const options = {
      'google-perfil': { name: 'Perfil da Empresa no Google', short: 'Organização da ficha do negócio no Google e Maps.', url: 'https://wendellsoares.jor.br/#servicos' },
      'auditoria': { name: 'Diagnóstico de rastreabilidade do site', short: 'Verificação de como páginas importantes são acessadas pelos mecanismos de busca.', url: 'https://wendellsoares.jor.br/#servicos' },
      'sites': { name: 'Criação de sites', short: 'Sites claros e adaptados para apresentar seu negócio.', url: 'https://wendellsoares.jor.br/#servicos' },
      'sites-musicos': { name: 'Sites para músicos, artistas e projetos culturais', short: 'Um espaço próprio para apresentar músicas, vídeos, trajetória e contatos.', url: 'https://wendellsoares.jor.br/musicos/' },
      'politica': { name: 'Posicionamento digital público e político', short: 'Comunicação pública com clareza, coerência e transparência.', url: 'https://wendellsoares.jor.br/#servicos' },
      'assessoria-politica': { name: 'Assessoria política e soluções corporativas', short: 'Conheça as soluções corporativas para comunicação e posicionamento.', url: 'https://wendellsoares.jor.br/corporativo/' }
    };
    return {
      reply: selected.reply,
      expression: selected.expression,
      recommendations: selected.recommendations.map((id) => options[id]).filter(Boolean),
      articles: []
    };
  }

  async function requestAssistant(message) {
    if (busy) return;
    busy = true;
    input.disabled = true;
    sendButton.disabled = true;
    clearQuickReplies();
    const typing = document.createElement('div');
    typing.className = 'mh-message assistant';
    typing.innerHTML = `<img alt="" src="${assetBase + assets.thinking}"><div class="mh-bubble mh-typing" aria-label="Major H está pensando"><i></i><i></i><i></i></div>`;
    body.appendChild(typing);
    scrollBottom();

    try {
      let data;
      if (mode === 'preview') {
        await new Promise((resolve) => setTimeout(resolve, 650));
        data = mockReply(message);
      } else {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            profile,
            question_count: diagnosticQuestions,
            history: history.slice(0, -1).slice(-6)
          }),
          signal: AbortSignal.timeout(25000)
        });
        if (response.status === 429) throw new Error('LIMIT');
        if (!response.ok) throw new Error('API');
        data = await response.json();
      }
      typing.remove();
      addAssistantResponse(data);
    } catch (error) {
      typing.remove();
      console.error('Major H chat request failed:', error);
      showWhatsAppFallback(error.message === 'LIMIT' ? 'busy' : 'general');
    } finally {
      busy = false;
      input.disabled = false;
      sendButton.disabled = false;
      input.focus();
      scrollBottom();
    }
  }

  function sendFreeText() {
    const message = input.value.trim();
    if (!message || busy) return;
    input.value = '';
    appendMessage('user', message);
    history.push({ role: 'user', content: message });
    requestAssistant(message);
  }

  launcher.addEventListener('click', openPanel);
  $('.mh-close').addEventListener('click', closePanel);
  $('.mh-reset-btn').addEventListener('click', resetConversation);
  sendButton.addEventListener('click', sendFreeText);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendFreeText();
    }
  });
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 100)}px`;
  });

  shadow.addEventListener('click', (event) => {
    const profileButton = event.target.closest('[data-profile]');
    if (profileButton) {
      profile = profileButton.dataset.profile;
      const label = profiles[profile]?.label || profiles.indefinido.label;
      appendMessage('user', label);
      history.push({ role: 'user', content: label });
      clearQuickReplies();
      appendMessage('assistant', 'Perfeito. O que você gostaria de melhorar ou resolver primeiro?', 'happy');
      history.push({ role: 'assistant', content: 'Perfeito. O que você gostaria de melhorar ou resolver primeiro?' });
      diagnosticQuestions = 1;
      setQuickReplies('Escolha uma opção ou escreva sua situação', profiles[profile]?.options || profiles.indefinido.options, 'intent');
      return;
    }

    const intentButton = event.target.closest('[data-intent]');
    if (intentButton) {
      const intent = intentButton.dataset.intent;
      appendMessage('user', intent);
      history.push({ role: 'user', content: intent });
      clearQuickReplies();
      if (/prefiro explicar|prefiro escrever/i.test(intent)) {
        appendMessage('assistant', 'Claro. Pode contar do seu jeito. Não precisa conhecer nenhum termo técnico.', 'happy');
        history.push({ role: 'assistant', content: 'Claro. Pode contar do seu jeito. Não precisa conhecer nenhum termo técnico.' });
        input.focus();
        return;
      }
      requestAssistant(intent);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen) closePanel();
  });

  if (mode === 'preview') {
    const previewTag = document.createElement('div');
    previewTag.textContent = 'Prévia local · respostas simuladas';
    previewTag.style.cssText = 'position:fixed;z-index:2147482999;right:24px;bottom:84px;padding:5px 8px;border:1px solid #b89a54;border-radius:7px;background:#071831;color:#e9d28f;font:10px system-ui;letter-spacing:.02em';
    document.body.appendChild(previewTag);
  }
})();
