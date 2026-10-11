# Telegram Trigger

Uzel **Telegram Trigger** je vstupní bod s nulovým počtem vstupů, který spouští workflow ve chvíli, kdy Váš Telegram bot obdrží webhook update. Využijte jej pro chatboty, třídění požadavků podpory, příkazy podobné slash příkazům nebo callbacky inline tlačítek, které mají být předány navazujícím AI a integračním uzlům.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.update`, `$nodeLabel.message`, `$nodeLabel.callback_query`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaj typu `telegram` obsahující token bota a volitelný secret token pro webhook |

## Průvodce nastavením

### 1. Vytvořte přihlašovací údaj typu `telegram`

1. Přejděte do **Settings → Credentials → New Credential**
2. Zvolte typ **Telegram Bot**
3. Vložte **Bot Token** z BotFather
4. Volitelně nastavte **Webhook Secret Token**, pokud chcete, aby Telegram odesílal odpovídající ověřovací hlavičku
5. Uložte přihlašovací údaj

### 2. Přidejte uzel do svého workflow

1. Přetáhněte **Telegram Trigger** na canvas
2. Kliknutím na uzel otevřete panel Properties
3. Zvolte svůj přihlašovací údaj typu `telegram`
4. Zkopírujte **Webhook URL** zobrazenou v panelu uzlu

### 3. Zaregistrujte webhook v Telegramu

Použijte metodu Bot API `setWebhook` s URL adresou z uzlu:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>"
```

Pokud jste v Heymu nastavili secret token, odešlete při nastavování webhooku stejnou hodnotu:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -d "url=https://your-heym-domain/api/telegram/webhook/<node_id>" \
  -d "secret_token=<YOUR_SECRET_TOKEN>"
```

## Výstupní pole

Po spuštění uzlu mohou navazující uzly přistupovat k:

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.update` | Kompletní Telegram update payload |
| `$nodeLabel.message` | Primární objekt typu message z update |
| `$nodeLabel.message.text` | Text příchozí zprávy |
| `$nodeLabel.message.chat.id` | ID chatu pro odpověď v navazujících uzlech |
| `$nodeLabel.message.from.id` | ID telegramového uživatele |
| `$nodeLabel.callback_query` | Callback payload, pokud update přišel z inline klávesnice |
| `$nodeLabel.headers` | Sanitizované hlavičky webhooku |
| `$nodeLabel.triggered_by` | Označení zdroje triggeru (`"telegram"`) |
| `$nodeLabel.trigger_node_id` | ID uzlu na canvasu, který přijal Telegram update |
| `$nodeLabel.triggered_at` | ISO časové razítko tohoto spuštění workflow |

## Příklad workflow

**Telegram zpráva → LLM → Telegram odpověď**

```
telegramTrigger → llm → telegram
```

- **Telegram Trigger** label: `telegramEvent`
- **LLM** uživatelská zpráva: `"Reply briefly to this user message: $telegramEvent.message.text"`
- **Telegram** chatId: `$telegramEvent.message.chat.id`

## Zabezpečení

- Pokud Váš přihlašovací údaj obsahuje `secret_token`, Heym před spuštěním workflow ověří hlavičku `x-telegram-bot-api-secret-token`.
- Citlivé hlavičky požadavku jsou odstraněny ještě předtím, než payload dorazí do navazujících uzlů.
- Webhook URL je pro dané ID uzlu statická, takže ji stačí znovu zaregistrovat pouze při změně samotného uzlu.

## Související

- [Telegram Node](./telegram-node.md) – Odeslání odpovědi nebo odchozí notifikace
- [Triggers](../reference/triggers.md) – Přehled všech vstupních bodů workflow
- [Third-Party Integrations](../reference/integrations.md) – Nastavení přihlašovacích údajů pro Telegram
- [Credentials Tab](../tabs/credentials-tab.md) – Přidání a správa přihlašovacích údajů typu `telegram`
