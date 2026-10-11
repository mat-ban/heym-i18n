# Novērtējumu (Evals) cilne

**Novērtējumu** cilne ir atsevišķa lapa pie `/evals`. Tā ļauj Jums izveidot novērtējumu komplektus, definēt testu gadījumus un veikt novērtējumus pret Jūsu [Aģentu](../nodes/agent-node.md) darba plūsmām.

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Skatīt Novērtējumu demonstrāciju</a></p>

## Piekļuve

- Noklikšķiniet uz **Novērtējumi** (Evals) paneļa cilnē
- Vai pārejiet uz `/evals`
- Vai izmantojiet **Ctrl+K** (Cmd+K) un izvēlieties "Novērtējumi" no komandu paletes

## Novērtējumu komplekti

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
- **Temperatūra** – Iestatiet modeļa temperatūru (`Exact Match` un `Contains`)
- **Racionālas pieejas centieni** – Iestatiet racionālas pieejas centienus racionāliem modeļiem (`Exact Match` un `Contains`)

### LLM-as-Judge

Ar tiesnesi katrs modelis atbild uz testu ievadi tikai ar komplekta uzvedni, pēc tam tiesnesis novērtē, cik cieši atbilde atbilst sagaidāmajam rezultātam no 0 līdz 100:

- **Modelis tiesnesis** (OpenAI, OpenAI saderīgs vai Gemini) lasa jautājumu, sagaidāmo rezultātu un atbildi, un atgriež rezultātu ar vienas rindas iemeslu. Tas darbojas ar temperatūru `0`, vai ar `zemu` racionālas pieejas centienu rādītāju racionālam modelim, tādējādi tā pati atbilde saņem to pašu spriedumu.
- **Lēmumu modelis tiesnesis** novērtē atbildi piecu līmeņu rubrikā, no *Pilnīgi nepareizi* līdz *Pilnīgi atbilst*. Rezultāts ir varbūtības svērtais stāvoklis šajā rubrikā, tādējādi tas nāk no sadalījuma, ko modelis aprēķinājis, nevis skaitļa, ko tas uzrakstījis.

Šūnas peldošā karte rāda tiesneša iemeslu, vai lēmumu modeļa gadījumā līmeni, rezultātu un tā pārliecību. Latence un tokeni apraksta testēto modeli; tiesneša paša izsaukumi parādās [Izpildēs](./traces-tab.md) zem **Novērtējumu** avota. Modeļa izvēlētājs izslēdz Model Router akreditācijas datus, jo novērtējums salīdzina konkrētus modeļus.

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
