# Ausdrucksauswertungs-Dialog

Der Dialog zur Ausdrucksauswertung ist der erweiterte Editor für ausdrucksfähige Felder. Er öffnet sich über die Schaltfläche zum Erweitern neben einem Ausdruckseingabefeld und bietet Ihnen einen größeren Arbeitsbereich, Autovervollständigung, eine Live-Backend-Vorschau und das Durchsuchen der Ausgabe an einem Ort.

## Öffnen des Dialogs

- Klicken Sie auf die Schaltfläche zum Erweitern neben einem Ausdrucksfeld im Eigenschaftenbereich.
- Mehrzeilige Felder zeigen die Schaltfläche innerhalb des Eingabefelds.
- Einzeilige Felder zeigen die Schaltfläche rechts neben dem Eingabefeld.

## Dialog-Layout

- Der Dialog öffnet sich als zentriertes Modal mit etwa **80vw × 80vh**.
- Die Kopfzeile zeigt **Evaluate — {field name}** an, wenn die Feldbezeichnung bekannt ist.
- Der Editor behält Autovervollständigung, Navigation von Feld zu Feld und die üblichen Aktionen **Apply** / **Cancel** bei.
- Die Vorschau wird automatisch etwa **300 ms** nachdem Sie aufhören zu tippen aktualisiert.
- Drücken Sie `Ctrl` / `Cmd` + `Enter`, um den aktuellen Text zurück in das Feld zu übernehmen und den Dialog zu schließen (entspricht **Apply**).

## Ausgabebereich

Der Ausgabebereich wird automatisch aktualisiert, nachdem Sie im Editor aufhören zu tippen.

### Auswertung

| Ausdruckstyp | Ergebnis |
|---|---|
| Einzelner `$expr` (gesamtes Feld) | Nativer Wert bleibt erhalten |
| Einzelner reiner Punktpfad (gesamtes Feld, kein `$`, kein eingebetteter Zeilenumbruch) | Entspricht `$` + diesem Pfad (Backend normalisiert für die Auswertung) |
| Text mit eingebetteten `$refs` | Endergebnis ist immer eine Zeichenkette |
| Literaler Text (kein `$`, kein einzelner Punktpfad) | Wird unverändert zurückgegeben |

**Beispiele**

| Eingabe | Ergebnis |
|---|---|
| `$input.items` | `[1, 2, 3]` |
| `input.items` (entspricht `$input.items`, wenn der gesamte Wert dieser Pfad ist) | `[1, 2, 3]` |
| `Hello $input.name` | `Hello John` |
| `$input.count + 1` | `6` |
| `just text` | `just text` |

Der Auswertungskontext wird in dieser Reihenfolge aufgebaut:

- **Angeheftete Daten** (Pinned data) auf vorgelagerten Knoten
- **Ausgaben des letzten Durchlaufs** vom Canvas
- `null`, wenn keine vorgelagerten Daten verfügbar sind

Wenn der aktuelle Knoten vorgelagerte Abhängigkeiten hat, aber keiner von ihnen angeheftete Daten oder ein Ergebnis eines kürzlichen Durchlaufs aufweist, führt der Dialog zunächst einen Testlauf durch, um den Kontext aufzubauen, und wertet dann den aktuellen Text aus.

### Ausgabepfad-Auswahl

Wenn das Backend-Ergebnis ein Objekt oder Array ist, kann der Ausgabebereich anstelle von rohem JSON eine interaktive Pfadauswahl anzeigen.

- Doppelklicken Sie auf eine Zeile, um diesen Pfad an die aktuelle `$node.path`-Referenz anzuhängen.
- Klicken Sie einmal auf erweiterbare Zeilen, um Zweige zu öffnen oder zu schließen.
- Verwenden Sie das integrierte Suchfeld, um Schlüssel, Werte und Pfadzeichenketten zu durchsuchen.

## Autovervollständigung

- Tippen Sie `$`, um Vorschläge für vorgelagerte Knoten, Built-ins und Methoden zu öffnen.
- Drücken Sie `Tab` oder `Enter`, um den ausgewählten Vorschlag einzufügen.
- Verwenden Sie `↑` / `↓`, um sich durch die Vorschlagsliste zu bewegen.

### Beispielantworten

Wenn Sie eine `$…`-Referenz mit einem Punkt fortsetzen, zeigt jede Vorschlagszeile die Antwort an, die dieser Vorschlag erzeugen würde, fett gedruckt rechts in der Zeile.

