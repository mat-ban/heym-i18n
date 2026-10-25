# Historial de ejecuciones

El historial de ejecuciones registra las ejecuciones de los workflows: entradas, salidas, resultados de los nodos, estado y origen del trigger. Utilícelo para supervisar una ejecución de producción activa, inspeccionar ejecuciones anteriores, depurar fallos o volver a ejecutar con las mismas entradas mediante **Bring to Canvas**.

## Descripción general

Cada ejecución almacena:

| Campo | Descripción |
|-------|-------------|
| **Inputs** | Cuerpo de la solicitud o entradas de la ejecución (p. ej. `text` para el Nodo de entrada) |
| **Outputs** | Salidas a nivel de workflow |
| **Node results** | Salidas por nodo, estado y tiempo de ejecución |
| **Status** | `success`, `error`, `pending`, `skipped` o `failed` (consulte [Recuperación ante fallos](#crash-recovery)) |
| **trigger_source** | Cómo se activó la ejecución (consulte [Triggers](./triggers.md)) |

## Acceso al historial

| Ubicación | Alcance |
|----------|-------|
| Barra de herramientas del **Editor** | Solo el workflow actual |
| Encabezado de la vista **Docs** | Solo el workflow actual |
| Encabezado del **Dashboard** (pestaña Chat) | Todos los workflows + ejecuciones de chat/asistente |
| Encabezado de la vista **Evals** | Todos los workflows + ejecuciones de chat/asistente |

Haga clic en el botón **History** (icono de reloj) para abrir el cuadro de diálogo.

## Historial por workflow vs. historial completo

- **Por workflow** (Editor, Docs): Muestra las ejecuciones del workflow que tiene abierto. Utilice **Clear history** para eliminar las ejecuciones únicamente de ese workflow.
- **All History** (Dashboard, Evals): Muestra las ejecuciones de todos los workflows y sesiones de chat/asistente. La cobertura coincide con el acceso a los workflows: workflows de su propiedad, workflows compartidos directamente con usted y workflows compartidos con un equipo al que pertenece. Utilice **Clear all history** para eliminar todos los registros de su propiedad. El historial de los workflows compartidos se conservará.

## Bring to Canvas

**Bring to Canvas** carga las entradas y las salidas de los nodos de una ejecución seleccionada en el workflow actual.

### Qué carga

- **Inputs** → Panel de entrada de la ejecución (p. ej. `text` para el Nodo de entrada, o campos personalizados)
- **Node results** → El panel de resultados de ejecución muestra las salidas anteriores por nodo
- **Execution result** → Estado, salidas y tiempos de la ejecución

### Comportamiento según el contexto

- **En el Editor** (historial por workflow): Se aplica inmediatamente al workflow abierto y cierra el cuadro de diálogo.
- **Desde All History** (Dashboard/Evals): Navega al editor del workflow y, a continuación, aplica los datos cuando se carga el editor. Solo está disponible para ejecuciones de workflows, no para ejecuciones de chat/asistente.

### Enlace directo a la ejecución

Abrir un workflow en `/workflows/{workflowId}/{executionId}` trae automáticamente esa ejecución al canvas, igual que seleccionar la ejecución y elegir **Bring to Canvas**. Esto permite compartir una ejecución pasada concreta como URL. Si no se encuentra la ejecución (id incorrecto o eliminado), el editor recurre a cargar el workflow sin más.

### Casos de uso

- Volver a ejecutar un workflow con las mismas entradas
- Depurar una ejecución fallida inspeccionando las entradas y las salidas de los nodos
- Comparar salidas entre ejecuciones

## Preguntar a la IA

Ambos cuadros de diálogo de historial tienen un botón **Preguntar a la IA** (icono de destello) junto a su título. Abre la [pestaña Chat](../tabs/chat-tab.md#asking-about-a-run) en una nueva conversación con el workflow y la ejecución seleccionada adjunta como chips extraíbles. Pregunte por qué la ejecución fue lenta, qué falló o pida a Chat que corrija el workflow. Chat lee esa ejecución exacta, incluida su traza y errores por nodo.

En el cuadro de diálogo All History, **Preguntar a la IA** aparece solo mientras se selecciona una ejecución de workflow; las ejecuciones de chat y asistente no lo muestran.

## Línea de tiempo de ejecución

En el detalle de la ejecución, el botón **Línea de tiempo** (icono de temporizador) junto a **Expandir todo** cambia la lista **Pasos** por una línea de tiempo de spans. Mientras se muestra la línea de tiempo, el mismo botón indica **Registros**; haga clic en él para volver a la lista. En All History el botón aparece solo para ejecuciones de workflow. La línea de tiempo dibuja una barra por nodo en el momento en que se inició, para ver qué nodo tardó cuánto tiempo y cuáles se ejecutaron en paralelo. Pase el cursor sobre una barra para ver su duración; haga clic en ella para abrir el mismo inspector de detalles que la [línea de tiempo de ejecución](#execution-timeline-details) del editor. La vista elegida se mantiene mientras el diálogo está abierto.

Las ejecuciones registradas antes de que se almacenaran los tiempos de inicio de los nodos se disponen una tras otra por duración.

## Execution Highlights

Tras una ejecución en vivo —o tras **Bring to Canvas**— aparece un popup descartable de **Execution Highlights** en la **esquina superior derecha del Canvas**. Es una forma rápida de ver *qué produjo cada nodo*, listado de arriba a abajo en orden de ejecución. Ciérrelo con la **✕**; se reabrirá en la siguiente ejecución.

### Qué se muestra

| Registro | Origen | ¿Automático? |
|--------|--------|-------|
| **Input** | Los parámetros de entrada de la ejecución (nodo de entrada/trigger) | Sí |
| **Output** | El resultado del nodo de salida — o, si no hay ninguno, el mensaje del último nodo | Sí |
| **Agent / LLM** | La salida de cada nodo de agente o LLM | Sí |
| **Output** | Cualquier otro nodo con **Highlight Node Output** activado | Opcional |

Los nodos que ya se destacan automáticamente (input / output / last / agent / llm) nunca aparecen dos veces, aunque también active la opción.

### Cada registro

- Muestra `Node — message…` con los primeros **250 caracteres**; haga clic en una fila para expandirla y renderizar el **mensaje completo como Markdown**, con un botón **Copy**.
- Un nodo que se ejecutó varias veces (p. ej. dentro de un bucle) muestra `Node (N)` con un selector `‹ i / N ›` — elija qué ejecución ver; el selector de cada nodo es independiente.

### Highlight Node Output

Todos los nodos **excepto Agent y LLM** tienen una casilla **Highlight Node Output** en su panel de propiedades (desactivada por defecto). Actívela para añadir la salida de ese nodo al popup. Aparece una pequeña insignia ✦ en los nodos destacados del canvas. En el [workflow DSL](./expression-dsl.md) este es el campo de datos del nodo `"highlight": true` (por defecto `false`).

### En los dashboards

Las tarjetas de widget del Dashboard que ejecutaron un workflow muestran un botón ✦ **Execution highlights** en el encabezado de la tarjeta; haga clic en él para abrir el mismo popup correspondiente a la ejecución de ese widget, con la salida dibujada por el widget como registro destacado.

## Ejecuciones en curso

Ambos diálogos de historial muestran las **ejecuciones en curso** en la parte superior de la lista, antes de las ejecuciones anteriores.

- Aparece un indicador giratorio y la etiqueta **Running** junto con la hora de inicio
- Haga clic en **Open live** para vincular el editor a esa ejecución exacta sin reiniciarla
- El canvas primero restaura los nodos que ya se han completado y, a continuación, recibe los eventos `node_start`, `node_complete` y de ejecución final a través de SSE
- El nodo actual pulsa en el canvas, los nodos posteriores mantienen su animación pendiente y el panel Debug añade cada resultado a medida que llega, igual que en una ejecución iniciada desde el editor
- Haga clic en **Cancel** para detener la ejecución de inmediato
- Cancelar desde cualquier diálogo (Editor o Dashboard) también cierra el stream SSE activo en cualquier pestaña del canvas abierta para ese workflow, de modo que el estado del editor se restablece limpiamente
- Tras la cancelación, la entrada en ejecución desaparece en el siguiente refresco; pulse **Refresh** para actualizar la lista manualmente
- Si cancela una ejecución que ya ha finalizado, la solicitud no tiene efecto

Las ejecuciones que esperan un [slot de concurrencia](./webhooks.md#concurrency-limit-and-queued-runs) se muestran en la misma sección con la etiqueta **Queued 2/5**, su lugar en la cola y el tamaño de la misma. No tienen botón **Open live** porque todavía no hay nada en ejecución; **Cancel** elimina una ejecución en espera de la cola y la registra como `cancelled`. Una ejecución que esperó más tiempo del máximo configurado en el workflow se registra como `expired`, y una rechazada por cola llena como `queue_full`; ambas tienen su propia insignia en la lista de ejecuciones.

La URL en vivo es `/workflows/{workflowId}/{executionId}`. El observador es de solo lectura: salir del editor únicamente desconecta esa pestaña del navegador y nunca detiene el workflow. Las instantáneas activas se comparten a través de PostgreSQL, por lo que abrir una ejecución sigue funcionando cuando el trigger y la solicitud del editor llegan a workers de backend distintos.

## Recuperación ante fallos

Si el servidor se reinicia (despliegue, reinicio de contenedor o fallo) mientras un workflow está en ejecución, el worker de esa ejecución se detiene a mitad de la misma. Heym recupera automáticamente estas ejecuciones interrumpidas en lugar de dejarlas atascadas como **Running**.

- En el siguiente arranque, el proceso líder electo detecta las ejecuciones huérfanas —de forma instantánea en un reinicio ordenado, o en unos 60 segundos en un fallo abrupto (una vez que los heartbeats cesan claramente).
- Las ejecuciones recuperadas se **vuelven a ejecutar desde cero con las mismas entradas** (no se reanudan desde donde se detuvieron), utilizando la definición actual del workflow. Al completarse, registran una entrada terminal normal (por ejemplo, `success`), de modo que el historial muestra la ejecución como completada.
- Una ejecución se reintenta **una vez**. Si el intento de recuperación también se interrumpe —o el workflow se ha eliminado entretanto—, la entrada se registra como `failed`.
- Esto funciona igual en un único contenedor y en despliegues con múltiples workers; solo el líder realiza la recuperación, por lo que una ejecución nunca se recupera dos veces por workers distintos.

### Alternancia de recuperación automática

El panel **Execution Log** (ejecución) del editor incluye una casilla **Auto-recover**, **activada por defecto** por workflow.

- **Activada**: las ejecuciones interrumpidas de este workflow se vuelven a ejecutar como se describe arriba.
- **Desactivada**: las ejecuciones interrumpidas no se vuelven a ejecutar y se registran con el estado `skipped`.

> Las ejecuciones de sub-workflows no se recuperan de forma independiente: son reimpulsadas por su ejecución padre recuperada. Los triggers con su propia reentrega (RabbitMQ, programado/cron, IMAP) también pueden reentregar al reiniciar, por lo que una ejecución recuperada puede ocasionalmente ejecutarse dos veces.

## Revisión humana pendiente

Las ejecuciones que se pausan para la aprobación de [Human-in-the-Loop](./human-in-the-loop.md) se escriben en el historial de inmediato con el estado `pending`.

- El nodo de agente pendiente almacena un payload de revisión que incluye `reviewUrl`, `draftText` y `expiresAt`
- Cualquier nodo conectado al handle `review` del agente también puede ejecutarse antes de que el humano responda, y sus resultados de nodo se almacenan en la misma entrada de historial pendiente
- Los diálogos de historial muestran el enlace de revisión para que los propietarios puedan copiarlo o abrirlo
- Los diálogos de historial y el panel Debug del editor muestran la decisión humana final una vez que la ejecución se reanuda
- Cuando un revisor acepta, edita o rechaza el borrador, la misma entrada de historial se actualiza con el resultado final de la ejecución
- Si la misma ejecución se pausa para HITL más de una vez, la entrada de historial permanece igual mientras que cada checkpoint obtiene su propio enlace de revisión de un solo uso

Esto resulta especialmente útil para ejecuciones de portal y workflows de larga duración que pueden esperar horas o días antes de continuar.

## Copiar

Use **Copy** junto a Inputs u Outputs para copiar el JSON al portapapeles.

## Borrar historial

- **Por workflow**: en el diálogo de historial del Editor, haga clic en **Clear history** para eliminar las ejecuciones del workflow actual.
- **Todo el historial**: en el diálogo de historial del Dashboard/Evals, haga clic en **Clear all history** para eliminar todos los registros de ejecución de su propiedad. Las ejecuciones de workflows compartidos se conservan. Esta acción no se puede deshacer.

## Detalles de la línea temporal de ejecución

Cuando el **Execution Log** del editor esté abierto, haga clic en el botón del temporizador para mostrar la línea temporal de ejecución. Seleccione un intervalo para abrir un inspector de detalles en línea que ocupa el área de las filas. Muestra el estado del paso seleccionado, la duración, el número de intentos, la información de reintento, los errores, el trace ID y una vista previa compacta de la salida. Las salidas de tipo objeto y array utilizan el mismo visor `JsonTree` que el resto del panel Debug; los valores escalares usan una vista previa de texto. Cuando un paso genera imágenes (capturas de pantalla de Playwright, imágenes generadas, archivos de imagen o imágenes en base64 en el cuerpo de una solicitud, encontradas en cualquier parte de la salida), aparecen como miniaturas sobre la salida, y el JSON muestra un marcador de posición breve en lugar del base64 sin procesar. Haga clic en una miniatura para abrirla en un lightbox; los botones de flecha o las teclas ←/→ recorren todas las imágenes de la ejecución, con un contador como `2 / 5`. Use **Open trace** para los spans de LLM y Agent cuando haya un trace ID disponible.

## Detalle del nodo en móvil

En un teléfono, el editor muestra un árbol de workflow a pantalla completa en lugar del canvas de forma libre. Toque un nodo del árbol con un resultado registrado para abrir su ejecución como detalle a pantalla completa. La vista proporciona pestañas separadas de **Datos de entrada**, **Datos de salida** y **Errores**. La pestaña de salida muestra el resultado registrado y ofrece **Copiar salida**; la pestaña de entrada muestra la configuración del nodo seleccionado, y la pestaña de errores muestra el error registrado cuando el nodo falló. Use **Volver al workflow** o el botón de cierre para regresar al árbol.

Los diálogos de historial del canvas y del panel conservan sus controles de ejecución en una sola fila y colocan los filtros disponibles de etiquetas e instancias en una cuadrícula adaptable. Sus menús de filtros usan el mismo selector integrado, de modo que la marca de verificación seleccionada mantiene un margen y una línea base consistentes con cada etiqueta de opción.

## Relacionado

- [Triggers](./triggers.md) – Cómo se inician los workflows; el historial registra `trigger_source` (incluido `board` para las ejecuciones iniciadas por movimientos de tarjetas y seguimientos de [Board](../tabs/board-tab.md))
- [Human-in-the-Loop](./human-in-the-loop.md) – URLs de revisión pendientes y comportamiento de reanudación
- [Historial de edición](./edit-history.md) – Control de versiones para los guardados de workflows (revertir, comparar)
- [Inicio rápido](../getting-started/quick-start.md) – Cree y ejecute su primer workflow
- [Pestaña Workflows](../tabs/workflows-tab.md) – Cree y gestione workflows
