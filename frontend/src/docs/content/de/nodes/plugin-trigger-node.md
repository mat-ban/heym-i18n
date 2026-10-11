# Plugin-Trigger

Der **Plugin Trigger**-Knoten ist das Trigger-Gegenstück zum
[Plugin-Knoten](./plugin-node.md). Er wird von einem installierten Plugin bereitgestellt, dessen
`kind` `trigger` ist, und erzeugt die Anfangsdaten, mit denen ein Workflow startet.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 0 |
| Ausgaben | 1 |
| Ausgabe | `$nodeLabel.<keys returned by the plugin>` |

Ein Trigger-Plugin kann jede beliebige Quelle repräsentieren — eine andere Anwendung, einen
Drittanbieter-Dienst oder eine andere Technologie — solange der Handler des Plugins die Daten
zurückgibt, mit denen der Workflow beginnen soll.

## Wann verwenden

Verwende einen Plugin Trigger-Knoten, wenn ein installiertes Plugin einen Trigger definiert, der
deinen Workflow startet. Für Plugins, die eine Aktion mitten im Workflow ausführen, verwende
stattdessen den [Plugin-Knoten](./plugin-node.md).

## Konfiguration

Wie beim Plugin-Knoten wird das Konfigurationsformular aus den Manifest-Feldern des Plugins
generiert. Nicht-geheime String-Felder verwenden die Expression-Eingabe, und geheime
Felder werden maskiert.

## Wie Plugins ausgeführt werden

Plugin-Code ist vertrauenswürdig (von Heym bereitgestellt, vom Betreiber installiert) und wird
in-process ausgeführt. Die Installation ist auf `HEYM_PLUGIN_ADMIN_EMAILS` beschränkt, und das
Subsystem wird durch `HEYM_PLUGINS_ENABLED` gesteuert. Siehe
[Ausführung & Deployment](../getting-started/running-and-deployment.md).

## Plugins erstellen

Um ein Trigger-Plugin-Paket zu erstellen, siehe
[Plugin-Entwicklung](../reference/plugin-authoring.md) für das Zip-Layout,
Manifest-Felder, Handler-Signaturen, Icons, Abhängigkeiten und das Runtime-Vertrauensmodell.
