# Sprendimas

**Sprendimo** mazgas užduoda sprendimo modelio tipo klausimus apie vykdymo dabartinę būseną ir grąžina tikimybes. Jis nesukuria teksto. Pasiekite jį, kai workflow reikia sprendimo, kuriuo galima remtis — maršrutizavimui, triagavimui, reitingavimui, patvirtinimui ar žingsnio, kurio negalima atšaukti, uždarymui.

Sprendimo modeliai (taip pat vadinami *Sistema Viena* modeliais) yra kitoks modelių tipas nei LLM. Nėra jokio prompt, jokios sistemos instrukcijos, jokios temperatūros ir jokio įrankių kvietimo. Jūs siunčiate **būseną** plius **klausimų** žemėlapį, o kiekvienas atsakymas grįžta kaip skaičius su tikimybių pasiskirstymu už jo. Kadangi atsakymas yra tik keli tokenai, šie modeliai yra greiti ir pigūs, palyginti su [LLM](./llm-node.md), kuris turi sukurti JSON ir jį analizuoti.

Teksto generavimui naudokite [LLM](./llm-node.md) mazgą. Modeliui, kuris kviečia įrankius, naudokite [Agent Node](./agent-node.md).

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | Tiekėjo atsakymas žodžiu — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | *Sprendimo modelio* kredencialas. Ne LLM kredencialas. |
| `model` | string | Modelio pavadinimas, pavyzdžiui, `jev-latest` |
| `state` | expression | Ką modelis turėtų perskaityti (numatytasis `$input.text`) |
| `questions` | array | Užduočių klausimų eilės; bent vienas |
| `customBodyEnabled` | boolean | Siųsti ranka rašytą užklausos kūną vietoj formos |
| `customBody` | expression (JSON) | Kūnas, kurį reikia siųsti, kai perjungiklis yra įjungtas |
| `requestTimeoutSeconds` | number | Maksimalus laukimo laikas sekundėmis (numatytasis: 60) |

### Būsenos

**Būsenos** yra situacija, kurią modelis vertina. Ji priima eilutę, objektą arba masyvą.

Laukas, turintis tik vieną išraišką, išlaiko savo tipą, todėl `$input` siunčia objektą patį, o ne jo tekstą. Šablonas su išraiška viduje (`Bilietas: $input.text`) išsprendžiamas į eilutę. Pateikite kiekvienam klausimui pakankamai informacijos, kad būtų galima atsakyti: šaltinio tekstą, tapatybes, santykius, politiką ir dabartinius faktus.

## Klausimų tipai

Kiekvienas klausimas turi `id`, `type`, `instructions` ir kriterijus, kurie priklauso nuo tipo.

`id` yra tai, kaip jūsų workflow perskaito atsakymą. Jis **niekada nesiunčiamas modeliui**, todėl visa reikšmė turi gyventi `instructions`. Rašydami `id: is_urgent` su `instructions: "Ar tai?"` modelis neturi su kuo dirbti.

### Noul

Ar sąlyga galioja. Grąžina tikimybę, kad atsakymas yra teigiamas, nuo 0 iki 1.

Kriterijai yra neprivalomi: **Taip reiškia** ir **Ne reiškia** apibūdina, ką apima kiekviena pusė. Vertė, artima 0.5, reiškia, kad modelis laiko teigiamą ir neigiamą atsakymą maždaug vienodai tikėtinu — ne "vidutinio intensyvumo".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Ar šis pranešimas perteikia skubumą?",
  "criteriaTrue": "Aiškiai laiko jautrus arba blokuojantis darbą",
  "criteriaFalse": "Nėra išreikšto skubumo"
}
```

Perskaitykite jį su `$triage.answers.is_urgent.noul`.

### Pasirinkimas

Pasirenka vieną variantą iš nustatyto rinkinio. Grąžina pasirinktą variantą, visą pasiskirstymą ir iš jo gautą pasitikėjimą.

Pridėkite variantą, apimantį "niekas iš šių" kiekvieną kartą, kai niekas gali tikti — modelis negali pasirinkti varianto, kurio nesiūlėte.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Kuri komanda turėtų tvarkyti šį prašymą?",
  "options": [
    { "key": "billing", "description": "Mokėjimai, sąskaitos, grąžinimai" },
    { "key": "technical", "description": "Klaidos, sutrikimai, integracijos" },
    { "key": "other", "description": "Nieko iš aukščiau netinka" }
  ]
}
```

Perskaitykite jį su `$triage.answers.department.choice`, `.probabilities.billing` ir `.confidence`.

### Įvertinimas

Įvertina būseną pagal užsakytą rubriką. Grąžina tikimybių svorio vertę, kuri gali būti **tarp** lygių, plius legenda ir pasiskirstymas.

