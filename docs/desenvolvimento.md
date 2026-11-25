# Desenvolvimento

## Requisitos

- Node.js 22.13+ (veja `.nvmrc`)
- npm 10+
- Git

## Primeiro setup

```bash
npm ci
cp .env.example .env
# edite o .env
npm run db:setup
npm run dev
```

## Scripts

| Comando | Função |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento (porta 3000). |
| `npm run build` | Build de produção. |
| `npm start` | Servidor de produção. |
| `npm run typecheck` | TypeScript sem emitir arquivos. |
| `npm run db:setup` | Schema + seed + importação da Bíblia. |
| `npm run bible:import` | Reimporta a Bíblia. |
| `npm run admin:reset` | Redefine o administrador. |

## Estrutura

```text
src/
├─ app/
│  ├─ (site)/          # páginas públicas
│  ├─ admin/           # login e painel
│  ├─ api/admin/       # upload do editor
│  └─ uploads/[...]    # entrega de uploads
├─ components/
│  ├─ site/            # UI pública
│  ├─ admin/           # UI do painel
│  └─ bible/           # componentes bíblicos
└─ lib/
   ├─ actions/         # Server Actions
   ├─ auth.ts          # sessão e autenticação
   ├─ db.ts            # acesso ao banco
   ├─ queries.ts       # consultas
   ├─ schema.ts        # schema SQLite
   ├─ uploads.ts       # upload e mídia
   ├─ storage.ts       # leitura/escrita em data/uploads
   ├─ theme-generator.ts
   ├─ reference-theme.ts
   └─ article-generator.ts
```

## Convenções

- TypeScript estrito.
- Server Components por padrão; `"use client"` só quando há estado/eventos.
- Textos em português do Brasil.
- Consultas de leitura em `src/lib/queries.ts`.
- Escritas administrativas em `src/lib/actions/`.
- Toda ação administrativa começa com `adminSession()`.
- Toda página do painel começa com `requireAdmin()`.
- Datas no banco em UTC (`datetime('now')`), exibidas em America/Sao_Paulo.
- Markdown é sanitizado em `src/lib/markdown.ts`.

## Adicionar uma página pública

1. Crie `src/app/(site)/minha-pagina/page.tsx`.
2. Exporte `metadata` e o componente (pode ser async).
3. Use consultas de `@/lib/queries`.
4. Adicione o link no header/footer, se necessário.
5. Inclua no `sitemap.ts`.
6. Teste desktop e mobile.

## Adicionar uma consulta

```ts
import { queryAll, queryOne } from "@/lib/db";

export async function getAlgo(id: number) {
  return queryOne<{ id: number; nome: string }>(
    "SELECT id, nome FROM tabela WHERE id = ?",
    [id],
  );
}
```

Sempre use parâmetros `?`; nunca interpole entrada do usuário.

## Adicionar uma Server Action

```ts
"use server";

import { revalidatePath } from "next/cache";
import { execute } from "@/lib/db";
import { adminSession, backWith, formText } from "@/lib/admin";
import { logAudit } from "@/lib/queries";

export async function minhaAction(formData: FormData) {
  const user = await adminSession();
  const nome = formText(formData, "nome", 120);

  await execute("UPDATE ... SET nome = ? WHERE id = ?", [nome, 1]);
  await logAudit({ userId: user.id, action: "algo.update", entity: "algo" });
  revalidatePath("/admin/algo");
  backWith("/admin/algo", { ok: "Atualizado." });
}
```

## Banco

- O schema é idempotente em `src/lib/schema.ts`.
- `db.ts` usa `node:sqlite` com o arquivo `data/app.db`.
- Não há ORM nem migrations versionadas.
- Mudanças devem funcionar em banco vazio e populado.
- Teste com `npm run db:setup` em uma cópia limpa do projeto.

## Testes manuais recomendados

Antes de abrir um PR:

1. `npm run typecheck`
2. `npm run build`
3. Home, blog, artigo, Bíblia, biblioteca, sobre, contato e busca.
4. Login e todas as páginas do painel.
5. Criar/editar/excluir uma categoria de teste.
6. Gerar um tema e um artigo de teste.
7. Upload de uma imagem pequena.
8. Layout em 390 px (mobile) sem overflow.

## Codificação

- Arquivos em UTF-8 sem BOM.
- Não use ferramentas do PowerShell 5.1 para reescrever arquivos com acentos;
  prefira o editor/Node com UTF-8.
- Preserve `\n` (LF) conforme `.editorconfig`.

## Publicação

- VPS com Node, PM2 e Nginx: ver [implantacao-vps.md](implantacao-vps.md).
- O projeto precisa de disco persistente para o SQLite e os uploads.
