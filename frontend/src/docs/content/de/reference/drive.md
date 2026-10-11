# Drive

Der Reiter „Drive" bietet einen zentralen Ort zum Anzeigen, Verwalten und Teilen aller von Skills generierten Dateien.

## Zugriff auf Drive

Navigiere zum Reiter **Drive** im Dashboard. Alle von deinen Workflow-Skills generierten Dateien erscheinen hier, sortiert nach Erstellungsdatum.

## Dateiliste

Die Dateiliste zeigt:

- **Name** – Ursprünglicher Dateiname mit einem typspezifischen Symbol
- **Typ** – Datei-MIME-Typ (z. B. pdf, csv, docx)
- **Größe** – Menschenlesbare Dateigröße
- **Quelle** – Die Knotenbezeichnung, die die Datei generiert hat
- **Datum** – Wann die Datei erstellt wurde
- **Aktionen** – Schaltflächen zum Herunterladen, Teilen und Löschen

## Massenaktionen

Jede Datei, die dir gehört, hat ein Kontrollkästchen am Anfang ihrer Zeile. Dateien, die mit dir über ein Team geteilt wurden, sind schreibgeschützt und können nicht ausgewählt werden. Wähle mehrere Dateien aus (Shift-Klick wählt einen zusammenhängenden Bereich aus; das Kontrollkästchen in der Kopfzeile wählt die gesamte Seite aus), um die Massenaktionsleiste über der Liste einzublenden, und klicke dann auf **Massenaktionen**, um einen Dialog zu öffnen, der dieselbe Einstellung auf jede ausgewählte Datei anwendet:

- **Alle mit meinen Teams teilen** / **Team-Freigabe entfernen** – schaltet die Team-Freigabe für alle ausgewählten Dateien gleichzeitig um
- **Für jede Datei einen Freigabelink erstellen** – erstellt für jede ausgewählte Datei einen Freigabelink mit denselben Werten für Ablauf, Passwort und maximale Downloads

Der Dialog meldet, auf wie viele Dateien er angewendet wurde; Dateien, die dir nicht gehören, werden übersprungen. Der Selektor für Zeilen pro Seite (25 / 50 / 100 / **Alle**) am unteren Ende der Liste ermöglicht es dir, mehr Dateien auf einer Seite zu laden, sodass du über dein gesamtes Drive hinweg auswählen kannst.

## Dateien teilen

Klicke auf das Symbol **Teilen**, um den Freigabedialog zu öffnen. Du kannst mehrere Freigabelinks pro Datei mit unterschiedlichen Konfigurationen erstellen und die Datei optional mit deinen aktuellen Teams teilen.

### Öffentlicher Link (Token-basiert)

Erstelle einen Freigabelink ohne Passwort. Jeder mit dem Link kann die Datei herunterladen.

### Passwortgeschützter Link (Basic Auth)

Lege beim Erstellen der Freigabe ein Passwort fest. Die Download-URL verwendet HTTP Basic Authentication – Browser fordern beim Öffnen des Links zur Eingabe von Benutzername (`file`) und Passwort auf.

### Link-Optionen

- **Läuft ab (Stunden)** – Optional eine Ablaufzeit festlegen
- **Max. Downloads** – Optional die Anzahl der Downloads begrenzen
- Beides kann kombiniert werden für maximale Kontrolle

### Mit meinen Teams teilen

Aktiviere **Mit meinen Teams teilen**, um allen Teams, denen du derzeit angehörst, schreibgeschützten Zugriff zu gewähren. Teammitglieder können die Datei von Drive aus sehen und herunterladen sowie leseorientierte Drive-Knotenoperationen verwenden, aber nur der Dateieigentümer kann die Datei löschen, öffentliche Links erstellen oder widerrufen oder Passwort/TTL/Download-Limits ändern.

