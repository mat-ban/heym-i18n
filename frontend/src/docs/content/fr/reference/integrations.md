# Intégrations tierces

Heym se connecte aux services externes via des **identifiants**. Chaque type d'identifiant stocke les détails de connexion à un service et peut être réutilisé sur plusieurs nœuds et workflows. Consultez [Identifiants](./credentials.md) pour un aperçu.

Ajoutez des identifiants dans [Paramètres → Identifiants](../tabs/credentials-tab.md). Toutes les valeurs sont chiffrées au repos. Les identifiants peuvent être [partagés](./credentials-sharing.md) avec d'autres utilisateurs ou des [Équipes](./teams.md).

Certains nœuds d'intégration ne nécessitent **pas** d'identifiants. [WebSocket Trigger](../nodes/websocket-trigger-node.md) et [WebSocket Send](../nodes/websocket-send-node.md) se connectent à des sockets externes à l'aide de l'URL, des en-têtes et des sous-protocoles configurés directement sur le nœud.

## Types d'identifiants en un coup d'œil

| Type | Utilisé par | Champs clés |
|------|---------|------------|
| **OpenAI** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md) | `api_key` |
| **OpenAI Codex** | [Codex](../nodes/codex-node.md) | `access_token` |
| **OpenCode Go** | [OpenCode Go](../nodes/opencode-go-node.md) | `api_key`, `base_url` facultatif |
| **Google** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key` |
| **GitHub** | [GitHub](../nodes/github-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) | `api_key`, `base_url` facultatif |
| **Jira** | [Nœud Jira](../nodes/jira-node.md) | `api_token`, `base_url`, `deployment`, `auth_mode`, `email` (Basic auth uniquement), `api_version` facultatif |
| **Linear** | [Nœud Linear](../nodes/linear-node.md) | `api_key`, ou `client_id` + `client_secret` OAuth2 |
| **Sentry** | [Nœud Sentry](../nodes/sentry-node.md) | `api_token`, `base_url` facultatif |
| **Custom** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md) | `api_key`, `base_url` |
| **Decision Model** | [Decision](../nodes/decision-node.md), [Évaluations](../tabs/evals-tab.md) (juge LLM-as-Judge) | `base_url`, `api_key` facultatif |
| **Model Router (Auto Model)** | [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | un identifiant de modèle de décision, plus des options de modèle référençant vos autres identifiants |
| **Cohere** | Embeddings | `api_key` |
| **RAG: Qdrant + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `qdrant_host`, `openai_api_key` |
| **RAG: Psql + OpenAI** | [RAG](../nodes/rag-node.md), Vectorstores | `openai_api_key` (vecteurs stockés dans le Postgres propre à Heym via pgvector) |
| **RAG: Custom Embeddings** | [RAG](../nodes/rag-node.md), Vectorstores | `embedding_base_url`, `embedding_model`, `embedding_dimensions`, `db_type`, `embedding_api_key` facultatif, plus `qdrant_host` lorsque `db_type` vaut `qdrant` |
| **Grist** | [Nœud Grist](../nodes/grist-node.md) | `api_key`, `server_url` |
| **Google Sheets** | [Nœud Google Sheets](../nodes/google-sheets-node.md) | `client_id`, `client_secret` + consentement OAuth2 |
| **Google Drive** | [Nœud Google Drive](../nodes/google-drive-node.md) | `client_id`, `client_secret` + consentement OAuth2 (portée Drive complète) |
| **BigQuery** | [Nœud BigQuery](../nodes/bigquery-node.md) | `client_id`, `client_secret` + consentement OAuth2 |
| **Supabase** | [Nœud Supabase](../nodes/supabase-node.md) | `supabase_url`, `supabase_key`, `supabase_schema` facultatif |
| **ClickHouse** | [Nœud ClickHouse](../nodes/clickhouse-node.md) | `host`, `port`, `username`, `password`, `database`, `secure` |
| **Notion** | [Nœud Notion](../nodes/notion-node.md) | `api_token`, ou `client_id` + `client_secret` OAuth |
| **Amazon S3** | [Nœud Amazon S3](../nodes/amazon-s3-node.md) | `aws_access_key_id`, `aws_secret_access_key`, `aws_region` |
| **SMTP** | [Send Email](../nodes/send-email-node.md) | `host`, `port`, `email`, `password` |
| **IMAP** | [Nœud IMAP Trigger](../nodes/imap-trigger-node.md) | `imap_host`, `imap_port`, `imap_username`, `imap_password` |
| **Telegram** | [Nœud Telegram Trigger](../nodes/telegram-trigger-node.md), [Nœud Telegram](../nodes/telegram-node.md) | `bot_token`, `secret_token` facultatif |
| **Discord** | [Nœud Discord](../nodes/discord-node.md) | `webhook_url` |
| **Discord Trigger** | [Nœud Discord Trigger](../nodes/discord-trigger-node.md) | `public_key` |
| **RabbitMQ** | [Nœud RabbitMQ](../nodes/rabbitmq-node.md) | `rabbitmq_host`, `rabbitmq_username`, `rabbitmq_password` |
| **Redis** | [Nœud Redis](../nodes/redis-node.md) | `host`, `port`, `password` |
| **Slack** | [Nœud Slack](../nodes/slack-node.md) | `webhook_url` |
| **Slack Trigger** | [Nœud Slack Trigger](../nodes/slack-trigger-node.md) | `signing_secret` |
| **Bearer** | [Nœud HTTP](../nodes/http-node.md) | `token` |
| **Header** | [Nœud HTTP](../nodes/http-node.md) | `header_key`, `header_value` |
| **FlareSolverr** | [Nœud Crawler](../nodes/crawler-node.md) | `flaresolverr_url` |

---
## GitHub

L'identifiant GitHub stocke un token d'accès personnel (PAT) GitHub afin que les workflows puissent appeler l'API REST GitHub via le [nœud GitHub](../nodes/github-node.md), transmettre le token à des serveurs MCP tels que `@modelcontextprotocol/server-github`, ou l'utiliser depuis le [nœud HTTP](../nodes/http-node.md) pour des appels REST personnalisés.

### Champs requis

| Champ | Description |
|-------|-------------|
| `api_key` | Token d'accès personnel GitHub (PAT fine-grained `github_pat_...` ou PAT classique `ghp_...`) |

### Champs facultatifs

| Champ | Description |
|-------|-------------|
| `base_url` | URL de base de l'API GitHub pour GitHub Enterprise Server (par exemple `https://github.example.com/api/v3`) |

### Remarques

- Les tokens d'accès personnels fine-grained sont recommandés lorsque cela est possible, car ils peuvent être limités à des dépôts et des permissions spécifiques.
- Laissez `base_url` vide pour GitHub.com. Pour GitHub Enterprise Server, utilisez l'endpoint complet de l'API REST
  incluant `/api/v3` (par exemple `https://github.example.com/api/v3`), et non la
  racine de l'interface web du serveur telle que `https://github.example.com`.
