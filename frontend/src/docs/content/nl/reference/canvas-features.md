# Canvas-functies

De workflow-editor biedt verschillende functies voor het debuggen, testen en organiseren van knooppunten: **Uitvoeren tot knooppunt**, **AI op een node**, **Data Pin**, **Uitvoeringslogboeken**, **In-/Uitschakelen** en **Extraheren naar sub-workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Editor-demo bekijken</a></p>

## Uitvoeren tot knooppunt

Beweeg de muisaanwijzer over een knooppunt (behalve een sticky note) en klik op **Uitvoeren** eronder. Heym voert dat knooppunt en de stroomopwaartse afhankelijkheden uit, terwijl stroomafwaartse knooppunten en niet-gerelateerde vertakkingen ongewijzigd blijven. Dit maakt gebruik van de canvas-testmodus, inclusief vastgezette uitvoer en de normale vertakkingsvoorwaarden van de workflow.

Als het geselecteerde pad invoervelden bevat, wordt het rechterpaneel **Uitvoeren** geopend en wordt het eerste veld gefocust. Voer de waarden in en klik op **Uitvoeren tot _knooppuntlabel_** of druk op **Ctrl+Enter** (Cmd+Enter op macOS). De generieke body-modus focust op de JSON-body-editor. Paden zonder invoervelden worden onmiddellijk uitgevoerd zonder het paneel te openen. Vastgezette Input-knooppunten hergebruiken hun vastgezette uitvoer zonder om invoer te vragen.

Het paneel behoudt het geselecteerde doel voor volgende uitvoeringen. Kies **Volledige workflow uitvoeren** om het doel te wissen. Uitvoerknoppen zijn uitgeschakeld terwijl een uitvoering actief is. Een doel binnen een lus stopt de uitvoering wanneer dat knooppunt voor het eerst wordt bereikt; het selecteren van een knooppunt na de lus voert de volledige stroomopwaartse lus uit.

## AI op een node

