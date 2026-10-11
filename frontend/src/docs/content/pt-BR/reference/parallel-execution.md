# Execução Paralela

O Heym executa nós em paralelo quando eles não possuem dependências entre si e permite que múltiplas execuções de workflow sejam executadas simultaneamente.

## Dentro de uma Única Execução

### Agendamento Baseado em DAG

O executor agrupa os nós por **nível de execução** usando um grafo acíclico direcionado (DAG):

1. **Nível 0** – Nós sem arestas de entrada (nós iniciais)
2. **Nível N** – Nós cujas dependências upstream estão todas nos níveis 0..N-1

Nós no mesmo nível não possuem dependências entre si e são executados em paralelo.

### Thread Pool

- **Pool compartilhado**: `ThreadPoolExecutor(max_workers=8)` para execução de nós
- **Agendamento**: `wait(..., return_when=FIRST_COMPLETED)` – assim que qualquer nó termina, os nós downstream são agendados
- **Thread-safe**: As saídas dos nós são armazenadas com um lock (`store_node_output`)

### Sub-Agentes do Orquestrador

Quando um agente orquestrador retorna múltiplas chamadas de ferramenta `call_sub_agent` em um único turno, elas são executadas em paralelo. Consulte [Agent Architecture](./agent-architecture.md).

### Nó Merge

O nó [Merge](../nodes/merge-node.md) combina as saídas de múltiplos ramos paralelos. Utilize-o quando precisar explicitamente combinar resultados; caso contrário, os ramos paralelos podem terminar em nós de saída separados.

### Loops

As iterações de loop são executadas **sequencialmente**. Os nós do corpo do loop são reagendados a cada iteração.

### Retorno Antecipado

Nós de saída com `allowDownstream` podem retornar antecipadamente. O trabalho downstream restante é executado em segundo plano.

## Execuções Concorrentes de Workflow

- **Sem lock por workflow** – Múltiplas requisições podem executar o mesmo workflow ao mesmo tempo
- **API assíncrona** – Os endpoints do FastAPI utilizam `asyncio.to_thread(execute_workflow)` para que o event loop permaneça responsivo
- **Isolamento** – Cada execução recebe sua própria instância de `WorkflowExecutor` e seu próprio estado

Os Triggers que executam workflows ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) chamam `execute_workflow` de forma independente.

## Streaming

O streaming utiliza o mesmo modelo paralelo, mas emite eventos conforme os nós são concluídos. A interface de chat do editor e do portal utiliza streaming internamente para progresso em tempo real, e os usuários de webhook agora podem optar pelo mesmo fluxo de eventos através do endpoint de execução [SSE Streaming](./sse-streaming.md).

## Relacionados

- [Why Heym](../getting-started/why-heym.md) – Execução paralela de DAG no runtime do Heym
- [Workflow Structure](./workflow-structure.md) – Nós, arestas e fluxo de execução
- [Core Concepts](../getting-started/core-concepts.md) – Visão geral do fluxo de execução
- [Node Types](./node-types.md) – Nó [Merge](../nodes/merge-node.md) e outros tipos
- [Triggers](./triggers.md) – Pontos de entrada que disparam execuções
- [SSE Streaming](./sse-streaming.md) – Formato do fluxo de eventos para `/execute/stream`
