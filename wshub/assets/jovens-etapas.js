/* WS Hub · Missão Futuro — experiência app v4, mobile-first.
   Conteúdo e quiz vêm do index existente. Progresso/certificado continuam
   exclusivos da ponte autenticada jovens-bridge.js. Nenhum cronômetro. */
(()=>{'use strict';
if(window.__WS_JOVENS_APP_V4__)return;window.__WS_JOVENS_APP_V4__=true;
const root=document.getElementById('conteudo');if(!root)return;
const slug=new URLSearchParams(location.search).get('ref')||'jovens';
const q=(s,c=document)=>c.querySelector(s);
const Q=(s,c=document)=>[...c.querySelectorAll(s)];
const ART=i=>'/wshub/assets/jovens-arte-'+String(i+1).padStart(2,'0')+'.webp';
const ESC=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const captions=['Identidade digital','Talentos e competências','Currículo de primeira','Conexões profissionais','Reputação e segurança','Oportunidades reais','Plano para começar'];
const tips=[
 'Seu perfil não precisa ser perfeito. Ele precisa ser coerente com quem você é e com o que deseja mostrar.',
 'Uma habilidade fica mais convincente quando você conta onde a utilizou, mesmo que tenha sido na escola.',
 'Nunca invente experiência. Projetos escolares e voluntariado também contam uma história de aprendizado.',
 'Uma conexão de qualidade começa com um motivo e uma abordagem respeitosa.',
 'Você decide o que publica. Revise privacidade e pense em segurança antes de compartilhar dados.',
 'Desconfie de qualquer vaga que cobre para você participar do processo seletivo.',
 'Metas pequenas e praticáveis são melhores que grandes promessas sem ação.'
];
/* Microdecisões novas baseadas nos exemplos e orientações já presentes nos módulos. */
const CHALLENGES=[
 [
  {q:'Seu perfil público tem uma foto divertida de um encontro com amigos. O que fazer?',options:['Excluir todas as contas.','Verificar o contexto e decidir o que manter público.','Publicar ainda mais para mostrar personalidade.'],correct:1,why:'Você pode proteger a privacidade sem apagar sua história. O importante é decidir conscientemente.'},
  {q:'Você quer mostrar interesse por design. Qual postagem comunica melhor isso?',options:['Um projeto criado para a feira da escola, explicando seu papel.','A frase “contratem-me” repetida todo dia.','Repostar projetos de outras pessoas como se fossem seus.'],correct:0,why:'Projetos reais e autoria clara mostram iniciativa, mesmo antes do primeiro emprego.'}
 ],
 [
  {q:'Você diz que é uma pessoa organizada. Qual exemplo torna isso mais concreto?',options:['“Todo mundo diz que sou organizado.”','“Tenho muitas qualidades.”','“Montei a agenda e distribuí tarefas de um trabalho em grupo.”'],correct:2,why:'Uma evidência prática comunica melhor a habilidade do que um adjetivo solto.'},
  {q:'Você aprendeu a editar vídeos para um projeto escolar. Como classificar essa habilidade?',options:['Como competência técnica, com exemplo do projeto.','Como experiência em uma empresa que nunca existiu.','Como algo que não tem valor por ter sido feito na escola.'],correct:0,why:'Uma habilidade técnica aprendida fora do emprego continua sendo válida, desde que descrita com sinceridade.'}
 ],
 [
  {q:'Você está buscando o primeiro emprego e nunca teve carteira assinada. O que entra no currículo?',options:['Deixar tudo em branco e enviar.','Escolaridade, habilidades e projetos reais.','Inventar um estágio para parecer mais experiente.'],correct:1,why:'Projetos e aprendizados reais tornam o currículo mais útil. Nunca invente experiências.'},
  {q:'Uma vaga pede currículo em PDF e assunto com o nome da vaga. O melhor envio é:',options:['Um print borrado do documento.','Uma mensagem sem assunto e sem anexo.','Um PDF legível e a mensagem com o assunto solicitado.'],correct:2,why:'Seguir as instruções da vaga demonstra atenção e facilita o trabalho de seleção.'}
 ],
 [
  {q:'Você ainda é estudante e não sabe qual título usar no LinkedIn. Qual funciona?',options:['“CEO de tudo” sem nenhuma experiência.','“Estudante | Interesse em tecnologia e aprendizado”.','Deixar apenas emojis e nenhuma informação.'],correct:1,why:'Um título verdadeiro e específico é mais útil do que tentar parecer alguém que você ainda não é.'},
  {q:'Você quer conversar com uma pessoa da área que admira. Qual abordagem é melhor?',options:['Uma mensagem breve com contexto e uma pergunta respeitosa.','Cobrar resposta em várias mensagens consecutivas.','Enviar o mesmo pedido de emprego para cem pessoas.'],correct:0,why:'Networking é construir conexão, não acumular contatos ou pressionar desconhecidos.'}
 ],
 [
  {q:'Um perfil desconhecido pede seu documento completo para “liberar uma vaga”. Você:',options:['Envia logo para garantir a oportunidade.','Publica o documento nos comentários.','Confere a empresa e usa apenas canais oficiais, sem enviar dados desnecessários.'],correct:2,why:'Seus dados merecem proteção. Verifique a autenticidade antes de compartilhar informações sensíveis.'},
  {q:'Uma pessoa discorda do seu comentário em uma rede. Qual atitude protege melhor a conversa?',options:['Responder com ofensas.','Explicar seu ponto com respeito e sem ataques pessoais.','Divulgar dados pessoais dela.'],correct:1,why:'Argumentar com respeito demonstra comunicação e reduz riscos de conflito e exposição.'}
 ],
 [
  {q:'Você encontrou uma vaga com promessa de contratação imediata mediante taxa. Qual sua reação?',options:['Verificar a oferta e não pagar para participar da seleção.','Pagar antes que a vaga acabe.','Enviar a taxa e todos os documentos pelo chat.'],correct:0,why:'Cobranças para garantir vaga são sinal de alerta. Use canais legítimos e investigue a oportunidade.'},
  {q:'Você vai mandar uma candidatura para uma vaga específica. O ideal é:',options:['Enviar a mesma mensagem genérica para todo lugar.','Escrever um texto enorme contando toda a sua vida.','Falar da vaga, de um interesse real e anexar o currículo solicitado.'],correct:2,why:'Personalização, clareza e respeito às instruções aumentam a qualidade da candidatura.'}
 ],
 [
  {q:'Seu plano tem várias metas. Qual é a melhor maneira de começar?',options:['Tentar mudar tudo em um dia.','Escolher uma ação concreta possível nesta semana.','Esperar saber exatamente qual será sua profissão em dez anos.'],correct:1,why:'Um passo viável e realizado cria movimento. Não é preciso definir toda a carreira agora.'},
  {q:'Você concluiu o curso e fez um currículo de teste. Qual próximo passo tem mais sentido?',options:['Revisar o currículo, pesquisar vagas reais e adaptar sua candidatura.','Inventar certificados e experiências para ganhar tempo.','Enviar documentos pessoais em qualquer anúncio recebido.'],correct:0,why:'Faça a passagem do treino para a realidade com revisão, personalização e segurança.'}
 ]
];
let userKey='',progress={current:{},passed:{},unlocked:{}},active=null,observed=null,homeObserved=null,renderLock=false;
function hash(v){let n=2166136261;for(const c of String(v)){n^=c.charCodeAt(0);n=Math.imul(n,16777619)}return(n>>>0).toString(36)}
const storageKey=()=>`wshub:jovens:app-v4:${slug}:${userKey||'anon'}`;
function read(){try{const x=JSON.parse(localStorage.getItem(storageKey())||'{}');return {current:x.current||{},passed:x.passed||{},unlocked:x.unlocked||{}}}catch(_){return {current:{},passed:{},unlocked:{}}}}
function save(){if(!userKey)return;try{localStorage.setItem(storageKey(),JSON.stringify(progress))}catch(_){}}
function identify(value){if(!value)return;const id=hash(value.trim().toLowerCase());if(id===userKey)return;userKey=id;progress=read();if(active){const a=active;const n=Math.min(a.slides.length-1,Math.max(0,Number(progress.current[a.index]||0)));a.phase=a.done?n:Math.min(n,Number(progress.unlocked[a.index]||0));draw()}}
window.addEventListener('wshub:jovens:sync',e=>identify(String(e.detail?.userKey||'')));
window.addEventListener('wshub:jovens:salvo',()=>{const n=q('.ws-app-sync');if(n){n.textContent='✓ Missão salva no WS Hub';n.hidden=false;setTimeout(()=>{if(n)n.hidden=true},3200)}});
function hintShell(){if(q('#ws-major-coach'))return;const e=document.createElement('aside');e.id='ws-major-coach';e.className='ws-major-coach';e.setAttribute('aria-label','Dicas do Major H');e.innerHTML='<div id="ws-major-panel" class="ws-major-panel" hidden><div class="ws-major-head"><img src="/assets/major-h/major-h-avatar.webp" alt=""><strong>Major H<small>Seu guia nesta missão</small></strong><button type="button" id="ws-major-close" aria-label="Fechar dica">×</button></div><p id="ws-major-copy"></p></div><button class="ws-major-launch" id="ws-major-launch" type="button" aria-label="Abrir dica do Major H" aria-expanded="false"><img src="/assets/major-h/major-h-avatar.webp" alt="Dica"></button>';document.body.append(e);const box=q('#ws-major-panel'),b=q('#ws-major-launch');const toggle=open=>{box.hidden=!open;b.setAttribute('aria-expanded',String(open))};b.addEventListener('click',()=>toggle(box.hidden));q('#ws-major-close').addEventListener('click',()=>toggle(false))}
function setHint(index){hintShell();q('#ws-major-copy').textContent=tips[index]||'Avance um passo de cada vez.'}
function illustrateHome(){Q('.module-card').forEach((card,i)=>{if(i>6||q('.ws-arte-thumb',card))return;const im=document.createElement('img');im.className='ws-arte-thumb';im.src=ART(i);im.loading='lazy';im.alt='Arte da missão '+(i+1);im.onerror=()=>im.remove();const h=q('.module-head',card);h?.insertAdjacentElement('afterend',im)})}
function makeSlide(type,{title='',kicker='',nodes=[],content='',challenge=null,original=null}={}){const slide={type,title,kicker,challenge,original};if(original)slide.node=original;else{const div=document.createElement('div');div.className='ws-scene';if(title){const h=document.createElement('h2');h.className='ws-scene-title';h.textContent=title;div.append(h)}if(content){const b=document.createElement('div');b.innerHTML=content;div.append(...b.childNodes)}else nodes.forEach(n=>div.append(n));slide.node=div}return slide}
function splitList(node){const items=Q(':scope > li',node);if(items.length<=3)return[node];const out=[];for(let i=0;i<items.length;i+=3){const list=node.cloneNode(false);items.slice(i,i+3).forEach(x=>list.append(x.cloneNode(true)));out.push(list)}return out}
function lessonSlides(section){const heading=q('h2',section)?.textContent?.trim()||'Aprendizado';const contents=[...section.children].filter(e=>!e.matches('h2,.lesson-top'));
 const items=[];for(const el of contents){if(el.matches('ol,ul'))items.push(...splitList(el));else items.push(el)}
 const chunks=[];let chunk=[],chars=0;
 const flush=()=>{if(chunk.length){chunks.push(chunk);chunk=[];chars=0}};
 for(const node of items){const len=(node.textContent||'').trim().length;const heavy=node.matches('.vs-grid,.mock,.fast-game,.callout,table,.links-list')||len>320;
 if(heavy){flush();chunks.push([node]);continue}
 if(chunk.length&&chars+len>240)flush();chunk.push(node);chars+=len;
 }flush();if(!chunks.length)chunks.push([document.createTextNode('Explore este conteúdo e continue para o próximo passo.')]);
 return chunks.map((c,i)=>makeSlide('lesson',{title:heading,kicker:`${i+1} de ${chunks.length}`,nodes:c}));
}
function challengeSlide(item,section){return makeSlide('challenge',{title:'E na vida real?',kicker:'Decisão rápida',challenge:item,content:`<p class="ws-scenario-sub">Uma situação comum. Escolha sua atitude e descubra o motivo.</p><div class="ws-scenario-question">${ESC(item.q)}</div><div class="ws-scenario-choices">${item.options.map((option,i)=>`<button type="button" class="ws-scenario-option" data-ws-answer="${i}"><span>${'ABC'[i]}</span>${ESC(option)}</button>`).join('')}</div><div class="ws-scenario-feedback" role="status" aria-live="polite" hidden></div>`})}
function construct(){const match=location.hash.match(/^#modulo-(\d+)$/);if(!match)return;const index=Number(match[1])-1;if(index<0||index>6)return;
 const header=q('.mod-header'),cols=q('.two-column'),quiz=q('#quizCard');if(!header||!cols||!quiz)return;
 const done=Q('.nav-link').some(n=>n.getAttribute('href')==='#modulo-'+(index+1)&&n.classList.contains('done'));
 const title=q('h1',header)?.textContent?.trim()||'Sua missão';const subtitle=q('.mod-content p',header)?.textContent?.trim()||'';
 const icon=q('.mod-icon',header)?.textContent?.trim()||'🚀';const hook=q('.question-banner p',cols)?.textContent?.trim()||'';
 const mission=q('.mission-panel p',cols)?.textContent?.trim()||'';
 const slides=[makeSlide('intro',{title:'Hora de subir de nível',kicker:'Boas-vindas',content:`<div class="ws-intro-illustration"><div class="ws-intro-orbit">${ESC(icon)}</div><img src="/wshub/assets/avatar-curso-jovens.webp" alt="" onerror="this.style.display='none'"></div><p class="ws-big-question">${ESC(hook)}</p><p class="ws-intro-caption">Aprenda por cartões, tome decisões e teste o que você sabe. Sem cronômetro.</p>`})];
 const lessons=Q('.lesson',cols),challenges=CHALLENGES[index];
 lessons.forEach((section,i)=>{slides.push(...lessonSlides(section));if(i===0&&challenges[0])slides.push(challengeSlide(challenges[0],i));if(i===Math.max(1,lessons.length-2)&&challenges[1])slides.push(challengeSlide(challenges[1],i))});
 const labs=Q('.lab',cols);labs.forEach(lab=>slides.push(makeSlide('lab',{title:q('h2',lab)?.textContent||'Laboratório',original:lab,kicker:'Experimente'})));
 if(mission)slides.push(makeSlide('mission',{title:'Sua missão prática',kicker:'Aplique o aprendizado',content:`<div class="ws-mission-symbol">🎯</div><p class="ws-mission-copy">${ESC(mission)}</p><p class="ws-tip-text">Você pode fazer a atividade no seu ritmo, sem precisar publicar dados pessoais.</p>`}));
 slides.push(makeSlide('quiz',{title:'Desafio final',kicker:'Teste o que aprendeu',original:quiz}));
 slides.push(makeSlide('victory',{title:'Missão completa!',kicker:'Recompensa desbloqueada',content:`<div class="ws-victory-icon">🏆</div><p>Você concluiu as decisões desta missão. Sua evolução fica registrada no WS Hub.</p><a class="ws-victory-link" href="${index<6?'#modulo-'+(index+2):'#inicio'}">${index<6?'Próximo módulo →':'Ver mapa de missões →'}</a>`}));
 const prev=Number(progress.current[index]??0),maximum=Number(progress.unlocked[index]??0);
 active={index,slides,done,phase:done?Math.min(slides.length-1,Math.max(0,prev)):Math.min(slides.length-2,Math.max(0,Math.min(prev,maximum)))};
 const app=document.createElement('div');app.className='ws-app-screen';app.innerHTML=`<div class="ws-app-head"><div class="ws-app-heading"><a href="#inicio" class="ws-app-back" aria-label="Voltar ao mapa">‹</a><span class="ws-app-emoji">${ESC(icon)}</span><div class="ws-app-heading-copy"><span class="ws-app-eyebrow">MISSÃO ${index+1} / 7 · ${done?'CONCLUÍDA':'EM ANDAMENTO'}</span><strong title="${ESC(title)}">${ESC(title)}</strong></div></div><div class="ws-app-bar" aria-label="Progresso da missão"><span id="ws-app-progress"></span></div></div><section class="ws-app-card" aria-label="Etapa de aprendizagem"><div class="ws-app-card-top"><span id="ws-app-category"></span><span id="ws-app-count" aria-live="polite"></span></div><div class="ws-app-scroll" id="ws-app-content" tabindex="-1"></div></section><nav class="ws-app-controls" aria-label="Navegação pelas etapas"><button type="button" class="ws-app-prev" id="ws-app-prev" aria-label="Etapa anterior">←</button><div class="ws-app-control-info"><span id="ws-app-state">Sua jornada, seu ritmo</span><small id="ws-app-substatus">Toque para avançar</small></div><button type="button" class="ws-app-next" id="ws-app-next">Avançar <span aria-hidden="true">→</span></button></nav><p class="ws-app-sync" hidden></p>`;
 root.replaceChildren(app);document.documentElement.classList.add('ws-app-active');observed=app;
 q('#ws-app-prev',app).addEventListener('click',()=>go(-1));q('#ws-app-next',app).addEventListener('click',()=>go(1));
 q('#ws-app-content',app).addEventListener('click',handleChoice);
 let tx=0,ty=0;const content=q('#ws-app-content',app);
 content.addEventListener('touchstart',e=>{if(e.touches.length!==1||e.target.closest('button,input,textarea,select,a,summary'))return;tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
 content.addEventListener('touchend',e=>{if(!tx||e.changedTouches.length!==1)return;const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;tx=0;ty=0;if(Math.abs(dx)>100&&Math.abs(dx)>Math.abs(dy)*1.7){go(dx<0?1:-1)}},{passive:true});
 setHint(index);draw();
}
function isPassed(a,phase){return a.done||!!progress.passed[`${a.index}:${phase}`]}
function handleChoice(e){const btn=e.target.closest('[data-ws-answer]');if(!btn||!active)return;const slide=active.slides[active.phase];if(slide.type!=='challenge'||isPassed(active,active.phase))return;
 const chosen=Number(btn.dataset.wsAnswer),c=slide.challenge;const box=q('.ws-scenario-feedback',slide.node);Q('[data-ws-answer]',slide.node).forEach(n=>n.classList.remove('ws-correct','ws-wrong'));
 if(chosen===c.correct){btn.classList.add('ws-correct');Q('[data-ws-answer]',slide.node).forEach(n=>n.disabled=true);box.innerHTML=`<strong>✓ Boa escolha!</strong><p>${ESC(c.why)}</p>`;box.className='ws-scenario-feedback ws-positive';progress.passed[`${active.index}:${active.phase}`]=true;save()}
 else{btn.classList.add('ws-wrong');box.innerHTML=`<strong>Olhe por outro ângulo</strong><p>${ESC(c.why)}</p>`;box.className='ws-scenario-feedback ws-negative';}
 box.hidden=false;drawControls();
}
function drawControls(){if(!active)return;const {slides,phase,done}=active,scene=slides[phase];const prev=q('#ws-app-prev'),next=q('#ws-app-next');prev.disabled=phase===0;
 const locked=scene.type==='challenge'&&!isPassed(active,phase);next.disabled=locked;next.hidden=scene.type==='quiz'||scene.type==='victory';
 const total=slides.length-1;const progressPct=Math.round(Math.min(100,phase/total*100));q('#ws-app-progress').style.width=progressPct+'%';q('#ws-app-count').textContent=`${phase+1} / ${slides.length}`;
 let status='Aprenda, experimente e avance';let hint='Sem tempo de espera';
 if(scene.type==='challenge'){status=locked?'Tome uma decisão':'Decisão concluída ✓';hint=locked?'Escolha a melhor atitude':'Pode continuar'}
 if(scene.type==='lab'){status='Laboratório prático';hint='Teste as ferramentas'}
 if(scene.type==='quiz'){status='Desafio da missão';hint='Responda para conquistar XP'}
 if(scene.type==='victory'){status='Medalha conquistada';hint='Escolha seu próximo módulo'}
 q('#ws-app-state').textContent=status;q('#ws-app-substatus').textContent=hint;
 next.innerHTML=phase===slides.length-2?'Última etapa <span aria-hidden="true">→</span>':'Avançar <span aria-hidden="true">→</span>';
}
function draw(){if(!active)return;const {slides,phase,index}=active,scene=slides[phase];const box=q('#ws-app-content');if(!box)return;
 if(scene.type==='victory'&&!active.done){active.phase=slides.length-2;return draw()}
 const label={intro:'INÍCIO',lesson:'APRENDA',challenge:'VOCÊ DECIDE',lab:'NA PRÁTICA',mission:'MISSÃO',quiz:'DESAFIO',victory:'CONQUISTA'}[scene.type]||'MISSÃO';
 q('#ws-app-category').textContent=label+(scene.kicker?' · '+scene.kicker:'');
 box.replaceChildren(scene.node);box.scrollTop=0;
 scene.node.classList.remove('ws-show-animate');void scene.node.offsetWidth;scene.node.classList.add('ws-show-animate');
 if(scene.type==='challenge'){
  const correct=isPassed(active,phase),buttons=Q('[data-ws-answer]',scene.node),feedback=q('.ws-scenario-feedback',scene.node);
  if(correct){buttons.forEach((b,i)=>{b.disabled=true;b.classList.toggle('ws-correct',i===scene.challenge.correct)});feedback.hidden=false;feedback.className='ws-scenario-feedback ws-positive';feedback.innerHTML=`<strong>✓ Boa escolha!</strong><p>${ESC(scene.challenge.why)}</p>`}
 }
 if(scene.type==='quiz'){const b=q('#quizCard',scene.node)||scene.node;if(b) b.hidden=false}
 progress.current[index]=phase;save();setHint(index);drawControls();
}
function go(delta){if(!active)return;const {index,phase,slides,done}=active;const scene=slides[phase];if(delta>0&&scene.type==='challenge'&&!isPassed(active,phase))return;
 if(scene.type==='quiz'&&delta>0)return;const n=phase+delta;
 if(n<0||n>=slides.length||n===slides.length-1&&!done)return;
 if(delta>0)progress.unlocked[index]=Math.max(progress.unlocked[index]||0,n);
 active.phase=n;draw();
}
window.addEventListener('wshub:jovens:modulo-concluido',e=>{if(!active||e.detail?.index!==active.index)return;active.done=true;progress.unlocked[active.index]=active.slides.length-1;active.phase=active.slides.length-1;save();draw()});
function mount(){if(renderLock)return;if(observed&&q('.ws-app-screen')===observed)return;const header=q('.mod-header');if(!header){document.documentElement.classList.remove('ws-app-active');active=null;observed=null;const home=q('.hero');if(home&&home!==homeObserved){homeObserved=home;illustrateHome()}return}
 renderLock=true;try{construct()}finally{renderLock=false}
}
new MutationObserver(mount).observe(root,{childList:true});
window.addEventListener('hashchange',()=>setTimeout(mount,0));
window.addEventListener('pagehide',save);
hintShell();mount();
})();
