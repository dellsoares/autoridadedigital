/* WS Hub · Cupom SOARES e recusa opcional de propostas (sem serviços pagos). */
(()=>{'use strict';
if(window.__WSHUB_BENEFICIOS__)return;window.__WSHUB_BENEFICIOS__=true;
const API='https://ws-hub-api.dell-soares.workers.dev';
const params=new URLSearchParams(location.search);const ref=params.get('ref')||'';
const style=document.createElement('link');style.rel='stylesheet';style.href='/wshub/propostas/beneficios.css?v=1';document.head.append(style);
const store=(()=>{try{return localStorage}catch{return {getItem:()=>null,setItem:()=>{}}}})();
const $=id=>document.getElementById(id);
const percBR=n=>Number(n).toLocaleString('pt-BR')+'%';
const expiry=iso=>new Date(iso).toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});
const getJSON=key=>{try{return JSON.parse(store.getItem(key)||'null')}catch{return null}};
const saveJSON=(key,v)=>store.setItem(key,JSON.stringify(v));
let currentInfo='',validDiscount=null,ready=false;
// Portabilidade do cupom por link assinado, sem exigir cadastro.
const voucherFromUrl=params.get('cupom');
if(voucherFromUrl && /^[A-Za-z0-9_-]{40,2000}\.[A-Za-z0-9_-]{20,1000}$/.test(voucherFromUrl)){
 const value={codigo:'SOARES',token:voucherFromUrl};
 try{store.setItem('wshub:cupom:soares:v1',JSON.stringify(value));history.replaceState(null,'',location.pathname+(ref?'?ref='+encodeURIComponent(ref):'')+location.hash)}catch(_){}
}
window.WS_HUB_BENEFICIOS={mensagem:()=>currentInfo};
function requestedCoupon(){return getJSON('wshub:cupom:soares:v1')}
function requestedBonus(){return getJSON('wshub:recusa-bonus:'+ref+':v1')}
async function verify(code){
 const coupon=requestedCoupon(),bonus=requestedBonus();
 const res=await fetch(API+'/api/publico/beneficios/validar',{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({propostaId:ref,codigo:code,cupomToken:coupon?.token||'',bonusToken:bonus?.token||''})});
 const data=await res.json().catch(()=>({}));if(!res.ok)throw Error(data.erro||'Falha de validação');return data;
}
function parseBRL(s){const m=String(s||'').match(/R\$\s*([\d.,]+)/);if(!m)return null;const n=Number(m[1].replace(/\./g,'').replace(',','.'));return Number.isFinite(n)&&n>0?n:null}
async function applyBenefits(){
 const input=$('ws-coupon-input'),status=$('ws-benefit-status');if(!input)return;
 const code=input.value.trim().toUpperCase();
 status.textContent='Verificando benefício…';status.dataset.state='';
 try{
   const result=await verify(code);
   validDiscount=result;
   const items=[],sub=[];
   if(code==='SOARES'){
     if(result.soares){items.push('SOARES'+(result.soares.percentual?' ('+percBR(result.soares.percentual)+')':' (percentual a configurar)'));sub.push('SOARES válido até '+expiry(result.soares.expiraEm));}
     else sub.push('Código SOARES sem comprovante válido neste navegador. Se recebeu o cupom em outro aparelho, informe-o ao solicitar atendimento.');
   }
   if(result.bonus){items.push('Bônus de recusa (5%)');sub.push('Bônus válido até '+expiry(result.bonus.expiraEm));}
   const pct=Number(result.percentualTotal)||0;
   const base=parseBRL($('investment-value')?.textContent);
   if(pct>0&&base){sub.push('Estimativa com benefício: '+(base*(1-pct/100)).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})+' (sujeita à confirmação do responsável).');}
   currentInfo=items.length?'Benefício solicitado: '+items.join(' + ')+'. '+sub.join(' '):code?'Cupom informado: '+code+' (validação pendente).':'';
   status.textContent=sub.length?sub.join(' · '):'Nenhum cupom ativo encontrado.';
   status.dataset.state=(result.soares||result.bonus)?'ok':'info';
 }catch(e){validDiscount=null;currentInfo=code?'Cupom informado: '+code+' (validação pendente).':'';status.textContent=e.message||'Falha ao consultar benefício';status.dataset.state='error';}
}
function render(){if(!ref||!$('approve-action')||ready)return;ready=true;
 const target=document.querySelector('.aside-block.investment'),actions=document.querySelector('.proposal-actions');if(!target||!actions)return;
 const coupon=document.createElement('section');coupon.id='ws-benefit';
 coupon.innerHTML=`<h3>Tem um cupom?</h3><label for="ws-coupon-input">Código de desconto</label><div class="ws-coupon-row"><input id="ws-coupon-input" type="text" maxlength="24" placeholder="Digite SOARES" autocomplete="off"><button id="ws-coupon-use" type="button">Aplicar</button></div><p id="ws-benefit-status" role="status">O código SOARES é liberado após o feedback de uma formação concluída e vale por 30 dias.</p>`;
 target.append(coupon);
 const decline=document.createElement('button');decline.type='button';decline.id='ws-decline';decline.className='action action-secondary';decline.textContent='Não aceitar esta proposta';actions.insertBefore(decline,$('pdf-action'));
 const dialog=document.createElement('dialog');dialog.className='ws-refuse-dialog';dialog.id='ws-refuse-dialog';dialog.setAttribute('aria-label','Feedback de proposta recusada');
 dialog.innerHTML=`<div class="ws-refuse-head"><img src="/assets/major-h/major-h-avatar.webp" alt="Major H"><div><small>Major H · WS Hub</small><h2>Posso entender sua decisão?</h2></div><button type="button" id="ws-refuse-x" aria-label="Fechar">×</button></div><div class="ws-refuse-body"><p>Entendo que este pode não ser o momento de ampliar seus conhecimentos. Gostaria de compreender o motivo para aprimorar as próximas propostas. <strong>Responder é opcional</strong> e leva menos de um minuto.</p><form id="ws-refuse-form"><label for="ws-refuse-motivo">Qual foi o principal motivo?</label><select id="ws-refuse-motivo" required><option value="">Selecione uma opção</option><option>Investimento</option><option>Momento ou agenda</option><option>Formato</option><option>Conteúdo</option><option>Outro motivo</option></select><label for="ws-refuse-details">Quer acrescentar algo? (opcional)</label><textarea id="ws-refuse-details" maxlength="320" rows="2" placeholder="Sua sugestão será considerada."></textarea><p role="alert" id="ws-refuse-error" hidden></p><div class="ws-refuse-actions"><button type="button" id="ws-refuse-no">Prefiro não responder</button><button type="submit" id="ws-refuse-send">Enviar motivo</button></div></form><section id="ws-refuse-thanks" hidden><strong>Obrigado por compartilhar.</strong><p>Seu feedback merece mais. Se decidir retomar esta proposta em até <b>48 horas</b>, você terá <b>5% de desconto adicional</b>, além de outro cupom válido que possua. O benefício ficará salvo neste navegador e poderá ser mencionado ao solicitar a aprovação.</p><p id="ws-refuse-expiry"></p><button type="button" id="ws-refuse-back">Voltar à proposta</button></section><small class="ws-refuse-privacy">Sua decisão é voluntária. Não pedimos dados pessoais neste formulário.</small></div>`;
 document.body.append(dialog);
 const dont=()=>{store.setItem('wshub:proposta:recusa-vista:'+ref,'1');dialog.close()};
 const show=()=>{if(!store.getItem('wshub:proposta:recusa-vista:'+ref))dialog.showModal()};
 decline.addEventListener('click',show);
 dialog.querySelector('#ws-refuse-x').addEventListener('click',dont);
 dialog.querySelector('#ws-refuse-no').addEventListener('click',dont);
 dialog.addEventListener('cancel',e=>{e.preventDefault();dont()});
 dialog.querySelector('#ws-refuse-back').addEventListener('click',()=>dialog.close());
 dialog.querySelector('#ws-refuse-form').addEventListener('submit',async e=>{
   e.preventDefault();const motivo=$('ws-refuse-motivo').value;
   const btn=$('ws-refuse-send'),err=$('ws-refuse-error');btn.disabled=true;btn.textContent='Enviando…';err.hidden=true;
   try{
     const res=await fetch(API+'/api/publico/propostas/recusa',{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json'},body:JSON.stringify({propostaId:ref,motivo,detalhes:$('ws-refuse-details').value})});
     const out=await res.json().catch(()=>({}));if(!res.ok||!out.bonus?.token)throw Error(out.erro||'Falha ao registrar.');
     saveJSON('wshub:recusa-bonus:'+ref+':v1',{token:out.bonus.token,expiraEm:out.bonus.expiraEm});
     store.setItem('wshub:proposta:recusa-vista:'+ref,'1');
     $('ws-refuse-expiry').textContent='Válido até '+expiry(out.bonus.expiraEm)+'.';
     $('ws-refuse-form').hidden=true;$('ws-refuse-thanks').hidden=false;
     await applyBenefits();
   }catch(ex){err.hidden=false;err.textContent=ex.message||'Falha de conexão';}
   finally{btn.disabled=false;btn.textContent='Enviar motivo'}
 });
 $('ws-coupon-use').addEventListener('click',applyBenefits);
 $('ws-coupon-input').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();applyBenefits()}});
 if(requestedCoupon()?.token){$('ws-coupon-input').value='SOARES';applyBenefits();}
 else if(requestedBonus()?.token){applyBenefits();}
}
function start(){
 if(!ref){
  // O catálogo é criado de maneira assíncrona por proposta.js.
  // Acrescenta o cupom somente depois que o formulário estiver montado.
  const enhance=()=>{
   const form=document.querySelector('#ws-c-form form');if(!form)return false;
   if(!form.querySelector('[name="cupom"]')){
    const label=document.createElement('label');label.textContent='Cupom de desconto (opcional)';
    const input=document.createElement('input');input.name='cupom';input.maxLength=30;input.placeholder='Ex.: SOARES';input.autocomplete='off';label.append(input);
    const p=document.createElement('p');p.textContent='O benefício será conferido antes da confirmação da proposta.';
    p.style.cssText='font-size:12px;color:#bdd2e6;margin:0 0 10px';
    form.insertBefore(label,form.querySelector('button[type=submit]'));
    form.insertBefore(p,form.querySelector('button[type=submit]'));
   }
   const c=form.querySelector('[name="cupom"]');if(c && requestedCoupon()?.token)c.value='SOARES';
   return true;
  };
  if(!enhance()){
   const obs=new MutationObserver(()=>{if(enhance())obs.disconnect()});
   obs.observe(document.body,{childList:true,subtree:true});
  }
  return;
 }
 const body=$('conteudo');if(!body)return;if(!body.hidden){render();return;}const obs=new MutationObserver(()=>{if(!body.hidden){obs.disconnect();render();}});obs.observe(body,{attributes:true,attributeFilter:['hidden']});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
