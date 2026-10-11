# Teams

Los Teams permiten compartir workflows, credenciales, variables globales, almacenes vectoriales y archivos de Drive con un grupo de usuarios a la vez.

## Descripción general

- **Team** – Un grupo con nombre, con un creador y miembros
- **Creador** – Siempre es miembro; puede editar el team, eliminar el team y agregar miembros
- **Miembro** – Puede agregar y eliminar a otros miembros (excepto al creador); tiene acceso a los recursos compartidos con el team

## Creación y gestión de Teams

Cree teams desde la [pestaña Teams](../tabs/teams-tab.md). Agregue miembros por correo electrónico; deben tener una cuenta. El creador no puede ser eliminado. Al eliminar un team se eliminan todos los recursos compartidos con el team.

## Modelo de uso compartido

Los recursos se pueden compartir con:

1. **Usuarios individuales** – Por correo electrónico (uso compartido entre usuarios)
2. **Teams** – Seleccionando un team (uso compartido con el team)

Ambos modelos son aditivos. Un usuario obtiene acceso si:

- Se comparte directamente con él (uso compartido con el usuario), o
- Es miembro de un team con el que se ha compartido el recurso

## Qué se puede compartir con Teams

| Recurso | Ubicación del uso compartido |
|----------|----------------|
| Workflows | Diálogo de uso compartido en el editor de workflows |
| Plantillas de workflow | Diálogo de uso compartido al crear o editar una plantilla de workflow |
| Plantillas de nodos | Diálogo de uso compartido al crear o editar una plantilla de nodo |
| Credenciales | Diálogo de uso compartido en la pestaña Credenciales |
| Variables globales | Diálogo de uso compartido en la pestaña Variables |
| Almacenes vectoriales | Diálogo de uso compartido en la pestaña Vectores |
| Archivos de Drive | Diálogo de uso compartido en la pestaña Drive o en las operaciones `shareWithMyTeams` / `unshareWithMyTeams` del Nodo Drive |

Para las plantillas, cuando la visibilidad es **Usuarios específicos**, también puede seleccionar teams. Todos los miembros de los teams seleccionados obtienen acceso a la plantilla.
El uso compartido de archivos de Drive con teams es de solo lectura para los miembros del team; el propietario del archivo conserva los permisos de gestión.

## Endpoints de la API

- `GET /api/teams` – Lista los teams a los que pertenece el usuario
- `GET /api/teams/{id}` – Obtiene los detalles del team con sus miembros
- `GET /api/teams/{id}/shared-entities` – Devuelve las entidades compartidas con el team (workflows, credenciales, variables globales, almacenes vectoriales, archivos, plantillas de workflow, plantillas de nodos)
- `POST /api/teams` – Crea un team
- `PATCH /api/teams/{id}` – Actualiza un team
- `DELETE /api/teams/{id}` – Elimina un team (solo el creador)
- `POST /api/teams/{id}/members` – Agrega un miembro (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Elimina un miembro

Uso compartido con teams por recurso:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – el body del POST acepta `permission` (`read` o `write`, por defecto `write`); si se publica un team existente de nuevo, se actualiza su permiso
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Relacionado

- [Pestaña Teams](../tabs/teams-tab.md) – Cree y gestione teams
- [Pestaña Plantillas](../tabs/templates-tab.md) – Comparta plantillas de workflow y de nodos con teams
- [Uso compartido de credenciales](./credentials-sharing.md) – Comparta credenciales con usuarios y teams
- [Organización de workflows](./workflow-organization.md) – Carpetas y uso compartido de workflows