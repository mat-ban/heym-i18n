# Codex-Knoten

Der **Codex**-Knoten führt die OpenAI Codex CLI in einem isolierten Heym-Workspace gegen ein GitHub-Repository aus. Er ist für Coding-Aufgaben wie das Beheben von Tests, das Bearbeiten von Dateien, das Erstellen eines Patches oder das Öffnen eines Draft-Pull-Requests konzipiert.

## Übersicht

| Eigenschaft | Wert |
|----------|-------|
| Eingaben | 1 |
| Ausgaben | 1, plus `question` |
| Anmeldedaten | Codex access token + GitHub |
| Ausgabe | `$nodeLabel.summary`, `$nodeLabel.diff`, `$nodeLabel.changedFiles`, `$nodeLabel.pullRequestUrl` |

## Authentifizierung

Die **OpenAI Codex**-Anmeldedaten unterstützen zwei Authentifizierungsmodi:

| Modus | Beschreibung |
|------|-------------|
| **Mit ChatGPT anmelden** (empfohlen) | OAuth (PKCE)-Anmeldung, die dein ChatGPT Plus/Pro-Abonnement verwendet, sodass Ausführungen **keine** API-Kosten pro Token verursachen. Klicke im Anmeldedaten-Dialog auf **Mit ChatGPT anmelden**, autorisiere im Browser und füge dann die `localhost:1455`-Weiterleitungs-URL zurück in Heym ein. Heym speichert das resultierende Token-Bundle und erneuert es automatisch, wenn es abläuft. |
| **Access token** | Füge ein ChatGPT/Codex `access_token` ein, das nur vom lokalen Codex-Runner verwendet wird. |

API-Schlüssel werden für die Codex-Anmeldedaten nicht akzeptiert. Der Knoten übermittelt keine Cloud-Codex-Aufgaben; er klont das Repository innerhalb der Heym-Runtime, schreibt das ChatGPT-Token-Bundle in eine isolierte `auth.json` (oder übergibt `CODEX_ACCESS_TOKEN`) nur an den Codex-Prozess und hält das Token aus `$credentials` heraus.

Der Knoten erfordert außerdem GitHub-Anmeldedaten zum Klonen privater Repositories, zum Pushen des Arbeitsbranches und zum Erstellen von Draft-Pull-Requests.

