# Zakładka Szablony

Zakładka Szablony umożliwia zapisywanie, przeglądanie i ponowne wykorzystywanie kompletnych workflow oraz pojedynczych węzłów. Wystarczy udostępnić raz zbudowane rozwiązanie, aby zastosować je w nowych projektach jednym kliknięciem.

<video src="/features/showcase/templates.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/templates.webm">▶ Obejrzyj demonstrację Szablonów</a></p>

## Przegląd

Wyróżnia się dwa rodzaje szablonów:

- **Szablony workflow** — zapisują kompletny workflow (wszystkie węzły i połączenia) jako punkt wyjścia do ponownego wykorzystania.
- **Szablony węzłów** — zapisują pojedynczy skonfigurowany węzeł (np. dostrojony węzeł LLM lub niestandardowy węzeł HTTP) do ponownego wykorzystania w różnych workflow.

Przełączanie między nimi odbywa się za pomocą przełącznika **Workflows / Nodes** w górnej części zakładki.

Pasek wyszukiwania służy do filtrowania widocznych szablonów według nazwy, opisu, tagów lub typu węzła.

---

## Tworzenie szablonu

### Szablon workflow

1. Otwórz workflow, który ma zostać udostępniony, w edytorze.
2. Kliknij **Share as Template** na górnym pasku narzędzi.
3. Uzupełnij nazwę, opis oraz opcjonalne tagi.
4. Wybierz widoczność: **Everyone** (wszyscy użytkownicy) lub **Specific users** (wprowadź nazwy użytkowników i/lub wybierz zespoły).
5. Kliknij **Share**. Zielone powiadomienie potwierdza powodzenie operacji.

### Szablon węzła

1. Kliknij prawym przyciskiem myszy dowolny węzeł na canvasie.
2. Wybierz **Share as Template** z menu kontekstowego.
3. Uzupełnij formularz i kliknij **Share**.

---

## Korzystanie z szablonu

### Szablon workflow

1. Otwórz zakładkę **Templates** i upewnij się, że wybrano **Workflows**.
2. Kliknij kartę, aby wyświetlić podgląd, lub kliknij bezpośrednio **Use**.
3. Workflow zostaje sklonowany do nowego workflow, który otwiera się w edytorze.

### Szablon węzła

1. Otwórz zakładkę **Templates** i wybierz **Nodes**.
2. Kliknij **Use** na karcie szablonu węzła.
3. Pojawia się okno dialogowe — należy wybrać miejsce dodania węzła:
   - **New workflow** — tworzy nowy workflow zawierający wyłącznie ten węzeł.
   - **Existing workflow** — wybór z listy workflow; węzeł zostaje wstawiony automatycznie po otwarciu edytora.

---

## Podgląd

Kliknięcie dowolnej karty szablonu otwiera pełny podgląd:

- **Miniatury kart** — karty szablonów wyświetlają dopasowany, tylko do odczytu zrzut canvasu zarówno dla workflow, jak i szablonów pojedynczych węzłów.
- **Szablony workflow** — canvas tylko do odczytu zgodny ze stylem podglądu historii edycji, z możliwością przesuwania i powiększania.
- **Szablony węzłów** — zapisany węzeł otwiera się na tym samym canvasie tylko do odczytu jako podgląd pojedynczego węzła.
- **Szczegóły węzła** — kliknięcie dowolnego węzła w podglądzie pozwala sprawdzić jego zapisaną konfigurację w panelu bocznym.
- Tagi, liczba użyć oraz **właściciel** są wyświetlane dla wszystkich szablonów.

Naciśnięcie **ESC** lub kliknięcie poza obszarem zamyka podgląd.

---

## Zarządzanie szablonami

- **Edit** – jeśli jest się właścicielem szablonu, należy najechać kursorem na kartę i kliknąć ikonę ołówka, aby zaktualizować nazwę, opis, tagi lub widoczność
- **Delete** – jeśli jest się właścicielem szablonu, należy najechać kursorem na kartę i usunąć szablon po wyświetleniu monitu potwierdzającego
- **Owner-only actions** – kontrolki edycji i usuwania są wyświetlane wyłącznie dla szablonów utworzonych przez danego użytkownika

---

## Command Palette (CTRL+K)

Szablony (zarówno workflow, jak i węzłów) są wyszukiwalne z poziomu palety poleceń **CTRL+K**. Wybranie szablonu powoduje natychmiastowe użycie — szablony workflow otwierają się w edytorze, a szablony węzłów wyświetlają monit o wybór miejsca docelowego.

---

## Szablony w Chat

Można zadawać AI pytania dotyczące szablonów — zna ona wszystkie szablony w danym obszarze roboczym.

---

## Widoczność

| Ustawienie | Kto może zobaczyć |
|---|---|
| Everyone | Wszyscy użytkownicy na platformie |
| Specific users | Użytkownicy wskazani z nazwy i/lub wybrane zespoły — wszyscy członkowie zespołu uzyskują dostęp |

W przypadku udostępniania z opcją **Specific users** można dodać zarówno pojedynczych użytkowników (z nazwy), jak i zespoły. Członkowie zespołu widzą szablon w zakładce Templates i mogą z niego korzystać.

---

## Powiązane

- [Teams](../reference/teams.md) – Udostępnianie szablonów zespołom
- [Canvas Features](../reference/canvas-features.md)
- [Workflow Structure](../reference/workflow-structure.md)
- [Node Types](../reference/node-types.md)
- [Chat Tab](./chat-tab.md)
- [Contextual Showcase](../reference/contextual-showcase.md) – Krótki przewodnik po zakładkach dashboardu
