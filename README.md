# Wendell Soares · Autoridade Digital — Protótipo 05

Site estático responsivo, com HTML, CSS, JavaScript e imagens locais. A identidade visual segue a direção espacial em azul-marinho/dourado, usando a fotografia recortada de Wendell na abertura.

## Rodar localmente

Abra `index.html` no navegador. Para servir com HTTP local: `python3 -m http.server 8080` e abra `http://localhost:8080`.

## Publicar no GitHub

Crie um repositório vazio no GitHub e envie os arquivos da **raiz deste pacote** (index.html, styles.css, script.js, assets/). No GitHub Pages, escolha **Settings → Pages → Deploy from a branch → main / root**. Para usar domínio próprio, configure-o conforme seu provedor.

## Funcionalidades

- Hero com foto recortada, texto de autoridade e três pilares
- Faixa diagonal com rolagem contínua
- Mapa de soluções em seis pastas: toque numa pasta para abrir serviços, clique no título para detalhes, e + para adicionar à rota
- Botão-bússola Minha rota, com lista local ao navegador (localStorage)
- WhatsApp amarelo flutuante que desaparece durante a rolagem
- Arquivo de cases reais com carrosséis e capturas fornecidas
- Blog com três destaques externos e link para acervo completo
- Movimentos sutis com suporte a preferências de movimento reduzido

## Atenção

O formulário gera um briefing para copiar, mas **não envia dados**. Resultados exibidos em cases são registros do momento e não garantias futuras. Antes de colocar no ar, confirme autorização de uso de fotos, marcas, screenshots e material sensível.

## Arquivos

`index.html`, `styles.css`, `script.js`, `assets/`. Não requer build ou dependências npm.
