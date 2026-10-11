# Sicherheit

Sicherheitspraktiken und -konfiguration für die Heym-Plattform.

## Passwortrichtlinie

Alle Passwörter – bei der Registrierung und beim Ändern Ihres Passworts – müssen diese Anforderungen erfüllen:

| Regel | Anforderung |
|------|-------------|
| Mindestlänge | 8 Zeichen |
| Großbuchstaben | Mindestens ein Großbuchstabe (A–Z) |
| Kleinbuchstaben | Mindestens ein Kleinbuchstabe (a–z) |
| Ziffer | Mindestens eine Zahl (0–9) |

Diese Regeln werden sowohl im Frontend als auch im Backend (Pydantic-Validator) durchgesetzt. Eine Anfrage mit einem nicht konformen Passwort wird mit einer `422 Unprocessable Entity`-Antwort abgelehnt, bevor ein Datenbank-Schreibvorgang erfolgt.

**Beispiel eines gültigen Passworts:** `MyWorkflow7!`

## Sitzungsverwaltung

- Access-Token werden in **HttpOnly**-Cookies gespeichert, nicht in `localStorage`. Dies verhindert, dass JavaScript (einschließlich XSS-Payloads) das Token lesen kann.
- Das Refresh-Token ist auf den Pfad `/api/auth/refresh` beschränkt und kann nicht an andere Endpoints gesendet werden.
- Jeder Aufruf von `/api/auth/refresh` **rotiert** das Refresh-Token: Das alte Token wird sofort widerrufen und ein neues ausgestellt. Das erneute Verwenden eines bereits verwendeten Refresh-Tokens gibt `401` zurück.

## Rate Limiting

Die folgenden Endpoints sind pro IP rate-limitiert:

| Endpoint | Limit | Sperrdauer |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 Anfragen / 60 s | 15 min |
| `POST /api/auth/register` | 5 Anfragen / 60 s | 10 min |
| `POST /register` (OAuth-Clients) | 5 Anfragen / 60 s | 10 min |
| Portal-Anmeldung | 3 Versuche | 24 h |

Wenn `REDIS_URL` konfiguriert ist, werden die Rate Limits über alle Backend-Worker hinweg geteilt. Ohne diese Konfiguration gelten die Limits pro Worker-Prozess.

## Verschlüsselung von Anmeldedaten

Alle API-Schlüssel, Webhook-URLs und Bearer-Token, die im [Anmeldedaten](../tabs/credentials-tab.md)-Panel gespeichert sind, werden im Ruhezustand mit AES-256 (Fernet) verschlüsselt, bevor sie in die Datenbank geschrieben werden. Der Schlüssel wird aus der Umgebungsvariable `ENCRYPTION_KEY` abgeleitet. Die Skripte `run.sh` und `deploy.sh` generieren automatisch einen starken Wert, wenn dieser leer ist; die Anwendung verweigert den Start, wenn `ENCRYPTION_KEY` leer ist oder auf einem bekannten Platzhalter belassen wurde.

## MCP-API-Schlüssel

Der MCP-API-Schlüssel wird verwendet, um externe MCP-Clients zu authentifizieren, die sich mit dem Endpoint `/api/mcp/sse` verbinden. Wenn die SSE-Verbindung hergestellt wird, wird ein kurzlebiges (1 Stunde gültiges) Sitzungs-Token ausgestellt und in die URL des Nachrichten-Endpoints eingebettet, anstatt des echten API-Schlüssels, wodurch verhindert wird, dass der Schlüssel in den Server-Zugriffsprotokollen erscheint. Siehe [MCP-Reiter](../tabs/mcp-tab.md) für die Einrichtung.

## OAuth / PKCE

Der OAuth 2.0-Autorisierungsserver (verwendet für MCP-Clients) unterstützt nur den `authorization_code`-Grant mit PKCE (`S256`). Das Einwilligungsformular verwendet HMAC-SHA256-CSRF-Token, die 10 Minuten lang gültig sind. Alle auf der Einwilligungsseite angezeigten Werte werden HTML-escaped.

