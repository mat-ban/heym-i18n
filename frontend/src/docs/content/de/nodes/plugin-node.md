# Plugin-Knoten

Der **Plugin**-Knoten führt eine benutzerdefinierte Aktion aus, die von einem installierten Plugin bereitgestellt wird. Plugins
erweitern Heym um neue Knotentypen — Aktionen, Third-Party-Integrationen oder alles,
was sich als Python ausdrücken lässt — ohne die Kernanwendung zu verändern.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.<keys returned by the plugin>` |

Ein Plugin-**Paket** (eine Zip-Datei) kann **mehrere Knoten** enthalten — eine beliebige Mischung aus Aktionen
und Triggern. Jeder Knoten erscheint in der Palette unter **Plugins** mit seinem eigenen
Namen und seiner eigenen Beschreibung. Wird einer auf den Canvas gezogen, entsteht ein Plugin-Knoten, der an
dieses Paket (`pluginId`) und diesen Knoten (`pluginNodeKey`) gebunden ist.

## Wann verwenden

Verwende einen Plugin-Knoten, wenn ein Operator ein Plugin installiert hat, das die gewünschte Aktion
ausführt — zum Beispiel das Aufrufen einer privaten API, die Kommunikation mit einem internen System oder
das Ausführen von speziell für deine Bereitstellung geschriebenem Code.

Für Trigger-artige Plugins, die einen Workflow starten, siehe den
[Plugin Trigger-Knoten](./plugin-trigger-node.md).

## Konfiguration

Das Konfigurationsformular des Knotens wird aus dem Manifest des Plugins generiert. Jedes Feld,
das vom Plugin deklariert wird (`string`, `number`, `boolean` oder `select`), wird
automatisch gerendert. Nicht-geheime String-Felder verwenden die Expression-Eingabe, und gespeicherte
String-Konfigurationswerte, die mit `$` beginnen, werden aufgelöst, bevor der Plugin-Handler
ausgeführt wird.

Geheime Felder (wie API-Schlüssel) werden in der UI maskiert und niemals in Logs geschrieben.

## Wie Plugins ausgeführt werden

Plugins werden von Heym bereitgestellt und von einem Operator installiert, daher ist Plugin-Code
**vertrauenswürdig** und läuft in-process wie ein integrierter Knoten, mit vollem Netzwerk- und
Bibliothekszugriff. Ein Plugin kann pip-`dependencies` deklarieren, die zum Installationszeitpunkt in
die Instanz installiert werden.

Das Installieren und Entfernen von Plugins ist auf Operatoren beschränkt, deren E-Mail in
`HEYM_PLUGIN_ADMIN_EMAILS` aufgeführt ist, und das gesamte Subsystem wird durch
`HEYM_PLUGINS_ENABLED` gesteuert (standardmäßig deaktiviert). Siehe
[Betrieb & Deployment](../getting-started/running-and-deployment.md) für die
Umgebungsvariablen.

## Benutzerdefinierte Icons

Ein Plugin kann benutzerdefinierte SVG-Logos mitliefern. Lege ein `icon.svg` im Paketstamm ab, um einen
Standard für jeden Knoten festzulegen, und/oder gib einem Knoten sein eigenes `"icon": "<file>.svg"` im
Manifest. Das Icon wird sowohl auf der Palettenkarte als auch auf dem Canvas-Knoten angezeigt; Knoten
ohne Icon fallen auf das standardmäßige Puzzle-Teil-Symbol zurück.

## AI Builder

Installierte Plugins werden dem AI-Assistenten und dem Chat-Canvas zugänglich gemacht, sodass du
Heym bitten kannst, „das Acme CRM-Plugin zu verwenden, um einen Datensatz zu erstellen", und es wird den
Plugin-Knoten mit der richtigen `pluginId` und `config` generieren.

## Plugins erstellen

Um ein Plugin-Paket zu erstellen, siehe
[Plugin-Entwicklung](../reference/plugin-authoring.md) für das Zip-Layout,
Manifest-Felder, Handler-Signaturen, Icons, Abhängigkeiten und das Runtime-Vertrauensmodell.
