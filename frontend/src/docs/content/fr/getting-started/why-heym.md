# Pourquoi Heym

Heym est une infrastructure permettant d'exécuter et de gouverner des agents IA en production. Un runtime auto-hébergé unique couvre chaque étape du cycle de vie des agents.

Un agent prototype a besoin d'un modèle, d'un prompt et de quelques outils. Un agent en production a également besoin de triggers et de tentatives de réexécution, d'un état sauvegardé lorsqu'il se met en pause pour un humain, d'un enregistrement de chaque appel de modèle et d'outil, d'un coût pour chaque exécution, de tests avant le déploiement d'une modification, et de limites claires sur ce qu'il peut faire de manière autonome. Heym regroupe tout cela en un seul endroit, afin que le système que vous concevez sur le canvas soit celui qui s'exécute. Concevez des systèmes agentiques, puis exécutez-les en toute confiance.

## Un runtime unique pour le cycle de vie des agents

| Étape | Ce que Heym vous apporte |
|---|---|
| **Concevoir** | Composez des agents et des étapes déterministes sur le canvas, générez-les avec l'[AI Assistant](../reference/ai-assistant.md), ou partez de [Modèles](../tabs/templates-tab.md) et de compétences portables. |
| **Orchestrer** | Coordonnez des agents, des [sous-agents](../reference/agent-architecture.md), des agents de codage, du RAG, de l'automatisation de navigateur et des outils avec un flux de données explicite et une [exécution parallèle](../reference/parallel-execution.md). |
| **Exécuter** | Lancez des exécutions depuis des [webhooks](../reference/webhooks.md), des planifications et des [triggers](../reference/triggers.md) d'événements, avec des tentatives de réexécution par nœud, une [gestion des erreurs](../nodes/error-handler-node.md) et une [répartition de la charge](../reference/cluster.md) entre les instances. |
| **Observer** | Inspectez chaque exécution via l'[historique](../reference/execution-history.md), les [traces LLM](../tabs/traces-tab.md), le coût en USD par exécution, les exécutions en direct sur le canvas, les [analytiques](../tabs/analytics-tab.md), les [alertes](../tabs/alerts-tab.md) et l'export [OpenTelemetry](../reference/opentelemetry.md). |
| **Évaluer** | Testez les prompts et les modèles par rapport aux sorties attendues dans les [Évaluations](../tabs/evals-tab.md), avec un scoring LLM-as-Judge et une comparaison de modèles côte à côte. |
| **Contrôler** | Gardez les humains aux commandes avec des [points de contrôle de revue](../reference/human-in-the-loop.md) et des [garde-fous](../reference/guardrails.md), et gouvernez les accès avec des [identifiants](../reference/credentials.md) chiffrés, des [équipes](../reference/teams.md), l'[authentification unique](../reference/sso.md) et une [piste d'audit](../reference/audit.md). |
| **Exposer** | Servez les workflows via REST et [SSE](../reference/sse-streaming.md), en tant qu'outils [MCP](../tabs/mcp-tab.md), en tant qu'interfaces de chat [Portal](../reference/portal.md) et en tant que widgets de [dashboard](../tabs/dashboard-tab.md). |

## Concevoir

### AI Assistant : concevoir des workflows en langage naturel

L'[AI Assistant](../reference/ai-assistant.md) est un panneau de chat intégré à l'éditeur de workflows. Décrivez ce que vous souhaitez, par exemple « créer un workflow qui prend une entrée utilisateur, recherche dans ma base de connaissances et répond avec GPT-4o », et l'assistant génère des nœuds et des arêtes qui sont instantanément appliqués au canvas.

- Utilise votre propre identifiant LLM (tout modèle pris en charge)
- Prend en charge la **saisie vocale** pour concevoir des workflows sans les mains
- Applique automatiquement le JSON de workflow valide issu de la réponse de l'IA au canvas
- Diffuse les réponses en temps réel

L'assistant fonctionne directement dans l'éditeur et diffuse les nœuds sur le canvas en temps réel, et tout ce qu'il génère reste modifiable comme des nœuds que vous auriez placés manuellement.

### Système de compétences

Les compétences sont des ensembles de capacités portables, un fichier d'instructions `SKILL.md` accompagné de scripts Python optionnels, qui peuvent être déposés sur n'importe quel Nœud Agent.

- Les instructions de la compétence sont ajoutées en préfixe au prompt système de l'agent
- Les fichiers Python de la compétence deviennent des outils appelables
- Les compétences sont réutilisables entre les workflows et partageables sous forme d'archives `.zip`

Cela revient à donner à votre agent une fiche de poste et une boîte à outils en un seul dépôt.

### Workflow Analyzer : retour d'information tenant compte des exécutions

Le panneau [Workflow Analysis](../reference/workflow-analysis.md) est un outil de documentation et de retour d'information tenant compte des exécutions, intégré à l'éditeur. Cliquez sur **Analyze**, choisissez un identifiant LLM et un modèle, et Heym génère un rapport Markdown modifiable pour le workflow en cours.

Contrairement à une note statique, l'analyseur exécute d'abord le workflow lorsqu'il le peut et inclut le résultat de l'exécution dans le prompt. Le rapport couvre les axes d'amélioration, l'objectif du workflow et une explication étape par étape de ce que font les nœuds. Lorsqu'un rapport existe déjà, **Reanalyze** diffuse un aperçu distinct afin que vous puissiez accepter la nouvelle version ou conserver le document partagé actuel.

