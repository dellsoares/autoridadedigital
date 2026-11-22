(async function(){
  'use strict';
  const $ = (id)=>document.getElementById(id);
  const query = new URLSearchParams(window.location.search);
  const id = (query.get('ref') || 'silvia-naboa').trim();
  const proposals = window.WSHUB_PROPOSTAS || {};
  let proposal = Object.prototype.hasOwnProperty.call(proposals,id) ? proposals[id] : null;
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
    const message=`${prefix} ${proposal.numero||''} — ${proposal.titulo}, destinada a ${proposal.cliente}. Link: ${location.href}`;
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
