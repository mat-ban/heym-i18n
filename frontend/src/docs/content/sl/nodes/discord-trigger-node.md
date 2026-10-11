# Discord Trigger

**Discord Trigger** vozlišče je vhodno za prejemanje webhookov iz Discord Interactions API in samodejno zažene workflow. Uporabite ga za ukaze z obrezom, gumbe, modale in druge interakcije aplikacij Discord, ki naj se usmerijo v spodnje AI ali integracijska vozlišča.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 0 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | `discord_trigger` poverilnica, ki vsebuje javni ključ aplikacije Discord |

## Navodila za nastavitev

### 1. Ustvarite `discord_trigger` Poverilnico

1. Pojdite na **Nastavitve → Poverilnice → Nova poverilnica**
2. Izberite tip **Discord Trigger (Javni ključ)**
3. Prilepite **Javni ključ aplikacije** iz Discord Developer Portala:
   - **Vaša aplikacija → Splošne informacije → Javni ključ**
4. Shranite poverilnico

### 2. Dodajte Vozlišče v Vaš Workflow

1. Povlecite **Discord Trigger** na platno
2. Izberite vozlišče, da odprete ploščo lastnosti
3. Izberite svojo `discord_trigger` poverilnico
4. Kopirajte **URL za interakcije**, prikazan v plošči vozlišča

### 3. Registrirajte Interakcijski Endpoint v Discordu

1. Odprite [Discord Developer Portal](https://discord.com/developers/applications)
2. Izberite svojo aplikacijo
3. Pojdite na **Splošne informacije** ali **Interakcije**
4. Prilepite **URL za interakcijski endpoint** vozlišča v polje endpoint
5. Discord pošlje zahtevo `PING`, da preveri endpoint, in Heym samodejno odgovori po preverjanju podpisa
6. Shranite svoje spremembe

## Izhodne Polja

Po aktivaciji vozlišča lahko spodnja vozlišča dostopajo do:

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.interaction` | Celoten payload interakcije Discord |
| `$nodeLabel.type` | Tip interakcije |
| `$nodeLabel.data` | Payload ukaza, gumba ali modala |
| `$nodeLabel.data.name` | Ime ukaza z obrezom, kadar je primerno |
| `$nodeLabel.data.options` | Množica možnosti ukaza z obrezom |
| `$nodeLabel.headers` | Sanitizirani webhook glave |
| `$nodeLabel.triggered_by` | Oznaka vira sprožitve (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID vozlišča na platnu, ki je prejel interakcijo Discord |
| `$nodeLabel.triggered_at` | ISO časovna oznaka za to izvajanje workflow |

## Primer Workflow

**Discord ukaz z obrezom → LLM → Izhod**

```
discordTrigger → llm → output
```

- **Discord Trigger** oznaka: `discordEvent`
- **LLM** uporabniška sporočila: `"Odgovori na ta Discord ukaz: $discordEvent.data.name"`
- **Izhod** sporočilo: `$llm.text`

## Varnost

- Zahteve so preverjene z uporabo **Ed25519** z javnim ključem vaše aplikacije
- Časovne oznake starejše od **5 minut** so zavrnjene, da se zmanjša tveganje ponovnih napadov
- Občutljive glave (`x-signature-ed25519`, `authorization`, itd.) so odstranjene, preden podatki dosežejo spodnja vozlišča
- Sprožitev zahteva veljavno `discord_trigger` poverilnico; zahteve so zavrnjene, če je poverilnica manjkajoča ali neveljavna

## Opombe

- Heym takoj vrne odloženi odgovor Discord, izvaja workflow v ozadju in objavi končni izhod workflow kot sledenje Discord, ko vozlišče `Output` ustvari vsebino
- URL za interakcije je izpeljan iz ID-ja vozlišča in ostaja stabilen, tudi če se workflow preimenuje
- Uporabite običajno [Discord vozlišče](./discord-node.md) le, če želite tudi ločeno objavo webhooka poleg sledenja interakcijam
- Običajno je eno `discordTrigger` vozlišče dovolj; uporabite **Switch** ali **Condition** spodaj, da usmerite različne tipe interakcij

## Sorodno

- [Discord vozlišče](./discord-node.md) – Pošljite odhodna sporočila Discord
- [Sprožitve](../reference/triggers.md) – Pregled vseh vhodnih točk workflow
- [Integracije tretjih oseb](../reference/integrations.md) – Nastavitev poverilnice Discord
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajte in upravljajte `discord_trigger` poverilnice
