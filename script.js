/* Wendell Soares · Protótipo 02. Sem analytics, sem backend ou transmissão de dados. */
(() => {
  'use strict';
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const groups = [
    { id:'todos', label:'Todos' },
    { id:'presenca', label:'Presença digital' },
    { id:'conteudo', label:'Conteúdo' },
    { id:'identidade', label:'Identidade' },
    { id:'visibilidade', label:'Buscas & IA' },
    { id:'reputacao', label:'Reputação' },
    { id:'interacao', label:'Interação' },
  ];
  const services = [
    {id:'sites',group:'presenca',name:'Criação de sites',short:'Sites claros, bonitos e fáceis de usar no celular, feitos para apresentar seu negócio.',full:'Planejamento e desenvolvimento de sites que organizam sua história, serviços e diferenciais. O objetivo é unir visual profissional, boa navegação e conteúdo acessível.',items:['Estrutura e organização das páginas','Design adaptado a celulares','Textos claros e chamadas para contato','Ajustes básicos de velocidade e busca']},
    {id:'landing',group:'presenca',name:'Landing pages',short:'Páginas focadas em uma oferta ou campanha, com um próximo passo bem definido.',full:'Criação de páginas específicas para captar contatos, apresentar um serviço, vender uma oferta ou apoiar um lançamento, sem distrair o visitante.',items:['Mensagem principal e apresentação da oferta','Organização de benefícios e dúvidas','Botões e formulários de ação','Versões adaptadas para celular']},
    {id:'google-perfil',group:'presenca',name:'Perfil da Empresa no Google',short:'Organização da ficha do negócio para melhorar sua apresentação no Google e no Maps.',full:'Revisão das informações públicas da empresa para facilitar que clientes entendam onde você está, o que oferece e como entrar em contato.',items:['Revisão de categorias e descrição','Horários, endereço e canais de contato','Orientações para fotos e publicações','Análise de informações inconsistentes'],note:'Os recursos disponíveis variam conforme a elegibilidade e as regras do Google.'},
    {id:'linkedin',group:'presenca',name:'Presença no LinkedIn',short:'Perfil e publicações com mais clareza para apresentar sua experiência e sua visão.',full:'Estruturo a comunicação profissional no LinkedIn para dar contexto ao seu trabalho, organizar sua trajetória e compartilhar ideias com consistência.',items:['Revisão da apresentação e do resumo','Organização de experiência e competências reais','Pautas e textos para publicações','Linguagem alinhada ao público profissional']},
    {id:'ecommerce',group:'conteudo',name:'Textos que ajudam a vender',short:'Descrições e argumentos para lojas virtuais que explicam valor, benefício e diferenciais.',full:'Produzo textos persuasivos para páginas de produto, categorias e vitrines de e-commerce, sem fórmulas vazias ou promessas exageradas.',items:['Benefícios claros em linguagem do cliente','Descrição de produto e dúvidas frequentes','Títulos e microtextos de botões','Consistência de tom entre as páginas']},
    {id:'release',group:'conteudo',name:'Releases para imprensa',short:'Apresentações jornalísticas para comunicar novidades com contexto e relevância.',full:'Desenvolvo textos voltados à imprensa e a publicações institucionais, com uma história bem organizada, informações verificáveis e um motivo claro para a notícia.',items:['Definição do gancho de notícia','Título, subtítulo e texto-base','Informações e fontes de apoio','Adaptação para diferentes públicos'],note:'A criação de um release não garante publicação por veículos de imprensa.'},
    {id:'blog',group:'conteudo',name:'Atualização de conteúdos de blog',short:'Textos antigos ganham clareza, organização e informação atualizada.',full:'Reviso conteúdos já publicados para corrigir lacunas, facilitar a leitura e deixar as respostas mais úteis para pessoas e mecanismos de busca.',items:['Identificação de páginas desatualizadas','Melhoria de títulos e subtítulos','Revisão de conteúdo e referências','Links internos e perguntas relevantes']},
    {id:'social',group:'conteudo',name:'Conteúdo para redes sociais',short:'Pautas, legendas e formatos que mantêm sua marca presente sem repetir o óbvio.',full:'Planejo e escrevo conteúdo para redes sociais de acordo com o público, a proposta da marca e o contexto de cada canal.',items:['Pautas e calendário editorial','Roteiros e legendas','Sequências educativas e de apresentação','Coerência entre visual, texto e posicionamento']},
    {id:'artigos',group:'conteudo',name:'Artigos para construir autoridade',short:'Textos autorais que apresentam conhecimento, ponto de vista e experiência real.',full:'Estruturo artigos para seu site ou para publicações externas, com temas que reforcem sua atuação e sejam úteis para quem pesquisa a área.',items:['Seleção de temas com relevância','Pesquisa, estrutura e redação','Fontes e referências verificáveis','Adaptação editorial ao canal de publicação'],note:'Publicação externa e destaque editorial dependem da aprovação dos veículos e sites.'},
    {id:'rebrand',group:'identidade',name:'Renovação de marca (rebranding)',short:'Uma atualização de identidade e mensagem para representar melhor o negócio de hoje.',full:'Reorganizo a apresentação visual e verbal da marca, conectando aparência, personalidade e posicionamento estratégico.',items:['Diagnóstico da percepção atual','Direção visual e tom de voz','Revisão de mensagens centrais','Aplicações nos canais digitais']},
    {id:'motion',group:'identidade',name:'Animações e motions',short:'Movimento para explicar ideias, apresentar produtos e dar ritmo à comunicação.',full:'Crio peças animadas para dar clareza a mensagens, tornar apresentações mais interessantes e produzir recursos visuais para campanhas e sites.',items:['Conceito e roteiro visual','Animação de textos e elementos gráficos','Peças para site e redes sociais','Adaptação aos formatos combinados']},
    {id:'auditoria',group:'visibilidade',name:'Diagnóstico de rastreabilidade do site',short:'Verifico se as páginas importantes estão acessíveis aos mecanismos de busca.',full:'Analiso como as páginas são encontradas, percorridas e interpretadas por ferramentas de busca, procurando obstáculos técnicos e de conteúdo.',items:['Verificação de indexação e caminhos de navegação','Robots, links e informações técnicas relevantes','Páginas duplicadas ou inacessíveis','Lista priorizada de melhorias']},
    {id:'imagens',group:'visibilidade',name:'Otimização de imagens',short:'Imagens mais leves, bem identificadas e úteis sem sacrificar a experiência visual.',full:'Ajusto tamanhos, formatos e informações descritivas das imagens para melhorar carregamento, acessibilidade e contexto das páginas.',items:['Compressão e formatos adequados','Textos alternativos quando úteis','Nomes e contexto das imagens','Ajustes para diferentes telas']},
    {id:'faq-ia',group:'visibilidade',name:'Perguntas e respostas para buscas e IA',short:'Organizo respostas objetivas às dúvidas que as pessoas realmente fazem.',full:'Crio seções de perguntas frequentes com linguagem natural e informação útil, facilitando a leitura e a compreensão do conteúdo.',items:['Levantamento de dúvidas do público','Respostas claras e fundamentadas','Estrutura de leitura organizada','Integração ao conteúdo do site'],note:'Nenhum FAQ garante que sistemas de IA citem uma marca ou usem um trecho como resposta.'},
    {id:'leitura-ia',group:'visibilidade',name:'Site mais claro para pessoas e IAs',short:'Organizo textos e páginas para que assunto, autoria e serviços sejam fáceis de compreender.',full:'Reviso títulos, páginas institucionais, links e estrutura do conteúdo para tornar as informações acessíveis, consistentes e contextualizadas.',items:['Conteúdo principal visível em texto','Estrutura de títulos e navegação','Autoria e informações institucionais claras','Coerência entre informações visíveis e técnicas'],note:'Não existe configuração especial que garanta presença nas respostas de IA. As boas práticas de busca e qualidade continuam essenciais.'},
    {id:'wikidata',group:'visibilidade',name:'Organização de dados na Wikidata',short:'Avalio informações públicas que podem ser representadas em bases de conhecimento.',full:'Analiso a presença e a consistência de informações públicas sobre entidades na Wikidata, respeitando critérios de elegibilidade, fontes e regras comunitárias.',items:['Levantamento de fontes públicas verificáveis','Análise de elegibilidade e eventuais duplicidades','Correção ou estruturação cabível de dados','Revisão de consistência entre referências'],note:'Criação, alteração e permanência de registros dependem das políticas e da comunidade da Wikidata.'},
    {id:'judiciais',group:'reputacao',name:'Exposição em sites de processos judiciais',short:'Análise responsável de como seu nome aparece em plataformas como Escavador e Jusbrasil.',full:'Avalio referências públicas a processos e ajudo a organizar pedidos de revisão, ocultação ou anonimização quando houver fundamentos e canais cabíveis.',items:['Mapeamento de URLs e referências públicas','Análise inicial de possibilidades de solicitação','Organização de documentos e informações necessárias','Orientação sobre canais adequados'],note:'Registros judiciais podem ter caráter público. Não há promessa de anonimização; casos jurídicos podem exigir aconselhamento de advogado.'},
    {id:'desindex',group:'reputacao',name:'Resultados antigos no Google',short:'Avalio páginas inativas ou desatualizadas que continuam aparecendo nas buscas.',full:'Identifico se o resultado antigo ainda tem uma página ativa por trás, quem controla o conteúdo e quais procedimentos de atualização ou remoção são aplicáveis.',items:['Diagnóstico das páginas e resultados encontrados','Verificação de conteúdo removido ou alterado','Orientação sobre solicitações adequadas','Acompanhamento do status disponível'],note:'Retirada de resultados depende das condições do conteúdo, das ferramentas usadas e das decisões das plataformas. Bloqueios podem ser temporários.'},
    {id:'politica',group:'reputacao',name:'Posicionamento digital público e político',short:'Comunicação clara e consistente para atuação pública, institucional e política.',full:'Apoio na organização de presença pública e comunicação institucional com foco em clareza, transparência e coerência entre canais, preservando informações verificáveis.',items:['Diagnóstico de identidade pública e mensagens','Site institucional e apresentação de propostas','Clareza de linguagem e organização de canais','Cuidados com fontes, responsabilidade e transparência'],note:'Escopo sujeito à legislação eleitoral aplicável. Não inclui desinformação, perfis falsos ou uso indevido de dados pessoais.'},
    {id:'quizzes',group:'interacao',name:'Quizzes e ferramentas interativas',short:'Recursos para que o visitante participe, descubra e avance no seu site.',full:'Desenvolvo quizzes, calculadoras simples, seletoras de serviços e outros widgets que tornam a navegação mais útil e memorável.',items:['Ideia e fluxo de interação','Interface acessível em celular','Perguntas, respostas e resultados','Integração visual com o site'],note:'Coleta ou armazenamento de dados de usuários exige aviso de privacidade e configuração adequada.'}
  ];
  const STORAGE = 'wendell-soares-prototipo-v2-rota';
  const safe = s => String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const strip = s => String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  let selection = [];
  try { selection=JSON.parse(localStorage.getItem(STORAGE)||'[]'); if(!Array.isArray(selection)) selection=[]; selection=selection.filter(id=>services.some(s=>s.id===id)); } catch {selection=[]}
  let currentFilter='todos', currentSearch='', activeOverlay='', previousFocus=null, toastTimer;
  function persist(){try{localStorage.setItem(STORAGE,JSON.stringify(selection))}catch{}}
  function count(){ $$('[data-selected-count]').forEach(n=>n.textContent=selection.length); }
  function toast(s){ const e=$('#toast'); if(!e)return; e.textContent=s; e.classList.add('visible'); clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.classList.remove('visible'),2900); }
  async function copy(s){try{await navigator.clipboard.writeText(s);toast('Texto copiado.');return}catch{} const n=document.createElement('textarea');n.value=s;n.style.position='fixed';n.style.left='-9999px';document.body.append(n);n.select();try{const ok=document.execCommand('copy');toast(ok?'Texto copiado.':'Selecione o texto para copiar.')}catch{toast('Selecione o texto para copiar.')}n.remove()}
  function getGroup(id){return groups.find(g=>g.id===id)?.label || 'Solução'}
  function renderFilters(){const e=$('#filters');if(!e)return;e.innerHTML=groups.map(g=>`<button type="button" class="filter ${currentFilter===g.id?'is-active':''}" data-filter="${safe(g.id)}" aria-pressed="${currentFilter===g.id}">${safe(g.label)}</button>`).join('')}
  function filtered(){return services.filter(s=>(currentFilter==='todos'||s.group===currentFilter)&&(!currentSearch||strip([s.name,s.short,s.full,s.group,...s.items].join(' ')).includes(strip(currentSearch))))}
  function renderServices(){const root=$('#services-list');if(!root)return;const items=filtered();root.innerHTML=items.length?items.map(s=>{const i=services.indexOf(s);const added=selection.includes(s.id);return `<article class="service-card"><span class="service-number">${String(i+1).padStart(2,'0')}</span><div><div class="service-meta">${safe(getGroup(s.group))}</div><h3>${safe(s.name)}</h3><p>${safe(s.short)}</p></div><div class="service-actions"><button type="button" class="service-more" data-service="${safe(s.id)}" title="Detalhes: ${safe(s.name)}" aria-label="Ver detalhes de ${safe(s.name)}">↗</button><button type="button" class="service-add ${added?'is-added':''}" data-add="${safe(s.id)}" title="${added?'Remover da minha rota':'Adicionar à minha rota'}" aria-label="${added?'Remover':'Adicionar'} ${safe(s.name)} ${added?'da':'à'} minha rota">${added?'✓':'+'}</button></div></article>`}).join(''):'<div class="empty-state">Nenhuma solução encontrada. Experimente outra palavra ou limpe os filtros.</div>';
    $('#result-count').textContent=`${items.length} ${items.length===1?'serviço disponível':'serviços disponíveis'}`;renderFilters();}
  function renderSelection(){count();const root=$('#selected-list');if(!root)return;root.innerHTML=selection.length?selection.map(id=>{const s=services.find(x=>x.id===id);return `<div class="selected-item"><div><h3>${safe(s.name)}</h3><small>${safe(getGroup(s.group))}</small></div><button type="button" data-remove="${safe(id)}" aria-label="Remover ${safe(s.name)} da seleção">×</button></div>`}).join(''):'<p class="empty-shortlist">Sua rota ainda está vazia. Explore os serviços e use o botão + para escolher os que deseja conversar.</p>'}
  function toggle(id){if(!services.some(s=>s.id===id))return;selection=selection.includes(id)?selection.filter(x=>x!==id):[...selection,id];persist();renderServices();renderSelection();toast(selection.includes(id)?'Serviço adicionado à sua rota.':'Serviço removido da rota.');}
  function open(type){if(activeOverlay)close(false);previousFocus=document.activeElement;activeOverlay=type;$('#overlay').hidden=false;document.body.classList.add('is-locked');const el=type==='selection'?$('#selection-drawer'):$('#detail-modal');el.setAttribute('aria-hidden','false');el.classList.add('is-open');setTimeout(()=>el.querySelector('[data-close]')?.focus(),0);if(type==='selection')renderSelection()}
  function close(returnFocus=true){if(!activeOverlay)return;$('#overlay').hidden=true;document.body.classList.remove('is-locked');$$('.drawer,.modal').forEach(el=>{el.classList.remove('is-open');el.setAttribute('aria-hidden','true')});activeOverlay='';if(returnFocus)previousFocus?.focus?.()}
  function details(id){const s=services.find(x=>x.id===id);if(!s)return;const added=selection.includes(id);$('#modal-body').innerHTML=`<div class="kicker">${safe(getGroup(s.group).toUpperCase())} / SOLUÇÃO</div><h2 id="modal-title">${safe(s.name)}</h2><p>${safe(s.full)}</p><h3>O que faz parte do trabalho</h3><ul>${s.items.map(i=>`<li>${safe(i)}</li>`).join('')}</ul>${s.note?`<p class="modal-notice">${safe(s.note)}</p>`:''}<div class="modal-footer"><button type="button" class="btn btn-gold" data-modal-add="${safe(id)}">${added?'Remover da minha rota':'Adicionar à minha rota'} ↗</button><button type="button" class="btn btn-outline" data-close>Voltar à lista</button></div>`;open('modal')}
  function copyRoute(){if(!selection.length){toast('Selecione pelo menos um serviço.');return}const names=selection.map(id=>services.find(s=>s.id===id)?.name).filter(Boolean);copy('Olá, Wendell! Quero conversar sobre as seguintes soluções:\n\n'+names.map((name,i)=>`${i+1}. ${name}`).join('\n')+'\n\nMeu objetivo é: ')}
  function setFilter(cat){const actual=cat==='conversao'?'conteudo':cat;currentFilter=groups.some(g=>g.id===actual)?actual:'todos';currentSearch='';if($('#service-search'))$('#service-search').value='';renderServices()}
  function prepareBriefing(event){event.preventDefault();const form=event.currentTarget;if(!form.reportValidity())return;const data=new FormData(form);const name=String(data.get('nome')||'').trim();const email=String(data.get('email')||'').trim();const goal=String(data.get('objetivo')||'').trim();const msg=String(data.get('mensagem')||'').trim();const names=selection.map(id=>services.find(s=>s.id===id)?.name).filter(Boolean);const briefing=`Olá, Wendell!\n\nMeu nome: ${name}\nE-mail: ${email||'Não informado'}\nPrincipal objetivo: ${goal||'Ainda estou definindo'}\nO que quero melhorar: ${msg||'Quero conversar sobre possibilidades.'}${names.length?'\n\nServiços selecionados:\n'+names.map(x=>'- '+x).join('\n'):''}\n\nGostaria de conversar sobre uma proposta.`;$('#briefing-output').value=briefing;$('#briefing-result').hidden=false;$('#briefing-result').scrollIntoView({behavior:'smooth',block:'nearest'});toast('Briefing preparado. Nada foi enviado.')}
  function menu(open){const e=$('#mobile-menu'),button=$('#menu-toggle');if(!e||!button)return;e.hidden=!open;button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')}
  document.addEventListener('click',e=>{
    const filter=e.target.closest('[data-filter]');if(filter){setFilter(filter.dataset.filter);return}
    const service=e.target.closest('[data-service]');if(service){details(service.dataset.service);return}
    const add=e.target.closest('[data-add]');if(add){toggle(add.dataset.add);return}
    const modalAdd=e.target.closest('[data-modal-add]');if(modalAdd){toggle(modalAdd.dataset.modalAdd);close();return}
    const remove=e.target.closest('[data-remove]');if(remove){toggle(remove.dataset.remove);return}
    const category=e.target.closest('[data-category-link]');if(category){setFilter(category.dataset.categoryLink);return}
    if(e.target.closest('[data-open-selection]')){open('selection');return}
    if(e.target.closest('[data-close]')||e.target.closest('#overlay')){close();return}
    if(e.target.closest('#menu-toggle')){menu($('#mobile-menu').hidden);return}
    if(e.target.closest('#reset-filters')){setFilter('todos');return}
    if(e.target.closest('#clear-selection')){selection=[];persist();renderSelection();renderServices();toast('Sua rota foi limpa.');return}
    if(e.target.closest('#copy-selection')){copyRoute();return}
    if(e.target.closest('#copy-briefing')){copy($('#briefing-output').value);return}
    if(e.target.closest('.mobile-menu a')){menu(false)}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){close();menu(false)}if(e.key==='Tab'&&activeOverlay){const pane=activeOverlay==='selection'?$('#selection-drawer'):$('#detail-modal');const focusable=$$('button,a[href],input,textarea,select,[tabindex]:not([tabindex="-1"])',pane).filter(x=>!x.disabled);if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
  if($('#service-search'))$('#service-search').addEventListener('input',e=>{currentSearch=e.target.value;renderServices()});
  if($('#contact-form'))$('#contact-form').addEventListener('submit',prepareBriefing);
  if($('#year'))$('#year').textContent=new Date().getFullYear();
  renderServices();renderSelection();
})();

/* Arquivo de cases (dados e visuais demonstrativos) */
(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[data-case]')];
  const chooseTab = (id, focus = false) => {
    tabs.forEach(tab => {
      const selected = tab.dataset.case === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById('case-' + tab.dataset.case);
      if (panel) panel.hidden = !selected;
      if (selected && focus) tab.focus();
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => chooseTab(tab.dataset.case));
    tab.addEventListener('keydown', event => {
      const key = event.key;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(key)) return;
      event.preventDefault();
      const next = key === 'Home' ? 0 : key === 'End' ? tabs.length - 1 : (index + (key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      chooseTab(tabs[next].dataset.case, true);
    });
  });
  const range = document.getElementById('comparison-range');
  if (range) range.addEventListener('input', () => range.closest('.case-comparator').style.setProperty('--split', range.value + '%'));
  const slides = [...document.querySelectorAll('.authority-mobile-slide')];
  const counter = document.getElementById('authority-counter');
  const mobileCarousel = document.querySelector('.authority-mobile-carousel');
  let slideIndex = 0, isPaused = false;
  const setSlide = index => {
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.hidden = i !== slideIndex; });
    if (counter) counter.textContent = String(slideIndex + 1).padStart(2,'0') + ' / ' + String(slides.length).padStart(2,'0');
  };
  document.getElementById('authority-prev')?.addEventListener('click', () => setSlide(slideIndex - 1));
  document.getElementById('authority-next')?.addEventListener('click', () => setSlide(slideIndex + 1));
  mobileCarousel?.addEventListener('pointerenter', () => {isPaused = true;});
  mobileCarousel?.addEventListener('pointerleave', () => {isPaused = false;});
  mobileCarousel?.addEventListener('focusin', () => {isPaused = true;});
  mobileCarousel?.addEventListener('focusout', () => {isPaused = false;});
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (slides.length && !reduceMotion.matches) {
    window.setInterval(() => {
      const showing = !document.getElementById('case-conteudos')?.hidden;
      const onMobile = window.matchMedia('(max-width: 700px)').matches;
      if (showing && onMobile && !document.hidden && !isPaused) setSlide(slideIndex + 1);
    }, 4800);
  }
})();


