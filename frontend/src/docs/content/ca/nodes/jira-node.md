# Node Jira

El node **Jira** connecta els workflows a l'API REST de Jira per a l'automatització de projectes, incidències, comentaris, fitxers adjunts, usuaris, notificacions i transicions. L'operació per defecte és **Search Issues**.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Credencial | Jira (correu electrònic/token d'API de Cloud, nom d'usuari/contrasenya o token d'accés personal de Data Center, URL base, mode de desplegament, versió opcional de l'API REST) |
| Sortida | `$nodeLabel.*` |

## Credencial

Creeu una credencial **Jira** a la [Pestanya Credencials](../tabs/credentials-tab.md). Les claus de configuració emmagatzemades són `email`, `api_token`, `base_url`, `deployment`, `auth_mode` i, opcionalment, `api_version`. Per a Jira Cloud, `email` emmagatzema el correu electrònic del compte d'Atlassian i `api_token` emmagatzema el token d'API d'Atlassian. Per a Jira Data Center / Server, aquestes mateixes claus emmagatzemen el nom d'usuari i la contrasenya de l'autenticació bàsica o, amb `auth_mode: pat`, `api_token` emmagatzema un token d'accés personal enviat com a Bearer token i `email` no s'utilitza. Consulteu [Integracions de tercers](../reference/integrations.md#jira) per als passos de configuració.

| Camp | Claus de configuració | Descripció |
| --- | --- | --- |
| Jira Email / Username | `email` | Correu electrònic del compte d'Atlassian de Jira Cloud, o nom d'usuari de Jira Data Center / Server |
| Autenticació | `auth_mode` | `basic` (per defecte) o `pat` (només Data Center / Server) |
| API Token / Password / Token d'accés personal | `api_token` | Token d'API d'Atlassian de Jira Cloud, contrasenya de Jira Data Center / Server per a l'autenticació bàsica, o un token d'accés personal de Data Center en mode `pat` |
| Base URL | `base_url` | URL del lloc de Jira, per exemple `https://your-domain.atlassian.net` |
| Deployment | `deployment` | `cloud` per a Jira Cloud o `data_center` per a Jira Data Center / Server |
| REST API Version | `api_version` | Per defecte és `3` per a Jira Cloud. Data Center / Server utilitza l'API REST v2 |

Els tokens d'accés personal requereixen Jira Data Center / Server 8.14 o posterior. Canviar de mètode d'autenticació esborra el secret desat, així que introduïu la nova contrasenya o token quan canvieu.

Utilitzeu **Test Connection** per verificar la credencial contra l'usuari actual de Jira.

## Operacions

| Operació | Camps obligatoris | Sortida |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Limit, Start At opcionals | `projects`, `count`, `pagination` |
| Search Issues | JQL, Issue Fields, Limit, Next Page Token, Start At opcionals | `issues`, `count`, `pagination` |
| Get Issue | Clau o ID de la incidència | `issue`, `key` |
| Create Issue | Clau del projecte, Resum | `issue`, `key` |
| Update Issue | Clau o ID de la incidència i almenys un camp modificat | `issue`, `key` |
| Delete Issue | Clau o ID de la incidència | `deleted` |
| Get Issue Changelog | Clau o ID de la incidència; Limit, Start At opcionals | `changelog`, `count`, `pagination` |
| Notify Issue | Clau o ID de la incidència, Assumpte, Cos del text | `notified` |
| List Comments | Clau o ID de la incidència; Limit, Start At opcionals | `comments`, `count`, `pagination` |
| Create Comment | Clau o ID de la incidència, Cos del comentari | `comment` |
| Get Comment | Clau o ID de la incidència, ID del comentari | `comment` |
| Update Comment | Clau o ID de la incidència, ID del comentari, Cos del comentari | `comment` |
| Delete Comment | Clau o ID de la incidència, ID del comentari | `deleted` |
| Add Attachment | Clau o ID de la incidència, Nom del fitxer, Contingut en Base64 | `attachments`, `count` |
| Get Attachment | ID del fitxer adjunt; Include Binary opcional | `attachment` |
| List Attachments | Clau o ID de la incidència; Limit, Start At, Include Binary opcionals | `attachments`, `count`, `pagination` |
| Delete Attachment | ID del fitxer adjunt | `deleted` |
| List Transitions | Clau o ID de la incidència | `transitions`, `count` |
| Transition Issue | Clau o ID de la incidència, ID de la transició | `transition`, `issue`, `key` |
| Get User | ID del compte / Nom d'usuari | `user` |
| Create User | Correu electrònic de l'usuari | `user` |
| Delete User | ID del compte / Nom d'usuari | `deleted` |