## Ausführungs-Token

[Ausführungs-Token](./execution-tokens.md) sind bereichsbezogene JWTs zum Aufrufen des Execute-Endpoints eines Workflows aus externen Systemen. Im Gegensatz zu Benutzersitzungs-Token sind sie:

- **Auf einen einzelnen Workflow beschränkt** – ein Token wird für jeden anderen Workflow abgelehnt.
- **Unabhängig widerrufbar** – das Widerrufen eines Tokens hat keine Auswirkung auf die Sitzung des ausstellenden Benutzers.
- **Kurz- oder langlebig** – wählen Sie eine TTL von 60 Sekunden bis 10 Jahren.

Token werden mit demselben Anwendungsgeheimnis (`SECRET_KEY`) signiert und bei jeder Anfrage geprüft: Signatur, Ablauf, Übereinstimmung des `wid`-Claims und Widerrufsstatus. Siehe [Ausführungs-Token](./execution-tokens.md) für die Einrichtung und API-Referenz.

## Inhaltssicherheit

Verwenden Sie [Guardrails](./guardrails.md) auf LLM- und Agent-Knoten, um unsichere oder richtlinienverletzende Benutzernachrichten zu blockieren, bevor sie das Modell erreichen. Guardrails unterstützen neun Inhaltskategorien (Gewalt, Hassrede, sexuelle Inhalte usw.) mit konfigurierbaren Empfindlichkeitsstufen.

## Python-Tool-Sandbox

Benutzerdefinierte Python-Tools auf dem [Agent-Knoten](../nodes/agent-node.md) führen nicht vertrauenswürdigen Code aus. Standardmäßig führt Heym jedes Tool in einem gehärteten, wegwerfbaren Docker-Container aus mit:

- keinem Netzwerkzugriff,
- einem schreibgeschützten Root-Dateisystem mit einem kleinen `tmpfs`-Arbeitsverzeichnis,
- einem Nicht-Root-Benutzer mit allen entfernten Linux-Capabilities und `no-new-privileges`,
- strikten CPU-, Speicher- und PID-Limits und
- **keinem gemounteten Docker-Socket**, sodass ein Tool den Docker-Daemon des Hosts nicht erreichen kann.

Das Ausführungs-Backend wird durch die Umgebungsvariable `HEYM_PYTHON_TOOL_SANDBOX` gesteuert:

| Wert | Verhalten |
|-------|----------|
| `auto` (Standard) | Im gehärteten Docker-Container ausführen. Wenn Docker nicht verfügbar ist, **schlägt die Ausführung fehl-sicher fehl** – sie führt nicht stillschweigend nicht vertrauenswürdigen Code ohne OS-Isolation aus. |
| `docker` | Wie `auto`, aber ohne Fallback. |
| `subprocess` | In einem lokalen In-Process-Subprozess ausführen, der durch eine Import-Allowlist geschützt ist. Dies ist **keine Sicherheitsgrenze** und nur für vertrauenswürdigen Code oder lokale Entwicklung gedacht. `run.sh` wählt diesen Modus für die native Entwicklung. |

Setzen Sie `HEYM_PYTHON_TOOL_IMAGE`, um das Sandbox-Image festzulegen; wenn leer, erkennt Heym automatisch das laufende Backend-Image. Die In-Process-Beschränkungen (eine Import-Allowlist plus Attribut- und Introspektionsfilterung) werden als Defense in Depth angewendet, aber der Container ist die eigentliche Isolationsgrenze – behalten Sie den Standardmodus `auto` (oder `docker`) für Mehrbenutzer- und Produktionsbereitstellungen bei.
## Skill Sandbox

