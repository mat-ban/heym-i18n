# Teams

Teams Ви позволяват да споделяте workflows, удостоверения, глобални променливи, векторни хранилища и Drive файлове с група потребители наведнъж.

## Преглед

- **Team** – Именувана група със създател и членове
- **Създател** – Винаги е член; може да редактира team, да изтрива team, да добавя членове
- **Член** – Може да добавя и премахва други членове (с изключение на създателя); има достъп до ресурсите, споделени с team

## Създаване и управление на Teams

Създавайте teams от [раздела Teams](../tabs/teams-tab.md). Добавяйте членове по имейл; те трябва да имат акаунт. Създателят не може да бъде премахнат. Изтриването на team премахва всички team shares.

## Модел на споделяне

Ресурсите могат да бъдат споделяни с:

1. **Отделни потребители** – По имейл (споделяне потребител-към-потребител)
2. **Teams** – Чрез избор на team (team share)

И двата модела са адитивни. Потребителят получава достъп, ако е или:

- Споделено директно с него (user share), или
- Член на team, с който е споделен ресурсът (team share)

## Какво може да се споделя с Teams

| Ресурс | Място на споделяне |
|----------|----------------|
| Workflows | Диалог за споделяне в редактора на workflow |
| Workflow Templates | Диалог за споделяне при създаване/редактиране на workflow template |
| Node Templates | Диалог за споделяне при създаване/редактиране на node template |
| Удостоверения | Диалог за споделяне в раздела Удостоверения |
| Глобални променливи | Диалог за споделяне в раздела Променливи |
| Векторни хранилища | Диалог за споделяне в раздела Vectors |
| Drive файлове | Диалог за споделяне в раздела Drive или операциите на Drive node `shareWithMyTeams` / `unshareWithMyTeams` |

За templates, когато видимостта е **Specific users**, можете също да изберете teams. Всички членове на избраните teams получават достъп до template.
Team shares за Drive файлове са само за четене за членовете на team; собственикът на файла запазва права за управление.

## API Endpoints

- `GET /api/teams` – Изброява teams, към които потребителят принадлежи
- `GET /api/teams/{id}` – Връща детайли за team с членовете
- `GET /api/teams/{id}/shared-entities` – Връща обектите, споделени с team (workflows, удостоверения, глобални променливи, векторни хранилища, файлове, workflow templates, node templates)
- `POST /api/teams` – Създава team
- `PATCH /api/teams/{id}` – Обновява team
- `DELETE /api/teams/{id}` – Изтрива team (само създател)
- `POST /api/teams/{id}/members` – Добавя член (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Премахва член

Team shares за ресурс:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – POST body приема `permission` (`read` или `write`, по подразбиране `write`); повторното подаване на съществуващ team обновява неговото разрешение
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Свързани

- [Раздел Teams](../tabs/teams-tab.md) – Създаване и управление на teams
- [Раздел Templates](../tabs/templates-tab.md) – Споделяне на workflow и node templates с teams
- [Споделяне на удостоверения](./credentials-sharing.md) – Споделяне на удостоверения с потребители и teams
- [Организация на workflows](./workflow-organization.md) – Папки и споделяне на workflows
