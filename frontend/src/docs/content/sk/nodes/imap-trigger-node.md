# IMAP Trigger

Uzol **IMAP Trigger** v pravidelných intervaloch kontroluje e-mailovú schránku a spustí workflow raz pre každú novozistenú správu. Ide o trigger uzol s nulovým vstupom určený na automatizáciu prichádzajúcej e-mailovej komunikácie, ako je triage podpory, monitorovanie zdieľaných schránok a schránky na schvaľovanie.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametre

| Parameter | Typ | Popis |
|-----------|-----|-------|
| `credentialId` | UUID | Prihlasovacie údaje typu `imap` obsahujúce server, prihlásenie, schránku a nastavenia SSL |
| `pollIntervalMinutes` | Integer | Ako často Heym kontroluje schránku na nové e-maily |

## Sprievodca nastavením

### 1. Vytvorenie prihlasovacích údajov typu `imap`

1. Prejdite do **Settings → Credentials → New Credential**
2. Vyberte typ **IMAP Email Inbox**
3. Zadajte:
   - **IMAP Host** (napríklad `imap.gmail.com`)
   - **IMAP Port** (`993` pre SSL/TLS u väčšiny poskytovateľov)
   - **Username / Email**
   - **Password / App Password**
   - Voliteľne **Mailbox** (predvolené: `INBOX`)
4. Ponechajte **Use SSL / TLS** zapnuté, pokiaľ váš poštový server výslovne nevyžaduje IMAP bez SSL
5. Uložte prihlasovacie údaje

### 2. Pridanie uzla do workflowu

1. Presuňte **IMAP Trigger** na plátno
2. Vyberte uzol a otvorte panel Properties
3. Zvoľte svoje prihlasovacie údaje typu `imap`
4. Nastavte **Poll Interval (Minutes)** na celočíselnú hodnotu, ako napríklad `1`, `5` alebo `15`

## Sémantika triggera

- Prvá kontrola vytvorí baseline aktuálneho obsahu schránky a **neprehrá** staršie e-maily.
- Neskoršie kontroly spustia trigger raz pre každú správu, ktorej IMAP UID je novšie ako uložený kurzor.
- Ak sa zmení `UIDVALIDITY` schránky, Heym resetuje kurzor a znova vytvorí baseline, aby sa predišlo duplicitnému spracovaniu.
- Každý nový e-mail spustí samostatné spustenie workflowu s `trigger_source = "imap"`.

## Výstupné polia

Po spustení triggera môžu nadväzujúce uzly pristupovať k:

| Výraz | Popis |
|------------|-------|
| `$nodeLabel.email` | Úplný parsovaný payload e-mailu |
| `$nodeLabel.email.subject` | Dekódovaný predmet |
| `$nodeLabel.email.from` | Surová hlavička `From` |
| `$nodeLabel.email.fromAddresses` | Parsovaný zoznam odosielateľov |
| `$nodeLabel.email.toAddresses` | Parsovaný zoznam príjemcov |
| `$nodeLabel.email.ccAddresses` | Parsovaný zoznam CC |
| `$nodeLabel.email.replyToAddresses` | Parsovaný zoznam reply-to |
| `$nodeLabel.email.text` | Telo v čistom texte |
| `$nodeLabel.email.html` | Telo v HTML |
| `$nodeLabel.email.attachments` | Pole metadát príloh (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Dekódovaný objekt hlavičiek |
| `$nodeLabel.email.uid` | IMAP UID na deduplikáciu alebo logovanie |
| `$nodeLabel.triggered_by` | Označenie zdroja triggera (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID uzla na plátne, ktorý e-mail zistil |
| `$nodeLabel.triggered_at` | ISO časová pečiatka spustenia workflowu |

## Príklad workflowu

**Prichádzajúci e-mail podpory → zhrnutie → smerovanie**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** označenie: `supportInbox`
- **LLM** používateľská správa: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Poznámky

- Mnohí poskytovatelia vyžadujú na prístup cez IMAP **app password** namiesto hesla k hlavnému účtu.
- Obsah príloh sa nevkladá do vstupu workflowu; zahrnuté sú iba metadáta príloh.
- Na smerovanie alebo logovanie nových e-mailov použite nadväzujúce uzly [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) alebo [DataTable](./datatable-node.md).

## Súvisiace

- [Triggers](../reference/triggers.md) – Prehľad všetkých vstupných bodov workflowu
- [Third-Party Integrations](../reference/integrations.md) – Nastavenie prihlasovacích údajov IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Pridávanie a správa prihlasovacích údajov typu `imap`
- [Send Email](./send-email-node.md) – Odpovedanie alebo preposielanie prichádzajúcich správ
