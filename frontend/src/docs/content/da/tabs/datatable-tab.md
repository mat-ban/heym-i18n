# DataTable

**DataTable**-fanen gør det muligt at oprette og administrere struktureret datatabeller direkte i Heym. Tabeller kan anvendes i workflows via [DataTable-node](../nodes/datatable-node.md) til programmatiske CRUD-operationer.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Se DataTable-demo</a></p>

## Oprettelse af tabel

1. Naviger til DataTable-fanen fra dashboardet  
2. Klik på **Opret DataTable**  
3. Indtast et navn og valgfri beskrivelse  
4. Tilføj kolonner med kolonneeditoren  

## Kolonner

Hver kolonne indeholder:

| Egenskab | Beskrivelse |
|----------|-------------|
| Navn | Kolonnens visningsnavn |
| Type | `string`, `number`, `boolean`, `date` eller `json` |
| Påkrævet | Om nye rækker skal indeholde denne kolonne |
| Unik | Om værdier skal være unikke på tværs af rækker |
| Standardværdi | Autofyldes, når en række udelader denne kolonne |

Tilføj, rediger eller fjern kolonner fra tabellens detaljevisningsheader.

## Generer kolonner med AI

I stedet for manuelt at tilføje kolonner kan tabellen beskrives i almindeligt sprog (eller indsætte JSON-eksempel), hvorefter en LLM foreslår skemaet. Begge indgangspunkter åbner samme dialog:

- **Generer med AI** (DataTable-listeheader) - opretter en helt ny tabel baseret på beskrivelsen.  
- **AI-kolonner** (tabeldetaljevisning, ved siden af kolonnekontrollerne) - foreslår *nye* kolonner, der tilføjes til den åbne tabel.  

### Funktionsmåde

1. Vælg **LLM-legitimationsoplysninger** og **model** (standard er den første LLM-legitimationsoplysning og dens seneste model).  
2. Indtast en beskrivelse - f.eks. *"En tabel over bøger med titel, forfatter, sidetal og om den er læst"* - eller indsæt et JSON-eksempel/skema.  
3. Klik på **Generer**. Modellen returnerer et foreslået skema.  
4. Gennemse de genererede kolonner i en redigerbar form: ændr **navn**, **type**, **standardværdi**, **unik** og **notEmpty** (påkrævet) for hver, slet uønskede kolonner eller **Tilføj kolonne** manuelt. For en ny tabel kan der også redigeres i det AI-foreslåede **navn** og **beskrivelse**.  
5. Klik på **Opret tabel** (ny tabel) eller **Tilføj kolonner** (eksisterende tabel) for at gemme. Tryk på **Esc** for at lukke dialogen når som helst.  

### Kun tilføjelse for eksisterende tabeller

Ved generering af kolonner til en eksisterende tabel ser modellen de nuværende kolonner som kontekst og foreslår **kun nye** kolonner. Eksisterende kolonner og deres data ændres eller fjernes aldrig - genererede kolonner tilføjes. Dubletnavne (case-insensitive) droppes automatisk.  

> En LLM-legitimationsoplysning (OpenAI, Google eller Custom) er påkrævet. Hvis ingen findes, skal der først tilføjes en under Indstillinger.

## Håndtering af rækker

- **Tilføj række**: Klik på tilføj-knappen for at oprette en ny række  
- **Inline-redigering**: Dobbeltklik på en celle for at redigere dens værdi. Tryk Enter eller klik væk for at gemme, Escape for at annullere  
- **Slet række**: Brug rækkehandlingsmenuen til at fjerne en række  
- **Paginering**: Rækker vises med 25 pr. side med sidenavigation  

## CSV-import/eksport

### Import
1. Klik på **Importér CSV** i tabeldetaljevisningen  
2. Vælg en CSV-fil til upload  
3. Forhåndsvis de første 5 rækker og kolonnematning  
4. Grønne kolonner matcher eksisterende tabelkolonner; gule er umatchede  
5. Klik på Importér for at indsætte rækker i bulk  

### Eksport
Klik på **Eksportér CSV** for at downloade alle rækker som CSV-fil.  

## Deltagelse

Del tabeller med andre brugere eller teams:  

1. Åbn delingsdialogen fra tabeldetaljevisningen  
2. Tilføj brugere via email med **læse-** eller **skrive**-tilladelse  
3. Tilføj teams med **læse-** eller **skrive**-tilladelse  
4. Skrivebeskyttede brugere kan se data; brugere med skriveadgang kan ændre rækker og kolonner. Omdøbning af tabellen, ændring af dens beskrivelse og administration af delinger forbliver forbeholdt ejeren.

