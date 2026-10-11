# Reiter DataTable

Der Reiter **DataTable** bietet integrierte relationale Tabellen direkt in Heym. Sie können für CRUD-Operationen in Workflows über den [DataTable-Knoten](../nodes/datatable-node.md) verwendet werden.

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Video-Demo zu DataTable ansehen</a></p>

## Tabellen erstellen

1. Klicken Sie auf **DataTable erstellen**
2. Vergeben Sie Name und Beschreibung
3. Definieren Sie Spalten mit Typ (`string`, `number`, `boolean`, `date`, `json`), Pflichtfeld-Status und Eindeutigkeit

## Spalten mit KI generieren

Statt Spalten manuell anzulegen, können Sie Ihre Anforderungen in natürlicher Sprache beschreiben (oder ein Beispiel-JSON einfügen). Die KI schlägt automatisch ein passendes Tabellenschema vor.

## Zeilen verwalten & CSV-Import/Export

- **Inline-Bearbeitung**: Doppelklick auf eine Zelle zum direkten Editieren
- **CSV-Import**: Laden Sie CSV-Dateien hoch; Heym gleicht Spalten automatisch ab
- **CSV-Export**: Laden Sie alle Datensätze als CSV herunter

## LLM-Kostentabelle (Systemtabelle)

Oberhalb Ihrer eigenen Tabellen befindet sich die fest verankerte **LLM-Kostentabelle**. Sie enthält die Preisdaten pro 1 Million Tokens für alle bekannten Sprachmodelle und wird zur Kostenberechnung im Reiter [Ausführungen](./traces-tab.md) herangezogen. Sie können Standardpreise überschreiben oder benutzerdefinierte Modelle hinzufügen.

## Verwandte Themen

- [DataTable-Knoten](../nodes/datatable-node.md) – Tabellenzugriff im Workflow
- [Reiter Ausführungen](./traces-tab.md) – Kostenkalkulation\n