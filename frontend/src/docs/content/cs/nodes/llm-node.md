# LLM

Uzel **LLM** zpracovává text pomocí jazykového modelu nebo generuje obrázky. Podporuje generování textu, vision (vstup obrázku), generování obrázků, strukturovaný JSON výstup a nativní spouštění **Batch API** poskytovatele pro podporované textové modely.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1, plus volitelný `batchStatus` při zapnutém batch režimu |
| Výstup | `$nodeLabel.text` (text), `$nodeLabel.image` (obrázek) nebo pole výsledků batch, jako například `$nodeLabel.results` |

## Parametry

### Přihlašovací údaje a model

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | LLM přihlašovací údaje z [Přihlašovacích údajů](../tabs/credentials-tab.md) |
| `model` | string | Název modelu (např. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` pro obrázky) |
| `fallbackCredentialId` | UUID (volitelné) | Záložní přihlašovací údaje při selhání primárních |
| `fallbackModel` | string (volitelné) | Záložní model při selhání primárního |

Pokud primární přihlašovací údaje nebo model vrátí chybu, uzel automaticky zopakuje pokus se záložními přihlašovacími údaji a modelem, než selže.

Heym také kontroluje **batch schopnost** u vybraných přihlašovacích údajů a modelu. Batch režim je dostupný pro:

- Přihlašovací údaje OpenAI
- Vlastní / OpenAI-kompatibilní přihlašovací údaje, jejichž endpoint vystavuje požadovaná API `/v1/files` a `/v1/batches`

Pokud vybraný poskytovatel nebo model nepodporuje batch spouštění, panel Vlastnosti to přímo zobrazí a přepínač zakáže.

### Prompty (textový režim)

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `systemInstruction` | string | Systémový prompt. Podporuje [výrazy](../reference/expression-dsl.md). |
| `userMessage` | string | Uživatelská zpráva. Výchozí: `$input.text` |
| `temperature` | number | 0.0–2.0 (výchozí: 0.7) |
| `maxTokens` | number | Maximální počet tokenů odpovědi (volitelné) |
| `requestTimeoutSeconds` | number | Maximální počet sekund čekání na odpověď modelu před vypršením časového limitu (výchozí: 60). Zvyšte jej pro pomalé nebo self-hosted poskytovatele (LiteLLM, vLLM, lokální modely). |

### Obrázek a výstup

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Generování textu nebo obrázku |
| `imageInputEnabled` | boolean | Zahrnout obrázek s uživatelskou zprávou (vision) |
| `imageInput` | expression | Base64 data URL nebo URL obrázku |
| `jsonOutputEnabled` | boolean | Strukturovaný JSON výstup |
| `jsonOutputSchema` | string | JSON Schema pro strukturovaný výstup |
| `extraBodyEnabled` | boolean | Odeslat parametry požadavku specifické pro poskytovatele (výchozí: `false`) |
| `extraBody` | string | JSON objekt sloučený do těla API požadavku |

### Reasoning modely (o1, o3)

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Zapnout pro reasoning modely |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Hloubka reasoning |

### Batch režim

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Použít nativní Batch API poskytovatele místo spouštění jednotlivých požadavků |

Batch režim je dostupný pouze na uzlu **LLM**. **Nevztahuje** se na [Uzel Agent](./agent-node.md).

Při zapnutém batch režimu:

- `outputType` musí zůstat `text`
- `imageInputEnabled` musí zůstat `false`
- `userMessage` se musí vyhodnotit na **pole**
- každá položka pole se musí vyhodnotit na řetězec nebo primitivní hodnotu

Typické příklady:

- `$input.items.map("item.text")`
- `$vars.promptList`

Pokud se výraz vyhodnotí na jediný řetězec místo pole, spuštění selže s validační chybou ještě před zahájením volání poskytovatele.

## Větev stavu batch

Při zapnutém batch režimu uzel LLM vystavuje druhý výstupní handle: `batchStatus`.

Tuto větev použijte pro oznámení, logování, zprávy Slack nebo vedlejší efekty, zatímco batch stále běží. Větev se spustí vždy, když se stav poskytovatele významně změní, včetně normalizovaných stavů, jako jsou:

- `pending`
- `processing`
- `completed`
- `failed`

Payload větve stavu je dostupný jako `$input` v navazujících uzlech a zahrnuje:

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

Příklad hrany:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Příklad mapovače stavu:

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

## Struktura výsledku batch

Při úspěšném dokončení hlavní výstup LLM obsahuje:

- `$nodeLabel.text` – zřetězené úspěšné texty
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – výsledky jednotlivých položek v původním pořadí
- `$nodeLabel.usage`

Každá položka v `$nodeLabel.results` obsahuje pole, jako jsou:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Pokud je **JSON výstup** zapnut společně s batch režimem, Heym parsuje každou úspěšnou položku samostatně. Parsované objekty jsou vystaveny pro každou položku a shromážděny v `parsedResults`.
## Responses API

Zaškrtávací políčko **Use Responses API** směruje volání uzlu přes
[Responses API](https://platform.openai.com/docs/api-reference/responses) namísto Chat
Completions. Ve výchozím stavu je vypnuto a uzel se chová v obou případech stejně: stejné prompty,
stejné výstupní schéma JSON, stejný tvar výsledku.

Funguje s přihlašovacími údaji OpenAI a s vlastními přihlašovacími údaji, jejichž brána tento
endpoint podporuje, takže jej lze využít i v samostatně hostovaném nebo proxy prostředí. S přihlašovacími
údaji Google zůstává zakázáno a nelze jej kombinovat s [režimem Batch](#batch-status-branch) – panel
uzlu uvádí, jak si dané přihlašovací údaje stojí, ještě než cokoli spustíte.

Pokud se endpoint v době běhu ukáže jako nedostupný, uzel selže se zprávou pojmenovávající příčinu,
místo aby se tiše přepnul zpět, takže uzel nakonfigurovaný pro Responses API na něm vždy běží. Pro
záměrný návrat k jiným přihlašovacím údajům nebo modelu použijte pole **Fallback Credential** a
**Fallback Model**; dědí toto zaškrtávací políčko, takže i záložní přihlašovací údaje musí endpoint
podporovat.

## Generování obrázků

- **Modely:** `nanobanana`, `gemini-2.0-flash-exp`
- **Výstup:** `$nodeLabel.image` (base64 data URL)
- Při použití [Input](./input-node.md) pro prompt použijte `$userPrompt.body.text` v `userMessage`

## Výstup JSON

Když je `jsonOutputEnabled` true, LLM vrací JSON odpovídající schématu. K polím přistupujte přes `$nodeLabel.fieldName`.

## Extra Body

Někteří poskytovatelé přijímají parametry požadavku, které standardní pole kompatibilní s OpenAI
nepokrývají, například vypnutí režimu přemýšlení modelu. Zaškrtněte **Send extra request body** ve
vlastnostech uzlu a zadejte objekt JSON. Je sloučen do každého požadavku API, který tento uzel provede.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Ve výchozím stavu zakázáno.** Při vypnutém zaškrtávacím políčku se nic navíc neodesílá.
- Musí se jednat o **objekt** JSON. Pole, skalár nebo chybně formátovaný text způsobí selhání uzlu s
  `Invalid extra body JSON`, místo aby byl tiše zahozen.
- Tlačítko **Format** vedle zaškrtávacího políčka přeformátuje JSON a zčervená s textem
  `Invalid`, když text nelze parsovat.
- Aplikuje se na hlavní dokončení, pokus o záložní model i požadavky v režimu Batch.
  **Neaplikuje** se na generování obrázků ani na kontroly guardrails, které používají odlišný tvar
  požadavku a samostatný model.
- Výrazy `$` se vyhodnocují před parsováním, takže `{"max_tokens": $prev.limit}` funguje. Protože
  se jedná o textovou substituci, vyhodnocená hodnota obsahující dvojitou uvozovku nebo nový řádek
  vytvoří neplatný JSON a způsobí selhání uzlu.

## Příklad – Text

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

## Příklad – Batch text

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

## Příklad – Generování obrázku

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

Zapněte **Guardrails** ve vlastnostech uzlu, abyste zablokovali nebezpečné zprávy uživatele před
voláním LLM. Úplný přehled naleznete v [Guardrails](../reference/guardrails.md).

## Související

- [Agent Node](./agent-node.md) – LLM s voláním nástrojů
- [Why Heym](../getting-started/why-heym.md) – Kam zapadají kroky LLM v životním cyklu agenta
- [Guardrails](../reference/guardrails.md) – Blokování kategorií nebezpečného obsahu
- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
- [Expression DSL](../reference/expression-dsl.md) – Odkazování na data v promptech
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Rozšiřitelný editor s živým náhledem backendu pro prompty
- [Credentials Tab](../tabs/credentials-tab.md) – Přidání klíčů API pro LLM
- [Quick Start](../getting-started/quick-start.md) – Základní Workflow s LLM
