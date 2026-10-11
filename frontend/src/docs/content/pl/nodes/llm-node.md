# LLM

Węzeł **LLM** przetwarza tekst za pomocą modelu językowego lub generuje obrazy. Obsługuje generowanie tekstu, vision (wejście obrazowe), generowanie obrazów, strukturalne wyjście JSON oraz natywne dla dostawcy wykonanie **Batch API** dla obsługiwanych modeli tekstowych.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1, plus opcjonalne `batchStatus`, gdy tryb wsadowy jest włączony |
| Wyjście | `$nodeLabel.text` (tekst), `$nodeLabel.image` (obraz) lub pola wyniku wsadowego, takie jak `$nodeLabel.results` |

## Parametry

### Dane logowania i model

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania LLM z [Dane logowania](../tabs/credentials-tab.md) |
| `model` | string | Nazwa modelu (np. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` dla obrazów) |
| `fallbackCredentialId` | UUID (opcjonalny) | Zapasowe dane logowania, gdy podstawowe zawiodą |
| `fallbackModel` | string (opcjonalny) | Zapasowy model, gdy podstawowy zawiedzie |

Jeśli podstawowe dane logowania lub model zwrócą błąd, węzeł automatycznie ponawia próbę z zapasowymi danymi logowania i modelem, zanim zgłosi błąd.

Heym sprawdza również **obsługę trybu wsadowego** na podstawie wybranych danych logowania i modelu. Tryb wsadowy jest dostępny dla:

- Danych logowania OpenAI
- Niestandardowych / zgodnych z OpenAI danych logowania, których endpoint udostępnia wymagane API `/v1/files` i `/v1/batches`

Jeśli wybrany dostawca lub model nie obsługuje wykonania wsadowego, panel Właściwości wyświetla tę informację bezpośrednio i wyłącza przełącznik.

### Prompty (tryb tekstowy)

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt systemowy. Obsługuje [wyrażenia](../reference/expression-dsl.md). |
| `userMessage` | string | Wiadomość użytkownika. Domyślnie: `$input.text` |
| `temperature` | number | 0.0–2.0 (domyślnie: 0.7) |
| `maxTokens` | number | Maksymalna liczba tokenów odpowiedzi (opcjonalnie) |
| `requestTimeoutSeconds` | number | Maksymalna liczba sekund oczekiwania na odpowiedź modelu przed przekroczeniem limitu czasu (domyślnie: 60). Należy zwiększyć dla wolnych lub samodzielnie hostowanych dostawców (LiteLLM, vLLM, modele lokalne). |

### Obraz i wyjście

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Generowanie tekstu lub obrazu |
| `imageInputEnabled` | boolean | Dołącz obraz do wiadomości użytkownika (vision) |
| `imageInput` | expression | Data URL Base64 lub URL obrazu |
| `jsonOutputEnabled` | boolean | Strukturalne wyjście JSON |
| `jsonOutputSchema` | string | JSON Schema dla strukturalnego wyjścia |
| `extraBodyEnabled` | boolean | Wysyłaj parametry żądania specyficzne dla dostawcy (domyślnie: `false`) |
| `extraBody` | string | Obiekt JSON scalany z treścią żądania API |

### Modele rozumujące (o1, o3)

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Włącz dla modeli rozumujących |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Głębokość rozumowania |

### Tryb wsadowy

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Użyj natywnego dla dostawcy Batch API zamiast wykonania pojedynczego żądania |

Tryb wsadowy jest dostępny wyłącznie w węźle **LLM**. **Nie** dotyczy [Węzła Agent](./agent-node.md).

Gdy tryb wsadowy jest włączony:

- `outputType` musi pozostać `text`
- `imageInputEnabled` musi pozostać `false`
- `userMessage` musi zwracać **tablicę**
- każdy element tablicy musi zwracać wartość typu string lub typ prosty

Typowe przykłady:

- `$input.items.map("item.text")`
- `$vars.promptList`

Jeśli wyrażenie zwraca pojedynczy ciąg znaków zamiast tablicy, uruchomienie kończy się błędem walidacji, zanim rozpocznie się wywołanie u dostawcy.

## Gałąź statusu wsadu

Gdy tryb wsadowy jest włączony, węzeł LLM udostępnia drugi uchwyt wyjściowy: `batchStatus`.

Tej gałęzi należy używać do powiadomień, logowania, wiadomości Slack lub efektów ubocznych, gdy wsad jest wciąż przetwarzany. Gałąź uruchamia się za każdym razem, gdy status u dostawcy zmienia się w istotny sposób, w tym dla stanów znormalizowanych, takich jak:

- `pending`
- `processing`
- `completed`
- `failed`

Payload gałęzi statusu jest dostępny jako `$input` w węzłach podrzędnych i zawiera:

- `$input.batchId`
- `$input.batchStatus`
- `$input.status`
- `$input.rawStatus`
- `$input.total`
- `$input.completed`
- `$input.failed`
- `$input.requestCounts.total`
- `$input.requestCounts.completed`
- `$input.requestCounts.failed`
- `$input.provider`
- `$input.model`

Przykładowa krawędź:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Przykładowy mapper statusu:

```json
{
  "type": "set",
  "data": {
    "label": "notifyProgress",
    "mappings": [
      { "key": "status", "value": "$input.batchStatus" },
      { "key": "completed", "value": "$input.completed" },
      { "key": "total", "value": "$input.total" }
    ]
  }
}
```

## Struktura wyniku wsadowego

Po pomyślnym zakończeniu główne wyjście LLM zawiera:

- `$nodeLabel.text` – połączone pomyślne teksty
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – wyniki dla poszczególnych elementów w oryginalnej kolejności
- `$nodeLabel.usage`

Każdy element w `$nodeLabel.results` zawiera pola takie jak:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Gdy **wyjście JSON** jest włączone razem z trybem wsadowym, Heym parsuje każdy pomyślny element osobno. Sparsowane obiekty są udostępniane dla poszczególnych elementów i zbierane w `parsedResults`.
## Responses API

Pole wyboru **Use Responses API** kieruje wywołanie węzła przez
[Responses API](https://platform.openai.com/docs/api-reference/responses) zamiast przez Chat
Completions. Jest domyślnie wyłączone, a węzeł działa identycznie w obu przypadkach: te same prompty,
ten sam schemat wyjściowy JSON, ten sam kształt wyniku.

Działa z danymi logowania OpenAI oraz z niestandardowymi danymi logowania, których brama obsługuje
endpoint, dzięki czemu konfiguracja self-hosted lub za proxy również może z niego korzystać. Z danymi logowania Google pozostaje wyłączone i nie można go łączyć z [trybem Batch](#batch-status-branch) – panel węzła wskazuje, jaki jest status danych logowania, zanim cokolwiek zostanie uruchomione.

Jeśli endpoint okaże się niedostępny w czasie wykonania, węzeł kończy się błędem z komunikatem wskazującym przyczynę, zamiast po cichu przechodzić do trybu zapasowego, dzięki czemu węzeł skonfigurowany pod Responses API zawsze z niego korzysta. Aby świadomie przełączyć się na inne dane logowania lub model, należy użyć pól **Fallback Credential** i **Fallback Model**; dziedziczą one to pole wyboru, więc dane logowania zapasowe również muszą obsługiwać ten endpoint.

## Image Generation

- **Models:** `nanobanana`, `gemini-2.0-flash-exp`
- **Output:** `$nodeLabel.image` (base64 data URL)
- W przypadku używania [Input](./input-node.md) dla promptu należy użyć `$userPrompt.body.text` w `userMessage`

## JSON Output

Gdy `jsonOutputEnabled` ma wartość true, LLM zwraca JSON zgodny ze schematem. Dostęp do pól odbywa się przez `$nodeLabel.fieldName`.

## Extra Body

Niektórzy dostawcy akceptują parametry żądania, których standardowe pola zgodne z OpenAI nie
obejmują, takie jak wyłączanie trybu myślenia modelu. Należy zaznaczyć **Send extra request body** we
właściwościach węzła i wprowadzić obiekt JSON. Jest on scalany z każdym żądaniem API wysyłanym przez ten węzeł.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Domyślnie wyłączone.** Przy odznaczonym polu wyboru nic dodatkowego nie jest wysyłane.
- Musi być **obiektem** JSON. Tablica, wartość skalarna lub nieprawidłowy tekst powoduje błąd węzła
  `Invalid extra body JSON`, zamiast cichego pominięcia.
- Przycisk **Format** obok pola wyboru przeformatowuje JSON i zmienia kolor na czerwony z napisem
  `Invalid`, gdy tekst nie daje się sparsować.
- Stosowane do głównego uzupełnienia, próby z modelem zapasowym oraz żądań w trybie Batch.
  **Nie** jest stosowane do generowania obrazów ani do sprawdzeń guardrails, które używają innego kształtu
  żądania i osobnego modelu.
- Wyrażenia `$` są rozwiązywane przed parsowaniem, więc `{"max_tokens": $prev.limit}` działa. Ponieważ
  jest to podstawienie tekstowe, rozwiązana wartość zawierająca podwójny cudzysłów lub znak nowej linii
  daje nieprawidłowy JSON i powoduje błąd węzła.

## Example – Text

```json
{
  "type": "llm",
  "data": {
    "label": "generateResponse",
    "credentialId": "credential-uuid",
    "model": "gpt-4o",
    "systemInstruction": "You are a helpful assistant.",
    "userMessage": "$userInput.body.text"
  }
}
```

## Example – Batch text

```json
{
  "nodes": [
    {
      "id": "var_1",
      "type": "variable",
      "position": { "x": 120, "y": 180 },
      "data": {
        "label": "batchPrompts",
        "variableName": "promptList",
        "variableType": "array",
        "variableValue": "$array(\"Summarize this invoice\", \"Draft a follow-up email\", \"Classify the invoice status\")"
      }
    },
    {
      "id": "llm_1",
      "type": "llm",
      "position": { "x": 420, "y": 180 },
      "data": {
        "label": "batchLlm",
        "credentialId": "credential-uuid",
        "model": "gpt-4o-mini",
        "batchModeEnabled": true,
        "systemInstruction": "Answer each item briefly.",
        "userMessage": "$vars.promptList"
      }
    },
    {
      "id": "set_1",
      "type": "set",
      "position": { "x": 760, "y": 70 },
      "data": {
        "label": "progressUpdate",
        "mappings": [
          { "key": "status", "value": "$input.batchStatus" },
          { "key": "completed", "value": "$input.completed" }
        ]
      }
    },
    {
      "id": "out_1",
      "type": "output",
      "position": { "x": 760, "y": 280 },
      "data": {
        "label": "batchResult",
        "outputKey": "responses"
      }
    }
  ],
  "edges": [
    { "id": "e1", "source": "var_1", "target": "llm_1" },
    { "id": "e2", "source": "llm_1", "sourceHandle": "batchStatus", "target": "set_1" },
    { "id": "e3", "source": "llm_1", "target": "out_1" }
  ]
}
```

## Example – Image generation

```json
{
  "type": "llm",
  "data": {
    "label": "generateImage",
    "credentialId": "credential-uuid",
    "model": "nanobanana",
    "outputType": "image",
    "userMessage": "$userPrompt.body.text"
  }
}
```

## Guardrails

Należy włączyć **Guardrails** we właściwościach węzła, aby blokować niebezpieczne wiadomości użytkownika przed wywołaniem LLM. Pełne informacje znajdują się w [Guardrails](../reference/guardrails.md).

## Related

- [Agent Node](./agent-node.md) – LLM z wywoływaniem narzędzi
- [Why Heym](../getting-started/why-heym.md) – Gdzie kroki LLM wpisują się w cykl życia agenta
- [Guardrails](../reference/guardrails.md) – Blokowanie niebezpiecznych kategorii treści
- [Node Types](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Expression DSL](../reference/expression-dsl.md) – Odwoływanie się do danych w promptach
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Rozszerzalny edytor z podglądem backendu na żywo dla promptów
- [Credentials Tab](../tabs/credentials-tab.md) – Dodawanie kluczy API LLM
- [Quick Start](../getting-started/quick-start.md) – Podstawowy workflow LLM
