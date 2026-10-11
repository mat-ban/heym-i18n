# Вузол Jira

Вузол **Jira** з'єднує workflow з Jira REST API для автоматизації проєктів, завдань, коментарів, вкладень, користувачів, сповіщень і переходів. Операція за замовчуванням — **Search Issues**.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Облікові дані | Jira (Cloud email/API token або Data Center username/password, base URL, режим розгортання, опційна версія REST API) |
| Вивід | `$nodeLabel.*` |

## Облікові дані

Створіть облікові дані **Jira** на вкладці [Облікові дані](../tabs/credentials-tab.md). Збережені ключі конфігурації: `email`, `api_token`, `base_url`, `deployment` та опційний `api_version`. Для Jira Cloud `email` зберігає електронну адресу облікового запису Atlassian, а `api_token` — Atlassian API token. Для Jira Data Center / Server ці самі ключі зберігають ім'я користувача та пароль для Basic auth. Кроки налаштування дивіться в розділі [Third-Party Integrations](../reference/integrations.md#jira).

| Поле | Ключ конфігурації | Опис |
| --- | --- | --- |
| Jira Email / Username | `email` | Електронна адреса облікового запису Atlassian для Jira Cloud або ім'я користувача Jira Data Center / Server |
| API Token / Password | `api_token` | Atlassian API token для Jira Cloud або пароль Jira Data Center / Server для Basic auth |
| Base URL | `base_url` | URL сайту Jira, наприклад `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` для Jira Cloud або `data_center` для Jira Data Center / Server |
| REST API Version | `api_version` | За замовчуванням `3` для Jira Cloud. Data Center / Server використовує REST API v2 |

Персональні токени доступу та Bearer auth для Data Center / Server поки що не підтримуються обліковими даними Jira.

Скористайтеся **Test Connection**, щоб перевірити облікові дані щодо поточного користувача Jira.

## Операції

| Операція | Обов'язкові поля | Вивід |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Опційні Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | Опційні JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key або ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key або ID та щонайменше одне змінене поле | `issue`, `key` |
| Delete Issue | Issue Key або ID | `deleted` |
| Get Issue Changelog | Issue Key або ID; опційні Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key або ID, Subject, Text Body | `notified` |
| List Comments | Issue Key або ID; опційні Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key або ID, Comment Body | `comment` |
| Get Comment | Issue Key або ID, Comment ID | `comment` |
| Update Comment | Issue Key або ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key або ID, Comment ID | `deleted` |
| Add Attachment | Issue Key або ID, Filename, Base64 content | `attachments`, `count` |
| Get Attachment | Attachment ID; опційний Include Binary | `attachment` |
| List Attachments | Issue Key або ID; опційні Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key або ID | `transitions`, `count` |
| Transition Issue | Issue Key або ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

Текстові поля, що підтримують вирази, приймають [вирази](../reference/expression-dsl.md), як-от `$input.text`. `jiraIncludeBinary` — це булевий перемикач, який не підтримує вирази, але його можна позначити як наданий агентом, коли вузол Jira приєднано до ручки інструмента Agent.

## Поля завдання та оновлення

- **Project Key** — це короткий ключ проєкту, наприклад `ENG`. Скористайтеся List Projects, щоб дізнатися ключі.
- **Issue Key або ID** приймає ключі, як-от `ENG-123`, або числові ID завдань. Скористайтеся Search Issues або List Projects, щоб дізнатися значення.
- **Transition ID** походить з List Transitions. Кожен об'єкт переходу містить поле `id`.
- **Comment ID** та **Attachment ID** походять з List Comments, List Attachments або попередніх відповідей create/get.
- **Account ID / Username** — це значення `accountId` для Jira Cloud або ім'я користувача Jira Data Center / Server. Get Myself або Get User допоможуть його дізнатися.
- Текст **description** завдання та **body** коментаря надсилається у форматі Atlassian Document Format на REST
  API v3; коли режим розгортання облікових даних — Data Center / Server, вони надсилаються як звичайний текст.
  У v3 символи нового рядка стають окремими абзацами.
- **Get Issue Changelog** використовує посторінковий endpoint журналу змін Jira Cloud. Для Data Center / Server він читає розширені дані журналу змін завдання та застосовує налаштовані offset/limit до повернутих історій.
- Під час **Update Issue** залишайте опційні поля порожніми, щоб зберегти їхні поточні значення.
- Установіть **Description** або **Assignee Account ID / Username** у `null` під час оновлення, щоб очистити ці поля. Мітки не можна очистити за допомогою `null`.
- **Recipients JSON** у Notify Issue за замовчуванням дорівнює `{"assignee":true}`, якщо його пропущено. Поширені ключі включають `assignee`, `reporter`, `watchers` і `voters` (наприклад, `{"assignee":true,"watchers":true}`).
- **Add Attachment** приймає необроблений base64 або вміст data URL і обмежується налаштуванням розміру файлу платформи (за замовчуванням 99 МБ).
## Пагінація

