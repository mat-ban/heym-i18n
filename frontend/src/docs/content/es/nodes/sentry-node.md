# Nodo Sentry

Utilice el nodo Sentry para automatizar operaciones de organización, proyecto, equipo, issue, evento y release de Sentry desde un workflow.

## Credencial

Cree una credencial de **Sentry** con un token de autenticación. Deje la Base URL vacía para Sentry SaaS, o establezca la URL raíz para una instancia de Sentry autoalojada.

## Operaciones

- `createProject`, `createRelease`, `createTeam`
- `deleteIssue`, `deleteProject`, `deleteRelease`, `deleteTeam`
- `getEvent`, `getIssue`, `getProject`, `getRelease`
- `listEvents`, `listIssues`, `listOrganizations`, `listProjects`, `listReleases`, `listTeams`
- `updateIssue`, `updateOrganization`, `updateProject`, `updateRelease`, `updateTeam`

`createIssue` y `createOrganization` no están expuestas porque Sentry no documenta endpoints REST públicos para ellas.

## Campos comunes

| Campo | Descripción |
| --- | --- |
| Credential | Credencial de Sentry a utilizar |
| Operation | Acción de Sentry a ejecutar |
| Organization Slug | Slug de la organización de Sentry para la actualización de organización y las operaciones de proyecto, equipo, issue, evento y release |
| Project Slug | Slug del proyecto para las operaciones get/update/delete de proyecto y las operaciones de evento; slug o ID del proyecto para los filtros de issue |
| Team Slug | Slug del equipo para la creación de proyecto y las operaciones update/delete de equipo |
| Issue ID | ID del issue para las operaciones get/update/delete de issue |
| Event ID | ID del evento para las operaciones de consulta de evento |
| Release Version | Versión del release para las operaciones get/update/delete de release |
| Name | Nombre del proyecto o equipo para las operaciones de creación |
| Slug | Slug opcional del proyecto o equipo para las operaciones de creación |
| Platform | Plataforma de Sentry opcional para la creación de proyecto |
| Status / Assigned To | Campos de actualización de issue. Se requiere al menos uno para `updateIssue` |
| Query | Consulta de búsqueda de Sentry. Omítala para issues no resueltos, o establézcala en una cadena vacía para obtener todos los issues |
| Limit | Límite de resultados para las operaciones de listado, con un máximo de 1.000 resultados totales |
| Release Projects JSON | Array JSON de slugs de proyecto para la creación de release |
| Release Refs JSON | Array JSON de objetos repositorio/commit para la creación de release |
| Payload JSON | Objeto JSON para las operaciones update de organización, proyecto, release y equipo |

## Ejemplos

Listar issues no resueltos:

```json
{
  "sentryOperation": "listIssues",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryQuery": "is:unresolved level:error",
  "sentryStatsPeriod": "14d",
  "sentryLimit": "25"
}
```

Resolver un issue:

```json
{
  "sentryOperation": "updateIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id",
  "sentryStatus": "resolved"
}
```

Eliminar un issue:

```json
{
  "sentryOperation": "deleteIssue",
  "sentryOrganizationSlug": "acme",
  "sentryIssueId": "$input.issue_id"
}
```

Crear un release:

```json
{
  "sentryOperation": "createRelease",
  "sentryOrganizationSlug": "acme",
  "sentryReleaseVersion": "web-app@1.2.3",
  "sentryReleaseProjects": "[\"web-app\"]"
}
```

Actualizar un proyecto:

```json
{
  "sentryOperation": "updateProject",
  "sentryOrganizationSlug": "acme",
  "sentryProjectSlug": "web-app",
  "sentryPayload": "{\"name\":\"Web App\"}"
}
```

## Salidas

Las operaciones de listado devuelven `success`, `operation`, `count` y la colección correspondiente, como `organizations`, `projects`, `teams`, `issues`, `events` o `releases`. Las operaciones sobre un único recurso devuelven `organization`, `issue`, `event`, `release`, `project` o `team`. Las operaciones de eliminación devuelven la clave del recurso correspondiente con `deleted: true` y los campos identificativos.