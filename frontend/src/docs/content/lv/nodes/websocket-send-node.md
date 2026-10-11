# WebSocket Send

**WebSocket Send** mezgls atver izejošu klienta savienojumu uz ārēju WebSocket serveri, nosūta vienu ziņojumu un aizver savienojumu. Izmantojiet to, ja workflow ir jānostūta notikumi uz reāllaika sistēmu, nepiešķirot Heym pārvaldītu socket endpoint.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `websocketUrl` | string / expression | Ārējs `ws://` vai `wss://` URL |
| `websocketHeaders` | JSON object string / expression | Neobligāti handshake headers |
| `websocketSubprotocols` | string | Neobligāts ar komatu atdalīts subprotokolu saraksts |
| `websocketMessage` | expression | Nosūtāmais payload |

## Ziņojumu serializācijas noteikumi

- Ja `websocketMessage` tiek atrisināts kā **string**, Heym nosūta teksta frame.
- Ja tas tiek atrisināts kā **object**, **array**, **number**, **boolean** vai `null`, Heym to serializē kā JSON tekstu.
- Ja tas tiek atrisināts kā **bytes**, Heym nosūta bināro frame.
- Pilnas izteiksmes, piemēram, `$input`, saglabā native tipus pirms serializācijas.

## Izvades lauki

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.status` | `"sent"` veiksmes gadījumā |
| `$nodeLabel.url` | Atrisinātais galamērķa URL |
| `$nodeLabel.message_type` | `text`, `json` vai `binary` |
| `$nodeLabel.size_bytes` | Payload izmērs baitos |
| `$nodeLabel.subprotocol` | Vienotais subprotokols, ja tāds ir |
| `$nodeLabel.sent_at` | ISO laika zīmogs |

## Workflow piemērs

**HTTP request → transform → publish over WebSocket**

```
input → set → websocketSend → output
```

- **Set** izveido payload objektu, piemēram, `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** izmanto `$payloadNode` kā `websocketMessage`
- **Output** var atgriezt `$socketSend.status`

## Mezglu JSON piemērs

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

## Piezīmes

- Šim mezglam nav nepieciešami [akreditācijas dati](../reference/credentials.md).
- Ja attālinātais serveris sagaida auth vai tenant headers, nododiet tos, izmantojot `websocketHeaders`.
- Izmantojiet [HTTP](./http-node.md), ja attālinātā sistēma ir balstīta uz pieprasījumu/atbildi, nevis uz socket.

## Egress drošība

- Pēc noklusējuma URL ir jāizmanto `ws://` vai `wss://` un jāatrisina tikai uz publiskām adresēm. Loopback, privātie, link-local, multicast un cloud-metadata galamērķi ir bloķēti.
- Heym validē katru atrisināto adresi un savienojas tieši ar vienu no šīm adresēm. Vides proxy un WebSocket pāradresācijas ir atspējotas, kamēr aizsargs ir aktīvs.
- Tiek atbalstīti `Authorization`, `Origin`, `User-Agent` un pielāgoti datu headers. `Origin` tiek nosūtīts, izmantojot WebSocket klienta īpašo opciju. `Host`, `Connection`, `Upgrade` un `Sec-WebSocket-*` headers nevar tikt ignorēti.
- Uzticami self-hosted izvietojumi, kas apzināti savienojas ar iekšējiem pakalpojumiem, var iestatīt `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Saglabājiet noklusējuma iestatījumu hostētos vai multi-tenant izvietojumos.

**Jaunināšanas piezīme v0.0.105:** šī instance-wide politika tagad arī aizsargā no akreditācijas datiem iegūtus galamērķus, ko izmanto Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, pielāgota LLM izpilde un modeļa atklāšana, AI asistents, guardrails un RAG embeddings. Esošie akreditācijas dati, kas norāda uz loopback, privātām vai link-local adresēm, tiek noraidīti, ja vien `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` nav iespējots uz uzticama self-hosted instances. Kamēr aizsargs ir ieslēgts, aizsargātie HTTP klienti ignorē `HTTP_PROXY` un `HTTPS_PROXY`; iespējojot opt-out, tie tiek atjaunoti. Operatora CA bundles, kas konfigurēti, izmantojot `SSL_CERT_FILE` vai `SSL_CERT_DIR`, joprojām tiek atbalstīti. ClickHouse tiek pārbaudīts pirms savienojuma atvēršanas, bet netiek pinned dial laikā, jo clickhouse-connect nodrošina savu urllib3 transportu.

## Saistītie

- [WebSocket Trigger](./websocket-trigger-node.md) – Klausieties ārēju socket un aktivizējiet workflow notikumos
- [Node Types](../reference/node-types.md) – Integrācijas mezglu pārskats
- [Expression DSL](../reference/expression-dsl.md) – Veidojiet dinamisku JSON payload
- [Third-Party Integrations](../reference/integrations.md) – Ar akreditācijas datiem balstītas vs tiešas konfigurācijas integrācijas
