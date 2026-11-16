# FAQ automático no blog

A partir desta atualização, não é mais necessário cadastrar perguntas uma por uma no campo de FAQ do Pages CMS. O campo antigo continuará aparecendo para preservar artigos já publicados; deixe-o vazio nos novos artigos.

## Como escrever no artigo

No campo **Conteúdo do artigo**, coloque a seção de perguntas frequentes no final do texto, neste formato:

```markdown
## Perguntas frequentes

### Qual é a primeira pergunta?

Escreva aqui a resposta. Ela pode ter mais de um parágrafo e também pode conter **negrito** ou [links](https://exemplo.com).

### Qual é a segunda pergunta?

Escreva aqui a segunda resposta.

### Qual é a terceira pergunta?

Escreva aqui a terceira resposta.
```

## Regras simples

- Use `## Perguntas frequentes` uma única vez.
- Comece cada pergunta com `###`.
- Escreva a resposta logo abaixo da pergunta.
- Deixe a seção de FAQ no final do artigo.
- Não cadastre as mesmas perguntas no campo antigo de FAQ.

Ao salvar e publicar o artigo pelo Pages CMS, o GitHub Actions transforma automaticamente essa seção em acordeões no site.
