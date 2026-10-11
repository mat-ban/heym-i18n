# Onglet Identifiants

L'onglet **Identifiants** gère les clés API et les secrets utilisés par les nœuds. Ajoutez des identifiants ici et référencez-les par leur nom dans les nœuds de workflow. Pour une vue d'ensemble de ce que sont les identifiants et de la manière dont les nœuds les utilisent, consultez [Identifiants](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Regarder la démo des Identifiants</a></p>

## Types d'identifiants

| Type | Cas d'usage |
|------|----------|
| **OpenAI** | Clé API OpenAI pour les nœuds LLM, Agent et RAG |
| **Google** | Clé API Google AI (Gemini) |
| **GitHub** | Token d'accès personnel (PAT) GitHub pour l'API GitHub, les workflows du nœud GitHub, les serveurs MCP et les workflows d'agents ; `base_url` GitHub Enterprise en option |
| **Linear** | Clé API personnelle Linear ou OAuth2 pour les équipes, projets, tickets et commentaires |
| **Notion** | Token d'intégration interne ou autorisation d'espace de travail OAuth via intégration publique |
| **Custom** | Endpoints LLM personnalisés |
| **Bearer** | Token Bearer pour l'authentification HTTP |
| **Header** | Paire clé-valeur d'en-tête personnalisée pour les requêtes HTTP |
| **Telegram** | Token de bot Telegram et secret de webhook en option |
| **Slack** | URL de webhook entrant Slack |
| **Discord** | URL de webhook entrant Discord |
| **Discord Trigger** | Clé publique de l'application Discord |
| **IMAP** | Identifiants du Trigger de boîte mail entrante |
| **SMTP** | Identifiants d'envoi d'e-mails |
| **Redis** | Connexion Redis |
| **RAG: Qdrant + OpenAI** | Base vectorielle pour les nœuds RAG, adossée à un serveur Qdrant externe |
| **RAG: Psql + OpenAI** | Base vectorielle pour les nœuds RAG, adossée à la base de données Postgres propre à Heym (pgvector) — aucun service externe |
| **RAG: Custom Embeddings** | Base vectorielle pour les nœuds RAG utilisant n'importe quel endpoint d'embeddings compatible OpenAI, avec Qdrant ou Postgres (pgvector) comme stockage |
| **Cohere** | API Cohere pour les embeddings |

## Ajout d'identifiants

1. Cliquez sur **Ajouter un identifiant**
2. Choisissez le type d'identifiant
3. Saisissez les valeurs requises (clé API, URL, etc.)
4. Donnez-lui un nom pour le référencer dans les nœuds

Pour GitHub, le flux d'identifiants actuel est basé sur un PAT. Les PAT à granularité fine sont recommandés. Les flux d'installation GitHub App ne sont pas pris en charge nativement dans l'interface aujourd'hui. Si vous utilisez GitHub Enterprise Server, vous pouvez également définir une URL de base de l'API GitHub en option, telle que `https://github.example.com/api/v3`.

Pour Linear, choisissez **Clé API personnelle** ou **OAuth2** dans la boîte de dialogue. Les clés API personnelles sont créées
sous **Settings → Security & Access → Personal API keys** dans Linear. OAuth2 utilise un Client ID et un Client Secret
d'application OAuth Linear, avec `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
enregistré comme URI de redirection. L'identifiant agit avec les permissions de l'utilisateur Linear qui
l'a créé ou autorisé. Utilisez **Tester la connexion** dans la boîte de dialogue d'identifiant pour vérifier la clé API ou le
token OAuth avant d'enregistrer.

Pour **Notion**, choisissez **Token interne** ou **OAuth** dans la boîte de dialogue. OAuth utilise le Client ID et le
Client Secret de votre intégration publique Notion ; Heym les stocke chiffrés dans l'identifiant.
Utilisez **Tester la connexion** pour vérifier les identifiants Supabase, Linear ou Notion avant d'enregistrer un workflow. Consultez
[Intégrations tierces](../reference/integrations.md#notion) pour les détails de configuration de Notion.

Les identifiants OAuth ouvrent la page d'autorisation du fournisseur dans une fenêtre contextuelle. Si le navigateur la bloque, utilisez le lien **Ouvrir la page d'autorisation** sous le bouton Connecter ; la boîte de dialogue détecte l'achèvement de la connexion. Une fois un nouvel identifiant connecté, le bouton affiche **Connecté**.

## Modification et suppression

- **Modifier** – Mettre à jour les valeurs de l'identifiant (les valeurs sensibles sont masquées)
- **Supprimer** – Retirer un identifiant ; les workflows qui l'utilisent nécessiteront un remplacement

Lors de la modification d'un identifiant **GitHub** sur GitHub Enterprise Server, laisser le champ optionnel **GitHub
API Base URL** vide préserve l'endpoint Enterprise existant. Saisissez une nouvelle URL uniquement lorsque vous
souhaitez modifier cet endpoint.

## Partage

- [Partager des identifiants](../reference/credentials-sharing.md) avec d'autres utilisateurs par e-mail ou avec des [Équipes](../reference/teams.md)
- Les identifiants partagés apparaissent avec un indicateur
- Révoquez le partage depuis le menu de la carte d'identifiant

## Utilisation dans les nœuds

Référencez les identifiants par leur nom dans la configuration des nœuds. Par exemple :
- [Nœud LLM](../nodes/llm-node.md) – Sélectionnez l'identifiant pour l'API du modèle
- [Nœud HTTP](../nodes/http-node.md) – Utilisez des identifiants Bearer ou Header pour l'authentification
- [Nœud Agent](../nodes/agent-node.md) – Transmettez les tokens GitHub dans les variables d'environnement du serveur MCP telles que `GITHUB_PERSONAL_ACCESS_TOKEN`
- [Nœud GitHub](../nodes/github-node.md) – Exécutez des opérations natives GitHub sur les dépôts, utilisateurs, issues, revues, releases, workflows, trafic et fichiers
- [Nœud Linear](../nodes/linear-node.md) – Lisez les métadonnées de l'espace de travail et automatisez les issues et commentaires Linear
- [Nœud Notion](../nodes/notion-node.md) – Gérez les bases de données, sources de données, pages et blocs Notion
- [Nœud RAG](../nodes/rag-node.md) – Utilisez un identifiant Qdrant ou Postgres (pgvector) pour la base vectorielle
- [Nœud Telegram Trigger](../nodes/telegram-trigger-node.md) – Recevez les webhooks du bot Telegram
- [Nœud Telegram](../nodes/telegram-node.md) – Envoyez des messages via le bot Telegram
- [Nœud Discord Trigger](../nodes/discord-trigger-node.md) – Recevez les webhooks d'interaction Discord
- [Nœud Discord](../nodes/discord-node.md) – Envoyez des messages via webhook Discord
- [Nœud IMAP Trigger](../nodes/imap-trigger-node.md) – Interrogez une boîte de réception partagée pour les nouveaux e-mails

Consultez [Expression DSL](../reference/expression-dsl.md) pour référencer des valeurs adossées à des identifiants dans les expressions.

## Voir aussi

- [Intégrations tierces](../reference/integrations.md) – Guide de configuration détaillé pour chaque type d'identifiant (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack, et plus encore)
- [Partage d'identifiants](../reference/credentials-sharing.md) – Partagez des identifiants avec d'autres utilisateurs
- [Sécurité](../reference/security.md) – Chiffrement au repos, gestion des sessions, limitation de débit
- [Types de nœuds](../reference/node-types.md) – Nœuds utilisant des identifiants ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Onglet Bases vectorielles](./vectorstores-tab.md) – Utilise des identifiants Qdrant ou Postgres (pgvector)
- [Onglet Chat](./chat-tab.md) – Utilise des identifiants OpenAI/Google
- [Contextual Showcase](../reference/contextual-showcase.md) – Guide compact des pages pour les surfaces du tableau de bord