- Wenn Sie `$set.listItems.first().toString().u` tippen, werden `upper`, `urlEncode`, `urlDecode` und `unescape` aufgelistet, jeweils mit ihrem ausgewerteten Ergebnis — so können Sie nach Ergebnis statt nach Namen auswählen.
- Wenn Sie `$node.text.toJson()` tippen, wird eine JSON-Zeichenkette in ein Objekt oder Array geparst. Nach `.toJson()` kann die Autovervollständigung die geparsten Schlüssel anbieten (zum Beispiel `repoUrl`), wenn eine Ausgabe des letzten Durchlaufs oder angeheftete Ausgabe verfügbar ist.
- Die Ergebnisse werden im Backend gegen dieselben angehefteten Daten und Ausgaben des letzten Durchlaufs ausgewertet, die auch die Dialogvorschau verwendet, sodass sie mit dem übereinstimmen, was das Feld erzeugen wird.
- Nur Vorschläge, die für sich allein stehen können, werden ausgewertet: Methoden ohne Argumente (`upper()`, `first()`, `keys()`, `toJson()`) und einfache Eigenschaften (`length`, `year`). Vorschläge, die zuerst Argumente benötigen — `map`, `filter`, `sort`, `replace` — bleiben leer.
- Eine Zeile bleibt leer, wenn der Kandidat keine Antwort erzeugt: ein Fehler, ein `null` oder eine Methode, die auf diesen Wert nicht anwendbar ist.
- Antworten werden auf eine Zeile gekürzt. Fahren Sie mit der Maus über eine gekürzte Antwort, um mehr davon zu sehen.

## Mit KI erstellen

Die Schaltfläche **Build with AI** erscheint in der oberen rechten Ecke des Auswertungsdialogs, wenn ein Workflow geladen ist. Sie öffnet ein verschachteltes Modal, in dem Sie den gewünschten Ausdruck in Klartext beschreiben und von einem LLM generieren lassen können.

### Funktionsweise

1. Klicken Sie auf **Build with AI** in der Symbolleiste des Auswertungsdialogs.
2. Wählen Sie eine LLM-Anmeldedaten und ein Modell aus den Dropdown-Menüs.
3. Geben Sie eine Klartextbeschreibung dessen ein, was Sie möchten — zum Beispiel *„Hole den Kundennamen aus der API-Antwort"*.
4. Klicken Sie auf **Generate**. Das Modal ruft das Backend auf, das den System-Prompt der [Ausdrucks-DSL](./expression-dsl.md) zusammen mit den Ausgaben Ihres letzten Workflow-Durchlaufs als Kontext verwendet und eine einzelne Ausdruckszeichenkette zurückgibt.
5. Der generierte Ausdruck wird sofort gegen dieselben Canvas-Daten ausgewertet, sodass Sie das Ergebnis sehen können, bevor Sie es übernehmen.
6. Klicken Sie auf **Apply**, um den Editorinhalt durch den generierten Ausdruck zu ersetzen, oder auf **Regenerate**, um es erneut zu versuchen.

### Verwendeter Kontext

Der Generator erhält die Knotenausgaben des letzten Testlaufs auf dem Canvas. Wenn der Workflow noch nicht ausgeführt wurde, generiert das LLM einen bestmöglichen Ausdruck basierend auf Knotenbezeichnungen und DSL-Konventionen.

### Voraussetzungen

- Eine LLM-Anmeldedaten (OpenAI, Google oder Custom) muss im Reiter [Credentials](./credentials.md) konfiguriert sein.
- Der Workflow muss im Editor geöffnet sein.

## Tastaturkürzel

| Kürzel | Aktion |
|---|---|
| Tipppause (~300 ms) | Backend-Vorschau aktualisieren |
| `Ctrl` / `Cmd` + `Enter` | Übernehmen und den Dialog schließen |
| `Escape` | Zuerst Autovervollständigung schließen, andernfalls den Dialog schließen |

## Verschachteltes `$` in Methodenargumenten

Für die Dialog- / Backend-Auswertung können Sie eine weitere Referenz mit einem verschachtelten `$` innerhalb von Aufrufen wie `.get($other.field)` übergeben, wenn Sie einen dynamischen Schlüssel benötigen. Sie können auch einen reinen Pfad innerhalb von `.get(...)` verwenden (zum Beispiel `other.field`); das Backend löst ihn auf dieselbe Weise auf. Gespeicherte Workflow-Felder sollten weiterhin den Regeln der [Ausdrucks-DSL](./expression-dsl.md) folgen; die Evaluate-API akzeptiert der Einfachheit halber auch einen reinen Punktpfad über die gesamte Zeile (siehe Tabelle oben).
## Navigation

Die Editoren für Set- und Execute-Mapping können **Zurück** / **Weiter**-Buttons anzeigen, damit du zwischen Feldern wechseln kannst, ohne den Dialog zu schließen.

## Verwandte Themen

- [Ausdrucks-DSL](./expression-dsl.md)
- [Knotentypen](./node-types.md)
- [Anmeldedaten](./credentials.md) — erforderlich für die Funktion „Build with AI“
- [LLM-Knoten](../nodes/llm-node.md)
- [Ausgabe-Knoten](../nodes/output-node.md)
- [Bedingungs-Knoten](../nodes/condition-node.md)
