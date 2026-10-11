# Dashboard

O separador **Dashboard** é um espaço ao estilo do Grafana onde pode construir grelhas de widgets de gráficos. Cada widget é renderizado a partir do resultado do seu próprio workflow Heym oculto, pelo que quaisquer dados que consiga produzir num workflow — consultas a bases de dados, chamadas API, pesquisas RAG, resultados de LLM — podem tornar-se num gráfico. Pode manter vários dashboards e partilhar cada um com pessoas ou equipas.

## Dashboards

Todos começam com um dashboard, criado na primeira vez que abrem o separador. Utilize o seletor de dashboards no topo do separador para alternar entre dashboards, e o **+** ao lado para criar um novo. O seletor lista primeiro os seus próprios dashboards e, em seguida, os que foram partilhados consigo, identificados com o nome da pessoa que os partilhou.

O separador reabre o último dashboard utilizado, e a barra de endereços transporta o dashboard aberto (`?tab=dashboard&dashboard=<id>`), pelo que uma ligação abre esse dashboard exato para qualquer pessoa que tenha acesso ao mesmo.

O botão de definições (apenas para proprietários) permite renomear o dashboard, gerir a partilha e eliminá-lo. Eliminar um dashboard remove os seus widgets e os respetivos workflows. Mantém sempre pelo menos um dashboard próprio, pelo que o último não pode ser eliminado.

## Widgets

Um widget é um único gráfico na grelha. Tipos de gráfico suportados:

