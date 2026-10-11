# Exécution parallèle

Heym exécute les nœuds en parallèle lorsqu'ils n'ont aucune dépendance les uns envers les autres, et permet à plusieurs exécutions de Workflow de s'exécuter simultanément.

## Au sein d'une même exécution

### Ordonnancement basé sur le DAG

L'exécuteur regroupe les nœuds par **niveau d'exécution** à l'aide d'un graphe orienté acyclique (DAG) :

1. **Niveau 0** – Nœuds sans arêtes entrantes (nœuds de départ)
2. **Niveau N** – Nœuds dont toutes les dépendances amont se trouvent dans les niveaux 0..N-1

Les nœuds d'un même niveau n'ont aucune dépendance les uns envers les autres et s'exécutent en parallèle.

### Thread Pool

- **Pool partagé** : `ThreadPoolExecutor(max_workers=8)` pour l'exécution des nœuds
- **Ordonnancement** : `wait(..., return_when=FIRST_COMPLETED)` – dès qu'un nœud se termine, les nœuds en aval sont planifiés
- **Thread-safe** : les sorties des nœuds sont stockées avec un verrou (`store_node_output`)

### Sous-agents de l'orchestrateur

Lorsqu'un agent orchestrateur renvoie plusieurs appels d'outil `call_sub_agent` en un seul tour, ceux-ci s'exécutent en parallèle. Voir [Architecture des agents](./agent-architecture.md).

### Nœud Merge

Le nœud [Merge](../nodes/merge-node.md) combine les sorties de plusieurs branches parallèles. Utilisez-le lorsque vous devez explicitement combiner des résultats ; sinon, les branches parallèles peuvent se terminer dans des nœuds de sortie distincts.

### Boucles

Les itérations de boucle s'exécutent **séquentiellement**. Les nœuds du corps de la boucle sont replanifiés à chaque itération.

### Retour anticipé

Les nœuds de sortie avec `allowDownstream` peuvent retourner de manière anticipée. Le travail en aval restant s'exécute en arrière-plan.

## Exécutions concurrentes de Workflow

- **Aucun verrou par Workflow** – Plusieurs requêtes peuvent exécuter le même Workflow en même temps
- **API asynchrone** – Les endpoints FastAPI utilisent `asyncio.to_thread(execute_workflow)` afin que la boucle d'événements reste réactive
- **Isolation** – Chaque exécution dispose de sa propre instance `WorkflowExecutor` et de son propre état

Les Triggers qui exécutent des Workflows ([Webhook](./webhooks.md), [Portal](./portal.md), [Cron](./triggers.md), RabbitMQ, MCP, Editor) appellent chacun `execute_workflow` indépendamment.

## Streaming

Le streaming utilise le même modèle parallèle mais émet des événements au fur et à mesure que les nœuds se terminent. L'éditeur et l'interface de chat du portail utilisent le streaming en interne pour une progression en temps réel, et les utilisateurs de Webhook peuvent désormais opter pour le même flux d'événements via l'endpoint d'exécution [SSE Streaming](./sse-streaming.md).

## Voir aussi

- [Pourquoi Heym](../getting-started/why-heym.md) – Exécution parallèle par DAG dans le runtime Heym
- [Structure du Workflow](./workflow-structure.md) – Nœuds, arêtes et flux d'exécution
- [Concepts fondamentaux](../getting-started/core-concepts.md) – Vue d'ensemble du flux d'exécution
- [Types de nœuds](./node-types.md) – Nœud [Merge](../nodes/merge-node.md) et autres types
- [Triggers](./triggers.md) – Points d'entrée qui déclenchent les exécutions
- [SSE Streaming](./sse-streaming.md) – Format du flux d'événements pour `/execute/stream`
