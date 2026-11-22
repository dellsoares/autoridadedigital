(()=>{'use strict';const API='https://ws-hub-api.dell-soares.workers.dev',AUTH='wshub-admin-token-session-v1',BASE='https://wendellsoares.jor.br/wshub/';const $=id=>document.getElementById(id);let token='',state=null,enrollUrl='',qrUrl='';
try{token=sessionStorage.getItem(AUTH)||''}catch(_){}const status=(s,bad=false)=>{$('status').textContent=s;$('status').className='status'+(bad?' bad':'')};
async function call(path,method='GET',body){const r=await fetch(API+path,{method,cache:'no-store',headers:{'content-type':'application/json',Authorization:'Bearer '+token},...(body!==undefined?{body:JSON.stringify(body)}:{})});let d={};try{d=await r.json()}catch(_){}if(!r.ok)throw Error(d.erro||'Erro de comunicação ('+r.status+')');return d}
const local=v=>{if(!v)return '';const d=new Date(v);if(!Number.isFinite(d.getTime()))return '';return new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(d).replace(' ','T')};
const iso=v=>v?new Date(v+':00-03:00').toISOString():'';
const fmt=v=>v?new Date(v).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Sao_Paulo'}):'—';
const course=()=>state?.formacoes?.find(c=>c.slug===$('course').value);
function configView(){const c=course();if(!c)return;const z=c.inscricaoIndividual||{};
 $('format').value=z.tipo==='online'?'online':'presencial';
 $('begin').value=local(z.inicio);$('end').value=local(z.termino);$('review').value=local(z.consultaAte);refreshMode();
 $('approval').value=z.liberacao||'automatica';$('limit').value=z.limiteInscritos||50;$('open').checked=z.inscricoesAbertas!==false;
 enrollUrl=BASE+'inscricao/?ref='+encodeURIComponent(c.slug);$('enroll-link').textContent=enrollUrl;$('open-enroll').href=enrollUrl;
 qrUrl=z.tipo!=='online'&&z.presencaChave?BASE+'presenca/?ref='+encodeURIComponent(c.slug)+'&chave='+encodeURIComponent(z.presencaChave):'';
 $('qr-box').hidden=!qrUrl;$('qr-empty').hidden=!!qrUrl;
 $('proof-head').textContent=z.tipo==='online'?'Progresso das aulas':'Presença';
 if(qrUrl){$('presence-link').textContent=qrUrl;try{WSHubQR.draw(qrUrl,$('qr-canvas'),340)}catch(e){status('Não foi possível desenhar o QR: '+e.message,true)}}
 showRows();}
function refreshMode(){const online=$('format').value==='online';$('date-fields').hidden=online;$('presenca-area').hidden=online;$('online-qr-info').hidden=!online;for(const id of ['begin','end','review'])$(id).required=!online;
 $('mode-help').textContent=online?'Inscrição aberta continuamente. Não há data obrigatória nem QR de presença. O certificado será liberado após a conclusão de todas as aulas.':'Datas obrigatórias para o presencial. O certificado depende do QR de presença e do horário de término.';}
function showRows(){const c=course();if(!c)return;const list=(state.inscricoesIndividuais||[]).filter(x=>x.slug===c.slug).sort((a,b)=>String(b.inscritoEm).localeCompare(String(a.inscritoEm)));
 $('counts').textContent=`${list.length} inscritos · ${list.filter(x=>x.aprovada&&!x.bloqueada).length} aprovados · ${list.filter(x=>x.presencaEm).length} presenças · ${list.filter(x=>x.certificadoId).length} certificados`;
 const body=$('rows');body.replaceChildren();if(!list.length){const row=body.insertRow(),td=row.insertCell();td.colSpan=6;td.textContent='Ainda não há inscrições nesta formação.';return}
 for(const r of list){const row=body.insertRow();
  const items=[r.nome,(r.email||'')+(r.whatsapp?' · '+r.whatsapp:''),r.bloqueada?'Bloqueada':r.aprovada?'Aprovada':'Aguardando',c.inscricaoIndividual?.tipo==='online'?((r.aulasConcluidas||[]).length+' de '+(c.aulas||[]).length+' aulas'):r.presencaEm?fmt(r.presencaEm):'Não confirmada',r.certificadoId?'Emitido':'Pendente'];
  for(const value of items){const td=row.insertCell();td.textContent=value}
  const cell=row.insertCell(),tools=document.createElement('div');tools.className='actions';
  const actions=[
   ['Editar',()=>personDialog(r),''],
   [r.aprovada&&!r.bloqueada?'Bloquear':'Aprovar',()=>update(r,r.aprovada&&!r.bloqueada?'bloquear':'aprovar'),''],
   ['Novo código',()=>update(r,'novo-codigo'),'']];
  if(c.inscricaoIndividual?.tipo==='online'){
   const lessons=Array.isArray(c.aulas)?c.aulas.length:0;
   const complete=lessons>0&&(r.aulasConcluidas||[]).length>=lessons;
   actions.push([complete?'Desfazer conclusão':'Concluir aulas',()=>setProof(r,'conclusao',!complete),complete?'danger':'positive']);
  }else{
   actions.push([r.presencaEm?'Desconfirmar presença':'Confirmar presença',()=>setProof(r,'presenca',!r.presencaEm),r.presencaEm?'danger':'positive']);
  }
  actions.push(['Excluir',()=>deletePerson(r),'danger']);
  for(const [label,handler,cls] of actions){
   const b=document.createElement('button');b.type='button';b.className='smallbtn'+(cls?' '+cls:'');b.textContent=label;b.addEventListener('click',handler);tools.append(b);
  }cell.append(tools);
 }}
async function load(){status('Sincronizando inscrições…');try{const res=await call('/api/admin/dados');state=res.state;if(!Array.isArray(state.formacoes))throw Error('Dados inválidos');
 const previous=$('course').value;$('course').replaceChildren();for(const c of state.formacoes.filter(x=>!['naboa','voz-ativa'].includes(x.slug))){const o=new Option(c.titulo+' ('+c.slug+')',c.slug);$('course').append(o)}
 if(!state.formacoes.some(x=>x.slug===$('course').value)&&!$('course').options.length)throw Error('Cadastre uma formação nova no painel principal antes de configurar inscrições.');
 if([...$('course').options].some(x=>x.value===previous))$('course').value=previous;
 $('app').hidden=false;$('auth').hidden=true;configView();status('Dados atualizados no Cloudflare.');}catch(e){$('app').hidden=true;$('auth').hidden=false;status(e.message,true)}}
async function update(r,action){const desc=action==='novo-codigo'?'Gerar um novo código? O anterior deixará de funcionar.':action==='bloquear'?'Bloquear o acesso deste participante?':'Aprovar a inscrição deste participante?';if(!confirm(desc))return;
 try{const x=await call('/api/admin/inscricoes/'+encodeURIComponent(r.id)+'/'+action,'POST',{});if(x.codigo){await navigator.clipboard.writeText(x.codigo).catch(()=>{});alert('Novo código (exibido uma vez; copie e envie ao participante):\n\n'+x.codigo+'\n\nTambém foi tentada a cópia para a área de transferência.')}await load();status('Registro atualizado.')}catch(e){status(e.message,true)}}
// Toda ação de gestão usa o token administrativo; os alunos não recebem essa permissão.
function personDialog(r=null){
 const d=$('person-dialog');$('person-id').value=r?.id||'';
 $('person-title').textContent=r?'Editar participante':'Inserir participante';
 $('person-name').value=r?.nome||'';$('person-email').value=r?.email||'';$('person-phone').value=r?.whatsapp||'';
 $('person-approved-row').hidden=!!r;$('person-approved').checked=true;
 if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','');
 $('person-name').focus();
}
$('person-cancel').addEventListener('click',()=>$('person-dialog').close());
$('add-person').addEventListener('click',()=>{
 if(!course()?.inscricaoIndividual?.tipo){status('Salve a modalidade da formação antes de incluir participantes.',true);return}
 personDialog();
});
$('person-form').addEventListener('submit',async e=>{
 e.preventDefault();const id=$('person-id').value,button=e.currentTarget.querySelector('[type=submit]');
 const body={nome:$('person-name').value.trim(),email:$('person-email').value.trim(),whatsapp:$('person-phone').value.trim()};
 button.disabled=true;
 try{
  let result;
  if(id){result=await call('/api/admin/inscricoes/'+encodeURIComponent(id),'PATCH',body)}
  else{body.slug=course()?.slug;body.aprovada=$('person-approved').checked;
   result=await call('/api/admin/inscricoes/adicionar','POST',body)}
  $('person-dialog').close();await load();
  if(result.codigo){
   try{await navigator.clipboard.writeText(result.codigo)}catch(_){}
   alert('Participante inserido. Guarde e envie este código individual (exibido uma vez):\n\n'+result.codigo);
  }
  status(id?'Dados do participante corrigidos. Se já havia certificado, a verificação foi atualizada.':'Participante inserido.');
 }catch(err){status(err.message||'Erro ao salvar participante.',true)}finally{button.disabled=false}
});
async function setProof(r,action,confirmada){
 const label=action==='presenca'?'presença':'conclusão das aulas';
 const promptText=confirmada?'Confirmar administrativamente '+label+' de '+r.nome+'?':
  'Desfazer '+label+' de '+r.nome+'? Se houver certificado individual emitido, ele será invalidado.';
 if(!confirm(promptText))return;
 try{await call('/api/admin/inscricoes/'+encodeURIComponent(r.id)+'/'+action,'POST',{confirmada});
  await load();status((confirmada?'Confirmada':'Desfeita')+' a '+label+' de '+r.nome+'.');
 }catch(e){status(e.message,true)}
}
async function deletePerson(r){
 if(!confirm('Excluir a inscrição de '+r.nome+'? O acesso será cancelado e seus certificados individuais serão invalidados. Esta operação não pode ser desfeita.'))return;
 try{await call('/api/admin/inscricoes/'+encodeURIComponent(r.id),'DELETE');await load();status('Inscrição excluída. Acesso e certificado anterior invalidados.')}catch(e){status(e.message,true)}
}
$('login').addEventListener('submit',async e=>{e.preventDefault();const b=e.currentTarget.querySelector('button');b.disabled=true;try{const r=await fetch(API+'/api/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({senha:$('password').value})});const d=await r.json();if(!r.ok)throw Error(d.erro||'Senha inválida');token=d.token;try{sessionStorage.setItem(AUTH,token)}catch(_){}$('password').value='';await load()}catch(x){status(x.message,true)}finally{b.disabled=false}});
$('course').addEventListener('change',configView);$('format').addEventListener('change',refreshMode);
$('config').addEventListener('submit',async e=>{e.preventDefault();const c=course();if(!c)return;const button=$('save');button.disabled=true;try{const data={slug:c.slug,tipo:$('format').value,inicio:$('format').value==='online'?null:iso($('begin').value),termino:$('format').value==='online'?null:iso($('end').value),consultaAte:$('format').value==='online'?null:iso($('review').value),liberacao:$('approval').value,limiteInscritos:Number($('limit').value),inscricoesAbertas:$('open').checked};await call('/api/admin/inscricoes/configurar','POST',data);await load();status('Formação configurada! Link de inscrição disponível'+(data.tipo==='online'?' sem prazo e sem QR de presença.':'; QR de presença disponível.') )}catch(e){status(e.message,true)}finally{button.disabled=false}});
async function copy(s){try{await navigator.clipboard.writeText(s);status('Link copiado.')}catch(_){prompt('Copie o link:',s)}}
$('copy-enroll').addEventListener('click',()=>copy(enrollUrl));$('copy-presence').addEventListener('click',()=>copy(qrUrl));$('refresh').addEventListener('click',load);
$('reset-qr').addEventListener('click',async()=>{if(!confirm('Renovar QR Code? O link antigo deixará de funcionar.'))return;try{await call('/api/admin/inscricoes/'+encodeURIComponent(course().slug)+'/renovar-qr','POST',{});await load();status('Novo QR Code gerado.')}catch(e){status(e.message,true)}});
$('print-qr').addEventListener('click',()=>{const item=$('qr-canvas');const win=window.open('','_blank');if(!win){status('Autorize pop-ups para imprimir.',true);return}const title=course()?.titulo||'Formação';win.document.write('<!doctype html><html><head><title>QR Code de presença</title><style>body{font:22px system-ui;text-align:center;padding:35px;color:#06162b}img{width:380px;max-width:95%}p{font-size:15px}small{font-size:11px}</style></head><body><h1></h1><img><p>Escaneie para confirmar sua presença no treinamento.</p><small></small></body></html>');win.document.querySelector('h1').textContent=title;win.document.querySelector('img').src=item.toDataURL('image/png');win.document.querySelector('small').textContent=qrUrl;win.document.close();win.onload=()=>win.print()});
if(token)load();else{$('auth').hidden=false;status('Entre com a senha administrativa.')}})();
