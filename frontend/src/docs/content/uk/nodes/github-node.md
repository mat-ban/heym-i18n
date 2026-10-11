# Вузол GitHub

Вузол **GitHub** додає до workflow нативні операції GitHub REST, подібно до багатоопераційних вузлів GitHub, які Ви, можливо, знаєте з таких інструментів, як n8n.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Облікові дані | GitHub |
| Вихід | `$nodeLabel.*` |

## Підтримувані операції

Наразі вузол надає 40 дій:

| Ресурс | Дії |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Облікові дані

Створіть облікові дані **GitHub** на [вкладці «Облікові дані»](../tabs/credentials-tab.md), вказавши:

- Особистий access token
- Необов'язкову повну базову URL-адресу REST API для GitHub Enterprise Server

Залиште базову URL-адресу порожньою для GitHub.com. Рекомендовано використовувати fine-grained PAT.

Для GitHub Enterprise Server введіть повний endpoint REST API, включно з `/api/v3`, наприклад
`https://github.example.com/api/v3`. Не вводьте лише корінь вебінтерфейсу
(`https://github.example.com`).

Якщо Ви використовуєте GitHub Enterprise Server і згодом редагуєте облікові дані, щоб оновити token, залишення
`base_url` порожнім збереже наявний Enterprise endpoint. Вводьте нову URL-адресу лише тоді, коли потрібно
змінити цей endpoint.

## Спільні поля

Більшість операцій використовують:

- **Owner** – Власник репозиторію, назва організації або ім'я користувача
- **Repository** – Назва репозиторію

`List Organization Repositories` потребує лише **Owner** (назви організації) і не використовує поле repository.

`List User Repositories` потребує лише **Owner** (імені користувача) і не використовує поле repository.

`Get User Repositories` відтворює дію n8n User → Get Repositories. `Get User Issues` за замовчуванням повертає
issues, призначені автентифікованому користувачеві GitHub. Установіть **Mentioned Filter** у будь-яке
непорожнє значення, щоб натомість повертати issues, які згадують автентифікованого користувача. Він також підтримує
фільтри state, labels, updated-since, sort, direction і per-page. `Invite User` потребує
організації та адреси електронної пошти і не використовує Owner або Repository.

## Repository

Операції з репозиторіями охоплюють метадані, вміст виявленої ліцензії, профіль стану спільноти та
аналітику трафіку. `List Popular Paths for Repository` і
`List Top Referrers for Repository` повертають провідні записи трафіку GitHub за останні 14 днів і
потребують прав push для адміністрування репозиторію.

`List Issues` підтримує необов'язкові фільтри assignee, creator, mentioned user, розділених комами labels,
updated-since timestamp, sort і direction. `List Pull Requests` підтримує керування state, sort,
direction і per-page.

`Get Repository Issues` і `Get Repository Pull Requests` надають доступ до тих самих API, що й їхні List-
аналоги, під явними назвами дій репозиторію, сумісними з n8n.

### Отримання метаданих репозиторію

`Get Repository` зберігає повну відповідь GitHub у `$github.repository`, а також надає
`$github.full_name`, `$github.default_branch`, `$github.private` і `$github.url`.

Payload репозиторію зазвичай містить:

- Ідентичність і володіння: ID, назва, повна назва, опис, owner і видимість
- Стан репозиторію: private, fork, archived, disabled і default branch
- URL-адреси: сторінка GitHub, API, clone, SSH і Git URL-адреси
- Активність і розмір: часові позначки створення, оновлення та push, розмір, stars, watchers, forks, subscribers і відкриті issues
- Функції: issues, projects, wiki, Pages, discussions, topics, language і homepage
- Ліцензія, налаштування злиття, дозволи викликача, налаштування безпеки та метадані батьківського/вихідного fork, коли доступні

Деякі адміністративні поля, поля дозволів, злиття та безпеки залежать від дозволів репозиторію,
наданих обліковими даними.

Приклад:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Операції з issues підтримують поля title/body і необов'язкові поля JSON-масиву для labels і assignees.

`List Issues` повертає лише issues репозиторію. Pull requests виключено; для результатів PR використовуйте `List Pull Requests`.

```json
["bug", "backend"]
```

```json
["octocat"]
```

### Семантика полів Edit Issue

Для `Edit Issue` до GitHub надсилаються лише поля, які Ви явно встановили:

- **State** – Виберіть `Don't change`, `Open` або `Closed`. Залиште незаданим, щоб зберегти поточний стан.
- **State Reason** – За бажанням установіть `Completed`, `Not Planned`, `Duplicate` або `Reopened`.
- **Title / Body** – Залиште порожнім, щоб зберегти поточне значення.
- **Labels / Assignees** – Залиште поле порожнім, щоб зберегти поточне значення. Використайте `[]`, щоб очистити всі labels або assignees. Використайте JSON-масив, наприклад `["bug"]`, щоб замінити їх.

`Edit Issue` потребує принаймні одного поля для зміни під час виконання. Якщо Ви надасте лише номер issue, виконання завершиться помилкою валідації від шару GitHub API.
## Блокування Issue

