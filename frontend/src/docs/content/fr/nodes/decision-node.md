# Decision

Le nœud **Decision** interroge un modèle de décision avec des questions typées sur l'état actuel de l'exécution et renvoie des probabilités. Il ne génère pas de texte. Utilisez-le lorsqu'un workflow a besoin d'un jugement sur lequel il peut brancher — routage, triage, classement, vérification ou contrôle d'une étape irréversible.

Les modèles de décision (également appelés modèles *System One*) sont d'un type différent des LLM. Il n'y a ni prompt, ni instruction système, ni température, ni appel d'outils. Vous envoyez un **state** accompagné d'une table de **questions**, et chaque réponse revient sous forme de nombre avec une distribution de probabilité sous-jacente. Comme une réponse ne représente que quelques tokens, ces modèles sont rapides et économiques comparés à un [LLM](./llm-node.md) auquel on demanderait de produire du JSON puis qu'il faudrait parser.

Pour la génération de texte, utilisez le nœud [LLM](./llm-node.md). Pour un modèle qui appelle des outils, utilisez le [Nœud Agent](./agent-node.md).

## Aperçu

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1 |
| Sortie | La réponse du fournisseur telle quelle — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Paramètres

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Un identifiant *Decision Model*. Pas un identifiant LLM. |
| `model` | string | Nom du modèle, par exemple `jev-latest` |
| `state` | expression | Ce que le modèle doit lire (par défaut `$input.text`) |
| `questions` | array | Lignes de questions ordonnées ; au moins une |
| `customBodyEnabled` | boolean | Envoyer un corps de requête écrit manuellement au lieu du formulaire |
| `customBody` | expression (JSON) | Le corps à envoyer lorsque l'option est activée |
| `requestTimeoutSeconds` | number | Nombre maximal de secondes d'attente (par défaut : 60) |

### State

Le **State** est la situation que le modèle évalue. Il accepte une chaîne, un objet ou un tableau.

Un champ contenant exactement une expression conserve son propre type, de sorte que `$input` envoie l'objet lui-même plutôt que son texte. Un template contenant une expression (`Ticket: $input.text`) se résout en chaîne. Fournissez à chaque question suffisamment d'éléments pour y répondre : texte source, identités, relations, politiques et faits actuels.

## Types de questions

Chaque question possède un `id`, un `type`, des `instructions` et des critères qui dépendent du type.

L'`id` est ce que votre workflow utilise pour relire la réponse. Il n'est **jamais envoyé au modèle**, donc tout le sens doit résider dans les `instructions`. Écrire `id: is_urgent` avec `instructions: "Is it?"` ne donne rien au modèle pour travailler.

### Noul

Si une condition est remplie. Renvoie la probabilité que la réponse soit oui, de 0 à 1.

Les critères sont facultatifs : **Yes means** et **No means** décrivent ce que chaque côté couvre. Une valeur proche de 0,5 signifie que le modèle juge oui et non à peu près équiprobables — et non « intensité moyenne ».

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Lisez-le avec `$triage.answers.is_urgent.noul`.

### Choice

Sélectionne une option parmi un ensemble que vous définissez. Renvoie l'option choisie, la distribution complète et une confiance qui en est dérivée.

Ajoutez une option couvrant « aucune de ces réponses » dès lors que rien ne pourrait correspondre — le modèle ne peut pas choisir une option que vous n'avez pas proposée.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

Lisez-le avec `$triage.answers.department.choice`, `.probabilities.billing` et `.confidence`.

### Score

Évalue l'état selon une grille ordonnée. Renvoie une valeur pondérée par les probabilités qui peut se situer **entre** les niveaux, ainsi que la légende et la distribution.

Les niveaux vont du plus bas au plus haut, avec au minimum deux et au maximum dix niveaux. Chaque niveau doit décrire une situation concrète et être autoportant.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Lisez-le avec `$triage.answers.frustration.score`, `.legend` et `.confidence`.
## Générer avec l'IA

**Générer avec l'IA** transforme une simple phrase en un modèle d'état suggéré et un ensemble de lignes de questions. Décrivez ce que vous souhaitez évaluer — « trier un ticket de support entrant : son degré d'urgence, l'équipe responsable et le niveau de frustration du client » — puis examinez le résultat avant de l'ajouter au nœud.

