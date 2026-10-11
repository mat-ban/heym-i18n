# Discord

Noden **Discord** skickar ett meddelande till en Discord-kanal via en Incoming Webhook. Den används för varningar, workflow-aviseringar, bot-liknande svar och felrapportering.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 1 |
| Utdata | 1 |
| Utdata | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | `discord`-autentiseringsuppgift som innehåller URL:en för incoming webhook |
| `message` | expression | Utgående meddelandetext. Stöder [uttryck](../reference/expression-dsl.md). |
| `username` | expression | Valfri åsidosättning av visningsnamn för detta meddelande |
| `avatarUrl` | expression | Valfri åsidosättning av avatar-URL för detta meddelande |

## Konfiguration

1. Skapa en [Discord Webhook-autentiseringsuppgift](../reference/integrations.md#discord)
2. Lägg till noden **Discord** i workflowet
3. Välj autentiseringsuppgiften
4. Ange `message` till den utgående texten eller en mall som byggs från uppströmsdata
5. Åsidosätt valfritt visningsnamnet `username` och `avatarUrl`

## Exempel

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

## Utdatafält

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.status` | HTTP-statuskod som returneras av Discord, vanligtvis `204` vid lyckat resultat |
| `$nodeLabel.response` | Rå svarskropp som returneras av Discord-webhooken |
| `$nodeLabel.message` | Meddelandetext som Heym skickade |
| `$nodeLabel.username` | Användarnamn som skickades med webhooken, om angivet |
| `$nodeLabel.avatar_url` | Avatar-URL som skickades med webhooken, om angiven |

## Vanliga mönster

- Använd den tillsammans med [Discord Trigger](./discord-trigger-node.md) när en extra kanalpost önskas utöver interaktionssvaret
- Skicka felmeddelanden från [Error Handler](./error-handler-node.md)
- Publicera sammanfattningar som genererats av [LLM](./llm-node.md) eller [Agent](./agent-node.md)

## Egress-säkerhet

- Webhook-URL:en som lagras i autentiseringsuppgiften måste använda `http://` eller `https://` och får endast matcha publika adresser. Loopback, privata, link-local, multicast och molnmetadata-destinationer blockeras.
- Heym validerar de matchade adresserna och låser anslutningsmålet innan meddelandet skickas, så ett DNS-svar kan inte flytta begäran till en intern adress efter kontrollen. Miljöproxies inaktiveras medan skyddet är aktivt, och omdirigeringar följs inte.
- Distributioner som skickar till en intern webhook-mottagare kan ange `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` på en betrodd självhostad instans. Behåll standardvärdet på hostade eller multi-tenant-distributioner.

**Uppgraderingsnotis för v0.0.109:** denna kontroll är ny för Discord. En autentiseringsuppgift vars webhook-URL pekar på loopback eller en privat adress avvisas om inte inställningen ovan är aktiverad.

## Relaterat

- [Discord Trigger](./discord-trigger-node.md) – Starta ett workflow från inkommande Discord-interaktioner
- [Third-Party Integrations](../reference/integrations.md) – Konfiguration av Discord-autentiseringsuppgifter
- [Credentials Tab](../tabs/credentials-tab.md) – Lägg till och hantera `discord`-autentiseringsuppgifter
- [Node Types](../reference/node-types.md) – Översikt över alla nodtyper
