# LLM

**LLM** node обработва текст с езиков модел или генерира изображения. Поддържа генериране на текст, vision (входно изображение), генериране на изображения, структуриран JSON изход и изпълнение чрез **Batch API**, присъщ на доставчика, за поддържани текстови модели.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1, плюс опционален `batchStatus`, когато е активиран batch режим |
| Изход | `$nodeLabel.text` (текст), `$nodeLabel.image` (изображение) или полета с резултат от batch като `$nodeLabel.results` |

## Параметри

### Удостоверение и модел

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `credentialId` | UUID | LLM удостоверение от [Удостоверения](../tabs/credentials-tab.md) |
| `model` | string | Име на модел (напр. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` за изображения) |
| `fallbackCredentialId` | UUID (опционално) | Резервно удостоверение при неуспех на основното |
| `fallbackModel` | string (опционално) | Резервен модел при неуспех на основния |

Ако основното удостоверение или модел върне грешка, node автоматично прави нов опит с резервното удостоверение и модел, преди да се провали.

Heym също проверява **batch capability** от избраното удостоверение и модел. Batch режимът е наличен за:

- OpenAI удостоверения
- Custom / OpenAI-съвместими удостоверения, чийто endpoint предоставя необходимите `/v1/files` и `/v1/batches` API

Ако избраният доставчик или модел не поддържа batch изпълнение, панелът Properties показва това директно и деактивира превключвателя.

### Prompts (текстов режим)

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `systemInstruction` | string | Системен prompt. Поддържа [изрази](../reference/expression-dsl.md). |
| `userMessage` | string | Потребителско съобщение. По подразбиране: `$input.text` |
| `temperature` | number | 0.0–2.0 (по подразбиране: 0.7) |
| `maxTokens` | number | Максимален брой токени в отговора (опционално) |
| `requestTimeoutSeconds` | number | Максимален брой секунди за изчакване на отговора от модела преди timeout (по подразбиране: 60). Увеличете го за бавни или self-hosted доставчици (LiteLLM, vLLM, локални модели). |

### Изображение и изход

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Генериране на текст или изображение |
| `imageInputEnabled` | boolean | Включване на изображение към потребителското съобщение (vision) |
| `imageInput` | expression | Base64 data URL или URL на изображение |
| `jsonOutputEnabled` | boolean | Структуриран JSON изход |
| `jsonOutputSchema` | string | JSON Schema за структуриран изход |
| `extraBodyEnabled` | boolean | Изпращане на специфични за доставчика параметри на заявката (по подразбиране: `false`) |
| `extraBody` | string | JSON обект, обединен в тялото на API заявката |

### Reasoning модели (o1, o3)

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Активиране за reasoning модели |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Дълбочина на reasoning |

### Batch режим

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Използване на Batch API, присъщ на доставчика, вместо изпълнение на единична заявка |

Batch режимът е наличен само на **LLM** node. Той **не** се прилага към [Agent Node](./agent-node.md).

Когато batch режимът е активиран:

- `outputType` трябва да остане `text`
- `imageInputEnabled` трябва да остане `false`
- `userMessage` трябва да се разреши до **масив**
- всеки елемент от масива трябва да се разреши до string или примитивна стойност

Типични примери:

- `$input.items.map("item.text")`
- `$vars.promptList`

Ако изразът се разреши до единичен string вместо до масив, изпълнението се проваля с грешка при валидация, преди да започне заявката към доставчика.

## Клон Batch Status

Когато batch режимът е активиран, LLM node предоставя втори изходен handle: `batchStatus`.

Използвайте този клон за известия, логване, Slack съобщения или странични ефекти, докато batch-ът все още се изпълнява. Клонът се задейства всеки път, когато статусът на доставчика се промени съществено, включително нормализирани състояния като:

- `pending`
- `processing`
- `completed`
- `failed`

Payload-ът на status клона е достъпен като `$input` в downstream nodes и включва:

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

Примерен edge:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Примерен status mapper:

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

## Структура на batch резултата

При успешно завършване основният изход на LLM съдържа:

- `$nodeLabel.text` – конкатенирани успешни текстове
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – резултати за всеки елемент в оригиналния ред
- `$nodeLabel.usage`

Всеки елемент в `$nodeLabel.results` включва полета като:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Когато **JSON output** е активиран заедно с batch режим, Heym парсва всеки успешен елемент поотделно. Парснатите обекти се предоставят за всеки елемент и се събират в `parsedResults`.
## Responses API

Отметката **Use Responses API** насочва извикването на node-а през
[Responses API](https://platform.openai.com/docs/api-reference/responses) вместо през Chat
Completions. По подразбиране е изключена и node-ът се държи еднакво и в двата случая: същите prompts,
същата JSON схема за изход, същата форма на резултата.

Работи с OpenAI удостоверение, както и с персонализирано удостоверение, чийто gateway поддържа
endpoint-а, така че самостоятелно хоствана или проксирана конфигурация също може да го използва. С
Google удостоверение остава деактивирана и не може да се комбинира с [Batch mode](#batch-status-branch) –
панелът на node-а показва какъв е статусът на дадено удостоверение, преди да стартирате каквото и да е.

Ако endpoint-ът се окаже недостъпен по време на изпълнение, node-ът се проваля със съобщение, указващо
причината, вместо тихо да премине към резервен вариант, така че node, конфигуриран за Responses API,
винаги работи през него. За да преминете умишлено към друго удостоверение или модел, използвайте полетата
**Fallback Credential** и **Fallback Model**; те наследяват тази отметка, така че резервното удостоверение
също трябва да поддържа endpoint-а.

## Image Generation

- **Models:** `nanobanana`, `gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image` (base64 data URL)
- Когато използвате [Input](./input-node.md) за prompt-а, използвайте `$userPrompt.body.text` в `userMessage`

## JSON Output

Когато `jsonOutputEnabled` е true, LLM-ът връща JSON, съответстващ на схемата. Достъпвайте полетата чрез `$nodeLabel.fieldName`.

## Extra Body

Някои доставчици приемат параметри на заявката, които стандартните OpenAI-съвместими полета не
покриват, като например деактивиране на режима на мислене на даден модел. Отметнете **Send extra request body** в
свойствата на node-а и въведете JSON обект. Той се обединява във всяка API заявка, която този node прави.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Деактивирано по подразбиране.** С изключена отметка не се изпраща нищо допълнително.
- Трябва да бъде JSON **обект**. Масив, скаларна стойност или неправилно форматиран текст провалят node-а с
  `Invalid extra body JSON`, вместо да бъдат тихо премахнати.
- Бутонът **Format** до отметката преформатира JSON-а и става червен с надпис
  `Invalid`, когато текстът не може да бъде разчетен.
- Прилага се към основното завършване, опита с резервния модел и заявките в batch режим.
  **Не** се прилага към генерирането на изображения или към проверките на guardrails, които използват различна форма
  на заявката и отделен модел.
- `$` изразите се разрешават преди парсването, така че `{"max_tokens": $prev.limit}` работи. Тъй като
  това е текстова замяна, разрешена стойност, съдържаща двойна кавичка или нов ред,
  произвежда невалиден JSON и проваля node-а.

## Example – Text

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

## Example – Batch text

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

## Example – Image generation

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

Активирайте **Guardrails** в свойствата на node-а, за да блокирате опасни потребителски съобщения преди извикването на LLM-а. Вижте [Guardrails](../reference/guardrails.md) за пълната справка.

## Related

- [Agent Node](./agent-node.md) – LLM с извикване на инструменти
- [Why Heym](../getting-started/why-heym.md) – Къде се вписват LLM стъпките в жизнения цикъл на агента
- [Guardrails](../reference/guardrails.md) – Блокиране на категории небезопасно съдържание
- [Node Types](../reference/node-types.md) – Преглед на всички типове node-ове
- [Expression DSL](../reference/expression-dsl.md) – Референциране на данни в prompts
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Разгъваем редактор с преглед на живо от backend-а за prompts
- [Credentials Tab](../tabs/credentials-tab.md) – Добавяне на LLM API ключове
- [Quick Start](../getting-started/quick-start.md) – Основен LLM workflow
