# Discord

Uzol **Discord** odosiela správu do kanála Discord prostredníctvom Incoming Webhook. Použite ho na upozornenia, notifikácie workflowov, odpovede podobné botovi a hlásenie chýb.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje `discord` obsahujúce URL adresu incoming webhooku |
| `message` | expression | Text odchádzajúcej správy. Podporuje [expressions](../reference/expression-dsl.md). |
| `username` | expression | Voliteľné prepísanie zobrazovaného mena pre túto správu |
| `avatarUrl` | expression | Voliteľné prepísanie URL adresy avatara pre túto správu |

## Nastavenie

1. Vytvorte [prihlasovacie údaje Discord Webhook](../reference/integrations.md#discord)
2. Pridajte uzol **Discord** do svojho workflowu
3. Vyberte prihlasovacie údaje
4. Nastavte `message` na odchádzajúci text alebo šablónu zostavenú z údajov z predchádzajúcich uzlov
5. Voliteľne prepíšte zobrazované `username` a `avatarUrl`

## Príklad

```json
{
  "type": "discord",
  "data": {
    "label": "notifyDiscord",
    "credentialId": "discord-credential-uuid",
    "message": "Workflow completed: $input.text",
    "username": "Heym Bot",
    "avatarUrl": "https://example.com/heym.png"
  }
}
```

## Výstupné polia

| Expression | Popis |
|------------|-------------|
| `$nodeLabel.status` | HTTP stavový kód vrátený službou Discord, zvyčajne `204` pri úspechu |
| `$nodeLabel.response` | Surové telo odpovede vrátené webhookom Discord |
| `$nodeLabel.message` | Text správy, ktorú Heym odoslal |
| `$nodeLabel.username` | Používateľské meno odoslané s webhookom, ak bolo zadané |
| `$nodeLabel.avatar_url` | URL adresa avatara odoslaná s webhookom, ak bola zadaná |

## Bežné vzory

- Použite ho spolu s [Discord Trigger](./discord-trigger-node.md), ak chcete pridať ďalší príspevok do kanála nad rámec odpovede na interakciu
- Odosielajte oznámenia o zlyhaniach z [Error Handler](./error-handler-node.md)
- Zverejňujte súhrny generované pomocou [LLM](./llm-node.md) alebo [Agent](./agent-node.md)

## Bezpečnosť odchádzajúceho prenosu

- URL adresa webhooku uložená v prihlasovacích údajoch musí používať `http://` alebo `https://` a musí sa prekladať výhradne na verejné adresy. Ciele ako loopback, privátne adresy, link-local, multicast a cloud-metadata sú blokované.
- Heym overuje preložené adresy a pred odoslaním pripína cieľ pripojenia, takže odpoveď DNS nemôže po kontrole presunúť požiadavku na internú adresu. Počas aktívnej ochrany sú proxy servera prostredia zakázané a presmerovania sa nesledujú.
- Nasadenia, ktoré odosielajú na interný prijímač webhookov, môžu na dôveryhodnej self-hosted inštancii nastaviť `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. Predvolené nastavenie ponechajte na hostovaných alebo multi-tenant nasadeniach.

**Poznámka k aktualizácii na v0.0.109:** táto kontrola je pre Discord nová. Prihlasovacie údaje, ktorých URL adresa webhooku smeruje na loopback alebo privátnu adresu, sú odmietnuté, pokiaľ nie je povolené vyššie uvedené nastavenie.

## Súvisiace

- [Discord Trigger](./discord-trigger-node.md) – Spustite workflow z prichádzajúcich interakcií Discord
- [Third-Party Integrations](../reference/integrations.md) – Nastavenie prihlasovacích údajov Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Pridávanie a správa prihlasovacích údajov `discord`
- [Node Types](../reference/node-types.md) – Prehľad všetkých typov uzlov
