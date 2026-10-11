# Вхідний вузол

Вузол **Input** (Вхідний) є точкою входу для workflow, які отримують дані від користувача або API-виклику. Він підтримує одне або декілька вхідних полів і надає доступ до метаданих запиту (headers, query params).

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 0 |
| Виходи | 1 |
| Вихід | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Параметри

| Параметр | Тип | Опис |
|-----------|------|-------------|
| `label` | string | Ідентифікатор вузла (camelCase) |
| `value` | string | Значення за замовчуванням для одного текстового поля (необов'язково) |
| `inputFields` | array | Визначення вхідних полів. Кожне: `{ key, defaultValue? }` |

### Вхідні поля

| Поле | Тип | Опис |
|-------|------|-------------|
| `key` | string | Ключ поля (наприклад, `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Значення за замовчуванням, якщо не вказано (необов'язково) |

## Доступ до вхідних даних

**Поля body** (завжди використовуйте `$nodeLabel.body.fieldKey`):

- `$userInput.body.text` – текстове поле
- `$userInput.body.imageUrl` – URL зображення
- `$userInput.body.userId` – зі значенням за замовчуванням, якщо налаштовано
- `$userInput.body.event.user.id` – вкладений JSON із режиму Generic webhook

**Метадані запиту** (під час виконання через API):

- `$userInput.headers` – усі headers (ключі в нижньому регістрі)
- `$userInput.headers.authorization` – конкретний header
- `$userInput.query` – query-параметри
- `$userInput.query.param1` – конкретний query-параметр

## Введення файлів на панелі запуску

На вкладці **Run** редактора (режим Defined webhook) кожне вхідне поле підтримує перетягування файлів і вбудований елемент керування вкладеннями (у правому нижньому куті поля):

- **Текстові файли** (`.txt`, `.md`, `.json`, `.csv` тощо) зчитуються як звичайний текст.
- **Зображення** (JPEG, PNG, GIF, WebP) зберігаються як `data:` URL (base64) у значенні поля — використовуйте такі ключі полів, як `imageUrl` або `base64`, коли наступні вузли очікують дані зображення.
- **PDF**-файли перетворюються на витягнутий текст (максимальний розмір файлу — 5 МБ, обсяг вмісту — 100 тис. символів).

Один файл на поле. Після завантаження файлу текстову область усе ще можна редагувати. Режим Generic webhook (необроблене тіло JSON) не показує елементи керування файлами для окремих полів.

## Вхідні поля проти Generic webhooks

`inputFields` усе ще описують очікувані вхідні дані для форм редактора в режимі defined, зіставлення під-workflow та інших поверхонь, керованих метаданими.

Коли workflow використовує режим тіла **Generic** webhook, вхідне тіло HTTP не переформовується на основі `inputFields`. Натомість необроблений JSON payload передається безпосередньо до `$nodeLabel.body`, а елементи керування додаванням/видаленням полів вхідного вузла приховуються на панелі вузла.

## Приклади

**Один вхід (за замовчуванням):**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Кілька входів:**

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

## Пов'язані матеріали

- [Node Types](../reference/node-types.md) – Огляд усіх типів вузлів
- [Triggers](../reference/triggers.md) – Точки входу (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Посилання на `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Публікація workflow як Chat-інтерфейсів
- [Webhooks](../reference/webhooks.md) – HTTP trigger для workflow
