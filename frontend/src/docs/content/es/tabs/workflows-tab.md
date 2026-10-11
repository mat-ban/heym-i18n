# Pestaña Workflows

La pestaña **Workflows** es la vista predeterminada del panel. Muestra la lista de workflows, la estructura de carpetas y permite crear, editar y organizar workflows.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Ver demo de Workflows</a></p>

## Iniciar un Chat

Sobre la lista de workflows hay un cuadro de chat que le saluda por su nombre y le pregunta qué desea automatizar. Escriba un prompt, adjunte opcionalmente un archivo y seleccione la credencial y el modelo que desee. Ambos menús desplegables son de búsqueda y se inician con sus [valores predeterminados de IA](../reference/user-settings.md).

Al enviar se crea una nueva conversación y se abre en la [pestaña Chat](./chat-tab.md), donde la respuesta se transmite en tiempo real. Los archivos adjuntos admitidos son archivos de texto, imágenes y PDF, uno por mensaje, igual que en el compositor del chat.

Si aún no dispone de una credencial LLM, el cuadro muestra un enlace a la [pestaña Credenciales](./credentials-tab.md) y el envío permanece deshabilitado.

Haga clic en la **x** para ocultar el cuadro. A continuación aparece un botón **Ask AI** junto al encabezado Workflows que lo restaura. La elección se recuerda en su navegador.

## Lista de Workflows

La lista es una vista de dos paneles: los workflows y las carpetas a la izquierda, y una vista previa del workflow seleccionado a la derecha.

