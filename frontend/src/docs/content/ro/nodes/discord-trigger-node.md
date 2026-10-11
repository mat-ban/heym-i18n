# Discord Trigger

Nodul **Discord Trigger** este un punct de intrare fără intrări care primește webhook-uri Discord Interactions API și pornește automat un workflow. Utilizați-l pentru slash commands, butoane, modale și alte interacțiuni ale aplicației Discord care ar trebui să curgă către nodurile downstream de AI sau de integrare.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 0 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditarea `discord_trigger` care conține cheia publică a aplicației Discord |

## Ghid de configurare

### 1. Creați o acreditare `discord_trigger`

1. Accesați **Settings → Credentials → New Credential**
2. Selectați tipul **Discord Trigger (Public Key)**
3. Lipiți **Application Public Key** din Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Salvați acreditarea

### 2. Adăugați nodul în workflow-ul dvs.

1. Trageți **Discord Trigger** pe canvas
2. Selectați nodul pentru a deschide panoul Properties
3. Alegeți acreditarea `discord_trigger`
4. Copiați **Interactions URL** afișat în panoul nodului

### 3. Înregistrați endpoint-ul Interactions în Discord

1. Deschideți [Discord Developer Portal](https://discord.com/developers/applications)
2. Selectați aplicația dvs.
3. Accesați **General Information** sau **Interactions**
4. Lipiți **Interactions Endpoint URL** al nodului în câmpul pentru endpoint
5. Discord trimite o cerere `PING` pentru a valida endpoint-ul, iar Heym răspunde automat după verificarea semnăturii
6. Salvați modificările

## Câmpuri de ieșire

După declanșarea nodului, nodurile downstream pot accesa:

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.interaction` | Payload-ul complet al interacțiunii Discord |
| `$nodeLabel.type` | Tipul interacțiunii |
| `$nodeLabel.data` | Payload-ul pentru comandă, buton sau modal |
| `$nodeLabel.data.name` | Numele slash command-ului, atunci când este aplicabil |
| `$nodeLabel.data.options` | Array-ul de opțiuni al slash command-ului |
| `$nodeLabel.headers` | Header-ele webhook sanitizate |
| `$nodeLabel.triggered_by` | Eticheta sursei trigger-ului (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID-ul nodului din canvas care a primit interacțiunea Discord |
| `$nodeLabel.triggered_at` | Timestamp ISO pentru această execuție a workflow-ului |

## Exemplu de workflow

**Discord slash command → LLM → Output**

```
discordTrigger → llm → output
```

- Eticheta **Discord Trigger**: `discordEvent`
- Mesajul utilizatorului pentru **LLM**: `"Reply to this Discord command: $discordEvent.data.name"`
- Mesajul pentru **Output**: `$llm.text`

## Securitate

- Cererile sunt verificate folosind **Ed25519** cu cheia publică a aplicației dvs.
- Timestamp-urile mai vechi de **5 minute** sunt respinse pentru a reduce atacurile de tip replay
- Header-ele sensibile (`x-signature-ed25519`, `authorization` etc.) sunt eliminate înainte ca datele să ajungă la nodurile downstream
- Trigger-ul necesită o acreditare `discord_trigger` validă; cererile sunt respinse dacă acreditarea lipsește sau este invalidă

## Note

- Heym returnează imediat un răspuns Discord amânat, rulează workflow-ul în fundal și publică ieșirea finală a workflow-ului ca follow-up Discord atunci când un nod `Output` produce conținut
- URL-ul interacțiunilor este derivat din ID-ul nodului și rămâne stabil chiar dacă workflow-ul este redenumit
- Utilizați un [Discord Node](./discord-node.md) obișnuit doar atunci când doriți și un webhook post separat, în plus față de follow-up-ul interacțiunii
- Un singur nod `discordTrigger` este de obicei suficient; utilizați **Switch** sau **Condition** downstream pentru a direcționa diferite tipuri de interacțiuni

## Resurse conexe

- [Discord Node](./discord-node.md) – Trimiteți mesaje Discord către exterior
- [Triggers](../reference/triggers.md) – Prezentare generală a tuturor punctelor de intrare ale workflow-ului
- [Third-Party Integrations](../reference/integrations.md) – Configurarea acreditării Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Adăugați și gestionați acreditările `discord_trigger`
