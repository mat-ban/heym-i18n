# Fonctionnalités du Canvas

L'éditeur de workflow offre plusieurs fonctionnalités pour déboguer, tester et organiser les nœuds : **Exécuter jusqu'au nœud**, **Épinglage de données**, **Journaux d'exécution**, **Activer/Désactiver** et **Extraire vers un sous-workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Regarder la démo de l'éditeur</a></p>

## Exécuter jusqu'au nœud

Survolez n'importe quel nœud, à l'exception d'une note autocollante, puis cliquez sur **Run** en dessous. Heym exécute ce nœud ainsi que ses dépendances en amont, sans toucher aux nœuds en aval ni aux branches non concernées. Cela utilise le mode test du canvas, y compris les sorties épinglées et les conditions de branche normales du workflow.

Si le chemin sélectionné comporte des champs de saisie, le panneau **Run** à droite s'ouvre et place le focus sur le premier champ. Saisissez les valeurs, puis cliquez sur **Run to _libellé du nœud_** ou appuyez sur **Ctrl+Entrée** (Cmd+Entrée sur macOS). Le mode corps générique place le focus sur l'éditeur de corps JSON. Les chemins sans champs de saisie s'exécutent immédiatement sans ouvrir le panneau. Les nœuds Input épinglés réutilisent leur sortie épinglée sans demander de saisie.

Le panneau conserve la cible sélectionnée pour les exécutions suivantes. Choisissez **Run full workflow** pour effacer la cible. Les boutons Run sont désactivés tant qu'une exécution est en cours. Une cible située à l'intérieur d'une boucle arrête l'exécution lorsque ce nœud est atteint pour la première fois ; sélectionner un nœud après la boucle exécute la boucle complète en amont.

## Épinglage de données

L'épinglage de données permet de figer la sortie d'un nœud issue de la dernière exécution afin de tester les nœuds en aval sans réexécuter le nœud épinglé.

### Où le trouver

- **Panneau de propriétés** – Sélectionnez un nœud et faites défiler jusqu'à la section **Pinned Data**
- **Badge du nœud** – Une icône d'épingle apparaît sur le nœud lorsque des données sont épinglées

### Actions

| Action | Description |
|--------|-------------|
| **Pin** | Épingle la sortie de la dernière exécution du nœud (disponible après une exécution) |
| **Clear** | Supprime les données épinglées |
| **Edit** | Modifie directement le JSON épinglé ; cliquez sur Save pour appliquer |

### Comportement en mode test

Lors de l'exécution d'un workflow en mode test, les nœuds disposant de `pinnedData` ignorent l'exécution et utilisent la sortie épinglée à la place. Utilisez cette fonctionnalité pour :

- Tester la logique en aval sans appeler d'API externes
- Déboguer les expressions qui référencent la sortie du nœud
- Itérer sur les prompts ou les conditions avec des données d'exemple fixes

La complétion d'expressions dans l'éditeur utilise les données épinglées lorsqu'elles sont disponibles pour suggérer des champs.

## Journaux d'exécution

Le **panneau Debug** (tiroir inférieur) affiche les journaux d'exécution en temps réel pendant les exécutions de workflow. Il est également possible d'ouvrir une exécution de production en cours depuis la boîte de dialogue Historique ou une carte du Board. L'éditeur se connecte au flux SSE de cette exécution, restaure les résultats des nœuds terminés et continue d'afficher les animations et les journaux des nœuds au fur et à mesure que de nouveaux nœuds démarrent et se terminent.

### Ce qu'il affiche

- **Résultats des nœuds** – Statut par nœud (`success`, `error`, `skipped`, `running`), temps d'exécution et sortie
- **Sorties finales** – Sorties agrégées des nœuds [Output](../nodes/output-node.md)
- **Progression de l'Agent** – Pour les nœuds [Agent](../nodes/agent-node.md), appels d'outils et raisonnement étape par étape

### Actions

