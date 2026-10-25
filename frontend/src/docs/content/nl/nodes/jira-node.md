# Jira-node

De **Jira**-node verbindt workflows met de Jira REST API voor automatisering van projecten, issues, opmerkingen, bijlagen, gebruikers, meldingen en transities. De standaardbewerking is **Issues zoeken**.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Referentie | Jira (Cloud e-mail/API-token, Data Center gebruikersnaam/wachtwoord of persoonlijk toegangstoken, basis-URL, implementatiemodus, optionele REST API-versie) |
| Uitvoer | `$nodeLabel.*` |

## Referentie

Maak een **Jira**-referentie aan in het tabblad [Referenties](../tabs/credentials-tab.md). Opgeslagen configuratiesleutels zijn `email`, `api_token`, `base_url`, `deployment`, `auth_mode` en optioneel `api_version`. Voor Jira Cloud slaat `email` het e-mailadres van het Atlassian-account op en `api_token` het Atlassian API-token. Voor Jira Data Center / Server slaan dezelfde sleutels de gebruikersnaam en het wachtwoord voor Basic auth op, of met `auth_mode: pat` slaat `api_token` een persoonlijk toegangstoken op dat als Bearer-token wordt verzonden en wordt `email` niet gebruikt. Zie [Integraties met derden](../reference/integrations.md#jira) voor installatiestappen.

| Veld | Configuratiesleutel | Beschrijving |
| --- | --- | --- |
| Jira e-mail / gebruikersnaam | `email` | E-mailadres van het Jira Cloud Atlassian-account, of gebruikersnaam voor Jira Data Center / Server |
| Authenticatie | `auth_mode` | `basic` (standaard) of `pat` (alleen Data Center / Server) |
| API-token / wachtwoord / persoonlijk toegangstoken | `api_token` | Atlassian API-token voor Jira Cloud, wachtwoord voor Basic auth voor Jira Data Center / Server, of een Data Center persoonlijk toegangstoken in `pat`-modus |
| Basis-URL | `base_url` | Jira-site-URL, bijvoorbeeld `https://your-domain.atlassian.net` |
| Implementatie | `deployment` | `cloud` voor Jira Cloud of `data_center` voor Jira Data Center / Server |
| REST API-versie | `api_version` | Standaard `3` voor Jira Cloud. Data Center / Server gebruikt REST API v2 |

Persoonlijke toegangstokens vereisen Jira Data Center / Server 8.14 of hoger. Bij het wisselen van authenticatiemethode wordt het opgeslagen geheim gewist, dus voer het nieuwe wachtwoord of token in wanneer u wisselt.

Gebruik **Verbinding testen** om de referentie te verifiëren tegen de huidige Jira-gebruiker.

## Bewerkingen

| Bewerking | Verplichte velden | Uitvoer |
| --- | --- | --- |
| Mezelf ophalen | — | `user` |
| Projecten weergeven | Optioneel Limiet, Start bij | `projects`, `count`, `pagination` |
| Issues zoeken | Optioneel JQL, Issue-velden, Limiet, Token volgende pagina, Start bij | `issues`, `count`, `pagination` |
| Issue ophalen | Issue-sleutel of -ID | `issue`, `key` |
| Issue aanmaken | Projectsleutel, Samenvatting | `issue`, `key` |
| Issue bijwerken | Issue-sleutel of -ID en ten minste één gewijzigd veld | `issue`, `key` |
| Issue verwijderen | Issue-sleutel of -ID | `deleted` |
| Issue-changelog ophalen | Issue-sleutel of -ID; optioneel Limiet, Start bij | `changelog`, `count`, `pagination` |
| Issue melden | Issue-sleutel of -ID, Onderwerp, Tekstinhoud | `notified` |
| Opmerkingen weergeven | Issue-sleutel of -ID; optioneel Limiet, Start bij | `comments`, `count`, `pagination` |
| Opmerking aanmaken | Issue-sleutel of -ID, Inhoud opmerking | `comment` |
| Opmerking ophalen | Issue-sleutel of -ID, Opmerking-ID | `comment` |
| Opmerking bijwerken | Issue-sleutel of -ID, Opmerking-ID, Inhoud opmerking | `comment` |
| Opmerking verwijderen | Issue-sleutel of -ID, Opmerking-ID | `deleted` |
| Bijlage toevoegen | Issue-sleutel of -ID, Bestandsnaam, Base64-inhoud | `attachments`, `count` |
| Bijlage ophalen | Bijlage-ID; optioneel Binaire inhoud opnemen | `attachment` |
| Bijlagen weergeven | Issue-sleutel of -ID; optioneel Limiet, Start bij, Binaire inhoud opnemen | `attachments`, `count`, `pagination` |
| Bijlage verwijderen | Bijlage-ID | `deleted` |
| Transities weergeven | Issue-sleutel of -ID | `transitions`, `count` |
| Issue-transitie | Issue-sleutel of -ID, Transitie-ID | `transition`, `issue`, `key` |
| Gebruiker ophalen | Account-ID / gebruikersnaam | `user` |
| Gebruiker aanmaken | E-mailadres gebruiker | `user` |
| Gebruiker verwijderen | Account-ID / gebruikersnaam | `deleted` |

Tekstvelden die expressies ondersteunen, accepteren [expressies](../reference/expression-dsl.md) zoals `$input.text`. `jiraIncludeBinary` is een boolean-schakelaar en ondersteunt geen expressies, maar kan worden gemarkeerd als door de agent aangeleverd wanneer de Jira-node aan een Agent-tool-handle is gekoppeld.

## Issue- en updatevelden

- **Projectsleutel** is de korte projectsleutel zoals `ENG`. Gebruik Projecten weergeven om sleutels te ontdekken.
- **Issue-sleutel of -ID** accepteert sleutels zoals `ENG-123` of numerieke issue-ID's. Gebruik Issues zoeken of Projecten weergeven om waarden te ontdekken.
- **Transitie-ID** is afkomstig van Transities weergeven. Elk transitieobject bevat een `id`-veld.
- **Opmerking-ID** en **Bijlage-ID** zijn afkomstig van Opmerkingen weergeven, Bijlagen weergeven of eerdere aanmaak-/ophaalreacties.
- **Account-ID / gebruikersnaam** is de Jira Cloud `accountId`-waarde of de gebruikersnaam voor Jira Data Center / Server. Mezelf ophalen of Gebruiker ophalen kan helpen deze te ontdekken.
- Issue-**beschrijving** en de **inhoud** van opmerkingen worden verzonden als Atlassian Document Format op REST
  API v3; wanneer de referentie-implementatie Data Center / Server is, worden ze als platte tekst verzonden.
  In v3 worden regeleinden afzonderlijke alinea's.
- **Issue-changelog ophalen** gebruikt het gepagineerde changelog-endpoint van Jira Cloud. Voor Data Center / Server leest het uitgebreide issue-changeloggegevens en past het de geconfigureerde offset/limiet toe op de geretourneerde historie.
- Laat bij **Issue bijwerken** optionele velden leeg om hun huidige waarden te behouden.
- Stel **Beschrijving** of **Account-ID / gebruikersnaam van toegewezene** in op `null` bij een update om die velden te wissen. Labels kunnen niet met `null` worden gewist.
- **Ontvangers-JSON** bij Issue melden is standaard `{"assignee":true}` wanneer weggelaten. Veelvoorkomende sleutels zijn `assignee`, `reporter`, `watchers` en `voters` (bijvoorbeeld `{"assignee":true,"watchers":true}`).
- **Bijlage toevoegen** accepteert onbewerkte base64- of data-URL-inhoud en is beperkt door de bestandsgrootte-instelling van het platform (standaard 99 MB).
## Paginering

- **Search Issues** gebruikt cursor-paginering via `jiraNextPageToken` voor Jira Cloud. Lees `pagination.nextPageToken` uit de vorige uitvoering en geef deze door aan de volgende Search Issues-node.
- **Search Issues** gebruikt offset-paginering via `jiraStartAt` voor Jira Data Center / Server. Lees `pagination.startAt`, `pagination.maxResults` en `pagination.total` om de volgende pagina te berekenen.
- **List Projects**, **Get Issue Changelog**, **List Comments** en **List Attachments** gebruiken offset-paginering met `jiraLimit` en `jiraStartAt`. Gepagineerde resultaten retourneren `pagination.startAt`, `pagination.maxResults`, `pagination.total` en `pagination.isLast`.
- **List Attachments** haalt eerst alle bijlagen van de issue op en snijdt het resultaat vervolgens client-side af. De pagineringsvelden beschrijven nog steeds de geretourneerde pagina, maar bij grote issues kan een extra ophaalkost ontstaan.
- **List Transitions** ondersteunt geen paginering.

## Belangrijke velden

| Veld | Gebruikt door | Opmerkingen |
| --- | --- | --- |
| `credentialId` | Alle bewerkingen | UUID van de eigen Jira-referentie |
| `jiraOperation` | Alle bewerkingen | Standaardwaarde is `searchIssues` |
| `jiraProjectKey` | Create Issue | Projectsleutel zoals `ENG` |
| `jiraIssueKey` | Issue-, commentaar-, bijlage-, notificatie- en transitiebewerkingen | Issuesleutel zoals `ENG-123` of numerieke issue-ID |
| `jiraIssueType` | Create Issue | Standaardwaarde is `Task` |
| `jiraIssueTypeId` | Create Issue | Optionele issue-type-ID; overschrijft `jiraIssueType` indien ingesteld |
| `jiraSummary` | Create/Update Issue | Vereist voor Create Issue |
| `jiraDescription` | Create/Update Issue | Verzonden als ADF op REST API v3 of platte tekst op REST API v2; gebruik `null` bij update om de beschrijving te wissen |
| `jiraJql` | Search Issues | Standaardwaarde is `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Optionele JSON-array of kommagescheiden issue-velden; standaard `key`, `summary`, `status`, `assignee` en `issuetype` indien leeg |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud accountId of Data Center / Server gebruikersnaam; gebruik `null` bij update om de toegewezene te wissen |
| `jiraLabels` | Create/Update Issue | JSON-array of kommagescheiden tekst |
| `jiraCommentBody` | Create/Update Comment | Verzonden als ADF op REST API v3 of platte tekst op REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | Jira commentaar-ID |
| `jiraTransitionId` | Transition Issue | Ontdek met List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | Jira bijlage-ID |
| `jiraAttachmentFilename` | Add Attachment | Geüploade bestandsnaam |
| `jiraAttachmentBase64` | Add Attachment | Ruwe base64- of data-URL-inhoud; onderhevig aan bestandsgroottelimiet |
| `jiraAttachmentMimeType` | Add Attachment | Optioneel MIME-type; afgeleid van bestandsnaam indien leeg |
| `jiraIncludeBinary` | Get/List Attachment | Booleaanse schakelaar; voegt `content_base64` toe indien ingeschakeld |
| `jiraNotifySubject` | Notify Issue | Vereist onderwerp van de notificatie |
| `jiraNotifyTextBody` | Notify Issue | Vereiste platte-tekstinhoud van de notificatie |
| `jiraNotifyHtmlBody` | Notify Issue | Optionele HTML-inhoud |
| `jiraNotifyTo` | Notify Issue | JSON met ontvangers; standaard `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud accountId of Data Center / Server gebruikersnaam |
| `jiraUserEmail` | Create User | E-mailadres van de nieuwe gebruiker |
| `jiraUsername` | Create User | Optionele Data Center / Server gebruikersnaam; valt terug op `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Optionele weergavenaam |
| `jiraUserProducts` | Create User | JSON-array of kommagescheiden productsleutels; alleen Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Standaardwaarde is `50`; bereik 1–100 |
| `jiraStartAt` | Search Issues op Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Startindex voor offset-paginering |
| `jiraNextPageToken` | Search Issues op Jira Cloud | Cursortoken uit een eerdere zoekrespons |

## Voorbeelden

Een issue aanmaken op basis van upstream-invoer:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Een issue bijwerken en de toegewezene wissen:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Issues zoeken met aangepaste velden en cursor-paginering:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Issues zoeken op Data Center met offset-paginering:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Een transitie uitvoeren op een issue na het opvragen van de beschikbare transities:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Voer vervolgens **Transition Issue** uit met Transition ID: `$listTransitions.transitions[0].id`

Waarnemers op de hoogte stellen van een issue-update:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Uitvoer

Elke geslaagde bewerking stelt het volgende in:

- `$jira.success`
- `$jira.operation`

**Get Myself** stelt `user` beschikbaar.

**Gepagineerde lijstbewerkingen** stellen `count`, een collectieveld en `pagination` beschikbaar:

| Bewerking | Collectiesleutel | Paginering-vorm |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** stelt `transitions` en `count` beschikbaar zonder paginering.

**Issue-mutaties en -leesbewerkingen** stellen de Jira issue-payload beschikbaar plus `key` waar van toepassing.

**Comment** get/create/update stellen `comment` beschikbaar; delete stelt `deleted` beschikbaar.

**Transition Issue** stelt `transition` beschikbaar als `{ transitionId }`, plus de vernieuwde `issue` en `key`.

**Attachment add** stelt `attachments` en `count` beschikbaar. **Get Attachment** stelt `attachment` beschikbaar; **List Attachments** stelt `attachments`, `count` en `pagination` beschikbaar. Wanneer **Include Binary** is ingeschakeld, kan elk attachment-object `content_base64` bevatten. Delete stelt `deleted` beschikbaar.

**User** get/create stellen `user` beschikbaar; delete stelt `deleted` beschikbaar.

**Notify Issue** stelt `notified` beschikbaar.

Veelvoorkomende toegangspatronen:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Gerelateerd

- [Referenties-tab](../tabs/credentials-tab.md)
- [Integraties met derden](../reference/integrations.md#jira)
- [Node-typen](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
