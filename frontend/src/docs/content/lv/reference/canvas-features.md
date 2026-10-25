# Kanvas funkcijas

Workflow redaktors nodrošina vairākas funkcijas atkļūdošanai, testēšanai un mezglu organizēšanai: **Palaist līdz mezglam**, **AI mezglā**, **Datu piespraušana**, **Izpildes žurnāli**, **Iespējot/Atspējot** un **Izvilkt apakš-workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Skatīties redaktora demonstrāciju</a></p>

## Palaist līdz mezglam

Novietojiet kursoru uz jebkura mezgla, izņemot piezīmju lapiņu, un noklikšķiniet uz **Run** zem tā. Heym izpilda šo mezglu un tā augšupējās atkarības, atstājot lejupējos mezglus un nesaistītus zarus neskartus. Tiek izmantots kanvas testa režīms, ieskaitot piespraustos izvades datus un workflow parastos zaru nosacījumus.

Ja atlasītajā ceļā ir ievades lauki, labajā pusē atveras **Run** panelis un fokuss tiek novirzīts uz pirmo lauku. Ievadiet vērtības, pēc tam noklikšķiniet uz **Run to _mezgla nosaukums_** vai nospiediet **Ctrl+Enter** (macOS — Cmd+Enter). Vispārīgā body režīmā fokuss tiek novirzīts uz JSON body redaktoru. Ceļi bez ievades laukiem tiek palaisti nekavējoties, neatverot paneli. Piespraustie Input mezgli atkārtoti izmanto savu piesprausto izvadi, neprasot ievadi.

Panelis saglabā atlasīto mērķi nākamajām palaišanas reizēm. Izvēlieties **Run full workflow**, lai notīrītu mērķi. Palaišanas pogas ir atspējotas, kamēr notiek izpilde. Mērķis cilpas iekšienē pārtrauc palaišanu, tiklīdz šis mezgls tiek sasniegts pirmo reizi; atlasot mezglu aiz cilpas, tiek palaista visa augšupējā cilpa.

## AI mezglā

