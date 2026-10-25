# Nodo Jira

El nodo **Jira** conecta workflows con la API REST de Jira para la automatización de proyectos, incidencias, comentarios, adjuntos, usuarios, notificaciones y transiciones. La operación predeterminada es **Search Issues**.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Credencial | Jira (correo electrónico/token de API de Cloud, nombre de usuario/contraseña o token de acceso personal de Data Center, URL base, modo de despliegue, versión opcional de la API REST) |
| Salida | `$nodeLabel.*` |

## Credencial

Cree una credencial de **Jira** en la [Pestaña Credenciales](../tabs/credentials-tab.md). Las claves de configuración almacenadas son `email`, `api_token`, `base_url`, `deployment`, `auth_mode` y `api_version` opcional. Para Jira Cloud, `email` almacena el correo electrónico de la cuenta de Atlassian y `api_token` almacena el token de API de Atlassian. Para Jira Data Center / Server, esas mismas claves almacenan el nombre de usuario y la contraseña de autenticación Basic o, con `auth_mode: pat`, `api_token` almacena un token de acceso personal enviado como Bearer token y `email` no se utiliza. Consulte [Integraciones de terceros](../reference/integrations.md#jira) para conocer los pasos de configuración.

| Campo | Clave de configuración | Descripción |
| --- | --- | --- |
| Correo electrónico / Nombre de usuario de Jira | `email` | Correo electrónico de la cuenta de Atlassian de Jira Cloud, o nombre de usuario de Jira Data Center / Server |
| Autenticación | `auth_mode` | `basic` (predeterminado) o `pat` (solo Data Center / Server) |
| Token de API / Contraseña / Token de acceso personal | `api_token` | Token de API de Atlassian de Jira Cloud, contraseña de Jira Data Center / Server para autenticación Basic, o un token de acceso personal de Data Center en modo `pat` |
| URL base | `base_url` | URL del sitio de Jira, por ejemplo `https://your-domain.atlassian.net` |
| Despliegue | `deployment` | `cloud` para Jira Cloud o `data_center` para Jira Data Center / Server |
| Versión de la API REST | `api_version` | El valor predeterminado es `3` para Jira Cloud. Data Center / Server utiliza la API REST v2 |

Los tokens de acceso personal requieren Jira Data Center / Server 8.14 o posterior. Cambiar de método de autenticación borra el secreto almacenado, por lo que debe introducir la nueva contraseña o token al cambiar.

Utilice **Test Connection** para verificar la credencial con el usuario actual de Jira.

## Operaciones

| Operación | Campos obligatorios | Salida |
| --- | --- | --- |
| Get Myself | — | `user` |
| List Projects | Limit, Start At opcionales | `projects`, `count`, `pagination` |
| Search Issues | JQL, Issue Fields, Limit, Next Page Token, Start At opcionales | `issues`, `count`, `pagination` |
| Get Issue | Clave o ID de la incidencia | `issue`, `key` |
| Create Issue | Clave del proyecto, Resumen | `issue`, `key` |
| Update Issue | Clave o ID de la incidencia y al menos un campo modificado | `issue`, `key` |
| Delete Issue | Clave o ID de la incidencia | `deleted` |
| Get Issue Changelog | Clave o ID de la incidencia; Limit, Start At opcionales | `changelog`, `count`, `pagination` |
| Notify Issue | Clave o ID de la incidencia, Asunto, Cuerpo del texto | `notified` |
| List Comments | Clave o ID de la incidencia; Limit, Start At opcionales | `comments`, `count`, `pagination` |
| Create Comment | Clave o ID de la incidencia, Cuerpo del comentario | `comment` |
| Get Comment | Clave o ID de la incidencia, ID del comentario | `comment` |
| Update Comment | Clave o ID de la incidencia, ID del comentario, Cuerpo del comentario | `comment` |
| Delete Comment | Clave o ID de la incidencia, ID del comentario | `deleted` |
| Add Attachment | Clave o ID de la incidencia, Nombre del archivo, Contenido en Base64 | `attachments`, `count` |
| Get Attachment | ID del adjunto; Include Binary opcional | `attachment` |
| List Attachments | Clave o ID de la incidencia; Limit, Start At, Include Binary opcionales | `attachments`, `count`, `pagination` |
| Delete Attachment | ID del adjunto | `deleted` |
| List Transitions | Clave o ID de la incidencia | `transitions`, `count` |
| Transition Issue | Clave o ID de la incidencia, ID de la transición | `transition`, `issue`, `key` |
| Get User | ID de cuenta / Nombre de usuario | `user` |
| Create User | Correo electrónico del usuario | `user` |
| Delete User | ID de cuenta / Nombre de usuario | `deleted` |

Los campos de texto compatibles con expresiones admiten [expresiones](../reference/expression-dsl.md) como `$input.text`. `jiraIncludeBinary` es un conmutador booleano y no admite expresiones, pero puede marcarse como proporcionado por el agente cuando el nodo Jira está vinculado a un handle de herramienta de Agent.
## Campos de emisión y actualización

- **Project Key** es la clave corta del proyecto, como `ENG`. Utilice List Projects para descubrir las claves.
- **Issue Key o ID** acepta claves como `ENG-123` o ID numéricos de emisión. Utilice Search Issues o List Projects para descubrir los valores.
- **Transition ID** proviene de List Transitions. Cada objeto de transición incluye un campo `id`.
- **Comment ID** y **Attachment ID** provienen de List Comments, List Attachments o de respuestas previas de creación/obtención.
- **Account ID / Username** es el valor `accountId` de Jira Cloud o el nombre de usuario de Jira Data Center / Server. Get Myself o Get User pueden ayudarle a descubrirlo.
- El **description** de la emisión y el texto del **body** del comentario se envían como Atlassian Document Format en la REST API v3; cuando el despliegue de la credencial es Data Center / Server, se envían como texto plano. En v3, los caracteres de nueva línea se convierten en párrafos separados.
- **Get Issue Changelog** utiliza el endpoint paginado de changelog de Jira Cloud. Para Data Center / Server, lee los datos expandidos del changelog de la emisión y aplica el offset/limit configurado a los historiales devueltos.
- En **Update Issue**, deje los campos opcionales vacíos para preservar sus valores actuales.
- Establezca **Description** o **Assignee Account ID / Username** en `null` al actualizar para borrar esos campos. Las etiquetas no se pueden borrar con `null`.
- **Recipients JSON** en Notify Issue toma por defecto `{"assignee":true}` cuando se omite. Las claves comunes incluyen `assignee`, `reporter`, `watchers` y `voters` (por ejemplo, `{"assignee":true,"watchers":true}`).
- **Add Attachment** acepta contenido en base64 sin procesar o data URL y está limitado por la configuración de tamaño de archivo de la plataforma (99 MB por defecto).

## Paginación

- **Search Issues** utiliza paginación por cursor mediante `jiraNextPageToken` para Jira Cloud. Lea `pagination.nextPageToken` de la ejecución anterior y páselo al siguiente nodo Search Issues.
- **Search Issues** utiliza paginación por offset mediante `jiraStartAt` para Jira Data Center / Server. Lea `pagination.startAt`, `pagination.maxResults` y `pagination.total` para calcular la página siguiente.
- **List Projects**, **Get Issue Changelog**, **List Comments** y **List Attachments** utilizan paginación por offset con `jiraLimit` y `jiraStartAt`. Los resultados paginados devuelven `pagination.startAt`, `pagination.maxResults`, `pagination.total` y `pagination.isLast`.
- **List Attachments** obtiene primero todos los archivos adjuntos de la emisión y luego divide el resultado en el lado del cliente. Los campos de paginación siguen describiendo la página devuelta, pero las emisiones grandes pueden incurrir en un coste de obtención adicional.
- **List Transitions** no pagina.
## Campos clave

| Campo | Utilizado por | Notas |
| --- | --- | --- |
| `credentialId` | Todas las operaciones | UUID de la credencial de Jira propia |
| `jiraOperation` | Todas las operaciones | Valor predeterminado: `searchIssues` |
| `jiraProjectKey` | Create Issue | Clave de proyecto, por ejemplo `ENG` |
| `jiraIssueKey` | Operaciones de issue, comentario, adjunto, notificación y transición | Clave de issue, por ejemplo `ENG-123`, o ID numérico del issue |
| `jiraIssueType` | Create Issue | Valor predeterminado: `Task` |
| `jiraIssueTypeId` | Create Issue | ID de tipo de issue opcional; anula `jiraIssueType` cuando se establece |
| `jiraSummary` | Create/Update Issue | Obligatorio para Create Issue |
| `jiraDescription` | Create/Update Issue | Se envía como ADF en REST API v3 o como texto sin formato en REST API v2; utilice `null` en la actualización para borrar la descripción |
| `jiraJql` | Search Issues | Valor predeterminado: `updated >= -30d ORDER BY updated DESC` |
| `jiraFields` | Search Issues | Array JSON opcional o campos de issue separados por comas; cuando está vacío, el valor predeterminado es `key`, `summary`, `status`, `assignee` e `issuetype` |
| `jiraAssigneeAccountId` | Create/Update Issue | accountId de Jira Cloud o nombre de usuario de Data Center / Server; utilice `null` en la actualización para borrar el asignado |
| `jiraLabels` | Create/Update Issue | Array JSON o texto separado por comas |
| `jiraCommentBody` | Create/Update Comment | Se envía como ADF en REST API v3 o como texto sin formato en REST API v2 |
| `jiraCommentId` | Get/Update/Delete Comment | ID del comentario de Jira |
| `jiraTransitionId` | Transition Issue | Descúbralo con List Transitions |
| `jiraAttachmentId` | Get/Delete Attachment | ID del adjunto de Jira |
| `jiraAttachmentFilename` | Add Attachment | Nombre de archivo cargado |
| `jiraAttachmentBase64` | Add Attachment | Contenido base64 sin procesar o data URL; sujeto al límite de tamaño de archivo |
| `jiraAttachmentMimeType` | Add Attachment | Tipo MIME opcional; se infiere del nombre de archivo cuando está vacío |
| `jiraIncludeBinary` | Get/List Attachment | Alternador booleano; agrega `content_base64` cuando está habilitado |
| `jiraNotifySubject` | Notify Issue | Asunto de notificación obligatorio |
| `jiraNotifyTextBody` | Notify Issue | Cuerpo de notificación en texto sin formato obligatorio |
| `jiraNotifyHtmlBody` | Notify Issue | Cuerpo HTML opcional |
| `jiraNotifyTo` | Notify Issue | JSON de destinatarios; valor predeterminado: `{"assignee":true}` |
| `jiraAccountId` | Get/Delete User | accountId de Jira Cloud o nombre de usuario de Data Center / Server |
| `jiraUserEmail` | Create User | Dirección de correo electrónico del nuevo usuario |
| `jiraUsername` | Create User | Nombre de usuario opcional de Data Center / Server; recurre a `jiraUserEmail` |
| `jiraUserDisplayName` | Create User | Nombre para mostrar opcional |
| `jiraUserProducts` | Create User | Array JSON o claves de producto separadas por comas; solo Jira Cloud |
| `jiraLimit` | Search Issues, List Projects, Get Issue Changelog, List Comments, List Attachments | Valor predeterminado: `50`; rango 1–100 |
| `jiraStartAt` | Search Issues en Data Center / Server, List Projects, Get Issue Changelog, List Comments, List Attachments | Índice de inicio de paginación por desplazamiento |
| `jiraNextPageToken` | Search Issues en Jira Cloud | Token de cursor de una respuesta de búsqueda anterior |

## Ejemplos

Cree un issue a partir de la entrada ascendente:

- Operation: `createIssue`
- Project Key: `ENG`
- Issue Type: `Task`
- Summary: `$input.title`
- Description: `$input.description`
- Labels: `["automation"]`

Actualice un issue y borre el asignado:

- Operation: `updateIssue`
- Issue Key or ID: `ENG-123`
- Summary: `$input.title`
- Assignee Account ID / Username: `null`

Busque issues con campos personalizados y paginación por cursor:

- Operation: `searchIssues`
- JQL: `project = ENG AND updated >= -30d ORDER BY updated DESC`
- Issue Fields: `["key","summary","status"]`
- Limit: `25`
- Next Page Token: `$searchJira.pagination.nextPageToken`

Busque issues en Data Center con paginación por desplazamiento:

- Operation: `searchIssues`
- JQL: `project = ENG ORDER BY updated DESC`
- Limit: `25`
- Start At: `25`

Realice la transición de un issue después de listar las transiciones disponibles:

- Operation: `listTransitions`
- Issue Key or ID: `ENG-123`
- A continuación, ejecute **Transition Issue** con Transition ID: `$listTransitions.transitions[0].id`

Notifique a los observadores sobre una actualización de issue:

- Operation: `notifyIssue`
- Issue Key or ID: `ENG-123`
- Subject: `Issue updated`
- Text Body: `$input.text`
- Recipients JSON: `{"assignee":true,"watchers":true}`
## Salida

Toda operación exitosa establece:

- `$jira.success`
- `$jira.operation`

**Get Myself** expone `user`.

**Las operaciones de listado paginado** exponen `count`, un campo de colección y `pagination`:

| Operación | Clave de colección | Estructura de paginación |
| --- | --- | --- |
| List Projects | `projects` | `{ startAt, maxResults, total, isLast }` |
| Search Issues | `issues` | Cloud: `{ maxResults, nextPageToken, isLast }`; Data Center: `{ startAt, maxResults, total, isLast }` |
| Get Issue Changelog | `changelog` | `{ startAt, maxResults, total, isLast }` |
| List Comments | `comments` | `{ startAt, maxResults, total, isLast }` |
| List Attachments | `attachments` | `{ startAt, maxResults, total, isLast }` |

**List Transitions** expone `transitions` y `count` sin paginación.

**Las mutaciones y lecturas de issues** exponen el payload del issue de Jira más `key` cuando corresponda.

**Comment** get/create/update exponen `comment`; delete expone `deleted`.

**Transition Issue** expone `transition` como `{ transitionId }`, además del `issue` y `key` actualizados.

**Attachment add** expone `attachments` y `count`. **Get Attachment** expone `attachment`; **List Attachments** expone `attachments`, `count` y `pagination`. Cuando **Include Binary** está habilitado, cada objeto de adjunto puede incluir `content_base64`. Delete expone `deleted`.

**User** get/create exponen `user`; delete expone `deleted`.

**Notify Issue** expone `notified`.

Patrones de acceso comunes:

- `$searchJira.issues[0].key`
- `$searchJira.pagination.nextPageToken`
- `$createJiraIssue.key`
- `$listTransitions.transitions[0].id`
- `$getAttachment.attachment.content_base64`

## Relacionado

- [Credentials Tab](../tabs/credentials-tab.md)
- [Third-Party Integrations](../reference/integrations.md#jira)
- [Node Types](../reference/node-types.md)
- [Expression DSL](../reference/expression-dsl.md)
