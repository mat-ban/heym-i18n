# AI-assistent

**AI-assistenten** är en chattpanel som öppnas från Debug-panelen och startar längst ned till höger i editorn. Dra i rubriken för att flytta panelen och dra i en kant eller ett hörn för att ändra dess bredd eller höjd. Den krymper inte under 360×480 pixlar. Positionen och storleken sparas i den här webbläsaren. **Återställ position och storlek** i rubriken placerar panelen tillbaka längst ned till höger. Använd naturligt språk för att skapa eller ändra workflows – beskriv vad som önskas, och AI:n genererar noder och kanter som tillämpas på canvasen.

För dokumentationsfrågor utanför editorn, använd [Chatta med Heym](./chat-with-heym.md). Den ytan är optimerad för sidmedveten produkthjälp i stället för workflow-generering.

## Öppna panelen

1. Öppna en workflow i editorn
2. Lokalisera **Debug-panelen** längst ned (området för körningsresultat)
3. Klicka på **AI**-knappen (Sparkles-ikonen) i panelens verktygsfält
4. AI-assistentpanelen öppnas längst ned till höger. Dra i dess rubrik för att flytta den, eller dra i en kant eller ett hörn för att ändra dess bredd och höjd.

Tryck `Ctrl + I` / `Cmd + I` var som helst i editorn för att öppna eller stänga panelen – kortkommandot fungerar även när ett textfält är fokuserat. Se [Kortkommandon](./keyboard-shortcuts.md).

