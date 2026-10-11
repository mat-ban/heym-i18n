# Vadības panelis

**Vadības paneļa** cilne ir Grafana stila telpa, kurā Jūs veidojat diagrammu logrīku režģus. Katrs logrīks tiek attēlots no tā paša slēptā Heym workflow rezultāta, tāpēc visi dati, ko Jūs varat radīt workflow — datu bāzes vaicājumi, API izsaukumi, RAG meklējumi, LLM izejas — var kļūt par diagrammu. Jūs varat saglabāt vairākus vadības paneļus un dalīties ar katru no tiem ar cilvēkiem vai komandām.

## Vadības paneļi

Ikviens sāk ar vienu vadības paneli, kas tiek izveidots pirmo reizi atverot cilni. Izmantojiet vadības paneļa izvēlni cilnes augšdaļā, lai pārslēgtos starp vadības paneļiem, un **+** blakus tam, lai izveidotu jaunu. Izvēlne vispirms uzskaita Jūsu pašu vadības paneļus, pēc tam tos, kas ir kopīgoti ar Jums, apzīmēti ar personas vārdu, kas tos kopīgoja.

Cilne atkārtoti atver pēdējo izmantoto vadības paneli, un adreses joslā ir atvērtais vadības panelis (`?tab=dashboard&dashboard=<id>`), tāpēc saite atver tieši šo vadības paneli ikvienam, kam ir piekļuve.

Iestatījumu poga (tikai īpašniekiem) pārsauc vadības paneli, pārvalda koplietošanu un dzēš to. Dzēšot vadības paneli, tiek noņemti tā logrīki un to workflow. Jūs vienmēr saglabājat vismaz vienu savu vadības paneli, tāpēc pēdējo nevar dzēst.

## Logrīki

Logrīks ir viena diagramma uz režģa. Atbalstītie diagrammu tipi:

