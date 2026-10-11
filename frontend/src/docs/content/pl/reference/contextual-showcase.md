# Kontekstowy Przewodnik

**Kontekstowy Przewodnik** to lekkie, wbudowane w aplikację narzędzie prowadzące, które objaśnia bieżącą stronę bez natychmiastowego kierowania użytkownika do pełnej dokumentacji.

## Co Robi

- Wyświetla krótkie podsumowanie bieżącej strony
- Utrzymuje pierwszą warstwę zwięzłą, aby nie przeciążać użytkownika
- Umożliwia rozwinięcie niewielkiej ilości dodatkowych szczegółów tylko w razie potrzeby
- Zawiera odnośniki do pełnej strony dokumentacji w celu pogłębienia wiedzy

## Gdzie Się Pojawia

W wersji v1 przewodnik jest dostępny na uwierzytelnionych głównych powierzchniach Heym:

- Zakładki Dashboard
- [Ewaluacja](../tabs/evals-tab.md)
- [Dokumentacja](../getting-started/introduction.md)
- Canvas edytora workflow

Strony publiczne, takie jak logowanie, rejestracja, portal Chat oraz przegląd HITL, nie wyświetlają przewodnika.

## Dostęp

### Desktop

- Stały Trigger **Page Guide** pojawia się na prawej krawędzi ekranu
- Przewodnik otwiera się jako panel boczny po prawej stronie
- Domyślnie pozostaje zamknięty
- Jednorazowa podpowiedź pomaga ujawnić istnienie przewodnika bez wymuszania jego otwarcia

### Mobile

- Ta sama treść jest dostępna z pływającego przycisku **Page Guide**
- Otwiera się w dolnym arkuszu zamiast w panelu bocznym

## Model Treści

Każdy wpis przewodnika korzysta ze strukturalnej definicji zamiast w pełni niestandardowego komponentu.

- **Tytuł** – Czym jest ta strona
- **Podsumowanie** – Jedno krótkie wyjaśnienie
- **Punkty** – Kilka łatwych do przejrzenia wskazówek
- **Wyróżnienia** – Małe karty dla kluczowych wartości lub wzorców użycia
- **Więcej Szczegółów** – Zwinięte sekcje z dodatkowym kontekstem
- **Akcje** – Zazwyczaj jeden lub dwa odnośniki, najczęściej do pełnej dokumentacji

Dzięki temu system pozostaje elastyczny, a jednocześnie unika się długich, hałaśliwych paneli pomocy.

## Świadomość Kontekstu

Przewodnik zmienia się wraz z bieżącą powierzchnią.

- Każda zakładka Dashboard ma własne podsumowanie
- Edytor wskazuje na [Funkcje Canvas](./canvas-features.md)
- Strona dokumentacji korzysta z ogólnego przeglądu dokumentacji i, gdy to możliwe, wskazuje bieżący artykuł, który jest już otwarty

## Trwałość

Przewodnik przechowuje niewielką ilość osobistego stanu interfejsu w pamięci przeglądarki:

- Czy panel lub arkusz był ostatnio otwarty
- Które konteksty stron wyświetliły już podpowiedź
- Ostatnia rozwinięta sekcja szczegółów dla każdego kontekstu

## Dlaczego Istnieje

Celem jest uczynienie Heym łatwiejszym do nauki bez dodawania cięższych elementów interfejsu.

- Krótkie, zawsze pod ręką wskazówki ułatwiające orientację
- Jasna ścieżka do pogłębionej dokumentacji
- Niewielkie zakłócenia dla doświadczonych użytkowników

## Powiązane

- [Zakładka Workflows](../tabs/workflows-tab.md) – Główna powierzchnia Dashboard
- [Zakładka Ewaluacja](../tabs/evals-tab.md) – Workflow ewaluacyjne
- [Funkcje Canvas](./canvas-features.md) – Zachowanie edytora i debugowanie
- [Szybki Panel](./quick-drawer.md) – Druga stała powierzchnia narzędziowa po prawej stronie
