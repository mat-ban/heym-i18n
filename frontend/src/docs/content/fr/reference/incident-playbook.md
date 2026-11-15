# Heym Incident Playbook (L0)

Utilisez ce playbook pour confirmer un incident Heym, évaluer l'impact sur les utilisateurs, déterminer la criticité, et identifier la procédure de récupération ainsi que l'intervenant approprié.

Procédures détaillées : [Heym Runbook (L1)](./operations-runbook.md)

Dernière révision : 2026-11-10. Portée : Heym auto-hébergé, instance unique ou cluster, sur Docker Compose ou Kubernetes.

## Passation de déploiement (Handover)

Remplissez ce tableau pour chaque environnement avant d'utiliser ces documents d'astreinte. Les noms, URL, objectifs de capacité et objectifs de reprise sont spécifiques à chaque déploiement. Les exemples du dépôt ne constituent pas un inventaire de production.

| Élément | Valeur du déploiement |
| --- | --- |
| Environnement et URL publique de Heym | `<environment>`, `<public-url>` |
| Astreinte plateforme et suppléant | `<rotation-or-contact>`, `<backup-contact>` |
| Canal d'incident et outil de suivi d'incidents | `<channel>`, `<tracker-url>` |
| Astreinte base de données et identifiant de base | `<contact>`, `<database-id>` |
| Responsables infrastructure, réseau et stockage | `<contacts>` |
| Responsable de release et système de déploiement | `<contact>`, `<deployment-url>` |
| Tableau de bord des erreurs applicatives, de la latence et de la disponibilité | `<dashboard-url>` |
| Tableau de bord du CPU, de la mémoire, du disque et des redémarrages de l'hôte ou des pods | `<dashboard-url>` |
| Tableau de bord des connexions, verrous, disque et réplication PostgreSQL | `<dashboard-url>` |
| Journaux et backend de traces OTel facultatif | `<logs-url>`, `<trace-url-or-disabled>` |
| Projet/fichiers Compose ou contexte/namespace Kubernetes | `<exact-target>` |
| Emplacements de l'instance principale (main), des workers, de la base de données et du stockage | `<services-or-deployments>`, `<storage-ids>` |
| Workflow de test (smoke) approuvé et résultat attendu | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Procédure de sauvegarde de la base et des fichiers, dernier test de restauration | `<procedure-url>`, `<test-date>` |
| Objectifs de temps de récupération (RTO) et de perte de données maximale (RPO) | `<RTO>`, `<RPO>` |

Conservez les contacts et les liens vers les tableaux de bord dans la copie opérationnelle restreinte du déploiement. Les éléments de preuve doivent contenir des identifiants, horodatages, compteurs et erreurs expurgées plutôt que des credentials ou des payloads de workflow.

## Inventaire de la plateforme

| Composant | Responsabilité | Implication lors d'un incident |
| --- | --- | --- |
| Frontend et backend principal | UI, API, MCP, Portal, exécution interactive | Vérifiez séparément la route publique et le processus principal |
| PostgreSQL | État de l'application, registre d'exécution, file d'attente des exécutions, créneaux de simultanéité, coordination et notifications | Une panne de base de données peut interrompre à la fois le traitement des requêtes et l'exécution en arrière-plan |
| Instances de worker, lorsque le mode cluster est activé | Exécutions d'arrière-plan éligibles en file d'attente | Des workers sains ne remplacent pas les endpoints publics de l'instance principale |
| Processus leader élu | Cron, évaluation des alertes, coordination d'arrière-plan | Un worker compatible peut devenir leader ; cela ne transforme pas son rôle en instance principale |
| Stockage persistant de l'instance principale | Fichiers Drive, plugins installés et espaces de travail d'agents de code | Restaurez le stockage avec l'instance principale ; router l'ingress vers un worker ne le restaure pas |
| Backend de sandbox sur chaque instance d'exécution | Conteneurs Docker ou pods Kubernetes pour l'exécution isolée | Un backend de sandbox défaillant peut impacter certains nœuds spécifiques pendant que l'UI fonctionne |
| Dépendances de workflow | Fournisseurs de modèles, serveurs MCP, API externes, banques de données et services de messagerie | Déterminez si une dépendance isolée ou l'ensemble de la plateforme est en échec |
| Collecteur OTel facultatif | Spans exportés de workflow, de nœud et d'outils d'Agent | L'absence de traces exportées ne prouve pas à elle seule l'échec d'une exécution |

La file d'attente intégrée de Heym utilise PostgreSQL. Redis, RabbitMQ et les magasins vectoriels peuvent être des dépendances de workflow ; ce ne sont pas des services obligatoires pour la file d'attente intégrée.

`GET /api/health` signale uniquement l'état de santé du processus et sa version. Il ne teste ni PostgreSQL, ni la file d'attente, ni l'élection de leader, ni la capacité des sandbox, ni la synchronisation des credentials. Une réponse positive est une vérification ponctuelle, non une garantie de disponibilité de bout en bout.

