# Nodo GitHub

El nodo **GitHub** añade operaciones nativas de la API REST de GitHub a un workflow, de forma similar a los nodos GitHub multioperación que puede conocer de herramientas como n8n.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Credencial | GitHub |
| Salida | `$nodeLabel.*` |

## Operaciones compatibles

El nodo proporciona actualmente 40 acciones:

| Recurso | Acciones |
|----------|---------|
| Repository | `Get Repository`, `Get Repository License`, `Get Repository Profile`, `Get Repository Issues`, `Get Repository Pull Requests`, `List Popular Paths for Repository`, `List Top Referrers for Repository` |
| Organization / User | `List Organization Repositories`, `List User Repositories`, `Get User Repositories`, `Get User Issues`, `Invite User` |
| Issue | `Create Issue`, `Get Issue`, `List Issues`, `Edit Issue`, `Lock Issue`, `Create Comment` |
| Pull request | `Create Pull Request`, `List Pull Requests` |
| Review | `Create Review`, `Get Review`, `List Reviews`, `Update Review` |
| Release | `Create Release`, `Get Release`, `List Releases`, `Update Release`, `Delete Release` |
| Workflow | `List Workflows`, `Get Workflow`, `Enable Workflow`, `Disable Workflow`, `Get Workflow Usage`, `Dispatch Workflow`, `Dispatch Workflow and Wait` |
| File | `Get File`, `List Files`, `Create or Update File`, `Delete File` |

## Credencial

Cree una credencial **GitHub** en la [Pestaña Credenciales](../tabs/credentials-tab.md) con:

- Un token de acceso personal
- URL base completa opcional de la API REST para GitHub Enterprise Server

Deje la URL base vacía para GitHub.com. Se recomiendan los PAT de grano fino.

Para GitHub Enterprise Server, introduzca el endpoint completo de la API REST incluyendo `/api/v3`, como
`https://github.example.com/api/v3`. No introduzca únicamente la raíz de la interfaz web
(`https://github.example.com`).

Si utiliza GitHub Enterprise Server y posteriormente edita la credencial para rotar el token, dejar
`base_url` vacío preserva el endpoint Enterprise existente. Introduzca una nueva URL solo cuando desee
cambiar dicho endpoint.

## Campos comunes

La mayoría de las operaciones utilizan:

- **Owner** – Propietario del repositorio, nombre de la organización o nombre de usuario
- **Repository** – Nombre del repositorio

`List Organization Repositories` solo requiere **Owner** (el nombre de la organización) y no utiliza el campo repository.

`List User Repositories` solo requiere **Owner** (el nombre de usuario) y no utiliza el campo repository.

`Get User Repositories` replica la acción User → Get Repositories de n8n. `Get User Issues` devuelve
las issues asignadas al usuario autenticado de GitHub de forma predeterminada. Establezca **Mentioned Filter** con cualquier
valor no vacío para devolver en su lugar las issues que mencionan al usuario autenticado. También admite
filtros de state, labels, updated-since, sort, direction y per-page. `Invite User` requiere una
organización y una dirección de correo electrónico y no utiliza Owner ni Repository.

## Repository

Las operaciones de Repository incluyen metadatos, contenido de licencia detectado, perfil de salud de la comunidad e
información de tráfico. `List Popular Paths for Repository` y
`List Top Referrers for Repository` devuelven las principales entradas de tráfico de GitHub de los últimos 14 días y
requieren acceso de push de administración del repositorio.

`List Issues` admite filtros opcionales de assignee, creator, mentioned user, labels separadas por comas,
marca de tiempo updated-since, sort y direction. `List Pull Requests` admite controles de state, sort,
direction y per-page.

`Get Repository Issues` y `Get Repository Pull Requests` exponen las mismas API que sus equivalentes List
bajo nombres de acción de repositorio explícitos compatibles con n8n.

### Obtener metadatos de Repository

`Get Repository` almacena la respuesta completa de GitHub en `$github.repository` y también expone
`$github.full_name`, `$github.default_branch`, `$github.private` y `$github.url`.

El payload del repositorio incluye comúnmente:

