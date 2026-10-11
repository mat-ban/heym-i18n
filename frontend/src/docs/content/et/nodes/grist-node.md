# Grist

**Grist** node loeb, kirjutab ja haldab andmeid Gristi arvutustabelites. Kasutage seda CRUD-toimingute, partiivärskenduste ja arvutustabelite automatiseerimise jaoks.

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1 |
| Väljund | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parameetrid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | Gristi mandaat jaotisest [Mandaadid](../tabs/credentials-tab.md) |
| `gristOperation` | string | Toiming: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | Dokumendi ID (Gristi URL-ist) |
| `gristTableId` | expression | Tabeli ID |
| `gristRecordId` | expression | Kirje ID (üksiku kirje toimingud) |
| `gristRecordData` | JSON string | Välja väärtused loomiseks/värskendamiseks. Kasutage **veeru ID-sid** (nt `User_Name`), mitte silte. |
| `gristRecordsData` | JSON string | Kirjete massiiv partiitoimingute jaoks |
| `gristFilter` | JSON string | Filter: `{"Column_ID": [values]}` |
| `gristSort` | string | Sortimine: `Column_ID` või `-Column_ID` (kahanev) |
| `gristLimit` | number | Maksimaalne kirjete arv (vaikimisi: 100) |

## Veeru ID-d vs sildid

Kasutage **veeru ID-sid** (alajooned, nt `User_Name`) parameetris `gristRecordData` ja filtrites, mitte kuvatavaid silte. Veeru ID-de avastamiseks kasutage `listColumns`.

## Näide – Kirjete hankimine

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

## Näide – Kirje loomine

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

## Seotud

- [Node tüübid](../reference/node-types.md) – Ülevaade kõigist node tüüpidest
- [Mandaatide vahekaart](../tabs/credentials-tab.md) – Gristi API võtme lisamine
- [Kolmandate osapoolte integratsioonid](../reference/integrations.md#grist) – Gristi mandaadi seadistamine
