# Ensemble complet des fonctionnalités de Heym

Un aperçu complet de toutes les capacités de Heym. Chaque section décrit une fonctionnalité ou un concept en quelques phrases.

---

## Prise en main

### [Introduction](../getting-started/introduction.md)

Heym est une infrastructure permettant d'exécuter et de gouverner des agents IA en production. Vous construisez des systèmes agentiques sur un canvas visuel et les exécutez en toute confiance : orchestrez des agents, automatisez des processus métier, inspectez chaque exécution et gardez les humains aux commandes sur votre propre infrastructure. La plateforme prend en charge les workflows visuels, les nœuds alimentés par l'IA ([LLM](../nodes/llm-node.md), [Nœud Agent](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), un [Assistant IA](./ai-assistant.md), des intégrations ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), e-mail entrant via [IMAP Trigger](../nodes/imap-trigger-node.md), envoi sortant via [Send Email](../nodes/send-email-node.md)), la planification avec [Cron](../nodes/cron-node.md) et des portails de chat [Portal](./portal.md) pour les utilisateurs finaux.

Voir également [Concepts fondamentaux](../getting-started/core-concepts.md), [Types de nœuds](./node-types.md) et [Intégrations tierces](./integrations.md).

### [Pourquoi Heym](../getting-started/why-heym.md)

Pourquoi Heym parcourt le cycle de vie des agents (construire, orchestrer, exécuter, observer, évaluer, contrôler, exposer) et montre ce qu'un runtime auto-hébergé gère à chaque étape. Cela couvre le nœud [LLM](../nodes/llm-node.md) et le [Nœud Agent](../nodes/agent-node.md) avec appel d'outils, outils Python, connexions [MCP](../tabs/mcp-tab.md), skills et orchestration multi-agents ; les triggers, les tentatives de réexécution et la [répartition de charge](./cluster.md) ; les [Traces](../tabs/traces-tab.md) avec coût USD par exécution et export OpenTelemetry ; les [Évaluations](../tabs/evals-tab.md) ; les [points de contrôle de revue humaine](./human-in-the-loop.md), les guardrails, le SSO et une piste d'audit ; ainsi que les endpoints REST, MCP et Portal. Une comparaison des capacités avec n8n, Zapier et Make.com clôt la page.

Voir également [Nœud Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) et [Architecture des agents](./agent-architecture.md).

### [Démarrage rapide](../getting-started/quick-start.md)

Lancez votre premier workflow en quelques minutes : créez un workflow depuis l'onglet [Workflows](../tabs/workflows-tab.md), ajoutez un nœud [Input](../nodes/input-node.md), un nœud [LLM](../nodes/llm-node.md) et un nœud [Output](../nodes/output-node.md), puis connectez-les. Configurez le [LLM](../nodes/llm-node.md) avec un identifiant et définissez `userMessage` sur `$input.text` ; utilisez Run ou l'[Assistant IA](./ai-assistant.md) pour exécuter ou générer des workflows en langage naturel.

À combiner naturellement avec [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) et [Expression DSL](./expression-dsl.md).

### [Concepts fondamentaux](../getting-started/core-concepts.md)

Les workflows sont des graphes orientés de nœuds reliés par des arêtes ; l'exécution part des nœuds trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) en traversant les nœuds de traitement jusqu'aux nœuds [Output](../nodes/output-node.md). Chaque nœud possède un type, des données (configuration) et des entrées/sorties ; les arêtes définissent le flux de données. Les nœuds référencent les données en amont via des expressions [Expression DSL](./expression-dsl.md) telles que `$nodeLabel.field` ; les nœuds indépendants s'exécutent automatiquement en [parallèle](./parallel-execution.md).

Voir également [Triggers](./triggers.md), [Exécution parallèle](./parallel-execution.md) et [Structure des workflows](./workflow-structure.md).

### [Exécution et déploiement](../getting-started/running-and-deployment.md)

Heym fournit `run.sh` pour le développement local (base de données dans Docker, backend FastAPI, frontend Vite) et `deploy.sh` pour la production avec Docker Compose. Les deux utilisent un fichier `.env` ; les variables clés incluent `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` et `ALLOW_REGISTER`. Le développement s'exécute sur des ports frontend et backend configurables ; la production sert l'API sous `/api` via le conteneur frontend.

Voir également [Sécurité](./security.md), [Enterprise](./enterprise.md) et [Paramètres](./user-settings.md).
### [Migrer vers Heym](../getting-started/migrate-to-heym.md)

L'outil AI Convert transforme un workflow provenant d'une autre plateforme (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) ou une description en langage naturel en un workflow Heym, diffusé en direct sur un canvas et prêt à être [téléchargé et importé](./download-import.md). Il exécute un contrôle de sécurité par IA, puis génère le DSL avec les limites d'entrée et de débit en place. Ouvrez-le sur [heym.run/convert](https://heym.run/convert).

Voir également [Quick Start](../getting-started/quick-start.md), [Download & Import](./download-import.md) et [AI Assistant](./ai-assistant.md).

---

## Nœuds

### Triggers

#### [Input](../nodes/input-node.md)

Le nœud Input est le point d'entrée des workflows qui reçoivent des données de l'utilisateur ou de l'appelant de l'API. Il prend en charge un ou plusieurs champs d'entrée et expose les métadonnées de la requête (headers, query params). Accédez aux champs du body via `$nodeLabel.body.fieldKey`, aux headers via `$nodeLabel.headers`, et à la query via `$nodeLabel.query`.

S'associe naturellement avec [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) et [Output](../nodes/output-node.md). Pour les références de payload et l'accès aux champs, consultez [Expression DSL](./expression-dsl.md) et [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Le nœud Cron déclenche un workflow selon une planification à l'aide d'une expression cron standard à cinq champs. Aucune saisie utilisateur n'est requise—le workflow s'exécute automatiquement aux heures spécifiées (par exemple toutes les heures, quotidiennement, toutes les 15 minutes). La sortie est un événement de trigger sans payload.

Voir également [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) et [Execution History](./execution-history.md) pour les exécutions planifiées et différées.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

Le nœud IMAP Trigger interroge une boîte de réception à un intervalle configurable en minutes et démarre un workflow pour chaque nouvel email détecté. Il produit en sortie les headers analysés, les listes d'expéditeurs et de destinataires, les corps en texte brut et HTML, les métadonnées des pièces jointes et un horodatage de trigger. Utilisez-le pour le tri des boîtes de réception de support, le routage de boîtes mail vers [Slack](../nodes/slack-node.md), ou les flux d'approbation pilotés par email avec [Human-in-the-Loop](./human-in-the-loop.md).

S'associe avec [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) et [Slack](../nodes/slack-node.md) pour les workflows de tri et de réponse aux messages entrants.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Le nœud Heym Trigger démarre un workflow lorsque Heym lui-même publie un événement de plateforme : `heym.started`, `workflow.created`, `workflow.updated` ou `workflow.deleted`. La livraison est regroupée par lots - chaque événement publié dans une même fenêtre de dispatch de cinq secondes arrive dans une seule exécution sous la forme `$nodeLabel.events`, toujours un tableau. Chaque événement est revendiqué via une contrainte de base de données unique, de sorte qu'il se déclenche exactement une fois par nœud abonné, quel que soit le nombre de workers, de conteneurs ou de machines en cours d'exécution. Utilisez-le pour les pistes d'audit des modifications de workflow, les annonces de déploiement et les synthèses de santé d'instance.

S'associe avec le nœud [Heym](../nodes/heym-node.md) pour rechercher le workflow modifié, et avec [Loop](../nodes/loop-node.md) pour agir une fois par événement.

#### [Heym](../nodes/heym-node.md)

Le nœud Heym lit les données propres à Heym via trois opérations : `listWorkflows` renvoie chaque workflow accessible au propriétaire avec le nombre de nœuds et les horodatages, `getWorkflow` renvoie la structure des nœuds et des arêtes d'un workflow, et `getExecutionHistory` renvoie les entrées de l'historique d'exécution du plus récent au plus ancien avec des filtres optionnels par statut, fenêtre temporelle et limite, accompagnés de totaux regroupés par statut. Les résultats sont limités au propriétaire du workflow dans lequel réside le nœud, de sorte qu'une exécution lancée par cron, un portail ou un événement renvoie les mêmes données qu'une exécution manuelle. `getWorkflow` renvoie la configuration complète des nœuds, ce qui permet d'auditer un workflow à la recherche de clés ou de tokens codés en dur ; il n'expose rien que le propriétaire du workflow ne pourrait déjà ouvrir dans l'éditeur. Aucun identifiant n'est requis.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

Le nœud WebSocket Trigger ouvre une connexion client sortante vers un serveur WebSocket externe et démarre le workflow sur `onMessage`, `onConnected` ou `onClosed`. Il expose les payloads de messages analysés, l'état de reconnexion, les métadonnées de fermeture et l'URL du socket pour les expressions en aval.

S'associe avec [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) et [SSE Streaming](./sse-streaming.md) pour les intégrations en temps réel.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Le nœud Telegram Trigger reçoit les mises à jour de webhook du bot et démarre le workflow immédiatement. Il expose le payload complet de la mise à jour, l'objet message principal, les callback queries, les headers assainis et un horodatage de trigger. Utilisez-le pour les chatbots, les assistants IA dans [Telegram](../nodes/telegram-node.md) et les flux pilotés par boutons.

S'associe avec [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) et [Webhooks](./webhooks.md) pour les workflows pilotés par bot.
#### [Slack Trigger](../nodes/slack-trigger-node.md)

Le nœud Slack Trigger reçoit les webhooks de l'API Slack Events et démarre automatiquement un workflow après vérification de la signature de la requête. Il expose le payload de l'événement et les en-têtes assainis pour le routage en aval, la classification basée sur un [LLM](../nodes/llm-node.md) et les flux de réponse.

S'associe aux nœuds [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) et [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Le nœud Discord Trigger reçoit les webhooks de l'API Discord Interactions, vérifie les signatures Ed25519 à l'aide de l'identifiant `discord_trigger` sélectionné, puis démarre le workflow. Il expose le payload complet de l'interaction, les données de commande, les en-têtes assainis et les métadonnées du trigger pour le routage en aval ou les réponses.

S'associe aux nœuds [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) et [Third-Party Integrations](./integrations.md).

#### [RabbitMQ](../nodes/rabbitmq-node.md)

Le nœud RabbitMQ envoie ou reçoit des messages depuis les files et exchanges RabbitMQ. Utilisez-le pour les workflows pilotés par messages et le traitement d'événements. Le mode envoi publie un message avec un délai optionnel ; le mode réception agit comme un [trigger](./triggers.md), de sorte que le workflow démarre à l'arrivée d'un message. La sortie inclut le statut, message_id et le body.

S'associe aux nœuds [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) et à l'[Parallel Execution](./parallel-execution.md) pour le traitement piloté par événements.

#### [Error Handler](../nodes/error-handler-node.md)

Le nœud Error Handler s'exécute automatiquement lorsqu'un nœud du workflow échoue. Aucune arête entrante n'est nécessaire ; il est déclenché par le moteur. La sortie inclut le message d'erreur, le label du nœud en échec, le type de nœud et l'horodatage. Utilisez-le pour envoyer des notifications via [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) ou [Send Email](../nodes/send-email-node.md), journaliser les erreurs ou renvoyer des réponses d'erreur personnalisées.

Comme alternative à la gestion des erreurs sur le canvas, un workflow peut également déléguer les échecs à un workflow distinct — consultez [Error Workflow](#error-workflow). Si le canvas contient déjà un nœud Error Handler, le workflow d'erreur n'est **pas** appelé (le gestionnaire local est prioritaire).

Les cibles de notification courantes sont [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) et [Send Email](../nodes/send-email-node.md) ; les détails d'exécution sont plus faciles à inspecter dans l'[Execution History](./execution-history.md).

### AI
#### [Nœud Agent](../nodes/agent-node.md)

Le nœud Agent IA est un nœud [LLM](../nodes/llm-node.md) doté de la capacité d'appel d'outils. Il peut exécuter des outils Python, appeler des nœuds du canvas connectés en tant qu'outils, se connecter à des serveurs [MCP](../tabs/mcp-tab.md), utiliser des skills (fichiers d'instructions et scripts Python optionnels), agir comme orchestrateur en déléguant à d'autres nœuds Agent, et appeler d'autres workflows en tant qu'outils. La sortie est disponible via `$nodeLabel.text`. Un toggle optionnel **Extra Body** attache un objet JSON de paramètres de requête spécifiques au fournisseur à chaque requête de la boucle d'appel d'outils ; il est désactivé par défaut. Un toggle optionnel **Use Responses API** achemine les appels de modèle de l'agent via la Responses API, ce qui préserve le raisonnement du modèle à travers les appels d'outils afin qu'un modèle de raisonnement conserve sa chaîne de pensée tout au long d'une boucle multi-étapes ; il est désactivé par défaut et fonctionne avec OpenAI et les Identifiants personnalisés.

Les outils de nœud du canvas permettent à un agent d'appeler directement des nœuds de workflow configurés depuis le canvas. Connectez un nœud pris en charge au handle d'outils de l'agent, puis marquez des champs spécifiques comme fournis par l'agent à l'aide de l'icône bot. Ces champs deviennent des paramètres d'outil à l'exécution, tandis que les Identifiants et les champs non marqués restent figés dans la configuration du nœud.

La section Skills inclut désormais **AI Build** pour créer de nouveaux skills, une action d'édition IA en ligne pour les skills existants, le téléchargement ZIP par skill, et un interrupteur optionnel **Enable Drive files** pour les skills qui doivent lire des fichiers Heym Drive à l'exécution. La modale Skill Builder diffuse une conversation Chat sur la gauche, accepte les fichiers par glisser-déposer avec chaque commentaire de fine-tune, affiche un aperçu en direct en lecture seule des fichiers `SKILL.md` et `.py` générés sur la droite, peut télécharger cet aperçu au format ZIP, et enregistre les fichiers de fine-tune téléversés en tant qu'assets de skill intégrés via le même flux d'ingestion ZIP que celui utilisé par les téléversements manuels.

Lorsque **[Agent Persistent Memory](./agent-persistent-memory.md)** est activé, chaque nœud Agent conserve son propre graphe de connaissances : les faits sont chargés dans le prompt système lorsqu'ils ne sont pas vides, et les exécutions réussies déclenchent une fusion en arrière-plan des nouvelles entités et relations. Les sous-agents utilisent des graphes distincts. Vous pouvez **partager** le graphe d'un agent avec d'autres agents (du même workflow ou d'un autre) avec un accès en lecture seule ou en lecture/écriture depuis la boîte de dialogue du graphe. Le contrôle cerveau du canvas ouvre l'éditeur de graphe.

