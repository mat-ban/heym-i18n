# Bedingungs-Knoten

Der **Bedingungs-Knoten** (Condition) teilt den Ausführungsfluss basierend auf einem booleschen logischen Ausdruck in einen `true`- und einen `false`-Zweig.

## Übersicht

| Eigenschaft | Wert |
|---|---|
| Eingänge | 1 |
| Ausgänge | 2 (`true`, `false`) |
| Ausgabe | Gibt das unveränderte `$input`-Objekt an den zutreffenden Ausgang weiter |

## Konfiguration

Definieren Sie Bedingungen wie `$input.score >= 80` oder `$input.status == "success"`.

## Verwandte Themen

- [Switch-Knoten](./switch-node.md) – Mehrwege-Verzweigungen
- [Ausdrucks-DSL](../reference/expression-dsl.md) – Logische Ausdrücke formulieren\n