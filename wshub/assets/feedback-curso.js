/* WS Hub · Pesquisa após conclusão (5 respostas, facultativa, uma vez por curso/aparelho).
   O cupom é assinado no Cloudflare e só aparece após confirmação do envio. */
(()=>{'use strict';
if(window.__WSHUB_FEEDBACK_CURSO__)return;window.__WSHUB_FEEDBACK_CURSO__=true;
const API='https://ws-hub-api.dell-soares.workers.dev';
const css=document.createElement('link');css.rel='stylesheet';css.href='/wshub/assets/feedback-curso.css?v=1';document.head.append(css);
const curso=()=>window.VOZ_ATIVA_CURSO?.slug|| (document.getElementById('progress-label')?'naboa':new URLSearchParams(location.search).get('ref')||'');
const $=id=>document.getElementById(id);
const QUESTIONS=[
 ['A formação ajudou você a compreender o tema?',['Muito','Em parte','Pouco']],
 ['Os exemplos servem para a sua rotina?',['Sim','Em parte','Não']],
 ['Como foi a clareza do material?',['Excelente','Adequada','Pode melhorar']],
 ['Quando pretende colocar algo em prática?',['Imediatamente','Em breve','Ainda não sei']]
];
function safeStorage(){try{return localStorage}catch{return {getItem:()=>null,setItem:()=>{}}}}
const store=safeStorage();
const dialog=document.createElement('dialog');dialog.className='ws-fb-dialog';dialog.id='ws-feedback-curso';
dialog.setAttribute('aria-label','Feedback da formação');
dialog.innerHTML=`<div class="ws-fb-card"><div class="ws-fb-head"><img src="/assets/major-h/major-h-avatar.webp" alt="Avatar circular do Major H"><div><small>WS Hub · Major H</small><h2>Sua opinião ajuda a melhorar</h2></div><button type="button" class="ws-fb-dismiss" aria-label="Recusar feedback e não perguntar novamente">×</button></div>
<div class="ws-fb-body"><p class="ws-fb-lead">Parabéns por concluir sua formação! Você pode responder <strong>cinco perguntas rápidas</strong> (cerca de um minuto). Ao enviar, ganha o cupom <strong>SOARES</strong>, válido por 30 dias para solicitar desconto em qualquer proposta do WS Hub.</p>
<form id="ws-feedback-form"><div class="ws-fb-fields"></div><fieldset class="ws-fb-q"><legend>5. De 1 a 10, que nota você dá a esta formação?</legend><div class="ws-fb-scores"></div></fieldset><p class="ws-fb-error" role="alert" hidden></p><div class="ws-fb-buttons"><button type="button" class="ws-fb-no">Agora não</button><button type="submit" class="ws-fb-send">Enviar feedback</button></div></form><div class="ws-fb-success" hidden><strong>Obrigado por contribuir!</strong><p>Seu feedback foi recebido. Seu cupom é <b>SOARES</b>, válido por 30 dias a partir de agora. Guarde-o para uma próxima proposta.</p><div class="ws-fb-code">SOARES</div><p class="ws-fb-expiry"></p><p>Para usar em outro aparelho, guarde o link do benefício. O código sozinho não comprova a validade.</p><button type="button" class="ws-fb-copy">Copiar cupom</button><button type="button" class="ws-fb-link">Copiar link do benefício</button><button type="button" class="ws-fb-finish">Concluir</button></div>
<p class="ws-fb-privacy">Participação opcional. Não solicitamos nome, telefone nem dados pessoais nesta pesquisa.</p></div></div>`;
document.body.append(dialog);
const fields=dialog.querySelector('.ws-fb-fields');
QUESTIONS.forEach(([title,answers],idx)=>{
 const fs=document.createElement('fieldset');fs.className='ws-fb-q';
 const leg=document.createElement('legend');leg.textContent=(idx+1)+'. '+title;fs.append(leg);
 const opts=document.createElement('div');opts.className='ws-fb-options';
 answers.forEach((answer,j)=>{
 const label=document.createElement('label'),input=document.createElement('input');
 input.type='radio';input.name='q'+idx;input.value=answer;input.required=j===0;
 label.append(input,document.createTextNode(answer));opts.append(label)
 });fs.append(opts);fields.append(fs);
});
for(let score=1;score<=10;score++){
 const label=document.createElement('label'),input=document.createElement('input');
 input.type='radio';input.name='nota';input.value=String(score);input.required=score===1;
 label.append(input,document.createTextNode(String(score)));dialog.querySelector('.ws-fb-scores').append(label);
}
const form=$('ws-feedback-form'),error=dialog.querySelector('.ws-fb-error');
let generatedVoucher='';
let shown=false,submitBusy=false;
function close(){if(dialog.open)dialog.close();else dialog.removeAttribute('open')}
function refuse(){const slug=curso();if(slug)store.setItem('wshub:feedback:v1:'+slug,'recusado');close()}
dialog.querySelector('.ws-fb-dismiss').addEventListener('click',refuse);
dialog.querySelector('.ws-fb-no').addEventListener('click',refuse);
dialog.addEventListener('cancel',e=>{e.preventDefault();refuse()});
dialog.addEventListener('click',e=>{if(e.target===dialog)refuse()});
dialog.querySelector('.ws-fb-finish').addEventListener('click',close);
dialog.querySelector('.ws-fb-copy').addEventListener('click',()=>{
 const value='SOARES';navigator.clipboard?.writeText(value).then(()=>{dialog.querySelector('.ws-fb-copy').textContent='Copiado!';}).catch(()=>{});
});
dialog.querySelector('.ws-fb-link').addEventListener('click',()=>{
 if(!generatedVoucher)return;const url='https://wendellsoares.jor.br/wshub/propostas/?cupom='+encodeURIComponent(generatedVoucher);
 navigator.clipboard?.writeText(url).then(()=>{dialog.querySelector('.ws-fb-link').textContent='Link copiado!'}).catch(()=>{});
});
function courseToken(slug){try{return sessionStorage.getItem('wshub:curso:'+slug+':token')||''}catch{return ''}}
form.addEventListener('submit',async e=>{
 e.preventDefault();if(submitBusy)return;
 const slug=curso(),ans=QUESTIONS.map((_,idx)=>form.querySelector('input[name="q'+idx+'"]:checked')?.value),nota=Number(form.querySelector('input[name="nota"]:checked')?.value);
 if(!slug||ans.some(x=>!x)||!Number.isInteger(nota)||nota<1||nota>10){error.hidden=false;error.textContent='Responda as cinco perguntas para enviar.';return}
 const token=courseToken(slug);if(!token && slug!=='naboa'){error.hidden=false;error.textContent='Sua sessão expirou. Entre novamente na área do aluno.';return}
 submitBusy=true;const btn=dialog.querySelector('.ws-fb-send');btn.disabled=true;btn.textContent='Enviando…';error.hidden=true;
 try{
   const body={slug,respostas:ans,nota};if(slug==='naboa'&&!token)body.codigo='VOLUNTARIADO';
   const res=await fetch(API+'/api/publico/feedback',{method:'POST',mode:'cors',cache:'no-store',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:JSON.stringify(body)});
   const out=await res.json().catch(()=>({}));if(!res.ok||!out.cupom?.token)throw Error(out.erro||'Não foi possível registrar.');
   store.setItem('wshub:feedback:v1:'+slug,'enviado');
   store.setItem('wshub:cupom:soares:v1',JSON.stringify({codigo:'SOARES',token:out.cupom.token,expiraEm:out.cupom.expiraEm}));
   generatedVoucher=out.cupom.token;
   const date=new Date(out.cupom.expiraEm);
   dialog.querySelector('.ws-fb-expiry').textContent='Validade: até '+date.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'})+' (horário do seu aparelho).';
   form.hidden=true;dialog.querySelector('.ws-fb-lead').hidden=true;dialog.querySelector('.ws-fb-success').hidden=false;
 }catch(err){error.hidden=false;error.textContent=(err.message||'Falha de conexão')+' Você pode tentar novamente.';}
 finally{submitBusy=false;btn.disabled=false;btn.textContent='Enviar feedback'}
});
function isCompleted(){
 const element=$('progress-label')||$('progress-text');if(!element)return false;
 const matched=/\b(\d+)\s+de\s+(\d+)\b/i.exec(element.textContent||'');
 if(!matched)return false;const done=Number(matched[1]),total=Number(matched[2]);return total>0 && done>=total;
}
function isLoggedIn(){const a=$('app'),c=$('course'),g=$('gate');return (!a||!a.hidden)&&(!c||!c.hidden)&&(!g||g.hidden)}
function check(){
 const slug=curso();if(!slug||shown||store.getItem('wshub:feedback:v1:'+slug)||!isLoggedIn()||!isCompleted())return;
 if(document.querySelector('dialog[open]'))return;
 shown=true;store.setItem('wshub:feedback:v1:'+slug,'visto');
 if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
}
const progress=$('progress-label')||$('progress-text');
if(progress)new MutationObserver(check).observe(progress,{childList:true,subtree:true,characterData:true});
for(const el of [$('app'),$('course'),$('gate')])if(el)new MutationObserver(check).observe(el,{attributes:true,attributeFilter:['hidden']});
window.addEventListener('focus',check);
setTimeout(check,800);document.addEventListener('click',()=>setTimeout(check,300),true);
})();
