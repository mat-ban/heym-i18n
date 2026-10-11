# Odluka

**Odluka** čvor postavlja modelu odluka tipizirana pitanja o trenutnom stanju izvođenja i vraća vjerojatnosti. Ne generira tekst. Koristite ga kada workflow treba prosudbu na kojoj se može granati — usmjeravanje, triiranje, rangiranje, verifikacija ili zatvaranje koraka koji se ne može poništiti.

Modeli odluka (također nazvani *Sustav Jedan* modeli) su drugačiji tip modela od LLM-a. Nema prompta, nema sistemske instrukcije, nema temperature i nema pozivanja alata. Šaljete **stanje** plus mapu **pitanja**, a svaki odgovor dolazi kao broj s vjerojatnosnom distribucijom iza njega. Budući da je odgovor samo nekoliko tokena, ovi modeli su brzi i jeftini u usporedbi s traženjem od [LLM](./llm-node.md) da generira JSON i njegovim parsiranjem.

Za generaciju teksta, koristite [LLM](./llm-node.md) čvor. Za model koji poziva alate, koristite [Agent Node](./agent-node.md).

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | Odgovor pružatelja doslovno — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `credentialId` | UUID | *Decision Model* vjerodajnica. Nije LLM vjerodajnica. |
| `model` | string | Ime modela, na primjer `jev-latest` |
| `state` | izraz | Što model treba pročitati (zadano `$input.text`) |
| `questions` | niz | Poredane redove pitanja; barem jedno |
| `customBodyEnabled` | boolean | Šalje ručno napisano tijelo zahtjeva umjesto obrasca |
| `customBody` | izraz (JSON) | Tijelo koje se šalje kada je prekidač uključen |
| `requestTimeoutSeconds` | broj | Maksimalni broj sekundi čekanja (zadano: 60) |

### Stanje

**Stanje** je situacija koju model prosuđuje. Prihvaća string, objekt ili niz.

Polje koje sadrži točno jedan izraz zadržava svoj tip, tako da `$input` šalje objekt samog sebe umjesto njegovog teksta. Predložak s izrazom unutar njega (`Ticket: $input.text`) rješava se u string. Dajte svakom pitanju dovoljno informacija za odgovor: izvorni tekst, identitete, odnose, politike i trenutne činjenice.

## Tipovi pitanja

Svako pitanje ima `id`, `type`, `instructions` i kriterije koji ovise o tipu.

`id` je način na koji Vaš workflow čita odgovor. Nikada se ne šalje modelu, tako da cijelo značenje mora živjeti u `instructions`. Pisanje `id: is_urgent` s `instructions: "Je li to?"` ne daje modelu ništa s čime može raditi.

### Noul

Određuje drži li uvjet. Vraća vjerojatnost da je odgovor da, od 0 do 1.

Kriteriji su opcionalni: **Da znači** i **Ne znači** opisuju što svaka strana pokriva. Vrijednost blizu 0.5 znači da model smatra da su da i ne podjednako vjerojatni — ne "srednja intenzitet".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Prenosi li ova poruka hitnost?",
  "criteriaTrue": "Eksplicitno vremenski osjetljivo ili blokira rad",
  "criteriaFalse": "Nema izražene hitnosti"
}
```

Pročitajte ga s `$triage.answers.is_urgent.noul`.

### Izbor

Odabire jednu opciju iz skupa koji definirate. Vraća odabranu opciju, cijelu distribuciju i povjerenje izvedeno iz nje.

Dodajte opciju koja pokriva "ništa od ovoga" kad ništa ne odgovara — model ne može odabrati opciju koju niste ponudili.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Koji tim bi trebao obraditi ovaj zahtjev?",
  "options": [
    { "key": "billing", "description": "Plaćanja, fakturiranje, povrati" },
    { "key": "technical", "description": "Greške, prekidi, integracije" },
    { "key": "other", "description": "Ništa od navedenog ne odgovara" }
  ]
}
```

Pročitajte ga s `$triage.answers.department.choice`, `.probabilities.billing` i `.confidence`.

### Ocjena

Ocjenjuje stanje duž poretka. Vraća vrijednost ponderiranu vjerojatnošću koja može biti **između** razina, plus legenda i distribucija.

