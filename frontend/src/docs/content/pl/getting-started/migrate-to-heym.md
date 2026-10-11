# Migracja do Heym

Masz już workflows w innym narzędziu? **AI Convert** zamienia je na workflows Heym. Wklej workflow z n8n, Flowise, Dify, Langflow, sim.ai lub Activepieces — albo po prostu opisz, czego potrzebujesz — a Heym zbuduje równoważny workflow na żywym canvasie, który można pobrać i zaimportować.

Otwórz go pod adresem **[heym.run/convert](https://heym.run/convert)** lub użyj przycisku **✨ AI Convert** w nagłówku strony.

## Jak to działa

1. **Wybierz narzędzie źródłowe** (opcjonalnie) — n8n, Flowise, Dify, Langflow, sim.ai, Activepieces lub pozostaw opcję *Auto*.
2. **Dostarcz swój workflow** — wklej wyeksportowany JSON z obecnego narzędzia albo napisz opis automatyzacji w prostym języku.
3. **Wygeneruj** — Heym strumieniuje wynik na canvas, rysując węzły i połączenia w miarę ich tworzenia.
4. **Pobierz lub skopiuj** wygenerowany workflow jako JSON.
5. **Zaimportuj do Heym** — skorzystaj z procedury [Pobierz i zaimportuj](../reference/download-import.md), aby wkleić JSON na canvas, a następnie uruchom go.

Konwersja dodaje również niewielką *Sticky Note* na canvasie, oznaczającą workflow jako wygenerowany przez Heym — można ją usunąć w dowolnym momencie.

## Co otrzymujesz

Konwerter mapuje koncepcje źródłowe na natywne węzły Heym — triggery, kroki [LLM](../nodes/llm-node.md), wywołania [HTTP](../nodes/http-node.md), akcje [Slack](../nodes/slack-node.md)/[Telegram](../nodes/telegram-node.md), [Pętle](../nodes/loop-node.md), [Warunki](../nodes/condition-node.md) oraz [Wyjście](../nodes/output-node.md). Przejrzyj wynik na canvasie, podłącz swoje [Dane logowania](../reference/credentials.md) i dostosuj wszystko, co narzędzie źródłowe wyraziło w inny sposób.

> AI Convert to punkt wyjścia, a nie gwarantowany port 1:1. Zawsze należy przejrzeć wygenerowany workflow przed uruchomieniem go w środowisku produkcyjnym.

## Warto wiedzieć

- **Napędzane AI:** konwersje są generowane przez duży model językowy, więc wyniki mogą się różnić między uruchomieniami. W razie potrzeby należy wygenerować ponownie, jeśli pierwszy wynik nie jest w pełni odpowiedni.
- **Rozmiar danych wejściowych:** dane wejściowe wklejone lub wpisane są ograniczone do około **25 000 tokenów**. Bardzo duże eksporty należy skrócić przed konwersją.
- **Limity szybkości:** aby narzędzie było dostępne dla wszystkich, liczba żądań jest ograniczona do **1 na minutę, 5 na godzinę i 10 na dzień** na odwiedzającego.
- **Bezpieczeństwo:** żądania są filtrowane, a przetwarzane są wyłącznie żądania dotyczące budowy workflow.

## Kolejne kroki

- Pierwszy raz na canvasie? Zacznij od [Szybkiego startu](./quick-start.md).
- Dowiedz się, jak działa importowanie, w sekcji [Pobierz i zaimportuj](../reference/download-import.md).
- Hostujesz Heym samodzielnie? Zobacz [Zmienne środowiskowe](https://github.com/heymrun/heym/blob/main/ENVIRONMENT-VARIABLES.md), aby zapoznać się z pełną dokumentacją konfiguracji.
- Buduj od podstaw z pomocą wbudowanego w aplikację [Asystenta AI](../reference/ai-assistant.md).
