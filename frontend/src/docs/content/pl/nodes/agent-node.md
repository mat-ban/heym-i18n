# Węzeł Agenta

Węzeł **AI Agent** to węzeł LLM z wywoływaniem narzędzi. Może uruchamiać narzędzia Python, wywoływać połączone węzły canvas jako narzędzia, łączyć się z serwerami MCP, korzystać ze skills, opcjonalnie działać jako orchestrator delegujący zadania do innych węzłów agenta, wywoływać inne workflows jako narzędzia oraz zatrzymywać się w celu [przeglądu przez człowieka](../reference/human-in-the-loop.md).

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1, plus opcjonalne `review`, gdy HITL jest włączone |
| Wyjście | `$nodeLabel.text`, `$nodeLabel.fieldName` (gdy włączone wyjście JSON) lub oczekujący payload HITL podczas oczekiwania na przegląd |

## Parametry podstawowe

### Dane logowania i model

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania LLM (klucz API) z Ustawień |
| `model` | string | Nazwa modelu (np. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (opcjonalnie) | Dane logowania zapasowe, gdy podstawowe zawiodą |
| `fallbackModel` | string (opcjonalnie) | Model zapasowy, gdy podstawowy zawiedzie |

Dane logowania należy dodać w zakładce [Dane logowania](../tabs/credentials-tab.md). Lista modeli jest ładowana z wybranych danych logowania. Jeśli podstawowe dane logowania lub model zwrócą błąd, węzeł automatycznie ponawia próbę z zapasowymi danymi logowania i modelem, zanim zgłosi błąd.

### Prompty

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt systemowy dla AI. Obsługuje [wyrażenia](../reference/expression-dsl.md). |
| `userMessage` | string | Wiadomość/prompt użytkownika. Domyślnie: `$input.text` |
| `jsonOutputEnabled` | boolean | Ustrukturyzowane wyjście JSON |
| `jsonOutputSchema` | string | JSON Schema dla ustrukturyzowanego wyjścia |
| `extraBodyEnabled` | boolean | Wysyłanie parametrów żądania specyficznych dla dostawcy (domyślnie: `false`) |
| `extraBody` | string | Obiekt JSON dołączany do każdego żądania API wykonywanego przez agenta |

Należy używać `$input.text`, `$nodeName.field` oraz innej składni [Expression DSL](../reference/expression-dsl.md).

### Modele rozumujące (o1, o3)

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (domyślnie: 0.7), dla modeli standardowych |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Głębokość rozumowania dla modeli rozumujących |

W przypadku korzystania z modelu rozumującego (np. o1, o3) interfejs wyświetla **Reasoning Effort** zamiast Temperature. Dla modeli standardowych **Temperature** kontroluje kreatywność.

**Przykład wyjścia JSON:** Gdy wymagane są ustrukturyzowane dane od agenta (np. klasyfikacja, ekstrakcja), należy włączyć wyjście JSON i podać schemat. Agent zwraca JSON zgodny ze schematem; dostęp do pól odbywa się po nazwie na wyjściu węzła:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Węzły następne mogą używać `$agentLabel.status`, `$agentLabel.reason` itd. Zachowanie identyczne jak w przypadku wyjścia JSON [węzła LLM](../nodes/llm-node.md).

## Przegląd przez człowieka (HITL)

HITL należy stosować, gdy agent może wymagać zatwierdzenia w określonych momentach przed wykonaniem istotnych działań.

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Dodaje punkty kontrolne przeglądu przez człowieka do agenta |
| `hitlSummary` | string | Wytyczne zatwierdzania informujące agenta, kiedy wymagany jest przegląd przez człowieka |

Gdy HITL jest włączone, agent otrzymuje narzędzie `request_human_review`. Należy użyć promptu systemowego oraz tego pola wytycznych, aby wyjaśnić, które wywołania narzędzi, sub-agentów, sub-workflows, akcje MCP, skills lub efekty uboczne wymagają zatwierdzenia. Agent może wywołać to narzędzie tylko wtedy, gdy jest to konieczne, w tym wielokrotnie w ramach jednego uruchomienia.

Podsumowanie widoczne dla recenzenta na publicznej stronie jest generowane na podstawie żądania przeglądu agenta w czasie wykonania. Jeśli agent nie poda podsumowania w sposób jawny, Heym wyprowadza je z treści przeglądu w formacie Markdown.

W przypadku narzędzi MCP Heym prosi model o zinterpretowanie pisemnych instrukcji HITL jako jednego z trzech zakresów: `always`, `once` lub `never`. Oznacza to, że sformułowania swobodne, takie jak „for each call", „only one time" lub „never ask", są normalizowane przed zastosowaniem bramkowania w czasie wykonania.

Każdy punkt kontrolny HITL tworzy jednorazowy publiczny link do przeglądu pod adresem `/review/{token}`. Recenzent może:

- **Accept** — zaakceptować oryginalną treść przeglądu w formacie Markdown
- **Edit & Continue** — kontynuować ze zmodyfikowanym Markdown
- **Refuse** — odmówić i kontynuować z `text: ""`

Gdy HITL jest włączone, węzeł udostępnia również uchwyt wyjściowy `review` na canvas. Należy połączyć tę gałąź z węzłami Slack, e-mail lub innymi węzłami powiadomień, aby rozgłaszać adres URL przeglądu i podsumowanie natychmiast po zatrzymaniu uruchomienia.

Wykonanie przechodzi w stan `pending` do momentu odpowiedzi recenzenta. Treść przeglądu to pojedyncze ciało w formacie Markdown, a oczekujący payload zawiera również tekst linku do udostępnienia w celu przekazania na zewnątrz. Węzły na gałęzi `review` uruchamiają się natychmiast po utworzeniu pauzy; normalna ścieżka wyjściowa jest kontynuowana dopiero po zatwierdzeniu. Po zatwierdzeniu Heym wznawia działanie z zapisanego snapshotu wykonania, a agent kontynuuje z zatwierdzonym kontekstem. Jeśli późniejszy krok również wymaga zatwierdzenia, agent może utworzyć kolejny punkt kontrolny HITL. Kształt payload, zachowanie adresu URL przeglądu oraz semantykę wznowienia opisano w sekcji [Human-in-the-Loop](../reference/human-in-the-loop.md).

HITL jest dostępne wyłącznie dla wyjścia agenta w trybie tekstowym. W wersji v1 nie można go łączyć z `jsonOutputEnabled`.
## Tryb Orchestratora

Po włączeniu agent może delegować zadania do innych węzłów agenta w workflow. Jeśli **tryb Orchestratora jest wyłączony**, agent **nie może tworzyć połączeń agent→agent** na canvasie.

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Gdy `true`, agent otrzymuje narzędzie `call_sub_agent` |
| `subAgentLabels` | string[] | Etykiety węzłów agenta, które ten orchestrator może wywoływać |

**Sub-agenci** muszą używać `$input.text` w swoim User Message, aby otrzymać prompt orchestratora.

Gdy orchestrator wywołuje wielu sub-agentów w jednej turze, wykonują się oni równolegle. Szczegóły w sekcji [Agent Architecture](../reference/agent-architecture.md).

## Sub-Workflows

Po skonfigurowaniu agent otrzymuje narzędzie `call_sub_workflow` do wykonywania innych workflow.

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | ID workflow, które ten agent może wywoływać jako narzędzia |

Workflow należy wybrać w sekcji Sub-Workflows w konfiguracji agenta. Agent będzie je wywoływać z parametrami `workflow_id` oraz `inputs` (obiekt zgodny z polami wejściowymi docelowego workflow). Maksymalna głębokość: 5 zagnieżdżonych wywołań sub-workflow.

## Narzędzia węzłów canvas

Obsługiwany węzeł workflow można podłączyć do uchwytu **tools** agenta, aby agent mógł wywołać ten węzeł w czasie działania. Dzięki temu istniejące akcje i transformacje z canvasu stają się wywoływalnymi narzędziami bez pisania kodu w Pythonie.

Narzędzia węzłów canvas stosuje się, gdy agent ma decydować o momencie uruchomienia skonfigurowanego węzła, przy zachowaniu danych logowania, pól statycznych i ustawień specyficznych dla workflow w interfejsie węzła.

### Pola dostarczane przez agenta

Pola w podłączonym węźle narzędziowym można oznaczyć ikoną bota. Oznaczone pola stają się wymaganymi parametrami narzędzia, które agent musi podać przy wywołaniu węzła. Pola nieoznaczone pozostają stałe i są odczytywane z konfiguracji węzła.

Na przykład:

- Podłącz węzeł Slack do agenta jako narzędzie
- Pozostaw dane logowania na stałe w węźle Slack
- Oznacz `message` jako pole dostarczane przez agenta
- Agent otrzymuje narzędzie Slack, w którym w czasie działania podaje wyłącznie treść wiadomości

Jeśli węzeł nie jest podłączony do agenta jako narzędzie, ikona bota jest ukryta, a węzeł działa jak zwykły krok workflow.

### Zachowanie w czasie działania

Gdy agent wywołuje narzędzie węzła canvas, Heym tymczasowo scala argumenty dostarczone przez agenta z danymi tego węzła, wykonuje węzeł, zwraca jego wynik do agenta, a następnie przywraca pierwotną konfigurację węzła. Węzły narzędziowe nie są uruchamiane jako zwykłe kroki workflow w ramach normalnego harmonogramu; działają wyłącznie wtedy, gdy agent je wywoła.

Narzędzia węzłów canvas są przydatne w połączeniu z węzłami integracyjnymi, takimi jak Slack, Telegram, HTTP, Send Email, oraz węzłami przekształcającymi dane, takimi jak [Set](./set-node.md). Węzły trigger, węzły sterowania przepływem oraz terminalowe mappery wyjścia ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) nie mogą być używane jako narzędzia agenta.

