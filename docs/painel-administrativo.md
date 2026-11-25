# Painel administrativo

Acesso: `/admin` (redireciona para `/admin/login`).
Não há cadastro público. O único usuário é o administrador definido no `.env`.
A senha pode ser trocada em **Meu perfil**.

## Dashboard

Mostra:

- artigos publicados, rascunhos e agendados;
- total de leituras e gráfico dos últimos 14 dias;
- comentários pendentes;
- inscritos na newsletter;
- últimos artigos, auditoria e atalhos.

## Artigos

### Novo artigo

1. **Artigos → Novo artigo**.
2. Preencha título, resumo e conteúdo em Markdown.
3. O slug é gerado pelo título, mas pode ser editado.
4. Defina:
   - **Rascunho**: não aparece no site;
   - **Publicado**: aparece imediatamente;
   - **Agendado**: aparece na data/hora escolhida (America/Sao_Paulo).
5. Adicione capa, categoria, tags, destaque e SEO.
6. Use **Prévia** para conferir o Markdown.
7. Salve. `Ctrl + S` também salva.

### Editar, duplicar e excluir

Na lista de artigos, use as ações de cada linha. A exclusão remove comentários,
tags e contagem de leituras relacionadas.

### Gerar por tema

Ver [geradores-de-conteudo.md](geradores-de-conteudo.md).

## Categorias e tags

- Categorias têm nome, slug, descrição, cor e ícone.
- Ao excluir uma categoria, os artigos continuam publicados sem categoria.
- Tags são digitadas no editor separadas por vírgula e criadas automaticamente.

## Comentários

Todo comentário público entra como **pendente**. É possível:

- aprovar e publicar;
- devolver para moderação;
- marcar como spam;
- excluir.

Só comentários aprovados aparecem no artigo.

## Biblioteca

Cadastre ebooks, estudos, devocionais e podcasts com:

- título, subtítulo, autor, tipo;
- descrição, capa, páginas;
- arquivo interno (`/uploads/...`) ou link externo;
- destaque.

Materiais podem ser vinculados a temas gerados (estudos).

## Planos de leitura

Crie planos com quantos dias quiser. Cada dia tem:

- título;
- passagem;
- reflexão.

O editor permite adicionar, remover e reordenar dias.

## Gerador de temas

Monta estudos completos com contexto histórico, narrativa, reis, esboço,
aplicações, oração e referências. Ver [geradores-de-conteudo.md](geradores-de-conteudo.md).

## Bíblia

Mostra:

- total de livros, capítulos e versículos;
- estado da importação;
- rotação de versículos do dia;
- atribuição bíblica.

Permite adicionar, editar e excluir versículos da rotação.

## Mídia

- Upload de imagens, PDF, MP3, M4A, OGG e MP4.
- Até 8 MB por arquivo, em `data/uploads`.
- Texto alternativo editável.
- Botão **Copiar** para usar a URL no editor ou na biblioteca.

## Newsletter

- Adicionar inscritos manualmente.
- Ativar/desativar e excluir.
- Exportar CSV.
- Ver origem e data de inscrição.

## Mensagens de contato

- Novas, lidas e arquivadas.
- Responder por e-mail.
- Excluir.

## Temas

- Editar nome, slug, modo e tokens de cor.
- Prévia ao vivo.
- Definir tema padrão do site.
- Restaurar os presets.
- O visitante pode trocar o tema; a escolha fica no navegador.

## Configurações

Nome do site, slogan, descrição, textos da home e da página Sobre, e-mail de contato,
redes sociais, rodapé, artigos por página, comentários, newsletter e atribuição bíblica.

## Auditoria

Registra login, logout, criação/edição/exclusão de conteúdo, mudanças de tema,
configurações e ações de mídia. Permite limpar registros antigos.

## Perfil e senha

- Nome, e-mail, bio e avatar.
- Troca de senha com confirmação.
- Ao trocar a senha, as outras sessões são encerradas.
