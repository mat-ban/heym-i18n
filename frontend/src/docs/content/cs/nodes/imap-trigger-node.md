# IMAP Trigger

Uzel **IMAP Trigger** v pravidelných intervalech kontroluje e-mailovou schránku a spustí workflow jednou pro každou nově zjištěnou zprávu. Jedná se o trigger uzel s nulovým vstupem určený pro automatizaci příchozí e-mailové komunikace, jako je třídění požadavků podpory, sledování sdílených schránek a schránek pro schvalování.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaj `imap` obsahující server, přihlašovací údaje, schránku a nastavení SSL |
| `pollIntervalMinutes` | Integer | Jak často Heym kontroluje schránku na nové e-maily |

## Průvodce nastavením

### 1. Vytvoření přihlašovacího údaje `imap`

1. Přejděte do **Settings → Credentials → New Credential**
2. Vyberte typ **IMAP Email Inbox**
3. Zadejte:
   - **IMAP Host** (například `imap.gmail.com`)
   - **IMAP Port** (`993` pro SSL/TLS u většiny poskytovatelů)
   - **Username / Email**
   - **Password / App Password**
   - Volitelně **Mailbox** (výchozí: `INBOX`)
4. Ponechte **Use SSL / TLS** zapnuté, pokud váš poštovní server výslovně nevyžaduje IMAP bez SSL
5. Uložte přihlašovací údaj

### 2. Přidání uzlu do workflow

1. Přetáhněte **IMAP Trigger** na canvas
2. Vyberte uzel pro otevření panelu Properties
3. Zvolte svůj přihlašovací údaj `imap`
4. Nastavte **Poll Interval (Minutes)** na celočíselnou hodnotu, například `1`, `5` nebo `15`

## Sémantika triggeru

- První kontrola vytvoří výchozí stav aktuálního obsahu schránky a **nepřehrává** starší e-maily.
- Následné kontroly spustí workflow jednou pro každou zprávu, jejíž IMAP UID je novější než uložený kurzor.
- Pokud se změní `UIDVALIDITY` schránky, Heym resetuje kurzor a znovu vytvoří výchozí stav, aby se zabránilo duplicitnímu zpracování.
- Každý nový e-mail spustí samostatné spuštění workflow s `trigger_source = "imap"`.

## Výstupní pole

Po spuštění uzlu mohou navazující uzly přistupovat k:

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.email` | Úplný zpracovaný payload e-mailu |
| `$nodeLabel.email.subject` | Dekódovaný předmět |
| `$nodeLabel.email.from` | Surová hlavička `From` |
| `$nodeLabel.email.fromAddresses` | Zpracovaný seznam odesílatelů |
| `$nodeLabel.email.toAddresses` | Zpracovaný seznam příjemců |
| `$nodeLabel.email.ccAddresses` | Zpracovaný seznam CC |
| `$nodeLabel.email.replyToAddresses` | Zpracovaný seznam reply-to |
| `$nodeLabel.email.text` | Tělo ve formátu prostého textu |
| `$nodeLabel.email.html` | Tělo ve formátu HTML |
| `$nodeLabel.email.attachments` | Pole metadat příloh (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Dekódovaný objekt hlaviček |
| `$nodeLabel.email.uid` | IMAP UID pro deduplikaci nebo protokolování |
| `$nodeLabel.triggered_by` | Označení zdroje triggeru (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID uzlu na canvasu, který e-mail zjistil |
| `$nodeLabel.triggered_at` | Časové razítko ISO pro spuštění workflow |

## Příklad workflow

**Příchozí e-mail podpory → shrnutí → směrování**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** označení: `supportInbox`
- **LLM** uživatelská zpráva: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Poznámky

- Mnoho poskytovatelů vyžaduje pro přístup k IMAP **app password** namísto hesla k hlavnímu účtu.
- Obsah příloh není vkládán do vstupu workflow; zahrnuta jsou pouze metadata příloh.
- Pro směrování nebo protokolování nových e-mailů použijte navazující uzly [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) nebo [DataTable](./datatable-node.md).

## Související

- [Triggers](../reference/triggers.md) – Přehled všech vstupních bodů workflow
- [Third-Party Integrations](../reference/integrations.md) – Nastavení přihlašovacích údajů IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Přidání a správa přihlašovacích údajů `imap`
- [Send Email](./send-email-node.md) – Odpověď nebo přeposlání příchozích zpráv
