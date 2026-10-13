# Vadības panelis

**Vadības paneļa** cilne ir Grafana stila telpa, kurā Jūs veidojat diagrammu logrīku režģus. Katrs logrīks tiek attēlots no tā paša slēptā Heym workflow rezultāta, tāpēc visi dati, ko Jūs varat radīt workflow — datu bāzes vaicājumi, API izsaukumi, RAG meklējumi, LLM izejas — var kļūt par diagrammu. Jūs varat saglabāt vairākus vadības paneļus un dalīties ar katru no tiem ar cilvēkiem vai komandām.

## Vadības paneļi

Ikviens sāk ar vienu vadības paneli, kas tiek izveidots pirmo reizi atverot cilni. Izmantojiet vadības paneļa izvēlni cilnes augšdaļā, lai pārslēgtos starp vadības paneļiem, un **+** blakus tam, lai izveidotu jaunu. Izvēlne vispirms uzskaita Jūsu pašu vadības paneļus, pēc tam tos, kas ir kopīgoti ar Jums, apzīmēti ar personas vārdu, kas tos kopīgoja.

Cilne atkārtoti atver pēdējo izmantoto vadības paneli, un adreses joslā ir atvērtais vadības panelis (`?tab=dashboard&dashboard=<id>`), tāpēc saite atver tieši šo vadības paneli ikvienam, kam ir piekļuve.

