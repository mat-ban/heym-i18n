# AI Assistant

**AI Assistant** ir chat panelis, kas tiek atvērts no Debug paneļa un sākotnēji parādās redaktora apakšējā labajā stūrī. Velciet virsrakstu, lai to pārvietotu, un velciet malu vai stūri, lai mainītu tā platumu vai augstumu. Tas nesamazināsies zem 360×480 pikseļiem. Pozīcija un izmērs tiek saglabāti šajā pārlūkā. **Reset position and size** virsrakstā novieto paneli atpakaļ apakšējā labajā stūrī. Izmantojiet dabisko valodu, lai izveidotu vai modificētu workflow—aprakstiet, ko vēlaties, un AI ģenerē mezglus un savienojumus, kas tiek piemēroti kanvai.

Lai uzdotu jautājumus par dokumentāciju ārpus redaktora, izmantojiet [Chat with Heym](./chat-with-heym.md). Šī saskarne ir optimizēta uz lapu orientētai produkta palīdzībai, nevis workflow ģenerēšanai.

## Paneļa atvēršana

1. Atveriet workflow redaktorā
2. Atrodiet **Debug panel** apakšā (izpildes rezultātu apgabals)
3. Noklikšķiniet uz pogas **AI** (Sparkles ikona) paneļa rīkjoslā
4. AI Assistant panelis atveras apakšējā labajā stūrī. Velciet tā virsrakstu, lai to pārvietotu, vai velciet malu vai stūri, lai mainītu tā platumu un augstumu.

Nospiediet `Ctrl + I` / `Cmd + I` jebkur redaktorā, lai atvērtu vai aizvērtu paneli — saīsne darbojas arī tad, ja fokuss ir uz teksta ievades lauka. Skatiet [Keyboard Shortcuts](./keyboard-shortcuts.md).

## Paneļa aizvēršana

Noklikšķiniet uz pogas **X**, nospiediet `Ctrl + I` / `Cmd + I` vai pārslēdziet pogu **AI** Debug paneļa rīkjoslā. Virsraksts pārvieto paneli; tas to neaizver.

## Konfigurācija

Pirms ziņojumu sūtīšanas izvēlieties:

| Iestatījums | Apraksts |
|---------|-------------|
| **Credential** | LLM akreditācijas dati (API key) no [Credentials](../tabs/credentials-tab.md) |
| **Model** | Modeļa nosaukums (piem., `gpt-4o`, `gemini-2.5-flash`) |

Pievienojiet akreditācijas datus sadaļā [Credentials Tab](../tabs/credentials-tab.md). Modeļu saraksts tiek ielādēts no izvēlētajiem akreditācijas datiem.

## Agent Mode vs Ask Mode

Panelim ir divi režīmi, kurus pārslēdz ar **Agent / Ask** čipu paneļa virsrakstā.

| Režīms | Noklusējums | Darbība |
|------|---------|-----------|
| **Agent** | ✓ | Veido un modificē kanvu. AI ģenerē workflow JSON bloku, kas tiek automātiski piemērots kanvai, kad atbilde ir pabeigta. |
| **Ask** | | Atbild tikai uz jautājumiem. Kanva netiek aizskarta. Izmantojiet to, lai jautātu par savu workflow, Heym funkcijām vai saņemtu padomu, neizraisot kanvas atjaunināšanu. |

Pārslēdziet režīmus jebkurā laikā. Režīma maiņa neiztīra sarunu.

