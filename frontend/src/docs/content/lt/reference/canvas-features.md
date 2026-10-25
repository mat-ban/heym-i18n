# Drobės funkcijos

Workflow redaktorius siūlo kelias funkcijas, skirtas klaidų taisymui, testavimui ir mazgų organizavimui: **Vykdyti iki mazgo**, **AI mazge**, **Duomenų pin**, **Vykdymo žurnalai**, **Įjungti/Išjungti** ir **Išskirti į Sub-Workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Žiūrėti redaktoriaus demonstraciją</a></p>

## Vykdyti iki mazgo

Pelaikykite bet kurį mazgą, išskyrus lipnųjį lapą, ir spustelėkite **Vykdyti** po juo. Heym vykdo tą mazgą ir jo aukštyn srautus, palikdamas žemyn srautus ir nesusijusius šakas nepaliestas. Tai naudoja drobės testavimo režimą, įskaitant pritvirtintus išėjimus ir workflow normalius šakų sąlygas.

Jei pasirinktoje kelio dalyje yra įvesties laukai, dešinėje **Vykdyti** panelėje atsidaro ir fokusuojamas pirmasis laukas. Įveskite reikšmes, tada spustelėkite **Vykdyti iki _mazgo žymės_** arba paspauskite **Ctrl+Enter** (Cmd+Enter macOS). Bendro kūno režimas fokusuojasi į JSON kūno redaktorių. Keliai be įvesties laukų vykdomi iš karto, neatidarant panelės. Pritvirtinti Įvesties mazgai naudoja savo pritvirtintą išėjimą, nesiklausdami įvesties.

Panelė išlaiko pasirinktą tikslą vėlesniems vykdymams. Pasirinkite **Vykdyti visą workflow**, kad išvalytumėte tikslą. Vykdymo mygtukai yra neaktyvūs, kol vykdymas yra aktyvus. Tikslas cikle sustabdo vykdymą, kai tas mazgas pirmą kartą pasiekiamas; pasirinkus mazgą po ciklo, vykdomas visas aukštyn srautas.

## AI mazge

