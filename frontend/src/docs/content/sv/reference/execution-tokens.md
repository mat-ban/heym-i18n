# Execution Tokens

Execution tokens är scopade JWT:er som ger åtkomst till en enskild workflows execute- och stream-endpoints. De gör det möjligt att anropa en workflow från externa system utan att exponera den långlivade användarsessionens token.

## Varför använda Execution Tokens

När en workflows autentisering är inställd på **JWT** kräver endpointen normalt en giltig användarsession. Execution tokens gör det möjligt att:

- Dela en anropbar token med externa skript, CI-pipelines eller integrationer utan att dela kontouppgifter.
- Begränsa exponeringen — en token är endast giltig för en specifik workflow.
- Återkalla åtkomst omedelbart utan att ändra lösenord eller rotera sessionstokens.
- Välja mellan kortlivade tokens (minuter eller timmar) och långlivade tokens (upp till 10 år).

## Skapa en token

Öppna dialogrutan **Run with cURL** i editorn (verktygsfältet uppe till höger). När workflowens autentisering är inställd på **JWT Token** visar dialogrutan en tokenhanterare:

1. Välj **Short-lived** eller **Long-lived (10yr)**.
2. För kortlivade tokens, ange varaktigheten i sekunder (minst 60).
3. Klicka på **+ New Token**.

Token skapas omedelbart, läggs till i listan och markeras automatiskt så att cURL-kommandot uppdateras med den.

## Tokenlista

Varje tokenrad visar:

| Kolumn | Beskrivning |
|--------|-------------|
| Created | Tidsstämpel för skapande |
| Status | **Expires:** datum, **Expired** eller **Revoked** |
| Ögonikon | Växla synlighet för tokenvärdet |
| Revoke-knapp | Markera token som återkallad (oåterkalleligt) |

Klicka på en aktiv rad (ej utgången, ej återkallad) för att markera den. Den markerade token bäddas in i förhandsvisningen av cURL-kommandot.

Utgångna och återkallade tokens förblir synliga i listan men kan inte markeras.

## Använda en token

Kopiera tokenvärdet från listan (klicka på ögonikonen för att visa det) och inkludera det som en `Bearer`-token:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

När **Copy cURL** används i dialogrutan med en token markerad är token redan inbäddad i kommandot — ingen manuell ersättning krävs.

## Token-scope

Varje token innehåller följande JWT-claims:

| Claim | Värde |
|-------|-------|
| `sub` | Användar-ID för den som skapade token |
| `wid` | Workflow-UUID — token avvisas för alla andra workflows |
| `scope` | `workflow:execute` — skiljer den från en användarsessionens token |
| `jti` | Unikt token-ID som används för uppslag vid återkallning |
| `exp` | Tidsstämpel för utgång |

Backend kontrollerar samtliga av dessa vid varje förfrågan: signaturens giltighet, utgång, matchande `wid` samt att `jti` inte har återkallats.

## Återkallning

Klicka på återkallningsknappen (cirkel med snedstreck) bredvid en token för att återkalla den. Återkallningen träder i kraft omedelbart — efterföljande förfrågningar med den token returnerar `401`. Tokenraden förblir synlig i listan med etiketten **Revoked**.

Det finns ingen ångra-funktion. Skapa en ny token om åtkomst behöver återställas.

## API

Tokenhanteringsendpoints autentiseras med den vanliga sessionen.

| Metod | Sökväg | Beskrivning |
|-------|--------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Skapa en token |
| `GET` | `/api/workflows/{id}/execution-tokens` | Lista egna tokens för denna workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Återkalla en token |

**Brödtext för skapandeförfrågan:**

```json
{ "ttl_seconds": 900 }
```

**Svar vid skapande:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Fältet `token` returneras endast en gång vid skapandet. Lagra det omedelbart; efterföljande `GET`-förfrågningar returnerar samma rad, men det går även att visa det i cURL-dialogrutan när som helst.

## Synlighetsomfång

Varje användare ser endast de tokens som denne har skapat. Teammedlemmar med åtkomst till en delad workflow kan inte se varandras tokens.

## Relaterat

- [Webhooks](./webhooks.md) — HTTP-trigger-endpoints och cURL-dialogrutan
- [Security](./security.md) — Sessionshantering och översikt över autentisering
- [SSE Streaming](./sse-streaming.md) — Använd execution tokens med streaming-endpointen