- **Bar** (vertical ou horizontal)
- **Line**
- **Area** (tendência preenchida, suporta múltiplas séries)
- **Pie**
- **Table** (com deslocamento)
- **Numeric** (um único valor KPI com uma unidade opcional)
- **Gauge** (um único valor face a um intervalo mín–máx, por exemplo, uma percentagem)
- **Scatter** (pontos X/Y para gráficos de correlação)
- **Proportion** (uma barra dividida em partes com uma legenda de percentagens, por exemplo, uma repartição por idioma)
- **Bar gauge** (um medidor horizontal por linha com um gradiente de vermelho→verde e um valor, por exemplo, espaço livre em disco)
- **Text** (uma mensagem markdown, por exemplo, uma nota de estado como "Última execução às 19:47"; suporta [caixas de seleção interativas](../nodes/chart-output-node.md#interactive-task-lists) quando o markdown é estático, e [listas numeradas explícitas](../nodes/chart-output-node.md#numbered-lists) para numeração personalizada ou descendente)
- **HITL** (as suas revisões humanas pendentes. O cabeçalho mostra `1/n pendentes`. O nome do workflow abre essa execução no canvas. **Aprovar**, **Solicitar alterações** e **Rejeitar** resolvem-na. O ícone de histórico junto ao título do widget abre essa execução na caixa de diálogo de histórico nesta página. O widget não utiliza linhas a montante, e cada pessoa vê a sua própria fila)

Cada widget carrega os seus dados de forma assíncrona quando abre o separador, pelo que a página permanece responsiva enquanto os gráficos são preenchidos.

## Adicionar um widget

1. Clique em **Adicionar widget**, atribua-lhe um título e escolha um tipo de gráfico. Abaixo do seletor, a caixa de diálogo apresenta um exemplo desse tipo de gráfico com dados de amostra e indica as linhas que espera, para que possa comparar tipos antes de construir algo.
2. O widget abre no editor de workflows com um grafo inicial: um nó [Set](../nodes/set-node.md) que produz as linhas, ligado a um nó [Chart Output](../nodes/chart-output-node.md). Substitua o nó Set por qualquer fonte de dados. Um widget **HITL** é apenas o nó Chart Output; lê as suas revisões pendentes e não necessita de uma fonte de dados.
3. Construa o workflow de modo a que o nó que alimenta o **Chart Output** produza um array de linhas e, em seguida, configure o mapeamento de campos do nó Chart Output (campo de etiqueta, campo de valor, etc.).
4. Guarde, regresse ao separador Dashboard e o widget é renderizado.

Faça duplo clique num widget (ou utilize o seu botão de edição) para reabrir o respetivo workflow em qualquer momento. Utilize **Clonar widget** no cabeçalho do widget para duplicar tanto o widget como o seu workflow completo. A cópia é colocada abaixo do original e identificada com **(Cópia)**, para que possa editá-la de forma independente.

## Gerar um widget com IA

Clique em **IA**, descreva a métrica pretendida (por exemplo, "taxa de sucesso dos workflows nos últimos 30 dias como gráfico de barras") e escolha uma credencial de LLM e um modelo. O Heym gera um workflow de widget completo que termina num nó Chart Output e adiciona-o à grelha. Consulte [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) para exemplos de prompts por tipo de gráfico.

Utilize o botão **Ajustar com IA** de um widget para rever um widget existente com uma nova instrução. Cada ajuste com IA guarda uma snapshot do workflow anterior no **Histórico de Edição** do widget, para que possa rever ou reverter alterações a partir do editor de workflows.

## Editar o esquema

Ative **Editar** para entrar no modo de edição, onde pode arrastar widgets e redimensioná-los numa grelha de 12 colunas. As alterações ao esquema são guardadas automaticamente. Os títulos dos widgets são editáveis em linha a partir do cabeçalho do widget.

## Colocação em cache e atualização

Cada widget coloca em cache os seus últimos dados calculados no servidor durante um tempo de vida (TTL) configurável. Enquanto a cache estiver válida, reabrir o dashboard serve o resultado armazenado em vez de executar novamente o workflow. A cache é substituída no local sempre que os dados são recalculados (uma cache por widget) e é automaticamente invalidada quando edita o workflow do widget.

Utilize o botão **Atualizar** de um widget (ou **Atualizar** na barra de ferramentas) para ignorar a cache e recalcular imediatamente.

## Partilha

Os proprietários partilham um dashboard a partir das suas definições, com utilizadores individuais (por email) ou com qualquer [equipa](teams-tab.md) a que pertençam. Cada partilha é de **Leitura** ou de **Escrita**; quando alguém tem simultaneamente uma partilha pessoal e uma partilha de equipa, aplica-se a mais permissiva.

| Ação | Proprietário | Escrita | Leitura |
|--------|:-----:|:-----:|:----:|
| Ver widgets, atualizá-los, utilizar a atualização automática | ✓ | ✓ | ✓ |
| Adicionar, clonar, eliminar, renomear e redimensionar widgets; gerar e afinar com IA; marcar itens da lista de verificação | ✓ | ✓ | |
| Abrir o workflow de um widget no editor | ✓ | ✓ | |
| Renomear ou eliminar o dashboard, gerir a partilha | ✓ | | |

**Os widgets são sempre executados como o proprietário do dashboard.** Independentemente de quem esteja a visualizar, um widget utiliza as credenciais e as variáveis globais do proprietário, e as suas execuções aparecem no histórico de execuções e nos rastreios do proprietário. Os membros da equipa veem, portanto, os mesmos dados sem acesso às contas que lhes estão subjacentes, e todos os visualizadores partilham o mesmo resultado em cache por widget. Os widgets que um colaborador com permissão de escrita adiciona ou clona pertencem igualmente ao proprietário.

Por este motivo, a permissão de **Escrita** acarreta o mesmo nível de confiança que partilhar um workflow para edição: um colaborador com acesso de escrita pode alterar o que é executado com as suas credenciais. Conceda-a apenas a pessoas a quem permitiria editar os seus workflows. Uma execução de teste iniciada por um colaborador a partir do editor de workflows utiliza as suas próprias credenciais, tal como em qualquer workflow partilhado; apenas o próprio dashboard é executado como o proprietário. A permissão de **Leitura** não concede qualquer acesso aos workflows dos widgets, e os visualizadores apenas de leitura recebem o gráfico em si, mas não os detalhes de execução por nó que lhe estão subjacentes.

Remover uma partilha, ou reduzi-la de escrita para leitura, produz efeito imediatamente.

## Relacionado

- [Nó de saída de gráfico](../nodes/chart-output-node.md)
- [Separador de análise](analytics-tab.md) — métricas de execução incorporadas (distintas dos dashboards criados pelo utilizador)
