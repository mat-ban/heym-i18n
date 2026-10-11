# Discord Trigger

**Discord Trigger** node on null-sisendiga sisendpunkt, mis võtab vastu Discord Interactions API webhookid ja käivitab workflow automaatselt. Kasutage seda slash-käskude, nuppude, modaalide ja muude Discordi rakenduse interaktsioonide jaoks, mis peaksid liikuma edasi AI- või integratsioonisõlmedesse.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 0 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | `discord_trigger` mandaat, mis sisaldab Discordi rakenduse avalikku võtit |

## Seadistusjuhend

### 1. Looge `discord_trigger` mandaat

1. Minge jaotisse **Settings → Credentials → New Credential**
2. Valige tüübiks **Discord Trigger (Public Key)**
3. Kleepige **Application Public Key** Discord Developer Portalist:
   - **Your application → General Information → Public Key**
4. Salvestage mandaat

### 2. Lisage node oma workflow'sse

1. Lohistage **Discord Trigger** lõuendile
2. Valige node, et avada Properties-paneel
3. Valige oma `discord_trigger` mandaat
4. Kopeerige node'i paneelil kuvatav **Interactions URL**

### 3. Registreerige Interactions Endpoint Discordis

1. Avage [Discord Developer Portal](https://discord.com/developers/applications)
2. Valige oma rakendus
3. Minge jaotisse **General Information** või **Interactions**
4. Kleepige node'i **Interactions Endpoint URL** endpoint'i väljale
5. Discord saadab `PING` päringu, et endpoint'i valideerida, ja Heym vastab automaatselt pärast allkirja kontrollimist
6. Salvestage muudatused

## Väljundväljad

Pärast node'i käivitumist saavad järgnevad sõlmed juurde pääseda järgmisele:

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.interaction` | Täielik Discordi interaktsiooni payload |
| `$nodeLabel.type` | Interaktsiooni tüüp |
| `$nodeLabel.data` | Käsu, nupu või modaali payload |
| `$nodeLabel.data.name` | Slash-käsu nimi, kui see on kohaldatav |
| `$nodeLabel.data.options` | Slash-käsu valikute massiiv |
| `$nodeLabel.headers` | Puhastatud webhook päised |
| `$nodeLabel.triggered_by` | Triggeri allika silt (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | Lõuendi node'i ID, mis võttis Discordi interaktsiooni vastu |
| `$nodeLabel.triggered_at` | Selle workflow käivituse ISO ajatempel |

## Näidis-workflow

**Discordi slash-käsk → LLM → Väljund**

```
discordTrigger → llm → output
```

- **Discord Trigger** silt: `discordEvent`
- **LLM** kasutaja sõnum: `"Reply to this Discord command: $discordEvent.data.name"`
- **Output** sõnum: `$llm.text`

## Turvalisus

- Päringud valideeritakse **Ed25519** abil teie rakenduse avaliku võtmega
- Ajatemplid, mis on vanemad kui **5 minutit**, lükatakse tagasi, et vähendada korduskatseid
- Tundlikud päised (`x-signature-ed25519`, `authorization` jne) eemaldatakse enne, kui andmed jõuavad järgnevatesse sõlmedesse
- Trigger nõuab kehtivat `discord_trigger` mandaati; päringud lükatakse tagasi, kui mandaat puudub või on kehtetu

## Märkused

- Heym tagastab kohe edasilükatud Discordi vastuse, käivitab workflow taustal ja postitab workflow lõpliku väljundi Discordi järelvastusena, kui `Output` node toodab sisu
- Interaktsioonide URL tuletatakse node'i ID-st ja püsib muutumatuna ka siis, kui workflow ümber nimetatakse
- Kasutage tavalist [Discord Node](./discord-node.md) ainult siis, kui soovite lisaks interaktsiooni järelvastusele ka eraldi webhook postitust
- Üks `discordTrigger` node on tavaliselt piisav; kasutage **Switch** või **Condition** järgnevatel tasanditel erinevate interaktsioonitüüpide marsruutimiseks

## Seotud

- [Discord Node](./discord-node.md) – Väljuvate Discordi sõnumite saatmine
- [Triggers](../reference/triggers.md) – Ülevaade kõigist workflow sisendpunktidest
- [Third-Party Integrations](../reference/integrations.md) – Discordi mandaadi seadistamine
- [Credentials Tab](../tabs/credentials-tab.md) – `discord_trigger` mandaatide lisamine ja haldamine
