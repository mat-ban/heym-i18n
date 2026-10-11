# Uitvoeringstokens

Uitvoeringstokens zijn gescopeerde JWT's die toegang verlenen tot de execute- en stream-endpoints van één enkele workflow. Hiermee kunt u een workflow aanroepen vanuit externe systemen zonder uw langlevende gebruikerssessietoken bloot te stellen.

## Waarom Uitvoeringstokens Gebruiken

Wanneer de authenticatie van een workflow is ingesteld op **JWT**, vereist het endpoint normaal gesproken een geldige gebruikerssessie. Uitvoeringstokens stellen u in staat om:

- Een aanroepbaar token te delen met externe scripts, CI-pipelines of integraties zonder uw accountreferenties te delen.
- Blootstelling te beperken — een token is alleen geldig voor één specifieke workflow.
- Toegang onmiddellijk in te trekken zonder uw wachtwoord te wijzigen of sessietokens te roteren.
- Te kiezen tussen kortlevende tokens (minuten of uren) en langlevende tokens (tot 10 jaar).

## Een Token Aanmaken

Open het dialoogvenster **Run with cURL** in de editor (werkbalk rechtsboven). Wanneer de workflowauthenticatie is ingesteld op **JWT Token**, toont het dialoogvenster een tokenbeheerder:

1. Kies **Short-lived** of **Long-lived (10yr)**.
2. Voer voor kortlevende tokens de duur in seconden in (minimaal 60).
3. Klik op **+ New Token**.

Het token wordt onmiddellijk aangemaakt, toegevoegd aan de lijst en automatisch geselecteerd, zodat het cURL-commando wordt bijgewerkt om het op te nemen.

## Tokenlijst

Elke tokenrij toont:

| Kolom | Beschrijving |
|--------|-------------|
| Created | Tijdstempel van aanmaak |
| Status | **Expires:** datum, **Expired**, of **Revoked** |
| Oogpictogram | Schakel de zichtbaarheid van de tokenwaarde in of uit |
| Revoke-knop | Markeer token als ingetrokken (onomkeerbaar) |

Klik op een actieve rij (niet verlopen, niet ingetrokken) om deze te selecteren. Het geselecteerde token wordt ingesloten in het voorbeeld van het cURL-commando.

Verlopen en ingetrokken tokens blijven zichtbaar in de lijst, maar kunnen niet worden geselecteerd.

## Een Token Gebruiken

Kopieer de tokenwaarde uit de lijst (klik op het oogpictogram om deze te tonen) en voeg deze toe als een `Bearer`-token:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Trigger-Source: my-service" \
  -H "Authorization: Bearer <execution-token>" \
  "https://app.heym.ai/api/workflows/{workflow_id}/execute" \
  -d '{"message": "Hello"}'
```

Wanneer u **Copy cURL** in het dialoogvenster gebruikt met een geselecteerd token, is het token al ingesloten in het commando — handmatige vervanging is niet nodig.

## Tokenscope

Elk token bevat de volgende JWT-claims:

| Claim | Waarde |
|-------|-------|
| `sub` | Gebruikers-ID van de maker van het token |
| `wid` | Workflow-UUID — het token wordt geweigerd voor elke andere workflow |
| `scope` | `workflow:execute` — onderscheidt het van een gebruikerssessietoken |
| `jti` | Unieke token-ID gebruikt voor intrekkingsopzoekingen |
| `exp` | Tijdstempel van vervaldatum |

De backend controleert al deze zaken bij elk verzoek: geldigheid van de handtekening, vervaldatum, overeenkomende `wid`, en dat de `jti` niet is ingetrokken.

## Intrekking

Klik op de intrekkingsknop (cirkel-met-schuine-streep) naast een token om het in te trekken. Intrekking wordt onmiddellijk van kracht — daaropvolgende verzoeken met dat token retourneren `401`. De tokenrij blijft zichtbaar in de lijst met het label **Revoked**.

Er is geen mogelijkheid tot het ongedaan maken van een intrekking. Maak een nieuw token aan als u de toegang wilt herstellen.

## API

De endpoints voor tokenbeheer worden geauthenticeerd met uw reguliere sessie.

| Methode | Pad | Beschrijving |
|--------|------|-------------|
| `POST` | `/api/workflows/{id}/execution-tokens` | Een token aanmaken |
| `GET` | `/api/workflows/{id}/execution-tokens` | Uw tokens voor deze workflow weergeven |
| `DELETE` | `/api/workflows/{id}/execution-tokens/{token_id}` | Een token intrekken |

**Aanmaak-requestbody:**

```json
{ "ttl_seconds": 900 }
```

**Aanmaak-response:**

```json
{
  "id": "uuid",
  "token": "<full jwt>",
  "expires_at": "2026-04-30T15:22:00Z",
  "created_at": "2026-04-30T15:07:00Z",
  "revoked": false
}
```

Het veld `token` wordt alleen eenmalig bij aanmaak geretourneerd. Sla het onmiddellijk op; daaropvolgende `GET`-verzoeken retourneren dezelfde rij, maar u kunt het ook op elk moment in het cURL-dialoogvenster tonen.

## Zichtbaarheidsscope

Elke gebruiker ziet alleen de tokens die hij of zij heeft aangemaakt. Teamleden met toegang tot een gedeelde workflow kunnen elkaars tokens niet zien.

## Gerelateerd

- [Webhooks](./webhooks.md) — HTTP-trigger-endpoints en het cURL-dialoogvenster
- [Security](./security.md) — Sessiebeheer en authenticatieoverzicht
- [SSE Streaming](./sse-streaming.md) — Gebruik uitvoeringstokens met het streaming-endpoint
