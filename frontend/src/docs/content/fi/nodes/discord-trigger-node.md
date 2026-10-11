# Discord Trigger

**Discord Trigger** -solmu on nollasyötteinen käynnistyspiste, joka vastaanottaa Discord Interactions API -webhookkeja ja käynnistää workflown automaattisesti. Käytä sitä slash-komennoille, painikkeille, modaaleille ja muille Discord-sovelluksen interaktioille, jotka halutaan ohjata eteenpäin tekoäly- tai integraatiosolmuihin.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 0 |
| Tulosteet | 1 |
| Tuloste | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | `discord_trigger` -tunnistetiedot, jotka sisältävät Discord-sovelluksen julkisen avaimen |

## Asennusopas

### 1. Luo `discord_trigger` -tunnistetiedot

1. Siirry kohtaan **Asetukset → Tunnistetiedot → Uudet tunnistetiedot**
2. Valitse tyyppi **Discord Trigger (Public Key)**
3. Liitä **Application Public Key** Discord Developer Portalista:
   - **Your application → General Information → Public Key**
4. Tallenna tunnistetiedot

### 2. Lisää solmu workflowhin

1. Vedä **Discord Trigger** -solmu canvasille
2. Avaa solmun ominaisuudet valitsemalla se
3. Valitse `discord_trigger` -tunnistetiedot
4. Kopioi solmun paneelissa näkyvä **Interactions URL**

### 3. Rekisteröi interactions-endpoint Discordissa

1. Avaa [Discord Developer Portal](https://discord.com/developers/applications)
2. Valitse sovelluksesi
3. Siirry kohtaan **General Information** tai **Interactions**
4. Liitä solmun **Interactions Endpoint URL** endpoint-kenttään
5. Discord lähettää `PING`-pyynnön endpointin vahvistamiseksi, ja Heym vastaa automaattisesti allekirjoituksen tarkistamisen jälkeen
6. Tallenna muutokset

## Tulostekentät

Kun solmu on käynnistynyt, alemmat solmut voivat käyttää seuraavia kenttiä:

| Lauseke | Kuvaus |
|------------|-------------|
| `$nodeLabel.interaction` | Koko Discord-interaktion payload |
| `$nodeLabel.type` | Interaktion tyyppi |
| `$nodeLabel.data` | Komennon, painikkeen tai modaalin payload |
| `$nodeLabel.data.name` | Slash-komennon nimi, kun sovellettavissa |
| `$nodeLabel.data.options` | Slash-komennon vaihtoehtojen taulukko |
| `$nodeLabel.headers` | Siivotut webhook-otsikot |
| `$nodeLabel.triggered_by` | Käynnistyslähteen tunniste (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | Canvas-solmun ID, joka vastaanotti Discord-interaktion |
| `$nodeLabel.triggered_at` | ISO-aikaleima tälle workflow-suoritukselle |

## Esimerkkiworkflow

**Discord slash-komento → LLM → Tuloste**

```
discordTrigger → llm → output
```

- **Discord Trigger** -solmun tunniste: `discordEvent`
- **LLM** -käyttäjäviesti: `"Vastaa tähän Discord-komentoon: $discordEvent.data.name"`
- **Output** -viesti: `$llm.text`

## Turvallisuus

- Pyynnöt vahvistetaan käyttämällä **Ed25519** -algoritmia sovelluksen julkisella avaimella
- Yli **5 minuuttia** vanhat aikaleimat hylätään vähentääkseen uusintahyökkäyksiä
- Arkaluontoiset otsikot (`x-signature-ed25519`, `authorization` jne.) poistetaan ennen kuin data saavuttaa alemmat solmut
- Käynnistin vaatii voimassa olevat `discord_trigger` -tunnistetiedot; pyynnöt hylätään, jos tunnistetiedot puuttuvat tai ovat virheelliset

## Huomiot

- Heym lähettää välittömästi lykätyn Discord-vastauksen, suorittaa workflown taustalla ja julkaisee lopullisen workflow-tulosteen Discord-seurausviestinä, kun `Output` -solmu tuottaa sisältöä
- Interactions-URL on johdettu solmun ID:stä ja pysyy vakiona, vaikka workflown nimeä muutettaisiin
- Käytä säännöllistä [Discord-solmua](./discord-node.md) vain, jos haluat erillisen webhook-viestin lisäksi interaktion seuraukseen
- Yksi `discordTrigger` -solmu on yleensä riittävä; käytä **Switch** - tai **Condition** -solmuja alempana reitittääksesi erityyppisiä interaktioita

## Aiheeseen liittyvät

- [Discord-solmu](./discord-node.md) – Lähetä lähteviä Discord-viestejä
- [Käynnistimet](../reference/triggers.md) – Yleiskatsaus kaikista workflown käynnistyspisteistä
- [Kolmannen osapuolen integraatiot](../reference/integrations.md) – Discord-tunnistetietojen asennus
- [Tunnistetieto-välilehti](../tabs/credentials-tab.md) – Lisää ja hallinnoi `discord_trigger` -tunnistetietoja