Python-Skills, die an einen [Agent-Knoten](../nodes/agent-node.md) angehängt sind, führen ebenfalls nicht vertrauenswürdigen Code aus — ein Skill kann wortwörtlich in einem geteilten Workflow oder einer Vorlage mit `everyone`-Sichtbarkeit ankommen — daher laufen Skills durch **denselben** `HEYM_PYTHON_TOOL_SANDBOX`-Schalter wie Python-Tools und schlagen auf dieselbe Weise fail-closed fehl. Der Skill-Container ist identisch gehärtet (non-root, alle Capabilities entfernt, `no-new-privileges`, schreibgeschütztes Root-Dateisystem, CPU-/Speicher-/PID-Limits und **kein Docker-Socket**), mit zwei bewussten Unterschieden, weil Skills sie legitim benötigen:

- **Netzwerk-Egress ist erlaubt** (Skills rufen APIs auf und installieren ihre eigenen Abhängigkeiten über `uv`), und
- **ein beschreibbarer Workspace ist gemountet**, damit Skills Ausgabedateien generieren und Heym Drive-Dateien lesen können.

Der Workspace wird mit dem Wegwerf-Schwestercontainer über dasselbe benannte Docker-Volume geteilt, das der Codex-Runner verwendet (`heym-codex-workspaces`, gemountet unter `/app/data/codex-workspaces`). Nur das eigene Unterverzeichnis dieses Laufs wird in den Schwestercontainer gemountet — über einen `volume-subpath` pro Lauf —, sodass ein Skill niemals die Workspace-Daten eines anderen Laufs oder von Codex sieht. Der Docker Compose-Stack mountet dieses Volume immer; der Single-Container-`docker run` muss `-v heym-codex-workspaces:/app/data/codex-workspaces` sowohl für Python-Skills als auch für Codex enthalten. Wenn das Volume im `auto`/`docker`-Modus fehlt, **schlägt die Skill-Ausführung fail-closed fehl**, anstatt im Backend zu laufen. Da Subpath-Mounts pro Lauf **Docker Engine 25.0 oder neuer** erfordern, sollten ältere Engines entweder aktualisieren oder vertrauenswürdige Skills mit `HEYM_PYTHON_TOOL_SANDBOX=subprocess` ausführen.

Nur nicht-geheime, portable Umgebungsvariablen (Proxy- und CA-Bundle-Einstellungen, Locale) werden in den Container weitergegeben; Datenbank-URLs, `SECRET_KEY`/`ENCRYPTION_KEY`, Provider-API-Schlüssel und OAuth-Secrets werden durch eine Allowlist zurückgehalten. Skill-Dateipfade werden validiert, um innerhalb des Workspace zu bleiben, und Symlinks, die im Ausgabeverzeichnis platziert wurden (einschließlich des `_hitl_request.json`-Sentinels), werden niemals verfolgt. Überschreiben Sie die Standardwerte bei Bedarf mit `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` und `HEYM_SKILL_USER`.

Wie bei Tools läuft der `subprocess`-Modus das Skill im Backend-Prozess aus und ist **keine Sicherheitsgrenze** — verwenden Sie ihn nur für vertrauenswürdige Single-User- oder lokale Entwicklung (`run.sh` wählt ihn für native Entwicklung).

## Code-Knoten-Sandbox

Der [Code-Knoten](../nodes/code-node.md) führt beliebiges Benutzer-Python zusammen mit beliebigen Drittanbieter-Abhängigkeiten aus, daher ist er die strengste der drei Sandboxes und die einzige mit **keinem Ausweg**: Er liest keine Sandbox-Modus-Variable, hat keinen `subprocess`-Modus und schlägt fail-closed fehl, wenn kein Docker-Daemon erreichbar ist. Er fällt niemals darauf zurück, Benutzercode im Backend-Prozess auszuführen.

Die Ausführung erfolgt in einem oder zwei Wegwerf-Containern, beide gehärtet wie die Tool- und Skill-Sandboxes (non-root, alle Capabilities entfernt, `no-new-privileges`, schreibgeschütztes Root-Dateisystem, CPU-/Speicher-/PID-Limits und **kein Docker-Socket**):

