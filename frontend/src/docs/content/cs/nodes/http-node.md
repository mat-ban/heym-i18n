# HTTP

Uzel **HTTP** provádí HTTP požadavky pomocí syntaxe cURL. Může být vstupním bodem workflow (bez příchozí hrany) nebo přijímat vstup z předchozích uzlů.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 0 nebo 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzlu (camelCase) |
| `curl` | string | Příkaz cURL (např. `curl -X GET https://api.example.com`) |

## Formát odpovědi

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Přístup k odpovědi

- `$httpNode.status` – HTTP stavový kód
- `$httpNode.body` – Tělo odpovědi (řetězec nebo parsovaný JSON)
- `$httpNode.body.fieldName` – Přístup k polím JSON
- `$httpNode.headers` – Hlavičky odpovědi

## Příklad

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Použijte syntaxi cURL s `-H` pro hlavičky, `-d` pro tělo POST atd. Výrazy lze použít kdekoli v řetězci curl, včetně URL, hlavičky nebo celého řádku hlavičky. Přihlašovací údaj typu [Header](../reference/credentials.md) se přeloží na `key: value`, takže `-H "$credentials.MyApiKey"` odešle kompletní hlavičku:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Uvozovky a mezery uvnitř výrazu patří výrazu, nikoli příkazu cURL, takže metody přijímající řetězcové argumenty fungují inline:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autentizace pomocí přihlašovacích údajů

`$credentials.Name` se přeloží na jinou hodnotu pro každý typ [přihlašovacích údajů](../reference/credentials.md), takže řádek hlavičky závisí na typu:

| Typ přihlašovacích údajů | `$credentials.Name` se přeloží na | Hlavička |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Samotný API klíč | `-H "Authorization: Bearer $credentials.Name"` |
| Google | Samotný API klíč | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | Samotný API klíč | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Čerstvý OAuth access token, obnovený při vypršení platnosti | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Token | `-H "Authorization: Bearer $credentials.Name"` |

Přihlašovací údaj typu Bearer již obsahuje prefix `Bearer `, takže přidání dalšího odešle `Bearer Bearer …`. Přihlašovací údaje Google Sheets a Google Drive vám umožňují volat Google API, která jejich uzel nepokrývá, například přidání listu do tabulky, v rámci rozsahů, které byly přihlašovacím údajům uděleny. Pokud název není prostý identifikátor (obsahuje `-`, začíná číslicí nebo je rezervovaným slovem), použijte formu se závorkami: `-H "Authorization: $credentials["my-api-key"]"`.

Když [AI Assistant](../reference/ai-assistant.md) nebo [Chat](../tabs/chat-tab.md) sestaví HTTP požadavek vyžadující autentizaci a službu nepokrývá žádný vyhrazený uzel, zeptá se, které přihlašovací údaje použít. Vyberte jedny, změňte předvyplněný název hlavičky, pokud API očekává jiný, a asistent za vás napíše řádek hlavičky. Asistent vidí názvy a typy přihlašovacích údajů, nikdy jejich hodnoty. Pokud nemáte vhodné přihlašovací údaje, otázka nabídne jejich vytvoření. Tajné údaje, které se dostanou do výstupu uzlu, jako například odeslané `request.headers`, jsou ve výsledcích spuštění maskovány.

## Bezpečnost odchozího provozu

- Ve výchozím nastavení musí URL používat `http://` nebo `https://` a překládat se pouze na veřejné adresy. Cíle typu loopback, privátní, link-local, multicast a cloud-metadata jsou blokovány.
- Heym validuje přeložené adresy a připíná cíl připojení, aby zabránil DNS rebindingu. Proxy serveru prostředí jsou během aktivní ochrany zakázány. Přesměrování nejsou ve výchozím nastavení následována; přidejte volbu cURL `-L` pro jejich následování. Je-li povolena, každý krok přesměrování je zkontrolován proti stejné politice veřejných adres a před připojením připnut. 
- Důvěryhodná self-hosted nasazení, která záměrně komunikují s interními službami, mohou nastavit `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Na hostovaných nebo multi-tenant nasazeních ponechte výchozí nastavení.

**Poznámka k upgradu na v0.0.105:** tato politika platná pro celou instanci nyní chrání také cíle odvozené z přihlašovacích údajů používané službami Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, vlastním spouštěním LLM a objevováním modelů, AI asistentem, guardrails a RAG embeddings. Stávající přihlašovací údaje odkazující na loopback, privátní nebo link-local adresy jsou odmítnuty, pokud není na důvěryhodné self-hosted instanci povoleno `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Dokud je ochrana aktivní, chránění HTTP klienti ignorují `HTTP_PROXY` a `HTTPS_PROXY`; povolení výjimky je obnoví. CA balíčky operátora konfigurované prostřednictvím `SSL_CERT_FILE` nebo `SSL_CERT_DIR` zůstávají podporovány. ClickHouse je zkontrolován před otevřením připojení, ale není připnut v okamžiku navázání spojení, protože clickhouse-connect přináší vlastní transport urllib3.

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Triggers](../reference/triggers.md) – HTTP jako vstupní bod workflow
- [Záložka Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání API klíčů pro autentizované požadavky
