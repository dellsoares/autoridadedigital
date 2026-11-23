/* Major H original · adaptação contextual para curso IA na Prática.
   Avatar e expressões carregados dos arquivos oficiais já publicados no repositório.
   Interação programada: sem IA externa, sem coleta de dados. */
(()=>{'use strict';
if(window.__WS_MAJOR_IA__)return;window.__WS_MAJOR_IA__=true;
const PATH='/assets/major-h/';
const IMAGES={inicio:'major-h-avatar.webp',dica:'major-h-confident.webp',desafio:'major-h-thinking.webp',conclusao:'major-h-happy.webp'};
const el=document.createElement('aside');el.id='ws-major-aluno';el.setAttribute('aria-label','Major H, assessor de aprendizagem');
el.innerHTML=`<section class="wma-panel" id="wma-panel" role="dialog" aria-label="Orientações didáticas do Major H" hidden><header class="wma-head"><img src="${PATH+IMAGES.inicio}" alt="" onerror="this.style.display='none'"><div><strong>Major H</strong><small>Assessor de aprendizagem</small></div><button type="button" class="wma-close" aria-label="Fechar orientações">×</button></header><div class="wma-content"><div class="wma-label" id="wma-label">Orientação do momento</div><div class="wma-bubble" id="wma-bubble" aria-live="polite"></div><p class="wma-prompt" id="wma-prompt"></p><div class="wma-actions"><button type="button" data-mode="dica" aria-pressed="true">Dica</button><button type="button" data-mode="desafio" aria-pressed="false">Desafio</button><button type="button" data-mode="conclusao" aria-pressed="false">Checklist</button></div></div><footer class="wma-footer">Major H · Orientações didáticas, sem coleta de dados <span class="wma-xp" id="wma-xp"></span></footer></section><button type="button" class="wma-launch" aria-label="Abrir Major H" aria-expanded="false" aria-controls="wma-panel" title="Major H — Seu assessor de aprendizagem"><span class="wma-fallback" aria-hidden="true">H</span><img src="${PATH+IMAGES.inicio}" alt="" onerror="this.style.display='none'"></button>`;
document.body.append(el);
const $=s=>el.querySelector(s),launch=$('.wma-launch'),panel=$('.wma-panel'),close=$('.wma-close');
let mode='dica',open=false;
function source(){return window.IA_MAJOR_CONTEXT||{route:'inicio',stage:0}}
function getContent(m,r){
 if(m.route==='inicio'){
   const d={dica:['Seu aprendizado começa pelo problema, não pelo aplicativo. Siga a sequência: entenda, observe, experimente e aplique.','O mapa mostra as sete missões e a ordem em que cada uma prepara a próxima.'],desafio:['Pense em uma situação em que você já usou uma tecnologia sem compreender o resultado. O que gostaria de aprender a conferir?','Guarde esse exemplo; você voltará a ele durante a jornada.'],conclusao:['Antes da primeira missão: entendi como o curso funciona? Sei que posso errar durante os exercícios? Vou usar dados fictícios?','Seu progresso fica apenas neste navegador.']}[mode];
   return {text:d[0],sub:d[1]};
 }
 if(m.route==='acervo')return mode==='dica'?{text:'Não tente decorar dez marcas. Compare as ferramentas pelo problema que resolvem e pelos seus limites.',sub:'Versão gratuita não significa uso sem limites nem sem regras de privacidade.'}:mode==='desafio'?{text:'Você precisa estudar um documento permitido, criar slides e comparar pesquisas. Qual serviço escolheria para cada necessidade?',sub:'Responda justificando a função, não a popularidade.'}:{text:'Defini a tarefa? Conferi regras de acesso e privacidade? Entendi o que é gratuito? Tenho um plano caso o serviço esteja indisponível?',sub:'Escolher não usar IA também pode ser a decisão certa.'};
 if(m.route==='certificado')return {text:'Conhecimento é o que você consegue explicar e aplicar, não apenas a medalha. Revise os casos em que errou.',sub:'A emissão é feita pelo WS Hub, com o nome da sua inscrição, após registrar as sete missões e enviar a avaliação final.'};
 const stage=m.stage??0,module=m.module||{},script=m.script||{},tasks=module.task||{},guided=script.guided||[];
 const tips=[
 ['Aqui você não precisa responder ainda. Primeiro entenda o problema que Lia encontrou.',script.problem],
 ['Leia a explicação e transforme a ideia principal em uma frase sua. O objetivo é entender, não memorizar.',script.concepts?.[0]?.title],
 ['Compare o primeiro impulso com a versão pensada. Descubra o que mudou e qual risco foi evitado.',script.demo?.why],
 ['Errar durante o treino não é reprovação. Leia a explicação da escolha e tente de novo.',guided[0]?.question],
 ['No laboratório, escreva sua própria solução antes de usar qualquer prompt. O exemplo é um apoio, não uma resposta para copiar.',tasks.brief],
 ['Leia cada cenário, pense nas consequências e escolha. Depois confira a explicação de cada resposta.',module.objective],
 ['Antes de celebrar, tente explicar o raciocínio que você aprendeu sem olhar os cartões.',script.connects]
 ];
 const challenges=[
 ['O que você faria diante do problema apresentado?',script.problem],
 ['Consegue explicar o conceito de hoje sem usar as mesmas palavras do texto?',script.concepts?.[1]?.title],
 ['Se uma informação estiver incompleta, o que precisa mudar no pedido?',script.demo?.title],
 [guided[0]?.question||'Qual decisão você tomaria?', 'Registre por que as outras opções não servem.'],
 [tasks.title||'Sua atividade','Escolha um critério do checklist e explique como o aplicaria.'],
 ['Qual erro seria mais perigoso neste tipo de tarefa?', 'Reflita antes de enviar as respostas.'],
 ['Como esta habilidade ajuda na escola ou no trabalho?',script.connects]
 ];
 if(mode==='dica')return {text:tips[stage]?.[0],sub:tips[stage]?.[1]||'Faça uma etapa por vez.'};
 if(mode==='desafio')return {text:challenges[stage]?.[0],sub:challenges[stage]?.[1]||'Pense antes de clicar.'};
 return {text:stage===4?(tasks.criteria||[]).map((x,i)=>`${i+1}. ${x}`).join('\n'):'Antes de seguir: entendi o motivo desta etapa? Consigo explicar a ideia? Conferi o que pode estar errado?',sub:'Não avance só para ganhar XP. Avance quando entender.'};
}
function render(){const m=source();let content=getContent(m,m.script);if(typeof content!=='object'||!content.text)content={text:'Aprenda com calma, verifique informações e use exemplos fictícios.',sub:m.title||'WS Hub'};
$('#wma-label').textContent=mode==='dica'?'Major H · Uma orientação':mode==='desafio'?'Major H · Experimente':'Major H · Antes de avançar';$('#wma-bubble').textContent=content.text;$('#wma-prompt').textContent=content.sub||'';
const portrait=$('.wma-head img');portrait.src=PATH+IMAGES[mode];
$$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));
$('#wma-xp').textContent=m.index!==undefined?` · Missão ${m.index+1}/7`:'';
}
function $$(s){return [...el.querySelectorAll(s)]}
function toggle(value){open=value;panel.hidden=!open;launch.setAttribute('aria-expanded',String(open));if(open){render();close.focus()}else launch.focus()}
launch.addEventListener('click',()=>toggle(!open));close.addEventListener('click',()=>toggle(false));$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;render()}));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&open)toggle(false)});
document.addEventListener('click',e=>{if(open&&!el.contains(e.target))toggle(false)},true);
window.addEventListener('ws:major-ia-update',()=>{if(open)render()});window.addEventListener('ws:major-ia-open',()=>toggle(true));
render();
})();
