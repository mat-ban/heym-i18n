# Dashboard

**Dashboard**-fanen er et Grafana-lignende område, hvor der kan opbygges gitter af diagramwidgets. Hver widget genereres fra outputtet af sit eget skjulte Heym-workflow, hvilket betyder, at alle data der kan produceres i et workflow - databaseforespørgsler, API-kald, RAG-søgninger, LLM-output - kan omdannes til et diagram. Det er muligt at oprette flere dashboards og dele hvert enkelt med personer eller teams.

## Dashboards

Alle starter med ét dashboard, der oprettes første gang fanen åbnes. Brug dashboardvælgeren øverst på fanen til at skifte mellem dashboards, og **+** ved siden af til at oprette et nyt. Vælgeren viser først egne dashboards, derefter dem der er delt med brugeren, mærket med navnet på den der har delt dem.

Fanen genåbner det dashboard der sidst blev brugt, og adressefeltet indeholder det åbne dashboard (`?tab=dashboard&dashboard=<id>`), så et link åbner det specifikke dashboard for alle der har adgang til det.

Indstillinger-knappen (kun for ejere) giver mulighed for at omdøbe dashboardet, angive hvilke poster det accepterer som [detaljeside](#detail-pages), administrere deling og slette det. Ved sletning fjernes både widgets og deres tilhørende workflows. Der bevares altid mindst ét personligt dashboard, så det sidste kan ikke slettes.

## Widgets

En widget er et enkelt diagram på gitteret. Understøttede diagramtyper:

- **Søjle** (lodret eller vandret)
- **Linje**
- **Areal** (udfyldt trend, understøtter flere serier)
- **Cirkel**
- **Tabel** (scrollbar; én kolonne kan vises som [status-chips](../nodes/chart-output-node.md#status-chips), og rækker kan åbne en [detaljeside](#detail-pages))
- **Numerisk** (en enkelt KPI-værdi med valgfri enhed)
- **Måler** (en enkelt værdi i forhold til et min-maks interval, f.eks. en procentdel)
- **Punkt** (X/Y-punkter til korrelationsplot)
- **Proportion** (en søjle opdelt i andele med procentvis fordeling, f.eks. en sprogfordeling)
- **Søjlemåler** (en vandret måler pr. række med rød→grøn gradient og en værdi, f.eks. ledig diskplads)
- **Tekst** (en markdown-besked, f.eks. en statusnote som "Sidste kørsel kl. 19:47"; understøtter [interaktive afkrydsningsfelter](../nodes/chart-output-node.md#interactive-task-lists) ved statisk markdown, og [eksplicitte nummererede lister](../nodes/chart-output-node.md#numbered-lists) til brugerdefineret eller faldende nummerering)
- **HITL** (ventende menneskelige gennemgange. Overskriften viser `1/n ventende`. Workflow-navnet åbner kørslen på canvas. **Godkend**, **Anmod om ændringer** og **Afvis** afslutter processen. Historik-ikonet ved siden af widget-titlen åbner kørslen i historikdialogen på denne side. Widgeten bruger ikke opstrømsrækker, og hver person ser sin egen kø)

Udover diagrammer kører en **Run a workflow**-widget et af dine workflows direkte fra dashboardet: på en sluppet fil, med dens inputfelter eller med en Run-knap; se [Kør-widgets](#run-widgets).

Hver widget indlæser sine data asynkront når fanen åbnes, hvilket sikrer en responsiv side mens diagrammerne udfyldes.

## Tilføjelse af widget

1. Klik på **Tilføj widget**, giv den en titel og vælg en diagramtype. Under vælgeren viser dialogen et eksempel på den valgte type med prøvedata og navngiver de forventede rækker, så der kan sammenlignes typer før opbygning.
2. Widgeten åbnes i workflow-editoren med et startdiagram: en [Set](../nodes/set-node.md)-node der producerer rækkerne, forbundet til en [Chart Output](../nodes/chart-output-node.md)-node. Erstat Set-noden med enhver datakilde. En **HITL**-widget består kun af Chart Output-noden; den læser ventende gennemgange og kræver ingen datakilde.
3. Byg workflowet så noden der føder **Chart Output** producerer et array af rækker, og konfigurer derefter Chart Output-nodens feltmapping (label-felt, værdifelt osv.).
4. Gem, vend tilbage til Dashboard-fanen, og widgeten vises.

For en **Run a workflow**-widget skal du i stedet vælge det workflow, den skal køre; vælgeren viser, hvordan widgeten vil køre hvert enkelt. Widgeten føjes direkte til gitteret; der skal ikke oprettes et nyt workflow.

Dobbeltklik på en widget (eller brug dens redigeringsknap) for at genåbne dens workflow når som helst. Brug **Klon widget** i widget-hovedet til at duplikere både widget og dens komplette workflow. Kopien placeres under originalen og mærkes med **(Kopi)** så den kan redigeres uafhængigt.

## Detaljesider

En tabelwidget kan linke sine rækker til et andet dashboard, som derefter fungerer som en detaljeside: ét dashboard, der betjener hver kunde, faktura eller sag.

1. Åbn tabelwidgetens **Settings**, og vælg dashboardet under **Row link**.
2. Indtast **Record column**, den kolonne hvis værdi identificerer rækken (f.eks. `id`), og eventuelt en **Label column**, der navngiver den (f.eks. `name`).
3. Gem. Når du klikker på en række (eller fokuserer på den og trykker på Enter), åbnes det linkede dashboard med `?record=<value>&label=<name>`.

På detaljedashboardet læser hvert widget-workflow værdien som `$page.record` (se [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), og siden viser `Dashboard / <label>` over gitteret med en knap til at rydde posten. Tilbage fører dig tilbage til den tabel, du kom fra.

- **Hvem der kan åbne den.** Rækker kan kun klikkes på af brugere, der har adgang til at åbne det linkede dashboard. Andre ser den samme tabel uden links.
- **Postformat.** Posten kommer fra URL'en, så detaljedashboardet bestemmer, hvad det accepterer. I dets indstillinger er **Detail page records** en af følgende: ID'er (bogstaver, cifre, `-`, `_` og `.`, op til 128 tegn; standard), tal, UUID'er eller e-mailadresser. Enhver anden værdi afvises, før en widget kører, og widgetene viser "This page does not accept that record".
- **Stadig ejerens kørsel.** Widgets kører også som dashboardets ejer på en detaljeside. Byggere bør kun sende `$page.record`, hvor en node escaper værdien, aldrig direkte ind i forespørgselstekst.
- **Caching.** Hver widget cacher sit diagram pr. post i samme levetid (TTL) som widgeten og gemmer de 50 senest anvendte poster.

## Kør-widgets

En **Run a workflow**-widget kører et af dine workflows og viser resultatet: status, kørselstid og output. Hvad den viser, afhænger af, hvad workflowet modtager:

- **En fil.** For et workflow, der starter med en [File Upload Trigger](../nodes/file-upload-trigger-node.md), skal du slippe en fil på det (eller klikke for at vælge en), hvorefter widgeten uploader den via triggerens engangsuploadlink. Widgeten viser de filtyper og den størrelse, som triggeren accepterer, og afviser andre før upload. Når workflowet også starter med en Text Input-node, viser widgeten dens felter ved siden af dropzonen: vælg en fil, udfyld felterne, og **Run** sender begge dele. Værdierne følger med det uploadlink, widgeten opretter, så et delt uploadlink ikke kan indstille dem.
- **Inputfelter.** For et workflow, der starter med en Text Input-node, viser widgeten dens felter med deres standardværdier; **Run** kører workflowet med dine værdier. Værdier for felter, som workflowet ikke har, kasseres.
- **Ingenting.** Et workflow uden input får en **Run**-knap.

Resultatets **Wrap**-knap ombryder lange outputlinjer inde i boksen; slå den fra for at læse outputtets JSON-layout.

- Enhver, der kan åbne dashboardet, kan køre widgeten, ligesom enhver kan opdatere et diagram. Adgangen til workflowet tilhører dashboardets ejer: tilføjelse af widgeten kræver et workflow, som både du og ejeren kan køre, og selve kørslen bruger workflow-ejerens legitimationsoplysninger, ligesom ethvert uploadlink.
- Resultatet bliver på din skærm, indtil du forlader siden; andre brugere ser ikke dine filer, værdier eller resultater. Kørslen vises i kørselshistorikken med triggeren `dashboard`.
- En deling af et dashboard giver aldrig adgang til selve workflowet. **Edit workflow** åbner det for personer, der allerede har adgang, og **Fine-tune with AI** tilbydes ikke.
- Filkørsler udføres på hovedinstansen, hvor uploadede filer gemmes, ligesom enhver File Upload Trigger-kørsel.

## Generering af widget med AI

Klik på **AI**, beskriv den ønskede metrik (f.eks. "workflow-succesrate over de sidste 30 dage som søjlediagram"), og vælg en LLM-legitimationsoplysning og model. Heym genererer et komplet widget-workflow der slutter med en Chart Output-node og tilføjer det til gitteret. Se [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) for eksempel-prompts pr. diagramtype.

Brug en widgets **Finjuster med AI**-knap til at revidere en eksisterende widget med en ny instruktion. Hver AI-finjustering gemmer det foregående workflow i widgetens **Redigeringshistorik**, så der kan gennemses eller rulles tilbage fra workflow-editoren.

## Redigering af layout

Aktiver **Rediger** for at indgå i redigeringsmode, hvor widgets kan trækkes og ændres i størrelse på et 12-kolonners gitter. Layoutændringer gemmes automatisk. Widget-titler kan redigeres direkte fra widget-hovedet.

## Caching og opdatering

Hver widget cacher sine sidst beregnede data på serveren i en konfigurerbar levetid (TTL). Mens cachen er frisk, vises det gemte resultat ved genåbning i stedet for at genkøre workflowet. Cachen opdateres ved hver genberegning (én cache pr. widget, plus én pr. post på en [detaljeside](#detail-pages)) og invalideres automatisk ved redigering af widgetens workflow.

Brug en widgets **Opdater**-knap (eller **Opdater** i værktøjslinjen) til at omgå cachen og genberegne med det samme.
## Deltagelse

Ejere deler et dashboard fra dets indstillinger, enten med enkelte brugere (via email) eller med ethvert [team](teams-tab.md), de tilhører. Hver deling er enten **Læse-** eller **Skriveadgang**; når en person har både en personlig og en team-deling, anvendes den stærkeste tilladelse.

| Handling | Ejer | Skrive | Læse |
|--------|:-----:|:-----:|:----:|
| Se widgets, opdatere dem, bruge auto-opdatering | ✓ | ✓ | ✓ |
| Åbne detaljesider, køre kør-widgets | ✓ | ✓ | ✓ |
| Tilføje, klone, slette, omdøbe og tilpasse størrelse på widgets; AI-generering og finjustering; afkrydsning af checklistepunkter | ✓ | ✓ | |
| Åbne en widgets workflow i editoren | ✓ | ✓ | |
| Omdøbe eller slette dashboardet, indstille dets postformat, administrere deling | ✓ | | |

**Widgets kører altid som dashboardets ejer.** Uanset hvem der ser på det, anvender en widget ejerens legitimationsoplysninger og globale variabler, og dens kørsler vises i ejerens kørselshistorik og -spor. Teammedlemmer ser derfor de samme data uden adgang til de underliggende konti, og hver betragter deler den samme cachelagrede resultat pr. widget. Widgets som en skrive-samarbejder tilføjer eller kloner tilhører ligeledes ejeren.

På grund af dette indebærer **Skriveadgang** den samme tillid som at dele et workflow til redigering: en samarbejdspartner med skriveadgang kan ændre, hvad der kører med legitimationsoplysningerne. Det bør kun gives til personer, der også må redigere workflows. En testkørsel, som en samarbejdspartner starter fra workflow-editoren, bruger deres egne legitimationsoplysninger, som med ethvert delt workflow; kun dashboardet selv kører som ejeren. **Læseadgang** giver ingen adgang til widget-workflows, og læse-brugere modtager selve diagrammet, men ikke de underliggende node-specifikke kørselsdetaljer.

Fjernelse af en deling eller nedgradering fra skrive til læse træder i kraft med det samme.

## Relateret

- [Chart Output node](../nodes/chart-output-node.md)
- [Analytics-fanen](analytics-tab.md) — indbyggede kørselsstatistikker (adskilt fra brugeroprettede dashboards)
