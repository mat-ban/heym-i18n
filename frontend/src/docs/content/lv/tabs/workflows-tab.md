# Workflows cilne

**Workflows** cilne ir noklusējuma informācijas panelis. Tā parāda Jūsu workflow sarakstu, mapju struktūru un ļauj Jums izveidot, rediģēt un organizēt workflows.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Skatīt Workflows demonstrāciju</a></p>

## Sākt sarunu

Pār workflow sarakstu ir čata lodziņš, kas sveicina Jūs pa vārdam un jautā, ko Jūs vēlaties automatizēt. Ievadiet prompt, pēc izvēles pievienojiet vienu failu un izvēlieties akreditācijas datus un modeli, ko vēlaties izmantot. Abi nolaižamie saraksti ir meklējami un sākas ar Jūsu [AI noklusējumiem](../reference/user-settings.md).

Sūtīšana izveido jaunu sarunu un atver to [Chat cilnē](./chat-tab.md), kur atbilde tiek straumēta. Atbalstītie pielikumi ir teksta faili, attēli un PDF faili, pa vienam ziņojumā, tāpat kā čata kompozitorā.

Ja Jums vēl nav LLM akreditācijas datu, lodziņš rāda saiti uz [Credentials cilni](./credentials-tab.md) un sūtīšana paliek atspējota.

Noklikšķiniet uz **x**, lai paslēptu lodziņu. Blakus Workflows virsrakstam parādās **Ask AI** poga, kas to atkal parāda. Izvēle tiek atcerēta Jūsu pārlūkprogrammā.

## Workflow saraksts

Saraksts ir divu paneļu skats: workflows un mapes pa kreisi, izvēlētā workflow priekšskatījums pa labi.

