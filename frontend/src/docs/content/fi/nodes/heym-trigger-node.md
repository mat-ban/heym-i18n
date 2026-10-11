# Heym Trigger

**Heym Trigger** -solmu käynnistää workflow:n, kun Heym itse julkaisee alustatason tapahtuman. Se on nollasyötteinen käynnistin, jonka avulla voit automatisoida Heymiä Heymillä: muutoslokeja, käyttöönottoilmoituksia ja instanssin terveystilannekatsauksia.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 0 |
| Tulosteet | 1 |
| Tulos | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Tunnistetiedot | Ei vaadita |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `eventNames` | Merkkijonotaulukko | Mitkä tapahtumat tilataan. Jätä tyhjäksi vastaanottaaksesi kaikki tapahtumat. |

## Tapahtumat

| Tapahtuma | Julkaistaan kun | Laajuus |
|-------|----------------|-------|
| `heym.started` | Heym-alusta käynnistyy | Instanssilaajuinen: kaikki tilaajat saavat sen |
| `workflow.created` | Workflow luodaan | Vain workflown omistajan tilaajat |
| `workflow.updated` | Workflow tallennetaan | Vain workflown omistajan tilaajat |
| `workflow.deleted` | Workflow poistetaan | Vain workflown omistajan tilaajat |

Dashboard-widgetit tallennetaan sisäisesti workflowina, mutta ne eivät koskaan aiheuta `workflow.*` -tapahtumia.

## Toimitus tapahtuu erissä

Heym lähettää tapahtumat viiden sekunnin välein. **Kaikki yhden lähetysjakson aikana vaaditut tapahtumat saapuvat yhdessä workflow-ajossa** taulukkona.

- Luodaan kaksi workflowta viiden sekunnin sisällä → **yksi** ajo, jossa on kaksi tapahtumaa.
- Luodaan yksi workflow → **yksi** ajo, jossa on yhden alkion taulukko.

Muoto ei koskaan muutu, joten alavirran lausekkeiden ei tarvitse erotella tilannetta, jossa saapuu yksi tai useampi tapahtuma. Kun haluat toimia kerran per tapahtuma, käytä [Loop](./loop-node.md) -solmua `$nodeLabel.events` -taulukon yli.

## Toimitus täsmälleen kerran

Jokainen tapahtuma varataan tietokannan uniikkirajoitteen avulla ennen toimittamista. Tämä toimii kaikissa uvicorn-työntekijöissä, säiliöissä ja koneissa: kahdella palvelimella toimiva Heym ei toimitata tapahtumaa kahdesti. Jos varausta ei voida tallentaa, tapahtumaa ei toimiteta lainkaan — suunnittelu epäonnistuu sulkeutuneena sen sijaan, että laukeaisi kahdesti.

Kaksi erillistä `heymTrigger` -solmua, jotka tilaavat saman tapahtuman, saavat sen kumpikin kerran; ne eivät kilpaile siitä.

## Lähetysikkuna

Lähettäjä huomioi vain viimeisen **viiden minuutin** aikana julkaistut tapahtumat. Vanhemmat tapahtumat säilyvät tarkastelua varten, mutta niitä ei koskaan toimiteta. Tämä rajoittaa toimintaa katkon jälkeen: kun Heym käynnistetään tunnin jälkeen, se ei toista mitään, vaan välttää tunnin takaisen tapahtumajonon kertarysäyksen.

Tapahtumat säilytetään **7 päivää** ja poistetaan sen jälkeen.

## Tulostekentät

| Lauseke | Kuvaus |
|------------|-------------|
| `$nodeLabel.events` | Tapahtumaolioiden taulukko, vanhin ensin. Aina taulukko. |
| `$nodeLabel.events[0].id` | Tapahtuman UUID |
| `$nodeLabel.events[0].name` | Tapahtuman nimi, esim. `workflow.created` |
| `$nodeLabel.events[0].payload` | Tapahtuman runko |
| `$nodeLabel.events[0].workflow_id` | Kohdeworkflown tunniste tai `null` `heym.started` -tapauksessa |
| `$nodeLabel.events[0].created_at` | ISO-aikaleima tapahtuman julkaisemisajankohdalle |
| `$nodeLabel.count` | Tämän erän tapahtumien määrä |
| `$nodeLabel.triggered_at` | ISO-aikaleima workflown suoritukselle |

### Payload-muodot

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` sisältää nimen, joka tallennettiin juuri ennen poistoa, koska workflow-rivi on jo poistettu, kun tapahtuma luetaan.

## Esimerkkiworkflow

**Workflow-muutosloki**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** -solmu, tunniste `platformEvents`, tilaa `workflow.created`, `workflow.updated`, `workflow.deleted`
- **Heym** -solmu, jossa `getWorkflow` ja `heymWorkflowId` asetettu arvoon `$platformEvents.events[0].workflow_id`
- **Slack** -viesti: `"$platformEvents.count workflow-muutosta, viimeisin: $platformEvents.events[0].name"`

## Huomioita

- `heym.started` laukeaa **kerran per alustan käynnistys**, ei kerran per työntekijä, vaikka Heym käyttääkin kahdeksaa työntekijää per säiliö. Säiliöt, jotka käynnistyvät yli viiden minuutin välein, julkaisevat kukin yhden tapahtuman.
- Tällä tavalla käynnistetyt suoritukset näkyvät historiassa merkinnällä `trigger_source = "heym_event"`.
- Aseta **Tapahtumat** tyhjäksi sen sijaan, että listaisit kaikki neljä, jos haluat automaattisesti tilata tulevissa versioissa lisätyt tapahtumatyyppit.

## Liittyvät

- [Heym](./heym-node.md) – Lue workflowt ja suoritushistoria
- [Triggers](../reference/triggers.md) – Yleiskatsaus kaikista workflown käynnistyspisteistä
- [Loop](./loop-node.md) – Toimi kerran per tapahtuma erässä
