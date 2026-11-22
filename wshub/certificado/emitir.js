/* WS Hub | emissão corporativa: somente após o encerramento e antes de 48h. */
(()=>{'use strict';const $=id=>document.getElementById(id);
const API='https://ws-hub-api.dell-soares.workers.dev',params=new URLSearchParams(location.search);
const slug=params.get('ref')||'',chave=params.get('chave')||'';
let course=null,blocked=false;
const status=(text,warning=false)=>{$('status').textContent=text;$('status').className=warning?'feedback warn':'feedback'};
const format=iso=>new Date(iso).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short',timeZone:'America/Sao_Paulo'});
function setMeta(f){$('course').textContent=f.titulo||'Formação WS Hub';const root=$('meta');root.hidden=false;root.replaceChildren();
 for(const v of [f.cargaHoraria?f.cargaHoraria+' horas de formação':'',f.termino?'Treinamento encerrado em '+format(f.termino):'',f.expiracao?'Emissão disponível até '+format(f.expiracao):'']){
  if(!v)continue;const p=document.createElement('p');p.textContent=v;root.append(p);
 }
}
function stateNotice(s){blocked=true;$('form').hidden=true;
 if(s.status==='expirado'){
  $('expired').hidden=false;status('O prazo de emissão automática terminou. Solicite pelo e-mail indicado abaixo.',true);
 }else if(s.status==='ainda_nao'){
  status('A emissão abre após o horário de término do treinamento. Acesse novamente depois desse horário.',true);
 }else status(s.erro||'Link de emissão indisponível.',true);
}
async function check(){if(!/^[a-z0-9][a-z0-9_-]{0,79}$/.test(slug)||!chave){stateNotice({erro:'Link do QR Code inválido.'});return}
 try{const r=await fetch(API+'/api/publico/certificados/'+encodeURIComponent(slug)+'/situacao?chave='+encodeURIComponent(chave),{cache:'no-store'});
  const body=await r.json();if(!r.ok)throw Error(body.erro||'Não foi possível validar este QR Code.');
  course=body.formacao;setMeta(course);
  if(!body.ok){stateNotice(body);return}
  blocked=false;$('form').hidden=false;status('Certificado disponível. Informe seu nome completo.');
 }catch(e){stateNotice({erro:e.message})}
}
$('form').addEventListener('submit',async e=>{e.preventDefault();if(blocked)return;
 const b=$('generate');b.disabled=true;status('Validando e registrando seu certificado…');
 try{const nome=WSHubCertTemplate.displayName($('name').value);$('name').value=nome;
  if(nome.split(' ').length<2||nome.length<5)throw Error('Informe nome e sobrenome.');
  const r=await fetch(API+'/api/publico/certificados/'+encodeURIComponent(slug)+'/emitir',{method:'POST',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify({chave,nome})});
  const data=await r.json();if(!r.ok)throw Error(data.erro||'Não foi possível emitir o certificado.');
  const certificate=data.certificado;
  if(!certificate?.registro)throw Error('O registro da emissão não foi confirmado.');
  status('Certificado registrado! Escolha “Salvar como PDF” na janela de impressão.');
  await WSHubCertTemplate.print(certificate,certificate.participante);
 }catch(err){status(err.message,true);if(/prazo|terminou/i.test(err.message)){$('expired').hidden=false;blocked=true;$('form').hidden=true}}
 finally{b.disabled=false}
});
check();
})();
