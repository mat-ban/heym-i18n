# Rastreio com OpenTelemetry

O Heym pode emitir rastreios [OpenTelemetry](https://opentelemetry.io/) para cada execução de workflow, execução de nó e invocação de ferramenta de Agente. Cada execução produz um span raiz com spans filhos por nó e por ferramenta de Agente, permitindo ver qual o passo que falhou, quanto tempo demorou, o que foi chamado e o que foi devolvido. Os spans são exportados via OTLP/HTTP para qualquer backend compatível, como Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic ou Grafana Cloud.

O rastreio está **desativado por predefinição**. Quando está desligado, não existe sobrecarga mensurável nem são criados spans.

## Ativar o rastreio

Defina as seguintes variáveis de ambiente no backend e reinicie-o:

Para a lista completa de variáveis de ambiente, consulte [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variável | Predefinição | Descrição |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Interruptor principal. Defina como `true` para ativar o rastreio. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Endpoint base OTLP/HTTP, por exemplo `http://collector:4318`. O Heym envia os spans para `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | Cabeçalhos `key=value` separados por vírgulas para autenticação do exportador, por exemplo `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | O atributo de recurso `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Rácio de amostragem head entre `0.0` e `1.0`, aplicado com um sampler baseado no parent. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Quando `true`, anexa payloads truncados de entrada e saída dos nós aos spans dos nós. Desativado por predefinição por questões de privacidade. |

Exemplo mínimo:

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Pode confirmar a configuração ativa na aplicação em **Settings → Observability** (abra-a a partir do seu avatar no cabeçalho). Esse painel é apenas de leitura e nunca apresenta segredos do exportador.

## O que é rastreado

### Span raiz do workflow

Nome: `heym.workflow.execute`

| Atributo | Descrição |
|-----------|-------------|
| `heym.workflow.id` | O UUID do workflow. |
| `heym.node.count` | Número de nós no workflow. |
| `heym.workflow.test_mode` | `true` para execuções de teste. |
| `heym.sub_workflow.depth` | Profundidade de aninhamento quando invocado como sub-workflow. |
| `heym.workflow.status` | Estado final da execução. Uma execução falhada define o estado do span como `ERROR`. |

### Span de nó

Nome: `heym.node.execute`, criado como filho do span do workflow.

| Atributo | Descrição |
|-----------|-------------|
| `heym.node.id` | O id do nó. |
| `heym.node.type` | O tipo de nó, por exemplo `agent`, `llm`, `http`. |
| `heym.node.label` | A etiqueta do nó apresentada no canvas. |
| `heym.node.status` | `success` ou `error`. Os erros definem o estado do span como `ERROR`. |
| `heym.node.duration_ms` | Tempo de execução do nó em milissegundos. |
| `heym.llm.model` | Nome do modelo para nós LLM e de agente, quando disponível. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Utilização de tokens para nós LLM e de agente, quando disponível. |

Os spans dos nós aninham-se corretamente sob o span do workflow mesmo quando os nós são executados em paralelo, porque o contexto do workflow é propagado para as threads de trabalho.

### Span de ferramenta de Agente

Nome: `heym.agent.tool.execute`, criado sob o span do nó de Agente ativo.

| Atributo | Descrição |
|-----------|-------------|
| `heym.agent.tool.name` | Nome da ferramenta selecionada pelo modelo. |
| `heym.agent.tool.call_id` | Id de chamada de ferramenta do fornecedor, quando disponível. |
| `heym.agent.tool.source` | Origem da ferramenta, como `node_tool`, `mcp`, `skill` ou `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Etiqueta do servidor MCP, quando aplicável. |
| `heym.agent.tool.iteration` | Iteração do ciclo de ferramentas do Agente. |
| `heym.agent.tool.args_bytes` | Tamanho em UTF-8 dos argumentos da ferramenta serializados. |
| `heym.agent.tool.result_bytes` | Tamanho em UTF-8 do resultado da ferramenta serializado. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` ou `cancelled`. Os erros da ferramenta definem o estado do span como `ERROR`. |

Os argumentos e resultados brutos das ferramentas não são anexados aos spans por predefinição.

## Segurança dos payloads das ferramentas de Agente

Os payloads de observabilidade do Agente persistidos são redigidos e truncados no código (`4096` caracteres por string, profundidade `6`, `32768` caracteres totais por escrita de rastreio LLM). O orçamento total do rastreio é dividido entre os registos de ferramentas, para que um resultado grande inicial não possa ocultar a identidade e o estado do ciclo de vida de chamadas posteriores. Os metadados de download limitados de `_generated_files` são reservados separadamente da saída volumosa de skills:

- Secções de ferramentas `request` / `response` do rastreio LLM, incluindo cópias `_hitl_pending` escritas no armazenamento de rastreios
- Registos `tool_calls` do resultado do Agente apresentados no histórico de execuções
- Eventos de resultado de ferramentas do painel Live Debug, que reutilizam o mesmo registo sanitizado limitado

A execução de ferramentas em tempo real, as mensagens de ferramentas vinculadas ao modelo e o estado de retoma HITL em memória (`_hitl_pending.agent_state.messages` / `tool_arguments`) mantêm os valores originais, para que a retoma e a correspondência exata de argumentos continuem a funcionar. Apenas as cópias de observabilidade armazenadas são sanitizadas.

## Propagação de Contexto de Rastreio

O Heym segue o padrão [W3C Trace Context](https://www.w3.org/TR/trace-context/) para que os rastreios permaneçam ligados entre fronteiras de serviços.

- **Webhooks de entrada:** quando um pedido recebido transporta um cabeçalho `traceparent`, a execução do workflow é registada como filha desse rastreio. Isto liga as execuções do Heym ao sistema de origem que as despoletou.
- **HTTP de saída:** o nó HTTP injeta `traceparent` nos pedidos que efetua, para que os serviços a jusante possam continuar o mesmo rastreio.
- **Sub-workflows:** uma execução de sub-workflow fica associada como filha ao nó que a invocou, preservando a hierarquia de chamadas num único rastreio.

Os Triggers sem contexto de entrada (como Cron, IMAP, RabbitMQ e WebSocket) iniciam um novo rastreio por execução.

## Fiabilidade

- Um coletor lento ou inacessível nunca bloqueia a execução do workflow. Os spans são agrupados e exportados em segundo plano.
- Se a inicialização do rastreio falhar (por exemplo, um endpoint inválido), o backend registra o erro e continua com o rastreio desativado, em vez de falhar ao iniciar.
- Os cabeçalhos de autenticação OTLP são lidos apenas do ambiente. Nunca são armazenados na base de dados nem devolvidos pela API de estado.

## Relacionado

- [Configurações](./user-settings.md) – O separador Observabilidade que mostra o estado do rastreio
- [Variáveis de Ambiente](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Referência completa de configuração
- [Triggers](./triggers.md) – Como os workflows iniciam, incluindo webhooks
- [Histórico de Execução](./execution-history.md) – A vista de histórico por execução integrada do Heym
- [HTTP](../nodes/http-node.md) – O nó que propaga o contexto de rastreio para chamadas a jusante
