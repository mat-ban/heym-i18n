# Jira Node

**Jira** node свързва workflows с Jira REST API за автоматизация на проекти, issues, коментари, прикачени файлове, потребители, известия и преходи. Операцията по подразбиране е **Search Issues**.

## Общ преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Удостоверение | Jira (Cloud email/API token или Data Center потребителско име/парола, base URL, режим на внедряване, опционална версия на REST API) |
| Изход | `$nodeLabel.*` |

## Удостоверение

Създайте **Jira** удостоверение в [Credentials Tab](../tabs/credentials-tab.md). Съхранените конфигурационни ключове са `email`, `api_token`, `base_url`, `deployment` и опционален `api_version`. За Jira Cloud `email` съхранява имейла на Atlassian акаунта, а `api_token` съхранява Atlassian API token. За Jira Data Center / Server същите тези ключове съхраняват потребителското име и паролата за Basic auth. Вижте [Third-Party Integrations](../reference/integrations.md#jira) за стъпките по настройка.

| Поле | Конфигурационен ключ | Описание |
| --- | --- | --- |
| Jira Email / Username | `email` | Имейл на Atlassian акаунт за Jira Cloud, или потребителско име за Jira Data Center / Server |
| API Token / Password | `api_token` | Atlassian API token за Jira Cloud, или парола за Basic auth за Jira Data Center / Server |
| Base URL | `base_url` | URL на Jira сайта, например `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` за Jira Cloud или `data_center` за Jira Data Center / Server |
| REST API Version | `api_version` | По подразбиране `3` за Jira Cloud. Data Center / Server използва REST API v2 |

Data Center / Server personal access tokens и Bearer auth все още не се поддържат от Jira удостоверението.

Използвайте **Test Connection**, за да проверите удостоверението спрямо текущия Jira потребител.

## Операции

| Операция | Задължителни полета | Изход |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Опционални Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | Опционални JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key или ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key или ID и поне едно променено поле | `issue`, `key` |
| Delete Issue | Issue Key или ID | `deleted` |
| Get Issue Changelog | Issue Key или ID; опционални Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key или ID, Subject, Text Body | `notified` |
| List Comments | Issue Key или ID; опционални Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key или ID, Comment Body | `comment` |
| Get Comment | Issue Key или ID, Comment ID | `comment` |
| Update Comment | Issue Key или ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key или ID, Comment ID | `deleted` |
| Add Attachment | Issue Key или ID, Filename, Base64 content | `attachments`, `count` |
| Get Attachment | Attachment ID; опционален Include Binary | `attachment` |
| List Attachments | Issue Key или ID; опционални Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key или ID | `transitions`, `count` |
| Transition Issue | Issue Key или ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

Текстовите полета, поддържащи изрази, приемат [expressions](../reference/expression-dsl.md) като `$input.text`. `jiraIncludeBinary` е булев превключвател и не поддържа изрази, но може да бъде маркиран като предоставен от агента, когато Jira node е прикачен към Agent tool handle.

## Полета за issue и актуализация

- **Project Key** е краткият ключ на проекта, например `ENG`. Използвайте List Projects, за да откриете ключовете.
- **Issue Key или ID** приема ключове като `ENG-123` или числови issue ID-та. Използвайте Search Issues или List Projects, за да откриете стойностите.
- **Transition ID** идва от List Transitions. Всеки transition обект включва поле `id`.
- **Comment ID** и **Attachment ID** идват от List Comments, List Attachments или от предходни create/get отговори.
- **Account ID / Username** е стойността `accountId` за Jira Cloud или потребителското име за Jira Data Center / Server. Get Myself или Get User могат да Ви помогнат да я откриете.
- **Description** на issue и текстът на **body** на коментар се изпращат като Atlassian Document Format при REST
  API v3; когато режимът на внедряване на удостоверението е Data Center / Server, те се изпращат като plain text.
  Във v3 символите за нов ред стават отделни параграфи.
- **Get Issue Changelog** използва paginated changelog endpoint на Jira Cloud. За Data Center / Server той чете разширени данни за changelog на issue и прилага конфигурираните offset/limit към върнатите истории.
- При **Update Issue** оставете опционалните полета празни, за да запазите текущите им стойности.
- Задайте **Description** или **Assignee Account ID / Username** на `null` при актуализация, за да изчистите тези полета. Labels не могат да бъдат изчиствани с `null`.
- **Recipients JSON** при Notify Issue се подразбира на `{"assignee":true}`, когато е пропуснат. Често срещаните ключове включват `assignee`, `reporter`, `watchers` и `voters` (например `{"assignee":true,"watchers":true}`).
- **Add Attachment** приема raw base64 или data URL съдържание и е ограничен от настройката за размер на файлове в платформата (по подразбиране 99 MB).
## Пагинация

- **Search Issues** използва пагинация чрез cursor посредством `jiraNextPageToken` за Jira Cloud. Прочетете `pagination.nextPageToken` от предишното изпълнение и го подайте към следващия node Search Issues.
- **Search Issues** използва пагинация чрез offset посредством `jiraStartAt` за Jira Data Center / Server. Прочетете `pagination.startAt`, `pagination.maxResults` и `pagination.total`, за да изчислите следващата страница.
- **List Projects**, **Get Issue Changelog**, **List Comments** и **List Attachments** използват пагинация чрез offset с `jiraLimit` и `jiraStartAt`. Странираните резултати връщат `pagination.startAt`, `pagination.maxResults`, `pagination.total` и `pagination.isLast`.
- **List Attachments** извлича първо всички прикачени файлове от issue-то, след което разделя резултата от страна на клиента. Полетата за пагинация все още описват върнатата страница, но при големи issue-та може да възникне допълнителна цена за извличане.
- **List Transitions** не използва пагинация.

## Ключови полета

| Поле | Използва се от | Бележки |
| --- | --- | --- |
| `credentialId` | Всички операции | UUID на притежавано Jira удостоверение |
| `jiraOperation` | Всички операции | По подразбиране е `searchIssues` |
| `jiraProjectKey` | Create Issue | Ключ на проект, например `ENG` |
| `jiraIssueKey` | Операции с issue, коментари, прикачени файлове, известия и преходи | Ключ на issue, например `ENG-123`, или числов ID на issue |
| `jiraIssueType` | Create Issue | По подразбиране е `Task` |
| `jiraIssueTypeId` | Create Issue | Незадължителен ID на тип issue; замества `jiraIssueType`, когато е зададен |
| `jiraSummary` | Create/Update Issue | Задължително за Create Issue |
| `jiraDescription` | Create/Update Issue | Изпраща се като ADF при REST API v3 или като обикновен текст при REST API v2; използвайте `null` при update, за да изчистите описанието |
| `jiraJql` | Search Issues | По подразбиране е `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Незадължителен JSON масив или полета на issue, разделени със запетая; по подразбиране са `key`, `summary`, `status`, `assignee` и `issuetype`, когато е празно |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud accountId или потребителско име за Data Center / Server; използвайте `null` при update, за да изчистите assignee |
| `jiraLabels` | Create/Update Issue | JSON масив или текст, разделен със запетая |
| `jiraCommentBody` | Create/Update Comment | Изпраща се като ADF при REST API v3 или като обикновен текст при REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID на Jira коментар |
| `jiraTransitionId` | Transition Issue | Открийте чрез List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID на Jira прикачен файл |
| `jiraAttachmentFilename` | Add Attachment | Име на качения файл |
| `jiraAttachmentBase64` | Add Attachment | Сурово base64 съдържание или съдържание под формата на data URL; подлежи на ограничение за размера на файла |
| `jiraAttachmentMimeType` | Add Attachment | Незадължителен MIME тип; извежда се от името на файла, когато е празно |
| `jiraIncludeBinary` | Get/List Attachment | Булев превключвател; добавя `content_base64`, когато е включен |
| `jiraNotifySubject` | Notify Issue | Задължителна тема на известието |
| `jiraNotifyTextBody` | Notify Issue | Задължително тяло на известието като обикновен текст |
| `jiraNotifyHtmlBody` | Notify Issue | Незадължително HTML тяло |
| `jiraNotifyTo` | Notify Issue | JSON с получатели; по подразбиране е `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud accountId или потребителско име за Data Center / Server |
| `jiraUserEmail` | Create User | Имейл адрес на новия потребител |
| `jiraUsername` | Create User | Незадължително потребителско име за Data Center / Server; при липса се използва `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Незадължително име за показване |
| `jiraUserProducts` | Create User | JSON масив или продуктови ключове, разделени със запетая; само за Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | По подразбиране е `50`; диапазон 1–100 |
| `jiraStartAt` | Search Issues в Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Начален индекс за пагинация чрез offset |
| `jiraNextPageToken` | Search Issues в Jira Cloud | Cursor token от предишен отговор на търсене |

## Примери

Създаване на issue от входни данни от предходен node:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Актуализиране на issue и изчистване на assignee:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Търсене на issue-та с персонализирани полета и пагинация чрез cursor:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Търсене на issue-та в Data Center с пагинация чрез offset:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Преход на issue след изброяване на наличните преходи:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- След това изпълнете **Transition Issue** с Transition ID: `$listTransitions.transitions[0].id`

Уведомяване на наблюдателите относно актуализация на issue:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Изход

Всяка успешна операция задава:

- `$jira.success`
- `$jira.operation`

**Get Myself** предоставя `user`.

**Операции за пагинирани списъци** предоставят `count`, поле за колекция и `pagination`:

| Операция | Ключ на колекцията | Форма на пагинацията |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** предоставя `transitions` и `count` без пагинация.

**Мутации и четения на Issue** предоставят payload на Jira issue плюс `key`, където е приложимо.

**Comment** get/create/update предоставят `comment`; delete предоставя `deleted`.

**Transition Issue** предоставя `transition` като `{ transitionId }`, плюс обновените `issue` и `key`.

**Attachment add** предоставя `attachments` и `count`. **Get Attachment** предоставя `attachment`; **List Attachments** предоставя `attachments`, `count` и `pagination`. Когато **Include Binary** е активирано, всеки обект на прикачен файл може да включва `content_base64`. Delete предоставя `deleted`.

**User** get/create предоставят `user`; delete предоставя `deleted`.

**Notify Issue** предоставя `notified`.

Често срещани модели за достъп:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Свързани

- [Credentials Tab](../tabs/credentials-tab.md)
- [Third-Party Integrations](../reference/integrations.md#jira)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
