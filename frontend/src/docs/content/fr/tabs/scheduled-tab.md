# Onglet Planifications

L'onglet **Planifications** affiche tous les workflows cron actifs sur un calendrier visuel. Basculez entre les vues jour, semaine et mois pour visualiser le moment où vos automatisations sont planifiées.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Regarder la démo Planifications</a></p>

## Vues

- **Jour** – Chronologie heure par heure pour la journée sélectionnée ; chaque occurrence apparaît sous forme de bloc à l'heure planifiée
- **Semaine** – Grille à sept colonnes couvrant la semaine en cours ; les blocs s'empilent lorsque plusieurs workflows se déclenchent à la même heure
- **Mois** – Grille complète du mois ; chaque cellule répertorie les workflows planifiés pour ce jour

## Blocs de workflow

Chaque bloc affiche :

- **Nom du workflow** – Cliquez pour ouvrir directement le canvas du workflow
- **Expression cron** – Visible au survol, affichant la planification brute (ex. `0 9 * * 1-5`)

## Navigation

Les administrateurs d'instance répertoriés dans `HEYM_ADMIN_EMAILS` voient les planifications de tous les propriétaires lorsque **Afficher tous les workflows** est coché. Décochez cette option pour ne voir que leurs propres workflows. Les autres utilisateurs conservent l'option **Afficher les partagés avec moi**. Pour désactiver l'automatisation d'un employé, utilisez les [contrôles d'administration d'instance](./workflows-tab.md#instance-administration) dans l'aperçu Workflows afin de mettre en pause ou de reprendre les triggers.

- Utilisez les flèches **précédent / suivant** pour naviguer entre les jours, semaines ou mois
- Le bouton **Aujourd'hui** revient instantanément à la date actuelle

## Voir aussi

- [Nœud Cron](../nodes/cron-node.md) – Configurer les triggers planifiés sur le canvas
- [Onglet Workflows](./workflows-tab.md) – Gérer et organiser tous les workflows
- [Onglet Analytique](./analytics-tab.md) – Métriques et tendances d'exécution
