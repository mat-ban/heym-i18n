# Scheda Logs

La scheda **Logs** mostra i log dei container Docker per lo stack Heym. Utilizzarla per debug, monitoraggio e risoluzione dei problemi. Per i log di esecuzione dei workflow (risultati dei nodi, output), utilizzare il pannello Debug nell'editor dei workflow—vedere [Funzionalità del Canvas](../reference/canvas-features.md#execution-logs).

I log basati su Docker sono disabilitati per impostazione predefinita nelle distribuzioni self-hosted. Per abilitarli, impostare `DOCKER_LOGS_ENABLED=true`, impostare `DOCKER_LOGS_ALLOWED_EMAILS` su un elenco separato da virgole di email di utenti fidati autorizzati ad accedere ai log Docker, e assicurarsi che `/var/run/docker.sock` sia montato nel container backend. Il servizio Docker Compose predefinito e l'esempio diretto `docker run` includono tale mount per gli strumenti MCP stdio basati su Docker; mantenerlo solo quando si accetta il confine di fiducia del socket Docker.

Se la registrazione è aperta, creare l'account amministratore fidato prima di abilitare i log Docker oppure mantenere `ALLOW_REGISTER=false`; in caso contrario, una self-registration non verificata potrebbe rivendicare un'email presente nella allow-list.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Guarda la demo di Logs</a></p>

## Selezione del Container

- **All Containers** – Log combinati da backend, frontend e PostgreSQL
- **Backend** – Container `heym-backend`
- **Frontend** – Container `heym-frontend`
- **PostgreSQL** – Container `heym-postgres`

## Filtro del Livello di Log

- **All** – Mostra tutti i livelli di log
- **INFO** – INFO e superiori
- **WARNING** – Warning ed errori
- **ERROR** – Solo errori
- **DEBUG** – Debug e superiori

## Ricerca

- Filtrare i log tramite ricerca testuale
- Le corrispondenze sono evidenziate nell'output dei log

## Funzionalità

- **Auto scroll** – Scorrimento automatico verso il basso all'arrivo di nuovi log
- **Stream** – Streaming dei log in tempo reale (quando supportato)
- **Copy** – Copia dei log negli appunti
- **Download** – Download dei log come file

## Casi d'Uso

- Debug dei fallimenti di esecuzione dei workflow
- Ispezione dei log di richiesta/risposta delle API
- Monitoraggio delle query al database
- Verifica dei messaggi di avvio e di stato

## Correlati

- [Funzionalità del Canvas](../reference/canvas-features.md) – Log di esecuzione nel pannello Debug dei workflow
- [Scheda Traces](./traces-tab.md) – Ispezione delle tracce LLM
- [Scheda Analytics](./analytics-tab.md) – Metriche di esecuzione
- [Scheda Workflows](./workflows-tab.md) – Gestione dei workflow
- [Contextual Showcase](../reference/contextual-showcase.md) – Guida compatta delle pagine per le superfici della dashboard
