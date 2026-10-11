# Nó Linear

O nó **Linear** conecta Workflows à API GraphQL do Linear para automação de issues e workspaces.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Credencial | Chave de API pessoal do Linear ou OAuth2 |
| Saída | `$nodeLabel.*` |

## Credencial

Crie uma credencial **Linear** na [Aba Credenciais](../tabs/credentials-tab.md). Escolha um
modo de autenticação:

**Chave de API pessoal**

1. No Linear, abra **Settings → Security & Access → Personal API keys**.
2. Crie uma chave com acesso ao workspace que deseja automatizar.
3. Cole a chave em uma nova credencial Linear no Heym e use **Test Connection** para verificá-la.

**OAuth2**

1. Crie uma aplicação OAuth do Linear.
2. Registre `{FRONTEND_URL}/api/credentials/linear/oauth/callback` como URI de redirecionamento.
3. No Heym, escolha **OAuth2**, insira o Client ID e o Client Secret e clique em **Connect**.

Chaves de API pessoais e tokens OAuth atuam como o usuário que os criou ou autorizou.

## Operações

| Operação | Campos obrigatórios | Saída |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; After Cursor opcional | `teams`, `count`, `pageInfo` |
| List Projects | Limit; After Cursor opcional | `projects`, `count`, `pageInfo` |
| List Issues | Limit; Team ID, Project ID, After Cursor opcionais | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; After Cursor opcional | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID ou identificador como `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID ou identificador e ao menos um campo alterado | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID ou identificador | `deleted` |
| Add Issue Link | Issue ID ou identificador, Link URL | `link` |
| Create Comment | Issue ID ou identificador, Comment Body | `comment` |
| List Comments | Issue ID ou identificador, Limit; After Cursor opcional | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Todos os campos de texto suportam [expressões](../reference/expression-dsl.md).

## Campos de issue

- **Team ID** e **Project ID** são UUIDs do Linear. Use List Teams ou List Projects para descobri-los.
- **State ID** é o UUID do workflow-state usado ao criar ou atualizar uma issue. Use List Workflow States para descobri-lo.
- **Assignee ID** é um UUID de usuário do Linear. Use List Team Members para descobri-lo.
- **Priority** aceita `0` a `4`: sem prioridade, urgente, alta, normal e baixa.
- Deixe campos opcionais de atualização vazios para preservar seus valores atuais.
- Defina um campo de atualização como `null` para limpar description, project, assignee ou state.
- **Link URL** adiciona um link de anexo externo a uma issue.
- **Comment ID** é o UUID do Linear para um comentário existente. Use List Comments para descobri-lo.
- **Parent Comment ID** responde a um comentário existente do Linear ao criar um comentário.

## Paginação

As operações de listagem podem retornar uma página ou buscar automaticamente todas as páginas:

- Deixe **Return All** desativado para usar `Limit` e `After Cursor` manualmente.
- Ative **Return All** para seguir os cursores do Linear no lado do servidor, até 10.000 resultados.

Resultados paginados retornam `pageInfo.hasNextPage` e `pageInfo.endCursor`. Passe o cursor em
**After Cursor** na próxima execução do nó para buscar a próxima página quando **Return All** estiver desativado.

## Exemplos

Criar uma issue a partir de uma entrada upstream:

- Operação: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Adicionar um comentário a uma issue criada:

- Operação: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: opcional, ao responder a outro comentário

Resolver uma thread de comentários:

- Operação: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Adicionar um link externo a uma issue:

- Operação: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Paginar pelos membros da equipe:

- Operação: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` na próxima execução quando `hasNextPage` for verdadeiro

Descobrir IDs de workflow state antes de atualizar uma issue:

- Operação: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Em seguida, use `$listStates.states[0].id` como **State ID** em **Update Issue**
## Saída

Toda operação bem-sucedida define:

- `$linear.success`
- `$linear.operation`

As operações de listagem também expõem `count` e, quando aplicável, `pageInfo`. As operações de issue expõem o
payload completo da issue do Linear e campos de conveniência como `identifier` e `url`.
As mutações de comment expõem o payload completo de `comment`, exceto Delete Comment, que expõe
`deleted` e `entityId`.

## Relacionado

- [Aba Credenciais](../tabs/credentials-tab.md)
- [Tipos de Nó](../reference/node-types.md)
- [DSL de Expressões](../reference/expression-dsl.md)
