# Pestaña Logs

La pestaña **Logs** muestra los logs de los contenedores Docker del stack de Heym. Utilícela para depuración, monitoreo y resolución de problemas. Para los logs de ejecución de Workflows (resultados de nodos, salidas), utilice el panel Debug del editor de Workflows—consulte [Canvas Features](../reference/canvas-features.md#execution-logs).

Los logs respaldados por Docker están deshabilitados por defecto en despliegues autoalojados. Para habilitarlos, establezca `DOCKER_LOGS_ENABLED=true`, configure `DOCKER_LOGS_ALLOWED_EMAILS` con una lista separada por comas de correos de usuarios de confianza autorizados a acceder a los logs de Docker, y asegúrese de que `/var/run/docker.sock` esté montado en el contenedor del backend. El servicio Docker Compose por defecto y el ejemplo directo de `docker run` incluyen ese montaje para las herramientas MCP stdio basadas en Docker; consérvelo únicamente cuando acepte el límite de confianza del socket de Docker.

Si el registro está abierto, cree la cuenta de administrador de confianza antes de habilitar los logs de Docker o mantenga `ALLOW_REGISTER=false`; de lo contrario, un autorregistro no verificado podría reclamar un correo incluido en la lista de permitidos.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Ver demo de Logs</a></p>

## Selección de contenedor

- **All Containers** – Logs combinados del backend, frontend y PostgreSQL
- **Backend** – Contenedor `heym-backend`
- **Frontend** – Contenedor `heym-frontend`
- **PostgreSQL** – Contenedor `heym-postgres`

## Filtro de nivel de log

- **All** – Mostrar todos los niveles de log
- **INFO** – INFO y superiores
- **WARNING** – Advertencias y errores
- **ERROR** – Solo errores
- **DEBUG** – Debug y superiores

## Búsqueda

- Filtrar logs por búsqueda de texto
- Las coincidencias se resaltan en la salida de logs

## Funcionalidades

- **Auto scroll** – Desplazarse al final a medida que llegan nuevos logs
- **Stream** – Transmitir logs en tiempo real (cuando sea compatible)
- **Copy** – Copiar logs al portapapeles
- **Download** – Descargar logs como archivo

## Casos de uso

- Depurar fallos en la ejecución de Workflows
- Inspeccionar los logs de solicitudes/respuestas de la API
- Monitorear consultas a la base de datos
- Verificar mensajes de inicio y de estado

## Relacionado

- [Canvas Features](../reference/canvas-features.md) – Logs de ejecución en el panel Debug del Workflow
- [Pestaña Traces](./traces-tab.md) – Inspección de trazas LLM
- [Pestaña Analytics](./analytics-tab.md) – Métricas de ejecución
- [Pestaña Workflows](./workflows-tab.md) – Gestión de Workflows
- [Contextual Showcase](../reference/contextual-showcase.md) – Guía compacta de páginas para las superficies del dashboard
