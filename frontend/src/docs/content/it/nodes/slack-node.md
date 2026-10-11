# Slack

Il nodo **Slack** invia un messaggio a un canale Slack tramite un Incoming Webhook. Lo si utilizzi per notifiche, avvisi e segnalazione di errori.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | Passa attraverso l'input |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale Slack (URL del webhook) da [Credenziali](../tabs/credentials-tab.md) |
| `message` | expression | Testo del messaggio. Supporta le [espressioni](../reference/expression-dsl.md). |

## Configurazione

1. Creare un Incoming Webhook nel proprio workspace Slack
2. Aggiungere una credenziale Slack nella scheda Credenziali con l'URL del webhook
3. Fare riferimento alla credenziale nel nodo

## Esempio

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Da utilizzare con [Error Handler](./error-handler-node.md) per le notifiche di errore:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Sicurezza in uscita

- L'URL del webhook memorizzato nella credenziale deve utilizzare `http://` o `https://` e risolversi esclusivamente verso indirizzi pubblici. Le destinazioni loopback, private, link-local, multicast e cloud-metadata sono bloccate.
- Heym convalida gli indirizzi risolti e fissa la destinazione della connessione prima dell'invio, affinché una risposta DNS non possa spostare la richiesta su un indirizzo interno dopo il controllo. I proxy di ambiente sono disabilitati mentre la protezione è attiva e i redirect non vengono seguiti.
- Le installazioni che inviano a un ricevitore webhook interno possono impostare `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` su un'istanza self-hosted attendibile. Mantenere il valore predefinito sulle installazioni hosted o multi-tenant.

**Nota di aggiornamento per la v0.0.109:** questo controllo è nuovo per Slack. Una credenziale il cui URL del webhook punti a loopback o a un indirizzo privato viene rifiutata, a meno che l'impostazione sopra indicata non sia abilitata.

## Correlati

- [Tipi di nodo](../reference/node-types.md) – Panoramica di tutti i tipi di nodo
- [Error Handler](./error-handler-node.md) – Inviare un messaggio Slack in caso di errore del workflow
- [Scheda Credenziali](../tabs/credentials-tab.md) – Aggiungere un webhook Slack