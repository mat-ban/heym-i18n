# Uzol MCP Call

Uzol **MCP Call** volá konkrétny nástroj [Model Context Protocol (MCP)](https://modelcontextprotocol.io) priamo, bez toho, aby LLM rozhodoval o tom, ktorý nástroj vyvolať. Použite ho, keď presne viete, ktorý nástroj chcete zavolať, a chcete deterministické vykonanie v jednom kroku.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.result` |

## Kedy použiť

Uzol MCP Call použite, keď:
- Presne viete, ktorý MCP nástroj chcete zavolať už v čase návrhu
- Nepotrebujete, aby LLM vyberal medzi nástrojmi
- Chcete odľahčenú, deterministickú alternatívu k uzlu agenta pre jedno vyvolanie nástroja

Namiesto toho použite [uzol Agent](./agent-node.md), keď má LLM rozhodnúť, ktoré nástroje zavolať, alebo keď potrebujete viackrokové uvažovanie.

> Uzol MCP Call **nie je možné** pripojiť k uzlu agenta ako nástroj.

## Konfigurácia pripojenia

Uzol sa pripája k jednému MCP serveru. Zvoľte transport a vyplňte príslušné polia.

### SSE / Streamable HTTP

| Pole | Popis |
|-------|-------------|
| `transport` | `sse` alebo `streamable_http` |
| `url` | Úplná URL adresa MCP servera (napr. `https://mcp.example.com/sse`). Podporuje DSL výrazy. |
| `headers` | JSON objekt s HTTP hlavičkami (napr. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Časový limit na jedno pripojenie v sekundách (predvolené: 30) |

### stdio

| Pole | Popis |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Spustiteľný súbor, ktorý sa má spustiť (napr. `npx`) |
| `args` | JSON pole argumentov (napr. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | JSON objekt s premennými prostredia (napr. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Časový limit na jedno pripojenie v sekundách (predvolené: 30) |

## Výber nástroja

1. Vyplňte polia pripojenia.
2. Kliknite na **Fetch Tools** — uzol sa pripojí k MCP serveru a zobrazí zoznam dostupných nástrojov.
3. Vyberte nástroj z rozbaľovacieho zoznamu.

**Výber nástroja je povinný.** Uzol sa bez vybraného nástroja nevykoná.

## Argumenty

Po výbere nástroja uzol vykreslí jedno vstupné pole pre každý argument definovaný vo vstupnej schéme nástroja. Každé pole akceptuje:
- Statickú hodnotu: `10`
- DSL výraz: `$userInput.body.text`

Povinné argumenty sú označené `*`.

## Výstup

| Pole | Popis |
|-------|-------------|
| `$nodeLabel.result` | Výsledok nástroja. Ak je odpoveď platný JSON, ide o spracovaný objekt. V opačnom prípade ide o reťazec. |

## Príklad

Zavolanie nástroja `search` na SSE MCP serveri s odovzdaním používateľského dotazu:

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

Prístup k výsledku v nadväzujúcich krokoch:

```
$searchCall.result.items   ← ak je výsledok JSON objekt
$searchCall.result         ← ak je výsledok obyčajný reťazec
```

## Poznámky

- Uzol pred volaním nástroja vyhodnotí DSL výrazy v poliach `url`, `headers`, `env` a vo všetkých hodnotách `toolArguments`.
- Hodnota `timeoutSeconds` na úrovni uzla sa vzťahuje na celkové vykonanie; hodnota `connection.timeoutSeconds` sa vzťahuje na samotnú MCP session.
- Ak je MCP server nedostupný alebo vráti chybu, uzol zlyhá a chybová správa je dostupná v slede workflowu.
