# Nœud Plugin Trigger

Le nœud **Plugin Trigger** est la contrepartie de type trigger du
[nœud Plugin](./plugin-node.md). Il est fourni par un plugin installé dont le
`kind` est `trigger`, et produit les données initiales à partir desquelles un workflow démarre.

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 0 |
| Sorties | 1 |
| Sortie | `$nodeLabel.<keys returned by the plugin>` |

Un plugin trigger peut représenter n'importe quelle source — une autre application, un service tiers, ou une autre technologie — tant que le handler du plugin renvoie les données avec lesquelles le workflow doit démarrer.

## Quand l'utiliser

Utilisez un nœud Plugin Trigger lorsqu'un plugin installé définit un trigger qui démarre votre workflow. Pour les plugins qui exécutent une action en cours de workflow, utilisez plutôt le [nœud Plugin](./plugin-node.md).

## Configuration

Comme pour le nœud Plugin, le formulaire de configuration est généré à partir des champs du manifest du plugin. Les champs de type chaîne non secrets utilisent la saisie d'expression, et les champs secrets sont masqués.

## Fonctionnement des plugins

Le code des plugins est approuvé (fourni par Heym, installé par l'opérateur) et s'exécute in-process. L'installation est restreinte à `HEYM_PLUGIN_ADMIN_EMAILS` et le sous-système est contrôlé par `HEYM_PLUGINS_ENABLED`. Consultez
[Exécution & Déploiement](../getting-started/running-and-deployment.md).

## Créer des plugins

Pour créer un package de plugin trigger, consultez
[Création de plugins](../reference/plugin-authoring.md) pour la structure du zip, les champs du manifest, les signatures de handler, les icônes, les dépendances et le modèle de confiance à l'exécution.
