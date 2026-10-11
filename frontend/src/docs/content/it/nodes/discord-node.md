# Discord

Il nodo **Discord** invia un messaggio a un canale Discord tramite un Incoming Webhook. Lo si utilizzi per avvisi, notifiche di workflow, risposte di tipo bot e segnalazione di errori.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 1 |
| Output | 1 |
| Output | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale `discord` contenente l'URL del webhook in ingresso |
| `message` | expression | Testo del messaggio in uscita. Supporta le [espressioni](../reference/expression-dsl.md). |
| `username` | expression | Nome visualizzato alternativo opzionale per questo messaggio |
| `avatarUrl` | expression | URL dell'avatar alternativo opzionale per questo messaggio |

## Configurazione

1. Creare una [credenziale Discord Webhook](../reference/integrations.md#discord)
2. Aggiungere il nodo **Discord** al workflow
3. Selezionare la credenziale
4. Impostare `message` sul testo in uscita o su un modello costruito a partire dai dati a monte
5. Facoltativamente, sovrascrivere il `username` visualizzato e l'`avatarUrl`

## Esempio

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Campi di output

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.status` | Codice di stato HTTP restituito da Discord, solitamente `204` in caso di successo |
| `$nodeLabel.response` | Corpo della risposta grezza restituito dal webhook Discord |
| `$nodeLabel.message` | Testo del messaggio inviato da Heym |
| `$nodeLabel.username` | Username inviato con il webhook, se fornito |
| `$nodeLabel.avatar_url` | URL dell'avatar inviato con il webhook, se fornito |

## Pattern comuni

- Utilizzarlo insieme al [Discord Trigger](./discord-trigger-node.md) quando si desidera pubblicare un ulteriore messaggio nel canale oltre alla risposta all'interazione
- Inviare notifiche di errore dal [Error Handler](./error-handler-node.md)
- Pubblicare riepiloghi generati da [LLM](./llm-node.md) o [Agent](./agent-node.md)

## Sicurezza in uscita

- L'URL del webhook memorizzato nella credenziale deve utilizzare `http://` o `https://` e risolversi esclusivamente verso indirizzi pubblici. Le destinazioni loopback, private, link-local, multicast e cloud-metadata sono bloccate.
- Heym convalida gli indirizzi risolti e fissa la destinazione della connessione prima dell'invio, affinché una risposta DNS non possa spostare la richiesta su un indirizzo interno dopo il controllo. I proxy di ambiente sono disabilitati mentre la protezione è attiva e i redirect non vengono seguiti.
- Le installazioni che pubblicano verso un ricevitore webhook interno possono impostare `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` su un'istanza self-hosted attendibile. Mantenere il valore predefinito sulle installazioni hosted o multi-tenant.

**Nota di aggiornamento per la v0.0.109:** questo controllo è nuovo per Discord. Una credenziale il cui URL del webhook punta a loopback o a un indirizzo privato viene rifiutata, a meno che l'impostazione sopra indicata non sia abilitata.

## Correlati

- [Discord Trigger](./discord-trigger-node.md) – Avvia un workflow dalle interazioni Discord in ingresso
- [Third-Party Integrations](../reference/integrations.md) – Configurazione della credenziale Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Aggiungere e gestire le credenziali `discord`
- [Node Types](../reference/node-types.md) – Panoramica di tutti i tipi di nodo