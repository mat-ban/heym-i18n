# Memória Persistente de Agent

Os nós de agente podem manter um **grafo de conhecimento por nó** armazenado no banco de dados: entidades (com tipos e propriedades) e relacionamentos entre elas. Quando habilitado, o Heym **injeta um resumo desse grafo no prompt de sistema** a cada execução (caso o grafo não esteja vazio). Após uma execução bem-sucedida, um **job de extração por LLM** mescla novos fatos da conversa ao grafo em segundo plano.

Sub-agentes e orquestradores utilizam, por padrão, o grafo vinculado ao **seu próprio nó de canvas**. Você também pode **conceder a outros agentes acesso de leitura ou leitura/escrita** ao grafo deste nó (incluindo agentes em **outros workflows** que você possui) — consulte [Compartilhamento com outros agentes](#compartilhamento-com-outros-agentes).

## Habilitação

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `persistentMemoryEnabled` | boolean | Quando `true`, carrega o grafo deste nó no prompt de sistema e agenda a extração pós-execução para o grafo deste nó |
| `memoryShares` | array (opcional) | Concede a outros nós de agente acesso ao grafo de memória **deste** nó; consulte [Compartilhamento](#compartilhamento-com-outros-agentes) |

Ative-o nas propriedades do nó de agente (**Memória persistente (grafo)**). Um ícone rosa de **cérebro** no nó abre o editor de grafo quando a memória está habilitada (ou quando um modelo é exibido).

## Editor de grafo

O diálogo renderiza entidades como um grafo animado, direcionado por força — círculos coloridos dimensionados pela contagem de conexões e agrupados por tipo de entidade — além de edição e navegação (ajustar visualização, organizar layout, atalhos de teclado). Você pode **adicionar, editar ou excluir** nós e arestas manualmente; os seletores de relacionamento Origem/Destino são pesquisáveis para grafos com muitas entidades. Selecionar um nó exibe suas conexões de saída e de entrada, cada uma clicável para saltar até aquele nó. As alterações se aplicam apenas ao grafo **deste** agente (o grafo do nó de canvas cujo cérebro você abriu).

## Compartilhamento com outros agentes

No diálogo do grafo de memória, **Compartilhar memória com outros agentes** permite anexar **pares** que podem consumir este grafo em tempo de execução:

1. Escolha um **workflow** (qualquer workflow que você consiga abrir no editor).
2. Escolha um nó de **agente** nesse workflow.
3. Defina **Somente leitura** ou **Leitura e escrita**.

| Permissão | Efeito |
|-----------|--------|
| Somente leitura | Quando o agente **par** é executado, este grafo é mesclado ao prompt de sistema do par (caso tenha entidades). Não há extração para este grafo a partir da execução do par. |
| Leitura e escrita | Mesmo comportamento de prompt que a leitura, e após uma conclusão **bem-sucedida** do par, a extração de memória usual também pode **mesclar neste grafo (do proprietário)** usando a credencial da execução do par. |

Os pares são armazenados por nó proprietário como entradas `memoryShares` com `peerWorkflowId` e `peerCanvasNodeId` (e `permission`). Workflows mais antigos podem omitir `peerWorkflowId` para pares no **mesmo** workflow; o editor trata isso como o workflow atual.

O **compartilhamento entre workflows** é resolvido em tempo de execução varrendo os workflows **que você possui**. Execuções sem contexto de usuário autenticado resolvem apenas compartilhamentos definidos no JSON do workflow **atual** (mesmo canvas).

## Comportamento em tempo de execução

### Grafo próprio (`persistentMemoryEnabled`)

1. **Antes da chamada ao LLM** — Se o grafo tiver entidades, um bloco é anexado à instrução de sistema explicando que estes são fatos de execuções anteriores (podem estar incompletos; a mensagem atual do usuário prevalece em caso de conflito).
2. **Após uma conclusão bem-sucedida** — Um job em segundo plano solicita ao modelo (mesma credencial da execução do agente) um JSON estruturado (entidades + relacionamentos). Esse payload é mesclado ao banco de dados (aplicam-se deduplicação e limpeza de relacionamentos para alguns tipos, por exemplo, arestas no estilo de vínculo empregatício).

### Par recebendo grafos compartilhados

Quando um agente é executado, o sistema localiza nós **proprietários** (em qualquer um dos seus workflows, quando possível) cujos `memoryShares` apontam para o workflow e o nó de canvas desta execução. Para cada correspondência, o grafo daquele proprietário é anexado como uma seção de **memória compartilhada** no prompt de sistema. Pares com **Leitura e escrita** também agendam destinos de extração para o workflow/grafo do **proprietário** quando a execução é bem-sucedida.

A extração **não** é executada quando a execução falha ou termina em um estado pendente de HITL.

## JSON do Workflow (campo `data`)

Persistido no nó de agente como outras configurações:

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

`permission` é `"read"` ou `"write"`. Omita `memoryShares` ou use `[]` quando não houver compartilhamento.

Consulte [Workflow Structure](./workflow-structure.md) para o formato completo do objeto de nó.

## Relacionados

- [Agent Node](../nodes/agent-node.md) — Configuração completa do agente
- [Agent Architecture](./agent-architecture.md) — Orquestrador, sub-agentes, ferramentas
- [Workflow Structure](./workflow-structure.md) — Formato JSON do workflow
- [Canvas Features](./canvas-features.md) — Controle de cérebro e diálogo de grafo
- [Traces tab](../tabs/traces-tab.md) — Observabilidade de requisição/resposta do LLM
