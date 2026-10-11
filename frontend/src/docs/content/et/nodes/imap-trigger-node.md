# IMAP Trigger

**IMAP Trigger** node küsitleb e-posti postkasti kindla intervalliga ja käivitab workflow ühe korra iga vastuvõetud uue sõnumi kohta. See on null-sisendiga trigger node, mis on mõeldud sissetuleva e-posti automatiseerimiseks, nagu tugipäringute triaaž, jagatud postkastide jälgimine ja kinnituspostkastid.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 0 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | `imap` mandaat, mis sisaldab serveri, sisselogimise, postkasti ja SSL-i seadeid |
| `pollIntervalMinutes` | Täisarv | Kui tihti Heym postkasti uue e-posti suhtes kontrollib |

## Seadistusjuhend

### 1. Looge `imap` mandaat

1. Minge jaotisse **Settings → Credentials → New Credential**
2. Valige tüübiks **IMAP Email Inbox**
3. Sisestage:
   - **IMAP Host** (näiteks `imap.gmail.com`)
   - **IMAP Port** (`993` SSL/TLS jaoks enamikel teenusepakkujatel)
   - **Username / Email**
   - **Password / App Password**
   - Valikuline **Mailbox** (vaikimisi: `INBOX`)
4. Jätke **Use SSL / TLS** lubatuks, välja arvatud juhul, kui teie meiliserver nõuab selgelt mitte-SSL IMAP-i
5. Salvestage mandaat

### 2. Lisage node oma workflow'sse

1. Lohistage **IMAP Trigger** lõuendile
2. Valige node, et avada Properties paneel
3. Valige oma `imap` mandaat
4. Määrake **Poll Interval (Minutes)** täisarvulise väärtusega, näiteks `1`, `5` või `15`

## Triggeri semantika

- Esimene küsitlus loob baasjoone postkasti praegusest sisust ega **taasesita** vanemat e-posti.
- Hilisemad küsitlused käivitavad ühe korra iga sõnumi kohta, mille IMAP UID on salvestatud kursorist uuem.
- Kui postkasti `UIDVALIDITY` muutub, lähtestab Heym kursori ja loob baasjoone uuesti, et vältida duplikeeritud töötlemist.
- Iga uus e-kiri käivitab eraldi workflow käivituse, mille `trigger_source = "imap"`.

## Väljundväljad

Pärast node'i käivitumist saavad allavoolu node'id juurde pääseda järgmisele:

| Avaldis | Kirjeldus |
|------------|-------------|
| `$nodeLabel.email` | Täielik parsitud e-posti payload |
| `$nodeLabel.email.subject` | Dekodeeritud teema |
| `$nodeLabel.email.from` | Töötlemata `From` päis |
| `$nodeLabel.email.fromAddresses` | Parsitud saatjate nimekiri |
| `$nodeLabel.email.toAddresses` | Parsitud adressaatide nimekiri |
| `$nodeLabel.email.ccAddresses` | Parsitud CC nimekiri |
| `$nodeLabel.email.replyToAddresses` | Parsitud vastamisaadresside nimekiri |
| `$nodeLabel.email.text` | Lihttekstina sisu |
| `$nodeLabel.email.html` | HTML sisu |
| `$nodeLabel.email.attachments` | Manuste metaandmete massiiv (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Dekodeeritud päiste objekt |
| `$nodeLabel.email.uid` | IMAP UID duplikaatide tuvastamiseks või logimiseks |
| `$nodeLabel.triggered_by` | Triggeri allika silt (`"imap"`) |
| `$nodeLabel.trigger_node_id` | Lõuendi node ID, mis e-kirja tuvastas |
| `$nodeLabel.triggered_at` | Workflow käivituse ISO ajatempel |

## Näidis-workflow

**Sissetulev tugie-kiri → kokkuvõte → marsruutimine**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** silt: `supportInbox`
- **LLM** kasutaja sõnum: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Märkused

- Paljud teenusepakkujad nõuavad IMAP juurdepääsuks **rakenduse parooli** teie peamise konto parooli asemel.
- Manuste sisu ei lisata workflow sisendisse; kaasatud on ainult manuste metaandmed.
- Kasutage allavoolu [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) või [DataTable](./datatable-node.md), et uut e-posti marsruutida või logida.

## Seotud

- [Triggers](../reference/triggers.md) – Ülevaade kõigist workflow sisendpunktidest
- [Third-Party Integrations](../reference/integrations.md) – IMAP mandaadi seadistamine
- [Credentials Tab](../tabs/credentials-tab.md) – `imap` mandaatide lisamine ja haldamine
- [Send Email](./send-email-node.md) – Vastake või edastage sissetulevaid sõnumeid
