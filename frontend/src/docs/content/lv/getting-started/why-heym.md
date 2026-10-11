# Kāpēc Heym

Heym ir infrastruktūra AI aģentu darbināšanai un pārvaldībai produkcijā. Viena pašmitināta izpildvide aptver visas aģenta dzīves cikla stadijas.

Prototipa aģentam ir nepieciešams modelis, Prompt un daži rīki. Produkcijas aģentam papildus nepieciešami Trigger un atkārtoti mēģinājumi, saglabāta stāvokļa informācija, kad tas apstājas, lai gaidītu cilvēku, ieraksts par katru modeļa un rīka izsaukumu, izmaksas par katru palaišanu, testi pirms izmaiņu izlaišanas un skaidri ierobežojumi tam, ko tas drīkst darīt patstāvīgi. Heym visu to glabā vienuviet, tāpēc sistēma, ko izstrādājat uz audekla, ir tā pati sistēma, kas darbojas. Veidojiet aģentiskas sistēmas un pēc tam darbiniet tās ar pārliecību.

## Viena izpildvide aģenta dzīves ciklam

| Stadija | Ko Heym Jums nodrošina |
|---|---|
| **Veidot** | Veidojiet aģentus un deterministiskus soļus uz audekla, ģenerējiet tos ar [AI Assistant](../reference/ai-assistant.md) vai sāciet no [Templates](../tabs/templates-tab.md) un pārnesamām prasmēm. |
| **Orķestrēt** | Koordinējiet aģentus, [apakšaģentus](../reference/agent-architecture.md), kodēšanas aģentus, RAG, pārlūka automatizāciju un rīkus ar skaidru datu plūsmu un [paralēlu izpildi](../reference/parallel-execution.md). |
| **Darbināt** | Sāciet palaišanas no [webhooks](../reference/webhooks.md), grafikiem un notikumu [triggers](../reference/triggers.md), ar atkārtotiem mēģinājumiem katram mezglam, [kļūdu apstrādi](../nodes/error-handler-node.md) un [slodzes sadali](../reference/cluster.md) starp instancēm. |
| **Novērot** | Pārbaudiet katru izpildi, izmantojot [vēsturi](../reference/execution-history.md), [LLM traces](../tabs/traces-tab.md), izmaksas USD par katru palaišanu, tiešraides palaišanas uz audekla, [analītiku](../tabs/analytics-tab.md), [brīdinājumus](../tabs/alerts-tab.md) un [OpenTelemetry](../reference/opentelemetry.md) eksportu. |
| **Novērtēt** | Testējiet Prompt un modeļus pret sagaidāmajiem rezultātiem [Evals](../tabs/evals-tab.md), ar LLM-as-Judge vērtēšanu un modeļu salīdzinājumu blakus. |
| **Kontrolēt** | Saglabājiet cilvēku kontroli ar [pārskatīšanas kontrolpunktiem](../reference/human-in-the-loop.md) un [guardrails](../reference/guardrails.md), un pārvaldiet piekļuvi ar šifrētiem [credentials](../reference/credentials.md), [komandām](../reference/teams.md), [vienoto pierakstīšanos](../reference/sso.md) un [audita žurnālu](../reference/audit.md). |
| **Publiskot** | Nodrošiniet Workflow pieejamību caur REST un [SSE](../reference/sse-streaming.md), kā [MCP](../tabs/mcp-tab.md) rīkus, kā [Portal](../reference/portal.md) tērzēšanas saskarnes un kā [dashboard](../tabs/dashboard-tab.md) logrīkus. |

## Build

### AI Assistant: Build Workflow ar dabisko valodu

[AI Assistant](../reference/ai-assistant.md) ir tērzēšanas panelis workflow redaktorā. Aprakstiet, ko vēlaties, piemēram, "izveidojiet workflow, kas pieņem lietotāja ievadi, meklē manā zināšanu bāzē un atbild, izmantojot GPT-4o", un asistents ģenerē mezglus un savienojumus, kas tiek nekavējoties piemēroti audeklam.

- Izmanto Jūsu paša LLM akreditācijas datus (jebkurš atbalstītais modelis)
- Atbalsta **balss ievadi** workflow izstrādei bez rokām
- Automātiski piemēro derīgu workflow JSON no AI atbildes uz audekla
- Straumē atbildes reāllaikā

Asistents darbojas tieši redaktorā un straumē mezglus uz audekla reāllaikā, un viss, ko tas ģenerē, paliek rediģējams tāpat kā ar roku novietoti mezgli.

### Skills sistēma

Skills ir pārnesamas iespēju pakotnes — `SKILL.md` instrukciju fails plus neobligāti Python skripti —, ko var novietot uz jebkura Agent mezgla.

- Skill instrukcijas tiek pievienotas agenta system prompt sākumā
- Python faili skill pakotnē kļūst par izsaucamiem rīkiem
- Skills ir atkārtoti izmantojami starp workflow un koplietojami kā `.zip` arhīvi

Tas ir līdzvērtīgi tam, kā dot savam agentam amata aprakstu un rīku komplektu vienā piegājienā.

### Workflow Analyzer: palaišanu apzināta atgriezeniskā saite

[Workflow Analysis](../reference/workflow-analysis.md) panelis ir redaktorā iebūvēts palaišanu apzināts dokumentācijas un atgriezeniskās saites rīks. Noklikšķiniet uz **Analyze**, izvēlieties LLM akreditācijas datus un modeli, un Heym ģenerē rediģējamu Markdown atskaiti par pašreizējo workflow.

Atšķirībā no statiskas piezīmes analizators vispirms palaiž workflow, kad tas ir iespējams, un iekļauj izpildes rezultātu prompt. Atskaitē ir iekļautas uzlabojumu jomas, workflow mērķis un soli pa solim skaidrojums par to, ko dara mezgli. Ja atskaite jau pastāv, **Reanalyze** straumē atsevišķu priekšskatījumu, lai Jūs varētu pieņemt jauno versiju vai saglabāt pašreizējo koplietoto dokumentu.

## Orķestrēšana

### Iebūvētie LLM un aģentu mezgli

