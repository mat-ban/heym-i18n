# Input

Le nœud **Input** est le point d'entrée des workflows qui reçoivent des données de l'utilisateur ou de l'appelant de l'API. Il prend en charge un ou plusieurs champs d'entrée et expose les métadonnées de la requête (headers, query params).

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 0 |
| Sorties | 1 |
| Sortie | `$nodeLabel.body.fieldKey`, `$nodeLabel.headers`, `$nodeLabel.query` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `label` | string | Identifiant du nœud (camelCase) |
| `value` | string | Valeur par défaut pour une entrée texte unique (facultatif) |
| `inputFields` | array | Définitions des champs d'entrée. Chacune : `{ key, defaultValue? }` |

### Champs d'entrée

| Champ | Type | Description |
|-------|------|-------------|
| `key` | string | Clé du champ (ex. `text`, `imageUrl`, `base64`) |
| `defaultValue` | string | Valeur par défaut si non fournie (facultatif) |

## Accès aux données d'entrée

**Champs du body** (utilisez toujours `$nodeLabel.body.fieldKey`) :

- `$userInput.body.text` – champ texte
- `$userInput.body.imageUrl` – URL d'image
- `$userInput.body.userId` – avec valeur par défaut si configurée
- `$userInput.body.event.user.id` – JSON imbriqué en mode webhook Generic

**Métadonnées de la requête** (lors d'une exécution via API) :

- `$userInput.headers` – tous les headers (clés en minuscules)
- `$userInput.headers.authorization` – header spécifique
- `$userInput.query` – query parameters
- `$userInput.query.param1` – query param spécifique

## Saisie de fichiers dans le panneau Run

Dans l'onglet **Run** de l'éditeur (mode webhook Defined), chaque champ d'entrée prend en charge le glisser-déposer ainsi qu'un contrôle de pièce jointe intégré (en bas à droite du champ) :

- **Fichiers texte** (`.txt`, `.md`, `.json`, `.csv` et similaires) sont lus comme du texte brut.
- **Images** (JPEG, PNG, GIF, WebP) sont stockées sous forme d'URL `data:` (base64) dans la valeur du champ — utilisez des clés de champ telles que `imageUrl` ou `base64` lorsque les nœuds en aval attendent des données d'image.
- **Fichiers PDF** sont convertis en texte extrait (fichier de 5 Mo max, 100k caractères de contenu).

Un fichier par champ. Vous pouvez toujours modifier la zone de texte après le chargement d'un fichier. Le mode webhook Generic (body JSON brut) n'affiche pas de contrôles de fichier par champ.

## Champs d'entrée vs webhooks Generic

`inputFields` décrit toujours les entrées attendues pour les formulaires de l'éditeur en mode defined, le mapping des sous-workflows et les autres surfaces pilotées par les métadonnées.

Lorsqu'un workflow utilise le mode de body webhook **Generic**, le body HTTP entrant n'est pas remodelé à partir de `inputFields`. À la place, le payload JSON brut est transmis tel quel à `$nodeLabel.body`, et les contrôles d'ajout/suppression de champs du nœud Input sont masqués dans le panneau du nœud.

## Exemples

**Entrée unique (par défaut) :**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [{ "key": "text" }]
  }
}
```

**Entrées multiples :**

```json
{
  "type": "textInput",
  "data": {
    "label": "userInput",
    "inputFields": [
      { "key": "text" },
      { "key": "imageUrl" },
      { "key": "userId", "defaultValue": "anonymous" }
    ]
  }
}
```

## Voir aussi

- [Node Types](../reference/node-types.md) – Aperçu de tous les types de nœuds
- [Triggers](../reference/triggers.md) – Points d'entrée (Input, Cron, RabbitMQ)
- [Expression DSL](../reference/expression-dsl.md) – Référencement de `$nodeLabel.body`, `$nodeLabel.query`
- [Portal](../reference/portal.md) – Exposer les workflows sous forme d'interfaces de chat
- [Webhooks](../reference/webhooks.md) – Trigger HTTP pour les workflows
