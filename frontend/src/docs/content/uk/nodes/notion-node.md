# Notion

Вузол **Notion** керує базами даних, джерелами даних, сторінками та блоками через Notion API.

## Огляд

| Властивість | Значення |
|----------|-------|
| Входи | 1 |
| Виходи | 1 |
| Облікові дані | Внутрішній токен інтеграції або Notion OAuth |
| Версія API | `2026-03-11` |

Колекції у стилі баз даних Notion використовують **ідентифікатори джерел даних** у поточних версіях API. Перш ніж запускати вузол, надайте інтеграції доступ до кожної сторінки або джерела даних, потрібних workflow.
Поля ресурсів приймають як необроблений ідентифікатор Notion, так і повний URL-адрес Notion. URL-адреси нормалізуються до вбудованого ідентифікатора ресурсу перед запитом до API.

## Операції

| Операція | Обов'язкові поля | Основний вихід |
|-----------|-----------------|-------------|
| Search | Необов'язкові query/filter/sort | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID або Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, одне з Properties/Icon/Cover | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Запит до бази даних із `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, непорожній запит до бази даних | `.database`, `.id`, `.url` |
| Create Data Source | Запит до джерела даних із `parent` та непорожнім `properties` | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, непорожній запит до джерела даних | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block або Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, об'єкт оновлення блоку | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block або Page ID, Children | `.results`, `.count` |

Усі операції також повертають `.success` та `.operation`.

## Поля JSON

Поля Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon та Cover приймають
JSON Notion API. Вирази всередині рядків JSON обчислюються перед запитом. Поле також може
бути одним окремим виразом, що обчислюється безпосередньо до потрібного об'єкта або масиву, наприклад
`$input.database`, `$input.properties` або `$input.children`.

```json
{
  "Name": {
    "title": [
      {
        "text": {
          "content": "$input.title"
        }
      }
    ]
  }
}
```

Для вмісту сторінки або блоку Children — це масив об'єктів блоків Notion:

```json
[
  {
    "object": "block",
    "type": "paragraph",
    "paragraph": {
      "rich_text": [
        {
          "type": "text",
          "text": {
            "content": "$input.description"
          }
        }
      ]
    }
  }
]
```

## Бази даних і джерела даних

У поточному Notion API **база даних** є контейнером, а **джерело даних** містить схему
властивостей і рядки, доступні для запитів. Retrieve Database повертає список `data_sources` бази даних; використовуйте один із
цих ідентифікаторів із Retrieve Data Source або Query Data Source.

Create Database приймає повний об'єкт запиту з endpoint Notion Create a database. Він
повинен містити `parent` і може містити `title`, `description`, `is_inline`,
`initial_data_source`, `icon` та `cover`. Наприклад:

```json
{
  "parent": {
    "type": "page_id",
    "page_id": "$input.parentPageId"
  },
  "title": [
    {
      "type": "text",
      "text": {
        "content": "Tasks"
      }
    }
  ],
  "initial_data_source": {
    "properties": {
      "Name": {
        "title": {}
      }
    }
  }
}
```

Update Database приймає об'єкт запиту endpoint оновлення, зокрема `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` та `is_locked`. Поля Database ID приймають
необроблений ID, повний URL-адрес Notion або вираз.

Використовуйте **Retrieve Data Source**, щоб отримати схему `properties` джерела даних перед побудовою
об'єкта properties для Create Page. **Create Data Source** вимагає батьківський об'єкт бази даних і
непорожню схему `properties`. **Update Data Source** приймає непорожній об'єкт запиту, який підтримує
відповідний endpoint Notion.

Наприклад, створення джерела даних у наявній базі даних:

```json
{
  "parent": {
    "type": "database_id",
    "database_id": "$input.databaseId"
  },
  "properties": {
    "Name": {
      "title": {}
    },
    "Status": {
      "status": {}
    }
  }
}
```

Селектори Data Source та Parent Page підтримують серверний пошук із коротким debounce та
курсорною пагінацією **Load more**. Використовуйте **Refresh** після надання доступу до нового ресурсу в Notion.
Перемкніться на **Use expression**, щоб ввести вираз, необроблений ID або URL-адресу.

