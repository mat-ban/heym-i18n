# Discord Trigger

A **Discord Trigger** csomópont egy nulla bemenettel rendelkező belépési pont, amely fogadja a Discord Interactions API webhookokat, és automatikusan elindít egy workflow-t. Használja slash parancsokhoz, gombokhoz, modális ablakokhoz és egyéb Discord alkalmazás-interakciókhoz, amelyeknek a downstream AI vagy integrációs csomópontokba kell futniuk.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 0 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.interaction`, `$nodeLabel.type`, `$nodeLabel.data`, `$nodeLabel.headers`, `$nodeLabel.triggered_by`, `$nodeLabel.trigger_node_id`, `$nodeLabel.triggered_at` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | `discord_trigger` hitelesítési adat, amely tartalmazza a Discord alkalmazás nyilvános kulcsát |

## Beállítási útmutató

### 1. Hozzon létre egy `discord_trigger` hitelesítési adatot

1. Lépjen a **Settings → Credentials → New Credential** menüpontra
2. Válassza a **Discord Trigger (Public Key)** típust
3. Illessze be az **Application Public Key** értéket a Discord Developer Portalról:
   - **Your application → General Information → Public Key**
4. Mentse el a hitelesítési adatot

### 2. Adja hozzá a csomópontot a workflow-hoz

1. Húzza a **Discord Trigger** csomópontot a vászonra
2. Válassza ki a csomópontot a Properties panel megnyitásához
3. Válassza ki a `discord_trigger` hitelesítési adatot
4. Másolja ki a csomópont paneljén megjelenő **Interactions URL** címet

### 3. Regisztrálja az Interactions Endpointot a Discordban

1. Nyissa meg a [Discord Developer Portal](https://discord.com/developers/applications) oldalt
2. Válassza ki az alkalmazását
3. Lépjen a **General Information** vagy **Interactions** menüpontra
4. Illessze be a csomópont **Interactions Endpoint URL** címét az endpoint mezőbe
5. A Discord egy `PING` kérést küld az endpoint érvényesítéséhez, és a Heym automatikusan válaszol az aláírás ellenőrzése után
6. Mentse el a módosításokat

## Kimeneti mezők

Miután a csomópont aktiválódott, a downstream csomópontok a következőkhöz férhetnek hozzá:

| Kifejezés | Leírás |
|------------|-------------|
| `$nodeLabel.interaction` | Teljes Discord interakciós payload |
| `$nodeLabel.type` | Interakció típusa |
| `$nodeLabel.data` | Parancs, gomb vagy modális payload |
| `$nodeLabel.data.name` | Slash parancs neve, ha alkalmazható |
| `$nodeLabel.data.options` | Slash parancs opciók tömbje |
| `$nodeLabel.headers` | Tisztított webhook fejlécek |
| `$nodeLabel.triggered_by` | Trigger forrás címkéje (`"Discord"`) |
| `$nodeLabel.trigger_node_id` | A Discord interakciót fogadó vászon csomópont azonosítója |
| `$nodeLabel.triggered_at` | ISO időbélyeg ehhez a workflow futtatáshoz |

## Példa workflow

**Discord slash parancs → LLM → Output**

```
discordTrigger → llm → output
```

- **Discord Trigger** címke: `discordEvent`
- **LLM** felhasználói üzenet: `"Reply to this Discord command: $discordEvent.data.name"`
- **Output** üzenet: `$llm.text`

## Biztonság

- A kérések **Ed25519** algoritmussal kerülnek ellenőrzésre az alkalmazás nyilvános kulcsának segítségével
- Az **5 percnél** régebbi időbélyegek elutasításra kerülnek a visszajátszásos támadások csökkentése érdekében
- Az érzékeny fejlécek (`x-signature-ed25519`, `authorization` stb.) eltávolításra kerülnek, mielőtt az adatok elérnék a downstream csomópontokat
- A trigger érvényes `discord_trigger` hitelesítési adatot igényel; a kérések elutasításra kerülnek, ha a hitelesítési adat hiányzik vagy érvénytelen

## Megjegyzések

- A Heym azonnal egy halasztott Discord választ ad vissza, a workflow-t a háttérben futtatja, és a végső workflow kimenetet Discord follow-up üzenetként teszi közzé, amikor egy `Output` csomópont tartalmat állít elő
- Az interactions URL a csomópont azonosítójából származik, és stabil marad akkor is, ha a workflow-t átnevezik
- Csak akkor használjon külön [Discord Node](./discord-node.md) csomópontot, ha az interakciós follow-up mellett külön webhook bejegyzést is szeretne
- Egy `discordTrigger` csomópont általában elegendő; használjon **Switch** vagy **Condition** csomópontot downstream a különböző interakciótípusok irányításához

## Kapcsolódó

- [Discord Node](./discord-node.md) – Kimenő Discord üzenetek küldése
- [Triggers](../reference/triggers.md) – Az összes workflow belépési pont áttekintése
- [Third-Party Integrations](../reference/integrations.md) – Discord hitelesítési adat beállítása
- [Credentials Tab](../tabs/credentials-tab.md) – `discord_trigger` hitelesítési adatok hozzáadása és kezelése
