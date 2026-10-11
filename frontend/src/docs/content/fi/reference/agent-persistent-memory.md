# Agentin Pysyvä Muisti

Agent-solmut voivat säilyttää **solmukohtaisen tietoverkon** tietokannassa: entiteetit (tyypeineen ja ominaisuuksineen) sekä niiden väliset suhteet. Kun ominaisuus on käytössä, Heym **lisää yhteenvedon tästä verkosta järjestelmäpromptiin** jokaisella ajokerralla (jos verkko ei ole tyhjä). Onnistuneen suorituksen jälkeen **LLM-purkutyö** yhdistää uusia faktoja keskustelusta verkkoon taustalla.

Ala-agentit ja orkestroijat käyttävät oletusarvoisesti **oman canvas-solmun** verkkoa. Voit myös **myöntää muille agenteille luku- tai lukukirjoitusoikeuden** tämän solmun verkkoon (mukaan lukien **muiden workflowien** agentit) – katso [Jakaminen muiden agenttien kanssa](#jakaminen-muiden-agenttien-kanssa).

## Ominaisuuden käyttöönotto

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Kun arvo on `true`, lataa tämän solmun verkko järjestelmäpromptiin ja ajoita purkutyö tämän solmun verkkoon suorituksen jälkeen |
| `memoryShares` | taulukko (valinnainen) | Myöntää muille agent-solmuille pääsyn **tämän** solmun muistiverkkoon; katso [Jakaminen](#jakaminen-muiden-agenttien-kanssa) |

Ota ominaisuus käyttöön Agent-solmun asetuksista (**Pysyvä muisti (verkko)**). Vaaleanpunainen **aivo**-kuvake solmussa avaa verkon editorin, kun muisti on käytössä (tai kun malli näytetään).

## Verkon editori

Dialogi näyttää entiteetit animoituna, voimajohtimilla ohjattuna verkkoina – värikkäinä ympyröinä, joiden koko perustuu yhteyksien määrään ja jotka ryhmittyvät entiteettityypin mukaan – sekä muokkaus- ja navigointityökalut (kokonäkymä, siistimpi asettelu, pikanäppäimet). Voit **lisätä, muokata tai poistaa** solmuja ja yhteyksiä manuaalisesti; Lähde/Kohde-suhteen valitsimet ovat haettavissa, jos verkossa on paljon entiteettejä. Solmun valitseminen näyttää sen lähtevät ja saapuvat yhteydet, joihin voi hypätä napsauttamalla. Muutokset koskevat vain **tämän** agentin verkkoa (canvas-solmun verkkoa, jonka aivot avasit).

## Jakaminen muiden agenttien kanssa

Muistiverkon dialogissa **Jaa muisti muiden agenttien kanssa** voit liittää **vertaisia**, jotka voivat käyttää tätä verkkoa ajonaikaisesti:

1. Valitse **workflow** (mikä tahansa workflow, jonka voit avata editorissa).
2. Valitse **agent**-solmu kyseisessä workflowssa.
3. Aseta **Vain luku** tai **Luku ja kirjoitus**.

| Oikeus | Vaikutus |
|------------|--------|
| Vain luku | Kun **vertais**agentti suoritetaan, tämä verkko yhdistetään vertaisen järjestelmäpromptiin (jos verkossa on entiteettejä). Purkua tähän verkkoon vertaisen suorituksesta ei tehdä. |
| Luku ja kirjoitus | Sama prompt-käyttäytyminen kuin luvulla, ja **onnistuneen** vertaissuorituksen jälkeen tavallinen muistinpurkutyö voi myös **yhdistää tähän (omistajan) verkkoon** käyttäen vertaissuorituksen tunnistetietoja. |

Vertaiset tallennetaan omistajasolmuun `memoryShares`-merkintöinä, joissa on `peerWorkflowId` ja `peerCanvasNodeId` (sekä `permission`). Vanhemmissa workflowissa `peerWorkflowId` voi puuttua vertaisille **samassa** workflowssa; editori käsittelee tämän nykyisenä workflowna.

**Workflowjen välinen jakaminen** ratkaistaan suoritushetkellä skannaamalla workflowt, **joita omistat**. Suoritukset ilman todentunutta käyttäjäkontekstia ratkaisevat vain nykyisen workflown JSON-määrittelyssä määritellyt jaot (sama canvas).

## Ajonaikainen käyttäytyminen

### Oma verkko (`persistentMemoryEnabled`)

1. **Ennen LLM-kutsua** – Jos verkossa on entiteettejä, järjestelmäohjeisiin lisätään lohko, joka selittää, että nämä ovat faktoja aiemmista suorituksista (voi olla epätäydellinen; nykyinen käyttäjäviesti voittaa ristiriitatilanteissa).
2. **Onnistuneen suorituksen jälkeen** – Taustatyö pyytää mallilta (sama tunnistetieto kuin agentin suorituksessa) rakennetun JSON:n (entiteetit + suhteet). Tämä payload yhdistetään tietokantaan (deduplikaatio ja suhteiden siivoaminen koskee joitain tyyppejä, esim. työllistymistyylisiä yhteyksiä).

### Vertaiset, jotka saavat jaettuja verkkoja

Kun agentti suoritetaan, järjestelmä etsii **omistaja**solmuja (missä tahansa workflowssasi, kun mahdollista), joiden `memoryShares` osoittaa tämän suorituksen workflowen ja canvas-solmuun. Jokaisesta vastaavuudesta omistajan verkko lisätään järjestelmäpromptiin **jaetun muistin** osiona. **Luku ja kirjoitus** -vertaiset lisäksi ajoittavat purkukohteet **omistajan** workflow/verkkoon, kun suoritus onnistuu.

Purkua **ei** suoriteta, jos suoritus epäonnistuu tai päättyy HITL-odotustilaan.

## Workflow JSON (`data`-kenttä)

Tallennetaan agent-solmuun kuten muutkin asetukset:

```json
{
  "type": "agent",
  "data": {
    "label": "supportAgent",
    "persistentMemoryEnabled": true,
    "userMessage": "$input.text",
    "memoryShares": [
      {
        "peerWorkflowId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        "peerCanvasNodeId": "agent-peer-canvas-id",
        "permission": "read"
      }
    ]
  }
}
```

`permission` on `"read"` tai `"write"`. Jätä `memoryShares` pois tai käytä `[]`, kun jakamista ei ole.

Katso [Workflow-rakenne](./workflow-structure.md) koko solmuobjektin muodosta.

## Aiheeseen liittyvät

- [Agent-solmu](../nodes/agent-node.md) – Täydellinen agentin määritys
- [Agenttien arkkitehtuuri](./agent-architecture.md) – Orkestroija, ala-agentit, työkalut
- [Workflow-rakenne](./workflow-structure.md) – JSON-workflowmuoto
- [Canvas-ominaisuudet](./canvas-features.md) – Aivojen hallinta ja verkkodialogi
- [Suoritukset-välilehti](../tabs/traces-tab.md) – LLM-pyyntöjen/vastausten tarkkailu