- Cada fila muestra el icono del workflow, el nombre, la descripción, cuándo se actualizó por última vez y un [chip de estado](#workflow-status)
- Los workflows pueden estar en la raíz o dentro de carpetas, y los workflows fijados aparecen en su propio grupo **Pinned** en la parte superior
- **Haga clic** en una fila para seleccionarla y cargar su vista previa a la derecha
- **Haga doble clic** en una fila, o pulse **Enter** mientras tiene el foco, para abrirla en el [editor](../getting-started/quick-start.md)
- Use **Ctrl+clic** (o **Cmd+clic**) para abrir en una nueva pestaña
- Cada fila incluye sus acciones de editar, copiar, fijar y eliminar a la derecha. En teléfonos se ocultan para que el nombre conserve todo el ancho; **mantenga pulsada** una fila allí para abrir la hoja de acciones
- Fije los workflows de uso frecuente en el [Quick Drawer](../reference/quick-drawer.md) para poder ejecutarlos rápidamente desde la pestaña Workflows y otras páginas internas

## Vista Previa del Workflow

Al seleccionar un workflow se rellena el panel de vista previa junto a la lista. En pantallas de menos de 1280px, ese mismo panel se abre como una hoja desde la parte inferior de la pantalla.

El panel muestra:

- El nombre del workflow, quién lo creó y cuándo, y cuándo se editó por última vez
- **Open Workflow** – abre el workflow en el editor
- **Run Now** – abre el workflow en el [Quick Drawer](../reference/quick-drawer.md), donde puede completar sus entradas e iniciar la ejecución sin salir de la lista
- **Description** – la descripción del workflow
- **Trigger Configuration** – la programación de un workflow cron, o el trigger de escucha de un workflow de evento. Los workflows que se invocan por HTTP muestran un botón **Copy cURL** en lugar del endpoint sin procesar y el texto de autenticación: copia una solicitud completa con la URL correcta, los encabezados, el marcador de posición de autenticación y un cuerpo construido a partir de los campos de entrada del workflow. Cuando el workflow publica un [portal](../reference/portal.md), su enlace de chat público también aparece aquí
- **Last Run Details** – el resultado y la duración de la ejecución más reciente, o una nota de que el workflow nunca se ha ejecutado
- **Workflow Steps & Sub-agents** – los nodos en orden de ejecución, cada uno con su modelo, operación o programación y un punto que indica si está activo. Al seleccionar un paso se abre ese nodo en el editor con su panel de propiedades ya abierto

El panel permanece fijado junto a la lista mientras se desplaza, por lo que sigue siendo legible en una lista de workflows extensa.

## Administración de instancias

Las cuentas incluidas en `HEYM_ADMIN_EMAILS` pueden listar, abrir, editar, inspeccionar el historial de ejecuciones y eliminar cualquier workflow de la instancia sin necesidad de compartirlo ni transferir la propiedad. La configuración es una lista de direcciones de correo separadas por comas, que se compara sin distinguir mayúsculas y minúsculas. Una lista vacía no otorga este acceso a nadie. Reinicie el backend después de modificarla.

Los administradores ven el correo del propietario en la lista de workflows y pueden buscar por esa dirección. Seleccione un workflow para abrir **Administración de instancias** en su vista previa:

1. **Pausar triggers** solo se muestra para workflows que contienen un Nodo Cron. Desactiva el Cron del workflow y los demás nodos trigger automáticos mediante un guardado versionado normal. Las ejecuciones existentes pueden finalizar. Las llamadas manuales, por API, desde el portal y desde sub-workflows siguen disponibles; esta acción no es un bloqueo de ejecución para todo el workflow.
2. El botón cambia a **Reanudar triggers** mientras está en pausa, incluso después de recargar la página. Reanudar vuelve a habilitar los triggers pausados por el administrador y deja sin cambios los triggers que ya estaban desactivados. Para workflows antiguos en pausa que no tengan un estado de pausa administrativa guardado, Reanudar habilita sus triggers automáticos.
3. Utilice la acción **Eliminar workflow** de la fila del workflow una vez que las ejecuciones hayan finalizado. La eliminación devuelve un conflicto mientras quede trabajo en ejecución, en cola o pendiente de revisión. La eliminación programada aplica la misma comprobación.

Pause los triggers y deje que las ejecuciones existentes finalicen antes de eliminar. Un trigger ya despachado cuando se pausó aún puede finalizar. Utilice la eliminación cuando el workflow ya no deba poder invocarse.

Los secretos de webhook y la configuración de autenticación exclusivos del propietario conservan sus protecciones existentes. La administración no transfiere la propiedad ni comparte los registros de credenciales del propietario. Las acciones administrativas de pausa, reanudación, eliminación y programación aparecen en el [registro de auditoría](../reference/audit.md) con el administrador que actúa y el propietario del workflow.

## Estado del workflow

Cada fila lleva una etiqueta de estado derivada de los nodos trigger del workflow, su estado de ejecución en vivo
y —para workflows sin nodo trigger— de cómo se inició su ejecución más reciente:

| Estado | Significado |
| --- | --- |
| **Running** | El workflow tiene una ejecución en curso en este momento |
| **Scheduled** | Tiene un trigger [cron](../nodes/cron-node.md) activo |
| **Listening** | Tiene un trigger de evento activo, como un trigger de Slack, Telegram, IMAP o WebSocket |
| **Paused** | Tiene nodos trigger, pero todos ellos están desactivados |
| **API** | No tiene nodos trigger y su última ejecución se realizó mediante una llamada HTTP a su endpoint de ejecución |
| **SubWorker** | No tiene nodos trigger y su última ejecución se realizó como sub-workflow desde un workflow padre |
| **Portal** | No tiene nodos trigger y su última ejecución se realizó desde su [portal](../reference/portal.md) |
| **WEB** | No tiene nodos trigger y su único terminal es un [mapeador de salida HTML](../nodes/html-output-mapper-node.md), por lo que al invocarlo devuelve una página web renderizada |
| **Manual** | No tiene nodos trigger y nunca se ha ejecutado, o su última ejecución provino de otro origen |
| **Remove Scheduled** | Está [programado para su eliminación](../reference/workflow-organization.md) |

Las etiquetas API, SubWorker y Portal leen la entrada más reciente del
[historial de ejecuciones](./logs-tab.md) del workflow, por lo que un workflow que se invoca de dos formas muestra la que haya ocurrido en último lugar. **WEB** se determina a partir del grafo, por lo que tiene prioridad sobre esas tres: un workflow que sirve páginas se muestra como WEB incluso después de haber sido invocado por HTTP. Los nodos trigger siempre prevalecen sobre todos ellos: un workflow cron que además alguien invoca por HTTP permanece como **Scheduled**.

Utilice el desplegable **Estado** junto al campo de búsqueda para mostrar un único estado. El desplegable indica cuántos workflows coinciden actualmente con cada uno. Un filtro de estado también alcanza el interior de las carpetas: las carpetas con coincidencias se expanden automáticamente y las carpetas sin coincidencias se ocultan hasta que se borre el filtro.

## Workflows activos

En escritorio, el distintivo circular de la barra de herramientas superior muestra cuántos workflows se están
ejecutando actualmente y se actualiza automáticamente cada 10 segundos. Haga clic en un distintivo distinto de cero para abrir la lista de
workflows activos, que muestra hasta cuatro filas antes de desplazarse. Seleccione el nombre de un workflow para vincular el
editor a la vista en vivo de esa ejecución. El distintivo en cero es informativo y no se puede abrir, y el
distintivo se oculta en pantallas móviles.

## Búsqueda

Utilice el campo de búsqueda de workflows junto a **Estado**, o pulse **Ctrl+F** (o **Cmd+F**), para filtrar workflows por título o descripción. Los workflows coincidentes dentro de carpetas se muestran con sus ramas de carpeta expandidas. Pulse **Escape** para borrar la búsqueda.

## Carpetas

- Organice los workflows en [carpetas y subcarpetas](../reference/workflow-organization.md)
- Cree carpetas con el botón **New Folder**, asignando a cada una un nombre y una descripción opcional que se muestra bajo su nombre en la lista
- Cada fila de carpeta muestra cuántos workflows contiene, contando las subcarpetas, junto con sus acciones de nueva subcarpeta, renombrar, cambiar icono, descargar como ZIP y eliminar. En teléfonos, la fila muestra un único botón de menú en su lugar
- Arrastre un workflow sobre una carpeta o subcarpeta para ver una vista previa del destino en tamaño de tarjeta. La
  vista previa resaltada muestra la ruta completa de la carpeta antes de soltar, y al pasar el cursor sobre una carpeta
  contraída esta se expande brevemente para poder alcanzar carpetas anidadas.
- Arrastre workflows entre carpetas o hacia la raíz. La tarjeta arrastrada permanece visible como un fantasma,
  y el destino activo permanece resaltado mientras se desplaza.
- Soltar un workflow de vuelta en su carpeta actual está deshabilitado y se marca como **Already in Folder**.
- Renombre una carpeta, o cambie su descripción, desde su acción de renombrar o el menú contextual del clic derecho

## Crear workflows

1. Haga clic en **New Workflow**
2. Introduzca un nombre y una descripción opcional
3. El workflow se abre en el editor

## Importar

Arrastre y suelte un archivo JSON de workflow sobre el área de workflows para crear un nuevo workflow. Los nodos y las conexiones importados se utilizan para crear el workflow; el nombre proviene del campo `name` del JSON o del nombre del archivo. Consulte [Download & Import](../reference/download-import.md) para conocer el formato JSON y las opciones de importación.

## Compartir

Abra un workflow en el editor y haga clic en **Share** para invitar a usuarios por correo electrónico o compartir con un [equipo](./teams-tab.md). Elija **Read** (ver y ejecutar) o **Write** (también editar) para cada usuario o equipo, y cámbielo más adelante desde el menú desplegable junto a la entrada. Las credenciales y los sub-workflows no se comparten automáticamente; compártalos por separado con los mismos usuarios o equipos. Consulte [Workflow Organization](../reference/workflow-organization.md#sharing-workflows) y [Credentials Sharing](../reference/credentials-sharing.md).

## Editar y eliminar

- **Edit** – Cambie el nombre y la descripción del workflow desde la acción de edición de la fila
- **Delete** – Los workflows se [programan para su eliminación](../reference/workflow-organization.md); pasan a un área de papelera antes de su eliminación permanente

## Ediciones concurrentes

Al guardar se envía la revisión en la que se basan sus ediciones, y el servidor rechaza la escritura si el workflow cambió mientras tanto — por ejemplo, porque un compañero de equipo lo guardó, o porque usted dejó el mismo workflow abierto en una segunda pestaña. Heym muestra entonces un diálogo **Stale Workflow Detected** con dos opciones:

- **Cancel** – Conserva sus cambios sin guardar en el editor para que pueda recargar en otra pestaña y reconciliarlos
- **Override** – Guarda de todos modos, reemplazando la versión de la otra persona

**Ejecutar** un workflow lo guarda primero, por lo que pasa por la misma comprobación. Si el workflow cambió por debajo, la ejecución se detiene en el diálogo en lugar de sobrescribir de forma silenciosa: **Override and Run** guarda su versión e inicia la ejecución, **Cancel Run** abandona ambas y deja sus ediciones intactas.

La comprobación forma parte de la propia solicitud de guardado, por lo que no supone un viaje de ida y vuelta adicional y no existe ninguna ventana en la que un guardado pueda eludirla. Sus propios cambios desde otras partes de la aplicación — un renombrado, un cambio de configuración, una alternancia en el panel de propiedades — nunca cuentan como conflicto.

## Paleta de comandos

Pulse **Ctrl+K** (o **Cmd+K**) para abrir la paleta de comandos. Puede:
- Buscar workflows por nombre
- Saltar a cualquier [pestaña del dashboard](./credentials-tab.md)
- Abrir workflows recientes

## Relacionado

- [Quick Start](../getting-started/quick-start.md) – Cree su primer workflow
- [Workflow Organization](../reference/workflow-organization.md) – Carpetas, subcarpetas y eliminación programada
- [Workflow Structure](../reference/workflow-structure.md) – Formato JSON para workflows
- [Download & Import](../reference/download-import.md) – Exporte e importe workflows como JSON
- [Portal](../reference/portal.md) – Exponga workflows como interfaces de chat públicas
- [Board](./board-tab.md) – Ejecute workflows desde tarjetas kanban mediante cadenas de columnas
- [Core Concepts](../getting-started/core-concepts.md) – Workflows, nodos y ejecución
- [Execution History](../reference/execution-history.md) – Consulte ejecuciones anteriores y Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Fije y ejecute workflows desde el dashboard, la documentación y otras páginas que no son el editor
- [Contextual Showcase](../reference/contextual-showcase.md) – Guía breve de página para las superficies del dashboard
