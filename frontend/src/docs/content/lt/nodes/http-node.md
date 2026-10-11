# HTTP

**HTTP** mazgas atlieka HTTP užklausas naudodamas cURL sintaksę. Jis gali būti darbo eigos pradžios taškas (neturi įeinančio krašto) arba gauti įvestį iš aukščiau esančių mazgų.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 0 arba 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `label` | string | Mazgo identifikatorius (camelCase) |
| `curl` | string | cURL komanda (pvz., `curl -X GET https://api.example.com`) |

## Atsakymo formatas

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "atsakymo turinys arba išanalizuotas JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Atsakymo prieiga

- `$httpNode.status` – HTTP statuso kodas
- `$httpNode.body` – Atsakymo turinys (string arba išanalizuotas JSON)
- `$httpNode.body.fieldName` – Prieiga prie JSON laukų
- `$httpNode.headers` – Atsakymo antraštės

## Pavyzdys

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Naudokite cURL sintaksę su `-H` antraštėms, `-d` POST turiniui ir kt. Išraiškos gali būti naudojamos bet kurioje cURL eilutės dalyje, įskaitant URL, antraštę ar visą antraštės eilutę. [Header credential](../reference/credentials.md) išsprendžia į `key: value`, todėl `-H "$credentials.MyApiKey"` siunčia visą antraštę:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Kabutės ir tarpai išraiškoje priklauso išraiškai, o ne cURL komandai, todėl metodai, kurie priima string argumentus, veikia tiesiogiai:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Autentifikavimas su kredencialais

`$credentials.Name` išsprendžia į skirtingą vertę kiekvienam [credential](../reference/credentials.md) tipui, todėl antraštės eilutė priklauso nuo tipo:

| Kredencialo tipas | `$credentials.Name` išsprendžia į | Antraštė |
|-------------------|-------------------------------------|----------|
| Bearer | `Bearer <token>` | `-H "Authorization: $credentials.Name"` |
| Header | `<Header-Name>: <value>` | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Žaliava API raktas | `-H "Authorization: Bearer $credentials.Name"` |
| Google | Žaliava API raktas | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs | Žaliava API raktas | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Naujas OAuth prieigos raktas, atnaujinamas pasibaigus | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Raktas | `-H "Authorization: Bearer $credentials.Name"` |

Bearer kredencialas jau turi `Bearer ` prefiksą, todėl pridėjus dar vieną, siunčiama `Bearer Bearer …`. Google Sheets ir Google Drive kredencialai leidžia jums skambinti Google API, kurių mazgas neapima, pavyzdžiui, pridėti skirtuką prie skaičiuoklės, per apimtis, kurioms buvo suteikta kredencialo teisė. Kai pavadinimas nėra paprastas identifikatorius (jame yra `-`, prasideda skaičiumi arba yra rezervuota žodis), naudokite skliaustų formą: `-H "Authorization: $credentials["my-api-key"]"`.

Kai [AI Assistant](../reference/ai-assistant.md) arba [Chat](../tabs/chat-tab.md) sudaro HTTP užklausą, kuriai reikia autentifikacijos ir jokio specializuoto mazgo, kuris apimtų paslaugą, jis klausia, kurią kredencialą naudoti. Pasirinkite vieną, pakeiskite iš anksto užpildytą antraštės pavadinimą, jei API tikisi kito, ir jis parašo antraštės eilutę už Jus. Asistentas mato kredencialų pavadinimus ir tipus, niekada jų vertes. Jei neturite tinkamos kredencialo, klausimas siūlo sukurti vieną. Paslaptys, kurios pasiekia mazgo išvestį, tokios kaip siunčiami `request.headers`, yra maskuojamos vykdymo rezultatuose.

## Išėjimo saugumas

- Pagal numatytuosius nustatymus, URL turi naudoti `http://` arba `https://` ir būti sprendžiamas tik į viešas adresus. Loopback, privatūs, link-local, multicast ir cloud-metadata tikslai yra blokuojami.
- Heym patikrina išspręstus adresus ir fiksuoja ryšio tikslą, kad būtų išvengta DNS rebinding. Aplinkos proxy yra išjungti, kol saugiklis aktyvus. Peradresavimai pagal numatytuosius nustatymus nėra sekami; pridėkite cURL `-L` parinktį, kad juos sekti. Kai tai įjungta, kiekvienas peradresavimo šuolis tikrinamas pagal tą pačią viešo adreso politiką ir fiksuojamas prieš prisijungiant.
- Patikimos savarankiškai talpinamos diegimo versijos, kurios tyčia jungiasi prie vidinių paslaugų, gali nustatyti `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Laikykite numatytąjį nustatymą talpinamose arba daugiakartinėse diegimo versijose.

**Atnaujinimo pastaba v0.0.105:** ši politikos taisyklė dabar taip pat saugo kredencialų pagrindu sukurtus tikslus, naudojamus Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, individualių LLM vykdymo ir modelių atradimo, AI asistento, saugiklių ir RAG įterpimų. Esamos kredencialai, kurie rodo į loopback, privatus ar link-local adresus, yra atmetami, nebent `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` yra įjungtas patikimoje savarankiškai talpinamoje versijoje. Kol saugiklis yra įjungtas, saugomi HTTP klientai ignoruoja `HTTP_PROXY` ir `HTTPS_PROXY`; išjungus opt-out, jie atstatomi. Operatoriaus CA paketai, sukonfigūruoti per `SSL_CERT_FILE` arba `SSL_CERT_DIR`, lieka palaikomi. ClickHouse tikrinamas prieš atidarant ryšį, tačiau nėra fiksuojamas dial metu, nes clickhouse-connect naudoja savo urllib3 transportą.

## Susiję

- [Mazgų tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Triggeriai](../reference/triggers.md) – HTTP kaip darbo eigos įėjimo taškas
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti API raktus autentifikuotoms užklausoms
