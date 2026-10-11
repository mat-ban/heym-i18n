# Notion

**Notion** node управлява бази данни, източници на данни, страници и блокове чрез Notion API.

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Удостоверение | Вътрешен integration token или Notion OAuth |
| Версия на API | `2026-03-11` |

Колекциите в стил база данни на Notion използват **data source IDs** в текущите версии на API. Споделете всяка страница или източник на данни, от които workflow-ът се нуждае, с integration-а преди стартиране на node-а.
Полетата за ресурси приемат или суров Notion ID, или пълен Notion URL. URL адресите се нормализират до вградения си resource ID преди заявката към API.

## Операции

| Операция | Задължителни полета | Основен изход |
|-----------|-----------------|-------------|
| Search | Незадължителни query/filter/sort | `.results`, `.count`, `.next_cursor` |
| Get Page | Page ID | `.page` |
| Create Page | Data Source ID или Parent Page ID, Properties | `.page`, `.id`, `.url` |
| Update Page | Page ID, едно от Properties/Icon/Cover | `.page` |
| Move Page to Trash | Page ID | `.page` |
| Restore Page | Page ID | `.page` |
| Create Database | Database request с `parent` | `.database`, `.id`, `.url` |
| Retrieve Database | Database ID | `.database` |
| Update Database | Database ID, непразен database request | `.database`, `.id`, `.url` |
| Create Data Source | Data source request с `parent` и непразен `properties` | `.data_source`, `.id`, `.url` |
| Retrieve Data Source | Data Source | `.data_source` |
| Update Data Source | Data Source ID, непразен data source request | `.data_source`, `.id`, `.url` |
| Query Data Source | Data Source ID | `.results`, `.count`, `.next_cursor` |
| Get Block Children | Block или Page ID | `.results`, `.count`, `.next_cursor` |
| Update Block | Block ID, block update object | `.block` |
| Delete Block | Block ID | `.block` |
| Append Blocks | Block или Page ID, Children | `.results`, `.count` |

Всички операции също връщат `.success` и `.operation`.

## JSON полета

Полетата Database Request, Data Source Request, Properties, Children, Filter, Sort, Sorts, Icon и Cover приемат
Notion API JSON. Изразите вътре в JSON низовете се разрешават преди заявката. Едно поле може също
да бъде един самостоятелен израз, който се разрешава директно до необходимия обект или масив, като например
`$input.database`, `$input.properties` или `$input.children`.

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

За съдържание на страница или блок, Children е масив от Notion block objects:

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

## Бази данни и източници на данни

В текущия Notion API **базата данни** е контейнер, а **източникът на данни** съдържа схемата на свойствата
и редовете, които могат да бъдат заявявани. Retrieve Database връща списъка `data_sources` на базата данни; използвайте един от
тези ID-та с Retrieve Data Source или Query Data Source.

Create Database приема пълния request object от endpoint-а Create a database на Notion. Той
трябва да съдържа `parent` и може да съдържа `title`, `description`, `is_inline`,
`initial_data_source`, `icon` и `cover`. Например:

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

Update Database приема request object на update endpoint-а, включително `parent`, `title`,
`description`, `is_inline`, `icon`, `cover`, `in_trash` и `is_locked`. Полетата Database ID приемат
суров ID, пълен Notion URL или израз.

Използвайте **Retrieve Data Source**, за да извлечете схемата `properties` на източника на данни, преди да изградите
обект за свойства на Create Page. **Create Data Source** изисква родителски database object и
непразна схема `properties`. **Update Data Source** приема непразен request object, поддържан
от съответния Notion endpoint.

Например, създайте източник на данни в съществуваща база данни:

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

Селекторите Data Source и Parent Page поддържат server-side търсене с кратко debounce и
пагинация, базирана на cursor, чрез **Load more**. Използвайте **Refresh**, след като споделите нов ресурс в Notion.
Превключете на **Use expression**, за да въведете израз, суров ID или URL.

