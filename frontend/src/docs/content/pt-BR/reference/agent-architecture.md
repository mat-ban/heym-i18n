# Arquitetura de Agentes

O [Nó Agente](../nodes/agent-node.md) oferece suporte a sub-agentes, sub-workflows, ferramentas de nós do canvas, um padrão de orquestrador, skills, conexões MCP, chamadas de ferramentas, [memória persistente](./agent-persistent-memory.md) opcional (por nó do canvas, com compartilhamento opcional para outros agentes) e [revisão humana](./human-in-the-loop.md) opcional. Esta página descreve a arquitetura.

## Sub-Agentes

Sub-agentes são nós de agente que um orquestrador pode chamar por meio da ferramenta `call_sub_agent`.

- **Orquestrador**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sub-agentes**: Devem usar `$input.text` em sua User Message para receberem o prompt do orquestrador
- **Ferramenta**: `call_sub_agent` com `sub_agent_label` (enum) e `prompt`
- **Limite de profundidade**: Máximo de 5 chamadas aninhadas de sub-agentes

### Fluxo de Execução

1. O orquestrador decide chamar um sub-agente
2. `_execute_sub_agent_tool` localiza o agente de destino pelo label
3. Monta `synthetic_inputs = {"input": {"text": prompt}}`
4. Executa `_execute_agent_node` para o sub-agente
5. O resultado é retornado ao orquestrador

### Execução Paralela de Sub-Agentes

Quando o orquestrador retorna múltiplas chamadas da ferramenta `call_sub_agent` em um único turno, elas são executadas **em paralelo**. Por exemplo, se o usuário perguntar sobre "Paris" e o orquestrador chamar tanto `distanceAgent` quanto `foodAgent`, ambos serão executados simultaneamente em vez de sequencialmente.

- **Benefício**: O tempo total é aproximadamente o do sub-agente mais lento, e não a soma de todos.
- **Dica**: Incentive o orquestrador a chamar múltiplos sub-agentes em um único turno quando a tarefa exigir.

## Sub-Workflows

Quando `subWorkflowIds` está configurado, o agente pode chamar outros workflows por meio da ferramenta `call_sub_workflow`.

- **Configuração**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Ferramenta**: `call_sub_workflow` com `workflow_id` (enum) e `inputs` (objeto)
- **Limite de profundidade**: Máximo de 5 chamadas aninhadas de sub-workflows

### Fluxo de Execução

