# Decision

Węzeł **Decision** zadaje modelowi decyzyjnemu pytania o bieżący stan wykonania i zwraca prawdopodobieństwa. Nie generuje tekstu. Należy po niego sięgnąć, gdy workflow wymaga oceny, na podstawie której można rozgałęzić dalsze kroki — routing, triage, ranking, weryfikacja lub warunkowanie kroku, którego nie można cofnąć.

Modele decyzyjne (nazywane również modelami *System One*) to inny rodzaj modelu niż LLM. Nie ma tu promptu, instrukcji systemowej, temperatury ani wywoływania narzędzi. Wysyła się **stan** oraz mapę **pytań**, a każda odpowiedź wraca jako liczba z rozkładem prawdopodobieństwa. Ponieważ odpowiedź to zaledwie kilka tokenów, modele te są szybkie i tanie w porównaniu z proszeniem [LLM](./llm-node.md) o wygenerowanie JSON i parsowaniem go.

Do generowania tekstu należy użyć węzła [LLM](./llm-node.md). Do modelu, który wywołuje narzędzia, należy użyć [Węzła Agent](./agent-node.md).

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | Odpowiedź dostawcy w postaci dosłownej — `$nodeLabel.answers.<id>`, `$nodeLabel.model`, `$nodeLabel.usage` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | Dane logowania *Decision Model*. Nie dane logowania LLM. |
| `model` | string | Nazwa modelu, na przykład `jev-latest` |
| `state` | expression | Co model powinien odczytać (domyślnie `$input.text`) |
| `questions` | array | Uporządkowane wiersze pytań; co najmniej jedno |
| `customBodyEnabled` | boolean | Wysłanie ręcznie napisanego ciała żądania zamiast formularza |
| `customBody` | expression (JSON) | Ciało żądania do wysłania, gdy przełącznik jest włączony |
| `requestTimeoutSeconds` | number | Maksymalny czas oczekiwania w sekundach (domyślnie: 60) |

### Stan

**Stan** to sytuacja, którą ocenia model. Przyjmuje ciąg znaków, obiekt lub tablicę.

Pole zawierające dokładnie jedno wyrażenie zachowuje swój własny typ, więc `$input` wysyła sam obiekt, a nie jego tekst. Szablon z wyrażeniem w środku (`Ticket: $input.text`) rozwiązuje się do ciągu znaków. Każde pytanie należy zaopatrzyć w wystarczającą ilość informacji: tekst źródłowy, tożsamości, relacje, zasady i bieżące fakty.

## Typy pytań

Każde pytanie ma `id`, `type`, `instructions` oraz kryteria zależne od typu.

`id` służy do odczytania odpowiedzi w workflow. **Nigdy nie jest wysyłane do modelu**, więc całe znaczenie musi zawierać się w `instructions`. Zapis `id: is_urgent` z `instructions: "Is it?"` nie daje modelowi żadnych wskazówek.

### Noul

Czy dany warunek zachodzi. Zwraca prawdopodobieństwo, że odpowiedź brzmi „tak”, od 0 do 1.

Kryteria są opcjonalne: **Yes means** i **No means** opisują, co obejmuje każda ze stron. Wartość bliska 0,5 oznacza, że model uznaje „tak” i „nie” za równie prawdopodobne — a nie „średnie natężenie”.

```json
{
  "id": "is_urgent",
  "type": "noul",
  "instructions": "Does this message convey urgency?",
  "criteriaTrue": "Explicitly time-sensitive or blocking work",
  "criteriaFalse": "No urgency expressed"
}
```

Odczyt za pomocą `$triage.answers.is_urgent.noul`.

### Choice

Wybiera jedną opcję ze zdefiniowanego zestawu. Zwraca wybraną opcję, pełny rozkład oraz wyprowadzoną z niego pewność.

Należy dodać opcję obejmującą „żadna z powyższych”, gdy nic nie pasuje — model nie może wybrać opcji, której nie zaproponowano.

```json
{
  "id": "department",
  "type": "choice",
  "instructions": "Which team should handle this request?",
  "options": [
    { "key": "billing", "description": "Payments, invoicing, refunds" },
    { "key": "technical", "description": "Bugs, outages, integrations" },
    { "key": "other", "description": "Nothing above fits" }
  ]
}
```

Odczyt za pomocą `$triage.answers.department.choice`, `.probabilities.billing` oraz `.confidence`.

### Score

Ocenia stan według uporządkowanej skali. Zwraca wartość ważoną prawdopodobieństwem, która może znaleźć się **pomiędzy** poziomami, wraz z legendą i rozkładem.

Poziomy podaje się od najniższego, co najmniej dwa i maksymalnie dziesięć. Każdy poziom powinien opisywać konkretną sytuację i być zrozumiały samodzielnie.

```json
{
  "id": "frustration",
  "type": "score",
  "instructions": "How frustrated is the customer?",
  "levels": ["Calm", "Frustrated", "Very angry"]
}
```

Odczyt za pomocą `$triage.answers.frustration.score`, `.legend` oraz `.confidence`.

## Generate with AI

**Generate with AI** zamienia zwykłe zdanie na proponowany szablon stanu oraz zestaw wierszy pytań. Należy opisać, co ma być oceniane — „triage an incoming support ticket: how urgent it is, which team owns it, and how frustrated the customer sounds” — i przejrzeć wynik przed dodaniem go do węzła.

