# Webhookit

Workflowt voidaan käynnistää HTTP-webhookien avulla. Vakio suoritusendpoint palauttaa JSON-muotoisen vastauksen, ja striimausversio palauttaa Server-Sent Events (SSE) -tapahtumia.

## Endpoint

`POST /api/workflows/{workflow_id}/execute`

Korvaa `{workflow_id}` workflown UUID:lla. Perus-URL on Heym-instanssisi (esim. `https://app.heym.ai`).

## Pyyntömetodi

Jokainen workflow hyväksyy yhden HTTP-verbin, joka valitaan editorin cURL-dialogissa: `GET`, `POST`, `PUT` tai `DELETE`. **Oletusarvo on `POST`**, ja kaikki tätä asetusta edeltävät workflowt säilyttävät sen, joten mikään tällä hetkellä toimiva ei muutu.

Jos workflowa kutsutaan väärällä verbillä, palautetaan virhe `405 Method Not Allowed` ja `Allow`-otsikko, joka ilmoittaa sallitun metodin:

```
$ curl -X POST "https://your-host/api/workflows/<workflow-id>/execute"
HTTP/1.1 405 Method Not Allowed
Allow: GET
```

Poikkeus: pyynnöt, jotka sisältävät parametrin `?test_run=true`, ohittavat tarkistuksen. Tätä käyttävät editorin **Suorita**-painike ja debug-paneeli, joten `GET`-metodilla määritetty workflow pysyy testattavissa tuotteen sisältä.

### Kehottomat metodit

`GET` ja `DELETE` eivät sisällä pyyntökehoa. Syötteet tulevat kyselymerkkijonosta, ja niitä luetaan lausekkeella `$input.query.<nimi>`:

```
curl -X GET "https://your-host/api/workflows/<workflow-id>/execute?name=Ada"
```

cURL-dialogi piilottaa pyyntökehon editorin ja poistaa `Content-Type`-otsikon näillä kahdella metodilla.

Yhdistä `GET` [HTML-output-mapper](../nodes/html-output-mapper-node.md) -solmuun tarjotaksesi sivun, jonka selain voi avata suoraan.

## Striimausendpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Käytä striimausendpointia, kun haluat inkrementaalisia suoritustapahtumia yhden JSON-vastauksen sijaan. Katso [SSE Streaming](./sse-streaming.md) tapahtumaprotokollan ja solmukohtaisen aloitusviestin konfigurointia varten.

## Pyynnön muoto

Pyyntökeho välitetään [Input](../nodes/input-node.md) -solmuille parametrina `body`. Heym hyväksyy molemmat pyyntömuodot:

- **Raaka JSON** – esim. `{"userId": "123", "action": "create"}`
- **Kääremuoto** – `{"inputs": {...}, "test_run": false}`

Kääremuotoa käytettäessä `inputs` erotetaan ja välitetään parametrina `body`. `test_run` ohittaa rajoitukset ja välimuistin. Voit myös lähettää parametrin `?test_run=true` kyselymerkkijonossa lähetettäessä raakaa JSONia.

## Pyyntökehon tilat

Jokaisella workflowlla on asetus `webhook_body_mode`, joka määrittää, miten editori rakentaa esimerkkipyyntöjä:

| Tila | Toiminta |
|------|----------|
| **defined** | Editori ja cURL-dialogi muotoilevat esimerkkikehon workflown Input-solmun kenttien perusteella ja säilyttävät tyhjät avaimet JSON-paketissa. Määriteltyyn tyyliin tehdyt cURL-pyynnöt jatkavat toimintaansa. |
| **generic** | Editori ja cURL-dialogi käyttävät vapaamuotoista JSON-kehoa. Pyyntökeho välitetään sellaisenaan, joten ulkoiset sovellukset voivat lähettää omia kiinteitä muotoja. |

Suoritus-API pysyy taaksepäin yhteensopivana molemmissa tiloissa. Raaka JSON ja kääremuotoinen `{ "inputs": ... }` hyväksytään kummassakin tilassa.

Otsikot ja kyselyparametrit ovat saatavilla lausekkeissa muodossa `$input.headers` ja `$input.query`. Otsikkoavaimet muunnetaan pieniksi kirjaimiksi.

## Tunnistautuminen

Määritä workflowkohtaisesti editorissa (workflow-asetukset). Tunnistautuminen tarkistetaan ennen suoritusta.

