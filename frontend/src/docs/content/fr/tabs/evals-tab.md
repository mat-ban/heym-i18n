# Onglet Évaluation

L'onglet **Évaluation** est une page distincte accessible à l'adresse `/evals`. Il permet de créer des suites d'évaluation, de définir des cas de test et d'exécuter des évaluations sur vos workflows [Nœud Agent](../nodes/agent-node.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Regarder la démo Évaluation</a></p>

## Accès

- Cliquez sur **Évaluation** dans la barre d'onglets du tableau de bord
- Ou naviguez vers `/evals`
- Ou utilisez **Ctrl+K** (Cmd+K) et sélectionnez « Évaluation » dans la palette de commandes

## Suites d'évaluation

- **Créer une suite** – Définissez une suite avec un nom et une description
- **Sélectionner un workflow** – Choisissez le workflow à évaluer
- **Sélectionner un identifiant** – Clé API pour exécuter le workflow
- **Prompt système** – Modifiez le prompt système au niveau de la suite directement dans le panneau de gauche
- **Optimiser le prompt** – Demandez à un LLM d'améliorer le prompt système actuel

## Cas de test

- Ajoutez des cas de test avec des prompts d'entrée et des sorties attendues
- Chaque cas peut avoir une valeur attendue personnalisée pour la comparaison
- Modifiez ou supprimez des cas depuis la suite
- **Générer des données de test** – Utilisez l'identifiant/modèle sélectionné pour créer automatiquement des cas de test à partir du prompt de la suite

## Exécution des évaluations

- **Sélectionner un ou plusieurs modèles** – Exécutez la même suite sur plusieurs modèles en une seule évaluation
- **Méthode de notation** – Choisissez `Exact Match`, `Contains` ou `LLM-as-Judge`
- **Juge** – Pour `LLM-as-Judge`, sélectionnez éventuellement un identifiant OpenAI, OpenAI compatible (Custom), Gemini (Google) ou [Modèle de décision](../nodes/decision-node.md) et saisissez le modèle du juge (par exemple `gpt-4o-mini` ou `jev-latest`) pour noter avec un juge indépendant
- **Exécutions par test** – Répétez chaque cas de test plusieurs fois en une seule exécution
- **Température** – Définissez la température du modèle (`Exact Match` et `Contains`)
- **Effort de raisonnement** – Définissez l'effort de raisonnement pour les modèles de raisonnement (`Exact Match` et `Contains`)

### LLM-as-Judge

Avec un juge, chaque modèle répond à l'entrée de test avec le prompt de la suite seul, puis le juge évalue dans quelle mesure la réponse correspond à la sortie attendue, sur une échelle de 0 à 100 :

- **Un juge modèle** (OpenAI, OpenAI compatible ou Gemini) lit la question, la sortie attendue et la réponse, puis renvoie un score accompagné d'une justification en une ligne. Il s'exécute à une température de `0`, ou à un effort de raisonnement `low` pour un modèle de raisonnement, afin qu'une même réponse obtienne le même verdict.
- **Un juge modèle de décision** évalue la réponse selon une grille à cinq niveaux, de *Complètement à côté* à *Correspond totalement*. Le score correspond à la position pondérée par les probabilités sur cette grille ; il provient donc d'une distribution calculée par le modèle plutôt que d'un nombre qu'il aurait écrit.

La carte au survol de la cellule affiche la justification du juge ou, pour un modèle de décision, le niveau, le score et sa confiance. La latence et les tokens décrivent le modèle testé ; les appels du juge lui-même apparaissent dans les [Exécutions](./traces-tab.md) sous la source **Évaluation**. Le sélecteur de modèle exclut les identifiants Model Router, car une évaluation compare des modèles spécifiques.

Sans juge, chaque modèle répond et note sa propre réponse en une seule requête.

La température et l'effort de raisonnement sont masqués dans ce mode, et l'exécution utilise des paramètres fixes : température `0.7` pour les modèles standards, et effort de raisonnement `medium` pour les modèles de raisonnement (`low` lorsqu'ils notent leurs propres réponses).

## Résultats

- Consultez la réussite ou l'échec par cas de test
- Inspectez les sorties réelles par rapport aux sorties attendues
- Comparez les sorties de chaque modèle côte à côte lorsqu'une exécution inclut plusieurs modèles
- Consultez l'historique des exécutions pour les évaluations passées ; une exécution `LLM-as-Judge` affiche son modèle juge dans la liste d'historique
- Ouvrez les exécutions historiques depuis le panneau de résultats et inspectez les instantanés enregistrés du prompt, de l'entrée et de la sortie
- L'ouverture d'une exécution passée charge sa méthode de notation et son juge dans le panneau de gauche, de sorte que **Relancer les évaluations** répète la même évaluation
- **Exporter** télécharge l'exécution au format JSON, incluant `judge_credential_id` et `judge_model`

## Idées de matrice de benchmark

Lorsque vous construisez une matrice de benchmark pour des workflows d'agents, incluez les scénarios HITL comme des cas à part entière plutôt que de les traiter comme des cas limites.

- Couvrez les trois décisions de révision : `accepted`, `edited` et `refused`
- Incluez plusieurs sources de trigger telles que les exécutions depuis l'éditeur, le portail, curl/webhook et les exécutions déclenchées par cron
- Ajoutez des scénarios de révision répétée où une exécution d'agent se met en pause plus d'une fois
- Vérifiez les branches de notification connectées à la sortie `review` de l'agent
- Validez le comportement en aval après un refus, en particulier si des nœuds ultérieurs branchent sur `$agent.decision`

## Voir aussi

- [Pourquoi Heym](../getting-started/why-heym.md) – L'évaluation comme étape de test du cycle de vie de l'agent
- [Nœud Agent](../nodes/agent-node.md) – Workflows évalués
- [Onglet Identifiants](./credentials-tab.md) – Identifiants pour les exécutions d'évaluation
- [Onglet Exécutions](./traces-tab.md) – Inspection détaillée des exécutions
- [Onglet Workflows](./workflows-tab.md) – Créer des workflows à évaluer
- [Historique d'exécution](../reference/execution-history.md) – Consulter les exécutions passées (bouton Historique dans l'en-tête)
- [Présentation contextuelle](../reference/contextual-showcase.md) – Guide de page compact disponible sur la page d'évaluation
