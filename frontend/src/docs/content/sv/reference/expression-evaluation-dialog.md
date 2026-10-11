# Dialogrutan för utvärdering av uttryck

Dialogrutan för utvärdering av uttryck är den expanderade redigeraren för uttryckskapabla fält. Den öppnas från expanderingsknappen bredvid ett uttrycksfält och erbjuder en större arbetsyta, autokomplettering, förhandsvisning i realtid från backend samt bläddring av utdata på ett och samma ställe.

## Öppna dialogrutan

- Klicka på expanderingsknappen bredvid ett uttrycksfält i panelen Egenskaper.
- Fält med flera rader visar knappen inuti inmatningsfältet.
- Fält med en rad visar knappen till höger om inmatningsfältet.

## Dialogrutans layout

- Dialogrutan öppnas som en centrerad modal på ungefär **80vw × 80vh**.
- Rubriken visar **Evaluate — {fältnamn}** när fältets etikett är känd.
- Redigeraren behåller autokomplettering, navigering mellan fält samt de vanliga åtgärderna **Apply** / **Cancel**.
- Förhandsvisningen uppdateras automatiskt cirka **300 ms** efter att inmatningen upphört.
- Tryck `Ctrl` / `Cmd` + `Enter` för att tillämpa den aktuella texten i fältet och stänga dialogrutan (samma som **Apply**).

## Avsnittet Utdata

Området Utdata uppdateras automatiskt efter att inmatningen i redigeraren pausats.

### Utvärdering

| Uttryckstyp | Resultat |
|---|---|
| Enstaka `$expr` (hela fältet) | Det ursprungliga värdet bevaras |
| Enstaka bart punktpath (hela fältet, inget `$`, ingen inbäddad radbrytning) | Samma som `$` + den sökvägen (backend normaliserar för utvärdering) |
| Text med inbäddade `$refs` | Slutresultatet är alltid en sträng |
| Literal text (inget `$`, inte en enstaka punktpath) | Returneras oförändrad |

**Exempel**

| Indata | Resultat |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (samma som `$input.items` när hela värdet är denna sökväg) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Utvärderingskontexten byggs upp i denna ordning:

- **Fästa data** på uppströmsnoder
- **Senaste körningens utdata** från canvas
- `null` när ingen uppströmsdata finns tillgänglig

Om den aktuella noden har uppströmsberoenden men ingen av dem har fästa data eller ett nyligen genomfört körningsresultat, utför dialogrutan först en testkörning för att bygga kontext och utvärderar därefter den aktuella texten.

### Väljare för utdatasökväg

När backend-resultatet är ett objekt eller en array kan området Utdata visa en interaktiv sökvägsväljare i stället för rå JSON.

- Dubbelklicka på en rad för att lägga till sökvägen i den aktuella `$node.path`-referensen.
- Enkelklicka på expanderbara rader för att öppna eller stänga grenar.
- Använd den inbyggda sökrutan för att söka bland nycklar, värden och sökvägssträngar.

## Autokomplettering

- Skriv `$` för att öppna förslag på uppströmsnoder, inbyggda funktioner och metoder.
- Tryck `Tab` eller `Enter` för att infoga det valda förslaget.
- Använd `↑` / `↓` för att navigera i förslagslistan.

### Exempelsvar

När en `$…`-referens fortsätts med en punkt visar varje förslagsrad det svar som förslaget skulle producera, i fetstil till höger på raden.

- Genom att skriva `$set.listItems.first().toString().u` listas `upper`, `urlEncode`, `urlDecode` och `unescape`, var och en med sitt utvärderade resultat — så att valet kan göras utifrån utfall i stället för namn.
- Genom att skriva `$node.text.toJson()` tolkas en JSON-sträng till ett objekt eller en array. Efter `.toJson()` kan autokompletteringen erbjuda de tolkade nycklarna (till exempel `repoUrl`) när utdata från senaste körning eller fästa data finns tillgängliga.
- Resultaten utvärderas i backend mot samma fästa data och utdata från senaste körning som dialogrutans förhandsvisning använder, så de matchar vad fältet kommer att producera.
- Endast förslag som står för sig själva utvärderas: metoder utan argument (`upper()`, `first()`, `keys()`, `toJson()`) och enkla egenskaper (`length`, `year`). Förslag som först kräver argument — `map`, `filter`, `sort`, `replace` — lämnas tomma.
- En rad förblir tom när kandidaten inte producerar något svar: ett fel, ett `null` eller en metod som inte är tillämplig på det värdet.
- Svar kortas ned till en rad. Håll muspekaren över ett kortat svar för att se mer av det.

## Bygg med AI

Knappen **Build with AI** visas i det övre högra hörnet av utvärderingsdialogrutan när ett workflow är laddat. Den öppnar en nästlad modal där en beskrivning av det önskade uttrycket kan anges i klartext och en LLM genererar det.

### Så fungerar det

1. Klicka på **Build with AI** i utvärderingsdialogrutans verktygsfält.
2. Välj en LLM-autentiseringsuppgift och modell i listrutorna.
3. Skriv en klartextbeskrivning av det som önskas — till exempel *"Get the customer name from the API response"*.
4. Klicka på **Generate**. Modalen anropar backend, som använder systemprompten för [Expression DSL](./expression-dsl.md) tillsammans med utdata från senaste workflow-körning som kontext och returnerar en enskild uttryckssträng.
5. Det genererade uttrycket utvärderas omedelbart mot samma canvas-data så att resultatet kan ses innan det tillämpas.
6. Klicka på **Apply** för att ersätta redigerarens innehåll med det genererade uttrycket, eller på **Regenerate** för att försöka igen.

### Kontext som används

Generatorn tar emot nodutdata från den senaste testkörningen på canvas. Om workflowet ännu inte har körts genererar LLM ett bästa-möjliga uttryck baserat på nodetiketter och DSL-konventioner.

### Krav

- En LLM-autentiseringsuppgift (OpenAI, Google eller Custom) måste vara konfigurerad på fliken [Autentiseringsuppgifter](./credentials.md).
- Workflowet måste vara öppet i redigeraren.

## Kortkommandon

| Kortkommando | Åtgärd |
|---|---|
| Inmatningspaus (~300 ms) | Uppdatera förhandsvisning från backend |
| `Ctrl` / `Cmd` + `Enter` | Tillämpa och stäng dialogrutan |
| `Escape` | Stäng autokomplettering först, stäng annars dialogrutan |
## Kapslade `$` i metodargument

För dialog- och backend-utvärdering går det att skicka en annan referens med ett kapslat `$` inuti anrop som `.get($other.field)` när en dynamisk nyckel behövs. Det går även att använda en bar sökväg inuti `.get(...)` (till exempel `other.field`); backend löser upp den på samma sätt. Sparade workflow-fält bör fortfarande följa reglerna i [Expression DSL](./expression-dsl.md); evaluate-API:et accepterar även en bar punktseparerad sökväg på hel rad för enkelhets skull (se tabellen ovan).

## Navigering

Mappningsredigerarna för Set och Execute kan visa knapparna **Prev** / **Next** så att det går att förflytta sig mellan fält utan att stänga dialogen.

## Relaterat

- [Expression DSL](./expression-dsl.md)
- [Nodtyper](./node-types.md)
- [Autentiseringsuppgifter](./credentials.md) — krävs för funktionen Build with AI
- [LLM-nod](../nodes/llm-node.md)
- [Utdatanod](../nodes/output-node.md)
- [Villkorsnod](../nodes/condition-node.md)