- Katrs rinda rāda workflow ikonu, nosaukumu, aprakstu, kad tas pēdējo reizi tika atjaunināts, un [statusa čipu](#workflow-status)
- Workflows var būt saknes līmenī vai iekš mapēm, un piespraustie workflows parādās savā **Pinned** grupā augšpusē
- **Noklikšķiniet** uz rindas, lai to izvēlētos un ielādētu tās priekšskatījumu labajā pusē
- **Divreiz noklikšķiniet** uz rindas vai nospiediet **Enter**, kamēr tā ir fokusā, lai to atvērtu [editorā](../getting-started/quick-start.md)
- Izmantojiet **Ctrl+klikšķi** (vai **Cmd+klikšķi**), lai atvērtu jaunā cilnē
- Katrs rinda satur tās rediģēšanas, kopēšanas, piespinšanas un dzēšanas darbības labajā pusē. Telefonos tās ir paslēptas, lai nosaukums saglabātu pilnu platumu; **ilgi nospiediet** rindā, lai atvērtu darbību sarakstu
- Piespraustie bieži izmantotie workflows [Quick Drawer](../reference/quick-drawer.md), lai Jūs varētu tos ātri palaist no Workflows cilnes un citām iekšējām lapām

## Workflow priekšskatījums

Izvēloties workflow, tiek aizpildīta priekšskatījuma paneļa blakus sarakstam. Ekrānos, kuru platums ir mazāks par 1280px, tas pats panelis atveras kā lapa no ekrāna apakšas.

Panelis rāda:

- Workflow nosaukumu, kurš to izveidojis un kad, un kad tas pēdējo reizi tika rediģēts
- **Atvērt Workflow** – atver workflow editorā
- **Izpildīt tagad** – atver workflow [Quick Drawer](../reference/quick-drawer.md), kur Jūs aizpildāt tā ievades un uzsākat izpildi, nepametot sarakstu
- **Apraksts** – workflow apraksts
- **Trigger konfigurācija** – grafiks cron workflow vai klausīšanās triggers notikumu workflow. Workflows, kas tiek izsaukti pa HTTP, rāda **Copy cURL** pogu, nevis neapstrādātu endpoint un autentifikācijas tekstu: tas kopē pilnu pieprasījumu ar pareizo URL, galvenēm, autentifikācijas vietturi un ķermeni, kas izveidots no workflow ievades laukiem. Kad workflow publicē [portal](../reference/portal.md), tā publiskā čata saite parādās arī šeit
- **Pēdējās izpildes detaļas** – rezultāts un ilgums pēdējai izpildei vai piezīme, ka workflow nekad nav izpildīts
- **Workflow soļi un apakšģentiem** – mezgli izpildes secībā, katram ar savu modeli, operāciju vai grafiku un punkts, kas rāda, vai tas ir aktīvs. Izvēloties soli, tiek atvērts šis mezgls editorā ar tā īpašību paneli jau atvērtu

Panelis paliek piesprausts blakus sarakstam, kamēr Jūs ritināt, tādējādi tas paliek lasāms garā workflow sarakstā.
## Instance Administration

Konti, kas norādīti `HEYM_ADMIN_EMAILS`, var uzskaitīt, atvērt, rediģēt, pārbaudīt izpildes vēsturi un dzēst jebkuru workflow instancē bez dalīšanās vai īpašuma pārsūtīšanas. Iestatījums ir komatu atdalīts e-pastu saraksts, kas tiek salīdzināts bez lielo un mazo burtu atšķirības. Tukšs saraksts nepiešķir nevienam šo piekļuvi. Pēc izmaiņu veikšanas restartējiet backend.

Administratori redz īpašnieka e-pastu workflow sarakstā un var meklēt pēc šīs adreses. Izvēlieties workflow, lai atvērtu **Instance administration** tā priekšskatījumā:

1. **Pause triggers** tiek rādīts tikai workflow, kas satur Cron mezglu. Tas atspējo workflow Cron un citus automātiskos trigger mezglus, izmantojot parastu versiju saglabāšanu. Esošās izpildes var pabeigt. Manuālas, API, portāla un apakš-workflow izsaukumi paliek pieejami; šī darbība nav workflow līmeņa izpildes bloķēšana.
2. Poga mainās uz **Resume triggers**, kamēr tā ir apturēta, tostarp pēc lapas pārlādēšanas. Resume atkārtoti aktivizē administratora apturētos triggerus un atstāj nemainītus jau atspējotos triggerus. Vecākiem apturētiem workflow bez saglabātas administratora apturēšanas stāvokļa Resume aktivizē to automātiskos triggerus.
3. Izmantojiet workflow rindiņas **Delete workflow** darbību, kad izpildes ir noslēgušās. Dzēšana atgriež konfliktu, kamēr darbojas, ir rindā vai gaida pārskatīšanu. Plānotā dzēšana piemēro to pašu pārbaudi.

Apturiet triggerus un ļaujiet esošajām izpildēm pabeigties pirms dzēšanas. Triggeris, kas jau ir nosūtīts, kad tas ir apturēts, joprojām var pabeigties. Izmantojiet dzēšanu, kad workflow vairs nedrīkst būt izsaucams.

Īpašnieka tikai webhook slepenie un autentifikācijas iestatījumi saglabā esošās aizsardzības. Administrācija nepārsūta īpašumtiesības vai dalās ar īpašnieka akreditācijas datu ierakstiem. Administratīvās apturēšanas, atsākšanas, dzēšanas un plānošanas darbības parādās [audit trail](../reference/audit.md) ar rīkojošo administratoru un workflow īpašnieku.

## Workflow Status

Katra rinda satur statusa čipu, kas iegūts no workflow trigger mezgliem, tā aktīvās izpildes stāvokļa un — workflow bez trigger mezgla gadījumā — kā tā pēdējā izpilde tika uzsākta:

| Status | Nozīme |
| --- | --- |
| **Running** | Workflow šobrīd ir izpilde |
| **Scheduled** | Tam ir aktīvs [cron](../nodes/cron-node.md) triggers |
| **Listening** | Tam ir aktīvs notikumu triggers, piemēram, Slack, Telegram, IMAP vai WebSocket triggers |
| **Paused** | Tam ir trigger mezgli, bet visi no tiem ir deaktivizēti |
| **API** | Tam nav trigger mezglu un tas pēdējo reizi tika izpildīts, veicot HTTP izsaukumu uz tā izpildes endpoint |
| **SubWorker** | Tam nav trigger mezglu un tas pēdējo reizi tika izpildīts kā apakš-workflow no vecāka workflow |
| **Portal** | Tam nav trigger mezglu un tas pēdējo reizi tika izpildīts no tā [portal](../reference/portal.md) |
| **WEB** | Tam nav trigger mezglu un tā vienīgais termināls ir [HTML output mapper](../nodes/html-output-mapper-node.md), tāpēc izsaukums atgriež renderētu tīmekļa lapu |
| **Manual** | Tam nav trigger mezglu un tas nekad nav ticis izpildīts, vai tā pēdējā izpilde nāk no citas vietas |
| **Remove Scheduled** | Tas ir [plānots dzēšanai](../reference/workflow-organization.md) |

API, SubWorker un Portal čipi lasa vienīgo pēdējo ierakstu workflow [izpildes vēsturē](./logs-tab.md), tāpēc workflow, kas tiek izsaukts divos veidos, parāda to, kas notika pēdējais. **WEB** tiek noteikts no grafika, tāpēc tas ir prioritārs pār šiem trim: lapu apkalpojošs workflow lasa WEB pat pēc tam, kad tas ir izsaukts caur HTTP. Trigger mezgli vienmēr uzvar pār visiem: cron workflow, ko kāds arī izsauc caur HTTP, paliek **Scheduled**.

Izmantojiet **Status** nolaižamo sarakstu blakus meklēšanas laukam, lai rādītu tikai vienu statusu. Nolaižamais saraksts uzskaita, cik daudz workflow pašlaik atbilst katram. Statusa filtrs arī sasniedz iekšējos mapēs: mapes ar atbilstību tiek automātiski paplašinātas, un mapes bez atbilstības tiek paslēptas, līdz filtrs tiek notīrīts.

## Active Workflows

Datorā apļa insignija augšējā rīkjoslā rāda, cik daudz workflow pašlaik darbojas, un automātiski atsvaidzina ik pēc 10 sekundēm. Noklikšķiniet uz nenulles insignijas, lai atvērtu aktīvo workflow sarakstu, kas rāda līdz četrām rindām pirms ritināšanas. Izvēlieties workflow nosaukumu, lai pievienotu redaktoru šīs izpildes tiešraides skatam. Nulles insignija ir informatīva un to nevar atvērt, un insignija ir paslēpta mobilajās ierīcēs.

## Search

Izmantojiet workflow meklēšanas lauku blakus **Status**, vai nospiediet **Ctrl+F** (vai **Cmd+F**), lai filtrētu workflow pēc nosaukuma vai apraksta. Atbilstošie workflow iekš mapēm tiek rādīti ar paplašinātām to mapju zarām. Nospiediet **Escape**, lai notīrītu meklēšanu.
## Mapes

- Organizējiet workflows [mapēs un apakšmapēs](../reference/workflow-organization.md).
- Izveidojiet mapes, izmantojot pogu **Jauna mape**, piešķirot katrai nosaukumu un opciju aprakstu, kas tiek rādīts zem tās nosaukuma sarakstā.
- Katras mapes rinda parāda, cik daudz workflows tā satur, ieskaitot apakšmapes, kā arī tās jauno apakšmapi, pārdēvēšanu, ikonas maiņu, lejupielādi kā ZIP un dzēšanas darbības. Mobilajās ierīcēs rinda rāda tikai vienu izvēlnes pogu.
- Velciet workflow virs mapes vai apakšmapes, lai redzētu kartes izmēra galamērķa priekšskatījumu. Izceltajā priekšskatījumā tiek parādīts pilns mapes ceļš pirms izmešanas, un, pārvietojoties virs saraksta, īslaicīgi tiek paplašināta sabrukusi mape, lai varētu piekļūt iegultajām mapēm.
- Velciet workflows starp mapēm vai uz saknes. Velkamā karte paliek redzama kā spoks, un aktīvais galamērķis paliek izcelts, kamēr ritināt.
- Velkot workflow atpakaļ tās pašreizējā mapē, tas ir atspējots un atzīmēts kā **Jau mapē**.
- Pārdēvējiet mapi vai mainiet tās aprakstu, izmantojot tās pārdēvēšanas darbību vai ar peles labo pogu konteksta izvēlni.

## Workflows izveide

1. Noklikšķiniet uz **Jauns Workflow**.
2. Ievadiet nosaukumu un opciju aprakstu.
3. Workflow atveras redaktorā.

## Importēšana

Velciet un nometiet JSON workflow failu uz workflow zonas, lai izveidotu jaunu workflow. Importētie mezgli un malas tiek izmantoti, lai izveidotu workflow; nosaukums nāk no `name` lauka JSON vai faila nosaukuma. Skatiet [Lejupielādēt un importēt](../reference/download-import.md) JSON formātam un importēšanas opcijām.

## Koplietošana

Atveriet workflow redaktorā un noklikšķiniet uz **Koplietot**, lai aicinātu lietotājus pa e-pastu vai koplietotu ar [komandu](./teams-tab.md). Izvēlieties **Lasīt** (skatīt un izpildīt) vai **Rakstīt** (arī rediģēt) katram lietotājam vai komandai, un vēlāk to var mainīt no nolaižamās izvēlnes blakus ierakstam. Akreditācijas dati un apakš-workflows automātiski netiek koplietoti; koplietojiet tos atsevišķi ar tiem pašiem lietotājiem vai komandām. Skatiet [Workflow organizācija](../reference/workflow-organization.md#sharing-workflows) un [Akreditāciju koplietošana](../reference/credentials-sharing.md).

## Rediģēšana un dzēšana

- **Rediģēt** – Mainiet workflow nosaukumu un aprakstu no rindiņas rediģēšanas darbības.
- **Dzēst** – Workflows tiek [plānoti dzēšanai](../reference/workflow-organization.md); tie pārvietojas uz atkritumu zonu pirms pastāvīgas noņemšanas.

## Vienlaicīgas rediģēšanas

Saglabāšana nosūta revīziju, uz kuras balstās Jūsu izmaiņas, un serveris noraida rakstīšanu, ja workflow ir mainījies šajā laikā — piemēram, ja komandas biedrs to ir saglabājis vai Jūs esat atstājis to pašu workflow atvērtu otrajā cilnē. Heym tad parāda dialogu **Atklāts novecojis workflow**, piedāvājot divas izvēles:

- **Atcelt** – Saglabā Jūsu nesaglabātās izmaiņas redaktorā, lai Jūs varētu tās atkārtoti ielādēt citā cilnē un salāgot.
- **Aizvietot** – Saglabā tomēr, aizstājot otras personas versiju.

**Izpildot** workflow, tas vispirms tiek saglabāts, tāpēc tas iet cauri tai pašai pārbaudei. Ja workflow ir mainījies Jūsu priekšā, izpilde apstājas dialogā, nevis klusi pārraksta: **Aizvietot un izpildīt** saglabā Jūsu versiju un sāk izpildi, **Atcelt izpildi** pamet abus un atstāj Jūsu izmaiņas neskartas.

Pārbaude ir daļa no paša saglabāšanas pieprasījuma, tāpēc tā neprasa papildu ceļojumu, un nav loga, kurā saglabāšana varētu izslīdēt. Jūsu pašu izmaiņas no citām lietotnes daļām — pārdēvēšana, iestatījumu maiņa, īpašību paneļa pārslēgšana — nekad netiek uzskatītas par konfliktu.

## Komandu palete

Noklikšķiniet uz **Ctrl+K** (vai **Cmd+K**), lai atvērtu komandu paleti. Jūs varat:
- Meklēt workflows pēc nosaukuma.
- Pārlēkt uz jebkuru [informācijas paneli](./credentials-tab.md).
- Atvērt nesenos workflows.

## Saistītie

- [Ātrā uzsākšana](../getting-started/quick-start.md) – Izveidojiet savu pirmo workflow.
- [Workflow organizācija](../reference/workflow-organization.md) – Mapes, apakšmapes un plānotā dzēšana.
- [Workflow struktūra](../reference/workflow-structure.md) – JSON formāts workflows.
- [Lejupielādēt un importēt](../reference/download-import.md) – Eksportēt un importēt workflows kā JSON.
- [Portāls](../reference/portal.md) – Izvietot workflows kā publiskas čata UI.
- [Board](./board-tab.md) – Izpildīt workflows no kanban kartēm caur kolonnas ķēdēm.
- [Pamatjēdzieni](../getting-started/core-concepts.md) – Workflows, mezgli un izpilde.
- [Izpildes vēsture](../reference/execution-history.md) – Skatīt iepriekšējās izpildes un pārvietot uz Kanvu.
- [Ātrā atvilktne](../reference/quick-drawer.md) – Piestiprināt un izpildīt workflows no informācijas paneļa, dokumentiem un citām ne-redaktora lapām.
- [Konteksta demonstrācija](../reference/contextual-showcase.md) – Īsa lapas rokasgrāmata informācijas paneļa virsmām.
