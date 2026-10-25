# Canvas-funktioner

Workflow-editorn tillhandahåller flera funktioner för felsökning, testning och organisering av noder: **Run to Node**, **AI på en nod**, **Data Pin**, **Execution Logs**, **Enable/Disable** och **Extract to Sub-Workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

## Run to Node

Håll muspekaren över valfri nod utom en sticky note och klicka på **Run** nedanför den. Heym kör den noden och dess uppströms beroenden, medan nedströms noder och orelaterade grenar lämnas orörda. Detta använder canvas testläge, inklusive pinnade utdata och workflowets normala grenvillkor.

Om den valda sökvägen har inmatningsfält öppnas panelen **Run** till höger och fokuserar det första fältet. Ange värdena och klicka sedan på **Run to _node label_** eller tryck på **Ctrl+Enter** (Cmd+Enter på macOS). Generiskt body-läge fokuserar JSON-body-editorn. Sökvägar utan inmatningsfält körs omedelbart utan att panelen öppnas. Pinnade Input-noder återanvänder sin pinnade utdata utan att begära indata.

Panelen behåller det valda målet för efterföljande körningar. Välj **Run full workflow** för att rensa målet. Run-knappar är inaktiverade medan en körning är aktiv. Ett mål inuti en loop stoppar körningen när den noden först nås; att välja en nod efter loopen kör den fullständiga uppströms loopen.

## AI på en nod