- **Copy as JSON** – Copie le journal d'exécution complet dans le presse-papiers
- **Open in JSON editor** – Ouvre le journal dans JSON Hero ou JSON Editor Online pour inspection
- **Download generated files** – Si une skill a produit des fichiers téléchargeables (`_generated_files`), un bouton Download apparaît. Un fichier unique se télécharge directement ; plusieurs fichiers ouvrent une fenêtre de sélection.

### Distinction avec l'onglet Logs

Le panneau Debug affiche les journaux d'**exécution de workflow** (résultats des nœuds, sorties). L'[onglet Logs](../tabs/logs-tab.md) affiche les journaux des **conteneurs Docker** (backend, frontend, base de données). <!-- pragma: allowlist secret -->

## Activer / Désactiver

Vous pouvez désactiver des nœuds afin qu'ils soient ignorés lors de l'exécution. Les nœuds désactivés affichent un badge « off » et apparaissent grisés.

### Comment basculer

| Méthode | Description |
|--------|-------------|
| **Panneau de propriétés** | Sélectionnez le nœud → icône Power (en haut à droite) |
| **Menu contextuel** | Clic droit sur le(s) nœud(s) → Disable ou Enable |
| **Clavier** | Sélectionnez le(s) nœud(s) → appuyez sur **D** (voir [Raccourcis clavier](./keyboard-shortcuts.md)) |

### Sélection multiple

Lorsque plusieurs nœuds sont sélectionnés, Activer/Désactiver s'applique à tous. Le menu contextuel affiche « Enable » si au moins un nœud sélectionné est désactivé, « Disable » s'ils sont tous activés.

### Comportement à l'exécution

Les nœuds avec `active: false` sont ignorés. Les nœuds en aval ne reçoivent aucune donnée des nœuds ignorés. Utilisez cette fonctionnalité pour exclure temporairement des nœuds sans les supprimer.

Pour activer ou désactiver un nœud depuis l'intérieur d'un workflow plutôt que manuellement, utilisez [Disable Node](../nodes/disable-node.md) et [Enable Node](../nodes/enable-node.md).

## Graphe de mémoire de l'agent

