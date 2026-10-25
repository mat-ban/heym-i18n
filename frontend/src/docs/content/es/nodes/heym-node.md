# Heym

El nodo **Heym** lee los datos propios de Heym: los workflows a los que puede acceder, la estructura de un workflow y su historial de ejecución. Es la forma de construir meta-workflows: inventarios de instancias, resúmenes de ejecución e informes de estado sobre el propio Heym.

## Descripción general

| Propiedad | Valor |
|----------|-------|
| Entradas | 1 |
| Salidas | 1 |
| Operaciones | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Credencial | Ninguna requerida |

## Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `heymOperation` | Select | Qué lectura realizar |
| `heymWorkflowId` | UUID | Establézcalo en `all` en `getExecutionHistory` para leer todos los workflows accesibles. |
| `heymLimit` | String | Número máximo de filas a devolver. **Déjelo vacío o introduzca `0` para devolver todo** — ese es el valor predeterminado. Admite expresiones. |
| `heymStatus` | String | Filtro de estado opcional para `getExecutionHistory`. Admite expresiones. |
| `heymSinceDays` | String | Retrospectiva opcional en días para `getExecutionHistory`. Admite expresiones. |

El selector de workflows es un menú desplegable con búsqueda que lista todos los workflows a los que puede acceder. En {GEH}, su primer elemento es **{AW}**. En {GEH}, su primer elemento es **{AW}**.

## Ámbito de acceso

Los resultados están limitados al **propietario del workflow en el que reside el nodo**, no a quien haya iniciado la ejecución. El conjunto visible es:

- los workflows que posee el propietario,
- los workflows compartidos directamente con el propietario,
- los workflows compartidos con un equipo al que pertenece el propietario.

El ámbito basado en el propietario es lo que hace que el nodo se comporte de forma idéntica tanto si una ejecución se inició manualmente, por cron, desde un portal o mediante un evento de la plataforma. El ámbito basado en el actor no devolvería nada en cada ejecución no atendida. Es la misma regla que Heym ya utiliza para las credenciales y las variables globales.

Un workflow al que no puede acceder y un workflow que no existe producen el mismo mensaje de error, por lo que el nodo no puede utilizarse para sondear ids de workflows.

## Operaciones

### List Workflows

Devuelve todos los workflows a los que puede acceder el propietario, ordenados por fecha de actualización más reciente primero.

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.workflows` | Array de resúmenes de workflows |
| `$nodeLabel.workflows[0].id` | UUID del workflow |
| `$nodeLabel.workflows[0].name` | Nombre del workflow |
| `$nodeLabel.workflows[0].description` | Descripción, o `null` |
| `$nodeLabel.workflows[0].active` | Si el workflow está activo |
| `$nodeLabel.workflows[0].folder_id` | UUID de la carpeta, o `null` |
| `$nodeLabel.workflows[0].updated_at` | Marca de tiempo ISO del último guardado |
| `$nodeLabel.workflows[0].node_count` | Cuántos nodos contiene el workflow |
| `$nodeLabel.total` | Recuento total accesible **antes** de aplicar el límite |

`total` es deliberadamente el recuento sin límite, de modo que `$inventory.total` sigue informando del tamaño real aunque limite las filas devueltas. Si deja **Limit** vacío, o lo establece en `0`, se devuelven todos los workflows — que es el valor predeterminado.

### Get Workflow

Devuelve la identidad y la forma de un workflow.

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Identidad del workflow |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Metadatos del workflow |
| `$nodeLabel.node_count` | Número de nodos |
| `$nodeLabel.nodes` | Array de `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Array de `{ id, source, target, sourceHandle, targetHandle }` |

`data` es la **configuración completa del nodo** — cada campo tal como se guardó. Eso es lo que hace posible la auditoría: no se puede escanear un workflow en busca de una clave de API que alguien haya pegado en un campo si el nodo se niega a mostrar el campo.

Esto no otorga ningún alcance que el invocador no tuviera ya. El nodo está limitado a los workflows que el propietario puede abrir de todos modos en el editor, y los secretos de credenciales almacenados siguen sin estar aquí: los datos del nodo contienen únicamente **ids** de credenciales, mientras que los secretos en sí residen cifrados en la tabla de credenciales.

