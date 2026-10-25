# Heym

Węzeł **Heym** odczytuje dane samego Heym: workflows, do których istnieje dostęp, strukturę pojedynczego workflow oraz jego historię wykonań. To narzędzie do budowania meta-workflow — inwentaryzacji instancji, zestawień wykonań i raportów kondycji dotyczących samego Heym.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Operacje | `listWorkflows`, `getWorkflow`, `getExecutionHistory` |
| Dane logowania | Brak wymaganych |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `heymOperation` | Select | Który odczyt ma zostać wykonany |
| `heymWorkflowId` | UUID | W `getExecutionHistory` proszę ustawić `all`, aby odczytać każdy dostępny Workflow. |
| `heymLimit` | String | Maksymalna liczba zwracanych wierszy. **Pozostaw puste lub wpisz `0`, aby zwrócić wszystko** — to jest wartość domyślna. Obsługuje wyrażenia. |
| `heymStatus` | String | Opcjonalny filtr statusu dla `getExecutionHistory`. Obsługuje wyrażenia. |
| `heymSinceDays` | String | Opcjonalny zakres wsteczny w dniach dla `getExecutionHistory`. Obsługuje wyrażenia. |

Selektor workflow to przeszukiwalna lista rozwijana zawierająca wszystkie workflows, do których istnieje dostęp.

## Zakres dostępu

Wyniki są ograniczone do **właściciela workflow, w którym znajduje się węzeł** — a nie do osoby, która uruchomiła wykonanie. Widoczny zbiór obejmuje:

- workflows należące do właściciela,
- workflows udostępnione bezpośrednio właścicielowi,
- workflows udostępnione zespołowi, do którego należy właściciel.

Ograniczenie do właściciela sprawia, że węzeł zachowuje się identycznie niezależnie od tego, czy wykonanie zostało uruchomione ręcznie, przez cron, z portalu czy przez zdarzenie platformy. Ograniczenie do wykonawcy zwracałoby pusty wynik przy każdym wykonaniu bez nadzoru. To ta sama zasada, którą Heym stosuje już dla danych logowania i zmiennych globalnych.

Workflow niedostępny oraz workflow nieistniejący zwracają ten sam komunikat błędu, więc węzła nie można użyć do sondowania identyfikatorów workflow.

## Operacje

### List Workflows

Zwraca każdy workflow dostępny dla właściciela, od najświeżej zaktualizowanego.

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.workflows` | Tablica podsumowań workflows |
| `$nodeLabel.workflows[0].id` | UUID workflow |
| `$nodeLabel.workflows[0].name` | Nazwa workflow |
| `$nodeLabel.workflows[0].description` | Opis lub `null` |
| `$nodeLabel.workflows[0].active` | Czy workflow jest aktywny |
| `$nodeLabel.workflows[0].folder_id` | UUID folderu lub `null` |
| `$nodeLabel.workflows[0].updated_at` | Znacznik czasu ISO ostatniego zapisu |
| `$nodeLabel.workflows[0].node_count` | Liczba węzłów w workflow |
| `$nodeLabel.total` | Pełna liczba dostępnych pozycji **przed** zastosowaniem limitu |

`total` celowo oznacza liczbę bez limitu, dzięki czemu `$inventory.total` nadal podaje rzeczywisty rozmiar, gdy liczba zwracanych wierszy jest ograniczona. Wyczyszczenie pola **Limit** lub ustawienie go na `0` zwraca wszystkie workflows — i jest to wartość domyślna.

### Get Workflow

Zwraca tożsamość i kształt jednego workflow.

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.id`, `$nodeLabel.name`, `$nodeLabel.description` | Tożsamość workflow |
| `$nodeLabel.active`, `$nodeLabel.folder_id`, `$nodeLabel.updated_at` | Metadane workflow |
| `$nodeLabel.node_count` | Liczba węzłów |
| `$nodeLabel.nodes` | Tablica `{ id, type, label, position, data }` |
| `$nodeLabel.edges` | Tablica `{ id, source, target, sourceHandle, targetHandle }` |

`data` to **pełna konfiguracja węzła** — każde pole w postaci, w jakiej zostało zapisane. Właśnie to umożliwia audyt: nie można przeskanować workflow w poszukiwaniu klucza API, który ktoś wkleił w pole, jeśli węzeł odmawia pokazania tego pola.

Nie przyznaje to żadnego dostępu, którego wywołujący wcześniej nie miał. Węzeł jest ograniczony do workflows, które właściciel i tak może otworzyć w edytorze, a zapisane sekrety danych logowania nadal tu nie trafiają: dane węzła zawierają wyłącznie **identyfikatory** danych logowania, podczas gdy same sekrety są przechowywane w formie zaszyfrowanej w tabeli danych logowania.