In Docker-Deployments führt Heym Codex in einem Schwester-Container aus demselben Heym-Image aus (nicht aus einem separaten GHCR-Image). Dieser Container bindet nur das Codex-Workspace-Volume ein und lässt Codex' eigene bubblewrap-Sandbox Namespaces und ein frisches `/proc` erstellen. Der Runner fügt `SYS_ADMIN`, unconfined seccomp und AppArmor sowie `systempaths=unconfined` hinzu (Docker Engine 25+). Ohne das letzte Flag schlägt jeder Befehl vor dem Start mit `bwrap: Can't mount proc on /newroot/proc: Operation not permitted` fehl.

OpenAI-Referenzen:

- [Codex-Authentifizierung](https://developers.openai.com/codex/auth)
- [Codex access tokens](https://developers.openai.com/codex/enterprise/access-tokens)
- [Codex-Modelle](https://learn.chatgpt.com/docs/models?surface=cli)
- [Codex nicht-interaktiver Modus](https://developers.openai.com/codex/noninteractive)
- [Codex-Preise](https://developers.openai.com/codex/pricing)

## Felder

| Feld | Beschreibung |
|-------|-------------|
| Codex-Anmeldedaten | OpenAI Codex-Anmeldedaten (ChatGPT-Anmeldung oder `access_token`) |
| GitHub-Anmeldedaten | GitHub PAT-Anmeldedaten für den Repository-Zugriff |
| Repository-URL | HTTPS-GitHub-Repository-URL |
| Basis-Branch | Branch, der vor der Codex-Ausführung geklont wird, Standard `main` |
| Modell | Optionales Codex-Modell (editierbares Dropdown, z. B. `gpt-5.6-sol`, `gpt-5.6-terra`, `gpt-5.6-luna`); leer verwendet den Codex-Standard |
| Reasoning-Aufwand | Codex-Reasoning-Tiefe: `low`, `medium`, `high`, `xhigh` (Extra High), `max` oder `ultra` (Standard `medium`) |
| Aufgaben-Prompt | Coding-Aufgabe für Codex; unterstützt Ausdrücke wie `$input.text` |
| Veröffentlichungsmodus | Wie Änderungen übermittelt werden (siehe Tabelle unten) |
| Branch-Name | Arbeitsbranch für PR/Commit-Modi, Standard `codex/$executionId` |
| Timeout | Maximale Codex-Ausführungszeit in Sekunden |

## Veröffentlichungsmodi

| Modus | Was er tut |
|------|--------------|
| `diff_only` | Bearbeitet Dateien lokal und gibt den Patch und die geänderten Dateien zurück. Nichts wird gepusht. |
| `draft_pr` | Committet auf den Branch, pusht ihn und öffnet einen Draft-Pull-Request. |
| `open_pr` | Committet auf den Branch, pusht ihn und öffnet einen review-bereiten (nicht-Draft) Pull-Request. |
| `commit_push` | Committet auf den Branch und pusht ihn, ohne einen Pull-Request zu öffnen. |
| `direct_commit` | Committet und pusht direkt auf den Basis-Branch (kein separater Branch oder PR). |
| `open_or_update_pr` | Aktualisiert den bestehenden offenen PR des Agenten, wenn einer existiert — selbst wenn der Branch-Name abweicht, findet der Runner ihn anhand von Autor + Basis — andernfalls öffnet er einen neuen. Am besten für erneute Ausführungen und Anweisungen wie „den offenen PR aktualisieren". |
| `update_existing_pr` | Fügt einen Commit zum bestehenden Branch/PR hinzu; öffnet einen, falls noch keiner existiert. |
| `patch_artifact` | Speichert den Diff als herunterladbare Datei und gibt `patchUrl` zurück. Nichts wird gepusht. |

## Ausgaben

| Schlüssel | Beschreibung |
|-----|-------------|
| `status` | `completed` oder `needs_input` |
| `summary` | Codex' Zusammenfassung |
| `validation` | Validierungshinweise, Tests oder Prüfungen, die von Codex gemeldet wurden |
| `diff` | Git-Patch, wenn Dateien geändert wurden |
| `changedFiles` | Geänderte Dateipfade |
| `threadId` | Codex-Thread-/Session-ID, wenn verfügbar |
| `branchName` | Name des Arbeitsbranches |
| `pullRequestUrl` | PR-URL in den Modi `draft_pr`, `open_pr`, `open_or_update_pr` und `update_existing_pr` |
| `pushedBranch` | Branch, der in Commit/PR-Modi gepusht wurde |
| `patchUrl` | Download-Link für den Diff im Modus `patch_artifact` |
| `usage` | Nutzungsmetadaten, die von der Codex CLI gemeldet werden, wenn verfügbar |
## UI-Screenshots bei Pull Requests

Für UI-/Frontend-Aufgaben sollte Codex PNG-Screenshots unter einem gitignorierten Pfad wie `frontend/.e2e-artifacts/` speichern (nicht im Quellcode). Wenn Frontend-Abhängigkeiten fehlen, darf Codex `bun install` (oder npm/pnpm install) ausführen und eine kurzlebige Vorschau/`bun run dev` starten, ausschließlich um die UI zu erfassen. Heym lädt diese Bilder in ein einzelnes gemeinsames GitHub-**Prerelease** (`codex-pr-assets`) als Assets mit dem Namen `<branch>-…` hoch und bettet sie dann in die PR-Beschreibung ein, **bevor der Pull Request geöffnet wird**, sodass ein neuer PR bereits mit seinen Screenshots erstellt wird (bestehende PRs werden an Ort und Stelle aktualisiert). Codex muss außerdem einen aussagekräftigen `pull_request_title` setzen (niemals Platzhalter wie `Done.`).

Codex beendet manchmal einen Turn mitten in der Aufgabe („…Now let me take a screenshot"), was den Lauf finalisieren würde, bevor der Screenshot erfasst ist. Um das zu verhindern, verlangt der Runner-Prompt, Screenshots **vor** dem Endergebnis zu erfassen, und wenn der Lauf dennoch ohne veröffentlichbare Zusammenfassung oder mit einer UI-Änderung, aber ohne Screenshot endet, führt Heym einen weiteren Codex-Durchlauf im selben Workspace aus, um abzuschließen. Wenn eine UI-Änderung danach immer noch keinen Screenshot hat, wird ein sichtbarer Hinweis in den PR-Body eingefügt, damit die Lücke niemals stillschweigend bleibt.

## Was auf GitHub veröffentlicht wird

Dein **Task Prompt** ist eine private Eingabe, kein PR-Inhalt. Nur zwei Dinge werden veröffentlicht: eine `## Change Summary`, die beschreibt, was die Codeänderung bewirkt, und ein Abschnitt `## Screenshots`, wenn Screenshots erfasst wurden. Der PR-Titel wird allein aus der Änderungszusammenfassung abgeleitet.