La rédaction est assurée par un LLM, c'est pourquoi la boîte de dialogue demande un identifiant LLM. Le modèle de décision répond aux questions ultérieurement, lors de l'exécution du workflow. Les identifiants générés sont dédupliqués par rapport aux lignes déjà présentes dans le nœud, de sorte qu'une double génération n'écrase jamais une clé de réponse existante.

Chaque génération est enregistrée dans l'onglet [Traces](../tabs/traces-tab.md) sous la source **Decision Questions**, aux côtés des traces `decision.systemone` écrites par le nœud lui-même au moment de l'exécution.

## Corps de requête personnalisé

Activez **Corps de requête personnalisé** pour envoyer un JSON que vous rédigez vous-même au lieu du formulaire. Utilisez cette option pour un endpoint dont le contrat diffère de celui construit par le formulaire.

L'éditeur est prérempli à partir du formulaire actuel, et les expressions qu'il contient sont résolues avant l'envoi de la requête. Tant que l'option est activée, le champ State et les lignes de questions sont ignorés. La réponse est transmise telle quelle dans les deux cas, de sorte qu'un contrat différent produit simplement une forme différente à lire pour vos expressions.

## Sortie

Le nœud renvoie exactement ce que le fournisseur a renvoyé. Rien n'est renommé ni aplati.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## Branchement sur une réponse

Un nœud [Switch](./switch-node.md) effectue le routage sur l'option choisie, et un nœud [Condition](./condition-node.md) peut acheminer les cas à faible confiance vers un endroit où une personne les verra :

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Une réponse typée garantit la forme, pas la véracité. Choisissez vos seuils en fonction de vos propres données et de vos conséquences plutôt qu'en recopiant un chiffre tiré d'un exemple.

## Identifiant

Créez un identifiant **Decision Model** dans l'onglet [Identifiants](../tabs/credentials-tab.md) avec :

- **Base URL** — l'endpoint, par exemple `https://api.typesafe.ai`. Heym ajoute `/v1/systemone`.
- **API Key** — facultatif. Les endpoints qui ne nécessitent aucune clé peuvent rester vides.

La modification d'un identifiant conserve la clé stockée lorsque le champ de clé est laissé vide ; ressaisissez-la uniquement pour la remplacer.

Le même identifiant peut évaluer les exécutions d'[Évaluations](../tabs/evals-tab.md) : avec **LLM-as-Judge** sélectionné, choisissez-le comme juge et le modèle de décision note chaque réponse par rapport à la sortie attendue.

Heym bloque par défaut les requêtes sortantes vers les adresses privées et de bouclage, de sorte qu'un endpoint de décision que vous exécutez vous-même sur `localhost` ou sur une plage privée nécessite `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Les modèles de décision n'apparaissent pas dans les tables de tarification LLM synchronisées par Heym, de sorte que la colonne **Cost** dans [Traces](../tabs/traces-tab.md) reste vide pour ces appels. Les décomptes de tokens sont toutefois enregistrés, et vous pouvez ajouter votre propre tarif via une substitution de tarification.

## Erreurs

| Situation | Ce qui se produit |
|-----------|--------------|
| Clé API invalide | Le nœud échoue avec un message nommant l'identifiant |
| Question malformée | Le message au niveau du champ du fournisseur est repris dans l'erreur du nœud |
| Limite de débit atteinte ou surcharge | Le nœud échoue avec un message indiquant que la condition est transitoire — activez la [nouvelle tentative](../reference/features.md) pour ce nœud afin de la surmonter |
| Identifiant de question en double ou vide | Le nœud échoue avant l'envoi de toute requête |

## Voir aussi

- [Nœud LLM](./llm-node.md) – Générer du texte plutôt qu'un jugement
- [Nœud Agent](./agent-node.md) – Rassembler des preuves avec des outils, puis les évaluer ici
- [Nœud Switch](./switch-node.md) – Router sur l'option choisie
- [Nœud Condition](./condition-node.md) – Conditionner sur la confiance
- [Types de nœuds](../reference/node-types.md) – Vue d'ensemble de tous les types de nœuds
- [Identifiants](../reference/credentials.md) – Types et champs d'identifiants
- [Onglet Traces](../tabs/traces-tab.md) – Inspecter les appels de décision et l'utilisation des tokens