Les nœuds Agent peuvent également passer en mode [Human-in-the-Loop](./human-in-the-loop.md). Dans ce mode, l'agent dispose d'un outil `request_human_review` et peut s'interrompre à des étapes spécifiques nécessitant une approbation, créer un lien de revue public à usage unique, exposer une branche canvas `review` pour les flux de notification, et attendre qu'un relecteur accepte, modifie ou refuse le texte de revue Markdown. Le champ HITL du nœud sert de directives d'approbation pour déterminer quand demander, tandis que le résumé destiné au relecteur est généré à partir de chaque demande de revue. Pour les outils [MCP](../tabs/mcp-tab.md), Heym utilise le modèle pour interpréter ces instructions écrites en `always`, `once` ou `never`, de sorte qu'un langage d'approbation libre corresponde à une politique d'exécution concrète. L'exécution est marquée `pending` et reprend à partir du snapshot d'exécution stocké une fois la décision reçue, et la même exécution d'agent peut s'interrompre plusieurs fois si des étapes ultérieures nécessitent également une revue.

Les nœuds Agent compressent automatiquement leur historique de messages accumulé lorsqu'il approche 80 % de la fenêtre de contexte du modèle. Le prompt système, le premier message utilisateur et le message utilisateur le plus récent sont toujours préservés ; tout ce qui se trouve entre les deux est résumé à l'aide du même modèle et du même Identifiant. Les événements de compression sont visibles dans le panneau Debug, l'[Historique d'exécution](./execution-history.md) et l'onglet [Traces](../tabs/traces-tab.md).

