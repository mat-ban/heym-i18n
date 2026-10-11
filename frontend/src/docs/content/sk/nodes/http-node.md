# HTTP

Uzol **HTTP** vykonáva HTTP požiadavky pomocou syntaxe cURL. Môže byť vstupným bodom workflowu (bez prichádzajúcej hrany) alebo prijímať vstup z predchádzajúcich uzlov.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 0 alebo 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `label` | string | Identifikátor uzla (camelCase) |
| `curl` | string | Príkaz cURL (napr. `curl -X GET https://api.example.com`) |

## Formát odpovede

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Prístup k odpovedi

- `$httpNode.status` – HTTP stavový kód
- `$httpNode.body` – Telo odpovede (string alebo parsovaný JSON)
- `$httpNode.body.fieldName` – Prístup k poliam JSON
- `$httpNode.headers` – Hlavičky odpovede

## Príklad

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Použite syntax cURL s `-H` pre hlavičky, `-d` pre telo POST požiadavky atď. Výrazy je možné použiť kdekoľvek v reťazci curl, vrátane URL, hlavičky alebo celého riadku hlavičky. [Prihlasovací údaj](../reference/credentials.md) typu Header sa vyhodnotí na `key: value`, takže `-H "$credentials.MyApiKey"` odošle kompletnú hlavičku:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Úvodzovky a medzery vo vnútri výrazu patria výrazu, nie príkazu cURL, takže metódy prijímajúce reťazcové argumenty fungujú inline:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autentifikácia pomocou prihlasovacích údajov

`$credentials.Name` sa vyhodnotí na inú hodnotu pre každý typ [prihlasovacích údajov](../reference/credentials.md), takže riadok hlavičky závisí od typu:

| Typ prihlasovacích údajov | `$credentials.Name` sa vyhodnotí na | Hlavička |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Surový API kľúč | `-H "Authorization: Bearer $credentials.Name"` |
| Google | Surový API kľúč | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | Surový API kľúč | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Čerstvý OAuth access token, obnovený po vypršaní platnosti | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Token | `-H "Authorization: Bearer $credentials.Name"` |

Prihlasovací údaj typu Bearer už obsahuje predponu `Bearer `, takže pridanie ďalšej odošle `Bearer Bearer …`. Prihlasovacie údaje Google Sheets a Google Drive vám umožňujú volať Google API, ktoré ich uzol nepokrýva, napríklad pridanie hárka do tabuľky, v rámci rozsahov, ktoré boli prihlasovacím údajom udelené. Ak názov nie je jednoduchý identifikátor (obsahuje `-`, začína číslicou alebo je rezervovaným slovom), použite formu so zátvorkami: `-H "Authorization: $credentials["my-api-key"]"`.

Keď [AI asistent](../reference/ai-assistant.md) alebo [Chat](../tabs/chat-tab.md) zostavuje HTTP požiadavku, ktorá vyžaduje autentifikáciu a službu nepokrýva žiadny vyhradený uzol, opýta sa, ktoré prihlasovacie údaje použiť. Vyberte jedny, zmeňte predvyplnený názov hlavičky, ak API očakáva iný, a asistent za vás napíše riadok hlavičky. Asistent vidí názvy a typy prihlasovacích údajov, nikdy nie ich hodnoty. Ak nemáte vhodné prihlasovacie údaje, otázka ponúkne ich vytvorenie. Tajné údaje, ktoré sa dostanú do výstupu uzla, ako napríklad odoslané `request.headers`, sú vo výsledkoch spustenia maskované.

## Bezpečnosť odchádzajúcej komunikácie

- Predvolene musí URL používať `http://` alebo `https://` a prekladať sa iba na verejné adresy. Ciele typu loopback, privátne, link-local, multicast a cloud-metadata sú blokované.
- Heym validuje preložené adresy a pripína cieľ pripojenia, aby zabránil DNS rebindingu. Environmentálne proxy sú počas aktívnej ochrany zakázané. Presmerovania sa predvolene nenasledujú; pridajte možnosť `-L` príkazu cURL na ich nasledovanie. Ak je povolená, každý krok presmerovania sa kontroluje voči rovnakej politike verejných adries a pred pripojením sa pripne.
- Dôveryhodné self-hosted nasadenia, ktoré zámerne komunikujú s internými službami, môžu nastaviť `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Predvolené nastavenie ponechajte zapnuté v hostovaných alebo multi-tenant nasadeniach.

**Poznámka k aktualizácii na v0.0.105:** táto politika platná pre celú inštanciu teraz chráni aj ciele odvodené z prihlasovacích údajov, ktoré používajú Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, vlastné spúšťanie LLM a objavovanie modelov, AI asistent, guardrails a RAG embeddings. Existujúce prihlasovacie údaje, ktoré ukazujú na loopback, privátne alebo link-local adresy, sú odmietnuté, pokiaľ nie je na dôveryhodnej self-hosted inštancii povolené `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Kým je ochrana zapnutá, chránení HTTP klienti ignorujú `HTTP_PROXY` a `HTTPS_PROXY`; povolenie výnimky ich obnoví. CA balíky operátora nakonfigurované prostredníctvom `SSL_CERT_FILE` alebo `SSL_CERT_DIR` zostávajú podporované. ClickHouse sa kontroluje pred otvorením pripojenia, ale nepripína sa v čase nadviazania spojenia, pretože clickhouse-connect prináša vlastný urllib3 transport.

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Triggers](../reference/triggers.md) – HTTP ako vstupný bod workflowu
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridanie API kľúčov pre autentifikované požiadavky