## Cinq premières minutes

| Étape | Action | Décision ou élément de preuve |
| --- | --- | --- |
| 1 | Acquitter l'alerte et vérifier l'environnement, le service et l'heure de début | Consigner les horodatages UTC et le changement de release/configuration le plus récent |
| 2 | Vérifier l'UI publique et `/api/health`, puis le backend principal direct | Un échec public avec un backend direct sain oriente vers un problème de routage ou de frontend |
| 3 | Vérifier la connectivité et la pression de connexion PostgreSQL | Router les pannes de base de données vers le L1 avant de redémarrer les services applicatifs |
| 4 | Vérifier l'état des conteneurs/pods, le CPU, la mémoire, le stockage et les erreurs récentes | Séparer les pannes d'infrastructure, la charge et les échecs propres aux workflows |
| 5 | En mode cluster, vérifier **Paramètres > Instances**, les états de file d'attente et les preuves de leader | Identifier la perte de l'instance principale, des workers hors ligne/incompatibles ou du travail réservé à l'instance principale |
| 6 | Assigner la sévérité et initier une atténuation d'après le tableau de routage | Pour P1/P2, ouvrir un incident et mobiliser immédiatement le responsable concerné |
| 7 | Vérifier l'exécution d'un workflow sécurisé en mode production et observer le rétablissement | Confirmer l'amélioration de l'âge de la file d'attente, des erreurs et des ressources ; définir l'heure de la prochaine mise à jour |

