# Execution Tokens

Execution tokens jsou omezené JWTs, které udělují přístup ke koncovým bodům execute a stream jednoho konkrétního workflow. Umožňují vám volat workflow z externích systémů, aniž byste vystavovali svůj dlouhodobý token uživatelské relace.

## Proč používat Execution Tokens

Když je ověřování workflow nastaveno na **JWT**, koncový bod obvykle vyžaduje platnou uživatelskou relaci. Execution tokens vám umožňují:

- Sdílet volatelný token s externími skripty, CI pipelines nebo integracemi, aniž byste sdíleli přihlašovací údaje svého účtu.
- Omezit expozici — token je platný pouze pro jedno konkrétní workflow.
- Okamžitě odvolat přístup, aniž byste měnili heslo nebo rotovali tokeny relace.
- Volit mezi krátkodobými tokeny (minuty nebo hodiny) a dlouhodobými tokeny (až 10 let).

## Vytvoření tokenu

Otevřete dialog **Run with cURL** v editoru (panel nástrojů v pravém horním rohu). Když je ověřování workflow nastaveno na **JWT Token**, dialog zobrazí správce tokenů:

1. Zvolte **Short-lived** nebo **Long-lived (10yr)**.
2. U krátkodobých tokenů zadejte dobu trvání v sekundách (minimum 60).
3. Klikněte na **+ New Token**.

Token se vytvoří okamžitě, přidá se do seznamu a automaticky se vybere, takže se příkaz cURL aktualizuje a zahrne jej.

## Seznam tokenů

Každý řádek tokenu zobrazuje:

| Sloupec | Popis |
|--------|-------------|
| Created | Časové razítko vytvoření |
| Status | **Expires:** datum, **Expired** nebo **Revoked** |
| Eye icon | Přepíná viditelnost hodnoty tokenu |
| Revoke button | Označí token jako odvolaný (nevratné) |

Kliknutím na kterýkoli aktivní (neexpirovaný, neodvolaný) řádek jej vyberete. Vybraný token se vloží do náhledu příkazu cURL.

Expirované a odvolané tokeny zůstávají v seznamu viditelné, ale nelze je vybrat.

## Použití tokenu

Zkopírujte hodnotu tokenu ze seznamu (kliknutím na ikonu oka ji zobrazíte) a zahrňte ji jako `Bearer` token:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Když v dialogu použijete **Copy cURL** s vybraným tokenem, token je již vložen v příkazu — není třeba jej ručně nahrazovat.

## Omezení rozsahu tokenu

Každý token nese tyto JWT claims:

| Claim | Hodnota |
|-------|-------|
| `sub` | ID uživatele, který token vytvořil |
| `wid` | UUID workflow — token je odmítnut pro jakékoli jiné workflow |
| `scope` | `workflow:execute` — odlišuje jej od tokenu uživatelské relace |
| `jti` | Jedinečné ID tokenu používané pro vyhledávání při odvolání |
| `exp` | Časové razítko expirace |

Backend kontroluje při každém požadavku všechny tyto náležitosti: platnost podpisu, expiraci, shodu `wid` a to, že `jti` nebyl odvolán.

## Odvolání

Kliknutím na tlačítko odvolání (přeškrtnutý kruh) vedle tokenu jej odvoláte. Odvolání nabývá účinnosti okamžitě — následné požadavky používající tento token vracejí `401`. Řádek tokenu zůstává v seznamu viditelný s označením **Revoked**.

Odvolání nelze vzít zpět. Pokud potřebujete obnovit přístup, vytvořte nový token.

## API

Koncové body pro správu tokenů se ověřují vaší běžnou relací.

| Metoda | Cesta | Popis |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Vytvoří token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Vypíše vaše tokeny pro toto workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Odvolá token |

**Tělo požadavku pro vytvoření:**

```json
{ "ttl_seconds": 900 }
```

**Odpověď na vytvoření:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Pole `token` se vrací pouze jednou při vytvoření. Uložte si jej okamžitě; následné požadavky `GET` vracejí stejný řádek, ale kdykoli jej můžete také zobrazit v dialogu cURL.

## Rozsah viditelnosti

Každý uživatel vidí pouze tokeny, které vytvořil. Členové týmu s přístupem ke sdílenému workflow nemohou vidět tokeny ostatních.

## Související

- [Webhooks](./webhooks.md) — koncové body HTTP triggerů a dialog cURL
- [Security](./security.md) — přehled správy relací a ověřování
- [SSE Streaming](./sse-streaming.md) — použití execution tokens s koncovým bodem streamování