Els camps de text compatibles amb expressions admeten [expressions](../reference/expression-dsl.md) com ara `$input.text`. `jiraIncludeBinary` és un commutador booleà i no admet expressions, però es pot marcar com a proporcionat per l'agent quan el node Jira està adjunt a una nansa d'eina d'Agent.
## Emetre i actualitzar camps

- **Project Key** és la clau curta del projecte, com ara `ENG`. Utilitzeu List Projects per descobrir les claus.
- **Issue Key or ID** accepta claus com `ENG-123` o ID numèrics d'incidència. Utilitzeu Search Issues o List Projects per descobrir els valors.
- **Transition ID** prové de List Transitions. Cada objecte de transició inclou un camp `id`.
- **Comment ID** i **Attachment ID** provenen de List Comments, List Attachments o de respostes prèvies de creació/consulta.
- **Account ID / Username** és el valor `accountId` de Jira Cloud o el nom d'usuari de Jira Data Center / Server. Get Myself o Get User us poden ajudar a descobrir-lo.
- El text de **description** de la incidència i del **body** del comentari s'envien com a Atlassian Document Format a la REST API v3; quan el desplegament de la credencial és Data Center / Server, s'envien com a text pla. A la v3, els caràcters de salt de línia esdevenen paràgrafs separats.
- **Get Issue Changelog** utilitza l'endpoint paginat de changelog de Jira Cloud. Per a Data Center / Server, llegeix les dades ampliades del changelog de la incidència i aplica l'offset/limit configurat als historials retornats.
- A **Update Issue**, deixeu els camps opcionals buits per preservar-ne els valors actuals.
- Establiu **Description** o **Assignee Account ID / Username** a `null` en actualitzar per buidar aquests camps. Les etiquetes no es poden buidar amb `null`.
- **Recipients JSON** a Notify Issue pren el valor per defecte `{"assignee":true}` quan s'omet. Les claus habituals inclouen `assignee`, `reporter`, `watchers` i `voters` (per exemple, `{"assignee":true,"watchers":true}`).
- **Add Attachment** accepta contingut base64 en cru o contingut de data URL i està limitat per la configuració de mida de fitxer de la plataforma (99 MB per defecte).

## Paginació

- **Search Issues** utilitza paginació per cursor mitjançant `jiraNextPageToken` per a Jira Cloud. Llegiu `pagination.nextPageToken` de l'execució anterior i passeu-lo al node Search Issues següent.
- **Search Issues** utilitza paginació per offset mitjançant `jiraStartAt` per a Jira Data Center / Server. Llegiu `pagination.startAt`, `pagination.maxResults` i `pagination.total` per calcular la pàgina següent.
- **List Projects**, **Get Issue Changelog**, **List Comments** i **List Attachments** utilitzen paginació per offset amb `jiraLimit` i `jiraStartAt`. Els resultats paginats retornen `pagination.startAt`, `pagination.maxResults`, `pagination.total` i `pagination.isLast`.
- **List Attachments** obté primer tots els adjunts de la incidència i, després, retalla el resultat al costat del client. Els camps de paginació encara descriuen la pàgina retornada, però les incidències grans poden comportar un cost addicional d'obtenció.
- **List Transitions** no pagina.
## Camps clau

