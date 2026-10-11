# Types de nœuds

Heym propose une variété de types de nœuds pour construire des workflows. Utilisez des [expressions](./expression-dsl.md) telles que `$input.text` et `$nodeLabel.field` dans la configuration des nœuds.

## Nœuds Trigger

| Nœud | Description | Sorties |
|------|-------------|---------|
| [Input](../nodes/input-node.md) | Point d'entrée textuel pour le workflow (HTTP/[webhook](./webhooks.md)) | 1 |
| [Cron](../nodes/cron-node.md) | Déclenchement selon une planification (expression cron) | 1 |
| [Telegram Trigger](../nodes/telegram-trigger-node.md) | Déclenchement lorsqu'une mise à jour webhook d'un bot Telegram arrive | 1 |
| [Slack Trigger](../nodes/slack-trigger-node.md) | Déclenchement lorsque Slack envoie un webhook Events API | 1 |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Déclenchement lorsque Discord envoie un webhook d'interaction d'application | 1 |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | Déclenchement lorsqu'un nouvel e-mail arrive dans une boîte IMAP | 1 |
| [Heym Trigger](../nodes/heym-trigger-node.md) | Déclenchement lorsque Heym publie un événement de plateforme (tableau groupé) | 1 |
| [WebSocket Trigger](../nodes/websocket-trigger-node.md) | Déclenchement depuis une connexion sortante vers un serveur WebSocket externe | 1 |
| [File Upload Trigger](../nodes/file-upload-trigger-node.md) | Génère un lien de téléversement à usage unique et démarre lorsqu'un fichier volumineux est téléversé | 1 |
| [RabbitMQ](../nodes/rabbitmq-node.md) | Déclenchement lorsqu'un message est reçu depuis une file d'attente | 1 |
| [Error Handler](../nodes/error-handler-node.md) | S'exécute lorsqu'un nœud rencontre une erreur (aucune arête entrante) | 1 |

Consultez la section [Triggers](./triggers.md) pour découvrir tous les points d'entrée.

## Nœuds IA

| Nœud | Description | Entrées | Sorties |
|------|-------------|--------|---------|
| [LLM](../nodes/llm-node.md) | Traite du texte avec un modèle de langage | 1 | 1 |
| [Decision](../nodes/decision-node.md) | Pose des questions typées à un modèle de décision et branche selon les probabilités retournées | 1 | 1 |
| [AI Agent](../nodes/agent-node.md) | LLM avec appel d'outils, compétences, MCP, [revue humaine](./human-in-the-loop.md) facultative et [graphe de mémoire persistante](./agent-persistent-memory.md) facultatif. Voir [Architecture des agents](./agent-architecture.md). | 1 | 1, plus une sortie `review` facultative |
| [Codex](../nodes/codex-node.md) | Exécute le CLI Codex local sur un dépôt GitHub à l'aide d'un token d'accès ChatGPT/Codex | 1 | 1, plus une sortie `question` |
| [OpenCode Go](../nodes/opencode-go-node.md) | Exécute le CLI OpenCode sur un dépôt GitHub dans un conteneur durci à l'aide d'une clé API de passerelle OpenCode Go | 1 | 1 |
| [MCP Call](../nodes/mcp-call-node.md) | Appelle directement un outil MCP spécifique sans qu'un LLM ne le sélectionne | 1 | 1 |
| [RAG / Vector Store](../nodes/rag-node.md) | Insère, met à jour (upsert), supprime ou recherche dans une [base vectorielle](../tabs/vectorstores-tab.md) Qdrant ou Postgres (pgvector) pour le RAG | 1 | 1 |

## Nœuds de logique

| Nœud | Description | Entrées | Sorties |
|------|-------------|--------|---------|
| [Condition](../nodes/condition-node.md) | Branche selon un if/else | 1 | 2 (true/false) |
| [Switch](../nodes/switch-node.md) | Achemine en faisant correspondre une valeur à des cas | 1 | n |
| [Merge](../nodes/merge-node.md) | Attend plusieurs entrées et les fusionne | n | 1 |
| [Loop](../nodes/loop-node.md) | Itère sur un tableau | 1 | 2 (loop/done) |

## Nœuds de données

