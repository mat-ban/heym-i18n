# Schemalagd flik

Fliken **Schemalagd** visar alla aktiva cron-workflows i en visuell kalender. Växla mellan dag-, vecko- och månadsvy för att se när automatiseringarna är schemalagda att köras.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Se demo av Schemalagd</a></p>

## Vyer

- **Dag** – Tidslinje timme för timme för den valda dagen; varje förekomst visas som ett block vid sin schemalagda tid
- **Vecka** – Rutnät med sju kolumner som spänner över aktuell vecka; block staplas när flera workflows körs vid samma timme
- **Månad** – Rutnät för hela månaden; varje cell listar de workflows som är schemalagda att köras den dagen

## Workflow-block

Varje block visar:

- **Workflow-namn** – Klicka för att öppna workflow-canvas direkt
- **Cron-uttryck** – Visas vid hover och visar det råa schemat (t.ex. `0 9 * * 1-5`)

## Navigering

Instansadministratörer som anges i `HEYM_ADMIN_EMAILS` ser alla ägares scheman när **Visa alla workflows** är markerat. Avmarkera för att endast se de egna workflows. Övriga användare behåller alternativet **Visa delade med mig**. För att avveckla en anställds automatisering används [instansadministrationskontrollerna](./workflows-tab.md#instance-administration) i förhandsvisningen av Workflows för att pausa eller återuppta triggers.

- Använd pilarna **föregående / nästa** för att navigera mellan dagar, veckor eller månader
- Knappen **Idag** återgår omedelbart till aktuellt datum

## Relaterat

- [Cron-nod](../nodes/cron-node.md) – Konfigurera schemalagda triggers på canvas
- [Fliken Workflows](./workflows-tab.md) – Hantera och organisera alla workflows
- [Fliken Analytics](./analytics-tab.md) – Körningsstatistik och trender
