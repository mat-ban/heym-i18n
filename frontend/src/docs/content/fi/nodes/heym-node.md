# Heym

**Heym**-solmu lukee Heymin omia tietoja: käytettävissä olevat workflowt, yhden workflown rakenteen ja sen suoritushistorian. Se mahdollistaa metaworkflowien luomisen – esimerkiksi instanssien inventaarioita, suoritusyhteenvetoja ja terveysraportteja Heymistä itsestään.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1 |
| Operaatiot | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Tunnistetiedot | Ei vaadita |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `heymOperation` | Valinta | Suoritettava lukuoperaatio |
| `heymWorkflowId` | UUID | Aseta se arvoon `all` kohdassa `getExecutionHistory`, jos haluat lukea kaikki tavoitettavissa olevat workflow't. |
| `heymLimit` | Merkkijono | Palautettavien rivien enimmäismäärä. **Jätä tyhjäksi tai syötä `0` palauttaaksesi kaiken** – tämä on oletusarvo. Lausekekelpoinen. |
| `heymStatus` | Merkkijono | Valinnainen statussuodatin `getExecutionHistory`-operaatiota varten. Lausekekelpoinen. |
| `heymSinceDays` | Merkkijono | Valinnainen päivien takaisin katselu `getExecutionHistory`-operaatiota varten. Lausekekelpoinen. |

Workflow-valitsin on haettava pudotusvalikko, joka listaa kaikki käytettävissä olevat workflowt.

## Käyttöalue

Tulokset rajoittuvat **solmussa olevan workflown omistajan** käyttöoikeuksiin – ei käynnistäjän oikeuksiin. Näkyvä joukko koostuu:

- omistajan omistamista workflowista,
- suoraan omistajalle jaetuista workflowista,
- omistajan tiimin käytettävissä olevista workflowista.

Omistajakohtainen rajoitus takaa solmun toiminnan samana riippumatta siitä, käynnistettiinkö suoritus manuaalisesti, cronilla, portaalista vai alustatapahtumasta. Käyttäjäkohtainen rajoitus palauttaisi tyhjän jokaisella automaattisella suorituksella. Sääntö on sama, jota Heym käyttää jo tunnistetietojen ja globaalien muuttujien kohdalla.

Workflow, johon ei ole käyttöoikeutta, ja olematon workflow tuottavat saman virheilmoituksen, joten solmua ei voida käyttää workflow-tunnisteiden etsimiseen.

## Operaatiot

### Listaa Workflowt

Palauttaa kaikki omistajan käytettävissä olevat workflowt, viimeisimmästä päivitetyistä alkaen.

| Lauseke | Kuvaus |
|------------|-------------|
| `$nodeLabel.workflows` | Workflow-yhteenvetojen taulukko |
| `$nodeLabel.workflows[0].id` | Workflown UUID |
| `$nodeLabel.workflows[0].name` | Workflown nimi |
| `$nodeLabel.workflows[0].description` | Kuvaus tai `null` |
| `$nodeLabel.workflows[0].active` | Onko workflow aktiivinen |
| `$nodeLabel.workflows[0].folder_id` | Kansion UUID tai `null` |
| `$nodeLabel.workflows[0].updated_at` | Viimeisimmän tallennuksen ISO-aikaleima |
| `$nodeLabel.workflows[0].node_count` | Workflown solmujen määrä |
| `$nodeLabel.total` | Käytettävissä olevien workflowjen kokonaismäärä **ennen** rajoituksen soveltamista |

`total` on tarkoituksella rajoittamaton määrä, joten `$inventory.total` raportoi edelleen todellisen koon vaikka palautettavat rivit olisivat rajoitettuja. **Raja**-kentän tyhjentäminen tai arvon `0` asettaminen palauttaa kaikki workflowt – tämä on oletusarvo.

### Hae Workflow

Palauttaa yhden workflown identiteetin ja rakenteen.

