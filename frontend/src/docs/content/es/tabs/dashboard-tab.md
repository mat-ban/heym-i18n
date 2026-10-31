# Dashboard

La pestaña **Dashboard** es un espacio al estilo Grafana donde se construyen cuadrículas de widgets de gráficos. Cada widget se renderiza a partir de la salida de su propio workflow oculto de Heym, de modo que cualquier dato que pueda producirse en un workflow —consultas a bases de datos, llamadas a API, búsquedas RAG, salida de LLM— puede convertirse en un gráfico. Es posible mantener varios dashboards y compartir cada uno con personas o equipos.

## Dashboards

Todos comienzan con un dashboard, creado la primera vez que se abre la pestaña. Utilice el selector de dashboards en la parte superior de la pestaña para cambiar entre dashboards, y **+** junto a él para crear uno nuevo. El selector lista primero los dashboards propios y, a continuación, los compartidos, etiquetados con el nombre de la persona que los compartió.

La pestaña reabre el último dashboard utilizado, y la barra de direcciones incluye el dashboard abierto (`?tab=dashboard&dashboard=<id>`), de modo que un enlace abre ese dashboard exacto para cualquiera que tenga acceso a él.

El botón de configuración (solo para propietarios) permite renombrar el dashboard, definir qué registros acepta como [página de detalle](#detail-pages), gestionar su uso compartido y eliminarlo. Eliminar un dashboard elimina sus widgets y sus workflows. Siempre se conserva al menos un dashboard propio, por lo que el último no puede eliminarse.

## Widgets

Un widget es un único gráfico sobre la cuadrícula. Tipos de gráfico admitidos:

- **Bar** (vertical u horizontal)
- **Line**
- **Area** (tendencia rellena, admite múltiples series)
- **Pie**
- **Table** (con desplazamiento; haga clic en el encabezado de una columna para ordenar de forma ascendente y vuelva a hacer clic para ordenar de forma descendente. Una columna puede mostrarse como [chips de estado](../nodes/chart-output-node.md#status-chips), una columna puede contener [botones de enlace](../nodes/chart-output-node.md#link-buttons) que abren una URL en una pestaña nueva, y las filas pueden abrir una [página de detalle](#paginas-de-detalle))
- **Numeric** (un único valor KPI con una unidad opcional)
- **Gauge** (un único valor frente a un rango mín–máx, por ejemplo un porcentaje)
- **Scatter** (puntos X/Y para gráficos de correlación)
- **Proportion** (una barra dividida en porciones con una leyenda de porcentajes, por ejemplo un desglose por idioma)
- **Gantt** (fechas de tareas, finalización y dependencias)
- **Entity relationships (DB)** (tablas, campos, claves PK/FK y conexiones)
- **Bar gauge** (un medidor horizontal por fila con un degradado de rojo a verde y un valor, por ejemplo el espacio libre en disco)
- **Text** (un mensaje markdown, por ejemplo una nota de estado como "Última ejecución a las 19:47"; admite [casillas interactivas](../nodes/chart-output-node.md#interactive-task-lists) cuando el markdown es estático, y [listas numeradas explícitas](../nodes/chart-output-node.md#numbered-lists) para numeración personalizada o descendente)
- **HITL** (sus revisiones humanas pendientes. El encabezado muestra `1/n pendientes`. El nombre del workflow abre esa ejecución en el canvas. **Approve**, **Request changes** y **Reject** la resuelven. El icono de historial junto al título del widget abre esa ejecución en el diálogo de historial de esta página. El widget no utiliza filas de entrada, y cada persona ve su propia cola. Puede mostrar en su lugar las revisiones de un solo Workflow, para todas las personas que puedan abrir ese Workflow; consulte [Widgets HITL](#widgets-hitl))

Además de los gráficos, un widget **Run a workflow** ejecuta uno de sus workflows desde el dashboard: al soltar un archivo, con sus campos de entrada o mediante un botón Run; consulte [Widgets de ejecución](#run-widgets).

Cada widget carga sus datos de forma asíncrona al abrir la pestaña, de modo que la página permanece ágil mientras los gráficos se completan.

## Añadir un widget

1. Haga clic en **Add widget**, asígnele un título y elija un tipo de gráfico. Debajo del selector, el diálogo dibuja un ejemplo de ese tipo de gráfico con datos de muestra y nombra las filas que espera, de modo que es posible comparar tipos antes de construir nada.
2. El widget se abre en el editor de workflows con un grafo inicial: un nodo [Set](../nodes/set-node.md) que produce las filas, conectado a un nodo [Chart Output](../nodes/chart-output-node.md). Sustituya el nodo Set por cualquier fuente de datos. Un widget **HITL** es únicamente el nodo Chart Output; lee sus revisiones pendientes y no necesita una fuente de datos.
3. Construya el workflow de modo que el nodo que alimenta a **Chart Output** produzca un array de filas y, a continuación, configure el mapeo de campos del nodo Chart Output (campo de etiqueta, campo de valor, etc.).
4. Guarde, vuelva a la pestaña Dashboard y el widget se renderizará.

Para un widget **Run a workflow**, elija en su lugar el workflow que ejecuta; el selector indica cómo ejecutará el widget cada uno. El widget se añade directamente a la cuadrícula; no hay ningún workflow nuevo que construir.

Haga doble clic en un widget (o utilice su botón de edición) para reabrir su workflow en cualquier momento. Utilice **Clone widget** en el encabezado del widget para duplicar tanto el widget como su workflow completo. La copia se coloca debajo del original y se etiqueta con **(Copy)** para poder editarla de forma independiente.

## Widgets HITL

Un nuevo widget HITL muestra todas las revisiones que esperan en su propia cola. Para mostrar solo las de un Workflow, abra la **Configuración** del widget:

1. En **Workflow**, elija el Workflow. La lista contiene los Workflows que puede abrir, suyos o compartidos con usted o con su equipo, que tienen un paso a la espera de una persona: un Agent con revisión humana, o un paso de Slack de aprobación, botones o formulario. El icono junto a él abre ese Workflow en una pestaña nueva.
2. Si el Workflow tiene un solo paso de este tipo, se selecciona automáticamente. Si tiene varios, **Select agent** los lista por nombre de nodo, con **All agents** primero; los pasos de Slack se marcan con **(Slack)**.
3. Guarde. El `1/n pending` del encabezado cuenta solo esas revisiones. Elija **Todos los workflows** para volver a mostrar su propia cola.

La misma opción está en el lienzo, en las propiedades del nodo Chart Output. **Ajustar con IA** puede hacerlo («mostrar solo las aprobaciones de facturas»), igual que describir un widget nuevo que nombre el Workflow. Cada cambio es una edición del Workflow, por lo que aparece en el Edit History.

- **Quién ve las revisiones.** Un widget filtrado por un Workflow muestra las revisiones de ese Workflow a todas las personas que puedan abrirlo, y estas pueden aprobar, solicitar cambios o rechazar desde él, igual que podrían ejecutar el Workflow. Un widget sin filtrar muestra a cada persona su propia cola.
- **Quién ve el widget.** Quien no pueda abrir el Workflow elegido no ve el widget en absoluto, ni siquiera en un dashboard compartido con esa persona. Cuando el propietario del dashboard pierde el acceso al Workflow, o este se elimina, el propietario ve «You no longer have access to the workflow this widget shows» y puede elegir otro en la **Configuración**.
- **Solo opciones accesibles.** Un Workflow que no puede abrir se rechaza al guardar el widget, ya sea desde la configuración, el lienzo o la IA.

## Páginas de detalle

Un widget de tabla puede enlazar sus filas a otro dashboard, que entonces funciona como página de detalle: un único dashboard que sirve para cada cliente, factura o ticket.

1. Abra **Settings** del widget de tabla y elija el dashboard en **Row link**.
2. Introduzca **Record column**, la columna cuyo valor identifica la fila (por ejemplo `id`), y opcionalmente una **Label column** que le dé nombre (por ejemplo `name`).
3. Guarde. Al hacer clic en una fila (o enfocarla y pulsar Intro) se abre el dashboard enlazado con `?record=<value>&label=<name>`.

En el dashboard de detalle, cada workflow de widget lee el valor como `$page.record` (consulte [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), y la página muestra `Dashboard / <label>` encima de la cuadrícula con un botón para borrar el registro. Atrás vuelve a la tabla de origen.

- **Quién puede abrirlo.** Las filas solo son clicables para los espectadores que pueden abrir el dashboard enlazado. Los demás ven la misma tabla sin enlaces.
- **Formato del registro.** El registro proviene de la URL, por lo que el dashboard de detalle decide qué acepta. En su configuración, **Detail page records** es uno de los siguientes: IDs (letras, dígitos, `-`, `_` y `.`, hasta 128 caracteres; el valor predeterminado), números, UUIDs o direcciones de correo electrónico. Cualquier otro valor se rechaza antes de que se ejecute un widget, y los widgets muestran "This page does not accept that record".
- **Sigue siendo la ejecución del propietario.** Los widgets también se ejecutan como el propietario del dashboard en una página de detalle. Los creadores deben pasar `$page.record` solo donde un nodo lo escape, nunca dentro del texto de una consulta.
- **Almacenamiento en caché.** Cada widget almacena en caché su gráfico por registro, durante el mismo tiempo de vida (TTL) que el widget, y conserva los 50 registros utilizados más recientemente.

## Widgets de ejecución

Un widget **Run a workflow** ejecuta uno de sus workflows y muestra el resultado: estado, tiempo de ejecución y salidas. Lo que muestra depende de lo que reciba el workflow:

- **Un archivo.** Para un workflow que comienza con un [File Upload Trigger](../nodes/file-upload-trigger-node.md), suelte un archivo sobre él (o haga clic para elegir uno) y el widget lo subirá mediante el enlace de subida de un solo uso del trigger. El widget muestra los tipos de archivo y el tamaño que acepta el trigger y rechaza otros antes de subirlos. Cuando el workflow también comienza con un nodo Text Input, el widget muestra sus campos junto a la zona para soltar archivos: elija un archivo, rellene los campos y **Run** enviará ambos. Los valores viajan con el enlace de subida que genera el widget, por lo que un enlace de subida compartido no puede establecerlos.
- **Campos de entrada.** Para un workflow que comienza con un nodo Text Input, el widget muestra sus campos con sus valores predeterminados; **Run** ejecuta el workflow con sus valores. Los valores de campos que el workflow no tiene se descartan.
- **Nada.** Un workflow sin entradas obtiene un botón **Run**.

El botón **Wrap** del resultado ajusta las líneas largas de salida dentro del cuadro; desactívelo para leer el diseño JSON de la salida.

- Cualquiera que pueda abrir el dashboard puede ejecutar el widget, del mismo modo que cualquiera puede actualizar un gráfico. El acceso al workflow corresponde al propietario del dashboard: añadir el widget requiere un workflow que tanto usted como el propietario puedan ejecutar, y la ejecución en sí utiliza las credenciales del propietario del workflow, como cualquier enlace de subida.
- El resultado permanece en su pantalla hasta que abandona la página; los demás espectadores no ven sus archivos, valores ni resultados. La ejecución aparece en el historial de ejecuciones con el trigger `dashboard`.
- Compartir un dashboard nunca concede acceso al workflow en sí. **Edit workflow** lo abre para las personas que ya tienen acceso, y **Fine-tune with AI** no se ofrece.
- Las ejecuciones con archivos se procesan en la instancia principal, donde se almacenan los archivos subidos, al igual que cualquier ejecución de File Upload Trigger.

## Generar un widget con IA

Haga clic en **AI**, describa la métrica deseada (por ejemplo, "tasa de éxito de workflows durante los últimos 30 días como gráfico de barras") y elija una credencial de LLM y un modelo. Heym genera un workflow de widget completo que termina en un nodo Chart Output y lo añade a la cuadrícula. Consulte [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) para ver prompts de ejemplo por tipo de gráfico.

El widget recibe un título corto de una o dos palabras en el idioma de su petición, como «Casos abiertos». Un título nunca incluye el id de una tabla de datos; cuando el modelo nombra el widget con una frase, Heym conserva sus primeras palabras.

La API de widgets también puede crear una **tarjeta de recuento** sin IA: un widget `text` sobre una tabla de datos (`data_table_id`) con `count_column` y `count_value` muestra cuántas filas tienen ese valor; el título del widget nombra el valor. Heym Work encabeza las páginas creadas a partir de una tabla de datos con una tarjeta de recuento por estado.

Utilice el botón **Fine-tune with AI** de un widget para revisar un widget existente con una nueva instrucción. Cada ajuste con IA guarda una instantánea del workflow anterior en el **Edit History** del widget, de modo que es posible revisar o revertir cambios desde el editor de workflows.

## Desde Chat y MCP

[Chat](./chat-tab.md), y los clientes MCP a través de la herramienta [`heym_chat`](./mcp-tab.md), pueden leer sus paneles, agregar widgets a ellos, cambiar el nombre o eliminar widgets y organizar el diseño de un panel. Heym Work muestra cada panel como una página, por lo que las mismas respuestas cubren sus páginas.

- **Qué paneles existen y qué contienen.** Pregunte "¿qué paneles tengo?", "¿qué hay en el panel de Ventas?" o "¿en qué panel está el workflow de ingresos?". Chat enumera sus propios paneles y los que se comparten con usted, con sus permisos de acceso y un enlace a cada uno, y cada widget en ellos: su título, tipo de gráfico y el workflow detrás de él. Un [widget HITL](#hitl-widgets) filtrado en un workflow que usted no puede abrir permanece oculto, tal como ocurre en el propio panel.
- **Un widget nuevo.** Pida "agrega un gráfico de casos abiertos por estado al panel de Ventas". Chat primero coloca un widget vacío en el panel, luego escribe el workflow propio del widget, realiza ejecuciones de prueba y corrige errores hasta que una ejecución se completa con éxito, de la misma manera que [crea workflows](./chat-tab.md#creacion-de-workflows). No se deja ningún workflow independiente y cada guardado aparece en el Edit History del widget. El título y el tipo de gráfico del widget siguen lo que Chat guarda.
- **Un workflow existente.** Pida "coloca el workflow de ingresos en el panel de Ventas". Un workflow que finaliza en un nodo Chart Output se convierte en un widget de gráfico con su propia copia del workflow, por lo que los cambios posteriores en el widget nunca alteran el original. Un workflow con un nodo trigger o input no puede convertirse en un widget de gráfico. Cualquier otro workflow se convierte en un [widget de ejecución](#run-widgets), que también requiere un workflow que el propietario del panel pueda ejecutar.
- **Cambiar el nombre o eliminar un widget.** Pida "cambia el nombre del widget Ingresos a Ventas" o "elimina el widget Casos abiertos". El workflow de un widget de gráfico toma también el nuevo nombre; el workflow de un widget de ejecución conserva el suyo. Al eliminar un widget de gráfico se elimina también su workflow, tal como hace el botón de eliminación del widget; el workflow de un widget de ejecución se conserva. Chat elimina únicamente el widget solicitado y pregunta primero en caso de coincidir con varios.
- **Organizar.** Pida "organiza el panel de Ventas" o "agrega estos tres widgets y organiza". Chat distribuye los widgets visibles en su orden, tal como lo hace el botón **Organizar**: filas aleatorias de dos o tres, por lo que solicitarlo de nuevo proporciona otra distribución. Pida un número por fila ("tres por fila") para obtener filas de ese tamaño. Esto organiza el panel en Heym; Heym Work mantiene su propia disposición de página, que cambia mediante el propio botón **Organizar** de la página.

Los nuevos widgets se ubican debajo de los widgets existentes del panel y, como cualquier widget, se ejecutan en el contexto del propietario del panel. Agregar, cambiar el nombre, eliminar y organizar requieren acceso de escritura al panel. Crear un widget nuevo requiere un chat que pueda construir workflows: la pestaña Chat, el Chat de Heym Work para editores y `heym_chat`.

## Editar el diseño

Active **Edit** para entrar en el modo de edición, donde es posible arrastrar widgets y redimensionarlos sobre una cuadrícula de 12 columnas. Los cambios de diseño se guardan automáticamente. Los títulos de los widgets son editables en línea desde el encabezado del widget.

## Caché y actualización

Cada widget almacena en caché en el servidor sus últimos datos calculados durante un tiempo de vida (TTL) configurable. Mientras la caché esté vigente, reabrir el dashboard sirve el resultado almacenado en lugar de volver a ejecutar el workflow. La caché se reemplaza en el mismo lugar cada vez que se recalculan los datos (una caché por widget, más una por registro en una [página de detalle](#detail-pages)) y se invalida automáticamente al editar el workflow del widget.

Utilice el botón **Refresh** de un widget (o **Refresh** en la barra de herramientas) para omitir la caché y recalcular de inmediato.

## Compartir

Los propietarios comparten un dashboard desde su configuración, con usuarios individuales (por correo electrónico) o con cualquier [equipo](teams-tab.md) al que pertenezcan. Cada compartición es de tipo **Lectura** o **Escritura**; cuando alguien tiene tanto una compartición personal como una de equipo, se aplica la más permisiva.

| Acción | Propietario | Escritura | Lectura |
|--------|:-----:|:-----:|:----:|
| Ver widgets, actualizarlos, usar la actualización automática | ✓ | ✓ | ✓ |
| Abrir páginas de detalle, ejecutar widgets de ejecución | ✓ | ✓ | ✓ |
| Añadir, clonar, eliminar, renombrar y redimensionar widgets; generar y ajustar con IA; marcar elementos de la lista de verificación | ✓ | ✓ | |
| Abrir el workflow de un widget en el editor | ✓ | ✓ | |
| Renombrar o eliminar el dashboard, definir su formato de registro, gestionar la compartición | ✓ | | |

**Los widgets siempre se ejecutan como el propietario del dashboard.** Independientemente de quién esté visualizando, un widget utiliza las credenciales y las variables globales del propietario, y sus ejecuciones aparecen en el historial de ejecuciones y las trazas del propietario. Por lo tanto, los miembros del equipo ven los mismos datos sin acceso a las cuentas subyacentes, y todos los espectadores comparten el único resultado en caché por widget. Los widgets que añade o clona un colaborador con permiso de escritura también pertenecen al propietario.

Por este motivo, **Escritura** conlleva la misma confianza que compartir un workflow para su edición: un colaborador con acceso de escritura puede modificar lo que se ejecuta con sus credenciales. Concédalo únicamente a personas a las que permitiría editar sus workflows. Una ejecución de prueba que un colaborador inicie desde el editor de workflows utiliza sus propias credenciales, como ocurre con cualquier workflow compartido; solo el dashboard en sí se ejecuta como el propietario. **Lectura** no otorga acceso a los workflows de los widgets, y los espectadores de solo lectura reciben el gráfico en sí, pero no los detalles de ejecución por nodo que lo sustentan.

Eliminar una compartición, o reducirla de escritura a lectura, surte efecto de inmediato.

## Relacionado

- [Nodo Chart Output](../nodes/chart-output-node.md)
- [Pestaña Analytics](analytics-tab.md) — métricas de ejecución integradas (distintas de los dashboards creados por el usuario)

## Cronogramas y diagramas de bases de datos

Elija **Gantt** en Agregar widget para mostrar tareas a lo largo del tiempo con finalización y vínculos de dependencia, o **Entity relationships (DB)** para mapear tablas, campos y sus relaciones. Ambos tipos utilizan el [nodo Chart Output](../nodes/chart-output-node.md#gantt-schedules) y también están disponibles en las páginas de Heym Work. Cuando Work sugiere widgets para un cronograma o esquema de base de datos, genera vistas previas a partir de las tareas o entidades propuestas.
