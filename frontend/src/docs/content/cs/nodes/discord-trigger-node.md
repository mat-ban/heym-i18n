# Discord Trigger

Uzel **Discord Trigger** je vstupní bod s nulovým počtem vstupů, který přijímá webhooky Discord Interactions API a automaticky spouští workflow. Použijte jej pro slash příkazy, tlačítka, modální okna a další interakce aplikace Discord, které mají proudit do navazujících AI nebo integračních uzlů.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaj `discord_trigger` obsahující veřejný klíč aplikace Discord |

## Průvodce nastavením

### 1. Vytvořte přihlašovací údaj `discord_trigger`

1. Přejděte do **Settings → Credentials → New Credential**
2. Vyberte typ **Discord Trigger (Public Key)**
3. Vložte **Application Public Key** z Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Uložte přihlašovací údaj

### 2. Přidejte uzel do svého workflow

1. Přetáhněte **Discord Trigger** na canvas
2. Kliknutím na uzel otevřete panel Properties
3. Zvolte svůj přihlašovací údaj `discord_trigger`
4. Zkopírujte **Interactions URL** zobrazenou v panelu uzlu

### 3. Zaregistrujte Interactions Endpoint v Discordu

1. Otevřete [Discord Developer Portal](https://discord.com/developers/applications)
2. Vyberte svou aplikaci
3. Přejděte do **General Information** nebo **Interactions**
4. Vložte **Interactions Endpoint URL** uzlu do pole endpoint
5. Discord odešle požadavek `PING` pro ověření endpointu a Heym po ověření podpisu automaticky odpoví
6. Uložte změny

## Výstupní pole

Po spuštění uzlu mohou navazující uzly přistupovat k:

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.interaction` | Úplný payload interakce Discord |
| `$nodeLabel.type` | Typ interakce |
| `$nodeLabel.data` | Payload příkazu, tlačítka nebo modálního okna |
| `$nodeLabel.data.name` | Název slash příkazu, pokud je k dispozici |
| `$nodeLabel.data.options` | Pole voleb slash příkazu |
| `$nodeLabel.headers` | Sanitizované hlavičky webhooku |
| `$nodeLabel.triggered_by` | Označení zdroje triggeru (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID uzlu na canvasu, který přijal interakci Discord |
| `$nodeLabel.triggered_at` | Časové razítko ISO pro toto spuštění workflow |

## Příklad workflow

**Discord slash příkaz → LLM → Output**

```
discordTrigger → llm → output
```

- **Discord Trigger** označení: `discordEvent`
- **LLM** uživatelská zpráva: `"Reply to this Discord command: $discordEvent.data.name"`
- **Output** zpráva: `$llm.text`

## Zabezpečení

- Požadavky jsou ověřovány pomocí **Ed25519** s veřejným klíčem vaší aplikace
- Časová razítka starší než **5 minut** jsou odmítnuta, aby se snížil počet replay útoků
- Citlivé hlavičky (`x-signature-ed25519`, `authorization` atd.) jsou odstraněny předtím, než se data dostanou do navazujících uzlů
- Trigger vyžaduje platný přihlašovací údaj `discord_trigger`; požadavky jsou odmítnuty, pokud přihlašovací údaj chybí nebo je neplatný

## Poznámky

- Heym okamžitě vrátí odloženou odpověď Discord, spustí workflow na pozadí a po dokončení odešle konečný výstup workflow jako follow-up zprávu Discord, jakmile uzel `Output` vytvoří obsah
- Interactions URL je odvozena z ID uzlu a zůstává stabilní, i když je workflow přejmenováno
- Použijte běžný [Discord Node](./discord-node.md) pouze tehdy, pokud chcete kromě follow-up interakce odeslat také samostatný webhook post
- Jeden uzel `discordTrigger` obvykle stačí; použijte navazující **Switch** nebo **Condition** pro směrování různých typů interakcí

## Související

- [Discord Node](./discord-node.md) – Odesílání odchozích zpráv Discord
- [Triggers](../reference/triggers.md) – Přehled všech vstupních bodů workflow
- [Third-Party Integrations](../reference/integrations.md) – Nastavení přihlašovacích údajů Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Přidání a správa přihlašovacích údajů `discord_trigger`
