# Répartition de la charge

Pointez une seconde instance Heym vers la même base de données PostgreSQL et elle rejoint le cluster en tant que worker. Les exécutions de Workflow en arrière-plan sont alors réparties entre les instances selon un pourcentage que vous définissez, afin que la machine qui sert l'interface et l'API ne soit pas également la seule à exécuter chaque Workflow.

Les instances ne communiquent jamais entre elles. C'est Postgres qui transporte le travail, de sorte qu'un worker n'a besoin d'aucun port ouvert, d'aucun certificat et d'aucune route de retour vers l'instance principale — uniquement d'un accès à la base de données.

## Rôles

Une instance est **main**, épinglée par une variable d'environnement. Elle sert l'interface, l'API, MCP et le portail de chat, et elle est propriétaire du stockage de fichiers et des plugins installés. Toute autre instance est un **worker** : elle n'accède qu'à la base de données et exécute les exécutions en arrière-plan.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

Le rôle main est distinct de l'élection du leader. Heym élit déjà un leader à travers le cluster pour prendre en charge le cron, l'évaluation des alertes et la récupération après incident ; si main tombe, le leadership bascule vers un worker en quelques secondes et les exécutions planifiées continuent de se déclencher. Le rôle main ne se déplace pas, car le stockage de fichiers ne peut pas le suivre.

## Ce qui peut quitter l'instance main

Le placement est décidé à partir des nœuds du Workflow avant le démarrage de l'exécution. Une exécution reste sur main lorsqu'un nœud qu'elle contient — y compris les nœuds à l'intérieur des sous-workflows qu'elle appelle — touche à quelque chose qui n'existe que sur une seule machine :

| Nœud | Pourquoi il reste sur main |
|---|---|
| Codex, OpenCode Go | L'espace de travail de l'agent de codage reste sur le disque local afin qu'un suivi puisse y reprendre |
| Agent avec une skill attachée | Le code de la skill lit et écrit sur Heym Drive |
| Drive, Converter, Google Drive | Ils lisent et écrivent des fichiers générés |
| Trigger File Upload | Le fichier téléversé atterrit sur le disque de main |
| Send Email | Les relais SMTP d'entreprise autorisent généralement une seule adresse source |
| Nœuds de plugin | Un plugin est installé sur le disque d'une seule instance |

**Tout le reste est distribué** — y compris le Nœud Code, Playwright et les outils Python de l'Agent. Chaque instance exécute la même image avec son propre socket Docker, donc un sandbox n'est pas une raison de garder une exécution sur main, et ce sont les nœuds les plus gourmands en CPU du produit.

Un Workflow dont le sous-workflow est choisi par une expression ne peut pas être inspecté à l'avance, il reste donc sur main.

## Choisir les pourcentages

Les poids sont des entiers définis sous **Settings → Instances**. Ce sont des **parts de toutes les instances susceptibles de prendre du travail à l'instant donné**, et non des pourcentages sur 100 : le planificateur divise par le total propre à ce pool.

Cette distinction apparaît dès qu'une instance disparaît. Avec `Main 41, Worker A 26, Worker B 33`, désactiver Worker B laisse un pool de 67, de sorte que Main reçoit réellement 41/67 = **61 %** et Worker A 26/67 = **39 %**. Le panneau affiche la répartition effective sous le tableau précisément pour cette raison, et l'enregistrement n'est jamais bloqué parce que les nombres ne totalisent pas 100 — seule une répartition où aucune instance activée n'a de poids est refusée.

Deux autres points sont faciles à mal interpréter.

**Un pourcentage n'est pas une part de puissance machine.** Il ne couvre que les exécutions qui passent par la file d'attente. Servir l'interface et l'API, diffuser en streaming les exécutions de l'éditeur et du portail, et gérer les téléversements de fichiers relèvent tous du travail de main et rien de tout cela n'est comptabilisé. Main fait plus que ce que son nombre indique.

**Le pourcentage de main est un plafond, pas un plancher.** Les exécutions qui ne peuvent s'exécuter que sur main sont imputées à son quota, de sorte qu'une fois ce quota épuisé, les exécutions distribuables restantes reviennent aux workers. Définir un nombre bas pour main est sans risque — le travail qui doit s'y exécuter s'y exécute quand même. Le définir haut affame les workers.

Ainsi, avec un main puissant et un worker plus modeste, commencez plutôt près de 60/40 que du ratio brut des machines, puis comparez les durées réelles d'exécution dans l'onglet Traces et ajustez.

Les poids sont renormalisés sur les instances actuellement actives et activées. Avec `main=70, A=15, B=15`, si A passe hors ligne, la répartition devient 70/85 et 15/85 entre main et B, et revient à 70/15/15 lorsque A réapparaît.

