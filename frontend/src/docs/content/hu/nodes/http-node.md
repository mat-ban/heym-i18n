# HTTP

A **HTTP** csomópont cURL szintaxissal indít HTTP kéréseket. Lehet egy workflow kiindulópontja (nincs bejövő él), vagy fogadhat bemenetet a felsőbb csomópontoktól.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 0 vagy 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `label` | string | Csomópont-azonosító (camelCase) |
| `curl` | string | cURL parancs (pl. `curl -X GET https://api.example.com`) |

## Válasz formátuma

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## A válasz elérése

- `$httpNode.status` – HTTP állapotkód
- `$httpNode.body` – Válasz törzse (string vagy feldolgozott JSON)
- `$httpNode.body.fieldName` – JSON mezők elérése
- `$httpNode.headers` – Válasz fejlécek

## Példa

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Használja a cURL szintaxist `-H` kapcsolóval a fejlécekhez, `-d` kapcsolóval a POST törzséhez, stb. A kifejezések a curl string bármely részében használhatók, beleértve az URL-t, egy fejlécet vagy egy teljes fejlécsort. A [Header hitelesítési adat](../reference/credentials.md) `key: value` formára oldódik fel, így a `-H "$credentials.MyApiKey"` a teljes fejlécet küldi:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

A kifejezésen belüli idézőjelek és szóközök a kifejezéshez tartoznak, nem a cURL parancshoz, így a string argumentumokat fogadó metódusok inline működnek:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Hitelesítés hitelesítési adatokkal

A `$credentials.Name` minden [hitelesítési adat](../reference/credentials.md) típusnál más értékre oldódik fel, így a fejlécsor a típustól függ:

| Hitelesítési adat típusa | A `$credentials.Name` erre oldódik fel | Fejléc |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | A nyers API kulcs | `-H "Authorization: Bearer $credentials.Name"` |
| Google | A nyers API kulcs | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | A nyers API kulcs | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Egy friss OAuth access token, amely lejáratkor megújul | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | A token | `-H "Authorization: Bearer $credentials.Name"` |

A Bearer hitelesítési adat már tartalmazza a `Bearer ` előtagot, így egy újabb hozzáadása `Bearer Bearer …` küldését eredményezi. A Google Sheets és Google Drive hitelesítési adatok lehetővé teszik olyan Google API-k hívását, amelyeket a csomópontjuk nem fed le, például egy új lap hozzáadását egy táblázathoz, a hitelesítési adat számára megadott hatókörökön belül. Ha egy név nem egyszerű azonosító (tartalmaz `-` karaktert, számjeggyel kezdődik, vagy fenntartott szó), használja a zárójeles formát: `-H "Authorization: $credentials["my-api-key"]"`.

Amikor az [AI Assistant](../reference/ai-assistant.md) vagy a [Chat](../tabs/chat-tab.md) olyan HTTP kérést épít, amely hitelesítést igényel, és egyetlen dedikált csomópont sem fedi le a szolgáltatást, megkérdezi, melyik hitelesítési adatot használja. Válasszon egyet, módosítsa az előre kitöltött fejlécnevet, ha az API másikat vár, és megírja Önnek a fejlécsort. Az assistant látja a hitelesítési adatok nevét és típusát, de soha nem azok értékét. Ha nincs megfelelő hitelesítési adata, a kérdés felajánlja annak létrehozását. A csomópont kimenetére kerülő titkok, például az elküldött `request.headers`, a futtatási eredményekben maszkolva vannak.

## Kimenő forgalom biztonsága

- Alapértelmezés szerint az URL-nek `http://` vagy `https://` sémát kell használnia, és csak nyilvános címekre oldódhat fel. A loopback, privát, link-local, multicast és felhő-metaadat célpontok blokkolva vannak.
- A Heym ellenőrzi a feloldott címeket, és a DNS rebinding megelőzése érdekében a kapcsolat célpontját rögzíti. Az environment proxy-k le vannak tiltva, amíg a guard aktív. Az átirányítások alapértelmezés szerint nem követettek; adja hozzá a cURL `-L` kapcsolóját a követésükhöz. Ha engedélyezett, minden átirányítási ugrás ugyanazon nyilvános cím szabályzat alapján kerül ellenőrzésre, és a csatlakozás előtt rögzítésre kerül.
- A megbízható, saját üzemeltetésű telepítések, amelyek szándékosan belső szolgáltatásokhoz csatlakoznak, beállíthatják a `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` értéket. Tartsa meg az alapértelmezett beállítást hosztolt vagy multi-tenant telepítéseken.

**Frissítési megjegyzés a v0.0.105-höz:** ez az instance-szintű szabályzat mostantól védi a Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, egyedi LLM végrehajtás és modell-felfedezés, az AI assistant, a guardrails és a RAG embeddings által használt, hitelesítési adatokból származó célpontokat is. A loopback, privát vagy link-local címekre mutató meglévő hitelesítési adatok elutasításra kerülnek, kivéve, ha a `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` engedélyezett egy megbízható, saját üzemeltetésű instance-on. Amíg a guard be van kapcsolva, a védett HTTP kliensek figyelmen kívül hagyják a `HTTP_PROXY` és `HTTPS_PROXY` beállításokat; az opt-out engedélyezése visszaállítja azokat. Az `SSL_CERT_FILE` vagy `SSL_CERT_DIR` segítségével konfigurált operátor CA csomagok továbbra is támogatottak. A ClickHouse ellenőrzése a kapcsolat megnyitása előtt megtörténik, de a tárcsázás időpontjában nem kerül rögzítésre, mert a clickhouse-connect saját urllib3 transportot hoz magával.

## Kapcsolódó

- [Csomópont típusok](../reference/node-types.md) – Az összes csomópont típus áttekintése
- [Triggerek](../reference/triggers.md) – HTTP mint workflow belépési pont
- [Hitelesítési adatok fül](../tabs/credentials-tab.md) – API kulcsok hozzáadása hitelesített kérésekhez
