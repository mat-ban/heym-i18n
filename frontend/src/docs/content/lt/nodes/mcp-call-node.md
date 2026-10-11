# MCP Call mazgas

**MCP Call** mazgas tiesiogiai kviečia konkretų [Model Context Protocol (MCP)](https://modelcontextprotocol.io) įrankį, be LLM sprendimo, kurį įrankį naudoti. Naudokite jį, kai tiksliai žinote, kurį įrankį kviečiate ir norite deterministinio, vieno žingsnio vykdymo.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.result` |

## Kada Naudoti

Naudokite MCP Call mazgą, kai:
- Tiksliai žinote, kurį MCP įrankį kviečiate projektavimo metu
- Jums nereikia, kad LLM pasirinktų tarp įrankių
- Norite lengvo, deterministinio alternatyvos agento mazgui vienam įrankio kvietimui

Naudokite [Agent mazgą](./agent-node.md) vietoj to, kai LLM turėtų nuspręsti, kuriuos įrankius kvieti, arba kai reikia daugiapakopio mąstymo.

> MCP Call mazgas **negali** būti prijungtas prie agento mazgo kaip įrankis.

## Ryšio Konfigūracija

Mazgas jungiasi prie vieno MCP serverio. Pasirinkite transportą ir užpildykite atitinkamus laukus.

### SSE / Streamable HTTP

| Laukas | Aprašymas |
|--------|-----------|
| `transport` | `sse` arba `streamable_http` |
| `url` | Pilnas MCP serverio URL (pvz., `https://mcp.example.com/sse`). Palaiko DSL išraiškas. |
| `headers` | JSON objektas su HTTP antraštėmis (pvz., `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Laikas per ryšį sekundėmis (numatytas: 30) |

### stdio

| Laukas | Aprašymas |
|--------|-----------|
| `transport` | `stdio` |
| `command` | Vykdomasis failas (pvz., `npx`) |
| `args` | JSON masyvas su argumentais (pvz., `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | JSON objektas su aplinkos kintamaisiais (pvz., `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Laikas per ryšį sekundėmis (numatytas: 30) |

## Įrankio Pasirinkimas

1. Užpildykite ryšio laukus.
2. Paspauskite **Fetch Tools** — mazgas prisijungs prie MCP serverio ir išvardins prieinamus įrankius.
3. Pasirinkite įrankį iš išskleidžiamojo sąrašo.

**Įrankio pasirinkimas yra privalomas.** Mazgas neįvykdys be pasirinkto įrankio.

## Argumentai

Pasirinkus įrankį, mazgas pateikia vieną įvesties lauką kiekvienam argumentui, apibrėžtam įrankio įvesties schemoje. Kiekvienas laukas priima:
- Statinę vertę: `10`
- DSL išraišką: `$userInput.body.text`

Privalomi argumentai pažymėti `*`.

## Išvestis

| Laukas | Aprašymas |
|--------|-----------|
| `$nodeLabel.result` | Įrankio rezultatas. Jei atsakymas yra galiojantis JSON, tai yra išanalizuotas objektas. Priešingu atveju tai yra eilutė. |

## Pavyzdys

Kviečiame `search` įrankį SSE MCP serveryje, perduodant vartotojo užklausą:

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

Pasiekite rezultatą žemiau:

```
$searchCall.result.items   ← jei rezultatas yra JSON objektas
$searchCall.result         ← jei rezultatas yra paprasta eilutė
```

## Pastabos

- Mazgas išsprendžia DSL išraiškas `url`, `headers`, `env` ir visų `toolArguments` reikšmėse prieš kviesdamas įrankį.
- `timeoutSeconds` mazgo lygyje taikomas bendrai vykdymui; `connection.timeoutSeconds` taikomas pačiai MCP sesijai.
- Jei MCP serveris yra neprieinamas arba grąžina klaidą, mazgas nepavyksta, o klaidos pranešimas yra prieinamas darbo eigos atsekime.
