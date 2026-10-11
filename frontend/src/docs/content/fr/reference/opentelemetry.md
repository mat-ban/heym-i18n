# Traçage OpenTelemetry

Heym peut émettre des traces [OpenTelemetry](https://opentelemetry.io/) pour chaque exécution de workflow, exécution de nœud et invocation d'outil d'Agent. Chaque exécution produit un span racine avec des spans enfants par nœud et par outil d'Agent, ce qui permet d'identifier l'étape en échec, sa durée, les appels effectués et les résultats retournés. Les spans sont exportés via OTLP/HTTP vers tout backend compatible tel que Jaeger, Grafana Tempo, Honeycomb, Datadog, New Relic ou Grafana Cloud.

Le traçage est **désactivé par défaut**. Lorsqu'il est désactivé, aucune surcharge mesurable n'est constatée et aucun span n'est créé.

## Activation du traçage

Définissez les variables d'environnement suivantes sur le backend, puis redémarrez-le :

Pour la liste complète des variables d'environnement, consultez [Environment Variables](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md).

| Variable | Valeur par défaut | Description |
|----------|---------|-------------|
| `HEYM_OTEL_ENABLED` | `false` | Interrupteur principal. Définir sur `true` pour activer le traçage. |
| `HEYM_OTEL_EXPORTER_OTLP_ENDPOINT` | `""` | Endpoint de base OTLP/HTTP, par exemple `http://collector:4318`. Heym envoie les spans à `<endpoint>/v1/traces`. |
| `HEYM_OTEL_EXPORTER_OTLP_HEADERS` | `""` | En-têtes `key=value` séparés par des virgules pour l'authentification de l'exportateur, par exemple `authorization=Bearer <token>`. |
| `HEYM_OTEL_SERVICE_NAME` | `heym` | L'attribut de ressource `service.name`. |
| `HEYM_OTEL_TRACES_SAMPLER_RATIO` | `1.0` | Ratio d'échantillonnage en tête entre `0.0` et `1.0`, appliqué avec un sampler basé sur le parent. |
| `HEYM_OTEL_CAPTURE_NODE_IO` | `false` | Lorsque défini sur `true`, attache les payloads d'entrée et de sortie tronqués des nœuds aux spans de nœud. Désactivé par défaut pour des raisons de confidentialité. |

Exemple minimal :

```bash
HEYM_OTEL_ENABLED=true
HEYM_OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
```

Vous pouvez confirmer la configuration active dans l'application sous **Settings → Observability** (accessible depuis votre avatar dans l'en-tête). Ce panneau est en lecture seule et n'affiche jamais les secrets de l'exportateur.

## Éléments tracés

### Span racine du workflow

Nom : `heym.workflow.execute`

| Attribut | Description |
|-----------|-------------|
| `heym.workflow.id` | L'UUID du workflow. |
| `heym.node.count` | Nombre de nœuds dans le workflow. |
| `heym.workflow.test_mode` | `true` pour les exécutions de test. |
| `heym.sub_workflow.depth` | Profondeur d'imbrication lors d'une invocation en tant que sous-workflow. |
| `heym.workflow.status` | Statut final de l'exécution. Une exécution en échec définit le statut du span sur `ERROR`. |

### Span de nœud

Nom : `heym.node.execute`, créé comme enfant du span du workflow.

| Attribut | Description |
|-----------|-------------|
| `heym.node.id` | L'identifiant du nœud. |
| `heym.node.type` | Le type de nœud, par exemple `agent`, `llm`, `http`. |
| `heym.node.label` | Le libellé du nœud affiché sur le canvas. |
| `heym.node.status` | `success` ou `error`. Les erreurs définissent le statut du span sur `ERROR`. |
| `heym.node.duration_ms` | Temps d'exécution du nœud en millisecondes. |
| `heym.llm.model` | Nom du modèle pour les nœuds LLM et Agent, lorsqu'il est disponible. |
| `heym.llm.prompt_tokens` / `heym.llm.completion_tokens` / `heym.llm.total_tokens` | Consommation de tokens pour les nœuds LLM et Agent, lorsqu'elle est disponible. |

Les spans de nœud s'imbriquent correctement sous le span du workflow même lorsque les nœuds s'exécutent en parallèle, car le contexte du workflow est propagé dans les threads de travail.

### Span d'outil d'Agent

