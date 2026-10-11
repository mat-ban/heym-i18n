# Canvas-funktioner

Workflow-editoren tilbyder flere funktioner til fejlfinding, test og organisering af noder: **Kør til Node**, **Data Pin**, **Eksekveringslogs**, **Aktivér/Deaktivér** og **Ekstraher til Sub-Workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Se Editor-demo</a></p>

## Kør til Node

Ved at holde markøren over en node (undtagen en sticky note) og klikke på **Kør** under den, udføres den pågældende node og dens opstrømsafhængigheder, mens nedstrømsnoder og uafhængige grene ikke påvirkes. Dette bruger canvas-testtilstand, inklusive fastgjorte outputs og workflowets normale forgreningsbetingelser.

Hvis den valgte sti har inputfelter, åbnes panelet **Kør** til højre med fokus på det første felt. Indtast værdierne, og klik derefter på **Kør til _node-label_** eller tryk på **Ctrl+Enter** (Cmd+Enter på macOS). Generisk body-tilstand fokuserer på JSON-body-editoren. Stier uden inputfelter køres umiddelbart uden at åbne panelet. Fastgjorte Input-noder genbruger deres fastgjorte output uden at spørge om input.

Panelet bevarer det valgte mål for efterfølgende kørsler. Vælg **Kør fuldt workflow** for at rydde målet. Kør-knapper deaktiveres under en aktiv eksekvering. Et mål inde i en løkke stopper kørslen, når noden første gang nås; ved valg af en node efter løkken køres den komplette opstrømsløkke.

## Data Pin

Data Pin giver mulighed for at fastgøre en nodes output fra den seneste kørsel, så det er muligt at teste nedstrømsnoder uden at genudføre den fastgjorte node.

### Hvor findes det

- **Egenskabspanel** - Vælg en node og rul ned til sektionen **Pinned Data**
- **Node-badge** - En pin-ikon vises på noden, når data er fastgjort

### Handlinger

| Handling | Beskrivelse |
|--------|-------------|
| **Fastgør** | Fastgør nodens seneste eksekveringsoutput (tilgængeligt efter en kørsel) |
| **Ryd** | Fjerner fastgjorte data |
| **Rediger** | Rediger de fastgjorte JSON-data direkte; klik Gem for at anvende |

### Testtilstandsadfærd

Når et workflow køres i testtilstand, springer noder med `pinnedData` over eksekveringen og bruger i stedet det fastgjorte output. Dette kan bruges til:

- At teste nedstrømslogik uden at kalde eksterne API'er
- Fejlfinding af udtryk, der refererer til nodens output
- Iteration af prompts eller betingelser med faste eksempeldata

Udtryksfuldførelse i editoren bruger fastgjorte data, når de er tilgængelige, til at foreslå felter.

## Eksekveringslogs

**Debug-panelet** (bundskuffen) viser eksekveringslogs i realtid under workflowkørsler. Det er også muligt at åbne en igangværende produktionseksekvering fra enten Historik-dialogen eller et Board-kort. Editoren tilknytter sig kørslens SSE-stream, gendanner fuldførte node-resultater og fortsætter med at vise nodeanimationer og logs, mens nye noder startes og afsluttes.

### Hvad vises

- **Node-resultater** - Status pr. node (`success`, `error`, `skipped`, `running`), eksekveringstid og output
- **Endelige outputs** - Aggregerede outputs fra [Output](../nodes/output-node.md)-noder
- **Agent-fremskridt** - For [Agent](../nodes/agent-node.md)-noder, trin-for-trin værktøjskald og ræsonnement

### Handlinger

- **Kopier som JSON** - Kopier den fulde eksekveringslog til udklipsholder
- **Åbn i JSON-editor** - Åbner loggen i JSON Hero eller JSON Editor Online til inspektion
- **Download genererede filer** - Hvis en skill producerede downloadbare filer (`_generated_files`), vises en Download-knap. Enkeltfiler downloades direkte; flere filer åbner en valgpopup.

### Forskellig fra Logs-fanen

Debug-panelet viser **workflow-eksekveringslogs** (node-resultater, outputs). [Logs-fanen](../tabs/logs-tab.md) viser **Docker-containerlogs** (backend, frontend, database). <!-- pragma: allowlist secret -->

## Aktivér / Deaktivér

Det er muligt at deaktivere noder, så de springes over under eksekvering. Deaktiverede noder viser en "slukket"-badge og fremstår udtonede.

### Sådan skiftes

| Metode | Beskrivelse |
|--------|-------------|
| **Egenskabspanel** | Vælg node → Power-ikon (øverst til højre) |
| **Kontekstmenu** | Højreklik på node(r) → Deaktivér eller Aktivér |
| **Tastatur** | Vælg node(r) → tryk **D** (se [Tastaturgenveje](./keyboard-shortcuts.md)) |

### Flervalg

Når flere noder er valgt, anvendes Aktivér/Deaktivér på alle. Kontekstmenuen viser "Aktivér", hvis nogen valgte node er deaktiveret, "Deaktivér", hvis alle er aktive.

### Runtime-adfærd

Noder med `active: false` springes over. Nedstrømsnoder modtager ingen data fra sprungete noder. Dette kan bruges til midlertidigt at udelukke noder uden at slette dem.

For at skifte en node til/fra indefra et workflow i stedet for manuelt, kan [Deaktivér Node](../nodes/disable-node.md) og [Aktivér Node](../nodes/enable-node.md) anvendes.
## Agent-hukommelsesgraf

