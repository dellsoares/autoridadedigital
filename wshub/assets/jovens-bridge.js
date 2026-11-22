/* WS Hub · Missão Futuro: autenticação, progresso, feedback obrigatório e certificado. */
(()=>{'use strict';
const API='https://ws-hub-api.dell-soares.workers.dev';
const slug=new URLSearchParams(location.search).get('ref')||'';
if(!/^[a-z0-9][a-z0-9_-]{0,79}$/.test(slug)){location.replace('/wshub/aluno/');return}
let token='';try{token=sessionStorage.getItem('wshub:curso:'+slug+':token')||localStorage.getItem('wshub:aluno:'+slug+':token')||''}catch(_e){}
if(!token){location.replace('/wshub/aluno/?ref='+encodeURIComponent(slug));return}
let student=null,course=null,modal=null,submitBusy=false;
const avatar='/wshub/assets/avatar-curso-jovens.webp';
async function request(path,method='GET',body){
 const r=await fetch(API+path,{method,cache:'no-store',headers:{'Authorization':'Bearer '+token,...(body!==undefined?{'Content-Type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});
 const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.erro||'Não foi possível comunicar com o WS Hub.');return d;
}
const apiAction=(action)=>'/api/publico/inscricoes/'+encodeURIComponent(slug)+'/'+action;
const no=()=>{location.replace('/wshub/aluno/?ref='+encodeURIComponent(slug))};
const ESC=s=>String(s||'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
function dialog(id,body){const d=document.createElement('dialog');d.className='ws-jovens-dialog';d.id=id;d.innerHTML='<div class="ws-jovens-modal">'+body+'</div>';document.body.append(d);return d;}
function open(d){if(!d)return;if(!d.open){try{d.showModal()}catch(_){d.setAttribute('open','')}}}
function close(d){if(!d)return;if(d.open){try{d.close()}catch(_){d.removeAttribute('open')}}}
const name=()=>student?.nome||'aluno';
function welcome(){
 const key='wshub:jovens:boas-vindas:v2:'+slug+':'+name();
 if(sessionStorage.getItem(key))return;
 const d=dialog('ws-jovens-boas-vindas',
 `<img class="ws-jovens-logo" src="${avatar}" alt="Avatar da formação"><div class="ws-kicker">WS Hub · CVB-MG Júnior</div><h2>Olá, aluno.</h2>
 <p>Esse curso é um brinde, intermediado por um pedido do instrutor da CVB-MG Júnior e seu compromisso com a formação de jovens aprendizes.</p>
 <p>Espero que curtam e lembrem: <strong>conhecimento compartilhado é mais conhecimento.</strong></p>
 <p><strong>Bem-vindo à sua jornada.</strong></p><p class="ws-jovens-status">Currículo e mídias digitais para jovens · 7 módulos · 2 horas</p>
 <button type="button" class="ws-btn" id="ws-boas-vindas-iniciar">Começar minha jornada</button>`);
 d.querySelector('button').addEventListener('click',()=>{sessionStorage.setItem(key,'1');close(d)});
 open(d);
}
const QUESTIONS=[
 ['A formação ajudou você a compreender o tema?',['Muito','Em parte','Pouco']],
 ['Os exemplos servem para a sua rotina?',['Sim','Em parte','Não']],
 ['Como foi a clareza do material?',['Excelente','Adequada','Pode melhorar']],
 ['Quando pretende colocar algo em prática?',['Imediatamente','Em breve','Ainda não sei']]
];
function ensureFeedback(){
 if(modal)return modal;
 let fields='';QUESTIONS.forEach(([t,options],i)=>{fields+=`<fieldset class="ws-jovens-q"><legend>${i+1}. ${ESC(t)}</legend>`+options.map(o=>`<label><input type="radio" name="q${i}" value="${ESC(o)}" required> ${ESC(o)}</label>`).join('')+'</fieldset>'});
 fields+=`<fieldset class="ws-jovens-q"><legend>5. De 1 a 10, que nota você dá a esta formação?</legend><div class="ws-jovens-score">${Array.from({length:10},(_,i)=>`<label><input type="radio" name="nota" value="${i+1}" required> ${i+1}</label>`).join('')}</div></fieldset>`;
 modal=dialog('ws-jovens-feedback',`<img class="ws-jovens-logo" src="${avatar}" alt="Avatar da formação"><div class="ws-kicker">WS Hub · Jornada concluída</div><h2>Você completou sua jornada!</h2>
 <p>Agora é só tirar um minuto pra avaliar o que achou do curso e <strong>seu certificado será emitido.</strong></p><p class="ws-jovens-status">São cinco perguntas rápidas. Suas respostas serão utilizadas para aprimorar a formação. Não há cupom nem oferta comercial.</p>
 <form id="ws-jovens-feedback-form">${fields}<p class="ws-jovens-error" role="alert" hidden></p><div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:19px"><button type="submit" class="ws-btn">Enviar avaliação e emitir certificado</button><button type="button" id="ws-jovens-later" class="button clear">Voltar às aulas</button></div></form>`);
 const f=modal.querySelector('form');
 modal.querySelector('#ws-jovens-later').addEventListener('click',()=>close(modal));
 f.addEventListener('submit',async ev=>{ev.preventDefault();if(submitBusy)return;
   const values=QUESTIONS.map((_q,i)=>f.querySelector('input[name="q'+i+'"]:checked')?.value||'');
   const score=Number(f.querySelector('input[name="nota"]:checked')?.value||0);
   const err=f.querySelector('.ws-jovens-error');
   if(values.some(v=>!v)||score<1||score>10){err.hidden=false;err.textContent='Responda às cinco perguntas.';return}
   submitBusy=true;const btn=f.querySelector('button[type="submit"]');btn.disabled=true;err.hidden=true;
   try{
     await request(apiAction('feedback-final'),'POST',{respostas:values,nota:score});
     await refresh();close(modal);await issue();
   }catch(e){err.hidden=false;err.textContent=e.message||'Erro ao registrar avaliação. Tente novamente.'}
   finally{btn.disabled=false;submitBusy=false}
 });
 return modal;
}
async function ensureTemplate(){
 if(window.WSHubCertTemplate)return window.WSHubCertTemplate;
 await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='/wshub/assets/certificado-template.js?v=3';s.onload=resolve;s.onerror=()=>reject(Error('Modelo de certificado indisponível'));document.head.append(s)});
 if(!window.WSHubCertTemplate)throw Error('Modelo de certificado indisponível');return window.WSHubCertTemplate;
}
const btn=document.createElement('button');btn.type='button';btn.className='ws-jovens-cta';btn.hidden=true;btn.textContent='Meu certificado';document.body.append(btn);
async function issue(){
 btn.disabled=true;btn.textContent='Preparando certificado…';
 try{
   const d=await request(apiAction('certificado'),'POST',{});
   const t=await ensureTemplate();await t.print(d.certificado,d.certificado.participante);
   btn.textContent='Reimprimir certificado';student.certificadoEmitido=true;student.feedbackConcluido=true;
 }catch(e){btn.textContent='Emitir certificado';alert(e.message||'Não foi possível emitir. Tente novamente.');throw e}
 finally{btn.disabled=false}
}
btn.addEventListener('click',()=>{
 if(!student)return;
 if(!student.feedbackConcluido){open(ensureFeedback());return}
 issue().catch(()=>{});
});
function syncButtons(){
 if(!student)return;
 const completed=(student.aulasConcluidas||[]).length>=7;
 btn.hidden=!completed;
 btn.textContent=student.certificadoEmitido?'Reimprimir certificado':student.feedbackConcluido?'Gerar certificado (PDF)':'Avaliar e emitir certificado';
}
async function refresh(){
 const d=await request(apiAction('aluno'));
 student=d.aluno;
 syncButtons();
 return student;
}
async function init(){
 try{
  const [courseD,studentD]=await Promise.all([
   request('/api/publico/formacoes/'+encodeURIComponent(slug)),request(apiAction('aluno'))
  ]);
  course=courseD.formacao;student=studentD.aluno;
  if(course.experiencia!=='jovens'||course.inscricaoIndividual?.tipo!=='online')throw Error('Esta formação não está vinculada ao ambiente dos jovens.');
  document.documentElement.classList.add('ws-jovens-ready');
  window.dispatchEvent(new CustomEvent('wshub:jovens:sync',{detail:{completed:student.aulasConcluidas||[],userKey:student.email||''}}));
  syncButtons();
  welcome();
  if((student.aulasConcluidas||[]).length===7&&!student.feedbackConcluido){
   // Se a saudação ainda estiver aberta, aguarde-a ser fechada para a avaliação.
   const dlg=document.getElementById('ws-jovens-boas-vindas');
   if(dlg?.open)dlg.addEventListener('close',()=>open(ensureFeedback()),{once:true});
   else open(ensureFeedback());
  }
 }catch(err){console.error('WS Hub Jovens:',err);no()}
}
window.WSJovensBridge={slug,
 async saveModule(index){if(!student)throw Error('Carregando inscrição. Tente novamente.');
  const d=await request(apiAction('progresso'),'POST',{indice:index});
  if(d.ok){await refresh();window.dispatchEvent(new CustomEvent('wshub:jovens:salvo'));}return d;
 },
 async completed(){await refresh();if((student.aulasConcluidas||[]).length===7&&!student.feedbackConcluido)open(ensureFeedback());}
};
init();
})();
