# Wendell Soares — Protótipo 04

Site estático (HTML/CSS/JS), adaptado para desktop e celular. Pode ser aberto localmente por `index.html` e hospedado em qualquer servidor estático.

## Ajustes aplicados

- Nova fotografia no hero: `assets/wendell-retrato.webp`. O astronauta continua no cabeçalho e na seção Sobre.
- Faixa de texto branca e azul-marinho, ampliada e levemente inclinada.
- Fundo amarelo em degradê na seção Visão, cantos arredondados em caixas e cards.
- Catálogo dos 20 serviços em azul claro/bege, com seleção marcada em dourado.
- Botão `Minha rota` fixo na parte inferior com contagem e painel lateral.
- Botão do WhatsApp flutuante na lateral direita, abrindo `wa.me/5531983073854`.
- Animação discreta de linha luminosa e estrela sobre o astronauta na seção Sobre (respeita preferência por movimento reduzido).
- Nova seção `Cases de estratégia consolidada` depois das missões em destaque, com seis abas com aparência de pastas de arquivo.
- Cinco cases com visuais e textos específicos, incluindo três carrosséis de capturas reais.
- Aba `Dados anonimizados` apresenta um painel agregado sem comparador antes/depois.
- Aba `Conteúdos de autoridade` com seis cards rodando continuamente no desktop e um por vez no celular.

## Importante

Os cinco primeiros cases usam materiais enviados pelo cliente. A aba de Conteúdos de autoridade ainda é demonstrativa. Verifique direitos de uso e autorização antes de publicar, especialmente para capturas e casos sensíveis.

O formulário prepara um briefing para cópia e **não envia dados**. O site não contém integração com backend, ferramenta de analytics nem disparos de formulário. A seleção `Minha rota` fica somente no navegador via localStorage.

## Arquivos

- `index.html`: página principal
- `sobre.html`: página sobre
- `styles.css`: interface, responsividade e animações
- `script.js`: filtros, seleção, drawers, casos e carrossel
- `assets`: marca e retrato

Observação: a animação foi feita com uma camada SVG sobre a imagem raster da marca e foi desenhada para a aplicação de destaque na seção Sobre. A logo definitiva poderá receber uma animação vetorial de trajetória ainda mais precisa.

## Atualização 04: cases reais

- Os três primeiros arquivos agora têm carrosséis de **três screenshots 16:9 cada**, na ordem indicada: Ângelo Oliveira, Ció Balbino e Dibloco.
- Cada galeria tem setas, pontos, navegação por teclado/toque, legenda individual e clique para ampliar o print original.
- Os textos e os quatro destaques de cada case foram substituídos pela copy revisada a partir das descrições do usuário.
- FAQ da Dibloco: a captura do Google demonstra uma aparição em um momento específico na Visão geral criada por IA para a pesquisa “melhor areia de quartzo sp”. Não é prova de uma posição fixa, título de “melhor fornecedor” ou causalidade isolada do FAQ.
- Wikidata ganhou captura relacionada à visibilidade em IA, devidamente identificada como evidência de busca, não uma captura do Wikidata.
- Dados anonimizados mostra somente o painel de resultado agregado; **o comparador antes/depois foi retirado**, conforme solicitado.
- A sexta aba, Conteúdos de autoridade, continua demonstrativa até o recebimento dos seis cards reais.
- Capturas de sites, pesquisas e dados de terceiros devem ser publicadas com as permissões e cuidados de privacidade cabíveis.
