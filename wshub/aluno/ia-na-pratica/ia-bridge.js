/* WS Hub · Integração com inscrições online, progresso, feedback e certificado oficiais.
   A API do WS Hub é a fonte de verdade para conclusões; somente o servidor emite certificados. */
(()=>{'use strict';
const API='https://ws-hub-api.dell-soares.workers.dev';
const slug=new URLSearchParams(location.search).get('ref')||'ia-na-pratica';
const loginUrl='/wshub/aluno/?ref='+encodeURIComponent(slug);
const pattern=/^[a-z0-9][a-z0-9_-]{0,79}$/;
let token='',student=null,course=null;
try{token=sessionStorage.getItem('wshub:curso:'+slug+':token')||localStorage.getItem('wshub:aluno:'+slug+':token')||''}catch(_){}
const endpoint=(action)=>'/api/publico/inscricoes/'+encodeURIComponent(slug)+'/'+action;
if(!pattern.test(slug)||slug!=='ia-na-pratica'||!token){location.replace(loginUrl);return}
async function request(path,method='GET',body){
 let r;
 try{r=await fetch(API+path,{method,cache:'no-store',headers:{Authorization:'Bearer '+token,...(body===undefined?{}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:JSON.stringify(body)})})}
 catch(_){throw Error('Falha de conexão. Verifique sua internet e tente novamente.')}
 let d={};try{d=await r.json()}catch(_){}
 if(r.status===401||r.status===403){location.replace(loginUrl);throw Error('Sua sessão expirou. Entre novamente pelo portal do aluno.')}
 if(!r.ok)throw Error(d.erro||'O WS Hub não conseguiu concluir a solicitação ('+r.status+').');
 return d;
}
async function refresh(){const d=await request(endpoint('aluno'));student=d.aluno;if(!student)throw Error('Não foi possível localizar sua inscrição.');return student}
const ready=(async()=>{
 const [c,s]=await Promise.all([request('/api/publico/formacoes/'+encodeURIComponent(slug)),request(endpoint('aluno'))]);
 course=c.formacao;student=s.aluno;
 if(!course||course.experiencia!=='jovens'||course.inscricaoIndividual?.tipo!=='online')throw Error('A formação IA na Prática ainda não está vinculada como curso online no WS Hub.');
 if(Number.isFinite(Number(student?.totalAulas))&&student?.totalAulas!=null&&Number(student.totalAulas)!==7)throw Error('A formação precisa ter sete aulas cadastradas no WS Hub.');
 if(!student)throw Error('Inscrição individual não localizada.');
 return {student,course};
})();
window.WSIA={slug,ready,
 get status(){return {student,course,completeCount:Array.isArray(student?.aulasConcluidas)?student.aulasConcluidas.length:0,feedbackConcluido:!!student?.feedbackConcluido,certificadoEmitido:!!student?.certificadoEmitido,podeEmitir:!!student?.podeEmitir}},
 async refresh(){return refresh()},
 async saveModule(index){
  if(!Number.isInteger(index)||index<0||index>6)throw Error('Índice da missão inválido.');
  const d=await request(endpoint('progresso'),'POST',{indice:index});
  if(!d.ok)throw Error('A conclusão não foi confirmada pelo WS Hub.');
  await refresh();return d;
 },
 async feedback(answers,score){
  if(!Array.isArray(answers)||answers.length!==4||answers.some(a=>typeof a!=='string'||!a.trim())||!Number.isInteger(score)||score<1||score>10)throw Error('Preencha a avaliação final.');
  await request(endpoint('feedback-final'),'POST',{respostas:answers,nota:score});
  await refresh();
 },
 async emitirCertificado(){
  await refresh();
  if((student.aulasConcluidas||[]).length<7)throw Error('Conclua todas as sete missões para solicitar o certificado.');
  if(!student.feedbackConcluido)throw Error('Responda à avaliação do curso antes de emitir o certificado.');
  const d=await request(endpoint('certificado'),'POST',{});
  if(!d.certificado)throw Error('O servidor não devolveu os dados do certificado.');
  let tpl=window.WSHubCertTemplate;
  if(!tpl){await new Promise((resolve,reject)=>{const s=document.createElement('script');s.src='/wshub/assets/certificado-template.js?v=3';s.onload=resolve;s.onerror=()=>reject(Error('Modelo oficial de certificado indisponível.'));document.head.append(s)});tpl=window.WSHubCertTemplate}
  if(!tpl?.print)throw Error('Modelo oficial de certificado indisponível.');
  await tpl.print(d.certificado,d.certificado.participante);
  await refresh();return d;
 }
};
})();
