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
 const last=recs.slice(-100).reverse();if(!last.length){const td=document.createElement('td');td.colSpan=6;td.textContent='Nenhum certificado registrado ainda.';const tr=document.createElement('tr');tr.append(td);root.append(tr);return;}
 for(const r of last){const tr=document.createElement('tr');
  const vals=[r.nome,r.titulo,r.tipo==='manual'?'Manual':'QR Code',format(r.criadoEm)];
  vals.forEach((v,i)=>{const td=document.createElement('td');td.textContent=v||'—';if(i===0&&r.revogadoEm){const note=document.createElement('div');note.className='revoked';note.textContent='Excluído · certificado inválido';td.append(note);}else if(i===0&&r.atualizadoEm){const note=document.createElement('div');note.className='badge-ok';note.textContent='Corrigido';td.append(note);}tr.append(td)});
  const td=document.createElement('td'),a=document.createElement('a');a.href='/wshub/certificado/verificar/?id='+encodeURIComponent(r.id);
  a.target='_blank';a.rel='noopener';a.textContent='Verificar';td.append(a);tr.append(td);
  const opts=document.createElement('td');const wrapper=document.createElement('div');wrapper.className='tools';opts.append(wrapper);
  if(r.tipo==='manual'&&!r.revogadoEm){
   for(const [action,label,cls] of [['edit','Editar',''],['reprint','Reimprimir',''],['delete','Excluir','danger']]){
    const b=document.createElement('button');b.type='button';b.dataset.certAction=action;b.dataset.certId=r.id;
    b.textContent=label;if(cls)b.classList.add(cls);wrapper.append(b);
   }
  }else if(r.tipo==='manual')wrapper.textContent='Excluído';else wrapper.textContent='Somente leitura';
  tr.append(opts);root.append(tr);
 }
}
function findCert(id){return (state?.certificadosEmissoes||[]).find(r=>r.id===id)}
function editCert(id){const r=findCert(id);if(!r||r.tipo!=='manual'||r.revogadoEm)return;
 const opts=$('cert-edit-course');opts.replaceChildren();for(const c of state.formacoes||[]){
  const option=document.createElement('option');option.value=c.slug;option.textContent=c.titulo;opts.append(option);
 }
 $('cert-edit-id').value=r.id;$('cert-edit-name').value=r.nome;opts.value=r.slug;
 $('cert-edit-date').value=local(r.termino).slice(0,10);
 $('cert-edit-dialog').showModal();
}
// Alterações protegidas pelo login e pela revisão do estado Cloudflare já existente.
// Não exige novas rotas ou implantação do Worker.
async function updateCertificateState(id,mode,data){
 const latest=await call('/api/admin/dados');
 const items=Array.isArray(latest.state.certificadosEmissoes)?latest.state.certificadosEmissoes:[];
 const position=items.findIndex(item=>item.id===id);
 if(position<0)throw new Error('Certificado não localizado. Atualize os registros.');
 const current=items[position];
 if(current.tipo!=='manual')throw new Error('Esta opção existe somente para certificados manuais.');
 if(mode==='edit'){
  const c=latest.state.formacoes.find(course=>course.slug===data.slug);
  if(!c)throw new Error('Formação não encontrada no painel.');
  const norm=window.WSHubCertTemplate?.displayName(data.nome)||String(data.nome||'').trim();
  if(norm.length<5||norm.length>100||norm.split(' ').length<2||/[0-9<>\x00-\x1f]/.test(norm))
   throw new Error('Informe nome e sobrenome válidos.');
  const day=String(data.dataRealizacao||'');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(day)||!Number.isFinite(Date.parse(day))||new Date(day).toISOString().slice(0,10)!==day)
   throw new Error('Informe uma data de realização válida.');
  items[position]={...current,nome:norm,slug:c.slug,titulo:c.titulo,horas:Number(c.cargaHoraria)||0,
    inicio:null,termino:day+'T12:00:00-03:00',atualizadoEm:new Date().toISOString()};
 }else if(mode==='delete'){
  items.splice(position,1); // O código antigo deixa de ser reconhecido na verificação pública.
 }else throw new Error('Operação não reconhecida.');
 latest.state.certificadosEmissoes=items;
 await call('/api/admin/dados','PUT',{revision:latest.revision,state:latest.state});
}
async function saveCertEdit(event){event.preventDefault();const id=$('cert-edit-id').value;
 const btn=$('cert-edit-save');btn.disabled=true;status('Salvando correção no Cloudflare…');
 try{
  await updateCertificateState(id,'edit',{nome:$('cert-edit-name').value,
    slug:$('cert-edit-course').value,dataRealizacao:$('cert-edit-date').value});
  $('cert-edit-dialog').close();await load();status('Certificado corrigido. Clique em Reimprimir e substitua a versão anterior.');
 }catch(error){status('Não foi possível editar: '+error.message,true)}finally{btn.disabled=false}
}
async function deleteCert(id){const r=findCert(id);if(!r||r.tipo!=='manual')return;
 if(!confirm('Excluir o certificado manual de '+r.nome+'?\n\nO certificado emitido ficará INVÁLIDO na verificação pública. Esta ação não pode ser desfeita.'))return;
 status('Excluindo certificado…');try{
  await updateCertificateState(id,'delete');
  await load();status('Certificado excluído do painel. O código de verificação anterior está inválido.');
 }catch(error){status('Erro ao excluir: '+error.message,true)}
}
async function reprintCert(id){const r=findCert(id);if(!r||r.tipo!=='manual'||r.revogadoEm)return;
 if(!window.WSHubCertTemplate){status('Modelo do certificado ainda não carregado.',true);return}
 const c=state?.formacoes?.find(c=>c.slug===r.slug);
 const client=state?.clientes?.find(x=>x.id===c?.clientId)||{};
 const meta={titulo:r.titulo,cliente:client.organizacao||client.nome||'',horas:r.horas,
  termino:r.termino,inicio:r.inicio,registro:r.id};
 try{await WSHubCertTemplate.print(meta,r.nome);status('Certificado preparado para salvar em PDF.')}catch(error){status('Falha na impressão: '+error.message,true)}
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
$('records').addEventListener('click',event=>{
 const button=event.target.closest('button[data-cert-action]');if(!button)return;
 const id=button.dataset.certId;const action=button.dataset.certAction;
 if(action==='edit')editCert(id);
 else if(action==='delete')deleteCert(id);
 else if(action==='reprint')reprintCert(id);
});
$('cert-edit-form').addEventListener('submit',saveCertEdit);
$('cert-edit-cancel').addEventListener('click',()=>$('cert-edit-dialog').close());
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
