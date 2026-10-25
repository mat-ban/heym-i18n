# Pełny zestaw funkcji Heym

Kompleksowy przegląd wszystkich możliwości Heym. Każda sekcja opisuje funkcję lub koncepcję w kilku zdaniach.

---

## Pierwsze kroki

### [Wprowadzenie](../getting-started/introduction.md)

Heym to infrastruktura do uruchamiania i zarządzania agentami AI w środowisku produkcyjnym. Systemy agentowe buduje się na wizualnym canvasie i uruchamia z pełnym zaufaniem: orkiestracja agentów, automatyzacja procesów biznesowych, wgląd w każde wykonanie oraz kontrola człowieka na własnej infrastrukturze. Platforma obsługuje wizualne workflow, węzły oparte na AI ([LLM](../nodes/llm-node.md), [Węzeł Agent](../nodes/agent-node.md), [Qdrant RAG](../nodes/rag-node.md)), [Asystenta AI](./ai-assistant.md), integracje ([HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Notion](../nodes/notion-node.md), [WebSocket Send](../nodes/websocket-send-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), przychodzącą pocztę e-mail [IMAP Trigger](../nodes/imap-trigger-node.md), wychodzące [Send Email](../nodes/send-email-node.md)), harmonogramowanie z [Cron](../nodes/cron-node.md) oraz portale [Portal](./portal.md) typu chat dla użytkowników końcowych.

Zobacz także [Kluczowe koncepcje](../getting-started/core-concepts.md), [Typy węzłów](./node-types.md) oraz [Integracje zewnętrzne](./integrations.md).

### [Dlaczego Heym](../getting-started/why-heym.md)

Sekcja „Dlaczego Heym" omawia cykl życia agenta (budowa, orkiestracja, uruchamianie, obserwacja, ewaluacja, kontrola, udostępnianie) i pokazuje, co jeden samodzielnie hostowany runtime obsługuje na każdym etapie. Obejmuje to węzeł [LLM](../nodes/llm-node.md) oraz [Węzeł Agent](../nodes/agent-node.md) z wywoływaniem narzędzi, narzędziami Python, połączeniami [MCP](../tabs/mcp-tab.md), umiejętnościami i orkiestracją wielu agentów; triggery, ponowne próby i [rozproszenie obciążenia](./cluster.md); [Wykonania](../tabs/traces-tab.md) z kosztem USD na przebieg i eksportem OpenTelemetry; [Ewaluacje](../tabs/evals-tab.md); [punkty kontrolne przeglądu przez człowieka](./human-in-the-loop.md), guardrails, SSO oraz ścieżkę audytu; a także endpointy REST, MCP i Portal. Stronę zamyka porównanie możliwości z n8n, Zapier i Make.com.

Zobacz także [Węzeł Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md), [Qdrant RAG](../nodes/rag-node.md) oraz [Architektura agenta](./agent-architecture.md).

### [Szybki start](../getting-started/quick-start.md)

Uruchomienie pierwszego workflow w kilka minut: utwórz workflow z zakładki [Workflows](../tabs/workflows-tab.md), dodaj węzeł [Input](../nodes/input-node.md), węzeł [LLM](../nodes/llm-node.md) oraz węzeł [Output](../nodes/output-node.md), a następnie połącz je. Skonfiguruj [LLM](../nodes/llm-node.md) z danymi logowania i ustaw `userMessage` na `$input.text`; użyj opcji Run lub [Asystenta AI](./ai-assistant.md), aby wykonać lub wygenerować workflow w języku naturalnym.

Naturalnie łączy się z [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Output](../nodes/output-node.md) oraz [Expression DSL](./expression-dsl.md).

### [Kluczowe koncepcje](../getting-started/core-concepts.md)

Workflow to grafy skierowane złożone z węzłów połączonych krawędziami; wykonanie przepływa od węzłów triggerujących ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [WebSocket Trigger](../nodes/websocket-trigger-node.md)) przez węzły przetwarzające aż do węzłów [Output](../nodes/output-node.md). Każdy węzeł ma typ, dane (konfigurację) oraz wejścia/wyjścia; krawędzie definiują przepływ danych. Węzły odwołują się do danych z wcześniejszych etapów za pomocą wyrażeń [Expression DSL](./expression-dsl.md), takich jak `$nodeLabel.field`; niezależne węzły uruchamiają się automatycznie [równolegle](./parallel-execution.md).

Zobacz także [Triggery](./triggers.md), [Wykonanie równoległe](./parallel-execution.md) oraz [Struktura workflow](./workflow-structure.md).

### [Uruchamianie i wdrażanie](../getting-started/running-and-deployment.md)

Heym udostępnia skrypt `run.sh` do rozwoju lokalnego (baza danych w Dockerze, backend FastAPI, frontend Vite) oraz `deploy.sh` do środowiska produkcyjnego z Docker Compose. Oba korzystają z pliku `.env`; kluczowe zmienne to `SECRET_KEY`, `ENCRYPTION_KEY`, `DATABASE_URL` oraz `ALLOW_REGISTER`. Środowisko deweloperskie działa na konfigurowalnych portach frontendu i backendu; środowisko produkcyjne udostępnia API pod ścieżką `/api` przez kontener frontendu.

Zobacz także [Bezpieczeństwo](./security.md), [Enterprise](./enterprise.md) oraz [Ustawienia](./user-settings.md).

### [Migracja do Heym](../getting-started/migrate-to-heym.md)

