# IMAP Trigger

**IMAP Trigger** mazgas periodiškai tikrina el. pašto dėžutę nustatytu intervalu ir pradeda workflow kiekvienam naujai aptiktam pranešimui. Tai yra nulinio įvesties tipo trigger mazgas, skirtas įeinančiai el. pašto automatizacijai, tokioms kaip pagalbos triagavimas, bendros pašto dėžutės stebėjimas ir patvirtinimo pašto dėžutės.

## Apžvalga

| Ypatybė | Vertė |
|---------|-------|
| Įvestys | 0 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.email`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | `imap` kredencialas, kuriame yra serverio, prisijungimo, pašto dėžutės ir SSL nustatymai |
| `pollIntervalMinutes` | Sveikasis skaičius | Kaip dažnai Heym tikrina pašto dėžutę dėl naujų el. laiškų |

## Nustatymo vadovas

### 1. Sukurkite `imap` Kredencialą

1. Eikite į **Nustatymai → Kredencialai → Naujas kredencialas**
2. Pasirinkite tipą **IMAP El. pašto dėžutė**
3. Įveskite:
   - **IMAP Host** (pavyzdžiui, `imap.gmail.com`)
   - **IMAP Port** (`993` SSL/TLS daugumoje tiekėjų)
   - **Vartotojo vardas / El. paštas**
   - **Slaptažodis / Programos slaptažodis**
   - Pasirinktinė **Pašto dėžutė** (numatytoji: `INBOX`)
4. Palikite **Naudoti SSL / TLS** įjungtą, nebent jūsų pašto serveris aiškiai reikalauja ne-SSL IMAP
5. Išsaugokite kredencialą

### 2. Pridėkite Mazgą prie Savo Workflow

1. Vilkite **IMAP Trigger** ant drobės
2. Pasirinkite mazgą, kad atidarytumėte Ypatybių skydelį
3. Pasirinkite savo `imap` kredencialą
4. Nustatykite **Tikrinimo intervalą (minutėmis)** su sveikuoju skaičiumi, pavyzdžiui, `1`, `5` arba `15`

## Trigger Semantika

- Pirmasis tikrinimas nustato dabartinės pašto dėžutės turinio bazinę liniją ir **ne** peržiūri senesnių el. laiškų.
- Vėlesni tikrinimai suaktyvina kartą už kiekvieną pranešimą, kurio IMAP UID yra naujesnis nei išsaugotas žymeklis.
- Jei pašto dėžutės `UIDVALIDITY` keičiasi, Heym atnaujina žymeklį ir vėl nustato bazinę liniją, kad išvengtų dvigubo apdorojimo.
- Kiekvienas naujas el. laiškas pradeda atskirą workflow vykdymą su `trigger_source = "imap"`.

## Išvesties Laukai

Po to, kai mazgas suaktyvinamas, žemiau esantys mazgai gali pasiekti:

| Išraiška | Aprašymas |
|-----------|-----------|
| `$nodeLabel.email` | Pilnai apdorotas el. laiško payload |
| `$nodeLabel.email.subject` | Iššifruotas pavadinimas |
| `$nodeLabel.email.from` | Žali `From` antraštė |
| `$nodeLabel.email.fromAddresses` | Apdorotas siuntėjo sąrašas |
| `$nodeLabel.email.toAddresses` | Apdorotas gavėjo sąrašas |
| `$nodeLabel.email.ccAddresses` | Apdorotas CC sąrašas |
| `$nodeLabel.email.replyToAddresses` | Apdorotas atsakymo adresų sąrašas |
| `$nodeLabel.email.text` | Paprasto teksto turinys |
| `$nodeLabel.email.html` | HTML turinys |
| `$nodeLabel.email.attachments` | Prisegtų failų metaduomenų masyvas (`filename`, `content_type`, `size_bytes`) |
| `$nodeLabel.email.headers` | Iššifruotas antraščių objektas |
| `$nodeLabel.email.uid` | IMAP UID dedupingui arba žurnalo vedimui |
| `$nodeLabel.triggered_by` | Trigger šaltinio etiketė (`"imap"`) |
| `$nodeLabel.trigger_node_id` | Drobės mazgo ID, kuris aptiko el. laišką |
| `$nodeLabel.triggered_at` | ISO laiko žymė workflow vykdymui |

## Pavyzdinė Workflow

**Įeinantis pagalbos el. laiškas → apibendrinti → nukreipti**

```
imapTrigger → llm → condition → slack / sendEmail
```

- **IMAP Trigger** etiketė: `supportInbox`
- **LLM** vartotojo žinutė: `"Apibendrinkite šį el. laišką iš $supportInbox.email.from: $supportInbox.email.text"`
- **Sąlyga**: `$supportInbox.email.subject.lower().contains("urgent")`

## Pastabos

- Daugelis tiekėjų reikalauja **programos slaptažodžio** IMAP prieigai vietoj jūsų pagrindinio paskyros slaptažodžio.
- Prisegtų failų turinys nėra įtraukiamas į workflow įvestį; tik prisegtų failų metaduomenys yra įtraukti.
- Naudokite [Send Email](./send-email-node.md), [Telegram](./telegram-node.md), [Slack](./slack-node.md) arba [DataTable](./datatable-node.md) žemiau, kad nukreiptumėte arba užfiksuotumėte naujus el. laiškus.

## Susiję

- [Triggers](../reference/triggers.md) – Visų workflow įėjimo taškų apžvalga
- [Trečiųjų šalių integracijos](../reference/integrations.md) – IMAP kredencialo nustatymas
- [Kredencialų skirtukas](../tabs/credentials-tab.md) – Pridėti ir valdyti `imap` kredencialus
- [Send Email](./send-email-node.md) – Atsakyti arba persiųsti įeinančius pranešimus
