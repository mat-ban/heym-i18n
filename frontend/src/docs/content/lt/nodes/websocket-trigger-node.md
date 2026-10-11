# WebSocket Trigger

**WebSocket Trigger** mazgas atidaro išorinę kliento jungtį su išoriniu WebSocket serveriu ir pradeda workflow, kai įvyksta pasirinkti socket įvykiai. Naudokite jį įvykių srautams, tokiems kaip rinkos duomenys, telemetrija ar pokalbių platformos. Jungimasis prie vidinių realaus laiko sistemų reikalauja privatios URL išjungimo, aprašyto žemiau.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 0 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Svarbi Elgsena

- Šis mazgas jungiasi **iš Heym į kitą WebSocket serverį**.
- Jis **ne** atskleidžia WebSocket endpoint'ą Heym.
- Nereikia jokio [kredencialo](../reference/credentials.md). Nurodykite URL, antraštes ir subprotokolus tiesiogiai mazge.
- Lyderio darbininkas palaiko jungtį atidarytą fone ir atnaujina ją, kai tai leidžiama.

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `websocketUrl` | string | Išorinis `ws://` arba `wss://` URL |
| `websocketHeaders` | JSON objekto eilutė | Pasirinktinės rankos antraštės |
| `websocketSubprotocols` | string | Pasirinktinė, kablemis atskirta subprotokolų sąrašas |
| `websocketTriggerEvents` | masyvas | Bet kuris iš `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Atkurti po atsijungimo |
| `retryWaitSeconds` | integer | Vėlavimas prieš atnaujinant |

## Išmetami Įvykiai

### `onMessage`

Įvyksta, kai iš nuotolinio socket atkeliauja rėmelis.

Naudingi laukai:

| Išraiška | Aprašymas |
|-----------|-----------|
| `$nodeLabel.message.data` | Išanalizuotas JSON payload arba žaliavos pranešimo vertė |
| `$nodeLabel.message.text` | UTF-8 dekoduotas tekstas, kai jis yra prieinamas |
| `$nodeLabel.message.base64` | Dvejetainis payload kaip base64 |
| `$nodeLabel.message.sizeBytes` | Payload dydis |
| `$nodeLabel.message.isJson` | Ar pranešimas buvo išanalizuotas kaip JSON |

### `onConnected`

Įvyksta, kai socket sėkmingai atsidaro.

Naudingi laukai:

| Išraiška | Aprašymas |
|-----------|-----------|
| `$nodeLabel.connection.reconnected` | `false` pirmo prisijungimo metu, `true` vėlesnių atnaujinimų metu |
| `$nodeLabel.connection.subprotocol` | Derintas subprotokolas |

### `onClosed`

Įvyksta, kai užmegzta jungtis užsidaro.

Naudingi laukai:

| Išraiška | Aprašymas |
|-----------|-----------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` arba `unknown` |
| `$nodeLabel.close.code` | WebSocket uždarymo kodas |
| `$nodeLabel.close.reason` | Uždarymo priežastis |
| `$nodeLabel.close.wasClean` | `true` normaliam `1000` uždarymui |
| `$nodeLabel.close.reconnecting` | Ar mazgas bandys atnaujinti jungtį |

## Trigger Semantika

- Vienas aktyvus mazgas palaiko vieną ilgalaikę išorinę socket jungtį.
- Jungtis veikia tik lyderio darbininke, panašiai kaip [IMAP Trigger](./imap-trigger-node.md) ir [RabbitMQ](./rabbitmq-node.md) gavimo režimas.
- Jei atnaujinimas leidžiamas, Heym laukia `retryWaitSeconds` ir vėl atidaro socket po praradimo.
- Kiekvienas išmetamas įvykis sukuria atskirą workflow vykdymą su `trigger_source = "websocket"`.

## Išėjimo Saugumas

- Pagal numatytuosius nustatymus, URL turi naudoti `ws://` arba `wss://` ir būti nukreipiamas tik į viešas adresus. Loopback, privatūs, link-local, multicast ir cloud-metadata paskirties vietos yra blokuojamos.
- Heym kiekvieną kartą atnaujinant patikrina DNS, patvirtina kiekvieną išspręstą adresą ir tiesiogiai jungiasi prie vieno iš tų adresų. Aplinkos proxy ir WebSocket peradresavimai yra išjungti, kol veikia apsauga.
- Nuolatiniai politikos pažeidimai sustabdo trigger'į, o ne bando atnaujinti be galo. Laikini DNS ar tinklo gedimai vis tiek laikosi mazgo atnaujinimo nustatymų.
- `Authorization`, `Origin`, `User-Agent` ir pasirinktinių duomenų antraštės yra palaikomos. `Origin` siunčiamas per specialią WebSocket kliento parinktį. `Host`, `Connection`, `Upgrade` ir `Sec-WebSocket-*` antraštės negali būti perrašomos.
- Patikimi savarankiškai talpinami diegimai, kurie tyčia jungiasi prie vidinių paslaugų, gali nustatyti `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Laikykite numatytąjį nustatymą talpinamuose arba daugiakartiniuose diegimuose.

**Atnaujinimo pastaba v0.0.105:** ši visos instancijos politika dabar taip pat saugo kredencialų pagrindu sukurtas paskirties vietas, naudojamas Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, pasirinktinei LLM vykdymui ir modelių atradimui, AI asistentui, apsaugos priemonėms ir RAG įterpimams. Esamos kredencialai, kurie nurodo loopback, privatūs ar link-local adresai, bus atmesti, nebent `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` yra įjungtas patikimo savarankiškai talpinamoje instancijoje. Kol veikia apsauga, saugomos HTTP klientai ignoruoja `HTTP_PROXY` ir `HTTPS_PROXY`; išjungus apsaugą, jie vėl bus įjungti. Operatoriaus CA paketai, sukonfigūruoti per `SSL_CERT_FILE` arba `SSL_CERT_DIR`, lieka palaikomi. ClickHouse tikrinamas prieš atidarant jungtį, tačiau nėra fiksuojamas skambinimo metu, nes clickhouse-connect naudoja savo urllib3 transportą.

## Pavyzdinis Workflow

**Išorinis įvykių srautas → filtras → pranešti**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** etiketė: `streamEvent`
- **Sąlyga**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** pranešimas: `"Realtime alert: $streamEvent.message.data.title"`
## Pavyzdžio mazgo JSON

```json
{
  "type": "websocketTrigger",
  "data": {
    "label": "streamEvent",
    "websocketUrl": "wss://stream.example.com/events",
    "websocketHeaders": "{\"Authorization\": \"Bearer token\"}",
    "websocketSubprotocols": "json",
    "websocketTriggerEvents": ["onMessage", "onClosed"],
    "retryEnabled": true,
    "retryWaitSeconds": 5
  }
}
```

## Susiję

- [Triggeriai](../reference/triggers.md) – Fono triggerių architektūra ir `trigger_source`
- [WebSocket Siuntimas](./websocket-send-node.md) – Duomenų siuntimas į išorinį socket'ą iš workflow žingsnio
- [Mazgų tipai](../reference/node-types.md) – Visi mazgai
- [Trečiųjų šalių integracijos](../reference/integrations.md) – Kurie mazgai naudoja kredencialus, o kurie ne
