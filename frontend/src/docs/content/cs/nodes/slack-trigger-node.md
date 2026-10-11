# Slack Trigger

Uzel **Slack Trigger** je vstupní bod bez vstupů, který přijímá webhooky ze Slack Events API a automaticky spouští workflow. Zpracovává ověřovací výzvu URL od Slacku a ověřuje podpisy požadavků pomocí signing secret.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaj `slack_trigger` obsahující signing secret |

## Průvodce nastavením

### 1. Vytvořte přihlašovací údaj `slack_trigger`

1. Přejděte do **Settings → Credentials → New Credential**
2. Vyberte typ **Slack Trigger (Signing Secret)**
3. Vložte **Signing Secret** ze své Slack aplikace:
   - Ve Slacku: **App settings → Basic Information → App Credentials → Signing Secret**
4. Uložte přihlašovací údaj

### 2. Přidejte uzel do svého workflow

1. Otevřete canvas workflow
2. Přetáhněte **Slack Trigger** z panelu uzlů na canvas
3. Klikněte na uzel pro otevření panelu Vlastnosti
4. Vyberte svůj přihlašovací údaj `slack_trigger`
5. Zkopírujte **Webhook URL** zobrazenou v panelu

### 3. Nakonfigurujte svou Slack aplikaci

1. V nastavení své Slack aplikace přejděte do **Event Subscriptions**
2. Zapněte **Enable Events**
3. Vložte Webhook URL do pole **Request URL**
4. Slack odešle ověřovací výzvu URL — Heym odpoví automaticky během milisekund
5. Pole získá zelenou barvu: ✓ Verified
6. Přihlaste se k odběru **Bot Events**, které potřebujete (např. `message.channels`, `reaction_added`)
7. Uložte změny a v případě výzvy aplikaci znovu nainstalujte do svého workspace

## Výstupní pole

Po spuštění uzlu mohou navazující uzly přistupovat k:

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.event` | Úplný objekt události Slack |
| `$nodeLabel.event.type` | Typ události (např. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Text zprávy (pokud je k dispozici) |
| `$nodeLabel.event.user` | ID uživatele Slack, který událost spustil |
| `$nodeLabel.event.channel` | ID kanálu |
| `$nodeLabel.event.ts` | Časové razítko události |
| `$nodeLabel.headers` | Sanitizované HTTP hlavičky ze Slacku |
| `$nodeLabel.triggered_by` | Označení zdroje triggeru (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID uzlu na canvasu, který přijal událost Slack |

## Příklad workflow

**Slack zpráva → odpověď LLM → odeslání do Slacku:**

```
slackTrigger → llm → slack
```

- Označení **slackTrigger**: `slackEvent`
- Uživatelská zpráva **LLM**: `"Reply to this Slack message: $slackEvent.event.text"`
- Zpráva **Slack**: `$llm.text`

## Zabezpečení

- Požadavky jsou ověřovány pomocí **HMAC-SHA256** s vaším signing secret
- Časová razítka starší než **5 minut** jsou odmítnuta (prevence replay útoků)
- Citlivé hlavičky (`x-slack-signature`, `authorization` atd.) jsou odstraněny, než se dostanou k navazujícím uzlům
- Pokud není nastaven žádný přihlašovací údaj, uzel běží bez ověřování — doporučeno pouze pro lokální testování

## Poznámky

- Heym odpovídá okamžitě `200 OK` a spouští workflow na pozadí — tím je splněn požadavek Slacku na odpověď do 3 sekund
- Webhook URL je odvozena z ID uzlu a nikdy se nemění, a to ani po přejmenování workflow
- Na jeden workflow je potřeba pouze jeden uzel `slackTrigger`; pro směrování různých typů událostí použijte navazující uzly **Switch** nebo **Condition**
