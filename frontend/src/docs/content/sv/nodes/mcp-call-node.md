# MCP Call-nod

**MCP Call**-noden anropar ett specifikt [Model Context Protocol (MCP)](https://modelcontextprotocol.io)-verktyg direkt, utan att en LLM avgör vilket verktyg som ska anropas. Den används när det är känt exakt vilket verktyg som ska anropas och deterministisk körning i ett enda steg önskas.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.result` |

## När noden ska användas

Använd MCP Call-noden när:
- Det är känt exakt vilket MCP-verktyg som ska anropas vid designtillfället
- En LLM inte behöver välja mellan verktyg
- Ett lättviktigt, deterministiskt alternativ till en agentnod önskas för ett enskilt verktygsanrop

Använd [Agent-noden](./agent-node.md) i stället när en LLM ska avgöra vilka verktyg som ska anropas, eller när resonemang i flera steg krävs.

> MCP Call-noden **kan inte** kopplas till en agentnod som ett verktyg.

## Konfiguration av anslutning

Noden ansluter till en enskild MCP-server. Välj en transport och fyll i motsvarande fält.

### SSE / Streamable HTTP

| Fält | Beskrivning |
|-------|-------------|
| `transport` | `sse` eller `streamable_http` |
| `url` | Fullständig URL till MCP-servern (t.ex. `https://mcp.example.com/sse`). Stöder DSL-uttryck. |
| `headers` | JSON-objekt med HTTP-headers (t.ex. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Timeout per anslutning i sekunder (standard: 30) |

### stdio

| Fält | Beskrivning |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Körbar fil som ska startas (t.ex. `npx`) |
| `args` | JSON-array med argument (t.ex. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | JSON-objekt med miljövariabler (t.ex. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Timeout per anslutning i sekunder (standard: 30) |

## Val av verktyg

1. Fyll i anslutningsfälten.
2. Klicka på **Fetch Tools** – noden ansluter till MCP-servern och listar tillgängliga verktyg.
3. Välj ett verktyg i listrutan.

**Val av verktyg är obligatoriskt.** Noden körs inte utan ett valt verktyg.

## Argument

När ett verktyg har valts visas ett inmatningsfält per argument som definieras i verktygets indataschema. Varje fält accepterar:
- Ett statiskt värde: `10`
- Ett DSL-uttryck: `$userInput.body.text`

Obligatoriska argument markeras med `*`.

## Utdata

| Fält | Beskrivning |
|-------|-------------|
| `$nodeLabel.result` | Verktygets resultat. Om svaret är giltig JSON är detta ett tolkat objekt. Annars är det en sträng. |

## Exempel

Anropa ett `search`-verktyg på en SSE MCP-server och skicka användarens fråga:

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

Åtkomst till resultatet nedströms:

```
$searchCall.result.items   ← om resultatet är ett JSON-objekt
$searchCall.result         ← om resultatet är en vanlig sträng
```

## Anmärkningar

- Noden löser upp DSL-uttryck i `url`, `headers`, `env` och alla värden i `toolArguments` innan verktyget anropas.
- `timeoutSeconds` på nodnivå gäller för den övergripande körningen; `connection.timeoutSeconds` gäller för själva MCP-sessionen.
- Om MCP-servern är otillgänglig eller returnerar ett fel misslyckas noden och felmeddelandet finns tillgängligt i workflow-spårningen.
