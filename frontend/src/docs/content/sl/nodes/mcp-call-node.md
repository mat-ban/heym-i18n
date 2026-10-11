# MCP Klic Vozlišče

**MCP Klic** vozlišče neposredno pokliče določen [Model Context Protocol (MCP)](https://modelcontextprotocol.io) pripomoček, brez odločanja LLM o tem, kateri pripomoček naj se pokliče. Uporabite ga, ko natančno veste, kateri pripomoček želite poklicati in želite deterministično, enostopenjsko izvajanje.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi    | 1        |
| Izhodi   | 1        |
| Izhod    | `$nodeLabel.result` |

## Kdaj Uporabiti

Uporabite MCP Klic vozlišče, ko:
- Natančno veste, kateri MCP pripomoček poklicati v času načrtovanja
- Ne potrebujete, da LLM izbira med pripomočki
- Želite lahkotno, deterministično alternativo za vozlišče agenta pri enkratnem klicu pripomočka

Namesto tega uporabite [Vozlišče agenta](./agent-node.md), ko naj LLM odloči, kateri pripomočki naj se pokličejo ali ko potrebujete večstopenjsko razmišljanje.

> MCP Klic vozlišče **ne more** biti povezano z vozliščem agenta kot pripomoček.

## Konfiguracija Povezave

Vozlišče se poveže z enim MCP strežnikom. Izberite prenos in izpolnite ustrezna polja.

### SSE / Streamable HTTP

| Polje | Opis |
|-------|------|
| `transport` | `sse` ali `streamable_http` |
| `url` | Poln URL MCP strežnika (npr. `https://mcp.example.com/sse`). Podpira DSL izraze. |
| `headers` | JSON objekt HTTP glav (npr. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Časovna omejitev na povezavo v sekundah (privzeto: 30) |

### stdio

| Polje | Opis |
|-------|------|
| `transport` | `stdio` |
| `command` | Izvršljiva datoteka za zagon (npr. `npx`) |
| `args` | JSON tabela argumentov (npr. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | JSON objekt okolijskih spremenljivk (npr. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Časovna omejitev na povezavo v sekundah (privzeto: 30) |

## Izbira Pripomočka

1. Izpolnite polja za povezavo.
2. Kliknite **Fetch Tools** — vozlišče se poveže z MCP strežnikom in prikaže razpoložljive pripomočke.
3. Izberite pripomoček iz spustnega menija.

**Izbira pripomočka je obvezna.** Vozlišče ne bo izvedlo brez izbranega pripomočka.

## Argumenti

Po izbiri pripomočka vozlišče prikaže eno vhodno polje za vsak argument, določen v vhodni shemi pripomočka. Vsako polje sprejema:
- Statično vrednost: `10`
- DSL izraz: `$userInput.body.text`

Obvezni argumenti so označeni z `*`.

## Izhod

| Polje | Opis |
|-------|------|
| `$nodeLabel.result` | Rezultat pripomočka. Če je odgovor veljaven JSON, je to razčlenjen objekt. V nasprotnem primeru je to niz. |

## Primer

Pokličite `search` pripomoček na SSE MCP strežniku, pri čemer posredujete uporabnikovo poizvedbo:

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

Dostopajte do rezultata downstream:

```
$searchCall.result.items   ← če je rezultat JSON objekt
$searchCall.result         ← če je rezultat navaden niz
```

## Opombe

- Vozlišče razreši DSL izraze v `url`, `headers`, `env` in vse vrednosti `toolArguments` pred klicem pripomočka.
- `timeoutSeconds` na ravni vozlišča se uporablja za celotno izvajanje; `connection.timeoutSeconds` se uporablja za MCP sejo sama.
- Če MCP strežnik ni na voljo ali vrne napako, vozlišče ne uspe in sporočilo o napaki je na voljo v sledilni zgodovini delovnega toka.
