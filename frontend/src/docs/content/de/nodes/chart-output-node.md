# Diagramm-Ausgabe

Der **Diagramm-Ausgabe**-Knoten ist der Endknoten eines [Dashboard-Widget](../tabs/dashboard-tab.md)-Workflows. Er nimmt die von den vorgelagerten Knoten erzeugten Zeilen entgegen und wandelt sie in eine standardisierte Chart-Payload um, die das Dashboard rendert.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 0 (Endknoten) |
| Ausgabe | Standardisierte Chart-Payload |

Platziere diesen Knoten **zuletzt** in einem Dashboard-Widget-Workflow. Der Knoten davor sollte ein Array von Zeilenobjekten erzeugen, zum Beispiel:

```json
[
  { "month": "Jan", "revenue": 120 },
  { "month": "Feb", "revenue": 150 }
]
```

Wenn du nur über Beispiel-/Musterdaten verfügst (keine echte Quelle), erzeuge diese Zeilen mit einem **Set**-Knoten unter Verwendung von `$array(dict(...), dict(...))` — zum Beispiel `$array(dict(month="Jan", revenue=120), dict(month="Feb", revenue=150))`. Verwende **nicht** `${...}` oder bloße `{...}`-Objektliterale; Heym erstellt Objekte nur mit `dict(key=value)`.

## Parameter