Nom : `heym.agent.tool.execute`, créé sous le span du nœud Agent actif.

| Attribut | Description |
|-----------|-------------|
| `heym.agent.tool.name` | Nom de l'outil sélectionné par le modèle. |
| `heym.agent.tool.call_id` | Identifiant d'appel d'outil du fournisseur, lorsqu'il est disponible. |
| `heym.agent.tool.source` | Source de l'outil telle que `node_tool`, `mcp`, `skill` ou `sub_workflow`. |
| `heym.agent.tool.mcp_server` | Libellé du serveur MCP, le cas échéant. |
| `heym.agent.tool.iteration` | Itération de la boucle d'outils de l'Agent. |
| `heym.agent.tool.args_bytes` | Taille UTF-8 des arguments d'outil sérialisés. |
| `heym.agent.tool.result_bytes` | Taille UTF-8 du résultat d'outil sérialisé. |
| `heym.agent.tool.status` | `success`, `error`, `pending`, `timeout` ou `cancelled`. Les erreurs d'outil définissent le statut du span sur `ERROR`. |

Les arguments et résultats bruts des outils ne sont pas attachés aux spans par défaut.

## Sécurité des payloads d'outils d'Agent

Les payloads d'observabilité d'Agent persistés sont expurgés et tronqués dans le code (`4096` caractères par chaîne, profondeur `6`, `32768` caractères au total par écriture de trace LLM). Le budget total de trace est réparti entre les enregistrements d'outils afin qu'un résultat volumineux précoce ne puisse masquer l'identité et le statut de cycle de vie des appels ultérieurs. Les métadonnées de téléchargement bornées `_generated_files` sont réservées séparément de la sortie volumineuse des skills :

- Sections d'outils `request` / `response` des traces LLM, y compris les copies `_hitl_pending` écrites dans le stockage de traces
- Enregistrements `tool_calls` des résultats d'Agent affichés dans l'historique des exécutions
- Événements de résultat d'outil du panneau Live Debug, qui réutilisent le même enregistrement assaini et borné

L'exécution d'outil en direct, les messages d'outil liés au modèle et l'état de reprise HITL en mémoire (`_hitl_pending.agent_state.messages` / `tool_arguments`) conservent les valeurs d'origine afin que la reprise et la correspondance exacte des arguments fonctionnent toujours. Seules les copies d'observabilité stockées sont assainies.

## Propagation du contexte de trace

Heym suit le standard [W3C Trace Context](https://www.w3.org/TR/trace-context/) afin que les traces restent connectées au-delà des frontières entre services.

- **Webhooks entrants :** lorsqu'une requête entrante transporte un en-tête `traceparent`, l'exécution du workflow est enregistrée comme enfant de cette trace. Cela relie les exécutions Heym au système amont qui les a déclenchées.
- **HTTP sortant :** le nœud HTTP injecte `traceparent` dans les requêtes qu'il émet, permettant aux services en aval de poursuivre la même trace.
- **Sous-workflows :** l'exécution d'un sous-workflow est rattachée comme enfant au nœud qui l'a invoquée, préservant ainsi la hiérarchie des appels au sein d'une même trace.

Les Triggers dépourvus de contexte entrant (tels que Cron, IMAP, RabbitMQ et WebSocket) démarrent une nouvelle trace à chaque exécution.

## Fiabilité

- Un collecteur lent ou injoignable ne bloque jamais l'exécution d'un workflow. Les spans sont mis en lots et exportés en arrière-plan.
- Si l'initialisation du tracing échoue (par exemple, un endpoint invalide), le backend journalise l'erreur et poursuit avec le tracing désactivé plutôt que d'échouer au démarrage.
- Les en-têtes d'authentification OTLP sont lus uniquement depuis l'environnement. Ils ne sont jamais stockés dans la base de données et ne sont jamais renvoyés par l'API de statut.

## Voir aussi

- [Paramètres](./user-settings.md) – L'onglet Observabilité qui affiche l'état du tracing
- [Variables d'environnement](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) – Référence complète de configuration
- [Triggers](./triggers.md) – Comment les workflows démarrent, y compris via les webhooks
- [Historique des exécutions](./execution-history.md) – La vue d'historique par exécution intégrée à Heym
- [HTTP](../nodes/http-node.md) – Le nœud qui propage le contexte de trace aux appels en aval
