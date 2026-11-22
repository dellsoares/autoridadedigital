(()=>{'use strict';const API='https://ws-hub-api.dell-soares.workers.dev',AUTH='wshub-admin-token-session-v1',BASE='https://wendellsoares.jor.br/wshub/';const $=id=>document.getElementById(id);let token='',state=null,enrollUrl='',qrUrl='';
try{token=sessionStorage.getItem(AUTH)||''}catch(_){}const status=(s,bad=false)=>{$('status').textContent=s;$('status').className='status'+(bad?' bad':'')};
async function call(path,method='GET',body){const r=await fetch(API+path,{method,cache:'no-store',headers:{'content-type':'application/json',Authorization:'Bearer '+token},...(body!==undefined?{body:JSON.stringify(body)}:{})});let d={};try{d=await r.json()}catch(_){}if(!r.ok)throw Error(d.erro||'Erro de comunicação ('+r.status+')');return d}
const local=v=>{if(!v)return '';const d=new Date(v);if(!Number.isFinite(d.getTime()))return '';return new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(d).replace(' ','T')};
const iso=v=>v?new Date(v+':00-03:00').toISOString():'';
const fmt=v=>v?new Date(v).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Sao_Paulo'}):'—';
const course=()=>state?.formacoes?.find(c=>c.slug===$('course').value);
function configView(){const c=course();if(!c)return;const z=c.inscricaoIndividual||{};
 $('begin').value=local(z.inicio);$('end').value=local(z.termino);$('review').value=local(z.consultaAte);
 $('approval').value=z.liberacao||'automatica';$('limit').value=z.limiteInscritos||50;$('open').checked=z.inscricoesAbertas!==false;
 enrollUrl=BASE+'inscricao/?ref='+encodeURIComponent(c.slug);$('enroll-link').textContent=enrollUrl;$('open-enroll').href=enrollUrl;
 qrUrl=z.presencaChave?BASE+'presenca/?ref='+encodeURIComponent(c.slug)+'&chave='+encodeURIComponent(z.presencaChave):'';
 $('qr-box').hidden=!qrUrl;$('qr-empty').hidden=!!qrUrl;
 if(qrUrl){$('presence-link').textContent=qrUrl;try{WSHubQR.draw(qrUrl,$('qr-canvas'),340)}catch(e){status('Não foi possível desenhar o QR: '+e.message,true)}}
 showRows();}
function showRows(){const c=course();if(!c)return;const list=(state.inscricoesIndividuais||[]).filter(x=>x.slug===c.slug).sort((a,b)=>String(b.inscritoEm).localeCompare(String(a.inscritoEm)));
 $('counts').textContent=`${list.length} inscritos · ${list.filter(x=>x.aprovada&&!x.bloqueada).length} aprovados · ${list.filter(x=>x.presencaEm).length} presenças · ${list.filter(x=>x.certificadoId).length} certificados`;
 const body=$('rows');body.replaceChildren();if(!list.length){const row=body.insertRow(),td=row.insertCell();td.colSpan=6;td.textContent='Ainda não há inscrições nesta formação.';return}
 for(const r of list){const row=body.insertRow();
  const items=[r.nome,(r.email||'')+(r.whatsapp?' · '+r.whatsapp:''),r.bloqueada?'Bloqueada':r.aprovada?'Aprovada':'Aguardando',r.presencaEm?fmt(r.presencaEm):'Não confirmada',r.certificadoId?'Emitido':'Pendente'];
  for(const value of items){const td=row.insertCell();td.textContent=value}
  const cell=row.insertCell(),tools=document.createElement('div');tools.className='actions';
  for(const [label,action] of [[r.aprovada&&!r.bloqueada?'Bloquear':'Aprovar',r.aprovada&&!r.bloqueada?'bloquear':'aprovar'],['Novo código','novo-codigo']]){
    const b=document.createElement('button');b.type='button';b.className='smallbtn';b.textContent=label;b.addEventListener('click',()=>update(r,action));tools.append(b)
  }cell.append(tools);
 }}
async function load(){status('Sincronizando inscrições…');try{const res=await call('/api/admin/dados');state=res.state;if(!Array.isArray(state.formacoes))throw Error('Dados inválidos');
 const previous=$('course').value;$('course').replaceChildren();for(const c of state.formacoes.filter(x=>!['naboa','voz-ativa'].includes(x.slug))){const o=new Option(c.titulo+' ('+c.slug+')',c.slug);$('course').append(o)}
 if(!state.formacoes.some(x=>x.slug===$('course').value)&&!$('course').options.length)throw Error('Cadastre uma formação nova no painel principal antes de configurar inscrições.');
 if([...$('course').options].some(x=>x.value===previous))$('course').value=previous;
 $('app').hidden=false;$('auth').hidden=true;configView();status('Dados atualizados no Cloudflare.');}catch(e){$('app').hidden=true;$('auth').hidden=false;status(e.message,true)}}
async function update(r,action){const desc=action==='novo-codigo'?'Gerar um novo código? O anterior deixará de funcionar.':action==='bloquear'?'Bloquear o acesso deste participante?':'Aprovar a inscrição deste participante?';if(!confirm(desc))return;
 try{const x=await call('/api/admin/inscricoes/'+encodeURIComponent(r.id)+'/'+action,'POST',{});if(x.codigo){await navigator.clipboard.writeText(x.codigo).catch(()=>{});alert('Novo código (exibido uma vez; copie e envie ao participante):\n\n'+x.codigo+'\n\nTambém foi tentada a cópia para a área de transferência.')}await load();status('Registro atualizado.')}catch(e){status(e.message,true)}}
$('login').addEventListener('submit',async e=>{e.preventDefault();const b=e.currentTarget.querySelector('button');b.disabled=true;try{const r=await fetch(API+'/api/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({senha:$('password').value})});const d=await r.json();if(!r.ok)throw Error(d.erro||'Senha inválida');token=d.token;try{sessionStorage.setItem(AUTH,token)}catch(_){}$('password').value='';await load()}catch(x){status(x.message,true)}finally{b.disabled=false}});
$('course').addEventListener('change',configView);
$('config').addEventListener('submit',async e=>{e.preventDefault();const c=course();if(!c)return;const button=$('save');button.disabled=true;try{const data={slug:c.slug,inicio:iso($('begin').value),termino:iso($('end').value),consultaAte:iso($('review').value),liberacao:$('approval').value,limiteInscritos:Number($('limit').value),inscricoesAbertas:$('open').checked};await call('/api/admin/inscricoes/configurar','POST',data);await load();status('Formação configurada! Links de inscrição e presença disponíveis.')}catch(e){status(e.message,true)}finally{button.disabled=false}});
async function copy(s){try{await navigator.clipboard.writeText(s);status('Link copiado.')}catch(_){prompt('Copie o link:',s)}}
$('copy-enroll').addEventListener('click',()=>copy(enrollUrl));$('copy-presence').addEventListener('click',()=>copy(qrUrl));$('refresh').addEventListener('click',load);
$('reset-qr').addEventListener('click',async()=>{if(!confirm('Renovar QR Code? O link antigo deixará de funcionar.'))return;try{await call('/api/admin/inscricoes/'+encodeURIComponent(course().slug)+'/renovar-qr','POST',{});await load();status('Novo QR Code gerado.')}catch(e){status(e.message,true)}});
$('print-qr').addEventListener('click',()=>{const item=$('qr-canvas');const win=window.open('','_blank');if(!win){status('Autorize pop-ups para imprimir.',true);return}const title=course()?.titulo||'Formação';win.document.write('<!doctype html><html><head><title>QR Code de presença</title><style>body{font:22px system-ui;text-align:center;padding:35px;color:#06162b}img{width:380px;max-width:95%}p{font-size:15px}small{font-size:11px}</style></head><body><h1></h1><img><p>Escaneie para confirmar sua presença no treinamento.</p><small></small></body></html>');win.document.querySelector('h1').textContent=title;win.document.querySelector('img').src=item.toDataURL('image/png');win.document.querySelector('small').textContent=qrUrl;win.document.close();win.onload=()=>win.print()});
if(token)load();else{$('auth').hidden=false;status('Entre com a senha administrativa.')}})();