### Skanowanie w poszukiwaniu zakodowanych na stałe sekretów

```
cron → heym (listWorkflows) → loop → heym (getWorkflow) → agent → slack
```

Przekaż agentowi `$detail.nodes` i poproś go o oznaczenie każdej wartości `data`, która wygląda jak aktywny klucz lub token. Pola warte uwagi to te z wolnym tekstem — `curl` w węzłach HTTP, `userMessage` i `systemInstruction` w węzłach LLM i Agent oraz treści narzędzi Pythona — ponieważ identyfikator danych logowania to nieszkodliwy UUID, ale wklejony `sk-…` już nie.
### Pobieranie historii wykonań

Zwraca wpisy historii wykonań dla jednego workflow, od najnowszych.

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.executions` | Tablica wpisów historii |
| `$nodeLabel.executions[0].id` | UUID wykonania |
| `$nodeLabel.executions[0].status` | `success`, `error` itd. |
| `$nodeLabel.executions[0].started_at` | Znacznik czasu ISO |
| `$nodeLabel.executions[0].execution_time_ms` | Czas trwania rzeczywisty |
| `$nodeLabel.executions[0].trigger_source` | Co uruchomiło wykonanie, na przykład `cron` lub `heym_event` |
| `$nodeLabel.executions[0].recovered` | Czy wykonanie zostało odzyskane po awarii |
| `$nodeLabel.executions[0].inputs` | Co otrzymało wykonanie — payload triggera lub dane wejściowe wywołującego |
| `$nodeLabel.executions[0].outputs` | Dane wyjściowe workflow dla tego wykonania |
| `$nodeLabel.workflow_id`, `$nodeLabel.workflow_name` | Workflow, do którego należy historia, lub `null` przy **{AW}** |
ub `null` przy **{AW}** |
| `$nodeLabel.total` | Łączna liczba pasujących wykonań **przed** zastosowaniem limitu |
| `$nod| `$nodeLabel.executions[0].workflow_id`, `$nodeLabel.executions[0].workflow_name` | Przy **{AW}** Workflow, do którego należy każde uruchomienie |
eLabel.by_status` | Liczby kluczowane według statusu, na przykład `{ "success": 41, "error": 3 }` |
| `$nodeLabel.since` | Początek okna czasowego lub `null` dla pełnej historii |

Wpisy zawierają zarówno `inputs`, jak i `outputs` — co wykonanie otrzymało i co zwróciło — ale nigdy `node_results`: ślad poszczególnych węzłów to największa kolumna w tabeli i przyćmiłaby wszystko poniżej. Aby uzyskać pełny ślad, należy pobrać pojedyncze wykonanie przez API.

`total` i `by_status` zawsze opisują **całą** pasującą historię, nawet gdy **Limit** ogranicza zwracane wpisy — dzięki temu można pobrać pięć najnowszych wykonań i nadal podać dokładną liczbę błędów.

Pozostawienie pola **Since (days)** pustego obejmuje wszystko, **Status filter** pustego uwzględnia każdy status, a **Limit** pustego lub `0` zwraca każdy wpis.

## Przykładowy workflow

**Dzienny digest instancji**

```
cron → heym (listWorkflows) → loop → heym (getExecutionHistory) → llm → sendEmail
```

- **Heym** `listWorkflows` z etykietą `inventory`
- **Loop** po `$inventory.workflows`
- **Heym** `getExecutionHistory` z `heymWorkflowId` ustawionym na `id` elementu pętli, `heymSinceDays` równym `1` i `heymLimit` równym `5`
- **LLM** zamienia zebrane wykonania i liczby statusów na czytelne podsumowanie

## Uwagi

- Dane logowania nie są wymagane; węzeł odczytuje tę samą bazę danych, na której działa Heym.
- **Limit** to to samo pole dla obu operacji listowania i oznacza to samo w obu przypadkach: puste lub `0` zwraca wszystko.
- Węzeł przyjmuje standardowe dane wejściowe i można go podłączyć do węzła Agent jako narzędzie, dzięki czemu agent może odpowiadać na pytania dotyczące instancji Heym — lub ją audytować.
- Payloady `getWorkflow` rosną wraz z workflow: długie prompty i treści narzędzi Python podróżują wewnątrz `data`.
- Należy połączyć go z [Heym Trigger](./heym-trigger-node.md), aby reagować na zmiany workflow na bieżąco, zamiast odpytywać według harmonogramu.

## Powiązane

- [Heym Trigger](./heym-trigger-node.md) – Uruchamianie workflow na podstawie zdarzeń platformy
- [Execute](./execute-node.md) – Uruchomienie innego workflow zamiast jego opisywania
- [Loop](./loop-node.md) – Iteracja po zwróconej liście workflow
