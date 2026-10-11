# Separador Rastreios

O separador **Rastreios** apresenta os rastreios de execução de LLM. Inspecione os payloads de pedido/resposta, a temporização, as chamadas de ferramentas e depure o comportamento dos nós [Agente](../nodes/agent-node.md) e [LLM](../reference/node-types.md), além de métricas agregadas (chamadas, tokens, custo, latência, taxa de erro) em qualquer intervalo temporal.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Ver demonstração de Rastreios</a></p>

## Cabeçalho de Estatísticas

A página abre com um resumo de estatísticas acima da lista de rastreios, calculado com base no intervalo temporal selecionado e nos restantes filtros ativos:

- **Cartões KPI** – Total de Chamadas, Total de Tokens, Custo Total (USD), Latência Média, % de Erros
- **Tokens por Modelo** – Gráfico circular do volume de tokens por modelo
- **Custo por Modelo** – Gráfico circular do gasto em USD por modelo. Os modelos sem preços apresentam uma ligação "Configurar preços" para a [Tabela de Custos de LLM](./datatable-tab.md#llm-cost-table-system-table)
- **Chamadas ao Longo do Tempo** – Gráfico de área empilhada de chamadas bem-sucedidas vs. falhadas por intervalo (5 min / 1 h / 6 h / 1 dia, escolhido automaticamente conforme o intervalo)
- **Aviso de modelos sem preços** – Aparece abaixo dos gráficos quando alguns modelos rastreados não têm linha de preços, com ligação para a Tabela de Custos de LLM

## Intervalo Temporal

Um único seletor de **Intervalo temporal** no topo da barra de filtros controla tanto o cabeçalho de estatísticas como a lista de rastreios. Opções: Última 1 hora, Últimas 24 horas, Últimos 7 dias (predefinição), Últimos 30 dias, Todo o período. Alterar o intervalo reinicia a paginação e recarrega os gráficos e a lista em conjunto.

## Lista de Rastreios

- Lista paginada de rastreios recentes dentro do intervalo temporal selecionado
- Cada rastreio apresenta: workflow, nó, credencial, data/hora, duração
- Clique num rastreio para abrir a vista de detalhe
- Utilize **Anterior / Seguinte** dentro da caixa de diálogo de detalhe para navegar entre rastreios sem a fechar

## Filtragem

- **Intervalo temporal** – 1h / 24h / 7d / 30d / Tudo; filtra os gráficos e a lista em conjunto
- **Credencial** – Filtrar pela credencial (chave de API) utilizada
- **Origem** – Filtrar pela origem do workflow ou da execução
- **Pesquisa** – Pesquisar por modelo, workflow, credencial ou etiqueta de nó
- **Atualizar** – Recarregar a página atual de rastreios

## Detalhe do Rastreio

Ao abrir um rastreio:

- **Passos** – Uma linha temporal de cima para baixo que lê o rastreio como uma cadeia ordenada: Sistema → Utilizador → Assistente → Ferramenta → Resposta. Cada passo é recolhível; expandir um passo mostra um detalhe legível (texto da mensagem, ou os argumentos e o resultado de uma ferramenta) seguido do JSON desse passo. O conteúdo JSON em todos os tipos de evento — incluindo chamadas MCP e payloads JSON-RPC — abre por predefinição numa árvore expansível, com o primeiro nível expandido. Utilize **Árvore / Bruto** para alternar entre a estrutura formatada e o texto original. O JSON malformado permanece visível como texto simples. Os passos de ferramenta apresentam a sua duração e um distintivo MCP/Skill quando aplicável, além de distintivos de pendente / expirado / cancelado quando o estado da chamada de ferramenta está definido. O passo Resposta pode apresentar distintivos agregados de `tool_metrics` (contagens de chamadas por estado e duração total das ferramentas). Quando um rastreio regista cada chamada ao modelo, como fazem uma mensagem de Chat do Dashboard e um agente encaminhado, um passo **LLM** surge antes das ferramentas que essa chamada solicitou, e a **Decomposição da Duração** apresenta cada chamada ao modelo, ferramenta e decisão de encaminhamento numa única linha temporal. Uma mensagem de Chat do Dashboard é um único rastreio, independentemente do número de rondas de ferramentas que tenha exigido. Os rastreios sem cadeia de mensagens (por exemplo, geração de imagens) apresentam uma linha temporal mínima de Pedido → Resposta.
- **Pedido** – Payload completo do pedido enviado ao LLM, com vistas JSON **Árvore / Bruto**
- **Resposta** – Resposta do modelo, incluindo chamadas de ferramentas, se existirem, com vistas JSON **Árvore / Bruto**
- **Métricas de ferramentas** – Quando presentes na resposta, um resumo compacto das contagens de chamadas de ferramentas (`success` / `error` / `pending` / `timeout` / `cancelled`) e da duração total das ferramentas
- **Decomposição da temporização** – `llm_ms`, `tools_ms`, `mcp_list_ms` para análise de desempenho
- **Chamadas de ferramentas** – Nome da ferramenta, argumentos, resultado, estado e tempo decorrido
- **Skills incluídas** – Skills transmitidas ao modelo no pedido
- **Ir para o Workflow** – Saltar diretamente para o workflow relacionado a partir da caixa de diálogo de detalhe do rastreio

## Copiar e Exportar

- Copiar o JSON do pedido ou da resposta para a área de transferência; a cópia utiliza sempre o payload bruto completo, independentemente da vista ativa
- Utilize para depuração ou para partilhar com o suporte

## Manutenção

- **Limpar Tudo** – Eliminar todos os rastreios guardados após confirmação
- Os controlos de paginação mostram o intervalo visível atual (por exemplo, `1-25 de 240`)

## Relacionado

- [Porquê o Heym](../getting-started/why-heym.md) – Observabilidade de LLM ao longo do ciclo de vida do agente
- [Nó de Agente](../nodes/agent-node.md) – Nó de agente com chamada de ferramentas
- [Tipos de Nó](../reference/node-types.md) – Nós LLM e de Agente
- [Separador Credenciais](./credentials-tab.md) – Credenciais utilizadas nos rastreios
- [Rastreio OpenTelemetry](../reference/opentelemetry.md) – Exportação OTel opcional para spans de workflow, nó e ferramentas de Agente
- [Separador DataTable](./datatable-tab.md) – Aloja a Tabela de Custos de LLM utilizada pelo gráfico de custos
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia de página compacto para superfícies do dashboard
