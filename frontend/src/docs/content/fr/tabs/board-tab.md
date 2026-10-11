# Board

L'onglet **Board** est un tableau kanban agentique. Le travail progresse de colonne en colonne, et chaque colonne peut exécuter des workflows Heym. Une carte n'est pas une simple tâche — c'est une tâche agentique persistante qui porte un contexte, un historique de conversation, un état d'exécution, des sorties et des exécutions de workflow.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Boards et colonnes

- Vous pouvez créer autant de boards que nécessaire. Un nouveau board démarre avec les colonnes par défaut **Backlog → Planning → Development → Done**.
- Chaque board nécessite un **Agentic Kanban Model** (un identifiant plus un modèle). Il est obligatoire — la boîte de dialogue de création d'un board refuse de créer un board sans lui, et un board qui n'en possède pas conserve ses actions désactivées — car c'est ce modèle qui mappe chaque carte vers les entrées des workflows qu'elle exécute et retransforme leur sortie en texte lisible.
- L'icône d'engrenage dans l'en-tête du board ouvre les paramètres du board : nom, description (affichée sous l'en-tête) et Agentic Kanban Model.
- Les colonnes sont entièrement modifiables : ajoutez, renommez, recolorez, réordonnez ou supprimez-les depuis les paramètres de colonne (une colonne doit être vide avant de pouvoir être supprimée).
- Les cartes sont ordonnées verticalement par priorité — faites-les glisser pour les réordonner.
- Vous pouvez également créer une carte depuis l'[onglet Chat](./chat-tab.md) avec une requête en langage naturel. Le Chat vous demande de sélectionner un board lorsque c'est nécessaire et ajoute toujours la carte à la première colonne de ce board.

## Partager un board

Les paramètres du board permettent également de partager celui-ci avec des **utilisateurs** (par e-mail) et avec des **équipes**, avec la permission `read` ou `write` :

- **read** — le board et ses cartes sont visibles, mais rien ne peut être modifié : aucune nouvelle carte, aucun déplacement, aucun commentaire, aucune exécution.
- **write** — utilisation complète du board : cartes, déplacements, commentaires et exécutions.
- Seul le **propriétaire** voit l'engrenage et les boutons de suppression, et seul le propriétaire peut modifier les paramètres du board, son Agentic Kanban Model ou ses partages.

Les chaînes sur un board partagé s'exécutent toujours avec les identifiants et l'Agentic Kanban Model du **propriétaire**, de sorte que les collaborateurs n'ont jamais besoin des leurs.

## Pièces jointes des cartes

Ouvrez une carte et utilisez **Attach file** pour y ajouter des fichiers — déposez-les sur la zone ou sélectionnez-les avec le bouton, puis retirez-les depuis la même liste. Les pièces jointes sont stockées dans [Drive](./drive-tab.md).

Chaque exécution **résout les pièces jointes avant le démarrage des workflows**, selon leur type :

- **Documents** (pdf, markdown, csv, json, text) sont extraits en texte, plafonné à 20 000 caractères par fichier, dans le champ `text` de la pièce jointe.
- **Images** sont transmises sous forme d'`url` que le chemin vision charge directement (l'entrée image d'un nœud LLM l'accepte telle quelle).
- **Tout le reste** est transmis sous forme de simple référence (`name`, `url`, `mime_type`).

Les workflows les lisent à `$input.card.attachments` (et toujours à `$input.board.attachments`, quel que soit le mapping effectué par le mapper). L'Agentic Kanban Model voit également le texte extrait et les URL des images, ce qui lui permet de mapper une pièce jointe directement dans le champ attendu par un workflow.

## Chaînes de workflows des colonnes

Chaque colonne peut être configurée avec une **liste ordonnée de workflows** (la chaîne). Lorsqu'une carte entre dans une colonne dotée d'une chaîne :

