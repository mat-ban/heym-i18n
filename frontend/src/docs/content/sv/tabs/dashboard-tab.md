# Dashboard

Fliken **Dashboard** är ett Grafana-liknande utrymme där det går att bygga rutnät av diagramwidgetar. Varje widget renderas från utdata av sitt eget dolda Heym-workflow, så all data som kan produceras i ett workflow — databasfrågor, API-anrop, RAG-uppslagningar, LLM-utdata — kan bli ett diagram. Flera dashboards kan hållas och var och en kan delas med personer eller team.

## Dashboards

Alla börjar med en dashboard, som skapas första gången fliken öppnas. Använd dashboardväljaren högst upp i fliken för att växla mellan dashboards, och **+** bredvid den för att skapa en ny. Väljaren listar egna dashboards först, därefter de som delats med en, märkta med namnet på personen som delade dem.

Fliken öppnar den dashboard som användes senast, och adressfältet innehåller den öppna dashboarden (`?tab=dashboard&dashboard=<id>`), så en länk öppnar exakt den dashboarden för alla som har åtkomst till den.

Inställningsknappen (endast ägare) byter namn på dashboarden, anger vilka poster den accepterar som [detaljsida](#detail-pages), hanterar delning och tar bort den. Att ta bort en dashboard tar bort dess widgetar och deras workflows. Minst en egen dashboard behålls alltid, så den sista kan inte tas bort.

## Widgetar

En widget är ett enskilt diagram i rutnätet. Diagramtyper som stöds:

- **Bar** (vertikal eller horisontell)
- **Line**
- **Area** (fylld trend, stöder flera serier)
- **Pie**
- **Table** (rullningsbar; klicka på en kolumnrubrik för stigande sortering och klicka igen för fallande sortering. En kolumn kan återges som [statuschips](../nodes/chart-output-node.md#status-chips), en kolumn kan innehålla [länkknappar](../nodes/chart-output-node.md#link-buttons) som öppnar en URL i en ny flik, och rader kan öppna en [detaljsida](#detaljsidor))
- **Numeric** (ett enskilt KPI-värde med valfri enhet)
- **Gauge** (ett enskilt värde mot ett min–max-intervall, t.ex. en procentandel)
- **Scatter** (X/Y-punkter för korrelationsdiagram)
- **Proportion** (en stapel uppdelad i andelar med en procentteckenförklaring, t.ex. en språkfördelning)
- **Gantt** (uppgiftsdatum, slutförande och beroenden)
- **Entity relationships (DB)** (tabeller, fält, PK/FK-nycklar och kopplingar)
- **Bar gauge** (en horisontell gauge per rad med en röd→grön gradient och ett värde, t.ex. ledigt diskutrymme)
- **Text** (ett markdown-meddelande, t.ex. en statusnotis som "Senaste körning 19:47"; stöder [interaktiva kryssrutor](../nodes/chart-output-node.md#interactive-task-lists) när markdown är statisk, och [explicita numrerade listor](../nodes/chart-output-node.md#numbered-lists) för anpassad eller fallande numrering)
- **HITL** (egna väntande mänskliga granskningar. Rubriken visar `1/n pending`. Workflow-namnet öppnar den körningen på canvas. **Approve**, **Request changes** och **Reject** löser den. Historikikonen bredvid widgettiteln öppnar den körningen i historikdialogen på denna sida. Widgeten använder inte uppströms rader, och varje person ser sin egen kö. Den kan istället visa granskningarna för ett enskilt Workflow, för alla som har behörighet att öppna det; se [HITL-widgets](#hitl-widgets))

Förutom diagram kan en **Run a workflow**-widget köra ett av dina workflows direkt från dashboarden: på en släppt fil, med dess inmatningsfält eller med en Run-knapp; se [Kör-widgetar](#run-widgets).

Varje widget laddar sin data asynkront när fliken öppnas, så sidan förblir responsiv medan diagram fylls på.

## Lägga till en widget

1. Klicka på **Add widget**, ange en titel och välj en diagramtyp. Under väljaren visar dialogen ett exempel på den diagramtypen med exempeldata och namnger de rader den förväntar sig, så att typer kan jämföras innan något byggs.
2. Widgeten öppnas i workflow-editorn med en startgraf: en [Set](../nodes/set-node.md)-nod som producerar raderna, kopplad till en [Chart Output](../nodes/chart-output-node.md)-nod. Ersätt Set-noden med valfri datakälla. En **HITL**-widget är endast Chart Output-noden; den läser egna väntande granskningar och behöver ingen datakälla.
3. Bygg workflowet så att noden som matar **Chart Output** producerar en array av rader, och konfigurera sedan Chart Output-nodens fältmappning (label-fält, value-fält osv.).
4. Spara, återgå till fliken Dashboard, och widgeten renderas.

För en **Run a workflow**-widget väljer du istället vilket workflow den ska köra; väljaren visar hur widgeten kommer att köra vart och ett. Widgeten läggs till direkt i rutnätet; inget nytt workflow behöver byggas.

Dubbelklicka på en widget (eller använd dess redigeringsknapp) för att öppna dess workflow igen när som helst. Använd **Clone
widget** i widgetrubriken för att duplicera både widgeten och dess kompletta workflow. Kopian
placeras under originalet och märks med **(Copy)** så att den kan redigeras oberoende.

## HITL-widgets

En ny HITL-widget visar varje granskning som väntar i den egna kön. För att endast visa granskningar för ett visst Workflow öppnas widgetens **Inställningar**:

1. Välj önskat Workflow under **Workflow**. Listan innehåller de Workflows som kan öppnas – egna eller delade med användaren eller teamet – som har ett steg som väntar på en person: en Agent med mänsklig granskning eller ett Slack-godkännande-, knapp- eller formulärsteg. Ikonen bredvid öppnar detta Workflow i en ny flik.
2. Om ett Workflow har exakt ett sådant steg väljs det automatiskt. Om det finns flera listar **Select agent** dem efter nodnamn, med **All agents** först; Slack-steg markeras med **(Slack)**.
3. Spara. Rubrikens `1/n pending` räknar endast dessa granskningar. Välj **Alla Workflows** för att visa den egna kön igen.

Samma val finns på canvasen i egenskaperna för Chart Output-noden. **Finjustera med AI** kan utföra valet (”visa endast fakturagodkännanden”), och det kan även beskrivningen av en ny widget som anger Workflow. Varje ändring är en Workflow-redigering och visas därför i Edit History.

- **Vem som ser granskningarna.** En widget filtrerad på ett Workflow visar dess granskningar för alla som kan öppna detta Workflow, och dessa personer kan godkänna, begära ändringar eller avvisa från widgeten, precis som de kan köra detta Workflow. En ofiltrerad widget visar varje persons egen kö.
- **Vem som ser widgeten.** Den som inte kan öppna det valda Workflowet ser inte widgeten alls, inte ens på en delad instrumentpanel. Om panelens ägare förlorar åtkomsten eller om Workflowet raderas, visas ”You no longer have access to the workflow this widget shows” och en annan kan väljas i **Inställningar**.
- **Endast tillgängliga val.** Ett Workflow som inte kan öppnas avvisas när widgeten sparas, oavsett om det sker från inställningar, canvas eller AI.

## Detaljsidor

En tabellwidget kan länka sina rader till en annan dashboard, som då fungerar som en detaljsida: en enda dashboard som betjänar varje kund, faktura eller ärende.

1. Öppna tabellwidgetens **Settings** och välj dashboarden under **Row link**.
2. Ange **Record column**, kolumnen vars värde identifierar raden (till exempel `id`), och valfritt en **Label column** som namnger den (till exempel `name`).
3. Spara. Genom att klicka på en rad (eller fokusera den och trycka på Enter) öppnas den länkade dashboarden med `?record=<value>&label=<name>`.

På detaljdashboarden läser varje widget-workflow värdet som `$page.record` (se [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), och sidan visar `Dashboard / <label>` ovanför rutnätet med en knapp för att rensa posten. Tillbaka tar dig tillbaka till tabellen du kom från.

- **Vem som kan öppna den.** Rader är endast klickbara för betraktare som har behörighet att öppna den länkade dashboarden. Andra ser samma tabell utan länkar.
- **Postformat.** Posten kommer från URL:en, så detaljdashboarden bestämmer vad den accepterar. I dess inställningar är **Detail page records** ett av följande: ID:n (bokstäver, siffror, `-`, `_` och `.`, upp till 128 tecken; standard), tal, UUID:n eller e-postadresser. Alla andra värden nekas innan en widget körs, och widgetarna visar "This page does not accept that record".
- **Fortfarande ägarens körning.** Widgetar körs som dashboardens ägare även på en detaljsida. Byggare bör endast skicka `$page.record` där en nod escapear det, aldrig direkt i frågetext.
- **Cachning.** Varje widget cachar sitt diagram per post, under samma time-to-live (TTL) som widgeten, och behåller de 50 senast använda posterna.

## Kör-widgetar

En **Run a workflow**-widget kör ett av dina workflows och visar resultatet: status, körtid och utdata. Vad den visar beror på vad workflowet tar emot:

- **En fil.** För ett workflow som börjar med en [File Upload Trigger](../nodes/file-upload-trigger-node.md) släpper du en fil på den (eller klickar för att välja en) så laddar widgeten upp den via triggerns engångslänk för uppladdning. Widgeten visar de filtyper och den storlek som triggern accepterar och nekar andra före uppladdning. När workflowet även börjar med en Text Input-nod visar widgeten dess fält bredvid släppzonen: välj en fil, fyll i fälten så skickar **Run** båda. Värdena följer med uppladdningslänken som widgeten skapar, så en delad uppladdningslänk kan inte ange dem.
- **Inmatningsfält.** För ett workflow som börjar med en Text Input-nod visar widgeten dess fält med standardvärden; **Run** kör workflowet med dina värden. Värden för fält som workflowet saknar ignoreras.
- **Ingenting.** Ett workflow utan indata får en **Run**-knapp.

Resultatets **Wrap**-knapp radbryter långa utdatarader inuti rutan; stäng av den för att läsa utdatans JSON-layout.

- Alla som kan öppna dashboarden kan köra widgeten, precis som alla kan uppdatera ett diagram. Åtkomsten till workflowet tillhör dashboardens ägare: för att lägga till widgeten krävs ett workflow som både du och ägaren kan köra, och själva körningen använder workflow-ägarens credentials, precis som vilken uppladdningslänk som helst.
- Resultatet stannar på din skärm tills du lämnar sidan; andra betraktare ser inte dina filer, värden eller resultat. Körningen visas i körningshistoriken med triggern `dashboard`.
- En delning av en dashboard ger aldrig åtkomst till själva workflowet. **Edit workflow** öppnar det för personer som redan har åtkomst, och **Fine-tune with AI** erbjuds inte.
- Filkörningar utförs på huvudinstansen, där uppladdade filer lagras, precis som varje File Upload Trigger-körning.

## Generera en widget med AI

Klicka på **AI**, beskriv önskad metrik (till exempel "workflow success rate over the last 30 days as a bar chart") och välj en LLM-credential och modell. Heym genererar ett komplett widget-workflow som slutar i en Chart Output-nod och lägger till det i rutnätet. Se [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) för exempel på prompts per diagramtyp.

Widgeten får en kort titel på ett eller två ord på förfrågans språk, såsom ”Öppna ärenden”. En titel innehåller aldrig id:t för en datatabell; om modellen ger widgeten ett namn i form av en hel mening behåller Heym de första orden.

Widget-API:et kan också skapa ett **räknarkort** utan AI: en `text`-widget på en datatabell (`data_table_id`) med `count_column` och `count_value` visar hur många rader som har det värdet; widgetens titel anger värdet. Heym Work inleder sidor skapade från en datatabell med ett räknarkort per status.

Använd en widgets **Fine-tune with AI**-knapp för att revidera en befintlig widget med en ny instruktion. Varje AI-fintuning tar en ögonblicksbild av det föregående workflowet i widgetens **Edit History**, så ändringar kan granskas eller rullas tillbaka från workflow-editorn.

## Från Chat och MCP

[Chat](./chat-tab.md) och MCP-klienter via verktyget [`heym_chat`](./mcp-tab.md) kan läsa dina dashboards, lägga till widgets på dem, byta namn på eller ta bort widgets samt städa upp en dashboards layout. Heym Work visar varje dashboard som en sida, så samma svar täcker dess sidor.

- **Vilka dashboards som finns och vad som finns på dem.** Fråga "vilka dashboards har jag?", "vad finns på instrumentpanelen Försäljning?" eller "vilken dashboard finns omsättnings-workflowet på?". Chat listar dina egna dashboards och de som delas med dig, med din behörighet och en länk till var och en, samt varje widget på dem: titel, diagramtyp och workflowet bakom. En [HITL-widget](#hitl-widgets) som filtrerats på ett workflow du inte kan öppna förblir dold, precis som på själva dashboarden.
- **En ny widget.** Fråga "lägg till ett diagram över öppna ärenden efter status på Försäljning". Chat placerar först en tom widget på dashboarden, skriver sedan widgetens eget workflow, kör testkörningar och åtgärdar fel tills en körning lyckas, på samma sätt som den [skapar workflows](./chat-tab.md#skapa-workflows). Inget separat workflow lämnas kvar, och varje sparning visas i widgetens Edit History. Widgetens titel och diagramtyp följer vad Chat sparar.
- **Ett befintligt workflow.** Fråga "lägg till omsättnings-workflowet på instrumentpanelen Försäljning". Ett workflow som slutar i en Chart Output-nod blir en diagramwidget med en egen kopia av workflowet, så senare ändringar av widgeten påverkar aldrig originalet. Ett workflow med en trigger- eller input-nod kan inte bli en diagramwidget. Alla andra workflows blir en [kör-widget](#run-widgets), som också kräver ett workflow som instrumentpanelens ägare kan köra.
- **Byt namn på eller ta bort en widget.** Fråga "byt namn på Omsättning till Försäljning" eller "ta bort widgeten Öppna ärenden". En diagramwidgets workflow tar också det nya namnet; en kör-widgets workflow behåller sitt eget. Om du tar bort en diagramwidget tas dess workflow bort tillsammans med den, precis som widgetens raderingsknapp gör; en kör-widgets workflow finns kvar. Chat tar bara bort en widget du uttryckligen bad om, och frågar först om dina ord matchar flera.
- **Städa upp.** Fråga "städa upp Försäljning-dashboarden" eller "lägg till dessa tre widgets och städa upp". Chat ordnar widgetarna du ser i deras ordning, precis som knappen **Städa upp** gör: slumpmässiga rader med två eller tre, så att fråga igen ger en annan layout. Ange ett antal per rad ("tre per rad") för att få rader av den storleken. Detta ordnar dashboarden i Heym; Heym Work behåller sin egen placering på en sida, som sidans egen **Städa upp**-knapp ändrar.

Nya widgets hamnar under dashboardens befintliga widgets och körs, som alla widgets, som dashboardens ägare. Att lägga till, byta namn på, ta bort och städa upp kräver skrivbehörighet till dashboarden. Att skapa en ny widget kräver en chatt som kan bygga workflows: fliken Chat, Heym Works chatt för redigerare och `heym_chat`.

## Redigera layouten

Växla **Edit** för att gå in i redigeringsläge, där widgetar kan dras och storleksändras i ett rutnät med 12 kolumner. Layoutändringar sparas automatiskt. Widgettitlar kan redigeras direkt i widgetrubriken.

## Cachning och uppdatering

Varje widget cachar sin senast beräknade data på servern under en konfigurerbar time-to-live (TTL). Medan cachen är färsk serveras det lagrade resultatet när dashboarden öppnas igen, istället för att workflowet körs på nytt. Cachen ersätts på plats varje gång data beräknas om (en cache per widget, plus en per post på en [detaljsida](#detail-pages)), och den ogiltigförklaras automatiskt när widgetens workflow redigeras.

Använd en widgets **Refresh**-knapp (eller **Refresh** i verktygsfältet) för att kringgå cachen och beräkna om omedelbart.
## Delning

Ägare delar en dashboard från dess inställningar, med enskilda användare (via e-post) eller med valfritt [team](teams-tab.md) som de tillhör. Varje delning är **Read** eller **Write**; när någon har både en personlig och en teamdelning gäller den starkare.

| Åtgärd | Ägare | Write | Read |
|--------|:-----:|:-----:|:----:|
| Visa widgets, uppdatera dem, använda auto-refresh | ✓ | ✓ | ✓ |
| Öppna detaljsidor, köra kör-widgetar | ✓ | ✓ | ✓ |
| Lägga till, klona, ta bort, byta namn på och ändra storlek på widgets; AI-generera och finjustera; markera checklistobjekt | ✓ | ✓ | |
| Öppna en widgets workflow i editorn | ✓ | ✓ | |
| Byta namn på eller ta bort dashboarden, ange dess postformat, hantera delning | ✓ | | |

**Widgets körs alltid som dashboardens ägare.** Oavsett vem som tittar använder en widget ägarens autentiseringsuppgifter och globala variabler, och dess körningar visas i ägarens körningshistorik och traces. Teammedlemmar ser därför samma data utan åtkomst till kontona bakom, och varje visare delar det ena cachade resultatet per widget. Widgets som en write-samarbetspartner lägger till eller klonar tillhör också ägaren.

På grund av detta innebär **Write** samma förtroende som att dela en workflow för redigering: en samarbetspartner med write-åtkomst kan ändra vad som körs med delade autentiseringsuppgifter. Ge det endast till personer som skulle tillåtas redigera relevanta workflows. En testkörning som en samarbetspartner startar från workflow-editorn använder deras egna autentiseringsuppgifter, som med alla delade workflows; endast dashboarden själv körs som ägaren. **Read** ger ingen åtkomst till widgetarnas workflows, och read-only-visare får själva diagrammet men inte körningsdetaljerna per nod bakom det.

Att ta bort en delning, eller sänka den från write till read, träder i kraft omedelbart.

## Relaterat

- [Chart Output node](../nodes/chart-output-node.md)
- [Analytics tab](analytics-tab.md) — inbyggda körningsmått (skiljer sig från användarskapade dashboards)

## Scheman och databasdiagram

Välj **Gantt** i Lägg till widget för att visa uppgifter över tid med slutförande och beroendelänkar, eller **Entity relationships (DB)** för att kartlägga tabeller, fält och deras relationer. Båda typerna använder [Chart Output-noden](../nodes/chart-output-node.md#gantt-schedules) och finns även tillgängliga på Heym Work-sidor. När Work föreslår widgets för ett schema eller ett databasschema ritar det förhandsgranskningar utifrån de föreslagna uppgifterna eller entiteterna.
