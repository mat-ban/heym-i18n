# Fliken Alerts

Fliken **Alerts** gör det möjligt att definiera tröskelvillkor över ett tidsfönster och få meddelande när de överskrids. Heym registrerar redan körningsresultat, körtid och LLM-kostnader, men rapporterar aldrig något av detta av sig självt. En alert är hur man ber om det.

Varje alert utvärderas över ett **tidsfönster** som väljs, aldrig på en enskild händelse. En misslyckad körning är brus. Tolv misslyckade körningar på tio minuter är en incident.

## Alert-typer

| Typ | Frågan den besvarar | Var siffran kommer från |
|---|---|---|
| **Error threshold** | Misslyckades detta fler än N gånger i fönstret? | Rader i [Execution history](../reference/execution-history.md) med felstatus |
| **Workflow duration** | Blev körningarna långsammare än förväntat i fönstret? | Körtid, aggregerad som max, genomsnitt eller 95:e percentil |
| **Token / USD cost** | Överskred kostnaden en budget i fönstret? | [LLM traces](./traces-tab.md) plus LLM-kostnadstabellen |
| **Execution count** | Kördes detta mycket oftare än det borde? | Antal rader i execution history |

### Error threshold

Räknar misslyckade körningar över fönstret och utlöses när antalet når tröskelvärdet. Eftersom det räknar över ett fönster i stället för att haka på varje enskilt fel, kommer ett enstaka tillfälligt fel inte att larma.

### Workflow duration

Mäter körtid inom fönstret. Välj **max** (den långsammaste körningen), **average** eller **p95**. p95-värdet använder samma percentilberäkning som [Analytics tab](./analytics-tab.md), så alerten och latensdiagrammet motsäger aldrig varandra för samma fönster.

**Minimum runs in the window** håller detta ärligt. Den långsammaste körningen i ett nästan tomt fönster är bara den enda körningen, så att sätta ett minimum på exempelvis 3 förhindrar att alerten utlöses på brus.

### Token / USD cost

