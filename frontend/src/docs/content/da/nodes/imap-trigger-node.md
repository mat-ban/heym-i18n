# IMAP Trigger

**IMAP Trigger**-noden afsøger en e-mail-indbakke med faste intervaller og starter et workflow for hver nyopdaget besked. Det er en trigger-node uden input, der er designet til automatisering af indgående e-mails såsom support-triagering, overvågning af delte postkasser og godkendelsesmailbokse.

## Oversigt

| Egenskab | Værdi |
|----------|-------|
| Inputs | 0 |
| Outputs | 1 |
| Output | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametre

| Parameter | Type | Beskrivelse |
|-----------|------|-------------|
| `credentialId` | UUID | `imap`-legitimationsoplysninger indeholdende server, login, postkasse og SSL-indstillinger |
| `pollIntervalMinutes` | Integer | Interval i minutter mellem Heyms tjek for ny e-mail |

## Opsætningsvejledning

### 1. Opret `imap`-legitimationsoplysninger

1. Gå til **Indstillinger → Legitimationsoplysninger → Ny legitimationsoplysning**
2. Vælg typen **IMAP Email Inbox**
3. Indtast:
   - **IMAP Host** (f.eks. `imap.gmail.com`)
   - **IMAP Port** (`993` for SSL/TLS hos de fleste udbydere)
   - **Brugernavn / E-mail**
   - **Adgangskode / App-adgangskode**
   - Valgfrit **Mailbox** (standard: `INBOX`)
4. Lad **Use SSL / TLS** være aktiveret, medmindre mailserveren eksplicit kræver ikke-SSL IMAP
5. Gem legitimationsoplysningerne

### 2. Tilføj noden til workflowet

1. Træk **IMAP Trigger** ind på canvas
2. Vælg noden for at åbne egenskabspanel
3. Vælg de `imap`-legitimationsoplysninger, der skal bruges
4. Angiv **Poll Interval (Minutes)** med en heltalsværdi som `1`, `5` eller `15`

## Trigger-semantik

- Første afsøgning etablerer en baseline for nuværende indhold i postkassen og **genafspiller ikke** ældre e-mails.
- Senere afsøgninger udløser én gang pr. besked, hvis IMAP UID er nyere end den gemte cursor.
- Hvis postkassens `UIDVALIDITY` ændres, nulstiller Heym cursoren og etablerer en ny baseline for at undgå duplikatbehandling.
- Hver ny e-mail starter en separat workflow-kørsel med `trigger_source = "imap"`.

## Output-felter

Efter noden har udløst, kan downstream-noder tilgå:

| Udtryk | Beskrivelse |
|------------|-------------|
| `$nodeLabel.email` | Fuldt parset e-mail-payload |
| `$nodeLabel.email.subject` | Dekodet emne |
| `$nodeLabel.email.from` | Rå `From`-header |
| `$nodeLabel.email.fromAddresses` | Parset afsenderliste |
| `$nodeLabel.email.toAddresses` | Parset modtagerliste |
| `$nodeLabel.email.ccAddresses` | Parset CC-liste |
| `$nodeLabel.email.replyToAddresses` | Parset reply-to-liste |
| `$nodeLabel.email.text` | Ren tekst-body |
| `$nodeLabel.email.html` | HTML-body |
| `$nodeLabel.email.attachments` | Array med vedhæftningsmetadata (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Dekodet header-objekt |
| `$nodeLabel.email.uid` | IMAP UID til deduplicering eller logging |
| `$nodeLabel.triggered_by` | Triggerkilde-label (`"imap"`) |
| `$nodeLabel.trigger_node_id` | Canvas-node-ID, der registrerede e-mailen |
| `$nodeLabel.triggered_at` | ISO-timestamp for workflow-kørslen |

## Eksempel på workflow

**Indgående supportmail → resumé → routing**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger**-label: `supportInbox`
- **LLM**-brugermeddelelse: `"Resumér denne e-mail fra $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Bemærkninger

- Mange udbydere kræver en **app-adgangskode** til IMAP-adgang i stedet for hovedkontoadgangskoden.
- Vedhæftningsindhold injiceres ikke i workflow-input; kun vedhæftningsmetadata inkluderes.
- Brug [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) eller [DataTable](./datatable-node.md) downstream til at dirigere eller logge ny e-mail.

## Relateret

- [Triggers](../reference/triggers.md) – Oversigt over alle workflow-indgangspunkter
- [Third-Party Integrations](../reference/integrations.md) – Opsætning af IMAP-legitimationsoplysninger
- [Credentials Tab](../tabs/credentials-tab.md) – Tilføj og håndter `imap`-legitimationsoplysninger
- [Send Email](./send-email-node.md) – Svar eller videresend indgående beskeder