Szkicowanie wykonuje LLM, więc okno dialogowe wymaga danych logowania LLM. Model decyzyjny odpowiada na pytania później, podczas wykonania workflow. Wygenerowane identyfikatory są deduplikowane względem wierszy już obecnych w węźle, więc dwukrotne wygenerowanie nigdy nie nadpisze istniejącego klucza odpowiedzi.

Każde wygenerowanie jest rejestrowane w zakładce [Traces](../tabs/traces-tab.md) w źródle **Decision Questions**, obok śladów `decision.systemone` zapisywanych przez sam węzeł w czasie wykonania.
## Niestandardowa treść żądania

Włącz **Niestandardowa treść żądania**, aby wysyłać własnoręcznie napisany JSON zamiast formularza. Należy użyć tej opcji dla endpointu, którego kontrakt różni się od tego, który buduje formularz.

Edytor jest wstępnie wypełniany na podstawie bieżącego formularza, a wyrażenia w nim zawarte są rozwiązywane przed wysłaniem żądania. Gdy przełącznik jest włączony, pole State oraz wiersze pytań są ignorowane. Odpowiedź jest przekazywana w niezmienionej formie w obu przypadkach, więc inny kontrakt po prostu tworzy inny kształt danych do odczytu przez wyrażenia.

## Dane wyjściowe

Węzeł zwraca dokładnie to, co zwrócił dostawca. Nic nie jest zmieniane ani spłaszczane.

```json
{
  "model": "jev-1.13.0",
  "answers": {
    "is_urgent": { "type": "noul", "noul": 0.95 },
    "department": {
      "type": "choice",
      "choice": "billing",
      "probabilities": { "billing": 0.88, "technical": 0.12, "other": 0.0 },
      "confidence": 0.81
    },
    "frustration": {
      "type": "score",
      "score": 1.05,
      "legend": { "0": "Calm", "1": "Frustrated", "2": "Very angry" },
      "probabilities": { "0": 0.0, "1": 0.95, "2": 0.05 },
      "confidence": 0.92
    }
  },
  "usage": { "input_tokens": 296, "output_tokens": 20 }
}
```

## Rozgałęzianie na podstawie odpowiedzi

Węzeł [Switch](./switch-node.md) kieruje przepływ na podstawie wybranej opcji, a węzeł [Condition](./condition-node.md) może przekazywać przypadki o niskiej pewności w miejsce, gdzie zobaczy je człowiek:

```
Input → Decision (triage) → Condition ($triage.answers.department.confidence > 0.7)
                              ├─ true  → Switch on $triage.answers.department.choice
                              └─ false → Send Email (human review)
```

Odpowiedź z typem gwarantuje kształt, nie prawdziwość. Progi należy dobierać na podstawie własnych danych i konsekwencji, a nie kopiować liczby z przykładu.

## Dane logowania

Należy utworzyć dane logowania typu **Decision Model** w zakładce [Dane logowania](../tabs/credentials-tab.md) z następującymi polami:

- **Base URL** — endpoint, na przykład `https://api.typesafe.ai`. Heym dopisuje `/v1/systemone`.
- **API Key** — opcjonalny. Endpointy, które nie wymagają klucza, można pozostawić puste.

Podczas edycji danych logowania zapisany klucz jest zachowywany, gdy pole klucza pozostanie puste; należy wpisać go ponownie wyłącznie w celu zastąpienia.

Te same dane logowania mogą oceniać uruchomienia [Ewaluacji](../tabs/evals-tab.md): po wybraniu **LLM-as-Judge** należy wskazać je jako sędziego, a model decyzyjny oceni każdą odpowiedź względem oczekiwanego wyniku.

Heym domyślnie blokuje wychodzące żądania do adresów prywatnych i loopback, więc endpoint decyzyjny uruchamiany samodzielnie na `localhost` lub w zakresie prywatnym wymaga ustawienia `HEYM_HTTP_ALLOW_PRIVATE_URLS=true`.

Modele decyzyjne nie pojawiają się w tabelach cenowych LLM synchronizowanych przez Heym, więc kolumna **Cost** w zakładce [Wykonania](../tabs/traces-tab.md) pozostaje pusta dla tych wywołań. Liczby tokenów są nadal rejestrowane, a własną cenę można dodać poprzez nadpisanie ceny.

## Błędy

| Sytuacja | Co się dzieje |
|-----------|--------------|
| Nieprawidłowy klucz API | Węzeł kończy się błędem z komunikatem wskazującym dane logowania |
| Nieprawidłowo sformułowane pytanie | Komunikat dostawcy na poziomie pola jest przenoszony do błędu węzła |
| Limit szybkości lub przeciążenie | Węzeł kończy się błędem z komunikatem, że warunek jest przejściowy — należy włączyć [retry](../reference/features.md) dla tego węzła, aby go przetrwać |
| Zduplikowany lub pusty identyfikator pytania | Węzeł kończy się błędem przed wysłaniem jakiegokolwiek żądania |

## Powiązane

- [Węzeł LLM](./llm-node.md) – Generowanie tekstu zamiast osądu
- [Węzeł Agent](./agent-node.md) – Zbieranie dowodów za pomocą narzędzi, a następnie ich ocena tutaj
- [Węzeł Switch](./switch-node.md) – Kierowanie na podstawie wybranej opcji
- [Węzeł Condition](./condition-node.md) – Warunkowanie na podstawie pewności
- [Typy węzłów](../reference/node-types.md) – Przegląd wszystkich typów węzłów
- [Dane logowania](../reference/credentials.md) – Typy i pola danych logowania
- [Zakładka Wykonania](../tabs/traces-tab.md) – Inspekcja wywołań decyzyjnych i zużycia tokenów
