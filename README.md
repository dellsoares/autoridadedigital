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
- Terceiro artigo do blog aponta para `https://maestriageo.com.br/politica-online/` (link corrigido em todas as telas).
- No celular, a lista do rodapé não exibe **Contato** e o atalho flutuante do WhatsApp está oculto. As versões desktop desses elementos continuam como antes.
- O layout é modificado apenas na faixa até **700px**. Não houve remoção de serviços, projetos ou formulários.


## Versão 10 - ajustes de desktop e rodapé

- Corrigida a sobreposição do cabeçalho no painel lateral **Minha rota** em telas desktop (acima de 700px), elevando a camada da gaveta e do fundo escurecido.
- Removido definitivamente o botão flutuante do WhatsApp em todos os tamanhos de tela, inclusive código JavaScript associado à rolagem.
- Retirado **Contato** da lista de navegação do rodapé. O botão de contato no cabeçalho, a seção de contato e o formulário continuam intactos.
- Adicionado o link **FAQ** no rodapé, com destino `https://maestriageo.com.br/faq`, em desktop e mobile.
- Layout e componentes da V09 no mobile mantidos, exceto pela alteração de navegação do rodapé solicitada.
