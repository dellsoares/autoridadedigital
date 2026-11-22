/* WS Hub · Consulta e download de materiais após o fim de turmas corporativas.
   Arquivo exportado é uma cópia pessoal para estudo e não pode ser apagado remotamente. */
(()=>{'use strict';
if(window.__WS_CORPORATIVO_MATERIAL__)return;window.__WS_CORPORATIVO_MATERIAL__=true;
const slug=window.VOZ_ATIVA_CURSO?.slug||new URLSearchParams(location.search).get('ref')||'';
if(!/^[a-z0-9][a-z0-9_-]{0,79}$/.test(slug))return;
let token='';try{token=sessionStorage.getItem('wshub:curso:'+slug+':token')||''}catch(_){}
if(!token)return;
const escape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
function renderCourse(c){const local=window.VOZ_ATIVA_CURSO;
 const lessons=local?.aulas?.length?local.aulas:c.aulas||[];
 const pieces=lessons.map((l,i)=>{
  const blocks=Array.isArray(l.blocos)?l.blocos.map(b=>`<section><h3>${escape(b.titulo)}</h3><p>${escape(b.texto)}</p>${b.itens?.length?'<ul>'+b.itens.map(v=>'<li>'+escape(v)+'</li>').join('')+'</ul>':''}${b.exemplo?'<p><strong>Exemplo:</strong> '+escape(b.exemplo)+'</p>':''}${b.alerta?'<p><strong>Atenção:</strong> '+escape(b.alerta)+'</p>':''}</section>`).join(''):'<div>'+escape(l.conteudo||l.lead||'').replace(/\n/g,'<br>')+'</div>';
  const act=l.exercicio?`<section class="activity"><h3>${escape(l.exercicio.titulo||'Atividade')}</h3><p>${escape(l.exercicio.descricao)}</p><ul>${(l.exercicio.campos||[]).map(x=>`<li>${escape(x.rotulo)}</li>`).join('')}</ul></section>`:l.atividade?`<p class="activity">${escape(l.atividade)}</p>`:'';
  return `<article><div class="num">Aula ${i+1} · ${escape(l.minutos?l.minutos+' minutos':'Formação')}</div><h2>${escape(l.titulo)}</h2><p class="lead">${escape(l.lead||'')}</p>${blocks}${act}</article>`;
 }).join('');
 const library=(c.biblioteca||[]).map(x=>`<li>${escape(x.titulo)}${/^https?:\/\//.test(x.url||'')?' — '+escape(x.url):''}</li>`).join('');
 return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(c.titulo)} | Material de estudo</title><style>body{max-width:850px;margin:30px auto;padding:16px;background:#f6f9fc;color:#142d44;font:16px/1.65 system-ui,sans-serif}header{background:#06162b;color:#fff;padding:28px;border-top:5px solid #edb84a;border-radius:9px}article{border:1px solid #cbd6df;background:white;border-radius:9px;margin:20px 0;padding:25px}h1{line-height:1.15}h2{color:#0a375a}.num{color:#966922;font-size:12px;font-weight:800;text-transform:uppercase}.lead{font-weight:600}.activity{padding:14px;background:#fff8e8;border-left:4px solid #dda844}li{margin:5px 0}footer{color:#466078;font-size:12px}@media print{body{max-width:none;margin:0}} </style></head><body><header><small>WS Hub · Material de revisão</small><h1>${escape(c.titulo)}</h1><p>${escape(c.subtitulo||'')}</p><p>Carga horária: ${escape(c.cargaHoraria||'')} horas</p></header>${pieces}<article><h2>Biblioteca e materiais complementares</h2><ul>${library||'<li>Consulte a biblioteca online da formação.</li>'}</ul><small>Links externos exigem conexão com a internet.</small></article><footer>WS Hub · Material disponibilizado para estudo, conforme a formação contratada.</footer></body></html>`;
}
async function start(){try{
 const res=await fetch('https://ws-hub-api.dell-soares.workers.dev/api/publico/formacoes/'+encodeURIComponent(slug),{headers:{Authorization:'Bearer '+token},cache:'no-store'});
 if(!res.ok)return;const c=(await res.json()).formacao;
 if(c?.certificacao?.modalidade!=='corporativa')return;
 document.body.classList.add('ws-corporativa');
 const st=document.createElement('style');st.textContent='.ws-corporativa .ws-cert-button{display:none!important}.ws-export{margin:12px 0;border:1px solid #f3bd4b;color:#06162b;background:#f3bd4b;padding:10px 15px;border-radius:8px;font:700 13px system-ui;cursor:pointer}';document.head.append(st);
 const container=document.querySelector('.sidebar')||document.querySelector('.side')||document.querySelector('#app')||document.body;
 const box=document.createElement('section');const p=document.createElement('p');p.textContent='Turma corporativa · O certificado é emitido por QR Code, sem exigir conclusão das aulas.';p.style.cssText='font:600 12px/1.5 system-ui;color:inherit';box.append(p);
 const finish=Date.parse(c.certificacao.termino||'');if(Date.now()>=finish){
  const button=document.createElement('button');button.type='button';button.className='ws-export';button.textContent='Baixar conteúdo para revisão (.html)';
  button.addEventListener('click',()=>{const file=renderCourse(c),blob=new Blob([file],{type:'text/html;charset=utf-8'});
   const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='material-'+slug+'.html';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3000)});
  box.append(button);
 }else{
  const note=document.createElement('p');note.textContent='O download completo será liberado após o encerramento do treinamento.';note.style.cssText='font-size:12px;opacity:.85';box.append(note);
 }
 container.append(box);
 }catch(_){/* No offline não interfere com as aulas existentes. */}}
start();
})();
