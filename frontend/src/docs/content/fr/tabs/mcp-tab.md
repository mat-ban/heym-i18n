# Onglet MCP

L'onglet **MCP** configure l'intégration du Model Context Protocol (MCP). MCP permet aux clients IA (Claude, ChatGPT, Gemini, Cursor et tout outil compatible MCP) d'appeler vos workflows Heym en tant qu'outils.

Heym prend en charge deux modes : un **serveur par défaut** qui expose tous les workflows compatibles MCP sous un endpoint unique, et des **serveurs nommés** qui attribuent à chaque groupe logique de workflows sa propre URL dédiée et sa propre clé API.

Les deux modes peuvent exposer deux types d'outils : des **workflows** individuels, et l'**outil Chat Heym** — l'intégralité du moteur de l'[onglet Chat](./chat-tab.md) derrière un unique outil `heym_chat`.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Regarder la démo MCP</a></p>

## Serveur MCP par défaut

Le serveur par défaut est toujours disponible à l'adresse `{origin}/api/mcp/sse`. Tous les workflows dont l'option MCP est activée apparaissent ici en tant qu'outils.

### Clé API MCP

- Les clés sont stockées sous forme de condensats SHA-256 ; Heym ne peut donc pas vous afficher une clé existante. L'onglet indique si une clé est définie, mais pas sa valeur.
- **Générer** / **Régénérer** – La nouvelle clé est affichée une seule fois, juste après sa création. Copiez-la à ce moment-là ; le rechargement de l'onglet la masque définitivement.
- Utilisez cette clé pour connecter Claude Desktop, Cursor ou d'autres clients MCP à Heym
- Clé perdue ? Régénérez-la. La clé précédente cesse immédiatement de fonctionner.

### Méthodes de connexion

- **Clé API** – Utilisez la clé API MCP pour les connexions programmatiques. L'onglet peut copier une configuration JSON prête à l'emploi et inclut un bouton **Add to Cursor** pour une configuration Cursor en un clic.
- **Claude** – L'onglet affiche l'URL du serveur MCP et les étapes de configuration pour Claude. Laissez les champs OAuth Client ID et Secret vides ; Claude s'enregistre automatiquement et s'authentifie via OAuth Heym.
- **ChatGPT** – L'onglet affiche l'URL du serveur MCP et les étapes de configuration pour une application ChatGPT. Activez le mode développeur, créez une application avec l'URL et choisissez OAuth ; ChatGPT s'enregistre automatiquement.
- **Gemini** – L'onglet affiche l'URL du serveur MCP et les étapes de configuration pour une application personnalisée Gemini : dans gemini.google.com, **Settings → Connected Apps → Add a custom app**, collez l'URL et laissez **Advanced features** fermé ; Gemini s'enregistre automatiquement et s'authentifie via OAuth Heym. Une fois connecté, Heym fonctionne également dans l'application mobile Gemini.

### Activation MCP par workflow

Chaque workflow peut être exposé en tant qu'outil MCP :

- **Activer** – Les outils du workflow deviennent disponibles pour tous les clients connectés au serveur par défaut
- **Désactiver** – Le workflow n'est pas exposé

Les cartes de workflow affichent la description et un aperçu des noms de champs d'entrée, afin de visualiser ce que chaque outil attend avant de l'activer.

## Outil Chat Heym

La section **Heym Capabilities** transforme le moteur de l'onglet Chat en un unique outil MCP nommé `heym_chat`. Activez-le sur le serveur par défaut, sur n'importe quel serveur nommé, ou sur les deux — chaque surface conserve son propre interrupteur et sa propre sélection de modèle.

Lorsqu'il est activé, `heym_chat` apparaît dans `tools/list` aux côtés de vos outils de workflow. Un client MCP envoie un seul message en langage naturel et le moteur Heym prend le relais, avec les mêmes capacités que l'onglet Chat :

