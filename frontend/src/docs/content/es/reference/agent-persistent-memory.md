# Memoria persistente del Agent

Los nodos Agent pueden mantener un **grafo de conocimiento por nodo** almacenado en la base de datos: entidades (con tipos y propiedades) y relaciones entre ellas. Cuando está habilitado, Heym **inyecta un resumen de ese grafo en el system prompt** en cada ejecución (si el grafo no está vacío). Tras una ejecución exitosa, un **trabajo de extracción mediante LLM** fusiona nuevos hechos de la conversación en el grafo en segundo plano.

Los subagentes y orquestadores utilizan cada uno el grafo vinculado a **su propio nodo del canvas** de forma predeterminada. También puede **otorgar a otros agentes acceso de lectura o de lectura/escritura** al grafo de este nodo (incluidos agentes en **otros workflows** de su propiedad); consulte [Compartir con otros agentes](#sharing-with-other-agents).

## Habilitación

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Cuando es `true`, carga el grafo de este nodo en el system prompt y programa la extracción posterior a la ejecución para el grafo de este nodo |
| `memoryShares` | array (opcional) | Otorga a otros nodos Agent acceso al grafo de memoria de **este** nodo; consulte [Compartir](#sharing-with-other-agents) |

Actívelo en las propiedades del nodo Agent (**Persistent memory (graph)**). Un icono rosa de **cerebro** en el nodo abre el editor del grafo cuando la memoria está habilitada (o cuando se muestra un modelo).

## Editor del grafo

El diálogo representa las entidades como un grafo animado dirigido por fuerzas —círculos coloreados dimensionados según el número de conexiones y agrupados por tipo de entidad— además de edición y navegación (ajustar vista, organizar diseño, atajos de teclado). Puede **añadir, editar o eliminar** nodos y aristas manualmente; los selectores de relación Source/Target son buscables para grafos con muchas entidades. Al seleccionar un nodo se muestran sus conexiones salientes y entrantes, cada una enlazable para saltar a ese nodo. Los cambios se aplican únicamente al grafo de **este** agente (el grafo del nodo del canvas cuyo cerebro haya abierto).

## Compartir con otros agentes

En el diálogo del grafo de memoria, **Share memory with other agents** le permite adjuntar **pares** que pueden consumir este grafo en tiempo de ejecución:

1. Elija un **workflow** (cualquier workflow que pueda abrir en el editor).
2. Elija un nodo **agent** en ese workflow.
3. Establezca **Read only** o **Read & write**.

| Permiso | Efecto |
|------------|--------|
| Read only | Cuando se ejecuta el agente **par**, este grafo se fusiona en el system prompt del par (si tiene entidades). No se realiza extracción hacia este grafo desde la ejecución del par. |
| Read & write | Mismo comportamiento de prompt que read, y tras una finalización **exitosa** del par, la extracción de memoria habitual también puede **fusionarse en este grafo (propietario)** utilizando la credencial de la ejecución del par. |

Los pares se almacenan por nodo propietario como entradas `memoryShares` con `peerWorkflowId` y `peerCanvasNodeId` (y `permission`). Los workflows más antiguos pueden omitir `peerWorkflowId` para pares en el **mismo** workflow; el editor lo interpreta como el workflow actual.

El **uso compartido entre workflows** se resuelve en tiempo de ejecución escaneando los workflows **de su propiedad**. Las ejecuciones sin un contexto de usuario autenticado solo resuelven los shares definidos en el JSON del workflow **actual** (mismo canvas).

## Comportamiento en tiempo de ejecución

### Grafo propio (`persistentMemoryEnabled`)

1. **Antes de la llamada al LLM** — Si el grafo tiene entidades, se añade un bloque a la instrucción del sistema explicando que estos son hechos de ejecuciones previas (pueden estar incompletos; el mensaje actual del usuario prevalece en caso de conflicto).
2. **Tras una finalización exitosa** — Un trabajo en segundo plano solicita al modelo (misma credencial que la ejecución del agente) un JSON estructurado (entidades + relaciones). Ese payload se fusiona en la base de datos (se aplican deduplicación y limpieza de relaciones para algunos tipos, p. ej. aristas de tipo empleo).

### Par que recibe grafos compartidos

Cuando se ejecuta un agente, el sistema busca nodos **propietarios** (en cualquiera de sus workflows, cuando sea posible) cuyos `memoryShares` apunten al workflow y al nodo del canvas de esta ejecución. Para cada coincidencia, el grafo de ese propietario se añade como una sección de **shared memory** en el system prompt. Los pares con **Read & write** además programan destinos de extracción para el workflow/grafo del **propietario** cuando la ejecución finaliza con éxito.

La extracción **no** se ejecuta cuando la ejecución falla o termina en un estado pendiente de HITL.

## JSON del workflow (campo `data`)

Se persiste en el nodo Agent como el resto de ajustes:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` es `"read"` o `"write"`. Omita `memoryShares` o use `[]` cuando no haya uso compartido.

Consulte [Workflow Structure](./workflow-structure.md) para conocer la forma completa del objeto de nodo.
## Relacionado

- [Nodo Agent](../nodes/agent-node.md) — Configuración completa del agente
- [Arquitectura del agente](./agent-architecture.md) — Orquestador, subagentes, herramientas
- [Estructura del workflow](./workflow-structure.md) — Formato JSON del workflow
- [Funciones del Canvas](./canvas-features.md) — Control del Brain y diálogo del grafo
- [Pestaña Trazas](../tabs/traces-tab.md) — Observabilidad de solicitudes/respuestas del LLM
