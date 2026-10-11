# Izvršni Tokeni

Izvršni tokene so obsežni JWT-ji, ki omogočajo dostop do izvajalnih in pretakalnih endpointov enega samega workflow-a. Omogočajo vam klicanje workflow-a iz zunanjih sistemov, ne da bi razkrili svoj dolgoročni uporabniški sejni token.

## Zakaj uporabljati izvršne tokene

Ko je avtentikacija workflow-a nastavljena na **JWT**, endpoint običajno zahteva veljavno uporabniško sejo. Izvršni tokene vam omogočajo:

- Deljenje klicnega tokena z zunanjimi skripti, CI cevovodi ali integracijami, ne da bi delili poverilnice vašega računa.
- Omejitev izpostavljenosti — token je veljaven le za en specifičen workflow.
- Takojšnje preklicanje dostopa brez spreminjanja gesla ali rotacije sejnjih tokenov.
- Izbiro med kratkotrajnimi tokeni (minute ali ure) in dolgoročnimi tokeni (do 10 let).

## Ustvarjanje tokena

Odprite pogovorno okno **Run with cURL** v urejevalniku (orodna vrstica zgoraj desno). Ko je avtentikacija workflow-a nastavljena na **JWT Token**, pogovorno okno prikaže upravitelja tokenov:

1. Izberite **Kratkotrajen** ali **Dolgotrajen (10 let)**.
2. Za kratkotrjne tokene vnesite trajanje v sekundah (minimalno 60).
3. Kliknite **+ Nov token**.

Token se takoj ustvari, doda na seznam in samodejno izbere, tako da se ukaz cURL posodobi, da ga vključuje.

## Seznam tokenov

Vsaka vrstica tokena prikazuje:

| Stolpec | Opis |
|---------|------|
| Ustvarjeno | Časovni žig ustvarjanja |
| Status | **Poteka:** datum, **Potekel**, ali **Preklican** |
| Ikona očesa | Preklopi vidnost vrednosti tokena |
| Gumb za preklic | Označi token kot preklican (nepreklicno) |

Kliknite katero koli aktivno (nepoteklo, nepreklicano) vrstico, da jo izberete. Izbrani token je vključen v predogled ukaza cURL.

Potekli in preklicani tokeni ostanejo vidni na seznamu, vendar jih ni mogoče izbrati.

## Uporaba tokena

Kopirajte vrednost tokena s seznama (kliknite ikono očesa, da jo razkrijete) in jo vključite kot `Bearer` token:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Ko uporabite **Copy cURL** v pogovornem oknu z izbranim tokenom, je token že vključen v ukaz — ni potrebna ročna zamenjava.

## Obseg tokena

Vsak token nosi te JWT trditve:

| Trditev | Vrednost |
|---------|----------|
| `sub` | ID uporabnika ustvarjalca tokena |
| `wid` | UUID workflow-a — token je zavrnjen za kateri koli drug workflow |
| `scope` | `workflow:execute` — ločuje ga od uporabniškega sejnjega tokena |
| `jti` | Edinstveni ID tokena, uporabljen za iskanje preklicev |
| `exp` | Časovni žig poteka |

Zadnja stran preverja vse te trditve ob vsakem zahtevku: veljavnost podpisa, potek, ujemanje `wid` in da `jti` ni bil preklican.

## Preklic

Kliknite gumb za preklic (krog z diagonalno črto) poleg tokena, da ga prekličete. Preklic začne veljati takoj — naslednji zahtevki, ki uporabljajo ta token, vrnejo `401`. Vrstica tokena ostane vidna na seznamu z oznako **Preklican**.

Ni možnosti za obnovitev. Ustvarite nov token, če potrebujete obnovitev dostopa.

## API

Endpointi za upravljanje tokenov so avtenticirani z vašo redno sejo.

| Metoda | Pot | Opis |
|--------|-----|------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Ustvari token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Prikaži vaše tokene za ta workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Prekliči token |

**Telo zahteve za ustvarjanje:**

```json
{ "ttl_seconds": 900 }
```

**Odgovor ob ustvarjanju:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Polje `token` se vrne le enkrat ob ustvarjanju. Takoj ga shranite; naslednji `GET` zahtevki vrnejo isto vrstico, vendar jo lahko kadar koli razkrijete v pogovornem oknu cURL.

## Obseg vidnosti

Vsak uporabnik vidi le tokene, ki jih je ustvaril. Člani ekipe z dostopom do skupnega workflow-a ne morejo videti medsebojnih tokenov.

## Sorodno

- [Webhooks](./webhooks.md) — HTTP trigger endpointi in pogovorno okno cURL
- [Security](./security.md) — Pregled upravljanja sej in avtentikacije
- [SSE Streaming](./sse-streaming.md) — Uporaba izvršnih tokenov s pretakalnim endpointom