## Orchestrer

### Nœuds LLM et Agent intégrés

Le [Nœud Agent](../nodes/agent-node.md) de Heym exécute une boucle d'appel d'outils étroitement intégrée avec des outils Python inline, des connexions MCP et un système de compétences portable, le tout conçu pour des agents en production.

Le simple [nœud LLM](../nodes/llm-node.md) de Heym va également au-delà d'une unique étape prompt-réponse. Pour les endpoints OpenAI et compatibles OpenAI pris en charge, il peut basculer en **mode Batch API** afin qu'un seul nœud soumette un tableau de prompts dans une requête batch native au fournisseur, à moindre coût. Le canvas expose alors une branche dédiée `batchStatus` qui se déclenche au fur et à mesure que le batch traverse des états tels que `pending`, `processing` et `completed`.

Cela signifie que le nœud LLM peut accomplir deux choses à la fois :

- Exécuter la requête batch principale et renvoyer les sorties finales par élément sur la branche normale
- Déclencher une logique de notification ou de journalisation à chaque mise à jour significative du statut du batch, sans transformer le flux en une boucle de polling personnalisée

L'exécution par batch est une primitive de workflow LLM de premier ordre, avec des vérifications des capacités du fournisseur et du modèle directement dans l'interface du nœud.

Le **Nœud Agent** est le cœur de l'orchestration d'agents dans Heym :

- **Appel d'outils** – L'agent itère sur les appels d'outils dans une boucle jusqu'à produire une réponse finale
- **Outils Python** – Définissez des outils personnalisés inline avec du Python complet ; l'agent les appelle à l'exécution
- **Connexions MCP** – Connectez-vous à n'importe quel serveur [Model Context Protocol](https://modelcontextprotocol.io/) (stdio ou SSE) et l'agent récupère automatiquement tous ses outils
- **Compétences** – Déposez un fichier `.zip` ou `.md` sur un agent pour étendre son contexte système et ajouter de l'outillage Python
- **Appels de sous-workflows** – L'agent peut invoquer d'autres workflows Heym en tant qu'outils, composant ainsi des comportements complexes sans code personnalisé

Consultez [Nœud Agent](../nodes/agent-node.md) et [Architecture des agents](../reference/agent-architecture.md) pour la référence complète.

### Orchestration multi-agents

Heym prend en charge un **modèle orchestrateur** avec des primitives visuelles de premier ordre :

- Un agent joue le rôle d'**orchestrateur** (`isOrchestrator: true`) et reçoit un outil `call_sub_agent`
- Il délègue les tâches à des **sous-agents** nommés sur le même canvas
- Les sous-agents peuvent eux-mêmes appeler d'autres agents ou sous-workflows (profondeur maximale : 5)
- **Exécution parallèle** : lorsque l'orchestrateur appelle plusieurs sous-agents en un seul tour, ceux-ci s'exécutent en parallèle pour des résultats plus rapides

Cela permet des architectures telles qu'un agent de planification qui route le travail vers un chercheur, un développeur et un synthétiseur, le tout câblé visuellement sans code d'orchestration personnalisé.

Consultez [Architecture des agents](../reference/agent-architecture.md) pour les détails d'exécution.

### Agents de codage en tant que nœuds de workflow

Heym fournit deux nœuds qui exécutent un véritable agent de codage comme étape de workflow, et non comme une simple complétion de chat :

- **[Nœud Codex](../nodes/codex-node.md)** – Exécute le CLI OpenAI Codex dans un espace de travail Heym isolé sur un dépôt GitHub. Prend en charge **Sign in with ChatGPT** (OAuth PKCE sur votre abonnement Plus/Pro, sans coût API par token) ou un access token, clone le dépôt, laisse Codex modifier le code et renvoie `summary`, `diff`, `changedFiles` ainsi qu'une `pullRequestUrl` en brouillon.
- **[Nœud OpenCode Go](../nodes/opencode-go-node.md)** – Le même workflow de dépôt via la passerelle OpenCode agnostique au fournisseur (Kimi, DeepSeek, Qwen, et plus encore), exécuté dans un **conteneur jetable durci** : toutes les capacités supprimées, racine en lecture seule, limites de pid/mémoire/CPU. Le token GitHub reste en dehors du sandbox : Heym effectue chaque opération git et GitHub côté hôte, de sorte que le code généré ne peut pas exfiltrer les identifiants de push.

Ainsi, un workflow peut trier un bug depuis un webhook, confier le dépôt à un agent de codage, attendre la PR en brouillon et publier le lien sur Slack, entièrement automatisé, avec des limites de ressources configurables par déploiement.

### Pipeline RAG intégré

Heym inclut un [Nœud RAG / Vector Store](../nodes/rag-node.md) et un onglet managé [Bases vectorielles](../tabs/vectorstores-tab.md). Vous pouvez :

- Choisir votre backend vectoriel : **Qdrant** (serveur externe) ou **Postgres (pgvector)**, qui stocke les vecteurs dans la base de données de Heym sans service supplémentaire à exécuter
- Insérer des documents dans une base vectorielle directement depuis un nœud de workflow
- Effectuer une recherche sémantique et alimenter un nœud LLM ou Agent avec les résultats
- Référencer les résultats avec des expressions telles que `$ragNode.results.map("item.payload.content").join("\n\n")`

Dans Heym, le RAG se résume à deux nœuds avec un contrôle total sur les embeddings et la récupération.