Agent režīmā izvēles rūtiņa **YOLO mode** zem ziņojuma lauka liek asistentam palaist un labot to, ko tas izveidojis. Skatiet [YOLO Mode](#yolo-mode).

## Chata izmantošana

- Ierakstiet savu pieprasījumu ievades laukā (piem., "Create a workflow that takes user input and sends it to an LLM")
- Nospiediet **Enter**, lai nosūtītu (Shift+Enter jaunai rindai)
- AI straumē savu atbildi. **Agent** režīmā, ja atbilde satur workflow \`\`\`json koda blokā, tas tiek automātiski parsēts un piemērots kanvai. **Ask** režīmā kanva nekad netiek modificēta.
- Izmantojiet **Clear**, lai atiestatītu sarunu
- Novietojiet kursoru uz ziņojuma un noklikšķiniet uz tā kopēšanas ikonas, lai nokopētu tekstu, ko tas rāda, ieskaitot jebkuru workflow JSON
- Velciet līniju virs ziņojuma lauka, lai padarītu lauku augstāku. Ievades apgabals var izaugt līdz 60% no paneļa, un tas atgriežas sākotnējā augstumā, kad lapa tiek pārlādēta

## Workflow automātiskā piemērošana

Kad AI atbilde satur derīgu workflow JSON bloku (ar `nodes` un pēc izvēles `edges`) \`\`\`json koda blokā, Heym:

1. Parsē JSON no atbildes
2. Aizstāj pašreizējo kanvu ar jaunajiem mezgliem un savienojumiem
3. Sakārto mezglu izkārtojumu
4. Atzīmē workflow kā nesaglabātu

Ja parsēšana neizdodas, parādās poga **Retry**, lai atkārtoti ģenerētu atbildi.

## YOLO Mode

**YOLO mode** ļauj asistentam pārbaudīt to, ko tas izveido. Atzīmējiet izvēles rūtiņu **YOLO mode** zem ziņojuma lauka, pēc tam nosūtiet savu pieprasījumu. Rūtiņa parādās tikai Agent režīmā. Tā pēc noklusējuma ir izslēgta un tiek atiestatīta uz izslēgtu, kad lapa tiek pārlādēta. Novietojiet kursoru uz informācijas ikonas blakus tai, lai redzētu īsu kopsavilkumu.

Kad YOLO mode ir ieslēgts, asistents neapstājas pēc workflow piemērošanas:

1. Tas piemēro workflow kanvai.
2. Pirms pirmās palaišanas tas pieprasa testa ievades. Kartītē ir uzskaitīti workflow ievades lauki, aizpildīti ar vērtībām, ko asistents ierosina. Rediģējiet tās un nospiediet **Run**. Turpmākās palaišanas atkārtoti izmanto šīs vērtības. Kartīte parādās atkal tikai tad, kad ievades lauki mainās vai asistentam ir nepieciešami citi testa dati.
3. Tas palaiž workflow uz kanvas tieši tāpat kā poga **Run**: nesaglabātās izmaiņas vispirms tiek saglabātas, mezgli iedegas, un palaišana parādās Debug panelī un [Execution History](./execution-history.md).
4. Tas nolasa rezultātu. Ja palaišana izdarīja to, ko lūdzāt, tas pabeidz ar **Verified** un īsu kopsavilkumu. Ja nē, tas labo workflow un palaiž to vēlreiz.

Tas veic ne vairāk kā **5 palaišanas** uz vienu ziņojumu. Nospiediet **Stop** jebkurā laikā, lai pārtrauktu ciklu un apturētu notiekošo palaišanu.

Katra atbilde rāda tās soļus, kad tie notiek:
- `Applying changes to canvas`;
- `Running workflow · attempt 2/5`, ar rindu `Executing <node>` katram mezglam;
- galīgo spriedumu.

Pēc katras palaišanas īsa rinda, piemēram, *Attempt 1 result sent · error in 1.2s*, parāda, ka rezultāts tika nosūtīts atpakaļ asistentam.
### Citu Jūsu workflow izpilde

YOLO režīmā asistents var arī izpildīt citus Jūsu workflow, kad tam nepieciešams to rezultāts. Piemēram, tas var pārbaudīt, ko workflow atgriež, pirms to izsaukt no [Execute](../nodes/execute-node.md) mezgla. Šīs izpildes parādās kā `Running workflow "<name>"...` soļi un tiek ierakstītas Izpildes vēsturē ar trigger avotu `ai_assistant`. Rediģējamais workflow vienmēr tiek testēts uz kanvas.

### Kad tas apstājas priekšlaicīgi

| Situācija | Kas notiek |
|---|---|
| Asistentam nepieciešams lēmums, informācija, akreditācijas dati vai datu tabula | Tas jautā ar parasto jautājuma kartīti. Atbilde turpina ciklu. |
| Izpilde gaida [cilvēka pārskatīšanu](./human-in-the-loop.md) | Cikls apstājas. Apstipriniet pārskatīšanu, pēc tam nosūtiet ziņojumu. |
| Workflow gaida faila augšupielādi | Cikls apstājas. YOLO režīms nevar testēt ar augšupielādi triggerētas izpildes. |
| Citur tika saglabāta jaunāka workflow versija | Cikls apstājas. Atrisiniet saglabāšanas konfliktu, pēc tam nosūtiet ziņojumu. |

> **Izpildes ir reālas.** E-pasti, ziņojumi un API izsaukumi workflow tiek faktiski nosūtīti katrā mēģinājumā, un DataTable mezgli ieraksta reālas rindas. Katra izpilde saglabā workflow, tāpēc iepriekšējās versijas paliek [Rediģēšanas vēsturē](./edit-history.md).

## Balss ievade

Atbalstītajos pārlūkos poga **Voice** iespējo runas pārveidi tekstā. Noklikšķiniet, lai sāktu ierakstīšanu, noklikšķiniet vēlreiz, lai pārtrauktu. Pārrakstītais teksts pirms nosūtīšanas tiek nosūtīts AI gramatikas labošanai.

## Agent mezgls pret AI asistentu

| | Agent mezgls | AI asistents |
|---|------------|---------------|
| **Mērķis** | LLM mezgls workflow iekšienē; darbojas izpildes laikā | Chat UI, lai veidotu workflow ar dabiskās valodas palīdzību |
| **Atrašanās vieta** | Kanvas mezgls | Debug panelis → peldošais panelis |
| **Kad** | Izpildes laikā | Rediģēšanas laikā |

Skatiet [Agent mezglu](../nodes/agent-node.md) par workflow mezglu, kas izpilda LLM izsaukumus ar rīkiem un MCP.

## Kā tas darbojas (AI Builder DSL)

AI asistentu darbina **workflow DSL** (jomas specifiskā valoda), kas apraksta mezglus, šķautnes un izteiksmes. Kad Jūs nosūtāt ziņojumu:

1. Jūsu ziņojums kopā ar [Lietotāja noteikumiem](./user-settings.md) un pašreizējo workflow (ja tāds ir) tiek nosūtīts uz backend.
2. Backend izveido **sistēmas prompt**, kas ietver:
   - Pilnu workflow DSL (mezglu tipi, izteiksmju sintakse, noteikumi, piemēri)
   - Jūsu Lietotāja noteikumus, kas pievienoti kā "User Custom Rules"
   - Pašreizējo workflow JSON, kad Jūs rediģējat esošu workflow
   - Pieejamo workflow sarakstu, ja izmantojat Execute mezglu
   - Jūsu pašu akreditācijas datu nosaukumus, tipus un id (nekad to vērtības)
   - Datu tabulu nosaukumus, id, aprakstus un kolonnas, ko varat izmantot (nekad to rindas)
3. Modelis atgriež vienu workflow JSON bloku (ar `nodes` un `edges`). Frontend to parsē un piemēro kanvai.

### Akreditācijas dati

Kad workflow nepieciešami akreditācijas dati, asistents jautā pirms to izveides. Ja Jums ir piemērota tipa akreditācijas dati, tas tos uzskaita kopā ar **Create a new credential**; ja Jums to nav, tas jautā, vai izveidot jaunus. Katrs jautājums arī ļauj turpināt bez akreditācijas datiem.

Izvēloties izveidot jaunus, panelī tiek atvērta akreditācijas datu forma, kas iepriekš iestatīta uz pareizo tipu un ieteikto nosaukumu. Vērtības nonāk tieši Heym; asistents uzzina tikai nosaukumu un tipu. OAuth akreditācijas dati (Google Sheets, Google Drive, BigQuery, Linear, Notion) tiek savienoti uznirstošajā logā, un saite uz autorizācijas lapu parādās gadījumā, ja uznirstošais logs tiek bloķēts. Kad akreditācijas dati ir saglabāti, kartīte parāda to nosaukumu un izveides poga tiek izslēgta; nospiediet **Submit answers**, un asistents ievieto jaunos akreditācijas datus mezglā.

Jūs varat arī lūgt akreditācijas datus atsevišķi ("create a GitHub credential") vai lūgt mainīt esošos ("update my sheet credential", "reconnect my Google Sheets"). Asistents atbild ar to pašu kartīti: izveide atver tukšu formu, atjaunināšana atver formu ar attiecīgajiem akreditācijas datiem un to noslēpumiem maskētiem.

Asistents dod priekšroku specializētam mezglam. Kad neviens mezgls nepārklāj darbību, piemēram, cilnes pievienošanu Google Sheet, tas izmanto HTTP pieprasījumu un ieraksta galvenes rindu izvēlētajiem akreditācijas datiem. Skatiet [HTTP › Autentifikācija ar akreditācijas datiem](../nodes/http-node.md#authenticating-with-credentials).

Precizējošie jautājumi, bez kuriem workflow var iztikt, savā ievadē ir atzīmēti ar **Optional** un tos var izlaist.

DSL nosaka camelCase apzīmējumus, vienotos izteiksmju noteikumus un mezglam specifiskus laukus. Ja lauka vērtība ir viens `$expr`, backend saglabā native tipu; ja vērtība sajauc prozu ar `$refs`, rezultāts ir string. Noteikums par vienu `$` joprojām ir spēkā: bez `$` iekavās. [Iestatījumu](./user-settings.md) Lietotāja noteikumi tiek ievadīti šajā sistēmas prompt, tāpēc Jūsu preferences attiecas uz katru AI ģenerētu workflow.

Ja pašreizējais workflow satur Agent skills, AI asistents šajā workflow kontekstā iekļauj tikai katras prasmes `SKILL.md`. Pievienotie `.py` faili un binārie prasmju resursi tiek noņemti pirms pieprasījuma, lai builder paliktu modeļa konteksta robežās pat tad, ja prasmes satur lielas implementācijas.
### Datu tabulas

Kad workflow saglabā, glabā vai meklē ierakstus un Jūs neesat norādījis citu krātuvi, asistents izmanto [DataTable](../nodes/datatable-node.md) mezglu. Ja Jūs nosaucat kādu no savām tabulām un tai ir kolonnas, kas nepieciešamas workflow, asistents to izmanto. Pretējā gadījumā tas jautā, kuru tabulu izmantot. Kartītē ir uzskaitītas piemērotās tabulas, katrai norādot tās aprakstu un kolonnu tipus, kā arī **Izveidot jaunu tabulu** ar piedāvāto nosaukumu un kolonnām. Tiek piedāvātas arī ar Jums kopīgotās tabulas; tabula, kuru Jūs varat tikai lasīt, tiek piedāvāta tikai lasīšanai.

Izvēlieties jauno tabulu un nospiediet **Iesniegt atbildes**: kartīte izveido tabulu, un asistents ievieto tās id mezglā un izmanto tās precīzos kolonnu nosaukumus. Jūs varat arī lūgt tabulu atsevišķi, piemēram, "izveido tabulu maniem leads".

Asistents redz tabulu nosaukumus, aprakstus un kolonnas, nekad rindas. Tas nekad nemaina esošas tabulas kolonnas: ja tabulai trūkst kolonnas, kas nepieciešama workflow, tas nosauc kolonnu un tā vietā piedāvā jaunu tabulu. Pievienojiet kolonnas cilnē [DataTable](../tabs/datatable-tab.md).

## Saistītais

- [Kāpēc Heym](../getting-started/why-heym.md) – Dabiskās valodas veidošana kā aģenta dzīves cikla pirmais posms
- [Ātrā sākšana](../getting-started/quick-start.md) – Izveidojiet savu pirmo workflow
- [Iestatījumi](./user-settings.md) – Lietotāja noteikumi, kas ievadīti AI Assistant sistēmas prompt
- [Chat ar Heym](./chat-with-heym.md) – Ar lapu saistīts asistents dokumentācijas apgabalā
- [Pamatkoncepcijas](../getting-started/core-concepts.md) – Workflows, mezgli un izpildes plūsma
- [Agent mezgls](../nodes/agent-node.md) – LLM mezgls ar rīkiem un MCP
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Pievienojiet API atslēgas AI Assistant
- [Workflow struktūra](./workflow-structure.md) – JSON formāts workflow
