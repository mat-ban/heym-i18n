# Expression DSL

O Heym usa uma linguagem de expressão simples para referenciar dados de Nós upstream. Use expressões na configuração de Nós como `userMessage` do LLM, `condition` do Condition, `message` do Output, mapeamentos do Set e valores de Variable. Use o [Expression Evaluation Dialog](./expression-evaluation-dialog.md) para um editor maior, preview ao vivo com processamento no backend e seleção de caminhos de saída.

## Referências Básicas

### Nó Input vs Nós Nomeados

- **`$input`** – Use apenas quando houver um único Nó [Input](../nodes/input-node.md) upstream e você quiser referenciar sua saída. Exemplo: `$input.text`. É um atalho para "os dados da entrada conectada."
- **`$nodeLabel.field`** – Use para referenciar qualquer Nó upstream pelo seu **label** (o `label` nos dados do Nó). Prefira esta forma quando houver múltiplos Nós ou quando o AI Assistant / workflow DSL esperar labels explícitos. Exemplo: `$userInput.body.text`, `$myLLM.text`.

**Quando usar cada um:**

| Contexto | Prefira | Exemplo |
|--------|--------|---------|
| Nó de entrada único, fluxo simples | `$input.text` | Mensagem de saída de um único Input |
| Múltiplos Nós ou referências nomeadas | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [AI Assistant](./ai-assistant.md) / workflow JSON | Sempre `$nodeLabel.field` | O workflow builder espera labels, não `$input` |

### Nó Input

Use `$input` para referenciar os dados do Nó Input quando houver uma única entrada upstream:

```
$input.text
```

### Nós Nomeados