Heym [Agent Node](../nodes/agent-node.md) izpilda cieši integrētu rīku izsaukšanas cilpu ar iekļautiem Python rīkiem, MCP savienojumiem un pārnesamu prasmju sistēmu, kas viss ir paredzēts ražošanas aģentiem.

Heym vienkāršais [LLM node](../nodes/llm-node.md) arī pārsniedz vienu prompt-atbildes soli. Atbalstītajiem OpenAI un OpenAI-saderīgajiem endpoints tas var pārslēgties uz **Batch API režīmu**, lai viens mezgls iesniegtu promptu masīvu lētākā pakalpojumu sniedzēja vietējā batch pieprasījumā. Pēc tam kanva atklāj īpašu `batchStatus` zaru, kas aktivizējas, batch pārejot caur stāvokļiem, piemēram, `pending`, `processing` un `completed`.

Tas nozīmē, ka LLM mezgls var darīt divas lietas vienlaikus:

- Palaist galveno batch pieprasījumu un atgriezt galīgos rezultātus katram elementam parastajā zarā
- Aktivizēt paziņojumu vai žurnālošanas loģiku pie katra nozīmīga batch statusa atjauninājuma, nepārvēršot plūsmu par pielāgotu aptaujas cilpu

Batch izpilde ir pirmās klases LLM workflow primitīvs ar pakalpojumu sniedzēja un modeļa iespēju pārbaudēm mezgla UI.

**Agent Node** ir aģentu orķestrēšanas kodols Heym:

