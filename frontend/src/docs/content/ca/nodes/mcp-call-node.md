# Node MCP Call

El node **MCP Call** crida directament una eina específica del [Model Context Protocol (MCP)](https://modelcontextprotocol.io), sense que cap LLM decideixi quina eina invocar. Utilitzeu-lo quan sapigueu exactament quina eina cal cridar i vulgueu una execució determinista d'un sol pas.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1 |
| Sortida | `$nodeLabel.result` |

## Quan utilitzar-lo

Utilitzeu el node MCP Call quan:
- Sapigueu exactament quina eina MCP cal cridar en temps de disseny
- No necessiteu cap LLM per triar entre eines
- Vulgueu una alternativa lleugera i determinista a un node agent per a una única invocació d'eina

Utilitzeu el [node Agent](./agent-node.md) en el seu lloc quan un LLM hagi de decidir quines eines cridar o quan necessiteu raonament de diversos passos.

> El node MCP Call **no** es pot connectar a un node agent com a eina.

## Configuració de la connexió

El node es connecta a un únic servidor MCP. Trieu un transport i ompliu els camps corresponents.

### SSE / Streamable HTTP

| Camp | Descripció |
|-------|-------------|
| `transport` | `sse` o `streamable_http` |
| `url` | URL completa del servidor MCP (p. ex. `https://mcp.example.com/sse`). Admet expressions DSL. |
| `headers` | Objecte JSON de capçaleres HTTP (p. ex. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Temps d'espera per connexió en segons (per defecte: 30) |

### stdio

| Camp | Descripció |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Executable a executar (p. ex. `npx`) |
| `args` | Matriu JSON d'arguments (p. ex. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | Objecte JSON de variables d'entorn (p. ex. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Temps d'espera per connexió en segons (per defecte: 30) |

## Selecció d'eina

1. Ompliu els camps de connexió.
2. Feu clic a **Fetch Tools** — el node es connecta al servidor MCP i llista les eines disponibles.
3. Seleccioneu una eina al desplegable.

**La selecció d'eina és obligatòria.** El node no s'executarà sense una eina seleccionada.

## Arguments

Després de seleccionar una eina, el node mostra un camp d'entrada per cada argument definit a l'esquema d'entrada de l'eina. Cada camp accepta:
- Un valor estàtic: `10`
- Una expressió DSL: `$userInput.body.text`

Els arguments obligatoris es marquen amb `*`.

## Sortida

| Camp | Descripció |
|-------|-------------|
| `$nodeLabel.result` | Resultat de l'eina. Si la resposta és JSON vàlid, es tracta d'un objecte analitzat. En cas contrari, és una cadena de text. |

## Exemple

Crideu una eina `search` en un servidor MCP SSE, passant la consulta de l'usuari:

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

Accediu al resultat aigües avall:

```
$searchCall.result.items   ← si el resultat és un objecte JSON
$searchCall.result         ← si el resultat és una cadena de text simple
```

## Notes

- El node resol les expressions DSL a `url`, `headers`, `env` i tots els valors de `toolArguments` abans de cridar l'eina.
- El `timeoutSeconds` a nivell de node s'aplica a l'execució global; el `connection.timeoutSeconds` s'aplica a la sessió MCP mateixa.
- Si el servidor MCP no està disponible o retorna un error, el node falla i el missatge d'error està disponible a l'execució del workflow.