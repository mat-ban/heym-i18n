# Slack Trigger

Uzol **Slack Trigger** je vstupný bod s nulovým počtom vstupov, ktorý prijíma webhooky zo Slack Events API a automaticky spúšťa workflow. Spracúva výzvu na overenie URL od Slacku a overuje podpisy požiadaviek pomocou signing secret.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 0 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje typu `slack_trigger` obsahujúce signing secret |

## Sprievodca nastavením

### 1. Vytvorenie prihlasovacích údajov typu `slack_trigger`

1. Prejdite do **Settings → Credentials → New Credential**
2. Vyberte typ **Slack Trigger (Signing Secret)**
3. Vložte **Signing Secret** z vašej Slack aplikácie:
   - V Slacku: **App settings → Basic Information → App Credentials → Signing Secret**
4. Uložte prihlasovacie údaje

### 2. Pridanie uzla do workflowu

1. Otvorte plátno workflowu
2. Presuňte **Slack Trigger** z panela uzlov na plátno
3. Kliknutím na uzol otvorte panel Properties
4. Vyberte svoje prihlasovacie údaje typu `slack_trigger`
5. Skopírujte **Webhook URL** zobrazenú v paneli

### 3. Konfigurácia vašej Slack aplikácie

1. V nastaveniach vašej Slack aplikácie prejdite do **Event Subscriptions**
2. Zapnite **Enable Events**
3. Vložte Webhook URL do poľa **Request URL**
4. Slack odošle výzvu na overenie URL — Heym odpovie automaticky v priebehu milisekúnd
5. Pole sa zmení na zelené: ✓ Verified
6. Prihláste sa na odber **Bot Events**, ktoré potrebujete (napr. `message.channels`, `reaction_added`)
7. Uložte zmeny a v prípade potreby znova nainštalujte aplikáciu do svojho pracovného priestoru

## Výstupné polia

Po spustení uzla môžu nadväzujúce uzly pristupovať k:

| Výraz | Popis |
|------------|-------------|
| `$nodeLabel.event` | Úplný objekt udalosti Slack |
| `$nodeLabel.event.type` | Typ udalosti (napr. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Text správy (ak je k dispozícii) |
| `$nodeLabel.event.user` | ID používateľa Slacku, ktorý udalosť spustil |
| `$nodeLabel.event.channel` | ID kanála |
| `$nodeLabel.event.ts` | Časová značka udalosti |
| `$nodeLabel.headers` | Sanitizované HTTP hlavičky od Slacku |
| `$nodeLabel.triggered_by` | Označenie zdroja spustenia (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | ID uzla na plátne, ktorý prijal udalosť Slack |

## Príklad workflowu

**Slack správa → odpoveď LLM → odoslanie do Slacku:**

```
slackTrigger → llm → slack
```

- **slackTrigger** označenie: `slackEvent`
- **LLM** používateľská správa: `"Reply to this Slack message: $slackEvent.event.text"`
- **Slack** správa: `$llm.text`

## Zabezpečenie

- Požiadavky sa overujú pomocou **HMAC-SHA256** s vaším signing secret
- Časové značky staršie ako **5 minút** sú odmietnuté (prevencia pred replay útokmi)
- Citlivé hlavičky (`x-slack-signature`, `authorization` atď.) sú odstránené predtým, než sa dostanú do nadväzujúcich uzlov
- Ak nie sú nastavené žiadne prihlasovacie údaje, uzol beží bez overenia — odporúčané len na lokálne testovanie

## Poznámky

- Heym odpovedá s `200 OK` okamžite a spúšťa workflow na pozadí — tým je splnená požiadavka Slacku na odpoveď do 3 sekúnd
- Webhook URL je odvodená z ID uzla a nikdy sa nemení, a to ani po premenovaní workflowu
- Na jeden workflow stačí jeden uzol `slackTrigger`; na smerovanie rôznych typov udalostí použite nadväzujúce uzly **Switch** alebo **Condition**
