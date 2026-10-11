# Execution History

Execution history registrerar workflow-körningar: indata, utdata, nodresultat, status och trigger-källa. Använd det för att följa en aktiv produktionskörning, granska tidigare körningar, felsöka fel eller köra igen med samma indata via **Bring to Canvas**.

## Översikt

Varje execution lagrar:

| Fält | Beskrivning |
|-------|-------------|
| **Inputs** | Request body eller körningens indata (t.ex. `text` för Input-nod) |
| **Outputs** | Workflow-nivåns utdata |
| **Node results** | Per-nod-utdata, status och exekveringstid |
| **Status** | `success`, `error`, `pending`, `skipped` eller `failed` (se [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Hur körningen triggades (se [Triggers](./triggers.md)) |

## Åtkomst till historik

| Plats | Omfattning |
|----------|-------|
| **Editor**-verktygsfältet | Endast aktuell workflow |
| **Docs**-vyhuvudet | Endast aktuell workflow |
| **Dashboard**-huvudet (Chat-fliken) | Alla workflows + chat-/assistant-körningar |
| **Evals**-vyhuvudet | Alla workflows + chat-/assistant-körningar |

Klicka på **History**-knappen (klockikonen) för att öppna dialogen.

## Per-workflow vs All History

- **Per-workflow** (Editor, Docs): Visar körningar för den workflow som är öppen. Använd **Clear history** för att ta bort körningar för enbart den workflowen.
- **All History** (Dashboard, Evals): Visar körningar över alla workflows och chat-/assistant-sessioner. Täckningen matchar workflow-åtkomst: workflows som ägs, workflows som delats direkt och workflows som delats med en tillhörig team. Använd **Clear all history** för att ta bort alla poster som ägs. Historik för delade workflows behålls.

## Bring to Canvas

**Bring to Canvas** laddar en vald körnings indata och nodutdata till den aktuella workflowen.

### Vad som laddas

- **Inputs** → Run input-panelen (t.ex. `text` för Input-nod, eller anpassade fält)
- **Node results** → Execution result-panelen visar tidigare utdata per nod
- **Execution result** → Status, utdata och timing från körningen

### Beteende beroende på kontext

- **I Editor** (per-workflow-historik): Tillämpas omedelbart på den öppna workflowen och stänger dialogen.
- **Från All History** (Dashboard/Evals): Navigerar till workflow-editorn och tillämpar sedan data när editorn laddas. Endast tillgängligt för workflow-körningar—inte för chat-/assistant-körningar.

### Execution deep link

Att öppna en workflow på `/workflows/{workflowId}/{executionId}` hämtar automatiskt den executionen till canvas — samma som att välja körningen och klicka på **Bring to Canvas**. Detta gör en specifik tidigare körning delbar som en URL. Om executionen inte kan hittas (felaktigt eller borttaget id) faller editorn tillbaka till att ladda den vanliga workflowen.

### Användningsfall

- Köra en workflow igen med samma indata
- Felsöka en misslyckad körning genom att granska indata och nodutdata
- Jämföra utdata mellan körningar

## Execution Highlights

Efter en live-körning — eller efter **Bring to Canvas** — visas en avvisningsbar **Execution Highlights**-popup i **övre högra hörnet av Canvas**. Det är ett snabbt sätt att se *vad varje nod producerade*, listat uppifrån och ned i exekveringsordning. Stäng den med **✕**; den öppnas igen vid nästa körning.

### Vad som visas

| Post | Källa | Auto? |
|--------|--------|-------|
| **Input** | Körningens indataparametrar (input-/trigger-nod) | Ja |
| **Output** | Output-nodens resultat — eller, om ingen finns, sista nodens meddelande | Ja |
| **Agent / LLM** | Varje agent- eller LLM-nods utdata | Ja |
| **Output** | Alla andra noder med **Highlight Node Output** aktiverat | Opt-in |

Noder som redan auto-highlightas (input / output / last / agent / llm) visas aldrig två gånger, även om växlingsknappen också aktiveras.

### Varje post

- Visar `Node — message…` med de första **250 tecknen**; klicka på en rad för att expandera den och rendera **hela meddelandet som Markdown**, med en **Copy**-knapp.
- En nod som kördes flera gånger (t.ex. inuti en loop) visar `Node (N)` med en `‹ i / N ›`-väljare — välj vilken körning som ska visas; varje nods väljare är oberoende.

### Highlight Node Output

Varje nod **utom Agent och LLM** har en **Highlight Node Output**-kryssruta i sin egenskapspanel (avstängd som standard). Aktivera den för att lägga till nodens utdata i popupen. En liten ✦-markering visas på highlightade noder på canvas. I [workflow DSL](./expression-dsl.md) är detta nod-datafältet `"highlight": true` (standard `false`).

### På dashboards

Dashboard-widgetkort som körde en workflow visar en ✦ **Execution highlights**-knapp i kortets huvud; klicka på den för att öppna samma popup för den widgetens körning, med widgetens ritade utdata som den framträdande posten.
## Köra exekveringar

Båda historikdialogerna visar **aktuellt körande exekveringar** högst upp i listan, före tidigare körningar.

- En snurrande indikator och etiketten **Running** visas tillsammans med starttiden
- Klicka på **Open live** för att ansluta editorn till just den körningen utan att starta om den
- Canvasen återställer först noder som redan har slutförts och tar sedan emot
  `node_start`, `node_complete` och slutliga exekveringshändelser via SSE
- Den aktuella noden pulserar på canvasen, nedströms noder behåller sin väntande animering och
  Debug-panelen lägger till varje resultat allt eftersom det anländer—precis som vid en körning som startats från editorn
- Klicka på **Cancel** för att stoppa exekveringen omedelbart
- Avbrytande från valfri dialog (Editor eller Dashboard) stänger även den aktiva SSE-strömmen i alla öppna canvas-flikar för den workflowen, så att editorns tillstånd återställs korrekt
- Efter avbrytande försvinner den körande posten vid nästa uppdatering; tryck på **Refresh** för att uppdatera listan manuellt
- Om en körning som redan har slutförts avbryts är begäran en no-op

Den live-URL som används är `/workflows/{workflowId}/{executionId}`. Observatören är skrivskyddad: att lämna
editorn kopplar endast bort den webbläsarfliken och stoppar aldrig workflowen. Aktiva snapshots
delas via PostgreSQL, så att öppna en körning fungerar även när triggern och editor-
begäran hamnar på olika backend-arbetare.

## Återställning efter krasch

Om servern startas om (deploy, container-omstart eller krasch) medan en workflow körs, stoppas den körningens arbetare mitt i exekveringen. Heym återställer automatiskt dessa avbrutna körningar istället för att lämna dem fastnade som **Running**.

- Vid nästa uppstart upptäcker den valda ledarprocessen föräldralösa körningar — omedelbart vid en graciös omstart, eller inom ~60 sekunder vid en hård krasch (när hjärtslagen tydligt har upphört).
- Återställda körningar **körs om från början med samma indata** (återupptas inte från där de stoppades), med den aktuella workflow-definitionen. Vid slutförande registreras en normal terminalpost (t.ex. `success`), så historiken visar körningen som slutförd.
- En körning görs om **en gång**. Om återställningsförsöket också avbryts — eller om workflowen sedan dess har raderats — registreras posten som `failed`.
- Detta fungerar på samma sätt i en enskild container och i distributioner med flera arbetare; endast ledaren utför återställning, så en körning återställs aldrig två gånger av olika arbetare.

### Växlingsknappen Auto-recover

Editorns **Execution Log**-panel (körning) har en kryssruta för **Auto-recover**, **på som standard** per workflow.

- **På**: avbrutna körningar av denna workflow körs om enligt beskrivningen ovan.
- **Av**: avbrutna körningar körs inte om och registreras med statusen `skipped`.

> Körningar av under-workflows återställs inte oberoende — de drivs på nytt av sin återställda förälderkörning. Triggers med egen återleverans (RabbitMQ, schemalagd/cron, IMAP) kan också leverera om vid omstart, så en återställd körning kan ibland köras två gånger.

## Väntande mänsklig granskning

Körningar som pausar för [Human-in-the-Loop](./human-in-the-loop.md)-godkännande skrivs till historiken omedelbart med statusen `pending`.

- Den väntande agentnoden lagrar en gransknings-payload som inkluderar `reviewUrl`, `draftText` och `expiresAt`
- Alla noder som är anslutna till agentens `review`-handtag kan också köras innan människan svarar, och deras nodresultat lagras i samma väntande historikpost
- Historikdialoger visar granskningslänken så att ägare kan kopiera eller öppna den
- Historikdialoger och editorns Debug-panel visar det slutliga mänskliga beslutet efter att körningen återupptas
- När en granskare accepterar, redigerar eller avvisar utkastet uppdateras samma historikpost med det slutliga exekveringsresultatet
- Om samma körning pausar för HITL mer än en gång förblir historikposten densamma medan varje kontrollpunkt får sin egen engångsgranskningslänk

Detta är särskilt användbart för portalkörningar och långlivade workflows som kan vänta i timmar eller dagar innan de fortsätter.

## Kopiera

Använd **Copy** bredvid Inputs eller Outputs för att kopiera JSON till urklipp.

## Rensa historik

- **Per workflow**: I editorns historikdialog, klicka på **Clear history** för att ta bort körningar för den aktuella workflowen.
- **All historik**: I Dashboard/Evals historikdialog, klicka på **Clear all history** för att ta bort alla exekveringsposter som ägs. Körningar från delade workflows behålls. Denna åtgärd kan inte ångras.

## Information om exekveringens tidslinje

När editorns **Execution Log** är öppen, klicka på timer-knappen för att visa exekveringens tidslinje. Välj ett spann för att öppna en infogad detaljgranskare som tar över radernas område. Den visar det valda stegets status, varaktighet, antal försök, återförsöksinformation, fel, trace-ID och en kompakt förhandsvisning av utdata. Utdata av typen objekt och array använder samma `JsonTree`-visare som resten av Debug-panelen; skalära värden använder en textförhandsvisning. När ett steg matar ut bilder (Playwright-skärmbilder, genererade bilder, bildfiler) visas de som miniatyrbilder ovanför utdata, och JSON visar en kort platshållare i stället för den råa base64-koden. Klicka på en miniatyrbild för att öppna den i en lightbox; pilknapparna eller ←/→-tangenterna stegar genom varje bild i körningen, med en räknare som `2 / 5`. Använd **Open trace** för LLM- och Agent-spann när ett trace-ID är tillgängligt.
## Information om mobil nod

På en telefon visar redigeraren ett helskärmsläge för workflow-trädet i stället för den fria canvasen. Tryck på en trädnod med ett registrerat resultat för att öppna dess körning som en helskärmsdetalj. Vyn tillhandahåller separata flikar för **Input Data**, **Output Data** och **Errors**. Fliken för utdata visar det registrerade resultatet och erbjuder **Copy Output**; fliken för indata visar den valda nodens konfiguration, och fliken för fel visar det registrerade felet när noden misslyckades. Använd **Back to workflow** eller stängningsknappen för att återgå till trädet.

Canvasens och dashboardens historikdialoger behåller sina körningskontroller på en rad och placerar de tillgängliga tagg- och instansfiltren i ett responsivt rutnät. Deras filtermenyer använder samma in-app-väljare, så den valda bockmarkeringen har en konsekvent marginal och baslinje med varje alternativetikett.

## Relaterat

- [Triggers](./triggers.md) – Hur workflows startas; historiken registrerar `trigger_source` (inklusive `board` för körningar som startats av [Board](../tabs/board-tab.md)-kortflyttningar och uppföljningar)
- [Human-in-the-Loop](./human-in-the-loop.md) – Väntande gransknings-URL:er och återupptagandebeteende
- [Edit History](./edit-history.md) – Versionshantering för workflow-sparningar (återställ, diff)
- [Quick Start](../getting-started/quick-start.md) – Bygg och kör det första workflowet
- [Workflows Tab](../tabs/workflows-tab.md) – Skapa och hantera workflows
