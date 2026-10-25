# Historique des exécutions

L'historique des exécutions enregistre les exécutions de workflow : entrées, sorties, résultats des nœuds, statut et source du trigger. Utilisez-le pour suivre une exécution de production active, inspecter les exécutions passées, déboguer les échecs ou relancer avec les mêmes entrées via **Bring to Canvas**.

## Vue d'ensemble

Chaque exécution stocke :

| Champ | Description |
|-------|-------------|
| **Inputs** | Corps de la requête ou entrées d'exécution (par ex. `text` pour le nœud Input) |
| **Outputs** | Sorties au niveau du workflow |
| **Node results** | Sorties par nœud, statut et temps d'exécution |
| **Status** | `success`, `error`, `pending`, `skipped` ou `failed` (voir [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Mode de déclenchement de l'exécution (voir [Triggers](./triggers.md)) |

## Accès à l'historique

| Emplacement | Portée |
|-------------|--------|
| Barre d'outils de l'**Éditeur** | Workflow actuel uniquement |
| En-tête de la vue **Docs** | Workflow actuel uniquement |
| En-tête du **Dashboard** (onglet Chat) | Tous les workflows + exécutions chat/assistant |
| En-tête de la vue **Évaluation** | Tous les workflows + exécutions chat/assistant |

Cliquez sur le bouton **History** (icône horloge) pour ouvrir la boîte de dialogue.

## Historique par workflow vs historique global

- **Par workflow** (Éditeur, Docs) : affiche les exécutions du workflow ouvert. Utilisez **Clear history** pour supprimer les exécutions de ce workflow uniquement.
- **All History** (Dashboard, Évaluation) : affiche les exécutions de tous les workflows et sessions chat/assistant. La couverture correspond à l'accès aux workflows : les workflows dont vous êtes propriétaire, ceux partagés directement avec vous et ceux partagés avec une équipe à laquelle vous appartenez. Utilisez **Clear all history** pour supprimer tous les enregistrements dont vous êtes propriétaire. L'historique des workflows partagés sera conservé.

## Bring to Canvas

**Bring to Canvas** charge les entrées et les sorties des nœuds d'une exécution sélectionnée dans le workflow actuel.

### Éléments chargés

- **Inputs** → Panneau d'entrée d'exécution (par ex. `text` pour le nœud Input, ou des champs personnalisés)
- **Node results** → Le panneau de résultat d'exécution affiche les sorties passées par nœud
- **Execution result** → Statut, sorties et timing de l'exécution

### Comportement selon le contexte

- **Dans l'Éditeur** (historique par workflow) : s'applique immédiatement au workflow ouvert et ferme la boîte de dialogue.
- **Depuis All History** (Dashboard/Évaluation) : navigue vers l'éditeur du workflow, puis applique les données au chargement de l'éditeur. Disponible uniquement pour les exécutions de workflow — pas pour les exécutions chat/assistant.

### Lien profond d'exécution

Ouvrir un workflow à l'adresse `/workflows/{workflowId}/{executionId}` amène automatiquement cette exécution sur le canvas — comme si vous sélectionniez l'exécution et choisissiez **Bring to Canvas**. Cela permet de partager une exécution passée spécifique via une URL. Si l'exécution est introuvable (identifiant erroné ou supprimé), l'éditeur revient au chargement du workflow seul.

### Cas d'usage

- Relancer un workflow avec les mêmes entrées
- Déboguer une exécution échouée en inspectant les entrées et les sorties des nœuds
- Comparer les sorties entre plusieurs exécutions

## Demander à l'IA

Les deux boîtes de dialogue d'historique comportent un bouton **Demander à l'IA** (icône d'étincelle) à côté de leur titre. Il ouvre l'[onglet Chat](../tabs/chat-tab.md#asking-about-a-run) dans une nouvelle conversation avec le workflow et l'exécution sélectionnée joints sous forme de puces amovibles. Demandez pourquoi l'exécution a été lente, ce qui a échoué ou demandez au Chat de corriger le workflow. Le Chat lit cette exécution exacte, y compris sa trace et ses erreurs par nœud.

Dans la boîte de dialogue All History, **Demander à l'IA** n'apparaît que lorsqu'une exécution de workflow est sélectionnée ; les exécutions de chat et d'assistant ne l'affichent pas.

## Chronologie d'exécution

Dans le détail de l'exécution, le bouton **Chronologie** (icône de chronomètre) à côté de **Tout développer** remplace la liste **Étapes** par une chronologie des spans. Tant que la chronologie est affichée, le même bouton indique **Journaux** ; cliquez dessus pour revenir à la liste. Dans All History, le bouton n'apparaît que pour les exécutions de workflow. La chronologie trace une barre par nœud à l'heure où il a démarré, afin de voir quel nœud a pris combien de temps et lesquels se sont exécutés en parallèle. Survolez une barre pour afficher sa durée ; cliquez dessus pour ouvrir le même inspecteur de détails que la [chronologie d'exécution](#execution-timeline-details) de l'éditeur. La vue choisie reste active tant que le dialogue est ouvert.

Les exécutions enregistrées avant le stockage des heures de début des nœuds sont disposées les unes après les autres par durée.

## Execution Highlights

Après une exécution en direct — ou après **Bring to Canvas** — une popup **Execution Highlights** (fermable) apparaît dans le **coin supérieur droit du Canvas**. C'est un moyen rapide de voir *ce que chaque nœud a produit*, listé de haut en bas dans l'ordre d'exécution. Fermez-la avec le **✕** ; elle se rouvre à l'exécution suivante.

### Éléments affichés

| Enregistrement | Source | Auto ? |
|----------------|--------|--------|
| **Input** | Les paramètres d'entrée de l'exécution (nœud input/trigger) | Oui |
| **Output** | Le résultat du nœud de sortie — ou, s'il n'y en a pas, le message du dernier nœud | Oui |
| **Agent / LLM** | La sortie de chaque nœud agent ou LLM | Oui |
| **Output** | Tout autre nœud avec **Highlight Node Output** activé | Opt-in |

Les nœuds déjà mis en évidence automatiquement (input / output / last / agent / llm) n'apparaissent jamais deux fois, même si vous activez également l'option.

### Chaque enregistrement

- Affiche `Node — message…` avec les **250 premiers caractères** ; cliquez sur une ligne pour la développer et afficher le **message complet au format Markdown**, avec un bouton **Copy**.
- Un nœud exécuté plusieurs fois (par ex. dans une boucle) affiche `Node (N)` avec un sélecteur `‹ i / N ›` — choisissez l'exécution à consulter ; le sélecteur de chaque nœud est indépendant.

### Highlight Node Output

Chaque nœud **sauf Agent et LLM** dispose d'une case à cocher **Highlight Node Output** dans son panneau de propriétés (désactivée par défaut). Activez-la pour ajouter la sortie de ce nœud à la popup. Un petit badge ✦ apparaît sur les nœuds mis en évidence dans le canvas. Dans le [workflow DSL](./expression-dsl.md), il s'agit du champ de données de nœud `"highlight": true` (par défaut `false`).

### Sur les dashboards

Les cartes de widget du Dashboard ayant exécuté un workflow affichent un bouton ✦ **Execution highlights** dans l'en-tête de la carte ; cliquez dessus pour ouvrir la même popup pour l'exécution de ce widget, avec la sortie dessinée du widget comme enregistrement principal.

## Exécutions en cours

Les deux boîtes de dialogue d'historique affichent les **exécutions en cours** en haut de la liste, avant les exécutions passées.

- Un indicateur rotatif et le libellé **Running** apparaissent avec l'heure de démarrage
- Cliquez sur **Open live** pour rattacher l'éditeur à cette exécution précise sans la redémarrer
- Le canvas restaure d'abord les nœuds déjà terminés, puis reçoit les événements
  `node_start`, `node_complete` et l'événement d'exécution final via SSE
- Le nœud en cours pulse sur le canvas, les nœuds en aval conservent leur animation en attente, et
  le panneau Debug ajoute chaque résultat dès son arrivée — exactement comme pour une exécution lancée depuis l'éditeur
- Cliquez sur **Cancel** pour arrêter l'exécution immédiatement
- L'annulation depuis n'importe quelle boîte de dialogue (Éditeur ou Dashboard) ferme également le flux SSE actif dans tout onglet de canvas ouvert pour ce workflow, ce qui réinitialise proprement l'état de l'éditeur
- Après annulation, l'entrée en cours disparaît au prochain rafraîchissement ; appuyez sur **Refresh** pour mettre à jour la liste manuellement
- Si vous annulez une exécution déjà terminée, la requête est sans effet

L'URL live est `/workflows/{workflowId}/{executionId}`. L'observateur est en lecture seule : quitter
l'éditeur ne fait que déconnecter cet onglet du navigateur et n'arrête jamais le workflow. Les snapshots
actifs sont partagés via PostgreSQL, de sorte que l'ouverture d'une exécution fonctionne même lorsque le trigger et la requête de l'éditeur
aboutissent sur des workers backend différents.

## Récupération après incident

Si le serveur redémarre (déploiement, redémarrage de conteneur ou incident) alors qu'un workflow est en cours d'exécution, le worker de cette exécution s'arrête en plein traitement. Heym récupère automatiquement ces exécutions interrompues au lieu de les laisser bloquées en statut **Running**.

- Au démarrage suivant, le processus leader élu détecte les exécutions orphelines — instantanément pour un redémarrage gracieux, ou dans un délai d'environ 60 secondes pour un arrêt brutal (une fois les heartbeats clairement interrompus).
- Les exécutions récupérées sont **relancées depuis le début avec les mêmes entrées** (et non reprises là où elles s'étaient arrêtées), en utilisant la définition actuelle du workflow. À leur achèvement, elles enregistrent une entrée terminale normale (par ex. `success`), de sorte que l'historique affiche l'exécution comme terminée.
- Une exécution est retentée **une seule fois**. Si la tentative de récupération est également interrompue — ou si le workflow a été supprimé entre-temps — l'entrée est enregistrée comme `failed`.
- Ce fonctionnement est identique sur un conteneur unique et sur des déploiements multi-workers ; seul le leader effectue la récupération, de sorte qu'une exécution n'est jamais récupérée deux fois par des workers différents.

### Option Auto-recover

Le panneau **Execution Log** (exécution) de l'éditeur comporte une case à cocher **Auto-recover**, **activée par défaut** pour chaque workflow.

- **Activée** : les exécutions interrompues de ce workflow sont relancées comme décrit ci-dessus.
- **Désactivée** : les exécutions interrompues ne sont pas relancées et sont enregistrées avec le statut `skipped`.

> Les exécutions de sous-workflows ne sont pas récupérées indépendamment — elles sont relancées par leur exécution parente récupérée. Les triggers disposant de leur propre redélivrance (RabbitMQ, planifié/cron, IMAP) peuvent également redélivrer au redémarrage, de sorte qu'une exécution récupérée peut occasionnellement s'exécuter deux fois.

## Revue humaine en attente

Les exécutions qui se mettent en pause pour une approbation [Human-in-the-Loop](./human-in-the-loop.md) sont immédiatement écrites dans l'historique avec le statut `pending`.

- Le nœud agent en attente stocke un payload de revue incluant `reviewUrl`, `draftText` et `expiresAt`
- Tout nœud connecté au handle `review` de l'agent peut également s'exécuter avant la réponse humaine, et ses résultats de nœud sont stockés dans la même entrée d'historique en attente
- Les boîtes de dialogue d'historique affichent le lien de revue afin que les propriétaires puissent le copier ou l'ouvrir
- Les boîtes de dialogue d'historique et le panneau Debug de l'éditeur affichent la décision humaine finale une fois l'exécution reprise
- Lorsqu'un relecteur accepte, modifie ou refuse le brouillon, la même entrée d'historique est mise à jour avec le résultat d'exécution final
- Si la même exécution se met en pause pour HITL plus d'une fois, l'entrée d'historique reste identique tandis que chaque point de contrôle dispose de son propre lien de revue à usage unique

Ceci est particulièrement utile pour les exécutions de portail et les workflows de longue durée qui peuvent attendre des heures ou des jours avant de se poursuivre.

## Copie

Utilisez **Copy** à côté de Inputs ou Outputs pour copier le JSON dans le presse-papiers.

## Effacement de l'historique

- **Par workflow** : dans la boîte de dialogue d'historique de l'éditeur, cliquez sur **Clear history** pour supprimer les exécutions du workflow actuel.
- **Tout l'historique** : dans la boîte de dialogue d'historique du Dashboard/Evals, cliquez sur **Clear all history** pour supprimer tous les enregistrements d'exécution dont vous êtes propriétaire. Les exécutions issues de workflows partagés sont conservées. Cette action est irréversible.

## Détails de la chronologie d'exécution

Lorsque le panneau **Execution Log** de l'éditeur est ouvert, cliquez sur le bouton de minuterie pour afficher la chronologie d'exécution. Sélectionnez un intervalle pour ouvrir un inspecteur de détails intégré qui remplace la zone des lignes. Il affiche le statut de l'étape sélectionnée, sa durée, le nombre de tentatives, les informations de retry, les erreurs, le trace ID et un aperçu compact de la sortie. Les sorties de type objet et tableau utilisent le même visualiseur `JsonTree` que le reste du panneau Debug ; les valeurs scalaires utilisent un aperçu textuel. Lorsqu'une étape produit des images (captures d'écran Playwright, images générées, fichiers image ou images en base64 dans le corps d'une requête, trouvés n'importe où dans la sortie), celles-ci apparaissent sous forme de vignettes au-dessus de la sortie, et le JSON affiche un court placeholder à la place du base64 brut. Cliquez sur une vignette pour l'ouvrir dans une lightbox ; les boutons fléchés ou les touches ←/→ parcourent toutes les images de l'exécution, avec un compteur tel que `2 / 5`. Utilisez **Open trace** pour les spans LLM et Agent lorsqu'un trace ID est disponible.

## Détail d'un nœud sur mobile

Sur un téléphone, l'éditeur affiche une arborescence de workflow en plein écran au lieu du canvas libre. Appuyez sur un nœud de l'arborescence disposant d'un résultat enregistré pour ouvrir son exécution en détail plein écran. La vue propose des onglets distincts **Input Data**, **Output Data** et **Errors**. L'onglet de sortie affiche le résultat enregistré et propose **Copy Output** ; l'onglet d'entrée présente la configuration du nœud sélectionné, et l'onglet des erreurs affiche l'erreur enregistrée lorsque le nœud a échoué. Utilisez **Back to workflow** ou le bouton de fermeture pour revenir à l'arborescence.

Les boîtes de dialogue d'historique du canvas et du tableau de bord conservent leurs commandes d'exécution sur une seule ligne et disposent les filtres de tags et d'instances disponibles dans une grille adaptative. Leurs menus de filtres utilisent le même sélecteur intégré à l'application, de sorte que la coche de sélection présente une gouttière et une ligne de base cohérentes avec chaque libellé d'option.

## Pour aller plus loin

- [Triggers](./triggers.md) – Comment les workflows sont démarrés ; l'historique enregistre `trigger_source` (y compris `board` pour les exécutions lancées par les déplacements de cartes et les relances de [Board](../tabs/board-tab.md))
- [Human-in-the-Loop](./human-in-the-loop.md) – URL de revue en attente et comportement de reprise
- [Edit History](./edit-history.md) – Gestion de versions des sauvegardes de workflow (restauration, diff)
- [Quick Start](../getting-started/quick-start.md) – Créez et exécutez votre premier workflow
- [Workflows Tab](../tabs/workflows-tab.md) – Créez et gérez des workflows
