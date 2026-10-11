# Izpildes tokeni

Izpildes tokeni ir ierobežotas darbības jomas JWT, kas piešķir piekļuvi viena workflow izpildes un straumēšanas endpoint. Tie ļauj izsaukt workflow no ārējām sistēmām, nepieejot pie jūsu ilgstošā lietotāja sesijas tokena.

## Kāpēc izmantot izpildes tokenus

Kad workflow autentifikācija ir iestatīta uz **JWT**, endpoint parasti pieprasa derīgu lietotāja sesiju. Izpildes tokeni ļauj:

- Koplietot izsaucamu tokenu ar ārējiem skriptiem, CI pipeline vai integrācijām, nekoplietojot sava konta akreditācijas datus.
- Ierobežot pakļautību — tokens ir derīgs tikai vienam konkrētam workflow.
- Atsaukt piekļuvi nekavējoties, nemainot paroli vai nerotējot sesijas tokenus.
- Izvēlēties starp īslaicīgiem tokeniem (minūtes vai stundas) un ilglaicīgiem tokeniem (līdz 10 gadiem).

## Tokena izveide

Atveriet dialogu **Run with cURL** redaktorā (rīkjoslā augšējā labajā stūrī). Kad workflow autentifikācija ir iestatīta uz **JWT Token**, dialogs parāda tokenu pārvaldnieku:

1. Izvēlieties **Short-lived** vai **Long-lived (10yr)**.
2. Īslaicīgiem tokeniem ievadiet ilgumu sekundēs (minimums 60).
3. Noklikšķiniet uz **+ New Token**.

Tokens tiek izveidots nekavējoties, pievienots sarakstam un automātiski atlasīts, lai cURL komanda tiktu atjaunināta ar to.

## Tokenu saraksts

Katra tokena rinda parāda:

| Kolonna | Apraksts |
|--------|-------------|
| Created | Izveides laika zīmogs |
| Status | **Expires:** datums, **Expired** vai **Revoked** |
| Eye icon | Pārslēdz tokena vērtības redzamību |
| Revoke button | Atzīmē tokenu kā atsauktu (neatgriezeniski) |

Noklikšķiniet uz jebkuras aktīvas (nebeigušās, neatsauktas) rindas, lai to atlasītu. Atlasītais tokens tiek iekļauts cURL komandas priekšskatījumā.

Beigušies un atsauktie tokeni paliek redzami sarakstā, bet tos nevar atlasīt.

## Tokena izmantošana

Nokopējiet tokena vērtību no saraksta (noklikšķiniet uz acs ikonas, lai to atklātu) un iekļaujiet to kā `Bearer` tokenu:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Kad dialogā izmantojat **Copy cURL** ar atlasītu tokenu, tokens jau ir iekļauts komandā — manuāla aizstāšana nav nepieciešama.

## Tokena darbības joma

Katrs tokens satur šos JWT claims:

| Claim | Vērtība |
|-------|-------|
| `sub` | Tokena izveidotāja lietotāja ID |
| `wid` | Workflow UUID — tokens tiek noraidīts jebkuram citam workflow |
| `scope` | `workflow:execute` — atšķir to no lietotāja sesijas tokena |
| `jti` | Unikāls tokena ID, ko izmanto atsaukšanas meklējumiem |
| `exp` | Derīguma termiņa laika zīmogs |

Backend pārbauda visus šos pie katras pieprasījuma reizes: paraksta derīgumu, derīguma termiņu, atbilstošu `wid` un to, vai `jti` nav atsaukts.

## Atsaukšana

Noklikšķiniet uz atsaukšanas (circle-slash) pogas blakus tokenam, lai to atsauktu. Atsaukšana stājas spēkā nekavējoties — turpmākie pieprasījumi, izmantojot šo tokenu, atgriež `401`. Tokena rinda paliek redzama sarakstā ar apzīmējumu **Revoked**.

Atsaukšanas atcelšana nav iespējama. Izveidojiet jaunu tokenu, ja nepieciešams atjaunot piekļuvi.

## API

Tokenu pārvaldības endpoint tiek autentificēti ar jūsu parasto sesiju.

| Method | Path | Apraksts |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Izveidot tokenu |
| `GET` | `/api/workflows/{id}/execution-tokens` | Uzskaitīt jūsu tokenus šim workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Atsaukt tokenu |

**Create request body:**

```json
{ "ttl_seconds": 900 }
```

**Create response:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Lauks `token` tiek atgriezts tikai vienu reizi izveides brīdī. Saglabājiet to nekavējoties; turpmākie `GET` pieprasījumi atgriež to pašu rindu, bet to jebkurā laikā varat arī atklāt cURL dialogā.

## Redzamības joma

Katrs lietotājs redz tikai tos tokenus, ko pats izveidojis. Komandas dalībnieki ar piekļuvi koplietotam workflow nevar redzēt cits cita tokenus.

## Saistītie

- [Webhooks](./webhooks.md) — HTTP trigger endpoint un cURL dialogs
- [Security](./security.md) — Sesiju pārvaldības un autentifikācijas pārskats
- [SSE Streaming](./sse-streaming.md) — Izpildes tokenu izmantošana ar straumēšanas endpoint
