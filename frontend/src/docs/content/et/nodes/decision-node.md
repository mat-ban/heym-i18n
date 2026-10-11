# Decision

**Decision**-sõlm esitab otsustusmudelile tipitud küsimusi käivituse hetkeseisu kohta ja tagastab tõenäosused. See ei genereeri teksti. Kasutage seda siis, kui workflow vajab otsust, mille põhjal saab haruneda — marsruutimine, triaaž, järjestamine, verifitseerimine või sellise sammu väravana hoidmine, mida ei saa tagasi pöörata.

Otsustusmudelid (nimetatakse ka *System One* mudeliteks) on erinevat tüüpi mudelid kui LLM. Puudub prompt, puudub süsteemijuhis, puudub temperature ja puudub tööriistade kutsumine. Saadate **state**'i koos **questions**'ide kaardiga ning iga vastus tuleb tagasi numbrina, mille taga on tõenäosusjaotus. Kuna vastus on vaid mõni token, on need mudelid kiired ja odavad võrreldes sellega, kui paluda [LLM](./llm-node.md)-il toota JSON-i ja seda parsida.

Teksti genereerimiseks kasutage [LLM](./llm-node.md)-sõlme. Mudeli jaoks, mis kutsub tööriistu, kasutage [Agent Node](./agent-node.md)-i.

## Ülevaade

| Property | Value |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | Teenusepakkuja vastus muutmata kujul — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parameetrid

| Parameter | Type | Description |
|-----------|------|-------------|
| `credentialId` | UUID | *Decision Model* mandaat. Mitte LLM-i mandaat. |
| `model` | string | Mudeli nimi, näiteks `jev-latest` |
| `state` | expression | Mida mudel peaks lugema (vaikimisi `$input.text`) |
| `questions` | array | Järjestatud küsimuste read; vähemalt üks |
| `customBodyEnabled` | boolean | Saada käsitsi kirjutatud päringu keha vormi asemel |
| `customBody` | expression (JSON) | Keha, mis saadetakse, kui lüliti on sees |
| `requestTimeoutSeconds` | number | Maksimaalne ooteaeg sekundites (vaikimisi: 60) |

### State

**State** on olukord, mida mudel hindab. See võtab vastu stringi, objekti või massiivi.

Väli, mis sisaldab täpselt ühte avaldist, säilitab oma tüübi, seega `$input` saadab objekti enda, mitte selle teksti. Mall, mille sees on avaldis (`Ticket: $input.text`), laheneb stringiks. Andke igale küsimusele piisavalt konteksti vastamiseks: lähtetekst, identiteedid, seosed, poliitikad ja hetkefaktid.

## Küsimuste tüübid

Igal küsimusel on `id`, `type`, `instructions` ja kriteeriumid, mis sõltuvad tüübist.

`id` on see, kuidas teie workflow vastuse tagasi loeb. Seda **ei saadeta kunagi mudelile**, seega kogu tähendus peab olema `instructions`-is. Kirjutamine `id: is_urgent` koos `instructions: "Is it?"` ei anna mudelile mitte midagi, millega töötada.

### Noul

Kas tingimus kehtib. Tagastab tõenäosuse, et vastus on jah, vahemikus 0 kuni 1.

Kriteeriumid on valikulised: **Yes means** ja **No means** kirjeldavad, mida kumbki pool hõlmab. Väärtus 0,5 lähedal tähendab, et mudel peab jah ja ei ole umbes võrdselt tõenäolisteks — mitte "keskmist intensiivsust".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Lugege seda `$triage.answers.is_urgent.noul`-iga.

### Choice

Valib ühe valiku teie määratud hulgast. Tagastab valitud valiku, täieliku jaotuse ja sellest tuletatud confidence'i.

Lisage valik, mis katab "mitte ükski neist", alati, kui miski ei pruugi sobida — mudel ei saa valida valikut, mida te ei pakkunud.

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

Lugege seda `$triage.answers.department.choice`, `.probabilities.billing` ja `.confidence`-iga.

### Score

Hindab olekut järjestatud rubriigi alusel. Tagastab tõenäosusega kaalutud väärtuse, mis võib maanduda **tasemete vahele**, pluss legendi ja jaotuse.

Tasemed kulgevad madalaimast esimesena, vähemalt kaks ja maksimaalselt kümme. Iga tase peaks kirjeldama konkreetset olukorda ja seisma iseseisvalt.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Lugege seda `$triage.answers.frustration.score`, `.legend` ja `.confidence`-iga.

## Generate with AI

