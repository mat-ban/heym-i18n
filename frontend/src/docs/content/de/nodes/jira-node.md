# Jira-Knoten

Der **Jira**-Knoten verbindet Workflows mit der Jira REST API für die Automatisierung von Projekten, Issues, Kommentaren, Anhängen, Benutzern, Benachrichtigungen und Übergängen. Die Standardoperation ist **Issues suchen**.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Anmeldedaten | Jira (Cloud-E-Mail/API-Token oder Data Center-Benutzername/Passwort, Basis-URL, Deployment-Modus, optionale REST API-Version) |
| Ausgabe | `$nodeLabel.*` |

## Anmeldedaten

Erstelle Jira-Anmeldedaten im [Reiter „Anmeldedaten"](../tabs/credentials-tab.md). Gespeicherte Konfigurationsschlüssel sind `email`, `api_token`, `base_url`, `deployment` und optional `api_version`. Für Jira Cloud speichert `email` die Atlassian-Konto-E-Mail und `api_token` speichert das Atlassian API-Token. Für Jira Data Center / Server speichern dieselben Schlüssel den Basic-Auth-Benutzernamen und das Passwort. Siehe [Drittanbieter-Integrationen](../reference/integrations.md#jira) für Einrichtungsschritte.

| Feld | Konfigurationsschlüssel | Beschreibung |
| --- | --- | --- |
| Jira Email / Username | `email` | Jira Cloud Atlassian-Konto-E-Mail oder Jira Data Center / Server-Benutzername |
| API Token / Password | `api_token` | Jira Cloud Atlassian API-Token oder Jira Data Center / Server-Passwort für Basic Auth |
| Base URL | `base_url` | Jira-Site-URL, zum Beispiel `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` für Jira Cloud oder `data_center` für Jira Data Center / Server |
| REST API Version | `api_version` | Standardwert ist `3` für Jira Cloud. Data Center / Server verwendet REST API v2 |

Data Center / Server Personal Access Tokens und Bearer Auth werden von den Jira-Anmeldedaten noch nicht unterstützt.

Verwende **Test Connection**, um die Anmeldedaten gegen den aktuellen Jira-Benutzer zu überprüfen.

## Operationen

| Operation | Erforderliche Felder | Ausgabe |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Optional Limit, Start At | `projects`, `count`, `pagination` |
| Search Issues | Optional JQL, Issue Fields, Limit, Next Page Token, Start At | `issues`, `count`, `pagination` |
| Get Issue | Issue Key oder ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key oder ID und mindestens ein geändertes Feld | `issue`, `key` |
| Delete Issue | Issue Key oder ID | `deleted` |
| Get Issue Changelog | Issue Key oder ID; optional Limit, Start At | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key oder ID, Subject, Text Body | `notified` |
| List Comments | Issue Key oder ID; optional Limit, Start At | `comments`, `count`, `pagination` |
| Create Comment | Issue Key oder ID, Comment Body | `comment` |
| Get Comment | Issue Key oder ID, Comment ID | `comment` |
| Update Comment | Issue Key oder ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key oder ID, Comment ID | `deleted` |
| Add Attachment | Issue Key oder ID, Filename, Base64 content | `attachments`, `count` |
| Get Attachment | Attachment ID; optional Include Binary | `attachment` |
| List Attachments | Issue Key oder ID; optional Limit, Start At, Include Binary | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key oder ID | `transitions`, `count` |
| Transition Issue | Issue Key oder ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

Ausdrucksfähige Textfelder unterstützen [Ausdrücke](../reference/expression-dsl.md) wie `$input.text`. `jiraIncludeBinary` ist ein Boolean-Schalter und unterstützt keine Ausdrücke, kann aber als agent-provided markiert werden, wenn der Jira-Knoten an einen Agent-Tool-Handle angehängt ist.

## Issue- und Update-Felder

- **Project Key** ist der kurze Projektschlüssel wie `ENG`. Verwende List Projects, um Schlüssel zu ermitteln.
- **Issue Key oder ID** akzeptiert Schlüssel wie `ENG-123` oder numerische Issue-IDs. Verwende Search Issues oder List Projects, um Werte zu ermitteln.
- **Transition ID** stammt aus List Transitions. Jedes Transition-Objekt enthält ein `id`-Feld.
- **Comment ID** und **Attachment ID** stammen aus List Comments, List Attachments oder vorherigen Create/Get-Antworten.
- **Account ID / Username** ist der Jira Cloud `accountId`-Wert oder der Jira Data Center / Server-Benutzername. Get Myself oder Get User können dir helfen, ihn zu ermitteln.
- Issue-**description** und Kommentar-**body**-Text werden auf REST API v3 als Atlassian Document Format gesendet; wenn der Deployment-Modus der Anmeldedaten Data Center / Server ist, werden sie als Klartext gesendet. In v3 werden Zeilenumbruchzeichen zu separaten Absätzen.
- **Get Issue Changelog** verwendet den paginierten Changelog-Endpoint von Jira Cloud. Für Data Center / Server liest es erweiterte Issue-Changelog-Daten und wendet den konfigurierten Offset/Limit auf die zurückgegebenen Historien an.
- Bei **Update Issue** lasse optionale Felder leer, um ihre aktuellen Werte beizubehalten.
- Setze **Description** oder **Assignee Account ID / Username** beim Update auf `null`, um diese Felder zu leeren. Labels können nicht mit `null` geleert werden.
- **Recipients JSON** bei Notify Issue ist standardmäßig `{"assignee":true}`, wenn es weggelassen wird. Häufige Schlüssel sind `assignee`, `reporter`, `watchers` und `voters` (zum Beispiel `{"assignee":true,"watchers":true}`).
- **Add Attachment** akzeptiert rohe Base64- oder Data-URL-Inhalte und ist durch die Dateigrößen-Einstellung der Plattform begrenzt (Standard 99 MB).
## Pagination

- **Search Issues** verwendet Cursor-Pagination über `jiraNextPageToken` für Jira Cloud. Lies `pagination.nextPageToken` aus dem vorherigen Lauf und übergib es an den nächsten Search Issues-Knoten.
- **Search Issues** verwendet Offset-Pagination über `jiraStartAt` für Jira Data Center / Server. Lies `pagination.startAt`, `pagination.maxResults` und `pagination.total`, um die nächste Seite zu berechnen.
- **List Projects**, **Get Issue Changelog**, **List Comments** und **List Attachments** verwenden Offset-Pagination mit `jiraLimit` und `jiraStartAt`. Paginierte Ergebnisse liefern `pagination.startAt`, `pagination.maxResults`, `pagination.total` und `pagination.isLast`.
- **List Attachments** ruft zunächst alle Anhänge des Issues ab und schneidet das Ergebnis anschließend clientseitig zu. Die Pagination-Felder beschreiben weiterhin die zurückgegebene Seite, aber bei großen Issues kann ein zusätzlicher Abrufaufwand entstehen.
- **List Transitions** verwendet keine Pagination.

## Schlüsselfelder

| Feld | Verwendet von | Hinweise |
| --- | --- | --- |
| `credentialId` | Alle Operationen | UUID der eigenen Jira-Anmeldedaten |
| `jiraOperation` | Alle Operationen | Standardwert ist `searchIssues` |
| `jiraProjectKey` | Create Issue | Projekt-Schlüssel wie `ENG` |
| `jiraIssueKey` | Issue-, Kommentar-, Anhang-, Benachrichtigungs- und Transition-Operationen | Issue-Schlüssel wie `ENG-123` oder numerische Issue-ID |
| `jiraIssueType` | Create Issue | Standardwert ist `Task` |
| `jiraIssueTypeId` | Create Issue | Optionale Issue-Typ-ID; überschreibt `jiraIssueType`, wenn gesetzt |
| `jiraSummary` | Create/Update Issue | Erforderlich für Create Issue |
| `jiraDescription` | Create/Update Issue | Wird als ADF bei REST API v3 oder als Klartext bei REST API v2 gesendet; verwende `null` beim Update, um die Beschreibung zu löschen |
| `jiraJql` | Search Issues | Standardwert ist `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Optionales JSON-Array oder kommagetrennte Issue-Felder; standardmäßig `key`, `summary`, `status`, `assignee` und `issuetype`, wenn leer |
| `jiraAssigneeAccountId` | Create/Update Issue | Jira Cloud accountId oder Data Center / Server-Benutzername; verwende `null` beim Update, um den Assignee zu löschen |
| `jiraLabels` | Create/Update Issue | JSON-Array oder kommagetrennter Text |
| `jiraCommentBody` | Create/Update Comment | Wird als ADF bei REST API v3 oder als Klartext bei REST API v2 gesendet |
| `jiraCommentId` | Get/Update/Delete Comment | Jira-Kommentar-ID |
| `jiraTransitionId` | Transition Issue | Mit List Transitions ermitteln |
| `jiraAttachmentId` | Get/Delete Attachment | Jira-Anhang-ID |
| `jiraAttachmentFilename` | Add Attachment | Hochgeladener Dateiname |
| `jiraAttachmentBase64` | Add Attachment | Roher base64- oder Data-URL-Inhalt; unterliegt dem Dateigrößenlimit |
| `jiraAttachmentMimeType` | Add Attachment | Optionaler MIME-Typ; wird aus dem Dateinamen abgeleitet, wenn leer |
| `jiraIncludeBinary` | Get/List Attachment | Boolean-Umschalter; fügt `content_base64` hinzu, wenn aktiviert |
| `jiraNotifySubject` | Notify Issue | Erforderlicher Betreff der Benachrichtigung |
| `jiraNotifyTextBody` | Notify Issue | Erforderlicher Klartext-Textkörper der Benachrichtigung |
| `jiraNotifyHtmlBody` | Notify Issue | Optionaler HTML-Textkörper |
| `jiraNotifyTo` | Notify Issue | Empfänger-JSON; Standardwert ist `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | Jira Cloud accountId oder Data Center / Server-Benutzername |
| `jiraUserEmail` | Create User | E-Mail-Adresse des neuen Benutzers |
| `jiraUsername` | Create User | Optionaler Data Center / Server-Benutzername; fällt auf `jiraUserEmail` zurück |
| `jiraUserDisplayName` | Create User | Optionaler Anzeigename |
| `jiraUserProducts` | Create User | JSON-Array oder kommagetrennte Produkt-Schlüssel; nur Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Standardwert ist `50`; Bereich 1–100 |
| `jiraStartAt` | Search Issues auf Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Startindex der Offset-Pagination |
| `jiraNextPageToken` | Search Issues auf Jira Cloud | Cursor-Token aus einer vorherigen Suchantwort |

## Beispiele

Ein Issue aus vorgelagerter Eingabe erstellen:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Ein Issue aktualisieren und den Assignee löschen:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Issues mit benutzerdefinierten Feldern und Cursor-Pagination suchen:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Issues auf Data Center mit Offset-Pagination suchen:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Ein Issue nach dem Auflisten der verfügbaren Transitions überführen:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Führe anschließend **Transition Issue** mit Transition ID: `$listTransitions.transitions[0].id` aus

Watcher über eine Issue-Aktualisierung benachrichtigen:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Ausgabe

Jede erfolgreiche Operation setzt:

- `$jira.success`
- `$jira.operation`

**Get Myself** stellt `user` bereit.

**Paginated list operations** stellen `count`, ein Collection-Feld und `pagination` bereit:

| Operation | Collection-Schlüssel | Pagination-Form |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** stellt `transitions` und `count` ohne Pagination bereit.

**Issue mutations and reads** stellen die Jira-Issue-Payload plus `key` bereit, wo zutreffend.

**Comment** get/create/update stellen `comment` bereit; delete stellt `deleted` bereit.

**Transition Issue** stellt `transition` als `{ transitionId }` bereit, plus das aktualisierte `issue` und `key`.

**Attachment add** stellt `attachments` und `count` bereit. **Get Attachment** stellt `attachment` bereit; **List Attachments** stellt `attachments`, `count` und `pagination` bereit. Wenn **Include Binary** aktiviert ist, kann jedes Attachment-Objekt `content_base64` enthalten. Delete stellt `deleted` bereit.

**User** get/create stellen `user` bereit; delete stellt `deleted` bereit.

**Notify Issue** stellt `notified` bereit.

Häufige Zugriffsmuster:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Verwandte Themen

- [Anmeldedaten-Reiter](../tabs/credentials-tab.md)
- [Drittanbieter-Integrationen](../reference/integrations.md#jira)
- [Knotentypen](../reference/node-types.md)
- [Ausdrucks-DSL](../reference/expression-dsl.md)
