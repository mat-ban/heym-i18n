# Decision

**Decision**-solmu esittää päätösmallille tyypillisiä kysymyksiä suorituksen nykyisestä tilasta ja palauttaa todennäköisyydet. Se ei tuota tekstiä. Käytä tätä solmua, kun workflow tarvitsee päätöksen, johon se voi haarautua – reitityksen, priorisoinnin, arvioinnin, vahvistuksen tai vaiheen hallinnan osalta, jota ei voi peruuttaa.

Päätösmallit (jotka tunnetaan myös *System One* -malleina) eroavat merkittävästi LLM-malleista. Niissä ei ole prompottia, järjestelmäohjeita, lämpötilaa tai työkalujen kutsumista. Lähetetään **tila** sekä **kysymykset** karttana, ja jokainen vastaus palautetaan numerona, jonka takana on todennäköisyysjakauma. Koska vastaus koostuu vain muutamasta tokenista, nämä mallit ovat nopeita ja edullisia verrattuna siihen, että pyydetään [LLM](./llm-node.md)-solmua tuottamaan JSON ja jäsentämään se.

Tekstin tuottamiseen käytä [LLM](./llm-node.md)-solmua. Mallille, joka kutsuu työkaluja, käytä [Agent Node](./agent-node.md)-solmua.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Tuloste | Palveluntarjoajan vastaus sellaisenaan — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | Päätösmallin tunnistetiedot. Ei LLM-tunnistetietoja. |
| `model` | merkkijono | Mallin nimi, esim. `jev-latest` |
| `state` | lauseke | Mitä mallin tulisi lukea (oletus `$input.text`) |
| `questions` | taulukko | Järjestetyt kysymysrivit; vähintään yksi |
| `customBodyEnabled` | totuusarvo | Lähetä käsin kirjoitettu pyynnön runko lomakkeen sijaan |
| `customBody` | lauseke (JSON) | Lähetettävä runko, kun vaihtoehto on päällä |
| `requestTimeoutSeconds` | numero | Maksimisekunnit odotukseen (oletus: 60) |

### Tila

**Tila** on tilanne, jota malli arvioi. Se hyväksyy merkkijonon, objektin tai taulukon.

Kenttä, joka sisältää täsmälleen yhden lausekkeen, säilyttää oman tyyppinsä, joten `$input` lähettää objektin itsensä sen tekstin sijaan. Mallipohja, jonka sisällä on lauseke (`Ticket: $input.text`), muuttuu merkkijonoksi. Anna jokaiselle kysymykselle riittävästi tietoa vastaamiseen: lähdeteksti, identiteetit, suhteet, käytännöt ja nykyiset faktat.

## Kysymystyypit

Jokaisella kysymyksellä on `id`, `tyyppi`, `ohjeet` ja kriteerit, jotka riippuvat tyypistä.

`id` on tapa, jolla workflow lukee vastauksen. Sitä **ei koskaan lähetetä mallille**, joten koko merkityksen on oltava `ohjeissa`. Kirjoittaminen `id: is_urgent` ja `ohjeet: "Onko se?"` ei anna mallille mitään työskeltävää.

### Noul

Onko ehto voimassa. Palauttaa todennäköisyyden, että vastaus on kyllä, välillä 0–1.

Kriteerit ovat valinnaisia: **Kyllä tarkoittaa** ja **Ei tarkoittaa** kuvaavat, mitä kumpikin puoli kattaa. Arvo lähellä 0,5 tarkoittaa, että malli pitää kyllä- ja ei-vastauksia suunnilleen yhtä todennäköisinä – ei "keskitasoista intensiteettiä".

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Lue se `$triage.answers.is_urgent.noul`:lla.

### Choice

Valitsee yhden vaihtoehdon määrittelemästäsi joukosta. Palauttaa valitun vaihtoehdon, täyden jakauman ja siitä johdetun luottamuksen.

Lisää vaihtoehto, joka kattaa "ei mikään näistä", jos mikään ei välttämättä sovi – malli ei voi valita vaihtoehtoa, jota et tarjonnut.

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

Lue se `$triage.answers.department.choice`, `.probabilities.billing` ja `.confidence`:lla.

### Score

Arvioi tilaa järjestetyn rubriikin mukaisesti. Palauttaa todennäköisyyspainotetun arvon, joka voi sijoittua **tasojen väliin**, sekä legenda ja jakauma.

Tasot alkavat alimmasta, vähintään kaksi ja enintään kymmenen. Jokaisen tason tulisi kuvailla konkreettinen tilanne ja pysyä itsenäisenä.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Lue se `$triage.answers.frustration.score`, `.legend` ja `.confidence`:lla.

## Generoi tekoälyllä

**Generoi tekoälyllä** muuttaa tavallisen lauseen ehdotetuksi tilamallipohjaksi ja kysymysriveiksi. Kuvaile, mitä haluat arvioitavan – "priorisoi saapuva tukipyyntö: kuinka kiireellinen se on, mikä tiimi omistaa sen ja kuinka turhautunut asiakas kuulostaa" – ja tarkista tulokset ennen niiden lisäämistä solmuun.