**Generate with AI** muudab lihtsa lause soovitatud state-malliks ja küsimuste ridade kogumiks. Kirjeldage, mida soovite hinnata — "triaaž sissetulevale tugipiletile: kui kiireloomuline see on, milline tiim selle omanik on ja kui frustreerunud klient kõlab" — ja vaadake tagastatu üle enne, kui selle sõlme lisasõlme lisate.

Mustandi koostab LLM, seega dialoog küsib LLM-i mandaati. Otsustusmudel vastab küsimustele hiljem, kui workflow käivitub. Genereeritud id-d dubleeritakse eemaldatult sõlme juba hoitavate ridade suhtes, seega kaks korda genereerimine ei kirjuta kunagi üle olemasolevat vastusevõtit.

Iga genereerimine salvestatakse [Traces](../tabs/traces-tab.md) vahekaardil allika **Decision Questions** all, kõrvuti `decision.systemone` trace'idega, mille sõlm ise käitusajal kirjutab.
## Kohandatud päringu keha

Lülitage sisse **Kohandatud päringu keha**, et saata ise kirjutatud JSON-i vormi asemel. Kasutage seda endpoint'i puhul, mille leping erineb sellest, mille vorm koostab.

Redaktor täidetakse eelnevalt praegusest vormist ning selles olevad avaldised lahendatakse enne päringu saatmist. Kui lüliti on sisse lülitatud, eiratakse olekuvälja (State) ja küsimuste ridu. Vastus edastatakse muutmata kujul mõlemal juhul, seega erinev leping lihtsalt tekitab teistsuguse kuju, mida teie avaldised saavad lugeda.

## Väljund

Sõlm tagastab täpselt selle, mille teenusepakkuja tagastas. Midagi ei nimetata ümber ega lamedata.

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

## Hargnemine vastuse põhjal

[Switch](./switch-node.md) sõlm suunab valitud valiku põhjal ning [Condition](./condition-node.md) sõlm saab saata madala kindlusega juhtumid sinna, kus inimene neid näeb:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Tüpiseeritud vastus garanteerib kuju, mitte tõde. Valige lävendid oma andmete ja tagajärgede põhjal, mitte ärge kopeerige numbrit näitest.

## Mandaat

Looge **Decision Model** mandaat vahekaardil [Mandaadid](../tabs/credentials-tab.md) järgmiste väljadega:

- **Base URL** — endpoint, näiteks `https://api.typesafe.ai`. Heym lisab juurde `/v1/systemone`.
- **API Key** — valikuline. Endpoint'id, mis võtit ei vaja, võib jätta tühjaks.

Mandaadi redigeerimisel säilib salvestatud võti, kui võtmeväli jäetakse tühjaks; sisestage see uuesti ainult asendamiseks.

Sama mandaati saab kasutada [Hindamiste](../tabs/evals-tab.md) käivituste hindamiseks: kui **LLM-as-Judge** on valitud, valige see kohtunikuna ning otsustusmudel hindab iga vastust oodatud väljundi suhtes.

Heym blokeerib vaikimisi väljuvad päringud privaatsetele ja loopback-aadressidele, seega otsustus-endpoint, mida ise käitate aadressil `localhost` või privaatses vahemikus, vajab `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Otsustusmudelid ei ilmu Heymi sünkroonitavates LLM-i hinnatabelites, seega veerg **Cost** vahekaardil [Käivitused](../tabs/traces-tab.md) jääb nende päringute puhul tühjaks. Tokenite arv registreeritakse siiski ning oma hinna saab lisada hinnakohanduse (pricing override) abil.

## Vead

| Olukord | Mis juhtub |
|-----------|--------------|
| Kehtetu API võti | Sõlm ebaõnnestub teatega, mis nimetab mandaati |
| Vigane küsimus | Teenusepakkuja enda väljatasemeline teade kantakse sõlme veateatesse |
| Kiirusepiirang või ülekoormus | Sõlm ebaõnnestub teatega, mis ütleb, et tingimus on mööduv — lülitage selle sõlme jaoks sisse [retry](../reference/features.md), et see üle elada |
| Duplikaatne või tühi küsimuse id | Sõlm ebaõnnestub enne mis tahes päringu saatmist |

## Seotud

- [LLM Node](./llm-node.md) – Teksti genereerimine otsuse asemel
- [Agent Node](./agent-node.md) – Koguge tõendeid tööriistadega, seejärel hinnake neid siin
- [Switch Node](./switch-node.md) – Suunamine valitud valiku põhjal
- [Condition Node](./condition-node.md) – Värav kindluse põhjal
- [Node Types](../reference/node-types.md) – Ülevaade kõigist sõlmetüüpidest
- [Credentials](../reference/credentials.md) – Mandaadi tüübid ja väljad
- [Traces Tab](../tabs/traces-tab.md) – Otsustuspäringute ja tokenikasutuse uurimine
