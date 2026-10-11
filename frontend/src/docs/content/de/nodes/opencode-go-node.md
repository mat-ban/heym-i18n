# OpenCode Go

Der **OpenCode Go**-Knoten führt die [OpenCode](https://opencode.ai) CLI (Go) in einem isolierten, gehärteten Heym-Container gegen ein GitHub-Repository aus. Wie der Codex-Knoten ist er für Coding-Aufgaben wie das Beheben von Tests, das Bearbeiten von Dateien, das Erzeugen eines Patches oder das Öffnen eines Pull Requests konzipiert — er verwendet jedoch das anbieterunabhängige **OpenCode Go**-Modell-Gateway anstelle von OpenAI Codex.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1 |
| Anmeldedaten | OpenCode Go API-Schlüssel + GitHub |
| Ausgabe | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Authentifizierung

Die **OpenCode Go**-Anmeldedaten speichern einen OpenCode Go Gateway-**API-Schlüssel** (von [opencode.ai/go](https://opencode.ai/go)) und eine optionale **Gateway Base URL** (Standard ist `https://opencode.ai/zen/go/v1`; nur für ein selbst gehostetes oder über einen Proxy laufendes Gateway überschreiben).

Der Knoten benötigt außerdem GitHub-Anmeldedaten für das Klonen privater Repositories, das Pushen des Arbeitsbranches und das Erstellen von Pull Requests. Der GitHub-Token wird **niemals im Sandbox-Container platziert** — Heym führt alle git- und GitHub-Operationen auf dem Host aus, sodass generierter Code keine Push-Anmeldedaten exfiltrieren kann.

## Isolation und Sicherheit

Die Ausführungsisolation wird durch `HEYM_OPENCODE_CLI_COMMAND` gewählt, genau wie beim Codex-Knoten:

- **Lokale Entwicklung (`run.sh`)** belässt es beim Standard `opencode`, sodass OpenCode als Host-Subprozess gegen den geklonten Workspace läuft — kein Docker erforderlich, keine zusätzlichen Flags.
- **Docker-Deployments (`deploy.sh` und das einzelne GHCR-Image)** setzen es auf `/usr/local/bin/heym-opencode-docker`, einen Wrapper, der `opencode run` in einem **gehärteten, wegwerfbaren Schwester-Container** ausführt, der das OpenCode-Workspace-named-volume teilt.

Der gehärtete Runner-Container entfernt alle Linux-Capabilities, setzt `no-new-privileges`, verwendet ein schreibgeschütztes Root mit einem tmpfs `/tmp` und wendet pid/memory/CPU-Limits an. Netzwerk-Egress ist erlaubt (OpenCode muss das Modell-Gateway erreichen). Der **GitHub-Token wird niemals im Container platziert** — alle git- und GitHub-Operationen laufen hostseitig, sodass sich nur der OpenCode-API-Schlüssel und Repository-Dateien jemals darin befinden.

OpenCode bearbeitet nur Dateien auf der Festplatte; Heym besitzt jede git/GitHub-Aktion.

## Modelle

Die Modellliste von OpenCode Go ändert sich häufig, daher wird das Feld **Model** live aus der Modellliste des Gateways (`GET https://opencode.ai/zen/go/v1/models`) befüllt und als durchsuchbares Dropdown angezeigt. Wenn die Live-Liste nicht verfügbar ist, wird eine integrierte Fallback-Liste verwendet. Modell-IDs verwenden die Form `opencode-go/<model>` (zum Beispiel `opencode-go/kimi-k3`, `opencode-go/deepseek-v4-pro`, `opencode-go/qwen3.7-max`) — `opencode-go` ist die Provider-ID der OpenCode CLI für das Go-Gateway. Lassen Sie das Feld leer, um den Runner-Standard (`opencode-go/kimi-k3`) zu verwenden. Modell-IDs, die in der älteren Form `opencode/<model>` gespeichert wurden, werden zur Laufzeit automatisch umgeschrieben.

## Felder

| Feld | Beschreibung |
|-------|-------------|
| OpenCode Go Credential | OpenCode Go-Anmeldedaten (Gateway-API-Schlüssel) |
| GitHub Credential | GitHub-PAT-Anmeldedaten für den Repository-Zugriff |
| Repository URL | HTTPS-GitHub-Repository-URL; unterstützt Ausdrücke |
| Base Branch | Branch, der vor der Ausführung von OpenCode geklont wird, Standard `main` |
| Model | OpenCode Go-Modell (durchsuchbares Live-Dropdown, `opencode-go/<model>`); leer verwendet den Runner-Standard |
| Reasoning Variant | Optional; wird auf `opencode run --variant` für Modelle abgebildet, die Reasoning-Aufwand unterstützen |
| Task Prompt | Coding-Aufgabe für OpenCode; unterstützt Ausdrücke wie `$input.text` |
| Publish Mode | Wie Änderungen übermittelt werden (siehe Tabelle unten) |
| Branch Name | Arbeitsbranch für PR/Commit-Modi, Standard `opencode/$executionId` |
| Timeout | Maximale OpenCode-Ausführungszeit in Sekunden |

## Publish-Modi

| Modus | Was er tut |
|------|--------------|
| `diff_only` | Bearbeitet Dateien lokal und gibt den Patch und die geänderten Dateien zurück. Nichts wird gepusht. |
| `draft_pr` | Committet auf den Branch, pusht ihn und öffnet einen Draft-Pull-Request. |
| `open_pr` | Committet auf den Branch, pusht ihn und öffnet einen review-bereiten (nicht-Draft) Pull-Request. |
| `commit_push` | Committet auf den Branch und pusht ihn, ohne einen Pull-Request zu öffnen. |
| `direct_commit` | Committet und pusht direkt auf den Base-Branch (kein separater Branch oder PR). |
| `open_or_update_pr` | Aktualisiert den bestehenden offenen PR des Agenten, wenn einer existiert — selbst wenn der Branch-Name abweicht, findet der Runner ihn anhand von Autor + Base — andernfalls öffnet er einen neuen. Am besten für erneute Ausführungen und Anweisungen wie „den offenen PR aktualisieren". |
| `update_existing_pr` | Fügt einen Commit zum bestehenden Branch/PR hinzu; öffnet einen, falls noch keiner existiert. |
| `patch_artifact` | Speichert den Diff als herunterladbare Datei und gibt `patchUrl` zurück. Nichts wird gepusht. |

## Ausgaben

| Schlüssel | Beschreibung |
|-----|-------------|
| `status` | Immer `completed` (der OpenCode Go-Knoten pausiert nicht für Eingaben) |
| `summary` | OpenCodes abschließende Nachricht |
| `validation` | Validierungshinweise, wenn gemeldet |
| `diff` | Git-Patch, wenn Dateien geändert wurden |
| `changedFiles` | Geänderte Dateipfade |
| `branchName` | Name des Arbeitsbranches |
| `pullRequestUrl` | PR-URL in den Modi `draft_pr`, `open_pr`, `open_or_update_pr` und `update_existing_pr` |
| `pushedBranch` | Branch, der in Commit/PR-Modi gepusht wurde |
| `patchUrl` | Download-Link für den Diff im Modus `patch_artifact` |
## UI-Screenshots in Pull Requests

Für UI-/Frontend-Aufgaben sollte OpenCode PNG-Screenshots unter einem gitignorierten Pfad wie `frontend/.e2e-artifacts/` speichern (nicht im Quellcode). Wenn Frontend-Abhängigkeiten fehlen, erlaubt der Runner-Prompt eine gezielte Paketinstallation (zum Beispiel `bun install`) sowie eine kurzlebige Vorschau/`bun run dev` ausschließlich zum Erfassen der UI. Heym lädt diese Bilder in ein einzelnes gemeinsames GitHub-**Prerelease** (`opencode-pr-assets`) als Assets mit dem Namen `<branch>-…` hoch und bettet sie dann in die PR-Beschreibung ein, **bevor der Pull Request geöffnet wird**, sodass ein neuer PR bereits mit seinen Screenshots erstellt wird (bestehende PRs werden an Ort und Stelle aktualisiert).

OpenCode wird außerdem angewiesen, mit einer Zeile `PR_TITLE: …` zu enden, damit Heym den Pull Request mit einem aussagekräftigen Betreff statt mit Platzhaltern wie `Done.` öffnen kann.

OpenCode beendet manchmal einen Turn mitten in der Aufgabe („…Now let me take a screenshot"), was den Lauf abschließen würde, bevor der Screenshot erfasst ist. Um das zu verhindern, verlangt der Runner-Prompt, Screenshots **vor** der finalen Nachricht zu erfassen, und wenn der Lauf dennoch ohne veröffentlichbare Zusammenfassung oder mit einer UI-Änderung, aber ohne Screenshot endet, führt Heym einen weiteren OpenCode-Durchlauf im selben Workspace aus, um abzuschließen. Wenn eine UI-Änderung danach immer noch keinen Screenshot hat, wird ein sichtbarer Hinweis in den PR-Body eingefügt, damit die Lücke niemals stillschweigend bleibt.

## Was auf GitHub veröffentlicht wird

Dein **Task Prompt** ist privater Input, kein PR-Inhalt. Nur zwei Dinge werden veröffentlicht: eine `## Change Summary`, die beschreibt, was die Codeänderung bewirkt, und ein Abschnitt `## Screenshots`, wenn Screenshots erfasst wurden. Der PR-Titel wird allein aus der Änderungszusammenfassung abgeleitet.

Der Runner-Prompt legt diese Richtlinie fest, und Heym setzt sie auch nach dem Lauf durch: Bevor irgendetwas committet oder als Pull Request geöffnet wird, entfernt es Prompt-Echo-Abschnitte (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) und jeden Absatz, der wörtlich aus dem Task Prompt kopiert wurde, aus der Zusammenfassung, dem PR-Body und der Commit-Nachricht.

Heym liest den Abschnitt `## Change Summary` aus den Nachrichten des Agenten, anstatt das zu nehmen, was er zuletzt gesagt hat, weil OpenCode pro Schritt eine Nachricht ausgibt und die letzte oft ein Kommentar mitten im Lauf ist. Schritt-Narration (`Both pass. Let me do a final review:`) wird ebenfalls als PR-Titel oder Commit-Betreff abgelehnt. Wenn der Lauf keine brauchbare Änderungszusammenfassung erzeugt, fällt der Pull Request darauf zurück, die geänderten Dateien aufzulisten, anstatt Kommentare zu veröffentlichen.

## Als Agent-Tool

Der OpenCode Go-Knoten kann an den Tool-Handle eines **AI Agent**-Knotens angehängt werden, damit der Agent Coding-Aufgaben delegieren kann. Konfiguriere die Anmeldedaten, die GitHub-Anmeldedaten und das Repository am Knoten und markiere dann **Task Prompt** (und optional **Repository URL**) mit dem vom Agenten bereitgestellten Toggle, damit der Agent sie zur Aufrufzeit liefert.

## Beispiel

```json
{
  "id": "opencode-1",
  "type": "opencodeGo",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "opencode-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "open_pr",
    "branchName": "opencode/$executionId",
    "opencodeModel": "opencode-go/kimi-k3",
    "timeoutSeconds": 3600
  }
}
```

## Verwandte Themen

- [Codex-Knoten](./codex-node.md)
- [GitHub-Knoten](./github-node.md)
- [Agent-Knoten](./agent-node.md)
- [Anmeldedaten](../reference/credentials.md)
- [Anmeldedaten-Sharing](../reference/credentials-sharing.md)
- [Knotentypen](../reference/node-types.md)
