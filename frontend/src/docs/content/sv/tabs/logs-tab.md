# Fliken Loggar

Fliken **Loggar** visar Docker-containerloggar för Heym-stacken. Den används för felsökning, övervakning och problemlösning. För loggar över workflow-körningar (nodresultat, utdata), använd Debug-panelen i workflow-editorn – se [Canvas-funktioner](../reference/canvas-features.md#execution-logs).

Docker-baserade loggar är inaktiverade som standard i självhostade distributioner. För att aktivera dem, ange `DOCKER_LOGS_ENABLED=true`, ange `DOCKER_LOGS_ALLOWED_EMAILS` till en kommaseparerad lista över betrodda användares e-postadresser som tillåts komma åt Docker-loggar, och säkerställ att `/var/run/docker.sock` är monterad i backend-containern. Standardtjänsten i Docker Compose och exemplet med direkt `docker run` inkluderar den monteringen för Docker-baserade MCP stdio-verktyg; behåll den endast när Docker-socketens förtroendegräns accepteras.

Om registrering är öppen, skapa det betrodda admin-kontot innan Docker-loggar aktiveras eller behåll `ALLOW_REGISTER=false`; annars skulle en overifierad självregistrering kunna göra anspråk på en e-postadress som finns i tillåtelselistan.

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Se demo av Loggar</a></p>

## Val av container

- **Alla containrar** – Kombinerade loggar från backend, frontend och PostgreSQL
- **Backend** – containern `heym-backend`
- **Frontend** – containern `heym-frontend`
- **PostgreSQL** – containern `heym-postgres`

## Filter för loggnivå

- **Alla** – Visa alla loggnivåer
- **INFO** – INFO och högre
- **WARNING** – Varningar och fel
- **ERROR** – Endast fel
- **DEBUG** – Debug och högre

## Sökning

- Filtrera loggar med textsökning
- Träffar markeras i loggutdata

## Funktioner

- **Auto scroll** – Rulla till botten när nya loggar anländer
- **Stream** – Strömma loggar i realtid (när det stöds)
- **Copy** – Kopiera loggar till urklipp
- **Download** – Ladda ner loggar som en fil

## Användningsområden

- Felsök misslyckade workflow-körningar
- Granska API-förfrågnings-/svarsloggar
- Övervaka databasfrågor
- Kontrollera start- och hälsomeddelanden

## Relaterat

- [Canvas-funktioner](../reference/canvas-features.md) – Körningsloggar i workflowens Debug-panel
- [Fliken Traces](./traces-tab.md) – Inspektion av LLM-spår
- [Fliken Analytics](./analytics-tab.md) – Körningsstatistik
- [Fliken Workflows](./workflows-tab.md) – Hantering av workflows
- [Kontextuell showcase](../reference/contextual-showcase.md) – Kompakt sidguide för dashboard-ytor