| Parameter | Typ | Beschreibung |
|-----------|------|-------------|
| `label` | string | Knotenbezeichner (camelCase) |
| `chartType` | string | `pie`, `bar`, `line`, `area`, `table`, `numeric`, `gauge`, `scatter`, `proportion`, `barGauge`, `text` oder `hitl` |
| `orientation` | string | `vertical` oder `horizontal` (nur bei Balkendiagrammen) |
| `dataPath` | string | Punktpfad zum Zeilen-Array innerhalb der vorgelagerten Ausgabe (z. B. `data` oder `result.items`). Leer lassen für automatische Erkennung. |
| `labelField` | string | Zeilenschlüssel, der als Kategorie-Label verwendet wird (pie/bar/line) |
| `valueField` | string | Zeilenschlüssel, der als numerischer Wert verwendet wird (pie/bar/line/numeric/gauge) |
| `series` | array | Optionale Multi-Serien-Definition `[{ "name": "Sent", "field": "sent" }]` für bar/line (überschreibt `valueField`) |
| `columns` | array | Optionale Spaltenliste für `table` (standardmäßig die Schlüssel der ersten Zeile) |
| `statusColumn` | string | Optionale `table`-Spalte, die als farbige [Status-Chips](#status-chips) dargestellt wird. Muss eine der angezeigten Spalten sein. |
| `statusTones` | object | Optionale Zuordnung eines Statuswerts zu einem Farbton (`success`, `attention`, `failure`, `waiting`, `neutral`) für Werte, die nicht durch die Standardwerte abgedeckt sind |
| `xField` / `yField` | string | Zeilenschlüssel für die numerischen X- und Y-Achsen (scatter) |
| `min` / `max` | number | Numerischer Bereich für `gauge` (Standard `0` / `100`) |
| `unit` | string | Optionale Einheit, die neben einem `numeric`- oder `gauge`-Wert angezeigt wird |
| `text` | string | Markdown-Nachricht für den `text`-Chart-Typ. Leer lassen und `valueField` setzen, um eine dynamische Nachricht aus vorgelagerten Daten zu rendern. |
| `title` | string | Optionaler Chart-Titel |

## Chart-Typen

- **bar / line / area / pie** — kategorische Charts, gesteuert durch `labelField` + `valueField` (oder `series` für Multi-Serien-bar/line/area). `area` ist ein gefülltes Trend-Chart.
- **table** — Rohzeilen, die unter Verwendung von `columns` als scrollbare Tabelle gerendert werden. Eine Spalte kann als [Status-Chips](#status-chips) gerendert werden, und Zeilen können eine [Detailseite](../tabs/dashboard-tab.md#detail-pages) öffnen.
- **numeric** — ein einzelner KPI-Wert aus der ersten Zeile, mit optionaler `unit`.
- **gauge** — ein einzelner Wert, der gegen einen `min`–`max`-Bereich dargestellt wird (z. B. ein Prozentsatz). Verwendet `valueField`.
- **scatter** — X/Y-Punkte aus `xField` und `yField` für Korrelationsdiagramme.
- **proportion** — ein einzelner horizontaler Balken, der in Anteile mit einer prozentualen Legende aufgeteilt ist (z. B. eine Sprachaufschlüsselung). Verwendet `labelField` + `valueField`.
- **barGauge** — ein horizontaler Gauge pro Zeile mit einem Rot→Grün-Verlauf und einem Wert (z. B. freier Speicherplatz). Verwendet `labelField` + `valueField`, optional `unit` und `max` (standardmäßig der größte Zeilenwert).
- **text** — eine Markdown-Nachricht (z. B. eine Statusnotiz wie „Letzte Ausführung um 19:47"). Setze das Markdown in `text` für eine statische Nachricht, oder lasse `text` leer und setze `valueField`, um einen vorgelagert erzeugten String zu rendern. Unterstützt Überschriften, Fett/Kursiv, [Listen](../nodes/chart-output-node.md#interactive-task-lists), Links und Inline-Code.
- **hitl** — ein Karussell deiner ausstehenden menschlichen Reviews. Die Kopfzeile zeigt `1/n pending`; der linke Pfeil ist auf der ersten Karte deaktiviert und der rechte Pfeil auf der letzten. Der Workflow-Name öffnet diesen Lauf auf dem Canvas. **Approve**, **Request changes** und **Reject** lösen ihn auf, und das Verlaufssymbol neben dem Widget-Titel öffnet diesen Lauf im Verlaufsdialog auf derselben Seite. Dieser Chart-Typ ignoriert vorgelagerte Zeilen, sodass der Widget-Workflow nur aus dem Chart Output-Knoten besteht. Jede angemeldete Person sieht die Reviews zu Workflows, die sie besitzt.

### Interaktive Aufgabenlisten

Verwende die GitHub-flavored Markdown-Aufgabenlisten-Syntax im statischen `text`-Feld:

```markdown
- [x] Option 1
- [ ] Option 2
- [ ] Option 3
```

Im [Dashboard](../tabs/dashboard-tab.md) werden Kontrollkästchen als anklickbare Steuerelemente gerendert (kompatibel mit Dark- und Light-Modus). Das Umschalten eines Kontrollkästchens aktualisiert das `text`-Feld des Widget-Workflows und bleibt über Aktualisierungen hinweg erhalten.

**Inline-Bearbeitung:** Doppelklicke auf das Label eines Aufgabenelements, um es direkt zu bearbeiten. Drücke Enter oder klicke daneben, um zu speichern; drücke Escape, um abzubrechen. Leere das Label vollständig, um dieses Element aus der Liste zu entfernen.

**Links in Aufgabenelementen:** Wenn ein Label einen Markdown-Link enthält (`[title](url)`), öffnet ein Klick auf den Link die URL, ohne das Kontrollkästchen umzuschalten. Klicke an eine andere Stelle der Zeile, um umzuschalten.

**Nur statischer Text:** Interaktivität erfordert GFM-Aufgabenlisten-Syntax (`- [ ]` / `- [x]`). Einfache dynamische Statusnachrichten ohne Aufgabenelemente bleiben schreibgeschützt. Wenn Markdown aus `valueField` stammt, kopiert das erste Umschalten es in das statische `text`-Feld, damit Änderungen erhalten bleiben.
### Nummerierte Listen

Text-Widgets rendern Markdown mit **explizit beibehaltenen Zeilennummern**. Stelle jeder Zeile die Nummer voran, die angezeigt werden soll (z. B. `9.`, `8.`, `7.`). Heym nummeriert die Zeilen nicht für dich neu.

**Warum explizite Nummern?** Standard-Markdown-Listen (`1.`, `2.`, `3.`) werden zu HTML-`<ol>`-Listen, die nur **aufwärts** ab der ersten Nummer zählen. Eine Liste, die als `9.` / `8.` / `7.` geschrieben ist, würde in einem normalen Markdown-Renderer als `9`, `10`, `11` angezeigt. Wenn du jeder Zeile die beabsichtigte Nummer voranstellst, vermeidest du das.

**Absteigende Listen (z. B. neueste zuerst):** Erstelle das Markdown in einer Workflow-Schleife und berechne die Anzeigenummer pro Element:

```
${loop.total - loop.index}. [${item.title}](https://example.com/watch?v=${item.id})
```

Typisches Muster:

1. Rufe ein Array von Elementen ab oder erstelle es (z. B. HTTP → `body.videos`).
2. [Loop](./loop-node.md) über das Array; verwende innerhalb des Bodys eine [Variable](./variable-node.md) mit `.add()`, um pro Iteration eine nummerierte Zeile anzuhängen.
3. Nach dem **done**-Zweig der Schleife [Set](./set-node.md) `join("\n")` auf das angesammelte Array (oder ein Äquivalent) in einen einzelnen Markdown-String.
4. Richte **Diagramm-Ausgabe** `valueField` auf diesen String (oder setze statischen `text`).

Beispiel-Zeilenausdruck innerhalb der Schleife (Label `processVideos`, Elemente mit `title` und `id`):

```
$processVideos.total - $processVideos.index + ". [" + $processVideos.item.title + "](https://www.youtube.com/watch?v=" + $processVideos.item.id + ")"
```

Resultierendes Markdown:

```markdown
9. [Latest video](https://www.youtube.com/watch?v=abc)
8. [Previous video](https://www.youtube.com/watch?v=def)
1. [Oldest video](https://www.youtube.com/watch?v=xyz)
```

Für eine einfache aufsteigende Liste, die bei 1 beginnt, stelle entweder jeder Zeile eine Nummer voran (`1.`, `2.`, `3.`) oder verwende eine Schleife mit `$loop.index + 1`. Verwende [Aufzählungslisten](#interactive-task-lists) (`- item`), wenn du keine Nummern benötigst.

## Status-Chips

Eine `table` kann eine Spalte als farbige Chips darstellen. Setze **Status column** in den Knoteneigenschaften (oder `statusColumn` in der DSL) auf einen Spaltennamen. Jeder Wert erhält einen von fünf Farbtönen, und gängige Begriffe erhalten automatisch einen ohne weitere Konfiguration:

| Farbton | Standardwörter |
|------|---------------|
| `success` | success, successful, succeeded, done, complete, completed, approved, active, ok, paid, passed, healthy, resolved, won, delivered, published |
| `attention` | warning, attention, review, needs review, at risk, partial, degraded, overdue, unpaid, expiring |
| `failure` | failed, failure, error, errored, rejected, declined, blocked, lost, expired |
| `waiting` | pending, waiting, queued, running, in progress, processing, scheduled, draft, new, open |
| `neutral` | alles andere |

Der Abgleich ignoriert Groß-/Kleinschreibung, `_` und `-`, sodass `IN_PROGRESS` und `in-progress` beide als `waiting` eingestuft werden. Füge **Status tones** für weitere Werte hinzu; ein Eintrag überschreibt den Standard für diesen Wert:

```json
{
  "type": "chartOutput",
  "data": {
    "label": "invoices",
    "chartType": "table",
    "dataPath": "rows",
    "columns": ["invoice", "customer", "state"],
    "statusColumn": "state",
    "statusTones": { "Disputed": "failure" }
  }
}
```

Der Server löst jeden Wert in seinen Farbton auf, sodass Heym und Heym Work dieselben Farben anzeigen.

## Detailseiten: `$page.record`

Ein mit `?record=<value>` geöffnetes Dashboard führt jeden Widget-Workflow mit diesem Wert als `$page.record` aus. Ein Link in einer Tabellenzeile öffnet eine solche Seite; siehe [Detailseiten](../tabs/dashboard-tab.md#detail-pages). Wird das Dashboard ohne Datensatz geöffnet sowie im Ausdrucksdialog, ist `$page.record` gleich `null`. Ein Knoten mit dem Label `page` hat Vorrang davor.

Verwende diesen Wert, um genau den Datensatz abzurufen, um den es auf der Seite geht, zum Beispiel in einem [HTTP](./http-node.md)-Knoten:

```
https://crm.example.com/api/customers?id=$page.record
```

`$page.record` ist direkt der Wert der angeklickten Zeile, wie etwa `V-1002`, und kein Objekt mit Feldern. Um diesen Datensatz in einer [DataTable](./datatable-node.md) zu finden, filtere deren Datensatzspalte nach dem Wert: Operation `find` mit dem Filter `{"vendor_id": "$page.record"}`. Ein Pfad wie `$page.record.id` wird ins Leere aufgelöst, sodass ein von der KI erstelltes oder verfeinertes Widget solche Felder verwirft und stattdessen `$page.record` liest.

Der Wert stammt aus einer URL, die jeder bearbeiten kann. Das Dashboard akzeptiert zwar nur Werte im jeweiligen Datensatzformat (standardmäßig Buchstaben, Ziffern, `-`, `_` und `.`), behandle ihn jedoch trotzdem als nicht vertrauenswürdige Eingabe: Übergib ihn dort, wo der Knoten Werte maskiert, etwa als HTTP-Query-Parameter oder als Filterwert in [DataTable](./datatable-node.md) oder ClickHouse, und baue niemals Abfragetext durch String-Verkettung damit zusammen. Widgets werden unabhängig davon, wer die Seite öffnet, weiterhin im Kontext des Dashboard-Eigentümers ausgeführt.

## Wie Daten aufgelöst werden

1. Wenn `dataPath` gesetzt ist, folgt der Knoten diesem Punktpfad in die Ausgabe des vorgelagerten Knotens.
2. Andernfalls sucht er nach einem Array: eine Liste auf oberster Ebene, ein `data`-Array oder das erste listenwertige Feld.
3. Zeilen, die direkt aus einem [Data Table](./datatable-node.md)-Knoten stammen (`{id, data, created_at}`), werden mit ihren Spalten auf oberster Ebene neben `id` gelesen, sodass `labelField`, `valueField` und `columns` direkt die eigenen Spalten der Tabelle benennen.
4. Für `table` wird jede Zeile zu einer Tabellenzeile unter Verwendung von `columns` (oder den Schlüsseln der ersten Zeile). Mit `statusColumn` enthält die Payload außerdem den Farbton jedes Werts in dieser Spalte.
5. Für `numeric` und `gauge` stammt der Wert aus `valueField` in der ersten Zeile (oder dem ersten numerischen Feld).
6. Für `scatter` wird jede Zeile zu einem `[xField, yField]`-Punkt.
7. Für `text` wird die Nachricht aus `valueField` in der ersten Zeile entnommen, wenn gesetzt, andernfalls aus der statischen `text`-Konfiguration (andernfalls das erste String-Feld der ersten Zeile).

## Beispiel

```json
{
  "type": "chartOutput",
  "data": {
    "label": "revenueChart",
    "chartType": "bar",
    "orientation": "vertical",
    "dataPath": "data",
    "labelField": "month",
    "valueField": "revenue",
    "title": "Monthly revenue"
  }
}
```

Gauge (einzelner Wert vs. ein Bereich):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "cpuGauge",
    "chartType": "gauge",
    "dataPath": "rows",
    "valueField": "value",
    "min": 0,
    "max": 100,
    "unit": "%"
  }
}
```

Scatter (X/Y-Punkte):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "correlation",
    "chartType": "scatter",
    "dataPath": "rows",
    "xField": "x",
    "yField": "y"
  }
}
```

Proportion (ein Balken aufgeteilt nach Anteil + prozentuale Legende):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "languages",
    "chartType": "proportion",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "title": "Most Used Languages"
  }
}
```

Area (gefüllter Multi-Serien-Trend):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "memCpu",
    "chartType": "area",
    "dataPath": "rows",
    "labelField": "time",
    "series": [
      { "name": "Memory", "field": "memory" },
      { "name": "CPU", "field": "cpu" }
    ],
    "title": "Memory / CPU"
  }
}
```

Bar gauge (zeilenweises Gradient-Gauge mit Werten):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "freeDisk",
    "chartType": "barGauge",
    "dataPath": "rows",
    "labelField": "name",
    "valueField": "value",
    "unit": "GB",
    "title": "Free disk space"
  }
}
```

Text (eine statische Markdown-Nachricht — keine vorgelagerten Zeilen erforderlich):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "statusNote",
    "chartType": "text",
    "text": "**Last execution** at `19:47` — all checks passed ✅",
    "title": "Status"
  }
}
```

