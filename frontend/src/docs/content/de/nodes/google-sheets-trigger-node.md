# Google Sheets-Trigger

Der **Google Sheets-Trigger**-Knoten überwacht ein Tabellenblatt und startet einen Workflow für jede hinzugefügte, aktualisierte oder gelöschte Zeile. Nutzen Sie ihn für Formularantworten, Lead-Listen und Statusspalten, die Ihr Team bearbeitet.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 0 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.event`, `$nodeLabel.row`, `$nodeLabel.changed_columns`, `$nodeLabel.key`, `$nodeLabel.spreadsheet_id`, `$nodeLabel.sheet_name`, `$nodeLabel.triggered_at` |

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `credentialId` | UUID | Google Sheets-Anmeldedaten (`google_sheets`) |
| `gstSpreadsheetId` | String | Tabellen-ID oder -URL (Spreadsheet ID) |
| `gstSheetName` | String | Tabellenblattname (Standard: `Sheet1`) |
| `gstHasHeader` | Boolean | Zeile 1 enthält Spaltenüberschriften (Standard: aktiviert) |
| `gstKeyColumn` | String | Optional, empfohlen. Überschriftenname (oder Spaltenbuchstabe ohne Kopfzeile), dessen Wert pro Zeile eindeutig ist |
| `gstEvents` | Array | Beliebige Kombination aus `created`, `updated`, `deleted` (Standard: alle drei) |
| `pollIntervalMinutes` | Integer | Abrufintervall in Minuten, in dem Heym die Tabelle prüft (Minimum und Standard: 1) |

Diese Felder akzeptieren Standardwerte, keine `$`-Ausdrücke.

## Einrichtungsanleitung

1. Erstellen Sie **Google Sheets (OAuth2)**-Anmeldedaten. Siehe [Drittanbieter-Integrationen](../reference/integrations.md#google-sheets-oauth2).
2. Ziehen Sie den **Google Sheets-Trigger** auf das Canvas und wählen Sie die Anmeldedaten aus.
3. Fügen Sie die Tabellen-URL ein, geben Sie den Blattnamen an und legen Sie eine Schlüsselspalte wie `Email` oder `ID` fest.

## Zeilenidentifikation

**Mit einer Schlüsselspalte** wird eine Zeile anhand ihres Schlüsselwerts identifiziert. Das Einfügen, Löschen oder Sortieren von Zeilen wird fehlerfrei erkannt. Zeilen mit leerem Schlüssel werden ignoriert, bis der Schlüssel ausgefüllt ist. Teilen sich zwei Zeilen denselben Schlüssel, wird die erste verwendet.
**Ohne Schlüsselspalte** wird eine Zeile anhand ihrer Zeilennummer erkannt. Das Löschen einer Zeile in der Tabellenmitte wird für alle darunterliegenden Zeilen als `updated` sowie als ein `deleted` am Tabellenende interpretiert.

## Trigger-Semantik

- Der erste Abruf erfasst den aktuellen Tabellenstand und startet keine Ausführungen.
- Leere Zeilen werden ignoriert.
- Das Bearbeiten der Kopfzeile erfasst die Tabelle neu ohne Ausführungen zu starten.
- Jede Änderung startet genau eine Ausführung mit `trigger_source = "google_sheets"`, auch wenn Heym über mehrere Worker oder Instanzen verteilt läuft. Schlägt ein Start fehl, wird die Änderung beim nächsten Abruf erneut verarbeitet. Ein Serverabsturz im Moment zwischen Erfassung und Start kann diese Änderung verwerfen; ein doppelter Lauf findet niemals statt.
- Maximal 50 Ausführungen starten pro Abruf; weitere folgen in nachfolgenden Intervallen.
- Tabellenblätter mit mehr als 10.000 Zeilen werden mit einer Warnung in den Logs übersprungen.

## Rückschreiben in dasselbe Tabellenblatt

Ein Workflow, der in dasselbe überwachte Tabellenblatt schreibt, verursacht eigene `updated`-Ereignisse. Schreibt Ihr Workflow ein Scoring oder einen Status in die Zeile zurück, aktivieren Sie ausschließlich **Zeile hinzugefügt** (`created`).

## Ausgabefelder

| Ausdruck | Beschreibung |
|------------|-------------|
| `$nodeLabel.event` | `created`, `updated`, or `deleted` |
| `$nodeLabel.row` | Aktuelle Zellen der Zeile nach Spaltennamen plus `rowIndex` |
| `$nodeLabel.row.rowIndex` | Tabellenzeilennummer |
| `$nodeLabel.changed_columns` | Geänderte Spalten. Bei `created` jede nicht leere Spalte |
| `$nodeLabel.key` | Wert der Schlüsselspalte, `null` bei `deleted` oder ohne Schlüsselspalte |
| `$nodeLabel.spreadsheet_id` | Überwachte Tabelle |
| `$nodeLabel.sheet_name` | Überwachtes Tabellenblatt |
| `$nodeLabel.triggered_at` | Zeitpunkt, zu dem die Änderung erkannt wurde |

Bei `deleted` enthält `row` nur `rowIndex`, die letzte Zeilennummer.

## Was Heym speichert

Heym speichert keine Zellwerte. Für jede Zeile wird die letzte Zeilennummer sowie ein aus dem instanzweiten `SECRET_KEY` abgeleiteter Fingerabdruck pro Zelle gespeichert. Dies genügt zur Erkennung veränderter Spalten, ohne vorherige Inhalte zu persistieren. Läufe lesen die aktuellen Zeilenwerte direkt von Google ab.

## Beispiel-Workflow

**Neue Lead-Zeile: Zeile bewerten und Score zurückschreiben**

```
googleSheetsTrigger (created only) → llm → googleSheets (updateRange) → condition → slack
```

- **Google Sheets** `gsUpdateRow`: `$newLead.row.rowIndex`

## Verwandte Themen

- [Google Sheets](./google-sheets-node.md): Zeilen während der Ausführung lesen oder schreiben
- [Google Drive Trigger](./google-drive-trigger-node.md)
- [Triggers](../reference/triggers.md)
