# Tidsplaner-fanen

**Tidsplaner**-fanen viser alle aktive cron-workflows på en visuel kalender. Skift mellem dag-, uge- og månedsvisning for at se, hvornår automatiseringer er planlagt til at køre.

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Se Tidsplaner-demo</a></p>

## Visninger

- **Dag** – Time-for-time tidslinje for den valgte dag; hver forekomst vises som en blok på dens planlagte tidspunkt
- **Uge** – Syv-kolonne gitter, der spænder over den aktuelle uge; blokke stables, når flere workflows udløses på samme tidspunkt
- **Måned** – Fuld månedsgitter; hver celle viser de workflows, der er planlagt til den pågældende dag

## Workflow-blokke

Hver blok viser:

- **Workflow-navn** – Klik for at åbne workflow-canvas direkte
- **Cron-udtryk** – Synligt ved hover, viser den rå tidsplan (f.eks. `0 9 * * 1-5`)

## Navigation

Instansadministratorer, der er listet i `HEYM_ADMIN_EMAILS`, kan se alles tidsplaner, når **Vis alle workflows** er markeret. Fjern markeringen for kun at se egne workflows. Andre brugere har muligheden for **Vis delte med mig**. For at afvikle en medarbejders automatisering kan [instansadministrationskontrollerne](./workflows-tab.md#instance-administration) på Workflow-forhåndsvisningen bruges til at pause eller genoptage triggers.

- Brug **forrige / næste** pile til at navigere mellem dage, uger eller måneder
- **I dag**-knappen vender tilbage til den aktuelle dato med det samme

## Relateret

- [Cron-node](../nodes/cron-node.md) – Konfigurer planlagte triggers på canvas
- [Workflows-fanen](./workflows-tab.md) – Håndter og organiser alle workflows
- [Analytics-fanen](./analytics-tab.md) – Kørselsstatistikker og tendenser