Text (dynamisch — der Nachrichten-String wird vorgelagert erzeugt und über `valueField` abgerufen):

```json
{
  "type": "chartOutput",
  "data": {
    "label": "lastRun",
    "chartType": "text",
    "dataPath": "rows",
    "valueField": "message"
  }
}
```
## Beispielhafte AI-Prompts

Beim Generieren eines Widgets mit **AI** lassen sich Prompts wie diese eindeutig jedem Typ zuordnen:

- **Balken** — „Zeige den monatlichen Umsatz der letzten 6 Monate als vertikales Balkendiagramm mit Beispieldaten."
- **Linie** — „Stelle die täglich aktiven Nutzer der letzten 14 Tage als Liniendiagramm dar."
- **Fläche** — „Zeige die Speicher- und CPU-Auslastung der letzten 24 Stunden als Flächendiagramm mit zwei Reihen. Verwende Beispieldaten."
- **Kreis** — „Schlüssele den Ausführungsstatus (Erfolg, Fehler, abgebrochen) als Kreisdiagramm auf."
- **Tabelle** — „Zeige die Top 10 Workflows nach Ausführungsanzahl als scrollbare Tabelle mit den Spalten Name und Ausführungen. Verwende Beispieldaten."
- **Numerisch** — „Zeige die heutigen gesamten Workflow-Ausführungen als einzelnen KPI mit der Einheit 'runs'. Verwende Beispieldaten."
- **Gauge** — „Zeige die aktuelle CPU-Auslastung als Gauge von 0 bis 100 Prozent."
- **Streuung** — „Stelle die Anfragelatenz gegenüber der Payload-Größe als Streudiagramm mit Beispieldaten dar."
- **Proportion** — „Zeige meine meistgenutzten Sprachen als Proportion-Balken: Kotlin 49,64 %, JavaScript 23,73 %, TypeScript 11,64 %, Java 8,92 %, Python 6,06 %. Verwende Beispieldaten."
- **Balken-Gauge** — „Zeige den freien Speicherplatz pro Volume (sda1 bis sda7) als Balken-Gauge in GB. Verwende Beispieldaten."
- **Text** — „Füge ein Text-Widget mit einer Markdown-Checkliste hinzu (ein aktiviertes Element, zwei nicht aktivierte), oder liste die 5 neuesten Tutorial-Videos in absteigender Reihenfolge auf (5. bis 1.) mit YouTube-Links — stelle jeder Zeile eine explizite Nummer voran (`5. Titel`, `4. Titel`, …)."

## Verwandte Themen

- [Dashboard-Reiter](../tabs/dashboard-tab.md) — Widgets erstellen und anordnen
- [Ausgabe-Knoten](output-node.md) — terminaler Knoten für reguläre Workflows
