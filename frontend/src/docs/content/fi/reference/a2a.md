# A2A

Heym tarjoaa **Heym Agent** -agentin Agent2Agent-protokollan kautta (A2A 1.0, JSON-RPC-sidonta). Heym Agent on moottori [Chat-välilehti](../tabs/chat-tab.md) -näkymän takana; MCP-asiakkaat tavoittavat saman agentin työkaluna `heym_chat` (katso [MCP / A2A -välilehti](../tabs/mcp-tab.md)). Kun A2A on päällä, toinen agentti voi lähettää sille luonnollisella kielellä kirjoitetun Task-tehtävän ja saada vastauksen samoilla kyvyillä, joita Chat tarjoaa.

## Käyttöönotto

1. Avaa välilehti **MCP / A2A**.
2. Ota **Heym Agent** käyttöön oletuspalvelimella tai nimetyllä palvelimella ja valitse sen tunnistetiedot sekä malli.
3. Valitse **Ota A2A käyttöön**. Kortti näyttää **Agent Card** -osoitteen sekä **JSON-RPC Endpoint** -päätepisteen.

A2A rakentuu Heym Agent -agentin varaan: agentin poistaminen käytöstä kytkee myös A2A:n pois päältä.

## Endpoints

| | Oletuspalvelin | Nimetty palvelin |
|---|---|---|
| Agent Card | `{origin}/.well-known/agent-card.json` | `{origin}/api/a2a/servers/{server_id}/agent-card.json` |
| JSON-RPC | `POST {origin}/api/a2a` | `POST {origin}/api/a2a/servers/{server_id}` |

Agent Card ei vaadi tunnistetietoja eikä nimeä käyttäjää, palvelinta tai Workflow-prosessia. Se on olemassa vain A2A:n ollessa päällä: verkkotunnuksen kortti niin kauan kuin vähintään yhdellä käyttäjällä on A2A päällä oletuspalvelimelle; nimetyn palvelimen kortti niin kauan kuin kyseisen palvelimen A2A on aktiivinen. Muussa tapauksessa osoite palauttaa tilakoodin 404.

## Todennus

Lähetä samat tunnistetiedot kuin MCP:lle, ainoastaan otsakkeissa:

- `X-MCP-Key: <key>`: oletuspalvelimen avain tai nimetyn palvelimen avain
- `Authorization: Bearer <token>`: Heymin OAuth-palvelimen myöntämä OAuth Token

Osoiterivillä (URL) annetut tunnistetiedot hylätään. Agent Card ilmoittaa molemmat skeemat, joten A2A-asiakas voi lukea ne kortilta.

## Menetelmät

| Menetelmä | Kuvaus |
|---|---|
| `SendMessage` | Käynnistää Task-tehtävän tai jatkaa syötettä odottavaa tehtävää. Odottaa vastausta, ellei `configuration.returnImmediately` ole `true`. |
| `SendStreamingMessage` | Sama kuin yllä, Server-Sent Events -tapahtumavirtana tehtävän edistymisestä ja sen tuloksesta. |
| `GetTask` | Tehtävän tila, vastaus ja historia (`historyLength` rajoittaa historian pituutta). |
| `ListTasks` | Omat Tasks-tehtäväsi tällä palvelimella, uusimmat ensin, suodatettuna kentän `contextId` tai `status` mukaan, käyttäen parametreja `pageSize` ja `pageToken`. |
| `CancelTask` | Pysäyttää tehtävän, joka on edelleen käynnissä tai odottaa. |
| `SubscribeToTask` | Seuraa tehtävää, joka on vielä käynnissä. |
| `GetExtendedAgentCard` | Kortti, jossa näkyvät palvelimen nimi ja sille määritetyt Workflows-työnkulut taitoina. |

Push-ilmoituksia ei tarjota: kortti ilmoittaa `pushNotifications: false`, ja push-menetelmät vastaavat virheellä `PushNotificationNotSupportedError`. Pyynnöt käyttävät A2A 1.0 -versiota; lähetä otsake `A2A-Version: 1.0`. A2A 0.3 -menetelmien nimet, kuten `message/send`, vastaavat virheellä `VersionNotSupportedError`.

## Tasks ja keskustelut

Jokainen Task on keskustelu Chat-välilehdellä, merkittynä verkkokuvakkeella. Tehtävän `contextId` on kyseinen keskustelu: lähetä uusi viesti samalla `contextId`-tunnisteella ja ilman `taskId`-tunnistetta jatkaaksesi sitä.

| Mitä agentti teki | Task-tila |
|---|---|
| Vastasi | `TASK_STATE_COMPLETED`, vastauksen ollessa tekstimuodossa ja mahdollisten tallennettujen linkkien Workflows- ja arviointikokonaisuuksiin ollessa datana |
| Esitti tarkentavan kysymyksen | `TASK_STATE_INPUT_REQUIRED`: vastaa samalla `taskId`-tunnisteella |
| Tarvitsee tunnistetiedot | `TASK_STATE_AUTH_REQUIRED`: tilaviesti sisältää linkin Heymin tunnistetietosivulle. Käyttäjä avaa sen selaimeen, johon on kirjauduttu Heymiin; arvo ei koskaan kulje toisen agentin kautta. Lähetä sen jälkeen viesti samaan Task-tehtävään jatkaaksesi. |
| Epäonnistui | `TASK_STATE_FAILED`, sisältäen syyn |
| Peruutettiin | `TASK_STATE_CANCELED` |

Viesti valmistuneelle tehtävälle tai edelleen käynnissä olevalle hylätään virheellä `UnsupportedOperationError`. Viestit hyväksyvät osat `text` ja `data`, yhteensä enintään 20 000 merkkiä; tiedosto-osiot hylätään, joten lähetä tiedostot linkkeinä.

## Edistyminen

Kun Task työskentelee, tietovirta lähettää tilapäivityksen jokaisesta vaiheesta samoilla sanamuodoilla, joita Chat-välilehti näyttää, esimerkiksi `Running workflow "Invoice Parser"` tai `Testing the workflow · attempt 2/5`. MCP-asiakkaat saavat samat vaiheet `notifications/progress` -ilmoituksina työkalusta `heym_chat`.

## Esimerkki

```bash
curl -s https://heym.example.com/.well-known/agent-card.json

curl -s -X POST https://heym.example.com/api/a2a \
  -H "X-MCP-Key: $HEYM_MCP_KEY" \
  -H "A2A-Version: 1.0" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"SendMessage","params":{"message":{"messageId":"m1","role":"ROLE_USER","parts":[{"text":"List my workflows"}]}}}'
```

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "…",
      "status": { "state": "TASK_STATE_COMPLETED", "timestamp": "2026-10-27T10:30:00.000Z" },
      "artifacts": [
        { "artifactId": "response", "name": "Heym Agent reply", "parts": [{ "text": "You have 12 workflows: …" }] }
      ]
    }
  }
}
```

## Rajoitukset

- `CancelTask` pysäyttää käynnissä olevan vuoron välittömästi sitä suorittavassa Heym-instanssissa aivan kuten Chat-välilehden Stop-painike tekee. Muualla Task merkitään peruutetuksi eikä vuoron myöhäistä tulosta tallenneta.
- Ei push-ilmoituksia, ei REST- tai gRPC-sidontaa, ei allekirjoitettuja Agent Cards -kortteja.

## Liittyvät

- [MCP / A2A -välilehti](../tabs/mcp-tab.md): ota Heym Agent ja A2A käyttöön
- [Chat-välilehti](../tabs/chat-tab.md): agentin taustalla toimiva moottori
- [Turvallisuus](./security.md): miten avaimet säilytetään
