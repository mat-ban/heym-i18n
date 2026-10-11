# Drive cilne

Drive cilne parāda visus failus, kurus ģenerē prasmes visos Jūsu Workflow.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Skatīt Drive demonstrāciju</a></p>

## Pārskats

Faili, kurus ģenerē prasmes (PDF, DOCX, CSV, attēli utt.), tiek automātiski saglabāti un uzskaitīti Drive cilnē. Katrs fails parāda tā nosaukumu, veidu, izmēru, avota mezglu, izveides datumu un komandas koplietošanas stāvokli.

## Iespējas

- **Meklēšana** - Filtrējiet failus pēc nosaukuma, veida vai avota mezgla
- **Kopēt faila ID** - Kopējiet faila UUID starpliktuvē, gatavu ielīmēšanai [Drive](../nodes/drive-node.md) vai [Converter](../nodes/converter-node.md) mezglā
- **Lejupielādēt** - Autentificēta lejupielāde Jūsu failiem un failiem, kas koplietoti ar Jums caur komandām
- **Koplietot** - Izveidojiet koplietojamus lejupielādes saites ar opciju par paroles aizsardzību un derīguma termiņu, vai koplietojiet failu tikai lasīšanai ar Jūsu pašreizējām komandām
- **Dzēst** - Noņemiet failus un to koplietošanas saites
- **Notīrīt visu** - Dzēst visus failus un to koplietošanas saites pēc apstiprinājuma
- **Masveida darbības** - Izvēlieties vairākus failus ar izvēles rūtiņām (Shift-click, lai izvēlētos diapazonu) un vienlaikus piemērojiet to pašu darbību visiem
- **Lappušu pārlūkošana** - Pārlūkojiet lielas failu kolekcijas, ar rindu skaita izvēlni (25 / 50 / 100 / Visi)

## Masveida darbības

Failiem, kas pieder Jums, ir izvēles rūtiņa rindas sākumā (faili, kas koplietoti ar Jums caur komandu, ir tikai lasīšanai un nav izvēlami). Izvēlieties vairākas rindas — vai izmantojiet galvenes izvēles rūtiņu, lai izvēlētos visu lapu, un **Shift-click**, lai izvēlētos diapazonu — tad izmantojiet masveida darbību joslu, kas parādās virs saraksta:

- **Lejupielādēt ZIP** apvieno visus izvēlētos failus vienā ZIP arhīvā un lejupielādē to
- **Masveida darbības** atver vienu dialogu, lai piemērotu vienu iestatījumu katram izvēlētajam failam:
  - **Koplietot visus ar manām komandām** / **Noņemt komandas koplietošanu** vienā klikšķī
  - **Izveidot koplietošanas saiti katram failam**, izmantojot to pašu paroli, derīguma termiņu un maksimālo lejupielāžu iestatījumus
- **Dzēst** noņem visus izvēlētos failus un to koplietošanas saites pēc apstiprinājuma
- **Notīrīt izvēli** atzīmē visu kā neizvēlētu

Dialogs ziņo, cik failiem tas tika piemērots (faili, kas nepieder Jums, tiek izlaisti). Izmantojiet rindu skaita izvēlni **Visi**, lai ielādētu visus failus vienā lapā un izvēlētos visā Jūsu Drive. Ierakstot meklēšanas lodziņā, automātiski tiek mainīta rindu skaita izvēlne uz **Visi**, lai meklēšana aptvertu visus failus, ne tikai pašreizējo lapu; meklēšanas notīrīšana atjauno Jūsu iepriekšējo izvēli.

## Koplietošana

Izveidojiet koplietošanas saites ar:
- **Bez autentifikācijas** - Publiska tokena balstīta lejupielādes URL
- **Pamata autentifikācija** - Paroles aizsargāta saite (lietotājvārds: `file`)
- **Derīguma termiņš** - Opcionāls laika ierobežojums
- **Lejupielādes ierobežojumi** - Opcionāls maksimālais lejupielāžu skaits

Iespējojiet **Koplietot ar manām komandām** failam, lai padarītu to redzamu visām komandām, kurām Jūs pašlaik piederat. Koplietotajiem komandas dalībniekiem ir piekļuve tikai lasīšanai; pārvaldības darbības paliek tikai īpašniekam.

## Aģenta prasmju piekļuve

Prasmes Aģenta mezglā var izvēlēties lasīt Drive failus. Kad **Iespējot Drive failus** ir ieslēgts prasmei, tās Python kods var lasīt pieejamos Drive failus pēc faila ID vai precīza faila nosaukuma, izmantojot ģenerēto `heym_drive.py` palīgu. Iestatījums pēc noklusējuma ir izslēgts.

Skatiet [Drive atsauci](../reference/drive.md) pilnīgai informācijai.

## Saistītie

- [Drive mezgls](../nodes/drive-node.md) - Saraksts ar failiem, metadatu iegūšana, koplietošana ar komandām vai koplietošanas ierobežojumu maiņa no Workflow
- [Failu ģenerēšana](../reference/file-generation.md) - Kā prasmes ģenerē failus
- [Drive atsauce](../reference/drive.md) - Koplietošanas saites, tokeni un tīrīšana
- [Portāls](../reference/portal.md) - Failu saites portāla čata atbildēs
