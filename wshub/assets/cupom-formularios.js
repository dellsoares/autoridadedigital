/* WS Hub: campo opcional de cupom em pedidos de proposta na home. */
(()=>{'use strict';
 const form=document.getElementById('proposal-form');if(!form||form.querySelector('[name="cupom"]'))return;
 const fields=form.querySelector('.dialog-content')||form;
 const label=document.createElement('label');label.textContent='Cupom de desconto (opcional)';
 const input=document.createElement('input');input.type='text';input.name='cupom';input.id='wshub-cupom-home';input.maxLength=30;input.placeholder='Ex.: SOARES';input.autocomplete='off';label.append(input);
 const p=document.createElement('p');p.style.cssText='font-size:12px;color:#55677b;margin:0';p.textContent='O desconto será conferido pelo responsável antes da confirmação da proposta.';
 fields.append(label,p);
 try{
  const saved=JSON.parse(localStorage.getItem('wshub:cupom:soares:v1')||'null');
  if(saved?.codigo==='SOARES'&&saved?.token&&(!saved.expiraEm||Date.parse(saved.expiraEm)>Date.now()))input.value='SOARES';
 }catch(_){/* armazenamento não disponível */}
})();
