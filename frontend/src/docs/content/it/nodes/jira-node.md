# Nodo Jira

Il nodo **Jira** connette i workflow all'API REST di Jira per l'automazione di progetti, issue, commenti, allegati, utenti, notifiche e transizioni. L'operazione predefinita è **Search Issues**.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Credenziale | Jira (Cloud email/API token, Data Center username/password o personal access token, base URL, modalità di deployment, versione REST API opzionale) |
| Output | `$nodeLabel.*` |

## Credenziale

Creare una credenziale **Jira** nella [Scheda Credenziali](../tabs/credentials-tab.md). Le chiavi di configurazione memorizzate sono `email`, `api_token`, `base_url`, `deployment`, `auth_mode` e `api_version` opzionale. Per Jira Cloud, `email` memorizza l'email dell'account Atlassian e `api_token` memorizza l'API token Atlassian. Per Jira Data Center / Server, le stesse chiavi memorizzano il nome utente e la password per l'autenticazione Basic, oppure, con `auth_mode: pat`, `api_token` memorizza un personal access token inviato come Bearer token e `email` non viene utilizzato. Consultare [Integrazioni di terze parti](../reference/integrations.md#jira) per i passaggi di configurazione.

| Campo | Chiave di configurazione | Descrizione |
| --- | --- | --- |
| Jira Email / Username | `email` | Email dell'account Atlassian per Jira Cloud, oppure nome utente per Jira Data Center / Server |
| Autenticazione | `auth_mode` | `basic` (predefinito) o `pat` (solo Data Center / Server) |
| Token API / Password / Personal Access Token | `api_token` | API token Atlassian per Jira Cloud, password per l'autenticazione Basic su Jira Data Center / Server o personal access token di Data Center in modalità `pat` |
| Base URL | `base_url` | URL del sito Jira, ad esempio `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` per Jira Cloud oppure `data_center` per Jira Data Center / Server |
| REST API Version | `api_version` | Il valore predefinito è `3` per Jira Cloud. Data Center / Server utilizza REST API v2 |

I personal access token richiedono Jira Data Center / Server 8.14 o successivo. Il cambio del metodo di autenticazione cancella il segreto memorizzato; inserisci la nuova password o il nuovo token al momento del passaggio.

Utilizzare **Test Connection** per verificare la credenziale rispetto all'utente Jira corrente.

## Operazioni

| Operazione | Campi obbligatori | Output |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Limit, Start At opzionali | `projects`, `count`, `pagination` |
| Search Issues | JQL, Issue Fields, Limit, Next Page Token, Start At opzionali | `issues`, `count`, `pagination` |
| Get Issue | Issue Key o ID | `issue`, `key` |
| Create Issue | Project Key, Summary | `issue`, `key` |
| Update Issue | Issue Key o ID e almeno un campo modificato | `issue`, `key` |
| Delete Issue | Issue Key o ID | `deleted` |
| Get Issue Changelog | Issue Key o ID; Limit, Start At opzionali | `changelog`, `count`, `pagination` |
| Notify Issue | Issue Key o ID, Subject, Text Body | `notified` |
| List Comments | Issue Key o ID; Limit, Start At opzionali | `comments`, `count`, `pagination` |
| Create Comment | Issue Key o ID, Comment Body | `comment` |
| Get Comment | Issue Key o ID, Comment ID | `comment` |
| Update Comment | Issue Key o ID, Comment ID, Comment Body | `comment` |
| Delete Comment | Issue Key o ID, Comment ID | `deleted` |
| Add Attachment | Issue Key o ID, Filename, contenuto Base64 | `attachments`, `count` |
| Get Attachment | Attachment ID; Include Binary opzionale | `attachment` |
| List Attachments | Issue Key o ID; Limit, Start At, Include Binary opzionali | `attachments`, `count`, `pagination` |
| Delete Attachment | Attachment ID | `deleted` |
| List Transitions | Issue Key o ID | `transitions`, `count` |
| Transition Issue | Issue Key o ID, Transition ID | `transition`, `issue`, `key` |
| Get User | Account ID / Username | `user` |
| Create User | User Email | `user` |
| Delete User | Account ID / Username | `deleted` |

I campi di testo che supportano le espressioni accettano [espressioni](../reference/expression-dsl.md) come `$input.text`. `jiraIncludeBinary` è un toggle booleano e non supporta le espressioni, ma può essere contrassegnato come fornito dall'agente quando il nodo Jira è collegato a un handle di strumento dell'Agent.
## Segnalazione e aggiornamento dei campi

- **Project Key** è la chiave breve del progetto, ad esempio `ENG`. Utilizzare List Projects per individuare le chiavi.
- **Issue Key o ID** accetta chiavi come `ENG-123` oppure ID numerici della segnalazione. Utilizzare Search Issues o List Projects per individuare i valori.
- **Transition ID** proviene da List Transitions. Ogni oggetto transition include un campo `id`.
- **Comment ID** e **Attachment ID** provengono da List Comments, List Attachments oppure dalle risposte di creazione/lettura precedenti.
- **Account ID / Username** è il valore `accountId` di Jira Cloud oppure il nome utente di Jira Data Center / Server. Get Myself o Get User possono aiutare a individuarlo.
- Il testo della **description** della segnalazione e del **body** del commento viene inviato in Atlassian Document Format su REST
  API v3; quando la distribuzione delle credenziali è Data Center / Server, viene inviato come testo semplice.
  In v3, i caratteri di nuova riga diventano paragrafi separati.
- **Get Issue Changelog** utilizza l'endpoint changelog paginato di Jira Cloud. Per Data Center / Server, legge i dati del changelog della segnalazione espansi e applica l'offset/limit configurato alle cronologie restituite.
- In **Update Issue**, lasciare vuoti i campi opzionali per preservarne i valori correnti.
- Impostare **Description** o **Assignee Account ID / Username** su `null` durante l'aggiornamento per svuotare tali campi. Le label non possono essere svuotate con `null`.
- **Recipients JSON** in Notify Issue assume il valore predefinito `{"assignee":true}` quando omesso. Le chiavi comuni includono `assignee`, `reporter`, `watchers` e `voters` (ad esempio `{"assignee":true,"watchers":true}`).
- **Add Attachment** accetta contenuti in base64 grezzo o data URL ed è limitato dall'impostazione della dimensione massima dei file della piattaforma (predefinita 99 MB).

## Paginazione

- **Search Issues** utilizza la paginazione a cursore tramite `jiraNextPageToken` per Jira Cloud. Leggere `pagination.nextPageToken` dall'esecuzione precedente e passarlo al nodo Search Issues successivo.
- **Search Issues** utilizza la paginazione a offset tramite `jiraStartAt` per Jira Data Center / Server. Leggere `pagination.startAt`, `pagination.maxResults` e `pagination.total` per calcolare la pagina successiva.
- **List Projects**, **Get Issue Changelog**, **List Comments** e **List Attachments** utilizzano la paginazione a offset con `jiraLimit` e `jiraStartAt`. I risultati paginati restituiscono `pagination.startAt`, `pagination.maxResults`, `pagination.total` e `pagination.isLast`.
- **List Attachments** recupera prima tutti gli allegati dalla segnalazione, quindi suddivide il risultato lato client. I campi di paginazione descrivono comunque la pagina restituita, ma le segnalazioni di grandi dimensioni possono comportare un costo di recupero aggiuntivo.
- **List Transitions** non prevede paginazione.
## Campi principali

| Campo | Utilizzato da | Note |
| --- | --- | --- |
| `credentialId` | Tutte le operazioni | UUID della credenziale Jira di proprietà |
| `jiraOperation` | Tutte le operazioni | Valore predefinito: `searchIssues` |
| `jiraProjectKey` | Create Issue | Chiave del progetto, ad esempio `ENG` |
| `jiraIssueKey` | Operazioni su issue, commenti, allegati, notifiche e transizioni | Chiave della issue, ad esempio `ENG-123`, oppure ID numerico della issue |
| `jiraIssueType` | Create Issue | Valore predefinito: `Task` |
| `jiraIssueTypeId` | Create Issue | ID del tipo di issue opzionale; se impostato, prevale su `jiraIssueType` |
| `jiraSummary` | Create/Update Issue | Obbligatorio per Create Issue |
| `jiraDescription` | Create/Update Issue | Inviato come ADF su REST API v3 o come testo semplice su REST API v2; utilizzare `null` in fase di aggiornamento per cancellare la descrizione |
| `jiraJql` | Search Issues | Valore predefinito: `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Array JSON opzionale o elenco di campi della issue separati da virgola; se vuoto, il valore predefinito è `key`, `summary`, `status`, `assignee` e `issuetype` |
| `jiraAssigneeAccountId` | Create/Update Issue | accountId di Jira Cloud oppure username di Data Center / Server; utilizzare `null` in fase di aggiornamento per cancellare l'assegnatario |
| `jiraLabels` | Create/Update Issue | Array JSON o testo separato da virgola |
| `jiraCommentBody` | Create/Update Comment | Inviato come ADF su REST API v3 o come testo semplice su REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID del commento Jira |
| `jiraTransitionId` | Transition Issue | Da individuare tramite List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID dell'allegato Jira |
| `jiraAttachmentFilename` | Add Attachment | Nome del file caricato |
| `jiraAttachmentBase64` | Add Attachment | Contenuto base64 non elaborato o data URL; soggetto al limite di dimensione del file |
| `jiraAttachmentMimeType` | Add Attachment | Tipo MIME opzionale; se vuoto, viene dedotto dal nome del file |
| `jiraIncludeBinary` | Get/List Attachment | Interruttore booleano; se abilitato, aggiunge `content_base64` |
| `jiraNotifySubject` | Notify Issue | Oggetto della notifica obbligatorio |
| `jiraNotifyTextBody` | Notify Issue | Corpo della notifica in testo semplice obbligatorio |
| `jiraNotifyHtmlBody` | Notify Issue | Corpo HTML opzionale |
| `jiraNotifyTo` | Notify Issue | JSON dei destinatari; valore predefinito: `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | accountId di Jira Cloud oppure username di Data Center / Server |
| `jiraUserEmail` | Create User | Indirizzo email del nuovo utente |
| `jiraUsername` | Create User | Username opzionale per Data Center / Server; in mancanza, viene utilizzato `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Nome visualizzato opzionale |
| `jiraUserProducts` | Create User | Array JSON o elenco di chiavi prodotto separate da virgola; solo Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Valore predefinito: `50`; intervallo 1–100 |
| `jiraStartAt` | Search Issues su Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Indice iniziale della paginazione a offset |
| `jiraNextPageToken` | Search Issues su Jira Cloud | Token cursore proveniente da una precedente risposta di ricerca |

## Esempi

Creare una issue a partire dall'input a monte:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Aggiornare una issue e cancellare l'assegnatario:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Cercare issue con campi personalizzati e paginazione tramite cursore:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Cercare issue su Data Center con paginazione a offset:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Eseguire la transizione di una issue dopo aver elencato le transizioni disponibili:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- Successivamente eseguire **Transition Issue** con Transition ID: `$listTransitions.transitions[0].id`

Notificare gli osservatori in merito all'aggiornamento di una issue:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Output

Ogni operazione completata con successo imposta:

- `$jira.success`
- `$jira.operation`

**Get Myself** espone `user`.

**Le operazioni di elenco paginato** espongono `count`, un campo di raccolta e `pagination`:

| Operazione | Chiave di raccolta | Struttura della paginazione |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** espone `transitions` e `count` senza paginazione.

**Le mutazioni e le letture delle issue** espongono il payload della issue Jira più `key` ove applicabile.

**Comment** get/create/update espongono `comment`; delete espone `deleted`.

**Transition Issue** espone `transition` come `{ transitionId }`, più la `issue` aggiornata e `key`.

**Attachment add** espone `attachments` e `count`. **Get Attachment** espone `attachment`; **List Attachments** espone `attachments`, `count` e `pagination`. Quando **Include Binary** è abilitato, ciascun oggetto attachment può includere `content_base64`. Delete espone `deleted`.

**User** get/create espongono `user`; delete espone `deleted`.

**Notify Issue** espone `notified`.

Pattern di accesso comuni:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Correlati

- [Scheda Credenziali](../tabs/credentials-tab.md)
- [Integrazioni di terze parti](../reference/integrations.md#jira)
- [Tipi di nodo](../reference/node-types.md)
- [DSL delle espressioni](../reference/expression-dsl.md)
