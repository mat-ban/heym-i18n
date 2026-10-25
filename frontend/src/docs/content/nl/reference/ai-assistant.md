# AI Assistant

De **AI Assistant** is een chatpaneel dat vanuit het Debug-paneel wordt geopend en standaard rechtsonder in de editor verschijnt. Versleep de koptekst om het paneel te verplaatsen en versleep een rand of hoek om de breedte of hoogte aan te passen. Het paneel wordt niet kleiner dan 360×480 pixels. De positie en afmetingen worden in deze browser onthouden. Met **Reset position and size** in de koptekst keert het paneel terug naar de rechteronderhoek. Gebruik natuurlijke taal om workflows te maken of te wijzigen: beschrijf wat u wilt en de AI genereert nodes en edges die op het canvas worden toegepast.

Voor documentatievragen buiten de editor gebruikt u [Chat with Heym](./chat-with-heym.md). Dat oppervlak is geoptimaliseerd voor paginabewuste producthulp in plaats van het genereren van workflows.

## Het paneel openen

1. Open een workflow in de editor
2. Zoek het **Debug panel** onderaan (het gedeelte met uitvoeringsresultaten)
3. Klik op de knop **AI** (Sparkles-pictogram) in de werkbalk van het paneel
4. Het AI Assistant-paneel opent rechtsonder. Versleep de koptekst om het te verplaatsen, of versleep een rand of hoek om de breedte en hoogte aan te passen.

Druk overal in de editor op `Ctrl + I` / `Cmd + I` om het paneel te openen of te sluiten — de sneltoets werkt zelfs wanneer een tekstinvoerveld focus heeft. Zie [Keyboard Shortcuts](./keyboard-shortcuts.md).

