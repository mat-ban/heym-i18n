# Identifiants

Les identifiants stockent les clés API et les secrets utilisés par les nœuds de workflow. Vous les ajoutez dans l'[onglet Identifiants](../tabs/credentials-tab.md) et les référencez par leur nom dans la configuration des nœuds.

## Nature des identifiants

- **Stockés par utilisateur** – Chaque identifiant appartient à un utilisateur et peut être [partagé](./credentials-sharing.md) avec d'autres utilisateurs ou des [Équipes](./teams.md).
- **Chiffrés au repos** – Les valeurs sensibles sont chiffrées ; l'interface les masque après leur création.
- **Référencés par nom** – Les nœuds sélectionnent un identifiant par son nom (ou son ID). Le moteur d'exécution résout l'identifiant pour le propriétaire du workflow au moment de l'exécution.

## Utilisation par les nœuds

| Type de nœud | Identifiant typique | Objectif |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Évaluation](../tabs/evals-tab.md) | OpenAI, Google, Personnalisé | Clé API pour le modèle |
| [Décision](../nodes/decision-node.md), juge d'[Évaluation](../tabs/evals-tab.md) | Decision Model | URL de base d'un endpoint de modèle de décision, plus une clé API facultative |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults, [Évaluation](../tabs/evals-tab.md) suites de prompts | Model Router (Auto Model) | Détermine lequel de vos modèles sert chaque requête, à l'aide d'un modèle de décision |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Connexion à un abonnement ChatGPT (OAuth) ou un token d'accès Codex pour le runner, plus un PAT GitHub pour les opérations sur les dépôts |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | Une clé API de passerelle OpenCode Go (URL de base facultative) pour le runner, plus un PAT GitHub pour les opérations sur les dépôts |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | Token d'accès personnel GitHub (PAT) pour les appels à l'API GitHub, les opérations du nœud GitHub et les intégrations MCP |
| [Jira](../nodes/jira-node.md) | Jira | E-mail/token API Cloud, nom d'utilisateur/mot de passe Data Center ou jeton d'accès personnel, URL de base du site Jira, mode de déploiement et version facultative de l'API REST |
| [Linear](../nodes/linear-node.md) | Linear | Clé API personnelle ou OAuth2 pour les équipes, projets, tickets et commentaires |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Authentification des requêtes |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Token de bot et secret de webhook facultatif |
| [Discord](../nodes/discord-node.md) | Discord | URL de webhook entrant |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Clé publique de l'application pour la vérification de signature |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Connexion à une base vectorielle (Qdrant externe, ou le Postgres de Heym via pgvector), avec OpenAI ou tout endpoint d'embedding compatible OpenAI |
| [Slack](../nodes/slack-node.md) | Slack | Webhook ou token API |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Connexion à une boîte de réception |
| [Send Email](../nodes/send-email-node.md) | SMTP | Serveur de messagerie |
| [Redis](../nodes/redis-node.md) | Redis | Connexion |
| [Grist](../nodes/grist-node.md) | Grist | Clé API + URL du serveur |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + consentement OAuth2 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + consentement OAuth2 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + consentement OAuth2 |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL du projet + clé API (+ schéma par défaut facultatif) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Hôte + port + nom d'utilisateur/mot de passe + base de données (+ secure) |
| [Notion](../nodes/notion-node.md) | Notion | Token d'intégration interne, ou Client ID + Client Secret + consentement OAuth d'une intégration publique |
| [Sentry](../nodes/sentry-node.md) | Sentry | Token d'authentification plus URL de base facultative pour une instance auto-hébergée |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Clé d'accès, clé secrète, région |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | URL AMQP |

Pour une configuration détaillée (hôtes, ports, champs propres à chaque fournisseur), consultez [Intégrations tierces](./integrations.md). Cette page couvre notamment la configuration d'un bot Telegram, la réception d'e-mails via IMAP et l'envoi d'e-mails via SMTP.

