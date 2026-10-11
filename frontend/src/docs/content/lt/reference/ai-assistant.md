# AI Asistentas

**AI Asistentas** yra pokalbių panelė, kuri atsidaro iš Debug panelės ir prasideda dešiniajame apatiniame redaktoriaus kampe. Vilkite antraštę, kad ją perkelti, ir vilkite kraštą ar kampą, kad pakeistumėte jos plotį ar aukštį. Ji nesumažės žemiau 360×480 pikselių. Pozicija ir dydis yra prisimenami šiame naršyklėje. **Atstatyti poziciją ir dydį** antraštėje grąžina panelę atgal į dešinįjį apatiniį kampą. Naudokite natūralią kalbą, kad sukurtumėte ar pakeistumėte workflows – aprašykite, ko norite, ir AI sugeneruos mazgus ir kraštus, kurie bus taikomi drobėje.

Dėl dokumentacijos klausimų už redaktoriaus ribų naudokite [Chat with Heym](./chat-with-heym.md). Ši erdvė yra optimizuota produktų pagalbai, atsižvelgiant į puslapio kontekstą, o ne workflows generavimui.

## Panelės Atidarymas

1. Atidarykite workflow redaktoriuje
2. Raskite **Debug panelę** apačioje (vykdymo rezultatų zona)
3. Paspauskite **AI** mygtuką (žvaigždutės piktograma) panelės įrankių juostoje
4. AI Asistento panelė atsidaro dešiniajame apatiniame kampe. Vilkite jos antraštę, kad ją perkelti, arba vilkite kraštą ar kampą, kad pakeistumėte jos plotį ir aukštį.

Paspauskite `Ctrl + I` / `Cmd + I` bet kur redaktoriuje, kad atidarytumėte arba uždarytumėte panelę – klaviatūros kombinacija veikia net kai fokusas yra teksto įvedimo lauke. Žr. [Klaviatūros kombinacijos](./keyboard-shortcuts.md).

## Panelės Uždarymas

Paspauskite **X** mygtuką, paspauskite `Ctrl + I` / `Cmd + I`, arba perjunkite **AI** mygtuką Debug panelės įrankių juostoje. Antraštė vilks panelę; ji neužsidaro.

## Konfigūracija

Prieš siunčiant žinutes, pasirinkite:

| Nustatymas | Aprašymas |
|------------|-----------|
| **Kredencialas** | LLM kredencialas (API raktas) iš [Kredencialų](../tabs/credentials-tab.md) |
| **Modelis** | Modelio pavadinimas (pvz., `gpt-4o`, `gemini-2.5-flash`) |

Pridėkite kredencialus [Kredencialų skiltyje](../tabs/credentials-tab.md). Modelių sąrašas įkeliamas iš pasirinkto kredencialo.

## Agentų Režimas vs Klausimų Režimas

Panelė turi du režimus, kuriuos galima perjungti su **Agent / Ask** žymekliu panelės antraštėje.

| Režimas | Numatytoji | Elgsena |
|---------|------------|---------|
| **Agent** | ✓ | Kuria ir keičia drobę. AI generuoja workflow JSON bloką, kuris automatiškai taikomas drobėje, kai atsakymas baigtas. |
| **Ask** | | Atsako tik į klausimus. Drobė niekada nėra liečiama. Naudokite tai, kad klaustumėte apie savo workflow, Heym funkcijas, arba gautumėte patarimų, nesukeliant drobės atnaujinimo. |

Režimus galima keisti bet kada. Režimo keitimas neišvalo pokalbio.

