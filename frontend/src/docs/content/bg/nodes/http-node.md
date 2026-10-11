# HTTP

**HTTP** node-ът изпълнява HTTP заявки чрез cURL синтаксис. Той може да служи като начална точка на workflow (без входящо ребро) или да получава входни данни от предходни възли.

## Общ преглед

| Свойство | Стойност |
|----------|-------|
| Входове | 0 или 1 |
| Изходи | 1 |
| Изход | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Параметри

| Параметър | Тип | Описание |
|-----------|------|-------------|
| `label` | string | Идентификатор на node (camelCase) |
| `curl` | string | cURL команда (напр. `curl -X GET https://api.example.com`) |

## Формат на отговора

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Достъп до отговора

- `$httpNode.status` – HTTP код на състоянието
- `$httpNode.body` – Тяло на отговора (низ или парсиран JSON)
- `$httpNode.body.fieldName` – Достъп до JSON полета
- `$httpNode.headers` – Заглавки на отговора

## Пример

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Използвайте cURL синтаксис с `-H` за заглавки, `-d` за POST тяло и т.н. Изрази могат да се използват навсякъде в curl низа, включително в URL адреса, в заглавка или в цял ред на заглавка. [Header credential](../reference/credentials.md) се разрешава до `key: value`, така че `-H "$credentials.MyApiKey"` изпраща пълната заглавка:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Кавичките и интервалите в израза принадлежат на израза, а не на cURL командата, така че методи, които приемат низови аргументи, работят inline:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Удостоверяване с Удостоверения

`$credentials.Name` се разрешава до различна стойност за всеки тип [credential](../reference/credentials.md), така че редът на заглавката зависи от типа:

| Тип на удостоверение | `$credentials.Name` се разрешава до | Заглавка |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Суровият API ключ | `-H "Authorization: Bearer $credentials.Name"` |
| Google | Суровият API ключ | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | Суровият API ключ | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Нов OAuth access token, обновяван при изтичане | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Token-ът | `-H "Authorization: Bearer $credentials.Name"` |

Bearer удостоверението вече съдържа префикса `Bearer `, така че добавянето на още един изпраща `Bearer Bearer …`. Удостоверенията за Google Sheets и Google Drive Ви позволяват да извиквате Google API, които техният node не покрива, като например добавяне на раздел към електронна таблица, в рамките на обхватите, предоставени на удостоверението. Когато името не е обикновен идентификатор (съдържа `-`, започва с цифра или е запазена дума), използвайте формата с квадратни скоби: `-H "Authorization: $credentials["my-api-key"]"`.

Когато [AI Assistant](../reference/ai-assistant.md) или [Chat](../tabs/chat-tab.md) изгражда HTTP заявка, която изисква удостоверяване и нито един специализиран node не покрива услугата, той пита кое удостоверение да се използва. Изберете едно, променете предварително попълненото име на заглавката, ако API очаква различно, и той ще напише реда на заглавката вместо Вас. Асистентът вижда имената и типовете на удостоверенията, но никога техните стойности. Ако нямате подходящо удостоверение, въпросът предлага да създадете такова. Тайните, които достигат до изхода на node-а, като например изпратените `request.headers`, са маскирани в резултатите от изпълнението.

## Egress Safety

- По подразбиране URL адресът трябва да използва `http://` или `https://` и да се разрешава само до публични адреси. Loopback, частни, link-local, multicast и cloud-metadata дестинации са блокирани.
- Heym валидира разрешените адреси и фиксира целта на връзката, за да предотврати DNS rebinding. Прокситата от средата са деактивирани, докато защитата е активна. Пренасочванията не се следват по подразбиране; добавете опцията `-L` на cURL, за да ги следвате. Когато е активирано, всяко прескачане при пренасочване се проверява спрямо същата политика за публични адреси и се фиксира преди свързване.
- Доверени self-hosted среди, които умишлено се свързват с вътрешни услуги, могат да зададат `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Запазете стойността по подразбиране при hosted или multi-tenant среди.

**Бележка за надграждане до v0.0.105:** тази политика за цялата инстанция вече защитава и дестинации, произлизащи от удостоверения, използвани от Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, custom LLM изпълнение и откриване на модели, AI асистента, guardrails и RAG embeddings. Съществуващи удостоверения, които сочат към loopback, частни или link-local адреси, се отхвърлят, освен ако `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` не е активирано на доверена self-hosted инстанция. Докато защитата е включена, защитените HTTP клиенти игнорират `HTTP_PROXY` и `HTTPS_PROXY`; активирането на opt-out ги възстановява. Operator CA bundles, конфигурирани чрез `SSL_CERT_FILE` или `SSL_CERT_DIR`, остават поддържани. ClickHouse се проверява преди отваряне на връзката, но не се фиксира по време на свързване, тъй като clickhouse-connect използва собствен urllib3 транспорт.

## Свързани

- [Node Types](../reference/node-types.md) – Общ преглед на всички типове node
- [Triggers](../reference/triggers.md) – HTTP като входна точка на workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Добавяне на API ключове за удостоверени заявки