## Narzędzia Python

Definiowanie niestandardowych narzędzi, które agent może wywoływać. Każde narzędzie zawiera:

| Pole | Typ | Opis |
|-------|------|-------------|
| `name` | string | Nazwa narzędzia (np. `count_characters`) |
| `description` | string | Opis dla LLM |
| `parameters` | JSON Schema | Schemat OpenAI function-calling (format obiektowy) |
| `code` | string | Kod funkcji Python |

**Parameters** musi być obiektem JSON, a nie ciągiem znaków:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Przykładowe narzędzie:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Narzędzia Python domyślnie działają jako niezaufany kod w zahartowanym, izolowanym kontenerze Docker (brak sieci, brak gniazda Docker, system plików tylko do odczytu, użytkownik inny niż root). Importy są ograniczone do listy dozwolonych, bezpiecznych modułów biblioteki standardowej. Konfiguracja (`HEYM_PYTHON_TOOL_SANDBOX`) opisana jest w sekcji [Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox).

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Maksymalna liczba sekund na wykonanie narzędzia (domyślnie: 30) |
| `requestTimeoutSeconds` | number | Maksymalna liczba sekund oczekiwania na każdą odpowiedź modelu przed przekroczeniem limitu czasu (domyślnie: 60). Należy zwiększyć dla wolnych lub samodzielnie hostowanych dostawców (LiteLLM, vLLM, modele lokalne) oraz długich, wieloetapowych przebiegów. |
## Połączenia MCP

