/* WS Hub · Missão Futuro — experiência app v4, mobile-first.
   Conteúdo e quiz vêm do index existente. Progresso/certificado continuam
   exclusivos da ponte autenticada jovens-bridge.js. Leitura com 10 segundos mínimos, microinterações e trilhas de orientação. */
(()=>{'use strict';
if(window.__WS_JOVENS_APP_V5__)return;window.__WS_JOVENS_APP_V5__=true;
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
const GUIDE_TIPS=[
 ['🔐','Controle quem vê suas publicações','Use configurações de privacidade para escolher o público. Reveja quem pode ver stories, fotos e comentários.'],
 ['🧩','Separe espaços quando fizer sentido','Um portfólio simples pode apresentar projetos, enquanto seu perfil pessoal fica reservado às pessoas de confiança.'],
 ['🪪','Revise sua apresentação pública','Confira foto, biografia, nome exibido e links. Escolha informações úteis para quem procura seu trabalho.'],
 ['🏷️','Cuide das marcações e do histórico','Ative a revisão de marcações e confira publicações antigas. Ajuste a visibilidade sem precisar apagar sua história.'],
 ['🛡️','Lembre: privacidade tem limites','Conteúdo público pode ser compartilhado por outras pessoas. Pense antes de publicar e respeite o consentimento de quem aparece.']
];
const CHALLENGES=[
 [
  {q:'Um recrutador acessa seu perfil público e encontra um vídeo divertido gravado no aniversário de um amigo. Como avaliar essa publicação?',options:['Arquivar o vídeo até o processo terminar, mesmo sem ninguém aparecer identificado.','Analisar o contexto, quem aparece e a privacidade antes de decidir se modifica a visibilidade.','Manter público porque momentos pessoais não têm qualquer relação com primeiras impressões.'],correct:1,why:'A decisão precisa considerar contexto, consentimento e privacidade; nem tudo que é pessoal precisa ser apagado.'},
  {q:'Você quer apresentar seu interesse por desenho digital numa candidatura. Qual evidência é mais convincente?',options:['Criar um pequeno portfólio com dois trabalhos, indicando sua participação e o que aprendeu.','Publicar somente o certificado de um curso, deixando os trabalhos para uma eventual entrevista.','Usar um modelo pronto de portfólio e destacar mais o visual do que seu processo de criação.'],correct:0,why:'Uma amostra autoral com explicação de processo oferece evidência concreta sem exigir experiência de emprego.'}
 ],
 [
  {q:'Você liderou uma atividade escolar, mas também foi responsável pela edição dos vídeos. Como representar essa experiência?',options:['Destacar apenas a liderança, porque títulos de responsabilidade parecem mais profissionais.','Descrever o projeto e separar a tarefa técnica de edição da colaboração com o grupo.','Descrever apenas os aplicativos usados, porque ações coletivas são difíceis de demonstrar.'],correct:1,why:'Uma experiência pode mostrar habilidades técnicas e comportamentais, desde que as contribuições sejam verdadeiras.'},
  {q:'Uma vaga pede boa comunicação. Qual relato ajuda a demonstrá-la sem exageros?',options:['Tenho facilidade de comunicação e consigo conversar em qualquer ambiente.','Apresentei uma atividade à turma e recebi elogios sobre a clareza dos slides.','Preparei uma apresentação para outra turma e adaptei os exemplos às perguntas do público.'],correct:2,why:'Explicar como você adaptou a comunicação mostra escolhas e contexto, não só um elogio genérico.'}
 ],
 [
  {q:'Você fez um curso curto e está montando o currículo. Como apresentar esse aprendizado?',options:['Informar o curso, a instituição e, se relevante, um exemplo do que praticou.','Listar as ferramentas como domínio avançado, porque isso ajuda nas buscas por palavras-chave.','Apresentar o curso como experiência profissional, desde que a instituição seja reconhecida.'],correct:0,why:'Curso e prática podem ser valorizados sem transformar estudo em emprego ou exagerar o nível de domínio.'},
  {q:'Sua experiência foi ajudar numa campanha de arrecadação da escola. Qual redação dá mais informação?',options:['Participei de diversas campanhas de grande impacto social.','Coordenei uma ação institucional complexa com participação de muitos estudantes.','Ajudei a registrar doações em planilha e divulgar prazos entre as turmas.'],correct:2,why:'A contribuição concreta é mais confiável do que títulos que podem inflar o papel exercido.'}
 ],
 [
  {q:'Um profissional aceita sua conexão no LinkedIn. Você gostaria de aprender mais sobre a área. O que faz sentido agora?',options:['Agradecer pela conexão, mencionar um assunto concreto e perguntar por uma indicação de leitura.','Compartilhar seu currículo e pedir avaliação detalhada logo no primeiro contato.','Esperar que a pessoa ofereça espontaneamente ajuda, já que a conexão foi aceita.'],correct:0,why:'A conexão abre espaço para uma conversa; um pedido específico e pequeno respeita o tempo da outra pessoa.'},
  {q:'Você mudou seu interesse de tecnologia para logística. O que fazer no perfil?',options:['Manter o título anterior para transmitir continuidade e falar de logística apenas nas entrevistas.','Atualizar título e resumo para refletir o interesse atual, sem apagar projetos que continuam relevantes.','Remover cursos anteriores para que o perfil represente exclusivamente a nova área.'],correct:1,why:'Seu perfil pode evoluir sem apagar aprendizados anteriores. Clareza é mais útil do que uma narrativa artificial.'}
 ],
 [
  {q:'Você aparece marcado numa publicação de colegas com uma brincadeira que não gostaria de associar ao seu perfil público. Qual atitude é mais proporcional?',options:['Pedir para retirar a marcação e ajustar as opções de revisão de marcações.','Apagar suas próprias publicações até que a foto desapareça das buscas.','Avisar os colegas de que só pessoas com perfil profissional deveriam publicar fotos.'],correct:0,why:'Controlar marcações e dialogar sobre o conteúdo é mais efetivo que apagar postagens sem relação.'},
  {q:'Uma colega publica um comentário com informação incorreta sobre uma atividade de turma. Como corrigir sem gerar conflito?',options:['Responder imediatamente no grupo maior para evitar que a informação se espalhe.','Pedir que ela apague e publique a correção que você escreveu, sem prolongar o assunto.','Verificar a informação e sugerir uma correção objetiva, escolhendo o canal conforme o alcance do erro.'],correct:2,why:'Confirmar os fatos e adequar o canal evita exposição desnecessária e melhora a informação.'}
 ],
 [
  {q:'Uma vaga interessante não informa claramente a jornada, mas você ainda estuda. Qual é o próximo passo?',options:['Enviar o currículo e decidir sobre horário somente se houver uma proposta.','Confirmar os requisitos e horários antes de dedicar tempo ao processo, sem enviar dados desnecessários.','Descartar a vaga, porque empresas que não detalham a jornada nunca são confiáveis.'],correct:1,why:'Uma dúvida relevante pode ser esclarecida nos canais oficiais; isso protege seu tempo e a compatibilidade com a escola.'},
  {q:'Você vai se candidatar por uma plataforma que pede uma breve apresentação. Qual abordagem funciona melhor?',options:['Relacionar uma experiência real a um requisito da vaga, em poucas frases.','Reaproveitar a apresentação de seu perfil exatamente como está, para manter a mesma identidade.','Destacar principalmente disponibilidade e vontade de aprender, sem citar experiências ainda informais.'],correct:0,why:'Personalizar com um exemplo concreto mostra atenção à vaga e pode valorizar vivências escolares.'}
 ],
 [
  {q:'Você quer começar três cursos e se candidatar a vagas, mas tem avaliações escolares nesta semana. Como organizar?',options:['Fazer inscrições em todos os cursos para garantir que não perderá oportunidades.','Aguardar o fim do semestre para que suas atividades não concorram pela atenção.','Escolher uma tarefa breve e realista agora e distribuir as outras no calendário.'],correct:2,why:'Priorizar uma ação possível evita sobrecarga e permite avançar sem ignorar a escola.'},
  {q:'Um colega pede ajuda para revisar o currículo dele. Como ser útil?',options:['Editar o texto para ficar mais impressionante, mantendo as experiências que ele mencionou.','Perguntar sobre as atividades reais e sugerir descrições claras, sem acrescentar fatos não comprovados.','Usar seu próprio currículo como modelo e manter as frases para garantir um padrão profissional.'],correct:1,why:'Uma boa revisão organiza os fatos do colega e respeita sua história, sem inventar ou copiar exemplos.'}
 ]
];
let userKey='',progress={current:{},passed:{},unlocked:{},readTime:{},revealed:{},tipsSeen:{},guideStep:{}},active=null,observed=null,homeObserved=null,renderLock=false,readingClock=null;
function hash(v){let n=2166136261;for(const c of String(v)){n^=c.charCodeAt(0);n=Math.imul(n,16777619)}return(n>>>0).toString(36)}
const storageKey=()=>`wshub:jovens:app-v5:${slug}:${userKey||'anon'}`;
function read(){try{const x=JSON.parse(localStorage.getItem(storageKey())||'{}');return {current:x.current||{},passed:x.passed||{},unlocked:x.unlocked||{},readTime:x.readTime||{},revealed:x.revealed||{},tipsSeen:x.tipsSeen||{},guideStep:x.guideStep||{}}}catch(_){return {current:{},passed:{},unlocked:{},readTime:{},revealed:{},tipsSeen:{},guideStep:{}}}}
function save(){if(!userKey)return;try{localStorage.setItem(storageKey(),JSON.stringify(progress))}catch(_){}}
function identify(value){if(!value)return;const id=hash(value.trim().toLowerCase());if(id===userKey)return;userKey=id;progress=read();if(active){const a=active;const n=Math.min(a.slides.length-1,Math.max(0,Number(progress.current[a.index]||0)));a.phase=a.done?n:Math.min(n,Number(progress.unlocked[a.index]||0));draw()}}
window.addEventListener('wshub:jovens:sync',e=>identify(String(e.detail?.userKey||'')));
window.addEventListener('wshub:jovens:salvo',()=>{const n=q('.ws-app-sync');if(n){n.textContent='✓ Missão salva no WS Hub';n.hidden=false;setTimeout(()=>{if(n)n.hidden=true},3200)}});
function markHintSeen(){if(!active)return;progress.tipsSeen[active.index]=true;save();const panel=q('#ws-major-panel'),launch=q('#ws-major-launch');if(panel)panel.hidden=true;if(launch){launch.hidden=true;launch.setAttribute('aria-expanded','false')}}
function hintShell(){if(q('#ws-major-coach'))return;const e=document.createElement('aside');e.id='ws-major-coach';e.className='ws-major-coach';e.setAttribute('aria-label','Dicas do Major H');e.innerHTML='<div id="ws-major-panel" class="ws-major-panel" hidden><div class="ws-major-head"><img src="/assets/major-h/major-h-avatar.webp" alt=""><strong>Major H<small>Seu guia nesta missão</small></strong><button type="button" id="ws-major-close" aria-label="Li a dica e fechar">×</button></div><p id="ws-major-copy"></p><button id="ws-major-done" type="button" class="ws-major-done">Entendi a dica ✓</button></div><button class="ws-major-launch" id="ws-major-launch" type="button" aria-label="Abrir dica do Major H" aria-expanded="false"><img src="/assets/major-h/major-h-avatar.webp" alt="Dica"></button>';document.body.append(e);const box=q('#ws-major-panel'),b=q('#ws-major-launch');b.addEventListener('click',()=>{if(!active||progress.tipsSeen[active.index])return;box.hidden=false;b.setAttribute('aria-expanded','true')});q('#ws-major-close').addEventListener('click',markHintSeen);q('#ws-major-done').addEventListener('click',markHintSeen)}
function setHint(index){hintShell();q('#ws-major-copy').textContent=tips[index]||'Avance um passo de cada vez.';const seen=!!progress.tipsSeen[index],b=q('#ws-major-launch');b.hidden=seen;if(seen){q('#ws-major-panel').hidden=true;b.setAttribute('aria-expanded','false')}}
function illustrateHome(){Q('.module-card').forEach((card,i)=>{if(i>6||q('.ws-arte-thumb',card))return;const im=document.createElement('img');im.className='ws-arte-thumb';im.src=ART(i);im.loading='lazy';im.alt='Arte da missão '+(i+1);im.onerror=()=>im.remove();const h=q('.module-head',card);h?.insertAdjacentElement('afterend',im)})}
const ICONS=[['foto','📸'],['privacidade','🔐'],['seguran','🛡️'],['projeto','🧩'],['escola','🎓'],['educa','🎓'],['competên','⚡'],['habilidad','⚡'],['currículo','📄'],['apresenta','🎤'],['e-mail','✉️'],['mensagen','✉️'],['network','🤝'],['conex','🤝'],['vaga','💼'],['emprego','💼'],['opini','💬'],['coment','💬'],['contato','📱'],['perfil','👤'],['redes','📱'],['busca','🔎'],['pesquis','🔎'],['plano','📅'],['prazo','⏳'],['mentira','🔍'],['dados','🔒']];
function semanticIcon(text){const t=String(text).toLowerCase();return ICONS.find(([w])=>t.includes(w))?.[1]||'✦'}
function makeSlide(type,{title='',kicker='',nodes=[],content='',challenge=null,original=null,requiresReveal=false}={}){
 const slide={type,title,kicker,challenge,original,requiresReveal};if(original)slide.node=original;else{
 const div=document.createElement('div');div.className='ws-scene ws-scene-'+type;
 if(title){const h=document.createElement('h2');h.className='ws-scene-title';h.textContent=title;div.append(h)}
 if(content){const b=document.createElement('div');b.innerHTML=content;div.append(...b.childNodes)}else nodes.forEach(n=>div.append(n));
 const plain=type==='lesson'&&div.textContent.length<360&&!q('.vs-grid,.mock,.fast-game,.callout,.mini-tags,.ws-example,ul,ol,table,.links-list',div);
 if(plain){div.classList.add('ws-scene-focus');const icon=document.createElement('div');icon.className='ws-thematic-icon';icon.setAttribute('aria-hidden','true');icon.textContent=semanticIcon(title+' '+div.textContent);div.insertBefore(icon,div.firstChild)}
 // Compara ideias sem entregar as duas respostas na mesma visualização.
 Q('.vs-grid',div).forEach(grid=>{const c=grid.children[1];if(!c)return;c.hidden=true;c.classList.add('ws-reveal-target');grid.classList.add('ws-progressive-compare');const button=document.createElement('button');button.type='button';button.className='ws-reveal-button';button.dataset.wsReveal='comparison';button.textContent='Descobrir o caminho melhor →';grid.insertAdjacentElement('afterend',button);slide.requiresReveal=true});
 slide.node=div}return slide
}
function splitList(node){const items=Q(':scope > li',node);if(items.length<=3)return[node];const out=[];for(let i=0;i<items.length;i+=3){const list=node.cloneNode(false);items.slice(i,i+3).forEach(x=>list.append(x.cloneNode(true)));out.push(list)}return out}
function lessonSlides(section){const heading=q('h2',section)?.textContent?.trim()||'Aprendizado';const contents=[...section.children].filter(e=>!e.matches('h2,.lesson-top'));
 const chunks=[],pending=[];let chars=0;
 const flush=()=>{if(pending.length){chunks.push({kind:'lesson',nodes:pending.splice(0)});chars=0}};
 const push=node=>{const len=(node.textContent||'').trim().length;const heavy=node.matches('.vs-grid,.mock,.fast-game,.callout,table,.links-list')||len>320;if(heavy){flush();chunks.push({kind:'lesson',nodes:[node]});return}if(pending.length&&chars+len>235)flush();pending.push(node);chars+=len};
 for(const el of contents){
  // Os dez cuidados são dez telas, com um símbolo relevante por cuidado.
  if(el.matches('ol')&&heading.toLowerCase().includes('10 cuidados')){flush();Q(':scope > li',el).forEach((li,i)=>chunks.push({kind:'care',index:i,nodes:[li]}));continue}
  // Cinco perguntas: uma por vez; resposta liberada só após interação.
  if(el.matches('.fast-game')){flush();const details=Q('details',el);const start=document.createElement('p');start.textContent='Responda mentalmente antes de abrir a explicação. Não tem problema não saber tudo.';chunks.push({kind:'lesson',nodes:[start]});details.forEach((d,i)=>chunks.push({kind:'flash',number:i+1,question:q('summary',d)?.textContent?.trim()||'Pergunta',answer:q('p',d)?.textContent?.trim()||''}));const final=q('p.small',el);if(final)chunks.push({kind:'lesson',nodes:[final]});continue}
  if(el.matches('ul,ol'))splitList(el).forEach(push);else push(el);
 }flush();if(!chunks.length)chunks.push({kind:'lesson',nodes:[document.createTextNode('Reflita sobre a ideia e avance para o próximo passo.')]});
 return chunks.map((c,i)=>{
  if(c.kind==='care'){const li=c.nodes[0],label=q('strong',li)?.textContent?.replace(':','').trim()||'Cuidado';const icons=['🖼️','💬','👁️','🪪','✉️','📋','🧠','🗣️','🧭','🤝'];return makeSlide('care',{title:`${c.index+1}/10 · ${label}`,kicker:'Cuidado '+(c.index+1)+' de 10',content:`<div class="ws-care-art" aria-hidden="true">${icons[c.index]||'🛡️'}</div><p class="ws-care-copy">${ESC(li.textContent.replace(label+':','').trim())}</p><div class="ws-care-foot">Uma dica de cada vez. Pense em como aplicar isso ao seu perfil.</div>`})}
  if(c.kind==='flash')return makeSlide('flash',{title:`Pergunta ${c.number} de 5`,kicker:'Curiosidade · '+c.number+'/5',requiresReveal:true,content:`<div class="ws-flash-icon" aria-hidden="true">❔</div><p class="ws-flash-question">${ESC(c.question)}</p><button type="button" data-ws-reveal="answer" class="ws-reveal-button">Revelar resposta →</button><div class="ws-flash-answer ws-reveal-target" hidden><strong>Resposta</strong><p>${ESC(c.answer)}</p></div>`});
  return makeSlide('lesson',{title:heading,kicker:`${i+1} de ${chunks.length}`,nodes:c.nodes});
 });
}
function challengeSlide(item,section){return makeSlide('challenge',{title:'E na vida real?',kicker:'Decisão rápida',challenge:item,content:`<p class="ws-scenario-sub">Uma situação comum. Escolha sua atitude e descubra o motivo.</p><div class="ws-scenario-question">${ESC(item.q)}</div><div class="ws-scenario-choices">${item.options.map((option,i)=>`<button type="button" class="ws-scenario-option" data-ws-answer="${i}"><span>${'ABC'[i]}</span>${ESC(option)}</button>`).join('')}</div><div class="ws-scenario-feedback" role="status" aria-live="polite" hidden></div>`})}
function construct(){const match=location.hash.match(/^#modulo-(\d+)$/);if(!match)return;const index=Number(match[1])-1;if(index<0||index>6)return;
 const header=q('.mod-header'),cols=q('.two-column'),quiz=q('#quizCard');if(!header||!cols||!quiz)return;
 const done=Q('.nav-link').some(n=>n.getAttribute('href')==='#modulo-'+(index+1)&&n.classList.contains('done'));
 const title=q('h1',header)?.textContent?.trim()||'Sua missão';const subtitle=q('.mod-content p',header)?.textContent?.trim()||'';
 const icon=q('.mod-icon',header)?.textContent?.trim()||'🚀';const hook=q('.question-banner p',cols)?.textContent?.trim()||'';
 const mission=q('.mission-panel p',cols)?.textContent?.trim()||'';
 const slides=[makeSlide('intro',{title:'Hora de subir de nível',kicker:'Boas-vindas',content:`<div class="ws-intro-illustration"><div class="ws-intro-orbit">${ESC(icon)}</div><img src="/wshub/assets/avatar-curso-jovens.webp" alt="" onerror="this.style.display='none'"></div><p class="ws-big-question">${ESC(hook)}</p><p class="ws-intro-caption">Aprenda por cartões, tome decisões e teste o que você sabe. Leitura com atenção, escolhas e atividades rápidas.</p>`})];
 const lessons=Q('.lesson',cols),challenges=CHALLENGES[index];
 lessons.forEach((section,i)=>{slides.push(...lessonSlides(section));if(i===0&&challenges[0])slides.push(challengeSlide(challenges[0],i));if(i===Math.max(1,lessons.length-2)&&challenges[1])slides.push(challengeSlide(challenges[1],i))});
 const labs=Q('.lab',cols);labs.forEach(lab=>slides.push(makeSlide('lab',{title:q('h2',lab)?.textContent||'Laboratório',original:lab,kicker:'Experimente'})));
 if(mission)slides.push(makeSlide('mission',{title:'Sua missão prática',kicker:'Aplique o aprendizado',content:`<div class="ws-mission-symbol">🎯</div><p class="ws-mission-copy">${ESC(mission)}</p><p class="ws-tip-text">Você pode fazer a atividade no seu ritmo, sem precisar publicar dados pessoais.</p>`}));
 if(index===0)slides.push(makeSlide('guide',{title:'5 dicas: pessoal e profissional',kicker:'Coloque em prática',requiresReveal:true,content:'<p class="ws-guide-intro">Você não precisa abrir sua vida pessoal para mostrar o que sabe. Descubra cinco ajustes simples, um de cada vez.</p><div class="ws-guide-visual"><div class="ws-guide-icon" aria-hidden="true"></div><span class="ws-guide-count"></span><h3 class="ws-guide-heading"></h3><p class="ws-guide-copy"></p></div><button type="button" class="ws-reveal-button" data-ws-next-tip>Ver a primeira dica →</button>'}));
 slides.push(makeSlide('quiz',{title:'Desafio final',kicker:'Teste o que aprendeu',original:quiz}));
 slides.push(makeSlide('victory',{title:'Missão completa!',kicker:'Recompensa desbloqueada',content:`<div class="ws-victory-icon">🏆</div><p>Você concluiu as decisões desta missão. Sua evolução fica registrada no WS Hub.</p><a class="ws-victory-link" href="${index<6?'#modulo-'+(index+2):'#inicio'}">${index<6?'Próximo módulo →':'Ver mapa de missões →'}</a>`}));
 const prev=Number(progress.current[index]??0),maximum=Number(progress.unlocked[index]??0);
 active={index,slides,done,phase:done?Math.min(slides.length-1,Math.max(0,prev)):Math.min(slides.length-2,Math.max(0,Math.min(prev,maximum)))};
 const app=document.createElement('div');app.className='ws-app-screen';app.innerHTML=`<div class="ws-app-head"><div class="ws-app-heading"><a href="#inicio" class="ws-app-back" aria-label="Voltar ao mapa">‹</a><span class="ws-app-emoji">${ESC(icon)}</span><div class="ws-app-heading-copy"><span class="ws-app-eyebrow">MISSÃO ${index+1} / 7 · ${done?'CONCLUÍDA':'EM ANDAMENTO'}</span><strong title="${ESC(title)}">${ESC(title)}</strong></div></div><div class="ws-app-bar" aria-label="Progresso da missão"><span id="ws-app-progress"></span></div></div><section class="ws-app-card" aria-label="Etapa de aprendizagem"><div class="ws-app-card-top"><span id="ws-app-category"></span><span id="ws-app-count" aria-live="polite"></span></div><div class="ws-app-scroll" id="ws-app-content" tabindex="-1"></div></section><nav class="ws-app-controls" aria-label="Navegação pelas etapas"><button type="button" class="ws-app-prev" id="ws-app-prev" aria-label="Etapa anterior">←</button><div class="ws-app-control-info"><span id="ws-app-state">Sua jornada, seu ritmo</span><small id="ws-app-substatus">Toque para avançar</small></div><button type="button" class="ws-app-next" id="ws-app-next">Avançar <span aria-hidden="true">→</span></button></nav><p class="ws-app-sync" hidden></p><div id="ws-app-note" class="ws-app-note" role="status" aria-live="polite" hidden></div>`;
 root.replaceChildren(app);document.documentElement.classList.add('ws-app-active');observed=app;
 q('#ws-app-prev',app).addEventListener('click',()=>go(-1));q('#ws-app-next',app).addEventListener('click',()=>go(1));
 q('#ws-app-content',app).addEventListener('click',handleChoice);q('#ws-app-content',app).addEventListener('input',handleLabInput);q('#ws-app-content',app).addEventListener('change',handleLabInput);
 let tx=0,ty=0;const content=q('#ws-app-content',app);
 content.addEventListener('touchstart',e=>{if(e.touches.length!==1||e.target.closest('button,input,textarea,select,a,summary'))return;tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
 content.addEventListener('touchend',e=>{if(!tx||e.changedTouches.length!==1)return;const dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;tx=0;ty=0;if(Math.abs(dx)>100&&Math.abs(dx)>Math.abs(dy)*1.7){go(dx<0?1:-1)}},{passive:true});
 setHint(index);draw();startReadingClock();
}
function slideKey(){return active?`${active.index}:${active.phase}`:''}
function isPassed(a,phase){return a.done||!!progress.passed[`${a.index}:${phase}`]}
function isRead(scene){return ['intro','lesson','care','flash','mission','guide'].includes(scene.type)}
function timeRemaining(){if(!active||active.done||!isRead(active.slides[active.phase]))return 0;return Math.max(0,10-Number(progress.readTime[slideKey()]||0))}
function showNote(message){const b=q('#ws-app-note');if(!b)return;b.textContent=message;b.hidden=false;clearTimeout(showNote.t);showNote.t=setTimeout(()=>{if(b)b.hidden=true},3900)}
function startReadingClock(){clearInterval(readingClock);readingClock=setInterval(()=>{if(!active||document.hidden||!isRead(active.slides[active.phase])||active.done)return;const k=slideKey();if((progress.readTime[k]||0)<10){progress.readTime[k]=(progress.readTime[k]||0)+1;save();drawControls()}},1000)}
function renderGuide(scene){
 if(scene.type!=='guide')return;
 const n=Number(progress.guideStep[slideKey()]||0),box=q('.ws-guide-visual',scene.node),btn=q('[data-ws-next-tip]',scene.node);
 if(!box||!btn)return;
 box.hidden=n<1;
 if(n>0){const [icon,title,description]=GUIDE_TIPS[n-1];q('.ws-guide-icon',box).textContent=icon;q('.ws-guide-count',box).textContent=`Dica ${n} de 5`;q('.ws-guide-heading',box).textContent=title;q('.ws-guide-copy',box).textContent=description}
 btn.hidden=n>=5;btn.textContent=n===0?'Ver a primeira dica →':n===4?'Revelar a última dica →':'Próxima dica →';
}
function applyReveals(scene){if(!active||!scene.requiresReveal)return;if(scene.type==='guide'){renderGuide(scene);return}const revealed=active.done||!!progress.revealed[slideKey()];Q('.ws-reveal-target',scene.node).forEach(el=>el.hidden=!revealed);Q('[data-ws-reveal]',scene.node).forEach(b=>b.hidden=revealed)}
function validateLab(scene,{showError=false}={}){
 if(!scene||scene.type!=='lab'||active?.done)return true;
 const area=scene.node,fields=[];let preview='';let done=false;
 if(area.id==='lab-cv'){
  ['cvName','cvCity','cvEmail','cvGoal','cvSchool','cvSkills'].forEach(id=>{const e=q('#'+id,area);if(e&&(!e.value.trim()||(id==='cvEmail'&&!e.checkValidity())))fields.push(e)});
  preview='cvPreview';done=area.dataset.wsGenerated==='true';
 }else if(area.id==='lab-headline'){
  preview='headlinePreview';done=area.dataset.wsGenerated==='true';
 }else if(area.id==='lab-email'){
  ['emailName','emailRole','emailSkill'].forEach(id=>{const e=q('#'+id,area);if(e&&!e.value.trim())fields.push(e)});
  preview='emailPreview';done=area.dataset.wsGenerated==='true';
 }else if(area.id==='plan'){
  done=Q('[data-plan]:checked',area).length>=1;
 }else{done=Q('input,textarea,select',area).every(e=>e.value.trim())}
 if(fields.length||!done){if(showError){showNote(fields.length?'Preencha os campos essenciais para testar seu exemplo. Você pode usar dados fictícios.':area.id==='plan'?'Marque ao menos uma ação para começar seu plano.':'Gere a prévia do laboratório antes de continuar.');if(fields.length)fields[0].focus()}return false}
 return true
}
function handleLabInput(e){if(!active)return;const scene=active.slides[active.phase];if(scene.type!=='lab')return;if(scene.node.id!=='plan')scene.node.dataset.wsGenerated='false';drawControls()}
function handleChoice(e){if(!active)return;const slide=active.slides[active.phase];
 const guide=e.target.closest('[data-ws-next-tip]');if(guide&&slide.type==='guide'){
  const k=slideKey();progress.guideStep[k]=Math.min(5,Number(progress.guideStep[k]||0)+1);if(progress.guideStep[k]===5)progress.revealed[k]=true;
  save();renderGuide(slide);drawControls();return
 }
 const reveal=e.target.closest('[data-ws-reveal]');if(reveal&&slide.requiresReveal){progress.revealed[slideKey()]=true;save();applyReveals(slide);drawControls();return}
 const btn=e.target.closest('[data-ws-answer]');if(btn&&slide.type==='challenge'&&!isPassed(active,active.phase)){
  const chosen=Number(btn.dataset.wsAnswer),c=slide.challenge,box=q('.ws-scenario-feedback',slide.node);Q('[data-ws-answer]',slide.node).forEach(n=>n.classList.remove('ws-correct','ws-wrong'));
  if(chosen===c.correct){btn.classList.add('ws-correct');Q('[data-ws-answer]',slide.node).forEach(n=>n.disabled=true);box.innerHTML=`<strong>✓ Boa escolha!</strong><p>${ESC(c.why)}</p>`;box.className='ws-scenario-feedback ws-positive';progress.passed[slideKey()]=true;save()}
  else{btn.classList.add('ws-wrong');btn.disabled=true;box.innerHTML='<strong>Vale olhar com mais atenção.</strong><p>Compare as consequências de cada atitude e tente outra opção.</p>';box.className='ws-scenario-feedback ws-negative'}
  box.hidden=false;drawControls();return
 }
 const action=e.target.closest('[data-action]')?.dataset.action;
 if(action&&slide.type==='lab'&&['cv-build','headline-build','email-build'].includes(action)){
  // A geração é executada pelo módulo original depois deste manipulador.
  queueMicrotask(()=>{if(!active||active.slides[active.phase]!==slide)return;const requiredOk=slide.node.id==='lab-cv'?['cvName','cvCity','cvEmail','cvGoal','cvSchool','cvSkills'].every(id=>{const el=q('#'+id,slide.node);return !!el?.value.trim()&&(id!=='cvEmail'||el.checkValidity())}):slide.node.id==='lab-email'?['emailName','emailRole','emailSkill'].every(id=>q('#'+id,slide.node)?.value.trim()):true;
   if(requiredOk){slide.node.dataset.wsGenerated='true';showNote('Boa! Seu exemplo foi gerado. Confira o resultado e avance quando quiser.')}else{slide.node.dataset.wsGenerated='false';showNote('Complete os campos essenciais para validar este exercício. Dados fictícios são bem-vindos.')}drawControls()});
 }
}
function drawControls(){if(!active)return;const {slides,phase,done}=active,scene=slides[phase];const prev=q('#ws-app-prev'),next=q('#ws-app-next');prev.disabled=phase===0;
 const missingReveal=scene.requiresReveal&&!done&&!progress.revealed[slideKey()],labMissing=scene.type==='lab'&&!validateLab(scene);
 // Botão continua clicável para mostrar orientação empática de leitura e preenchimento.
 next.disabled=false;
 next.hidden=scene.type==='quiz'||scene.type==='victory';
 const pct=Math.round(Math.min(100,phase/(slides.length-1)*100));q('#ws-app-progress').style.width=pct+'%';q('#ws-app-count').textContent=`${phase+1} / ${slides.length}`;
 let status='Pratique e avance';let hint=isRead(scene)?(timeRemaining()>0?`Leia com calma · ${timeRemaining()}s`:'Leitura concluída ✓'):'Escolha seu próximo passo';
 if(scene.type==='challenge'){status=isPassed(active,phase)?'Decisão concluída ✓':'Você decide';hint=isPassed(active,phase)?'Pode avançar':'Escolha a atitude mais adequada'}
 if(scene.type==='lab'){status=labMissing?'Conclua a atividade':'Laboratório concluído ✓';hint=labMissing?'Preencha e gere o seu exemplo':'Agora você pode avançar'}
 if(scene.type==='guide'){status=missingReveal?'Descubra as 5 dicas':'5 dicas concluídas ✓';hint=missingReveal?'Uma dica por vez':hint}
 if(scene.type==='flash'){status=missingReveal?'Pense antes de revelar':'Curiosidade revelada ✓';hint=missingReveal?'Revele para continuar':hint}
 if(scene.type==='quiz'){status='Desafio da missão';hint='Responda para conquistar XP'}
 if(scene.type==='victory'){status='Medalha conquistada';hint='Escolha seu próximo módulo'}
 q('#ws-app-state').textContent=status;q('#ws-app-substatus').textContent=hint;
 next.innerHTML=phase===slides.length-2?'Última etapa <span aria-hidden="true">→</span>':'Avançar <span aria-hidden="true">→</span>';
}
function draw(){if(!active)return;const {slides,phase,index}=active,scene=slides[phase],box=q('#ws-app-content');if(!box)return;
 if(scene.type==='victory'&&!active.done){active.phase=slides.length-2;return draw()}
 const labels={intro:'INÍCIO',lesson:'APRENDA',care:'DICA DE PERFIL',flash:'CURIOSIDADE',guide:'5 DICAS PRÁTICAS',challenge:'VOCÊ DECIDE',lab:'NA PRÁTICA',mission:'MISSÃO',quiz:'DESAFIO',victory:'CONQUISTA'};
 q('#ws-app-category').textContent=(labels[scene.type]||'MISSÃO')+(scene.kicker?' · '+scene.kicker:'');
 q('.ws-app-card').classList.toggle('ws-mode-quiz',scene.type==='quiz');q('.ws-app-card').classList.toggle('ws-mode-care',scene.type==='care');
 box.replaceChildren(scene.node);box.scrollTop=0;
 scene.node.classList.remove('ws-show-animate');void scene.node.offsetWidth;scene.node.classList.add('ws-show-animate');
 if(scene.requiresReveal)applyReveals(scene);
 if(scene.type==='challenge'&&isPassed(active,phase)){const buttons=Q('[data-ws-answer]',scene.node),feedback=q('.ws-scenario-feedback',scene.node);buttons.forEach((b,i)=>{b.disabled=true;b.classList.toggle('ws-correct',i===scene.challenge.correct)});feedback.hidden=false;feedback.className='ws-scenario-feedback ws-positive';feedback.innerHTML=`<strong>✓ Boa escolha!</strong><p>${ESC(scene.challenge.why)}</p>`}
 if(scene.type==='quiz')scene.node.hidden=false;
 progress.current[index]=phase;save();setHint(index);drawControls();
}
function go(delta){if(!active)return;const {index,phase,slides,done}=active,scene=slides[phase];
 if(delta>0){
  if(scene.type==='challenge'&&!isPassed(active,phase)){showNote('Escolha uma das alternativas e veja a explicação antes de avançar.');return}
  if(scene.requiresReveal&&!done&&!progress.revealed[slideKey()]){showNote('Descubra a próxima parte antes de continuar. Cada detalhe importa!');return}
  if(scene.type==='lab'&&!validateLab(scene,{showError:true})){return}
  if(timeRemaining()>0){showNote(`Dedique mais ${timeRemaining()} segundos a esta ideia. Ela vai ajudar na próxima etapa!`);return}
 }
 if(scene.type==='quiz'&&delta>0)return;
 const n=phase+delta;if(n<0||n>=slides.length||n===slides.length-1&&!done)return;
 if(delta>0)progress.unlocked[index]=Math.max(progress.unlocked[index]||0,n);
 active.phase=n;draw();
}

function showPrivacyTips(){
 let d=document.getElementById('ws-privacy-tips');if(!d){d=document.createElement('dialog');d.id='ws-privacy-tips';d.className='ws-tips-dialog';document.body.append(d)}
 const cards=[['🔒','Escolha o público','Ajuste quem pode ver seus posts, stories e informações de contato.'],['🪪','Crie espaços com objetivos diferentes','Se fizer sentido, use um portfólio para mostrar projetos sem abrir seu perfil pessoal.'],['👤','Revise sua apresentação','Confira foto, biografia e informações visíveis para quem não conhece você.'],['🏷️','Controle marcações','Reveja fotos, marcações e comentários antigos; converse se outras pessoas aparecerem.'],['🧭','Conheça os limites','Uma conta privada ajuda, mas não impede prints e compartilhamentos fora de contexto.']];
 let i=0;function render(){const a=cards[i];d.innerHTML=`<div class="ws-tips-inner"><div class="ws-tips-kicker">DICA ${i+1} DE 5</div><div class="ws-tips-art" aria-hidden="true">${a[0]}</div><h2>${a[1]}</h2><p>${a[2]}</p><button type="button" id="ws-tips-next">${i===4?'Entendi, fechar':'Próxima dica →'}</button></div>`;q('#ws-tips-next',d).onclick=()=>{if(i===4)d.close();else{i++;render()}}}
 render();if(!d.open)d.showModal();
}
window.WSJovensApp={showPrivacyTips};
window.addEventListener('wshub:jovens:modulo-concluido',e=>{if(!active||e.detail?.index!==active.index)return;active.done=true;progress.unlocked[active.index]=active.slides.length-1;active.phase=active.slides.length-1;save();draw()});
function mount(){if(renderLock)return;if(observed&&q('.ws-app-screen')===observed)return;const header=q('.mod-header');if(!header){clearInterval(readingClock);document.documentElement.classList.remove('ws-app-active');active=null;observed=null;const home=q('.hero');if(home&&home!==homeObserved){homeObserved=home;illustrateHome()}return}
 renderLock=true;try{construct()}finally{renderLock=false}
}
new MutationObserver(mount).observe(root,{childList:true});
window.addEventListener('hashchange',()=>setTimeout(mount,0));
window.addEventListener('pagehide',save);
hintShell();mount();
})();