### Automatisation de navigateur avec Playwright

Le [nœud Playwright](../nodes/playwright-node.md) est une automatisation de navigateur first-party directement sur le canvas.

- **Mode Steps** – Composez visuellement des actions navigate, click, type, fill, screenshot, extract et scroll
- **Étapes IA avec auto-réparation** – Décrivez une action en langage naturel et un LLM génère les actions Playwright ; les sélecteurs en échec peuvent être réparés automatiquement, et les étapes générées peuvent être mises en cache pour éviter les futurs appels LLM
- **Mode Run Code** – Basculez le nœud en Playwright Python complet pour les flux complexes (désactivé par défaut ; s'exécute dans le sandbox durci de Heym lorsqu'il est activé)
- **Sessions authentifiées** – Restaurez les cookies/`storageState` avant l'exécution, vérifiez la connexion via un contrôle de sélecteur et basculez vers des étapes de connexion scriptées en cas d'échec
- **Capture réseau** – Collectez éventuellement les réponses JSON, les en-têtes, les cookies et le stockage du navigateur en plus des résultats

Heym traite le navigateur comme un nœud ordinaire, avec les mêmes expressions, identifiants et gestion des erreurs que tout le reste.

### Expression DSL

Le [Expression DSL](../reference/expression-dsl.md) de Heym offre une syntaxe claire et puissante pour référencer les données des nœuds en amont :

- `$input.text` – Données du nœud Input
- `$nodeName.field` – Champ de sortie de tout nœud en amont
- `$global.variableName` – Variables globales persistantes
- Assistants de tableau : `.first()`, `.map("field")`, `.join("\n")`

Les expressions fonctionnent dans chaque champ de type chaîne, y compris les prompts, les en-têtes HTTP, les conditions et les valeurs définies, de sorte que les données circulent explicitement entre les étapes. Le DSL concilie puissance et lisibilité sans exiger une maîtrise complète de JavaScript.

## Exécution

### Triggers, tentatives et chemins d'erreur

Un workflow peut démarrer depuis de nombreux points. Les nœuds [Input](../nodes/input-node.md) reçoivent des [webhooks](../reference/webhooks.md) HTTP, le nœud [Cron](../nodes/cron-node.md) s'exécute selon une planification, et les [triggers](../reference/triggers.md) d'événements lancent des exécutions depuis Telegram, Discord, Slack, des boîtes IMAP, des flux WebSocket, des files RabbitMQ, des téléversements de fichiers et des événements de la plateforme Heym.

Les échecs sont gérés au sein même du graphe. Tout nœud peut réessayer en cas d'échec avec un nombre défini de tentatives et un délai entre celles-ci ; chaque tentative est enregistrée dans l'[historique des exécutions](../reference/execution-history.md), et un nœud [Error Handler](../nodes/error-handler-node.md) s'exécute automatiquement lorsqu'un nœud échoue, de sorte que la reprise fait partie intégrante du workflow lui-même.

### Exécution parallèle en DAG

L'exécuteur de workflows de Heym repose sur un ordonnanceur en graphe orienté acyclique (DAG). Les nœuds indépendants s'exécutent automatiquement en parallèle, sans configuration requise.

- Les nœuds situés au même niveau de dépendance sont distribués simultanément à un pool de threads (`max_workers=8`)
- Dès qu'un nœud se termine, ses nœuds en aval sont planifiés
- Le [Nœud Merge](../nodes/merge-node.md) combine les résultats des branches parallèles
- Plusieurs exécutions de workflow se déroulent simultanément ; chaque exécution est totalement isolée

Le parallélisme est le comportement par défaut, déterminé par la structure du graphe.

Voir [Exécution parallèle](../reference/parallel-execution.md).

### Mise à l'échelle sur plusieurs instances

Pointez une seconde instance Heym vers la même base de données PostgreSQL et elle rejoint le système en tant que worker. Les exécutions en arrière-plan sont réparties entre les instances selon les pondérations que vous définissez ; un leader élu maintient les planifications, l'évaluation des alertes et la reprise après incident à travers un basculement, et chaque exécution enregistre l'instance qui l'a exécutée. Voir [Répartition de charge](../reference/cluster.md).

### Tableau Kanban agentique

L'onglet [Board](../tabs/board-tab.md) est un tableau Kanban intégré où les colonnes elles-mêmes exécutent des workflows. Une carte est une tâche agentique persistante qui porte le contexte, l'historique de conversation, l'état d'exécution, les sorties et les exécutions de workflow.

- **Chaînes de workflows par colonne** – Déplacer une carte dans une colonne déclenche la chaîne de workflows de cette colonne ; un **Agentic Kanban Model** (votre identifiant + modèle) mappe le contenu de la carte vers les entrées du workflow et retransforme les sorties en texte lisible
- **Pièces jointes des cartes** – Déposez des fichiers sur une carte ; les documents sont extraits en texte et les images sont transmises aux modèles compatibles vision avant chaque exécution
- **Canvas d'exécution en direct** – Ouvrez l'exécution active au sein d'une carte et observez-la s'exécuter sur le canvas réel du workflow, nœud par nœud
- **Partage en équipe** – Partagez des boards avec des utilisateurs ou des équipes avec des permissions de lecture/écriture ; les chaînes sur les boards partagés s'exécutent avec les identifiants du propriétaire, de sorte que les collaborateurs n'ont jamais besoin des leurs
- **Visibilité des échecs** – Les cartes en échec affichent un indicateur d'historique d'erreurs, et les exécutions de suivi peuvent se mettre en pause pour attendre des commentaires

