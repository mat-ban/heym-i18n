# Arquitetura de Agentes

O [Nó de Agente](../nodes/agent-node.md) suporta subagentes, sub-workflows, ferramentas de nós do canvas, um padrão de orquestrador, competências, ligações MCP, chamadas de ferramentas, [memória persistente](./agent-persistent-memory.md) opcional (por nó do canvas, com partilha opcional para outros agentes) e [revisão humana](./human-in-the-loop.md) opcional. Esta página descreve a arquitetura.

## Subagentes

Os subagentes são nós de agente que um orquestrador pode invocar através da ferramenta `call_sub_agent`.

- **Orquestrador**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Subagentes**: Devem utilizar `$input.text` na sua Mensagem do Utilizador para receberem o prompt do orquestrador
- **Ferramenta**: `call_sub_agent` com `sub_agent_label` (enum) e `prompt`
- **Limite de profundidade**: Máximo de 5 chamadas de subagentes aninhadas

### Fluxo de Execução

1. O orquestrador decide invocar um subagente
2. `_execute_sub_agent_tool` localiza o agente de destino pela etiqueta
3. Constrói `synthetic_inputs = {"input": {"text": prompt}}`
4. Executa `_execute_agent_node` para o subagente
5. O resultado é devolvido ao orquestrador

### Execução Paralela de Subagentes

Quando o orquestrador devolve múltiplas chamadas à ferramenta `call_sub_agent` num único turno, estas são executadas **em paralelo**. Por exemplo, se o utilizador perguntar sobre "Paris" e o orquestrador invocar simultaneamente `distanceAgent` e `foodAgent`, ambos são executados em simultâneo em vez de sequencialmente.

- **Benefício**: O tempo total corresponde aproximadamente ao do subagente mais lento, e não à soma de todos.
- **Sugestão**: Incentive o orquestrador a invocar múltiplos subagentes num único turno quando a tarefa o exigir.

## Sub-workflows

Quando `subWorkflowIds` está configurado, o agente pode invocar outros workflows através da ferramenta `call_sub_workflow`.

- **Configuração**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Ferramenta**: `call_sub_workflow` com `workflow_id` (enum) e `inputs` (objeto)
- **Limite de profundidade**: Máximo de 5 chamadas de sub-workflows aninhadas

### Fluxo de Execução

