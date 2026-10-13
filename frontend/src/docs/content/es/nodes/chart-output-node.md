# Salida de Gráfico

El nodo **Salida de Gráfico** es el nodo terminal de un workflow de [widget de panel](../tabs/dashboard-tab.md). Toma las filas producidas por los nodos anteriores y las convierte en un payload de gráfico estandarizado que el panel renderiza.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 0 (terminal) |
| Salida | Payload de gráfico estandarizado |

Coloque este nodo **al final** de un workflow de widget de panel. El nodo anterior debe producir un array de objetos de fila, por ejemplo:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Cuando solo disponga de datos de ejemplo (sin una fuente real), produzca estas filas con un nodo **Set** usando `$array(dict(...), dict(...))` — por ejemplo `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **No** utilice `${...}` ni literales de objeto `{...}` sin más; Heym construye objetos únicamente con `dict(key=value)`.

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `label` | string | Identificador del nodo (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` o `hitl` |
| `orientation` | string | `vertical` u `horizontal` (solo gráficos de barras) |
| `dataPath` | string | Ruta con puntos hasta el array de filas dentro de la salida anterior (p. ej. `data` o `result.items`). Déjelo vacío para detectarlo automáticamente. |
| `labelField` | string | Clave de fila usada como etiqueta de categoría (pie/bar/line) |
| `valueField` | string | Clave de fila usada como valor numérico (pie/bar/line/numeric/gauge) |
| `series` | array | Definición opcional de múltiples series `[{ "name": "Sent", "field": "sent" }]` para bar/line (anula `valueField`) |
| `columns` | array | Lista opcional de columnas para `table` (por defecto, las claves de la primera fila) |
| `statusColumn` | string | Columna opcional de `table` renderizada como [chips de estado](#status-chips) de colores. Debe ser una de las columnas mostradas. |
| `statusTones` | object | Mapa opcional de un valor de estado a un tono (`success`, `attention`, `failure`, `waiting`, `neutral`) para valores no cubiertos por los predeterminados |
| `xField` / `yField` | string | Claves de fila para los ejes numéricos X e Y (scatter) |
| `min` / `max` | number | Rango numérico para `gauge` (por defecto `0` / `100`) |
| `unit` | string | Unidad opcional mostrada junto a un valor `numeric` o `gauge` |
| `text` | string | Mensaje en Markdown para el tipo de gráfico `text`. Déjelo vacío y establezca `valueField` para renderizar un mensaje dinámico obtenido de los datos anteriores. |
| `title` | string | Título opcional del gráfico |

## Tipos de gráfico

- **bar / line / area / pie** — gráficos categóricos controlados por `labelField` + `valueField` (o `series` para bar/line/area de múltiples series). `area` es un gráfico de tendencia relleno.
- **table** — filas sin procesar renderizadas como una tabla desplazable usando `columns`. Una columna puede renderizarse como [chips de estado](#status-chips) y las filas pueden abrir una [página de detalle](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — un único valor KPI de la primera fila, con una `unit` opcional.
- **gauge** — un único valor mostrado frente a un rango `min`–`max` (p. ej. un porcentaje). Usa `valueField`.
- **scatter** — puntos X/Y a partir de `xField` e `yField` para gráficos de correlación.
- **proportion** — una única barra horizontal dividida en porciones con una leyenda de porcentajes (p. ej. un desglose por idioma). Usa `labelField` + `valueField`.
- **barGauge** — un gauge horizontal por fila con un degradado de rojo a verde y un valor (p. ej. espacio libre en disco). Usa `labelField` + `valueField`, `unit` y `max` opcionales (por defecto, el mayor valor de fila).
- **text** — un mensaje en markdown (p. ej. una nota de estado como "Última ejecución a las 19:47"). Coloque el markdown en `text` para un mensaje estático, o deje `text` vacío y establezca `valueField` para renderizar una cadena producida anteriormente. Admite encabezados, negrita/cursiva, [listas](../nodes/chart-output-node.md#interactive-task-lists), enlaces y código en línea.
- **hitl** — un carrusel de sus revisiones humanas pendientes. El encabezado muestra `1/n pending`; la flecha izquierda está deshabilitada en la primera tarjeta y la derecha en la última. El nombre del workflow abre esa ejecución en el canvas. **Approve**, **Request changes** y **Reject** la resuelven, y el icono de historial junto al título del widget abre esa ejecución en el diálogo de historial de la misma página. Este tipo de gráfico ignora las filas anteriores, por lo que el workflow del widget es únicamente el nodo Salida de Gráfico. Cada persona autenticada ve las revisiones de los workflows que posee.
### Listas de tareas interactivas

Utilice la sintaxis de listas de tareas de Markdown compatible con GitHub en el campo estático `text`:

```markdown
- [x] Opción 1
- [ ] Opción 2
- [ ] Opción 3
```

En el [Dashboard](../tabs/dashboard-tab.md), las casillas de verificación se representan como controles en los que se puede hacer clic (compatibles con modo oscuro y claro). Al alternar una casilla de verificación se actualiza el campo `text` del workflow del widget y se conserva entre actualizaciones.

**Edición en línea:** haga doble clic en la etiqueta de un elemento de tarea para editarla en el mismo lugar. Pulse Enter o haga clic fuera para guardar; pulse Escape para cancelar. Borre la etiqueta por completo para eliminar ese elemento de la lista.

**Enlaces en elementos de tarea:** cuando una etiqueta contiene un enlace Markdown (`[title](url)`), al hacer clic en el enlace se abre la URL sin alternar la casilla de verificación. Haga clic en cualquier otra parte de la fila para alternarla.

**Solo texto estático:** la interactividad requiere la sintaxis de listas de tareas GFM (`- [ ]` / `- [x]`). Los mensajes de estado dinámicos simples sin elementos de tarea permanecen de solo lectura. Cuando el Markdown proviene de `valueField`, la primera alternancia lo copia al campo estático `text` para que los cambios se conserven.

### Listas numeradas

Los widgets de texto representan Markdown con **números de línea explícitos preservados**. Prefije cada línea con el número que desea mostrar (p. ej., `9.`, `8.`, `7.`). Heym no renumera las líneas por usted.

**¿Por qué números explícitos?** Las listas ordenadas estándar de Markdown (`1.`, `2.`, `3.`) se convierten en listas HTML `<ol>`, que solo cuentan **hacia arriba** desde el primer número. Una lista escrita como `9.` / `8.` / `7.` se mostraría como `9`, `10`, `11` en un renderizador de Markdown normal. Prefijar cada línea con el número deseado evita eso.

**Listas descendentes (p. ej., lo más reciente primero):** construya el Markdown en un bucle del workflow y calcule el número a mostrar por elemento:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Patrón típico:

1. Obtenga o construya un array de elementos (p. ej., HTTP → `body.videos`).
2. [Loop](./loop-node.md) sobre el array; dentro del cuerpo, utilice una [Variable](./variable-node.md) con `.add()` para añadir una línea numerada por iteración.
3. Tras la rama **done** del bucle, [Set](./set-node.md) `join("\n")` sobre el array acumulado (o equivalente) en una única cadena Markdown.
4. Apunte **Chart Output** `valueField` a esa cadena (o establezca el `text` estático).

Expresión de línea de ejemplo dentro del bucle (etiqueta `processVideos`, elementos con `title` e `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Markdown resultante:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Para una lista ascendente simple que comience en 1, prefije cada línea (`1.`, `2.`, `3.`) o utilice un bucle con `$loop.index + 1`. Utilice [listas con viñetas](#interactive-task-lists) (`- item`) cuando no necesite números.

## Chips de estado

Una `table` puede mostrar una columna como chips de colores. Establezca **Status column** en las propiedades del nodo (o `statusColumn` en el DSL) con el nombre de una columna. Cada valor recibe uno de cinco tonos, y las palabras habituales reciben uno sin necesidad de configuración:

| Tono | Palabras predeterminadas |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | cualquier otro valor |

La coincidencia ignora mayúsculas/minúsculas, `_` y `-`, por lo que `IN_PROGRESS` e `in-progress` son ambos `waiting`. Añada **Status tones** para otros valores; una entrada sobrescribe el valor predeterminado para ese estado:

```json
{
  "type": "chartOutput",
  "data": {
    "label": "invoices",
    "chartType": "table",
    "dataPath": "rows",
    "columns": ["invoice", "customer", "state"],
    "statusColumn": "state",
    "statusTones": { "Disputed": "failure" }
  }
}
```

El servidor resuelve cada valor a su tono, por lo que Heym y Heym Work muestran los mismos colores.

## Páginas de detalle: `$page.record`

Un panel abierto con `?record=<value>` ejecuta cada Workflow de widget con ese valor como `$page.record`. Un enlace en una fila de tabla abre dicha página; consulte [Páginas de detalle](../tabs/dashboard-tab.md#detail-pages). En el panel abierto sin un registro y en el diálogo de expresiones, `$page.record` es `null`. Un nodo con la etiqueta `page` tiene prioridad sobre él.

Úselo para obtener el registro específico sobre el que trata la página, por ejemplo en un nodo [HTTP](./http-node.md):

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` es el propio valor de la fila pulsada, como `V-1002`, no un objeto con campos. Para encontrar ese registro en una [DataTable](./datatable-node.md), filtre su columna de registro por el valor: operación `find` con el filtro `{"vendor_id": "$page.record"}`. Una ruta como `$page.record.id` no se resuelve en nada, por lo que un widget creado o ajustado por la IA descarta esos campos y lee `$page.record` en su lugar.

El valor proviene de una URL que cualquiera puede editar. El panel solo acepta valores con su formato de registro (letras, dígitos, `-`, `_` y `.` de forma predeterminada), pero trátelo igualmente como una entrada no confiable: páselo donde el nodo escape valores, como un parámetro de consulta HTTP o un valor de filtro de [DataTable](./datatable-node.md) o ClickHouse, y nunca construya texto de consulta concatenando cadenas con él. Los widgets siguen ejecutándose como el propietario del panel, independientemente de quién abra la página.

## Cómo se resuelven los datos

1. Si `dataPath` está establecido, el nodo sigue esa ruta de puntos dentro de la salida ascendente.
2. De lo contrario, busca un array: una lista de nivel superior, un array `data` o el primer campo con valor de lista.
3. Las filas procedentes directamente de un nodo [Data Table](./datatable-node.md) (`{id, data, created_at}`) se leen con sus columnas en el nivel superior junto a `id`, de modo que `labelField`, `valueField` y `columns` nombran las propias columnas de la tabla.
4. Para `table`, cada fila se convierte en una fila de tabla usando `columns` (o las claves de la primera fila). Con `statusColumn`, el Payload también incluye el tono de cada valor en esa columna.
5. Para `numeric` y `gauge`, el valor proviene de `valueField` en la primera fila (o del primer campo numérico).
6. Para `scatter`, cada fila se convierte en un punto `[xField, yField]`.
7. Para `text`, el mensaje se toma de `valueField` en la primera fila cuando está establecido; de lo contrario, de la configuración estática `text` (o, en su defecto, del primer campo de cadena de la primera fila).
## Ejemplo

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge (valor único frente a un rango):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter (puntos X/Y):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proportion (una barra dividida por proporción + leyenda de porcentajes):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Area (tendencia multicontenido rellena):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge (gauge con degradado por fila y valores):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text (un mensaje markdown estático — no requiere filas de origen):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text (dinámico — la cadena del mensaje se genera en origen y se obtiene mediante `valueField`):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```

## Ejemplos de prompts de IA

Al generar un widget con **IA**, prompts como estos se corresponden claramente con cada tipo:

- **Bar** — "Show monthly revenue for the last 6 months as a vertical bar chart with example data."
- **Line** — "Plot daily active users over the last 14 days as a line chart."
- **Area** — "Show memory and CPU usage over the last 24 hours as an area chart with two series. Use example data."
- **Pie** — "Break down execution status (success, error, cancelled) as a pie chart."
- **Table** — "Show the top 10 workflows by execution count as a scrollable table with name and runs columns. Use example data."
- **Numeric** — "Show today's total workflow executions as a single KPI with unit 'runs'. Use example data."
- **Gauge** — "Show current CPU usage as a gauge from 0 to 100 percent."
- **Scatter** — "Plot request latency versus payload size as a scatter chart with example data."
- **Proportion** — "Show my most used languages as a proportion bar: Kotlin 49.64%, JavaScript 23.73%, TypeScript 11.64%, Java 8.92%, Python 6.06%. Use example data."
- **Bar gauge** — "Show free disk space per volume (sda1 to sda7) as a bar gauge in GB. Use example data."
- **Text** — "Add a text widget with a markdown checklist (one checked item, two unchecked), or list the 5 newest tutorial videos in descending order (5. down to 1.) with YouTube links — prefix each line with an explicit number (`5. Title`, `4. Title`, …)."

## Relacionado

- [Pestaña Dashboard](../tabs/dashboard-tab.md) — cree y organice widgets
- [Nodo Output](output-node.md) — nodo terminal para Workflows regulares
