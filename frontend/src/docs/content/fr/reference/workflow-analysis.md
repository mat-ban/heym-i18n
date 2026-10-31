# Analyse de Workflow

L'**Analyse de Workflow** est un panneau latéral gauche qui contient un document Markdown partagé et modifiable par workflow. Utilisez-le pour expliquer ce que fait un workflow et consigner des idées d'amélioration — et laissez l'IA générer une première ébauche pour vous.

Le document est partagé : toute personne ayant accès au workflow peut le lire et le modifier. Il est stocké avec le workflow et supprimé automatiquement lorsque le workflow est supprimé.

## Ouverture du panneau

1. Ouvrez un workflow dans l'éditeur.
2. Cliquez sur **Analyze** (icône Sparkles) dans la barre d'outils de l'éditeur.
3. Le panneau s'ouvre à gauche. La palette de nœuds (panneau gauche) se replie tant qu'il est ouvert ; la réouverture de la palette de nœuds ferme le panneau d'analyse.

Le panneau n'est disponible que pour les workflows enregistrés. Sur un workflow entièrement nouveau et non enregistré, enregistrez-le d'abord.

## Le document

Le panneau affiche un seul document Markdown avec deux vues, basculées par les boutons **Edit** (crayon) et **Preview** (œil) :

| Vue | Objectif |
|------|---------|
| **Edit** | Éditeur Markdown brut (textarea). |
| **Preview** | Markdown rendu. |

L'en-tête indique **qui a effectué la dernière modification** du document et quand.

### Enregistrement

Cliquez sur **Save** pour conserver vos modifications. Save n'est activé que lorsqu'il existe des modifications non enregistrées.

Le document étant partagé, les enregistrements utilisent une concurrence optimiste :

- Si quelqu'un d'autre a enregistré une version plus récente depuis l'ouverture du panneau, votre enregistrement est rejeté et un avertissement apparaît, nommant l'autre éditeur.
- Vous pouvez alors choisir **Reload (discard mine)** pour adopter la version du serveur, ou **Overwrite** pour forcer l'enregistrement de votre version par-dessus la sienne.

## Analyse IA

Sélectionnez un **Credential** et un **Model** LLM en haut du panneau (la liste des modèles se charge à partir du credential sélectionné — voir [Credentials](../tabs/credentials-tab.md)). Lancez ensuite l'analyse :

- **Analyze my workflow** — affiché lorsque le document est vide. Il diffuse en streaming un rapport Markdown généré par l'IA directement dans l'éditeur sous forme d'ébauche non enregistrée. Relisez-le et modifiez-le, puis cliquez sur **Save**.
- **Reanalyze** — affiché lorsque le document contient déjà du contenu. Il diffuse en streaming un nouveau rapport dans un **preview** distinct, laissant votre document actuel intact. Choisissez **Accept** pour remplacer le contenu de l'éditeur par la nouvelle analyse, ou **Discard** pour conserver ce que vous aviez.

Les deux actions **exécutent d'abord le workflow** (lorsqu'il est valide et exécutable) et incluent les résultats d'exécution dans le prompt d'analyse, afin que le rapport reflète le comportement réel du workflow. Si le workflow ne peut pas s'exécuter, l'analyse se poursuit à partir de sa structure statique.

Le rapport généré couvre trois sections, dans l'ordre : **Improvement areas** (suggestions concrètes, incluant un angle **security** chaque fois que le workflow touche à des credentials, à des saisies utilisateur, à des requêtes externes ou à une exposition de données), le **Purpose** du workflow, et **What it does** (un parcours étape par étape à travers les nœuds).

La section **Improvement areas** exécute toujours cinq vérifications explicites :

1. **Error coverage** — si le canvas ne contient aucun nœud [Error Handler](../nodes/error-handler-node.md) et qu'aucun workflow d'erreur n'est configuré, le rapport le signale et recommande d'ajouter une gestion des erreurs.
2. **Time saved** — si aucun temps estimé gagné par exécution n'est défini, le rapport recommande d'en configurer un afin que la métrique **Time Saved** des [Analytics](../tabs/analytics-tab.md) puisse être alimentée.
3. **Network nodes** — pour les nœuds effectuant des appels réseau (tels que [HTTP](../nodes/http-node.md) et les nœuds d'intégration), le rapport recommande une gestion des erreurs propre à ces nœuds (retry et/ou continue-on-error).
4. **Alerts** — lorsqu'aucune [alerte](../tabs/alerts-tab.md) n'est configurée pour le workflow, le rapport recommande de mettre en place des alertes avant la mise en production.

5. **Evals** : lorsque le workflow comporte un nœud [Agent](../nodes/agent-node.md) sans suite d'agent, le rapport recommande une **Agent Suite** (ou une **Prompt Suite**) dans [Evals](../tabs/evals-tab.md#agent-suites) ; lorsqu'il comporte un nœud [LLM](../nodes/llm-node.md), il recommande une **Prompt Suite** pour tester ce Prompt sur plusieurs modèles.

### Lancer l'analyseur depuis Properties

Lorsqu'un workflow comporte des nœuds sur le canvas mais aucun document d'analyse, un bouton **Run Analyzer** apparaît dans le panneau [Properties](./canvas-features.md) au niveau du workflow (affiché lorsqu'aucun nœud n'est sélectionné). Il ouvre ce panneau d'Analyse de Workflow afin que vous puissiez choisir un credential et un modèle et générer le rapport.

Chaque exécution d'analyse est enregistrée dans les [Traces](../tabs/traces-tab.md) sous la source **Workflow Analysis**.

Si aucun credential LLM n'est configuré, le bouton Analyze est désactivé — ajoutez-en un dans l'[onglet Credentials](../tabs/credentials-tab.md).

## Voir aussi

- [AI Assistant](./ai-assistant.md) — générer ou modifier des nœuds de workflow à partir du langage naturel.
- [Sticky Note](../nodes/sticky-note-node.md) — pour de courtes notes épinglées directement sur le canvas.
