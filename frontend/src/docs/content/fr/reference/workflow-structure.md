# Structure des Workflows

Les Workflows sont stockés au format JSON avec des nœuds et des arêtes. Consultez [Types de nœuds](./node-types.md) pour les types de nœuds disponibles et [Expression DSL](./expression-dsl.md) pour la syntaxe des expressions dans les champs `data`.

## Objet Workflow

```json
{
  "id": "uuid",
  "name": "My Workflow",
  "description": "Optional description",
  "nodes": [],
  "edges": [],
  "auth_type": "anonymous",
  "allow_anonymous": true
}
```

## Objet Nœud

```json
{
  "id": "node-uuid",
  "type": "llm",
  "position": { "x": 100, "y": 200 },
  "data": {
    "label": "llm",
    "model": "gpt-4",
    "userMessage": "$input.text"
  }
}
```

### `data` du nœud Agent (mémoire persistante)

Les nœuds [Agent](../nodes/agent-node.md) prennent en charge un graphe de connaissances optionnel par nœud de canvas :

| Champ | Type | Description |
|-------|------|-------------|
| `persistentMemoryEnabled` | boolean | Lorsque la valeur est `true`, charge le graphe stocké dans le prompt système et fusionne les nouveaux faits après les exécutions réussies |
| `memoryShares` | array (optionnel) | Accorde à d'autres agents l'accès au graphe de mémoire de ce nœud (`peerWorkflowId`, `peerCanvasNodeId`, `permission` : `read` \| `write`). Consultez [Mémoire persistante de l'Agent](./agent-persistent-memory.md). |

Exemple :

```json
{
  "id": "agent-main",
  "type": "agent",
  "position": { "x": 200, "y": 120 },
  "data": {
    "label": "assistant",
    "persistentMemoryEnabled": true,
    "credentialId": "uuid",
    "model": "gpt-4o",
    "userMessage": "$input.text",
    "memoryShares": []
  }
}
```

Consultez [Mémoire persistante de l'Agent](./agent-persistent-memory.md) pour les chemins d'API, le comportement de l'éditeur et la sémantique d'extraction.

## Objet Arête

```json
{
  "id": "edge-uuid",
  "source": "input-node-id",
  "target": "llm-node-id",
  "sourceHandle": null,
  "targetHandle": null
}
```

## Types de nœuds

Valeurs `type` courantes : [Input](../nodes/input-node.md) (`textInput`), [Cron](../nodes/cron-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md) (`websocketTrigger`), [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md) (`jsonOutputMapper`), [Wait](../nodes/wait-node.md), [HTTP](../nodes/http-node.md), [WebSocket Send](../nodes/websocket-send-node.md) (`websocketSend`), [Merge](../nodes/merge-node.md), [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md), [Loop](../nodes/loop-node.md), et bien d'autres. Liste complète : [Types de nœuds](./node-types.md). Les nœuds d'un même niveau d'exécution s'exécutent en [parallèle](./parallel-execution.md).

## Disposition de l'éditeur

Chaque nœud possède `position.x` et `position.y` pour la disposition du canvas sur ordinateur. Sur les écrans dont la largeur est inférieure au point de rupture de 768 px, l'éditeur remplace le canvas Vue Flow libre par une arborescence de workflow plein écran et indentée. L'arborescence suit les chemins d'exécution connectés, marque les branches parallèles et utilise les mêmes libellés de nœuds, icônes et statut de la dernière exécution que l'éditeur sur ordinateur.

Appuyez sur un nœud pour le sélectionner. S'il dispose d'un résultat d'exécution enregistré, sa vue détaillée plein écran s'ouvre avec les onglets entrée, sortie et erreur. La navigation inférieure mobile propose **Nodes**, **Properties**, **Run** et **More** ; l'en-tête conserve les actions d'enregistrement, d'historique, de recherche, de paramètres et de partage. Sur ordinateur, le canvas Vue Flow libre et les panneaux latéraux restent utilisés.

Utilisez **Add node** dans l'onglet mobile Nodes pour rechercher dans la bibliothèque de nœuds. Un nœud standard ouvre immédiatement une feuille de connexion après son ajout : choisissez un nœud d'ancrage et placez-le **After**, **Before** ou comme branche **Parallel**. En mode édition, appuyez sur un nœud standard existant pour ouvrir la même feuille avec sa connexion actuelle sélectionnée. Les nœuds Trigger restent indépendants car ils n'acceptent pas d'entrée standard. Le contrôle d'édition expose également une action de suppression pour le nœud sélectionné. Les détails d'exécution incluent des flèches précédent et suivant lorsque les résultats des nœuds adjacents sont disponibles. L'AI Assistant s'ouvre au-dessus de l'arborescence mobile sous forme de feuille inférieure, sans changer l'onglet actif de l'éditeur.

## Voir aussi

- [Types de nœuds](./node-types.md) – Tous les types de nœuds et leurs descriptions
- [Fonctionnalités du Canvas](./canvas-features.md) – Fonctionnalités de l'éditeur (data pin, journaux d'exécution, activation/désactivation, extraction vers un sous-workflow)
- [Téléchargement et import](./download-import.md) – Exporter et importer des workflows au format JSON
- [Nœud Agent](../nodes/agent-node.md) – Structure `data` du nœud Agent
- [Mémoire persistante de l'Agent](./agent-persistent-memory.md) – `persistentMemoryEnabled`, `memoryShares` et API du graphe de mémoire
- [Expression DSL](./expression-dsl.md) – Syntaxe pour `userMessage`, `condition`, `$vars`, `$global`, etc.
- [Exécution parallèle](./parallel-execution.md) – Fonctionnement de l'exécution parallèle des nœuds
- [Triggers](./triggers.md) – Nœuds de départ et points d'entrée
- [Onglet Workflows](../tabs/workflows-tab.md) – Créer et gérer des workflows
