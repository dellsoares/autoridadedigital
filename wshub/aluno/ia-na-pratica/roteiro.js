/* WS Hub · Roteiro pedagógico narrativo da formação IA na Prática.
   Cenários inteiramente fictícios; ferramentas são opcionais. */
window.IA_ROTEIRO = [
{
 kick:'O primeiro contato',scene:'Lia, estudante do Ensino Médio, está se preparando para uma vaga de jovem aprendiz. Ela pergunta a uma IA qual documento precisa apresentar. A resposta parece perfeita — mas cita uma regra que não existe. Se Lia compartilhar essa orientação, outra pessoa pode perder a inscrição.',
 problem:'Uma resposta bonita pode estar errada. Como aproveitar a velocidade da IA sem cair nessa armadilha?',
 learning:'Ao terminar, você vai identificar o que uma IA consegue fazer, reconhecer seus limites e aplicar um método simples de checagem.',
 connects:'Agora que você já sabe desconfiar de respostas bonitas demais, o próximo passo é aprender a dar instruções melhores.',
 concepts:[
 {title:'O que a IA realmente faz',text:'Uma IA generativa produz novas respostas a partir de padrões aprendidos e das informações que recebe. Ela não é uma pessoa, não tem experiência de vida e <strong>não confirma automaticamente cada frase</strong> em uma fonte. Pode escrever, resumir, classificar, ajudar a programar e gerar imagens, mas precisa de orientação.'},
 {title:'Por que parece tão convincente?',text:'Modelos foram treinados para gerar sequências de linguagem plausíveis. A fluência do texto pode esconder datas erradas, números inventados e fontes inexistentes. Esse fenômeno costuma ser chamado de <strong>alucinação</strong>. Até um link aparentemente oficial deve ser aberto e conferido.'},
 {title:'Os três filtros',text:'Antes de usar uma resposta, pergunte: <strong>qual é a fonte original?</strong> <strong>consigo confirmar a informação?</strong> <strong>o que acontece se eu estiver errado?</strong> Quanto maior o impacto sobre outra pessoa, maior o cuidado exigido.'}
 ],
 demo:{title:'Do palpite à informação verificável',before:'“A IA disse que todos os menores podem trabalhar em qualquer horário. Vou compartilhar.”',after:'“Quais são as regras brasileiras para jovem aprendiz? Identifique o que precisa de confirmação e me diga onde consultar a norma oficial. Não invente artigos de lei.”',why:'O segundo pedido reconhece que um texto gerado não vale como confirmação legal e orienta uma pesquisa com verificação humana.'},
 guided:[
 {question:'Uma IA cita um artigo de lei sem link oficial. Qual decisão vem primeiro?',options:['Repostar: a redação é segura.','Consultar o texto da lei em fonte oficial e conferir o artigo.','Pedir para a IA repetir a mesma resposta.'],answer:1,feedback:'Perfeito. Verificar não é desconfiar de tudo: é buscar a fonte primária quando há consequências.',wrong:'O tom de autoridade não substitui o texto original da lei.'},
 {question:'O conteúdo pode afetar a inscrição de um colega. Qual critério deve aumentar?',options:['O tamanho do texto.','A quantidade de emojis.','O nível de checagem e a atenção ao risco.'],answer:2,feedback:'Exatamente. Consequências relevantes exigem conferência mais cuidadosa.',wrong:'Quanto maior a consequência do erro, maior a necessidade de comprovação.'}
 ]
},
{
 kick:'Faça a pergunta certa',scene:'Depois de descobrir a informação correta, Lia precisa explicar por e-mail uma mudança no horário de uma atividade escolar. Ela digita “faz um e-mail”, e recebe um texto elegante com um horário inventado. O problema não era a escrita: era a falta de instruções.',
 problem:'Como transformar um pedido genérico em uma orientação que permita conferir cada detalhe?',
 learning:'Você vai construir um prompt com contexto, tarefa, critérios, formato e verificação, e aprender a pedir que a IA faça perguntas antes de agir.',
 connects:'Saber explicar o que você precisa também ajuda a aprender assuntos difíceis. Na próxima missão, a IA vira tutora — não cola.',
 concepts:[
 {title:'A estrutura de cinco partes',text:'Um prompt útil informa <strong>contexto</strong> (quem é você e a situação), <strong>tarefa</strong> (o que fazer), <strong>critérios</strong> (qualidade e limites), <strong>formato</strong> (como entregar) e <strong>verificação</strong> (o que não pode inventar ou precisa confirmar). Não existe frase mágica.'},
 {title:'A técnica da entrevista reversa',text:'Quando o pedido estiver incompleto, peça à IA que <strong>faça até quatro perguntas antes de responder</strong>. É especialmente útil em atendimento, e-mails, currículo e planejamento. Isso reduz adivinhações e mostra que tipo de informação falta.'},
 {title:'A segunda rodada vale ouro',text:'Não aceite nem descarte de imediato. Diga o que não funcionou: “Ficou longo”, “não temos essa informação”, “use linguagem mais simples”. Uma melhoria específica funciona melhor do que começar o pedido do zero repetidamente.'}
 ],
 demo:{title:'A mesma tarefa, dois resultados',before:'“Faça um e-mail avisando o cliente.”',after:'“Sou aprendiz em uma loja fictícia. Escreva um e-mail cordial de até 80 palavras informando que o atendimento será das 9h às 17h nesta sexta. Não invente motivo, contato ou novo prazo. Termine pedindo confirmação de recebimento.”',why:'O segundo exemplo informa público, contexto, dado confirmado, formato e limites — e deixa uma tarefa mais fácil de revisar.'},
 guided:[
 {question:'O cliente pergunta sobre um prazo que você ainda não sabe. Qual complemento melhora o prompt?',options:['“Invente um prazo realista.”','“Prometa a entrega para amanhã.”','“Diga que o prazo será confirmado pela equipe.”'],answer:2,feedback:'Boa escolha. A IA pode escrever a mensagem, mas não inventar a operação da empresa.',wrong:'Um bom prompt explicita as informações ausentes em vez de escondê-las.'},
 {question:'A IA respondeu de maneira agressiva. O que fazer?',options:['Solicitar reescrita em tom cordial e definir público e limite de palavras.','Enviar, porque ela sabe escrever.','Descartar a tarefa sem tentar corrigir.'],answer:0,feedback:'Isso é iteração: revisar com um critério claro e checar novamente.',wrong:'Peça uma revisão específica em vez de aceitar o primeiro rascunho.'}
 ]
},
{
 kick:'Estudar com autonomia',scene:'Lia recebeu uma prova de matemática para estudar. Uma ferramenta dá todas as respostas em segundos. Parece uma vitória, mas, quando surge um exercício parecido, ela não sabe por onde começar. O objetivo precisa mudar: de entregar para aprender.',
 problem:'Como usar a IA para entender, treinar e corrigir, sem pular o esforço que faz você aprender?',
 learning:'Você vai experimentar o tutor socrático, a explicação de volta, o estudo por etapas e a revisão ativa com fontes.',
 connects:'Com estudo e escrita melhores, agora Lia pode enfrentar situações reais de trabalho, em que prazos e pessoas entram na equação.',
 concepts:[
 {title:'Tutor, não resolvedor automático',text:'Peça à IA uma <strong>pista por vez</strong> e só avance depois da sua tentativa. Isso permite identificar onde você travou e praticar a etapa seguinte. Se a atividade exigir produção própria, respeite as regras da escola.'},
 {title:'Recordação ativa e revisão espaçada',text:'Depois de estudar, feche o texto e responda a perguntas sem consultar. Revise novamente depois de algum tempo. Você pode pedir à IA cartões, perguntas e simulados, mas <strong>precisa verificar gabaritos</strong> e não confundir facilidade com domínio do assunto.'},
 {title:'O teste de explicar de volta',text:'Explique o conteúdo com suas palavras e peça: “Onde minha explicação está incompleta ou confusa?”. Essa técnica revela lacunas que uma simples leitura não mostra. Se você não consegue explicar a ideia, ainda precisa praticar.'}
 ],
 demo:{title:'Resposta pronta versus aprendizado',before:'“Resolva a questão e me dê a resposta final imediatamente.”',after:'“Seja meu tutor. Mostre somente a primeira pista para resolver esta questão fictícia. Espere minha tentativa antes da próxima etapa. Se eu errar, explique o raciocínio sem dar o gabarito logo de início.”',why:'O segundo pedido exige participação do estudante: a IA vira uma parceira de prática, não uma substituta do esforço.'},
 guided:[
 {question:'Você terminou um resumo, mas não sabe se aprendeu. O melhor teste é:',options:['Ler o resumo sem parar.','Responder a questões de memória e explicar o assunto sem olhar.','Pedir outro resumo mais colorido.'],answer:1,feedback:'Recordação ativa mostra o que ficou na memória e o que precisa de revisão.',wrong:'Aprender exige conseguir recuperar e usar a informação sem depender do texto à frente.'},
 {question:'Um PDF escolar tem dados desatualizados. Qual atitude é apropriada?',options:['Tratar qualquer resumo de IA como atualização oficial.','Ignorar os dados do PDF.','Conferir as informações com material atualizado e autorizado.'],answer:2,feedback:'Mesmo ferramentas que trabalham com documentos dependem da qualidade e atualidade dessas fontes.',wrong:'A IA não corrige automaticamente erros do material que você fornece.'}
 ]
},
{
 kick:'Seu primeiro dia de trabalho',scene:'Lia começa como jovem aprendiz em uma empresa fictícia. Em uma manhã, recebe três tarefas: organizar perguntas comuns de clientes, preparar um e-mail e resumir uma reunião. Ela pode ganhar tempo com IA — mas não pode prometer coisas que a equipe não confirmou.',
 problem:'Como ser eficiente sem perder a responsabilidade por aquilo que será enviado ou registrado?',
 learning:'Você vai organizar prioridades, redigir uma comunicação profissional, preparar registros e simular um atendimento com revisão humana.',
 connects:'Uma vez entendido o trabalho, surge outra pergunta: qual ferramenta é realmente mais adequada para cada tipo de demanda?',
 concepts:[
 {title:'O processo vem antes do aplicativo',text:'Antes de abrir uma IA, entenda a demanda: <strong>o que precisa ser entregue, por quem, para quando e com quais informações</strong>? A ferramenta pode transformar dados confirmados em rascunhos, checklists e estruturas, mas não substitui autorização nem conhecimento do processo.'},
 {title:'E-mail profissional é mais que gramática',text:'Um bom e-mail tem assunto claro, contexto, informação principal, próximo passo e cordialidade. Para treinar, descreva um cenário fictício e peça que a IA seja um cliente exigente. <strong>Você responde primeiro; ela comenta depois.</strong>'},
 {title:'Reuniões, relatórios e planilhas',text:'Com registros permitidos, a IA pode ajudar a extrair decisões, pendências, responsáveis e prazos. Não transforme sugestões em decisões tomadas. Em tabelas, cheque fórmulas, números e cabeçalhos; não insira informações pessoais em ferramentas não aprovadas.'}
 ],
 demo:{title:'Da conversa solta ao encaminhamento',before:'“O cliente reclamou. Resolva aí e diga que está tudo certo.”',after:'“Cliente fictício pergunta sobre horário de atendimento. Os horários oficiais são 9h–17h, de segunda a sexta. Crie resposta cordial de até 70 palavras, sem inventar exceções. Liste o que a equipe ainda precisa confirmar antes do envio.”',why:'A segunda versão mantém apenas fatos fornecidos e transforma o trabalho da IA em rascunho revisável.'},
 guided:[
 {question:'Uma ata gerada pela IA traz uma decisão que ninguém tomou. Você deve:',options:['Excluir a informação e conferir o registro original.','Manter para parecer que a reunião rendeu.','Enviar assim porque a ferramenta estruturou bem.'],answer:0,feedback:'Exatamente. A IA não pode criar decisões institucionais.',wrong:'Uma ata precisa refletir o que foi efetivamente decidido.'},
 {question:'Um e-mail está educado, mas inclui uma promessa não autorizada. O melhor próximo passo é:',options:['Enviar para demonstrar iniciativa.','Remover a promessa, confirmar informações e revisar com o responsável.','Pedir que a IA torne a promessa mais convincente.'],answer:1,feedback:'Iniciativa responsável inclui saber o que precisa de confirmação.',wrong:'Escrever bem não autoriza prometer prazos, descontos ou condições.'}
 ]
},
{
 kick:'A ferramenta certa',scene:'Lia agora sabe formular pedidos. Mas recebe demandas diferentes: estudar uma apostila, preparar slides, encontrar pesquisas e dividir um projeto grande em tarefas. Um único aplicativo pode até tentar fazer tudo, mas nem sempre é a melhor escolha.',
 problem:'Como escolher pela tarefa, pelos limites e pela privacidade — e não pela ferramenta da moda?',
 learning:'Você conhecerá dez opções com caminhos gratuitos, suas diferenças, cuidados e critérios para decidir quando usar cada uma.',
 connects:'Ferramenta escolhida não significa uso autorizado. A próxima missão mostra os limites éticos e a proteção de dados.',
 concepts:[
 {title:'Escolha pela finalidade',text:'Para estudar uma apostila autorizada, prefira uma ferramenta voltada para <strong>fontes documentais</strong>. Para buscar estudos, procure uma ferramenta de <strong>pesquisa acadêmica</strong>. Para criar apresentação, um editor visual pode ajudar. A ferramenta mais conhecida nem sempre é a mais útil.'},
 {title:'Grátis não significa sem limites',text:'Planos gratuitos podem ter cotas, créditos, recursos limitados e condições que mudam. Antes de recomendar uma plataforma, cheque <strong>regras de acesso, faixa etária, política de dados, idioma e custos futuros</strong>. Não é necessário cadastrar-se em dez serviços para fazer esta missão.'},
 {title:'Quando não usar uma IA',text:'Se você já tem um fato objetivo, a fonte oficial pode ser mais rápida e confiável. Para dados pessoais, material sigiloso e decisões com impacto real, verifique autorização e controles. <strong>Escolher não usar também é uma decisão competente.</strong>'}
 ],
 demo:{title:'Problemas diferentes, escolhas diferentes',before:'“Tenho que fazer uma apresentação, então vou pedir texto longo a qualquer chatbot e colar direto no slide.”',after:'“Primeiro construo um roteiro de cinco mensagens essenciais; depois uso um editor de apresentações com IA, reviso dados, imagens e direitos de uso. Se os créditos gratuitos acabarem, monto os slides manualmente.”',why:'O melhor fluxo separa planejamento, ferramenta de produção e revisão final, com alternativa viável sem IA.'},
 guided:[
 {question:'Você quer estudar três PDFs fornecidos pela escola com permissão. Qual ferramenta foi escolhida para esse caso?',options:['NotebookLM, por trabalhar com fontes selecionadas.','Gamma, porque gera slides.','Goblin Tools, porque divide tarefas.'],answer:0,feedback:'Isso! A função principal vem antes da popularidade da marca.',wrong:'Para estudar documentos, uma ferramenta orientada a fontes selecionadas faz mais sentido.'},
 {question:'Você quer pesquisar evidências em artigos científicos. Qual é a escolha mais próxima?',options:['Canva.','Consensus.','Um gerador de imagens.'],answer:1,feedback:'O Consensus foi incluído para explorar pesquisa acadêmica. Ainda é necessário ler e avaliar os estudos.',wrong:'A busca de artigos é diferente de criar apresentações ou imagens.'},
 {question:'Uma empresa proíbe colar dados de clientes em sites externos. O melhor procedimento é:',options:['Pedir a um colega que use outra conta.','Usar o primeiro serviço gratuito encontrado.','Seguir a política da empresa e trabalhar com dados fictícios ou ferramentas aprovadas.'],answer:2,feedback:'Perfeito. Privacidade e autorização valem mais que qualquer conveniência.',wrong:'Gratuidade não dispensa autorização para tratar informações reais.'}
 ]
},
{
 kick:'O limite que protege pessoas',scene:'Chega uma planilha de reclamações com nomes, telefones e CPFs. Um colega sugere: “Cola tudo no chatbot e pede um resumo; é mais rápido”. Lia percebe que existe uma diferença entre ter acesso aos dados e estar autorizada a enviá-los a terceiros.',
 problem:'Como aproveitar a IA sem expor pessoas, inventar fatos ou assumir riscos indevidos?',
 learning:'Você vai reconhecer dados pessoais, entender cuidados básicos da LGPD e analisar situações de integridade, autoria e segurança.',
 connects:'Depois de aprender a criar e proteger, você está pronto para resolver um desafio completo usando o método das seis missões anteriores.',
 concepts:[
 {title:'Dado pessoal tem contexto e finalidade',text:'Nome, CPF, telefone e outros dados que identifiquem ou permitam identificar uma pessoa merecem proteção. A LGPD define regras para tratamento de dados pessoais. <strong>Não copie planilhas de terceiros</strong> para serviços sem autorização e sem saber como os dados serão usados.'},
 {title:'Ética é mais do que seguir a lei',text:'Uma IA pode reproduzir preconceitos, criar imagens sintéticas enganosas, inventar referências ou escrever um currículo com experiências inexistentes. Mesmo quando uma ferramenta permite gerar algo, <strong>isso não significa que seja correto publicar ou apresentar como verdadeiro</strong>.'},
 {title:'Seu checklist de segurança',text:'Antes de enviar qualquer material, pergunte: “Tenho permissão?” “Existe informação pessoal ou sigilosa?” “É possível retirar identificadores?” “A resposta será verificada?” “Há regras da escola ou empresa?” Para menores de idade, verifique também as regras de acesso do serviço.'}
 ],
 demo:{title:'Do risco ao procedimento seguro',before:'“Aqui estão os nomes, CPFs, telefones e reclamações reais de clientes. Faça um relatório.”',after:'“Com base apenas nestes dados fictícios e sem identificadores reais, crie um modelo de relatório que agrupe tipos de reclamação e sugira quais métricas podem ser calculadas internamente. Não gere nomes de clientes.”',why:'O objetivo do relatório é mantido, mas a versão de treino elimina exposição desnecessária e não tenta contornar políticas da empresa.'},
 guided:[
 {question:'Você recebeu dados reais de funcionários. Qual atitude está correta?',options:['Enviar tudo para uma ferramenta gratuita, porque é apenas estudo.','Verificar autorização, finalidade e política antes de qualquer envio.','Trocar somente o nome da primeira linha.'],answer:1,feedback:'Muito bem. Autorizações e controles vêm antes da conveniência.',wrong:'Dados reais não ficam automaticamente liberados para uso em aplicativos externos.'},
 {question:'Uma imagem gerada por IA parece mostrar um colega em situação constrangedora. Você:',options:['Publica como denúncia imediatamente.','Coloca uma legenda afirmando que é real.','Não trata como prova; verifica origem e considera o dano às pessoas.'],answer:2,feedback:'Isso protege a informação e as pessoas retratadas.',wrong:'Conteúdo sintético pode causar danos e não deve ser tratado como evidência de um fato.'}
 ]
},
{
 kick:'Agora a decisão é sua',scene:'Lia está pronta para uma oportunidade. A última tarefa parece simples: escolher uma demanda de estudo ou trabalho e resolvê-la com ajuda de IA. Mas agora ela conhece uma regra decisiva: a ferramenta é apenas uma parte do processo.',
 problem:'Você consegue justificar suas decisões, identificar riscos e revisar um resultado sem depender da IA?',
 learning:'Você vai montar seu próprio fluxo: definir objetivo, escolher ferramenta, formular prompt, verificar fontes e explicar uma melhoria.',
 connects:'Missão concluída: leve seu método para a escola, o estágio e situações reais. Continue aprendendo; aplicativos mudam, os bons critérios permanecem.',
 concepts:[
 {title:'Problema antes da solução',text:'Escreva em uma frase o que precisa entregar e por que isso importa. Descreva <strong>o público, o resultado esperado e o risco de erro</strong>. Só depois selecione a ferramenta — ou decida realizar sem IA.'},
 {title:'Seu método de cinco decisões',text:'1. Definir a tarefa. 2. Selecionar a ferramenta por função. 3. Formular uma instrução com limites. 4. Verificar fatos, privacidade e autoria. 5. Corrigir e explicar a decisão. Esse método vale mais do que decorar o nome de plataformas.'},
 {title:'Aprender a discordar da máquina',text:'Pergunte: “Qual pode ser o erro mais perigoso desta resposta?” e “O que depende de confirmação humana?”. Se a IA sugerir algo inadequado, <strong>você tem autonomia para recusar, corrigir ou começar de outro jeito</strong>.'}
 ],
 demo:{title:'O raciocínio completo',before:'“Preciso estudar e trabalhar melhor. Faça tudo para mim.”',after:'“Vou preparar uma revisão de matemática para a prova. Preciso praticar 20 minutos por dia, sem respostas prontas. Sugira perguntas graduais, espere minhas tentativas e ajude-me a conferir os resultados com o material da escola. Não solicite dados pessoais.”',why:'O pedido final tem objetivo, restrições, participação do aluno e forma de verificação. Mostra uma autonomia que continua valendo sem IA.'},
 guided:[
 {question:'Qual ordem representa melhor o processo que você aprendeu?',options:['Ferramenta → copiar → entregar.','Objetivo → ferramenta adequada → prompt → verificação → revisão.','Perguntar sem contexto → aceitar tudo.'],answer:1,feedback:'Correto! É o método da jornada inteira.',wrong:'Comece pelo problema; termine com a responsabilidade humana.'},
 {question:'A IA criou um texto sem fonte para uma informação decisiva. Sua decisão deve ser:',options:['Buscar a fonte original ou retirar o dado não confirmado.','Manter porque o texto ficou bom.','Pedir para a IA inventar uma citação.'],answer:0,feedback:'Essa é a postura profissional: preferir a precisão à aparência.',wrong:'A IA não pode transformar um dado não verificado em verdade por meio de uma boa redação.'}
 ]
}
];