- **Search Issues** використовує курсорну пагінацію через `jiraNextPageToken` для Jira Cloud. Зчитайте `pagination.nextPageToken` з попереднього запуску та передайте його до наступного вузла Search Issues.
- **Search Issues** використовує пагінацію зі зміщенням через `jiraStartAt` для Jira Data Center / Server. Зчитайте `pagination.startAt`, `pagination.maxResults` та `pagination.total`, щоб обчислити наступну сторінку.
- **List Projects**, **Get Issue Changelog**, **List Comments** та **List Attachments** використовують пагінацію зі зміщенням за допомогою `jiraLimit` і `jiraStartAt`. Результати з посторінковим виводом повертають `pagination.startAt`, `pagination.maxResults`, `pagination.total` та `pagination.isLast`.
- **List Attachments** спершу отримує всі вкладення з issue, а потім нарізає результат на стороні клієнта. Поля пагінації все одно описують повернуту сторінку, але для великих issue може виникнути додаткова вартість отримання даних.
- **List Transitions** не використовує пагінацію.

## Ключові поля

| Поле | Використовується | Примітки |
| --- | --- | --- |
| `credentialId` | Усі операції | UUID власних облікових даних Jira |
| `jiraOperation` | Усі операції | За замовчуванням `searchIssues` |
| `jiraProjectKey` | Create Issue | Ключ проєкту, наприклад `ENG` |
| `jiraIssueKey` | Операції з issue, коментарями, вкладеннями, сповіщеннями та переходами | Ключ issue, наприклад `ENG-123`, або числовий ID issue |
| `jiraIssueType` | Create Issue | За замовчуванням `Task` |
| `jiraIssueTypeId` | Create Issue | Необов'язковий ID типу issue; перевизначає `jiraIssueType`, якщо встановлено |
| `jiraSummary` | Create/Update Issue | Обов'язкове для Create Issue |
| `jiraDescription` | Create/Update Issue | Надсилається як ADF на REST API v3 або як звичайний текст на REST API v2; використовуйте `null` під час оновлення, щоб очистити опис |
| `jiraJql` | Search Issues | За замовчуванням `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Необов'язковий масив JSON або поля issue, розділені комами; за замовчуванням `key`, `summary`, `status`, `assignee` та `issuetype`, якщо порожньо |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud accountId або ім'я користувача Data Center / Server; використовуйте `null` під час оновлення, щоб очистити виконавця |
| `jiraLabels` | Create/Update Issue | Масив JSON або текст, розділений комами |
| `jiraCommentBody` | Create/Update Comment | Надсилається як ADF на REST API v3 або як звичайний текст на REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID коментаря Jira |
| `jiraTransitionId` | Transition Issue | Визначте за допомогою List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID вкладення Jira |
| `jiraAttachmentFilename` | Add Attachment | Ім'я завантаженого файлу |
| `jiraAttachmentBase64` | Add Attachment | Необроблений base64 або вміст data URL; підлягає обмеженню розміру файлу |
| `jiraAttachmentMimeType` | Add Attachment | Необов'язковий MIME-тип; визначається з імені файлу, якщо порожньо |
| `jiraIncludeBinary` | Get/List Attachment | Булевий перемикач; додає `content_base64`, коли увімкнено |
| `jiraNotifySubject` | Notify Issue | Обов'язкова тема сповіщення |
| `jiraNotifyTextBody` | Notify Issue | Обов'язковий текстовий вміст сповіщення |
| `jiraNotifyHtmlBody` | Notify Issue | Необов'язковий HTML-вміст |
| `jiraNotifyTo` | Notify Issue | JSON одержувачів; за замовчуванням `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud accountId або ім'я користувача Data Center / Server |
| `jiraUserEmail` | Create User | Адреса електронної пошти нового користувача |
| `jiraUsername` | Create User | Необов'язкове ім'я користувача Data Center / Server; за відсутності використовується `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Необов'язкове відображуване ім'я |
| `jiraUserProducts` | Create User | Масив JSON або ключі продуктів, розділені комами; лише Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | За замовчуванням `50`; діапазон 1–100 |
| `jiraStartAt` | Search Issues на Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Початковий індекс пагінації зі зміщенням |
| `jiraNextPageToken` | Search Issues на Jira Cloud | Курсорний token з попередньої відповіді пошуку |

## Приклади

Створення issue з вхідних даних:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Оновлення issue та очищення виконавця:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Пошук issue з користувацькими полями та курсорною пагінацією:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Пошук issue на Data Center з пагінацією зі зміщенням:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Перехід issue після переліку доступних переходів:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Потім запустіть **Transition Issue** з Transition ID: `$listTransitions.transitions[0].id`

Сповіщення спостерігачів про оновлення issue:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Вивід

Кожна успішна операція встановлює:

- `$jira.success`
- `$jira.operation`

**Get Myself** надає `user`.

**Операції зі списками з пагінацією** надають `count`, поле колекції та `pagination`:

| Операція | Ключ колекції | Структура пагінації |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** надає `transitions` та `count` без пагінації.

**Операції зміни та читання завдань** надають payload завдання Jira, а також `key`, де це застосовно.

**Comment** — отримання/створення/оновлення надають `comment`; видалення надає `deleted`.

**Transition Issue** надає `transition` у вигляді `{ transitionId }`, а також оновлені `issue` та `key`.

**Attachment add** надає `attachments` та `count`. **Get Attachment** надає `attachment`; **List Attachments** надає `attachments`, `count` та `pagination`. Коли увімкнено **Include Binary**, кожен об'єкт вкладення може містити `content_base64`. Видалення надає `deleted`.

**User** — отримання/створення надають `user`; видалення надає `deleted`.

**Notify Issue** надає `notified`.

Поширені шаблони доступу:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Пов'язане

- [Вкладка «Облікові дані»](../tabs/credentials-tab.md)
- [Сторонні інтеграції](../reference/integrations.md#jira)
- [Типи вузлів](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
