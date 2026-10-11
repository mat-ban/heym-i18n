# Dialoogvenster Expressie-evaluatie

Het Dialoogvenster Expressie-evaluatie is de uitgebreide editor voor velden die expressies ondersteunen. Het opent via de uitvouwknop naast een expressie-invoerveld en biedt u een groter werkgebied, automatische aanvulling, live backend-preview en het doorbladeren van uitvoer op één plek.

## Het dialoogvenster openen

- Klik op de uitvouwknop naast een expressieveld in het paneel Eigenschappen.
- Velden met meerdere regels tonen de knop in het invoerveld.
- Velden met één regel tonen de knop rechts van het invoerveld.

## Indeling van het dialoogvenster

- Het dialoogvenster opent als een gecentreerde modal van ongeveer **80vw × 80vh**.
- De koptekst toont **Evaluate — {veldnaam}** wanneer het veldlabel bekend is.
- De editor behoudt automatische aanvulling, navigatie tussen velden en de gebruikelijke acties **Apply** / **Cancel**.
- De preview wordt automatisch vernieuwd ongeveer **300 ms** nadat u stopt met typen.
- Druk op `Ctrl` / `Cmd` + `Enter` om de huidige tekst toe te passen op het veld en het dialoogvenster te sluiten (hetzelfde als **Apply**).

## Sectie Uitvoer

Het gebied Uitvoer wordt automatisch vernieuwd nadat u stopt met typen in de editor.

### Evaluatie

| Expressietype | Resultaat |
|---|---|
| Enkele `$expr` (het hele veld) | De oorspronkelijke waarde blijft behouden |
| Enkele kale puntpad (het hele veld, geen `$`, geen ingebedde nieuwe regel) | Hetzelfde als `$` + dat pad (backend normaliseert voor evaluatie) |
| Tekst met ingebedde `$refs` | Het eindresultaat is altijd een string |
| Letterlijke tekst (geen `$`, geen enkel puntpad) | Wordt ongewijzigd teruggegeven |

**Voorbeelden**

| Invoer | Resultaat |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (hetzelfde als `$input.items` wanneer de hele waarde dit pad is) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

De evaluatiecontext wordt in deze volgorde opgebouwd:

- **Vastgezette data** op upstream-nodes
- **Uitvoer van de laatste uitvoering** vanaf het canvas
- `null` wanneer er geen upstream-data beschikbaar is

Als de huidige node upstream-afhankelijkheden heeft, maar geen daarvan vastgezette data of een recent uitvoeringsresultaat heeft, voert het dialoogvenster eerst een testuitvoering uit om context op te bouwen en evalueert vervolgens de huidige tekst.

### Padkiezer voor uitvoer

Wanneer het backend-resultaat een object of array is, kan het gebied Uitvoer een interactieve padkiezer tonen in plaats van ruwe JSON.

- Dubbelklik op een rij om dat pad toe te voegen aan de huidige `$node.path`-referentie.
- Klik één keer op uitvouwbare rijen om vertakkingen te openen of te sluiten.
- Gebruik het ingebouwde zoekvak om te zoeken in sleutels, waarden en padstrings.

## Automatische aanvulling

- Typ `$` om suggesties te openen voor upstream-nodes, ingebouwde functies en methoden.
- Druk op `Tab` of `Enter` om de geselecteerde suggestie in te voegen.
- Gebruik `↑` / `↓` om door de suggestielijst te navigeren.

### Voorbeeldantwoorden

Wanneer u een `$…`-referentie vervolgt met een punt, toont elke suggestierij het antwoord dat die suggestie zou opleveren, vetgedrukt aan de rechterkant van de rij.