Lygiai prasideda nuo mažiausio, bent dviejų ir ne daugiau kaip dešimties. Kiekvienas lygis turėtų apibūdinti konkrečią situaciją ir stovėti savarankiškai.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "Kiek nusivylęs yra klientas?",
  "levels": ["Ramus", "Nusivylęs", "Labai piktas"]
}
```

Perskaitykite jį su `$triage.answers.frustration.score`, `.legend` ir `.confidence`.

## Generuoti su AI

**Generuoti su AI** paverčia paprastą sakinį į siūlomą būsenos šabloną ir klausimų eilių rinkinį. Apibūdinkite, ką norite įvertinti — "triaguoti atvykstantį palaikymo bilietą: kiek jis skubus, kuri komanda jį valdo ir kiek nusivylęs skamba klientas" — ir peržiūrėkite, kas grįžta, prieš pridėdami tai prie mazgo.

Juodraštis yra sukurtas LLM, todėl dialogas prašo LLM kredencialo. Sprendimo modelis atsako į klausimus vėliau, kai vykdomas workflow. Sugeneruoti id yra de-duplikuojami pagal eiles, kurias mazgas jau turi, todėl generavimas du kartus niekada nepakeičia esamo atsakymo rakto.

Kiekviena generacija yra užfiksuota [Vykdymuose](../tabs/traces-tab.md) skirtuke po **Sprendimo klausimų** šaltiniu, kartu su `decision.systemone` vykdymo žurnalais, kuriuos pats mazgas rašo vykdymo metu.
## Pasirinktinis užklausos kūnas

Įjunkite **Pasirinktinis užklausos kūnas**, kad siųstumėte JSON, kurį rašote patys, vietoj formos. Naudokite tai, kai endpoint'o sutartis skiriasi nuo tos, kurią sukuria forma.

Redaktorius užpildomas iš dabartinės formos, o jame esančios išraiškos yra išsprendžiamos prieš siunčiant užklausą. Kol perjungiklis yra įjungtas, Valstybės laukas ir klausimų eilutės yra ignoruojamos. Atsakymas perduodamas nepakitęs bet kuriuo atveju, todėl skirtinga sutartis tiesiog sukuria skirtingą formą, kad jūsų išraiškos galėtų ją perskaityti.

## Išvestis

Mazgas grąžina tiksliai tai, ką grąžino tiekėjas. Nieko nepervadinama ir nesumažinama.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## Šakos pagal atsakymą

[Switch](./switch-node.md) mazgas nukreipia pagal pasirinktą variantą, o [Condition](./condition-node.md) mazgas gali siųsti mažo pasitikėjimo atvejus ten, kur juos pamatys žmogus:

```
Įvestis → Sprendimas (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Siųsti el. laišką (žmogiškas peržiūra)
```

Tipizuotas atsakymas garantuoja formą, o ne tiesą. Pasirinkite slenkstį pagal savo duomenis ir pasekmes, o ne kopijuokite skaičių iš pavyzdžio.

## Kredencialas

Sukurkite **Sprendimo modelio** kredencialą [Kredencialų](../tabs/credentials-tab.md) skirtuke su:

- **Pagrindinis URL** — endpoint'as, pavyzdžiui, `https://api.typesafe.ai`. Heym pridės `/v1/systemone`.
- **API raktas** — neprivalomas. Endpoint'ai, kuriems nereikia rakto, gali būti palikti tušti.

Redaguojant kredencialą, saugomas raktas, kai rakto laukas paliekamas tuščias; jį perrašykite tik norėdami pakeisti.

Tas pats kredencialas gali vertinti [Evals](../tabs/evals-tab.md) vykdymus: pasirinkus **LLM-as-Verdiktas**, pasirinkite jį kaip vertintoją, o sprendimo modelis įvertins kiekvieną atsakymą pagal numatomą išvestį.

Heym pagal numatytuosius nustatymus blokuoja išorines užklausas į privačius ir loopback adresus, todėl sprendimo endpoint'as, kurį vykdote patys `localhost` arba privačiame intervale, turi turėti `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Sprendimo modeliai nepasirodo Heym sinchronizuotose LLM kainų lentelėse, todėl **Kainos** stulpelis [Vykdymuose](../tabs/traces-tab.md) lieka tuščias šiems skambučiams. Token'ų skaičiai vis tiek registruojami, ir galite pridėti savo kainą su kainų pakeitimu.

## Klaidos

| Situacija | Kas vyksta |
|-----------|------------|
| Neteisingas API raktas | Mazgas nepavyksta su pranešimu, nurodančiu kredencialą |
| Netinkama klausimo forma | Tiekėjo pačios lauko lygio žinutės perduodamos į mazgo klaidą |
| Per didelis užklausų skaičius arba perkrovimas | Mazgas nepavyksta su pranešimu, kad sąlyga yra laikina — įjunkite [pakartoti](../reference/features.md) šiam mazgui, kad ją išgyventumėte |
| Dublikuotas arba tuščias klausimo ID | Mazgas nepavyksta prieš siunčiant bet kokią užklausą |

## Susiję

- [LLM Mazgas](./llm-node.md) – Generuoti tekstą vietoj sprendimo
- [Agentų Mazgas](./agent-node.md) – Rinkti įrodymus su įrankiais, tada vertinti juos čia
- [Switch Mazgas](./switch-node.md) – Nukreipti pagal pasirinktą variantą
- [Condition Mazgas](./condition-node.md) – Vartoti pagal pasitikėjimą
- [Mazgų tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Kredencialai](../reference/credentials.md) – Kredencialų tipai ir laukai
- [Vykdymų skirtukas](../tabs/traces-tab.md) – Tikrinti sprendimų skambučius ir token'ų naudojimą
