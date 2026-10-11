# IMAP Trigger

**IMAP Trigger** vozlišče preverja e-poštni predal v fiksnih intervalih in zažene workflow enkrat za vsako novo zaznano sporočilo. Je vozlišče brez vhodnih podatkov, zasnovano za avtomatizacijo prejetih e-pošt, kot so razporejanje podpore, spremljanje skupnih predalov in predali za odobritve.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 0 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | `imap` poverilnica, ki vsebuje nastavitve strežnika, prijave, predala in SSL |
| `pollIntervalMinutes` | Celo število | Kako pogosto Heym preverja predal za novo e-pošto |

## Navodila za nastavitev

### 1. Ustvarite `imap` Poverilnico

1. Pojdite na **Nastavitve → Poverilnice → Nova poverilnica**
2. Izberite tip **IMAP Email Inbox**
3. Vnesite:
   - **IMAP Gostitelj** (na primer `imap.gmail.com`)
   - **IMAP Pristanišče** (`993` za SSL/TLS pri večini ponudnikov)
   - **Uporabniško ime / E-pošta**
   - **Geslo / Geslo za aplikacijo**
   - Neobvezno **Predal** (privzeto: `INBOX`)
4. Pustite **Uporabi SSL / TLS** omogočeno, razen če vaš strežnik za e-pošto izrecno zahteva ne-SSL IMAP
5. Shranite poverilnico

### 2. Dodajte Vozlišče v Vaš Workflow

1. Povlecite **IMAP Trigger** na platno
2. Izberite vozlišče, da odprete ploščo lastnosti
3. Izberite svojo `imap` poverilnico
4. Nastavite **Interval preverjanja (minute)** z celo število, kot je `1`, `5` ali `15`

## Semantika Triggerja

- Prvo preverjanje vzpostavi osnovno stanje trenutne vsebine predala in **ne** predvaja starejše e-pošte.
- Kasnejša preverjanja sprožijo enkrat na sporočilo, katerega IMAP UID je novejši od shranjenega kazalca.
- Če se `UIDVALIDITY` predala spremeni, Heym ponastavi kazalec in ponovno vzpostavi osnovno stanje, da se izogne podvajanju obdelave.
- Vsaka nova e-pošta zažene ločeno izvajanje workflow z `trigger_source = "imap"`.

## Izhodne Polja

Po sprožitvi vozlišča lahko spodnja vozlišča dostopajo do:

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.email` | Polno razčlenjen payload e-pošte |
| `$nodeLabel.email.subject` | Dekodiran predmet |
| `$nodeLabel.email.from` | Neobdelana glava `From` |
| `$nodeLabel.email.fromAddresses` | Razčlenjen seznam pošiljateljev |
| `$nodeLabel.email.toAddresses` | Razčlenjen seznam prejemnikov |
| `$nodeLabel.email.ccAddresses` | Razčlenjen seznam CC |
| `$nodeLabel.email.replyToAddresses` | Razčlenjen seznam za odgovor |
| `$nodeLabel.email.text` | Besedilo telesa |
| `$nodeLabel.email.html` | HTML telo |
| `$nodeLabel.email.attachments` | Množica metapodatkov o priponkah (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Dekodiran objekt glave |
| `$nodeLabel.email.uid` | IMAP UID za preprečevanje podvajanja ali beleženje |
| `$nodeLabel.triggered_by` | Oznaka vira sprožitve (`"imap"`) |
| `$nodeLabel.trigger_node_id` | ID vozlišča na platnu, ki je zaznal e-pošto |
| `$nodeLabel.triggered_at` | ISO časovna oznaka za izvajanje workflow |

## Primer Workflow

**Prejeta podpora e-pošta → povzetek → usmeritev**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** oznaka: `supportInbox`
- **LLM** uporabniška sporočila: `"Povzemite to e-pošto od $supportInbox.email.from: $supportInbox.email.text"`
- **Pogoji**: `$supportInbox.email.subject.lower().contains("urgent")`

## Opombe

- Mnogi ponudniki zahtevajo **geslo za aplikacijo** za dostop do IMAP namesto vašega glavnega gesla za račun.
- Vsebina priponk ni vključena v vhod workflow; vključeni so le metapodatki o priponkah.
- Uporabite [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) ali [DataTable](./datatable-node.md) downstream za usmerjanje ali beleženje nove e-pošte.

## Sorodno

- [Triggers](../reference/triggers.md) – Pregled vseh vstopnih točk workflow
- [Third-Party Integrations](../reference/integrations.md) – Nastavitev `imap` poverilnice
- [Credentials Tab](../tabs/credentials-tab.md) – Dodajte in upravljajte `imap` poverilnice
- [Send Email](./send-email-node.md) – Odgovorite ali posredujte prejeta sporočila
