# GitHub Node

**GitHub** node-ът добавя нативни GitHub REST операции към workflow, подобно на multi-operation GitHub node-овете, които може да познавате от инструменти като n8n.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Удостоверение | GitHub |
| Изход | `$nodeLabel.*` |

## Поддържани операции

Node-ът понастоящем предоставя 40 действия:

| Ресурс | Действия |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Удостоверение

Създайте **GitHub** удостоверение в [Credentials Tab](../tabs/credentials-tab.md) с:

- Personal access token
- По избор пълен REST API base URL за GitHub Enterprise Server

Оставете base URL празен за GitHub.com. Препоръчват се fine-grained PATs.

За GitHub Enterprise Server въведете пълния REST API endpoint, включително `/api/v3`, например
`https://github.example.com/api/v3`. Не въвеждайте само корена на web UI
(`https://github.example.com`).

Ако използвате GitHub Enterprise Server и по-късно редактирате удостоверението, за да смените token-а, оставянето на
`base_url` празен запазва съществуващия Enterprise endpoint. Въведете нов URL само когато искате
да промените този endpoint.

## Общи полета

Повечето операции използват:

- **Owner** – Собственик на repository, име на организация или потребителско име
- **Repository** – Име на repository

`List Organization Repositories` изисква само **Owner** (името на организацията) и не използва полето за repository.

`List User Repositories` изисква само **Owner** (потребителското име) и не използва полето за repository.

`Get User Repositories` възпроизвежда действието User → Get Repositories на n8n. `Get User Issues` връща
issues, assigned на удостоверения GitHub потребител по подразбиране. Задайте **Mentioned Filter** на произволна
непразна стойност, за да върнете вместо това issues, споменаващи удостоверения потребител. Той също поддържа
филтри за state, labels, updated-since, sort, direction и per-page. `Invite User` изисква
организация и имейл адрес и не използва Owner или Repository.

## Repository

Repository операциите включват метаданни, съдържание на открит лиценз, профил за здравето на общността и
прозрения за трафика. `List Popular Paths for Repository` и
`List Top Referrers for Repository` връщат топ записите за трафик на GitHub за последните 14 дни и
изискват административен push достъп до repository.

`List Issues` поддържа незадължителни филтри за assignee, creator, mentioned user, labels, разделени със запетая,
updated-since timestamp, sort и direction. `List Pull Requests` поддържа контроли за state, sort,
direction и per-page.

`Get Repository Issues` и `Get Repository Pull Requests` предоставят същите API-та като своите List
еквиваленти под явни, съвместими с n8n имена на repository действия.

### Get Repository metadata

`Get Repository` съхранява пълния отговор на GitHub в `$github.repository` и също предоставя
`$github.full_name`, `$github.default_branch`, `$github.private` и `$github.url`.

Payload-ът на repository обикновено включва:

- Идентичност и собственост: ID, name, full name, description, owner и visibility
- Състояние на repository: private, fork, archived, disabled и default branch
- URL адреси: GitHub page, API, clone, SSH и Git URLs
- Активност и размер: creation, update и push timestamps, size, stars, watchers, forks, subscribers и open issues
- Функции: issues, projects, wiki, Pages, discussions, topics, language и homepage
- License, merge settings, caller permissions, security settings и fork parent/source метаданни, когато са налични

Някои административни полета, полета за разрешения, merge и security зависят от разрешенията на repository
на удостоверението.

Пример:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Issue операциите поддържат полета за title/body и незадължителни JSON-array полета за labels и assignees.

`List Issues` връща само repository issues. Pull requests са изключени; използвайте `List Pull Requests` за PR резултати.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Семантика на полетата на Edit Issue

За `Edit Issue` само полетата, които изрично зададете, се изпращат към GitHub:

- **State** – Изберете `Don't change`, `Open` или `Closed`. Оставете незададено, за да запазите текущото състояние.
- **State Reason** – По избор задайте `Completed`, `Not Planned`, `Duplicate` или `Reopened`.
- **Title / Body** – Оставете празно, за да запазите текущата стойност.
- **Labels / Assignees** – Оставете полето празно, за да запазите текущата стойност. Използвайте `[]`, за да изчистите всички labels или assignees. Използвайте JSON array като `["bug"]`, за да ги замените.

`Edit Issue` изисква поне едно поле за промяна по време на изпълнение. Ако предоставите само номер на issue, изпълнението се проваля с validation error от GitHub API слоя.
## Заключване на Issue

`Lock Issue` приема незадължителна **Причина за заключване** (Lock reason). Когато е предоставена, тя трябва да бъде една от поддържаните от GitHub стойности:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Оставете причината празна, за да заключите без конкретна причина.

## Pull Requests

Създаването на PR изисква:

- Заглавие
- Head branch
- Base branch
- Незадължително тяло (body)
- Незадължителен режим на чернова (draft mode)

## Pull Request Reviews

Операциите за ревюта съответстват на API-то на GitHub за преглед на pull requests:

