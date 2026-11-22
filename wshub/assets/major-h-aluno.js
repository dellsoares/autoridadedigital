/* WS Hub · Major H assessor de aprendizagem; sem API paga, sem mensagens invasivas.
   Inclusão genérica em todos os portais de aluno: NABOA, Voz Ativa e cursos futuros. */
(()=>{'use strict';
if(window.__WS_MAJOR_ALUNO__)return;
window.__WS_MAJOR_ALUNO__=true;
const AVATAR='/assets/major-h/major-h-avatar.webp';
const EXPRESSIONS={inicio:'major-h-avatar.webp',dica:'major-h-confident.webp',desafio:'major-h-thinking.webp',conclusao:'major-h-happy.webp'};
const ASSET_ROOT='/assets/major-h/';
const $=s=>document.querySelector(s);
const old=$('.major');
// O portal genérico e o Voz Ativa possuem componentes anteriores, sem o novo avatar.
// Mantemos os handlers legados para não interferir no curso e ocultamos apenas a interface.
if(old)old.style.setProperty('display','none','important');
const root=document.createElement('aside');root.id='ws-major-aluno';root.setAttribute('aria-label','Major H, assessor da formação');
root.innerHTML=`<section class="wma-panel" id="wma-panel" role="dialog" aria-label="Orientações didáticas do Major H" hidden>
  <header class="wma-head"><img src="${AVATAR}" alt="Major H"><div><strong>Major H</strong><small>Assessor de aprendizagem</small></div><button type="button" class="wma-close" aria-label="Fechar orientações">×</button></header>
  <div class="wma-content"><div class="wma-label" id="wma-label">Orientação do momento</div><div class="wma-bubble" id="wma-bubble" aria-live="polite"></div><p class="wma-prompt" id="wma-prompt"></p><div class="wma-actions"><button type="button" data-mode="dica" aria-pressed="true">Dica</button><button type="button" data-mode="desafio" aria-pressed="false">Desafio</button><button type="button" data-mode="conclusao" aria-pressed="false">Checklist</button></div></div>
  <footer class="wma-footer">Major H · Orientações didáticas, sem coleta de dados <span class="wma-xp" id="wma-xp"></span></footer></section>
<button type="button" class="wma-launch" aria-label="Abrir assessor Major H" aria-expanded="false" aria-controls="wma-panel" title="Major H — Dicas desta aula"><img src="${AVATAR}" alt="Major H"></button>`;
document.body.append(root);
const launch=root.querySelector('.wma-launch'),panel=root.querySelector('.wma-panel'),close=root.querySelector('.wma-close');
const bubble=root.querySelector('#wma-bubble'),label=root.querySelector('#wma-label'),prompt=root.querySelector('#wma-prompt');
let mode='dica',opened=false;
function current(){
 const v=window.VOZ_ATIVA_CURSO;
 if(v?.aulas?.length){const sel=$('#course-nav button.current'),buttons=[...document.querySelectorAll('#course-nav button[data-lesson]')];const index=buttons.indexOf(sel);return {type:'voz',lesson:v.aulas[Math.max(0,index)],position:Math.max(0,index),total:v.aulas.length};}
 // NABOA: há intervenções na primeira aula de cada módulo, já exibidas no corpo.
 if($('#major-lesson-slot') || $('#lesson-article')){
   const title=$('#lesson-title')?.textContent?.trim()||'Sua formação';
   const present=$('#major-lesson-slot details p')?.textContent?.trim();
   const isEnd=title.toLocaleLowerCase('pt-BR').includes('conclus');
   return {type:'naboa',title,tip:present||'',isEnd};
 }
 const title=$('#lesson-title')?.textContent?.trim()||$('#course-title')?.textContent?.trim()||'Sua formação';
 return {type:'generic',title};
}
function copy(kind,rec){
 if(rec.type==='voz'&&rec.lesson){
   const l=rec.lesson;
   if(kind==='dica')return {text:l.major||l.lead,sub:`Módulo ${rec.position+1} de ${rec.total} · ${l.titulo}`};
   if(kind==='desafio')return {text:`Antes de marcar esta aula como concluída, responda ao exercício: ${l.exercicio?.titulo||'aplique o conteúdo à sua realidade'}.\n\n${l.exercicio?.descricao||'Registre uma aplicação prática.'}`,sub:'Anote no laboratório desta aula e confira o modelo comentado.'};
   return {text:'Confira se seu título é fiel aos fatos, se as fontes estão identificadas, se você fez a atividade e se consegue explicar sua escolha a outra pessoa.',sub:'Use o desafio interativo da aula e salve suas anotações.'};
 }
 if(rec.type==='naboa'){
   if(kind==='dica')return {text:rec.tip||'Na aplicação de inteligência artificial, preserve a responsabilidade editorial. Uma resposta pronta não substitui a verificação das fontes.',sub:`Aula atual · ${rec.title}`};
   if(kind==='desafio')return {text:`Escolha um exemplo da aula “${rec.title}” e adapte à rotina do seu trabalho. Qual fonte você consultaria para validar a resposta?`,sub:'Registre em sua atividade e avalie os limites do recurso.'};
   return {text:rec.isEnd?'Revise suas notas, exporte seu caderno e escolha uma melhoria viável para aplicar nos próximos dias.':'Antes de avançar: entendi o conceito? Testei? Conferi os fatos? Registrei o que funcionou?',sub:'As intervenções específicas continuam dentro das aulas.'};
 }
 if(kind==='dica')return {text:'Comece pelos objetivos da aula e anote uma ideia que você consiga aplicar. Leia o exemplo e confira suas fontes.',sub:rec.title};
 if(kind==='desafio')return {text:`Como você aplicaria “${rec.title}” a um caso concreto da sua realidade? Registre sua resposta nas anotações.`,sub:'A atividade deve ser resolvida por você, não pelo assistente.'};
 return {text:'Revise o conteúdo, salve suas anotações, verifique as fontes e marque a conclusão da aula quando estiver seguro.',sub:'O aprendizado acontece uma etapa por vez.'};
}
function refresh(){const r=current(),d=copy(mode,r);label.textContent=mode==='dica'?'Major H · Uma orientação':mode==='desafio'?'Major H · Experimente':'Major H · Antes de avançar';bubble.textContent=d.text;prompt.textContent=d.sub;
 const img=root.querySelector('.wma-head img');if(img)img.src=ASSET_ROOT+(EXPRESSIONS[mode]||EXPRESSIONS.inicio);
 root.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
 try{if(r.type==='voz'){const v=window.VOZ_ATIVA_CURSO;const count=v.aulas.filter(a=>JSON.parse(localStorage.getItem('wshub:voz-ativa:missao:'+a.id)||'null')?.acertou).length;root.querySelector('#wma-xp').textContent=` · ${count}/${v.aulas.length} missões resolvidas`;}}catch(_){/* storage indisponível */}}
function visible(){if($('#app')?.hidden)return false;if($('#course')?.hidden)return false;if($('#gate')&&!$('#gate').hidden)return false;return true;}
function sync(){root.hidden=!visible();if(opened)refresh();}
function toggle(v){opened=v;panel.hidden=!opened;launch.setAttribute('aria-expanded',String(opened));if(opened){refresh();close.focus()}else launch.focus()}
launch.addEventListener('click',()=>toggle(!opened));close.addEventListener('click',()=>toggle(false));
root.querySelectorAll('[data-mode]').forEach(btn=>btn.addEventListener('click',()=>{mode=btn.dataset.mode;refresh()}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened)toggle(false)});
document.addEventListener('click',e=>{if(opened&&!root.contains(e.target))toggle(false)},true);
const app=$('#app'),course=$('#course'),gate=$('#gate');
for(const node of [app,course,gate])if(node){new MutationObserver(sync).observe(node,{attributes:true,attributeFilter:['hidden']});}
const nav=$('#course-nav')||$('#module-nav')||$('#lesson-nav');if(nav)new MutationObserver(()=>{if(opened)refresh()}).observe(nav,{childList:true,subtree:true});
const lessonTitle=$('#lesson-title');if(lessonTitle)new MutationObserver(()=>{if(opened)refresh()}).observe(lessonTitle,{childList:true,characterData:true,subtree:true});
window.addEventListener('ws:major-aluno-update',()=>{if(opened)refresh()});
sync();
})();
