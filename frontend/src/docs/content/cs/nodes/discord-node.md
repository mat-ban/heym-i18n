# Discord

Uzel **Discord** odesílá zprávu do kanálu Discord prostřednictvím Incoming Webhook. Použijte jej pro výstrahy, oznámení o průběhu workflow, odpovědi podobné botům a hlášení chyb.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaj `discord` obsahující URL příchozího webhooku |
| `message` | expression | Text odchozí zprávy. Podporuje [expressions](../reference/expression-dsl.md). |
| `username` | expression | Volitelné přepsání zobrazovaného jména pro tuto zprávu |
| `avatarUrl` | expression | Volitelné přepsání URL avataru pro tuto zprávu |

## Nastavení

1. Vytvořte [přihlašovací údaj Discord Webhook](../reference/integrations.md#discord)
2. Přidejte uzel **Discord** do svého workflow
3. Vyberte přihlašovací údaj
4. Nastavte `message` na odchozí text nebo šablonu sestavenou z dat z předchozích uzlů
5. Volitelně přepište zobrazované `username` a `avatarUrl`

## Příklad

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

## Výstupní pole

| Expression | Popis |
|------------|-------------|
| `$nodeLabel.status` | HTTP stavový kód vrácený službou Discord, obvykle `204` při úspěchu |
| `$nodeLabel.response` | Nezpracované tělo odpovědi vrácené webhookem Discord |
| `$nodeLabel.message` | Text zprávy, kterou Heym odeslal |
| `$nodeLabel.username` | Uživatelské jméno odeslané s webhookem, pokud bylo zadáno |
| `$nodeLabel.avatar_url` | URL avataru odeslaná s webhookem, pokud byla zadána |

## Běžné vzory použití

- Použijte jej společně s [Discord Trigger](./discord-trigger-node.md), pokud chcete kromě odpovědi na interakci odeslat příspěvek i do dalšího kanálu
- Odesílejte oznámení o selhání z [Error Handler](./error-handler-node.md)
- Zveřejňujte souhrny generované uzlem [LLM](./llm-node.md) nebo [Agent](./agent-node.md)

## Zabezpečení odchozího provozu

- URL webhooku uložená v přihlašovacím údaji musí používat `http://` nebo `https://` a překládat se výhradně na veřejné adresy. Cíle typu loopback, privátní, link-local, multicast a cloud-metadata jsou blokovány.
- Heym ověřuje přeložené adresy a před odesláním připíná cíl připojení, takže odpověď DNS nemůže po kontrole přesunout požadavek na interní adresu. Během aktivní ochrany jsou proxy serveru prostředí zakázány a přesměrování nejsou následována.
- Nasazení, která odesílají na interní příjemce webhooků, mohou na důvěryhodné self-hosted instanci nastavit `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`. U hostovaných nebo multi-tenant nasazení ponechte výchozí hodnotu.

**Poznámka k upgradu na v0.0.109:** tato kontrola je pro Discord nová. Přihlašovací údaj, jehož URL webhooku směřuje na loopback nebo privátní adresu, je odmítnut, pokud není výše uvedené nastavení povoleno.

## Související

- [Discord Trigger](./discord-trigger-node.md) – Spuštění workflow z příchozích interakcí Discord
- [Third-Party Integrations](../reference/integrations.md) – Nastavení přihlašovacích údajů Discord
- [Credentials Tab](../tabs/credentials-tab.md) – Přidání a správa přihlašovacích údajů `discord`
- [Node Types](../reference/node-types.md) – Přehled všech typů uzlů