Voir également [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) et [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Le nœud Codex exécute l'interface CLI OpenAI Codex dans un espace de travail Heym isolé. Il accepte un identifiant Codex (connectez-vous avec ChatGPT pour utiliser votre abonnement sans coûts API par token, ou collez un access token), un identifiant GitHub, l'URL du dépôt, la branche de base, le prompt de tâche, le mode de publication (`diff_only` ou `draft_pr`), le nom de branche et le délai d'expiration. Le runner clone le dépôt localement, transmet le bundle de tokens ChatGPT ou `CODEX_ACCESS_TOKEN` uniquement au processus Codex, et renvoie un résumé structuré, des notes de validation, les fichiers modifiés, le diff, les métadonnées d'utilisation et une URL de draft PR facultative.

Lorsque Codex renvoie `needs_input`, le workflow se met en pause et expose la branche `question`. Connectez cette branche à Slack, à un e-mail ou à un autre nœud de notification ; le lien public de suivi reprend le snapshot d'exécution sauvegardé une fois la réponse soumise. Le nœud Codex peut également être attaché à un Agent IA en tant qu'outil, ce qui permet à l'agent de déléguer des tâches de codage ; en tant qu'outil, un résultat `needs_input` est renvoyé directement à l'agent au lieu de mettre le workflow en pause.

Voir également [GitHub](../nodes/github-node.md), [Identifiants](./credentials.md), [Partage d'identifiants](./credentials-sharing.md) et [Types de nœuds](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Le nœud OpenCode Go exécute l'interface CLI OpenCode (Go) sur un dépôt GitHub. L'isolation suit le modèle de Codex : en local, il s'exécute comme sous-processus de l'hôte, tandis que les déploiements Docker l'exécutent dans un conteneur frère durci qui partage le volume de l'espace de travail. Il accepte un identifiant OpenCode Go (une clé API de passerelle avec une URL de base facultative), un identifiant GitHub, l'URL du dépôt, la branche de base, le prompt de tâche, le mode de publication, le nom de branche, le délai d'expiration et un modèle `opencode-go/<model>` choisi dans une liste de modèles dynamique et interrogeable (avec un repli intégré). Heym effectue toutes les opérations git/GitHub sur l'hôte et ne place jamais le token GitHub à l'intérieur du sandbox ; OpenCode se contente de modifier les fichiers sur le disque. Le nœud renvoie un résumé structuré, des notes de validation, les fichiers modifiés, le diff et une URL de pull request facultative. Il peut être attaché à un Agent IA en tant qu'outil.

Voir également [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Identifiants](./credentials.md), [Partage d'identifiants](./credentials-sharing.md) et [Types de nœuds](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Le nœud LLM traite du texte avec un modèle de langage ou génère des images. Il prend en charge la génération de texte, la vision (entrée d'image), la génération d'images, la sortie JSON structurée, l'exécution native de la Batch API du fournisseur pour les endpoints OpenAI et compatibles OpenAI pris en charge, ainsi qu'une bascule facultative **Use Responses API** qui achemine l'appel via la Responses API au lieu de Chat Completions (désactivée par défaut ; fonctionne avec OpenAI et les identifiants personnalisés, et ne peut pas être combinée avec le mode Batch). Configurez l'identifiant, le modèle, les messages système et utilisateur, la température et le nombre maximal de tokens ; utilisez le [DSL d'expression](./expression-dsl.md) dans les prompts. En mode batch, le `userMessage` doit se résoudre en un tableau, le nœud émet une branche `batchStatus` avec les mises à jour de progression, et la sortie finale inclut les résultats batch par élément. Une bascule facultative **Extra Body** attache un objet JSON de paramètres de requête propres au fournisseur (par exemple `{"thinking": {"type": "disabled"}}`) à chaque appel API ; elle est désactivée par défaut. Les [Guardrails](./guardrails.md) facultatifs bloquent le contenu non sécurisé avant l'appel.

S'associe naturellement avec [Qdrant RAG](../nodes/rag-node.md), le [Nœud Agent](../nodes/agent-node.md), les [Guardrails](./guardrails.md) et la [Boîte de dialogue d'évaluation d'expression](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Le nœud Decision pose à un modèle de décision des questions typées sur l'état de l'exécution et renvoie des probabilités plutôt que de la prose. Un champ **State** transporte ce que le modèle doit lire — une expression seule conserve son propre type, de sorte que `$input` envoie l'objet plutôt que son texte — et une liste de questions porte les jugements. Les questions se présentent sous trois formes : **noul** indique si une condition est remplie, **choice** sélectionne une option parmi un ensemble que vous définissez et renvoie la distribution complète, et **score** évalue l'état selon des niveaux ordonnés et peut se situer entre eux. Les réponses choice et score portent également une confiance, de sorte qu'un [Switch](../nodes/switch-node.md) peut router sur la réponse tandis qu'une [Condition](../nodes/condition-node.md) filtre sur le degré de certitude. **Generate with AI** rédige le modèle d'état et les lignes de questions à partir d'une simple phrase, et **Custom request body** envoie du JSON écrit à la main pour un endpoint dont le contrat diffère. La réponse du fournisseur est transmise telle quelle, et chaque appel est enregistré dans les [Traces](../tabs/traces-tab.md).

Nécessite un identifiant Decision Model ; s'associe naturellement avec [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) et le [Nœud Agent](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

Le nœud RAG / Vector Store insère, met à jour (upsert), supprime et recherche des documents dans une base vectorielle pour la génération augmentée par récupération. Une liste déroulante Database permet de sélectionner le backend — **Qdrant** (serveur externe) ou **Postgres (pgvector)** (base de données propre à Heym, sans service externe), avec Qdrant par défaut. Choisissez une base vectorielle depuis l'onglet [Vectorstores](../tabs/vectorstores-tab.md) et définissez l'opération sur insert, upsert, delete ou search. Les opérations upsert et delete adressent un document par un id unique stocké dans le payload — un champ **Document ID Field** nomme ce champ (par défaut `doc_id`) et **Document ID** porte sa valeur — afin qu'un document conserve l'id déjà utilisé par votre propre système : l'upsert remplace chaque point correspondant avant de stocker la nouvelle version, et delete indique si une correspondance a été trouvée. Les métadonnées de document acceptent des expressions dans leurs valeurs, ainsi `{"url": "$start.url"}` stocke ce que l'exécution a produit. La recherche prend en charge les filtres de métadonnées, la **Hybrid Search** optionnelle (similarité vectorielle fusionnée avec la correspondance de mots-clés BM25, de sorte que les termes exacts tels que les identifiants et les codes d'erreur soient trouvés à côté des correspondances sémantiques) et le reranking Cohere optionnel, et renvoie un tableau de résultats avec text, score, metadata, indicateurs reranked et hybrid, et count, à utiliser dans les flux [LLM](../nodes/llm-node.md) ou [Agent Node](../nodes/agent-node.md).

Les nœuds en aval courants sont [LLM](../nodes/llm-node.md) et [Agent Node](../nodes/agent-node.md) ; la configuration de la base vectorielle se trouve dans [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

Le nœud MCP Call appelle directement un outil [MCP](../tabs/mcp-tab.md) spécifique, sans qu'un LLM décide quel outil invoquer. Utilisez-le lorsque vous savez exactement quel outil exécuter au moment de la conception — pour une exécution déterministe et en une seule étape d'un outil MCP dans un workflow. Configurez une connexion (SSE, Streamable HTTP ou stdio ; mêmes champs que la connexion MCP du [Agent Node](../nodes/agent-node.md)), cliquez sur **Fetch Tools** pour alimenter une liste déroulante, sélectionnez un outil et renseignez les champs d'arguments générés automatiquement à partir du schéma d'entrée de l'outil. Chaque argument accepte une valeur statique ou une [expression DSL](./expression-dsl.md) telle que `$userInput.body.text`. Le résultat est disponible sous la forme `$nodeLabel.result` (objet JSON s'il est analysable, sinon chaîne de caractères). Le nœud MCP Call ne peut pas être connecté à un [Agent Node](../nodes/agent-node.md) en tant qu'outil du canvas.

Voir également [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) et [Expression DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

Le nœud Condition branche le workflow selon une expression if/else. Il dispose de deux sorties : une lorsque la condition est vraie et une lorsqu'elle est fausse. Utilisez les opérateurs de comparaison et logiques de l'[Expression DSL](./expression-dsl.md) dans l'expression de condition ; le nœud transmet l'entrée à la branche choisie.

Voir également [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) et [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Le nœud Switch oriente l'exécution vers différents chemins en comparant une valeur à des cas. Configurez une expression à évaluer et une liste de valeurs de cas ; chaque cas dispose d'une sortie dédiée et une sortie par défaut est utilisée pour les valeurs sans correspondance. L'entrée est transmise à la branche correspondante.

Utilisez [Condition](../nodes/condition-node.md) pour un branchement binaire et [Merge](../nodes/merge-node.md) pour rejoindre les chemins routés ; les règles de correspondance sont détaillées dans [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Le nœud Merge attend plusieurs entrées parallèles et les combine en une seule sortie. Définissez le nombre d'entrées à attendre ; le nœud produit un objet fusionné une fois toutes les branches terminées. Utilisez-le pour joindre les résultats de branches parallèles avant de poursuivre ; ne l'utilisez pas lorsque les branches parallèles se terminent par des nœuds Output distincts.

Voir également [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) et [Output](../nodes/output-node.md) lors de la recombinaison des branches.

#### [Loop](../nodes/loop-node.md)

Le nœud Loop itère sur un tableau, en exécutant les nœuds en aval pour chaque élément. Il nécessite une connexion retour depuis le dernier nœud du corps de l'itération pour avancer. À l'intérieur du corps de la boucle, utilisez `item`, `index`, `total`, `isFirst` et `isLast` ; la boucle dispose de sorties distinctes pour le chemin d'itération et le chemin done.

S'associe à [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) et [Expression DSL](./expression-dsl.md) pour les workflows itératifs.

### Data
#### [Set](../nodes/set-node.md)

Le nœud Set transforme et mappe les données d'entrée vers une sortie personnalisée. Définissez des mappings clé-valeur où chaque valeur est une expression [Expression DSL](./expression-dsl.md). Utilisez-le pour la mise en majuscules, l'extraction de sous-chaînes, la concaténation, la génération de nombres aléatoires et autres transformations similaires. Accédez à la sortie par clé (par ex. `$setNode.keyName`). Lorsqu'il est connecté à un agent en tant qu'outil de nœud sur le canvas, les valeurs de mapping peuvent être marquées comme fournies par l'agent afin que celui-ci les renseigne à l'exécution. Pour appeler d'autres workflows, utilisez plutôt le nœud [Execute](../nodes/execute-node.md).

Voir également [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) et [Expression DSL](./expression-dsl.md).

#### [Converter](../nodes/converter-node.md)

Le nœud Converter convertit les données entre différents formats sans écrire de code. Les conversions de texte sont `csvToJson` (texte CSV vers un tableau d'objets ligne, ou des tableaux lorsqu'il n'y a pas d'en-tête), `jsonToCsv` (un tableau d'objets/lignes vers un texte CSV), `xmlToJson` (texte XML vers un objet) et `jsonToXml` (un objet vers un texte XML). Configurez le sens de conversion et l'expression source ; les conversions CSV utilisent en outre un délimiteur et une gestion des en-têtes, et `jsonToCsv` peut fixer un ordre de colonnes explicite. Le quoting, les délimiteurs intégrés et les retours à la ligne intégrés suivent la RFC 4180. Les attributs XML utilisent des préfixes `@`, le texte mêlé aux attributs utilise `#text`, les éléments répétés deviennent des tableaux, et l'expansion des entités XML est désactivée. Le même nœud fonctionne également sur les fichiers stockés. `imageToText` et `pdfToText` exécutent Tesseract OCR, en lisant un fichier depuis Heym Drive (`$Upload.file.id` issu d'un Trigger File upload, du résultat d'un nœud Drive, ou d'un fichier généré par un agent), en choisissant automatiquement la langue à partir du script détecté ou en utilisant les codes que vous indiquez tels que `tur` ou `eng+tur`, et en normalisant le texte en UTF-8 par défaut avec une normalisation NFC optionnelle et des charsets plus restreints comme `cp1254`. `fileConvert` réécrit un fichier stocké dans un autre format, les documents via pandoc et les images via Pillow, et enregistre le résultat comme nouveau fichier Drive sans toucher à l'original. Le résultat est disponible sous `$converterNode.result`, avec `.language`, `.encoding`, `.page_count`, `.pages` et `.file` à ses côtés pour les exécutions OCR, et `.id`, `.filename` et `.download_url` pour `fileConvert`.

Voir également [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) et [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Le nœud Code exécute le Python que vous écrivez, avec son propre `requirements.txt`, dans un conteneur créé et détruit à chaque exécution. Votre code définit une fonction `main(params)` et renvoie toute valeur sérialisable en JSON, qui devient `$codeNode.result` ; tout ce qu'il affiche est capturé séparément sous `$codeNode.logs`, et `$codeNode.install` indique quel outil a installé les dépendances. Les paramètres sont configurés sous forme d'objet JSON dont les expressions `$` sont résolues avant l'exécution, et le code les lit avec la notation point telle que `params.user.name` ou `params.orders[0].id`. Les dépendances sont installées avec `uv`, avec repli sur `pip` pour les paquets que `uv` ne peut pas gérer, sans mise en cache entre les exécutions ; laisser `requirements.txt` vide saute entièrement l'installation et est bien plus rapide. La phase d'exécution n'a pas de réseau sauf si `codeAllowNetwork` est activé, tandis que l'installation des dépendances atteint toujours PyPI. Le sandbox s'exécute en non-root avec toutes les capacités supprimées, un système de fichiers racine en lecture seule, pas de socket Docker et aucun accès aux secrets du backend, plafonné à 512 Mo de mémoire, un CPU, 256 processus, une installation de 120 secondes et une exécution de 60 secondes. Docker est requis et il n'existe aucun mode de repli : sans daemon accessible, le nœud échoue plutôt que d'exécuter votre code dans le processus backend.

#### [Variable](../nodes/variable-node.md)

Le nœud Variable définit ou met à jour une variable locale au workflow (`$vars.variableName`) ou une [variable globale](./global-variables.md) persistante (`$global.variableName`). Utilisez-le pour les compteurs, les listes accumulées et l'état partagé. Configurez le nom de la variable, l'expression de valeur, la coercition de type et le stockage éventuel dans le store global. Les variables de type tableau prennent en charge `$array()` et `.add()`.

S'associe à [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) et [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Le nœud Execute appelle un autre workflow (sous-workflow) et lui transmet une entrée. Spécifiez le workflow cible par ID et fournissez l'entrée via une expression unique ou des mappings clé-valeur. La sortie inclut workflow_id, status et outputs ; utilisez-le pour la logique réutilisable, et non pour la transformation de données (utilisez Set pour cela).

Voir également [Canvas Features](./canvas-features.md) pour Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) et [Output](../nodes/output-node.md).

### Integrations
#### [HTTP](../nodes/http-node.md)

Le nœud HTTP effectue des requêtes HTTP à l'aide d'une configuration de type cURL. Il peut constituer un point de départ de Workflow (sans edge entrant) ou recevoir des entrées de nœuds en amont. La réponse est disponible sous forme de status, headers et body (JSON analysé le cas échéant). Utilisez les [Identifiants](./credentials.md) pour l'authentification Bearer ou par en-tête personnalisé.

S'utilise conjointement avec les [Webhooks](./webhooks.md), les [Identifiants](./credentials.md) et les [Intégrations tierces](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

Le nœud WebSocket Send ouvre une connexion client sortante, envoie un message texte/JSON/binaire, puis la ferme. Utilisez-le pour publier la sortie d'un Workflow vers des systèmes temps réel sans créer d'endpoint socket hébergé par Heym.

Voir également [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) et [Intégrations tierces](./integrations.md).

#### [Telegram](../nodes/telegram-node.md)

Le nœud Telegram envoie un message de bot vers un chat, un groupe ou un canal. Configurez un [identifiant](./credentials.md) Telegram, définissez `chatId` et composez le `message` sortant à l'aide d'expressions [Expression DSL](./expression-dsl.md). Il s'associe naturellement au [Telegram Trigger](../nodes/telegram-trigger-node.md) pour les Workflows conversationnels et à l'[Error Handler](../nodes/error-handler-node.md) pour les alertes opérateur.

Voir également [Intégrations tierces](./integrations.md) et [Identifiants](./credentials.md) pour la configuration et les bonnes pratiques en matière d'identifiants.

#### [Slack](../nodes/slack-node.md)

Le nœud Slack envoie un message vers un canal Slack via un Incoming Webhook. Configurez un [identifiant](./credentials.md) Slack et une expression de message. Utilisez-le pour les notifications, les alertes et le reporting d'erreurs ; la sortie transmet l'entrée telle quelle.

S'utilise conjointement avec [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) et [Intégrations tierces](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Le nœud Discord envoie un message vers un canal Discord via un Incoming Webhook. Configurez un [identifiant](./credentials.md) Discord, composez le message sortant avec [Expression DSL](./expression-dsl.md) et définissez éventuellement des substitutions de nom d'utilisateur ou d'avatar pour le webhook.

S'utilise conjointement avec [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) et [Intégrations tierces](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Le nœud Send Email envoie des e-mails via SMTP. Configurez un [identifiant](./credentials.md) SMTP et des expressions [Expression DSL](./expression-dsl.md) pour le(s) destinataire(s), l'objet et le corps du message. Utilisez-le pour les notifications, les alertes et les e-mails transactionnels. La sortie inclut le status, le destinataire (to) et l'objet (subject).

L'[IMAP Trigger](../nodes/imap-trigger-node.md) complète Send Email en gérant le courrier entrant. Ensemble, ils permettent à un Workflow de lire les e-mails entrants d'une boîte partagée, de les résumer ou de les classer avec des nœuds IA, puis d'envoyer un message de suivi ou d'escalade. Le [Telegram Trigger](../nodes/telegram-trigger-node.md) et le [nœud Telegram](../nodes/telegram-node.md) offrent le même schéma entrant/sortant pour les Workflows de chat pilotés par bot.

Pour les flux de notification bidirectionnels, il s'associe également bien avec [LLM](../nodes/llm-node.md), le [Nœud Agent](../nodes/agent-node.md) et les [Intégrations tierces](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Le nœud Redis effectue des opérations Redis : set, get, hasKey et deleteKey. Utilisez-le pour la mise en cache, la limitation de débit et le stockage clé-valeur. Configurez un [identifiant](./credentials.md), le type d'opération, une expression de clé et, pour les opérations set, la valeur et un TTL facultatif. La sortie varie selon l'opération (value, success, exists, deleted).

S'utilise conjointement avec [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) et [Parallel Execution](./parallel-execution.md) pour la mise en cache, la régulation et la coordination.

#### [Grist](../nodes/grist-node.md)

Le nœud Grist lit, écrit et gère les données dans les feuilles de calcul Grist. Les opérations incluent getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables et listColumns. Indiquez l'ID du document, l'ID de la table et, pour les opérations create/update, les données de l'enregistrement à l'aide des ID de colonnes. Utilisez-le pour le CRUD, les mises à jour par lots et l'automatisation de feuilles de calcul.

Voir également [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) et [Intégrations tierces](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Le nœud Google Sheets lit, écrit et gère les données de feuilles de calcul via OAuth2. Utilisez-le pour lire des rapports, ajouter les résultats d'un Workflow, mettre à jour des trackers et effacer ou inspecter des onglets de feuille depuis un Workflow. Comme [BigQuery](../nodes/bigquery-node.md), il utilise un identifiant d'intégration reposant sur Google et s'intègre bien aux côtés de [Grist](../nodes/grist-node.md) lorsque les données de feuilles de calcul font partie du flux.

S'utilise conjointement avec [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) et [Intégrations tierces](./integrations.md).
#### [BigQuery](../nodes/bigquery-node.md)

Le nœud BigQuery exécute des requêtes SQL et insère des lignes dans les jeux de données Google BigQuery via OAuth2. Il est utile pour les Workflows d'analyse, les pipelines de reporting et l'écriture de données d'événements structurées issues des exécutions de Workflow. Il s'associe souvent au nœud [Set](../nodes/set-node.md) pour la mise en forme des lignes et à [Google Sheets](../nodes/google-sheets-node.md) pour un reporting plus léger orienté tableur.

S'associe avec [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) et [Third-Party Integrations](./integrations.md).

#### [Google Drive](../nodes/google-drive-node.md)

Le nœud Google Drive liste, télécharge, met à jour et supprime des fichiers et dossiers Drive via OAuth2, et peut copier un fichier Drive directement dans [Heym Drive](../nodes/drive-node.md) grâce à son opération `syncToHeymDrive`. Les Google Docs, Sheets et Slides ne disposent pas d'octets téléchargeables, le nœud les exporte donc automatiquement — Docs vers PDF, Sheets vers XLSX, Slides vers PPTX — avec une option de remplacement du format cible. Les suppressions déplacent les éléments vers la corbeille Drive, sauf si « Delete permanently » est activé, et le nœud refuse de supprimer un dossier via l'opération fichier ou inversement. Comme [Google Sheets](../nodes/google-sheets-node.md), il utilise un Identifiant OAuth2 fourni par Google ; notez que celui-ci demande un accès complet à Drive, il convient donc de consulter [Credential Sharing](./credentials-sharing.md) avant de le partager.

S'associe avec [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) et [Third-Party Integrations](./integrations.md).

#### [GitHub](../nodes/github-node.md)

Le nœud GitHub fournit 40 actions GitHub REST natives couvrant les dépôts, les organisations et utilisateurs, les issues, les pull requests, les revues, les releases, les Workflows Actions, les statistiques de trafic et les fichiers de dépôt. Utilisez-le pour le triage des issues, l'automatisation des revues, le dispatch de Workflow et l'attente de complétion, l'automatisation des releases et la mise à jour des fichiers de dépôt sans construire manuellement des requêtes HTTP. Il prend en charge GitHub.com et un `base_url` GitHub Enterprise facultatif au niveau de l'Identifiant.

S'associe avec [Agent Node](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) et [Third-Party Integrations](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Le nœud Jira connecte les Workflows aux API REST de Jira Cloud ou Jira Data Center / Server pour l'automatisation des projets, issues, commentaires, pièces jointes, utilisateurs, notifications et transitions. Il peut lister les projets, rechercher des issues avec JQL, créer ou mettre à jour des issues, inspecter les changelogs, notifier les parties prenantes, gérer les commentaires et pièces jointes, récupérer ou gérer les utilisateurs, lister les transitions disponibles et déplacer les issues via un ID de transition. Utilisez un Identifiant Jira avec l'e-mail Atlassian, le Token API, l'URL de base du site et le mode de déploiement.

S'associe avec [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) et [Third-Party Integrations](./integrations.md) pour la réception des demandes de support, le triage des bugs et les Workflows de release.

#### [Linear](../nodes/linear-node.md)

Le nœud Linear connecte les Workflows à l'API GraphQL de Linear pour l'automatisation des espaces de travail et des issues. Il peut lister les équipes, projets, issues, états de Workflow, membres d'équipe et commentaires ; créer, mettre à jour, supprimer et lier des issues ; et créer, mettre à jour, résoudre, annuler la résolution ou supprimer des commentaires. Utilisez une clé API personnelle Linear ou un Identifiant OAuth2, puis découvrez les UUID d'équipe, de projet, d'état et d'assigné à partir des opérations de liste avant de créer ou mettre à jour des issues.

S'associe avec [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) et [Third-Party Integrations](./integrations.md) pour la réception, le triage et les Workflows de backlog d'ingénierie.

#### [Supabase](../nodes/supabase-node.md)

Le nœud Supabase lit et modifie les tables exposées via Supabase PostgREST. Il convient parfaitement aux backends produit, aux données utilisateur/profil, à l'état de Workflow et aux automatisations de type CRUD qui souhaitent un accès à la base de données sans câblage personnalisé de requêtes HTTP.

S'associe avec [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) et [Third-Party Integrations](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

Le nœud ClickHouse exécute des opérations CRUD, de comptage et de SQL brut sur une base de données ClickHouse externe via son interface HTTP. Il convient aux pipelines d'analyse, à la journalisation d'événements et aux Workflows de reporting : insérez les événements au fur et à mesure, puis agrégez-les ou comptez-les avec `query`/`count`. Il reprend l'ensemble des opérations de [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) ainsi qu'une échappatoire SQL brut, avec `update`/`remove` exécutés comme des mutations ClickHouse.

S'associe avec [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) pour les rapports planifiés et [Third-Party Integrations](./integrations.md).
#### [Notion](../nodes/notion-node.md)

Le nœud Notion gère les bases de données, sources de données, pages et blocs Notion via l'API Notion actuelle (`2026-03-11`). Il prend en charge la recherche, le CRUD des pages, les opérations sur les bases de données et les sources de données, les blocs enfants, l'ajout/la mise à jour/la suppression de blocs, ainsi que la mise en corbeille/restauration. Utilisez un token d'intégration interne ou un identifiant OAuth d'intégration publique Notion. L'éditeur peut rechercher et paginer par curseur les sources de données et pages parentes accessibles. Les identifiants partagés fonctionnent de la même manière que les identifiants possédés pour l'exécution des Workflows.

Pour les appels REST personnalisés, `$credentials.YourNotionCredential` se résout vers le même bearer token. S'utilise avec [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) et [Third-Party Integrations](./integrations.md).

#### [Sentry](../nodes/sentry-node.md)

Le nœud Sentry automatise les organisations, projets, équipes, tickets, événements et versions Sentry via l'API REST Sentry. Utilisez-le pour le tri des alertes, la mise à jour du statut des tickets, l'automatisation des versions, la recherche d'événements et la configuration ou le nettoyage de projets/équipes. Il prend en charge Sentry SaaS et Sentry auto-hébergé via une URL de base d'identifiant facultative.

S'utilise avec [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) et [Third-Party Integrations](./integrations.md) pour les Workflows d'incidents et de versions.

#### [DataTable](../nodes/datatable-node.md)

Le nœud DataTable lit, écrit et gère les données dans les Tables de données Heym (stockage structuré first-party). Les opérations incluent find, getAll, getById, insert, update, remove et upsert. Aucun identifiant externe requis. Les tables sont gérées depuis l'onglet du tableau de bord [DataTable](../tabs/datatable-tab.md) et accessibles directement par le propriétaire du Workflow.

S'utilise avec [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) et l'[onglet DataTable](../tabs/datatable-tab.md) pour le stockage structuré first-party.

#### [Drive](../nodes/drive-node.md)

Le nœud Drive gère les fichiers générés par les skills directement depuis un Workflow. Les opérations incluent delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams et unshareWithMyTeams pour la gestion de l'accès en lecture seule aux équipes ; la conversion de format se trouve dans le nœud [Converter](../nodes/converter-node.md). Référencez le fichier avec `$agentLabel._generated_files[0].id` ; les sorties incluent status, file_id, updated download_url pour les contraintes de lien, et shared_team_count pour le partage d'équipe. Cela est particulièrement utile avec les Workflows [Agent Node](../nodes/agent-node.md) qui utilisent [File Generation](./file-generation.md) et le modèle de référence [Drive](./drive.md).

Les compagnons courants sont [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) et [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Le nœud Amazon S3 exécute des opérations de stockage d'objets sur Amazon S3 à l'aide d'un identifiant `s3` (clé d'accès, clé secrète, région, token de session facultatif). Les opérations incluent putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder et listBuckets. Le téléversement de texte et le téléchargement de texte ou en base64 sont pris en charge, les champs bucket et key acceptant [Expression DSL](./expression-dsl.md). Utilisez-le pour stocker les sorties de Workflow, archiver des fichiers et relire des objets dans un flux.

S'utilise avec [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) et [Third-Party Integrations](./integrations.md).

### Automatisation

#### [Crawler](../nodes/crawler-node.md)

Le nœud Crawler scrape les pages web à l'aide de FlareSolverr avec extraction HTML facultative via des sélecteurs CSS. Configurez un [identifiant](./credentials.md) FlareSolverr, une expression d'URL, un temps d'attente et des sélecteurs facultatifs pour l'extraction. La sortie est le HTML brut ou le contenu extrait. Utilisez-le pour le scraping web et l'extraction de contenu.

S'utilise avec [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) et [LLM](../nodes/llm-node.md) pour les flux de scraping et d'analyse.

#### [Playwright](../nodes/playwright-node.md)

Le nœud Playwright automatise les interactions avec le navigateur via des étapes configurables (navigate, refresh, click, type, screenshot, extract, aiStep) ou le mode **Run Code** pour du Playwright Python personnalisé (sandboxé ; désactivé par défaut via `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Il prend en charge le mode headless, un paramètre facultatif qui réduit les signaux d'automatisation Playwright courants, les timeouts, la capture réseau facultative (responses, cookies, localStorage, sessionStorage), l'amorçage d'authentification par cookie/storageState à partir d'expressions de [Global Variables](./global-variables.md) telles que `$global.authState`, des étapes de connexion de secours lorsque la restauration d'authentification échoue, et une étape IA avec Auto Heal lorsque les sélecteurs échouent. Utilisez-le pour le scraping web, le remplissage de formulaires et les Workflows basés sur le navigateur.

Voir également [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) et [Execution History](./execution-history.md) pour l'automatisation du navigateur et le débogage.

### Utilitaires
#### [Output](../nodes/output-node.md)

Le nœud Output est l'endpoint du Workflow qui renvoie la réponse à l'appelant. Définissez l'expression du message en référençant le nœud précédent par son label (n'utilisez jamais `$input` du nœud [Input](../nodes/input-node.md) ici). L'option async downstream permet aux nœuds situés après l'output de s'exécuter en arrière-plan une fois la réponse envoyée.

Les sources amont courantes sont [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) et [Execute](../nodes/execute-node.md) ; la mise en forme de la réponse est plus facile à déboguer dans la [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

Le nœud JSON output mapper construit un objet JSON brut à partir de mappings clé-valeur de type [Set](../nodes/set-node.md) et le renvoie à la racine de la réponse du Workflow. Utilisez-le lorsqu'un appelant API doit recevoir un corps JSON brut plutôt que le wrapper standard du nœud [Output](../nodes/output-node.md).

#### [HTML output mapper](../nodes/html-output-mapper-node.md)

Le nœud HTML output mapper rend un unique template HTML, en interpolant les expressions `$nodeLabel.field` dans la page. Lorsqu'il est le seul nœud terminal du Workflow, le Webhook d'exécution répond avec `text/html` et le code de statut configuré sur le nœud au lieu d'un corps JSON, ce qui permet à un Workflow de servir directement une page à un navigateur. Envoyez `X-Simple-Response: false` pour récupérer l'enveloppe JSON habituelle à des fins de débogage.

S'utilise avec [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) et [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Le nœud Chart Output est le nœud terminal du Workflow d'un widget de [Dashboard](../tabs/dashboard-tab.md). Il transforme les lignes produites par les nœuds en amont en un payload de graphique standardisé que le dashboard affiche. Choisissez un `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, Gantt, entity relationships, text ou HITL), mappez `labelField`/`valueField` (ou `series` pour du multi-séries, ou `text` pour un message markdown), et placez-le en dernier ; il ne possède aucune arête de sortie. Gantt lit les lignes de tâches avec dates de début/fin ISO, progression et identifiants de dépendance. Entity relationships lit un objet graphe avec entités, champs, clés PK/FK et relations. Les deux s'affichent également sur les pages de Heym Work et dans ses aperçus de propositions de widgets. HITL ignore les lignes en amont et liste vos revues humaines en attente. et une autre sous forme de boutons de lien qui ouvrent une URL dans un nouvel onglet (`linkColumn`, avec `linkLabel` pour le texte du bouton)

Voir également [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) et [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Le nœud Wait suspend l'exécution du Workflow pendant une durée spécifiée en millisecondes, jusqu'à 15 minutes. Utilisez-le pour la limitation de débit, les actions différées ou les intervalles de polling. Il transmet l'entrée sans modification.

S'utilise avec [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) et [Parallel Execution](./parallel-execution.md) pour le rythme et le polling.

#### [Sticky Note](../nodes/sticky-note-node.md)

Le nœud Sticky Note ajoute des notes markdown sur le canvas. Il n'est pas exécuté. Utilisez-le pour la documentation, les instructions ou les notes de Workflow aux côtés des autres [Canvas Features](./canvas-features.md). Double-cliquez sur le canvas pour modifier le contenu de la note.

Voir également [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) et [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Le nœud Console Log journalise une valeur dans la console du backend (serveur). Utilisez-le pour le débogage et l'inspection pendant le développement. Le message de log prend en charge les expressions [Expression DSL](./expression-dsl.md) ; la sortie transmet l'entrée sans modification.

S'utilise avec [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) et [Expression Evaluation Dialog](./expression-evaluation-dialog.md) pour le débogage.

#### [Disable Node](../nodes/disable-node.md)

Le nœud Disable Node désactive définitivement un autre nœud du Workflow en positionnant son flag `active` sur false. Spécifiez le nœud cible par son label. Utilisez-le pour des opérations ponctuelles telles que l'arrêt d'un Trigger [Cron](../nodes/cron-node.md) une fois une condition remplie.

Voir également [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) et [Cron](../nodes/cron-node.md) pour les patterns de contrôle de Workflow.

#### [Enable Node](../nodes/enable-node.md)

Le nœud Enable Node réactive un autre nœud en positionnant son flag `active` sur true et en enregistrant la modification. Spécifiez le nœud cible par son label. Utilisez-le pour réarmer un Trigger [Cron](../nodes/cron-node.md) désactivé depuis un autre point d'entrée, ou pour activer un nœud une fois une condition remplie. Une cible située en aval du Enable Node et qui n'a pas encore été exécutée s'exécute également dans l'exécution en cours.

Voir également [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) et [Cron](../nodes/cron-node.md) pour les patterns de contrôle de Workflow.
#### [Throw Error](../nodes/throw-error-node.md)

Le nœud Throw Error interrompt immédiatement l'exécution du workflow et renvoie une réponse d'erreur accompagnée d'un code de statut HTTP personnalisé. Définissez l'expression du message d'erreur ainsi que le code de statut (par exemple 400, 401, 403, 404, 429, 500). Utilisez-le pour les échecs de validation, les accès non autorisés ou d'autres conditions d'erreur, en particulier lorsqu'il est associé aux nœuds [Condition](../nodes/condition-node.md) et [Error Handler](../nodes/error-handler-node.md).

S'associe aux nœuds [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) et à la page [Security](./security.md) pour définir des chemins d'échec explicites.

---

## Référence

### [Types de nœuds](./node-types.md)

Heym propose une variété de types de nœuds : des triggers tels que [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) et [Error Handler](../nodes/error-handler-node.md) ; des nœuds IA tels que [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) et [MCP Call](../nodes/mcp-call-node.md) ; des nœuds logiques comme [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) et [Loop](../nodes/loop-node.md) ; des nœuds de données comme [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) et [Heym](../nodes/heym-node.md) ; des intégrations telles que [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) et [Drive](../nodes/drive-node.md) ; des nœuds d'automatisation comme [Crawler](../nodes/crawler-node.md) et [Playwright](../nodes/playwright-node.md) ; ainsi que des utilitaires tels que [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) et [Sticky Note](../nodes/sticky-note-node.md). Utilisez des expressions telles que `$input.text` et `$nodeLabel.field` dans la configuration des nœuds.

Voir également [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) et [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym utilise un langage d'expressions simple pour référencer les données des nœuds en amont. Utilisez `$input` pour le nœud [Input](../nodes/input-node.md), `$nodeLabel.field` pour tout nœud en amont, `$credentials.CredentialName` pour les [identifiants](./credentials.md) et `$global.variableName` pour les [variables globales](./global-variables.md). Les variables spéciales intégrées incluent `$now`, `$UUID` ainsi que les métadonnées du workflow : `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` et `$executionId` (l'id de l'[Historique d'exécution](./execution-history.md) de l'exécution — `/workflows/{id}/{executionId}` ouvre cette exécution sur le canvas ; disponible uniquement à l'exécution, vide dans la boîte de dialogue d'aperçu des expressions). La prise en charge inclut les littéraux, l'arithmétique, les comparaisons, le contexte [Loop](../nodes/loop-node.md), les champs imbriqués et les helpers de chaînes/tableaux (notamment `$text.toJson()` pour analyser une chaîne JSON). Lorsque la valeur complète correspond à une seule `$expr`, le backend préserve les tableaux, objets, booléens et nombres en tant que types natifs.

Voir également [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) et [Workflow Structure](./workflow-structure.md).
### [Variables globales](./global-variables.md)

Le magasin de variables globales conserve des données clé-valeur persistantes, propres à l'utilisateur, qui survivent entre les exécutions de workflow. Créez des variables depuis l'onglet [Variables](../tabs/global-variables-tab.md) ou depuis un [nœud Variable](../nodes/variable-node.md) avec l'option « Store in Global Variable Store » activée. Accédez-y avec `$global.variableName` dans les expressions ; elles peuvent être partagées avec d'autres utilisateurs ou [équipes](./teams.md).

Fonctionne conjointement avec [Variable](../nodes/variable-node.md), [Équipes](./teams.md) et [Partage d'identifiants](./credentials-sharing.md) pour l'état partagé des workflows.

### [Boîte de dialogue d'évaluation d'expression](./expression-evaluation-dialog.md)

La boîte de dialogue d'évaluation d'expression est un éditeur extensible qui apparaît lorsque vous cliquez sur le bouton d'expansion à côté des champs d'expression. Elle s'ouvre sous forme de grande fenêtre modale centrée, maintient l'autocomplétion active et actualise automatiquement l'aperçu de sortie du backend après une pause dans votre saisie. Les résultats de type objet et tableau peuvent être parcourus à l'aide du sélecteur de chemin de sortie. La boîte de dialogue accepte un chemin pointé nu sur toute la ligne (par exemple `myNode.output.field`) comme s'il s'agissait de `$myNode.output.field` ; consultez les règles de placement du [DSL d'expression](./expression-dsl.md).

Le bouton **Build with AI** de la barre d'outils vous permet de décrire l'expression souhaitée en texte brut. Sélectionnez un [identifiant](./credentials.md) LLM et un modèle, saisissez une description telle que *« Get the customer name from the API response »*, puis cliquez sur Generate. Le backend envoie le contexte du [DSL d'expression](./expression-dsl.md) et les sorties des derniers nœuds exécutés au modèle, et renvoie une chaîne d'expression unique. Le résultat est évalué immédiatement afin que vous puissiez le vérifier avant de cliquer sur Apply.

Fonctionne naturellement avec le [DSL d'expression](./expression-dsl.md), le [nœud Output](../nodes/output-node.md) et le [mappeur de sortie JSON](../nodes/json-output-mapper-node.md).

### [Structure de workflow](./workflow-structure.md)

Les workflows sont stockés au format JSON avec des nœuds et des arêtes. L'objet workflow comprend id, name, description, nodes, edges et les paramètres d'authentification. Chaque nœud possède un id, un type, une position et des data (label et configuration propre au type). Les arêtes relient les IDs des nœuds source et cible avec des handle IDs facultatifs. La syntaxe d'expression dans les champs data suit le [DSL d'expression](./expression-dsl.md), et cette même structure est utilisée par [Téléchargement et import](./download-import.md).

Voir également [Types de nœuds](./node-types.md), [DSL d'expression](./expression-dsl.md) et [Téléchargement et import](./download-import.md).

### [Fonctionnalités du Canvas](./canvas-features.md)

Survolez n'importe quel nœud non-sticky du canvas et cliquez sur **Run** pour exécuter jusqu'à ce nœud. Les entrées requises s'ouvrent dans le panneau Run avec le premier champ sélectionné ; les chemins sans entrées démarrent immédiatement. Consultez [Run to Node](./canvas-features.md#run-to-node).

L'éditeur de workflow propose le Data Pin (épingler la dernière sortie d'un nœud pour tester en aval sans réexécuter), les Execution Logs (résultats des nœuds en temps réel et progression des agents, en complément de l'[Historique d'exécution](./execution-history.md)), Enable/Disable (ignorer des nœuds pendant l'exécution) et Extract to Sub-Workflow (déplacer une sélection vers un nouveau workflow et la remplacer par un [nœud Execute](../nodes/execute-node.md)). Une exécution de production en cours peut être ouverte depuis l'Historique ou une carte du Board ; l'éditeur restaure son snapshot actuel, se connecte au SSE et maintient l'animation du canvas ainsi que les logs Debug en direct. Les [Raccourcis clavier](./keyboard-shortcuts.md) prennent en charge le copier, coller, exécuter et la recherche de nœud en ligne.

Voir également [Raccourcis clavier](./keyboard-shortcuts.md), [Historique des modifications](./edit-history.md) et [Historique d'exécution](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Regarder la démo de l'éditeur</a></p>

### [Raccourcis clavier](./keyboard-shortcuts.md)

Heym fournit des raccourcis dans tout l'éditeur : Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo et Escape pour fermer. Sur le canvas : tout sélectionner, sélection multiple, copier/couper/coller, supprimer, activer/désactiver un nœud (D), basculer les données épinglées (P) et recherche de nœud en ligne par saisie. Les raccourcis sont documentés dans la référence intégrée à l'application et fonctionnent en étroite collaboration avec les [Fonctionnalités du Canvas](./canvas-features.md) telles que le Data Pin et l'activation/désactivation des nœuds.

Voir également [Fonctionnalités du Canvas](./canvas-features.md), [Quick Drawer](./quick-drawer.md) et [Contextual Showcase](./contextual-showcase.md).
### [Assistant IA](./ai-assistant.md)

L'Assistant IA est un panneau de chat ouvert depuis le panneau Debug qui vous permet de créer ou de modifier des workflows en langage naturel. Sélectionnez un [identifiant](./credentials.md) et un modèle, puis décrivez ce que vous souhaitez ; l'IA diffuse une réponse en streaming et tout [workflow JSON](./workflow-structure.md) valide présent dans un bloc de code est automatiquement analysé et appliqué au canvas. La saisie vocale est prise en charge sur les navigateurs compatibles.

Activez le **mode YOLO** (mode Agent, désactivé par défaut) et l'assistant teste ce qu'il construit. Après chaque modification, il exécute le workflow sur le canvas, lit le résultat et corrige le workflow jusqu'à ce qu'il fasse ce que vous avez demandé, pendant un maximum de 5 exécutions par message. Il demande les entrées de test avant la première exécution, peut exécuter vos autres workflows lorsqu'il a besoin de leur résultat, et affiche chaque étape au fur et à mesure. Voir [Assistant IA › Mode YOLO](./ai-assistant.md#yolo-mode).

Cliquez sur **AI** au-dessus de n'importe quel nœud sur le canevas pour modifier ou corriger uniquement ce nœud. Le panneau affiche le nœud qu'il modifie (avec son dernier résultat une fois exécuté) et propose **Change this node as ...**, **Fix error in this node ...** et **Other**. Seul ce nœud est mis à jour ; le reste du workflow et la disposition restent inchangés. Voir [Assistant IA › Modifier un seul nœud](./ai-assistant.md#changing-one-node).

Lorsqu'un workflow stocke des enregistrements, l'assistant demande quelle [table de données](../tabs/datatable-tab.md) utiliser, ou en crée une avec les colonnes dont le workflow a besoin. Voir [Assistant IA › Tables de données](./Le Chat et l'outil MCP `heym_chat` peuvent également modifier directement les colonnes et les lignes avec un accès propriétaire ou en écriture, avec confirmation avant la suppression de colonnes ou l'effacement de toutes les lignes. Le Chat et l'outil MCP `heym_chat` peuvent également modifier directement les colonnes et les lignes avec un accès propriétaire ou en écriture, avec confirmation avant la suppression de colonnes ou l'effacement de toutes les lignes. ai-assistant.md#data-tables).

Lorsque le workflow actuel contient des compétences de [Nœud Agent](../nodes/agent-node.md), l'assistant envoie uniquement le `SKILL.md` de chaque compétence dans le contexte du workflow. Les fichiers `.py` joints et les ressources binaires des compétences sont exclus avant la requête afin que les bundles de compétences volumineux ne fassent pas déborder la fenêtre de contexte du modèle.

S'associe parfaitement avec [Chat avec Heym](./chat-with-heym.md), [Architecture d'Agent](./agent-architecture.md) et [Expression DSL](./expression-dsl.md).

### [Chat avec Heym](./chat-with-heym.md)

Chat avec Heym est un assistant d'en-tête de documentation pour les questions produit. Il s'ouvre dans une boîte de dialogue centrée, conserve la sélection d'identifiant et de modèle visible en haut, injecte le chemin de la page de documentation active comme contexte et efface l'historique des messages à la fermeture de la boîte de dialogue. Il complète l'[Assistant IA](./ai-assistant.md) plus large et la [Vitrine contextuelle](./contextual-showcase.md) plus légère.

Voir également [Assistant IA](./ai-assistant.md), [Vitrine contextuelle](./contextual-showcase.md) et [Types de nœuds](./node-types.md).

### [Organisation des workflows](./workflow-organization.md)

Les administrateurs d'instance (`HEYM_ADMIN_EMAILS`) peuvent accéder à tous les workflows et les modifier, rechercher les workflows d'un propriétaire par email, inspecter les planifications et l'historique d'exécution, mettre en pause et reprendre les triggers automatiques, et supprimer des workflows une fois les exécutions stabilisées. Voir [Administration d'instance](../tabs/workflows-tab.md#instance-administration) pour le flux de désinscription et la distinction entre la mise en pause des triggers automatiques et le blocage de tous les appels.

Les workflows peuvent être organisés en dossiers et sous-dossiers dans une structure arborescente. Les dossiers ont des noms et un parent facultatif ; les workflows sont affectés à des dossiers. Les workflows peuvent être planifiés pour suppression (déplacés vers une zone de corbeille avant suppression définitive). L'API prend en charge la création, la mise à jour, la suppression et le déplacement des workflows entre dossiers, et le même modèle d'organisation apparaît dans l'onglet [Workflows](../tabs/workflows-tab.md).

Voir également [Tiroir rapide](./quick-drawer.md), [Téléchargement et import](./download-import.md) et [Historique des modifications](./edit-history.md).

### [Tiroir rapide](./quick-drawer.md)

Le Tiroir rapide est un panneau d'exécution rapide fixé à droite pour les pages internes hors canvas. Il vous permet de rechercher des [workflows](../tabs/workflows-tab.md), d'épingler des favoris, de sélectionner des entrées, d'exécuter immédiatement et d'inspecter la progression ou les résultats sans ouvrir l'éditeur. Un workflow doté d'un [File Upload Trigger](../nodes/file-upload-trigger-node.md) accepte un fichier déposé ou sélectionné. L'ordre des épingles et le dernier workflow sélectionné sont stockés dans le navigateur.

Voir également [Organisation des workflows](./workflow-organization.md), [Raccourcis clavier](./keyboard-shortcuts.md) et [Historique d'exécution](./execution-history.md).

### [Vitrine contextuelle](./contextual-showcase.md)

La Vitrine contextuelle est un rail de guide compact intégré à l'application pour les surfaces principales authentifiées telles que les onglets du tableau de bord, les [Évaluations](../tabs/evals-tab.md), la documentation et l'éditeur de workflow. Elle reste fermée par défaut, donne d'abord un court résumé de la page, offre un peu plus de détails à la demande et renvoie vers l'article complet de la documentation lorsque vous souhaitez des conseils plus approfondis.

S'associe avec [Chat avec Heym](./chat-with-heym.md), [Tiroir rapide](./quick-drawer.md) et [Assistant IA](./ai-assistant.md) pour les flux de guidage intégrés à l'application.

### [Identifiants](./credentials.md)

Les identifiants stockent les clés API et les secrets utilisés par les nœuds de workflow. Ajoutez-les dans l'onglet [Identifiants](../tabs/credentials-tab.md) et référencez-les par nom ou par ID dans des nœuds tels que [LLM](../nodes/llm-node.md), [Nœud Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Envoi d'email](../nodes/send-email-node.md) et [Redis](../nodes/redis-node.md). Ils sont chiffrés au repos, peuvent être partagés avec des utilisateurs ou des [équipes](./teams.md), et peuvent également être référencés dans l'[Expression DSL](./expression-dsl.md) via `$credentials.Name`.

Voir également [Identifiants](../tabs/credentials-tab.md), [Partage d'identifiants](./credentials-sharing.md) et [Intégrations tierces](./integrations.md).
### [Partage des identifiants](./credentials-sharing.md)

Les identifiants peuvent être partagés avec d'autres utilisateurs par email ou avec des équipes ; tous les membres de l'équipe obtiennent l'accès lorsqu'un identifiant est partagé avec une équipe. Les identifiants partagés apparaissent avec un indicateur dans l'onglet [Identifiants](../tabs/credentials-tab.md). À l'exécution, le contexte du propriétaire du workflow fusionne les identifiants possédés, partagés par l'utilisateur et partagés par l'équipe. Utilisez `$credentials.CredentialName` dans les expressions ou définissez credentialId dans les données du nœud.

Voir également [Identifiants](./credentials.md), [Équipes](./teams.md) et [Intégrations tierces](./integrations.md).

### [Équipes](./teams.md)

Les équipes vous permettent de partager des workflows, des identifiants, des variables globales, des bases vectorielles et des fichiers Drive avec un groupe d'utilisateurs en une seule fois. Créez des équipes depuis l'onglet [Équipes](../tabs/teams-tab.md) et ajoutez des membres par email. Partagez des ressources avec une équipe depuis les boîtes de dialogue de partage correspondantes ; tous les membres y ont alors accès. Le créateur peut modifier et supprimer l'équipe ; la suppression d'une équipe supprime tous les partages d'équipe.

À combiner avec [Partage des identifiants](./credentials-sharing.md), [Variables globales](./global-variables.md) et [Enterprise](./enterprise.md).

### [Exécution parallèle](./parallel-execution.md)

Heym exécute les nœuds en parallèle lorsqu'ils n'ont aucune dépendance les uns envers les autres. L'exécuteur construit un DAG et exécute les nœuds d'un même niveau simultanément via un pool de threads ; dès qu'un nœud se termine, ses nœuds en aval sont planifiés. Utilisez le nœud [Merge](../nodes/merge-node.md) pour combiner les branches parallèles lorsque cela est nécessaire. Plusieurs exécutions de workflow s'exécutent simultanément ; chaque exécution est isolée. Le mode [SSE Streaming](./sse-streaming.md) émet des événements à mesure que les nœuds se terminent.

Voir également [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) et [Historique d'exécution](./execution-history.md).

### [Architecture des agents](./agent-architecture.md)

Le [Nœud Agent](../nodes/agent-node.md) prend en charge les sous-agents (l'orchestrateur appelle d'autres nœuds Agent via call_sub_agent), les sous-workflows (l'agent appelle d'autres workflows via call_sub_workflow), les skills (contenu d'instructions et outils Python à partir de fichiers .zip ou .md) et les connexions client [MCP](../tabs/mcp-tab.md). L'exécuteur d'outils de l'orchestrateur route les appels de sous-agents et de sous-workflows ; les autres outils sont dirigés vers les exécuteurs Python, MCP ou skill. La profondeur d'imbrication maximale pour les sous-agents et les sous-workflows est de 5. La boucle d'appel d'outils inclut une compression automatique du contexte : avant chaque itération, l'utilisation des tokens est estimée et, si elle dépasse 80 % de la fenêtre de contexte du modèle, les messages intermédiaires sont résumés à l'aide du même modèle, en conservant intacts le prompt système, le premier message utilisateur et le dernier message utilisateur.

Voir également [Nœud Agent](../nodes/agent-node.md), [Mémoire persistante de l'agent](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) et [MCP](../tabs/mcp-tab.md).

### [Mémoire persistante de l'agent](./agent-persistent-memory.md)

Graphe de connaissances optionnel par [Nœud Agent](../nodes/agent-node.md), stocké dans Postgres : entités, types, propriétés et relations dirigées. Lorsque `persistentMemoryEnabled` est défini sur true, le graphe est résumé dans le prompt système à chaque exécution ; après les exécutions réussies, un [LLM](../nodes/llm-node.md) extrait en arrière-plan des mises à jour structurées. Le CRUD REST est disponible sous `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. L'éditeur s'ouvre depuis le contrôle en forme de cerveau rose sur le nœud.

Voir également [Nœud Agent](../nodes/agent-node.md), [Architecture des agents](./agent-architecture.md) et [Traces](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Le Human-in-the-Loop permet à un [Nœud Agent](../nodes/agent-node.md) de demander une approbation à des points de contrôle spécifiques, de créer une page publique `/review/{token}` et d'attendre qu'un relecteur non connecté accepte, modifie ou refuse le texte de revue Markdown. Les agents compatibles HITL exposent également une sortie `review` afin que vous puissiez notifier [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) ou d'autres canaux pendant que l'exécution est en attente. Le texte HITL au niveau du nœud sert de lignes directrices d'approbation, tandis que le résumé de la page publique est généré à partir de la demande de revue elle-même. Les exécutions en attente apparaissent immédiatement dans l'[Historique d'exécution](./execution-history.md), peuvent survenir plusieurs fois au cours d'une même exécution et reprennent à partir du snapshot de workflow exactement stocké une fois chaque décision soumise.

Voir également [Nœud Agent](../nodes/agent-node.md), [Portal](./portal.md), [Historique d'exécution](./execution-history.md) et [Send Email](../nodes/send-email-node.md).
### [Webhooks](./webhooks.md)

Les Workflows peuvent être déclenchés via [HTTP](../nodes/http-node.md) sur `POST /api/workflows/{workflow_id}/execute`, ou diffusés de manière incrémentielle depuis `POST /api/workflows/{workflow_id}/execute/stream`. Le corps de la requête est transmis en tant que body aux nœuds [Input](../nodes/input-node.md) ; les headers et les query params sont disponibles dans les expressions [Expression DSL](./expression-dsl.md). Configurez l'authentification par Workflow : anonyme, JWT ou header personnalisé. La mise en cache optionnelle des réponses, la limitation de débit et la boîte de dialogue **Run with cURL** de l'éditeur résident toutes sur le Workflow et s'appliquent aux deux modes. Avec une [limite de simultanéité](./webhooks.md#concurrency-limit-and-queued-runs), un appel devant attendre reçoit à la place `202 Accepted` avec un identifiant d'exécution et une URL de statut.

Voir aussi [Input](../nodes/input-node.md), [Execution Tokens](./execution-tokens.md), [SSE Streaming](./sse-streaming.md), [HTTP](../nodes/http-node.md) et [Workflow Structure](./workflow-structure.md).

### [Execution Tokens](./execution-tokens.md)

Les Execution Tokens sont des JWT à portée limitée qui accordent l'accès aux endpoints execute et stream d'un seul Workflow. Lorsqu'un Workflow utilise l'authentification JWT, les Tokens permettent à des scripts externes, des pipelines CI et des intégrations d'appeler le Workflow sans partager une session utilisateur. Chaque Token porte une revendication `wid` qui l'ancre à un seul Workflow, un `jti` utilisé pour une révocation instantanée, et un TTL configurable (de 60 secondes à 10 ans). Créez, sélectionnez et révoquez des Tokens directement depuis la boîte de dialogue **Run with cURL** — le Token sélectionné est automatiquement intégré à la commande générée.

Voir aussi [Webhooks](./webhooks.md), [Security](./security.md) et [SSE Streaming](./sse-streaming.md).

### [SSE Streaming](./sse-streaming.md)

La boîte de dialogue cURL peut basculer l'exécution d'un [webhook](./webhooks.md) en mode Server-Sent Events. Cela produit en temps réel les événements `execution_started`, `node_start`, `node_complete` et `execution_complete`, ajoute `--no-buffer` à la commande cURL générée, et permet de configurer des messages de démarrage par nœud tels que `[START] LLM` ou un texte personnalisé pour des consommateurs de terminal externes.

Voir aussi [Webhooks](./webhooks.md), [Execution History](./execution-history.md) et [LLM](../nodes/llm-node.md).

### [Triggers](./triggers.md)

Les Workflows sont démarrés par des nœuds Trigger ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), réception [RabbitMQ](../nodes/rabbitmq-node.md)) ou par des points d'entrée : [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), planificateur Cron, webhook Telegram, webhook d'interaction Discord, gestionnaire de Trigger IMAP, consommateur RabbitMQ ou exécution depuis l'éditeur. Chaque Trigger dispose de son propre endpoint ou processus en arrière-plan ; [Cron](../nodes/cron-node.md) s'exécute toutes les 60 secondes, les nœuds [Telegram Trigger](../nodes/telegram-trigger-node.md) reçoivent les webhooks du bot, les nœuds [Discord Trigger](../nodes/discord-trigger-node.md) reçoivent les webhooks d'interaction signés, et les nœuds [IMAP Trigger](../nodes/imap-trigger-node.md) s'exécutent selon leur intervalle de polling configuré. Les nœuds [Input](../nodes/input-node.md) reçoivent le body, les headers et les query params des requêtes webhook.

Voir aussi [Node Types](./node-types.md), [Webhooks](./webhooks.md) et [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

L'historique d'exécution enregistre les exécutions de Workflow : entrées, sorties, résultats des nœuds, statut et source du Trigger. Accédez-y depuis la barre d'outils de l'éditeur, la vue Docs, l'en-tête du Dashboard ou la vue [Evals](../tabs/evals-tab.md). L'historique par Workflow affiche les exécutions du Workflow ouvert ; la vue de l'historique complet affiche les exécutions de tous les Workflows et du Chat. Les exécutions en cours apparaissent en haut des deux boîtes de dialogue avec les actions **Open live** et **Cancel**. Open live rattache l'éditeur à l'exécution existante via [SSE](./sse-streaming.md), restaure les nœuds terminés, fait pulser les nœuds en cours et en attente, et ajoute les logs Debug sans démarrer une nouvelle exécution. Bring to Canvas charge les entrées et les sorties de nœuds d'une exécution terminée pour la relancer ou la déboguer ; le lien profond `/workflows/{workflowId}/{executionId}` prend en charge les exécutions en cours et terminées. Les exécutions mises en pause par [Human-in-the-Loop](./human-in-the-loop.md) sont stockées immédiatement avec le statut `pending`, y compris l'URL de revue publique et les éventuels nœuds de notification exécutés depuis la branche `review` de l'agent. Si le serveur redémarre en cours d'exécution, les exécutions interrompues sont récupérées automatiquement : elles sont relancées depuis le début avec les mêmes entrées et affichées comme terminées (marquées **Recovered**), sous le contrôle d'un basculement **Auto-recover runs** par Workflow qui peut au contraire les enregistrer comme `skipped`.

Voir aussi [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) et [Traces](../tabs/traces-tab.md).
### Execution Highlights

Après une exécution en direct — ou après **Bring to Canvas** — une popup **Execution Highlights** dismissible apparaît en haut à droite du Canvas, listant ce que chaque nœud a produit dans l'ordre d'exécution. C'est un moyen rapide d'inspecter la sortie de chaque nœud sans ouvrir chacun d'eux ; fermez-la avec le **✕**, et elle se réouvre à l'exécution suivante. Les Highlights sont également affichés sur les exécutions du dashboard. Voir [Execution History](./execution-history.md) pour plus de détails.

### [Edit History](./edit-history.md)

Edit History suit les versions sauvegardées d'un workflow (chaque Save crée une version). Consultez la liste, ouvrez une version pour voir un diff par rapport au workflow actuel ([nœuds](./workflow-structure.md), edges, config), et Revert pour restaurer une version passée. Contrairement à [Execution History](./execution-history.md), Edit History suit les changements de structure, pas les exécutions.

Voir aussi [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md), et [Canvas Features](./canvas-features.md).

### Error Workflow

Un workflow peut désigner un autre workflow à exécuter en cas d'échec. Configurez-le dans le panneau **Properties** au niveau du workflow (affiché lorsqu'aucun nœud n'est sélectionné) sous **On error, run workflow**. Seul le propriétaire du workflow peut le définir, le modifier ou le supprimer ; voir [Owner-only settings](./workflow-organization.md#owner-only-settings). Lorsqu'une exécution de niveau supérieur se termine par un échec non géré, le workflow d'erreur sélectionné s'exécute et reçoit le contexte de l'échec (id et nom du workflow en échec, id d'exécution, message d'erreur, label et type du nœud en échec, et un timestamp). Si le canvas contient déjà un nœud [Error Handler](../nodes/error-handler-node.md), le handler local prend le pas et le workflow d'erreur n'est **pas** appelé. Le workflow d'erreur s'exécute lui-même directement, il ne déclenche donc jamais son propre workflow d'erreur.

Il couvre chaque exécution de niveau supérieur non-test : les deux endpoints d'exécution, le [Portal](./portal.md), et chaque trigger, y compris [cron](../nodes/cron-node.md), les triggers de plateforme de chat, email, queues, [MCP](../tabs/mcp-tab.md), et les widgets du dashboard. Avec [Load Distribution](./cluster.md) activé, cela reste inchangé, y compris pour les exécutions effectuées par un worker : le nœud en échec revient avec le résultat, et le workflow d'erreur est ensuite distribué comme toute autre exécution, de sorte qu'un nœud en son sein qui doit s'exécuter sur l'instance principale le fait toujours. Deux cas sont délibérément exclus, car l'issue du workflow lui-même n'est pas encore connue : une exécution qu'aucune instance n'a jamais exécutée, et un wait qui a expiré alors que l'exécution peut encore être en cours. Il n'est également **pas** déclenché par les exécutions de test manuelles sur le canvas.

### Workflow Timeout

Chaque workflow peut définir un **workflow timeout** en secondes dans le panneau **Properties** au niveau du workflow. `0` (la valeur par défaut) le désactive. Lorsqu'il est défini, une exécution qui dépasse la limite est arrêtée à la frontière du nœud suivant et enregistrée comme une exécution en échec avec une erreur "timed out". Le timeout s'applique aux exécutions manuelles, API et déclenchées. Les longs nœuds [Wait](../nodes/wait-node.md) sont interrompus rapidement plutôt que de bloquer pendant toute leur durée.

### Limite de simultanéité

Chaque workflow peut plafonner le nombre d'exécutions de production exécutées simultanément grâce à la **Limite de simultanéité** dans le panneau **Properties** au niveau du workflow ; le propriétaire et les collaborateurs disposant d'un accès en édition peuvent la modifier, et elle est désactivée par défaut. Lorsque la limite est atteinte, les nouvelles exécutions provenant des endpoints [webhook](./webhooks.md#concurrency-limit-and-queued-runs) et de [streaming](./sse-streaming.md), du [Portal](./portal.md), du [Quick Drawer](./quick-drawer.md), de [MCP](../tabs/mcp-tab.md) et de chaque [trigger](./triggers.md) attendent dans une file d'attente premier entré, premier sorti, comptabilisée sur toutes les instances d'un [cluster](./cluster.md). Les exécutions de test de l'éditeur, les appels de sous-workflows, les [Evals](../tabs/evals-tab.md) et les reprises de révision ne sont jamais mis en file d'attente, et les exécutions de cartes du [Board](../tabs/board-tab.md), les exécutions d'importation de fichiers, les exécutions lancées par l'outil run-workflow de l'assistant IA et les workflows de notification d'alerte démarrent sans attendre de créneau. Un appel webhook devant attendre reçoit immédiatement `202 Accepted` avec un `execution_id`, une URL de statut répondant avec les mêmes identifiants, ainsi que sa position, la taille de la file d'attente et le décompte des exécutions en cours ; un client MCP reçoit la même réponse et interroge l'outil `heym_execution_status`. L'option **Taille max. de la file d'attente** rejette les appels supplémentaires avec `429`, et l'option **Attente max.** enregistre une exécution ayant attendu trop longtemps comme `expired`. Les exécutions en attente apparaissent dans l'[Historique des exécutions](./execution-history.md) sous la mention **En file d'attente n/m** et peuvent y être annulées.

### Time Saved

Chaque workflow peut enregistrer un **estimated time saved per run** (en minutes), défini dans le panneau **Properties** au niveau du workflow. L'onglet [Analytics](../tabs/analytics-tab.md) agrège cette valeur sur la plage sélectionnée sous forme d'une statistique totale **Time Saved** (somme de l'estimation de chaque workflow × ses exécutions réussies). Most Used liste également cette somme par workflow ; **Not Set** ouvre le champ d'estimation lorsqu'il n'est pas défini. Le rapport [Workflow Analysis](./workflow-analysis.md) recommande de définir une estimation lorsqu'aucune n'est configurée.

### [Settings](./user-settings.md)

La boîte de dialogue Settings (ouverte depuis votre avatar dans l'en-tête) comporte quatre onglets : Profile (photo Gravatar, nom d'affichage, User Rules), [Security](./security.md) (changer le mot de passe), Voice ([ElevenLabs TTS/STT](./chat-voice.md)), et Observability (statut [OpenTelemetry](./opentelemetry.md) en lecture seule). Les User Rules sont des instructions personnalisées injectées dans chaque requête IA, y compris le workflow builder et le [Chat](../tabs/chat-tab.md), ce qui vous permet de définir une fois pour toutes la langue, le ton, le style de code ou les conventions de workflow. La politique de mot de passe et la gestion des clés API [MCP](../tabs/mcp-tab.md) sont également disponibles.

Voir aussi [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md), et [AI Assistant](./ai-assistant.md).
### [Traçage OpenTelemetry](./opentelemetry.md)

Heym peut émettre des traces OpenTelemetry pour chaque exécution de workflow et chaque exécution de nœud : un span racine `heym.workflow.execute` par exécution et un span enfant `heym.node.execute` par nœud, avec le modèle et la consommation de tokens attachés aux nœuds LLM et Agent. Les spans sont exportés via OTLP/HTTP vers tout backend compatible (Jaeger, Grafana Tempo, Honeycomb, Datadog), et le contexte de trace W3C se propage à travers les webhooks entrants, les requêtes HTTP sortantes et les sous-workflows. Le traçage est désactivé par défaut et se configure via les [variables d'environnement](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) `HEYM_OTEL_*` ; le statut actif est affiché dans l'onglet Observability des [Settings](./user-settings.md).

Voir aussi [Historique d'exécution](./execution-history.md), [Traces](../tabs/traces-tab.md) et [Webhooks](./webhooks.md).

### [Téléchargement et import](./download-import.md)

Exportez le workflow courant au format JSON depuis la barre d'outils de l'éditeur (bouton Download) ; le fichier inclut les nœuds et les arêtes. Importez en glissant un fichier JSON sur l'onglet [Workflows](../tabs/workflows-tab.md) (crée un nouveau workflow) ou sur le canvas (remplace ou fusionne). Le JSON doit inclure un tableau nodes ; le nom et les arêtes sont optionnels. Utilisez cette fonctionnalité pour la sauvegarde, le partage ou la migration entre instances.

Voir aussi [Structure de workflow](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) et [Fonctionnalités du canvas](./canvas-features.md).

### [Portal](./portal.md)

Le Portal expose les workflows sous forme d'interfaces de chat publiques à l'adresse `/chat/{slug}`. Configurez portal_enabled, le slug, l'authentification optionnelle (utilisateurs du portal), le streaming et le téléversement de fichiers pour chaque workflow. Les utilisateurs finaux interagissent via une interface de chat sans se connecter à Heym ; les sorties d'images peuvent être affichées dans le chat. Les workflows du Portal peuvent également basculer vers les pages de revue [Human-in-the-Loop](./human-in-the-loop.md) lorsqu'un [Nœud Agent](../nodes/agent-node.md) requiert une approbation, tandis que la branche `review` de l'agent envoie des notifications vers d'autres canaux. Utilisez-le pour des outils internes, des chatbots destinés aux clients et des formulaires propulsés par l'IA.

Voir aussi [Human-in-the-Loop](./human-in-the-loop.md), [Nœud Agent](../nodes/agent-node.md) et [Drive](./drive.md).

### [Génération de fichiers](./file-generation.md)

Les Skills peuvent générer des fichiers tels que PDF, DOCX, CSV, JSON et images pendant l'exécution en écrivant dans l'espace de travail `_OUTPUT_DIR`. Heym capture automatiquement ces fichiers, les stocke et expose les métadonnées de téléchargement sous `_generated_files`, qui peuvent ensuite être gérées avec le [nœud Drive](../nodes/drive-node.md) ou consultées dans l'onglet [Drive](../tabs/drive-tab.md).

Voir aussi [Nœud Agent](../nodes/agent-node.md), [Drive](./drive.md) et [nœud Drive](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive est la couche de stockage et de partage pour les fichiers générés par les skills. Il permet de parcourir les fichiers, de créer des liens publics ou protégés par mot de passe, d'appliquer une expiration et des limites de téléchargement, de partager des fichiers en lecture seule avec vos équipes et de gérer ces fichiers par programmation avec le [nœud Drive](../nodes/drive-node.md) ou manuellement depuis l'onglet [Drive](../tabs/drive-tab.md).

Voir aussi [Drive](../tabs/drive-tab.md), [Génération de fichiers](./file-generation.md) et [Portal](./portal.md).

### [Sécurité](./security.md)

Heym applique une politique de mot de passe (longueur, majuscule, minuscule, chiffre), stocke les access tokens dans des cookies HttpOnly et fait tourner les refresh tokens à chaque utilisation. La limitation de débit s'applique à la connexion, à l'inscription et à la connexion au [Portal](./portal.md). Les [Identifiants](./credentials.md) sont chiffrés au repos avec AES-256 (Fernet). La clé API [MCP](../tabs/mcp-tab.md) est utilisée pour l'authentification des clients ; la sécurité du contenu est disponible via les [Guardrails](./guardrails.md) sur les nœuds [LLM](../nodes/llm-node.md) et [Nœud Agent](../nodes/agent-node.md). Les [Execution Tokens](./execution-tokens.md) fournissent des JWT à portée limitée par workflow pour les appelants externes.

Voir aussi [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) et [Identifiants](./credentials.md).

### [Single Sign-On](./sso.md)

Heym authentifie les utilisateurs auprès de tout fournisseur OpenID Connect externe - Keycloak, Okta, Entra ID, Auth0, Google - configuré à l'exécution depuis **Settings → SSO** par un administrateur d'instance listé dans `HEYM_ADMIN_EMAILS`. Seuls une URL d'émetteur et des identifiants client sont saisis ; chaque endpoint provient du document de découverte du fournisseur, de sorte qu'aucun fournisseur n'est codé en dur. La connexion utilise Authorization Code avec PKCE, et l'ID token est vérifié par rapport aux clés publiées du fournisseur. Les comptes sont associés d'abord par `(issuer, subject)`, puis par email vérifié, avec un provisionnement automatique optionnel limité à une liste d'autorisation de domaines email. La connexion par mot de passe reste disponible en parallèle du SSO et peut être désactivée une fois qu'un test de connexion réussit, les comptes `HEYM_ADMIN_EMAILS` étant exemptés afin qu'un fournisseur mal configuré ne puisse pas verrouiller l'instance.

Voir aussi [Settings](./user-settings.md), [Sécurité](./security.md) et [Audit Logging](./audit.md).
### [Répartition de la charge](./cluster.md)

Pointez une seconde instance Heym vers la même base de données et elle rejoint le système en tant que worker. Les exécutions en arrière-plan - cron, webhooks, appels d'outils MCP, triggers de chat - sont réparties entre les instances selon un pourcentage défini par un administrateur d'instance sous **Settings → Instances**, avec le statut, la latence de base de données et la version de chaque instance regroupés dans un seul tableau. Les instances ne communiquent jamais entre elles : Postgres transporte le travail, de sorte qu'un worker n'a besoin d'aucun port ouvert ni d'aucune route vers l'instance principale. Le travail qui touche aux fichiers locaux, à un espace de travail d'agent de codage ou à un plugin installé s'exécute toujours sur l'instance principale, et le panneau indique quelle part des dernières 24 heures cela représente, afin qu'un opérateur puisse voir quand les pourcentages ne peuvent pas aider. Chaque exécution de l'historique nomme l'instance qui l'a exécutée, et les deux boîtes de dialogue d'historique permettent de filtrer sur ce critère.

Voir aussi [Settings](./user-settings.md), [Traces](../tabs/traces-tab.md) et [Analytics](../tabs/analytics-tab.md).

### [Intégrations tierces](./integrations.md)

Heym se connecte à des services externes via des identifiants stockés dans l'onglet [Identifiants](../tabs/credentials-tab.md) (chiffrés au repos). Les types pris en charge incluent OpenAI, Google, Decision Model pour le [nœud Decision](../nodes/decision-node.md), Model Router pour la sélection automatique de modèle (voir ci-dessous), GitHub pour le [nœud GitHub](../nodes/github-node.md) et les intégrations MCP, Jira pour le [nœud Jira](../nodes/jira-node.md), Notion pour le [nœud Notion](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP pour [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header et FlareSolverr pour [Crawler](../nodes/crawler-node.md). Chaque type documente les champs requis ; les identifiants peuvent être partagés avec des utilisateurs ou des [équipes](./teams.md) et référencés par leur nom dans les nœuds ou sous la forme `$credentials.Name` dans les expressions.

### Model Router (Auto Model)

Un identifiant **Model Router** sélectionne le modèle à chaque requête au lieu de détenir une clé. Il
stocke un identifiant de modèle de décision ainsi qu'une liste de vos identifiants OpenAI/Google/Custom
existants, chacun accompagné de critères indiquant quand il doit être utilisé, et apparaît dans chaque
sélecteur de modèle avec un unique modèle appelé **Auto**.

Les Traces, le Journal d'exécution du canvas et la Span View affichent les deux volets du choix, par
exemple `Auto Model / GPT-5`, tandis que le coût reste attribué au modèle qui a été exécuté. Auto
Model ne peut pas être combiné avec l'API Responses, le mode Batch ou la sortie d'images. Voir
[Identifiants](./credentials.md) pour le comportement complet.

Voir aussi [Identifiants](./credentials.md), [Partage d'identifiants](./credentials-sharing.md) et [Équipes](./teams.md).

### [Guardrails](./guardrails.md)

Les Guardrails bloquent les messages utilisateur dangereux ou indésirables avant qu'ils n'atteignent un [LLM](../nodes/llm-node.md) ou un [Nœud Agent](../nodes/agent-node.md). Activez-les par nœud et sélectionnez les catégories à bloquer (par ex. violence, discours haineux, contenu sexuel, automutilation, harcèlement, activité illégale). Définissez la sensibilité (faible, moyenne, élevée). Lorsqu'ils sont déclenchés, le nœud lève une erreur que vous pouvez intercepter avec un [Error Handler](../nodes/error-handler-node.md). La détection utilise l'API de modération du fournisseur ou la classification LLM selon le type d'identifiant.

Voir aussi [Sécurité](./security.md), [LLM](../nodes/llm-node.md), [Nœud Agent](../nodes/agent-node.md) et [Error Handler](../nodes/error-handler-node.md).

### [Enterprise](./enterprise.md)

Enterprise couvre les licences commerciales, le support professionnel et les services de déploiement pour les équipes exploitant Heym en production. Il inclut l'aide à l'architecture de workflow, l'onboarding, les conseils Kubernetes et de mise à l'échelle, le support prioritaire et le développement sur mesure autour de fonctionnalités avancées telles que le [Nœud Agent](../nodes/agent-node.md), le [Human-in-the-Loop](./human-in-the-loop.md), l'[Exécution parallèle](./parallel-execution.md) et le [Portal](./portal.md).

Voir aussi [Exécution et déploiement](../getting-started/running-and-deployment.md), [Sécurité](./security.md) et [Équipes](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work est une seconde interface destinée aux équipes métier au-dessus de Heym. Les utilisateurs décrivent une tâche, répondent à quelques questions et obtiennent un workflow testé, puis travaillent à partir de pages, d'approbations et d'une liste d'activité où chaque exécution porte un nom. Les administrateurs d'instance la connectent dans **Paramètres → Heym Work** avec son adresse et une clé d'intégration ; elle dispose de sa propre licence fournie par l'équipe Heym.

Voir aussi [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) et [Human-in-the-Loop](./human-in-the-loop.md).

---

## Onglets du tableau de bord
### [Workflows](../tabs/workflows-tab.md)

L'onglet Workflows est la vue par défaut du tableau de bord. Il affiche une liste à deux volets : les workflows et les dossiers sous forme de lignes denses à gauche, et un aperçu du workflow sélectionné à droite avec son trigger, sa dernière exécution et ses étapes, ainsi que Open Workflow et Run Now. Chaque ligne comporte une puce de statut (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled) sur laquelle le menu déroulant Status permet de filtrer. Un workflow dépourvu de nœud trigger est étiqueté selon le mode de démarrage de son exécution la plus récente — API pour un appel HTTP, SubWorker pour un workflow parent, Portal pour son chat public — et reste en Manual tant qu'il n'a pas été exécuté. Les dossiers et sous-dossiers gèrent l'[organisation](./workflow-organization.md). Créez des workflows avec New Workflow, glissez-déposez du JSON pour [importer](./download-import.md), et modifiez ou supprimez depuis les actions de ligne. Les workflows peuvent être déplacés entre les dossiers ; la suppression est planifiée (corbeille) avant l'élimination définitive.

Voir aussi [Workflow Organization](./workflow-organization.md), [Download & Import](./download-import.md) et [Quick Drawer](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Regarder la démo Workflows</a></p>

### [Board](../tabs/board-tab.md)

Un tableau kanban agentique où les cartes sont des jobs persistants. Configurez chaque colonne avec une chaîne de workflows ordonnée ; déplacer une carte dans la colonne exécute la chaîne avec le contexte complet de la carte (contenu, commentaires, historique, sorties précédentes). Les résultats sont réécrits dans la carte — vert en cas de succès, rouge en cas d'échec, ambre pendant l'exécution. Les tours de suivi réexécutent la chaîne de la colonne courante avec tout ce qui a été accumulé jusqu'ici, ce qui alimente la planification itérative. Les exécutions sont enregistrées dans l'[Execution History](./execution-history.md) avec la source de trigger `board`. Tant qu'une exécution de carte est active, **Open live** ouvre cette exécution précise sur le canvas animé avec les logs Debug incrémentaux.

Voir aussi [Workflows](../tabs/workflows-tab.md), [Execution History](./execution-history.md) et [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Templates](../tabs/templates-tab.md)

L'onglet Templates vous permet d'enregistrer et de réutiliser des modèles de workflow (workflows complets) et des modèles de nœud (nœuds configurés individuels). Créez des modèles de workflow depuis l'éditeur (Share as Template) et des modèles de nœud en effectuant un clic droit sur un nœud. Parcourez par visibilité (Everyone ou utilisateurs/[équipes](./teams.md) spécifiques), appliquez un modèle pour créer un nouveau workflow ou ajouter un nœud au canvas, et gérez vos modèles partagés.

Voir aussi [Workflows](../tabs/workflows-tab.md), [Teams](./teams.md) et [Canvas Features](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Regarder la démo Templates</a></p>

### [Variables](../tabs/global-variables-tab.md)

L'onglet Variables gère le [Global Variable Store](./global-variables.md). Créez, modifiez et supprimez des variables globales ; définissez le nom, la valeur et le type de valeur (Auto, String, Number, Boolean, Array, Object). Les variables sont propres à chaque utilisateur et persistent entre les exécutions. Référencez-les dans n'importe quelle [expression](./expression-dsl.md) de workflow sous la forme `$global.variableName`. Les variables peuvent être partagées avec d'autres utilisateurs ou [équipes](./teams.md).

Voir aussi [Global Variables](./global-variables.md), [Variable](../nodes/variable-node.md) et [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Regarder la démo Variables</a></p>
### [Chat](../tabs/chat-tab.md)

L'onglet Chat est la surface d'agent de longue durée de Heym permettant de piloter l'espace de travail depuis la conversation. Sélectionnez un [identifiant](./credentials.md) et un modèle, puis demandez à Chat de répondre à des questions, d'inspecter les définitions de workflow, d'exécuter des workflows existants, de résumer les exécutions et les planifications, de rapporter l'historique d'exécution d'un workflow unique (nombre d'exécutions, répartition par statut, dernière exécution et les détails d'une exécution sur demande), d'indiquer quelles exécutions sont en cours à l'instant présent (avec le temps écoulé, le nœud courant et un lien vers chaque exécution en direct), de résoudre les revues humaines en attente, de créer et de réviser des workflows avec le même moteur AI Builder que celui utilisé dans l'éditeur, ou d'ajouter des cartes aux tableaux kanban en langage naturel. Les nouvelles cartes démarrent toujours dans la première colonne du tableau sélectionné ; lorsque plusieurs tableaux sont disponibles et qu'aucun n'a été nommé, Chat présente une sélection de tableaux avant de créer la carte.

Chat continue de fonctionner en arrière-plan après la fermeture du navigateur. Pendant qu'une réponse est diffusée en streaming, vous pouvez envoyer d'autres messages ; Heym les stocke dans une file d'attente adossée à une base de données, vous permet de modifier ou de supprimer les messages en file d'attente avant leur démarrage, et les exécute dans l'ordre une fois la réponse en cours terminée. Si l'assistant a besoin de détails de planification et renvoie des questions de clarification, la file d'attente se met en pause jusqu'à ce que vous répondiez à ces questions, puis reprend après la réponse de planification.

Les réponses sont diffusées en streaming avec du markdown, des images en ligne, des cartes d'aperçu de workflow, des cartes d'appel d'outil repliables, l'utilisation du contexte et la compression automatique du contexte. Chat prend en charge les pièces jointes, la saisie vocale, la lecture à voix haute, les actions de copie, les prompts rapides, les User Rules depuis les [Paramètres](./user-settings.md) et les [variables globales](./global-variables.md) comme contexte.

Voir aussi [Assistant IA](./ai-assistant.md), [Identifiants](./credentials.md) et [Paramètres](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Regarder la démo de Chat</a></p>

### [Identifiants](../tabs/credentials-tab.md)

L'onglet Identifiants gère les clés API et les secrets utilisés par les nœuds. Ajoutez des identifiants par type (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere, etc.), nommez-les et référencez-les dans les nœuds de workflow. Modifiez ou supprimez depuis la carte ; partagez avec des utilisateurs par e-mail ou avec des [équipes](./teams.md). Toutes les valeurs sont chiffrées au repos et masquées dans l'interface.

Voir aussi [Identifiants](./credentials.md), [Partage d'identifiants](./credentials-sharing.md) et [Intégrations tierces](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Regarder la démo des Identifiants</a></p>

### [Bases vectorielles](../tabs/vectorstores-tab.md)

L'onglet Bases vectorielles gère les bases vectorielles utilisées par les nœuds [RAG](../nodes/rag-node.md). Créez une base avec un nom et un [identifiant](./credentials.md) de base vectorielle — *RAG: Qdrant + OpenAI* (Qdrant externe) ou *RAG: Psql + OpenAI* (le Postgres propre à Heym via pgvector), ce qui fixe le backend de la base — définissez éventuellement un nom de collection, puis importez des documents (PDF, TXT, etc.). Gérez le contenu (afficher, supprimer des sources), modifiez les détails de la base et partagez les bases avec des utilisateurs. Dans un nœud [RAG](../nodes/rag-node.md), choisissez la Database, sélectionnez la base vectorielle et exécutez des opérations d'insertion, d'upsert, de suppression ou de recherche.

Voir aussi [Qdrant RAG](../nodes/rag-node.md), [Identifiants](./credentials.md) et [Équipes](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Regarder la démo des Bases vectorielles</a></p>
### [MCP](../tabs/mcp-tab.md)

L'onglet MCP configure l'intégration du Model Context Protocol. Heym prend en charge deux modes :

**Serveur par défaut** – Un endpoint unique à `/api/mcp/sse` expose tous les workflows compatibles MCP. Consultez et régénérez votre clé API, copiez le JSON client prêt à l'emploi, connectez Cursor en un clic, ou suivez le flux de configuration Claude avec enregistrement OAuth automatique.

**Serveurs nommés** – Créez plusieurs endpoints MCP isolés, chacun avec sa propre URL basée sur un UUID (`/api/mcp/servers/{uuid}/sse`) et sa clé API indépendante. Affectez des workflows spécifiques à chaque serveur afin que différents clients IA ou équipes ne voient que les outils dont ils ont besoin. Chaque serveur nommé prend en charge les mêmes méthodes d'authentification (clé API, Claude OAuth) et dispose de ses propres raccourcis Copy JSON et Add to Cursor. Les deux endpoints prennent en charge le transport SSE (GET) et le transport Streamable HTTP (POST). Activer ou désactiver un workflow au sein d'un serveur nommé le déplace en haut de la liste affectée afin que la ligne modifiée reste visible.

**Outil de chat Heym** – Chaque mode peut également exposer le moteur [Chat](../tabs/chat-tab.md) sous la forme d'un unique outil `heym_chat`, activé par surface avec ses propres identifiants LLM et modèle (préremplis à partir de votre modèle préféré dans les [Settings](./user-settings.md)). Un client MCP envoie un seul `message` en langage naturel et le moteur fait le reste : création de workflows en mode build (enregistrement, jusqu'à cinq exécutions de test, correction et vérification), exécution de workflows, analytique, exécutions, statut d'exécution en direct, planifications, boards et cartes, équipes, variables globales, recherche documentaire et décisions human-in-the-loop. Les capacités ajoutées ultérieurement à Chat sont accessibles via le même outil sans enregistrement supplémentaire. Chaque appel est stocké dans l'historique de l'onglet Chat en tant que conversation marquée d'un plug et renvoie un `conversation_id` que le client peut transmettre en retour pour poursuivre le fil.

Voir également [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) et [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Regarder la démo MCP</a></p>

### [Traces](../tabs/traces-tab.md)

L'onglet Traces affiche les traces d'exécution [LLM](../nodes/llm-node.md). Un en-tête de statistiques au-dessus de la liste résume la plage temporelle sélectionnée avec des cartes KPI (Calls, Tokens, Cost, Avg Latency, Error %) et trois graphiques — Tokens by Model, Cost by Model et Calls Over Time (empilé succès vs erreur). Un unique sélecteur **Time range** (1h / 24h / 7d / 30d / All ; 7 jours par défaut) filtre à la fois les graphiques et la liste. Le coût est calculé à partir de la [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) par utilisateur ; les modèles sans tarification apparaissent sous forme d'avertissement en ligne renvoyant vers celle-ci. Ouvrez n'importe quelle trace pour consulter les payloads de requête et de réponse, la répartition temporelle (llm_ms, tools_ms, mcp_list_ms), les appels d'outils (nom, arguments, résultat) et les skills inclus. Les événements développés affichent le JSON — y compris les payloads MCP et JSON-RPC — sous forme d'arborescence repliable avec le premier niveau ouvert par défaut ; **Tree / Raw** bascule vers le texte d'origine et le JSON malformé reste lisible. Utilisez les traces pour déboguer le comportement du [Agent Node](../nodes/agent-node.md) et du [LLM](../nodes/llm-node.md) et pour copier ou exporter les payloads.

Voir également [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) et [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Regarder la démo Traces</a></p>
### [Alertes](../tabs/alerts-tab.md)

L'onglet Alertes définit des conditions de seuil sur une fenêtre temporelle et vous prévient lorsqu'elles sont franchies. Quatre types d'alertes couvrent les questions que se posent réellement les opérateurs : **seuil d'erreurs** (cela a-t-il échoué plus de N fois dans la fenêtre), **durée de workflow** (les exécutions sont-elles devenues plus lentes, mesurée en max, moyenne ou p95), **coût en tokens / USD** (les dépenses ont-elles franchi un budget, résolu via la même table de tarification que les [Traces](../tabs/traces-tab.md)), et **nombre d'exécutions** (cela s'est-il exécuté bien plus souvent que prévu). Chaque type est évalué sur une fenêtre que vous choisissez, jamais sur un événement isolé, car une exécution échouée est du bruit et une rafale est un incident. Les alertes surveillent un workflow ou tous les workflows auxquels vous avez accès.

Un assistant en cinq étapes vous guide à travers le type, la portée, la condition, la réponse et la revue. L'étape Revue **backteste** d'abord la condition, en indiquant à quelle fréquence elle se serait déclenchée au cours des dernières 24 heures à 7 jours, afin qu'un seuil bien trop bas soit détecté avant d'être enregistré plutôt qu'après avoir alerté quelqu'un. Décrivez ce que vous souhaitez en langage naturel et l'IA remplit chaque étape qu'elle peut, en signalant ses suppositions ; une demande partielle fait tout de même avancer l'assistant, en s'ouvrant sur la première étape qui nécessite encore une décision plutôt que de vous obliger à tout recommencer. Par défaut, une alerte se déclenche une fois et reste silencieuse jusqu'à ce que la métrique se rétablisse ; vous pouvez au contraire la faire se répéter à intervalle régulier.

À l'étape réponse, une alerte peut créer et assigner un nouveau workflow à exécuter lorsqu'elle se déclenche, en utiliser un que vous possédez déjà, ou ne rien faire. Le payload de déclenchement transporte la valeur observée, le seuil, la fenêtre et les workflows ayant contribué au chiffre, ce qui permet aux alertes d'atteindre Slack, l'e-mail ou Telegram à l'aide de nœuds que vous possédez déjà. L'historique des déclenchements enregistre ce qui était vrai au moment où chaque alerte s'est déclenchée et est conservé pendant 90 jours ; acquitter un déclenchement fait passer le badge de Firing à Acknowledged sans prétendre que la condition s'est résorbée. L'onglet [Chat](../tabs/chat-tab.md) peut répondre aux questions sur les alertes existantes et sur les raisons ou le moment d'un déclenchement. Les alertes peuvent être partagées avec des utilisateurs et des [équipes](../tabs/teams-tab.md).

Voir aussi [Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md) et [Historique d'exécution](./execution-history.md).

### [Analytics](../tabs/analytics-tab.md)

L'onglet Analytics affiche les métriques et tendances d'exécution. Les statistiques de synthèse incluent le total des exécutions, le taux de succès, le taux d'erreur, les répartitions de latence et le total **Time Saved** (la somme des minutes estimées économisées par exécution de chaque workflow × ses exécutions réussies). Most Used liste cette même somme par workflow. Sélectionnez une plage temporelle de base (24h, 7j, 30j ou tout), filtrez éventuellement par workflow, puis faites glisser sur n'importe quel graphique pour explorer une plage de dates sélectionnée. Les graphiques et les tables de workflows s'actualisent selon la sélection, et l'actualisation automatique maintient les métriques à jour. Cela complète l'[Historique d'exécution](./execution-history.md) et la vue [Planifications](../tabs/scheduled-tab.md) lorsque vous avez besoin à la fois des résultats passés et des exécutions à venir.

Voir aussi [Historique d'exécution](./execution-history.md), [Planifications](../tabs/scheduled-tab.md) et [Évaluations](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Regarder la démo Analytics</a></p>
### [Dashboard](../tabs/dashboard-tab.md)

L'onglet Dashboard est un espace de type Grafana où vous construisez des grilles de widgets de graphiques, chacun étant généré à partir de son propre Workflow Heym masqué. Conservez autant de dashboards que nécessaire et partagez chacun d'eux avec des utilisateurs ou des équipes, en lecture seule ou en édition ; les widgets s'exécutent toujours avec les Identifiants du propriétaire, de sorte que tout le monde voit les mêmes données. Décrivez une métrique en langage naturel et l'IA génère le widget, ou ajoutez-en un manuellement et choisissez un type de graphique, prévisualisé avec des données d'exemple : barres, lignes, aires, secteurs, tableau, numérique, jauge, nuage de points, proportion, jauge à barres, texte ou HITL. HITL est un carrousel de vos revues humaines en attente. L'en-tête affiche `1/n pending`. Le nom du Workflow ouvre cette exécution sur le canvas. **Approve**, **Request changes** et **Reject** la résolvent, et l'icône d'historique à côté du titre du widget ouvre cette exécution dans la boîte de dialogue d'historique sur la même page. Les widgets mettent en cache leurs résultats, peuvent être affinés avec l'IA (chaque modification est enregistrée dans l'[Edit History](./edit-history.md)), clonés avec leur Workflow complet, réorganisés avec Tidy up, et déplacés ou redimensionnés en mode édition. Les tableaux peuvent afficher des puces d'état et relier leurs lignes à un tableau de bord de détail qui lit l'enregistrement de la ligne cliquée sous la forme `$page.record`, et un widget Run exécute un workflow depuis le tableau de bord : sur un fichier déposé, avec ses champs d'entrée ou avec un bouton Exécuter. Comme chaque widget est un Workflow, toute donnée que vous pouvez récupérer — un appel [HTTP](../nodes/http-node.md), une requête [BigQuery](../nodes/bigquery-node.md), une recherche [RAG](../nodes/rag-node.md) ou une sortie [LLM](../nodes/llm-node.md) — peut devenir un graphique. Les paramètres d'un widget HITL peuvent le restreindre aux revues d'un seul workflow, ou à une étape d'agent ou d'approbation Slack en son sein ; un tel widget les affiche à toutes les personnes pouvant ouvrir ce workflow et est masqué pour toutes les autres. [Chat](../tabs/chat-tab.md) et l'outil MCP `heym_chat` listent vos tableaux de bord avec leurs widgets, indiquent sur quel tableau de bord se trouve un workflow, ajoutent un nouveau widget (d'abord un widget vide dont le Chat construit et teste le workflow), placent un workflow existant en tant que widget sur un tableau de bord, renomment ou suppriment des widgets et réorganisent la disposition comme le fait le bouton Réorganiser.

Voir aussi [Chart Output node](../nodes/chart-output-node.md), [Analytics](../tabs/analytics-tab.md) et [Execution History](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Regarder la démo Dashboard</a></p>

### [Evals](../tabs/evals-tab.md)

L'onglet Evals (à l'adresse `/evals`) vous permet de créer des suites d'évaluation, d'ajouter ou de générer des cas de test, d'optimiser le Prompt de la suite et d'exécuter des évaluations sur les Workflows du [Nœud Agent](../nodes/agent-node.md). Sélectionnez un ou plusieurs modèles, choisissez une méthode de notation (Exact Match, Contains ou LLM-as-Judge), laissez éventuellement un modèle distinct ou un [Decision Model](../nodes/decision-node.md) juger les réponses LLM-as-Judge, définissez le nombre d'exécutions par test (ainsi que la température et l'effort de raisonnement pour Exact Match et Contains), puis comparez les résultats réussite/échec et les sorties par modèle. Consultez l'historique des exécutions pour les évaluations passées, y compris le juge utilisé par chaque exécution, relancez-en une avec le même juge, exportez-la en JSON et vérifiez le comportement sous-jacent dans les [Traces](../tabs/traces-tab.md).

Une **suite d'agent** vérifie plutôt un seul nœud agent : elle affiche la latence de référence de l'agent, son coût en USD, ses jetons et ses appels d'outils issus de ses exécutions réelles, vous permet de marquer chaque outil, outil MCP, sous-agent, sous-workflow ou compétence comme devant ou ne devant pas être appelé par l'agent, fixe des limites supérieures 20 % au-dessus de la référence, exécute le workflow un nombre de fois choisi avec les entrées de la dernière exécution ou générées par IA, et note chaque exécution en indiquant la raison de l'échec. Le sélecteur de suites liste les deux types et permet la recherche, et le rapport [Workflow Analysis](./workflow-analysis.md) suggère une suite pour les workflows dotés de nœuds agent ou LLM.

Voir aussi [Agent Node](../nodes/agent-node.md), [Traces](../tabs/traces-tab.md) et [Execution History](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Regarder la démo Evals</a></p>

### [Teams](../tabs/teams-tab.md)

L'onglet Teams vous permet de créer et de gérer des équipes. Créez une équipe, ajoutez des membres par e-mail et supprimez des membres (le créateur ne peut pas être supprimé). Partagez des [Workflows](../tabs/workflows-tab.md), des [Modèles](../tabs/templates-tab.md), des [Identifiants](../tabs/credentials-tab.md), des [Variables](../tabs/global-variables-tab.md), des [Bases vectorielles](../tabs/vectorstores-tab.md) et des [fichiers Drive](../tabs/drive-tab.md) avec des équipes depuis leurs boîtes de dialogue de partage respectives ; tous les membres de l'équipe y gagnent accès. Modifiez le nom et la description de l'équipe ou supprimez l'équipe (supprime tous les partages d'équipe).

Voir aussi [Teams](./teams.md), [Credentials Sharing](./credentials-sharing.md) et [Workflow Organization](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Regarder la démo Teams</a></p>

### [Scheduled](../tabs/scheduled-tab.md)

L'onglet Scheduled affiche tous les Workflows [Cron](../nodes/cron-node.md) actifs sur un calendrier visuel. Basculez entre les vues jour, semaine et mois pour voir quand vos automatisations sont planifiées, puis revenez au [Workflow](../tabs/workflows-tab.md) associé lorsque vous devez modifier la planification.

Voir aussi [Cron](../nodes/cron-node.md), [Analytics](../tabs/analytics-tab.md) et [Execution History](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Regarder la démo Scheduled</a></p>
### [Logs](../tabs/logs-tab.md)

L'onglet Logs affiche les logs des conteneurs Docker de la stack Heym (backend, frontend, PostgreSQL). Sélectionnez un ou plusieurs conteneurs, filtrez par niveau de log (All, INFO, WARNING, ERROR, DEBUG) et effectuez des recherches dans les logs. Utilisez-le pour le débogage et la résolution de problèmes. Pour les logs d'exécution de Workflow (résultats des nœuds, sorties), utilisez plutôt l'[Historique des exécutions](./execution-history.md), les [Traces](../tabs/traces-tab.md) ou le panneau Debug de l'éditeur.

Voir également [Historique des exécutions](./execution-history.md), [Traces](../tabs/traces-tab.md) et [Fonctionnalités du Canvas](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Regarder la démo Logs</a></p>

### [DataTable](../tabs/datatable-tab.md)

L'onglet DataTable vous permet de créer et de gérer des tables de données structurées au sein de Heym. Définissez des colonnes typées (string, number, boolean, date, JSON), gérez les lignes avec une édition en ligne par double-clic, importez/exportez des CSV et partagez les tables avec des utilisateurs ou des [équipes](./teams.md) avec des permissions de lecture/écriture. Utilisez le [nœud DataTable](../nodes/datatable-node.md) pour accéder aux tables de manière programmatique dans les Workflows. Une section épinglée **System tables** en haut héberge la **LLM Cost Table** : une vue à schéma fixe des tarifs par modèle, alimentée depuis Helicone en arrière-plan (TTL de 24 heures, actualisation manuelle), où chaque utilisateur peut remplacer les prix ou ajouter des lignes personnalisées pour les modèles non répertoriés par Helicone. Ces règles de tarification alimentent le KPI de coût et le graphique de coût par modèle de l'onglet [Traces](../tabs/traces-tab.md).

Voir également [nœud DataTable](../nodes/datatable-node.md), [Traces](../tabs/traces-tab.md), [Structure du Workflow](./workflow-structure.md) et [Équipes](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Regarder la démo DataTable</a></p>

### [Drive](../tabs/drive-tab.md)

L'onglet Drive affiche tous les fichiers générés par les skills dans l'ensemble de vos Workflows. Il liste chaque fichier avec son nom, son type, sa taille, son nœud source, sa date de création et son état de partage avec l'équipe, et propose des contrôles de recherche, de téléchargement authentifié, de partage, de suppression et de pagination. Il s'agit du tableau de bord complémentaire de la [Génération de fichiers](./file-generation.md), de la référence [Drive](./drive.md) et du [nœud Drive](../nodes/drive-node.md).

Voir également [Drive](./drive.md), [Génération de fichiers](./file-generation.md) et [nœud Drive](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Regarder la démo Drive</a></p>

### [Collaboration sur le Canvas](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
