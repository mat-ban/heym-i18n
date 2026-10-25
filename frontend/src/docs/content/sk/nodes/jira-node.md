# Jira uzol

Uzol **Jira** prepája workflowy s Jira REST API pre automatizáciu projektov, issue, komentárov, príloh, používateľov, upozornení a prechodov. Predvolená operácia je **Search Issues**.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Prihlasovacie údaje | Jira (Cloud e-mail/API token, Data Center používateľské meno/heslo alebo osobný prístupový token, base URL, režim nasadenia, voliteľná verzia REST API) |
| Výstup | `$nodeLabel.*` |

## Prihlasovacie údaje

Vytvorte prihlasovacie údaje **Jira** v [karte Prihlasovacie údaje](../tabs/credentials-tab.md). Uložené konfiguračné kľúče sú `email`, `api_token`, `base_url`, `deployment`, `auth_mode` a voliteľný `api_version`. Pre Jira Cloud `email` uchováva email účtu Atlassian a `api_token` uchováva Atlassian API token. Pre Jira Data Center / Server tie isté kľúče uchovávajú používateľské meno a heslo pre Basic auth, alebo pri `auth_mode: pat` ukladá `api_token` osobný prístupový token odosielaný ako Bearer token a `email` sa nepoužíva. Kroky nastavenia nájdete v [Third-Party Integrations](../reference/integrations.md#jira).

| Pole | Konfiguračný kľúč | Popis |
| --- | --- | --- |
| Jira Email / Username | `email` | Email účtu Atlassian pre Jira Cloud alebo používateľské meno pre Jira Data Center / Server |
| Overenie | `auth_mode` | `basic` (predvolené) alebo `pat` (iba Data Center / Server) |
| API Token / Password / Osobný prístupový token | `api_token` | Atlassian API token pre Jira Cloud, heslo pre Basic auth pre Jira Data Center / Server alebo osobný prístupový token Data Center v režime `pat` |
| Base URL | `base_url` | URL stránky Jira, napríklad `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` pre Jira Cloud alebo `data_center` pre Jira Data Center / Server |
| REST API Version | `api_version` | Predvolene `3` pre Jira Cloud. Data Center / Server používa REST API v2 |

Osobné prístupové tokeny vyžadujú Jira Data Center / Server 8.14 alebo novší. Prepnutie metódy overenia vymaže uložené tajomstvo, preto pri prepnutí zadajte nové heslo alebo token.

Pomocou **Test Connection** overte prihlasovacie údaje voči aktuálnemu používateľovi Jira.

## Operácie

| Operácia | Povinné polia | Výstup |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Voliteľné Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | Voliteľné JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key alebo ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key alebo ID a aspoň jedno zmenené pole | `issue`, `key` |
| Delete Issue | Issue Key alebo ID | `deleted` |
| Get Issue Changelog | Issue Key alebo ID; voliteľné Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key alebo ID, Subject, Text Body | `notified` |
| List Comments | Issue Key alebo ID; voliteľné Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key alebo ID, Comment Body | `comment` |
| Get Comment | Issue Key alebo ID, Comment ID | `comment` |
| Update Comment | Issue Key alebo ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key alebo ID, Comment ID | `deleted` |
| Add Attachment | Issue Key alebo ID, Filename, Base64 content | `attachments`, `count` |
| Get Attachment | Attachment ID; voliteľné Include Binary | `attachment` |
| List Attachments | Issue Key alebo ID; voliteľné Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key alebo ID | `transitions`, `count` |
| Transition Issue | Issue Key alebo ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

Textové polia podporujúce výrazy podporujú [výrazy](../reference/expression-dsl.md), napríklad `$input.text`. `jiraIncludeBinary` je boolean prepínač a nepodporuje výrazy, ale môže byť označený ako poskytovaný agentom, keď je uzol Jira pripojený k handle nástroja Agent.

## Polia issue a aktualizácie

- **Project Key** je krátky kľúč projektu, napríklad `ENG`. Na zistenie kľúčov použite List Projects.
- **Issue Key or ID** akceptuje kľúče ako `ENG-123` alebo číselné ID issue. Na zistenie hodnôt použite Search Issues alebo List Projects.
- **Transition ID** pochádza z List Transitions. Každý objekt prechodu obsahuje pole `id`.
- **Comment ID** a **Attachment ID** pochádzajú z List Comments, List Attachments alebo z predchádzajúcich odpovedí create/get.
- **Account ID / Username** je hodnota `accountId` pre Jira Cloud alebo používateľské meno pre Jira Data Center / Server. Get Myself alebo Get User vám môžu pomôcť ju zistiť.
- Text **description** issue a **body** komentára sa odosiela ako Atlassian Document Format na REST
  API v3; keď je režim nasadenia prihlasovacích údajov Data Center / Server, odosielajú sa ako čistý text.
  Vo v3 sa znaky nového riadku stávajú samostatnými odsekmi.
- **Get Issue Changelog** používa stránkovaný changelog endpoint Jira Cloud. Pre Data Center / Server číta rozšírené changelog dáta issue a aplikuje nakonfigurovaný offset/limit na vrátené histórie.
- Pri **Update Issue** nechajte voliteľné polia prázdne, aby sa zachovali ich aktuálne hodnoty.
- Pri aktualizácii nastavte **Description** alebo **Assignee Account ID / Username** na `null`, aby sa tieto polia vymazali. Labels nie je možné vymazať pomocou `null`.
- **Recipients JSON** pri Notify Issue má predvolene hodnotu `{"assignee":true}`, keď je vynechané. Bežné kľúče zahŕňajú `assignee`, `reporter`, `watchers` a `voters` (napríklad `{"assignee":true,"watchers":true}`).
- **Add Attachment** akceptuje surový base64 alebo obsah data URL a je obmedzené nastavením veľkosti súboru platformy (predvolene 99 MB).
## Stránkovanie

- **Search Issues** používa stránkovanie pomocou kurzora cez `jiraNextPageToken` pre Jira Cloud. Prečítajte `pagination.nextPageToken` z predchádzajúceho spustenia a odovzdajte ho do ďalšieho uzla Search Issues.
- **Search Issues** používa stránkovanie s posunom cez `jiraStartAt` pre Jira Data Center / Server. Prečítajte `pagination.startAt`, `pagination.maxResults` a `pagination.total` na výpočet ďalšej stránky.
- **List Projects**, **Get Issue Changelog**, **List Comments** a **List Attachments** používajú stránkovanie s posunom pomocou `jiraLimit` a `jiraStartAt`. Stránkované výsledky vracajú `pagination.startAt`, `pagination.maxResults`, `pagination.total` a `pagination.isLast`.
- **List Attachments** najprv načíta všetky prílohy z issue a následne výsledok rozdelí na strane klienta. Polia stránkovania stále opisujú vrátenú stránku, avšak pri rozsiahlych issue môže dôjsť k dodatočným nákladom na načítanie.
- **List Transitions** nepodporuje stránkovanie.

## Kľúčové polia

| Pole | Používa | Poznámky |
| --- | --- | --- |
| `credentialId` | Všetky operácie | UUID vlastnených prihlasovacích údajov Jira |
| `jiraOperation` | Všetky operácie | Predvolená hodnota je `searchIssues` |
| `jiraProjectKey` | Create Issue | Kľúč projektu, napríklad `ENG` |
| `jiraIssueKey` | Operácie s issue, komentármi, prílohami, upozorneniami a prechodmi | Kľúč issue, napríklad `ENG-123`, alebo číselné ID issue |
| `jiraIssueType` | Create Issue | Predvolená hodnota je `Task` |
| `jiraIssueTypeId` | Create Issue | Voliteľné ID typu issue; ak je nastavené, prepíše `jiraIssueType` |
| `jiraSummary` | Create/Update Issue | Povinné pre Create Issue |
| `jiraDescription` | Create/Update Issue | Odosielané ako ADF na REST API v3 alebo ako čistý text na REST API v2; pri aktualizácii použite `null` na vymazanie popisu |
| `jiraJql` | Search Issues | Predvolená hodnota je `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Voliteľné pole JSON alebo polia issue oddelené čiarkou; ak je prázdne, predvolené hodnoty sú `key`, `summary`, `status`, `assignee` a `issuetype` |
| `jiraAssigneeAccountId` | Create/Update Issue | accountId v Jira Cloud alebo používateľské meno v Data Center / Server; pri aktualizácii použite `null` na vymazanie riešiteľa |
| `jiraLabels` | Create/Update Issue | Pole JSON alebo text oddelený čiarkou |
| `jiraCommentBody` | Create/Update Comment | Odosielané ako ADF na REST API v3 alebo ako čistý text na REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID komentára v Jira |
| `jiraTransitionId` | Transition Issue | Zistite pomocou List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID prílohy v Jira |
| `jiraAttachmentFilename` | Add Attachment | Názov nahraného súboru |
| `jiraAttachmentBase64` | Add Attachment | Obsah v surovom base64 alebo data URL; podlieha limitu veľkosti súboru |
| `jiraAttachmentMimeType` | Add Attachment | Voliteľný MIME typ; ak je prázdny, odvodí sa z názvu súboru |
| `jiraIncludeBinary` | Get/List Attachment | Boolean prepínač; po zapnutí pridá `content_base64` |
| `jiraNotifySubject` | Notify Issue | Povinný predmet upozornenia |
| `jiraNotifyTextBody` | Notify Issue | Povinné telo upozornenia v čistom texte |
| `jiraNotifyHtmlBody` | Notify Issue | Voliteľné telo v HTML |
| `jiraNotifyTo` | Notify Issue | JSON príjemcov; predvolená hodnota je `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | accountId v Jira Cloud alebo používateľské meno v Data Center / Server |
| `jiraUserEmail` | Create User | E-mailová adresa nového používateľa |
| `jiraUsername` | Create User | Voliteľné používateľské meno v Data Center / Server; ak nie je zadané, použije sa `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Voliteľné zobrazované meno |
| `jiraUserProducts` | Create User | Pole JSON alebo kľúče produktov oddelené čiarkou; iba pre Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Predvolená hodnota je `50`; rozsah 1–100 |
| `jiraStartAt` | Search Issues v Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Počiatočný index stránkovania s posunom |
| `jiraNextPageToken` | Search Issues v Jira Cloud | Token kurzora z predchádzajúcej odpovede vyhľadávania |

## Príklady

Vytvorenie issue zo vstupu z predchádzajúceho uzla:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Aktualizácia issue a vymazanie riešiteľa:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Vyhľadávanie issue s vlastnými poľami a stránkovaním pomocou kurzora:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Vyhľadávanie issue v Data Center so stránkovaním s posunom:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Prechod issue po zobrazení dostupných prechodov:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Následne spustite **Transition Issue** s Transition ID: `$listTransitions.transitions[0].id`

Upozornenie sledujúcich na aktualizáciu issue:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Výstup

Každá úspešná operácia nastaví:

- `$jira.success`
- `$jira.operation`

**Get Myself** sprístupňuje `user`.

**Operácie so stránkovaným zoznamom** sprístupňujú `count`, pole kolekcie a `pagination`:

| Operácia | Kľúč kolekcie | Tvar stránkovania |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** sprístupňuje `transitions` a `count` bez stránkovania.

**Mutácie a čítania úloh (Issue)** sprístupňujú payload úlohy Jira plus `key`, ak je to relevantné.

**Comment** get/create/update sprístupňujú `comment`; delete sprístupňuje `deleted`.

**Transition Issue** sprístupňuje `transition` ako `{ transitionId }` plus aktualizovanú `issue` a `key`.

**Attachment add** sprístupňuje `attachments` a `count`. **Get Attachment** sprístupňuje `attachment`; **List Attachments** sprístupňuje `attachments`, `count` a `pagination`. Keď je povolená možnosť **Include Binary**, každý objekt prílohy môže obsahovať `content_base64`. Delete sprístupňuje `deleted`.

**User** get/create sprístupňujú `user`; delete sprístupňuje `deleted`.

**Notify Issue** sprístupňuje `notified`.

Bežné vzory prístupu:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Súvisiace

- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md)
- [Integrácie tretích strán](../reference/integrations.md#jira)
- [Typy uzlov](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
