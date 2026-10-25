# Jira-nod

**Jira**-noden ansluter workflows till Jira REST API för automatisering av projekt, ärenden, kommentarer, bilagor, användare, aviseringar och övergångar. Standardåtgärden är **Search Issues**.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Autentiseringsuppgift | Jira (Cloud e-post/API-token, Data Center användarnamn/lösenord eller personlig åtkomsttoken, bas-URL, distributionsläge, valfri REST API-version) |
| Utdata | `$nodeLabel.*` |

## Autentiseringsuppgift

Skapa en **Jira**-autentiseringsuppgift i [fliken Autentiseringsuppgifter](../tabs/credentials-tab.md). Lagrade konfigurationsnycklar är `email`, `api_token`, `base_url`, `deployment`, `auth_mode` och valfri `api_version`. För Jira Cloud lagrar `email` Atlassian-kontots e-postadress och `api_token` lagrar Atlassian API-token. För Jira Data Center / Server lagrar samma nycklar Basic auth-användarnamnet och lösenordet, eller med `auth_mode: pat` lagrar `api_token` en personlig åtkomsttoken som skickas som Bearer-token och `email` används inte. Se [Tredjepartsintegrationer](../reference/integrations.md#jira) för konfigurationssteg.

| Fält | Konfigurationsnyckel | Beskrivning |
| --- | --- | --- |
| Jira e-post / användarnamn | `email` | Jira Cloud Atlassian-kontots e-postadress, eller Jira Data Center / Server användarnamn |
| Autentisering | `auth_mode` | `basic` (standard) eller `pat` (endast Data Center / Server) |
| API-token / lösenord / personlig åtkomsttoken | `api_token` | Jira Cloud Atlassian API-token, Jira Data Center / Server lösenord för Basic auth eller en personlig åtkomsttoken för Data Center i `pat`-läge |
| Bas-URL | `base_url` | Jira-webbplatsens URL, till exempel `https://your-domain.atlassian.net` |
| Distribution | `deployment` | `cloud` för Jira Cloud eller `data_center` för Jira Data Center / Server |
| REST API-version | `api_version` | Standardvärdet är `3` för Jira Cloud. Data Center / Server använder REST API v2 |

Personliga åtkomsttoken kräver Jira Data Center / Server 8.14 eller senare. Att byta autentiseringsmetod rensar den sparade hemligheten, så ange det nya lösenordet eller token när du byter.

Använd **Test Connection** för att verifiera autentiseringsuppgiften mot den aktuella Jira-användaren.

## Åtgärder

| Åtgärd | Obligatoriska fält | Utdata |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Valfri Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | Valfri JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key eller ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key eller ID och minst ett ändrat fält | `issue`, `key` |
| Delete Issue | Issue Key eller ID | `deleted` |
| Get Issue Changelog | Issue Key eller ID; valfri Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key eller ID, Subject, Text Body | `notified` |
| List Comments | Issue Key eller ID; valfri Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key eller ID, Comment Body | `comment` |
| Get Comment | Issue Key eller ID, Comment ID | `comment` |
| Update Comment | Issue Key eller ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key eller ID, Comment ID | `deleted` |
| Add Attachment | Issue Key eller ID, Filename, Base64-innehåll | `attachments`, `count` |
| Get Attachment | Attachment ID; valfri Include Binary | `attachment` |
| List Attachments | Issue Key eller ID; valfri Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key eller ID | `transitions`, `count` |
| Transition Issue | Issue Key eller ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / användarnamn | `user` |
| Create User | Användarens e-post | `user` |
| Delete User | Account ID / användarnamn | `deleted` |

Textfält som stöder uttryck har stöd för [uttryck](../reference/expression-dsl.md) såsom `$input.text`. `jiraIncludeBinary` är en boolesk växel och stöder inte uttryck, men den kan markeras som agent-tillhandahållen när Jira-noden är kopplad till ett Agent-verktygshandtag.

## Ärende- och uppdateringsfält

- **Project Key** är den korta projektnyckeln såsom `ENG`. Använd List Projects för att hitta nycklar.
- **Issue Key eller ID** accepterar nycklar såsom `ENG-123` eller numeriska ärende-ID:n. Använd Search Issues eller List Projects för att hitta värden.
- **Transition ID** kommer från List Transitions. Varje övergångsobjekt innehåller ett `id`-fält.
- **Comment ID** och **Attachment ID** kommer från List Comments, List Attachments eller tidigare create/get-svar.
- **Account ID / användarnamn** är Jira Cloud `accountId`-värdet eller Jira Data Center / Server användarnamnet. Get Myself eller Get User kan hjälpa till att hitta det.
- Ärendets **description** och kommentarens **body**-text skickas som Atlassian Document Format på REST
  API v3; när autentiseringsuppgiftens distribution är Data Center / Server skickas de som klartext.
  I v3 blir radbrytningstecken separata stycken.
- **Get Issue Changelog** använder Jira Clouds paginerade changelog-endpoint. För Data Center / Server läser den expanderad ärendeändringsloggdata och tillämpar den konfigurerade offset/limit på de returnerade historikerna.
- Vid **Update Issue**, lämna valfria fält tomma för att bevara deras aktuella värden.
- Ange **Description** eller **Assignee Account ID / användarnamn** till `null` vid uppdatering för att rensa dessa fält. Etiketter kan inte rensas med `null`.
- **Recipients JSON** för Notify Issue har standardvärdet `{"assignee":true}` när det utelämnas. Vanliga nycklar inkluderar `assignee`, `reporter`, `watchers` och `voters` (till exempel `{"assignee":true,"watchers":true}`).
- **Add Attachment** accepterar rå base64 eller data URL-innehåll och begränsas av plattformens filstorleksinställning (standard 99 MB).
## Paginering

- **Search Issues** använder cursor-paginering via `jiraNextPageToken` för Jira Cloud. Läs `pagination.nextPageToken` från föregående körning och skicka in den i nästa Search Issues-nod.
- **Search Issues** använder offset-paginering via `jiraStartAt` för Jira Data Center / Server. Läs `pagination.startAt`, `pagination.maxResults` och `pagination.total` för att beräkna nästa sida.
- **List Projects**, **Get Issue Changelog**, **List Comments** och **List Attachments** använder offset-paginering med `jiraLimit` och `jiraStartAt`. Sidnumrerade resultat returnerar `pagination.startAt`, `pagination.maxResults`, `pagination.total` och `pagination.isLast`.
- **List Attachments** hämtar först alla bilagor från ärendet och delar sedan upp resultatet på klientsidan. Pagineringsfälten beskriver fortfarande den returnerade sidan, men stora ärenden kan medföra en extra hämtningskostnad.
- **List Transitions** använder inte paginering.

## Nyckelfält

| Fält | Används av | Noteringar |
| --- | --- | --- |
| `credentialId` | Alla operationer | UUID för ägd Jira-autentiseringsuppgift |
| `jiraOperation` | Alla operationer | Standardvärdet är `searchIssues` |
| `jiraProjectKey` | Create Issue | Projektnyckel såsom `ENG` |
| `jiraIssueKey` | Operationer för ärenden, kommentarer, bilagor, aviseringar och övergångar | Ärendenyckel såsom `ENG-123` eller numeriskt ärende-ID |
| `jiraIssueType` | Create Issue | Standardvärdet är `Task` |
| `jiraIssueTypeId` | Create Issue | Valfritt ärendetyps-ID; åsidosätter `jiraIssueType` när det är angivet |
| `jiraSummary` | Create/Update Issue | Krävs för Create Issue |
| `jiraDescription` | Create/Update Issue | Skickas som ADF på REST API v3 eller klartext på REST API v2; använd `null` vid uppdatering för att rensa beskrivningen |
| `jiraJql` | Search Issues | Standardvärdet är `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Valfri JSON-array eller kommaavgränsade ärendefält; standardvärdet är `key`, `summary`, `status`, `assignee` och `issuetype` när det är tomt |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud accountId eller Data Center / Server-användarnamn; använd `null` vid uppdatering för att rensa tilldelad |
| `jiraLabels` | Create/Update Issue | JSON-array eller kommaavgränsad text |
| `jiraCommentBody` | Create/Update Comment | Skickas som ADF på REST API v3 eller klartext på REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | Jira-kommentar-ID |
| `jiraTransitionId` | Transition Issue | Identifieras med List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | Jira-bilaga-ID |
| `jiraAttachmentFilename` | Add Attachment | Filnamn för uppladdad fil |
| `jiraAttachmentBase64` | Add Attachment | Rå base64- eller data-URL-innehåll; omfattas av filstorleksgränsen |
| `jiraAttachmentMimeType` | Add Attachment | Valfri MIME-typ; härleds från filnamnet när det är tomt |
| `jiraIncludeBinary` | Get/List Attachment | Boolesk växel; lägger till `content_base64` när den är aktiverad |
| `jiraNotifySubject` | Notify Issue | Krävs för aviseringsämne |
| `jiraNotifyTextBody` | Notify Issue | Krävs för aviseringsinnehåll i klartext |
| `jiraNotifyHtmlBody` | Notify Issue | Valfritt HTML-innehåll |
| `jiraNotifyTo` | Notify Issue | JSON för mottagare; standardvärdet är `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud accountId eller Data Center / Server-användarnamn |
| `jiraUserEmail` | Create User | E-postadress för ny användare |
| `jiraUsername` | Create User | Valfritt Data Center / Server-användarnamn; faller tillbaka på `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Valfritt visningsnamn |
| `jiraUserProducts` | Create User | JSON-array eller kommaavgränsade produktnycklar; endast Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Standardvärdet är `50`; intervall 1–100 |
| `jiraStartAt` | Search Issues på Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Startindex för offset-paginering |
| `jiraNextPageToken` | Search Issues på Jira Cloud | Cursor-token från ett tidigare sökresultat |

## Exempel

Skapa ett ärende från indata uppströms:

- Operation: `createIssue`
- Projektnyckel: `ENG`
- Ärendetyp: `Task`
- Sammanfattning: `$input.title`
- Beskrivning: `$input.description`
- Etiketter: `["automation"]`

Uppdatera ett ärende och rensa tilldelad:

- Operation: `updateIssue`
- Ärendenyckel eller ID: `ENG-123`
- Sammanfattning: `$input.title`
- Tilldelad accountId / användarnamn: `null`

Sök ärenden med anpassade fält och cursor-paginering:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Ärendefält: `["key","summary","status"]`
- Gräns: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Sök ärenden på Data Center med offset-paginering:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Gräns: `25`
- Start At: `25`

Utför en övergång på ett ärende efter att tillgängliga övergångar har listats:

- Operation: `listTransitions`
- Ärendenyckel eller ID: `ENG-123`
- Kör sedan **Transition Issue** med Transition ID: `$listTransitions.transitions[0].id`

Avisera bevakare om en ärendeuppdatering:

- Operation: `notifyIssue`
- Ärendenyckel eller ID: `ENG-123`
- Ämne: `Issue updated`
- Textinnehåll: `$input.text`
- Mottagare JSON: `{"assignee":true,"watchers":true}`
## Utdata

Varje lyckad åtgärd anger:

- `$jira.success`
- `$jira.operation`

**Get Myself** exponerar `user`.

**Sidnumrerade liståtgärder** exponerar `count`, ett samlingsfält och `pagination`:

| Åtgärd | Samlingsnyckel | Sidnumreringsformat |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** exponerar `transitions` och `count` utan sidnumrering.

**Issue-mutationer och -läsningar** exponerar Jira-issue-payloaden samt `key` där det är tillämpligt.

**Comment** get/create/update exponerar `comment`; delete exponerar `deleted`.

**Transition Issue** exponerar `transition` som `{ transitionId }`, samt den uppdaterade `issue` och `key`.

**Attachment add** exponerar `attachments` och `count`. **Get Attachment** exponerar `attachment`; **List Attachments** exponerar `attachments`, `count` och `pagination`. När **Include Binary** är aktiverat kan varje attachment-objekt innehålla `content_base64`. Delete exponerar `deleted`.

**User** get/create exponerar `user`; delete exponerar `deleted`.

**Notify Issue** exponerar `notified`.

Vanliga åtkomstmönster:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Relaterat

- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md)
- [Tredjepartsintegrationer](../reference/integrations.md#jira)
- [Nodtyper](../reference/node-types.md)
- [Uttrycks-DSL](../reference/expression-dsl.md)
