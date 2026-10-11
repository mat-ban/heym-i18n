# Pestanya Logs

La pestanya **Logs** mostra els logs dels contenidors Docker de la pila Heym. Utilitzeu-la per a la depuració, el monitoratge i la resolució de problemes. Per als logs d'execució de Workflow (resultats de Nodes, sortides), feu servir el panell Debug de l'editor de Workflow — vegeu [Canvas Features](../reference/canvas-features.md#execution-logs).

Els logs basats en Docker estan desactivats per defecte en desplegaments autoallotjats. Per activar-los, establiu `DOCKER_LOGS_ENABLED=true`, establiu `DOCKER_LOGS_ALLOWED_EMAILS` amb una llista separada per comes d'adreces electròniques d'usuaris de confiança que tinguin permès l'accés als logs de Docker, i assegureu-vos que `/var/run/docker.sock` estigui muntat dins del contenidor de backend. El servei Docker Compose per defecte i l'exemple directe de `docker run` inclouen aquest muntatge per a les eines MCP stdio basades en Docker; manteniu-lo només quan accepteu el límit de confiança del sòcol de Docker.

Si el registre està obert, creeu el compte d'administrador de confiança abans d'activar els logs de Docker o manteniu `ALLOW_REGISTER=false`; en cas contrari, un autoreglament no verificat podria reclamar una adreça electrònica de la llista permesa.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

## Selecció de contenidors

- **All Containers** – Logs combinats del backend, el frontend i PostgreSQL
- **Backend** – Contenidor `heym-backend`
- **Frontend** – Contenidor `heym-frontend`
- **PostgreSQL** – Contenidor `heym-postgres`

## Filtre de nivell de log

- **All** – Mostra tots els nivells de log
- **INFO** – INFO i superiors
- **WARNING** – Avisos i errors
- **ERROR** – Només errors
- **DEBUG** – Debug i superiors

## Cerca

- Filtreu els logs per cerca de text
- Les coincidències es ressalten a la sortida del log

## Funcionalitats

- **Auto scroll** – Desplaça's fins a baix a mesura que arriben logs nous
- **Stream** – Transmet logs en temps real (quan sigui compatible)
- **Copy** – Copia els logs al porta-retalls
- **Download** – Baixa els logs com a fitxer

## Casos d'ús

- Depurar errors d'execució de Workflow
- Inspeccionar els logs de petició/resposta de l'API
- Monitorar consultes a la base de dades
- Comprovar missatges d'inici i d'estat

## Relacionat

- [Canvas Features](../reference/canvas-features.md) – Logs d'execució al panell Debug del Workflow
- [Traces Tab](./traces-tab.md) – Inspecció de traces d'LLM
- [Analytics Tab](./analytics-tab.md) – Mètriques d'execució
- [Workflows Tab](./workflows-tab.md) – Gestió de Workflows
- [Contextual Showcase](../reference/contextual-showcase.md) – Guia compacta de pàgina per a les superfícies del tauler
