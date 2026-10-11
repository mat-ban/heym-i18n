# Grist

Uzol **Grist** číta, zapisuje a spravuje údaje v tabuľkách Grist. Použite ho na operácie CRUD, dávkové aktualizácie a automatizáciu tabuliek.

## Prehľad

| Vlastnosť | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametre

| Parameter | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Prihlasovacie údaje Grist z [Prihlasovacích údajov](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operácia: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | ID dokumentu (z URL adresy Grist) |
| `gristTableId` | expression | ID tabuľky |
| `gristRecordId` | expression | ID záznamu (operácie s jedným záznamom) |
| `gristRecordData` | JSON string | Hodnoty polí pre vytvorenie/aktualizáciu. Použite **ID stĺpcov** (napr. `User_Name`), nie označenia. |
| `gristRecordsData` | JSON string | Pole záznamov pre dávkové operácie |
| `gristFilter` | JSON string | Filter: `{"Column_ID": [values]}` |
| `gristSort` | string | Zoradenie: `Column_ID` alebo `-Column_ID` (zostupne) |
| `gristLimit` | number | Maximálny počet záznamov (predvolené: 100) |

## ID stĺpcov vs označenia

V parametri `gristRecordData` a filtroch používajte **ID stĺpcov** (s podčiarknikmi, napr. `User_Name`), nie zobrazované označenia. Na zistenie ID stĺpcov použite `listColumns`.

## Príklad – Získanie záznamov

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

## Príklad – Vytvorenie záznamu

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

## Súvisiace

- [Typy uzlov](../reference/node-types.md) – Prehľad všetkých typov uzlov
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Pridanie API kľúča Grist
- [Integrácie tretích strán](../reference/integrations.md#grist) – Nastavenie prihlasovacích údajov Grist