1. La chaîne démarre automatiquement en arrière-plan — le déplacement lui-même n'attend jamais.
2. Les workflows s'exécutent **séquentiellement**. La sortie de chaque workflow est ajoutée au contexte de la carte avant le démarrage du suivant.
3. Si un workflow échoue, la chaîne s'arrête : les maillons restants sont ignorés et la carte devient **rouge**.
4. Lorsque chaque maillon réussit, la carte devient **verte**. Pendant l'exécution de la chaîne, la carte pulse en **ambre** ; une exécution mise en pause pour revue humaine affiche un état ambre statique.

Les exécutions sont enregistrées dans l'[Historique des exécutions](../reference/execution-history.md) avec la source de trigger `board`, et chaque carte conserve sa propre liste d'exécutions avec les sorties et erreurs par workflow. Ouvrez une carte pendant qu'un workflow s'exécute et choisissez **Open live** à côté de l'exécution pour rattacher l'éditeur à cette exécution précise. La même animation de canvas, les logs Debug incrémentaux et le résultat final apparaissent sans démarrer une seconde exécution.

## Ce que les workflows reçoivent

La chaîne transmet un payload standard comme entrée du workflow. Lisez-le avec les
[expressions](../reference/expression-dsl.md) habituelles telles que `$input.card.title` :

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — tous les commentaires de la carte, du plus ancien au plus récent.
- `history` — la chronologie complète de l'activité (commentaires, déplacements, sorties), limitée aux
  200 entrées les plus récentes.
- `previous_outputs` — les sorties des exécutions terminées précédemment (colonnes précédentes et
  tours de suivi).
- `chain.previous_workflow_outputs` — les sorties des maillons précédents de la chaîne
  *en cours*.
- Lors des tours de suivi, `move` vaut `null` et `rerun` vaut `true`.

## La boucle de planification (tours de suivi)

Un schéma courant consiste à placer un workflow de planification sur la **deuxième colonne** (nommée
par défaut Planning — le nom importe peu ; c'est l'emplacement qui compte). Ce workflow enrichit la
carte et pose des questions de suivi :

1. Déplacez une carte dans la deuxième colonne — le workflow écrit un plan enrichi et ses
   questions sur la carte sous forme de sortie.
2. Répondez dans le fil de commentaires de la carte. La réponse libère la carte : elle passe à la
   colonne suivante, qui la prend en charge avec la réponse en contexte. La chaîne de la deuxième colonne
   n'est pas exécutée à nouveau.
3. Pour améliorer le plan sur place, appuyez sur **Run follow-up round**. La même
   chaîne s'exécute à nouveau avec tout le contexte accumulé, puis la carte attend dans cette colonne
   jusqu'à ce que vous ajoutiez un commentaire pour la libérer.

Le point de contrôle de planification est positionnel, et non basé sur le nom : la colonne la plus à gauche et la colonne
immédiatement à sa droite ne passent jamais à la suite d'elles-mêmes — elles exécutent leur chaîne et attendent
là pour vous (un commentaire libère la deuxième colonne). À partir de la troisième colonne, une
chaîne réussie fait avancer la carte vers la droite d'elle-même, jusqu'à la dernière
colonne. Renommer ou supprimer le libellé « Planning » par défaut ne change pas quel emplacement
constitue le point de contrôle. Une carte ne peut avoir qu'une seule exécution active à la fois.

## Human-in-the-Loop et questions Codex

Si un workflow de chaîne se met en pause — sur un nœud
[Human-in-the-Loop](../reference/human-in-the-loop.md), sur un outil HITL d'un agent, ou parce qu'un nœud
[Codex](../nodes/codex-node.md) a besoin de plus d'informations — l'exécution est conservée comme en attente et la carte affiche
l'état en attente ambre. Chaque pause conserve sa propre surface de réponse : un lien de revue HITL pour HITL, l'écran
de suivi Codex pour Codex.

Une fois que vous avez répondu, la chaîne reprend d'elle-même : le workflow en pause se termine, sa sortie
arrive sur la carte, le reste de la chaîne de cette colonne s'exécute, et la carte avance comme d'habitude.
Si l'exécution reprise échoue, la carte devient rouge et les maillons restants sont ignorés.

## Voir aussi

- [Workflows](./workflows-tab.md)
- [Historique des exécutions](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
