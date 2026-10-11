# Estrutura de Workflow

Os Workflows são armazenados como JSON com nós e arestas. Consulte [Tipos de Nó](./node-types.md) para os tipos de nó disponíveis e [Expression DSL](./expression-dsl.md) para a sintaxe de expressões nos campos `data`.

## Objeto Workflow

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Objeto Nó

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### `data` do nó de agente (memória persistente)

Os nós [Agente](../nodes/agent-node.md) suportam um grafo de conhecimento opcional por nó do canvas:

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Quando `true`, carrega o grafo armazenado para o prompt do sistema e integra novos factos após execuções bem-sucedidas |
| `memoryShares` | array (opcional) | Concede a outros agentes acesso ao grafo de memória deste nó (`peerWorkflowId`, `peerCanvasNodeId`, `permission`: `read` \| `write`). Consulte [Memória Persistente do Agente](./agent-persistent-memory.md). |

Exemplo:

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

Consulte [Memória Persistente do Agente](./agent-persistent-memory.md) para os caminhos da API, o comportamento do editor e a semântica de extração.

## Objeto Aresta

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Tipos de Nó

Valores comuns de `type`: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agente](../nodes/agent-node.md), [Condição](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [Mapeador de output JSON](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Espera](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [Envio WebSocket](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variável](../nodes/variable-node.md), [Loop](../nodes/loop-node.md), e mais. Lista completa: [Tipos de Nó](./node-types.md). Os nós no mesmo nível de execução são executados em [paralelo](./parallel-execution.md).

## Esquema do editor

Cada nó tem `position.x` e `position.y` para o esquema do canvas no ambiente de trabalho. Em ecrãs abaixo do ponto de quebra de 768px, o editor substitui o canvas livre do Vue Flow por uma árvore de workflow indentada em ecrã inteiro. A árvore segue os caminhos de execução conectados, marca ramificações paralelas e utiliza as mesmas etiquetas de nó, ícones e estado da última execução que o editor de ambiente de trabalho.

Toque num nó para o selecionar. Se tiver um resultado de execução registado, o seu detalhe em ecrã inteiro abre com separadores de input, output e erro. A navegação inferior móvel disponibiliza **Nós**, **Propriedades**, **Executar** e **Mais**; o cabeçalho mantém as ações de guardar, histórico, pesquisa, definições e partilha. O ambiente de trabalho continua a utilizar o canvas livre do Vue Flow e os painéis laterais.

Utilize **Adicionar nó** no separador Nós móvel para pesquisar a biblioteca de nós. Um nó regular abre imediatamente uma folha de conexão após ser adicionado: escolha um nó âncora e coloque-o **Depois**, **Antes** ou como uma ramificação **Paralela**. No modo de edição, toque num nó regular existente para abrir a mesma folha com a sua conexão atual selecionada. Os nós de trigger permanecem independentes porque não aceitam input regular. O controlo de edição também expõe uma ação de remoção para o nó selecionado. Os detalhes de execução incluem setas anterior e seguinte quando os resultados de nós adjacentes estão disponíveis. O Assistente de IA abre acima da árvore móvel como uma folha inferior, sem alterar o separador ativo do editor.

## Relacionado

- [Tipos de Nó](./node-types.md) – Todos os tipos de nó e descrições
- [Funcionalidades do Canvas](./canvas-features.md) – Funcionalidades do editor (data pin, registos de execução, ativar/desativar, extrair para sub-workflow)
- [Transferir e Importar](./download-import.md) – Exportar e importar workflows como JSON
- [Nó de Agente](../nodes/agent-node.md) – Estrutura `data` do nó de agente
- [Memória Persistente do Agente](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` e API do grafo de memória
- [Expression DSL](./expression-dsl.md) – Sintaxe para `userMessage`, `condition`, `$vars`, `$global`, etc.
- [Execução Paralela](./parallel-execution.md) – Como os nós são executados em paralelo
- [Triggers](./triggers.md) – Nós de início e pontos de entrada
- [Separador Workflows](../tabs/workflows-tab.md) – Criar e gerir workflows
