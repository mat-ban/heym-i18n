# Expression DSL

Heym utiliza un lenguaje de expresiones simple para referenciar datos de nodos anteriores. Utilice expresiones en la configuración de nodos como `userMessage` del Nodo LLM, `condition` del Nodo de condición, `message` del Nodo de salida, mapeos de Set y valores de Variables. Utilice el [Diálogo de evaluación de expresiones](./expression-evaluation-dialog.md) para obtener un editor más amplio, una vista previa en vivo respaldada por el backend y la selección de rutas de salida.

## Referencias básicas

### Nodo de entrada vs nodos con nombre

- **`$input`** – Utilícelo únicamente cuando exista un solo nodo [Input](../nodes/input-node.md) anterior y se desee referenciar su salida. Ejemplo: `$input.text`. Es una forma abreviada de "los datos de la entrada conectada".
- **`$nodeLabel.field`** – Utilícelo para referenciar cualquier nodo anterior por su **label** (el `label` en los datos del nodo). Prefiera esta forma cuando tenga varios nodos o cuando el AI Assistant / workflow DSL espere labels explícitos. Ejemplo: `$userInput.body.text`, `$myLLM.text`.

**Cuándo usar cada uno:**

| Contexto | Preferir | Ejemplo |
|--------|--------|---------|
| Un solo nodo de entrada, flujo simple | `$input.text` | Mensaje de salida desde un único Input |
| Varios nodos o referencias con nombre | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Siempre `$nodeLabel.field` | El constructor de workflows espera labels, no `$input` |

### Nodo de entrada

Utilice `$input` para referenciar los datos del Nodo de entrada cuando exista una única entrada anterior:

```
$input.text
```

### Nodos con nombre

