# Vykdymo Istorija

Vykdymo istorija fiksuoja workflow vykdymus: įvestis, išvestis, mazgų rezultatus, būseną ir trigger šaltinį. Naudokite ją stebėti aktyvų gamybos vykdymą, tikrinti praeities vykdymus, taisyti klaidas arba pakartotinai vykdyti su tomis pačiomis įvestimis per **Bring to Canvas**.

## Apžvalga

Kiekvienas vykdymas saugo:

| Laukas | Aprašymas |
|--------|-----------|
| **Įvestys** | Užklausos kūnas arba vykdymo įvestys (pvz., `text` Įvesties mazgui) |
| **Išvestys** | Workflow lygio išvestys |
| **Mazgų rezultatai** | Išvestys, būsenos ir vykdymo laikas kiekvienam mazgui |
| **Būsena** | `success`, `error`, `pending`, `skipped` arba `failed` (žr. [Crash Recovery](#crash-recovery)) |
| **trigger_source** | Kaip buvo inicijuotas vykdymas (žr. [Triggers](./triggers.md)) |

## Prieiga prie Istorijos

| Vieta | Apimtis |
|-------|---------|
| **Redaktoriaus** įrankių juosta | Tik dabartinis workflow |
| **Docs** peržiūros antraštė | Tik dabartinis workflow |
| **Dashboard** antraštė (Chat skirtukas) | Visi workflow + chat/asistentų vykdymai |
| **Evals** peržiūros antraštė | Visi workflow + chat/asistentų vykdymai |

Paspauskite **Istorija** mygtuką (laikrodžio piktograma), kad atidarytumėte dialogą.

## Pagal workflow vs Visi Istorija

- **Pagal workflow** (Redaktorius, Docs): Rodo vykdymus tik atidarytam workflow. Naudokite **Išvalyti istoriją**, kad pašalintumėte vykdymus tik tam workflow.
- **Visi Istorija** (Dashboard, Evals): Rodo vykdymus visiems workflow ir chat/asistentų sesijoms. Aprėptis atitinka workflow prieigą: workflow, kuriuos valdote, workflow, kurie buvo tiesiogiai su jumis pasidalinti, ir workflow, kurie buvo pasidalinti su komanda, kuriai priklausote. Naudokite **Išvalyti visą istoriją**, kad pašalintumėte visus įrašus, kuriuos valdote. Istorija bendrinamiems workflow bus išlaikyta.

## Bring to Canvas

**Bring to Canvas** įkelia pasirinkto vykdymo įvestis ir mazgų išvestis į dabartinį workflow.

### Ką tai įkelia

- **Įvestys** → Vykdymo įvesties panelis (pvz., `text` Įvesties mazgui arba pasirinktiniams laukams)
- **Mazgų rezultatai** → Vykdymo rezultatų panelis rodo praeities išvestis kiekvienam mazgui
- **Vykdymo rezultatas** → Būsena, išvestys ir laikas iš vykdymo

### Elgsena pagal kontekstą

- **Redaktoriuje** (pagal workflow istorija): Taikoma iš karto atidarytam workflow ir uždaro dialogą.
- **Iš Visi Istorija** (Dashboard/Evals): Naršoma į workflow redaktorių, tada taikomi duomenys, kai redaktorius įsikrauna. Pasiekiama tik workflow vykdymams — ne chat/asistentų vykdymams.

### Vykdymo gili nuoroda

Atidarius workflow adresu `/workflows/{workflowId}/{executionId}`, automatiškai įkeliamas tas vykdymas į drobę — tas pats, kas pasirinkti vykdymą ir pasirinkti **Bring to Canvas**. Tai leidžia dalintis konkrečiu praeities vykdymu kaip URL. Jei vykdymas nerandamas (neteisingas arba ištrintas id), redaktorius grįžta prie paprasto workflow įkrovimo.

### Naudojimo atvejai

Paspauskite Ctrl/Cmd ir spustelėkite vykdymą bet kuriame istorijos sąraše, kad atidarytumėte šią tiesioginę nuorodą naujame naršyklės skirtuke. Dabartinis skirtukas ir atidarytas dialogo langas lieka nepakitę. Pokalbių ir asistento vykdymo procesai neturi workflow, todėl spartusis klavišas juos tik pasirenka, kaip paprastas spustelėjimas.

- Pakartotinai vykdyti workflow su tomis pačiomis įvestimis
- Taisyti nesėkmingą vykdymą tikrinant įvestis ir mazgų išvestis
- Palyginti išvestis tarp vykdymų

## Klausti AI

Abiejuose istorijos dialogo languose šalia pavadinimo yra mygtukas **Klausti AI** (kibirkšties piktograma). Jis atidaro [skirtuką Chat](../tabs/chat-tab.md#asking-about-a-run) naujame pokalbyje su pridėtu workflow ir pasirinktu vykdymu kaip pašalinamais žetonais. Paklauskite, kodėl vykdymas buvo lėtas, kas nepavyko, arba leiskite Chat pataisyti workflow. Chat skaito būtent tą vykdymą, įskaitant sekimą pagal mazgus ir klaidas.

Dialogo lange All History **Klausti AI** rodomas tik pasirinkus workflow vykdymą; pokalbių ir asistento vykdymuose jis nerodomas.

## Vykdymo laiko juosta

Vykdymo detalėse mygtukas **Laiko juosta** (laikmačio piktograma) šalia **Išskleisti viską** pakeičia sąrašą **Žingsniai** į aprėpčių laiko juostą. Kol rodoma laiko juosta, tas pats mygtukas vadinasi **Žurnalai**; spustelėkite jį, kad grįžtumėte į sąrašą. All History mygtukas rodomas tik workflow vykdymams. Laiko juosta nubrėžia juostą kiekvienam mazgui jo paleidimo metu, kad matytumėte, kiek truko kiekvienas mazgas ir kurie veikė lygiagrečiai. Užveskite žymeklį ant juostos, kad pamatytumėte trukmę; spustelėkite, kad atidarytumėte tą patį detalių inspektorių kaip redaktoriaus [vykdymo laiko juostoje](#execution-timeline-details). Pasirinktas rodinys išlieka tol, kol atidarytas dialogas.

Vykdymai, įrašyti prieš išsaugant mazgų pradžios laikus, išdėstomi vienas po kito pagal trukmę.

## Vykdymo Akcentai

Po gyvo vykdymo — arba po **Bring to Canvas** — atsiranda uždarinėjamas **Vykdymo Akcentai** iššokantis langas **drobės viršuje dešinėje**. Tai greitas būdas pamatyti *ką kiekvienas mazgas pagamino*, išvardytą nuo viršaus iki apačios vykdymo tvarka. Uždarykite jį su **✕**; jis vėl atsiranda kitame vykdyme.

### Kas rodomas

| Įrašas | Šaltinis | Automatiškai? |
|--------|----------|---------------|
| **Įvestis** | Vykdymo įvesties parametrai (įvesties/trigger mazgas) | Taip |
| **Išvestis** | Išvesties mazgo rezultatas — arba, jei jo nėra, paskutinio mazgo pranešimas | Taip |
| **Agentas / LLM** | Kiekvieno agento ar LLM mazgo išvestis | Taip |
| **Išvestis** | Bet kuris kitas mazgas su **Highlight Node Output** įjungtu | Pasirinktinai |

Mazgai, kurie jau automatiškai akcentuojami (įvestis / išvestis / paskutinis / agentas / llm), niekada neatsiranda du kartus, net jei taip pat įjungiate perjungiklį.

### Kiekvienas įrašas

- Rodo `Mazgas — pranešimas…` su pirmomis **250 simbolių**; spustelėkite eilutę, kad ją išplėstumėte ir pateiktumėte **pilną pranešimą kaip Markdown**, su **Kopijuoti** mygtuku.
- Mazgas, kuris buvo vykdomas kelis kartus (pvz., cikle), rodo `Mazgas (N)` su `‹ i / N ›` pasirinkikliu — pasirinkite, kurį vykdymą norite peržiūrėti; kiekvieno mazgo pasirinkiklis yra nepriklausomas.

### Highlight Node Output

Kiekvienas mazgas **išskyrus Agent ir LLM** turi **Highlight Node Output** žymės langelį savo savybių panelėje (numatyta, kad yra išjungta). Įjunkite jį, kad pridėtumėte to mazgo išvestį į iššokantį langą. Ant akcentuotų mazgų drobėje pasirodo mažas ✦ ženkliukas. Workflow DSL šiame yra mazgo duomenų laukas `"highlight": true` (numatyta `false`).

### Ant dashboard'ų

Dashboard widget kortelės, kurios vykdė workflow, rodo ✦ **Vykdymo akcentai** mygtuką kortelės antraštėje; spustelėkite jį, kad atidarytumėte tą patį iššokantį langą to widget vykdymui, su widget piešta išvestimi kaip pagrindiniu įrašu.
## Vykdymų vykdymas

Abiejuose istorijos dialoguose viršuje rodomi **šiuo metu vykdomi vykdymai**, prieš praėjusius vykdymus.

- Pasukamas indikatorius ir **Vykdoma** etiketė pasirodo su pradžios laiku
- Paspauskite **Atidaryti gyvai**, kad prijungtumėte redaktorių prie to tikslaus vykdymo, nesustabdydami jo
- Drobė pirmiausia atkuria jau užbaigtus mazgus, tada gauna `node_start`, `node_complete` ir galutinius vykdymo įvykius per SSE
- Dabartinis mazgas pulsuoja drobėje, žemyn srauto mazgai išlaiko savo laukimo animaciją, o Debug panelė prideda kiekvieną rezultatą, kai jis atvyksta — lygiai taip pat kaip vykdymas, pradėtas iš redaktoriaus
- Paspauskite **Atšaukti**, kad nedelsiant sustabdytumėte vykdymą
- Atšaukus iš bet kurio dialogo (Redaktorius arba Valdymo skydas), taip pat uždaromas aktyvus SSE srautas bet kuriame atidarytame drobės skirtuke tam workflow, todėl redaktoriaus būsena švariai atstatoma
- Po atšaukimo, vykdomas įrašas dingsta kitame atnaujinime; paspauskite **Atnaujinti**, kad atnaujintumėte sąrašą rankiniu būdu
- Jei atšauksite vykdymą, kuris jau baigtas, užklausa bus be veiksmų

Vykdymai, laukiantys [lygiagretumo lizdo](./webhooks.md#concurrency-limit-and-queued-runs), pateikiami tame pačiame skyriuje su etikete **Queued 2/5**, jų vieta eilėje ir eilės dydžiu. Jie neturi mygtuko **Open live**, nes dar niekas nevyksta; **Cancel** pašalina laukiantį vykdymą iš eilės ir užregistruoja jį kaip `cancelled`. Vykdymas, kuris laukė ilgiau nei nustatytas workflow maksimalus laukimo laikas, užregistruojamas kaip `expired`, o pilnos eilės atmestas vykdymas – kaip `queue_full`; abu vykdymų sąraše turi savo ženklelį.

Gyvas URL yra `/workflows/{workflowId}/{executionId}`. Stebėtojas yra tik skaitymo režimu: palikus redaktorių, tik tas naršyklės skirtukas atsijungia ir niekada nesustabdo workflow. Aktyvūs momentiniai vaizdai dalijami per PostgreSQL, todėl atidarius vykdymą vis tiek veikia, kai trigger ir redaktoriaus užklausa patenka į skirtingus backend darbininkus.

## Avarijų atkūrimas

Jei serveris perkraunamas (diegiant, konteinerio perkrovimas ar avarija), kol vykdomas workflow, to vykdymo darbininkas sustoja vykdymo viduryje. Heym automatiškai atkuria šiuos nutrauktus vykdymus, o ne palieka juos užstrigusius kaip **Vykdoma**.

- Kitame paleidime išrinktas lyderio procesas aptinka našlaičių vykdymus — iš karto, jei tai yra sklandus perkrovimas, arba per ~60 sekundžių, jei tai yra sunki avarija (kai širdies plakimai aiškiai sustoja).
- Atkurti vykdymai yra **vėl vykdomi nuo nulio su tais pačiais įvestimis** (ne tęsiami nuo to, kur sustojo), naudojant dabartinę workflow apibrėžtį. Baigus, jie užfiksuoja normalų terminalo įrašą (pvz., `success`), todėl istorija rodo, kad vykdymas buvo užbaigtas.
- Vykdymas bandomas **vieną kartą**. Jei atkūrimo bandymas taip pat yra nutrauktas — arba workflow nuo to laiko buvo ištrintas — įrašas užfiksuojamas kaip `failed`.
- Tai veikia viename konteineryje ir daugiašaliuose diegimuose; tik lyderis atlieka atkūrimą, todėl vykdymas niekada nėra atkuriamas du kartus skirtingų darbininkų.

### Automatinio atkūrimo perjungiklis

Redaktoriaus **Vykdymo žurnalo** (vykdymo) panelėje yra **Automatinio atkūrimo** žymės langelis, **pagal numatytuosius nustatymus įjungtas** kiekvienam workflow.

- **Įjungta**: nutraukti šio workflow vykdymai yra vėl vykdomi, kaip aprašyta aukščiau.
- **Išjungta**: nutraukti vykdymai nėra vėl vykdomi ir užfiksuojami su būsena `skipped`.

> Sub-workflow vykdymai nėra atkuriami nepriklausomai — jie yra vėl vykdomi pagal savo atkurtą tėvų vykdymą. Trigger, turintys savo pakartotinį pristatymą (RabbitMQ, suplanuoti/cron, IMAP), taip pat gali pakartotinai pristatyti perkrovimo metu, todėl atkurtas vykdymas kartais gali būti vykdomas du kartus.

## Laukiama žmogaus peržiūra

Vykdymai, kurie sustoja dėl [Žmogaus įsikišimo](./human-in-the-loop.md) patvirtinimo, iš karto užfiksuojami istorijoje su būsena `pending`.

- Laukiantis agento mazgas saugo peržiūros payload, įskaitant `reviewUrl`, `draftText` ir `expiresAt`
- Bet kurie mazgai, prijungti prie agento `review` rankenos, taip pat gali vykdyti prieš žmogui atsakant, o jų mazgų rezultatai saugomi tame pačiame laukiančioje istorijos įraše
- Istorijos dialogai rodo peržiūros nuorodą, kad savininkai galėtų ją kopijuoti arba atidaryti
- Istorijos dialogai ir redaktoriaus Debug panelė rodo galutinį žmogaus sprendimą po to, kai vykdymas tęsiasi
- Kai peržiūrėtojas priima, redaguoja arba atsisako juodraščio, tas pats istorijos įrašas atnaujinamas su galutiniu vykdymo rezultatu
- Jei tas pats vykdymas sustoja HITL daugiau nei vieną kartą, istorijos įrašas lieka tas pats, o kiekvienas kontrolinis taškas gauna savo vienkartinę peržiūros nuorodą

Tai ypač naudinga portalų vykdymams ir ilgalaikiams workflow, kurie gali laukti valandų ar dienų prieš tęsdami.

## Kopijuoti

Naudokite **Kopijuoti** šalia Įvesties arba Išvesties, kad nukopijuotumėte JSON į iškarpinę.

## Išvalyti istoriją

- **Pagal workflow**: Redaktoriaus istorijos dialoge spustelėkite **Išvalyti istoriją**, kad pašalintumėte vykdymus dabartiniam workflow.
- **Visa istorija**: Valdymo skydelyje/Evals istorijos dialoge spustelėkite **Išvalyti visą istoriją**, kad pašalintumėte visus vykdymo įrašus, kuriuos turite. Vykdymai iš bendrų workflow išlaikomi. Šis veiksmas negali būti atšauktas.

## Vykdymo laiko juostos detalės

Kai redaktoriaus **Vykdymo žurnalas** yra atidarytas, spustelėkite laikmačio mygtuką, kad parodytumėte vykdymo laiko juostą. Pasirinkite intervalą, kad atidarytumėte įterptą detalių inspektorių, kuris užima eilučių sritį. Jis rodo pasirinkto žingsnio būseną, trukmę, bandymų skaičių, pakartojimo informaciją, klaidas, sekimo ID ir kompaktišką išvesties peržiūrą. Objektų ir masyvų išvestys naudoja tą patį `JsonTree` peržiūros įrankį kaip ir likusi Debug panelė; skalarinės vertės naudoja teksto peržiūrą. Kai žingsnis išveda vaizdus (Playwright ekrano kopijos, sugeneruoti vaizdai, vaizdo failai arba base64 vaizdai užklausos tekste, rasti bet kur išvestyje), jie pasirodo kaip miniatiūros virš išvesties, o JSON rodo trumpą vietą, kurioje yra žali base64. Spustelėkite miniatiūrą, kad atidarytumėte ją šviesos dėžėje; rodyklės mygtukai arba ←/→ klavišai pereina per kiekvieną vaizdą vykdyme, su skaitikliu, tokiu kaip `2 / 5`. Naudokite **Atidaryti sekimą** LLM ir Agent span'ams, kai sekimo ID yra prieinamas.
## Mobilus mazgo detalė

Telefono ekrane redaktorius rodo viso ekrano workflow medį vietoj laisvos formos drobės. Paspauskite medžio mazgą su užfiksuotu rezultatu, kad atidarytumėte jo vykdymą kaip viso ekrano detalę. Peržiūra pateikia atskiras **Įvesties duomenų**, **Išvesties duomenų** ir **Klaidų** korteles. Išvesties kortelėje rodomas užfiksuotas rezultatas ir siūloma **Kopijuoti išvestį**; įvesties kortelėje matoma pasirinkto mazgo konfigūracija, o klaidų kortelėje rodomos užfiksuotos klaidos, kai mazgas nepavyko. Naudokite **Grįžti į workflow** arba uždarymo mygtuką, kad grįžtumėte į medį.

Drobės ir informacijos suvestinės istorijos dialogai išlaiko savo vykdymo valdymo elementus vienoje eilutėje ir pateikia prieinamus žymų ir instancijų filtrus reaguojančioje tinkle. Jų filtrų meniu naudoja tą patį programėlėje esantį pasirinkimo elementą, todėl pasirinktas žymeklis turi nuoseklų tarpą ir bazinę liniją su kiekvienu parinkties žymėjimu.

## Susiję

- [Triggers](./triggers.md) – Kaip pradedami workflow; istorijos įrašai `trigger_source` (įskaitant `board` vykdymams, pradėtiems per [Board](../tabs/board-tab.md) kortelių judesius ir sekimus)
- [Human-in-the-Loop](./human-in-the-loop.md) – Laukiantys peržiūros URL ir tęstinumo elgsena
- [Edit History](./edit-history.md) – Versijų valdymas workflow išsaugojimams (grąžinimas, skirtumas)
- [Quick Start](../getting-started/quick-start.md) – Sukurkite ir vykdykite savo pirmąjį workflow
- [Workflows Tab](../tabs/workflows-tab.md) – Kurkite ir valdykite workflows
