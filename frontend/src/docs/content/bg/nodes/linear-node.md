# Linear Node

**Linear** node свързва workflows с Linear GraphQL API за автоматизация на issues и workspace.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Удостоверение | Linear personal API key или OAuth2 |
| Изход | `$nodeLabel.*` |

## Удостоверение

Създайте **Linear** удостоверение в [Credentials Tab](../tabs/credentials-tab.md). Изберете един
режим на автентикация:

**Personal API key**

1. В Linear отворете **Settings → Security & Access → Personal API keys**.
2. Създайте ключ с достъп до workspace, който искате да автоматизирате.
3. Поставете ключа в ново Linear удостоверение в Heym и използвайте **Test Connection**, за да го проверите.

**OAuth2**

1. Създайте Linear OAuth приложение.
2. Регистрирайте `{FRONTEND_URL}/api/credentials/linear/oauth/callback` като redirect URI.
3. В Heym изберете **OAuth2**, въведете Client ID и Client Secret, след което натиснете **Connect**.

Personal API keys и OAuth tokens действат от името на потребителя, който ги е създал или оторизирал.

## Операции

| Операция | Задължителни полета | Изход |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; незадължителен After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; незадължителен After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; незадължителни Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; незадължителен After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID или идентификатор като `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID или идентификатор и поне едно променено поле | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID или идентификатор | `deleted` |
| Add Issue Link | Issue ID или идентификатор, Link URL | `link` |
| Create Comment | Issue ID или идентификатор, Comment Body | `comment` |
| List Comments | Issue ID или идентификатор, Limit; незадължителен After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Всички текстови полета поддържат [expressions](../reference/expression-dsl.md).

## Полета за issues

- **Team ID** и **Project ID** са Linear UUIDs. Използвайте List Teams или List Projects, за да ги откриете.
- **State ID** е workflow-state UUID, използван при създаване или обновяване на issue. Използвайте List Workflow States, за да го откриете.
- **Assignee ID** е Linear user UUID. Използвайте List Team Members, за да го откриете.
- **Priority** приема стойности от `0` до `4`: без приоритет, спешен, висок, нормален и нисък.
- Оставете незадължителните полета за обновяване празни, за да запазите текущите им стойности.
- Задайте поле за обновяване на `null`, за да изчистите description, project, assignee или state.
- **Link URL** добавя външна връзка за прикачен файл към issue.
- **Comment ID** е Linear UUID за съществуващ comment. Използвайте List Comments, за да го откриете.
- **Parent Comment ID** отговаря на съществуващ Linear comment при създаване на comment.

## Пагинация

Операциите за списъци могат или да върнат една страница, или автоматично да извлекат всяка страница:

- Оставете **Return All** изключено, за да използвате `Limit` и `After Cursor` ръчно.
- Включете **Return All**, за да следвате Linear курсори от страна на сървъра, до 10 000 резултата.

Резултатите с пагинация връщат `pageInfo.hasNextPage` и `pageInfo.endCursor`. Подайте курсора в
**After Cursor** при следващото изпълнение на node, за да извлечете следващата страница, когато **Return All** е изключено.

## Примери

Създаване на issue от входни данни от предходен node:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Добавяне на comment към създадено issue:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: незадължителен, когато отговаряте на друг comment

Разрешаване на comment thread:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Добавяне на външна връзка към issue:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Пагинация през членове на екипа:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` при следващото изпълнение, когато `hasNextPage` е true

Откриване на workflow state IDs преди обновяване на issue:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- След това използвайте `$listStates.states[0].id` като **State ID** в **Update Issue**

## Изход

Всяка успешна операция задава:

- `$linear.success`
- `$linear.operation`

Операциите за списъци също предоставят `count` и, където е приложимо, `pageInfo`. Операциите за issues предоставят
пълния Linear issue payload и удобни полета като `identifier` и `url`.
Comment мутациите предоставят пълния `comment` payload, с изключение на Delete Comment, който предоставя
`deleted` и `entityId`.

## Свързани

- [Credentials Tab](../tabs/credentials-tab.md)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
