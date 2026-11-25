# Geradores de conteúdo

O painel possui dois geradores:

1. **Gerador de temas** — cria um estudo completo para a biblioteca.
2. **Gerar artigo por tema** — transforma um tema/passagem em artigo Markdown.

Ambos usam o currículo bíblico local (`src/lib/theme-generator.ts`) e resolvem as
referências no banco (`src/lib/bible-reference.ts`). Não há chamada a IA externa:
o conteúdo é montado a partir de dados e modelos internos.

## Gerador de temas

Caminho: **Conteúdo → Gerador de temas**.

### Entradas

- **Tema central** (ou “Nenhum / personalizado”): fé, coragem, arrependimento,
  esperança, santidade, justiça, humildade, adoração, Reino, fidelidade, perdão, missão.
- **Narrativa histórica** (ou personalizada): Êxodo, Josué, Davi, Salomão, Elias,
  Ezequias, Josias, exílio, Neemias, Jesus e o Reino, paixão e Pentecostes.
- **Ênfase**: o ensino de Deus, o ensino de Jesus ou ambos.
- **Público**: culto, pequeno grupo, escola bíblica, devocional pessoal, jovens, líderes.
- **Título personalizado** (opcional).

### Saída

- contexto histórico e período;
- reis/autoridades;
- resumo da narrativa;
- o que Deus ensinou;
- o que Jesus revelou;
- esboço em cinco movimentos;
- aplicações;
- oração;
- referências clicáveis com texto bíblico;
- mensagem do dia (versículo, reflexão, prática e oração).

### Passagem no título

Se o título contiver uma referência, como:

```text
A promessa de um lugar — João 14:1-3
```

o gerador detecta a passagem e alinha **todo o estudo** a ela: contexto, esboço,
ensino de Deus, ensino de Jesus, referências e mensagem do dia.

### Edição manual

Antes de salvar, é possível ajustar:

- título e subtítulo;
- contexto histórico;
- narrativa;
- ensino de Deus;
- ensino de Jesus;
- pontos do esboço;
- aplicações;
- oração;
- mensagem do dia.

### Salvar e publicar

- **Salvar na biblioteca**: cria um estudo público em `/biblioteca/...`.
- **Publicar mensagem do dia**: grava a mensagem exibida na home.
- O painel lista os temas já criados e a mensagem ativa.

## Gerador de artigo

Caminho: **Artigos → Gerar por tema**.

### Entradas

- tema do artigo;
- passagem bíblica opcional (ex.: `João 14:1,3`);
- categoria;
- ênfase;
- público.

### Saída

- artigo completo em Markdown;
- contexto histórico;
- esboço;
- aplicações;
- oração;
- referências clicáveis;
- categoria, capa e tags;
- SEO (título e descrição).

O artigo é criado como **rascunho** e abre no editor para revisão.

### Alinhamento à passagem

Quando uma passagem é informada, o título do artigo combina tema + passagem e as
referências são geradas a partir dela, evitando textos genéricos de outro livro.

## Como as referências são resolvidas

`src/lib/bible-reference.ts`:

1. normaliza o texto (sem acentos, minúsculas);
2. reconhece livro, capítulo e versículos;
3. busca o texto em `bible_verses`;
4. monta o link `/biblia/{livro}/{capitulo}`;
5. guarda o resultado em cache de processo.

Referências não reconhecidas aparecem como texto sem link e não quebram o gerador.

## Limitações

- O gerador é baseado em modelos internos, não em IA generativa.
- A qualidade depende do currículo e dos perfis de livros/passagens.
- Sempre revise o conteúdo antes de publicar.
- Referências fora do cânone ou com grafia muito diferente podem não ser reconhecidas.
