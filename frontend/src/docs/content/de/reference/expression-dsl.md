# Ausdrucks-DSL

Heym verwendet eine einfache Ausdruckssprache, um auf Daten aus vorgelagerten Knoten zu verweisen. Verwende Ausdrücke in der Knotenkonfiguration wie LLM `userMessage`, Condition `condition`, Output `message`, Set-Zuordnungen und Variablenwerten. Verwende den [Ausdrucksauswertungs-Dialog](./expression-evaluation-dialog.md) für einen größeren Editor, eine backend-gestützte Live-Vorschau und die Auswahl von Ausgabepfaden.

## Grundlegende Referenzen

### Input-Knoten vs. benannte Knoten

- **`$input`** – Verwende dies nur, wenn es einen einzelnen vorgelagerten [Input](../nodes/input-node.md)-Knoten gibt und du auf dessen Ausgabe verweisen möchtest. Beispiel: `$input.text`. Dies ist eine Kurzform für „die Daten aus dem verbundenen Input".
- **`$nodeLabel.field`** – Verwende dies, um auf einen beliebigen vorgelagerten Knoten über sein **Label** (das `label` in den Daten des Knotens) zu verweisen. Bevorzuge dies, wenn du mehrere Knoten hast oder wenn der AI Assistant / Workflow DSL explizite Labels erwartet. Beispiel: `$userInput.body.text`, `$myLLM.text`.

**Wann was verwenden:**

| Kontext | Bevorzugen | Beispiel |
|--------|--------|---------|
| Einzelner Input-Knoten, einfacher Flow | `$input.text` | Output-Nachricht aus einem Input |
| Mehrere Knoten oder benannte Referenzen | `$nodeLabel.field` | `$userInput.body.text`, `$fetchLLM.text` |
| [KI-Assistent](./ai-assistant.md) / Workflow JSON | Immer `$nodeLabel.field` | Der Workflow-Builder erwartet Labels, nicht `$input` |

### Input-Knoten

Verwende `$input`, um auf die Daten des Input-Knotens zu verweisen, wenn es einen einzelnen vorgelagerten Input gibt:

```
$input.text
```

### Benannte Knoten

