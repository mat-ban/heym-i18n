# Discord Trigger

De **Discord Trigger**-node is een invoerloos startpunt dat webhooks van de Discord Interactions API ontvangt en automatisch een workflow start. Gebruik deze voor slash-commando's, knoppen, modals en andere interacties van Discord-applicaties die moeten doorstromen naar downstream AI- of integratienodes.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 0 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | `discord_trigger`-referentie met de publieke sleutel van de Discord-applicatie |

## Installatiehandleiding

### 1. Een `discord_trigger`-referentie aanmaken

1. Ga naar **Settings → Credentials → New Credential**
2. Selecteer type **Discord Trigger (Public Key)**
3. Plak de **Application Public Key** uit de Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Sla de referentie op

### 2. De node toevoegen aan uw workflow

1. Sleep **Discord Trigger** naar het canvas
2. Selecteer de node om het eigenschappenpaneel te openen
3. Kies uw `discord_trigger`-referentie
4. Kopieer de **Interactions URL** die in het nodepaneel wordt weergegeven

### 3. Het Interactions-endpoint registreren in Discord

1. Open de [Discord Developer Portal](https://discord.com/developers/applications)
2. Selecteer uw applicatie
3. Ga naar **General Information** of **Interactions**
4. Plak de **Interactions Endpoint URL** van de node in het endpointveld
5. Discord stuurt een `PING`-verzoek om het endpoint te valideren en Heym reageert automatisch na verificatie van de signature
6. Sla uw wijzigingen op

## Uitvoervelden

Nadat de node is geactiveerd, hebben downstream nodes toegang tot:

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.interaction` | Volledige Discord-interactie-payload |
| `$nodeLabel.type` | Interactietype |
| `$nodeLabel.data` | Payload van commando, knop of modal |
| `$nodeLabel.data.name` | Naam van slash-commando, indien van toepassing |
| `$nodeLabel.data.options` | Array met opties van slash-commando |
| `$nodeLabel.headers` | Opgeschoonde webhook-headers |
| `$nodeLabel.triggered_by` | Label van de triggerbron (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | Canvas-node-ID die de Discord-interactie heeft ontvangen |
| `$nodeLabel.triggered_at` | ISO-tijdstempel voor deze workflow-uitvoering |

## Voorbeeldworkflow

**Discord slash-commando → LLM → Uitvoer**

```
discordTrigger → llm → output
```

- **Discord Trigger**-label: `discordEvent`
- **LLM**-gebruikersbericht: `"Reply to this Discord command: $discordEvent.data.name"`
- **Output**-bericht: `$llm.text`

## Beveiliging

- Verzoeken worden geverifieerd met **Ed25519** met behulp van de publieke sleutel van uw applicatie
- Tijdstempels ouder dan **5 minuten** worden geweigerd om replay-aanvallen te beperken
- Gevoelige headers (`x-signature-ed25519`, `authorization`, enz.) worden verwijderd voordat gegevens downstream nodes bereiken
- De trigger vereist een geldige `discord_trigger`-referentie; verzoeken worden geweigerd als de referentie ontbreekt of ongeldig is

## Opmerkingen

- Heym retourneert onmiddellijk een uitgesteld Discord-antwoord, voert de workflow op de achtergrond uit en plaatst de uiteindelijke workflow-uitvoer als een Discord-follow-up wanneer een `Output`-node inhoud produceert
- De interactions-URL is afgeleid van de node-ID en blijft stabiel, zelfs als de workflow wordt hernoemd
- Gebruik een reguliere [Discord Node](./discord-node.md) alleen wanneer u naast de interactie-follow-up ook een afzonderlijke webhook-post wilt
- Eén `discordTrigger`-node is doorgaans voldoende; gebruik downstream **Switch** of **Condition** om verschillende interactietypen te routeren

## Gerelateerd

- [Discord Node](./discord-node.md) – Uitgaande Discord-berichten verzenden
- [Triggers](../reference/triggers.md) – Overzicht van alle workflow-startpunten
- [Third-Party Integrations](../reference/integrations.md) – Installatie van Discord-referenties
- [Credentials Tab](../tabs/credentials-tab.md) – `discord_trigger`-referenties toevoegen en beheren
