# LLM

Uzol **LLM** spracúva text pomocou jazykového modelu alebo generuje obrázky. Podporuje generovanie textu, videnie (vstup obrázka), generovanie obrázkov, štruktúrovaný výstup JSON a natívne vykonávanie **Batch API** poskytovateľa pre podporované textové modely.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1, plus voliteľný `batchStatus` pri zapnutom režime batch |
| Výstup | `$nodeLabel.text` (text), `$nodeLabel.image` (obrázok) alebo polia výsledku batch, ako napríklad `$nodeLabel.results` |

## Parametre

### Prihlasovacie údaje a model

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje LLM z časti [Prihlasovacie údaje](../tabs/credentials-tab.md) |
| `model` | string | Názov modelu (napr. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` pre obrázky) |
| `fallbackCredentialId` | UUID (voliteľné) | Záložné prihlasovacie údaje, keď primárne zlyhajú |
| `fallbackModel` | string (voliteľné) | Záložný model, keď primárny zlyhá |

Ak primárne prihlasovacie údaje alebo model vrátia chybu, uzol automaticky zopakuje pokus so záložnými prihlasovacími údajmi a modelom pred tým, než zlyhá.

Heym tiež kontroluje **schopnosť batch** na základe vybraných prihlasovacích údajov a modelu. Režim batch je dostupný pre:

- Prihlasovacie údaje OpenAI
- Vlastné prihlasovacie údaje alebo prihlasovacie údaje kompatibilné s OpenAI, ktorých endpoint sprístupňuje požadované API `/v1/files` a `/v1/batches`

Ak vybraný poskytovateľ alebo model nepodporuje vykonávanie batch, panel Vlastnosti to zobrazí priamo a vypne prepínač.

### Prompty (textový režim)

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `systemInstruction` | string | Systémový prompt. Podporuje [výrazy](../reference/expression-dsl.md). |
| `userMessage` | string | Správa používateľa. Predvolené: `$input.text` |
| `temperature` | number | 0.0–2.0 (predvolené: 0.7) |
| `maxTokens` | number | Maximálny počet tokenov odpovede (voliteľné) |
| `requestTimeoutSeconds` | number | Maximálny počet sekúnd čakania na odpoveď modelu pred vypršaním časového limitu (predvolené: 60). Zvýšte ho pre pomalých alebo samohostovaných poskytovateľov (LiteLLM, vLLM, lokálne modely). |

### Obrázok a výstup

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Generovanie textu alebo obrázka |
| `imageInputEnabled` | boolean | Zahrnúť obrázok so správou používateľa (videnie) |
| `imageInput` | expression | Base64 data URL alebo URL obrázka |
| `jsonOutputEnabled` | boolean | Štruktúrovaný výstup JSON |
| `jsonOutputSchema` | string | JSON Schema pre štruktúrovaný výstup |
| `extraBodyEnabled` | boolean | Odoslať parametre požiadavky špecifické pre poskytovateľa (predvolené: `false`) |
| `extraBody` | string | Objekt JSON zlúčený do tela požiadavky API |

### Reasoning modely (o1, o3)

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Zapnúť pre reasoning modely |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Hĺbka uvažovania |

### Režim batch

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Použiť natívne Batch API poskytovateľa namiesto vykonávania jednotlivých požiadaviek |

Režim batch je dostupný iba na uzle **LLM**. **Nevzťahuje** sa na [uzol Agent](./agent-node.md).

Keď je režim batch zapnutý:

- `outputType` musí zostať `text`
- `imageInputEnabled` musí zostať `false`
- `userMessage` sa musí vyhodnotiť na **pole**
- každá položka poľa sa musí vyhodnotiť na reťazec alebo primitívnu hodnotu

Typické príklady:

- `$input.items.map("item.text")`
- `$vars.promptList`

Ak sa výraz vyhodnotí na jeden reťazec namiesto poľa, spustenie zlyhá s chybou validácie pred začatím volania poskytovateľa.

## Vetva stavu batch

Keď je režim batch zapnutý, uzol LLM sprístupňuje druhý výstupný handle: `batchStatus`.

Túto vetvu použite na upozornenia, logovanie, správy Slack alebo vedľajšie efekty, kým batch stále beží. Vetva sa spustí vždy, keď sa stav poskytovateľa významne zmení, vrátane normalizovaných stavov, ako napríklad:

- `pending`
- `processing`
- `completed`
- `failed`

Payload vetvy stavu je dostupný ako `$input` v nadväzujúcich uzloch a obsahuje:

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

Príklad hrany:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Príklad mapovača stavu:

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

## Tvar výsledku batch

Pri úspešnom dokončení hlavný výstup LLM obsahuje:

- `$nodeLabel.text` – zreťazené úspešné texty
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – výsledky pre jednotlivé položky v pôvodnom poradí
- `$nodeLabel.usage`

Každá položka v `$nodeLabel.results` obsahuje polia, ako napríklad:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Keď je **výstup JSON** zapnutý spolu s režimom batch, Heym parsuje každú úspešnú položku samostatne. Parsované objekty sú sprístupnené pre jednotlivé položky a zhromaždené v `parsedResults`.
## Responses API

Začiarkavacie políčko **Use Responses API** smeruje volanie uzla cez
[Responses API](https://platform.openai.com/docs/api-reference/responses) namiesto Chat
Completions. Predvolene je vypnuté a uzol sa správa v oboch prípadoch rovnako: rovnaké prompty,
rovnaká výstupná schéma JSON, rovnaký tvar výsledku.

Funguje s prihlasovacími údajmi OpenAI a s vlastnými prihlasovacími údajmi, ktorých brána
podporuje tento endpoint, takže ho môže využiť aj samostatne hostovaná alebo proxy konfigurácia.
S prihlasovacími údajmi Google zostáva vypnuté a nie je možné ho kombinovať s
[režimom Batch](#batch-status-branch) – panel uzla uvádza, ako sú na tom dané prihlasovacie údaje,
ešte pred spustením.

Ak sa endpoint v čase spustenia ukáže ako nedostupný, uzol zlyhá so správou, ktorá pomenúva
príčinu, namiesto tichého návratu k predvolenému správaniu, takže uzol nakonfigurovaný pre
Responses API na ňom vždy beží. Na zámerný návrat k iným prihlasovacím údajom alebo modelu
použite polia **Fallback Credential** a **Fallback Model**; dedia toto začiarkavacie políčko,
takže aj záložné prihlasovacie údaje musia podporovať tento endpoint.

## Generovanie obrázkov

- **Modely:** `nanobanana`, `gemini-2.0-flash-exp`
- **Výstup:** `$nodeLabel.image` (base64 data URL)
- Pri použití [Input](./input-node.md) pre prompt použite `$userPrompt.body.text` v `userMessage`

## Výstup JSON

Keď je `jsonOutputEnabled` true, LLM vráti JSON zodpovedajúci schéme. K poliam pristupujte cez `$nodeLabel.fieldName`.

## Extra Body

Niektorí poskytovatelia akceptujú parametre požiadavky, ktoré štandardné polia kompatibilné s
OpenAI nepokrývajú, napríklad vypnutie režimu uvažovania modelu. Začiarknite **Send extra request
body** vo vlastnostiach uzla a zadajte objekt JSON. Zlúči sa do každej API požiadavky, ktorú tento
uzol vykoná.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Predvolene vypnuté.** Pri vypnutom začiarkavacom políčku sa neposiela nič navyše.
- Musí to byť JSON **objekt**. Pole, skalárna hodnota alebo nesprávne naformátovaný text spôsobí
  zlyhanie uzla s hlásením `Invalid extra body JSON` namiesto tichého zahodenia.
- Tlačidlo **Format** vedľa začiarkavacieho políčka preformátuje JSON a sčervenie s textom
  `Invalid`, keď sa text nedá spracovať.
- Aplikuje sa na hlavné dokončenie, pokus so záložným modelom a požiadavky v režime Batch.
  **Neaplikuje** sa na generovanie obrázkov ani na kontroly guardrails, ktoré používajú odlišný
  tvar požiadavky a samostatný model.
- Výrazy `$` sa vyhodnocujú pred spracovaním, takže `{"max_tokens": $prev.limit}` funguje. Keďže
  ide o textovú substitúciu, vyhodnotená hodnota obsahujúca úvodzovku alebo znak nového riadku
  vytvorí neplatný JSON a spôsobí zlyhanie uzla.

## Príklad – Text

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

## Príklad – Batch text

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

## Príklad – Generovanie obrázkov

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

Zapnutím **Guardrails** vo vlastnostiach uzla zablokujete nebezpečné používateľské správy pred
volaním LLM. Úplnú referenciu nájdete v [Guardrails](../reference/guardrails.md).

## Súvisiace

- [Agent Node](./agent-node.md) – LLM s volaním nástrojov
- [Why Heym](../getting-started/why-heym.md) – Kam patria kroky LLM v životnom cykle agenta
- [Guardrails](../reference/guardrails.md) – Blokovanie kategórií nebezpečného obsahu
- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Expression DSL](../reference/expression-dsl.md) – Odkazovanie na dáta v promptoch
- [Expression Evaluation Dialog](../reference/expression-evaluation-dialog.md) – Rozbaliteľný editor so živým náhľadom backendu pre prompty
- [Credentials Tab](../tabs/credentials-tab.md) – Pridanie API kľúčov pre LLM
- [Quick Start](../getting-started/quick-start.md) – Základný LLM workflow
