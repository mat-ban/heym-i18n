# IMAP-Trigger

Noden **IMAP-Trigger** pollar en e-postinkorg med ett fast intervall och startar en workflow en gång för varje nytt meddelande som upptäcks. Det är en trigger-nod utan indata som är utformad för automatisering av inkommande e-post, såsom supportärenden, övervakning av delade brevlådor och godkännandebrevlådor.

## Översikt

| Egenskap | Värde |
|----------|-------|
| Indata | 0 |
| Utdata | 1 |
| Utdata | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametrar

| Parameter | Typ | Beskrivning |
|-----------|-----|-------------|
| `credentialId` | UUID | `imap`-autentiseringsuppgift som innehåller server, inloggning, brevlåda och SSL-inställningar |
| `pollIntervalMinutes` | Heltal | Hur ofta Heym kontrollerar brevlådan för ny e-post |

## Installationsguide

### 1. Skapa en `imap`-autentiseringsuppgift

1. Gå till **Settings → Credentials → New Credential**
2. Välj typen **IMAP Email Inbox**
3. Ange:
   - **IMAP Host** (till exempel `imap.gmail.com`)
   - **IMAP Port** (`993` för SSL/TLS hos de flesta leverantörer)
   - **Username / Email**
   - **Password / App Password**
   - Valfri **Mailbox** (standard: `INBOX`)
4. Låt **Use SSL / TLS** vara aktiverat om inte e-postservern uttryckligen kräver IMAP utan SSL
5. Spara autentiseringsuppgiften

### 2. Lägg till noden i ett workflow

1. Dra **IMAP-Trigger** till canvas
2. Välj noden för att öppna panelen Egenskaper
3. Välj konfigurerad `imap`-autentiseringsuppgift
4. Ange **Poll Interval (Minutes)** med ett heltalsvärde såsom `1`, `5` eller `15`

## Trigger-semantik

- Den första pollningen upprättar en baslinje för brevlådans aktuella innehåll och spelar **inte** upp äldre e-post igen.
- Senare pollningar triggar en gång per meddelande vars IMAP UID är nyare än den sparade markören.
- Om brevlådans `UIDVALIDITY` ändras återställer Heym markören och upprättar en ny baslinje för att undvika dubbelbearbetning.
- Varje nytt e-postmeddelande startar en separat workflow-körning med `trigger_source = "imap"`.

## Utdatafält

Efter att noden har triggat kan efterföljande noder komma åt:

| Uttryck | Beskrivning |
|---------|-------------|
| `$nodeLabel.email` | Fullständig parsad e-postpayload |
| `$nodeLabel.email.subject` | Avkodat ämne |
| `$nodeLabel.email.from` | Rå `From`-header |
| `$nodeLabel.email.fromAddresses` | Parsad avsändarlista |
| `$nodeLabel.email.toAddresses` | Parsad mottagarlista |
| `$nodeLabel.email.ccAddresses` | Parsad CC-lista |
| `$nodeLabel.email.replyToAddresses` | Parsad reply-to-lista |
| `$nodeLabel.email.text` | Brödtext i klartext |
| `$nodeLabel.email.html` | HTML-brödtext |
| `$nodeLabel.email.attachments` | Array med metadata för bilagor (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Avkodat header-objekt |
| `$nodeLabel.email.uid` | IMAP UID för deduplicering eller loggning |
| `$nodeLabel.triggered_by` | Etikett för trigger-källa (`"imap"`) |
| `$nodeLabel.trigger_node_id` | Canvas-nodens ID som upptäckte e-postmeddelandet |
| `$nodeLabel.triggered_at` | ISO-tidsstämpel för workflow-körningen |

## Exempel på workflow

**Inkommande supportmejl → sammanfatta → dirigera**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP-Trigger**-etikett: `supportInbox`
- **LLM** användarmeddelande: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Anteckningar

- Många leverantörer kräver ett **app-lösenord** för IMAP-åtkomst istället för huvudkontots lösenord.
- Bilagors innehåll injiceras inte i workflow-indata; endast metadata för bilagor inkluderas.
- Använd [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) eller [DataTable](./datatable-node.md) nedströms för att dirigera eller logga ny e-post.

## Relaterat

- [Triggers](../reference/triggers.md) – Översikt över alla workflow-ingångspunkter
- [Third-Party Integrations](../reference/integrations.md) – Konfiguration av IMAP-autentiseringsuppgifter
- [Credentials Tab](../tabs/credentials-tab.md) – Lägg till och hantera `imap`-autentiseringsuppgifter
- [Send Email](./send-email-node.md) – Svara på eller vidarebefordra inkommande meddelanden
