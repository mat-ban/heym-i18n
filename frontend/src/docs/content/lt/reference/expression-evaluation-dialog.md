# Išraiškos Vertinimo Dialogas

Išraiškos Vertinimo Dialogas yra išplėstas redaktorius išraiškas palaikantiems laukams. Jis atsidaro paspaudus plėtimo mygtuką šalia išraiškos įvesties ir suteikia didesnę darbo erdvę, automatinį užpildymą, gyvą backend peržiūrą ir išvesties naršymą vienoje vietoje.

## Dialogo Atidarymas

- Paspauskite plėtimo mygtuką šalia išraiškos lauko Ypatybių skydelyje.
- Daugiaeilės įvesties laukai rodo mygtuką viduje įvesties.
- Vienos eilutės įvesties laukai rodo mygtuką dešinėje įvesties.

## Dialogo Išdėstymas

- Dialogas atsidaro kaip centrinis modalas maždaug **80vw × 80vh** dydžio.
- Antraštėje rodomas **Įvertinti — {lauko pavadinimas}**, kai lauko etiketė yra žinoma.
- Redaktorius išlaiko automatinį užpildymą, lauko-nuo-laiko navigaciją ir įprastas **Taikyti** / **Atšaukti** veiklas.
- Peržiūra automatiškai atnaujinama maždaug po **300 ms** po to, kai nustojate rašyti.
- Paspauskite `Ctrl` / `Cmd` + `Enter`, kad pritaikytumėte dabartinį tekstą atgal į lauką ir uždarytumėte dialogą (tas pats kaip **Taikyti**).

## Išvesties Skyrius

Išvesties sritis automatiškai atnaujinama po to, kai sustojate rašyti redaktoriuje.

### Vertinimas

| Išraiškos tipas | Rezultatas |
|---|---|
| Vienas `$expr` (visas laukas) | Išsaugoma natūrali reikšmė |
| Vienas plikas taško kelias (visas laukas, be `$`, be įterptos naujos eilutės) | Tas pats kaip `$` + tas kelias (backend normalizuoja vertinimui) |
| Tekstas su įterptais `$refs` | Galutinis rezultatas visada yra eilutė |
| Literalus tekstas (be `$`, ne vienas taško kelias) | Grąžinamas kaip yra |

**Pavyzdžiai**

| Įvestis | Rezultatas |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (tas pats kaip `$input.items`, kai visa reikšmė yra šis kelias) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Vertinimo kontekstas sukuriamas šia tvarka:

- **Prisegtos duomenys** iš aukštupio mazgų
- **Paskutinio vykdymo išvestys** iš drobės
- `null`, kai nėra prieinamų aukštupio duomenų

Jei dabartinis mazgas turi aukštupio priklausomybes, tačiau nė vienas iš jų neturi prisegtų duomenų ar neseniai vykdymo rezultato, dialogas pirmiausia atlieka bandomąjį vykdymą, kad sukurtų kontekstą, o tada įvertina dabartinį tekstą.

### Išvesties Kelio Pasirinkiklis

Kai backend rezultatas yra objektas arba masyvas, Išvesties sritis gali rodyti interaktyvų kelio pasirinkiklį vietoj žaliųjų JSON.

- Dukart spustelėkite eilutę, kad pridėtumėte tą kelią prie dabartinio `$node.path` nuorodos.
- Vieną kartą spustelėkite išplečiamas eilutes, kad atidarytumėte arba uždarytumėte šakas.
- Naudokite integruotą užklausų laukelį, kad ieškotumėte raktų, reikšmių ir kelio eilutėmis.

## Automatinis Užpildymas

- Įveskite `$`, kad atidarytumėte pasiūlymus aukštupio mazgams, integruotoms funkcijoms ir metodams.
- Paspauskite `Tab` arba `Enter`, kad įterptumėte pasirinktą pasiūlymą.
- Naudokite `↑` / `↓`, kad judėtumėte per pasiūlymų sąrašą.

### Pavyzdiniai Atsakymai

Kai tęsiate `$…` nuorodą su tašku, kiekviena pasiūlymo eilutė rodo atsakymą, kurį tas pasiūlymas sukels, paryškintą dešinėje eilutės pusėje.

