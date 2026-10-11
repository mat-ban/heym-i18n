# Jira-node

**Jira**-noden forbinder workflows med Jira REST API'en til automatisering af projekter, sager, kommentarer, vedhæftninger, brugere, notifikationer og overgange. Standardoperationen er **Search Issues**.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Legitimationsoplysninger | Jira (Cloud email/API-token eller Data Center brugernavn/adgangskode, basis-URL, deployment-tilstand, valgfri REST API-version) |
| Output | `$nodeLabel.*` |

## Legitimationsoplysninger

Opret **Jira**-legitimationsoplysninger under [Legitimationsoplysninger-fanen](../tabs/credentials-tab.md). Gemte konfigurationsnøgler er `email`, `api_token`, `base_url`, `deployment` og valgfri `api_version`. For Jira Cloud gemmes Atlassian-kontoens email i `email` og Atlassian API-token i `api_token`. For Jira Data Center/Server gemmes Basic auth-brugernavn og -adgangskode i de samme nøgler. Se [Tredjepartsintegrationer](../reference/integrations.md#jira) for opsætningsinstruktioner.

| Felt | Konfigurationsnøgle | Beskrivelse |
| --- | --- | --- |
| Jira Email / Brugernavn | `email` | Atlassian-kontoens email for Jira Cloud, eller brugernavn for Jira Data Center/Server |
| API-token / Adgangskode | `api_token` | Atlassian API-token for Jira Cloud, eller adgangskode til Basic auth for Jira Data Center/Server |
| Basis-URL | `base_url` | Jira-site-URL, f.eks. `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` for Jira Cloud eller `data_center` for Jira Data Center/Server |
| REST API-version | `api_version` | Standard er `3` for Jira Cloud. Data Center/Server bruger REST API v2 |

Data Center/Server-personlige adgangstokens og Bearer auth understøttes ikke af Jira-legitimationsoplysningerne endnu.

Brug **Test Forbindelse** for at verificere legitimationsoplysningerne mod den aktuelle Jira-bruger.

## Operationer

| Operation | Påkrævede felter | Output |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Valgfri Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | Valgfri JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key eller ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key eller ID og mindst ét ændret felt | `issue`, `key` |
| Delete Issue | Issue Key eller ID | `deleted` |
| Get Issue Changelog | Issue Key eller ID; valgfri Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key eller ID, Subject, Text Body | `notified` |
| List Comments | Issue Key eller ID; valgfri Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key eller ID, Comment Body | `comment` |
| Get Comment | Issue Key eller ID, Comment ID | `comment` |
| Update Comment | Issue Key eller ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key eller ID, Comment ID | `deleted` |
| Add Attachment | Issue Key eller ID, Filename, Base64-indhold | `attachments`, `count` |
| Get Attachment | Attachment ID; valgfri Include Binary | `attachment` |
| List Attachments | Issue Key eller ID; valgfri Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key eller ID | `transitions`, `count` |
| Transition Issue | Issue Key eller ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Brugernavn | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Brugernavn | `deleted` |

Udtrykskompatible tekstfelter understøtter [udtryk](../reference/expression-dsl.md) som f.eks. `$input.text`. `jiraIncludeBinary` er en boolean-toggle og understøtter ikke udtryk, men kan markeres som agent-leveret, når Jira-noden er tilknyttet et Agent-værktøjshåndtag.

## Issue- og opdateringsfelter

- **Project Key** er den korte projektnøgle som f.eks. `ENG`. Brug List Projects for at finde nøgler.
- **Issue Key eller ID** accepterer nøgler som `ENG-123` eller numeriske issue-ID'er. Brug Search Issues eller List Projects for at finde værdier.
- **Transition ID** kommer fra List Transitions. Hver transition-objekt indeholder et `id`-felt.
- **Comment ID** og **Attachment ID** kommer fra List Comments, List Attachments eller tidligere create/get-svar.
- **Account ID / Brugernavn** er Jira Cloud's `accountId`-værdi eller Jira Data Center/Server-brugernavn. Get Myself eller Get User kan hjælpe med at finde det.
- Issue-**description** og comment-**body**-tekst sendes som Atlassian Document Format på REST API v3; når deployment er Data Center/Server, sendes de som almindelig tekst. I v3 bliver linjeskift separate afsnit.
- **Get Issue Changelog** bruger Jira Cloud's paginerede changelog-endpoint. For Data Center/Server læses den udvidede issue changelog-data, og den konfigurerede offset/limit anvendes på de returnerede historikker.
- Ved **Update Issue** skal valgfrie felter lades tomme for at bevare deres nuværende værdier.
- Sæt **Description** eller **Assignee Account ID / Brugernavn** til `null` ved opdatering for at rydde disse felter. Labels kan ikke ryddes med `null`.
- **Recipients JSON** på Notify Issue standarder til `{"assignee":true}` når udeladt. Almindelige nøgler inkluderer `assignee`, `reporter`, `watchers` og `voters` (f.eks. `{"assignee":true,"watchers":true}`).
- **Add Attachment** accepterer rå base64 eller data URL-indhold og er begrænset af platformens filstørrelsesindstilling (standard 99 MB).
## Pagination

- **Search Issues** anvender cursor-pagination via `jiraNextPageToken` for Jira Cloud. Læs `pagination.nextPageToken` fra den foregående kørsel og send det videre til den næste Search Issues-node.
- **Search Issues** anvender offset-pagination via `jiraStartAt` for Jira Data Center / Server. Læs `pagination.startAt`, `pagination.maxResults` og `pagination.total` for at beregne den næste side.
- **List Projects**, **Get Issue Changelog**, **List Comments** og **List Attachments** anvender offset-pagination med `jiraLimit` og `jiraStartAt`. Paginerede resultater returnerer `pagination.startAt`, `pagination.maxResults`, `pagination.total` og `pagination.isLast`.
- **List Attachments** henter først alle vedhæftninger fra issuet og skærer derefter resultatet på klientsiden. Paginationsfelter beskriver stadig den returnerede side, men store issues kan medføre en ekstra hentningsomkostning.
- **List Transitions** paginerer ikke.

## Nøglefelter

| Felt | Anvendt af | Noter |
| --- | --- | --- |
| `credentialId` | Alle operationer | UUID for legitimationsoplysninger til Jira |
| `jiraOperation` | Alle operationer | Standardværdi er `searchIssues` |
| `jiraProjectKey` | Create Issue | Projektnøgle som f.eks. `ENG` |
| `jiraIssueKey` | Issue, comment, attachment, notification og transition-operationer | Issuenøgle som f.eks. `ENG-123` eller numerisk issue-ID |
| `jiraIssueType` | Create Issue | Standardværdi er `Task` |
| `jiraIssueTypeId` | Create Issue | Valgfrit issue-type-ID; tilsidesætter `jiraIssueType` når det er angivet |
| `jiraSummary` | Create/Update Issue | Påkrævet for Create Issue |
| `jiraDescription` | Create/Update Issue | Sendes som ADF på REST API v3 eller almindelig tekst på REST API v2; brug `null` ved opdatering for at fjerne beskrivelsen |
| `jiraJql` | Search Issues | Standardværdi er `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Valgfrit JSON-array eller kommaseparerede issue-felter; standardværdi er `key`, `summary`, `status`, `assignee` og `issuetype` når tom |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud accountId eller Data Center / Server-brugernavn; brug `null` ved opdatering for at fjerne assignee |
| `jiraLabels` | Create/Update Issue | JSON-array eller kommasepareret tekst |
| `jiraCommentBody` | Create/Update Comment | Sendes som ADF på REST API v3 eller almindelig tekst på REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | Jira-kommentar-ID |
| `jiraTransitionId` | Transition Issue | Findes med List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | Jira-vedhæftnings-ID |
| `jiraAttachmentFilename` | Add Attachment | Uploadet filnavn |
| `jiraAttachmentBase64` | Add Attachment | Rå base64 eller data URL-indhold; underlagt filstørrelsesbegrænsning |
| `jiraAttachmentMimeType` | Add Attachment | Valgfrit MIME-type; udledes fra filnavn når tom |
| `jiraIncludeBinary` | Get/List Attachment | Boolean-toggle; tilføjer `content_base64` når aktiveret |
| `jiraNotifySubject` | Notify Issue | Påkrævet emne for notifikation |
| `jiraNotifyTextBody` | Notify Issue | Påkrævet almindelig tekst til notifikation |
| `jiraNotifyHtmlBody` | Notify Issue | Valgfrit HTML-indhold |
| `jiraNotifyTo` | Notify Issue | Modtageres JSON; standardværdi er `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud accountId eller Data Center / Server-brugernavn |
| `jiraUserEmail` | Create User | Ny brugeres e-mailadresse |
| `jiraUsername` | Create User | Valgfrit Data Center / Server-brugernavn; falder tilbage til `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Valgfrit visningsnavn |
| `jiraUserProducts` | Create User | JSON-array eller kommaseparerede produktnøgler; kun for Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Standardværdi er `50`; interval 1–100 |
| `jiraStartAt` | Search Issues på Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Offset-pagination startindeks |
| `jiraNextPageToken` | Search Issues på Jira Cloud | Cursor-token fra tidligere søgeresultat |

## Eksempler

Opret et issue fra input:

- Operation: `createIssue`
- Projektnøgle: `ENG`
- Issue-type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Opdater et issue og fjern assignee:

- Operation: `updateIssue`
- Issue-nøgle eller ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Brugernavn: `null`

Søg issues med brugerdefinerede felter og cursor-pagination:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue-felter: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Søg issues på Data Center med offset-pagination:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Transitioner et issue efter at have listet tilgængelige transitioner:

- Operation: `listTransitions`
- Issue-nøgle eller ID: `ENG-123`
- Kør derefter **Transition Issue** med Transition ID: `$listTransitions.transitions[0].id`

Notificer watchers om en issue-opdatering:

- Operation: `notifyIssue`
- Issue-nøgle eller ID: `ENG-123`
- Emne: `Issue opdateret`
- Tekstindhold: `$input.text`
- Modtageres JSON: `{"assignee":true,"watchers":true}`
## Output

Ved hver succesfuld operation sættes:

- `$jira.success`
- `$jira.operation`

**Get Myself** eksponerer `user`.

**Paginated list operations** eksponerer `count`, et samlingsfelt og `pagination`:

| Operation | Collection key | Pagination shape |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** eksponerer `transitions` og `count` uden paginering.

**Issue mutations and reads** eksponerer Jira-issue-payload'en plus `key`, hvor relevant.

**Comment** get/create/update eksponerer `comment`; delete eksponerer `deleted`.

**Transition Issue** eksponerer `transition` som `{ transitionId }`, plus det opdaterede `issue` og `key`.

**Attachment add** eksponerer `attachments` og `count`. **Get Attachment** eksponerer `attachment`; **List Attachments** eksponerer `attachments`, `count` og `pagination`. Når **Include Binary** er aktiveret, kan hvert attachment-objekt indeholde `content_base64`. Delete eksponerer `deleted`.

**User** get/create eksponerer `user`; delete eksponerer `deleted`.

**Notify Issue** eksponerer `notified`.

Almindelige adgangsmønstre:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Relateret

- [Credentials Tab](../tabs/credentials-tab.md)
- [Third-Party Integrations](../reference/integrations.md#jira)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
