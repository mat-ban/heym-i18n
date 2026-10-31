# Dashboard

O separador **Dashboard** é um espaço ao estilo do Grafana onde pode construir grelhas de widgets de gráficos. Cada widget é renderizado a partir do resultado do seu próprio workflow Heym oculto, pelo que quaisquer dados que consiga produzir num workflow — consultas a bases de dados, chamadas API, pesquisas RAG, resultados de LLM — podem tornar-se num gráfico. Pode manter vários dashboards e partilhar cada um com pessoas ou equipas.

## Dashboards

Todos começam com um dashboard, criado na primeira vez que abrem o separador. Utilize o seletor de dashboards no topo do separador para alternar entre dashboards, e o **+** ao lado para criar um novo. O seletor lista primeiro os seus próprios dashboards e, em seguida, os que foram partilhados consigo, identificados com o nome da pessoa que os partilhou.

O separador reabre o último dashboard utilizado, e a barra de endereços transporta o dashboard aberto (`?tab=dashboard&dashboard=<id>`), pelo que uma ligação abre esse dashboard exato para qualquer pessoa que tenha acesso ao mesmo.

O botão de definições (apenas para proprietários) permite renomear o dashboard, definir quais os registos que aceita como [página de detalhe](#detail-pages), gerir a partilha e eliminá-lo. Eliminar um dashboard remove os seus widgets e os respetivos workflows. Mantém sempre pelo menos um dashboard próprio, pelo que o último não pode ser eliminado.

## Widgets

Um widget é um único gráfico na grelha. Tipos de gráfico suportados:

- **Bar** (vertical ou horizontal)
- **Line**
- **Area** (tendência preenchida, suporta múltiplas séries)
- **Pie**
- **Table** (com deslocamento; clique no cabeçalho de uma coluna para ordenar por ordem crescente e clique novamente para ordenar por ordem decrescente. Uma coluna pode ser apresentada como [chips de estado](../nodes/chart-output-node.md#status-chips), uma coluna pode conter [botões de ligação](../nodes/chart-output-node.md#link-buttons) que abrem um URL num novo separador, e as linhas podem abrir uma [página de detalhe](#paginas-de-detalhe))
- **Numeric** (um único valor KPI com uma unidade opcional)
- **Gauge** (um único valor face a um intervalo mín–máx, por exemplo, uma percentagem)
- **Scatter** (pontos X/Y para gráficos de correlação)
- **Proportion** (uma barra dividida em partes com uma legenda de percentagens, por exemplo, uma repartição por idioma)
- **Gantt** (datas das tarefas, conclusão e dependências)
- **Entity relationships (DB)** (tabelas, campos, chaves PK/FK e ligações)
- **Bar gauge** (um medidor horizontal por linha com um gradiente de vermelho→verde e um valor, por exemplo, espaço livre em disco)
- **Text** (uma mensagem markdown, por exemplo, uma nota de estado como "Última execução às 19:47"; suporta [caixas de seleção interativas](../nodes/chart-output-node.md#interactive-task-lists) quando o markdown é estático, e [listas numeradas explícitas](../nodes/chart-output-node.md#numbered-lists) para numeração personalizada ou descendente)
- **HITL** (as suas revisões humanas pendentes. O cabeçalho mostra `1/n pendentes`. O nome do workflow abre essa execução no canvas. **Aprovar**, **Solicitar alterações** e **Rejeitar** resolvem-na. O ícone de histórico junto ao título do widget abre essa execução na caixa de diálogo de histórico nesta página. O widget não utiliza linhas a montante, e cada pessoa vê a sua própria fila. Pode, em alternativa, mostrar as revisões de um único Workflow, para todos os que possam abrir esse Workflow; consulte [Widgets HITL](#widgets-hitl))

Além dos gráficos, um widget **Run a workflow** executa um dos seus workflows a partir do dashboard: num ficheiro largado, com os seus campos de entrada ou com um botão Run; consulte [Widgets de execução](#run-widgets).

Cada widget carrega os seus dados de forma assíncrona quando abre o separador, pelo que a página permanece responsiva enquanto os gráficos são preenchidos.

## Adicionar um widget

1. Clique em **Adicionar widget**, atribua-lhe um título e escolha um tipo de gráfico. Abaixo do seletor, a caixa de diálogo apresenta um exemplo desse tipo de gráfico com dados de amostra e indica as linhas que espera, para que possa comparar tipos antes de construir algo.
2. O widget abre no editor de workflows com um grafo inicial: um nó [Set](../nodes/set-node.md) que produz as linhas, ligado a um nó [Chart Output](../nodes/chart-output-node.md). Substitua o nó Set por qualquer fonte de dados. Um widget **HITL** é apenas o nó Chart Output; lê as suas revisões pendentes e não necessita de uma fonte de dados.
3. Construa o workflow de modo a que o nó que alimenta o **Chart Output** produza um array de linhas e, em seguida, configure o mapeamento de campos do nó Chart Output (campo de etiqueta, campo de valor, etc.).
4. Guarde, regresse ao separador Dashboard e o widget é renderizado.

Para um widget **Run a workflow**, escolha antes o workflow que este executa; o seletor indica como o widget executará cada um. O widget é adicionado diretamente à grelha; não há nenhum novo workflow para construir.

Faça duplo clique num widget (ou utilize o seu botão de edição) para reabrir o respetivo workflow em qualquer momento. Utilize **Clonar widget** no cabeçalho do widget para duplicar tanto o widget como o seu workflow completo. A cópia é colocada abaixo do original e identificada com **(Cópia)**, para que possa editá-la de forma independente.

## Widgets HITL

Um novo widget HITL mostra todas as revisões à espera na sua própria fila. Para mostrar apenas as de um Workflow, abra as **Definições** do widget:

1. Em **Workflow**, escolha o Workflow. A lista contém os Workflows que pode abrir, seus ou partilhados consigo ou com a sua equipa, que têm um passo à espera de uma pessoa: um Agent com revisão humana, ou um passo Slack de aprovação, botões ou formulário. O ícone ao lado abre esse Workflow num novo separador.
2. Se o Workflow tiver um único passo deste tipo, este é selecionado automaticamente. Se tiver vários, **Select agent** lista-os pelo nome do nó, com **All agents** em primeiro lugar; os passos Slack são assinalados com **(Slack)**.
3. Guarde. O `1/n pending` do cabeçalho conta apenas essas revisões. Escolha **Todos os workflows** para voltar a mostrar a sua própria fila.

A mesma escolha existe na tela, nas propriedades do nó Chart Output. O **Afinar com IA** pode fazê-la («mostrar apenas as aprovações de faturas»), tal como a descrição de um novo widget que indique o Workflow. Cada alteração é uma edição do Workflow, pelo que aparece no Edit History.

- **Quem vê as revisões.** Um widget filtrado por um Workflow mostra as revisões desse Workflow a todos os que possam abrir o Workflow, e estes podem aprovar, pedir alterações ou rejeitar a partir dele, tal como poderiam executar o Workflow. Um widget sem filtro mostra a cada pessoa a sua própria fila.
- **Quem vê o widget.** Quem não puder abrir o Workflow escolhido não vê o widget de todo, mesmo num dashboard partilhado consigo. Quando o proprietário do dashboard perde o acesso ao Workflow, ou este é eliminado, o proprietário vê «You no longer have access to the workflow this widget shows» e pode escolher outro nas **Definições**.
- **Apenas escolhas acessíveis.** Um Workflow que não possa abrir é recusado quando o widget é guardado, seja a partir das definições, da tela ou da IA.

## Páginas de detalhe

Um widget de tabela pode ligar as suas linhas a outro dashboard, que passa então a funcionar como uma página de detalhe: um único dashboard que serve cada cliente, fatura ou ticket.

1. Abra as **Settings** do widget de tabela e escolha o dashboard em **Row link**.
2. Introduza a **Record column**, a coluna cujo valor identifica a linha (por exemplo `id`), e opcionalmente uma **Label column** que a nomeia (por exemplo `name`).
3. Guarde. Clicar numa linha (ou focá-la e premir Enter) abre o dashboard ligado com `?record=<value>&label=<name>`.

No dashboard de detalhe, cada workflow de widget lê o valor como `$page.record` (consulte [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), e a página apresenta `Dashboard / <label>` acima da grelha com um botão para limpar o registo. Voltar regressa à tabela de onde veio.

- **Quem pode abrir.** As linhas só são clicáveis para os visualizadores que podem abrir o dashboard ligado. Os outros veem a mesma tabela sem ligações.
- **Formato do registo.** O registo provém do URL, pelo que o dashboard de detalhe decide o que aceita. Nas suas definições, **Detail page records** é um dos seguintes: IDs (letras, dígitos, `-`, `_` e `.`, até 128 caracteres; a predefinição), números, UUIDs ou endereços de e-mail. Qualquer outro valor é recusado antes de um widget ser executado, e os widgets apresentam "This page does not accept that record".
- **Continua a ser executado pelo proprietário.** Os widgets também são executados como o proprietário do dashboard numa página de detalhe. Os criadores devem passar `$page.record` apenas onde um nó faça o respetivo escape, nunca diretamente no texto de uma consulta.
- **Colocação em cache.** Cada widget coloca em cache o seu gráfico por registo, durante o mesmo tempo de vida (TTL) que o widget, e mantém os 50 registos utilizados mais recentemente.

## Widgets de execução

Um widget **Run a workflow** executa um dos seus workflows e mostra o resultado: estado, tempo de execução e saídas. O que mostra depende do que o workflow recebe:

- **Um ficheiro.** Para um workflow que começa com um [File Upload Trigger](../nodes/file-upload-trigger-node.md), largue um ficheiro nele (ou clique para escolher um) e o widget carrega-o através da ligação de carregamento de utilização única do trigger. O widget mostra os tipos e o tamanho de ficheiro que o trigger aceita e recusa outros antes do carregamento. Quando o workflow também começa com um nó Text Input, o widget mostra os respetivos campos ao lado da zona de largada: escolha um ficheiro, preencha os campos e **Run** envia ambos. Os valores viajam com a ligação de carregamento gerada pelo widget, pelo que uma ligação de carregamento partilhada não os pode definir.
- **Campos de entrada.** Para um workflow que começa com um nó Text Input, o widget mostra os seus campos com as respetivas predefinições; **Run** executa o workflow com os seus valores. Os valores para campos que o workflow não possui são descartados.
- **Nada.** Um workflow sem entradas recebe um botão **Run**.

O botão **Wrap** do resultado quebra linhas longas de saída dentro da caixa; desative-o para ler a disposição JSON da saída.

- Qualquer pessoa que possa abrir o dashboard pode executar o widget, tal como qualquer pessoa pode atualizar um gráfico. O acesso ao workflow pertence ao proprietário do dashboard: adicionar o widget requer um workflow que tanto o utilizador como o proprietário possam executar, e a própria execução utiliza as credenciais do proprietário do workflow, como qualquer ligação de carregamento.
- O resultado permanece no seu ecrã até sair da página; os outros visualizadores não veem os seus ficheiros, valores ou resultados. A execução aparece no histórico de execuções com o trigger `dashboard`.
- Uma partilha de dashboard nunca concede acesso ao próprio workflow. **Edit workflow** abre-o para pessoas que já têm acesso, e **Fine-tune with AI** não é disponibilizado.
- As execuções de ficheiros decorrem na instância principal, onde os ficheiros carregados são armazenados, tal como acontece em todas as execuções de File Upload Trigger.

## Gerar um widget com IA

Clique em **IA**, descreva a métrica pretendida (por exemplo, "taxa de sucesso dos workflows nos últimos 30 dias como gráfico de barras") e escolha uma credencial de LLM e um modelo. O Heym gera um workflow de widget completo que termina num nó Chart Output e adiciona-o à grelha. Consulte [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) para exemplos de prompts por tipo de gráfico.

O widget recebe um título curto de uma ou duas palavras no idioma do seu pedido, como «Casos abertos». Um título nunca inclui o id de uma tabela de dados; quando o modelo dá ao widget um nome em forma de frase, o Heym mantém as primeiras palavras.

A API de widgets também pode criar um **cartão de contagem** sem IA: um widget `text` numa tabela de dados (`data_table_id`) com `count_column` e `count_value` mostra quantas linhas têm esse valor; o título do widget indica o valor. O Heym Work abre as páginas criadas a partir de uma tabela de dados com um cartão de contagem por estado.

Utilize o botão **Ajustar com IA** de um widget para rever um widget existente com uma nova instrução. Cada ajuste com IA guarda uma snapshot do workflow anterior no **Histórico de Edição** do widget, para que possa rever ou reverter alterações a partir do editor de workflows.

## A partir do Chat e MCP

O [Chat](./chat-tab.md), e os clientes MCP através da ferramenta [`heym_chat`](./mcp-tab.md), podem ler os seus dashboards, adicionar widgets, renomear ou eliminar widgets e organizar o layout de um dashboard. O Heym Work apresenta cada dashboard como uma página, pelo que as mesmas respostas abrangem as suas páginas.

- **Quais os dashboards e o que contêm.** Pergunte "quais os dashboards que tenho?", "o que está no dashboard de Vendas?" ou "em que dashboard está o workflow de receitas?". O Chat lista os seus próprios dashboards e os que foram partilhados consigo, com os seus acessos e uma ligação para cada um, e todos os widgets neles contidos: título, tipo de gráfico e o workflow subjacente. Um [widget HITL](#hitl-widgets) filtrado num workflow que não pode abrir permanece oculto, tal como acontece no dashboard.
- **Um novo widget.** Peça "adiciona um gráfico de processos abertos por estado ao dashboard de Vendas". O Chat coloca primeiro um widget vazio no dashboard, escreve o workflow próprio do widget, executa testes e corrige erros até que uma execução seja bem-sucedida, da mesma forma que [cria workflows](./chat-tab.md#criar-workflows). Não é deixado nenhum workflow separado para trás e cada gravação surge no Edit History do widget. O título e o tipo de gráfico do widget correspondem ao que o Chat grava.
- **Um workflow existente.** Peça "coloca o workflow de receitas no dashboard de Vendas". Um workflow que termine num nó Chart Output torna-se num widget de gráfico com a sua própria cópia do workflow, pelo que alterações posteriores ao widget nunca afetam o original. Um workflow com um nó trigger ou input não pode tornar-se num widget de gráfico. Qualquer outro workflow torna-se num [widget de execução](#run-widgets), que também necessita de um workflow que o proprietário do dashboard possa executar.
- **Renomear ou eliminar um widget.** Peça "renomeia o widget Receitas para Vendas" ou "elimina o widget Processos abertos". O workflow de um widget de gráfico assume também o novo nome; o workflow de um widget de execução mantém o seu. A eliminação de um widget de gráfico elimina o seu workflow em conjunto, tal como faz o botão de eliminação do widget; o workflow de um widget de execução permanece. O Chat apenas elimina um widget que tenha pedido expressamente e pergunta primeiro caso as suas palavras correspondam a vários.
- **Organizar.** Peça "organiza o dashboard de Vendas" ou "adiciona estes três widgets e organiza". O Chat dispõe os widgets visíveis pela sua ordem, tal como faz o botão **Organizar**: linhas de dois ou três aleatoriamente, pelo que voltar a pedir fornece outra disposição. Peça um número por linha ("três por linha") para obter linhas dessa dimensão. Isto organiza o dashboard no Heym; o Heym Work mantém a sua própria organização numa página, que o botão **Organizar** próprio da página altera.

Os novos widgets ficam abaixo dos widgets existentes do dashboard e, como qualquer widget, são executados no contexto do proprietário do dashboard. Adicionar, renomear, eliminar e organizar requerem acesso de escrita ao dashboard. A criação de um novo widget requer um chat capaz de criar workflows: o separador Chat, o Chat para editores do Heym Work e o `heym_chat`.

## Editar o esquema

Ative **Editar** para entrar no modo de edição, onde pode arrastar widgets e redimensioná-los numa grelha de 12 colunas. As alterações ao esquema são guardadas automaticamente. Os títulos dos widgets são editáveis em linha a partir do cabeçalho do widget.

## Colocação em cache e atualização

Cada widget coloca em cache os seus últimos dados calculados no servidor durante um tempo de vida (TTL) configurável. Enquanto a cache estiver válida, reabrir o dashboard serve o resultado armazenado em vez de executar novamente o workflow. A cache é substituída no local sempre que os dados são recalculados (uma cache por widget, mais uma por registo numa [página de detalhe](#detail-pages)) e é automaticamente invalidada quando edita o workflow do widget.

Utilize o botão **Atualizar** de um widget (ou **Atualizar** na barra de ferramentas) para ignorar a cache e recalcular imediatamente.

## Partilha

Os proprietários partilham um dashboard a partir das suas definições, com utilizadores individuais (por email) ou com qualquer [equipa](teams-tab.md) a que pertençam. Cada partilha é de **Leitura** ou de **Escrita**; quando alguém tem simultaneamente uma partilha pessoal e uma partilha de equipa, aplica-se a mais permissiva.

| Ação | Proprietário | Escrita | Leitura |
|--------|:-----:|:-----:|:----:|
| Ver widgets, atualizá-los, utilizar a atualização automática | ✓ | ✓ | ✓ |
| Abrir páginas de detalhe, executar widgets de execução | ✓ | ✓ | ✓ |
| Adicionar, clonar, eliminar, renomear e redimensionar widgets; gerar e afinar com IA; marcar itens da lista de verificação | ✓ | ✓ | |
| Abrir o workflow de um widget no editor | ✓ | ✓ | |
| Renomear ou eliminar o dashboard, definir o formato de registo, gerir a partilha | ✓ | | |

**Os widgets são sempre executados como o proprietário do dashboard.** Independentemente de quem esteja a visualizar, um widget utiliza as credenciais e as variáveis globais do proprietário, e as suas execuções aparecem no histórico de execuções e nos rastreios do proprietário. Os membros da equipa veem, portanto, os mesmos dados sem acesso às contas que lhes estão subjacentes, e todos os visualizadores partilham o mesmo resultado em cache por widget. Os widgets que um colaborador com permissão de escrita adiciona ou clona pertencem igualmente ao proprietário.

Por este motivo, a permissão de **Escrita** acarreta o mesmo nível de confiança que partilhar um workflow para edição: um colaborador com acesso de escrita pode alterar o que é executado com as suas credenciais. Conceda-a apenas a pessoas a quem permitiria editar os seus workflows. Uma execução de teste iniciada por um colaborador a partir do editor de workflows utiliza as suas próprias credenciais, tal como em qualquer workflow partilhado; apenas o próprio dashboard é executado como o proprietário. A permissão de **Leitura** não concede qualquer acesso aos workflows dos widgets, e os visualizadores apenas de leitura recebem o gráfico em si, mas não os detalhes de execução por nó que lhe estão subjacentes.

Remover uma partilha, ou reduzi-la de escrita para leitura, produz efeito imediatamente.

## Relacionado

- [Nó de saída de gráfico](../nodes/chart-output-node.md)
- [Separador de análise](analytics-tab.md) — métricas de execução incorporadas (distintas dos dashboards criados pelo utilizador)

## Cronogramas e diagramas de base de dados

Escolha **Gantt** em Adicionar widget para apresentar tarefas ao longo do tempo com estado de conclusão e ligações de dependência, ou **Entity relationships (DB)** para mapear tabelas, campos e as suas relações. Ambos os tipos utilizam o [nó Chart Output](../nodes/chart-output-node.md#gantt-schedules) e também estão disponíveis nas páginas do Heym Work. Quando o Work sugere widgets para um cronograma ou esquema de base de dados, desenha pré-visualizações a partir das tarefas ou entidades propostas.