- Construire un workflow, l'exécuter en test avec des exemples d'entrées, le corriger et terminer lorsqu'une exécution réussit (voir [Mode Build](#build-mode))
- Inspecter et exécuter vos workflows existants
- Rapporter les analyses, les exécutions récentes et les planifications cron à venir
- Rapporter l'historique d'exécution d'un workflow : nombre d'exécutions, décompte par statut, dates d'exécution, et sur demande les entrées, sorties et erreurs par nœud d'une exécution donnée
- Rapporter ce qui s'exécute en ce moment : nombre d'exécutions actives, leurs noms de workflow, leur durée d'exécution, le nœud sur lequel chacune se trouve actuellement, et un lien vers l'exécution en direct
- Lister les tableaux, créer des cartes et lire le détail des cartes sur l'[onglet Board](./board-tab.md)
- Lister vos tables de données avec leurs colonnes, en créer de nouvelles et les intégrer aux workflows qu'il construit
- Lire les équipes et les variables globales, et rechercher dans la documentation
- Approuver, modifier ou refuser les revues human-in-the-loop en attente

Les capacités ajoutées ultérieurement à l'onglet Chat deviennent automatiquement disponibles via `heym_chat` — aucun interrupteur par capacité à maintenir en synchronisation.

### Mode Build

`heym_chat` exécute toujours le moteur Chat en mode build. En un seul appel, l'assistant peut enregistrer un nouveau workflow, l'exécuter avec des entrées d'exemple réalistes, lire le rapport d'exécution, corriger ce qui a échoué et le relancer, jusqu'à cinq exécutions de test par appel. Lorsque la dernière exécution du dernier enregistrement réussit, il termine par un résumé d'une phrase, et la réponse se conclut par `Verified: the latest test run of the saved workflow passed.`

- Les exécutions de test sont de vraies exécutions. Leurs effets de bord se produisent et elles apparaissent dans l'historique d'exécution du workflow comme n'importe quelle autre exécution.
- Les enregistrements empruntent le chemin de l'éditeur : une modification du graphe conserve le graphe précédent dans l'historique des modifications (**Edit History**) du workflow.
- Pour modifier un workflow qu'il a construit précédemment, poursuivez le fil avec le même `conversation_id`. L'assistant met à jour ce workflow au lieu d'en créer un nouveau, et il ne modifie que les workflows que vous pouvez éditer.
- Lorsque les cinq exécutions de test sont épuisées, l'assistant s'arrête et explique ce qui échoue encore.

Les identifiants restent dans l'interface : `heym_chat` ne les liste, ne les choisit et n'en crée jamais. Lorsqu'il construit ou modifie un workflow, les nouveaux nœuds nécessitant un identifiant sont laissés vides et la réponse les nomme, afin que vous puissiez les définir dans l'éditeur.

Les tables de données fonctionnent différemment. Une table ne contient aucun secret ; `heym_chat` peut donc lister vos tables, demander laquelle un workflow doit utiliser et en créer une nouvelle avec ses colonnes. Il ne lit ni n'écrit jamais de lignes.

### Identifiant et modèle

`heym_chat` exécute le moteur sur votre compte Heym ; il nécessite donc son propre identifiant LLM :

| Champ | Comportement |
|-------|----------|
| **Identifiant** | Choisissez tout identifiant OpenAI, Google ou Custom auquel vous avez accès. Prérempli à partir de l'identifiant préféré défini dans les [Paramètres](../reference/user-settings.md) lorsque vous n'en avez pas choisi. |
| **Modèle** | Chargé depuis l'identifiant sélectionné. Prérempli à partir de votre modèle préféré lorsque l'identifiant correspond. |

Si l'un des deux est manquant, l'outil apparaît toujours dans `tools/list` mais chaque appel renvoie une erreur vous invitant à terminer la configuration dans cet onglet.

### Arguments et historique

| Argument | Requis | Description |
|----------|----------|-------------|
| `message` | Oui | L'instruction ou la question, en langage naturel. |
| `conversation_id` | Non | Un `conversation_id` issu d'un résultat `heym_chat` précédent, pour poursuivre ce fil. |

Chaque appel est consigné dans l'historique de votre [onglet Chat](./chat-tab.md) comme une conversation normale, marquée d'une icône de prise dans la liste des conversations. Les messages, les cartes d'outils et les pauses de clarification sont identiques à ceux d'une conversation que vous auriez démarrée vous-même, et vous pouvez ouvrir le fil et continuer à échanger dans le navigateur. Chaque résultat renvoie son `conversation_id` afin que le client MCP puisse poursuivre le même fil au lieu d'en ouvrir un nouveau à chaque appel.

