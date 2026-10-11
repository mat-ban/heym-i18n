# MCP Call csomópont

Az **MCP Call** csomópont közvetlenül meghív egy adott [Model Context Protocol (MCP)](https://modelcontextprotocol.io) eszközt, anélkül hogy egy LLM döntené el, melyik eszközt hívja meg. Akkor használja, ha pontosan tudja, melyik eszközt kell meghívni, és determinisztikus, egyetlen lépésből álló végrehajtást szeretne.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.result` |

## Mikor használja

Az MCP Call csomópontot akkor használja, ha:
- Tervezési időben pontosan tudja, melyik MCP eszközt kell meghívni
- Nincs szüksége LLM-re az eszközök közötti választáshoz
- Könnyűsúlyú, determinisztikus alternatívát szeretne egy ügynök csomópont helyett egyetlen eszközhíváshoz

Ehelyett használja az [Agent csomópontot](./agent-node.md), ha egy LLM-nek kell eldöntenie, mely eszközöket hívja meg, vagy ha többlépéses következtetésre van szüksége.

> Az MCP Call csomópont **nem** csatlakoztatható ügynök csomóponthoz eszközként.

## Kapcsolat konfigurációja

A csomópont egyetlen MCP szerverhez csatlakozik. Válasszon transportot, és töltse ki a megfelelő mezőket.

### SSE / Streamable HTTP

| Mező | Leírás |
|-------|-------------|
| `transport` | `sse` vagy `streamable_http` |
| `url` | Az MCP szerver teljes URL-je (pl. `https://mcp.example.com/sse`). Támogatja a DSL kifejezéseket. |
| `headers` | HTTP fejlécek JSON objektuma (pl. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Kapcsolatonkénti időtúllépés másodpercben (alapértelmezett: 30) |

### stdio

| Mező | Leírás |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Futtatandó végrehajtható fájl (pl. `npx`) |
| `args` | Argumentumok JSON tömbje (pl. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | Környezeti változók JSON objektuma (pl. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Kapcsolatonkénti időtúllépés másodpercben (alapértelmezett: 30) |

## Eszköz kiválasztása

1. Töltse ki a kapcsolat mezőit.
2. Kattintson a **Fetch Tools** gombra — a csomópont csatlakozik az MCP szerverhez, és listázza az elérhető eszközöket.
3. Válasszon egy eszközt a legördülő menüből.

**Az eszköz kiválasztása kötelező.** A csomópont nem hajtódik végre kiválasztott eszköz nélkül.

## Argumentumok

Az eszköz kiválasztása után a csomópont egy bemeneti mezőt jelenít meg az eszköz bemeneti sémájában definiált minden argumentumhoz. Minden mező elfogad:
- Statikus értéket: `10`
- DSL kifejezést: `$userInput.body.text`

A kötelező argumentumokat `*` jelöli.

## Kimenet

| Mező | Leírás |
|-------|-------------|
| `$nodeLabel.result` | Eszköz eredménye. Ha a válasz érvényes JSON, ez egy feldolgozott objektum. Egyébként egy sztring. |

## Példa

Hívja meg a `search` eszközt egy SSE MCP szerveren, átadva a felhasználó lekérdezését:

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

Az eredmény elérése a további feldolgozásban:

```
$searchCall.result.items   ← ha az eredmény egy JSON objektum
$searchCall.result         ← ha az eredmény egy egyszerű sztring
```

## Megjegyzések

- A csomópont az eszköz meghívása előtt feloldja a DSL kifejezéseket a `url`, `headers`, `env` és az összes `toolArguments` értékben.
- A csomópont szintjén lévő `timeoutSeconds` a teljes végrehajtásra vonatkozik; a `connection.timeoutSeconds` magára az MCP munkamenetre vonatkozik.
- Ha az MCP szerver nem elérhető, vagy hibát ad vissza, a csomópont meghiúsul, és a hibaüzenet elérhető a workflow nyomkövetésében.
