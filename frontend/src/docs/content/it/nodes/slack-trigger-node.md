# Slack Trigger

Il nodo **Slack Trigger** è un punto di ingresso a zero input che riceve i webhook di Slack Events API e avvia automaticamente un workflow. Gestisce la challenge di verifica dell'URL di Slack e verifica le firme delle richieste tramite un signing secret.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale `slack_trigger` contenente il signing secret |

## Guida alla configurazione

### 1. Creare una credenziale `slack_trigger`

1. Accedere a **Settings → Credentials → New Credential**
2. Selezionare il tipo **Slack Trigger (Signing Secret)**
3. Incollare il **Signing Secret** della propria Slack App:
   - In Slack: **App settings → Basic Information → App Credentials → Signing Secret**
4. Salvare la credenziale

### 2. Aggiungere il nodo al workflow

1. Aprire il canvas del workflow
2. Trascinare **Slack Trigger** dal pannello dei nodi sul canvas
3. Fare clic sul nodo per aprire il pannello delle proprietà
4. Selezionare la credenziale `slack_trigger`
5. Copiare il **Webhook URL** mostrato nel pannello

### 3. Configurare la Slack App

1. Nelle impostazioni della Slack App, accedere a **Event Subscriptions**
2. Attivare **Enable Events**
3. Incollare il Webhook URL nel campo **Request URL**
4. Slack invia una challenge di verifica dell'URL — Heym risponde automaticamente in pochi millisecondi
5. Il campo diventa verde: ✓ Verified
6. Sottoscrivere i **Bot Events** necessari (ad es. `message.channels`, `reaction_added`)
7. Salvare le modifiche e reinstallare l'app nel workspace se richiesto

## Campi di output

Dopo l'attivazione del nodo, i nodi a valle possono accedere a:

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.event` | Oggetto completo dell'evento Slack |
| `$nodeLabel.event.type` | Tipo di evento (ad es. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Testo del messaggio (quando applicabile) |
| `$nodeLabel.event.user` | ID utente Slack che ha generato l'evento |
| `$nodeLabel.event.channel` | ID del canale |
| `$nodeLabel.event.ts` | Timestamp dell'evento |
| `$nodeLabel.headers` | Header HTTP sanitizzati provenienti da Slack |
| `$nodeLabel.triggered_by` | Etichetta dell'origine del Trigger (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID del nodo sul canvas che ha ricevuto l'evento Slack |

## Workflow di esempio

**Messaggio Slack → risposta LLM → invio Slack:**

```
slackTrigger → llm → slack
```

- Etichetta **slackTrigger**: `slackEvent`
- Messaggio utente **LLM**: `"Reply to this Slack message: $slackEvent.event.text"`
- Messaggio **Slack**: `$llm.text`

## Sicurezza

- Le richieste vengono verificate tramite **HMAC-SHA256** con il signing secret
- I timestamp più vecchi di **5 minuti** vengono rifiutati (prevenzione degli attacchi di replay)
- Gli header sensibili (`x-slack-signature`, `authorization`, ecc.) vengono rimossi prima di raggiungere i nodi a valle
- Se non è impostata alcuna credenziale, il nodo viene eseguito senza verifica — opzione consigliata solo per test locali

## Note

- Heym risponde immediatamente con `200 OK` ed esegue il workflow in background — ciò soddisfa il requisito di risposta entro 3 secondi di Slack
- Il webhook URL deriva dall'ID del nodo e non cambia mai, nemmeno dopo la rinomina del workflow
- È sufficiente un solo nodo `slackTrigger` per workflow; utilizzare i nodi **Switch** o **Condition** a valle per instradare i diversi tipi di evento