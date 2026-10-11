# Démarrage rapide

Lancez votre premier workflow Heym en quelques minutes.

Vous n'avez pas encore Heym en cours d'exécution ? Consultez [Exécution et déploiement](./running-and-deployment.md), ou suivez le tutoriel vidéo : [Configurer Heym en local en moins de 2 minutes](https://www.youtube.com/watch?v=P6YvlupUboU).

## 1. Créer un workflow

1. Accédez à l'onglet [Workflows](../tabs/workflows-tab.md)
2. Cliquez sur **New Workflow**
3. Nommez votre workflow (par ex. « Hello World »)

## 2. Ajouter des nœuds

1. Ouvrez le panneau **Nodes** à gauche
2. Faites glisser un nœud [Input](../nodes/input-node.md) sur le canvas
3. Faites glisser un nœud [LLM](../nodes/llm-node.md) et connectez-le à l'Input
4. Faites glisser un nœud [Output](../nodes/output-node.md) et connectez-le au LLM

```
[Input] --> [LLM] --> [Output]
```

Consultez [Types de nœuds](../reference/node-types.md) pour découvrir tous les nœuds disponibles.

## 3. Configurer

- **Input** : définissez une valeur par défaut ou laissez vide pour une saisie utilisateur (voir [Nœud Input](../nodes/input-node.md))
- **LLM** : sélectionnez un [identifiant](../tabs/credentials-tab.md) et un modèle, ajoutez une instruction système, et définissez `userMessage` sur `$input.text` (voir [Nœud LLM](../nodes/llm-node.md))
- **Output** : définissez `message` sur `$llm.text` pour transmettre la réponse du LLM (voir [Nœud Output](../nodes/output-node.md))

Utilisez la syntaxe [Expression DSL](../reference/expression-dsl.md) pour `$input.text` et `$llm.text`. Cliquez sur le bouton d'expansion des champs d'expression pour ouvrir la [Boîte de dialogue d'évaluation d'expression](../reference/expression-evaluation-dialog.md) avec un aperçu backend en direct.

## 4. Exécuter

Cliquez sur **Run**, appuyez sur `Ctrl + Enter`, ou utilisez le panneau de débogage pour exécuter. Le workflow s'exécute depuis le nœud Input à travers les nœuds connectés jusqu'à l'Output. Consultez [Triggers](../reference/triggers.md) pour découvrir d'autres façons d'exécuter des workflows ([webhook](../reference/webhooks.md), portail, cron, etc.).

Consultez les exécutions passées dans **History** (barre d'outils) et utilisez **Bring to Canvas** pour relancer avec les mêmes entrées.

Sur Docs, Évaluation et les autres pages internes hors canvas, vous pouvez également utiliser le [Quick Drawer](../reference/quick-drawer.md) pour sélectionner un workflow épinglé et l'exécuter sans revenir à l'éditeur.

Si vous consultez la documentation et souhaitez des clarifications avant de construire, ouvrez [Chat with Heym](../reference/chat-with-heym.md) depuis l'en-tête Docs pour poser des questions contextuelles à la page.

Vous pouvez également utiliser l'[AI Assistant](../reference/ai-assistant.md) depuis le panneau Debug pour créer des workflows en langage naturel : décrivez ce que vous souhaitez et l'IA génère les nœuds et les connexions.

Vous construisez déjà des automatisations dans un autre outil ? [Migrer vers Heym](./migrate-to-heym.md) convertit un workflow n8n, Flowise, Dify, Langflow, sim.ai ou Activepieces en un workflow Heym que vous pouvez importer.

## Ressources associées

- [Concepts fondamentaux](./core-concepts.md) – Workflows, nœuds et flux d'exécution
- [Migrer vers Heym](./migrate-to-heym.md) – Convertir des workflows n8n, Flowise, Dify, Langflow, sim.ai ou Activepieces vers Heym avec l'IA
- [Exécution et déploiement](./running-and-deployment.md) – Démarrer en local avec `run.sh` ou déployer avec `deploy.sh`
- [Variables d'environnement](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Référence complète de configuration
- [Paramètres](../reference/user-settings.md) – Configurer le nom, les User Rules et le mot de passe
- [Fonctionnalités du canvas](../reference/canvas-features.md) – Data pin, journaux d'exécution, activation/désactivation, extraction vers un sous-workflow
- [Raccourcis clavier](../reference/keyboard-shortcuts.md) – Raccourcis du canvas et de l'éditeur
- [Expression DSL](../reference/expression-dsl.md) – Référencer des données dans la configuration des nœuds
- [Boîte de dialogue d'évaluation d'expression](../reference/expression-evaluation-dialog.md) – Éditeur extensible avec aperçu backend en direct
- [Triggers](../reference/triggers.md) – Tous les points d'entrée des workflows ([webhook](../reference/webhooks.md), portail, cron, etc.)
- [Historique d'exécution](../reference/execution-history.md) – Consulter les exécutions passées et Bring to Canvas
- [Quick Drawer](../reference/quick-drawer.md) – Exécuter des workflows épinglés depuis des pages hors canvas
- [Chat with Heym](../reference/chat-with-heym.md) – Poser des questions contextuelles depuis l'en-tête de la documentation
- [Onglet Workflows](../tabs/workflows-tab.md) – Créer et gérer des workflows
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter des clés API pour les nœuds LLM
- [AI Assistant](../reference/ai-assistant.md) – Créer des workflows en langage naturel
