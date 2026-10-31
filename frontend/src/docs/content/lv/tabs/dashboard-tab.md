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
- **Tabula** (ritināma; noklikšķiniet uz kolonnas galvenes, lai kārtotu augošā secībā, un noklikšķiniet vēlreiz, lai kārtotu dilstošā secībā. Kolonnu var attēlot kā [statusa mikroshēmas](../nodes/chart-output-node.md#status-chips), kolonna var saturēt [saišu pogas](../nodes/chart-output-node.md#link-buttons), kas atver URL jaunā cilnē, un rindas var atvērt [detalizētās informācijas lapu](#detalizetas-informacijas-lapas))
- **Skaitlis** (viens KPI vērtība ar opciju vienību)
- **Mērītājs** (viena vērtība pret min–max diapazonu, piemēram, procents)
- **Izkliedēšana** (X/Y punkti korelācijas diagrammām)
- **Proporcija** (viens stabiņš sadalīts daļās ar procentu leģendu, piemēram, valodas sadalījums)
- **Gantt** (uzdevumu datumi, izpilde un atkarības)
- **Entity relationships (DB)** (tabulas, lauki, PK/FK atslēgas un savienojumi)
- **Stabiņa mērītājs** (viens horizontāls mērītājs katrā rindā ar sarkano→zaļo gradientu un vērtību, piemēram, brīva diska vieta)
- **Teksts** (markdown ziņojums, piemēram, statusa piezīme "Pēdējā izpilde plkst. 19:47"; atbalsta [interaktīvos izvēles rūtiņas](../nodes/chart-output-node.md#interactive-task-lists), kad markdown ir statisks, un [skaitliskās sarakstus](../nodes/chart-output-node.md#numbered-lists) pielāgotai vai dilstošai numurēšanai)
- **HITL** (jūsu gaidošās cilvēku atsauksmes. Galvene rāda `1/n gaidošs`. Workflow nosaukums atver šo izpildi kanvā. **Apstiprināt**, **Pieprasīt izmaiņas** un **Noraidīt** to atrisina. Vēstures ikona blakus logrīka nosaukumam atver šo izpildi vēstures dialogā šajā lapā. Logrīks neizmanto augšupējo rindas, un katra persona redz savu rindu. Tā vietā tā var rādīt viena Workflow pārskatīšanas ikvienam, kurš var atvērt šo Workflow; skatiet [HITL logrīki](#hitl-logriki))

Papildus diagrammām logrīks **Run a workflow** palaiž vienu no jūsu workflow tieši no vadības paneļa: ar nomestu failu, ar tā ievades laukiem vai ar pogu Run; skatiet [Izpildes logrīki](#run-widgets).

Katrs logrīks ielādē savus datus asinkroni, kad Jūs atverat cilni, tāpēc lapa paliek reaģējoša, kamēr diagrammas tiek aizpildītas.

## Logrīka pievienošana

1. Noklikšķiniet uz **Pievienot logrīku**, norādiet tam nosaukumu un izvēlieties diagrammas tipu. Zem izvēles rīka logs zīmē šī diagrammas tipa piemēru ar paraugiem datiem un nosauc rindas, kuras tas sagaida, lai Jūs varētu salīdzināt tipus pirms kaut ko veidojat.
2. Logrīks atveras workflow redaktorā ar sākuma grafiku: [Set](../nodes/set-node.md) mezgls, kas ražo rindas, savienots ar [Chart Output](../nodes/chart-output-node.md) mezglu. Aizvietojiet Set mezglu ar jebkuru datu avotu. **HITL** logrīks ir tikai Chart Output mezgls; tas lasa Jūsu gaidošās atsauksmes un neprasa datu avotu.
3. Veidojiet workflow tā, lai mezgls, kas baro **Chart Output**, ražo rindu masīvu, pēc tam konfigurējiet Chart Output mezgla lauku kartēšanu (nosaukuma lauks, vērtības lauks utt.).
4. Saglabājiet, atgriezieties pie Vadības paneļa cilnes, un logrīks tiek attēlots.

Logrīkam **Run a workflow** tā vietā izvēlieties workflow, kuru tas palaiž; atlasītājs norāda, kā logrīks palaidīs katru no tiem. Logrīks tiek pievienots tieši režģim; nav jāveido jauns workflow.

Divreiz noklikšķiniet uz logrīka (vai izmantojiet tā rediģēšanas pogu), lai jebkurā laikā atkārtoti atvērtu tā workflow. Izmantojiet **Klonēt logrīku** logrīka galvenē, lai dublētu gan logrīku, gan tā pilnu workflow. Kopija tiek novietota zem oriģināla un apzīmēta ar **(Kopija)**, lai Jūs varētu to rediģēt neatkarīgi.

## HITL logrīki

Jauns HITL logrīks parāda katru pārskatīšanu, kas gaida jūsu rindā. Lai parādītu tikai viena Workflow pārskatīšanas, atveriet logrīka **Iestatījumi**:

1. Sadaļā **Workflow** izvēlieties Workflow. Sarakstā ir Workflow, kurus varat atvērt – jūsu pašu vai koplietoti ar jums vai jūsu komandu –, kuriem ir darbība, kas gaida personu: Agent ar cilvēka pārskatīšanu vai Slack apstiprināšanas, pogu vai veidlapas darbība. Blakus esošā ikona atver šo Workflow jaunā cilnē.
2. Ja Workflow ir tieši viena šāda darbība, tā tiek atlasīta automātiski. Ja to ir vairākas, **Select agent** tās uzskaita pēc mezgla nosaukuma, vispirms norādot **All agents**; Slack darbības ir atzīmētas ar **(Slack)**.
3. Saglabājiet. Galvenes `1/n pending` skaita tikai šīs pārskatīšanas. Izvēlieties **Visi Workflows**, lai atkal parādītu savu rindu.

Tāda pati izvēle ir pieejama audeklā Chart Output mezgla rekvizītos. To var veikt **Precizēt ar AI** („rādīt tikai rēķinu apstiprinājumus“), kā arī jauna logrīka apraksts, kurā nosaukts Workflow. Katra izmaiņa ir Workflow rediģēšana, tāpēc tā parādās Edit History.

- **Kas redz pārskatīšanas.** Logrīks, kas filtrēts pēc Workflow, parāda šī Workflow pārskatīšanas ikvienam, kurš var atvērt šo Workflow, un šie lietotāji var apstiprināt, pieprasīt izmaiņas vai noraidīt no tā, tāpat kā viņi varētu palaist Workflow. Nefiltrēts logrīks katrai personai parāda viņas rindu.
- **Kas redz logrīku.** Persona, kura nevar atvērt izvēlēto Workflow, logrīku neredz vispār, pat vadības panelī, kas tiek koplietots ar viņu. Kad vadības paneļa īpašnieks zaudē piekļuvi Workflow vai tas tiek dzēsts, īpašnieks redz „You no longer have access to the workflow this widget shows“ un var izvēlēties citu **Iestatījumos**.
- **Tikai pieejamas izvēles.** Workflow, kuru nevarat atvērt, tiek noraidīts, saglabājot logrīku, neatkarīgi no tā, vai tas tiek darīts no iestatījumiem, audekla vai AI.

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

Logrīks saņem īsu viena vai divu vārdu nosaukumu jūsu pieprasījuma valodā, piemēram, „Atvērtās lietas“. Nosaukumā nekad nav datu tabulas ID; kad modelis nosauc logrīku ar teikumu, Heym saglabā tā pirmos vārdus.

Logrīku API var arī izveidot **skaitītāja karti** bez AI: `text` logrīks datu tabulā (`data_table_id`) ar `count_column` un `count_value` parāda, cik rindās ir šī vērtība; logrīka nosaukums norāda vērtību. Heym Work lapas, kas izveidotas no datu tabulas, ievada ar vienu skaitītāja karti katram statusam.

Izmantojiet logrīka pogu **Pielāgot ar AI**, lai pārskatītu esošu logrīku ar jaunu instrukciju. Katrs AI pielāgojums saglabā iepriekšējo workflow logrīka **Vēstures rediģēšana**, tāpēc Jūs varat pārskatīt vai atgriezt izmaiņas no workflow redaktora.

## No Chat un MCP

[Chat](./chat-tab.md) un MCP klienti, izmantojot rīku [`heym_chat`](./mcp-tab.md), var lasīt jūsu vadības paneļus, pievienot tiem logrīkus, pārdēvēt vai dzēst logrīkus un sakārtot vadības paneļa izkārtojumu. Heym Work katru vadības paneli rāda kā lapu, tāpēc tās pašas atbildes attiecas arī uz tā lapām.

- **Kādi vadības paneļi pastāv un kas tajos atrodas.** Jautājiet "kādi vadības paneļi man ir?", "kas atrodas Pārdošanas vadības panelī?" vai "kurā vadības panelī atrodas ieņēmumu workflow?". Chat uzskaita jūsu personīgos un ar jums kopīgotos vadības paneļus ar jūsu piekļuves tiesībām un saiti uz katru no tiem, kā arī katru tajos esošo logrīku: nosaukumu, diagrammas tipu un saistīto workflow. [HITL logrīks](#hitl-widgets), kas filtrēts pēc workflow, kuru nevarat atvērt, paliek paslēpts, tāpat kā pašā vadības panelī.
- **Jauns logrīks.** Pieprasiet "pievieno atvērto pieteikumu diagrammu pēc statusa Pārdošanas vadības panelim". Chat vispirms vadības panelī ievieto tukšu logrīku, pēc tam uzraksta paša logrīka workflow, veic testa izpildi un novērš kļūdas, līdz izpilde izdodas, tieši tāpat kā tas [veido workflowus](./chat-tab.md#workflow-izveide). Netiek atstāts atsevisķs neatkarīgs workflow, un katra saglabāšana parādās logrīka Edit History. Logrīka nosaukums un diagrammas tips atbilst tam, ko Chat saglabā.
- **Esošs workflow.** Pieprasiet "ievieto ieņēmumu workflow Pārdošanas vadības panelī". Workflow, kas beidzas ar Chart Output mezglu, kļūst par diagrammas logrīku ar savu workflow kopiju, tāpēc vēlākas logrīka izmaiņas nekad neietekmē oriģinālu. Workflow ar trigger vai input mezglu nevar kļūt par diagrammas logrīku. Jebkurš cits workflow kļūst par [izpildes logrīku](#run-widgets), kam nepieciešams arī workflow, ko vadības paneļa īpašnieks var izpildīt.
- **Logrīka pārdēvēšana vai dzēšana.** Pieprasiet "pārdēvē logrīku Ieņēmumi par Pārdošana" vai "izdzēs logrīku Atvērtie pieteikumi". Diagrammas logrīka workflow pārņem arī jauno nosaukumu; izpildes logrīka workflow saglabā savu. Diagrammas logrīka dzēšana izdzēš arī tā workflow, tieši tāpat kā logrīka dzēšanas poga; izpildes logrīka workflow paliek. Chat dzēš tikai to logrīku, kuru skaidri pieprasījāt, un vispirms lūdz precizēt, ja jūsu vārdi atbilst vairākiem.
- **Sakārtošana.** Pieprasiet "sakārto Pārdošanas vadības paneli" vai "pievieno šos trīs logrīkus un sakārto". Chat sakārto redzamos logrīkus to secībā, tieši tāpat kā poga **Sakārtot**: nejaušas rindas pa diviem vai trim, tāpēc atkārtots pieprasījums sniedz citu izkārtojumu. Pieprasiet konkrētu skaitu rindā ("trīs rindā"), lai iegūtu šāda izmēra rindas. Tas sakārto vadības paneli programmā Heym; Heym Work saglabā savu lapas izkārtojumu, kuru maina pašas lapas poga **Sakārtot**.

Jauni logrīki tiek ievietoti zem vadības paneļa esošajiem logrīkiem un, tāpat kā jebkurš logrīks, darbojas vadības paneļa īpašnieka vārdā. Pievienošanai, pārdēvēšanai, dzēšanai un sakārtošanai nepieciešama rakstīšanas piekļuve vadības panelim. Jauna logrīka izveidei nepieciešama tērzēšana, kas spēj veidot workflowus: cilne Chat, Heym Work Chat redaktoriem un `heym_chat`.

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

## Grafiki un datubāzu diagrammas

Izvēlieties **Gantt** sadaļā Pievienot logrīku, lai parādītu uzdevumus laikā ar izpildes un atkarību saitēm, vai **Entity relationships (DB)**, lai kartētu tabulas, laukus un to attiecības. Abi tipi izmanto [Chart Output mezglu](../nodes/chart-output-node.md#gantt-schedules) un ir pieejami arī Heym Work lapās. Kad Work iesaka logrīkus grafikam vai datubāzes shēmai, tas ģenerē priekšskatījumus, pamatojoties uz ierosinātajiem uzdevumiem vai entītijām.
