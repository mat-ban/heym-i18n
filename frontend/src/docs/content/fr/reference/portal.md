# Portal

Le **Portal** expose les workflows Heym sous forme d'interfaces de chat publiques. Les utilisateurs finaux peuvent exécuter des workflows via une URL sans se connecter à Heym.

## Fonctionnalités

- **URL publique** : `/chat/{slug}` (ex. `/chat/my-workflow`)
- **Interface de chat** : les utilisateurs interagissent via une interface de chat (messages, saisies, réponses)
- **Authentification optionnelle** : si des utilisateurs du portal sont configurés, la connexion est requise ; sinon le portal est public
- **Streaming** : progression des nœuds en temps réel pendant l'exécution (lorsque activé)
- **Arrêt des exécutions en cours** : les utilisateurs peuvent arrêter une exécution du portal en cours depuis le pied de page du chat ; l'exécution active du workflow est également annulée côté serveur
- **Téléversement de fichiers** : téléversements de fichiers optionnels (texte, images, etc.) par champ de saisie
- **Passage en revue humaine** : les exécutions du portal peuvent afficher des [liens de revue HITL](./human-in-the-loop.md) lorsqu'un agent se met en pause pour approbation
- **Affichage d'images** : les sorties de workflow contenant des images (par ex. issues de la génération d'images par LLM ou de captures d'écran Playwright) apparaissent sous forme de vignettes dans le chat. Cliquez sur une image pour l'ouvrir en plein écran ; appuyez sur **Esc** ou utilisez le bouton retour de l'appareil pour fermer

## Configuration du workflow

| Paramètre | Description |
|---------|-------------|
| `portal_enabled` | Activer le portal pour ce workflow |
| `portal_slug` | Slug d'URL (ex. `my-workflow` → `/chat/my-workflow`) |
| `portal_stream_enabled` | Utiliser l'exécution en streaming |
| `portal_file_upload_enabled` | Autoriser les téléversements de fichiers |
| `portal_file_config` | Configuration des fichiers par champ (types, limites) |

Configuration dans l'éditeur : le bouton **Portal** dans l'en-tête du workflow ouvre la boîte de dialogue des paramètres du portal.

## Flux

1. **Info** : `GET /api/portal/{slug}/info` – Renvoie les métadonnées du workflow et les champs de saisie (sans authentification)
2. **Connexion** (si requise) : `POST /api/portal/{slug}/login` – Renvoie un token de session
3. **Exécution** : `POST /api/portal/{slug}/execute` – L'interface de chat du portal appelle cet endpoint (ou sa variante en streaming en interne lorsqu'elle est activée) ; les utilisateurs finaux interagissent via l'interface de chat, et non en appelant l'API directement.
4. **Arrêt** : `POST /api/portal/{slug}/executions/{execution_id}/cancel` – Demandé lorsque l'utilisateur appuie sur **Stop** pendant une exécution active du portal

## Limite de simultanéité

Lorsque le workflow a une [limite de simultanéité](./webhooks.md#concurrency-limit-and-queued-runs) et que tous les slots sont utilisés, un message du portal attend son tour au lieu d'être exécuté immédiatement. Le chat affiche **Waiting in queue (2/5)** dans sa ligne de progression jusqu'à ce que l'exécution démarre, puis la réponse comme d'habitude. L'exécution a toujours lieu même si l'utilisateur ferme la page. **Stop** retire une exécution en attente de la file d'attente. Lorsque la file est pleine, le message échoue avec "Concurrency queue is full". Une exécution qui a attendu dans la file d'attente ne diffuse pas sa réponse token par token ; la réponse complète apparaît lorsqu'elle se termine.

## HITL dans les exécutions du portal

Si un workflow du portal atteint un [Nœud Agent](../nodes/agent-node.md) avec [Human-in-the-Loop](./human-in-the-loop.md) activé, la réponse du portal affiche un lien de revue au lieu de rester vide.

- Le statut d'exécution du workflow passe à `pending`
- Le chat du portal affiche l'URL de revue
- Tout nœud connecté à la sortie `review` de l'agent peut notifier Slack, l'e-mail ou d'autres canaux immédiatement
- Un relecteur complète la décision sur `/review/{token}` sans se connecter
- Après la revue, le workflow reprend à partir du snapshot stocké

Cela permet de combiner des flux de chat publics avec des étapes d'approbation humaine privées.

## Champs de saisie

Les champs de saisie proviennent des nœuds [Input](../nodes/input-node.md). L'API extrait les nœuds de départ de type `textInput` et leurs `inputFields`. L'exécution utilise le même moteur que les exécutions normales ; les saisies sont transmises via `body.inputs` et `conversation_history` pour les flux multi-tours.

## Authentification et sessions

- **WorkflowPortalUser** : nom d'utilisateur/mot de passe par workflow (lorsque l'authentification est activée)
- **Suppression du dernier utilisateur** : Lorsque le portail est activé, la suppression du dernier utilisateur du portail rend le portail à nouveau public ; la boîte de dialogue des paramètres demande d'abord confirmation
- **PortalSession** : tokens de session avec un TTL de 168 heures
- **Limitation de débit** : 3 tentatives de connexion échouées → bannissement de 24 h par workflow+IP
- Les sessions expirées sont nettoyées par une tâche cron

## Interface de configuration

Onglets de **WebPortalSettingsDialog** :

1. **General** : activer le portal, définir le slug, copier l'URL du portal
2. **Users** : ajouter/supprimer des utilisateurs du portal (nom d'utilisateur/mot de passe)
3. **Options** : mode streaming, téléversement de fichiers, affichage des champs de saisie

## Voir aussi

- [Pourquoi Heym](../getting-started/why-heym.md) – Le Portal comme surface de chat pour les agents en production
- [Onglet Workflows](../tabs/workflows-tab.md) – Créer des workflows et activer le portal
- [Human-in-the-Loop](./human-in-the-loop.md) – Pages de revue publiques pour les sorties d'agents en attente
- [Triggers](./triggers.md) – Le Portal comme point d'entrée
- [Types de nœuds](./node-types.md) – [Input](../nodes/input-node.md) pour les saisies du portal
- [Structure du workflow](./workflow-structure.md) – Nœuds et arêtes
