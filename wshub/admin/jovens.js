(()=>{'use strict';
const API='https://ws-hub-api.dell-soares.workers.dev',AUTH='wshub-admin-token-session-v1',BASE='https://wendellsoares.jor.br/wshub/';
const $=id=>document.getElementById(id),modules=[
 ['Sua identidade digital','Sua presença na internet e oportunidades profissionais.'],
 ['Descubra seus talentos','Habilidades e experiências que já fazem parte da sua trajetória.'],
 ['Currículo sem experiência','Como elaborar seu primeiro currículo com dados verdadeiros.'],
 ['LinkedIn e conexões','Presença profissional e conexões com cuidado e privacidade.'],
 ['Seu perfil, suas escolhas','Reputação, proteção de dados e segurança online.'],
 ['Sua primeira oportunidade','Onde pesquisar vagas e preparar sua candidatura.'],
 ['Missão primeiro emprego','Desafio final: reunir aprendizados para seus próximos passos.']
];let token='',data=null;try{token=sessionStorage.getItem(AUTH)||''}catch(_e){}
const status=(t,bad=false)=>{$('status').textContent=t;$('status').className='status'+(bad?' bad':'')};
async function api(path,method='GET',body){const r=await fetch(API+path,{method,cache:'no-store',headers:{'Authorization':'Bearer '+token,...(body!==undefined?{'Content-Type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});const d=await r.json().catch(()=>({}));if(!r.ok)throw Error(d.erro||'Falha de comunicação');return d}
function chosen(){return data?.state?.formacoes?.find(c=>c.slug===$('course').value)}
function fill(){const old=$('course').value;$('course').replaceChildren();for(const c of data.state.formacoes.filter(c=>!['naboa','voz-ativa'].includes(c.slug)))$('course').append(new Option(c.titulo+' · '+c.slug,c.slug));if(old&&[...$('course').options].some(x=>x.value===old))$('course').value=old;display()}
function display(){const c=chosen();if(!c)return;const z=c.inscricaoIndividual||{};$('code').value=c.senha||'';$('limit').value=z.limiteInscritos||500;$('approval').checked=z.liberacao==='aprovacao';
 const slug=encodeURIComponent(c.slug);$('enroll-link').textContent=BASE+'inscricao/?ref='+slug;$('enroll-link').href=BASE+'inscricao/?ref='+slug;
 $('course-link').textContent=BASE+'aluno/jovens/?ref='+slug;$('course-link').href=BASE+'aluno/jovens/?ref='+slug;
 $('links').hidden=c.experiencia!=='jovens'}
async function load(){try{data=await api('/api/admin/dados');if(!Array.isArray(data.state?.formacoes))throw Error('Estado inválido');$('login-box').hidden=true;$('app').hidden=false;fill();status('Selecione a formação cadastrada e clique em Vincular.')}catch(e){$('login-box').hidden=false;$('app').hidden=true;status(e.message,true)}}
$('login').addEventListener('submit',async e=>{e.preventDefault();const b=e.currentTarget.querySelector('button');b.disabled=true;try{const r=await fetch(API+'/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({senha:$('password').value})});const d=await r.json();if(!r.ok)throw Error(d.erro||'Senha inválida');token=d.token;sessionStorage.setItem(AUTH,token);$('password').value='';await load()}catch(err){status(err.message,true)}finally{b.disabled=false}});
$('course').addEventListener('change',display);
$('publish').addEventListener('click',async()=>{const c=chosen();if(!c)return;const code=$('code').value.trim(),limit=Number($('limit').value),approval=$('approval').checked;
 if(!Number.isInteger(limit)||limit<1||limit>500){status('O limite deve ser de 1 a 500 inscrições.',true);return}
 if(code.length>90){status('O código tem tamanho máximo de 90 caracteres.',true);return}
 if(!confirm('Vincular a formação “'+c.titulo+'” ao curso Missão Futuro, com 7 módulos, 2 horas, inscrição permanente e certificado após feedback?'))return;
 const b=$('publish');b.disabled=true;status('Configurando…');try{
  // Primeiro registre as sete aulas. A API exige uma aula cadastrada
  // antes de permitir a modalidade online permanente.
  const latest=await api('/api/admin/dados');const found=latest.state.formacoes.find(x=>x.slug===c.slug);
  if(!found)throw Error('Formação não localizada na atualização.');
  found.experiencia='jovens';found.titulo='Currículo e mídias digitais para jovens';found.subtitulo='Como usar a favor da carreira profissional';found.cargaHoraria=2;found.status='Ativa';found.senha=code;
  found.aulas=modules.map(([titulo,conteudo],i)=>({titulo,conteudo,ordem:i+1}));
  await api('/api/admin/dados','PUT',{revision:latest.revision,state:latest.state});
  // Com as aulas persistidas, a modalidade e as inscrições podem ser ativadas.
  await api('/api/admin/inscricoes/configurar','POST',{slug:c.slug,tipo:'online',inicio:null,termino:null,consultaAte:null,limiteInscritos:limit,liberacao:approval?'aprovacao':'automatica',inscricoesAbertas:true});
  await load();$('links').hidden=false;status('Curso vinculado e salvo na nuvem. Inscrições disponíveis.');
 }catch(e){status(e.message+'. Recarregue antes de tentar novamente.',true)}finally{b.disabled=false}
});
if(token)load();else{$('login-box').hidden=false;status('Informe a senha administrativa para vincular o curso.')}
})();
