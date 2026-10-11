# Grist

**Grist**-solmu lukee, kirjoittaa ja hallinnoi tietoja Grist-taulukkolaskentaohjelmassa. Sitä voidaan käyttää CRUD-operaatioihin, eräpäivityksiin ja taulukkoautomaatioon.

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Lähtöteet | 1 |
| Lähtö | `$nodeLabel.records`, `$nodeLabel.record`, `$nodeLabel.success`, `$nodeLabel.id` |

## Parametrit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | Grist-tunnistetiedot kohdasta [Tunnistetiedot](../tabs/credentials-tab.md) |
| `gristOperation` | merkkijono | Operaatio: `getRecord`, `getRecords`, `createRecord`, `createRecords`, `updateRecord`, `updateRecords`, `deleteRecord`, `listTables`, `listColumns` |
| `gristDocId` | lauseke | Dokumenttitunniste (Grist-URL:sta) |
| `gristTableId` | lauseke | Taulukon tunniste |
| `gristRecordId` | lauseke | Tietueen tunniste (yksittäistietueoperaatiot) |
| `gristRecordData` | JSON-merkkijono | Kenttäarvot luontia/päivitystä varten. Käytä **saraketunnisteita** (esim. `User_Name`), ei näkyviä otsikoita. |
| `gristRecordsData` | JSON-merkkijono | Tietuematriisi eräoperaatioita varten |
| `gristFilter` | JSON-merkkijono | Suodatin: `{"Saraketunniste": [arvot]}` |
| `gristSort` | merkkijono | Lajittelu: `Saraketunniste` tai `-Saraketunniste` (laskeva) |
| `gristLimit` | numero | Enimmäismäärä tietueita (oletus: 100) |

## Saraketunnisteet vs. näkyvät otsikot

Käytä **saraketunnisteita** (alaviivoilla, esim. `User_Name`) `gristRecordData`-kentässä ja suodattimissa, ei näkyviä otsikoita. Käytä `listColumns`-operaatiota saraketunnisteiden selvittämiseen.

## Esimerkki – Tietueiden haku

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

## Esimerkki – Tietueen luonti

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

## Liittyvät

- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Grist-API-avaimen lisääminen
- [Kolmannen osapuolen integraatiot](../reference/integrations.md#grist) – Grist-tunnistetietojen määritys
