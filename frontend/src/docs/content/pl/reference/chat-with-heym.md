# Chat z Heym

Chat z Heym to asystent świadomy kontekstu strony, dostępny z nagłówka dokumentacji. Otwiera się w wyśrodkowanym oknie dialogowym, umożliwia wybór danych logowania LLM oraz modelu, a następnie odpowiada na pytania, przyjmując aktualnie otwartą stronę dokumentacji jako pierwszy kontekst.

## Otwieranie okna dialogowego

1. Otwórz dowolną stronę w katalogu `/docs`
2. Kliknij **Chat with Heym** w nagłówku
3. Wybierz [dane logowania](../tabs/credentials-tab.md) oraz model
4. Zadaj pytanie dotyczące strony lub platformy

Na mniejszych ekranach element wyzwalający ma postać samej ikony; na większych ekranach wyświetlana jest pełna etykieta.

## Wykorzystywany kontekst

- Aktualnie otwarta ścieżka dokumentacji jest wstrzykiwana do żądania jako wskazówka kontekstowa
- Backend nadal korzysta z istniejącego endpointu czatu dashboardu oraz narzędzi wyszukiwania w dokumentacji
- [User Rules](./user-settings.md) na poziomie konta nadal obowiązują, ponieważ wykorzystywany jest ten sam backend czatu
- Kroki przygotowania na żywo są strumieniowane do dymka asystenta przed ostateczną odpowiedzią, podobnie jak w czacie dashboardu
- Pytania doprecyzowujące pojawiają się jako karty, tak samo jak w [zakładce Chat](../tabs/chat-tab.md). Gdy żądanie workflow wymaga danych logowania, można wybrać jedne z nich lub utworzyć je z poziomu karty. Gdy wymaga tabeli danych, można wybrać jedną z posiadanych tabel lub utworzyć nową w ten sam sposób.

Po otwarciu okna dialogowego na konkretnym artykule wyświetlana jest niewielka plakietka ze aktywną ścieżką dokumentacji, co pozwala potwierdzić, która strona jest traktowana priorytetowo.

## Zachowanie sesji

- Wybór danych logowania i modelu pozostaje zachowany, dopóki okno dialogowe jest zamontowane
- Historia wiadomości istnieje wyłącznie w ramach sesji i jest czyszczona po zamknięciu okna dialogowego
- Kliknięcie tła, klawisz `Escape` oraz przycisk zamknięcia resetują sesję
- **Stop** przerywa bieżącą odpowiedź strumieniowaną
- Okno dialogowe jest celowo szerokie i ma stały rozmiar; nie oferuje przełącznika trybu pełnoekranowego

## Kiedy korzystać

- Zadawanie pytań uzupełniających podczas czytania strony węzła lub strony referencyjnej
- Wyjaśnianie różnic między funkcjami bez opuszczania dokumentacji
- Znajdowanie właściwego artykułu przed otwarciem edytora

Aby bezpośrednio budować lub modyfikować workflow, należy skorzystać z [AI Assistant](./ai-assistant.md) po stronie edytora.

## Powiązane

- [AI Assistant](./ai-assistant.md) – Czat w edytorze służący do budowania workflow
- [Credentials Tab](../tabs/credentials-tab.md) – Dodawanie danych logowania LLM wykorzystywanych przez okno dialogowe
- [Settings](./user-settings.md) – Globalne User Rules stosowane do powierzchni AI
- [Quick Start](../getting-started/quick-start.md) – Przewodnik po pierwszym workflow
