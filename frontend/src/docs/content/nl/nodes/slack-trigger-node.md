# Slack Trigger

De **Slack Trigger**-node is een invoerloos toegangspunt dat Slack Events API-webhooks ontvangt en automatisch een workflow start. De node verwerkt de URL-verificatiechallenge van Slack en verifieert verzoekhandtekeningen met een signing secret.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 0 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | `slack_trigger`-referentie met daarin het signing secret |

## Installatiehandleiding

### 1. Een `slack_trigger`-referentie aanmaken

1. Ga naar **Settings → Credentials → New Credential**
2. Selecteer type **Slack Trigger (Signing Secret)**
3. Plak het **Signing Secret** uit uw Slack App:
   - In Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Sla de referentie op

### 2. De node aan uw workflow toevoegen

1. Open het workflow-canvas
2. Sleep **Slack Trigger** vanuit het node-paneel naar het canvas
3. Klik op de node om het eigenschappenpaneel te openen
4. Selecteer uw `slack_trigger`-referentie
5. Kopieer de **Webhook URL** die in het paneel wordt weergegeven

### 3. Uw Slack App configureren

1. Ga in de instellingen van uw Slack App naar **Event Subscriptions**
2. Schakel **Enable Events** in
3. Plak de Webhook URL in het veld **Request URL**
4. Slack stuurt een URL-verificatiechallenge — Heym reageert automatisch binnen milliseconden
5. Het veld wordt groen: ✓ Verified
6. Abonneer u op de **Bot Events** die u nodig hebt (bijv. `message.channels`, `reaction_added`)
7. Sla uw wijzigingen op en installeer de app opnieuw in uw workspace indien daarom wordt gevraagd

## Uitvoervelden

Nadat de node is geactiveerd, hebben downstream-nodes toegang tot:

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.event` | Volledig Slack-eventobject |
| `$nodeLabel.event.type` | Eventtype (bijv. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Berichttekst (indien van toepassing) |
| `$nodeLabel.event.user` | Slack-gebruikers-ID die het event heeft geactiveerd |
| `$nodeLabel.event.channel` | Kanaal-ID |
| `$nodeLabel.event.ts` | Tijdstempel van het event |
| `$nodeLabel.headers` | Opgeschoonde HTTP-headers van Slack |
| `$nodeLabel.triggered_by` | Label van de triggerbron (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | Canvas-node-ID die het Slack-event heeft ontvangen |

## Voorbeeldworkflow

**Slack-bericht → LLM-antwoord → Slack verzenden:**

```
slackTrigger → llm → slack
```

- **slackTrigger**-label: `slackEvent`
- **LLM**-gebruikersbericht: `"Reply to this Slack message: $slackEvent.event.text"`
- **Slack**-bericht: `$llm.text`

## Beveiliging

- Verzoeken worden geverifieerd met **HMAC-SHA256** met uw signing secret
- Tijdstempels ouder dan **5 minuten** worden geweigerd (preventie van replay-aanvallen)
- Gevoelige headers (`x-slack-signature`, `authorization`, enz.) worden verwijderd voordat ze downstream-nodes bereiken
- Als er geen referentie is ingesteld, wordt de node uitgevoerd zonder verificatie — alleen aanbevolen voor lokaal testen

## Opmerkingen

- Heym reageert onmiddellijk met `200 OK` en voert de workflow op de achtergrond uit — dit voldoet aan de 3-seconden reactievereiste van Slack
- De webhook URL is afgeleid van de node-ID en verandert nooit, zelfs niet na het hernoemen van de workflow
- Slechts één `slackTrigger`-node per workflow is nodig; gebruik downstream **Switch**- of **Condition**-nodes om verschillende eventtypes te routeren