Narzędzie AI Convert przekształca workflow z innej platformy (n8n, Flowise, Dify, Langflow, sim.ai, Activepieces) lub opis w języku naturalnym w workflow Heym, strumieniowany na żywo na canvas i gotowy do [pobrania i importu](./download-import.md). Uruchamia kontrolę bezpieczeństwa AI, a następnie generuje DSL z uwzględnieniem limitów wejściowych i szybkości. Otwórz je pod adresem [heym.run/convert](https://heym.run/convert).

Zobacz także [Szybki start](../getting-started/quick-start.md), [Pobieranie i import](./download-import.md) oraz [Asystent AI](./ai-assistant.md).

---

## Węzły

### Triggery
#### [Węzeł wejściowy](../nodes/input-node.md)

Węzeł wejściowy stanowi punkt wejścia dla workflow, które odbierają dane od użytkownika lub wywołującego API. Obsługuje pojedyncze lub wiele pól wejściowych oraz udostępnia metadane żądania (nagłówki, parametry zapytania). Dostęp do pól treści uzyskuje się przez `$nodeLabel.body.fieldKey`, do nagłówków przez `$nodeLabel.headers`, a do parametrów zapytania przez `$nodeLabel.query`.

Współpracuje w naturalny sposób z węzłami [Condition](../nodes/condition-node.md), [LLM](../nodes/llm-node.md) oraz [Output](../nodes/output-node.md). Informacje na temat odwołań do payloadu i dostępu do pól znajdują się w sekcjach [Expression DSL](./expression-dsl.md) oraz [Webhooks](./webhooks.md).

#### [Cron](../nodes/cron-node.md)

Węzeł Cron uruchamia workflow zgodnie z harmonogramem przy użyciu standardowego pięciopolowego wyrażenia cron. Nie jest wymagane żadne działanie użytkownika — workflow uruchamia się automatycznie w określonych momentach (np. co godzinę, codziennie, co 15 minut). Dane wyjściowe stanowią zdarzenie triggera bez payloadu.

Zobacz także [Triggers](./triggers.md), [Wait](../nodes/wait-node.md) oraz [Execution History](./execution-history.md) w kontekście uruchomień zaplanowanych i opóźnionych.

#### [IMAP Trigger](../nodes/imap-trigger-node.md)

Węzeł IMAP Trigger odpytuje skrzynkę odbiorczą w konfigurowalnym interwale minutowym i uruchamia workflow dla każdego nowo wykrytego e-maila. Zwraca przetworzone nagłówki, listy nadawców i odbiorców, treści w formacie plain-text i HTML, metadane załączników oraz znacznik czasu triggera. Znajduje zastosowanie w segregacji skrzynek wsparcia, kierowaniu wiadomości ze skrzynki do [Slack](../nodes/slack-node.md) oraz w procesach zatwierdzania opartych na e-mailach z wykorzystaniem [Human-in-the-Loop](./human-in-the-loop.md).

Współpracuje z węzłami [Send Email](../nodes/send-email-node.md), [LLM](../nodes/llm-node.md) oraz [Slack](../nodes/slack-node.md) w procesach segregacji wiadomości przychodzących i generowania odpowiedzi.

#### [Heym Trigger](../nodes/heym-trigger-node.md)

Węzeł Heym Trigger uruchamia workflow, gdy sam Heym publikuje zdarzenie platformowe: `heym.started`, `workflow.created`, `workflow.updated` lub `workflow.deleted`. Dostarczanie odbywa się wsadowo — każde zdarzenie opublikowane w ramach jednego pięciosekundowego okna dyspozycji trafia do pojedynczego uruchomienia jako `$nodeLabel.events`, zawsze w formie tablicy. Każde zdarzenie jest przechwytywane przez unikalne ograniczenie bazy danych, dzięki czemu jest wyzwalane dokładnie raz na subskrybujący węzeł, niezależnie od liczby działających workerów, kontenerów czy maszyn. Znajduje zastosowanie w ścieżkach audytu zmian workflow, ogłoszeniach o wdrożeniach oraz podsumowaniach stanu instancji.

Współpracuje z węzłem [Heym](../nodes/heym-node.md) w celu wyszukania zmienionego workflow oraz z węzłem [Loop](../nodes/loop-node.md) w celu wykonania akcji raz na zdarzenie.

#### [Heym](../nodes/heym-node.md)

Węzeł Heym odczytuje własne dane Heym poprzez trzy operacje: `listWorkflows` zwraca każdy workflow dostępny dla właściciela wraz z liczbą węzłów i znacznikami czasu, `getWorkflow` zwraca strukturę węzłów i krawędzi jednego workflow, a `getExecutionHistory` zwraca wpisy historii wykonań od najnowszych, z opcjonalnymi filtrami statusu, okna czasowego i limitu, wraz z sumami pogrupowanymi według statusu. Wyniki są ograniczone do właściciela workflow, w którym znajduje się węzeł, więc uruchomienie zainicjowane przez cron, portal lub zdarzenie zwraca te same dane co uruchomienie ręczne. `getWorkflow` zwraca pełną konfigurację węzłów, co umożliwia audyt workflow pod kątem zakodowanych na stałe kluczy lub tokenów; nie ujawnia niczego, czego właściciel workflow nie mógłby już otworzyć w edytorze. Nie jest wymagane żadne dane logowania.

#### [WebSocket Trigger](../nodes/websocket-trigger-node.md)

Węzeł WebSocket Trigger otwiera wychodzące połączenie klienckie do zewnętrznego serwera WebSocket i uruchamia workflow w zdarzeniach `onMessage`, `onConnected` lub `onClosed`. Udostępnia przetworzone payloady wiadomości, stan ponownego połączenia, metadane zamknięcia oraz adres URL gniazda dla wyrażeń downstream.

Współpracuje z węzłami [WebSocket Send](../nodes/websocket-send-node.md), [HTTP](../nodes/http-node.md) oraz [SSE Streaming](./sse-streaming.md) w integracjach czasu rzeczywistego.

#### [Telegram Trigger](../nodes/telegram-trigger-node.md)

Węzeł Telegram Trigger odbiera aktualizacje webhooków bota i natychmiast uruchamia workflow. Udostępnia pełny payload aktualizacji, główny obiekt wiadomości, zapytania callback, oczyszczone nagłówki oraz znacznik czasu triggera. Znajduje zastosowanie w chatbotach, asystentach AI w [Telegram](../nodes/telegram-node.md) oraz procesach sterowanych przyciskami.

Współpracuje z węzłami [Telegram](../nodes/telegram-node.md), [Agent Node](../nodes/agent-node.md) oraz [Webhooks](./webhooks.md) w workflow sterowanych przez boty.

#### [Slack Trigger](../nodes/slack-trigger-node.md)

Węzeł Slack Trigger odbiera webhooki Slack Events API i automatycznie uruchamia workflow po zweryfikowaniu podpisu żądania. Udostępnia payload zdarzenia oraz oczyszczone nagłówki na potrzeby routingu downstream, klasyfikacji opartej na [LLM](../nodes/llm-node.md) oraz procesów odpowiedzi.

Współpracuje z węzłami [Slack](../nodes/slack-node.md), [Agent Node](../nodes/agent-node.md) oraz [Third-Party Integrations](./integrations.md).

#### [Discord Trigger](../nodes/discord-trigger-node.md)

Węzeł Discord Trigger odbiera webhooki Discord Interactions API, weryfikuje podpisy Ed25519 przy użyciu wybranych danych logowania `discord_trigger` i uruchamia workflow. Udostępnia pełny payload interakcji, dane polecenia, oczyszczone nagłówki oraz metadane triggera na potrzeby routingu downstream lub odpowiedzi.

Współpracuje z węzłami [Output](../nodes/output-node.md), [Discord](../nodes/discord-node.md), [Agent Node](../nodes/agent-node.md) oraz [Third-Party Integrations](./integrations.md).
#### [RabbitMQ](../nodes/rabbitmq-node.md)

Węzeł RabbitMQ wysyła lub odbiera wiadomości z kolejek i wymian RabbitMQ. Znajduje zastosowanie w workflow sterowanych wiadomościami oraz w przetwarzaniu zdarzeń. Tryb wysyłania publikuje wiadomość z opcjonalnym opóźnieniem; tryb odbierania działa jako [trigger](./triggers.md), dzięki czemu workflow uruchamia się w momencie nadejścia wiadomości. Dane wyjściowe obejmują status, message_id oraz body.

Współpracuje z węzłami [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) oraz [Parallel Execution](./parallel-execution.md) na potrzeby przetwarzania sterowanego zdarzeniami.

#### [Error Handler](../nodes/error-handler-node.md)

Węzeł Error Handler uruchamia się automatycznie, gdy dowolny węzeł w workflow zakończy się niepowodzeniem. Nie wymaga połączeń przychodzących; jest wyzwalany przez silnik. Dane wyjściowe obejmują komunikat błędu, etykietę węzła, który zawiódł, typ węzła oraz znacznik czasu. Służy do wysyłania powiadomień przez [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) lub [Send Email](../nodes/send-email-node.md), rejestrowania błędów bądź zwracania niestandardowych odpowiedzi błędów.

Alternatywą dla obsługi błędów na canvasie jest delegowanie niepowodzeń do odrębnego workflow — zob. [Error Workflow](#error-workflow). Jeśli canvas zawiera już węzeł Error Handler, error workflow **nie** jest wywoływany (lokalny handler ma pierwszeństwo).

Typowymi celami powiadomień są [Slack](../nodes/slack-node.md), [Telegram](../nodes/telegram-node.md) oraz [Send Email](../nodes/send-email-node.md); szczegóły uruchomień wygodniej analizować w [Execution History](./execution-history.md).

### AI

#### [Agent Node](../nodes/agent-node.md)

Węzeł AI Agent to węzeł [LLM](../nodes/llm-node.md) z możliwością wywoływania narzędzi. Potrafi uruchamiać narzędzia Python, wywoływać połączone węzły canvasu jako narzędzia, łączyć się z serwerami [MCP](../tabs/mcp-tab.md), korzystać ze skills (plików instrukcji i opcjonalnych skryptów Python), działać jako orkiestrator delegujący zadania do innych węzłów agenta oraz wywoływać inne workflow jako narzędzia. Dane wyjściowe są dostępne jako `$nodeLabel.text`. Opcjonalny przełącznik **Extra Body** dołącza obiekt JSON z parametrami żądania specyficznymi dla dostawcy do każdego żądania w pętli wywoływania narzędzi; domyślnie jest wyłączony. Opcjonalny przełącznik **Use Responses API** kieruje wywołania modelu agenta przez Responses API, co zachowuje rozumowanie modelu między wywołaniami narzędzi, dzięki czemu model rozumujący utrzymuje łańcuch myśli przez wieloetapową pętlę; domyślnie jest wyłączony i działa z OpenAI oraz niestandardowymi danymi logowania.

Narzędzia węzłów canvasu pozwalają agentowi wywoływać skonfigurowane węzły workflow bezpośrednio z canvasu. Należy połączyć obsługiwany węzeł z uchwytem narzędzi agenta, a następnie oznaczyć wybrane pola jako dostarczane przez agenta za pomocą ikony bota. Pola te stają się parametrami narzędzia w czasie działania, natomiast dane logowania i nieoznaczone pola pozostają ustalone w konfiguracji węzła.

Sekcja Skills obejmuje teraz **AI Build** do tworzenia nowych skills, wbudowaną akcję edycji AI dla istniejących skills, pobieranie poszczególnych skills jako ZIP oraz opcjonalny przełącznik **Enable Drive files** dla skills, które w czasie działania muszą odczytywać pliki Heym Drive. Modal Skill Builder strumieniuje rozmowę na czacie po lewej stronie, przyjmuje pliki metodą przeciągnij i upuść wraz z każdym komentarzem dostrajającym, wyświetla po prawej stronie podgląd tylko do odczytu generowanych plików `SKILL.md` i `.py` na bieżąco, umożliwia pobranie tego podglądu jako ZIP oraz zapisuje przesłane pliki dostrajające z powrotem jako dołączone zasoby skill przez ten sam proces wczytywania ZIP, który jest używany przy ręcznym przesyłaniu.

Po włączeniu **[Agent Persistent Memory](./agent-persistent-memory.md)** każdy węzeł agenta utrzymuje własny graf wiedzy: fakty są wczytywane do system promptu, gdy graf nie jest pusty, a udane uruchomienia wyzwalają w tle scalanie nowych encji i relacji. Sub-agenci korzystają z odrębnych grafów. Graf agenta można **udostępnić** innym agentom (w tym samym lub innym workflow) z dostępem tylko do odczytu albo do odczytu i zapisu z poziomu okna dialogowego grafu. Kontrolka mózgu na canvasie otwiera edytor grafu.

Węzły agenta mogą również przejść w tryb [Human-in-the-Loop](./human-in-the-loop.md). W tym trybie agent otrzymuje narzędzie `request_human_review` i może zatrzymać się na określonych krokach wymagających zatwierdzenia, utworzyć jednorazowy publiczny link do przeglądu, udostępnić gałąź canvasu `review` dla przepływów powiadomień oraz czekać, aż recenzent zaakceptuje, edytuje lub odrzuci tekst przeglądu w formacie Markdown. Pole HITL węzła pełni funkcję wytycznych zatwierdzania określających, kiedy należy zapytać, natomiast podsumowanie widoczne dla recenzenta jest generowane na podstawie każdego żądania przeglądu. W przypadku narzędzi [MCP](../tabs/mcp-tab.md) Heym wykorzystuje model do zinterpretowania tych pisemnych instrukcji jako `always`, `once` lub `never`, dzięki czemu swobodne sformułowania dotyczące zatwierdzania przekładają się na konkretną politykę działania. Uruchomienie zostaje oznaczone jako `pending` i wznawia się z zapisanego snapshotu wykonania po nadejściu decyzji, a to samo uruchomienie agenta może zatrzymać się więcej niż raz, jeśli kolejne kroki również wymagają przeglądu.

Węzły agenta automatycznie kompresują narastającą historię wiadomości, gdy zbliża się ona do 80% okna kontekstowego modelu. System prompt, pierwsza wiadomość użytkownika oraz najnowsza wiadomość użytkownika są zawsze zachowywane; wszystko pomiędzy jest podsumowywane przy użyciu tego samego modelu i danych logowania. Zdarzenia kompresji są widoczne w panelu Debug, [Execution History](./execution-history.md) oraz w zakładce [Traces](../tabs/traces-tab.md).

Zob. także [LLM](../nodes/llm-node.md), [Agent Architecture](./agent-architecture.md), [Agent Persistent Memory](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) oraz [File Generation](./file-generation.md).
#### [Codex](../nodes/codex-node.md)

Węzeł Codex uruchamia OpenAI Codex CLI w izolowanym obszarze roboczym Heym. Przyjmuje dane logowania Codex (zaloguj się przez ChatGPT, aby korzystać z subskrypcji bez kosztów API naliczanych za token, lub wklej access token), dane logowania GitHub, adres URL repozytorium, gałąź bazową, prompt zadania, tryb publikacji (`diff_only` lub `draft_pr`), nazwę gałęzi oraz limit czasu. Runner klonuje repozytorium lokalnie, przekazuje pakiet tokenów ChatGPT lub `CODEX_ACCESS_TOKEN` wyłącznie do procesu Codex i zwraca ustrukturyzowane podsumowanie, uwagi walidacyjne, zmienione pliki, diff, metadane użycia oraz opcjonalny adres URL draft PR.

Gdy Codex zwróci `needs_input`, workflow zostaje wstrzymany i udostępnia gałąź `question`. Należy połączyć tę gałąź z Slack, e-mailem lub innym węzłem powiadomień; publiczny link do kontynuacji wznawia zapisany snapshot wykonania po przesłaniu odpowiedzi. Węzeł Codex można również podłączyć do AI Agent jako narzędzie, co pozwala agentowi delegować zadania programistyczne; jako narzędzie wynik `needs_input` jest zwracany bezpośrednio do agenta zamiast wstrzymywania workflow.

Zobacz także [GitHub](../nodes/github-node.md), [Dane logowania](./credentials.md), [Udostępnianie danych logowania](./credentials-sharing.md) oraz [Typy węzłów](./node-types.md).

#### [OpenCode Go](../nodes/opencode-go-node.md)

Węzeł OpenCode Go uruchamia OpenCode CLI (Go) względem repozytorium GitHub. Izolacja przebiega według wzorca Codex: lokalnie działa jako podproces hosta, natomiast wdrożenia Docker uruchamiają go wewnątrz wzmocnionego kontenera siostrzanego współdzielącego wolumen obszaru roboczego. Przyjmuje dane logowania OpenCode Go (klucz API bramy z opcjonalnym bazowym adresem URL), dane logowania GitHub, adres URL repozytorium, gałąź bazową, prompt zadania, tryb publikacji, nazwę gałęzi, limit czasu oraz model `opencode-go/<model>` wybierany z aktualnej, przeszukiwalnej listy modeli (z wbudowanym fallbackiem). Heym wykonuje wszystkie operacje git/GitHub na hoście i nigdy nie umieszcza tokenu GitHub wewnątrz sandboxa; OpenCode jedynie edytuje pliki na dysku. Węzeł zwraca ustrukturyzowane podsumowanie, uwagi walidacyjne, zmienione pliki, diff oraz opcjonalny adres URL pull request. Można go podłączyć do AI Agent jako narzędzie.

Zobacz także [Codex](../nodes/codex-node.md), [GitHub](../nodes/github-node.md), [Dane logowania](./credentials.md), [Udostępnianie danych logowania](./credentials-sharing.md) oraz [Typy węzłów](./node-types.md).

#### [LLM](../nodes/llm-node.md)

Węzeł LLM przetwarza tekst za pomocą modelu językowego lub generuje obrazy. Obsługuje generowanie tekstu, vision (wejście obrazowe), generowanie obrazów, ustrukturyzowane wyjście JSON, natywne dla dostawcy wykonanie Batch API dla obsługiwanych endpointów OpenAI i zgodnych z OpenAI oraz opcjonalny przełącznik **Use Responses API**, który kieruje wywołanie przez Responses API zamiast Chat Completions (domyślnie wyłączony; działa z OpenAI i niestandardowymi danymi logowania, nie można go łączyć z trybem Batch). Należy skonfigurować dane logowania, model, komunikaty systemowe i użytkownika, temperaturę oraz maksymalną liczbę tokenów; w promptach stosuje się [Expression DSL](./expression-dsl.md). W trybie batch `userMessage` musi być rozwiązany do tablicy, węzeł emituje gałąź `batchStatus` z aktualizacjami postępu, a końcowe wyjście zawiera wyniki batch dla poszczególnych elementów. Opcjonalny przełącznik **Extra Body** dołącza obiekt JSON z parametrami żądania specyficznymi dla dostawcy (na przykład `{"thinking": {"type": "disabled"}}`) do każdego wywołania API; jest domyślnie wyłączony. Opcjonalne [Guardrails](./guardrails.md) blokują niebezpieczną treść przed wywołaniem.

Naturalnie łączy się z [Qdrant RAG](../nodes/rag-node.md), [Węzłem Agent](../nodes/agent-node.md), [Guardrails](./guardrails.md) oraz [Oknem ewaluacji wyrażeń](./expression-evaluation-dialog.md).

#### [Decision](../nodes/decision-node.md)

Węzeł Decision zadaje modelowi decyzyjnemu pytania sformułowane w określonym typie o stanie wykonania i zwraca prawdopodobieństwa zamiast prozy. Pole **State** przenosi to, co model powinien odczytać — pojedyncze wyrażenie zachowuje własny typ, więc `$input` wysyła obiekt, a nie jego tekst — a lista pytań przenosi osądy. Pytania występują w trzech postaciach: **noul** odpowiada, czy warunek jest spełniony, **choice** wybiera jedną opcję ze zdefiniowanego zestawu i zwraca pełny rozkład, a **score** ocenia stan wzdłuż uporządkowanych poziomów i może znaleźć się pomiędzy nimi. Odpowiedzi choice i score niosą również poziom pewności, dzięki czemu [Switch](../nodes/switch-node.md) może kierować na podstawie odpowiedzi, a [Condition](../nodes/condition-node.md) może warunkować na podstawie tego, jak pewna była odpowiedź. **Generate with AI** tworzy szkic szablonu stanu i wierszy pytań na podstawie zwykłego zdania, a **Custom request body** wysyła ręcznie napisany JSON dla endpointu o odmiennym kontrakcie. Odpowiedź dostawcy jest przekazywana bez zmian, a każde wywołanie jest rejestrowane w [Traces](../tabs/traces-tab.md).

Wymaga danych logowania Decision Model; naturalnie łączy się z [Switch](../nodes/switch-node.md), [Condition](../nodes/condition-node.md) oraz [Węzłem Agent](../nodes/agent-node.md).
#### [RAG / Vector Store](../nodes/rag-node.md)

Węzeł RAG / Vector Store wstawia, aktualizuje (upsert), usuwa i wyszukuje dokumenty w magazynie wektorowym na potrzeby generowania wspomaganego wyszukiwaniem (retrieval-augmented generation). Lista rozwijana Database wybiera backend — **Qdrant** (serwer zewnętrzny) lub **Postgres (pgvector)** (własna baza danych Heym, bez usługi zewnętrznej), domyślnie Qdrant. Należy wybrać magazyn wektorowy z zakładki [Vectorstores](../tabs/vectorstores-tab.md) i ustawić operację na insert, upsert, delete lub search. Operacje upsert i delete adresują dokument za pomocą unikalnego identyfikatora przechowywanego w payloadzie — pole **Document ID Field** wskazuje nazwę tego pola (domyślnie `doc_id`), a **Document ID** przechowuje jego wartość — dzięki czemu dokument zachowuje identyfikator już używany w systemie użytkownika: upsert zastępuje każdy pasujący punkt przed zapisaniem nowej wersji, a delete zwraca informację, czy cokolwiek zostało dopasowane. Metadane dokumentu przyjmują wyrażenia w swoich wartościach, więc `{"url": "$start.url"}` zapisuje to, co wygenerowało wykonanie. Wyszukiwanie obsługuje filtry metadanych, opcjonalne **Hybrid Search** (podobieństwo wektorowe połączone z dopasowywaniem słów kluczowych BM25, dzięki czemu dokładne terminy, takie jak identyfikatory i kody błędów, są znajdowane obok dopasowań semantycznych) oraz opcjonalne ponowne ocenianie Cohere (reranking) i zwraca tablicę wyników z polami text, score, metadata, flagami reranked i hybrid oraz liczbą count do użycia w przepływach [LLM](../nodes/llm-node.md) lub [Agent Node](../nodes/agent-node.md).

Typowe węzły następujące to [LLM](../nodes/llm-node.md) i [Agent Node](../nodes/agent-node.md); konfiguracja magazynu wektorowego znajduje się w zakładce [Vectorstores](../tabs/vectorstores-tab.md).

#### [MCP Call Node](../nodes/mcp-call-node.md)

Węzeł MCP Call wywołuje konkretne narzędzie [MCP](../tabs/mcp-tab.md) bezpośrednio, bez udziału LLM decydującego, które narzędzie uruchomić. Należy go użyć, gdy dokładnie wiadomo, które narzędzie ma zostać uruchomione na etapie projektowania — do deterministycznego, jednoetapowego wykonywania narzędzi MCP w workflow. Należy skonfigurować połączenie (SSE, Streamable HTTP lub stdio; te same pola co połączenie MCP w [Agent Node](../nodes/agent-node.md)), kliknąć **Fetch Tools**, aby wypełnić listę rozwijaną, wybrać narzędzie i uzupełnić pola argumentów, które są automatycznie renderowane na podstawie schematu wejściowego narzędzia. Każdy argument przyjmuje wartość statyczną lub [wyrażenie DSL](./expression-dsl.md), takie jak `$userInput.body.text`. Wynik jest dostępny jako `$nodeLabel.result` (obiekt JSON, jeśli można go sparsować, w przeciwnym razie ciąg znaków). Węzła MCP Call nie można podłączyć do [Agent Node](../nodes/agent-node.md) jako narzędzia na canvasie.

Zobacz także [Agent Node](../nodes/agent-node.md), [MCP](../tabs/mcp-tab.md) oraz [Expression DSL](./expression-dsl.md).

### Logic

#### [Condition](../nodes/condition-node.md)

Węzeł Condition rozgałęzia workflow na podstawie wyrażenia if/else. Ma dwa uchwyty wyjściowe: jeden dla przypadku, gdy warunek jest prawdziwy (truthy), i jeden dla fałszywego (falsy). W wyrażeniu warunku należy użyć operatorów porównania i logicznych z [Expression DSL](./expression-dsl.md); węzeł przekazuje dane wejściowe do wybranej gałęzi.

Zobacz także [Switch](../nodes/switch-node.md), [Throw Error](../nodes/throw-error-node.md) oraz [Expression DSL](./expression-dsl.md).

#### [Switch](../nodes/switch-node.md)

Węzeł Switch kieruje wykonanie do różnych ścieżek, dopasowując wartość do przypadków (cases). Należy skonfigurować wyrażenie do ewaluacji oraz listę wartości przypadków; każdy przypadek otrzymuje uchwyt źródłowy, a uchwyt domyślny jest używany dla wartości niedopasowanych. Dane wejściowe są przekazywane do dopasowanej gałęzi.

Do rozgałęziania binarnego należy użyć [Condition](../nodes/condition-node.md), a do ponownego łączenia rozgałęzionych ścieżek — [Merge](../nodes/merge-node.md); reguły dopasowania opisano w [Expression DSL](./expression-dsl.md).

#### [Merge](../nodes/merge-node.md)

Węzeł Merge czeka na wiele równoległych danych wejściowych i łączy je w jedno wyjście. Należy ustawić liczbę danych wejściowych, na które ma czekać; węzeł tworzy scalony obiekt, gdy wszystkie gałęzie zostaną ukończone. Służy do łączenia wyników z równoległych gałęzi przed kontynuacją; nie należy go używać, gdy równoległe gałęzie kończą się w osobnych węzłach Output.

Zobacz także [Parallel Execution](./parallel-execution.md), [Loop](../nodes/loop-node.md) oraz [Output](../nodes/output-node.md) w kontekście ponownego łączenia gałęzi.

#### [Loop](../nodes/loop-node.md)

Węzeł Loop iteruje po tablicy, wykonując węzły następujące dla każdego elementu. Wymaga połączenia zwrotnego (back-connection) od ostatniego węzła w ciele iteracji, aby przejść do kolejnego elementu. W ciele pętli należy używać `item`, `index`, `total`, `isFirst` oraz `isLast`; pętla ma osobne wyjścia dla ścieżki iteracji i ścieżki zakończenia (done).

Współpracuje z [Variable](../nodes/variable-node.md), [Merge](../nodes/merge-node.md) oraz [Expression DSL](./expression-dsl.md) w iteracyjnych workflow.

### Data

#### [Set](../nodes/set-node.md)

Węzeł Set przekształca i mapuje dane wejściowe na niestandardowe wyjście. Należy zdefiniować mapowania klucz-wartość, gdzie każda wartość jest wyrażeniem [Expression DSL](./expression-dsl.md). Służy do zmiany wielkości liter, wyodrębniania podciągów, konkatenacji, generowania liczb losowych i podobnych przekształceń. Dostęp do wyjścia odbywa się przez klucz (np. `$setNode.keyName`). Gdy węzeł jest podłączony do agenta jako narzędzie na canvasie, wartości mapowania można oznaczyć jako dostarczane przez agenta, aby agent wypełniał je w czasie wykonania. Do wywoływania innych workflow należy użyć węzła [Execute](../nodes/execute-node.md).

Zobacz także [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) oraz [Expression DSL](./expression-dsl.md).
#### [Converter](../nodes/converter-node.md)

Węzeł Converter konwertuje dane między formatami bez konieczności pisania kodu. Konwersje tekstowe to `csvToJson` (tekst CSV na tablicę obiektów wierszy lub tablic, gdy brak nagłówka), `jsonToCsv` (tablica obiektów/wierszy na tekst CSV), `xmlToJson` (tekst XML na obiekt) oraz `jsonToXml` (obiekt na tekst XML). Należy skonfigurować kierunek konwersji i wyrażenie źródłowe; konwersje CSV dodatkowo wykorzystują delimiter i obsługę nagłówków, a `jsonToCsv` może wymusić jawną kolejność kolumn. Cytowanie, osadzone delimitery i osadzone znaki nowej linii są zgodne z RFC 4180. Atrybuty XML używają prefiksów `@`, tekst zmieszany z atrybutami używa `#text`, powtarzające się elementy stają się tablicami, a rozwijanie encji XML jest wyłączone. Ten sam węzeł działa również na przechowywanych plikach. `imageToText` i `pdfToText` uruchamiają Tesseract OCR, odczytując plik z Heym Drive (`$Upload.file.id` z triggera File upload, wyniku węzła Drive lub pliku wygenerowanego przez agenta), automatycznie wybierając język na podstawie wykrytego pisma lub używając kodów takich jak `tur` czy `eng+tur`, i domyślnie normalizując tekst do UTF-8 z opcjonalną normalizacją NFC oraz węższymi zestawami znaków, takimi jak `cp1254`. `fileConvert` zapisuje przechowywany plik w innym formacie — dokumenty przez pandoc, a obrazy przez Pillow — i zapisuje wynik jako nowy plik Drive, nie modyfikując oryginału. Wynik jest dostępny jako `$converterNode.result`, wraz z `.language`, `.encoding`, `.page_count`, `.pages` i `.file` dla uruchomień OCR oraz `.id`, `.filename` i `.download_url` dla `fileConvert`.

Zobacz także [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md) i [Expression DSL](./expression-dsl.md).

#### [Code](../nodes/code-node.md)

Węzeł Code uruchamia napisany przez użytkownika kod Python, z własnym `requirements.txt`, w kontenerze tworzonym i niszczonym przy każdym wykonaniu. Kod definiuje funkcję `main(params)` i zwraca dowolną wartość serializowalną do JSON, która staje się `$codeNode.result`; wszystko, co zostanie wypisane, jest przechwytywane osobno jako `$codeNode.logs`, a `$codeNode.install` informuje, które narzędzie zainstalowało zależności. Parametry są konfigurowane jako obiekt JSON, którego wyrażenia `$` są rozwiązywane przed uruchomieniem, a kod odczytuje je za pomocą notacji kropkowej, takiej jak `params.user.name` lub `params.orders[0].id`. Zależności są instalowane za pomocą `uv`, z fallbackiem do `pip` dla pakietów, których `uv` nie obsługuje, bez buforowania między uruchomieniami; pozostawienie pustego `requirements.txt` całkowicie pomija instalację i jest znacznie szybsze. Faza wykonania nie ma dostępu do sieci, chyba że włączono `codeAllowNetwork`, natomiast instalacja zależności zawsze łączy się z PyPI. Sandbox działa jako użytkownik niebędący rootem, z odebranymi wszystkimi uprawnieniami, systemem plików tylko do odczytu, bez gniazda Docker i bez dostępu do sekretów backendu, z limitem 512 MB pamięci, jednego CPU, 256 procesów, 120 sekund na instalację i 60 sekund na wykonanie. Docker jest wymagany i nie ma trybu fallback: bez osiągalnego daemona węzeł kończy się niepowodzeniem, zamiast uruchamiać kod w procesie backendu.

#### [Variable](../nodes/variable-node.md)

Węzeł Variable ustawia lub aktualizuje zmienną lokalną workflow (`$vars.variableName`) albo trwałą [zmienną globalną](./global-variables.md) (`$global.variableName`). Należy go używać do liczników, akumulowanych list i stanu współdzielonego. Należy skonfigurować nazwę zmiennej, wyrażenie wartości, wymuszenie typu oraz to, czy zapisywać w magazynie globalnym. Zmienne tablicowe obsługują `$array()` i `.add()`.

Współpracuje z [Set](../nodes/set-node.md), [Loop](../nodes/loop-node.md) i [Global Variables](./global-variables.md).

#### [Execute](../nodes/execute-node.md)

Węzeł Execute wywołuje inny workflow (pod-workflow) i przekazuje do niego dane wejściowe. Należy określić docelowy workflow przez ID i przekazać dane wejściowe za pomocą pojedynczego wyrażenia lub mapowań klucz-wartość. Dane wyjściowe obejmują workflow_id, status i outputs; należy go używać do logiki wielokrotnego użytku, a nie do transformacji danych (do tego służy Set).

Zobacz także [Canvas Features](./canvas-features.md) dla Extract to Sub-Workflow, [Workflow Structure](./workflow-structure.md) i [Output](../nodes/output-node.md).

### Integracje

#### [HTTP](../nodes/http-node.md)

Węzeł HTTP wykonuje żądania HTTP przy użyciu konfiguracji w stylu cURL. Może być punktem początkowym workflow (bez krawędzi wejściowej) lub odbierać dane wejściowe z węzłów poprzedzających. Odpowiedź jest dostępna jako status, headers i body (sparsowany JSON, gdy ma to zastosowanie). Należy użyć [Credentials](./credentials.md) do uwierzytelniania Bearer lub niestandardowego nagłówka.

Współpracuje z [Webhooks](./webhooks.md), [Credentials](./credentials.md) i [Third-Party Integrations](./integrations.md).

#### [WebSocket Send](../nodes/websocket-send-node.md)

Węzeł WebSocket Send otwiera wychodzące połączenie klienta, wysyła jedną wiadomość tekstową/JSON/binarną i zamyka je. Należy go użyć do publikowania danych wyjściowych workflow w systemach czasu rzeczywistego bez tworzenia endpointu gniazda hostowanego przez Heym.

Zobacz także [WebSocket Trigger](../nodes/websocket-trigger-node.md), [SSE Streaming](./sse-streaming.md) i [Third-Party Integrations](./integrations.md).
#### [Telegram](../nodes/telegram-node.md)

Węzeł Telegram wysyła wiadomość bota do czatu, grupy lub kanału. Należy skonfigurować [dane logowania](./credentials.md) Telegram, ustawić `chatId` oraz złożyć wychodzącą `message` przy użyciu wyrażeń [Expression DSL](./expression-dsl.md). Węzeł ten naturalnie łączy się z [Telegram Trigger](../nodes/telegram-trigger-node.md) w workflow konwersacyjnych oraz z [Error Handler](../nodes/error-handler-node.md) na potrzeby alertów dla operatorów.

Zobacz również [Third-Party Integrations](./integrations.md) oraz [Credentials](./credentials.md) w celu zapoznania się z konfiguracją i wzorcami danych logowania.

#### [Slack](../nodes/slack-node.md)

Węzeł Slack wysyła wiadomość do kanału Slack poprzez Incoming Webhook. Należy skonfigurować [dane logowania](./credentials.md) Slack oraz wyrażenie wiadomości. Węzeł znajduje zastosowanie w powiadomieniach, alertach i raportowaniu błędów; dane wyjściowe przechodzą przez wejście.

Współpracuje z [Slack Trigger](../nodes/slack-trigger-node.md), [Error Handler](../nodes/error-handler-node.md) oraz [Third-Party Integrations](./integrations.md).

#### [Discord](../nodes/discord-node.md)

Węzeł Discord wysyła wiadomość do kanału Discord poprzez Incoming Webhook. Należy skonfigurować [dane logowania](./credentials.md) Discord, złożyć wychodzącą wiadomość przy użyciu [Expression DSL](./expression-dsl.md) oraz opcjonalnie ustawić nadpisania nazwy użytkownika lub awatara webhook.

Współpracuje z [Discord Trigger](../nodes/discord-trigger-node.md), [Output](../nodes/output-node.md), [Error Handler](../nodes/error-handler-node.md) oraz [Third-Party Integrations](./integrations.md).

#### [Send Email](../nodes/send-email-node.md)

Węzeł Send Email wysyła wiadomości e-mail poprzez SMTP. Należy skonfigurować [dane logowania](./credentials.md) SMTP oraz wyrażenia [Expression DSL](./expression-dsl.md) dla odbiorcy(-ów), tematu i treści. Węzeł znajduje zastosowanie w powiadomieniach, alertach i wiadomościach transakcyjnych. Dane wyjściowe obejmują status, to oraz subject.

[IMAP Trigger](../nodes/imap-trigger-node.md) uzupełnia Send Email, obsługując pocztę przychodzącą. Razem pozwalają workflow odczytywać przychodzące wiadomości e-mail ze wspólnej skrzynki odbiorczej, podsumowywać je lub klasyfikować za pomocą węzłów AI oraz wysyłać wiadomość follow-up lub eskalacyjną. [Telegram Trigger](../nodes/telegram-trigger-node.md) oraz [węzeł Telegram](../nodes/telegram-node.md) zapewniają ten sam wzorzec przychodzący/wychodzący dla workflow czatowych opartych na botach.

W przypadku dwukierunkowych przepływów powiadomień węzeł dobrze współpracuje również z [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) oraz [Third-Party Integrations](./integrations.md).

#### [Redis](../nodes/redis-node.md)

Węzeł Redis wykonuje operacje Redis: set, get, hasKey oraz deleteKey. Węzeł znajduje zastosowanie w buforowaniu, ograniczaniu szybkości oraz przechowywaniu klucz-wartość. Należy skonfigurować [dane logowania](./credentials.md), typ operacji, wyrażenie klucza, a dla operacji set — wartość i opcjonalny TTL. Dane wyjściowe różnią się w zależności od operacji (value, success, exists, deleted).

Współpracuje z [Wait](../nodes/wait-node.md), [Variable](../nodes/variable-node.md) oraz [Parallel Execution](./parallel-execution.md) w zakresie buforowania, ograniczania i koordynacji.

#### [Grist](../nodes/grist-node.md)

Węzeł Grist odczytuje, zapisuje i zarządza danymi w arkuszach kalkulacyjnych Grist. Operacje obejmują getRecord, getRecords, createRecord, updateRecord, deleteRecord, listTables oraz listColumns. Należy podać identyfikator dokumentu, identyfikator tabeli, a dla operacji create/update — dane rekordu przy użyciu identyfikatorów kolumn. Węzeł znajduje zastosowanie w operacjach CRUD, aktualizacjach wsadowych oraz automatyzacji arkuszy kalkulacyjnych.

Zobacz również [Google Sheets](../nodes/google-sheets-node.md), [DataTable](../nodes/datatable-node.md) oraz [Third-Party Integrations](./integrations.md).

#### [Google Sheets](../nodes/google-sheets-node.md)

Węzeł Google Sheets odczytuje, zapisuje i zarządza danymi arkuszy kalkulacyjnych poprzez OAuth2. Węzeł znajduje zastosowanie w odczytywaniu raportów, dołączaniu wyników workflow, aktualizowaniu trackerów oraz czyszczeniu lub inspekcji zakładek arkusza z poziomu workflow. Podobnie jak [BigQuery](../nodes/bigquery-node.md), wykorzystuje dane logowania integracji opartej na Google i dobrze komponuje się obok [Grist](../nodes/grist-node.md), gdy dane arkusza kalkulacyjnego stanowią część przepływu.

Współpracuje z [Grist](../nodes/grist-node.md), [DataTable](../nodes/datatable-node.md) oraz [Third-Party Integrations](./integrations.md).

#### [BigQuery](../nodes/bigquery-node.md)

Węzeł BigQuery wykonuje zapytania SQL i wstawia wiersze do zbiorów danych Google BigQuery poprzez OAuth2. Węzeł jest przydatny w workflow analitycznych, potokach raportowania oraz zapisywaniu ustrukturyzowanych danych zdarzeń z uruchomień workflow. Często współpracuje z [Set](../nodes/set-node.md) w zakresie kształtowania wierszy oraz z [Google Sheets](../nodes/google-sheets-node.md) w przypadku lżejszego raportowania zorientowanego na arkusze kalkulacyjne.

Współpracuje z [Set](../nodes/set-node.md), [LLM](../nodes/llm-node.md), [Google Sheets](../nodes/google-sheets-node.md) oraz [Third-Party Integrations](./integrations.md).
#### [Google Drive](../nodes/google-drive-node.md)

Węzeł Google Drive umożliwia wyświetlanie listy, pobieranie, aktualizowanie i usuwanie plików oraz folderów Drive przez OAuth2, a także kopiowanie pliku Drive bezpośrednio do [Heym Drive](../nodes/drive-node.md) za pomocą operacji `syncToHeymDrive`. Dokumenty Google Docs, Sheets i Slides nie mają bajtów do pobrania, dlatego węzeł eksportuje je automatycznie — Docs do PDF, Sheets do XLSX, Slides do PPTX — z możliwością nadpisania formatu docelowego. Usunięcia przenoszą elementy do kosza Drive, chyba że włączono opcję „Delete permanently", a węzeł odmawia usunięcia folderu przez operację na pliku lub odwrotnie. Podobnie jak [Google Sheets](../nodes/google-sheets-node.md), korzysta z danych logowania OAuth2 opartych na Google; należy pamiętać, że te dane logowania żądają pełnego dostępu do Drive, dlatego przed ich udostępnieniem warto zapoznać się z sekcją [Udostępnianie danych logowania](./credentials-sharing.md).

Współpracuje z [Loop](../nodes/loop-node.md), [Drive](../nodes/drive-node.md), [LLM](../nodes/llm-node.md) oraz [Integracjami zewnętrznymi](./integrations.md).

#### [GitHub](../nodes/github-node.md)

Węzeł GitHub udostępnia 40 natywnych akcji GitHub REST obejmujących repozytoria, organizacje i użytkowników, zgłoszenia, pull requesty, recenzje, wydania, workflow Actions, statystyki ruchu oraz pliki repozytoriów. Znajduje zastosowanie w triażu zgłoszeń, automatyzacji recenzji, wyzwalaniu workflow i oczekiwaniu na ich zakończenie, automatyzacji wydań oraz aktualizacji plików repozytorium bez ręcznego budowania żądań HTTP. Obsługuje GitHub.com oraz opcjonalny `base_url` GitHub Enterprise w danych logowania.

Współpracuje z [Węzłem Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Set](../nodes/set-node.md) oraz [Integracjami zewnętrznymi](./integrations.md).

#### [Jira](../nodes/jira-node.md)

Węzeł Jira łączy workflow z API REST Jira Cloud lub Jira Data Center / Server w zakresie automatyzacji projektów, zgłoszeń, komentarzy, załączników, użytkowników, powiadomień i przejść. Umożliwia wyświetlanie listy projektów, wyszukiwanie zgłoszeń za pomocą JQL, tworzenie i aktualizowanie zgłoszeń, przeglądanie changelogów, powiadamianie interesariuszy, zarządzanie komentarzami i załącznikami, pobieranie i zarządzanie użytkownikami, wyświetlanie dostępnych przejść oraz przenoszenie zgłoszeń przez identyfikator przejścia. Należy użyć danych logowania Jira z adresem e-mail Atlassian, tokenem API, bazowym adresem URL witryny oraz trybem wdrożenia.

Współpracuje z [LLM](../nodes/llm-node.md), [Węzłem Agent](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) oraz [Integracjami zewnętrznymi](./integrations.md) w zakresie przyjmowania zgłoszeń wsparcia, triażu błędów i workflow wydań.

#### [Linear](../nodes/linear-node.md)

Węzeł Linear łączy workflow z API GraphQL Linear w zakresie automatyzacji obszarów roboczych i zgłoszeń. Umożliwia wyświetlanie listy zespołów, projektów, zgłoszeń, stanów workflow, członków zespołu i komentarzy; tworzenie, aktualizowanie, usuwanie i łączenie zgłoszeń; oraz tworzenie, aktualizowanie, rozwiązywanie, przywracanie i usuwanie komentarzy. Należy użyć osobistego klucza API Linear lub danych logowania OAuth2, a następnie odczytać identyfikatory UUID zespołów, projektów, stanów i osób przypisanych z operacji listowania przed tworzeniem lub aktualizowaniem zgłoszeń.

Współpracuje z [LLM](../nodes/llm-node.md), [Węzłem Agent](../nodes/agent-node.md), [Slack](../nodes/slack-node.md) oraz [Integracjami zewnętrznymi](./integrations.md) w zakresie przyjmowania zgłoszeń, triażu i workflow backlogu inżynieryjnego.

#### [Supabase](../nodes/supabase-node.md)

Węzeł Supabase odczytuje i modyfikuje tabele udostępniane przez Supabase PostgREST. Sprawdza się w backendach produktowych, danych użytkowników i profili, stanie workflow oraz automatyzacjach typu CRUD, które wymagają dostępu do bazy danych bez ręcznego konfigurowania żądań HTTP.

Współpracuje z [Set](../nodes/set-node.md), [DataTable](../nodes/datatable-node.md), [HTTP](../nodes/http-node.md) oraz [Integracjami zewnętrznymi](./integrations.md).

#### [ClickHouse](../nodes/clickhouse-node.md)

Węzeł ClickHouse wykonuje operacje CRUD, zliczanie oraz surowe zapytania SQL na zewnętrznej bazie danych ClickHouse przez jej interfejs HTTP. Nadaje się do pipeline'ów analitycznych, rejestrowania zdarzeń i workflow raportowania: wstawianie zdarzeń na bieżąco, a następnie agregowanie lub zliczanie ich za pomocą `query`/`count`. Odzwierciedla zestaw operacji [DataTable](../nodes/datatable-node.md) (find, getAll, count, getById, insert, update, remove, upsert) oraz dodatkowo surowe SQL, przy czym `update`/`remove` działają jako mutacje ClickHouse.

Współpracuje z [Set](../nodes/set-node.md), [Cron](../nodes/cron-node.md) w zakresie raportów harmonogramowanych oraz [Integracjami zewnętrznymi](./integrations.md).

#### [Notion](../nodes/notion-node.md)

Węzeł Notion zarządza bazami danych, źródłami danych, stronami i blokami Notion przez bieżące API Notion (`2026-03-11`). Obsługuje wyszukiwanie, operacje CRUD na stronach, operacje na bazach danych i źródłach danych, bloki podrzędne, dodawanie, aktualizowanie i usuwanie bloków oraz przenoszenie do kosza i przywracanie. Należy użyć tokenu integracji wewnętrznej lub danych logowania OAuth2 publicznej integracji Notion. Edytor umożliwia wyszukiwanie i stronicowanie kursorem dostępnych źródeł danych oraz stron nadrzędnych. Udostępnione dane logowania działają tak samo jak dane logowania będące własnością użytkownika podczas wykonywania workflow.

W przypadku niestandardowych wywołań REST, `$credentials.YourNotionCredential` wskazuje ten sam token bearer. Współpracuje z [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [LLM](../nodes/llm-node.md) oraz [Integracjami zewnętrznymi](./integrations.md).
#### [Sentry](../nodes/sentry-node.md)

Węzeł Sentry automatyzuje organizacje, projekty, zespoły, zgłoszenia, zdarzenia i wydania Sentry poprzez Sentry REST API. Służy do triażu alertów, aktualizacji statusów zgłoszeń, automatyzacji wydań, wyszukiwania zdarzeń oraz konfiguracji i porządkowania projektów i zespołów. Obsługuje Sentry SaaS oraz self-hosted Sentry poprzez opcjonalny base URL w danych logowania.

Współpracuje z [Error Handler](../nodes/error-handler-node.md), [Slack](../nodes/slack-node.md), [Linear](../nodes/linear-node.md) oraz [Third-Party Integrations](./integrations.md) w workflow incydentów i wydań.

#### [DataTable](../nodes/datatable-node.md)

Węzeł DataTable odczytuje, zapisuje i zarządza danymi w Heym DataTables (własny magazyn strukturalny). Operacje obejmują find, getAll, getById, insert, update, remove oraz upsert. Nie wymaga zewnętrznych danych logowania. Tabele są zarządzane z zakładki dashboardu [DataTable](../tabs/datatable-tab.md) i dostępne bezpośrednio dla właściciela workflow.

Współpracuje z [Set](../nodes/set-node.md), [Variable](../nodes/variable-node.md) oraz [zakładką DataTable](../tabs/datatable-tab.md) jako własny magazyn strukturalny.

#### [Drive](../nodes/drive-node.md)

Węzeł Drive zarządza plikami generowanymi przez skille bezpośrednio z poziomu workflow. Operacje obejmują delete, setPassword, setTtl, setMaxDownloads, shareWithMyTeams oraz unshareWithMyTeams do zarządzania dostępem zespołu w trybie tylko do odczytu; konwersja formatów znajduje się w węźle [Converter](../nodes/converter-node.md). Plik należy wskazać poprzez `$agentLabel._generated_files[0].id`; dane wyjściowe obejmują status, file_id, zaktualizowany download_url dla ograniczeń linku oraz shared_team_count dla udostępniania zespołowi. Jest to szczególnie przydatne w workflow z [Agent Node](../nodes/agent-node.md), które korzystają z [File Generation](./file-generation.md) i modelu referencyjnego [Drive](./drive.md).

Typowi towarzysze to [Agent Node](../nodes/agent-node.md), [File Generation](./file-generation.md) oraz [Drive](./drive.md).

#### [Amazon S3](../nodes/amazon-s3-node.md)

Węzeł Amazon S3 wykonuje operacje na magazynie obiektów Amazon S3 przy użyciu danych logowania `s3` (access key, secret key, region, opcjonalny session token). Operacje obejmują putObject, getObject, deleteObject, listObjects, copyObject, createBucket, deleteBucket, createFolder, deleteFolder, getAllFolder oraz listBuckets. Obsługiwane jest przesyłanie tekstu oraz pobieranie tekstu lub base64, a pola bucket i key akceptują [Expression DSL](./expression-dsl.md). Służy do przechowywania wyników workflow, archiwizowania plików i odczytywania obiektów z powrotem do przepływu.

Współpracuje z [Set](../nodes/set-node.md), [HTTP](../nodes/http-node.md), [Credentials](./credentials.md) oraz [Third-Party Integrations](./integrations.md).

### Automatyzacja

#### [Crawler](../nodes/crawler-node.md)

Węzeł Crawler scrapuje strony internetowe przy użyciu FlareSolverr z opcjonalną ekstrakcją HTML poprzez selektory CSS. Należy skonfigurować [dane logowania](./credentials.md) FlareSolverr, wyrażenie URL, czas oczekiwania oraz opcjonalne selektory do ekstrakcji. Dane wyjściowe to surowy HTML lub wyekstrahowana zawartość. Służy do web scrapingu i ekstrakcji treści.

Współpracuje z [HTTP](../nodes/http-node.md), [Playwright](../nodes/playwright-node.md) oraz [LLM](../nodes/llm-node.md) w przepływach scrape-and-analyze.

#### [Playwright](../nodes/playwright-node.md)

Węzeł Playwright automatyzuje interakcje z przeglądarką przy użyciu konfigurowalnych kroków (navigate, refresh, click, type, screenshot, extract, aiStep) lub trybu **Run Code** dla własnego kodu Playwright Python (sandbox; domyślnie wyłączony poprzez `HEYM_PLAYWRIGHT_CUSTOM_CODE_ENABLED`). Obsługuje tryb headless, opcjonalne ustawienie redukujące typowe sygnały automatyzacji Playwright, limity czasu, opcjonalne przechwytywanie ruchu sieciowego (responses, cookies, localStorage, sessionStorage), bootstrap uwierzytelniania cookie/storageState z wyrażeń [Global Variables](./global-variables.md), takich jak `$global.authState`, kroki logowania awaryjnego w przypadku niepowodzenia przywracania uwierzytelniania oraz krok AI z Auto Heal, gdy selektory zawiodą. Służy do web scrapingu, wypełniania formularzy i workflow opartych na przeglądarce.

Zobacz także [Crawler](../nodes/crawler-node.md), [HTTP](../nodes/http-node.md) oraz [Execution History](./execution-history.md) w zakresie automatyzacji przeglądarki i debugowania.

### Narzędzia

#### [Output](../nodes/output-node.md)

Węzeł Output jest punktem końcowym workflow, który zwraca odpowiedź do wywołującego. Należy ustawić wyrażenie wiadomości, odwołując się do poprzedniego węzła po etykiecie (nigdy nie używać `$input` z węzła [Input](../nodes/input-node.md) w tym miejscu). Opcjonalny asynchroniczny downstream pozwala węzłom po output działać w tle po wysłaniu odpowiedzi.

Typowe źródła upstream to [Input](../nodes/input-node.md), [LLM](../nodes/llm-node.md) oraz [Execute](../nodes/execute-node.md); kształtowanie odpowiedzi łatwiej debugować w [Expression Evaluation Dialog](./expression-evaluation-dialog.md).

#### [JSON output mapper](../nodes/json-output-mapper-node.md)

Węzeł JSON output mapper buduje zwykły obiekt JSON z mapowań klucz-wartość w stylu [Set](../nodes/set-node.md) i zwraca go w katalogu głównym odpowiedzi workflow. Służy do sytuacji, gdy wywołujący API powinien otrzymać surowe ciało JSON zamiast standardowego opakowania węzła [Output](../nodes/output-node.md).
#### [HTML output mapper](../nodes/html-output-mapper-node.md)

Węzeł HTML output mapper renderuje pojedynczy szablon HTML, interpolując wyrażenia `$nodeLabel.field` do strony. Gdy jest jedynym węzłem końcowym workflow, execute webhook odpowiada za pomocą `text/html` i skonfigurowanego w węźle kodu statusu zamiast treści JSON, dzięki czemu workflow może bezpośrednio serwować stronę do przeglądarki. Aby otrzymać zwykłą kopertę JSON na potrzeby debugowania, należy wysłać `X-Simple-Response: false`.

Współpracuje z [Set](../nodes/set-node.md), [Output](../nodes/output-node.md), [Workflow Structure](./workflow-structure.md) oraz [Webhooks](./webhooks.md).

#### [Chart Output](../nodes/chart-output-node.md)

Węzeł Chart Output jest węzłem końcowym workflow widżetu [Dashboard](../tabs/dashboard-tab.md). Przekształca wiersze wygenerowane przez węzły poprzedzające w ustandaryzowany payload wykresu, który renderuje dashboard. Należy wybrać `chartType` (bar, line, area, pie, table, numeric, gauge, scatter, proportion, bar gauge, text lub HITL), zmapować `labelField`/`valueField` (lub `series` dla wielu serii, albo `text` dla wiadomości markdown) i umieścić go na końcu; nie posiada krawędzi wyjściowej. HITL ignoruje wiersze z węzłów poprzedzających i wyświetla oczekujące przeglądy wykonywane przez człowieka. a kolejną jako przyciski linków otwierające adres URL w nowej karcie (`linkColumn`, z `linkLabel` jako tekstem przycisku)

Zobacz także [Dashboard](../tabs/dashboard-tab.md), [Set](../nodes/set-node.md) oraz [Output](../nodes/output-node.md).

#### [Wait](../nodes/wait-node.md)

Węzeł Wait wstrzymuje wykonanie workflow na określony czas w milisekundach, maksymalnie do 15 minut. Stosuje się go do ograniczania szybkości (rate limiting), opóźnionych działań lub interwałów odpytywania. Przepuszcza dane wejściowe bez zmian.

Współpracuje z [Cron](../nodes/cron-node.md), [Redis](../nodes/redis-node.md) oraz [Parallel Execution](./parallel-execution.md) w zakresie tempa i odpytywania.

#### [Sticky Note](../nodes/sticky-note-node.md)

Węzeł Sticky Note dodaje notatki markdown do canvas. Nie jest wykonywany. Służy do dokumentacji, instrukcji lub notatek dotyczących workflow obok innych [Canvas Features](./canvas-features.md). Aby edytować treść notatki, należy kliknąć dwukrotnie na canvas.

Zobacz także [Canvas Features](./canvas-features.md), [Keyboard Shortcuts](./keyboard-shortcuts.md) oraz [Workflow Organization](./workflow-organization.md).

#### [Console Log](../nodes/console-log-node.md)

Węzeł Console Log zapisuje wartość w konsoli backendu (serwera). Służy do debugowania i inspekcji podczas tworzenia. Komunikat logu obsługuje wyrażenia [Expression DSL](./expression-dsl.md); dane wyjściowe przechodzą przez dane wejściowe.

Współpracuje z [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) oraz [Expression Evaluation Dialog](./expression-evaluation-dialog.md) na potrzeby debugowania.

#### [Disable Node](../nodes/disable-node.md)

Węzeł Disable Node trwale wyłącza inny węzeł w workflow, ustawiając jego flagę `active` na false. Docelowy węzeł należy wskazać po etykiecie. Stosuje się go do jednorazowych operacji, takich jak zatrzymanie triggera [Cron](../nodes/cron-node.md) po spełnieniu warunku.

Zobacz także [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md) oraz [Cron](../nodes/cron-node.md) w zakresie wzorców sterowania workflow.

#### [Enable Node](../nodes/enable-node.md)

Węzeł Enable Node ponownie włącza inny węzeł, ustawiając jego flagę `active` na true i zapisując zmianę. Docelowy węzeł należy wskazać po etykiecie. Służy do ponownego uzbrojenia wyłączonego triggera [Cron](../nodes/cron-node.md) z innego punktu wejścia lub do włączenia węzła po spełnieniu warunku. Cel znajdujący się poniżej węzła Enable Node, który jeszcze nie został uruchomiony, również zostanie uruchomiony w bieżącym wykonaniu.

Zobacz także [Disable Node](../nodes/disable-node.md), [Canvas Features](./canvas-features.md) oraz [Cron](../nodes/cron-node.md) w zakresie wzorców sterowania workflow.

#### [Throw Error](../nodes/throw-error-node.md)

Węzeł Throw Error natychmiast zatrzymuje wykonanie workflow i zwraca odpowiedź błędu z niestandardowym kodem statusu HTTP. Należy ustawić wyrażenie komunikatu błędu oraz kod statusu (np. 400, 401, 403, 404, 429, 500). Stosuje się go do błędów walidacji, nieautoryzowanego dostępu lub innych warunków błędu, szczególnie w połączeniu z [Condition](../nodes/condition-node.md) oraz [Error Handler](../nodes/error-handler-node.md).

Współpracuje z [Condition](../nodes/condition-node.md), [Error Handler](../nodes/error-handler-node.md) oraz [Security](./security.md) w zakresie jawnych ścieżek błędów.

---

## Reference
### [Typy węzłów](./node-types.md)

Heym udostępnia różnorodne typy węzłów: triggery, takie jak [Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), [RabbitMQ](../nodes/rabbitmq-node.md) oraz [Error Handler](../nodes/error-handler-node.md); węzły AI, takie jak [LLM](../nodes/llm-node.md), [Decision](../nodes/decision-node.md), [Agent Node](../nodes/agent-node.md), [Codex](../nodes/codex-node.md), [OpenCode Go](../nodes/opencode-go-node.md), [Qdrant RAG](../nodes/rag-node.md) oraz [MCP Call](../nodes/mcp-call-node.md); węzły logiki, takie jak [Condition](../nodes/condition-node.md), [Switch](../nodes/switch-node.md), [Merge](../nodes/merge-node.md) oraz [Loop](../nodes/loop-node.md); węzły danych, takie jak [Set](../nodes/set-node.md), [Converter](../nodes/converter-node.md), [Code](../nodes/code-node.md), [Variable](../nodes/variable-node.md), [Execute](../nodes/execute-node.md) oraz [Heym](../nodes/heym-node.md); integracje, takie jak [HTTP](../nodes/http-node.md), [GitHub](../nodes/github-node.md), [Jira](../nodes/jira-node.md), [Linear](../nodes/linear-node.md), [Notion](../nodes/notion-node.md), [Sentry](../nodes/sentry-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), [Discord](../nodes/discord-node.md), [Send Email](../nodes/send-email-node.md), [Redis](../nodes/redis-node.md), [Grist](../nodes/grist-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Drive](../nodes/google-drive-node.md), [BigQuery](../nodes/bigquery-node.md), [Supabase](../nodes/supabase-node.md), [ClickHouse](../nodes/clickhouse-node.md), [DataTable](../nodes/datatable-node.md) oraz [Drive](../nodes/drive-node.md); węzły automatyzacji, takie jak [Crawler](../nodes/crawler-node.md) i [Playwright](../nodes/playwright-node.md); a także narzędzia, takie jak [Wait](../nodes/wait-node.md), [Output](../nodes/output-node.md), [JSON output mapper](../nodes/json-output-mapper-node.md), [HTML output mapper](../nodes/html-output-mapper-node.md), [Console Log](../nodes/console-log-node.md), [Throw Error](../nodes/throw-error-node.md), [Disable Node](../nodes/disable-node.md), [Enable Node](../nodes/enable-node.md) oraz [Sticky Note](../nodes/sticky-note-node.md). W konfiguracji węzłów należy używać wyrażeń, takich jak `$input.text` i `$nodeLabel.field`.

Zobacz również [Triggers](./triggers.md), [Third-Party Integrations](./integrations.md) oraz [Parallel Execution](./parallel-execution.md).

### [Expression DSL](./expression-dsl.md)

Heym wykorzystuje prosty język wyrażeń do odwoływania się do danych z węzłów poprzedzających. Należy używać `$input` dla węzła [Input](../nodes/input-node.md), `$nodeLabel.field` dla dowolnego węzła poprzedzającego, `$credentials.CredentialName` dla [danych logowania](./credentials.md) oraz `$global.variableName` dla [zmiennych globalnych](./global-variables.md). Wbudowane zmienne specjalne obejmują `$now`, `$UUID` oraz metadane workflow: `$workflowName`, `$workflowDescription`, `$workflowPath`, `$workflowUrl` i `$executionId` (identyfikator [Historii wykonań](./execution-history.md) danego uruchomienia — `/workflows/{id}/{executionId}` otwiera to uruchomienie na canvasie; dostępny wyłącznie w czasie wykonania, pusty w oknie podglądu wyrażeń). Obsługiwane są literały, operacje arytmetyczne, porównania, kontekst [Loop](../nodes/loop-node.md), zagnieżdżone pola oraz funkcje pomocnicze dla ciągów znaków i tablic (w tym `$text.toJson()` do parsowania ciągu JSON). Gdy pełna wartość jest pojedynczym wyrażeniem `$expr`, backend zachowuje tablice, obiekty, wartości logiczne i liczby jako typy natywne.

Zobacz również [Expression Evaluation Dialog](./expression-evaluation-dialog.md), [Global Variables](./global-variables.md) oraz [Workflow Structure](./workflow-structure.md).

### [Zmienne globalne](./global-variables.md)

Magazyn zmiennych globalnych przechowuje trwałe dane klucz-wartość w zakresie użytkownika, które przetrwają między wykonaniami workflow. Zmienne można tworzyć w zakładce [Variables](../tabs/global-variables-tab.md) lub za pomocą węzła [Variable](../nodes/variable-node.md) z włączoną opcją „Store in Global Variable Store". Dostęp do nich uzyskuje się za pomocą `$global.variableName` w wyrażeniach; można je udostępniać innym użytkownikom lub [zespołom](./teams.md).

Współdziała z [Variable](../nodes/variable-node.md), [Teams](./teams.md) oraz [Credentials Sharing](./credentials-sharing.md) na rzecz współdzielonego stanu workflow.
### [Okno ewaluacji wyrażeń](./expression-evaluation-dialog.md)

Okno ewaluacji wyrażeń to rozszerzalny edytor, który pojawia się po kliknięciu przycisku rozwijania obok pól wyrażeń. Otwiera się jako duże, wyśrodkowane okno modalne, utrzymuje aktywność autouzupełniania i automatycznie odświeża podgląd wyników z backendu po zaprzestaniu pisania. Wyniki obiektów i tablic można przeglądać za pomocą selektora ścieżki wyjściowej. Okno akceptuje pełnowierszową ścieżkę kropkową bez prefiksu (na przykład `myNode.output.field`) tak, jakby była zapisana jako `$myNode.output.field`; zasady umiejscowienia opisano w sekcji [Expression DSL](./expression-dsl.md).

Przycisk **Build with AI** na pasku narzędzi umożliwia opisanie żądanego wyrażenia w języku naturalnym. Należy wybrać [dane logowania](./credentials.md) do LLM oraz model, wpisać opis, na przykład *„Pobierz nazwę klienta z odpowiedzi API"*, i kliknąć Generate. Backend wysyła kontekst [Expression DSL](./expression-dsl.md) oraz wyniki ostatniego uruchomienia węzłów do modelu i zwraca pojedynczy łańcuch wyrażenia. Wynik jest natychmiast ewaluowany, co pozwala go zweryfikować przed kliknięciem Apply.

Współpracuje w naturalny sposób z [Expression DSL](./expression-dsl.md), [Output](../nodes/output-node.md) oraz [JSON output mapper](../nodes/json-output-mapper-node.md).

### [Struktura workflow](./workflow-structure.md)

Workflows są przechowywane jako JSON z węzłami i krawędziami. Obiekt workflow zawiera id, name, description, nodes, edges oraz ustawienia uwierzytelniania. Każdy węzeł ma id, type, position oraz data (label i konfigurację specyficzną dla typu). Krawędzie łączą identyfikatory węzłów źródłowych i docelowych z opcjonalnymi identyfikatorami uchwytów. Składnia wyrażeń w polach data jest zgodna z [Expression DSL](./expression-dsl.md), a ten sam format jest wykorzystywany przez funkcję [Download & Import](./download-import.md).

Zobacz także [Node Types](./node-types.md), [Expression DSL](./expression-dsl.md) oraz [Download & Import](./download-import.md).

### [Funkcje canvas](./canvas-features.md)

Po najechaniu kursorem na dowolny węzeł canvas inny niż sticky i kliknięciu **Run** następuje wykonanie do tego węzła włącznie. Wymagane dane wejściowe otwierają się w panelu Run z fokusem na pierwszym polu; ścieżki bez danych wejściowych uruchamiają się natychmiast. Zobacz [Run to Node](./canvas-features.md#run-to-node).

Edytor workflow udostępnia funkcje Data Pin (przypięcie ostatniego wyniku węzła w celu testowania dalszych elementów bez ponownego uruchamiania), Execution Logs (wyniki węzłów w czasie rzeczywistym i postęp agenta, uzupełniające [Execution History](./execution-history.md)), Enable/Disable (pomijanie węzłów podczas wykonania) oraz Extract to Sub-Workflow (przeniesienie zaznaczenia do nowego workflow i zastąpienie go węzłem [Execute](../nodes/execute-node.md)). Trwające wykonanie produkcyjne można otworzyć z Historii lub karty na Boardzie; edytor przywraca jego bieżący snapshot, podłącza się do SSE i utrzymuje animację canvas oraz logi Debug na żywo. [Keyboard Shortcuts](./keyboard-shortcuts.md) obsługują kopiowanie, wklejanie, uruchamianie oraz wbudowane wyszukiwanie węzłów.

Zobacz także [Keyboard Shortcuts](./keyboard-shortcuts.md), [Edit History](./edit-history.md) oraz [Execution History](./execution-history.md).

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Watch Editor demo</a></p>

### [Keyboard Shortcuts](./keyboard-shortcuts.md)

Heym udostępnia skróty klawiszowe w całym edytorze: Command Palette (Ctrl+K), Run (Ctrl+Enter), Save (Ctrl+S), Undo/Redo oraz Escape do zamykania. Na canvas: zaznacz wszystko, zaznaczanie wielokrotne, kopiuj/wytnij/wklej, usuń, przełącz węzeł (D), przełącz przypięte dane (P) oraz wbudowane wyszukiwanie węzłów poprzez wpisywanie. Skróty są udokumentowane we wbudowanym odnośniku w aplikacji i ściśle współpracują z [Canvas Features](./canvas-features.md), takimi jak Data Pin oraz włączanie/wyłączanie węzłów.

Zobacz także [Canvas Features](./canvas-features.md), [Quick Drawer](./quick-drawer.md) oraz [Contextual Showcase](./contextual-showcase.md).

### [Asystent AI](./ai-assistant.md)

Asystent AI to panel czatu otwierany z panelu Debug, który umożliwia tworzenie i modyfikowanie workflows w języku naturalnym. Należy wybrać [dane logowania](./credentials.md) oraz model, a następnie opisać żądanie; AI strumieniuje odpowiedź, a każdy prawidłowy [workflow JSON](./workflow-structure.md) w bloku kodu jest automatycznie parsowany i stosowany na canvas. Wprowadzanie głosowe jest obsługiwane w kompatybilnych przeglądarkach.

Po włączeniu **trybu YOLO** (tryb Agent, domyślnie wyłączony) asystent testuje to, co tworzy. Po każdej zmianie uruchamia workflow na canvas, odczytuje wynik i poprawia workflow, aż będzie działał zgodnie z poleceniem — maksymalnie do 5 uruchomień na wiadomość. Przed pierwszym uruchomieniem pyta o dane wejściowe do testu, może uruchamiać inne workflows, gdy potrzebuje ich wyniku, i pokazuje każdy krok w trakcie pracy. Zobacz [AI Assistant › YOLO Mode](./ai-assistant.md#yolo-mode).

Kliknij **AI** nad dowolnym węzłem na canvasie, aby zmienić lub naprawić tylko ten węzeł. Panel pokazuje modyfikowany węzeł (z jego ostatnim wynikiem po uruchomieniu) i oferuje **Change this node as ...**, **Fix error in this node ...** oraz **Other**. Tylko ten węzeł jest aktualizowany; pozostała część workflowu i układ pozostają bez zmian. Zobacz [AI Assistant › Modyfikowanie pojedynczego węzła](./ai-assistant.md#changing-one-node).

Gdy workflow przechowuje rekordy, asystent pyta, której [tabeli danych](../tabs/datatable-tab.md) użyć, lub tworzy nową z kolumnami wymaganymi przez workflow. Zobacz [AI Assistant › Data tables](./ai-assistant.md#data-tables).

Gdy bieżący workflow zawiera umiejętności [Agent Node](../nodes/agent-node.md), asystent wysyła do kontekstu workflow wyłącznie plik `SKILL.md` każdej umiejętności. Załączone pliki `.py` oraz binarne zasoby umiejętności są wykluczane przed wysłaniem żądania, aby duże pakiety umiejętności nie przekroczyły okna kontekstu modelu.

Współpracuje dobrze z [Chat with Heym](./chat-with-heym.md), [Agent Architecture](./agent-architecture.md) oraz [Expression DSL](./expression-dsl.md).
### [Chat z Heym](./chat-with-heym.md)

Chat z Heym to asystent nagłówka dokumentacji odpowiadający na pytania dotyczące produktu. Otwiera się w wyśrodkowanym oknie dialogowym, utrzymuje wybór danych logowania i modelu widoczny u góry, wstrzykuje ścieżkę aktywnej strony dokumentacji jako kontekst i czyści historię wiadomości po zamknięciu okna. Uzupełnia szerszego [Asystenta AI](./ai-assistant.md) oraz lżejszy [Kontekstowy Pokaz](./contextual-showcase.md).

Zobacz także [Asystent AI](./ai-assistant.md), [Kontekstowy Pokaz](./contextual-showcase.md) oraz [Typy węzłów](./node-types.md).

### [Organizacja workflow](./workflow-organization.md)

Administratorzy instancji (`HEYM_ADMIN_EMAILS`) mogą uzyskiwać dostęp i edytować każdy workflow, wyszukiwać workflow właściciela po adresie e-mail, przeglądać harmonogramy i historię wykonań, wstrzymywać i wznawiać automatyczne triggery oraz usuwać workflow po zakończeniu uruchomień. Zobacz [Administracja instancją](../tabs/workflows-tab.md#instance-administration), aby poznać proces offboardingu oraz rozróżnienie między wstrzymywaniem automatycznych triggerów a blokowaniem wszystkich wywołań.

Workflow można organizować w folderach i podfolderach w strukturze drzewa. Foldery mają nazwy i opcjonalny folder nadrzędny; workflow są przypisywane do folderów. Workflow można zaplanować do usunięcia (przeniesienie do obszaru kosza przed trwałym usunięciem). API obsługuje tworzenie, aktualizację, usuwanie i przenoszenie workflow między folderami, a ten sam model organizacji pojawia się w zakładce [Workflows](../tabs/workflows-tab.md).

Zobacz także [Szybki panel](./quick-drawer.md), [Pobieranie i import](./download-import.md) oraz [Historia edycji](./edit-history.md).

### [Szybki panel](./quick-drawer.md)

Szybki panel to stały panel szybkiego uruchamiania po prawej stronie dla wewnętrznych stron innych niż canvas. Umożliwia wyszukiwanie [workflow](../tabs/workflows-tab.md), przypinanie ulubionych, wybieranie danych wejściowych, natychmiastowe uruchamianie oraz sprawdzanie postępu lub wyników bez otwierania edytora. Workflow z węzłem [File Upload Trigger](../nodes/file-upload-trigger-node.md) przyjmuje upuszczony lub wybrany plik. Kolejność przypiętych elementów i ostatnio wybrany workflow są przechowywane w przeglądarce.

Zobacz także [Organizacja workflow](./workflow-organization.md), [Skróty klawiaturowe](./keyboard-shortcuts.md) oraz [Historia wykonań](./execution-history.md).

### [Kontekstowy Pokaz](./contextual-showcase.md)

Kontekstowy Pokaz to kompaktowy pasek przewodnika w aplikacji dla uwierzytelnionych głównych powierzchni, takich jak zakładki dashboardu, [Ewaluacja](../tabs/evals-tab.md), Dokumentacja i edytor workflow. Domyślnie pozostaje zamknięty, najpierw podaje krótkie podsumowanie strony, oferuje nieco więcej szczegółów na żądanie i linkuje do pełnego artykułu dokumentacji, gdy potrzebne są głębsze wskazówki.

Współpracuje z [Chat z Heym](./chat-with-heym.md), [Szybki panel](./quick-drawer.md) oraz [Asystent AI](./ai-assistant.md) w przepływach wskazówek w aplikacji.

### [Dane logowania](./credentials.md)

Dane logowania przechowują klucze API i sekrety używane przez węzły workflow. Dodaj je w zakładce [Dane logowania](../tabs/credentials-tab.md) i odwołuj się do nich po nazwie lub ID w węzłach takich jak [LLM](../nodes/llm-node.md), [Węzeł Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md), [Telegram](../nodes/telegram-node.md), [Wyślij e-mail](../nodes/send-email-node.md) oraz [Redis](../nodes/redis-node.md). Są szyfrowane w spoczynku, można je udostępniać użytkownikom lub [zespołom](./teams.md), a także można się do nich odwoływać w [Expression DSL](./expression-dsl.md) poprzez `$credentials.Name`.

Zobacz także [Dane logowania](../tabs/credentials-tab.md), [Udostępnianie danych logowania](./credentials-sharing.md) oraz [Integracje zewnętrzne](./integrations.md).

### [Udostępnianie danych logowania](./credentials-sharing.md)

Dane logowania można udostępniać innym użytkownikom po adresie e-mail lub zespołom; wszyscy członkowie zespołu uzyskują dostęp, gdy dane logowania są udostępnione zespołowi. Udostępnione dane logowania pojawiają się ze wskaźnikiem w zakładce [Dane logowania](../tabs/credentials-tab.md). W czasie wykonywania kontekst właściciela workflow łączy dane logowania będące własnością, udostępnione użytkownikowi i udostępnione zespołowi. Użyj `$credentials.CredentialName` w wyrażeniach lub ustaw credentialId w danych węzła.

Zobacz także [Dane logowania](./credentials.md), [Zespoły](./teams.md) oraz [Integracje zewnętrzne](./integrations.md).

### [Zespoły](./teams.md)

Zespoły umożliwiają udostępnianie workflow, danych logowania, zmiennych globalnych, magazynów wektorowych i plików Drive grupie użytkowników jednocześnie. Twórz zespoły w zakładce [Zespoły](../tabs/teams-tab.md) i dodawaj członków po adresie e-mail. Udostępniaj zasoby zespołowi z odpowiednich okien udostępniania; wszyscy członkowie mają wtedy dostęp. Twórca może edytować i usuwać zespół; usunięcie zespołu usuwa wszystkie udostępnienia zespołowe.

Współpracuje z [Udostępnianiem danych logowania](./credentials-sharing.md), [Zmiennymi globalnymi](./global-variables.md) oraz [Enterprise](./enterprise.md).

### [Wykonywanie równoległe](./parallel-execution.md)

Heym uruchamia węzły równolegle, gdy nie mają one wzajemnych zależności. Executor buduje DAG i uruchamia węzły na tym samym poziomie współbieżnie z pulą wątków; gdy tylko węzeł zakończy działanie, jego węzły podrzędne są planowane. Użyj węzła [Merge](../nodes/merge-node.md), aby w razie potrzeby połączyć równoległe gałęzie. Wiele uruchomień workflow wykonuje się współbieżnie; każde uruchomienie jest izolowane. Tryb [SSE Streaming](./sse-streaming.md) emituje zdarzenia w miarę kończenia węzłów.

Zobacz także [Merge](../nodes/merge-node.md), [Loop](../nodes/loop-node.md) oraz [Historia wykonań](./execution-history.md).
### [Architektura agenta](./agent-architecture.md)

[Węzeł agenta](../nodes/agent-node.md) obsługuje subagentów (orchestrator wywołuje inne węzły agenta poprzez call_sub_agent), subworkflow (agent wywołuje inne workflow poprzez call_sub_workflow), umiejętności (treść instrukcji oraz narzędzia Python z pliku .zip lub .md) oraz połączenia klienckie [MCP](../tabs/mcp-tab.md). Executor narzędzi orchestratora kieruje wywołania subagentów i subworkflow; pozostałe narzędzia trafiają do executorów Python, MCP lub umiejętności. Maksymalna głębokość zagnieżdżenia dla subagentów i subworkflow wynosi 5. Pętla wywoływania narzędzi obejmuje automatyczną kompresję kontekstu: przed każdą iteracją szacowane jest zużycie tokenów, a jeśli przekracza ono 80% okna kontekstowego modelu, środkowe wiadomości są podsumowywane przy użyciu tego samego modelu, z zachowaniem nienaruszonego promptu systemowego, pierwszej wiadomości użytkownika i ostatniej wiadomości użytkownika.

Zobacz także [Węzeł agenta](../nodes/agent-node.md), [Trwała pamięć agenta](./agent-persistent-memory.md), [Human-in-the-Loop](./human-in-the-loop.md) oraz [MCP](../tabs/mcp-tab.md).

### [Trwała pamięć agenta](./agent-persistent-memory.md)

Opcjonalny graf wiedzy przypisany do każdego [węzła agenta](../nodes/agent-node.md), przechowywany w Postgres: encje, typy, właściwości oraz relacje skierowane. Gdy `persistentMemoryEnabled` ma wartość true, graf jest podsumowywany do promptu systemowego przy każdym uruchomieniu; po pomyślnym zakończeniu [LLM](../nodes/llm-node.md) w tle wyodrębnia ustrukturyzowane aktualizacje. Operacje REST CRUD dostępne są pod `/api/workflows/{workflow_id}/nodes/{canvas_node_id}/agent-memory/...`. Edytor otwiera się za pomocą różowej kontrolki mózgu na węźle.

Zobacz także [Węzeł agenta](../nodes/agent-node.md), [Architektura agenta](./agent-architecture.md) oraz [Wykonania](../tabs/traces-tab.md).

### [Human-in-the-Loop](./human-in-the-loop.md)

Human-in-the-Loop pozwala [węzłowi agenta](../nodes/agent-node.md) żądać zatwierdzenia w określonych punktach kontrolnych, utworzyć publiczną stronę `/review/{token}` i oczekiwać, aż niezalogowany recenzent zaakceptuje, edytuje lub odrzuci tekst recenzji w formacie Markdown. Agenci z włączonym HITL udostępniają również uchwyt wyjściowy `review`, dzięki czemu można powiadomić [Slack](../nodes/slack-node.md), [Send Email](../nodes/send-email-node.md) lub inne kanały, gdy wykonanie oczekuje. Tekst HITL na poziomie węzła służy jako wytyczne zatwierdzania, natomiast podsumowanie na stronie publicznej jest generowane na podstawie samego żądania recenzji. Oczekujące wykonania pojawiają się natychmiast w [Historii wykonań](./execution-history.md), mogą wystąpić więcej niż raz w tym samym wykonaniu i są wznawiane z dokładnie zapisanego snapshotu workflow po przesłaniu każdej decyzji.

Zobacz także [Węzeł agenta](../nodes/agent-node.md), [Portal](./portal.md), [Historia wykonań](./execution-history.md) oraz [Send Email](../nodes/send-email-node.md).

### [Webhooks](./webhooks.md)

Workflow mogą być wyzwalane przez [HTTP](../nodes/http-node.md) pod adresem `POST /api/workflows/{workflow_id}/execute` lub strumieniowane przyrostowo z `POST /api/workflows/{workflow_id}/execute/stream`. Treść żądania jest przekazywana jako body do węzłów [Input](../nodes/input-node.md); nagłówki i parametry zapytania są dostępne w wyrażeniach [Expression DSL](./expression-dsl.md). Uwierzytelnianie można skonfigurować dla każdego workflow: anonimowe, JWT lub niestandardowy nagłówek. Opcjonalne buforowanie odpowiedzi, ograniczanie liczby żądań oraz okno dialogowe Run with cURL w edytorze znajdują się na poziomie workflow i dotyczą obu trybów. Dzięki [limitowi współbieżności](./webhooks.md#concurrency-limit-and-queued-runs) wywołanie, które musi poczekać, otrzymuje zamiast tego kod `202 Accepted` z identyfikatorem wykonania oraz adresem URL statusu.

Zobacz także [Input](../nodes/input-node.md), [Tokeny wykonania](./execution-tokens.md), [Strumieniowanie SSE](./sse-streaming.md), [HTTP](../nodes/http-node.md) oraz [Struktura workflow](./workflow-structure.md).

### [Tokeny wykonania](./execution-tokens.md)

Tokeny wykonania to ograniczone zakresem JWT, które przyznają dostęp do endpointów execute i stream pojedynczego workflow. Gdy workflow korzysta z uwierzytelniania JWT, tokeny pozwalają zewnętrznym skryptom, pipeline'om CI i integracjom wywoływać workflow bez udostępniania sesji użytkownika. Każdy token zawiera roszczenie `wid`, które przypisuje go do jednego workflow, `jti` używane do natychmiastowego unieważnienia oraz konfigurowalny TTL (od 60 sekund do 10 lat). Tokeny można tworzyć, wybierać i unieważniać bezpośrednio w oknie dialogowym **Run with cURL** — wybrany token jest automatycznie osadzany w generowanym poleceniu.

Zobacz także [Webhooks](./webhooks.md), [Bezpieczeństwo](./security.md) oraz [Strumieniowanie SSE](./sse-streaming.md).

### [Strumieniowanie SSE](./sse-streaming.md)

Okno dialogowe cURL umożliwia przełączenie wykonania [webhooka](./webhooks.md) w tryb Server-Sent Events. Powoduje to generowanie zdarzeń `execution_started`, `node_start`, `node_complete` i `execution_complete` w czasie rzeczywistym, dodaje `--no-buffer` do generowanego polecenia cURL oraz pozwala skonfigurować komunikaty startowe dla poszczególnych węzłów, takie jak `[START] LLM` lub niestandardowy tekst dla zewnętrznych odbiorców terminalowych.

Zobacz także [Webhooks](./webhooks.md), [Historia wykonań](./execution-history.md) oraz [LLM](../nodes/llm-node.md).
### [Triggers](./triggers.md)

Workflow są uruchamiane przez węzły triggerów ([Input](../nodes/input-node.md), [Cron](../nodes/cron-node.md), [Telegram Trigger](../nodes/telegram-trigger-node.md), [Discord Trigger](../nodes/discord-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Heym Trigger](../nodes/heym-trigger-node.md), odbiór [RabbitMQ](../nodes/rabbitmq-node.md)) lub punkty wejścia: [Webhook/API](./webhooks.md), [MCP](../tabs/mcp-tab.md), [Portal](./portal.md), Cron scheduler, Telegram webhook, Discord interaction webhook, IMAP trigger manager, RabbitMQ consumer lub uruchomienie z Edytora. Każdy trigger ma własny endpoint lub proces działający w tle; [Cron](../nodes/cron-node.md) uruchamia się co 60 sekund, węzły [Telegram Trigger](../nodes/telegram-trigger-node.md) odbierają bot webhooks, węzły [Discord Trigger](../nodes/discord-trigger-node.md) odbierają podpisane interaction webhooks, a węzły [IMAP Trigger](../nodes/imap-trigger-node.md) działają w skonfigurowanym interwale odpytywania. Węzły [Input](../nodes/input-node.md) odbierają body, headers i query z żądań webhook.

Zobacz także [Node Types](./node-types.md), [Webhooks](./webhooks.md) oraz [Parallel Execution](./parallel-execution.md).

### [Execution History](./execution-history.md)

Historia wykonań rejestruje uruchomienia workflow: dane wejściowe, wyjściowe, wyniki węzłów, status oraz źródło triggera. Dostęp do niej można uzyskać z paska narzędzi Edytora, widoku Docs, nagłówka Dashboard lub widoku [Evals](../tabs/evals-tab.md). Historia dla pojedynczego workflow pokazuje uruchomienia otwartego workflow; widok pełnej historii pokazuje uruchomienia w obrębie wszystkich workflow oraz Chat. Aktualnie uruchomione wykonania pojawiają się na górze obu okien dialogowych z akcjami **Open live** i **Cancel**. Open live podłącza edytor do istniejącego wykonania przez [SSE](./sse-streaming.md), przywraca ukończone węzły, pulsuje bieżące i oczekujące węzły oraz dołącza logi Debug bez rozpoczynania nowego uruchomienia. Bring to Canvas ładuje dane wejściowe i wyjściowe węzłów ukończonego uruchomienia w celu ponownego uruchomienia lub debugowania; deep link `/workflows/{workflowId}/{executionId}` obsługuje zarówno wykonania aktywne, jak i ukończone. Uruchomienia wstrzymane przez [Human-in-the-Loop](./human-in-the-loop.md) są natychmiast zapisywane jako `pending`, wraz z publicznym adresem URL do przeglądu oraz wszelkimi węzłami powiadomień wykonanymi z gałęzi `review` agenta. Jeśli serwer zostanie zrestartowany w trakcie uruchomienia, przerwane wykonania są odzyskiwane automatycznie: są uruchamiane od nowa z tymi samymi danymi wejściowymi i wyświetlane jako ukończone (oznaczone jako **Recovered**), co jest kontrolowane przez przełącznik **Auto-recover runs** na poziomie workflow, który może zamiast tego zapisać je jako `skipped`.

Zobacz także [SSE Streaming](./sse-streaming.md), [Human-in-the-Loop](./human-in-the-loop.md) oraz [Traces](../tabs/traces-tab.md).

### Execution Highlights

Po uruchomieniu na żywo — lub po **Bring to Canvas** — w prawym górnym rogu Canvas pojawia się możliwe do zamknięcia okno **Execution Highlights**, wyświetlające w kolejności wykonania, co wygenerował każdy węzeł. To szybki sposób na sprawdzenie wyników poszczególnych węzłów bez otwierania każdego z nich; można je zamknąć przyciskiem **✕**, a otworzy się ponownie przy następnym uruchomieniu. Highlights są również wyświetlane przy uruchomieniach na dashboardzie. Szczegóły można znaleźć w [Execution History](./execution-history.md).

### [Edit History](./edit-history.md)

Edit History śledzi zapisane wersje workflow (każdy zapis tworzy wersję). Umożliwia wyświetlenie listy, otwarcie wersji w celu zobaczenia różnic względem bieżącego workflow ([węzły](./workflow-structure.md), krawędzie, konfiguracja) oraz przywrócenie wcześniejszej wersji za pomocą Revert. W przeciwieństwie do [Execution History](./execution-history.md), Edit History śledzi zmiany struktury, a nie uruchomienia.

Zobacz także [Execution History](./execution-history.md), [Workflow Structure](./workflow-structure.md) oraz [Canvas Features](./canvas-features.md).

### Error Workflow

Workflow może wskazać inny workflow do uruchomienia w przypadku niepowodzenia. Konfiguruje się to w panelu **Properties** na poziomie workflow (wyświetlanym, gdy żaden węzeł nie jest zaznaczony) w sekcji **On error, run workflow**. Tylko właściciel workflow może ustawić, zmienić lub wyczyścić to ustawienie; zobacz [Owner-only settings](./workflow-organization.md#owner-only-settings). Gdy uruchomienie najwyższego poziomu zakończy się nieobsłużonym błędem, wybrany error workflow zostaje uruchomiony i otrzymuje kontekst błędu (identyfikator i nazwę nieudanego workflow, identyfikator uruchomienia, komunikat błędu, etykietę i typ nieudanego węzła oraz znacznik czasu). Jeśli canvas zawiera już węzeł [Error Handler](../nodes/error-handler-node.md), lokalny handler ma pierwszeństwo i error workflow **nie** jest wywoływany. Sam error workflow uruchamia się bezpośrednio, więc nigdy nie wyzwala własnego error workflow.

Obejmuje każde nie-testowe uruchomienie najwyższego poziomu: oba endpointy execute, [Portal](./portal.md) oraz każdy trigger, w tym [cron](../nodes/cron-node.md), triggery platform czatu, e-mail, kolejki, [MCP](../tabs/mcp-tab.md) i widżety dashboardu. Przy włączonym [Load Distribution](./cluster.md) pozostaje to bez zmian, również w przypadku uruchomień wykonanych przez workera: nieudany węzeł wraca wraz z wynikiem, a error workflow jest następnie dystrybuowany jak każde inne uruchomienie, więc węzeł w jego wnętrzu, który musi działać na instancji głównej, nadal tam trafia. Dwa przypadki są celowo pominięte, ponieważ wynik samego workflow nie jest jeszcze znany: uruchomienie, którego żadna instancja nigdy nie wykonała, oraz oczekiwanie, które przekroczyło limit czasu, podczas gdy uruchomienie może wciąż trwać. Nie jest również wyzwalany przez ręczne uruchomienia testowe na canvasie.
### Limit czasu Workflow

Każdy workflow może ustawić **limit czasu workflow** w sekundach w panelu **Properties** na poziomie workflow. Wartość `0` (domyślna) wyłącza limit. Po ustawieniu, uruchomienie przekraczające limit jest zatrzymywane na granicy następnego węzła i rejestrowane jako nieudane uruchomienie z błędem „timed out". Limit czasu dotyczy uruchomień ręcznych, przez API oraz wyzwalanych. Długie węzły [Wait](../nodes/wait-node.md) są przerywane niezwłocznie, zamiast blokować przez pełny czas trwania.

### Limit współbieżności

Każdy workflow może ograniczyć liczbę jednoczesnych uruchomień produkcyjnych za pomocą ustawienia **Limit współbieżności** w panelu **Properties** na poziomie workflow; właściciel oraz współpracownicy z prawami do edycji mogą go zmieniać, a domyślnie jest wyłączony. Po osiągnięciu limitu nowe uruchomienia z endpointów [webhook](./webhooks.md#concurrency-limit-and-queued-runs) i [strumieniowania](./sse-streaming.md), z [Portalu](./portal.md), z [Quick Drawer](./quick-drawer.md), z [MCP](../tabs/mcp-tab.md) oraz z każdego [triggera](./triggers.md) oczekują w kolejce FIFO (pierwsze weszło, pierwsze wyszło), zliczanej we wszystkich instancjach [klastra](./cluster.md). Uruchomienia testowe z edytora, wywołania sub-workflow, [Evals](../tabs/evals-tab.md) oraz wznowienia po przeglądzie nigdy nie trafiają do kolejki, a uruchomienia kart z [Board](../tabs/board-tab.md), przesyłanie plików, uruchomienia wywołane narzędziem run-workflow asystenta AI oraz workflowy powiadomień o alertach startują bez oczekiwania na slot. Wywołanie webhooka, które musi poczekać, otrzymuje natychmiast kod `202 Accepted` z identyfikatorem `execution_id`, adresem URL statusu weryfikującym te same poświadczenia, pozycją w kolejce, wielkością kolejki oraz liczbą aktywnych uruchomień; klient MCP otrzymuje taką samą odpowiedź i odpytuje narzędzie `heym_execution_status`. Opcjonalny parametr **Maks. rozmiar kolejki** odrzuca nadmiarowe wywołania kodem `429`, a opcjonalny **Maks. czas oczekiwania** oznacza zadanie, które czekało zbyt długo, jako `expired`. Oczekujące zadania są widoczne w [Historii uruchomień](./execution-history.md) jako **W kolejce n/m** i można je tam anulować.

### Zaoszczędzony czas

Każdy workflow może rejestrować **szacowany czas zaoszczędzony na uruchomienie** (w minutach), ustawiany w panelu **Properties** na poziomie workflow. Zakładka [Analytics](../tabs/analytics-tab.md) agreguje tę wartość w wybranym zakresie jako łączny wskaźnik **Time Saved** (suma iloczynu szacunku każdego workflow × jego udanych uruchomień). Sekcja Most Used również wyświetla tę sumę dla każdego workflow; **Not Set** otwiera pole szacunku, gdy nie jest on ustawiony. Raport [Workflow Analysis](./workflow-analysis.md) zaleca ustawienie szacunku, gdy żaden nie został skonfigurowany.

### [Settings](./user-settings.md)

Okno dialogowe Settings (otwierane z awatara w nagłówku) zawiera cztery zakładki: Profile (zdjęcie Gravatar, nazwa wyświetlana, User Rules), [Security](./security.md) (zmiana hasła), Voice ([ElevenLabs TTS/STT](./chat-voice.md)) oraz Observability (status [OpenTelemetry](./opentelemetry.md) tylko do odczytu). User Rules to niestandardowe instrukcje wstrzykiwane do każdego żądania AI, w tym do kreatora workflow i [Chat](../tabs/chat-tab.md), dzięki czemu można jednorazowo ustawić język, ton, styl kodowania lub konwencje workflow. Dostępne jest również zarządzanie polityką haseł oraz kluczami API [MCP](../tabs/mcp-tab.md).

Zobacz także [Security](./security.md), [Chat Voice](./chat-voice.md), [OpenTelemetry Tracing](./opentelemetry.md) oraz [AI Assistant](./ai-assistant.md).

### [OpenTelemetry Tracing](./opentelemetry.md)

Heym może emitować ślady OpenTelemetry dla każdego uruchomienia workflow i wykonania węzła: główny span `heym.workflow.execute` na uruchomienie oraz podrzędny span `heym.node.execute` na węzeł, z użyciem modelu i tokenów dołączonym do węzłów LLM i agentów. Spany są eksportowane przez OTLP/HTTP do dowolnego kompatybilnego backendu (Jaeger, Grafana Tempo, Honeycomb, Datadog), a kontekst śledzenia W3C propaguje się przez przychodzące webhooki, wychodzące HTTP oraz podworkflow. Śledzenie jest domyślnie wyłączone i konfigurowane za pomocą [zmiennych środowiskowych](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md) `HEYM_OTEL_*`; aktywny status jest wyświetlany w zakładce Observability w [Settings](./user-settings.md).

Zobacz także [Execution History](./execution-history.md), [Traces](../tabs/traces-tab.md) oraz [Webhooks](./webhooks.md).

### [Download & Import](./download-import.md)

Eksportuj bieżący workflow jako JSON z paska narzędzi Edytora (przycisk Download); plik zawiera węzły i krawędzie. Importuj, przeciągając plik JSON na zakładkę [Workflows](../tabs/workflows-tab.md) (tworzy nowy workflow) lub na canvas (zastępuje lub scala). Plik JSON musi zawierać tablicę nodes; nazwa i krawędzie są opcjonalne. Użyj tej funkcji do tworzenia kopii zapasowych, udostępniania lub migracji między instancjami.

Zobacz także [Workflow Structure](./workflow-structure.md), [Workflows](../tabs/workflows-tab.md) oraz [Canvas Features](./canvas-features.md).

### [Portal](./portal.md)

Portal udostępnia workflow jako publiczne interfejsy chat pod adresem `/chat/{slug}`. Skonfiguruj portal_enabled, slug, opcjonalne uwierzytelnianie (użytkownicy portalu), streaming oraz przesyłanie plików dla każdego workflow. Użytkownicy końcowi korzystają z interfejsu chat bez logowania do Heym; obrazy wyjściowe mogą być wyświetlane w chat. Workflow portalu mogą również przekazywać do stron przeglądu [Human-in-the-Loop](./human-in-the-loop.md), gdy [Agent Node](../nodes/agent-node.md) wymaga zatwierdzenia, podczas gdy gałąź `review` agenta wysyła powiadomienia do innych kanałów. Użyj tej funkcji do narzędzi wewnętrznych, chatbotów dla klientów oraz formularzy opartych na AI.

Zobacz także [Human-in-the-Loop](./human-in-the-loop.md), [Agent Node](../nodes/agent-node.md) oraz [Drive](./drive.md).

### [File Generation](./file-generation.md)

Skills mogą generować pliki takie jak PDF, DOCX, CSV, JSON i obrazy podczas wykonania, zapisując do obszaru roboczego `_OUTPUT_DIR`. Heym automatycznie przechwytuje te pliki, przechowuje je i udostępnia metadane do pobrania w `_generated_files`, którymi można następnie zarządzać za pomocą [Drive node](../nodes/drive-node.md) lub przeglądać w zakładce [Drive](../tabs/drive-tab.md).

Zobacz także [Agent Node](../nodes/agent-node.md), [Drive](./drive.md) oraz [Drive node](../nodes/drive-node.md).

### [Drive](./drive.md)

Drive to wspólna warstwa przechowywania i udostępniania plików generowanych przez skills. Umożliwia przeglądanie plików, tworzenie linków publicznych lub chronionych hasłem, stosowanie wygaśnięcia i limitów pobierania, udostępnianie plików w trybie tylko do odczytu zespołom oraz zarządzanie tymi plikami programowo za pomocą [Drive node](../nodes/drive-node.md) lub ręcznie z zakładki [Drive](../tabs/drive-tab.md).

Zobacz także [Drive](../tabs/drive-tab.md), [File Generation](./file-generation.md) oraz [Portal](./portal.md).
### [Bezpieczeństwo](./security.md)

Heym egzekwuje politykę haseł (długość, wielkie litery, małe litery, cyfry), przechowuje access tokeny w plikach cookie HttpOnly i rotuje refresh tokeny przy każdym użyciu. Ograniczanie liczby żądań (rate limiting) obowiązuje dla logowania, rejestracji oraz logowania do [Portalu](./portal.md). [Dane logowania](./credentials.md) są szyfrowane w spoczynku algorytmem AES-256 (Fernet). Klucz API [MCP](../tabs/mcp-tab.md) służy do uwierzytelniania klientów; bezpieczeństwo treści jest dostępne poprzez [Guardrails](./guardrails.md) w węzłach [LLM](../nodes/llm-node.md) i [Agent Node](../nodes/agent-node.md). [Execution Tokens](./execution-tokens.md) zapewniają tokeny JWT o zakresie ograniczonym do konkretnego workflow dla zewnętrznych wywołujących.

Zobacz także [Execution Tokens](./execution-tokens.md), [Guardrails](./guardrails.md), [Portal](./portal.md) oraz [Dane logowania](./credentials.md).

### [Single Sign-On](./sso.md)

Heym uwierzytelnia użytkowników względem dowolnego zewnętrznego dostawcy OpenID Connect - Keycloak, Okta, Entra ID, Auth0, Google - konfigurowanego w czasie działania z poziomu **Settings → SSO** przez administratora instancji wymienionego w `HEYM_ADMIN_EMAILS`. Wprowadza się wyłącznie adres URL wystawcy (issuer) oraz dane logowania klienta; każdy endpoint pochodzi z dokumentu discovery dostawcy, więc żaden dostawca nie jest zaszyty na stałe. Logowanie wykorzystuje Authorization Code z PKCE, a ID token jest weryfikowany względem kluczy publicznych opublikowanych przez dostawcę. Konta są mapowane najpierw po `(issuer, subject)`, a następnie po zweryfikowanym adresie e-mail, z opcjonalnym automatycznym tworzeniem kont ograniczonym do listy dozwolonych domen e-mail. Logowanie hasłem pozostaje dostępne równolegle z SSO i można je wyłączyć po pomyślnym przejściu testu połączenia, przy czym konta z `HEYM_ADMIN_EMAILS` są wyłączone z tego ograniczenia, aby błędnie skonfigurowany dostawca nie zablokował instancji.

Zobacz także [Settings](./user-settings.md), [Bezpieczeństwo](./security.md) oraz [Audit Logging](./audit.md).

### [Rozkład obciążenia](./cluster.md)

Wystarczy wskazać drugiej instancji Heym tę samą bazę danych, a dołączy ona jako worker. Zadania działające w tle - cron, webhooki, wywołania narzędzi MCP, triggery czatu - są rozdzielane między instancjami według wartości procentowej ustawianej przez administratora instancji w **Settings → Instances**, a status, opóźnienie bazy danych i wersja każdej instancji znajdują się w jednej tabeli. Instancje nigdy nie komunikują się ze sobą: to Postgres przenosi pracę, więc worker nie potrzebuje otwartego portu ani trasy powrotnej do instancji głównej. Praca związana z plikami lokalnymi, przestrzenią roboczą agenta kodującego lub zainstalowaną wtyczką zawsze wykonuje się na instancji głównej, a panel raportuje, jaka część z ostatnich 24 godzin przypadała na takie zadania, dzięki czemu operator widzi, kiedy wartości procentowe nie mogą pomóc. Każde wykonanie w historii wskazuje instancję, która je przeprowadziła, a oba okna dialogowe historii umożliwiają filtrowanie według tego kryterium.

Zobacz także [Settings](./user-settings.md), [Wykonania](../tabs/traces-tab.md) oraz [Analytics](../tabs/analytics-tab.md).

### [Integracje zewnętrzne](./integrations.md)

Heym łączy się z usługami zewnętrznymi poprzez dane logowania przechowywane w zakładce [Dane logowania](../tabs/credentials-tab.md) (szyfrowane w spoczynku). Obsługiwane typy obejmują OpenAI, Google, Decision Model dla [węzła Decision](../nodes/decision-node.md), Model Router do automatycznego wyboru modelu (patrz poniżej), GitHub dla [węzła GitHub](../nodes/github-node.md) i integracji MCP, Jira dla [węzła Jira](../nodes/jira-node.md), Notion dla [węzła Notion](../nodes/notion-node.md), Custom LLM, Cohere, RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, [Grist](../nodes/grist-node.md), SMTP dla [Send Email](../nodes/send-email-node.md), [RabbitMQ](../nodes/rabbitmq-node.md), [Redis](../nodes/redis-node.md), [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), Bearer, Header oraz FlareSolverr dla [Crawler](../nodes/crawler-node.md). Każdy typ dokumentuje wymagane pola; dane logowania można udostępniać użytkownikom lub [zespołom](./teams.md) i odwoływać się do nich po nazwie w węzłach albo jako `$credentials.Name` w wyrażeniach.

### Model Router (Auto Model)

Dane logowania typu **Model Router** wybierają model dla każdego żądania, zamiast przechowywać klucz. Przechowują one dane logowania modelu decyzyjnego oraz listę istniejących danych logowania OpenAI/Google/Custom, z których każde ma kryteria określające, kiedy powinno zostać użyte, i pojawiają się w każdym selektorze modelu jako pojedynczy model o nazwie **Auto**.

Wykonania, dziennik wykonania na canvasie oraz Span View pokazują obie części wyboru, na przykład `Auto Model / GPT-5`, podczas gdy koszt pozostaje przypisany do modelu, który został uruchomiony. Auto Model nie może być łączony z Responses API, trybem Batch ani generowaniem obrazów. Pełne działanie opisano w sekcji [Dane logowania](./credentials.md).

Zobacz także [Dane logowania](./credentials.md), [Credentials Sharing](./credentials-sharing.md) oraz [Zespoły](./teams.md).

### [Guardrails](./guardrails.md)

Guardrails blokują niebezpieczne lub niepożądane wiadomości użytkownika, zanim dotrą one do [LLM](../nodes/llm-node.md) lub [Agent Node](../nodes/agent-node.md). Należy włączyć je dla danego węzła i wybrać kategorie do blokowania (np. przemoc, mowa nienawiści, treści seksualne, samookaleczenie, nękanie, działalność nielegalna). Należy ustawić czułość (niska, średnia, wysoka). Po zadziałaniu węzeł zgłasza błąd, który można przechwycić za pomocą [Error Handler](../nodes/error-handler-node.md). Wykrywanie wykorzystuje API moderacji dostawcy lub klasyfikację LLM w zależności od typu danych logowania.

Zobacz także [Bezpieczeństwo](./security.md), [LLM](../nodes/llm-node.md), [Agent Node](../nodes/agent-node.md) oraz [Error Handler](../nodes/error-handler-node.md).
### [Enterprise](./enterprise.md)

Enterprise obejmuje komercyjne licencjonowanie, profesjonalne wsparcie oraz usługi wdrożeniowe dla zespołów uruchamiających Heym w środowisku produkcyjnym. Zawiera pomoc w zakresie architektury workflow, onboarding, wskazówki dotyczące Kubernetes i skalowania, wsparcie priorytetowe oraz rozwój niestandardowy wokół zaawansowanych funkcji, takich jak [Węzeł Agenta](../nodes/agent-node.md), [Human-in-the-Loop](./human-in-the-loop.md), [Wykonanie Równoległe](./parallel-execution.md) i [Portal](./portal.md).

Zobacz także [Uruchamianie i Wdrażanie](../getting-started/running-and-deployment.md), [Bezpieczeństwo](./security.md) oraz [Zespoły](./teams.md).

### [Heym Work](./heym-work.md)

Heym Work to drugi interfejs dla zespołów biznesowych zbudowany na bazie Heym. Użytkownicy opisują zadanie, odpowiadają na kilka pytań i otrzymują przetestowany workflow, a następnie pracują z poziomu stron, zatwierdzeń oraz listy Aktywności, na której każde uruchomienie ma własną nazwę. Administratorzy instancji łączą go w sekcji **Ustawienia → Heym Work**, podając jego adres i klucz integracji; wymaga on osobnej licencji od zespołu Heym.

Zobacz także [Enterprise](./enterprise.md), [Single Sign-On](./sso.md) oraz [Human-in-the-Loop](./human-in-the-loop.md).

---

## Zakładki Panelu

### [Workflows](../tabs/workflows-tab.md)

Zakładka Workflows jest domyślnym widokiem panelu. Wyświetla listę dwupanelową: workflows i foldery jako gęste wiersze po lewej stronie oraz podgląd wybranego workflow po prawej wraz z jego triggerem, ostatnim uruchomieniem i krokami, a także przyciskami Open Workflow i Run Now. Każdy wiersz zawiera znacznik statusu (Running, Scheduled, Listening, Paused, API, SubWorker, Portal, Manual, Remove Scheduled), który można filtrować za pomocą listy rozwijanej Status. Workflow bez węzła triggera jest oznaczany na podstawie sposobu rozpoczęcia ostatniego uruchomienia — API dla wywołania HTTP, SubWorker dla workflow nadrzędnego, Portal dla jego publicznego chat — i pozostaje oznaczony jako Manual do momentu pierwszego uruchomienia. Foldery i podfoldery obsługują [organizację](./workflow-organization.md). Twórz workflows za pomocą New Workflow, przeciągnij i upuść JSON, aby [zaimportować](./download-import.md), oraz edytuj lub usuwaj z poziomu akcji wiersza. Workflows można przenosić między folderami; usunięcie jest planowane (kosz) przed trwałym usunięciem.

Zobacz także [Organizacja Workflow](./workflow-organization.md), [Pobieranie i Import](./download-import.md) oraz [Szybki Panel](./quick-drawer.md).

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Watch Workflows demo</a></p>

### [Board](../tabs/board-tab.md)

Agentowa tablica kanban, w której karty są trwałymi zadaniami. Skonfiguruj każdą kolumnę za pomocą uporządkowanego łańcucha workflows; przeniesienie karty do kolumny uruchamia łańcuch z pełnym kontekstem karty (treść, komentarze, historia, poprzednie wyniki). Wyniki są zapisywane z powrotem na karcie — zielony przy powodzeniu, czerwony przy błędzie, bursztynowy podczas wykonywania. Kolejne rundy ponownie uruchamiają łańcuch bieżącej kolumny ze wszystkim, co zostało zgromadzone do tej pory, co napędza iteracyjne planowanie. Uruchomienia są rejestrowane w [Historii Wykonań](./execution-history.md) ze źródłem triggera `board`. Gdy uruchomienie karty jest aktywne, **Open live** otwiera dokładnie to uruchomienie na animowanym canvas z przyrostowymi logami Debug.

Zobacz także [Workflows](../tabs/workflows-tab.md), [Historia Wykonań](./execution-history.md) oraz [Human-in-the-Loop](./human-in-the-loop.md).

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

### [Szablony](../tabs/templates-tab.md)

Zakładka Szablony umożliwia zapisywanie i ponowne wykorzystywanie szablonów workflow (pełne workflows) oraz szablonów węzłów (pojedyncze skonfigurowane węzły). Twórz szablony workflow z edytora (Share as Template) oraz szablony węzłów, klikając prawym przyciskiem myszy węzeł. Przeglądaj według widoczności (Everyone lub Specific users/[teams](./teams.md)), zastosuj szablon, aby utworzyć nowy workflow lub dodać węzeł do canvas, oraz zarządzaj udostępnionymi szablonami.

Zobacz także [Workflows](../tabs/workflows-tab.md), [Zespoły](./teams.md) oraz [Funkcje Canvas](./canvas-features.md).

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Watch Templates demo</a></p>

### [Zmienne](../tabs/global-variables-tab.md)

Zakładka Zmienne zarządza [Globalnym Magazynem Zmiennych](./global-variables.md). Twórz, edytuj i usuwaj zmienne globalne; ustaw nazwę, wartość i typ wartości (Auto, String, Number, Boolean, Array, Object). Zmienne są przypisane do użytkownika i zachowywane między wykonaniami. Odwołuj się do nich w dowolnym [wyrażeniu](./expression-dsl.md) workflow jako `$global.variableName`. Zmienne można udostępniać innym użytkownikom lub [zespołom](./teams.md).

Zobacz także [Zmienne Globalne](./global-variables.md), [Węzeł Zmiennej](../nodes/variable-node.md) oraz [Expression DSL](./expression-dsl.md).

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Watch Variables demo</a></p>
### [Chat](../tabs/chat-tab.md)

Zakładka Chat to powierzchnia długotrwałego agenta Heym służąca do obsługi przestrzeni roboczej w trybie konwersacji. Należy wybrać [dane logowania](./credentials.md) oraz model, a następnie zlecić Chatowi odpowiadanie na pytania, sprawdzanie definicji workflow, uruchamianie istniejących workflow, podsumowywanie wykonań i harmonogramów, raportowanie historii uruchomień pojedynczego workflow (liczba uruchomień, rozkład statusów, ostatnie uruchomienie oraz szczegóły jednego uruchomienia na żądanie), raportowanie, które wykonania są aktualnie w toku (z czasem, jaki upłynął, bieżącym węzłem i linkiem do każdego aktywnego uruchomienia), rozstrzyganie oczekujących przeglądów wykonywanych przez człowieka, tworzenie i modyfikowanie workflow przy użyciu tego samego silnika AI Builder, który jest używany w edytorze, lub dodawanie kart do tablic kanban w języku naturalnym. Nowe karty zawsze trafiają do pierwszej kolumny wybranej tablicy; gdy dostępnych jest kilka tablic i żadna nie została wskazana, Chat przedstawia wybór tablicy przed utworzeniem karty.

Chat działa dalej w backendzie po zamknięciu przeglądarki. Gdy odpowiedź jest strumieniowana, można wysyłać kolejne wiadomości; Heym przechowuje je w kolejce opartej na bazie danych, umożliwia edycję lub usunięcie wiadomości oczekujących w kolejce przed ich rozpoczęciem oraz uruchamia je w kolejności po zakończeniu bieżącej odpowiedzi. Jeśli asystent potrzebuje szczegółów planowania i zwraca pytania doprecyzowujące, kolejka zostaje wstrzymana do czasu udzielenia odpowiedzi na te pytania, a następnie wznawia działanie po odpowiedzi planistycznej.

Odpowiedzi są strumieniowane z obsługą markdown, obrazów wbudowanych, kart podglądu workflow, zwijanych kart wywołań narzędzi, zużycia kontekstu oraz automatycznej kompresji kontekstu. Chat obsługuje załączniki, wprowadzanie głosowe, odtwarzanie na głos, akcje kopiowania, szybkie prompty, User Rules z [Settings](./user-settings.md) oraz [global variables](./global-variables.md) jako kontekst.

Zobacz także [AI Assistant](./ai-assistant.md), [Credentials](./credentials.md) oraz [Settings](./user-settings.md).

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Watch Chat demo</a></p>

### [Credentials](../tabs/credentials-tab.md)

Zakładka Credentials zarządza kluczami API i sekretami używanymi przez węzły. Dane logowania należy dodawać według typu (OpenAI, Google, Custom, Bearer, Header, [Telegram](../nodes/telegram-node.md), [Slack](../nodes/slack-node.md), SMTP, [Redis](../nodes/redis-node.md), RAG: Qdrant + OpenAI, RAG: Psql + OpenAI, Cohere itd.), nadawać im nazwy i odwoływać się do nich w węzłach workflow. Edycja i usuwanie odbywają się z poziomu karty; udostępnianie innym użytkownikom odbywa się przez adres e-mail lub [teams](./teams.md). Wszystkie wartości są szyfrowane w spoczynku i maskowane w interfejsie.

Zobacz także [Credentials](./credentials.md), [Credentials Sharing](./credentials-sharing.md) oraz [Third-Party Integrations](./integrations.md).

<video src="/features/showcase/credentials.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/credentials.webm">▶ Watch Credentials demo</a></p>

### [Vectorstores](../tabs/vectorstores-tab.md)

Zakładka Vectorstores zarządza magazynami wektorowymi używanymi przez węzły [RAG](../nodes/rag-node.md). Należy utworzyć magazyn z nazwą oraz [danymi logowania](./credentials.md) magazynu wektorowego — *RAG: Qdrant + OpenAI* (zewnętrzny Qdrant) lub *RAG: Psql + OpenAI* (własny Postgres Heym przez pgvector), co ustala backend magazynu — opcjonalnie ustawić nazwę kolekcji, a następnie przesłać dokumenty (PDF, TXT itd.). Zarządzanie zawartością (przeglądanie, usuwanie źródeł), edycja szczegółów magazynu oraz udostępnianie magazynów użytkownikom. W węźle [RAG](../nodes/rag-node.md) należy wybrać Database, wskazać magazyn wektorowy i uruchomić operacje insert, upsert, delete lub search.

Zobacz także [Qdrant RAG](../nodes/rag-node.md), [Credentials](./credentials.md) oraz [Teams](./teams.md).

<video src="/features/showcase/vectorstores.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/vectorstores.webm">▶ Watch Vectorstores demo</a></p>
### [MCP](../tabs/mcp-tab.md)

Zakładka MCP konfiguruje integrację z Model Context Protocol. Heym obsługuje dwa tryby:

**Serwer domyślny** – pojedynczy endpoint pod adresem `/api/mcp/sse` udostępnia wszystkie workflow z włączoną obsługą MCP. Umożliwia wyświetlenie i ponowne wygenerowanie klucza API, skopiowanie gotowego do użycia JSON klienta, połączenie z Cursor jednym kliknięciem oraz przejście przez proces konfiguracji Claude z automatyczną rejestracją OAuth.

**Serwery nazwane** – tworzenie wielu izolowanych endpointów MCP, z których każdy ma własny adres URL oparty na UUID (`/api/mcp/servers/{uuid}/sse`) oraz niezależny klucz API. Przypisanie konkretnych workflow do każdego serwera pozwala różnym klientom AI lub zespołom widzieć wyłącznie potrzebne narzędzia. Każdy serwer nazwany obsługuje te same metody uwierzytelniania (klucz API, Claude OAuth) i posiada własne skróty Copy JSON oraz Add to Cursor. Oba endpointy obsługują transport SSE (GET) oraz Streamable HTTP (POST). Przełączenie workflow w obrębie serwera nazwanego przenosi go na początek przypisanej listy, dzięki czemu zmieniony wiersz pozostaje widoczny.

**Narzędzie czatu Heym** – oba tryby mogą również udostępniać silnik [Chat](../tabs/chat-tab.md) jako pojedyncze narzędzie `heym_chat`, włączane osobno dla każdej powierzchni, z własnymi danymi logowania LLM i modelem (wstępnie wypełnianymi na podstawie preferowanego modelu w [Settings](./user-settings.md)). Klient MCP wysyła jedną wiadomość w języku naturalnym (`message`), a silnik wykonuje resztę: budowanie workflow w trybie budowania (zapisywanie, uruchomienie testowe do pięciu razy, naprawianie i weryfikacja), uruchamianie workflow, analitykę, wykonania, status uruchomień na żywo, harmonogramy, tablice i karty, zespoły, zmienne globalne, wyszukiwanie w dokumentacji oraz decyzje z udziałem człowieka (human-in-the-loop). Funkcje dodane do Chat w przyszłości będą dostępne przez to samo narzędzie bez dodatkowej rejestracji. Każde wywołanie jest zapisywane w historii zakładki Chat jako rozmowa oznaczona symbolem wtyczki i zwraca `conversation_id`, który klient może przekazać z powrotem, aby kontynuować wątek.

Zobacz także [Agent Architecture](./agent-architecture.md), [Agent Node](../nodes/agent-node.md) oraz [SSE Streaming](./sse-streaming.md).

<video src="/features/showcase/mcp.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/mcp.webm">▶ Watch MCP demo</a></p>

### [Traces](../tabs/traces-tab.md)

Zakładka Traces wyświetla ślady wykonania [LLM](../nodes/llm-node.md). Nagłówek statystyk nad listą podsumowuje wybrany zakres czasu za pomocą kart KPI (Calls, Tokens, Cost, Avg Latency, Error %) oraz trzech wykresów — Tokens by Model, Cost by Model i Calls Over Time (skumulowane sukcesy względem błędów). Pojedynczy selektor **Time range** (1h / 24h / 7d / 30d / All; domyślnie 7 dni) filtruje jednocześnie wykresy i listę. Koszt jest obliczany na podstawie [LLM Cost Table](../tabs/datatable-tab.md#llm-cost-table-system-table) dla danego użytkownika; modele bez zdefiniowanych cen powodują wyświetlenie ostrzeżenia inline z linkiem do tej tabeli. Otwarcie dowolnego śladu pozwala zobaczyć payloady żądania i odpowiedzi, rozbicie czasowe (llm_ms, tools_ms, mcp_list_ms), wywołania narzędzi (nazwa, argumenty, wynik) oraz uwzględnione umiejętności (skills). Rozwinięte zdarzenia wyświetlają JSON — w tym payloady MCP i JSON-RPC — jako zwijane drzewo z pierwszym poziomem otwartym domyślnie; przełącznik **Tree / Raw** przywraca oryginalny tekst, a nieprawidłowo sformatowany JSON pozostaje czytelny. Ślady służą do debugowania zachowania [Agent Node](../nodes/agent-node.md) i [LLM](../nodes/llm-node.md) oraz do kopiowania i eksportowania payloadów.

Zobacz także [Execution History](./execution-history.md), [Agent Node](../nodes/agent-node.md) oraz [LLM](../nodes/llm-node.md).

<video src="/features/showcase/traces.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/traces.webm">▶ Watch Traces demo</a></p>
### [Alerty](../tabs/alerts-tab.md)

Zakładka Alerty definiuje warunki progowe w oknie czasowym i informuje, gdy zostaną przekroczone. Cztery typy alertów odpowiadają na pytania, które operatorzy faktycznie zadają: **próg błędów** (czy to nie powiodło się więcej niż N razy w oknie), **czas trwania workflow** (czy uruchomienia stały się wolniejsze, mierzone jako maksimum, średnia lub p95), **koszt tokenów / USD** (czy wydatki przekroczyły budżet, rozliczane według tej samej tabeli cen co w [Wykonaniach](../tabs/traces-tab.md)) oraz **liczba wykonań** (czy to uruchamiało się znacznie częściej niż powinno). Każdy typ jest oceniany w wybranym oknie, nigdy na podstawie pojedynczego zdarzenia, ponieważ jedno nieudane uruchomienie to szum, a seria to incydent. Alerty obserwują jeden workflow lub każdy workflow, do którego istnieje dostęp.

Pięcioetapowy kreator prowadzi przez typ, zakres, warunek, reakcję i przegląd. Krok Przegląd najpierw **testuje wstecznie** warunek, raportując, jak często uruchamiałby się w ciągu ostatnich 24 godzin do 7 dni, dzięki czemu próg znacznie zbyt niski zostaje wykryty przed zapisaniem, a nie po tym, jak ktoś otrzyma powiadomienie. Opisz, czego się oczekuje, w prostym języku, a AI wypełni każdy krok, który może, oznaczając swoje przypuszczenia; częściowe żądanie nadal przesuwa kreator do przodu, otwierając go na pierwszym kroku, który wciąż wymaga decyzji, zamiast zmuszać do rozpoczęcia od nowa. Domyślnie alert uruchamia się raz i pozostaje cichy, dopóki metryka się nie poprawi; można zamiast tego ustawić jego powtarzanie w interwale.

W kroku reakcji alert może utworzyć i przypisać nowy workflow do uruchomienia w momencie wyzwolenia, użyć już istniejącego lub nie robić nic. Payload wyzwolenia zawiera zaobserwowaną wartość, próg, okno oraz workflow, które przyczyniły się do tej liczby — w ten sposób alerty trafiają do Slack, e-mail lub Telegram przy użyciu już posiadanych węzłów. Historia wyzwoleń rejestruje, co było prawdą w momencie każdego wyzwolenia alertu, i jest przechowywana przez 90 dni; potwierdzenie wyzwolenia zmienia oznaczenie z Wyzwolony na Potwierdzony, nie udając, że warunek został wyczyszczony. Zakładka [Chat](../tabs/chat-tab.md) może odpowiedzieć, jakie alerty istnieją i dlaczego lub kiedy któryś został wyzwolony. Alerty można udostępniać użytkownikom i [zespołom](../tabs/teams-tab.md).

Zobacz także [Analityka](../tabs/analytics-tab.md), [Wykonania](../tabs/traces-tab.md) oraz [Historia wykonań](./execution-history.md).

### [Analityka](../tabs/analytics-tab.md)

Zakładka Analityka pokazuje metryki i trendy wykonań. Statystyki podsumowujące obejmują łączną liczbę wykonań, współczynnik sukcesu, współczynnik błędów, rozbicie opóźnień oraz łączny **Zaoszczędzony czas** (suma szacowanych minut zaoszczędzonych na uruchomienie dla każdego workflow × jego udane uruchomienia). Najczęściej używane wyświetla tę samą sumę dla każdego workflow. Należy wybrać bazowy zakres czasu (24h, 7d, 30d lub wszystko), opcjonalnie filtrować według workflow, a następnie przeciągnąć po dowolnym wykresie, aby zagłębić się w wybrany zakres dat. Wykresy i tabele workflow odświeżają się do wyboru, a automatyczne odświeżanie utrzymuje metryki na bieżąco. Uzupełnia [Historię wykonań](./execution-history.md) i widok [Harmonogramy](../tabs/scheduled-tab.md), gdy potrzebne są zarówno wyniki z przeszłości, jak i nadchodzące uruchomienia.

Zobacz także [Historia wykonań](./execution-history.md), [Harmonogramy](../tabs/scheduled-tab.md) oraz [Ewaluacja](../tabs/evals-tab.md).

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Watch Analytics demo</a></p>

### [Dashboard](../tabs/dashboard-tab.md)

Zakładka Dashboard to przestrzeń w stylu Grafany, w której buduje się siatki widżetów wykresów, z których każdy jest renderowany z własnego ukrytego workflow Heym. Można utrzymywać dowolną liczbę dashboardów i udostępniać każdy z nich użytkownikom lub zespołom, w trybie tylko do odczytu lub edycji; widżety zawsze działają z danymi logowania właściciela, więc wszyscy widzą te same dane. Opisz metrykę w prostym języku, a AI wygeneruje widżet, albo dodaj go ręcznie i wybierz typ wykresu, wyświetlany w podglądzie z przykładowymi danymi: słupkowy, liniowy, obszarowy, kołowy, tabela, liczbowy, wskaźnik, punktowy, proporcja, wskaźnik słupkowy, tekst lub HITL. HITL to karuzela oczekujących przeglądów wykonywanych przez człowieka. Nagłówek pokazuje `1/n pending`. Nazwa workflow otwiera to uruchomienie na canvas. **Zatwierdź**, **Poproś o zmiany** i **Odrzuć** rozwiązują je, a ikona historii obok tytułu widżetu otwiera to uruchomienie w oknie dialogowym historii na tej samej stronie. Widżety buforują swoje wyniki, można je dostrajać za pomocą AI (każda zmiana jest zapisywana w [Historii edycji](./edit-history.md)), klonować wraz z ich kompletnym workflow, przestawiać za pomocą opcji Uporządkuj oraz przeciągać lub zmieniać rozmiar w trybie edycji. Tabele mogą wyświetlać znaczniki statusu i łączyć wiersze ze szczegółowym panelem, który odczytuje rekord klikniętego wiersza jako `$page.record`, natomiast widżet Run uruchamia workflow z poziomu panelu: na upuszczonym pliku, z polami wejściowymi lub za pomocą przycisku Uruchom. Ponieważ każdy widżet jest workflow, dowolne dane, które można pobrać — wywołanie [HTTP](../nodes/http-node.md), zapytanie [BigQuery](../nodes/bigquery-node.md), wyszukiwanie [RAG](../nodes/rag-node.md) lub wynik [LLM](../nodes/llm-node.md) — mogą stać się wykresem. Ustawienia widżetu HITL mogą ograniczyć go do przeglądów pojedynczego workflowu lub do kroku agenta bądź zatwierdzenia Slack w nim zawartego; taki widżet pokazuje je wszystkim, którzy mogą otworzyć ten workflow, i jest ukryty dla każdego, kto nie ma uprawnień.

Zobacz także [Węzeł wyjścia wykresu](../nodes/chart-output-node.md), [Analityka](../tabs/analytics-tab.md) oraz [Historia wykonań](./execution-history.md).

<video src="/features/showcase/dashboard.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/dashboard.webm">▶ Watch Dashboard demo</a></p>
### [Ewaluacja](../tabs/evals-tab.md)

Zakładka Ewaluacja (pod adresem `/evals`) umożliwia tworzenie zestawów ewaluacyjnych, dodawanie lub generowanie przypadków testowych, optymalizację promptu zestawu oraz uruchamianie ewaluacji względem workflowów [Węzła Agenta](../nodes/agent-node.md). Należy wybrać jeden lub więcej modeli, wybrać metodę oceniania (Exact Match, Contains lub LLM-as-Judge), opcjonalnie pozwolić osobnemu modelowi lub [Modelowi Decyzyjnemu](../nodes/decision-node.md) oceniać odpowiedzi LLM-as-Judge, ustawić liczbę uruchomień na test (oraz temperaturę i reasoning effort dla Exact Match i Contains), a następnie porównać wyniki pass/fail i dane wyjściowe poszczególnych modeli. Można przeglądać historię uruchomień dla poprzednich ewaluacji, w tym informację o tym, jakiego sędziego użyto w każdym uruchomieniu, ponownie uruchomić ewaluację z tym samym sędzią, wyeksportować ją jako JSON oraz zweryfikować bazowe zachowanie w [Wykonaniach](../tabs/traces-tab.md).

Zobacz także [Węzeł Agenta](../nodes/agent-node.md), [Wykonania](../tabs/traces-tab.md) oraz [Historia wykonań](./execution-history.md).

<video src="/features/showcase/evals.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/evals.webm">▶ Watch Evals demo</a></p>

### [Zespoły](../tabs/teams-tab.md)

Zakładka Zespoły umożliwia tworzenie i zarządzanie zespołami. Należy utworzyć zespół, dodać członków za pomocą adresu e-mail oraz usuwać członków (twórca nie może zostać usunięty). Udostępnianie [workflowów](../tabs/workflows-tab.md), [szablonów](../tabs/templates-tab.md), [danych logowania](../tabs/credentials-tab.md), [zmiennych](../tabs/global-variables-tab.md), [magazynów wektorowych](../tabs/vectorstores-tab.md) oraz [plików Drive](../tabs/drive-tab.md) zespołom odbywa się z poziomu odpowiednich okien udostępniania; wszyscy członkowie zespołu uzyskują dostęp. Można edytować nazwę i opis zespołu lub usunąć zespół (usuwa to wszystkie udostępnienia zespołu).

Zobacz także [Zespoły](./teams.md), [Udostępnianie danych logowania](./credentials-sharing.md) oraz [Organizacja workflowów](./workflow-organization.md).

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Watch Teams demo</a></p>

### [Harmonogramy](../tabs/scheduled-tab.md)

Zakładka Harmonogramy wyświetla wszystkie aktywne workflowy [Cron](../nodes/cron-node.md) na wizualnym kalendarzu. Można przełączać się między widokami dnia, tygodnia i miesiąca, aby zobaczyć, kiedy zaplanowano uruchomienie automatyzacji, a następnie powrócić do powiązanego [workflowu](../tabs/workflows-tab.md), gdy zajdzie potrzeba edycji harmonogramu.

Zobacz także [Cron](../nodes/cron-node.md), [Analityka](../tabs/analytics-tab.md) oraz [Historia wykonań](./execution-history.md).

<video src="/features/showcase/scheduled.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/scheduled.webm">▶ Watch Scheduled demo</a></p>

### [Logi](../tabs/logs-tab.md)

Zakładka Logi wyświetla logi kontenerów Docker dla stosu Heym (backend, frontend, PostgreSQL). Należy wybrać kontener(y), filtrować według poziomu logu (All, INFO, WARNING, ERROR, DEBUG) oraz wyszukiwać w logach. Zakładka służy do debugowania i rozwiązywania problemów. W przypadku logów wykonania workflowów (wyniki węzłów, dane wyjściowe) należy korzystać z [Historii wykonań](./execution-history.md), [Wykonań](../tabs/traces-tab.md) lub panelu Debug w edytorze.

Zobacz także [Historia wykonań](./execution-history.md), [Wykonania](../tabs/traces-tab.md) oraz [Funkcje Canvas](./canvas-features.md).

<video src="/features/showcase/logs.mp4" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/logs.mp4">▶ Watch Logs demo</a></p>

### [Tabele danych](../tabs/datatable-tab.md)

Zakładka Tabele danych umożliwia tworzenie i zarządzanie strukturalnymi tabelami danych w obrębie Heym. Należy definiować typowane kolumny (string, number, boolean, date, JSON), zarządzać wierszami za pomocą edycji inline po dwukrotnym kliknięciu, importować/eksportować CSV oraz udostępniać tabele użytkownikom lub [zespołom](./teams.md) z uprawnieniami do odczytu/zapisu. Do programowego dostępu do tabel w workflowach służy [węzeł Tabela danych](../nodes/datatable-node.md). Przypięta sekcja **Tabele systemowe** u góry zawiera **Tabelę kosztów LLM**: widok o stałym schemacie cen poszczególnych modeli, zasilany w tle z Helicone (TTL 24 godziny, ręczne odświeżanie), w którym każdy użytkownik może nadpisać ceny lub dodać własne wiersze dla modeli nieuwzględnionych przez Helicone. Te reguły cenowe zasilają KPI kosztów oraz wykres kosztów poszczególnych modeli w zakładce [Wykonania](../tabs/traces-tab.md).

Zobacz także [węzeł Tabela danych](../nodes/datatable-node.md), [Wykonania](../tabs/traces-tab.md), [Struktura workflowu](./workflow-structure.md) oraz [Zespoły](./teams.md).

<video src="/features/showcase/datatable.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/datatable.webm">▶ Watch DataTable demo</a></p>
### [Dysk](../tabs/drive-tab.md)

Zakładka Dysk wyświetla wszystkie pliki wygenerowane przez umiejętności w ramach Workflow. Prezentuje każdy plik wraz z nazwą, typem, rozmiarem, węzłem źródłowym, datą utworzenia oraz stanem udostępniania w zespole, a także udostępnia funkcje wyszukiwania, uwierzytelnionego pobierania, udostępniania, usuwania i paginacji. Stanowi uzupełnienie pulpitu nawigacyjnego dla [Generowania plików](./file-generation.md), dokumentacji referencyjnej [Dysku](./drive.md) oraz [Węzła Dysk](../nodes/drive-node.md).

Zobacz także [Dysk](./drive.md), [Generowanie plików](./file-generation.md) oraz [Węzeł Dysk](../nodes/drive-node.md).

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Obejrzyj demonstrację Dysku</a></p>

### [Współpraca na canvasie](./canvas-collaboration.md)

Everyone with a workflow open shares one live draft. Edits appear instantly, each person's pointer moves in their color, following mirrors everything they see and do, and you can talk over direct peer-to-peer audio.

See also [Canvas Features](./canvas-features.md), [Edit History](./edit-history.md), and [Keyboard Shortcuts](./keyboard-shortcuts.md).