**Une instance qui revient ne se voit pas devoir les exécutions manquées.** Le temps passé Offline, Disabled ou sur une version incompatible n'est pas compté à son débit, de sorte qu'un worker indisponible pendant une nuit rejoint le pool à sa position courante et la répartition affiche à nouveau 70/30 dès sa première exécution — il n'absorbe pas toutes les exécutions jusqu'à avoir rattrapé son retard. Un worker resté disponible tout du long rattrape bel et bien, et c'est ce qui fait du pourcentage de main un plafond.
### Une nouvelle instance rejoint à zéro

Une instance à laquelle aucun poids n'a jamais été attribué démarre à 0, ce qui la laisserait Live, Enabled et ne recevant rien. **Attribuer automatiquement une part aux nouvelles instances** — activé par défaut, sous le tableau des instances — corrige cela : lors du prochain passage du leader, la nouvelle venue reçoit une part égale du pool, et les poids existants sont réduits proportionnellement en conservant leurs ratios entre eux, de sorte qu'un 70/30 délibéré reste globalement à 70/30 par la suite. Le total reste exactement à 100.

Cette opération s'exécute **une seule fois par instance**. Aussi bien le passage automatique que votre propre modification marquent l'instance comme configurée, de sorte qu'une instance que vous avez définie vous-même n'est jamais modifiée à votre insu — y compris une instance que vous avez délibérément fixée à 0. Désactivez ce paramètre si vous préférez que chaque nouvelle machine attende votre intervention.

Seules les instances activées, live et compatibles participent. Attribuer une part à une machine incapable d'exécuter quoi que ce soit laisserait cette part inutilisée.

### Quand les pourcentages ne peuvent pas aider

Le panneau de paramètres indique combien d'exécutions des dernières 24 heures n'ont pu s'effectuer que sur main. Si ce nombre est élevé — une charge de travail fortement orientée Codex ou Drive — les workers resteront inactifs quels que soient les poids, et la solution consiste à agrandir l'instance main plutôt qu'à en ajouter.

## Dimensionner PostgreSQL pour un cluster

Les connexions augmentent avec le nombre d'instances, pas seulement avec les utilisateurs. Chaque instance exécute plusieurs processus uvicorn, et chaque processus maintient un pool de connexions ainsi que quatre connexions `LISTEN` (annulation, réveils de file d'attente, résultats d'exécution, flux de chat). Les flux de chat ouverts partagent l'unique connexion de chat, ils n'ajoutent donc pas de connexions à la base de données. Un cluster de trois instances avec la valeur par défaut `max_connections = 100` sature, et Heym ne parvient alors plus à joindre sa propre base de données.

Prévoyez environ `instances x processus x (pool async + pool sync + 4)` et fixez `max_connections` au-dessus de ce résultat.

Réduisez les pools plutôt que de seulement relever le plafond. Un déploiement unique utilise par défaut 10+20 connexions async et 5+10 connexions sync par processus, ce qui est généreux pour une seule machine et bien trop pour un cluster :

| Variable | Instance unique | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Le fichier compose d'exemple définit ces valeurs ainsi que `max_connections = 300`. Cela fait passer un cluster de deux instances d'un plafond de 768 connexions à 192, avec trois instances toujours en dessous de 300.

## Exigences que le cluster ne peut pas imposer à votre place

**Chaque instance doit utiliser le même `SECRET_KEY` et le même `ENCRYPTION_KEY`.** Un worker doté d'un `ENCRYPTION_KEY` différent ne peut pas déchiffrer les identifiants, et chaque exécution utilisant un identifiant échouerait avec une erreur ne mentionnant rien d'utile. Heym compare un digest des deux clés à chaque heartbeat, ainsi que la version de l'application et la révision de la base de données, et marque une instance non concordante comme **Mismatch** afin qu'elle ne reçoive aucun travail. La charge retombe alors sur main jusqu'à correction.

Cela définit également l'ordre de mise à niveau. Mettre à niveau main en premier marque chaque worker comme incompatible ; le travail revient sur main, et chaque worker rejoint à mesure qu'il est mis à niveau. Plus lent, visible et réversible.

**Dirigez l'ingress uniquement vers l'instance main.** Un round-robin du trafic utilisateur entre les instances enverrait un fichier uploadé vers une machine et son téléchargement vers une autre. Rien dans le code ne l'empêche, car un worker exécute la même image et répondra à toute requête qu'il reçoit.

**Chaque instance a besoin de `FRONTEND_URL`, défini sur la même adresse publique.** Une exécution qui se met en pause pour une revue humaine génère son lien de revue sur l'instance qui l'a exécutée, et non sur main, et il en va de même pour les liens de suivi Codex et pour les URL de téléchargement des fichiers générés. Un worker dépourvu de cette variable construit ces liens à partir de sa propre adresse locale, et quiconque en reçoit un ne peut pas l'ouvrir.

**Les instances worker ont une IP sortante différente.** Toute API qui applique une allowlist d'adresses sources verra la nouvelle. Send Email s'exécute sur main précisément pour cette raison ; pour le nœud HTTP, attribuez au cluster une adresse NAT egress unique ou ajoutez chaque instance à l'allowlist.