Beweeg over een willekeurige node behalve een notitie en klik op **AI** erboven. De [AI Assistant](./ai-assistant.md) opent op die node en biedt **Change this node as ...**, **Fix error in this node ...** en **Other**. In Agent-modus wijzigt de assistent alleen die node; andere nodes, verbindingen en lay-out blijven ongewijzigd. Zie [AI Assistant › Eén enkele node wijzigen](./ai-assistant.md#changing-one-node).

De knop is verborgen op workflows die u alleen kunt bekijken.

## Data Pin

Met Data Pin kunt u de uitvoer van een knooppunt van de laatste uitvoering vastzetten, zodat u stroomafwaartse knooppunten kunt testen zonder het vastgezette knooppunt opnieuw uit te voeren.

### Waar te vinden

- **Eigenschappenpaneel** – Selecteer een knooppunt en scrol naar de sectie **Vastgezette data**
- **Knooppuntbadge** – Een pin-pictogram verschijnt op het knooppunt wanneer data is vastgezet

### Acties

| Actie | Beschrijving |
|--------|-------------|
| **Vastzetten** | Zet de laatste uitvoeringsuitvoer van het knooppunt vast (beschikbaar na een uitvoering) |
| **Wissen** | Verwijdert vastgezette data |
| **Bewerken** | Bewerk de vastgezette JSON rechtstreeks; klik op Opslaan om toe te passen |

### Gedrag in testmodus

Bij het uitvoeren van een workflow in testmodus slaan knooppunten met `pinnedData` de uitvoering over en gebruiken de vastgezette uitvoer. Gebruik dit om:

- Stroomafwaartse logica te testen zonder externe API's aan te roepen
- Expressies te debuggen die verwijzen naar de uitvoer van het knooppunt
- Prompts of voorwaarden te itereren met vaste voorbeelddata

Expressie-aanvulling in de editor gebruikt vastgezette data wanneer beschikbaar om velden voor te stellen.

## Uitvoeringslogboeken

Het **Debug-paneel** (onderste lade) toont realtime uitvoeringslogboeken tijdens workflow-uitvoeringen. U kunt ook een actieve productie-uitvoering openen vanuit het Geschiedenis-dialoogvenster of een Board-kaart. De editor koppelt zich aan de SSE-stream van die uitvoering, herstelt voltooide knooppuntresultaten en blijft knooppuntanimaties en logboeken tonen wanneer nieuwe knooppunten starten en voltooien.

### Wat het toont

- **Knooppuntresultaten** – Status per knooppunt (`success`, `error`, `skipped`, `running`), uitvoeringstijd en uitvoer
- **Einduitvoer** – Geaggregeerde uitvoer van [Output](../nodes/output-node.md)-knooppunten
- **Agent-voortgang** – Voor [Agent](../nodes/agent-node.md)-knooppunten, stapsgewijze tool-aanroepen en redenering

### Acties

- **Kopiëren als JSON** – Kopieer het volledige uitvoeringslogboek naar het klembord
- **Openen in JSON-editor** – Opent het logboek in JSON Hero of JSON Editor Online voor inspectie
- **Gegenereerde bestanden downloaden** – Als een skill downloadbare bestanden heeft geproduceerd (`_generated_files`), verschijnt een Download-knop. Enkel bestand wordt direct gedownload; meerdere bestanden openen een selectiepopup.

### Onderscheid met tabblad Logboeken

Het Debug-paneel toont **workflow-uitvoerings**logboeken (knooppuntresultaten, uitvoer). Het [tabblad Logboeken](../tabs/logs-tab.md) toont **Docker-container**logboeken (backend, frontend, database). <!-- pragma: allowlist secret -->

## In-/Uitschakelen

U kunt knooppunten uitschakelen zodat ze tijdens de uitvoering worden overgeslagen. Uitgeschakelde knooppunten tonen een "off"-badge en worden gedimd weergegeven.

### Hoe te wisselen

| Methode | Beschrijving |
|--------|-------------|
| **Eigenschappenpaneel** | Selecteer knooppunt → Power-pictogram (rechtsboven) |
| **Contextmenu** | Rechtsklik op knooppunt(en) → Uitschakelen of Inschakelen |
| **Toetsenbord** | Selecteer knooppunt(en) → druk op **D** (zie [Sneltoetsen](./keyboard-shortcuts.md)) |

### Meervoudige selectie

Wanneer meerdere knooppunten zijn geselecteerd, wordt In-/Uitschakelen op alle toegepast. Het contextmenu toont "Inschakelen" als een van de geselecteerde knooppunten is uitgeschakeld, "Uitschakelen" als alle zijn ingeschakeld.

### Gedrag tijdens uitvoering

Knooppunten met `active: false` worden overgeslagen. Stroomafwaartse knooppunten ontvangen geen data van overgeslagen knooppunten. Gebruik dit om knooppunten tijdelijk uit te sluiten zonder ze te verwijderen.

Om een knooppunt vanuit een workflow in of uit te schakelen in plaats van handmatig, gebruikt u [Knooppunt uitschakelen](../nodes/disable-node.md) en [Knooppunt inschakelen](../nodes/enable-node.md).

## Agent-geheugengraaf

[Agent](../nodes/agent-node.md)-knooppunten met ingeschakeld **[persistent geheugen](./agent-persistent-memory.md)** tonen een roze **brein**-bedieningselement op het knooppunt. Klik erop om de editor voor de geheugengraaf te openen: entiteiten worden weergegeven als een geanimeerde, force-directed graaf, geclusterd per entiteitstype, met doorzoekbare Source/Target-kiezers voor het toevoegen van relaties en een verbindingenpaneel voor het springen tussen gekoppelde entiteiten. Hetzelfde dialoogvenster bevat **Geheugen delen met andere agenten** (workflow → agent → lezen of lezen/schrijven) voor [geheugen delen tussen agenten](./agent-persistent-memory.md#sharing-with-other-agents). Terwijl het dialoogvenster open is, wordt undo/redo op het hoofdcavas uitgesteld, zodat het bewerken van de graaf zijn eigen geschiedenis behoudt.

**De graaf filteren.** Linksboven op het canvas bevindt zich een zoekbediening, samengevouwen tot een snelkoppelingsknop totdat erop wordt geklikt of **Ctrl/Cmd+F** wordt ingedrukt. Deze komt overeen met de naam van een entiteit, het type en elke attribuutsleutel en -waarde, evenals met het type van een relatie (`parent_of`) en de eigenschappen ervan; een overeenkomende relatie brengt beide bijbehorende entiteiten met zich mee. Alle door witruimte gescheiden termen moeten overeenkomen. Een overeenkomende entiteit brengt haar volledige omgeving met zich mee — elke relatie waaraan zij deelneemt en de entiteit aan de andere kant van elk daarvan — zodat een overeenkomst nooit als een losse punt achterblijft. Een overeenkomende relatie brengt alleen de twee entiteiten die zij verbindt en stopt daar, aangezien het zoeken naar een relatietype een vraag is over die relatie en niet over alles waaraan de uiteinden zijn gekoppeld. Al het overige wordt volledig verborgen — niet vervaagd — op het canvas en in de lijst **Alle randen**, en een badge toont hoeveel van de totale entiteiten overblijven. De **✕** in het vak wist eerst de zoekopdracht en sluit het vak bij een tweede keer indrukken. Escape werkt op dezelfde manier terug, van binnen naar buiten: het wist de zoekopdracht, sluit vervolgens het zoekvak, verlaat daarna de uitgebreide canvasweergave en sluit het dialoogvenster pas wanneer geen van deze open is. Het wissen herstelt de volledige graaf met elke entiteit terug op haar oorspronkelijke plaats.

**Entiteiten handmatig plaatsen.** Het slepen van een entiteit zet deze vast waar zij wordt neergezet, zodat de automatische indeling de rest van de graaf eromheen schikt in plaats van haar terug te trekken. Het slepen van de geselecteerde entiteit verplaatst de direct verbonden entiteiten mee, waardoor de vorm van het cluster behouden blijft; het slepen van een andere entiteit verplaatst alleen die ene. **Netjes indelen** (de toverstafknop) maakt elke vastgezette entiteit los en voert de automatische indeling opnieuw uit.

## Extraheren naar sub-workflow

Converteer geselecteerde knooppunten naar een herbruikbare sub-workflow en vervang ze door een [Execute](../nodes/execute-node.md)-knooppunt.

### Gebruik

1. Selecteer een of meer knooppunten op het canvas
2. Klik met de rechtermuisknop → **Extraheren naar sub-workflow**
3. Voer een naam (en optionele beschrijving) in voor de nieuwe workflow
4. Klik op **Extraheren**

### Wat er gebeurt

- Er wordt een nieuwe workflow gemaakt met de geselecteerde knooppunten
- Externe invoer (randen van buiten de selectie) worden de [Input](../nodes/input-node.md)-velden van de sub-workflow
- Externe uitvoer (randen naar knooppunten buiten de selectie) worden toegewezen aan de [Output](../nodes/output-node.md) van de sub-workflow
- De geselecteerde knooppunten worden vervangen door een enkel [Execute](../nodes/execute-node.md)-knooppunt dat de nieuwe workflow aanroept
- Invoer-/uitvoertoewijzingen blijven automatisch behouden

### Gebruiksscenario's

- Een reeks knooppunten hergebruiken in meerdere workflows
- Een complexe workflow vereenvoudigen door gerelateerde logica te groeperen
- Modulaire, testbare sub-workflows creëren

## Uitvoeren met cURL

De knop **cURL** in de werkbalk van de editor (rechtsboven) opent een dialoogvenster om een cURL-opdracht te bouwen en te kopiëren voor het activeren van de workflow via API.

- Kies de modus voor de request body van de workflow (`Defined` of `Generic`)
- Stel het authenticatietype in (Anonymous, JWT of Header Auth)
- Configureer response caching en rate limiting
- Schakel SSE-streaming in of uit en pas de startberichten per knooppunt aan
- Bewerk de request body
- In de Generic-modus gebruikt het uitvoeringspaneel van het canvas dezelfde raw JSON-body als het cURL-dialoogvenster
- Klik op **cURL kopiëren** om de kant-en-klare opdracht te kopiëren

Zie [Webhooks](./webhooks.md#run-with-curl-dialog) voor volledige details van het dialoogvenster en [SSE-streaming](./sse-streaming.md) voor het gebeurtenisprotocol.

## Gerelateerd

- [Sneltoetsen](./keyboard-shortcuts.md) – Alle sneltoetsen voor canvas en editor
- [Agent persistent geheugen](./agent-persistent-memory.md) – Gedrag en API van de geheugengraaf
- [Execute-knooppunt](../nodes/execute-node.md) – Roept sub-workflows aan
- [Expression DSL](./expression-dsl.md) – Referenties en vastgezette gegevens
- [Workflowstructuur](./workflow-structure.md) – Knooppunt- en randformaat
- [Downloaden & importeren](./download-import.md) – Workflows exporteren en importeren als JSON
- [Knooppunttypen](./node-types.md) – Alle knooppunttypen
- [Logs-tabblad](../tabs/logs-tab.md) – Docker-containerlogboeken
- [Uitvoeringsgeschiedenis](./execution-history.md) – Eerdere uitvoeringen
- [Sjablonen](../tabs/templates-tab.md) – Workflows en knooppunten opslaan en hergebruiken
- [Contextuele showcase](./contextual-showcase.md) – Compacte paginagids beschikbaar in de editor