Referencie cualquier nodo anterior por su label. Cuando un nodo tiene [datos fijados](./canvas-features.md#data-pin), el autocompletado de expresiones utiliza esos datos en lugar de la salida de la ejecución.

```
$llm.text
$httpResponse.body
$condition
```

### Credenciales

Utilice `$credentials.CredentialName` para referenciar valores de Credenciales (por ejemplo, claves de API, bearer tokens o tokens de integración de Notion) por nombre. Consulte [Compartir credenciales](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Los nombres que no son identificadores simples (contienen `-`, comienzan con un dígito o son palabras reservadas) utilizan la forma con corchetes: `$credentials["my-api-key"]`.

### Variables globales

Utilice `$global.variableName` para referenciar [Variables globales](./global-variables.md): datos clave-valor persistentes, con alcance de usuario, gestionados en la [pestaña Variables](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Campos anidados

Utilice notación de punto para objetos anidados:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literales

- **Strings**: `"hello"` o `'hello'`
- **Números**: `42`, `3.14`
- **Booleanos**: `true`, `false`
- **Null**: `null`

## Preservación de tipos

Cuando el valor **completo** es una única `$expr`, el backend preserva el tipo nativo:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Cuando una expresión forma parte de una cadena más grande, el resultado final siempre es una cadena:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Notas adhesivas

Los nodos [Sticky Note](../nodes/sticky-note-node.md) son documentación del canvas, no campos ejecutables de expresiones. Su contenido `note` se renderiza como markdown, por lo que debe utilizar enlaces e imágenes markdown normales en lugar de expresiones `$...`.

Las notas adhesivas admiten un título de visualización personalizado y seis colores de fondo guardados:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

Los valores permitidos para `stickyColor` son `yellow`, `sky`, `emerald`, `rose`, `violet` y `zinc`.

## Aritmética

Operadores admitidos: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Comparaciones

Utilícelas en nodos [Condition](../nodes/condition-node.md): `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Contexto de bucle

Dentro de un nodo [Loop](../nodes/loop-node.md), utilice `item` para referenciar el elemento actual del array:

```
item.name
item.value
```

## Variables especiales
- `$now` - Fecha y hora actual con métodos de formato
- `$Date()` - Crear/parsear fecha (por ejemplo, `$Date("2024-01-15")`)
- `$UUID` - Generar un identificador único de 32 caracteres (SIN paréntesis; use `$UUID`, no `$UUID()`)
- `$workflowName` - Nombre del workflow actual
- `$workflowDescription` - Descripción del workflow actual
- `$workflowPath` - Ruta relativa del workflow, por ejemplo `/workflows/<id>`
- `$workflowUrl` - URL absoluta del workflow, por ejemplo `https://<host>/workflows/<id>`
- `$executionId` - Id de la ejecución actual (coincide con el id de la entrada del [Historial de ejecuciones](./execution-history.md), por lo que `/workflows/<id>/<executionId>` abre esta ejecución en el canvas). **Solo en tiempo de ejecución**: vacío en el diálogo de vista previa de expresiones; se completa únicamente mientras un workflow se está ejecutando.
- `$vars` - Variables locales del workflow (acceso mediante `$vars.variableName`; se actualizan mediante el nodo `variable`)
- `$global` - Almacén persistente de variables globales (acceso mediante `$global.variableName`)

### Uso de $vars
- `$vars.counter` - Acceder a una variable llamada `counter`
- `$vars.myArray.add("item")` - Añadir un elemento a una variable de tipo array

### Uso de $global
- `$global.environment` - Acceder a una variable global llamada `environment`
- `$global.settings.baseUrl` - Acceder a campos anidados en una variable global de tipo objeto

## Contexto de la solicitud (ejecución por API)
Cuando un workflow se ejecuta mediante HTTP API, los nodos de entrada reciben metadatos adicionales de la solicitud:
- `$textInputLabel.body` - Objeto del cuerpo de la solicitud HTTP (payload JSON sin procesar)
- `$textInputLabel.headers` - Objeto de encabezados de la solicitud HTTP (todas las claves de encabezado están en minúsculas)
- `$textInputLabel.query` - Objeto de parámetros de consulta de la URL

Acceda a los datos de la solicitud de la siguiente manera:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Funciones de conversión de tipos
- `str(value)` - Convertir a string
- `int(value)` - Convertir a entero
- `float(value)` - Convertir a float
- `bool(value)` - Convertir a booleano
- `list(value)` - Convertir a lista
- `dict(key=value, ...)` - Crear diccionario con argumentos de palabra clave (ej. `$dict(name="Ali", age=30)`)

## Funciones matemáticas
- `len(value)` - Obtener longitud
- `abs(value)` - Valor absoluto
- `min(a, b)` - Valor mínimo
- `max(a, b)` - Valor máximo
- `round(value)` - Redondear número
- `sum(list)` - Suma de la lista
- `sorted(list)` - Ordenar lista
- `randomInt(min, max)` - Entero aleatorio

## Funciones de array
- `$array(a, b, c)` - Crear array a partir de los argumentos (ej. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Crear rango de enteros desde `a` hasta `b` con `b` excluido (ej. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Falla cuando `a > b`
- `notNull(list)` - Eliminar valores nulos del array

## Función de construcción de strings (para expresiones map/filter)
- `concat(a, b, c, ...)` - Concatenar N argumentos
  - Usar dentro de `.map()` como una cadena de expresión (sin `$` dentro de la cadena)
  - Usar comillas simples dentro de la cadena de concat:
    - Correcto: `concat('prefix', 'item.field', 'suffix')`

## Objetos literales / Diccionarios
Cree objetos/diccionarios usando la sintaxis de llaves con cualquier clave de tipo string:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Claves dinámicas
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Reglas de los objetos literales
- Las claves pueden ser cualquier string (incluyendo espacios/caracteres especiales)
- Las claves DEBEN estar entre comillas dobles (ej. `"key"`)
- Los valores pueden ser strings/números/booleanos/expresiones/objetos anidados

## Funciones de string
- `upper(text)` - Mayúsculas
- `lower(text)` - Minúsculas
- `strip(text)` - Eliminar espacios en blanco
- `capitalize(text)` - Capitalizar primera letra
- `title(text)` - Formato de título
- `split(text, separator)` - Dividir string
- `join(separator, list)` - Unir lista
- `replace(text, old, new)` - Reemplazar texto
- `regexReplace(text, pattern, replacement)` - Reemplazar con patrón regex
- `base64Encode(text)` - Codificar texto UTF-8 como Base64 estándar
- `base64Decode(text)` - Decodificar Base64 estándar a texto UTF-8
- `toJson(text)` - Parsear una cadena JSON a un objeto, array o valor

## Métodos de string (sobre valores de tipo string)
- `.orEmpty()` - Devolver el valor del string, o `""` cuando el valor es nulo/inexistente
- `.upper()` / `.lower()` - Conversión de mayúsculas/minúsculas
- `.strip()` - Eliminar espacios en blanco
- `.capitalize()` / `.title()` - Capitalizar
- `.length` - Longitud del string
- `.toString()` - Convertir a string
- `.substring(start, end)` - Extraer subcadena
- `.contains(text)` - Comprobar si contiene la subcadena
- `.startswith(prefix)` / `.endswith(suffix)` - Comprobar prefijo/sufijo
- `.indexOf(text)` - Buscar posición (devuelve -1 si no se encuentra)
- `.replace(old, new)` - Reemplazar la primera aparición
- `.replaceAll(old, new)` - Reemplazar todas las apariciones
- `.regexReplace(pattern, replacement)` - Reemplazar con patrón regex
- `.hash()` - Hash MD5 del string
- `.base64Encode()` - Codificar texto UTF-8 como Base64 estándar
- `.base64Decode()` - Decodificar Base64 estándar a texto UTF-8
- `.urlEncode()` - Codificar string como URL
- `.urlDecode()` - Decodificar string de URL
- `.escape()` - Escapar string para JSON (convertir caracteres especiales a formato JSON)
- `.unescape()` - Desescapar string JSON (convertir formato JSON a string original)
- `.toJson()` - Parsear una cadena JSON a un objeto, array o valor

### Ejemplos de métodos de string
- `$profile.nickname.orEmpty()` - Convertir texto nulo/inexistente a una cadena vacía
- `$text.upper()` - Convertir a mayúsculas
- `$text.lower()` - Convertir a minúsculas
- `$text.strip()` - Eliminar espacios en blanco
- `$text.replace("old", "new")` - Reemplazar texto
- `$text.replaceAll("a", "b")` - Reemplazar todas las apariciones
- `$text.length` - Obtener longitud del string
- `$text.escape()` - Escapar caracteres especiales de JSON (ej., comillas, saltos de línea)
- `$escapedText.unescape()` - Desescapar una cadena con formato JSON de vuelta al original
- `$text.toJson()` - Parsear una cadena de objeto/array JSON (luego `$text.toJson().repoUrl`)
- `$toJson($text)` - Mismo parseo como función
- `$base64Encode("Héym 🌍")` - Devuelve `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Decodificar Base64 a texto UTF-8
- `$text.urlEncode()` - Codificar URL para parámetros de API
- `$encodedText.urlDecode()` - Decodificar texto codificado como URL

## Métodos de Array (sobre arrays)
- `.first()` - Obtener el primer elemento
- `.last()` - Obtener el último elemento
- `.random()` - Obtener un elemento aleatorio
- `.reverse()` - Invertir el array
- `.flat()` - Aplanar arrays anidados en un único array
- `.flat(depth)` - Aplanar con límite de profundidad
- `.distinct()` - Eliminar duplicados
- `.distinctBy(expr)` - Eliminar duplicados por expresión (ej. `$array.distinctBy("item.id")`)
- `.notNull()` - Eliminar valores nulos
- `.add(item)` - Añadir un elemento (devuelve un nuevo array)
- `.contains(item)` - Comprobar si el array contiene el elemento (devuelve un booleano)
- `.join(separator)` - Unir los elementos del array en una cadena
- `.filter(expr)` - Filtrar el array usando la variable `item` (ej. `$array.filter("item > 5")`)
- `.map(expr)` - Transformar cada elemento usando la variable `item` (ej. `$array.map("item.name")`)
- `.sort(expr, order)` - Ordenar por expresión; el orden es `"asc"` (por defecto) o `"desc"`
- `.take(n)` - Tomar los primeros N (positivo) o los últimos N (negativo) elementos
- `.length` - Longitud del array
- `.toString()` - Convertir a cadena JSON

### Ejemplos de Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Métodos de Object/Dictionary (sobre objetos)
- `.get(key)` - Obtener el valor por clave (devuelve null si no se encuentra)
- `.get(key, default)` - Obtener el valor por clave con un valor por defecto de reserva
- `.keys()` - Devolver una lista con todas las claves
- `.values()` - Devolver una lista con todos los valores
- `.entries()` - Devolver una lista de objetos `{key, value}` (uno por propiedad)
- `.filter(expr)` - Iterar las entradas `{key, value}` y devolver las entradas coincidentes como una lista (use `item.key` / `item.value` dentro de `expr`)
- `.map(expr)` - Iterar las entradas `{key, value}` y devolver una lista de valores transformados (use `item.key` / `item.value` dentro de `expr`)
- `.toString()` - Convertir a cadena JSON

### Ejemplos de iteración de objetos
Al iterar un objeto con `.map()` o `.filter()`, cada `item` es un par `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → lista de nombres de propiedades que no son nulas

## Fecha/Hora
- `$now` - Fecha y hora actual
- `$now.format("YYYY-MM-DD")` - Formatear fecha/hora
- `$now.toISO()` / `.toDate()` / `.toTime()` - Convertir formatos
- `$now.addDays(n)` / `.addHours(n)` - Aritmética de fechas
- `$Date("2024-01-15")` - Analizar una cadena de fecha

## Operaciones numéricas
- Matemáticas básicas: `+`, `-`, `*`, `/`, `%`
- Comparaciones: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Operadores booleanos: `and`, `or`, `not`

## Condiciones booleanas
Para booleanos, escriba la expresión directamente (no fuerce `== true`):
- Incorrecto: `$nodeName.isValid == true`
- Correcto: `$nodeName.isValid`
- Negación: `not $nodeName.isValid`

## Reglas y whitelist (crítico)
### Reglas de colocación de `$`
- Una expresión independiente normalmente comienza con un `$` inicial.
- Las cadenas de plantilla pueden contener múltiples `$refs`.
- Los parámetros de los métodos también pueden contener `$refs` anidados cuando se desea pasar el resultado de otra expresión (clave dinámica o resolución anidada).
  - Válido: `$node.method(other.field)` — `other` se resuelve desde el contexto como una etiqueta de nivel superior (sin `$` dentro del argumento).
  - Válido: `$node.method($other.field)` — el `$` anidado es compatible con la vista previa del diálogo de evaluación y la evaluación de condiciones.
  - Válido: `$array($a.x, $b.y)`
  - El autocompletado dentro de `.get(` inserta rutas **simples** `label.field` (sin `$` inicial), igual que dentro de `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Si el valor enviado completo es una única ruta con puntos **sin** un `$` inicial (por ejemplo, texto seleccionado en el editor, como `execute.outputs.output.result.today`), el backend lo trata igual que `$execute.outputs.output.result.today`. Los valores que contienen un salto de línea o retorno de carro tras el recorte no se reescriben (evita payloads multilínea ambiguos). Se recomienda escribir `$` en los campos guardados del workflow; la reescritura es principalmente para inspección y herramientas.
- El resultado de `Run` del diálogo Evaluate es la fuente de verdad sobre cómo se resuelve una expresión concreta.

### Comillas en cadenas dentro de arrays
Al crear arrays con valores de cadena, use SIEMPRE comillas dobles:
- Correcto: `$array("hello", "world")`
- Incorrecto: `$array('hello', 'world')`

### USE ÚNICAMENTE ESTAS FUNCIONES (whitelist)
Use únicamente:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- métodos documentados de string/array/object

Si una función no aparece en la lista anterior, no existe.

### Límites de métodos de Arrays / Dicts
- Los arrays SOLO pueden usar: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Los Objects/Dicts SOLO pueden usar: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`

### Nombres de etiqueta de nodo reservados
No utilice estos nombres como etiquetas de nodo: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Ejemplos

**Condition**: `$input.text.length > 0`

**Mensaje de usuario del LLM**: `$input.text`

**Mensaje de salida**: `$llm.text`

**Valor de variable**: `$input.count + 1`

### Ejemplo de DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Relacionado

- [Diálogo de evaluación de expresiones](./expression-evaluation-dialog.md) – Editor expandible con vista previa en vivo del backend y autocompletado
- [Funciones del Canvas](./canvas-features.md) – Pin de datos para probar expresiones sin volver a ejecutar nodos
- [Tipos de nodo](./node-types.md) – Nodos que utilizan expresiones ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md), etc.)
- [Nota adhesiva](../nodes/sticky-note-node.md) – Notas markdown del Canvas con título editable, color y visualización de imágenes
- [Nodo de agente](../nodes/agent-node.md) – Uso de expresiones en prompts de agentes
- [Memoria persistente del agente](./agent-persistent-memory.md) – `persistentMemoryEnabled` y `memoryShares` en el `data` del agente (no son campos de expresión)
- [Estructura del workflow](./workflow-structure.md) – Campos `data` de los nodos que aceptan expresiones
- [Pestaña Credenciales](../tabs/credentials-tab.md) – Credenciales referenciadas por los nodos
- [Compartir credenciales](./credentials-sharing.md) – Comparta credenciales y utilice `$credentials` en expresiones
- [Variables globales](./global-variables.md) – Variables persistentes con `$global`
