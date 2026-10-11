# HTTP

**HTTP**-noden udfører HTTP-forespørgsler ved hjælp af cURL-syntaks. Den kan fungere som startpunkt for et workflow (uden indgående edge) eller modtage input fra opstrømsnoder.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 0 eller 1 |
| Outputs | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `label` | string | Node-identifikator (camelCase) |
| `curl` | string | cURL-kommando (f.eks. `curl -X GET https://api.example.com`) |

## Responsformat

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Adgang til respons

- `$httpNode.status` – HTTP-statuskode
- `$httpNode.body` – Respons-body (string eller parsed JSON)
- `$httpNode.body.fieldName` – Adgang til JSON-felter
- `$httpNode.headers` – Respons-headers

## Eksempel

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

cURL-syntaks kan anvendes med `-H` for headers, `-d` for POST-body osv. Udtryk kan bruges hvor som helst i cURL-strengen, inklusive URL'en, en header eller en hel headerlinje. En [Header-legitimationsoplysning](../reference/credentials.md) oversættes til `key: value`, så `-H "$credentials.MyApiKey"` sender den komplette header:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Anførselstegn og mellemrum inden for et udtryk tilhører udtrykket, ikke cURL-kommandoen, så metoder, der tager strengargumenter, fungerer inline:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autentificering med legitimationsoplysninger

`$credentials.Name` oversættes til en forskellig værdi for hver [legitimationsoplysningstype](../reference/credentials.md), så headerlinjen afhænger af typen:

| Legitimationsoplysningstype | `$credentials.Name` oversættes til | Header |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Den rå API-nøgle | `-H "Authorization: Bearer $credentials.Name"` |
| Google | Den rå API-nøgle | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | Den rå API-nøgle | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Et friskt OAuth-access-token, der fornyes, når det udløber | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Token'et | `-H "Authorization: Bearer $credentials.Name"` |

En Bearer-legitimationsoplysning indeholder allerede `Bearer `-præfikset, så tilføjelse af en ekstra sender `Bearer Bearer …`. Google Sheets- og Google Drive-legitimationsoplysninger giver mulighed for at kalde Google-API'er, som noden ikke dækker, f.eks. tilføjelse af en fane til et regneark, inden for de scopes, som legitimationsoplysningen er tildelt. Hvis et navn ikke er en almindelig identifikator (det indeholder `-`, starter med et tal eller er et reserveret ord), kan bracket-formen bruges: `-H "Authorization: $credentials["my-api-key"]"`.

Når [AI-assistenten](../reference/ai-assistant.md) eller [Chat](../tabs/chat-tab.md) opretter en HTTP-forespørgsel, der kræver autentificering, og ingen dedikeret node dækker servicen, spørges der, hvilken legitimationsoplysning der skal bruges. Vælg en, ændr det forudfyldte headernavn, hvis API'et forventer et andet, og den skriver headerlinjen for brugeren. Assistenten ser legitimationsoplysningernes navne og typer, aldrig deres værdier. Hvis der ikke findes en passende legitimationsoplysning, tilbydes det at oprette en. Hemmeligheder, der når nodens output, f.eks. de sendte `request.headers`, maskeres i kørselsresultaterne.

## Egress-sikkerhed

- Som standard skal URL'en bruge `http://` eller `https://` og kun opløses til offentlige adresser. Loopback, private, link-local, multicast og cloud-metadata-destinationer blokeres.
- Heym validerer de opløste adresser og pinner forbindelsesmålet for at forhindre DNS-rebinding. Miljøproxier deaktiveres, mens beskyttelsen er aktiv. Omdirigeringer følges ikke som standard; tilføj cURL's `-L`-option for at følge dem. Når aktiveret, kontrolleres hvert omdirigeringshop mod den samme offentlige-adressepolitik og pinnes før forbindelse.
- Pålidelige selvhostede installationer, der med vilje forbinder til interne tjenester, kan sætte `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Bevar standardindstillingen på hostede eller multi-tenant-installationer.

**Opgraderingsnote til v0.0.105:** Denne instansvide politik beskytter nu også legitimationsoplysningsafledte destinationer, der bruges af Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, brugerdefineret LLM-udførelse og modelopdagelse, AI-assistenten, guardrails og RAG-embeddinger. Eksisterende legitimationsoplysninger, der peger på loopback-, private eller link-local-adresser, afvises, medmindre `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` er aktiveret på en pålidelig selvhostet instans. Mens beskyttelsen er aktiv, ignorerer beskyttede HTTP-klienter `HTTP_PROXY` og `HTTPS_PROXY`; aktivering af opt-out-genopretter dem. Operatør-CA-bundler konfigureret via `SSL_CERT_FILE` eller `SSL_CERT_DIR` forbliver understøttet. ClickHouse kontrolleres før forbindelsen åbnes, men pinnes ikke ved dial-tid, da clickhouse-connect medbringer sit eget urllib3-transport.

## Relateret

- [Nodetyper](../reference/node-types.md) – Oversigt over alle nodetyper
- [Triggers](../reference/triggers.md) – HTTP som workflow-indgangspunkt
- [Legitimationsoplysninger-fanen](../tabs/credentials-tab.md) – Tilføj API-nøgler til autentificerede forespørgsler
