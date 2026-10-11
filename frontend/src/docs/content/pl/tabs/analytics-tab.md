# Karta Analityka

Karta **Analityka** prezentuje metryki wykonań oraz trendy dla workflow. Umożliwia monitorowanie użycia, wydajności i identyfikację wąskich gardeł.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Obejrzyj demonstrację Analityki</a></p>

## Statystyki podsumowujące

- **Łączna liczba wykonań** – Liczba uruchomień workflow w wybranym okresie
- **Wskaźnik sukcesu** – Odsetek udanych uruchomień
- **Średni czas trwania** – Średni czas wykonania
- **Zaoszczędzony czas** – Łączny szacowany zaoszczędzony czas: skonfigurowana dla każdego workflow liczba minut oszczędzanych na uruchomienie × liczba udanych uruchomień, zsumowana w wybranym oknie czasowym
- **Trendy** – Wskaźniki wzrostu/spadku względem poprzedniego okresu

## Zakres czasu

- **24h** – Ostatnie 24 godziny
- **7d** – Ostatnie 7 dni
- **30d** – Ostatnie 30 dni
- **Wszystko** – Cała dostępna historia

## Filtr workflow

- Filtrowanie metryk według konkretnego workflow
- **Wszystkie workflow** – Agregacja danych ze wszystkich workflow

## Tabele

Dwie tabele prezentują użycie workflow: **Najczęściej używane** (szersza) oraz **Najczęściej kończące się błędem**.

- **Zaoszczędzony czas** – Tabela Najczęściej używane prezentuje zsumowany zaoszczędzony czas dla każdego workflow (minuty oszczędzane na uruchomienie × udane uruchomienia). **Nie ustawiono** oznacza brak oszacowania; kliknięcie otwiera odpowiednie pole w workflow.
- **Kolumny sortowalne** – Kliknięcie nagłówka kolumny sortuje według tej kolumny. Ponowne kliknięcie przełącza kolejność rosnącą/malejącą. Wskaźniki strzałek pokazują kierunek sortowania.
- **Etykiety mobilne** – Na małych ekranach etykiety kolumn są skracane (np. „Executions" → „Runs", „Success" → „OK", „Error" → „Err"), aby tabele mieściły się bez przewijania poziomego.

## Wykresy

- **Wolumen wykonań w czasie** – Wykres liniowy liczby wykonań w przedziałach czasowych
- **Wskaźnik sukcesu vs błędów** – Wykres obszarowy porównujący udane i nieudane uruchomienia
- **Średnie opóźnienie w czasie** – Wykres liniowy zmian czasu odpowiedzi
- **Przeciągnij, aby wybrać** – Kliknięcie i przeciągnięcie na dowolnym wykresie pozwala zawęzić niestandardowy zakres dat
- **Tryb zaznaczenia** – Wybrane zakresy odświeżają karty podsumowania, wykresy i tabele workflow bez zmiany bazowego presetu
- **Wyczyść zaznaczenie** – Powrót do zaprogramowanego okna czasowego po zakończeniu analizy

## Automatyczne odświeżanie

- Włączenie automatycznego odświeżania pozwala utrzymać aktualność metryk bez ręcznego przeładowania

## Powiązane

- [Karta Workflows](./workflows-tab.md) – Mierzone workflow
- [Karta Wykonania](./traces-tab.md) – Szczegółowa inspekcja wykonań
- [Karta Logi](./logs-tab.md) – Logi czasu wykonania do debugowania
- [Contextual Showcase](../reference/contextual-showcase.md) – Zwięzły przewodnik po powierzchniach dashboardu

Gdy wykres prezentuje trend, o którym lepiej być informowanym niż go obserwować, można przekształcić go w [alert](./alerts-tab.md): liczba błędów, czas trwania uruchomienia, wydatki na LLM oraz liczba wykonań mogą otrzymać próg w oknie czasowym.
