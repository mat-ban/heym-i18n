# Concepts fondamentaux

## Workflows

Un workflow est un graphe orienté de [**nœuds**](../reference/node-types.md) reliés par des **edges**. Gérez les workflows dans l'onglet [Workflows](../tabs/workflows-tab.md). Organisez-les dans des [dossiers](../reference/workflow-organization.md). L'exécution se propage depuis les [nœuds Trigger](../reference/triggers.md) ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) à travers les nœuds de traitement jusqu'aux nœuds de [sortie](../nodes/output-node.md). Consultez la section [Structure de workflow](../reference/workflow-structure.md) pour le format JSON. Enregistrez et partagez les workflows sous forme de [Modèles](../tabs/templates-tab.md) afin de les réutiliser entre projets. Les workflows peuvent également être exécutés depuis le [Board](../tabs/board-tab.md), où les cartes kanban déclenchent la chaîne de workflows d'une colonne avec le contexte complet de la carte.

## Nœuds

Chaque nœud comporte :

- **Type** – Détermine le comportement (par ex. `llm`, `condition`, `http`)
- **Data** – Configuration (modèle, prompt, URL, etc.)
- **Inputs/Outputs** – Points de connexion vers d'autres nœuds

Consultez la section [Types de nœuds](../reference/node-types.md) pour la liste complète.

## Edges

Les edges relient le point de sortie d'un nœud source au point d'entrée d'un nœud cible. Les données circulent le long des edges pendant l'exécution.

## Flux d'exécution

1. **Trigger** – Un nœud Input, Cron, Telegram Trigger, Discord Trigger, IMAP Trigger ou [WebSocket Trigger](../nodes/websocket-trigger-node.md) démarre l'exécution (voir [Triggers](../reference/triggers.md))
2. **Downstream** – Chaque nœud reçoit la sortie des nœuds upstream connectés ; l'[exécution parallèle](../reference/parallel-execution.md) exécute les nœuds indépendants simultanément
3. **Expressions** – Les nœuds référencent les données upstream via `$nodeLabel.field`. Voir [Expression DSL](../reference/expression-dsl.md).
4. **Output** – Le nœud [Output](../nodes/output-node.md) produit le résultat final

## Références d'expressions

Utilisez `$input` pour les données du nœud Input et `$nodeLabel.field` pour tout nœud upstream. Exemple : `$llm.text` référence le champ `text` d'un nœud étiqueté « llm ». Syntaxe complète : [Expression DSL](../reference/expression-dsl.md). Utilisez la [Boîte de dialogue d'évaluation d'expression](../reference/expression-evaluation-dialog.md) pour disposer d'un éditeur plus grand avec un aperçu backend en direct lors de l'édition d'expressions.

## Voir aussi

- [Démarrage rapide](./quick-start.md) – Créez votre premier workflow
- [Fonctionnalités du Canvas](../reference/canvas-features.md) – Data pin, journaux d'exécution, activation/désactivation, extraction vers un sous-workflow
- [Assistant IA](../reference/ai-assistant.md) – Créez des workflows en langage naturel
- [Types de nœuds](../reference/node-types.md) – Tous les nœuds disponibles
- [Expression DSL](../reference/expression-dsl.md) – Référencer des données dans les expressions
- [Boîte de dialogue d'évaluation d'expression](../reference/expression-evaluation-dialog.md) – Éditeur extensible avec aperçu backend en direct
- [Onglet Workflows](../tabs/workflows-tab.md) – Gérer les workflows et les dossiers
- [Organisation des workflows](../reference/workflow-organization.md) – Dossiers et suppression planifiée
- [Triggers](../reference/triggers.md) – Points d'entrée des workflows
- [Webhooks](../reference/webhooks.md) – Trigger Webhook HTTP (TTL, cache, rate limit)
- [Exécution parallèle](../reference/parallel-execution.md) – Fonctionnement de l'exécution parallèle des nœuds
