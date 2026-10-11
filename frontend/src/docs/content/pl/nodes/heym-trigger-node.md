# Heym Trigger

Węzeł **Heym Trigger** uruchamia workflow, gdy sam Heym publikuje zdarzenie platformowe. Jest to węzeł triggera bez danych wejściowych, służący do automatyzacji Heym za pomocą Heym: śledzenia zmian audytowych, ogłoszeń o wdrożeniach oraz podsumowań kondycji instancji.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 0 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.events`, `$nodeLabel.count`, `$nodeLabel.triggered_at` |
| Dane logowania | Brak wymaganych |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `eventNames` | Tablica ciągów znaków | Zdarzenia, które mają być subskrybowane. Pozostaw puste, aby otrzymywać każde zdarzenie. |

## Zdarzenia

| Zdarzenie | Publikowane, gdy | Zakres |
|-------|----------------|-------|
| `heym.started` | Platforma Heym zostaje uruchomiona | W całej instancji: każdy subskrybent je otrzymuje |
| `workflow.created` | Zostaje utworzony workflow | Tylko subskrybenci właściciela workflow |
| `workflow.updated` | Zostaje zapisany workflow | Tylko subskrybenci właściciela workflow |
| `workflow.deleted` | Zostaje usunięty workflow | Tylko subskrybenci właściciela workflow |

Widgety pulpitu są wewnętrznie przechowywane jako workflows, ale nigdy nie generują zdarzeń `workflow.*`.

## Dostarczanie jest grupowane

Heym wysyła zdarzenia co pięć sekund. **Każde zdarzenie odebrane w jednym przebiegu wysyłki trafia do jednego wykonania workflow**, jako tablica.

- Utworzenie dwóch workflows w odstępie pięciu sekund → **jedno** wykonanie z dwoma zdarzeniami.
- Utworzenie jednego workflow → **jedno** wykonanie z tablicą jednoelementową.

Struktura nigdy się nie zmienia, więc wyrażenia downstream nigdy nie muszą rozgałęziać się w zależności od tego, czy dotarło jedno zdarzenie, czy wiele. Gdy konieczne jest działanie raz na zdarzenie, należy umieścić węzeł [Loop](./loop-node.md) nad `$nodeLabel.events`.

## Dostarczanie dokładnie raz

Każde zdarzenie jest przypisywane do subskrybującego węzła poprzez unikalne ograniczenie bazy danych, zanim zostanie dostarczone. Działa to w obrębie każdego workera uvicorn, każdego kontenera i każdej maszyny: uruchomienie Heym na dwóch serwerach nie powoduje dostarczenia zdarzenia dwukrotnie. Jeśli przypisanie nie może zostać zapisane, zdarzenie nie zostaje dostarczone wcale — konstrukcja zawodzi w sposób bezpieczny, zamiast uruchamiać się dwukrotnie.

Dwa różne węzły `heymTrigger` subskrybujące to samo zdarzenie otrzymują je po jednym razie; nie konkurują o nie.

## Okno wysyłki

Dyspozytor uwzględnia wyłącznie zdarzenia opublikowane w **ciągu ostatnich pięciu minut**. Starsze zdarzenia pozostają w logu do wglądu, ale nigdy nie są dostarczane. Ogranicza to skutki przestoju: przywrócenie Heym po godzinie offline nie odtwarza niczego, zamiast uruchamiać godzinę zaległości naraz.

Zdarzenia są przechowywane przez **7 dni**, a następnie usuwane.

## Pola wyjściowe

| Wyrażenie | Opis |
|------------|-------------|
| `$nodeLabel.events` | Tablica obiektów zdarzeń, od najstarszego. Zawsze tablica. |
| `$nodeLabel.events[0].id` | UUID zdarzenia |
| `$nodeLabel.events[0].name` | Nazwa zdarzenia, na przykład `workflow.created` |
| `$nodeLabel.events[0].payload` | Treść zdarzenia |
| `$nodeLabel.events[0].workflow_id` | Identyfikator workflow będącego podmiotem lub `null` dla `heym.started` |
| `$nodeLabel.events[0].created_at` | Znacznik czasu ISO momentu publikacji zdarzenia |
| `$nodeLabel.count` | Liczba zdarzeń w tej partii |
| `$nodeLabel.triggered_at` | Znacznik czasu ISO wykonania workflow |

### Struktury payload

`workflow.created`, `workflow.updated`, `workflow.deleted`:

```json
{
  "workflow_id": "…",
  "name": "Nightly report",
  "owner_id": "…",
  "actor_user_id": "…",
  "updated_at": "2026-08-11T09:30:00+00:00"
}
```

`heym.started`:

```json
{ "version": "1.4.2", "started_at": "2026-08-11T09:30:00+00:00" }
```

`workflow.deleted` zawiera nazwę przechwyconą tuż przed usunięciem, ponieważ wiersz workflow już nie istnieje w momencie odczytu zdarzenia.

## Przykładowy workflow

**Śledzenie zmian audytowych workflow**

```
heymTrigger → heym (getWorkflow) → slack
```

- **Heym Trigger** o etykiecie `platformEvents`, subskrybujący `workflow.created`, `workflow.updated`, `workflow.deleted`
- Węzeł **Heym** z `getWorkflow` i `heymWorkflowId` ustawionym na `$platformEvents.events[0].workflow_id`
- Wiadomość **Slack**: `"$platformEvents.count workflow change(s), latest: $platformEvents.events[0].name"`

## Uwagi

- `heym.started` uruchamia się **raz na uruchomienie platformy**, a nie raz na worker, mimo że Heym uruchamia osiem workerów na kontener. Kontenery uruchamiane w odstępie większym niż pięć minut publikują po jednym zdarzeniu każdy.
- Wykonania uruchomione w ten sposób pojawiają się w historii z `trigger_source = "heym_event"`.
- Należy ustawić **Events** na brak, zamiast wymieniać wszystkie cztery, jeśli istnieje potrzeba automatycznego obejmowania typów zdarzeń dodanych w przyszłych wersjach.

## Powiązane

- [Heym](./heym-node.md) – Odczyt workflow i historii wykonań
- [Triggers](../reference/triggers.md) – Przegląd wszystkich punktów wejścia workflow
- [Loop](./loop-node.md) – Działanie raz na zdarzenie w partii
