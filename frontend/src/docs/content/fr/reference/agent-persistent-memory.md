# Mémoire persistante de l'Agent

Les Nœuds Agent peuvent conserver un **graphe de connaissances par nœud** stocké dans la base de données : entités (avec types et propriétés) et relations entre elles. Lorsqu'elle est activée, Heym **injecte un résumé de ce graphe dans le prompt système** à chaque exécution (si le graphe n'est pas vide). Après une exécution réussie, une **tâche d'extraction LLM** fusionne en arrière-plan les nouveaux faits issus de la conversation dans le graphe.

Les sous-agents et les orchestrateurs utilisent chacun par défaut le graphe associé à **leur propre nœud du canvas**. Vous pouvez également **accorder à d'autres agents un accès en lecture ou en lecture/écriture** au graphe de ce nœud (y compris des agents situés dans **d'autres workflows** que vous possédez) — voir [Partage avec d'autres agents](#partage-avec-dautres-agents).

## Activation

| Paramètre | Type | Description |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Lorsque `true`, charge le graphe de ce nœud dans le prompt système et planifie l'extraction post-exécution pour le graphe de ce nœud |
| `memoryShares` | array (optionnel) | Accorde à d'autres nœuds Agent l'accès au graphe de mémoire de **ce** nœud ; voir [Partage](#partage-avec-dautres-agents) |

Activez cette option dans les propriétés du Nœud Agent (**Persistent memory (graph)**). Une icône **cerveau** rose sur le nœud ouvre l'éditeur de graphe lorsque la mémoire est activée (ou lorsqu'un modèle est affiché).

## Éditeur de graphe

La boîte de dialogue affiche les entités sous forme de graphe dirigé par forces animé — cercles colorés dimensionnés selon le nombre de connexions et regroupés par type d'entité — ainsi que des fonctions d'édition et de navigation (ajustement de la vue, disposition ordonnée, raccourcis clavier). Vous pouvez **ajouter, modifier ou supprimer** manuellement des nœuds et des arêtes ; les sélecteurs de relation Source/Target sont dotés d'une recherche pour les graphes comportant de nombreuses entités. La sélection d'un nœud affiche ses connexions sortantes et entrantes, chacune cliquable pour accéder à ce nœud. Les modifications s'appliquent uniquement au graphe de **cet** agent (le graphe du nœud du canvas dont vous avez ouvert le cerveau).

## Partage avec d'autres agents

Dans la boîte de dialogue du graphe de mémoire, **Share memory with other agents** vous permet d'associer des **pairs** susceptibles de consommer ce graphe à l'exécution :

1. Choisissez un **workflow** (tout workflow que vous pouvez ouvrir dans l'éditeur).
2. Choisissez un nœud **agent** dans ce workflow.
3. Définissez **Read only** ou **Read & write**.

| Permission | Effet |
|------------|-------|
| Read only | Lorsque l'agent **pair** s'exécute, ce graphe est fusionné dans le prompt système du pair (s'il contient des entités). Aucune extraction vers ce graphe depuis l'exécution du pair. |
| Read & write | Même comportement de prompt qu'en lecture, et après un achèvement **réussi** du pair, l'extraction de mémoire habituelle peut également **fusionner dans ce graphe (propriétaire)** en utilisant l'identifiant du pair. |

Les pairs sont stockés par nœud propriétaire sous forme d'entrées `memoryShares` avec `peerWorkflowId` et `peerCanvasNodeId` (ainsi que `permission`). Les workflows plus anciens peuvent omettre `peerWorkflowId` pour les pairs situés dans le **même** workflow ; l'éditeur considère alors qu'il s'agit du workflow courant.

Le **partage inter-workflows** est résolu à l'exécution en parcourant les workflows **que vous possédez**. Les exécutions sans contexte utilisateur authentifié ne résolvent que les partages définis dans le JSON du workflow **courant** (même canvas).

## Comportement à l'exécution

### Graphe propre (`persistentMemoryEnabled`)

1. **Avant l'appel LLM** — Si le graphe contient des entités, un bloc est ajouté à l'instruction système pour expliquer qu'il s'agit de faits issus d'exécutions antérieures (susceptibles d'être incomplets ; le message utilisateur courant prévaut en cas de conflit).
2. **Après un achèvement réussi** — Une tâche en arrière-plan demande au modèle (même identifiant que l'exécution de l'agent) un JSON structuré (entités + relations). Ce payload est fusionné dans la base de données (déduplication et nettoyage des relations appliqués pour certains types, par exemple les arêtes de type emploi).

### Pair recevant des graphes partagés

Lorsqu'un agent s'exécute, le système recherche les nœuds **propriétaires** (dans l'un de vos workflows, lorsque cela est possible) dont les `memoryShares` pointent vers le workflow et le nœud du canvas de cette exécution. Pour chaque correspondance, le graphe de ce propriétaire est ajouté en tant que section **shared memory** dans le prompt système. Les pairs en **Read & write** planifient en outre des cibles d'extraction pour le workflow/graphe **propriétaire** lorsque l'exécution réussit.

L'extraction ne s'exécute **pas** lorsque l'exécution échoue ou se termine dans un état HITL en attente.

## JSON du Workflow (champ `data`)

Persisté sur le nœud agent comme les autres paramètres :

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` vaut `"read"` ou `"write"`. Omettez `memoryShares` ou utilisez `[]` lorsqu'aucun partage n'est défini.

Consultez [Workflow Structure](./workflow-structure.md) pour la structure complète de l'objet nœud.
## Related

- [Nœud Agent](../nodes/agent-node.md) — Configuration complète de l'agent
- [Architecture de l'agent](./agent-architecture.md) — Orchestrateur, sous-agents, outils
- [Structure du Workflow](./workflow-structure.md) — Format JSON du Workflow
- [Fonctionnalités du Canvas](./canvas-features.md) — Contrôle du cerveau et dialogue du graphe
- [Onglet Traces](../tabs/traces-tab.md) — Observabilité des requêtes/réponses LLM
