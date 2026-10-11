# Zakładka Zmienne

Zakładka **Zmienne** zarządza **Globalnym Magazynem Zmiennych** – trwałymi danymi typu klucz-wartość współdzielonymi przez wszystkie Workflows.

<video src="/features/showcase/globalvariables.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/globalvariables.webm">▶ Obejrzyj demonstrację Zmiennych</a></p>

## Przegląd

- Tworzenie, edycja i usuwanie zmiennych globalnych
- Zmienne są przypisane do użytkownika i zachowywane między wykonaniami Workflow
- Odwołania w wyrażeniach poprzez `$global.variableName`

## Tworzenie zmiennej

1. Kliknij **Nowa zmienna**
2. Wprowadź **nazwę** (używaną w wyrażeniach)
3. Ustaw **wartość** (ciąg znaków, liczba, wartość logiczna, tablica lub obiekt)
4. Wybierz **typ wartości** (Auto, String, Number, Boolean, Array, Object)

## Edycja i usuwanie

- **Edycja** – Kliknij ikonę edycji w wierszu zmiennej
- **Usuwanie** – Kliknij ikonę kosza; Workflows korzystające z tej zmiennej będą wymagały zamiennika
- **Usuwanie zbiorcze** – Zaznacz wiele zmiennych i użyj **Usuń zaznaczone**

## Użycie w Workflows

Odwołania do zmiennych w dowolnym wyrażeniu:

```
$global.environment
$global.settings.baseUrl
```

Można również ustawiać zmienne globalne z poziomu [węzła Zmienna](../nodes/variable-node.md), włączając opcję **Store in Global Variable Store**.

## Powiązane

- [Zmienne globalne](../reference/global-variables.md) – Przewodnik referencyjny
- [Węzeł Zmienna](../nodes/variable-node.md) – Ustawianie zmiennych z `isGlobal`
- [Expression DSL](../reference/expression-dsl.md) – Składnia `$global`
- [Zakładka Chat](./chat-tab.md) – Chat może uzyskiwać dostęp do zmiennych globalnych
- [Contextual Showcase](../reference/contextual-showcase.md) – Kompaktowy przewodnik po powierzchniach dashboardu
