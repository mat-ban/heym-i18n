# Estrutura do Workflow

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

### `data` do Nó Agente (memória persistente)

Os nós [Agente](../nodes/agent-node.md) suportam um grafo de conhecimento opcional por nó do canvas:

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Quando `true`, carrega o grafo armazenado no system prompt e mescla novos fatos após execuções bem-sucedidas |
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

Consulte [Memória Persistente do Agente](./agent-persistent-memory.md) para caminhos de API, comportamento do editor e semântica de extração.

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

Valores comuns de `type`: [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agente](../nodes/agent-node.md), [Condição](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [Mapeador de saída JSON](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variável](../nodes/variable-node.md), [Loop](../nodes/loop-node.md), entre outros. Lista completa: [Tipos de Nó](./node-types.md). Nós no mesmo nível de execução são executados em [paralelo](./parallel-execution.md).

## Layout do editor

Cada nó possui `position.x` e `position.y` para o layout do canvas desktop. Em telas abaixo do
breakpoint de 768px, o editor substitui o canvas livre do Vue Flow por uma árvore de workflow
em tela cheia e indentada. A árvore segue os caminhos de execução conectados, marca ramificações
paralelas e utiliza os mesmos rótulos de nó, ícones e status da última execução do editor desktop.

Toque em um nó para selecioná-lo. Se ele tiver um resultado de execução registrado, seu detalhe em
tela cheia será aberto com abas de entrada, saída e erro. A navegação inferior móvel oferece **Nodes**,
**Properties**, **Run** e **More**; o cabeçalho mantém as ações de salvar, histórico, busca, configurações e compartilhamento.
O desktop continua a usar o canvas livre do Vue Flow e os painéis laterais.

Use **Add node** na aba Nodes móvel para pesquisar a biblioteca de nós. Um nó comum abre uma
folha de conexão imediatamente após ser adicionado: escolha um nó âncora e posicione-o **After**,
**Before** ou como uma ramificação **Parallel**. No modo de edição, toque em um nó comum existente para abrir a mesma
folha com sua conexão atual selecionada. Nós de Trigger permanecem independentes porque não aceitam
entrada comum. O controle de edição também expõe uma ação de remoção para o nó selecionado. Os detalhes de execução
incluem setas de anterior e próximo quando resultados de nós adjacentes
estão disponíveis. O Assistente de IA abre acima da árvore móvel como uma folha inferior, sem
alterar a aba ativa do editor.

## Relacionados

- [Tipos de Nó](./node-types.md) – Todos os tipos de nó e descrições
- [Recursos do Canvas](./canvas-features.md) – Recursos do editor (data pin, logs de execução, habilitar/desabilitar, extrair para sub-workflow)
- [Download e Importação](./download-import.md) – Exportar e importar workflows como JSON
- [Nó Agente](../nodes/agent-node.md) – Estrutura `data` do Nó Agente
- [Memória Persistente do Agente](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` e API do grafo de memória
- [Expression DSL](./expression-dsl.md) – Sintaxe para `userMessage`, `condition`, `$vars`, `$global`, etc.
- [Execução Paralela](./parallel-execution.md) – Como os nós são executados em paralelo
- [Triggers](./triggers.md) – Nós iniciais e pontos de entrada
- [Aba Workflows](../tabs/workflows-tab.md) – Criar e gerenciar workflows
