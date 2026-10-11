# Tabbladen Sjablonen

Op het tabblad Sjablonen kunt u volledige workflows en afzonderlijke knooppunten opslaan, doorbladeren en hergebruiken. Deel iets dat u eenmalig hebt gebouwd en pas het met één klik toe op nieuwe projecten.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Bekijk de demo van Sjablonen</a></p>

## Overzicht

Er zijn twee soorten sjablonen:

- **Workflow-sjablonen** — sla een volledige workflow op (alle knooppunten en verbindingen) als een herbruikbaar startpunt.
- **Knooppunt-sjablonen** — sla een enkel geconfigureerd knooppunt op (bijv. een afgestemd LLM-knooppunt of een aangepast HTTP-knooppunt) voor hergebruik in verschillende workflows.

Schakel tussen beide met de schakelaar **Workflows / Knooppunten** bovenaan het tabblad.

Gebruik de zoekbalk om de zichtbare sjablonen te filteren op naam, beschrijving, tags of knooppunttype.

---

## Een sjabloon maken

### Workflow-sjabloon

1. Open de workflow die u wilt delen in de editor.
2. Klik op **Delen als sjabloon** in de bovenste werkbalk.
3. Vul naam, beschrijving en optionele tags in.
4. Kies de zichtbaarheid: **Iedereen** (alle gebruikers) of **Specifieke gebruikers** (voer gebruikersnamen in en/of selecteer teams).
5. Klik op **Delen**. Een groene melding bevestigt het succes.

### Knooppunt-sjabloon

1. Klik met de rechtermuisknop op een knooppunt op het canvas.
2. Selecteer **Delen als sjabloon** in het contextmenu.
3. Vul het formulier in en klik op **Delen**.

---

## Een sjabloon gebruiken

### Workflow-sjabloon

1. Open het tabblad **Sjablonen** en zorg dat **Workflows** is geselecteerd.
2. Klik op een kaart om een voorbeeld te bekijken, of klik direct op **Gebruiken**.
3. De workflow wordt gekloond naar een nieuwe workflow die in de editor wordt geopend.

### Knooppunt-sjabloon

1. Open het tabblad **Sjablonen** en selecteer **Knooppunten**.
2. Klik op **Gebruiken** op een kaart van een knooppunt-sjabloon.
3. Er verschijnt een dialoogvenster — kies waar het knooppunt moet worden toegevoegd:
   - **Nieuwe workflow** — maakt een nieuwe workflow met alleen dit knooppunt.
   - **Bestaande workflow** — kies uit uw workflowlijst; het knooppunt wordt automatisch ingevoegd wanneer de editor opent.

---

## Voorbeeld

Klik op een sjabloonkaart om een volledig voorbeeld te openen:

- **Kaartminiaturen** — sjabloonkaarten tonen een passende, alleen-lezen canvas-momentopname voor zowel workflows als enkelvoudige knooppunt-sjablonen.
- **Workflow-sjablonen** — een alleen-lezen canvas in de stijl van het bewerkingsgeschiedenis-voorbeeld, inclusief pannen en zoomen.
- **Knooppunt-sjablonen** — het opgeslagen knooppunt opent op hetzelfde alleen-lezen canvas als enkelvoudig knooppuntvoorbeeld.
- **Knooppuntdetails** — klik op een knooppunt in het voorbeeld om de opgeslagen configuratie in het zijpaneel te bekijken.
- Tags, gebruiksaantal en **eigenaar** worden voor alle sjablonen weergegeven.

Druk op **ESC** of klik buiten het voorbeeld om het te sluiten.

---

## Sjablonen beheren

- **Bewerken** – Als u de eigenaar van het sjabloon bent, beweegt u de muis over de kaart en klikt u op het potloodpictogram om de naam, beschrijving, tags of zichtbaarheid bij te werken
- **Verwijderen** – Als u de eigenaar van het sjabloon bent, beweegt u de muis over de kaart en verwijdert u het sjabloon na de bevestigingsvraag
- **Acties alleen voor eigenaar** – Bewerk- en verwijderbedieningen worden alleen weergegeven voor sjablonen die u hebt gemaakt

---

## Commandopalet (CTRL+K)

Sjablonen (zowel workflow als knooppunt) zijn doorzoekbaar via het **CTRL+K**-commandopalet. Selecteer een sjabloon om het direct te gebruiken — workflow-sjablonen openen in de editor, knooppunt-sjablonen vragen om een bestemming.

---

## Sjablonen in Chat

U kunt de AI vragen stellen over uw sjablonen — het kent alle sjablonen in uw werkruimte.

---

## Zichtbaarheid

| Instelling | Wie kan het zien |
|---|---|
| Iedereen | Alle gebruikers op het platform |
| Specifieke gebruikers | Gebruikers die u bij naam vermeldt en/of teams die u selecteert — alle teamleden krijgen toegang |

Bij delen met **Specifieke gebruikers** kunt u zowel individuele gebruikers (op naam) als teams toevoegen. Teamleden zien het sjabloon op het tabblad Sjablonen en kunnen het gebruiken.

---

## Gerelateerd

- [Teams](../reference/teams.md) – Sjablonen delen met teams
- [Canvas-functies](../reference/canvas-features.md)
- [Workflow-structuur](../reference/workflow-structure.md)
- [Knooppunttypen](../reference/node-types.md)
- [Chat-tabblad](./chat-tab.md)
- [Contextuele showcase](../reference/contextual-showcase.md) – Korte paginagids voor dashboardtabbladen
