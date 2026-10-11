# Uzel MCP Call

Uzel **MCP Call** volá přímo konkrétní nástroj [Model Context Protocol (MCP)](https://modelcontextprotocol.io), aniž by o výběru nástroje rozhodoval LLM. Použijte jej, když přesně víte, který nástroj má být zavolán, a chcete deterministické provedení v jediném kroku.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.result` |

## Kdy použít

Uzel MCP Call použijte, když:
- V době návrhu přesně víte, který nástroj MCP má být zavolán
- Nepotřebujete, aby LLM vybíral mezi nástroji
- Chcete odlehčenou a deterministickou alternativu k uzlu agenta pro jediné volání nástroje

Místo toho použijte [uzel Agent](./agent-node.md), pokud má o volaných nástrojích rozhodovat LLM nebo pokud potřebujete vícestupňové uvažování.

> Uzel MCP Call **nelze** připojit k uzlu agenta jako nástroj.

## Konfigurace připojení

Uzel se připojuje k jedinému MCP serveru. Zvolte transport a vyplňte odpovídající pole.

### SSE / Streamable HTTP

| Pole | Popis |
|-------|-------------|
| `transport` | `sse` nebo `streamable_http` |
| `url` | Úplná URL adresa MCP serveru (např. `https://mcp.example.com/sse`). Podporuje DSL výrazy. |
| `headers` | JSON objekt s HTTP hlavičkami (např. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Časový limit pro jedno připojení v sekundách (výchozí: 30) |

### stdio

| Pole | Popis |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Spustitelný soubor, který má být spuštěn (např. `npx`) |
| `args` | JSON pole argumentů (např. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | JSON objekt s proměnnými prostředí (např. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Časový limit pro jedno připojení v sekundách (výchozí: 30) |

## Výběr nástroje

1. Vyplňte pole připojení.
2. Klikněte na **Fetch Tools** — uzel se připojí k MCP serveru a zobrazí seznam dostupných nástrojů.
3. Vyberte nástroj z rozbalovací nabídky.

**Výběr nástroje je povinný.** Uzel se bez vybraného nástroje nespustí.

## Argumenty

Po výběru nástroje uzel zobrazí jedno vstupní pole pro každý argument definovaný ve vstupním schématu nástroje. Každé pole přijímá:
- Statickou hodnotu: `10`
- DSL výraz: `$userInput.body.text`

Povinné argumenty jsou označeny `*`.

## Výstup

| Pole | Popis |
|-------|-------------|
| `$nodeLabel.result` | Výsledek nástroje. Pokud je odpověď platný JSON, jde o parsovaný objekt. V opačném případě jde o řetězec. |

## Příklad

Zavolejte nástroj `search` na SSE MCP serveru a předejte dotaz uživatele:

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

Přístup k výsledku v navazujících uzlech:

```
$searchCall.result.items   ← pokud je výsledkem JSON objekt
$searchCall.result         ← pokud je výsledkem prostý řetězec
```

## Poznámky

- Uzel před voláním nástroje vyhodnotí DSL výrazy v `url`, `headers`, `env` a ve všech hodnotách `toolArguments`.
- Hodnota `timeoutSeconds` na úrovni uzlu se vztahuje na celkové provedení; hodnota `connection.timeoutSeconds` se vztahuje na samotnou relaci MCP.
- Pokud je MCP server nedostupný nebo vrátí chybu, uzel selže a chybová zpráva bude dostupná ve stopě workflow.
