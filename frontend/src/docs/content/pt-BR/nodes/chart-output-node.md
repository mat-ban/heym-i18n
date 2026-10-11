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

Quando você tiver apenas dados de exemplo/amostra (sem fonte real), produza essas linhas com um nó **Set** usando `$array(dict(...), dict(...))` — por exemplo `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. **Não** use `${...}` nem literais de objeto `{...}` puros; o Heym constrói objetos apenas com `dict(key=value)`.

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` ou `hitl` |
| `orientation` | string | `vertical` ou `horizontal` (apenas para gráficos de barra) |
| `dataPath` | string | Caminho com pontos até o array de linhas dentro da saída anterior (ex.: `data` ou `result.items`). Deixe vazio para detecção automática. |
| `labelField` | string | Chave da linha usada como rótulo de categoria (pie/bar/line) |
| `valueField` | string | Chave da linha usada como valor numérico (pie/bar/line/numeric/gauge) |
| `series` | array | Definição opcional de múltiplas séries `[{ "name": "Sent", "field": "sent" }]` para bar/line (substitui `valueField`) |
| `columns` | array | Lista opcional de colunas para `table` (o padrão são as chaves da primeira linha) |
| `xField` / `yField` | string | Chaves da linha para os eixos numéricos X e Y (scatter) |
| `min` / `max` | number | Intervalo numérico para `gauge` (padrão `0` / `100`) |
| `unit` | string | Unidade opcional exibida ao lado de um valor `numeric` ou `gauge` |
| `text` | string | Mensagem em Markdown para o tipo de gráfico `text`. Deixe vazio e defina `valueField` para renderizar uma mensagem dinâmica obtida dos dados anteriores. |
| `title` | string | Título opcional do gráfico |

## Tipos de gráfico

