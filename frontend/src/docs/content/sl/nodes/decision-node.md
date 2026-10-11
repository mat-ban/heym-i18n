# Odločitev

**Odločitveni** vozlišče postavlja vprašanja modelu odločanja o trenutnem stanju izvajanja in vrača verjetnosti. Ne generira besedila. Uporabite ga, ko workflow potrebuje presojanje, na katerem se lahko razveja — usmerjanje, triža, razvrščanje, preverjanje ali zapiranje koraka, ki ga ni mogoče razveljaviti.

Modeli odločanja (imenovani tudi *Modeli Sistema Ena*) so drugačen tip modela od LLM. Ni nobenega prompta, nobene sistemske navodila, nobene temperature in nobenega klicanja orodij. Pošljete **stanje** plus zemljevid **vprašanj**, vsako odgovor pa se vrne kot številka z verjetnostno porazdelitvijo za njo. Ker je odgovor le nekaj tokenov, so ti modeli hitri in poceni v primerjavi z vprašanjem [LLM](./llm-node.md), da proizvede JSON in ga razčleni.

Za generacijo besedila uporabite [LLM](./llm-node.md) vozlišče. Za model, ki kliče orodja, uporabite [Agent Node](./agent-node.md).

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | Odgovor ponudnika dobesedno — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Poverilnica *Modela Odločanja*. Ni poverilnica LLM. |
| `model` | niz | Ime modela, na primer `jev-latest` |
| `state` | izraz | Kaj naj model prebere (privzeto `$input.text`) |
| `questions` | niz | Urejeni nizi vprašanj; vsaj eno |
| `customBodyEnabled` | boolean | Pošlji ročno napisano telo zahteve namesto obrazca |
| `customBody` | izraz (JSON) | Telo, ki ga je treba poslati, ko je preklop vklopljen |
| `requestTimeoutSeconds` | število | Maksimalno število sekund za čakanje (privzeto: 60) |

### Stanje

**Stanje** je situacija, ki jo model presoja. Sprejema niz, objekt ali tabelo.

Polje, ki vsebuje natančno en izraz, ohrani svojo vrsto, tako da `$input` pošlje objekt samega sebe namesto njegovega besedila. Predloga z izrazom znotraj nje (`Ticket: $input.text`) se razreši v niz. Vsakemu vprašanju dajte dovolj informacij za odgovor: izvorno besedilo, identitete, odnose, politike in trenutne dejstva.

## Tipi vprašanj

Vsako vprašanje ima `id`, `type`, `instructions` in kriterije, ki so odvisni od tipa.

`id` je način, kako vaš workflow prebere odgovor nazaj. **Nikoli se ne pošlje modelu**, zato mora celotno pomen živeti v `instructions`. Pisanje `id: is_urgent` z `instructions: "Is it?"` modelu ne daje ničesar, s čimer bi lahko delal.

### Noul

Ali pogoj drži. Vrača verjetnost, da je odgovor da, od 0 do 1.

Kriteriji so neobvezni: **Da pomeni** in **Ne pomeni** opisujeta, kaj pokriva vsaka stran. Vrednost blizu 0.5 pomeni, da model enako verjetno vidi da in ne — ne "srednje intenzivno".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Ali ta sporočilo izraža nujnost?",
  "criteriaTrue": "Izrecno časovno občutljivo ali blokira delo",
  "criteriaFalse": "Nobena nujnost ni izražena"
}
```

Preberite ga z `$triage.answers.is_urgent.noul`.

### Izbira

Izbere eno možnost iz niza, ki ga definirate. Vrača izbrano možnost, celotno porazdelitev in zaupanje, ki izhaja iz nje.

Dodajte možnost, ki pokriva "nobena od teh", kadar nič ne ustreza — model ne more izbrati možnosti, ki je niste ponudili.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Katera ekipa naj obravnava to zahtevo?",
  "options": [
    { "key": "billing", "description": "Plačila, fakturiranje, vračila" },
    { "key": "technical", "description": "Napake, izpadi, integracije" },
    { "key": "other", "description": "Nič od zgoraj ne ustreza" }
  ]
}
```

Preberite ga z `$triage.answers.department.choice`, `.probabilities.billing` in `.confidence`.

### Ocena

Ocenjuje stanje ob upoštevanju urejenega merila. Vrača vrednost, ki je obtežena z verjetnostjo in lahko pade **med** ravnmi, plus legenda in porazdelitev.