1. O agente decide invocar um sub-workflow
2. `_execute_sub_workflow_tool` obtém o workflow a partir de `workflow_cache`
3. Constrói `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Executa `WorkflowExecutor.execute()` para o sub-workflow
5. O resultado é devolvido ao agente

Os sub-workflows não podem pausar para HITL na v1. Se um sub-workflow aninhado tentar entrar num estado de revisão pendente, a execução falha em vez de suspender dentro da chamada aninhada.

## Ferramentas de Nós do Canvas

As ferramentas de nós do canvas são nós de workflow ligados a um agente através do handle `tool-input`. Durante a configuração do agente, `_build_node_tool_schemas` analisa essas ligações e adiciona um esquema de ferramenta compatível com OpenAI por cada nó ligado.

- **Origem da ferramenta**: `_source: "node_tool"`
- **Nome da ferramenta**: derivado da etiqueta do nó ligado, com sufixos adicionados em caso de duplicados
- **Parâmetros da ferramenta**: construídos a partir dos `agentProvidedFields` do nó
- **Campos fixos**: todos os campos do nó não listados em `agentProvidedFields` permanecem na configuração do nó

### Fluxo de Execução

1. O agente decide invocar uma ferramenta de nó ligado
2. `_execute_node_tool` copia os dados do nó
3. Os argumentos fornecidos pelo agente são integrados nos campos configurados do nó
4. `execute_node` executa esse nó uma vez com o agendamento de ramificações desativado
5. Os dados originais do nó são restaurados
6. A saída do nó é devolvida ao agente como resultado da ferramenta

Os nós de ferramenta são excluídos do agendamento normal do workflow para não serem executados duas vezes. São executados apenas através do percurso de chamada de ferramenta do agente.

## Human-in-the-Loop

Quando `hitlEnabled` está definido num agente, este recebe uma ferramenta `request_human_review` que pode invocar em pontos de aprovação específicos.

1. O prompt do sistema e as diretrizes HITL do nó indicam ao agente quais as ações que requerem aprovação
2. Quando o agente atinge um desses passos, invoca `request_human_review`
3. O Heym armazena um snapshot da execução do workflow e cria um pedido de revisão público
4. O resultado do nó é marcado como `pending` com um URL de revisão
5. O handle de saída `review` do agente é agendado imediatamente para que as ramificações de notificação possam ser executadas com o payload pendente
6. O agendamento da execução principal é interrompido até que o revisor responda
7. Em `accept`, `edit` ou `refuse`, o executor é reconstruído a partir do snapshot armazenado
8. O agente em pausa continua com o contexto de revisão aprovado, ou termina imediatamente em caso de `refuse`
9. Os nós a jusante continuam após o agente retomado terminar, sem reexecutar a ramificação `review`
10. Se uma ação posterior também requerer aprovação, o agente pode criar outro checkpoint HITL na mesma execução

O resumo apresentado ao revisor é gerado a partir do próprio pedido de revisão, permitindo que o campo do nó se mantenha focado na política de aprovação e no momento de execução.

Isto permite que os workflows de agentes aguardem aprovação externa, preservando o histórico de conversação, as saídas de nós concluídos, o estado dos ciclos e outro contexto de execução.

## Executor de Ferramentas do Orquestrador

O executor de ferramentas personalizado encaminha:

- **Chamadas de subagentes** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Chamadas de sub-workflows** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Ferramentas de nós do canvas** (`_source == "node_tool"`) → `_execute_node_tool`
- **Revisão humana** (`_source == "hitl"`) → cria um checkpoint HITL pendente
- **Outras ferramentas** → `_unified_tool_executor` (Python, MCP, ferramentas de competências)

É utilizado quando o HITL está ativado, quando `isOrchestrator` com `subAgentLabels` está definido, ou quando `subWorkflowIds` está configurado.

## Skills

As Skills ampliam o contexto do sistema do agente e podem adicionar ferramentas Python.

- **Estrutura**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Conteúdo**: Anteposto à instrução do sistema (unido com `---`)
- **Ferramentas Python**: Para cada skill com ficheiros `.py`, é adicionada uma ferramenta `skill_{skill_name}`
- **Execução**: `skill_python_executor.py` executa scripts com `uv run python` num diretório temporário; os argumentos são passados como JSON via stdin e o resultado é devolvido como JSON via stdout

As Skills podem ser adicionadas arrastando um ficheiro `.zip` ou `.md` para a área de Skills na configuração do [Nó de agente](../nodes/agent-node.md).

## Cliente MCP

O cliente MCP (Model Context Protocol) liga-se a servidores de ferramentas externos.

- **Transportes**: `stdio` (comando + argumentos) ou `sse` (url + cabeçalhos)
- **Listar ferramentas**: `list_mcp_tools` → `ClientSession.list_tools()` → convertido para o formato de função OpenAI com `_source: "mcp"`
- **Executar**: `execute_mcp_tool` → `ClientSession.call_tool()` → resultado através de `_extract_tool_result`

Configure as ligações MCP no [Separador MCP](../tabs/mcp-tab.md) ou nas `mcpConnections` do nó de agente.

## Chamada de ferramentas

O serviço LLM executa um ciclo `execute_with_tools`:

1. **Verificação de compressão de contexto** — antes de cada iteração, estima a utilização de tokens e comprime se necessário (ver abaixo)
2. Chama o modelo com `tools` e `tool_choice: "auto"`
3. Se existirem `tool_calls`: para cada chamada, executa `tool_executor(tool_def, name, args, timeout)`
4. Anexa o resultado da ferramenta às mensagens e repete
5. Para quando não existirem mais chamadas de ferramentas ou quando `max_tool_iterations` for atingido

### Encaminhamento de ferramentas

`_unified_tool_executor` encaminha com base em `_source`:

| Origem | Manipulador |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (predefinição) | `execute_tool` (ferramentas de código Python) |

As ferramentas utilizam o formato de chamada de função OpenAI: `name`, `description`, `parameters` (esquema JSON).

## Compressão de contexto

Para evitar a sobrecarga do contexto em agentes de longa duração, o Heym comprime automaticamente a lista acumulada de `messages` antes de cada iteração de ferramentas.

### Algoritmo

1. **Estimar tokens**: `total_chars / 4` em todas as mensagens (rápido, sem necessidade de tokenizer)
2. **Verificação do limiar**: se `estimated_tokens < context_limit × 0.80`, ignorar a compressão
3. **Limite de contexto**: tentar `client.models.retrieve(model).context_window`; recorrer a uma tabela incorporada (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, etc.); predefinição 128K
4. **Preservação de âncoras**: manter sempre
   - Primeira mensagem `system` (identidade e instruções do agente)
   - Primeira mensagem `user` (tarefa original)
   - Última mensagem `user` (instrução mais recente)
5. **Resumir o meio**: tudo entre a primeira e a última mensagem de utilizador é serializado e enviado ao mesmo modelo com um prompt de resumo
6. **Reconstruir**: `[system, first_user, assistant(summary), last_user]`

A compressão é ignorada se existirem menos de 2 mensagens de utilizador distintas (não há meio a resumir) ou se a chamada de resumo ao LLM falhar (recurso de segurança: devolver as mensagens originais).

### Observabilidade

Cada evento de compressão é registado como:
- Uma entrada `_context_compression` em `tool_calls_collected` → visível no detalhe da execução do Histórico de execuções
- Um evento `on_tool_call` com `phase: "compression"` → apresentado no painel de Depuração como `Context compressed (N messages → summary)`
- Uma entrada de rastreio LLM `context.compression` → visível no separador Rastreios com estimativas de tokens antes/depois

As chamadas de ferramentas do agente também emitem observabilidade mais rica:

- Campos de ciclo de vida por chamada em `tool_calls`: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- `tool_metrics` agregados no resultado do agente (contagens por estado, mais duração total/máxima); as entradas `_context_compression` são excluídas dessas contagens
- Spans filhos OpenTelemetry opcionais denominados `heym.agent.tool.execute` (ver [Rastreio OpenTelemetry](./opentelemetry.md))
- Os payloads persistidos de rastreio LLM / histórico de execuções em `tool_calls` são redigidos e limitados em tamanho; o estado de retoma HITL em tempo real mantém os originais para correspondência

## Relacionado

- [Porquê o Heym](../getting-started/why-heym.md) – Orquestração multiagente ao longo do ciclo de vida do agente
- [Nó de agente](../nodes/agent-node.md) – Configuração e parâmetros
- [Memória persistente do agente](./agent-persistent-memory.md) – Grafo de conhecimento por nó de agente e partilha entre pares
- [Human-in-the-Loop](./human-in-the-loop.md) – Ligações de revisão, payloads pendentes e comportamento de retoma
- [Rastreio OpenTelemetry](./opentelemetry.md) – Spans de Workflow, nó e ferramentas do agente
- [Tipos de nó](./node-types.md) – Nó de agente e nós relacionados
- [Execução paralela](./parallel-execution.md) – Execução paralela baseada em DAG e subagentes
- [Separador MCP](../tabs/mcp-tab.md) – Configurar ligações MCP
- [DSL de expressões](./expression-dsl.md) – `$input.text` para subagentes
