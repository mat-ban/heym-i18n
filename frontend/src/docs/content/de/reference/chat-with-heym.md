# Chat mit Heym

Chat mit Heym ist ein seitenbewusster Assistent, der über die Kopfzeile der Dokumentation verfügbar ist. Er öffnet sich in einem zentrierten Dialog, lässt dich eine LLM-Anmeldedaten und ein Modell auswählen und beantwortet Fragen mit der aktuellen Dokumentationsseite als erstem Kontext.

## Den Dialog öffnen

1. Öffne eine beliebige Seite unter `/docs`
2. Klicke in der Kopfzeile auf **Chat mit Heym**
3. Wähle eine [Anmeldedaten](../tabs/credentials-tab.md) und ein Modell aus
4. Stelle eine Frage zur Seite oder zur Plattform

Auf kleineren Bildschirmen ist der Trigger nur ein Icon; auf größeren Bildschirmen zeigt er das vollständige Label.

## Welchen Kontext er verwendet

- Der aktuell geöffnete Dokumentationspfad wird als kontextuelle Orientierung in die Anfrage eingefügt
- Das Backend verwendet weiterhin den bestehenden Dashboard-Chat-Endpoint und die Dokumentationssuchwerkzeuge
- Deine [Benutzerregeln](./user-settings.md) auf Kontoebene gelten weiterhin, da dasselbe Chat-Backend wiederverwendet wird
- Live-Vorbereitungsschritte werden vor der endgültigen Antwort in die Assistentenblase gestreamt, ähnlich wie beim Dashboard-Chat
- Klärungsfragen erscheinen als Karten, genau wie im [Chat-Reiter](../tabs/chat-tab.md). Wenn eine Workflow-Anfrage eine Anmeldedaten benötigt, kannst du eine auswählen oder sie über die Karte erstellen. Wenn sie eine Datentabelle benötigt, kannst du eine deiner Tabellen auswählen oder auf dieselbe Weise eine neue erstellen.

Wenn du den Dialog auf einem bestimmten Artikel öffnest, zeigt ein kleines Badge den aktiven Dokumentationspfad an, damit du bestätigen kannst, welche Seite priorisiert wird.

## Sitzungsverhalten

- Die Auswahl von Anmeldedaten und Modell bleibt erhalten, solange der Dialog gemountet bleibt
- Der Nachrichtenverlauf ist nur für die Sitzung gültig und wird gelöscht, wenn der Dialog geschlossen wird
- Klick auf den Hintergrund, `Escape` und die Schaltfläche zum Schließen setzen die Sitzung zurück
- **Stop** bricht die aktuelle Streaming-Antwort ab
- Der Dialog ist absichtlich breit und hat eine feste Größe; er bietet keinen Vollbild-Umschalter

## Wann du ihn verwenden solltest

- Stelle Folgefragen, während du eine Knoten- oder Referenzseite liest
- Kläre Funktionsunterschiede, ohne die Dokumentation zu verlassen
- Finde den richtigen Artikel, bevor du den Editor öffnest

Wenn du Workflows direkt erstellen oder ändern möchtest, verwende stattdessen den editorseitigen [KI-Assistent](./ai-assistant.md).

## Verwandte Themen

- [KI-Assistent](./ai-assistant.md) – Editor-Chat zum Erstellen von Workflows
- [Anmeldedaten-Reiter](../tabs/credentials-tab.md) – LLM-Anmeldedaten hinzufügen, die vom Dialog verwendet werden
- [Einstellungen](./user-settings.md) – Globale Benutzerregeln, die auf AI-Oberflächen angewendet werden
- [Schnellstart](../getting-started/quick-start.md) – Erster Workflow-Durchlauf
