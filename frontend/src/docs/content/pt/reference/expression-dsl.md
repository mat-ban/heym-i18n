# Expression DSL

O Heym utiliza uma linguagem de expressão simples para referenciar dados de nós a montante. Utilize expressões na configuração de nós, tais como `userMessage` do LLM, `condition` do Condition, `message` do Output, mapeamentos do Set e valores de Variáveis. Utilize o [Diálogo de Avaliação de Expressões](./expression-evaluation-dialog.md) para um editor maior, pré-visualização em tempo real com suporte do backend e seleção de caminhos de saída.

## Referências Básicas

### Nó de Input vs Nós com Nome

- **`$input`** – Utilize apenas quando existe um único nó [Input](../nodes/input-node.md) a montante e pretende referenciar a sua saída. Exemplo: `$input.text`. Esta é uma forma abreviada de "os dados do input ligado."
- **`$nodeLabel.field`** – Utilize para referenciar qualquer nó a montante pelo seu **label** (o `label` nos dados do nó). Prefira esta forma quando tem múltiplos nós ou quando o Assistente de IA / workflow DSL espera labels explícitos. Exemplo: `$userInput.body.text`, `$myLLM.text`.

**Quando utilizar cada uma:**

| Contexto | Preferir | Exemplo |
|--------|--------|---------|
| Nó de input único, fluxo simples | `$input.text` | Mensagem de Output de um único Input |
| Múltiplos nós ou referências com nome | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [Assistente de IA](./ai-assistant.md) / workflow JSON | Sempre `$nodeLabel.field` | O construtor de workflows espera labels, não `$input` |

### Nó de Input

Utilize `$input` para referenciar os dados do nó Input quando existe um único input a montante:

```
$input.text
```

### Nós com Nome