/* Arquivos visuais: três imagens por projeto, com navegação manual por toque, teclado, setas e pontos. */
(() => {
  document.querySelectorAll('[data-gallery]').forEach(gallery => {
    const slides = [...gallery.querySelectorAll('[data-gallery-slide]')];
    const dots = [...gallery.querySelectorAll('[data-gallery-dot]')];
    const counter = gallery.querySelector('[data-gallery-index]');
    const caption = gallery.querySelector('[data-gallery-caption]');
    let active = 0;
    function goTo(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.hidden = i !== active;
        slide.setAttribute('aria-hidden', i !== active ? 'true' : 'false');
        slide.querySelector('a')?.setAttribute('tabindex', i === active ? '0' : '-1');
      });
      dots.forEach((dot,i) => dot.setAttribute('aria-current', i === active ? 'true' : 'false'));
      counter.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      caption.textContent = slides[active]?.dataset.caption || '';
    }
    gallery.querySelector('[data-gallery-prev]')?.addEventListener('click', () => goTo(active - 1));
    gallery.querySelector('[data-gallery-next]')?.addEventListener('click', () => goTo(active + 1));
    dots.forEach((dot,i) => dot.addEventListener('click', () => goTo(i)));
    gallery.addEventListener('keydown', ev => {
      if (ev.key === 'ArrowLeft') {ev.preventDefault();goTo(active-1);}
      if (ev.key === 'ArrowRight') {ev.preventDefault();goTo(active+1);}
    });
    let startX = null;
    gallery.addEventListener('touchstart', ev => {startX=ev.touches[0]?.clientX ?? null}, {passive:true});
    gallery.addEventListener('touchend', ev => {
      if (startX === null) return;
      const endX = ev.changedTouches[0]?.clientX ?? startX;
      const delta = endX - startX;
      if (Math.abs(delta) > 45) goTo(active + (delta < 0 ? 1 : -1));
      startX = null;
    }, {passive:true});
    goTo(0);
  });
})();
