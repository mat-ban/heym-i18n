# Execution Tokenek

Az execution tokenek hatókörhöz kötött JWT-k, amelyek hozzáférést biztosítanak egyetlen workflow execute és stream endpointjaihoz. Segítségükkel külső rendszerekből hívhat meg egy workflow-t anélkül, hogy felfedné hosszú élettartamú felhasználói session tokenjét.

## Miért érdemes execution tokeneket használni

Amikor egy workflow hitelesítése **JWT**-re van állítva, az endpoint általában érvényes felhasználói sessiont igényel. Az execution tokenek lehetővé teszik, hogy:

- Megoszthat egy hívható tokent külső szkriptekkel, CI pipeline-okkal vagy integrációkkal anélkül, hogy megosztaná fiókja hitelesítési adatait.
- Korlátozza a kitettséget — egy token csak egy adott workflow-ra érvényes.
- Azonnal visszavonhassa a hozzáférést anélkül, hogy megváltoztatná jelszavát vagy rotálná a session tokeneket.
- Választhat rövid élettartamú tokenek (percek vagy órák) és hosszú élettartamú tokenek (akár 10 év) között.

## Token létrehozása

Nyissa meg a **Run with cURL** párbeszédablakot a szerkesztőben (jobb felső eszköztár). Amikor a workflow hitelesítése **JWT Token**-re van állítva, a párbeszédablak egy tokenkezelőt jelenít meg:

1. Válassza a **Short-lived** vagy a **Long-lived (10yr)** lehetőséget.
2. Rövid élettartamú tokenek esetén adja meg az időtartamot másodpercben (minimum 60).
3. Kattintson a **+ New Token** gombra.

A token azonnal létrejön, bekerül a listába, és automatikusan kijelölésre kerül, így a cURL parancs frissül, hogy tartalmazza azt.

## Tokenlista

Minden token sor a következőket mutatja:

| Oszlop | Leírás |
|--------|-------------|
| Created | Létrehozás időbélyege |
| Status | **Expires:** dátum, **Expired** vagy **Revoked** |
| Eye icon | A token érték láthatóságának váltása |
| Revoke button | A token visszavontként való megjelölése (visszafordíthatatlan) |

Kattintson bármely aktív (nem lejárt, nem visszavont) sorra a kijelöléséhez. A kijelölt token beágyazódik a cURL parancs előnézetébe.

A lejárt és visszavont tokenek láthatók maradnak a listában, de nem jelölhetők ki.

## Token használata

Másolja ki a token értékét a listából (kattintson a szem ikonra a megjelenítéséhez), és illessze be `Bearer` tokenként:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Amikor a párbeszédablakban a **Copy cURL** lehetőséget használja kijelölt tokennel, a token már be van ágyazva a parancsba — nincs szükség manuális helyettesítésre.

## Token hatókör

Minden token a következő JWT claim-eket tartalmazza:

| Claim | Érték |
|-------|-------|
| `sub` | A token létrehozójának felhasználói azonosítója |
| `wid` | Workflow UUID — a token bármely más workflow esetén elutasításra kerül |
| `scope` | `workflow:execute` — megkülönbözteti a felhasználói session tokentől |
| `jti` | Egyedi tokenazonosító, amelyet a visszavonási keresésekhez használnak |
| `exp` | Lejárati időbélyeg |

A backend minden kérésnél ellenőrzi ezeket: az aláírás érvényességét, a lejáratot, a `wid` egyezését, valamint azt, hogy a `jti` nem lett-e visszavonva.

## Visszavonás

Kattintson a token melletti visszavonás (kör-áthúzás) gombra a visszavonásához. A visszavonás azonnal életbe lép — az ezt követő, ezt a tokent használó kérések `401`-et adnak vissza. A token sora látható marad a listában **Revoked** címkével.

Nincs mód a visszavonás visszafordítására. Hozzon létre új tokent, ha helyre kívánja állítani a hozzáférést.

## API

A tokenkezelő endpointok a szokásos sessionjével vannak hitelesítve.

| Metódus | Útvonal | Leírás |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Token létrehozása |
| `GET` | `/api/workflows/{id}/execution-tokens` | Az ehhez a workflow-hoz tartozó tokenek listázása |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Token visszavonása |

**Létrehozási kérés törzse:**

```json
{ "ttl_seconds": 900 }
```

**Létrehozási válasz:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

A `token` mező csak egyszer, létrehozáskor kerül visszaadásra. Azonnal tárolja el; a későbbi `GET` kérések ugyanazt a sort adják vissza, de a cURL párbeszédablakban bármikor meg is jelenítheti.

## Láthatósági hatókör

Minden felhasználó csak az általa létrehozott tokeneket látja. A megosztott workflow-hoz hozzáféréssel rendelkező csapattagok nem látják egymás tokenjeit.

## Kapcsolódó

- [Webhooks](./webhooks.md) — HTTP trigger endpointok és a cURL párbeszédablak
- [Security](./security.md) — Session-kezelés és hitelesítés áttekintése
- [SSE Streaming](./sse-streaming.md) — Execution tokenek használata a streaming endpointtal
