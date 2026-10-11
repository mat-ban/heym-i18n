# Slack

De **Slack**-node verzendt een bericht naar een Slack-kanaal via een Incoming Webhook. Gebruik deze voor notificaties, waarschuwingen en foutrapportage.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | Geeft invoer door |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | Slack-referentie (webhook-URL) uit [Referenties](../tabs/credentials-tab.md) |
| `message` | expression | Berichttekst. Ondersteunt [expressies](../reference/expression-dsl.md). |

## Configuratie

1. Maak een Incoming Webhook aan in uw Slack-workspace
2. Voeg een Slack-referentie toe op het tabblad Referenties met de webhook-URL
3. Verwijs naar de referentie in de node

## Voorbeeld

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

Gebruik met [Error Handler](./error-handler-node.md) voor storingsmeldingen:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Egress-beveiliging

- De webhook-URL die in de referentie is opgeslagen, moet gebruikmaken van `http://` of `https://` en mag alleen naar openbare adressen verwijzen. Loopback-, privé-, link-local-, multicast- en cloud-metadata-bestemmingen zijn geblokkeerd.
- Heym valideert de opgeloste adressen en pint het verbindingsdoel vast voordat er wordt verzonden, zodat een DNS-antwoord de aanvraag na de controle niet naar een intern adres kan verplaatsen. Omgevingsproxies zijn uitgeschakeld terwijl de beveiliging actief is en redirects worden niet gevolgd.
- Implementaties die naar een interne webhook-ontvanger verzenden, kunnen `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` instellen op een vertrouwde self-hosted instantie. Behoud de standaardwaarde op gehoste of multi-tenant implementaties.

**Upgrade-opmerking voor v0.0.109:** deze controle is nieuw voor Slack. Een referentie waarvan de webhook-URL naar loopback of een privéadres verwijst, wordt geweigerd tenzij de bovenstaande instelling is ingeschakeld.

## Gerelateerd

- [Node-typen](../reference/node-types.md) – Overzicht van alle node-typen
- [Error Handler](./error-handler-node.md) – Slack verzenden bij workflowfout
- [Tabblad Referenties](../tabs/credentials-tab.md) – Slack-webhook toevoegen
