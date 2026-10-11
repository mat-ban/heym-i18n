# Käivitus-tokenid

Käivitus-tokenid on skoobitud JWT-d, mis annavad juurdepääsu ühe workflow execute- ja stream-endpointidele. Need võimaldavad Teil kutsuda workflow'd välistest süsteemidest, ilma et peaksite avaldama oma pikaajalist kasutajaseansi tokenit.

## Miks kasutada käivitus-tokeneid

Kui workflow autentimine on seatud väärtusele **JWT**, nõuab endpoint tavaliselt kehtivat kasutajaseansi. Käivitus-tokenid võimaldavad Teil:

- Jagada kutsutavat tokenit väliste skriptide, CI-pipeline'ide või integratsioonidega, ilma et peaksite jagama oma konto mandaate.
- Piirata kokkupuudet — token kehtib ainult ühe kindla workflow jaoks.
- Tühistada juurdepääsu koheselt, ilma et peaksite muutma oma parooli või pöörama seansi tokeneid.
- Valida lühiajaliste tokenite (minutid või tunnid) ja pikaajaliste tokenite (kuni 10 aastat) vahel.

## Tokeni loomine

Avage redaktoris dialoog **Run with cURL** (ülemises paremas tööriistaribas). Kui workflow autentimine on seatud väärtusele **JWT Token**, kuvab dialoog tokenihalduri:

1. Valige **Short-lived** või **Long-lived (10yr)**.
2. Lühiajaliste tokenite puhul sisestage kestus sekundites (miinimum 60).
3. Klõpsake **+ New Token**.

Token luuakse koheselt, lisatakse loendisse ja valitakse automaatselt, nii et cURL-käsk uueneb selle lisamisega.

## Tokenite loend

Iga tokeni rida kuvab:

| Veerg | Kirjeldus |
|--------|-------------|
| Created | Loomise ajatempel |
| Status | **Expires:** kuupäev, **Expired** või **Revoked** |
| Eye icon | Tokeni väärtuse nähtavuse lülitamine |
| Revoke button | Märgi token tühistatuks (pöördumatu) |

Klõpsake mis tahes aktiivsel (aegumata, tühistamata) real, et see valida. Valitud token on cURL-käsu eelvaates manustatud.

Aegunud ja tühistatud tokenid jäävad loendis nähtavale, kuid neid ei saa valida.

## Tokeni kasutamine

Kopeerige tokeni väärtus loendist (klõpsake silmaikoonil, et see paljastada) ja lisage see `Bearer`-tokenina:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Kui kasutate dialoogis **Copy cURL** valitud tokeniga, on token juba käsus manustatud — käsitsi asendamist pole vaja.

## Tokeni skoopimine

Iga token kannab järgmisi JWT-väiteid:

| Väide | Väärtus |
|-------|-------|
| `sub` | Tokeni looja kasutaja ID |
| `wid` | Workflow UUID — token lükatakse tagasi mis tahes muu workflow puhul |
| `scope` | `workflow:execute` — eristab seda kasutajaseansi tokenist |
| `jti` | Unikaalne tokeni ID, mida kasutatakse tühistamise otsinguteks |
| `exp` | Aegumise ajatempel |

Taustaprogramm kontrollib kõiki neid igal päringul: allkirja kehtivust, aegumist, sobivat `wid`-d ja seda, et `jti` poleks tühistatud.

## Tühistamine

Klõpsake tokeni kõrval tühistamise (circle-slash) nuppu, et see tühistada. Tühistamine jõustub koheselt — järgnevad päringud, mis seda tokenit kasutavad, tagastavad `401`. Tokeni rida jääb loendisse nähtavale märgisega **Revoked**.

Tühistamise tühistamist ei ole. Kui vajate juurdepääsu taastamist, looge uus token.

## API

Tokenihalduse endpointe autenditakse Teie tavalise seansiga.

| Meetod | Tee | Kirjeldus |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Loo token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Loetle oma tokenid selle workflow jaoks |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Tühista token |

**Loomise päringu keha:**

```json
{ "ttl_seconds": 900 }
```

**Loomise vastus:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Väli `token` tagastatakse ainult üks kord loomise ajal. Salvestage see koheselt; järgnevad `GET`-päringud tagastavad sama rea, kuid saate selle igal ajal ka cURL-dialoogis paljastada.

## Nähtavuse skoop

Iga kasutaja näeb ainult tokeneid, mille ta ise lõi. Jagatud workflow'le juurdepääsu omavad meeskonnaliikmed ei näe üksteise tokeneid.

## Seotud

- [Webhooks](./webhooks.md) — HTTP trigger-endpointid ja cURL-dialoog
- [Security](./security.md) — Seansihalduse ja autentimise ülevaade
- [SSE Streaming](./sse-streaming.md) — Kasutage käivitus-tokeneid streaming-endpointiga
