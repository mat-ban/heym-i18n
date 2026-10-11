# Kodėl Heym

Heym – tai infrastruktūra, skirta AI agentams paleisti ir valdyti produkcinėje aplinkoje. Vienas savarankiškai talpinamas runtime apima kiekvieną agento gyvavimo ciklo etapą.

Prototipo agentui reikia modelio, Prompt ir kelių įrankių. Produkciniam agentui taip pat reikia Trigger ir pakartojimų, išsaugotos būsenos, kai jis pristabdomas laukiant žmogaus, kiekvieno modelio ir įrankio iškvietimo įrašo, kiekvieno paleidimo kainos, testų prieš išleidžiant pakeitimą ir aiškių ribų, ką jis gali daryti savarankiškai. Heym visa tai laiko vienoje vietoje, todėl sistema, kurią suprojektuojate drobėje, yra ta pati sistema, kuri veikia. Kurkite agentines sistemas ir paleiskite jas užtikrintai.

## Vienas Runtime agento gyvavimo ciklui

| Etapas | Ką Heym suteikia |
|---|---|
| **Kūrimas** | Komponuokite agentus ir deterministinius žingsnius drobėje, generuokite juos su [AI Assistant](../reference/ai-assistant.md) arba pradėkite nuo [Templates](../tabs/templates-tab.md) ir perkeliamų įgūdžių. |
| **Orkestravimas** | Koordinuokite agentus, [sub-agentus](../reference/agent-architecture.md), kodavimo agentus, RAG, naršyklės automatizavimą ir įrankius su aiškiu duomenų srautu ir [lygiagrečiu vykdymu](../reference/parallel-execution.md). |
| **Paleidimas** | Paleiskite vykdymus iš [webhooks](../reference/webhooks.md), tvarkaraščių ir įvykių [triggers](../reference/triggers.md), su kiekvieno mazgo pakartojimais, [klaidų apdorojimu](../nodes/error-handler-node.md) ir [apkrovos paskirstymu](../reference/cluster.md) tarp instancijų. |
| **Stebėjimas** | Tikrinkite kiekvieną vykdymą per [istoriją](../reference/execution-history.md), [LLM traces](../tabs/traces-tab.md), kiekvieno paleidimo kainą USD, tiesioginius vykdymus drobėje, [analitiką](../tabs/analytics-tab.md), [perspėjimus](../tabs/alerts-tab.md) ir [OpenTelemetry](../reference/opentelemetry.md) eksportą. |
| **Vertinimas** | Testuokite Prompt ir modelius pagal laukiamus rezultatus [Evals](../tabs/evals-tab.md), su LLM-as-Judge vertinimu ir lygiagrečiu modelių palyginimu. |
| **Kontrolė** | Išlaikykite žmones kontrolėje su [peržiūros kontroliniais taškais](../reference/human-in-the-loop.md) ir [guardrails](../reference/guardrails.md), valdykite prieigą su šifruotais [credentials](../reference/credentials.md), [komandomis](../reference/teams.md), [vienkartiniu prisijungimu](../reference/sso.md) ir [audito pėdsaku](../reference/audit.md). |
| **Prieiga** | Teikite Workflow per REST ir [SSE](../reference/sse-streaming.md), kaip [MCP](../tabs/mcp-tab.md) įrankius, kaip [Portal](../reference/portal.md) pokalbių sąsajas ir kaip [dashboard](../tabs/dashboard-tab.md) valdiklius. |

## Kūrimas

### AI Assistant: kurkite Workflow naudodami natūralią kalbą

[AI Assistant](../reference/ai-assistant.md) – tai pokalbių skydelis Workflow redaktoriuje. Aprašykite, ko norite, pavyzdžiui, „sukurk Workflow, kuris priima vartotojo įvestį, ieško mano žinių bazėje ir atsako naudodamas GPT-4o“, ir asistentas sugeneruos nodes bei edges, kurie bus iš karto pritaikyti drobėje.

- Naudoja Jūsų pačių LLM kredencialus (bet kuris palaikomas modelis)
- Palaiko **balso įvestį** kuriant Workflow be rankų
- Automatiškai pritaiko galiojantį Workflow JSON iš AI atsakymo į drobę
- Transliuoja atsakymus realiuoju laiku

Asistentas veikia tiesiogiai redaktoriuje ir realiuoju laiku transliuoja nodes į drobę, o viskas, ką jis sugeneruoja, išlieka redaguojama taip pat, kaip ranka sudėti nodes.

### Skills sistema

Skills yra perkeliami gebėjimų paketai – `SKILL.md` instrukcijų failas ir pasirinktiniai Python scriptai – kuriuos galima priskirti bet kuriam Agent node.

- Skill instrukcijos pridedamos prie agento system prompt pradžios
- Python failai Skill pakete tampa iškviečiamaisiais tools
- Skills yra daugkartinio naudojimo tarp Workflow ir bendrinami kaip `.zip` archyvai

Tai prilygsta tam, lyg savo agentui vienu priskyrimu duotumėte pareigybės aprašymą ir įrankių rinkinį.

### Workflow Analyzer: paleidimą suprantantis grįžtamasis ryšys

[Workflow Analysis](../reference/workflow-analysis.md) skydelis – tai paleidimą suprantantis dokumentavimo ir grįžtamojo ryšio įrankis, integruotas į redaktorių. Spustelėkite **Analyze**, pasirinkite LLM kredencialus ir modelį, ir Heym sugeneruos redaguojamą Markdown ataskaitą apie dabartinį Workflow.

Skirtingai nuo statinės pastabos, analizatorius pirmiausia paleidžia Workflow, kai tai įmanoma, ir įtraukia vykdymo rezultatą į prompt. Ataskaita apima tobulinimo sritis, Workflow paskirtį ir nuoseklų paaiškinimą, ką atlieka nodes. Kai ataskaita jau egzistuoja, **Reanalyze** transliuoja atskirą peržiūrą, kad galėtumėte priimti naują versiją arba išsaugoti dabartinį bendrinamą dokumentą.

## Orkestravimas

### Integruoti LLM ir agentų mazgai

Heym [Agent Node](../nodes/agent-node.md) vykdo glaudžiai integruotą įrankių iškvietimo ciklą su tiesioginiais Python įrankiais, MCP ryšiais ir nešiojamų įgūdžių sistema, visa tai sukurta produkciniams agentams.

