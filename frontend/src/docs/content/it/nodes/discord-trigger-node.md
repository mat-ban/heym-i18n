# Discord Trigger

Il nodo **Discord Trigger** è un punto di ingresso a zero input che riceve i webhook delle Discord Interactions API e avvia automaticamente un workflow. Utilizzarlo per slash command, pulsanti, modali e altre interazioni dell'applicazione Discord che devono confluire nei nodi AI o di integrazione a valle.

## Panoramica

| Proprietà | Valore |
|----------|-------|
| Input | 0 |
| Output | 1 |
| Output | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parametro | Tipo | Descrizione |
|-----------|------|-------------|
| `credentialId` | UUID | Credenziale `discord_trigger` contenente la chiave pubblica dell'applicazione Discord |

## Guida alla configurazione

### 1. Creare una credenziale `discord_trigger`

1. Accedere a **Settings → Credentials → New Credential**
2. Selezionare il tipo **Discord Trigger (Public Key)**
3. Incollare la **Application Public Key** dal Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Salvare la credenziale

### 2. Aggiungere il nodo al workflow

1. Trascinare **Discord Trigger** sul canvas
2. Selezionare il nodo per aprire il pannello Properties
3. Scegliere la credenziale `discord_trigger`
4. Copiare l'**Interactions URL** mostrato nel pannello del nodo

### 3. Registrare l'Interactions Endpoint in Discord

1. Aprire il [Discord Developer Portal](https://discord.com/developers/applications)
2. Selezionare l'applicazione
3. Accedere a **General Information** o **Interactions**
4. Incollare l'**Interactions Endpoint URL** del nodo nel campo endpoint
5. Discord invia una richiesta `PING` per convalidare l'endpoint e Heym risponde automaticamente dopo aver verificato la firma
6. Salvare le modifiche

## Campi di output

Dopo l'attivazione del nodo, i nodi a valle possono accedere a:

| Espressione | Descrizione |
|------------|-------------|
| `$nodeLabel.interaction` | Payload completo dell'interazione Discord |
| `$nodeLabel.type` | Tipo di interazione |
| `$nodeLabel.data` | Payload del comando, del pulsante o del modale |
| `$nodeLabel.data.name` | Nome dello slash command, ove applicabile |
| `$nodeLabel.data.options` | Array delle opzioni dello slash command |
| `$nodeLabel.headers` | Header del webhook sanitizzati |
| `$nodeLabel.triggered_by` | Etichetta dell'origine del Trigger (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID del nodo sul canvas che ha ricevuto l'interazione Discord |
| `$nodeLabel.triggered_at` | Timestamp ISO per questa esecuzione del workflow |

## Workflow di esempio

**Discord slash command → LLM → Output**

```
discordTrigger → llm → output
```

- Etichetta **Discord Trigger**: `discordEvent`
- Messaggio utente **LLM**: `"Reply to this Discord command: $discordEvent.data.name"`
- Messaggio **Output**: `$llm.text`

## Sicurezza

- Le richieste vengono verificate tramite **Ed25519** con la chiave pubblica dell'applicazione
- I timestamp più vecchi di **5 minuti** vengono rifiutati per ridurre gli attacchi di replay
- Gli header sensibili (`x-signature-ed25519`, `authorization`, ecc.) vengono rimossi prima che i dati raggiungano i nodi a valle
- Il Trigger richiede una credenziale `discord_trigger` valida; le richieste vengono rifiutate se la credenziale è assente o non valida

## Note

- Heym restituisce immediatamente una risposta Discord differita, esegue il workflow in background e pubblica l'output finale del workflow come follow-up Discord quando un nodo `Output` produce contenuto
- L'interactions URL è derivata dall'ID del nodo e rimane stabile anche se il workflow viene rinominato
- Utilizzare un normale [Discord Node](./discord-node.md) solo quando si desidera anche un post webhook separato in aggiunta al follow-up dell'interazione
- Un solo nodo `discordTrigger` è di norma sufficiente; utilizzare **Switch** o **Condition** a valle per instradare i diversi tipi di interazione

## Correlati

- [Discord Node](./discord-node.md) – Inviare messaggi Discord in uscita
- [Triggers](../reference/triggers.md) – Panoramica di tutti i punti di ingresso del workflow
- [Third-Party Integrations](../reference/integrations.md) – Configurazione delle credenziali Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Aggiungere e gestire le credenziali `discord_trigger`