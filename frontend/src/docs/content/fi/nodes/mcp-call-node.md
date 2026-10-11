# MCP Call -solmu

**MCP Call** -solmu kutsuu suoraan tiettyä [Model Context Protocol (MCP)](https://modelcontextprotocol.io) -työkalua ilman, että LLM päättää, mitä työkalua käytetään. Käytä sitä, kun tiedät tarkalleen, minkä työkalun haluat kutsua ja tarvitset deterministisen, yksivaiheisen suorituksen.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tulos | `$nodeLabel.result` |

## Käyttökohteet

Käytä MCP Call -solmua, kun:
- Tiedät suunnitteluvaiheessa tarkalleen, minkä MCP-työkalun haluat kutsua
- Et tarvitse LLM:ää työkalujen valintaan
- Haluat kevyen, deterministisen vaihtoehdon agenttisolmulle yksittäisen työkalukutsun toteuttamiseen

Käytä [Agent-solmua](./agent-node.md) sen sijaan, kun LLM:n tulisi päättää käytettävistä työkaluista tai kun tarvitset monivaiheista päättelyä.

> MCP Call -solmua **ei voi** yhdistää agenttisolmuun työkaluna.

## Yhteyden määrittäminen

Solmu muodostaa yhteyden yhteen MCP-palvelimeen. Valitse kuljetusmuoto ja täytä vastaavat kentät.

### SSE / Streamable HTTP

| Kenttä | Kuvaus |
|-------|-------------|
| `transport` | `sse` tai `streamable_http` |
| `url` | MCP-palvelimen täydellinen URL-osoite (esim. `https://mcp.example.com/sse`). Tukee DSL-lausekkeita. |
| `headers` | JSON-objekti HTTP-otsikoista (esim. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Yhteyden aikakatkaisu sekunteina (oletus: 30) |

### stdio

| Kenttä | Kuvaus |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Suoritettava komento (esim. `npx`) |
| `args` | JSON-taulukko argumenteista (esim. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | JSON-objekti ympäristömuuttujista (esim. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Yhteyden aikakatkaisu sekunteina (oletus: 30) |

## Työkalun valinta

1. Täytä yhteyden kentät.
2. Klikkaa **Fetch Tools** - solmu muodostaa yhteyden MCP-palvelimeen ja listaa saatavilla olevat työkalut.
3. Valitse työkalu pudotusvalikosta.

**Työkalun valinta on pakollinen.** Solmu ei suorita toimintoa ilman valittua työkalua.

## Argumentit

Kun työkalu on valittu, solmu näyttää yhden syötekentän jokaiselle työkalun syöttökaaviossa määritetylle argumentille. Jokainen kenttä hyväksyy:
- Staattisen arvon: `10`
- DSL-lausekkeen: `$userInput.body.text`

Pakolliset argumentit on merkitty `*`-merkillä.

## Tulos

| Kenttä | Kuvaus |
|-------|-------------|
| `$nodeLabel.result` | Työkalun tulos. Jos vastaus on kelvollinen JSON, tämä on jäsennelty objekti. Muussa tapauksessa se on merkkijono. |

## Esimerkki

Kutsu `search`-työkalua SSE MCP-palvelimella, välittäen käyttäjän hakusanan:

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

Käytä tulosta myöhemmissä vaiheissa:

```
$searchCall.result.items   ← jos tulos on JSON-objekti
$searchCall.result         ← jos tulos on pelkkä merkkijono
```

## Huomioita

- Solmu ratkaisee DSL-lausekkeet `url`-, `headers`-, `env`- ja kaikissa `toolArguments`-arvoissa ennen työkalun kutsumista.
- Solmun tasolla määritetty `timeoutSeconds` koskee koko suoritusta; `connection.timeoutSeconds` koskee MCP-istuntoa itseään.
- Jos MCP-palvelin ei ole käytettävissä tai palauttaa virheen, solmu epäonnistuu ja virheviesti on saatavilla workflown suorituksen seurannassa.