`Lock Issue` приймає необов'язкову **Причину блокування**. Якщо її вказано, вона має бути одним із значень, які підтримує GitHub:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Залиште причину порожньою, щоб заблокувати без зазначення конкретної причини.

## Pull Requests

Створення PR потребує:

- Заголовок
- Head-гілка
- Base-гілка
- Необов'язковий опис
- Необов'язковий режим чернетки

## Pull Request Reviews

Операції рецензування відповідають API рецензування pull request від GitHub:

| Операція | Обов'язкові поля | Необов'язкові поля |
|-----------|-----------------|-----------------|
| `Create Review` | Номер pull request, подія | Опис, ID коміту |
| `Get Review` | Номер pull request, ID рецензії | — |
| `List Reviews` | Номер pull request | На сторінку |
| `Update Review` | Номер pull request, ID рецензії, опис | — |

`Create Review` підтримує `Approve`, `Request Changes`, `Comment` та `Pending`.
Опис є обов'язковим для `Request Changes` і `Comment`. Якщо ID коміту порожній, GitHub
рецензує останній коміт pull request.

## Releases

| Операція | Обов'язкові поля під час виконання | Зазвичай необов'язкові |
|-----------|---------------------------|-------------------|
| `Create Release` | Назва тегу | Назва релізу (заголовок), опис, цільова гілка, чернетка, попередній реліз |
| `Update Release` | ID релізу | Назва тегу, назва релізу, опис, цільова гілка, чернетка, попередній реліз |
| `Get Release` / `Delete Release` | ID релізу | — |

`Update Release` може явно встановити `draft` / `prerelease` у значення `true` або `false`.

## Workflows

Операції з workflow підтримують:

- Перелік workflow репозиторію
- Отримання workflow за числовим ID або назвою файлу workflow
- Увімкнення або вимкнення workflow
- Читання платного використання workflow за операційною системою runner
- Запуск workflow із зазначенням ref або гілки та необов'язкового об'єкта JSON inputs

GitHub перебуває в процесі закриття endpoint `Get Workflow Usage`. Workflow, що використовують
цю операцію, можуть потребувати міграції, коли GitHub видалить цей endpoint.

`Dispatch Workflow` приймає обидві форми відповіді GitHub: застарілу `204 No Content` та новішу
`200`, що містить `workflow_run_id`, `run_url` і `html_url`.

`Dispatch Workflow and Wait` запускає workflow та опитує виконання, доки його статус не стане
`completed`. Налаштуйте тайм-аут та інтервал опитування в секундах. Heym використовує
`workflow_run_id`, коли GitHub повертає новішу відповідь `200`. Для традиційної відповіді `204 No
Content` Heym виявляє щойно створене виконання `workflow_dispatch` для вибраного
workflow та ref, а потім очікує на це виконання.

## File Contents

`Get File` читає файл репозиторію через API вмісту GitHub і декодує текстовий вміст, коли це можливо. Бінарні файли та вміст, що не є UTF-8, можуть повертати метадані без декодованого поля `content`.

`List Files` повертає записи каталогу з API вмісту репозиторію для вказаного шляху до теки та необов'язкового ref. Залиште **Directory Path** порожнім, щоб отримати перелік кореня репозиторію.

`Create or Update File` записує текстовий вміст за шляхом у репозиторії, використовуючи:

- Шлях до файлу
- Повідомлення коміту
- Вміст файлу
- Необов'язкову гілку

`Delete File` видаляє шлях у репозиторії, використовуючи повідомлення коміту та необов'язкову гілку. Якщо файл існує, Heym автоматично отримує поточний SHA перед його видаленням.

Якщо файл уже існує, Heym автоматично отримує поточний SHA перед його оновленням.

## Pagination

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` та `Get User Repositories` підтримують
**Per Page** (1–100). Heym запитує одну сторінку результатів; поля `page` для отримання
додаткових сторінок у межах однієї операції немає.

## Output

Точна структура залежить від вибраної операції. Поширені поля включають:

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

Замініть `github` на мітку вашого вузла.

## Примітки

- Мітки та виконавці мають бути дійсними масивами JSON, якщо їх вказано.
- Вхідні дані для запуску workflow мають бути дійсним об'єктом JSON, якщо їх вказано.
- `Edit Issue` використовує `state` лише тоді, коли ви явно його встановлюєте; залиште його невстановленим, щоб зберегти поточний стан issue.
- Дозволи GitHub API залежать від областей дії token або деталізованих дозволів репозиторію, які ви надаєте.

## Пов'язане

- [Credentials Tab](../tabs/credentials-tab.md) – Додавання та керування обліковими даними GitHub
- [Third-Party Integrations](../reference/integrations.md) – Налаштування облікових даних GitHub та `base_url` для Enterprise
- [Agent Node](./agent-node.md) – Використання облікових даних GitHub з `@modelcontextprotocol/server-github`
- [Node Types](../reference/node-types.md) – Повний каталог вузлів
