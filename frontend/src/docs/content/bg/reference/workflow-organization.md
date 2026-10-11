# Организация на Workflows

Heym Ви позволява да организирате workflows в папки, да създавате подпапки и да планирате изтриване на workflows. Вижте [Workflows Tab](../tabs/workflows-tab.md) за преглед на потребителския интерфейс.

## Папки и подпапки

Папките образуват дървовидна структура. Всяка папка има:

- **Name** – Име за показване
- **Parent** – `parent_id` сочи към друга папка; `null` означава корен
- **Workflows** – Workflows могат да бъдат премествани в папки чрез `folder_id`

### API

| Endpoint | Предназначение |
|----------|---------|
| `GET /folders` | Само коренови папки |
| `GET /folders/tree` | Пълно дърво (деца + workflows) |
| `GET /folders/{id}` | Единична папка със съдържанието ѝ |
| `POST /folders` | Създаване на папка (`parent_id` е незадължителен) |
| `PUT /folders/{id}` | Обновяване на име или `parent_id` |
| `DELETE /folders/{id}` | Изтриване на папка (каскадно) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Преместване на workflow в папка |
| `DELETE /folders/workflows/{workflow_id}/folder` | Премахване на workflow от папка |
| `GET /folders/{id}/export` | Изтегляне на папка + всички подпапки като ZIP |

### Дървовидна структура

Отговорът за дървото включва `children` и `workflows` за всяка папка. Споделени workflows могат да се появят в папка чрез `WorkflowShare.folder_id`.

## Споделяне на Workflows

Отворете **Share** в редактора на workflow, за да поканите потребители по имейл или да споделите с [team](./teams.md). Всяка покана и всяко споделяне с team носят разрешение:

| Разрешение | Какво може да прави съcollaborator-ът |
|------------|------------------------------|
| **Read** | Да отваря workflow, да го разглежда, да вижда историята на изпълненията и да го стартира. Редакторът се отваря в режим само за четене: Save е деактивиран и canvas не може да бъде променян. |
| **Write** | Всичко, което позволява Read, плюс редактиране на canvas, настройки, документ за анализ и agent memory. |

Разрешението се показва до всеки запис в диалога Share и може да бъде променяно по всяко време от това падащо меню, без да се премахва и добавя отново споделянето. Когато даден потребител достигне до workflow по няколко пътя (директно споделяне и един или повече teams), **най-високото** разрешение печели. Споделянията, съществували преди въвеждането на разрешенията, са **Write**, а API клиентите, които пропускат `permission`, също получават **Write**.

Действията само за собственик никога не зависят от разрешението: изтриване на workflow, връщане или изчистване на версии, изчистване на история, управление на споделяния и [owner-only settings](#owner-only-settings) по-долу остават при собственика дори за **Write** collaborators. **Read** collaborator, който изпрати редакция чрез API (`PUT /api/workflows/{id}`, бележката за анализ, agent memory, изчистване на кеш) или чрез AI Assistant, получава `403` с `You have read-only access to this workflow`.

Споделянето на workflow дава достъп до canvas, историята на изпълненията и документа за анализ. То **не** споделя автоматично:

- **Credentials**, реферирани от nodes в workflow
- **Sub-workflows**, извиквани от [Execute](../nodes/execute-node.md) nodes или agents

Получателите се нуждаят от тези credentials и дъщерни workflows, споделени с тях отделно (същите потребители или teams). Споделяйте credentials от [Credentials tab](../tabs/credentials-tab.md); вижте [Credentials Sharing](./credentials-sharing.md). Споделяйте всеки sub-workflow от неговия собствен диалог за споделяне в редактора.

### Owner-only settings

Цялата конфигурация **Run with cURL** остава при собственика след споделяне. Collaborators все още отварят диалога и копират генерираната команда, но контролите са само за четене.

Промяната на което и да е от следните като non-owner се отхвърля с `403`:

- **Authentication** (`auth_type`) и **Header Key** (`auth_header_key`)
- **Request Body** режим (`webhook_body_mode`) и **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) и **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) се държи по различен начин: скрит е изцяло от collaborators и записът на collaborator се игнорира, вместо да бъде отхвърлен. Редакторът рендира полето маскирано, така че `403` там би счупил обикновено запазване, вместо да сигнализира за атака.

