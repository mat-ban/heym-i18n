# Discord Trigger

Uzol **Discord Trigger** je vstupný bod s nulovým počtom vstupov, ktorý prijíma webhooky z Discord Interactions API a automaticky spúšťa workflow. Použite ho pre slash príkazy, tlačidlá, modálne okná a ďalšie interakcie aplikácie Discord, ktoré majú prúdiť do nadväzných AI alebo integračných uzlov.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje typu `discord_trigger` obsahujúce verejný kľúč aplikácie Discord |

## Sprievodca nastavením

### 1. Vytvorte prihlasovacie údaje typu `discord_trigger`

1. Prejdite do **Settings → Credentials → New Credential**
2. Vyberte typ **Discord Trigger (Public Key)**
3. Vložte **Application Public Key** z Discord Developer Portal:
   - **Your application → General Information → Public Key**
4. Uložte prihlasovacie údaje

### 2. Pridajte uzol do svojho workflowu

1. Pretiahnite **Discord Trigger** na plátno
2. Kliknutím na uzol otvorte panel Properties
3. Vyberte svoje prihlasovacie údaje typu `discord_trigger`
4. Skopírujte **Interactions URL** zobrazenú v paneli uzla

### 3. Zaregistrujte Interactions Endpoint v Discorde

1. Otvorte [Discord Developer Portal](https://discord.com/developers/applications)
2. Vyberte svoju aplikáciu
3. Prejdite do **General Information** alebo **Interactions**
4. Vložte **Interactions Endpoint URL** uzla do poľa pre endpoint
5. Discord odošle požiadavku `PING` na overenie endpointu a Heym po overení podpisu automaticky odpovie
6. Uložte zmeny

## Výstupné polia

Po spustení uzla môžu nadväzné uzly pristupovať k:

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.interaction` | Úplný payload interakcie z Discordu |
| `$nodeLabel.type` | Typ interakcie |
| `$nodeLabel.data` | Payload príkazu, tlačidla alebo modálneho okna |
| `$nodeLabel.data.name` | Názov slash príkazu, ak je k dispozícii |
| `$nodeLabel.data.options` | Pole možností slash príkazu |
| `$nodeLabel.headers` | Sanitizované hlavičky webhooku |
| `$nodeLabel.triggered_by` | Označenie zdroja triggera (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | ID uzla na plátne, ktorý prijal interakciu z Discordu |
| `$nodeLabel.triggered_at` | ISO časová značka tohto spustenia workflowu |

## Príklad workflowu

**Discord slash príkaz → LLM → Output**

```
discordTrigger → llm → output
```

- Označenie **Discord Trigger**: `discordEvent`
- Používateľská správa **LLM**: `"Reply to this Discord command: $discordEvent.data.name"`
- Správa **Output**: `$llm.text`

## Zabezpečenie

- Požiadavky sa overujú pomocou **Ed25519** s verejným kľúčom vašej aplikácie
- Časové značky staršie ako **5 minút** sú odmietnuté, aby sa znížilo riziko replay útokov
- Citlivé hlavičky (`x-signature-ed25519`, `authorization` atď.) sa odstraňujú predtým, než sa dáta dostanú do nadväzných uzlov
- Trigger vyžaduje platné prihlasovacie údaje typu `discord_trigger`; požiadavky sú odmietnuté, ak prihlasovacie údaje chýbajú alebo sú neplatné

## Poznámky

- Heym okamžite vráti odloženú odpoveď pre Discord, spustí workflow na pozadí a po vytvorení obsahu uzlom `Output` zverejní konečný výstup workflowu ako follow-up v Discorde
- Interactions URL je odvodená z ID uzla a zostáva stabilná, aj keď sa workflow premenuje
- Použite bežný [Discord Node](./discord-node.md) len vtedy, ak chcete okrem follow-upu interakcie odoslať aj samostatný webhook
- Zvyčajne postačuje jeden uzol `discordTrigger`; použite **Switch** alebo **Condition** v nadväznosti na smerovanie rôznych typov interakcií

## Súvisiace

- [Discord Node](./discord-node.md) – Odosielanie odchádzajúcich správ do Discordu
- [Triggers](../reference/triggers.md) – Prehľad všetkých vstupných bodov workflowu
- [Third-Party Integrations](../reference/integrations.md) – Nastavenie prihlasovacích údajov pre Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Pridávanie a správa prihlasovacích údajov typu `discord_trigger`
