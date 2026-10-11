# LLM

Le nœud **LLM** traite du texte avec un modèle de langage ou génère des images. Il prend en charge la génération de texte, la vision (entrée d'image), la génération d'images, la sortie JSON structurée et l'exécution via la **Batch API** native du fournisseur pour les modèles de texte compatibles.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1, plus un `batchStatus` optionnel lorsque le mode batch est activé |
| Sortie | `$nodeLabel.text` (texte), `$nodeLabel.image` (image), ou des champs de résultat batch tels que `$nodeLabel.results` |

## Paramètres

### Identifiant et modèle

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant LLM issu des [Identifiants](../tabs/credentials-tab.md) |
| `model` | string | Nom du modèle (ex. `gpt-4o`, `gemini-2.5-flash-lite`, `nanobanana` pour les images) |
| `fallbackCredentialId` | UUID (optionnel) | Identifiant de secours lorsque le principal échoue |
| `fallbackModel` | string (optionnel) | Modèle de secours lorsque le principal échoue |

Si l'identifiant ou le modèle principal renvoie une erreur, le nœud réessaie automatiquement avec l'identifiant et le modèle de secours avant d'échouer.

Heym vérifie également la **capacité batch** à partir de l'identifiant et du modèle sélectionnés. Le mode batch est disponible pour :

- Les identifiants OpenAI
- Les identifiants personnalisés / compatibles OpenAI dont l'endpoint expose les API requises `/v1/files` et `/v1/batches`

Si le fournisseur ou le modèle sélectionné ne prend pas en charge l'exécution batch, le panneau Propriétés l'indique directement et désactive le bouton bascule.

### Prompts (mode texte)

| Paramètre | Type | Description |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt système. Prend en charge les [expressions](../reference/expression-dsl.md). |
| `userMessage` | string | Message utilisateur. Par défaut : `$input.text` |
| `temperature` | number | 0.0–2.0 (par défaut : 0.7) |
| `maxTokens` | number | Nombre maximal de tokens en réponse (optionnel) |
| `requestTimeoutSeconds` | number | Nombre maximal de secondes d'attente de la réponse du modèle avant expiration (par défaut : 60). Augmentez cette valeur pour les fournisseurs lents ou auto-hébergés (LiteLLM, vLLM, modèles locaux). |

### Image et sortie

| Paramètre | Type | Description |
|-----------|------|-------------|
| `outputType` | `"text"` \| `"image"` | Génération de texte ou d'image |
| `imageInputEnabled` | boolean | Inclure une image avec le message utilisateur (vision) |
| `imageInput` | expression | URL de données Base64 ou URL d'image |
| `jsonOutputEnabled` | boolean | Sortie JSON structurée |
| `jsonOutputSchema` | string | JSON Schema pour la sortie structurée |
| `extraBodyEnabled` | boolean | Envoyer des paramètres de requête spécifiques au fournisseur (par défaut : `false`) |
| `extraBody` | string | Objet JSON fusionné dans le corps de la requête API |

### Modèles de raisonnement (o1, o3)

| Paramètre | Type | Description |
|-----------|------|-------------|
| `isReasoningModel` | boolean | Activer pour les modèles de raisonnement |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Profondeur du raisonnement |

### Mode batch

| Paramètre | Type | Description |
|-----------|------|-------------|
| `batchModeEnabled` | boolean | Utiliser la Batch API native du fournisseur au lieu d'une exécution par requête unique |

Le mode batch est disponible uniquement sur le nœud **LLM**. Il ne s'applique **pas** au [Nœud Agent](./agent-node.md).

Lorsque le mode batch est activé :

- `outputType` doit rester `text`
- `imageInputEnabled` doit rester `false`
- `userMessage` doit être résolu en un **tableau**
- chaque élément du tableau doit être résolu en une chaîne ou une valeur primitive

Exemples typiques :

- `$input.items.map("item.text")`
- `$vars.promptList`

Si l'expression est résolue en une chaîne unique au lieu d'un tableau, l'exécution échoue avec une erreur de validation avant le démarrage de l'appel au fournisseur.

## Branche Batch Status

Lorsque le mode batch est activé, le nœud LLM expose un second handle de sortie : `batchStatus`.

Utilisez cette branche pour les notifications, la journalisation, les messages Slack ou les effets de bord pendant que le batch est toujours en cours d'exécution. La branche se déclenche chaque fois que le statut du fournisseur change de manière significative, y compris les états normalisés suivants :

- `pending`
- `processing`
- `completed`
- `failed`

Le payload de la branche de statut est disponible sous la forme `$input` dans les nœuds en aval et inclut :

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

Exemple d'arête :

```json
{
  "id": "edge-status",
  "source": "batchLlmNode",
  "sourceHandle": "batchStatus",
  "target": "notifyProgress"
}
```

Exemple de mapper de statut :

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
## Forme du résultat par lot

Lors d'une exécution réussie, la sortie principale du LLM contient :

- `$nodeLabel.text` – textes réussis concaténés
- `$nodeLabel.batchId`
- `$nodeLabel.status`
- `$nodeLabel.rawStatus`
- `$nodeLabel.requestCounts`
- `$nodeLabel.total`
- `$nodeLabel.completed`
- `$nodeLabel.failed`
- `$nodeLabel.results` – résultats par élément dans l'ordre d'origine
- `$nodeLabel.usage`

Chaque élément de `$nodeLabel.results` inclut des champs tels que :

- `index`
- `customId`
- `status`
- `statusCode`
- `text`
- `error`
- `usage`

Lorsque la **sortie JSON** est activée conjointement avec le mode batch, Heym analyse séparément chaque élément réussi. Les objets analysés sont exposés par élément et collectés dans `parsedResults`.

## API Responses

Une case à cocher **Use Responses API** achemine l'appel du nœud via l'
[API Responses](https://platform.openai.com/docs/api-reference/responses) au lieu de Chat
Completions. Elle est désactivée par défaut, et le nœud se comporte de la même manière dans les deux cas : mêmes prompts,
même schéma de sortie JSON, même forme de résultat.

Elle fonctionne avec un identifiant OpenAI, ainsi qu'avec un identifiant personnalisé dont la passerelle prend en charge
l'endpoint, ce qui permet également à une configuration auto-hébergée ou proxy de l'utiliser. Avec un identifiant Google, elle reste
désactivée, et elle ne peut pas être combinée avec le [mode Batch](#batch-status-branch) - le panneau du nœud indique
où en est un identifiant donné avant toute exécution.

Si l'endpoint s'avère indisponible au moment de l'exécution, le nœud échoue avec un message nommant la
cause plutôt que de basculer silencieusement, de sorte qu'un nœud configuré pour l'API Responses fonctionne toujours
avec celle-ci. Pour basculer délibérément vers un autre identifiant ou modèle, utilisez les champs **Fallback
Credential** et **Fallback Model** ; ils héritent de cette case à cocher, de sorte qu'un identifiant de repli
doit également prendre en charge l'endpoint.

## Génération d'images

- **Modèles :** `nanobanana`, `gemini-2.0-flash-exp`
- **Sortie :** `$nodeLabel.image` (URL de données base64)
- Lors de l'utilisation d'[Input](./input-node.md) pour le prompt, utilisez `$userPrompt.body.text` dans `userMessage`

## Sortie JSON

Lorsque `jsonOutputEnabled` est vrai, le LLM renvoie un JSON correspondant au schéma. Accédez aux champs via `$nodeLabel.fieldName`.

## Extra Body

Certains fournisseurs acceptent des paramètres de requête que les champs standard compatibles OpenAI ne
couvrent pas, comme la désactivation du mode de réflexion d'un modèle. Cochez **Send extra request body** dans les
propriétés du nœud et saisissez un objet JSON. Il est fusionné dans chaque requête API effectuée par ce nœud.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Désactivé par défaut.** Lorsque la case est décochée, rien de supplémentaire n'est envoyé.
- Doit être un **objet** JSON. Un tableau, un scalaire ou un texte mal formé fait échouer le nœud avec
  `Invalid extra body JSON` plutôt que d'être ignoré silencieusement.
- Le bouton **Format** à côté de la case à cocher reformate le JSON, et devient rouge en affichant
  `Invalid` lorsque le texte ne peut pas être analysé.
- Appliqué à la complétion principale, à la tentative du modèle de repli et aux requêtes en mode batch.
  **Non** appliqué à la génération d'images ni aux vérifications de garde-fous, qui utilisent une forme de requête
  différente et un modèle distinct.
- Les expressions `$` sont résolues avant l'analyse, donc `{"max_tokens": $prev.limit}` fonctionne. Comme
  il s'agit d'une substitution textuelle, une valeur résolue contenant un guillemet double ou un saut de ligne
  produit un JSON invalide et fait échouer le nœud.

## Exemple – Texte

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
## Exemple – Traitement par lots de texte

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

## Exemple – Génération d'images

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

Activez les **Guardrails** dans les propriétés du nœud afin de bloquer les messages utilisateur non sécurisés avant l'appel au LLM. Consultez [Guardrails](../reference/guardrails.md) pour la référence complète.

## Voir aussi

- [Nœud Agent](./agent-node.md) – LLM avec appel d'outils
- [Pourquoi Heym](../getting-started/why-heym.md) – Où s'intègrent les étapes LLM dans le cycle de vie de l'agent
- [Guardrails](../reference/guardrails.md) – Bloquer les catégories de contenu non sécurisé
- [Types de nœuds](../reference/node-types.md) – Vue d'ensemble de tous les types de nœuds
- [DSL d'expression](../reference/expression-dsl.md) – Référencer des données dans les prompts
- [Boîte de dialogue d'évaluation d'expression](../reference/expression-evaluation-dialog.md) – Éditeur extensible avec aperçu backend en direct pour les prompts
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter des clés API LLM
- [Démarrage rapide](../getting-started/quick-start.md) – Workflow LLM de base
