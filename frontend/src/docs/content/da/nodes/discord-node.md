# Discord

**Discord**-noden sender en besked til en Discord-kanal via en indgående Webhook. Den kan anvendes til advarsler, workflow-notifikationer, bot-lignende svar og fejlrapportering.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 1 |
| Outputs | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | `discord`-legitimationsoplysning, der indeholder den indgående webhook-URL |
| `message` | expression | Udgående beskedtekst. Understøtter [udtryk](../reference/expression-dsl.md). |
| `username` | expression | Valgfri overskrivning af visningsnavn for denne besked |
| `avatarUrl` | expression | Valgfri overskrivning af avatar-URL for denne besked |

## Opsætning

1. Opret en [Discord Webhook-legitimationsoplysning](../reference/integrations.md#discord)
2. Tilføj **Discord**-noden til workflowet
3. Vælg legitimationsoplysningen
4. Indstil `message` til den udgående tekst eller en skabelon baseret på opstrømsdata
5. Valgfrit: Overskriv visningsnavnet `username` og `avatarUrl`

## Eksempel

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow fuldført: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Output-felter

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.status` | HTTP-statuskode returneret af Discord, typisk `204` ved succes |
| `$nodeLabel.response` | Rå responskrop returneret af Discord-webhooken |
| `$nodeLabel.message` | Beskedtekst, som Heym sendte |
| `$nodeLabel.username` | Brugernavn sendt med webhooken, hvis angivet |
| `$nodeLabel.avatar_url` | Avatar-URL sendt med webhooken, hvis angivet |

## Almindelige mønstre

- Anvend sammen med [Discord Trigger](./discord-trigger-node.md), når der ønskes en ekstra kanalbesked ud over interaktionssvaret
- Send fejlmeddelelser fra [Error Handler](./error-handler-node.md)
- Opsummeringer genereret af [LLM](./llm-node.md) eller [Agent](./agent-node.md)

## Egress-sikkerhed

- Webhook-URL'en gemt i legitimationsoplysningen skal bruge `http://` eller `https://` og kun pege på offentlige adresser. Loopback, private, link-local, multicast og cloud-metadata-destinationer blokeres.
- Heym validerer de opløste adresser og fastgør forbindelsesmålet før afsendelse, så et DNS-svar ikke kan flytte anmodningen til en intern adresse efter tjekket. Miljøproxier deaktiveres, mens sikkerhedstjekket er aktivt, og omdirigeringer følges ikke.
- Installationer, der poster til en intern webhook-modtager, kan indstille `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` på en pålidelig selvhostet instans. Behold standardindstillingen på hostede eller multi-tenant-installationer.

**Opgraderingsbemærkning for v0.0.109:** denne kontrol er ny for Discord. En legitimationsoplysning, hvis webhook-URL peger på loopback eller en privat adresse, afvises, medmindre ovenstående indstilling er aktiveret.

## Relateret

- [Discord Trigger](./discord-trigger-node.md) – Start et workflow fra indgående Discord-interaktioner
- [Tredjepartsintegrationer](../reference/integrations.md) – Opsætning af Discord-legitimationsoplysninger
- [Legitimationsoplysningsfanen](../tabs/credentials-tab.md) – Tilføj og håndter `discord`-legitimationsoplysninger
- [Node-typer](../reference/node-types.md) – Oversigt over alle node-typer
