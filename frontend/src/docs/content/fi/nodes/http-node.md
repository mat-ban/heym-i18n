# HTTP

**HTTP**-solmu tekee HTTP-pyyntöjä käyttäen cURL-syntaksia. Se voi toimia workflown alkupisteenä (ei saapuvia yhteyksiä) tai vastaanottaa syötettä ylempänä olevilta solmuilta.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Saapuvat yhteydet | 0 tai 1 |
| Lähtevät yhteydet | 1 |
| Tuloste | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `label` | merkkijono | Solmun tunniste (camelCase) |
| `curl` | merkkijono | cURL-komento (esim. `curl -X GET https://api.example.com`) |

## Vastauksen muoto

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Vastauksen käyttö

- `$httpNode.status` – HTTP-tilakoodi
- `$httpNode.body` – Vastauksen runko (merkkijono tai jäsennelty JSON)
- `$httpNode.body.fieldName` – JSON-kenttien käyttö
- `$httpNode.headers` – Vastauksen otsakkeet

## Esimerkki

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Käytä cURL-syntaksia `-H`-optiolla otsakkeille, `-d`-optiolla POST-pyynnön rungolle jne. Lausekkeita voidaan käyttää missä tahansa cURL-merkkijonossa, mukaan lukien URL-osoite, otsake tai koko otsakerivi. [Otsaketunnistetiedot](../reference/credentials.md) muuntuvat muotoon `avain: arvo`, joten `-H "$credentials.MyApiKey"` lähettää koko otsakkeen:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Lausekkeiden sisällä olevat lainausmerkit ja välilyönnit kuuluvat lausekkeeseen, ei cURL-komentoon, joten merkkijonoargumentteja hyväksyvät metodit toimivat suoraan:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Tunnistetietojen käyttö

`$credentials.Nimi` muuntuu eri arvoksi kunkin [tunnistetietotyypin](../reference/credentials.md) mukaan, joten otsakerivi riippuu tyypistä:

| Tunnistetietotyyppi | `$credentials.Nimi` muuntuu muotoon | Otsake |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Nimi"` |
| Header | `<Otsake-Nimi>: <arvo>` | `-H "$credentials.Nimi"` |
| OpenAI, Custom, Cohere | Raaka API-avain | `-H "Authorization: Bearer $credentials.Nimi"` |
| Google | Raaka API-avain | `-H "x-goog-api-key: $credentials.Nimi"` |
| ElevenLabs | Raaka API-avain | `-H "xi-api-key: $credentials.Nimi"` |
| Google Sheets, Google Drive | Päivitetty OAuth-käyttöoikeustunnus, joka uusitaan vanhetessaan | `-H "Authorization: Bearer $credentials.Nimi"` |
| GitHub, Notion, Sentry | Käyttöoikeustunnus | `-H "Authorization: Bearer $credentials.Nimi"` |

Bearer-tunnistetiedot sisältävät jo `Bearer `-etuliitteen, joten toisen lisääminen lähettää `Bearer Bearer …`. Google Sheets- ja Google Drive -tunnistetiedoilla voit kutsua Google API -rajapintoja, joita niiden omat solmut eivät kata, kuten taulukon välilehden lisäämisen, tunnistetiedoille myönnettyjen käyttöoikeusalueiden puitteissa. Kun nimi ei ole yksinkertainen tunniste (sisältää `-`, alkaa numerolla tai on varattu sana), käytä hakasulkumuotoa: `-H "Authorization: $credentials["my-api-key"]"`.

Kun [Tekoälyavustaja](../reference/ai-assistant.md) tai [Keskustelu](../tabs/chat-tab.md) rakentaa HTTP-pyynnön, joka vaatii tunnistautumista eikä palvelulle ole erityistä solmua, se kysyy, mitä tunnistetietoja käytetään. Valitse tunnistetiedot, muuta esitäytetty otsakkeen nimi tarvittaessa, ja se kirjoittaa otsakerivin puolestasi. Avustaja näkee tunnistetietojen nimet ja tyypit, mutta ei niiden arvoja. Jos sopivia tunnistetietoja ei ole, kysymys tarjoaa niiden luomista. Solmun tulosteeseen päätyvät salaisuudet, kuten lähetetyt `request.headers`, peitetään suoritustuloksissa.

## Lähtevän liikenteen turvallisuus

- Oletusarvoisesti URL-osoitteen on käytettävä `http://` tai `https://` -alkua ja se saa viitata vain julkisiin osoitteisiin. Silmukka-, yksityis-, linkkilokaali-, monilähetys- ja pilvimetatieto-osoitteet estetään.
- Heym vahvistaa selvityt osoitteet ja lukitsee yhteyden kohteen estääkseen DNS-rebindingin. Ympäristön välityspalvelimet otetaan pois käytöstä suojauksen ollessa aktiivisena. Uudelleenohjauksia ei seurata oletusarvoisesti; lisää cURL:n `-L`-optio niiden seuraamiseksi. Kun seuraaminen on käytössä, jokainen uudelleenohjausvaihe tarkistetaan saman julkisten osoitteiden käytännön mukaan ja lukitaan ennen yhteyden muodostamista.
- Luotetuissa itse isännöidyissä käyttöönotoissa, jotka tarkoituksella yhdistävät sisäisiin palveluihin, voidaan asettaa `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Säilytä oletusarvo isännöidyissä tai monivuokralaisissa käyttöönotoissa.

**Päivityshuomio versiolle v0.0.105:** Tämä koko käyttöönotoa koskeva käytäntö suojaa nyt myös tunnistetiedoista johdettuja kohteita, joita käyttävät Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, mukautetut LLM-suoritukset ja mallien löytäminen, tekoälyavustaja, kaiteet ja RAG-upotukset. Olemassa olevat tunnistetiedot, jotka viittaavat silmukka-, yksityis- tai linkkilokaaliosoitteisiin, hylätään, ellei `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` ole käytössä luotetussa itse isännöidyssä käyttöönotossa. Kun suojaus on käytössä, suojatut HTTP-asiakkaat ohittavat `HTTP_PROXY`- ja `HTTPS_PROXY`-asetukset; opt-outin käyttöönotto palauttaa ne. Operaattorin CA-paketit, jotka on määritetty `SSL_CERT_FILE`- tai `SSL_CERT_DIR`-muuttujien kautta, pysyvät tuettuina. ClickHouse tarkistetaan ennen yhteyden avaamista, mutta yhteyttä ei lukita muodostusvaiheessa, koska clickhouse-connect käyttää omaa urllib3-kuljetustaan.

## Aiheeseen liittyvää

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Triggerit](../reference/triggers.md) – HTTP workflown alkupisteenä
- [Tunnistetietovälilehti](../tabs/credentials-tab.md) – Lisää API-avaimia tunnistautuneisiin pyyntöihin
