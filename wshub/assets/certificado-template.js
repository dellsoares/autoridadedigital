/* WS Hub · Template digital único, A4 horizontal; nome em título e assinatura original. */
(()=>{'use strict';
const BRAND='/wshub/assets/logo-wendell-soares.png';
const SIGNATURE='/wshub/assets/assinatura-wendell-certificado.png';
const safe=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateBr=d=>d.toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric',timeZone:'America/Sao_Paulo'});
function displayName(value){
 const parts=String(value||'').normalize('NFC').trim().replace(/\s+/g,' ').toLocaleLowerCase('pt-BR').split(' ');
 const particles=new Set(['de','da','do','das','dos','e']);
 return parts.map((part,i)=>{
  if(i>0&&particles.has(part))return part;
  return part.replace(/(^|[-'’])([\p{L}])/gu,(_m,b,c)=>b+c.toLocaleUpperCase('pt-BR'));
 }).join(' ');
}

function printHtml(meta,person){
 const baseTitle=(meta.titulo||'Formação WS Hub').trim();
 const client=(meta.cliente||'').trim();
 const hasClient=client&&baseTitle.toLocaleLowerCase('pt-BR').includes(client.toLocaleLowerCase('pt-BR'));
 const fullTitle=baseTitle+(client&&!hasClient?' — '+client:'');
 const hasAddedClient=Boolean(client&&!hasClient);
 const nameSize=person.length>58?24:person.length>42?28:person.length>30?32:person.length>20?37:43;
 const courseSize=fullTitle.length>105?17:fullTitle.length>80?19:fullTitle.length>58?21:24;
 const workload=Number(meta.horas)>0?Number(meta.horas)+' '+(Number(meta.horas)===1?'hora':'horas'):'Conforme o programa';
 const when=meta.when||{label:'Data de conclusão',valor:dateBr(new Date())};
 const waves=Array.from({length:14},(_,i)=>{
  const t=i*13;
  return `<path d="M -50 ${575+t} C 100 ${528+t*0.42}, 110 ${725-t*0.47}, 310 ${675+t*0.2} S 510 ${695-t*0.2}, 610 ${745+t*0.08}" stroke="#0fb6ed" stroke-opacity="${(.08+i*.017).toFixed(3)}" fill="none" stroke-width="1"/>`;
 }).join('');
 const rightWaves=Array.from({length:12},(_,i)=>{
  const t=i*10;
  return `<path d="M 850 ${820-t} C 940 ${660-t}, 990 ${690-t*.4}, 1200 ${500-t} " stroke="#30c6ec" stroke-opacity="${(.10+i*.013).toFixed(3)}" fill="none" stroke-width="1"/>`;
 }).join('');
 // SVG shapes are foreground vectors, so the dark background prints even when
 // Chrome's 'background graphics' checkbox is disabled.
 return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Certificado · ${safe(person)} | WS Hub</title><style>
 @page{size:A4 landscape;margin:0}
 *{box-sizing:border-box}html,body{padding:0;margin:0;width:297mm;height:210mm}
 body{font:400 12pt/1.3 Arial,Helvetica,sans-serif;color:#eef6ff;-webkit-print-color-adjust:exact;print-color-adjust:exact}
 .paper{position:relative;width:297mm;height:210mm;margin:0;overflow:hidden;background:#041529;color:#f7f9ff;isolation:isolate}
 .scene{position:absolute;inset:0;width:100%;height:100%;z-index:-1}
 .brand-head{position:absolute;top:10mm;left:23mm;right:23mm;display:flex;justify-content:space-between;gap:5mm;align-items:center}
 .brand{display:flex;gap:3.2mm;align-items:center;min-width:0}
 .brand img{height:19mm;width:19mm;object-fit:contain;border-radius:50%;filter:drop-shadow(0 0 2mm #d0ad4960)}
 .brand-lines{border-left:.35mm solid #59bfe4;padding-left:4.5mm}
 .brand-title{white-space:nowrap;font-size:25pt;font-weight:850;letter-spacing:-1.5px;color:white;line-height:1.07}
 .brand-title b{color:#f3c55e;font-weight:850}
 .brand-sub{letter-spacing:2.5px;font-size:6.8pt;margin-top:1mm;text-transform:uppercase;color:#c9d8e8;font-weight:bold}
 .tagline{border-left:.25mm solid #31d6f5;padding-left:5.3mm;margin-left:3mm;font-size:7.4pt;font-weight:780;line-height:1.55;letter-spacing:1.5px;color:#5de6ff;text-transform:uppercase}
 .topright{text-align:right;text-transform:uppercase;letter-spacing:2px;font-size:7.8pt;line-height:1.8;color:#e3eaf4;white-space:nowrap}
 .topright b{font-size:9.2pt;color:#f6c65a;letter-spacing:2.3px}
 .kicker{position:absolute;top:37.7mm;left:22mm;right:22mm;text-align:center;text-transform:uppercase;letter-spacing:5px;font-size:9pt;color:#d6e3f3}
 .kicker:before,.kicker:after{content:'';display:inline-block;width:16mm;border-top:.33mm solid #2bd6f0;vertical-align:middle;margin:0 5mm 1mm}
 .heading{position:absolute;top:47mm;left:8mm;right:8mm;margin:0;text-align:center;font-size:32pt;line-height:1.11;font-weight:900;letter-spacing:-1.2px;color:#f8fbff;white-space:nowrap}
 .heading span{color:#f6c860}
 .title-streak{position:absolute;top:65.2mm;left:93mm;width:111mm;height:.55mm;background:linear-gradient(90deg,transparent,#2be0f5 32%,#f6ca59 67%,transparent);box-shadow:0 0 3mm #29aaf0aa}
 .given{position:absolute;top:74mm;left:15mm;right:15mm;text-align:center;margin:0;font-size:15pt;color:#e7f0fa}
 .person-box{position:absolute;top:84.7mm;left:27mm;right:27mm;min-height:20.7mm;display:flex;align-items:center;justify-content:center;text-align:center}
 .person-box:before,.person-box:after{content:'';position:absolute;top:0;bottom:0;width:11mm;border-top:.35mm solid #f5c45a;border-bottom:.35mm solid #f5c45a}
 .person-box:before{left:0;border-left:.35mm solid #f5c45a;border-radius:1.5mm 0 0 1.5mm}
 .person-box:after{right:0;border-right:.35mm solid #f5c45a;border-radius:0 1.5mm 1.5mm 0}
 .person{position:relative;z-index:1;margin:0 11mm;max-height:21mm;overflow:hidden;font-size:${nameSize}pt;font-weight:860;letter-spacing:-.5px;line-height:1.02;color:white;overflow-wrap:anywhere}
 .statement{position:absolute;top:108.4mm;left:13mm;right:13mm;text-align:center;color:#dce7f3;font-size:13.5pt;margin:0}
 .course{position:absolute;top:120mm;left:19mm;right:19mm;min-height:17.5mm;max-height:23mm;text-align:center;font-weight:850;font-size:${courseSize}pt;line-height:1.18;letter-spacing:-.45px;color:#fff;display:flex;justify-content:center;align-items:center;gap:2mm;flex-wrap:wrap;overflow:hidden}
 .course .client{color:#f6c860}
 .course-line{position:absolute;top:141.5mm;left:73mm;width:151mm;height:.25mm;background:linear-gradient(90deg,transparent,#19cfee,transparent)}
 .details{position:absolute;top:147mm;left:35mm;right:35mm;display:flex;justify-content:center;align-items:center;gap:12mm;min-height:15.5mm}
 .detail{display:flex;align-items:center;justify-content:flex-start;gap:3.5mm;min-width:63mm;max-width:120mm}
 .detail svg{flex:none;width:9.2mm;height:9.2mm;stroke:#f3c75c;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
 .detail .label{font-size:10pt;line-height:1.2;color:#e3eaf5;white-space:nowrap}
 .detail .value{font-size:12.1pt;color:#ffce65;font-weight:850;line-height:1.2;margin-top:1.1mm;overflow-wrap:anywhere}
 .detail-divider{height:12mm;border-left:.27mm solid #90b1c8;opacity:.8}
 .signature-area{position:absolute;top:161.8mm;left:93mm;width:111mm;text-align:center}
 .signature-area img{width:59mm;height:25mm;object-fit:contain;display:block;margin:0 auto -2.2mm;filter:drop-shadow(0 0 .85mm #579ffd50)}
 .sign-line{height:.27mm;background:linear-gradient(90deg,transparent,#ffce66 20%,#ffce66 80%,transparent);margin:0 auto 2mm;width:94mm}
 .sign-name{font-size:12.5pt;font-weight:850;color:white;line-height:1.2}
 .sign-role{font-size:9pt;color:#c9d8e8;margin-top:.5mm}
 .badge{position:absolute;right:24mm;top:162mm;width:30mm;height:32mm}
 .foot{position:absolute;bottom:10.2mm;left:40mm;right:40mm;display:flex;align-items:center;justify-content:center;gap:4mm;color:#cbd9e9;font-size:8.6pt;white-space:nowrap}
 .foot:has(a){font-size:7pt}
 .foot:before,.foot:after{content:'';width:15mm;border-top:.3mm solid #e5bf5a}
 @media screen{html,body{background:#edf2f8}body{display:flex;align-items:flex-start;justify-content:center}.paper{box-shadow:0 10px 45px #0c27435c}}
 </style></head><body>
 <article class="paper" aria-label="Certificado de conclusão de ${safe(person)}">
  <svg class="scene" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1123 794" preserveAspectRatio="none" aria-hidden="true"><defs>
   <radialGradient id="core" cx="50%" cy="42%" r="77%"><stop offset="0" stop-color="#063457"/><stop offset=".56" stop-color="#061a35"/><stop offset="1" stop-color="#020e1f"/></radialGradient>
   <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b37a25"/><stop offset=".45" stop-color="#ffdb78"/><stop offset="1" stop-color="#c18e39"/></linearGradient>
   <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#084e80"/><stop offset="1" stop-color="#03213c"/></linearGradient>
   <radialGradient id="aura"><stop offset="0" stop-color="#0a86b9" stop-opacity=".3"/><stop offset="1" stop-color="#073459" stop-opacity="0"/></radialGradient>
   <filter id="shine" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur stdDeviation="5"/></filter>
  </defs>
  <rect width="1123" height="794" fill="url(#core)"/>
  <ellipse cx="650" cy="430" rx="450" ry="380" fill="url(#aura)"/>
  <path d="M0 0 L112 0 L0 112Z" fill="url(#gold)"/>
  <path d="M0 105 L123 0 L175 0 L0 170Z" fill="#02142a"/>
  <path d="M0 208 L175 0 L0 317Z" fill="url(#blue)" stroke="#109fcd" stroke-width="1.4"/>
  <path d="M1123 794 L1010 794 L1123 686Z" fill="url(#gold)"/>
  <path d="M1123 680 L961 794 L904 794 L1123 604Z" fill="url(#blue)" stroke="#1881a6" stroke-width=".5"/>
  ${waves}${rightWaves}
  <g stroke="#119aca" stroke-opacity=".73" stroke-width="1.1" fill="none"><path d="M977 204 L1043 138 L1096 184 L1123 118"/><path d="M945 118 L1025 40 L1100 30"/><path d="M1085 230 L1123 182"/></g>
  <g fill="#0be9fa"><circle cx="977" cy="204" r="3.8"/><circle cx="1043" cy="138" r="4.6"/><circle cx="1096" cy="184" r="3.9"/><circle cx="1025" cy="40" r="2.4"/></g>
  <g fill="#0be9fa" opacity=".9"><circle cx="90" cy="699" r="4"/><circle cx="137" cy="753" r="3"/><circle cx="44" cy="743" r="2"/><circle cx="211" cy="744" r="3"/><circle cx="46" cy="618" r="2"/></g>
  <g fill="#0bbadf" opacity=".42">${Array.from({length:35},(_,i)=>`<circle cx="${14+(i%7)*18}" cy="${370+Math.floor(i/7)*19}" r="1"/>`).join('')}${Array.from({length:32},(_,i)=>`<circle cx="${1020+(i%8)*14}" cy="${660+Math.floor(i/8)*13}" r="1"/>`).join('')}</g>
  <path d="M729 84 L743 59 L833 59" fill="none" stroke="#e4bb4f" stroke-width="1.2"/>
  <rect x="470" y="244" width="188" height="4" rx="2" fill="#f1c75a" opacity=".55" filter="url(#shine)"/>
  </svg>
  <header class="brand-head"><div class="brand"><img src="${BRAND}" alt="Logo original WS Hub"><div class="brand-lines"><div class="brand-title">WS <b>Hub</b></div><div class="brand-sub">Wendell Soares</div></div><div class="tagline">Conhecimento,<br>Tecnologia e<br>Propósito.</div></div><div class="topright">Formação e aprendizagem<br><b>Certificação digital</b></div></header>
  <p class="kicker">Reconhecimento de aprendizagem</p>
  <h1 class="heading">CERTIFICADO DE <span>CONCLUSÃO</span></h1><div class="title-streak"></div>
  <p class="given">Certificamos que</p>
  <div class="person-box"><p class="person">${safe(person)}</p></div>
  <p class="statement">concluiu com êxito a formação</p>
  <div class="course"><span>${safe(baseTitle)}</span>${hasAddedClient?`<span class="client">— ${safe(client)}</span>`:''}</div>
  <div class="course-line"></div>
  <section class="details" aria-label="Dados da formação"><div class="detail"><svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12.8"/><path d="M16 7.5V16l6.2 3.7"/></svg><div><div class="label">Carga horária:</div><div class="value">${safe(workload)}</div></div></div><div class="detail-divider"></div><div class="detail"><svg viewBox="0 0 32 32" aria-hidden="true"><rect x="4.5" y="7" width="23" height="20" rx="2"/><path d="M10 4v6M22 4v6M5 13h22M10 19h2M17 19h2M22 22h2"/></svg><div><div class="label">${safe(when.label)}:</div><div class="value">${safe(when.valor)}</div></div></div></section>
  <section class="signature-area"><img src="${SIGNATURE}" alt="Assinatura de Wendell Soares"><div class="sign-line"></div><div class="sign-name">Wendell Soares</div><div class="sign-role">Responsável pela formação</div></section>
  <svg class="badge" viewBox="0 0 124 135" aria-hidden="true"><path d="M62 4 116 34V99L62 130 8 99V34Z" fill="#06233e" fill-opacity=".9" stroke="#23bfe0" stroke-width="2"/><path d="M62 12 108 38V96L62 122 16 96V38Z" fill="none" stroke="#f5c45a" stroke-width="2.8"/><path d="M29 58 62 42 95 58 62 74 29 58Z" fill="none" stroke="#f6ca60" stroke-width="3" stroke-linejoin="round"/><path d="M43 65v14q20 15 39 0V65M95 58v22" stroke="#f6ca60" stroke-width="3" fill="none" stroke-linejoin="round"/></svg>
  <footer class="foot">${meta.registro ? 'Registro digital: '+safe(meta.registro) : 'Certificado emitido por Wendell Soares / WS Hub.'}</footer>
 </article></body></html>`;
}

async function printCertificate(html){
 const frame=document.createElement('iframe');frame.setAttribute('aria-hidden','true');
 frame.style.cssText='position:fixed;top:0;left:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none;';
 document.body.append(frame);
 const doc=frame.contentDocument;doc.open();doc.write(html);doc.close();
 try{await Promise.race([Promise.all([...doc.images].map(img=>img.complete?Promise.resolve():new Promise(resolve=>{img.addEventListener('load',resolve,{once:true});img.addEventListener('error',resolve,{once:true})}))),new Promise(r=>setTimeout(r,3800))]);}catch(_){}
 await new Promise(r=>setTimeout(r,200));
 try{frame.contentWindow.focus();frame.contentWindow.print();}catch(err){frame.remove();throw err;}
 setTimeout(()=>frame.remove(),60000);
}


function whenFor(record){
 const begin=record.inicio?new Date(record.inicio):null;
 const finish=record.termino?new Date(record.termino):null;
 const valid=d=>d&&!Number.isNaN(d.getTime());
 if(valid(begin)&&valid(finish)&&dateBr(begin)!==dateBr(finish))return {label:'Período de realização',valor:dateBr(begin)+' a '+dateBr(finish)};
 const d=valid(finish)?finish:valid(begin)?begin:new Date();
 return {label:'Data de realização',valor:dateBr(d)};
}
async function print(meta,rawName){
 const person=displayName(rawName);
 if(person.length<5||person.length>100||person.split(' ').length<2||/\d/.test(person))throw Error('Informe seu nome completo.');
 const info={titulo:meta.titulo||'Formação WS Hub',cliente:meta.cliente||'',horas:Number(meta.horas||meta.cargaHoraria)||0,
  when:meta.when||whenFor(meta),registro:meta.registro||meta.id||''};
 await printCertificate(printHtml(info,person));
 return person;
}
window.WSHubCertTemplate=Object.freeze({print,render:printHtml,displayName,whenFor});
})();