- Identidad y propiedad: ID, nombre, nombre completo, descripción, owner y visibilidad
- Estado del repositorio: private, fork, archived, disabled y default branch
- URLs: página de GitHub, API, clone, SSH y URLs de Git
- Actividad y tamaño: marcas de tiempo de creación, actualización y push, tamaño, stars, watchers, forks, subscribers e issues abiertas
- Características: issues, projects, wiki, Pages, discussions, topics, language y homepage
- Licencia, configuración de merge, permisos del solicitante, configuración de seguridad y metadatos de fork parent/source cuando estén disponibles

Algunos campos administrativos, de permisos, de merge y de seguridad dependen de los permisos de repositorio
de la credencial.

Ejemplo:

- Owner: `heymrun`
- Repository: `heym`

## Issues

Las operaciones de Issue admiten campos de title/body y campos opcionales de array JSON para labels y assignees.

`List Issues` devuelve únicamente issues del repositorio. Las pull requests se excluyen; utilice `List Pull Requests` para resultados de PR.

```json
["bug", "backend"]
```

```json
["octocat"]
```
### Semántica de los campos de Edit Issue

Para `Edit Issue`, solo se envían a GitHub los campos que usted establezca explícitamente:

- **State** – Seleccione `Don't change`, `Open` o `Closed`. Déjelo sin establecer para mantener el estado actual.
- **State Reason** – De forma opcional, establezca `Completed`, `Not Planned`, `Duplicate` o `Reopened`.
- **Title / Body** – Déjelo en blanco para mantener el valor actual.
- **Labels / Assignees** – Deje el campo vacío para mantener el valor actual. Utilice `[]` para borrar todas las labels o assignees. Utilice un array JSON como `["bug"]` para reemplazarlos.

`Edit Issue` requiere al menos un campo que cambiar en tiempo de ejecución. Si solo proporciona un número de issue, la ejecución falla con un error de validación de la capa de API de GitHub.

## Lock Issue

`Lock Issue` acepta un **Lock reason** opcional. Cuando se proporciona, debe ser uno de los valores admitidos por GitHub:

- `off-topic`
- `too heated`
- `resolved`
- `spam`

Deje el motivo vacío para bloquear sin un motivo específico.

## Pull Requests

Create PR requiere:

- Title
- Head branch
- Base branch
- Body opcional
- Modo draft opcional

## Pull Request Reviews

Las operaciones de revisión coinciden con la API de revisión de pull requests de GitHub:

| Operación | Campos requeridos | Campos opcionales |
|-----------|-----------------|-----------------|
| `Create Review` | Número de pull request, event | Body, commit ID |
| `Get Review` | Número de pull request, review ID | — |
| `List Reviews` | Número de pull request | Per page |
| `Update Review` | Número de pull request, review ID, body | — |

`Create Review` admite `Approve`, `Request Changes`, `Comment` y `Pending`.
El body es obligatorio para `Request Changes` y `Comment`. Cuando Commit ID está vacío, GitHub
revisa el último commit del pull request.

## Releases

| Operación | Campos requeridos en tiempo de ejecución | Habitualmente opcionales |
|-----------|---------------------------|-------------------|
| `Create Release` | Tag name | Release name (title), body, target branch, draft, prerelease |
| `Update Release` | Release ID | Tag name, release name, body, target branch, draft, prerelease |
| `Get Release` / `Delete Release` | Release ID | — |

`Update Release` puede establecer explícitamente `draft` / `prerelease` en `true` o `false`.

## Workflows

Las operaciones de Workflow admiten:

- Listar los workflows del repositorio
- Obtener un workflow por ID numérico o por nombre de archivo de workflow
- Habilitar o deshabilitar un workflow
- Leer el uso facturable del workflow por sistema operativo del runner
- Despachar un workflow con un ref o branch más un objeto JSON de inputs opcional

GitHub está en proceso de cerrar el endpoint `Get Workflow Usage`. Los Workflows que utilicen
esta operación pueden necesitar migrar cuando GitHub elimine el endpoint.

`Dispatch Workflow` acepta ambas formas de respuesta de GitHub: la heredada `204 No Content` y la más reciente
`200` que contiene `workflow_run_id`, `run_url` y `html_url`.

