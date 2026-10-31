# DataTable

Fliken **DataTable** gör det möjligt att skapa och hantera strukturerade datatabeller direkt i Heym. Tabeller kan användas i Workflows via [DataTable-noden](../nodes/datatable-node.md) för programmatiska CRUD-operationer.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Watch DataTable demo</a></p>

## Skapa en tabell

1. Navigera till fliken DataTable från instrumentpanelen
2. Klicka på **Create DataTable**
3. Ange ett namn och en valfri beskrivning
4. Lägg till kolumner med kolumnredigeraren

## Kolumner

Varje kolumn har:

| Egenskap | Beskrivning |
|----------|-------------|
| Name | Kolumnens visningsnamn |
| Type | `string`, `number`, `boolean`, `date` eller `json` |
| Required | Huruvida nya rader måste innehålla denna kolumn |
| Unique | Huruvida värden måste vara unika över alla rader |
| Default Value | Fylls i automatiskt när en rad utelämnar denna kolumn |

Kolumner kan läggas till, redigeras eller tas bort från sidhuvudet i tabellens detaljvy.

## Generera kolumner med AI

I stället för att lägga till kolumner manuellt går det att beskriva tabellen i klartext (eller klistra in exempel-JSON) och låta en LLM föreslå schemat. Båda ingångarna öppnar samma dialog:

- **Generate with AI** (sidhuvudet i DataTable-listan) — skapar en helt ny tabell utifrån beskrivningen.
- **AI columns** (tabellens detaljvy, intill kolumnkontrollerna) — föreslår *nya* kolumner att lägga till i den öppna tabellen.

### Så fungerar det

1. Välj en **LLM-credential** och **modell** (standardvärdet är den första LLM-credentialen och dess senaste modell).
2. Ange en beskrivning — till exempel *"En tabell med böcker med titel, författare, sidantal och huruvida jag har läst den"* — eller klistra in ett JSON-exempel/schema.
3. Klicka på **Generate**. Modellen returnerar ett föreslaget schema.
4. Granska de genererade kolumnerna i ett redigerbart formulär: ändra **name**, **type**, **default**, **unique** och **notEmpty** (obligatorisk) för varje kolumn, ta bort oönskade kolumner eller lägg till en kolumn manuellt med **Add column**. För en ny tabell går det även att redigera det AI-föreslagna **name** och **description**.
5. Klicka på **Create Table** (ny tabell) eller **Add Columns** (befintlig tabell) för att spara. Tryck på **Esc** för att stänga dialogen när som helst.

### Endast tillägg för befintliga tabeller

Vid generering av kolumner för en befintlig tabell ser modellen de aktuella kolumnerna som kontext och föreslår **endast nya** kolumner. Befintliga kolumner och deras data ändras eller tas aldrig bort — genererade kolumner läggs till. Dubbletter av namn (skiftlägesokänsligt) tas bort automatiskt.

> En LLM-credential (OpenAI, Google eller Custom) krävs. Om ingen finns tillgänglig måste en läggas till i Settings först.

## Hantera rader

- **Lägg till rad**: Klicka på knappen för att lägga till en ny rad
- **Inline-redigering**: Dubbelklicka på en cell för att redigera dess värde. Tryck på Enter eller klicka utanför för att spara, Escape för att avbryta
- **Ta bort rad**: Använd radens åtgärdsmeny för att ta bort en rad
- **Paginering**: Rader visas med 25 per sida med sidnavigering

## CSV-import/export

### Import
1. Klicka på **Import CSV** i tabellens detaljvy
2. Välj en CSV-fil att ladda upp
3. Förhandsgranska de första 5 raderna och kolumnmappningen
4. Gröna kolumner matchas mot befintliga tabellkolumner; gula är omatchade
5. Klicka på Import för att massinfoga rader

### Export
Klicka på **Export CSV** för att ladda ner alla rader som en CSV-fil.

## Delning

Dela tabeller med andra användare eller team:

1. Öppna delningsdialogen från tabellens detaljvy
2. Lägg till användare via e-post med **read**- eller **write**-behörighet
3. Lägg till team med **read**- eller **write**-behörighet
4. Skrivskyddade användare kan visa data; skrivbehöriga användare kan ändra rader och kolumner. Att byta namn på tabellen, ändra dess beskrivning och hantera delningar är fortfarande endast tillgängligt för ägaren.