Summerar LLM-kostnader över fönstret, antingen som totalt antal tokens eller i US-dollar. Dollarbelopp löses genom samma pristabell som [Traces tab](./traces-tab.md) och [LLM Cost Table](./datatable-tab.md#llm-cost-table-system-table) använder, så en kostnadsalert och kostnadssidan stämmer alltid överens.

När omfattningen är alla workflows inkluderas LLM-anrop som görs utanför en workflow, såsom [Chat tab](./chat-tab.md) och [AI Assistant](../reference/ai-assistant.md). Användning av coding agents (Codex, OpenCode) ingår inte.

Modeller utan prissättningsrad rapporteras i alertens kontext som unpriced i stället för att tyst räknas som noll.

### Execution count

Räknar körningar av valfri status i fönstret. Detta är den som fångar en Trigger som gått fel: en workflow som normalt körs 20 gånger i timmen och plötsligt körs 2 000 gånger. Den utlösande posten innehåller en uppdelning per Trigger-källa, eftersom det vanligtvis är svaret på "varför hände detta".

## Omfattning

En alert bevakar antingen **en workflow** eller **alla workflows**.

"Alla workflows" betyder varje workflow som alertens ägare har åtkomst till. Det betyder medvetet inte varje workflow på Heym-instansen: alerts kan delas, och att dela en alert bör inte ge någon aggregerade siffror för workflows de inte kan öppna.

## Guiden

Att skapa en alert går igenom fem steg.

1. **Type** — välj en av de fyra ovan.
2. **Scope** — en workflow, eller alla.
3. **Condition** — tidsfönstret, plus tröskelfälten för den typen.
4. **Response** — vad som körs när den utlöses, och hur ofta den ska fortsätta meddela.
5. **Review** — namnge den, och se backtesten.

### Backtesten

Steget Review besvarar frågan som faktiskt spelar roll innan sparandet: *under de senaste 24 timmarna, hur ofta skulle detta ha utlösts?*

Det rapporterar antalet utlösningar och det högsta observerade värdet mot tröskelvärdet. Om det står att villkoret skulle ha utlösts 400 gånger, justeras tröskelvärdet innan sparandet i stället för efter att ha blivit larmad. Lookback-perioden kan utökas till 3 eller 7 dagar.

## AI-utkast

Högst upp i första steget finns en ruta där det beskrivs i klartext vad som önskas:

> Warn me if the invoice sync fails more than 5 times in 10 minutes

Heym omvandlar detta till en alert-definition, fyller i varje steg den kan och hoppar framåt med de AI-ifyllda fälten markerade, så att det bekräftas i stället för att skrivas om. En komplett begäran landar på Review.

**En partiell begäran förflyttar ändå framåt.** Säg bara "warn me if it fails 5 times" och en error threshold-alert erhålls med antalet ifyllt, standardvärden för resten, och guiden öppnas på det första steget som fortfarande behöver anges: i det fallet Scope, eftersom ingen workflow namngavs. En anteckning högst upp anger vad som återstår att bestämma. Den blockerar aldrig Next eller Create.

Samma sak gäller när modellen namnger en workflow som inte är åtkomlig, eller returnerar ett villkor med saknade fält. De delar som är vettiga behålls, resten faller tillbaka på standardvärdena för den alert-typen, och justeringar görs därifrån. Inget här kringgår validering: guidens egna regler och API:et kontrollerar båda alerten igen vid sparande.
## Upprepningsbeteende

När en avisering utlöses övergår den till ett utlöst tillstånd. Vad som händer därefter väljs i steg 4.

- **Meddela en gång, tills den återställs** (standard) — utlöses en gång och förblir sedan tyst så länge villkoret gäller. När mätvärdet sjunker under tröskelvärdet igen återgår aviseringen till OK och kan utlösas på nytt. Återställning är en tillståndsändring, inte en händelse: den skapar ingen utlösningspost och kör inte notify-workflowet.
- **Fortsätt meddela med ett intervall** — utlöses igen var N:e minut så länge villkoret gäller.

Standarden finns eftersom ett trasigt workflow som kontrolleras var 60:e sekund annars skulle producera 60 utlösningar i timmen, vilket är så aviseringar tystas.

## Köra ett Workflow vid Utlösning

Steg 4 erbjuder tre svar på "vad ska hända när detta utlöses":

- **Skapa och tilldela ett nytt workflow** (standard) — att spara aviseringen skapar även ett workflow som heter *"&lt;alert name&gt; notification"* och länkar det. Det levereras med en input-nod vars fält är exakt payloaden nedan, så `$alert.body.observed_value` och resten löses omedelbart och det enda som återstår är att koppla noden som levererar meddelandet. **Go to workflow** på aviseringskortet öppnar det. Detta är standard eftersom en avisering som utlöses utan mottagare är lätt att missa.
- **Välj ett befintligt workflow** — kör något som redan har byggts.
- **Gör ingenting** — utlösningen registreras fortfarande i fliken, den kör bara ingenting.

Aviseringspayloaden anländer som workflowets input-body:

```json
{
  "alert_id": "...",
  "alert_name": "Invoice sync failures",
  "alert_type": "error_threshold",
  "condition": "5+ errors in 10m",
  "scope": "workflow",
  "workflows": [{ "id": "...", "name": "Invoice Sync", "value": 12 }],
  "observed_value": 12,
  "threshold_value": 5,
  "window_start": "2026-08-09T11:50:00+00:00",
  "window_end": "2026-08-09T12:00:00+00:00",
  "window_minutes": 10,
  "context": { "error_count": 12 }
}
```

### Vilket workflow som producerade siffran

`workflows` är den enda platsen där ett workflow förekommer. Den listar varje workflow som bidrog till avläsningen, var och en med sitt eget `value` — det workflowets felantal, körningsantal, långsammaste körning i millisekunder eller spend, beroende på aviseringstyp. Listan sorteras efter `value`, högst först, så `workflows[0]` är den värsta boven.

Den är **alltid en array**: ett element under en-workflow-scope, många under "all my workflows", och tom snarare än null när inget kan tillskrivas. Ett notify-workflow kan iterera den utan en formkontroll.

Det finns medvetet inget singular `workflow_id`. Det beskrev aviseringens scope snarare än mätvärdet, så det var `null` under system-scope, vilket är exakt det fall där "vilket workflow?" spelar störst roll. `observed_value` förblir det aggregerade värde som tröskelvärdet jämfördes mot; de per-workflow `value`-fälten förklarar varifrån det kom.

Detta är hur aviseringar når Slack, e-post, Telegram eller var som helst annars: med de [noder](../reference/node-types.md) som redan finns, snarare än ett separat meddelandesystem.

En avisering kan inte meddela det workflow den bevakar. Det skulle vara en loop, mest uppenbart för en avisering om körningsantal där varje meddelande ökar antalet den mäter.

Notify-körningar är vanliga körningar, så de visas i [execution history](../reference/execution-history.md) som vilken annan körning som helst. Ett notify-workflow som misslyckas registreras på utlösningen men hindrar aldrig själva utlösningen från att registreras.

Ett notify-workflow körs som aviseringens ägare, med dennes credentials och globala variabler, precis som om ägaren hade kört det själv. Att välja ett workflow som någon har delat med sig av lånar inte den personens credentials. Om ägaren förlorar åtkomst till notify-workflowet registreras utlösningen fortfarande men notify-körningen hoppas över.

## Utlösningshistorik

Under aviseringslistan finns utlösningshistoriken: vad som utlöstes, när, det observerade värdet mot tröskelvärdet, det exakta fönster som utvärderades och notify-resultatet.

Att kvittera en utlösning markerar raden och ändrar aviseringens badge från **Firing** till **Acknowledged**. Det är ett uttalande om användaren, inte om aviseringen: villkoret gäller fortfarande och aviseringen återgår till **OK** av sig själv när mätvärdet sjunker under tröskelvärdet igen.

Varje post lagrar den bidragande detaljen i det ögonblick den utlöstes: misslyckade execution-id:n och felmeddelanden, spend per modell eller uppdelningen per trigger-källa. Detta är avsiktligt. Fönstret har passerat och en senare omberäkning kan ge ett annat svar.

Utlösningsposter sparas i 90 dagar.

## Fråga Chat om Aviseringar

Fliken [Chat](./chat-tab.md) kan svara på frågor om aviseringar:

- "What alerts do I have?"
- "Is there an alert on the invoice workflow?"
- "Why did the cost alert fire?"
- "When did this last trigger?"

För en fråga av typen "varför utlöstes den" citerar Chat det faktiska observerade värdet, tröskelvärdet och tidsfönstret från utlösningsposten, tillsammans med den bidragande detaljen.

## Delning

Aviseringar kan delas med enskilda användare eller med [team](./teams-tab.md). Personer som en avisering delas med kan se aviseringen och dess utlösningshistorik. Endast ägaren kan redigera, pausa, ta bort eller dela den vidare.
### När åtkomst till workflow tas bort

En avisering på en enskild workflow fortsätter att läsa den workflowens körningsstatistik, så att ta bort någons åtkomst till workflowen avgör också vad som händer med dennes aviseringar på den:

- **Ta bort en användar- eller teamdelning** frågar workflowens ägare om även den användarens eller teamets aviseringar på workflowen ska stoppas. Stoppning är standard. Stoppade aviseringar pausas, inte raderas, och var och en registreras som `alert.disable_on_access_revoke` i [granskningsloggen](../reference/audit.md).
- **Ta bort en teammedlem eller radera ett team** stoppar alltid de berörda aviseringarna, eftersom personen som gör ändringen inte nödvändigtvis är workflowens ägare.
- En avisering stoppas endast när dess ägare inte har någon annan väg till workflowen, såsom en direkt delning eller ett annat team.
- Återupptagning eller testning av en pausad avisering kontrollerar ägarens åtkomst igen, så en stoppad avisering kan inte slås på igen eller användas för att läsa workflowens statistik utan åtkomst. Att trycka på **Resume** utan åtkomst visar en avisering som förklarar att workflowens ägare först måste dela den igen.

## Hantera aviseringar

- **Pause / Resume** — en pausad avisering utvärderas aldrig. Återupptagning kontrollerar den omedelbart istället för att vänta på nästa intervall.
- **Edit** — ändringar valideras som en helhet, så en partiell redigering kan inte lämna aviseringen i ett ogiltigt tillstånd.
- **Delete** — tar bort aviseringen och dess utlösningshistorik.

## Se även

- [Analytics Tab](./analytics-tab.md) — diagrammen som dessa tröskelvärden hämtas från
- [Traces Tab](./traces-tab.md) — varifrån LLM-kostnadssiffror kommer
- [Execution History](../reference/execution-history.md) — körningarna som fel-, varaktighets- och antalsaviseringar mäter
- [Chat Tab](./chat-tab.md) — fråga efter aviseringar i naturligt språk
- [Teams](./teams-tab.md) — dela aviseringar med ett team
