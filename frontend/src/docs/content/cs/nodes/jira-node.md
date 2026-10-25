# Uzel Jira

Uzel **Jira** propojuje workflow s Jira REST API pro automatizaci projektů, issue, komentářů, příloh, uživatelů, oznámení a přechodů. Výchozí operací je **Search Issues**.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Přihlašovací údaje | Jira (Cloud e-mail/API token, Data Center uživatelské jméno/heslo nebo osobní přístupový token, base URL, režim nasazení, volitelná verze REST API) |
| Výstup | `$nodeLabel.*` |

## Přihlašovací údaje

Vytvořte přihlašovací údaje **Jira** na [kartě Přihlašovací údaje](../tabs/credentials-tab.md). Uložené konfigurační klíče jsou `email`, `api_token`, `base_url`, `deployment`, `auth_mode` a volitelný `api_version`. Pro Jira Cloud ukládá `email` e-mail účtu Atlassian a `api_token` ukládá Atlassian API token. Pro Jira Data Center / Server ukládají tytéž klíče uživatelské jméno a heslo pro Basic auth, nebo při `auth_mode: pat` ukládá `api_token` osobní přístupový token odesílaný jako Bearer token a `email` se nepoužívá. Postup nastavení naleznete v části [Third-Party Integrations](../reference/integrations.md#jira).

| Pole | Konfigurační klíč | Popis |
| --- | --- | --- |
| Jira Email / Username | `email` | E-mail účtu Atlassian pro Jira Cloud, nebo uživatelské jméno pro Jira Data Center / Server |
| Ověření | `auth_mode` | `basic` (výchozí) nebo `pat` (pouze Data Center / Server) |
| API Token / Password / Osobní přístupový token | `api_token` | Atlassian API token pro Jira Cloud, heslo pro Basic auth u Jira Data Center / Server nebo osobní přístupový token Data Center v režimu `pat` |
| Base URL | `base_url` | URL stránky Jira, například `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` pro Jira Cloud nebo `data_center` pro Jira Data Center / Server |
| REST API Version | `api_version` | Výchozí hodnota je `3` pro Jira Cloud. Data Center / Server používá REST API v2 |

Osobní přístupové tokeny vyžadují Jira Data Center / Server 8.14 nebo novější. Přepnutí metody ověření vymaže uložený tajný klíč, proto při přepnutí zadejte nové heslo nebo token.

Pomocí **Test Connection** ověřte přihlašovací údaje vůči aktuálnímu uživateli Jira.

## Operace

| Operace | Povinná pole | Výstup |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Volitelné Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | Volitelné JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key nebo ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key nebo ID a alespoň jedno změněné pole | `issue`, `key` |
| Delete Issue | Issue Key nebo ID | `deleted` |
| Get Issue Changelog | Issue Key nebo ID; volitelné Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key nebo ID, Subject, Text Body | `notified` |
| List Comments | Issue Key nebo ID; volitelné Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key nebo ID, Comment Body | `comment` |
| Get Comment | Issue Key nebo ID, Comment ID | `comment` |
| Update Comment | Issue Key nebo ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key nebo ID, Comment ID | `deleted` |
| Add Attachment | Issue Key nebo ID, Filename, Base64 content | `attachments`, `count` |
| Get Attachment | Attachment ID; volitelné Include Binary | `attachment` |
| List Attachments | Issue Key nebo ID; volitelné Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key nebo ID | `transitions`, `count` |
| Transition Issue | Issue Key nebo ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

Textová pole podporující výrazy podporují [výrazy](../reference/expression-dsl.md), jako například `$input.text`. `jiraIncludeBinary` je přepínač typu boolean a nepodporuje výrazy, ale lze jej označit jako poskytovaný agentem, pokud je uzel Jira připojen k handle nástroje Agent.

## Pole issue a aktualizace

- **Project Key** je krátký klíč projektu, například `ENG`. Klíče lze zjistit pomocí List Projects.
- **Issue Key nebo ID** přijímá klíče jako `ENG-123` nebo číselná ID issue. Hodnoty lze zjistit pomocí Search Issues nebo List Projects.
- **Transition ID** pochází z List Transitions. Každý objekt přechodu obsahuje pole `id`.
- **Comment ID** a **Attachment ID** pocházejí z List Comments, List Attachments nebo z předchozích odpovědí na vytvoření/získání.
- **Account ID / Username** je hodnota `accountId` pro Jira Cloud nebo uživatelské jméno pro Jira Data Center / Server. Zjistit ji lze pomocí Get Myself nebo Get User.
- Text **description** issue a **body** komentáře se v REST API v3 odesílá ve formátu Atlassian Document Format; pokud je režim nasazení přihlašovacích údajů Data Center / Server, odesílají se jako prostý text. Ve v3 se znaky nového řádku stávají samostatnými odstavci.
- **Get Issue Changelog** používá stránkovaný endpoint changelog pro Jira Cloud. Pro Data Center / Server čte rozšířená data changelog issue a aplikuje nakonfigurovaný offset/limit na vrácené historie.
- U **Update Issue** ponechte volitelná pole prázdná, aby si zachovala své aktuální hodnoty.
- Nastavte **Description** nebo **Assignee Account ID / Username** při aktualizaci na `null`, chcete-li tato pole vymazat. Štítky (Labels) nelze vymazat pomocí `null`.
- **Recipients JSON** u Notify Issue má při vynechání výchozí hodnotu `{"assignee":true}`. Mezi běžné klíče patří `assignee`, `reporter`, `watchers` a `voters` (například `{"assignee":true,"watchers":true}`).
- **Add Attachment** přijímá obsah ve formátu raw base64 nebo data URL a je omezeno nastavením velikosti souboru platformy (výchozí 99 MB).
## Stránkování

- **Search Issues** používá cursor pagination prostřednictvím `jiraNextPageToken` pro Jira Cloud. Přečtěte `pagination.nextPageToken` z předchozího spuštění a předejte jej do dalšího uzlu Search Issues.
- **Search Issues** používá offset pagination prostřednictvím `jiraStartAt` pro Jira Data Center / Server. Přečtěte `pagination.startAt`, `pagination.maxResults` a `pagination.total` pro výpočet další stránky.
- **List Projects**, **Get Issue Changelog**, **List Comments** a **List Attachments** používají offset pagination s `jiraLimit` a `jiraStartAt`. Stránkované výsledky vracejí `pagination.startAt`, `pagination.maxResults`, `pagination.total` a `pagination.isLast`.
- **List Attachments** nejprve načte všechny přílohy z issue a poté výsledek rozdělí na straně klienta. Pole pro stránkování stále popisují vrácenou stránku, ale u rozsáhlých issue může dojít k dodatečným nákladům na načtení.
- **List Transitions** nepodporuje stránkování.

## Klíčová pole

| Pole | Používáno v | Poznámky |
| --- | --- | --- |
| `credentialId` | Všechny operace | UUID vlastněných přihlašovacích údajů Jira |
| `jiraOperation` | Všechny operace | Výchozí hodnota je `searchIssues` |
| `jiraProjectKey` | Create Issue | Klíč projektu, například `ENG` |
| `jiraIssueKey` | Operace s issue, komentáři, přílohami, oznámeními a přechody | Klíč issue, například `ENG-123`, nebo číselné ID issue |
| `jiraIssueType` | Create Issue | Výchozí hodnota je `Task` |
| `jiraIssueTypeId` | Create Issue | Volitelné ID typu issue; při nastavení přepíše `jiraIssueType` |
| `jiraSummary` | Create/Update Issue | Povinné pro Create Issue |
| `jiraDescription` | Create/Update Issue | Odesíláno jako ADF na REST API v3 nebo jako prostý text na REST API v2; při aktualizaci použijte `null` pro vymazání popisu |
| `jiraJql` | Search Issues | Výchozí hodnota je `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Volitelné pole JSON nebo pole issue oddělených čárkou; při prázdné hodnotě se použijí výchozí `key`, `summary`, `status`, `assignee` a `issuetype` |
| `jiraAssigneeAccountId` | Create/Update Issue | accountId v Jira Cloud nebo uživatelské jméno v Data Center / Server; při aktualizaci použijte `null` pro vymazání přiřazeného řešitele |
| `jiraLabels` | Create/Update Issue | Pole JSON nebo text oddělený čárkami |
| `jiraCommentBody` | Create/Update Comment | Odesíláno jako ADF na REST API v3 nebo jako prostý text na REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID komentáře Jira |
| `jiraTransitionId` | Transition Issue | Zjistěte pomocí List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID přílohy Jira |
| `jiraAttachmentFilename` | Add Attachment | Název nahrávaného souboru |
| `jiraAttachmentBase64` | Add Attachment | Obsah v raw base64 nebo data URL; podléhá limitu velikosti souboru |
| `jiraAttachmentMimeType` | Add Attachment | Volitelný MIME typ; při prázdné hodnotě se odvodí z názvu souboru |
| `jiraIncludeBinary` | Get/List Attachment | Boolean přepínač; při zapnutí přidá `content_base64` |
| `jiraNotifySubject` | Notify Issue | Povinný předmět oznámení |
| `jiraNotifyTextBody` | Notify Issue | Povinné tělo oznámení v prostém textu |
| `jiraNotifyHtmlBody` | Notify Issue | Volitelné HTML tělo |
| `jiraNotifyTo` | Notify Issue | JSON příjemců; výchozí hodnota je `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | accountId v Jira Cloud nebo uživatelské jméno v Data Center / Server |
| `jiraUserEmail` | Create User | E-mailová adresa nového uživatele |
| `jiraUsername` | Create User | Volitelné uživatelské jméno v Data Center / Server; při prázdné hodnotě se použije `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Volitelné zobrazované jméno |
| `jiraUserProducts` | Create User | Pole JSON nebo klíče produktů oddělené čárkami; pouze Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Výchozí hodnota je `50`; rozsah 1–100 |
| `jiraStartAt` | Search Issues v Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Počáteční index offset pagination |
| `jiraNextPageToken` | Search Issues v Jira Cloud | Cursor token z předchozí odpovědi vyhledávání |

## Příklady

Vytvoření issue ze vstupu z předchozího uzlu:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Aktualizace issue a vymazání přiřazeného řešitele:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Vyhledání issue s vlastními poli a cursor pagination:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Vyhledání issue v Data Center s offset pagination:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Přechod issue po vypsání dostupných přechodů:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Poté spusťte **Transition Issue** s Transition ID: `$listTransitions.transitions[0].id`

Oznámení sledujícím o aktualizaci issue:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Výstup

Každá úspěšná operace nastavuje:

- `$jira.success`
- `$jira.operation`

**Get Myself** zpřístupňuje `user`.

**Operace se stránkovaným seznamem** zpřístupňují `count`, pole kolekce a `pagination`:

| Operace | Klíč kolekce | Tvar stránkování |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** zpřístupňuje `transitions` a `count` bez stránkování.

**Mutace a čtení issue** zpřístupňují payload issue Jira plus `key`, pokud je to relevantní.

**Comment** get/create/update zpřístupňují `comment`; delete zpřístupňuje `deleted`.

**Transition Issue** zpřístupňuje `transition` jako `{ transitionId }` plus aktualizované `issue` a `key`.

**Attachment add** zpřístupňuje `attachments` a `count`. **Get Attachment** zpřístupňuje `attachment`; **List Attachments** zpřístupňuje `attachments`, `count` a `pagination`. Pokud je povolena volba **Include Binary**, může každý objekt přílohy obsahovat `content_base64`. Delete zpřístupňuje `deleted`.

**User** get/create zpřístupňují `user`; delete zpřístupňuje `deleted`.

**Notify Issue** zpřístupňuje `notified`.

Běžné vzory přístupu:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Související

- [Záložka Přihlašovací údaje](../tabs/credentials-tab.md)
- [Integrace třetích stran](../reference/integrations.md#jira)
- [Typy uzlů](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
