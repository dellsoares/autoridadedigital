# Wendell Soares | Site v0.7

Home estática em HTML, CSS e JavaScript. Esta versão corrige a troca entre o retrato pessoal e a logo do astronauta.

- Foto recortada: `assets/wendell-recortado.png`, usada somente no hero.
- Logo aprovada: `assets/simbolo-astronauta.webp`, usada no header, na apresentação “Quem conecta as peças”, na decoração de contato e no rodapé.
- Os cases e os seis artigos clicáveis permanecem como na versão 0.6.
- O formulário envia ao endpoint configurado em `https://formspree.io/f/xkjjdrae`. Faça um envio de teste após publicar.
- Abra `index.html` localmente ou publique os arquivos com caminhos relativos preservados.

O repositório GitHub é um pacote de arquivos pronto para subir, ainda não publicado por esta ferramenta.


## Versão 08
Animações suaves no hero e nos três pilares, contorno luminoso da foto, visualização ampliada de cases em lightbox, rodapé revisado e aviso compacto de privacidade. O aviso usa somente armazenamento local para memorizar o reconhecimento; atualmente não carrega scripts de publicidade. O formulário utiliza o endpoint Formspree configurado pelo proprietário.


## Versão 09 - experiência mobile

- Corrigida a janela **Minha rota** no celular: camadas acima do cabeçalho e dos botões flutuantes, título visível e botão de fechar acessível. Após fechar, rolagem e menu são restabelecidos.
- Setas de ação com cor e contraste consistentes com os controles existentes.
- **O ponto de partida** e **Algumas missões em destaque** agora exibem um card por vez no celular, com deslize horizontal, botões anterior/próximo e contador.
- Abas de **Arquivo de missões** passam a ficar encostadas no painel sem deslocamento vertical animado no celular.
- A prévia editorial da home direciona os temas para as categorias locais do blog e para a página Corporativo.
- No celular, a lista do rodapé não exibe **Contato** e o atalho flutuante do WhatsApp está oculto. As versões desktop desses elementos continuam como antes.
- O layout é modificado apenas na faixa até **700px**. Não houve remoção de serviços, projetos ou formulários.


## Versão 10 - ajustes de desktop e rodapé

- Corrigida a sobreposição do cabeçalho no painel lateral **Minha rota** em telas desktop (acima de 700px), elevando a camada da gaveta e do fundo escurecido.
- Removido definitivamente o botão flutuante do WhatsApp em todos os tamanhos de tela, inclusive código JavaScript associado à rolagem.
- Retirado **Contato** da lista de navegação do rodapé. O botão de contato no cabeçalho, a seção de contato e o formulário continuam intactos.
- A navegação do Blog aponta para `/blog/` e o FAQ aponta para `/faq/`, ambos no domínio próprio.
- Layout e componentes da V09 no mobile mantidos, exceto pela alteração de navegação do rodapé solicitada.


## Versão 11 — Central de Inteligência Digital

- Novo item **Widgets** no menu desktop e mobile, com âncora para a seção de ferramentas.
- Nova seção **Central de Inteligência Digital**, posicionada depois da apresentação e do blog e antes das perguntas frequentes.
- Quatro cards com as capas oficiais e links diretos para as ferramentas 01 a 04.
- Desktop: quatro cards em uma linha; tablet: grade 2 × 2.
- Mobile: carrossel cíclico automático e navegável para as três primeiras ferramentas; a ferramenta 04 aparece abaixo, sozinha.
- O carrossel pausa durante foco/interação e respeita a preferência do sistema por movimento reduzido.
- As capas são carregadas dos arquivos originais nos repositórios GitHub, usando URLs `raw.githubusercontent.com` fixadas nos commits informados.
- O Scanner WS aponta para o endereço `workers.dev` fornecido, mantendo o acesso funcional enquanto o domínio personalizado é finalizado.


## Versão 12 — ajustes técnicos de SEO

- Adicionado texto alternativo inicial à imagem dinâmica do lightbox; o JavaScript continua atualizando o alt conforme a imagem aberta.
- Marcas visuais repetidas acompanhadas de texto foram explicitamente identificadas como decorativas (`role="presentation"`), mantendo `alt=""` para evitar anúncios redundantes em leitores de tela.
- Adicionado JSON-LD `Person`, `WebSite` e `WebPage` à home.
- Adicionado JSON-LD `ProfilePage` e entidade `Person` à página Sobre.
- Adicionado JSON-LD `CollectionPage` e `ItemList` de serviços à página Corporativo.
- Criados `sitemap.xml` com as 13 páginas HTML canônicas existentes e `robots.txt` com referência ao sitemap.
- A navegação Blog e os links antigos da prévia editorial foram direcionados para páginas do domínio atual, sem dependência do Maestria GEO.
- A checagem local do pacote encontrou zero links internos apontando para arquivos inexistentes.

Observação: o relatório resumido do scanner informa nove URLs não analisáveis, mas não apresenta os endereços. Para corrigir esse item com precisão, é necessário conferir a lista detalhada dessas nove URLs; PDFs, destinos externos e redirecionamentos não devem ser tratados automaticamente como páginas HTML quebradas.


## Versão 10 - navegação global e landing page Músicos

- Header fixo e footer padronizados nas páginas do domínio principal.
- Menu Blog com submenu para as oito categorias existentes.
- Entrada própria **Músicos**, publicada em `/musicos/`.
- Landing page Músicos integrada ao repositório, com escala tipográfica aproximada à home e animações discretas, respeitando `prefers-reduced-motion`.
- Links de aprofundamento adicionados às apresentações de Sobre, Serviços e ao case de música.
- Sitemap atualizado com `/musicos/`.

### Componentes compartilhados

Os arquivos-mestre ficam em `shared/header.html` e `shared/footer.html`. O CSS e o comportamento do menu ficam em `shared/global.css` e `shared/global.js`.

Quando editar o header ou o footer, execute:

```bash
python scripts/sync-shared.py
```

A rotina replica os componentes no HTML estático de cada página. Assim, o site continua compatível com GitHub Pages, sem depender de inclusão de HTML por JavaScript no navegador. Para futuros subdomínios com repositórios independentes, será necessário incorporar também a pasta `shared/` e a rotina de sincronização.
