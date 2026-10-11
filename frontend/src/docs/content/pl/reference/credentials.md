# Dane logowania

Dane logowania przechowują klucze API oraz sekrety wykorzystywane przez węzły workflow. Dodaje się je w [zakładce Dane logowania](../tabs/credentials-tab.md) i odwołuje się do nich po nazwie w konfiguracji węzła.

## Czym są dane logowania

- **Przechowywane dla każdego użytkownika** – Każde dane logowania należą do użytkownika i mogą być [udostępniane](./credentials-sharing.md) innym użytkownikom lub [Zespołom](./teams.md).
- **Szyfrowane w spoczynku** – Wrażliwe wartości są szyfrowane; interfejs maskuje je po utworzeniu.
- **Przywoływane po nazwie** – Węzły wybierają dane logowania po nazwie (lub ID). Silnik wykonawczy rozwiązuje dane logowania dla właściciela workflow w czasie wykonania.

## Jak węzły z nich korzystają

| Typ węzła | Typowe dane logowania | Przeznaczenie |
|-----------|--------------------|---------|
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [Ewaluacja](../tabs/evals-tab.md) | OpenAI, Google, Custom | Klucz API dla modelu |
| [Decision](../nodes/decision-node.md), sędzia [Ewaluacji](../tabs/evals-tab.md) | Decision Model | Bazowy URL endpointu modelu decyzyjnego oraz opcjonalny klucz API |
| [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), Chat, AI Defaults | Model Router (Auto Model) | Wybiera, który z modeli obsłuży każde żądanie, korzystając z modelu decyzyjnego |
| [Codex](../nodes/codex-node.md) | OpenAI Codex + GitHub | Logowanie do subskrypcji ChatGPT (OAuth) lub token dostępu Codex dla runnera oraz GitHub PAT do operacji na repozytorium |
| [OpenCode Go](../nodes/opencode-go-node.md) | OpenCode Go + GitHub | Klucz API bramy OpenCode Go (opcjonalny bazowy URL) dla runnera oraz GitHub PAT do operacji na repozytorium |
| [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md) | GitHub | GitHub personal access token (PAT) do wywołań GitHub API, operacji węzła GitHub oraz integracji MCP |
| [Jira](../nodes/jira-node.md) | Jira | Cloud: e-mail/token API lub Data Center: nazwa użytkownika/hasło, bazowy URL witryny Jira, tryb wdrożenia oraz opcjonalna wersja REST API |
| [Linear](../nodes/linear-node.md) | Linear | Osobisty klucz API lub OAuth2 dla zespołów, projektów, zgłoszeń i komentarzy |
| [HTTP](../nodes/http-node.md) | Bearer, Header | Uwierzytelnianie żądań |
| [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md) | Telegram | Token bota oraz opcjonalny sekret webhook |
| [Discord](../nodes/discord-node.md) | Discord | URL przychodzącego webhook |
| [Discord Trigger](../nodes/discord-trigger-node.md) | Discord Trigger (Public Key) | Klucz publiczny aplikacji do weryfikacji podpisu |
| [RAG](../nodes/rag-node.md) | RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, RAG: Custom Embeddings | Połączenie z magazynem wektorowym (zewnętrzny Qdrant lub własny Postgres Heym z pgvector) wraz z OpenAI lub dowolnym endpointem embeddingów zgodnym z OpenAI |
| [Slack](../nodes/slack-node.md) | Slack | Webhook lub token API |
| [IMAP Trigger](../nodes/imap-trigger-node.md) | IMAP | Połączenie ze skrzynką odbiorczą |
| [Send Email](../nodes/send-email-node.md) | SMTP | Serwer pocztowy |
| [Redis](../nodes/redis-node.md) | Redis | Połączenie |
| [Grist](../nodes/grist-node.md) | Grist | Klucz API + URL serwera |
| [Google Sheets](../nodes/google-sheets-node.md) | Google Sheets (OAuth2) | Client ID + Client Secret + zgoda OAuth2 |
| [Google Drive](../nodes/google-drive-node.md) | Google Drive (OAuth2) | Client ID + Client Secret + zgoda OAuth2 |
| [BigQuery](../nodes/bigquery-node.md) | BigQuery (OAuth2) | Client ID + Client Secret + zgoda OAuth2 |
| [Supabase](../nodes/supabase-node.md) | Supabase | URL projektu + klucz API (+ opcjonalny domyślny schemat) |
| [ClickHouse](../nodes/clickhouse-node.md) | ClickHouse | Host + port + nazwa użytkownika/hasło + baza danych (+ tryb secure) |
| [Notion](../nodes/notion-node.md) | Notion | Token integracji wewnętrznej lub Client ID + Client Secret + zgoda OAuth integracji publicznej |
| [Sentry](../nodes/sentry-node.md) | Sentry | Token uwierzytelniający oraz opcjonalny bazowy URL własnej instancji |
| [Amazon S3](../nodes/amazon-s3-node.md) | Amazon S3 | Klucz dostępu, klucz tajny, region |
| [RabbitMQ](../nodes/rabbitmq-node.md) | RabbitMQ | URL AMQP |