| Операция | Задължителни полета | Незадължителни полета |
|-----------|-----------------|-----------------|
| `Create Review` | Номер на pull request, event | Тяло (body), commit ID |
| `Get Review` | Номер на pull request, review ID | — |
| `List Reviews` | Номер на pull request | На страница (Per page) |
| `Update Review` | Номер на pull request, review ID, тяло (body) | — |

`Create Review` поддържа `Approve`, `Request Changes`, `Comment` и `Pending`.
Тялото (body) е задължително за `Request Changes` и `Comment`. Когато Commit ID е празно, GitHub
преглежда последния commit на pull request-а.

## Releases

| Операция | Задължителни полета по време на изпълнение | Обичайно незадължителни |
|-----------|---------------------------|-------------------|
| `Create Release` | Име на таг (Tag name) | Име на release (заглавие), тяло (body), целеви branch, draft, prerelease |
| `Update Release` | Release ID | Име на таг (Tag name), име на release, тяло (body), целеви branch, draft, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` може изрично да зададе `draft` / `prerelease` на `true` или `false`.

## Workflows

Операциите с Workflows поддържат:

- Изброяване на workflow-и в repository
- Получаване на workflow по числов ID или по име на workflow файл
- Активиране или деактивиране на workflow
- Четене на използването на workflow за таксуване по операционна система на runner
- Задействане (dispatch) на workflow с ref или branch плюс незадължителен JSON обект с inputs

GitHub е в процес на преустановяване на endpoint-а `Get Workflow Usage`. Workflows, използващи
тази операция, може да се нуждаят от миграция, когато GitHub премахне endpoint-а.

`Dispatch Workflow` приема и двете форми на отговор от GitHub: остарелия `204 No Content` и по-новия
`200` отговор, съдържащ `workflow_run_id`, `run_url` и `html_url`.

`Dispatch Workflow and Wait` задейства workflow-а и проверява (poll) изпълнението, докато статусът му стане
`completed`. Конфигурирайте timeout-а и интервала на проверка в секунди. Heym използва
`workflow_run_id`, когато GitHub върне по-новия `200` отговор. За традиционния `204 No
Content` отговор Heym открива новосъздаденото изпълнение `workflow_dispatch` за избрания
workflow и ref, след което изчаква това изпълнение.

## File Contents

`Get File` чете файл от repository чрез API-то за съдържание на GitHub и декодира текстовото съдържание, когато е налично. Двоичните файлове и съдържанието, което не е в UTF-8, може да върнат метаданни без декодирано поле `content`.

`List Files` връща записи от директория от API-то за съдържание на repository за даден път до папка и незадължителен ref. Оставете **Directory Path** празно, за да изброите корена на repository-то.

`Create or Update File` записва текстово съдържание на път в repository, използвайки:

- Път до файл (File path)
- Съобщение за commit (Commit message)
- Съдържание на файла (File content)
- Незазадължителен branch

`Delete File` премахва път в repository, използвайки съобщение за commit и незадължителен branch. Ако файлът съществува, Heym извлича текущия SHA автоматично преди изтриването му.

Ако файлът вече съществува, Heym извлича текущия SHA автоматично преди актуализирането му.

## Pagination

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` и `Get User Repositories` поддържат
**Per Page** (1–100). Heym заявява една страница с резултати; няма поле `page` за извличане
на допълнителни страници в рамките на същата операция.

## Output

Точната структура зависи от избраната операция. Често срещани полета включват:

- `$github.success`
- `$github.operation`
- `$github.repository`
- `$github.license`
- `$github.profile`
- `$github.paths`
- `$github.referrers`
- `$github.issue`
- `$github.issues`
- `$github.pull_request`
- `$github.pull_requests`
- `$github.review`
- `$github.reviews`
- `$github.release`
- `$github.releases`
- `$github.workflow`
- `$github.workflows`
- `$github.workflow_run`
- `$github.workflow_run_id`
- `$github.completed`
- `$github.conclusion`
- `$github.usage`
- `$github.billable`
- `$github.invitation`
- `$github.file`
- `$github.items`
- `$github.path`
- `$github.sha`
- `$github.commit_sha`
- `$github.deleted`
- `$github.created`
- `$github.ref`
- `$github.inputs`

Заменете `github` с етикета на Вашия node.

## Notes

- Labels и assignees трябва да бъдат валидни JSON масиви, когато са предоставени.
- Inputs за задействане на workflow трябва да бъдат валиден JSON обект, когато са предоставени.
- `Edit Issue` използва `state` само когато изрично го зададете; оставете го незададено, за да запазите текущото състояние на issue-то.
- Разрешенията на GitHub API зависят от обхватите на token-а или фино гранулираните разрешения за repository, които предоставите.

## Related

- [Credentials Tab](../tabs/credentials-tab.md) – Добавяне и управление на GitHub удостоверения
- [Third-Party Integrations](../reference/integrations.md) – Настройка на GitHub удостоверения и Enterprise `base_url`
- [Agent Node](./agent-node.md) – Използване на GitHub удостоверения с `@modelcontextprotocol/server-github`
- [Node Types](../reference/node-types.md) – Пълен каталог с nodes
