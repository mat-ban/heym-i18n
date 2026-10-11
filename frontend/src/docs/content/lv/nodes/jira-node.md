# Jira mezgls

**Jira** mezgls savieno workflow ar Jira REST API, lai automatizētu projektu, issue, komentāru, pielikumu, lietotāju, paziņojumu un pāreju darbības. Noklusējuma operācija ir **Search Issues**.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Akreditācijas dati | Jira (Cloud email/API token vai Data Center username/password, base URL, deployment mode, neobligāts REST API version) |
| Izvade | `$nodeLabel.*` |

## Akreditācijas dati

Izveidojiet **Jira** akreditācijas datus sadaļā [Credentials Tab](../tabs/credentials-tab.md). Saglabātās konfigurācijas atslēgas ir `email`, `api_token`, `base_url`, `deployment` un neobligāts `api_version`. Jira Cloud gadījumā `email` saglabā Atlassian konta e-pastu, bet `api_token` saglabā Atlassian API token. Jira Data Center / Server gadījumā šīs pašas atslēgas saglabā Basic auth lietotājvārdu un paroli. Iestatīšanas soļus skatiet sadaļā [Third-Party Integrations](../reference/integrations.md#jira).

| Lauks | Konfigurācijas atslēga | Apraksts |
| --- | --- | --- |
| Jira Email / Username | `email` | Jira Cloud Atlassian konta e-pasts vai Jira Data Center / Server lietotājvārds |
| API Token / Password | `api_token` | Jira Cloud Atlassian API token vai Jira Data Center / Server parole Basic auth |
| Base URL | `base_url` | Jira vietnes URL, piemēram, `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` Jira Cloud vai `data_center` Jira Data Center / Server |
| REST API Version | `api_version` | Noklusējums ir `3` Jira Cloud. Data Center / Server izmanto REST API v2 |

Data Center / Server personīgās piekļuves tokens un Bearer auth Jira akreditācijas dati vēl neatbalsta.

Izmantojiet **Test Connection**, lai pārbaudītu akreditācijas datus pret pašreizējo Jira lietotāju.

## Operācijas

| Operācija | Obligātie lauki | Izvade |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Neobligāts Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | Neobligāts JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key vai ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key vai ID un vismaz viens mainīts lauks | `issue`, `key` |
| Delete Issue | Issue Key vai ID | `deleted` |
| Get Issue Changelog | Issue Key vai ID; neobligāts Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key vai ID, Subject, Text Body | `notified` |
| List Comments | Issue Key vai ID; neobligāts Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key vai ID, Comment Body | `comment` |
| Get Comment | Issue Key vai ID, Comment ID | `comment` |
| Update Comment | Issue Key vai ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key vai ID, Comment ID | `deleted` |
| Add Attachment | Issue Key vai ID, Filename, Base64 content | `attachments`, `count` |
| Get Attachment | Attachment ID; neobligāts Include Binary | `attachment` |
| List Attachments | Issue Key vai ID; neobligāts Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key vai ID | `transitions`, `count` |
| Transition Issue | Issue Key vai ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

Teksta lauki, kas atbalsta izteiksmes, pieņem [izteiksmes](../reference/expression-dsl.md), piemēram, `$input.text`. `jiraIncludeBinary` ir boolean pārslēgs un neatbalsta izteiksmes, bet to var atzīmēt kā agent-provided, kad Jira mezgls ir pievienots Agent tool handle.

## Issue un atjaunināšanas lauki

- **Project Key** ir īsā projekta atslēga, piemēram, `ENG`. Izmantojiet List Projects, lai uzzinātu atslēgas.
- **Issue Key vai ID** pieņem atslēgas, piemēram, `ENG-123`, vai ciparu issue ID. Izmantojiet Search Issues vai List Projects, lai uzzinātu vērtības.
- **Transition ID** nāk no List Transitions. Katrs transition objekts satur `id` lauku.
- **Comment ID** un **Attachment ID** nāk no List Comments, List Attachments vai iepriekšējām create/get atbildēm.
- **Account ID / Username** ir Jira Cloud `accountId` vērtība vai Jira Data Center / Server lietotājvārds. Get Myself vai Get User var palīdzēt to uzzināt.
- Issue **description** un komentāra **body** teksts REST API v3 tiek nosūtīts kā Atlassian Document Format; ja akreditācijas datu deployment ir Data Center / Server, tie tiek nosūtīti kā vienkāršs teksts. v3 versijā jaunas rindas rakstzīmes kļūst par atsevišķām rindkopām.
- **Get Issue Changelog** izmanto Jira Cloud lapotās changelog endpoint. Data Center / Server gadījumā tas nolasa paplašinātos issue changelog datus un piemēro konfigurēto offset/limit atgrieztajām vēsturēm.
- Operācijā **Update Issue** atstājiet neobligātos laukus tukšus, lai saglabātu to pašreizējās vērtības.
- Iestatiet **Description** vai **Assignee Account ID / Username** uz `null` atjaunināšanas laikā, lai notīrītu šos laukus. Labels nevar notīrīt ar `null`.
- **Recipients JSON** operācijā Notify Issue pēc noklusējuma ir `{"assignee":true}`, ja tas nav norādīts. Biežāk izmantotās atslēgas ir `assignee`, `reporter`, `watchers` un `voters` (piemēram, `{"assignee":true,"watchers":true}`).
- **Add Attachment** pieņem neapstrādātu base64 vai data URL saturu, un to ierobežo platformas faila izmēra iestatījums (noklusējums 99 MB).
## Lapošana

- **Search Issues** izmanto kursora lapošanu, izmantojot `jiraNextPageToken` Jira Cloud vidē. Nolasiet `pagination.nextPageToken` no iepriekšējās izpildes un nododiet to nākamajā Search Issues mezglā.
- **Search Issues** izmanto nobīdes lapošanu, izmantojot `jiraStartAt` Jira Data Center / Server vidē. Nolasiet `pagination.startAt`, `pagination.maxResults` un `pagination.total`, lai aprēķinātu nākamo lapu.
- **List Projects**, **Get Issue Changelog**, **List Comments** un **List Attachments** izmanto nobīdes lapošanu ar `jiraLimit` un `jiraStartAt`. Lapotie rezultāti atgriež `pagination.startAt`, `pagination.maxResults`, `pagination.total` un `pagination.isLast`.
- **List Attachments** vispirms iegūst visus pielikumus no uzdevuma un pēc tam sagriež rezultātu klienta pusē. Lapošanas lauki joprojām apraksta atgriezto lapu, taču lieliem uzdevumiem var rasties papildu iegūšanas izmaksas.
- **List Transitions** nelapo.

## Galvenie lauki

| Lauks | Izmanto | Piezīmes |
| --- | --- | --- |
| `credentialId` | Visas operācijas | Piederīgo Jira akreditācijas datu UUID |
| `jiraOperation` | Visas operācijas | Pēc noklusējuma `searchIssues` |
| `jiraProjectKey` | Create Issue | Projekta atslēga, piemēram, `ENG` |
| `jiraIssueKey` | Uzdevuma, komentāru, pielikumu, paziņojumu un pāreju operācijas | Uzdevuma atslēga, piemēram, `ENG-123`, vai ciparu uzdevuma ID |
| `jiraIssueType` | Create Issue | Pēc noklusējuma `Task` |
| `jiraIssueTypeId` | Create Issue | Neobligāts uzdevuma tipa ID; ja iestatīts, aizstāj `jiraIssueType` |
| `jiraSummary` | Create/Update Issue | Obligāts Create Issue operācijai |
| `jiraDescription` | Create/Update Issue | REST API v3 tiek nosūtīts kā ADF vai REST API v2 kā vienkāršs teksts; atjaunināšanas laikā izmantojiet `null`, lai notīrītu aprakstu |
| `jiraJql` | Search Issues | Pēc noklusējuma `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Neobligāts JSON masīvs vai ar komatu atdalīti uzdevuma lauki; ja tukšs, pēc noklusējuma tiek izmantoti `key`, `summary`, `status`, `assignee` un `issuetype` |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud accountId vai Data Center / Server lietotājvārds; atjaunināšanas laikā izmantojiet `null`, lai notīrītu atbildīgo |
| `jiraLabels` | Create/Update Issue | JSON masīvs vai ar komatu atdalīts teksts |
| `jiraCommentBody` | Create/Update Comment | REST API v3 tiek nosūtīts kā ADF vai REST API v2 kā vienkāršs teksts |
| `jiraCommentId` | Get/Update/Delete Comment | Jira komentāra ID |
| `jiraTransitionId` | Transition Issue | Noskaidrojiet ar List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | Jira pielikuma ID |
| `jiraAttachmentFilename` | Add Attachment | Augšupielādētā faila nosaukums |
| `jiraAttachmentBase64` | Add Attachment | Neapstrādāts base64 vai data URL saturs; attiecas faila izmēra ierobežojums |
| `jiraAttachmentMimeType` | Add Attachment | Neobligāts MIME tips; ja tukšs, tiek secināts no faila nosaukuma |
| `jiraIncludeBinary` | Get/List Attachment | Būla pārslēgs; ja iespējots, pievieno `content_base64` |
| `jiraNotifySubject` | Notify Issue | Obligāts paziņojuma temats |
| `jiraNotifyTextBody` | Notify Issue | Obligāts vienkārša teksta paziņojuma saturs |
| `jiraNotifyHtmlBody` | Notify Issue | Neobligāts HTML saturs |
| `jiraNotifyTo` | Notify Issue | Saņēmēju JSON; pēc noklusējuma `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud accountId vai Data Center / Server lietotājvārds |
| `jiraUserEmail` | Create User | Jaunā lietotāja e-pasta adrese |
| `jiraUsername` | Create User | Neobligāts Data Center / Server lietotājvārds; ja nav norādīts, tiek izmantots `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Neobligāts parādāmais vārds |
| `jiraUserProducts` | Create User | JSON masīvs vai ar komatu atdalītas produkta atslēgas; tikai Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Pēc noklusējuma `50`; diapazons 1–100 |
| `jiraStartAt` | Search Issues on Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Nobīdes lapošanas sākuma indekss |
| `jiraNextPageToken` | Search Issues on Jira Cloud | Kursora token no iepriekšējās meklēšanas atbildes |

## Piemēri

Izveidot uzdevumu no iepriekšējās plūsmas ievades:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Atjaunināt uzdevumu un notīrīt atbildīgo:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Meklēt uzdevumus ar pielāgotiem laukiem un kursora lapošanu:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Meklēt uzdevumus Data Center vidē ar nobīdes lapošanu:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Mainīt uzdevuma statusu pēc pieejamo pāreju uzskaitīšanas:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Pēc tam palaidiet **Transition Issue** ar Transition ID: `$listTransitions.transitions[0].id`

Paziņot novērotājiem par uzdevuma atjauninājumu:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Izvade

Katra veiksmīga darbība iestata:

- `$jira.success`
- `$jira.operation`

**Get Myself** atklāj `user`.

**Paginated list operations** atklāj `count`, kolekcijas lauku un `pagination`:

| Darbība | Kolekcijas atslēga | Pagination forma |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** atklāj `transitions` un `count` bez pagination.

**Issue mutations and reads** atklāj Jira issue payload, kā arī `key`, ja piemērojams.

**Comment** get/create/update atklāj `comment`; delete atklāj `deleted`.

**Transition Issue** atklāj `transition` kā `{ transitionId }`, kā arī atjaunināto `issue` un `key`.

**Attachment add** atklāj `attachments` un `count`. **Get Attachment** atklāj `attachment`; **List Attachments** atklāj `attachments`, `count` un `pagination`. Kad **Include Binary** ir iespējots, katrs attachment objekts var ietvert `content_base64`. Delete atklāj `deleted`.

**User** get/create atklāj `user`; delete atklāj `deleted`.

**Notify Issue** atklāj `notified`.

Biežāk izmantotie piekļuves modeļi:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Saistītais

- [Credentials Tab](../tabs/credentials-tab.md)
- [Third-Party Integrations](../reference/integrations.md#jira)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
