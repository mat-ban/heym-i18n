# Discord Trigger

Noden **Discord Trigger** är en ingångspunkt utan indata som tar emot webhooks från Discord Interactions API och startar en workflow automatiskt. Den används för slash-kommandon, knappar, modaler och andra Discord-applikationsinteraktioner som ska flöda vidare till efterföljande AI- eller integrationsnoder.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 0 |
| Utdata | 1 |
| Utdata | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | Autentiseringsuppgift av typen `discord_trigger` som innehåller Discord-applikationens publika nyckel |

## Konfigurationsguide

### 1. Skapa en autentiseringsuppgift av typen `discord_trigger`

1. Gå till **Settings → Credentials → New Credential**
2. Välj typen **Discord Trigger (Public Key)**
3. Klistra in **Application Public Key** från Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Spara autentiseringsuppgiften

### 2. Lägg till noden i workflowen

1. Dra **Discord Trigger** till canvas
2. Markera noden för att öppna panelen Properties
3. Välj autentiseringsuppgiften av typen `discord_trigger`
4. Kopiera **Interactions URL** som visas i nodpanelen

### 3. Registrera Interactions-endpointen i Discord

1. Öppna [Discord Developer Portal](https://discord.com/developers/applications)
2. Välj applikationen
3. Gå till **General Information** eller **Interactions**
4. Klistra in nodens **Interactions Endpoint URL** i endpoint-fältet
5. Discord skickar en `PING`-begäran för att validera endpointen och Heym svarar automatiskt efter att signaturen har verifierats
6. Spara ändringarna

## Utdatafält

När noden har triggats kan efterföljande noder komma åt:

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.interaction` | Fullständig Discord-interaktionspayload |
| `$nodeLabel.type` | Interaktionstyp |
| `$nodeLabel.data` | Payload för kommando, knapp eller modal |
| `$nodeLabel.data.name` | Namn på slash-kommando, när tillämpligt |
| `$nodeLabel.data.options` | Array med alternativ för slash-kommando |
| `$nodeLabel.headers` | Sanerade webhook-headers |
| `$nodeLabel.triggered_by` | Etikett för triggerkälla (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | Canvas-nodens ID som tog emot Discord-interaktionen |
| `$nodeLabel.triggered_at` | ISO-tidsstämpel för denna workflow-körning |

## Exempel på workflow

**Discord slash-kommando → LLM → Output**

```
discordTrigger → llm → output
```

- **Discord Trigger**-etikett: `discordEvent`
- **LLM** användarmeddelande: `"Reply to this Discord command: $discordEvent.data.name"`
- **Output**-meddelande: `$llm.text`

## Säkerhet

- Begäranden verifieras med **Ed25519** med hjälp av applikationens publika nyckel
- Tidsstämplar äldre än **5 minuter** avvisas för att minska risken för replay-attacker
- Känsliga headers (`x-signature-ed25519`, `authorization` etc.) tas bort innan data når efterföljande noder
- Triggern kräver en giltig autentiseringsuppgift av typen `discord_trigger`; begäranden avvisas om autentiseringsuppgiften saknas eller är ogiltig

## Anmärkningar

- Heym returnerar omedelbart ett uppskjutet Discord-svar, kör workflowen i bakgrunden och publicerar workflowens slutliga utdata som en Discord-uppföljning när en `Output`-nod producerar innehåll
- Interactions-URL:en härleds från nodens ID och förblir stabil även om workflowen byter namn
- Använd en vanlig [Discord-nod](./discord-node.md) endast när en separat webhook-publicering också önskas utöver interaktionsuppföljningen
- En `discordTrigger`-nod räcker vanligtvis; använd **Switch** eller **Condition** nedströms för att dirigera olika interaktionstyper

## Relaterat

- [Discord-nod](./discord-node.md) – Skicka utgående Discord-meddelanden
- [Triggers](../reference/triggers.md) – Översikt över alla workflow-ingångspunkter
- [Third-Party Integrations](../reference/integrations.md) – Konfiguration av Discord-autentiseringsuppgifter
- [Credentials Tab](../tabs/credentials-tab.md) – Lägg till och hantera autentiseringsuppgifter av typen `discord_trigger`