Iestatījumu poga (tikai īpašniekiem) pārsauc vadības paneli, nosaka, kurus ierakstus tas pieņem kā [detalizētās informācijas lapa](#detail-pages), pārvalda koplietošanu un dzēš to. Dzēšot vadības paneli, tiek noņemti tā logrīki un to workflow. Jūs vienmēr saglabājat vismaz vienu savu vadības paneli, tāpēc pēdējo nevar dzēst.

## Logrīki

Logrīks ir viena diagramma uz režģa. Atbalstītie diagrammu tipi:

- **Stabiņš** (vertikāls vai horizontāls)
- **Līnija**
- **Laukums** (aizpildīta tendence, atbalsta vairākas sērijas)
- **Pīrāgs**
- **Tabula** (ritināma; vienu kolonnu var attēlot kā [statusa žetonus](../nodes/chart-output-node.md#status-chips), un rindas var atvērt [detalizētās informācijas lapu](#detail-pages))
- **Skaitlis** (viens KPI vērtība ar opciju vienību)
- **Mērītājs** (viena vērtība pret min–max diapazonu, piemēram, procents)
- **Izkliedēšana** (X/Y punkti korelācijas diagrammām)
- **Proporcija** (viens stabiņš sadalīts daļās ar procentu leģendu, piemēram, valodas sadalījums)
- **Stabiņa mērītājs** (viens horizontāls mērītājs katrā rindā ar sarkano→zaļo gradientu un vērtību, piemēram, brīva diska vieta)
- **Teksts** (markdown ziņojums, piemēram, statusa piezīme "Pēdējā izpilde plkst. 19:47"; atbalsta [interaktīvos izvēles rūtiņas](../nodes/chart-output-node.md#interactive-task-lists), kad markdown ir statisks, un [skaitliskās sarakstus](../nodes/chart-output-node.md#numbered-lists) pielāgotai vai dilstošai numurēšanai)
- **HITL** (jūsu gaidošās cilvēku atsauksmes. Galvene rāda `1/n gaidošs`. Workflow nosaukums atver šo izpildi kanvā. **Apstiprināt**, **Pieprasīt izmaiņas** un **Noraidīt** to atrisina. Vēstures ikona blakus logrīka nosaukumam atver šo izpildi vēstures dialogā šajā lapā. Logrīks neizmanto augšupējo rindas, un katra persona redz savu rindu)

Papildus diagrammām logrīks **Run a workflow** palaiž vienu no jūsu workflow tieši no vadības paneļa: ar nomestu failu, ar tā ievades laukiem vai ar pogu Run; skatiet [Izpildes logrīki](#run-widgets).

Katrs logrīks ielādē savus datus asinkroni, kad Jūs atverat cilni, tāpēc lapa paliek reaģējoša, kamēr diagrammas tiek aizpildītas.

## Logrīka pievienošana

1. Noklikšķiniet uz **Pievienot logrīku**, norādiet tam nosaukumu un izvēlieties diagrammas tipu. Zem izvēles rīka logs zīmē šī diagrammas tipa piemēru ar paraugiem datiem un nosauc rindas, kuras tas sagaida, lai Jūs varētu salīdzināt tipus pirms kaut ko veidojat.
2. Logrīks atveras workflow redaktorā ar sākuma grafiku: [Set](../nodes/set-node.md) mezgls, kas ražo rindas, savienots ar [Chart Output](../nodes/chart-output-node.md) mezglu. Aizvietojiet Set mezglu ar jebkuru datu avotu. **HITL** logrīks ir tikai Chart Output mezgls; tas lasa Jūsu gaidošās atsauksmes un neprasa datu avotu.
3. Veidojiet workflow tā, lai mezgls, kas baro **Chart Output**, ražo rindu masīvu, pēc tam konfigurējiet Chart Output mezgla lauku kartēšanu (nosaukuma lauks, vērtības lauks utt.).
4. Saglabājiet, atgriezieties pie Vadības paneļa cilnes, un logrīks tiek attēlots.

Logrīkam **Run a workflow** tā vietā izvēlieties workflow, kuru tas palaiž; atlasītājs norāda, kā logrīks palaidīs katru no tiem. Logrīks tiek pievienots tieši režģim; nav jāveido jauns workflow.

Divreiz noklikšķiniet uz logrīka (vai izmantojiet tā rediģēšanas pogu), lai jebkurā laikā atkārtoti atvērtu tā workflow. Izmantojiet **Klonēt logrīku** logrīka galvenē, lai dublētu gan logrīku, gan tā pilnu workflow. Kopija tiek novietota zem oriģināla un apzīmēta ar **(Kopija)**, lai Jūs varētu to rediģēt neatkarīgi.

## Detalizētās informācijas lapas

Tabulas logrīks var saistīt savas rindas ar citu vadības paneli, kas pēc tam darbojas kā detalizētās informācijas lapa: viens vadības panelis, kas apkalpo katru klientu, rēķinu vai pieteikumu.

1. Atveriet tabulas logrīka **Settings** un sadaļā **Row link** izvēlieties vadības paneli.
2. Ievadiet **Record column** — kolonnu, kuras vērtība identificē rindu (piemēram, `id`), un pēc izvēles **Label column**, kas to nosauc (piemēram, `name`).
3. Saglabājiet. Noklikšķinot uz rindas (vai fokusējot to un nospiežot Enter), tiek atvērts saistītais vadības panelis ar `?record=<value>&label=<name>`.

Detalizētās informācijas vadības panelī katrs logrīka workflow nolasa šo vērtību kā `$page.record` (skatiet [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), un lapa virs režģa parāda `Dashboard / <label>` ar pogu ieraksta notīrīšanai. Poga Atpakaļ atgriež tabulā, no kuras nācāt.

- **Kas to var atvērt.** Rindas ir klikšķināmas tikai tiem skatītājiem, kuri var atvērt saistīto vadības paneli. Pārējie redz to pašu tabulu bez saitēm.
- **Ieraksta formāts.** Ieraksts nāk no URL, tāpēc detalizētās informācijas vadības panelis izlemj, ko tas pieņem. Tā iestatījumos **Detail page records** ir viens no šiem: ID (burti, cipari, `-`, `_` un `.`, līdz 128 rakstzīmēm; noklusējums), skaitļi, UUID vai e-pasta adreses. Jebkura cita vērtība tiek noraidīta pirms logrīka palaišanas, un logrīki parāda "This page does not accept that record".
- **Joprojām īpašnieka izpilde.** Arī detalizētās informācijas lapā logrīki darbojas kā vadības paneļa īpašnieks. Izstrādātājiem `$page.record` jānodod tikai tur, kur mezgls to ekranē (escape), nekad tieši vaicājuma tekstā.
- **Kešošana.** Katrs logrīks kešatmiņā saglabā savu diagrammu katram ierakstam uz tādu pašu darbības laiku (TTL) kā pats logrīks, un saglabā 50 pēdējos izmantotos ierakstus.

## Izpildes logrīki

Logrīks **Run a workflow** palaiž vienu no jūsu workflow un parāda rezultātu: statusu, izpildes laiku un izvades. Tas, ko logrīks rāda, ir atkarīgs no tā, ko workflow pieņem:

- **Fails.** Workflow, kas sākas ar [File Upload Trigger](../nodes/file-upload-trigger-node.md), nometiet uz tā failu (vai noklikšķiniet, lai izvēlētos), un logrīks to augšupielādēs, izmantojot triggera vienreizējo augšupielādes saiti. Logrīks parāda failu tipus un izmēru, ko triggers pieņem, un noraida citus pirms augšupielādes. Ja workflow sākas arī ar Text Input mezglu, logrīks parāda tā laukus blakus nomešanas zonai: izvēlieties failu, aizpildiet laukus, un **Run** nosūtīs abus. Vērtības ceļo kopā ar logrīka izveidoto augšupielādes saiti, tāpēc koplietota augšupielādes saite nevar tās iestatīt.
- **Ievades lauki.** Workflow, kas sākas ar Text Input mezglu, logrīks parāda tā laukus ar noklusējuma vērtībām; **Run** palaiž workflow ar jūsu vērtībām. Vērtības laukiem, kuru workflow nav, tiek atmestas.
- **Nekas.** Workflow bez ievadēm iegūst pogu **Run**.

Rezultāta poga **Wrap** aplauž garas izvades rindas lodziņa iekšpusē; izslēdziet to, lai lasītu izvades JSON izkārtojumu.

- Ikviens, kurš var atvērt vadības paneli, var palaist logrīku, tāpat kā ikviens var atsvaidzināt diagrammu. Piekļuve workflow pieder vadības paneļa īpašniekam: logrīka pievienošanai ir nepieciešams workflow, kuru varat palaist gan jūs, gan īpašnieks, un pati izpilde izmanto workflow īpašnieka akreditācijas datus, tāpat kā jebkura augšupielādes saite.
- Rezultāts paliek jūsu ekrānā, līdz pametat lapu; citi skatītāji neredz jūsu failus, vērtības vai rezultātus. Izpilde parādās izpildes vēsturē ar triggeri `dashboard`.
- Vadības paneļa koplietošana nekad nepiešķir piekļuvi pašam workflow. **Edit workflow** to atver cilvēkiem, kuriem jau ir piekļuve, un **Fine-tune with AI** netiek piedāvāts.
- Failu izpildes notiek galvenajā instancē, kur tiek glabāti augšupielādētie faili, tāpat kā katra File Upload Trigger izpilde.

## Logrīka ģenerēšana ar AI

Noklikšķiniet uz **AI**, aprakstiet metrikas, ko vēlaties (piemēram, "workflow panākumu līmenis pēdējās 30 dienās kā stabiņa diagramma"), un izvēlieties LLM akreditācijas datus un modeli. Heym ģenerē pilnu logrīka workflow, kas beidzas ar Chart Output mezglu, un pievieno to režģim. Skatiet [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) piemēru uzvednēm katram diagrammas tipam.

Izmantojiet logrīka pogu **Pielāgot ar AI**, lai pārskatītu esošu logrīku ar jaunu instrukciju. Katrs AI pielāgojums saglabā iepriekšējo workflow logrīka **Vēstures rediģēšana**, tāpēc Jūs varat pārskatīt vai atgriezt izmaiņas no workflow redaktora.

## Izkārtojuma rediģēšana

Pārslēdziet **Rediģēt**, lai ieietu rediģēšanas režīmā, kurā Jūs varat vilkt logrīkus un mainīt to izmērus 12 kolonnās. Izkārtojuma izmaiņas tiek saglabātas automātiski. Logrīku nosaukumi ir rediģējami tieši no logrīka galvenes.

## Kešatmiņa un atsvaidzināšana

Katrs logrīks kešatmiņā saglabā savus pēdējos aprēķinātos datus serverī uz konfigurējamu laiku (TTL). Kamēr kešatmiņa ir svaiga, atkārtota vadības paneļa atvēršana kalpo uzglabātajam rezultātam, nevis atkārtoti izpilda workflow. Kešatmiņa tiek aizvietota katru reizi, kad dati tiek atkārtoti aprēķināti (viena kešatmiņa katram logrīkam, plus viena katram ierakstam [detalizētās informācijas lapā](#detail-pages)), un tā automātiski tiek invalidēta, kad Jūs rediģējat logrīka workflow.

Izmantojiet logrīka pogu **Atsvaidzināt** (vai **Atsvaidzināt** rīkjoslā), lai apietu kešatmiņu un nekavējoties atkārtoti aprēķinātu.
## Koplietošana

Darbību īpašnieki koplieto informācijas paneli no tā iestatījumiem, ar individuāliem lietotājiem (pa e-pastu) vai ar jebkuru [komandu](teams-tab.md), kurai viņi pieder. Katram koplietošanas veidam ir **Lasīšana** vai **Rakstīšana**; ja kādam ir gan personīgā, gan komandas koplietošana, tiek piemērota spēcīgākā.

| Darbība | Īpašnieks | Rakstīšana | Lasīšana |
|---------|:---------:|:----------:|:--------:|
| Skatīt logrīkus, atsvaidzināt tos, izmantot automātisko atsvaidzināšanu | ✓ | ✓ | ✓ |
| Atvērt detalizētās informācijas lapas, darbināt izpildes logrīkus | ✓ | ✓ | ✓ |
| Pievienot, kopēt, dzēst, pārdēvēt un mainīt logrīku izmērus; AI ģenerēt un pielāgot; atzīmēt kontrolsaraksta vienumus | ✓ | ✓ | |
| Atvērt logrīka workflow redaktorā | ✓ | ✓ | |
| Pārdēvēt vai dzēst informācijas paneli, iestatīt tā ieraksta formātu, pārvaldīt koplietošanu | ✓ | | |

**Logrīki vienmēr darbojas kā informācijas paneļa īpašnieks.** Neatkarīgi no tā, kurš skatās, logrīks izmanto īpašnieka akreditācijas datus un globālos mainīgos, un tā izpildes parādās īpašnieka izpildes vēsturē un pēdās. Tāpēc komandas biedri redz tos pašus datus bez piekļuves kontiem, kas aiz tā stāv, un katrs skatītājs dalās vienā kešatmiņā saglabātajā rezultātā katram logrīkam. Logrīki, kurus pievieno vai kopē rakstīšanas kolēģis, pieder arī īpašniekam.

Tādēļ **Rakstīšana** nes tādu pašu uzticību kā workflow koplietošana rediģēšanai: kolēģis ar rakstīšanas piekļuvi var mainīt to, kas darbojas ar Jūsu akreditācijas datiem. Piešķiriet to tikai cilvēkiem, kuriem Jūs uzticētu rediģēt savus workflows. Testa izpilde, ko kolēģis uzsāk no workflow redaktora, izmanto viņa paša akreditācijas datus, tāpat kā jebkurš koplietotais workflow; tikai pats informācijas panelis darbojas kā īpašnieks. **Lasīšana** nepiešķir piekļuvi logrīku workflows, un tikai lasīšanas tiesības saņemošie skatītāji saņem pašu diagrammu, bet ne detalizēto izpildes informāciju par katru mezglu.

Koplietošanas noņemšana vai samazināšana no rakstīšanas uz lasīšanu stājas spēkā nekavējoties.

## Saistītie

- [Diagrammas izejas mezgls](../nodes/chart-output-node.md)
- [Analītikas cilne](analytics-tab.md) — iebūvētie izpildes metriķi (atšķirīgi no lietotāju veidotajiem informācijas paneļiem)
