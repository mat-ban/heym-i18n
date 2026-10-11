# Architecture de l'Agent

Le [Nœud Agent](../nodes/agent-node.md) prend en charge les sous-agents, les sous-workflows, les outils de nœud du canvas, un modèle d'orchestrateur, les skills, les connexions MCP, l'appel d'outils, la [mémoire persistante](./agent-persistent-memory.md) optionnelle (par nœud du canvas, avec partage optionnel vers d'autres agents) et la [revue humaine](./human-in-the-loop.md) optionnelle. Cette page décrit l'architecture.

## Sous-agents

Les sous-agents sont des nœuds Agent qu'un orchestrateur peut appeler via l'outil `call_sub_agent`.

- **Orchestrateur** : `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Sous-agents** : doivent utiliser `$input.text` dans leur User Message afin de recevoir le prompt de l'orchestrateur
- **Outil** : `call_sub_agent` avec `sub_agent_label` (enum) et `prompt`
- **Limite de profondeur** : 5 appels imbriqués de sous-agents maximum

### Flux d'exécution

1. L'orchestrateur décide d'appeler un sous-agent
2. `_execute_sub_agent_tool` trouve l'agent cible par son label
3. Construit `synthetic_inputs = {"input": {"text": prompt}}`
4. Exécute `_execute_agent_node` pour le sous-agent
5. Le résultat est renvoyé à l'orchestrateur

### Exécution parallèle des sous-agents

Lorsque l'orchestrateur renvoie plusieurs appels d'outil `call_sub_agent` dans un même tour, ceux-ci sont exécutés **en parallèle**. Par exemple, si l'utilisateur pose une question sur « Paris » et que l'orchestrateur appelle à la fois `distanceAgent` et `foodAgent`, les deux s'exécutent simultanément plutôt que séquentiellement.

- **Avantage** : la durée totale correspond approximativement au sous-agent le plus lent, et non à la somme de tous.
- **Conseil** : encouragez l'orchestrateur à appeler plusieurs sous-agents en un seul tour lorsque la tâche l'exige.

## Sous-workflows

Lorsque `subWorkflowIds` est configuré, l'agent peut appeler d'autres workflows via l'outil `call_sub_workflow`.

- **Configuration** : `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Outil** : `call_sub_workflow` avec `workflow_id` (enum) et `inputs` (objet)
- **Limite de profondeur** : 5 appels imbriqués de sous-workflows maximum

### Flux d'exécution

