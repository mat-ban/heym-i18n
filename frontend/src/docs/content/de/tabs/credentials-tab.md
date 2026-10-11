# Reiter Anmeldedaten

Der Reiter **Anmeldedaten** (Credentials) verwaltet alle API-Keys, Zugangsdaten und OAuth-Verbindungen für externe Dienste und LLM-Provider. Anmeldedaten werden zentral gespeichert und in Workflow-Knoten sicher nach Namen referenziert.

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Video-Demo zu Anmeldedaten ansehen</a></p>

## Unterstützte Typen

| Typ | Einsatzzweck |
|---|---|
| **OpenAI / DeepSeek** | API-Keys für LLM-, Agent- und RAG-Knoten |
| **Google** | Google AI (Gemini) API-Keys |
| **GitHub** | Personal Access Tokens (PAT) für Repository-Operationen, Codex und MCP |
| **Linear** | Personal API-Keys oder OAuth2 für Tickets und Projekte |
| **Notion** | Interne Integrations-Tokens oder OAuth-Workspace-Verbindungen |
| **Custom LLM** | Eigene OpenAI-kompatible LLM-Endpoints |
| **Bearer** | Bearer-Tokens für authentifizierte HTTP-Endpoints |
| **Header** | Benutzerdefinierte Header für HTTP-Anfragen |
| **Telegram** | Bot-Tokens und Webhook-Secrets |
| **Slack / Discord** | Webhook-URLs und Bot-Tokens |
| **SMTP / IMAP** | E-Mail-Versand und Posteingangs-Trigger |
| **Redis / RabbitMQ** | Verbindungsdaten für Caching und Message-Broker |
| **Qdrant** | API-Key und Endpoint für externe Qdrant-Vektordatenbanken |
| **Postgres (pgvector)** | Interne Vektordatenbank auf Basis von pgvector |

## Sicherheit & Verschlüsselung

- Alle Passwörter und API-Keys werden mit AES-256 (mittels `ENCRYPTION_KEY`) in PostgreSQL verschlüsselt abgelegt
- Im UI werden Geheimnisse niemals im Klartext angezeigt, sondern durch Maskierungen geschützt
- Über **Verbindung testen** prüfen Sie die Gültigkeit von Anmeldedaten direkt vor dem Speichern

## Freigabe von Anmeldedaten

- Teilen Sie Anmeldedaten gezielt mit anderen Benutzern (per E-Mail) oder ganzen [Teams](./teams-tab.md)
- Freigegebene Anmeldedaten erlauben Mitarbeitern die Nutzung in Workflows, ohne dass diese den zugrundeliegenden API-Key einsehen können

## Verwandte Themen

- [Sicherheit](../reference/security.md) – Verschlüsselung und Datenschutz
- [Freigabe von Anmeldedaten](../reference/credentials-sharing.md) – RBAC und Team-Sharing\n