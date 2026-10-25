# Snabbpanel

**Snabbpanelen** är en snabbkörningspanel på höger sida för workflows. Den visas på autentiserade sidor såsom instrumentpanelens [Workflows-flik](../tabs/workflows-tab.md), Docs och Utvärdering.

## Åtkomst

- Klicka på den fasta **Quick / Workflows**-triggern vid skärmens högra mittkant
- När [Contextual Showcase](./contextual-showcase.md) också är tillgänglig placeras dess **Page Guide**-trigger ovanför Quick Workflows
- Panelen öppnas från höger och förskjuter den aktuella sidan åt vänster med en subtil omskalning
- På mobila enheter är Snabbpanelen dold
- Panelen visas inte i workflow-editorn, på inloggnings-/registreringssidor, i portalen eller på HITL-granskningssidor

## Workflow-sökning

Använd filterfältet högst upp i panelen för att söka efter workflows baserat på:

- Workflow-namn
- Workflow-beskrivning

Sökningen är skiftlägesokänslig och uppdaterar listan omedelbart.

## Fästa workflows

Fäst workflows för att hålla dem högst upp i panelen.

- Fästa workflows visas i en egen sektion ovanför den fullständiga listan
- Nya fästen läggs till högst upp
- Fästordningen bevaras mellan omladdningar i webbläsarlagring

## Köra workflows

Välj en workflow för att öppna dess inmatningsformulär.

- Inmatningsfält visas vertikalt i panelens ordning
- Klicka på **Run Workflow** för att köra den valda workflowen
- Klicka på **Stop Workflow** för att avbryta en pågående körning från panelen
- Workflows utan inmatningsfält kan fortfarande köras direkt
- Ett workflow som startar med en [File Upload Trigger](../nodes/file-upload-trigger-node.md) visar i stället en släppzon: släpp en fil där eller klicka för att välja en. Zonen anger vilka filtyper och vilken filstorlek som triggern accepterar och avvisar andra filer före uppladdning. **Run Workflow** förblir inaktiverad tills en fil har valts.

Panelen använder samma workflow-körnings-API som andra Heym-körytor, så utdata och körtidsbeteende förblir konsekventa.

Att stoppa en körning från panelen avbryter även den aktiva backend-körningen, inklusive eventuella pågående Playwright-webbläsarjobb för den workflow-körningen.

## Förlopp och resultat

Efter att en körning har startats visar panelen:

- Strömmande stegförlopp för noder när de startar och avslutas
- Slutlig status: `success`, `error` eller `pending`
- Slutliga utdata i en kompakt JSON-panel
- Historikposter märkta med `Quick Drawer`

`pending` innebär att workflowen väntar på en senare åtgärd, såsom mänsklig granskning.

Quick Drawer-körningar är produktionskörningar, så en workflow med en [samtidighetsgräns](./webhooks.md#concurrency-limit-and-queued-runs) kan få dem att vänta. Medan körningen står i kö visar statusen **Waiting in queue (2/5)**; den ändras till "running" när körningen startar och visar resultatet när den avslutas, utan förlopp steg för steg. En körning som löpt ut i kön, eller som avbröts under väntan, avslutas som `error`.

En filkörning går via triggerns engångslänk för uppladdning: panelen ber workflowet om en länk, laddar upp filen dit och visar resultatet när uppladdningen är klar. Filkörningar visar slutstatus och utdata men inget steg-för-steg-förlopp, och taggas också med `Quick Drawer` i historiken. Den valda filen rensas efter varje körning eftersom en länk endast tar emot en fil.

## Webbläsarlagring

Snabbpanelen lagrar personliga inställningar i `localStorage`:

- Fästa workflow-ID:n
- Senast vald workflow

Panelen bevarar **inte** inmatningsvärden i denna version.

## Omfattning

Snabbpanelen är avsiktligt en lättviktig köryta.

- Inkluderat: sökning, fästning, val, inmatning (inklusive en fil), körning, förlopp, resultat
- Exkluderat: skapande och redigering av workflows, mapphantering och canvas-åtgärder

## Relaterat

- [Workflows-flik](../tabs/workflows-tab.md) – Huvudlista för workflows, mappar och hantering
- [Snabbstart](../getting-started/quick-start.md) – Bygg och kör den första workflowen
- [Körningshistorik](./execution-history.md) – Granska tidigare körningar
- [Webhooks](./webhooks.md) – Trigga workflows över HTTP
- [Contextual Showcase](./contextual-showcase.md) – Sidnivåvägledning som kompletterar Snabbpanelen
