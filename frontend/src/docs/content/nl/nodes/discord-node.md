# Discord

De **Discord**-node verzendt een bericht naar een Discord-kanaal via een Incoming Webhook. Gebruik deze voor waarschuwingen, workflowmeldingen, bot-achtige antwoorden en foutrapportage.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 1 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | `discord`-referentie met de URL van de inkomende webhook |
| `message` | expressie | Uitgaande berichttekst. Ondersteunt [expressies](../reference/expression-dsl.md). |
| `username` | expressie | Optionele overschrijving van de weergavenaam voor dit bericht |
| `avatarUrl` | expressie | Optionele overschrijving van de avatar-URL voor dit bericht |

## Configuratie

1. Maak een [Discord Webhook-referentie](../reference/integrations.md#discord) aan
2. Voeg de **Discord**-node toe aan uw workflow
3. Selecteer de referentie
4. Stel `message` in op de uitgaande tekst of een sjabloon op basis van gegevens uit eerdere nodes
5. Overschrijf optioneel de weergavenaam `username` en `avatarUrl`

## Voorbeeld

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Uitvoervelden

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.status` | HTTP-statuscode geretourneerd door Discord, doorgaans `204` bij succes |
| `$nodeLabel.response` | Onbewerkte responsbody geretourneerd door de Discord-webhook |
| `$nodeLabel.message` | Berichttekst die Heym heeft verzonden |
| `$nodeLabel.username` | Gebruikersnaam verzonden met de webhook, indien opgegeven |
| `$nodeLabel.avatar_url` | Avatar-URL verzonden met de webhook, indien opgegeven |

## Veelvoorkomende patronen

- Gebruik deze naast [Discord Trigger](./discord-trigger-node.md) wanneer u een extra kanaalbericht wilt plaatsen naast het interactieantwoord
- Verzend storingsmeldingen vanuit [Error Handler](./error-handler-node.md)
- Plaats samenvattingen die zijn gegenereerd door [LLM](./llm-node.md) of [Agent](./agent-node.md)

## Egress-beveiliging

- De webhook-URL die in de referentie is opgeslagen, moet gebruikmaken van `http://` of `https://` en mag alleen naar openbare adressen verwijzen. Loopback-, privé-, link-local-, multicast- en cloud-metadata-bestemmingen zijn geblokkeerd.
- Heym valideert de opgeloste adressen en pint het verbindingsdoel vast voordat er wordt verzonden, zodat een DNS-antwoord de aanvraag na de controle niet naar een intern adres kan verplaatsen. Omgevingsproxies zijn uitgeschakeld terwijl de beveiliging actief is en redirects worden niet gevolgd.
- Implementaties die naar een interne webhook-ontvanger verzenden, kunnen `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` instellen op een vertrouwde self-hosted instantie. Behoud de standaardwaarde op gehoste of multi-tenant implementaties.

**Upgrademelding voor v0.0.109:** deze controle is nieuw voor Discord. Een referentie waarvan de webhook-URL naar loopback of een privéadres verwijst, wordt geweigerd tenzij de bovenstaande instelling is ingeschakeld.

## Gerelateerd

- [Discord Trigger](./discord-trigger-node.md) – Start een workflow vanuit inkomende Discord-interacties
- [Third-Party Integrations](../reference/integrations.md) – Configuratie van Discord-referenties
- [Credentials Tab](../tabs/credentials-tab.md) – `discord`-referenties toevoegen en beheren
- [Node Types](../reference/node-types.md) – Overzicht van alle node-typen
