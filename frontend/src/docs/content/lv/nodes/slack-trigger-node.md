# Slack Trigger

**Slack Trigger** mezgls ir ieejas punkts bez ievades, kas saņem Slack Events API webhook un automātiski palaiž workflow. Tas apstrādā Slack URL verifikācijas izaicinājumu un pārbauda pieprasījuma parakstus ar signing secret.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 0 |
| Izvades | 1 |
| Izvade | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | `slack_trigger` akreditācijas dati, kas satur signing secret |

## Iestatīšanas pamācība

### 1. Izveidojiet `slack_trigger` akreditācijas datus

1. Dodieties uz **Settings → Credentials → New Credential**
2. Izvēlieties tipu **Slack Trigger (Signing Secret)**
3. Ielīmējiet **Signing Secret** no sava Slack App:
   - Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Saglabājiet akreditācijas datus

### 2. Pievienojiet mezglu savam workflow

1. Atveriet workflow kanvu
2. Velciet **Slack Trigger** no mezglu paneļa uz kanvu
3. Noklikšķiniet uz mezgla, lai atvērtu Properties paneli
4. Izvēlieties savus `slack_trigger` akreditācijas datus
5. Nokopējiet panelī redzamo **Webhook URL**

### 3. Konfigurējiet savu Slack App

1. Slack App iestatījumos dodieties uz **Event Subscriptions**
2. Ieslēdziet **Enable Events**
3. Ielīmējiet Webhook URL laukā **Request URL**
4. Slack nosūta URL verifikācijas izaicinājumu — Heym atbild automātiski dažu milisekšu laikā
5. Lauks kļūst zaļš: ✓ Verified
6. Abonējiet nepieciešamos **Bot Events** (piem., `message.channels`, `reaction_added`)
7. Saglabājiet izmaiņas un, ja tiek pieprasīts, pārinstalējiet lietotni savā workspace

## Izvades lauki

Pēc tam, kad mezgls tiek aktivizēts, lejupstraumes mezgli var piekļūt:

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.event` | Pilns Slack event objekts |
| `$nodeLabel.event.type` | Notikuma tips (piem., `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Ziņas teksts (ja attiecināms) |
| `$nodeLabel.event.user` | Slack lietotāja ID, kas aktivizēja notikumu |
| `$nodeLabel.event.channel` | Kanāla ID |
| `$nodeLabel.event.ts` | Notikuma laikspiedols |
| `$nodeLabel.headers` | Sanitizēti HTTP headers no Slack |
| `$nodeLabel.triggered_by` | Trigger avota apzīmējums (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | Kanvas mezgla ID, kas saņēma Slack notikumu |

## Workflow piemērs

**Slack ziņa → LLM atbilde → Slack nosūtīšana:**

```
slackTrigger → llm → slack
```

- **slackTrigger** apzīmējums: `slackEvent`
- **LLM** lietotāja ziņa: `"Reply to this Slack message: $slackEvent.event.text"`
- **Slack** ziņa: `$llm.text`

## Drošība

- Pieprasījumi tiek verificēti, izmantojot **HMAC-SHA256** ar jūsu signing secret
- Laikspiedoli, kas vecāki par **5 minūtēm**, tiek noraidīti (atkārtošanas uzbrukuma novēršana)
- Sensitīvie headers (`x-slack-signature`, `authorization` utt.) tiek noņemti pirms tie nonāk lejupstraumes mezglos
- Ja akreditācijas dati nav iestatīti, mezgls darbojas bez verifikācijas — ieteicams tikai lokālai testēšanai

## Piezīmes

- Heym nekavējoties atbild ar `200 OK` un palaiž workflow fonā — tas apmierina Slack 3 sekunžu atbildes prasību
- Webhook URL tiek atvasināts no mezgla ID un nekad nemainās, pat pēc workflow pārdēvēšanas
- Vienā workflow ir nepieciešams tikai viens `slackTrigger` mezgls; izmantojiet **Switch** vai **Condition** mezglus lejupstraumē, lai maršrutētu dažādus notikumu tipus
