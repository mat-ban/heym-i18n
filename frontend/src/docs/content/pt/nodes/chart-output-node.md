# Saída de Gráfico

O nó **Saída de Gráfico** é o nó terminal de um workflow de [widget de dashboard](../tabs/dashboard-tab.md). Ele recebe as linhas produzidas pelos nós anteriores e as transforma em um payload de gráfico padronizado que o dashboard renderiza.

## Visão geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 0 (terminal) |
| Saída | Payload de gráfico padronizado |

Posicione este nó **por último** em um workflow de widget de dashboard. O nó anterior a ele deve produzir um array de objetos de linha, por exemplo:

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
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` ou `hitl` |
| `orientation` | string | `vertical` ou `horizontal` (apenas para gráficos de barras) |
| `dataPath` | string | Caminho com pontos até o array de linhas dentro da saída anterior (ex.: `data` ou `result.items`). Deixe vazio para detecção automática. |
| `labelField` | string | Chave da linha usada como rótulo de categoria (pie/bar/line) |
| `valueField` | string | Chave da linha usada como valor numérico (pie/bar/line/numeric/gauge) |
| `series` | array | Definição opcional de múltiplas séries `[{ "name": "Sent", "field": "sent" }]` para bar/line (substitui `valueField`) |
| `columns` | array | Lista opcional de colunas para `table` (o padrão são as chaves da primeira linha) |
| `xField` / `yField` | string | Chaves das linhas para os eixos numéricos X e Y (scatter) |
| `min` / `max` | number | Intervalo numérico para `gauge` (padrão `0` / `100`) |
| `unit` | string | Unidade opcional exibida ao lado de um valor `numeric` ou `gauge` |
| `text` | string | Mensagem em Markdown para o tipo de gráfico `text`. Deixe vazio e defina `valueField` para renderizar uma mensagem dinâmica obtida dos dados anteriores. |
| `title` | string | Título opcional do gráfico |

## Tipos de gráfico

- **bar / line / area / pie** — gráficos categóricos controlados por `labelField` + `valueField` (ou `series` para bar/line/area com múltiplas séries). `area` é um gráfico de tendência preenchido.
- **table** — linhas brutas renderizadas como uma tabela rolável usando `columns`.
- **numeric** — um único valor de KPI da primeira linha, com uma `unit` opcional.
- **gauge** — um único valor exibido em um intervalo `min`–`max` (por exemplo, uma porcentagem). Usa `valueField`.
- **scatter** — pontos X/Y a partir de `xField` e `yField` para gráficos de correlação.
- **proportion** — uma única barra horizontal dividida em frações com uma legenda percentual (por exemplo, uma distribuição de idiomas). Usa `labelField` + `valueField`.
- **barGauge** — um medidor horizontal por linha com um gradiente de vermelho→verde e um valor (por exemplo, espaço livre em disco). Usa `labelField` + `valueField`, com `unit` e `max` opcionais (o padrão é o maior valor de linha).
- **text** — uma mensagem em markdown (por exemplo, uma nota de status como "Última execução às 19:47"). Coloque o markdown em `text` para uma mensagem estática, ou deixe `text` vazio e defina `valueField` para renderizar uma string produzida anteriormente. Suporta títulos, negrito/itálico, [listas](../nodes/chart-output-node.md#interactive-task-lists), links e código embutido.
- **hitl** — um carrossel das suas revisões humanas pendentes. O cabeçalho exibe `1/n pending`; a seta esquerda fica desabilitada no primeiro cartão e a seta direita no último. O nome do workflow abre essa execução no canvas. **Approve**, **Request changes** e **Reject** a resolvem, e o ícone de histórico ao lado do título do widget abre essa execução no diálogo de histórico na mesma página. Este tipo de gráfico ignora as linhas anteriores, portanto o workflow do widget é apenas o nó Saída de Gráfico. Cada pessoa autenticada vê as revisões nos workflows que possui.
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

## Como os dados são resolvidos

1. Se `dataPath` estiver definido, o nó segue esse caminho com pontos na saída upstream.
2. Caso contrário, ele procura um array: uma lista de nível superior, um array `data` ou o primeiro campo com valor de lista.
3. Para `table`, cada linha se torna uma linha de tabela usando `columns` (ou as chaves da primeira linha).
4. Para `numeric` e `gauge`, o valor vem de `valueField` na primeira linha (ou do primeiro campo numérico).
5. Para `scatter`, cada linha se torna um ponto `[xField, yField]`.
6. Para `text`, a mensagem é obtida de `valueField` na primeira linha quando definido; caso contrário, da configuração estática `text` (ou, ainda, do primeiro campo de string da primeira linha).
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
