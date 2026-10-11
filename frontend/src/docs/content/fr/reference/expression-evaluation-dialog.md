# Boîte de dialogue d'évaluation d'expression

La boîte de dialogue d'évaluation d'expression est l'éditeur étendu des champs compatibles avec les expressions. Elle s'ouvre à partir du bouton d'agrandissement situé à côté d'un champ d'expression et vous offre un espace de travail plus vaste, l'autocomplétion, un aperçu en direct du backend et la navigation dans les sorties, le tout au même endroit.

## Ouverture de la boîte de dialogue

- Cliquez sur le bouton d'agrandissement situé à côté d'un champ d'expression dans le panneau Propriétés.
- Les champs multilignes affichent le bouton à l'intérieur du champ de saisie.
- Les champs monolignes affichent le bouton à droite du champ de saisie.

## Disposition de la boîte de dialogue

- La boîte de dialogue s'ouvre sous forme de fenêtre modale centrée, d'environ **80vw × 80vh**.
- L'en-tête affiche **Evaluate — {nom du champ}** lorsque le libellé du champ est connu.
- L'éditeur conserve l'autocomplétion, la navigation de champ à champ et les actions habituelles **Apply** / **Cancel**.
- L'aperçu s'actualise automatiquement environ **300 ms** après l'arrêt de la saisie.
- Appuyez sur `Ctrl` / `Cmd` + `Entrée` pour appliquer le texte en cours au champ et fermer la boîte de dialogue (identique à **Apply**).

## Section Output

La zone Output s'actualise automatiquement dès que vous cessez de saisir du texte dans l'éditeur.

### Évaluation

