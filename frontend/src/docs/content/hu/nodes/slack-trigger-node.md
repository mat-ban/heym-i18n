# Slack Trigger

A **Slack Trigger** csomópont egy nulla bemenettel rendelkező belépési pont, amely Slack Events API webhookokat fogad, és automatikusan elindít egy workflow-t. Kezeli a Slack URL-ellenőrzési kihívását, valamint ellenőrzi a kérések aláírását egy signing secret segítségével.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 0 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.event`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | `slack_trigger` hitelesítési adat, amely tartalmazza a signing secretet |

## Beállítási útmutató

### 1. Hozzon létre egy `slack_trigger` hitelesítési adatot

1. Lépjen a **Settings → Credentials → New Credential** menüpontra
2. Válassza a **Slack Trigger (Signing Secret)** típust
3. Illessze be a **Signing Secret** értékét a Slack Appból:
   - A Slackben: **App settings → Basic Information → App Credentials → Signing Secret**
4. Mentse el a hitelesítési adatot

### 2. Adja hozzá a csomópontot a workflow-hoz

1. Nyissa meg a workflow vásznát
2. Húzza a **Slack Trigger** csomópontot a csomópontpanelről a vászonra
3. Kattintson a csomópontra a Properties panel megnyitásához
4. Válassza ki a `slack_trigger` hitelesítési adatot
5. Másolja ki a panelen megjelenő **Webhook URL** címet

### 3. Konfigurálja a Slack Appot

1. A Slack App beállításaiban lépjen az **Event Subscriptions** menüpontra
2. Kapcsolja be az **Enable Events** opciót
3. Illessze be a Webhook URL címet a **Request URL** mezőbe
4. A Slack egy URL-ellenőrzési kihívást küld — a Heym automatikusan, ezredmásodpercek alatt válaszol
5. A mező zöldre vált: ✓ Verified
6. Iratkozzon fel a szükséges **Bot Events** eseményekre (pl. `message.channels`, `reaction_added`)
7. Mentse el a módosításokat, és ha a rendszer kéri, telepítse újra az alkalmazást a munkaterületére

## Kimeneti mezők

Miután a csomópont aktiválódott, a downstream csomópontok a következőkhöz férhetnek hozzá:

| Kifejezés | Leírás |
|------------|-------------|
| `$nodeLabel.event` | Teljes Slack eseményobjektum |
| `$nodeLabel.event.type` | Esemény típusa (pl. `"message"`, `"reaction_added"`) |
| `$nodeLabel.event.text` | Üzenet szövege (ahol értelmezhető) |
| `$nodeLabel.event.user` | Az eseményt kiváltó Slack felhasználó azonosítója |
| `$nodeLabel.event.channel` | Csatorna azonosítója |
| `$nodeLabel.event.ts` | Esemény időbélyege |
| `$nodeLabel.headers` | A Slacktől érkező tisztított HTTP fejlécek |
| `$nodeLabel.triggered_by` | A trigger forrásának címkéje (`"Slack"`) |
| `$nodeLabel.trigger_node_id` | A Slack eseményt fogadó vászon csomópont azonosítója |

## Példa workflow

**Slack üzenet → LLM válasz → Slack küldés:**

```
slackTrigger → llm → slack
```

- **slackTrigger** címke: `slackEvent`
- **LLM** felhasználói üzenet: `"Reply to this Slack message: $slackEvent.event.text"`
- **Slack** üzenet: `$llm.text`

## Biztonság

- A kérések ellenőrzése **HMAC-SHA256** segítségével történik a signing secret használatával
- Az **5 percnél** régebbi időbélyegek elutasításra kerülnek (replay attack megelőzése)
- Az érzékeny fejlécek (`x-slack-signature`, `authorization` stb.) eltávolításra kerülnek, mielőtt elérnék a downstream csomópontokat
- Ha nincs beállítva hitelesítési adat, a csomópont ellenőrzés nélkül fut — ez csak helyi teszteléshez ajánlott

## Megjegyzések

- A Heym azonnal `200 OK` választ ad, és a workflow-t a háttérben futtatja — ez kielégíti a Slack 3 másodperces válaszidő követelményét
- A webhook URL a csomópont azonosítójából származik, és soha nem változik, még a workflow átnevezése után sem
- Workflow-nként csak egy `slackTrigger` csomópontra van szükség; a különböző eseménytípusok irányításához használjon **Switch** vagy **Condition** csomópontokat downstream