| Camp | Utilitzat per | Notes |
| --- | --- | --- |
| `credentialId` | Totes les operacions | UUID de la credencial Jira pròpia |
| `jiraOperation` | Totes les operacions | Per defecte, `searchIssues` |
| `jiraProjectKey` | Create Issue | Clau de projecte com ara `ENG` |
| `jiraIssueKey` | Operacions d'issue, comentari, adjunció, notificació i transició | Clau d'issue com ara `ENG-123` o ID numèric d'issue |
| `jiraIssueType` | Create Issue | Per defecte, `Task` |
| `jiraIssueTypeId` | Create Issue | ID de tipus d'issue opcional; substitueix `jiraIssueType` quan s'estableix |
| `jiraSummary` | Create/Update Issue | Obligatori per a Create Issue |
| `jiraDescription` | Create/Update Issue | S'envia com a ADF a REST API v3 o com a text pla a REST API v2; utilitzeu `null` en l'actualització per esborrar la descripció |
| `jiraJql` | Search Issues | Per defecte, `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Array JSON opcional o camps d'issue separats per comes; per defecte, `key`, `summary`, `status`, `assignee` i `issuetype` quan és buit |
| `jiraAssigneeAccountId` | Create/Update Issue | accountId de Jira Cloud o nom d'usuari de Data Center / Server; utilitzeu `null` en l'actualització per esborrar l'assignat |
| `jiraLabels` | Create/Update Issue | Array JSON o text separat per comes |
| `jiraCommentBody` | Create/Update Comment | S'envia com a ADF a REST API v3 o com a text pla a REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID de comentari de Jira |
| `jiraTransitionId` | Transition Issue | Es descobreix amb List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID d'adjunció de Jira |
| `jiraAttachmentFilename` | Add Attachment | Nom del fitxer pujat |
| `jiraAttachmentBase64` | Add Attachment | Contingut base64 en brut o data URL; subjecte al límit de mida de fitxer |
| `jiraAttachmentMimeType` | Add Attachment | Tipus MIME opcional; s'infereix a partir del nom del fitxer quan és buit |
| `jiraIncludeBinary` | Get/List Attachment | Commutador booleà; afegeix `content_base64` quan està activat |
| `jiraNotifySubject` | Notify Issue | Assumpte de notificació obligatori |
| `jiraNotifyTextBody` | Notify Issue | Cos de notificació en text pla obligatori |
| `jiraNotifyHtmlBody` | Notify Issue | Cos HTML opcional |
| `jiraNotifyTo` | Notify Issue | JSON de destinataris; per defecte, `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | accountId de Jira Cloud o nom d'usuari de Data Center / Server |
| `jiraUserEmail` | Create User | Adreça electrònica del nou usuari |
| `jiraUsername` | Create User | Nom d'usuari opcional de Data Center / Server; si no s'especifica, s'utilitza `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Nom visible opcional |
| `jiraUserProducts` | Create User | Array JSON o claus de producte separades per comes; només Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Per defecte, `50`; rang 1–100 |
| `jiraStartAt` | Search Issues a Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Índex d'inici de paginació per desplaçament |
| `jiraNextPageToken` | Search Issues a Jira Cloud | Token de cursor d'una resposta de cerca anterior |

## Exemples

Creeu un issue a partir de l'entrada d'origen:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Actualitzeu un issue i esborreu l'assignat:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Cerqueu issues amb camps personalitzats i paginació per cursor:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Cerqueu issues a Data Center amb paginació per desplaçament:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Feu la transició d'un issue després de llistar les transicions disponibles:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- A continuació, executeu **Transition Issue** amb Transition ID: `$listTransitions.transitions[0].id`

Notifiqueu els observadors sobre una actualització d'issue:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Sortida

Cada operació completada correctament estableix:

- `$jira.success`
- `$jira.operation`

**Get Myself** exposa `user`.

**Les operacions de llista paginada** exposen `count`, un camp de col·lecció i `pagination`:

| Operació | Clau de col·lecció | Forma de paginació |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** exposa `transitions` i `count` sense paginació.

**Les mutacions i lectures d'incidències** exposen el payload de la incidència de Jira més `key` quan sigui aplicable.

**Comment** get/create/update exposen `comment`; delete exposa `deleted`.

**Transition Issue** exposa `transition` com a `{ transitionId }`, més la `issue` i `key` actualitzades.

**Attachment add** exposa `attachments` i `count`. **Get Attachment** exposa `attachment`; **List Attachments** exposa `attachments`, `count` i `pagination`. Quan **Include Binary** està habilitat, cada objecte d'adjunt pot incloure `content_base64`. Delete exposa `deleted`.

**User** get/create exposen `user`; delete exposa `deleted`.

**Notify Issue** exposa `notified`.

Patrons d'accés habituals:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Relacionat

- [Credentials Tab](../tabs/credentials-tab.md)
- [Third-Party Integrations](../reference/integrations.md#jira)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
