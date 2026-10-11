# Вузол Linear

Вузол **Linear** з'єднує workflow з Linear GraphQL API для автоматизації роботи з issue та робочим простором.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Облікові дані | Особистий API-ключ Linear або OAuth2 |
| Вихід | `$nodeLabel.*` |

## Облікові дані

Створіть облікові дані **Linear** на вкладці [Облікові дані](../tabs/credentials-tab.md). Виберіть один
режим автентифікації:

**Особистий API-ключ**

1. У Linear відкрийте **Settings → Security & Access → Personal API keys**.
2. Створіть ключ із доступом до робочого простору, який потрібно автоматизувати.
3. Вставте ключ у нові облікові дані Linear у Heym і скористайтеся **Test Connection** для перевірки.

**OAuth2**

1. Створіть застосунок Linear OAuth.
2. Зареєструйте `{FRONTEND_URL}/api/credentials/linear/oauth/callback` як redirect URI.
3. У Heym виберіть **OAuth2**, введіть Client ID і Client Secret, а потім натисніть **Connect**.

Особисті API-ключі та OAuth-токени діють від імені користувача, який їх створив або авторизував.

## Операції

| Операція | Обов'язкові поля | Вихід |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; необов'язково After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; необов'язково After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; необов'язково Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; необов'язково After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID або ідентифікатор, наприклад `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID або ідентифікатор і принаймні одне змінене поле | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID або ідентифікатор | `deleted` |
| Add Issue Link | Issue ID або ідентифікатор, Link URL | `link` |
| Create Comment | Issue ID або ідентифікатор, Comment Body | `comment` |
| List Comments | Issue ID або ідентифікатор, Limit; необов'язково After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Усі текстові поля підтримують [вирази](../reference/expression-dsl.md).

## Поля issue

- **Team ID** і **Project ID** — це UUID у Linear. Скористайтеся List Teams або List Projects, щоб їх знайти.
- **State ID** — це UUID стану workflow, який використовується під час створення або оновлення issue. Скористайтеся List Workflow States, щоб його знайти.
- **Assignee ID** — це UUID користувача Linear. Скористайтеся List Team Members, щоб його знайти.
- **Priority** приймає значення від `0` до `4`: без пріоритету, терміново, високий, звичайний і низький.
- Залишайте необов'язкові поля оновлення порожніми, щоб зберегти їхні поточні значення.
- Установіть поле оновлення в `null`, щоб очистити description, project, assignee або state.
- **Link URL** додає зовнішнє посилання-вкладення до issue.
- **Comment ID** — це UUID у Linear для наявного коментаря. Скористайтеся List Comments, щоб його знайти.
- **Parent Comment ID** відповідає на наявний коментар Linear під час створення коментаря.

## Пагінація

Операції списку можуть або повертати одну сторінку, або автоматично отримувати кожну сторінку:

- Залиште **Return All** вимкненим, щоб використовувати `Limit` і `After Cursor` вручну.
- Увімкніть **Return All**, щоб обробляти курсори Linear на стороні сервера, до 10 000 результатів.

Результати з пагінацією повертають `pageInfo.hasNextPage` і `pageInfo.endCursor`. Передайте курсор у
**After Cursor** під час наступного запуску вузла, щоб отримати наступну сторінку, коли **Return All** вимкнено.

## Приклади

Створення issue з вхідних даних попереднього вузла:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Додавання коментаря до створеного issue:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: необов'язково, під час відповіді на інший коментар

Закриття гілки коментарів:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Додавання зовнішнього посилання до issue:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Пагінація через учасників команди:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` під час наступного запуску, коли `hasNextPage` має значення true

Пошук ідентифікаторів станів workflow перед оновленням issue:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Потім використайте `$listStates.states[0].id` як **State ID** у **Update Issue**

## Вихід

Кожна успішна операція встановлює:

- `$linear.success`
- `$linear.operation`

Операції списку також надають `count` і, де застосовно, `pageInfo`. Операції з issue надають
повний payload issue Linear і зручні поля, як-от `identifier` та `url`.
Мутації коментарів надають повний payload `comment`, крім Delete Comment, яка надає
`deleted` та `entityId`.

## Пов'язане

- [Вкладка «Облікові дані»](../tabs/credentials-tab.md)
- [Типи вузлів](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
