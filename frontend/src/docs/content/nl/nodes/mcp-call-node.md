# MCP Call-node

De **MCP Call**-node roept een specifieke [Model Context Protocol (MCP)](https://modelcontextprotocol.io)-tool rechtstreeks aan, zonder dat een LLM bepaalt welke tool moet worden aangeroepen. Gebruik deze node wanneer u precies weet welke tool u wilt aanroepen en een deterministische uitvoering in één stap wenst.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.result` |

## Wanneer te gebruiken

Gebruik de MCP Call-node wanneer:
- U op ontwerptijd precies weet welke MCP-tool u wilt aanroepen
- U geen LLM nodig hebt om tussen tools te kiezen
- U een lichtgewicht, deterministisch alternatief voor een agent-node wenst voor één enkele toolaanroep

Gebruik in plaats daarvan de [Agent-node](./agent-node.md) wanneer een LLM moet beslissen welke tools worden aangeroepen of wanneer u redenering in meerdere stappen nodig hebt.

> De MCP Call-node **kan niet** als tool worden verbonden met een agent-node.

## Verbindingsconfiguratie

De node maakt verbinding met één MCP-server. Kies een transport en vul de bijbehorende velden in.

### SSE / Streamable HTTP

| Veld | Beschrijving |
|-------|-------------|
| `transport` | `sse` of `streamable_http` |
| `url` | Volledige URL van de MCP-server (bijv. `https://mcp.example.com/sse`). Ondersteunt DSL-expressies. |
| `headers` | JSON-object met HTTP-headers (bijv. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Time-out per verbinding in seconden (standaard: 30) |

### stdio

| Veld | Beschrijving |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Uitvoerbaar bestand om te starten (bijv. `npx`) |
| `args` | JSON-array met argumenten (bijv. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | JSON-object met omgevingsvariabelen (bijv. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Time-out per verbinding in seconden (standaard: 30) |

## Toolselectie

1. Vul de verbindingsvelden in.
2. Klik op **Fetch Tools** — de node maakt verbinding met de MCP-server en toont de beschikbare tools.
3. Selecteer een tool in de vervolgkeuzelijst.

**Toolselectie is verplicht.** De node wordt niet uitgevoerd zonder een geselecteerde tool.

## Argumenten

Nadat een tool is geselecteerd, toont de node één invoerveld per argument dat is gedefinieerd in het invoerschema van de tool. Elk veld accepteert:
- Een statische waarde: `10`
- Een DSL-expressie: `$userInput.body.text`

Verplichte argumenten zijn gemarkeerd met `*`.

## Uitvoer

| Veld | Beschrijving |
|-------|-------------|
| `$nodeLabel.result` | Toolresultaat. Als de respons geldige JSON is, is dit een geparseerd object. Anders is het een tekenreeks. |

## Voorbeeld

Roep een `search`-tool aan op een SSE MCP-server en geef de query van de gebruiker door:

```json
{
  "type": "mcpCall",
  "data": {
    "label": "searchCall",
    "connection": {
      "transport": "sse",
      "url": "https://mcp.example.com/sse",
      "timeoutSeconds": 30
    },
    "selectedTool": "search",
    "toolArguments": {
      "query": "$userInput.body.text",
      "limit": "10"
    },
    "timeoutSeconds": 30
  }
}
```

Toegang tot het resultaat in de vervolgstappen:

```
$searchCall.result.items   ← als het resultaat een JSON-object is
$searchCall.result         ← als het resultaat een gewone tekenreeks is
```

## Opmerkingen

- De node verwerkt DSL-expressies in `url`, `headers`, `env` en alle waarden van `toolArguments` voordat de tool wordt aangeroepen.
- De `timeoutSeconds` op het niveau van de node geldt voor de algehele uitvoering; de `connection.timeoutSeconds` geldt voor de MCP-sessie zelf.
- Als de MCP-server niet beschikbaar is of een fout retourneert, mislukt de node en is het foutbericht beschikbaar in de workflow-trace.