- Cet identifiant ne modélise actuellement que l'authentification basée sur un PAT. Pour accéder aux dépôts d'une organisation, utilisez un PAT auquel les permissions d'organisation/dépôt requises ont été accordées.
- Les tokens d'installation GitHub App et les flux de configuration GitHub App ne sont pas pris en charge nativement dans l'interface Heym aujourd'hui.
- Privilégiez le [nœud GitHub](../nodes/github-node.md) pour les opérations natives sur les dépôts, utilisateurs, issues, pull requests, reviews, releases, workflows Actions, trafic et fichiers. Utilisez le [nœud HTTP](../nodes/http-node.md) uniquement lorsque vous avez besoin d'endpoints ou de payloads que le nœud GitHub ne couvre pas.
- Utilisez le [nœud Agent](../nodes/agent-node.md) avec MCP en transmettant `$credentials.YourGitHubCredential` dans une variable d'environnement de connexion MCP telle que `GITHUB_PERSONAL_ACCESS_TOKEN`.
- L'API REST GitHub attend généralement `Authorization: Bearer <token>` ainsi que `Accept: application/vnd.github+json`.
- Lors de la modification d'un identifiant GitHub, laisser le `base_url` GitHub Enterprise vide préserve
  l'endpoint existant. Saisissez une nouvelle URL uniquement lorsque vous souhaitez modifier cet endpoint.

### Utilisé par

- [Nœud GitHub](../nodes/github-node.md)
- [Nœud Codex](../nodes/codex-node.md)
- [Nœud Agent](../nodes/agent-node.md)
- [Nœud HTTP](../nodes/http-node.md)

---

## Modèle de décision

Un modèle de décision répond à des questions typées portant sur un état et renvoie des probabilités plutôt que du texte. Le Jev de TypeSafe en est l'implémentation de référence ; tout endpoint acceptant le même corps `{model, state, questions}` fonctionne, et le nœud [Decision](../nodes/decision-node.md) peut envoyer un corps rédigé manuellement pour un endpoint qui ne le prend pas en charge.

### Champs requis

- `base_url` – l'endpoint, par exemple `https://api.typesafe.ai`. Heym ajoute `/v1/systemone`.

### Champs facultatifs

- `api_key` – envoyé en tant que `Authorization: Bearer`. Les endpoints ne nécessitant aucune clé peuvent laisser ce champ vide.

### Remarques

- **Test Connection** envoie une petite question pour confirmer que l'endpoint et la clé fonctionnent.
- La modification d'un identifiant conserve la clé stockée lorsque le champ de clé est laissé vide.
- Les requêtes sortantes vers des adresses privées et de bouclage sont bloquées par défaut ; un endpoint auto-hébergé sur `localhost` ou sur une plage privée nécessite donc `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.
- Ces modèles sont absents des tables de tarification LLM synchronisées par Heym, la colonne Cost dans les [Traces](../tabs/traces-tab.md) reste donc vide. Les décomptes de tokens sont toutefois enregistrés.

### Utilisé par

- [Decision](../nodes/decision-node.md)
- [Évaluations](../tabs/evals-tab.md) – évalue les réponses `LLM-as-Judge` par rapport à la sortie attendue

## OpenAI Codex

L'identifiant OpenAI Codex authentifie le [nœud Codex](../nodes/codex-node.md). Il est distinct de l'identifiant de clé API OpenAI utilisé par les nœuds LLM, Agent et RAG.

### Modes d'authentification

| Mode | Description |
|------|-------------|
| **Sign in with ChatGPT** (recommandé) | Connexion OAuth (PKCE) qui utilise votre abonnement ChatGPT Plus/Pro, ce qui permet aux exécutions d'éviter les coûts API par token. Heym stocke et actualise automatiquement le bundle de tokens. |
| **Access token** | Un `access_token` ChatGPT/Codex transmis uniquement au processus local de la CLI Codex. |

### Remarques

- Les clés API sont rejetées pour ce type d'identifiant.
- Les tokens Codex ne sont pas exposés via `$credentials.Name`.
- Le nœud Codex nécessite également un identifiant GitHub pour le clonage de dépôt, le push de branche et la création de draft PR.

### Utilisé par

- [Nœud Codex](../nodes/codex-node.md)

## OpenCode Go

L'identifiant OpenCode Go authentifie le [nœud OpenCode Go](../nodes/opencode-go-node.md). Il stocke une clé API de passerelle OpenCode Go (provenant de [opencode.ai/go](https://opencode.ai/go)) ainsi qu'une URL de base de passerelle facultative.

### Champs

| Champ | Description |
|-------|-------------|
| **API Key** | Clé API de la passerelle OpenCode Go (requise). |
| **Gateway Base URL** | Facultatif ; par défaut `https://opencode.ai/zen/go/v1`. À remplacer uniquement pour une passerelle auto-hébergée ou proxifiée. |
### Notes

- La clé API est transmise uniquement au processus OpenCode CLI à l'intérieur d'un conteneur durci.
- Le nœud OpenCode Go nécessite également un identifiant GitHub pour le clonage de dépôt, le push de branche et la création de pull request. Le token GitHub n'est jamais placé à l'intérieur du conteneur sandbox.

### Utilisé par

- [Nœud OpenCode Go](../nodes/opencode-go-node.md)

---

## Linear

L'identifiant Linear prend en charge soit une clé API personnelle, soit OAuth2 pour le
[nœud Linear](../nodes/linear-node.md). Heym envoie des requêtes GraphQL natives à Linear pour les métadonnées
d'espace de travail, les projets, les tickets et les commentaires.

### Configuration

Choisissez un mode d'authentification :

**Clé API personnelle**

1. Dans Linear, ouvrez **Settings → Security & Access → Personal API keys**.
2. Créez une clé avec accès à l'espace de travail que vous souhaitez automatiser.
3. Collez la clé dans un identifiant Linear dans Heym et utilisez **Test Connection** pour la vérifier.

**OAuth2**

1. Créez une application OAuth Linear.
2. Enregistrez `{FRONTEND_URL}/api/credentials/linear/oauth/callback` comme URI de redirection.
3. Dans le Dashboard Heym → **Identifiants** → **Nouveau** → type **Linear**.
4. Choisissez **OAuth2**, saisissez le Client ID et le Client Secret, puis cliquez sur **Connect**.

### Champs requis

| Mode | Champ | Description |
|------|-------|-------------|
| Clé API personnelle | `api_key` | Clé API personnelle Linear, généralement préfixée par `lin_api_` |
| OAuth2 | `client_id` | Client ID de l'application OAuth Linear |
| OAuth2 | `client_secret` | Client Secret de l'application OAuth Linear |

Les tokens OAuth (`access_token`, `refresh_token`, `token_expiry`) sont stockés et rafraîchis automatiquement.

