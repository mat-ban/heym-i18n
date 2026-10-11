# Log-fanen

**Log**-fanen viser Docker-containerlogs for Heym-stakken. Den kan bruges til fejlfinding, overvågning og fejlsøgning. For workflow-kørselslogs (node-resultater, output) anvendes Debug-panelet i workflow-editoren - se [Canvas-funktioner](../reference/canvas-features.md#execution-logs).

Docker-baserede logs er deaktiveret som standard i selvhostede installationer. For at aktivere dem skal `DOCKER_LOGS_ENABLED=true` angives, `DOCKER_LOGS_ALLOWED_EMAILS` skal sættes til en kommasepareret liste af tillidte brugeremails, der har adgang til Docker-logs, og `/var/run/docker.sock` skal monteres i backend-containeren. Standard Docker Compose-service og direkte `docker run`-eksempel inkluderer denne mount for Docker-baserede MCP stdio-værktøjer; behold kun denne, når Docker-socket-tillidsgrænsen accepteres.

Hvis registrering er åben, skal den tillidte administrator-konto oprettes før Docker-logs aktiveres, eller `ALLOW_REGISTER=false` skal beholdes; ellers kunne en uverificeret selvregistrering få adgang via en tilladt email.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Se Log-demo</a></p>

## Containervalg

- **Alle Containere** – Kombinerede logs fra backend, frontend og PostgreSQL
- **Backend** – `heym-backend`-container
- **Frontend** – `heym-frontend`-container
- **PostgreSQL** – `heym-postgres`-container

## Log-niveaufilter

- **Alle** – Vis alle log-niveauer
- **INFO** – INFO og derover
- **WARNING** – Advarsler og fejl
- **ERROR** – Kun fejl
- **DEBUG** – Debug og derover

## Søgning

- Filtrer logs via tekstsøgning
- Matches fremhæves i log-outputtet

## Funktioner

- **Autoscroll** – Scroll automatisk til bunden ved nye log-indgange
- **Stream** – Vis logs i realtid (når understøttet)
- **Kopiér** – Kopiér logs til udklipsholder
- **Download** – Download logs som fil

## Anvendelsestilfælde

- Fejlfinding af workflow-kørselsfejl
- Inspektion af API-forespørgsler/svar-logs
- Overvågning af databaseforespørgsler
- Kontrol af opstarts- og sundhedsbeskeder

## Relateret

- [Canvas-funktioner](../reference/canvas-features.md) – Kørselslogs i workflow Debug-panel
- [Traces-fanen](./traces-tab.md) – LLM-trace-inspektion
- [Analytics-fanen](./analytics-tab.md) – Kørselsstatistikker
- [Workflows-fanen](./workflows-tab.md) – Workflow-håndtering
- [Kontekstvisning](../reference/contextual-showcase.md) – Kompakt sideguide til dashboard-overflader