- Bei einer leeren `requirements.txt` führt ein **einzelner Container mit `--network none`** den Code aus. Der Runner kommt im stdin-Payload des Containers an, sodass überhaupt nichts gemountet wird.
- Bei Abhängigkeiten installiert ein erster Container sie mit Netzwerkzugriff in ein `.deps`-Verzeichnis pro Lauf, und ein zweiter Container mountet diesen Teilbaum **schreibgeschützt** und führt den Code aus. Der Ausführungscontainer hat kein Netzwerk, es sei denn, die `codeAllowNetwork`-Option des Knotens ist aktiviert.

Abhängigkeiten werden mit `uv` installiert, mit `pip` erneut versucht und niemals zwischen Läufen zwischengespeichert. Wenn das Backend in einem Container läuft, lebt das Verzeichnis pro Lauf auf demselben `heym-codex-workspaces`-Volume, das die Skill-Sandbox verwendet, gemountet über einen `volume-subpath` pro Lauf, sodass ein Lauf niemals die Dateien eines anderen sieht; diese Form erfordert **Docker Engine 25.0 oder neuer**. Ein natives Backend (`./run.sh`) hat kein solches Volume und benötigt keines — sein Verzeichnis pro Lauf ist ein lokaler temporärer Pfad, der direkt in den Schwestercontainer bind-mounted wird. In beiden Fällen wird das Verzeichnis nach jeder Ausführung unabhängig vom Ergebnis gelöscht.

Nur nicht-geheime, portable Umgebungsvariablen werden in die Container weitergegeben — Proxy-Einstellungen, CA-Bundles und Locale, die die Abhängigkeitsinstallation benötigt, um PyPI hinter einem Unternehmensproxy zu erreichen. Datenbank-URLs, `SECRET_KEY`/`ENCRYPTION_KEY`, Provider-API-Schlüssel und OAuth-Secrets werden durch eine Allowlist zurückgehalten, sodass ein neues Backend-Secret standardmäßig verworfen wird, anstatt preisgegeben zu werden, bis jemand eine Denylist aktualisiert. Das `HOME` des Backends überschreibt niemals den eigenen beschreibbaren Pfad der Sandbox.

Die Schaltfläche **Format** verwendet dieselbe Sandbox. Ruff parst und schreibt die Quelle um, anstatt sie auszuführen, aber sie auf dem Backend-Host laufen zu lassen würde einer nicht vertrauenswürdigen Datei einen Prozess übergeben, der die gesamte Umgebung des Backends erbt, daher bekommt sie ihren eigenen Wegwerf-`--network none`-Container mit denselben Limits und derselben allowlisteten Umgebung. Sie schlägt ohne Docker fail-closed fehl, anstatt auf dem Host zu formatieren.

Sandbox-Limits sind Konstanten statt Umgebungsvariablen — 512 MB Speicher, eine CPU, 256 Prozesse, ein 120-Sekunden-Installations-Timeout und ein 60-Sekunden-Ausführungs-Timeout. Das Image wird aus der bestehenden `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`-Kette aufgelöst; der Knoten führt keine eigene Konfiguration ein.
## Verwandte Themen

- [Ausführung & Deployment](../getting-started/running-and-deployment.md) – Konfigurieren Sie `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` und `HEYM_PYTHON_TOOL_SANDBOX` beim Start
- [Code-Knoten](../nodes/code-node.md) – Sandboxed Python-Ausführung mit eigenen Abhängigkeiten
- [Agent-Knoten](../nodes/agent-node.md) – Benutzerdefinierte Python-Tools, die in der Sandbox ausgeführt werden
- [Ausführungs-Token](./execution-tokens.md) – Bereichsbezogene JWTs zum Aufrufen von Workflows aus externen Systemen
- [Guardrails](./guardrails.md) – Blockieren Sie unsichere Inhalte in LLM- und Agent-Knoten
- [Einstellungen](./user-settings.md) – Ändern Sie Ihr Passwort
- [Reiter „Anmeldedaten"](../tabs/credentials-tab.md) – Verwalten Sie API-Schlüssel
- [MCP-Reiter](../tabs/mcp-tab.md) – MCP-API-Schlüssel und OAuth-Clients
- [Portal](./portal.md) – Zugriffskontrolle für das öffentliche Chat-Portal