Om aan een enkele node te werken, beweegt u de cursor erover op het canvas en klikt u op **AI** erboven. Het paneel opent gefocust op die node. Zie [Eén enkele node wijzigen](#changing-one-node).

## Het paneel sluiten

Klik op de knop **X**, druk op `Ctrl + I` / `Cmd + I`, of schakel de knop **AI** in de werkbalk van het Debug-paneel in of uit. Met de koptekst versleept u het paneel; hiermee sluit u het niet.

## Configuratie

Selecteer vóór het verzenden van berichten:

| Instelling | Beschrijving |
|---------|-------------|
| **Credential** | LLM-referentie (API key) uit [Credentials](../tabs/credentials-tab.md) |
| **Model** | Modelnaam (bijv. `gpt-4o`, `gemini-2.5-flash`) |

Voeg referenties toe in het [Credentials Tab](../tabs/credentials-tab.md). De modellenlijst wordt geladen op basis van de geselecteerde referentie.

## Agent Mode versus Ask Mode

Het paneel heeft twee modi, die u schakelt met de chip **Agent / Ask** in de koptekst van het paneel.

| Modus | Standaard | Gedrag |
|------|---------|-----------|
| **Agent** | ✓ | Bouwt en wijzigt het canvas. De AI genereert een workflow-JSON-blok dat automatisch op het canvas wordt toegepast zodra het antwoord compleet is. |
| **Ask** | | Beantwoordt alleen vragen. Het canvas wordt nooit aangeraakt. Gebruik dit om vragen te stellen over uw workflow, Heym-functies of om advies te krijgen zonder een canvas-update te activeren. |

Schakel op elk moment van modus. Het wijzigen van de modus wist het gesprek niet.

In Agent-modus zorgt het vak **YOLO mode** onder het berichtveld ervoor dat de assistent uitvoert en herstelt wat deze bouwt. Zie [YOLO Mode](#yolo-mode).

## De chat gebruiken

- Typ uw verzoek in het invoerveld (bijv. "Create a workflow that takes user input and sends it to an LLM")
- Druk op **Enter** om te verzenden (Shift+Enter voor een nieuwe regel)
- De AI streamt het antwoord. In **Agent**-modus wordt een workflow in een \`\`\`json-codeblok automatisch geparseerd en op het canvas toegepast. In **Ask**-modus wordt het canvas nooit gewijzigd.
- Gebruik **Clear** om het gesprek te resetten
- Beweeg de muis over een bericht en klik op het kopieerpictogram om de weergegeven tekst te kopiëren, inclusief eventuele workflow-JSON
- Versleep de lijn boven het berichtvak om het vak hoger te maken. Het invoergebied kan tot 60% van het paneel groeien en keert bij het herladen van de pagina terug naar de standaardhoogte

## Automatisch toepassen van workflows

Wanneer het AI-antwoord een geldig workflow-JSON-blok bevat (met `nodes` en optioneel `edges`) in een \`\`\`json-codeblok, doet Heym het volgende:

1. De JSON uit het antwoord wordt geparseerd
2. Het huidige canvas wordt vervangen door de nieuwe nodes en edges
3. De node-indeling wordt opgeruimd
4. De workflow wordt gemarkeerd als niet opgeslagen

Als het parseren mislukt, verschijnt een knop **Retry** om het antwoord opnieuw te genereren.

## Eén enkele node wijzigen

Beweeg over een node op het canvas en klik op **AI** erboven. Het paneel opent in Agent-modus, gefocust op die node, en toont welke node wordt gewijzigd:

| De node heeft... | Het paneel toont |
|---|---|
| Geen resultaat in de huidige run | **Modifying Node:** in een compacte rij met het pictogram en de naam van de node. De assistent bewerkt alleen op basis van de configuratie van de node; voer de node eerst uit als deze de uitvoer moet zien |
| Een resultaat in de huidige run | **Modifying Node: (Has Node Output)** boven de node zelf: pictogram, naam en type, de laatste status en duur, en de fout indien mislukt. De assistent ziet die uitvoer en fout bij het bewerken van de node |

Beweeg over het label om te zien in welke staat het paneel zich bevindt.

In welke staat het paneel zich ook bevindt, de assistent leest ook de documentatiepagina van de node achter het boekpictogram in de header van de node. Hij gebruikt de pagina om de opties van de node te begrijpen en vragen erover te beantwoorden.

Onder de berichten starten drie opties het verzoek:

| Optie | Wat het doet |
|---|---|
| **Change this node as ...** | Vult het berichtvak met *Wijzig deze node in* zodat u de zin kunt afmaken |
| **Fix error in this node ...** | Vult *Herstel de fout in deze node.* De assistent leest de fout van deze node uit de laatste run |
| **Other** | Focust een leeg berichtvak |

Bewerk de tekst en druk op **Send**. De assistent retourneert alleen deze node en Heym werkt deze ter plekke bij: de node behoudt zijn id, type en naam, zodat expressies zoals `$checkLinkedIn.result` in andere nodes blijven werken. Andere nodes, verbindingen en de lay-out veranderen niet, en **Undo** herstelt de vorige configuratie.

Als het verzoek niet binnen de node past, bijvoorbeeld omdat er een ander nodetype of een nieuwe node nodig is, geeft de assistent aan wat er moet veranderen in plaats van te bewerken. Sluit de nodefocus met de **X** op de nodekaart om weer de hele workflow te bewerken. Het sluiten van het paneel wist ook de focus.

[YOLO-modus](#yolo-mode) werkt met een gefocuste node: de assistent wijzigt de node, voert de workflow uit en repareert de node totdat de run slaagt. In **Ask**-modus vertelt de focus de assistent over welke node uw vraag gaat, en het canvas wordt niet gewijzigd.

## YOLO Mode

Met **YOLO mode** kan de assistent testen wat deze bouwt. Vink het vak **YOLO mode** onder het berichtveld aan en verzend uw verzoek. Het vak verschijnt alleen in Agent-modus. Het staat standaard uit en wordt uitgeschakeld wanneer de pagina opnieuw wordt geladen. Beweeg de muis over het infopictogram ernaast voor een korte samenvatting.

Met YOLO mode ingeschakeld stopt de assistent niet nadat een workflow is toegepast:

1. De workflow wordt op het canvas toegepast.
2. Vóór de eerste uitvoering wordt om testinvoer gevraagd. De kaart toont de invoervelden van de workflow, gevuld met waarden die de assistent voorstelt. Bewerk ze en druk op **Run**. Latere uitvoeringen hergebruiken deze waarden. De kaart verschijnt alleen opnieuw wanneer de invoervelden veranderen of de assistent andere testgegevens nodig heeft.
3. De workflow wordt op het canvas uitgevoerd, precies zoals met de knop **Run**: niet-opgeslagen wijzigingen worden eerst opgeslagen, nodes lichten op en de uitvoering verschijnt in het Debug-paneel en de [Execution History](./execution-history.md).
4. Het resultaat wordt gelezen. Als de uitvoering deed wat u vroeg, eindigt de assistent met **Verified** en een korte samenvatting. Zo niet, dan herstelt deze de workflow en voert deze opnieuw uit.

Er worden maximaal **5 uitvoeringen** per bericht gedaan. Druk op elk moment op **Stop** om de lus te beëindigen en een lopende uitvoering te stoppen.

Elk antwoord toont de stappen zodra ze plaatsvinden:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, met een rij `Executing <node>` voor elke node;
- het uiteindelijke oordeel.

Na elke uitvoering toont een korte regel zoals *Attempt 1 result sent · error in 1.2s* dat het resultaat naar de assistent is teruggestuurd.
### Uw andere workflows uitvoeren

In YOLO-modus kan de assistent ook uw andere workflows uitvoeren wanneer deze hun resultaat nodig heeft. Zo kan de assistent bijvoorbeeld controleren wat een workflow retourneert voordat deze vanuit een [Execute](../nodes/execute-node.md)-node wordt aangeroepen. Deze uitvoeringen verschijnen als stappen `Running workflow "<name>"...` en worden vastgelegd in de Uitvoeringsgeschiedenis met de triggerbron `ai_assistant`. De workflow die wordt bewerkt, wordt altijd op het canvas getest.

### Wanneer de uitvoering vroegtijdig stopt

| Situatie | Wat er gebeurt |
|---|---|
| De assistent heeft een beslissing, informatie, een referentie of een gegevenstabel nodig | Deze vraagt dit met de gebruikelijke vraagkaart. Beantwoorden zet de lus voort. |
| De uitvoering wacht op een [menselijke beoordeling](./human-in-the-loop.md) | De lus stopt. Keur de beoordeling goed en stuur vervolgens een bericht. |
| De workflow wacht op een bestandsupload | De lus stopt. YOLO-modus kan geen door uploads getriggerde uitvoeringen testen. |
| Een nieuwere versie van de workflow is elders opgeslagen | De lus stopt. Los het opslagconflict op en stuur vervolgens een bericht. |

> **Uitvoeringen zijn echt.** E-mails, berichten en API-aanroepen in de workflow worden bij elke poging daadwerkelijk verzonden, en DataTable-nodes schrijven echte rijen. Bij elke uitvoering wordt de workflow opgeslagen, zodat eerdere versies in de [Geschiedenis](./edit-history.md) blijven staan.

## Spraakinvoer

In ondersteunde browsers schakelt een knop **Voice** spraak-naar-tekst in. Klik om de opname te starten, klik nogmaals om te stoppen. De getranscribeerde tekst wordt naar de AI gestuurd voor grammaticacorrectie voordat u deze verzendt.

## Agent-node versus AI-assistent

| | Agent-node | AI-assistent |
|---|------------|---------------|
| **Doel** | LLM-node binnen een workflow; wordt uitgevoerd tijdens de uitvoering | Chat-UI om workflows met natuurlijke taal te bouwen |
| **Locatie** | Canvas-node | Debug-paneel → zwevend paneel |
| **Wanneer** | Tijdens de uitvoering | Tijdens het bewerken |

Zie [Agent-node](../nodes/agent-node.md) voor de workflow-node die LLM-aanroepen met tools en MCP uitvoert.

## Hoe het werkt (AI Builder DSL)

De AI-assistent wordt aangedreven door een **workflow-DSL** (domeinspecifieke taal) die nodes, edges en expressies beschrijft. Wanneer u een bericht verzendt:

1. Uw bericht plus [Gebruikersregels](./user-settings.md) en de huidige workflow (indien aanwezig) worden naar de backend verzonden.
2. De backend bouwt een **systeemprompt** op die het volgende bevat:
   - De volledige workflow-DSL (node-typen, expressiesyntaxis, regels, voorbeelden)
   - Uw Gebruikersregels toegevoegd als "User Custom Rules"
   - De huidige workflow-JSON wanneer u een bestaande workflow bewerkt
   - De lijst met beschikbare workflows als u de Execute-node gebruikt
   - De namen, typen en id's van uw eigen referenties (nooit hun waarden)
   - De namen, id's, beschrijvingen en kolommen van de gegevenstabellen die u kunt gebruiken (nooit hun rijen)
3. Het model retourneert één workflow-JSON-blok (met `nodes` en `edges`). De frontend parseert dit en past het toe op het canvas.

### Referenties

Wanneer een workflow een referentie nodig heeft, vraagt de assistent dit voordat deze wordt gebouwd. Als u referenties van een passend type heeft, worden deze samen met **Create a new credential** weergegeven; als u er geen heeft, wordt gevraagd of u er een wilt aanmaken. Bij elke vraag kunt u ook doorgaan zonder referentie.

Als u ervoor kiest er een aan te maken, wordt het referentieformulier in het paneel geopend, vooraf ingesteld op het juiste type en een voorgestelde naam. De waarden gaan rechtstreeks naar Heym; de assistent leert alleen de naam en het type. OAuth-referenties (Google Sheets, Google Drive, BigQuery, Linear, Notion) worden via een pop-up verbonden, en er verschijnt een link naar de autorisatiepagina voor het geval de pop-up wordt geblokkeerd. Zodra de referentie is opgeslagen, toont de kaart de naam ervan en wordt de knop voor aanmaken uitgeschakeld; druk op **Submit answers** en de assistent plaatst de nieuwe referentie op de node.

U kunt ook afzonderlijk om een referentie vragen ("create a GitHub credential") of vragen om een referentie die u bezit te wijzigen ("update my sheet credential", "reconnect my Google Sheets"). De assistent antwoordt met dezelfde kaart: bij aanmaken wordt een leeg formulier geopend, bij bijwerken wordt het formulier voor die referentie geopend met de secrets gemaskeerd.

De assistent geeft de voorkeur aan een speciale node. Wanneer geen node een bewerking dekt, zoals het toevoegen van een tab aan een Google Sheet, gebruikt deze een HTTP-verzoek en schrijft de kopregel voor de gekozen referentie. Zie [HTTP › Authenticating with Credentials](../nodes/http-node.md#authenticating-with-credentials).

Verduidelijkingsvragen die de workflow kan overslaan, hebben **Optional** in hun invoer en kunnen worden overgeslagen.

De DSL dwingt camelCase-labels, uniforme expressieregels en node-specifieke velden af. Als een veldwaarde één `$expr` is, behoudt de backend het native type; als de waarde proza met `$refs` vermengt, is het resultaat een string. De regel van één `$` blijft van toepassing: geen `$` binnen haakjes. [Instellingen](./user-settings.md) Gebruikersregels worden in deze systeemprompt geïnjecteerd, zodat uw voorkeuren van toepassing zijn op elke door AI gegenereerde workflow.

Als de huidige workflow Agent-skills bevat, neemt de AI-assistent alleen de `SKILL.md` van elke skill op in die workflowcontext. Bijgevoegde `.py`-bestanden en binaire skill-assets worden vóór het verzoek verwijderd, zodat de builder binnen de contextlimieten van het model blijft, zelfs wanneer skills grote implementaties bevatten.
### Gegevenstabellen

Wanneer een workflow records opslaat, bewaart of opzoekt en u geen andere opslag hebt benoemd, gebruikt de assistent een [DataTable](../nodes/datatable-node.md)-node. Als u een van uw tabellen benoemt en deze de kolommen bevat die de workflow nodig heeft, gebruikt de assistent deze. Anders vraagt de assistent welke tabel gebruikt moet worden. De kaart toont de tabellen die passen, elk met de beschrijving en kolomtypen, plus **Een nieuwe tabel maken** met een voorgestelde naam en kolommen. Tabellen die met u zijn gedeeld worden ook aangeboden; een tabel die u alleen kunt lezen wordt alleen ter lezing aangeboden.

Kies de nieuwe tabel en druk op **Antwoorden indienen**: de kaart maakt de tabel aan, en de assistent plaatst het id op de node en gebruikt de exacte kolomnamen. U kunt ook afzonderlijk om een tabel vragen, bijvoorbeeld "maak een tabel voor mijn leads".

De assistent ziet tabelnamen, beschrijvingen en kolommen, nooit rijen. De assistent wijzigt nooit de kolommen van een bestaande tabel: als een tabel een kolom mist die de workflow nodig heeft, benoemt de assistent de kolom en biedt in plaats daarvan een nieuwe tabel aan. Voeg kolommen toe in het [DataTable-tabblad](../tabs/datatable-tab.md).

## Gerelateerd

- [Waarom Heym](../getting-started/why-heym.md) – Natuurlijke-taalontwikkeling als de eerste fase van de agent-levenscyclus
- [Snelstart](../getting-started/quick-start.md) – Bouw uw eerste workflow
- [Instellingen](./user-settings.md) – Gebruikersregels die in de systeemprompt van de AI Assistant worden geïnjecteerd
- [Chat met Heym](./chat-with-heym.md) – Paginabewuste assistent binnen het documentatiegebied
- [Kernconcepten](../getting-started/core-concepts.md) – Workflows, nodes en uitvoeringsstroom
- [Agent-node](../nodes/agent-node.md) – LLM-node met tools en MCP
- [Referentietabblad](../tabs/credentials-tab.md) – Voeg API-sleutels toe voor de AI Assistant
- [Workflowstructuur](./workflow-structure.md) – JSON-formaat voor workflows
