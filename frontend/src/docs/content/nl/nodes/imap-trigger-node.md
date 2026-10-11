# IMAP Trigger

De **IMAP Trigger**-node pollt een e-mailinbox met een vast interval en start een workflow telkens wanneer een nieuw bericht wordt gedetecteerd. Het is een trigger-node zonder invoer, ontworpen voor inkomende e-mailautomatisering, zoals supporttriage, monitoring van gedeelde mailboxen en goedkeuringsmailboxen.

## Overzicht

| Eigenschap | Waarde |
|----------|-------|
| Invoer | 0 |
| Uitvoer | 1 |
| Uitvoer | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parameters

| Parameter | Type | Beschrijving |
|-----------|------|-------------|
| `credentialId` | UUID | `imap`-referentie met server-, login-, mailbox- en SSL-instellingen |
| `pollIntervalMinutes` | Integer | Hoe vaak Heym de mailbox controleert op nieuwe e-mail |

## Installatiehandleiding

### 1. Een `imap`-referentie aanmaken

1. Ga naar **Settings → Credentials → New Credential**
2. Selecteer type **IMAP Email Inbox**
3. Voer in:
   - **IMAP Host** (bijvoorbeeld `imap.gmail.com`)
   - **IMAP Port** (`993` voor SSL/TLS bij de meeste providers)
   - **Username / Email**
   - **Password / App Password**
   - Optioneel **Mailbox** (standaard: `INBOX`)
4. Laat **Use SSL / TLS** ingeschakeld, tenzij uw mailserver expliciet niet-SSL IMAP vereist
5. Sla de referentie op

### 2. De node toevoegen aan uw workflow

1. Sleep **IMAP Trigger** naar het canvas
2. Selecteer de node om het eigenschappenpaneel te openen
3. Kies uw `imap`-referentie
4. Stel **Poll Interval (Minutes)** in met een geheel getal, zoals `1`, `5` of `15`

## Trigger-semantiek

- De eerste poll stelt een basislijn vast van de huidige mailboxinhoud en speelt oudere e-mail **niet** opnieuw af.
- Latere polls triggeren één keer per bericht waarvan de IMAP UID nieuwer is dan de opgeslagen cursor.
- Als de `UIDVALIDITY` van de mailbox verandert, stelt Heym de cursor opnieuw in en wordt opnieuw een basislijn vastgesteld om dubbele verwerking te voorkomen.
- Elke nieuwe e-mail start een afzonderlijke workflow-uitvoering met `trigger_source = "imap"`.

## Uitvoervelden

Nadat de node is getriggerd, kunnen downstream-nodes het volgende benaderen:

| Expressie | Beschrijving |
|------------|-------------|
| `$nodeLabel.email` | Volledige geparseerde e-mailpayload |
| `$nodeLabel.email.subject` | Gedecodeerd onderwerp |
| `$nodeLabel.email.from` | Ruwe `From`-header |
| `$nodeLabel.email.fromAddresses` | Geparseerde afzenderlijst |
| `$nodeLabel.email.toAddresses` | Geparseerde ontvangerslijst |
| `$nodeLabel.email.ccAddresses` | Geparseerde CC-lijst |
| `$nodeLabel.email.replyToAddresses` | Geparseerde reply-to-lijst |
| `$nodeLabel.email.text` | Platte tekst-body |
| `$nodeLabel.email.html` | HTML-body |
| `$nodeLabel.email.attachments` | Array met metadata van bijlagen (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Gedecodeerd header-object |
| `$nodeLabel.email.uid` | IMAP UID voor deduplicatie of logging |
| `$nodeLabel.triggered_by` | Label van de triggerbron (`"imap"`) |
| `$nodeLabel.trigger_node_id` | Canvas-node-ID die de e-mail heeft gedetecteerd |
| `$nodeLabel.triggered_at` | ISO-tijdstempel voor de workflow-uitvoering |

## Voorbeeldworkflow

**Inkomende support-e-mail → samenvatten → routeren**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger**-label: `supportInbox`
- **LLM**-gebruikersbericht: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Opmerkingen

- Veel providers vereisen een **app password** voor IMAP-toegang in plaats van uw hoofdwachtwoord van het account.
- De inhoud van bijlagen wordt niet in de workflow-invoer geïnjecteerd; alleen de metadata van bijlagen wordt opgenomen.
- Gebruik [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) of [DataTable](./datatable-node.md) downstream om nieuwe e-mail te routeren of te loggen.

## Gerelateerd

- [Triggers](../reference/triggers.md) – Overzicht van alle workflow-entrypoints
- [Third-Party Integrations](../reference/integrations.md) – IMAP-referentie instellen
- [Credentials Tab](../tabs/credentials-tab.md) – `imap`-referenties toevoegen en beheren
- [Send Email](./send-email-node.md) – Antwoorden op of doorsturen van inkomende berichten
