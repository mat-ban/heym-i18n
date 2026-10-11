# Tokenuri de Execuție

Tokenurile de execuție sunt JWT-uri cu domeniu de aplicare restrâns care acordă acces la endpoint-urile de execuție și streaming ale unui singur workflow. Acestea permit apelarea unui workflow din sisteme externe fără a expune tokenul de sesiune al utilizatorului, care are durată lungă de viață.

## De ce să utilizați tokenuri de execuție

Atunci când autentificarea unui workflow este setată la **JWT**, endpoint-ul necesită în mod normal o sesiune de utilizator validă. Tokenurile de execuție permit:

- Partajarea unui token apelabil cu scripturi externe, pipeline-uri CI sau integrări, fără a partaja acreditările contului dvs.
- Limitarea expunerii — un token este valid doar pentru un singur workflow specific.
- Revocarea accesului instantaneu, fără a schimba parola sau a roti tokenurile de sesiune.
- Alegerea între tokenuri cu durată scurtă de viață (minute sau ore) și tokenuri cu durată lungă de viață (până la 10 ani).

## Crearea unui token

Deschideți dialogul **Run with cURL** din editor (bara de instrumente din colțul dreapta-sus). Atunci când autentificarea workflow-ului este setată la **JWT Token**, dialogul afișează un manager de tokenuri:

1. Alegeți **Short-lived** sau **Long-lived (10yr)**.
2. Pentru tokenurile cu durată scurtă de viață, introduceți durata în secunde (minimum 60).
3. Faceți clic pe **+ New Token**.

Tokenul este creat imediat, adăugat în listă și selectat automat, astfel încât comanda cURL este actualizată pentru a-l include.

## Lista de tokenuri

Fiecare rând de token afișează:

| Coloană | Descriere |
|--------|-------------|
| Created | Marcaj temporal al creării |
| Status | **Expires:** dată, **Expired** sau **Revoked** |
| Pictograma ochi | Comută vizibilitatea valorii tokenului |
| Butonul Revoke | Marchează tokenul ca revocat (ireversibil) |

Faceți clic pe orice rând activ (neexpirat, nerevocat) pentru a-l selecta. Tokenul selectat este încorporat în previzualizarea comenzii cURL.

Tokenurile expirate și revocate rămân vizibile în listă, dar nu pot fi selectate.

## Utilizarea unui token

Copiați valoarea tokenului din listă (faceți clic pe pictograma ochi pentru a o dezvălui) și includeți-o ca token `Bearer`:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Atunci când utilizați **Copy cURL** în dialog cu un token selectat, tokenul este deja încorporat în comandă — nu este necesară nicio substituire manuală.

## Domeniul de aplicare al tokenului

Fiecare token conține următoarele revendicări JWT:

| Revendicare | Valoare |
|-------|-------|
| `sub` | ID-ul utilizatorului care a creat tokenul |
| `wid` | UUID-ul workflow-ului — tokenul este respins pentru orice alt workflow |
| `scope` | `workflow:execute` — îl distinge de un token de sesiune de utilizator |
| `jti` | ID unic de token utilizat pentru căutări de revocare |
| `exp` | Marcaj temporal de expirare |

Backend-ul verifică toate acestea la fiecare cerere: validitatea semnăturii, expirarea, potrivirea `wid` și faptul că `jti` nu a fost revocat.

## Revocare

Faceți clic pe butonul de revocare (cerc tăiat) de lângă un token pentru a-l revoca. Revocarea are efect imediat — cererile ulterioare care utilizează acel token returnează `401`. Rândul tokenului rămâne vizibil în listă cu eticheta **Revoked**.

Nu există anulare a revocării. Creați un token nou dacă aveți nevoie să restabiliți accesul.

## API

Endpoint-urile de gestionare a tokenurilor sunt autentificate cu sesiunea dvs. obișnuită.

| Metodă | Cale | Descriere |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Creează un token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Listează tokenurile dvs. pentru acest workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Revocă un token |

**Corpul cererii de creare:**

```json
{ "ttl_seconds": 900 }
```

**Răspunsul de creare:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Câmpul `token` este returnat o singură dată la creare. Stocați-l imediat; cererile `GET` ulterioare returnează același rând, dar îl puteți dezvălui și în dialogul cURL în orice moment.

## Domeniul de vizibilitate

Fiecare utilizator vede doar tokenurile pe care le-a creat. Membrii echipei cu acces la un workflow partajat nu pot vedea tokenurile celorlalți.

## Resurse conexe

- [Webhooks](./webhooks.md) — endpoint-uri de trigger HTTP și dialogul cURL
- [Security](./security.md) — Prezentare generală a gestionării sesiunilor și autentificării
- [SSE Streaming](./sse-streaming.md) — Utilizarea tokenurilor de execuție cu endpoint-ul de streaming
