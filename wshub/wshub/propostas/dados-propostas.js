/*
 * WS Hub | Cadastro inicial das propostas
 * Uma página para todas as propostas: /propostas/?ref=identificador
 * Enquanto o painel administrativo não estiver pronto, novas propostas
 * são incluídas como novos registros aqui. Não é preciso criar outro HTML.
 * Atenção: GitHub Pages é público. Não coloque dados sigilosos neste arquivo.
 * Deixe valor e validade vazios até a aprovação comercial.
 */
window.WSHUB_PROPOSTAS = {
  "silvia-naboa": {
    numero:'',
    titulo: "Portal NABOA",
    subtitulo: "Inteligência artificial aplicada à comunicação socioambiental",
    chamada: "Formação prática e personalizada para integrar a IA à pesquisa, à produção de conteúdo e à rotina editorial do portal.",
    cliente: "Silvia Castro",
    organizacao: "Portal NABOA",
    logo: "assets/logo-naboa-original.webp",
    objetivo: "Desenvolver o uso prático, ético e responsável da inteligência artificial na rotina do Portal NABOA, respeitando sua identidade editorial e fortalecendo a pesquisa, a criação de conteúdo, o planejamento e a comunicação socioambiental.",
    encontros: 4,
    cargaHoraria: 16,
    modulos: [
      { titulo: "Fundamentos e prompts", horas: "4 horas", descricao: "Principais ferramentas, bons comandos, checagem de informações e cuidados no uso da IA.", icone: "spark" },
      { titulo: "Gemini e organização", horas: "4 horas", descricao: "Assistentes personalizados, Gems, NotebookLM e pesquisa com fontes organizadas.", icone: "file" },
      { titulo: "Conteúdo e originalidade", horas: "4 horas", descricao: "Planejamento de pautas, entrevistas, produção de textos e distribuição de conteúdo.", icone: "layers" },
      { titulo: "Flow, SEO e integração", horas: "4 horas", descricao: "Produção audiovisual, ética das imagens, SEO essencial e fluxo editorial integrado.", icone: "mega" }
    ],
    percurso: [
      { titulo: "Fundamentos e prompts", foco: "Escolher ferramentas e orientar a IA com critérios editoriais.", topicos: ["O que a IA pode e não pode fazer no jornalismo socioambiental", "ChatGPT, Gemini, Claude e Perplexity: escolher pela necessidade", "Estrutura de prompts: objetivo, contexto, fontes e limites", "Oficina de checagem, verificação e uso responsável"], resultado: "Uma pauta orientada por boas perguntas e um prompt revisável." },
      { titulo: "Gemini e organização", foco: "Construir assistentes e organizar pesquisa com base em fontes.", topicos: ["Gemini para pesquisa, produção e organização", "Criação e teste de Gems editoriais", "NotebookLM: fontes, documentos e sínteses", "Pesquisa aprofundada, referências e lacunas a conferir"], resultado: "Um assistente editorial configurado e uma base inicial de pesquisa." },
      { titulo: "Conteúdo e originalidade", foco: "Produzir conteúdo com identidade, apuração e distribuição planejada.", topicos: ["Escolha de pautas e preparação de entrevistas", "Escrita original a partir de fontes e experiências reais", "Revisão editorial, identidade e direitos", "Adaptação de uma matéria para diferentes formatos"], resultado: "Uma pauta trabalhada da apuração ao conteúdo revisado." },
      { titulo: "Flow, SEO e integração", foco: "Conectar audiovisual, visibilidade e fluxo editorial.", topicos: ["Roteirização de vídeos curtos no Google Flow", "Cuidados com imagens sintéticas e transparência", "Título, descrição, URL, links e texto alternativo de imagens", "Calendário editorial, indicadores e plano de aplicação em 30 dias"], resultado: "Um fluxo de produção editorial com critérios de revisão e próximos passos." }
    ],
    metodologia: [
      "Encontros práticos, com aplicação em pautas reais do portal.",
      "Recursos interativos para facilitar a assimilação, incluindo oficinas, análises, quizzes e widgets quando pertinentes.",
      "Exercícios guiados e atividades de aprendizagem.",
      "Prompts, modelos e recursos disponíveis no WS Hub.",
      "Acompanhamento, discussão e revisão durante os encontros."
    ],
    beneficios: [
      "Mais agilidade na produção de conteúdo.",
      "Comunicação clara, relevante e consistente.",
      "Uso responsável e seguro da IA.",
      "Maior organização das demandas editoriais.",
      "Autonomia para aplicar os recursos no dia a dia."
    ],
    investimento: "R$ 1.200,00",
    investimentoAnterior: "R$ 1.600,00",
    observacaoInvestimento: "Condição especial para Silvia. Como pagar? Como quiser.",
    condicoes: [
      "4 encontros de 4 horas (16 horas de formação).",
      "Aulas e exercícios no portal digital WS Hub.",
      "Material digital para consulta e revisão, sem uso de papel.",
      "Acesso ao conteúdo pelo tempo que desejar. Pela confiança. Pela amizade."
    ],
    validade: "A combinar",
    contatoWhatsApp: "5531983073854", // Substitua caso a proposta deva ir para outro número.
    experienciaUrl: "", // Demonstração padrão pendente; CTA atual apresenta somente o conteúdo programático.
    status: "rascunho"
  }
};
