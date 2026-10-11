# Diálogo de Evaluación de Expresiones

El Diálogo de Evaluación de Expresiones es el editor ampliado para campos compatibles con expresiones. Se abre desde el botón de expansión situado junto a un campo de expresión y le ofrece un espacio de trabajo más amplio, autocompletado, vista previa en vivo del backend y exploración de la salida en un solo lugar.

## Apertura del Diálogo

- Haga clic en el botón de expansión situado junto a un campo de expresión en el panel de Propiedades.
- Los campos multilínea muestran el botón dentro del campo de entrada.
- Los campos de una sola línea muestran el botón a la derecha del campo de entrada.

## Diseño del Diálogo

- El diálogo se abre como una ventana modal centrada de aproximadamente **80vw × 80vh**.
- El encabezado muestra **Evaluate — {nombre del campo}** cuando se conoce la etiqueta del campo.
- El editor conserva el autocompletado, la navegación entre campos y las acciones habituales **Apply** / **Cancel**.
- La vista previa se actualiza automáticamente unos **300 ms** después de que deje de escribir.
- Pulse `Ctrl` / `Cmd` + `Enter` para aplicar el texto actual al campo y cerrar el diálogo (igual que **Apply**).

## Sección de Salida

El área de Salida se actualiza automáticamente después de que haga una pausa al escribir en el editor.

### Evaluación

| Tipo de expresión | Resultado |
|---|---|
| Un único `$expr` (campo completo) | Se conserva el valor nativo |
| Una única ruta de punto sin prefijo (campo completo, sin `$`, sin salto de línea incrustado) | Igual que `$` + esa ruta (el backend la normaliza para la evaluación) |
| Texto con `$refs` incrustados | El resultado final es siempre una cadena |
| Texto literal (sin `$`, no es una única ruta de punto) | Se devuelve tal cual |

**Ejemplos**

| Entrada | Resultado |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (igual que `$input.items` cuando el valor completo es esta ruta) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

El contexto de evaluación se construye en este orden:

- **Datos fijados** en los nodos anteriores
- **Salidas de la última ejecución** del canvas
- `null` cuando no hay datos anteriores disponibles

Si el nodo actual tiene dependencias anteriores pero ninguna de ellas tiene datos fijados ni un resultado de ejecución reciente, el diálogo realiza primero una ejecución de prueba para construir el contexto y, a continuación, evalúa el texto actual.

### Selector de Rutas de Salida

Cuando el resultado del backend es un objeto o un array, el área de Salida puede mostrar un selector de rutas interactivo en lugar del JSON sin procesar.

- Haga doble clic en una fila para añadir esa ruta a la referencia `$node.path` actual.
- Haga un solo clic en las filas expandibles para abrir o cerrar ramas.
- Utilice el cuadro de consulta integrado para buscar claves, valores y cadenas de ruta.

## Autocompletado

- Escriba `$` para abrir las sugerencias de nodos anteriores, elementos integrados y métodos.
- Pulse `Tab` o `Enter` para insertar la sugerencia seleccionada.
- Utilice `↑` / `↓` para desplazarse por la lista de sugerencias.

### Respuestas de Ejemplo

Cuando continúe una referencia `$…` con un punto, cada fila de sugerencia muestra la respuesta que produciría esa sugerencia, en negrita a la derecha de la fila.

- Al escribir `$set.listItems.first().toString().u` se listan `upper`, `urlEncode`, `urlDecode` y `unescape`, cada uno con su resultado evaluado, de modo que puede elegir por resultado en lugar de por nombre.
- Al escribir `$node.text.toJson()` se analiza una cadena JSON y se convierte en un objeto o array. Después de `.toJson()`, el autocompletado puede ofrecer las claves analizadas (por ejemplo, `repoUrl`) cuando hay disponibles salidas de la última ejecución o datos fijados.
- Los resultados se evalúan en el backend con los mismos datos fijados y salidas de la última ejecución que utiliza la vista previa del diálogo, por lo que coinciden con lo que producirá el campo.
- Solo se evalúan las sugerencias que se sostienen por sí mismas: métodos sin argumentos (`upper()`, `first()`, `keys()`, `toJson()`) y propiedades simples (`length`, `year`). Las sugerencias que necesitan argumentos primero — `map`, `filter`, `sort`, `replace` — se dejan en blanco.
- Una fila permanece en blanco cuando el candidato no produce ninguna respuesta: un error, un `null` o un método que no se aplica a ese valor.
- Las respuestas se abrevian a una sola línea. Pase el cursor sobre una respuesta abreviada para ver más de ella.

## Build with AI

El botón **Build with AI** aparece en la esquina superior derecha del diálogo de evaluación cuando hay un workflow cargado. Abre una ventana modal anidada en la que puede describir en texto plano la expresión que desea y hacer que un LLM la genere por usted.

### Cómo funciona

1. Haga clic en **Build with AI** en la barra de herramientas del diálogo de evaluación.
2. Seleccione una credencial de LLM y un modelo en los menús desplegables.
3. Escriba una descripción en texto plano de lo que desea; por ejemplo, *"Get the customer name from the API response"*.
4. Haga clic en **Generate**. La ventana modal llama al backend, que utiliza el prompt del sistema del [Expression DSL](./expression-dsl.md) junto con las salidas de la última ejecución del workflow como contexto, y devuelve una única cadena de expresión.
5. La expresión generada se evalúa inmediatamente con los mismos datos del canvas, de modo que puede ver el resultado antes de aplicarla.
6. Haga clic en **Apply** para reemplazar el contenido del editor con la expresión generada, o en **Regenerate** para intentarlo de nuevo.

### Contexto utilizado

El generador recibe las salidas de los nodos de la última ejecución de prueba en el canvas. Si el workflow aún no se ha ejecutado, el LLM genera una expresión de mejor esfuerzo basándose en las etiquetas de los nodos y las convenciones del DSL.
### Requisitos

- Se debe configurar una credencial de LLM (OpenAI, Google o Custom) en la pestaña [Credenciales](./credentials.md).
- El workflow debe estar abierto en el editor.

## Atajos de teclado

| Atajo | Acción |
|---|---|
| Pausa al escribir (~300 ms) | Actualizar la vista previa del backend |
| `Ctrl` / `Cmd` + `Enter` | Aplicar y cerrar el diálogo |
| `Escape` | Cerrar primero el autocompletado; de lo contrario, cerrar el diálogo |

## `$` anidado en argumentos de método

Para la evaluación en diálogo / backend, puede pasar otra referencia con un `$` anidado dentro de llamadas como `.get($other.field)` cuando necesite una clave dinámica. También puede utilizar una ruta simple dentro de `.get(...)` (por ejemplo, `other.field`); el backend la resuelve de la misma manera. Los campos guardados del workflow deben seguir las reglas del [Expression DSL](./expression-dsl.md); la API de evaluación también acepta una ruta de puntos simple en una línea completa por comodidad (consulte la tabla anterior).

## Navegación

Los editores de mapeo de Set y Execute pueden mostrar botones **Prev** / **Next** para que pueda moverse entre campos sin cerrar el diálogo.

## Relacionado

- [Expression DSL](./expression-dsl.md)
- [Tipos de nodo](./node-types.md)
- [Credenciales](./credentials.md) — necesarias para la función Build with AI
- [Nodo LLM](../nodes/llm-node.md)
- [Nodo Output](../nodes/output-node.md)
- [Nodo Condition](../nodes/condition-node.md)
