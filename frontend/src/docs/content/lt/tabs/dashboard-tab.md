# Valdymo pultas

**Valdymo pulto** skirtukas yra Grafana stiliaus erdvė, kurioje kuriate diagramų valdiklių tinklus. Kiekvienas valdiklis yra generuojamas iš savo paslėpto Heym workflow rezultato, todėl bet kokie duomenys, kuriuos galite gauti workflow — duomenų bazės užklausos, API skambučiai, RAG paieškos, LLM išvestis — gali tapti diagrama. Galite turėti kelis valdymo pultus ir dalintis kiekvienu su žmonėmis ar komandomis.

## Valdymo pultai

Kiekvienas pradeda nuo vieno valdymo pulto, sukurtos pirmą kartą atidarius skirtuką. Naudokite valdymo pulto pasirinkimo mygtuką viršuje, kad pereitumėte tarp valdymo pultų, ir **+** šalia jo, kad sukurtumėte naują. Pasirinkimo sąraše pirmiausia rodomi jūsų patys valdymo pultai, o po to tie, kurie buvo su jumis pasidalinti, pažymėti asmens, kuris juos pasidalino, vardu.

Skirtukas atidaro paskutinį naudojamą valdymo pultą, o adreso juostoje yra atidaryto valdymo pulto adresas (`?tab=dashboard&dashboard=<id>`), todėl nuoroda atidaro tą konkretų valdymo pultą visiems, turintiems prieigą prie jo.

