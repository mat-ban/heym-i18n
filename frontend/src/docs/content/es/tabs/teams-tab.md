# Pestaña Teams

La pestaña **Teams** permite crear y gestionar equipos para compartir workflows, credenciales, variables, almacenes vectoriales y archivos de Drive con grupos de usuarios.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Ver demostración de Teams</a></p>

## Crear un equipo

1. Haga clic en **New Team**
2. Introduzca un nombre y una descripción opcional
3. Haga clic en **Create**

Usted se convierte automáticamente en el creador del equipo y en su primer miembro.

## Gestionar miembros

- **Añadir miembro** – Introduzca el correo electrónico de un usuario en el diálogo de detalle del equipo y haga clic en **Add**
- **Eliminar miembro** – Haga clic en la X junto a un miembro (el creador no puede eliminarse)
- **Editar equipo** – Los creadores pueden editar el nombre y la descripción
- **Eliminar equipo** – Los creadores pueden eliminar el equipo; se eliminan todos los recursos compartidos con el equipo
- **Recursos compartidos** – El diálogo de detalle del equipo muestra los workflows, credenciales, variables, almacenes vectoriales, archivos de Drive, plantillas de workflow y plantillas de nodo compartidos con el equipo. Haga clic en un workflow para abrirlo en el editor; cambie a la pestaña correspondiente para el resto de recursos.

## Compartir con equipos

Comparta recursos con equipos desde:

- **Workflows** – Diálogo de compartir en el editor de workflows
- **Plantillas de workflow** – Diálogo de compartir al crear o editar una plantilla de workflow (visibilidad: Specific users)
- **Plantillas de nodo** – Diálogo de compartir al crear o editar una plantilla de nodo (visibilidad: Specific users)
- **Credenciales** – Diálogo de compartir en la pestaña Credentials
- **Variables** – Diálogo de compartir en la pestaña Variables
- **Almacenes vectoriales** – Diálogo de compartir en la pestaña Vectors
- **Dashboards** – Configuración del dashboard en la pestaña Dashboard (lectura o escritura)
- **Archivos de Drive** – Diálogo de compartir en la pestaña Drive o en las operaciones `shareWithMyTeams` / `unshareWithMyTeams` del nodo Drive

Cuando comparte con un equipo, todos los miembros del equipo obtienen acceso. Consulte [Teams](../reference/teams.md) para más detalles.

Cuando comparte un workflow con un equipo, comparta también las credenciales y los sub-workflows de los que depende dicho workflow con el mismo equipo. El acceso al workflow por sí solo no otorga acceso a las credenciales ni a los workflows secundarios.

## Integración con Chat

El asistente de IA de la [pestaña Chat](./chat-tab.md) puede listar sus equipos. Pregunte "my teams" para ver a qué equipos pertenece.

## Relacionado

- [Teams](../reference/teams.md) – Referencia de Teams y modelo de compartición
- [Credentials Sharing](../reference/credentials-sharing.md) – Compartir credenciales con usuarios y equipos
- [Workflow Organization](../reference/workflow-organization.md) – Carpetas y compartición
- [Contextual Showcase](../reference/contextual-showcase.md) – Guía compacta de páginas para las superficies del dashboard
