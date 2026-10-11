# Dashboard

A aba **Dashboard** é um espaço no estilo Grafana onde você constrói grades de widgets de gráficos. Cada widget é renderizado a partir da saída de seu próprio Workflow Heym oculto, então qualquer dado que você possa produzir em um Workflow — consultas a banco de dados, chamadas de API, buscas RAG, saída de LLM — pode se tornar um gráfico. Você pode manter vários dashboards e compartilhar cada um com pessoas ou equipes.

## Dashboards

Todos começam com um dashboard, criado na primeira vez que abrem a aba. Use o seletor de dashboards no topo da aba para alternar entre dashboards, e o **+** ao lado dele para criar um novo. O seletor lista primeiro os seus próprios dashboards, depois os compartilhados com você, rotulados com o nome da pessoa que os compartilhou.

A aba reabre o dashboard que você usou por último, e a barra de endereços carrega o dashboard aberto (`?tab=dashboard&dashboard=<id>`), então um link abre exatamente aquele dashboard para qualquer pessoa que tenha acesso a ele.

O botão de configurações (apenas para proprietários) renomeia o dashboard, gerencia o compartilhamento e o exclui. Excluir um dashboard remove seus widgets e seus Workflows. Você sempre mantém pelo menos um dashboard próprio, então o último não pode ser excluído.

## Widgets

Um widget é um único gráfico na grade. Tipos de gráfico suportados:

