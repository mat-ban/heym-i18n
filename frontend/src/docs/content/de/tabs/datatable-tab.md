# Reiter DataTable

Der Reiter **DataTable** bietet integrierte relationale Tabellen direkt in Heym. Workflows können über den [DataTable-Knoten](../nodes/datatable-node.md) Datensätze in diesen Tabellen abfragen, einfügen, aktualisieren und löschen.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Video-Demo zu DataTable ansehen</a></p>

## Eine Tabelle erstellen

1. Klicken Sie auf **DataTable erstellen**
2. Vergeben Sie einen Namen und eine optionale Beschreibung
3. Definieren Sie Spalten mit Typ (`string`, `number`, `boolean`, `date`, `json`), Pflichtfeld-Status und Eindeutigkeit
4. Legen Sie optionale Standardwerte fest

## Spalten

Jede Spalte besitzt:
- **Name**: Spaltenbezeichner, der in den Knoten-Mappings des Workflows verwendet wird
- **Typ**: Datentyp — `string`, `number`, `boolean`, `date` (ISO 8601) oder `json` (beliebiges JSON-Objekt oder Array)
- **Pflichtfeld**: Wenn aktiviert, dürfen Zeilen keine Null-/Leerwerte für diese Spalte enthalten
- **Eindeutig**: Erzwingt Eindeutigkeit über alle Zeilen der Tabelle hinweg
- **Standardwert**: Wert, der verwendet wird, wenn eine neue Zeile keinen eigenen Wert bereitstellt

## Spalten mit KI generieren

Statt Spalten manuell anzulegen, können Sie Ihr Schema in natürlicher Sprache beschreiben oder Beispieldaten (JSON oder CSV) einfügen. Die KI analysiert Ihre Beschreibung und schlägt Spaltennamen, Typen und Einschränkungen vor. Sie können diese Vorschläge überprüfen und übernehmen oder anpassen.

## Zeilen verwalten

Die Tabellendetailansicht bietet eine Tabellenkalkulationsoberfläche:
- **Inline-Bearbeitung**: Doppelklick auf eine Zelle zum direkten Bearbeiten des Wertes
- **Zeilen hinzufügen**: Klicken Sie auf **Zeile hinzufügen**, um einen neuen Datensatz anzuhängen
- **Zeilen löschen**: Wählen Sie Zeilen aus und klicken Sie auf **Löschen**
- **Filtern und Sortieren**: Klicken Sie auf Spaltenköpfe zum Sortieren; nutzen Sie die Filterleiste zur Wertsuche
- **Paginierung**: Navigieren Sie mit den Seitensteuerelementen durch große Tabellen

## CSV-Import/Export

- **CSV importieren**: Laden Sie eine CSV-Datei hoch, um die Tabelle zu befüllen. Ordnen Sie CSV-Spalten bestehenden Tabellenspalten zu oder erstellen Sie neue Spalten aus nicht zugeordneten Headern
- **CSV exportieren**: Laden Sie alle Tabellendaten als CSV-Datei herunter

## Freigabe

Teilen Sie Tabellen mit anderen Benutzern oder Teams:
1. Öffnen Sie den Freigabedialog aus der Tabellendetailansicht
2. Fügen Sie Benutzer per E-Mail mit **Lese-** oder **Schreibberechtigung** hinzu
3. Fügen Sie Teams mit **Lese-** oder **Schreibberechtigung** hinzu
4. Nur-Lese-Benutzer können Daten einsehen; Benutzer mit Schreibzugriff können Zeilen und Spalten bearbeiten. Das Umbenennen der Tabelle, das Ändern ihrer Beschreibung und das Verwalten von Freigaben bleiben ausschließlich dem Eigentümer vorbehalten.

## Tabellen über den KI-Assistenten erstellen

Der Canvas-[KI-Assistent](../reference/ai-assistant.md#data-tables), der [Chat](./chat-tab.md) und das `heym_chat`-Tool im [Reiter MCP](./mcp-tab.md) können eine Ihrer Tabellen für einen erstellten Workflow auswählen oder eine neue anlegen. Sie schlagen Name und Spalten vor und erstellen die Tabelle, sobald Sie die Fragekarte absenden. Der Canvas-Assistent konfiguriert Workflow-Knoten anhand der Tabellen-Metadaten. Chat und `heym_chat` können zudem Zeilen einsehen, Spalten direkt hinzufügen oder entfernen sowie Zeilen einfügen, aktualisieren oder löschen. Nennen Sie ihnen einfach einen Tabellennamen oder den Link dieses Reiters. Schreibvorgänge erfordern Eigentümerschaft oder direkten/teamweiten **Schreibzugriff**. Das Hinzufügen von Spalten behält bestehende Daten bei; das Entfernen von Spalten löscht deren Werte aus jeder Zeile. Das Entfernen von Spalten und das Leeren aller Zeilen erfordern wie in diesem Reiter eine vorherige Bestätigung.

## In Workflows verwenden

Nutzen Sie den [DataTable-Knoten](../nodes/datatable-node.md) zur Interaktion mit Tabellen:
- **Abfragen**: Zeilen nach Bedingungen filtern und abrufen
- **Einfügen**: Neue Datensätze aus vorgelagerten Knotendaten hinzufügen
- **Aktualisieren**: Bestehende Datensätze nach Filterkriterien anpassen
- **Löschen**: Datensätze nach Filterkriterien entfernen

## LLM-Kostentabelle (Systemtabelle)

Eine schreibgeschützte Systemtabelle, die Tokenpreise verschiedener Anbieter erfasst. Workflows und der [Reiter Ausführungen](./traces-tab.md) nutzen diese Tabelle zur Berechnung von Ausführungskosten.

## Verwandte Themen

- [DataTable-Knoten](../nodes/datatable-node.md) – Tabellenzugriff im Workflow
- [KI-Assistent](../reference/ai-assistant.md) – Tabellenerstellung über den Chat
- [Reiter Ausführungen](./traces-tab.md) – Kostenkalkulation
