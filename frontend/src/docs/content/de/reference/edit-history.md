# Bearbeitungsverlauf

Der Bearbeitungsverlauf verfolgt gespeicherte Versionen eines Workflows. Verwende ihn, um Änderungen im Laufe der Zeit anzuzeigen, Versionen zu vergleichen oder zu einem früheren Zustand zurückzukehren.

**Hinweis:** Der Bearbeitungsverlauf unterscheidet sich vom [Ausführungsverlauf](./execution-history.md). Der Bearbeitungsverlauf verfolgt **Speicherungen** (Änderungen der Workflow-Struktur); der Ausführungsverlauf verfolgt **Ausführungen** (vergangene Ausführungen).

## Wo er zu finden ist

**Editor-Symbolleiste** → **Bearbeitungsverlauf** (GitBranch-Symbol)

## Versionen

Eine neue Version wird jedes Mal erstellt, wenn du den Workflow **speicherst**. Die Liste zeigt:

- **Aktuell** – Der zuletzt gespeicherte Zustand (was du auf dem Canvas siehst)
- **Version N** – Vergangene Speicherungen mit Zeitstempeln

Versionen ohne Änderungen gegenüber der vorherigen werden ausgeblendet.

## Diff-Ansicht

Wähle eine Version aus, um zu sehen, was sich im Vergleich zum aktuellen Workflow geändert hat:

| Änderungstyp | Beschreibung |
|-------------|--------------|
| **Knoten** | Hinzugefügte, entfernte oder geänderte Knoten |
| **Kanten** | Hinzugefügte, entfernte oder geänderte Verbindungen |
| **Konfiguration** | Einstellungen auf Workflow-Ebene (Authentifizierung, Ratenbegrenzungen usw.) |

Erweitere jede Änderung, um Diffs auf Feldebene zu sehen (z. B. welche Knoten-Eigenschaften sich geändert haben).

## Vorschau

Um zu sehen, wie der Workflow in einer vergangenen Version aussah, klicke neben Zurückkehren auf **Vorschau**.

Ein schreibgeschützter Canvas öffnet sich und zeigt die Knoten und Kanten dieser Version. Du kannst schwenken und zoomen, um das Layout zu erkunden; aus dieser Ansicht können keine Änderungen vorgenommen werden.

## Zurückkehren

Um eine vergangene Version wiederherzustellen:

1. Wähle die Version aus, die du möchtest
2. Klicke auf **Zurückkehren**
3. Bestätige die Aktion
4. Der aktuelle Workflow wird durch die ausgewählte Version ersetzt; die Seite wird neu geladen

Das Zurückkehren erstellt einen neuen „aktuellen" Zustand – du kannst bei Bedarf erneut zurückkehren.

## Verlauf löschen

Klicke auf das Papierkorb-Symbol in der Kopfzeile des Dialogs, um den gesamten Versionsverlauf zu entfernen. Diese Aktion kann nicht rückgängig gemacht werden. Der aktuelle Workflow bleibt erhalten; nur vergangene Versionen werden gelöscht.

## Wann Versionen erstellt werden

Versionen werden nur erstellt, wenn du **speicherst** (Strg/Cmd+S oder die Schaltfläche „Speichern"). Nicht gespeicherte Änderungen werden erst dann im Bearbeitungsverlauf gespeichert, wenn du speicherst.

Bearbeitungen von Agent-Skills sind in diesen Momentaufnahmen enthalten. Um einen einzelnen Skill zu durchsuchen oder wiederherzustellen, ohne den gesamten Workflow zurückzusetzen, verwende die Schaltfläche **Verlauf** auf der jeweiligen Skill-Karte im Eigenschaftenbereich des Agent-Knotens. Siehe [Agent-Knoten](../nodes/agent-node.md#skill-history).

## Verwandte Themen

- [Ausführungsverlauf](./execution-history.md) – Vergangene Ausführungen und Auf den Canvas bringen
- [Workflow-Struktur](./workflow-structure.md) – Format von Knoten und Kanten
- [Reiter „Workflows"](../tabs/workflows-tab.md) – Workflows erstellen und verwalten
