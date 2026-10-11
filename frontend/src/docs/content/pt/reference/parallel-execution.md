# Execução Paralela

O Heym executa nós em paralelo quando estes não possuem dependências entre si e permite que múltiplas execuções de Workflow sejam executadas simultaneamente.

## Dentro de uma Única Execução

### Agendamento Baseado em DAG

O executor agrupa os nós por **nível de execução** utilizando um grafo acíclico dirigido (DAG):

1. **Nível 0** – Nós sem arestas de entrada (nós iniciais)
2. **Nível N** – Nós cujas dependências a montante estão todas nos níveis 0..N-1

Os nós no mesmo nível não possuem dependências entre si e são executados em paralelo.

### Pool de Threads

- **Pool compartilhado**: `ThreadPoolExecutor(max_workers=8)` para execução de nós
- **Agendamento**: `wait(..., return_when=FIRST_COMPLETED)` – assim que qualquer nó é concluído, os nós a jusante são agendados
- **Thread-safe**: As saídas dos nós são armazenadas com um lock (`store_node_output`)

### Sub-Agentes do Orquestrador

Quando um agente orquestrador retorna múltiplas chamadas de ferramenta `call_sub_agent` em um único turno, estas são executadas em paralelo. Consulte [Arquitetura de Agentes](./agent-architecture.md).

### Nó Merge

O nó [Merge](../nodes/merge-node.md) combina saídas de múltiplos ramos paralelos. Utilize-o quando precisar combinar resultados explicitamente; caso contrário, os ramos paralelos podem terminar em nós de saída separados.

### Loops

As iterações de loop são executadas **sequencialmente**. Os nós do corpo do loop são reagendados a cada iteração.

### Retorno Antecipado

Os nós de saída com `allowDownstream` podem retornar antecipadamente. O trabalho a jusante restante é executado em segundo plano.

## Execuções Concorrentes de Workflow

- **Sem lock por Workflow** – Múltiplas requisições podem executar o mesmo Workflow ao mesmo tempo
- **API assíncrona** – Os endpoints FastAPI utilizam `asyncio.to_thread(execute_workflow)` para que o event loop permaneça responsivo
- **Isolamento** – Cada execução obtém sua própria instância e estado de `WorkflowExecutor`

Os Triggers que executam Workflows ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) chamam `execute_workflow` de forma independente.

## Streaming

O streaming utiliza o mesmo modelo paralelo, mas emite eventos à medida que os nós são concluídos. O editor e a interface de Chat do portal utilizam streaming internamente para progresso em tempo real, e os usuários de Webhook agora podem optar pelo mesmo fluxo de eventos através do endpoint de execução [SSE Streaming](./sse-streaming.md).

## Relacionados

- [Por que o Heym](../getting-started/why-heym.md) – Execução paralela de DAG no runtime do Heym
- [Estrutura de Workflow](./workflow-structure.md) – Nós, arestas e fluxo de execução
- [Conceitos Fundamentais](../getting-started/core-concepts.md) – Visão geral do fluxo de execução
- [Tipos de Nó](./node-types.md) – Nó [Merge](../nodes/merge-node.md) e outros tipos
- [Triggers](./triggers.md) – Pontos de entrada que disparam execuções
- [SSE Streaming](./sse-streaming.md) – Formato do fluxo de eventos para `/execute/stream`