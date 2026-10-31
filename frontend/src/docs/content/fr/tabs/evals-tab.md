# Onglet Évaluation

L'onglet **Évaluation** est une page distincte accessible à l'adresse `/evals`. Il permet de créer des suites d'évaluation, de définir des cas de test et d'exécuter des évaluations sur vos workflows [Nœud Agent](../nodes/agent-node.md). Une [suite d'agents](#agent-suites) exécute un agent ou lit ses exécutions réelles, et vérifie les outils qu'il appelle, sa latence, son coût en USD, ses tokens et son nombre d'appels d'outils.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Regarder la démo Évaluation</a></p>

## Accès

- Cliquez sur **Évaluation** dans la barre d'onglets du tableau de bord
- Ou naviguez vers `/evals`
- Ou utilisez **Ctrl+K** (Cmd+K) et sélectionnez « Évaluation » dans la palette de commandes

## Suites d'évaluation

- **Nouvelle suite** – Choisissez **Suite de prompts** pour tester un prompt système sur plusieurs modèles, ou **Suite d'agents** pour vérifier les exécutions réelles d'un agent (voir [Suites d'agents](#agent-suites))
- **Sélecteur de suite** – Liste les suites de prompts et d'agents avec le type à côté de chaque nom ; saisissez du texte pour rechercher
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
- **Paramètres mémorisés** – Une suite s'ouvre avec les paramètres de sa dernière exécution : identifiant, modèles, méthode de notation et juge, température, effort de raisonnement et exécutions par test. L'ouverture d'une exécution passée charge ses paramètres, de sorte que **Relancer les évaluations** la répète
- **Température** – Définissez la température du modèle (`Exact Match` et `Contains`)
- **Effort de raisonnement** – Définissez l'effort de raisonnement pour les modèles de raisonnement, de Faible à Très élevé et Max comme pour les nœuds LLM et Agent (`Exact Match` et `Contains`)

### LLM-as-Judge

Avec un juge, chaque modèle répond à l'entrée de test avec le prompt de la suite seul, puis le juge évalue dans quelle mesure la réponse correspond à la sortie attendue, sur une échelle de 0 à 100 :

- **Un juge modèle** (OpenAI, OpenAI compatible ou Gemini) lit la question, la sortie attendue et la réponse, puis renvoie un score accompagné d'une justification en une ligne. Il s'exécute à une température de `0`, ou à un effort de raisonnement `low` pour un modèle de raisonnement, afin qu'une même réponse obtienne le même verdict.
- **Un juge modèle de décision** évalue la réponse selon une grille à cinq niveaux, de *Complètement à côté* à *Correspond totalement*. Le score correspond à la position pondérée par les probabilités sur cette grille ; il provient donc d'une distribution calculée par le modèle plutôt que d'un nombre qu'il aurait écrit.

La carte au survol de la cellule affiche la justification du juge ou, pour un modèle de décision, le niveau, le score et sa confiance. La latence et les tokens décrivent le modèle testé ; les appels du juge lui-même apparaissent dans les [Exécutions](./traces-tab.md) sous la source **Évaluation**. Le sélecteur de juge exclut les identifiants Model Router, car un juge doit être un modèle fixe unique. L'identifiant pour les modèles testés peut être un [Model Router](../reference/credentials.md#model-router-auto-model) : son modèle **Auto** sélectionne un modèle par requête, de la même manière qu'au sein d'un workflow.

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

## Agent Suites

Une suite d'agents vérifie un nœud [Agent](../nodes/agent-node.md) par rapport à ses exécutions. Elle les lit depuis les [Exécutions](./traces-tab.md), où chaque exécution enregistre déjà son temps, ses tokens, son coût et ses appels d'outils, et elle peut également exécuter le workflow pour vous.

Créez-en une avec **Nouvelle suite** → **Suite d'agents** et suivez trois étapes :

1. **Agent** – Choisissez le workflow, puis son nœud agent. Seuls les workflows comportant un nœud agent sont répertoriés ; un workflow ou un agent qui n'a pas encore été exécuté s'affiche mais ne peut pas être sélectionné. Les paramètres de l'agent choisi (modèle, instructions, outils et limites) s'affichent sur la droite, et un canevas en lecture seule de son workflow, avec l'agent mis en surbrillance, apparaît en dessous.
2. **Baseline** – Les 10 dernières exécutions de l'agent : latence p50 et p95, coût par exécution, tokens par exécution et appels d'outils par exécution, quels outils ont été appelés et à quelle fréquence, ainsi que les chiffres propres à chaque exécution. Les exécutions s'étant soldées par une erreur sont répertoriées mais exclues de la baseline.
3. **Vérifications** – Marquez chaque outil comme **Must call**, **Must not call** ou **Either**. Chaque type d'appel est répertorié avec son type : outils Python et de nœud, outils **MCP** avec leur serveur, **sub-agents** par libellé, **sub-workflows** par nom et **skills**. Ajoutez-en un par type et nom s'il n'a pas encore été exécuté, et supprimez-le avec sa croix **X**. Définissez des limites supérieures pour la latence, le coût, le total des tokens et les appels d'outils ; chacune commence à 20 % au-dessus du p95 de la baseline et peut être désactivée.

Une suite enregistrée s'ouvre sur **Résultats**, avec **Baseline** et **Modifier les vérifications** à côté :

- **Exécuter le workflow** – Choisissez le nombre d'exécutions (jusqu'à 20) ; quatre s'exécutent simultanément. Les entrées sont préremplies à partir de la dernière exécution du workflow et peuvent être modifiées, chaque exécution les utilisant. Activez **Générer les entrées** (l'icône d'étincelle), puis choisissez un identifiant et un modèle pour que le modèle génère une entrée différente pour chaque exécution. Il lit les instructions système de l'agent et reste proche des valeurs que vous avez saisies : taper un nom de ville produit d'autres noms de villes. Chaque exécution effectue l'intégralité du workflow comme n'importe quelle exécution et apparaît dans l'Historique d'exécution avec le trigger `agent_suite`. Pour ignorer des étapes ultérieures, comme l'envoi d'un e-mail, ouvrez le workflow avec **Aller au workflow** dans le panneau et désactivez ces nœuds au préalable. **Arrêter** met fin à l'exécution de la suite : aucune nouvelle exécution ne démarre et celles en cours sont annulées. Une exécution de suite dont le serveur s'est arrêté, par exemple lors d'un redémarrage, est signalée comme interrompue après une minute au lieu de rester bloquée.
- **Résultats** – La dernière exécution de la suite est notée par défaut. Chaque exécution de suite est conservée avec sa date dans le sélecteur d'exécutions, où vous pouvez l'ouvrir ou la supprimer ; ou passez aux 10, 20 ou 50 dernières exécutions de l'agent pour inclure ses autres exécutions. Vous visualisez le taux de réussite, la fréquence de réussite de chaque vérification, la latence, le coût, les tokens et les appels d'outils à côté de la baseline enregistrée, ainsi que chaque exécution avec la raison de son échec et un lien vers sa trace.
- **Aller au workflow** ouvre le workflow de l'agent dans un nouvel onglet. Dans le champ de nom, **Échap** ou le **X** efface la saisie.

Comment les chiffres sont interprétés :

- La **latence** correspond au temps du modèle plus la durée des appels d'outils de l'exécution.
- Le **coût** applique la même tarification que les Traces. Une exécution d'un modèle sans tarif défini ignore la vérification du coût au lieu d'échouer.
- Une exécution **réussit** lorsqu'elle s'est achevée sans erreur et que toutes les vérifications sont validées.
- La suite lit uniquement vos propres traces, selon la même règle que l'onglet Traces.
- **Utiliser les dernières exécutions comme baseline** dans **Modifier les vérifications** remplace la baseline enregistrée par les dernières exécutions de l'agent.

La baseline d'une suite provient de l'une de ces trois sources. **Modifier les vérifications** indique laquelle est active à côté de **Baseline enregistrée** :

- les dernières exécutions de l'agent (par défaut, et ce que reprend **Utiliser les dernières exécutions comme baseline**),
- une exécution de suite terminée,
- des valeurs saisies manuellement.

Ces deux dernières options se configurent depuis [Chat](./chat-tab.md#working-with-evals) ou via l'API :

- `PATCH /api/evals/agent-suites/{id}` accepte `baseline: {"source": "suite_run", "run_id": "…"}` ou `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` accepte `inputs_list` : un objet d'entrée par exécution, jusqu'à 20.

### Depuis le Chat et le MCP

Le [Chat](./chat-tab.md#working-with-evals) et l'outil MCP `heym_chat` peuvent créer, modifier et exécuter des suites de prompts et d'agents :

- Ils écrivent eux-mêmes les cas de test et les entrées d'exécution.
- Ils demandent quel identifiant utiliser avant de créer une suite de prompts, sauf si un seul convient.
- Ils lient chaque suite qu'ils mentionnent sur cette page.

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
