# WebSocket Send

**WebSocket Send** čvor otvara izlaznu klijentsku vezu s vanjskim WebSocket poslužiteljem, šalje jednu poruku i zatvara vezu. Koristite ga kada workflow treba slati događaje u sustav u stvarnom vremenu bez izlaganja Heym-ovog socket endpointa.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.status`, `$nodeLabel.url`, `$nodeLabel.message_type`, `$nodeLabel.size_bytes` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|------|
| `websocketUrl` | string / izraz | Vanjska `ws://` ili `wss://` URL adresa |
| `websocketHeaders` | JSON objekt string / izraz | Opcionalni zaglavlja za handshake |
| `websocketSubprotocols` | string | Opcionalni popis subprotokola odvojen zarezima |
| `websocketMessage` | izraz | Payload za slanje |

## Pravila serijalizacije poruka

- Ako `websocketMessage` rezultira u **string**, Heym šalje tekstni okvir.
- Ako rezultira u **objekt**, **niz**, **broj**, **boolean** ili `null`, Heym ga serijalizira kao JSON tekst.
- Ako rezultira u **bajtovima**, Heym šalje binarni okvir.
- Cjeloviti izrazi kao što su `$input` čuvaju izvorne tipove prije serijalizacije.

## Polja izlaza

| Izraz | Opis |
|-------|------|
| `$nodeLabel.status` | `"sent"` u slučaju uspjeha |
| `$nodeLabel.url` | Riješena odredišna URL adresa |
| `$nodeLabel.message_type` | `text`, `json` ili `binary` |
| `$nodeLabel.size_bytes` | Veličina payload-a u bajtovima |
| `$nodeLabel.subprotocol` | Pregovarani subprotokol kada je prisutan |
| `$nodeLabel.sent_at` | ISO vremenska oznaka |

## Primjer Workflow-a

**HTTP zahtjev → transformacija → objava putem WebSocket-a**

```
input → set → websocketSend → output
```

- **Set** stvara objekt payload-a kao što je `{ "type": "user.updated", "user": $input.body }`
- **WebSocket Send** koristi `$payloadNode` kao `websocketMessage`
- **Output** može vratiti `$socketSend.status`

## Primjer Node JSON-a

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

## Napomene

- Nema [vjerodajnice](../reference/credentials.md) potrebne za ovaj čvor.
- Ako udaljeni poslužitelj očekuje zaglavlja za autentifikaciju ili najam, proslijedite ih putem `websocketHeaders`.
- Koristite [HTTP](./http-node.md) kada je udaljeni sustav temeljen na zahtjev/odgovor umjesto na socketu.

## Sigurnost izlaza

- Po defaultu, URL mora koristiti `ws://` ili `wss://` i rješavati se samo na javne adrese. Loopback, privatne, link-local, multicast i cloud-metadata odredišta su blokirana.
- Heym provjerava svaku riješenu adresu i izravno se povezuje na jednu od tih adresa. Proxy poslužitelji okruženja i WebSocket preusmjeravanja su onemogućeni dok je zaštita aktivna.
- `Authorization`, `Origin`, `User-Agent` i prilagođena zaglavlja podataka su podržana. `Origin` se šalje putem posebne opcije WebSocket klijenta. `Host`, `Connection`, `Upgrade` i `Sec-WebSocket-*` zaglavlja ne mogu se prepisati.
- Pouzdane samostalne implementacije koje namjerno povezuju na unutarnje usluge mogu postaviti `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Održavajte default na hostanim ili višekorisničkim implementacijama.

**Napomena o nadogradnji za v0.0.105:** ova politika na razini instance sada također štiti odredišta izvedena iz vjerodajnica koja koriste Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, prilagođeno izvršavanje LLM-a i otkrivanje modela, AI asistenta, zaštitne mjere i RAG ugrađivanje. Postojeće vjerodajnice koje upućuju na loopback, privatne ili link-local adrese odbijaju se osim ako `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` nije omogućeno na pouzdanoj samostalnoj instanci. Dok je zaštita aktivna, zaštićeni HTTP klijenti ignoriraju `HTTP_PROXY` i `HTTPS_PROXY`; omogućavanje opcije za isključivanje vraća ih. Operator CA paketi konfigurirani putem `SSL_CERT_FILE` ili `SSL_CERT_DIR` ostaju podržani. ClickHouse se provjerava prije otvaranja veze, ali nije fiksiran u trenutku biranja, jer clickhouse-connect donosi vlastiti urllib3 transport.

## Povezano

- [WebSocket Trigger](./websocket-trigger-node.md) – Slušajte vanjski socket i pokrenite workflows na događaje
- [Tipovi čvorova](../reference/node-types.md) – Pregled integracijskih čvorova
- [Expression DSL](../reference/expression-dsl.md) – Izradite dinamičke JSON payload-e
- [Integracije trećih strana](../reference/integrations.md) – Integracije temeljene na vjerodajnicama vs izravno konfigurirane integracije
