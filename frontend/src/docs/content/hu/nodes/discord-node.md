# Discord

A **Discord** csomópont üzenetet küld egy Discord csatornára egy Incoming Webhook segítségével. Használja riasztásokhoz, workflow-értesítésekhez, bot-szerű válaszokhoz és hibajelentésekhez.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.status`, `$nodeLabel.response`, `$nodeLabel.message`, `$nodeLabel.username`, `$nodeLabel.avatar_url` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | `discord` hitelesítési adat, amely tartalmazza az incoming webhook URL-t |
| `message` | expression | A kimenő üzenet szövege. Támogatja az [expressions](../reference/expression-dsl.md) szintaxist. |
| `username` | expression | Opcionális megjelenítendő név felülírása ehhez az üzenethez |
| `avatarUrl` | expression | Opcionális avatar URL felülírása ehhez az üzenethez |

## Beállítás

1. Hozzon létre egy [Discord Webhook hitelesítési adatot](../reference/integrations.md#discord)
2. Adja hozzá a **Discord** csomópontot a workflow-hoz
3. Válassza ki a hitelesítési adatot
4. Állítsa be a `message` értékét a kimenő szövegre vagy egy felsőbb adatokból felépített sablonra
5. Opcionálisan írja felül a megjelenítendő `username` és `avatarUrl` értékeket

## Példa

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

## Kimeneti mezők

| Expression | Leírás |
|------------|-------------|
| `$nodeLabel.status` | A Discord által visszaadott HTTP státuszkód, sikeres esetben általában `204` |
| `$nodeLabel.response` | A Discord webhook által visszaadott nyers választörzs |
| `$nodeLabel.message` | A Heym által elküldött üzenet szövege |
| `$nodeLabel.username` | A webhookkal elküldött felhasználónév, ha meg van adva |
| `$nodeLabel.avatar_url` | A webhookkal elküldött avatar URL, ha meg van adva |

## Gyakori minták

- Használja a [Discord Trigger](./discord-trigger-node.md) csomópont mellett, ha az interakcióra adott válaszon túl egy további csatornabejegyzést is szeretne
- Küldjön hibaértesítéseket az [Error Handler](./error-handler-node.md) csomópontból
- Tegye közzé az [LLM](./llm-node.md) vagy [Agent](./agent-node.md) által generált összefoglalókat

## Kimenő forgalom biztonsága

- A hitelesítési adatban tárolt webhook URL-nek `http://` vagy `https://` sémát kell használnia, és kizárólag nyilvános címekre kell feloldódnia. A loopback, privát, link-local, multicast és cloud-metadata célcímek blokkolva vannak.
- A Heym ellenőrzi a feloldott címeket, és a küldés előtt rögzíti a kapcsolat célpontját, így egy DNS-válasz nem tudja a kérést az ellenőrzés után belső címre átirányítani. Az environment proxy-k le vannak tiltva, amíg az őr aktív, és a redirect-ek nem kerülnek követésre.
- Azok a telepítések, amelyek belső webhook-fogadóra küldenek, beállíthatják a `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` értéket egy megbízható, saját üzemeltetésű példányon. Hosted vagy multi-tenant telepítéseken tartsa meg az alapértelmezett beállítást.

**Frissítési megjegyzés a v0.0.109 verzióhoz:** ez az ellenőrzés új a Discord esetében. Az olyan hitelesítési adat, amelynek webhook URL-je loopback vagy privát címre mutat, elutasításra kerül, kivéve, ha a fenti beállítás engedélyezve van.

## Kapcsolódó

- [Discord Trigger](./discord-trigger-node.md) – Workflow indítása bejövő Discord interakciókból
- [Third-Party Integrations](../reference/integrations.md) – Discord hitelesítési adat beállítása
- [Credentials Tab](../tabs/credentials-tab.md) – `discord` hitelesítési adatok hozzáadása és kezelése
- [Node Types](../reference/node-types.md) – Az összes csomóponttípus áttekintése
