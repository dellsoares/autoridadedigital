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
 const key='wshub:jovens:boas-vindas:v3:'+slug+':'+name();
 if(sessionStorage.getItem(key))return;
 const d=dialog('ws-jovens-boas-vindas',
 `<section class="ws-intro-content">
 <div class="ws-intro-kicker">WS Hub · Formação exclusiva</div>
 <div class="ws-intro-brand"><img src="/wshub/assets/logo-wendell-soares.png" width="53" height="53" alt="Marca WS Hub"><span><strong>WS <em>Hub</em></strong><small>Conhecimento, tecnologia e propósito.</small></span></div>
 <h2>Olá, aluno.</h2>
 <p>Esse curso é um brinde, intermediado por um pedido do instrutor da CVB-MG Júnior e seu compromisso com a formação de jovens aprendizes.</p>
 <p>Espero que curtam e lembrem: <strong>conhecimento compartilhado é mais conhecimento.</strong></p>
 <p><strong>Bem-vindo à sua jornada.</strong></p>
 <div class="ws-intro-insight"><img class="ws-intro-major-avatar" src="/assets/major-h/major-h-avatar.webp" alt="Major H" width="52" height="52" loading="eager"><div class="ws-intro-major-copy"><strong>Major H · Antes de começar</strong><span>Você pode avançar no seu ritmo. Cada etapa traz uma dica e uma atividade para aplicar o que aprendeu.</span></div></div>
 <button type="button" class="ws-btn" id="ws-boas-vindas-iniciar">Começar minha jornada</button>
 </section>
 <figure class="ws-intro-photo" aria-label="Wendell Soares apresentando a identidade visual do curso"><img class="ws-intro-presenter" src="/wshub/aluno/naboa/assets/wendell-recorte-original.png" width="765" height="1024" loading="eager" alt="Wendell Soares em sua fotografia original com a mão aberta"><img class="ws-intro-client-logo" src="${avatar}" alt="Avatar original do curso dos jovens, apresentado acima das mãos"></figure>`);
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
     await refresh();close(modal);openCertificateName();
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
let nameDialog=null,printing=false;
function openCertificateName(){if(!student)return;if(!student.feedbackConcluido){open(ensureFeedback());return}
 if(nameDialog){const i=nameDialog.querySelector('#ws-cert-student');if(i)i.value=student.nome||'';open(nameDialog);return}
 nameDialog=dialog('ws-jovens-cert-nome',`<h2>🎓 Seu certificado</h2><p>Antes de emitir, confira o nome que consta na sua inscrição. O documento oficial utilizará os dados validados pelo WS Hub.</p><form id="ws-cert-name-form"><label for="ws-cert-student"><strong>Nome para o certificado</strong></label><input id="ws-cert-student" name="nome" type="text" autocomplete="name" required maxlength="120" value="${ESC(student.nome||'')}"><p class="small">Se o nome cadastrado estiver incorreto, solicite a atualização no portal antes de emitir.</p><p class="ws-jovens-error" id="ws-cert-error" role="alert" hidden></p><div class="button-row"><button class="ws-btn" type="submit">Abrir o modelo do certificado</button><button type="button" class="button clear" id="ws-cert-cancel">Voltar</button></div></form>`);
 nameDialog.querySelector('#ws-cert-cancel').addEventListener('click',()=>close(nameDialog));
 nameDialog.querySelector('form').addEventListener('submit',async e=>{e.preventDefault();if(printing)return;const entered=nameDialog.querySelector('input').value.trim().replace(/\s+/g,' ');const registered=(student.nome||'').trim().replace(/\s+/g,' ');const err=nameDialog.querySelector('#ws-cert-error');if(entered.length<3){err.textContent='Confira seu nome antes de continuar.';err.hidden=false;return}if(registered&&entered.toLocaleLowerCase('pt-BR')!==registered.toLocaleLowerCase('pt-BR')){err.textContent='O nome precisa ser igual ao cadastro. Para corrigir, atualize a inscrição com a equipe responsável.';err.hidden=false;return}err.hidden=true;close(nameDialog);try{await issue()}catch(_){}});open(nameDialog);
}
async function issue(){if(printing)return;printing=true;btn.disabled=true;btn.textContent='Preparando certificado…';
 try{const t=await ensureTemplate();if(typeof t.print!=='function')throw Error('O modelo publicado não oferece a emissão do certificado.');
 const d=await request(apiAction('certificado'),'POST',{});
 if(!d.certificado)throw Error('O WS Hub não retornou os dados do certificado.');
 document.documentElement.classList.add('ws-cert-printing');
 const stop=()=>document.documentElement.classList.remove('ws-cert-printing');
 window.addEventListener('afterprint',stop,{once:true});setTimeout(stop,12000);
 await t.print(d.certificado,d.certificado.participante);
 student.certificadoEmitido=true;student.feedbackConcluido=true;btn.textContent='Abrir certificado';
 }catch(e){document.documentElement.classList.remove('ws-cert-printing');btn.textContent='Abrir certificado';alert(e.message||'Não foi possível gerar o certificado. Tente novamente.');throw e}
 finally{btn.disabled=false;printing=false}
}
btn.addEventListener('click',()=>openCertificateName());
function syncButtons(){
 if(!student)return;
 const completed=(student.aulasConcluidas||[]).length>=7;
 btn.hidden=!completed;
 btn.textContent=student.feedbackConcluido?'Abrir certificado oficial':'Avaliar e liberar certificado';
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
 async completed(){await refresh();if((student.aulasConcluidas||[]).length===7&&!student.feedbackConcluido)open(ensureFeedback());},
 openCertificate(){openCertificateName();}
};
init();
})();
