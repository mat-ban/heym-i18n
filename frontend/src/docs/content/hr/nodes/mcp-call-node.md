# MCP Call Čvor

**MCP Call** čvor izravno poziva određeni [Model Context Protocol (MCP)](https://modelcontextprotocol.io) alat, bez odluke LLM-a o tome koji alat pozvati. Koristite ga kada točno znate koji alat pozvati i želite determinističko, jednostepeno izvršavanje.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.result` |

## Kada Koristiti

Koristite MCP Call čvor kada:
- Točno znate koji MCP alat pozvati u fazi dizajniranja
- Ne trebate LLM da bira između alata
- Želite laganu, determinističku alternativu čvoru agenta za jedno pozivanje alata

Umjesto toga, koristite [Agent čvor](./agent-node.md) kada LLM treba odlučiti koji alati se pozivaju ili kada trebate višestepeno razmišljanje.

> MCP Call čvor **ne može** biti povezan s čvorom agenta kao alat.

## Konfiguracija Povezivanja

Čvor se povezuje s jednim MCP poslužiteljem. Odaberite transport i ispunite odgovarajuća polja.

### SSE / Streamable HTTP

| Polje | Opis |
|-------|-------------|
| `transport` | `sse` ili `streamable_http` |
| `url` | Puna URL adresa MCP poslužitelja (npr. `https://mcp.example.com/sse`). Podržava DSL izraze. |
| `headers` | JSON objekt HTTP zaglavlja (npr. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Timeout po vezi u sekundama (zadano: 30) |

### stdio

| Polje | Opis |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Izvršna datoteka za pokretanje (npr. `npx`) |
| `args` | JSON niz argumenata (npr. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | JSON objekt varijabli okruženja (npr. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Timeout po vezi u sekundama (zadano: 30) |

## Odabir Alata

1. Ispunite polja za povezivanje.
2. Kliknite **Fetch Tools** — čvor se povezuje s MCP poslužiteljem i navodi dostupne alate.
3. Odaberite alat iz padajućeg izbornika.

**Odabir alata je obavezan.** Čvor neće izvršiti bez odabranog alata.

## Argumenti

Nakon odabira alata, čvor prikazuje jedno ulazno polje za svaki argument definiran u ulaznoj shemi alata. Svako polje prihvaća:
- Statičnu vrijednost: `10`
- DSL izraz: `$userInput.body.text`

Obavezni argumenti označeni su s `*`.

## Izlaz

| Polje | Opis |
|-------|-------------|
| `$nodeLabel.result` | Rezultat alata. Ako je odgovor valjani JSON, ovo je analizirani objekt. Inače je to string. |

## Primjer

Pozovite `search` alat na SSE MCP poslužitelju, prosljeđujući korisničku upit:

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

Pristupite rezultatu nizvodno:

```
$searchCall.result.items   ← ako je rezultat JSON objekt
$searchCall.result         ← ako je rezultat običan string
```

## Napomene

- Čvor rješava DSL izraze u `url`, `headers`, `env` i svim vrijednostima `toolArguments` prije pozivanja alata.
- `timeoutSeconds` na razini čvora primjenjuje se na cjelokupno izvršavanje; `connection.timeoutSeconds` primjenjuje se na MCP sesiju.
- Ako MCP poslužitelj nije dostupan ili vrati grešku, čvor ne uspijeva i poruka o grešci dostupna je u povijesti izvršavanja.
