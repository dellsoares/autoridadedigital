# Correções técnicas de SEO — Wendell Soares

Este pacote é incremental. Ele contém somente os arquivos alterados ou novos, não o site inteiro.

## O que foi corrigido

1. **Texto alternativo das imagens**
   - A imagem dinâmica do lightbox da home recebeu um `alt` inicial descritivo.
   - Logos acompanhadas do nome escrito foram marcadas como elementos de apresentação, mantendo `alt=""` para evitar leitura duplicada por leitores de tela.

2. **Dados estruturados**
   - Home: `Person`, `WebSite` e `WebPage`.
   - Sobre: `ProfilePage` e `Person`.
   - Corporativo: `CollectionPage`, `ItemList` e quatro itens `Service`.
   - Os dados estruturados que já existiam nas páginas do blog, categorias e FAQ foram preservados.

3. **Sitemap e robots**
   - Criado `sitemap.xml` com as 13 URLs canônicas HTML que já existem no repositório.
   - Criado `robots.txt` com permissão de rastreamento e referência ao sitemap.

4. **Navegação e links antigos**
   - Menu e rodapé encaminham Blog para `/blog/`.
   - Os quatro links da prévia do blog que ainda apontavam para o Maestria GEO agora levam a páginas do domínio Wendell Soares.
   - A checagem local encontrou zero links internos para arquivos inexistentes.

## Como publicar no GitHub

1. Descompacte este ZIP.
2. Abra o repositório `dellsoares/autoridadedigital`.
3. Clique em **Add file → Upload files**.
4. Arraste o conteúdo descompactado, preservando as pastas.
5. O GitHub vai pedir confirmação para substituir os HTML existentes e adicionar `robots.txt` e `sitemap.xml`.
6. Faça o commit.

Não apague nem substitua `styles.css`, `script.js`, `assets/`, `CNAME`, PDFs ou outras pastas que não estejam neste pacote.

## Como conferir depois da publicação

Abra:
- https://wendellsoares.jor.br/robots.txt
- https://wendellsoares.jor.br/sitemap.xml

O sitemap deve listar 13 páginas HTML canônicas. Depois, se você usa Google Search Console, envie `https://wendellsoares.jor.br/sitemap.xml` na área **Sitemaps**.

## Sobre as 9 URLs não analisadas

O resumo do scanner informa apenas a quantidade, não os nove endereços. Não é seguro adivinhar quais são. O pacote foi verificado localmente: todos os links internos relativos encontrados nos HTMLs apontam para arquivos existentes.

Para fechar esse quarto item, abra o detalhe do alerta no scanner e envie a lista das nove URLs. Algumas podem ser PDFs ou páginas externas que não retornam HTML, o que não significa necessariamente que estejam quebradas. Com os endereços exatos, dá para separar:
- páginas internas com erro ou redirecionamento;
- links externos fora do seu controle;
- PDFs e outros arquivos que não devem ser avaliados como HTML.
