# Enterprise

Licences commerciales, support professionnel et services de déploiement pour la plateforme Heym.

## Vue d'ensemble

Heym est gratuit à utiliser et à auto-héberger sous sa licence source-available. Pour les organisations qui ont besoin de licences commerciales, d'une assistance au déploiement en production ou d'un support dédié, l'offre Enterprise fournit des services personnalisés de la part de l'équipe Heym.

| Service | Description |
|---------|-------------|
| **Support des agents en production** | Revues d'architecture, conseils sur la conception d'agents et de workflows, et assistance pratique pour la mise en production des agents |
| **Formation aux outils** | Sessions d'onboarding et formations pour votre équipe couvrant l'éditeur de workflow, les nœuds IA, les agents et les intégrations |
| **Questions-réponses Heym** | Accès direct à l'équipe d'ingénierie Heym pour les questions relatives à la plateforme, les bonnes pratiques et le dépannage |
| **Déploiement Kubernetes** | Assistance pour les configurations multi-worker-nodes, les sidecar containers, les stratégies de mise à l'échelle et la configuration de cluster |
| **Conseil en solutions** | Conception de solutions personnalisées pour votre cas d'usage spécifique, incluant la planification d'intégration et les recommandations d'architecture |
| **Support prioritaire et SLA** | Temps de réponse garantis et résolution prioritaire des incidents |
| **Développement personnalisé** | Développement de fonctionnalités et modifications adaptées aux exigences de votre organisation |

## Support des agents en production

L'équipe Heym vous aide à concevoir, construire et renforcer vos agents et workflows pour vos processus métier. Cela inclut l'analyse de vos besoins, la recommandation de configurations de nœuds et la vérification que vos workflows respectent les bonnes pratiques en matière de fiabilité, d'observabilité et de gouvernance.

Le support couvre tous les types de nœuds, notamment les Triggers [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) et [Cron](../nodes/cron-node.md) — ainsi que les patterns avancés tels que l'[orchestration multi-agents](./agent-architecture.md), les points de contrôle [Human-in-the-Loop](./human-in-the-loop.md) et l'[exécution parallèle](./parallel-execution.md) entre branches.

## Formation aux outils

Sessions de formation pratiques adaptées au niveau de compétence et aux cas d'usage de votre équipe :

- Éditeur de workflow et [fonctionnalités du canvas](./canvas-features.md)
- Nœuds alimentés par l'IA : [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Architecture d'agents](./agent-architecture.md) et orchestration multi-agents
- Gestion des [Identifiants](./credentials.md) et [intégrations tierces](./integrations.md)
- [Triggers](./triggers.md), [webhooks](./webhooks.md) et planification avec [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) et [variables globales](./global-variables.md)
- Collaboration [Teams](./teams.md) et [partage d'identifiants](./credentials-sharing.md)
- Déploiement du [Portal](./portal.md) pour les interfaces de chat destinées aux clients
- [Traces](../tabs/traces-tab.md) et [Évaluations](../tabs/evals-tab.md) pour l'observabilité des workflows IA

## Déploiement Kubernetes

Le guide standard [Exécution et déploiement](../getting-started/running-and-deployment.md) couvre Docker Compose pour les configurations de production sur serveur unique. Les clients Enterprise bénéficient d'une assistance pour les déploiements Kubernetes en production, en vue d'une haute disponibilité et d'une mise à l'échelle horizontale :

- **Plusieurs worker nodes** — Répartition des workers backend Heym sur plusieurs nœuds Kubernetes pour la redondance et l'équilibrage de charge
- **Sidecar containers** — Configuration des patterns sidecar pour la collecte de logs, les agents de monitoring, les service meshes (Istio, Linkerd) et l'injection de secrets (Vault)
- **Planification des ressources** — Requêtes/limites CPU et mémoire, pod disruption budgets et politiques d'autoscaling horizontal des pods
- **Réseau** — Configuration du contrôleur Ingress, terminaison TLS et communication interne entre les pods backend, frontend et base de données
- **Stockage persistant** — Provisionnement des volumes de base de données et de bases vectorielles avec StorageClass et stratégies de sauvegarde appropriées
- **Monitoring** — Intégration avec Prometheus, Grafana ou votre stack d'observabilité existante pour les métriques de conteneurs, les logs et les alertes

## Conseil en solutions

Chaque organisation exécute des agents sur des systèmes et avec des contraintes différents. L'équipe Heym propose des prestations de conseil pour vous aider à :

- Évaluer si Heym correspond à votre cas d'usage spécifique
- Concevoir des architectures d'agents et de workflows de bout en bout
- Planifier les intégrations avec votre infrastructure existante et vos services tiers
- Déboguer des workflows complexes et résoudre les incidents en production
- Migrer des workflows existants depuis des outils tels que n8n, Zapier ou Make.com

## Contact

Contactez l'équipe enterprise à l'adresse **enterprise@heym.run** pour les demandes de licence, les tarifs ou pour planifier un appel de présentation.
## Related

- [Exécution et déploiement](../getting-started/running-and-deployment.md) — Déploiement en production avec Docker Compose
- [Sécurité](./security.md) — Pratiques et configuration de sécurité de la plateforme
- [Exécution parallèle](./parallel-execution.md) — Modèle d'exécution multi-worker
- [Équipes](./teams.md) — Collaboration en équipe et partage des ressources
- [Ensemble des fonctionnalités](./features.md) — Aperçu complet des capacités de Heym