## Skapa tabeller från AI-assistenten

[AI-assistenten](../reference/ai-assistant.md#data-tables) på canvasen, [Chat](./chat-tab.md) och verktyget `heym_chat` på [fliken MCP](./mcp-tab.md) kan välja en av dina tabeller för ett workflow de bygger, eller skapa en ny. De föreslår ett namn och kolumner och skapar tabellen när du skickar frågekortet. Canvas-assistenten konfigurerar workflow-noder från tabellens metadata. Chat och `heym_chat` kan också granska rader, lägga till eller ta bort kolumner och direkt infoga, uppdatera eller ta bort rader. Ge dem ett tabellnamn eller länken till den här fliken. Skrivning kräver ägarskap eller direkt/team **skrivbehörighet**. Att lägga till kolumner behåller befintliga data; att ta bort kolumner raderar deras värden från varje rad. Borttagning av kolumner och rensning av alla rader kräver bekräftelse, precis som på den här fliken.

## Användning i Workflows

[DataTable-noden](../nodes/datatable-node.md) kopplar tabeller till Workflows. Operationer inkluderar find, getAll, getById, insert, update, remove och upsert. Inga credentials krävs.

## LLM Cost Table (systemtabell)

En fäst sektion **System tables** visas ovanför de användarskapade tabellerna med en enda post: **LLM Cost Table**. Detta är en användarspecifik, redigerbar vy med fast schema över prissättning per modell som används av kostnadsdiagrammen i [Traces](./traces-tab.md).

### Varifrån data kommer

Heym har en global tabell med prissättning per modell som initieras från Helicones publika prissättnings-endpoint (`https://www.helicone.ai/api/llm-costs`). Synkroniseringen körs i bakgrunden första gången tabellen eller Traces öppnas och begränsas till en hämtning per 24 timmar. Tryck på **Refresh** för att tvinga fram en omedelbar omsynkronisering. Poster som Helicone tar bort från den uppströms listan tas inte bort lokalt, så historiska kostnadsuppslagningar förblir stabila.

### Schema (skrivskyddade kolumner)

| Kolumn | Betydelse |
|---|---|
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informativ, används av Helicone) |
| Model | Modellidentifierare som matchas mot `trace.model` |
| Op | Matchningsoperator: `equals`, `startsWith` eller `includes` |
| Input $/1M | USD per 1 miljon prompt-tokens |
| Output $/1M | USD per 1 miljon completion-tokens |
| Source | `helicone`, `seed` eller `user` |
### Anpassa prissättning

- **Redigera en rad** för att åsidosätta dess priser. Åsidosättningen är per användare och markeras med en `Customized`-badge; framtida Helicone-synkningar lämnar den orörd.
- **Återställ till standard** tar bort åsidosättningen och återställer det globala värdet för den raden.
- **Lägg till anpassad modell** öppnar en dialog för att skapa en användarspecifik rad (till exempel en privat finjusterad modell som Helicone inte listar). Anpassade rader markeras med `User added` och tas bort helt när de raderas.

### Matchning mot traces

När Traces-instrumentpanelen beräknar kostnad matchas varje `trace.model` mot:

1. Åsidosättningar (exakt matchning på modellnamn) först
2. Annars den globala tabellen — `equals` exakt matchning har prioritet över `startsWith`/`includes`; vid lika villkor inom samma operator avgörs det av längsta matchande modellprefix/substräng

Om ingen rad matchar listas modellen under meddelandet **Unpriced models** på Traces-sidan; dess kostnadsbidrag är noll tills en anpassad rad läggs till eller en befintlig åsidosätts.

## Relaterat

- [DataTable Node](../nodes/datatable-node.md) - Referens för Workflow-nod
- [Traces Tab](./traces-tab.md) - Använder LLM Cost Table för kostnadsdonut och KPI-kort
- [Grist Node](../nodes/grist-node.md) - Alternativ för extern kalkylbladslösning
- [Variables Tab](./global-variables-tab.md) - Alternativ för nyckel-värde-lagring