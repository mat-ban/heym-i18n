# Nó Jira

O nó **Jira** conecta workflows à API REST do Jira para automação de projetos, issues, comentários, anexos, usuários, notificações e transições. A operação padrão é **Search Issues**.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1 |
| Credencial | Jira (Cloud: e-mail/API token ou Data Center: nome de usuário/senha, URL base, modo de implantação, versão opcional da API REST) |
| Saída | `$nodeLabel.*` |

## Credencial

Crie uma credencial **Jira** na [Aba Credenciais](../tabs/credentials-tab.md). As chaves de configuração armazenadas são `email`, `api_token`, `base_url`, `deployment` e, opcionalmente, `api_version`. Para o Jira Cloud, `email` armazena o e-mail da conta Atlassian e `api_token` armazena o API token da Atlassian. Para o Jira Data Center / Server, essas mesmas chaves armazenam o nome de usuário e a senha da autenticação Basic. Consulte [Integrações de Terceiros](../reference/integrations.md#jira) para obter as etapas de configuração.

| Campo | Chave de configuração | Descrição |
| --- | --- | --- |
| Jira Email / Username | `email` | E-mail da conta Atlassian do Jira Cloud, ou nome de usuário do Jira Data Center / Server |
| API Token / Password | `api_token` | API token da Atlassian do Jira Cloud, ou senha do Jira Data Center / Server para autenticação Basic |
| Base URL | `base_url` | URL do site Jira, por exemplo `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` para Jira Cloud ou `data_center` para Jira Data Center / Server |
| REST API Version | `api_version` | O padrão é `3` para Jira Cloud. Data Center / Server utiliza a API REST v2 |

Personal access tokens e autenticação Bearer do Data Center / Server ainda não são suportados pela credencial Jira.

Utilize **Test Connection** para verificar a credencial em relação ao usuário Jira atual.

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

Os campos de texto compatíveis com expressões suportam [expressões](../reference/expression-dsl.md) como `$input.text`. `jiraIncludeBinary` é um toggle booleano e não suporta expressões, mas pode ser marcado como fornecido pelo agente quando o nó Jira está anexado a um handle de ferramenta do Agent.
## Campos de emissão e atualização

- **Project Key** é a chave curta do projeto, como `ENG`. Utilize List Projects para descobrir as chaves.
- **Issue Key ou ID** aceita chaves como `ENG-123` ou IDs numéricos de issues. Utilize Search Issues ou List Projects para descobrir os valores.
- **Transition ID** provém de List Transitions. Cada objeto de transição inclui um campo `id`.
- **Comment ID** e **Attachment ID** provêm de List Comments, List Attachments ou de respostas anteriores de criação/obtenção.
- **Account ID / Username** é o valor `accountId` do Jira Cloud ou o nome de usuário do Jira Data Center / Server. Get Myself ou Get User podem auxiliar na sua descoberta.
- O texto de **description** da issue e do **body** do comentário é enviado como Atlassian Document Format na REST API v3; quando a implantação da credencial é Data Center / Server, são enviados como texto simples. Na v3, os caracteres de nova linha tornam-se parágrafos separados.
- **Get Issue Changelog** utiliza o endpoint paginado de changelog do Jira Cloud. Para Data Center / Server, lê os dados expandidos de changelog da issue e aplica o offset/limit configurado aos históricos retornados.
- Em **Update Issue**, deixe os campos opcionais vazios para preservar os seus valores atuais.
- Defina **Description** ou **Assignee Account ID / Username** como `null` na atualização para limpar esses campos. As labels não podem ser limpas com `null`.
- **Recipients JSON** em Notify Issue assume `{"assignee":true}` quando omitido. As chaves comuns incluem `assignee`, `reporter`, `watchers` e `voters` (por exemplo, `{"assignee":true,"watchers":true}`).
- **Add Attachment** aceita conteúdo base64 bruto ou data URL e está limitado pela configuração de tamanho de arquivo da plataforma (padrão de 99 MB).

## Paginação

- **Search Issues** utiliza paginação por cursor através de `jiraNextPageToken` para o Jira Cloud. Leia `pagination.nextPageToken` da execução anterior e passe-o para o próximo nó Search Issues.
- **Search Issues** utiliza paginação por offset através de `jiraStartAt` para o Jira Data Center / Server. Leia `pagination.startAt`, `pagination.maxResults` e `pagination.total` para calcular a próxima página.
- **List Projects**, **Get Issue Changelog**, **List Comments** e **List Attachments** utilizam paginação por offset com `jiraLimit` e `jiraStartAt`. Os resultados paginados retornam `pagination.startAt`, `pagination.maxResults`, `pagination.total` e `pagination.isLast`.
- **List Attachments** obtém primeiro todos os anexos da issue e, em seguida, fatia o resultado no lado do cliente. Os campos de paginação ainda descrevem a página retornada, mas issues grandes podem incorrer num custo extra de obtenção.
- **List Transitions** não pagina.
## Campos Principais

| Campo | Utilizado por | Observações |
| --- | --- | --- |
| `credentialId` | Todas as operações | UUID da credencial Jira própria |
| `jiraOperation` | Todas as operações | Assume `searchIssues` por padrão |
| `jiraProjectKey` | Create Issue | Chave do projeto, como `ENG` |
| `jiraIssueKey` | Operações de issue, comentário, anexo, notificação e transição | Chave da issue, como `ENG-123`, ou ID numérico da issue |
| `jiraIssueType` | Create Issue | Assume `Task` por padrão |
| `jiraIssueTypeId` | Create Issue | ID opcional do tipo de issue; substitui `jiraIssueType` quando definido |
| `jiraSummary` | Create/Update Issue | Obrigatório para Create Issue |
| `jiraDescription` | Create/Update Issue | Enviado como ADF na REST API v3 ou texto simples na REST API v2; utilize `null` na atualização para limpar a descrição |
| `jiraJql` | Search Issues | Assume `updated >= -30d ORDER BY updated DESC` por padrão |
| `jiraFields` | Search Issues | Array JSON opcional ou campos de issue separados por vírgula; assume `key`, `summary`, `status`, `assignee` e `issuetype` quando vazio |
| `jiraAssigneeAccountId` | Create/Update Issue | accountId do Jira Cloud ou nome de usuário do Data Center / Server; utilize `null` na atualização para limpar o responsável |
| `jiraLabels` | Create/Update Issue | Array JSON ou texto separado por vírgula |
| `jiraCommentBody` | Create/Update Comment | Enviado como ADF na REST API v3 ou texto simples na REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID do comentário Jira |
| `jiraTransitionId` | Transition Issue | Descubra com List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID do anexo Jira |
| `jiraAttachmentFilename` | Add Attachment | Nome do arquivo enviado |
| `jiraAttachmentBase64` | Add Attachment | Conteúdo base64 bruto ou data URL; sujeito ao limite de tamanho de arquivo |
| `jiraAttachmentMimeType` | Add Attachment | Tipo MIME opcional; inferido a partir do nome do arquivo quando vazio |
| `jiraIncludeBinary` | Get/List Attachment | Alternância booleana; adiciona `content_base64` quando habilitado |
| `jiraNotifySubject` | Notify Issue | Assunto da notificação obrigatório |
| `jiraNotifyTextBody` | Notify Issue | Corpo da notificação em texto simples obrigatório |
| `jiraNotifyHtmlBody` | Notify Issue | Corpo HTML opcional |
| `jiraNotifyTo` | Notify Issue | JSON de destinatários; assume `{"assignee":true}` por padrão |
| `jiraAccountId` | Get/Delete User | accountId do Jira Cloud ou nome de usuário do Data Center / Server |
| `jiraUserEmail` | Create User | Endereço de e-mail do novo usuário |
| `jiraUsername` | Create User | Nome de usuário opcional do Data Center / Server; recorre a `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Nome de exibição opcional |
| `jiraUserProducts` | Create User | Array JSON ou chaves de produto separadas por vírgula; somente Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Assume `50` por padrão; intervalo de 1 a 100 |
| `jiraStartAt` | Search Issues no Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Índice inicial da paginação por offset |
| `jiraNextPageToken` | Search Issues no Jira Cloud | Token de cursor de uma resposta de pesquisa anterior |

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

Pesquisar issues com campos personalizados e paginação por cursor:

- Operação: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Campos da Issue: `["key","summary","status"]`
- Limite: `25`
- Token da Próxima Página: `$searchJira.pagination.nextPageToken`

Pesquisar issues no Data Center com paginação por offset:

- Operação: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limite: `25`
- Iniciar Em: `25`

Transicionar uma issue após listar as transições disponíveis:

- Operação: `listTransitions`
- Chave ou ID da Issue: `ENG-123`
- Em seguida, execute **Transition Issue** com o Transition ID: `$listTransitions.transitions[0].id`

Notificar os observadores sobre uma atualização de issue:

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

- [Aba Credenciais](../tabs/credentials-tab.md)
- [Integrações de Terceiros](../reference/integrations.md#jira)
- [Tipos de Nó](../reference/node-types.md)
- [DSL de Expressões](../reference/expression-dsl.md)
