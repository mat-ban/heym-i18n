# Nodul MCP Call

Nodul **MCP Call** apelează direct un instrument specific din [Model Context Protocol (MCP)](https://modelcontextprotocol.io), fără ca un LLM să decidă ce instrument să invoce. Utilizați-l atunci când știți exact ce instrument trebuie apelat și doriți o execuție deterministă, într-un singur pas.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.result` |

## Când se utilizează

Utilizați nodul MCP Call atunci când:
- Știți exact ce instrument MCP trebuie apelat în momentul proiectării
- Nu aveți nevoie de un LLM pentru a alege între instrumente
- Doriți o alternativă ușoară și deterministă la un nod de agent pentru o singură invocare de instrument

Utilizați [Nodul Agent](./agent-node.md) în schimb atunci când un LLM ar trebui să decidă ce instrumente să apeleze sau când aveți nevoie de raționament în mai mulți pași.

> Nodul MCP Call **nu** poate fi conectat la un nod de agent ca instrument.

## Configurarea conexiunii

Nodul se conectează la un singur server MCP. Alegeți un transport și completați câmpurile corespunzătoare.

### SSE / Streamable HTTP

| Câmp | Descriere |
|-------|-------------|
| `transport` | `sse` sau `streamable_http` |
| `url` | URL-ul complet al serverului MCP (de ex. `https://mcp.example.com/sse`). Suportă expresii DSL. |
| `headers` | Obiect JSON de antete HTTP (de ex. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Timeout per conexiune în secunde (implicit: 30) |

### stdio

| Câmp | Descriere |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Executabilul de rulat (de ex. `npx`) |
| `args` | Array JSON de argumente (de ex. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | Obiect JSON de variabile de mediu (de ex. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Timeout per conexiune în secunde (implicit: 30) |

## Selectarea instrumentului

1. Completați câmpurile de conexiune.
2. Faceți clic pe **Fetch Tools** — nodul se conectează la serverul MCP și listează instrumentele disponibile.
3. Selectați un instrument din lista derulantă.

**Selectarea instrumentului este obligatorie.** Nodul nu se va executa fără un instrument selectat.

## Argumente

După selectarea unui instrument, nodul afișează un câmp de intrare pentru fiecare argument definit în schema de intrare a instrumentului. Fiecare câmp acceptă:
- O valoare statică: `10`
- O expresie DSL: `$userInput.body.text`

Argumentele obligatorii sunt marcate cu `*`.

## Ieșire

| Câmp | Descriere |
|-------|-------------|
| `$nodeLabel.result` | Rezultatul instrumentului. Dacă răspunsul este JSON valid, acesta este un obiect analizat. În caz contrar, este un șir de caractere. |

## Exemplu

Apelați un instrument `search` pe un server MCP SSE, transmițând interogarea utilizatorului:

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

Accesați rezultatul în aval:

```
$searchCall.result.items   ← dacă rezultatul este un obiect JSON
$searchCall.result         ← dacă rezultatul este un șir simplu
```

## Note

- Nodul rezolvă expresiile DSL din `url`, `headers`, `env` și toate valorile `toolArguments` înainte de a apela instrumentul.
- `timeoutSeconds` la nivelul nodului se aplică execuției generale; `connection.timeoutSeconds` se aplică sesiunii MCP în sine.
- Dacă serverul MCP este indisponibil sau returnează o eroare, nodul eșuează, iar mesajul de eroare este disponibil în istoricul workflow-ului.
