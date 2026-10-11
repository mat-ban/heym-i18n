# Onglet Logs

L'onglet **Logs** affiche les logs des conteneurs Docker de la stack Heym. Utilisez-le pour le débogage, la surveillance et la résolution des problèmes. Pour les logs d'exécution des workflows (résultats des nœuds, sorties), utilisez le panneau Debug dans l'éditeur de workflow — consultez [Fonctionnalités du Canvas](../reference/canvas-features.md#execution-logs).

Les logs Docker sont désactivés par défaut dans les déploiements auto-hébergés. Pour les activer, définissez `DOCKER_LOGS_ENABLED=true`, renseignez `DOCKER_LOGS_ALLOWED_EMAILS` avec une liste d'adresses e-mail d'utilisateurs de confiance séparées par des virgules, autorisées à accéder aux logs Docker, et assurez-vous que `/var/run/docker.sock` est monté dans le conteneur backend. Le service Docker Compose par défaut et l'exemple direct `docker run` incluent ce montage pour les outils MCP stdio basés sur Docker ; ne le conservez que si vous acceptez la frontière de confiance du socket Docker.

Si l'inscription est ouverte, créez le compte administrateur de confiance avant d'activer les logs Docker ou conservez `ALLOW_REGISTER=false` ; sinon, une auto-inscription non vérifiée pourrait revendiquer une adresse e-mail figurant sur la liste d'autorisation.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Regarder la démo Logs</a></p>

## Sélection du conteneur

- **All Containers** – Logs combinés du backend, du frontend et de PostgreSQL
- **Backend** – Conteneur `heym-backend`
- **Frontend** – Conteneur `heym-frontend`
- **PostgreSQL** – Conteneur `heym-postgres`

## Filtre par niveau de log

- **All** – Afficher tous les niveaux de log
- **INFO** – INFO et au-dessus
- **WARNING** – Avertissements et erreurs
- **ERROR** – Erreurs uniquement
- **DEBUG** – Debug et au-dessus

## Recherche

- Filtrer les logs par recherche textuelle
- Les correspondances sont mises en surbrillance dans la sortie des logs

## Fonctionnalités

- **Auto scroll** – Défilement automatique vers le bas à mesure que de nouveaux logs arrivent
- **Stream** – Diffusion des logs en temps réel (lorsque pris en charge)
- **Copy** – Copier les logs dans le presse-papiers
- **Download** – Télécharger les logs sous forme de fichier

## Cas d'usage

- Déboguer les échecs d'exécution de workflow
- Inspecter les logs de requêtes/réponses API
- Surveiller les requêtes de base de données
- Vérifier les messages de démarrage et de santé

## Voir aussi

- [Fonctionnalités du Canvas](../reference/canvas-features.md) – Logs d'exécution dans le panneau Debug du workflow
- [Onglet Traces](./traces-tab.md) – Inspection des traces LLM
- [Onglet Analytics](./analytics-tab.md) – Métriques d'exécution
- [Onglet Workflows](./workflows-tab.md) – Gestion des workflows
- [Contextual Showcase](../reference/contextual-showcase.md) – Guide de page compact pour les surfaces du dashboard
