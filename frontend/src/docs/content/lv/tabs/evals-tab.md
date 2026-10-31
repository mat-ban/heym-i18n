# Novērtējumu (Evals) cilne

**Novērtējumu** cilne ir atsevišķa lapa pie `/evals`. Tā ļauj Jums izveidot novērtējumu komplektus, definēt testu gadījumus un veikt novērtējumus pret Jūsu [Aģentu](../nodes/agent-node.md) darba plūsmām. [Aģentu kopa](#agent-suites) izpilda aģentu vai nolasa tā reālās izpildes un pārbauda tā izsauktos rīkus, latentumu, izmaksas USD, marķierus un rīku izsaukumu skaitu.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Skatīt Novērtējumu demonstrāciju</a></p>

## Piekļuve

- Noklikšķiniet uz **Novērtējumi** (Evals) paneļa cilnē
- Vai pārejiet uz `/evals`
- Vai izmantojiet **Ctrl+K** (Cmd+K) un izvēlieties "Novērtējumi" no komandu paletes

## Novērtējumu komplekti

- **Jauna kopa** – Izvēlieties **Uvedņu kopa**, lai pārbaudītu sistēmas uvedni dažādos modeļos, vai **Aģentu kopa**, lai pārbaudītu aģenta reālās izpildes (skatīt [Aģentu kopas](#agent-suites))
- **Kopu atlasītājs** – Parāda uvedņu un aģentu kopas kopā ar tipu blakus katram nosaukumam; rakstiet, lai meklētu
- **Izveidot komplektu** – Definējiet komplektu ar nosaukumu un aprakstu
- **Izvēlēties darba plūsmu** – Izvēlieties, kuru darba plūsmu novērtēt
- **Izvēlēties akreditācijas datus** – API atslēga darba plūsmas izpildei
- **Sistēmas uzvedne** – Rediģējiet komplekta līmeņa sistēmas uzvedni tieši kreisajā panelī
- **Optimizēt uzvedni** – Lūdziet LLM uzlabot pašreizējo sistēmas uzvedni

## Testu gadījumi

- Pievienojiet testu gadījumus ar ievades uzvednēm un sagaidāmajiem rezultātiem
- Katram gadījumam var būt pielāgota sagaidāmā vērtība salīdzināšanai
- Rediģējiet vai dzēsiet gadījumus no komplekta
- **Ģenerēt testu datus** – Izmantojiet izvēlētos akreditācijas datus/modeli, lai automātiski izveidotu testu gadījumus no komplekta uzvednes

## Novērtējumu veikšana

- **Izvēlēties vienu vai vairākus modeļus** – Veiciet to pašu komplektu pret vairākiem modeļiem vienā novērtējumā
- **Novērtēšanas metode** – Izvēlieties `Exact Match`, `Contains` vai `LLM-as-Judge`
- **Tiesnesis** – `LLM-as-Judge` gadījumā, pēc izvēles izvēlieties OpenAI, OpenAI saderīgu (Custom), Gemini (Google) vai [Lēmumu modeli](../nodes/decision-node.md) akreditācijas datus un ierakstiet tiesneša modeli (piemēram, `gpt-4o-mini` vai `jev-latest`), lai novērtētu ar neatkarīgu tiesnesi
- **Izpildes skaits katram testam** – Atkārtojiet katru testu gadījumu vairākas reizes vienā izpildē
- **Iegaumētie iestatījumi** – Kopa tiek atvērta ar tās jaunākās izpildes iestatījumiem: akreditācijas dati, modeļi, vērtēšanas metode un tiesnesis, temperatūra, spriešanas piepūle un izpildes uz testu. Atverot iepriekšēju izpildi, tiek ielādēti tās iestatījumi, tāpēc **Palaist novērtējumus vēlreiz** atkārto to pašu testu
- **Temperatūra** – Iestatiet modeļa temperatūru (`Exact Match` un `Contains`)
- **Spriešanas piepūle** – Iestatiet spriešanas piepūli spriešanas modeļiem no Zema līdz Ļoti augsta un Maks. tāpat kā LLM un Agent mezglos (`Exact Match` un `Contains`)

### LLM-as-Judge

Ar tiesnesi katrs modelis atbild uz testu ievadi tikai ar komplekta uzvedni, pēc tam tiesnesis novērtē, cik cieši atbilde atbilst sagaidāmajam rezultātam no 0 līdz 100:

- **Modelis tiesnesis** (OpenAI, OpenAI saderīgs vai Gemini) lasa jautājumu, sagaidāmo rezultātu un atbildi, un atgriež rezultātu ar vienas rindas iemeslu. Tas darbojas ar temperatūru `0`, vai ar `zemu` racionālas pieejas centienu rādītāju racionālam modelim, tādējādi tā pati atbilde saņem to pašu spriedumu.
- **Lēmumu modelis tiesnesis** novērtē atbildi piecu līmeņu rubrikā, no *Pilnīgi nepareizi* līdz *Pilnīgi atbilst*. Rezultāts ir varbūtības svērtais stāvoklis šajā rubrikā, tādējādi tas nāk no sadalījuma, ko modelis aprēķinājis, nevis skaitļa, ko tas uzrakstījis.

Šūnas novietojuma kartīte parāda tiesneša pamatojumu vai lēmumu modelim līmeni, rezultātu un tā ticamību. Latentums un marķieri raksturo testējamo modeli; paša tiesneša izsaukumi parādās sadaļā [Izsekojumi](./traces-tab.md) zem avota **Novērtējumi**. Tiesneša atlasītājs izslēdz Model Router akreditācijas datus, jo tiesnesim ir jābūt vienam fiksētam modelim. Pārbaudāmo modeļu akreditācijas dati var būt [Model Router](../reference/credentials.md#model-router-auto-model): tā modelis **Auto** izvēlas modeli katram pieprasījumam tieši tāpat kā darbplūsmā.

Bez tiesneša katrs modelis atbild un novērtē savu atbildi vienā pieprasījumā.

Temperatūra un racionālas pieejas centieni šajā režīmā ir slēpti, un izpilde izmanto fiksētus iestatījumus: temperatūra `0.7` standarta modeļiem un `vidēja` racionālas pieejas centieni racionāliem modeļiem (`zema`, kad tie novērtē savas atbildes).

## Rezultāti

- Skatiet izpildes/pārliecības rezultātus katram testu gadījumam
- Pārbaudiet faktiskos un sagaidāmos rezultātus
- Salīdziniet katra modeļa rezultātus blakus, kad izpilde ietver vairākus modeļus
- Pārskatiet izpildes vēsturi iepriekšējiem novērtējumiem; `LLM-as-Judge` izpilde rāda tās tiesneša modeli vēstures sarakstā
- Atveriet vēsturiskas izpildes no rezultātu paneļa un pārbaudiet saglabātos uzvednes/ievades/izvades attēlus
- Atverot iepriekšējo izpildi, tiek ielādēta tās novērtēšanas metode un tiesnesis kreisajā panelī, tādējādi **Atkārtot Novērtējumus** atkārto to pašu novērtējumu
- **Eksportēt** lejupielādē izpildi kā JSON, tostarp `judge_credential_id` un `judge_model`

## Agent Suites

Aģentu kopa pārbauda mezglu [Agent](../nodes/agent-node.md) attiecībā pret tā izpildēm. Tā nolasa tās no [Izsekojumiem](./traces-tab.md), kur katra izpilde jau reģistrē laiku, marķierus, izmaksas un rīku izsaukumus, kā arī var palaist workflow jūsu vietā.

Izveidojiet to caur **Jauna kopa** → **Aģentu kopa** un veiciet trīs soļus:

1. **Aģents** – Izvēlieties workflow un pēc tam tā aģenta mezglu. Tiek parādītas tikai darbplūsmas ar aģenta mezglu; darbplūsma vai aģents, kas vēl nav palaists, tiek parādīts, bet to nevar atlasīt. Atlasītā aģenta iestatījumi (modelis, norādījumi, rīki un ierobežojumi) tiek parādīti labajā pusē, un zemāk tiek parādīts tā workflow tikai lasāms audekls ar iezīmētu aģentu.
2. **Baseline** – Aģenta pēdējās 10 izpildes: latentums p50 un p95, izmaksas par izpildi, marķieri par izpildi un rīku izsaukumi par izpildi, kādus rīkus tas izsauca un cik bieži, kā arī katras izpildes atsevišķie rādītāji. Izpildes, kas beidzās ar kļūdu, ir norādītas, bet izslēgtas no baseline.
3. **Pārbaudes** – Atzīmējiet katru rīku kā **Must call**, **Must not call** vai **Either**. Katrs izsaukuma veids ir norādīts ar tā tipu: Python un mezglu rīki, **MCP** rīki ar to serveri, **apakšaģenti** pēc iezīmes, **apakšdarbplūsmas** pēc nosaukuma un **skills**. Pievienojiet rīku pēc veida un nosaukuma, ja tas vēl nav darbināts, un noņemiet to ar **X**. Iestatiet augšējās robežas latentumam, izmaksām, kopējiem marķieriem un rīku izsaukumiem; katra sākas 20% virs baseline p95 un to var izslēgt.

Saglabāta kopa tiek atvērta cilnē **Rezultāti**, kurai blakus ir **Baseline** un **Rediģēt pārbaudes**:

- **Palaist darbplūsmu** – Izvēlieties izpildes reižu skaitu (līdz 20); četras darbojas vienlaicīgi. Ievades tiek aizpildītas no darbplūsmas jaunākās izpildes un tās var rediģēt, un katra izpilde tās izmanto. Ieslēdziet **Ģenerēt ievades** (dzirksteles ikona), pēc tam izvēlieties akreditācijas datus un modeli, lai modelis katrai izpildei izveidotu atšķirīgu ievadi. Tas nolasa aģenta sistēmas norādījumus un pieturas pie ievadītajām vērtībām: ierakstot pilsētas nosaukumu, tiek ģenerēti citi pilsētu nosaukumi. Katra izpilde izpilda visu workflow tāpat kā jebkura parasta izpilde un tiek reģistrēta Izpildes vēsturē ar trigger `agent_suite`. Lai izlaistu vēlākus soļus, piemēram, e-pasta sūtīšanu, atveriet darbplūsmu ar **Pāriet uz darbplūsmu** panelī un vispirms atspējojiet šos mezglus. **Apturēt** pārtrauc kopas darbību: jaunas izpildes netiek sāktas un pašreizējās tiek atceltas. Kopas izpilde, kuras serveris apstājās, piemēram, restartēšanas laikā, pēc minūtes tiek parādīta kā pārtraukta, nevis paliek iestrēgusi.
- **Rezultāti** – Pēc noklusējuma tiek novērtēta jaunākā kopas izpilde. Katra kopas izpilde tiek saglabāta ar tās datumu izpildes atlasītājā, kur to var atvērt vai dzēst; vai pārslēdzieties uz aģenta pēdējām 10, 20 vai 50 izpildēm, lai iekļautu arī citas tā izpildes. Jūs redzat sekmības rādītāju, cik bieži katra pārbaude tika nokārtota, latentumu, izmaksas, marķierus un rīku izsaukumus blakus saglabātajai baseline, kā arī katru izpildi ar kļūmes iemeslu un saiti uz tās izsekojumu.
- **Pāriet uz darbplūsmu** atver aģenta workflow jaunā cilnē. Nosaukuma laukā **Esc** vai **X** notīra tekstu.

Kā tiek interpretēti skaitļi:

- **Latentums** ir modeļa laiks plus izpildes rīku izsaukumu laiks.
- **Izmaksas** izmanto tādas pašas cenas kā Traces. Modeļa izpilde bez norādītas cenas izlaiž izmaksu pārbaudi, nevis beidzas ar kļūdu.
- Izpilde tiek **ieskaitīta**, kad tā beigusies bez kļūdām un ir izturētas visas pārbaudes.
- Kopa nolasa tikai jūsu pašu izsekojumus, ievērojot to pašu noteikumu kā cilnē Izsekojumi.
- **Izmantot jaunākās izpildes kā bāzlīniju** sadaļā **Rediģēt pārbaudes** aizstāj saglabāto baseline ar aģenta jaunākajām izpildēm.

Kopas baseline nāk no viena no trim avotiem. **Rediģēt pārbaudes** parāda, kurš ir aktīvs blakus **Saglabātā bāzlīnija**:

- aģenta jaunākās izpildes (noklusējums un vērtība, ko ņem **Izmantot jaunākās izpildes kā bāzlīniju**),
- viena pabeigta kopas izpilde,
- manuāli ievadīti skaitļi.

Pēdējie divi tiek iestatīti no [Chat](./chat-tab.md#working-with-evals) vai izmantojot API:

- `PATCH /api/evals/agent-suites/{id}` pieņem `baseline: {"source": "suite_run", "run_id": "…"}` vai `{"source": "manual", "values": {"latency_p95_ms": 3000, "cost_avg_usd": 0.01}}`.
- `POST /api/evals/agent-suites/{id}/runs` pieņem `inputs_list`: vienu ievades objektu katrai izpildei, līdz 20.

### No Chat un MCP

[Chat](./chat-tab.md#working-with-evals) un MCP rīks `heym_chat` var izveidot, mainīt un palaist uvedņu un aģentu kopas:

- Tie paši formulē testa gadījumus un izpildes ievades.
- Tie jautā, kādus akreditācijas datus izmantot pirms uvedņu kopas izveides, ja vien nav piemēroti tikai vieni.
- Tie pievieno saiti uz katru kopu, ko tie piemin šajā lapā.

## Salīdzinošo matricas idejas

Veidojot salīdzinošo matricu aģentu darba plūsmām, iekļaujiet HITL scenārijus kā pirmās klases gadījumus, nevis izturieties pret tiem kā robežgadījumiem.

- Aptveriet visus trīs pārskatīšanas lēmumus: `accepted`, `edited` un `refused`
- Iekļaujiet vairākus izsaukuma avotus, piemēram, redaktora izpildes, portālu, curl/webhook un cron izpildes
- Pievienojiet atkārtotas pārskatīšanas scenārijus, kur viens aģenta izpilde apstājas vairāk nekā vienu reizi
- Pārbaudiet paziņojumu zarus, kas savienoti ar aģenta `review` izvadi
- Apstipriniet uzvedību pēc atteikuma, īpaši, ja vēlākie mezgli dalās uz `$agent.decision`

## Saistītie

- [Kāpēc Heym](../getting-started/why-heym.md) – Novērtējumi kā aģenta dzīves cikla testēšanas posms
- [Aģenta mezgls](../nodes/agent-node.md) – Darba plūsmas, kas tiek novērtētas
- [Akreditācijas datu cilne](./credentials-tab.md) – Akreditācijas dati novērtējumu izpildēm
- [Izpildes cilne](./traces-tab.md) – Detalizēta izpildes pārbaude
- [Darba plūsmu cilne](./workflows-tab.md) – Izveidojiet darba plūsmas, lai novērtētu
- [Izpildes vēsture](../reference/execution-history.md) – Skatiet iepriekšējās izpildes (Vēstures poga galvenē)
- [Kontekstualizēta demonstrācija](../reference/contextual-showcase.md) – Kompakta lapas rokasgrāmata, kas pieejama novērtējumu lapā
