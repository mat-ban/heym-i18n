# Dateianalyse

Mit der Dateianalyse können Chat, der [Agent-Knoten](../nodes/agent-node.md) und der [Code-Knoten](../nodes/code-node.md) große Dateien aus dem [Drive](./drive.md) in einer isolierten Python-Sandbox öffnen und analysieren. PDFs, Tabellenkalkulationen, CSV, DOCX und JSON werden zuerst geprüft und dann selektiv gelesen, sodass ein 200-seitiger Vertrag oder eine Tabelle mit einer Million Zeilen niemals vollständig in den Kontext eines Modells passen muss.

## Funktionsweise

Jeder Aufruf wird in einem neuen Container ohne Netzwerkzugriff ausgeführt. Die benötigten Dateien werden schreibgeschützt kopiert, der Code ausgeführt und der Container wieder entfernt. Ein kleiner Arbeitsordner bleibt zwischen den Aufrufen derselben Sitzung erhalten, sodass ein späterer Schritt auf den Ergebnissen eines früheren Schritts aufbauen kann.

| Pfad | Inhalt |
|------|--------|
| `/input` | Die Drive-Dateien dieser Sitzung, schreibgeschützt |
| `/work` | Arbeitsbereich für die Sitzung, z. B. `/work/sales.pkl` |
| `/work/out` | Dateien hier werden nach dem Aufruf im Drive gespeichert und als Links zurückgegeben |

In der Sandbox sind pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx und langdetect vorinstalliert, plus die Tesseract-OCR, die auch der [Konverter-Knoten](../nodes/converter-node.md) verwendet.

## Tools

Das Modell arbeitet mit drei Tools, plus einem vierten im Chat:

| Tool | Funktion |
|------|----------|
| `list_files` | Listet die Drive-Dateien auf, die Sie öffnen können: Name, Typ, Größe, Datum |
| `inspect_file` | Gibt Typ, Metadaten und Struktur einer Datei mit einem kurzen Auszug zurück |
| `run_python` | Führt Python für die genannten Dateien aus und gibt die Ausgabe zurück |
| `clear_workspace` | Nur Chat: Löscht den Arbeitsordner der Konversation |

`inspect_file` liest nur das, was für eine Zusammenfassung nötig ist:

| Typ | Zusammenfassung |
|-----|-----------------|
| PDF | Seitenzahl, Titel und Autor, Text-Extrahierbarkeit, Sprache, Seitengrößen, Text und Tabellen der ersten Seite. Gescannte PDFs werden per OCR gelesen (bis zu 5 Seiten) |
| XLSX / XLS | Tabellenblätter mit Zeilen- und Spaltenanzahl, Kopfzeilen, Typen, `read_hint` für pandas, benannte Bereiche, erste Zeilen |
| CSV / TSV | Zeichenkodierung, Trennzeichen, Zeilenanzahl, Spalten mit Typen, erste Zeilen |
| DOCX | Überschriften-Gliederung, Tabellen, Wort- und Zeichenanzahl, Autor und Datum |
| JSON | Root-Typ, Schlüssel, Array-Länge, Schachtelungstiefe, Beispieldatensätze |

Öffnen Sie innerhalb von `run_python` eine Datei mit dem Modul `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## Im Chat

Hängen Sie im [Chat-Tab](../tabs/chat-tab.md), im Chat von Heym Work oder über das MCP-Tool `heym_chat` PDFs, Tabellen, DOCX-, CSV- oder JSON-Dateien, Bilder (PNG, JPG, GIF, WebP) oder reine Textdateien an. Eine Nachricht kann bis zu 10 Dateien enthalten. Jede Datei wird in Ihrem Drive gespeichert; nur Name und ID werden in die Nachricht aufgenommen. Chat prüft die Datei, liest den relevanten Teil und antwortet mit Tabellen oder Auszügen.

## In Workflows

Eine Ausführung öffnet nur ihre eigenen Dateien: Dateien, die über den [Dateiupload-Trigger-Knoten](../nodes/file-upload-trigger-node.md) hochgeladen wurden, Dateien, die Knoten in das Drive geschrieben haben, und Dateien, die ein [Drive-Knoten](../nodes/drive-node.md) mit dem Schritt **Get** in derselben Ausführung abgerufen hat.

- **Agent-Knoten**: Wenn die Eingabe oder Nachricht des Agents eine Datei enthält, erhält er automatisch die obigen Tools für diese Dateien.
- **Code-Knoten**: Setzen Sie **Dateien** auf einen Ausdruck wie `$Upload.file.id`. Die Dateien werden bereitgestellt und in `params.files` aufgelistet.

## Grenzwerte

| Grenzwert | Wert |
|-----------|------|
| Arbeitsspeicher pro Aufruf | 2 GB |
| Ausführungszeit pro Aufruf | 120 Sekunden |
| Arbeitsordner pro Sitzung | 2 GB |
| Ausgabedateien pro Aufruf | 20, bis zu 100 MB pro Datei |
| Zurückgegebene Textausgabe an das Modell | 20.000 Zeichen |
| Dateien pro Aufruf | 20 |

## Sicherheit

- Die Sandbox hat kein Netzwerk, keinen Zugriff auf Heym-Einstellungen oder Secrets und läuft als unprivilegierter Benutzer.
- Dateien werden ausschließlich innerhalb der Sandbox verarbeitet.
- Im Chat folgt der Zugriff dem Drive: Sie öffnen eigene Dateien und Dateien, die mit Ihren Teams geteilt wurden.
- Das Öffnen einer Datei im Chat wird im Audit-Log protokolliert.
- Dateiinhalte werden strikt als Daten behandelt; enthaltene Anweisungen werden nicht ausgeführt.

## Voraussetzungen

Die Dateianalyse erfordert ein Sandbox-Backend auf der Heym-Instanz (Docker oder [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Verwandte Themen

- [Drive](./drive.md)
- [Code-Knoten](../nodes/code-node.md)
- [Agent-Knoten](../nodes/agent-node.md)
- [Chat-Tab](../tabs/chat-tab.md)
