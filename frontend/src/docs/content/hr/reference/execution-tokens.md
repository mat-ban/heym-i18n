# Tokeni za Izvršavanje

Tokeni za izvršavanje su ograničeni JWT-ovi koji omogućuju pristup izvršnim i stream endpointima jednog workflow-a. Omogućuju vam pozivanje workflow-a iz vanjskih sustava bez izlaganja vašeg dugotrajnog korisničkog sesijskog tokena.

## Zašto koristiti Tokeni za Izvršavanje

Kada je autentifikacija workflow-a postavljena na **JWT**, endpoint obično zahtijeva važeću korisničku sesiju. Tokeni za izvršavanje omogućuju vam:

- Dijeljenje pozivnog tokena s vanjskim skriptama, CI pipeline-ima ili integracijama bez dijeljenja vaših vjerodajnica.
- Ograničavanje izloženosti — token je valjan samo za jedan specifični workflow.
- Trenutno opozivanje pristupa bez promjene lozinke ili rotacije sesijskih tokena.
- Odabir između kratkotrajnih tokena (minute ili sati) i dugotrajnih tokena (do 10 godina).

## Kreiranje Tokena

Otvorite dijalog **Pokreni s cURL** u uređivaču (gore desno na alatnoj traci). Kada je autentifikacija workflow-a postavljena na **JWT Token**, dijalog prikazuje upravitelja tokena:

1. Odaberite **Kratkotrajni** ili **Dugotrajni (10g)**.
2. Za kratkotrajne tokene, unesite trajanje u sekundama (minimalno 60).
3. Kliknite **+ Novi Token**.

Token se odmah kreira, dodaje na popis i automatski se odabire tako da se cURL naredba ažurira kako bi ga uključila.

## Popis Tokena

Svaki redak tokena prikazuje:

| Stupac | Opis |
|--------|-------------|
| Kreirano | Vrijeme kreiranja |
| Status | **Ističe:** datum, **Isteklo**, ili **Opozvano** |
| Ikona oka | Prebaci vidljivost vrijednosti tokena |
| Gumb za opoziv | Označi token kao opozvan (nepovratno) |

Kliknite bilo koji aktivni (neistekli, neopozvani) redak da biste ga odabrali. Odabrani token je ugrađen u pregled cURL naredbe.

Istekli i opozvani tokeni ostaju vidljivi na popisu, ali se ne mogu odabrati.

## Korištenje Tokena

Kopirajte vrijednost tokena s popisa (kliknite ikonu oka da biste je otkrili) i uključite je kao `Bearer` token:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Kada koristite **Kopiraj cURL** u dijalogu s odabranim tokenom, token je već ugrađen u naredbu — nije potrebna ručna zamjena.

## Ograničenje Tokena

Svaki token nosi ove JWT tvrdnje:

| Tvrdnja | Vrijednost |
|-------|-------|
| `sub` | ID korisnika koji je stvorio token |
| `wid` | UUID workflow-a — token se odbija za bilo koji drugi workflow |
| `scope` | `workflow:execute` — razlikuje ga od korisničkog sesijskog tokena |
| `jti` | Jedinstveni ID tokena korišten za pretraživanje opoziva |
| `exp` | Vrijeme isteka |

Backend provjerava sve ove tvrdnje pri svakoj zahtjevu: valjanost potpisa, isteka, podudaranje `wid`, i da `jti` nije opozvan.

## Opoziv

Kliknite gumb za opoziv (krug s crtom) pored tokena da biste ga opozvali. Opoziv stupa na snagu odmah — sljedeći zahtjevi koji koriste taj token vraćaju `401`. Redak tokena ostaje vidljiv na popisu s oznakom **Opozvano**.

Nema povratka s opozivom. Kreirajte novi token ako trebate obnoviti pristup.

## API

Endpointi za upravljanje tokenima autentificirani su vašom redovnom sesijom.

| Metoda | Putanja | Opis |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Kreirajte token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Prikažite svoje tokene za ovaj workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Opozovite token |

**Tijelo zahtjeva za kreiranje:**

```json
{ "ttl_seconds": 900 }
```

**Odgovor na kreiranje:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Polje `token` se vraća samo jednom prilikom kreiranja. Odmah ga pohranite; sljedeći `GET` zahtjevi vraćaju isti redak, ali ga također možete otkriti u cURL dijalogu u bilo kojem trenutku.

## Vidljivost Ograničenja

Svaki korisnik vidi samo tokene koje je stvorio. Članovi tima s pristupom zajedničkom workflow-u ne mogu vidjeti tokene jedni drugih.

## Povezano

- [Webhookovi](./webhooks.md) — HTTP trigger endpointi i cURL dijalog
- [Sigurnost](./security.md) — Pregled upravljanja sesijama i autentifikacije
- [SSE Streaming](./sse-streaming.md) — Koristite tokene za izvršavanje s streaming endpointom