- **Rīku izsaukšana** – Aģents atkārto rīku izsaukumus cilpā, līdz tas sniedz galīgo atbildi
- **Python rīki** – Definējiet pielāgotus rīkus iekļauti ar pilnu Python; aģents tos izsauc izpildes laikā
- **MCP savienojumi** – Pievienojieties jebkuram [Model Context Protocol](https://modelcontextprotocol.io/) serverim (stdio vai SSE), un aģents automātiski iegūst visus tā rīkus
- **Prasmes** – Nometiet `.zip` vai `.md` failu uz aģenta, lai paplašinātu tā sistēmas kontekstu un pievienotu Python rīkus
- **Apakš-workflow izsaukumi** – Aģents var izsaukt citus Heym workflow kā rīkus, komponējot sarežģītu uzvedību bez pielāgota koda

Skatiet [Agent Node](../nodes/agent-node.md) un [Agent Architecture](../reference/agent-architecture.md) pilnīgai atsaucei.

### Vairāku aģentu orķestrēšana

Heym atbalsta **orķestratora modeli** ar pirmās klases vizuālajiem primitīviem:

- Viens aģents darbojas kā **orķestrators** (`isOrchestrator: true`) un tam tiek piešķirts `call_sub_agent` rīks
- Tas deleģē uzdevumus nosauktiem **apakšaģentiem** tajā pašā kanvā
- Apakšaģenti paši var izsaukt citus aģentus vai apakš-workflow (maksimālais dziļums: 5)
- **Paralēlā izpilde**: Kad orķestrators vienā gājienā izsauc vairākus apakšaģentus, tie darbojas paralēli, lai iegūtu ātrākus rezultātus

Tas ļauj veidot arhitektūras, piemēram, plānošanas aģentu, kas maršrutē darbu uz pētnieku, programmētāju un kopsavilkuma veidotāju, viss savienots vizuāli bez pielāgota orķestrēšanas koda.

Skatiet [Agent Architecture](../reference/agent-architecture.md) izpildes detaļām.

### Kodēšanas aģenti kā workflow mezgli

Heym piegādā divus mezglus, kas izpilda īstu kodēšanas aģentu kā workflow soli, nevis tērzēšanas pabeigšanu:

- **[Codex Node](../nodes/codex-node.md)** – Izpilda OpenAI Codex CLI izolētā Heym darbvietā pret GitHub repozitoriju. Atbalsta **Sign in with ChatGPT** (PKCE OAuth ar Jūsu Plus/Pro abonementu, bez API izmaksām par token) vai piekļuves token, klonē repo, ļauj Codex rediģēt kodu un atgriež `summary`, `diff`, `changedFiles` un melnraksta `pullRequestUrl`.
- **[OpenCode Go Node](../nodes/opencode-go-node.md)** – Tas pats repozitorija workflow caur pakalpojumu sniedzēja neitrālo OpenCode gateway (Kimi, DeepSeek, Qwen un citi), izpildīts **nostiprinātā vienreizlietojamā konteinerā**: visas iespējas atņemtas, tikai lasāma sakne, pid/atmiņas/CPU ierobežojumi. GitHub token paliek ārpus sandbox: Heym veic katru git un GitHub darbību resursdatora pusē, tāpēc ģenerētais kods nevar izgūt push akreditācijas datus.

Tas nozīmē, ka workflow var izskatīt kļūdu no webhook, nodot repo kodēšanas aģentam, gaidīt melnraksta PR un publicēt saiti Slack, pilnībā automatizēti, ar resursu ierobežojumiem, ko var konfigurēt katram izvietojumam.

### Iebūvēta RAG plūsma

Heym ietver [RAG / Vector Store Node](../nodes/rag-node.md) un pārvaldītu [Vectorstores](../tabs/vectorstores-tab.md) cilni. Jūs varat:

- Izvēlēties savu vektoru aizmuguri: **Qdrant** (ārējais serveris) vai **Postgres (pgvector)**, kas glabā vektorus Heym paša datubāzē bez papildu pakalpojuma palaišanas
- Ievietot dokumentus vektoru krātuvē tieši no workflow mezgla
- Veikt semantisko meklēšanu un padot rezultātus LLM vai Agent mezglam
- Atsaukties uz rezultātiem ar izteiksmēm, piemēram, `$ragNode.results.map("item.payload.content").join("\n\n")`

Heym RAG ir divi mezgli ar pilnīgu kontroli pār embeddings un izgūšanu.

### Pārlūka automatizācija ar Playwright

[Playwright node](../nodes/playwright-node.md) ir pirmās puses pārlūka automatizācija uz kanvas.

- **Steps režīms** – Komponējiet navigācijas, klikšķu, rakstīšanas, aizpildīšanas, ekrānuzņēmumu, izvilkšanas un ritināšanas darbības vizuāli
- **AI soļi ar automātisku labošanu** – Aprakstiet darbību dabiskajā valodā, un LLM ģenerē Playwright darbības; neizdevušos selektorus var automātiski labot, un ģenerētos soļus var kešot, lai izlaistu turpmākos LLM izsaukumus
- **Run Code režīms** – Pārslēdziet mezglu uz pilnu Playwright Python sarežģītām plūsmām (pēc noklusējuma atspējots; kad iespējots, darbojas Heym nostiprinātajā sandbox)
- **Autentificētas sesijas** – Atjaunojiet sīkfailus/`storageState` pirms palaišanas, pārbaudiet pieteikšanos ar selektora pārbaudi un atkāpieties uz skriptētiem pieteikšanās soļiem
- **Tīkla uztveršana** – Pēc izvēles apkopojiet JSON atbildes, galvenes, sīkfailus un pārlūka krātuvi kopā ar rezultātiem

Heym uzskata pārlūku par parastu mezglu ar tām pašām izteiksmēm, akreditācijas datiem un kļūdu apstrādi kā viss pārējais.

### Expression DSL

Heym [Expression DSL](../reference/expression-dsl.md) nodrošina tīru, jaudīgu sintaksi, lai atsauktos uz augšupējo mezglu datiem:

- `$input.text` – Ievades mezgla dati
- `$nodeName.field` – Jebkura augšupējā mezgla izvades lauks
- `$global.variableName` – Pastāvīgie globālie mainīgie
- Masīva palīgfunkcijas: `.first()`, `.map("field")`, `.join("\n")`

Izteiksmes darbojas katrā virknes laukā, tostarp promptos, HTTP galvenēs, nosacījumos un iestatītajās vērtībās, tāpēc dati pārvietojas starp soļiem skaidri. DSL līdzsvaro jaudu un lasāmību, neprasot pilnīgas JavaScript zināšanas.

## Palaišana

### Triggeri, atkārtotie mēģinājumi un kļūdu ceļi

Workflow var sākties no daudzām vietām. [Input](../nodes/input-node.md) mezgli saņem HTTP [webhook](../reference/webhooks.md), [Cron](../nodes/cron-node.md) darbojas pēc grafika, un notikumu [triggeri](../reference/triggers.md) sāk palaišanas no Telegram, Discord, Slack, IMAP iesūtnēm, WebSocket straumēm, RabbitMQ rindām, failu augšupielādēm un Heym platformas notikumiem.

Kļūmes tiek apstrādātas grafa ietvaros. Jebkurš mezgls var atkārtot mēģinājumu kļūmes gadījumā ar noteiktu mēģinājumu skaitu un gaidīšanas laiku starp tiem, katrs mēģinājums tiek reģistrēts [izpildes vēsturē](../reference/execution-history.md), un [Error Handler](../nodes/error-handler-node.md) mezgls tiek palaists automātiski, kad mezgls neizdodas, tāpēc atkopšanās ir paša workflow daļa.

### Paralēla DAG izpilde

Heym workflow izpildītājs izmanto virzīta acikliska grafa (DAG) plānotāju. Neatkarīgi mezgli darbojas paralēli automātiski, bez nepieciešamības pēc konfigurācijas.

- Mezgli vienā atkarības līmenī tiek nosūtīti vienlaicīgi uz pavedienu kopu (`max_workers=8`)
- Tiklīdz kāds mezgls pabeidz darbu, tā lejupējie mezgli tiek ieplānoti
- [Merge Node](../nodes/merge-node.md) apvieno paralēlo zaru rezultātus
- Vairākas workflow palaišanas izpildās vienlaicīgi; katra palaišana ir pilnībā izolēta

Paralēlisms ir noklusējuma uzvedība, ko nosaka grafa struktūra.

Skatīt [Paralēlā izpilde](../reference/parallel-execution.md).

### Mērogošana starp instancēm

Norādiet otru Heym instanci uz to pašu PostgreSQL datubāzi, un tā pievienojas kā darbinieks. Fona palaišanas tiek sadalītas starp instancēm pēc Jūsu noteiktajiem svariem, viens ievēlēts līderis uztur grafikus, brīdinājumu novērtēšanu un avārijas atkopšanu pārejas laikā, un katra palaišana reģistrē instanci, kas to izpildīja. Skatīt [Slodzes sadale](../reference/cluster.md).

### Aģentiskā Kanban tāfele

[Board cilne](../tabs/board-tab.md) ir iebūvēta Kanban tāfele, kur pašas kolonnas izpilda workflow. Kartīte ir pastāvīgs aģentisks uzdevums, kas satur kontekstu, sarunas vēsturi, izpildes stāvokli, izvades un workflow palaišanas.

- **Kolonnu workflow ķēdes** – Kartītes pārvietošana kolonnā izraisa šīs kolonnas workflow ķēdi; **Agentic Kanban Model** (Jūsu akreditācijas dati + modelis) kartē kartītes saturu workflow ievadēs un pārvērš izvades atpakaļ lasāmā tekstā
- **Kartītes pielikumi** – Nometiet failus uz kartītes; dokumenti tiek izgūti tekstā un attēli tiek nodoti redzes spējīgiem modeļiem pirms katras palaišanas
- **Tiešraides palaišanas audekls** – Atveriet aktīvo palaišanu kartītē un vērojiet, kā tā izpildās īstajā workflow audeklā, mezglu pa mezglam
- **Koplietošana komandā** – Koplietojiet tāfeles ar lietotājiem vai komandām ar lasīšanas/rakstīšanas atļaujām; ķēdes koplietotās tāfelēs darbojas ar īpašnieka akreditācijas datiem, tāpēc līdzstrādniekiem nekad nav nepieciešami savi
- **Kļūmju redzamība** – Neizdevušās kartītes parāda kļūdu vēstures indikatoru, un turpmākās palaišanas var apturēties, lai gaidītu komentārus

Tāfele ir platformas dabiska virsma: kartītes, workflow, akreditācijas dati un tiešraides palaišanas visas atrodas vienā vietā.

### Heym Drive: iebūvēta failu glabātuve

[Drive cilne](../tabs/drive-tab.md) ir platformā iebūvēta failu krātuve. Faili, ko ģenerē prasmes un workflow (PDF, DOCX, CSV, attēli), nonāk tur automātiski, un arī tāfeles kartīšu pielikumi tiek glabāti tur.

- **Koplietošanas saites** – Publiskas vai ar paroli aizsargātas (Basic Auth) lejupielādes saites ar izvēles derīguma termiņu un maksimālo lejupielāžu ierobežojumiem
- **Koplietošana komandā** – Koplietojiet failus tikai lasāmi ar savām komandām un noņemiet visas komandas koplietošanas ar vienu darbību
- **Lielapjoma darbības** – Vairāku atlase ar shift-klikšķa diapazoniem, apvienojiet atlases vienā ZIP lejupielādē vai piemērojiet vienu koplietošanas/paroles/dzēšanas iestatījumu daudziem failiem uzreiz
- **Aģenta piekļuve** – Prasmes var izvēlēties lasīt Drive failus, tāpēc aģents var strādāt ar dokumentiem, ko esat izveidojis Jūs vai citi workflow

Ģenerētie artefakti iegūst pastāvīgu, koplietojamu mājvietu platformas ietvaros.

## Novērošana

### LLM izsekošana

[Cilne Izsekošana](../tabs/traces-tab.md) nodrošina pilnīgu novērojamību katram LLM izsaukumam:

- Pieprasījuma un atbildes payload
- Katra izsaukuma laiks: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Rīku izsaukumu nosaukumi, argumenti un rezultāti
- Prasmes, kas nodotas modelim

Izsekošanas sistēma ir speciāli izstrādāta aģentiskas uzvedības atkļūdošanai, ar pilniem pieprasījuma un atbildes payload un katra izsaukuma laiku.

### LLM Token izmaksu izsekošana

Katrs LLM izsaukums Heym tiek automātiski aprēķināts izmaksu ziņā. [Cilne Izsekošana](../tabs/traces-tab.md) parāda katrai izsekošanai ievades un izvades token skaitu kopā ar reāllaika USD izmaksām, kas iegūtas no sinhronizētas cenu tabulas.

- **Izmaksas katrai izsekošanai** – Ievades token, izvades token un kopējās USD izmaksas redzamas katrā izsekošanas rindā
- **Izmaksu analītika** – KPI kartītes un izmaksu diagramma pa modeļiem atjaunojas atbilstoši izvēlētajam laika diapazonam (1h / 24h / 7d / 30d / Visi)
- **LLM izmaksu tabula** – Sistēmas tabula [Cilnē DataTable](../tabs/datatable-tab.md) tiek aizpildīta no Helicone ik pēc 24 stundām; Jūs varat ignorēt cenas vai pievienot pielāgotas rindas modeļiem, kas vēl nav iekļauti
- **Brīdinājums par trūkstošu cenu** – Izsekošanām modeļiem bez cenas ieraksta parādās iekļauts brīdinājums ar tiešu saiti uz izmaksu tabulu

Katrai izpildei ir savas USD izmaksas, sadalītas pa modeļiem.

### Atvērt ražošanas izpildes tiešsaistes audeklā

Ražošanas workflow paliek pārbaudāms arī pēc tā palaišanas ārpus redaktora. Atveriet jebkuru **Darbojas** ierakstu no jebkura Vēstures dialoga vai atveriet aktīvo izpildi Agentic Kanban kartītē, un Heym pievieno parasto workflow redaktoru tieši šai izpildei.

- Mezgli, kas jau pabeigti, parādās ar saviem rezultātiem nekavējoties
- Pašreizējais mezgls un gaidošie lejupstraumes mezgli turpina pulsēt, izpildei virzoties uz priekšu
- Debug panelis saņem tos pašus pakāpeniskos mezglu rezultātus kā audeklā palaista izpilde
- Galīgais izvades un izpildes izcelšana parādās bez aptaujas vai dublētas izpildes palaišanas
- Redaktora aizvēršana tikai atvieno novērotāju; tā nekad neatceļ ražošanas workflow

Novērotājs izmanto SSE, ko atbalsta starp-worker izpildes momentuzņēmums, tāpēc tas darbojas webhook, grafika, tērzēšanas, MCP, integrācijas un Board trigger gadījumos pat tad, ja izpildi pārvalda cits aizmugursistēmas worker.

### OpenTelemetry, analītika un brīdinājumi

Heym izstaro [OpenTelemetry](../reference/opentelemetry.md) span katram workflow izpildei, mezgla izpildei un Agent rīka izsaukumam, eksportējot pa OTLP/HTTP uz Jaeger, Grafana Tempo, Honeycomb, Datadog vai jebkuru citu saderīgu aizmugursistēmu.

[Cilne Analītika](../tabs/analytics-tab.md) seko līdzi izpildes skaitam, veiksmes līmenim, ilgumam un tendencēm katram workflow. [Brīdinājumi](../tabs/alerts-tab.md) uzrauga kļūdu skaitu, izpildes ilgumu, token vai USD tēriņus un izpildes apjomu laika logā, pēc tam palaiž Jūsu izvēlētu paziņošanas workflow, tāpēc brīdinājums sasniedz Slack, e-pastu, Telegram vai jebkur citur, kur var sasniegt mezgls.

## Novērtēšana

### Iebūvētie novērtējumi

[Cilne Novērtējumi](../tabs/evals-tab.md) ļauj definēt testu komplektus un palaist tos pret Jūsu agenta Workflow:

- Izveidojiet testa gadījumus ar ievadiem un sagaidāmajiem izvadiem vai ģenerējiet tos no komplekta Prompt
- Palaidiet vienu komplektu pret vairākiem modeļiem un salīdziniet to izvades blakus
- Vērtējiet ar Exact Match, Contains vai LLM-as-Judge ar neatkarīgu tiesneša modeli
- Pārskatiet pass/fail, faktisko pret sagaidāmo un izpildes vēsturi

Mainiet Prompt vai modeli, palaidiet komplektu vēlreiz un salīdziniet rezultātus pirms izmaiņas nonāk produkcijā.

## Kontrole

### Cilvēks-cilpā (HITL)

Heym ir iebūvēta [Cilvēks-cilpā](../reference/human-in-the-loop.md) sistēma, kas ļauj agentiem apturēt izpildi, pieprasīt cilvēka pārskatīšanu un atsākt tieši no vietas, kur tie apstājās.

- **Agenta kontrolpunkti** – Iespējojiet `hitlEnabled` jebkurā Agent mezglā, lai tam piešķirtu `request_human_review` rīku. Agents izlemj, kad lēmumam nepieciešama cilvēka uzraudzība, un izsauc rīku ar kopsavilkumu un melnrakstu.
- **Publiskas pārskatīšanas URL** – Katrs pārskatīšanas pieprasījums ģenerē drošu vienreizēju saiti uz `/review/{token}` (168 stundu TTL). Pārskatītāji var **pieņemt**, **rediģēt un turpināt** vai **noraidīt** bez pierakstīšanās.
- **Izpildes momentuzņēmumi** – Workflow iesaldē savu pilno stāvokli (sarunas vēsturi, mainīgos, rīku rezultātus), lai tas atsāktos tieši tur, kur tas tika apturēts pēc pārskatītāja atbildes.
- **Paziņojumu atzars** – Neobligāts `review` izvades rokturis ļauj pievienot paziņojumu plūsmu (Slack, e-pasts, Webhook), kas tiek aktivizēta, kad tiek pieprasīta pārskatīšana.
- **MCP rīku apstiprināšanas politikas** – Rakstiskas HITL vadlīnijas tiek interpretētas apstiprināšanas tvērumos (`always` / `once` / `never`), lai agents varētu automātiski apstiprināt zema riska rīkus un eskalēt augsta riska rīkus.
- **Vairāki kontrolpunkti** – Viena agenta izpilde var tikt apturēta pārskatīšanai vairākas reizes; katrs kontrolpunkts ir neatkarīgs.

Publiskas pārskatīšanas URL, rediģēšana un turpināšana, paziņojumu atzarošana un uz momentuzņēmumiem balstīta atsākšana darbojas no viena un tā paša agenta kontrolpunkta.

Skatiet [Cilvēks-cilpā](../reference/human-in-the-loop.md) pilnajai atsaucei.

### LLM aizsargbarjeras

Heym ir iebūvētas [Aizsargbarjeras](../reference/guardrails.md) gan [LLM](../nodes/llm-node.md), gan [Agent](../nodes/agent-node.md) mezglos, tāpēc Jūs varat bloķēt nedrošu saturu, pirms modeļa atbilde sasniedz pakārtotos soļus.

- **Mezgla līmeņa drošības slēdzis** – Iespējojiet aizsargbarjeras tieši mezglā, kas ģenerē vai apstrādā lietotājam redzamu saturu
- **Plašs politikas pārklājums** – Bloķējiet vardarbību, naida runu, seksuālu saturu, NSFW/vulgārus izteicienus, uzmākšanos, nelikumīgas darbības, personas datu pieprasījumus un Prompt injekcijas mēģinājumus
- **Daudzvalodu noteikšana** – Piemērojiet vienus un tos pašus drošības noteikumus turku, angļu, arābu, spāņu un citās valodās
- **Workflow-dabisks fallback** – Kad ziņojums tiek bloķēts, mezgls izmet tipizētu workflow kļūdu, ko Jūs varat novirzīt caur [Kļūdu apstrādātāju](../nodes/error-handler-node.md)

Drošības politika atrodas tieši LLM un Agent konfigurācijā un tieši pieslēdzas workflow atzarošanai un kļūdu apstrādei.

### Piekļuve, akreditācijas dati un audits

Agenti darbojas ar reāliem akreditācijas datiem, tāpēc piekļuve ir daļa no pārvaldības. [Akreditācijas dati](../reference/credentials.md) tiek šifrēti miera stāvoklī, maskēti pēc izveides un koplietojami ar lietotājiem vai [komandām](../reference/teams.md), un komandas arī koplieto workflow, mainīgos, vector stores un Drive failus. [Vienotā pierakstīšanās](../reference/sso.md) savieno jebkuru OpenID Connect nodrošinātāju, tostarp Okta, Entra ID, Keycloak, Auth0 un Google. [Audita žurnāls](../reference/audit.md) reģistrē katru ar drošību saistīto darbību ar tās veicēju, mērķi un iznākumu, straumējot to kopā ar Jūsu konteinera žurnāliem uz žurnālu kolektoru vai SIEM, ko Jūs jau izmantojat.

### Pašmitināts, Jūs pārvaldāt savus datus

Heym darbojas Jūsu infrastruktūrā. Workflow, akreditācijas dati, izpildes vēsture un izsekošanas dati atrodas Jūsu pašu datubāzē, un modeļa izsaukumi iet no Jūsu serveriem uz izvēlēto nodrošinātāju vai uz modeli, ko Jūs mitinat pats, izmantojot Ollama vai vLLM. Agentiem, kas apstrādā sensitīvus dokumentus, klientu datus vai patentētas zināšanu bāzes, tas bieži ir obligāta prasība.

Heym ir licencēts saskaņā ar **MIT licenci ar Commons Clause nosacījumu**. Pirmkods ir pieejams kā source-available: Jūs varat to brīvi lietot, modificēt un pašmitināt. Commons Clause ierobežo programmatūras pārdošanu, tostarp maksas mitināšanas vai konsultāciju/atbalsta pakalpojumu piedāvāšanu, kuru vērtība lielā mērā izriet no Heym. Komerciālai licencēšanai, uzņēmuma izvietošanai vai profesionālam atbalstam sazinieties ar [enterprise@heym.run](mailto:enterprise@heym.run).

## Publiskot

### API un straumēšana

Workflow ir izsaucami pa HTTP pie `/api/workflows/{workflow_id}/execute`, kas atgriež JSON, un pie `/api/workflows/{workflow_id}/execute/stream`, kas straumē node notikumus kā Server-Sent Events, kamēr darbība norisinās. Abiem ir kopīga workflow līmeņa autentifikācija, pieprasījumu ierobežošana un atbilžu kešošana. Skatiet [Webhooks](../reference/webhooks.md) un [SSE Streaming](../reference/sse-streaming.md).

### MCP (Model Context Protocol) integrācija

Heym ir iebūvēts [MCP](../tabs/mcp-tab.md) atbalsts abās pusēs:

- **Kā klientam**: Agent node izveido savienojumu ar ārējiem MCP serveriem (Filesystem, Browserbase, pielāgoti rīki) izmantojot stdio vai SSE un automātiski izmanto to rīkus
- **Kā serverim**: Workflow ar ieslēgtu MCP kļūst par rīkiem noklusējuma serverī pie `/api/mcp/sse` vai nosauktos serveros ar savu URL un API key, tāpēc Claude Desktop, Cursor un citi MCP klienti var tieši izsaukt Jūsu Heym workflow

Agenti var vienlaikus izmantot vairākus MCP serverus, un jebkurš workflow var kļūt par rīku ārējam MCP klientam.

### Portal: publicējiet workflow kā tērzēšanas saskarnes

Funkcija [Portal](../reference/portal.md) pārvērš jebkuru workflow par publisku tērzēšanas saskarni pie `/chat/{slug}`:

- Neobligāta autentifikācija ar katram lietotājam saviem akreditācijas datiem
- Straumēta izpilde (node progress reāllaikā)
- Failu augšupielādes atbalsts
- Vairāku apmaiņu sarunas vēsture

Komandas izlaiž iekšējos rīkus, klientiem paredzētus čatbotus un ar AI darbinātas veidlapas no viena workflow un URL, bez nepieciešamības rakstīt frontend kodu.

### Ar workflow darbinātas informācijas panelis

Cilne [Dashboard](../tabs/dashboard-tab.md) ir lietotāja veidota atskaišu virsma, kur katrs diagrammas logrīks tiek darbināts ar savu slēpto Heym workflow. Logrīks var izsaukt API, vaicāt BigQuery, meklēt RAG/vector krātuvēs, izpildīt LLM soļus, pārveidot rindas un noslēgt ar [Chart Output node](../nodes/chart-output-node.md). Jūs varat veidot logrīkus manuāli, ģenerēt tos ar AI, vēlāk precizēt, kešot rezultātus un vizuāli pārkārtot režģi.

## Salīdzinājumā ar Workflow automatizācijas rīkiem

Daudzas komandas nonāk pie Heym no Workflow automatizācijas rīkiem. Zemāk esošā tabula salīdzina Heym ar n8n, Zapier un Make.com attiecībā uz iespējām, kas kļūst svarīgas, kad aģenti darbojas produkcijā, un zem tās esošās zemsvītras piezīmes citē oficiālo dokumentāciju, uz kuras balstīts salīdzinājums. Lai iegūtu padziļinātu ieskatu par vienu rīku vienlaikus, skatiet salīdzinājuma lapas [heym.run/compare](https://heym.run/compare).

| Iespēja | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Iebūvēts LLM mezgls | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + statusa atzari | ✓ | ierobežots¹¹ | –¹¹ | ierobežots¹¹ |
| Iebūvēts Agent mezgls (rīku izsaukšana) | ✓ | ✓ | ✓ | ✓ |
| Vairāku aģentu orķestrēšana | ✓ | ✓ | ierobežots | ierobežots |
| Kodēšanas aģentu mezgli (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Iebūvēts RAG / vektoru krātuve | ✓ | ✓ | ierobežots¹ | spraudnis² |
| WebSocket lasīšana / rakstīšana | ✓ | ierobežots¹² | –¹³ | –¹⁴ |
| Dabiskās valodas Workflow veidotājs | ✓ | ierobežots³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Atvērt notiekošu palaišanu tiešraidē redzamajā kanvā | ✓ | ierobežots¹⁹ | ierobežots¹⁹ | –¹⁹ |
| Ar Workflow darbināti informācijas paneļi | ✓ | ierobežots¹⁷ | ierobežots¹⁷ | ierobežots¹⁷ |
| Aģentiska Kanban tāfele | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Prasmju sistēma aģentiem | ✓ | – | – | – |
| Iebūvēts failu disks (koplietošanas saites, komandas) | ✓ | ierobežots²² | ierobežots²² | –²² |
| Pārlūka automatizācijas mezgls (Playwright) | ✓ | ierobežots²³ | ierobežots²³ | –²³ |
| LLM izsekošanas pārbaude | ✓ | ierobežots⁴ | – | ✓ |
| OpenTelemetry izsekošanas eksports | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| LLM Token izmaksu izsekošana (USD) | ✓ | –¹⁵ | –¹⁵ | ierobežots¹⁵ |
| Iebūvēti evals AI Workflow | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | ierobežots⁶ | ierobežots⁷ |
| LLM aizsargbarjeras | ✓ | ✓⁸ | ✓⁸ | ierobežots⁸ |
| Automātiska konteksta saspiešana | ✓ | – | – | – |
| Paralēla DAG izpilde | ✓ | ierobežots⁹ | – | – |
| Pašmitināms, pieejams pirmkods | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Izteiksmju DSL dinamiskajiem datiem | ✓ | ✓ | ierobežots | ✓ |

> **Zemsvītras piezīmes:** ¹ Zapier Knowledge Sources — nav pieejama vektoru krātuve vai iegulšanas kontrole. ² Make.com ir Pinecone/Qdrant moduļi, bet nav vietējā RAG mezgla. ³ n8n AI Workflow Builder ir tikai mākonī pieejama beta versija ar kredītu ierobežojumiem. ⁴ n8n parāda starpposmus; pilnīgai izsekošanai nepieciešami trešo pušu rīki. ⁵ n8n atbalsta AI rīku izsaukumu apstiprināšanu čatā, e-pastā un sadarbības kanālos, bet tas neveic visas izpildes momentuzņēmumu un atsākšanu tā, kā to dara Heym. ⁶ Zapier Human in the Loop atbalsta apstiprināšanu un datu vākšanu Zaps ietvaros, bet tas nav publiskas pārskatīšanas, momentuzņēmuma-atsākšanas kontrolpunkta sistēma. ⁷ Make.com piedāvā Human in the Loop kā Enterprise lietotni ar pārskatīšanas pieprasījumiem un koriģētiem/apstiprinātiem/atceltiem rezultātiem, bet tas joprojām ir ierobežots ar plānu un mazāk aģentiem raksturīgs. ⁸ n8n piegādā īpašu Guardrails mezglu, Zapier piegādā AI Guardrails visos savos AI produktos, un Make.com dokumentē aģentu noteikumus un pārskatīšanas plūsmas, bet ne salīdzināmu atsevišķu aizsargbarjeru funkciju, tāpēc Make ir atzīmēts kā ierobežots. ⁹ n8n pēc noklusējuma izpilda secīgi; paralēlisms prasa apakš-Workflow risinājumus. ¹⁰ Sustainable Use License — bez maksas pašmitināt iekšējai lietošanai, komerciāla tālākizplatīšana ierobežota. ¹¹ Uz 2026. gada 22. aprīli n8n oficiālā dokumentācija apraksta HTTP pakešapstrādi un cilpas/gaidīšanas modeļus, nevis vietēju LLM batch-statusa atzaru, Zapier oficiālā ChatGPT lietotnes dokumentācija neuzskaita nevienu Trigger un tikai vispārīgu API Request beta versiju, un Make oficiālā OpenAI integrācijas lapa piedāvā batch darbības, piemēram, create/watch completed, bet ne pirmās klases statusa atzarošanas LLM mezglu, tāpēc n8n/Make ir atzīmēti kā ierobežoti un Zapier ir atzīmēts kā nepieejams šim konkrētajam Workflow modelim. ¹² n8n oficiālā dokumentācija aptver HTTP Webhook un HTTP Request mezglus, kā arī Code/custom/community paplašināmību, bet es nevarēju atrast pirmās puses WebSocket Trigger/sūtīšanas mezglu, tāpēc n8n ir atzīmēts kā ierobežots. ¹³ Zapier oficiālā dokumentācija aptver ienākošos Webhook un izejošos webhook/API pieprasījumus tikai pa HTTP, nevis vietējus WebSocket Trigger vai sūtīšanas soļus. ¹⁴ Make oficiālā dokumentācija aptver Webhooks moduļus un HTTP(S) pieprasījumu moduļus, bet es nevarēju atrast vietēju WebSocket Trigger vai sūtīšanas moduli. ¹⁵ n8n nav vietējas LLM Token izmaksu izsekošanas; pastāv kopienas risinājumu Workflow, bet tie prasa manuālu instalēšanu un API izsaukumus pēc izpildes (atvērts funkcijas pieprasījums uz 2026. gada maiju). Zapier lietotājiem neparāda Token skaitu uz izpildi vai USD izmaksas; AI soļi patērē tikai uzdevumus. Make.com kredītu informācijas panelis daļēji atspoguļo Token patēriņu Make mitinātajam AI (kopš 2025. gada augusta), bet trešo pušu API atslēgu savienojumi tiek aprēķināti kā 1 operācija = 1 kredīts bez Token skaitīšanas; nav pieejams USD sadalījums pa modeļiem uz izpildi. ¹⁶ Heym izstaro vietējos OpenTelemetry span (viens uz Workflow palaišanu plus viens uz mezglu) pa OTLP/HTTP uz jebkuru saderīgu aizmugursistēmu, ar W3C trace-context izplatīšanu un bez instrumentācijas koda, konfigurējams ar `HEYM_OTEL_*` vides mainīgajiem un pēc noklusējuma atspējots. n8n ir dokumentēta OpenTelemetry izsekošanas integrācija Workflow un mezglu izpildēm. Zapier un Make.com nedokumentē savu Workflow/scenāriju izpildes OpenTelemetry eksportu uz 2026. gada jūniju. ¹⁷ n8n dokumentē Insights informācijas paneli produkcijas izpildes rādītājiem, Zapier dokumentē Zap History plus Task Usage, un Make.com dokumentē Scenario History; tie ir uzraudzības/vēstures virsmas, nevis pielāgoti informācijas paneļa logrīki, ko atbalsta patvaļīga Workflow loģika, kā Heym Dashboard cilne. ¹⁸ Heym Workflow Analyzer palaiž Workflow, kad iespējams, nolasa izpildes rezultātu un ģenerē koplietojamu rediģējamu Markdown atskaiti, kas aptver uzlabojumu jomas, mērķi un soli pa solim uzvedību. n8n dokumentē AI Workflow Builder Workflow izveidei/pilnveidei/atkļūdošanai, Zapier dokumentē AI problēmu novēršanu kļūdainām Zap palaišanām, un Make.com dokumentē scenāriju vēsturi plus AI aģentu spriešanas soļus, bet to publiskā dokumentācija neapraksta tādu pašu uz palaišanu orientētu koplietojamu Workflow analīzes dokumentu. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) uzskaita notiekošas izpildes un var ielādēt datus no iepriekšējas izpildes redaktorā, savukārt [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) redaktorā parāda notiekošas palaišanas statusu. [Make Scenario History](https://help.make.com/scenario-history) dokumentē palaišanas detaļas un žurnālus. To publiskā dokumentācija, pārbaudīta 2026. gada 18. jūlijā, neapraksta Heym precīzo plūsmu: atvērt patvaļīgu notiekošu produkcijas palaišanu no History vai Kanban kartītes, atjaunot tās pašreizējo mezgla momentuzņēmumu un turpināt saņemt mezglu animāciju un Debug žurnālus tajā pašā kanvā. ²⁰ Heym [Codex](../nodes/codex-node.md) un [OpenCode Go](../nodes/opencode-go-node.md) mezgli palaiž īstu kodēšanas aģenta CLI izolētā Heym darbvietā pret GitHub repozitoriju — klonēt, rediģēt, izveidot diff, nosūtīt atzaru, atvērt pull request — kā pirmās klases Workflow soli. Uz 2026. gada 20. jūliju neviens konkurents nedokumentē līdzvērtīgu: n8n [OpenAI node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) aptver čata/asistenta API izsaukumus, nevis repozitorija līmeņa kodēšanas aģentu, un vietējais Codex atbalsts joprojām ir kopienas pieprasījums; Zapier paša blogs dokumentē pretējo virzienu — [Codex vada Zapier rīkus caur Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — nevis Codex kā Zap soli; Make.com OpenAI moduļi piedāvā completions/assistants/batch darbības, nevis kodēšanas aģentu, kas klonē repozitorijus un atver PR. ²¹ Heym [Board tab](../tabs/board-tab.md) ir iebūvēta aģentiska Kanban tāfele, kuras kolonnas izpilda Workflow un kuras kartītes satur kontekstu, sarunas vēsturi, izpildes stāvokli un palaišanas. n8n ([Kanban Tool integration](https://n8n.io/integrations/kanban-tool/)), Zapier ([Kanban Tool integrations](https://zapier.com/apps/kanbantool/integrations)) un Make.com ([Kanban Tool integration](https://www.make.com/en/integrations/kanban-tool)) tikai savienojas ar trešo pušu kanban lietotnēm, piemēram, Kanban Tool, Wekan vai NocoDB; neviens nedokumentē iebūvētu tāfeli, kas izpilda savus Workflow, uz 2026. gada 20. jūliju. ²² n8n glabā izpildes bināros datus iekšēji (pēc izvēles [S3-saderīgā ārējā krātuvē](https://docs.n8n.io/hosting/scaling/external-storage/)), bet nedokumentē lietotājam pieejamu failu disku ar koplietošanas saitēm vai komandas koplietošanu, tāpēc tas ir atzīmēts kā ierobežots. Zapier [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) apstrādā failus tikai Zap palaišanas laikā un [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) glabā nelielas teksta vērtības, tāpēc Zapier ir atzīmēts kā ierobežots. Make.com [data stores](https://help.make.com/l6du-data-stores) glabā strukturētus ierakstus un tā [file handling](https://help.make.com/working-with-files) nodod failus starp lietotnēm bez pastāvīgas iebūvētas krātuves, tāpēc Make ir atzīmēts kā nepieejams. ²³ Heym [Playwright node](../nodes/playwright-node.md) ir pirmās puses pārlūka automatizācija ar vizuālo soļu režīmu, AI ģenerētiem soļiem un pilna koda režīmu. n8n piedāvā tikai kopienas pakotnes, piemēram, [n8n-playwright](https://github.com/toema/n8n-playwright), ar joprojām atvērtu [funkcijas pieprasījumu vietējiem pārlūka automatizācijas mezgliem](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), tāpēc tas ir atzīmēts kā ierobežots. Zapier Agents var [pārlūkot un lasīt lapas, izmantojot tīmekļa pārlūkošanu un Chrome paplašinājumu](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), bet Zapier nedokumentē skriptētu pārlūka automatizācijas soli, tāpēc tas ir atzīmēts kā ierobežots. Make.com dokumentē HTTP moduļus un trešo pušu scraping lietotnes, nevis kādu vietēju pārlūka automatizācijas moduli, uz 2026. gada 20. jūliju.

## Saistītie

- [Ievads](./introduction.md) – Platformas pārskats
- [Ātrā sākšana](./quick-start.md) – Izveidojiet savu pirmo Workflow
- [Workflow analīze](../reference/workflow-analysis.md) – Ģenerējiet koplietojamus, palaišanu apzinātus Workflow pārskatus un uzlabojumu atgriezenisko saiti
- [Dashboard cilne](../tabs/dashboard-tab.md) – Veidojiet uz Workflow balstītus Dashboard ar AI ģenerētiem diagrammu logrīkiem
- [Agent mezgls](../nodes/agent-node.md) – LLM mezgls ar rīku izsaukšanu, MCP un prasmēm
- [Agent arhitektūra](../reference/agent-architecture.md) – Apakšagentu, orķestrētāja un rīku nosūtīšana
- [Board cilne](../tabs/board-tab.md) – Agentiska Kanban tāfele ar Workflow izpildošām kolonnām
- [Codex mezgls](../nodes/codex-node.md) – Palaidiet OpenAI Codex kodēšanas agentu pret GitHub repo
- [OpenCode Go mezgls](../nodes/opencode-go-node.md) – Nodrošinātājneatkarīgs kodēšanas agents drošinātā konteinerā
- [Drive cilne](../tabs/drive-tab.md) – Iebūvēta failu glabātuve ar koplietošanas saitēm, komandām un lielapjoma darbībām
- [Playwright mezgls](../nodes/playwright-node.md) – Pirmās puses pārlūka automatizācija ar AI soļiem un koda režīmu
- [RAG / Vector Store mezgls](../nodes/rag-node.md) – Vektoru meklēšana un dokumentu ievietošana (Qdrant vai Postgres pgvector)
- [AI asistents](../reference/ai-assistant.md) – Dabiskās valodas Workflow veidotājs
- [Cilvēks cilpā](../reference/human-in-the-loop.md) – Agentu kontrolpunkti ar publiskām pārskatīšanas URL
- [Guardrails](../reference/guardrails.md) – Bloķējiet nedrošus Prompt pirms tie sasniedz jūsu modeļus
- [Traces cilne](../tabs/traces-tab.md) – LLM izsaukumu novērojamība
- [Evals cilne](../tabs/evals-tab.md) – Testu kopas AI Workflow
- [Alerts cilne](../tabs/alerts-tab.md) – Sliekšņa brīdinājumi par kļūdām, ilgumu, izmaksām un palaišanas apjomu
- [OpenTelemetry izsekošana](../reference/opentelemetry.md) – Eksportējiet palaišanas, mezglu un rīku spanus pa OTLP
- [Slodzes sadale](../reference/cluster.md) – Koplietojiet palaišanas starp instancēm ar līdera failover
- [Vienotā pieteikšanās](../reference/sso.md) – Pierakstieties ar jebkuru OpenID Connect nodrošinātāju
- [Audita žurnālēšana](../reference/audit.md) – Ar drošību saistītas darbības ar veicēju, mērķi un iznākumu
- [Portāls](../reference/portal.md) – Publicējiet Workflow kā publiskas tērzēšanas UI
- [Paralēlā izpilde](../reference/parallel-execution.md) – Uz DAG balstīta vienlaicīga izpilde
- [MCP cilne](../tabs/mcp-tab.md) – MCP servera un klienta konfigurācija
