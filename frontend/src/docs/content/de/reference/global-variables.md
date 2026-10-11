# Globale Variablen

Der **Globale Variablenspeicher** enthält persistente, benutzerspezifische Schlüssel-Wert-Daten, die über Workflow-Ausführungen hinweg erhalten bleiben. Verwende ihn für Konfiguration, Feature-Flags, Zähler oder gemeinsamen Zustand, den mehrere Workflows benötigen.

> **Speichere hier keine Secrets.** Globale Variablen sind kein Secrets-Tresor: Werte werden unverschlüsselt gespeichert, sie werden vollständig an jeden zurückgegeben, mit dem du sie teilst, und Mitbearbeiter können sie bearbeiten. API-Schlüssel, Passwörter und Token gehören in [Anmeldedaten](./credentials.md), wo sie im Ruhezustand verschlüsselt und das Secret niemals an den Client zurückgegeben wird.

## Lokal vs. Global

| Speicher | Syntax | Geltungsbereich | Persistenz |
|-------|--------|-------|-------------|
| **Workflow-lokal** | `$vars.variableName` | Nur aktuelle Ausführung | Im Speicher, geht verloren, wenn die Ausführung endet |
| **Global** | `$global.variableName` | Alle Workflows für den Benutzer | In der Datenbank persistiert |

## Globale Variablen erstellen

1. **Über den Reiter „Variablen"** – [Reiter „Variablen"](../tabs/global-variables-tab.md): Variablen direkt erstellen, bearbeiten und löschen.
2. **Über einen Variablen-Knoten** – Aktiviere **Im globalen Variablenspeicher speichern** (`isGlobal: true`) in den Eigenschaften des Knotens. Die Variable wird in den Speicher geschrieben, wenn der Workflow ausgeführt wird.

## Verwendung in Ausdrücken

Greife mit `$global.variableName` auf globale Variablen zu:

```
$global.environment
$global.settings.baseUrl
$global.userId
```

Verwende dieselben Methoden wie bei workflow-lokalen Variablen (z. B. `.upper()`, `.length`, `.add()` für Arrays).

## Werttypen

Unterstützte Typen: `string`, `number`, `boolean`, `array`, `object`. Wähle den Typ beim Erstellen oder Bearbeiten einer Variablen.

## Globale Variablen teilen

Du kannst eine globale Variable mit anderen Benutzern oder [Teams](./teams.md) teilen, damit diese sie in ihren eigenen Workflows verwenden können.

- **Mit Benutzer teilen** – Klicke auf das Teilen-Symbol neben einer Variable, die dir gehört, gib die E-Mail-Adresse des Empfängers ein und klicke auf **Teilen**. Der Empfänger sieht die Variable in seiner Liste „Globale Variablen" mit einem **Geteilt**-Badge und der Bezeichnung „Geteilt von &lt;deine E-Mail&gt;".
- **Mit Team teilen** – Wähle im Teilen-Dialog ein Team aus und klicke auf **Hinzufügen**. Alle Teammitglieder erhalten Zugriff.
- **Bearbeitbarer Zugriff** – Empfänger können die geteilte Variable anzeigen, bearbeiten und über `$global.variableName` in ihren Workflows referenzieren. Nur der Eigentümer kann die Variable teilen, die Freigabe aufheben oder sie löschen.
- **Namenskonflikte** – Wenn ein Empfänger bereits eine Variable mit demselben Namen hat, hat seine eigene Variable Vorrang vor der geteilten.
- **Freigabe aufheben** – Öffne den Teilen-Dialog für die Variable und klicke auf die **×**-Schaltfläche neben dem Benutzer, dem du den Zugriff entziehen möchtest.

## Chat-Integration

Globale Variablen sind für den [Chat](../tabs/chat-tab.md)-Assistenten verfügbar. Das LLM kann sie referenzieren, wenn es Fragen beantwortet oder Inhalte generiert.

## Verwandte Themen

- [Reiter „Variablen"](../tabs/global-variables-tab.md) – Globale Variablen in der UI verwalten
- [Variablen-Knoten](../nodes/variable-node.md) – Variablen mit `isGlobal` setzen
- [Ausdrucks-DSL](./expression-dsl.md) – `$global`-Syntax
