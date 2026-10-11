# LLM

El node **LLM** processa text amb un model de llenguatge o genera imatges. Admet generació de text, visió (entrada d'imatge), generació d'imatges, sortida JSON estructurada i execució mitjançant la **Batch API** nativa del proveïdor per als models de text compatibles.

## Visió general

| Propietat | Valor |
|----------|-------|
| Entrades | 1 |
| Sortides | 1, més un `batchStatus` opcional quan el mode batch està habilitat |
| Sortida | `$nodeLabel.text` (text), `$nodeLabel.image` (imatge) o camps de resultat del batch com ara `$nodeLabel.results` |

## Paràmetres

### Credencial i model

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `credentialId` | UUID | Credencial LLM de [Credencials](../tabs/credentials-tab.md) |
| `model` | string | Nom del model (p. ex. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` per a imatges) |
| `fallbackCredentialId` | UUID (opcional) | Credencial de reserva quan la principal falla |
| `fallbackModel` | string (opcional) | Model de reserva quan el principal falla |

Si la credencial o el model principal retorna un error, el node reintenta automàticament amb la credencial i el model de reserva abans de fallar.

Heym també comprova la **capacitat de batch** de la credencial i el model seleccionats. El mode batch està disponible per a:

- Credencials d'OpenAI
- Credencials personalitzades o compatibles amb OpenAI el endpoint de les quals exposi les API `/v1/files` i `/v1/batches` necessàries

Si el proveïdor o el model seleccionats no admeten execució per batch, el tauler de Propietats ho indica directament i desactiva l'interruptor.

### Prompts (mode text)

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt de sistema. Admet [expressions](../reference/expression-dsl.md). |
| `userMessage` | string | Missatge d'usuari. Per defecte: `$input.text` |
| `temperature` | number | 0.0–2.0 (per defecte: 0.7) |
| `maxTokens` | number | Nombre màxim de tokens de resposta (opcional) |
| `requestTimeoutSeconds` | number | Nombre màxim de segons d'espera de la resposta del model abans d'esgotar el temps (per defecte: 60). Augmenteu-lo per a proveïdors lents o autoallotjats (LiteLLM, vLLM, models locals). |

### Imatge i sortida

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Generació de text o d'imatge |
| `imageInputEnabled` | boolean | Inclou una imatge amb el missatge d'usuari (visió) |
| `imageInput` | expression | URL de dades Base64 o URL d'imatge |
| `jsonOutputEnabled` | boolean | Sortida JSON estructurada |
| `jsonOutputSchema` | string | JSON Schema per a la sortida estructurada |
| `extraBodyEnabled` | boolean | Envia paràmetres de sol·licitud específics del proveïdor (per defecte: `false`) |
| `extraBody` | string | Objecte JSON fusionat amb el cos de la sol·licitud de l'API |

### Models de raonament (o1, o3)

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Habiliteu-ho per als models de raonament |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Profunditat del raonament |

### Mode batch

| Paràmetre | Tipus | Descripció |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Utilitza la Batch API nativa del proveïdor en lloc de l'execució d'una sola sol·licitud |

El mode batch només està disponible al node **LLM**. **No** s'aplica al [Node Agent](./agent-node.md).

Quan el mode batch està habilitat:

- `outputType` ha de romandre com a `text`
- `imageInputEnabled` ha de romandre com a `false`
- `userMessage` ha de resoldre's en un **array**
- cada element de l'array ha de resoldre's en una cadena o un valor primitiu

Exemples típics:

- `$input.items.map("item.text")`
- `$vars.promptList`

Si l'expressió es resol en una única cadena en lloc d'un array, l'execució falla amb un error de validació abans que comenci la crida al proveïdor.

## Branca d'estat del batch

Quan el mode batch està habilitat, el node LLM exposa un segon connector de sortida: `batchStatus`.

Utilitzeu aquesta branca per a notificacions, registre, missatges de Slack o efectes secundaris mentre el batch encara s'està executant. La branca s'activa sempre que l'estat del proveïdor canvia de manera significativa, incloent-hi estats normalitzats com ara:

- `pending`
- `processing`
- `completed`
- `failed`

El payload de la branca d'estat està disponible com a `$input` dins dels nodes posteriors i inclou:

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

Exemple d'aresta:

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Exemple de mapador d'estat:

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
## Forma del resultat per lots

En completar-se correctament, la sortida principal del LLM conté:

- `$nodeLabel.text` – textos correctes concatenats
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – resultats per element en l'ordre original
- `$nodeLabel.usage`

Cada element de `$nodeLabel.results` inclou camps com ara:

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Quan la **sortida JSON** està habilitada juntament amb el mode per lots, Heym analitza cada element correcte per separat. Els objectes analitzats s'exposen per element i es recullen a `parsedResults`.

## API de Responses

Una casella de selecció **Use Responses API** encamina la crida del node a través de
l'[API de Responses](https://platform.openai.com/docs/api-reference/responses) en lloc de Chat
Completions. Està desactivada per defecte, i el node es comporta igual en tots dos casos: els mateixos prompts,
el mateix esquema de sortida JSON, la mateixa forma de resultat.

Funciona amb una credencial d'OpenAI, i amb una credencial personalitzada el gateway de la qual admeti
l'endpoint, de manera que una configuració autoallotjada o amb proxy també pot utilitzar-la. Amb una credencial de Google roman
desactivada, i no es pot combinar amb el [mode per lots](#batch-status-branch) - el panell del node indica
on es troba una credencial determinada abans que executeu res.

Si l'endpoint resulta no estar disponible en temps d'execució, el node falla amb un missatge que nomena la
causa en lloc de retrocedir silenciosament, de manera que un node configurat per a l'API de Responses sempre
s'executa sobre aquesta. Per retrocedir deliberadament a una altra credencial o model, utilitzeu els camps **Fallback
Credential** i **Fallback Model**; hereten aquesta casella de selecció, de manera que una credencial de reserva
també ha d'admetre l'endpoint.

## Generació d'imatges

- **Models:** `nanobanana`, `gemini-2.0-flash-exp`
- **Sortida:** `$nodeLabel.image` (URL de dades base64)
- Quan utilitzeu [Input](./input-node.md) per al prompt, utilitzeu `$userPrompt.body.text` a `userMessage`

## Sortida JSON

Quan `jsonOutputEnabled` és cert, el LLM retorna JSON que coincideix amb l'esquema. Accediu als camps mitjançant `$nodeLabel.fieldName`.

## Cos addicional

Alguns proveïdors accepten paràmetres de sol·licitud que els camps estàndard compatibles amb OpenAI no
cobreixen, com ara desactivar el mode de pensament d'un model. Marqueu **Send extra request body** a les propietats
del node i introduïu un objecte JSON. Es fusiona en cada sol·licitud d'API que fa aquest node.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Desactivat per defecte.** Amb la casella de selecció desmarcada, no s'envia res addicional.
- Ha de ser un **objecte** JSON. Una matriu, un escalar o text mal format fan fallar el node amb
  `Invalid extra body JSON` en lloc de descartar-se silenciosament.
- El botó **Format** adjacent a la casella de selecció reformata el JSON, i es torna vermell mostrant
  `Invalid` quan el text no s'analitza.
- S'aplica a la compleció principal, a l'intent del model de reserva i a les sol·licituds del mode per lots.
  **No** s'aplica a la generació d'imatges ni a les comprovacions de guardrail, que utilitzen una forma de sol·licitud
  diferent i un model separat.
- Les expressions `$` es resolen abans de l'anàlisi, de manera que `{"max_tokens": $prev.limit}` funciona. Com que
  es tracta d'una substitució textual, un valor resolt que contingui una cometa doble o un salt de línia
  produeix JSON no vàlid i fa fallar el node.

## Exemple – Text

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
## Exemple – Text per lots

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

## Exemple – Generació d'imatges

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

Activeu **Guardrails** a les propietats del node per bloquejar missatges d'usuari no segurs abans de la crida al LLM. Consulteu [Guardrails](../reference/guardrails.md) per a la referència completa.

## Relacionat

- [Node Agent](./agent-node.md) – LLM amb crida d'eines
- [Per què Heym](../getting-started/why-heym.md) – On encaixen els passos del LLM en el cicle de vida de l'agent
- [Guardrails](../reference/guardrails.md) – Bloquegeu categories de contingut no segur
- [Tipus de node](../reference/node-types.md) – Visió general de tots els tipus de node
- [DSL d'expressions](../reference/expression-dsl.md) – Referenciar dades en prompts
- [Diàleg d'avaluació d'expressions](../reference/expression-evaluation-dialog.md) – Editor ampliable amb previsualització en directe del backend per a prompts
- [Pestanya Credencials](../tabs/credentials-tab.md) – Afegir claus API del LLM
- [Inici ràpid](../getting-started/quick-start.md) – Workflow bàsic amb LLM
