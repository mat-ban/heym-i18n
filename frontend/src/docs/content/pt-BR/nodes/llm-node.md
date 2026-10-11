# LLM

O nó **LLM** processa texto com um modelo de linguagem ou gera imagens. Ele oferece suporte a geração de texto, visão (entrada de imagem), geração de imagens, saída JSON estruturada e execução nativa do provedor via **Batch API** para modelos de texto compatíveis.

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 1 |
| Saídas | 1, além do opcional `batchStatus` quando o modo batch está habilitado |
| Saída | `$nodeLabel.text` (texto), `$nodeLabel.image` (imagem) ou campos de resultado do batch, como `$nodeLabel.results` |

## Parâmetros

### Credencial e Modelo

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial LLM em [Credentials](../tabs/credentials-tab.md) |
| `model` | string | Nome do modelo (ex.: `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` para imagens) |
| `fallbackCredentialId` | UUID (opcional) | Credencial de fallback quando a principal falha |
| `fallbackModel` | string (opcional) | Modelo de fallback quando o principal falha |

Se a credencial ou o modelo principal retornar um erro, o nó tenta novamente automaticamente com a credencial e o modelo de fallback antes de falhar.

O Heym também verifica a **capacidade de batch** a partir da credencial e do modelo selecionados. O modo batch está disponível para:

- Credenciais OpenAI
- Credenciais personalizadas / compatíveis com OpenAI cujo endpoint exponha as APIs `/v1/files` e `/v1/batches` necessárias

Se o provedor ou modelo selecionado não oferecer suporte à execução em batch, o painel de Propriedades exibirá isso diretamente e desabilitará o toggle.

### Prompts (modo texto)

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt de sistema. Suporta [expressões](../reference/expression-dsl.md). |
| `userMessage` | string | Mensagem do usuário. Padrão: `$input.text` |
| `temperature` | number | 0.0–2.0 (padrão: 0.7) |
| `maxTokens` | number | Máximo de tokens da resposta (opcional) |
| `requestTimeoutSeconds` | number | Máximo de segundos para aguardar a resposta do modelo antes do timeout (padrão: 60). Aumente esse valor para provedores lentos ou auto-hospedados (LiteLLM, vLLM, modelos locais). |

### Imagem e Saída

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Geração de texto ou imagem |
| `imageInputEnabled` | boolean | Incluir imagem com a mensagem do usuário (visão) |
| `imageInput` | expression | Data URL em Base64 ou URL de imagem |
| `jsonOutputEnabled` | boolean | Saída JSON estruturada |
| `jsonOutputSchema` | string | JSON Schema para saída estruturada |
| `extraBodyEnabled` | boolean | Enviar parâmetros de requisição específicos do provedor (padrão: `false`) |
| `extraBody` | string | Objeto JSON mesclado ao corpo da requisição da API |

### Modelos de raciocínio (o1, o3)

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Habilitar para modelos de raciocínio |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Profundidade do raciocínio |

### Modo Batch

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Usar a Batch API nativa do provedor em vez da execução de requisição única |

O modo batch está disponível apenas no nó **LLM**. Ele **não** se aplica ao [Agent Node](./agent-node.md).

Quando o modo batch está habilitado:

- `outputType` deve permanecer como `text`
- `imageInputEnabled` deve permanecer como `false`
- `userMessage` deve ser resolvido para um **array**
- cada item do array deve ser resolvido para uma string ou valor primitivo

Exemplos típicos:

- `$input.items.map("item.text")`
- `$vars.promptList`

Se a expressão for resolvida para uma única string em vez de um array, a execução falhará com um erro de validação antes do início da chamada ao provedor.

## Ramificação de Status do Batch

Quando o modo batch está habilitado, o nó LLM expõe um segundo handle de saída: `batchStatus`.

Use essa ramificação para notificações, logging, mensagens no Slack ou efeitos colaterais enquanto o batch ainda está em execução. A ramificação é disparada sempre que o status do provedor muda de forma significativa, incluindo estados normalizados como:

- `pending`
- `processing`
- `completed`
- `failed`

O payload da ramificação de status está disponível como `$input` dentro dos nós subsequentes e inclui:

- `$input.batchId`
- `$input.batchStatus`
- `$input.status`
- `$input.rawStatus`
- `$input.total`
- `$input.completed`
- `$input.failed`
- `$input.requestCounts.total`
- `$input.requestCounts.completed`
- `$input.requestCounts.failed`
- `$input.provider`
- `$input.model`

Exemplo de edge:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Exemplo de mapeador de status:

```json
{
  "type": "set",
  "data": {
    "label": "notifyProgress",
    "mappings": [
      { "key": "status", "value": "$input.batchStatus" },
      { "key": "completed", "value": "$input.completed" },
      { "key": "total", "value": "$input.total" }
    ]
  }
}
```

## Estrutura do Resultado do Batch

Ao concluir com sucesso, a saída principal do LLM contém:

- `$nodeLabel.text` – textos bem-sucedidos concatenados
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – resultados por item na ordem original
- `$nodeLabel.usage`

Cada item em `$nodeLabel.results` inclui campos como:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Quando a **saída JSON** está habilitada junto com o modo batch, o Heym analisa cada item bem-sucedido separadamente. Os objetos analisados são expostos por item e coletados em `parsedResults`.
## Responses API