1. L'agent décide d'appeler un sous-workflow
2. `_execute_sub_workflow_tool` récupère le workflow depuis `workflow_cache`
3. Construit `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Exécute `WorkflowExecutor.execute()` pour le sous-workflow
5. Le résultat est renvoyé à l'agent

Les sous-workflows ne peuvent pas se mettre en pause pour le HITL en v1. Si un sous-workflow imbriqué tente d'entrer dans un état de revue en attente, l'exécution échoue au lieu de se suspendre à l'intérieur de l'appel imbriqué.

## Outils de nœud du canvas

Les outils de nœud du canvas sont des nœuds de workflow connectés à un agent via la poignée `tool-input`. Lors de la configuration de l'agent, `_build_node_tool_schemas` analyse ces arêtes et ajoute un schéma d'outil compatible OpenAI par nœud connecté.

- **Source de l'outil** : `_source: "node_tool"`
- **Nom de l'outil** : dérivé du label du nœud connecté, avec des suffixes ajoutés en cas de doublons
- **Paramètres de l'outil** : construits à partir des `agentProvidedFields` du nœud
- **Champs fixes** : tous les champs du nœud non listés dans `agentProvidedFields` restent dans la configuration du nœud

### Flux d'exécution

1. L'agent décide d'appeler un outil de nœud connecté
2. `_execute_node_tool` copie les données du nœud
3. Les arguments fournis par l'agent sont fusionnés dans les champs configurés du nœud
4. `execute_node` exécute ce nœud une seule fois, avec la planification de branche désactivée
5. Les données d'origine du nœud sont restaurées
6. La sortie du nœud est renvoyée à l'agent comme résultat de l'outil

Les nœuds d'outil sont exclus de la planification normale du workflow afin de ne pas s'exécuter deux fois. Ils s'exécutent uniquement via le chemin d'appel d'outil de l'agent.

## Human-in-the-Loop

Lorsque `hitlEnabled` est défini sur un agent, celui-ci reçoit un outil `request_human_review` qu'il peut appeler à des points de contrôle d'approbation spécifiques.

1. Le prompt système et les directives HITL du nœud indiquent à l'agent quelles actions nécessitent une approbation
2. Lorsque l'agent atteint l'une de ces étapes, il appelle `request_human_review`
3. Heym stocke un instantané de l'exécution du workflow et crée une demande de revue publique
4. Le résultat du nœud est marqué `pending` avec une URL de revue
5. La poignée de sortie `review` de l'agent est planifiée immédiatement afin que les branches de notification puissent s'exécuter avec le payload en attente
6. La planification de l'exécution principale s'arrête jusqu'à la réponse du réviseur
7. Sur `accept`, `edit` ou `refuse`, l'exécuteur est reconstruit à partir de l'instantané stocké
8. L'agent en pause reprend avec le contexte de revue approuvé, ou se termine immédiatement sur `refuse`
9. Les nœuds en aval continuent une fois l'agent repris terminé, sans réexécuter la branche `review`
10. Si une action ultérieure nécessite également une approbation, l'agent peut créer un autre point de contrôle HITL dans la même exécution

Le résumé destiné au réviseur est généré à partir de la demande de revue elle-même, ce qui permet au champ du nœud de rester centré sur la politique d'approbation et le timing.

Cela permet aux workflows d'agents d'attendre une approbation externe tout en préservant l'historique de conversation, les sorties des nœuds terminés, l'état des boucles et les autres contextes d'exécution.

## Exécuteur d'outils de l'orchestrateur

L'exécuteur d'outils personnalisé route :

- **Appels de sous-agents** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Appels de sous-workflows** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Outils de nœud du canvas** (`_source == "node_tool"`) → `_execute_node_tool`
- **Revue humaine** (`_source == "hitl"`) → crée un point de contrôle HITL en attente
- **Autres outils** → `_unified_tool_executor` (Python, MCP, outils de skill)

Il est utilisé lorsque le HITL est activé, lorsque `isOrchestrator` avec `subAgentLabels` est défini, ou lorsque `subWorkflowIds` est configuré.

## Skills

Les Skills étendent le contexte système de l'agent et peuvent ajouter des outils Python.

- **Structure** : `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Contenu** : ajouté en préfixe à l'instruction système (joint avec `---`)
- **Outils Python** : pour chaque skill comportant des fichiers `.py`, un outil `skill_{skill_name}` est ajouté
- **Exécution** : `skill_python_executor.py` exécute les scripts avec `uv run python` dans un répertoire temporaire ; les arguments sont transmis en JSON sur stdin, le résultat en JSON sur stdout

Les Skills peuvent être ajoutés en déposant un fichier `.zip` ou `.md` sur la zone Skills dans la configuration du [Nœud Agent](../nodes/agent-node.md).

## Client MCP

Le client MCP (Model Context Protocol) se connecte à des serveurs d'outils externes.

- **Transports** : `stdio` (commande + arguments) ou `sse` (url + headers)
- **Lister les outils** : `list_mcp_tools` → `ClientSession.list_tools()` → converti au format de fonction OpenAI avec `_source: "mcp"`
- **Exécuter** : `execute_mcp_tool` → `ClientSession.call_tool()` → résultat via `_extract_tool_result`

Configurez les connexions MCP dans l'[Onglet MCP](../tabs/mcp-tab.md) ou via les `mcpConnections` du nœud agent.

## Appel d'outils

Le service LLM exécute une boucle `execute_with_tools` :