Užveskite žymeklį ant bet kurio mazgo, išskyrus lipnų lapelį, ir spustelėkite **AI** virš jo. [AI Assistant](./ai-assistant.md) atsidaro ant to mazgo ir siūlo **Change this node as ...**, **Fix error in this node ...** bei **Other**. Agent režimu asistentas keičia tik tą mazgą; kiti mazgai, ryšiai ir išdėstymas lieka nepakitę. Žr. [AI Assistant › Vieno mazgo keitimas](./ai-assistant.md#changing-one-node).

Mygtukas yra paslėptas workflowuose, kuriuos galite tik peržiūrėti.

## Duomenų pin

Duomenų pin leidžia jums pritvirtinti mazgo išėjimą iš paskutinio vykdymo, kad galėtumėte testuoti žemyn srautus, nesikartodami vykdydami pritvirtintą mazgą.

### Kur rasti

- **Ypatybių panelė** – Pasirinkite mazgą ir slinkite iki **Pritvirtinti duomenys** skyriaus
- **Mazgo ženkliukas** – Pritvirtinus duomenis, mazge pasirodo pin ikona

### Veiksmai

| Veiksmas | Aprašymas |
|----------|-----------|
| **Pritvirtinti** | Pritvirtina mazgo paskutinio vykdymo išėjimą (prieinama po vykdymo) |
| **Išvalyti** | Pašalina pritvirtintus duomenis |
| **Redaguoti** | Redaguoti pritvirtintą JSON tiesiogiai; spustelėkite Išsaugoti, kad pritaikytumėte |

### Testavimo režimo elgsena

Vykdant workflow testavimo režimu, mazgai su `pinnedData` praleidžia vykdymą ir naudoja pritvirtintą išėjimą vietoj to. Naudokite tai, kad:

- Testuotumėte žemyn srauto logiką, nesikreipdami į išorinius API
- Debugintumėte išraiškas, kurios nurodo mazgo išėjimą
- Iteruotumėte ant promptų ar sąlygų su fiksuotais pavyzdžių duomenimis

Išraiškų užbaigimas redaktoriuje naudoja pritvirtintus duomenis, kai jie yra prieinami, kad pasiūlytų laukus.

## Vykdymo žurnalai

**Debug panelė** (apatinė dėžutė) rodo realaus laiko vykdymo žurnalus vykdant workflow. Taip pat galite atidaryti vykdomą gamybos vykdymą iš bet kurios Istorijos dialogo arba Lentos kortelės. Redaktorius prisijungia prie to vykdymo SSE srauto, atkurdamas užbaigtų mazgų rezultatus ir toliau rodo mazgų animacijas bei žurnalus, kai nauji mazgai prasideda ir baigiasi.

### Ką ji rodo

- **Mazgų rezultatai** – Kiekvieno mazgo būsena (`sėkminga`, `klaida`, `praleista`, `vykdoma`), vykdymo laikas ir išėjimas
- **Galutiniai išėjimai** – Sujungti išėjimai iš [Išėjimo](../nodes/output-node.md) mazgų
- **Agentų pažanga** – [Agentų](../nodes/agent-node.md) mazgams, žingsnis po žingsnio įrankių skambučiai ir mąstymas

### Veiksmai

- **Kopijuoti kaip JSON** – Kopijuoti visą vykdymo žurnalą į iškarpinę
- **Atidaryti JSON redaktoriuje** – Atidaro žurnalą JSON Hero arba JSON Editor Online apžiūrai
- **Atsisiųsti sugeneruotus failus** – Jei įgūdžių rezultatas sukūrė atsisiunčiamus failus (`_generated_files`), pasirodo Atsisiųsti mygtukas. Vieno failo atsisiuntimai vykdomi tiesiogiai; kelių failų atveju atsidaro pasirinkimo iššokantis langas.

### Skirtumas nuo Žurnalų skyriaus

Debug panelė rodo **workflow vykdymo** žurnalus (mazgų rezultatus, išėjimus). [Žurnalų skyrius](../tabs/logs-tab.md) rodo **Docker konteinerių** žurnalus (backend, frontend, duomenų bazė). <!-- pragma: allowlist secret -->

## Įjungti / Išjungti

Galite išjungti mazgus, kad jie būtų praleisti vykdymo metu. Išjungti mazgai rodo "išjungta" ženkliuką ir atrodo neryškūs.

### Kaip perjungti

| Metodas | Aprašymas |
|---------|-----------|
| **Ypatybių panelė** | Pasirinkite mazgą → Energijos ikona (viršutiniame dešiniajame kampe) |
| **Kontekstinis meniu** | Dešiniuoju pelės mygtuku spustelėkite mazgą(-us) → Išjungti arba Įjungti |
| **Klaviatūra** | Pasirinkite mazgą(-us) → paspauskite **D** (žr. [Klaviatūros spartieji klavišai](./keyboard-shortcuts.md)) |

### Daugiau pasirinkimų

Pasirinkus kelis mazgus, Įjungti/Išjungti taikoma visiems jiems. Kontekstinis meniu rodo "Įjungti", jei bet kuris pasirinktas mazgas yra išjungtas, "Išjungti", jei visi yra įjungti.

### Vykdymo elgsena

Mazgai su `active: false` yra praleidžiami. Žemyn srauto mazgai negauna duomenų iš praleistų mazgų. Naudokite tai, kad laikinai išimtumėte mazgus, jų neištrindami.

Norėdami įjungti arba išjungti mazgą iš workflow viduje, o ne rankiniu būdu, naudokite [Išjungti mazgą](../nodes/disable-node.md) ir [Įjungti mazgą](../nodes/enable-node.md).
## Agent atminties grafikas

[Agent](../nodes/agent-node.md) mazgai su **[nuolatine atmintimi](./agent-persistent-memory.md)** rodo rožinę **smegenų** kontrolę mazge. Paspauskite ją, kad atidarytumėte atminties grafiko redaktorių: subjektai pateikiami kaip animuotas, jėgos krypties grafikas, grupuojamas pagal subjektų tipą, su paieškos šaltinio/tikslinio pasirinkimo įrankiais, skirtais ryšių pridėjimui, ir ryšių panelėmis, skirtomis perjungti tarp susijusių subjektų. Tas pats dialogas apima **Bendrinti atmintį su kitais agentais** (workflow → agent → read or read/write) dėl [kryžminio agentų atminties dalijimosi](./agent-persistent-memory.md#sharing-with-other-agents). Kol dialogas atidarytas, pagrindinio drobės atšaukimo/perdarymo veiksmai atidedami, kad grafiko redagavimas išlaikytų savo istoriją.

**Grafiko filtravimas.** Drobės viršutiniame kairiajame kampe yra paieškos kontrolė, suskleista iki spartaus mygtuko, kol paspausite ją arba paspausite **Ctrl/Cmd+F**. Ji atitinka subjekto pavadinimą, jo tipą ir kiekvieną atributo raktą bei vertę, taip pat ryšio tipą (`parent_of`) ir jo savybes; atitinkantis ryšys atneša abu jo subjektus su savimi. Visi tarpai atskirti terminai turi atitikti. Atitinkantis subjektas atneša visą savo kaimynystę su savimi — kiekvieną ryšį, kuriame jis dalyvauja, ir subjektą, esantį kiekvieno ryšio tolimajame gale — taigi atitikimas niekada nepaliekamas kaip nesusijusi taškas. Atitinkantis ryšys atneša tik du subjektus, kuriuos jis sujungia, ir sustoja ten, nes ryšio tipo paieška yra klausimas apie tą ryšį, o ne apie viską, prie ko jo galai yra prijungti. Viskas kitas yra visiškai paslėpta — ne išblukinta — drobėje ir **Visi kraštai** sąraše, o ženkliukas rodo, kiek visų subjektų liko. **✕** viduje langelio pirmiausia išvalo užklausą, o tada uždaro langelį antruoju paspaudimu. Escape veikia taip pat, vidinis pirmas: jis išvalo užklausą, tada uždaro paieškos langelį, tada palieka išplėstą drobės vaizdą, ir tik uždaro dialogą, kai nė vienas iš jų nėra atidarytas. Išvalymas atkuria visą grafiką su kiekvienu subjektu ten, kur jis buvo.

**Subjektų išdėstymas rankiniu būdu.** Vilkdami subjektą, jį pritvirtinate ten, kur jį numetate, todėl automatinis išdėstymas nustato likusią grafiko dalį aplink jį, o ne traukia jį atgal. Vilkdami pasirinktą subjektą, judinate jo tiesiogiai prijungtus subjektus kartu su juo, išlaikydami grupės formą; vilkdami bet kurį kitą subjektą, judinate tik tą vieną. **Tvarkingas išdėstymas** (burtininko mygtukas) atlaisvina kiekvieną pritvirtintą subjektą ir pakartoja automatinį išdėstymą.

## Ištraukti į Sub-Workflow

Paverskite pasirinktus mazgus į pakartotinai naudojamą sub-workflow ir pakeiskite juos [Vykdyti](../nodes/execute-node.md) mazgu.

### Kaip naudoti

1. Pasirinkite vieną ar daugiau mazgų drobėje
2. Dešiniuoju pelės mygtuku → **Ištraukti į Sub-Workflow**
3. Įveskite pavadinimą (ir pasirinktinius aprašymus) naujam workflow
4. Paspauskite **Ištraukti**

### Kas vyksta

- Sukuriamas naujas workflow su pasirinktais mazgais
- Išoriniai įvestys (kraštai iš už pasirinkimo) tampa sub-workflow [Įvesties](../nodes/input-node.md) laukais
- Išoriniai išvestys (kraštai į mazgus už pasirinkimo) yra priskiriami sub-workflow [Išvesties](../nodes/output-node.md) laukams
- Pasirinkti mazgai yra pakeičiami vienu [Vykdyti](../nodes/execute-node.md) mazgu, kuris kviečia naują workflow
- Įvesties/išvesties priskyrimai automatiškai išsaugomi

### Naudojimo atvejai

- Pakartotinai naudoti mazgų seką keliuose workflow
- Supaprastinti sudėtingą workflow grupuojant susijusią logiką
- Kurti modulius, testuojamus sub-workflows

## Vykdyti su cURL

**cURL** mygtukas redaktoriaus įrankių juostoje (viršutiniame dešiniajame kampe) atidaro dialogą, skirtą sukurti ir kopijuoti cURL komandą, kad būtų galima suaktyvinti workflow per API.

- Pasirinkite workflow užklausos kūno režimą (`Defined` arba `Generic`)
- Nustatykite autentifikavimo tipą (Anoniminis, JWT arba Header Auth)
- Sukonfigūruokite atsakymo talpinimą ir greičio ribojimą
- Įjunkite SSE srautą ir pritaikykite pranešimus pagal mazgus
- Redaguokite užklausos kūną
- Generic režime drobės vykdymo panelė naudoja tą patį žalią JSON kūną kaip cURL dialogas
- Paspauskite **Kopijuoti cURL**, kad kopijuotumėte paruoštą vykdyti komandą

Žr. [Webhook'ai](./webhooks.md#run-with-curl-dialog) dėl visų dialogo detalių ir [SSE srautas](./sse-streaming.md) dėl įvykio protokolo.

## Susiję

- [Klaviatūros spartieji klavišai](./keyboard-shortcuts.md) – Visi drobės ir redaktoriaus spartieji klavišai
- [Agentų nuolatinė atmintis](./agent-persistent-memory.md) – Atminties grafiko elgsena ir API
- [Vykdyti mazgas](../nodes/execute-node.md) – Kviečia sub-workflows
- [Išraiškos DSL](./expression-dsl.md) – Nuorodos ir pritvirtinti duomenys
- [Workflow struktūra](./workflow-structure.md) – Mazgo ir krašto formatas
- [Atsisiųsti ir importuoti](./download-import.md) – Eksportuoti ir importuoti workflows kaip JSON
- [Mazgų tipai](./node-types.md) – Visi mazgų tipai
- [Žurnalų skirtukas](../tabs/logs-tab.md) – Docker konteinerių žurnalai
- [Vykdymo istorija](./execution-history.md) – Praeities vykdymai
- [Šablonai](../tabs/templates-tab.md) – Išsaugoti ir pakartotinai naudoti workflows ir mazgus
- [Kontekstinis demonstravimas](./contextual-showcase.md) – Kompaktiška puslapio instrukcija, prieinama redaktoriuje
