# Slack

A **Slack** csomópont üzenetet küld egy Slack csatornára egy Incoming Webhook segítségével. Használja értesítésekhez, riasztásokhoz és hibajelentésekhez.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | Továbbadja a bemenetet |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | Slack hitelesítési adat (webhook URL) a [Hitelesítési adatok](../tabs/credentials-tab.md) közül |
| `message` | expression | Üzenet szövege. Támogatja az [expressions](../reference/expression-dsl.md) kifejezéseket. |

## Beállítás

1. Hozzon létre egy Incoming Webhookot a Slack munkaterületén
2. Adjon hozzá egy Slack hitelesítési adatot a Hitelesítési adatok lapon a webhook URL-lel
3. Hivatkozzon a hitelesítési adatra a csomópontban

## Példa

```json
{
  "type": "slack",
  "data": {
    "label": "notifyTeam",
    "credentialId": "slack-credential-uuid",
    "message": "Workflow completed: $userInput.body.text"
  }
}
```

Használja az [Error Handler](./error-handler-node.md) csomóponttal hibákról szóló értesítésekhez:
```json
"message": "Error in $errorHandler.errorNode: $errorHandler.error"
```

## Egress Safety

- A hitelesítési adatban tárolt webhook URL-nek `http://` vagy `https://` sémát kell használnia, és kizárólag nyilvános címekre kell feloldódnia. A loopback, privát, link-local, multicast és cloud-metadata célpontok blokkolva vannak.
- A Heym ellenőrzi a feloldott címeket, és a küldés előtt rögzíti a kapcsolat célpontját, így egy DNS-válasz nem tudja a kérést az ellenőrzés után belső címre átirányítani. Az environment proxyk le vannak tiltva, amíg az őr aktív, és a redirectek nem kerülnek követésre.
- Azok a telepítések, amelyek belső webhook fogadóra küldenek, beállíthatják a `HEYM_HTTP_ALLOW_PRIVATE_URLS=true` értéket egy megbízható, saját üzemeltetésű példányon. Hosted vagy multi-tenant telepítéseken tartsa meg az alapértelmezett beállítást.

**Frissítési megjegyzés a v0.0.109 verzióhoz:** ez az ellenőrzés új a Slack esetében. Az olyan hitelesítési adat, amelynek webhook URL-je loopback vagy privát címre mutat, elutasításra kerül, kivéve, ha a fenti beállítás engedélyezve van.

## Kapcsolódó

- [Node Types](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Error Handler](./error-handler-node.md) – Slack küldése workflow hiba esetén
- [Credentials Tab](../tabs/credentials-tab.md) – Slack webhook hozzáadása
