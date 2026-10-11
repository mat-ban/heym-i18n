# LLM

Вузол **LLM** обробляє текст за допомогою мовної моделі або генерує зображення. Він підтримує генерацію тексту, розпізнавання зображень (вхідні зображення), генерацію зображень, структурований вивід JSON та виконання через провайдерний **Batch API** для підтримуваних текстових моделей.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1, а також додатковий `batchStatus`, коли увімкнено режим пакетної обробки |
| Вивід | `$nodeLabel.text` (текст), `$nodeLabel.image` (зображення) або поля результату пакетної обробки, як-от `$nodeLabel.results` |

## Параметри

### Облікові дані та модель

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `credentialId` | UUID | Облікові дані LLM з розділу [Облікові дані](../tabs/credentials-tab.md) |
| `model` | string | Назва моделі (наприклад, `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` для зображень) |
| `fallbackCredentialId` | UUID (необов'язково) | Резервні облікові дані на випадок збою основних |
| `fallbackModel` | string (необов'язково) | Резервна модель на випадок збою основної |

Якщо основні облікові дані або модель повертають помилку, вузол автоматично повторює спробу з резервними обліковими даними та моделлю, перш ніж завершитися з помилкою.

Heym також перевіряє **підтримку пакетної обробки** для вибраних облікових даних і моделі. Режим пакетної обробки доступний для:

- Облікових даних OpenAI
- Власних облікових даних, сумісних з OpenAI, чий endpoint надає необхідні API `/v1/files` та `/v1/batches`

Якщо вибраний провайдер або модель не підтримує пакетне виконання, панель властивостей повідомляє про це безпосередньо та вимикає відповідний перемикач.

### Prompt (текстовий режим)

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `systemInstruction` | string | Системний prompt. Підтримує [вирази](../reference/expression-dsl.md). |
| `userMessage` | string | Повідомлення користувача. За замовчуванням: `$input.text` |
| `temperature` | number | 0.0–2.0 (за замовчуванням: 0.7) |
| `maxTokens` | number | Максимальна кількість токенів відповіді (необов'язково) |
| `requestTimeoutSeconds` | number | Максимальна кількість секунд очікування відповіді моделі до завершення часу очікування (за замовчуванням: 60). Збільште це значення для повільних або самостійно розміщених провайдерів (LiteLLM, vLLM, локальні моделі). |

### Зображення та вивід

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Генерація тексту або зображення |
| `imageInputEnabled` | boolean | Додати зображення до повідомлення користувача (розпізнавання зображень) |
| `imageInput` | expression | URL-адреса даних Base64 або URL-адреса зображення |
| `jsonOutputEnabled` | boolean | Структурований вивід JSON |
| `jsonOutputSchema` | string | JSON Schema для структурованого виводу |
| `extraBodyEnabled` | boolean | Надсилати специфічні для провайдера параметри запиту (за замовчуванням: `false`) |
| `extraBody` | string | Об'єкт JSON, що додається до тіла запиту API |

### Моделі міркування (o1, o3)

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Увімкнути для моделей міркування |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Глибина міркування |

### Режим пакетної обробки

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Використовувати провайдерний Batch API замість виконання окремих запитів |

Режим пакетної обробки доступний лише для вузла **LLM**. Він **не** застосовується до [Вузла Agent](./agent-node.md).

Коли режим пакетної обробки увімкнено:

- `outputType` має залишатися `text`
- `imageInputEnabled` має залишатися `false`
- `userMessage` має обчислюватися в **масив**
- кожен елемент масиву має обчислюватися в рядок або примітивне значення

Типові приклади:

- `$input.items.map("item.text")`
- `$vars.promptList`

Якщо вираз обчислюється в один рядок замість масиву, запуск завершується помилкою валідації ще до початку виклику провайдера.

## Гілка стану пакетної обробки

Коли режим пакетної обробки увімкнено, вузол LLM надає другий вихідний порт: `batchStatus`.

Використовуйте цю гілку для сповіщень, журналювання, повідомлень Slack або побічних ефектів, поки пакетна обробка ще виконується. Гілка спрацьовує щоразу, коли стан провайдера суттєво змінюється, включаючи нормалізовані стани, як-от:

- `pending`
- `processing`
- `completed`
- `failed`

Payload гілки стану доступний як `$input` у наступних вузлах і містить:

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

Приклад ребра:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Приклад перетворювача стану:

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

## Структура результату пакетної обробки

Після успішного завершення основний вивід LLM містить:

- `$nodeLabel.text` – об'єднані успішні тексти
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – результати для кожного елемента в початковому порядку
- `$nodeLabel.usage`

Кожен елемент у `$nodeLabel.results` містить такі поля:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Коли **вивід JSON** увімкнено разом із режимом пакетної обробки, Heym аналізує кожен успішний елемент окремо. Проаналізовані об'єкти надаються для кожного елемента та збираються в `parsedResults`.
## Responses API

Прапорець **Use Responses API** спрямовує виклик вузла через
[Responses API](https://platform.openai.com/docs/api-reference/responses) замість Chat
Completions. Типово його вимкнено, і вузол поводиться однаково в обох випадках: ті самі prompt,
та сама схема виводу JSON, та сама форма результату.

Він працює з обліковими даними OpenAI, а також із користувацькими обліковими даними, чий gateway
підтримує цей endpoint, тож самостійно розгорнуте або проксійоване середовище також може його
використовувати. З обліковими даними Google він залишається вимкненим, і його не можна поєднувати
з [Batch mode](#batch-status-branch) — панель вузла повідомляє, на чому стоять конкретні облікові
дані, ще до запуску.

Якщо під час виконання endpoint виявиться недоступним, вузол завершується помилкою із зазначенням
причини, а не тихо перемикається на запасний варіант, тож вузол, налаштований на Responses API,
завжди працює саме через нього. Щоб свідомо перейти на інші облікові дані чи модель, скористайтеся
полями **Fallback Credential** і **Fallback Model**; вони успадковують цей прапорець, тож запасні
облікові дані також мають підтримувати цей endpoint.

## Image Generation

- **Models:** `nanobanana`, `gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image` (base64 data URL)
- Під час використання [Input](./input-node.md) для prompt застосовуйте `$userPrompt.body.text` у `userMessage`

## JSON Output

Коли `jsonOutputEnabled` має значення true, LLM повертає JSON, що відповідає схемі. Доступ до полів — через `$nodeLabel.fieldName`.

## Extra Body

Деякі провайдери приймають параметри запиту, які не охоплюються стандартними полями, сумісними з
OpenAI, наприклад вимкнення режиму міркування моделі. Позначте **Send extra request body** у
властивостях вузла та введіть об'єкт JSON. Він додається до кожного API-запиту, який робить цей
вузол.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Вимкнено типово.** Коли прапорець знято, нічого додаткового не надсилається.
- Має бути **об'єктом** JSON. Масив, скалярне значення або некоректний текст спричиняє помилку
  вузла `Invalid extra body JSON`, а не тихе відкидання.
- Кнопка **Format** поруч із прапорцем переформатовує JSON і стає червоною з написом
  `Invalid`, коли текст не вдається розібрати.
- Застосовується до основного completion, спроби із запасного моделлю та запитів у batch mode.
  **Не** застосовується до генерації зображень чи перевірок guardrail, які використовують іншу
  форму запиту та окрему модель.
- Вирази `$` обчислюються перед розбором, тож `{"max_tokens": $prev.limit}` працює. Оскільки це
  текстова підстановка, обчислене значення, що містить подвійну лапку або символ нового рядка,
  дає некоректний JSON і спричиняє помилку вузла.

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

Увімкніть **Guardrails** у властивостях вузла, щоб блокувати небезпечні повідомлення користувача
перед викликом LLM. Повний довідник дивіться в розділі [Guardrails](../reference/guardrails.md).

## Related

- [Agent Node](./agent-node.md) – LLM із викликом інструментів
- [Why Heym](../getting-started/why-heym.md) – Місце кроків LLM у життєвому циклі агента
- [Guardrails](../reference/guardrails.md) – Блокування категорій небезпечного вмісту
- [Node Types](../reference/node-types.md) – Огляд усіх типів вузлів
- [Expression DSL](../reference/expression-dsl.md) – Посилання на дані в prompt
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Розширюваний редактор із живим переглядом на боці бекенду для prompt
- [Credentials Tab](../tabs/credentials-tab.md) – Додавання API-ключів LLM
- [Quick Start](../getting-started/quick-start.md) – Базовий Workflow з LLM
