/* WS Hub · Boas-vindas IA na Prática: pop-up padrão do WS Hub com o instrutor. */
(()=>{'use strict';
const pending=window.WSIA&&window.WSIA.ready;
if(!pending)return;
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function begin(student){
 const identity=String(student&&((student.id||student.email||student.nome))||'aluno');
 const key='wshub:ia-na-pratica:boas-vindas:v1:'+identity;
 try{if(sessionStorage.getItem(key))return}catch(_){}
 const first=String(student&&student.nome||'').trim().split(/\s+/)[0]||'aluno';
 const dialog=document.createElement('dialog');
 dialog.id='ws-ia-boas-vindas';dialog.className='ws-ia-dialog';
 dialog.setAttribute('aria-label','Boas-vindas à formação IA na Prática');
 dialog.innerHTML='<div class="ws-ia-modal">'+
 '<section class="ws-intro-content">'+
 '<div class="ws-intro-kicker">WS Hub · Formação especial</div>'+
 '<div class="ws-intro-brand"><img src="/wshub/assets/logo-wendell-soares.png" alt="Marca WS Hub" width="53" height="53"><span><strong>WS <em>Hub</em></strong><small>Conhecimento, tecnologia e propósito.</small></span></div>'+
 '<h2>Olá, '+esc(first)+'.</h2>'+
 '<p>Preparei esta formação para ajudar você a utilizar a <strong>inteligência artificial de forma prática, criativa e responsável</strong> nos estudos e no começo da vida profissional.</p>'+
 '<p>O acesso nesta edição é gratuito. Aproveite para experimentar, questionar e aprender no seu ritmo.</p>'+
 '<p><strong>Conhecimento compartilhado é mais conhecimento.</strong></p>'+
 '<div class="ws-intro-insight"><img class="ws-intro-major-avatar" src="/assets/major-h/major-h-avatar.webp" alt="Major H" width="52" height="52" loading="eager"><div class="ws-intro-major-copy"><strong>Major H · Antes de começar</strong><span>São sete missões com explicações e desafios. Vou acompanhar você com dicas e orientações durante a jornada.</span></div></div>'+
 '<button type="button" class="ws-ia-btn" id="ws-ia-iniciar">Começar minha jornada</button>'+
 '</section>'+
 '<figure class="ws-intro-photo" aria-label="Wendell Soares apresenta a identidade do curso">'+
 '<img class="ws-intro-presenter" src="/wshub/aluno/naboa/assets/wendell-recorte-original.png" alt="Wendell Soares apresentando a formação" width="765" height="1024" loading="eager">'+
 '<img class="ws-intro-client-logo" src="assets/ia-arte-01.webp" alt="Ilustração da formação IA na Prática" loading="eager">'+
 '</figure></div>';
 document.body.append(dialog);
 dialog.addEventListener('cancel',e=>e.preventDefault());
 const button=dialog.querySelector('#ws-ia-iniciar');
 button.addEventListener('click',()=>{try{sessionStorage.setItem(key,'1')}catch(_){}dialog.close();dialog.remove()});
 try{dialog.showModal()}catch(_){dialog.setAttribute('open','')}
}
pending.then(({student})=>{if(student)begin(student)}).catch(()=>{});
})();
