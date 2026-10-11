# Freigabe von Anmeldedaten

Credentials können mit anderen Benutzern geteilt werden, damit deren Workflows deine API-Schlüssel verwenden können. Eine Übersicht findest du unter [Credentials](./credentials.md) und Informationen zum Hinzufügen und Verwalten von Credentials im [Credentials-Reiter](../tabs/credentials-tab.md).

## Credentials mit einem LLM teilen

Damit ein LLM oder ein AI-Agent einen API-Schlüssel verwenden kann, speichere den Schlüssel als Credential und lasse den Knoten, der die Anfrage stellt, ihn anhängen. Das Modell entscheidet, was aufgerufen wird; der Knoten authentifiziert den Aufruf, wenn er ausgeführt wird.

- **Speichere das Secret als Credential.** Sensible Werte werden im Ruhezustand verschlüsselt und nach der Erstellung in der UI maskiert.
- **Referenziere es dort, wo die Anfrage gestellt wird.** Die Knoten [LLM](../nodes/llm-node.md) und [Agent](../nodes/agent-node.md) wählen ihr Modell-Credential per ID aus, und HTTP-Anfragen setzen `$credentials.CredentialName` in den Auth-Header. Halte Secrets aus Prompt-Feldern heraus, denn alles in einem Prompt wird als Text an den Modell-Anbieter gesendet.
- **Gib dem Agenten Tools, keine Schlüssel.** Wenn ein Agent einen HTTP-Knoten, einen MCP-Server oder einen Sub-Workflow als Tool aufruft, wird das Credential innerhalb dieses Tools angewendet und das Modell erhält das Ergebnis des Tools.
- **Ausgaben werden maskiert.** Wenn ein Credential-Wert mit mehr als sieben Zeichen in der Ausgabe eines Knotens erscheint, werden nur die ersten sieben Zeichen beibehalten, sodass eine Antwort, die einen Schlüssel wiedergibt, in Ergebnissen und Traces nur dieses Präfix zeigt. Siehe [Ausgabe-Maskierung](#output-masking).
- **Lasse den Assistenten Credentials erstellen.** Wenn der [KI-Assistent](./ai-assistant.md#credentials) oder der Chat-Reiter ein Credential erstellt, sieht er nur den Namen und den Typ, und du gibst das Secret im regulären Credential-Formular ein.
- **Teile auf dieselbe Weise mit Personen.** Teile das Credential mit einem Benutzer oder einem Team, wie unten beschrieben, und deren Workflows können deinen Schlüssel über ihre eigenen LLM- und Agent-Knoten verwenden.

## Sharing-Modell

- **CredentialShare** – Verknüpft `credential_id` mit `user_id` (eindeutig pro Paar)
- **Teilen per E-Mail** – `POST /api/credentials/{credential_id}/shares` mit E-Mail; der Benutzer wird nachgeschlagen und hinzugefügt
- **Widerrufen** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Du kannst Credentials auch mit [Teams](./teams.md) teilen:

- **CredentialTeamShare** – Verknüpft `credential_id` mit `team_id`; alle Teammitglieder erhalten Zugriff
- **Mit Team teilen** – `POST /api/credentials/{credential_id}/team-shares` mit `team_id`
- **Team-Sharing widerrufen** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Geteilte Credentials zeigen einen Indikator in der UI des [Credentials-Reiters](../tabs/credentials-tab.md) an.

## Credentials mit großem Geltungsbereich

Das Teilen eines Credentials gewährt dem Empfänger alles, was dieses Credential tun kann. Bei den meisten Integrationen ist das auf einen Workspace oder die Berechtigungen eines API-Schlüssels beschränkt, aber einige Credentials sind weitaus umfassender.

> **Google Drive-Credentials gewähren vollständigen Drive-Zugriff.** Das [Google Drive](../nodes/google-drive-node.md)-Credential wird mit dem Scope `https://www.googleapis.com/auth/drive` autorisiert, damit der Knoten auf Dateien zugreifen kann, die dir bereits gehören. Wenn du es mit einem Benutzer oder einem Team teilst, erhält jeder Einzelne von ihnen die Möglichkeit, **alles in deinem Google Drive über einen Workflow zu lesen, zu ändern und dauerhaft zu löschen** – nicht nur die Dateien, die du im Sinn hattest. Teile es nur mit Personen, denen du auch direkt vollständigen Drive-Zugriff geben würdest.

Wenn du die Exposition einschränken musst, erstelle ein dediziertes Google-Konto mit Zugriff nur auf die Ordner, die der Workflow benötigt, und verbinde das Credential mit diesem Konto statt mit deinem primären.

Ein **Decision Model**-Credential enthält den Endpoint und, falls gesetzt, einen API-Schlüssel. Wenn du es teilst, kann der Empfänger über diesen Schlüssel aus jedem Workflow heraus Aufrufe tätigen, den er ausführen kann, genau wie bei einem LLM-Credential.

Ein **Model Router**-Credential teilt alles, wohin es routet. Die Personen, mit denen du es teilst, können Anfragen gegen jedes Credential in seiner Optionsliste ausführen, und diese Anfragen verbrauchen deine Schlüssel. Sie können die Schlüssel nicht lesen, und die Credentials erscheinen nicht in ihrer eigenen Credential-Liste.

Dies ist dieselbe Gewährung wie das direkte Teilen eines OpenAI-Credentials, und genau das macht einen Router für ein Team nützlich. Wenn du das nicht möchtest, teile stattdessen die einzelnen Credentials und lasse jede Person ein Modell auswählen.

## Teilen mit Workflow-Mitarbeitern

Wenn du einen Workflow teilst, können Mitarbeiter ihn öffnen und ausführen, aber deine Credentials nicht verwenden, es sei denn, du teilst diese Credentials ebenfalls mit ihnen. Dies gilt für Credentials im Haupt-Workflow und in allen Sub-Workflows, die er aufruft. Teile jedes Credential mit denselben Benutzern oder Teams, die du zum Workflow eingeladen hast. Sub-Workflows müssen zudem separat aus dem Editor des untergeordneten Workflows geteilt werden. Siehe [Workflow-Organisation](./workflow-organization.md#sharing-workflows).

## Ausführungskontext

Wenn ein Workflow ausgeführt wird, werden Credentials für den **Workflow-Eigentümer** (oder den aktuellen Benutzer bei der Ausführung) aufgelöst. `get_credentials_context()` führt zusammen:

1. **Eigene Credentials** – `Credential.owner_id == user_id`
2. **Benutzer-geteilte Credentials** – `CredentialShare`, wobei `CredentialShare.user_id == user_id`
3. **Team-geteilte Credentials** – `CredentialTeamShare`, wobei der Benutzer Mitglied des Teams ist

Alle werden in ein einzelnes Kontext-Dict zusammengeführt, das nach dem Credential-Namen verschlüsselt ist.

## Verwendung in Workflows

### Nach Name (Expression DSL)

Credentials werden als `$credentials.CredentialName` in der [Ausdrucks-DSL](./expression-dsl.md) bereitgestellt. Verwende dies für:

- HTTP-Knoten (Bearer/Header-Auth)
- Telegram-Knoten
- Slack-Knoten
- Notion-Bearer-Tokens in benutzerdefinierten HTTP-Anfragen (internes Token oder OAuth-Zugriffstoken)
- Jeden Knoten, der Ausdrücke für die Authentifizierung akzeptiert

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```
### Nach ID (credentialId)

Einige Knoten speichern `credentialId` (UUID) in `node.data`:

| Knotentyp | Feld | Beschreibung |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | LLM-API-Anmeldedaten |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Codex-Zugriffstoken-Anmeldedaten und GitHub-Anmeldedaten |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | OpenCode Go-Gateway-Anmeldedaten und GitHub-Anmeldedaten |
| [Jira](../nodes/jira-node.md) | `credentialId` | Jira Cloud E-Mail/API-Token oder Data Center Benutzername/Passwort-Anmeldedaten |
| [Notion](../nodes/notion-node.md) | `credentialId` | Notion internes Token oder OAuth-Workspace-Anmeldedaten |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Sentry-Authentifizierungstoken und optionale Basis-URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | Supabase-Projekt-URL und API-Schlüssel |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | ClickHouse-Verbindungsdetails (Host, Port, Authentifizierung, Datenbank) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Telegram-Bot-Anmeldedaten |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Discord Public Key oder Webhook-Anmeldedaten |
| Vector Store | `credential_id` | Qdrant- oder Postgres- (pgvector) Vektordatenbank, über Qdrant-, Psql- oder Custom Embeddings RAG-Anmeldedaten |
| Evals | `credential_id`, `judge_credential_id` | Modell-Anmeldedaten; Modell- oder Decision Model-Anmeldedaten für den LLM-as-Judge-Richter |
| [Playwright](../nodes/playwright-node.md) AI step | `credentialId` | LLM/Vision-Modell (für AI step und [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Der Executor lädt die Anmeldedaten direkt per ID aus der Datenbank und entschlüsselt die Konfiguration.

## Ausgabe-Maskierung

Nach der Ausführung maskiert `mask_sensitive_output()` Anmeldedaten-Werte in Ausgaben, wobei die ersten sieben Zeichen jedes Geheimnisses, das länger als sieben Zeichen ist, beibehalten und der Rest durch `**` ersetzt wird, sodass Geheimnisse nicht in Ergebnissen oder Traces offengelegt werden.

## Verwandte Themen

- [Reiter Anmeldedaten](../tabs/credentials-tab.md) – Anmeldedaten hinzufügen und teilen
- [Drittanbieter-Integrationen](./integrations.md) – Detaillierte Einrichtung für jeden Anmeldedaten-Typ
- [Teams](./teams.md) – Mit Teams teilen
- [Ausdrucks-DSL](./expression-dsl.md) – `$credentials`-Syntax
- [Knotentypen](./node-types.md) – Knoten, die Anmeldedaten verwenden ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent-Knoten](../nodes/agent-node.md) – Verwendet `credentialId` für LLM
