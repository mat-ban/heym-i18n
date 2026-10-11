# Human-in-the-Loop

Human-in-the-Loop (HITL) gör det möjligt för en [Agent-nod](../nodes/agent-node.md) att begära godkännande vid specifika tillfällen, vänta på ett mänskligt beslut och sedan fortsätta workflowen från samma exekveringsögonblick.

## Vad det gör

- Lägger till explicita godkännandekontrollpunkter i en agent utan att bygga en separat godkännandeworkflow
- Skapar en engångs-URL för offentlig granskning på `/review/{token}`
- Låter en granskare välja `Accept`, `Edit & Continue` eller `Refuse`
- Markerar exekveringen som `pending` tills ett beslut inkommer
- Återupptar den pausade exekveringen och låter agenten fortsätta efter godkännande
- Stöder flera sekventiella HITL-kontrollpunkter i samma agentkörning

## Agent-konfiguration

Aktivera HITL i agentens egenskapspanel.

| Inställning | Beskrivning |
|---------|-------------|
| `hitlEnabled` | Aktiverar mänsklig granskning för denna agent |
| `hitlSummary` | Riktlinjer för godkännande avseende när agenten ska begära mänsklig granskning |

HITL lägger till ett `request_human_review`-verktyg i agenten. Använd systemprompten och `hitlSummary`-riktlinjerna för att tala om för agenten vilka åtgärder som kräver godkännande. När agenten bedömer att en kontrollpunkt behöver granskas skickas en enda Markdown-granskningstext till människan. Den granskarvända sammanfattningen genereras från agentens begäran vid körning; om agenten utelämnar den härleder Heym en från Markdown-innehållet. I v1 stöder HITL endast agentutdata i textläge, så det kan inte kombineras med `jsonOutputEnabled`.

För MCP-verktyg ber Heym modellen att tolka de skrivna HITL-instruktionerna till en av tre godkännandescope:

- `always` för fraser som "always", "on each" eller "for each"
- `once` för fraser som "once" eller "only one time"
- `never` för fraser som "never", "do not ask" eller "already approved"

Den tolkningen styr huruvida upprepade MCP-anrop pausar igen, förblir godkända en gång eller hoppar över mänsklig granskning helt.

När HITL är aktiverat exponerar agenten även ett andra canvas-utdatahandtag märkt `review`. Använd den grenen för att skicka den väntande gransknings-URL:en och sammanfattningen till Slack, e-post, loggning eller något annat aviseringsflöde medan huvudexekveringen väntar på en person.

## Granskningsflöde

1. Agenten når ett steg som kräver godkännande och anropar `request_human_review`
2. Heym skapar en offentlig granskningsbegäran och returnerar en gransknings-URL
3. Alla noder som är anslutna till agentens `review`-handtag körs omedelbart med den väntande HITL-payloaden
4. Workflow-exekveringen övergår till `pending`
5. En granskare öppnar `/review/{token}` utan att logga in
6. Granskaren väljer en åtgärd:
   - `Accept` fortsätter med den ursprungliga Markdown-texten
   - `Edit & Continue` fortsätter med den redigerade Markdown-texten
   - `Refuse` fortsätter med `decision: "refused"` och hoppar över ytterligare agentåtgärder
7. Heym återupptar workflowen från den lagrade ögonblicksbilden och låter agenten fortsätta med den godkända Markdown-kontexten
8. Om ett senare steg också kräver godkännande kan agenten anropa HITL igen och skapa ännu en väntande kontrollpunkt

Granskningslänkar upphör att gälla efter 168 timmar om ingen svarar.

## Offentlig granskningssida

Den offentliga granskningssidan visar:

- Workflowens namn och agentens etikett
- En automatiskt genererad granskarsammanfattning från agentens granskningsbegäran
- Markdown-granskningstexten först, som huvudinnehåll
- En redigeringsruta som endast öppnas efter att granskaren klickar på `Edit`
- En live Markdown-förhandsvisning under redigering
- Åtgärdsknappar för `Accept`, `Edit & Continue` och `Refuse`

När ett beslut har skickats in låses token och kan inte återanvändas.

## Utdata och exekveringstillstånd

Medan granskning väntar innehåller agentens utdata en väntande payload:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Efter att granskaren har svarat och workflowen återupptas innehåller agentens slutliga utdata beslutsmetadata:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Använd `$agentLabel.decision` i nedströms noder för att förgrena på utfall som accepterats, redigerats eller nekats.

## Canvas-granskningsgren

Utdatahandtaget `review` är endast tillgängligt när `hitlEnabled` är aktiverat för en agent.

- Det körs innan det mänskliga beslutet inkommer
- Det tar emot den väntande HITL-payloaden, inklusive `summary`, `draftText`, `reviewUrl`, `shareText` och `shareMarkdown`
- Det är avsett för aviserings- eller överlämningssteg såsom Slack, e-post eller granskningsloggning
- Det körs en gång för varje HITL-kontrollpunkt
- Det körs inte igen efter att granskaren har svarat; endast den normala agentutdata-vägen fortsätter vid återupptagning
## Var det visas

- [Execution History](./execution-history.md) visar `pending`-körningar omedelbart och lagrar gransknings-URL:en i nodresultat
- [Portal](./portal.md) chattsvar visar länken för mänsklig granskning i stället för ett tomt svar
- Debug-panelen och historikdialoger visar det slutliga HITL-beslutet och den granskade texten
- Utdatahandtaget för granskning kan meddela externa kanaler även när workflowet utlöstes av cron, curl eller portaltrafik
- Flera HITL-kontrollpunkter återanvänder samma post i körningshistoriken samtidigt som en ny engångslänk för granskning skapas vid varje paus

## Aktuella begränsningar

- HITL är endast tillgängligt på Agent-noder
- HITL använder agentens textutdata och stöder inte JSON-utdata i v1
- En pausad körning återupptas från den lagrade workflow-ögonblicksbilden, inte från den senast redigerade workflow-versionen
- Nästlade sub-workflows kan inte gå in i ett väntande HITL-tillstånd i v1; begär granskning från den överordnade agenten innan de anropas

## Relaterat

- [Agent Node](../nodes/agent-node.md) - Konfigurera HITL på en agent
- [Agent Architecture](./agent-architecture.md) - Hur agenter, verktyg, sub-agenter och HITL hänger samman
- [Execution History](./execution-history.md) - Inspektera väntande och återupptagna körningar
- [Board](../tabs/board-tab.md) - Board-kedjekörningar pausar kortet i ett väntande (gult) tillstånd vid HITL
- [Portal](./portal.md) - Publika chattflöden och HITL-granskningslänkar