Referencie qualquer Nó upstream pelo seu label. Quando um Nó tem [dados fixados](./canvas-features.md#data-pin), o autocompletar de expressões usa esses dados em vez da saída da execução.

```
$llm.text
$httpResponse.body
$condition
```

### Credentials

Use `$credentials.CredentialName` para referenciar valores de credenciais (por exemplo, chaves de API, bearer tokens ou tokens de integração do Notion) pelo nome. Consulte [Credentials Sharing](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Nomes que não são identificadores simples (contêm `-`, começam com dígito ou são palavras reservadas) usam a forma com colchetes: `$credentials["my-api-key"]`.

### Global Variables

Use `$global.variableName` para referenciar [Global Variables](./global-variables.md) – dados persistentes de chave-valor no escopo do usuário, gerenciados na [aba Variables](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Campos Aninhados

Use notação de ponto para objetos aninhados:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literais

- **Strings**: `"hello"` ou `'hello'`
- **Números**: `42`, `3.14`
- **Booleanos**: `true`, `false`
- **Null**: `null`

## Preservação de Tipos

Quando o valor **inteiro** é um único `$expr`, o backend preserva o tipo nativo:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Quando uma expressão faz parte de uma string maior, o resultado final é sempre uma string:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

Nós [Sticky Note](../nodes/sticky-note-node.md) são documentação do canvas, não campos executáveis de expressão. Seu conteúdo `note` é renderizado como markdown, então use links e imagens markdown comuns em vez de expressões `$...`.

Sticky notes suportam um título de exibição personalizado e seis cores de fundo salvas:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

Os valores permitidos para `stickyColor` são `yellow`, `sky`, `emerald`, `rose`, `violet` e `zinc`.

## Aritmética

Operadores suportados: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Comparações

Use em Nós [Condition](../nodes/condition-node.md): `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Contexto de Loop

Dentro de um Nó [Loop](../nodes/loop-node.md), use `item` para referenciar o elemento atual do array:

```
item.name
item.value
```

## Variáveis Especiais
- `$now` - Data e hora atual com métodos de formatação
- `$Date()` - Criar/analisar data (ex.: `$Date("2024-01-15")`)
- `$UUID` - Gera identificador único de 32 caracteres (SEM parênteses; use `$UUID`, não `$UUID()`)
- `$workflowName` - Nome do workflow atual
- `$workflowDescription` - Descrição do workflow atual
- `$workflowPath` - Caminho relativo do workflow, ex.: `/workflows/<id>`
- `$workflowUrl` - URL absoluta do workflow, ex.: `https://<host>/workflows/<id>`
- `$executionId` - Id da execução atual (igual ao id da entrada em [Execution History](./execution-history.md), então `/workflows/<id>/<executionId>` abre esta execução no canvas). **Somente em runtime**: vazio no diálogo de preview de expressões; preenchido apenas enquanto um workflow está em execução.
- `$vars` - Variáveis locais do workflow (acesse via `$vars.variableName`; atualizadas via Nó `variable`)
- `$global` - Armazenamento persistente de variáveis globais (acesse via `$global.variableName`)
- `$page.record` - Apenas para workflows de widgets do painel: o registro da página de detalhes em que o widget está, vindo do parâmetro `?record=` do painel. É nulo em um painel aberto sem esse parâmetro e no diálogo de pré-visualização de expressões. Um nó rotulado como `page` tem precedência. Veja [Páginas de detalhes](../tabs/dashboard-tab.md#detail-pages).

### Uso de $vars
- `$vars.counter` - Acessa uma variável chamada `counter`
- `$vars.myArray.add("item")` - Adiciona um item a uma variável do tipo array

### Uso de $global
- `$global.environment` - Acessa uma variável global chamada `environment`
- `$global.settings.baseUrl` - Acessa campos aninhados em uma variável global do tipo objeto
## Contexto de Requisição (Execução via API)
Quando um Workflow é executado via API HTTP, os Nós de entrada recebem metadados adicionais da requisição:
- `$textInputLabel.body` - Objeto do corpo da requisição HTTP (Payload JSON bruto)
- `$textInputLabel.headers` - Objeto dos cabeçalhos da requisição HTTP (todas as chaves de cabeçalho são minúsculas)
- `$textInputLabel.query` - Objeto dos parâmetros de consulta da URL

Acesse os dados da requisição assim:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Funções de Conversão de Tipo
- `str(value)` - Converte para string
- `int(value)` - Converte para inteiro
- `float(value)` - Converte para float
- `bool(value)` - Converte para booleano
- `list(value)` - Converte para lista
- `dict(key=value, ...)` - Cria dicionário com argumentos nomeados (ex.: `$dict(name="Ali", age=30)`)

## Funções Matemáticas
- `len(value)` - Obtém o comprimento
- `abs(value)` - Valor absoluto
- `min(a, b)` - Valor mínimo
- `max(a, b)` - Valor máximo
- `round(value)` - Arredonda o número
- `sum(list)` - Soma da lista
- `sorted(list)` - Ordena a lista
- `randomInt(min, max)` - Inteiro aleatório

## Funções de Array
- `$array(a, b, c)` - Cria um array a partir dos argumentos (ex.: `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Cria um intervalo de inteiros de `a` até `b` com `b` excluído (ex.: `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Falha quando `a > b`
- `notNull(list)` - Remove valores nulos do array

## Função de Construção de String (para expressões map/filter)
- `concat(a, b, c, ...)` - Concatena N argumentos
  - Use dentro de `.map()` como uma string de expressão (sem `$` dentro da string)
  - Use aspas simples dentro da string do concat:
    - Correto: `concat('prefix', 'item.field', 'suffix')`

## Objetos Literais / Dicionários
Crie objetos/dicionários usando a sintaxe de chaves com quaisquer chaves de string:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Chaves Dinâmicas
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Regras de Objetos Literais
- As chaves podem ser qualquer string (incluindo espaços/caracteres especiais)
- As chaves DEVEM estar entre aspas duplas (ex.: `"key"`)
- Os valores podem ser strings/números/booleanos/expressões/objetos aninhados

## Funções de String
- `upper(text)` - Maiúsculas
- `lower(text)` - Minúsculas
- `strip(text)` - Remove espaços em branco
- `capitalize(text)` - Capitaliza a primeira letra
- `title(text)` - Formato de título
- `split(text, separator)` - Divide a string
- `join(separator, list)` - Junta a lista
- `replace(text, old, new)` - Substitui texto
- `regexReplace(text, pattern, replacement)` - Substitui com padrão regex
- `base64Encode(text)` - Codifica texto UTF-8 como Base64 padrão
- `base64Decode(text)` - Decodifica Base64 padrão em texto UTF-8
- `toJson(text)` - Analisa uma string JSON em um objeto, array ou valor

## Métodos de String (em valores de string)
- `.orEmpty()` - Retorna o valor da string, ou `""` quando o valor é nulo/ausente
- `.upper()` / `.lower()` - Conversão de maiúsculas/minúsculas
- `.strip()` - Remove espaços em branco
- `.capitalize()` / `.title()` - Capitaliza
- `.length` - Comprimento da string
- `.toString()` - Converte para string
- `.substring(start, end)` - Extrai substring
- `.contains(text)` - Verifica se contém a substring
- `.startswith(prefix)` / `.endswith(suffix)` - Verifica prefixo/sufixo
- `.indexOf(text)` - Encontra a posição (retorna -1 se não encontrado)
- `.replace(old, new)` - Substitui a primeira ocorrência
- `.replaceAll(old, new)` - Substitui todas as ocorrências
- `.regexReplace(pattern, replacement)` - Substitui com padrão regex
- `.hash()` - Hash MD5 da string
- `.base64Encode()` - Codifica texto UTF-8 como Base64 padrão
- `.base64Decode()` - Decodifica Base64 padrão em texto UTF-8
- `.urlEncode()` - Codifica a string para URL
- `.urlDecode()` - Decodifica a string de URL
- `.escape()` - Escapa a string para JSON (converte caracteres especiais para o formato JSON)
- `.unescape()` - Desescapa a string JSON (converte o formato JSON para a string original)
- `.toJson()` - Analisa uma string JSON em um objeto, array ou valor

### Exemplos de Métodos de String
- `$profile.nickname.orEmpty()` - Converte texto nulo/ausente em uma string vazia
- `$text.upper()` - Converte para maiúsculas
- `$text.lower()` - Converte para minúsculas
- `$text.strip()` - Remove espaços em branco
- `$text.replace("old", "new")` - Substitui texto
- `$text.replaceAll("a", "b")` - Substitui todas as ocorrências
- `$text.length` - Obtém o comprimento da string
- `$text.escape()` - Escapa caracteres especiais de JSON (ex.: aspas, quebras de linha)
- `$escapedText.unescape()` - Desescapa a string formatada em JSON de volta ao original
- `$text.toJson()` - Analisa uma string de objeto/array JSON (depois `$text.toJson().repoUrl`)
- `$toJson($text)` - Mesma análise como função
- `$base64Encode("Héym 🌍")` - Retorna `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Decodifica Base64 em texto UTF-8
- `$text.urlEncode()` - Codifica para URL para parâmetros de API
- `$encodedText.urlDecode()` - Decodifica texto codificado para URL
## Métodos de Array (em arrays)
- `.first()` - Obtém o primeiro elemento
- `.last()` - Obtém o último elemento
- `.random()` - Obtém um elemento aleatório
- `.reverse()` - Inverte o array
- `.flat()` - Achata arrays aninhados em um único array
- `.flat(depth)` - Achata com limite de profundidade
- `.distinct()` - Remove duplicatas
- `.distinctBy(expr)` - Remove duplicatas por expressão (ex.: `$array.distinctBy("item.id")`)
- `.notNull()` - Remove valores nulos
- `.add(item)` - Adiciona item (retorna um novo array)
- `.contains(item)` - Verifica se o array contém o item (retorna boolean)
- `.join(separator)` - Junta os elementos do array em uma string
- `.filter(expr)` - Filtra o array usando a variável `item` (ex.: `$array.filter("item > 5")`)
- `.map(expr)` - Transforma cada elemento usando a variável `item` (ex.: `$array.map("item.name")`)
- `.sort(expr, order)` - Ordena por expressão, order é `"asc"` (padrão) ou `"desc"`
- `.take(n)` - Pega os primeiros N (positivo) ou os últimos N (negativo) elementos
- `.length` - Comprimento do array
- `.toString()` - Converte para string JSON

### Exemplos de Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Métodos de Object/Dictionary (em objetos)
- `.get(key)` - Obtém o valor pela chave (retorna null se não encontrado)
- `.get(key, default)` - Obtém o valor pela chave com fallback padrão
- `.keys()` - Retorna uma lista de todas as chaves
- `.values()` - Retorna uma lista de todos os valores
- `.entries()` - Retorna uma lista de objetos `{key, value}` (um por propriedade)
- `.filter(expr)` - Itera as entradas `{key, value}` e retorna as entradas correspondentes como uma lista (use `item.key` / `item.value` dentro de `expr`)
- `.map(expr)` - Itera as entradas `{key, value}` e retorna uma lista de valores transformados (use `item.key` / `item.value` dentro de `expr`)
- `.toString()` - Converte para string JSON

### Exemplos de Iteração de Objetos
Ao iterar um objeto com `.map()` ou `.filter()`, cada `item` é um par `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → lista de nomes de propriedades que não são nulas

## Data/Hora
- `$now` - Data/hora atual
- `$now.format("YYYY-MM-DD")` - Formata data/hora
- `$now.toISO()` / `.toDate()` / `.toTime()` - Converte formatos
- `$now.addDays(n)` / `.addHours(n)` - Aritmética de datas
- `$Date("2024-01-15")` - Faz o parse de uma string de data

## Operações Numéricas
- Matemática básica: `+`, `-`, `*`, `/`, `%`
- Comparações: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Operadores booleanos: `and`, `or`, `not`

## Condições Booleanas
Para booleanos, escreva a expressão diretamente (não force `== true`):
- Errado: `$nodeName.isValid == true`
- Correto: `$nodeName.isValid`
- Negação: `not $nodeName.isValid`

## Regras e Whitelist (Crítico)
### Regras de Posicionamento do `$`
- Uma expressão isolada geralmente começa com um `$` inicial.
- Template strings podem conter múltiplos `$refs`.
- Parâmetros de métodos também podem conter `$refs` aninhados quando você deseja passar o resultado de outra expressão (chave dinâmica ou resolução aninhada).
  - Válido: `$node.method(other.field)` — `other` é resolvido a partir do contexto como um label de nível superior (sem `$` dentro do argumento).
  - Válido: `$node.method($other.field)` — `$` aninhado é suportado no preview do diálogo de avaliação e na avaliação de condições.
  - Válido: `$array($a.x, $b.y)`
  - O autocomplete dentro de `.get(` insere caminhos **bare** `label.field` (sem `$` inicial), assim como dentro de `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Se o valor submetido inteiro for um único dot path **sem** um `$` inicial (por exemplo, texto selecionado no editor, como `execute.outputs.output.result.today`), o backend o trata da mesma forma que `$execute.outputs.output.result.today`. Valores que contêm uma quebra de linha ou retorno de carro após o trim não são reescritos (evita payloads multilinha ambíguos). Prefira escrever `$` nos campos salvos do Workflow; a reescrita serve principalmente para inspeção e ferramentas.
- O resultado do `Run` no diálogo de avaliação é a fonte da verdade para como uma expressão concreta é resolvida.

### Aspas em Strings de Arrays
Ao criar arrays com valores de string, SEMPRE use aspas duplas:
- Correto: `$array("hello", "world")`
- Errado: `$array('hello', 'world')`

### USE SOMENTE ESTAS FUNÇÕES (Whitelist)
Use SOMENTE:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- métodos documentados de string/array/object

Se uma função não estiver listada acima, ela não existe.

### Limites de Métodos de Arrays / Dicts
- Arrays podem usar SOMENTE: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objects/Dicts podem usar SOMENTE: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`
### Nomes de Rótulo de Nó Reservados
Não use estes nomes como rótulos de nó: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Exemplos

**Condição**: `$input.text.length > 0`

**Mensagem do usuário do LLM**: `$input.text`

**Mensagem de saída**: `$llm.text`

**Valor da variável**: `$input.count + 1`

### Exemplo de DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Relacionados

- [Diálogo de Avaliação de Expressão](./expression-evaluation-dialog.md) – Editor expansível com pré-visualização ao vivo do backend e autocomplete
- [Recursos do Canvas](./canvas-features.md) – Pino de dados para testar expressões sem reexecutar nós
- [Tipos de Nó](./node-types.md) – Nós que usam expressões ([LLM](../nodes/llm-node.md), [Condição](../nodes/condition-node.md), [Saída](../nodes/output-node.md), [Definir](../nodes/set-node.md), etc.)
- [Nota Adesiva](../nodes/sticky-note-node.md) – Notas markdown no canvas com título editável, cor e exibição de imagem
- [Nó Agente](../nodes/agent-node.md) – Usando expressões em prompts de agente
- [Memória Persistente do Agente](./agent-persistent-memory.md) – `persistentMemoryEnabled` e `memoryShares` no `data` do agente (não campos de expressão)
- [Estrutura do Workflow](./workflow-structure.md) – Campos `data` do nó que aceitam expressões
- [Aba de Credenciais](../tabs/credentials-tab.md) – Credenciais referenciadas por nós
- [Compartilhamento de Credenciais](./credentials-sharing.md) – Compartilhe credenciais e use `$credentials` em expressões
- [Variáveis Globais](./global-variables.md) – Variáveis persistentes com `$global`
