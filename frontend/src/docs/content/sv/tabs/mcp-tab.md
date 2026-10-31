# MCP- / A2A-fliken

Fliken **MCP** konfigurerar integrering av Model Context Protocol (MCP), och som [Agent2Agent](https://github.com/google/A2A) (A2A 1.0)-servrar som andra agenter kan delegera uppgifter till. MCP gör att AI-klienter (Claude, ChatGPT, Gemini, Cursor och alla MCP-kompatibla verktyg) kan anropa Heym-workflows som verktyg.

Heym stöder två lägen: en **standardserver** som exponerar alla MCP-aktiverade workflows under en enda endpoint, och **namngivna servrar** som ger varje logisk grupp av workflows sin egen dedikerade URL och API-nyckel.

Båda lägena kan exponera två typer av verktyg: enskilda **workflows** och **Heym-chattverktyget** — hela motorn från [Chat-fliken](./chat-tab.md) bakom ett enda `heym_chat`-verktyg.

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

## Standard-MCP-server

Standardservern är alltid tillgänglig på `{origin}/api/mcp/sse`. Alla workflows med MCP aktiverat visas som verktyg här.

### MCP API-nyckel

- Nycklar lagras som SHA-256-digester, så Heym kan inte visa en befintlig nyckel. Fliken rapporterar huruvida en är angiven, inte vad den är.
- **Generate** / **Regenerate** – Den nya nyckeln visas en gång, direkt efter att den har skapats. Kopiera den då; vid omladdning av fliken döljs den för gott.
- Använd denna nyckel vid anslutning av Claude Desktop, Cursor eller andra MCP-klienter till Heym
- Har en nyckel förlorats? Generera om den. Den tidigare nyckeln slutar fungera omedelbart.

### Anslutningsmetoder

- **API Key** – Använd MCP API-nyckeln för programmatiska anslutningar. Fliken kan kopiera en färdig JSON-konfiguration och innehåller en **Add to Cursor**-knapp för konfiguration av Cursor med ett klick.
- **Claude** – Fliken visar MCP-serverns URL och konfigurationssteg för Claude. Lämna OAuth Client ID och Secret tomma; Claude registrerar sig automatiskt och autentiserar via Heym OAuth.
- **ChatGPT** – Fliken visar MCP-serverns URL och inställningsstegen för en ChatGPT-app. Aktivera utvecklarläget, skapa en app med URL:en och välj OAuth; ChatGPT registrerar sig automatiskt.
- **Gemini** – Fliken visar MCP-serverns URL och inställningsstegen för en anpassad Gemini-app: på gemini.google.com, gå till **Settings → Connected Apps → Add a custom app**, klistra in URL:en och lämna **Advanced features** stängt; Gemini registrerar sig automatiskt och autentiserar via Heym OAuth. När den är ansluten fungerar Heym även i Geminis mobilapp.

### MCP-växel per workflow

Varje workflow kan exponeras som ett MCP-verktyg:

- **Enable** – Workflowens verktyg blir tillgängliga för alla klienter som är anslutna till standardservern
- **Disable** – Workflowen exponeras inte

Workflow-kort visar beskrivningen och en förhandsvisning av namn på inmatningsfält så att det går att se vad varje verktyg förväntar sig innan det aktiveras.


### Köade körningar och heym_execution_status

Ett workflow med en [samtidighetsgräns](../reference/webhooks.md#concurrency-limit-and-queued-runs) kan vara upptaget när en klient anropar det. Anropet returnerar omedelbart ett resultat som inte är ett fel:

```json
{
  "status": "queued",
  "execution_id": "6f1c0c2e-...",
  "queue": { "position": 2, "size": 5, "running": 1, "limit": 1 },
  "next_step": "Call heym_execution_status with this execution_id every 5-10 seconds until status is success, error, cancelled or expired."
}
```

Klienten pollar verktyget `heym_execution_status` med detta `execution_id`. Det returnerar samma kropp som [status-URL:en](../reference/webhooks.md#status-url): `queued` med aktuell position, `running`, sedan `success` eller `error` med utdata. Det hittar bara körningar av workflows som samma server exponerar. Verktyget listas på standardservern och på varje namngiven server endast så länge minst ett av dess workflows har en samtidighetsgräns. När kön är full returnerar anropet felet "Concurrency queue is full".
## Heym-agent

Avsnittet **Heym Capabilities** gör motorn från Chat-fliken till ett enda MCP-verktyg med namnet `heym_chat`. Det kan aktiveras på standardservern, på valfri namngiven server eller på båda — varje yta har sin egen växel och modellval.

När det är aktiverat visas `heym_chat` i `tools/list` tillsammans med workflow-verktygen. En MCP-klient skickar ett meddelande i naturligt språk och Heym-motorn tar över därifrån, med samma förmågor som Chat-fliken har:

- Bygga ett workflow, testköra det med exempelindata, åtgärda fel och avsluta när en körning lyckas (se [Byggläge](#build-mode))
- Inspektera och köra dina befintliga workflows
- Rapportera analys, senaste körningar och kommande cron-scheman
- Förklara var arbetsflöden misslyckas och varför de är långsamma: de arbetsflöden som körts mest, misslyckats mest och är långsammast, samt de nodtyper med mest tid, fel och anrop under de senaste 1, 3 eller 6 timmarna, 24 timmarna, 7 eller 30 dagarna eller sedan start
- Rapportera körhistoriken för en workflow: hur många gånger den har körts, statusantal, när den kördes och på begäran indata, utdata och fel per nod för en enskild körning
- Rapportera vad som körs just nu: hur många körningar som är aktiva, deras workflow-namn, hur länge var och en har kört, vilken nod var och en för närvarande befinner sig på och en länk till den live-körningen
- Lista boards, skapa kort och läsa kortdetaljer på [Board-fliken](./board-tab.md)
- Lista instrumentpaneler (sidor i Heym Work) och deras widgetar, ta reda på vilken instrumentpanel ett arbetsflöde finns på, lägga till en ny widget och bygga dess arbetsflöde, placera ett befintligt arbetsflöde som widget, byta namn på eller ta bort widgetar eller snygga till layouten (se [Dashboard › Från Chat och MCP](./dashboard-tab.md#from-chat-and-mcp))
- Inspektera datatabeller och rader, skapa tabeller, lägga till eller ta bort kolumner, infoga, uppdatera eller ta bort rader och koppla in tabeller i arbetsflöden
- Skapa, redigera och köra utvärderingssviter för prompter och agenter ([Eval suites](./evals-tab.md#from-chat-and-mcp)), inklusive en agents baslinje: rapporterad, byggd från körningar eller angiven i siffror. Resultatet listar Evals-länken för varje sparad svit.
- Skapa eller uppdatera dina autentiseringsuppgifter på Heyms egen sida (se [Autentiseringsuppgifter](#autentiseringsuppgifter))
- Läsa teams och globala variabler samt söka i dokumentationen
- Godkänna, redigera eller avvisa väntande human-in-the-loop-granskningar

Förmågor som läggs till i Chat-fliken senare blir automatiskt tillgängliga via `heym_chat` — det finns ingen växel per förmåga att hålla synkroniserad.

Dessa funktioner körs inuti `heym_chat`: `tools/list` visar `heym_chat` och verktygen för dina arbetsflöden, aldrig chattens interna verktyg såsom de för utvärderingssviter.

### Byggläge

`heym_chat` kör alltid Chat-motorn i byggläge (build mode). I ett enda anrop kan assistenten spara ett nytt workflow, köra det med realistiska exempelindata, läsa körningsrapporten, åtgärda det som misslyckades och köra det igen, upp till fem testkörningar per anrop. När den senaste körningen av den senaste sparningen lyckas avslutar den med en sammanfattning på en mening, och svaret slutar med `Verified: the latest test run of the saved workflow passed.`

När ett anrop skapar eller redigerar ett workflow listar svaret vart och ett med dess fullständiga redigeringslänk, såsom `https://heym.example.com/workflows/<id>`, och länkarna i assistentens svar är också fullständiga länkar. De använder din konfigurerade Heym-adress (`FRONTEND_URL`) och öppnas för personer som är inloggade på Heym och har behörighet till det workflowet.

- Testkörningar är riktiga körningar. Deras sidoeffekter inträffar och de visas i workflowets körningshistorik precis som alla andra körningar.
- Sparningar följer redigerarens väg: en ändring i grafen behåller den föregående grafen i workflowets **Edit History**.
- För att ändra ett workflow som den byggde tidigare fortsätter du tråden med samma `conversation_id`. Assistenten uppdaterar det workflowet istället för att skapa ett nytt, och ändrar bara workflows som du har behörighet att redigera.
- När de fem testkörningarna är förbrukade stannar assistenten och förklarar vad som fortfarande misslyckas.

Datatabeller är annorlunda. En tabell innehåller inga hemligheter, så `heym_chat` kan lista tabeller, fråga vilken en workflow ska använda och skapa en ny med dess kolumner. Den läser eller skriver aldrig rader.

### Autentiseringsuppgifter

`heym_chat` ser de autentiseringsuppgifter du äger och de som delats med dig, efter namn och typ, på samma sätt som fliken Chat. När ett workflow den bygger behöver en autentiseringsuppgift frågar den vilken som ska användas i resultatet. Svara med samma `conversation_id`.

För att lägga till en autentiseringsuppgift eller uppdatera en du äger öppnar assistenten Heyms formulär på en Heym-sida, `/credentials/setup/<id>`. Du loggar in på Heym där, anger nyckeln eller ansluter kontot och trycker på spara. Värdet går direkt till Heym: MCP-klienten och dess modell får bara information om autentiseringsuppgiftens namn och typ. Klistra inte in nycklar i MCP-klienten; be om formuläret istället.

| Klient | Vad som händer |
|--------|----------------|
| Stöder MCP URL-elicitering | Klienten ber dig att öppna Heym-sidan. Anropet väntar medan du fyller i formuläret (upp till tio minuter) och fortsätter sedan med den nya autentiseringsuppgiften. |
| Allt annat | Resultatet innehåller länken och ber klienten anropa `heym_chat` igen med `wait_for_credential_form`. Det anropet väntar upp till fem minuter medan du fyller i formuläret och återupptar sedan konversationen. Om klienten inte väntar, spara formuläret och svara med samma `conversation_id`; nästa anrop vet att formuläret sparades och vilken autentiseringsuppgift det skapade. |

Sidan öppnas endast för det Heym-konto som startade begäran, så en vidarebefordrad länk är oanvändbar för alla andra. Ett formulär hålls öppet i 24 timmar och kan avvisas från sidan. När du sparar eller avvisar det visar steget i konversationen i fliken Chat resultatet.


### Credential och modell

`heym_chat` kör motorn på Heym-kontot, så den behöver en egen LLM-credential:

| Fält | Beteende |
|-------|----------|
| **Credential** | Välj valfri OpenAI-, Google- eller Custom-credential som är åtkomlig. Förifylls från den föredragna credentialen i [Settings](../reference/user-settings.md) när ingen har valts. |
| **Model** | Laddas från den valda credentialen. Förifylls från den föredragna modellen när credentialen matchar. |

Om någon av dem saknas visas verktyget fortfarande i `tools/list`, men varje anrop returnerar ett fel som uppmanar att slutföra konfigurationen i denna flik.


LLM- och Agent-noder i ett workflow som `heym_chat` bygger körs på denna autentiseringsuppgift och modell, inklusive autentiseringsuppgifter som delats med dig, så att testkörningar fungerar utan ytterligare konfigurationssteg. När `heym_chat` redigerar ett workflow behåller LLM- och Agent-noder som redan har en autentiseringsuppgift denna tillsammans med sin modell.
### Argument och historik

| Argument | Krävs | Beskrivning |
|----------|----------|-------------|
| `message` | Ja | Instruktionen eller frågan, i naturligt språk. |
| `conversation_id` | Nej | En `conversation_id` från ett tidigare `heym_chat`-resultat, för att fortsätta den tråden. |
| `wait_for_credential_form` | Nej | Med `conversation_id`: vänta tills användaren sparar eller avvisar formuläret som tråden öppnade, och skicka sedan `message`. |

Varje anrop skrivs till historiken i [Chat-fliken](./chat-tab.md) som en vanlig konversation, markerad med en pluggikon i konversationslistan. Meddelanden, verktygskort och pauser för förtydliganden ser exakt ut som en konversation som har startats själv, och tråden kan öppnas och fortsätta i webbläsaren. Varje resultat returnerar sin `conversation_id` så att MCP-klienten kan fortsätta samma tråd istället för att öppna en ny vid varje anrop.

När assistenten behöver förtydliganden pausar den och meddelar detta; svara med svaren med samma `conversation_id`.
### Aktivera A2A

När Heym-agenten är aktiverad visar kortet en kryssruta för **Aktivera A2A**. Markera den så kan andra agenter skicka uppgifter till Heym-agenten via Agent2Agent-protokollet (A2A 1.0). Kortet visar därefter webbadressen till **Agent Card** och slutpunkten **JSON-RPC endpoint**, vardera med en kopieringsknapp, samt ett `curl`-kommando för att hämta kortet. A2A använder samma nyckel och OAuth-inloggning som MCP. Om agenten stängs av inaktiveras även A2A. Se [A2A](../reference/a2a.md) för metoder, uppgiftsstatusar och ett exempel.

### Förlopp

Ett långvarigt anrop till `heym_chat` rapporterar vad agenten gör som MCP-förlopp (`notifications/progress`), med samma formuleringar som visas i Chat-fliken, till exempel `Testar arbetsflödet · försök 2/5`. Klienter som återställer sin tidsgräns vid varje förloppsmeddelande fortsätter att vänta medan agenten arbetar.

## Namngivna MCP-servrar

Namngivna servrar gör det möjligt att segmentera workflows i isolerade MCP-endpoints. Varje server har sin egen URL och API-nyckel, så olika AI-klienter, team eller användningsområden kan ansluta till exakt de workflows som behövs.

### Skapa en namngiven server

1. Ange ett namn i inmatningsfältet längst ned på MCP-fliken (t.ex. **CRM Tools**)
2. Klicka på **Create** — ett nytt serverkort visas omedelbart
3. Klicka på kortet för att expandera det

### Inställningar per server

Varje serverkort visar:

| Inställning | Beskrivning |
|---------|-------------|
| **SSE Endpoint** | Unik URL: `{origin}/api/mcp/servers/{uuid}/sse` |
| **API Key** | Oberoende nyckel som visas en gång när den genereras eller återskapas. Kopiera den direkt; den lagras hashad och kan inte visas senare |
| **How to connect** | **Copy JSON** kopierar den färdiga MCP-konfigurationen; **Add to Cursor** installerar den med ett klick |
| **Heym Capabilities** | Slå på eller av Heym-agenten (`heym_chat`) för denna server och välj dess credential och modell |
| **Aktivera A2A** | Serverns egen A2A-brytare med eget Agent Card på `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Aktivera A2A** | Serverns egen A2A-brytare med eget Agent Card på `{origin}/api/a2a/servers/{uuid}/agent-card.json` |
| **Assigned Workflows** | Växla vilka av workflows som denna server exponerar |

### Tilldelning av workflows

Tilldelning av workflows sker per server och är oberoende av växeln för standardservern. En workflow kan vara aktiverad på standardservern och på flera namngivna servrar samtidigt, eller på ingen.

När en workflow växlas flyttas den till toppen av den tilldelade listan, så raden som just ändrades förblir synlig istället för att skrollas bort.

### Autentisering

Namngivna servrar stöder samma autentiseringsmetoder som standardservern:

- **X-MCP-Key header** – Skicka serverns API-nyckel direkt (API-klienter, Cursor). Endast header: nycklar accepteras inte som en `?key=`-query-parameter, eftersom URL:er hamnar i åtkomstloggar, proxyloggar och webbläsarhistorik.
- **Claude, ChatGPT och Gemini OAuth** – Lägg till serverns URL i klientens anslutningar eller anpassade appar; lämna credentials tomma så registrerar sig klienten automatiskt via OAuth. Bearer-token måste skickas i `Authorization`-headern, inte som `?token=`.
- **Session token** – Utfärdas under SSE-handskakningen; begränsad till den specifika servern så att tokens från en namngiven server inte kan komma åt en annan. Denna kortlivade `?session=`-parameter påverkas inte.

### Ta bort en namngiven server

Klicka på **X**-ikonen i en serverkorts header. Borttagning tar bort servern och alla dess workflow-tilldelningar; workflows påverkas inte i sig.

## SSE Endpoint

| Server | Endpoint |
|--------|----------|
| Default | `{origin}/api/mcp/sse` |
| Named | `{origin}/api/mcp/servers/{server-uuid}/sse` |

Båda endpoints stöder SSE-transporten (GET, MCP spec 2024-11-05) och Streamable HTTP-transporten (POST, MCP spec 2025-03-26). Claude, ChatGPT och Gemini använder OAuth 2.1 / PKCE för säker inloggning på båda.

## Relaterat

- [Why Heym](../getting-started/why-heym.md) – MCP som en förstklassig primitiv i Heym
- [Agent Node](../nodes/agent-node.md) – Agent-nod med stöd för MCP-verktyg
- [Agent Architecture](../reference/agent-architecture.md) – MCP-klient, verktygsdispatch, orkestrerare
- [Triggers](../reference/triggers.md) – MCP som en workflow-ingångspunkt
- [Chat Tab](./chat-tab.md) – Motorn bakom verktyget `heym_chat`
- [Workflows Tab](./workflows-tab.md) – Skapa och hantera workflows
- [Node Types](../reference/node-types.md) – Översikt över AI-noder
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompakt sidguide för dashboard-ytor