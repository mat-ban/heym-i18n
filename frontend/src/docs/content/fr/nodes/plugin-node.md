# Nœud Plugin

Le nœud **Plugin** exécute une action personnalisée fournie par un plugin installé. Les plugins étendent Heym avec de nouveaux types de nœuds — actions, intégrations tierces ou tout ce qui peut être exprimé en Python — sans modifier l'application principale.

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | `$nodeLabel.<keys returned by the plugin>` |

Un **package** de plugin (un zip) peut embarquer **plusieurs nœuds** — toute combinaison d'actions et de triggers. Chaque nœud apparaît dans la palette sous **Plugins** avec son propre nom et sa propre description. Le glisser-déposer sur le canvas crée un nœud Plugin lié à ce package (`pluginId`) et à ce nœud (`pluginNodeKey`).

## Quand l'utiliser

Utilisez un nœud Plugin lorsqu'un opérateur a installé un plugin qui exécute l'action dont vous avez besoin — par exemple appeler une API privée, dialoguer avec un système interne ou exécuter une logique sur mesure écrite pour votre déploiement.

Pour les plugins de type trigger qui démarrent un workflow, consultez le
[nœud Plugin Trigger](./plugin-trigger-node.md).

## Configuration

Le formulaire de configuration du nœud est généré à partir du manifeste du plugin. Chaque champ déclaré par le plugin (`string`, `number`, `boolean` ou `select`) est rendu automatiquement. Les champs string non secrets utilisent l'entrée d'expression, et les valeurs de configuration string enregistrées qui commencent par `$` sont résolues avant l'exécution du handler du plugin.

Les champs secrets (tels que les clés API) sont masqués dans l'interface et ne sont jamais écrits dans les logs.

## Fonctionnement des plugins

Les plugins sont fournis par Heym et installés par un opérateur ; le code des plugins est donc **de confiance** et s'exécute in‑process comme un nœud natif, avec un accès complet au réseau et aux bibliothèques. Un plugin peut déclarer des `dependencies` pip qui sont installées dans l'instance au moment de l'installation.

L'installation et la suppression de plugins sont réservées aux opérateurs dont l'email figure dans `HEYM_PLUGIN_ADMIN_EMAILS`, et l'ensemble du sous-système est contrôlé par `HEYM_PLUGINS_ENABLED` (désactivé par défaut). Consultez
[Exécution & Déploiement](../getting-started/running-and-deployment.md) pour les variables d'environnement.

## Icônes personnalisées

Un plugin peut embarquer des logos SVG personnalisés. Placez un `icon.svg` à la racine du package pour définir une icône par défaut pour chaque nœud, et/ou attribuez à un nœud sa propre clé `"icon": "<file>.svg"` dans le manifeste. L'icône s'affiche à la fois sur la carte de la palette et sur le nœud du canvas ; les nœuds sans icône utilisent par défaut le glyphe de pièce de puzzle.

## AI Builder

Les plugins installés sont exposés à l'assistant IA et au canvas de chat, ce qui vous permet de demander à Heym d'« utiliser le plugin Acme CRM pour créer un enregistrement » ; il générera alors le nœud Plugin avec le bon `pluginId` et la bonne `config`.

## Créer des plugins

Pour construire un package de plugin, consultez
[Plugin Authoring](../reference/plugin-authoring.md) pour la structure du zip, les champs du manifeste, les signatures de handler, les icônes, les dépendances et le modèle de confiance à l'exécution.