[Agent](../nodes/agent-node.md)-noder med **[vedvarende hukommelse](./agent-persistent-memory.md)** aktiveret viser en lyserød **hjerne**-kontrolelement på noden. Klik på den for at åbne hukommelsesgrafeditoren: enheder vises som en animeret, kraft-dirigeret graf grupperet efter enhedstype, med søgbare Source/Target-vælgere til at tilføje relationer og en forbindelsespanel til at navigere mellem linkede enheder. Den samme dialogboks indeholder **Del hukommelse med andre agenter** (workflow → agent → læs eller læs/skriv) til [kryds-agent-hukommelsesdeling](./agent-persistent-memory.md#sharing-with-other-agents). Mens dialogen er åben, udskydes undo/redo på hovedcanvasset, så grafredigering har sin egen historik.

**Filtrering af grafen.** Øverst til venstre på canvasset findes en søgefunktion, der er skjult som en genvejsknap, indtil der klikkes på den eller der trykkes på **Ctrl/Cmd+F**. Den matcher en enheds navn, dens type og hvert attributnøgle og -værdi, samt en relations type (`parent_of`) og dens egenskaber; en matchet relation medfører begge dens enheder. Alle mellemrum-adskilte termer skal matche. En matchet enhed medfører hele dens nabolag — hver relation den deltager i og enheden i den anden ende af hver — så en match aldrig efterlades som en uforbundet prik. En matchet relation medfører kun de to enheder den forbinder og stopper der, da søgning efter en relationstype handler om netop den relation snarere end alt hvad dens ender er forbundet til. Alt andet skjules umiddelbart — ikke udtonet — på canvasset og i **Alle kanter**-listen, og en badge viser hvor mange af de samlede enheder der er tilbage. **✕**-knappen i boksen nulstiller først søgningen, hvorefter den lukker boksen ved andet tryk. Escape fungerer på samme måde, inderst først: den rydder søgningen, lukker søgeboksen, forlader den udvidede canvasvisning og lukker først dialogen, når ingen af disse er åbne. Rydning gendanner den fulde graf med alle enheder tilbage på deres plads.

**Manuel placering af enheder.** Ved at trække en enhed fastgøres den, hvor den slippes, så den automatiske layoutjustering arrangerer resten af grafen omkring den i stedet for at trække den tilbage. Hvis den valgte enhed trækkes, flyttes dens direkte forbundne enheder med, så klyngens form bevares; ved at trække enhver anden enhed flyttes kun denne. **Ryd layout** (tryllestav-knappen) frigiver alle fastgjorte enheder og genkører den automatiske layoutjustering.

## Ekstraher til Under-Workflow

Konverter valgte noder til et genanvendeligt under-workflow og erstatt dem med en [Execute](../nodes/execute-node.md)-node.

### Anvendelse

1. Vælg en eller flere noder på canvasset
2. Højreklik → **Ekstraher til Under-Workflow**
3. Indtast et navn (og valgfri beskrivelse) for det nye workflow
4. Klik på **Ekstraher**

### Hvad der sker

- Et nyt workflow oprettes med de valgte noder
- Eksterne inputs (kanter udefra valget) bliver under-workflowets [Input](../nodes/input-node.md)-felter
- Eksterne outputs (kanter til noder udenfor valget) mappes til under-workflowets [Output](../nodes/output-node.md)
- De valgte noder erstattes med en enkelt [Execute](../nodes/execute-node.md)-node, der kalder det nye workflow
- Input/output-mapping bevares automatisk

### Anvendelsestilfælde

- Genbrug en sekvens af noder på tværs af flere workflows
- Forenkle et komplekst workflow ved at gruppere relateret logik
- Opret modulære, testbare under-workflows

## Kør med cURL

**cURL**-knappen i editorværktøjslinjen (øverst til højre) åbner en dialog til at bygge og kopiere en cURL-kommando til at udløse workflowet via API.

- Vælg workflowets request body-tilstand (`Defineret` eller `Generisk`)
- Angiv godkendelsestype (Anonym, JWT eller Header Auth)
- Konfigurer response-caching og rate limiting
- Slå SSE-streaming til og tilpas per-node-startbeskeder
- Rediger request body
- I Generisk tilstand bruger canvas-kørselspanelet den samme rå JSON-body som cURL-dialogen
- Klik på **Kopiér cURL** for at kopiere den klar til brug kommando

Se [Webhooks](./webhooks.md#run-with-curl-dialog) for fulde dialogdetaljer og [SSE Streaming](./sse-streaming.md) for eventprotokollen.

## Relateret

- [Tastaturgenveje](./keyboard-shortcuts.md) – Alle canvas- og editorgenveje
- [Agent Vedvarende Hukommelse](./agent-persistent-memory.md) – Hukommelsesgrafadfærd og API
- [Execute Node](../nodes/execute-node.md) – Kalder under-workflows
- [Expression DSL](./expression-dsl.md) – Referencer og fastgjorte data
- [Workflow-struktur](./workflow-structure.md) – Node- og kantformat
- [Download & Import](./download-import.md) – Eksport og import af workflows som JSON
- [Nodetyper](./node-types.md) – Alle nodetyper
- [Logs-fane](../tabs/logs-tab.md) – Docker-containerlogs
- [Kørselshistorik](./execution-history.md) – Tidligere kørsler
- [Skabeloner](../tabs/templates-tab.md) – Gem og genbrug workflows og noder
- [Kontekstvisning](./contextual-showcase.md) – Kompakt sideguide tilgængelig i editoren
