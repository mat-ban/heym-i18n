# Entrada

O nó **Input** é o ponto de entrada para workflows que recebem dados do usuário ou do chamador da API. Ele oferece suporte a campos de entrada únicos ou múltiplos e expõe metadados da requisição (headers, query params).

## Visão Geral

| Propriedade | Valor |
|----------|-------|
| Entradas | 0 |
| Saídas | 1 |
| Saída | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `label` | string | Identificador do nó (camelCase) |
| `value` | string | Valor padrão para entrada de texto única (opcional) |
| `inputFields` | array | Definições de campos de entrada. Cada um: `{ key, defaultValue? }` |

### Campos de Entrada

| Campo | Tipo | Descrição |
|-------|------|-------------|
| `key` | string | Chave do campo (ex.: `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Valor padrão caso não seja fornecido (opcional) |

## Acessando Dados de Entrada

**Campos do body** (sempre use `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – campo de texto
- `$userInput.body.imageUrl` – URL da imagem
- `$userInput.body.userId` – com valor padrão, se configurado
- `$userInput.body.event.user.id` – JSON aninhado do modo Generic webhook

**Metadados da requisição** (quando executado via API):

- `$userInput.headers` – todos os headers (chaves em minúsculas)
- `$userInput.headers.authorization` – header específico
- `$userInput.query` – query parameters
- `$userInput.query.param1` – query param específico

## Entrada de Arquivo no Painel Run

Na aba **Run** do editor (modo Defined webhook), cada campo de entrada oferece suporte a arrastar e soltar e a um controle de anexo inline (canto inferior direito do campo):

- **Arquivos de texto** (`.txt`, `.md`, `.json`, `.csv` e similares) são lidos como texto simples.
- **Imagens** (JPEG, PNG, GIF, WebP) são armazenadas como uma URL `data:` (base64) no valor do campo — use chaves de campo como `imageUrl` ou `base64` quando os nós subsequentes esperarem dados de imagem.
- **Arquivos PDF** são convertidos em texto extraído (arquivo de no máximo 5 MB, 100 mil caracteres de conteúdo).

Um arquivo por campo. Você ainda pode editar a área de texto após um arquivo ser carregado. O modo Generic webhook (body JSON bruto) não exibe controles de arquivo por campo.

## Campos de Entrada vs Generic Webhooks

`inputFields` ainda descrevem as entradas esperadas para formulários do editor em modo defined, mapeamento de sub-workflow e outras superfícies orientadas a metadados.

Quando um workflow usa o modo de body **Generic** webhook, o body HTTP recebido não é remodelado a partir de `inputFields`. Em vez disso, o payload JSON bruto é repassado para `$nodeLabel.body`, e os controles de adicionar/remover campos do nó Input ficam ocultos no painel do nó.

## Exemplos

**Entrada única (padrão):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Múltiplas entradas:**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## Relacionados

- [Node Types](../reference/node-types.md) – Visão geral de todos os tipos de nó
- [Triggers](../reference/triggers.md) – Pontos de entrada (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Referenciando `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Exponha workflows como interfaces de chat
- [Webhooks](../reference/webhooks.md) – Trigger HTTP para workflows
