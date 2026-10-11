# WebSocket Trigger

**WebSocket Trigger** čvor otvara izlaznu klijentsku vezu s vanjskim WebSocket poslužiteljem i pokreće workflow kada se dogode odabrani događaji na socketu. Koristite ga za tokove događaja kao što su tržišni podaci, telemetrija ili chat sustavi. Povezivanje s internim sustavima u stvarnom vremenu zahtijeva isključenje privatne URL adrese opisano u nastavku.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 0 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.eventName`, `$nodeLabel.message`, `$nodeLabel.connection`, `$nodeLabel.close` |

## Važno ponašanje

- Ovaj čvor se povezuje **iz Heyma na drugi WebSocket poslužitelj**.
- Ne izlaže WebSocket endpoint na Heymu.
- Nema potrebe za [vjerodajnicama](../reference/credentials.md). Konfigurirajte URL, zaglavlja i podprotokole izravno na čvoru.
- Voditelj radnika održava vezu otvorenom u pozadini i ponovo se povezuje kada je omogućeno.

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `websocketUrl` | string | Vanjski `ws://` ili `wss://` URL |
| `websocketHeaders` | JSON objekt string | Opcionalna zaglavlja za uspostavljanje veze |
| `websocketSubprotocols` | string | Opcionalni popis podprotokola odvojen zarezima |
| `websocketTriggerEvents` | array | Bilo koji od `onMessage`, `onConnected`, `onClosed` |
| `retryEnabled` | boolean | Ponovno povezivanje nakon prekida |
| `retryWaitSeconds` | integer | Kašnjenje prije ponovnog povezivanja |

## Emitirani Događaji

### `onMessage`

Aktivira se kada okvir stigne s udaljenog socketa.

Korisna polja:

| Izraz | Opis |
|-------|------|
| `$nodeLabel.message.data` | Parsirani JSON payload ili sirova vrijednost poruke |
| `$nodeLabel.message.text` | UTF-8 dekodirani tekst kada je dostupan |
| `$nodeLabel.message.base64` | Binarni payload kao base64 |
| `$nodeLabel.message.sizeBytes` | Veličina payloada |
| `$nodeLabel.message.isJson` | Da li je poruka parsirana kao JSON |

### `onConnected`

Aktivira se nakon uspješnog otvaranja socketa.

Korisna polja:

| Izraz | Opis |
|-------|------|
| `$nodeLabel.connection.reconnected` | `false` pri prvom povezivanju, `true` pri kasnijim ponovnim povezivanjima |
| `$nodeLabel.connection.subprotocol` | Pregovarani podprotokol |

### `onClosed`

Aktivira se kada se uspostavljena veza zatvori.

Korisna polja:

| Izraz | Opis |
|-------|------|
| `$nodeLabel.close.initiatedBy` | `server`, `client` ili `unknown` |
| `$nodeLabel.close.code` | WebSocket kod zatvaranja |
| `$nodeLabel.close.reason` | Razlog zatvaranja |
| `$nodeLabel.close.wasClean` | `true` za normalno zatvaranje `1000` |
| `$nodeLabel.close.reconnecting` | Da li će čvor pokušati ponovno povezivanje |

## Semantika Okidača

- Jedan aktivni čvor održava jednu dugotrajnu izlaznu socket vezu.
- Veza se izvodi samo na voditelju radnika, slično [IMAP Okidaču](./imap-trigger-node.md) i [RabbitMQ](./rabbitmq-node.md) načinu primanja.
- Ako je ponovno povezivanje omogućeno, Heym čeka `retryWaitSeconds` i ponovno otvara socket nakon prekida.
- Svaki emitirani događaj stvara zasebno izvršavanje workflowa s `trigger_source = "websocket"`.

## Sigurnost Egressa

- Po defaultu, URL mora koristiti `ws://` ili `wss://` i rješavati se samo na javne adrese. Loopback, privatne, link-local, multicast i cloud-metadata odredišta su blokirana.
- Heym ponovo provjerava DNS pri svakom ponovnom povezivanju, validira svaku riješenu adresu i izravno se povezuje na jednu od tih adresa. Proxyji okruženja i WebSocket preusmjeravanja su onemogućeni dok je zaštita aktivna.
- Trajna kršenja politike zaustavljaju okidač umjesto da neprekidno pokušavaju ponovno. Privremeni DNS ili mrežni problemi i dalje slijede postavke ponovnog pokušaja čvora.
- `Authorization`, `Origin`, `User-Agent` i prilagođena zaglavlja podataka su podržana. `Origin` se šalje kroz posebnu opciju WebSocket klijenta. `Host`, `Connection`, `Upgrade` i `Sec-WebSocket-*` zaglavlja ne mogu se prepisivati.
- Pouzdane samostalne implementacije koje namjerno povezuju interne usluge mogu postaviti `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Održavajte default na hostanim ili višekorisničkim implementacijama.

**Napomena o nadogradnji za v0.0.105:** ova politika na razini instance sada također štiti odredišta izvedena iz vjerodajnica koja koriste Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, prilagođeno izvršavanje LLM-a i otkrivanje modela, AI asistenta, zaštitne mjere i RAG ugradnje. Postojeće vjerodajnice koje upućuju na loopback, privatne ili link-local adrese odbijaju se osim ako `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` nije omogućeno na pouzdanoj samostalnoj instanci. Dok je zaštita aktivna, zaštićeni HTTP klijenti ignoriraju `HTTP_PROXY` i `HTTPS_PROXY`; omogućavanje isključenja vraća ih. Operator CA paketi konfigurirani putem `SSL_CERT_FILE` ili `SSL_CERT_DIR` ostaju podržani. ClickHouse se provjerava prije otvaranja veze, ali nije fiksiran u vrijeme biranja, jer clickhouse-connect donosi vlastiti urllib3 transport.

## Primjer Workflowa

**Vanjski tok događaja → filtriraj → obavijesti**

```
websocketTrigger → condition → slack
```

- **WebSocket Trigger** oznaka: `streamEvent`
- **Uvjet**: `$streamEvent.eventName == "onMessage" && $streamEvent.message.data.type == "alert"`
- **Slack** poruka: `"Realtime alert: $streamEvent.message.data.title"`
## Primjer Node JSON

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

## Povezano

- [Triggers](../reference/triggers.md) – Arhitektura pozadinskog okidača i `trigger_source`
- [WebSocket Send](./websocket-send-node.md) – Slanje podataka na vanjski socket iz koraka workflow-a
- [Node Types](../reference/node-types.md) – Pregled svih čvorova
- [Third-Party Integrations](../reference/integrations.md) – Koji čvorovi koriste vjerodajnice, a koji ne