Połącz się z serwerami [Model Context Protocol](https://modelcontextprotocol.io/), aby udostępnić ich narzędzia agentowi.

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Typ połączenia |
| `timeoutSeconds` | number | Limit czasu dla tego połączenia (domyślnie: 30) |
| `label` | string | Opcjonalna nazwa wyświetlana |

**stdio** (proces lokalny):

| Pole | Opis |
|-------|-------------|
| `command` | Polecenie do uruchomienia (np. `npx`) |
| `args` | Tablica JSON (np. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | Obiekt JSON ze zmiennymi środowiskowymi wstrzykiwanymi do procesu (np. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

Większość serwerów stdio korzystających z kluczy API uwierzytelnia się za pomocą zmiennych środowiskowych, a nie argumentów polecenia. Należy ustawić `env` dla każdego połączenia, aby każdy węzeł agenta mógł używać innych danych logowania bez modyfikowania środowiska hosta.

Wartości `env` obsługują [Expression DSL](../reference/expression-dsl.md), dzięki czemu można przekazywać dane wejściowe workflow jako dane logowania zamiast zakodować sekrety na stałe:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Wyrażenie `$userInput.pat` jest rozwiązywane w czasie wykonywania na podstawie danych wejściowych workflow, zanim proces MCP zostanie uruchomiony. Pozwala to przyjmować tokeny z triggera lub węzła wejściowego zamiast osadzać je w definicji workflow.

Przykład — GitHub MCP z zakodowanym na stałe tokenem:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Przykład — GitHub MCP z dynamicznym tokenem z danych wejściowych workflow:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Przykład — GitHub MCP z danymi logowania GitHub w Heym:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Wbudowane dane logowania GitHub obsługują obecnie uwierzytelnianie oparte na PAT. W przypadku potrzeby dostępu do organizacji należy użyć PAT z wymaganymi uprawnieniami do organizacji/repozytorium.

Przykład — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (serwer zdalny):

| Pole | Opis |
|-------|-------------|
| `url` | Adres URL endpointu SSE. Obsługuje wyrażenia (np. `$userInput.serverUrl`). |
| `headers` | Obiekt JSON dla nagłówków uwierzytelniających/niestandardowych. Wartości obsługują wyrażenia. |

**Streamable HTTP** (serwer zdalny):

| Pole | Opis |
|-------|-------------|
| `url` | Adres URL endpointu MCP (np. `https://example.com/mcp`). Obsługuje wyrażenia. |
| `headers` | Obiekt JSON dla nagłówków uwierzytelniających/niestandardowych. Wartości obsługują wyrażenia. |

## Skills

Skills to instrukcje SKILL.md oraz opcjonalne pliki Python i dołączone zasoby. Rozszerzają kontekst systemowy agenta i mogą dodawać narzędzia Python.

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `name` | string | Nazwa skilla |
| `content` | string | Zawartość SKILL.md (instrukcje) |
| `timeoutSeconds` | number | Limit czasu wykonywania kodu Python skilla (domyślnie: 30) |
| `driveFilesEnabled` | boolean | Włącza pomocnika `heym_drive` w czasie wykonywania dla tego skilla (domyślnie: false) |
| `files` | array | Opcjonalne wpisy `{ path, content, encoding, mimeType }` (np. skrypty `.py` lub zasoby binarne przechowywane jako base64) |

Skills można dodawać, przeciągając plik `.zip` lub `.md` na obszar Skills.
Po rozwinięciu karty skilla można przeciągnąć dowolny plik na tego skilla, aby dołączyć lub zastąpić dołączony plik, w tym zasoby binarne, takie jak pliki PDF i obrazy.
Przycisk pobierania na karcie skilla służy do wyeksportowania tego skilla jako archiwum `.zip` w celu wykonania kopii zapasowej lub ponownego użycia w innym workflow.

Opcję **Drive files** należy włączyć dla skilla tylko wtedy, gdy jego kod Python wymaga odczytu plików z Heym Drive. Włączone skills otrzymują wygenerowanego pomocnika `heym_drive.py` w czasie wykonywania i mogą wywoływać `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` lub `read_drive_base64` z identyfikatorem pliku Drive lub dokładną nazwą pliku. Wyszukiwanie po nazwie pliku używa najnowszego dostępnego dopasowania. Wyłączone skills nie otrzymują tego pomocnika.

Każda karta skilla ma cztery akcje w wierszu poniżej tytułu:

| Przycisk | Opis |
|--------|-------------|
| **Edit with AI** | Otwiera Skill Builder, aby zmodyfikować skilla na podstawie promptu w Chat |
| **Download** | Eksportuje skilla jako archiwum `.zip` |
| **Remove** | Usuwa skilla z tego węzła agenta |
| **History** | Otwiera historię skilla pochodzącą z [Edit History](../reference/edit-history.md) |
### Historia umiejętności

Historia umiejętności **nie** jest przechowywana osobno. Jest wyprowadzana z migawek Historii edycji workflow: każda zapisana wersja workflow zawiera pełną tablicę `skills` węzła agenta.

W oknie Historia dostępne są następujące działania:

- **Podgląd** — wyświetlenie minionej migawki (SKILL.md oraz lista plików)
- **Edytuj** — wczytanie migawki do edytora umiejętności bez przywracania całego workflow
- **Dostrajanie AI** — otwarcie Skill Builder z tą migawką jako punktem wyjścia
- **Przywróć** — przywrócenie wyłącznie tej umiejętności z minionej wersji (pozostałe węzły pozostają bez zmian)

Historia podlega temu samemu 7-dniowemu okresowi przechowywania co Historia edycji workflow. Zapisanie workflow po edycji umiejętności tworzy nowe wpisy historii.

Sekcja Umiejętności obejmuje również funkcję **Budowanie AI**:

- Kliknięcie **Budowanie AI** tworzy nową umiejętność na podstawie promptu w oknie czatu
- Kliknięcie przycisku iskry przy istniejącej umiejętności pozwala zmodyfikować ją za pomocą AI
- Upuszczenie plików do kompozytora promptu dołącza je do komentarza dostrajania; pliki te są również zapisywane jako dołączone zasoby umiejętności
- Okno modalne strumieniuje tekst asystenta, wyświetlając jednocześnie podgląd plików `SKILL.md` i `.py` na żywo
- **Pobierz ZIP** eksportuje bieżący podgląd bez dodawania go do węzła
- **Zapisz i dodaj** zapisuje wygenerowane pliki z powrotem przez ten sam proces analizy ZIP, który jest używany przy ręcznym przesyłaniu

Podczas edycji z użyciem AI Heym wysyła do buildera wyłącznie tekstowe pliki umiejętności `.md` i `.py`. Załączniki binarne i inne nieedytowalne są zachowywane i udostępniane builderowi jako metadane ścieżek, dzięki czemu generowany kod Python może zachować poprawne odwołania względne do plików.
Należy wybrać załączony plik w prawym panelu i włączyć opcję **Uwzględnij ten plik w kontekście AI**, gdy AI musi przeanalizować dołączony szablon. Pliki tekstowe, PDF i DOCX są wyodrębniane do kontekstu promptu, gdy jest to możliwe; Heym nie stosuje odrębnego limitu rozmiaru załączników Skill Builder poza limitem treści żądania platformy.

## Dodatkowa treść żądania

Niektórzy dostawcy akceptują parametry żądania, których standardowe pola zgodne z OpenAI nie obejmują, na przykład wyłączanie trybu myślenia modelu. Należy zaznaczyć opcję **Wysyłaj dodatkową treść żądania** we właściwościach węzła i wprowadzić obiekt JSON.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Domyślnie wyłączone.** Przy odznaczonym polu wyboru nic dodatkowego nie jest wysyłane.
- Stosowane do **każdego** żądania w pętli wywołań narzędzi, nie tylko do pierwszej tury, a także do próby z modelem zapasowym. Nie jest stosowane do kontroli guardrails, które korzystają z odrębnego modelu.
- Musi być **obiektem** JSON. Tablica, wartość skalarna lub nieprawidłowy tekst powodują błąd węzła `Invalid extra body JSON`, zamiast cichego pominięcia.
- Wyrażenia `$` są rozwiązywane przed analizą składniową. Ponieważ jest to podstawienie tekstowe, rozwiązana wartość zawierająca cudzysłów lub znak nowej linii tworzy nieprawidłowy JSON i powoduje błąd węzła.

To samo pole i to samo zachowanie co dodatkowa treść żądania w [węźle LLM](./llm-node.md).

## Guardrails

Należy włączyć opcję **Guardrails** we właściwościach węzła, aby blokować niebezpieczne wiadomości użytkownika przed uruchomieniem agenta. Pełne informacje znajdują się w dokumentacji [Guardrails](../reference/guardrails.md).

## Pamięć trwała (graf)

Opcjonalny graf wiedzy **na węzeł agenta** przechowywany w bazie danych. Po włączeniu Heym dołącza podsumowanie zapamiętanych encji i relacji w formacie Markdown do **instrukcji systemowej** przed każdym uruchomieniem (tylko jeśli graf nie jest pusty). Po **pomyślnym** zakończeniu pracy agenta zadanie w tle wyodrębnia nowe trwałe fakty z rozmowy i scala je z grafem.

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Włączenie wczytywania i wyodrębniania w tle dla tego węzła canvas |

**Podagenci** zachowują **własny** graf (kluczowany według identyfikatora ich węzła), odrębny od orkiestratora.

Aby otworzyć edytor grafu oraz opcjonalne **współdzielenie pamięci** (inne workflow/agenci), należy użyć różowej kontrolki **mózgu** na węźle (gdy pamięć jest włączona lub wiersz modelu jest widoczny). Pełne zachowanie, ścieżki REST i szczegóły eksportu JSON: [Pamięć trwała agenta](../reference/agent-persistent-memory.md).

## Responses API i ciągłość rozumowania

Pole wyboru **Użyj Responses API** kieruje wywołania modelu przez agenta za pośrednictwem [Responses API](https://platform.openai.com/docs/api-reference/responses) zamiast Chat Completions. Jest domyślnie wyłączone.

Ma to największe znaczenie w przypadku modelu rozumującego, takiego jak `gpt-5` lub serii `o`. Responses API zwraca rozumowanie modelu wraz z każdym wywołaniem narzędzia, a agent przekazuje te elementy rozumowania z powrotem w następnej turze, dzięki czemu model zachowuje łańcuch myślowy przez wieloetapową pętlę narzędzi, zamiast wyprowadzać go od nowa po każdym wyniku narzędzia. Cała pętla działa na tej samej ścieżce, obejmując [przegląd człowieka](#human-review-hitl) — pauzę i wznowienie, [kompresję kontekstu](#context-compression) oraz odpowiedź końcową.

Sama rozmowa pozostaje w Heym. Heym wysyła pełne dane wejściowe w każdej turze i przenosi rozumowanie jako zaszyfrowany blob, więc nic nie jest przechowywane po stronie dostawcy między wywołaniami. Elementy rozumowania w obrębie zakresu, który podsumowuje kompresja kontekstu, są usuwane wraz z nim, ponieważ zaszyfrowanego bloba nie można podsumować.

Działa z danymi logowania OpenAI oraz z niestandardowymi danymi logowania, których brama obsługuje ten endpoint. W przypadku danych logowania Google pozostaje wyłączone.
## Kompresja kontekstu

Gdy agent wykonuje wiele iteracji narzędzi z dużymi wynikami (web scraping, odczyt dokumentów, wyniki pod-workflow), narosła historia wiadomości może zbliżyć się do limitu okna kontekstowego modelu. Heym automatycznie kompresuje historię konwersacji w trakcie wykonania, aby zapobiec przepełnieniu kontekstu.

**Jak to działa:**

1. Przed każdą iteracją narzędzia Heym szacuje bieżącą liczbę tokenów (~4 znaki na token).
2. Jeśli szacowana wartość przekracza **80%** okna kontekstowego modelu, uruchamiana jest kompresja.
3. Historia wiadomości zostaje podzielona na sekcje zachowane i skompresowane:
   - **Zachowane**: prompt systemowy, pierwsza wiadomość użytkownika, najnowsza wiadomość użytkownika
   - **Skompresowane**: wszystko pomiędzy (tury rozumowania asystenta, wywołania narzędzi, wyniki narzędzi)
4. Sekcja środkowa jest podsumowywana przy użyciu **tego samego modelu i danych logowania** — nie jest wymagana dodatkowa konfiguracja.
5. Skompresowane podsumowanie zastępuje sekcję środkową jako pojedyncza wiadomość asystenta.

**Obserwowalność:**

Zdarzenia kompresji pojawiają się jako wpisy `Context compressed (N messages → summary)` w:
- Liście wywołań narzędzi w **panelu Debug** podczas wykonywania na żywo
- Widoku szczegółów wykonania w **Historii wykonań**
- Zakładce **Traces** jako wpis trace `context.compression`

Kompresja jest automatyczna i zawsze aktywna dla węzłów Agent. **Nie** ma zastosowania do węzłów LLM, zakładki Chat ani sesji AI Assistant.

## Powiązane

- [Dlaczego Heym](../getting-started/why-heym.md) – Jak agenci działają i pozostają pod kontrolą w środowisku produkcyjnym
- [Pamięć trwała agenta](../reference/agent-persistent-memory.md) – Graf wiedzy dla każdego węzła agenta, opcjonalne udostępnianie, API, edytor
- [Architektura agenta](../reference/agent-architecture.md) – Pod-agenci, orkiestrator, umiejętności, MCP, wywoływanie narzędzi
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Publiczne strony przeglądu, oczekujące wykonania, przepływ zatwierdzania/edycji/odrzucenia
- [Guardrails](../reference/guardrails.md) – Blokowanie niebezpiecznych kategorii treści
- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [AI Assistant](../reference/ai-assistant.md) – Interfejs Chat do budowania workflow w języku naturalnym (odrębny od węzła Agent)
- [Expression DSL](../reference/expression-dsl.md) – Odwoływanie się do danych w promptach
- [Struktura workflow](../reference/workflow-structure.md) – Węzły, krawędzie i format DSL
- [Szybki start](../getting-started/quick-start.md) – Podstawowy workflow z LLM i wyrażeniami
- [Zakładka Dane logowania](../tabs/credentials-tab.md) – Dodawanie kluczy API dla agenta
- [Zakładka MCP](../tabs/mcp-tab.md) – Konfiguracja MCP dla narzędzi workflow
