(async function(){
  'use strict';
  const $ = (id)=>document.getElementById(id);
  const query = new URLSearchParams(window.location.search);
  const id = (query.get('ref') || '').trim();
  const proposals = window.WSHUB_PROPOSTAS || {};

  // A lista pública não expõe valores nos cards. As propostas completas abrem por ?ref=.
  // Fonte preferencial: /api/publico/propostas (o Worker precisa oferecer essa rota).
  // Na sessão de administração, usa também /api/admin/dados sem divulgar o token.
  if(!id){
    document.title='Propostas | WS Hub';
    const style=document.createElement('style');
    style.textContent=`
      body.page-proposta{background:#06162b;color:#f5f8ff}
      .ws-catalog{position:relative;isolation:isolate;min-height:65vh;background:radial-gradient(ellipse at 83% 11%,rgba(34,95,153,.35),transparent 50%),radial-gradient(ellipse at 7% 94%,rgba(244,190,74,.12),transparent 39%),#06162b;overflow:hidden}
      .ws-catalog::before{content:'';position:absolute;inset:0;background-image:radial-gradient(circle at 15% 25%,#f7d17a 1px,transparent 2px),radial-gradient(circle at 85% 75%,#d6eaff 1px,transparent 2px);background-size:280px 320px,440px 370px;opacity:.26;pointer-events:none;z-index:-1}
      .ws-catalog .ws-c-wrap{width:min(1200px,calc(100% - 48px));margin:auto;padding:70px 0 90px}
      .ws-catalog .ws-c-kicker{color:#f3bd4b;font-size:12px;font-weight:850;letter-spacing:.11em;text-transform:uppercase}
      .ws-catalog h1{font-size:clamp(36px,5vw,58px);line-height:1.06;letter-spacing:-.05em;margin:15px 0 12px;color:#fff}
      .ws-catalog .ws-c-lead{max-width:680px;color:#c4d7eb;font-size:17px;margin:0 0 34px;line-height:1.6}
      .ws-c-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr));gap:16px;align-items:stretch}
      .ws-c-card{display:flex;flex-direction:column;min-height:250px;padding:25px;gap:10px;border-radius:8px;border:1px solid rgba(132,168,202,.38);border-top:3px solid #f3bd4b;background:linear-gradient(150deg,#102d50,#0a203b);box-shadow:0 12px 40px rgba(0,0,0,.15);transition:transform .2s,border-color .2s}
      .ws-c-card:hover,.ws-c-card:focus-within{transform:translateY(-3px);border-color:#f3bd4b}
      .ws-c-card .ws-c-type{font-size:11px;letter-spacing:.06em;text-transform:uppercase;font-weight:850;color:#f3bd4b}
      .ws-c-card h2{font-size:clamp(21px,2vw,26px);line-height:1.2;letter-spacing:-.03em;margin:5px 0;color:#fff}
      .ws-c-card p{font-size:14px;line-height:1.5;margin:0;color:#bcd1e8}
      .ws-c-card .ws-c-meta{margin-top:auto;padding-top:14px;color:#dfe9f5;font-size:13px}
      .ws-c-card .ws-c-link{display:inline-flex;align-items:center;justify-content:center;min-height:44px;align-self:flex-start;margin-top:10px;border-radius:8px;background:#f3bd4b;color:#071831;text-decoration:none;font-weight:850;padding:10px 17px;font-size:14px}
      .ws-c-status{margin:12px 0 22px;color:#d6e3f1;min-height:22px}
      .ws-c-nav{display:flex;gap:14px;align-items:center;flex-wrap:wrap;margin-top:35px}
      .ws-c-nav a,.ws-c-nav button{border:1px solid rgba(211,227,242,.48);border-radius:8px;background:#113456;color:#fff;font-weight:800;padding:12px 17px;text-decoration:none;cursor:pointer;font-size:14px}
      .ws-c-nav button{background:#f3bd4b;border-color:#f3bd4b;color:#071831}
      .ws-c-form{margin-top:29px;max-width:700px;padding:24px;border:1px solid rgba(215,234,250,.3);border-radius:8px;background:#0e2a48}
      .ws-c-form[hidden]{display:none!important}
      .ws-c-form h2{margin:0 0 12px;color:#fff}
      .ws-c-form form{display:grid;gap:12px}
      .ws-c-form label{display:grid;gap:5px;color:#e8f0fb;font-size:13px;font-weight:750}
      .ws-c-form input,.ws-c-form select,.ws-c-form textarea{width:100%;box-sizing:border-box;min-height:44px;border:1px solid #7893ad;border-radius:8px;background:#f9fbff;color:#162b43;padding:10px 12px;font:inherit}
      .ws-c-form textarea{min-height:110px}
      .ws-c-form button{justify-self:start;border:0;border-radius:8px;background:#f3bd4b;color:#06162b;padding:12px 20px;font-weight:850;cursor:pointer}
      @media(max-width:640px){.ws-catalog .ws-c-wrap{width:calc(100% - 28px);padding:44px 0 55px}.ws-c-card{min-height:205px;padding:22px}}
      @media(prefers-reduced-motion:reduce){.ws-c-card{transition:none}}
    `;
    document.head.append(style);
    const main=document.createElement('main');main.className='ws-catalog';main.id='conteudo-catalogo';
    main.innerHTML=`<div class="ws-c-wrap"><span class="ws-c-kicker">WS Hub · Formações personalizadas</span><h1>Propostas de formação</h1><p class="ws-c-lead">Selecione uma proposta para consultar seu programa e suas condições. Os registros acompanham os cadastros do painel.</p><p id="ws-c-status" class="ws-c-status" role="status" aria-live="polite">Consultando propostas…</p><div class="ws-c-grid" id="ws-c-grid"></div><div class="ws-c-nav"><a href="/wshub/">Voltar ao WS Hub</a><button id="ws-c-request" type="button" aria-expanded="false" aria-controls="ws-c-form">Solicitar proposta</button></div><section id="ws-c-form" class="ws-c-form" hidden><h2>Solicitar proposta personalizada</h2><form action="https://formspree.io/f/xkjjdrae" method="POST"><input type="hidden" name="_subject" value="WS Hub | Solicitação de proposta personalizada"><input type="hidden" name="origem" value="WS Hub - Catálogo de propostas"><label>Nome <input name="nome" required autocomplete="name" maxlength="100"></label><label>E-mail <input name="email" required type="email" autocomplete="email" maxlength="200"></label><label>Instituição <input name="organizacao" maxlength="120"></label><label>O que você precisa? <textarea name="mensagem" required maxlength="1400"></textarea></label><button type="submit">Enviar solicitação</button></form></section></div>`;
    const bodyMain=$('conteudo');bodyMain.hidden=true;bodyMain.before(main);
    document.querySelector('.not-found')?.setAttribute('hidden','');
    document.getElementById('ws-c-request').addEventListener('click',()=>{const form=document.getElementById('ws-c-form');form.hidden=!form.hidden;document.getElementById('ws-c-request').setAttribute('aria-expanded',String(!form.hidden));if(!form.hidden)form.scrollIntoView({behavior:'smooth',block:'start'});});
    const API='https://ws-hub-api.dell-soares.workers.dev';
    const known=[...Object.entries(proposals).map(([key,p])=>({id:key,...p})),{id:'voz-ativa',titulo:'Jornal Voz Ativa',subtitulo:'SEO para jornalismo — otimização, inteligência artificial e alcance digital',cliente:'Jornal Voz Ativa',encontros:2,cargaHoraria:8}];
    const normalize=(payload)=>{
      if(Array.isArray(payload))return payload;
      if(Array.isArray(payload?.propostas))return payload.propostas.map(p=>({...p,cliente:p.cliente||payload?.clientes?.find?.(c=>c.id===p.clientId)?.nome||''}));
      if(Array.isArray(payload?.state?.propostas))return payload.state.propostas.map(p=>({...p,cliente:p.cliente||payload.state.clientes?.find(c=>c.id===p.clientId)?.nome||''}));
      if(Array.isArray(payload?.data?.propostas))return payload.data.propostas;
      return null;
    };
    const renderCards=(entries)=>{
      const grid=document.getElementById('ws-c-grid');grid.replaceChildren();
      const seen=new Set();
      for(const p of entries||[]){
        const ref=String(p?.id||p?.ref||'').trim();
        if(!/^[a-z0-9][a-z0-9_-]{0,79}$/.test(ref)||seen.has(ref))continue;
        seen.add(ref);
        const card=document.createElement('article');card.className='ws-c-card';
        const type=document.createElement('span');type.className='ws-c-type';type.textContent='Proposta personalizada';
        const h=document.createElement('h2');h.textContent=String(p.organizacao||p.cliente||p.titulo||'Formação personalizada');
        const desc=document.createElement('p');desc.textContent=String(p.subtitulo||p.titulo||p.chamada||'Conheça a formação');
        const meta=document.createElement('p');meta.className='ws-c-meta';meta.textContent=(p.encontros&&p.cargaHoraria)?`${p.encontros} encontros · ${p.cargaHoraria} horas`:'Formação personalizada';
        const link=document.createElement('a');link.className='ws-c-link';link.href='?ref='+encodeURIComponent(ref);link.textContent='Visualizar proposta';link.setAttribute('aria-label','Visualizar proposta: '+h.textContent);
        card.append(type,h,desc,meta,link);grid.append(card);
      }
      return seen.size;
    };
    const display=async()=>{
      let list=null;let automatic=false;
      try{
        const r=await fetch(API+'/api/publico/propostas',{cache:'no-store'});
        if(r.ok){list=normalize(await r.json());automatic=Array.isArray(list)}
      }catch(_){/* API de listagem ainda não disponível */}
      if(!automatic){
        const token=(()=>{try{return sessionStorage.getItem('wshub-admin-token-session-v1')}catch{return null}})();
        if(token)try{
          const r=await fetch(API+'/api/admin/dados',{cache:'no-store',headers:{Authorization:'Bearer '+token}});
          if(r.ok){list=normalize(await r.json());automatic=Array.isArray(list)}
        }catch(_){/* sessão expirada ou acesso off-line */}
      }
      const count=renderCards(automatic?list:known);
      const info=document.getElementById('ws-c-status');
      info.textContent=automatic?`${count} ${count===1?'proposta cadastrada':'propostas cadastradas'} · Atualizadas pelo painel`:`${count} ${count===1?'proposta disponível':'propostas disponíveis'} · Para listar novos cadastros automaticamente, é necessário habilitar a listagem no Cloudflare.`;
    };
    await display();
    return;
  }

  let proposal = Object.prototype.hasOwnProperty.call(proposals,id) ? proposals[id] : null;
  // Registro complementar de proposta comercial: Jornal Voz Ativa.
  if(id==='voz-ativa' && !proposal) proposal = {
  "numero": "",
  "titulo": "Jornal Voz Ativa",
  "subtitulo": "SEO para jornalismo — otimização, inteligência artificial e alcance digital",
  "chamada": "Capacitação objetiva e prática para a equipe editorial, com fundamentos de SEO, publicação otimizada e formatos interativos criados com IA.",
  "cliente": "Jornal Voz Ativa",
  "organizacao": "Jornal Voz Ativa",
  "logo": "assets/logo-voz-ativa.png",
  "objetivo": "Capacitar a equipe do Jornal Voz Ativa para aplicar técnicas de SEO à produção jornalística, melhorando a estrutura, a encontrabilidade e o potencial de alcance dos conteúdos publicados no portal.",
  "encontros": 2,
  "cargaHoraria": 8,
  "modulos": [
    {
      "titulo": "Fundamentos de SEO aplicados ao jornalismo",
      "horas": "4 horas",
      "descricao": "SERPs, intenção de busca, palavras-chave, estrutura de notícias, links e oficina prática.",
      "icone": "file"
    },
    {
      "titulo": "SEO técnico, inteligência artificial e agilidade na redação",
      "horas": "4 horas",
      "descricao": "ALT, WebP, accordion, quiz, GitHub Pages, hard news e padronização editorial.",
      "icone": "layers"
    }
  ],
  "percurso": [
    {
      "titulo": "Fundamentos de SEO aplicados ao jornalismo",
      "foco": "Estruturar notícias úteis e encontráveis sem alterar o sentido dos fatos.",
      "topicos": [
        "SEO jornalístico e SERPs (40 min)",
        "Palavras-chave e intenção de busca (45 min)",
        "Aplicação de SEO na notícia (65 min)",
        "Links internos e externos (40 min)",
        "Oficina prática (50 min)"
      ],
      "resultado": "Uma notícia analisada e otimizada com foco em busca e precisão editorial."
    },
    {
      "titulo": "SEO técnico, inteligência artificial e agilidade na redação",
      "foco": "Criar recursos visuais e interativos e consolidar um procedimento rápido de publicação.",
      "topicos": [
        "SEO para imagens (45 min)",
        "Accordions com IA (35 min)",
        "Quizzes com IA (40 min)",
        "Publicação no GitHub (40 min)",
        "SEO para hard news (45 min)",
        "Oficina final e padronização (35 min)"
      ],
      "resultado": "Checklist de redação, modelos de interativos e protocolo para hard news."
    }
  ],
  "metodologia": [
    "Fundamentos e boas práticas de SEO aplicados a pautas e notícias.",
    "Demonstrações de ferramentas e recursos de IA com validação humana.",
    "Oficinas baseadas em matérias e documentos públicos históricos do Jornal Voz Ativa.",
    "Modelos de accordion e quiz, com orientações para publicação em GitHub Pages."
  ],
  "beneficios": [
    "Melhoria de títulos, subtítulos, URLs e imagens.",
    "Pesquisa de intenção de busca e palavras-chave com critério editorial.",
    "Mais agilidade para publicar sem comprometer a precisão jornalística.",
    "Padronização por checklist e possibilidade de acompanhar resultados."
  ],
  "investimento": "R$ 1.000,00",
  "investimentoAnterior": "R$ 2.400,00",
  "observacaoInvestimento": "Condição promocional em razão do espaço já cedido em divulgação. Pagamento conforme proposta do Jornal, sem contraproposta.",
  "condicoes": [
    "2 encontros de 4 horas (8 horas totais), para até 5 participantes.",
    "Apostila e caderno de laboratório digitais, cedidos integralmente após o treinamento.",
    "Consultoria adicional de 3 horas, divididas em até 3 reuniões online, conforme decisão do Jornal.",
    "Condição promocional ligada ao espaço já cedido em divulgação."
  ],
  "validade": "A combinar",
  "contatoWhatsApp": "5531983073854",
  "experienciaUrl": "",
  "status": "rascunho"
};
  // As novas propostas são servidas pela API sem republicar arquivos no GitHub.
  // A proposta original da Silvia permanece como fallback caso a rede esteja indisponível.
  try {
    const response = await fetch('https://ws-hub-api.dell-soares.workers.dev/api/publico/propostas/'+encodeURIComponent(id), {cache:'no-store'});
    if(response.ok) {
      const data = await response.json();
      const p=data.proposta||{},c=data.cliente||{},f=data.formacao||{};
      proposal={...p,
        cliente:c.nome||p.cliente||'',organizacao:c.organizacao||c.nome||p.organizacao||'',
        logo:c.logo||p.logo||'',objetivo:f.objetivo||p.objetivo||'',
        modulos:Array.isArray(f.modulos)?f.modulos:(p.modulos||[]),
        percurso:Array.isArray(f.modulos)?f.modulos:(p.percurso||p.modulos||[]),
        contatoWhatsApp:p.contatoWhatsApp||'5531983073854',
        encontros:p.encontros||f.encontros||0,cargaHoraria:p.cargaHoraria||f.cargaHoraria||0,
        numero:''
      };
    }
  }catch(error){console.warn('WS Hub: proposta remota indisponível',error)}
  if(!proposal){ $('not-found').hidden=false; document.title='Proposta não encontrada | WS Hub'; return; }
  const put=(id,value)=>{const el=$(id); if(el) el.textContent=String(value??'');};
  const itemIcon=(symbol,className='icon')=>{
    const el=document.createElementNS('http://www.w3.org/2000/svg','svg');
    el.setAttribute('class',className);el.setAttribute('aria-hidden','true');
    const use=document.createElementNS('http://www.w3.org/2000/svg','use');
    use.setAttribute('href','#i-'+symbol);el.appendChild(use);return el;
  };
  const list=(target,items,checked=false)=>{
    const parent=$(target);
    parent.replaceChildren();
    for(const line of items||[]){
      const li=document.createElement('li');
      if(checked){const circle=document.createElement('span');circle.className='check-mark';circle.appendChild(itemIcon('check'));li.appendChild(circle);}
      const span=document.createElement('span');span.textContent=String(line);li.appendChild(span);parent.appendChild(li);
    }
  };
  put('proposal-title',proposal.titulo);
  put('hero-subtitle',proposal.subtitulo);
  put('hero-lead',proposal.chamada);
  put('proposal-objective',proposal.objetivo);
  put('client-name',proposal.cliente);
  put('client-organization',proposal.organizacao);
  put('hours-chip',`${proposal.encontros} encontros · ${proposal.cargaHoraria} horas`);
  put('header-id',proposal.numero ? `Proposta ${proposal.numero}` : '');
  if(proposal.investimentoAnterior){put('investment-original',proposal.investimentoAnterior);$('investment-original').hidden=false;}
  if(proposal.validade === 'A combinar') $('validity-section').hidden=true;
  put('investment-value',proposal.investimento || 'A combinar');
  put('investment-note',proposal.observacaoInvestimento || '');
  put('validity-value',proposal.validade || 'Definida no envio');
  if(proposal.logo){$('client-logo').src=proposal.logo; $('client-logo').alt=`Identidade visual de ${proposal.organizacao}`;}else{$('client-logo').style.display='none';}
  document.title=`Proposta para ${proposal.cliente} | ${proposal.titulo} | WS Hub`;
  const modules=$('module-grid');
  for(let i=0;i<(proposal.modulos||[]).length;i++){
    const info=proposal.modulos[i], box=document.createElement('article');box.className='module-card';
    const head=document.createElement('div');head.className='module-head';
    const num=document.createElement('span');num.className='module-num';num.textContent=String(i+1);head.appendChild(num);
    const allowed=['spark','file','layers','mega'];
    head.appendChild(itemIcon(allowed.includes(info.icone)?info.icone:'file'));
    const title=document.createElement('h3');title.textContent=info.titulo;
    const hours=document.createElement('span');hours.className='module-time';hours.textContent=info.horas;
    const desc=document.createElement('p');desc.textContent=info.descricao;
    box.append(head,title,hours,desc);modules.appendChild(box);
  }
  list('methodology-list',proposal.metodologia,true);
  list('benefits-list',proposal.beneficios,true);
  list('conditions-list',proposal.condicoes);
  $('conteudo').hidden=false;
  const details=$('program-details');
  for(let i=0;i<(proposal.percurso||proposal.modulos||[]).length;i++){
    const info=(proposal.percurso||proposal.modulos)[i];
    const card=document.createElement('article');card.className='program-detail';
    const head=document.createElement('div');head.className='program-detail-head';
    const number=document.createElement('span');number.className='program-detail-num';number.textContent=String(i+1).padStart(2,'0');
    const titleGroup=document.createElement('div');const title=document.createElement('h3');title.textContent=info.titulo;
    const time=document.createElement('span');time.className='program-detail-time';time.textContent='Encontro '+(i+1)+' · '+(proposal.modulos?.[i]?.horas || '');
    titleGroup.append(title,time);head.append(number,titleGroup);card.append(head);
    if(info.foco){const focus=document.createElement('p');focus.className='program-detail-focus';focus.textContent=info.foco;card.append(focus)}
    if(info.topicos?.length){const list=document.createElement('ul');for(const topic of info.topicos){const li=document.createElement('li');li.textContent=topic;list.append(li)}card.append(list)}
    else if(info.descricao){const desc=document.createElement('p');desc.textContent=info.descricao;card.append(desc)}
    if(info.resultado){const result=document.createElement('p');result.className='program-detail-result';const label=document.createElement('strong');label.textContent='Ao final: ';result.append(label,document.createTextNode(info.resultado));card.append(result)}
    details.append(card);
  }
  const dialog=$('program-dialog'), openButton=$('experience-link');
  openButton.addEventListener('click',()=>{if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');});
  function closeProgram(){if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');openButton.focus()}
  $('program-close').addEventListener('click',closeProgram);
  $('program-done').addEventListener('click',closeProgram);
  dialog.addEventListener('click',e=>{if(e.target===dialog)closeProgram()});

  let toastTimeout;
  function notify(message){
    const box=$('feedback');box.textContent=message;box.hidden=false;
    clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>{box.hidden=true;},5300);
  }
  function contact(approve){
    if(approve && !proposal.investimento){
      notify('Esta é a prévia visual. Informe o valor real da proposta antes de encaminhar para aprovação.');
      return;
    }
    const number=String(proposal.contatoWhatsApp||'').replace(/\D/g,'');
    const prefix=approve?'Olá! Confirmo que aprovo a proposta':'Olá! Gostaria de solicitar ajustes na proposta';
    const beneficio=window.WS_HUB_BENEFICIOS?.mensagem?.()||'';
    const message=`${prefix} ${proposal.numero||''} — ${proposal.titulo}, destinada a ${proposal.cliente}. Link: ${location.href}${beneficio?' | '+beneficio:''}`;
    if(number){
      const url=`https://wa.me/${number}?text=${encodeURIComponent(message)}`;
      const opened=window.open(url,'_blank','noopener,noreferrer');
      if(!opened) window.location.assign(url);
    }else{
      navigator.clipboard?.writeText(message).then(()=>notify('Mensagem copiada para enviar ao responsável.')).catch(()=>notify('Configure o número de contato no cadastro da proposta.'));
    }
  }
  $('approve-action').addEventListener('click',()=>contact(true));
  $('request-action').addEventListener('click',()=>contact(false));
  $('pdf-action').addEventListener('click',()=>window.print());

  // Apenas o chatbot flutuante global do site; não duplicar botão/assistente.
  // Convite de saída: uma única vez por navegador, desktop, após 45 segundos
  // e só quando o ponteiro sair pelo topo da janela.
  const exitOffer=$('major-last-chance');
  const offerKey=`wshub:major-h:exit-offer:${id}:v2`;
  const eligibleAt=performance.now()+45000;
  let meaningfulAction=false;
  let exitShown=false;
  try{exitShown=localStorage.getItem(offerKey)==='shown';}catch(_){/* armazenamento indisponível */}

  function closeOffer(){
    if(exitOffer.open){exitOffer.close();}
  }
  function markAction(){meaningfulAction=true;closeOffer();}
  // Se o visitante usou qualquer ação da proposta ou abriu o chat flutuante,
  // não exibir um segundo convite concorrente.
  document.addEventListener('click',event=>{
    const el=event.target instanceof Element ? event.target.closest('button,a,[role="button"]') : null;
    if(el && !exitOffer.contains(el))markAction();
  },true);
  function showOffer(){
    if(exitShown||meaningfulAction||exitOffer.open)return;
    exitShown=true;
    try{localStorage.setItem(offerKey,'shown');}catch(_){/* armazenamento indisponível */}
    if(typeof exitOffer.showModal==='function'){exitOffer.showModal();}
    else{exitOffer.setAttribute('open','');}
  }
  document.addEventListener('mouseout',event=>{
    if(exitShown||meaningfulAction||performance.now()<eligibleAt)return;
    if(window.matchMedia('(pointer:coarse)').matches || window.innerWidth<768)return;
    if(event.relatedTarget!==null || event.clientY>2)return;
    if(document.querySelector('dialog[open]'))return;
    showOffer();
  });
  $('major-view-program').addEventListener('click',()=>{
    markAction();
    openButton.click();
  });
  $('major-dismiss').addEventListener('click',closeOffer);
  exitOffer.addEventListener('click',event=>{if(event.target===exitOffer)closeOffer();});
  // Esc fecha o diálogo pelo comportamento nativo, sem o mostrar novamente.
})();
