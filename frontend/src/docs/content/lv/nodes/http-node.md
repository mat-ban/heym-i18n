# HTTP

**HTTP** mezgls veic HTTP pieprasījumus, izmantojot cURL sintaksi. Tas var būt workflow sākumpunkts (bez ienākošās šķautnes) vai saņemt ievadi no iepriekšējiem mezgliem.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 0 vai 1 |
| Izvades | 1 |
| Izvade | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `label` | string | Mezglu identifikators (camelCase) |
| `curl` | string | cURL komanda (piem., `curl -X GET https://api.example.com`) |

## Atbildes formāts

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Piekļuve atbildei

- `$httpNode.status` – HTTP statusa kods
- `$httpNode.body` – Atbildes pamatteksts (virkne vai parsēts JSON)
- `$httpNode.body.fieldName` – Piekļuve JSON laukiem
- `$httpNode.headers` – Atbildes galvenes

## Piemērs

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Izmantojiet cURL sintaksi ar `-H` galvenēm, `-d` POST pamattekstam utt. Izteiksmes var izmantot jebkurā cURL virknes vietā, tostarp URL, galvenē vai veselā galvenes rindā. [Header akreditācijas dati](../reference/credentials.md) tiek atrisināti kā `key: value`, tāpēc `-H "$credentials.MyApiKey"` nosūta pilnu galveni:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Pēdiņas un atstarpes izteiksmes iekšienē pieder izteiksmei, nevis cURL komandai, tāpēc metodes, kas pieņem virknes argumentus, darbojas iekļauti:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autentifikācija ar akreditācijas datiem

`$credentials.Name` tiek atrisināts uz atšķirīgu vērtību katram [akreditācijas datu](../reference/credentials.md) tipam, tāpēc galvenes rinda ir atkarīga no tipa:

| Akreditācijas datu tips | `$credentials.Name` tiek atrisināts uz | Galvene |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Neapstrādāta API atslēga | `-H "Authorization: Bearer $credentials.Name"` |
| Google | Neapstrādāta API atslēga | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | Neapstrādāta API atslēga | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Svaigs OAuth piekļuves token, kas tiek atjaunots, kad tas beidzas | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Token | `-H "Authorization: Bearer $credentials.Name"` |

Bearer akreditācijas dati jau satur prefiksu `Bearer `, tāpēc, pievienojot vēl vienu, tiek nosūtīts `Bearer Bearer …`. Google Sheets un Google Drive akreditācijas dati ļauj izsaukt Google API, ko to mezgls nenodrošina, piemēram, pievienot cilni izklājlapai, akreditācijas datiem piešķirto tvērumu ietvaros. Ja nosaukums nav vienkāršs identifikators (tas satur `-`, sākas ar ciparu vai ir rezervēts vārds), izmantojiet iekavu formu: `-H "Authorization: $credentials["my-api-key"]"`.

Kad [AI Assistant](../reference/ai-assistant.md) vai [Chat](../tabs/chat-tab.md) veido HTTP pieprasījumu, kam nepieciešama autentifikācija un ko neaptver neviens specializēts mezgls, tas jautā, kurus akreditācijas datus izmantot. Izvēlieties vienu, mainiet iepriekš aizpildīto galvenes nosaukumu, ja API paredz citu, un tas uzrakstīs galvenes rindu Jūsu vietā. Asistents redz akreditācijas datu nosaukumus un tipus, nekad to vērtības. Ja Jums nav piemērotu akreditācijas datu, jautājums piedāvā tos izveidot. Noslēpumi, kas nonāk mezgla izvadē, piemēram, nosūtītās `request.headers`, izpildes rezultātos tiek maskēti.

## Izejas drošība

- Pēc noklusējuma URL ir jāizmanto `http://` vai `https://` un jāatrisina tikai uz publiskām adresēm. Loopback, privātās, link-local, multicast un cloud-metadata galamērķi ir bloķēti.
- Heym validē atrisinātās adreses un piesaista savienojuma mērķi, lai novērstu DNS rebinding. Vides starpniekserveri tiek atspējoti, kamēr aizsargs ir aktīvs. Pēc noklusējuma pāradresācijas netiek sekotas; pievienojiet cURL opciju `-L`, lai tās sekotu. Kad tā ir iespējota, katrs pāradresācijas lēciens tiek pārbaudīts pret to pašu publisko adrešu politiku un pirms savienojuma izveides tiek piesaistīts.
- Uzticami pašmitināti izvietojumi, kas apzināti savienojas ar iekšējiem pakalpojumiem, var iestatīt `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Mitinātos vai daudznomnieku izvietojumos saglabājiet noklusējuma iestatījumu.

**Jaunināšanas piezīme versijai v0.0.105:** šī instancei raksturīgā politika tagad aizsargā arī no akreditācijas datiem iegūtus galamērķus, ko izmanto Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, pielāgota LLM izpilde un modeļu atklāšana, AI asistents, guardrails un RAG embeddings. Esošie akreditācijas dati, kas norāda uz loopback, privātām vai link-local adresēm, tiek noraidīti, ja vien uzticamā pašmitinātā instancē nav iespējots `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Kamēr aizsargs ir ieslēgts, aizsargātie HTTP klienti ignorē `HTTP_PROXY` un `HTTPS_PROXY`; atteikšanās iespējošana tos atjauno. Operatora CA pakotnes, kas konfigurētas, izmantojot `SSL_CERT_FILE` vai `SSL_CERT_DIR`, joprojām tiek atbalstītas. ClickHouse tiek pārbaudīts pirms savienojuma atvēršanas, bet netiek piesaistīts dial laikā, jo clickhouse-connect nodrošina savu urllib3 transportu.

## Saistītie

- [Mezglu tipi](../reference/node-types.md) – Visu mezglu tipu pārskats
- [Triggers](../reference/triggers.md) – HTTP kā workflow ieejas punkts
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – Pievienojiet API atslēgas autentificētiem pieprasījumiem