Ravni se začnejo od najnižjih, najmanj dve in največ deset. Vsaka raven naj opiše konkretno situacijo in naj stoji sama.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "Kako frustriran je stranka?",
  "levels": ["Miren", "Frustriran", "Zelo jezen"]
}
```

Preberite ga z `$triage.answers.frustration.score`, `.legend` in `.confidence`.

## Generirajte z AI

**Generirajte z AI** spremeni navaden stavek v predlagano predlogo stanja in niz vprašanj. Opisujte, kaj želite presojati — "triža prihajajočo podporno vozovnico: kako nujna je, katera ekipa jo obravnava in kako frustrirana se zdi stranka" — in preglejte, kaj se vrne, preden to dodate v vozlišče.

Osnutek pripravi LLM, zato dialog zahteva poverilnico LLM. Model odločanja odgovori na vprašanja kasneje, ko se workflow izvaja. Generirani id-ji se de-duplicitirajo glede na vrstice, ki jih vozlišče že vsebuje, tako da dvakratno generiranje nikoli ne prepiše obstoječega ključa odgovora.

Vsaka generacija se zabeleži v zavihku [Zgodovina](../tabs/traces-tab.md) pod virom **Odločilna Vprašanja**, skupaj z `decision.systemone` sledmi, ki jih je vozlišče samo zapisalo ob času izvajanja.
## Prilagojen telo zahteve

Vklopite **Prilagojen telo zahteve**, da pošljete JSON, ki ga napišete sami, namesto obrazca. Uporabite ga za endpoint, katerega pogodba se razlikuje od tiste, ki jo ustvari obrazec.

Urejevalnik je napolnjen s trenutnim obrazcem, izrazi znotraj njega pa se razrešijo, preden je zahteva poslana. Medtem ko je preklop vklopljen, se polje Stanje in vrstice vprašanj ignorirajo. Odgovor se prenese nespremenjen, ne glede na to, tako da drugačna pogodba preprosto ustvari drugačno obliko za vaše izraze.

## Izhod

Vozlišče vrne natančno to, kar je vrnil ponudnik. Nič ni preimenovano ali poenostavljeno.

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

## Razvejanje na podlagi odgovora

Vozlišče [Switch](./switch-node.md) usmerja na izbrano možnost, vozlišče [Condition](./condition-node.md) pa lahko pošlje primere z nizko zanesljivostjo nekam, kjer jih bo videl človek:

```
Vhod → Odločitev (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch na $triage.answers.department.choice
                              └─ false → Pošlji e-pošto (človeška pregled)
```

Tipiziran odgovor zagotavlja obliko, ne pa resničnosti. Izberite pragove glede na svoje podatke in posledice, namesto da bi kopirali številko iz primera.

## Poverilnica

Ustvarite **Poverilnico modela odločanja** v zavihku [Poverilnice](../tabs/credentials-tab.md) z:

- **Osnovni URL** — endpoint, na primer `https://api.typesafe.ai`. Heym doda `/v1/systemone`.
- **API ključ** — neobvezno. Endpointi, ki ne potrebujejo ključa, lahko ostanejo prazni.

Urejanje poverilnice ohrani shranjeni ključ, ko je polje ključa prazno; ponovno ga vnesite le, da ga zamenjate.

Enaka poverilnica lahko ocenjuje izvajanja [Vrednotenja](../tabs/evals-tab.md): z izbrano možnostjo **LLM-as-Judge** jo izberite kot sodnika, model odločanja pa oceni vsak odgovor glede na pričakovani izhod.

Heym privzeto blokira odhodne zahteve na zasebne in povratne naslove, zato potrebuje odločitev, ki jo izvajate sami na `localhost` ali v zasebnem razponu, nastavitev `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Modeli odločanja se ne prikažejo v tabelah cen LLM, ki jih sinhronizira Heym, zato ostane stolpec **Strošek** v [Zgodovini](../tabs/traces-tab.md) prazen za te klice. Število tokenov se še vedno beleži, vi pa lahko dodate svojo ceno z nadomestnim cenikom.

## Napake

| Situacija | Kaj se zgodi |
|-----------|--------------|
| Neveljaven API ključ | Vozlišče ne uspe z sporočilom, ki navaja poverilnico |
| Nepravilno oblikovano vprašanje | Sporočilo ponudnika na ravni polja se prenese v napako vozlišča |
| Omejitev hitrosti ali preobremenitev | Vozlišče ne uspe z sporočilom, ki pravi, da je stanje prehodno — vklopite [ponovno poskusite](../reference/features.md) za to vozlišče, da ga preživite |
| Podvojena ali prazna ID vprašanja | Vozlišče ne uspe, preden je katera koli zahteva poslana |

## Sorodno

- [LLM Node](./llm-node.md) – Generirajte besedilo namesto sodbe
- [Agent Node](./agent-node.md) – Zberite dokaze s pomočjo orodij, nato jih tukaj ocenite
- [Switch Node](./switch-node.md) – Usmerite na izbrano možnost
- [Condition Node](./condition-node.md) – Preverite zanesljivost
- [Node Types](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Poverilnice](../reference/credentials.md) – Vrste in polja poverilnic
- [Zavihek Zgodovina](../tabs/traces-tab.md) – Preverite klice odločitev in uporabo tokenov