1. **Vérification de la compression du contexte** — avant chaque itération, estimation de l'utilisation des tokens et compression si nécessaire (voir ci-dessous)
2. Appel du modèle avec `tools` et `tool_choice: "auto"`
3. Si des `tool_calls` existent : pour chaque appel, exécution de `tool_executor(tool_def, name, args, timeout)`
4. Ajout du résultat de l'outil aux messages, puis répétition
5. Arrêt lorsqu'il n'y a plus d'appels d'outils ou que `max_tool_iterations` est atteint

### Répartition des outils

`_unified_tool_executor` effectue le routage selon `_source` :

| Source | Gestionnaire |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (par défaut) | `execute_tool` (outils en code Python) |

Les outils utilisent le format d'appel de fonction OpenAI : `name`, `description`, `parameters` (schéma JSON).

## Compression du contexte

Pour éviter la saturation du contexte sur les agents de longue durée, Heym compresse automatiquement la liste accumulée de `messages` avant chaque itération d'outil.

### Algorithme

1. **Estimation des tokens** : `total_chars / 4` sur l'ensemble des messages (rapide, aucun tokenizer requis)
2. **Vérification du seuil** : si `estimated_tokens < context_limit × 0.80`, la compression est ignorée
3. **Limite de contexte** : tentative via `client.models.retrieve(model).context_window` ; repli sur une table intégrée (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, etc.) ; valeur par défaut 128K
4. **Préservation des ancres** : conservation systématique de
   - Le premier message `system` (identité et instructions de l'agent)
   - Le premier message `user` (tâche d'origine)
   - Le dernier message `user` (instruction la plus récente)
5. **Résumé du milieu** : tout ce qui se trouve entre le premier et le dernier message user est sérialisé et envoyé au même modèle avec un prompt de résumé
6. **Reconstruction** : `[system, first_user, assistant(summary), last_user]`

La compression est ignorée s'il y a moins de 2 messages user distincts (aucun milieu à résumer) ou si l'appel de résumé au LLM échoue (repli sûr : renvoi des messages d'origine).

### Observabilité

Chaque événement de compression est enregistré sous la forme :
- D'une entrée `_context_compression` dans `tool_calls_collected` → visible dans le détail d'exécution de l'Historique des exécutions
- D'un événement `on_tool_call` avec `phase: "compression"` → affiché dans le panneau Debug sous la forme `Context compressed (N messages → summary)`
- D'une entrée de trace LLM `context.compression` → visible dans l'onglet Traces avec les estimations de tokens avant/après

Les appels d'outils de l'agent émettent également une observabilité enrichie :

- Champs de cycle de vie par appel sur `tool_calls` : `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- `tool_metrics` agrégés sur le résultat de l'agent (comptages par statut ainsi que durée totale/maximale) ; les entrées `_context_compression` sont exclues de ces comptages
- Spans enfants OpenTelemetry optionnels nommés `heym.agent.tool.execute` (voir [Traçage OpenTelemetry](./opentelemetry.md))
- Les payloads `tool_calls` persistés dans la trace LLM / l'historique d'exécution sont expurgés et limités en taille ; l'état de reprise HITL en direct conserve les originaux pour la correspondance

## Voir aussi

- [Pourquoi Heym](../getting-started/why-heym.md) – Orchestration multi-agents sur l'ensemble du cycle de vie de l'agent
- [Nœud Agent](../nodes/agent-node.md) – Configuration et paramètres
- [Mémoire persistante de l'agent](./agent-persistent-memory.md) – Graphe de connaissances par nœud agent et partage entre pairs
- [Human-in-the-Loop](./human-in-the-loop.md) – Liens de revue, payloads en attente et comportement de reprise
- [Traçage OpenTelemetry](./opentelemetry.md) – Spans de workflow, de nœud et d'outil Agent
- [Types de nœuds](./node-types.md) – Agent et nœuds associés
- [Exécution parallèle](./parallel-execution.md) – Exécution parallèle basée sur DAG et sous-agents
- [Onglet MCP](../tabs/mcp-tab.md) – Configurer les connexions MCP
- [Expression DSL](./expression-dsl.md) – `$input.text` pour les sous-agents