Le board est une surface native de la plateforme : cartes, workflows, identifiants et exécutions en direct résident tous au même endroit.

### Heym Drive : stockage de fichiers intégré

L'onglet [Drive](../tabs/drive-tab.md) est un espace de stockage de fichiers intégré à la plateforme. Les fichiers générés par les skills et les workflows (PDF, DOCX, CSV, images) y sont déposés automatiquement, et les pièces jointes des cartes du board y sont également stockées.

- **Liens de partage** – Liens de téléchargement publics ou protégés par mot de passe (Basic Auth) avec expiration facultative et limites de téléchargement maximales
- **Partage en équipe** – Partagez des fichiers en lecture seule avec vos équipes, et supprimez tous les partages d'équipe en une seule action
- **Actions groupées** – Sélection multiple avec plages par shift-clic, regroupement des sélections dans un unique téléchargement ZIP, ou application d'un même paramètre de partage/mot de passe/suppression à plusieurs fichiers à la fois
- **Accès des agents** – Les skills peuvent choisir de lire les fichiers du Drive, de sorte qu'un agent peut travailler sur des documents que vous ou d'autres workflows avez produits

Les artefacts générés disposent d'un emplacement permanent et partageable au sein de la plateforme.

## Observer

### Traces LLM

L'onglet [Traces](../tabs/traces-tab.md) offre une observabilité complète pour chaque appel LLM :

- Payloads de requête et de réponse
- Temps par appel : `llm_ms`, `tools_ms`, `mcp_list_ms`
- Noms, arguments et résultats des appels d'outils
- Skills transmis au modèle

Le système de traces est conçu spécifiquement pour le débogage du comportement agentique, avec les payloads complets de requête et de réponse ainsi que le temps par appel.

### Suivi des coûts en tokens des LLM

Chaque appel LLM dans Heym est automatiquement chiffré. L'[onglet Exécutions](../tabs/traces-tab.md) affiche, pour chaque exécution, le nombre de tokens d'entrée et de sortie ainsi qu'un coût en USD en temps réel, calculé à partir d'une table de tarification synchronisée.

- **Coût par exécution** – Tokens d'entrée, tokens de sortie et total en USD affichés sur chaque ligne d'exécution
- **Analyse des coûts** – Les cartes de KPI et le graphique des coûts par modèle se mettent à jour selon la plage temporelle sélectionnée (1h / 24h / 7j / 30j / Tout)
- **Table des coûts LLM** – Une table système dans l'[onglet Tables de données](../tabs/datatable-tab.md) est alimentée depuis Helicone toutes les 24 heures ; il est possible de remplacer les prix ou d'ajouter des lignes personnalisées pour les modèles non encore répertoriés
- **Avertissement de prix manquant** – Les exécutions concernant des modèles sans entrée de tarification affichent un avertissement en ligne avec un lien direct vers la table des coûts

Chaque exécution porte son propre coût en USD, ventilé par modèle.

### Ouvrir des exécutions de production sur un Canvas en direct

Un workflow de production reste inspectable après son démarrage en dehors de l'éditeur. Ouvrez n'importe quelle entrée **En cours** depuis l'un des dialogues d'Historique, ou ouvrez l'exécution active dans une carte Agentic Kanban : Heym rattache alors l'éditeur de workflow habituel à cette exécution précise.

- Les nœuds déjà terminés apparaissent immédiatement avec leurs résultats
- Le nœud courant et les nœuds en aval en attente continuent de pulser à mesure que l'exécution progresse
- Le panneau Debug reçoit les mêmes résultats incrémentaux de nœuds qu'une exécution lancée depuis le canvas
- La sortie finale et les surbrillances d'exécution arrivent sans polling ni lancement d'une exécution en double
- La fermeture de l'éditeur ne fait que déconnecter l'observateur ; elle n'annule jamais le workflow de production

L'observateur utilise SSE, adossé à un instantané d'exécution inter-workers, ce qui lui permet de fonctionner pour les Triggers webhook, planification, chat, MCP, intégration et Board, même lorsqu'un autre worker backend détient l'exécution.

### OpenTelemetry, Analytics et Alertes

Heym émet des spans [OpenTelemetry](../reference/opentelemetry.md) pour chaque exécution de workflow, chaque exécution de nœud et chaque invocation d'outil d'Agent, exportés via OTLP/HTTP vers Jaeger, Grafana Tempo, Honeycomb, Datadog ou tout autre backend compatible.

L'[onglet Analytics](../tabs/analytics-tab.md) suit le nombre d'exécutions, le taux de réussite, la durée et les tendances par workflow. Les [Alertes](../tabs/alerts-tab.md) surveillent le nombre d'erreurs, la durée d'exécution, la dépense en tokens ou en USD et le volume d'exécutions sur une fenêtre temporelle, puis déclenchent un workflow de notification de votre choix, de sorte qu'une alerte atteint Slack, l'e-mail, Telegram ou tout autre canal accessible à un nœud.

## Évaluation

### Évaluations intégrées

L'[onglet Évaluation](../tabs/evals-tab.md) permet de définir des suites de tests et de les exécuter sur vos workflows d'agents :

- Créez des cas de test avec des entrées et des sorties attendues, ou générez-les à partir du prompt de la suite
- Exécutez une suite sur plusieurs modèles et comparez leurs sorties côte à côte
- Évaluez avec Exact Match, Contains ou LLM-as-Judge avec un modèle juge indépendant
- Consultez les résultats réussite/échec, réel vs attendu et l'historique des exécutions