## Oprettelse af tabeller fra AI-assistenten

[AI-assistenten](../reference/ai-assistant.md#data-tables) på canvasen, [Chat](./chat-tab.md) og værktøjet `heym_chat` under [fanen MCP](./mcp-tab.md) kan vælge en af dine tabeller til et workflow, de bygger, eller oprette en ny. De foreslår et navn og kolonner og opretter tabellen, når du indsender spørgsmålskortet. Canvas-assistenten konfigurerer workflow-noder ud fra tabellens metadata. Chat og `heym_chat` kan også inspicere rækker, tilføje eller fjerne kolonner samt indsætte, opdatere eller slette rækker direkte. Giv dem et tabelnavn eller linket til denne fane. Skrivning kræver ejerskab eller direkte/team **skriveadgang**. Tilføjelse af kolonner bevarer eksisterende data; fjernelse af kolonner sletter deres værdier fra hver række. Fjernelse af kolonner og rydning af alle rækker beder om bekræftelse, svarende til denne fane.

## Brug i workflows

[DataTable-node](../nodes/datatable-node.md) forbinder tabeller med workflows. Operationer inkluderer find, getAll, getById, insert, update, remove og upsert. Ingen legitimationsoplysninger kræves.  

## LLM-omkostningstabel (systemtabel)

En fastgjort **Systemtabeller**-sektion vises over brugeroprettede tabeller med et enkelt indslag: **LLM Cost Table**. Dette er et fast skema, per-bruger redigerbart view af pr. model-priser, der bruges af [Kørsler](./traces-tab.md)-omkostningsdiagrammer.  

### Datakilde

Heym vedligeholder en global tabel med pr. model-priser, der udfyldes fra Helicones offentlige pricing-endpoint (`https://www.helicone.ai/api/llm-costs`). Synkroniseringen kører i baggrunden første gang tabellen eller Kørsler åbnes og throttles til én hentning pr. 24 timer. Tryk **Opdater** for at gennemtvinge en øjeblikkelig gen-synk. Fjernelser fra Helicones upstream-liste slettes ikke lokalt, så historiske omkostningsopslag forbliver stabile.  

### Skema (skrivebeskyttede kolonner)

| Kolonne | Betydning |  
|---|---|  
| Provider | `ANTHROPIC`, `OPENAI`, `GOOGLE`, … (informationsformål, brugt af Helicone) |  
| Model | Model-id matchet mod `trace.model` |  
| Op | Matchoperator: `equals`, `startsWith` eller `includes` |  
| Input $/1M | USD pr. 1 million prompt-tokens |  
| Output $/1M | USD pr. 1 million completion-tokens |  
| Source | `helicone`, `seed` eller `user` |
### Tilpasning af priser

- **Rediger en række** for at tilsidesætte dens priser. Tilsidesættelsen er per bruger og markeres med et `Customized`-mærke; fremtidige Helicone-synkroniseringer påvirker den ikke.
- **Nulstil til standard** fjerner tilsidesættelsen og gendanner den globale værdi for den pågældende række.
- **Tilføj brugerdefineret model** åbner en dialog til at oprette en bruger-specifik række (f.eks. en privat finjusteret model, som Helicone ikke viser). Brugerdefinerede rækker markeres med `User added`, og sletning fjerner dem helt.

### Matchning mod kørsler

Når Traces-dashboardet beregner omkostninger, matches hver `trace.model` mod:

1. Tilsidesættelserne (eksakt match på modelnavn) først
2. Ellers den globale tabel - `equals` eksakt match har prioritet over `startsWith`/`includes`; ved samme operator vælges det længste matchende modelpræfiks/-substreng

Hvis ingen række matcher, vises modellen under **Unpriced models**-notifikationen på Traces-siden; dens omkostningsbidrag er nul, indtil der tilføjes en brugerdefineret række eller tilsidesættes en eksisterende.

## Relateret

- [Datatabel-node](../nodes/datatable-node.md) - Reference for workflow-noder
- [Traces-fane](./traces-tab.md) - Bruger LLM Cost Table til omkostningsdonut og KPI-kort
- [Grist-node](../nodes/grist-node.md) - Eksternt regnearkalternativ
- [Variabler-fane](./global-variables-tab.md) - Nøgle-værdi-lageralternativ