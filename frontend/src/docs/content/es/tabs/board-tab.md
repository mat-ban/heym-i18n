# Board

La pestaña **Board** es un tablero kanban agéntico. El trabajo avanza por columnas y cada
columna puede ejecutar workflows de Heym. Una tarjeta no es solo una tarea: es un trabajo
agéntico persistente que conserva contexto, historial de conversación, estado de ejecución,
salidas y ejecuciones de workflows.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Tableros y columnas

- Puede crear tantos tableros como necesite. Un tablero nuevo comienza con las columnas
  predeterminadas **Backlog → Planning → Development → Done**.
- Todo tablero necesita un **Agentic Kanban Model** (una credencial más un modelo). Es
  obligatorio —el diálogo de nuevo tablero no creará un tablero sin él, y un tablero que
  no lo tenga mantendrá sus acciones deshabilitadas— porque es el modelo el que asigna cada
  tarjeta a las entradas de los workflows que ejecuta y convierte su salida de nuevo en
  texto legible.
- El icono de engranaje en la cabecera del tablero abre la configuración del tablero: nombre,
  descripción (mostrada bajo la cabecera) y el Agentic Kanban Model.
- Las columnas son totalmente editables: añádalas, renómbrelas, recoloréelas, reordénelas o
  elimínelas desde la configuración de la columna (una columna debe estar vacía antes de poder
  eliminarla).
- Las tarjetas se ordenan verticalmente por prioridad: arrastre para reordenarlas.
- También puede crear una tarjeta desde la [pestaña Chat](./chat-tab.md) con una solicitud en
  lenguaje natural. Chat solicita seleccionar un tablero cuando es necesario y siempre añade
  la tarjeta a la primera columna de ese tablero.

## Compartir un tablero

La configuración del tablero también permite compartirlo con **usuarios** (por correo
electrónico) y con **equipos**, con permiso de `read` o `write`:

- **read** — el tablero y sus tarjetas son visibles, pero no se puede cambiar nada: ni nuevas
  tarjetas, ni movimientos, ni comentarios, ni ejecuciones.
- **write** — uso completo del tablero: tarjetas, movimientos, comentarios y ejecuciones.
- Solo el **propietario** ve el engranaje y los botones de eliminación, y solo el propietario
  puede cambiar la configuración del tablero, su Agentic Kanban Model o sus recursos
  compartidos.

Las cadenas en un tablero compartido siempre se ejecutan con las credenciales y el Agentic
Kanban Model del **propietario**, de modo que los colaboradores nunca necesitan los suyos.

## Adjuntos de tarjeta

Abra una tarjeta y use **Attach file** para añadirle archivos: suéltelos en el cuadro o
selecciónelos con el botón, y elimínelos desde la misma lista. Los adjuntos se almacenan en
[Drive](./drive-tab.md).

Cada ejecución **resuelve los adjuntos antes de que comiencen los workflows**, por tipo:

- Los **documentos** (pdf, markdown, csv, json, texto) se extraen a texto, con un límite de
  20.000 caracteres por archivo, en el campo `text` del adjunto.
- Las **imágenes** se entregan como una `url` que la ruta de visión carga directamente (la
  entrada de imagen de un Nodo LLM la acepta tal cual).
- **Cualquier otro tipo** se pasa como una referencia simple (`name`, `url`, `mime_type`).

Los workflows los leen en `$input.card.attachments` (y siempre en `$input.board.attachments`,
independientemente de lo que haya mapeado el mapper). El Agentic Kanban Model también ve el
texto extraído y las URL de las imágenes, de modo que puede asignar un adjunto directamente
al campo que espera un workflow.

## Cadenas de workflows por columna

Cada columna puede configurarse con una **lista ordenada de workflows** (la cadena).
Cuando una tarjeta se mueve a una columna que tiene una cadena:

1. La cadena se inicia automáticamente en segundo plano: el movimiento en sí nunca espera.
2. Los workflows se ejecutan **secuencialmente**. La salida de cada workflow se añade al
   contexto de la tarjeta antes de que comience el siguiente.