Verweise auf einen beliebigen vorgelagerten Knoten über sein Label. Wenn ein Knoten [pinned data](./canvas-features.md#data-pin) hat, verwendet die Ausdrucksvervollständigung diese anstelle der Ausführungsausgabe.

```
$llm.text
$httpResponse.body
$condition
```

### Anmeldedaten

Verwende `$credentials.CredentialName`, um auf Anmeldedaten-Werte (z. B. API-Schlüssel, Bearer-Token oder Notion-Integrationstoken) über den Namen zu verweisen. Siehe [Freigabe von Anmeldedaten](./credentials-sharing.md).

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Namen, die keine einfachen Bezeichner sind (sie enthalten `-`, beginnen mit einer Ziffer oder sind reservierte Wörter), verwenden die Klammerform: `$credentials["my-api-key"]`.

### Globale Variablen

Verwende `$global.variableName`, um auf [Globale Variablen](./global-variables.md) zu verweisen – persistente, benutzerspezifische Schlüssel-Wert-Daten, die im [Reiter Variablen](../tabs/global-variables-tab.md) verwaltet werden.

```
$global.environment
$global.settings.baseUrl
```

### Verschachtelte Felder

Verwende die Punktnotation für verschachtelte Objekte:

```
$llm.choices[0].message.content
$input.metadata.userId
```

## Literale

- **Strings**: `"hello"` oder `'hello'`
- **Zahlen**: `42`, `3.14`
- **Booleans**: `true`, `false`
- **Null**: `null`

## Typerhaltung

Wenn der **gesamte** Wert ein einzelner `$expr` ist, bewahrt das Backend den nativen Typ:

- `$node.items` → `[1, 2, 3]`
- `$node.meta` → `{"key": "value"}`
- `$node.active` → `true`

Wenn ein Ausdruck Teil eines größeren Strings ist, ist das Endergebnis immer ein String:

- `Count: $node.count` → `"Count: 5"`
- `Hello $node.name` → `"Hello Ada"`

## Sticky Notes

[Sticky Note](../nodes/sticky-note-node.md)-Knoten sind Canvas-Dokumentation, keine ausführbaren Ausdrucksfelder. Ihr `note`-Inhalt wird als Markdown gerendert, verwende daher reguläre Markdown-Links und -Bilder anstelle von `$...`-Ausdrücken.

Sticky Notes unterstützen einen benutzerdefinierten Anzeigetitel und sechs gespeicherte Hintergrundfarben:

```json
{
  "type": "sticky",
  "data": {
    "label": "stickyNote",
    "stickyTitle": "Launch Notes",
    "stickyColor": "sky",
    "note": "![Heym Logo](https://heym.run/og-image.png)\n\n[Heym.run](https://heym.run)"
  }
}
```

Erlaubte `stickyColor`-Werte sind `yellow`, `sky`, `emerald`, `rose`, `violet` und `zinc`.

## Arithmetik

Unterstützte Operatoren: `+`, `-`, `*`, `/`, `%`

```
$input.count + 1
$llm.tokens * 2
```

## Vergleiche

Verwende in [Condition](../nodes/condition-node.md)-Knoten: `==`, `!=`, `>`, `<`, `>=`, `<=`, `&&`, `||`

```
$input.text.length > 0
$llm.text != ""
```

## Loop-Kontext

Innerhalb eines [Loop](../nodes/loop-node.md)-Knotens verwende `item`, um auf das aktuelle Array-Element zu verweisen:

```
item.name
item.value
```

## Spezielle Variablen
- `$now` - Aktuelles Datum und Uhrzeit mit Formatierungsmethoden
- `$Date()` - Datum erstellen/parsen (z. B. `$Date("2024-01-15")`)
- `$UUID` - 32-stellige eindeutige Kennung generieren (KEINE Klammern; verwende `$UUID`, nicht `$UUID()`)
- `$workflowName` - Name des aktuellen Workflows
- `$workflowDescription` - Beschreibung des aktuellen Workflows
- `$workflowPath` - Relativer Pfad des Workflows, z. B. `/workflows/<id>`
- `$workflowUrl` - Absolute URL des Workflows, z. B. `https://<host>/workflows/<id>`
- `$executionId` - ID der aktuellen Ausführung (entspricht der ID des [Ausführungsverlauf](./execution-history.md)-Eintrags, sodass `/workflows/<id>/<executionId>` diesen Lauf auf dem Canvas öffnet). **Nur zur Laufzeit**: leer im Ausdrucksvorschau-Dialog; wird nur während der Ausführung eines Workflows befüllt.
- `$vars` - Workflow-lokale Variablen (Zugriff über `$vars.variableName`; aktualisiert über `variable`-Knoten)
- `$global` - Persistenter globaler Variablenspeicher (Zugriff über `$global.variableName`)

### $vars-Verwendung
- `$vars.counter` - Zugriff auf eine Variable namens `counter`
- `$vars.myArray.add("item")` - Element zu einer Array-Variable hinzufügen

### $global-Verwendung
- `$global.environment` - Zugriff auf eine globale Variable namens `environment`
- `$global.settings.baseUrl` - Zugriff auf verschachtelte Felder in einer globalen Variable vom Typ Objekt

## Request-Kontext (API-Ausführung)
Wenn ein Workflow über die HTTP-API ausgeführt wird, erhalten Input-Knoten zusätzliche Request-Metadaten:
- `$textInputLabel.body` - HTTP-Request-Body-Objekt (rohe JSON-Payload)
- `$textInputLabel.headers` - HTTP-Request-Header-Objekt (alle Header-Schlüssel sind kleingeschrieben)
- `$textInputLabel.query` - URL-Query-Parameter-Objekt

Zugriff auf Request-Daten wie:
- `$userInput.body.fieldName`
- `$userInput.query.paramName`
- `$userInput.headers["x-api-key"]`
## Typkonvertierungsfunktionen
- `str(value)` - In String konvertieren
- `int(value)` - In Integer konvertieren
- `float(value)` - In Float konvertieren
- `bool(value)` - In Boolean konvertieren
- `list(value)` - In Liste konvertieren
- `dict(key=value, ...)` - Dictionary mit Keyword-Argumenten erstellen (z.B. `$dict(name="Ali", age=30)`)

## Mathe-Funktionen
- `len(value)` - Länge ermitteln
- `abs(value)` - Absolutwert
- `min(a, b)` - Minimalwert
- `max(a, b)` - Maximalwert
- `round(value)` - Zahl runden
- `sum(list)` - Summe der Liste
- `sorted(list)` - Liste sortieren
- `randomInt(min, max)` - Zufällige Ganzzahl

## Array-Funktionen
- `$array(a, b, c)` - Array aus Argumenten erstellen (z.B. `$array(1, 2, 3)` -> `[1, 2, 3]`)
- `$range(a, b)` - Ganzzahlbereich von `a` bis `b` erstellen, wobei `b` ausgeschlossen ist (z.B. `$range(1, 5)` -> `[1, 2, 3, 4]`)
  - Schlägt fehl, wenn `a > b`
- `notNull(list)` - Null-Werte aus dem Array entfernen

## String-Aufbau-Funktion (für map/filter-Ausdrücke)
- `concat(a, b, c, ...)` - N Argumente verketten
  - Innerhalb von `.map()` als Ausdrucks-String verwenden (kein `$` innerhalb des Strings)
  - Einfache Anführungszeichen innerhalb des concat-Strings verwenden:
    - Korrekt: `concat('prefix', 'item.field', 'suffix')`

## Objekt-Literale / Dictionaries
Objekte/Dictionaries mit geschweifter Klammer-Syntax und beliebigen String-Keys erstellen:
- `${"name": "Ali", "age": 30}` -> `{"name": "Ali", "age": 30}`

### Dynamische Keys
- `${now.format("MMMM DD"): "Today's value"}`
- `${"item_" + str(loopNode.index): loopNode.item}`

### Regeln für Objekt-Literale
- Keys können beliebige Strings sein (einschließlich Leerzeichen/Sonderzeichen)
- Keys MÜSSEN mit doppelten Anführungszeichen in Anführungszeichen gesetzt werden (z.B. `"key"`)
- Werte können Strings/Zahlen/Booleans/Ausdrücke/verschachtelte Objekte sein

## String-Funktionen
- `upper(text)` - Großbuchstaben
- `lower(text)` - Kleinbuchstaben
- `strip(text)` - Leerzeichen entfernen
- `capitalize(text)` - Ersten Buchstaben groß schreiben
- `title(text)` - Title Case
- `split(text, separator)` - String aufteilen
- `join(separator, list)` - Liste zusammenfügen
- `replace(text, old, new)` - Text ersetzen
- `regexReplace(text, pattern, replacement)` - Mit Regex-Muster ersetzen
- `base64Encode(text)` - UTF-8-Text als Standard-Base64 kodieren
- `base64Decode(text)` - Standard-Base64 in UTF-8-Text dekodieren
- `toJson(text)` - Einen JSON-String in ein Objekt, Array oder einen Wert parsen

## String-Methoden (auf String-Werten)
- `.orEmpty()` - Den String-Wert zurückgeben oder `""`, wenn der Wert null/fehlend ist
- `.upper()` / `.lower()` - Groß-/Kleinschreibung konvertieren
- `.strip()` - Leerzeichen entfernen
- `.capitalize()` / `.title()` - Groß schreiben
- `.length` - String-Länge
- `.toString()` - In String konvertieren
- `.substring(start, end)` - Teilstring extrahieren
- `.contains(text)` - Prüfen, ob Teilstring enthalten ist
- `.startswith(prefix)` / `.endswith(suffix)` - Präfix/Suffix prüfen
- `.indexOf(text)` - Position finden (gibt -1 zurück, wenn nicht gefunden)
- `.replace(old, new)` - Erstes Vorkommen ersetzen
- `.replaceAll(old, new)` - Alle Vorkommen ersetzen
- `.regexReplace(pattern, replacement)` - Mit Regex-Muster ersetzen
- `.hash()` - MD5-Hash des Strings
- `.base64Encode()` - UTF-8-Text als Standard-Base64 kodieren
- `.base64Decode()` - Standard-Base64 in UTF-8-Text dekodieren
- `.urlEncode()` - String URL-kodieren
- `.urlDecode()` - String URL-dekodieren
- `.escape()` - String JSON-escapen (Sonderzeichen in JSON-Format konvertieren)
- `.unescape()` - String JSON-unescapen (JSON-Format in Original-String konvertieren)
- `.toJson()` - Einen JSON-String in ein Objekt, Array oder einen Wert parsen

### Beispiele für String-Methoden
- `$profile.nickname.orEmpty()` - Nullable/fehlenden Text in einen leeren String konvertieren
- `$text.upper()` - In Großbuchstaben konvertieren
- `$text.lower()` - In Kleinbuchstaben konvertieren
- `$text.strip()` - Leerzeichen entfernen
- `$text.replace("old", "new")` - Text ersetzen
- `$text.replaceAll("a", "b")` - Alle Vorkommen ersetzen
- `$text.length` - String-Länge ermitteln
- `$text.escape()` - Spezielle JSON-Zeichen escapen (z.B. Anführungszeichen, Zeilenumbrüche)
- `$escapedText.unescape()` - JSON-formatierten String zurück in das Original unescapen
- `$text.toJson()` - Einen JSON-Objekt-/Array-String parsen (dann `$text.toJson().repoUrl`)
- `$toJson($text)` - Gleiches Parsen als Funktion
- `$base64Encode("Héym 🌍")` - Gibt `SMOpeW0g8J+MjQ==` zurück
- `$encodedText.base64Decode()` - Base64 in UTF-8-Text dekodieren
- `$text.urlEncode()` - URL-Kodierung für API-Parameter
- `$encodedText.urlDecode()` - URL-kodierten Text dekodieren

## Array-Methoden (auf Arrays)
- `.first()` - Erstes Element abrufen
- `.last()` - Letztes Element abrufen
- `.random()` - Zufälliges Element abrufen
- `.reverse()` - Array umkehren
- `.flat()` - Verschachtelte Arrays zu einem einzigen Array abflachen
- `.flat(depth)` - Mit Tiefenbegrenzung abflachen
- `.distinct()` - Duplikate entfernen
- `.distinctBy(expr)` - Duplikate nach Ausdruck entfernen (z.B. `$array.distinctBy("item.id")`)
- `.notNull()` - Null-Werte entfernen
- `.add(item)` - Element anhängen (gibt neues Array zurück)
- `.contains(item)` - Prüfen, ob Array das Element enthält (gibt Boolean zurück)
- `.join(separator)` - Array-Elemente zu einem String zusammenfügen
- `.filter(expr)` - Array mit der `item`-Variable filtern (z.B. `$array.filter("item > 5")`)
- `.map(expr)` - Jedes Element mit der `item`-Variable transformieren (z.B. `$array.map("item.name")`)
- `.sort(expr, order)` - Nach Ausdruck sortieren, order ist `"asc"` (Standard) oder `"desc"`
- `.take(n)` - Erste N (positiv) oder letzte N (negativ) Elemente nehmen
- `.length` - Array-Länge
- `.toString()` - In JSON-String konvertieren

### Filter-/Map-/Sort-Beispiele
- `$numbers.filter("item > 5")`
- `$users.filter("item.active == true")`
- `$users.map("item.name")`
- `$numbers.map("item * 2")`
- `$users.sort("item.age")`
- `$numbers.sort("item", "desc")`
- `$numbers.take(3)`
- `$numbers.take(-2)`
## Objekt-/Dictionary-Methoden (auf Objekten)
- `.get(key)` - Wert per Schlüssel abrufen (gibt null zurück, wenn nicht gefunden)
- `.get(key, default)` - Wert per Schlüssel mit Standard-Fallback abrufen
- `.keys()` - Eine Liste aller Schlüssel zurückgeben
- `.values()` - Eine Liste aller Werte zurückgeben
- `.entries()` - Eine Liste von `{key, value}`-Objekten zurückgeben (eines pro Eigenschaft)
- `.filter(expr)` - Über `{key, value}`-Einträge iterieren und passende Einträge als Liste zurückgeben (verwende `item.key` / `item.value` innerhalb von `expr`)
- `.map(expr)` - Über `{key, value}`-Einträge iterieren und eine Liste transformierter Werte zurückgeben (verwende `item.key` / `item.value` innerhalb von `expr`)
- `.toString()` - In JSON-String konvertieren

### Beispiele für Objekt-Iteration
Beim Iterieren eines Objekts mit `.map()` oder `.filter()` ist jedes `item` ein `{key, value}`-Paar:

- `$readSheet.rows.first().keys()` → `["colA", "colB"]`
- `$readSheet.rows.first().values()` → `["foo", "bar"]`
- `$readSheet.rows.first().map("item.value")` → `["foo", "bar"]`
- `$readSheet.rows.first().map("concat('item.key', ': ', 'item.value')")` → `["colA: foo", "colB: bar"]`
- `$profile.filter("item.value != null").map("item.key")` → Liste der Eigenschaftsnamen, die nicht null sind

## Datum/Uhrzeit
- `$now` - Aktuelles Datum/Uhrzeit
- `$now.format("YYYY-MM-DD")` - Datum/Uhrzeit formatieren
- `$now.toISO()` / `.toDate()` / `.toTime()` - Formate konvertieren
- `$now.addDays(n)` / `.addHours(n)` - Datumsberechnung
- `$Date("2024-01-15")` - Datums-String parsen

## Numerische Operationen
- Grundrechenarten: `+`, `-`, `*`, `/`, `%`
- Vergleiche: `>`, `<`, `>=`, `<=`, `==`, `!=`
- Boolesche Operatoren: `and`, `or`, `not`

## Boolesche Bedingungen
Für Boolesche Werte den Ausdruck direkt schreiben (nicht `== true` erzwingen):
- Falsch: `$nodeName.isValid == true`
- Richtig: `$nodeName.isValid`
- Negation: `not $nodeName.isValid`

## Regeln & Whitelist (Kritisch)
### $ Platzierungsregeln
- Ein eigenständiger Ausdruck beginnt normalerweise mit einem führenden `$`.
- Template-Strings können mehrere `$refs` enthalten.
- Methodenparameter können auch verschachtelte `$refs` enthalten, wenn du ein anderes Ausdrucksergebnis übergeben möchtest (dynamischer Schlüssel oder verschachtelte Auflösung).
  - Gültig: `$node.method(other.field)` — `other` wird aus dem Kontext wie ein Top-Level-Label aufgelöst (kein `$` innerhalb des Arguments).
  - Gültig: `$node.method($other.field)` — verschachteltes `$` wird in der Vorschau des Auswertungsdialogs und bei der Bedingungsauswertung unterstützt.
  - Gültig: `$array($a.x, $b.y)`
  - Die Autovervollständigung innerhalb von `.get(` fügt **bloße** `label.field`-Pfade ein (ohne führendes `$`), genau wie innerhalb von `$array(...)` / `$notNull(...)`.
- **Evaluate API (Run):** Wenn der gesamte übermittelte Wert ein einzelner Dot-Pfad **ohne** führendes `$` ist (zum Beispiel im Editor ausgewählter Text wie `execute.outputs.output.result.today`), behandelt das Backend ihn genauso wie `$execute.outputs.output.result.today`. Werte, die nach dem Trimmen einen Zeilenumbruch oder Wagenrücklauf enthalten, werden nicht umgeschrieben (vermeidet mehrdeutige mehrzeilige Payloads). Bevorzuge es, `$` in gespeicherten Workflow-Feldern zu schreiben; das Umschreiben dient hauptsächlich der Inspektion und Tooling.
- Das `Run`-Ergebnis des Auswertungsdialogs ist die maßgebliche Quelle dafür, wie ein konkreter Ausdruck aufgelöst wird.

### Array-String-Quotierung
Beim Erstellen von Arrays mit String-Werten IMMER doppelte Anführungszeichen verwenden:
- Richtig: `$array("hello", "world")`
- Falsch: `$array('hello', 'world')`

### NUR DIESE FUNKTIONEN VERWENDEN (Whitelist)
Verwende NUR:
- `str()`, `int()`, `float()`, `bool()`, `list()`, `dict(key=value, ...)`
- `len()`, `abs()`, `min()`, `max()`, `round()`, `sum()`, `sorted()`
- `randomInt()`, `range()`, `array()`, `notNull()`
- `upper()`, `lower()`, `strip()`, `capitalize()`, `title()`
- `split()`, `join()`, `replace()`, `regexReplace()`, `hash()`
- `base64Encode()`, `base64Decode()`, `toJson()`
- dokumentierte String-/Array-/Objekt-Methoden

Wenn eine Funktion oben nicht aufgeführt ist, existiert sie nicht.

### Methodenlimits für Arrays / Dicts
- Arrays können NUR verwenden: `.first()`, `.last()`, `.random()`, `.reverse()`, `.flat()`, `.distinct()`, `.distinctBy()`, `.notNull()`, `.add()`, `.contains()`, `.join()`, `.filter()`, `.map()`, `.sort()`, `.take()`, `.length`, `.toString()`
- Objekte/Dicts können NUR verwenden: `.get(key)`, `.get(key, default)`, `.keys()`, `.values()`, `.entries()`, `.filter(expr)`, `.map(expr)`, `.toString()`

### Reservierte Knoten-Label-Namen
Verwende diese Namen nicht als Knoten-Labels: `length`, `orEmpty`, `toString`, `toUpperCase`, `toLowerCase`, `substring`, `indexOf`, `contains`, `startsWith`, `endsWith`, `replace`, `replaceAll`, `regexReplace`, `hash`, `toJson`, `first`, `last`, `random`, `reverse`, `distinct`, `notNull`, `filter`, `map`, `entries`, `keys`, `values`, `sort`, `join`, `headers`, `query`, `value`, `list`, `result`, `array`, `vars`, `items`, `name`, `type`, `status`, `body`, `outputs`, `result`, `item`, `index`, `total`, `isFirst`, `isLast`, `branch`, `results`, `merged`, `error`, `errorNode`, `errorNodeType`, `timestamp`, `input`, `now`, `date`.

## Beispiele

**Bedingung**: `$input.text.length > 0`

**LLM-Benutzernachricht**: `$input.text`

**Ausgabenachricht**: `$llm.text`

**Variablenwert**: `$input.count + 1`

### DSL-Beispiel

```dsl
$input.text
$llm.text
$input.count + 1
item.name
```
## Verwandte Themen

- [Dialog zur Ausdrucksauswertung](./expression-evaluation-dialog.md) – Erweiterbarer Editor mit Backend-Live-Vorschau und Autovervollständigung
- [Canvas-Funktionen](./canvas-features.md) – Daten-Pin zum Testen von Ausdrücken ohne erneutes Ausführen von Knoten
- [Knotentypen](./node-types.md) – Knoten, die Ausdrücke verwenden ([LLM](../nodes/llm-node.md), [Condition](../nodes/condition-node.md), [Output](../nodes/output-node.md), [Set](../nodes/set-node.md) usw.)
- [Sticky Note](../nodes/sticky-note-node.md) – Canvas-Markdown-Notizen mit bearbeitbarem Titel, Farbe und Bildanzeige
- [Agent-Knoten](../nodes/agent-node.md) – Verwendung von Ausdrücken in Agent-Prompts
- [Persistentes Agent-Gedächtnis](./agent-persistent-memory.md) – `persistentMemoryEnabled` und `memoryShares` in Agent-`data` (keine Ausdrucksfelder)
- [Workflow-Struktur](./workflow-structure.md) – Knoten-`data`-Felder, die Ausdrücke akzeptieren
- [Reiter „Anmeldedaten"](../tabs/credentials-tab.md) – Von Knoten referenzierte Anmeldedaten
- [Anmeldedaten-Freigabe](./credentials-sharing.md) – Anmeldedaten freigeben und `$credentials` in Ausdrücken verwenden
- [Globale Variablen](./global-variables.md) – Persistente Variablen mit `$global`
