# Migrer vers Heym

Vous avez déjà des workflows dans un autre outil ? **AI Convert** les transforme en workflows Heym pour vous. Collez un workflow depuis n8n, Flowise, Dify, Langflow, sim.ai ou Activepieces — ou décrivez simplement ce que vous souhaitez — et Heym construit le workflow équivalent sur un canvas en direct que vous pouvez télécharger et importer.

Ouvrez-le sur **[heym.run/convert](https://heym.run/convert)**, ou utilisez le bouton **✨ AI Convert** dans l'en-tête du site.

## Fonctionnement

1. **Sélectionnez votre outil source** (facultatif) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces, ou laissez sur *Auto*.
2. **Fournissez votre workflow** — collez le JSON exporté depuis votre outil actuel, ou rédigez une description en langage naturel de l'automatisation souhaitée.
3. **Générez** — Heym diffuse le résultat sur un canvas, en dessinant les nœuds et les connexions au fur et à mesure de leur production.
4. **Téléchargez ou copiez** le workflow généré au format JSON.
5. **Importez dans Heym** — utilisez le flux [Download & Import](../reference/download-import.md) pour coller le JSON sur votre canvas, puis exécutez-le.

La conversion ajoute également une petite *Sticky Note* sur le canvas indiquant que le workflow a été généré par Heym — supprimez-la quand vous le souhaitez.

## Ce que vous obtenez

Le convertisseur mappe les concepts sources sur les nœuds natifs Heym — triggers, étapes [LLM](../nodes/llm-node.md), appels [HTTP](../nodes/http-node.md), actions [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md), [Loops](../nodes/loop-node.md), [Conditions](../nodes/condition-node.md) et [Output](../nodes/output-node.md). Examinez le résultat sur le canvas, configurez vos [Identifiants](../reference/credentials.md) et ajustez tout ce que l'outil source exprimait différemment.

> AI Convert est un point de départ, et non un portage 1:1 garanti. Examinez toujours le workflow généré avant de l'exécuter en production.

## Bon à savoir

- **Propulsé par l'IA :** les conversions sont produites par un grand modèle de langage, les résultats peuvent donc varier d'une exécution à l'autre. Régénérez si le premier résultat n'est pas tout à fait satisfaisant.
- **Taille de l'entrée :** le contenu que vous collez ou saisissez est limité à environ **25 000 tokens**. Réduisez les exports très volumineux avant la conversion.
- **Limites de débit :** pour que l'outil reste accessible à tous, les requêtes sont plafonnées à **1 par minute, 5 par heure et 10 par jour** par visiteur.
- **Sécurité :** les requêtes sont filtrées, et seules les requêtes de construction de workflow sont traitées.

## Étapes suivantes

- Nouveau sur le canvas ? Commencez par le [Quick Start](./quick-start.md).
- Découvrez le fonctionnement de l'import dans [Download & Import](../reference/download-import.md).
- Vous hébergez Heym vous-même ? Consultez [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) pour la référence complète de configuration.
- Construisez à partir de zéro avec l'[AI Assistant](../reference/ai-assistant.md) intégré à l'application.