- Door `$set.listItems.first().toString().u` te typen, worden `upper`, `urlEncode`, `urlDecode` en `unescape` weergegeven, elk met hun geëvalueerde resultaat — zodat u op basis van uitkomst kunt kiezen in plaats van op basis van naam.
- Door `$node.text.toJson()` te typen, wordt een JSON-string omgezet in een object of array. Na `.toJson()` kan automatische aanvulling de geparseerde sleutels aanbieden (bijvoorbeeld `repoUrl`) wanneer uitvoer van de laatste uitvoering of vastgezette uitvoer beschikbaar is.
- Resultaten worden op de backend geëvalueerd tegen dezelfde vastgezette data en uitvoer van de laatste uitvoering die de dialoogvenster-preview gebruikt, zodat ze overeenkomen met wat het veld zal opleveren.
- Alleen suggesties die op zichzelf staan worden geëvalueerd: methoden zonder argumenten (`upper()`, `first()`, `keys()`, `toJson()`) en gewone eigenschappen (`length`, `year`). Suggesties die eerst argumenten nodig hebben — `map`, `filter`, `sort`, `replace` — blijven leeg.
- Een rij blijft leeg wanneer de kandidaat geen antwoord oplevert: een fout, een `null`, of een methode die niet van toepassing is op die waarde.
- Antwoorden worden ingekort tot één regel. Beweeg de muis over een ingekort antwoord om meer ervan te zien.

## Bouwen met AI

De knop **Build with AI** verschijnt in de rechterbovenhoek van het evaluatiedialoogvenster wanneer een workflow is geladen. Deze opent een genest modal waarin u de gewenste expressie in platte tekst kunt beschrijven en een LLM deze voor u kan genereren.

### Hoe het werkt

1. Klik op **Build with AI** in de werkbalk van het evaluatiedialoogvenster.
2. Selecteer een LLM-referentie en -model uit de dropdowns.
3. Typ een beschrijving in platte tekst van wat u wilt — bijvoorbeeld *"Get the customer name from the API response"*.
4. Klik op **Generate**. Het modal roept de backend aan, die de [Expression DSL](./expression-dsl.md)-systeemprompt plus de uitvoer van uw laatste workflow-uitvoering als context gebruikt, en een enkele expressiestring retourneert.
5. De gegenereerde expressie wordt onmiddellijk geëvalueerd tegen dezelfde canvas-data, zodat u het resultaat kunt zien voordat u het toepast.
6. Klik op **Apply** om de inhoud van de editor te vervangen door de gegenereerde expressie, of op **Regenerate** om het opnieuw te proberen.

### Gebruikte context

De generator ontvangt de node-uitvoer van de laatste testuitvoering op het canvas. Als de workflow nog niet is uitgevoerd, genereert de LLM een zo goed mogelijke expressie op basis van node-labels en DSL-conventies.

### Vereisten

- Een LLM-referentie (OpenAI, Google of Custom) moet zijn geconfigureerd in het tabblad [Referenties](./credentials.md).
- De workflow moet geopend zijn in de editor.

## Sneltoetsen

| Sneltoets | Actie |
|---|---|
| Typonderbreking (~300 ms) | Backend-preview vernieuwen |
| `Ctrl` / `Cmd` + `Enter` | Toepassen en het dialoogvenster sluiten |
| `Escape` | Eerst automatische aanvulling sluiten, anders het dialoogvenster sluiten |
## Geneste `$` in methode-argumenten

Voor dialoog- en backend-evaluatie kunt u een andere referentie met een geneste `$` doorgeven in aanroepen zoals `.get($other.field)` wanneer u een dynamische sleutel nodig hebt. U kunt ook een kaal pad binnen `.get(...)` gebruiken (bijvoorbeeld `other.field`); de backend lost dit op dezelfde manier op. Opgeslagen workflow-velden moeten nog steeds de regels van de [Expression DSL](./expression-dsl.md) volgen; de evaluate API accepteert tevens een volledig regelkaal puntpad voor het gemak (zie de tabel hierboven).

## Navigatie

De mapping-editors voor Set en Execute kunnen **Prev** / **Next**-knoppen tonen, zodat u tussen velden kunt navigeren zonder het dialoogvenster te sluiten.

## Gerelateerd

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credentials](./credentials.md) — vereist voor de functie Build with AI
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
