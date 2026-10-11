# Tabblad Logs

Het tabblad **Logs** toont Docker-containerlogs voor de Heym-stack. Gebruik het voor foutopsporing, monitoring en probleemoplossing. Voor workflow-uitvoeringslogs (knooppuntresultaten, uitvoer) gebruikt u het Debug-paneel in de workflow-editor—zie [Canvas-functies](../reference/canvas-features.md#execution-logs).

Door Docker ondersteunde logs zijn standaard uitgeschakeld in zelf-gehoste implementaties. Om deze in te schakelen stelt u `DOCKER_LOGS_ENABLED=true` in, stelt u `DOCKER_LOGS_ALLOWED_EMAILS` in op een kommagescheiden lijst van vertrouwde e-mailadressen van gebruikers die toegang mogen krijgen tot Docker-logs, en zorgt u ervoor dat `/var/run/docker.sock` is gekoppeld in de backend-container. De standaard Docker Compose-service en het directe `docker run`-voorbeeld bevatten die koppeling voor Docker-gebaseerde MCP stdio-tools; behoud deze alleen wanneer u de vertrouwensgrens van de Docker-socket accepteert.

Als registratie open is, maakt u het vertrouwde beheerdersaccount aan voordat u Docker-logs inschakelt of houdt u `ALLOW_REGISTER=false` aan; anders zou een niet-geverifieerde zelfregistratie een e-mailadres op de toegangslijst kunnen claimen.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Bekijk de Logs-demo</a></p>

## Containerselectie

- **Alle containers** – Gecombineerde logs van backend, frontend en PostgreSQL
- **Backend** – `heym-backend`-container
- **Frontend** – `heym-frontend`-container
- **PostgreSQL** – `heym-postgres`-container

## Filter op logniveau

- **Alle** – Toon alle logniveaus
- **INFO** – INFO en hoger
- **WARNING** – Waarschuwingen en fouten
- **ERROR** – Alleen fouten
- **DEBUG** – Debug en hoger

## Zoeken

- Filter logs op tekstzoekopdracht
- Overeenkomsten worden gemarkeerd in de loguitvoer

## Functies

- **Automatisch scrollen** – Scroll naar beneden wanneer nieuwe logs binnenkomen
- **Stream** – Stream logs in realtime (indien ondersteund)
- **Kopiëren** – Kopieer logs naar het klembord
- **Downloaden** – Download logs als bestand

## Gebruiksscenario's

- Fouten bij workflow-uitvoering opsporen
- API-request/response-logs inspecteren
- Databasequery's monitoren
- Opstart- en gezondheidsberichten controleren

## Gerelateerd

- [Canvas-functies](../reference/canvas-features.md) – Uitvoeringslogs in het Debug-paneel van de workflow
- [Tabblad Traces](./traces-tab.md) – Inspectie van LLM-traces
- [Tabblad Analytics](./analytics-tab.md) – Uitvoeringsstatistieken
- [Tabblad Workflows](./workflows-tab.md) – Workflowbeheer
- [Contextuele showcase](../reference/contextual-showcase.md) – Compacte paginagids voor dashboardoppervlakken