Фільтри пошуку зі старіших посібників, які використовують
`{"property":"object","value":"database"}`, транслюються до поточного значення `data_source`.
Нові workflow мають використовувати `data_source` або `page` безпосередньо.

Append Blocks підтримує позиції **Start**, **End** та **After Block**. Create Page та Append
Blocks автоматично розбивають понад 100 дочірніх елементів верхнього рівня на впорядковані запити, щоб задовольнити
обмеження Notion на один запит.

Запити з обмеженням частоти (`429` або `529`) повторюються до трьох разів. Heym дотримується
заголовка `Retry-After` Notion, обмежує кожне очікування 10 секундами та додає рандомізований jitter. Запити Notion
використовують спільний для всього процесу пул HTTP-з'єднань між сторінками та вузлами workflow.
## Обмеження Notion API

- Одне значення rich-text `text.content` може містити щонайбільше 2 000 символів. Розділяйте довший текст
  на кілька об'єктів rich-text.
- Notion обмежує кількість дочірніх блоків верхнього рівня до 100 на один запит. Heym об'єднує більші масиви Children,
  але кожен окремий блок усе одно має відповідати обмеженням payload Notion.
- API приймає щонайбільше два рівні вкладеності дочірніх блоків в одному запиті. Створюйте глибші
  структури за допомогою подальших операцій Append Blocks.
- Payload запитів обмежено 1 000 блокових елементів та 500 КБ загалом.

## Пагінація

Search, Query Data Source та Get Block Children приймають розмір сторінки від 1 до 100 та необов'язковий
початковий курсор. Встановіть розмір сторінки `0`, щоб автоматично дотримуватися курсорів і об'єднати всі результати, аж до
захисного ліміту вузла у 10 000 результатів.

## Налаштування облікових даних

Виберіть один із варіантів налаштування в діалозі облікових даних (**Internal token** або **OAuth**):

- **Internal token:** Створіть внутрішню інтеграцію, скопіюйте її token у Heym, а потім надайте спільний доступ
  до кожної потрібної сторінки або джерела даних для цієї інтеграції. Скористайтеся **Test Connection**, щоб перевірити доступ.
- **OAuth:** Створіть публічну інтеграцію Notion і зареєструйте
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback` у Notion. У діалозі облікових даних Heym
  виберіть **OAuth**, введіть Client ID та Client Secret інтеграції, а потім натисніть **Connect**, щоб
  авторизувати робочий простір. Секрет зберігається у зашифрованому вигляді разом з обліковими даними й не розміщується в
  OAuth state чи конфігурації середовища. Після авторизації облікові дані показують
  назву підключеного робочого простору (`connected (Workspace Name)`). Облікові дані з незавершеною авторизацією OAuth показують
  `Not connected`.

Якщо залишити поле internal token порожнім під час редагування, збережений token буде збережено.

Для користувацьких запитів [HTTP](../nodes/http-node.md) `$credentials.YourNotionCredential` розв'язується в
той самий bearer token, який використовує вузол Notion (internal token або OAuth access token).

## Примітки щодо версії API

Heym фіксує запити Notion на версії API `2026-03-11`. Ця версія використовує:

- батьківські елементи `data_source_id` та endpoint-и `/data_sources` замість застарілих шляхів запитів до баз даних
- `in_trash` замість `archived` для операцій переміщення сторінок до кошика/відновлення
- об'єкти `position` (`start`, `end`, `after_block`) для Append Block Children

Під час міграції старіших прикладів автоматизації Notion:

- Замініть посилання на батьківські елементи/запити баз даних на ID джерел даних з **Retrieve Database** або
  засобу вибору джерела даних у редакторі
- Замініть `archived: true` на `in_trash: true`
- Замініть параметри append `after` на поле **Append Position** вузла

Фільтри пошуку, які досі використовують значення об'єкта `database`, автоматично нормалізуються до `data_source`.

## Пов'язане

- [Облікові дані](../reference/credentials.md)
- [Сторонні інтеграції](../reference/integrations.md)
- [Типи вузлів](../reference/node-types.md)
