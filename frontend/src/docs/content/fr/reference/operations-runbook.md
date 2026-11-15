# Heym Runbook (L1)

Suivez ces procédures pour diagnostiquer et rétablir les services Heym, les connexions PostgreSQL, les files d'attente de workflows, la capacité du cluster et l'exécution en sandbox.

Commencez par le [Heym Incident Playbook (L0)](./incident-playbook.md) pour la sévérité, les contacts et l'inventaire de déploiement.

Dernière révision : 2026-11-10. Les commandes correspondent au dépôt au moment de la révision. Confirmez la version déployée et la topologie avant utilisation. Toutes les commandes modifiant le service ci-dessous sont des instructions destinées à un opérateur, et non une remédiation automatique.

## Index des procédures

| Incident |
| --- |
| [UI ou API indisponible](#ui-ou-api-indisponible) |
| [PostgreSQL indisponible ou non inscriptible](#postgresql-indisponible-ou-non-inscriptible) |
| [Connexions DB actives, saturation du pool et verrous](#connexions-db-actives-saturation-du-pool-et-verrous) |
| [Redémarrage contrôlé du service](#redémarrage-contrôlé-du-service) |
| [Workflows les plus consommateurs de ressources](#workflows-les-plus-consommateurs-de-ressources) |
| [Engorgement de la file d'attente ou exécutions apparemment bloquées](#engorgement-de-la-file-dattente-ou-exécutions-apparemment-bloquées) |
| [Vérifications du mode cluster](#vérifications-du-mode-cluster) |
| [Instance principale indisponible alors que les workers sont actifs](#instance-principale-indisponible-alors-que-les-workers-sont-actifs) |
| [Échecs de webhook, MCP, Portal ou streaming](#échecs-de-webhook-mcp-portal-ou-streaming) |
| [Problèmes de conteneur, pod, OOM ou stockage](#problèmes-de-conteneur-pod-oom-ou-stockage) |
| [Déploiement défectueux ou régression de configuration](#déploiement-défectueux-ou-régression-de-configuration) |
| [Échec de modèle, identifiant ou intégration](#échec-de-modèle-identifiant-ou-intégration) |
| [Échec de sandbox](#échec-de-sandbox) |
| [Reprise après sinistre et réponse d'urgence](#reprise-après-sinistre-et-réponse-durgence) |

## Configuration des commandes

Travaillez à partir du checkout déployé ou des outils de déploiement. Sélectionnez uniquement la topologie réellement en cours d'exécution dans l'environnement concerné. N'utilisez pas de projet d'exemple pour traiter un incident de production.

### Docker Compose

Définissez cet utilitaire shell pour l'installation Compose standard :
```bash
heym_compose() { docker compose -f docker-compose.yml "$@"; }
HEYM_MAIN_SERVICE=backend
HEYM_FRONTEND_SERVICE=frontend
```

Pour l'exemple de cluster du dépôt, utilisez plutôt cette définition :
```bash
heym_compose() { docker compose -f docker-compose.cluster.yml "$@"; }
HEYM_MAIN_SERVICE=main
HEYM_WORKER_SERVICE=worker-a
```

Pour un worker autonome sur son propre hôte, utilisez `docker compose -f docker-compose.worker.yml` et le service `worker`. Il ne possède aucun service PostgreSQL ou frontend local. Incluez le nom réel du projet, les fichiers d'écrasement et le fichier d'environnement dans l'utilitaire s'ils sont utilisés.
```bash
heym_compose ps
heym_compose images
heym_compose logs --since 15m --tail 200 "$HEYM_MAIN_SERVICE"
docker stats --no-stream
```

La stack Compose standard publie par défaut le frontend sur le port hôte `4017` et PostgreSQL sur le port `6543`. Son port backend `10105` est interne. L'exemple de cluster publie l'API de main sur `10105`, l'API de worker-a sur `10111` et PostgreSQL sur `6544`. Une image de release combine le frontend et le backend dans un seul conteneur. Vérifiez les mappages de ports avec `ps`.

Pour une vérification directe du processus backend dans un conteneur main Compose :
```bash
heym_compose exec -T "$HEYM_MAIN_SERVICE" uv run python -c \
  'import urllib.request; print(urllib.request.urlopen("http://127.0.0.1:10105/api/health", timeout=5).read().decode())'
```

### Kubernetes

Définissez le contexte, le namespace et les noms de charges de travail réels. Ces noms de déploiement correspondent uniquement aux exemples du dépôt.
```bash
HEYM_KUBE_CONTEXT='<actual-context>'
HEYM_NAMESPACE=heym
HEYM_MAIN_DEPLOYMENT=heym
HEYM_WORKER_DEPLOYMENT=heym-worker
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" get deployments,pods,svc,pvc
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" get events --sort-by=.lastTimestamp
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" logs \
  "deployment/$HEYM_MAIN_DEPLOYMENT" --all-containers=true --since=15m --tail=200
```

Le déploiement de base comprend un replica main unique avec la stratégie `Recreate`, un stockage persistant et une sonde de disponibilité sur `/api/health`. Son port de conteneur public est `4017` ; un worker purement backend utilise `10105`. Ne présumez pas qu'un redémarrage ou un déploiement se fera sans interruption. Voir [Comportement du déploiement Kubernetes](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#recreate-deployment).

### Santé et accès à l'API
```bash
HEYM_PUBLIC_URL='https://your-heym-host.example'
curl --fail --silent --show-error --connect-timeout 3 --max-time 10 \
  "$HEYM_PUBLIC_URL/api/health"
curl --silent --show-error --output /dev/null --write-out '%{http_code}\n' \
  --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/"
```

`/api/health` renvoie `status`, `service` et `version` ; il n'effectue aucun contrôle de dépendance. Confirmez la base de données et un workflow de bout en bout approuvé séparément.

Les exemples authentifiés ci-dessous utilisent un fichier de configuration curl provisionné hors de ce dépôt sous `$HEYM_CURL_CONFIG`, contenant l'en-tête `Authorization` de l'opérateur. Restreignez ses autorisations à l'opérateur, tenez-le hors du contrôle de version et supprimez les copies temporaires après utilisation. Ne collez pas de tokens dans les commandes, les URLs, les logs ou les notes d'incident. Utilisez une session UI authentifiée existante si possible. Inspectez les codes d'état et le schéma OpenAPI déployé sur le backend `/docs` avant de relancer une mutation ayant échoué.

### Accès SQL et limites des requêtes

Pour la base de données Compose intégrée, ouvrez une session avec l'identité configurée du conteneur de base de données :
```bash
heym_compose exec postgres sh -c \
  'exec psql -X -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

Pour une base de données externe, utilisez une définition de service `psql` approuvée et un fichier de mot de passe ou la console du fournisseur de base de données. Une connexion libpq utilise `postgresql://`, et non `postgresql+asyncpg://` de SQLAlchemy. Effectuez les tests depuis le chemin réseau de l'application concernée ainsi que depuis le chemin DBA.

Exécutez le SQL de diagnostic avec un rôle en lecture seule dans la mesure du possible. Au début de chaque session de diagnostic :
```sql
SET default_transaction_read_only = on;
SET statement_timeout = '5s';
SET lock_timeout = '1s';
SELECT now() AS observed_at, current_database(), pg_is_in_recovery();
```

Utilisez le nœud primaire inscriptible prévu pour les vérifications applicatives. Un replica peut répondre à `SELECT 1` alors que le chemin d'écriture est indisponible. Les détails de `pg_stat_activity` peuvent nécessiter des privilèges de surveillance de base de données ; les lignes masquées ou les champs NULL ne prouvent pas l'absence d'activité. Les requêtes de diagnostic ci-dessous omettent les payloads, secrets et textes SQL. Elles ne mettent pas à jour les tables Heym. Voir [Activité et visibilité PostgreSQL](https://www.postgresql.org/docs/16/monitoring-stats.html#MONITORING-PG-STAT-ACTIVITY-VIEW).

## Vérification partagée

Après chaque mesure d'atténuation, vérifiez l'accès public, la réactivité de la base de données, un workflow smoke approuvé et les métriques pertinentes de capacité/backlog. Utilisez un trigger sécurisé en mode production lors de la vérification de la répartition du cluster : les exécutions de test de l'éditeur restent sur l'instance réceptrice. Surveillez pendant au moins 10 minutes, plus la prochaine planification critique attendue ou une vérification convenue équivalente. Consignez les modifications et convenez d'un responsable/créneau pour inverser les restrictions temporaires.

## UI ou API indisponible

**Sévérité :** P1 en cas d'indisponibilité généralisée en production ; P2 en cas de dégradation partielle.

**Diagnostiquer**

1. Comparez l'UI publique, le `/api/health` public et la vérification directe du backend main depuis [Configuration des commandes](#configuration-des-commandes).
2. Inspectez l'état du conteneur ou pod main/frontend, les erreurs récentes ainsi que CPU/mémoire/disque. Le chargement d'une UI statique ne prouve pas que l'API fonctionne.
3. Exécutez la [vérification de la base de données](#postgresql-indisponible-ou-non-inscriptible). Inspectez la dernière version et les modifications d'ingress/proxy.
4. Si seules les requêtes authentifiées échouent, distinguez les sessions/SSO expirés d'une panne générale de l'API. Ne réinitialisez pas les clés partagées pour tester la connexion.

**Atténuer**

1. Réparez d'abord les dépendances de base de données ou de stockage lorsqu'elles expliquent la panne.
2. Si le backend direct fonctionne, restaurez la route frontend/proxy/ingress. L'ingress doit cibler main en mode cluster.
3. Si main est bloqué et que les dépendances sont saines, suivez [Redémarrage contrôlé du service](#redémarrage-contrôlé-du-service). Ne restaurez que le service frontend concerné lorsqu'il est le composant défaillant.
4. En cas de régression de version, suivez [Déploiement défectueux](#déploiement-défectueux-ou-régression-de-configuration).

**Vérifier :** L'UI publique se charge, l'accès à l'API authentifiée réussit et un workflow smoke se termine. Un endpoint de processus au vert seul est insuffisant.

**Escalader :** Astreinte plateforme en cas de panne backend ; responsable réseau/ingress lorsque seule la voie publique échoue ; responsable base de données ou stockage lorsque les contrôles de dépendances échouent.

## PostgreSQL indisponible ou non inscriptible

**Sévérité :** P1 lorsque les connexions ou écritures en production échouent ; P2 en cas de dégradation intermittente.

**Diagnostiquer**

Pour le PostgreSQL intégré :
```bash
heym_compose ps postgres
heym_compose logs --since 15m --tail 150 postgres
heym_compose exec -T postgres sh -c \
  'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

1. `pg_isready` vérifie si le serveur accepte les connexions. Confirmez l'accès SQL authentifié et l'état primaire à l'aide de l'[accès SQL](#configuration-des-commandes).
2. Depuis l'instance concernée, vérifiez le DNS, le routage, l'endpoint/port de base de données, TLS et la stratégie réseau. Une connexion DBA locale ne garantit pas l'accessibilité de l'application.
3. Lisez l'erreur assainie : connexion refusée/délai dépassé, échec d'authentification, épuisement des connexions, transaction en lecture seule, saturation du stockage ou échec de migration.
4. Vérifiez le disque/les inodes de l'hôte de base de données, les logs de la base, l'état de basculement/réplication et les événements de maintenance. Utilisez [Connexions et verrous](#connexions-db-actives-saturation-du-pool-et-verrous) en cas de saturation.

**Atténuer**

1. Réduisez l'absorption des producteurs et les tempêtes de réessais. Mettez en pause les triggers automatiques fautifs via Heym si son API fonctionne ; sinon, coordonnez la réduction du trafic en amont. Évitez les réexécutions massives.
2. Pour une base de données intégrée arrêtée avec un stockage intact vérifié et sans opération active de basculement/récupération, démarrez uniquement le service existant :
```bash
   heym_compose start postgres
   ```

3. Pour PostgreSQL managé, les pannes réseau, un disque saturé, une corruption ou un basculement, appliquez la procédure de récupération du responsable de base de données. Préservez le volume existant et les clés de chiffrement.
4. Une fois le primaire inscriptible accessible, laissez les pools/listeners se reconnecter. Ne redémarrez une instance applicative que si elle échoue toujours après le rétablissement de la base de données.
5. N'initialisez jamais une base de données de remplacement vide lors d'un incident, ne supprimez pas de fichiers WAL et n'exécutez pas `docker compose down -v`. La restauration suit la [Reprise après sinistre](#reprise-après-sinistre-et-réponse-durgence).

**Vérifier :** Le SQL applicatif fonctionne sur le primaire prévu, les écritures applicatives normales réussissent via le workflow smoke, les erreurs de connexion cessent, les heartbeats reprennent et l'âge de la file d'attente diminue.

**Escalader :** Astreinte base de données immédiatement pour P1, problèmes de primaire/basculement, corruption de données ou saturation du stockage. Transmettez l'identité de l'endpoint, les horodatages, la classe de statut/erreur et les preuves de stockage/connexion sans identifiants.

## Connexions DB actives, saturation du pool et verrous

**Sévérité :** P1 si aucun travail utile ne peut se connecter ; P2 si la pression ou les blocages dégradent l'exécution.

**Diagnostiquer**

Exécutez ceci sur le serveur PostgreSQL concerné. Le total est à l'échelle du serveur car d'autres bases consomment le même plafond de connexion. `active` exécute une requête ; `idle` est connecté sans requête en cours. Les deux consomment un slot. PostgreSQL réserve certains slots, de sorte que les clients ordinaires peuvent être refusés avant que le total n'atteigne `max_connections`.
```sql
SELECT current_setting('max_connections')::int AS max_connections,
       current_setting('superuser_reserved_connections')::int AS superuser_reserved,
       current_setting('reserved_connections', true) AS reserved_connections,
       count(*) FILTER (WHERE backend_type = 'client backend') AS client_connections,
       count(*) FILTER (WHERE backend_type = 'client backend'
                         AND state = 'active') AS active_connections,
       count(*) FILTER (WHERE backend_type = 'client backend'
                         AND state LIKE 'idle in transaction%') AS idle_in_transaction
FROM pg_stat_activity;

SELECT datname, application_name, usename, client_addr, state,
       wait_event_type, wait_event, count(*) AS connections
FROM pg_stat_activity
WHERE backend_type = 'client backend'
GROUP BY datname, application_name, usename, client_addr, state,
         wait_event_type, wait_event
ORDER BY connections DESC
LIMIT 50;
```

Heym étiquette les connexions du pool et des listeners avec `heym-<instance-id>`. Comparez le groupe de connexion aux heartbeats de l'instance et au nombre de processus. Un pool inactif est normal. Une population `idle in transaction` croissante nécessite une investigation.
```sql
SELECT pid, application_name, state,
       now() - xact_start AS transaction_age,
       CASE WHEN state = 'active' THEN now() - query_start END AS active_query_age,
       wait_event_type, wait_event, pg_blocking_pids(pid) AS blocking_pids
FROM pg_stat_activity
WHERE datname = current_database()
  AND backend_type = 'client backend'
  AND pid <> pg_backend_pid()
  AND (state = 'active' OR state LIKE 'idle in transaction%')
ORDER BY xact_start ASC NULLS LAST
LIMIT 30;
```

Distinguez l'épuisement du serveur (`too many clients`) d'un timeout de pool SQLAlchemy local. Un pool local peut saturer parce que les requêtes maintiennent des connexions ou attendent des verrous même lorsque le serveur a des slots disponibles.

Budgétez la charge maximale configurée, y compris l'overflow et chaque processus uvicorn :
```text
sum over instances:
  process_count * (async_pool_size + async_max_overflow
                   + sync_pool_size + sync_max_overflow + 4 listeners)
then add other clients, monitoring, and operational headroom
```

Les valeurs par défaut par processus sont `HEYM_DB_POOL_SIZE=10`, `HEYM_DB_MAX_OVERFLOW=20`, `HEYM_DB_SYNC_POOL_SIZE=5` et `HEYM_DB_SYNC_MAX_OVERFLOW=10`. Le point d'entrée standard du backend démarre 8 processus : sa charge théorique maximale est `8 * (10 + 20 + 5 + 10 + 4) = 392`, avant les autres clients. Les pools grandissent à la demande ; il s'agit d'un plafond, non du nombre ouvert attendu. La session dédiée du leader est réservée sur le pool asynchrone. Quatre connexions de listener existent par processus même sur une installation à instance unique ; les flux de chat partagent un listener.

Lisez les paramètres réels depuis le manifeste déployé. Les fichiers d'exemple écrasent certaines valeurs par défaut et nombres de processus. L'ajout de workers ajoute également des pools et des listeners ; cela peut aggraver la pression sur la base de données.

**Atténuer**

1. Régulez les charges de travail/producteurs identifiés. Préservez un accès DBA et une marge opérationnelle.
2. Demandez au responsable de base de données d'inspecter les bloqueurs/longues transactions individuels. Ne tuez pas en masse les sessions Heym : les listeners et la session de verrou consultatif du leader sont des chemins de coordination essentiels. L'annulation de requête et l'arrêt de session ont des effets différents ; le DBA doit cibler un coupable confirmé. Voir [Signaux du serveur PostgreSQL](https://www.postgresql.org/docs/16/functions-admin.html#FUNCTIONS-ADMIN-SIGNAL).
3. Si la capacité l'exige, réduisez la taille des pools/overflows ou le nombre de processus via la configuration de déploiement, puis drainez/recréez les instances une par une. Vérifiez la charge API et la capacité de l'exécuteur après réduction. Un changement de pool nécessite le remplacement du processus ; `restart` n'applique pas les variables d'environnement Compose modifiées.
4. `docker-compose.yml` ne transmet pas explicitement les quatre variables de pool. Ajoutez des remplacements d'environnement approuvés dans la configuration de déploiement réelle plutôt que de présumer qu'une entrée `.env` de l'hôte atteint le conteneur. Les exemples de cluster et de worker ont leurs propres mappages.
5. Coordonnez toute augmentation de `max_connections` avec le responsable de base de données et le budget mémoire. Évitez les reconnexions simultanées sur l'ensemble du parc.

**Vérifier :** Les connexions clientes totales se stabilisent avec une marge, les erreurs de pool cessent, les blocages disparaissent, les erreurs de listener/heartbeat s'arrêtent et le workflow smoke réussit.

**Escalader :** Responsable de base de données pour intervention sur bloqueur ou modifications du plafond de connexions ; responsable plateforme pour fuites de connexions, famine de pool ou tempêtes répétées de reconnexion.

## Redémarrage contrôlé du service

**Sévérité :** Hérite de la sévérité de l'incident. Le redémarrage de main interrompt le service public dans la topologie documentée.

**Avant de redémarrer**

1. Confirmez l'instance/le service cible et capturez les logs, le condensé de l'image, la raison du redémarrage et les IDs d'exécutions actives/en file d'attente. Confirmez que PostgreSQL et le stockage sont sains.
2. Réduisez la nouvelle absorption. Pour un worker, basculez **On** sur arrêt sous **Paramètres > Instances** dans l'UI ou définissez son poids sur 0. Drainez les travaux en cours avant de redémarrer.
3. Consultez [Récupération et annulation d'exécution](#déploiement-défectueux-ou-régression-de-configuration). Heym reprend les exécutions incomplètes en réexécutant les workflows éligibles depuis le début.
4. Ne supprimez pas de volumes, n'omettez pas les fichiers d'environnement et n'exécutez pas un simple `docker compose down`.

**Redémarrer un service avec une configuration inchangée**
```bash
# Compose main. Use the existing topology helper.
heym_compose restart -t 60 "$HEYM_MAIN_SERVICE"
heym_compose ps "$HEYM_MAIN_SERVICE"
heym_compose logs --since 5m --tail 150 "$HEYM_MAIN_SERVICE"
```

Pour un worker vidé dans l'exemple de cluster, substituez `$HEYM_WORKER_SERVICE`. Le délai d'arrêt de 60 secondes permet aux exécutions en cours de se terminer ou d'atteindre un état de pause propre avant SIGKILL.

**Redémarrage complet de la stack Compose**

Privilégiez les redémarrages service par service. Un redémarrage de stack arrête l'ensemble de la stack Compose, y compris PostgreSQL.
```bash
# Kubernetes main. Recreate strategy can cause downtime.
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout restart \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
  "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
```

Substituez `$HEYM_WORKER_DEPLOYMENT` pour un worker drainé. Un Deployment avec plusieurs replicas peut effectuer un redémarrage progressif. La stratégie `Recreate` sur main arrête l'ancien pod avant de planifier le nouveau : attendez-vous à une interruption égale à l'arrêt, la planification, le remontage de volume et le démarrage.

**Vérifier :** Les endpoints de santé du processus répondent, les connexions PostgreSQL se rétablissent, les heartbeats des workers reprennent dans **Paramètres > Instances** et le workflow smoke se termine.

**Escalader :** Astreinte plateforme si le démarrage se bloque ou si les sondes échouent ; astreinte base de données si le démarrage tourne en boucle sur les migrations.

## Workflows les plus consommateurs de ressources

**Sévérité :** P2 lorsque la charge du workflow dégrade les temps de réponse ; P1 si elle menace la disponibilité de la base de données, des workers ou du service public.

**Diagnostiquer**

Workflows récents classés par durée totale écoulée enregistrée :
```sql
SELECT h.workflow_id, w.name, w.owner_id,
       count(*) AS recorded_runs,
       count(*) FILTER (WHERE h.status IN ('error', 'failed', 'timeout')) AS failed_runs,
       round((sum(h.execution_time_ms) / 1000.0)::numeric, 1) AS total_elapsed_seconds,
       round((max(h.execution_time_ms) / 1000.0)::numeric, 1) AS max_elapsed_seconds
FROM execution_history h
JOIN workflows w ON w.id = h.workflow_id
WHERE h.started_at >= now() - interval '1 hour'
GROUP BY h.workflow_id, w.name, w.owner_id
ORDER BY total_elapsed_seconds DESC
LIMIT 20;
```

Pour identifier les workflows à fort volume, réexécutez la même requête avec `ORDER BY recorded_runs DESC`.

Workflows récents classés par durée moyenne avec au moins 5 exécutions :
```sql
SELECT a.execution_id, a.workflow_id, w.name,
       a.executed_by_instance_id, a.trigger_source,
       now() - a.started_at AS run_age,
       now() - a.heartbeat_at AS heartbeat_age,
       a.running_node_ids, a.attempt, a.recoverable, a.cancel_requested_at
FROM active_workflow_executions a
JOIN workflows w ON w.id = a.workflow_id
ORDER BY a.started_at
LIMIT 50;

SELECT t.workflow_id, w.name, count(*) AS trace_records,
       sum(coalesce(t.total_tokens, 0)) AS tokens
FROM llm_traces t
LEFT JOIN workflows w ON w.id = t.workflow_id
WHERE t.created_at >= now() - interval '1 hour'
GROUP BY t.workflow_id, w.name
ORDER BY tokens DESC
LIMIT 20;
```

Les identifiants de workflow NULL peuvent représenter une activité de chat ou d'assistant. Les enregistrements de trace ne sont pas générés pour les exécutions de test non persistées dans l'éditeur de canvas.

Mettez en corrélation le temps de base de données avec l'exécution au niveau des nœuds. Visualisez les goulots d'étranglement des nœuds dans l'[onglet Traces](../tabs/traces-tab.md). Corréléz l'exécution des workflows avec les pics de CPU, mémoire et connexions de base de données de l'hôte/pod.

**Atténuer**

1. En cas d'afflux de producteurs externes, régulez le consommateur webhook ou API au niveau de l'ingress ou de la passerelle API avant de modifier les définitions de workflows.
2. Un administrateur d'instance ayant accès au workflow peut suspendre ses triggers automatiques via l'endpoint supporté :
```bash
   HEYM_WORKFLOW_ID='<workflow-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --output /dev/null --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/pause-triggers"
   ```

   Suspendre les triggers automatiques n'arrête pas les travaux déjà en cours ou en file d'attente. Cela stoppe les futures invocations par planification, webhook et interrogation.

3. Pour une installation en cluster, définissez la capacité des workers sous **Paramètres > Instances** ou déplacez le trafic en ajustant les poids des workers.
4. Si une exécution active identifiée doit s'arrêter, demandez l'annulation en utilisant son identifiant d'exécution exact :
```bash
   HEYM_EXECUTION_ID='<execution-uuid>'
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 30 --request POST \
     "$HEYM_PUBLIC_URL/api/workflows/$HEYM_WORKFLOW_ID/executions/$HEYM_EXECUTION_ID/cancel"
   ```

   Confirmez l'état final dans l'historique et la suppression du registre. `cancel_requested` est asynchrone : les nœuds coopératifs s'arrêtent aux limites d'étapes, tandis que les appels HTTP ou LLM de longue durée terminent leur requête en cours avant de s'arrêter.

**Vérifier :** La fréquence d'exécution diminue, le CPU et la mémoire des workers reviennent à la normale, le nombre de connexions à la base de données se stabilise et les workflows de priorité normale reprennent selon leur planning.

**Escalader :** Propriétaire du workflow pour inspecter la logique ou réduire la fréquence de planification ; astreinte plateforme si l'annulation ne parvient pas à terminer l'exécution.

## Engorgement de la file d'attente ou exécutions apparemment bloquées

**Sévérité :** P2 lorsque la latence de la file d'attente dépasse les seuils métier ; P1 lorsque la croissance de la file menace les limites de stockage ou de connexions à la base de données.

**Diagnostiquer**

Prenez un instantané des lignes inachevées de la file d'attente. Le filtre d'état inclut les travaux inachevés plus anciens, et pas seulement les arrivées récentes.
```sql
SELECT status, placement, target_instance_id, count(*) AS runs,
       min(enqueued_at) AS oldest_enqueued_at,
       max(now() - enqueued_at) AS oldest_age
FROM workflow_run_queue
WHERE status IN ('held', 'queued', 'waiting_for_main', 'claimed')
GROUP BY status, placement, target_instance_id
ORDER BY oldest_enqueued_at;

SELECT q.execution_id, q.workflow_id, w.name, q.status, q.placement,
       q.target_instance_id, q.enqueued_at, q.not_after, q.expires_at,
       q.claimed_at, a.heartbeat_at, a.cancel_requested_at
FROM workflow_run_queue q
JOIN workflows w ON w.id = q.workflow_id
LEFT JOIN active_workflow_executions a ON a.execution_id = q.execution_id
WHERE q.status IN ('held', 'queued', 'waiting_for_main', 'claimed')
ORDER BY q.enqueued_at
LIMIT 50;
```

| État | Interprétation | Action |
| --- | --- | --- |
| `held` | En attente du slot de concurrence de production du workflow | Inspectez la limite de concurrence de ce workflow dans ses paramètres |
| `pending` | En attente d'affectation à un worker | Vérifiez l'éligibilité des workers et le décompte d'instances actives ci-dessous |
| `running` | Affecté à un worker, exécution active | Vérifiez le heartbeat du worker et la santé des threads |
| `waiting_hitl` | En pause pour approbation humaine | État attendu ; confirmez avec le propriétaire du workflow |
| `cancel_requested` | Annulation acquittée, en attente d'une limite d'étape | Surveillez l'arrêt ; escaladez en cas de blocage |

Vérifiez les exécutions obsolètes ou orphelines dont le worker affecté a cessé d'émettre des heartbeats :

1. Dans les installations à instance unique, confirmez que le service main dispose d'une capacité de concurrence restante.
2. Ouvrez **Paramètres > Instances** en tant qu'administrateur d'instance, ou effectuez la requête :
```bash
   curl --config "$HEYM_CURL_CONFIG" --fail --silent --show-error \
     --connect-timeout 3 --max-time 10 "$HEYM_PUBLIC_URL/api/admin/cluster"
   ```

3. Vérifiez `cluster_enabled`, `live`, `compatible`, `enabled`, `weight`, `credentials_synced`, l'âge du heartbeat, la latence DB et la disponibilité de la sandbox (`docker_ok`). Une instance doit être éligible et vivante pour recevoir des tâches distribuées. Le nom historique `docker_ok` couvre également l'accessibilité de la sandbox Kubernetes.
```sql
SELECT id, name, role, enabled, weight, weight_configured,
       version, schema_revision, docker_ok, db_latency_ms,
       now() - heartbeat_at AS heartbeat_age,
       now() - credentials_synced_at AS credential_sync_age
FROM cluster_instances
ORDER BY role, id;

SELECT executed_by_instance_id, status, count(*) AS recorded_runs
FROM execution_history
WHERE started_at >= now() - interval '1 hour'
GROUP BY executed_by_instance_id, status
ORDER BY executed_by_instance_id, status;
```

La vue SQL des heartbeats est une preuve, non un calcul complet de compatibilité. Utilisez l'API d'administration pour la logique de compatibilité et de rotation des clés. Les heartbeats s'exécutent toutes les 10 secondes ; un âge de heartbeat supérieur à 30 secondes indique un partitionnement réseau ou des processus workers bloqués.

**Atténuer**

1. Si les workers sont sains mais saturés, augmentez le nombre de réplicas de workers ou ajoutez des instances en suivant [Mise à l'échelle du cluster](#vérifications-du-mode-cluster).
2. Pour une exécution orpheline sur un worker arrêté, déclenchez la récupération ou annulez l'exécution avec [Récupération d'exécution](#redémarrage-contrôlé-du-service).
3. Si des exécutions en attente dépendent d'un worker désactivé ou incompatible, réactivez le worker ou mettez à jour ses identifiants sous **Paramètres > Instances**.
4. Si la file d'attente est inondée de requêtes en double à cause d'une tempête de réessais externes, suspendez le trigger au niveau de l'ingress ou utilisez [Mise en pause de workflow](#workflows-les-plus-consommateurs-de-ressources).

**Vérifier :** La longueur de la file d'attente diminue, les exécutions en attente passent à l'état running dans le délai attendu, et les heartbeats affichent une capacité de worker active.

**Escalader :** Astreinte plateforme pour les blocages de répartition du scheduler ; astreinte base de données si les requêtes d'interrogation de file présentent des conflits de verrouillage.

## Vérifications du mode cluster

**Sévérité :** P2 en cas de worker hors ligne ou de capacité dégradée ; P1 si la coordination du cluster échoue entièrement.

**Diagnostiquer**

La vue SQL des heartbeats fournit un aperçu de toutes les instances.

Champs clés :

- `compatible` : Doit être `true`. Un worker incompatible est exclu de la répartition.
- `heartbeat_age_seconds` : Les valeurs supérieures à 30 secondes indiquent des partitions réseau potentielles ou des processus workers bloqués.
- `weight` : Capacité relative du worker. Un poids de 0 désactive la répartition vers cette instance.
- `credentials_complete` : Doit être `true` pour les workflows nécessitant des identifiants partagés.

**Atténuer**

1. Pour un worker hors ligne, vérifiez l'état du pod/conteneur et les logs sur l'hôte worker. Suivez [Redémarrage de service](#redémarrage-contrôlé-du-service).
2. Pour un worker incompatible, vérifiez les versions d'image sur toutes les instances du cluster. Toutes les instances doivent exécuter la même version. Suivez [Déploiement défectueux](#déploiement-défectueux-ou-régression-de-configuration).
3. En cas d'identifiants manquants, mettez à jour les identifiants partagés depuis l'instance main sous **Paramètres > Identifiants**.
4. Pour drainer proprement un worker en vue d'une maintenance, définissez son poids sur 0 ou basculez **On** sur arrêt sous **Paramètres > Instances**. Laissez les travaux en cours se terminer avant l'arrêt.

**Vérifier :** Le heartbeat du worker reprend dans les 30 secondes, `compatible` est `true` et le workflow de test est distribué au worker rétabli.

**Escalader :** Astreinte plateforme pour partitionnement réseau entre instances ou conflit de verrous de base de données partagée.

## Instance principale indisponible alors que les workers sont actifs

**Sévérité :** P1. Main coordonne la planification, fournit l'UI/API et gère l'état du cluster.

**Diagnostiquer**

1. Confirmez l'état du processus main et l'utilisation des ressources à l'aide de la [Configuration des commandes](#configuration-des-commandes).
2. Vérifiez la connectivité à la base de données depuis l'hôte main. Les workers peuvent continuer à traiter les exécutions mises en cache localement alors que main est inaccessible.
3. Vérifiez le routage du reverse proxy / ingress vers l'instance main.

**Atténuer**

1. Si main s'est arrêté suite à un OOM ou une exception non gérée, redémarrez main selon [Redémarrage contrôlé du service](#redémarrage-contrôlé-du-service).
2. Si main attend un verrou de base de données détenu par un worker arrêté, suivez [Connexions et verrous](#connexions-db-actives-saturation-du-pool-et-verrous).
3. Dans Kubernetes, vérifiez que la stratégie `Recreate` a terminé l'arrêt du pod avant de planifier le remplaçant.

**Vérifier :** L'UI publique se charge, l'endpoint de santé de l'API renvoie HTTP 200, les heartbeats des workers du cluster signalent à nouveau leur activité à main et le canevas de l'éditeur fonctionne correctement.

**Escalader :** Incident Commander immédiatement ; astreinte plateforme pour les pannes de stockage ou de nœud.

## Échecs de webhook, MCP, Portal ou streaming

**Sévérité :** P2 pour une dégradation propre à un endpoint ; P1 si les webhooks publics échouent silencieusement sur tous les workflows.

**Diagnostiquer**

1. Pour les pannes de webhook, vérifiez le routage d'ingress, la terminaison SSL et la configuration du préfixe de chemin. Confirmez que l'endpoint webhook existe et est actif.
2. Pour les pannes de streaming SSE, vérifiez les paramètres de mise en mémoire tampon du proxy. Les proxys d'ingress (nginx, traefik, envoy) doivent désactiver la mise en mémoire tampon des réponses (`X-Accel-Buffering: no` ou équivalent) pour `/api/chat/stream` et le streaming d'exécution des workflows.
3. Pour les pannes MCP, vérifiez la validité de la clé API MCP, la configuration du transport (SSE vs stdio) et l'enregistrement de l'outil dans **Paramètres > MCP**.
4. Consultez les logs d'erreurs sur main pour détecter les échecs d'autorisation, les payloads JSON non valides ou les rejets de validation de schéma.

**Atténuer**

1. Désactivez la mise en mémoire tampon du proxy sur les chemins de streaming au niveau de l'ingress ou du reverse proxy.
2. En cas de rejet de payload de webhook, vérifiez la structure JSON par rapport à la spécification du trigger de workflow. Mettez à jour l'appelant externe si les payloads sont malformés.
3. En cas d'interruption de connexion MCP, redémarrez la session du client MCP concerné ou réauthentifiez-vous avec un nouveau token.

**Vérifier :** Le webhook de test répond avec HTTP 200/202, le flux SSE délivre des blocs incrémentiels sans interruption et le client MCP liste les outils avec succès.

**Escalader :** Astreinte réseau pour les problèmes d'ingress/mise en mémoire tampon ; auteur du workflow pour les incohérences de schéma de payload.

## Problèmes de conteneur, pod, OOM ou stockage

**Sévérité :** P1 si main ou la base de données est affecté ; P2 pour les redémarrages isolés de workers.

**Diagnostiquer**
```bash
# Compose container state and host filesystem pressure.
heym_compose ps
docker stats --no-stream
df -h
df -i
```

Vérifiez le système de fichiers réel du volume de données et l'hôte de base de données ainsi que l'hôte shell. État du conteneur en lecture seule sans valeurs d'environnement :
```bash
HEYM_CONTAINER_ID='<affected-container-id>'
docker inspect --format \
  '{{.Name}} status={{.State.Status}} oom={{.State.OOMKilled}} exit={{.State.ExitCode}} restarts={{.RestartCount}}' \
  "$HEYM_CONTAINER_ID"
```

```bash
HEYM_POD='<affected-pod>'
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" describe pod "$HEYM_POD"
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" logs "$HEYM_POD" \
  --all-containers=true --previous --tail=150
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" top pods --containers
```

Inspectez OOMKilled par rapport aux sondes défaillantes, à la récupération d'image, à la planification Pending, à la pression des nœuds et aux erreurs d'attachement/montage de volume. Les logs précédents n'existent que lorsque le pod a redémarré sans être replanifié.

## Déploiement défectueux ou régression de configuration

**Sévérité :** P1 si les connexions de production, le traitement des tâches ou les migrations échouent ; P2 pour des régressions de fonctionnalités isolées.

**Diagnostiquer :** Comparez l'heure de début de l'erreur avec le déploiement, les condensés réels d'images, la révision de configuration/secret, l'état des migrations et la dernière modification confirmée. Inspectez l'historique de déploiement et les diffs nettoyés. Ne collez jamais de variables d'environnement complètes, de secrets Compose rendus ou de données Secret Kubernetes dans un rapport d'incident.
```sql
SELECT version_num FROM alembic_version;
```

```bash
kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout history \
  "deployment/$HEYM_MAIN_DEPLOYMENT"
```

**Atténuer**

1. Arrêtez le déploiement et bloquez le trafic externe si les erreurs menacent l'intégrité des données ou se répercutent sur les dépendances.
2. Vérifiez le dernier condensé d'image, le commit Git et la révision Helm/manifeste connus comme fonctionnels. Inspectez les diffs récents de ConfigMap, Secret et d'environnement.
3. Si le schéma est compatible, restaurez l'image/la configuration approuvée à l'aide des outils de déploiement. Rétablissez une révision spécifique et vérifiée, et non une version précédente supposée :
```bash
   HEYM_ROLLBACK_REVISION='<approved-revision-number>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout undo \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --to-revision="$HEYM_ROLLBACK_REVISION"
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_NAMESPACE" rollout status \
     "deployment/$HEYM_MAIN_DEPLOYMENT" --timeout=180s
   ```

4. Le rollback d'un Deployment restaure le modèle de pod ; il ne restaure pas les valeurs externes de Secret ou de ConfigMap si elles ont été écrasées. Annulez les modifications de configuration en parallèle.
5. Ne rétrogradez jamais une image de release au-delà d'une migration de schéma de base de données incompatible. Si une migration a apporté des modifications irréversibles aux tables ou aux colonnes, corrigez vers l'avant avec un correctif testé ou restaurez la base de données via la [Reprise après sinistre](#reprise-après-sinistre-et-réponse-durgence).
6. Après le rollback, redémarrez les workers dépendants pour vous assurer que l'ensemble de la flotte exécute la même version de release.

**Vérifier :** Les contrôles de santé répondent avec 200, les workers signalent la même version de release dans **Paramètres > Instances**, la version de migration de schéma correspond à la version cible et le workflow smoke réussit.

**Escalader :** Incident Lead et ingénieur de release immédiatement pour P1. Sollicitez l'administrateur de base de données si un nettoyage de migration ou une restauration de schéma est nécessaire.

## Échec de modèle, identifiant ou intégration

**Sévérité :** P2 en cas de panne d'un fournisseur spécifique ou de limitation de débit ; P1 si aucun modèle configuré ne répond pour les workflows.

**Diagnostiquer**

1. Distinguez une panne côté fournisseur, l'expiration/révocation d'identifiants, une limitation de débit (HTTP 429) et des dépassements de délai réseau.
2. Consultez les pages d'état des fournisseurs (OpenAI, Anthropic, Google AI, etc.).
3. Testez la validité des identifiants depuis **Paramètres > Identifiants** à l'aide du bouton de test intégré.
4. Consultez les logs applicatifs pour identifier la classification de l'erreur : `RateLimitError`, `AuthenticationError`, `InvalidRequestError` ou `APIConnectionError`.

**Atténuer**

1. Pour la limitation de débit (429), basculez les nœuds de workflow vers un identifiant ou un modèle de secours disposant d'un quota disponible.
2. Pour les identifiants expirés, renouvelez la clé dans **Paramètres > Identifiants**. Heym met à jour les identifiants partagés sur tous les workers du cluster.
3. Pour les pannes de fournisseurs en amont, suspendez temporairement les workflows affectés ou configurez un routage de modèle alternatif.

**Vérifier :** Le test des identifiants réussit dans l'UI, l'exécution des agents se termine sans erreurs HTTP 4xx/5xx et les délais de réessai pour limitation de débit disparaissent.

**Escalader :** Propriétaire des identifiants / responsable d'équipe pour la facturation ou la regénération de clés ; support du fournisseur externe en cas de panne généralisée.

## Échec de sandbox

**Sévérité :** P2 pour des échecs isolés de nœuds de code ; P1 si l'exécution en sandbox est requise pour des workflows critiques.

**Diagnostiquer**

1. Identifiez le mode d'exécution de la sandbox : processus local, conteneur Docker ou pod sandbox Kubernetes.
2. Vérifiez la réactivité du démon Docker sur l'hôte sandbox ou la planification des pods sandbox Kubernetes.
3. Kubernetes : inspectez les pods sandbox dans le namespace sandbox configuré, leurs événements et les NetworkPolicies. Les sandboxes peuvent utiliser un namespace distinct :
```bash
   HEYM_SANDBOX_NAMESPACE='<actual-sandbox-namespace>'
   kubectl --context "$HEYM_KUBE_CONTEXT" -n "$HEYM_SANDBOX_NAMESPACE" get pods \
     -l app.kubernetes.io/managed-by=heym -L heym.run/sandbox,heym.run/instance
   ```

4. Vérifiez la configuration de `HEYM_SANDBOX_BACKEND` et les paramètres spécifiques au type de sandbox dans les variables d'environnement.
5. Si les conteneurs Docker échouent, assurez-vous que le socket Docker est monté et que l'utilisateur Heym dispose des permissions nécessaires pour interagir avec le démon.
6. Pour les sandboxes Kubernetes, assurez-vous que le ServiceAccount dispose des autorisations pour créer et gérer des pods dans le namespace sandbox.

**Vérifier :** Le nœud de code s'exécute avec succès dans la sandbox isolée, renvoie les sorties attendues et les ressources de la sandbox sont nettoyées après l'exécution.

**Escalader :** Astreinte plateforme pour les problèmes de démon Docker au niveau de l'hôte ou les pannes de l'infrastructure de sandbox Kubernetes.

## Reprise après sinistre et réponse d'urgence

**Sévérité :** P1 pour perte de données catastrophique, panne d'hôte ou destruction complète de l'environnement.

**Procédure**

1. Déclarez l'incident d'urgence et désignez un Incident Commander. Informez les parties prenantes via les canaux d'urgence établis.
2. Isolez l'environnement endommagé pour éviter toute perte de données supplémentaire ou écritures contradictoires. Empêchez les anciennes et nouvelles installations de traiter simultanément la même charge de travail.
3. Restaurez PostgreSQL via sa procédure de sauvegarde/PITR testée dans l'environnement de récupération prévu. Restaurez les données correspondantes de fichiers/plugins/espaces de travail de code de l'instance main ainsi que le trousseau de clés de chiffrement et le secret de signature requis depuis une sauvegarde sécurisée. Une sauvegarde uniquement de la base de données ne contient pas les octets des fichiers.
4. Démarrez une instance main unique prévue en utilisant une release compatible avec le schéma restauré. Inspectez les migrations avant le démarrage car le point d'entrée de main les exécute. Les workers ne doivent pas entrer en concurrence avec les migrations.
5. Maintenez l'ingress de production et les producteurs isolés pendant les vérifications. Une instance main démarrée peut élire un leader et exécuter les planifications/récupérations restaurées ; utilisez les restrictions réseau documentées et les contrôles de déclenchement/récupération de workflows de l'environnement de secours avant le démarrage. Restaurer des données n'est pas un aperçu passif.
6. Rapprochez les enregistrements actifs/en file d'attente/en attente et toute réexécution automatique avec les propriétaires. La récupération redémarre les exécutions éligibles depuis le début et ne peut pas annuler les effets en aval. Ne rejouez pas chaque ligne échouée ou ignorée.
7. Validez les lectures/écritures DB, la connexion, le déchiffrement des identifiants, les fichiers Drive, les plugins, l'accès à l'espace de travail des agents de code et les workflows smoke approuvés (uniquement main et distribuables). Ajoutez progressivement les workers compatibles, puis rouvrez l'ingestion et l'ingress.
8. Enregistrez l'intervalle réel de perte de données, la durée de récupération, le travail ignoré et le rapprochement restant. Organisez un autre test de restauration si cette procédure a révélé une faille.

**Vérifier :** La barrière de vérification partagée passe avec succès, les plannings critiques reprennent, les propriétaires acceptent le rapprochement et la surveillance de sauvegarde/restauration est rétablie. Une installation vide saine n'est pas une récupération.

**Escalader :** Incident Lead ainsi que responsables de base de données, de stockage et de plateforme en permanence. N'improvisez pas de réparation destructrice de répertoire de données ni d'activation double site.

## Modèle de preuves et de transmission
```text
Incident / severity / environment:
Impact and first observed time (UTC):
Main / worker / database / deployment identifiers:
Last release or configuration change:
Affected workflow IDs and execution IDs:
Public health / direct health / DB check:
Connection totals, blocker PIDs, queue depth and oldest age:
Instance eligibility, leader evidence, CPU / memory / disk:
Action taken, timestamp, operator, expected effect:
Verification result and observation window:
Temporary restrictions, reversal owner, expiry:
Skipped / failed / recovered work requiring reconciliation:
Next action, owner, next update time:
```

Capturez des logs et des identifiants délimités ; supprimez les valeurs d'identifiants, en-têtes d'authentification, liens de capabilité, payloads utilisateur et données de paramètres SQL avant de joindre des preuves. Les événements d'audit du routeur figurent sur le stdout de main. L'historique d'exécution enregistre l'instance exécutante ; les anomalies d'exécution peuvent donc nécessiter des logs des workers ainsi que de main.

## Références d'implémentation

Ces chemins identifient l'implémentation vérifiée lors de la rédaction de ce runbook. Revalidez-les lorsque le comportement d'exécution, de déploiement ou de schéma change.

| Sujet | Source |
| --- | --- |
| Services de santé et de démarrage | [main.py](https://github.com/heymrun/heym/blob/main/backend/app/main.py) |
| Paramètres de pool et étiquettes de connexion | [config.py](https://github.com/heymrun/heym/blob/main/backend/app/config.py), [session.py](https://github.com/heymrun/heym/blob/main/backend/app/db/session.py) |
| Nombre de processus et migrations | [Point d'entrée backend](https://github.com/heymrun/heym/blob/main/backend/entrypoint.sh), [Point d'entrée de release](https://github.com/heymrun/heym/blob/main/docker/release-entrypoint.sh) |
| Topologie de déploiement et mappages d'environnement réels | [Compose](https://github.com/heymrun/heym/blob/main/docker-compose.yml), [Exemple de cluster](https://github.com/heymrun/heym/blob/main/docker-compose.cluster.yml), [Exemple de worker](https://github.com/heymrun/heym/blob/main/docker-compose.worker.yml), [Kubernetes](../getting-started/kubernetes.md) |
| Éligibilité et liveness du registre | [registry.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/registry.py), [API de cluster](https://github.com/heymrun/heym/blob/main/backend/app/api/admin_cluster.py) |
| Placement, états de file d'attente et répartition | [node_placement.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/node_placement.py), [run_queue.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/run_queue.py), [dispatch.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cluster/dispatch.py) |
| Leadership et maintenance | [distributed_lock.py](https://github.com/heymrun/heym/blob/main/backend/app/services/distributed_lock.py), [cron_scheduler.py](https://github.com/heymrun/heym/blob/main/backend/app/services/cron_scheduler.py) |
| Récupération et annulation | [execution_recovery.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_recovery.py), [execution_cancellation.py](https://github.com/heymrun/heym/blob/main/backend/app/services/execution_cancellation.py) |
| Endpoints de pause/reprise/annulation de workflow | [workflows.py](https://github.com/heymrun/heym/blob/main/backend/app/api/workflows.py), [workflow_lifecycle.py](https://github.com/heymrun/heym/blob/main/backend/app/services/workflow_lifecycle.py) |
| Définitions des tables et colonnes de diagnostic | [models.py](https://github.com/heymrun/heym/blob/main/backend/app/db/models.py) |
| Interprétation de capacité et de coût | [Analytics](../tabs/analytics-tab.md), [Traces](../tabs/traces-tab.md), [Alerts](../tabs/alerts-tab.md) |
