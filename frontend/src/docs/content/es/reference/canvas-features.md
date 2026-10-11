# Funciones del Canvas

El editor de workflows proporciona varias funciones para depurar, probar y organizar nodos: **Ejecutar hasta el Nodo**, **Data Pin**, **Registros de Ejecución**, **Activar/Desactivar** y **Extraer a Sub-Workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Ver demo del Editor</a></p>

## Ejecutar hasta el Nodo

Pase el cursor sobre cualquier nodo excepto una nota adhesiva y haga clic en **Run** debajo de él. Heym ejecuta ese nodo y sus dependencias anteriores, dejando intactos los nodos posteriores y las ramas no relacionadas. Esto utiliza el modo de prueba del canvas, incluyendo las salidas fijadas y las condiciones de rama normales del workflow.

Si la ruta seleccionada tiene campos de entrada, el panel **Run** de la derecha se abre y enfoca el primer campo. Introduzca los valores y, a continuación, haga clic en **Run to _node label_** o pulse **Ctrl+Enter** (Cmd+Enter en macOS). El modo de cuerpo genérico enfoca el editor de cuerpo JSON. Las rutas sin campos de entrada se ejecutan inmediatamente sin abrir el panel. Los nodos Input fijados reutilizan su salida fijada sin solicitar entrada.

El panel conserva el destino seleccionado para ejecuciones posteriores. Elija **Run full workflow** para borrar el destino. Los botones de ejecución se desactivan mientras hay una ejecución activa. Un destino dentro de un bucle detiene la ejecución cuando se alcanza ese nodo por primera vez; seleccionar un nodo posterior al bucle ejecuta el bucle anterior completo.

## Data Pin

Data Pin permite fijar la salida de un nodo de la última ejecución para poder probar los nodos posteriores sin volver a ejecutar el nodo fijado.

### Dónde encontrarlo

- **Panel de propiedades** – Seleccione un nodo y desplace hasta la sección **Pinned Data**
- **Insignia del nodo** – Aparece un icono de chincheta en el nodo cuando los datos están fijados

### Acciones

| Acción | Descripción |
|--------|-------------|
| **Pin** | Fija la salida de la última ejecución del nodo (disponible tras una ejecución) |
| **Clear** | Elimina los datos fijados |
| **Edit** | Edite el JSON fijado directamente; haga clic en Save para aplicar |

### Comportamiento en modo de prueba

Al ejecutar un workflow en modo de prueba, los nodos con `pinnedData` omiten la ejecución y utilizan la salida fijada en su lugar. Utilice esto para:

- Probar la lógica posterior sin llamar a APIs externas
- Depurar expresiones que hacen referencia a la salida del nodo
- Iterar sobre prompts o condiciones con datos de muestra fijos

El autocompletado de expresiones en el editor utiliza los datos fijados cuando están disponibles para sugerir campos.

## Registros de Ejecución

El **panel de Debug** (cajón inferior) muestra los registros de ejecución en tiempo real durante las ejecuciones del workflow. También
puede abrir una ejecución de producción en curso desde el diálogo de Historial o desde una tarjeta del Board. El
editor se conecta al flujo SSE de esa ejecución, restaura los resultados de los nodos completados y continúa
mostrando las animaciones y los registros de los nodos a medida que nuevos nodos comienzan y finalizan.

### Qué muestra

- **Resultados de nodos** – Estado por nodo (`success`, `error`, `skipped`, `running`), tiempo de ejecución y salida
- **Salidas finales** – Salidas agregadas de los nodos [Output](../nodes/output-node.md)
- **Progreso del agente** – Para los nodos [Agent](../nodes/agent-node.md), llamadas a herramientas paso a paso y razonamiento

### Acciones

- **Copy as JSON** – Copia el registro de ejecución completo al portapapeles
- **Open in JSON editor** – Abre el registro en JSON Hero o JSON Editor Online para su inspección
- **Download generated files** – Si una skill produjo archivos descargables (`_generated_files`), aparece un botón Download. Un solo archivo se descarga directamente; varios archivos abren una ventana emergente de selección.

### Diferencia con la pestaña Logs

El panel de Debug muestra los registros de **ejecución del workflow** (resultados de nodos, salidas). La [pestaña Logs](../tabs/logs-tab.md) muestra los registros del **contenedor Docker** (backend, frontend, base de datos). <!-- pragma: allowlist secret -->

## Activar / Desactivar

Puede desactivar nodos para que se omitan durante la ejecución. Los nodos desactivados muestran una insignia de "off" y aparecen atenuados.

### Cómo alternar

| Método | Descripción |
|--------|-------------|
| **Panel de propiedades** | Seleccione el nodo → icono de encendido (arriba a la derecha) |
| **Menú contextual** | Haga clic derecho en el nodo o nodos → Disable o Enable |
| **Teclado** | Seleccione el nodo o nodos → pulse **D** (consulte [Atajos de Teclado](./keyboard-shortcuts.md)) |

### Selección múltiple

Cuando hay varios nodos seleccionados, Activar/Desactivar se aplica a todos ellos. El menú contextual muestra "Enable" si algún nodo seleccionado está desactivado, y "Disable" si todos están activados.

### Comportamiento en tiempo de ejecución

Los nodos con `active: false` se omiten. Los nodos posteriores no reciben datos de los nodos omitidos. Utilice esto para excluir nodos temporalmente sin eliminarlos.

Para activar o desactivar un nodo desde dentro de un workflow en lugar de hacerlo manualmente, utilice [Disable Node](../nodes/disable-node.md) y [Enable Node](../nodes/enable-node.md).

## Grafo de memoria del agente

