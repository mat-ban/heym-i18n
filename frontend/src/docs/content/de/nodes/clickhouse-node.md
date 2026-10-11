# ClickHouse

Der **ClickHouse**-Knoten führt CRUD-, Count- und Raw-SQL-Operationen gegen eine externe [ClickHouse](https://clickhouse.com/)-Datenbank über deren HTTP-Schnittstelle aus. Verwende ihn, um Ereignisse aus einem Workflow in eine ClickHouse-Tabelle zu schreiben, Analysedaten zu lesen oder zu aggregieren oder beliebiges SQL auszuführen — ohne HTTP-Anfragen von Hand zu schreiben.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Anmeldedaten | ClickHouse |
| Ausgabe | `$nodeLabel.rows`, `$nodeLabel.count`, `$nodeLabel.row`, `$nodeLabel.success` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | ClickHouse-Anmeldedaten aus [Anmeldedaten](../tabs/credentials-tab.md) |
| `clickhouseOperation` | string | Operation: `query`, `find`, `getAll`, `count`, `getById`, `insert`, `update`, `remove` oder `upsert` |
| `clickhouseTable` | expression | Einfacher Tabellenname. Erforderlich für jede Operation außer `query`. |
| `clickhouseQuery` | expression | Raw-SQL für `query`. `SELECT`/`SHOW`/`DESCRIBE` geben Zeilen zurück; andere Anweisungen werden als Befehle ausgeführt. |
| `clickhouseFilter` | expression | JSON-Objekt mit Gleichheitsfiltern, z. B. `{"status":"active"}`. Wird von `find`, `count`, `update` und `remove` verwendet. Werte werden parametrisiert. |
| `clickhouseLimit` | string | Maximale Zeilenanzahl für `find` / `getAll` (`0` = unbegrenzt, keine LIMIT-Klausel). Standard `100`. |
| `clickhouseSort` | expression | Optional `column` oder `column ASC\|DESC` für `find` |
| `clickhouseRowId` | expression | Wert, der für `getById` gegen die Spalte `id` der Tabelle abgeglichen wird |
| `clickhouseInputMode` | string | Für `insert`/`upsert`: `raw` JSON-Array-Modus oder `selective` Schlüssel/Wert-Feldmodus |
| `clickhouseData` | expression | JSON-Array von Zeilenobjekten für `insert`/`upsert` oder JSON-Objekt mit Spaltenwerten für `update` |
| `clickhouseMappings` | array | `{key, value}`-Paare, die verwendet werden, wenn `clickhouseInputMode` auf `selective` gesetzt ist |

## Anmeldedaten einrichten

Erstelle eine **ClickHouse**-Anmeldedaten in der [Anmeldedaten-Registerkarte](../tabs/credentials-tab.md) mit:

1. **Host** — der HTTP-Host ohne Schema, zum Beispiel `your-instance.clickhouse.cloud`
2. **Port** — der Port der HTTP-Schnittstelle (`8443` für HTTPS, `8123` für HTTP)
3. **Username** / **Password** — standardmäßig `default` mit leerem Passwort
4. **Database** — standardmäßig `default`
5. **Secure** — für HTTPS aktivieren (ClickHouse Cloud)

Der Knoten verbindet sich über den offiziellen `clickhouse-connect` HTTP-Client. Verwende **Test connection** im Anmeldedaten-Dialog, um die Erreichbarkeit vor dem Speichern zu überprüfen.

## Operationen

| Operation | Erforderliche Felder | Beschreibung |
|-----------|-----------------|-------------|
| `query` | `clickhouseQuery` | Raw-SQL ausführen. `SELECT` gibt `{rows, count}` zurück; andere Anweisungen geben `{result}` zurück. |
| `find` | `clickhouseTable` | Zeilen mit optionalen Gleichheitsfiltern, Sortierung und Limit lesen |
| `getAll` | `clickhouseTable` | Zeilen bis zum Limit ohne Filter lesen |
| `count` | `clickhouseTable` | Zeilen zählen, optional gefiltert |
| `getById` | `clickhouseTable`, `clickhouseRowId` | Eine einzelne Zeile über ihre Spalte `id` lesen |
| `insert` | `clickhouseTable`, `clickhouseData` oder Mappings | Eine oder mehrere Zeilen einfügen |
| `update` | `clickhouseTable`, `clickhouseData`, `clickhouseFilter` | Passende Zeilen über `ALTER TABLE ... UPDATE` aktualisieren |
| `remove` | `clickhouseTable`, `clickhouseFilter` | Passende Zeilen über `DELETE FROM` löschen |
| `upsert` | `clickhouseTable`, `clickhouseData` oder Mappings | Zeilen einfügen (setzt eine `ReplacingMergeTree`-Tabelle voraus) |

## Filter-Syntax

`clickhouseFilter` ist ein flaches JSON-Objekt mit Spalten-Gleichheitsprüfungen. Werte werden als gebundene Query-Parameter gesendet, sodass sie sicher gegen Injection sind.

```json
{ "status": "active", "tenant_id": 42 }
```

Dies kompiliert zu `WHERE status = {…:String} AND tenant_id = {…:Int64}`. Im Filter-Builder wird nur Gleichheit unterstützt — für Bereiche, Joins oder Aggregationen verwende die Operation `query` mit Raw-SQL.

## Eingabemodi (insert / upsert)

- **JSON-Array** (`raw`): Gib ein JSON-Array von Zeilenobjekten in `clickhouseData` an. Schlüssel, die in einer bestimmten Zeile fehlen, werden als `NULL` eingefügt. Die Spaltenmenge ist die Vereinigung der Schlüssel über alle Zeilen.
- **Schlüssel-Wert** (`selective`): Nachdem du eine Anmeldedaten und eine Tabelle ausgewählt hast, ermittelt der Editor die Tabellenspalten und erstellt ein Wertfeld pro Spalte. Pro Ausführung wird eine Zeile eingefügt; jeder Wert unterstützt Ausdrücke.

## Mutationen und ClickHouse-Semantik

ClickHouse ist eine OLAP-Datenbank, daher verhalten sich Schreibvorgänge auf Zeilenebene anders als bei einem OLTP-Speicher:

- **`update`** gibt `ALTER TABLE … UPDATE` aus und **`remove`** gibt `DELETE FROM` aus. Beide sind **asynchrone Mutationen** — sie werden schließlich angewendet und sind vergleichsweise kostspielig. Bevorzuge gebündelte Schreibvorgänge gegenüber häufigen Mutationen einzelner Zeilen.
- **`upsert`** führt ein `INSERT` aus. Um ein Merge-on-Key-Verhalten zu erhalten, hinterlege die Tabelle mit einer `ReplacingMergeTree`-Engine.
- **`getById`** setzt voraus, dass die Tabelle eine Spalte `id` hat.
- `update` und `remove` erfordern einen nicht leeren `clickhouseFilter`, um Mutationen über die gesamte Tabelle zu vermeiden.

## Ausgabe-Referenz

| Ausgabefeld | Typ | Beschreibung |
|-------------|------|-------------|
| `.rows` | array | Zurückgegebene Zeilenobjekte (`query` SELECT, `find`, `getAll`) |
| `.count` | number | Zeilenanzahl (`find`, `getAll`, `count`, `insert`/`upsert`) |
| `.row` | object | Einzelne Zeile oder `null` (`getById`) |
| `.result` | string | Befehlszusammenfassung für Nicht-SELECT-`query` |
| `.success` | boolean | Ob die Operation erfolgreich war |

## Beispiel – Ein Ereignis einfügen

```json
{
  "type": "clickhouse",
  "data": {
    "label": "logEvent",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "insert",
    "clickhouseTable": "events",
    "clickhouseInputMode": "raw",
    "clickhouseData": "[{\"id\": \"$input.id\", \"event\": \"signup\", \"ts\": \"$input.ts\"}]"
  }
}
```
## Beispiel – Aktive Benutzer zählen

```json
{
  "type": "clickhouse",
  "data": {
    "label": "activeCount",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "count",
    "clickhouseTable": "users",
    "clickhouseFilter": "{\"status\":\"active\"}"
  }
}
```

Auf die Ausgabe zugreifen: `$activeCount.count`.

## Beispiel – Tägliche Berichtabfrage

```json
{
  "type": "clickhouse",
  "data": {
    "label": "dailyReport",
    "credentialId": "clickhouse-credential-uuid",
    "clickhouseOperation": "query",
    "clickhouseQuery": "SELECT event, count() AS total FROM events WHERE ts >= today() GROUP BY event ORDER BY total DESC"
  }
}
```

Auf die Ausgabe zugreifen: `$dailyReport.rows`, `$dailyReport.count`.

## Verwandte Themen

- [Knoten-Typen](../reference/node-types.md) – Überblick über alle Knoten-Typen
- [Reiter „Anmeldedaten“](../tabs/credentials-tab.md) – ClickHouse-Anmeldedaten hinzufügen
- [Drittanbieter-Integrationen](../reference/integrations.md) – Einrichtung von Integrations-Anmeldedaten
