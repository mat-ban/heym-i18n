# Dashboard

A aba **Dashboard** é um espaço no estilo Grafana onde você constrói grades de widgets de gráficos. Cada widget é renderizado a partir da saída de seu próprio Workflow Heym oculto, então qualquer dado que você possa produzir em um Workflow — consultas a banco de dados, chamadas de API, buscas RAG, saída de LLM — pode se tornar um gráfico. Você pode manter vários dashboards e compartilhar cada um com pessoas ou equipes.

## Dashboards

Todos começam com um dashboard, criado na primeira vez que abrem a aba. Use o seletor de dashboards no topo da aba para alternar entre dashboards, e o **+** ao lado dele para criar um novo. O seletor lista primeiro os seus próprios dashboards, depois os compartilhados com você, rotulados com o nome da pessoa que os compartilhou.

A aba reabre o dashboard que você usou por último, e a barra de endereços carrega o dashboard aberto (`?tab=dashboard&dashboard=<id>`), então um link abre exatamente aquele dashboard para qualquer pessoa que tenha acesso a ele.

O botão de configurações (apenas para proprietários) renomeia o dashboard, define quais registros ele aceita como [página de detalhes](#detail-pages), gerencia o compartilhamento e o exclui. Excluir um dashboard remove seus widgets e seus Workflows. Você sempre mantém pelo menos um dashboard próprio, então o último não pode ser excluído.

## Widgets

Um widget é um único gráfico na grade. Tipos de gráfico suportados:

- **Bar** (vertical ou horizontal)
- **Line**
- **Area** (tendência preenchida, suporta múltiplas séries)
- **Pie**
- **Table** (rolável; uma coluna pode ser renderizada como [chips de status](../nodes/chart-output-node.md#status-chips), e as linhas podem abrir uma [página de detalhes](#detail-pages))
- **Numeric** (um único valor de KPI com uma unidade opcional)
- **Gauge** (um único valor em relação a um intervalo mín–máx, por exemplo, uma porcentagem)
- **Scatter** (pontos X/Y para gráficos de correlação)
- **Proportion** (uma barra dividida em fatias com uma legenda de porcentagem, por exemplo, uma divisão por idioma)
- **Bar gauge** (um medidor horizontal por linha com um gradiente de vermelho→verde e um valor, por exemplo, espaço livre em disco)
- **Text** (uma mensagem markdown, por exemplo, uma nota de status como "Última execução às 19:47"; suporta [checkboxes interativos](../nodes/chart-output-node.md#interactive-task-lists) quando o markdown é estático, e [listas numeradas explícitas](../nodes/chart-output-node.md#numbered-lists) para numeração personalizada ou decrescente)
- **HITL** (suas revisões humanas pendentes. O cabeçalho mostra `1/n pending`. O nome do Workflow abre aquela execução no canvas. **Approve**, **Request changes** e **Reject** a resolvem. O ícone de histórico ao lado do título do widget abre aquela execução no diálogo de histórico nesta página. O widget não usa linhas upstream, e cada pessoa vê sua própria fila)

Além dos gráficos, um widget **Run a workflow** executa um dos seus Workflows a partir do dashboard: em um arquivo solto, com seus campos de entrada ou com um botão Run; veja [Widgets de execução](#run-widgets).

Cada widget carrega seus dados de forma assíncrona quando você abre a aba, então a página permanece responsiva enquanto os gráficos são preenchidos.

## Adicionando um widget

1. Clique em **Add widget**, dê um título a ele e escolha um tipo de gráfico. Abaixo do seletor, o diálogo desenha um exemplo daquele tipo de gráfico com dados de amostra e nomeia as linhas que ele espera, para que você possa comparar tipos antes de construir qualquer coisa.
2. O widget abre no editor de Workflow com um grafo inicial: um Nó [Set](../nodes/set-node.md) que produz as linhas, conectado a um Nó [Chart Output](../nodes/chart-output-node.md). Substitua o Nó Set por qualquer fonte de dados. Um widget **HITL** é apenas o Nó Chart Output; ele lê suas revisões pendentes e não precisa de uma fonte de dados.
3. Construa o Workflow de modo que o Nó que alimenta o **Chart Output** produza um array de linhas, depois configure o mapeamento de campos do Nó Chart Output (campo de rótulo, campo de valor, etc.).
4. Salve, retorne à aba Dashboard, e o widget é renderizado.

Para um widget **Run a workflow**, escolha em vez disso o Workflow que ele executa; o seletor informa como o widget executará cada um. O widget é adicionado diretamente à grade; não há um novo Workflow para construir.

Dê um duplo clique em um widget (ou use seu botão de edição) para reabrir seu Workflow a qualquer momento. Use **Clone
widget** no cabeçalho do widget para duplicar tanto o widget quanto seu Workflow completo. A cópia é
colocada abaixo do original e rotulada com **(Copy)** para que você possa editá-la de forma independente.

## Páginas de detalhes

Um widget de tabela pode vincular suas linhas a outro dashboard, que então funciona como uma página de detalhes: um único dashboard que atende cada cliente, fatura ou ticket.

1. Abra as **Settings** do widget de tabela e escolha o dashboard em **Row link**.
2. Insira a **Record column**, a coluna cujo valor identifica a linha (por exemplo `id`), e opcionalmente uma **Label column** que a nomeia (por exemplo `name`).
3. Salve. Clicar em uma linha (ou focá-la e pressionar Enter) abre o dashboard vinculado com `?record=<value>&label=<name>`.

No dashboard de detalhes, cada Workflow de widget lê o valor como `$page.record` (veja [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), e a página mostra `Dashboard / <label>` acima da grade com um botão para limpar o registro. Voltar retorna para a tabela de onde você veio.

- **Quem pode abrir.** As linhas só são clicáveis para visualizadores que podem abrir o dashboard vinculado. Outros veem a mesma tabela sem links.
- **Formato do registro.** O registro vem da URL, então o dashboard de detalhes decide o que aceita. Em suas configurações, **Detail page records** é um dos seguintes: IDs (letras, dígitos, `-`, `_` e `.`, até 128 caracteres; o padrão), números, UUIDs ou endereços de e-mail. Qualquer outro valor é recusado antes que um widget seja executado, e os widgets mostram "This page does not accept that record".
- **Ainda é a execução do proprietário.** Os widgets também são executados como o proprietário do dashboard em uma página de detalhes. Os criadores devem passar `$page.record` apenas onde um nó faça o escape dele, nunca diretamente no texto da consulta.
- **Cache.** Cada widget armazena em cache seu gráfico por registro, pelo mesmo tempo de vida (TTL) do widget, e mantém os 50 registros usados mais recentemente.

## Widgets de execução

Um widget **Run a workflow** executa um dos seus Workflows e mostra o resultado: status, tempo de execução e saídas. O que ele mostra depende do que o Workflow recebe:

- **Um arquivo.** Para um Workflow que começa com um [File Upload Trigger](../nodes/file-upload-trigger-node.md), solte um arquivo nele (ou clique para escolher um) e o widget fará o upload por meio do link de upload de uso único do trigger. O widget mostra os tipos e o tamanho de arquivo que o trigger aceita e recusa outros antes do upload. Quando o Workflow também começa com um nó Text Input, o widget mostra seus campos ao lado da área de soltar: escolha um arquivo, preencha os campos e **Run** envia ambos. Os valores trafegam com o link de upload gerado pelo widget, de modo que um link de upload compartilhado não pode defini-los.
- **Campos de entrada.** Para um Workflow que começa com um nó Text Input, o widget mostra seus campos com os padrões; **Run** executa o Workflow com seus valores. Valores para campos que o Workflow não possui são descartados.
- **Nada.** Um Workflow sem entradas recebe um botão **Run**.

O botão **Wrap** do resultado quebra linhas longas de saída dentro da caixa; desative-o para ler o layout JSON da saída.

- Qualquer pessoa que possa abrir o dashboard pode executar o widget, assim como qualquer pessoa pode atualizar um gráfico. O acesso ao Workflow é do proprietário do dashboard: adicionar o widget requer um Workflow que tanto você quanto o proprietário possam executar, e a execução em si usa as credenciais do proprietário do Workflow, como qualquer link de upload.
- O resultado permanece na sua tela até que você saia da página; outros visualizadores não veem seus arquivos, valores ou resultados. A execução aparece no histórico de execuções com o trigger `dashboard`.
- Um compartilhamento de dashboard nunca concede acesso ao Workflow em si. **Edit workflow** o abre para pessoas que já têm acesso, e **Fine-tune with AI** não é oferecido.
- Execuções com arquivo são processadas na instância principal, onde os arquivos enviados são armazenados, como toda execução de File Upload Trigger.

## Gerando um widget com IA

Clique em **AI**, descreva a métrica que você deseja (por exemplo, "taxa de sucesso de Workflow nos últimos 30 dias como um gráfico de barras") e escolha uma credencial de LLM e um modelo. O Heym gera um Workflow de widget completo terminando em um Nó Chart Output e o adiciona à grade. Consulte [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) para exemplos de prompts por tipo de gráfico.

Use o botão **Fine-tune with AI** de um widget para revisar um widget existente com uma nova instrução. Cada ajuste fino por IA cria um snapshot do Workflow anterior no **Edit History** do widget, para que você possa revisar ou reverter alterações a partir do editor de Workflow.

## Editando o layout

Ative **Edit** para entrar no modo de edição, onde você pode arrastar widgets e redimensioná-los em uma grade de 12 colunas. As alterações de layout são salvas automaticamente. Os títulos dos widgets são editáveis inline a partir do cabeçalho do widget.

## Cache e atualização

Cada widget armazena em cache seus últimos dados computados no servidor por um tempo de vida (TTL) configurável. Enquanto o cache estiver válido, reabrir o dashboard serve o resultado armazenado em vez de executar o Workflow novamente. O cache é substituído no local toda vez que os dados são recalculados (um cache por widget, mais um por registro em uma [página de detalhes](#detail-pages)), e é automaticamente invalidado quando você edita o Workflow do widget.

Use o botão **Refresh** de um widget (ou **Refresh** na barra de ferramentas) para ignorar o cache e recalcular imediatamente.
## Compartilhamento

Os proprietários compartilham um dashboard a partir de suas configurações, com usuários individuais (por email) ou com qualquer [equipe](teams-tab.md) à qual pertençam. Cada compartilhamento é **Leitura** ou **Escrita**; quando alguém possui tanto um compartilhamento pessoal quanto um de equipe, o mais forte prevalece.

| Ação | Proprietário | Escrita | Leitura |
|--------|:-----:|:-----:|:----:|
| Visualizar widgets, atualizá-los, usar atualização automática | ✓ | ✓ | ✓ |
| Abrir páginas de detalhes, executar widgets de execução | ✓ | ✓ | ✓ |
| Adicionar, clonar, excluir, renomear e redimensionar widgets; gerar e ajustar com IA; marcar itens de checklist | ✓ | ✓ | |
| Abrir o workflow de um widget no editor | ✓ | ✓ | |
| Renomear ou excluir o dashboard, definir seu formato de registro, gerenciar o compartilhamento | ✓ | | |

**Os widgets sempre são executados como o proprietário do dashboard.** Independentemente de quem esteja visualizando, um widget usa as credenciais e variáveis globais do proprietário, e suas execuções aparecem no histórico de execuções e traces do proprietário. Dessa forma, os colegas de equipe veem os mesmos dados sem acesso às contas por trás deles, e cada visualizador compartilha o mesmo resultado em cache por widget. Os widgets que um colaborador com permissão de escrita adiciona ou clona também pertencem ao proprietário.

Por isso, **Escrita** carrega a mesma confiança que compartilhar um workflow para edição: um colaborador com acesso de escrita pode alterar o que é executado com suas credenciais. Conceda isso apenas a pessoas que você permitiria editar seus workflows. Uma execução de teste que um colaborador inicia a partir do editor de workflow usa as próprias credenciais dele, como em qualquer workflow compartilhado; apenas o dashboard em si é executado como o proprietário. **Leitura** não concede acesso aos workflows dos widgets, e visualizadores somente leitura recebem o gráfico em si, mas não os detalhes de execução por Nó por trás dele.

Remover um compartilhamento, ou reduzi-lo de escrita para leitura, tem efeito imediato.

## Relacionados

- [Nó Chart Output](../nodes/chart-output-node.md)
- [Aba Analytics](analytics-tab.md) — métricas de execução integradas (distintas dos dashboards criados pelo usuário)
