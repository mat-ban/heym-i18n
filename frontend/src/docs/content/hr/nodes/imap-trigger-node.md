# IMAP Trigger

Čvor **IMAP Trigger** provjerava poštanski sandučić e-pošte u fiksnom intervalu i pokreće workflow jednom za svaku novootkrivenu poruku. Riječ je o trigger čvoru bez ulaza, namijenjenom automatizaciji dolazne e-pošte kao što su trijaža korisničke podrške, praćenje zajedničkih poštanskih sandučića i sandučića za odobrenja.

## Pregled

| Svojstvo | Vrijednost |
|----------|-------|
| Ulazi | 0 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parametar | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | `imap` vjerodajnica koja sadrži poslužitelj, podatke za prijavu, poštanski sandučić i SSL postavke |
| `pollIntervalMinutes` | Integer | Koliko često Heym provjerava poštanski sandučić za novu e-poštu |

## Vodič za postavljanje

### 1. Izradite `imap` vjerodajnicu

1. Idite na **Settings → Credentials → New Credential**
2. Odaberite tip **IMAP Email Inbox**
3. Unesite:
   - **IMAP Host** (na primjer `imap.gmail.com`)
   - **IMAP Port** (`993` za SSL/TLS kod većine pružatelja usluga)
   - **Username / Email**
   - **Password / App Password**
   - Neobavezno **Mailbox** (zadano: `INBOX`)
4. Ostavite **Use SSL / TLS** omogućeno, osim ako vaš poslužitelj e-pošte izričito zahtijeva IMAP bez SSL-a
5. Spremite vjerodajnicu

### 2. Dodajte čvor u svoj workflow

1. Povucite **IMAP Trigger** na platno
2. Odaberite čvor kako biste otvorili ploču Properties
3. Odaberite svoju `imap` vjerodajnicu
4. Postavite **Poll Interval (Minutes)** na cjelobrojnu vrijednost poput `1`, `5` ili `15`

## Semantika triggera

- Prva provjera uspostavlja osnovnu razinu trenutnog sadržaja poštanskog sandučića i **ne** reproducira stariju e-poštu.
- Kasnije provjere pokreću se jednom po poruci čiji je IMAP UID noviji od spremljenog kursora.
- Ako se `UIDVALIDITY` poštanskog sandučića promijeni, Heym resetira kursor i ponovno uspostavlja osnovnu razinu kako bi se izbjeglo dvostruko procesuiranje.
- Svaka nova e-pošta pokreće zasebno izvršavanje workflowa s `trigger_source = "imap"`.

## Izlazna polja

Nakon što se čvor aktivira, nizvodni čvorovi mogu pristupiti:

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.email` | Potpuni parsirani payload e-pošte |
| `$nodeLabel.email.subject` | Dekodirani naslov |
| `$nodeLabel.email.from` | Sirovi `From` header |
| `$nodeLabel.email.fromAddresses` | Parsirani popis pošiljatelja |
| `$nodeLabel.email.toAddresses` | Parsirani popis primatelja |
| `$nodeLabel.email.ccAddresses` | Parsirani CC popis |
| `$nodeLabel.email.replyToAddresses` | Parsirani reply-to popis |
| `$nodeLabel.email.text` | Tijelo u običnom tekstu |
| `$nodeLabel.email.html` | HTML tijelo |
| `$nodeLabel.email.attachments` | Polje metapodataka o privicima (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Dekodirani objekt zaglavlja |
| `$nodeLabel.email.uid` | IMAP UID za deduplikaciju ili bilježenje |
| `$nodeLabel.triggered_by` | Oznaka izvora triggera (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID čvora na platnu koji je otkrio e-poštu |
| `$nodeLabel.triggered_at` | ISO vremenska oznaka izvršavanja workflowa |

## Primjer workflowa

**Dolazna e-pošta podrške → sažmi → usmjeri**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** oznaka: `supportInbox`
- **LLM** korisnička poruka: `"Summarize this email from $supportInbox.email.from: $supportInbox.email.text"`
- **Condition**: `$supportInbox.email.subject.lower().contains("urgent")`

## Napomene

- Mnogi pružatelji usluga zahtijevaju **app password** za IMAP pristup umjesto lozinke glavnog računa.
- Sadržaj privitaka ne ubacuje se u ulaz workflowa; uključeni su samo metapodaci o privicima.
- Koristite [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) ili [DataTable](./datatable-node.md) nizvodno za usmjeravanje ili bilježenje nove e-pošte.

## Povezano

- [Triggers](../reference/triggers.md) – Pregled svih ulaznih točaka workflowa
- [Third-Party Integrations](../reference/integrations.md) – Postavljanje `imap` vjerodajnice
- [Credentials Tab](../tabs/credentials-tab.md) – Dodavanje i upravljanje `imap` vjerodajnicama
- [Send Email](./send-email-node.md) – Odgovorite ili proslijedite dolazne poruke
