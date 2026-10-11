# Dashboard

Fliken **Dashboard** är ett Grafana-liknande utrymme där det går att bygga rutnät av diagramwidgetar. Varje widget renderas från utdata av sitt eget dolda Heym-workflow, så all data som kan produceras i ett workflow — databasfrågor, API-anrop, RAG-uppslagningar, LLM-utdata — kan bli ett diagram. Flera dashboards kan hållas och var och en kan delas med personer eller team.

## Dashboards

Alla börjar med en dashboard, som skapas första gången fliken öppnas. Använd dashboardväljaren högst upp i fliken för att växla mellan dashboards, och **+** bredvid den för att skapa en ny. Väljaren listar egna dashboards först, därefter de som delats med en, märkta med namnet på personen som delade dem.

Fliken öppnar den dashboard som användes senast, och adressfältet innehåller den öppna dashboarden (`?tab=dashboard&dashboard=<id>`), så en länk öppnar exakt den dashboarden för alla som har åtkomst till den.

Inställningsknappen (endast ägare) byter namn på dashboarden, hanterar delning och tar bort den. Att ta bort en dashboard tar bort dess widgetar och deras workflows. Minst en egen dashboard behålls alltid, så den sista kan inte tas bort.

## Widgetar

En widget är ett enskilt diagram i rutnätet. Diagramtyper som stöds:

- **Bar** (vertikal eller horisontell)
- **Line**
- **Area** (fylld trend, stöder flera serier)
- **Pie**
- **Table** (rullningsbar)
- **Numeric** (ett enskilt KPI-värde med valfri enhet)
- **Gauge** (ett enskilt värde mot ett min–max-intervall, t.ex. en procentandel)
- **Scatter** (X/Y-punkter för korrelationsdiagram)
- **Proportion** (en stapel uppdelad i andelar med en procentteckenförklaring, t.ex. en språkfördelning)
- **Bar gauge** (en horisontell gauge per rad med en röd→grön gradient och ett värde, t.ex. ledigt diskutrymme)
- **Text** (ett markdown-meddelande, t.ex. en statusnotis som "Senaste körning 19:47"; stöder [interaktiva kryssrutor](../nodes/chart-output-node.md#interactive-task-lists) när markdown är statisk, och [explicita numrerade listor](../nodes/chart-output-node.md#numbered-lists) för anpassad eller fallande numrering)
- **HITL** (egna väntande mänskliga granskningar. Rubriken visar `1/n pending`. Workflow-namnet öppnar den körningen på canvas. **Approve**, **Request changes** och **Reject** löser den. Historikikonen bredvid widgettiteln öppnar den körningen i historikdialogen på denna sida. Widgeten använder inte uppströms rader, och varje person ser sin egen kö)

Varje widget laddar sin data asynkront när fliken öppnas, så sidan förblir responsiv medan diagram fylls på.

## Lägga till en widget

1. Klicka på **Add widget**, ange en titel och välj en diagramtyp. Under väljaren visar dialogen ett exempel på den diagramtypen med exempeldata och namnger de rader den förväntar sig, så att typer kan jämföras innan något byggs.
2. Widgeten öppnas i workflow-editorn med en startgraf: en [Set](../nodes/set-node.md)-nod som producerar raderna, kopplad till en [Chart Output](../nodes/chart-output-node.md)-nod. Ersätt Set-noden med valfri datakälla. En **HITL**-widget är endast Chart Output-noden; den läser egna väntande granskningar och behöver ingen datakälla.
3. Bygg workflowet så att noden som matar **Chart Output** producerar en array av rader, och konfigurera sedan Chart Output-nodens fältmappning (label-fält, value-fält osv.).
4. Spara, återgå till fliken Dashboard, och widgeten renderas.

Dubbelklicka på en widget (eller använd dess redigeringsknapp) för att öppna dess workflow igen när som helst. Använd **Clone
widget** i widgetrubriken för att duplicera både widgeten och dess kompletta workflow. Kopian
placeras under originalet och märks med **(Copy)** så att den kan redigeras oberoende.

## Generera en widget med AI

Klicka på **AI**, beskriv önskad metrik (till exempel "workflow success rate over the last 30 days as a bar chart") och välj en LLM-credential och modell. Heym genererar ett komplett widget-workflow som slutar i en Chart Output-nod och lägger till det i rutnätet. Se [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) för exempel på prompts per diagramtyp.

Använd en widgets **Fine-tune with AI**-knapp för att revidera en befintlig widget med en ny instruktion. Varje AI-fintuning tar en ögonblicksbild av det föregående workflowet i widgetens **Edit History**, så ändringar kan granskas eller rullas tillbaka från workflow-editorn.

## Redigera layouten

Växla **Edit** för att gå in i redigeringsläge, där widgetar kan dras och storleksändras i ett rutnät med 12 kolumner. Layoutändringar sparas automatiskt. Widgettitlar kan redigeras direkt i widgetrubriken.

## Cachning och uppdatering

Varje widget cachar sin senast beräknade data på servern under en konfigurerbar time-to-live (TTL). Medan cachen är färsk serveras det lagrade resultatet när dashboarden öppnas igen, istället för att workflowet körs på nytt. Cachen ersätts på plats varje gång data beräknas om (en cache per widget), och den ogiltigförklaras automatiskt när widgetens workflow redigeras.

Använd en widgets **Refresh**-knapp (eller **Refresh** i verktygsfältet) för att kringgå cachen och beräkna om omedelbart.
## Delning

Ägare delar en dashboard från dess inställningar, med enskilda användare (via e-post) eller med valfritt [team](teams-tab.md) som de tillhör. Varje delning är **Read** eller **Write**; när någon har både en personlig och en teamdelning gäller den starkare.

| Åtgärd | Ägare | Write | Read |
|--------|:-----:|:-----:|:----:|
| Visa widgets, uppdatera dem, använda auto-refresh | ✓ | ✓ | ✓ |
| Lägga till, klona, ta bort, byta namn på och ändra storlek på widgets; AI-generera och finjustera; markera checklistobjekt | ✓ | ✓ | |
| Öppna en widgets workflow i editorn | ✓ | ✓ | |
| Byta namn på eller ta bort dashboarden, hantera delning | ✓ | | |

**Widgets körs alltid som dashboardens ägare.** Oavsett vem som tittar använder en widget ägarens autentiseringsuppgifter och globala variabler, och dess körningar visas i ägarens körningshistorik och traces. Teammedlemmar ser därför samma data utan åtkomst till kontona bakom, och varje visare delar det ena cachade resultatet per widget. Widgets som en write-samarbetspartner lägger till eller klonar tillhör också ägaren.

På grund av detta innebär **Write** samma förtroende som att dela en workflow för redigering: en samarbetspartner med write-åtkomst kan ändra vad som körs med delade autentiseringsuppgifter. Ge det endast till personer som skulle tillåtas redigera relevanta workflows. En testkörning som en samarbetspartner startar från workflow-editorn använder deras egna autentiseringsuppgifter, som med alla delade workflows; endast dashboarden själv körs som ägaren. **Read** ger ingen åtkomst till widgetarnas workflows, och read-only-visare får själva diagrammet men inte körningsdetaljerna per nod bakom det.

Att ta bort en delning, eller sänka den från write till read, träder i kraft omedelbart.

## Relaterat

- [Chart Output node](../nodes/chart-output-node.md)
- [Analytics tab](analytics-tab.md) — inbyggda körningsmått (skiljer sig från användarskapade dashboards)
