# Slack Trigger

**Slack Trigger**-noden är en ingångspunkt utan indata som tar emot webhooks från Slack Events API och startar en workflow automatiskt. Den hanterar Slacks URL-verifieringsutmaning och verifierar förfrågningars signaturer med en signing secret.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 0 |
| Utdata | 1 |
| Utdata | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | `slack_trigger`-autentiseringsuppgift som innehåller signing secret |

## Konfigurationsguide

### 1. Skapa en `slack_trigger`-autentiseringsuppgift

1. Gå till **Settings → Credentials → New Credential**
2. Välj typen **Slack Trigger (Signing Secret)**
3. Klistra in **Signing Secret** från Slack-appen:
   - I Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Spara autentiseringsuppgiften

### 2. Lägg till noden i ett workflow

1. Öppna workflowens canvas
2. Dra **Slack Trigger** från nodpanelen till canvas
3. Klicka på noden för att öppna panelen Properties
4. Välj konfigurerad `slack_trigger`-autentiseringsuppgift
5. Kopiera **Webhook URL** som visas i panelen

### 3. Konfigurera Slack-appen

1. Gå till **Event Subscriptions** i Slack-appens inställningar
2. Aktivera **Enable Events**
3. Klistra in Webhook URL i fältet **Request URL**
4. Slack skickar en URL-verifieringsutmaning — Heym svarar automatiskt inom millisekunder
5. Fältet blir grönt: ✓ Verified
6. Prenumerera på de **Bot Events** som behövs (t.ex. `message.channels`, `reaction_added`)
7. Spara ändringarna och installera om appen i arbetsytan om en uppmaning visas

## Utdatafält

Efter att noden har triggats kan efterföljande noder komma åt:

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.event` | Fullständigt Slack-eventobjekt |
| `$nodeLabel.event.type` | Eventtyp (t.ex. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Meddelandetext (när tillämpligt) |
| `$nodeLabel.event.user` | Slack-användar-ID som triggade eventet |
| `$nodeLabel.event.channel` | Kanal-ID |
| `$nodeLabel.event.ts` | Eventets tidsstämpel |
| `$nodeLabel.headers` | Sanerade HTTP-headers från Slack |
| `$nodeLabel.triggered_by` | Etikett för triggerkälla (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | Canvas-nodens ID som tog emot Slack-eventet |

## Exempel på workflow

**Slack-meddelande → LLM-svar → Slack skicka:**

```
slackTrigger → llm → slack
```

- **slackTrigger**-etikett: `slackEvent`
- **LLM** användarmeddelande: `"Reply to this Slack message: $slackEvent.event.text"`
- **Slack** meddelande: `$llm.text`

## Säkerhet

- Förfrågningar verifieras med **HMAC-SHA256** med tillhörande signing secret
- Tidsstämplar äldre än **5 minuter** avvisas (skydd mot replay-attacker)
- Känsliga headers (`x-slack-signature`, `authorization` etc.) tas bort innan de når efterföljande noder
- Om ingen autentiseringsuppgift är angiven körs noden utan verifiering — rekommenderas endast för lokal testning

## Anteckningar

- Heym svarar med `200 OK` omedelbart och kör workflowen i bakgrunden — detta uppfyller Slacks krav på svar inom 3 sekunder
- Webhook URL härleds från nodens ID och ändras aldrig, inte ens efter att workflowen byter namn
- Endast en `slackTrigger`-nod per workflow behövs; använd **Switch**- eller **Condition**-noder nedströms för att dirigera olika eventtyper
