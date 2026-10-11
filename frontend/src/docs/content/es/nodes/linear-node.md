# Nodo Linear

El nodo **Linear** conecta los workflows con la API GraphQL de Linear para la automatización de issues y espacios de trabajo.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Credencial | API key personal de Linear u OAuth2 |
| Salida | `$nodeLabel.*` |

## Credencial

Cree una credencial **Linear** en la [Pestaña Credenciales](../tabs/credentials-tab.md). Elija uno de los
modos de autenticación:

**API key personal**

1. En Linear, abra **Settings → Security & Access → Personal API keys**.
2. Cree una key con acceso al espacio de trabajo que desea automatizar.
3. Pegue la key en una nueva credencial Linear en Heym y use **Test Connection** para verificarla.

**OAuth2**

1. Cree una aplicación OAuth de Linear.
2. Registre `{FRONTEND_URL}/api/credentials/linear/oauth/callback` como URI de redirección.
3. En Heym, elija **OAuth2**, introduzca el Client ID y el Client Secret, y luego haga clic en **Connect**.

Las API keys personales y los tokens OAuth actúan como el usuario que los creó o autorizó.

## Operaciones

| Operación | Campos obligatorios | Salida |
|-----------|-----------------|--------|
| Get Viewer | — | `viewer` |
| List Teams | Limit; opcional After Cursor | `teams`, `count`, `pageInfo` |
| List Projects | Limit; opcional After Cursor | `projects`, `count`, `pageInfo` |
| List Issues | Limit; opcional Team ID, Project ID, After Cursor | `issues`, `count`, `pageInfo` |
| List Workflow States | Team ID | `states`, `count` |
| List Team Members | Team ID, Limit; opcional After Cursor | `members`, `count`, `pageInfo` |
| Get Issue | Issue ID o identificador como `ENG-123` | `issue`, `identifier`, `url` |
| Create Issue | Team ID, Title | `issue`, `identifier`, `url` |
| Update Issue | Issue ID o identificador y al menos un campo modificado | `issue`, `identifier`, `url` |
| Delete Issue | Issue ID o identificador | `deleted` |
| Add Issue Link | Issue ID o identificador, Link URL | `link` |
| Create Comment | Issue ID o identificador, Comment Body | `comment` |
| List Comments | Issue ID o identificador, Limit; opcional After Cursor | `comments`, `count`, `pageInfo` |
| Update Comment | Comment ID, Comment Body | `comment` |
| Delete Comment | Comment ID | `deleted`, `entityId` |
| Resolve Comment | Comment ID | `comment` |
| Unresolve Comment | Comment ID | `comment` |

Todos los campos de texto admiten [expresiones](../reference/expression-dsl.md).

## Campos de issue

- **Team ID** y **Project ID** son UUID de Linear. Use List Teams o List Projects para descubrirlos.
- **State ID** es el UUID del estado del workflow que se utiliza al crear o actualizar un issue. Use List Workflow States para descubrirlo.
- **Assignee ID** es un UUID de usuario de Linear. Use List Team Members para descubrirlo.
- **Priority** acepta valores de `0` a `4`: sin prioridad, urgente, alta, normal y baja.
- Deje vacíos los campos opcionales de actualización para conservar sus valores actuales.
- Establezca un campo de actualización en `null` para borrar la descripción, el proyecto, el asignado o el estado.
- **Link URL** agrega un enlace de adjunto externo a un issue.
- **Comment ID** es el UUID de Linear de un comentario existente. Use List Comments para descubrirlo.
- **Parent Comment ID** responde a un comentario existente de Linear al crear un comentario.

## Paginación

Las operaciones de listado pueden devolver una sola página o recuperar automáticamente todas las páginas:

- Deje **Return All** desactivado para usar `Limit` y `After Cursor` manualmente.
- Active **Return All** para seguir los cursores de Linear del lado del servidor, hasta 10.000 resultados.

Los resultados paginados devuelven `pageInfo.hasNextPage` y `pageInfo.endCursor`. Pase el cursor en
**After Cursor** en la siguiente ejecución del nodo para recuperar la página siguiente cuando **Return All** esté desactivado.

## Ejemplos

Crear un issue a partir de la entrada de un nodo anterior:

- Operation: `Create Issue`
- Team ID: `team UUID`
- Title: `$input.title`
- Description: `$input.description`
- Priority: `2`

Agregar un comentario a un issue creado:

- Operation: `Create Comment`
- Issue ID: `$createLinearIssue.issue.id`
- Comment Body: `$input.comment`
- Parent Comment ID: opcional, cuando se responde a otro comentario

Resolver un hilo de comentarios:

- Operation: `Resolve Comment`
- Comment ID: `$listComments.comments[0].id`

Agregar un enlace externo a un issue:

- Operation: `Add Issue Link`
- Issue ID: `$createLinearIssue.issue.id`
- Link URL: `$input.url`

Paginar a través de los miembros del equipo:

- Operation: `List Team Members`
- Team ID: `$listTeams.teams[0].id`
- Limit: `50`
- After Cursor: `$listTeamMembers.pageInfo.endCursor` en la siguiente ejecución cuando `hasNextPage` sea true

Descubrir los IDs de los estados del workflow antes de actualizar un issue:

- Operation: `List Workflow States`
- Team ID: `$listTeams.teams[0].id`
- Luego use `$listStates.states[0].id` como **State ID** en **Update Issue**
## Salida

Cada operación exitosa establece:

- `$linear.success`
- `$linear.operation`

Las operaciones de listado también exponen `count` y, cuando corresponde, `pageInfo`. Las operaciones de incidencias exponen el payload completo de la incidencia de Linear y campos de conveniencia como `identifier` y `url`.
Las mutaciones de comentarios exponen el payload completo de `comment`, excepto Delete Comment, que expone `deleted` y `entityId`.

## Relacionado

- [Pestaña Credenciales](../tabs/credentials-tab.md)
- [Tipos de nodo](../reference/node-types.md)
- [DSL de expresiones](../reference/expression-dsl.md)
