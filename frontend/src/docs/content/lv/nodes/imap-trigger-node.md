# IMAP Trigger

**IMAP Trigger** mezgls ar fiksētu intervālu aptaujā e-pasta iesūtni un palaiž workflow vienu reizi katram jaunatklātajam ziņojumam. Tas ir trigger mezgls bez ievades, kas paredzēts ienākošā e-pasta automatizācijai, piemēram, atbalsta pieprasījumu šķirošanai, koplietojamo pastkastu uzraudzībai un apstiprināšanas pastkastēm.

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 0 |
| Izvades | 1 |
| Izvade | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | `imap` akreditācijas dati, kas satur servera, pieteikšanās, pastkastes un SSL iestatījumus |
| `pollIntervalMinutes` | Integer | Cik bieži Heym pārbauda pastkasti, vai nav jaunu e-pastu |

## Iestatīšanas pamācība

### 1. Izveidojiet `imap` akreditācijas datus

1. Dodieties uz **Settings → Credentials → New Credential**
2. Izvēlieties tipu **IMAP Email Inbox**
3. Ievadiet:
   - **IMAP Host** (piemēram, `imap.gmail.com`)
   - **IMAP Port** (`993` SSL/TLS lielākajai daļai pakalpojumu sniedzēju)
   - **Username / Email**
   - **Password / App Password**
   - Neobligāts **Mailbox** (pēc noklusējuma: `INBOX`)
4. Atstājiet **Use SSL / TLS** iespējotu, ja vien jūsu pasta serveris nepārprotami nepieprasa IMAP bez SSL
5. Saglabājiet akreditācijas datus

### 2. Pievienojiet mezglu savam workflow

1. Velciet **IMAP Trigger** uz kanvas
2. Atlasiet mezglu, lai atvērtu Properties paneli
3. Izvēlieties savus `imap` akreditācijas datus
4. Iestatiet **Poll Interval (Minutes)** ar veselu skaitli, piemēram, `1`, `5` vai `15`

## Trigger darbības semantika

- Pirmā aptauja nosaka pašreizējā pastkastes satura bāzes līniju un **neatkārto** vecākus e-pastus.
- Turpmākās aptaujas izraisa trigger vienu reizi katram ziņojumam, kura IMAP UID ir jaunāks par saglabāto kursoru.
- Ja pastkastes `UIDVALIDITY` mainās, Heym atiestata kursoru un atkal nosaka bāzes līniju, lai izvairītos no dublētas apstrādes.
- Katrs jauns e-pasts sāk atsevišķu workflow izpildi ar `trigger_source = "imap"`.

## Izvades lauki

Pēc tam, kad mezgls ir izraisījis trigger, lejupstraumes mezgli var piekļūt:

| Izteiksme | Apraksts |
|------------|-------------|
| `$nodeLabel.email` | Pilns parsēts e-pasta payload |
| `$nodeLabel.email.subject` | Atkodēts temats |
| `$nodeLabel.email.from` | Neapstrādāts `From` galvene |
| `$nodeLabel.email.fromAddresses` | Parsēts sūtītāju saraksts |
| `$nodeLabel.email.toAddresses` | Parsēts saņēmēju saraksts |
| `$nodeLabel.email.ccAddresses` | Parsēts CC saraksts |
| `$nodeLabel.email.replyToAddresses` | Parsēts reply-to saraksts |
| `$nodeLabel.email.text` | Vienkārša teksta pamatteksts |
| `$nodeLabel.email.html` | HTML pamatteksts |
| `$nodeLabel.email.attachments` | Pielikumu metadatu masīvs (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Atkodēts galveņu objekts |
| `$nodeLabel.email.uid` | IMAP UID dublēšanās novēršanai vai žurnālēšanai |
| `$nodeLabel.triggered_by` | Trigger avota apzīmējums (`"imap"`) |
| `$nodeLabel.trigger_node_id` | Kanvas mezgla ID, kas atklāja e-pastu |
| `$nodeLabel.triggered_at` | ISO laika zīmogs workflow izpildei |

## Workflow piemērs

**Ienākošais atbalsta e-pasts → kopsavilkums → maršrutēšana**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** apzīmējums: `supportInbox`
- **LLM** lietotāja ziņojums: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Piezīmes

- Daudzi pakalpojumu sniedzēji IMAP piekļuvei pieprasa **app password**, nevis jūsu galvenās konta paroli.
- Pielikumu saturs netiek ievadīts workflow ievadē; tiek iekļauti tikai pielikumu metadati.
- Izmantojiet [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) vai [DataTable](./datatable-node.md) lejupstraumē, lai maršrutētu vai žurnālētu jaunus e-pastus.

## Saistītie

- [Triggers](../reference/triggers.md) – Visu workflow ievades punktu pārskats
- [Third-Party Integrations](../reference/integrations.md) – IMAP akreditācijas datu iestatīšana
- [Credentials Tab](../tabs/credentials-tab.md) – `imap` akreditācijas datu pievienošana un pārvaldība
- [Send Email](./send-email-node.md) – Atbildēt vai pārsūtīt ienākošos ziņojumus
