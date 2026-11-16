# Como publicar um artigo no blog

O site já possui um gerador automático. Ao publicar um arquivo de artigo na pasta `content/posts/` e enviar a alteração para a branch `main`, o GitHub Actions gera a página individual, atualiza o acervo da categoria, inclui o artigo na página principal do blog e atualiza o sitemap.

## Publicar usando HTML

1. Copie `content/posts/_MODELO-ARTIGO.html`.
2. Salve a cópia na mesma pasta com um nome simples, por exemplo `presenca-digital.html`.
3. Edite os campos YAML no início do arquivo: `title`, `slug`, `description`, `category`, `date`, `published`, `cover` e `cover_alt`.
4. Escreva ou cole o conteúdo em HTML abaixo do segundo `---`.
5. Use títulos `<h2>` para separar as seções. Eles recebem IDs automaticamente e aparecem no menu accordion “Navegue pelo artigo”.
6. Para inserir imagens no meio do texto, use os dois blocos `<figure class="ap-inline-image">` do modelo. Eles são opcionais: substitua o caminho, o texto alternativo e a legenda; apague o bloco se não for usar. Use de preferência imagens WebP/JPG/PNG dentro de `assets/posts/`.
7. Troque `published: false` para `published: true` somente quando o artigo estiver pronto.
8. Faça commit e push na branch `main`. A publicação acontece pelo workflow `Publicar site e artigos`.

## Categorias aceitas

Use exatamente um destes valores no campo `category`:

- `autoridade-digital`
- `experiencia-e-dados`
- `fora-de-orbita`
- `ia-na-pratica`
- `manual-de-sobrevivencia`
- `mergulho-profundo`
- `pitacos-digitais`
- `radar-de-novidades`

O artigo será publicado em `https://wendellsoares.jor.br/blog/SEU-SLUG/` e listado automaticamente na categoria escolhida.

## Imagens

- A capa é obrigatória e deve estar em `assets/posts/`.
- As imagens internas são opcionais. O modelo oferece dois espaços, mas você pode usar uma, duas ou nenhuma.
- Cada imagem deve ter `alt` descritivo. Use `<figcaption>` para legenda ou crédito.
- No HTML, prefira caminhos absolutos a partir da raiz do site, por exemplo `/assets/posts/foto-artigo.webp`.

## Regras importantes

- O `slug` deve ser único, em letras minúsculas, sem acentos e com hífens. Não altere depois de publicar.
- `date` e `updated` usam `AAAA-MM-DD`.
- O HTML do corpo aceita estrutura editorial e elementos comuns, mas remove scripts, estilos inline, iframes e atributos inseguros por segurança.
- Não inclua `<html>`, `<head>` ou `<body>` no conteúdo; cole apenas o fragmento que fica dentro do artigo.
- O arquivo `_MODELO-ARTIGO.html` é ignorado pelo gerador e nunca será publicado como artigo.

## Artigos antigos em Markdown

Os arquivos `.md` existentes continuam funcionando normalmente. O gerador aceita tanto Markdown quanto HTML; não é necessário converter o artigo que já está publicado.