| Nœud | Description | Entrées | Sorties |
|------|-------------|--------|---------|
| [Set](../nodes/set-node.md) | Transforme et mappe les données | 1 | 1 |
| [Converter](../nodes/converter-node.md) | Convertit les données entre formats (CSV, JSON, XML) et effectue l'OCR d'images ou de PDF vers du texte | 1 | 1 |
| [Code](../nodes/code-node.md) | Exécute du Python dans un sandbox jetable et isolé du réseau avec son propre requirements.txt | 1 | 1 |
| [Variable](../nodes/variable-node.md) | Définit ou récupère une variable (locale au workflow ou [globale](./global-variables.md)) | 1 | 1 |
| [Execute](../nodes/execute-node.md) | Appelle un autre workflow | 1 | 1 |
| [Heym](../nodes/heym-node.md) | Lit les workflows Heym et l'historique des exécutions | 1 | 1 |

## Nœuds d'intégration

| Nœud | Description | Entrées | Sorties |
|------|-------------|--------|---------|
| [HTTP](../nodes/http-node.md) | Effectuer des requêtes HTTP (cURL) | 0 ou 1 | 1 |
| [WebSocket Send](../nodes/websocket-send-node.md) | Se connecter à un WebSocket externe et envoyer un message | 1 | 1 |
| [Telegram](../nodes/telegram-node.md) | Envoyer des messages via un bot Telegram | 1 | 1 |
| [Slack](../nodes/slack-node.md) | Envoyer des messages Slack | 1 | 1 |
| [Discord](../nodes/discord-node.md) | Envoyer des messages via un Webhook Discord | 1 | 1 |
| [Send Email](../nodes/send-email-node.md) | Envoyer des e-mails via SMTP | 1 | 1 |
| [Redis](../nodes/redis-node.md) | Opérations Redis (set, get, hasKey, deleteKey) | 1 | 1 |
| [Grist](../nodes/grist-node.md) | Lire et écrire dans des feuilles de calcul Grist | 1 | 1 |
| [GitHub](../nodes/github-node.md) | Gérer les dépôts, utilisateurs, tickets, pull requests, revues, releases, workflows Actions et fichiers via l'API REST GitHub | 1 | 1 |
| [Jira](../nodes/jira-node.md) | Gérer les projets, tickets, commentaires, pièces jointes, utilisateurs, notifications et transitions de workflow Jira via l'API REST Jira | 1 | 1 |
| [Linear](../nodes/linear-node.md) | Gérer les équipes, projets, tickets, états de workflow et commentaires Linear via GraphQL | 1 | 1 |
| [Google Sheets](../nodes/google-sheets-node.md) | Lire et écrire dans Google Sheets via OAuth2 | 1 | 1 |
| [Google Drive](../nodes/google-drive-node.md) | Lister, télécharger, mettre à jour et supprimer des fichiers Google Drive via OAuth2 | 1 | 1 |
| [BigQuery](../nodes/bigquery-node.md) | Exécuter des requêtes SQL et insérer des lignes dans BigQuery | 1 | 1 |
| [Supabase](../nodes/supabase-node.md) | Interroger et modifier les tables Supabase via PostgREST | 1 | 1 |
| [ClickHouse](../nodes/clickhouse-node.md) | Exécuter des opérations SQL, CRUD et de comptage sur ClickHouse | 1 | 1 |
| [Notion](../nodes/notion-node.md) | Gérer les bases de données, sources de données, pages et blocs Notion | 1 | 1 |
| [Sentry](../nodes/sentry-node.md) | Gérer les organisations, projets, équipes, tickets, événements et releases Sentry | 1 | 1 |
| [Amazon S3](../nodes/amazon-s3-node.md) | Gérer les buckets et dossiers ; lister, téléverser, télécharger, copier et supprimer des objets | 1 | 1 |
| [DataTable](../nodes/datatable-node.md) | Lire et écrire dans les Tables de données Heym (stockage first-party) | 1 | 1 |
| [Drive](../nodes/drive-node.md) | Gérer les fichiers Drive : suppression, définition d'un mot de passe, TTL, nombre maximal de téléchargements, partage et retrait du partage d'équipe | 1 | 1 |

## Nœuds d'automatisation