Si une release coïncide avec la défaillance, consultez [Déploiement défectueux ou régression de configuration](./operations-runbook.md#bad-deployment-or-configuration-regression). Vérifiez la compatibilité du schéma avant tout retour arrière.

## Sévérité et réponse

Ces objectifs de temps de réponse sont indicatifs. Appliquez la politique d'incident et l'impact métier de votre déploiement lorsqu'ils sont plus stricts.

| Sévérité | Exemples | Réponse |
| --- | --- | --- |
| P1 | Instance principale indisponible pour tous les utilisateurs ; base de données indisponible ou écritures en échec ; échecs d'exécution généralisés ; points d'entrée critiques indisponibles sur tous les workflows | Atténuation immédiate, dossier d'incident, astreinte plateforme et dépendances |
| P2 | File d'attente croissante ; perte de capacité worker ; épuisement imminent des connexions ; un workflow dégradant la capacité partagée ; OOM répétés | Démarrer l'atténuation immédiatement, objectif d'endiguement sous 15 minutes, dossier d'incident |
| P3 | Échec isolé d'un workflow ou d'un fournisseur ; impact limité avec capacité globale de plateforme saine | Responsable du workflow ou de la dépendance, suivi tracé et note d'astreinte |
| P4 | Signal informatif, tendance de capacité attendue, faux positif confirmé | Prendre acte, documenter et ajuster la surveillance si nécessaire |

## Routage des signaux vers le L1

Utilisez ces ancres relatives lors de la configuration des liens d'alerte. Si un service de surveillance nécessite une URL absolue, préfixez l'emplacement de votre copie opérationnelle hébergée.

| Signal | Commencer ici |
| --- | --- |
| UI/API indisponible, erreurs 5xx publiques, échec de vérification du processus | [UI ou API hors service](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL inaccessible, connexion refusée, échec d'écriture | [Base de données hors service](./operations-runbook.md#postgresql-down-or-not-writable) |
| Trop de clients, expiration du pool, attente de verrous, pic de connexions actives | [Connexions et verrous de base de données](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Redémarrage contrôlé du backend ou des workers nécessaire | [Redémarrage de service](./operations-runbook.md#controlled-service-restart) |
| Pic du nombre d'exécutions, de la durée totale, des tokens, du CPU ou de la mémoire | [Workflows les plus consommateurs de ressources](./operations-runbook.md#most-resource-consuming-workflows) |
| File d'attente croissante, exécutions en attente ou bloquées | [Engorgement de file d'attente](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instance hors ligne ou incompatible, worker inactif, problème d'ordonnancement ou de distribution | [Vérifications du mode cluster](./operations-runbook.md#cluster-mode-checks) |
| Instance principale perdue alors que les workers restent sains | [Instance principale indisponible](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Erreurs de Webhook, défaillances MCP/Portal, déconnexions SSE | [Endpoints d'ingress et d'exécution](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, disque plein, défaillance de volume persistant | [Problème de conteneur, de pod ou de stockage](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Erreurs de fournisseur d'Agent/LLM/MCP, 429, échec de credential | [Défaillance de modèle ou d'intégration](./operations-runbook.md#model-credential-or-integration-failure) |
| Échecs de sandbox pour Code, Playwright, skill ou agent de code | [Défaillance de sandbox](./operations-runbook.md#sandbox-failure) |
| La récupération ne peut atteindre les objectifs ; perte de base ou de fichiers | [Récupération et reprise après sinistre](./operations-runbook.md#recovery-and-disaster-response) |

## Escalade

| Constat | Mobiliser | Fournir |
| --- | --- | --- |
| Multiples interfaces ou workflows affectés | Astreinte plateforme et responsable d'incident | Environnement, périmètre, heure de début, mesures d'atténuation, prochain point |
| Base de données indisponible, saturée, verrouillée ou disque saturé | Astreinte base de données | ID de base, nombre de connexions, PID bloquants, erreurs expurgées, état du stockage |
| Panne de pod/nœud, attachement de stockage, capacité de sandbox | Responsable infrastructure/stockage | Contexte, namespace, charge de travail, événements de pod, pression sur les ressources |
| Route publique en échec alors que le backend direct fonctionne | Responsable réseau/ingress | Routes affectées, codes d'état, latence, comparaison avec le backend |
| Un workflow unique sature la charge ou échoue isolément | Propriétaire du workflow | ID de workflow/exécution, source de trigger, cadence, fenêtre temporelle, limites temporaires |
| Déploiement ou modification de configuration corrélée | Responsable de release | Digest d'image en cours, heure de déploiement, révision de schéma, dernière version saine |
| Quota, authentification ou disponibilité du fournisseur | Responsable credential ou intégration | Fournisseur, modèle/service, code d'état, identifiant de requête si sûr ; aucun secret |

Si l'impact P1/P2 persiste après la première mesure d'atténuation, escaladez immédiatement avec les éléments de preuve déjà recueillis. N'attendez pas d'avoir déterminé la cause racine intégrale.

## Comportements attendus en cas de panne

| Panne | Ce qui peut continuer | Première action |
| --- | --- | --- |
| PostgreSQL indisponible | Le frontend statique peut encore se charger | Restaurer l'accès à la base ; ne pas redémarrer chaque instance applicative |
| Instance principale indisponible, workers sains | Les travaux d'arrière-plan éligibles et la planification peuvent continuer si un worker compatible prend le lead | Restaurer l'instance principale avec son stockage persistant ; UI/API/MCP/Portal publics restent indisponibles |
| Worker indisponible | Les autres instances éligibles prennent en charge les travaux en file d'attente lors de leur réaffectation | Vérifier le placement, la capacité disponible et le rétablissement avant de réinjecter du trafic |
| Exécution interrompue | Les exécutions éligibles et récupérables peuvent redémarrer depuis le début, une seule fois | Vérifier la récupération automatique et les effets de bord externes avant tout rejeu manuel |
| Surcharge de travaux réservés à l'instance principale | Les workers peuvent rester inactifs | Réduire le flux entrant fautif ou augmenter la capacité de l'instance principale ; modifier les pondérations ne peut déplacer les travaux assignés |
| Alerting interne indisponible | Les systèmes externes de surveillance (uptime/DB/infra) peuvent encore fonctionner | Utiliser la surveillance externe à Heym ; les alertes Heym dépendent de la même base et du même ordonnanceur |
| Sandbox ou fournisseur indisponible | Les workflows sans cette dépendance peuvent continuer de fonctionner | Isoler les workflows affectés et réparer la dépendance |

## Rétablissement et clôture d'incident

1. Vérifiez l'accès public, l'accès à la base de données, l'éligibilité des instances cibles et l'exécution d'un workflow de test (smoke) sécurisé en mode production. Un test dans l'éditeur ne garantit pas la distribution vers les workers.
2. Observez au moins 10 minutes d'erreurs stables, de latence maîtrisée, d'utilisation raisonnable des ressources et de diminution de l'ancienneté de la file d'attente. Observez également la prochaine exécution planifiée critique attendue ou une vérification équivalente convenue.
3. Rapprochez les exécutions échouées, récupérées, ignorées, expirées et en attente avec les propriétaires des workflows. Vérifiez les effets de bord externes avant de rejouer des opérations.
4. Rétablissez progressivement les pauses de triggers, les limites et les pondérations de workers. Assignez un responsable et une date d'expiration à chaque restriction résiduelle.
5. Mettez à jour l'incident avec l'impact, la chronologie UTC, les actions menées, les preuves et les risques résiduels. Planifiez une revue de cause racine (post-mortem) pour les incidents P1/P2 et mettez à jour les deux documents si une procédure faisait défaut.

## Références opérationnelles associées

- [Configuration des commandes et vérifications L1](./operations-runbook.md#command-setup)
- [Exploitation et déploiement](../getting-started/running-and-deployment.md)
- [Répartition de charge](./cluster.md)
- [Déploiement Kubernetes](../getting-started/kubernetes.md)
- [Sécurité et rotation des clés](./security.md)