3. Si un workflow falla, la cadena se detiene: se omiten los eslabones restantes y la
   tarjeta se vuelve **roja**.
4. Cuando todos los eslabones tienen éxito, la tarjeta se vuelve **verde**. Mientras la
   cadena se ejecuta, la tarjeta pulsa en **ámbar**; una ejecución pausada para revisión
   humana muestra un estado ámbar estático.

Las ejecuciones se registran en el [Historial de ejecuciones](../reference/execution-history.md)
con el origen del trigger `board`, y cada tarjeta mantiene su propia lista de ejecuciones con
las salidas y los errores por workflow. Abra una tarjeta mientras un workflow se está
ejecutando y elija **Open live** junto a la ejecución para vincular el editor a esa ejecución
exacta. La misma animación del canvas, los logs de Debug incrementales y el resultado final
aparecen sin iniciar una segunda ejecución.

## Qué reciben los workflows

La cadena pasa un payload estándar como entrada del workflow. Léalo con
[expresiones](../reference/expression-dsl.md) normales como `$input.card.title`:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — todos los comentarios de la tarjeta, del más antiguo al más reciente.
- `history` — la cronología completa de actividad (comentarios, movimientos, salidas), limitada a las
  200 entradas más recientes.
- `previous_outputs` — salidas de ejecuciones completadas anteriormente (columnas previas y
  rondas de seguimiento).
- `chain.previous_workflow_outputs` — salidas de los eslabones anteriores en la cadena
  *actual*.
- En las rondas de seguimiento, `move` es `null` y `rerun` es `true`.

## El bucle de planificación (rondas de seguimiento)

Un patrón habitual consiste en colocar un workflow de planificación en la **segunda columna** (por defecto
denominada Planning — el nombre no importa; la posición sí). Ese workflow enriquece la
tarjeta y plantea preguntas de seguimiento:

1. Mueva una tarjeta a la segunda columna — el workflow escribe un plan enriquecido y sus
   preguntas de vuelta en la tarjeta como una salida.
2. Responda en el hilo de comentarios de la tarjeta. La respuesta libera la tarjeta: avanza a
   la siguiente columna, que la recoge con la respuesta en contexto. La cadena de la segunda columna
   no se ejecuta de nuevo.
3. Para mejorar el plan en su lugar, pulse **Run follow-up round**. La misma
   cadena se ejecuta de nuevo con todo el contexto acumulado, y después la tarjeta espera en esa columna
   hasta que añada un comentario para liberarla.

La puerta de planificación es posicional, no basada en el nombre: la columna más a la izquierda y la columna
inmediatamente a su derecha nunca avanzan por sí solas — ejecutan su cadena y esperan
allí (un comentario libera la segunda columna). A partir de la tercera columna, una
cadena exitosa avanza la tarjeta hacia la derecha por sí sola, hasta la última
columna. Renombrar o eliminar la etiqueta predeterminada "Planning" no cambia qué posición
es la puerta. Una tarjeta solo puede tener una ejecución activa a la vez.

## Human-in-the-loop y preguntas de Codex

Si un workflow de la cadena se pausa — en un nodo
[Human-in-the-Loop](../reference/human-in-the-loop.md), en una herramienta HITL de un agente, o
porque un nodo [Codex](../nodes/codex-node.md) necesita
más información — la ejecución se persiste como pendiente y la tarjeta muestra el estado
pendiente en ámbar. Cada pausa conserva su propia superficie de respuesta: un enlace de revisión HITL para HITL, la pantalla
de seguimiento de Codex para Codex.

Una vez que responda, la cadena se reanuda por sí sola: el workflow pausado finaliza, su salida
llega a la tarjeta, el resto de la cadena de esa columna se ejecuta y la tarjeta avanza como de costumbre.
Si la ejecución reanudada falla, la tarjeta se vuelve roja y los eslabones restantes se omiten.

## Relacionado

- [Workflows](./workflows-tab.md)
- [Historial de ejecuciones](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
