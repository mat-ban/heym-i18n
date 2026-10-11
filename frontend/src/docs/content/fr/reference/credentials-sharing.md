# Partage des identifiants

Les identifiants peuvent être partagés avec d'autres utilisateurs afin que leurs workflows puissent utiliser vos clés API. Consultez [Identifiants](./credentials.md) pour une vue d'ensemble et [Onglet Identifiants](../tabs/credentials-tab.md) pour l'ajout et la gestion des identifiants.

## Partager des identifiants avec un LLM

Pour permettre à un LLM ou à un agent IA d'utiliser une clé API, stockez la clé en tant qu'identifiant et laissez le nœud qui effectue la requête l'attacher. Le modèle décide de ce qu'il faut appeler ; le nœud authentifie l'appel lors de son exécution.

- **Stockez le secret en tant qu'identifiant.** Les valeurs sensibles sont chiffrées au repos et masquées dans l'interface après leur création.
- **Référencez-le là où la requête est effectuée.** Les nœuds [LLM](../nodes/llm-node.md) et [Agent](../nodes/agent-node.md) sélectionnent leur identifiant de modèle par ID, et les requêtes HTTP placent `$credentials.CredentialName` dans l'en-tête d'authentification. Gardez les secrets hors des champs de prompt, car tout ce qui figure dans un prompt est envoyé au fournisseur du modèle sous forme de texte.
- **Donnez des outils à l'agent, pas des clés.** Lorsqu'un Agent appelle un nœud HTTP, un serveur MCP ou un sous-workflow en tant qu'outil, l'identifiant est appliqué à l'intérieur de cet outil et le modèle reçoit le résultat de l'outil.
- **Les sorties sont masquées.** Lorsqu'une valeur d'identifiant de plus de sept caractères apparaît dans la sortie d'un nœud, seuls ses sept premiers caractères sont conservés ; ainsi, une réponse qui reprend une clé n'affiche que ce préfixe dans les résultats et les traces. Consultez [Masquage des sorties](#output-masking).
- **Laissez l'assistant créer des identifiants.** Lorsque l'[Assistant IA](./ai-assistant.md#credentials) ou l'onglet Chat crée un identifiant, il ne voit que le nom et le type, et vous saisissez le secret dans le formulaire d'identifiant habituel.
- **Partagez de la même manière avec vos collaborateurs.** Partagez l'identifiant avec un utilisateur ou une équipe, comme décrit ci-dessous, et leurs workflows pourront utiliser votre clé via leurs propres nœuds LLM et Agent.

## Modèle de partage

- **CredentialShare** – Relie `credential_id` à `user_id` (unique par paire)
- **Partage par email** – `POST /api/credentials/{credential_id}/shares` avec l'email ; l'utilisateur est recherché et ajouté
- **Révocation** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Vous pouvez également partager des identifiants avec des [Équipes](./teams.md) :

- **CredentialTeamShare** – Relie `credential_id` à `team_id` ; tous les membres de l'équipe obtiennent l'accès
- **Partage avec une équipe** – `POST /api/credentials/{credential_id}/team-shares` avec `team_id`
- **Révocation du partage d'équipe** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Les identifiants partagés affichent un indicateur dans l'interface de l'[Onglet Identifiants](../tabs/credentials-tab.md).

## Identifiants à portée étendue

Partager un identifiant accorde au destinataire tout ce que cet identifiant permet de faire. Pour la plupart des intégrations, cela se limite à un workspace ou aux permissions d'une clé API, mais certains identifiants ont une portée bien plus large.

> **Les identifiants Google Drive accordent un accès complet à Drive.** L'identifiant [Google Drive](../nodes/google-drive-node.md) est autorisé avec le scope `https://www.googleapis.com/auth/drive` afin que le nœud puisse opérer sur les fichiers que vous possédez déjà. Le partager avec un utilisateur ou une équipe donne à chacun d'eux la capacité de **lire, modifier et supprimer définitivement tout élément de votre Google Drive** via un workflow — pas seulement les fichiers que vous aviez en tête. Ne le partagez qu'avec des personnes à qui vous accorderiez directement un accès complet à Drive.

Si vous devez limiter l'exposition, créez un compte Google dédié ayant accès uniquement aux dossiers dont le workflow a besoin, et connectez l'identifiant avec ce compte plutôt qu'avec votre compte principal.

Un identifiant **Decision Model** porte l'endpoint et, lorsqu'il est défini, une clé API. Le partager permet au destinataire de consommer cette clé depuis n'importe quel workflow qu'il peut exécuter, exactement comme un identifiant LLM.

Un identifiant **Model Router** partage tout ce vers quoi il route. Les personnes avec qui vous le partagez peuvent exécuter des requêtes contre chaque identifiant de sa liste d'options, et ces requêtes consomment vos clés. Elles ne peuvent pas lire les clés, et les identifiants n'apparaissent pas dans leur propre liste d'identifiants.

Il s'agit du même octroi que le partage direct d'un identifiant OpenAI, et c'est ce qui rend un routeur utile à une équipe. Si vous ne le souhaitez pas, partagez plutôt les identifiants individuels et laissez chacun choisir un modèle.

## Partager avec les collaborateurs d'un workflow

Lorsque vous partagez un workflow, les collaborateurs peuvent l'ouvrir et l'exécuter, mais ne peuvent pas utiliser vos identifiants sauf si vous partagez également ces identifiants avec eux. Cela s'applique aux identifiants du workflow principal et de tous les sous-workflows qu'il appelle. Partagez chaque identifiant avec les mêmes utilisateurs ou équipes que ceux invités au workflow. Les sous-workflows doivent également être partagés séparément depuis l'éditeur du workflow enfant. Consultez [Organisation des workflows](./workflow-organization.md#sharing-workflows).
## Contexte d'exécution

Lorsqu'un workflow s'exécute, les identifiants sont résolus pour le **propriétaire du workflow** (ou l'utilisateur courant lors de l'exécution). `get_credentials_context()` fusionne :

1. **Identifiants possédés** – `Credential.owner_id == user_id`
2. **Identifiants partagés avec l'utilisateur** – `CredentialShare` où `CredentialShare.user_id == user_id`
3. **Identifiants partagés avec l'équipe** – `CredentialTeamShare` où l'utilisateur est membre de l'équipe

Tous sont fusionnés dans un unique dictionnaire de contexte indexé par nom d'identifiant.

## Utilisation dans les Workflows

### Par nom (Expression DSL)

Les identifiants sont exposés sous la forme `$credentials.CredentialName` dans l'[Expression DSL](./expression-dsl.md). Utilisez cette syntaxe pour :

- Les nœuds HTTP (authentification Bearer/Header)
- Les nœuds Telegram
- Les nœuds Slack
- Les tokens bearer Notion dans les requêtes HTTP personnalisées (token interne ou token d'accès OAuth)
- Tout nœud acceptant des expressions pour l'authentification

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Par ID (credentialId)

Certains nœuds stockent `credentialId` (UUID) dans `node.data` :

| Type de nœud | Champ | Description |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | Identifiant API LLM |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Identifiant de token d'accès Codex et identifiant GitHub |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Identifiant de passerelle OpenCode Go et identifiant GitHub |
| [Jira](../nodes/jira-node.md) | `credentialId` | Identifiant Jira Cloud email/API token ou Data Center username/password |
| [Notion](../nodes/notion-node.md) | `credentialId` | Identifiant Notion token interne ou espace de travail OAuth |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Token d'authentification Sentry et URL de base facultative |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL de projet Supabase et clé API |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Détails de connexion ClickHouse (hôte, port, authentification, base de données) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Identifiant de bot Telegram |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Clé publique Discord ou identifiant webhook |
| Vector Store | `credential_id` | Base vectorielle Qdrant ou Postgres (pgvector), via un identifiant RAG Qdrant, Psql ou Custom Embeddings |
| Evals | `credential_id`, `judge_credential_id` | Identifiant de modèle ; un identifiant de modèle ou de Decision Model pour le juge LLM-as-Judge |
| [Playwright](../nodes/playwright-node.md) étape AI | `credentialId` | Modèle LLM/Vision (pour l'étape AI et [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

L'exécuteur charge l'identifiant directement depuis la base de données par ID et déchiffre la configuration.

## Masquage des sorties

Après l'exécution, `mask_sensitive_output()` masque les valeurs d'identifiants dans les sorties, en conservant les sept premiers caractères de chaque secret de plus de sept caractères et en remplaçant le reste par `**`, afin que les secrets ne soient pas exposés dans les résultats ou les traces.

## Voir aussi

- [Onglet Identifiants](../tabs/credentials-tab.md) – Ajouter et partager des identifiants
- [Intégrations tierces](./integrations.md) – Configuration détaillée pour chaque type d'identifiant
- [Équipes](./teams.md) – Partager avec les équipes
- [Expression DSL](./expression-dsl.md) – Syntaxe `$credentials`
- [Types de nœuds](./node-types.md) – Nœuds utilisant des identifiants ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Nœud Agent](../nodes/agent-node.md) – Utilise `credentialId` pour le LLM