Modifiez un prompt ou un modèle, relancez la suite et comparez les résultats avant que le changement n'atteigne la production.

## Contrôle

### Human-in-the-Loop (HITL)

Heym dispose d'un système [Human-in-the-Loop](../reference/human-in-the-loop.md) intégré qui permet aux agents de suspendre l'exécution, de demander une revue humaine et de reprendre exactement là où ils s'étaient arrêtés.

- **Points de contrôle d'Agent** – Activez `hitlEnabled` sur n'importe quel nœud Agent pour lui fournir un outil `request_human_review`. L'agent décide quand une décision nécessite une supervision humaine et appelle l'outil avec un résumé et un brouillon.
- **URL de revue publiques** – Chaque demande de revue génère un lien sécurisé à usage unique à l'adresse `/review/{token}` (TTL de 168 heures). Les relecteurs peuvent **accepter**, **modifier et continuer** ou **refuser** sans se connecter.
- **Instantanés d'exécution** – Le workflow gèle son état complet (historique de conversation, variables, résultats d'outils) afin de reprendre exactement là où il s'était mis en pause après la réponse du relecteur.
- **Branche de notification** – Une sortie optionnelle `review` permet de câbler un flux de notification (Slack, e-mail, webhook) déclenché lorsqu'une revue est demandée.
- **Politiques d'approbation des outils MCP** – Les consignes HITL écrites sont interprétées en périmètres d'approbation (`always` / `once` / `never`), ce qui permet à l'agent d'approuver automatiquement les outils à faible risque et d'escalader ceux à haut risque.
- **Points de contrôle multiples** – Une même exécution d'agent peut se mettre en pause pour revue plusieurs fois ; chaque point de contrôle est indépendant.

Les URL de revue publiques, la modification et continuation, la ramification de notification et la reprise basée sur instantané fonctionnent tous à partir du même point de contrôle d'agent.

Consultez [Human-in-the-Loop](../reference/human-in-the-loop.md) pour la référence complète.

### Garde-fous LLM

Heym dispose de [Garde-fous](../reference/guardrails.md) intégrés sur les nœuds [LLM](../nodes/llm-node.md) et [Agent](../nodes/agent-node.md), ce qui permet de bloquer tout contenu dangereux avant qu'une réponse de modèle n'atteigne les étapes en aval.

- **Bascule de sécurité au niveau du nœud** – Activez les garde-fous directement sur le nœud qui génère ou traite du contenu destiné à l'utilisateur
- **Large couverture de politiques** – Bloquez la violence, les discours haineux, le contenu sexuel, le contenu NSFW/les insultes, le harcèlement, les activités illégales, les demandes de données personnelles et les tentatives d'injection de prompt
- **Détection multilingue** – Appliquez les mêmes règles de sécurité en turc, anglais, arabe, espagnol et dans d'autres langues
- **Repli natif au workflow** – Lorsqu'un message est bloqué, le nœud lève une erreur de workflow typée que vous pouvez router via un [Error Handler](../nodes/error-handler-node.md)

La politique de sécurité réside directement dans la configuration du LLM et de l'Agent et s'intègre immédiatement à la ramification de workflow et à la gestion des erreurs.

### Accès, Identifiants et Audit

