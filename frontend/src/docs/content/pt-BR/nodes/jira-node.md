# Jira

O nó **Jira** conecta workflows à API REST do Jira para automação de projetos, issues, comentários, anexos, usuários, notificações e transições. A operação padrão é **Search Issues**.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Credencial | Jira (Cloud: e-mail/token de API, Data Center: nome de usuário/senha ou personal access token, URL base, modo de implantação, versão opcional da API REST) |
| Saída | `$nodeLabel.*` |

## Credencial

Crie uma credencial **Jira** na [Aba de Credenciais](../tabs/credentials-tab.md). As chaves de configuração armazenadas são `email`, `api_token`, `base_url`, `deployment`, `auth_mode` e, opcionalmente, `api_version`. Para o Jira Cloud, `email` armazena o e-mail da conta Atlassian e `api_token` armazena o token de API da Atlassian. Para o Jira Data Center / Server, essas mesmas chaves armazenam o nome de usuário e a senha da autenticação Basic ou, com `auth_mode: pat`, `api_token` armazena um personal access token enviado como Bearer token e `email` não é utilizado. Consulte [Integrações de Terceiros](../reference/integrations.md#jira) para obter as etapas de configuração.

| Campo | Chave de configuração | Descrição |
| --- | --- | --- |
| Jira Email / Username | `email` | E-mail da conta Atlassian do Jira Cloud, ou nome de usuário do Jira Data Center / Server |
| Autenticação | `auth_mode` | `basic` (padrão) ou `pat` (apenas Data Center / Server) |
| API Token / Password / Personal Access Token | `api_token` | Token de API da Atlassian do Jira Cloud, senha do Jira Data Center / Server para autenticação Basic, ou um personal access token do Data Center no modo `pat` |
| Base URL | `base_url` | URL do site Jira, por exemplo `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` para Jira Cloud ou `data_center` para Jira Data Center / Server |
| REST API Version | `api_version` | O padrão é `3` para Jira Cloud. Data Center / Server usa a API REST v2 |

Personal access tokens exigem Jira Data Center / Server 8.14 ou posterior. Alternar o método de autenticação limpa o segredo armazenado, portanto insira a nova senha ou token ao mudar.

Use **Test Connection** para verificar a credencial em relação ao usuário Jira atual.

## Operações

| Operação | Campos obrigatórios | Saída |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Limit, Start At opcionais | `projects`, `count`, `pagination` |
| Search Issues | JQL, Issue Fields, Limit, Next Page Token, Start At opcionais | `issues`, `count`, `pagination` |
| Get Issue | Issue Key ou ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key ou ID e pelo menos um campo alterado | `issue`, `key` |
| Delete Issue | Issue Key ou ID | `deleted` |
| Get Issue Changelog | Issue Key ou ID; Limit, Start At opcionais | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key ou ID, Subject, Text Body | `notified` |
| List Comments | Issue Key ou ID; Limit, Start At opcionais | `comments`, `count`, `pagination` |
| Create Comment | Issue Key ou ID, Comment Body | `comment` |
| Get Comment | Issue Key ou ID, Comment ID | `comment` |
| Update Comment | Issue Key ou ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key ou ID, Comment ID | `deleted` |
| Add Attachment | Issue Key ou ID, Filename, conteúdo Base64 | `attachments`, `count` |
| Get Attachment | Attachment ID; Include Binary opcional | `attachment` |
| List Attachments | Issue Key ou ID; Limit, Start At, Include Binary opcionais | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key ou ID | `transitions`, `count` |
| Transition Issue | Issue Key ou ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

Campos de texto compatíveis com expressões suportam [expressões](../reference/expression-dsl.md) como `$input.text`. `jiraIncludeBinary` é um toggle booleano e não suporta expressões, mas pode ser marcado como fornecido pelo agente quando o nó Jira está anexado a um handle de ferramenta do Agent.

## Campos de issue e atualização

- **Project Key** é a chave curta do projeto, como `ENG`. Use List Projects para descobrir as chaves.
- **Issue Key ou ID** aceita chaves como `ENG-123` ou IDs numéricos de issue. Use Search Issues ou List Projects para descobrir os valores.
- **Transition ID** vem de List Transitions. Cada objeto de transição inclui um campo `id`.
- **Comment ID** e **Attachment ID** vêm de List Comments, List Attachments ou de respostas anteriores de criação/consulta.
- **Account ID / Username** é o valor `accountId` do Jira Cloud ou o nome de usuário do Jira Data Center / Server. Get Myself ou Get User podem ajudar a descobri-lo.
- A **description** da issue e o texto do **body** do comentário são enviados como Atlassian Document Format na API REST
  v3; quando o modo de implantação da credencial é Data Center / Server, eles são enviados como texto simples.
  Na v3, caracteres de nova linha se tornam parágrafos separados.
- **Get Issue Changelog** usa o endpoint paginado de changelog do Jira Cloud. Para Data Center / Server, ele lê os dados expandidos do changelog da issue e aplica o offset/limit configurado aos históricos retornados.
- Em **Update Issue**, deixe os campos opcionais vazios para preservar seus valores atuais.
- Defina **Description** ou **Assignee Account ID / Username** como `null` na atualização para limpar esses campos. Labels não podem ser limpas com `null`.
- **Recipients JSON** em Notify Issue tem como padrão `{"assignee":true}` quando omitido. Chaves comuns incluem `assignee`, `reporter`, `watchers` e `voters` (por exemplo, `{"assignee":true,"watchers":true}`).
- **Add Attachment** aceita conteúdo base64 bruto ou data URL e é limitado pela configuração de tamanho de arquivo da plataforma (padrão de 99 MB).
## Paginação

- **Search Issues** utiliza paginação por cursor via `jiraNextPageToken` para o Jira Cloud. Leia `pagination.nextPageToken` da execução anterior e passe-o para o próximo nó Search Issues.
- **Search Issues** utiliza paginação por offset via `jiraStartAt` para o Jira Data Center / Server. Leia `pagination.startAt`, `pagination.maxResults` e `pagination.total` para calcular a próxima página.
- **List Projects**, **Get Issue Changelog**, **List Comments** e **List Attachments** utilizam paginação por offset com `jiraLimit` e `jiraStartAt`. Os resultados paginados retornam `pagination.startAt`, `pagination.maxResults`, `pagination.total` e `pagination.isLast`.
- **List Attachments** busca todos os anexos da issue primeiro e, em seguida, fatia o resultado no lado do cliente. Os campos de paginação ainda descrevem a página retornada, mas issues grandes podem incorrer em um custo extra de busca.
- **List Transitions** não utiliza paginação.

## Campos Principais

| Campo | Utilizado por | Observações |
| --- | --- | --- |
| `credentialId` | Todas as operações | UUID da credencial Jira própria |
| `jiraOperation` | Todas as operações | Padrão: `searchIssues` |
| `jiraProjectKey` | Create Issue | Chave do projeto, como `ENG` |
| `jiraIssueKey` | Operações de issue, comentário, anexo, notificação e transição | Chave da issue, como `ENG-123`, ou ID numérico da issue |
| `jiraIssueType` | Create Issue | Padrão: `Task` |
| `jiraIssueTypeId` | Create Issue | ID opcional do tipo de issue; substitui `jiraIssueType` quando definido |
| `jiraSummary` | Create/Update Issue | Obrigatório para Create Issue |
| `jiraDescription` | Create/Update Issue | Enviado como ADF na REST API v3 ou texto simples na REST API v2; use `null` na atualização para limpar a descrição |
| `jiraJql` | Search Issues | Padrão: `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Array JSON opcional ou campos de issue separados por vírgula; o padrão é `key`, `summary`, `status`, `assignee` e `issuetype` quando vazio |
| `jiraAssigneeAccountId` | Create/Update Issue | accountId do Jira Cloud ou nome de usuário do Data Center / Server; use `null` na atualização para limpar o responsável |
| `jiraLabels` | Create/Update Issue | Array JSON ou texto separado por vírgula |
| `jiraCommentBody` | Create/Update Comment | Enviado como ADF na REST API v3 ou texto simples na REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID do comentário no Jira |
| `jiraTransitionId` | Transition Issue | Descubra com List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID do anexo no Jira |
| `jiraAttachmentFilename` | Add Attachment | Nome do arquivo enviado |
| `jiraAttachmentBase64` | Add Attachment | Conteúdo base64 bruto ou data URL; sujeito ao limite de tamanho de arquivo |
| `jiraAttachmentMimeType` | Add Attachment | Tipo MIME opcional; inferido a partir do nome do arquivo quando vazio |
| `jiraIncludeBinary` | Get/List Attachment | Alternância booleana; adiciona `content_base64` quando habilitado |
| `jiraNotifySubject` | Notify Issue | Assunto da notificação obrigatório |
| `jiraNotifyTextBody` | Notify Issue | Corpo da notificação em texto simples obrigatório |
| `jiraNotifyHtmlBody` | Notify Issue | Corpo HTML opcional |
| `jiraNotifyTo` | Notify Issue | JSON de destinatários; padrão: `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | accountId do Jira Cloud ou nome de usuário do Data Center / Server |
| `jiraUserEmail` | Create User | Endereço de e-mail do novo usuário |
| `jiraUsername` | Create User | Nome de usuário opcional do Data Center / Server; usa `jiraUserEmail` como fallback |
| `jiraUserDisplayName` | Create User | Nome de exibição opcional |
| `jiraUserProducts` | Create User | Array JSON ou chaves de produto separadas por vírgula; somente Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Padrão: `50`; intervalo de 1 a 100 |
| `jiraStartAt` | Search Issues no Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Índice inicial da paginação por offset |
| `jiraNextPageToken` | Search Issues no Jira Cloud | Token de cursor de uma resposta de busca anterior |

## Exemplos

Criar uma issue a partir da entrada upstream:

- Operação: `createIssue`
- Chave do Projeto: `ENG`
- Tipo de Issue: `Task`
- Resumo: `$input.title`
- Descrição: `$input.description`
- Labels: `["automation"]`

Atualizar uma issue e limpar o responsável:

- Operação: `updateIssue`
- Chave ou ID da Issue: `ENG-123`
- Resumo: `$input.title`
- Account ID / Nome de Usuário do Responsável: `null`

Buscar issues com campos personalizados e paginação por cursor:

- Operação: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Campos da Issue: `["key","summary","status"]`
- Limite: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Buscar issues no Data Center com paginação por offset:

- Operação: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limite: `25`
- Start At: `25`

Transicionar uma issue após listar as transições disponíveis:

- Operação: `listTransitions`
- Chave ou ID da Issue: `ENG-123`
- Em seguida, execute **Transition Issue** com Transition ID: `$listTransitions.transitions[0].id`

Notificar observadores sobre uma atualização de issue:

- Operação: `notifyIssue`
- Chave ou ID da Issue: `ENG-123`
- Assunto: `Issue updated`
- Corpo do Texto: `$input.text`
- JSON de Destinatários: `{"assignee":true,"watchers":true}`
## Saída

Toda operação bem-sucedida define:

- `$jira.success`
- `$jira.operation`

**Get Myself** expõe `user`.

**Operações de listagem paginada** expõem `count`, um campo de coleção e `pagination`:

| Operação | Chave da coleção | Formato da paginação |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** expõe `transitions` e `count` sem paginação.

**Mutações e leituras de issues** expõem o payload da issue do Jira, além de `key` quando aplicável.

**Comment** get/create/update expõem `comment`; delete expõe `deleted`.

**Transition Issue** expõe `transition` como `{ transitionId }`, além da `issue` atualizada e `key`.

**Attachment add** expõe `attachments` e `count`. **Get Attachment** expõe `attachment`; **List Attachments** expõe `attachments`, `count` e `pagination`. Quando **Include Binary** está habilitado, cada objeto de anexo pode incluir `content_base64`. Delete expõe `deleted`.

**User** get/create expõem `user`; delete expõe `deleted`.

**Notify Issue** expõe `notified`.

Padrões de acesso comuns:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Relacionados

- [Credentials Tab](../tabs/credentials-tab.md)
- [Third-Party Integrations](../reference/integrations.md#jira)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