Om arbete ska utföras på en enskild nod förs markören över den på ritytan och klickas på **AI** ovanför den. Panelen öppnas fokuserad på denna nod. Se [Ändra en enskild nod](#changing-one-node).

## Stänga panelen

Klicka på **X**-knappen, tryck `Ctrl + I` / `Cmd + I`, eller växla **AI**-knappen i Debug-panelens verktygsfält. Rubriken används för att dra panelen, inte för att stänga den.

## Konfiguration

Innan meddelanden skickas, välj:

| Inställning | Beskrivning |
|---------|-------------|
| **Autentiseringsuppgift** | LLM-autentiseringsuppgift (API-nyckel) från [Autentiseringsuppgifter](../tabs/credentials-tab.md) |
| **Modell** | Modellnamn (t.ex. `gpt-4o`, `gemini-2.5-flash`) |

Lägg till autentiseringsuppgifter i [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md). Modellistan laddas från den valda autentiseringsuppgiften.

## Agent-läge vs Frågeläge

Panelen har två lägen som växlas med **Agent / Fråga**-chipen i panelens rubrik.

| Läge | Standard | Beteende |
|------|---------|-----------|
| **Agent** | ✓ | Bygger och ändrar canvasen. AI:n genererar ett workflow-JSON-block som automatiskt tillämpas på canvasen när svaret är klart. |
| **Fråga** | | Besvarar endast frågor. Canvasen berörs aldrig. Använd detta för att ställa frågor om aktuellt workflow, Heym-funktioner eller få råd utan att utlösa en canvas-uppdatering. |

Lägena kan växlas när som helst. Att byta läge rensar inte konversationen.

I Agent-läget gör rutan **YOLO-läge** under meddelandefältet att assistenten kör och åtgärdar det den bygger. Se [YOLO-läge](#yolo-läge).

## Använda chatten

- Skriv in önskad begäran i inmatningsfältet (t.ex. "Skapa en workflow som tar emot användarinmatning och skickar den till en LLM")
- Tryck **Enter** för att skicka (Shift+Enter för ny rad)
- AI:n strömmar sitt svar. I **Agent**-läget, om svaret innehåller en workflow i ett \`\`\`json-kodblock, tolkas det automatiskt och tillämpas på canvasen. I **Fråga**-läget ändras aldrig canvasen.
- Använd **Rensa** för att återställa konversationen
- Håll muspekaren över ett meddelande och klicka på dess kopieringsikon för att kopiera texten det visar, inklusive eventuell workflow-JSON
- Dra i linjen ovanför meddelanderutan för att göra rutan högre. Inmatningsområdet kan växa till 60 % av panelen och återgår till sin standardhöjd när sidan laddas om

## Automatisk tillämpning av workflow

När AI-svaret innehåller ett giltigt workflow-JSON-block (med `nodes` och eventuellt `edges`) i ett \`\`\`json-kodblock, gör Heym följande:

1. Tolkar JSON från svaret
2. Ersätter den aktuella canvasen med de nya noderna och kanterna
3. Rensar upp nodlayouten
4. Markerar workflowen som osparad

Om tolkningen misslyckas visas en **Försök igen**-knapp för att generera om svaret.

## Ändra en enskild nod

För markören över en nod på ritytan och klicka på **AI** ovanför den. Panelen öppnas i Agent-läge med fokus på den noden och visar vilken nod som ändras:

| Noden har... | Panelen visar |
|---|---|
| Inget resultat i den aktuella körningen | **Modifying Node:** i en kompakt rad med nodens ikon och namn. Assistenten redigerar enbart utifrån nodens konfiguration; kör noden först om den behöver se utdata |
| Ett resultat i den aktuella körningen | **Modifying Node: (Has Node Output)** ovanför själva noden: ikon, namn och typ, senaste status och varaktighet samt felet om den misslyckades. Assistenten ser denna utdata och felet när noden redigeras |

För markören över etiketten för att se vilket tillstånd panelen befinner sig i.

Oavsett panelens tillstånd läser assistenten även nodens dokumentationssida bakom bokikonen i nodens rubrik. Den använder sidan för att förstå nodens alternativ och besvara frågor om dem.

Under meddelandena finns tre alternativ för att starta förfrågan:

| Alternativ | Vad det gör |
|---|---|
| **Change this node as ...** | Fyller i meddelanderutan med *Ändra denna nod till* så att meningen kan slutföras |
| **Fix error in this node ...** | Fyller i *Åtgärda felet i denna nod.* Assistenten läser denna nods fel från senaste körningen |
| **Other** | Fokuserar en tom meddelanderuta |

Redigera texten och tryck på **Send**. Assistenten returnerar endast denna nod och Heym uppdaterar den på plats: noden behåller sitt id, typ och namn, så att uttryck som `$checkLinkedIn.result` i andra noder fortsätter att fungera. Andra noder, anslutningar och layouten ändras inte, och **Undo** återställer föregående konfiguration.

Om förfrågan inte ryms inom noden – exempelvis om en annan nodtyp eller en ny nod krävs – anger assistenten vad som behöver ändras i stället för att redigera. Stäng nodfokuset med **X** på nodkortet för att redigera hela arbetsflödet igen. Att stänga panelen rensar också fokuset.

[YOLO-läge](#yolo-mode) fungerar med en fokuserad nod: assistenten ändrar noden, kör arbetsflödet och åtgärdar noden tills körningen lyckas. I **Ask**-läge anger fokuset för assistenten vilken nod frågan gäller och ritytan ändras inte.

## YOLO-läge

**YOLO-läge** låter assistenten testa det den bygger. Markera rutan **YOLO-läge** under meddelandefältet och skicka sedan begäran. Rutan visas endast i Agent-läget. Den är avstängd som standard och återställs till avstängd när sidan laddas om. Håll muspekaren över infoikonen bredvid den för en kort sammanfattning.

Med YOLO-läge på slutar assistenten inte efter att den har tillämpat en workflow:

1. Den tillämpar workflowen på canvasen.
2. Före den första körningen efterfrågas testindata. Kortet listar workflowens inmatningsfält, ifyllda med värden som assistenten föreslår. Redigera dem och tryck **Kör**. Senare körningar återanvänder dessa värden. Kortet visas bara igen när inmatningsfälten ändras eller assistenten behöver andra testdata.
3. Den kör workflowen på canvasen precis som **Kör**-knappen: osparade ändringar sparas först, noder tänds och körningen visas i Debug-panelen och [Körningshistorik](./execution-history.md).
4. Den läser resultatet. Om körningen gjorde det som efterfrågades avslutar den med **Verifierad** och en kort sammanfattning. Om inte åtgärdar den workflowen och kör den igen.

Den gör högst **5 körningar** per meddelande. Tryck **Stopp** när som helst för att avsluta loopen och stoppa en pågående körning.

Varje svar visar sina steg allt eftersom de inträffar:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, med en `Executing <node>`-rad för varje nod;
- den slutliga bedömningen.

Efter varje körning visas en kort rad som *Attempt 1 result sent · error in 1.2s* som visar att resultatet skickades tillbaka till assistenten.
### Köra andra workflows

I YOLO-läge kan assistenten även köra andra workflows när den behöver deras resultat. Den kan till exempel kontrollera vad en workflow returnerar innan den anropas från en [Execute](../nodes/execute-node.md)-nod. Dessa körningar visas som stegen `Running workflow "<name>"...` och registreras i Körningar med triggerkällan `ai_assistant`. Den workflow som redigeras testas alltid på canvas.

### När den avbryts i förtid

| Situation | Vad som händer |
|---|---|
| Assistenten behöver ett beslut, information, en autentiseringsuppgift eller en datatabell | Den frågar med det vanliga frågekortet. Ett svar fortsätter loopen. |
| Körningen väntar på en [mänsklig granskning](./human-in-the-loop.md) | Loopen stoppas. Godkänn granskningen och skicka sedan ett meddelande. |
| Workflowen väntar på en filuppladdning | Loopen stoppas. YOLO-läge kan inte testa körningar som utlöses av uppladdningar. |
| En nyare version av workflowen har sparats någon annanstans | Loopen stoppas. Lös sparandekonflikten och skicka sedan ett meddelande. |

> **Körningar är verkliga.** E-postmeddelanden, meddelanden och API-anrop i workflowen skickas faktiskt vid varje försök, och DataTable-noder skriver verkliga rader. Varje körning sparar workflowen, så tidigare versioner finns kvar i [Historik](./edit-history.md).

## Röstinmatning

I webbläsare som stöder det aktiverar en **Voice**-knapp tal-till-text. Klicka för att starta inspelningen, klicka igen för att stoppa. Den transkriberade texten skickas till AI:n för grammatikkorrigering innan den skickas.

## Agent-nod kontra AI-assistent

| | Agent-nod | AI-assistent |
|---|------------|---------------|
| **Syfte** | LLM-nod inuti en workflow; körs under exekvering | Chat-gränssnitt för att bygga workflows med naturligt språk |
| **Placering** | Nod på canvas | Debug-panel → flytande panel |
| **När** | Vid körning | Under redigering |

Se [Agent-nod](../nodes/agent-node.md) för den workflow-nod som utför LLM-anrop med verktyg och MCP.

## Hur det fungerar (AI Builder DSL)

AI-assistenten drivs av en **workflow-DSL** (domänspecifikt språk) som beskriver noder, kanter och uttryck. När ett meddelande skickas:

1. Meddelandet samt [Användarregler](./user-settings.md) och den aktuella workflowen (om någon) skickas till backend.
2. Backend bygger en **system-prompt** som innehåller:
   - Den fullständiga workflow-DSL:en (nodtyper, uttryckssyntax, regler, exempel)
   - Användarregler som läggs till som "User Custom Rules"
   - Den aktuella workflowens JSON när en befintlig workflow redigeras
   - Listan över tillgängliga workflows om Execute-noden används
   - Namnen, typerna och id:na för autentiseringsuppgifterna som du äger eller som har delats med dig (aldrig deras värden)
   - Namnen, id:na, beskrivningarna och kolumnerna för de datatabeller som kan användas (aldrig deras rader)
3. Modellen returnerar ett enda workflow-JSON-block (med `nodes` och `edges`). Frontend tolkar det och tillämpar det på canvas.

### Autentiseringsuppgifter

När en workflow behöver en autentiseringsuppgift frågar assistenten innan den byggs. Om det finns autentiseringsuppgifter av en passande typ listas de tillsammans med **Create a new credential**; om inga finns frågar den om en sådan ska skapas. Varje fråga gör det även möjligt att fortsätta utan autentiseringsuppgift.

Om alternativet att skapa en väljs öppnas formuläret för autentiseringsuppgifter i panelen, förifyllt med rätt typ och ett föreslaget namn. Värdena går direkt till Heym; assistenten får endast kännedom om namnet och typen. OAuth-autentiseringsuppgifter (Google Sheets, Google Drive, BigQuery, Linear, Notion) ansluts i en popup, och en länk till auktoriseringssidan visas om popup-fönstret blockeras. När autentiseringsuppgiften har sparats visar kortet dess namn och skapaknappen stängs av; tryck på **Submit answers** och assistenten placerar den nya autentiseringsuppgiften på noden.

Det går även att begära en autentiseringsuppgift separat ("create a GitHub credential") eller begära att ändra en som redan finns ("update my sheet credential", "reconnect my Google Sheets"). Assistenten svarar med samma kort: skapande öppnar ett tomt formulär, uppdatering öppnar formuläret för den autentiseringsuppgiften med dess hemligheter maskerade.

Assistenten föredrar en dedikerad nod. När ingen nod täcker en åtgärd, till exempel att lägga till en flik i ett Google Sheet, används en HTTP-begäran och rubrikraden skrivs för den valda autentiseringsuppgiften. Se [HTTP › Autentisering med autentiseringsuppgifter](../nodes/http-node.md#authenticating-with-credentials).

Klargörande frågor som workflowen klarar sig utan anger **Optional** i sin inmatning och kan hoppas över.

DSL:en framtvingar camelCase-etiketter, enhetliga uttrycksregler och nodspecifika fält. Om ett fältvärde är ett enda `$expr` bevarar backend den ursprungliga typen; om värdet blandar prosa med `$refs` blir resultatet en sträng. Regeln om ett enda `$` gäller fortfarande: inget `$` inuti parenteser. [Inställningar](./user-settings.md) Användarregler injiceras i denna system-prompt så att preferenserna tillämpas på varje AI-genererad workflow.

Om den aktuella workflowen innehåller Agent-skills inkluderar AI-assistenten endast varje skills `SKILL.md` i den workflowkontexten. Bifogade `.py`-filer och binära skill-tillgångar tas bort före begäran så att byggaren håller sig inom modellens kontextgränser även när skills innehåller stora implementationer.
### Datatabeller

När ett workflow sparar, lagrar eller slår upp poster och ingen annan lagring har namngetts, använder assistenten en [DataTable](../nodes/datatable-node.md)-nod. Om en av tabellerna namnges och den har de kolumner som workflowet behöver, används den. Annars efterfrågas vilken tabell som ska användas. Kortet listar de tabeller som passar, var och en med sin beskrivning och sina kolumntyper, samt **Skapa en ny tabell** med ett föreslaget namn och föreslagna kolumner. Tabeller som delats med användaren erbjuds också; en tabell som endast kan läsas erbjuds enbart för läsning.

Välj den nya tabellen och tryck på **Skicka svar**: kortet skapar tabellen, och assistenten anger dess id på noden och använder dess exakta kolumnnamn. Det går även att begära en tabell separat, till exempel "skapa en tabell för mina leads".

Canvas-assistenten ser tabellnamn, beskrivningar och kolumner, aldrig rader. Den konfigurerar workflow-noder utifrån dessa metadata; lägg till kolumner på [fliken DataTable](../tabs/datatable-tab.md) eller be [Chat](../tabs/chat-tab.md). Chat och `heym_chat` kan granska rader och direkt lägga till eller ta bort kolumner samt infoga, uppdatera eller ta bort rader i tabeller du äger eller har skrivbehörighet till, inklusive teamdelningar. Borttagning av kolumner och rensning av alla rader kräver bekräftelse innan data tas bort.

## Relaterat

- [Varför Heym](../getting-started/why-heym.md) – Naturligt språk som första steg i agentens livscykel
- [Snabbstart](../getting-started/quick-start.md) – Bygg ett första workflow
- [Inställningar](./user-settings.md) – Användarregler som injiceras i AI-assistentens systemprompt
- [Chatta med Heym](./chat-with-heym.md) – Sidmedveten assistent i dokumentationsområdet
- [Grundläggande begrepp](../getting-started/core-concepts.md) – Workflows, noder och exekveringsflöde
- [Agent-nod](../nodes/agent-node.md) – LLM-nod med verktyg och MCP
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till API-nycklar för AI-assistenten
- [Workflow-struktur](./workflow-structure.md) – JSON-format för workflows
