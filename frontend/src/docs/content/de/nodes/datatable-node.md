# DataTable-Knoten

Der **DataTable-Knoten** führt CRUD-Operationen (Erstellen, Lesen, Aktualisieren, Löschen) auf Tabellen des Reiters [DataTable](../tabs/datatable-tab.md) aus.

## Übersicht

| Eigenschaft | Wert |
|---|---|
| Eingänge | 1 |
| Ausgänge | 1 |
| Ausgabe | Gefundene Datensätze oder Bestätigung der Operation |

## Operationen

- `getAll`: Ruft Zeilen mit Paginierung ab
- `getById`: Sucht einen Datensatz anhand seiner ID
- `find`: Filtert Zeilen nach Spaltenwerten
- `insert`: Fügt neue Zeilen ein
- `update`: Aktualisiert bestehende Datensätze
- `delete`: Entfernt Zeilen

## Verwandte Themen

- [Reiter DataTable](../tabs/datatable-tab.md) – Tabellen verwalten\n