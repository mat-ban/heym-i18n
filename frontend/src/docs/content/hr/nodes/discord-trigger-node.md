# Discord Trigger

**Discord Trigger** čvor je ulazna točka bez ulaznih podataka koja prima Discord Interactions API webhookove i automatski pokreće workflow. Koristite ga za slash naredbe, gumbe, modale i druge interakcije Discord aplikacije koje trebaju ići u nizvodne AI ili integracijske čvorove.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 0 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | `discord_trigger` vjerodajnica koja sadrži javni ključ Discord aplikacije |

## Vodič za postavljanje

### 1. Izradite `discord_trigger` vjerodajnicu

1. Idite na **Settings → Credentials → New Credential**
2. Odaberite tip **Discord Trigger (Public Key)**
3. Zalijepite **Application Public Key** iz Discord Developer Portala:
   - **Your application → General Information → Public Key**
4. Spremite vjerodajnicu

### 2. Dodajte čvor u svoj workflow

1. Povucite **Discord Trigger** na platno
2. Odaberite čvor da biste otvorili ploču Properties
3. Odaberite svoju `discord_trigger` vjerodajnicu
4. Kopirajte **Interactions URL** prikazan na ploči čvora

### 3. Registrirajte Interactions Endpoint u Discordu

1. Otvorite [Discord Developer Portal](https://discord.com/developers/applications)
2. Odaberite svoju aplikaciju
3. Idite na **General Information** ili **Interactions**
4. Zalijepite **Interactions Endpoint URL** čvora u polje endpointa
5. Discord šalje `PING` zahtjev za validaciju endpointa, a Heym automatski odgovara nakon provjere potpisa
6. Spremite promjene

## Izlazna polja

Nakon što se čvor pokrene, nizvodni čvorovi mogu pristupiti:

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.interaction` | Potpuni Discord interaction payload |
| `$nodeLabel.type` | Tip interakcije |
| `$nodeLabel.data` | Payload naredbe, gumba ili modala |
| `$nodeLabel.data.name` | Naziv slash naredbe, kada je primjenjivo |
| `$nodeLabel.data.options` | Polje opcija slash naredbe |
| `$nodeLabel.headers` | Sanitizirani webhook headers |
| `$nodeLabel.triggered_by` | Oznaka izvora triggera (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID čvora na platnu koji je primio Discord interakciju |
| `$nodeLabel.triggered_at` | ISO vremenska oznaka za ovo izvršavanje workflowa |

## Primjer workflowa

**Discord slash naredba → LLM → Output**

```
discordTrigger → llm → output
```

- **Discord Trigger** oznaka: `discordEvent`
- **LLM** korisnička poruka: `"Reply to this Discord command: $discordEvent.data.name"`
- **Output** poruka: `$llm.text`

## Sigurnost

- Zahtjevi se verificiraju pomoću **Ed25519** s javnim ključem vaše aplikacije
- Vremenske oznake starije od **5 minuta** se odbijaju kako bi se smanjili napadi ponavljanja
- Osjetljivi headers (`x-signature-ed25519`, `authorization` itd.) uklanjaju se prije nego podaci dođu do nizvodnih čvorova
- Trigger zahtijeva valjanu `discord_trigger` vjerodajnicu; zahtjevi se odbijaju ako vjerodajnica nedostaje ili je nevaljana

## Napomene

- Heym odmah vraća odgođeni Discord odgovor, pokreće workflow u pozadini i objavljuje konačni izlaz workflowa kao Discord follow-up kada `Output` čvor proizvede sadržaj
- Interactions URL izvodi se iz ID-a čvora i ostaje stabilan čak i ako se workflow preimenuje
- Koristite obični [Discord Node](./discord-node.md) samo kada želite i zaseban webhook post uz interaction follow-up
- Jedan `discordTrigger` čvor obično je dovoljan; koristite **Switch** ili **Condition** nizvodno za usmjeravanje različitih tipova interakcija

## Povezano

- [Discord Node](./discord-node.md) – Slanje odlaznih Discord poruka
- [Triggers](../reference/triggers.md) – Pregled svih ulaznih točaka workflowa
- [Third-Party Integrations](../reference/integrations.md) – Postavljanje Discord vjerodajnica
- [Credentials Tab](../tabs/credentials-tab.md) – Dodavanje i upravljanje `discord_trigger` vjerodajnicama