| Nœud | Description | Entrées | Sorties |
|------|-------------|--------|---------|
| [Crawler](../nodes/crawler-node.md) | Extraire le contenu de pages web avec FlareSolverr | 1 | 1 |
| [Playwright](../nodes/playwright-node.md) | Automatisation de navigateur avec étape IA et Auto Heal | 1 | 1 |

## Nœuds utilitaires

| Nœud | Description | Entrées | Sorties |
|------|-------------|--------|---------|
| [Wait](../nodes/wait-node.md) | Retarder l'exécution | 1 | 1 |
| [Output](../nodes/output-node.md) | Endpoint de sortie | 1 | 1 |
| [JSON output mapper](../nodes/json-output-mapper-node.md) | Mapper des champs vers un objet JSON ; seul terminal = corps de premier niveau du Webhook ou de l'exécution | 1 | 0 |
| [HTML output mapper](../nodes/html-output-mapper-node.md) | Rendre une page HTML ; seul terminal = le Webhook répond en text/html | 1 | 0 |
| [Chart Output](../nodes/chart-output-node.md) | Sortie de widget de tableau de bord terminal qui mappe les lignes en amont vers des payloads de graphique | 1 | 0 |
| [Sticky Note](../nodes/sticky-note-node.md) | Ajouter des notes markdown sur le canvas (non exécuté) | 0 | 0 |
| [Console Log](../nodes/console-log-node.md) | Journaliser dans la console du backend | 1 | 1 |
| [Disable Node](../nodes/disable-node.md) | Désactiver un autre nœud du workflow | 1 | 1 |
| [Enable Node](../nodes/enable-node.md) | Activer un nœud désactivé du workflow | 1 | 1 |
| [Throw Error](../nodes/throw-error-node.md) | Arrêter le workflow avec une réponse d'erreur | 1 | 0 |

## Nœuds de plugin

Les nœuds de plugin sont fournis par les plugins installés sur l'instance. Chaque plugin installé apparaît dans la palette sous **Plugins** avec son propre nom ; en interne, il correspond à l'un de ces deux types de nœuds.

| Nœud | Description | Entrées | Sorties |
|------|-------------|--------|---------|
| [Plugin](../nodes/plugin-node.md) | Action personnalisée fournie par un plugin installé | 1 | 1 |
| [Plugin Trigger](../nodes/plugin-trigger-node.md) | Trigger personnalisé fourni par un plugin installé | 0 | 1 |

## Associé

- [Fonctionnalités du Canvas](./canvas-features.md) – Data pin, journaux d'exécution, activation/désactivation, extraction vers un sous-workflow
- [Nœud Agent](../nodes/agent-node.md) – Référence détaillée du nœud Agent IA
- [Architecture de l'Agent](./agent-architecture.md) – Sous-agents, orchestrateur, compétences, MCP, appel d'outils
- [Mémoire persistante de l'Agent](./agent-persistent-memory.md) – Graphe de connaissances par nœud, partage et extraction en arrière-plan
- [Human-in-the-Loop](./human-in-the-loop.md) – Mettre en pause la sortie de l'agent pour approbation humaine
- [DSL d'expression](./expression-dsl.md) – Référencer des données dans la configuration d'un nœud
- [Boîte de dialogue d'évaluation d'expression](./expression-evaluation-dialog.md) – Éditeur extensible avec aperçu en direct du backend
- [Trigger de téléversement de fichier](../nodes/file-upload-trigger-node.md) – Accepter des téléversements multipart volumineux via des liens à usage unique
- [Trigger WebSocket](../nodes/websocket-trigger-node.md) – Trigger de socket sortant en temps réel
- [Envoi WebSocket](../nodes/websocket-send-node.md) – Pousser des messages vers des sockets externes
- [Structure de workflow](./workflow-structure.md) – Format JSON pour les nœuds et les arêtes
- [Triggers](./triggers.md) – Tous les points d'entrée de workflow
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter des clés API pour les nœuds LLM, HTTP et autres
- [Partage d'identifiants](./credentials-sharing.md) – Partager des identifiants avec d'autres utilisateurs
- [Portal](./portal.md) – Exposer des workflows sous forme d'interfaces de chat publiques
- [Onglet Bases vectorielles](../tabs/vectorstores-tab.md) – Créer des bases vectorielles pour les nœuds RAG
