# Jira node

**Jira** node ühendab workflow'd Jira REST API-ga, võimaldades projektide, issue'de, kommentaaride, manuste, kasutajate, teavituste ja üleminekute automatiseerimist. Vaikeoperatsioon on **Search Issues**.

## Ülevaade

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Credential | Jira (Cloud email/API token, Data Center username/password või personal access token, base URL, deployment mode, valikuline REST API version) |
| Output | `$nodeLabel.*` |

## Credential

Looge **Jira** credential [Credentials Tab](../tabs/credentials-tab.md) vahekaardil. Salvestatud config võtmed on `email`, `api_token`, `base_url`, `deployment`, `auth_mode` ja valikuline `api_version`. Jira Cloudi puhul salvestab `email` Atlassianu konto e-posti ja `api_token` Atlassianu API tokeni. Jira Data Center / Serveri puhul salvestavad samad võtmed Basic auth kasutajanime ja parooli või režiimis `auth_mode: pat` salvestab `api_token` personal access tokeni, mis saadetakse Bearer tokenina, ning välja `email` ei kasutata. Seadistamise sammud leiate jaotisest [Third-Party Integrations](../reference/integrations.md#jira).

| Field | Config key | Description |
| --- | --- | --- |
| Jira Email / Username | `email` | Jira Cloudi Atlassianu konto e-post või Jira Data Center / Serveri kasutajanimi |
| Authentication | `auth_mode` | `basic` (vaikimisi) või `pat` (ainult Data Center / Server) |
| API Token / Password / Personal Access Token | `api_token` | Jira Cloudi Atlassianu API token, Jira Data Center / Serveri parool Basic auth jaoks või Data Centeri personal access token režiimis `pat` |
| Base URL | `base_url` | Jira saidi URL, näiteks `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` Jira Cloudi jaoks või `data_center` Jira Data Center / Serveri jaoks |
| REST API Version | `api_version` | Vaikeväärtus on `3` Jira Cloudi jaoks. Data Center / Server kasutab REST API v2-te |

Personal access tokenid nõuavad Jira Data Center / Serveri versiooni 8.14 või uuemat. Autentimismeetodi vahetamine kustutab salvestatud saladuse, seega sisestage vahetamisel uus parool või token.

Kasutage **Test Connection**, et credentiali praeguse Jira kasutaja vastu kontrollida.

## Operatsioonid

| Operation | Required fields | Output |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Valikuline Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | Valikuline JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key või ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key või ID ja vähemalt üks muudetud väli | `issue`, `key` |
| Delete Issue | Issue Key või ID | `deleted` |
| Get Issue Changelog | Issue Key või ID; valikuline Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key või ID, Subject, Text Body | `notified` |
| List Comments | Issue Key või ID; valikuline Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key või ID, Comment Body | `comment` |
| Get Comment | Issue Key või ID, Comment ID | `comment` |
| Update Comment | Issue Key või ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key või ID, Comment ID | `deleted` |
| Add Attachment | Issue Key või ID, Filename, Base64 content | `attachments`, `count` |
| Get Attachment | Attachment ID; valikuline Include Binary | `attachment` |
| List Attachments | Issue Key või ID; valikuline Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key või ID | `transitions`, `count` |
| Transition Issue | Issue Key või ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

Avaldisi toetavad tekstiväljad toetavad [avaldisi](../reference/expression-dsl.md), näiteks `$input.text`. `jiraIncludeBinary` on boolean lüliti ega toeta avaldisi, kuid seda saab märkida agent-provided, kui Jira node on ühendatud Agenti tööriista handle'iga.

## Issue ja uuendamise väljad

- **Project Key** on lühike projekti võti, näiteks `ENG`. Kasutage List Projects, et võtmeid avastada.
- **Issue Key or ID** aktsepteerib võtmeid nagu `ENG-123` või numbrilisi issue ID-sid. Kasutage Search Issues või List Projects, et väärtusi avastada.
- **Transition ID** pärineb List Transitions operatsioonist. Iga transition objekt sisaldab `id` välja.
- **Comment ID** ja **Attachment ID** pärinevad List Comments, List Attachments või varasematest create/get vastustest.
- **Account ID / Username** on Jira Cloudi `accountId` väärtus või Jira Data Center / Serveri kasutajanimi. Get Myself või Get User aitavad seda avastada.
- Issue **description** ja kommentaari **body** tekst saadetakse Atlassian Document Format kujul REST
  API v3 puhul; kui credentiali deployment on Data Center / Server, saadetakse need lihttekstina.
  Versioonis v3 muutuvad reavahetuse märgid eraldi lõikudeks.
- **Get Issue Changelog** kasutab Jira Cloudi leheküljestatud changelog endpointi. Data Center / Serveri puhul loeb see laiendatud issue changelog andmeid ja rakendab tagastatud ajalugudele konfigureeritud offset/limit väärtust.
- **Update Issue** puhul jätke valikulised väljad tühjaks, et säilitada nende praegused väärtused.
- Määrake **Description** või **Assignee Account ID / Username** uuendamisel väärtuseks `null`, et need väljad tühjendada. Silte ei saa `null` abil tühjendada.
- **Recipients JSON** Notify Issue puhul on vaikimisi `{"assignee":true}`, kui see on välja jäetud. Levinud võtmed on `assignee`, `reporter`, `watchers` ja `voters` (näiteks `{"assignee":true,"watchers":true}`).
- **Add Attachment** aktsepteerib töötlemata base64 või data URL sisu ning on piiratud platvormi faili suuruse seadistusega (vaikimisi 99 MB).
## Lehekülgede kaupa liikumine

- **Search Issues** kasutab Jira Cloudi puhul kursori-põhist lehekülgede kaupa liikumist `jiraNextPageToken` kaudu. Lugege eelmise käivituse väljundist `pagination.nextPageToken` ja edastage see järgmisele Search Issues sõlmele.
- **Search Issues** kasutab Jira Data Center / Serveri puhul nihkepõhist lehekülgede kaupa liikumist `jiraStartAt` kaudu. Järgmise lehe arvutamiseks lugege `pagination.startAt`, `pagination.maxResults` ja `pagination.total`.
- **List Projects**, **Get Issue Changelog**, **List Comments** ja **List Attachments** kasutavad nihkepõhist lehekülgede kaupa liikumist parameetritega `jiraLimit` ja `jiraStartAt`. Lehekülgede kaupa tagastatud tulemused sisaldavad välju `pagination.startAt`, `pagination.maxResults`, `pagination.total` ja `pagination.isLast`.
- **List Attachments** toob esmalt kätte kõik manused, seejärel lõikab tulemuse kliendipoolselt. Lehekülgede kaupa liikumise väljad kirjeldavad endiselt tagastatud lehte, kuid suurte teemade puhul võib kaasneda täiendav päringukulu.
- **List Transitions** ei kasuta lehekülgede kaupa liikumist.

## Põhiväljad

| Väli | Kasutaja | Märkused |
| --- | --- | --- |
| `credentialId` | Kõik toimingud | Omanduses olev Jira mandaadi UUID |
| `jiraOperation` | Kõik toimingud | Vaikeväärtus on `searchIssues` |
| `jiraProjectKey` | Create Issue | Projekti võti, näiteks `ENG` |
| `jiraIssueKey` | Teema, kommentaari, manuse, teavituse ja ülemineku toimingud | Teema võti, näiteks `ENG-123`, või numbriline teema ID |
| `jiraIssueType` | Create Issue | Vaikeväärtus on `Task` |
| `jiraIssueTypeId` | Create Issue | Valikuline teema tüübi ID; kui määratud, alistab `jiraIssueType` |
| `jiraSummary` | Create/Update Issue | Create Issue puhul kohustuslik |
| `jiraDescription` | Create/Update Issue | Saadetakse ADF-ina REST API v3 puhul või lihttekstina REST API v2 puhul; kirjelduse tühjendamiseks kasutage uuendamisel väärtust `null` |
| `jiraJql` | Search Issues | Vaikeväärtus on `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Valikuline JSON-massiiv või komadega eraldatud teema väljad; tühja väärtuse korral on vaikeväärtusteks `key`, `summary`, `status`, `assignee` ja `issuetype` |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloudi accountId või Data Center / Serveri kasutajanimi; vastutaja tühjendamiseks kasutage uuendamisel väärtust `null` |
| `jiraLabels` | Create/Update Issue | JSON-massiiv või komadega eraldatud tekst |
| `jiraCommentBody` | Create/Update Comment | Saadetakse ADF-ina REST API v3 puhul või lihttekstina REST API v2 puhul |
| `jiraCommentId` | Get/Update/Delete Comment | Jira kommentaari ID |
| `jiraTransitionId` | Transition Issue | Tuvastage funktsiooniga List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | Jira manuse ID |
| `jiraAttachmentFilename` | Add Attachment | Üleslaaditud failinimi |
| `jiraAttachmentBase64` | Add Attachment | Toores base64- või data URL-i sisu; kehtib faili suuruse piirang |
| `jiraAttachmentMimeType` | Add Attachment | Valikuline MIME-tüüp; tühja väärtuse korral tuletatakse failinimest |
| `jiraIncludeBinary` | Get/List Attachment | Boole'i lüliti; lubamisel lisab `content_base64` |
| `jiraNotifySubject` | Notify Issue | Kohustuslik teavituse teema |
| `jiraNotifyTextBody` | Notify Issue | Kohustuslik lihttekstiline teavituse sisu |
| `jiraNotifyHtmlBody` | Notify Issue | Valikuline HTML-sisu |
| `jiraNotifyTo` | Notify Issue | Adressaatide JSON; vaikeväärtus on `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloudi accountId või Data Center / Serveri kasutajanimi |
| `jiraUserEmail` | Create User | Uue kasutaja e-posti aadress |
| `jiraUsername` | Create User | Valikuline Data Center / Serveri kasutajanimi; puudumisel kasutatakse `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Valikuline kuvatav nimi |
| `jiraUserProducts` | Create User | JSON-massiiv või komadega eraldatud tootevõtmed; ainult Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Vaikeväärtus on `50`; vahemik 1–100 |
| `jiraStartAt` | Search Issues Data Center / Serveris, List Projects, Get Issue Changelog, List Comments, List Attachments | Nihkepõhise lehekülgede kaupa liikumise algindeks |
| `jiraNextPageToken` | Search Issues Jira Cloudis | Eelmise otsinguvastuse kursori token |

## Näited

Looge teema ülesvoolu sisendist:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Uuendage teemat ja tühjendage vastutaja:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Otsige teemasid kohandatud väljade ja kursori-põhise lehekülgede kaupa liikumisega:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Otsige teemasid Data Centeris nihkepõhise lehekülgede kaupa liikumisega:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Viige teema üle pärast saadaolevate üleminekute loetlemist:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Seejärel käivitage **Transition Issue** ülemineku ID-ga: `$listTransitions.transitions[0].id`

Teavitage jälgijaid teema uuendamisest:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Väljund

Iga edukas toiming määrab:

- `$jira.success`
- `$jira.operation`

**Get Myself** avalikustab `user`.

**Paginated list operations** avalikustavad `count`, kogumisvälja ja `pagination`:

| Toiming | Kogumi võti | Pagination kuju |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** avalikustab `transitions` ja `count` ilma pagination'ita.

**Issue mutations and reads** avalikustavad Jira issue payload'i ning vajaduse korral `key`.

**Comment** get/create/update avalikustavad `comment`; delete avalikustab `deleted`.

**Transition Issue** avalikustab `transition` kujul `{ transitionId }`, lisaks värskendatud `issue` ja `key`.

**Attachment add** avalikustab `attachments` ja `count`. **Get Attachment** avalikustab `attachment`; **List Attachments** avalikustab `attachments`, `count` ja `pagination`. Kui **Include Binary** on lubatud, võib iga attachment'i objekt sisaldada `content_base64`. Delete avalikustab `deleted`.

**User** get/create avalikustavad `user`; delete avalikustab `deleted`.

**Notify Issue** avalikustab `notified`.

Levinud juurdepääsumustrid:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Seotud

- [Credentials Tab](../tabs/credentials-tab.md)
- [Third-Party Integrations](../reference/integrations.md#jira)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
