# Fliken Templates

Fliken Templates gör det möjligt att spara, bläddra bland och återanvända kompletta workflows och enskilda noder. Dela något som byggts en gång och tillämpa det på nya projekt med ett klick.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

## Översikt

Det finns två typer av templates:

- **Workflow-templates** — spara ett komplett workflow (alla noder och anslutningar) som en återanvändbar utgångspunkt.
- **Nod-templates** — spara en enskild konfigurerad nod (t.ex. en finjusterad LLM-nod eller en anpassad HTTP-nod) för återanvändning i olika workflows.

Växla mellan de två med reglaget **Workflows / Nodes** högst upp i fliken.

Använd sökfältet för att filtrera de synliga templaten efter namn, beskrivning, taggar eller nodtyp.

---

## Skapa en template

### Workflow-template

1. Öppna workflowet som ska delas i editorn.
2. Klicka på **Share as Template** i det övre verktygsfältet.
3. Fyll i namn, beskrivning och valfria taggar.
4. Välj synlighet: **Everyone** (alla användare) eller **Specific users** (ange användarnamn och/eller välj team).
5. Klicka på **Share**. En grön avisering bekräftar att det lyckades.

### Nod-template

1. Högerklicka på valfri nod på canvasen.
2. Välj **Share as Template** i snabbmenyn.
3. Fyll i formuläret och klicka på **Share**.

---

## Använda en template

### Workflow-template

1. Öppna fliken **Templates** och säkerställ att **Workflows** är valt.
2. Klicka på ett kort för att förhandsgranska det, eller klicka direkt på **Use**.
3. Workflowet klonas till ett nytt workflow som öppnas i editorn.

### Nod-template

1. Öppna fliken **Templates** och välj **Nodes**.
2. Klicka på **Use** på ett nod-template-kort.
3. En dialogruta visas — välj var noden ska läggas till:
   - **New workflow** — skapar ett nytt workflow som endast innehåller denna nod.
   - **Existing workflow** — välj från workflowlistan; noden infogas automatiskt när editorn öppnas.

---

## Förhandsgranskning

Klicka på valfritt template-kort för att öppna en fullständig förhandsgranskning:

- **Kortminiatyrer** — template-kort renderar en anpassad skrivskyddad canvas-ögonblicksbild för både workflows och enskilda nod-templates.
- **Workflow-templates** — en skrivskyddad canvas som matchar förhandsgranskningsstilen för redigeringshistorik, inklusive panorering och zoomning.
- **Nod-templates** — den sparade noden öppnas på samma skrivskyddade canvas som en enskild nod-förhandsgranskning.
- **Nodinformation** — klicka på valfri nod i förhandsgranskningen för att granska dess sparade konfiguration i sidopanelen.
- Taggar, antal användningar och **ägare** visas för alla templates.

Tryck på **ESC** eller klicka utanför för att stänga förhandsgranskningen.

---

## Hantera templates

- **Edit** – För template-ägare, håll muspekaren över kortet och klicka på pennikonen för att uppdatera namn, beskrivning, taggar eller synlighet
- **Delete** – För template-ägare, håll muspekaren över kortet och ta bort templaten efter bekräftelseprompten
- **Owner-only actions** – Redigerings- och borttagningskontroller visas endast för templates som har skapats av användaren

---

## Command Palette (CTRL+K)

Templates (både workflow och nod) är sökbara från kommandopaletten **CTRL+K**. Välj en template för att använda den omedelbart — workflow-templates öppnas i editorn, nod-templates frågar efter en destination.

---

## Templates i Chat

Det går att ställa AI-frågor om sina templates — den känner till alla templates i arbetsytan.

---

## Synlighet

| Inställning | Vem kan se den |
|---|---|
| Everyone | Alla användare på plattformen |
| Specific users | Användare som listas vid namn och/eller team som väljs — alla teammedlemmar får åtkomst |

Vid delning med **Specific users** går det att lägga till både enskilda användare (vid namn) och team. Teammedlemmar ser templaten i fliken Templates och kan använda den.

---

## Relaterat

- [Teams](../reference/teams.md) – Dela templates med team
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Kort sidguide för dashboard-flikar
