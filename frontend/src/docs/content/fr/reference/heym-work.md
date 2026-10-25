# Heym Work

**Heym Work** est une seconde interface pour les équipes métier, construite sur Heym. Les utilisateurs décrivent une tâche avec leurs propres mots, répondent à quelques questions et obtiennent un workflow créé et testé par Heym. Ils travaillent à partir de pages conçues pour eux, traitent les validations et voient chaque exécution associée au nom de son auteur. Heym exécute chaque tâche en arrière-plan.

Heym Work fonctionne dans son propre conteneur aux côtés de Heym, avec une licence distincte fournie par l'équipe Heym. Pour en savoir plus et demander un essai, rendez-vous sur [heym.run/enterprise](https://heym.run/enterprise). Regardez le [film de présentation Heym Work](https://youtu.be/5Z2gGo6bcpU) pour une visite guidée de deux minutes.

## Ce que reçoivent les équipes métier

| Domaine | Fonctionnalité |
|---------|----------------|
| **Chat** | Décrivez une tâche par saisie de texte ou à la voix. Heym demande les éléments nécessaires, construit le workflow, le teste et le marque comme Vérifié. |
| **Flows** | Les éditeurs créent un flow à partir de choix plutôt que sur un canevas : ce qui le démarre, un brouillon d'IA facultatif et des actions dans Slack, Google Sheets et e-mail. Les réponses de Slack poursuivent l'exécution, et les approbations attendent également dans Activité. Voir [Flows](#flows). |
| **Pages** | Des pages épinglées composées de widgets : indicateurs chiffrés, graphiques, tableaux avec puces d'état, zones de dépôt de fichiers et approbations. Une ligne de tableau peut ouvrir sa propre page de détail. |
| **Approbations** | Les révisions issues des étapes [Human-in-the-Loop](./human-in-the-loop.md) s'affichent dans Activité et sur les pages, avec les actions Approuver, Demander des modifications et Rejeter. |
| **Activité** | Chaque exécution, avec la personne qui l'a lancée et l'instance d'exécution. |
| **Rôles** | Propriétaire, Éditeur et Observateur. Les utilisateurs se connectent via le mécanisme [Single Sign-On](./sso.md) déjà configuré dans Heym. |
| **Éditions sectorielles** | Les éditions juridique, éducation, finance, logistique, énergie et commerce électronique s'ouvrent avec des pages, des données d'exemple et des workflows adaptés au secteur. |

## Flows

**Flows** se trouve dans le menu de Heym Work pour les éditeurs et les propriétaires. Un flow est composé de choix plutôt que de nœuds, et Heym Work l'enregistre comme un workflow Heym ordinaire via l'API Heym, sous l'identité de la personne qui l'a créé. Les règles d'accès, l'historique des modifications et la synchronisation des triggers s'appliquent comme dans l'éditeur, et chaque exécution apparaît dans Activité comme toute autre.

| Partie | Choix |
|---|---|
| **Ce qui le démarre** | À la demande, selon un calendrier, sur un message Slack, lorsqu'un onglet Google Sheets change (lignes ajoutées, modifiées ou supprimées), ou lorsqu'un e-mail arrive dans une boîte de réception. Les triggers de feuille et d'e-mail vérifient toutes les 1, 5, 15 ou 60 minutes. |
| **Brouillon d'IA** (facultatif) | Un modèle et des instructions transforment ce qui a démarré le flow en texte pour les étapes suivantes. Un flow qui ne démarre pas à partir d'une feuille ou d'un e-mail peut d'abord lire les messages récents d'un canal ou d'un fil Slack. |
| **Ce qui se passe ensuite** | Des actions dans l'ordre, dans l'un des trois outils, quel que soit le déclencheur du flow. **Slack :** message de canal, message direct, formulaire, message avec boutons, approbation, réponse en fil, mise à jour de message et résultat final. **Google Sheets :** ajouter une ligne, ou mettre à jour la ligne modifiée. **E-mail :** envoyer un e-mail. |

- **Les réponses poursuivent l'exécution.** Une approbation, des boutons ou un formulaire suspendent l'exécution jusqu'à ce que quelqu'un réponde dans Slack. Une approbation attend également dans Activité, et une décision prise à l'un ou l'autre endroit retire les boutons du message Slack. Les étapes Slack ultérieures restent dans le fil du premier message.
- **Une seule carte Connexions.** Chaque flow affiche l'espace de travail Slack, le compte Google Sheets et les boîtes de réception dans lesquelles il lit et avec lesquelles il envoie. Ce sont des identifiants Heym : **Slack Bot** (un token de bot, `xoxb-…`), **Google Sheets**, **IMAP** et **SMTP** ; un identifiant manquant peut être ajouté depuis le flow lui-même.
- **Une seule application Slack pour chaque flow.** Dans l'application Slack, définissez l'URL de requête d'interactivité sur `https://<votre Heym>/api/slack/interactions/<id identifiant>` et l'URL des requêtes d'abonnements aux événements sur `https://<votre Heym>/api/slack/events/<id identifiant>`. Heym Work affiche les deux pour la connexion choisie. Tous les flows associés à cet identifiant les partagent.
- **Les triggers Slack choisissent ce qu'ils écoutent :** messages dans les canaux et DM, messages directs au bot, mentions du bot, ou messages dans un canal précis. Les propres publications du bot ne démarrent jamais un flow.
- **Exigences.** Les flows nécessitent Heym 0.0.131 ou ultérieur.

Les étapes construites par un flow sont les mêmes nœuds que vous pouvez utiliser sur le canevas : [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) et [Cron](../nodes/cron-node.md).

## Connecter Heym Work

Regardez la [vidéo d'installation](https://youtu.be/zXGfg1HPSLk) pour découvrir toute la configuration, de la première commande à la page d'accueil.

La connexion est configurée dans **Paramètres → Heym Work**. Cet onglet n'apparaît que pour les administrateurs d'instance dont les adresses sont répertoriées dans `HEYM_ADMIN_EMAILS`.

| Champ | Fonctionnalité |
|-------|----------------|
| **Adresse Heym Work** | Emplacement d'exécution de Heym Work, par exemple `https://work.example.com`. La connexion y redirige l'utilisateur. Cliquez sur **Enregistrer**. |
| **Clé d'intégration** | **Générer une clé** crée la clé utilisée par Heym Work pour chaque requête transmise à Heym. Elle est affichée une seule fois, accompagnée d'un bouton de copie. Heym n'enregistre que son hachage. |
| **Activer Heym Work** | Active la connexion. L'adresse et une clé doivent d'abord être définies. |
| **Éditions pour industries et équipes** | Les éditions juridique, éducation, finance, logistique, énergie et e-commerce, ainsi que les éditions IT, ventes, marketing et RH pour les équipes d'entreprise, s'ouvrent avec des pages, des exemples de données et des workflows dédiés. |

Ouvrez ensuite l'adresse de Heym Work pour terminer la configuration :

1. **Licence** : saisissez la clé de licence remise par l'équipe Heym.
2. **Heym** : indiquez l'adresse de Heym et la clé d'intégration.
3. **Propriétaire** : connectez-vous avec un compte désigné comme Propriétaire Heym Work.

La page d'accueil s'ouvre, prête pour l'équipe.

### Renouveler la clé

**Renouveler la clé** remplace la clé d'intégration. Heym Work cesse de fonctionner tant que la nouvelle clé n'y a pas été saisie, et tous les utilisateurs connectés à Heym Work sont déconnectés. Utilisez cette fonction en cas de fuite suspectée ou lors du départ d'un collaborateur ayant eu accès à la clé.

### Désactiver la connexion

Désactivez **Activer Heym Work** pour interrompre la connexion. Heym Work redemandera alors la clé de Heym. Heym continue d'exécuter l'ensemble des workflows, planifications et webhooks dans tous les cas.

## Modèle de sécurité

- **Chaque modification transite par Heym.** Heym Work lit les données affichées depuis la base de données de Heym et envoie chaque action à Heym via le canal protégé par clé, où Heym applique ses propres règles d'accès. Heym Work stocke ses données propres dans un schéma `heym_work` distinct.
- **La clé est hachée au repos.** Heym compare le hachage de la clé fournie et ne stocke jamais la clé en clair.
- **L'authentification reste gérée par Heym.** Les utilisateurs se connectent via Heym, auprès de votre fournisseur d'identité lorsque le [SSO](./sso.md) est activé.
- **Les modifications font l'objet d'un audit.** L'enregistrement de la connexion et le renouvellement de la clé inscrivent des événements `work_integration.update` et `work_integration.key_rotate` dans le [journal d'audit](./audit.md).

## Licences

Heym Work nécessite sa propre clé de licence, délivrée par l'équipe Heym. Chaque jour, Heym Work transmet à heym.run son identifiant de licence, un identifiant d'installation, le nombre d'utilisateurs actifs au cours des 30 derniers jours, le nombre total de membres, le nombre d'exécutions des dernières 24 heures ainsi que les versions de Heym et de Heym Work. Le contenu des workflows, les entrées, les sorties et les identifiants restent sur vos serveurs.

Si la synchronisation quotidienne échoue pendant 30 jours, un délai de grâce de 14 jours s'enclenche, après quoi l'interface Heym Work invite un Propriétaire à renseigner une clé. Une version d'évaluation reste active jusqu'à son terme et reprend dès son renouvellement par l'équipe Heym (une seule évaluation par installation). Heym lui-même continue de fonctionner sans interruption. Les réseaux sans accès Internet utilisent une licence hors ligne disponible auprès de enterprise@heym.run.

## Vidéos

Toutes les vidéos Heym Work sont réunies dans la [playlist Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Sujets connexes

- [Enterprise](./enterprise.md) : Licences commerciales et assistance
- [Single Sign-On](./sso.md) : L'authentification utilisée par Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md) : Les validations affichées dans Heym Work
- [Journal d'audit](./audit.md) : Les entrées générées par les modifications de connexion
- [Paramètres](./user-settings.md) : Emplacement de l'onglet Heym Work