Agentų režime, **YOLO režimo** langelis po žinutės lauku leidžia asistentui išbandyti ir pataisyti tai, ką jis sukuria. Žr. [YOLO režimas](#yolo-mode).

## Pokalbio Naudojimas

- Įveskite savo užklausą į įvedimo lauką (pvz., "Sukurkite workflow, kuris priima vartotojo įvestį ir siunčia ją LLM")
- Paspauskite **Enter**, kad siųstumėte (Shift+Enter naujai eilutei)
- AI transliuoja savo atsakymą. **Agent** režime, jei atsakymas apima workflow JSON bloką \`\`\`json kodo bloke, jis automatiškai analizuojamas ir taikomas drobėje. **Ask** režime drobė niekada nėra keičiama.
- Naudokite **Išvalyti**, kad atstatytumėte pokalbį
- Užveskite pelę ant žinutės ir paspauskite jos kopijavimo ikoną, kad nukopijuotumėte tekstą, kurį ji rodo, įskaitant bet kokį workflow JSON
- Vilkite liniją virš žinutės lango, kad padidintumėte lango aukštį. Įvedimo zona gali augti iki 60% panelės, ir ji grįžta į numatytąjį aukštį, kai puslapis perkraunamas

## Workflow Automatinis Taikymas

Kai AI atsakymas apima galiojantį workflow JSON bloką (su `nodes` ir pasirenkamai `edges`) \`\`\`json kodo bloke, Heym:

1. Analizuoja JSON iš atsakymo
2. Pakeičia dabartinę drobę naujais mazgais ir kraštais
3. Tvarko mazgų išdėstymą
4. Žymi workflow kaip neišsaugotą

Jei analizė nepavyksta, pasirodo **Pakartoti** mygtukas, kad būtų sugeneruotas atsakymas iš naujo.

## YOLO Režimas

**YOLO režimas** leidžia asistentui išbandyti tai, ką jis sukuria. Pažymėkite **YOLO režimo** langelį po žinutės lauku, tada siųskite savo užklausą. Langelis pasirodo tik Agent režime. Jis išjungtas pagal numatytuosius nustatymus ir grįžta į išjungtą būseną, kai puslapis perkraunamas. Užveskite pelę ant informacijos ikonos šalia jo, kad gautumėte trumpą santrauką.

Įjungus YOLO režimą, asistentas nesustoja po to, kai taiko workflow:

1. Jis taiko workflow drobėje.
2. Prieš pirmąjį vykdymą jis prašo testinių įvesties duomenų. Kortelėje išvardijami workflow įvesties laukai, užpildyti vertėmis, kurias siūlo asistentas. Redaguokite juos ir paspauskite **Vykdyti**. Vėlesniems vykdymams naudojamos šios vertės. Kortelė vėl pasirodo, kai įvesties laukai keičiasi arba asistentui reikia kitų testinių duomenų.
3. Jis vykdo workflow drobėje lygiai taip pat kaip **Vykdyti** mygtukas: neišsaugoti pakeitimai pirmiausia yra išsaugomi, mazgai apšviečiami, o vykdymas pasirodo Debug panelėje ir [Vykdymo istorijoje](./execution-history.md).
4. Jis perskaito rezultatą. Jei vykdymas padarė tai, ko prašėte, jis baigia su **Patvirtinta** ir trumpa santrauka. Jei ne, jis pataiso workflow ir vykdo jį dar kartą.

Jis atlieka ne daugiau kaip **5 vykdymus** per žinutę. Paspauskite **Sustoti** bet kada, kad nutrauktumėte ciklą ir sustabdytumėte vykdymą.

Kiekvienas atsakymas rodo savo žingsnius, kai jie vyksta:
- `Taikomi pakeitimai drobėje`;
- `Vykdomas workflow · bandymas 2/5`, su `Vykdoma <node>` eilute kiekvienam mazgui;
- galutinis verdiktas.

Po kiekvieno vykdymo trumpa eilutė, tokia kaip *Bandymo 1 rezultatas išsiųstas · klaida per 1.2s*, rodo, kad rezultatas grįžo atgal į asistentą.
### Jūsų kitų workflows vykdymas

YOLO režime asistentas taip pat gali vykdyti Jūsų kitus workflows, kai jam reikia jų rezultato. Pavyzdžiui, jis gali patikrinti, ką grąžina workflow, prieš jį iškviesdamas iš [Execute](../nodes/execute-node.md) mazgo. Šie vykdymai rodomi kaip `Running workflow "<name>"...` žingsniai ir yra užfiksuojami Vykdymo istorijoje su paleidimo šaltiniu `ai_assistant`. Redaguojamas workflow visada testuojamas drobėje.

### Kai jis sustoja anksčiau

| Situacija | Kas vyksta |
|---|---|
| Asistentui reikia sprendimo, informacijos, kredencialo ar duomenų lentelės | Jis klausia įprasto klausimo kortele. Atsakymas tęsia ciklą. |
| Vykdymas laukia [žmogaus peržiūros](./human-in-the-loop.md) | Ciklas sustoja. Patvirtinkite peržiūrą, tada siųskite žinutę. |
| Workflow laukia failo įkėlimo | Ciklas sustoja. YOLO režimas negali testuoti įkėlimo sukeltų vykdymų. |
| Naujoves workflow buvo išsaugota kitur | Ciklas sustoja. Išspręskite išsaugojimo konfliktą, tada siųskite žinutę. |

> **Vykdymai yra tikri.** El. laiškai, žinutės ir API skambučiai workflow iš tikrųjų siunčiami kiekvieno bandymo metu, o DataTable mazgai rašo tikras eilutes. Kiekvienas vykdymas išsaugo workflow, todėl ankstesnės versijos lieka [Redagavimo istorijoje](./edit-history.md).

## Balso įvestis

Palaikomose naršyklėse **Balso** mygtukas leidžia naudoti kalbą kaip tekstą. Paspauskite, kad pradėtumėte įrašymą, paspauskite dar kartą, kad sustabdytumėte. Išverstas tekstas siunčiamas AI gramatikos taisymui prieš siunčiant.

## Agentų mazgas vs AI asistentas

| | Agent Node | AI Assistant |
|---|------------|---------------|
| **Paskirtis** | LLM mazgas workflow viduje; vykdomas vykdymo metu | Chat UI, skirtas kurti workflows naudojant natūralią kalbą |
| **Vieta** | Drobės mazgas | Derinimo panelė → plūduriuojanti panelė |
| **Kada** | Vykdymo metu | Redaguojant |

Žr. [Agent Node](../nodes/agent-node.md) dėl workflow mazgo, kuris vykdo LLM skambučius su įrankiais ir MCP.

## Kaip tai veikia (AI Builder DSL)

AI asistentas veikia naudodamas **workflow DSL** (srities specifinė kalba), kuri aprašo mazgus, kraštus ir išraiškas. Kai siunčiate žinutę:

1. Jūsų žinutė kartu su [Vartotojo taisyklėmis](./user-settings.md) ir esamu workflow (jei toks yra) siunčiama į backend.
2. Backend sukuria **sistemos promptą**, kuris apima:
   - Visą workflow DSL (mazgų tipus, išraiškų sintaksę, taisykles, pavyzdžius)
   - Jūsų Vartotojo taisykles, pridėtas kaip "User Custom Rules"
   - Esamo workflow JSON, kai redaguojate esamą workflow
   - Prieinamų workflows sąrašą, jei naudojate Execute mazgą
   - Jūsų pačių kredencialų pavadinimus, tipus ir id (niekada jų vertes)
   - Duomenų lentelių pavadinimus, id, aprašymus ir stulpelius, kuriuos galite naudoti (niekada jų eilučių)
3. Modelis grąžina vieną workflow JSON bloką (su `nodes` ir `edges`). Klientas jį apdoroja ir taiko drobėje.

### Kredencialai

Kai workflow reikia kredencialo, asistentas klausia prieš jį sukuriant. Jei turite tinkamo tipo kredencialų, jis juos išvardija kartu su **Sukurti naują kredencialą**; jei neturite, jis klausia, ar norite sukurti vieną. Kiekvienas klausimas taip pat leidžia tęsti be kredencialo.

Pasirinkus sukurti vieną, atsidaro kredencialo forma panelėje, iš anksto nustatyta tinkamam tipui ir pasiūlytai pavadinimui. Vertės tiesiogiai siunčiamos į Heym; asistentas tik sužino pavadinimą ir tipą. OAuth kredencialai (Google Sheets, Google Drive, BigQuery, Linear, Notion) jungiasi iššokančiame lange, o nuoroda į autorizacijos puslapį pasirodo, jei iššokantis langas yra užblokuotas. Išsaugojus kredencialą, kortelėje rodomas jos pavadinimas, o sukurti mygtukas išsijungia; paspauskite **Pateikti atsakymus**, ir asistentas prideda naują kredencialą prie mazgo.

Taip pat galite prašyti kredencialo atskirai ("sukurti GitHub kredencialą") arba prašyti pakeisti turimą ("atnaujinti mano lentelės kredencialą", "pakartotinai prijungti mano Google Sheets"). Asistentas atsako ta pačia kortele: kūrimas atidaro tuščią formą, atnaujinimas atidaro formą su tuo kredencialu, kurio paslaptys yra paslėptos.

Asistentas teikia pirmenybę specialiam mazgui. Kai joks mazgas neapima operacijos, tokios kaip skirtuko pridėjimas prie Google Sheet, jis naudoja HTTP užklausą ir rašo antraštės eilutę pasirinktam kredencialui. Žr. [HTTP › Autentifikavimas su kredencialais](../nodes/http-node.md#authenticating-with-credentials).

Paaiškinimo klausimai, kurių workflow gali daryti be, žymi **Pasirinktinai** savo įvestyje ir gali būti praleisti.

DSL užtikrina camelCase etiketes, suvienodintas išraiškų taisykles ir mazgams specifinius laukus. Jei lauko vertė yra vienas `$expr`, backend išlaiko natūralų tipą; jei vertė maišo prozą su `$refs`, rezultatas yra eilutė. Vieno-`$` taisyklė vis dar galioja: jokio `$` viduje skliaustuose. [Nustatymai](./user-settings.md) Vartotojo taisyklės yra įterpiamos į šį sistemos promptą, todėl Jūsų pageidavimai taikomi kiekvienam AI sugeneruotam workflow.

Jei esamas workflow apima Agent įgūdžius, AI asistentas įtraukia tik kiekvieno įgūdžio `SKILL.md` šio workflow kontekste. Prikabinti `.py` failai ir binariniai įgūdžių aktyvai yra pašalinami prieš užklausą, kad kūrėjas liktų modelio konteksto ribose, net kai įgūdžiai apima dideles įgyvendinimo dalis.
### Duomenų lentelės

Kai workflow išsaugo, saugo arba ieško įrašų ir Jūs nenurodėte kitos saugyklos, asistentas naudoja [DataTable](../nodes/datatable-node.md) mazgą. Jei Jūs pavadinate vieną iš savo lentelių ir ji turi stulpelius, kurių reikia workflow, asistentas ją naudoja. Priešingu atveju, jis klausia, kurią lentelę naudoti. Kortelėje išvardijamos atitinkamos lentelės, kiekviena su savo aprašymu ir stulpelių tipais, taip pat **Sukurti naują lentelę** su siūlomu pavadinimu ir stulpeliais. Lentelės, kurios yra su Jumis bendrinamos, taip pat siūlomos; lentelė, kurią galite tik skaityti, siūloma tik skaitymui.

Pasirinkite naują lentelę ir paspauskite **Pateikti atsakymus**: kortelė sukuria lentelę, o asistentas įrašo jos ID į mazgą ir naudoja tikslius stulpelių pavadinimus. Taip pat galite paprašyti lentelės savarankiškai, pavyzdžiui, "sukurti lentelę mano potencialiems klientams".

Asistentas mato lentelių pavadinimus, aprašymus ir stulpelius, bet niekada nemato eilučių. Jis niekada nekeičia esamų lentelių stulpelių: jei lentelėje trūksta stulpelio, kurio reikia workflow, jis pavadina stulpelį ir siūlo naują lentelę. Stulpelius galima pridėti [DataTable skirtuke](../tabs/datatable-tab.md).

## Susiję

- [Kodėl Heym](../getting-started/why-heym.md) – Natūralios kalbos kūrimas kaip pirmasis agento gyvavimo ciklo etapas
- [Greitas pradžia](../getting-started/quick-start.md) – Sukurkite savo pirmąjį workflow
- [Nustatymai](./user-settings.md) – Vartotojo taisyklės, įdiegtos AI asistento sistemos užklausoje
- [Chat with Heym](./chat-with-heym.md) – Puslapio konteksto asistentas dokumentacijos srityje
- [Pagrindinės sąvokos](../getting-started/core-concepts.md) – Workflows, mazgai ir vykdymo srautas
- [Agent Node](../nodes/agent-node.md) – LLM mazgas su įrankiais ir MCP
- [Credentials Tab](../tabs/credentials-tab.md) – Pridėti API raktus AI asistentui
- [Workflow struktūra](./workflow-structure.md) – JSON formatas workflows