Lorsque l'assistant a besoin de clarifications, il se met en pause et le signale ; répondez avec les informations demandées en utilisant le même `conversation_id`.

## Serveurs MCP nommés

Les serveurs nommés permettent de segmenter les workflows en endpoints MCP isolés. Chaque serveur dispose de sa propre URL et de sa propre clé API, de sorte que différents clients IA, équipes ou cas d'usage peuvent se connecter précisément aux workflows dont ils ont besoin.

### Création d'un serveur nommé

1. Saisissez un nom dans le champ de saisie en bas de l'onglet MCP (par ex. **CRM Tools**)
2. Cliquez sur **Create** — une nouvelle carte de serveur apparaît immédiatement
3. Cliquez sur la carte pour la développer

### Paramètres par serveur

Chaque carte de serveur affiche :

| Paramètre | Description |
|---------|-------------|
| **SSE Endpoint** | URL unique : `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Clé indépendante, affichée une seule fois lors de sa génération ou régénération. Copiez-la immédiatement ; elle est stockée hachée et ne peut plus être révélée par la suite |
| **How to connect** | **Copy JSON** copie la configuration MCP prête à coller ; **Add to Cursor** l'installe en un clic |
| **Heym Capabilities** | Activez ou désactivez l'outil `heym_chat` pour ce serveur et sélectionnez ses identifiants et son modèle |
| **Assigned Workflows** | Activez ou désactivez les workflows exposés par ce serveur |

### Affectation des workflows

L'affectation des workflows est propre à chaque serveur et indépendante de l'activation du serveur par défaut. Un workflow peut être activé simultanément sur le serveur par défaut et sur plusieurs serveurs nommés, ou sur aucun.

L'activation ou la désactivation d'un workflow le déplace en haut de la liste des workflows affectés, de sorte que la ligne que vous venez de modifier reste visible au lieu de défiler hors de l'écran.

### Authentification

Les serveurs nommés prennent en charge les mêmes méthodes d'authentification que le serveur par défaut :

- **En-tête X-MCP-Key** – Transmettez directement la clé API du serveur (clients API, Cursor). En-tête uniquement : les clés ne sont pas acceptées en tant que paramètre de requête `?key=`, car les URL finissent dans les journaux d'accès, les journaux de proxy et l'historique du navigateur.
- **Claude, ChatGPT et Gemini OAuth** – Ajoutez l'URL du serveur aux connecteurs ou aux applications personnalisées du client ; laissez les identifiants vides et le client s'enregistre automatiquement via OAuth. Le bearer token doit circuler dans l'en-tête `Authorization`, et non en tant que `?token=`.
- **Session token** – Émis lors de la poignée de main SSE ; limité au serveur concerné, de sorte que les tokens d'un serveur nommé ne peuvent pas accéder à un autre. Ce paramètre `?session=` de courte durée n'est pas affecté.

### Suppression d'un serveur nommé

Cliquez sur l'icône **X** dans l'en-tête d'une carte de serveur. La suppression retire le serveur et toutes ses affectations de workflows ; les workflows eux-mêmes ne sont pas affectés.

## SSE Endpoint

| Serveur | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Les deux endpoints prennent en charge le transport SSE (GET, spécification MCP 2024-11-05) et le transport Streamable HTTP (POST, spécification MCP 2025-03-26). Claude, ChatGPT et Gemini utilisent OAuth 2.1 / PKCE pour une connexion sécurisée sur les deux.

## Voir aussi

- [Why Heym](../getting-started/why-heym.md) – MCP comme primitive de premier ordre dans Heym
- [Agent Node](../nodes/agent-node.md) – Nœud Agent avec prise en charge des outils MCP
- [Agent Architecture](../reference/agent-architecture.md) – Client MCP, répartition des outils, orchestrateur
- [Triggers](../reference/triggers.md) – MCP comme point d'entrée de workflow
- [Chat Tab](./chat-tab.md) – Le moteur derrière l'outil `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Créer et gérer des workflows
- [Node Types](../reference/node-types.md) – Aperçu des nœuds IA
- [Contextual Showcase](../reference/contextual-showcase.md) – Guide de page compact pour les surfaces du tableau de bord
