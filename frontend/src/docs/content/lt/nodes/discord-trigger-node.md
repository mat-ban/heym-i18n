# Discord Trigger

**Discord Trigger** mazgas yra nulinio įvesties įėjimo taškas, kuris gauna Discord Interactions API webhook'us ir automatiškai pradeda workflow. Naudokite jį slash komandoms, mygtukams, modalams ir kitiems Discord programos sąveikoms, kurios turėtų tekėti į žemyn esančius AI arba integracijos mazgus.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 0 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | `discord_trigger` kredencialas, turintis Discord programos viešąjį raktą |

## Nustatymo Gidas

### 1. Sukurkite `discord_trigger` Kredencialą

1. Eikite į **Nustatymai → Kredencialai → Naujas Kredencialas**
2. Pasirinkite tipą **Discord Trigger (Viešasis raktas)**
3. Įklijuokite **Programos viešąjį raktą** iš Discord Developer Portal:
   - **Jūsų programa → Bendroji informacija → Viešasis raktas**
4. Išsaugokite kredencialą

### 2. Pridėkite Mazgą prie Savo Workflow

1. Vilkite **Discord Trigger** ant drobės
2. Pasirinkite mazgą, kad atidarytumėte Ypatybių panelę
3. Pasirinkite savo `discord_trigger` kredencialą
4. Nukopijuokite **Interactions URL**, rodomą mazgo panelėje

### 3. Registruokite Interactions Endpoint Discord

1. Atidarykite [Discord Developer Portal](https://discord.com/developers/applications)
2. Pasirinkite savo programą
3. Eikite į **Bendroji informacija** arba **Interactions**
4. Įklijuokite mazgo **Interactions Endpoint URL** į endpoint lauką
5. Discord siunčia `PING` užklausą, kad patvirtintų endpoint'ą, o Heym automatiškai atsako po parašo patvirtinimo
6. Išsaugokite savo pakeitimus

## Išvesties Laukai

Po to, kai mazgas suveikia, žemyn esantys mazgai gali pasiekti:

| Išraiška | Aprašymas |
|-----------|-----------|
| `$nodeLabel.interaction` | Pilnas Discord sąveikos payload'as |
| `$nodeLabel.type` | Sąveikos tipas |
| `$nodeLabel.data` | Komandos, mygtuko ar modalų payload'as |
| `$nodeLabel.data.name` | Slash komandos pavadinimas, kai taikoma |
| `$nodeLabel.data.options` | Slash komandos parinkčių masyvas |
| `$nodeLabel.headers` | Sanitizuoti webhook antraštės |
| `$nodeLabel.triggered_by` | Suveikimo šaltinio etiketė (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | Drobės mazgo ID, kuris gavo Discord sąveiką |
| `$nodeLabel.triggered_at` | ISO laiko žymė šiam workflow vykdymui |

## Pavyzdinis Workflow

**Discord slash komanda → LLM → Išvestis**

```
discordTrigger → llm → output
```

- **Discord Trigger** etiketė: `discordEvent`
- **LLM** vartotojo žinutė: `"Atsakykite į šią Discord komandą: $discordEvent.data.name"`
- **Išvestis** žinutė: `$llm.text`

## Saugumas

- Užklausos yra patvirtinamos naudojant **Ed25519** su jūsų programos viešuoju raktu
- Laiko žymės, senesnės nei **5 minutės**, yra atmetamos, kad sumažintų pakartotinių atakų riziką
- Jautrios antraštės (`x-signature-ed25519`, `authorization` ir kt.) yra pašalinamos prieš duomenims pasiekiant žemyn esančius mazgus
- Trigger reikalauja galiojančio `discord_trigger` kredencialo; užklausos yra atmetamos, jei kredencialas trūksta arba yra neteisingas

## Pastabos

- Heym iš karto grąžina atidėtą Discord atsakymą, vykdo workflow fone ir paskelbia galutinę workflow išvestį kaip Discord sekantį pranešimą, kai `Output` mazgas generuoja turinį
- Interactions URL yra gautas iš mazgo ID ir išlieka stabilus, net jei workflow pavadinimas yra pakeistas
- Naudokite įprastą [Discord Node](./discord-node.md) tik tada, kai taip pat norite atskiro webhook įrašo be sąveikos sekimo
- Vienas `discordTrigger` mazgas paprastai yra pakankamas; naudokite **Switch** arba **Condition** žemyn, kad nukreiptumėte skirtingų sąveikų tipus

## Susiję

- [Discord Node](./discord-node.md) – Siųsti išorinius Discord pranešimus
- [Triggers](../reference/triggers.md) – Visų workflow įėjimo taškų apžvalga
- [Third-Party Integrations](../reference/integrations.md) – Discord kredencialo nustatymas
- [Credentials Tab](../tabs/credentials-tab.md) – Pridėti ir valdyti `discord_trigger` kredencialus
