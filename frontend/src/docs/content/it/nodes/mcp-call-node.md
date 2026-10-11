# Nodo MCP Call

Il nodo **MCP Call** richiama direttamente uno strumento specifico del [Model Context Protocol (MCP)](https://modelcontextprotocol.io), senza che un LLM decida quale strumento invocare. Lo si utilizzi quando si sa esattamente quale strumento chiamare e si desidera un'esecuzione deterministica in un singolo passaggio.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.result` |

## Quando utilizzarlo

Utilizzare il nodo MCP Call quando:
- Si sa esattamente quale strumento MCP chiamare in fase di progettazione
- Non è necessario un LLM per scegliere tra gli strumenti
- Si desidera un'alternativa leggera e deterministica a un nodo Agent per una singola invocazione di strumento

Utilizzare invece il [nodo Agent](./agent-node.md) quando un LLM deve decidere quali strumenti chiamare o quando è necessario un ragionamento multi-step.

> Il nodo MCP Call **non può** essere collegato a un nodo Agent come strumento.

## Configurazione della connessione

Il nodo si connette a un singolo server MCP. Scegliere un transport e compilare i campi corrispondenti.

### SSE / Streamable HTTP

| Campo | Descrizione |
|-------|-------------|
| `transport` | `sse` o `streamable_http` |
| `url` | URL completo del server MCP (es. `https://mcp.example.com/sse`). Supporta espressioni DSL. |
| `headers` | Oggetto JSON di header HTTP (es. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Timeout per connessione in secondi (predefinito: 30) |

### stdio

| Campo | Descrizione |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Eseguibile da avviare (es. `npx`) |
| `args` | Array JSON di argomenti (es. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | Oggetto JSON di variabili d'ambiente (es. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Timeout per connessione in secondi (predefinito: 30) |

## Selezione dello strumento

1. Compilare i campi di connessione.
2. Fare clic su **Fetch Tools** — il nodo si connette al server MCP ed elenca gli strumenti disponibili.
3. Selezionare uno strumento dal menu a discesa.

**La selezione dello strumento è obbligatoria.** Il nodo non verrà eseguito senza uno strumento selezionato.

## Argomenti

Dopo aver selezionato uno strumento, il nodo mostra un campo di input per ogni argomento definito nello schema di input dello strumento. Ogni campo accetta:
- Un valore statico: `10`
- Un'espressione DSL: `$userInput.body.text`

Gli argomenti obbligatori sono contrassegnati con `*`.

## Output

| Campo | Descrizione |
|-------|-------------|
| `$nodeLabel.result` | Risultato dello strumento. Se la risposta è un JSON valido, si tratta di un oggetto analizzato. In caso contrario, è una stringa. |

## Esempio

Chiamare uno strumento `search` su un server MCP SSE, passando la query dell'utente:

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

Accedere al risultato a valle:

```
$searchCall.result.items   ← se il risultato è un oggetto JSON
$searchCall.result         ← se il risultato è una stringa semplice
```

## Note

- Il nodo risolve le espressioni DSL in `url`, `headers`, `env` e in tutti i valori di `toolArguments` prima di chiamare lo strumento.
- Il `timeoutSeconds` a livello di nodo si applica all'esecuzione complessiva; il `connection.timeoutSeconds` si applica alla sessione MCP stessa.
- Se il server MCP non è disponibile o restituisce un errore, il nodo fallisce e il messaggio di errore è disponibile nella traccia del workflow.