1. O agente decide chamar um sub-workflow
2. `_execute_sub_workflow_tool` busca o workflow em `workflow_cache`
3. Monta `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Executa `WorkflowExecutor.execute()` para o sub-workflow
5. O resultado é retornado ao agente

Sub-workflows não podem pausar para HITL na v1. Se um sub-workflow aninhado tentar entrar em um estado de revisão pendente, a execução falhará em vez de suspender dentro da chamada aninhada.

## Ferramentas de Nós do Canvas

Ferramentas de nós do canvas são nós de workflow conectados a um agente por meio do handle `tool-input`. Durante a configuração do agente, `_build_node_tool_schemas` examina essas conexões e adiciona um schema de ferramenta compatível com OpenAI para cada nó conectado.

- **Origem da ferramenta**: `_source: "node_tool"`
- **Nome da ferramenta**: derivado do label do nó conectado, com sufixos adicionados em caso de duplicatas
- **Parâmetros da ferramenta**: construídos a partir dos `agentProvidedFields` do nó
- **Campos fixos**: todos os campos do nó não listados em `agentProvidedFields` permanecem na configuração do nó

### Fluxo de Execução

1. O agente decide chamar uma ferramenta de nó conectado
2. `_execute_node_tool` copia os dados do nó
3. Os argumentos fornecidos pelo agente são mesclados aos campos configurados do nó
4. `execute_node` executa esse nó uma vez com o agendamento de branches desabilitado
5. Os dados originais do nó são restaurados
6. A saída do nó é retornada ao agente como resultado da ferramenta

Nós de ferramenta são excluídos do agendamento normal do workflow para que não sejam executados duas vezes. Eles são executados apenas pelo caminho de chamada de ferramenta do agente.

## Human-in-the-Loop

Quando `hitlEnabled` está definido em um agente, o agente recebe uma ferramenta `request_human_review` que pode chamar em checkpoints de aprovação específicos.

1. O system prompt e as diretrizes de HITL do nó informam ao agente quais ações exigem aprovação
2. Quando o agente atinge uma dessas etapas, ele chama `request_human_review`
3. O Heym armazena um snapshot da execução do workflow e cria uma solicitação de revisão pública
4. O resultado do nó é marcado como `pending` com uma URL de revisão
5. O handle de saída `review` do agente é agendado imediatamente para que branches de notificação possam ser executados com o payload pendente
6. O agendamento da execução principal é interrompido até que o revisor responda
7. Em `accept`, `edit` ou `refuse`, o executor é reconstruído a partir do snapshot armazenado
8. O agente pausado continua com o contexto de revisão aprovado, ou encerra imediatamente em caso de `refuse`
9. Os nós subsequentes continuam após o agente retomado finalizar, sem reexecutar o branch `review`
10. Se uma ação posterior também exigir aprovação, o agente pode criar outro checkpoint de HITL na mesma execução

O resumo voltado ao revisor é gerado a partir da própria solicitação de revisão, de modo que o campo do nó pode permanecer focado na política de aprovação e no momento da execução.

Isso permite que workflows de agentes aguardem aprovação externa enquanto preservam o histórico da conversa, as saídas de nós concluídos, o estado de loops e outros contextos de runtime.

## Executor de Ferramentas do Orquestrador

O executor de ferramentas customizado roteia:

- **Chamadas de sub-agentes** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Chamadas de sub-workflows** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Ferramentas de nós do canvas** (`_source == "node_tool"`) → `_execute_node_tool`
- **Revisão humana** (`_source == "hitl"`) → cria um checkpoint de HITL pendente
- **Outras ferramentas** → `_unified_tool_executor` (Python, MCP, ferramentas de skill)

Ele é usado quando o HITL está habilitado, quando `isOrchestrator` com `subAgentLabels` está definido, ou quando `subWorkflowIds` está configurado.
## Skills

Skills ampliam o contexto do sistema do agente e podem adicionar ferramentas Python.

- **Formato**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Conteúdo**: Prefixado à instrução do sistema (unido com `---`)
- **Ferramentas Python**: Para cada skill com arquivos `.py`, uma ferramenta `skill_{skill_name}` é adicionada
- **Execução**: `skill_python_executor.py` executa scripts com `uv run python` em um diretório temporário; argumentos como JSON via stdin, resultado como JSON via stdout

Skills podem ser adicionadas arrastando um arquivo `.zip` ou `.md` para a área de Skills na configuração do [Nó Agente](../nodes/agent-node.md).

## MCP Client

O cliente MCP (Model Context Protocol) se conecta a servidores de ferramentas externos.

- **Transports**: `stdio` (comando + argumentos) ou `sse` (url + headers)
- **Listar ferramentas**: `list_mcp_tools` → `ClientSession.list_tools()` → convertido para o formato de função OpenAI com `_source: "mcp"`
- **Executar**: `execute_mcp_tool` → `ClientSession.call_tool()` → resultado via `_extract_tool_result`

Configure conexões MCP na [Aba MCP](../tabs/mcp-tab.md) ou nas `mcpConnections` do nó agente.

## Tool Calling

O serviço LLM executa um loop `execute_with_tools`:

1. **Verificação de compressão de contexto** — antes de cada iteração, estima o uso de tokens e comprime se necessário (veja abaixo)
2. Chama o modelo com `tools` e `tool_choice: "auto"`
3. Se `tool_calls` existirem: para cada chamada, executa `tool_executor(tool_def, name, args, timeout)`
4. Anexa o resultado da ferramenta às mensagens, repete
5. Para quando não houver mais chamadas de ferramentas ou `max_tool_iterations` for atingido

### Tool Dispatch

`_unified_tool_executor` roteia por `_source`:

| Source | Handler |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (padrão) | `execute_tool` (ferramentas de código Python) |

As ferramentas usam o formato de function-calling da OpenAI: `name`, `description`, `parameters` (JSON schema).

## Compressão de Contexto

Para evitar estouro de contexto em agentes de longa duração, o Heym comprime automaticamente a lista acumulada de `messages` antes de cada iteração de ferramenta.

### Algoritmo

1. **Estimar tokens**: `total_chars / 4` em todas as mensagens (rápido, sem necessidade de tokenizer)
2. **Verificação de limite**: se `estimated_tokens < context_limit × 0.80`, pula a compressão
3. **Limite de contexto**: tenta `client.models.retrieve(model).context_window`; recorre a uma tabela interna (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, etc.); padrão 128K
4. **Preservação de âncoras**: sempre mantém
   - Primeira mensagem `system` (identidade e instruções do agente)
   - Primeira mensagem `user` (tarefa original)
   - Última mensagem `user` (instrução mais recente)
5. **Sumarizar o meio**: tudo entre a primeira e a última mensagem do usuário é serializado e enviado ao mesmo modelo com um prompt de sumarização
6. **Reconstruir**: `[system, first_user, assistant(summary), last_user]`

A compressão é ignorada se houver menos de 2 mensagens de usuário distintas (não há meio para sumarizar) ou se a chamada de sumarização do LLM falhar (fallback seguro: retorna as mensagens originais).

### Observabilidade

Cada evento de compressão é registrado como:
- Uma entrada `_context_compression` em `tool_calls_collected` → visível no detalhe de execução do Execution History
- Um evento `on_tool_call` com `phase: "compression"` → renderizado no painel de Debug como `Context compressed (N messages → summary)`
- Uma entrada de trace LLM `context.compression` → visível na aba Traces com estimativas de tokens antes/depois

Chamadas de ferramentas do agente também emitem observabilidade mais rica:

- Campos de ciclo de vida por chamada em `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- `tool_metrics` agregados no resultado do agente (contagens por status mais duração total/máxima); entradas `_context_compression` são excluídas dessas contagens
- Spans filhos OpenTelemetry opcionais nomeados `heym.agent.tool.execute` (veja [OpenTelemetry Tracing](./opentelemetry.md))
- Payloads persistidos de trace LLM / histórico de execução `tool_calls` são redigidos e limitados em tamanho; o estado de retomada HITL ao vivo mantém os originais para correspondência

## Relacionados

- [Por que Heym](../getting-started/why-heym.md) – Orquestração multiagente ao longo do ciclo de vida do agente
- [Nó Agente](../nodes/agent-node.md) – Configuração e parâmetros
- [Memória Persistente do Agente](./agent-persistent-memory.md) – Grafo de conhecimento por nó agente e compartilhamento entre pares
- [Human-in-the-Loop](./human-in-the-loop.md) – Links de revisão, payloads pendentes e comportamento de retomada
- [OpenTelemetry Tracing](./opentelemetry.md) – Spans de Workflow, nó e ferramentas do Agente
- [Tipos de Nó](./node-types.md) – Agente e nós relacionados
- [Execução Paralela](./parallel-execution.md) – Execução paralela baseada em DAG e subagentes
- [Aba MCP](../tabs/mcp-tab.md) – Configurar conexões MCP
- [Expression DSL](./expression-dsl.md) – `$input.text` para subagentes
