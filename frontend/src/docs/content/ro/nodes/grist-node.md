# Grist

Nodul **Grist** citește, scrie și gestionează date în foi de calcul Grist. Utilizați-l pentru operațiuni CRUD, actualizări în lot și automatizarea foilor de calcul.

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1 |
| Ieșire | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditare Grist din [Acreditări](../tabs/credentials-tab.md) |
| `gristOperation` | string | Operațiune: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | expression | ID document (din URL-ul Grist) |
| `gristTableId` | expression | ID tabel |
| `gristRecordId` | expression | ID înregistrare (operațiuni pe o singură înregistrare) |
| `gristRecordData` | JSON string | Valorile câmpurilor pentru creare/actualizare. Utilizați **ID-urile coloanelor** (de ex. `User_Name`), nu etichetele. |
| `gristRecordsData` | JSON string | Matrice de înregistrări pentru operațiuni în lot |
| `gristFilter` | JSON string | Filtru: `{"Column_ID": [values]}` |
| `gristSort` | string | Sortare: `Column_ID` sau `-Column_ID` (descendent) |
| `gristLimit` | number | Număr maxim de înregistrări (implicit: 100) |

## ID-uri de coloane vs etichete

Utilizați **ID-urile coloanelor** (cu caractere de subliniere, de ex. `User_Name`) în `gristRecordData` și în filtre, nu etichetele afișate. Utilizați `listColumns` pentru a descoperi ID-urile coloanelor.

## Exemplu – Obținere înregistrări

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

## Exemplu – Creare înregistrare

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

## Resurse conexe

- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugare cheie API Grist
- [Integrări terțe](../reference/integrations.md#grist) – Configurare acreditare Grist