Les agents agissent avec de véritables identifiants ; l'accès fait donc partie intégrante de la gouvernance. Les [Identifiants](../reference/credentials.md) sont chiffrés au repos, masqués après leur création et partageables avec des utilisateurs ou des [équipes](../reference/teams.md) ; les équipes partagent également les workflows, les variables, les bases vectorielles et les fichiers Drive. L'[authentification unique](../reference/sso.md) se connecte à tout fournisseur OpenID Connect, notamment Okta, Entra ID, Keycloak, Auth0 et Google. La [piste d'audit](../reference/audit.md) enregistre chaque action liée à la sécurité avec son acteur, sa cible et son résultat, diffusée avec les logs de votre conteneur vers le collecteur de logs ou le SIEM que vous exploitez déjà.

### Auto-hébergé, vos données vous appartiennent

Heym s'exécute sur votre infrastructure. Les workflows, les identifiants, l'historique des exécutions et les traces résident dans votre propre base de données, et les appels aux modèles partent de vos serveurs vers le fournisseur que vous choisissez, ou vers un modèle que vous hébergez vous-même via Ollama ou vLLM. Pour les agents qui traitent des documents sensibles, des données clients ou des bases de connaissances propriétaires, il s'agit souvent d'une exigence absolue.

Heym est distribué sous **MIT License avec la condition Commons Clause**. Le code source est en source-available : vous pouvez l'utiliser, le modifier et l'auto-héberger librement. La Commons Clause restreint la revente du logiciel, y compris l'offre d'hébergement payant ou de services de conseil/support dont la valeur découle substantiellement de Heym. Pour une licence commerciale, des déploiements en entreprise ou un support professionnel, contactez [enterprise@heym.run](mailto:enterprise@heym.run).

## Exposer

### API et Streaming

Les workflows sont appelables via HTTP à `/api/workflows/{workflow_id}/execute`, qui renvoie du JSON, et à `/api/workflows/{workflow_id}/execute/stream`, qui diffuse les événements des nœuds sous forme de Server-Sent Events pendant le déroulement de l'exécution. Les deux partagent l'authentification au niveau du workflow, la limitation de débit et la mise en cache des réponses. Voir [Webhooks](../reference/webhooks.md) et [SSE Streaming](../reference/sse-streaming.md).

### Intégration MCP (Model Context Protocol)

Heym dispose d'un support natif de [MCP](../tabs/mcp-tab.md) des deux côtés :

- **En tant que client** : les Nœuds Agent se connectent à des serveurs MCP externes (Filesystem, Browserbase, outils personnalisés) via stdio ou SSE et consomment automatiquement leurs outils
- **En tant que serveur** : les workflows avec MCP activé deviennent des outils sur le serveur par défaut à `/api/mcp/sse`, ou sur des serveurs nommés disposant de leur propre URL et clé API, afin que Claude Desktop, Cursor et d'autres clients MCP puissent appeler directement vos workflows Heym

Les agents peuvent consommer plusieurs serveurs MCP simultanément, et tout workflow peut devenir un outil pour un client MCP externe.

### Portal : publier des workflows sous forme d'interfaces de Chat

La fonctionnalité [Portal](../reference/portal.md) transforme tout workflow en une interface de chat publique à `/chat/{slug}` :

- Authentification facultative avec des identifiants par utilisateur
- Exécution en streaming (progression des nœuds en temps réel)
- Prise en charge du téléversement de fichiers
- Historique des conversations multi-tours

Les équipes livrent des outils internes, des chatbots destinés aux clients et des formulaires propulsés par l'IA à partir d'un workflow et d'une URL, sans écrire le moindre code frontend.

### Tableaux de bord propulsés par les workflows

L'onglet [Dashboard](../tabs/dashboard-tab.md) est une surface de reporting construite par l'utilisateur, où chaque widget de graphique est propulsé par son propre workflow Heym masqué. Un widget peut appeler des API, interroger BigQuery, rechercher dans des bases RAG/vectorielles, exécuter des étapes LLM, transformer des lignes et se terminer par un [Nœud Chart Output](../nodes/chart-output-node.md). Vous pouvez créer des widgets manuellement, les générer avec l'IA, les affiner ultérieurement, mettre en cache les résultats et réorganiser la grille visuellement.

## Comparaison avec les outils d'automatisation de Workflow

De nombreuses équipes arrivent sur Heym en provenance d'outils d'automatisation de Workflow. Le tableau ci-dessous compare Heym à n8n, Zapier et Make.com sur les capacités qui comptent une fois les agents en production, et les notes de bas de page ci-dessous citent la documentation officielle qui étaye la comparaison. Pour un examen plus approfondi outil par outil, consultez les pages de comparaison sur [heym.run/compare](https://heym.run/compare).

| Capacité | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Nœud LLM intégré | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + branches de statut | ✓ | limité¹¹ | –¹¹ | limité¹¹ |
| Nœud Agent intégré (appel d'outils) | ✓ | ✓ | ✓ | ✓ |
| Orchestration multi-agents | ✓ | ✓ | limité | limité |
| Nœuds d'agent de codage (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| RAG / base vectorielle intégré | ✓ | ✓ | limité¹ | plugin² |
| Lecture / écriture WebSocket | ✓ | limité¹² | –¹³ | –¹⁴ |
| Générateur de Workflow en langage naturel | ✓ | limité³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Ouvrir une exécution en cours sur le canvas en direct | ✓ | limité¹⁹ | limité¹⁹ | –¹⁹ |
| Tableaux de bord propulsés par Workflow | ✓ | limité¹⁷ | limité¹⁷ | limité¹⁷ |
| Tableau Kanban agentique | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Système de Skills pour les agents | ✓ | – | – | – |
| Drive de fichiers intégré (liens de partage, équipes) | ✓ | limité²² | limité²² | –²² |
| Nœud d'automatisation de navigateur (Playwright) | ✓ | limité²³ | limité²³ | –²³ |
| Inspection des traces LLM | ✓ | limité⁴ | – | ✓ |
| Export de tracing OpenTelemetry | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| Suivi du coût des tokens LLM (USD) | ✓ | –¹⁵ | –¹⁵ | limité¹⁵ |
| Évaluations intégrées pour les Workflows IA | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | limité⁶ | limité⁷ |
| Garde-fous LLM | ✓ | ✓⁸ | ✓⁸ | limité⁸ |
| Compression automatique du contexte | ✓ | – | – | – |
| Exécution DAG parallèle | ✓ | limité⁹ | – | – |
| Auto-hébergeable, source disponible | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| DSL d'expressions pour les données dynamiques | ✓ | ✓ | limité | ✓ |

> **Notes de bas de page :** ¹ Zapier Knowledge Sources — aucun vector store exposé ni contrôle des embeddings. ² Make.com dispose de modules Pinecone/Qdrant mais d'aucun nœud RAG natif. ³ n8n AI Workflow Builder est une bêta cloud uniquement avec plafonds de crédits. ⁴ n8n affiche les étapes intermédiaires ; le traçage complet nécessite des outils tiers. ⁵ n8n prend en charge les approbations d'appels d'outils IA via le chat, l'e-mail et les canaux de collaboration, mais il ne capture pas et ne reprend pas l'exécution entière comme le fait Heym. ⁶ Zapier Human in the Loop prend en charge les approbations et la collecte de données au sein des Zaps, mais ce n'est pas un système de points de contrôle avec revue publique et reprise sur snapshot. ⁷ Make.com propose Human in the Loop en tant qu'application Enterprise avec demandes de revue et résultats adjusted/approved/canceled, mais cela reste limité par le forfait et moins agent-native. ⁸ n8n fournit un nœud Guardrails dédié, Zapier fournit AI Guardrails sur l'ensemble de ses produits IA, et Make.com documente des règles d'agent ainsi que des flux de revue mais aucune fonctionnalité de guardrails autonome comparable, c'est pourquoi Make est marqué comme limité. ⁹ n8n exécute séquentiellement par défaut ; le parallélisme nécessite des contournements via sous-workflows. ¹⁰ Sustainable Use License — auto-hébergement gratuit pour usage interne, redistribution commerciale restreinte. ¹¹ Au 22 avril 2026, la documentation officielle de n8n décrit le traitement par lots HTTP et les motifs loop/wait plutôt qu'une branche native de statut de lot LLM ; la documentation officielle de l'application ChatGPT de Zapier ne liste aucun trigger et seulement une API Request bêta générique ; et la page officielle d'intégration OpenAI de Make expose des actions par lots comme create/watch completed mais pas de nœud LLM natif à branchement sur statut, c'est pourquoi n8n/Make sont marqués comme limités et Zapier comme indisponible pour ce motif de workflow spécifique. ¹² La documentation officielle de n8n couvre les nœuds HTTP Webhook et HTTP Request ainsi que l'extensibilité Code/custom/community, mais je n'ai pas trouvé de nœud WebSocket trigger/send propriétaire, c'est pourquoi n8n est marqué comme limité. ¹³ La documentation officielle de Zapier couvre les webhooks entrants et les requêtes webhook/API sortantes via HTTP uniquement, pas d'étape native WebSocket trigger ou send. ¹⁴ La documentation officielle de Make couvre les modules Webhooks et les modules de requêtes HTTP(S), mais je n'ai pas trouvé de module natif WebSocket trigger ou send. ¹⁵ n8n ne dispose d'aucun suivi natif du coût en tokens LLM ; des workflows de contournement communautaires existent mais nécessitent une installation manuelle et des appels API post-exécution (demande de fonctionnalité ouverte en mai 2026). Zapier n'expose aux utilisateurs aucun décompte de tokens ni coût en USD par exécution ; les étapes IA consomment uniquement des tâches. Le tableau de bord des crédits de Make.com reflète partiellement la consommation de tokens pour l'IA hébergée par Make (depuis août 2025) mais les connexions via clé API tierce sont facturées à raison de 1 opération = 1 crédit sans décompte de tokens ; aucune ventilation en USD par exécution et par modèle n'est disponible. ¹⁶ Heym émet des spans OpenTelemetry natifs (un par exécution de workflow plus un par nœud) via OTLP/HTTP vers tout backend compatible, avec propagation du contexte de trace W3C et sans code d'instrumentation, configuré via les variables d'environnement `HEYM_OTEL_*` et désactivé par défaut. n8n dispose d'une intégration documentée de traçage OpenTelemetry pour les exécutions de workflow et de nœud. Zapier et Make.com ne documentent pas l'export OpenTelemetry de leurs exécutions de workflow/scénario au juin 2026. ¹⁷ n8n documente un tableau de bord Insights pour les métriques d'exécution en production, Zapier documente Zap History ainsi que Task Usage, et Make.com documente Scenario History ; ce sont des surfaces de monitoring/historique, pas des widgets de tableau de bord personnalisés alimentés par une logique de workflow arbitraire comme l'onglet Dashboard de Heym. ¹⁸ Heym Workflow Analyzer exécute le workflow lorsque c'est possible, lit le résultat de l'exécution et génère un rapport Markdown partagé et modifiable couvrant les axes d'amélioration, l'objectif et le comportement étape par étape. n8n documente AI Workflow Builder pour créer/affiner/déboguer des workflows, Zapier documente le dépannage IA pour les exécutions de Zap en erreur, et Make.com documente l'historique de scénario ainsi que les étapes de raisonnement de l'agent IA, mais leur documentation publique ne décrit pas le même document d'analyse de workflow partagé et conscient de l'exécution. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) liste les exécutions en cours et peut charger les données d'une exécution précédente dans l'éditeur, tandis que [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) expose un état running dans son éditeur. [Make Scenario History](https://help.make.com/scenario-history) documente le détail des exécutions et les logs. Leur documentation publique, consultée le 18 juillet 2026, ne décrit pas le flux exact de Heym : ouvrir une exécution de production arbitraire en cours depuis l'Historique ou une carte Kanban, restaurer son snapshot de nœud actuel, et continuer à recevoir l'animation des nœuds et les logs Debug sur le même canvas. ²⁰ Les nœuds [Codex](../nodes/codex-node.md) et [OpenCode Go](../nodes/opencode-go-node.md) de Heym exécutent un véritable CLI d'agent de codage dans un espace de travail Heym isolé sur un dépôt GitHub — clone, édition, production d'un diff, push d'une branche, ouverture d'une pull request — en tant qu'étape de workflow de premier ordre. Au 20 juillet 2026, aucun concurrent ne documente d'équivalent : le [nœud OpenAI](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) de n8n couvre les appels API chat/assistant, pas un agent de codage au niveau du dépôt, et la prise en charge native de Codex reste une demande communautaire ; le blog de Zapier documente la direction inverse — [Codex pilotant les outils Zapier via Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — et non Codex comme étape de Zap ; les modules OpenAI de Make.com exposent des actions completions/assistants/batch, pas un agent de codage qui clone des dépôts et ouvre des PR. ²¹ L'[onglet Board](../tabs/board-tab.md) de Heym est un tableau Kanban agentique intégré dont les colonnes exécutent des workflows et dont les cartes portent le contexte, l'historique de conversation, l'état d'exécution et les exécutions. n8n ([intégration Kanban Tool](https://n8n.io/integrations/kanban-tool/)), Zapier ([intégrations Kanban Tool](https://zapier.com/apps/kanbantool/integrations)) et Make.com ([intégration Kanban Tool](https://www.make.com/en/integrations/kanban-tool)) ne se connectent qu'à des applications kanban tierces telles que Kanban Tool, Wekan ou NocoDB ; aucun ne documente un tableau intégré qui exécute ses propres workflows, au 20 juillet 2026. ²² n8n stocke les données binaires d'exécution en interne (éventuellement sur un [stockage externe compatible S3](https://docs.n8n.io/hosting/scaling/external-storage/)) mais ne documente aucun espace de fichiers orienté utilisateur avec liens de partage ou partage d'équipe, c'est pourquoi il est marqué comme limité. [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) de Zapier traite les fichiers uniquement pendant la durée d'une exécution de Zap et [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) ne contient que de petites valeurs textuelles, c'est pourquoi Zapier est marqué comme limité. Les [data stores](https://help.make.com/l6du-data-stores) de Make.com contiennent des enregistrements structurés et sa [gestion de fichiers](https://help.make.com/working-with-files) fait transiter les fichiers entre applications sans stockage intégré persistant, c'est pourquoi Make est marqué comme indisponible. ²³ Le [nœud Playwright](../nodes/playwright-node.md) de Heym est une automatisation de navigateur propriétaire avec un mode visuel par étapes, des étapes générées par IA et un mode code complet. n8n n'offre que des packages communautaires tels que [n8n-playwright](https://github.com/toema/n8n-playwright) avec une [demande de fonctionnalité toujours ouverte pour des nœuds natifs d'automatisation de navigateur](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), c'est pourquoi il est marqué comme limité. Les Zapier Agents peuvent [naviguer et lire des pages via la navigation web et une extension Chrome](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension) mais Zapier ne documente aucune étape d'automatisation de navigateur scriptée, c'est pourquoi il est marqué comme limité. Make.com documente des modules HTTP et des applications de scraping tierces plutôt qu'un quelconque module natif d'automatisation de navigateur, au 20 juillet 2026.

## Ressources associées

- [Introduction](./introduction.md) – Présentation de la plateforme
- [Démarrage rapide](./quick-start.md) – Créez votre premier workflow
- [Analyse de workflow](../reference/workflow-analysis.md) – Générez des rapports de workflow partagés tenant compte des exécutions et des retours d'amélioration
- [Onglet Dashboard](../tabs/dashboard-tab.md) – Créez des tableaux de bord adossés à des workflows avec des widgets de graphiques générés par IA
- [Nœud Agent](../nodes/agent-node.md) – Nœud LLM avec appel d'outils, MCP et compétences
- [Architecture des agents](../reference/agent-architecture.md) – Sous-agents, orchestrateur et répartition des outils
- [Onglet Board](../tabs/board-tab.md) – Tableau Kanban agentique avec colonnes exécutant des workflows
- [Nœud Codex](../nodes/codex-node.md) – Exécutez l'agent de codage OpenAI Codex sur un dépôt GitHub
- [Nœud OpenCode Go](../nodes/opencode-go-node.md) – Agent de codage agnostique vis-à-vis du fournisseur dans un conteneur durci
- [Onglet Drive](../tabs/drive-tab.md) – Stockage de fichiers intégré avec liens de partage, équipes et actions groupées
- [Nœud Playwright](../nodes/playwright-node.md) – Automatisation de navigateur native avec étapes IA et mode code
- [Nœud RAG / Vector Store](../nodes/rag-node.md) – Recherche vectorielle et insertion de documents (Qdrant ou Postgres pgvector)
- [Assistant IA](../reference/ai-assistant.md) – Générateur de workflows en langage naturel
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Points de contrôle d'agent avec URL de révision publiques
- [Garde-fous](../reference/guardrails.md) – Bloquez les prompts dangereux avant qu'ils n'atteignent vos modèles
- [Onglet Traces](../tabs/traces-tab.md) – Observabilité des appels LLM
- [Onglet Évaluation](../tabs/evals-tab.md) – Suites de tests pour les workflows IA
- [Onglet Alertes](../tabs/alerts-tab.md) – Alertes par seuil sur les erreurs, la durée, le coût et le volume d'exécutions
- [Traçage OpenTelemetry](../reference/opentelemetry.md) – Exportez les spans d'exécution, de nœud et d'outil via OTLP
- [Répartition de charge](../reference/cluster.md) – Partagez les exécutions entre les instances avec basculement du leader
- [Authentification unique](../reference/sso.md) – Connectez-vous via n'importe quel fournisseur OpenID Connect
- [Journal d'audit](../reference/audit.md) – Actions liées à la sécurité avec acteur, cible et résultat
- [Portail](../reference/portal.md) – Publiez des workflows sous forme d'interfaces de chat publiques
- [Exécution parallèle](../reference/parallel-execution.md) – Exécution concurrente basée sur un DAG
- [Onglet MCP](../tabs/mcp-tab.md) – Configuration du serveur et du client MCP