Authentication е причината блокът да е owner-only: `Anonymous` позволява на неавтентикирани извикващи да стартират workflow, а изпълнение без влязъл извикващ резолвва credentials и глобални променливи като **owner**, не като извикващия. Останалата част от блока е публикуваният договор за заявката и контролите за разходи на собственика, така че се мести заедно с него.

**On error, run workflow** (`error_workflow_id`) в панела **Properties** на ниво workflow е owner-only по същата причина: [error workflow](./features.md#error-workflow) се изпълнява с credentials и глобални променливи на неуспешното изпълнение, които са на собственика за triggered и anonymous изпълнения. Collaborators виждат настройката само за четене, а добавянето, заменянето или изчистването ѝ като non-owner се отхвърля с `403`.

Редактирането на canvas, име и описание не се засяга.

### Execution tokens

Collaborator може да издаде execution token за workflow, споделен с него. Изпълнението се приписва на **този, който е издал token-а**, така че използва credentials и глобални променливи на този потребител, не на собственика. Само истински anonymous извикване — `auth_type: anonymous` без извикващ — се изпълнява в контекста на собственика.

## Scheduled for Deletion

Workflows могат да бъдат планирани за изтриване, вместо да бъдат премахвани незабавно.

- **Field**: `scheduled_for_deletion` (nullable datetime)
- **Behavior**: Когато е зададено, workflow се премества в `folder_id = null` и се появява в секцията "Scheduled for Deletion".
### API

| Endpoint | Purpose |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Set `scheduled_for_deletion`, clear `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Clear `scheduled_for_deletion` (restore) |

### UI

- **Drag to trash** – Плъзнете workflows в зоната „Scheduled for Deletion“, за да ги планирате за изтриване
- **Restore** – Премахване от графика
- **Delete immediately** – Икона за кошче за окончателно премахване

### Cleanup Logic

Cron job се изпълнява ежедневно в **23:59** (конфигурирана часова зона). Един workflow се изтрива само когато:

- **Всички start nodes** (възли без входящи връзки, с изключение на sticky/errorHandler) имат `active === false`

Ако някой start node все още е активен, workflow остава до следващото изпълнение.

## Dashboard UI

- **Folder rows** – New Folder, рекурсивно дърво на папките с разгъване/свиване. Всяка папка носи
  незадължително описание под името си и badge, отчитащ workflows, които съдържа, включително
  подпапките.
- **Folder actions** – New Subfolder, Rename, Change icon, Download as ZIP и Delete са разположени inline
  на всеки ред на папка; контекстното меню с десен клик предлага същия набор, а на телефони се показва
  един бутон за меню.
- **Main area** – Root workflows (без папка, не са планирани) и Scheduled for Deletion
- **Folder drop preview** – Плъзгането на workflow осветява точната папка или подпапка и
  показва пълния ѝ път в preview с размерите на карта. Свита папка се разгъва след кратко задържане.
- **Stable drag feedback** – Картата източник използва drag ghost, а активната drop target остава
  избрана при превъртане или преминаване през контроли в същата папка.
- **Destination check** – Текущата папка се показва като **Already in Folder** и не приема
  излишно преместване.
- **Other drop zones** – Root и „Scheduled for Deletion“ се осветяват, когато могат да приемат
  плъзгания workflow.
- **ZIP drop** – Пуснете ZIP файл върху зоната за workflows, за да импортирате структура от папки на root ниво

## Related

- [Workflows Tab](../tabs/workflows-tab.md) – Създаване и управление на workflows
- [Credentials Sharing](./credentials-sharing.md) – Споделяне на удостоверения с сътрудници по workflow
- [Teams](./teams.md) – Споделяне на workflows и удостоверения с екипи
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, възли и изпълнение
- [Workflow Structure](./workflow-structure.md) – JSON формат за workflows
- [Triggers](./triggers.md) – Start nodes и входни точки
