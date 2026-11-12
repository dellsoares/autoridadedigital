# Wendell Soares | Sites para músicos

Landing page de prospecção para apresentar a criação de sites para músicos, artistas solo, duos e bandas.

## O que está incluído

- `index.html`: página completa, textos, navegação e SEO.
- `css/styles.css`: layout responsivo, paleta e elementos visuais.
- `js/main.js`: menu mobile, pastas interativas, navegação por teclado e animações suaves.
- `assets/`: fotografias otimizadas em WebP, fornecidas pelo usuário.
- `assets/og-sites-musicos.svg` e `assets/og-sites-musicos.png`: imagens de compartilhamento.

## Identidade visual

A composição foi alinhada à linguagem da home de Wendell Soares:
- azul profundo com detalhes dourados;
- seções numeradas e sinalização editorial;
- órbitas, frequências, rotas e arquivo de missões;
- títulos em escrita natural, sem caixa alta integral;
- cartões de desempenho, conversão e autoridade reinterpretados para o universo musical.

A escala tipográfica foi refinada para se aproximar da home. O arquivo `css/overrides.css` concentra os ajustes de hierarquia e movimento, preservando o CSS original da landing page.

## Links já configurados

- Todos os CTAs comerciais levam para `https://wendellsoares.jor.br/#contato`.
- O case leva para `https://ciobalbino.com.br/`.

## Publicação no GitHub Pages

1. A landing page agora faz parte do repositório principal, dentro de `musicos/`. Não publique este diretório como um projeto independente.
2. Extraia o ZIP.
3. Envie os arquivos e pastas para a raiz do repositório. O `index.html` da landing page fica em `musicos/index.html` e é publicado na rota `/musicos/`.
4. No GitHub, abra **Settings → Pages**.
5. Em **Build and deployment**, selecione **Deploy from a branch**.
6. Escolha a branch `main` e a pasta `/ (root)`.
7. Salve e aguarde a publicação.

## Publicação como subpágina do domínio Wendell Soares

Se a hospedagem atual publicar arquivos estáticos em subpastas, coloque o conteúdo desta pasta em `musicos/` no repositório do site principal. O endereço planejado será:

`https://wendellsoares.jor.br/musicos/`

Antes de publicar, confirme se essa rota está livre e se o host publica o conteúdo da subpasta.

## Checklist de publicação

- [ ] Confirmar que o depoimento está na versão aprovada pelo Ció.
- [ ] Confirmar autorização de uso das fotografias.
- [ ] Conferir a URL final e ajustar `canonical` e `og:url` se necessário.
- [ ] Testar os links e a navegação no celular.
- [ ] Conferir a família tipográfica exata se o CSS original do site principal for integrado.


## Integração com o site principal

O header e o footer são gerados a partir dos arquivos compartilhados em `../shared/`. Para sincronizar alterações globais, execute `python ../scripts/sync-shared.py` na raiz do repositório.
