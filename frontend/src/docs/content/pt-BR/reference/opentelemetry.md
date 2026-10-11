# Rastreamento com OpenTelemetry

O Heym pode emitir traces do [OpenTelemetry](https://opentelemetry.io/) para cada execução de Workflow, execução de Nó e invocação de ferramenta do Agente. Cada execução produz um span raiz com spans filhos por Nó e por ferramenta do Agente, permitindo visualizar qual etapa falhou, quanto tempo levou, o que foi chamado e o que retornou. Os spans são exportados via OTLP/HTTP para qualquer backend compatível, como Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic ou Grafana Cloud.

O rastreamento está **desabilitado por padrão**. Quando desativado, não há overhead mensurável e nenhum span é criado.

## Habilitando o Rastreamento

Defina as seguintes variáveis de ambiente no backend e reinicie-o:

Para a lista completa de variáveis de ambiente, consulte [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variável | Padrão | Descrição |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Chave mestra. Defina como `true` para ativar o rastreamento. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Endpoint base OTLP/HTTP, por exemplo `http://collector:4318`. O Heym envia spans para `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Headers `key=value` separados por vírgula para autenticação do exporter, por exemplo `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | O atributo de recurso `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Taxa de amostragem head entre `0.0` e `1.0`, aplicada com um sampler baseado em parent. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Quando `true`, anexa payloads truncados de entrada e saída do Nó aos spans do Nó. Desativado por padrão por questões de privacidade. |

Exemplo mínimo:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Você pode confirmar a configuração ativa no app em **Settings → Observability** (abra pelo seu avatar no cabeçalho). Esse painel é somente leitura e nunca exibe segredos do exporter.

## O Que É Rastreado

### Span raiz do Workflow

Nome: `heym.workflow.execute`

| Atributo | Descrição |
|-----------|-------------|
| `heym.workflow.id` | O UUID do Workflow. |
| `heym.node.count` | Número de Nós no Workflow. |
| `heym.workflow.test_mode` | `true` para execuções de teste. |
| `heym.sub_workflow.depth` | Profundidade de aninhamento quando invocado como sub-workflow. |
| `heym.workflow.status` | Status final da execução. Uma execução com falha define o status do span como `ERROR`. |

### Span do Nó

Nome: `heym.node.execute`, criado como filho do span do Workflow.

| Atributo | Descrição |
|-----------|-------------|
| `heym.node.id` | O id do Nó. |
| `heym.node.type` | O tipo do Nó, por exemplo `agent`, `llm`, `http`. |
| `heym.node.label` | O rótulo do Nó exibido na tela. |
| `heym.node.status` | `success` ou `error`. Erros definem o status do span como `ERROR`. |
| `heym.node.duration_ms` | Tempo de execução do Nó em milissegundos. |
| `heym.llm.model` | Nome do modelo para Nós LLM e Agente, quando disponível. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Uso de tokens para Nós LLM e Agente, quando disponível. |

Os spans de Nó se aninham corretamente sob o span do Workflow mesmo quando os Nós são executados em paralelo, pois o contexto do Workflow é propagado para as threads de trabalho.

### Span de ferramenta do Agente

Nome: `heym.agent.tool.execute`, criado sob o span do Nó Agente ativo.

| Atributo | Descrição |
|-----------|-------------|
| `heym.agent.tool.name` | Nome da ferramenta selecionada pelo modelo. |
| `heym.agent.tool.call_id` | Id de chamada de ferramenta do provedor, quando disponível. |
| `heym.agent.tool.source` | Origem da ferramenta, como `node_tool`, `mcp`, `skill` ou `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Rótulo do servidor MCP, quando aplicável. |
| `heym.agent.tool.iteration` | Iteração do loop de ferramentas do Agente. |
| `heym.agent.tool.args_bytes` | Tamanho em UTF-8 dos argumentos serializados da ferramenta. |
| `heym.agent.tool.result_bytes` | Tamanho em UTF-8 do resultado serializado da ferramenta. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` ou `cancelled`. Erros de ferramenta definem o status do span como `ERROR`. |

Argumentos e resultados brutos das ferramentas não são anexados aos spans por padrão.

## Segurança de payload de ferramenta do Agente

Os payloads de observabilidade do Agente persistidos são redigidos e truncados em código (`4096` caracteres por string, profundidade `6`, `32768` caracteres totais por gravação de trace de LLM). O orçamento total do trace é dividido entre os registros de ferramentas para que um resultado grande no início não possa ocultar a identidade e o status do ciclo de vida de chamadas posteriores. Metadados limitados de download de `_generated_files` são reservados separadamente da saída volumosa de skills:

- Seções de ferramentas `request` / `response` do trace de LLM, incluindo cópias de `_hitl_pending` gravadas no armazenamento de traces
- Registros de `tool_calls` do resultado do Agente exibidos no histórico de execução
- Eventos de resultado de ferramenta do painel Live Debug, que reutilizam o mesmo registro sanitizado limitado

A execução de ferramentas ao vivo, as mensagens de ferramenta vinculadas ao modelo e o estado de retomada HITL em memória (`_hitl_pending.agent_state.messages` / `tool_arguments`) mantêm os valores originais para que a retomada e a correspondência exata de argumentos continuem funcionando. Apenas as cópias de observabilidade armazenadas são sanitizadas.
## Propagação de Contexto de Trace

O Heym segue o padrão [W3C Trace Context](https://www.w3.org/TR/trace-context/) para que os traces permaneçam conectados entre fronteiras de serviços.

- **Webhooks de entrada:** quando uma requisição recebida carrega um cabeçalho `traceparent`, a execução do Workflow é registrada como filha desse trace. Isso vincula as execuções do Heym ao sistema upstream que as acionou.
- **HTTP de saída:** o Nó HTTP injeta `traceparent` nas requisições que realiza, para que os serviços downstream possam continuar o mesmo trace.
- **Sub-workflows:** a execução de um sub-workflow é vinculada como filha do Nó que a invocou, preservando a hierarquia de chamadas em um único trace.

Triggers sem contexto de entrada (como Cron, IMAP, RabbitMQ e WebSocket) iniciam um novo trace a cada execução.

## Confiabilidade

- Um coletor lento ou inacessível nunca bloqueia a execução do Workflow. Os spans são agrupados em lote e exportados em segundo plano.
- Se a inicialização do tracing falhar (por exemplo, um endpoint inválido), o backend registra o erro e continua com o tracing desabilitado, em vez de falhar ao iniciar.
- Os cabeçalhos de autenticação OTLP são lidos apenas do ambiente. Eles nunca são armazenados no banco de dados e nunca são retornados pela API de status.

## Relacionados

- [Configurações](./user-settings.md) – A aba Observability que exibe o status do tracing
- [Variáveis de Ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referência completa de configuração
- [Triggers](./triggers.md) – Como os Workflows iniciam, incluindo webhooks
- [Histórico de Execução](./execution-history.md) – A visualização de histórico por execução integrada do Heym
- [HTTP](../nodes/http-node.md) – O Nó que propaga o contexto de trace para chamadas downstream
