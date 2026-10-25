# Izpildes vēsture

Izpildes vēsture reģistrē workflow izpildes: ievades, izvades, mezglu rezultātus, statusu un trigger avotu. Izmantojiet to, lai novērotu aktīvu produkcijas izpildi, pārbaudītu iepriekšējās izpildes, atkļūdotu kļūdas vai atkārtoti palaistu ar tādiem pašiem ievades datiem, izmantojot **Bring to Canvas**.

## Pārskats

Katra izpilde saglabā:

| Lauks | Apraksts |
|-------|-------------|
| **Inputs** | Pieprasījuma pamatteksts vai izpildes ievades (piem., `text` Ievades mezglam) |
| **Outputs** | Workflow līmeņa izvades |
| **Node results** | Katra mezgla izvades, statuss un izpildes laiks |
| **Status** | `success`, `error`, `pending`, `skipped` vai `failed` (skatiet [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Kā izpilde tika aktivizēta (skatiet [Triggers](./triggers.md)) |

## Piekļuve vēsturei

| Atrašanās vieta | Tvērums |
|----------|-------|
| **Editor** rīkjosla | Tikai pašreizējais workflow |
| **Docs** skata galvene | Tikai pašreizējais workflow |
| **Dashboard** galvene (Chat cilne) | Visi workflow + chat/assistant izpildes |
| **Evals** skata galvene | Visi workflow + chat/assistant izpildes |

Noklikšķiniet uz pogas **History** (pulksteņa ikona), lai atvērtu dialogu.

## Viena workflow vēsture pret visu vēsturi

- **Viena workflow** (Editor, Docs): Rāda izpildes workflow, kas ir atvērts. Izmantojiet **Clear history**, lai noņemtu tikai šī workflow izpildes.
- **All History** (Dashboard, Evals): Rāda izpildes visos workflow un chat/assistant sesijās. Tvērums atbilst workflow piekļuvei: workflow, kas pieder Jums, workflow, kas koplietoti ar Jums tieši, un workflow, kas koplietoti ar komandu, kurai Jūs piederat. Izmantojiet **Clear all history**, lai noņemtu visus Jums piederošos ierakstus. Koplietoto workflow vēsture tiks saglabāta.

## Bring to Canvas

**Bring to Canvas** ielādē atlasītās izpildes ievades un mezglu izvades pašreizējā workflow.

### Ko tas ielādē

- **Inputs** → Izpildes ievades panelis (piem., `text` Ievades mezglam vai pielāgoti lauki)
- **Node results** → Izpildes rezultātu panelis rāda iepriekšējās izvades katram mezglam
- **Execution result** → Statuss, izvades un izpildes laiks no izpildes

### Uzvedība atkarībā no konteksta

- **Editor** (viena workflow vēsture): Piemēro nekavējoties atvērtajam workflow un aizver dialogu.
- **No All History** (Dashboard/Evals): Pārvieto uz workflow redaktoru, pēc tam piemēro datus, kad redaktors ielādējas. Pieejams tikai workflow izpildēm — nevis chat/assistant izpildēm.

### Izpildes deep link

Atverot workflow vietnē `/workflows/{workflowId}/{executionId}`, šī izpilde tiek automātiski ielādēta kanvā — tāpat kā atlasot izpildi un izvēloties **Bring to Canvas**. Tas ļauj konkrētu iepriekšēju izpildi kopīgot kā URL. Ja izpilde nav atrodama (nepareizs vai dzēsts id), redaktors atgriežas pie parastā workflow ielādes.

### Lietošanas gadījumi

- Atkārtoti palaist workflow ar tādiem pašiem ievades datiem
- Atkļūdot neveiksmīgu izpildi, pārbaudot ievades un mezglu izvades
- Salīdzināt izvades starp izpildēm

## Jautāt AI

Abos vēstures dialoglodziņos blakus nosaukumam ir poga **Jautāt AI** (dzirksteles ikona). Tā atver [cilni Chat](../tabs/chat-tab.md#asking-about-a-run) jaunā sarunā ar pievienotu workflow un atlasīto izpildi kā noņemamiem čipiem. Pajautājiet, kāpēc izpilde bija lēna, kas neizdevās, vai lūdziet Chat salabot workflow. Chat nolasa tieši šo izpildi, ieskaitot tās izsekošanu un kļūdas pa mezgliem.

Dialoglodziņā All History **Jautāt AI** parādās tikai tad, kad ir atlasīta workflow izpilde; tērzēšanas un asistenta izpildes to nerāda.

## Izpildes laika skala

Izpildes detaļās poga **Laika skala** (hronometra ikona) blakus **Izvērst visu** aizstāj sarakstu **Soļi** ar laidumu laika skalu. Kamēr laika skala ir redzama, tā pati poga rāda **Žurnāli**; noklikšķiniet uz tās, lai atgrieztos sarakstā. All History poga parādās tikai workflow izpildēm. Laika skala zīmē joslu katram mezglam brīdī, kad tas sākās, lai jūs redzētu, kurš mezgls cik ilgi darbojās un kuri izpildījās paralēli. Virziet kursoru virs joslas, lai redzētu ilgumu; noklikšķiniet, lai atvērtu to pašu detaļu inspektoru kā redaktora [izpildes laika skalā](#execution-timeline-details). Izvēlētais skats paliek aktīvs, kamēr dialoglodziņš ir atvērts.

Izpildes, kas reģistrētas pirms mezglu sākuma laiku saglabāšanas, tiek izkārtotas viena pēc otras pēc ilguma.

## Execution Highlights

Pēc tiešsaistes izpildes — vai pēc **Bring to Canvas** — **Canvas augšējā labajā stūrī** parādās aizverams **Execution Highlights** uznirstošais logs. Tas ir ātrs veids, kā redzēt, *ko katrs mezgls producēja*, uzskaitīts no augšas uz leju izpildes secībā. Aizveriet to ar **✕**; tas atkārtoti parādīsies nākamajā izpildē.

### Kas tiek rādīts

| Ieraksts | Avots | Automātiski? |
|--------|--------|-------|
| **Input** | Izpildes ievades parametri (input/trigger mezgls) | Jā |
| **Output** | Izvades mezgla rezultāts — vai, ja tāda nav, pēdējā mezgla ziņojums | Jā |
| **Agent / LLM** | Katra agent vai LLM mezgla izvade | Jā |
| **Output** | Jebkurš cits mezgls ar iespējotu **Highlight Node Output** | Pēc izvēles |

Mezgli, kas jau tiek automātiski izcelti (input / output / last / agent / llm), nekad neparādās divreiz, pat ja iespējojat slēdzi.

### Katrs ieraksts

- Rāda `Node — message…` ar pirmajām **250 rakstzīmēm**; noklikšķiniet uz rindas, lai to izvērstu un attēlotu **pilnu ziņojumu kā Markdown**, ar pogu **Copy**.
- Mezgls, kas izpildījās vairākas reizes (piem., cilpā), rāda `Node (N)` ar selektoru `‹ i / N ›` — izvēlieties, kuru izpildi skatīt; katra mezgla selektors ir neatkarīgs.

### Highlight Node Output

Katram mezglam **izņemot Agent un LLM** ir izvēles rūtiņa **Highlight Node Output** tā rekvizītu panelī (pēc noklusējuma izslēgta). Iespējojiet to, lai pievienotu šī mezgla izvadi uznirstošajam logam. Uz kanvas izceltajiem mezgliem parādās neliela ✦ nozīmīte. [workflow DSL](./expression-dsl.md) tas ir mezgla datu lauks `"highlight": true` (pēc noklusējuma `false`).

### Informācijas paneļos

Dashboard logrīku kartītēs, kas izpildīja workflow, kartītes galvenē parādās poga ✦ **Execution highlights**; noklikšķiniet uz tās, lai atvērtu to pašu uznirstošo logu šī logrīka izpildei, ar logrīka uzzīmēto izvadi kā izcelto ierakstu.
## Izpildes darbības laikā

Abi vēstures dialogi saraksta augšdaļā pirms iepriekšējām izpildēm rāda **pašlaik notiekošās izpildes**.

- Blakus sākuma laikam parādās rotējošs indikators un apzīmējums **Running**
- Noklikšķiniet uz **Open live**, lai pievienotu redaktoru tieši šai izpildei, to nepārstartējot
- Kanva vispirms atjauno jau pabeigtos mezglus, pēc tam saņem
  `node_start`, `node_complete` un noslēguma izpildes notikumus pa SSE
- Pašreizējais mezgls kanvā pulsē, lejupstraumes mezgli saglabā savu gaidošo animāciju, un
  Debug panelis pievieno katru rezultātu tā saņemšanas brīdī—tieši tāpat kā no redaktora palaista izpilde
- Noklikšķiniet uz **Cancel**, lai nekavējoties apturētu izpildi
- Atcelšana no jebkura dialoga (Editor vai Dashboard) arī aizver aktīvo SSE straumi jebkurā atvērtā kanvas cilnē šim workflow, tāpēc redaktora stāvoklis tiek korekti atiestatīts
- Pēc atcelšanas notiekošais ieraksts pazūd nākamajā atjaunināšanas reizē; nospiediet **Refresh**, lai sarakstu atjauninātu manuāli
- Ja atceļat jau pabeigtu izpildi, pieprasījums tiek ignorēts

Tiešraides URL ir `/workflows/{workflowId}/{executionId}`. Novērotājs ir tikai lasīšanas režīmā: redaktora
aizvēršana tikai atvieno šo pārlūka cilni un nekad neaptur workflow. Aktīvie momentuzņēmumi
tiek koplietoti caur PostgreSQL, tāpēc izpildes atvēršana joprojām darbojas, ja trigger un redaktora
pieprasījums nonāk pie dažādiem aizmugursistēmas darbiniekiem.

## Avārijas atkopšana

Ja serveris restartējas (izvietošana, konteinera restarts vai avārija) workflow darbības laikā, šīs izpildes darbinieks apstājas izpildes vidū. Heym automātiski atgūst šīs pārtrauktās izpildes, nevis atstāj tās iestrēgušas statusā **Running**.

- Nākamajā palaišanas reizē ievēlētais līdera process atklāj bāreņos nonākušās izpildes — uzreiz pie saudzīga restarta vai ~60 sekunžu laikā pie smagas avārijas (tiklīdz sirdspuksti skaidri apstājas).
- Atgūtās izpildes tiek **palaistas no jauna no sākuma ar tiem pašiem ievadiem** (nevis atsāktas no vietas, kur tās apstājās), izmantojot pašreizējo workflow definīciju. Pabeidzot tās ieraksta parastu noslēguma ierakstu (piem., `success`), tāpēc vēsturē izpilde parādās kā pabeigta.
- Izpilde tiek mēģināta atkārtoti **vienu reizi**. Ja arī atkopšanas mēģinājums tiek pārtraukts — vai workflow kopš tā laika ir dzēsts — ieraksts tiek saglabāts kā `failed`.
- Tas darbojas vienādi gan viena konteinera, gan vairāku darbinieku izvietojumos; tikai līderis veic atkopšanu, tāpēc izpilde nekad netiek atgūta divreiz no dažādiem darbiniekiem.

### Automātiskās atkopšanas pārslēgs

Redaktora **Execution Log** (izpildes) panelī ir izvēles rūtiņa **Auto-recover**, kas **pēc noklusējuma ir ieslēgta** katram workflow.

- **Ieslēgts**: šī workflow pārtrauktās izpildes tiek palaistas no jauna, kā aprakstīts iepriekš.
- **Izslēgts**: pārtrauktās izpildes netiek palaistas no jauna un tiek ierakstītas ar statusu `skipped`.

> Apakš-workflow izpildes netiek atgūtas neatkarīgi — tās tiek atkārtoti virzītas ar to atgūto vecākizpildi. Trigger ar savu atkārtotu piegādi (RabbitMQ, scheduled/cron, IMAP) var arī atkārtoti piegādāt pēc restarta, tāpēc atgūta izpilde reizēm var izpildīties divreiz.

## Gaidoša cilvēka pārbaude

Izpildes, kas tiek apturētas [Human-in-the-Loop](./human-in-the-loop.md) apstiprinājumam, tiek nekavējoties ierakstītas vēsturē ar statusu `pending`.

- Gaidošais aģenta mezgls saglabā pārbaudes payload, tostarp `reviewUrl`, `draftText` un `expiresAt`
- Jebkuri mezgli, kas savienoti ar aģenta `review` rokturi, arī var darboties pirms cilvēks atbild, un to mezglu rezultāti tiek saglabāti tajā pašā gaidošajā vēstures ierakstā
- Vēstures dialogi rāda pārbaudes saiti, lai īpašnieki to varētu nokopēt vai atvērt
- Vēstures dialogi un redaktora Debug panelis rāda galīgo cilvēka lēmumu pēc izpildes atsākšanas
- Kad pārbaudītājs pieņem, rediģē vai noraida melnrakstu, tas pats vēstures ieraksts tiek atjaunināts ar galīgo izpildes rezultātu
- Ja tā pati izpilde tiek apturēta HITL vairāk nekā vienu reizi, vēstures ieraksts paliek nemainīgs, kamēr katrs kontrolpunkts iegūst savu vienreizējo pārbaudes saiti

Tas ir īpaši noderīgi portāla izpildēm un ilgstošiem workflow, kas var gaidīt stundas vai dienas pirms turpināšanas.

## Kopēšana

Izmantojiet **Copy** blakus Inputs vai Outputs, lai nokopētu JSON starpliktuvē.

## Vēstures notīrīšana

- **Katram workflow atsevišķi**: Redaktora vēstures dialogā noklikšķiniet uz **Clear history**, lai noņemtu pašreizējā workflow izpildes.
- **Visa vēsture**: Dashboard/Evals vēstures dialogā noklikšķiniet uz **Clear all history**, lai noņemtu visus jums piederošos izpildes ierakstus. Koplietoto workflow izpildes tiek saglabātas. Šo darbību nevar atsaukt.

## Izpildes laika skalas detaļas

Kad redaktora **Execution Log** ir atvērts, noklikšķiniet uz taimera pogas, lai parādītu izpildes laika skalu. Atlasiet posmu, lai atvērtu iekļauto detaļu inspektoru, kas pārņem rindu apgabalu. Tas rāda atlasītā soļa statusu, ilgumu, mēģinājumu skaitu, atkārtotu mēģinājumu informāciju, kļūdas, trace ID un kompaktu izvades priekšskatījumu. Objektu un masīvu izvades izmanto to pašu `JsonTree` skatītāju kā pārējais Debug panelis; skalārās vērtības izmanto teksta priekšskatījumu. Kad solis izvada attēlus (Playwright ekrānuzņēmumi, ģenerētie attēli, attēlu faili vai base64 attēli pieprasījuma pamattekstā, kas atrasti jebkur izvadē), tie parādās kā sīktēli virs izvades, un JSON rāda īsu aizvietotāju neapstrādātā base64 vietā. Noklikšķiniet uz sīktēla, lai to atvērtu lightbox; bultiņu pogas vai ←/→ taustiņi pārvieto pa katru attēlu izpildē, ar skaitītāju, piemēram, `2 / 5`. Izmantojiet **Open trace** LLM un Agent posmiem, kad ir pieejams trace ID.
## Mobilā mezgla informācija

Tālrunī redaktors pilnekrāna režīmā parāda workflow koku, nevis brīvās formas kanvu. Pieskarieties koka mezglam ar ierakstītu rezultātu, lai tā izpildi atvērtu kā pilnekrāna informāciju. Skatā ir pieejamas atsevišķas cilnes **Input Data**, **Output Data** un **Errors**. Izvades cilne parāda ierakstīto rezultātu un piedāvā **Copy Output**; ievades cilne parāda atlasītā mezgla konfigurāciju, bet kļūdu cilne parāda ierakstīto kļūdu, ja mezgls neizdevās. Izmantojiet **Back to workflow** vai aizvēršanas pogu, lai atgrieztos pie koka.

Kanvas un dashboard vēstures dialogi saglabā to izpildes vadīklas vienā rindā un izvieto pieejamos tagu un instanču filtrus responsīvā režģī. To filtru izvēlnēs tiek izmantots tas pats lietotnē esošais atlasītājs, tāpēc atlasītajai atzīmei ir konsekventa mala un pamatne ar katru opcijas apzīmējumu.

## Saistītie

- [Triggers](./triggers.md) – Kā tiek palaisti workflow; vēsture ieraksta `trigger_source` (tostarp `board` palaidēm, kas sāktas ar [Board](../tabs/board-tab.md) kartīšu pārvietošanu un turpmākām darbībām)
- [Human-in-the-Loop](./human-in-the-loop.md) – Gaidošo pārskatīšanas URL un atsākšanas darbība
- [Edit History](./edit-history.md) – Versiju kontrole workflow saglabāšanai (atgriešana, diff)
- [Quick Start](../getting-started/quick-start.md) – Izveidojiet un palaidiet savu pirmo workflow
- [Workflows Tab](../tabs/workflows-tab.md) – Veidojiet un pārvaldiet workflow
