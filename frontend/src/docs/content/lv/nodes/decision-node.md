# Decision

**Decision** mezgls uzdod lēmumu modelim raksturīgus jautājumus par darbplūsmas pašreizējo stāvokli un atgriež varbūtības. Tas negenerē tekstu. Izmantojiet to, kad darbplūsmai nepieciešams spriedums, uz kura pamata var sazaroties — maršrutēšana, triāža, ranžēšana, verifikācija vai tāda soļa bloķēšana, ko nevar atsaukt.

Lēmumu modeļi (saukti arī par *System One* modeļiem) ir cita veida modeļi nekā LLM. Tajos nav prompt, nav sistēmas instrukciju, nav temperature un nav rīku izsaukšanas. Jūs nosūtāt **state** kopā ar **questions** karti, un katra atbilde atgriežas kā skaitlis ar varbūtības sadalījumu aiz tā. Tā kā atbilde sastāv tikai no dažiem token, šie modeļi ir ātri un lēti, salīdzinot ar [LLM](./llm-node.md) lūgšanu ģenerēt JSON un tā parsēšanu.

Teksta ģenerēšanai izmantojiet [LLM](./llm-node.md) mezglu. Modelim, kas izsauc rīkus, izmantojiet [Agent Node](./agent-node.md).

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | Pakalpojumu sniedzēja atbilde verbatim — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | *Decision Model* akreditācijas dati. Nevis LLM akreditācijas dati. |
| `model` | string | Modeļa nosaukums, piemēram, `jev-latest` |
| `state` | expression | Ko modelim vajadzētu nolasīt (pēc noklusējuma `$input.text`) |
| `questions` | array | Sakārtotas jautājumu rindas; vismaz viena |
| `customBodyEnabled` | boolean | Nosūtīt ar roku rakstītu pieprasījuma body, nevis veidlapu |
| `customBody` | expression (JSON) | Body, ko nosūtīt, kad pārslēgs ir ieslēgts |
| `requestTimeoutSeconds` | number | Maksimālais gaidīšanas laiks sekundēs (pēc noklusējuma: 60) |

### State

**State** ir situācija, ko modelis vērtē. Tas pieņem string, object vai array.

Lauks, kas satur tieši vienu izteiksmi, saglabā savu tipu, tāpēc `$input` nosūta pašu object, nevis tā tekstu. Veidne ar izteiksmi tajā (`Ticket: $input.text`) tiek atrisināta kā string. Sniedziet katram jautājumam pietiekami daudz informācijas, lai atbildētu: avota tekstu, identitātes, attiecības, politikas un pašreizējos faktus.

## Jautājumu tipi

Katram jautājumam ir `id`, `type`, `instructions` un kritēriji, kas atkarīgi no tipa.

`id` ir tas, kā jūsu darbplūsma nolasa atbildi atpakaļ. Tas **nekad netiek nosūtīts modelim**, tāpēc visai nozīmei jāatrodas `instructions`. Rakstot `id: is_urgent` ar `instructions: "Is it?"`, modelim netiek dots nekas, ar ko strādāt.

### Noul

Vai nosacījums ir spēkā. Atgriež varbūtību, ka atbilde ir jā, no 0 līdz 1.

Kritēriji nav obligāti: **Yes means** un **No means** apraksta, ko katra puse aptver. Vērtība tuvu 0.5 nozīmē, ka modelis uzskata jā un nē par aptuveni vienlīdz iespējamiem — nevis "vidēju intensitāti".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Nolasiet to ar `$triage.answers.is_urgent.noul`.

### Choice

Izvēlas vienu opciju no jūsu definētās kopas. Atgriež izvēlēto opciju, pilnu sadalījumu un no tā atvasinātu confidence.

Pievienojiet opciju, kas aptver "neviens no šiem", ikreiz, kad nekas varētu neatbilst — modelis nevar izvēlēties opciju, ko neesat piedāvājis.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

Nolasiet to ar `$triage.answers.department.choice`, `.probabilities.billing` un `.confidence`.

### Score

Novērtē stāvokli pēc sakārtotas rubrikas. Atgriež ar varbūtību svērtu vērtību, kas var atrasties **starp** līmeņiem, kā arī legend un sadalījumu.

Līmeņi sakārtoti no zemākā uz augstāko, vismaz divi un ne vairāk kā desmit. Katram līmenim jāapraksta konkrēta situācija un jāpastāv patstāvīgi.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Nolasiet to ar `$triage.answers.frustration.score`, `.legend` un `.confidence`.

## Generate with AI

**Generate with AI** pārvērš vienkāršu teikumu ieteiktā state veidnē un jautājumu rindu kopā. Aprakstiet, ko vēlaties vērtēt — "triage an incoming support ticket: how urgent it is, which team owns it, and how frustrated the customer sounds" — un pārskatiet atgriezto, pirms pievienojat to mezglam.

