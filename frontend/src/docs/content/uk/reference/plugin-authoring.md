# Авторство плагінів

Плагіни Heym — це довірені zip-пакети, які встановлює оператор. Пакет може
додавати один або кілька вузлів користувацьких дій чи тригерів без зміни ядра застосунку.

## Структура пакета

Zip-архів плагіна має містити `plugin.json` у корені пакета та файл входу Python,
ім'я якого вказано в `entry` (типово — `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

`README.md` є необов'язковим і подається як сторінка документації плагіна. Розмістіть
`icon.svg` у корені пакета для типової іконки вузла або вкажіть шлях `icon`,
специфічний для вузла, у `plugin.json`.

## Маніфест

Використовуйте багатовузловий `plugin.json`, коли один пакет надає кілька вузлів:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

Застарілі однoвузлові маніфести також приймаються: опустіть `nodes` і вкажіть
`kind`, `fields`, `dslHint` та `docSlug` на верхньому рівні.

## Поля маніфесту

| Поле | Примітки |
|-------|-------|
| `id` | Ідентифікатор пакета в нижньому регістрі, що використовує літери, цифри та дефіси. |
| `name` | Зрозуміла людині назва пакета. |
| `version` | Версія пакета, що використовується для відображення та кешування обробників. |
| `description` | Короткий опис, що показується в інтерфейсі та контексті асистента. |
| `entry` | Шлях до файлу обробника Python усередині zip-архіву; типово — `handler.py`. |
| `dependencies` | Необов'язкові pip-залежності, що встановлюються за допомогою `uv pip install`. |
| `nodes` | Користувацькі вузли, які надає цей пакет. |

Кожен вузол потребує унікального `key`, `name` та `kind` зі значенням `action` або
`trigger`. Якщо `function` опущено, дії викликають `run`, а тригери — `trigger`.

Підтримувані типи полів — `string`, `number`, `boolean` та `select`. Поля `select`
використовують масив `options` з об'єктів `{ "label": "...", "value": "..." }`.
Встановіть `required` для обов'язкових полів і `secret` для прихованих введень. Маніфест
також приймає метадані `default`, `dynamic` та `expression` для полів; вони
зберігаються разом із маніфестом, але вузли плагінів наразі читають збережену конфігурацію вузла
під час виконання, а не автоматично заповнюють відсутню конфігурацію з типових значень.

Несекретні рядкові поля відображаються за допомогою інтерфейсу введення виразів. Під час виконання
будь-яке збережене рядкове значення конфігурації, що починається з `$`, розв'язується перед викликом обробника.

## Функції обробників

Обробники дій отримують вхідні дані workflow, розв'язану конфігурацію та невеликий контекст:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Обробники тригерів отримують розв'язану конфігурацію та контекст:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Поверніть словник, щоб надати іменовані вихідні поля. Якщо обробник повертає інший
тип, Heym обгортає його як `{ "value": result }`.

## Встановлення та середовище виконання

Плагіни типово вимкнені. Оператори вмикають їх за допомогою
`HEYM_PLUGINS_ENABLED=true` та обмежують керування через
`HEYM_PLUGIN_ADMIN_EMAILS`. Файли встановлених плагінів розміщуються в
`HEYM_PLUGINS_DIR` і мають бути змонтовані постійно в контейнерних розгортаннях.

Код плагінів — це довірений Python, встановлений оператором, який виконується в тому самому процесі, що й
бекенд. Він може отримувати доступ до мережі та встановлених бібліотек, тому встановлюйте лише ті
пакети, які Ви готові запускати з тим самим рівнем довіри, що й сам Heym.
