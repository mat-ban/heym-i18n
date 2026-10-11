# Pestaña Scheduled

La pestaña **Scheduled** muestra todos los workflows de cron activos en un calendario visual. Cambie entre las vistas de día, semana y mes para ver cuándo están programadas sus automatizaciones.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Ver la demo de Scheduled</a></p>

## Vistas

- **Day** – Cronología hora a hora del día seleccionado; cada ocurrencia aparece como un bloque en su hora programada
- **Week** – Cuadrícula de siete columnas que abarca la semana actual; los bloques se apilan cuando varios workflows se ejecutan a la misma hora
- **Month** – Cuadrícula del mes completo; cada celda enumera los workflows programados para ejecutarse ese día

## Bloques de workflow

Cada bloque muestra:

- **Nombre del workflow** – Haga clic para abrir directamente el canvas del workflow
- **Expresión cron** – Visible al pasar el cursor, mostrando la programación sin procesar (por ejemplo, `0 9 * * 1-5`)

## Navegación

Los administradores de la instancia incluidos en `HEYM_ADMIN_EMAILS` ven las programaciones de todos los propietarios cuando la opción **Show all workflows** está marcada. Desmárquela para ver únicamente sus propios workflows. Los demás usuarios conservan la opción **Show shared with me**. Para retirar la automatización de un empleado, utilice los [controles de administración de la instancia](./workflows-tab.md#instance-administration) en la vista previa de Workflows para pausar o reanudar los triggers.

- Utilice las flechas **previous / next** para desplazarse entre días, semanas o meses
- El botón **Today** vuelve a la fecha actual al instante

## Relacionado

- [Nodo Cron](../nodes/cron-node.md) – Configure triggers programados en el canvas
- [Pestaña Workflows](./workflows-tab.md) – Gestione y organice todos los workflows
- [Pestaña Analytics](./analytics-tab.md) – Métricas de ejecución y tendencias