## Ajouter un worker sur une autre machine

`docker-compose.worker.yml` à la racine du dépôt exécute un worker sur son propre hôte. Il n'a ni base de données ni UI : il joint le PostgreSQL de l'instance main et prend sa part des exécutions en arrière-plan.

Renseignez un fichier `.env` à côté — tag d'image, hôte et identifiants de la base de données, les deux clés, et un identifiant d'instance — puis démarrez-le. Compose refuse de démarrer tant que chaque valeur requise n'est pas définie, plutôt que de démarrer avec une valeur de remplacement qui échouerait plus tard d'une manière difficile à interpréter.

Le tag d'image doit correspondre à la version exécutée par main, et les deux clés doivent être copiées exactement. Une différence sur l'une ou l'autre fait apparaître le worker comme Mismatch et il ne reçoit aucun travail.
## Lecture de la table Instances

| Colonne | Signification |
|---|---|
| Name | Libellé modifiable ; il est apposé sur chaque exécution que cette instance réalise |
| Role | `main` ou `worker`, selon l'environnement |
| Status | **Live** avec un heartbeat récent, **Offline** après 30 secondes de silence, **Mismatch** lorsque la version, la révision de la base de données ou les clés diffèrent de celles de main |
| ms | Aller-retour entre cette instance et la base de données, mesuré par l'instance elle-même |
| On | Retirer un worker de la rotation sans l'arrêter — les exécutions en cours se terminent, aucune nouvelle ne lui est attribuée. Verrouillé sur on pour l'instance main : le travail sur les fichiers, les plugins et l'agent de codage s'y exécute quel que soit l'état du toggle |
| Weight | Sa part des exécutions distribuables |

## Limites de simultanéité dans un cluster

La [limite de simultanéité](./webhooks.md#concurrency-limit-and-queued-runs) d'un workflow est décomptée dans PostgreSQL, elle s'applique donc à chaque instance et à chaque processus : deux instances n'exécutent jamais plus d'exécutions d'un workflow que la limite ne l'autorise. Une exécution ayant attendu un emplacement est placée selon les mêmes règles que n'importe quelle autre exécution lorsqu'elle démarre, de sorte qu'une exécution devant rester sur main y reste. Le worker de file d'attente exécutant ces exécutions démarre désormais sur chaque installation, y compris une instance unique, où il ne réclame que les exécutions mises en file d'attente par sa propre instance. Cela signifie qu'une instance unique conserve également la connexion `LISTEN` de réveil de la file d'attente dans chaque processus ; prévoyez donc ses connexions de la même manière que pour une instance de cluster.

## Historique des exécutions

Chaque exécution de l'historique nomme l'instance qui l'a réalisée, et les deux boîtes de dialogue d'historique peuvent filtrer sur une seule instance. Le filtre correspond à l'id de l'instance tout en affichant son nom, de sorte que renommer une instance ne réécrit pas ce qu'indiquent les anciennes exécutions.

Rien de tout cela n'apparaît sur une installation mono-instance : les champs sont vides, aucun libellé n'est affiché et aucun filtre n'est proposé.

## Comportement en cas de défaillance

**Si un worker meurt en cours d'exécution**, son heartbeat devient obsolète et la passe de récupération existante du leader relance l'exécution sur une instance live. La ligne de file qu'il avait réservée est retirée séparément : une fois qu'aucune exécution active n'existe pour elle et qu'un délai de grâce de deux minutes s'est écoulé, le leader fait échouer la ligne et réveille quiconque attendait le résultat. L'ancienneté seule n'est jamais le trigger, de sorte qu'une exécution légitimement longue est laissée tranquille ; et la ligne est mise en échec plutôt que remise en file, car la récupération prend déjà en charge la relance et une remise en file exécuterait le même workflow deux fois.

**Si main tombe**, le cron continue de se déclencher depuis un worker et les exécutions distribuables continuent de s'exécuter. Les exécutions qui nécessitent main se mettent en file et attendent, puis s'écoulent à son retour — mais uniquement dans la fenêtre de grâce des misfires (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, 600 secondes par défaut). Tout ce qui est plus ancien est clôturé comme ignoré, avec la raison enregistrée, plutôt que de rejouer des heures d'arriéré d'un coup.

L'UI, l'API, MCP et l'éditeur sont indisponibles tant que main est down, car l'ingress pointe vers lui.

## Voir aussi

- [Running & Deployment](../getting-started/running-and-deployment.md) – Déployez d'abord une instance unique ; les variables d'environnement et la configuration des clés s'y trouvent
- [Settings](./user-settings.md) – L'onglet Instances, et qui peut le voir
- [Traces](../tabs/traces-tab.md) – Comparez les durées réelles d'exécution entre instances avant de modifier la répartition
- [Security](./security.md) – Pourquoi chaque instance doit partager `SECRET_KEY` et `ENCRYPTION_KEY`