### Notes

- Les clés API personnelles et les tokens OAuth agissent en tant qu'utilisateur Linear qui les a créés ou autorisés.
- OAuth Linear utilise les scopes `read,write,issues:create,comments:create`.
- Utilisez **Test Connection** dans la boîte de dialogue d'identifiant pour vérifier la clé API ou le token OAuth auprès de l'API Linear.
- Utilisez List Teams et List Projects dans le nœud Linear pour découvrir les UUIDs avant de créer ou filtrer des tickets.
- Utilisez List Workflow States et List Team Members pour découvrir les UUIDs d'état et d'assigné pour les mises à jour.
- Effectuez la rotation d'une clé API en modifiant l'identifiant et en saisissant la valeur de remplacement. Si vous effectuez la rotation des secrets d'application OAuth, reconnectez l'identifiant via **Connect**.

### Utilisé par

- [Nœud Linear](../nodes/linear-node.md)

---

## Jira

L'identifiant Jira stocke les identifiants Jira Basic auth ou un jeton d'accès personnel Data Center, l'URL de base du site Jira, le mode de déploiement et la version optionnelle de l'API REST pour le [nœud Jira](../nodes/jira-node.md). Utilisez `cloud` pour Jira Cloud ou `data_center` pour Jira Data Center / Server.

### Configuration

**Jira Cloud**

1. Dans les paramètres du compte Atlassian, créez un token API.
2. Dans le Dashboard Heym → **Identifiants** → **Nouveau** → type **Jira**.
3. Saisissez l'email Atlassian, le token API et l'URL du site Jira telle que `https://your-domain.atlassian.net`.
4. Utilisez **Test Connection** pour vérifier l'identifiant.

**Jira Data Center / Server**

1. Sélectionnez **Jira Data Center / Server** comme déploiement.
2. Choisissez une méthode d'authentification. **Nom d'utilisateur et mot de passe** utilise Basic auth. **Personal Access Token** utilise `Authorization: Bearer <token>` et nécessite Jira Data Center / Server 8.14 ou ultérieur. Créez le jeton sous **Profil → Personal Access Tokens** dans Jira.
3. Saisissez le nom d'utilisateur et le mot de passe Jira, ou collez le jeton d'accès personnel (aucun nom d'utilisateur n'est requis).
4. Saisissez l'URL du site Jira, par exemple `https://jira.example.com`.
5. Utilisez **Test Connection** pour vérifier l'identifiant.

### Champs

| Champ | Description |
| --- | --- |
| `auth_mode` | `basic` (par défaut si absent) ou `pat`. `pat` n'est valide qu'avec `data_center` |
| `email` | E-mail du compte Atlassian Jira Cloud ou nom d'utilisateur Jira Data Center / Server. Non utilisé en mode `pat` |
| `api_token` | Jeton d'API Atlassian Jira Cloud, mot de passe Jira Data Center / Server pour Basic auth ou jeton d'accès personnel Data Center en mode `pat` |
| `base_url` | URL de base du site Jira |
| `deployment` | `cloud` pour Jira Cloud ou `data_center` pour Jira Data Center / Server |
| `api_version` | Version de l'API REST ; par défaut `3` pour Jira Cloud. Data Center / Server utilise la v2 |

### Notes

- Le nœud Jira envoie les descriptions de tickets et les commentaires sous forme de documents texte
  Atlassian Document Format pour l'API REST Jira Cloud v3. Les identifiants Data Center / Server envoient du texte brut.
- Data Center / Server prend en charge Basic auth par nom d'utilisateur/mot de passe et l'authentification par jeton d'accès personnel (PAT) à l'aide du schéma Bearer. L'authentification PAT nécessite Jira Data Center / Server 8.14 ou ultérieur.
- L'upload de pièces jointes accepte un contenu base64 ou data URL et est soumis à la limite de taille de fichier de la plateforme (99 Mo par défaut). Le téléchargement de pièces jointes peut renvoyer un contenu base64 lorsqu'il est activé.
- La création, la suppression d'utilisateurs et la notification de tickets nécessitent que le compte Jira authentifié dispose des permissions pertinentes sur le site ou l'organisation Jira.
- Utilisez List Projects, Search Issues et List Transitions pour découvrir les clés de projet, les clés de ticket et les IDs de transition.
- Pour les endpoints personnalisés non couverts par le nœud Jira, utilisez le [nœud HTTP](../nodes/http-node.md) avec Jira Basic Auth (`email:api_token` pour Cloud ou `username:password` pour Data Center / Server) ou PAT Bearer auth (`Authorization: Bearer <token>` pour Data Center / Server). Vous pouvez également utiliser un identifiant Header avec l'en-tête `Authorization` approprié.

Voir aussi :

- [Nœud Jira](../nodes/jira-node.md)
- [Identifiants](./credentials.md)

---

## Sentry

L'identifiant Sentry stocke un token d'authentification pour le [nœud Sentry](../nodes/sentry-node.md). Heym utilise l'API REST de Sentry pour les opérations sur les organisations, projets, équipes, tickets, événements et releases.
### Champs obligatoires

| Champ | Description |
|-------|-------------|
| `api_token` | Token d'authentification Sentry disposant d'un accès aux organisations et projets que vous automatisez |

### Champs facultatifs

| Champ | Description |
|-------|-------------|
| `base_url` | URL racine facultative pour une instance Sentry auto-hébergée, par exemple `https://sentry.example.com` |

### Remarques

- Laissez `base_url` vide pour Sentry SaaS.
- Utilisez **Test Connection** pour confirmer que le token peut lister les organisations visibles.
- Pour des appels REST personnalisés, utilisez `$credentials.YourSentryCredential` comme bearer token.

### Utilisé par

- [Nœud Sentry](../nodes/sentry-node.md)

---

## Qdrant

