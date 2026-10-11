# WebSocket Pošiljanje

Vozlišče **WebSocket Pošiljanje** odpre izhodno odjemalsko povezavo do zunanjega WebSocket strežnika, pošlje eno sporočilo in zapre povezavo. Uporabite ga, ko workflow potrebuje pošiljanje dogodkov v sistem v realnem času, ne da bi izpostavili Heym lastno socket endpoint.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `websocketUrl` | niz / izraz | Zunanji `ws://` ali `wss://` URL |
| `websocketHeaders` | JSON objekt niz / izraz | Neobvezni glave za handshake |
| `websocketSubprotocols` | niz | Neobvezni seznam podprotokolov, ločenih z vejicami |
| `websocketMessage` | izraz | Payload za pošiljanje |

## Pravila za serializacijo sporočil

- Če `websocketMessage` razreši na **niz**, Heym pošlje besedilni okvir.
- Če se razreši na **objekt**, **seznam**, **število**, **boolean** ali `null`, Heym to serializira kot JSON besedilo.
- Če se razreši na **bajte**, Heym pošlje binarni okvir.
- Polni izrazi, kot je `$input`, ohranijo naravne tipe pred serializacijo.

## Izhodne polja

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.status` | `"poslano"` ob uspehu |
| `$nodeLabel.url` | Razrešen cilj URL |
| `$nodeLabel.message_type` | `text`, `json` ali `binary` |
| `$nodeLabel.size_bytes` | Velikost payloada v bajtih |
| `$nodeLabel.subprotocol` | Pogodbeni podprotokol, če je prisoten |
| `$nodeLabel.sent_at` | ISO časovni žig |

## Primer Workflow

**HTTP zahteva → transformacija → objava preko WebSocket**

```
input → set → websocketSend → output
```

- **Set** ustvari objekt payload, kot je `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Pošiljanje** uporablja `$payloadNode` kot `websocketMessage`
- **Output** lahko vrne `$socketSend.status`

## Primer JSON vozlišča

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

## Opombe

- Za to vozlišče ni potrebna [poverilnica](../reference/credentials.md).
- Če oddaljeni strežnik pričakuje avtentifikacijske ali najemniške glave, jih posredujte preko `websocketHeaders`.
- Uporabite [HTTP](./http-node.md), ko je oddaljeni sistem temeljen na zahtevi/odgovoru namesto na socketu.

## Varnost izhoda

- Privzeto mora URL uporabljati `ws://` ali `wss://` in se razrešiti le na javne naslove. Povezave do povratnih, zasebnih, lokalnih povezav, multicast in metapodatkov v oblaku so blokirane.
- Heym preverja vsak razrešen naslov in se neposredno poveže z enim od teh naslovov. Okoljski proxyji in preusmeritve WebSocket so onemogočeni, medtem ko je zaščita aktivna.
- Podprti so `Authorization`, `Origin`, `User-Agent` in prilagojeni podatkovni glave. `Origin` se pošlje preko posebne možnosti WebSocket odjemalca. Glave `Host`, `Connection`, `Upgrade` in `Sec-WebSocket-*` ni mogoče prepisati.
- Zaupanja vredne samostojne namestitve, ki se namerno povezujejo z notranjimi storitvami, lahko nastavijo `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Ohranite privzeto nastavitev na gostovanih ali večnajemniških namestitvah.

**Opomba o nadgradnji za v0.0.105:** ta politika na ravni instance zdaj prav tako ščiti destinacije, ki izhajajo iz poverilnic, ki jih uporabljajo Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, prilagojeno izvajanje LLM in odkrivanje modelov, AI pomočnik, zaščitne ograje in RAG vdelki. Obstoječe poverilnice, ki kažejo na povratne, zasebne ali lokalne naslove, so zavrnjene, razen če je na zaupanja vredni samostojni instance omogočen `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Medtem ko je zaščita aktivna, zaščiteni HTTP odjemalci ignorirajo `HTTP_PROXY` in `HTTPS_PROXY`; omogočanje izklopa jih ponovno aktivira. Paketi CA operaterja, konfigurirani preko `SSL_CERT_FILE` ali `SSL_CERT_DIR`, ostajajo podprti. ClickHouse se preveri pred odprtjem povezave, vendar ni vezan na čas klicanja, ker clickhouse-connect prinaša svoj lasten urllib3 transport.

## Sorodno

- [WebSocket Trigger](./websocket-trigger-node.md) – Poslušajte zunanje socket in sprožite workflows ob dogodkih
- [Vrste vozlišč](../reference/node-types.md) – Pregled integracijskih vozlišč
- [Expression DSL](../reference/expression-dsl.md) – Ustvarite dinamične JSON payloade
- [Integracije tretjih oseb](../reference/integrations.md) – Integracije, podprte s poverilnicami proti neposrednim konfiguracijam