Heym paprastas [LLM node](../nodes/llm-node.md) taip pat viršija vieno prompt-response žingsnio galimybes. Palaikomiems OpenAI ir OpenAI suderinamiems endpoint'ams jis gali perjungti į **Batch API režimą**, kad vienas mazgas pateiktų prompt'ų masyvą pigesne, paslaugų teikėjo native batch užklausa. Tada drobė atskleidžia specialią `batchStatus` šaką, kuri suveikia, kai batch pereina per būsenas, tokias kaip `pending`, `processing` ir `completed`.

Tai reiškia, kad LLM mazgas gali atlikti du dalykus vienu metu:

- Vykdyti pagrindinę batch užklausą ir grąžinti galutinius kiekvieno elemento rezultatus įprastoje šakoje
- Suveikti pranešimų ar registravimo logiką kiekvieną reikšmingą batch būsenos atnaujinimą nepaverčiant srauto į pasirinktinį polling ciklą

Batch vykdymas yra pirmos klasės LLM workflow primityvas, su paslaugų teikėjo ir modelio galimybių patikromis mazgo UI.

**Agent Node** yra agentų orkestravimo Heym centre:

- **Tool calling** – Agentas iteruoja per įrankių iškvietimus cikle, kol pateikia galutinį atsakymą
- **Python tools** – Apibrėžkite pasirinktinius įrankius tiesiogiai su visu Python; agentas juos iškviečia vykdymo metu
- **MCP connections** – Prisijunkite prie bet kurio [Model Context Protocol](https://modelcontextprotocol.io/) serverio (stdio arba SSE) ir agentas automatiškai gauna visus jo įrankius
- **Skills** – Įkelkite `.zip` arba `.md` failą ant agento, kad išplėstumėte jo sistemos kontekstą ir pridėtumėte Python įrankių
- **Sub-workflow calls** – Agentas gali iškviesti kitus Heym workflow kaip įrankius, komponuodamas sudėtingą elgesį be pasirinktinio kodo

Žr. [Agent Node](../nodes/agent-node.md) ir [Agent Architecture](../reference/agent-architecture.md) pilnai nuorodai.

### Daugiaagentis orkestravimas

Heym palaiko **orchestrator pattern** su pirmos klasės vizualiniais primityvais:

- Vienas agentas veikia kaip **orchestrator** (`isOrchestrator: true`) ir jam suteikiamas `call_sub_agent` įrankis
- Jis deleguoja užduotis pavadintiems **sub-agents** toje pačioje drobėje
- Sub-agentai patys gali iškviesti kitus agentus ar sub-workflow (maks. gylis: 5)
- **Parallel execution**: Kai orchestrator iškviečia kelis sub-agentus vienu metu, jie vykdomi lygiagrečiai, kad rezultatai būtų greitesni

Tai leidžia architektūras, tokias kaip planavimo agentas, kuris nukreipia darbą tyrėjui, programuotojui ir apibendrintojui, viskas sujungta vizualiai be pasirinktinio orkestravimo kodo.

Žr. [Agent Architecture](../reference/agent-architecture.md) vykdymo detalių.

### Programavimo agentai kaip workflow mazgai

Heym pateikia du mazgus, kurie vykdo tikrą programavimo agentą kaip workflow žingsnį, o ne pokalbio užbaigimą:

- **[Codex Node](../nodes/codex-node.md)** – Vykdo OpenAI Codex CLI izoliuotoje Heym darbo erdvėje prieš GitHub saugyklą. Palaiko **Sign in with ChatGPT** (PKCE OAuth jūsų Plus/Pro prenumeratoje, jokių mokesčių už token'ą) arba prieigos token'ą, klonuoja saugyklą, leidžia Codex redaguoti kodą ir grąžina `summary`, `diff`, `changedFiles` ir juodraštinį `pullRequestUrl`.
- **[OpenCode Go Node](../nodes/opencode-go-node.md)** – Tas pats saugyklos workflow per nuo paslaugų teikėjo nepriklausomą OpenCode gateway (Kimi, DeepSeek, Qwen ir daugiau), vykdomas **sustiprintame vienkartiniame konteineryje**: visos galimybės atimtos, tik skaitomas root, pid/atminties/CPU limitai. GitHub token'as lieka už smėliadėžės ribų: Heym atlieka kiekvieną git ir GitHub operaciją host pusėje, todėl sugeneruotas kodas negali išgauti push kredencialų.

Tai reiškia, kad workflow gali triage'inti klaidą iš webhook, perduoti saugyklą programavimo agentui, laukti juodraštinio PR ir paskelbti nuorodą Slack, visiškai automatizuotai, su išteklių limitais, konfigūruojamais kiekvienam diegimui.

### Integruotas RAG pipeline

Heym apima [RAG / Vector Store Node](../nodes/rag-node.md) ir valdomą [Vectorstores](../tabs/vectorstores-tab.md) skirtuką. Galite:

- Pasirinkti savo vektorinį backend: **Qdrant** (išorinis serveris) arba **Postgres (pgvector)**, kuris saugo vektorius Heym pačios duomenų bazėje be papildomos paslaugos
- Įterpti dokumentus į vektorinę saugyklą tiesiogiai iš workflow mazgo
- Atlikti semantinę paiešką ir perduoti rezultatus į LLM ar Agent mazgą
- Nuorodyti rezultatus su išraiškomis kaip `$ragNode.results.map("item.payload.content").join("\n\n")`

Heym RAG yra du mazgai su visišku embedding ir retrieval valdymu.

### Naršyklės automatizavimas su Playwright

[Playwright node](../nodes/playwright-node.md) yra pirmos šalies naršyklės automatizavimas drobėje.

- **Steps mode** – Komponuokite navigate, click, type, fill, screenshot, extract ir scroll veiksmus vizualiai
- **AI steps with auto-heal** – Apibūdinkite veiksmą natūralia kalba ir LLM sugeneruoja Playwright veiksmus; nepavykę selektoriai gali būti automatiškai ištaisyti, o sugeneruoti žingsniai gali būti talpinami, kad būtų praleisti būsimi LLM iškvietimai
- **Run Code mode** – Perjunkite mazgą į visą Playwright Python sudėtingiems srautams (išjungta pagal nutylėjimą; veikia Heym sustiprintoje smėliadėžėje, kai įjungta)
- **Authenticated sessions** – Atkurkite cookies/`storageState` prieš vykdymą, patikrinkite prisijungimą su selektoriaus patikra ir grįžkite prie skriptinių prisijungimo žingsnių
- **Network capture** – Pasirinktinai rinkite JSON atsakymus, antraštes, cookies ir naršyklės saugyklą kartu su rezultatais

Heym traktuoja naršyklę kaip įprastą mazgą su tomis pačiomis išraiškomis, kredencialais ir klaidų tvarkymu kaip ir visa kita.

### Expression DSL

Heym [Expression DSL](../reference/expression-dsl.md) suteikia švarią, galingą sintaksę nuorodoms į priešingų mazgų duomenis:

- `$input.text` – Įvesties mazgo duomenys
- `$nodeName.field` – Bet kurio priešingo mazgo išvesties laukas
- `$global.variableName` – Nuolatiniai globalūs kintamieji
- Masyvo pagalbininkai: `.first()`, `.map("field")`, `.join("\n")`

Išraiškos veikia kiekviename string lauke, įskaitant prompt'us, HTTP antraštes, sąlygas ir nustatytas reikšmes, todėl duomenys juda tarp žingsnių aiškiai. DSL subalansuoja galią ir skaitomumą nereikalaujant visų JavaScript žinių.

## Vykdymas

### Trigger, pakartotiniai bandymai ir klaidų keliai

Workflow gali prasidėti iš daugelio vietų. [Input](../nodes/input-node.md) mazgai priima HTTP [webhook](../reference/webhooks.md), [Cron](../nodes/cron-node.md) vykdomas pagal grafiką, o įvykių [trigger](../reference/triggers.md) paleidžia vykdymus iš Telegram, Discord, Slack, IMAP pašto dėžučių, WebSocket srautų, RabbitMQ eilių, failų įkėlimų ir Heym platformos įvykių.

Klaidos apdorojamos grafо viduje. Bet kuris mazgas gali pakartoti bandymą nepavykus su nustatytu bandymų skaičiumi ir laukimu tarp jų, kiekvienas bandymas įrašomas į [vykdymo istoriją](../reference/execution-history.md), o [Error Handler](../nodes/error-handler-node.md) mazgas paleidžiamas automatiškai, kai mazgas nepavyksta, todėl atkūrimas yra paties workflow dalis.

### Lygiagretus DAG vykdymas

Heym workflow vykdytojas naudoja nukreipto aciklinio grafo (DAG) planuoklį. Nepriklausomi mazgai vykdomi lygiagrečiai automatiškai, be jokios konfigūracijos.

- To paties priklausomybės lygio mazgai siunčiami vienu metu į gijų telkinį (`max_workers=8`)
- Kai tik bet kuris mazgas baigia darbą, jo tolesni mazgai suplanuojami
- [Merge Node](../nodes/merge-node.md) sujungia lygiagrečių šakų rezultatus
- Keli workflow vykdymai vykdomi vienu metu; kiekvienas vykdymas yra visiškai izoliuotas

Lygiagretumas yra numatytasis elgesys, nustatomas pagal grafo struktūrą.

Žr. [Lygiagretus vykdymas](../reference/parallel-execution.md).

### Mastelio keitimas per egzempliorius

Nukreipkite antrą Heym egzempliorių į tą pačią PostgreSQL duomenų bazę ir jis prisijungs kaip worker. Fono vykdymai paskirstomi tarp egzempliorių pagal Jūsų nustatytus svorius, vienas išrinktas lyderis palaiko grafikus, įspėjimų vertinimą ir avarijų atkūrimą per failover, o kiekvienas vykdymas įrašo jį vykdžiusį egzempliorių. Žr. [Apkrovos paskirstymas](../reference/cluster.md).

### Agentinė Kanban lenta

[Board tab](../tabs/board-tab.md) yra integruota Kanban lenta, kurioje pačios stulpeliai vykdo workflow. Kortelė yra nuolatinė agentinė užduotis, turinti kontekstą, pokalbio istoriją, vykdymo būseną, išvestis ir workflow vykdymus.

- **Stulpelių workflow grandinės** – Perkėlus kortelę į stulpelį, paleidžiama to stulpelio workflow grandinė; **Agentic Kanban Model** (Jūsų credential + model) susieja kortelės turinį su workflow įvestimis ir paverčia išvestis atgal į skaitomą tekstą
- **Kortelių priedai** – Įmeskite failus ant kortelės; dokumentai išgaunami į tekstą, o vaizdai perduodami vision palaikantiems modeliams prieš kiekvieną vykdymą
- **Tiesioginė vykdymo drobė** – Atidarykite aktyvų vykdymą kortelėje ir stebėkite, kaip jis vykdomas tikroje workflow drobėje, mazgas po mazgo
- **Komandos bendrinimas** – Bendrinkite lentas su vartotojais ar komandomis su skaitymo/rašymo teisėmis; grandinės bendrinamose lentose vykdomos su savininko credential, todėl bendradarbiams niekada nereikia savų
- **Klaidų matomumas** – Nepavykusios kortelės rodo klaidų istorijos indikatorių, o tolesni vykdymai gali pristabdyti laukdami komentarų

Lenta yra natūrali platformos paviršiaus dalis: kortelės, workflow, credential ir tiesioginiai vykdymai visi yra vienoje vietoje.

### Heym Drive: integruota failų saugykla

[Drive tab](../tabs/drive-tab.md) yra failų saugykla, integruota į platformą. Failai, sugeneruoti skills ir workflow (PDF, DOCX, CSV, vaizdai), automatiškai patenka ten, o lentos kortelių priedai taip pat saugomi ten.

- **Bendrinimo nuorodos** – Viešos arba apsaugotos slaptažodžiu (Basic Auth) atsisiuntimo nuorodos su pasirinktiniu galiojimo terminu ir maksimalaus atsisiuntimų skaičiaus apribojimais
- **Komandos bendrinimas** – Bendrinkite failus tik skaitymui su savo komandomis ir pašalinkite visus komandos bendrinimus vienu veiksmu
- **Masiniai veiksmai** – Kelių pasirinkimas su shift-click intervalais, pasirinkimų supakavimas į vieną ZIP atsisiuntimą arba vieno bendrinimo/slaptažodžio/štrynimo nustatymo pritaikymas daugeliui failų vienu metu
- **Agent prieiga** – Skills gali pasirinkti skaityti Drive failus, todėl agent gali dirbti su dokumentais, kuriuos sukūrėte Jūs ar kiti workflow

Sugeneruoti artefaktai gauna nuolatinius, bendrinamus namus platformos viduje.

## Stebėjimas

### LLM pėdsakai

[Pėdsakų skirtukas](../tabs/traces-tab.md) suteikia visišką kiekvieno LLM iškvietimo stebimumą:

- Užklausų ir atsakymų payload duomenys
- Kiekvieno iškvietimo trukmė: `llm_ms`, `tools_ms`, `mcp_list_ms`
- Įrankių iškvietimų pavadinimai, argumentai ir rezultatai
- Modeliui perduoti Skills

Pėdsakų sistema sukurta specialiai agentinio elgesio derinimui, su pilnais užklausų ir atsakymų payload duomenimis bei kiekvieno iškvietimo trukme.

### LLM Token kainos stebėjimas

Kiekvienas LLM iškvietimas Heym aplinkoje automatiškai įkainojamas. [Pėdsakų skirtukas](../tabs/traces-tab.md) rodo kiekvieno pėdsako įvesties ir išvesties Token kiekius kartu su realaus laiko USD kaina, gauta iš sinchronizuotos kainų lentelės.

- **Kaina pagal pėdsaką** – Įvesties Token, išvesties Token ir bendra USD suma rodoma kiekvienoje pėdsako eilutėje
- **Kainų analitika** – KPI kortelės ir kainų pagal modelį diagrama atsinaujina pagal pasirinktą laiko intervalą (1h / 24h / 7d / 30d / Visi)
- **LLM kainų lentelė** – Sistemos lentelė [DataTable skirtuke](../tabs/datatable-tab.md) užpildoma iš Helicone kas 24 valandas; galite perrašyti kainas arba pridėti pasirinktinių eilučių modeliams, kurie dar neįtraukti
- **Trūkstamos kainos įspėjimas** – Pėdsakai modeliams be kainos įrašo rodo tiesioginį įspėjimą su nuoroda į kainų lentelę

Kiekvienas vykdymas turi savo USD kainą, suskirstytą pagal modelį.

### Produkcinių vykdymų atidarymas tiesioginėje drobėje

Produkcinis Workflow lieka tikrinamas po to, kai jis paleidžiamas už redaktoriaus ribų. Atidarykite bet kurį **Vykdomo** įrašą iš bet kurio History dialogo lango arba atidarykite aktyvų vykdymą Agentic Kanban kortelėje, ir Heym prijungs įprastą Workflow redaktorių prie to tikslaus vykdymo.

- Mazgai, kurie jau baigė darbą, iš karto rodomi su savo rezultatais
- Dabartinis mazgas ir laukiantys tolesni mazgai toliau pulsuoja vykdymui progresuojant
- Debug skydelis gauna tuos pačius inkrementinius mazgų rezultatus kaip ir vykdymas, paleistas iš drobės
- Galutinė išvestis ir vykdymo išskyrimai atkeliauja be apklausos ar pasikartojančio vykdymo paleidimo
- Redaktoriaus uždarymas tik atjungia stebėtoją; jis niekada neatšaukia produkcinio Workflow

Stebėtojas naudoja SSE, paremtą tarp darbuotojų bendrinamu vykdymo momentiniu vaizdu, todėl jis veikia su Webhook, tvarkaraščio, pokalbio, MCP, integracijos ir Board Trigger, net kai vykdymą valdo kitas backend darbuotojas.

### OpenTelemetry, analitika ir įspėjimai

Heym siunčia [OpenTelemetry](../reference/opentelemetry.md) span duomenis kiekvienam Workflow vykdymui, mazgo vykdymui ir Agent įrankio iškvietimui, eksportuojamus per OTLP/HTTP į Jaeger, Grafana Tempo, Honeycomb, Datadog ar bet kurią kitą suderinamą backend sistemą.

[Analitikos](../tabs/analytics-tab.md) skirtukas seka vykdymų skaičių, sėkmės rodiklį, trukmę ir tendencijas pagal kiekvieną Workflow. [Įspėjimai](../tabs/alerts-tab.md) stebi klaidų skaičių, vykdymo trukmę, Token ar USD išlaidas ir vykdymų apimtį per laiko intervalą, tada paleidžia Jūsų pasirinktą pranešimo Workflow, kad įspėjimas pasiektų Slack, el. paštą, Telegram ar bet kurią kitą vietą, kurią gali pasiekti mazgas.

## Vertinimas

### Integruoti vertinimai

[Vertinimų skirtukas](../tabs/evals-tab.md) leidžia apibrėžti testų rinkinius ir vykdyti juos su agentų Workflow:

- Kurkite testų atvejus su įvestimis ir laukiamais rezultatais arba generuokite juos iš rinkinio Prompt
- Vykdykite vieną rinkinį su keliais modeliais ir lyginkite jų rezultatus greta
- Vertinkite pagal Exact Match, Contains arba LLM-as-Judge su nepriklausomu vertintojo modeliu
- Peržiūrėkite pass/fail, faktinius vs laukiamus rezultatus ir vykdymų istoriją

Pakeiskite Prompt ar modelį, iš naujo paleiskite rinkinį ir palyginkite rezultatus prieš pakeitimui pasiekiant produkciją.

## Kontrolė

### Human-in-the-Loop (HITL)

Heym turi integruotą [Human-in-the-Loop](../reference/human-in-the-loop.md) sistemą, leidžiančią agentams pristabdyti vykdymą, paprašyti žmogaus peržiūros ir tęsti tiksliai nuo tos vietos, kur jie sustojo.

- **Agentų kontroliniai taškai** – Įjunkite `hitlEnabled` bet kuriame Agent mazge, kad jam būtų suteiktas `request_human_review` įrankis. Agentas nusprendžia, kada sprendimui reikia žmogaus priežiūros, ir iškviečia įrankį su santrauka ir juodraščiu.
- **Viešos peržiūros URL** – Kiekviena peržiūros užklausa sugeneruoja saugią vienkartinę nuorodą adresu `/review/{token}` (168 valandų galiojimo laikas). Peržiūrėtojai gali **priimti**, **redaguoti ir tęsti** arba **atmesti** neprisijungę.
- **Vykdymo momentinės kopijos** – Workflow užšaldo visą savo būseną (pokalbio istoriją, kintamuosius, įrankių rezultatus), kad galėtų tęsti tiksliai nuo tos vietos, kur pristabdė, kai peržiūrėtojas atsako.
- **Pranešimų šaka** – Pasirenkamas `review` išvesties handle leidžia prijungti pranešimų srautą (Slack, el. paštas, Webhook), kuris suveikia, kai užklausiama peržiūros.
- **MCP įrankių patvirtinimo taisyklės** – Rašytinės HITL gairės interpretuojamos į patvirtinimo apimtis (`always` / `once` / `never`), kad agentas galėtų automatiškai patvirtinti mažos rizikos įrankius ir eskaluoti didelės rizikos įrankius.
- **Keli kontroliniai taškai** – Vienas agento vykdymas gali pristabdyti peržiūrai kelis kartus; kiekvienas kontrolinis taškas yra nepriklausomas.

Viešos peržiūros URL, redagavimas ir tęsimas, pranešimų šakojimas ir momentinių kopijų pagrindu veikiantis tęsimas – visa tai veikia iš to paties agento kontrolinio taško.

Visą nuorodą rasite [Human-in-the-Loop](../reference/human-in-the-loop.md).

### LLM apsaugos priemonės

Heym turi integruotas [Apsaugos priemones](../reference/guardrails.md) tiek [LLM](../nodes/llm-node.md), tiek [Agent](../nodes/agent-node.md) mazguose, todėl galite užblokuoti nesaugų turinį prieš modelio atsakymui pasiekiant tolesnius veiksmus.

- **Mazgo lygio saugos jungiklis** – Įjunkite apsaugos priemones tiesiogiai mazge, kuris generuoja ar apdoroja vartotojui skirtą turinį
- **Plati taisyklių aprėptis** – Blokuokite smurtą, neapykantos kalbą, seksualinį turinį, NSFW/necenzūrinius žodžius, priekabiavimą, neteisėtą veiklą, asmens duomenų užklausas ir Prompt injection bandymus
- **Daugiakalbis aptikimas** – Taikykite tas pačias saugos taisykles turkų, anglų, arabų, ispanų ir kitomis kalbomis
- **Workflow natūralus atsarginis variantas** – Kai žinutė užblokuojama, mazgas išmeta tipizuotą Workflow klaidą, kurią galite nukreipti per [Klaidų tvarkyklę](../nodes/error-handler-node.md)

Saugos politika gyvena tiesiogiai LLM ir Agent konfigūracijoje ir tiesiogiai jungiasi prie Workflow šakojimo ir klaidų tvarkymo.

### Prieiga, kredencialai ir auditas

Agentai veikia su tikrais kredencialais, todėl prieiga yra valdymo dalis. [Kredencialai](../reference/credentials.md) yra šifruojami saugykloje, užmaskuojami po sukūrimo ir gali būti bendrinami su vartotojais ar [komandomis](../reference/teams.md), o komandos taip pat bendrina Workflow, kintamuosius, vektorines saugyklas ir Drive failus. [Vienkartinis prisijungimas](../reference/sso.md) jungiasi prie bet kurio OpenID Connect teikėjo, įskaitant Okta, Entra ID, Keycloak, Auth0 ir Google. [Audito žurnalas](../reference/audit.md) įrašo kiekvieną su saugumu susijusį veiksmą su jo atlikėju, tikslu ir rezultatu, transliuojamą kartu su Jūsų konteinerio žurnalais į žurnalų rinkiklį ar SIEM, kurį jau naudojate.

### Savarankiškai talpinama, Jūs valdote savo duomenis

Heym veikia Jūsų infrastruktūroje. Workflow, kredencialai, vykdymo istorija ir pėdsakai gyvena Jūsų pačių duomenų bazėje, o modelių užklausos keliauja iš Jūsų serverių pas Jūsų pasirinktą teikėją arba pas modelį, kurį talpinate patys per Ollama ar vLLM. Agentams, kurie apdoroja jautrius dokumentus, klientų duomenis ar patentuotas žinių bazes, tai dažnai yra griežtas reikalavimas.

Heym licencijuojamas pagal **MIT licenciją su Commons Clause sąlyga**. Pirminis kodas yra prieinamas: galite jį naudoti, modifikuoti ir savarankiškai talpinti laisvai. Commons Clause apriboja programinės įrangos pardavimą, įskaitant mokamo talpinimo ar konsultavimo/palaikymo paslaugų siūlymą, kurių vertė iš esmės kyla iš Heym. Dėl komercinės licencijos, įmonės diegimų ar profesionalaus palaikymo susisiekite [enterprise@heym.run](mailto:enterprise@heym.run).

## Publikavimas

### API ir srautinis perdavimas

Workflow yra iškviečiami per HTTP adresu `/api/workflows/{workflow_id}/execute`, kuris grąžina JSON, ir adresu `/api/workflows/{workflow_id}/execute/stream`, kuris vykdymo metu transliuoja mazgų įvykius kaip Server-Sent Events. Abu jie naudoja tą patį workflow lygio autentifikavimą, užklausų dažnio ribojimą ir atsakymų podėliavimą. Žr. [Webhooks](../reference/webhooks.md) ir [SSE Streaming](../reference/sse-streaming.md).

### MCP (Model Context Protocol) integracija

Heym turi natūralų [MCP](../tabs/mcp-tab.md) palaikymą abiejose pusėse:

- **Kaip klientas**: Agent mazgai prisijungia prie išorinių MCP serverių (Filesystem, Browserbase, pasirinktiniai įrankiai) per stdio arba SSE ir automatiškai naudoja jų įrankius
- **Kaip serveris**: Workflow su įjungtu MCP tampa įrankiais numatytajame serveryje adresu `/api/mcp/sse` arba vardiniuose serveriuose su savo URL ir API raktu, todėl Claude Desktop, Cursor ir kiti MCP klientai gali tiesiogiai iškviesti Jūsų Heym workflow

Agentai gali vienu metu naudoti kelis MCP serverius, o bet kuris workflow gali tapti įrankiu išoriniam MCP klientui.

### Portal: Publikuokite Workflow kaip pokalbių sąsajas

[Portal](../reference/portal.md) funkcija paverčia bet kurį workflow vieša pokalbių sąsaja adresu `/chat/{slug}`:

- Pasirenkama autentifikacija su kiekvieno naudotojo kredencialais
- Srautinis vykdymas (realaus laiko mazgų eiga)
- Failų įkėlimo palaikymas
- Kelių ėjimų pokalbio istorija

Komandos pristato vidinius įrankius, klientams skirtus pokalbių robotus ir AI pagrįstas formas iš vieno workflow ir URL, nereikia rašyti jokio frontend kodo.

### Workflow pagrįsti prietaisų skydeliai

[Dashboard tab](../tabs/dashboard-tab.md) yra naudotojo sukurta ataskaitų sritis, kurioje kiekvienas diagramos valdiklis yra pagrįstas savo atskiru paslėptu Heym workflow. Valdiklis gali iškviesti API, užklausti BigQuery, ieškoti RAG/vektorių saugyklose, vykdyti LLM veiksmus, transformuoti eilutes ir užbaigti su [Chart Output node](../nodes/chart-output-node.md). Galite kurti valdiklius rankiniu būdu, generuoti juos su AI, vėliau juos koreguoti, podėliuoti rezultatus ir vizualiai pertvarkyti tinklelį.

## Palyginimas su Workflow automatizavimo įrankiais

Daug komandų į Heym ateina iš Workflow automatizavimo įrankių. Žemiau esančioje lentelėje Heym lyginamas su n8n, Zapier ir Make.com pagal galimybes, kurios tampa svarbios, kai agentai pradedami naudoti produkcinėje aplinkoje, o po lentele esančios išnašos nurodo oficialią dokumentaciją, kuria grindžiamas palyginimas. Norėdami išsamiau susipažinti su atskirais įrankiais, žr. palyginimų puslapius [heym.run/compare](https://heym.run/compare).

| Galimybė | Heym | n8n | Zapier | Make.com |
|---|---|---|---|---|
| Integruotas LLM mazgas | ✓ | ✓ | ✓ | ✓ |
| LLM Batch API + būsenos šakos | ✓ | ribota¹¹ | –¹¹ | ribota¹¹ |
| Integruotas Agent mazgas (įrankių iškvietimas) | ✓ | ✓ | ✓ | ✓ |
| Kelių agentų orkestravimas | ✓ | ✓ | ribota | ribota |
| Programavimo agento mazgai (Codex, OpenCode) | ✓ | –²⁰ | –²⁰ | –²⁰ |
| Integruotas RAG / vektorinė saugykla | ✓ | ✓ | ribota¹ | plugin² |
| WebSocket skaitymas / rašymas | ✓ | ribota¹² | –¹³ | –¹⁴ |
| Workflow kūrimas natūralia kalba | ✓ | ribota³ | ✓ | ✓ |
| Workflow Analyzer | ✓ | –¹⁸ | –¹⁸ | –¹⁸ |
| Vykdomo paleidimo atidarymas tiesioginiame kanve | ✓ | ribota¹⁹ | ribota¹⁹ | –¹⁹ |
| Workflow pagrįsti prietaisų skydeliai | ✓ | ribota¹⁷ | ribota¹⁷ | ribota¹⁷ |
| Agentinė Kanban lenta | ✓ | –²¹ | –²¹ | –²¹ |
| MCP (Model Context Protocol) | ✓ | ✓ | ✓ | ✓ |
| Įgūdžių sistema agentams | ✓ | – | – | – |
| Integruotas failų diskas (bendrinimo nuorodos, komandos) | ✓ | ribota²² | ribota²² | –²² |
| Naršyklės automatizavimo mazgas (Playwright) | ✓ | ribota²³ | ribota²³ | –²³ |
| LLM trace peržiūra | ✓ | ribota⁴ | – | ✓ |
| OpenTelemetry trace eksportas | ✓ | ✓¹⁶ | –¹⁶ | –¹⁶ |
| LLM token sąnaudų stebėjimas (USD) | ✓ | –¹⁵ | –¹⁵ | ribota¹⁵ |
| Integruoti evals AI workflow | ✓ | ✓ | – | – |
| Human-in-the-Loop (HITL) | ✓ | ✓⁵ | ribota⁶ | ribota⁷ |
| LLM guardrails | ✓ | ✓⁸ | ✓⁸ | ribota⁸ |
| Automatinis konteksto suspaudimas | ✓ | – | – | – |
| Lygiagretus DAG vykdymas | ✓ | ribota⁹ | – | – |
| Savarankiškai talpinamas, atviras kodas | ✓ MIT + Commons Clause | ✓ fair-code¹⁰ | – | – |
| Expression DSL dinaminiams duomenims | ✓ | ✓ | ribota | ✓ |

> **Išnašos:** ¹ Zapier Knowledge Sources — nėra atidengtos vektorinės saugyklos ar embedding valdymo. ² Make.com turi Pinecone/Qdrant modulius, bet neturi natūralaus RAG mazgo. ³ n8n AI Workflow Builder yra tik debesijos beta versija su kreditų limitais. ⁴ n8n rodo tarpinius žingsnius; pilnam trace reikia trečiųjų šalių įrankių. ⁵ n8n palaiko AI įrankių iškvietimų patvirtinimus per pokalbių, el. pašto ir bendradarbiavimo kanalus, bet nepadaro viso vykdymo momentinės kopijos ir neatnaujina jo taip, kaip tai daro Heym. ⁶ Zapier Human in the Loop palaiko patvirtinimus ir duomenų rinkimą Zap viduje, bet tai nėra viešos peržiūros, momentinės kopijos atnaujinimo kontrolės punktų sistema. ⁷ Make.com siūlo Human in the Loop kaip Enterprise programėlę su peržiūros užklausomis ir pakoreguotais/patvirtintais/atšauktais rezultatais, bet ji išlieka ribojama pagal planą ir mažiau pritaikyta agentams. ⁸ n8n pateikia specialų Guardrails mazgą, Zapier pateikia AI Guardrails visuose savo AI produktuose, o Make.com dokumentuoja agentų taisykles ir peržiūros srautus, bet ne panašią atskirą guardrails funkciją, todėl Make pažymėtas kaip ribotas. ⁹ n8n pagal numatytuosius nustatymus vykdo nuosekliai; lygiagretumui reikia sub-workflow sprendimų. ¹⁰ Sustainable Use License — nemokama savarankiškai talpinti vidiniam naudojimui, komercinis platinimas ribojamas. ¹¹ Nuo 2026 m. balandžio 22 d. n8n oficiali dokumentacija aprašo HTTP paketų apdorojimą ir ciklų/laukimo šablonus, o ne natūralią LLM batch būsenos šaką, Zapier oficiali ChatGPT programėlės dokumentacija nenurodo jokių trigger ir tik bendrą API Request beta versiją, o Make oficialus OpenAI integracijos puslapis atidengia batch veiksmus, tokius kaip create/watch completed, bet ne pirmos klasės būsenos šakojimosi LLM mazgą, todėl n8n/Make pažymėti kaip riboti, o Zapier pažymėtas kaip nepalaikantis šio konkretaus workflow šablono. ¹² n8n oficiali dokumentacija apima HTTP Webhook ir HTTP Request mazgus bei Code/custom/community išplėtimą, bet neradau pirmosios šalies WebSocket trigger/send mazgo, todėl n8n pažymėtas kaip ribotas. ¹³ Zapier oficiali dokumentacija apima gaunamuosius webhook ir siunčiamuosius webhook/API užklausas tik per HTTP, o ne natūralius WebSocket trigger ar send žingsnius. ¹⁴ Make oficiali dokumentacija apima Webhooks modulius ir HTTP(S) užklausų modulius, bet neradau natūralaus WebSocket trigger ar send modulio. ¹⁵ n8n neturi natūralaus LLM token sąnaudų stebėjimo; bendruomenės sprendimų workflow egzistuoja, bet reikia rankinio įdiegimo ir API iškvietimų po vykdymo (atvira funkcijos užklausa nuo 2026 m. gegužės mėn.). Zapier neatskleidžia naudotojams token skaičiaus per vykdymą ar USD sąnaudų; AI žingsniai naudoja tik užduotis. Make.com kreditų prietaisų skydelis iš dalies atspindi token suvartojimą Make talpinamam AI (nuo 2025 m. rugpjūčio mėn.), bet trečiųjų šalių API raktų jungtys apmokestinamos kaip 1 operacija = 1 kreditas be token skaičiavimo; nėra USD suskirstymo pagal modelį per vykdymą. ¹⁶ Heym siunčia natūralius OpenTelemetry span (po vieną kiekvienam workflow paleidimui ir po vieną kiekvienam mazgui) per OTLP/HTTP į bet kurią suderinamą backend sistemą, su W3C trace-context sklaida ir be instrumentavimo kodo, konfigūruojama per `HEYM_OTEL_*` aplinkos kintamuosius ir pagal numatytuosius nustatymus išjungta. n8n turi dokumentuotą OpenTelemetry trace integraciją workflow ir mazgų vykdymams. Zapier ir Make.com nedokumentuoja savo workflow/scenario vykdymų OpenTelemetry eksporto nuo 2026 m. birželio mėn. ¹⁷ n8n dokumentuoja Insights prietaisų skydelį produkcinio vykdymo metrikai, Zapier dokumentuoja Zap History ir Task Usage, o Make.com dokumentuoja Scenario History; tai stebėjimo/istorijos paviršiai, o ne pasirinktiniai prietaisų skydelio valdikliai, pagrįsti savavališka workflow logika, kaip Heym Dashboard skirtukas. ¹⁸ Heym Workflow Analyzer, kai įmanoma, paleidžia workflow, nuskaito vykdymo rezultatą ir sugeneruoja bendrinamą redaguojamą Markdown ataskaitą, apimančią tobulinimo sritis, paskirtį ir nuoseklų veikimo aprašymą. n8n dokumentuoja AI Workflow Builder, skirtą workflow kurti/tobulinti/derinti, Zapier dokumentuoja AI trikčių šalinimą klaidingiems Zap paleidimams, o Make.com dokumentuoja scenario istoriją ir AI agento samprotavimo žingsnius, bet jų vieša dokumentacija neaprašo tokio paties vykdymą suprantančio bendro workflow analizės dokumento. ¹⁹ [n8n All executions](https://docs.n8n.io/workflows/executions/all-executions/) išvardija vykdomus paleidimus ir gali įkelti duomenis iš ankstesnio vykdymo į redaktorių, o [Zapier run statuses](https://help.zapier.com/hc/en-us/articles/20505304170637-Review-run-statuses-in-Zap-workflows) atidengia vykdomą būseną savo redaktoriuje. [Make Scenario History](https://help.make.com/scenario-history) dokumentuoja vykdymo detales ir žurnalus. Jų vieša dokumentacija, patikrinta 2026 m. liepos 18 d., neaprašo tikslaus Heym srauto: atidaryti savavališką vykdomą produkcinį paleidimą iš History ar Kanban kortelės, atkurti dabartinę mazgo momentinę kopiją ir toliau tame pačiame kanve gauti mazgų animaciją bei Debug žurnalus. ²⁰ Heym [Codex](../nodes/codex-node.md) ir [OpenCode Go](../nodes/opencode-go-node.md) mazgai paleidžia tikrą programavimo agento CLI izoliuotoje Heym darbo erdvėje su GitHub saugykla — klonuoja, redaguoja, sukuria diff, įkelia šaką, atidaro pull request — kaip pirmos klasės workflow žingsnį. Nuo 2026 m. liepos 20 d. joks konkurentas nedokumentuoja atitikmens: n8n [OpenAI node](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-langchain.openai) apima chat/assistant API iškvietimus, o ne saugyklos lygio programavimo agentą, ir natūralus Codex palaikymas išlieka bendruomenės užklausa; Zapier savo tinklaraštyje dokumentuoja priešingą kryptį — [Codex valdo Zapier įrankius per Zapier MCP](https://zapier.com/blog/automate-codex-zapier-mcp/) — o ne Codex kaip Zap žingsnį; Make.com OpenAI moduliai atidengia completions/assistants/batch veiksmus, o ne programavimo agentą, kuris klonuoja saugyklas ir atidaro PR. ²¹ Heym [Board tab](../tabs/board-tab.md) yra integruota agentinė Kanban lenta, kurios stulpeliai vykdo workflow, o kortelės turi kontekstą, pokalbio istoriją, vykdymo būseną ir paleidimus. n8n ([Kanban Tool integration](https://n8n.io/integrations/kanban-tool/)), Zapier ([Kanban Tool integrations](https://zapier.com/apps/kanbantool/integrations)) ir Make.com ([Kanban Tool integration](https://www.make.com/en/integrations/kanban-tool)) tik jungiasi prie trečiųjų šalių kanban programėlių, tokių kaip Kanban Tool, Wekan ar NocoDB; nė vienas nedokumentuoja integruotos lentos, kuri vykdytų savo workflow, nuo 2026 m. liepos 20 d. ²² n8n saugo vykdymo dvejetainius duomenis viduje (pasirinktinai [S3-suderinamoje išorinėje saugykloje](https://docs.n8n.io/hosting/scaling/external-storage/)), bet nedokumentuoja naudotojui skirto failų disko su bendrinimo nuorodomis ar komandos bendrinimu, todėl pažymėtas kaip ribotas. Zapier [Files by Zapier](https://zapier.com/apps/files-by-zapier/integrations) apdoroja failus tik Zap paleidimo metu, o [Storage by Zapier](https://help.zapier.com/hc/en-us/articles/8496293271053-Save-and-retrieve-data-from-Zaps) saugo nedideles tekstines reikšmes, todėl Zapier pažymėtas kaip ribotas. Make.com [data stores](https://help.make.com/l6du-data-stores) saugo struktūrizuotus įrašus, o jo [file handling](https://help.make.com/working-with-files) perduoda failus tarp programėlių be nuolatinės integruotos saugyklos, todėl Make pažymėtas kaip nepalaikantis. ²³ Heym [Playwright node](../nodes/playwright-node.md) yra pirmosios šalies naršyklės automatizavimas su vizualiu žingsnių režimu, AI sugeneruotais žingsniais ir viso kodo režimu. n8n siūlo tik bendruomenės paketus, tokius kaip [n8n-playwright](https://github.com/toema/n8n-playwright), su vis dar atvira [funkcijos užklausa dėl natūralių naršyklės automatizavimo mazgų](https://community.n8n.io/t/front-end-web-mobile-app-test-automation-nodes/129796), todėl pažymėtas kaip ribotas. Zapier Agents gali [naršyti ir skaityti puslapius per web browsing ir Chrome plėtinį](https://help.zapier.com/hc/en-us/articles/29025734470925-Use-Zapier-Agents-Chrome-extension), bet Zapier nedokumentuoja jokio scenarijumi pagrįsto naršyklės automatizavimo žingsnio, todėl pažymėtas kaip ribotas. Make.com dokumentuoja HTTP modulius ir trečiųjų šalių scraping programėles, o ne kokį nors natūralų naršyklės automatizavimo modulį, nuo 2026 m. liepos 20 d.

## Susiję

- [Įvadas](./introduction.md) – Platformos apžvalga
- [Greita pradžia](./quick-start.md) – Sukurkite savo pirmąjį Workflow
- [Workflow analizė](../reference/workflow-analysis.md) – Generuokite bendrus su paleidimais susietus Workflow ataskaitas ir tobulinimo grįžtamąjį ryšį
- [Dashboard skirtukas](../tabs/dashboard-tab.md) – Kurkite Workflow pagrįstus Dashboard su AI generuojamais diagramų valdikliais
- [Agent Node](../nodes/agent-node.md) – LLM node su įrankių iškvietimu, MCP ir įgūdžiais
- [Agent architektūra](../reference/agent-architecture.md) – Sub-agentai, orkestratorius ir įrankių paskirstymas
- [Board skirtukas](../tabs/board-tab.md) – Agentinis Kanban board su Workflow vykdančiomis stulpeliais
- [Codex Node](../nodes/codex-node.md) – Paleiskite OpenAI Codex kodavimo agentą prieš GitHub repo
- [OpenCode Go Node](../nodes/opencode-go-node.md) – Nuo tiekėjo nepriklausomas kodavimo agentas užkietintame konteineryje
- [Drive skirtukas](../tabs/drive-tab.md) – Integruota failų saugykla su bendrinimo nuorodomis, komandomis ir masiniais veiksmais
- [Playwright Node](../nodes/playwright-node.md) – Pirmosios šalies naršyklės automatizavimas su AI žingsniais ir kodo režimu
- [RAG / Vector Store Node](../nodes/rag-node.md) – Vektorinė paieška ir dokumentų įterpimas (Qdrant arba Postgres pgvector)
- [AI asistentas](../reference/ai-assistant.md) – Natūralios kalbos Workflow kūrėjas
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Agentų kontroliniai taškai su viešomis peržiūros URL
- [Guardrails](../reference/guardrails.md) – Užblokuokite nesaugius Prompt prieš jiems pasiekiant Jūsų modelius
- [Traces skirtukas](../tabs/traces-tab.md) – LLM iškvietimų stebimumas
- [Evals skirtukas](../tabs/evals-tab.md) – AI Workflow testų rinkiniai
- [Alerts skirtukas](../tabs/alerts-tab.md) – Slenksčio įspėjimai apie klaidas, trukmę, kainą ir paleidimų apimtį
- [OpenTelemetry Tracing](../reference/opentelemetry.md) – Eksportuokite paleidimų, node ir įrankių span per OTLP
- [Load Distribution](../reference/cluster.md) – Bendrinkite paleidimus tarp instancijų su leader failover
- [Single Sign-On](../reference/sso.md) – Prisijunkite per bet kurį OpenID Connect tiekėją
- [Audit Logging](../reference/audit.md) – Su saugumu susiję veiksmai su vykdytoju, tikslu ir rezultatu
- [Portal](../reference/portal.md) – Publikuokite Workflow kaip viešas pokalbių UI
- [Parallel Execution](../reference/parallel-execution.md) – DAG pagrįstas lygiagretus vykdymas
- [MCP skirtukas](../tabs/mcp-tab.md) – MCP serverio ir kliento konfigūracija
