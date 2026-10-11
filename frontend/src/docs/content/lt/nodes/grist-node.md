# Grist

**Grist** mazgas skaito, rašo ir valdo duomenis Grist skaičiuoklėse. Naudokite jį CRUD operacijoms, partijų atnaujinimams ir skaičiuoklių automatizavimui.

## Apžvalga

| Ypatybė | Vertė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 1 |
| Išvestis | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametrai

| Parametras | Tipas | Aprašymas |
|------------|-------|-----------|
| `credentialId` | UUID | Grist kredencialas iš [Kredencialai](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operacija: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | Dokumento ID (iš Grist URL) |
| `gristTableId` | expression | Lentelės ID |
| `gristRecordId` | expression | Įrašo ID (vieno įrašo operacijos) |
| `gristRecordData` | JSON string | Laukų vertės kūrimui/atnaujinimui. Naudokite **stulpelių ID** (pvz., `User_Name`), o ne etiketes. |
| `gristRecordsData` | JSON string | Įrašų masyvas partijų operacijoms |
| `gristFilter` | JSON string | Filtras: `{"Column_ID": [values]}` |
| `gristSort` | string | Rikiavimas: `Column_ID` arba `-Column_ID` (mažėjimo tvarka) |
| `gristLimit` | number | Maksimalus įrašų skaičius (numatytasis: 100) |

## Stulpelių ID vs Etiketės

Naudokite **stulpelių ID** (pabrūkšniniai, pvz., `User_Name`) `gristRecordData` ir filtrams, o ne rodymo etiketėms. Naudokite `listColumns`, kad atrastumėte stulpelių ID.

## Pavyzdys – Gauti Įrašus

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

## Pavyzdys – Sukurti Įrašą

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

## Susiję

- [Mazgų Tipai](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [Kredencialų Skirtukas](../tabs/credentials-tab.md) – Pridėti Grist API raktą
- [Trečiųjų Šalių Integracijos](../reference/integrations.md#grist) – Grist kredencialų nustatymas
