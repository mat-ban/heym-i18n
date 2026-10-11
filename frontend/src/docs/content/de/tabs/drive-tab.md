# Reiter Drive

Der Reiter **Drive** ist der integrierte, sichere Dateispeicher von Heym. Er verwaltet hochgeladene Dokumente, Workflow-Artefakte, Playwright-Screenshots und generierte Exportdateien.

## Kernfunktionen

- **Datei-Upload & -Verwaltung** – Speichern Sie PDFs, CSVs, Bilder und Datensätze übersichtlich in Ordnern
- **Öffentliche Freigabelinks** – Generieren Sie sichere, zeitlich beschränkte Download-Links für externe Empfänger
- **Team-Freigaben** – Weisen Sie Dateien und Ordner spezifischen [Teams](./teams-tab.md) mit Lese- oder Schreibrechten zu
- **Direkte Workflow-Anbindung** – Nutzen Sie den [Drive-Knoten](../nodes/drive-node.md), um Dateien programmatisch zu erstellen, zu lesen oder zu konvertieren

## Speicherarchitektur

Dateien werden persistent im konfigurierten Storage-Pfad (Standard: `/app/data/files`) gespeichert und bleiben über Container-Neustarts hinweg vollständig erhalten.

## Verwandte Themen

- [Drive-Knoten](../nodes/drive-node.md) – Dateizugriff im Workflow
- [Reiter Teams](./teams-tab.md) – Team-Zugriffsrechte konfigurieren\n