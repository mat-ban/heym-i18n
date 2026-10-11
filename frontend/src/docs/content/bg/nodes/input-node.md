# Входен node

**Входният** node е входната точка за workflows, които получават данни от потребителя или от извикващия API. Той поддържа едно или няколко входни полета и предоставя метаданни за заявката (headers, query params).

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 0 |
| Изходи | 1 |
| Изход | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `value` | string | Стойност по подразбиране за единично текстово поле (незадължително) |
| `inputFields` | array | Дефиниции на входни полета. Всяко: `{ key, defaultValue? }` |

### Входни полета

| Поле | Тип | Описание |
|-------|------|-------------|
| `key` | string | Ключ на полето (напр. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Стойност по подразбиране, ако не е предоставена (незадължително) |

## Достъп до входните данни

**Полета в body** (винаги използвайте `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – текстово поле
- `$userInput.body.imageUrl` – URL на изображение
- `$userInput.body.userId` – със стойност по подразбиране, ако е конфигурирана
- `$userInput.body.event.user.id` – вложен JSON от режим Generic webhook

**Метаданни за заявката** (при изпълнение чрез API):

- `$userInput.headers` – всички headers (ключове с малки букви)
- `$userInput.headers.authorization` – конкретен header
- `$userInput.query` – query параметри
- `$userInput.query.param1` – конкретен query параметър

## Вход на файл в панела Run

В раздела **Run** на редактора (режим Defined webhook) всяко входно поле поддържа drag-and-drop и вграден контрол за прикачване (в долния десен ъгъл на полето):

- **Текстови файлове** (`.txt`, `.md`, `.json`, `.csv` и подобни) се четат като обикновен текст.
- **Изображения** (JPEG, PNG, GIF, WebP) се съхраняват като `data:` URL (base64) в стойността на полето — използвайте ключове на полета като `imageUrl` или `base64`, когато следващите nodes очакват данни за изображение.
- **PDF** файлове се преобразуват в извлечен текст (максимум 5 MB файл, 100k символа съдържание).

Един файл на поле. Все още можете да редактирате текстовата област, след като файлът бъде зареден. Режим Generic webhook (сурово JSON body) не показва контроли за файлове за отделните полета.

## Входни полета срещу Generic webhooks

`inputFields` все още описват очакваните входни данни за формулярите в режим defined на редактора, mapping на sub-workflow и други повърхности, управлявани от метаданни.

Когато даден workflow използва режим **Generic** за webhook body, входящото HTTP body не се преоформя от `inputFields`. Вместо това суровият JSON payload се предава директно към `$nodeLabel.body`, а контролите за добавяне/премахване на полета на входния node са скрити в панела на node.

## Примери

**Единичен вход (по подразбиране):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Няколко входа:**

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

## Свързани

- [Типове nodes](../reference/node-types.md) – Преглед на всички типове nodes
- [Triggers](../reference/triggers.md) – Входни точки (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Референциране на `$nodeLabel.body`, `$nodeLabel.query`
- [Портал](../reference/portal.md) – Представяне на workflows като Chat интерфейси
- [Webhooks](../reference/webhooks.md) – HTTP trigger за workflows