- **bar / line / area / pie** — gráficos categóricos controlados por `labelField` + `valueField` (ou `series` para bar/line/area com múltiplas séries). `area` é um gráfico de tendência preenchido.
- **table** — linhas brutas renderizadas como uma tabela rolável usando `columns`.
- **numeric** — um único valor de KPI da primeira linha, com uma `unit` opcional.
- **gauge** — um único valor exibido em um intervalo `min`–`max` (por exemplo, uma porcentagem). Usa `valueField`.
- **scatter** — pontos X/Y de `xField` e `yField` para gráficos de correlação.
- **proportion** — uma única barra horizontal dividida em frações com uma legenda de porcentagem (por exemplo, uma distribuição de idiomas). Usa `labelField` + `valueField`.
- **barGauge** — um medidor horizontal por linha com um gradiente de vermelho→verde e um valor (por exemplo, espaço livre em disco). Usa `labelField` + `valueField`, `unit` opcional e `max` (o padrão é o maior valor de linha).
- **text** — uma mensagem em markdown (por exemplo, uma nota de status como "Última execução às 19:47"). Coloque o markdown em `text` para uma mensagem estática, ou deixe `text` vazio e defina `valueField` para renderizar uma string produzida anteriormente. Suporta títulos, negrito/itálico, [listas](../nodes/chart-output-node.md#interactive-task-lists), links e código embutido.
- **hitl** — um carrossel das suas revisões humanas pendentes. O cabeçalho mostra `1/n pending`; a seta esquerda fica desabilitada no primeiro cartão e a seta direita no último. O nome do workflow abre essa execução no canvas. **Approve**, **Request changes** e **Reject** a resolvem, e o ícone de histórico ao lado do título do widget abre essa execução no diálogo de histórico na mesma página. Este tipo de gráfico ignora as linhas anteriores, portanto o workflow do widget é apenas o nó Saída de Gráfico. Cada pessoa autenticada vê as revisões nos workflows que possui.

### Listas de tarefas interativas

Use a sintaxe de lista de tarefas do markdown do GitHub no campo estático `text`:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

No [Dashboard](../tabs/dashboard-tab.md), as caixas de seleção são renderizadas como controles clicáveis (compatíveis com modo escuro e claro). Alternar uma caixa de seleção atualiza o campo `text` do workflow do widget e persiste entre atualizações.

**Edição embutida:** clique duas vezes no rótulo de um item de tarefa para editá-lo no local. Pressione Enter ou clique fora para salvar; pressione Escape para cancelar. Limpe o rótulo completamente para remover esse item da lista.

**Links em itens de tarefa:** quando um rótulo contém um link markdown (`[title](url)`), clicar no link abre a URL sem alternar a caixa de seleção. Clique em outro lugar da linha para alternar.

**Apenas texto estático:** a interatividade exige a sintaxe de lista de tarefas GFM (`- [ ]` / `- [x]`). Mensagens de status dinâmicas simples, sem itens de tarefa, permanecem somente leitura. Quando o markdown vem de `valueField`, a primeira alternância o copia para o campo estático `text` para que as alterações persistam.
### Listas numeradas

Os widgets de texto renderizam markdown com **números de linha explícitos preservados**. Prefixe cada linha com o número que deseja exibir (por exemplo, `9.`, `8.`, `7.`). O Heym não renumera as linhas para você.

**Por que usar números explícitos?** Listas ordenadas padrão do markdown (`1.`, `2.`, `3.`) tornam-se listas HTML `<ol>`, que só contam **para cima** a partir do primeiro número. Uma lista escrita como `9.` / `8.` / `7.` seria exibida como `9`, `10`, `11` em um renderizador markdown comum. Prefixar cada linha com o número desejado evita esse problema.

**Listas decrescentes (por exemplo, mais recentes primeiro):** construa o markdown em um loop de workflow e calcule o número de exibição por item:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Padrão típico:

1. Busque ou construa um array de itens (por exemplo, HTTP → `body.videos`).
2. Faça um [Loop](./loop-node.md) sobre o array; dentro do corpo, use uma [Variable](./variable-node.md) com `.add()` para acrescentar uma linha numerada por iteração.
3. Após o branch **done** do loop, use [Set](./set-node.md) com `join("\n")` sobre o array acumulado (ou equivalente) em uma única string markdown.
4. Aponte o `valueField` do **Chart Output** para essa string (ou defina o `text` estático).

Exemplo de expressão de linha dentro do loop (label `processVideos`, itens com `title` e `id`):

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

1. Se `dataPath` estiver definido, o nó segue esse caminho com pontos até a saída upstream.
2. Caso contrário, ele procura por um array: uma lista de nível superior, um array `data` ou o primeiro campo com valor de lista.
3. Para `table`, cada linha torna-se uma linha da tabela usando `columns` (ou as chaves da primeira linha).
4. Para `numeric` e `gauge`, o valor vem de `valueField` na primeira linha (ou do primeiro campo numérico).
5. Para `scatter`, cada linha torna-se um ponto `[xField, yField]`.
6. Para `text`, a mensagem é obtida de `valueField` na primeira linha quando definido; caso contrário, da configuração estática `text` (ou, ainda, do primeiro campo string da primeira linha).

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

Gauge (valor único versus um intervalo):

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

Proporção (uma barra dividida por participação + legenda percentual):

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

Área (tendência preenchida com múltiplas séries):

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

Texto (uma mensagem markdown estática — não requer linhas upstream):

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

Texto (dinâmico — a string da mensagem é produzida upstream e obtida via `valueField`):

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

Ao gerar um widget com **IA**, prompts como estes se mapeiam de forma clara para cada tipo:

- **Bar** — "Mostre a receita mensal dos últimos 6 meses como um gráfico de barras verticais com dados de exemplo."
- **Line** — "Plote os usuários ativos diários dos últimos 14 dias como um gráfico de linhas."
- **Area** — "Mostre o uso de memória e CPU nas últimas 24 horas como um gráfico de área com duas séries. Use dados de exemplo."
- **Pie** — "Detalhe o status de execução (success, error, cancelled) como um gráfico de pizza."
- **Table** — "Mostre os 10 principais workflows por contagem de execuções como uma tabela rolável com as colunas name e runs. Use dados de exemplo."
- **Numeric** — "Mostre o total de execuções de workflows de hoje como um único KPI com unidade 'runs'. Use dados de exemplo."
- **Gauge** — "Mostre o uso atual de CPU como um gauge de 0 a 100 por cento."
- **Scatter** — "Plote a latência de requisição versus o tamanho do payload como um gráfico de dispersão com dados de exemplo."
- **Proportion** — "Mostre minhas linguagens mais usadas como uma barra de proporção: Kotlin 49,64%, JavaScript 23,73%, TypeScript 11,64%, Java 8,92%, Python 6,06%. Use dados de exemplo."
- **Bar gauge** — "Mostre o espaço livre em disco por volume (sda1 a sda7) como um bar gauge em GB. Use dados de exemplo."
- **Text** — "Adicione um widget de texto com uma checklist em markdown (um item marcado, dois desmarcados), ou liste os 5 vídeos de tutorial mais recentes em ordem decrescente (5. até 1.) com links do YouTube — prefixe cada linha com um número explícito (`5. Title`, `4. Title`, …)."

## Relacionados

- [Dashboard tab](../tabs/dashboard-tab.md) — crie e organize widgets
- [Output node](output-node.md) — nó terminal para workflows regulares
