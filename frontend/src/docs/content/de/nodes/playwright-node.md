# Playwright-Knoten

Der **Playwright-Knoten** steuert Headless-Browser zur Web-Automatisierung, zum Erstellen von Screenshots, zum Ausfüllen von Formularen und zum Extrahieren dynamischer Website-Inhalte.

## Übersicht

| Eigenschaft | Wert |
|---|---|
| Eingänge | 1 |
| Ausgänge | 1 |
| Ausgabe | `$nodeLabel.html`, `$nodeLabel.screenshot`, `$nodeLabel.extracted` |

## Modi

1. **Visuelle Schritte**: Fügen Sie Aktionen wie `goto`, `click`, `fill`, `waitForSelector` und `screenshot` visuell im Panel hinzu.
2. **KI-Schritte**: Beschreiben Sie Aktionen in natürlicher Sprache (z. B. *„Klicke auf den Login-Button und warte auf das Dashboard“*).
3. **Code-Modus**: Schreiben Sie vollständige Python-Playwright-Skripte für anspruchsvolle Interaktionen.

> **Wichtig:** Setzen Sie `shm_size: "2gb"` in Ihrer Docker-Konfiguration, um Chromium-Renderer-Abstürze zu verhindern.

## Verwandte Themen

- [Crawler-Knoten](./crawler-node.md) – Systematisches Web-Crawling\n