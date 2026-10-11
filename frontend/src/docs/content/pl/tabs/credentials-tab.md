# Karta Dane logowania

Karta **Dane logowania** zarządza kluczami API i sekretami używanymi przez węzły. Dodaj dane logowania w tym miejscu i odwołuj się do nich po nazwie w węzłach workflow. Aby zapoznać się z omówieniem czym są dane logowania i jak używają ich węzły, zobacz [Dane logowania](../reference/credentials.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Obejrzyj demonstrację Dane logowania</a></p>

## Typy danych logowania

| Typ | Zastosowanie |
|------|----------|
| **OpenAI** | Klucz API OpenAI dla węzłów LLM, Agent i RAG |
| **Google** | Klucz API Google AI (Gemini) |
| **GitHub** | GitHub personal access token (PAT) dla GitHub API, workflow węzła GitHub, serwerów MCP oraz workflow agentów; opcjonalny `base_url` GitHub Enterprise |
| **Linear** | Linear personal API key lub OAuth2 dla zespołów, projektów, zgłoszeń i komentarzy |
| **Notion** | Internal integration token lub autoryzacja workspace przez OAuth public-integration |
| **Custom** | Niestandardowe endpointy LLM |
| **Bearer** | Bearer token dla uwierzytelniania HTTP |
| **Header** | Niestandardowy nagłówek klucz-wartość dla żądań HTTP |
| **Telegram** | Token bota Telegram i opcjonalny sekret webhook |
| **Slack** | URL przychodzącego webhook Slack |
| **Discord** | URL przychodzącego webhook Discord |
| **Discord Trigger** | Klucz publiczny aplikacji Discord |
| **IMAP** | Dane logowania triggera skrzynki odbiorczej |
| **SMTP** | Dane logowania do wysyłania wiadomości e-mail |
| **Redis** | Połączenie z Redis |
| **RAG: Qdrant + OpenAI** | Magazyn wektorowy dla węzłów RAG, oparty na zewnętrznym serwerze Qdrant |
| **RAG: Psql + OpenAI** | Magazyn wektorowy dla węzłów RAG, oparty na własnej bazie danych Postgres Heym (pgvector) — bez usługi zewnętrznej |
| **RAG: Custom Embeddings** | Magazyn wektorowy dla węzłów RAG wykorzystujący dowolny endpoint embeddingów zgodny z OpenAI, z Qdrant lub Postgres (pgvector) jako magazynem |
| **Cohere** | Cohere API dla embeddingów |

## Dodawanie danych logowania

1. Kliknij **Add Credential**
2. Wybierz typ danych logowania
3. Wprowadź wymagane wartości (klucz API, URL itp.)
4. Nadaj nazwę, aby odwoływać się do nich w węzłach

W przypadku GitHub bieżący przepływ danych logowania opiera się na PAT. Zalecane są fine-grained PAT. Przepływy instalacji GitHub App nie są obecnie obsługiwane w interfejsie jako rozwiązanie pierwszorzędne. W przypadku GitHub Enterprise Server można również ustawić opcjonalny bazowy URL GitHub API, taki jak `https://github.example.com/api/v3`.

W przypadku Linear wybierz w oknie dialogowym **Personal API key** lub **OAuth2**. Osobiste klucze API tworzy się
w Linear w sekcji **Settings → Security & Access → Personal API keys**. OAuth2 wykorzystuje Client ID i Client Secret
aplikacji OAuth Linear, z `{FRONTEND_URL}/api/credentials/linear/oauth/callback`
zarejestrowanym jako URI przekierowania. Dane logowania działają z uprawnieniami użytkownika Linear, który
je utworzył lub autoryzował. Użyj **Test Connection** w oknie dialogowym danych logowania, aby zweryfikować klucz API lub
token OAuth przed zapisaniem.

W przypadku **Notion** wybierz w oknie dialogowym **Internal token** lub **OAuth**. OAuth wykorzystuje Client ID i
Client Secret z publicznej integracji Notion; Heym przechowuje je zaszyfrowane w danych logowania.
Użyj **Test Connection**, aby zweryfikować dane logowania Supabase, Linear lub Notion przed zapisaniem workflow. Szczegóły konfiguracji Notion
znajdziesz w [Integracje zewnętrzne](../reference/integrations.md#notion).

Dane logowania OAuth otwierają stronę autoryzacji dostawcy w oknie popup. Jeśli przeglądarka ją zablokuje, użyj linku **Open the authorization page** pod przyciskiem Connect; okno dialogowe wykrywa ukończenie połączenia. Po połączeniu nowych danych logowania przycisk pokazuje **Connected**.

## Edycja i usuwanie

- **Edit** – Aktualizacja wartości danych logowania (wartości wrażliwe są maskowane)
- **Delete** – Usunięcie danych logowania; workflow, które ich używają, będą wymagały zamiennika

Podczas edycji danych logowania **GitHub** w GitHub Enterprise Server pozostawienie opcjonalnego pola **GitHub
API Base URL** pustego zachowuje istniejący endpoint Enterprise. Wprowadź nowy URL tylko wtedy, gdy
chcesz zmienić ten endpoint.

## Udostępnianie

- [Udostępniaj dane logowania](../reference/credentials-sharing.md) innym użytkownikom przez e-mail lub [Zespołom](../reference/teams.md)
- Udostępnione dane logowania są oznaczone wskaźnikiem
- Cofnij udostępnianie z menu karty danych logowania
## Używanie w węzłach

Dane logowania należy przywoływać po nazwie w konfiguracji węzła. Na przykład:
- [Węzeł LLM](../nodes/llm-node.md) – Wybór danych logowania dla API modelu
- [Węzeł HTTP](../nodes/http-node.md) – Użycie danych logowania Bearer lub Header do uwierzytelniania
- [Węzeł Agent](../nodes/agent-node.md) – Przekazywanie tokenów GitHub do zmiennych środowiskowych serwera MCP, takich jak `GITHUB_PERSONAL_ACCESS_TOKEN`
- [Węzeł GitHub](../nodes/github-node.md) – Wykonywanie natywnych operacji na repozytoriach, użytkownikach, zgłoszeniach, recenzjach, wydaniach, workflow, ruchu i plikach GitHub
- [Węzeł Linear](../nodes/linear-node.md) – Odczyt metadanych obszaru roboczego oraz automatyzacja zgłoszeń i komentarzy Linear
- [Węzeł Notion](../nodes/notion-node.md) – Zarządzanie bazami danych, źródłami danych, stronami i blokami Notion
- [Węzeł RAG](../nodes/rag-node.md) – Użycie danych logowania Qdrant lub Postgres (pgvector) dla magazynu wektorowego
- [Węzeł Telegram Trigger](../nodes/telegram-trigger-node.md) – Odbieranie webhooków bota Telegram
- [Węzeł Telegram](../nodes/telegram-node.md) – Wysyłanie wiadomości bota Telegram
- [Węzeł Discord Trigger](../nodes/discord-trigger-node.md) – Odbieranie webhooków interakcji Discord
- [Węzeł Discord](../nodes/discord-node.md) – Wysyłanie wiadomości webhook Discord
- [Węzeł IMAP Trigger](../nodes/imap-trigger-node.md) – Odpytywanie współdzielonej skrzynki odbiorczej w poszukiwaniu nowych wiadomości e-mail

Informacje na temat przywoływania wartości opartych na danych logowania w wyrażeniach znajdują się w sekcji [Expression DSL](../reference/expression-dsl.md).

## Powiązane

- [Integracje zewnętrzne](../reference/integrations.md) – Szczegółowy przewodnik konfiguracji dla każdego typu danych logowania (Telegram, Discord, Qdrant, Grist, IMAP, SMTP, RabbitMQ, Redis, Slack i inne)
- [Udostępnianie danych logowania](../reference/credentials-sharing.md) – Udostępnianie danych logowania innym użytkownikom
- [Bezpieczeństwo](../reference/security.md) – Szyfrowanie danych w spoczynku, zarządzanie sesjami, ograniczanie liczby żądań
- [Typy węzłów](../reference/node-types.md) – Węzły korzystające z danych logowania ([LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [GitHub](../nodes/github-node.md), [Linear](../nodes/linear-node.md), [RAG](../nodes/rag-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord](../nodes/discord-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [Slack](../nodes/slack-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md))
- [Karta Magazyny wektorowe](./vectorstores-tab.md) – Korzysta z danych logowania Qdrant lub Postgres (pgvector)
- [Karta Chat](./chat-tab.md) – Korzysta z danych logowania OpenAI/Google
- [Contextual Showcase](../reference/contextual-showcase.md) – Zwięzły przewodnik po stronach interfejsu panelu