Luonnoksen tekee LLM, joten keskustelu pyytää LLM-tunnistetietoja. Päätösmalli vastaa kysymyksiin myöhemmin, kun workflow suoritetaan. Generoidut id:t deduplioidaan solmussa jo olevien rivien suhteen, joten kahdesti generoiminen ei koskaan korvaa olemassa olevaa vastausavainta.

Jokainen generointi tallennetaan [Suoritukset](../tabs/traces-tab.md)-välilehdelle **Decision Questions** -lähteen alle, yhdessä solmun itsensä kirjoittamien `decision.systemone`-suoritusten kanssa ajankohdan ollessa suoritusaika.
## Mukautettu pyynnön runko

Ota käyttöön **Mukautettu pyynnön runko** lähettääksesi itse kirjoittamasi JSONin lomakkeen sijaan. Käytä tätä endpointille, jonka sopimus poikkeaa lomakkeella luodusta.

Editori täytetään nykyisen lomakkeen tiedoilla, ja sen sisältämät lausekkeet ratkaistaan ennen pyynnön lähettämistä. Kun vaihtoehto on päällä, Tila-kenttää ja kysymysrivejä ei huomioida. Vastaus välitetään muuttumattomana kummassakin tapauksessa, joten erilainen sopimus tuottaa vain erimuotoisen tuloksen lausekkeidesi käsiteltäväksi.

## Tuloste

Solmu palauttaa täsmälleen sen, mitä palveluntarjoaja palautti. Mitään ei nimetä uudelleen tai litistetä.

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

## Haaroitus vastauksen perusteella

[Switch](./switch-node.md)-solmu reitittää valitun vaihtoehdon perusteella, ja [Condition](./condition-node.md)-solmu voi ohjata alhaisen luottamuksen tapaukset paikkaan, jossa ihminen näkee ne:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Tyypitetty vastaus takaa muodon, ei totuuden. Valitse kynnysarvot omien tietojesi ja seurausten perusteella sen sijaan, että kopioisit numeron esimerkistä.

## Tunnistetiedot

Luo **Decision Model** -tunnistetiedot [Tunnistetiedot](../tabs/credentials-tab.md)-välilehdessä seuraavilla tiedoilla:

- **Base URL** – endpoint, esimerkiksi `https://api.typesafe.ai`. Heym lisää polkuun `/v1/systemone`.
- **API Key** – valinnainen. Endpointit, jotka eivät vaadi avainta, voivat jättää kentän tyhjäksi.

Tunnistetietojen muokkaaminen säilyttää tallennetun avaimen, kun avainkenttä jätetään tyhjäksi; kirjoita se uudelleen vain korvataksesi sen.

Samaa tunnistetietoja voidaan käyttää [Arvioinnit](../tabs/evals-tab.md)-ajojen arviointiin: kun **LLM-as-Judge** on valittuna, valitse se tuomariksi, ja päätösmalli pisteyttää jokaisen vastauksen odotetun tuloksen mukaisesti.

Heym estää oletusarvoisesti lähtevät pyynnöt yksityisiin ja loopback-osoitteisiin, joten paikallisesti (`localhost`) tai yksityisellä alueella ajettava päätösendpoint vaatii `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Päätösmallit eivät näy Heymin synkronoimissa LLM-hinnoittelutauluissa, joten **Cost**-sarake [Suoritukset](../tabs/traces-tab.md)-välilehdessä pysyy tyhjänä näissä kutsussa. Token-määrät silti tallennetaan, ja voit lisätä oman hinnan hinnoittelun ohituksella.

## Virheet

| Tilanne | Mitä tapahtuu |
|-----------|--------------|
| Virheellinen API-avain | Solmu epäonnistuu viestillä, joka nimeää tunnistetiedot |
| Virheellinen kysymys | Palveluntarjoajan oma kenttätason viesti välitetään solmun virheeseen |
| Rate limit tai ylikuormitus | Solmu epäonnistuu viestillä, joka ilmoittaa tilan olevan väliaikainen – ota käyttöön [yritys](../reference/features.md) tälle solmulle selviytyäksesi tilanteesta |
| Kaksinkertainen tai tyhjä kysymystunniste | Solmu epäonnistuu ennen kuin pyyntöä lähetetään |

## Liittyvät

- [LLM-solmu](./llm-node.md) – Luo tekstiä päätöksen sijaan
- [Agent-solmu](./agent-node.md) – Kerää todisteita työkaluilla ja arvioi ne täällä
- [Switch-solmu](./switch-node.md) – Reititä valitun vaihtoehdon perusteella
- [Condition-solmu](./condition-node.md) – Portti luottamukselle
- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Tunnistetiedot](../reference/credentials.md) – Tunnistetietojen tyypit ja kentät
- [Suoritukset-välilehti](../tabs/traces-tab.md) – Tarkastele päätöskutsuja ja tokenien käyttöä