Die Einstellung ist dateispezifisch. Wenn du später einem weiteren Team beitrittst oder eines erstellst, schalte die Freigabe erneut um oder führe die Operation `shareWithMyTeams` des Drive-Knotens aus, um dieses Team hinzuzufügen. Verwende `unshareWithMyTeams`, um Team-Freigaben aus der Datei in einem Workflow zu entfernen.

### Freigaben verwalten

Der Freigabedialog zeigt alle vorhandenen Freigabelinks mit:
- Aktueller Download-Anzahl
- Ablaufstatus
- Ob Basic Auth aktiviert ist
- Schaltflächen zum Kopieren und Widerrufen

## Dateilinks in Chat & Portal

Wenn ein Skill während einer Workflow-Ausführung über den Portal-Chat oder Quick Drawer Dateien generiert, erscheinen die Download-Links automatisch in der Antwort. Benutzer können klicken, um direkt herunterzuladen.

## Speicherung

Generierte Dateien werden im Dateisystem des Servers unter `data/files/` gespeichert. In Docker-Bereitstellungen wird dies als Volume für die Persistenz eingebunden.

## Dateien aus Workflows verwalten

Der [Drive-Knoten](../nodes/drive-node.md) ermöglicht es dir, Drive-Dateien programmatisch aus einem Workflow heraus zu verwalten. Verwende ihn, um:

- **Aufzulisten** – deine Dateien auflisten und Metadaten wie Dateiname, MIME-Typ, Größe, Quelle und Download-URL zurückgeben
- **Löschen** – eine Datei löschen, nachdem sie an den Benutzer übermittelt wurde
- **Mit deinen Teams teilen oder die Freigabe aufheben** – damit Teammitglieder sie nur lesen und herunterladen können, solange die Team-Freigabe besteht
- **Ein Passwort festlegen** – für den Download-Link
- **Eine TTL festlegen** – damit der Link nach N Stunden abläuft
- **Ein Limit für maximale Downloads festlegen**

Das Konvertieren einer Datei in ein anderes Format ist Aufgabe des [Converter-Knotens](../nodes/converter-node.md) mit `conversion: "fileConvert"`. Er liest eine Drive-Datei und speichert das konvertierte Ergebnis als neue Datei.

Referenziere die Datei über ihre ID aus der Skill-Ausgabe: `$agentLabel._generated_files[0].id`

Siehe die [Drive-Knoten-Dokumentation](../nodes/drive-node.md) für Konfigurationsdetails.

## Drive-Dateien aus Skills lesen

Agent-Skills können Drive-Lesevorgänge über die Einstellung **Drive-Dateien aktivieren** auf der Skill-Karte aktivieren. Wenn aktiviert, enthält die Skill-Laufzeitumgebung einen generierten Helfer `heym_drive.py`. Skill-Code kann Helfer wie `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` und `list_drive_files` importieren.

Drive-Lesevorgänge sind auf Dateien beschränkt, auf die der Workflow-Akteur zugreifen kann: eigene Dateien und Dateien, die mit dem Akteur über Teams geteilt wurden. Verwende eine Datei-ID für die exakte Suche oder einen exakten Dateinamen, wenn der Benutzer eine Datei namentlich erwähnt. Die Dateinamenssuche gibt die neueste zugängliche Datei mit diesem Namen zurück; `list_drive_files(filename="...")` gibt alle Treffer zurück.

## Verwandtes

- [Drive-Knoten](../nodes/drive-node.md) – Workflow-Operationen (Auflisten, Abrufen, Löschen, Passwort, TTL, maximale Downloads, Team-Freigabe)
- [Drive-Reiter](../tabs/drive-tab.md) – Dateien im Dashboard durchsuchen
- [Dateigenerierung](./file-generation.md) – Wie `_generated_files` und Download-URLs erzeugt werden

## Bereinigung
Abgelaufene Freigabe-Token werden täglich automatisch bereinigt. Die Dateien selbst bleiben bestehen, bis sie manuell über den Reiter „Drive" gelöscht werden. Verwende **Alle löschen**, um jede Datei und ihre Freigabelinks in einer Aktion zu löschen.
