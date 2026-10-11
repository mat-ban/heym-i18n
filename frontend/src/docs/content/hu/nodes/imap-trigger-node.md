# IMAP Trigger

Az **IMAP Trigger** csomópont egy e-mail postafiókot kérdez le rögzített időközönként, és minden újonnan észlelt üzenethez egyszer indít el egy workflow-t. Ez egy nulla bemenettel rendelkező trigger csomópont, amelyet bejövő e-mail automatizáláshoz terveztek, például támogatási triage-hez, megosztott postafiókok figyeléséhez és jóváhagyási postafiókokhoz.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 0 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | `imap` hitelesítési adat, amely tartalmazza a szervert, a bejelentkezést, a postafiókot és az SSL beállításokat |
| `pollIntervalMinutes` | Integer | Milyen gyakran ellenőrzi a Heym a postafiókot új e-mail után |

## Beállítási útmutató

### 1. Hozzon létre egy `imap` hitelesítési adatot

1. Lépjen a **Settings → Credentials → New Credential** menüpontra
2. Válassza az **IMAP Email Inbox** típust
3. Adja meg:
   - **IMAP Host** (például `imap.gmail.com`)
   - **IMAP Port** (`993` SSL/TLS esetén a legtöbb szolgáltatónál)
   - **Username / Email**
   - **Password / App Password**
   - Opcionális **Mailbox** (alapértelmezett: `INBOX`)
4. Hagyja engedélyezve a **Use SSL / TLS** beállítást, kivéve, ha az e-mail szervere kifejezetten nem SSL-alapú IMAP-ot igényel
5. Mentse el a hitelesítési adatot

### 2. Adja hozzá a csomópontot a workflow-hoz

1. Húzza az **IMAP Trigger** csomópontot a vászonra
2. Válassza ki a csomópontot a Properties panel megnyitásához
3. Válassza ki az `imap` hitelesítési adatot
4. Állítsa be a **Poll Interval (Minutes)** értékét egy egész számmal, például `1`, `5` vagy `15`

## Trigger szemantika

- Az első lekérdezés létrehozza a postafiók aktuális tartalmának alapvonalát, és **nem** játssza vissza a régebbi e-maileket.
- A későbbi lekérdezések minden olyan üzenethez egyszer triggerelnek, amelynek IMAP UID-je újabb, mint a mentett kurzor.
- Ha a postafiók `UIDVALIDITY` értéke megváltozik, a Heym visszaállítja a kurzort, és újra alapvonalat képez a duplikált feldolgozás elkerülése érdekében.
- Minden új e-mail külön workflow futtatást indít `trigger_source = "imap"` értékkel.

## Kimeneti mezők

Miután a csomópont triggerelt, a downstream csomópontok hozzáférhetnek a következőkhöz:

| Kifejezés | Leírás |
|------------|-------------|
| `$nodeLabel.email` | Teljes feldolgozott e-mail payload |
| `$nodeLabel.email.subject` | Dekódolt tárgy |
| `$nodeLabel.email.from` | Nyers `From` fejléc |
| `$nodeLabel.email.fromAddresses` | Feldolgozott feladói lista |
| `$nodeLabel.email.toAddresses` | Feldolgozott címzettlista |
| `$nodeLabel.email.ccAddresses` | Feldolgozott CC lista |
| `$nodeLabel.email.replyToAddresses` | Feldolgozott válaszcím lista |
| `$nodeLabel.email.text` | Egyszerű szöveges törzs |
| `$nodeLabel.email.html` | HTML törzs |
| `$nodeLabel.email.attachments` | Melléklet metaadatok tömbje (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Dekódolt fejléc objektum |
| `$nodeLabel.email.uid` | IMAP UID deduplikációhoz vagy naplózáshoz |
| `$nodeLabel.triggered_by` | Trigger forrás címkéje (`"imap"`) |
| `$nodeLabel.trigger_node_id` | Az e-mailt észlelő vászon csomópont azonosítója |
| `$nodeLabel.triggered_at` | ISO időbélyeg a workflow futtatáshoz |

## Példa workflow

**Bejövő támogatási e-mail → összegzés → útvonalválasztás**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** címke: `supportInbox`
- **LLM** felhasználói üzenet: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Megjegyzések

- Számos szolgáltató **app password** használatát igényli az IMAP hozzáféréshez a fő fiók jelszava helyett.
- A mellékletek tartalma nem kerül be a workflow bemenetébe; csak a melléklet metaadatai szerepelnek.
- Használja a [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) vagy [DataTable](./datatable-node.md) csomópontokat downstream az új e-mailek útvonalválasztásához vagy naplózásához.

## Kapcsolódó

- [Triggers](../reference/triggers.md) – Az összes workflow belépési pont áttekintése
- [Third-Party Integrations](../reference/integrations.md) – IMAP hitelesítési adat beállítása
- [Credentials Tab](../tabs/credentials-tab.md) – `imap` hitelesítési adatok hozzáadása és kezelése
- [Send Email](./send-email-node.md) – Bejövő üzenetek megválaszolása vagy továbbítása
