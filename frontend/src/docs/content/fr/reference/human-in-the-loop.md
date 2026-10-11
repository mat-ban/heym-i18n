# Human-in-the-Loop

Le Human-in-the-Loop (HITL) permet à un [Nœud Agent](../nodes/agent-node.md) de demander une approbation à des moments précis, d'attendre une décision humaine, puis de poursuivre le workflow à partir du même instantané d'exécution.

## Fonctionnement

- Ajoute des points de contrôle d'approbation explicites à un agent sans construire un workflow d'approbation distinct
- Crée une URL de révision publique à usage unique à l'adresse `/review/{token}`
- Permet à un réviseur d'`Accepter`, de `Modifier et continuer` ou de `Refuser`
- Marque l'exécution comme `pending` jusqu'à réception d'une décision
- Reprend l'exécution en pause et permet à l'agent de continuer après approbation
- Prend en charge plusieurs points de contrôle HITL séquentiels dans une même exécution d'agent

## Configuration de l'agent

Activez le HITL dans le panneau de propriétés de l'agent.

| Paramètre | Description |
|---------|-------------|
| `hitlEnabled` | Active la révision humaine pour cet agent |
| `hitlSummary` | Consignes d'approbation indiquant quand l'agent doit demander une révision humaine |

Le HITL ajoute un outil `request_human_review` à l'agent. Utilisez le prompt système et les consignes `hitlSummary` pour indiquer à l'agent quelles actions nécessitent une approbation. Lorsque l'agent estime qu'un point de contrôle doit être révisé, il envoie un unique texte de révision au format Markdown à la personne. Le résumé destiné au réviseur est généré à partir de la demande de l'agent au moment de l'exécution ; si l'agent l'omet, Heym en dérive un à partir du corps Markdown. En v1, le HITL prend en charge uniquement les sorties d'agent en mode texte, il ne peut donc pas être combiné avec `jsonOutputEnabled`.

Pour les outils MCP, Heym demande au modèle d'interpréter les instructions HITL écrites en l'une des trois portées d'approbation suivantes :

- `always` pour les formulations telles que « always », « on each » ou « for each »
- `once` pour les formulations telles que « once » ou « only one time »
- `never` pour les formulations telles que « never », « do not ask » ou « already approved »

Cette interprétation détermine si les appels MCP répétés déclenchent à nouveau une pause, restent approuvés une fois pour toutes, ou ignorent entièrement la révision humaine.

Lorsque le HITL est activé, l'agent expose également une seconde poignée de sortie sur le canvas intitulée `review`. Utilisez cette branche pour envoyer l'URL de révision en attente et le résumé vers Slack, e-mail, journalisation ou tout autre flux de notification pendant que l'exécution principale attend une personne.

## Flux de révision

1. L'agent atteint une étape nécessitant une approbation et appelle `request_human_review`
2. Heym crée une demande de révision publique et renvoie une URL de révision
3. Tous les nœuds connectés à la poignée `review` de l'agent s'exécutent immédiatement avec le payload HITL en attente
4. L'exécution du workflow passe à l'état `pending`
5. Un réviseur ouvre `/review/{token}` sans se connecter
6. Le réviseur choisit l'une des actions suivantes :
   - `Accept` poursuit avec le Markdown d'origine
   - `Edit & Continue` poursuit avec le Markdown modifié
   - `Refuse` poursuit avec `decision: "refused"` et ignore toute action ultérieure de l'agent
7. Heym reprend le workflow à partir de l'instantané stocké et permet à l'agent de continuer avec le contexte Markdown approuvé
8. Si une étape ultérieure nécessite également une approbation, l'agent peut à nouveau appeler le HITL et créer un autre point de contrôle en attente

Les liens de révision expirent après 168 heures si personne ne répond.

## Page de révision publique

La page de révision publique affiche :

- Le nom du workflow et le libellé de l'agent
- Un résumé du réviseur généré automatiquement à partir de la demande de révision de l'agent
- Le texte de révision Markdown en premier, comme contenu principal
- Une zone d'édition qui ne s'ouvre qu'après que le réviseur a cliqué sur `Edit`
- Un aperçu Markdown en direct pendant l'édition
- Des boutons d'action pour `Accept`, `Edit & Continue` et `Refuse`

Une fois une décision soumise, le token est verrouillé et ne peut plus être réutilisé.

## Sorties et état d'exécution

Pendant l'attente de la révision, la sortie de l'agent contient un payload en attente :

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Après la réponse du réviseur et la reprise du workflow, la sortie finale de l'agent inclut les métadonnées de décision :

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Utilisez `$agentLabel.decision` dans les nœuds en aval pour brancher selon les résultats accepted, edited ou refused.

## Branche de révision du canvas

La poignée de sortie `review` n'est disponible que lorsque `hitlEnabled` est activé pour un agent.

- Elle s'exécute avant l'arrivée de la décision humaine
- Elle reçoit le payload HITL en attente, incluant `summary`, `draftText`, `reviewUrl`, `shareText` et `shareMarkdown`
- Elle est destinée aux étapes de notification ou de transfert telles que Slack, e-mail ou journalisation d'audit
- Elle s'exécute une fois pour chaque point de contrôle HITL
- Elle ne s'exécute pas à nouveau après la réponse du réviseur ; seul le chemin de sortie normal de l'agent se poursuit lors de la reprise

## Où cela apparaît

- [Historique des exécutions](./execution-history.md) affiche immédiatement les exécutions `pending` et stocke l'URL de révision dans les résultats du nœud
- [Portal](./portal.md) : les réponses du Chat affichent le lien de révision humaine au lieu d'une réponse vide
- Le panneau Debug et les boîtes de dialogue de l'historique affichent la décision HITL finale et le texte révisé
- Le handle de sortie de révision peut notifier des canaux externes même lorsque le workflow a été déclenché par cron, curl ou du trafic portal
- Plusieurs points de contrôle HITL réutilisent la même entrée d'historique d'exécution tout en créant un nouveau lien de révision à usage unique pour chaque pause

## Limites actuelles

- HITL est disponible uniquement sur les nœuds Agent
- HITL utilise la sortie texte de l'agent et ne prend pas en charge la sortie JSON en v1
- Une exécution en pause reprend à partir du snapshot de workflow stocké, et non de la dernière version modifiée du workflow
- Les sous-workflows imbriqués ne peuvent pas entrer dans un état HITL en attente en v1 ; demandez une révision depuis l'agent parent avant de les appeler

## Voir aussi

- [Nœud Agent](../nodes/agent-node.md) - Configurer HITL sur un agent
- [Architecture des agents](./agent-architecture.md) - Comment les agents, les outils, les sous-agents et HITL s'articulent
- [Historique des exécutions](./execution-history.md) - Inspecter les exécutions en attente et reprises
- [Board](../tabs/board-tab.md) - Les exécutions de chaîne Board mettent la carte en pause dans un état en attente (ambre) lors d'un HITL
- [Portal](./portal.md) - Flux de Chat publics et liens de révision HITL
