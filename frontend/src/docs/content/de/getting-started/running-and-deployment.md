# Betrieb & Deployment

Heym stellt zwei Skripte für unterschiedliche Umgebungen bereit: `run.sh` für die lokale Entwicklung und `deploy.sh` für Produktiv-Deployments mittels Docker Compose.

> **Video-Tutorial:** [Set Up Heym Locally in Under 2 Minutes](https://www.youtube.com/watch?v=P6YvlupUboU) — Klonen des Repositories, Starten von PostgreSQL, Konfiguration der Umgebungsvariablen und Erstellung des ersten Benutzerkontos.

## Voraussetzungen

Beide Skripte setzen folgende installierte Werkzeuge voraus:

| Werkzeug | Zweck |
|---|---|
| [Docker](https://docs.docker.com/get-docker/) | Datenbank-Container (Dev) und kompletter Stack (Prod) |
| [uv](https://github.com/astral-sh/uv) | Python-Paketmanager für das Backend |
| [bun](https://bun.sh) | JavaScript-Laufzeitumgebung für das Frontend |

## Konfiguration der Umgebung

Sowohl `run.sh` als auch `deploy.sh` lesen Einstellungen aus einer `.env`-Datei im Projekt-Root. Falls diese nicht existiert, wird sie automatisch aus `.env.example` generiert.

`SECRET_KEY` und `ENCRYPTION_KEY` werden bei leerem Wert in `.env` automatisch mit kryptografisch sicheren Zufallswerten befüllt.

Manuelle Erstellung der Datei (optional):

```bash
cp .env.example .env
```

Zentrale Umgebungsvariablen:

| Variable | Beschreibung |
|---|---|
| `SECRET_KEY` | **Erforderlich.** JWT-Signaturschlüssel. Wird automatisch generiert, falls leer. |
| `ENCRYPTION_KEY` | **Erforderlich.** Verschlüsselungsschlüssel für Anmeldedaten. Wird automatisch generiert, falls leer. |
| `DATABASE_URL` | Optionale Überschreibung des Datenbank-Verbindungsstrings. |
| `BACKEND_PORT` | Backend-API-Port — Standard: `10105` |
| `FRONTEND_PORT` | Frontend-Port — Standard: `4017` |
| `FRONTEND_URL` | **In Produktion erforderlich.** Öffentliche URL der Applikation (z. B. `https://heym.example.com`). |
| `ALLOW_REGISTER` | Offene Benutzerregistrierung (`false` in Produktion, `true` in Entwicklung). |
| `DOCKER_LOGS_ENABLED` | Aktiviert den Zugriff auf den Protokolle-Reiter via Docker-Socket. |
| `HEYM_PYTHON_TOOL_SANDBOX` | Ausführungsmodus für benutzerdefinierte Python-Tools (`auto`, `docker`, `subprocess`). |

---

## Entwicklung: `run.sh`

`run.sh` startet alle Dienste lokal – Datenbank (Docker-Container), FastAPI-Backend und Vite-Dev-Server – mit einem einzigen Befehl:

```bash
./run.sh
```

**Ablauf im Detail:**
1. Prüft Verfügbarkeit von `docker`, `bun` und `uv`
2. Erstellt `.env` bei Bedarf und generiert Schlüssel
3. Startet PostgreSQL-Container auf Port `6543`
4. Installiert Python-Abhängigkeiten via `uv sync`
5. Führt Alembic-Datenbankmigrationen aus (`alembic upgrade head`)
6. Gibt belegte Ports frei
7. Startet das FastAPI-Backend mit Hot-Reloading (`--reload`)
8. Installiert Frontend-Pakete via `bun install`
9. Startet den Vite-Dev-Server

**Dienst-Adressen (Entwicklung):**

| Dienst | Adresse |
|---|---|
| Frontend | `localhost` auf `FRONTEND_PORT` (Standard: 4017) |
| Backend API | `localhost` auf `BACKEND_PORT` (Standard: 10105) |
| Interaktive API-Dokumentation | `localhost:10105/docs` |
| PostgreSQL | `localhost:6543` |

Mit `Strg+C` beenden Sie alle Dienste geordnet.

---

## End-to-End-Tests: `run_e2e.sh`

Die Playwright-Testsuite prüft die reale Vue-Anwendung gegen das FastAPI-Backend und eine isolierte PostgreSQL-Datenbank:

```bash
./run_e2e.sh
```

Die Suite ist eine Kernpfad- und Regressionssuite. Sie deckt Authentifizierung, Workflow-Lebenszyklus und -Ausführung, ausgewählte Dashboard-Ressourcen, öffentliche Routen und eine gemockte HITL-Review-UI ab. Provider-Integrationen, spezifische Knotentypen und Berechtigungsmatrizen werden vorrangig durch Backend-Tests abgedeckt.

Jeder Lauf erhält einen eigenen temporären PostgreSQL-16-Container, zufällige freie Ports für Datenbank, Backend und Frontend, einen eigenen Authentifizierungsstatus und einen HTML-Bericht. Dadurch können mehrere Testläufe parallel ausgeführt werden, ohne Artefakte zu überschreiben.

Nützliche Befehle:

```bash
./run_e2e.sh --ui         # Interaktiver Playwright-Runner mit isolierter Datenbank
cd frontend
bun run test:e2e:report   # Zuletzt abgeschlossenen lokalen Testbericht öffnen
```

Direkte Aufrufe von `bun run test:e2e` erfordern ein explizites `DATABASE_URL`, um versehentliche Schreibzugriffe auf Entwicklungsdatenbanken zu verhindern. Verwenden Sie für reguläre Läufe `./run_e2e.sh`.

`./check.sh` führt Linting, Typüberprüfung, Formatierung und Backend-Tests ohne die E2E-Suite aus, um schnelle Überprüfungen zu gewährleisten.

---

## Produktion: `deploy.sh`

`deploy.sh` baut und startet den gesamten Stack über Docker Compose. Alle drei Dienste – Datenbank, Backend und Frontend – laufen als Container. Der Backend-Entrypoint führt automatisch Migrationen aus, bevor der Server mit 8 Workern startet.

**Erstmaliges Deployment (Build & Start):**

```bash
./deploy.sh
```

Dies führt ein Zero-Downtime-Deployment durch: Images werden zuerst gebaut, während bestehende Container weiterlaufen; anschließend wird nahtlos auf die neue Version umgeschaltet.

**Verfügbare Befehle:**

| Befehl | Beschreibung |
|---|---|
| `./deploy.sh` | Images bauen und alle Dienste aktualisieren / starten |
| `./deploy.sh --status` | Status aller Container anzeigen |
| `./deploy.sh --logs` | Protokolle aller Container im Stream anzeigen |
| `./deploy.sh --restart` | Alle Container neu starten |
| `./deploy.sh --down` | Alle Container stoppen und entfernen |
| `./deploy.sh --migrate-pgdata` | Einmalige Migration: Überträgt ein bestehendes `data/postgres`-Verzeichnis in das Docker-Volume `heym-postgres-data` und baut Indizes neu auf |
| `./deploy.sh --help` | Hilfe und Nutzungsoptionen anzeigen |

**Datenbankspeicher: Ein Docker Named Volume, kein Host-Verzeichnis.**

Compose speichert PostgreSQL im Docker-Volume `heym-postgres-data`. Ältere Versionen nutzten ein Host-Bind-Mount `./data/postgres`. Host-Bind-Mounts unter macOS (virtiofs) und Windows/WSL2 bieten PostgreSQL nicht die erforderlichen `fsync`-Garantien, was im Laufe der Zeit zu Datenkorruption bei WAL-Segmenten führen kann (`PANIC: could not close file`). Linux-Bind-Mounts waren nie betroffen, aber alle Plattformen nutzen nun einheitlich Named Volumes.

Ein bestehendes Setup mit Daten unter `./data/postgres` wird von `./deploy.sh` automatisch erkannt:

```bash
./deploy.sh --migrate-pgdata   # Dienste stoppen, Daten ins Volume kopieren, Indizes neu aufbauen
./deploy.sh                    # Regulär deployen
```

Die Migration führt ein automatisches `reindexdb` aus, um eventuelle Indexbeschädigungen früherer Bind-Mounts zu beheben. Der Vorgang ist nicht-destruktiv: `./data/postgres` bleibt als Backup erhalten.

**Dienst-Adressen (Produktion):**

Der Frontend-Container ist auf `FRONTEND_PORT` (Standard: 4017) erreichbar. Die Backend-API wird unter `/api` über den Frontend-Container weitergeleitet, sodass in Produktion nur ein einziger öffentlicher Port benötigt wird.

**Container-Übersicht:**

| Container | Beschreibung |
|---|---|
| `heym-db` | Relationale PostgreSQL-Datenbank |
| `heym-backend` | FastAPI-API-Server (8 Worker, gebaut aus `backend/Dockerfile`) |
| `heym-frontend` | Frontend-Container für die Vue-App (gebaut aus `frontend/Dockerfile`) |

**Versions-Update-Badge:**

Der Header zeigt die laufende Docker-Build-Version an. Ist eine neuere Heym-Version auf GitHub verfügbar, erscheint ein violettes **Aktualisieren**-Badge neben der Versionsnummer.

---

## Vorgefertigtes Image: `docker run`

Wenn Sie die Anwendung nicht lokal bauen möchten, können Sie das veröffentlichte Container-Image direkt starten.

Das Image startet Frontend und Backend gemeinsam in einem Container. PostgreSQL läuft separat, konfigurierbar über `DATABASE_URL` oder die `POSTGRES_*`-Variablen.

> **Wichtig:** Verwenden Sie für die PostgreSQL-Datenbank stets ein Docker Named Volume (`-v heym-postgres-data:/var/lib/postgresql/data`).

> **Vektorspeicher-Backend:** Das offizielle `deploy.sh` installiert `postgresql-16-pgvector` automatisch. Bei externen Datenbanken müssen Sie sicherstellen, dass die `vector`-Erweiterung aktiviert ist, falls Sie pgvector nutzen möchten. Andernfalls steht Qdrant uneingeschränkt zur Verfügung.

**Schlüssel generieren:**

```bash
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")
ENCRYPTION_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
sed -i.bak "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|; s|^ENCRYPTION_KEY=.*|ENCRYPTION_KEY=${ENCRYPTION_KEY}|" .env && rm -f .env.bak
```

**Image starten:**

```bash
docker pull ghcr.io/heymrun/heym:latest

docker run --rm \
  --env-file .env \
  -p 4017:4017 \
  --shm-size 2g \
  -e FILE_STORAGE_DIR=/app/data/files \
  -e HEYM_PLUGINS_DIR=/app/data/plugins \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v "$(pwd)/data/files:/app/data/files" \
  -v "$(pwd)/data/plugins:/app/data/plugins" \
  -v heym-codex-workspaces:/app/data/codex-workspaces \
  -v heym-opencode-workspaces:/app/data/opencode-workspaces \
  ghcr.io/heymrun/heym:latest
```

> **Wichtige Hinweise:**
> - `--shm-size 2g` ist zwingend für Playwright/Chromium erforderlich, um Renderer-Abstürze zu verhindern.
> - `FILE_STORAGE_DIR` und `HEYM_PLUGINS_DIR` müssen als absolute Pfade übergeben werden.
> - Der Docker-Socket `/var/run/docker.sock` wird für MCP-Container-Tools benötigt.

---

## Mehrere Instanzen betreiben (Lastverteilung)

Reicht eine einzelne Maschine nicht mehr aus, verbinden Sie eine zweite Instanz mit derselben PostgreSQL-Datenbank. Diese tritt als Worker bei: Hintergrundläufe (Cron, Webhooks, MCP-Tool-Aufrufe, Chat-Trigger) werden entsprechend der unter **Einstellungen → Instanzen** festgelegten Prozentwerte aufgeteilt.

Die Instanzen kommunizieren nicht direkt untereinander, sondern koordinieren sich ausschließlich über PostgreSQL. Datei- und Plugin-Operationen verbleiben immer auf der Hauptinstanz.

Alle Instanzen müssen denselben `SECRET_KEY` und `ENCRYPTION_KEY` verwenden, und der Ingress-Traffic muss ausschließlich an die Hauptinstanz gerichtet sein. Siehe [Lastverteilung](../reference/cluster.md).

---

## Häufige Befehle

**Erstmalige Einrichtung:**

```bash
./run.sh          # Entwicklung: richtet .env ein und generiert Schlüssel automatisch
# oder
./deploy.sh       # Produktion: kompletter Compose-Stack mit automatischer Schlüsselgenerierung
```

**Produktion nach Code-Änderungen aktualisieren:**

```bash
git pull
./deploy.sh       # Baut Images neu und schaltet unterbrechungsfrei um
```

**Produktions-Logs einsehen:**

```bash
./deploy.sh --logs
```

**Produktions-Dienste stoppen:**

```bash
./deploy.sh --down
```

---

## Verwandte Themen

- [Einführung](./introduction.md) – Plattformübersicht
- [Schnellstart](./quick-start.md) – Ersten Workflow erstellen
- [Sicherheit](../reference/security.md) – JWT, Verschlüsselung und CORS-Einstellungen
- [Lastverteilung](../reference/cluster.md) – Mehrere Instanzen im Cluster betreiben\n