# Ejecución en paralelo

Heym ejecuta nodos en paralelo cuando no tienen dependencias entre sí, y permite que múltiples ejecuciones de un workflow se ejecuten de forma concurrente.

## Dentro de una única ejecución

### Planificación basada en DAG

El ejecutor agrupa los nodos por **nivel de ejecución** utilizando un grafo acíclico dirigido (DAG):

1. **Nivel 0** – Nodos sin aristas entrantes (nodos de inicio)
2. **Nivel N** – Nodos cuyas dependencias ascendentes se encuentran todas en los niveles 0..N-1

Los nodos de un mismo nivel no tienen dependencias entre sí y se ejecutan en paralelo.

### Pool de hilos

- **Pool compartido**: `ThreadPoolExecutor(max_workers=8)` para la ejecución de nodos
- **Planificación**: `wait(..., return_when=FIRST_COMPLETED)` – tan pronto como finaliza cualquier nodo, se planifican los nodos descendientes
- **Thread-safe**: las salidas de los nodos se almacenan con un lock (`store_node_output`)

### Subagentes del orquestador

Cuando un agente orquestador devuelve múltiples llamadas a la herramienta `call_sub_agent` en un mismo turno, estas se ejecutan en paralelo. Consulte [Agent Architecture](./agent-architecture.md).

### Nodo Merge

El nodo [Merge](../nodes/merge-node.md) combina las salidas de múltiples ramas paralelas. Utilícelo cuando necesite explícitamente combinar resultados; de lo contrario, las ramas paralelas pueden finalizar en nodos de salida separados.

### Bucles

Las iteraciones de un bucle se ejecutan de forma **secuencial**. Los nodos del cuerpo del bucle se replanifican en cada iteración.

### Retorno anticipado

Los nodos de salida con `allowDownstream` pueden retornar de forma anticipada. El trabajo descendiente restante se ejecuta en segundo plano.

## Ejecuciones concurrentes de workflows

- **Sin lock por workflow** – Múltiples solicitudes pueden ejecutar el mismo workflow al mismo tiempo
- **API asíncrona** – Los endpoints de FastAPI utilizan `asyncio.to_thread(execute_workflow)` para que el bucle de eventos se mantenga receptivo
- **Aislamiento** – Cada ejecución obtiene su propia instancia de `WorkflowExecutor` y su propio estado

Los Triggers que ejecutan workflows ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) llaman a `execute_workflow` de forma independiente.

## Streaming

El streaming utiliza el mismo modelo paralelo, pero emite eventos a medida que los nodos finalizan. La interfaz de chat del editor y del portal utilizan streaming internamente para el progreso en tiempo real, y los usuarios de webhook ahora pueden optar por el mismo flujo de eventos a través del endpoint de ejecución de [SSE Streaming](./sse-streaming.md).

## Relacionado

- [Why Heym](../getting-started/why-heym.md) – Ejecución DAG en paralelo en el runtime de Heym
- [Workflow Structure](./workflow-structure.md) – Nodos, aristas y flujo de ejecución
- [Core Concepts](../getting-started/core-concepts.md) – Descripción general del flujo de ejecución
- [Node Types](./node-types.md) – Nodo [Merge](../nodes/merge-node.md) y otros tipos
- [Triggers](./triggers.md) – Puntos de entrada que activan ejecuciones
- [SSE Streaming](./sse-streaming.md) – Formato del flujo de eventos para `/execute/stream`