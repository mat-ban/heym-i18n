# RAG / Vector Store

Възелът **RAG / Vector Store** вмъква, upsert-ва, изтрива и търси документи във векторно хранилище за Retrieval Augmented Generation (RAG). Използвайте го, за да обогатявате контекста на LLM с подходящи документи и да поддържате този контекст в синхрон със системата, от която идват документите.

Възелът разполага с падащо меню **Database**, което избира backend-а:

- **Qdrant** – съхранява вектори във външен Qdrant сървър (изисква удостоверение *RAG: Qdrant + OpenAI*).
- **Postgres (pgvector)** – съхранява вектори в собствената Postgres база данни на Heym, без външна услуга (изисква удостоверение *RAG: Psql + OpenAI*).

По подразбиране е избран **Qdrant** за обратна съвместимост. Промяната на Database филтрира списъка **Vector Store** до хранилищата, поддържани от тази база данни. И двата backend-а поддържат едни и същи операции, филтриране по метаданни, хибридно търсене (векторно + BM25) и Cohere reranking.

До всеки от двата backend-а може да се достигне и чрез удостоверение *RAG: Custom Embeddings*, което
заменя OpenAI с всеки OpenAI-съвместим embedding endpoint и именува собствено векторно
хранилище. Хранилище, създадено от такова удостоверение, се появява под съответната Database, към
която е насочено. Вижте [Custom Embeddings](../reference/integrations.md#custom-embeddings-rag).

## Преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.results` / `$nodeLabel.reranked` / `$nodeLabel.hybrid` / `$nodeLabel.count` (search), `$nodeLabel.point_id` (insert, upsert), `$nodeLabel.deleted` (delete) |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `dbType` | `"qdrant"` \| `"pgvector"` | Backend на векторното хранилище (по подразбиране: `"qdrant"`) |
| `vectorStoreId` | UUID | Векторно хранилище от раздела [Vectorstores](../tabs/vectorstores-tab.md) |
| `ragOperation` | `"insert"` \| `"upsert"` \| `"delete"` \| `"search"` | Тип операция (също `operation`) |
| `documentContent` | expression | Текст на документа за съхранение (insert, upsert) |
| `documentMetadata` | JSON string | Метаданни за съхраняваните документи (insert, upsert); стойностите поддържат expressions |
| `documentIdField` | string | Payload поле, съдържащо уникалния id (upsert, delete; по подразбиране `doc_id`) |
| `documentId` | expression | Стойност на уникалния id (upsert, delete) |
| `queryText` | expression | Заявка за търсене (само search) |
| `searchLimit` | number | Максимален брой резултати (по подразбиране: 5) |
| `metadataFilters` | JSON string | Филтри по метаданни за търсене (стойностите поддържат expressions) |
| `hybridSearch` | boolean | Комбиниране на векторно търсене с BM25 търсене по ключови думи (само search; по подразбиране: изключено) |
| `enableReranker` | boolean | Използване на Cohere за reranking на резултатите от търсенето |
| `rerankerCredentialId` | UUID | Cohere удостоверение за reranking |
| `rerankerTopN` | number | Брой топ резултати, които да се запазят след reranking |

## Операции

### Insert

Добавя документи във векторното хранилище.

| Поле | Задължително | Описание |
|-------|----------|-------------|
| `documentContent` | да | Текст за embedding и съхранение |
| `documentMetadata` | не | JSON обект, напр. `{"source": "user", "category": "general"}` |

**Изход:** `$nodeLabel.status`, `$nodeLabel.inserted_ids`

### Expressions в метаданните

Стойностите на метаданните приемат expressions, така че документ може да бъде съхранен с контекст от изпълнението:

```json
{ "url": "$start.url", "category": "faq" }
```

Expressions се разрешават след парсването на JSON-а, а не чрез заместване на текст в него, така че
стойност, съдържаща кавичка или нов ред, не може да разкъса обекта. Стойност, която е едно
цяло expression, запазва разрешения си тип — `{"count": "$start.count"}` съхранява число, а не
`"7"` — което е от значение, тъй като `metadataFilters` при търсене съвпадат по точен тип. Смесен текст като
`"page $start.count"` се разрешава до низ, а вложените обекти и масиви също се обхождат.

Същото важи за `upsert` и за `metadataFilters` при търсене: първо се парсва, а стойностите му се
разрешават след това, по същите правила. Така филтър, записан като `{"count": "$start.count"}`,
съвпада с числото, което insert е съхранил, а не с низа `"7"`.

### Кой workflow е съхранил даден документ

Документ, съхранен без собствен `source`, се маркира с workflow-а, който го е съхранил,
като `source: "workflow:<workflow name>"`. Разделът [Vectorstores](../tabs/vectorstores-tab.md)
групира тези под **Added workflow: _name_**, така че съдържанието на едно хранилище показва откъде
идва всеки документ и документите на един workflow могат да бъдат изтрити като група. Задаването на `source` сами
в `documentMetadata` винаги има предимство пред маркировката.

### Upsert

Вмъква документ или заменя вече съхранения под същия уникален id.

Id-то е поле **вътре в payload-а**, а не вътрешният point id на хранилището, така че документът
запазва идентификатора, който собствената Ви система вече използва — id на CRM запис, SKU, slug на страница.
`documentIdField` именува това поле, а `documentId` носи неговата стойност.

| Поле | Задължително | Описание |
|-------|----------|-------------|
| `documentId` | да | Уникален id на документа (поддържа expressions) |
| `documentContent` | да | Текст за embedding и съхранение |
| `documentIdField` | не | Payload поле, в което се намира id-то (по подразбиране `doc_id`) |
| `documentMetadata` | не | JSON обект, напр. `{"source": "crm", "url": "$start.url"}` (стойностите поддържат expressions) |

Всички points, чието id поле съвпада, се премахват първо, така че документ, който преди е бил
съхранен като няколко chunk-а, се заменя като цяло, вместо да се дублира. Id полето се
записва в payload-а вместо Вас, а point id-то остава стабилно при upsert-ове на същия
документ.

**Изход:** `$nodeLabel.point_id`, `$nodeLabel.document_id`, `$nodeLabel.replaced` (boolean —
дали е заменена съществуваща версия), `$nodeLabel.replaced_count`
### Изтриване

Премахва документ по същия уникален идентификатор.

| Поле | Задължително | Описание |
|-------|----------|-------------|
| `documentId` | да | Уникален идентификатор на документа (поддържа изрази) |
| `documentIdField` | не | Payload поле, в което се намира идентификаторът (по подразбиране `doc_id`) |

**Изход:** `$nodeLabel.deleted` – `true`, когато поне една точка е съвпаднала, `false`, когато идентификаторът
не е бил в хранилището. `$nodeLabel.deleted_count` показва колко точки са премахнати.

Изтриването на идентификатор, който не съществува, не е грешка: node завършва успешно с `deleted: false`, така че
клон за почистване не се нуждае от предпазна проверка пред себе си.

### Търсене

Семантично търсене на подобни документи.

| Поле | Задължително | Описание |
|-------|----------|-------------|
| `queryText` | да | Заявка за търсене |
| `searchLimit` | не | Максимален брой резултати (по подразбиране: 5) |
| `metadataFilters` | не | Филтриране по метаданни (JSON обект за точно съвпадение, стойностите поддържат изрази) |
| `hybridSearch` | не | Обединяване на векторно сходство с BM25 съвпадение по ключови думи (вижте [Хибридно търсене](#hibridno-tarsene)) |
| `enableReranker` | не | Активиране на Cohere reranking за по-добра релевантност |
| `rerankerCredentialId` | при reranking | Cohere удостоверение |
| `rerankerTopN` | не | Краен брой резултати след reranking |

**Изход:** `$nodeLabel.results` – масив от `{ id, text, score, metadata }`

Когато reranking е активиран:

- `$nodeLabel.reranked` става `true`
- Всеки резултат също включва `relevance_score`
- `score` остава оригиналният резултат за векторно сходство
- `relevance_score` е резултатът от Cohere reranker


#### Хибридно търсене

Векторното търсене намира текст, който има същото значение като заявката. Текст, който съдържа само точните думи, може да се класира по-ниско: код на продукт, номер на тикет, име на човек, грешка като `ERR-4021`. Включете **Хибридно търсене** и възелът ще изпълни търсене по ключови думи успоредно с векторното търсене и ще обедини двата списъка, така че една заявка да намери и двата вида съвпадения.

1. Векторното търсене връща най-добрите си съвпадения, точно както прави без хибридно търсене.
2. Търсенето по ключови думи оценява съхранения текст спрямо думите от заявката с **BM25**, което възнаграждава редки думи, повторени думи и по-кратки документи.
3. Двата класирани списъка се обединяват чрез **reciprocal rank fusion**. Документ в горната част на двата списъка се класира на първо място, а документ, намерен само от единия списък, все пак се появява.

Филтрите по метаданни се прилагат и за двете търсения, а Cohere reranker, когато е активиран, работи върху обединения списък.

Всеки резултат носи оценката от двете търсения:

| Поле | Значение |
|------|----------|
| `score` | Обединена оценка от 0 до 1. `1` означава, че документът се е класирал на първо място и в двете търсения. |
| `vector_score` | Векторно сходство (от 0 до 1). `null`, когато само търсенето по ключови думи е намерило документа. |
| `keyword_score` | BM25 оценка. `null`, когато нито една от думите в заявката не се появява в документа. |

`$nodeLabel.hybrid` е `true`, когато е изпълнено хибридно търсене.

Полезно е да знаете:

- Обединеният `score` класира резултатите един спрямо друг. Това не е векторно сходство, така че праг, настроен за обикновено търсене, не се пренася пряко.
- Думите в заявката се преобразуват в малки букви и се разделят по интервали и пунктуация, така че `ERR-4021` се търси като `err` и `4021`. Търсенето по ключови думи използва до първите 16 уникални думи от заявката.
- Qdrant: първото хибридно търсене в колекция изгражда пълнотекстов индекс върху полето за payload `text`, което изисква ключ за Qdrant с права за запис. При големи колекции това отнема момент само веднъж; последващите търсения преизползват индекса.
- Postgres (pgvector): миграцията на базата данни `142_vsi_text_search_index` добавя пълнотекстовия индекс. Изпълнете `alembic upgrade head` след обновяване. Хибридното търсене работи и без индекса, но по-бавно при големи хранилища.
- За всяка заявка търсенето по ключови думи чете до 200 съвпадащи документа, започвайки от най-редките думи в заявката, тъй като те носят най-голяма тежест.
## Достъп до резултати

- `$ragNode.results.first().text` – съдържание на най-добрия резултат
- `$ragNode.results.first().score` – резултат за сходство (0–1), или обединеният резултат при хибридно търсене
- `$ragNode.results.first().keyword_score` – BM25 резултат (хибридно търсене)
- `$ragNode.results.first().vector_score` – векторно сходство (хибридно търсене)
- `$ragNode.results.first().metadata.source` – метаданни на най-добрия резултат
- `$ragNode.results.map("item.text").join("\n\n")` – конкатениране за LLM контекст
- `$ragNode.reranked` – дали е приложен reranking
- `$ragNode.hybrid` – дали е приложено хибридно търсене
- `$ragNode.count` – брой върнати резултати
- `$ragNode.replaced` – дали upsert е заменил съществуващ документ
- `$ragNode.deleted` – дали изтриване е премахнало нещо

## Пример – Търсене

```json
{
  "type": "rag",
  "data": {
    "label": "searchDocs",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "search",
    "queryText": "$userInput.body.text",
    "searchLimit": 5,
    "metadataFilters": "{\"category\": \"faq\"}",
    "enableReranker": true,
    "rerankerCredentialId": "cohere-credential-uuid",
    "rerankerTopN": 5
  }
}
```

## Пример – Хибридно търсене

```json
{
  "type": "rag",
  "data": {
    "label": "findTicket",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "search",
    "queryText": "$userInput.body.text",
    "searchLimit": 5,
    "hybridSearch": true
  }
}
```

## Пример – Вмъкване

```json
{
  "type": "rag",
  "data": {
    "label": "insertDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "insert",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"user_input\"}"
  }
}
```

## Пример – Upsert

```json
{
  "type": "rag",
  "data": {
    "label": "syncDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "upsert",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id",
    "documentContent": "$userInput.body.text",
    "documentMetadata": "{\"source\": \"crm\"}"
  }
}
```

## Пример – Изтриване

```json
{
  "type": "rag",
  "data": {
    "label": "removeDoc",
    "vectorStoreId": "vector-store-uuid",
    "ragOperation": "delete",
    "documentIdField": "doc_id",
    "documentId": "$userInput.body.id"
  }
}
```

## Свързани

- [Защо Heym](../getting-started/why-heym.md) – Вградена RAG като част от средата за изпълнение на агенти
- [Типове nodes](../reference/node-types.md) – Преглед на всички типове nodes
- [Раздел Векторни хранилища](../tabs/vectorstores-tab.md) – Създаване и управление на векторни хранилища
- [Интеграции с трети страни](../reference/integrations.md#qdrant) – Настройка на удостоверения за Qdrant и Postgres (pgvector)
- [Agent Node](./agent-node.md) – Използване на RAG резултати като контекст за агента
- [LLM Node](./llm-node.md) – Подаване на RAG резултати към системния prompt на LLM
