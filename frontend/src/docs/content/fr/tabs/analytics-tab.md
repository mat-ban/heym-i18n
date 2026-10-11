# Onglet Analytics

L'onglet **Analytics** affiche les métriques d'exécution et les tendances de vos workflows. Surveillez l'utilisation, les performances et identifiez les goulots d'étranglement.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Regarder la démo Analytics</a></p>

## Statistiques récapitulatives

- **Total executions** – Nombre d'exécutions de workflows sur la période sélectionnée
- **Success rate** – Pourcentage d'exécutions réussies
- **Average duration** – Durée moyenne d'exécution
- **Time saved** – Temps total estimé économisé : les minutes économisées par exécution configurées pour chaque workflow × ses exécutions réussies, cumulées sur la fenêtre sélectionnée
- **Trends** – Indicateurs de hausse/baisse par rapport à la période précédente

## Plage temporelle

- **24h** – Dernières 24 heures
- **7d** – 7 derniers jours
- **30d** – 30 derniers jours
- **All** – Historique complet disponible

## Filtre de workflow

- Filtrez les métriques par un workflow spécifique
- **All workflows** – Agrégation sur l'ensemble des workflows

## Tables

Deux tables présentent l'utilisation des workflows : **Most Used** (plus large) et **Most Failed**.

- **Time Saved** – Most Used affiche le temps économisé cumulé de chaque workflow (minutes économisées par exécution × exécutions réussies). **Not Set** signifie que l'estimation est manquante ; cliquez dessus pour ouvrir ce champ sur le workflow.
- **Colonnes triables** – Cliquez sur l'en-tête d'une colonne pour trier selon cette colonne. Cliquez à nouveau pour basculer entre ordre croissant et décroissant. Des indicateurs fléchés affichent le sens du tri.
- **Libellés mobiles** – Sur petits écrans, les libellés de colonnes sont raccourcis (ex. « Executions » → « Runs », « Success » → « OK », « Error » → « Err ») afin que les tables s'adaptent sans défilement horizontal.

## Graphiques

- **Execution Volume Over Time** – Graphique linéaire des exécutions par intervalle de temps
- **Success vs Error Rate** – Graphique en aires comparant les exécutions saines et échouées
- **Average Latency Over Time** – Graphique linéaire montrant l'évolution des temps de réponse
- **Drag to select** – Cliquez et faites glisser sur n'importe quel graphique pour cibler une plage de dates personnalisée
- **Selection mode** – Les plages sélectionnées actualisent les cartes récapitulatives, les graphiques et les tables de workflows sans modifier le préréglage de base
- **Clear Selection** – Revenez à la fenêtre temporelle préréglée une fois l'analyse terminée

## Auto Refresh

- Activez l'actualisation automatique pour maintenir les métriques à jour sans rechargement manuel

## Voir aussi

- [Onglet Workflows](./workflows-tab.md) – Workflows mesurés
- [Onglet Traces](./traces-tab.md) – Inspection détaillée des traces
- [Onglet Logs](./logs-tab.md) – Logs d'exécution pour le débogage
- [Contextual Showcase](../reference/contextual-showcase.md) – Guide de page compact pour les surfaces du dashboard

Lorsqu'un graphique affiche une tendance que vous souhaitez voir signalée plutôt que surveiller vous-même, transformez-la en [alerte](./alerts-tab.md) : le nombre d'erreurs, la durée d'exécution, les dépenses LLM et le nombre d'exécutions peuvent tous se voir attribuer un seuil sur une fenêtre temporelle.
