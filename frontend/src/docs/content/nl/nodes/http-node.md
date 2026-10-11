# HTTP

De **HTTP**-node voert HTTP-verzoeken uit met behulp van cURL-syntaxis. Deze kan dienen als startpunt van een workflow (geen inkomende edge) of invoer ontvangen van upstream-nodes.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 0 of 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `label` | string | Node-identificatie (camelCase) |
| `curl` | string | cURL-commando (bijv. `curl -X GET https://api.example.com`) |

## Antwoordformaat

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Toegang tot het antwoord

- `$httpNode.status` – HTTP-statuscode
- `$httpNode.body` – Antwoordbody (string of geparseerde JSON)
- `$httpNode.body.fieldName` – Toegang tot JSON-velden
- `$httpNode.headers` – Antwoordheaders

## Voorbeeld

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Gebruik cURL-syntaxis met `-H` voor headers, `-d` voor POST-body, enz. Expressies kunnen overal in de curl-string worden gebruikt, inclusief de URL, een header of een volledige headerregel. Een [Header-referentie](../reference/credentials.md) wordt omgezet naar `key: value`, dus `-H "$credentials.MyApiKey"` verzendt de volledige header:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Aanhalingstekens en spaties binnen een expressie behoren tot de expressie, niet tot het cURL-commando, dus methoden die string-argumenten aannemen werken inline:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Authenticeren met referenties

`$credentials.Name` wordt omgezet naar een andere waarde voor elk [referentietype](../reference/credentials.md), dus de headerregel is afhankelijk van het type:

| Referentietype | `$credentials.Name` wordt omgezet naar | Header |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | De onbewerkte API-sleutel | `-H "Authorization: Bearer $credentials.Name"` |
| Google | De onbewerkte API-sleutel | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | De onbewerkte API-sleutel | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Een nieuw OAuth-toegangstoken, vernieuwd wanneer het verloopt | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Het token | `-H "Authorization: Bearer $credentials.Name"` |

Een Bearer-referentie bevat al het voorvoegsel `Bearer `, dus het toevoegen van nog een voorvoegsel verzendt `Bearer Bearer …`. Met Google Sheets- en Google Drive-referenties kunt u Google API's aanroepen die hun node niet dekt, zoals het toevoegen van een tabblad aan een spreadsheet, binnen de scopes die aan de referentie zijn toegekend. Wanneer een naam geen gewone identificatie is (deze bevat `-`, begint met een cijfer of is een gereserveerd woord), gebruik dan de haakjesnotatie: `-H "Authorization: $credentials["my-api-key"]"`.

Wanneer de [AI Assistant](../reference/ai-assistant.md) of [Chat](../tabs/chat-tab.md) een HTTP-verzoek opstelt dat authenticatie vereist en geen speciale node de service dekt, wordt gevraagd welke referentie te gebruiken. Kies er een, wijzig de vooraf ingevulde headernaam als de API een andere verwacht, en de headerregel wordt voor u geschreven. De assistant ziet referentienamen en -typen, nooit hun waarden. Als u geen passende referentie heeft, biedt de vraag aan er een aan te maken. Secrets die de uitvoer van de node bereiken, zoals de verzonden `request.headers`, worden gemaskeerd in uitvoeringsresultaten.

## Egress-beveiliging

- Standaard moet de URL `http://` of `https://` gebruiken en alleen naar openbare adressen verwijzen. Loopback-, privé-, link-local-, multicast- en cloud-metadata-bestemmingen zijn geblokkeerd.
- Heym valideert de omgezette adressen en pint het verbindingsdoel vast om DNS-rebinding te voorkomen. Omgevingsproxy's zijn uitgeschakeld terwijl de beveiliging actief is. Redirects worden standaard niet gevolgd; voeg de `-L`-optie van cURL toe om ze te volgen. Indien ingeschakeld, wordt elke redirect-hop gecontroleerd tegen hetzelfde openbare-adressenbeleid en vastgepind voordat er verbinding wordt gemaakt.
- Vertrouwde self-hosted implementaties die bewust verbinding maken met interne services kunnen `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` instellen. Behoud de standaardwaarde op gehoste of multi-tenant implementaties.

**Upgrade-opmerking voor v0.0.105:** dit instance-brede beleid beschermt nu ook bestemmingen die zijn afgeleid van referenties en die worden gebruikt door Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, aangepaste LLM-uitvoering en modeldetectie, de AI-assistant, guardrails en RAG-embeddings. Bestaande referenties die naar loopback-, privé- of link-local-adressen verwijzen, worden geweigerd tenzij `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` is ingeschakeld op een vertrouwde self-hosted instantie. Terwijl de beveiliging actief is, negeren beveiligde HTTP-clients `HTTP_PROXY` en `HTTPS_PROXY`; het inschakelen van de opt-out herstelt deze. Operator-CA-bundels die zijn geconfigureerd via `SSL_CERT_FILE` of `SSL_CERT_DIR` blijven ondersteund. ClickHouse wordt gecontroleerd voordat de verbinding wordt geopend, maar wordt niet vastgepind op het moment van verbinden, omdat clickhouse-connect zijn eigen urllib3-transport meebrengt.

## Gerelateerd

- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Triggers](../reference/triggers.md) – HTTP als workflow-startpunt
- [Referenties-tabblad](../tabs/credentials-tab.md) – API-sleutels toevoegen voor geauthenticeerde verzoeken