Razine se kreću od najniže prema najvišoj, barem dvije i najviše deset. Svaka razina trebala bi opisivati konkretnu situaciju i stajati samostalno.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "Koliko je kupac frustriran?",
  "levels": ["Smiren", "Frustriran", "Vrlo ljut"]
}
```

Pročitajte ga s `$triage.answers.frustration.score`, `.legend` i `.confidence`.

## Generirajte s AI

**Generirajte s AI** pretvara običnu rečenicu u predložak stanja i skup redova pitanja. Opisujte što želite prosuditi — "triirajte dolaznu podršku: koliko je hitno, koji tim ga posjeduje i koliko frustrirano zvuči kupac" — i pregledajte što se vraća prije nego što to dodate u čvor.

Nacrt izrađuje LLM, tako da dijalog traži LLM vjerodajnicu. Model odluka odgovara na pitanja kasnije, kada se workflow izvršava. Generirani id-ovi se de-dupliciraju u odnosu na redove koje čvor već drži, tako da dvostruko generiranje nikada ne prepisuje postojeći ključ odgovora.

Svaka generacija se bilježi u [Povijesti](../tabs/traces-tab.md) kartici pod izvorom **Pitanja odluke**, uz `decision.systemone` tragove koje piše sam čvor tijekom izvođenja.
## Prilagođeno tijelo zahtjeva

Uključite **Prilagođeno tijelo zahtjeva** kako biste poslali JSON koji sami napišete umjesto obrasca. Koristite ga za endpoint čiji se ugovor razlikuje od onoga što obrazac generira.

Uređivač se inicijalizira iz trenutnog obrasca, a izrazi unutar njega se rješavaju prije slanja zahtjeva. Dok je prekidač uključen, polje Stanje i redovi pitanja se ignoriraju. Odgovor se prosljeđuje nepromijenjen, tako da drugačiji ugovor jednostavno proizvodi drugačiji oblik za Vaše izraze.

## Izlaz

Čvor vraća točno ono što je pružatelj vratio. Ništa nije preimenovano ili spljošteno.

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

## Grananje na temelju odgovora

[Switch](./switch-node.md) čvor usmjerava na odabranu opciju, a [Condition](./condition-node.md) čvor može poslati slučajeve s niskom pouzdanošću na mjesto gdje će ih osoba vidjeti:

```
Input → Odluka (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch na $triage.answers.department.choice
                              └─ false → Pošalji e-mail (ljudska provjera)
```

Tipizirani odgovor jamči oblik, a ne istinitost. Odredite pragove prema vlastitim podacima i posljedicama umjesto da kopirate broj iz primjera.

## Vjerodajnica

Kreirajte **Decision Model** vjerodajnicu u [Vjerodajnicama](../tabs/credentials-tab.md) s:

- **Osnovni URL** — endpoint, na primjer `https://api.typesafe.ai`. Heym dodaje `/v1/systemone`.
- **API ključ** — opcionalno. Endpointi koji ne trebaju ključ mogu ostati prazni.

Uređivanje vjerodajnice zadržava pohranjeni ključ kada je polje ključa prazno; ponovno ga upišite samo da biste ga zamijenili.

Ista vjerodajnica može ocjenjivati [Evaluacije](../tabs/evals-tab.md): s odabranim **LLM-as-Judge**, odaberite je kao suca, a odluke modela ocjenjuju svaki odgovor prema očekivanom izlazu.

Heym prema zadanim postavkama blokira odlazne zahtjeve na privatne i loopback adrese, pa endpoint odluke koji sami pokrećete na `localhost` ili privatnom rasponu treba `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Modeli odluka ne pojavljuju se u tablicama cijena LLM-a koje Heym sinkronizira, pa kolona **Trošak** u [Izvještajima](../tabs/traces-tab.md) ostaje prazna za ove pozive. Broj tokena se i dalje bilježi, a možete dodati svoju cijenu s prepravkom cijene.

## Pogreške

| Situacija | Što se događa |
|-----------|---------------|
| Nevažeći API ključ | Čvor ne uspijeva s porukom koja navodi vjerodajnicu |
| Neispravno pitanje | Vlastita poruka pružatelja na razini polja prenosi se u pogrešku čvora |
| Ograničenje brzine ili preopterećenje | Čvor ne uspijeva s porukom koja kaže da je stanje privremeno — uključite [ponovno pokušavanje](../reference/features.md) za ovaj čvor kako biste ga prebrodili |
| Dupli ili prazni ID pitanja | Čvor ne uspijeva prije nego što je poslan bilo kakav zahtjev |

## Povezano

- [LLM Node](./llm-node.md) – Generirajte tekst umjesto presude
- [Agent Node](./agent-node.md) – Prikupite dokaze s alatima, a zatim ih ovdje ocijenite
- [Switch Node](./switch-node.md) – Usmjerite na odabranu opciju
- [Condition Node](./condition-node.md) – Kontrolirajte prema pouzdanosti
- [Node Types](../reference/node-types.md) – Pregled svih tipova čvorova
- [Credentials](../reference/credentials.md) – Tipovi i polja vjerodajnica
- [Traces Tab](../tabs/traces-tab.md) – Istražite pozive odluka i korištenje tokena
