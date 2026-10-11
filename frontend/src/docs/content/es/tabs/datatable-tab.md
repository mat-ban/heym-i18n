# DataTable

La pestaña **DataTable** permite crear y gestionar tablas de datos estructuradas directamente en Heym. Las tablas pueden utilizarse en workflows mediante el [Nodo DataTable](../nodes/datatable-node.md) para operaciones CRUD programáticas.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Ver demostración de DataTable</a></p>

## Crear una tabla

1. Acceda a la pestaña DataTable desde el panel de control
2. Haga clic en **Create DataTable**
3. Introduzca un nombre y una descripción opcional
4. Añada columnas con el editor de columnas

## Columnas

Cada columna dispone de:

| Propiedad | Descripción |
|----------|-------------|
| Name | Nombre visible de la columna |
| Type | `string`, `number`, `boolean`, `date` o `json` |
| Required | Indica si las nuevas filas deben incluir esta columna |
| Unique | Indica si los valores deben ser únicos entre filas |
| Default Value | Se rellena automáticamente cuando una fila omite esta columna |

Añada, edite o elimine columnas desde la cabecera de la vista de detalle de la tabla.

## Generar columnas con IA

En lugar de añadir columnas manualmente, puede describir la tabla en lenguaje natural (o pegar un JSON de ejemplo) y dejar que un LLM proponga el esquema. Ambos puntos de entrada abren el mismo diálogo:

- **Generate with AI** (cabecera de la lista de DataTable) — crea una tabla completamente nueva a partir de su descripción.
- **AI columns** (vista de detalle de la tabla, junto a los controles de columnas) — propone *nuevas* columnas para añadir a la tabla que tiene abierta.

### Cómo funciona

1. Seleccione una **credencial LLM** y un **modelo** (por defecto, su primera credencial LLM y su modelo más reciente).
2. Escriba una descripción — por ejemplo *"Una tabla de libros con título, autor, número de páginas y si lo he leído"* — o pegue un ejemplo/esquema JSON.
3. Haga clic en **Generate**. El modelo devuelve un esquema sugerido.
4. Revise las columnas generadas en un formulario editable: modifique el **name**, **type**, **default**, **unique** y **notEmpty** (obligatorio) de cada una, elimine las columnas no deseadas o pulse **Add column** manualmente. Para una tabla nueva también puede editar el **name** y la **description** sugeridos por la IA.
5. Haga clic en **Create Table** (tabla nueva) o **Add Columns** (tabla existente) para guardar. Pulse **Esc** para cerrar el diálogo en cualquier momento.

### Solo adición para tablas existentes

Al generar columnas para una tabla existente, el modelo ve sus columnas actuales como contexto y propone **únicamente** columnas nuevas. Las columnas existentes y sus datos nunca se modifican ni se eliminan — las columnas generadas se añaden. Los nombres duplicados (sin distinguir mayúsculas y minúsculas) se descartan automáticamente.

> Se requiere una credencial LLM (OpenAI, Google o Custom). Si no dispone de ninguna, añada una primero en Settings.

## Gestionar filas

- **Añadir fila**: Haga clic en el botón de añadir para crear una nueva fila
- **Edición en línea**: Haga doble clic en cualquier celda para editar su valor. Pulse Enter o haga clic fuera para guardar, Escape para cancelar
- **Eliminar fila**: Utilice el menú de acciones de la fila para eliminarla
- **Paginación**: Las filas se muestran de 25 en 25 con navegación entre páginas

## Importar/Exportar CSV

### Importar
1. Haga clic en **Import CSV** en la vista de detalle de la tabla
2. Seleccione un archivo CSV para subir
3. Previsualice las 5 primeras filas y el mapeo de columnas
4. Las columnas en verde coinciden con columnas existentes de la tabla; las amarillas no coinciden
5. Haga clic en Import para insertar filas de forma masiva

### Exportar
Haga clic en **Export CSV** para descargar todas las filas como archivo CSV.

## Compartir

Comparta tablas con otros usuarios o equipos:

1. Abra el diálogo de compartir desde la vista de detalle de la tabla
2. Añada usuarios por correo electrónico con permiso de **read** o **write**
3. Añada equipos con permiso de **read** o **write**
4. Los usuarios de solo lectura pueden ver los datos; los usuarios con permiso de escritura pueden modificar filas

## Crear tablas desde el AI Assistant

El [AI Assistant](../reference/ai-assistant.md#data-tables) del canvas, el [Chat](./chat-tab.md) y la herramienta `heym_chat` de la [pestaña MCP](./mcp-tab.md) pueden seleccionar una de sus tablas para un workflow que construyan, o crear una nueva. Proponen un nombre y columnas, y crean la tabla cuando se envía la tarjeta de pregunta. Nunca modifican las columnas de una tabla existente ni tocan sus filas: añada o edite columnas aquí.

## Uso en workflows

El [Nodo DataTable](../nodes/datatable-node.md) conecta tablas con workflows. Las operaciones incluyen find, getAll, getById, insert, update, remove y upsert. No se requieren credenciales.

## Tabla de costes LLM (tabla del sistema)

Una sección fijada de **System tables** aparece encima de sus tablas creadas por el usuario con una única entrada: **LLM Cost Table**. Se trata de una vista de esquema fijo, editable por usuario, de los precios por modelo utilizados por los gráficos de costes de [Traces](./traces-tab.md).

### De dónde proceden los datos

Heym mantiene una tabla global de precios por modelo inicializada desde el endpoint público de precios de Helicone (`https://www.helicone.ai/api/llm-costs`). La sincronización se ejecuta en segundo plano la primera vez que se abre la tabla o Traces y está limitada a una consulta cada 24 horas. Pulse **Refresh** para forzar una resincronización inmediata. Las eliminaciones de Helicone en la lista de origen no se eliminan localmente, de modo que las consultas de costes históricos permanecen estables.

### Esquema (columnas de solo lectura)

| Columna | Significado |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informativo, utilizado por Helicone) |
| Model | Identificador del modelo que se compara con `trace.model` |
| Op | Operador de coincidencia: `equals`, `startsWith` o `includes` |
| Input $/1M | USD por 1 millón de tokens de prompt |
| Output $/1M | USD por 1 millón de tokens de completion |
| Source | `helicone`, `seed` o `user` |

### Personalización de precios

- **Editar una fila** para sobrescribir sus precios. La sobrescritura es por usuario y se marca con la insignia `Customized`; las futuras sincronizaciones de Helicone no la modifican.
- **Restablecer valores predeterminados** elimina la sobrescritura y restaura el valor global para esa fila.
- **Añadir modelo personalizado** abre un diálogo para crear una fila exclusiva del usuario (por ejemplo, un modelo ajustado privado que Helicone no lista). Las filas personalizadas se marcan como `User added` y al eliminarlas se borran por completo.

### Coincidencia con trazas

Cuando el panel de Trazas calcula el coste, compara cada `trace.model` con:

1. Sus sobrescrituras (coincidencia exacta con el nombre del modelo) primero
2. En caso contrario, la tabla global — la coincidencia exacta `equals` tiene prioridad sobre `startsWith`/`includes`; los empates dentro del mismo operador se resuelven por el prefijo/subcadena de modelo coincidente más largo

Si ninguna fila coincide, el modelo se lista bajo el aviso **Unpriced models** en la página de Trazas; su contribución al coste es cero hasta que añada una fila personalizada o sobrescriba una.

## Relacionado

- [Nodo DataTable](../nodes/datatable-node.md) - Referencia del nodo de Workflow
- [Pestaña Trazas](./traces-tab.md) - Utiliza la tabla de costes de LLM para el gráfico de anillo de costes y las tarjetas de KPI
- [Nodo Grist](../nodes/grist-node.md) - Alternativa de hoja de cálculo externa
- [Pestaña Variables](./global-variables-tab.md) - Alternativa de almacenamiento clave-valor
