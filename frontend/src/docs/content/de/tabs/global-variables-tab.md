# Reiter Variablen

Der Reiter **Variablen** (Global Variables) verwaltet persistente Schlüssel-Wert-Paare, die über alle Workflows, Agenten und Portal-Chats hinweg global verfügbar sind.

## Funktionsweise

- Definieren Sie systemweite Konfigurationen, Schwellenwerte, Modellbezeichnungen oder Service-URLs an einem zentralen Ort.
- Ändert sich ein Wert, wird er sofort in allen referenzierenden Workflows wirksam, ohne dass einzelne Knoten editiert werden müssen.

## Variablen anlegen und verwalten

1. Klicken Sie auf **Variable hinzufügen**.
2. Geben Sie einen eindeutigen Schlüssel (z. B. `SUPPORT_EMAIL` oder `DEFAULT_LLM_MODEL`) ein.
3. Wählen Sie den Typ (`string`, `number`, `boolean`, `json`).
4. Hinterlegen Sie den Wert.
5. Aktivieren Sie optional **Sensibel / Verschlüsselt**, um vertrauliche Daten im Backend sicher mit AES-256 zu verschlüsseln (im UI werden sensible Werte maskiert).

## Verwendung in Workflows

Auf globale Variablen greifen Sie innerhalb der [Ausdrucks-DSL](../reference/expression-dsl.md) über das Präfix `$global` zu:

```dsl
{{ $global.SUPPORT_EMAIL }}
{{ $global.RETRY_ATTEMPTS }}
```

Auch der [Variablen-Knoten](../nodes/variable-node.md) kann globale Variablen zur Laufzeit lesen oder dynamisch aktualisieren.

## Verwandte Themen

- [Ausdrucks-DSL](../reference/expression-dsl.md) – Syntax für Variablen-Referenzen
- [Variablen-Knoten](../nodes/variable-node.md) – Variablen im Workflow manipulieren\n