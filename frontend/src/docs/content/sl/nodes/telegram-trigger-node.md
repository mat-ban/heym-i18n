# Telegram Trigger

**Telegram Trigger** vozlišče je vhodna točka brez vhodnih parametrov, ki zažene workflow, ko vaš Telegram bot prejme webhook posodobitev. Uporabite ga za chatbot-e, podporo pri razvrščanju, ukaze, podobne ukazom s poševnico, ali povratne informacije z inline gumbi, ki se morajo usmeriti v spodnje AI in integracijska vozlišča.

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 0 |
| Izhodi | 1 |
| Izhod | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametri

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | `telegram` poverilnica, ki vsebuje bot token in opcijski webhook secret token |

## Navodila za nastavitev

### 1. Ustvarite `telegram` Poverilnico

1. Pojdite na **Nastavitve → Poverilnice → Nova Poverilnica**
2. Izberite tip **Telegram Bot**
3. Prilepite **Bot Token** iz BotFather
4. Po želji nastavite **Webhook Secret Token**, če želite, da Telegram pošlje ustrezno potrdilno glavo
5. Shranite poverilnico

### 2. Dodajte Vozlišče v Vaš Workflow

1. Povlecite **Telegram Trigger** na platno
2. Izberite vozlišče, da odprete ploščo lastnosti
3. Izberite svojo `telegram` poverilnico
4. Kopirajte **Webhook URL**, prikazan na plošči vozlišča

### 3. Registrirajte Webhook v Telegramu

Uporabite Bot API metodo `setWebhook` z URL-jem iz vozlišča:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Če ste v Heym konfigurirali tajni token, pošljite isto vrednost pri nastavitvi webhooka:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Izhodna Polja

Po aktivaciji vozlišča lahko spodnja vozlišča dostopajo do:

| Izraz | Opis |
|------------|-------------|
| `$nodeLabel.update` | Celoten Telegram update payload |
| `$nodeLabel.message` | Primarni objekt sporočila iz posodobitve |
| `$nodeLabel.message.text` | Besedilo prihajajočega sporočila |
| `$nodeLabel.message.chat.id` | ID klepeta za odgovarjanje spodaj |
| `$nodeLabel.message.from.id` | ID uporabnika Telegrama |
| `$nodeLabel.callback_query` | Payload povratne informacije, ko je posodobitev prišla iz inline tipkovnice |
| `$nodeLabel.headers` | Sanitizirane webhook glave |
| `$nodeLabel.triggered_by` | Oznaka vira sprožitve (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID vozlišča na platnu, ki je prejel Telegram posodobitev |
| `$nodeLabel.triggered_at` | ISO časovni žig za to izvajanje workflow-a |

## Primer Workflow-a

**Telegram sporočilo → LLM → Telegram odgovor**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** oznaka: `telegramEvent`
- **LLM** uporabniško sporočilo: `"Odgovorite kratko na to uporabniško sporočilo: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Varnost

- Če vaša poverilnica vsebuje `secret_token`, Heym preveri `x-telegram-bot-api-secret-token` pred izvajanjem workflow-a.
- Občutljive glave zahtevkov so odstranjene, preden payload doseže spodnja vozlišča.
- Webhook URL je statičen za ID vozlišča, zato ga morate ponovno registrirati le, ko se samo vozlišče spremeni.

## Sorodno

- [Telegram Node](./telegram-node.md) – Pošljite odgovor ali izhodno obvestilo
- [Triggers](../reference/triggers.md) – Pregled vseh vhodnih točk workflow-a
- [Third-Party Integrations](../reference/integrations.md) – Nastavitev `telegram` poverilnice
- [Credentials Tab](../tabs/credentials-tab.md) – Dodajte in upravljajte `telegram` poverilnice
