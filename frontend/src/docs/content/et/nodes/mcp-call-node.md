# MCP Call sõlm

**MCP Call** sõlm kutsub otse välja konkreetse [Model Context Protocol (MCP)](https://modelcontextprotocol.io) tööriista, ilma et LLM otsustaks, millist tööriista kasutada. Kasutage seda, kui teate täpselt, millist tööriista kutsuda, ja soovite deterministlikku üheastmelist täitmist.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.result` |

## Millal kasutada

Kasutage MCP Call sõlme, kui:
- Teate täpselt, millist MCP tööriista disaini ajal kutsuda
- Te ei vaja LLM-i, et tööriistade vahel valida
- Soovite kerget, deterministlikku alternatiivi agent-sõlmele ühe tööriista kutsumiseks

Kasutage selle asemel [Agent sõlme](./agent-node.md), kui LLM peaks otsustama, milliseid tööriistu kutsuda, või kui vajate mitmeastmelist arutlemist.

> MCP Call sõlme **ei saa** ühendada agent-sõlmega tööriistana.

## Ühenduse konfiguratsioon

Sõlm ühendub ühe MCP serveriga. Valige transport ja täitke vastavad väljad.

### SSE / Streamable HTTP

| Väli | Kirjeldus |
|-------|-------------|
| `transport` | `sse` või `streamable_http` |
| `url` | MCP serveri täielik URL (nt `https://mcp.example.com/sse`). Toetab DSL-avaldisi. |
| `headers` | HTTP päiste JSON-objekt (nt `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Ühendusepõhine aegumine sekundites (vaikeväärtus: 30) |

### stdio

| Väli | Kirjeldus |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Käivitatav programm (nt `npx`) |
| `args` | Argumentide JSON-massiiv (nt `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | Keskkonnamuutujate JSON-objekt (nt `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Ühendusepõhine aegumine sekundites (vaikeväärtus: 30) |

## Tööriista valimine

1. Täitke ühenduse väljad.
2. Klõpsake **Fetch Tools** — sõlm ühendub MCP serveriga ja loetleb saadaolevad tööriistad.
3. Valige rippmenüüst tööriist.

**Tööriista valimine on kohustuslik.** Sõlm ei käivitu ilma valitud tööriistata.

## Argumendid

Pärast tööriista valimist kuvab sõlm iga tööriista sisendskeemis määratletud argumendi jaoks ühe sisestusvälja. Iga väli aktsepteerib:
- Staatilist väärtust: `10`
- DSL-avaldist: `$userInput.body.text`

Kohustuslikud argumendid on tähistatud tärniga `*`.

## Väljund

| Väli | Kirjeldus |
|-------|-------------|
| `$nodeLabel.result` | Tööriista tulemus. Kui vastus on kehtiv JSON, on see parsitud objekt. Vastasel juhul on see string. |

## Näide

Kutsuge `search` tööriista SSE MCP serveril, edastades kasutaja päringu:

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

Juurdepääs tulemusele allavoolu:

```
$searchCall.result.items   ← kui tulemus on JSON-objekt
$searchCall.result         ← kui tulemus on lihtne string
```

## Märkused

- Sõlm lahendab DSL-avaldised väljades `url`, `headers`, `env` ja kõigis `toolArguments` väärtustes enne tööriista kutsumist.
- Sõlme tasemel olev `timeoutSeconds` kehtib üldisele täitmisele; `connection.timeoutSeconds` kehtib MCP sessioonile endale.
- Kui MCP server ei ole kättesaadav või tagastab vea, siis sõlm ebaõnnestub ja veateade on saadaval workflow käivituse jäljes.