### Escaneo de secretos codificados de forma fija

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Proporcione al agent `$detail.nodes` y pídale que señale cualquier valor de `data` que parezca una clave o un token activos. Los campos que conviene vigilar son los de texto libre — `curl` en los nodos HTTP, `userMessage` y `systemInstruction` en los nodos LLM y Agent, y los cuerpos de las herramientas Python — porque un id de credencial es un UUID inofensivo, pero un `sk-…` pegado no lo es.
### Obtener el historial de ejecuciones

Devuelve las entradas del historial de ejecuciones de un workflow, o de todos los workflows accesibles cuando elige **{AW}**, las más recientes primero.

| Expresión | Descripción |
|------------|-------------|
| `$nodeLabel.executions` | Array de entradas del historial |
| `$nodeLabel.executions[0].id` | UUID de la ejecución |
| `$nodeLabel.executions[0].status` | `success`, `error`, etc. |
| `$nodeLabel.executions[0].started_at` | Marca de tiempo ISO |
| `$nodeLabel.executions[0].execution_time_ms` | Duración en tiempo real |
| `$nodeLabel.executions[0].trigger_source` | Qué inició la ejecución, por ejemplo `cron` o `heym_event` |
| `$nodeLabel.executions[0].recovered` | Indica si la ejecución se recuperó tras un fallo |
| `$nodeLabel.executions[0].inputs` | Lo que recibió la ejecución: el payload del trigger o la entrada del invocador |
| `$nodeLabel.executions[0].outputs` | La salida del workflow para esa ejecución |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | El workflow al que pertenece el historial, o `null` con **{AW}** |
 `null` con **{AW}** |
| `$nodeLabel.total` | Total de ejecuciones coincidentes **antes** del límite |
| `$nodeLabel.by_st| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Con **{AW}**, el workflow al que pertenece cada ejecución |
atus` | Recuentos indexados por estado, por ejemplo `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Inicio de la ventana, o `null` para el historial completo |

Las entradas incluyen tanto `inputs` como `outputs` —lo que recibió la ejecución y lo que respondió—, pero nunca `node_results`: la traza por nodo es la columna más grande de la tabla y eclipsaría todo lo demás. Obtenga una única ejecución a través de la API cuando necesite la traza completa.

`total` y `by_status` siempre describen el historial coincidente **completo**, incluso cuando **Limit** limita las entradas devueltas, de modo que puede obtener las cinco ejecuciones más recientes y aun así informar un recuento de fallos preciso.

Deje **Since (days)** vacío para abarcar todo, **Status filter** vacío para incluir todos los estados, y **Limit** vacío o `0` para devolver todas las entradas.

## Workflow de ejemplo

**Resumen diario de instancias**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` etiquetado como `inventory`
- **Loop** sobre `$inventory.workflows`
- **Heym** `getExecutionHistory` con `heymWorkflowId` establecido en el `id` del elemento del loop, `heymSinceDays` de `1` y `heymLimit` de `5`
- **LLM** convierte las ejecuciones recopiladas y los recuentos de estado en un resumen legible

## Notas

- No se necesita ninguna credencial; el nodo lee la misma base de datos sobre la que se ejecuta Heym.
- **Limit** es el mismo campo para ambas operaciones de listado, y significa lo mismo en ambas: vacío o `0` devuelve todo.
- El nodo acepta una entrada normal y puede adjuntarse a un Nodo Agent como herramienta, de modo que un agente puede responder preguntas sobre su instancia de Heym, o auditarla.
- Los payloads de `getWorkflow` crecen con el workflow: los prompts largos y los cuerpos de las herramientas de Python viajan dentro de `data`.
- Combínelo con [Heym Trigger](./heym-trigger-node.md) para reaccionar a los cambios del workflow a medida que ocurren, en lugar de sondear según una programación.

## Relacionado

- [Heym Trigger](./heym-trigger-node.md) – Iniciar un workflow a partir de eventos de la plataforma
- [Execute](./execute-node.md) – Ejecutar otro workflow en lugar de describirlo
- [Loop](./loop-node.md) – Iterar sobre la lista de workflows devuelta