| auth_type | Toiminta |
|-----------|----------|
| **anonymous** | Tunnistautumista ei vaadita. Kuka tahansa voi kutsua endpointia. |
| **jwt** | Vaaditaan Bearer-token. Hyväksyy joko käyttäjäistunnon (käyttäjällä on oltava workflow-oikeudet) tai tähän workflowhun luodun [Execution Token](./execution-tokens.md) -tokenin. |
| **header_auth** | Mukautetun otsikon on täsmättävä. Aseta `auth_header_key` (esim. `X-API-Key`) ja `auth_header_value`. |

`header_auth` -tyypissä pyyntöotsikon arvon on täsmättävä tarkalleen määritettyyn arvoon. JWT-käyttäjät, joilla on workflow-oikeudet, voivat myös kutsua ilman mukautettua otsikkoa.

`jwt` -tyypissä [Execution Tokens](./execution-tokens.md) on suositeltu tapa kutsua workflowja ulkoisista järjestelmistä - ne on rajattu yhteen workflowhun ja voidaan mitätöidä erikseen.

## Vastauksen välimuistitus

Määritä workflowkohtaisesti `cache_ttl_seconds`. Kun asetus on käytössä ja arvo on suurempi kuin 0:

- **Välimuistiavain**: SHA256-tiiviste `workflow_id` + `body` + `query` -yhdistelmästä
- **Välimuistiosauma**: Palauttaa välittömästi tilalla `status: "cached"` ja välimuistoidut tulokset
- **Välimuistin asetus**: Vain onnistuneen suorituksen (`status: "success"`) jälkeen
- **Tallennus**: Postgres-pohjainen ja jaettu backend-työntekijöiden kesken

| Asetus | Vaikutus |
|---------|--------|
| `cache_ttl_seconds` = 0 tai null | Välimuistitus pois käytöstä |
| `cache_ttl_seconds` > 0 | Vastaukset välimuistoidaan tämän sekuntimäärän ajaksi |

`test_run` -pyynnöt ohittavat välimuistin (ei luku, ei kirjoitus).

Kun vastauksen välimuistitus on käytössä cURL-dialogissa, **Tyhjennä välimuisti** poistaa kyseisen workflown välimuistoidut vastaukset välittömästi.

## Kutsurajoitukset

Määritä workflowkohtaisesti: `rate_limit_requests` ja `rate_limit_window_seconds`.

- **Laajuus**: Per `workflow_id` + asiakas-IP (liukuva ikkuna)
- **Ylitys**: HTTP 429 virhe `Retry-After` -otsikolla
- **Otsikot**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

| Asetus | Kuvaus |
|---------|-------------|
| `rate_limit_requests` | Sallittujen pyyntöjen enimmäismäärä ikkunassa |
| `rate_limit_window_seconds` | Ikkunan kesto sekunteina |

`test_run` -pyynnöt ohittavat kutsurajoitukset.
## Vastemuoto

Endpoint palauttaa JSON-muotoisen vastauksen:

```json
{
  "workflow_id": "uuid",
  "status": "success",
  "outputs": { ... },
  "execution_time_ms": 123
}
```

| Kenttä | Kuvaus |
|-------|-------------|
| `workflow_id` | Workflown UUID |
| `status` | `success`, `error`, `cached` tai `rate_limited` |
| `outputs` | Loppusolmujen tulokset. Jos [JSON output mapper](../nodes/json-output-mapper-node.md) on ainoa loppusolmu, vastauksen runko on kohdistettu objekti ylätasolla (oletusarvoinen yksinkertainen JSON-vastaus). Muussa tapauksessa sisältää [Output](../nodes/output-node.md) ja muut loppusolmut avaimina käyttäen niiden leimoja. |
| `execution_time_ms` | Suoritusaika millisekunteina (0 välimuistissa/rajoitetuissa suorituksissa) |

Virhetilanteessa `outputs` voi sisältää virhetiedot. [Throw Error](../nodes/throw-error-node.md) -solmulla voidaan asettaa mukautettu HTTP-statuskoodi (4xx/5xx).

## Suorita cURL-valintaikkunassa

Työkalurivin **Run with cURL** -painike (editorin oikeassa yläkulmassa, `cURL`-kuvake) avaa valintaikkunan, joka rakentaa ja kopioi valmiin suoritettavan cURL-komennon nykyiselle workflowlle.

### Toiminnallisuus