Virziet kursoru virs jebkura mezgla, izņemot piezīmju lapiņu, un noklikšķiniet uz **AI** virs tā. [AI Assistant](./ai-assistant.md) atveras uz šī mezgla un piedāvā **Change this node as ...**, **Fix error in this node ...** un **Other**. Agent režīmā asistents maina tikai šo mezglu; citi mezgli, savienojumi un izkārtojums paliek nemainīgi. Skatiet [AI Assistant › Viena mezgla modificēšana](./ai-assistant.md#changing-one-node).

Poga ir paslēpta workflowos, kuriem jums ir tikai skatīšanas tiesības.

## Datu piespraušana

Datu piespraušana ļauj piespraust mezgla izvadi no pēdējās palaišanas reizes, lai varētu testēt lejupējos mezglus, atkārtoti neizpildot piesprausto mezglu.

### Kur to atrast

- **Rekvizītu panelis** – Atlasiet mezglu un ritiniet līdz sadaļai **Pinned Data**
- **Mezgla nozīmīte** – Kad dati ir piesprausti, uz mezgla parādās piespraudes ikona

### Darbības

| Darbība | Apraksts |
|--------|-------------|
| **Pin** | Piesprauž mezgla pēdējās izpildes izvadi (pieejama pēc palaišanas) |
| **Clear** | Noņem piespraustos datus |
| **Edit** | Rediģējiet piesprausto JSON tieši; noklikšķiniet uz Save, lai piemērotu |

### Uzvedība testa režīmā

Palaižot workflow testa režīmā, mezgli ar `pinnedData` izlaiž izpildi un tā vietā izmanto piesprausto izvadi. Izmantojiet to, lai:

- Testētu lejupējo loģiku, neizsaucot ārējos API
- Atkļūdotu izteiksmes, kas atsaucas uz mezgla izvadi
- Pilnveidotu promptus vai nosacījumus ar fiksētiem parauga datiem

Izteiksmju pabeigšana redaktorā izmanto piespraustos datus, ja tie ir pieejami, lai ieteiktu laukus.

## Izpildes žurnāli

**Debug panelis** (apakšējā atvilktne) rāda reāllaika izpildes žurnālus workflow palaišanas laikā. Varat arī atvērt aktīvu produkcijas izpildi no History dialoga vai Board kartītes. Redaktors pievienojas šīs izpildes SSE straumei, atjauno pabeigto mezglu rezultātus un turpina rādīt mezglu animācijas un žurnālus, kad sāk un beidz darboties jauni mezgli.

### Ko tas rāda

- **Mezglu rezultāti** – Katra mezgla statuss (`success`, `error`, `skipped`, `running`), izpildes laiks un izvade
- **Galīgās izvades** – Apkopotās izvades no [Output](../nodes/output-node.md) mezgliem
- **Agenta progress** – [Agent](../nodes/agent-node.md) mezgliem — soli pa solim rīku izsaukumi un spriešana

### Darbības

- **Copy as JSON** – Kopēt pilnu izpildes žurnālu starpliktuvē
- **Open in JSON editor** – Atvērt žurnālu JSON Hero vai JSON Editor Online pārbaudei
- **Download generated files** – Ja prasme ir ģenerējusi lejupielādējamus failus (`_generated_files`), parādās poga Download. Viens fails tiek lejupielādēts tieši; vairāki faili atver atlases uznirstošo logu.

### Atšķirība no Logs cilnes

Debug panelis rāda **workflow izpildes** žurnālus (mezglu rezultātus, izvades). [Logs cilne](../tabs/logs-tab.md) rāda **Docker konteinera** žurnālus (backend, frontend, database). <!-- pragma: allowlist secret -->

## Iespējot / Atspējot

Varat atspējot mezglus, lai tie tiktu izlaisti izpildes laikā. Atspējotiem mezgliem parādās "off" nozīmīte, un tie tiek attēloti blāvāk.

### Kā pārslēgt

| Metode | Apraksts |
|--------|-------------|
| **Rekvizītu panelis** | Atlasiet mezglu → Power ikona (augšējā labajā stūrī) |
| **Konteksta izvēlne** | Ar peles labo pogu noklikšķiniet uz mezgla(-iem) → Disable vai Enable |
| **Tastatūra** | Atlasiet mezglu(-us) → nospiediet **D** (skatiet [Tastatūras saīsnes](./keyboard-shortcuts.md)) |

### Vairāku atlase

Kad ir atlasīti vairāki mezgli, Iespējot/Atspējot tiek piemērots visiem. Konteksta izvēlne rāda "Enable", ja kāds no atlasītajiem mezgliem ir atspējots, un "Disable", ja visi ir iespējoti.

### Uzvedība izpildes laikā

Mezgli ar `active: false` tiek izlaisti. Lejupējie mezgli nesaņem datus no izlaistajiem mezgliem. Izmantojiet to, lai īslaicīgi izslēgtu mezglus, tos nedzēšot.

Lai ieslēgtu vai izslēgtu mezglu no workflow iekšienes, nevis manuāli, izmantojiet [Disable Node](../nodes/disable-node.md) un [Enable Node](../nodes/enable-node.md).
## Aģenta atmiņas grafs

[Agent](../nodes/agent-node.md) mezgli ar iespējotu **[persistento atmiņu](./agent-persistent-memory.md)** rāda rozā **smadzeņu** vadīklu uz mezgla. Noklikšķiniet uz tās, lai atvērtu atmiņas grafa redaktoru: entītijas tiek attēlotas kā animēts, spēka virzīts grafs, kas sagrupēts pēc entītijas tipa, ar meklējamiem Source/Target atlasītājiem saistību pievienošanai un savienojumu paneli pārlēkšanai starp saistītajām entītijām. Tajā pašā dialogā ir iekļauts **Share memory with other agents** (workflow → agent → read or read/write) [starp-aģentu atmiņas koplietošanai](./agent-persistent-memory.md#sharing-with-other-agents). Kamēr dialogs ir atvērts, galvenās kanvas undo/redo tiek atlikts, lai grafa rediģēšana saglabātu savu vēsturi.

**Grafa filtrēšana.** Kanvas augšējā kreisajā stūrī ir meklēšanas vadīkla, kas ir sakļauta līdz saīsnes pogai, līdz noklikšķināt uz tās vai nospiežat **Ctrl/Cmd+F**. Tā atbilst entītijas nosaukumam, tās tipam un katram atribūta atslēgai un vērtībai, kā arī saistības tipam (`parent_of`) un tās īpašībām; atbilstoša saistība līdzi ņem abas tās entītijas. Visiem ar atstarpēm atdalītajiem terminiem ir jāatbilst. Atbilstoša entītija līdzi ņem visu savu apkārtni — katru saistību, kurā tā piedalās, un entītiju katrā saistības otrā galā —, tāpēc atbilstība nekad netiek atstāta kā nesaistīts punkts. Atbilstoša saistība līdzi ņem tikai abas entītijas, ko tā savieno, un apstājas tur, jo saistības tipa meklēšana ir jautājums par šo saistību, nevis par visu, kam tās gali ir piesaistīti. Viss pārējais tiek pilnībā paslēpts — nevis izbalināts — kanvā un **All edges** sarakstā, un emblēma rāda, cik no kopējā entītiju skaita ir palicis. **✕** lodziņā vispirms notīra vaicājumu, pēc tam ar otru nospiedienu aizver lodziņu. Escape atritina tāpat, no iekšpuses uz āru: vispirms notīra vaicājumu, pēc tam aizver meklēšanas lodziņu, pēc tam atstāj paplašināto kanvas skatu un aizver dialogu tikai tad, kad neviens no tiem nav atvērts. Notīrīšana atjauno pilno grafu ar katru entītiju atpakaļ tur, kur tā bija.

**Entītiju izvietošana ar roku.** Velkot entītiju, tā tiek piesprausta tur, kur to nometat, tāpēc automātiskais izkārtojums nokārto pārējo grafu ap to, nevis velk to atpakaļ. Velkot atlasīto entītiju, līdzi pārvietojas tās tieši savienotās entītijas, saglabājot kopas formu; velkot jebkuru citu entītiju, pārvietojas tikai tā viena. **Tidy layout** (zizlīša pogа) atbrīvo katru piesprausto entītiju un atkārtoti palaiž automātisko izkārtojumu.

## Extract to Sub-Workflow

Pārvērš atlasītos mezglus atkārtoti lietojamā apakš-workflow un aizstāj tos ar [Execute](../nodes/execute-node.md) mezglu.

### Kā lietot

1. Atlasiet vienu vai vairākus mezglus kanvā
2. Ar peles labo pogu → **Extract to Sub-Workflow**
3. Ievadiet nosaukumu (un neobligātu aprakstu) jaunajam workflow
4. Noklikšķiniet uz **Extract**

### Kas notiek

- Tiek izveidots jauns workflow ar atlasītajiem mezgliem
- Ārējās ievades (šķautnes no ārpuses ārpus atlases) kļūst par apakš-workflow [Input](../nodes/input-node.md) laukiem
- Ārējās izvades (šķautnes uz mezgliem ārpus atlases) tiek kartētas uz apakš-workflow [Output](../nodes/output-node.md)
- Atlasītie mezgli tiek aizstāti ar vienu [Execute](../nodes/execute-node.md) mezglu, kas izsauc jauno workflow
- Ievades/izvades kartējumi tiek saglabāti automātiski

### Lietošanas gadījumi

- Atkārtoti izmantot mezglu secību vairākos workflow
- Vienkāršot sarežģītu workflow, grupējot saistīto loģiku
- Veidot modulārus, testējamus apakš-workflow

## Run with cURL

Poga **cURL** redaktora rīkjoslā (augšējā labajā stūrī) atver dialogu, lai izveidotu un nokopētu cURL komandu workflow izsaukšanai caur API.

- Izvēlieties workflow pieprasījuma pamatteksta režīmu (`Defined` vai `Generic`)
- Iestatiet autentifikācijas tipu (Anonymous, JWT vai Header Auth)
- Konfigurējiet atbilžu kešatmiņu un ātruma ierobežošanu
- Pārslēdziet SSE straumēšanu un pielāgojiet katram mezglam sākuma ziņojumus
- Rediģējiet pieprasījuma pamattekstu
- Režīmā Generic kanvas izpildes panelis izmanto to pašu neapstrādāto JSON pamattekstu kā cURL dialogs
- Noklikšķiniet uz **Copy cURL**, lai nokopētu gatavu izpildei paredzētu komandu

Skatiet [Webhooks](./webhooks.md#run-with-curl-dialog) pilnām dialoga detaļām un [SSE Streaming](./sse-streaming.md) notikumu protokolam.

## Saistītie

- [Keyboard Shortcuts](./keyboard-shortcuts.md) – Visas kanvas un redaktora saīsnes
- [Agent Persistent Memory](./agent-persistent-memory.md) – Atmiņas grafa darbība un API
- [Execute Node](../nodes/execute-node.md) – Izsauc apakš-workflow
- [Expression DSL](./expression-dsl.md) – Atsauces un piespraustie dati
- [Workflow Structure](./workflow-structure.md) – Mezglu un šķautņu formāts
- [Download & Import](./download-import.md) – Eksportēt un importēt workflow kā JSON
- [Node Types](./node-types.md) – Visi mezglu tipi
- [Logs Tab](../tabs/logs-tab.md) – Docker konteinera žurnāli
- [Execution History](./execution-history.md) – Iepriekšējie izpildes gadījumi
- [Templates](../tabs/templates-tab.md) – Saglabāt un atkārtoti izmantot workflow un mezglus
- [Contextual Showcase](./contextual-showcase.md) – Kompakts lapas ceļvedis, kas pieejams redaktorā