`Dispatch Workflow and Wait` despacha el workflow y consulta la ejecución periódicamente hasta que su estado sea
`completed`. Configure el timeout y el intervalo de sondeo en segundos. Heym utiliza
`workflow_run_id` cuando GitHub devuelve la respuesta más reciente `200`. Para la respuesta tradicional `204 No
Content`, Heym descubre la ejecución `workflow_dispatch` recién creada para el workflow y el ref seleccionados, y luego espera a esa ejecución.

## File Contents

`Get File` lee un archivo del repositorio a través de la API de contents de GitHub y decodifica el contenido de texto cuando está disponible. Los archivos binarios y el contenido que no esté en UTF-8 pueden devolver metadatos sin un campo `content` decodificado.

`List Files` devuelve las entradas de directorio de la API de contents del repositorio para una ruta de carpeta dada y un ref opcional. Deje **Directory Path** vacío para listar la raíz del repositorio.

`Create or Update File` escribe contenido de texto en una ruta del repositorio utilizando:

- File path
- Commit message
- File content
- Branch opcional

`Delete File` elimina una ruta del repositorio utilizando un commit message y un branch opcional. Si el archivo existe, Heym obtiene el SHA actual automáticamente antes de eliminarlo.

Si el archivo ya existe, Heym obtiene el SHA actual automáticamente antes de actualizarlo.

## Paginación

`List Issues`, `Get Repository Issues`, `Get User Issues`, `List Pull Requests`,
`Get Repository Pull Requests`, `List Reviews`, `List Releases`, `List Workflows`,
`List Organization Repositories`, `List User Repositories` y `Get User Repositories` admiten
**Per Page** (1–100). Heym solicita una página de resultados; no hay un campo `page` para obtener
páginas adicionales en la misma operación.

### Return all pages

Active **Return all pages** para que una ejecución recorra todas las páginas, empezando en **Cursor** si está definido. Cada solicitud pide 100 elementos, sin importar el valor de **Per Page**. El nodo se detiene tras unos 1.000 elementos (o 100 solicitudes): los objetos issue pesan unos 6 KB cada uno, por lo que un límite mayor generaría salidas de nodo muy grandes. Si se detiene antes, devuelve lo obtenido con `has_more: true` y un `next_cursor` en lugar de lanzar un error, y puede continuar pasando ese cursor a la siguiente ejecución. Detener el workflow o alcanzar su tiempo de espera finaliza la obtención entre páginas.

## Salida

La forma exacta depende de la operación seleccionada. Los campos comunes incluyen:

- `$github.success`
- `$github.operation`
- `$github.repository`
- `$github.license`
- `$github.profile`
- `$github.paths`
- `$github.referrers`
- `$github.issue`
- `$github.issues`
- `$github.pull_request`
- `$github.pull_requests`
- `$github.review`
- `$github.reviews`
- `$github.release`
- `$github.releases`
- `$github.workflow`
- `$github.workflows`
- `$github.workflow_run`
- `$github.workflow_run_id`
- `$github.completed`
- `$github.conclusion`
- `$github.usage`
- `$github.billable`
- `$github.invitation`
- `$github.file`
- `$github.items`
- `$github.path`
- `$github.sha`
- `$github.commit_sha`
- `$github.deleted`
- `$github.created`
- `$github.ref`
- `$github.inputs`

Reemplace `github` con la etiqueta de su nodo.

## Notas

- Las etiquetas y los asignados deben ser arrays JSON válidos cuando se proporcionen.
- Las entradas de workflow dispatch deben ser un objeto JSON válido cuando se proporcionen.
- `Edit Issue` utiliza `state` solo cuando usted lo establece explícitamente; déjelo sin establecer para mantener el estado actual de la incidencia.
- Los permisos de la API de GitHub dependen de los alcances del token o de los permisos granulares del repositorio que usted otorgue.

## Relacionado

- [Pestaña Credenciales](../tabs/credentials-tab.md) – Agregue y administre credenciales de GitHub
- [Integraciones de terceros](../reference/integrations.md) – Configuración de credenciales de GitHub y `base_url` de Enterprise
- [Nodo Agent](./agent-node.md) – Utilice credenciales de GitHub con `@modelcontextprotocol/server-github`
- [Tipos de nodo](../reference/node-types.md) – Catálogo completo de nodos