Search филтри от по-стари уроци, които използват
`{"property":"object","value":"database"}`, се преобразуват до текущата стойност `data_source`.
Новите workflow-и трябва да използват директно `data_source` или `page`.

Append Blocks поддържа позиции **Start**, **End** и **After Block**. Create Page и Append
Blocks автоматично разделят повече от 100 top-level children на подредени заявки, за да се спази
ограничението на Notion за заявка.

Заявките с ограничена честота (`429` или `529`) се опитват отново до три пъти. Heym спазва
header-а `Retry-After` на Notion, ограничава всяко изчакване до 10 секунди и добавя рандомизиран jitter. Notion заявките
споделят process-wide HTTP connection pool между страници и workflow nodes.
## Ограничения на Notion API

- Една стойност на rich-text `text.content` може да съдържа най-много 2 000 знака. Разделяйте по-дългия текст на няколко rich-text обекта.
- Notion ограничава децата на блок от най-горно ниво до 100 на заявка. Heym групира по-големи масиви от деца (Children arrays), но всеки отделен блок трябва да отговаря на ограниченията за payload на Notion.
- API приема най-много две нива на вложени деца на блок в една заявка. Създавайте по-дълбоки структури с последващи операции Append Blocks.
- Payload-ите на заявките са ограничени до 1 000 блока и 500 KB общо.

## Пагинация

Search, Query Data Source и Get Block Children приемат размер на страницата от 1 до 100 и незадължителен начален курсор. Задайте размер на страницата `0`, за да следвате курсорите автоматично и да обедините всички резултати, до предпазния лимит от 10 000 резултата на node.

## Настройка на удостоверения

Изберете една от двете настройки в диалога за удостоверения (**Internal token** или **OAuth**):

- **Internal token:** Създайте вътрешна интеграция, копирайте token-а ѝ в Heym, след което споделете всяка необходима страница или източник на данни с интеграцията. Използвайте **Test Connection**, за да проверите достъпа.
- **OAuth:** Създайте публична Notion интеграция и регистрирайте `{FRONTEND_URL}/api/credentials/notion/oauth/callback` в Notion. В диалога за удостоверения на Heym изберете **OAuth**, въведете Client ID и Client Secret на интеграцията, след което натиснете **Connect**, за да оторизирате работно пространство. Secret-ът се съхранява криптиран заедно с удостоверението и не се поставя в OAuth state или в конфигурацията на средата. След оторизация удостоверението показва името на свързаното работно пространство (`connected (Workspace Name)`). Удостоверенията с чакащ OAuth показват `Not connected`.

Ако оставите полето за internal token празно, докато редактирате, съхраненият token се запазва.

За персонализирани [HTTP](../nodes/http-node.md) заявки `$credentials.YourNotionCredential` се разрешава до същия bearer token, който използва Notion node (internal token или OAuth access token).

## Бележки за версията на API

Heym фиксира заявките към Notion към версия на API `2026-03-11`. Тази версия използва:

- `data_source_id` родители и `/data_sources` endpoint-и вместо наследените пътища за заявки към бази данни
- `in_trash` вместо `archived` за операции по изтриване/възстановяване на страници
- `position` обекти (`start`, `end`, `after_block`) за Append Block Children

При мигриране на по-стари примери за Notion автоматизация:

- Заменете препратките към родител/заявка на база данни с data source ID-та от **Retrieve Database** или от избора на източник на данни в редактора
- Заменете `archived: true` с `in_trash: true`
- Заменете параметрите `after` при добавяне с полето **Append Position** на node

Филтрите за търсене, които все още използват стойност на обект `database`, се нормализират автоматично до `data_source`.

## Свързани

- [Удостоверения](../reference/credentials.md)
- [Интеграции с трети страни](../reference/integrations.md)
- [Типове node](../reference/node-types.md)