Der Runner-Prompt legt diese Richtlinie fest, und Heym setzt sie auch nach dem Lauf durch: Bevor irgendetwas committet oder als Pull Request geöffnet wird, entfernt es Prompt-Echo-Abschnitte (`## Task`, `## Prompt`, `## Instructions`, `## Original Request`, …) und jeden Absatz, der wörtlich aus dem Task Prompt kopiert wurde, aus der Zusammenfassung, dem PR-Body und der Commit-Nachricht. Schritt-Narration wie `Both pass. Let me do a final review:` wird ebenfalls als PR-Titel oder Commit-Betreff abgelehnt.

## Rückfragen

Wenn Codex fehlende Anforderungen oder eine Produktentscheidung benötigt, gibt es `needs_input` zurück. Heym pausiert die Ausführung und stellt einen `question`-Ausgabe-Handle bereit. Verbinde diesen Handle mit einem Benachrichtigungszweig, zum Beispiel Slack oder Send Email, um dem Reviewer den öffentlichen Follow-up-Link zu senden.

Wenn der Reviewer antwortet, setzt Heym dieselbe Ausführungs-Snapshot und den Codex-Thread aus den gespeicherten Workspace-Metadaten fort.

## Als Agent-Tool

Der Codex-Knoten kann an den Tool-Handle eines **AI Agent**-Knotens angehängt werden, damit der Agent Coding-Aufgaben delegieren kann. Konfiguriere die Anmeldedaten, die GitHub-Anmeldedaten und das Repository am Knoten und markiere dann **Task Prompt** (und optional **Repository URL**) mit dem vom Agent bereitgestellten Toggle, damit der Agent sie zur Aufrufzeit liefert. Wenn Codex als Tool läuft, wird ein `needs_input`-Ergebnis inline an den Agent zurückgegeben, anstatt den Workflow zu pausieren, sodass der Agent die Anfrage verfeinern und Codex erneut aufrufen kann.

## Beispiel

```json
{
  "id": "codex-1",
  "type": "codex",
  "position": { "x": 420, "y": 120 },
  "data": {
    "label": "fix_pr",
    "credentialId": "codex-credential-uuid",
    "githubCredentialId": "github-credential-uuid",
    "repositoryUrl": "https://github.com/acme/app",
    "baseBranch": "main",
    "taskPrompt": "$input.text",
    "publishMode": "draft_pr",
    "branchName": "codex/$executionId",
    "timeoutSeconds": 3600
  }
}
```

## Verwandte Themen

- [GitHub-Knoten](./github-node.md)
- [Agent-Knoten](./agent-node.md)
- [Credentials](../reference/credentials.md)
- [Freigabe von Anmeldedaten](../reference/credentials-sharing.md)
- [Knotentypen](../reference/node-types.md)