- **Bar** (vertical ou horizontal)
- **Line**
- **Area** (tendência preenchida, suporta múltiplas séries)
- **Pie**
- **Table** (rolável)
- **Numeric** (um único valor de KPI com uma unidade opcional)
- **Gauge** (um único valor em relação a um intervalo mín–máx, por exemplo, uma porcentagem)
- **Scatter** (pontos X/Y para gráficos de correlação)
- **Proportion** (uma barra dividida em fatias com uma legenda de porcentagem, por exemplo, uma divisão por idioma)
- **Bar gauge** (um medidor horizontal por linha com um gradiente de vermelho→verde e um valor, por exemplo, espaço livre em disco)
- **Text** (uma mensagem markdown, por exemplo, uma nota de status como "Última execução às 19:47"; suporta [checkboxes interativos](../nodes/chart-output-node.md#interactive-task-lists) quando o markdown é estático, e [listas numeradas explícitas](../nodes/chart-output-node.md#numbered-lists) para numeração personalizada ou decrescente)
- **HITL** (suas revisões humanas pendentes. O cabeçalho mostra `1/n pending`. O nome do Workflow abre aquela execução no canvas. **Approve**, **Request changes** e **Reject** a resolvem. O ícone de histórico ao lado do título do widget abre aquela execução no diálogo de histórico nesta página. O widget não usa linhas upstream, e cada pessoa vê sua própria fila)

Cada widget carrega seus dados de forma assíncrona quando você abre a aba, então a página permanece responsiva enquanto os gráficos são preenchidos.

## Adicionando um widget

1. Clique em **Add widget**, dê um título a ele e escolha um tipo de gráfico. Abaixo do seletor, o diálogo desenha um exemplo daquele tipo de gráfico com dados de amostra e nomeia as linhas que ele espera, para que você possa comparar tipos antes de construir qualquer coisa.
2. O widget abre no editor de Workflow com um grafo inicial: um Nó [Set](../nodes/set-node.md) que produz as linhas, conectado a um Nó [Chart Output](../nodes/chart-output-node.md). Substitua o Nó Set por qualquer fonte de dados. Um widget **HITL** é apenas o Nó Chart Output; ele lê suas revisões pendentes e não precisa de uma fonte de dados.
3. Construa o Workflow de modo que o Nó que alimenta o **Chart Output** produza um array de linhas, depois configure o mapeamento de campos do Nó Chart Output (campo de rótulo, campo de valor, etc.).
4. Salve, retorne à aba Dashboard, e o widget é renderizado.

Dê um duplo clique em um widget (ou use seu botão de edição) para reabrir seu Workflow a qualquer momento. Use **Clone
widget** no cabeçalho do widget para duplicar tanto o widget quanto seu Workflow completo. A cópia é
colocada abaixo do original e rotulada com **(Copy)** para que você possa editá-la de forma independente.

## Gerando um widget com IA

Clique em **AI**, descreva a métrica que você deseja (por exemplo, "taxa de sucesso de Workflow nos últimos 30 dias como um gráfico de barras") e escolha uma credencial de LLM e um modelo. O Heym gera um Workflow de widget completo terminando em um Nó Chart Output e o adiciona à grade. Consulte [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) para exemplos de prompts por tipo de gráfico.

Use o botão **Fine-tune with AI** de um widget para revisar um widget existente com uma nova instrução. Cada ajuste fino por IA cria um snapshot do Workflow anterior no **Edit History** do widget, para que você possa revisar ou reverter alterações a partir do editor de Workflow.

## Editando o layout

Ative **Edit** para entrar no modo de edição, onde você pode arrastar widgets e redimensioná-los em uma grade de 12 colunas. As alterações de layout são salvas automaticamente. Os títulos dos widgets são editáveis inline a partir do cabeçalho do widget.

## Cache e atualização

Cada widget armazena em cache seus últimos dados computados no servidor por um tempo de vida (TTL) configurável. Enquanto o cache estiver válido, reabrir o dashboard serve o resultado armazenado em vez de executar o Workflow novamente. O cache é substituído no local toda vez que os dados são recalculados (um cache por widget), e é automaticamente invalidado quando você edita o Workflow do widget.

Use o botão **Refresh** de um widget (ou **Refresh** na barra de ferramentas) para ignorar o cache e recalcular imediatamente.
## Compartilhamento

Os proprietários compartilham um dashboard a partir de suas configurações, com usuários individuais (por email) ou com qualquer [equipe](teams-tab.md) à qual pertençam. Cada compartilhamento é **Leitura** ou **Escrita**; quando alguém possui tanto um compartilhamento pessoal quanto um de equipe, o mais forte prevalece.

| Ação | Proprietário | Escrita | Leitura |
|--------|:-----:|:-----:|:----:|
| Visualizar widgets, atualizá-los, usar atualização automática | ✓ | ✓ | ✓ |
| Adicionar, clonar, excluir, renomear e redimensionar widgets; gerar e ajustar com IA; marcar itens de checklist | ✓ | ✓ | |
| Abrir o workflow de um widget no editor | ✓ | ✓ | |
| Renomear ou excluir o dashboard, gerenciar o compartilhamento | ✓ | | |

**Os widgets sempre são executados como o proprietário do dashboard.** Independentemente de quem esteja visualizando, um widget usa as credenciais e variáveis globais do proprietário, e suas execuções aparecem no histórico de execuções e traces do proprietário. Dessa forma, os colegas de equipe veem os mesmos dados sem acesso às contas por trás deles, e cada visualizador compartilha o mesmo resultado em cache por widget. Os widgets que um colaborador com permissão de escrita adiciona ou clona também pertencem ao proprietário.

Por isso, **Escrita** carrega a mesma confiança que compartilhar um workflow para edição: um colaborador com acesso de escrita pode alterar o que é executado com suas credenciais. Conceda isso apenas a pessoas que você permitiria editar seus workflows. Uma execução de teste que um colaborador inicia a partir do editor de workflow usa as próprias credenciais dele, como em qualquer workflow compartilhado; apenas o dashboard em si é executado como o proprietário. **Leitura** não concede acesso aos workflows dos widgets, e visualizadores somente leitura recebem o gráfico em si, mas não os detalhes de execução por Nó por trás dele.

Remover um compartilhamento, ou reduzi-lo de escrita para leitura, tem efeito imediato.

## Relacionados

- [Nó Chart Output](../nodes/chart-output-node.md)
- [Aba Analytics](analytics-tab.md) — métricas de execução integradas (distintas dos dashboards criados pelo usuário)
