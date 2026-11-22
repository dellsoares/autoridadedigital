/* WS Hub | Administração de turmas e certificados; atualização por revisão do Cloudflare. */
(()=>{'use strict';
const API='https://ws-hub-api.dell-soares.workers.dev';
const AUTH='wshub-admin-token-session-v1';
const $=id=>document.getElementById(id);
let token='',state=null,revision=0,qrUrl='';
try{token=sessionStorage.getItem(AUTH)||''}catch(_){}
const status=(message,bad=false)=>{$('status').textContent=message;$('status').dataset.type=bad?'bad':'ok'};
const toISO=value=>value?new Date(value+':00-03:00').toISOString():'';
const local=iso=>{if(!iso)return '';const date=new Date(iso);
 if(!Number.isFinite(date.getTime()))return '';
 const parts=new Intl.DateTimeFormat('sv-SE',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'America/Sao_Paulo'}).format(date);
 return parts.replace(' ','T');
};
const format=iso=>iso?new Date(iso).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Sao_Paulo'}):'—';
async function call(path,method='GET',data){
 const r=await fetch(API+path,{method,cache:'no-store',headers:{'content-type':'application/json','Authorization':'Bearer '+token},body:data!==undefined?JSON.stringify(data):undefined});
 let b={};try{b=await r.json()}catch(_){};
 if(!r.ok)throw new Error(b.erro||'Falha no Cloudflare (HTTP '+r.status+').');return b;
}
async function login(e){e?.preventDefault();const password=$('admin-password').value;status('Validando senha…');
 try{const r=await fetch(API+'/api/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({senha:password})});
  const b=await r.json();if(!r.ok)throw new Error(b.erro||'Senha não reconhecida.');token=b.token;sessionStorage.setItem(AUTH,token);
  $('admin-password').value='';await load();
 }catch(err){status(err.message,true)}
}
function course(){return state?.formacoes?.find(x=>x.id===$('course-select').value)||null;}
function drawQR(c){
 qrUrl='';const z=c?.certificacao;
 if(z?.modalidade!=='corporativa'||!z.chave||!z.termino){$('qr-area').hidden=true;$('qr-empty').hidden=false;$('copy-link').disabled=true;$('print-qr').disabled=true;return;}
 qrUrl='https://wendellsoares.jor.br/wshub/certificado/?ref='+encodeURIComponent(c.slug)+'&chave='+encodeURIComponent(z.chave);
 try{WSHubQR.draw(qrUrl,$('qr-canvas'),440);$('qr-area').hidden=false;$('qr-empty').hidden=true;
  $('qr-title').textContent=c.titulo;
  const end=new Date(z.termino),expires=new Date(end.getTime()+48*3600*1000);
  $('qr-dates').textContent='Certificação: '+format(z.termino)+' até '+format(expires.toISOString());
  $('qr-link').textContent=qrUrl;$('copy-link').disabled=false;$('print-qr').disabled=false;
 }catch(err){status('Não foi possível gerar o QR: '+err.message,true);}
}
function choose(){const c=course();if(!c)return;
 $('cert-mode').value=c.certificacao?.modalidade==='corporativa'?'corporativa':'regular';
 $('starts').value=local(c.certificacao?.inicio);$('ends').value=local(c.certificacao?.termino);
 $('review-until').value=local(c.certificacao?.consultaAte);
 refreshMode();drawQR(c);
}
function refreshMode(){const isCorp=$('cert-mode').value==='corporativa';$('schedule-fields').hidden=!isCorp;
 for(const id of ['starts','ends','review-until'])$(id).required=isCorp;}
function showRecords(){const root=$('records');root.replaceChildren();const recs=Array.isArray(state?.certificadosEmissoes)?state.certificadosEmissoes:[];
 const last=recs.slice(-100).reverse();if(!last.length){const td=document.createElement('td');td.colSpan=5;td.textContent='Nenhum certificado registrado ainda.';const tr=document.createElement('tr');tr.append(td);root.append(tr);return;}
 for(const r of last){const tr=document.createElement('tr');
  const vals=[r.nome,r.titulo,r.tipo==='manual'?'Manual':'QR Code',format(r.criadoEm)];
  vals.forEach(v=>{const td=document.createElement('td');td.textContent=v||'—';tr.append(td)});
  const td=document.createElement('td'),a=document.createElement('a');a.href='/wshub/certificado/verificar/?id='+encodeURIComponent(r.id);
  a.target='_blank';a.rel='noopener';a.textContent='Verificar';td.append(a);tr.append(td);root.append(tr);
 }
}
function display(){const s=$('course-select'),selected=s.value;s.replaceChildren();
 for(const c of state?.formacoes||[]){const o=document.createElement('option');o.value=c.id;
  o.textContent=c.titulo+(c.status!=='Ativa'?' (inativa)':'');s.append(o)};
 if([...s.options].some(x=>x.value===selected))s.value=selected;
 choose();showRecords();
}
async function load(){status('Carregando turmas e emissões…');
 try{const obj=await call('/api/admin/dados');state=obj.state;revision=obj.revision;
  if(!state||!Array.isArray(state.formacoes))throw new Error('Dados de cursos inválidos.');
  $('auth-box').hidden=true;$('app').hidden=false;display();status('Tudo atualizado no Cloudflare.');
 }catch(err){$('app').hidden=true;$('auth-box').hidden=false;status(err.message,true)}
}
async function save(){const c=course();if(!c)return;
 try{const mode=$('cert-mode').value;const z={modalidade:mode};
  if(mode==='corporativa'){
   const begin=toISO($('starts').value),end=toISO($('ends').value),review=toISO($('review-until').value);
   if(!begin||!end||!review)throw Error('Informe início, término e prazo de consulta ao conteúdo.');
   if(new Date(begin)>=new Date(end))throw Error('O término precisa ser posterior ao início.');
   if(new Date(review)<=new Date(end))throw Error('O prazo de consulta deve ser posterior ao término.');
   if(c.slug==='naboa')throw Error('O NABOA antigo usa um portal local de acesso. Para esta modalidade, duplique o conteúdo em uma formação conectada ao Cloudflare.');
   Object.assign(z,{inicio:begin,termino:end,consultaAte:review,chave:c.certificacao?.chave||crypto.randomUUID()});
  }
  status('Salvando no Cloudflare…');$('save-course').disabled=true;
  // Recarregar a revisão mais recente evita apagar feedbacks emitidos enquanto o painel está aberto.
  const latest=await call('/api/admin/dados');
  const idx=latest.state.formacoes.findIndex(x=>x.id===c.id);
  if(idx<0)throw Error('Formação alterada ou excluída. Recarregue.');
  latest.state.formacoes[idx]={...latest.state.formacoes[idx],certificacao:z};
  await call('/api/admin/dados','PUT',{revision:latest.revision,state:latest.state});
  state=latest.state;revision=latest.revision+1;display();status('Configuração salva. O QR Code já pode ser apresentado no fim da aula.');
 }catch(err){status(err.message,true)}finally{$('save-course').disabled=false}
}
async function issue(e){e.preventDefault();const c=course();if(!c)return;
 const name=$('manual-name').value.trim(),date=$('manual-date').value;
 const btn=$('manual-form').querySelector('button');btn.disabled=true;status('Registrando a emissão manual…');
 try{
  const r=await call('/api/admin/certificados/emitir','POST',{slug:c.slug,nome:name,dataRealizacao:date||undefined});
  status('Certificado registrado. Abra a janela de impressão para salvar o PDF.');
  const cert=r.certificado;cert.cliente=state.clientes?.find(x=>x.id===c.clientId)?.organizacao||'';
  await WSHubCertTemplate.print(cert,cert.participante);
  $('manual-name').value='';await load();
 }catch(err){status(err.message,true)}finally{btn.disabled=false}
}
$('login-form').addEventListener('submit',login);
$('course-select').addEventListener('change',choose);
$('cert-mode').addEventListener('change',refreshMode);
$('save-course').addEventListener('click',save);
$('reload').addEventListener('click',load);
$('manual-form').addEventListener('submit',issue);
$('copy-link').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(qrUrl);status('Link do QR Code copiado.')}catch(_){status('Selecione e copie o link exibido abaixo do QR Code.',true)}});
$('print-qr').addEventListener('click',()=>window.print());
if(token)load();else{$('auth-box').hidden=false;status('Entre com a senha administrativa do WS Hub.');}
})();
