# Nœud Agent

Le nœud **AI Agent** est un nœud LLM doté de la capacité d'appel d'outils. Il peut exécuter des outils Python, appeler des nœuds du canvas connectés en tant qu'outils, se connecter à des serveurs MCP, utiliser des skills, agir éventuellement comme orchestrateur déléguant à d'autres nœuds Agent, appeler d'autres workflows en tant qu'outils, et se mettre en pause pour une [revue humaine](../reference/human-in-the-loop.md).

## Vue d'ensemble

| Propriété | Valeur |
|----------|-------|
| Entrées | 1 |
| Sorties | 1, plus un `review` optionnel lorsque le HITL est activé |
| Sortie | `$nodeLabel.text`, `$nodeLabel.fieldName` (lorsque la sortie JSON est activée), ou un payload HITL en attente pendant la revue |

## Paramètres principaux

### Identifiant et modèle

| Paramètre | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | Identifiant LLM (clé API) issu des Paramètres |
| `model` | string | Nom du modèle (ex. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (optionnel) | Identifiant de secours lorsque le principal échoue |
| `fallbackModel` | string (optionnel) | Modèle de secours lorsque le principal échoue |

Ajoutez les identifiants dans l'onglet [Identifiants](../tabs/credentials-tab.md). La liste des modèles est chargée à partir de l'identifiant sélectionné. Si l'identifiant ou le modèle principal renvoie une erreur, le nœud réessaie automatiquement avec l'identifiant et le modèle de secours avant d'échouer.

### Prompts

| Paramètre | Type | Description |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt système destiné à l'IA. Prend en charge les [expressions](../reference/expression-dsl.md). |
| `userMessage` | string | Message/prompt utilisateur. Valeur par défaut : `$input.text` |
| `jsonOutputEnabled` | boolean | Sortie JSON structurée |
| `jsonOutputSchema` | string | JSON Schema pour la sortie structurée |
| `extraBodyEnabled` | boolean | Envoyer des paramètres de requête spécifiques au fournisseur (par défaut : `false`) |
| `extraBody` | string | Objet JSON fusionné dans chaque requête API émise par l'agent |

Utilisez `$input.text`, `$nodeName.field` et les autres syntaxes de l'[Expression DSL](../reference/expression-dsl.md).

### Modèles de raisonnement (o1, o3)

| Paramètre | Type | Description |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (par défaut : 0.7), pour les modèles standards |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Profondeur de raisonnement pour les modèles de raisonnement |

Lors de l'utilisation d'un modèle de raisonnement (ex. o1, o3), l'interface affiche **Reasoning Effort** à la place de Temperature. Pour les modèles standards, **Temperature** contrôle la créativité.

**Exemple de sortie JSON :** Lorsque vous avez besoin de données structurées de la part de l'agent (ex. classification, extraction), activez la sortie JSON et fournissez un schéma. L'agent renvoie un JSON conforme au schéma ; accédez aux champs par leur nom sur la sortie du nœud :

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Les nœuds en aval peuvent utiliser `$agentLabel.status`, `$agentLabel.reason`, etc. Comportement identique à la sortie JSON du [nœud LLM](../nodes/llm-node.md).
## Revue humaine (HITL)

Utilisez HITL lorsqu'un agent peut avoir besoin d'une approbation à des moments précis avant des actions importantes.

| Paramètre | Type | Description |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Ajoute des points de contrôle de revue humaine à l'agent |
| `hitlSummary` | string | Instructions d'approbation qui indiquent à l'agent quand une revue humaine est nécessaire |

Lorsque HITL est activé, l'agent reçoit un outil `request_human_review`. Utilisez le prompt système et
ce champ d'instructions pour expliquer quels appels d'outils, sous-agents, sous-workflows, actions MCP, skills,
ou effets de bord nécessitent une approbation. L'agent peut appeler cet outil uniquement lorsque nécessaire, y compris plusieurs
fois au cours d'une même exécution.

Le résumé destiné au réviseur sur la page publique est généré à partir de la demande de revue de l'agent au
moment de l'exécution. Si l'agent ne fournit pas explicitement de résumé, Heym en dérive un à partir du corps de revue
en Markdown.

Pour les outils MCP, Heym demande au modèle d'interpréter vos instructions HITL écrites selon l'une des trois
portées : `always`, `once` ou `never`. Cela signifie qu'une formulation libre telle que « pour chaque appel », « une seule
fois » ou « ne jamais demander » est normalisée avant l'application du filtrage à l'exécution.

Chaque point de contrôle HITL crée un lien de revue public à usage unique à l'adresse `/review/{token}`. Un réviseur peut :

- **Accepter** le texte de revue Markdown d'origine
- **Modifier et continuer** avec un Markdown modifié
- **Refuser** et continuer avec `text: ""`

Lorsque HITL est activé, le nœud expose également une sortie `review` sur le canvas. Connectez cette branche à Slack, à un e-mail ou à d'autres nœuds de notification si vous souhaitez diffuser l'URL de revue et le résumé dès que l'exécution se met en pause.

L'exécution passe à l'état `pending` jusqu'à ce qu'un réviseur réponde. Le texte de revue est un unique corps Markdown, et le payload en attente inclut également un texte de lien partageable pour un transfert externe. Les nœuds de la branche `review` s'exécutent immédiatement lors de la création de la pause ; le chemin de sortie normal ne se poursuit qu'après approbation. Après approbation, Heym reprend à partir du snapshot d'exécution stocké et l'agent poursuit avec le contexte approuvé. Si une étape ultérieure nécessite également une approbation, l'agent peut créer un autre point de contrôle HITL. Consultez [Human-in-the-Loop](../reference/human-in-the-loop.md) pour la structure du payload, le comportement de l'URL de revue et la sémantique de reprise.

HITL est disponible uniquement pour la sortie d'agent en mode texte. En v1, il ne peut pas être combiné avec `jsonOutputEnabled`.


## Mode Orchestrator

Lorsqu'il est activé, l'agent peut déléguer des tâches à d'autres nœuds Agent du workflow. Si le **mode Orchestrator est désactivé**, l'agent **ne peut pas créer de connexions agent→agent** dans le canvas.

| Paramètre | Type | Description |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Lorsque `true`, l'agent reçoit un outil `call_sub_agent` |
| `subAgentLabels` | string[] | Labels des nœuds Agent que cet orchestrateur peut appeler |

Les **sous-agents** doivent utiliser `$input.text` dans leur User Message afin de recevoir le prompt de l'orchestrateur.

Lorsque l'orchestrateur appelle plusieurs sous-agents en un seul tour, ceux-ci s'exécutent en parallèle. Consultez [Agent Architecture](../reference/agent-architecture.md) pour plus de détails.

## Sous-workflows

Lorsqu'ils sont configurés, l'agent reçoit un outil `call_sub_workflow` pour exécuter d'autres workflows.

| Paramètre | Type | Description |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | IDs des workflows que cet agent peut appeler comme outils |

Sélectionnez les workflows dans la section Sous-workflows de la configuration de l'agent. L'agent les appellera avec `workflow_id` et `inputs` (objet correspondant aux champs d'entrée du workflow cible). Profondeur maximale : 5 appels de sous-workflow imbriqués.

## Outils de nœud du canvas

Vous pouvez connecter un nœud de workflow pris en charge à la poignée **tools** d'un agent afin que l'agent puisse appeler ce nœud au moment de l'exécution. Cela transforme les actions et transformations existantes du canvas en outils appelables sans écrire de Python.

Utilisez les outils de nœud du canvas lorsque vous souhaitez que l'agent décide quand exécuter un nœud configuré, tout en conservant les identifiants, les champs statiques et les paramètres propres au workflow dans l'interface du nœud.

### Champs fournis par l'agent

Les champs d'un nœud outil connecté peuvent être marqués avec l'icône bot. Les champs marqués deviennent des paramètres d'outil obligatoires que l'agent doit fournir lorsqu'il appelle le nœud. Les champs non marqués restent fixes et sont lus depuis la configuration du nœud.

Par exemple :

- Connectez un nœud Slack à un agent en tant qu'outil
- Conservez l'identifiant fixe dans le nœud Slack
- Marquez `message` comme fourni par l'agent
- L'agent reçoit un outil Slack où il ne fournit que le message au moment de l'exécution

Si le nœud n'est pas connecté à un agent en tant qu'outil, l'icône bot est masquée et le nœud se comporte comme une étape de workflow normale.
### Comportement à l'exécution

Lorsque l'agent appelle un outil de nœud du canvas, Heym fusionne temporairement les arguments fournis par l'agent dans les données de ce nœud, exécute le nœud, renvoie la sortie du nœud à l'agent, puis restaure la configuration d'origine du nœud. Les nœuds d'outil ne s'exécutent pas comme des étapes de workflow classiques via la planification normale ; ils s'exécutent uniquement lorsque l'agent les appelle.

Les outils de nœud du canvas sont utiles avec des nœuds d'intégration tels que Slack, Telegram, HTTP, Send Email, et des nœuds de mise en forme des données tels que [Set](./set-node.md). Les nœuds Trigger, les nœuds de contrôle de flux et les mappeurs de sortie terminale ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) ne peuvent pas être utilisés comme outils d'agent.

## Outils Python

Définissez des outils personnalisés que l'agent peut appeler. Chaque outil comporte :

| Champ | Type | Description |
|-------|------|-------------|
| `name` | string | Nom de l'outil (ex. `count_characters`) |
| `description` | string | Description destinée au LLM |
| `parameters` | JSON Schema | Schéma de function-calling OpenAI (format objet) |
| `code` | string | Code de la fonction Python |

**Parameters** doit être un objet JSON, et non une chaîne :

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Exemple d'outil :**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Les outils Python s'exécutent en tant que code non fiable dans un conteneur Docker isolé et durci par défaut (pas de réseau, pas de socket Docker, système de fichiers en lecture seule, non-root). Les imports sont limités à une allowlist de modules de la bibliothèque standard sûrs. Consultez [Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox) pour la configuration (`HEYM_PYTHON_TOOL_SANDBOX`).

| Paramètre | Type | Description |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Nombre maximal de secondes par exécution d'outil (par défaut : 30) |
| `requestTimeoutSeconds` | number | Nombre maximal de secondes d'attente pour chaque réponse du modèle avant expiration (par défaut : 60). Augmentez cette valeur pour les fournisseurs lents ou auto-hébergés (LiteLLM, vLLM, modèles locaux) et les exécutions longues à plusieurs étapes. |
## Connexions MCP

Connectez-vous à des serveurs [Model Context Protocol](https://modelcontextprotocol.io/) pour exposer leurs outils à l'agent.

| Paramètre | Type | Description |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Type de connexion |
| `timeoutSeconds` | number | Délai d'expiration pour cette connexion (par défaut : 30) |
| `label` | string | Nom d'affichage facultatif |

**stdio** (processus local) :

| Champ | Description |
|-------|-------------|
| `command` | Commande à exécuter (ex. `npx`) |
| `args` | Tableau JSON (ex. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | Objet JSON des variables d'environnement injectées dans le processus (ex. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

La plupart des serveurs stdio authentifiés par clé API s'authentifient via des variables d'environnement plutôt que par des arguments de commande. Définissez `env` par connexion afin que chaque nœud Agent puisse utiliser un identifiant différent sans modifier l'environnement de l'hôte.

Les valeurs de `env` prennent en charge le [Expression DSL](../reference/expression-dsl.md), ce qui vous permet de transmettre des entrées de workflow comme identifiants plutôt que de coder en dur des secrets :

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

L'expression `$userInput.pat` est résolue à l'exécution par rapport aux données d'entrée du workflow avant le démarrage du processus MCP. Cela vous permet d'accepter des tokens depuis un Trigger ou un nœud d'entrée plutôt que de les intégrer dans la définition du workflow.

Exemple — GitHub MCP avec token codé en dur :

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Exemple — GitHub MCP avec token dynamique issu de l'entrée du workflow :

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Exemple — GitHub MCP avec un identifiant GitHub Heym :

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

L'identifiant GitHub intégré cible actuellement l'authentification basée sur un PAT. Si vous avez besoin d'un accès à une organisation, utilisez un PAT disposant des permissions d'organisation/dépôt requises.

Exemple — Slack MCP :

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (serveur distant) :

| Champ | Description |
|-------|-------------|
| `url` | URL de l'endpoint SSE. Prend en charge les expressions (ex. `$userInput.serverUrl`). |
| `headers` | Objet JSON pour l'authentification ou les en-têtes personnalisés. Les valeurs prennent en charge les expressions. |

**Streamable HTTP** (serveur distant) :

| Champ | Description |
|-------|-------------|
| `url` | URL de l'endpoint MCP (ex. `https://example.com/mcp`). Prend en charge les expressions. |
| `headers` | Objet JSON pour l'authentification ou les en-têtes personnalisés. Les valeurs prennent en charge les expressions. |

## Skills

Les Skills sont des instructions SKILL.md accompagnées de fichiers Python facultatifs et de ressources intégrées. Ils étendent le contexte système de l'agent et peuvent ajouter des outils Python.

| Paramètre | Type | Description |
|-----------|------|-------------|
| `name` | string | Nom du Skill |
| `content` | string | Contenu de SKILL.md (instructions) |
| `timeoutSeconds` | number | Délai d'expiration pour l'exécution Python du Skill (par défaut : 30) |
| `driveFilesEnabled` | boolean | Active l'assistant `heym_drive` à l'exécution pour ce Skill (par défaut : false) |
| `files` | array | Entrées facultatives `{ path, content, encoding, mimeType }` (ex. scripts `.py` ou ressources binaires stockées en base64) |

Les Skills peuvent être ajoutés en déposant un fichier `.zip` ou `.md` sur la zone Skills.
Après avoir développé une carte de Skill, déposez n'importe quel fichier sur ce Skill pour y joindre ou remplacer un fichier intégré, y compris des ressources binaires telles que des PDF et des images.
Utilisez le bouton de téléchargement sur une carte de Skill pour exporter ce Skill sous forme d'archive `.zip` à des fins de sauvegarde ou de réutilisation dans un autre workflow.

Activez **Drive files** sur un Skill uniquement lorsque son code Python doit lire des fichiers depuis Heym Drive. Les Skills activés reçoivent un assistant `heym_drive.py` généré à l'exécution et peuvent appeler `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` ou `read_drive_base64` avec un identifiant de fichier Drive ou un nom de fichier exact. La recherche par nom de fichier utilise la correspondance accessible la plus récente. Les Skills désactivés ne reçoivent pas l'assistant.

Chaque carte de Skill dispose de quatre actions sur la ligne située sous le titre :

| Bouton | Description |
|--------|-------------|
| **Edit with AI** | Ouvre Skill Builder pour réviser le Skill à partir d'un prompt de chat |
| **Download** | Exporte le Skill sous forme d'archive `.zip` |
| **Remove** | Supprime le Skill de ce nœud Agent |
| **History** | Ouvre l'historique du Skill dérivé de l'[Historique des modifications](../reference/edit-history.md) |
### Historique des Skills

L'historique des Skills n'est **pas** stocké séparément. Il est dérivé des snapshots de l'Historique des modifications du Workflow : chaque version enregistrée du Workflow inclut l'intégralité du tableau `skills` du nœud Agent.

Depuis la boîte de dialogue Historique, vous pouvez :

- **Prévisualiser** un snapshot antérieur (SKILL.md et liste des fichiers)
- **Modifier** — charger un snapshot dans l'éditeur de Skills sans rétablir l'intégralité du Workflow
- **AI Fine-tune** — ouvrir le Skill Builder avec ce snapshot comme point de départ
- **Rétablir** — restaurer uniquement ce Skill depuis une version antérieure (les autres nœuds restent inchangés)

L'historique suit la même rétention de 7 jours que l'Historique des modifications du Workflow. L'enregistrement du Workflow après modification des Skills crée de nouvelles entrées d'historique.

La section Skills inclut également **AI Build** :

- Cliquez sur **AI Build** pour créer un nouveau Skill à partir d'un prompt de chat
- Cliquez sur le bouton sparkle d'un Skill existant pour le réviser avec l'IA
- Déposez des fichiers dans le composeur de prompt pour les joindre au commentaire de fine-tune ; ces fichiers sont également enregistrés comme assets groupés du Skill
- La fenêtre modale diffuse le texte de l'assistant tout en affichant des aperçus en direct des fichiers `SKILL.md` et `.py`
- **Download ZIP** exporte l'aperçu actuel sans l'ajouter au nœud
- **Save & Add** enregistre les fichiers générés via le même processus d'analyse ZIP que celui utilisé pour les imports manuels

Lors d'une modification avec l'IA, Heym n'envoie au builder que les fichiers Skill textuels `.md` et `.py`. Les pièces jointes binaires et autres fichiers non modifiables sont préservés et partagés avec le builder sous forme de métadonnées de chemin, afin que le code Python généré puisse conserver des références de fichiers relatives correctes.
Sélectionnez un fichier joint dans le panneau de droite et activez **Include this file in AI context** lorsque l'IA doit inspecter un modèle groupé. Les fichiers texte, PDF et DOCX sont extraits dans le contexte du prompt lorsque cela est possible ; Heym n'applique aucune limite de taille de pièce jointe spécifique au Skill Builder au-delà de la limite du corps de requête de la plateforme.

## Extra Body

Certains fournisseurs acceptent des paramètres de requête que les champs standard compatibles OpenAI ne couvrent pas, comme la désactivation du mode de réflexion d'un modèle. Cochez **Send extra request body** dans les propriétés du nœud et saisissez un objet JSON.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Désactivé par défaut.** Lorsque la case est décochée, rien de supplémentaire n'est envoyé.
- Appliqué à **chaque** requête de la boucle d'appel d'outils, pas seulement au premier tour, ainsi qu'à la tentative de modèle de repli. Non appliqué aux vérifications de guardrails, qui utilisent un modèle distinct.
- Doit être un **objet** JSON. Un tableau, une valeur scalaire ou un texte mal formé fait échouer le nœud avec `Invalid extra body JSON` au lieu d'être ignoré silencieusement.
- Les expressions `$` sont résolues avant l'analyse. Comme il s'agit d'une substitution textuelle, une valeur résolue contenant un guillemet double ou un saut de ligne produit un JSON invalide et fait échouer le nœud.

Même champ et même comportement que l'extra body du [nœud LLM](./llm-node.md).

## Guardrails

Activez **Guardrails** dans les propriétés du nœud pour bloquer les messages utilisateur non sécurisés avant l'exécution de l'agent. Consultez [Guardrails](../reference/guardrails.md) pour la référence complète.

## Mémoire persistante (graphe)

Graphe de connaissances optionnel **par nœud Agent** stocké dans la base de données. Lorsqu'il est activé, Heym ajoute un résumé Markdown des entités et relations mémorisées à l'**instruction système** avant chaque exécution (uniquement si le graphe n'est pas vide). Après un achèvement **réussi** de l'agent, une tâche en arrière-plan extrait de nouveaux faits durables de la conversation et les fusionne dans le graphe.

| Paramètre | Type | Description |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Activer le chargement + l'extraction en arrière-plan pour ce nœud du canvas |

Les **sous-agents** conservent leur **propre** graphe (indexé par leur identifiant de nœud), distinct de celui de l'orchestrateur.

Utilisez le contrôle rose **brain** sur le nœud (lorsque la mémoire est activée ou que la ligne du modèle est affichée) pour ouvrir l'éditeur de graphe et le **partage de mémoire** optionnel (autres Workflows/agents). Comportement complet, chemins REST et détails de l'export JSON : [Agent Persistent Memory](../reference/agent-persistent-memory.md).
## API Responses et continuité du raisonnement

Une case à cocher **Use Responses API** achemine les appels au modèle de l'agent via l'[API Responses](https://platform.openai.com/docs/api-reference/responses) au lieu de Chat Completions. Elle est désactivée par défaut.

Elle est particulièrement importante avec un modèle de raisonnement tel que `gpt-5` ou la série `o`. L'API Responses renvoie le raisonnement du modèle en même temps que chaque appel d'outil, et l'agent réinjecte ces éléments de raisonnement au tour suivant, de sorte que le modèle conserve sa chaîne de pensée tout au long d'une boucle d'outils à plusieurs étapes au lieu de la reconstruire après chaque résultat d'outil. L'ensemble de la boucle s'exécute sur le même chemin, y compris la pause et la reprise de la [revue humaine](#human-review-hitl), la [compression de contexte](#context-compression) et la réponse finale.

La conversation elle-même reste dans Heym. Heym envoie l'intégralité de l'entrée à chaque tour et transporte le raisonnement sous forme de blob chiffré, de sorte que rien n'est conservé côté fournisseur entre les appels. Les éléments de raisonnement contenus dans un span que la compression de contexte résume sont supprimés en même temps que celui-ci, car un blob chiffré ne peut pas être résumé.

Cela fonctionne avec un identifiant OpenAI, ainsi qu'avec un identifiant personnalisé dont la passerelle prend en charge l'endpoint. Avec un identifiant Google, l'option reste désactivée.

## Compression de contexte

Lorsqu'un agent exécute de nombreuses itérations d'outils avec des résultats volumineux (web scraping, lecture de documents, sorties de sous-workflow), l'historique des messages accumulé peut approcher la limite de la fenêtre de contexte du modèle. Heym compresse automatiquement l'historique de la conversation en cours d'exécution pour éviter tout débordement de contexte.

**Fonctionnement :**

1. Avant chaque itération d'outil, Heym estime le nombre de tokens actuel (~4 caractères par token).
2. Si l'estimation dépasse **80 %** de la fenêtre de contexte du modèle, la compression est déclenchée.
3. L'historique des messages est scindé en sections préservées et compressées :
   - **Préservées** : prompt système, premier message utilisateur, message utilisateur le plus récent
   - **Compressées** : tout ce qui se trouve entre les deux (tours de raisonnement de l'assistant, appels d'outils, résultats d'outils)
4. La section intermédiaire est résumée à l'aide du **même modèle et du même identifiant** — aucune configuration supplémentaire n'est nécessaire.
5. Le résumé compressé remplace la section intermédiaire sous la forme d'un unique message de l'assistant.

**Observabilité :**

Les événements de compression apparaissent sous la forme d'entrées `Context compressed (N messages → summary)` dans :
- La liste des appels d'outils du **panneau Debug** pendant l'exécution en direct
- La vue détaillée d'une exécution dans l'**Historique d'exécution**
- L'onglet **Traces**, sous la forme d'une entrée de trace `context.compression`

La compression est automatique et toujours active pour les Nœuds Agent. Elle ne s'applique **pas** aux Nœuds LLM, à l'onglet Chat ni aux sessions de l'AI Assistant.

## Voir aussi

- [Pourquoi Heym](../getting-started/why-heym.md) – Comment les agents s'exécutent et restent gouvernés en production
- [Mémoire persistante de l'agent](../reference/agent-persistent-memory.md) – Graphe de connaissances par Nœud Agent, partage optionnel, API, éditeur
- [Architecture de l'agent](../reference/agent-architecture.md) – Sous-agents, orchestrateur, skills, MCP, appel d'outils
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Pages de revue publiques, exécutions en attente, flux approuver/modifier/refuser
- [Guardrails](../reference/guardrails.md) – Bloquer les catégories de contenu non sûr
- [Types de nœuds](../reference/node-types.md) – Vue d'ensemble de tous les types de nœuds
- [AI Assistant](../reference/ai-assistant.md) – Interface Chat pour construire des workflows en langage naturel (distincte du Nœud Agent)
- [Expression DSL](../reference/expression-dsl.md) – Référencer des données dans les prompts
- [Structure de workflow](../reference/workflow-structure.md) – Nœuds, arêtes et format DSL
- [Démarrage rapide](../getting-started/quick-start.md) – Workflow de base avec LLM et expressions
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter des clés API pour l'agent
- [Onglet MCP](../tabs/mcp-tab.md) – Configurer MCP pour les outils de workflow
