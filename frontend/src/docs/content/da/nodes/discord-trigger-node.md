# Discord Trigger

**Discord Trigger**-noden er en nul-input-startpunkt, der modtanger Discord Interactions API-webhooks og automatisk starter et workflow. Den anvendes til slash-kommandoer, knapper, modaler og andre Discord-applikationsinteraktioner, der skal videreføres til efterfølgende AI- eller integrationsnoder.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | `discord_trigger`-legitimationsoplysninger, der indeholder Discord-applikationens offentlige nøgle |

## Opsætningsvejledning

### 1. Opret `discord_trigger`-legitimationsoplysninger

1. Gå til **Indstillinger → Legitimationsoplysninger → Nye legitimationsoplysninger**
2. Vælg typen **Discord Trigger (Public Key)**
3. Indsæt **Application Public Key** fra Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Gem legitimationsoplysningerne

### 2. Tilføj noden til workflowet

1. Træk **Discord Trigger** ind på canvas
2. Vælg noden for at åbne egenskabs-panelet
3. Vælg de `discord_trigger`-legitimationsoplysninger, der skal anvendes
4. Kopier den **Interactions URL**, der vises i node-panelet

### 3. Registrer interactions-endpoint i Discord

1. Åbn [Discord Developer Portal](https://discord.com/developers/applications)
2. Vælg den relevante applikation
3. Gå til **General Information** eller **Interactions**
4. Indsæt nodens **Interactions Endpoint URL** i endpoint-feltet
5. Discord sender en `PING`-anmodning for at validere endpointet, og Heym svarer automatisk efter signaturverifikation
6. Gem ændringerne

## Output-felter

Når noden aktiveres, kan efterfølgende noder tilgå:

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.interaction` | Fuld Discord-interaktionspayload |
| `$nodeLabel.type` | Interaktionstype |
| `$nodeLabel.data` | Payload for kommando, knap eller modal |
| `$nodeLabel.data.name` | Slash-kommandoens navn, hvor relevant |
| `$nodeLabel.data.options` | Array med slash-kommandoens tilvalg |
| `$nodeLabel.headers` | Rensede webhook-headers |
| `$nodeLabel.triggered_by` | Triggerkilde (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | Canvas-node-ID, der modtog Discord-interaktionen |
| `$nodeLabel.triggered_at` | ISO-tidsstempel for workflowkørslen |

## Eksempel på workflow

**Discord slash-kommando → LLM → Output**

```
discordTrigger → llm → output
```

- **Discord Trigger**-label: `discordEvent`
- **LLM**-brugermeddelelse: `"Svar på denne Discord-kommando: $discordEvent.data.name"`
- **Output**-meddelelse: `$llm.text`

## Sikkerhed

- Anmodninger valideres med **Ed25519** ved hjælp af applikationens offentlige nøgle
- Tidsstempler ældre end **5 minutter** afvises for at reducere replay-angreb
- Følsomme headers (`x-signature-ed25519`, `authorization` osv.) fjernes, før data når efterfølgende noder
- Triggeren kræver gyldige `discord_trigger`-legitimationsoplysninger; anmodninger afvises, hvis legitimationsoplysningerne mangler eller er ugyldige

## Bemærkninger

- Heym returnerer en udskudt Discord-respons med det samme, kører workflowet i baggrunden og sender det endelige output som en Discord-follow-up, når en `Output`-node producerer indhold
- Interactions-URL'en er afledt af node-ID'et og forbliver stabil, selvom workflowet omdøbes
- En almindelig [Discord Node](./discord-node.md) bør kun anvendes, hvis der også ønskes en separat webhook-post udover interaktionsfollow-up'en
- En enkelt `discordTrigger`-node er normalt tilstrækkelig; brug **Switch** eller **Condition** nedstrøms til at dirigere forskellige interaktionstyper

## Relateret

- [Discord Node](./discord-node.md) – Send udgående Discord-meddelelser
- [Triggers](../reference/triggers.md) – Oversigt over alle workflow-startpunkter
- [Third-Party Integrations](../reference/integrations.md) – Opsætning af Discord-legitimationsoplysninger
- [Credentials Tab](../tabs/credentials-tab.md) – Tilføj og håndter `discord_trigger`-legitimationsoplysninger
