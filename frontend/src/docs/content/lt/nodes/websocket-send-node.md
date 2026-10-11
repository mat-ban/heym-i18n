# WebSocket Siuntimas

**WebSocket Siuntimas** mazgas atidaro išorinį kliento ryšį su WebSocket serveriu, siunčia vieną pranešimą ir uždaro ryšį. Naudokite jį, kai workflow reikia siųsti įvykius į realaus laiko sistemą, nesukuriant Heym valdomo socket endpoint.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `websocketUrl` | string / išraiška | Išorinis `ws://` arba `wss://` URL |
| `websocketHeaders` | JSON objekto string / išraiška | Pasirinktiniai handshake antraštės |
| `websocketSubprotocols` | string | Pasirinktinė, kableliais atskirta subprotokolų sąrašas |
| `websocketMessage` | išraiška | Payload, kurį reikia siųsti |

## Pranešimų Serializavimo Taisyklės

- Jei `websocketMessage` išsprendžiamas į **string**, Heym siunčia teksto rėmelį.
- Jei jis išsprendžiamas į **objektą**, **masyvą**, **skaičių**, **boolean** arba `null`, Heym serializuoja jį kaip JSON tekstą.
- Jei jis išsprendžiamas į **baitus**, Heym siunčia binarinį rėmelį.
- Pilnos išraiškos, tokios kaip `$input`, išlaiko natūralias tipus prieš serializavimą.

## Išvesties Laukai

| Išraiška | Aprašymas |
|-----------|-----------|
| `$nodeLabel.status` | `"sent"` sėkmės atveju |
| `$nodeLabel.url` | Išspręstas paskirties URL |
| `$nodeLabel.message_type` | `text`, `json` arba `binary` |
| `$nodeLabel.size_bytes` | Payload dydis baitais |
| `$nodeLabel.subprotocol` | Derybų subprotokolas, jei yra |
| `$nodeLabel.sent_at` | ISO laiko žymė |

## Pavyzdinė Workflow

**HTTP užklausa → transformacija → publikavimas per WebSocket**

```
input → set → websocketSend → output
```

- **Set** sukuria payload objektą, pvz., `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Siuntimas** naudoja `$payloadNode` kaip `websocketMessage`
- **Output** gali grąžinti `$socketSend.status`

## Pavyzdinis Mazgo JSON

```json
{
  "type": "websocketSend",
  "data": {
    "label": "socketSend",
    "websocketUrl": "wss://stream.example.com/publish",
    "websocketHeaders": "{\"Authorization\": \"Bearer $vars.socketToken\"}",
    "websocketSubprotocols": "json",
    "websocketMessage": "$payloadBuilder"
  }
}
```

## Pastabos

- Šiam mazgui nereikia [kredencialo](../reference/credentials.md).
- Jei nuotolinis serveris tikisi autentifikavimo ar nuomininko antraščių, perduokite jas per `websocketHeaders`.
- Naudokite [HTTP](./http-node.md), kai nuotolinė sistema yra užklausa/atsakymas pagrindu, o ne socket pagrindu.

## Išėjimo Saugumas

- Pagal numatytuosius nustatymus, URL turi naudoti `ws://` arba `wss://` ir būti išsprendžiamas tik į viešas adresus. Loopback, privatūs, link-local, multicast ir cloud-metadata paskirties vietos yra blokuojamos.
- Heym patikrina kiekvieną išspręstą adresą ir tiesiogiai jungiasi prie vieno iš tų adresų. Aplinkos proxy ir WebSocket peradresavimai yra išjungti, kol veikia apsauga.
- `Authorization`, `Origin`, `User-Agent` ir pasirinktinių duomenų antraštės yra palaikomos. `Origin` siunčiamas per WebSocket kliento specialią parinktį. `Host`, `Connection`, `Upgrade` ir `Sec-WebSocket-*` antraštės negali būti perrašomos.
- Patikimi savarankiškai talpinami diegimai, kurie tyčia jungiasi prie vidinių paslaugų, gali nustatyti `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Laikykite numatytąjį nustatymą talpinamuose arba daugiakartiniuose diegimuose.

**Atnaujinimo pastaba v0.0.105:** ši politika, taikoma visam instancijai, dabar taip pat saugo kredencialų pagrindu gautas paskirties vietas, naudojamas Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, pasirinktiniam LLM vykdymui ir modelių atradimui, AI asistentui, apsaugos priemonėms ir RAG įterpimams. Esamos kredencialai, kurie nurodo loopback, privatūs ar link-local adresai, bus atmesti, nebent `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` yra įjungtas patikimo savarankiškai talpinamoje instancijoje. Kol veikia apsauga, saugomos HTTP klientai ignoruoja `HTTP_PROXY` ir `HTTPS_PROXY`; pasirinkimo išjungimas atkuria juos. Operatoriaus CA paketai, sukonfigūruoti per `SSL_CERT_FILE` arba `SSL_CERT_DIR`, lieka palaikomi. ClickHouse tikrinamas prieš atidarant ryšį, tačiau nėra fiksuojamas dialo metu, nes clickhouse-connect naudoja savo urllib3 transportą.

## Susiję

- [WebSocket Trigger](./websocket-trigger-node.md) – Klausykite išorinio socket ir aktyvuokite workflows įvykiams
- [Mazgų Tipai](../reference/node-types.md) – Integracijos mazgų apžvalga
- [Išraiškų DSL](../reference/expression-dsl.md) – Dinamiškų JSON payload kūrimas
- [Trečiųjų Šalių Integracijos](../reference/integrations.md) – Kredencialų pagrindu ir tiesioginės konfigūracijos integracijos