- **Stabiņš** (vertikāls vai horizontāls)
- **Līnija**
- **Laukums** (aizpildīta tendence, atbalsta vairākas sērijas)
- **Pīrāgs**
- **Tabula** (ritināma)
- **Skaitlis** (viens KPI vērtība ar opciju vienību)
- **Mērītājs** (viena vērtība pret min–max diapazonu, piemēram, procents)
- **Izkliedēšana** (X/Y punkti korelācijas diagrammām)
- **Proporcija** (viens stabiņš sadalīts daļās ar procentu leģendu, piemēram, valodas sadalījums)
- **Stabiņa mērītājs** (viens horizontāls mērītājs katrā rindā ar sarkano→zaļo gradientu un vērtību, piemēram, brīva diska vieta)
- **Teksts** (markdown ziņojums, piemēram, statusa piezīme "Pēdējā izpilde plkst. 19:47"; atbalsta [interaktīvos izvēles rūtiņas](../nodes/chart-output-node.md#interactive-task-lists), kad markdown ir statisks, un [skaitliskās sarakstus](../nodes/chart-output-node.md#numbered-lists) pielāgotai vai dilstošai numurēšanai)
- **HITL** (jūsu gaidošās cilvēku atsauksmes. Galvene rāda `1/n gaidošs`. Workflow nosaukums atver šo izpildi kanvā. **Apstiprināt**, **Pieprasīt izmaiņas** un **Noraidīt** to atrisina. Vēstures ikona blakus logrīka nosaukumam atver šo izpildi vēstures dialogā šajā lapā. Logrīks neizmanto augšupējo rindas, un katra persona redz savu rindu)

Katrs logrīks ielādē savus datus asinkroni, kad Jūs atverat cilni, tāpēc lapa paliek reaģējoša, kamēr diagrammas tiek aizpildītas.

## Logrīka pievienošana

1. Noklikšķiniet uz **Pievienot logrīku**, norādiet tam nosaukumu un izvēlieties diagrammas tipu. Zem izvēles rīka logs zīmē šī diagrammas tipa piemēru ar paraugiem datiem un nosauc rindas, kuras tas sagaida, lai Jūs varētu salīdzināt tipus pirms kaut ko veidojat.
2. Logrīks atveras workflow redaktorā ar sākuma grafiku: [Set](../nodes/set-node.md) mezgls, kas ražo rindas, savienots ar [Chart Output](../nodes/chart-output-node.md) mezglu. Aizvietojiet Set mezglu ar jebkuru datu avotu. **HITL** logrīks ir tikai Chart Output mezgls; tas lasa Jūsu gaidošās atsauksmes un neprasa datu avotu.
3. Veidojiet workflow tā, lai mezgls, kas baro **Chart Output**, ražo rindu masīvu, pēc tam konfigurējiet Chart Output mezgla lauku kartēšanu (nosaukuma lauks, vērtības lauks utt.).
4. Saglabājiet, atgriezieties pie Vadības paneļa cilnes, un logrīks tiek attēlots.

Divreiz noklikšķiniet uz logrīka (vai izmantojiet tā rediģēšanas pogu), lai jebkurā laikā atkārtoti atvērtu tā workflow. Izmantojiet **Klonēt logrīku** logrīka galvenē, lai dublētu gan logrīku, gan tā pilnu workflow. Kopija tiek novietota zem oriģināla un apzīmēta ar **(Kopija)**, lai Jūs varētu to rediģēt neatkarīgi.

## Logrīka ģenerēšana ar AI

Noklikšķiniet uz **AI**, aprakstiet metrikas, ko vēlaties (piemēram, "workflow panākumu līmenis pēdējās 30 dienās kā stabiņa diagramma"), un izvēlieties LLM akreditācijas datus un modeli. Heym ģenerē pilnu logrīka workflow, kas beidzas ar Chart Output mezglu, un pievieno to režģim. Skatiet [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) piemēru uzvednēm katram diagrammas tipam.

Izmantojiet logrīka pogu **Pielāgot ar AI**, lai pārskatītu esošu logrīku ar jaunu instrukciju. Katrs AI pielāgojums saglabā iepriekšējo workflow logrīka **Vēstures rediģēšana**, tāpēc Jūs varat pārskatīt vai atgriezt izmaiņas no workflow redaktora.

## Izkārtojuma rediģēšana

Pārslēdziet **Rediģēt**, lai ieietu rediģēšanas režīmā, kurā Jūs varat vilkt logrīkus un mainīt to izmērus 12 kolonnās. Izkārtojuma izmaiņas tiek saglabātas automātiski. Logrīku nosaukumi ir rediģējami tieši no logrīka galvenes.

## Kešatmiņa un atsvaidzināšana

Katrs logrīks kešatmiņā saglabā savus pēdējos aprēķinātos datus serverī uz konfigurējamu laiku (TTL). Kamēr kešatmiņa ir svaiga, atkārtota vadības paneļa atvēršana kalpo uzglabātajam rezultātam, nevis atkārtoti izpilda workflow. Kešatmiņa tiek aizvietota katru reizi, kad dati tiek atkārtoti aprēķināti (viena kešatmiņa katram logrīkam), un tā automātiski tiek invalidēta, kad Jūs rediģējat logrīka workflow.

Izmantojiet logrīka pogu **Atsvaidzināt** (vai **Atsvaidzināt** rīkjoslā), lai apietu kešatmiņu un nekavējoties atkārtoti aprēķinātu.
## Koplietošana

Darbību īpašnieki koplieto informācijas paneli no tā iestatījumiem, ar individuāliem lietotājiem (pa e-pastu) vai ar jebkuru [komandu](teams-tab.md), kurai viņi pieder. Katram koplietošanas veidam ir **Lasīšana** vai **Rakstīšana**; ja kādam ir gan personīgā, gan komandas koplietošana, tiek piemērota spēcīgākā.

| Darbība | Īpašnieks | Rakstīšana | Lasīšana |
|---------|:---------:|:----------:|:--------:|
| Skatīt logrīkus, atsvaidzināt tos, izmantot automātisko atsvaidzināšanu | ✓ | ✓ | ✓ |
| Pievienot, kopēt, dzēst, pārdēvēt un mainīt logrīku izmērus; AI ģenerēt un pielāgot; atzīmēt kontrolsaraksta vienumus | ✓ | ✓ | |
| Atvērt logrīka workflow redaktorā | ✓ | ✓ | |
| Pārdēvēt vai dzēst informācijas paneli, pārvaldīt koplietošanu | ✓ | | |

**Logrīki vienmēr darbojas kā informācijas paneļa īpašnieks.** Neatkarīgi no tā, kurš skatās, logrīks izmanto īpašnieka akreditācijas datus un globālos mainīgos, un tā izpildes parādās īpašnieka izpildes vēsturē un pēdās. Tāpēc komandas biedri redz tos pašus datus bez piekļuves kontiem, kas aiz tā stāv, un katrs skatītājs dalās vienā kešatmiņā saglabātajā rezultātā katram logrīkam. Logrīki, kurus pievieno vai kopē rakstīšanas kolēģis, pieder arī īpašniekam.

Tādēļ **Rakstīšana** nes tādu pašu uzticību kā workflow koplietošana rediģēšanai: kolēģis ar rakstīšanas piekļuvi var mainīt to, kas darbojas ar Jūsu akreditācijas datiem. Piešķiriet to tikai cilvēkiem, kuriem Jūs uzticētu rediģēt savus workflows. Testa izpilde, ko kolēģis uzsāk no workflow redaktora, izmanto viņa paša akreditācijas datus, tāpat kā jebkurš koplietotais workflow; tikai pats informācijas panelis darbojas kā īpašnieks. **Lasīšana** nepiešķir piekļuvi logrīku workflows, un tikai lasīšanas tiesības saņemošie skatītāji saņem pašu diagrammu, bet ne detalizēto izpildes informāciju par katru mezglu.

Koplietošanas noņemšana vai samazināšana no rakstīšanas uz lasīšanu stājas spēkā nekavējoties.

## Saistītie

- [Diagrammas izejas mezgls](../nodes/chart-output-node.md)
- [Analītikas cilne](analytics-tab.md) — iebūvētie izpildes metriķi (atšķirīgi no lietotāju veidotajiem informācijas paneļiem)
