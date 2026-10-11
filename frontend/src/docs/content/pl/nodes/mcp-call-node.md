# Węzeł MCP Call

Węzeł **MCP Call** wywołuje bezpośrednio określone narzędzie [Model Context Protocol (MCP)](https://modelcontextprotocol.io), bez udziału LLM decydującego o wyborze narzędzia. Należy go użyć, gdy znane jest dokładnie narzędzie, które ma zostać wywołane, a wymagane jest deterministyczne, jednoetapowe wykonanie.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.result` |

## Kiedy stosować

Węzeł MCP Call należy stosować, gdy:
- Dokładne narzędzie MCP do wywołania jest znane już na etapie projektowania
- Wybór narzędzia nie wymaga udziału LLM
- Wymagana jest lekka, deterministyczna alternatywa dla węzła agenta przy pojedynczym wywołaniu narzędzia

Zamiast tego należy użyć [węzła Agent](./agent-node.md), gdy to LLM ma decydować o wyborze narzędzi lub gdy wymagane jest wieloetapowe wnioskowanie.

> Węzła MCP Call **nie można** podłączyć do węzła agenta jako narzędzia.

## Konfiguracja połączenia

Węzeł łączy się z pojedynczym serwerem MCP. Należy wybrać transport i wypełnić odpowiednie pola.

### SSE / Streamable HTTP

| Pole | Opis |
|-------|-------------|
| `transport` | `sse` lub `streamable_http` |
| `url` | Pełny adres URL serwera MCP (np. `https://mcp.example.com/sse`). Obsługuje wyrażenia DSL. |
| `headers` | Obiekt JSON z nagłówkami HTTP (np. `{"Authorization": "Bearer ..."}`) |
| `timeoutSeconds` | Limit czasu pojedynczego połączenia w sekundach (domyślnie: 30) |

### stdio

| Pole | Opis |
|-------|-------------|
| `transport` | `stdio` |
| `command` | Plik wykonywalny do uruchomienia (np. `npx`) |
| `args` | Tablica JSON z argumentami (np. `["-y", "@modelcontextprotocol/server-filesystem"]`) |
| `env` | Obiekt JSON ze zmiennymi środowiskowymi (np. `{"API_KEY": "..."}`) |
| `timeoutSeconds` | Limit czasu pojedynczego połączenia w sekundach (domyślnie: 30) |

## Wybór narzędzia

1. Wypełnić pola połączenia.
2. Kliknąć **Fetch Tools** — węzeł połączy się z serwerem MCP i wyświetli listę dostępnych narzędzi.
3. Wybrać narzędzie z listy rozwijanej.

**Wybór narzędzia jest wymagany.** Węzeł nie wykona się bez wybranego narzędzia.

## Argumenty

Po wybraniu narzędzia węzeł wyświetla jedno pole wejściowe dla każdego argumentu zdefiniowanego w schemacie wejściowym narzędzia. Każde pole przyjmuje:
- Wartość statyczną: `10`
- Wyrażenie DSL: `$userInput.body.text`

Argumenty wymagane są oznaczone symbolem `*`.

## Wyjście

| Pole | Opis |
|-------|-------------|
| `$nodeLabel.result` | Wynik działania narzędzia. Jeśli odpowiedź jest prawidłowym JSON-em, jest to sparsowany obiekt. W przeciwnym razie jest to ciąg znaków. |

## Przykład

Wywołanie narzędzia `search` na serwerze MCP typu SSE z przekazaniem zapytania użytkownika:

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

Dostęp do wyniku w dalszej części workflow:

```
$searchCall.result.items   ← jeśli wynik jest obiektem JSON
$searchCall.result         ← jeśli wynik jest zwykłym ciągiem znaków
```

## Uwagi

- Węzeł rozwiązuje wyrażenia DSL w polach `url`, `headers`, `env` oraz we wszystkich wartościach `toolArguments` przed wywołaniem narzędzia.
- Parametr `timeoutSeconds` na poziomie węzła dotyczy całego wykonania; parametr `connection.timeoutSeconds` dotyczy samej sesji MCP.
- Jeśli serwer MCP jest niedostępny lub zwróci błąd, węzeł zakończy się niepowodzeniem, a komunikat błędu będzie dostępny w śladzie wykonania workflow.
