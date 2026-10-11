# Grist

A **Grist** csomópont adatokat olvas, ír és kezel Grist táblázatokban. CRUD műveletekhez, kötegelt frissítésekhez és táblázat-automatizáláshoz használható.

## Áttekintés

| Tulajdonság | Érték |
|----------|-------|
| Bemenetek | 1 |
| Kimenetek | 1 |
| Kimenet | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Paraméterek

| Paraméter | Típus | Leírás |
|-----------|------|-------------|
| `credentialId` | UUID | Grist hitelesítési adat a [Hitelesítési adatok](../tabs/credentials-tab.md) közül |
| `gristOperation` | string | Művelet: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | Dokumentum ID (a Grist URL-ből) |
| `gristTableId` | expression | Tábla ID |
| `gristRecordId` | expression | Rekord ID (egyrekordos műveletekhez) |
| `gristRecordData` | JSON string | Mezőértékek létrehozáshoz/frissítéshez. Használja a **oszlop ID-kat** (pl. `User_Name`), ne a címkéket. |
| `gristRecordsData` | JSON string | Rekordok tömbje kötegelt műveletekhez |
| `gristFilter` | JSON string | Szűrő: `{"Column_ID": [values]}` |
| `gristSort` | string | Rendezés: `Column_ID` vagy `-Column_ID` (csökkenő) |
| `gristLimit` | number | Rekordok maximális száma (alapértelmezett: 100) |

## Oszlop ID-k vs címkék

A `gristRecordData` és a szűrők esetében használja a **oszlop ID-kat** (aláhúzásjelekkel, pl. `User_Name`), ne a megjelenített címkéket. Az oszlop ID-k felderítéséhez használja a `listColumns` műveletet.

## Példa – Rekordok lekérése

```json
{
  "type": "grist",
  "data": {
    "label": "getUsers",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "getRecords",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristFilter": "{\"User_Status\": [\"Active\"]}",
    "gristLimit": 50
  }
}
```

## Példa – Rekord létrehozása

```json
{
  "type": "grist",
  "data": {
    "label": "createUser",
    "credentialId": "grist-credential-uuid",
    "gristOperation": "createRecord",
    "gristDocId": "doc-id",
    "gristTableId": "Users",
    "gristRecordData": "{\"User_Name\": \"$userInput.body.name\", \"Email_Address\": \"$userInput.body.email\"}"
  }
}
```

## Kapcsolódó

- [Csomóponttípusok](../reference/node-types.md) – Az összes csomóponttípus áttekintése
- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – Grist API kulcs hozzáadása
- [Külső integrációk](../reference/integrations.md#grist) – Grist hitelesítési adatok beállítása
