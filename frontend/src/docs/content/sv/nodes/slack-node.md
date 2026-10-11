# Slack

Noden **Slack** skickar ett meddelande till en Slack-kanal via en Incoming Webhook. Använd den för notifieringar, varningar och felrapportering.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Inmatningar | 1 |
| Utmatningar | 1 |
| Utdata | Skickar vidare indata |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | Slack-autentiseringsuppgift (webhook-URL) från [Autentiseringsuppgifter](../tabs/credentials-tab.md) |
| `message` | expression | Meddelandetext. Stöder [uttryck](../reference/expression-dsl.md). |

## Konfiguration

1. Skapa en Incoming Webhook i Slack-arbetsytan
2. Lägg till en Slack-autentiseringsuppgift på fliken Autentiseringsuppgifter med webhook-URL:en
3. Referera till autentiseringsuppgiften i noden

## Exempel

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Använd tillsammans med [Error Handler](./error-handler-node.md) för felnotifieringar:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Egress-säkerhet

- Webhook-URL:en som lagras i autentiseringsuppgiften måste använda `http://` eller `https://` och endast matcha publika adresser. Loopback-, privata, link-local-, multicast- och molnmetadata-destinationer blockeras.
- Heym validerar de matchade adresserna och fäster anslutningsmålet innan meddelandet skickas, så ett DNS-svar kan inte flytta begäran till en intern adress efter kontrollen. Miljöproxies inaktiveras medan skyddet är aktivt, och omdirigeringar följs inte.
- Distributioner som skickar till en intern webhook-mottagare kan sätta `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` på en betrodd självhostad instans. Behåll standardvärdet på hostade eller multi-tenant-distributioner.

**Uppgraderingsnotering för v0.0.109:** denna kontroll är ny för Slack. En autentiseringsuppgift vars webhook-URL pekar på loopback eller en privat adress avvisas om inte inställningen ovan är aktiverad.

## Relaterat

- [Nodtyper](../reference/node-types.md) – Översikt över alla nodtyper
- [Error Handler](./error-handler-node.md) – Skicka Slack vid workflow-fel
- [Fliken Autentiseringsuppgifter](../tabs/credentials-tab.md) – Lägg till Slack-webhook
