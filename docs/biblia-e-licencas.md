# Bíblia e licenças

## Texto bíblico

- **Obra:** Bíblia Livre (BLIVRE), revisão de 2018 da tradução de João Ferreira de Almeida (1819).
- **Livros:** 66
- **Capítulos:** 1.189
- **Versículos:** 31.102
- **Licença:** Creative Commons Atribuição 4.0 Brasil (CC BY 4.0 BR).
- **Copyright:** © 2018 Diego Santos, Mario Sérgio e Marco Teles.
- **Fonte:** https://ebible.org/find/details.php?id=porbr2018
- **Dados:** https://github.com/midvash/bible-data

A atribuição aparece no rodapé e na página de leitura, e pode ser ajustada em
**Configurações → Atribuição bíblica**. Ela deve ser mantida em qualquer
redistribuição do texto.

## Arquivos

```text
data/source/
├─ almeida-livre.sqlite   # versículos originais
└─ metadata.json          # licença, fonte e estatísticas
```

O arquivo de origem usa a tabela `verses` com:

| Coluna | Descrição |
| --- | --- |
| `book_id` | 1–66 |
| `chapter` | número do capítulo |
| `number` | número do versículo |
| `text` | texto bíblico |

## Importação

```bash
npm run bible:import
```

O importador:

1. lê o arquivo de origem;
2. grava `bible_books` com nome, slug, abreviação, testamento e posição;
3. grava `bible_verses` com texto e `search_text` normalizado (sem acentos);
4. registra a data em `settings.bible_imported_at`.

A importação é idempotente: se já houver versículos, ela não duplica; use
`--force` via script se precisar reimportar.

## Busca

A busca usa `search_text LIKE ?`, com texto normalizado. Para bases muito maiores,
considere FTS5 (SQLite).

## Substituir a Bíblia

1. Coloque o novo arquivo em `data/source/`.
2. Garanta a tabela `verses` com as colunas acima.
3. Atualize `data/source/metadata.json` com a licença e a atribuição.
4. Rode `npm run bible:import`.
5. Atualize a atribuição em **Configurações**.
6. Verifique se a licença permite redistribuição e uso comercial.

## Outras licenças

- Código: MIT (`LICENSE`).
- Fotos: Unsplash License.
- Ícones: Lucide (ISC).
- Fontes: Fraunces, Inter e Lora (SIL OFL 1.1).
- Conteúdo editorial: © Palavra Viva.

Detalhes em `NOTICE.md`.
