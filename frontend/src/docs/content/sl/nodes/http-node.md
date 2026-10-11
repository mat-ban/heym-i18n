# HTTP

Vozlišče **HTTP** izvaja HTTP poizvedbe z uporabo sintakse cURL. Lahko je izhodiščna točka za workflow (brez vhodne povezave) ali prejme vhodne podatke iz zgornjih vozlišč.

## Pregled

| Lastnost | Vrednost |
|----------|----------|
| Vhodi | 0 ali 1 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.status`, `$nodeLabel.body`, `$nodeLabel.headers` |

## Parametri

| Parameter | Tip | Opis |
|-----------|-----|------|
| `label` | niz | Identifikator vozlišča (camelCase) |
| `curl` | niz | cURL ukaz (npr. `curl -X GET https://api.example.com`) |

## Oblika odgovora

```json
{
  "status": 200,
  "headers": { "content-type": "application/json", ... },
  "body": "telo odgovora ali razčlenjen JSON",
  "request": { "method": "POST", "url": "...", "headers": {...} }
}
```

## Dostop do odgovora

- `$httpNode.status` – HTTP statusna koda
- `$httpNode.body` – Telo odgovora (niz ali razčlenjen JSON)
- `$httpNode.body.fieldName` – Dostop do JSON polj
- `$httpNode.headers` – Glave odgovora

## Primer

```json
{
  "type": "http",
  "data": {
    "label": "fetchApi",
    "curl": "curl -X GET https://api.example.com/data"
  }
}
```

Uporabite sintakso cURL z `-H` za glave, `-d` za telo POST, itd. Izrazi se lahko uporabljajo kjerkoli v cURL nizu, vključno z URL-jem, glavo ali celo celotnim nizom glave. [Poverilnica za glavo](../reference/credentials.md) se razreši v `key: value`, tako da `-H "$credentials.MyApiKey"` pošlje celotno glavo:

```
curl -X GET "https://api.example.com/search?q=$query.body.text.urlEncode()" -H "$credentials.MyApiKey"
```

Niti in presledki znotraj izraza pripadajo izrazu, ne cURL ukazu, tako da metode, ki sprejemajo nize kot argumente, delujejo v vrstici:

```
curl "https://r.jina.ai/$url.text.replaceAll("\n", "").strip()" -H "Authorization: $credentials.Jina"
```

## Avtentikacija s poverilnicami

`$credentials.Name` se razreši v različne vrednosti za vsako [vrsto poverilnice](../reference/credentials.md), zato je vrstica glave odvisna od vrste:

| Vrsta poverilnice | `$credentials.Name` se razreši v | Glava |
|-------------------|-----------------------------------|-------|
| Bearer            | `Bearer <token>`                  | `-H "Authorization: $credentials.Name"` |
| Glava             | `<Header-Name>: <value>`          | `-H "$credentials.Name"` |
| OpenAI, Custom, Cohere | Neobdelana API ključ          | `-H "Authorization: Bearer $credentials.Name"` |
| Google            | Neobdelana API ključ              | `-H "x-goog-api-key: $credentials.Name"` |
| ElevenLabs        | Neobdelana API ključ              | `-H "xi-api-key: $credentials.Name"` |
| Google Sheets, Google Drive | Svež OAuth dostopni žeton, osvežen, ko poteče | `-H "Authorization: Bearer $credentials.Name"` |
| GitHub, Notion, Sentry | Žeton                          | `-H "Authorization: Bearer $credentials.Name"` |

Poverilnica Bearer že nosi predpono `Bearer `, zato dodajanje še ene pošlje `Bearer Bearer …`. Poverilnice za Google Sheets in Google Drive omogočajo klicanje Google API-jev, ki jih njihovo vozlišče ne pokriva, kot je dodajanje zavihka v preglednico, znotraj obsega, ki je bil poverilnici dodeljen. Ko ime ni preprosta identifikator (vsebuje `-`, se začne z digitom ali je rezervirana beseda), uporabite obliko z oklepaji: `-H "Authorization: $credentials["my-api-key"]"`.

Ko [AI Assistant](../reference/ai-assistant.md) ali [Chat](../tabs/chat-tab.md) gradi HTTP poizvedbo, ki potrebuje avtentikacijo in nobeno namensko vozlišče ne pokriva storitve, vpraša, katero poverilnico uporabiti. Izberite eno, spremenite predhodno izpolnjeno ime glave, če API pričakuje drugačno, in samodejno napiše vrstico glave za vas. Asistent vidi imena in vrste poverilnic, nikoli njihovih vrednosti. Če nimate ustrezne poverilnice, vprašanje ponudi, da jo ustvarite. Skrivnosti, ki dosežejo izhod vozlišča, kot so poslani `request.headers`, so prikrite v rezultatih izvajanja.

## Varnost izhoda

- Privzeto mora URL uporabljati `http://` ali `https://` in se razrešiti le na javne naslove. Naslovi za zanko, zasebni, lokalni povezavi, multicast in metapodatki v oblaku so blokirani.
- Heym preverja razrešene naslove in zaklene ciljno povezavo, da prepreči DNS ponovno vezavo. Proxies okolja so onemogočeni, medtem ko je zaščita aktivna. Preusmeritve privzeto niso sledene; dodajte cURL-ovo možnost `-L`, da jih sledite. Ko je omogočeno, se vsaka preusmeritev preveri glede iste politike javnega naslova in se zaklene pred povezovanjem.
- Zaupanja vredne samostojne namestitve, ki namerno povezujejo z notranjimi storitvami, lahko nastavijo `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Ohranite privzeto nastavitev na gostovanih ali večnajemniških namestitvah.

**Opomba o nadgradnji za v0.0.105:** ta politika na ravni instance zdaj ščiti tudi cilje, ki izhajajo iz poverilnic, ki jih uporabljajo Jira, Sentry, GitHub, Grist, Supabase, ClickHouse, izvajanje po meri LLM in odkrivanje modelov, AI asistent, zaščitne ograje in RAG vdelki. Obstoječe poverilnice, ki kažejo na naslove za zanko, zasebne ali lokalne povezave, so zavrnjene, razen če je na zaupanja vredni samostojni instance omogočeno `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Medtem ko je zaščita aktivna, zaščiteni HTTP odjemalci ignorirajo `HTTP_PROXY` in `HTTPS_PROXY`; omogočanje izklopa jih obnovi. Operaterji CA paketi, konfigurirani preko `SSL_CERT_FILE` ali `SSL_CERT_DIR`, ostajajo podprti. ClickHouse se preveri pred odprtjem povezave, vendar ni zaklenjen ob času klicanja, ker clickhouse-connect prinaša svoj lasten urllib3 transport.

## Sorodno

- [Vrste vozlišč](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [Triggerji](../reference/triggers.md) – HTTP kot vstopna točka za workflow
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajte API ključe za avtenticirane poizvedbe
