# Tabblad Schema's

Het tabblad **Schema's** toont alle actieve cron-workflows op een visuele kalender. Schakel tussen dag-, week- en maandweergaven om te zien wanneer uw automatiseringen gepland staan om te worden uitgevoerd.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Bekijk de demo van Schema's</a></p>

## Weergaven

- **Dag** – Tijdlijn per uur voor de geselecteerde dag; elke uitvoering verschijnt als een blok op het geplande tijdstip
- **Week** – Raster van zeven kolommen voor de huidige week; blokken stapelen wanneer meerdere workflows op hetzelfde uur worden uitgevoerd
- **Maand** – Volledig maandraster; elke cel toont de workflows die op die dag gepland staan

## Workflow-blokken

Elk blok toont:

- **Workflow-naam** – Klik om het workflow-canvas direct te openen
- **Cron-expressie** – Zichtbaar bij hover, met het ruwe schema (bijv. `0 9 * * 1-5`)

## Navigatie

Instance-beheerders die vermeld staan in `HEYM_ADMIN_EMAILS` zien de schema's van elke eigenaar wanneer **Alle workflows tonen** is aangevinkt. Vink dit uit om alleen de eigen workflows te zien. Andere gebruikers behouden de optie **Gedeeld met mij tonen**. Om de automatisering van een medewerker stop te zetten, gebruikt u de [instance-beheerbediening](./workflows-tab.md#instance-administration) op het Workflows-voorbeeld om triggers te pauzeren of te hervatten.

- Gebruik de pijlen **vorige / volgende** om door dagen, weken of maanden te navigeren
- De knop **Vandaag** keert onmiddellijk terug naar de huidige datum

## Gerelateerd

- [Cron-knooppunt](../nodes/cron-node.md) – Configureer geplande triggers op het canvas
- [Tabblad Workflows](./workflows-tab.md) – Beheer en organiseer alle workflows
- [Tabblad Analytics](./analytics-tab.md) – Uitvoeringsstatistieken en trends
