# Aba Traces

A aba **Traces** exibe traces de execução de LLM. Inspecione payloads de requisição/resposta, timing, chamadas de ferramentas e depure o comportamento dos nós [Agent](../nodes/agent-node.md) e [LLM](../reference/node-types.md), além de métricas agregadas (chamadas, tokens, custo, latência, taxa de erro) em qualquer janela de tempo.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Assista à demonstração de Traces</a></p>

## Cabeçalho de Estatísticas

A página abre com um resumo de estatísticas acima da lista de traces, calculado com base no intervalo de tempo selecionado e nos demais filtros ativos:

- **Cards de KPI** – Total de Chamadas, Total de Tokens, Custo Total (USD), Latência Média, % de Erros
- **Tokens por Modelo** – Gráfico de rosca do volume de tokens por modelo
- **Custo por Modelo** – Gráfico de rosca do gasto em USD por modelo. Modelos sem precificação exibem um link "Configurar precificação" para a [Tabela de Custos de LLM](./datatable-tab.md#llm-cost-table-system-table)
- **Chamadas ao Longo do Tempo** – Gráfico de área empilhada de chamadas bem-sucedidas vs. com falha por bucket (5 min / 1 h / 6 h / 1 dia, escolhido automaticamente conforme o intervalo)
- **Aviso de modelos sem precificação** – Aparece abaixo dos gráficos quando alguns modelos rastreados não possuem linha de precificação, com link para a Tabela de Custos de LLM

## Intervalo de Tempo

Um único seletor de **Intervalo de tempo** no topo da barra de filtros controla tanto o cabeçalho de estatísticas quanto a lista de traces. Opções: Última 1 hora, Últimas 24 horas, Últimos 7 dias (padrão), Últimos 30 dias, Todo o período. Alterar o intervalo redefine a paginação e recarrega gráficos e lista em conjunto.

## Lista de Traces

- Lista paginada de traces recentes dentro do intervalo de tempo selecionado
- Cada trace exibe: workflow, nó, credencial, timestamp, duração
- Clique em um trace para abrir a visualização de detalhes
- Use **Anterior / Próximo** dentro do diálogo de detalhes para navegar entre traces sem fechá-lo

## Filtragem

- **Intervalo de tempo** – 1h / 24h / 7d / 30d / Tudo; filtra gráficos e lista em conjunto
- **Credencial** – Filtra pela credencial (API key) utilizada
- **Origem** – Filtra por workflow ou origem de execução
- **Busca** – Busca por modelo, workflow, credencial ou rótulo de nó
- **Atualizar** – Recarrega a página atual de traces

## Detalhes do Trace

Ao abrir um trace:

- **Etapas** – Uma linha do tempo de cima para baixo que lê o trace como uma cadeia ordenada: System → User → Assistant → Tool → Answer. Cada etapa é recolhível; expandir uma delas mostra um detalhe legível (texto da mensagem, ou os argumentos e o resultado de uma ferramenta) seguido pelo JSON daquela etapa. O conteúdo JSON em todos os tipos de evento — incluindo chamadas MCP e payloads JSON-RPC — abre por padrão em uma árvore expansível, com o primeiro nível já expandido. Use **Tree / Raw** para alternar entre a estrutura formatada e o texto original. JSON malformado permanece visível como texto simples. As etapas de ferramenta exibem sua duração e um badge MCP/Skill quando aplicável, além de badges de pending / timeout / cancelled quando o status da chamada de ferramenta está definido. A etapa Answer pode exibir badges agregados de `tool_metrics` (contagens de chamadas por status e duração total das ferramentas). Quando um trace registra cada chamada de modelo, como fazem uma mensagem do Dashboard Chat e um agente roteado, uma etapa **LLM** aparece antes das ferramentas que a chamada solicitou, e o **Duration Breakdown** distribui cada chamada de modelo, ferramenta e decisão de roteamento em uma única linha do tempo. Uma mensagem do Dashboard Chat é um único trace, independentemente de quantas rodadas de ferramentas ela exigiu. Traces sem cadeia de mensagens (por exemplo, geração de imagem) exibem uma linha do tempo mínima de Request → Response.
- **Request** – Payload completo da requisição enviada ao LLM, com visualizações JSON **Tree / Raw**
- **Response** – Resposta do modelo, incluindo chamadas de ferramentas, se houver, com visualizações JSON **Tree / Raw**
- **Métricas de ferramentas** – Quando presentes na resposta, um resumo compacto das contagens de chamadas de ferramentas (`success` / `error` / `pending` / `timeout` / `cancelled`) e da duração total das ferramentas
- **Detalhamento de timing** – `llm_ms`, `tools_ms`, `mcp_list_ms` para análise de desempenho
- **Chamadas de ferramentas** – Nome da ferramenta, argumentos, resultado, status e tempo decorrido
- **Skills incluídas** – Skills passadas ao modelo na requisição
- **Ir para Workflow** – Salta diretamente para o workflow relacionado a partir do diálogo de detalhes do trace

## Copiar e Exportar

- Copie o JSON de requisição ou resposta para a área de transferência; a cópia sempre utiliza o payload bruto completo, independentemente da visualização ativa
- Use para depuração ou compartilhamento com o suporte

## Manutenção

- **Limpar Tudo** – Exclui todos os traces salvos após confirmação
- Os controles de paginação mostram o intervalo visível atual (por exemplo, `1-25 of 240`)

## Relacionados

- [Por que Heym](../getting-started/why-heym.md) – Observabilidade de LLM ao longo do ciclo de vida do agente
- [Nó Agent](../nodes/agent-node.md) – Nó Agent com chamada de ferramentas
- [Tipos de Nó](../reference/node-types.md) – Nós LLM e Agent
- [Aba Credentials](./credentials-tab.md) – Credenciais usadas nos traces
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Exportação OTel opcional para spans de workflow, nó e ferramentas do Agent
- [Aba DataTable](./datatable-tab.md) – Hospeda a Tabela de Custos de LLM usada pelo gráfico de custos
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacto de páginas para as superfícies do dashboard