| Lauseke | Kuvaus |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Workflown identiteetti |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Workflown metadata |
| `$nodeLabel.node_count` | Solmujen määrä |
| `$nodeLabel.nodes` | Taulukko muotoa `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Taulukko muotoa `{ id, source, target, sourceHandle, targetHandle }` |

`data` sisältää **solmun täyden konfiguraation** – kaikki kentät sellaisina kuin ne on tallennettu. Tämä mahdollistaa tarkastuksen: workflowa ei voi skannata API-avaimen varalta, jos solmu ei näytä kenttää.

Tämä ei myönnä käyttöoikeuksia, joita kutsujalla ei jo olisi. Solmu rajoittuu workflowihin, jotka omistaja voi muutenkin avata editorissa, ja tallennetut salaiset tunnistetiedot eivät siltikään näy täällä: solmujen tiedot sisältävät vain tunnistetietojen **tunnisteet**, kun itse salaisuudet säilyvät salattuna tunnistetietojen taulukossa.

### Koodattuihin salaisuuksiin skannaus

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Anna agentille `$detail.nodes` ja pyydä sitä liputtamaan kaikki `data`-arvot, jotka näyttävät olevan aktiivisia avaimia tai tokeneita. Tarkkailun arvoisia kenttiä ovat vapaatekstikentät – HTTP-solmujen `curl`, LLM- ja Agent-solmujen `userMessage` ja `systemInstruction` sekä Python-työkalujen koodi – sillä tunnistetietojen tunniste on harmiton UUID, mutta liimattu `sk-…` ei ole.
### Hae suoritushistoria

Palauttaa workflowin suoritushistoriaan kuuluvat merkinnät uusimmasta vanhimpaan.

| Lauseke | Kuvaus |
|------------|-------------|
| `$nodeLabel.executions` | Historiaan kuuluvien merkintöjen taulukko |
| `$nodeLabel.executions[0].id` | Suorituksen UUID |
| `$nodeLabel.executions[0].status` | `success`, `error` jne. |
| `$nodeLabel.executions[0].started_at` | ISO-aikaleima |
| `$nodeLabel.executions[0].execution_time_ms` | Suoritusaika millisekunteina |
| `$nodeLabel.executions[0].trigger_source` | Suorituksen käynnistävä lähde, esim. `cron` tai `heym_event` |
| `$nodeLabel.executions[0].recovered` | Onko suoritus palautettu kaatumisen jälkeen |
| `$nodeLabel.executions[0].inputs` | Suorituksen saamat syötteet - käynnistyspayload tai kutsujan syötteet |
| `$nodeLabel.executions[0].outputs` | Workflowin tuottamat tulosteet kyseiselle suoritukselle |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Workflow, johon historia kuuluu, tai `null` valinnalla **{AW}** |
, tai `null` valinnalla **{AW}** |
| `$nodeLabel.total` | Vastaavien suoritusten kokonaismäärä **ennen** rajoi| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Valinnalla **{AW}** workflow, johon kukin suoritus kuuluu |
tusta |
| `$nodeLabel.by_status` | Tilakohtaiset lukumäärät, esim. `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Historian alkupiste tai `null` koko historiassa |

Merkinnät sisältävät sekä `inputs` että `outputs` - suorituksen saamat syötteet ja sen tuottamat tulosteet - mutta eivät koskaan `node_results`: solmukohtaiset jäljitykset ovat taulukon laajimpia sarakkeita ja paisuisivat muun datan rinnalla. Hae yksittäinen suoritus API:n kautta, kun tarvitset täydellisen jäljityksen.

`total` ja `by_status` kuvaavat aina **koko** vastaavaa historiaa, vaikka **Rajoitus** rajoittaisi palautettujen merkintöjen määrää - joten voit hakea viisi viimeisintä suoritusta ja silti raportoida tarkkoja virhelukuja.

Jätä **Päivää sitten** tyhjäksi kattaaksesi kaiken, **Tilasuodatin** tyhjäksi sisällyttääksesi kaikki tilat ja **Rajoitus** tyhjäksi tai `0` palauttaaksesi kaikki merkinnät.

## Esimerkkiworkflow

**Päivittäinen instanssin yhteenveto**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` merkitty nimellä `inventory`
- **Loop** käy läpi `$inventory.workflows` -taulukon
- **Heym** `getExecutionHistory` asetuksilla `heymWorkflowId` (loop-kohde `id`), `heymSinceDays` arvolla `1` ja `heymLimit` arvolla `5`
- **LLM** muuntaa kerätyt suoritukset ja tilalukumäärät luettavaksi yhteenvedoksi

## Huomioita

- Tunnistetietoja ei tarvita; solmu lukee samaa tietokantaa, jota Heym käyttää.
- **Rajoitus** on sama kenttä molemmille listausoperaatioille, ja sillä on sama merkitys molemmissa: tyhjä tai `0` palauttaa kaiken.
- Solmu ottaa normaaleja syötteitä ja voidaan liittää Agent-solmuun työkaluna, jolloin agentti voi vastata kysymyksiin Heym-instanssistasi - tai tarkastaa sen.
- `getWorkflow` -payloadit kasvavat workflown mukana: pitkät promputit ja Python-työkalujen koodit kulkevat `data`-kentässä.
- Yhdistä se [Heym Trigger](./heym-trigger-node.md) -solmuun reagoidaksesi workflow-muutoksiin reaaliajassa äläkä säännöllisellä kyselyllä.

## Liittyvät

- [Heym Trigger](./heym-trigger-node.md) – Käynnistä workflow alustan tapahtumista
- [Suorita](./execute-node.md) – Suorita toinen workflow sen kuvaamisen sijaan
- [Loop](./loop-node.md) – Toista toiminto palautetun workflow-listan yli