För markören över en valfri nod utom en fästis och klicka på **AI** ovanför den. [AI Assistant](./ai-assistant.md) öppnas på den noden och erbjuder **Change this node as ...**, **Fix error in this node ...** och **Other**. I Agent-läge ändrar assistenten endast den noden; andra noder, anslutningar och layouten förblir oförändrade. Se [AI Assistant › Ändra en enskild nod](./ai-assistant.md#changing-one-node).

Knappen är dold i arbetsflöden som endast kan visas.

## Data Pin

Data Pin gör det möjligt att pinna en nods utdata från den senaste körningen så att nedströms noder kan testas utan att köra den pinnade noden igen.

### Var det finns

- **Properties-panelen** – Välj en nod och scrolla till avsnittet **Pinned Data**
- **Node-badge** – En pin-ikon visas på noden när data är pinnad

### Åtgärder

| Åtgärd | Beskrivning |
|--------|-------------|
| **Pin** | Pinnar nodens senaste körningsutdata (tillgängligt efter en körning) |
| **Clear** | Tar bort pinnad data |
| **Edit** | Redigera den pinnade JSON direkt; klicka på Save för att tillämpa |

### Testlägesbeteende

Vid körning av ett workflow i testläge hoppar noder med `pinnedData` över körning och använder den pinnade utdatan istället. Använd detta för att:

- Testa nedströms logik utan att anropa externa API:er
- Felsöka uttryck som refererar till nodens utdata
- Iterera på prompts eller villkor med fasta exempeldata

Uttryckskomplettering i editorn använder pinnad data när sådan finns för att föreslå fält.

## Execution Logs

**Debug-panelen** (lådan längst ner) visar körningsloggar i realtid under workflow-körningar. En pågående produktionskörning kan även öppnas från antingen History-dialogen eller ett Board-kort. Editorn ansluter till den körningens SSE-ström, återställer slutförda nodresultat och fortsätter visa nodanimationer och loggar när nya noder startar och slutförs.

### Vad den visar

- **Nodresultat** – Status per nod (`success`, `error`, `skipped`, `running`), körtid och utdata
- **Slutliga utdata** – Aggregerade utdata från [Output](../nodes/output-node.md)-noder
- **Agent-förlopp** – För [Agent](../nodes/agent-node.md)-noder, stegvisa verktygsanrop och resonemang

### Åtgärder

- **Copy as JSON** – Kopiera hela körningsloggen till urklipp
- **Open in JSON editor** – Öppnar loggen i JSON Hero eller JSON Editor Online för granskning
- **Download generated files** – Om en skill producerade nedladdningsbara filer (`_generated_files`) visas en Download-knapp. En enskild fil laddas ner direkt; flera filer öppnar en urvalspopup.

### Skillnad från Logs-fliken

Debug-panelen visar loggar för **workflow-körning** (nodresultat, utdata). [Logs-fliken](../tabs/logs-tab.md) visar loggar för **Docker-container** (backend, frontend, databas). <!-- pragma: allowlist secret -->

## Enable / Disable

Noder kan inaktiveras så att de hoppas över under körning. Inaktiverade noder visar en "off"-badge och visas nedtonade.

### Hur växling görs

| Metod | Beskrivning |
|--------|-------------|
| **Properties-panelen** | Välj nod → Power-ikon (uppe till höger) |
| **Kontextmeny** | Högerklicka på nod(er) → Disable eller Enable |
| **Tangentbord** | Välj nod(er) → tryck på **D** (se [Keyboard Shortcuts](./keyboard-shortcuts.md)) |

### Flerval

När flera noder är valda tillämpas Enable/Disable på alla. Kontextmenyn visar "Enable" om någon vald nod är inaktiverad, "Disable" om alla är aktiverade.

### Körtidsbeteende

Noder med `active: false` hoppas över. Nedströms noder tar inte emot någon data från överhoppade noder. Använd detta för att tillfälligt utesluta noder utan att ta bort dem.

För att slå på eller av en nod inifrån ett workflow istället för manuellt, använd [Disable Node](../nodes/disable-node.md) och [Enable Node](../nodes/enable-node.md).
## Agent-minnesgraf

[Agent](../nodes/agent-node.md)-noder med **[persistent minne](./agent-persistent-memory.md)** aktiverat visar en rosa **hjärn**-kontroll på noden. Klicka på den för att öppna redigeraren för minnesgrafen: entiteter renderas som en animerad, kraftstyrd graf grupperad efter entitetstyp, med sökbara Source/Target-väljare för att lägga till relationer och en anslutningspanel för att hoppa mellan länkade entiteter. Samma dialog innehåller **Share memory with other agents** (workflow → agent → read eller read/write) för [delning av minne mellan agenter](./agent-persistent-memory.md#sharing-with-other-agents). Medan dialogen är öppen skjuts ångra/gör om på huvudarbetsytan upp så att grafredigeringen behåller sin egen historik.

**Filtrering av grafen.** Längst upp till vänster på arbetsytan finns en sökkontroll, kollapsad till en genvägsknapp tills den klickas eller **Ctrl/Cmd+F** trycks. Den matchar en entitets namn, dess typ och varje attributnyckel och -värde, samt en relations typ (`parent_of`) och dess egenskaper; en matchad relation tar med båda sina entiteter. Alla blankstegsseparerade termer måste matcha. En matchad entitet tar med hela sitt grannskap — varje relation den deltar i och entiteten på andra sidan av var och en — så en matchning lämnas aldrig som en okopplad punkt. En matchad relation tar endast med de två entiteter den förenar och stannar där, eftersom sökning på en relationstyp är en fråga om den relationen snarare än om allt dess ändar är kopplade till. Allt annat döljs helt — inte tonas ned — på arbetsytan och i listan **All edges**, och en badge visar hur många av de totala entiteterna som återstår. **✕** inuti rutan rensar först frågan och stänger sedan rutan vid ett andra tryck. Escape backar på samma sätt, innerst först: den rensar frågan, stänger sedan sökrutan, lämnar sedan den expanderade arbetsytevyn och stänger dialogen först när ingen av dessa är öppen. Rensning återställer hela grafen med varje entitet tillbaka där den var.

**Placering av entiteter för hand.** Att dra en entitet fäster den där den släpps, så att den automatiska layouten stabiliserar resten av grafen runt den istället för att dra tillbaka den. Att dra den valda entiteten flyttar dess direkt anslutna entiteter tillsammans med den och behåller klustrets form; att dra någon annan entitet flyttar bara den. **Tidy layout** (trollspöknappen) frigör varje fäst entitet och kör om den automatiska layouten.

## Extract to Sub-Workflow

Konvertera valda noder till ett återanvändbart sub-workflow och ersätt dem med en [Execute](../nodes/execute-node.md)-nod.

### Hur det används

1. Välj en eller flera noder på arbetsytan
2. Högerklicka → **Extract to Sub-Workflow**
3. Ange ett namn (och valfri beskrivning) för det nya workflowet
4. Klicka på **Extract**

### Vad som händer

- Ett nytt workflow skapas med de valda noderna
- Externa indata (kanter från utanför markeringen) blir sub-workflowets [Input](../nodes/input-node.md)-fält
- Externa utdata (kanter till noder utanför markeringen) mappas till sub-workflowets [Output](../nodes/output-node.md)
- De valda noderna ersätts med en enda [Execute](../nodes/execute-node.md)-nod som anropar det nya workflowet
- Mappningar för indata/utdata bevaras automatiskt

### Användningsområden

- Återanvänd en sekvens av noder över flera workflows
- Förenkla ett komplext workflow genom att gruppera relaterad logik
- Skapa modulära, testbara sub-workflows

## Run with cURL

Knappen **cURL** i redigerarens verktygsfält (uppe till höger) öppnar en dialog för att bygga och kopiera ett cURL-kommando för att trigga workflowet via API.

- Välj workflowets läge för request body (`Defined` eller `Generic`)
- Ange autentiseringstyp (Anonymous, JWT eller Header Auth)
- Konfigurera cachelagring av svar och hastighetsbegränsning
- Växla SSE-streaming och anpassa startmeddelanden per nod
- Redigera request body
- I Generic-läge använder arbetsytans körningspanel samma råa JSON-body som cURL-dialogen
- Klicka på **Copy cURL** för att kopiera det körklara kommandot

Se [Webhooks](./webhooks.md#run-with-curl-dialog) för fullständiga detaljer om dialogen och [SSE Streaming](./sse-streaming.md) för händelseprotokollet.

## Relaterat

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – Alla kortkommandon för arbetsyta och redigerare
- [Agent Persistent Memory](./agent-persistent-memory.md) – Beteende och API för minnesgrafen
- [Execute Node](../nodes/execute-node.md) – Anropar sub-workflows
- [Expression DSL](./expression-dsl.md) – Referenser och fäst data
- [Workflow Structure](./workflow-structure.md) – Format för noder och kanter
- [Download & Import](./download-import.md) – Exportera och importera workflows som JSON
- [Node Types](./node-types.md) – Alla nodtyper
- [Logs Tab](../tabs/logs-tab.md) – Docker-containerloggar
- [Execution History](./execution-history.md) – Tidigare körningar
- [Templates](../tabs/templates-tab.md) – Spara och återanvänd workflows och noder
- [Contextual Showcase](./contextual-showcase.md) – Kompakt sidguide tillgänglig i redigeraren

- [Canvas-samarbete](./canvas-collaboration.md): Live editing on a shared draft with pointers, following, and voice.