A caixa de seleção **Use Responses API** direciona a chamada do nó através da
[Responses API](https://platform.openai.com/docs/api-reference/responses) em vez de Chat
Completions. Ela fica desativada por padrão, e o nó se comporta da mesma forma em ambos os casos: os mesmos prompts,
o mesmo schema de saída JSON, o mesmo formato de resultado.

Funciona com uma credencial OpenAI e com uma credencial personalizada cujo gateway suporte o
endpoint, de modo que uma configuração auto-hospedada ou com proxy também pode utilizá-la. Com uma credencial Google, ela permanece
desativada, e não pode ser combinada com o [modo Batch](#batch-status-branch) - o painel do nó indica
a situação de cada credencial antes de você executar qualquer coisa.

Se o endpoint estiver indisponível em tempo de execução, o nó falha com uma mensagem que nomeia a
causa em vez de recorrer silenciosamente a outro caminho, de modo que um nó configurado para a Responses API sempre
opera sobre ela. Para recorrer deliberadamente a outra credencial ou modelo, utilize os campos **Fallback
Credential** e **Fallback Model**; eles herdam esta caixa de seleção, portanto uma credencial de fallback
também precisa suportar o endpoint.

## Geração de Imagem

- **Modelos:** `nanobanana`, `gemini-2.0-flash-exp`
- **Saída:** `$nodeLabel.image` (URL de dados em base64)
- Ao usar o nó [Input](./input-node.md) para o prompt, utilize `$userPrompt.body.text` em `userMessage`

## Saída JSON

Quando `jsonOutputEnabled` é true, o LLM retorna JSON correspondente ao schema. Acesse os campos via `$nodeLabel.fieldName`.

## Extra Body

Alguns provedores aceitam parâmetros de requisição que os campos padrão compatíveis com OpenAI não
cobrem, como desativar o modo de raciocínio de um modelo. Marque **Send extra request body** nas propriedades
do nó e insira um objeto JSON. Ele é mesclado em toda requisição de API que este nó realiza.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Desativado por padrão.** Com a caixa de seleção desmarcada, nada extra é enviado.
- Deve ser um **objeto** JSON. Um array, um escalar ou texto malformado faz o nó falhar com
  `Invalid extra body JSON` em vez de ser descartado silenciosamente.
- O botão **Format** ao lado da caixa de seleção reformata o JSON e fica vermelho exibindo
  `Invalid` quando o texto não é analisável.
- Aplicado à conclusão principal, à tentativa com o modelo de fallback e às requisições em modo batch.
  **Não** é aplicado à geração de imagem nem às verificações de guardrail, que utilizam um formato de requisição
  diferente e um modelo separado.
- As expressões `$` são resolvidas antes da análise, portanto `{"max_tokens": $prev.limit}` funciona. Como
  isto é uma substituição textual, um valor resolvido contendo aspas duplas ou uma nova linha
  produz JSON inválido e faz o nó falhar.

## Exemplo – Texto

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "You are a helpful assistant.",
    "userMessage": "$userInput.body.text"
  }
}
```

## Exemplo – Texto em Batch

```json
{
  "nodes": [
    {
      "id": "var_1",
      "type": "variable",
      "position": { "x": 120, "y": 180 },
      "data": {
        "label": "batchPrompts",
        "variableName": "promptList",
        "variableType": "array",
        "variableValue": "$array(\"Summarize this invoice\", \"Draft a follow-up email\", \"Classify the invoice status\")"
      }
    },
    {
      "id": "llm_1",
      "type": "llm",
      "position": { "x": 420, "y": 180 },
      "data": {
        "label": "batchLlm",
        "credentialId": "credential-uuid",
        "model": "gpt-4o-mini",
        "batchModeEnabled": true,
        "systemInstruction": "Answer each item briefly.",
        "userMessage": "$vars.promptList"
      }
    },
    {
      "id": "set_1",
      "type": "set",
      "position": { "x": 760, "y": 70 },
      "data": {
        "label": "progressUpdate",
        "mappings": [
          { "key": "status", "value": "$input.batchStatus" },
          { "key": "completed", "value": "$input.completed" }
        ]
      }
    },
    {
      "id": "out_1",
      "type": "output",
      "position": { "x": 760, "y": 280 },
      "data": {
        "label": "batchResult",
        "outputKey": "responses"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "var_1", "target": "llm_1" },
    { "id": "e2", "source": "llm_1", "sourceHandle": "batchStatus", "target": "set_1" },
    { "id": "e3", "source": "llm_1", "target": "out_1" }
  ]
}
```

## Exemplo – Geração de imagem

```json
{
  "type": "llm",
  "data": {
    "label": "generateImage",
    "credentialId": "credential-uuid",
    "model": "nanobanana",
    "outputType": "image",
    "userMessage": "$userPrompt.body.text"
  }
}
```

## Guardrails

Ative **Guardrails** nas propriedades do nó para bloquear mensagens de usuário inseguras antes da chamada ao LLM. Consulte [Guardrails](../reference/guardrails.md) para a referência completa.

## Relacionados

- [Agent Node](./agent-node.md) – LLM com chamada de ferramentas
- [Why Heym](../getting-started/why-heym.md) – Onde as etapas de LLM se encaixam no ciclo de vida do agente
- [Guardrails](../reference/guardrails.md) – Bloqueie categorias de conteúdo inseguro
- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Expression DSL](../reference/expression-dsl.md) – Referenciando dados em prompts
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Editor expansível com pré-visualização em tempo real do backend para prompts
- [Credentials Tab](../tabs/credentials-tab.md) – Adicione chaves de API de LLM
- [Quick Start](../getting-started/quick-start.md) – Workflow básico de LLM
