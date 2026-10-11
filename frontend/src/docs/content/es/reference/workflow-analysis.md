# Análisis de Workflow

**Análisis de Workflow** es un panel lateral izquierdo que contiene un documento Markdown compartido y editable por workflow. Utilícelo para explicar qué hace un workflow y para registrar ideas de mejora, y deje que la IA genere un primer borrador por usted.

El documento es compartido: cualquier persona que pueda acceder al workflow puede leerlo y editarlo. Se almacena junto con el workflow y se elimina automáticamente cuando se elimina el workflow.

## Abrir el panel

1. Abra un workflow en el editor.
2. Haga clic en **Analyze** (icono de destellos) en la barra de herramientas del editor.
3. El panel se abre a la izquierda. La paleta de nodos (panel izquierdo) se contrae mientras está abierto; al volver a abrir la paleta de nodos se cierra el panel de análisis.

El panel solo está disponible para workflows guardados. En un workflow nuevo sin guardar, guárdelo primero.

## El documento

El panel muestra un único documento Markdown con dos vistas, que se alternan mediante los botones **Edit** (lápiz) y **Preview** (ojo):

| Vista | Propósito |
|------|---------|
| **Edit** | Editor Markdown sin formato (área de texto). |
| **Preview** | Markdown renderizado. |

El encabezado muestra **quién editó por última vez** el documento y cuándo.

### Guardar

Haga clic en **Save** para conservar sus cambios. Save solo está habilitado cuando hay ediciones sin guardar.

Dado que el documento es compartido, las operaciones de guardado utilizan concurrencia optimista:

- Si otra persona guardó una versión más reciente desde que abrió el panel, su guardado se rechaza y aparece una advertencia que indica el nombre del otro editor.
- A continuación, puede elegir **Reload (discard mine)** para adoptar la versión del servidor, o **Overwrite** para forzar el guardado de su versión sobre la de la otra persona.

## Análisis con IA

Seleccione una **Credential** y un **Model** de LLM en la parte superior del panel (la lista de modelos se carga desde la credencial seleccionada; consulte [Credentials](../tabs/credentials-tab.md)). A continuación, ejecute el análisis:

- **Analyze my workflow** — se muestra cuando el documento está vacío. Transmite un informe Markdown generado por IA directamente al editor como borrador sin guardar. Revíselo y edítelo, y luego haga clic en **Save**.
- **Reanalyze** — se muestra cuando el documento ya tiene contenido. Transmite un informe nuevo a una **preview** independiente, sin modificar su documento actual. Elija **Accept** para reemplazar el contenido del editor con el nuevo análisis, o **Discard** para conservar lo que tenía.

Ambas acciones primero **ejecutan el workflow** (cuando es válido y ejecutable) e incluyen los resultados de la ejecución en el prompt de análisis, de modo que el informe refleja cómo se comporta realmente el workflow. Si el workflow no puede ejecutarse, el análisis procede a partir de su estructura estática.

El informe generado abarca tres secciones, en orden: **Improvement areas** (sugerencias concretas, incluido un enfoque de **security** siempre que el workflow involucre credenciales, entrada del usuario, solicitudes externas o exposición de datos), el **Purpose** del workflow y **What it does** (un recorrido paso a paso por los nodos).

La sección **Improvement areas** siempre ejecuta cuatro comprobaciones explícitas:

1. **Error coverage** — si el canvas no tiene ningún nodo [Error Handler](../nodes/error-handler-node.md) y no hay configurado ningún workflow de error, el informe lo señala y recomienda añadir gestión de errores.
2. **Time saved** — si no se ha establecido un tiempo estimado ahorrado por ejecución, el informe recomienda configurar uno para que la métrica **Time Saved** de [Analytics](../tabs/analytics-tab.md) pueda rellenarse.
3. **Network nodes** — para los nodos que realizan llamadas de red (como [HTTP](../nodes/http-node.md) y los nodos de integración), el informe recomienda una gestión de errores específica del nodo (retry y/o continue-on-error) en esos nodos.
4. **Alerts** — cuando no hay [alerts](../tabs/alerts-tab.md) configuradas para el workflow, el informe recomienda configurar alertas antes de pasar a producción.

### Ejecutar el analizador desde Properties

Cuando un workflow tiene nodos en el canvas pero aún no tiene documento de análisis, aparece un botón **Run Analyzer** en el panel [Properties](./canvas-features.md) a nivel de workflow (que se muestra cuando no hay ningún nodo seleccionado). Abre este panel de Análisis de Workflow para que pueda elegir una credencial y un modelo y generar el informe.

Cada ejecución de análisis se registra en [Traces](../tabs/traces-tab.md) bajo el origen **Workflow Analysis**.

Si no hay configurada ninguna credencial de LLM, el botón Analyze está deshabilitado; añada una en la [Credentials Tab](../tabs/credentials-tab.md).

## Relacionado

- [AI Assistant](./ai-assistant.md) — genere o modifique nodos del workflow a partir de lenguaje natural.
- [Sticky Note](../nodes/sticky-note-node.md) — para notas breves fijadas directamente en el canvas.