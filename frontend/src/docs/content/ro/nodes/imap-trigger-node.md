# Trigger IMAP

Nodul **Trigger IMAP** interoghează periodic o căsuță poștală de email la un interval fix și pornește un workflow o dată pentru fiecare mesaj nou detectat. Este un nod de tip trigger cu intrare zero, conceput pentru automatizarea emailurilor primite, cum ar fi trierea solicitărilor de suport, monitorizarea căsuțelor poștale partajate și căsuțele poștale de aprobare.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 0 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditare `imap` care conține serverul, datele de autentificare, căsuța poștală și setările SSL |
| `pollIntervalMinutes` | Integer | Cât de des verifică Heym căsuța poștală pentru emailuri noi |

## Ghid de configurare

### 1. Creați o acreditare `imap`

1. Accesați **Settings → Credentials → New Credential**
2. Selectați tipul **IMAP Email Inbox**
3. Introduceți:
   - **IMAP Host** (de exemplu `imap.gmail.com`)
   - **IMAP Port** (`993` pentru SSL/TLS la majoritatea furnizorilor)
   - **Username / Email**
   - **Password / App Password**
   - Opțional **Mailbox** (implicit: `INBOX`)
4. Lăsați **Use SSL / TLS** activat, cu excepția cazului în care serverul dvs. de email necesită explicit IMAP fără SSL
5. Salvați acreditarea

### 2. Adăugați nodul în workflow-ul dvs.

1. Trageți **IMAP Trigger** pe canvas
2. Selectați nodul pentru a deschide panoul Properties
3. Alegeți acreditarea `imap`
4. Setați **Poll Interval (Minutes)** cu o valoare întreagă precum `1`, `5` sau `15`

## Semantica trigger-ului

- Prima interogare stabilește o linie de referință a conținutului actual al căsuței poștale și **nu** reia emailurile mai vechi.
- Interogările ulterioare declanșează o dată pentru fiecare mesaj al cărui UID IMAP este mai nou decât cursorul salvat.
- Dacă `UIDVALIDITY` al căsuței poștale se modifică, Heym resetează cursorul și stabilește din nou linia de referință pentru a evita procesarea duplicată.
- Fiecare email nou pornește o execuție separată a workflow-ului cu `trigger_source = "imap"`.

## Câmpuri de ieșire

După ce nodul se declanșează, nodurile din aval pot accesa:

| Expresie | Descriere |
|------------|-------------|
| `$nodeLabel.email` | Payload complet al emailului analizat |
| `$nodeLabel.email.subject` | Subiect decodat |
| `$nodeLabel.email.from` | Antetul `From` brut |
| `$nodeLabel.email.fromAddresses` | Lista expeditorilor analizată |
| `$nodeLabel.email.toAddresses` | Lista destinatarilor analizată |
| `$nodeLabel.email.ccAddresses` | Lista CC analizată |
| `$nodeLabel.email.replyToAddresses` | Lista reply-to analizată |
| `$nodeLabel.email.text` | Corpul în text simplu |
| `$nodeLabel.email.html` | Corpul HTML |
| `$nodeLabel.email.attachments` | Matrice de metadate ale atașamentelor (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Obiect de anteturi decodate |
| `$nodeLabel.email.uid` | UID IMAP pentru deduplicare sau jurnalizare |
| `$nodeLabel.triggered_by` | Eticheta sursei trigger-ului (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID-ul nodului din canvas care a detectat emailul |
| `$nodeLabel.triggered_at` | Marcaj temporal ISO pentru execuția workflow-ului |

## Exemplu de workflow

**Email de suport primit → rezumare → rutare**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** etichetă: `supportInbox`
- **LLM** mesaj utilizator: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Note

- Mulți furnizori necesită o **parolă de aplicație** pentru accesul IMAP în locul parolei contului principal.
- Conținutul atașamentelor nu este injectat în intrarea workflow-ului; sunt incluse doar metadatele atașamentelor.
- Utilizați [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) sau [DataTable](./datatable-node.md) în aval pentru a ruta sau jurnaliza emailurile noi.

## Resurse conexe

- [Triggers](../reference/triggers.md) – Prezentare generală a tuturor punctelor de intrare în workflow
- [Third-Party Integrations](../reference/integrations.md) – Configurarea acreditării IMAP
- [Credentials Tab](../tabs/credentials-tab.md) – Adăugarea și gestionarea acreditărilor `imap`
- [Send Email](./send-email-node.md) – Răspundeți sau redirecționați mesajele primite
