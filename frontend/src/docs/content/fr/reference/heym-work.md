# Heym Work

**Heym Work** est une seconde interface pour les équipes métier, construite sur Heym. Les utilisateurs décrivent une tâche avec leurs propres mots, répondent à quelques questions et obtiennent un workflow créé et testé par Heym. Ils travaillent à partir de pages conçues pour eux, traitent les validations et voient chaque exécution associée au nom de son auteur. Heym exécute chaque tâche en arrière-plan.

Heym Work fonctionne dans son propre conteneur aux côtés de Heym, avec une licence distincte fournie par l'équipe Heym. Pour en savoir plus et demander un essai, rendez-vous sur [heym.run/enterprise](https://heym.run/enterprise). Regardez le [film de présentation Heym Work](https://youtu.be/5Z2gGo6bcpU) pour une visite guidée de deux minutes.

## Ce que reçoivent les équipes métier

| Domaine | Fonctionnalité |
|---------|----------------|
| **Chat** | Décrivez une tâche par saisie de texte ou à la voix. Heym demande les éléments nécessaires, construit le workflow, le teste et le marque comme Vérifié. |
| **Pages** | Des pages épinglées composées de widgets : indicateurs chiffrés, graphiques, tableaux avec puces d'état, zones de dépôt de fichiers et approbations. Une ligne de tableau peut ouvrir sa propre page de détail. |
| **Approbations** | Les révisions issues des étapes [Human-in-the-Loop](./human-in-the-loop.md) s'affichent dans Activité et sur les pages, avec les actions Approuver, Demander des modifications et Rejeter. |
| **Activité** | Chaque exécution, avec la personne qui l'a lancée et l'instance d'exécution. |
| **Rôles** | Propriétaire, Éditeur et Observateur. Les utilisateurs se connectent via le mécanisme [Single Sign-On](./sso.md) déjà configuré dans Heym. |
| **Éditions sectorielles** | Les éditions juridique, éducation, finance, logistique, énergie et commerce électronique s'ouvrent avec des pages, des données d'exemple et des workflows adaptés au secteur. |

## Connecter Heym Work

Regardez la [vidéo d'installation](https://youtu.be/zXGfg1HPSLk) pour découvrir toute la configuration, de la première commande à la page d'accueil.

La connexion est configurée dans **Paramètres → Heym Work**. Cet onglet n'apparaît que pour les administrateurs d'instance dont les adresses sont répertoriées dans `HEYM_ADMIN_EMAILS`.

| Champ | Fonctionnalité |
|-------|----------------|
| **Adresse Heym Work** | Emplacement d'exécution de Heym Work, par exemple `https://work.example.com`. La connexion y redirige l'utilisateur. Cliquez sur **Enregistrer**. |
| **Clé d'intégration** | **Générer une clé** crée la clé utilisée par Heym Work pour chaque requête transmise à Heym. Elle est affichée une seule fois, accompagnée d'un bouton de copie. Heym n'enregistre que son hachage. |
| **Activer Heym Work** | Active la connexion. L'adresse et une clé doivent d'abord être définies. |
| État | **Dernière activité**, **Version de Work** et **Licence**, selon le dernier rapport envoyé par Heym Work. |

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