Szczegółowa konfiguracja (hosty, porty, pola specyficzne dla dostawców) znajduje się w sekcji [Integracje zewnętrzne](./integrations.md). Obejmuje ona konfigurację bota Telegram, pocztę przychodzącą przez IMAP oraz pocztę wychodzącą przez SMTP.

Dane logowania GitHub mogą również zawierać opcjonalny parametr `base_url`, gdy celem jest GitHub
Enterprise Server zamiast GitHub.com. Podczas edycji danych logowania GitHub w celu rotacji tokenu
pozostawienie pustego pola `base_url` zachowuje istniejący endpoint Enterprise. Nowy URL należy wprowadzić wyłącznie wtedy,
gdy endpoint ma zostać zmieniony.

Dane logowania Jira, Linear, Supabase, Notion, Sentry i ClickHouse udostępniają przycisk **Test Connection** w oknie dialogowym danych logowania. W przypadku Jiry sprawdzenie wywołuje endpoint bieżącego użytkownika Jira. W przypadku Linear
sprawdzenie wywołuje Linear API z `getViewer` i potwierdza ważność klucza API lub tokenu OAuth.
Podczas edycji można przetestować połączenie bez ponownego wprowadzania klucza API, jeśli zapisany sekret jest nadal obecny. W przypadku Notion
należy wybrać w oknie dialogowym opcję **Internal token** lub **OAuth**; OAuth korzysta z Client ID i Client Secret
z publicznej integracji Notion. Szczegóły konfiguracji Notion znajdują się w sekcji [Integracje zewnętrzne](./integrations.md#notion).
## Użycie pakietu coding

Zakładka **AI Defaults** w [Ustawieniach](./user-settings.md) pokazuje pozostałe użycie pakietu coding dla danych logowania Codex (własnych i udostępnionych). Dla każdego zestawu danych logowania Codex wyświetla poziomy pasek dla każdego aktywnego okna limitu szybkości — zazwyczaj okno **5 godzin** i/lub **tygodniowe**, w zależności od planu — wraz z procentem pozostałego limitu i odliczaniem do resetu. Dane pochodzą z nagłówków odpowiedzi limitu szybkości backendu Codex, pobieranych na żądanie.

Dane logowania OpenCode Go są tam również wymienione, ale oznaczone jako **„użycie niedostępne"**: bramka OpenCode zen nie udostępnia danych o pozostałym limicie, więc nie można wyświetlić paska.

## W wyrażeniach

Niektóre węzły pozwalają na wyrażenia dla uwierzytelniania. Należy użyć [Expression DSL](./expression-dsl.md) z `$credentials.CredentialName`, aby odwołać się do rozwiązanej wartości poufnej danych logowania wewnątrz wyrażenia. Aby poznać linię nagłówka wymaganą przez każdy typ danych logowania w żądaniu HTTP, należy zapoznać się z [HTTP › Uwierzytelnianie za pomocą danych logowania](../nodes/http-node.md#authenticating-with-credentials).

Dane logowania Codex są celowo wykluczone z `$credentials`. Niezależnie od tego, czy logowanie odbywa się przez ChatGPT (subskrypcja, bez kosztu API za token), czy przez wklejenie Codex `access_token`, tokeny są przekazywane wyłącznie do lokalnego procesu runnera Codex. Tokeny logowania ChatGPT są odświeżane automatycznie w miarę wygasania.

Dane logowania Jira są również wykluczone z `$credentials`. [Węzeł Jira](../nodes/jira-node.md) ładuje dane logowania przez `credentialId` w czasie wykonania. W przypadku niestandardowych wywołań Jira REST nieobsługiwanych przez węzeł Jira należy użyć [węzła HTTP](../nodes/http-node.md) z Jira Basic Auth (`email:api_token` dla Jira Cloud lub `username:password` dla Data Center / Server), na przykład `curl -u you@example.com:YOUR_API_TOKEN https://your-domain.atlassian.net/rest/api/3/myself`. Można również użyć danych logowania [Header](../nodes/http-node.md) z `Authorization: Basic <base64(user:secret)>`. Osobiste tokeny dostępu Jira Data Center / Server oraz uwierzytelnianie Bearer nie są jeszcze obsługiwane przez dane logowania Jira.

| Typ danych logowania | Wartość udostępniana do `$credentials.Name` |
|-----------------|--------------------------------------|
| Bearer | Ciąg tokenu Bearer |
| Header | Kompletna linia `header key: header value`, gotowa do wstawienia jako argument `-H` w cURL |
| GitHub | Osobisty token dostępu |
| Notion | Wewnętrzny `api_token` lub OAuth `access_token` (token Bearer dla wywołań Notion API) |
| Sentry | Token uwierzytelniania Sentry |
| Discord / Slack | URL Webhook |

Przykład:

```
$credentials.MyBearerToken
$credentials.MyNotionWorkspace
```

Do natywnych operacji na bazach danych, stronach i blokach należy użyć **węzła** Notion. Należy użyć `$credentials`, gdy niestandardowe żądanie [HTTP](../nodes/http-node.md) wymaga tego samego tokenu Bearer Notion.

## Tworzenie danych logowania z Chat

[Asystent AI](./ai-assistant.md#credentials), [zakładka Chat](../tabs/chat-tab.md) oraz [Chat z Heym](./chat-with-heym.md) mogą utworzyć dane logowania, gdy workflow ich wymaga, lub na każde żądanie. Asystent proponuje typ i nazwę, a standardowy formularz danych logowania otwiera się w rozmowie. Po poproszeniu o aktualizację posiadanych danych logowania ten sam formularz otwiera się na nich, z zamaskowanymi wartościami poufnymi. Asystent widzi wyłącznie nazwę i typ. `heym_chat` przez [MCP](../tabs/mcp-tab.md) nie może tworzyć, aktualizować ani wybierać danych logowania.

## Powiązane

- [Zakładka Dane logowania](../tabs/credentials-tab.md) – Dodawanie, edycja, usuwanie danych logowania
- [Węzeł GitHub](../nodes/github-node.md) – Natywne operacje GitHub REST
- [Węzeł Jira](../nodes/jira-node.md) – Automatyzacja projektów, zgłoszeń, komentarzy, załączników, użytkowników, powiadomień i przejść Jira
- [Węzeł Linear](../nodes/linear-node.md) – Automatyzacja workspace i zgłoszeń Linear GraphQL
- [Węzeł Notion](../nodes/notion-node.md) – Wyszukiwanie i zarządzanie treścią Notion
- [Węzeł Sentry](../nodes/sentry-node.md) – Automatyzacja organizacji, projektów, zespołów, zgłoszeń, zdarzeń i wydań Sentry
- [Udostępnianie danych logowania](./credentials-sharing.md) – Udostępnianie użytkownikom i zespołom
- [Integracje zewnętrzne](./integrations.md) – Przewodnik konfiguracji dla każdego typu danych logowania
- [Expression DSL](./expression-dsl.md) – `$credentials` w wyrażeniach

## Model Router (Auto Model)

Model Router nie przechowuje żadnego klucza. Przechowuje **dane logowania modelu decyzyjnego**, listę **opcji modeli** — każda to istniejące dane logowania OpenAI, Google lub Custom wraz z modelem — oraz, dla każdej opcji, dowolny tekst określający, kiedy dana opcja powinna być używana.

Pojawia się w każdym selektorze oferującym model: węzłach [LLM](../nodes/llm-node.md) i [Agent](../nodes/agent-node.md), Chat, AI Defaults, Dashboardach, kreatorze wyrażeń oraz Tabelach danych. Jego jedynym modelem jest **Auto**. Po jego wybraniu model decyzyjny odczytuje każde żądanie i kieruje je. [Ewaluacja](../tabs/evals-tab.md) pomija go, ponieważ ewaluacja porównuje konkretne modele, a router wybiera samodzielnie.

Agent przekierowuje w miarę postępu pętli narzędzi, więc tani model może obsłużyć wczesne tury, a silniejszy tę, która go wymaga. Identyczne dane wejściowe wykorzystują poprzednią decyzję, więc pętla płaci za decyzję tylko wtedy, gdy rozmowa faktycznie się posunęła.

### Czego nie może zrobić

Auto Model nie może być łączony z **Responses API**, **trybem Batch** ani **wyjściem obrazu**. Te przełączniki wyłączają się same, gdy wybrany jest router, a każdy z nich podaje przyczynę. Kontrole Guardrail oraz klasyfikator polityki przeglądu przez człowieka to stałe wywołania pojedynczego modelu i nigdy nie są kierowane.
### Gdy routing zawodzi

Należy oznaczyć jedną opcję jako **Use this option when routing fails**, a awaria modelu decyzyjnego nigdy nie zatrzyma wykonania; zostanie użyty fallback, a przyczyna zostanie zapisana w wykonaniu. Bez takiej opcji węzeł zakończy się niepowodzeniem, zamiast zgadywać.

### Podgląd, dokąd trafiło żądanie

Wykonania pokazują `Auto Model / GPT-5`, a nie sam model, a koszt pozostaje przypisany do modelu, który faktycznie został uruchomiony. Dziennik wykonania na canvasie oraz Span View pokazują tę samą parę, a Span View wylicza, która tura trafiła gdzie.