Melnraksta sagatavošanu veic LLM, tāpēc dialogs pieprasa LLM akreditācijas datus. Lēmumu modelis atbild uz jautājumiem vēlāk, kad darbplūsma darbojas. Ģenerētie id tiek atkārtoti dedublēti pret rindām, kas mezglā jau ir, tāpēc divreiz ģenerēšana nekad nepārraksta esošu atbildes atslēgu.

Katra ģenerēšana tiek ierakstīta cilnē [Traces](../tabs/traces-tab.md) sadaļā **Decision Questions** avots, līdzās `decision.systemone` traces, ko mezgls pats ieraksta izpildes laikā.
## Pielāgots pieprasījuma pamatteksts

Ieslēdziet **Pielāgots pieprasījuma pamatteksts**, lai nosūtītu pašu rakstītu JSON, nevis veidlapas ģenerēto. Izmantojiet to endpoint, kura līgums atšķiras no tā, ko veido veidlapa.

Redaktors tiek aizpildīts no pašreizējās veidlapas, un tajā esošās izteiksmes tiek atrisinātas pirms pieprasījuma nosūtīšanas. Kamēr pārslēgs ir ieslēgts, State lauks un jautājumu rindas tiek ignorētas. Atbilde tiek nodota nemainīta abos gadījumos, tāpēc atšķirīgs līgums vienkārši rada citu formu, ko nolasīt jūsu izteiksmēm.

## Izvade

Mezgls atgriež tieši to, ko atgrieza pakalpojuma sniedzējs. Nekas netiek pārdēvēts vai saplacināts.

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

## Atzarošana pēc atbildes

[Switch](./switch-node.md) mezgls maršrutē pēc izvēlētās opcijas, un [Condition](./condition-node.md) mezgls var nosūtīt zemas pārliecības gadījumus tur, kur tos ieraudzīs cilvēks:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Tipizēta atbilde garantē formu, nevis patiesumu. Izvēlieties sliekšņus, balstoties uz saviem datiem un sekām, nevis kopējot skaitli no piemēra.

## Akreditācijas dati

Izveidojiet **Decision Model** akreditācijas datus cilnē [Akreditācijas dati](../tabs/credentials-tab.md) ar:

- **Base URL** — endpoint, piemēram, `https://api.typesafe.ai`. Heym pievieno `/v1/systemone`.
- **API Key** — nav obligāts. Endpoint, kuriem nav nepieciešama atslēga, var atstāt tukšus.

Rediģējot akreditācijas datus, saglabātā atslēga tiek paturēta, ja atslēgas lauks tiek atstāts tukšs; ierakstiet to no jauna tikai, lai to aizstātu.

Tos pašus akreditācijas datus var izmantot, lai vērtētu [Novērtējumu](../tabs/evals-tab.md) izpildes: ar atlasītu **LLM-as-Judge** izvēlieties tos kā tiesnesi, un lēmumu modelis novērtēs katru atbildi pret gaidīto izvadi.

Heym pēc noklusējuma bloķē izejošos pieprasījumus uz privātām un loopback adresēm, tāpēc lēmumu endpoint, ko pats darbinat uz `localhost` vai privātā diapazonā, prasa `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Lēmumu modeļi neparādās LLM cenu tabulās, ko Heym sinhronizē, tāpēc kolonna **Cost** sadaļā [Izpildes](../tabs/traces-tab.md) šiem izsaukumiem paliek tukša. Tokenu skaits joprojām tiek reģistrēts, un jūs varat pievienot savu cenu ar cenas ignorēšanu.

## Kļūdas

| Situācija | Kas notiek |
|-----------|--------------|
| Nederīga API atslēga | Mezgls neizdodas ar ziņojumu, kas nosauc akreditācijas datus |
| Nepareizi formatēts jautājums | Pakalpojuma sniedzēja paša lauka līmeņa ziņojums tiek pārnests mezgla kļūdā |
| Ātruma ierobežojums vai pārslodze | Mezgls neizdodas ar ziņojumu, kas norāda, ka stāvoklis ir īslaicīgs — ieslēdziet [retry](../reference/features.md) šim mezglam, lai to pārvarētu |
| Dublēts vai tukšs jautājuma id | Mezgls neizdodas pirms jebkura pieprasījuma nosūtīšanas |

## Saistītais

- [LLM Node](./llm-node.md) – Ģenerējiet tekstu, nevis spriedumu
- [Agent Node](./agent-node.md) – Apkopojiet pierādījumus ar rīkiem, pēc tam vērtējiet tos šeit
- [Switch Node](./switch-node.md) – Maršrutējiet pēc izvēlētās opcijas
- [Condition Node](./condition-node.md) – Nosacījums pēc pārliecības
- [Node Types](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Credentials](../reference/credentials.md) – Akreditācijas datu tipi un lauki
- [Traces Tab](../tabs/traces-tab.md) – Pārbaudiet lēmumu izsaukumus un tokenu lietojumu
