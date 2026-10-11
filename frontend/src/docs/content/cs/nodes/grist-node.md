# Grist

Uzel **Grist** čte, zapisuje a spravuje data v tabulkách Grist. Použijte jej pro CRUD operace, dávkové aktualizace a automatizaci tabulek.

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1 |
| Výstup | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametry

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaje Grist z [Přihlašovacích údajů](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operace: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | ID dokumentu (z URL adresy Grist) |
| `gristTableId` | expression | ID tabulky |
| `gristRecordId` | expression | ID záznamu (operace s jedním záznamem) |
| `gristRecordData` | JSON string | Hodnoty polí pro vytvoření/aktualizaci. Použijte **ID sloupců** (např. `User_Name`), nikoli popisky. |
| `gristRecordsData` | JSON string | Pole záznamů pro dávkové operace |
| `gristFilter` | JSON string | Filtr: `{"Column_ID": [values]}` |
| `gristSort` | string | Řazení: `Column_ID` nebo `-Column_ID` (sestupně) |
| `gristLimit` | number | Maximální počet záznamů (výchozí: 100) |

## ID sloupců vs. popisky

V `gristRecordData` a filtrech používejte **ID sloupců** (s podtržítky, např. `User_Name`), nikoli zobrazované popisky. Pro zjištění ID sloupců použijte `listColumns`.

## Příklad – Získání záznamů

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

## Příklad – Vytvoření záznamu

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

## Související

- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [Záložka Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání API klíče Grist
- [Integrace třetích stran](../reference/integrations.md#grist) – Nastavení přihlašovacích údajů Grist
