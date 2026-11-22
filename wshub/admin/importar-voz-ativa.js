/* WS Hub · Importação incremental da formação Voz Ativa para Cloudflare.
   Não contém senha administrativa nem código de turma; exige autenticação pela API.
   O material didático completo permanece nos arquivos originais do portal. */
(()=>{'use strict';
const API='https://ws-hub-api.dell-soares.workers.dev';
const AUTH_KEY='wshub-admin-token-session-v1';
const $=id=>document.getElementById(id);
const result=$('result'), button=$('sync'), form=$('sync-form');
const base='/wshub/aluno/voz-ativa/';
const content=window.VOZ_ATIVA_CURSO;
const status=(msg,type='')=>{result.textContent=msg;result.className=type;};
if(!content||!Array.isArray(content.aulas)||content.aulas.length!==11){
  status('Não encontrei as 11 aulas no endereço publicado. Confira se o ZIP Voz Ativa foi enviado corretamente ao GitHub.','error');button.disabled=true;return;
}
$('lesson-count').textContent=String(content.aulas.length);
const jsonRequest=async(path,method='GET',body,token)=>{
  const headers={'Accept':'application/json','Content-Type':'application/json'};
  if(token)headers.Authorization='Bearer '+token;
  let res;
  try{res=await fetch(API+path,{method,headers,cache:'no-store',...(body===undefined?{}:{body:JSON.stringify(body)})});}
  catch(_){throw Error('Falha de conexão com Cloudflare. Confira sua internet e tente novamente.');}
  const data=await res.json().catch(()=>({}));
  if(!res.ok){const err=Error(data.erro||'Cloudflare retornou erro HTTP '+res.status);err.status=res.status;throw err;}
  return data;
};
const present=s=>s!==undefined&&s!==null&&(typeof s!=='string'||s.trim()!=='')&&(typeof s!=='object'||!Array.isArray(s)||s.length>0);
const blank=x=>x===undefined||x===null||x===''||(Array.isArray(x)&&!x.length);
const mergeAbsent=(existing,source)=>{
  const copy={...existing};
  for(const [k,v] of Object.entries(source))if(blank(copy[k]))copy[k]=v;
  return copy;
};
const describeLesson=a=>[
  a.lead,
  ...(a.blocos||[]).flatMap(b=>[b.titulo,b.texto,...(b.itens||[]).map(i=>'• '+i),b.exemplo?'Exemplo: '+b.exemplo:'',b.alerta?'Atenção: '+b.alerta:''].filter(Boolean))
].filter(Boolean).join('\n\n');
const activityText=a=>{
  const e=a.exercicio||{};
  return [e.titulo,e.descricao,...(e.campos||[]).map(x=>[x.rotulo,x.ajuda].filter(Boolean).join(': '))].filter(Boolean).join('\n');
};
const lessons=content.aulas.map(a=>({titulo:a.titulo,conteudo:describeLesson(a),atividade:activityText(a)}));
const modules=[
  {titulo:'Encontro 1 · Fundamentos de SEO aplicados ao jornalismo',horas:'4 horas',descricao:'SERPs, palavras-chave, intenção de busca, estrutura da notícia, links e oficina prática.',foco:'Melhorar a descoberta da notícia sem comprometer a apuração.',topicos:content.aulas.filter(a=>a.encontro===1).map(a=>a.titulo),resultado:'Uma notícia analisada e otimizada com critérios editoriais.',icone:'file'},
  {titulo:'Encontro 2 · SEO técnico, inteligência artificial e agilidade na redação',horas:'4 horas',descricao:'ALT, WebP, accordion, quiz, GitHub Pages, hard news e padronização.',foco:'Aplicar ferramentas de apoio e um fluxo rápido e verificável de publicação.',topicos:content.aulas.filter(a=>a.encontro===2).map(a=>a.titulo),resultado:'Checklist de redação, interativos e protocolo para hard news.',icone:'layers'}
];
const biblioteca=(content.biblioteca||[]).map(b=>({titulo:b.nome,url:new URL(b.href,'https://wendellsoares.jor.br'+base).href}));
const sourceCourse=code=>({
  id:'voz-ativa',slug:'voz-ativa',titulo:'SEO para jornalismo',subtitulo:'Otimização, inteligência artificial e alcance digital',
  senha:code,encontros:2,cargaHoraria:8,status:'Ativa',
  objetivo:'Capacitar a equipe do Jornal Voz Ativa para aplicar técnicas de SEO à produção jornalística, melhorando a estrutura, a encontrabilidade e o potencial de alcance dos conteúdos publicados no portal.',
  boasVindas:'Boas-vindas à formação SEO para jornalismo. O percurso reúne dois encontros, exercícios e um laboratório com casos públicos históricos. Confira as fontes antes de aplicar qualquer exemplo à cobertura atual.',
  modulos:modules,aulas:lessons,biblioteca,cronograma:[],participantes:[],original:true
});
const sourceClient={id:'jornal-voz-ativa',nome:'Jornal Voz Ativa',organizacao:'Jornal Voz Ativa',email:'',whatsapp:'',logo:'/wshub/propostas/assets/logo-voz-ativa.png',observacoes:'Formação em SEO para jornalismo. Até cinco participantes.'};
const sourceProposal={
  id:'voz-ativa',clientId:'jornal-voz-ativa',courseId:'voz-ativa',pagamento:'Pendente',status:'Rascunho',
  titulo:'Jornal Voz Ativa',subtitulo:'SEO para jornalismo — otimização, inteligência artificial e alcance digital',
  chamada:'Capacitação objetiva e prática para a equipe editorial, com fundamentos de SEO, publicação otimizada e formatos interativos criados com IA.',
  cliente:'Jornal Voz Ativa',organizacao:'Jornal Voz Ativa',logo:'/wshub/propostas/assets/logo-voz-ativa.png',
  objetivo:'Capacitar a equipe do Jornal Voz Ativa para aplicar técnicas de SEO à produção jornalística, melhorando a estrutura, a encontrabilidade e o potencial de alcance dos conteúdos publicados no portal.',
  encontros:2,cargaHoraria:8,modulos:modules,percurso:modules.map(({titulo,foco,topicos,resultado})=>({titulo,foco,topicos,resultado})),
  metodologia:['Fundamentos de SEO aplicados a notícias e casos da redação.','Demonstrações de ferramentas e recursos de inteligência artificial, com validação humana.','Exercícios com casos públicos históricos e documentos de apoio.','Modelos de accordion e quiz, com publicação no GitHub Pages.'],
  beneficios:['Mais clareza em títulos, subtítulos, URLs e imagens.','Pesquisa de intenção de busca e palavras-chave com critério editorial.','Agilidade sem comprometer a precisão jornalística.','Rotina padronizada com checklist.'],
  investimento:'R$ 1.000,00',investimentoAnterior:'R$ 2.400,00',observacaoInvestimento:'Condição promocional concedida em razão do espaço já cedido em divulgação. O pagamento poderá ser dividido conforme proposta do Jornal, sem contraproposta.',
  condicoes:['2 encontros de 4 horas (8 horas), até 5 participantes.','Apostilas cedidas integralmente após o treinamento.','Consultoria adicional de 3 horas, divididas em até 3 reuniões online, conforme decisão do Jornal.'],
  validade:'A combinar',contatoWhatsApp:'5531983073854',experienciaUrl:'',numero:'',observacoes:''
};
form.addEventListener('submit',async e=>{
  e.preventDefault();
  if(button.disabled)return;
  const code=$('course-code').value.trim().toLocaleUpperCase('pt-BR');
  if(!code){status('Informe o código da formação.','error');return;}
  button.disabled=true;button.textContent='Sincronizando…';
  try{
    status('Autenticando e consultando os cadastros…');
    let token=sessionStorage.getItem(AUTH_KEY)||'';
    const adminPass=$('admin-pass').value;
    if(adminPass){
      const auth=await jsonRequest('/api/admin/login','POST',{senha:adminPass});
      token=auth.token||'';
      if(!token)throw Error('Login não retornou uma sessão válida.');
      sessionStorage.setItem(AUTH_KEY,token);
      $('admin-pass').value='';
    }
    if(!token)throw Error('Digite a senha do painel administrativo para autorizar a importação.');
    const current=await jsonRequest('/api/admin/dados','GET',undefined,token);
    if(!Number.isInteger(current.revision)||!current.state)throw Error('Não consegui obter os dados existentes. Nenhuma alteração foi realizada.');
    const db=structuredClone(current.state);
    if(!Array.isArray(db.clientes)||!Array.isArray(db.formacoes)||!Array.isArray(db.propostas))throw Error('Formato do banco inesperado. Nenhuma alteração foi realizada.');
    const conflict=db.formacoes.find(f=>String(f.senha||'').toLocaleUpperCase('pt-BR')===code&&f.slug!=='voz-ativa');
    if(conflict)throw Error('Este código já está vinculado a outra formação: '+conflict.titulo+'. Escolha outro.');
    const existingClient=db.clientes.find(x=>x.id===sourceClient.id||x.organizacao?.toLocaleLowerCase('pt-BR')==='jornal voz ativa');
    const clientId=existingClient?.id||sourceClient.id;
    if(!existingClient)db.clientes.push(sourceClient);
    else db.clientes=db.clientes.map(x=>x.id===clientId?mergeAbsent(x,sourceClient):x);
    const existingCourse=db.formacoes.find(x=>x.slug==='voz-ativa'||x.id==='voz-ativa');
    const courseId=existingCourse?.id||'voz-ativa';
    let course=existingCourse?mergeAbsent(existingCourse,sourceCourse(code)):sourceCourse(code);
    course.senha=code;course.status='Ativa';course.original=true;
    if(!existingCourse)db.formacoes.push(course);
    else db.formacoes=db.formacoes.map(x=>x.id===courseId?course:x);
    const existingProposal=db.propostas.find(x=>x.id==='voz-ativa');
    const proposed={...sourceProposal,clientId,courseId};
    if(!existingProposal)db.propostas.push(proposed);
    else db.propostas=db.propostas.map(x=>x.id==='voz-ativa'?mergeAbsent(x,proposed):x);
    if(JSON.stringify(db)===JSON.stringify(current.state)){
      status('O curso já estava sincronizado. Dados existentes preservados.','ok');return;
    }
    status('Enviando cadastro para Cloudflare sem alterar o NABOA…');
    await jsonRequest('/api/admin/dados','PUT',{revision:current.revision,state:db},token);
    const verify=await jsonRequest('/api/admin/dados','GET',undefined,token);
    const found=verify.state?.formacoes?.find(x=>x.slug==='voz-ativa');
    if(!found||found.senha!==code||found.status!=='Ativa')throw Error('A gravação não pôde ser confirmada. Confira o painel antes de tentar novamente.');
    status('Sincronização confirmada!\nJornal Voz Ativa cadastrado · '+(found.aulas||[]).length+' aulas · 2 encontros · código ativo.\nAgora abra o painel e teste o login do aluno.','ok');
  }catch(err){status('Não foi possível sincronizar: '+(err.message||'Erro desconhecido')+'\nNenhum dado local foi alterado.', 'error');}
  finally{button.disabled=false;button.textContent='Sincronizar Voz Ativa';}
});
})();
