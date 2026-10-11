# Onglet Exécutions

L'onglet **Exécutions** affiche les traces d'exécution des LLM. Inspectez les payloads de requête/réponse, les temps d'exécution, les appels d'outils et déboguez le comportement des nœuds [Agent](../nodes/agent-node.md) et [LLM](../reference/node-types.md), ainsi que les métriques agrégées (appels, tokens, coût, latence, taux d'erreur) sur n'importe quelle fenêtre temporelle.

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Regarder la démo des Exécutions</a></p>

## En-tête des statistiques

La page s'ouvre sur un résumé statistique au-dessus de la liste des exécutions, calculé sur la plage temporelle sélectionnée et les autres filtres actifs :

- **Cartes KPI** – Appels totaux, Tokens totaux, Coût total (USD), Latence moyenne, % d'erreurs
- **Tokens par modèle** – Graphique en anneau du volume de tokens par modèle
- **Coût par modèle** – Graphique en anneau des dépenses en USD par modèle. Les modèles sans tarification affichent un lien « Configurer la tarification » vers la [Table des coûts LLM](./datatable-tab.md#llm-cost-table-system-table)
- **Appels dans le temps** – Graphique en aires empilées des appels réussis vs échoués par intervalle (5 min / 1 h / 6 h / 1 jour, choisi automatiquement selon la plage)
- **Notification des modèles non tarifés** – Apparaît sous les graphiques lorsque certains modèles tracés n'ont pas de ligne de tarification, avec un lien vers la Table des coûts LLM

## Plage temporelle

Un unique sélecteur **Plage temporelle** en haut de la barre de filtres pilote à la fois l'en-tête des statistiques et la liste des exécutions. Choix disponibles : Dernière heure, Dernières 24 heures, 7 derniers jours (par défaut), 30 derniers jours, Tout l'historique. La modification de la plage réinitialise la pagination et recharge les graphiques et la liste simultanément.

## Liste des exécutions

- Liste paginée des exécutions récentes dans la plage temporelle sélectionnée
- Chaque exécution affiche : workflow, nœud, identifiant, horodatage, durée
- Cliquez sur une exécution pour ouvrir la vue détaillée
- Utilisez **Précédent / Suivant** dans la boîte de dialogue de détail pour naviguer entre les exécutions sans la fermer

## Filtrage

- **Plage temporelle** – 1h / 24h / 7j / 30j / Tout ; filtre les graphiques et la liste simultanément
- **Identifiant** – Filtrer par identifiant (clé API) utilisé
- **Source** – Filtrer par workflow ou source d'exécution
- **Recherche** – Rechercher par modèle, workflow, identifiant ou libellé de nœud
- **Actualiser** – Recharger la page courante des exécutions

## Détail d'une exécution

Lorsque vous ouvrez une exécution :

- **Étapes** – Une chronologie de haut en bas qui lit l'exécution comme une chaîne ordonnée : System → User → Assistant → Tool → Answer. Chaque étape est repliable ; en déplier une affiche un détail lisible (texte du message, ou arguments et résultat d'un outil) suivi du JSON de cette étape. Le contenu JSON de chaque type d'événement—y compris les appels MCP et les payloads JSON-RPC—s'ouvre par défaut dans une arborescence dépliable, avec le premier niveau déployé. Utilisez **Tree / Raw** pour basculer entre la structure formatée et le texte original. Le JSON malformé reste visible en texte brut. Les étapes d'outil affichent leur durée et un badge MCP/Skill le cas échéant, ainsi que les badges pending / timeout / cancelled lorsque le statut de l'appel d'outil est défini. L'étape Answer peut afficher des badges agrégés `tool_metrics` (nombre d'appels par statut et durée totale des outils). Lorsqu'une exécution enregistre chaque appel de modèle, comme le fait un message de Chat du Dashboard et un agent routé, une étape **LLM** précède les outils appelés par la requête, et la **Répartition de la durée** dispose chaque appel de modèle, outil et décision de routage sur une même chronologie. Un message de Chat du Dashboard constitue une seule exécution, quel que soit le nombre de cycles d'outils nécessaires. Les exécutions sans chaîne de messages (par exemple la génération d'images) affichent une chronologie minimale Request → Response.
- **Request** – Payload complet de la requête envoyé au LLM, avec les vues JSON **Tree / Raw**
- **Response** – Réponse du modèle, incluant les appels d'outils le cas échéant, avec les vues JSON **Tree / Raw**
- **Métriques d'outils** – Lorsqu'elles sont présentes sur la réponse, un résumé compact du nombre d'appels d'outils (`success` / `error` / `pending` / `timeout` / `cancelled`) et de la durée totale des outils
- **Répartition des temps** – `llm_ms`, `tools_ms`, `mcp_list_ms` pour l'analyse des performances
- **Appels d'outils** – Nom de l'outil, arguments, résultat, statut et temps écoulé
- **Skills inclus** – Skills transmis au modèle dans la requête
- **Aller au Workflow** – Accéder directement au workflow associé depuis la boîte de dialogue de détail de l'exécution

## Copie et export

- Copier le JSON de requête ou de réponse dans le presse-papiers ; la copie utilise toujours le payload brut complet, indépendamment de la vue active
- À utiliser pour le débogage ou le partage avec le support

## Maintenance

- **Tout effacer** – Supprimer toutes les exécutions enregistrées après confirmation
- Les contrôles de pagination affichent la plage visible courante (par exemple `1-25 of 240`)

## Voir aussi

- [Pourquoi Heym](../getting-started/why-heym.md) – Observabilité LLM sur l'ensemble du cycle de vie de l'agent
- [Nœud Agent](../nodes/agent-node.md) – Nœud Agent avec appel d'outils
- [Types de nœuds](../reference/node-types.md) – Nœuds LLM et Agent
- [Onglet Identifiants](./credentials-tab.md) – Identifiants utilisés dans les exécutions
- [Traçage OpenTelemetry](../reference/opentelemetry.md) – Export OTel opt-in pour les spans de workflow, de nœud et d'outils d'Agent
- [Onglet DataTable](./datatable-tab.md) – Héberge la Table des coûts LLM utilisée par le graphique de coûts
- [Vitrine contextuelle](../reference/contextual-showcase.md) – Guide de page compact pour les surfaces du dashboard
