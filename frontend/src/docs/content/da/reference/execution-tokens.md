# Execution Tokens

Execution tokens er scoped JWTs, der giver adgang til en enkelt workflows execute- og stream-endpoints. De gør det muligt at kalde et workflow fra eksterne systemer uden at eksponere den langsigtede brugersessionstoken.

## Formålet med Execution Tokens

Når et workflows autentifikation er sat til **JWT**, kræver endpointet normalt en gyldig brugersession. Execution tokens gør det muligt at:

- Dele et kaldbart token med eksterne scripts, CI-pipeliner eller integrationer uden at dele kontoens legitimationsoplysninger.
- Begrænse eksponering - et token er kun gyldigt for ét specifikt workflow.
- Tilbagekalde adgang øjeblikkeligt uden at ændre adgangskode eller rotere sessionstokens.
- Vælge mellem kortlivede tokens (minutter eller timer) og langlivede tokens (op til 10 år).

## Oprettelse af Token

Åbn dialogboksen **Run with cURL** i editoren (værktøjslinjen øverst til højre). Når workflow-autentifikationen er sat til **JWT Token**, viser dialogen en tokenmanager:

1. Vælg **Short-lived** eller **Long-lived (10yr)**.
2. For kortlivede tokens indtastes varigheden i sekunder (minimum 60).
3. Klik på **+ New Token**.

Tokenet oprettes øjeblikkeligt, tilføjes til listen og vælges automatisk, så cURL-kommandoen opdateres til at inkludere det.

## Tokenliste

Hver tokenrække viser:

| Kolonne | Beskrivelse |
|--------|-------------|
| Created | Oprettelsestidsstempel |
| Status | **Expires:** dato, **Expired** eller **Revoked** |
| Øje-ikon | Skift synlighed af tokenværdi |
| Revoke-knap | Marker token som tilbagekaldt (uigenkaldeligt) |

Klik på enhver aktiv (ikke-udløbet, ikke-tilbagekaldt) række for at vælge den. Det valgte token indlejres i cURL-kommandoen forhåndsvisningen.

Udløbne og tilbagekaldte tokens forbliver synlige i listen, men kan ikke vælges.

## Brug af Token

Kopiér tokenværdien fra listen (klik på øje-ikonet for at afsløre den) og inkluder den som et `Bearer`-token:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Når der bruges **Copy cURL** i dialogen med et token valgt, er tokenet allerede indlejret i kommandoen - ingen manuel substitution nødvendig.

## Token-scoping

Hvert token indeholder disse JWT-claims:

| Claim | Værdi |
|-------|-------|
| `sub` | Bruger-ID for tokenets opretter |
| `wid` | Workflow UUID - tokenet afvises for alle andre workflows |
| `scope` | `workflow:execute` - adskiller det fra en brugersessionstoken |
| `jti` | Unikt token-ID brugt til tilbagekaldelsessøgninger |
| `exp` | Udløbstidsstempel |

Backend'en tjekker alle disse ved hver anmodning: signaturgyldighed, udløb, matchende `wid`, og at `jti` ikke er tilbagekaldt.

## Tilbagekaldelse

Klik på tilbagekaldelsesknappen (cirkel-skråstreg) ved siden af et token for at tilbagekalde det. Tilbagekaldelsen træder i kraft øjeblikkeligt - efterfølgende anmodninger med det token returnerer `401`. Tokenrækken forbliver synlig i listen med en **Revoked**-etikette.

Der er ingen mulighed for at fortryde tilbagekaldelse. Opret et nyt token, hvis adgang skal genoprettes.

## API

Token management-endpoints er autentificeret med den almindelige session.

| Metode | Sti | Beskrivelse |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Opret et token |
| `GET` | `/api/workflows/{id}/execution-tokens` | List tokens for dette workflow |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Tilbagekald et token |

**Oprettelsesanmodningskrop:**

```json
{ "ttl_seconds": 900 }
```

**Oprettelsessvar:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Feltet `token` returneres kun én gang ved oprettelse. Gem det straks; efterfølgende `GET`-anmodninger returnerer den samme række, men det er også muligt at afsløre det i cURL-dialogen til enhver tid.

## Synlighedsområde

Hver bruger ser kun de tokens, de selv har oprettet. Teammedlemmer med adgang til et delt workflow kan ikke se hinandens tokens.

## Relateret

- [Webhooks](./webhooks.md) - HTTP trigger-endpoints og cURL-dialogen
- [Security](./security.md) - Session management og autentifikationsoversigt
- [SSE Streaming](./sse-streaming.md) - Brug execution tokens med streaming-endpointet
