# Guardrails

Guardrails umożliwiają blokowanie niebezpiecznych lub niepożądanych wiadomości użytkownika, zanim dotrą one do węzła [LLM](../nodes/llm-node.md) lub [Agent](../nodes/agent-node.md). Gdy wiadomość pasuje do zablokowanej kategorii, węzeł zgłasza błąd zamiast wykonać operację — można go przechwycić za pomocą węzła [Error Handler](../nodes/error-handler-node.md).

## Włączanie Guardrails

Należy otworzyć panel właściwości węzła **LLM** lub **AI Agent** i przewinąć do przełącznika **Enable Guardrails** (ikona tarczy). Zaznaczenie pola powoduje wyświetlenie sekcji konfiguracji.

## Dane logowania i model dla Guardrails

Po włączeniu guardrails **należy** wybrać **dane logowania i model** do weryfikacji bezpieczeństwa treści. Sprawdzenie guardrails korzysta z wybranych danych logowania i modelu z węzła — bez mechanizmu fallback i bez zmiennych środowiskowych. Do niezawodnego filtrowania treści zaleca się użycie danych logowania OpenAI lub Google, szczególnie gdy model główny korzysta z niestandardowego dostawcy (np. Zhipu, GLM), który może nie obsługiwać guardrails lub zwracać błędy API (np. 404).

Workflow nie może zostać uruchomiony, dopóki nie zostaną wybrane zarówno Guardrail Credential, jak i Guardrail Model.

## Blokowane kategorie

Należy wybrać jedną lub więcej kategorii do zablokowania. Wiadomość pasująca do dowolnej zaznaczonej kategorii zostaje odrzucona.

| Kategoria | Co blokuje |
|---|---|
| **Violence** | Treści o charakterze przemocy, gróźb lub fizycznej krzywdy |
| **Hate Speech** | Dyskryminacja, rasizm lub bigoteria |
| **Sexual Content** | Treści lub scenariusze o charakterze jednoznacznie seksualnym |
| **NSFW / Profanity** | Wulgarny język, przekleństwa, jednoznaczne obelgi oraz slang dla dorosłych w dowolnym języku |
| **Self-Harm** | Samobójstwo, samookaleczenie lub treści pokrewne |
| **Harassment** | Ataki osobiste, obraźliwe wypowiedzi, znęcanie się lub zastraszanie |
| **Illegal Activity** | Instrukcje dotyczące popełniania czynów zabronionych |
| **Political Extremism** | Ekstremistyczne treści polityczne lub propaganda o charakterze przemocy |
| **Spam / Phishing** | Spam, phishing lub inżynieria społeczna |
| **Personal Data Request** | Pozyskiwanie prywatnych lub umożliwiających identyfikację informacji |
| **Prompt Injection** | Próby nadpisania instrukcji systemowych, wstrzyknięcia złośliwych promptów lub manipulacji zachowaniem modelu |

## Czułość

Ustawienie **Sensitivity** kontroluje, jak rygorystycznie wykrywane są naruszenia:

| Poziom | Zachowanie |
|---|---|
| **Low** | Oznacza nawet przypadki graniczne lub niejednoznaczne |
| **Medium** *(domyślny)* | Oznacza wyraźne naruszenia; ignoruje przypadki graniczne |
| **High** | Oznacza wyłącznie skrajne, jednoznaczne naruszenia |

## Jak działa wykrywanie

Wykrywanie korzysta z **wybranych danych logowania i modelu guardrails**:

- **Dane logowania OpenAI** — wykorzystuje [OpenAI Moderation API](https://platform.openai.com/docs/guides/moderation) (bezpłatne, szybkie, bez zużycia tokenów) dla pięciu kategorii obsługiwanych natywnie (Violence, Hate Speech, Sexual Content, Self-Harm, Harassment). Pozostałe kategorie są sprawdzane za pomocą wywołania klasyfikacji LLM z użyciem wybranego modelu guardrails.
- **Dane logowania Google / niestandardowe** — wszystkie kategorie są sprawdzane za pomocą wywołania klasyfikacji LLM z użyciem wybranych danych logowania i modelu guardrails.

Gdy model główny korzysta z niestandardowego dostawcy (np. Zhipu, Cerebras), który może zwracać 404 lub inne błędy API, należy wybrać **dane logowania OpenAI lub Google** dla guardrails.

## Format błędu

Gdy guardrail zostanie wyzwolony, węzeł zgłasza błąd o treści:

```
Guardrail violation: message blocked due to prohibited content.
Violated categories: Violence, Hate Speech
```

Pole `output` w wyniku węzła zawiera również `guardrail_violated_categories` (tablicę etykiet naruszonych kategorii), dzięki czemu Debug Panel i Execution History mogą w czytelny sposób wyświetlić „Blocked by: X, Y".

Aby przekierować workflow do gałęzi zapasowej w przypadku zadziałania guardrails, należy użyć opcji **Continue on error** węzła (lub węzła [Error Handler](../nodes/error-handler-node.md)).

## Przykładowy workflow

```
Input → Agent (guardrails: Violence, Illegal Activity, severity: Medium)
          ├── output handle → LLM → Output
          └── error handle  → Error Handler → Set("Sorry, that request was blocked.") → Output
```

## Uwagi

- **Brak ponownych prób**: naruszenia guardrails są celowymi blokadami i nigdy nie są ponawiane, nawet jeśli węzeł ma włączoną opcję „Retry on failure".
- Migracja bazy danych nie jest wymagana — ustawienia guardrails są przechowywane w JSON węzła workflow wraz z pozostałymi danymi węzła.
- Guardrails sprawdzają rozwiązaną **wiadomość użytkownika** (po ewaluacji wyrażeń szablonu), a nie surowy szablon.
- Ustawienie **braku kategorii** przy włączonych guardrails jest równoznaczne z ich wyłączeniem — żadne sprawdzenie nie jest wykonywane.
- Przy poziomie **Low** klasyfikacja LLM jest zawsze uruchamiana (najlepsze pokrycie wielojęzyczne). Dane logowania OpenAI dodatkowo uruchamiają Moderation API.
- Przy poziomie **Medium/High** dane logowania OpenAI korzystają z Moderation API dla kategorii obsługiwanych natywnie oraz z klasyfikacji LLM dla pozostałych. Dane logowania Google/niestandardowe zawsze korzystają z klasyfikacji LLM.
- Klasyfikacja LLM jest **niezależna od języka** — wykrywa naruszenia w języku tureckim, arabskim, rosyjskim, hiszpańskim i innych.
