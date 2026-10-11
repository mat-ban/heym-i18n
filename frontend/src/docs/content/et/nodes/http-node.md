# HTTP

**HTTP** node teeb HTTP-päringuid cURL-süntaksi abil. See võib olla workflow alguspunkt (ilma sissetuleva servata) või võtta vastu sisendit ülemvoolu sõlmedest.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 0 või 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `label` | string | Sõlme identifikaator (camelCase) |
| `curl` | string | cURL käsk (nt `curl -X GET https://api.example.com`) |

## Vastuse formaat

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Vastusele juurdepääs

- `$httpNode.status` – HTTP olekukood
- `$httpNode.body` – Vastuse sisu (string või parsitud JSON)
- `$httpNode.body.fieldName` – Juurdepääs JSON-väljadele
- `$httpNode.headers` – Vastuse päised

## Näide

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Kasutage cURL-süntaksi koos `-H` päiste jaoks, `-d` POST-sisu jaoks jne. Avaldisi saab kasutada kõikjal curl-stringis, sealhulgas URL-is, päises või terves päisereal. [Header credential](../reference/credentials.md) laheneb kujule `key: value`, seega `-H "$credentials.MyApiKey"` saadab tervikliku päise:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Jutumärgid ja tühikud avaldise sees kuuluvad avaldisele, mitte cURL-käsule, seega string-argumente võtvad meetodid töötavad reasiseselt:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autentimine mandaatidega

`$credentials.Name` laheneb iga [credential](../reference/credentials.md) tüübi jaoks erinevale väärtusele, seega päisereal sõltub tüübist:

| Mandaadi tüüp | `$credentials.Name` laheneb kujule | Päis |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Toores API võti | `-H "Authorization: Bearer $credentials.Name"` |
| Google | Toores API võti | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | Toores API võti | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Värske OAuth juurdepääsu token, uuendatakse selle aegumisel | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Token | `-H "Authorization: Bearer $credentials.Name"` |

Bearer mandaat sisaldab juba `Bearer ` eesliidet, seega teise lisamine saadab `Bearer Bearer …`. Google Sheets ja Google Drive mandaadid võimaldavad kutsuda Google API-sid, mida nende sõlm ei kata, näiteks tabelile vahelehe lisamine, mandaadile antud skoopide piires. Kui nimi ei ole lihtne identifikaator (sisaldab `-`, algab numbriga või on reserveeritud sõna), kasutage nurksulgude vormi: `-H "Authorization: $credentials["my-api-key"]"`.

Kui [AI Assistant](../reference/ai-assistant.md) või [Chat](../tabs/chat-tab.md) koostab HTTP-päringu, mis vajab autentimist ja ükski spetsiaalne sõlm ei kata teenust, küsib see, millist mandaati kasutada. Valige üks, muutke eeltäidetud päise nime, kui API eeldab teistsugust, ja see kirjutab päiserea teie eest. Assistent näeb mandaatide nimesid ja tüüpe, mitte kunagi nende väärtusi. Kui teil pole sobivat mandaati, pakub küsimus selle loomist. Saladused, mis jõuavad sõlme väljundisse, näiteks saadetud `request.headers`, on käivitustulemustes maskeeritud.

## Väljamineku turvalisus

- Vaikimisi peab URL kasutama `http://` või `https://` ja lahenema ainult avalikele aadressidele. Loopback-, privaatsed, link-local-, multicast- ja pilve-metadata sihtkohad on blokeeritud.
- Heym valideerib lahendatud aadressid ja kinnitab ühenduse sihtmärgi, et vältida DNS rebinding'ut. Keskkonna proxy'd on keelatud, kui kaitse on aktiivne. Ümbersuunamisi vaikimisi ei järgita; lisage cURL-i `-L` valik nende järgimiseks. Kui see on lubatud, kontrollitakse iga ümbersuunamise hüpet sama avaliku aadressi poliitika vastu ja kinnitatakse enne ühendamist.
- Usaldusväärsed isemajutatud juurutused, mis ühenduvad tahtlikult sisemiste teenustega, saavad määrata `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Hoidke vaikeväärtust hostitud või mitme rentniku juurutustel.

**Uuendusteade versioonile v0.0.105:** see instantsiülene poliitika kaitseb nüüd ka mandaadist tuletatud sihtkohti, mida kasutavad Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, kohandatud LLM-i täitmine ja mudeli avastamine, AI-assistent, guardrails ja RAG embeddings. Olemasolevad mandaadid, mis osutavad loopback-, privaatsetele või link-local-aadressidele, lükatakse tagasi, välja arvatud juhul, kui `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` on lubatud usaldusväärsel isemajutatud instantsil. Kui kaitse on sees, eiravad kaitstud HTTP-kliendid `HTTP_PROXY` ja `HTTPS_PROXY`; loobumise lubamine taastab need. Operaatori CA-paketid, mis on konfigureeritud `SSL_CERT_FILE` või `SSL_CERT_DIR` kaudu, jäävad toetatuks. ClickHouse'i kontrollitakse enne ühenduse avamist, kuid seda ei kinnitata valimise ajal, kuna clickhouse-connect toob kaasa oma urllib3 transpordi.

## Seotud

- [Node Types](../reference/node-types.md) – Ülevaade kõigist sõlmetüüpidest
- [Triggers](../reference/triggers.md) – HTTP workflow'i sisenemispunktina
- [Credentials Tab](../tabs/credentials-tab.md) – Lisage API võtmeid autenditud päringute jaoks
