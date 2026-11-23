/* Vincula uma formação previamente criada, sem alterar outros cursos. */
(()=>{'use strict';
const API='https://ws-hub-api.dell-soares.workers.dev',AUTH='wshub-admin-token-session-v1',SLUG='ia-na-pratica';
const $=id=>document.getElementById(id);
const modules=[
 ['A IA já faz parte da sua vida','Fundamentos, erros e verificação de respostas'],
 ['Converse com a IA como um profissional','Contexto, objetivos, critérios e revisão de instruções'],
 ['Estude melhor, sem terceirizar seu cérebro','Tutor socrático, revisão, fontes e autonomia'],
 ['Seu primeiro emprego com ajuda da IA','Comunicação profissional, tarefas e entrevistas'],
 ['Qual IA usar para cada necessidade?','Dez ferramentas, funções, limites e plano gratuito'],
 ['LGPD, ética e os perigos que ninguém conta','Privacidade, integridade e verificação de dados'],
 ['Desafio final: agora é com você','Aplicação autônoma, reflexão e conclusão']
];
let token='',course=null;
try{token=sessionStorage.getItem(AUTH)||''}catch(_){}
const status=(msg,bad=false)=>{const s=$('status');s.textContent=msg;s.classList.toggle('bad',bad)};
async function call(path,method='GET',body){const r=await fetch(API+path,{method,cache:'no-store',headers:{Authorization:'Bearer '+token,...(body!==undefined?{'Content-Type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.erro||'Falha no WS Hub ('+r.status+').');return d}
const link=(id,url)=>{const a=$(id);a.href=url;a.textContent=url};
function display(){const base='https://wendellsoares.jor.br/wshub/';link('enroll-link',base+'inscricao/?ref='+SLUG);link('student-link',base+'aluno/ia-na-pratica/?ref='+SLUG);$('links').hidden=false}
async function load(){
 const d=await call('/api/admin/dados');
 course=d.state?.formacoes?.find(x=>x.slug===SLUG);
 if(!course)throw Error('Não encontrei “ia-na-pratica” no painel. Cadastre essa formação primeiro; não altere outra.');
 $('login-box').hidden=true;$('app').hidden=false;
 $('course-info').textContent=course.titulo+' · slug: '+course.slug+' · '+(course.status||'Sem status');
 $('code').value=course.senha||'';
 $('limit').value=course.inscricaoIndividual?.limiteInscritos||500;
 $('approval').checked=course.inscricaoIndividual?.liberacao==='aprovacao';
 if(course.experiencia==='jovens'&&course.inscricaoIndividual?.tipo==='online')display();
 status('Formação encontrada. Confira as opções antes de vincular.');
}
$('login').addEventListener('submit',async e=>{e.preventDefault();const b=e.target.querySelector('button');b.disabled=true;try{const r=await fetch(API+'/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({senha:$('password').value})});const d=await r.json();if(!r.ok)throw Error(d.erro||'Senha inválida.');token=d.token;sessionStorage.setItem(AUTH,token);$('password').value='';await load()}catch(e){status(e.message,true)}finally{b.disabled=false}});
$('publish').addEventListener('click',async()=>{
 const limit=Number($('limit').value),code=$('code').value.trim();
 if(!Number.isInteger(limit)||limit<1||limit>500){status('Limite inválido: use de 1 a 500.',true);return}
 if(code.length>90){status('O código deve ter até 90 caracteres.',true);return}
 if(!confirm('Vincular SOMENTE “ia-na-pratica” com 7 aulas e 2 horas e abrir inscrições online?'))return;
 const b=$('publish');b.disabled=true;status('Vinculando o curso à infraestrutura oficial…');
 try{
  const fresh=await call('/api/admin/dados');const found=fresh.state?.formacoes?.find(x=>x.slug===SLUG);
  if(!found)throw Error('A formação não existe mais no painel.');
  found.experiencia='jovens';found.titulo='IA na Prática: do Estudo ao Primeiro Emprego';found.subtitulo='Formação prática em IA para estudo, trabalho e primeiro emprego';found.cargaHoraria=2;found.status='Ativa';found.senha=code;
  found.aulas=modules.map(([titulo,conteudo],i)=>({titulo,conteudo,ordem:i+1}));
  await call('/api/admin/dados','PUT',{revision:fresh.revision,state:fresh.state});
  await call('/api/admin/inscricoes/configurar','POST',{slug:SLUG,tipo:'online',inicio:null,termino:null,consultaAte:null,limiteInscritos:limit,liberacao:$('approval').checked?'aprovacao':'automatica',inscricoesAbertas:true});
  await load();display();status('Vínculo salvo no WS Hub. A inscrição individual já pode usar o mecanismo oficial.');
 }catch(e){status(e.message+' Se o primeiro salvamento ocorreu, revise o estado antes de tentar novamente.',true)}finally{b.disabled=false}
});
if(token)load().catch(e=>{status(e.message,true);$('login-box').hidden=false});else status('Entre com a senha administrativa para vincular a formação.');
})();
