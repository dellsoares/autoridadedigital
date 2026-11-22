/* WS Hub — Missão Futuro v2. Etapas de aprendizagem, ilustrações e Major H.
   Conclusão do módulo e certificado são verificados no Cloudflare pelo jovens-bridge.js.
   A posição dentro de um módulo é uma preferência local deste aluno/navegador. */
(()=>{'use strict';
if(window.__WS_JOVENS_ETAPAS_V2__)return;window.__WS_JOVENS_ETAPAS_V2__=true;
const slug=new URLSearchParams(location.search).get('ref')||'jovens';
const q=(s,ctx=document)=>ctx.querySelector(s);
const ARTE=i=>'/wshub/assets/jovens-arte-'+String(i+1).padStart(2,'0')+'.webp';
const captions=['Identidade digital e reputação','Talentos e habilidades','Currículo para a primeira oportunidade','Rede de conexões profissionais','Segurança e privacidade online','Pesquisa de vagas e oportunidades','Planejamento e metas profissionais'];
const tips=[
 'Sua presença na internet conta uma história. Que impressão seu perfil transmite para quem ainda não conhece você?',
 'Projetos da escola, voluntariado e colaboração também revelam habilidades. Pense em um exemplo verdadeiro.',
 'Um bom currículo conta fatos concretos. Evite inventar experiências; destaque o que você já sabe fazer.',
 'Conexões profissionais começam com respeito. Confira a idade mínima de cada plataforma antes de criar uma conta.',
 'Proteja seus dados. Nunca divulgue documentos, senhas ou endereço completo em um perfil público.',
 'Antes de se candidatar, confira se a oportunidade é real e não exige pagamento para participar.',
 'Uma carreira começa com passos pequenos. Escolha uma ação que você realmente conseguirá fazer nesta semana.'
];
let userKey='',progress={current:{},unlocked:{},seconds:{},ack:{}},active=null,phase=0,interval=null,observedHeader=null,observedHome=null;
function hash(v){let n=2166136261;for(const c of v){n^=c.charCodeAt(0);n=Math.imul(n,16777619)}return (n>>>0).toString(36)}
const storageKey=()=>`wshub:jovens:v2:${slug}:${userKey||'anon'}`;
function read(){try{const x=JSON.parse(localStorage.getItem(storageKey())||'{}');return {current:x.current||{},unlocked:x.unlocked||{},seconds:x.seconds||{},ack:x.ack||{}}}catch(_){return {current:{},unlocked:{},seconds:{},ack:{}}}}
function save(){if(!userKey)return;try{localStorage.setItem(storageKey(),JSON.stringify(progress))}catch(_){}}
function notifySave(){const e=q('#ws-learning-save');if(e){e.textContent='✓ Progresso deste módulo salvo no WS Hub';e.hidden=false;clearTimeout(notifySave.t);notifySave.t=setTimeout(()=>e.hidden=true,5500)}}
function identify(value){const next=hash(String(value||'').trim().toLowerCase());if(!value||next===userKey)return;userKey=next;progress=read();requestAnimationFrame(mount)}
window.addEventListener('wshub:jovens:sync',event=>{identify(event.detail?.userKey||'');});
window.addEventListener('wshub:jovens:salvo',notifySave);
function hintShell(){if(q('#ws-major-coach'))return;
 const el=document.createElement('aside');el.id='ws-major-coach';el.className='ws-major-coach';el.setAttribute('aria-label','Orientações do Major H');
 el.innerHTML='<div class="ws-major-panel" id="ws-major-panel" hidden><div class="ws-major-head"><img src="/assets/major-h/major-h-avatar.webp" alt="Major H"><strong>Major H <small>Seu guia de aprendizagem</small></strong><button id="ws-major-close" type="button" aria-label="Fechar dica">×</button></div><p id="ws-major-copy">Avance com calma, uma etapa por vez.</p></div><button type="button" class="ws-major-launch" id="ws-major-launch" aria-label="Abrir dicas do Major H" aria-expanded="false"><img src="/assets/major-h/major-h-avatar.webp" alt="Major H"></button>';
 document.body.append(el);const panel=q('#ws-major-panel');const launch=q('#ws-major-launch');const toggle=show=>{panel.hidden=!show;launch.setAttribute('aria-expanded',String(show))};launch.addEventListener('click',()=>toggle(panel.hidden));q('#ws-major-close').addEventListener('click',()=>toggle(false));
}
function updateHint(index){hintShell();const copy=q('#ws-major-copy');const label=captions[index]||'Seu aprendizado';copy.textContent=(tips[index]||'')+' Nesta etapa, pergunte a si mesmo: consigo explicar esse conteúdo com minhas próprias palavras?';q('#ws-major-launch').title='Dica do Major H: '+label}
function illustrateHome(){const cards=[...document.querySelectorAll('.module-card')];cards.forEach((card,i)=>{if(i>6||q('.ws-arte-thumb',card))return;const im=document.createElement('img');im.className='ws-arte-thumb';im.src=ARTE(i);im.loading='lazy';im.alt=captions[i];const head=q('.module-head',card);if(head)head.insertAdjacentElement('afterend',im)});
}
function minTime(node,done){return done||node.id==='quizCard'?0:node.classList.contains('lab')?35:28}
function key(){return active?active.index+':'+phase:''}
function clearTick(){if(interval){clearInterval(interval);interval=null}}
function update(){if(!active)return;const {nodes,index,done}=active;const total=nodes.length;const current=nodes[phase];if(!current)return;
 nodes.forEach((node,i)=>{node.hidden=i!==phase});
 const status=q('#ws-step-status'),next=q('#ws-step-next'),prev=q('#ws-step-prev'),ack=q('#ws-step-ack'),time=q('#ws-step-time');
 const isQuiz=current.id==='quizCard',need=minTime(current,done),seconds=progress.seconds[key()]||0,confirmed=!!progress.ack[key()];
 const names=nodes.map((node,i)=>node.id==='quizCard'?'Desafio final':node.classList.contains('lab')?'Laboratório prático':'Etapa '+(i+1));
 if(status)status.textContent=`${names[phase]} · ${phase+1} de ${total}`;
 if(prev)prev.disabled=phase===0;
 if(ack){ack.parentElement.hidden=isQuiz||done;ack.checked=confirmed}
 if(time)time.textContent=isQuiz?'Resolva as questões para concluir.':done?'Você já concluiu esta missão. Revise livremente.':seconds<need?'Leitura e reflexão · '+Math.max(0,need-seconds)+'s restantes':'Etapa lida. Marque a confirmação para avançar.';
 if(next){next.hidden=isQuiz;next.disabled=!done&&(seconds<need||!confirmed);next.textContent=phase===total-2?'Ir ao desafio →':'Próxima etapa →'}
 const dots=q('#ws-step-dots');if(dots)dots.innerHTML=nodes.map((_,i)=>`<span class="${i===phase?'active':i<=(progress.unlocked[index]||0)?'visited':''}" aria-hidden="true"></span>`).join('');
 const footer=q('#ws-module-next');if(footer)footer.hidden=!done;
 updateHint(index);
}
function navigate(n){if(!active)return;const max=active.nodes.length-1;const index=active.index;
 if(n>phase && !active.done){const node=active.nodes[phase],need=minTime(node,false);if((progress.seconds[key()]||0)<need||!progress.ack[key()])return;progress.unlocked[index]=Math.max(progress.unlocked[index]||0,n)}
 phase=Math.min(max,Math.max(0,n));progress.current[index]=phase;save();update();
 const start=q('.mod-header');if(start)window.scrollTo({top:Math.max(0,start.getBoundingClientRect().top+window.scrollY-85),behavior:'smooth'});
}
function createControls(){const bar=document.createElement('section');bar.className='ws-step-controls';bar.id='ws-step-controls';bar.innerHTML='<div class="ws-step-top"><strong id="ws-step-status">Etapa</strong><div class="ws-step-dots" id="ws-step-dots" aria-hidden="true"></div></div><div class="ws-step-actions"><button class="ws-step-button" id="ws-step-prev" type="button">← Voltar</button><div class="ws-step-requirement"><label id="ws-step-label"><input type="checkbox" id="ws-step-ack"> Li e compreendi esta etapa.</label><small id="ws-step-time" aria-live="polite"></small></div><button class="ws-step-button gold" id="ws-step-next" type="button">Próxima etapa →</button></div><p id="ws-learning-save" class="ws-learning-save" hidden aria-live="polite"></p>';
 q('#ws-step-prev',bar).addEventListener('click',()=>navigate(phase-1));q('#ws-step-next',bar).addEventListener('click',()=>navigate(phase+1));q('#ws-step-ack',bar).addEventListener('change',e=>{progress.ack[key()]=!!e.target.checked;save();update()});return bar
}
function mount(){const head=q('.mod-header');if(!head){clearTick();active=null;observedHeader=null;const home=q('.hero');if(home&&home!==observedHome){observedHome=home;illustrateHome()}return}if(head===observedHeader)return;observedHeader=head;observedHome=null;clearTick();
 let match=location.hash.match(/^#modulo-(\d+)$/);if(!match)return;const index=Number(match[1])-1;if(index<0||index>6)return;
 const columns=q('.two-column');if(!columns)return;const nodes=[...columns.querySelectorAll('.lesson'),...columns.querySelectorAll('.lab'),q('#quizCard')].filter(Boolean);
 if(nodes.length<2)return;const done=(()=>{const nav=[...document.querySelectorAll('.nav-link')];return nav.some(n=>n.getAttribute('href')==='#modulo-'+(index+1)&&n.classList.contains('done'))})();
 active={index,nodes,done};
 let poster=document.createElement('figure');poster.className='ws-module-poster';poster.innerHTML=`<img src="${ARTE(index)}" alt="${captions[index]}" loading="lazy"><figcaption><strong>MISSÃO ${index+1} DE 7</strong> · Leia, reflita e avance uma etapa de cada vez.</figcaption>`;head.insertAdjacentElement('afterend',poster);
 const quiz=q('#quizCard');const footer=quiz?.nextElementSibling;if(footer?.classList.contains('button-row'))footer.id='ws-module-next';
 const bar=createControls();if(quiz)quiz.insertAdjacentElement('afterend',bar);
 phase=done?Math.min(nodes.length-1,Number(progress.current[index]??0)):Math.min(nodes.length-1,Math.max(0,Number(progress.current[index]??0)));
 // An earlier browser may have saved a stage; never unlock a later stage unless previously visited.
 if(!done)phase=Math.min(phase,Math.max(0,Number(progress.unlocked[index]??0)));
 update();interval=setInterval(()=>{if(!active||document.hidden||active.done||active.nodes[phase]?.id==='quizCard')return;const k=key();progress.seconds[k]=Math.min(999,Number(progress.seconds[k]||0)+1);if(progress.seconds[k]%5===0)save();update()},1000);
}
window.addEventListener('wshub:jovens:modulo-concluido',e=>{if(active?.index===e.detail?.index){active.done=true;progress.unlocked[active.index]=Math.max(active.nodes.length-1,progress.unlocked[active.index]||0);save();update()}});
const root=q('#conteudo');if(root)new MutationObserver(mount).observe(root,{childList:true});
window.addEventListener('hashchange',()=>setTimeout(mount,0));
document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});window.addEventListener('pagehide',save);
hintShell();mount();
})();