| Kenttä | Kuvaus |
|-------|-------------|
| **Request Body Mode** | Valitse **Defined** tai **Generic**. Generic säilyttää pyynnön rungon raakana JSONina sen sijaan, että se muotoiltaisiin Syötesolmun kenttien perusteella. |
| **Authentication** | Valitse Anonymous, JWT Token tai Header Auth. Asettaa oikean tunnistuskentän komentoon. Kun JWT Token on valittuna, valintaikkuna näyttää [Execution Token](./execution-tokens.md) -hallinnan - luo tai valitse tunnus upottaaksesi sen suoraan komentoon. |
| **Header Key / Value** | Näkyy, kun Header Auth on valittuna. Esitäytetty workflown tunnistusasetuksista. |
| **Response Cache** | Vastausten välimuistiaika minuutteina identtisille pyynnöille (0 = pois käytöstä). Muutokset tallennetaan workflowhun. Kun käytössä, **Clear cache** tyhjentää välimuistin välittömästi. |
| **Rate Limit** | Enimmäismäärä pyyntöjä aikavälillä. Muutokset tallennetaan workflowhun. |
| **SSE Streaming** | Vaihtaa komennon käyttämään `/execute/stream`-endpointtia, lisää `--no-buffer`-lipun ja näyttää solmukohtaiset `node_start`-viestien asetukset. |
| **Body** | JSON-pyynnön runko. Defined-tilassa se on esitäytetty [Input](../nodes/input-node.md) -solmun kentistä ja säilyttää tyhjät avaimet. Generic-tilassa se on raaka JSON-editori. |
| **Command** | Vain luku -esikatselu koko cURL-komennosta. |

Klikkaa **Copy cURL** kopioidaksesi komennon leikepöydälle.

### Esimerkki

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-value" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Generic-tilassa sisäkkäiset payloadit säilyvät ennallaan, esimerkiksi:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"event":{"user":{"id":"123"}}}'
```

Valintaikkuna heijastaa workflowlle tallennettuja tunnistus-, runkotilan, välimuisti- ja rajoitusasetuksia - niiden muokkaaminen tässä päivittää workflowa välittömästi.

### SSE-suoratoisto valintaikkunassa

Ota **SSE Streaming** käyttöön, kun haluat generoidun komennon seuraavan suoritusta reaaliajassa terminaalistasi.

- Endpoint vaihtuu muotoon `/execute/stream`
- Komentoon lisätään `--no-buffer` ja `Accept: text/event-stream`
- Jokainen ei-sticky-solmu näkyy listassa, jossa voit:
  - ottaa `node_start`-viestin käyttöön tai poistaa sen käytöstä
  - mukauttaa aloitusviestin tekstiä
- `node_complete`-tapahtumat lähetetään aina ja sisältävät koko solmun tuloksen

Esimerkki:

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Täydellistä tapahtumaprotokollaa ja esimerkkejä varten katso [SSE Streaming](./sse-streaming.md).

## Lähdemerkintä käynnistimille

Jokainen suoritus tallentaa `trigger_source`-leiman, joka näkyy [Execution History](./execution-history.md) -näkymässä. Aseta se lähettämällä `X-Trigger-Source`-otsikko minkä tahansa valitsemasi arvon kanssa:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Editorin valintaikkunan **Copy cURL** -painike sisältää automaattisesti `X-Trigger-Source: API` -otsikon. Voit korvata `API`:n millä tahansa merkityksellisellä arvolla - `scheduler`, `rabbitmq`, `github-actions` jne.

Jos otsikkoa ei lähetetä, `trigger_source` saa oletusarvon `"API"` ja suoritus merkitään historiassa **API**:ksi. Korvaa se millä tahansa järjestelmällesi merkityksellisellä arvolla - `scheduler`, `github-actions`, `rabbitmq` jne.

## Aiheeseen liittyvät

- [Execution Tokens](./execution-tokens.md) – Rajatut JWT:t workflowjen kutsumiseen ulkoisista järjestelmistä
- [SSE Streaming](./sse-streaming.md) – Solmujen tapahtumien reaaliaikainen suoratoisto Server-Sent Eventsin avulla
- [Triggers](./triggers.md) – Kaikki workflown käynnistyspisteet mukaan lukien webhook
- [Workflow Structure](./workflow-structure.md) – Solmut ja yhteydet
- [Expression DSL](./expression-dsl.md) – Käyttö `$input.body`, `$input.headers`, `$input.query` -lausekkeisiin
