# HTTP

**HTTP**-noden utför HTTP-förfrågningar med cURL-syntax. Den kan fungera som startpunkt för ett workflow (utan inkommande kant) eller ta emot indata från uppströms noder.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 0 eller 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|------|-------------|
| `label` | string | Nodidentifierare (camelCase) |
| `curl` | string | cURL-kommando (t.ex. `curl -X GET https://api.example.com`) |

## Svarsformat

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Åtkomst till svar

- `$httpNode.status` – HTTP-statuskod
- `$httpNode.body` – Svarskropp (sträng eller parsad JSON)
- `$httpNode.body.fieldName` – Åtkomst till JSON-fält
- `$httpNode.headers` – Svarshuvuden

## Exempel

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Använd cURL-syntax med `-H` för huvuden, `-d` för POST-kropp, etc. Uttryck kan användas var som helst i curl-strängen, inklusive i URL:en, ett huvud eller en hel huvudrad. En [Header-autentiseringsuppgift](../reference/credentials.md) löses upp till `key: value`, så `-H "$credentials.MyApiKey"` skickar hela huvudet:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Citattecken och mellanslag inuti ett uttryck tillhör uttrycket, inte cURL-kommandot, så metoder som tar strängargument fungerar direkt i raden:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autentisering med autentiseringsuppgifter

`$credentials.Name` löses upp till ett annat värde för varje [autentiseringsuppgiftstyp](../reference/credentials.md), så huvudraden beror på typen:

| Autentiseringsuppgiftstyp | `$credentials.Name` löses upp till | Huvud |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Den råa API-nyckeln | `-H "Authorization: Bearer $credentials.Name"` |
| Google | Den råa API-nyckeln | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | Den råa API-nyckeln | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | En färsk OAuth-åtkomsttoken, förnyad när den upphör | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Token | `-H "Authorization: Bearer $credentials.Name"` |

En Bearer-autentiseringsuppgift innehåller redan prefixet `Bearer `, så att lägga till ytterligare ett skickar `Bearer Bearer …`. Autentiseringsuppgifter för Google Sheets och Google Drive gör det möjligt att anropa Google API:er som deras nod inte täcker, till exempel att lägga till en flik i ett kalkylblad, inom de behörigheter som autentiseringsuppgiften beviljats. När ett namn inte är en vanlig identifierare (det innehåller `-`, börjar med en siffra eller är ett reserverat ord), använd hakparentesformen: `-H "Authorization: $credentials["my-api-key"]"`.

När [AI-assistenten](../reference/ai-assistant.md) eller [Chat](../tabs/chat-tab.md) bygger en HTTP-förfrågan som kräver autentisering och ingen dedikerad nod täcker tjänsten, frågar den vilken autentiseringsuppgift som ska användas. Välj en, ändra det förifyllda huvudnamnet om API:et förväntar sig ett annat, och den skriver huvudraden åt användaren. Assistenten ser autentiseringsuppgifternas namn och typer, aldrig deras värden. Om ingen passande autentiseringsuppgift finns erbjuder frågan att skapa en. Hemligheter som når nodens utdata, såsom det skickade `request.headers`, maskeras i körningsresultat.

## Egress-säkerhet

- Som standard måste URL:en använda `http://` eller `https://` och endast matcha offentliga adresser. Loopback-, privata, link-local-, multicast- och molnmetadata-destinationer blockeras.
- Heym validerar de upplösta adresserna och fäster anslutningsmålet för att förhindra DNS-rebinding. Miljöproxies är inaktiverade medan skyddet är aktivt. Omdirigeringar följs inte som standard; lägg till cURL:s `-L`-alternativ för att följa dem. När det är aktiverat kontrolleras varje omdirigeringshopp mot samma policy för offentliga adresser och fästs innan anslutning.
- Betrodda självhostade distributioner som avsiktligt ansluter till interna tjänster kan ange `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Behåll standardvärdet på hostade eller multi-tenant-distributioner.

**Uppgraderingsnotis för v0.0.105:** denna instansövergripande policy skyddar nu även autentiseringsuppgiftshärledda destinationer som används av Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, anpassad LLM-körning och modellupptäckt, AI-assistenten, guardrails och RAG-embeddings. Befintliga autentiseringsuppgifter som pekar på loopback-, privata eller link-local-adresser avvisas om inte `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` är aktiverat på en betrodd självhostad instans. Medan skyddet är på ignoreras `HTTP_PROXY` och `HTTPS_PROXY` av skyddade HTTP-klienter; att aktivera opt-out återställer dem. Operatörs-CA-paket konfigurerade via `SSL_CERT_FILE` eller `SSL_CERT_DIR` stöds fortfarande. ClickHouse kontrolleras innan anslutningen öppnas men fästs inte vid uppringningstidpunkten, eftersom clickhouse-connect har sin egen urllib3-transport.

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Triggers](../reference/triggers.md) – HTTP som workflow-startpunkt
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till API-nycklar för autentiserade förfrågningar
