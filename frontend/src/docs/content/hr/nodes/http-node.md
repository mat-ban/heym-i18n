# HTTP

**HTTP** čvor izvršava HTTP zahtjeve koristeći cURL sintaksu. Može biti početna točka workflowa (bez ulaznog ruba) ili primati ulaz od uzvodnih čvorova.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 0 ili 1 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `label` | string | Identifikator čvora (camelCase) |
| `curl` | string | cURL naredba (npr. `curl -X GET https://api.example.com`) |

## Format odgovora

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "response body or parsed JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Pristup odgovoru

- `$httpNode.status` – HTTP statusni kod
- `$httpNode.body` – Tijelo odgovora (string ili parsirani JSON)
- `$httpNode.body.fieldName` – Pristup JSON poljima
- `$httpNode.headers` – Zaglavlja odgovora

## Primjer

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Koristite cURL sintaksu s `-H` za zaglavlja, `-d` za POST tijelo itd. Izrazi se mogu koristiti bilo gdje u curl stringu, uključujući URL, zaglavlje ili cijeli redak zaglavlja. [Header vjerodajnica](../reference/credentials.md) razrješava se u `key: value`, pa `-H "$credentials.MyApiKey"` šalje kompletno zaglavlje:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Navodnici i razmaci unutar izraza pripadaju izrazu, a ne cURL naredbi, pa metode koje primaju string argumente rade inline:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autentifikacija s vjerodajnicama

`$credentials.Name` razrješava se u različitu vrijednost za svaki tip [vjerodajnice](../reference/credentials.md), pa redak zaglavlja ovisi o tipu:

| Tip vjerodajnice | `$credentials.Name` razrješava se u | Zaglavlje |
|-----------------|---------------------------------|--------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Sirovi API ključ | `-H "Authorization: Bearer $credentials.Name"` |
| Google | Sirovi API ključ | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | Sirovi API ključ | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Svježi OAuth pristupni token, osvježen kada istekne | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Token | `-H "Authorization: Bearer $credentials.Name"` |

Bearer vjerodajnica već nosi prefiks `Bearer `, pa dodavanje još jednog šalje `Bearer Bearer …`. Google Sheets i Google Drive vjerodajnice omogućuju pozivanje Google API-ja koje njihov čvor ne pokriva, poput dodavanja kartice u tablicu, unutar opsega koji su vjerodajnici dodijeljeni. Kada naziv nije obični identifikator (sadrži `-`, počinje znamenkom ili je rezervirana riječ), koristite oblik s uglatim zagradama: `-H "Authorization: $credentials["my-api-key"]"`.

Kada [AI Assistant](../reference/ai-assistant.md) ili [Chat](../tabs/chat-tab.md) sastavlja HTTP zahtjev koji zahtijeva autentifikaciju i nijedan namjenski čvor ne pokriva tu uslugu, pita koju vjerodajnicu koristiti. Odaberite jednu, promijenite unaprijed ispunjeni naziv zaglavlja ako API očekuje drugačiji, i on će napisati redak zaglavlja umjesto Vas. Assistant vidi nazive i tipove vjerodajnica, nikada njihove vrijednosti. Ako nemate odgovarajuću vjerodajnicu, pitanje nudi stvaranje nove. Tajne koje dospiju u izlaz čvora, poput poslanih `request.headers`, maskiraju se u rezultatima izvršavanja.

## Sigurnost izlaznog prometa

- Prema zadanim postavkama, URL mora koristiti `http://` ili `https://` i razrješavati se isključivo na javne adrese. Loopback, privatna, link-local, multicast i cloud-metadata odredišta su blokirana.
- Heym validira razriješene adrese i prikvačuje cilj veze kako bi spriječio DNS rebinding. Proxyji iz okoline onemogućeni su dok je zaštita aktivna. Preusmjeravanja se prema zadanim postavkama ne prate; dodajte cURL opciju `-L` za njihovo praćenje. Kada su omogućena, svaki korak preusmjeravanja provjerava se prema istoj politici javnih adresa i prikvačuje prije povezivanja.
- Pouzdane self-hosted instalacije koje namjerno pristupaju internim uslugama mogu postaviti `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Zadržite zadanu vrijednost na hosted ili multi-tenant instalacijama.

**Napomena o nadogradnji za v0.0.105:** ova politika na razini instance sada također štiti odredišta izvedena iz vjerodajnica koja koriste Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, prilagođeno izvršavanje LLM-a i otkrivanje modela, AI assistant, guardrails i RAG embeddings. Postojeće vjerodajnice koje pokazuju na loopback, privatne ili link-local adrese odbijaju se osim ako je `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` omogućeno na pouzdanoj self-hosted instanci. Dok je zaštita uključena, zaštićeni HTTP klijenti ignoriraju `HTTP_PROXY` i `HTTPS_PROXY`; omogućavanje opt-outa ih vraća. Operator CA paketi konfigurirani putem `SSL_CERT_FILE` ili `SSL_CERT_DIR` ostaju podržani. ClickHouse se provjerava prije otvaranja veze, ali se ne prikvačuje u trenutku biranja, jer clickhouse-connect donosi vlastiti urllib3 transport.

## Povezano

- [Tipovi čvorova](../reference/node-types.md) – Pregled svih tipova čvorova
- [Triggers](../reference/triggers.md) – HTTP kao ulazna točka workflowa
- [Kartica Vjerodajnice](../tabs/credentials-tab.md) – Dodajte API ključeve za autentificirane zahtjeve