[Qdrant](https://qdrant.tech) est une base de données vectorielle open source utilisée pour la recherche sémantique et le RAG (Retrieval Augmented Generation).

### Champs obligatoires

| Champ | Description |
|-------|-------------|
| `qdrant_host` | URL complète de votre instance Qdrant (par ex. `http://localhost:6333` ou un endpoint cloud) |
| `openai_api_key` | Clé API OpenAI utilisée pour générer les embeddings lors de l'indexation et de la recherche de documents |

### Remarques

- Les collections Qdrant sont gérées depuis l'onglet [Bases vectorielles](../tabs/vectorstores-tab.md). Chaque base vectorielle correspond à une collection Qdrant.
- Le [Nœud RAG](../nodes/rag-node.md) utilise une base vectorielle (qui référence un identifiant Qdrant) — il ne référence pas directement l'identifiant.
- Si votre instance Qdrant nécessite une clé API, incluez-la dans la valeur de `qdrant_host` ou configurez Qdrant en conséquence ; l'intégration actuelle ne dispose pas d'un champ dédié à la clé API Qdrant.
- Qdrant auto-hébergé : utilisez l'[image Docker officielle](https://hub.docker.com/r/qdrant/qdrant) et exposez le port `6333`.

### Utilisé par

- [Nœud RAG](../nodes/rag-node.md) (via une base vectorielle)
- [Onglet Bases vectorielles](../tabs/vectorstores-tab.md)

## Embeddings personnalisés (RAG)

Par défaut, les embeddings RAG proviennent d'OpenAI. Un identifiant **RAG: Custom Embeddings** pointe à la place vers n'importe quel endpoint d'embeddings compatible OpenAI — Ollama, vLLM, Text Embeddings Inference, LM Studio, Together ou une passerelle hébergée — et nomme la base vectorielle dans laquelle il écrit.

### Champs obligatoires

| Champ | Description |
|-------|-------------|
| `embedding_base_url` | URL de l'endpoint incluant le chemin `/v1`, par ex. `http://localhost:11434/v1` |
| `embedding_api_key` | Facultatif. Les serveurs locaux ne nécessitent généralement aucune clé |
| `embedding_model` | Nom du modèle tel que l'endpoint l'attend, par ex. `nomic-embed-text` |
| `embedding_dimensions` | Largeur du vecteur renvoyé par le modèle (par défaut `1536`) |
| `embedding_request_dimensions` | Facultatif. Demande à l'endpoint de renvoyer `embedding_dimensions` au lieu de la largeur native du modèle |
| `db_type` | `qdrant` ou `pgvector` |
| `qdrant_host`, `qdrant_port`, `qdrant_api_key` | Connexion Qdrant, obligatoire lorsque `db_type` vaut `qdrant` |

### Remarques

- **Qdrant accepte n'importe quel nombre de dimensions.** Chaque collection est créée avec la largeur déclarée par cet identifiant, le champ Dimensions est donc librement modifiable.
- **Postgres (pgvector) exige exactement 1536 dimensions.** Sa colonne est un `vector(1536)` fixe, le champ Dimensions est donc figé à 1536 et un identifiant déclarant une autre largeur est rejeté à l'enregistrement.
- **Réduction pour pgvector.** Lorsque la base est Postgres, la boîte de dialogue propose *Ask the endpoint to return 1536 dimensions*. Cela envoie le paramètre de requête `dimensions`, que les modèles entraînés avec des représentations Matryoshka (OpenAI `text-embedding-3-*`, `nomic-embed-text-v1.5`, `jina-v3` et similaires) honorent en renvoyant un vecteur raccourci mais toujours pertinent. Les endpoints qui ne prennent pas en charge ce paramètre rejettent la requête, et ceux qui l'acceptent sans l'appliquer produisent une erreur explicite indiquant la largeur réellement renvoyée. Heym ne tronque jamais lui-même les vecteurs, car découper la sortie d'un modèle non Matryoshka dégrade silencieusement la qualité de la recherche. L'option n'est pas proposée pour Qdrant, qui peut dimensionner une collection à n'importe quelle largeur.
- Utilisez **Test Connection** dans la boîte de dialogue de l'identifiant pour générer l'embedding d'une chaîne de test et voir la largeur réellement renvoyée par le modèle avant de créer une base.
- Le paramètre de requête `dimensions` n'est envoyé qu'à OpenAI lui-même, car la plupart des serveurs compatibles OpenAI rejettent les paramètres inconnus. La largeur native du modèle est quant à elle validée par rapport à l'identifiant.
- Les identifiants existants **RAG: Qdrant + OpenAI** et **RAG: Psql + OpenAI** restent inchangés et continuent de fonctionner.

### Utilisé par

- [Nœud RAG](../nodes/rag-node.md) (via une base vectorielle)
- [Onglet Bases vectorielles](../tabs/vectorstores-tab.md)

## Postgres (pgvector)

Heym peut également stocker des vecteurs **au sein de sa propre base de données Postgres** grâce à l'extension [pgvector](https://github.com/pgvector/pgvector) — aucun service vectoriel externe n'est requis. Créez un identifiant **RAG: Psql + OpenAI** et utilisez-le lors de la création d'une base vectorielle, puis sélectionnez **Postgres (pgvector)** dans la liste déroulante Database du Nœud RAG.

### Champs obligatoires

| Champ | Description |
|-------|-------------|
| `openai_api_key` | Clé API OpenAI utilisée pour générer les embeddings lors de l'indexation et de la recherche de documents |
### Notes

- Aucun hôte/port n'est nécessaire — les vecteurs sont écrits dans la base de données propre à Heym ; Heym ne se connecte jamais à une autre base de données.
- Toutes les fonctionnalités RAG disponibles avec Qdrant (insertion, recherche, filtres de métadonnées, reranking Cohere, clonage, partage) fonctionnent de manière identique avec le backend Postgres.
- Nécessite l'extension `vector`. Heym conserve l'image officielle `postgres:16` inchangée (ainsi les données existantes ne sont jamais touchées) et **installe automatiquement le paquet `postgresql-16-pgvector` au démarrage** — `run.sh`, `deploy.sh` et `run_e2e.sh` gèrent tous cela. L'installation n'est pas bloquante : si elle ne peut pas s'exécuter (par exemple, absence de réseau), le RAG Qdrant continue de fonctionner et le backend Postgres reste inactif (la migration ignore la table proprement).
- Si vous exécutez l'image mono-conteneur publiée (`ghcr.io/heymrun/heym`) contre **votre propre Postgres externe**, cette base de données doit prendre en charge l'extension `vector` (Heym ne peut pas l'installer dans une base de données qu'il ne gère pas). Sans cela, la création ou l'import vers un vector store Postgres renvoie un message clair et le RAG Qdrant continue de fonctionner.

### Utilisé par

- [Nœud RAG](../nodes/rag-node.md) (via vector store)
- [Onglet Vectorstores](../tabs/vectorstores-tab.md)

---

## Grist

[Grist](https://www.getgrist.com) est un hybride tableur/base de données qui prend en charge les données structurées et les formules. L'identifiant Grist permet à Heym de lire et d'écrire dans les documents Grist.

### Champs requis

| Champ | Description |
|-------|-------------|
| `api_key` | Clé API Grist (disponible dans **Profile → API Key** sur votre instance Grist) |
| `server_url` | URL de base de votre serveur Grist (par exemple `https://docs.getgrist.com` pour Grist Cloud, ou votre URL auto-hébergée) |

### Notes

- Le [Nœud Grist](../nodes/grist-node.md) requiert le **Document ID** (issu de l'URL du document Grist) et le **Table ID** dans sa configuration — ceux-ci ne font pas partie de l'identifiant.
- Pour un Grist auto-hébergé, définissez `server_url` sur le domaine de votre instance.
- Les ID de colonnes dans Grist utilisent des underscores (par exemple `User_Name`), et non les libellés affichés. Utilisez l'opération `listColumns` pour les découvrir.

### Utilisé par

- [Nœud Grist](../nodes/grist-node.md)

---

## Google Sheets (OAuth2)

L'identifiant Google Sheets connecte Heym à l'API Google Sheets en utilisant un modèle OAuth2 « Bring Your Own App ». Vous fournissez un Client ID et un Client Secret OAuth2 Google Cloud, puis autorisez l'accès via une fenêtre contextuelle du navigateur. Les tokens sont actualisés automatiquement en arrière-plan.

### Configuration

1. Ouvrez la [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → recherchez et activez **Google Sheets API**.
2. Accédez à **Credentials** → **Create Credentials** → **OAuth client ID** → type d'application **Web application**.
3. Sous **Authorized redirect URIs**, ajoutez : `https://your-heym-domain/api/credentials/google-sheets/oauth/callback`
4. Copiez le **Client ID** et le **Client Secret** générés.
5. Dans le Dashboard Heym → **Credentials** → **New** → type **Google Sheets (OAuth2)**.
6. Saisissez le Client ID, le Client Secret et un nom, puis cliquez sur **Connect** pour ouvrir la fenêtre de consentement Google et autoriser l'accès.

### Champs requis

| Champ | Description |
|-------|-------------|
| `client_id` | Client ID OAuth2 issu de la Google Cloud Console |
| `client_secret` | Client Secret OAuth2 issu de la Google Cloud Console |

Les tokens (`access_token`, `refresh_token`, `token_expiry`) sont stockés et actualisés automatiquement — vous ne les gérez pas directement.

### Notes

- L'écran de consentement OAuth2 requiert le scope spreadsheets (`https://www.googleapis.com/auth/spreadsheets`).
- Heym utilise le refresh token pour obtenir de nouveaux access tokens avant leur expiration (marge de sécurité de 60 secondes).
- Si vous renouvelez le Client Secret dans la Google Cloud Console, reconnectez l'identifiant via le bouton **Connect**.
- **Production :** définissez la variable backend **`FRONTEND_URL`** sur l'URL publique exacte que les utilisateurs ouvrent dans le navigateur (schéma + hôte, par exemple `https://heym.example.com`). Heym construit l'URI de redirection Google OAuth uniquement à partir de cette valeur — il ne fait **pas** confiance aux en-têtes `Origin` ou `X-Forwarded-*` (contrôlés par le client). Enregistrez `{FRONTEND_URL}/api/credentials/google-sheets/oauth/callback` dans la Google Cloud Console.

### Utilisé par

- [Nœud Google Sheets](../nodes/google-sheets-node.md)

---

## Google Drive (OAuth2)

L'identifiant Google Drive connecte Heym à l'API Google Drive en utilisant le même modèle OAuth2 « Bring Your Own App » que Google Sheets. Vous fournissez un Client ID et un Client Secret OAuth2 Google Cloud, puis autorisez l'accès via une fenêtre contextuelle du navigateur. Les tokens sont actualisés automatiquement en arrière-plan.
### Configuration

1. Ouvrez la [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → recherchez puis activez **Google Drive API**.
2. Accédez à **Credentials** → **Create Credentials** → **OAuth client ID** → type d'application **Web application**.
3. Sous **Authorized redirect URIs**, ajoutez : `https://your-heym-domain/api/credentials/google-drive/oauth/callback`
4. Copiez le **Client ID** et le **Client Secret** générés.
5. Dans le Dashboard Heym → **Identifiants** → **New** → type **Google Drive (OAuth2)**.
6. Saisissez le Client ID, le Client Secret et un nom, puis cliquez sur **Connect** pour ouvrir la popup de consentement Google et autoriser l'accès.

### Champs requis

| Champ | Description |
|-------|-------------|
| `client_id` | Client ID OAuth2 issu de la Google Cloud Console |
| `client_secret` | Client Secret OAuth2 issu de la Google Cloud Console |

Les tokens (`access_token`, `refresh_token`, `token_expiry`) sont stockés et rafraîchis automatiquement — vous ne les gérez pas directement.

### Scope

Google Drive requiert le **scope Drive complet** (`https://www.googleapis.com/auth/drive`).

Ceci est nécessaire car le nœud opère sur des fichiers que vous possédez déjà. Le scope plus restreint `drive.file` n'accorde l'accès qu'aux fichiers créés par le client OAuth lui-même, ce qui ferait que `listFolderFiles`, `updateFile`, `removeFile` et `removeFolder` ne verraient rien de votre Drive existant.

Comme vous fournissez votre propre Client ID et Secret depuis votre propre projet Google Cloud, les exigences de vérification d'application Google pour ce scope s'appliquent à votre projet, et non à Heym.

### Remarques

- Heym utilise le refresh token pour obtenir de nouveaux access tokens avant leur expiration (marge de sécurité de 60 secondes).
- Si vous renouvelez le Client Secret dans la Google Cloud Console, reconnectez l'identifiant via le bouton **Connect**.
- Les drives partagés sont pris en charge — le nœud définit `supportsAllDrives` sur chaque appel API.
- **Production :** définissez la variable backend **`FRONTEND_URL`** sur l'URL publique exacte que les utilisateurs ouvrent dans le navigateur. Heym construit l'URI de redirection OAuth Google uniquement à partir de cette valeur — il ne se fie **pas** aux en-têtes `Origin` ou `X-Forwarded-*`. Enregistrez `{FRONTEND_URL}/api/credentials/google-drive/oauth/callback` dans la Google Cloud Console.
- Consultez [Credential Sharing](./credentials-sharing.md) avant de partager cet identifiant avec une équipe.

### Utilisé par

- [Nœud Google Drive](../nodes/google-drive-node.md)

---

## BigQuery (OAuth2)

L'identifiant BigQuery connecte Heym à l'API Google BigQuery selon un modèle OAuth2 « Bring Your Own App ». Vous fournissez un Client ID et un Client Secret OAuth2 Google Cloud, puis autorisez l'accès via une popup de navigateur. Les tokens sont rafraîchis automatiquement en arrière-plan.

### Configuration

1. Ouvrez la [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Library** → recherchez puis activez **BigQuery API**.
2. Accédez à **Credentials** → **Create Credentials** → **OAuth client ID** → type d'application **Web application**.
3. Sous **Authorized redirect URIs**, ajoutez : `https://your-heym-domain/api/credentials/bigquery/oauth/callback`
4. Copiez le **Client ID** et le **Client Secret** générés.
5. Dans le Dashboard Heym → **Identifiants** → **New** → type **BigQuery (OAuth2)**.
6. Saisissez le Client ID, le Client Secret et un nom, puis cliquez sur **Connect** pour ouvrir la popup de consentement Google et autoriser l'accès.

### Champs requis

| Champ | Description |
|-------|-------------|
| `client_id` | Client ID OAuth2 issu de la Google Cloud Console |
| `client_secret` | Client Secret OAuth2 issu de la Google Cloud Console |

Les tokens (`access_token`, `refresh_token`, `token_expiry`) sont stockés et rafraîchis automatiquement.

### Remarques

- L'écran de consentement OAuth2 requiert le scope BigQuery (`https://www.googleapis.com/auth/bigquery`).
- **Production :** définissez la variable backend **`FRONTEND_URL`** sur l'URL publique. Enregistrez `{FRONTEND_URL}/api/credentials/bigquery/oauth/callback` dans la Google Cloud Console.

### Utilisé par

- [Nœud BigQuery](../nodes/bigquery-node.md)

---

## Supabase

L'identifiant Supabase connecte Heym à l'API PostgREST d'un projet Supabase afin que les workflows puissent interroger et modifier des tables adossées à Postgres.

### Champs requis

| Champ | Description |
|-------|-------------|
| `supabase_url` | URL de base du projet, par exemple `https://your-project.supabase.co` |
| `supabase_key` | Clé API disposant d'un accès aux tables cibles |
| `supabase_schema` | Schéma par défaut facultatif (valeur par défaut : `public`) |

### Remarques

- Le [nœud Supabase](../nodes/supabase-node.md) communique avec `/rest/v1/<table>` et prend en charge les filtres d'opérateurs (`eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `is`, `in` et les opérateurs PostgREST associés) ainsi que les groupes logiques imbriqués `or` / `and`.
- Pour les opérations d'écriture, privilégiez une clé destinée à un usage serveur de confiance avec les permissions de table minimales requises.
- Les nœuds peuvent remplacer le schéma à chaque étape, même si l'identifiant définit un schéma par défaut.

### Utilisé par

- [Nœud Supabase](../nodes/supabase-node.md)
## ClickHouse

L'identifiant ClickHouse connecte Heym à une base de données ClickHouse externe via son interface HTTP, permettant aux workflows d'exécuter des opérations SQL, CRUD et de comptage sur des tables OLAP.

### Champs requis

| Champ | Description |
|-------|-------------|
| `host` | Hôte HTTP sans schéma, par exemple `your-instance.clickhouse.cloud` |
| `port` | Port de l'interface HTTP (`8443` pour HTTPS, `8123` pour HTTP) |
| `username` | Utilisateur ClickHouse (par défaut `default`) |
| `password` | Mot de passe de l'utilisateur (facultatif) |
| `database` | Base de données cible (par défaut `default`) |
| `secure` | Utiliser HTTPS lorsque `true` (requis pour ClickHouse Cloud) |

### Remarques

- Le [nœud ClickHouse](../nodes/clickhouse-node.md) utilise le client HTTP officiel `clickhouse-connect` et paramètre les liaisons de filtres et de valeurs.
- `update` et `remove` correspondent à `ALTER TABLE ... UPDATE` et `DELETE FROM`, qui sont des mutations ClickHouse asynchrones ; les deux nécessitent un filtre.
- `upsert` effectue un `INSERT` et suppose une table `ReplacingMergeTree` pour un comportement de fusion sur clé.
- Utilisez **Test connection** dans la boîte de dialogue des identifiants pour vérifier l'accessibilité.

### Utilisé par

- [Nœud ClickHouse](../nodes/clickhouse-node.md)

## Notion

L'identifiant Notion prend en charge soit un token d'intégration interne, soit une connexion OAuth d'intégration publique. OAuth permet à chaque utilisateur d'autoriser un espace de travail Notion depuis Heym au lieu de copier manuellement un token.

### Champs requis

| Mode | Champ | Description |
|------|-------|-------------|
| Token interne | `api_token` | Token d'intégration interne (`ntn_...`) |
| OAuth | `client_id` | Client ID d'une intégration publique Notion |
| OAuth | `client_secret` | Client Secret de l'intégration publique Notion |

Le callback OAuth stocke automatiquement `access_token`, `auth_mode`, `workspace_id`, `workspace_name` et `bot_id`. Tout `api_token` interne précédent est supprimé lorsque OAuth se termine. Enregistrez cette URI de redirection dans Notion :
`{FRONTEND_URL}/api/credentials/notion/oauth/callback`.

### Flux de configuration OAuth

1. Choisissez **OAuth** dans la boîte de dialogue des identifiants, saisissez un nom, un Client ID et un Client Secret.
2. Cliquez sur **Connect** et autorisez l'espace de travail dans la fenêtre contextuelle Notion.
   - Pour un **nouvel** identifiant, Heym crée l'enregistrement de l'identifiant lorsque vous cliquez sur **Connect**.
   - Terminez l'autorisation dans la fenêtre contextuelle, puis cliquez sur **Save** pour revenir à la liste des identifiants.
3. Un identifiant connecté affiche `connected (Workspace Name)` dans la liste. Les identifiants OAuth en attente affichent `Not connected` jusqu'à la fin de l'autorisation.

Utilisez **Test Connection** dans la boîte de dialogue des identifiants pour vérifier soit un token interne, soit une autorisation OAuth terminée. Lors de la modification, laisser le champ du token vide préserve le token interne stocké.

Les tokens internes et les access tokens OAuth sont disponibles via
`$credentials.CredentialName` pour les appels [HTTP](../nodes/http-node.md) personnalisés nécessitant un bearer token Notion.

### Remarques

- Les intégrations internes nécessitent que les pages, bases de données et sources de données pertinentes soient partagées.
- Les utilisateurs OAuth choisissent l'espace de travail et les pages lors de l'autorisation Notion.
- Les identifiants d'application OAuth sont chiffrés dans l'identifiant Notion. Le callback les recharge côté serveur ; le secret n'est pas intégré à l'état OAuth.
- Les identifiants OAuth connectés affichent le nom de l'espace de travail ; les identifiants OAuth en attente affichent `Not connected` jusqu'à la fin de l'autorisation.
- **Production :** définissez le **`FRONTEND_URL`** du backend sur l'URL publique du navigateur (schéma + hôte, sans barre oblique finale). L'URI de redirection Notion doit correspondre exactement :
  `{FRONTEND_URL}/api/credentials/notion/oauth/callback`.
- Le nœud utilise la version d'API `2026-03-11` et la terminologie actuelle `data_source`. Consultez l'article [Nœud Notion](../nodes/notion-node.md#api-version-notes) pour les conseils de migration depuis les anciens exemples `archived`, `after` ou de requêtes de base de données.
- Les anciens filtres de recherche avec la valeur d'objet `database` sont normalisés en `data_source`.

### Utilisé par

- [Nœud Notion](../nodes/notion-node.md)

---

## SMTP (Email)

L'identifiant SMTP stocke les détails de connexion au serveur de messagerie pour l'envoi de courriers sortants.

### Champs requis

| Champ | Description |
|-------|-------------|
| `host` | Nom d'hôte du serveur SMTP (ex. `smtp.gmail.com`) |
| `port` | Port SMTP (généralement `587` pour STARTTLS, `465` pour SSL) |
| `email` | Nom d'utilisateur avec lequel le serveur SMTP se connecte ; également l'expéditeur visible lorsque `from` est vide |
| `password` | Mot de passe SMTP ou mot de passe d'application |

### Champs facultatifs

| Champ | Description |
|-------|-------------|
| `from` (`smtp_from`) | Adresse d'expéditeur (From) visible. Laissez vide pour envoyer en tant que `email`. Le serveur se connecte toujours en tant que `email`, ce compte doit donc être autorisé à envoyer avec cette adresse (dans Gmail, un alias **Envoyer des e-mails en tant que** vérifié). |

### Fournisseurs SMTP courants

| Fournisseur | Hôte | Port | Remarques |
|----------|------|------|-------|
| Gmail | `smtp.gmail.com` | `587` | Nécessite un [mot de passe d'application](https://support.google.com/accounts/answer/185833) (la 2FA doit être activée) |
| Outlook / Office 365 | `smtp.office365.com` | `587` | Utilisez les identifiants de votre compte Microsoft |
| Mailgun | `smtp.mailgun.org` | `587` | Utilisez les identifiants SMTP Mailgun de vos paramètres de domaine |
| SendGrid | `smtp.sendgrid.net` | `587` | Utilisez `apikey` comme nom d'utilisateur et une clé API comme mot de passe |
| Personnalisé / Auto-hébergé | votre domaine | `587` / `465` | Postfix, Exim, etc. |
### Notes

- Gmail nécessite un **App Password** au lieu de votre mot de passe habituel lorsque la validation en deux étapes est activée.
- Le port `587` utilise STARTTLS (démarre en clair, puis passe en TLS). Le port `465` utilise le TLS implicite (SSL dès le départ).

### Utilisé par

- [Nœud Send Email](../nodes/send-email-node.md)

---

## IMAP (E-mail entrant)

L'identifiant IMAP stocke les détails de connexion permettant de surveiller une boîte de réception avec le [Nœud IMAP Trigger](../nodes/imap-trigger-node.md).

### Champs requis

| Champ | Description |
|-------|-------------|
| `imap_host` | Nom d'hôte du serveur IMAP (par exemple `imap.gmail.com`) |
| `imap_port` | Port IMAP (`993` pour SSL/TLS chez la plupart des fournisseurs) |
| `imap_username` | Nom d'utilisateur de la boîte aux lettres ou adresse e-mail complète |
| `imap_password` | Mot de passe ou mot de passe d'application propre au fournisseur |

### Champs facultatifs

| Champ | Description |
|-------|-------------|
| `imap_mailbox` | Dossier de la boîte aux lettres à surveiller (par défaut : `INBOX`) |
| `imap_use_ssl` | Activer SSL/TLS (recommandé ; par défaut : `true`) |

### Notes

- Le Trigger IMAP établit une référence de la boîte aux lettres actuelle lors du premier poll, puis ne traite que les e-mails plus récents.
- Gmail, Microsoft 365 et d'autres fournisseurs hébergés exigent souvent un **app password** ou un secret spécifique à IMAP similaire.
- Le contenu des pièces jointes n'est pas téléchargé dans le payload du workflow ; Heym expose uniquement les métadonnées des pièces jointes.

### Utilisé par

- [Nœud IMAP Trigger](../nodes/imap-trigger-node.md)
- [Triggers](./triggers.md) (IMAP comme Trigger de workflow)

---

## RabbitMQ

[RabbitMQ](https://www.rabbitmq.com) est un courtier de messages open source. L'identifiant RabbitMQ stocke les détails de connexion permettant de publier vers et de consommer depuis des files d'attente et des exchanges.

### Champs requis

| Champ | Description |
|-------|-------------|
| `rabbitmq_host` | URL de connexion AMQP (ex. `amqp://localhost:5672`) |
| `rabbitmq_username` | Nom d'utilisateur RabbitMQ (par défaut : `guest`) |
| `rabbitmq_password` | Mot de passe RabbitMQ (par défaut : `guest`) |

### Hôtes virtuels

Pour vous connecter à un hôte virtuel spécifique, incluez-le dans l'URL `rabbitmq_host` :

```
amqp://username:password@hostname:5672/vhost
```

Si vous utilisez le vhost par défaut, le chemin `/` peut être omis.

### Plugin de messages différés

Le [Nœud RabbitMQ](../nodes/rabbitmq-node.md) prend en charge le plugin **rabbitmq_delayed_message_exchange**. Lorsque ce plugin est activé sur votre serveur RabbitMQ, vous pouvez définir un délai (en millisecondes) sur les messages sortants à l'aide du champ `rabbitmqDelayMs` du nœud.

Le nœud définit l'en-tête `x-delay` sur le message publié. Le type d'exchange doit être `x-delayed-message` pour que les délais prennent effet.

Pour activer le plugin sur une instance RabbitMQ auto-hébergée :

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

Lorsque le plugin n'est pas installé, l'en-tête `x-delay` est ignoré et les messages sont distribués immédiatement.

### Utilisé par

- [Nœud RabbitMQ](../nodes/rabbitmq-node.md)
- [Triggers](./triggers.md) (RabbitMQ comme Trigger de workflow)

---

## Amazon S3

L'identifiant Amazon S3 connecte Heym à [Amazon S3](https://aws.amazon.com/s3/). Utilisez-le avec le [Nœud Amazon S3](../nodes/amazon-s3-node.md) pour gérer les buckets et les dossiers, téléverser et télécharger des objets, copier des clés, et lister ou supprimer des objets depuis les workflows.

### Champs requis

| Champ | Description |
|-------|-------------|
| `aws_access_key_id` | ID de clé d'accès AWS IAM |
| `aws_secret_access_key` | Clé d'accès secrète associée à l'ID de clé d'accès |
| `aws_region` | Région AWS où résident les buckets (ex. `us-east-1`) |

### Champs facultatifs

| Champ | Description |
|-------|-------------|
| `aws_session_token` | Token de session temporaire lors de l'utilisation d'identifiants AWS STS |

### Notes

- L'identifiant utilise l'authentification standard AWS SigV4 via boto3.
- Les opérations de téléversement envoient actuellement du contenu texte UTF-8 ; les téléchargements peuvent renvoyer du texte ou du base64 pour les objets binaires.

### Utilisé par

- [Nœud Amazon S3](../nodes/amazon-s3-node.md)

---

## Redis

[Redis](https://redis.io) est un magasin clé-valeur en mémoire utilisé pour la mise en cache et l'accès rapide aux données.

### Champs requis

| Champ | Description |
|-------|-------------|
| `host` | Nom d'hôte ou IP du serveur Redis (ex. `localhost`) |
| `port` | Port Redis (par défaut : `6379`) |
| `password` | Mot de passe Redis (laissez vide s'il n'est pas défini) |

### Utilisé par

- [Nœud Redis](../nodes/redis-node.md)

---

## Slack

L'identifiant Slack stocke une **URL de Webhook entrant** pour publier des messages dans les canaux Slack.

### Champs requis

| Champ | Description |
|-------|-------------|
| `webhook_url` | URL de Webhook entrant Slack (issue de la configuration de votre application Slack) |

### Notes

- Créez un Webhook entrant sur [api.slack.com/apps](https://api.slack.com/apps) → votre application → **Incoming Webhooks**.
- Chaque Webhook est limité à un canal spécifique. Créez plusieurs identifiants pour différents canaux.

### Utilisé par

- [Nœud Slack](../nodes/slack-node.md)

---

## Telegram

L'identifiant Telegram stocke un **Bot Token** et un **Webhook Secret Token** facultatif pour les workflows basés sur des bots.
### Champs obligatoires

| Champ | Description |
|-------|-------------|
| `bot_token` | Token de l'API Telegram Bot obtenu auprès de BotFather |

### Champs facultatifs

| Champ | Description |
|-------|-------------|
| `secret_token` | Secret partagé vérifié par rapport à `x-telegram-bot-api-secret-token` lors des webhooks entrants |

### Remarques

- Utilisez les mêmes identifiants pour le [Trigger Telegram](../nodes/telegram-trigger-node.md) et le [nœud Telegram](../nodes/telegram-node.md).
- Enregistrez le webhook manuellement via l'API `setWebhook` de Telegram en utilisant l'URL affichée dans le panneau du nœud Trigger Telegram.
- Le `chatId` du nœud Telegram peut être un ID littéral ou une expression telle que `$telegramEvent.message.chat.id`.

### Utilisé par

- [Nœud Trigger Telegram](../nodes/telegram-trigger-node.md)
- [Nœud Telegram](../nodes/telegram-node.md)

---

## HTTP Auth (Bearer & Header)

Ces identifiants sont utilisés par le [nœud HTTP](../nodes/http-node.md) pour authentifier les requêtes sortantes.

### Bearer

Ajoute un en-tête `Authorization: Bearer <token>` aux requêtes HTTP.

| Champ | Description |
|-------|-------------|
| `token` | La valeur du token bearer |

### Header

Ajoute un en-tête personnalisé aux requêtes HTTP.

| Champ | Description |
|-------|-------------|
| `header_key` | Nom de l'en-tête (par ex. `X-Api-Key`) |
| `header_value` | Valeur de l'en-tête |

Les deux types peuvent également être référencés via `$credentials.CredentialName` dans le [Expression DSL](./expression-dsl.md) pour un usage dynamique dans tout nœud acceptant les expressions.

### Utilisé par

- [Nœud HTTP](../nodes/http-node.md)

---

## Fournisseurs LLM (OpenAI, Google, Custom, Cohere)

Ces identifiants alimentent les nœuds IA.

| Type | Description |
|------|-------------|
| **OpenAI** | Clé API pour les modèles GPT et les embeddings OpenAI |
| **Google** | Clé API pour les modèles Gemini |
| **Custom** | Clé API + URL de base pour les endpoints compatibles OpenAI (Ollama, vLLM, LM Studio, etc.) |
| **Cohere** | Clé API pour les embeddings Cohere |

### Mise en cache des prompts OpenAI

OpenAI met automatiquement en cache le préfixe statique (invariable) de votre prompt système — aucune configuration supplémentaire n'est requise. Les exécutions répétées de workflow partageant le même préfixe de prompt système bénéficient de la tarification des tokens mis en cache, ce qui réduit à la fois le coût et la latence. Cela s'avère particulièrement utile lorsque vous disposez d'instructions longues et fixes et que seul le message utilisateur change entre les exécutions. Surveillez les taux de succès du cache et les économies de tokens dans l'[onglet Traces](../tabs/traces-tab.md) ou le tableau de bord d'utilisation OpenAI afin d'optimiser la structure de votre prompt pour une réutilisation maximale du cache.

### Utilisé par

- [Nœud LLM](../nodes/llm-node.md)
- [Nœud Agent](../nodes/agent-node.md)
- [Nœud RAG](../nodes/rag-node.md) (embeddings OpenAI via l'identifiant Qdrant)

---

## FlareSolverr

[FlareSolverr](https://github.com/FlareSolverr/FlareSolverr) est un serveur proxy permettant de contourner Cloudflare et les protections anti-bot similaires.

### Champs obligatoires

| Champ | Description |
|-------|-------------|
| `flaresolverr_url` | URL de votre instance FlareSolverr (par ex. `http://localhost:8191`) |

Les adresses loopback et privées sont prises en charge ici, de sorte que l'exécution de FlareSolverr aux côtés de Heym fonctionne comme documenté. L'URL ne peut pas résoudre vers une adresse link-local ou de métadonnées cloud. Comme les adresses privées sont autorisées, ce champ peut également pointer vers un autre service interne et la réponse est renvoyée dans la sortie du nœud. Tout utilisateur connecté peut créer cet identifiant ; la limite réside donc dans qui peut créer des workflows ainsi que dans vos règles réseau, et non dans le partage d'identifiants. Consultez [Egress Safety](../nodes/crawler-node.md#egress-safety).

### Utilisé par

- [Nœud Crawler](../nodes/crawler-node.md)

---

## Voir aussi

- [Identifiants](./credentials.md) – Présentation des identifiants et de leur utilisation par les nœuds
- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter et gérer les identifiants
- [Partage d'identifiants](./credentials-sharing.md) – Partager des identifiants avec des utilisateurs et des équipes
- [Sécurité](./security.md) – Chiffrement au repos, contrôle d'accès
- [Expression DSL](./expression-dsl.md) – Syntaxe `$credentials` pour un accès dynamique

---

## Model Router (Auto Model)

Achemine chaque requête vers l'un de vos identifiants de modèle existants, en s'appuyant sur un modèle de décision pour choisir. Il stocke des références, jamais une clé qui lui est propre.

### Champs obligatoires

- `decision_credential_id` – un identifiant **Decision Model** auquel vous avez accès.
- `decision_model` – le modèle qui effectue l'appel de routage, par exemple `jev-latest`.
- `options` – au moins deux entrées, chacune avec un nom, l'un de vos identifiants OpenAI/Google/Custom, un modèle associé, et des critères indiquant quand elle doit l'emporter.

### Champs facultatifs

- `routing_instructions` – comment pondérer les options dans leur ensemble.
- Une option peut être marquée comme le fallback utilisé lorsque le routage échoue.

### Remarques

Les noms d'options sont ceux entre lesquels le modèle de décision choisit ; ils doivent donc être distincts. Une option ne peut pas pointer vers un autre Model Router.
