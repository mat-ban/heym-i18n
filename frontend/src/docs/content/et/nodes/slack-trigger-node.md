# Slack Trigger

**Slack Trigger** node on null-sisendiga sisendpunkt, mis võtab vastu Slack Events API webhookid ja käivitab workflow automaatselt. See käsitleb Slacki URL-i verifitseerimise väljakutset ja kontrollib päringu allkirju allkirjastamise saladusega.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 0 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | `slack_trigger` mandaat, mis sisaldab allkirjastamise saladust |

## Seadistamise juhend

### 1. Looge `slack_trigger` mandaat

1. Minge jaotisse **Settings → Credentials → New Credential**
2. Valige tüübiks **Slack Trigger (Signing Secret)**
3. Kleepige oma Slacki rakenduse **Signing Secret**:
   - Slackis: **App settings → Basic Information → App Credentials → Signing Secret**
4. Salvestage mandaat

### 2. Lisage node oma workflow'sse

1. Avage workflow' lõuend
2. Lohistage **Slack Trigger** node paneelilt lõuendile
3. Klõpsake nodel, et avada Properties paneel
4. Valige oma `slack_trigger` mandaat
5. Kopeerige paneelil kuvatav **Webhook URL**

### 3. Konfigureerige oma Slacki rakendust

1. Oma Slacki rakenduse seadetes minge jaotisse **Event Subscriptions**
2. Lülitage **Enable Events** sisse
3. Kleepige Webhook URL väljale **Request URL**
4. Slack saadab URL-i verifitseerimise väljakutse — Heym vastab automaatselt millisekundite jooksul
5. Väli muutub roheliseks: ✓ Verified
6. Tellige **Bot Events**, mida vajate (nt `message.channels`, `reaction_added`)
7. Salvestage muudatused ja vajadusel installige rakendus oma tööruumi uuesti

## Väljundi väljad

Pärast node'i käivitumist saavad järgnevad node'id juurde pääseda:

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.event` | Täielik Slacki sündmuse objekt |
| `$nodeLabel.event.type` | Sündmuse tüüp (nt `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Sõnumi tekst (kui asjakohane) |
| `$nodeLabel.event.user` | Slacki kasutaja ID, kes sündmuse käivitas |
| `$nodeLabel.event.channel` | Kanali ID |
| `$nodeLabel.event.ts` | Sündmuse ajatempel |
| `$nodeLabel.headers` | Slackist pärinevad puhastatud HTTP päised |
| `$nodeLabel.triggered_by` | Triggeri allika silt (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | Lõuendi node ID, mis Slacki sündmuse vastu võttis |

## Näidis-workflow

**Slacki sõnum → LLM vastus → Slacki saatmine:**

```
slackTrigger → llm → slack
```

- **slackTrigger** silt: `slackEvent`
- **LLM** kasutaja sõnum: `"Reply to this Slack message: $slackEvent.event.text"`
- **Slack** sõnum: `$llm.text`

## Turvalisus

- Päringud verifitseeritakse **HMAC-SHA256** abil koos teie allkirjastamise saladusega
- Ajatemplid, mis on vanemad kui **5 minutit**, lükatakse tagasi (kordusrünnaku ennetamine)
- Tundlikud päised (`x-slack-signature`, `authorization` jne) eemaldatakse enne, kui need jõuavad järgnevate node'ideni
- Kui mandaati pole määratud, töötab node ilma verifitseerimiseta — soovitatav ainult kohalikuks testimiseks

## Märkused

- Heym vastab kohe `200 OK`-ga ja käivitab workflow taustal — see rahuldab Slacki 3-sekundilist vastuse nõuet
- Webhook URL tuletatakse node ID-st ja ei muutu kunagi, isegi pärast workflow' ümbernimetamist
- Ühe workflow' kohta on vaja ainult ühte `slackTrigger` node'i; kasutage **Switch** või **Condition** node'e allavoolu erinevate sündmustüüpide suunamiseks
