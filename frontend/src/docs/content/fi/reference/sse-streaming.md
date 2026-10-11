# SSE-suoratoisto

Workflowt voivat suoratoistaa tapahtumia reaaliajassa Server-Sent Events (SSE) -tekniikalla.

## Endpoint

`POST /api/workflows/{workflow_id}/execute/stream`

Tämä endpoint käyttää samoja workflow-tason todennus-, rajoitus- ja välimuistisääntöjä kuin standardi suoritusendpoint, joka on dokumentoitu kohdassa [Webhooks](./webhooks.md).

## SSE-suoratoiston käyttöönotto cURL-valikossa

Avaa editorissa **Suorita cURL:lla** -valikko ja ota käyttöön **SSE-suoratoisto**.

Kun toiminto on käytössä, Heym:

- vaihtaa luodun komennon muotoon `/execute/stream` sijaan `/execute`
- lisää `--no-buffer` -option, jotta suoratoistetut tapahtumat ilmestyvät välittömästi terminaaliin
- lisää `Accept: text/event-stream` -otsikon
- mahdollistaa solmukohtaisten `node_start` -viestien määrittämisen suoraan valikossa

## Tapahtumaprotokolla

Jokainen SSE-kehyksessä oleva tapahtuma on rivinvaihdolla erotettua JSONia, jossa on etuliite `data: `.

| Tapahtumatyyppi | Milloin lähetetään | Avainkentät |
|------------|--------------------|------------|
| `execution_started` | Heti pyynnön vastaanottamisen jälkeen | `execution_id`, `server_now_ms` |
| `node_start` | Juuri ennen solmun suorituksen alkamista | `node_id`, `node_label`, `started_at_ms`, valinnainen `message` |
| `node_retry` | Kun solmu yrittää uudelleen | `node_id`, `attempt`, `max_attempts` |
| `node_complete` | Solmun suorituksen päätyttyä | `node_id`, `node_label`, `status`, `output`, `execution_time_ms` |
| `final_output` | Kun Output-solmu palauttaa tuloksen ennenaikaisesti | `node_label`, `output` |
| `execution_complete` | Workflown päättymisen jälkeen | `status`, `outputs`, `execution_time_ms` |

## Solmukohtaiset aloitusviestit

cURL-valikko tallentaa SSE-asetukset workflowhun:

- **Lähetä aloitus** määrittää, sisältääkö `node_start`-tapahtuma `message`-kentän
- **Aloitusviesti** on oletusarvoisesti `[START] {nodeLabel}`
- jos mukautettu viesti tyhjennetään, käytetään oletustekstiä
- `node_complete` lähetetään aina ja sisältää aina solmun tuloksen

Esimerkki tallennetusta asetuksesta:

```json
{
  "node-uuid-llm": {
    "send_start": true,
    "start_message": "[START] Luonnosvastaus"
  },
  "node-uuid-http": {
    "send_start": false,
    "start_message": null
  }
}
```

## cURL-esimerkki

```bash
curl -X POST --no-buffer \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <your-access-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute/stream" \
  -d '{"message":"Hello"}'
```

Esimerkki tapahtumavirrasta:

```text
data: {"type":"execution_started","execution_id":"...","server_now_ms":1735660800000}

data: {"type":"node_start","node_id":"...","node_label":"LLM","started_at_ms":1735660800000,"message":"[START] LLM"}

data: {"type":"node_complete","node_id":"...","node_label":"LLM","status":"success","output":{"text":"Hello world"},"execution_time_ms":312}

data: {"type":"execution_complete","status":"success","outputs":{"LLM":{"text":"Hello world"}},"execution_time_ms":315}
```

## Turvallisuus huomioita

- `anonymous`, `jwt` ja `header_auth` -workflowt käyttäytyvät samoin kuin tavallisessa webhook-endpointissa
- vastauksen välimuistisäännöt (`cache_ttl_seconds`) ovat edelleen voimassa
- workflown suoritusrajoitukset (`rate_limit_requests` ja `rate_limit_window_seconds`) ovat edelleen voimassa
- `test_run` ohittaa sekä välimuistin että suoritusrajoitukset samoin kuin `/execute`-endpointissa

## Aiheeseen liittyvät

- [Webhooks](./webhooks.md) – Vakiosuoritusendpoint ja cURL-valikko
- [Rinnakkaissuoritus](./parallel-execution.md) – Kuinka suoratoisto integroituu Heymin DAG-ajastimeen
- [Canvas-ominaisuudet](./canvas-features.md) – Editorin ohjauselementit, mukaan lukien Suorita cURL:lla
- [Turvallisuus](./security.md) – Todennus ja salaisuuksien käsittely
