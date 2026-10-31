# Saída de Gráfico

O nó **Saída de Gráfico** é o nó terminal de um workflow de [widget de dashboard](../tabs/dashboard-tab.md). Ele recebe as linhas produzidas pelos nós anteriores e as transforma em um payload de gráfico padronizado que o dashboard renderiza.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 0 (terminal) |
| Saída | Payload de gráfico padronizado |

Posicione este nó **por último** em um workflow de widget de dashboard. Para relações de entidades, o nó anterior produz um objeto grafo (consulte [Entity relationships](#entity-relationships-db)). Outros gráficos orientados a dados usam um array de objetos de linha, por exemplo:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Quando você tiver apenas dados de exemplo/amostra (sem fonte real), produza essas linhas com um nó **Set** usando `$array(dict(...), dict(...))` — por exemplo `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Não** utilize `${...}` nem literais de objeto `{...}` isolados; o Heym constrói objetos apenas com `dict(key=value)`.

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `gantt`, `erDiagram`, `text` ou `hitl` |
| `orientation` | string | `vertical` ou `horizontal` (apenas para gráficos de barras) |
| `dataPath` | string | Caminho com pontos até o array de linhas (ou objeto grafo para `erDiagram`) dentro da saída anterior (ex.: `data` ou `result.items`). Deixe vazio para detecção automática. |
| `labelField` | string | Chave da linha usada como rótulo de categoria (pie/bar/line) |
| `valueField` | string | Chave da linha usada como valor numérico (pie/bar/line/numeric/gauge) |
| `series` | array | Definição opcional de múltiplas séries `[{ "name": "Sent", "field": "sent" }]` para bar/line (substitui `valueField`) |
| `columns` | array | Lista opcional de colunas para `table` (o padrão são as chaves da primeira linha) |
| `statusColumn` | string | Coluna opcional de `table` apresentada como [etiquetas de estado](#status-chips) coloridas. Tem de ser uma das colunas apresentadas. |, e com `linkColumn` inclui a coluna de ligação e o texto do botão.
| `statusTones` | object | Mapeamento opcional de um valor de estado para um tom (`success`, `attention`, `failure`, `waiting`, `neutral`) para valores não abrangidos pelas predefinições |
| `linkColumn` | string | Coluna `table` opcional cujas células contêm um URL, apresentada como [botão de ligação](#link-buttons) que o abre num novo separador. Tem de ser uma das colunas apresentadas. |
| `linkLabel` | string | Texto opcional do botão de ligação. Se ficar vazio, o botão mostra apenas um ícone de ligação. |
| `xField` / `yField` | string | Chaves das linhas para os eixos numéricos X e Y (scatter) |
| `min` / `max` | number | Intervalo numérico para `gauge` (padrão `0` / `100`) |
| `unit` | string | Unidade opcional exibida ao lado de um valor `numeric` ou `gauge` |
| `text` | string | Mensagem em Markdown para o tipo de gráfico `text`. Deixe vazio e defina `valueField` para renderizar uma mensagem dinâmica obtida dos dados anteriores. |
| `title` | string | Título opcional do gráfico |
| `hitlWorkflowId` | string | Apenas `hitl`. Mostra só as revisões deste workflow. Se ficar vazio, o widget mostra todas as revisões. |
| `hitlNodeId` | string | Apenas `hitl`. Restringe `hitlWorkflowId` a um passo: um Agent com revisão humana, ou um passo Slack de aprovação, botões ou formulário. |

## Tipos de gráfico

- **bar / line / area / pie** — gráficos categóricos controlados por `labelField` + `valueField` (ou `series` para bar/line/area com múltiplas séries). `area` é um gráfico de tendência preenchido.
- **table** — linhas brutas renderizadas como uma tabela rolável usando `columns`. Uma coluna pode ser apresentada como [etiquetas de estado](#status-chips) e as linhas podem abrir uma [página de detalhes](../tabs/dashboard-tab.md#detail-pages).
- **numeric** — um único valor de KPI da primeira linha, com uma `unit` opcional.
- **gauge** — um único valor exibido em um intervalo `min`–`max` (por exemplo, uma porcentagem). Usa `valueField`.
- **scatter** — pontos X/Y a partir de `xField` e `yField` para gráficos de correlação.
- **proportion** — uma única barra horizontal dividida em frações com uma legenda percentual (por exemplo, uma distribuição de idiomas). Usa `labelField` + `valueField`.
- **barGauge** — um medidor horizontal por linha com um gradiente de vermelho→verde e um valor (por exemplo, espaço livre em disco). Usa `labelField` + `valueField`, com `unit` e `max` opcionais (o padrão é o maior valor de linha).
- **gantt** — cronogramas de tarefas com datas, progresso e dependências; consulte [Cronogramas de Gantt](#gantt-schedules).
- **erDiagram** — entidades de base de dados, campos, chaves e relações; consulte [Entity relationships](#entity-relationships-db).
- **text** — uma mensagem em markdown (por exemplo, uma nota de status como "Última execução às 19:47"). Coloque o markdown em `text` para uma mensagem estática, ou deixe `text` vazio e defina `valueField` para renderizar uma string produzida anteriormente. Suporta títulos, negrito/itálico, [listas](../nodes/chart-output-node.md#interactive-task-lists), links e código embutido.
- **hitl** — um carrossel das suas revisões humanas pendentes. O cabeçalho exibe `1/n pending`; a seta esquerda fica desabilitada no primeiro cartão e a seta direita no último. O nome do workflow abre essa execução no canvas. **Approve**, **Request changes** e **Reject** a resolvem, e o ícone de histórico ao lado do título do widget abre essa execução no diálogo de histórico na mesma página. Este tipo de gráfico ignora as linhas anteriores, portanto o workflow do widget é apenas o nó Saída de Gráfico. Cada pessoa autenticada vê as revisões nos workflows que possui. Escolha um **Workflow** (e **Select agent** quando tiver vários passos de revisão) nas propriedades do nó ou nas definições do widget para mostrar em vez disso as revisões desse workflow, a todos os que o possam abrir; consulte [widgets HITL](../tabs/dashboard-tab.md#hitl-widgets).
### Cronogramas de Gantt

Escolha **Gantt** (`gantt`) para calendários de projetos e linhas temporais de tarefas. Defina `dataPath` para o array de tarefas, como `tasks`. As linhas usam nomes de campo fixos:

```json
{
  "tasks": [
    { "id": "design", "label": "Design", "start": "2026-10-01", "end": "2026-10-05", "progress": 100 },
    { "id": "build", "label": "Build", "start": "2026-10-05", "end": "2026-10-14", "progress": 40, "dependencies": ["design"] }
  ]
}
```

`start` e `end` aceitam datas ou carimbos de data/hora ISO. Valores sem fuso horário utilizam UTC; desvios de fuso horário são convertidos para UTC. `end` deve ser igual ou posterior a `start`. `progress` é opcional (0–100, predefinido 0); `dependencies` contém identificadores de tarefas existentes. Os identificadores têm de ser únicos. Passe o cursor sobre uma tarefa para ler datas completas, progresso e dependências. Gráficos extensos deslocam-se dentro do widget. É aceite um máximo de 500 tarefas.

Para dados de exemplo, um mapeamento Set com o nome `tasks` pode utilizar `$array(dict(id="design", label="Design", start="2026-10-01", end="2026-10-05", progress=60))`. Ligue-o ao Chart Output com `chartType: "gantt"` e `dataPath: "tasks"`. Mapeie as colunas de origem para estes nomes fixos através de um nó Set; `labelField` e `valueField` não são utilizados.

### Entity relationships (DB)

Escolha **Entity relationships (DB)** (`erDiagram`) para esquemas de base de dados e ligações de entidades. Defina `dataPath` para um **objeto** grafo, como `graph`, contendo ambos os arrays:

```json
{
  "graph": {
    "entities": [
      { "id": "customers", "label": "Customers", "fields": [{ "name": "id", "type": "uuid", "key": "PK" }] },
      { "id": "orders", "label": "Orders", "fields": [{ "name": "customer_id", "type": "uuid", "key": "FK" }] }
    ],
    "relations": [
      { "source": "customers", "target": "orders", "sourceField": "id", "targetField": "customer_id", "cardinality": "one-to-many", "label": "places" }
    ]
  }
}
```

Os campos têm um `name`, `type` opcional e `key` opcional (`PK`, `FK`, `PK/FK` ou vazio). As relações referenciam identificadores de entidades existentes; os campos opcionais `sourceField` e `targetField` ancoram a ligação a campos nomeados. `cardinality` aceita `one-to-one`, `one-to-many` (predefinido), `many-to-one` ou `many-to-many`. Os identificadores de entidades e os nomes de campo em cada entidade têm de ser únicos. É aceite um máximo de 100 entidades, 100 campos por entidade e 500 relações.

Com um nó Set, construa `graph` com `$dict(entities=array(dict(...)), relations=array(dict(...)))`; utilize `chartType: "erDiagram"` e `dataPath: "graph"`. Esta é uma visualização do esquema fornecido; não inspeciona automaticamente uma base de dados ativa.

Ambos os tipos surgem em **Adicionar widget** com pré-visualização e no seletor de tipo de gráfico do nó na tela. O Heym Work pode propor estes tipos ao descrever um cronograma ou esquema de base de dados, desenhando pré-visualizações das tarefas ou entidades propostas antes de criar a página.

### Listas de tarefas interativas

Utilize a sintaxe de lista de tarefas do markdown compatível com GitHub no campo estático `text`:

```markdown
- [x] Opção 1
- [ ] Opção 2
- [ ] Opção 3
```

No [Dashboard](../tabs/dashboard-tab.md), as caixas de seleção são renderizadas como controles clicáveis (compatíveis com modo escuro e claro). Alternar uma caixa de seleção atualiza o campo `text` do workflow do widget e persiste entre atualizações.

**Edição em linha:** clique duas vezes no rótulo de um item de tarefa para editá-lo no local. Pressione Enter ou clique fora para salvar; pressione Escape para cancelar. Limpe o rótulo completamente para remover esse item da lista.

**Links em itens de tarefa:** quando um rótulo contém um link markdown (`[título](url)`), clicar no link abre a URL sem alternar a caixa de seleção. Clique em qualquer outro lugar da linha para alternar.

**Apenas texto estático:** a interatividade exige a sintaxe de lista de tarefas GFM (`- [ ]` / `- [x]`). Mensagens de status dinâmicas simples, sem itens de tarefa, permanecem somente leitura. Quando o markdown vem de `valueField`, a primeira alternância o copia para o campo estático `text` para que as alterações persistam.

### Listas numeradas

Os widgets de texto renderizam markdown com **números de linha explícitos preservados**. Prefixe cada linha com o número que deseja exibir (por exemplo, `9.`, `8.`, `7.`). O Heym não renumera as linhas para você.

**Por que números explícitos?** Listas ordenadas padrão de markdown (`1.`, `2.`, `3.`) tornam-se listas HTML `<ol>`, que só contam **para cima** a partir do primeiro número. Uma lista escrita como `9.` / `8.` / `7.` seria exibida como `9`, `10`, `11` em um renderizador de markdown comum. Prefixar cada linha com o número desejado evita isso.

**Listas decrescentes (por exemplo, mais recentes primeiro):** construa o markdown em um loop de workflow e calcule o número de exibição por item:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Padrão típico:

1. Busque ou construa um array de itens (por exemplo, HTTP → `body.videos`).
2. [Loop](./loop-node.md) sobre o array; dentro do corpo, use uma [Variable](./variable-node.md) com `.add()` para acrescentar uma linha numerada por iteração.
3. Após o branch **done** do loop, [Set](./set-node.md) `join("\n")` no array acumulado (ou equivalente) em uma única string markdown.
4. Aponte o `valueField` de **Chart Output** para essa string (ou defina o `text` estático).

Exemplo de expressão de linha dentro do loop (rótulo `processVideos`, itens com `title` e `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Markdown resultante:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Para uma lista crescente simples começando em 1, prefixe cada linha (`1.`, `2.`, `3.`) ou use um loop com `$loop.index + 1`. Use [listas com marcadores](#interactive-task-lists) (`- item`) quando não precisar de números.

## Etiquetas de estado

Uma `table` pode mostrar uma coluna como etiquetas coloridas. Defina **Status column** nas propriedades do nó (ou `statusColumn` na DSL) com o nome de uma coluna. Cada valor recebe um de cinco tons, e as palavras comuns recebem um sem configuração adicional:

| Tom | Palavras predefinidas |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | qualquer outro valor |

A correspondência ignora maiúsculas/minúsculas, `_` e `-`, pelo que `IN_PROGRESS` e `in-progress` correspondem ambos a `waiting`. Adicione **Status tones** para outros valores; uma entrada substitui a predefinição para esse valor:

```json
{
  "type": "chartOutput",
  "data": {
    "label": "invoices",
    "chartType": "table",
    "dataPath": "rows",
    "columns": ["invoice", "customer", "state"],
    "statusColumn": "state",
    "statusTones": { "Disputed": "failure" }
  }
}
```

O servidor resolve cada valor para o respetivo tom, para que o Heym e o Heym Work apresentem as mesmas cores.

## Páginas de detalhes: `$page.record`

Um painel aberto com `?record=<value>` executa cada Workflow de widget com esse valor como `$page.record`. Uma ligação numa linha da tabela abre essa página; consulte [Páginas de detalhes](../tabs/dashboard-tab.md#detail-pages). No painel aberto sem registo e na caixa de diálogo de expressões, `$page.record` é `null`. Um nó com a etiqueta `page` tem precedência sobre ele.

Utilize-o para obter o registo específico a que a página diz respeito, por exemplo num nó [HTTP](./http-node.md):

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` é o próprio valor da linha clicada, como `V-1002`, e não um objeto com campos. Para encontrar esse registo numa [DataTable](./datatable-node.md), filtre a respetiva coluna de registo pelo valor: operação `find` com o filtro `{"vendor_id": "$page.record"}`. Um caminho como `$page.record.id` não devolve nada, pelo que um widget criado ou ajustado pela IA descarta esses campos e lê `$page.record`.

O valor provém de um URL que qualquer pessoa pode editar. O painel apenas aceita valores no formato de registo configurado (letras, dígitos, `-`, `_` e `.` por predefinição), mas trate-o ainda assim como uma entrada não fidedigna: passe-o onde o nó faz escape de valores, como num parâmetro de consulta HTTP ou num valor de filtro de [DataTable](./datatable-node.md) ou ClickHouse, e nunca construa texto de consulta concatenando strings com ele. Os widgets continuam a ser executados como o proprietário do painel, independentemente de quem abre a página.

## Como os dados são resolvidos

1. Se `dataPath` estiver definido, o nó segue esse caminho com pontos na saída upstream.
2. Caso contrário, ele procura um array: uma lista de nível superior, um array `data` ou o primeiro campo com valor de lista.
3. As linhas provenientes diretamente de um nó [Data Table](./datatable-node.md) (`{id, data, created_at}`) são lidas com as respetivas colunas no nível superior ao lado de `id`, pelo que `labelField`, `valueField` e `columns` indicam as próprias colunas da tabela.
4. Para `table`, cada linha se torna uma linha de tabela usando `columns` (ou as chaves da primeira linha). Com `statusColumn`, o Payload transporta também o tom de cada valor nessa coluna.
5. Para `numeric` e `gauge`, o valor vem de `valueField` na primeira linha (ou do primeiro campo numérico).
6. Para `scatter`, cada linha se torna um ponto `[xField, yField]`.
7. Para `text`, a mensagem é obtida de `valueField` na primeira linha quando definido; caso contrário, da configuração estática `text` (ou, ainda, do primeiro campo de string da primeira linha).
## Exemplo

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge (valor único vs. um intervalo):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter (pontos X/Y):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proportion (uma barra dividida por proporção + legenda percentual):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Area (tendência preenchida com múltiplas séries):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge (gauge com gradiente por linha e valores):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text (uma mensagem markdown estática — não requer linhas de entrada):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text (dinâmico — a string da mensagem é produzida a montante e obtida via `valueField`):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```

## Exemplos de prompts de IA

Ao gerar um widget com **IA**, prompts como estes mapeiam diretamente para cada tipo:

- **Bar** — "Show monthly revenue for the last 6 months as a vertical bar chart with example data."
- **Line** — "Plot daily active users over the last 14 days as a line chart."
- **Area** — "Show memory and CPU usage over the last 24 hours as an area chart with two series. Use example data."
- **Pie** — "Break down execution status (success, error, cancelled) as a pie chart."
- **Table** — "Show the top 10 workflows by execution count as a scrollable table with name and runs columns. Use example data."
- **Numeric** — "Show today's total workflow executions as a single KPI with unit 'runs'. Use example data."
- **Gauge** — "Show current CPU usage as a gauge from 0 to 100 percent."
- **Scatter** — "Plot request latency versus payload size as a scatter chart with example data."
- **Proportion** — "Show my most used languages as a proportion bar: Kotlin 49.64%, JavaScript 23.73%, TypeScript 11.64%, Java 8.92%, Python 6.06%. Use example data."
- **Bar gauge** — "Show free disk space per volume (sda1 to sda7) as a bar gauge in GB. Use example data."
- **Text** — "Add a text widget with a markdown checklist (one checked item, two unchecked), or list the 5 newest tutorial videos in descending order (5. down to 1.) with YouTube links — prefix each line with an explicit number (`5. Title`, `4. Title`, …)."

## Relacionado

- [Guia Dashboard](../tabs/dashboard-tab.md) — crie e organize widgets
- [Nó Output](output-node.md) — nó terminal para Workflows regulares


## Botões de ligação

Uma `table` pode transformar uma coluna em botões que abrem uma ligação. Defina **Link column** nas propriedades do nó (ou `linkColumn` no DSL) para uma coluna cujas células contenham um URL e, opcionalmente, **Link button text** (`linkLabel`). Cada célula torna-se um botão que abre o respetivo URL num novo separador. Sem texto do botão, este mostra apenas um ícone de ligação:

| Valor da célula | Abre |
| --------------- | ---- |
| `https://jira.example.com/browse/T-1` | Outro site, num novo separador |
| `/dashboards` | Uma página dentro do Heym, num novo separador |

Apenas os endereços `http://` e `https://` e os caminhos que começam por uma única `/` se tornam botões. Qualquer outro valor, como `javascript:` ou `//host`, permanece texto simples, e uma célula vazia não mostra nada.

O botão funciona junto de uma [ligação de linha](../tabs/dashboard-tab.md#detail-pages): clicar no botão abre a respetiva ligação num novo separador, e clicar em qualquer outro ponto da linha continua a abrir a página de detalhe.