- Įvedus `$set.listItems.first().toString().u`, bus išvardyti `upper`, `urlEncode`, `urlDecode` ir `unescape`, kiekvienas su savo įvertintu rezultatu — taip galite pasirinkti pagal rezultatą, o ne pagal pavadinimą.
- Įvedus `$node.text.toJson()`, JSON eilutė bus išanalizuota į objektą arba masyvą. Po `.toJson()` automatinis užpildymas gali pasiūlyti išanalizuotus raktus (pavyzdžiui, `repoUrl`), kai yra prieinama paskutinio vykdymo arba prisegtų išvestų duomenų.
- Rezultatai vertinami backend'e pagal tuos pačius prisegtus duomenis ir paskutinio vykdymo išvestis, kurias naudoja dialogo peržiūra, todėl jie atitinka tai, ką laukas sukels.
- Tik pasiūlymai, kurie stovi savarankiškai, yra vertinami: nuliniai argumentų metodai (`upper()`, `first()`, `keys()`, `toJson()`) ir paprasti atributai (`length`, `year`). Pasiūlymai, kuriems reikia argumentų pirmiausia — `map`, `filter`, `sort`, `replace` — paliekami tušti.
- Eilutė lieka tuščia, kai kandidatas nesukelia jokio atsakymo: klaida, `null` arba metodas, kuris netaikomas šiai reikšmei.
- Atsakymai sutrumpinami iki vienos eilutės. Užveskite pelės žymeklį ant sutrumpinto atsakymo, kad pamatytumėte daugiau.

## Kurti su AI

**Kurti su AI** mygtukas pasirodo dialogo viršuje dešinėje, kai workflow yra įkeltas. Jis atidaro įdėtą modalą, kuriame galite aprašyti norimą išraišką paprasta kalba ir leisti LLM ją sugeneruoti už Jus.

### Kaip tai veikia

1. Paspauskite **Kurti su AI** dialogo įrankių juostoje.
2. Pasirinkite LLM kredencialą ir modelį iš išskleidžiamųjų sąrašų.
3. Įveskite paprastą teksto aprašymą, ko norite — pavyzdžiui, *"Gauti kliento vardą iš API atsakymo"*.
4. Paspauskite **Generuoti**. Modalas iškviečia backend'ą, kuris naudoja [Expression DSL](./expression-dsl.md) sistemos užklausą plius Jūsų paskutinio workflow vykdymo išvestis kaip kontekstą ir grąžina vieną išraiškos eilutę.
5. Sugeneruota išraiška nedelsiant vertinama pagal tuos pačius drobės duomenis, kad galėtumėte pamatyti rezultatą prieš taikydami.
6. Paspauskite **Taikyti**, kad pakeistumėte redaktoriaus turinį sugeneruota išraiška, arba **Generuoti iš naujo**, kad bandytumėte dar kartą.

### Naudojamas kontekstas

Generatorius gauna mazgo išvestis iš paskutinio bandomojo vykdymo drobėje. Jei workflow dar nebuvo vykdytas, LLM sugeneruoja geriausią išraišką, remdamasis mazgo etiketėmis ir DSL konvencijomis.

### Reikalavimai

- LLM kredencialas (OpenAI, Google arba Custom) turi būti sukonfigūruotas [Kredencialų](./credentials.md) skirtuke.
- Workflow turi būti atidarytas redaktoriuje.

## Klaviatūros Sparčiosios Klavišų Kombinacijos

| Sparčioji klavišų kombinacija | Veiksmas |
|---|---|
| Rašymo pauzė (~300 ms) | Atnaujinti backend peržiūrą |
| `Ctrl` / `Cmd` + `Enter` | Taikyti ir uždaryti dialogą |
| `Escape` | Pirmiausia uždaryti automatinį užpildymą, kitaip uždaryti dialogą |
## Įdėtos `$` metodo argumentuose

Dialogo / backend vertinimui galite perduoti kitą nuorodą su įdėtu `$` viduje tokiuose skambučiuose kaip `.get($other.field)`, kai reikia dinaminio rakto. Taip pat galite naudoti paprastą kelią viduje `.get(...)` (pavyzdžiui, `other.field`); backend tai išsprendžia taip pat. Išsaugoti workflow laukai turėtų vis tiek laikytis [Expression DSL](./expression-dsl.md) taisyklių; evaluate API taip pat priima pilno eilutės paprastą taško kelią patogumui (žr. aukščiau esančią lentelę).

## Navigacija

Set and Execute žemėlapių redaktoriai gali rodyti **Prev** / **Next** mygtukus, kad galėtumėte judėti tarp laukų nesukdami dialogo.

## Susiję

- [Expression DSL](./expression-dsl.md)
- [Node Types](./node-types.md)
- [Credentials](./credentials.md) — reikalingi Build with AI funkcijai
- [LLM Node](../nodes/llm-node.md)
- [Output Node](../nodes/output-node.md)
- [Condition Node](../nodes/condition-node.md)
