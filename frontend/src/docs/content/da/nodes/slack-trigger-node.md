# Slack Trigger

**Slack Trigger**-noden er en inputfri entry point, der modtager Slack Events API-webhooks og automatisk starter et workflow. Den håndterer Slack's URL-verificeringsudfordring og verificerer anmodningssignaturer med en signeringshemmelighed.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | `slack_trigger`-legitimationsoplysning, der indeholder signeringshemmeligheden |

## Opsætningsvejledning

### 1. Opret en `slack_trigger`-legitimationsoplysning

1. Gå til **Settings → Credentials → New Credential**
2. Vælg typen **Slack Trigger (Signing Secret)**
3. Indsæt **Signing Secret** fra Slack-appen:
   - I Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Gem legitimationsoplysningen

### 2. Tilføj noden til workflowet

1. Åbn workflow-canvas
2. Træk **Slack Trigger** fra node-panelet over på canvas
3. Klik på noden for at åbne egenskabs-panelet
4. Vælg den `slack_trigger`-legitimationsoplysning, der er oprettet
5. Kopier **Webhook URL**, der vises i panelet

### 3. Konfigurer Slack-appen

1. I Slack-appens indstillinger går man til **Event Subscriptions**
2. Slår **Enable Events** til
3. Indsætter Webhook URL'en i feltet **Request URL**
4. Slack sender en URL-verificeringsudfordring — Heym svarer automatisk inden for millisekunder
5. Feltet bliver grønt: ✓ Verified
6. Abonner på de **Bot Events**, der er nødvendige (f.eks. `message.channels`, `reaction_added`)
7. Gem ændringerne og geninstaller appen til workspace, hvis der bedes om det

## Output-felter

Efter noden er udløst, kan downstream-noder få adgang til:

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.event` | Fuld Slack-event-objekt |
| `$nodeLabel.event.type` | Event-type (f.eks. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Beskedtekst (hvis relevant) |
| `$nodeLabel.event.user` | Slack bruger-ID, der udløste eventet |
| `$nodeLabel.event.channel` | Kanal-ID |
| `$nodeLabel.event.ts` | Event-tidsstempel |
| `$nodeLabel.headers` | Saniterede HTTP-headers fra Slack |
| `$nodeLabel.triggered_by` | Triggerkilde-label (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | Canvas-node-ID, der modtog Slack-eventet |

## Eksempel på workflow

**Slack-besked → LLM-svar → Slack-send:**

```
slackTrigger → llm → slack
```

- **slackTrigger** label: `slackEvent`
- **LLM** brugerbesked: `"Reply to this Slack message: $slackEvent.event.text"`
- **Slack** besked: `$llm.text`

## Sikkerhed

- Anmodninger verificeres ved hjælp af **HMAC-SHA256** med signeringshemmeligheden
- Tidsstempler ældre end **5 minutter** afvises (forebyggelse af replay-angreb)
- Følsomme headers (`x-slack-signature`, `authorization`, osv.) fjernes, før de når downstream-noder
- Hvis der ikke er angivet legitimationsoplysninger, kører noden uden verificering — kun anbefalet til lokal testning

## Bemærkninger

- Heym svarer med `200 OK` med det samme og kører workflowet i baggrunden — dette opfylder Slack's krav om 3-sekunders respons
- Webhook URL'en er afledt af node-ID'et og ændres aldrig, selv efter workflow-omdøbninger
- Kun én `slackTrigger`-node pr. workflow er nødvendig; brug **Switch** eller **Condition**-noder downstream til at dirigere forskellige event-typer
