# Webhooks

Workflows lze spouštět prostřednictvím HTTP webhooků. Standardní endpoint pro spuštění vrací JSON, zatímco streamovací varianta vrací Server-Sent Events (SSE).

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Nahraďte `{workflow_id}` UUID daného workflow. Základní URL je vaše instance Heym (např. `https://app.heym.ai`).

## Metoda požadavku

Každé workflow přijímá jedno HTTP sloveso, které se volí v dialogu cURL v editoru: `GET`, `POST`, `PUT` nebo `DELETE`. **Výchozí je `POST`** a každé workflow vytvořené před existencí tohoto nastavení si jej zachovává, takže se nic, co dnes funguje, nemění.

Zavolání workflow s jiným slovesem vrátí `405 Method Not Allowed` s hlavičkou `Allow` uvádějící nakonfigurované sloveso:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Jedna výjimka: požadavky nesoucí `?test_run=true` kontrolu přeskakují. To je to, co odesílá tlačítko **Run** v editoru a panel ladění, takže workflow nastavené na `GET` zůstává testovatelné zevnitř produktu.

### Metody bez těla

`GET` a `DELETE` nenesou žádné tělo požadavku. Vstupy místo toho přicházejí z query stringu a čtou se pomocí `$input.query.<name>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

Dialog cURL pro tyto dvě metody skrývá editor těla požadavku a odstraňuje hlavičku `Content-Type`.

Zkombinujte `GET` s [HTML output mapper](../nodes/html-output-mapper-node.md) pro obsluhu stránky, kterou může prohlížeč otevřít přímo.

## Streamovací endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Streamovací endpoint použijte, když chcete přírůstkové události spuštění namísto jediné odpovědi JSON. Protokol událostí a konfiguraci zprávy o spuštění jednotlivých uzlů najdete v části [SSE Streaming](./sse-streaming.md).

## Formát požadavku

Tělo požadavku se předává jako `body` do uzlů [Input](../nodes/input-node.md). Heym přijímá oba tvary požadavku:

- **Raw JSON** – např. `{"userId": "123", "action": "create"}`
- **Zabalený formát** – `{"inputs": {...}, "test_run": false}`

Při použití zabaleného formátu se `inputs` extrahuje a předá jako `body`. `test_run` obchází rate limiting a cache odpovědí. Při odesílání raw JSON můžete také poslat `?test_run=true` jako query parametr.

## Režimy těla požadavku

Každé workflow má nastavení `webhook_body_mode`, které řídí, jak editor sestavuje ukázkové požadavky:

| Režim | Chování |
|------|----------|
| **defined** | Editor a dialog cURL tvarují ukázkové tělo z polí uzlu Input daného workflow a zachovávají prázdné klíče v JSON payloadu. Stávající cURL payloady ve stylu defined fungují dál. |
| **generic** | Editor a dialog cURL používají volně tvarované tělo JSON. Tělo požadavku se předává tak, jak je, aby externí aplikace mohly posílat svůj vlastní pevný tvar payloadu. |

API pro spuštění zůstává v obou režimech zpětně kompatibilní. Raw JSON i zabalené požadavky `{ "inputs": ... }` jsou tak jako tak stále přijímány.

Hlavičky a query parametry jsou ve výrazech dostupné jako `$input.headers` a `$input.query`. Klíče hlaviček jsou převedeny na malá písmena.

## Autentizace

Konfiguruje se pro každé workflow v editoru (nastavení workflow). Autentizace se kontroluje před spuštěním.

| auth_type | Chování |
|-----------|----------|
| **anonymous** | Není vyžadována autentizace. Endpoint může volat kdokoli. |
| **jwt** | Vyžaduje se Bearer token. Přijímá buď token uživatelské relace (uživatel musí mít přístup k workflow), nebo scoped [Execution Token](./execution-tokens.md) vytvořený pro toto workflow. |
| **header_auth** | Vlastní hlavička musí odpovídat. Nastavte `auth_header_key` (např. `X-API-Key`) a `auth_header_value`. |

Pro `header_auth` musí hodnota hlavičky požadavku přesně odpovídat nakonfigurované hodnotě. Uživatelé JWT s přístupem k workflow mohou volat také bez vlastní hlavičky.

Pro `jwt` jsou [Execution Tokens](./execution-tokens.md) doporučeným způsobem volání workflow z externích systémů — jsou vázány na jediné workflow a lze je nezávisle odvolat.

## Cache odpovědí

Konfigurujte `cache_ttl_seconds` pro každé workflow. Je-li nastaveno a větší než 0:

- **Klíč cache**: SHA256 hash `workflow_id` + `body` + `query`
- **Zásah do cache**: Okamžitě vrátí `status: "cached"` a cachované výstupy
- **Uložení do cache**: Pouze po úspěšném spuštění (`status: "success"`)
- **Úložiště**: Postgres-backed a sdílené mezi backendovými workery

| Nastavení | Účinek |
|---------|--------|
| `cache_ttl_seconds` = 0 nebo null | Cachování vypnuto |
| `cache_ttl_seconds` > 0 | Odpovědi cachovány po tento počet sekund |

Požadavky `test_run` obcházejí cache (žádné čtení, žádný zápis).

Je-li v dialogu cURL povoleno cachování odpovědí, **Clear cache** okamžitě odstraní cachované odpovědi aktuálního workflow.

## Rate Limiting

Konfigurujte pro každé workflow: `rate_limit_requests` a `rate_limit_window_seconds`.

- **Rozsah**: Podle `workflow_id` + IP klienta (klouzavé okno)
- **Překročení**: HTTP 429 s hlavičkou `Retry-After`
- **Hlavičky**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Nastavení | Popis |
|---------|-------------|
| `rate_limit_requests` | Maximální počet požadavků povolených v okně |
| `rate_limit_window_seconds` | Délka okna v sekundách |

Požadavky `test_run` obcházejí rate limiting.
## Formát odpovědi

Endpoint vrací JSON:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Pole | Popis |
|-------|-------------|
| `workflow_id` | UUID Workflow |
| `status` | `success`, `error`, `cached` nebo `rate_limited` |
| `outputs` | Výstupy koncových uzlů. Pokud je jediným koncovým uzlem jediný [JSON output mapper](../nodes/json-output-mapper-node.md), tělem odpovědi je tento mapovaný objekt na nejvyšší úrovni (výchozí jednoduché JSON odpovědi). V opačném případě obsahuje [Output](../nodes/output-node.md) a další koncové uzly klíčované podle popisku. |
| `execution_time_ms` | Doba provádění v milisekundách (0 pro cached/rate_limited) |

V případě chyby může `outputs` obsahovat podrobnosti o chybě. Uzel [Throw Error](../nodes/throw-error-node.md) může nastavit vlastní HTTP stavový kód (4xx/5xx).

## Dialog Spustit s cURL

Tlačítko na panelu nástrojů **Spustit s cURL** (vpravo nahoře v editoru, ikona `cURL`) otevře dialog, který sestaví a zkopíruje připravený příkaz cURL pro aktuální workflow.

### Co dělá

| Pole | Popis |
|-------|-------------|
| **Režim těla požadavku** | Zvolte **Defined** nebo **Generic**. Generic zachová tělo jako surový JSON namísto jeho formování z polí Input. |
| **Autentizace** | Zvolte Anonymous, JWT Token nebo Header Auth. Nastaví správnou autentizační hlavičku v příkazu. Při výběru JWT Token dialog zobrazí správce [Execution Token](./execution-tokens.md) – vytvořte nebo vyberte token, který bude vložen přímo do příkazu. |
| **Klíč / hodnota hlavičky** | Zobrazí se, když je vybráno Header Auth. Předvyplněno z nastavení autentizace workflow. |
| **Cache odpovědí** | Počet minut pro cachování identických odpovědí (0 = zakázáno). Změny se ukládají do workflow. Je-li povoleno, **Vymazat cache** okamžitě odstraní cachované odpovědi. |
| **Rate Limit** | Maximální počet požadavků za časové okno. Změny se ukládají do workflow. |
| **SSE Streaming** | Přepne příkaz na `/execute/stream`, přidá `--no-buffer` a zpřístupní nastavení zpráv `node_start` pro jednotlivé uzly. |
| **Tělo** | Tělo požadavku JSON. V režimu Defined je předvyplněno z polí [Input](../nodes/input-node.md) a zachovává prázdné klíče. V režimu Generic se jedná o editor surového JSON. |
| **Příkaz** | Náhled úplného příkazu cURL pouze pro čtení. |

Kliknutím na **Kopírovat cURL** zkopírujete příkaz do schránky.

### Příklad

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

V režimu Generic zůstávají vnořené payloady nedotčené, například:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Dialog zrcadlí nastavení autentizace, režimu těla, cachování a rate-limitu uložená ve workflow – jejich úpravou zde okamžitě aktualizujete workflow.

### SSE Streaming v dialogu

Povolte **SSE Streaming**, pokud chcete, aby generovaný příkaz sledoval provádění v reálném čase z vašeho terminálu.

- Endpoint se změní z `/execute` na `/execute/stream`
- Příkaz přidá `--no-buffer` a `Accept: text/event-stream`
- Každý nesticky uzel se objeví v seznamu, kde můžete:
  - povolit nebo zakázat zprávu `node_start`
  - přizpůsobit text úvodní zprávy
- Události `node_complete` jsou vždy vysílány a obsahují úplný výstup uzlu

Příklad:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Kompletní protokol událostí a příklady naleznete v [SSE Streaming](./sse-streaming.md).

## Označování zdroje Triggeru

Každé spuštění ukládá popisek `trigger_source` viditelný v [Execution History](./execution-history.md). Nastavte jej odesláním hlavičky `X-Trigger-Source` s libovolnou hodnotou dle vašeho výběru:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Tlačítko **Kopírovat cURL** v dialogu editoru automaticky zahrnuje `X-Trigger-Source: API`. Můžete nahradit `API` čímkoli smysluplným – `scheduler`, `rabbitmq`, `github-actions` atd.

Pokud hlavička není odeslána, `trigger_source` má výchozí hodnotu `"API"` a spuštění je v historii označeno jako **API**. Přepište ji libovolnou hodnotou smysluplnou pro váš systém – `scheduler`, `github-actions`, `rabbitmq` atd.

## Související

- [Execution Tokens](./execution-tokens.md) – Scoped JWT pro volání workflow z externích systémů
- [SSE Streaming](./sse-streaming.md) – Streamujte události uzlů v reálném čase prostřednictvím Server-Sent Events
- [Triggers](./triggers.md) – Všechny vstupní body workflow včetně webhooku
- [Workflow Structure](./workflow-structure.md) – Uzly a hrany
- [Expression DSL](./expression-dsl.md) – Přístup k `$input.body`, `$input.headers`, `$input.query`
