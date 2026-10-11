# Execučné tokeny

Execučné tokeny sú scoped JWT, ktoré udeľujú prístup k execute a stream endpointom jedného workflow. Umožňujú vám volať workflow z externých systémov bez odhalenia vášho dlhodobého používateľského session tokenu.

## Prečo používať execučné tokeny

Keď je autentifikácia workflow nastavená na **JWT**, endpoint zvyčajne vyžaduje platnú používateľskú session. Execučné tokeny vám umožňujú:

- Zdieľať volateľný token s externými skriptami, CI pipelines alebo integráciami bez zdieľania prihlasovacích údajov k účtu.
- Obmedziť expozíciu — token je platný len pre jeden konkrétny workflow.
- Okamžite odvolať prístup bez zmeny hesla alebo rotácie session tokenov.
- Vybrať si medzi krátkodobými tokenmi (minúty alebo hodiny) a dlhodobými tokenmi (až 10 rokov).

## Vytvorenie tokenu

Otvorte dialóg **Run with cURL** v editore (panel nástrojov v pravom hornom rohu). Keď je autentifikácia workflow nastavená na **JWT Token**, dialóg zobrazí správcu tokenov:

1. Vyberte **Short-lived** alebo **Long-lived (10yr)**.
2. Pre krátkodobé tokeny zadajte trvanie v sekundách (minimum 60).
3. Kliknite na **+ New Token**.

Token sa vytvorí okamžite, pridá sa do zoznamu a automaticky sa vyberie, takže sa príkaz cURL aktualizuje a zahrnie ho.

## Zoznam tokenov

Každý riadok tokenu zobrazuje:

| Stĺpec | Popis |
|--------|-------------|
| Created | Časová značka vytvorenia |
| Status | **Expires:** dátum, **Expired** alebo **Revoked** |
| Ikona oka | Prepína viditeľnosť hodnoty tokenu |
| Tlačidlo Revoke | Označí token ako odvolaný (nevratné) |

Kliknutím na ktorýkoľvek aktívny (neexpirovaný, neodvolaný) riadok ho vyberiete. Vybraný token sa vloží do náhľadu príkazu cURL.

Expirované a odvolané tokeny zostávajú v zozname viditeľné, ale nie je možné ich vybrať.

## Použitie tokenu

Skopírujte hodnotu tokenu zo zoznamu (kliknutím na ikonu oka ju zobrazíte) a zahrňte ju ako `Bearer` token:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Keď v dialógu použijete **Copy cURL** s vybraným tokenom, token je už vložený v príkaze — nie je potrebná manuálna substitúcia.

## Scope tokenu

Každý token nesie tieto JWT claims:

| Claim | Hodnota |
|-------|-------|
| `sub` | ID používateľa, ktorý token vytvoril |
| `wid` | UUID workflow — token je odmietnutý pre akýkoľvek iný workflow |
| `scope` | `workflow:execute` — odlišuje ho od používateľského session tokenu |
| `jti` | Jedinečné ID tokenu používané na vyhľadávanie pri odvolaní |
| `exp` | Časová značka expirácie |

Backend kontroluje pri každej požiadavke všetky tieto údaje: platnosť podpisu, expiráciu, zhodu `wid` a to, či `jti` nebolo odvolané.

## Odvolanie

Kliknutím na tlačidlo odvolania (circle-slash) vedľa tokenu ho odvoláte. Odvolanie nadobudne účinnosť okamžite — následné požiadavky používajúce tento token vrátia `401`. Riadok tokenu zostáva v zozname viditeľný s označením **Revoked**.

Neexistuje spôsob, ako odvolanie vrátiť. Ak potrebujete obnoviť prístup, vytvorte nový token.

## API

Endpointy na správu tokenov sa autentifikujú vašou bežnou session.

| Metóda | Cesta | Popis |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Vytvorenie tokenu |
| `GET` | `/api/workflows/{id}/execution-tokens` | Zoznam vašich tokenov pre tento workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Odvolanie tokenu |

**Telo požiadavky na vytvorenie:**

```json
{ "ttl_seconds": 900 }
```

**Odpoveď na vytvorenie:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Pole `token` sa vráti iba raz pri vytvorení. Uložte si ho okamžite; následné požiadavky `GET` vrátia rovnaký riadok, ale kedykoľvek ho môžete zobraziť aj v dialógu cURL.

## Rozsah viditeľnosti

Každý používateľ vidí iba tokeny, ktoré vytvoril. Členovia tímu s prístupom k zdieľanému workflow nevidia tokeny ostatných.

## Súvisiace

- [Webhooks](./webhooks.md) — HTTP trigger endpointy a dialóg cURL
- [Security](./security.md) — Prehľad správy session a autentifikácie
- [SSE Streaming](./sse-streaming.md) — Použitie execučných tokenov so streamovacím endpointom
