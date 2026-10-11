# Udostępnianie danych logowania

Dane logowania można udostępniać innym użytkownikom, aby ich workflow mogły korzystać z Twoich kluczy API. Przegląd znajduje się w sekcji [Dane logowania](./credentials.md), a dodawanie i zarządzanie danymi logowania opisano w sekcji [Karta Dane logowania](../tabs/credentials-tab.md).

## Udostępnianie danych logowania modelowi LLM

Aby umożliwić modelowi LLM lub agentowi AI korzystanie z klucza API, należy zapisać klucz jako dane logowania i pozwolić węzłowi wykonującemu żądanie na ich dołączenie. Model decyduje, co wywołać; węzeł uwierzytelnia wywołanie w momencie jego wykonania.

- **Zapisz sekret jako dane logowania.** Wartości wrażliwe są szyfrowane w spoczynku i maskowane w interfejsie po utworzeniu.
- **Odwołuj się do nich w miejscu wykonywania żądania.** Węzły [LLM](../nodes/llm-node.md) i [Agent](../nodes/agent-node.md) wybierają swoje dane logowania modelu po ID, a żądania HTTP umieszczają `$credentials.CredentialName` w nagłówku uwierzytelniania. Sekrety należy trzymać poza polami prompt, ponieważ wszystko, co znajduje się w prompt, jest wysyłane do dostawcy modelu jako tekst.
- **Przekazuj agentowi narzędzia, a nie klucze.** Gdy Agent wywołuje węzeł HTTP, serwer MCP lub pod-workflow jako narzędzie, dane logowania są stosowane wewnątrz tego narzędzia, a model otrzymuje wynik działania narzędzia.
- **Dane wyjściowe są maskowane.** Gdy wartość danych logowania dłuższa niż siedem znaków pojawi się w danych wyjściowych węzła, zachowywanych jest tylko pierwszych siedem znaków, więc odpowiedź powtarzająca klucz pokazuje w wynikach i wykonaniach wyłącznie ten prefiks. Zobacz [Maskowanie danych wyjściowych](#output-masking).
- **Pozwól asystentowi tworzyć dane logowania.** Gdy [Asystent AI](./ai-assistant.md#credentials) lub karta Chat tworzy dane logowania, widzi wyłącznie nazwę i typ, a sekret wprowadza się w standardowym formularzu danych logowania.
- **Udostępniaj osobom w ten sam sposób.** Udostępnij dane logowania użytkownikowi lub zespołowi w sposób opisany poniżej, a ich workflow będą mogły korzystać z Twojego klucza poprzez własne węzły LLM i Agent.

## Model udostępniania

- **CredentialShare** – Łączy `credential_id` z `user_id` (unikalne dla pary)
- **Udostępnianie po adresie e-mail** – `POST /api/credentials/{credential_id}/shares` z adresem e-mail; użytkownik jest wyszukiwany i dodawany
- **Odwołanie** – `DELETE /api/credentials/{credential_id}/shares/{user_id}`

Dane logowania można również udostępniać [Zespołom](./teams.md):

- **CredentialTeamShare** – Łączy `credential_id` z `team_id`; wszyscy członkowie zespołu uzyskują dostęp
- **Udostępnianie zespołowi** – `POST /api/credentials/{credential_id}/team-shares` z `team_id`
- **Odwołanie udostępnienia zespołowi** – `DELETE /api/credentials/{credential_id}/team-shares/{team_id}`

Udostępnione dane logowania wyświetlają wskaźnik w interfejsie [Karty Dane logowania](../tabs/credentials-tab.md).

## Dane logowania o szerokim zakresie

Udostępnienie danych logowania przyznaje odbiorcy wszystko, co te dane logowania mogą zrobić. W przypadku większości integracji zakres ten ogranicza się do jednego workspace lub uprawnień jednego klucza API, ale niektóre dane logowania mają znacznie szerszy zakres.

> **Dane logowania Google Drive przyznają pełny dostęp do Drive.** Dane logowania [Google Drive](../nodes/google-drive-node.md) są autoryzowane z zakresem `https://www.googleapis.com/auth/drive`, aby węzeł mógł operować na plikach, których już jesteś właścicielem. Udostępnienie ich użytkownikowi lub zespołowi daje każdemu z nich możliwość **odczytu, modyfikacji i trwałego usunięcia dowolnego elementu w Twoim Google Drive** poprzez workflow — nie tylko plików, które miałeś na myśli. Należy udostępniać je wyłącznie osobom, którym przyznałbyś pełny dostęp do Drive bezpośrednio.

Jeśli konieczne jest ograniczenie ekspozycji, należy utworzyć dedykowane konto Google z dostępem wyłącznie do folderów potrzebnych workflow i połączyć dane logowania z tym kontem zamiast z kontem głównym.

Dane logowania **Decision Model** zawierają endpoint oraz, jeśli ustawiono, klucz API. Ich udostępnienie pozwala odbiorcy wykorzystywać ten klucz z dowolnego workflow, który może uruchomić, dokładnie tak jak w przypadku danych logowania LLM.

Dane logowania **Model Router** udostępniają wszystko, do czego kierują ruch. Osoby, którym je udostępniono, mogą wykonywać żądania wobec wszystkich danych logowania z listy opcji routera, a żądania te zużywają Twoje klucze. Nie mogą odczytać kluczy, a dane logowania nie pojawiają się na ich własnej liście danych logowania.

Jest to ten sam zakres uprawnień co bezpośrednie udostępnienie danych logowania OpenAI i właśnie to czyni router użytecznym dla zespołu. Jeśli nie jest to pożądane, należy udostępnić poszczególne dane logowania i pozwolić każdej osobie wybrać model.

## Udostępnianie współpracownikom workflow

Gdy udostępniasz workflow, współpracownicy mogą go otwierać i uruchamiać, ale nie mogą korzystać z Twoich danych logowania, o ile nie udostępnisz im również tych danych. Dotyczy to danych logowania w głównym workflow oraz we wszystkich pod-workflow, które są przez niego wywoływane. Należy udostępnić każde dane logowania tym samym użytkownikom lub zespołom, które zaproszono do workflow. Pod-workflow muszą być również udostępnione osobno z edytora workflow podrzędnego. Zobacz [Organizacja workflow](./workflow-organization.md#sharing-workflows).

## Kontekst wykonania

Gdy workflow jest uruchamiany, dane logowania są rozwiązywane dla **właściciela workflow** (lub bieżącego użytkownika w przypadku uruchomienia). Funkcja `get_credentials_context()` scala:

1. **Dane logowania będące własnością** – `Credential.owner_id == user_id`
2. **Dane logowania udostępnione użytkownikowi** – `CredentialShare`, gdzie `CredentialShare.user_id == user_id`
3. **Dane logowania udostępnione zespołowi** – `CredentialTeamShare`, gdzie użytkownik jest członkiem zespołu

Wszystkie są scalane w jeden słownik kontekstu kluczowany nazwą danych logowania.

## Użycie w workflow
### Według nazwy (Expression DSL)

Dane logowania są udostępniane jako `$credentials.CredentialName` w [Expression DSL](./expression-dsl.md). Należy stosować je w przypadku:

- Węzłów HTTP (uwierzytelnianie Bearer/Header)
- Węzłów Telegram
- Węzłów Slack
- Tokenów bearer Notion w niestandardowych żądaniach HTTP (token wewnętrzny lub token dostępu OAuth)
- Dowolnego węzła, który przyjmuje wyrażenia do uwierzytelniania

```dsl
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

### Według identyfikatora (credentialId)

Niektóre węzły przechowują `credentialId` (UUID) w `node.data`:

| Typ węzła | Pole | Opis |
|-----------|-------|-------------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md), Image Gen | `credentialId` | Dane logowania API LLM |
| [Codex](../nodes/codex-node.md) | `credentialId`, `githubCredentialId` | Dane logowania tokenu dostępu Codex oraz dane logowania GitHub |
| [OpenCode Go](../nodes/opencode-go-node.md) | `credentialId`, `githubCredentialId` | Dane logowania bramy OpenCode Go oraz dane logowania GitHub |
| [Jira](../nodes/jira-node.md) | `credentialId` | Dane logowania Jira Cloud (e-mail/token API) lub Data Center (nazwa użytkownika/hasło) |
| [Notion](../nodes/notion-node.md) | `credentialId` | Token wewnętrzny Notion lub dane logowania obszaru roboczego OAuth |
| [Sentry](../nodes/sentry-node.md) | `credentialId` | Token uwierzytelniający Sentry oraz opcjonalny bazowy URL |
| [Supabase](../nodes/supabase-node.md) | `credentialId` | URL projektu Supabase oraz klucz API |
| [ClickHouse](../nodes/clickhouse-node.md) | `credentialId` | Szczegóły połączenia ClickHouse (host, port, uwierzytelnianie, baza danych) |
| [Telegram Trigger](../nodes/telegram-trigger-node.md), [Telegram](../nodes/telegram-node.md) | `credentialId` | Dane logowania bota Telegram |
| [Discord Trigger](../nodes/discord-trigger-node.md), [Discord](../nodes/discord-node.md) | `credentialId` | Klucz publiczny Discord lub dane logowania Webhook |
| Vector Store | `credential_id` | Baza wektorowa Qdrant lub Postgres (pgvector), poprzez dane logowania RAG Qdrant, Psql lub Custom Embeddings |
| Evals | `credential_id`, `judge_credential_id` | Dane logowania modelu; dane logowania modelu lub Decision Model dla sędziego LLM-as-Judge |
| [Playwright](../nodes/playwright-node.md) krok AI | `credentialId` | Model LLM/Vision (dla kroku AI oraz [Auto Heal](../nodes/playwright-node.md#ai-auto-heal)) |

Executor ładuje dane logowania bezpośrednio z bazy danych według identyfikatora i odszyfrowuje konfigurację.

## Maskowanie danych wyjściowych

Po wykonaniu funkcja `mask_sensitive_output()` maskuje wartości danych logowania w danych wyjściowych, zachowując pierwszych siedem znaków każdego sekretu dłuższego niż siedem znaków i zastępując pozostałą część znakami `**`, dzięki czemu sekrety nie są ujawniane w wynikach ani w Wykonaniach.

## Powiązane

- [Credentials Tab](../tabs/credentials-tab.md) – Dodawanie i udostępnianie danych logowania
- [Third-Party Integrations](./integrations.md) – Szczegółowa konfiguracja dla każdego typu danych logowania
- [Teams](./teams.md) – Udostępnianie zespołom
- [Expression DSL](./expression-dsl.md) – Składnia `$credentials`
- [Node Types](./node-types.md) – Węzły korzystające z danych logowania ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [Playwright](../nodes/playwright-node.md), [HTTP](../nodes/http-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md))
- [Agent Node](../nodes/agent-node.md) – Wykorzystuje `credentialId` dla LLM