Les nœuds [Agent](../nodes/agent-node.md) avec la **[mémoire persistante](./agent-persistent-memory.md)** activée affichent un contrôle **cerveau** rose sur le nœud. Cliquez dessus pour ouvrir l'éditeur de graphe de mémoire : les entités s'affichent sous forme de graphe animé à forces dirigées, regroupées par type d'entité, avec des sélecteurs Source/Cible interrogeables pour ajouter des relations et un panneau de connexions permettant de naviguer entre les entités liées. La même boîte de dialogue inclut **Partager la mémoire avec d'autres agents** (workflow → agent → lecture ou lecture/écriture) pour le [partage de mémoire entre agents](./agent-persistent-memory.md#sharing-with-other-agents). Tant que la boîte de dialogue est ouverte, l'annulation/rétablissement du canvas principal est suspendu afin que l'édition du graphe conserve son propre historique.

**Filtrer le graphe.** Le coin supérieur gauche du canvas comporte un contrôle de recherche, réduit à un bouton raccourci jusqu'à ce que vous cliquiez dessus ou appuyiez sur **Ctrl/Cmd+F**. Il correspond au nom d'une entité, à son type, ainsi qu'à chaque clé et valeur d'attribut, de même qu'au type d'une relation (`parent_of`) et à ses propriétés ; une relation correspondante entraîne ses deux entités avec elle. Tous les termes séparés par des espaces doivent correspondre. Une entité correspondante entraîne tout son voisinage avec elle — chaque relation à laquelle elle participe et l'entité située à l'autre extrémité de chacune — afin qu'une correspondance ne soit jamais laissée comme un point isolé. Une relation correspondante n'entraîne que les deux entités qu'elle relie et s'arrête là, car rechercher un type de relation est une question portant sur cette relation plutôt que sur tout ce à quoi ses extrémités sont rattachées. Tout le reste est masqué purement et simplement — non estompé — sur le canvas et dans la liste **All edges**, et un badge indique combien d'entités sur le total subsistent. Le **✕** à l'intérieur du champ efface d'abord la requête, puis ferme le champ lors d'une seconde pression. Échap déroule la même séquence, en commençant par l'élément le plus interne : il efface la requête, puis ferme le champ de recherche, puis quitte la vue étendue du canvas, et ne ferme la boîte de dialogue qu'une fois qu'aucun de ces éléments n'est ouvert. L'effacement restaure le graphe complet avec chaque entité revenue à sa position d'origine.

**Placer les entités manuellement.** Le fait de faire glisser une entité l'épingle là où vous la déposez, de sorte que la disposition automatique stabilise le reste du graphe autour d'elle au lieu de la ramener à sa place. Faire glisser l'entité sélectionnée déplace ses entités directement connectées avec elle, en préservant la forme du groupe ; faire glisser toute autre entité ne déplace que celle-ci. **Tidy layout** (le bouton baguette magique) libère toutes les entités épinglées et relance la disposition automatique.

## Extract to Sub-Workflow

Convertit les nœuds sélectionnés en un sous-workflow réutilisable et les remplace par un nœud [Execute](../nodes/execute-node.md).

### Comment l'utiliser

1. Sélectionnez un ou plusieurs nœuds sur le canvas
2. Clic droit → **Extract to Sub-Workflow**
3. Saisissez un nom (et une description facultative) pour le nouveau workflow
4. Cliquez sur **Extract**

### Ce qui se produit

- Un nouveau workflow est créé avec les nœuds sélectionnés
- Les entrées externes (edges provenant de l'extérieur de la sélection) deviennent les champs [Input](../nodes/input-node.md) du sous-workflow
- Les sorties externes (edges vers des nœuds situés hors de la sélection) sont mappées vers l'[Output](../nodes/output-node.md) du sous-workflow
- Les nœuds sélectionnés sont remplacés par un unique nœud [Execute](../nodes/execute-node.md) qui appelle le nouveau workflow
- Les mappages d'entrée/sortie sont préservés automatiquement

### Cas d'usage

- Réutiliser une séquence de nœuds dans plusieurs workflows
- Simplifier un workflow complexe en regroupant une logique connexe
- Créer des sous-workflows modulaires et testables

## Run with cURL

Le bouton **cURL** dans la barre d'outils de l'éditeur (en haut à droite) ouvre une boîte de dialogue permettant de construire et de copier une commande cURL pour déclencher le workflow via l'API.

- Choisissez le mode de corps de requête du workflow (`Defined` ou `Generic`)
- Définissez le type d'authentification (Anonymous, JWT ou Header Auth)
- Configurez la mise en cache des réponses et la limitation de débit
- Activez ou désactivez le streaming SSE et personnalisez les messages de démarrage par nœud
- Modifiez le corps de la requête
- En mode Generic, le panneau d'exécution du canvas utilise le même corps JSON brut que la boîte de dialogue cURL
- Cliquez sur **Copy cURL** pour copier la commande prête à l'emploi

Consultez [Webhooks](./webhooks.md#run-with-curl-dialog) pour tous les détails de la boîte de dialogue et [SSE Streaming](./sse-streaming.md) pour le protocole d'événements.

## Related

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – Tous les raccourcis du canvas et de l'éditeur
- [Agent Persistent Memory](./agent-persistent-memory.md) – Comportement du graphe de mémoire et API
- [Execute Node](../nodes/execute-node.md) – Appelle des sous-workflows
- [Expression DSL](./expression-dsl.md) – Références et données épinglées
- [Workflow Structure](./workflow-structure.md) – Format des nœuds et des edges
- [Download & Import](./download-import.md) – Exporter et importer des workflows au format JSON
- [Node Types](./node-types.md) – Tous les types de nœuds
- [Logs Tab](../tabs/logs-tab.md) – Journaux des conteneurs Docker
- [Execution History](./execution-history.md) – Exécutions passées
- [Templates](../tabs/templates-tab.md) – Enregistrer et réutiliser des workflows et des nœuds
- [Contextual Showcase](./contextual-showcase.md) – Guide de page compact disponible dans l'éditeur
