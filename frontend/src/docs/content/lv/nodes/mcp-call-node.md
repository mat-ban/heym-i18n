# MCP Call mezgls

**MCP Call** mezgls tieši izsauc konkrētu [Model Context Protocol (MCP)](https://modelcontextprotocol.io) rīku, bez LLM lēmuma par to, kuru rīku izsaukt. Izmantojiet to, ja precīzi zināt, kuru rīku izsaukt, un vēlaties deterministisku, vienpakāpes izpildi.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.result` |

## Kad izmantot

Izmantojiet MCP Call mezglu, ja:
- Projektēšanas laikā precīzi zināt, kuru MCP rīku izsaukt
- Nav nepieciešams LLM, lai izvēlētos starp rīkiem
- Vēlaties vieglu, deterministisku alternatīvu agent mezglam vienam rīka izsaukumam

Izmantojiet [Agent mezglu](./agent-node.md) tā vietā, ja LLM ir jāizlemj, kurus rīkus izsaukt, vai ja nepieciešama daudzpakāpju spriešana.

> MCP Call mezglu **nevar** pievienot agent mezglam kā rīku.

## Savienojuma konfigurācija

Mezgls savienojas ar vienu MCP serveri. Izvēlieties transportu un aizpildiet atbilstošos laukus.

### SSE / Streamable HTTP

| Lauks | Apraksts |
|-------|-------------|
| `transport` | `sse` vai `streamable_http` |
| `url` | Pilns MCP servera URL (piem., `https://mcp.example.com/sse`). Atbalsta DSL izteiksmes. |
| `headers` | HTTP galveņu JSON objekts (piem., `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Savienojuma noildze sekundēs (noklusējums: 30) |

### stdio

| Lauks | Apraksts |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Izpildāmais fails (piem., `npx`) |
| `args` | Argumentu JSON masīvs (piem., `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | Vides mainīgo JSON objekts (piem., `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Savienojuma noildze sekundēs (noklusējums: 30) |

## Rīka izvēle

1. Aizpildiet savienojuma laukus.
2. Noklikšķiniet uz **Fetch Tools** — mezgls savienojas ar MCP serveri un parāda pieejamos rīkus.
3. Izvēlieties rīku no nolaižamās izvēlnes.

**Rīka izvēle ir obligāta.** Mezgls neizpildīsies bez izvēlēta rīka.

## Argumenti

Pēc rīka izvēles mezgls parāda vienu ievades lauku katram argumentam, kas definēts rīka ievades shēmā. Katrs lauks pieņem:
- Statisku vērtību: `10`
- DSL izteiksmi: `$userInput.body.text`

Obligātie argumenti ir atzīmēti ar `*`.

## Izvade

| Lauks | Apraksts |
|-------|-------------|
| `$nodeLabel.result` | Rīka rezultāts. Ja atbilde ir derīgs JSON, tas ir parsēts objekts. Pretējā gadījumā tas ir virkne. |

## Piemērs

Izsauc `search` rīku SSE MCP serverī, nododot lietotāja vaicājumu:

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

Piekļūstiet rezultātam tālākajā plūsmā:

```
$searchCall.result.items   ← ja rezultāts ir JSON objekts
$searchCall.result         ← ja rezultāts ir vienkārša virkne
```

## Piezīmes

- Mezgls atrisina DSL izteiksmes `url`, `headers`, `env` un visās `toolArguments` vērtībās pirms rīka izsaukšanas.
- `timeoutSeconds` mezgla līmenī attiecas uz kopējo izpildi; `connection.timeoutSeconds` attiecas uz pašu MCP sesiju.
- Ja MCP serveris nav pieejams vai atgriež kļūdu, mezgls neizdodas, un kļūdas ziņojums ir pieejams workflow izpildes vēsturē.