Les identifiants GitHub peuvent également inclure un `base_url` facultatif lorsque vous ciblez GitHub
Enterprise Server plutôt que GitHub.com. Lorsque vous modifiez un identifiant GitHub pour renouveler le token,
laisser `base_url` vide préserve l'endpoint Enterprise existant. Saisissez une nouvelle URL uniquement lorsque
vous souhaitez modifier cet endpoint.

Les identifiants Jira, Linear, Supabase, Notion, Sentry et ClickHouse exposent **Test Connection** dans la boîte de dialogue des identifiants. Pour Jira, le test appelle l'endpoint de l'utilisateur courant de Jira. Pour Linear,
le test appelle l'API Linear avec `getViewer` et confirme que la clé API ou le token OAuth est valide.
Lors d'une modification, vous pouvez tester sans ressaisir la clé API si le secret stocké est toujours présent. Pour Notion,
choisissez **Internal token** ou **OAuth** dans la boîte de dialogue ; OAuth utilise le Client ID et le Client Secret
de votre intégration publique Notion. Consultez [Intégrations tierces](./integrations.md#notion) pour
les détails de configuration de Notion.

## Utilisation du forfait de codage

L'onglet **AI Defaults** dans les [Paramètres](./user-settings.md) affiche l'utilisation restante du forfait de codage pour vos identifiants Codex (possédés et partagés). Pour chaque identifiant Codex, il affiche une barre horizontale par fenêtre de limite de débit active — généralement une fenêtre de **5 heures** et/ou **hebdomadaire**, selon votre offre — avec le pourcentage de quota restant et un compte à rebours de réinitialisation. Les données proviennent des en-têtes de réponse de limite de débit du backend Codex, récupérées à la demande.

Les identifiants OpenCode Go y sont également listés, mais marqués **« usage unavailable »** : la passerelle OpenCode zen n'expose pas les données de quota restant, aucune barre ne peut donc être affichée.

## Dans les Expressions

Certains nœuds autorisent les expressions pour l'authentification. Utilisez [Expression DSL](./expression-dsl.md) avec `$credentials.CredentialName` pour référencer le secret résolu d'un identifiant dans une expression. Pour connaître la ligne d'en-tête requise par chaque type d'identifiant dans une requête HTTP, consultez [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Les identifiants Codex sont volontairement exclus de `$credentials`. Que vous vous connectiez avec ChatGPT (abonnement, sans coût API par token) ou que vous colliez un `access_token` Codex, les tokens ne sont transmis qu'au processus local du runner Codex. Les tokens de connexion ChatGPT sont actualisés automatiquement à leur expiration.

Les identifiants Jira sont également exclus de `$credentials`. Le [nœud Jira](../nodes/jira-node.md) charge l'identifiant par `credentialId` au moment de l'exécution. Pour les appels REST Jira personnalisés non couverts par le nœud Jira, utilisez le [nœud HTTP](../nodes/http-node.md) avec l'authentification Jira Basic (`email:api_token` pour Jira Cloud ou `username:password` pour Data Center / Server), par exemple `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Vous pouvez également utiliser un identifiant [Header](../nodes/http-node.md) avec `Authorization: Basic <base64(user:secret)>`. Pour les tokens d'accès personnels Jira Data Center / Server, envoyez plutôt `Authorization: Bearer <token>` ; l'identifiant Jira lui-même le prend en charge via son mode d'authentification **Personal Access Token**.

| Type d'identifiant | Valeur exposée à `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Chaîne de token Bearer |
| Header | Ligne complète `header key: header value`, prête à être insérée dans un argument cURL `-H` |
| GitHub | Token d'accès personnel |
| Notion | `api_token` interne ou `access_token` OAuth (token Bearer pour les appels à l'API Notion) |
| Sentry | Token d'authentification Sentry |
| Discord / Slack | URL de Webhook |

Exemple :

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Utilisez le **nœud** Notion pour les opérations natives sur les bases de données, les pages et les blocs. Utilisez `$credentials` lorsqu'une requête [HTTP](../nodes/http-node.md) personnalisée nécessite le même token Bearer Notion.

## Création d'identifiants depuis le Chat

L'[AI Assistant](./ai-assistant.md#credentials), l'[onglet Chat](../tabs/chat-tab.md) et [Chat with Heym](./chat-with-heym.md) peuvent créer un identifiant lorsqu'un workflow en nécessite un, ou à chaque fois que vous en demandez un. L'assistant suggère le type et un nom, et le formulaire d'identifiant habituel s'ouvre dans la conversation. Demandez la mise à jour d'un identifiant que vous possédez et le même formulaire s'ouvre dessus, avec ses secrets masqués. L'assistant ne voit que le nom et le type. `heym_chat` via [MCP](../tabs/mcp-tab.md) ne peut ni créer, ni mettre à jour, ni choisir d'identifiants.

## Voir aussi

- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter, modifier, supprimer des identifiants
- [Nœud GitHub](../nodes/github-node.md) – Opérations REST GitHub natives
- [Nœud Jira](../nodes/jira-node.md) – Automatisation des projets, tickets, commentaires, pièces jointes, utilisateurs, notifications et transitions Jira
- [Nœud Linear](../nodes/linear-node.md) – Automatisation des espaces de travail et des tickets Linear GraphQL
- [Nœud Notion](../nodes/notion-node.md) – Rechercher et gérer le contenu Notion
- [Nœud Sentry](../nodes/sentry-node.md) – Automatisation des organisations, projets, équipes, tickets, événements et versions Sentry
- [Partage d'identifiants](./credentials-sharing.md) – Partager avec des utilisateurs et des équipes
- [Intégrations tierces](./integrations.md) – Guide de configuration par type d'identifiant
- [Expression DSL](./expression-dsl.md) – `$credentials` dans les expressions

## Model Router (Auto Model)

Un Model Router ne contient aucune clé. Il contient un **identifiant de modèle de décision**, une liste d'**options de modèle** — chacune étant un identifiant OpenAI, Google ou Custom existant accompagné d'un modèle — et, pour chaque option, un texte libre indiquant quand cette option doit être utilisée.

Il apparaît dans tous les sélecteurs proposant un modèle : les nœuds [LLM](../nodes/llm-node.md) et [Agent](../nodes/agent-node.md), le Chat, AI Defaults, les Dashboards, le constructeur d'expressions et les Tables de données. Son unique modèle est **Auto**. Sélectionnez-le, et le modèle de décision lit chaque requête et l'achemine. Les [Évaluations](../tabs/evals-tab.md) l'excluent, car une évaluation compare des modèles spécifiques et un routeur choisit lui-même.

Un agent réachemine au fur et à mesure que sa boucle d'outils progresse, de sorte qu'un modèle économique peut prendre les premiers tours et un modèle plus puissant le tour qui en a besoin. Des entrées identiques réutilisent la décision précédente, de sorte qu'une boucle ne paie une décision que lorsque la conversation a réellement évolué.

### Ce qu'il ne peut pas faire

Auto Model ne peut pas être combiné avec la **Responses API**, le **mode Batch** ou la **sortie d'image**. Ces options se désactivent d'elles-mêmes lorsqu'un routeur est sélectionné, et chacune indique pourquoi. Les vérifications de garde-fous et le classificateur de politique de revue humaine sont des appels à modèle unique fixes et ne sont jamais routés.

### En cas d'échec du routage

Marquez une option **Utiliser cette option en cas d'échec du routage** et une panne du modèle de décision n'interrompt jamais une exécution ; le fallback est utilisé et la raison est enregistrée sur l'exécution. Sans cela, le nœud échoue plutôt que de deviner.

### Visualiser où une requête a été acheminée

Exécutions affiche `Auto Model / GPT-5` plutôt que le modèle seul, et le coût reste attribué au modèle qui a réellement été exécuté. Le journal d'exécution du canvas et la vue Span affichent la même paire, et la vue Span indique quel tour est allé où.