Referencie qualquer nó a montante pelo seu label. Quando um nó tem [dados fixados](./canvas-features.md#data-pin), o preenchimento automático de expressões utiliza esses dados em vez da saída da execução.

```
$llm.text
$httpResponse.body
$condition
```

### Credenciais

Utilize `$credentials.CredentialName` para referenciar valores de credenciais (por exemplo, chaves de API, bearer tokens ou tokens de integração do Notion) por nome. Consulte [Partilha de Credenciais](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Nomes que não são identificadores simples (contêm `-`, começam com um dígito ou são palavras reservadas) utilizam a forma com parênteses retos: `$credentials["my-api-key"]`.

### Variáveis Globais

Utilize `$global.variableName` para referenciar [Variáveis Globais](./global-variables.md) – dados persistentes de chave-valor com âmbito de utilizador, geridos no [separador Variáveis](../tabs/global-variables-tab.md).

```
$global.environment
$global.settings.baseUrl
```

### Campos Aninhados

Utilize notação de ponto para objetos aninhados:

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

Quando o valor **completo** é uma única `$expr`, o backend preserva o tipo nativo:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Quando uma expressão faz parte de uma string maior, o resultado final é sempre uma string:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Notas Adesivas

Os nós [Nota Adesiva](../nodes/sticky-note-node.md) são documentação do canvas, não campos de expressão executáveis. O seu conteúdo `note` é renderizado como markdown, pelo que deve utilizar ligações e imagens markdown normais em vez de expressões `$...`.

As notas adesivas suportam um título de apresentação personalizado e seis cores de fundo guardadas:

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

Utilize em nós [Condition](../nodes/condition-node.md): `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Contexto de Loop

Dentro de um nó [Loop](../nodes/loop-node.md), utilize `item` para referenciar o elemento atual do array:

```
item.name
item.value
```

## Variáveis Especiais
- `$now` - Data e hora atual com métodos de formatação
- `$Date()` - Criar/analisar data (por exemplo, `$Date("2024-01-15")`)
- `$UUID` - Gerar identificador único de 32 caracteres (SEM parênteses; utilize `$UUID` e não `$UUID()`)
- `$workflowName` - Nome do workflow atual
- `$workflowDescription` - Descrição do workflow atual
- `$workflowPath` - Caminho relativo do workflow, por exemplo, `/workflows/<id>`
- `$workflowUrl` - URL absoluto do workflow, por exemplo, `https://<host>/workflows/<id>`
- `$executionId` - Id da execução atual (igual ao id da entrada do [Histórico de Execuções](./execution-history.md), pelo que `/workflows/<id>/<executionId>` abre esta execução no canvas). **Apenas em tempo de execução**: vazio no diálogo de pré-visualização de expressões; preenchido apenas enquanto um workflow está em execução.
- `$vars` - Variáveis locais do workflow (aceda através de `$vars.variableName`; atualizadas através do nó `variable`)
- `$global` - Armazenamento persistente de variáveis globais (aceda através de `$global.variableName`)

### Utilização de $vars
- `$vars.counter` - Aceder a uma variável com o nome `counter`
- `$vars.myArray.add("item")` - Adicionar um item a uma variável do tipo array

### Utilização de $global
- `$global.environment` - Aceder a uma variável global com o nome `environment`
- `$global.settings.baseUrl` - Aceder a campos aninhados numa variável global do tipo objeto

## Contexto do Pedido (Execução da API)
Quando um workflow é executado através da API HTTP, os nós de entrada recebem metadados adicionais do pedido:
- `$textInputLabel.body` - Objeto do corpo do pedido HTTP (payload JSON em bruto)
- `$textInputLabel.headers` - Objeto dos cabeçalhos do pedido HTTP (todas as chaves dos cabeçalhos em minúsculas)
- `$textInputLabel.query` - Objeto dos parâmetros de consulta do URL

Aceda aos dados do pedido da seguinte forma:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`

## Funções de Conversão de Tipos
- `str(value)` - Converter para string
- `int(value)` - Converter para inteiro
- `float(value)` - Converter para número decimal
- `bool(value)` - Converter para booleano
- `list(value)` - Converter para lista
- `dict(key=value, ...)` - Criar dicionário com argumentos nomeados (ex. `$dict(name="Ali", age=30)`)

## Funções Matemáticas
- `len(value)` - Obter o comprimento
- `abs(value)` - Valor absoluto
- `min(a, b)` - Valor mínimo
- `max(a, b)` - Valor máximo
- `round(value)` - Arredondar número
- `sum(list)` - Soma da lista
- `sorted(list)` - Ordenar lista
- `randomInt(min, max)` - Inteiro aleatório

## Funções de Array
- `$array(a, b, c)` - Criar array a partir dos argumentos (ex. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Criar intervalo de inteiros de `a` a `b` com `b` excluído (ex. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Falha quando `a > b`
- `notNull(list)` - Remover valores nulos do array

## Função de Construção de Strings (para expressões map/filter)
- `concat(a, b, c, ...)` - Concatenar N argumentos
  - Utilizar dentro de `.map()` como uma string de expressão (sem `$` dentro da string)
  - Utilizar aspas simples dentro da string concat:
    - Correto: `concat('prefix', 'item.field', 'suffix')`

## Literais de Objetos / Dicionários
Criar objetos/dicionários utilizando a sintaxe de chavetas com quaisquer chaves de string:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Chaves Dinâmicas
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Regras dos Literais de Objetos
- As chaves podem ser qualquer string (incluindo espaços/caracteres especiais)
- As chaves TÊM de ser delimitadas por aspas duplas (ex. `"key"`)
- Os valores podem ser strings/números/booleanos/expressões/objetos aninhados

## Funções de String
- `upper(text)` - Maiúsculas
- `lower(text)` - Minúsculas
- `strip(text)` - Remover espaços em branco
- `capitalize(text)` - Capitalizar a primeira letra
- `title(text)` - Formato de título
- `split(text, separator)` - Dividir string
- `join(separator, list)` - Juntar lista
- `replace(text, old, new)` - Substituir texto
- `regexReplace(text, pattern, replacement)` - Substituir com padrão regex
- `base64Encode(text)` - Codificar texto UTF-8 como Base64 padrão
- `base64Decode(text)` - Descodificar Base64 padrão para texto UTF-8
- `toJson(text)` - Analisar uma string JSON para um objeto, array ou valor

## Métodos de String (em valores de string)
- `.orEmpty()` - Devolver o valor da string, ou `""` quando o valor é nulo/inexistente
- `.upper()` / `.lower()` - Conversão de maiúsculas/minúsculas
- `.strip()` - Remover espaços em branco
- `.capitalize()` / `.title()` - Capitalizar
- `.length` - Comprimento da string
- `.toString()` - Converter para string
- `.substring(start, end)` - Extrair substring
- `.contains(text)` - Verificar se contém a substring
- `.startswith(prefix)` / `.endswith(suffix)` - Verificar prefixo/sufixo
- `.indexOf(text)` - Encontrar posição (devolve -1 se não encontrado)
- `.replace(old, new)` - Substituir a primeira ocorrência
- `.replaceAll(old, new)` - Substituir todas as ocorrências
- `.regexReplace(pattern, replacement)` - Substituir com padrão regex
- `.hash()` - Hash MD5 da string
- `.base64Encode()` - Codificar texto UTF-8 como Base64 padrão
- `.base64Decode()` - Descodificar Base64 padrão para texto UTF-8
- `.urlEncode()` - Codificar string para URL
- `.urlDecode()` - Descodificar string de URL
- `.escape()` - Escapar string JSON (converter caracteres especiais para formato JSON)
- `.unescape()` - Desescapar string JSON (converter formato JSON para a string original)
- `.toJson()` - Analisar uma string JSON para um objeto, array ou valor

### Exemplos de Métodos de String
- `$profile.nickname.orEmpty()` - Converter texto nulo/inexistente numa string vazia
- `$text.upper()` - Converter para maiúsculas
- `$text.lower()` - Converter para minúsculas
- `$text.strip()` - Remover espaços em branco
- `$text.replace("old", "new")` - Substituir texto
- `$text.replaceAll("a", "b")` - Substituir todas as ocorrências
- `$text.length` - Obter o comprimento da string
- `$text.escape()` - Escapar caracteres JSON especiais (ex. aspas, novas linhas)
- `$escapedText.unescape()` - Desescapar string formatada em JSON de volta ao original
- `$text.toJson()` - Analisar uma string de objeto/array JSON (depois `$text.toJson().repoUrl`)
- `$toJson($text)` - Mesma análise como função
- `$base64Encode("Héym 🌍")` - Devolve `SMOpeW0g8J+MjQ==`
- `$encodedText.base64Decode()` - Descodificar Base64 para texto UTF-8
- `$text.urlEncode()` - Codificar URL para parâmetros de API
- `$encodedText.urlDecode()` - Descodificar texto codificado em URL

## Métodos de Array (em arrays)
- `.first()` - Obter o primeiro elemento
- `.last()` - Obter o último elemento
- `.random()` - Obter um elemento aleatório
- `.reverse()` - Inverter o array
- `.flat()` - Achatar arrays aninhados num único array
- `.flat(depth)` - Achatar com limite de profundidade
- `.distinct()` - Remover duplicados
- `.distinctBy(expr)` - Remover duplicados por expressão (ex. `$array.distinctBy("item.id")`)
- `.notNull()` - Remover valores nulos
- `.add(item)` - Acrescentar item (devolve um novo array)
- `.contains(item)` - Verificar se o array contém o item (devolve um booleano)
- `.join(separator)` - Unir os elementos do array numa string
- `.filter(expr)` - Filtrar o array utilizando a variável `item` (ex. `$array.filter("item > 5")`)
- `.map(expr)` - Transformar cada elemento utilizando a variável `item` (ex. `$array.map("item.name")`)
- `.sort(expr, order)` - Ordenar por expressão; a ordem é `"asc"` (predefinida) ou `"desc"`
- `.take(n)` - Obter os primeiros N (positivo) ou os últimos N (negativo) elementos
- `.length` - Comprimento do array
- `.toString()` - Converter numa string JSON

### Exemplos de Filter / Map / Sort
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`

## Métodos de Objeto/Dicionário (em objetos)
- `.get(key)` - Obter o valor pela chave (devolve null se não for encontrado)
- `.get(key, default)` - Obter o valor pela chave com valor predefinido de recurso
- `.keys()` - Devolver uma lista com todas as chaves
- `.values()` - Devolver uma lista com todos os valores
- `.entries()` - Devolver uma lista de objetos `{key, value}` (um por propriedade)
- `.filter(expr)` - Iterar as entradas `{key, value}` e devolver as entradas correspondentes como uma lista (utilizar `item.key` / `item.value` dentro de `expr`)
- `.map(expr)` - Iterar as entradas `{key, value}` e devolver uma lista de valores transformados (utilizar `item.key` / `item.value` dentro de `expr`)
- `.toString()` - Converter numa string JSON

### Exemplos de Iteração de Objetos
Ao iterar um objeto com `.map()` ou `.filter()`, cada `item` é um par `{key, value}`:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → lista de nomes de propriedades que não são nulos

## Data/Hora
- `$now` - Data e hora atuais
- `$now.format("YYYY-MM-DD")` - Formatar data/hora
- `$now.toISO()` / `.toDate()` / `.toTime()` - Converter formatos
- `$now.addDays(n)` / `.addHours(n)` - Aritmética de datas
- `$Date("2024-01-15")` - Analisar uma string de data

## Operações Numéricas
- Matemática básica: `+`, `-`, `*`, `/`, `%`
- Comparações: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Operadores booleanos: `and`, `or`, `not`

## Condições Booleanas
Para booleanos, escreva a expressão diretamente (não force `== true`):
- Errado: `$nodeName.isValid == true`
- Correto: `$nodeName.isValid`
- Negação: `not $nodeName.isValid`

## Regras e Lista de Permitidos (Crítico)
### Regras de Colocação do `$`
- Uma expressão autónoma começa habitualmente com um `$` inicial.
- As template strings podem conter múltiplos `$refs`.
- Os parâmetros de métodos também podem conter `$refs` aninhados quando se pretende passar o resultado de outra expressão (chave dinâmica ou resolução aninhada).
  - Válido: `$node.method(other.field)` — `other` é resolvido a partir do contexto como uma etiqueta de nível superior (sem `$` dentro do argumento).
  - Válido: `$node.method($other.field)` — o `$` aninhado é suportado na pré-visualização do diálogo de avaliação e na avaliação de condições.
  - Válido: `$array($a.x, $b.y)`
  - O preenchimento automático dentro de `.get(` insere caminhos `label.field` **simples** (sem `$` inicial), tal como dentro de `$array(...)` / `$notNull(...)`.
- **API de Avaliação (Run):** Se o valor submetido na íntegra for um único caminho com pontos **sem** um `$` inicial (por exemplo, texto selecionado no editor, como `execute.outputs.output.result.today`), o backend trata-o da mesma forma que `$execute.outputs.output.result.today`. Os valores que contenham uma nova linha ou retorno de carro após a limpeza não são reescritos (evita payloads multilinha ambíguos). Prefira escrever `$` nos campos de workflow guardados; a reescrita destina-se principalmente à inspeção e às ferramentas.
- O resultado de `Run` no diálogo de Avaliação é a fonte de verdade para a forma como uma expressão concreta é resolvida.

### Aspas em Strings de Arrays
Ao criar arrays com valores de string, utilize SEMPRE aspas duplas:
- Correto: `$array("hello", "world")`
- Errado: `$array('hello', 'world')`

### UTILIZE APENAS ESTAS FUNÇÕES (Lista de Permitidos)
Utilize APENAS:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- métodos documentados de string/array/objeto

Se uma função não constar da lista acima, significa que não existe.

### Limites de Métodos de Arrays / Dicionários
- Os arrays podem utilizar APENAS: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Os objetos/dicionários podem utilizar APENAS: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`

### Nomes de Etiqueta de Nó Reservados
Não utilize estes nomes como etiquetas de nó: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Exemplos

**Condição**: `$input.text.length > 0`

**Mensagem do utilizador do LLM**: `$input.text`

**Mensagem de saída**: `$llm.text`

**Valor da variável**: `$input.count + 1`

### Exemplo de DSL

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```

## Relacionado

- [Diálogo de Avaliação de Expressões](./expression-evaluation-dialog.md) – Editor expansível com pré-visualização em tempo real do backend e preenchimento automático
- [Funcionalidades do Canvas](./canvas-features.md) – Pino de dados para testar expressões sem voltar a executar nós
- [Tipos de Nó](./node-types.md) – Nós que utilizam expressões ([LLM](../nodes/llm-node.md), [Condição](../nodes/condition-node.md), [Saída](../nodes/output-node.md), [Definir](../nodes/set-node.md), etc.)
- [Nota Adesiva](../nodes/sticky-note-node.md) – Notas markdown no Canvas com título editável, cor e apresentação de imagens
- [Nó de Agente](../nodes/agent-node.md) – Utilização de expressões em prompts de agente
- [Memória Persistente do Agente](./agent-persistent-memory.md) – `persistentMemoryEnabled` e `memoryShares` nos `data` do agente (não são campos de expressão)
- [Estrutura do Workflow](./workflow-structure.md) – Campos `data` do nó que aceitam expressões
- [Separador Credenciais](../tabs/credentials-tab.md) – Credenciais referenciadas pelos nós
- [Partilha de Credenciais](./credentials-sharing.md) – Partilhar credenciais e utilizar `$credentials` em expressões
- [Variáveis Globais](./global-variables.md) – Variáveis persistentes com `$global`
