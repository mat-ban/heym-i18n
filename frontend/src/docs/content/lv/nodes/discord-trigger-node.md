# Discord Trigger

**Discord Trigger** mezgls ir ieejas punkts bez ievades datiem, kas saņem Discord Interactions API webhook pieprasījumus un automātiski palaiž workflow. Izmantojiet to slash komandām, pogām, modāļiem un citām Discord lietotņu mijiedarbībām, kurām jāplūst uz lejupstraumes AI vai integrācijas mezgliem.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 0 |
| Izvades | 1 |
| Izvade | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | `discord_trigger` akreditācijas dati, kas satur Discord lietotnes publisko atslēgu |

## Iestatīšanas pamācība

### 1. Izveidojiet `discord_trigger` akreditācijas datus

1. Dodieties uz **Settings → Credentials → New Credential**
2. Izvēlieties tipu **Discord Trigger (Public Key)**
3. Ielīmējiet **Application Public Key** no Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Saglabājiet akreditācijas datus

### 2. Pievienojiet mezglu savam workflow

1. Velciet **Discord Trigger** uz kanvas
2. Izvēlieties mezglu, lai atvērtu Properties paneli
3. Izvēlieties savus `discord_trigger` akreditācijas datus
4. Nokopējiet mezgla panelī redzamo **Interactions URL**

### 3. Reģistrējiet Interactions endpoint Discord

1. Atveriet [Discord Developer Portal](https://discord.com/developers/applications)
2. Izvēlieties savu lietotni
3. Dodieties uz **General Information** vai **Interactions**
4. Ielīmējiet mezgla **Interactions Endpoint URL** endpoint laukā
5. Discord nosūta `PING` pieprasījumu, lai validētu endpoint, un Heym automātiski atbild pēc paraksta pārbaudes
6. Saglabājiet izmaiņas

## Izvades lauki

Pēc tam, kad mezgls tiek aktivizēts, lejupstraumes mezgli var piekļūt:

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.interaction` | Pilns Discord interaction payload |
| `$nodeLabel.type` | Interaction tips |
| `$nodeLabel.data` | Komandas, pogas vai modāļa payload |
| `$nodeLabel.data.name` | Slash komandas nosaukums, ja piemērojams |
| `$nodeLabel.data.options` | Slash komandas opciju masīvs |
| `$nodeLabel.headers` | Sanitizēti webhook headers |
| `$nodeLabel.triggered_by` | Trigger avota apzīmējums (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | Kanvas mezgla ID, kas saņēma Discord interaction |
| `$nodeLabel.triggered_at` | ISO laika zīmogs šai workflow izpildei |

## Workflow piemērs

**Discord slash komanda → LLM → Izvade**

```
discordTrigger → llm → output
```

- **Discord Trigger** apzīmējums: `discordEvent`
- **LLM** lietotāja ziņa: `"Reply to this Discord command: $discordEvent.data.name"`
- **Output** ziņa: `$llm.text`

## Drošība

- Pieprasījumi tiek verificēti, izmantojot **Ed25519** ar jūsu lietotnes publisko atslēgu
- Laika zīmogi, kas vecāki par **5 minūtēm**, tiek noraidīti, lai mazinātu atkārtošanas uzbrukumus
- Sensitīvie headers (`x-signature-ed25519`, `authorization` utt.) tiek noņemti pirms datu nonākšanas lejupstraumes mezglos
- Trigger prasa derīgus `discord_trigger` akreditācijas datus; pieprasījumi tiek noraidīti, ja akreditācijas dati trūkst vai ir nederīgi

## Piezīmes

- Heym nekavējoties atgriež atliktu Discord atbildi, palaiž workflow fonā un publicē galīgo workflow izvadi kā Discord papildu ziņu, kad `Output` mezgls ģenerē saturu
- Interactions URL tiek atvasināts no mezgla ID un paliek nemainīgs pat tad, ja workflow tiek pārdēvēts
- Izmantojiet parasto [Discord Node](./discord-node.md) tikai tad, ja papildus interaction papildu ziņai vēlaties arī atsevišķu webhook publikāciju
- Viens `discordTrigger` mezgls parasti ir pietiekams; izmantojiet **Switch** vai **Condition** lejupstraumē, lai maršrutētu dažādus interaction tipus

## Saistītie

- [Discord Node](./discord-node.md) – Sūtīt izejošās Discord ziņas
- [Triggers](../reference/triggers.md) – Visu workflow ieejas punktu pārskats
- [Third-Party Integrations](../reference/integrations.md) – Discord akreditācijas datu iestatīšana
- [Credentials Tab](../tabs/credentials-tab.md) – Pievienot un pārvaldīt `discord_trigger` akreditācijas datus
