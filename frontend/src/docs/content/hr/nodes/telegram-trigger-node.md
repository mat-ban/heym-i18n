# Telegram Trigger

**Telegram Trigger** čvor je ulazna točka bez ulaza koja pokreće workflow kada vaš Telegram bot primi webhook ažuriranje. Koristite ga za chatbotove, podršku, slash-like naredbe ili inline povratne informacije koje bi trebale proći u downstream AI i integracijske čvorove.

## Pregled

| Svojstvo | Vrijednost |
|----------|------------|
| Ulazi | 0 |
| Izlazi | 1 |
| Izlaz | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parametar | Tip | Opis |
|-----------|-----|------|
| `credentialId` | UUID | `telegram` vjerodajnica koja sadrži bot token i opcionalni webhook tajni token |

## Vodič za postavljanje

### 1. Kreirajte `telegram` Vjerodajnicu

1. Idite na **Postavke → Vjerodajnice → Nova Vjerodajnica**
2. Odaberite tip **Telegram Bot**
3. Zalijepite **Bot Token** iz BotFather-a
4. Opcionalno postavite **Webhook Tajni Token** ako želite da Telegram pošalje odgovarajući verifikacijski zaglavlje
5. Spremite vjerodajnicu

### 2. Dodajte Čvor u Vaš Workflow

1. Povucite **Telegram Trigger** na platno
2. Odaberite čvor kako biste otvorili panel Svojstva
3. Odaberite svoju `telegram` vjerodajnicu
4. Kopirajte **Webhook URL** prikazan u panelu čvora

### 3. Registrirajte Webhook u Telegramu

Koristite Bot API `setWebhook` metodu s URL-om iz čvora:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Ako ste konfigurirali tajni token u Heym-u, pošaljite istu vrijednost prilikom postavljanja webhook-a:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Izlazna Polja

Nakon što čvor aktivira, downstream čvorovi mogu pristupiti:

| Izraz | Opis |
|-------|------|
| `$nodeLabel.update` | Cjelokupni Telegram ažurirani payload |
| `$nodeLabel.message` | Primarni objekt sličan poruci iz ažuriranja |
| `$nodeLabel.message.text` | Tekst dolazne poruke |
| `$nodeLabel.message.chat.id` | Chat ID za odgovaranje downstream |
| `$nodeLabel.message.from.id` | Telegram korisnički ID |
| `$nodeLabel.callback_query` | Povratni payload kada je ažuriranje došlo iz inline tipkovnice |
| `$nodeLabel.headers` | Sanitizirana webhook zaglavlja |
| `$nodeLabel.triggered_by` | Oznaka izvora okidača (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID čvora na platnu koji je primio Telegram ažuriranje |
| `$nodeLabel.triggered_at` | ISO vremenska oznaka za ovo izvršavanje workflow-a |

## Primjer Workflow-a

**Telegram poruka → LLM → Telegram odgovor**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** oznaka: `telegramEvent`
- **LLM** korisnička poruka: `"Odgovori kratko na ovu korisničku poruku: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Sigurnost

- Ako vaša vjerodajnica ima `secret_token`, Heym provjerava `x-telegram-bot-api-secret-token` prije pokretanja workflow-a.
- Osjetljiva zaglavlja zahtjeva uklanjaju se prije nego što payload dođe do downstream čvorova.
- Webhook URL je statičan za ID čvora, tako da ga trebate ponovno registrirati samo kada se sam čvor promijeni.

## Povezano

- [Telegram Node](./telegram-node.md) – Pošaljite odgovor ili vanjsku obavijest
- [Triggers](../reference/triggers.md) – Pregled svih ulaznih točaka workflow-a
- [Third-Party Integrations](../reference/integrations.md) – Postavljanje `telegram` vjerodajnice
- [Credentials Tab](../tabs/credentials-tab.md) – Dodajte i upravljajte `telegram` vjerodajnicama
