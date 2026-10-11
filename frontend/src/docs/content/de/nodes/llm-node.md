# LLM-Knoten

Der **LLM-Knoten** verarbeitet Text mit einem konfigurierten Sprachmodell oder generiert Bilder. Er unterstützt Texterstellung, Vision (Bildeingaben), Bildgenerierung, strukturierte JSON-Ausgabe und provider-native **Batch-API**-Ausführung.

## Übersicht

| Eigenschaft | Wert |
|---|---|
| Eingänge | 1 |
| Ausgänge | 1, plus optional `batchStatus` bei aktiviertem Batch-Modus |
| Ausgabe | `$nodeLabel.text` (Text), `$nodeLabel.image` (Bild) oder Batch-Ergebnisse wie `$nodeLabel.results` |

## Parameter

### Anmeldedaten & Modell

| Parameter | Typ | Beschreibung |
|---|---|---|
| `credentialId` | UUID | LLM-Anmeldedaten aus dem Reiter [Anmeldedaten](../tabs/credentials-tab.md) |
| `model` | string | Modellname (z. B. `gpt-4o`, `deepseek-chat`) |
| `fallbackCredentialId` | UUID (optional) | Fallback-Anmeldedaten bei Providerausfällen |
| `fallbackModel` | string (optional) | Fallback-Modell bei Fehlern |

### Prompts & Texterstellung

| Parameter | Typ | Beschreibung |
|---|---|---|
| `systemInstruction` | string | System-Prompt. Unterstützt [Ausdrücke](../reference/expression-dsl.md). |
| `userMessage` | string | Benutzernachricht / Prompt. Standard: `$input.text` |
| `temperature` | number | 0.0–2.0 (Standard: 0.7) |
| `maxTokens` | number | Maximale Ausgabetokens (optional) |
| `requestTimeoutSeconds` | number | Zeitlimit in Sekunden vor Timeout (Standard: 60) |

### Bild & Strukturierte Ausgabe

| Parameter | Typ | Beschreibung |
|---|---|---|
| `outputType` | `"text"` \| `"image"` | Text- oder Bildgenerierung |
| `imageInputEnabled` | boolean | Bild zur Analyse übergeben (Vision) |
| `imageInput` | expression | Base64 Data-URL oder Bild-URL |
| `jsonOutputEnabled` | boolean | Strukturierte JSON-Ausgabe aktivieren |
| `jsonOutputSchema` | string | JSON-Schema zur Validierung der Modellantwort |

### Batch-Modus

Aktivieren Sie `batchModeEnabled`, um große Arrays von Prompts asynchron über die kostengünstigere Batch-API von OpenAI auszuführen. Der Canvas stellt einen `batchStatus`-Ausgang für Status-Updates bereit.

## Verwandte Themen

- [Agent-Knoten](./agent-node.md) – LLM mit nativer Tool-Schleife
- [Ausdrucks-DSL](../reference/expression-dsl.md) – Variablen und Knotenergebnisse einbinden\n