Nustatymų mygtukas (tik savininkams) pervadina valdymo pultą, nustato, kokius įrašus jis priima kaip [išsami puslapio peržiūra](#detail-pages), tvarko dalijimąsi ir jį ištrina. Ištrynus valdymo pultą, pašalinami jo valdikliai ir jų workflow. Jūs visada turite bent vieną savo valdymo pultą, todėl paskutinio negalima ištrinti.

## Valdikliai

Valdiklis yra viena diagrama tinkle. Palaikomi diagramų tipai:

- **Stulpelinė** (vertikali arba horizontali)
- **Linijinė**
- **Plotinė** (užpildyta tendencija, palaiko kelias serijas)
- **Pyrago**
- **Lentelė** (sukama; vienas stulpelis gali būti atvaizduojamas kaip [būsenos žymos](../nodes/chart-output-node.md#status-chips), o eilutės gali atidaryti [išsamios informacijos puslapį](#detail-pages))
- **Skaitinė** (vienas KPI vertė su neprivalomu vienetu)
- **Matuoklis** (viena vertė pagal min–max intervalą, pvz., procentas)
- **Taškų** (X/Y taškai koreliacijos diagramoms)
- **Proporcija** (vienas stulpelis padalintas į dalis su procentų legenda, pvz., kalbos pasiskirstymas)
- **Stulpelinio matuoklio** (vienas horizontalus matuoklis kiekviename eilutėje su raudona→žalia gradientu ir verte, pvz., laisvos disko vietos)
- **Tekstas** (markdown žinutė, pvz., statuso pastaba kaip "Paskutinis vykdymas 19:47"; palaiko [interaktyvius žymeklius](../nodes/chart-output-node.md#interactive-task-lists), kai markdown yra statinis, ir [aiškius numeruotus sąrašus](../nodes/chart-output-node.md#numbered-lists) pagal užsakymą arba mažėjimo tvarka)
- **HITL** (jūsų laukiančios žmogaus apžvalgos. Antraštėje rodomas `1/n laukia`. Workflow pavadinimas atidaro tą vykdymą drobėje. **Patvirtinti**, **Prašyti pakeitimų** ir **Atmesti** išsprendžia tai. Istorijos piktograma šalia valdiklio pavadinimo atidaro tą vykdymą istorijos dialoge šioje pusėje. Valdiklis nenaudoja aukštesnių eilučių, ir kiekvienas asmuo mato savo eilę)

Be diagramų, **Run a workflow** valdiklis paleidžia vieną iš jūsų workflow tiesiai iš valdymo pulto: su numestu failu, su įvesties laukais arba mygtuku Run; žr. [Vykdymo valdikliai](#run-widgets).

Kiekvienas valdiklis asinkroniškai įkelia savo duomenis, kai atidarote skirtuką, todėl puslapis išlieka reaguojantis, kol diagramos užpildomos.

## Valdiklio pridėjimas

1. Paspauskite **Pridėti valdiklį**, suteikite jam pavadinimą ir pasirinkite diagramų tipą. Po pasirinkimo, dialogas piešia to diagramų tipo pavyzdį su pavyzdiniais duomenimis ir pavadina laukus, kurių tikisi, kad galėtumėte palyginti tipus prieš pradėdami kurti.
2. Valdiklis atsidaro workflow redaktoriuje su pradiniu grafiku: [Set](../nodes/set-node.md) mazgas, kuris generuoja eiles, prijungtas prie [Chart Output](../nodes/chart-output-node.md) mazgo. Pakeiskite Set mazgą bet kokiu duomenų šaltiniu. **HITL** valdiklis yra tik Chart Output mazgas; jis skaito jūsų laukiančias apžvalgas ir jam nereikia duomenų šaltinio.
3. Sukurkite workflow, kad mazgas, tiekiantis **Chart Output**, generuotų eilių masyvą, tada sukonfigūruokite Chart Output mazgo laukų žemėlapį (etiketės laukas, vertės laukas ir kt.).
4. Išsaugokite, grįžkite į Valdymo pulto skirtuką, ir valdiklis bus sugeneruotas.

**Run a workflow** valdikliui vietoj to pasirinkite workflow, kurį jis turi vykdyti; parinkiklis nurodo, kaip valdiklis vykdys kiekvieną iš jų. Valdiklis pridedamas tiesiai į tinklelį; naujo workflow kurti nereikia.

Dvigubai spustelėkite valdiklį (arba naudokite jo redagavimo mygtuką), kad bet kada atidarytumėte jo workflow. Naudokite **Kopijuoti valdiklį** valdiklio antraštėje, kad padvigubintumėte tiek valdiklį, tiek jo visą workflow. Kopija bus įdėta po originalu ir pažymėta **(Kopija)**, kad galėtumėte ją redaguoti nepriklausomai.

## Išsamios informacijos puslapiai

Lentelės valdiklis gali susieti savo eilutes su kitu valdymo pultu, kuris tuomet veikia kaip išsamios informacijos puslapis: vienas valdymo pultas, aptarnaujantis kiekvieną klientą, sąskaitą faktūrą ar užklausą.

1. Atidarykite lentelės valdiklio **Settings** ir dalyje **Row link** pasirinkite valdymo pultą.
2. Įveskite **Record column** – stulpelį, kurio reikšmė identifikuoja eilutę (pavyzdžiui, `id`), ir pasirinktinai **Label column**, kuris jai suteikia pavadinimą (pavyzdžiui, `name`).
3. Išsaugokite. Spustelėjus eilutę (arba sufokusavus ją ir paspaudus Enter), atidaromas susietas valdymo pultas su `?record=<value>&label=<name>`.

Išsamios informacijos valdymo pulte kiekvienas valdiklio workflow nuskaito reikšmę kaip `$page.record` (žr. [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), o puslapis virš tinklelio rodo `Dashboard / <label>` su mygtuku įrašui išvalyti. Mygtukas Atgal grąžina į lentelę, iš kurios atėjote.

- **Kas gali jį atidaryti.** Eilutės yra spustelėjamos tik tiems žiūrovams, kurie gali atidaryti susietą valdymo pultą. Kiti mato tą pačią lentelę be nuorodų.
- **Įrašo formatas.** Įrašas gaunamas iš URL, todėl išsamios informacijos valdymo pultas nusprendžia, ką priimti. Jo nustatymuose **Detail page records** yra vienas iš šių: ID (raidės, skaitmenys, `-`, `_` ir `.`, iki 128 simbolių; numatytasis), skaičiai, UUID arba el. pašto adresai. Bet kokia kita reikšmė atmetama prieš paleidžiant valdiklį, o valdikliai rodo „This page does not accept that record".
- **Vis tiek vykdoma savininko vardu.** Išsamios informacijos puslapyje valdikliai taip pat vykdomi kaip valdymo pulto savininkas. Kūrėjai turėtų perduoti `$page.record` tik ten, kur mazgas jį ekranuoja (escape), niekada tiesiai į užklausos tekstą.
- **Talpinimas podėlyje.** Kiekvienas valdiklis talpina savo diagramą pagal kiekvieną įrašą tam pačiam galiojimo laikui (TTL) kaip ir pats valdiklis, bei saugo 50 paskutinių naudotų įrašų.

## Vykdymo valdikliai

**Run a workflow** valdiklis paleidžia vieną iš jūsų workflow ir parodo rezultatą: būseną, vykdymo laiką ir išvestis. Tai, ką jis rodo, priklauso nuo to, kokius įvesties duomenis workflow priima:

- **Failas.** Workflow, kuris prasideda [File Upload Trigger](../nodes/file-upload-trigger-node.md) mazgu, užmeskite ant jo failą (arba spustelėkite, kad pasirinktumėte), ir valdiklis jį įkels per vienkartinę triggerio įkėlimo nuorodą. Valdiklis rodo failų tipus ir dydį, kuriuos triggeris priima, ir atmeta kitus prieš įkeliant. Kai workflow taip pat prasideda Text Input mazgu, valdiklis rodo jo laukus šalia numetimo zonos: pasirinkite failą, užpildykite laukus, o **Run** išsiųs abu. Reikšmės keliauja kartu su valdiklio sugeneruota įkėlimo nuoroda, todėl bendrinama įkėlimo nuoroda negali jų nustatyti.
- **Įvesties laukai.** Workflow, kuris prasideda Text Input mazgu, valdiklis rodo jo laukus su numatytosiomis reikšmėmis; **Run** paleidžia workflow su jūsų reikšmėmis. Reikšmės laukams, kurių workflow neturi, yra atmetamos.
- **Nieko.** Workflow be įvesčių gauna mygtuką **Run**.

Rezultato mygtukas **Wrap** laužo ilgas išvesties eilutes dėžutės viduje; išjunkite jį, kad skaitytumėte išvesties JSON išdėstymą.

- Bet kas, galintis atidaryti valdymo pultą, gali paleisti valdiklį, lygiai taip pat, kaip bet kas gali atnaujinti diagramą. Prieiga prie workflow priklauso valdymo pulto savininkui: norint pridėti valdiklį, reikia workflow, kurį galite paleisti ir jūs, ir savininkas, o pats vykdymas naudoja workflow savininko kredencialus, kaip ir bet kuri įkėlimo nuoroda.
- Rezultatas lieka jūsų ekrane, kol neišeinate iš puslapio; kiti žiūrovai nemato jūsų failų, reikšmių ar rezultatų. Vykdymas rodomas vykdymo istorijoje su triggeriu `dashboard`.
- Valdymo pulto bendrinimas niekada nesuteikia prieigos prie paties workflow. **Edit workflow** atidaro jį žmonėms, kurie jau turi prieigą, o **Fine-tune with AI** nesiūloma.
- Failų vykdymai atliekami pagrindiniame egzemplioriuje, kur saugomi įkelti failai, kaip ir kiekvienas File Upload Trigger vykdymas.

## Valdiklio generavimas naudojant AI

Paspauskite **AI**, apibūdinkite norimą metriką (pavyzdžiui, "workflow sėkmės rodiklis per pastarąsias 30 dienų kaip stulpelinė diagrama"), ir pasirinkite LLM kredencialą ir modelį. Heym generuoja pilną valdiklio workflow, baigiančią Chart Output mazgu, ir prideda jį prie tinklo. Žr. [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) pavyzdinius užklausimus pagal diagramų tipus.

Naudokite valdiklio **Tobulinti su AI** mygtuką, kad peržiūrėtumėte esamą valdiklį su nauja instrukcija. Kiekvienas AI tobulinimas užfiksuoja ankstesnį workflow valdiklio **Redagavimo istorijoje**, todėl galite peržiūrėti arba grąžinti pakeitimus iš workflow redaktoriaus.

## Išdėstymo redagavimas

Perjunkite **Redaguoti**, kad patektumėte į redagavimo režimą, kur galite vilkti valdiklius ir keisti jų dydį 12 stulpelių tinkle. Išdėstymo pakeitimai automatiškai išsaugomi. Valdiklių pavadinimai yra redaguojami tiesiogiai iš valdiklio antraštės.

## Talpykla ir atnaujinimas

Kiekvienas valdiklis talpina savo paskutinius apskaičiuotus duomenis serveryje nustatytam galiojimo laikui (TTL). Kol talpykla yra šviežia, atidarius valdymo pultą pateikiamas saugomas rezultatas, o ne vėl vykdomas workflow. Talpykla yra pakeičiama kiekvieną kartą, kai duomenys yra perskaičiuojami (viena talpykla kiekvienam valdikliui, plius viena kiekvienam įrašui [išsamios informacijos puslapyje](#detail-pages)), ir ji automatiškai invaliduojama, kai redaguojate valdiklio workflow.

Naudokite valdiklio **Atnaujinti** mygtuką (arba **Atnaujinti** įrankių juostoje), kad apeitumėte talpyklą ir nedelsdami perskaičiuotumėte.
## Dalijimasis

Savininkai dalijasi informacine lentele iš jos nustatymų su individualiais vartotojais (pagal el. paštą) arba su bet kuria [komanda](teams-tab.md), kuriai jie priklauso. Kiekvienas dalijimasis yra **Skaityti** arba **Rašyti**; kai kas nors turi tiek asmeninį, tiek komandos dalijimąsi, taikomas stipresnis.

| Veiksmas | Savininkas | Rašyti | Skaityti |
|----------|:----------:|:------:|:--------:|
| Peržiūrėti valdiklius, atnaujinti juos, naudoti automatinį atnaujinimą | ✓ | ✓ | ✓ |
| Atidaryti išsamios informacijos puslapius, vykdyti vykdymo valdiklius | ✓ | ✓ | ✓ |
| Pridėti, kopijuoti, ištrinti, pervadinti ir pakeisti valdiklių dydį; AI generuoti ir tobulinti; pažymėti kontrolinio sąrašo elementus | ✓ | ✓ | |
| Atidaryti valdiklio workflow redaktoriuje | ✓ | ✓ | |
| Pervadinti arba ištrinti informacinę lentelę, nustatyti jos įrašo formatą, valdyti dalijimąsi | ✓ | | |

**Valdikliai visada veikia kaip informacinės lentelės savininkas.** Kas bebūtų žiūrintis, valdiklis naudoja savininko kredencialus ir globalius kintamuosius, o jo vykdymai pasirodo savininko vykdymo istorijoje ir pėdsakuose. Todėl komandos nariai mato tuos pačius duomenis be prieigos prie už jų slypinčių paskyrų, o kiekvienas žiūrovas dalijasi vienu talpintu rezultatu per valdiklį. Valdikliai, kuriuos pridėjo arba kopijavo rašymo bendradarbis, taip pat priklauso savininkui.

Dėl to **Rašyti** turi tokią pačią pasitikėjimo lygį kaip dalijimasis workflow redagavimui: bendradarbis su rašymo prieiga gali keisti tai, kas vyksta su Jūsų kredencialais. Teikite ją tik tiems žmonėms, kuriems leistumėte redaguoti savo workflows. Bandymo vykdymas, kurį bendradarbis pradeda iš workflow redaktoriaus, naudoja jų pačių kredencialus, kaip ir bet kuris bendrinamas workflow; tik pati informacinė lentelė veikia kaip savininkas. **Skaityti** nesuteikia prieigos prie valdiklių workflows, o tik skaitymo teisę turintys žiūrovai gauna patį grafiką, bet ne detalių apie kiekvieną mazgą vykdymo.

Pašalinus dalijimąsi arba sumažinus jį iš rašymo į skaitymą, tai įsigalioja iš karto.

## Susiję

- [Chart Output mazgas](../nodes/chart-output-node.md)
- [Analizės skirtukas](analytics-tab.md) — integruoti vykdymo metrikai (skirtingi nuo vartotojų sukurtų informacinių lentelių)