Los nodos [Agent](../nodes/agent-node.md) con **[memoria persistente](./agent-persistent-memory.md)** habilitada muestran un control rosa con forma de **cerebro** en el nodo. Haga clic en él para abrir el editor del grafo de memoria: las entidades se representan como un grafo animado dirigido por fuerzas y agrupado por tipo de entidad, con selectores de Origen/Destino con búsqueda para añadir relaciones y un panel de conexiones para saltar entre entidades vinculadas. El mismo diálogo incluye **Compartir memoria con otros agentes** (workflow → agente → lectura o lectura/escritura) para el [uso compartido de memoria entre agentes](./agent-persistent-memory.md#sharing-with-other-agents). Mientras el diálogo está abierto, el deshacer/rehacer del canvas principal se aplaza para que la edición del grafo conserve su propio historial.

**Filtrado del grafo.** La esquina superior izquierda del canvas dispone de un control de búsqueda, contraído a un botón de acceso rápido hasta que se hace clic en él o se pulsa **Ctrl/Cmd+F**. Coincide con el nombre de una entidad, su tipo y cada clave y valor de atributo, así como con el tipo de una relación (`parent_of`) y sus propiedades; una relación coincidente trae consigo ambas entidades. Todos los términos separados por espacios deben coincidir. Una entidad coincidente trae consigo todo su vecindario —cada relación en la que participa y la entidad al otro extremo de cada una—, de modo que una coincidencia nunca queda como un punto sin conexión. Una relación coincidente trae únicamente las dos entidades que une y se detiene ahí, ya que buscar un tipo de relación es una consulta sobre esa relación y no sobre todo aquello a lo que están vinculados sus extremos. Todo lo demás se oculta por completo —no se atenúa— tanto en el canvas como en la lista **All edges**, y una insignia muestra cuántas entidades del total quedan. La **✕** dentro del cuadro borra primero la consulta y, con una segunda pulsación, cierra el cuadro. Escape retrocede de la misma forma, de lo más interno a lo más externo: borra la consulta, luego cierra el cuadro de búsqueda, después abandona la vista ampliada del canvas y solo cierra el diálogo cuando ninguno de esos elementos está abierto. Al borrar se restaura el grafo completo con cada entidad de vuelta en su posición.

**Colocación manual de entidades.** Arrastrar una entidad la fija donde se suelta, de modo que el auto-layout asienta el resto del grafo a su alrededor en lugar de devolverla a su posición. Arrastrar la entidad seleccionada mueve con ella sus entidades directamente conectadas, conservando la forma del clúster; arrastrar cualquier otra entidad mueve solo esa. **Tidy layout** (el botón de la varita) libera todas las entidades fijadas y vuelve a ejecutar el auto-layout.

## Extract to Sub-Workflow

Convierte los nodos seleccionados en un sub-workflow reutilizable y los reemplaza por un nodo [Execute](../nodes/execute-node.md).

### Cómo usarlo

1. Seleccione uno o más nodos en el canvas
2. Haga clic derecho → **Extract to Sub-Workflow**
3. Introduzca un nombre (y una descripción opcional) para el nuevo workflow
4. Haga clic en **Extract**

### Qué ocurre

- Se crea un nuevo workflow con los nodos seleccionados
- Las entradas externas (edges desde fuera de la selección) se convierten en los campos [Input](../nodes/input-node.md) del sub-workflow
- Las salidas externas (edges hacia nodos fuera de la selección) se asignan al [Output](../nodes/output-node.md) del sub-workflow
- Los nodos seleccionados se reemplazan por un único nodo [Execute](../nodes/execute-node.md) que llama al nuevo workflow
- Las asignaciones de entrada/salida se conservan automáticamente

### Casos de uso

- Reutilizar una secuencia de nodos en varios workflows
- Simplificar un workflow complejo agrupando lógica relacionada
- Crear sub-workflows modulares y comprobables

## Run with cURL

El botón **cURL** de la barra de herramientas del editor (arriba a la derecha) abre un diálogo para construir y copiar un comando cURL que permite activar el workflow vía API.

- Elija el modo del cuerpo de la petición del workflow (`Defined` o `Generic`)
- Establezca el tipo de autenticación (Anonymous, JWT o Header Auth)
- Configure el almacenamiento en caché de respuestas y la limitación de tasa
- Active o desactive el streaming SSE y personalice los mensajes de inicio por nodo
- Edite el cuerpo de la petición
- En el modo Generic, el panel de ejecución del canvas usa el mismo cuerpo JSON sin procesar que el diálogo de cURL
- Haga clic en **Copy cURL** para copiar el comando listo para ejecutar

Consulte [Webhooks](./webhooks.md#run-with-curl-dialog) para ver todos los detalles del diálogo y [SSE Streaming](./sse-streaming.md) para el protocolo de eventos.

## Relacionado

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – Todos los atajos del canvas y del editor
- [Agent Persistent Memory](./agent-persistent-memory.md) – Comportamiento y API del grafo de memoria
- [Execute Node](../nodes/execute-node.md) – Llama a sub-workflows
- [Expression DSL](./expression-dsl.md) – Referencias y datos fijados
- [Workflow Structure](./workflow-structure.md) – Formato de nodos y edges
- [Download & Import](./download-import.md) – Exportar e importar workflows como JSON
- [Node Types](./node-types.md) – Todos los tipos de nodo
- [Logs Tab](../tabs/logs-tab.md) – Logs de contenedores Docker
- [Execution History](./execution-history.md) – Ejecuciones anteriores
- [Templates](../tabs/templates-tab.md) – Guardar y reutilizar workflows y nodos
- [Contextual Showcase](./contextual-showcase.md) – Guía compacta de la página disponible en el editor
