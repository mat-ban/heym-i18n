# Slack

**Slack**-noden sender en besked til en Slack-kanal via en Incoming Webhook. Den kan bruges til notifikationer, advarsler og fejlrapportering.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | Gennemløber input |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | Slack-legitimationsoplysninger (webhook URL) fra [Legitimationsoplysninger](../tabs/credentials-tab.md) |
| `message` | expression | Beskedtekst. Understøtter [udtryk](../reference/expression-dsl.md). |

## Opsætning

1. Opret en Incoming Webhook i Slack-workspacet
2. Tilføj Slack-legitimationsoplysninger under fanen Legitimationsoplysninger med webhook-URL'en
3. Referer til legitimationsoplysningerne i noden

## Eksempel

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

Brug sammen med [Error Handler](./error-handler-node.md) til fejlnotifikationer:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Egress-sikkerhed

- Webhook-URL'en gemt i legitimationsoplysningerne skal bruge `http://` eller `https://` og kun pege på offentlige adresser. Loopback, private, link-local, multicast og cloud-metadata destinationer blokeres.
- Heym validerer de opløste adresser og fastgør forbindelsesmålet før afsendelse, så et DNS-svar ikke kan flytte anmodningen til en intern adresse efter tjekket. Miljøproxier deaktiveres, mens sikkerhedstjekket er aktivt, og omdirigeringer følges ikke.
- Installationer, der poster til en intern webhook-modtager, kan sætte `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` på en selvhostet, pålidelig instans. Behold standardindstillingen på hostede eller multi-tenant installationer.

**Opgraderingsnote for v0.0.109:** dette tjek er nyt for Slack. Legitimationsoplysninger, hvis webhook-URL peger på loopback eller en privat adresse, afvises, medmindre ovenstående indstilling er aktiveret.

## Relateret

- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
- [Error Handler](./error-handler-node.md) – Send Slack ved workflow-fejl
- [Legitimationsoplysninger-fane](../tabs/credentials-tab.md) – Tilføj Slack-webhook