| Type d'expression | Résultat |
|---|---|
| Un seul `$expr` (champ entier) | La valeur native est préservée |
| Un seul chemin en notation pointée sans `$` (champ entier, sans `$`, sans saut de ligne intégré) | Identique à `$` + ce chemin (le backend normalise pour l'évaluation) |
| Texte contenant des `$refs` intégrés | Le résultat final est toujours une chaîne de caractères |
| Texte littéral (sans `$`, sans chemin en notation pointée unique) | Renvoyé tel quel |

**Exemples**

| Entrée | Résultat |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (identique à `$input.items` lorsque la valeur entière correspond à ce chemin) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Le contexte d'évaluation est construit dans cet ordre :

- **Données épinglées** sur les nœuds en amont
- **Sorties de la dernière exécution** depuis le canvas
- `null` lorsqu'aucune donnée en amont n'est disponible

Si le nœud courant possède des dépendances en amont mais qu'aucune d'elles ne dispose de données épinglées ou d'un résultat d'exécution récent, la boîte de dialogue effectue d'abord une exécution de test pour construire le contexte, puis évalue le texte en cours.

### Sélecteur de chemin de sortie

Lorsque le résultat du backend est un objet ou un tableau, la zone Output peut afficher un sélecteur de chemin interactif au lieu du JSON brut.

- Double-cliquez sur une ligne pour ajouter ce chemin à la référence `$node.path` en cours.
- Cliquez une fois sur les lignes dépliables pour ouvrir ou fermer les branches.
- Utilisez le champ de recherche intégré pour rechercher parmi les clés, les valeurs et les chaînes de chemin.

## Autocomplétion

- Saisissez `$` pour ouvrir les suggestions de nœuds en amont, d'éléments intégrés et de méthodes.
- Appuyez sur `Tab` ou `Entrée` pour insérer la suggestion sélectionnée.
- Utilisez `↑` / `↓` pour parcourir la liste de suggestions.

### Exemples de réponses

Lorsque vous poursuivez une référence `$…` par un point, chaque ligne de suggestion affiche la réponse que cette suggestion produirait, en gras à droite de la ligne.

- Saisir `$set.listItems.first().toString().u` liste `upper`, `urlEncode`, `urlDecode` et `unescape`, chacune accompagnée de son résultat évalué — vous pouvez ainsi choisir en fonction du résultat plutôt que du nom.
- Saisir `$node.text.toJson()` analyse une chaîne JSON pour la convertir en objet ou en tableau. Après `.toJson()`, l'autocomplétion peut proposer les clés analysées (par exemple `repoUrl`) lorsque la sortie de la dernière exécution ou les données épinglées sont disponibles.
- Les résultats sont évalués côté backend sur les mêmes données épinglées et sorties de la dernière exécution que celles utilisées par l'aperçu de la boîte de dialogue, ce qui garantit leur cohérence avec ce que produira le champ.
- Seules les suggestions autonomes sont évaluées : les méthodes sans argument (`upper()`, `first()`, `keys()`, `toJson()`) et les propriétés simples (`length`, `year`). Les suggestions qui nécessitent d'abord des arguments — `map`, `filter`, `sort`, `replace` — restent vides.
- Une ligne reste vide lorsque le candidat ne produit aucune réponse : une erreur, un `null` ou une méthode qui ne s'applique pas à cette valeur.
- Les réponses sont tronquées sur une seule ligne. Survolez une réponse tronquée pour en voir davantage.

## Build with AI

Le bouton **Build with AI** apparaît dans le coin supérieur droit de la boîte de dialogue d'évaluation lorsqu'un workflow est chargé. Il ouvre une fenêtre modale imbriquée dans laquelle vous pouvez décrire l'expression souhaitée en langage naturel et la faire générer par un LLM.

### Fonctionnement

1. Cliquez sur **Build with AI** dans la barre d'outils de la boîte de dialogue d'évaluation.
2. Sélectionnez un identifiant LLM et un modèle dans les listes déroulantes.
3. Saisissez une description en langage naturel de ce que vous souhaitez — par exemple, *« Récupérer le nom du client depuis la réponse de l'API »*.
4. Cliquez sur **Generate**. La fenêtre modale appelle le backend, qui utilise le prompt système [Expression DSL](./expression-dsl.md) ainsi que les sorties de la dernière exécution de votre workflow comme contexte, et renvoie une chaîne d'expression unique.
5. L'expression générée est immédiatement évaluée sur les mêmes données du canvas, ce qui vous permet de visualiser le résultat avant de l'appliquer.
6. Cliquez sur **Apply** pour remplacer le contenu de l'éditeur par l'expression générée, ou sur **Regenerate** pour réessayer.

### Contexte utilisé

Le générateur reçoit les sorties des nœuds issues de la dernière exécution de test sur le canvas. Si le workflow n'a pas encore été exécuté, le LLM génère une expression au mieux, en se basant sur les libellés des nœuds et les conventions du DSL.
### Prérequis

- Un identifiant LLM (OpenAI, Google ou Custom) doit être configuré dans l'onglet [Identifiants](./credentials.md).
- Le workflow doit être ouvert dans l'éditeur.

## Raccourcis clavier

| Raccourci | Action |
|---|---|
| Pause de saisie (~300 ms) | Actualiser l'aperçu backend |
| `Ctrl` / `Cmd` + `Enter` | Appliquer et fermer la boîte de dialogue |
| `Escape` | Fermer d'abord l'autocomplétion, sinon fermer la boîte de dialogue |

## `$` imbriqué dans les arguments de méthode

Pour l'évaluation dans la boîte de dialogue / le backend, vous pouvez passer une autre référence avec un `$` imbriqué dans des appels tels que `.get($other.field)` lorsque vous avez besoin d'une clé dynamique. Vous pouvez également utiliser un chemin nu dans `.get(...)` (par exemple `other.field`) ; le backend le résout de la même manière. Les champs de workflow enregistrés doivent toujours respecter les règles de l'[Expression DSL](./expression-dsl.md) ; l'API d'évaluation accepte également un chemin pointé nu sur toute la ligne pour plus de commodité (voir le tableau ci-dessus).

## Navigation

Les éditeurs de mapping Set et Execute peuvent afficher les boutons **Prev** / **Next** afin de vous permettre de passer d'un champ à l'autre sans fermer la boîte de dialogue.

## Voir aussi

- [Expression DSL](./expression-dsl.md)
- [Types de nœuds](./node-types.md)
- [Identifiants](./credentials.md) — requis pour la fonctionnalité Build with AI
- [Nœud LLM](../nodes/llm-node.md)
- [Nœud Output](../nodes/output-node.md)
- [Nœud Condition](../nodes/condition-node.md)
