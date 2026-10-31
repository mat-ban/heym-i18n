# Onglet MCP / A2A / A2A

L'onglet **MCP** configure l'intégration du Model Context Protocol (MCP), et en tant que serveurs [Agent2Agent](https://github.com/google/A2A) (A2A 1.0) auxquels d'autres agents peuvent déléguer des tâches. MCP permet aux clients IA (Claude, ChatGPT, Gemini, Cursor et tout outil compatible MCP) d'appeler vos workflows Heym en tant qu'outils.

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


### Exécutions en file d'attente et heym_execution_status

Un workflow avec une [limite de simultanéité](../reference/webhooks.md#concurrency-limit-and-queued-runs) peut être occupé lorsqu'un client l'appelle. L'appel renvoie alors immédiatement un résultat qui n'est pas une erreur :

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

Le client interroge l'outil `heym_execution_status` avec cet `execution_id`. Il renvoie le même corps que l'[URL de statut](../reference/webhooks.md#status-url) : `queued` avec la position actuelle, `running`, puis `success` ou `error` avec les sorties. Il ne trouve que les exécutions de workflows exposés par le même serveur. L'outil n'est répertorié sur le serveur par défaut et sur chaque serveur nommé que tant qu'au moins un de ses workflows possède une limite de simultanéité. Lorsque la file d'attente du workflow est pleine, l'appel renvoie une erreur « Concurrency queue is full ».
## Agent Heym

La section **Heym Capabilities** transforme le moteur de l'onglet Chat en un unique outil MCP nommé `heym_chat`. Activez-le sur le serveur par défaut, sur n'importe quel serveur nommé, ou sur les deux — chaque surface conserve son propre interrupteur et sa propre sélection de modèle.

Lorsqu'il est activé, `heym_chat` apparaît dans `tools/list` aux côtés de vos outils de workflow. Un client MCP envoie un seul message en langage naturel et le moteur Heym prend le relais, avec les mêmes capacités que l'onglet Chat :

- Construire un workflow, l'exécuter en test avec des exemples d'entrées, le corriger et terminer lorsqu'une exécution réussit (voir [Mode Build](#build-mode))
- Inspecter et exécuter vos workflows existants
- Rapporter les analyses, les exécutions récentes et les planifications cron à venir
- Expliquer où les workflows échouent et pourquoi ils sont lents : les workflows les plus exécutés, les plus défaillants et les plus lents, ainsi que les types de nœuds accumulant le plus de temps, d'erreurs et d'appels sur les dernières 1, 3 ou 6 heures, 24 heures, 7 ou 30 jours, ou depuis le début
- Rapporter l'historique d'exécution d'un workflow : nombre d'exécutions, décompte par statut, dates d'exécution, et sur demande les entrées, sorties et erreurs par nœud d'une exécution donnée
- Rapporter ce qui s'exécute en ce moment : nombre d'exécutions actives, leurs noms de workflow, leur durée d'exécution, le nœud sur lequel chacune se trouve actuellement, et un lien vers l'exécution en direct
- Lister les tableaux, créer des cartes et lire le détail des cartes sur l'[onglet Board](./board-tab.md)
- Lister vos tableaux de bord (pages Heym Work) et leurs widgets, identifier le tableau de bord d'un workflow, ajouter un nouveau widget et construire son workflow, déposer un workflow existant en tant que widget, renommer ou supprimer un widget, ou réorganiser la disposition (voir [Dashboard › Depuis Chat et MCP](./dashboard-tab.md#from-chat-and-mcp))
- Inspecter les tables de données et leurs lignes, créer des tables, ajouter ou supprimer des colonnes, insérer, mettre à jour ou supprimer des lignes, et lier des tables aux workflows
- Créer, modifier et exécuter des suites d'évaluation de prompts et d'agents ([Eval suites](./evals-tab.md#from-chat-and-mcp)), y compris la référence d'un agent : rapportée, construite à partir d'exécutions ou spécifiée sous forme numérique. Le résultat liste le lien Evals de chaque suite enregistrée.
- Créer ou mettre à jour vos identifiants sur la page dédiée d'Heym (voir [Identifiants](#identifiants))
- Lire les équipes et les variables globales, et rechercher dans la documentation
- Approuver, modifier ou refuser les revues human-in-the-loop en attente

Les capacités ajoutées ultérieurement à l'onglet Chat deviennent automatiquement disponibles via `heym_chat` — aucun interrupteur par capacité à maintenir en synchronisation.

Ces fonctionnalités s'exécutent dans `heym_chat` : `tools/list` affiche `heym_chat` et vos outils de workflow, jamais les outils internes du chat tels que ceux des suites d'évaluation.

### Mode Build

`heym_chat` exécute toujours le moteur Chat en mode build. En un seul appel, l'assistant peut enregistrer un nouveau workflow, l'exécuter avec des entrées d'exemple réalistes, lire le rapport d'exécution, corriger ce qui a échoué et le relancer, jusqu'à cinq exécutions de test par appel. Lorsque la dernière exécution du dernier enregistrement réussit, il termine par un résumé d'une phrase, et la réponse se conclut par `Verified: the latest test run of the saved workflow passed.`

Lorsqu'un appel crée ou modifie un workflow, la réponse liste chacun d'eux avec son lien complet vers l'éditeur, tel que `https://heym.example.com/workflows/<id>`, et les liens dans la réponse de l'assistant sont également des liens complets. Ils utilisent votre adresse Heym configurée (`FRONTEND_URL`) et s'ouvrent pour les personnes connectées à Heym disposant de l'accès à ce workflow.

- Les exécutions de test sont de vraies exécutions. Leurs effets de bord se produisent et elles apparaissent dans l'historique d'exécution du workflow comme n'importe quelle autre exécution.
- Les enregistrements empruntent le chemin de l'éditeur : une modification du graphe conserve le graphe précédent dans l'historique des modifications (**Edit History**) du workflow.
- Pour modifier un workflow qu'il a construit précédemment, poursuivez le fil avec le même `conversation_id`. L'assistant met à jour ce workflow au lieu d'en créer un nouveau, et il ne modifie que les workflows que vous pouvez éditer.
- Lorsque les cinq exécutions de test sont épuisées, l'assistant s'arrête et explique ce qui échoue encore.

`heym_chat` peut inspecter vos tables et vos lignes, créer des tables, ajouter ou supprimer des colonnes, et insérer, mettre à jour ou supprimer des lignes. Fournissez-lui un nom de table, un UUID ou un lien DataTable, par exemple : « Ajouter deux colonnes de chaînes, prénom et nom, à https://heym.example/?tab=datatable/<table-id> ». Il modifie directement la table et préserve les colonnes et valeurs existantes lors de l'ajout de colonnes.

`heym_chat` peut inspecter vos tables et vos lignes, créer des tables, ajouter ou supprimer des colonnes, et insérer, mettre à jour ou supprimer des lignes. Fournissez-lui un nom de table, un UUID ou un lien DataTable, par exemple : « Ajouter deux colonnes de chaînes, prénom et nom, à https://heym.example/?tab=datatable/<table-id> ». Il modifie directement la table et préserve les colonnes et valeurs existantes lors de l'ajout de colonnes.

Les écritures requièrent la propriété ou un accès en **écriture** via un partage direct ou d'équipe. L'accès en lecture seule permet l'inspection. Les écritures de lignes appliquent les contrôles de type, valeur par défaut, champ obligatoire et unicité de l'onglet DataTable ; les imports partiels signalent les lignes rejetées. La suppression de colonnes efface leurs valeurs de chaque ligne. Tout comme dans l'onglet DataTable, la suppression de colonnes et la suppression de toutes les lignes nécessitent une confirmation préalable ; répondez avec le même `conversation_id` pour confirmer. La suppression d'une ligne sélectionnée ne requiert pas de confirmation supplémentaire.


### Identifiants

`heym_chat` voit les identifiants que vous possédez et ceux partagés avec vous, par nom et type, de la même manière que l'onglet Chat. Lorsqu'un workflow qu'il construit nécessite un identifiant, il demande lequel utiliser sous forme de question dans le résultat. Répondez-y avec le même `conversation_id`.

Pour ajouter un identifiant ou mettre à jour un identifiant dont vous êtes propriétaire, l'assistant ouvre le formulaire d'identifiant d'Heym sur une page Heym, `/credentials/setup/<id>`. Vous vous y connectez, saisissez la clé ou connectez le compte, puis enregistrez. La valeur est directement transmise à Heym : le client MCP et son modèle ne reçoivent que le nom et le type de l'identifiant. Ne collez jamais de clés dans le client MCP ; demandez le formulaire à la place.

| Client | Comportement |
|--------|--------------|
| Prend en charge l'élicitation d'URL MCP | Le client vous invite à ouvrir la page Heym. L'appel attend pendant que vous remplissez le formulaire, jusqu'à dix minutes, puis reprend avec le nouvel identifiant. |
| Tout autre client | Le résultat inclut le lien et invite le client à rappeler `heym_chat` avec `wait_for_credential_form`. Cet appel attend jusqu'à cinq minutes pendant la saisie du formulaire, puis reprend la conversation. Si le client n'attend pas, enregistrez le formulaire et répondez avec le même `conversation_id` ; le prochain appel saura que le formulaire a été enregistré et quel identifiant a été créé. |

La page ne s'ouvre que pour le compte Heym à l'origine de la demande, un lien transféré est donc inutilisable par autrui. Un formulaire reste accessible 24 heures et vous pouvez le refuser directement sur la page. Dès que vous enregistrez ou refusez, l'étape dans la conversation de l'onglet Chat affiche le résultat.


### Identifiant et modèle

`heym_chat` exécute le moteur sur votre compte Heym ; il nécessite donc son propre identifiant LLM :

| Champ | Comportement |
|-------|----------|
| **Identifiant** | Choisissez tout identifiant OpenAI, Google ou Custom auquel vous avez accès. Prérempli à partir de l'identifiant préféré défini dans les [Paramètres](../reference/user-settings.md) lorsque vous n'en avez pas choisi. |
| **Modèle** | Chargé depuis l'identifiant sélectionné. Prérempli à partir de votre modèle préféré lorsque l'identifiant correspond. |

Si l'un des deux est manquant, l'outil apparaît toujours dans `tools/list` mais chaque appel renvoie une erreur vous invitant à terminer la configuration dans cet onglet.


Les nœuds LLM et Agent d'un workflow construit par `heym_chat` s'exécutent avec cet identifiant et ce modèle, y compris un identifiant partagé avec vous, de sorte que les exécutions de test fonctionnent sans étape de configuration supplémentaire. Lorsque `heym_chat` modifie un workflow, les nœuds LLM et Agent possédant déjà un identifiant le conservent, ainsi que leur modèle.
### Arguments et historique

| Argument | Requis | Description |
|----------|----------|-------------|
| `message` | Oui | L'instruction ou la question, en langage naturel. |
| `conversation_id` | Non | Un `conversation_id` issu d'un résultat `heym_chat` précédent, pour poursuivre ce fil. |
| `wait_for_credential_form` | Non | Avec `conversation_id` : attendre que l'utilisateur enregistre ou refuse le formulaire d'identifiant ouvert par le fil, puis envoyer `message`. |

Chaque appel est consigné dans l'historique de votre [onglet Chat](./chat-tab.md) comme une conversation normale, marquée d'une icône de prise dans la liste des conversations. Les messages, les cartes d'outils et les pauses de clarification sont identiques à ceux d'une conversation que vous auriez démarrée vous-même, et vous pouvez ouvrir le fil et continuer à échanger dans le navigateur. Chaque résultat renvoie son `conversation_id` afin que le client MCP puisse poursuivre le même fil au lieu d'en ouvrir un nouveau à chaque appel.

Lorsque l'assistant a besoin de clarifications, il se met en pause et le signale ; répondez avec les informations demandées en utilisant le même `conversation_id`.

### Activer A2A

Lorsque l'Agent Heym est activé, la carte affiche une case à cocher **Activer A2A**. Cochez-la pour permettre à d'autres agents d'envoyer des tâches à l'Agent Heym via le protocole Agent2Agent (A2A 1.0). La carte présente alors l'URL de l'**Agent Card** et l'**endpoint JSON-RPC**, chacun avec un bouton de copie, ainsi qu'une commande `curl` pour récupérer la carte. A2A utilise la même clé et la même authentification OAuth que MCP. Désactiver l'agent désactive également A2A. Consultez [A2A](../reference/a2a.md) pour les méthodes, les états de tâche et un exemple.

### Progression

Un appel `heym_chat` prolongé signale l'activité de l'agent sous forme de progression MCP (`notifications/progress`), avec les termes affichés dans l'onglet Chat, par exemple `Test du workflow · tentative 2/5`. Les clients qui réinitialisent leur délai d'expiration à chaque progression restent en attente pendant que l'agent travaille.

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
| **Heym Capabilities** | Activez ou désactivez l'Agent Heym (`heym_chat`) pour ce serveur et sélectionnez ses identifiants et son modèle |
| **Activer A2A** | Commutateur A2A propre à ce serveur, avec sa propre Agent Card sur `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Activer A2A** | Commutateur A2A propre à ce serveur, avec sa propre Agent Card sur `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
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