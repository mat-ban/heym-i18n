# Historia

Historia śledzi zapisane wersje workflow. Umożliwia przeglądanie zmian w czasie, porównywanie wersji oraz przywracanie poprzedniego stanu.

**Uwaga:** Historia różni się od [Historii wykonań](./execution-history.md). Historia śledzi **zapisy** (zmiany struktury workflow); Historia wykonań śledzi **uruchomienia** (przeszłe wykonania).

## Gdzie ją znaleźć

**Pasek narzędzi edytora** → **Historia** (ikona GitBranch)

## Wersje

Nowa wersja jest tworzona za każdym razem, gdy workflow zostanie **zapisany**. Lista zawiera:

- **Bieżąca** – Ostatnio zapisany stan (widoczny na canvas)
- **Wersja N** – Poprzednie zapisy ze znacznikami czasu

Wersje bez zmian względem poprzedniej są ukrywane.

## Widok różnic

Aby zobaczyć, co zmieniło się względem bieżącego workflow, należy wybrać wersję:

| Typ zmiany | Opis |
|-------------|--------------|
| **Węzły** | Dodane, usunięte lub zmodyfikowane węzły |
| **Krawędzie** | Dodane, usunięte lub zmodyfikowane połączenia |
| **Konfiguracja** | Ustawienia na poziomie workflow (autoryzacja, limity szybkości itp.) |

Każdą zmianę można rozwinąć, aby zobaczyć różnice na poziomie pól (np. które właściwości węzła uległy zmianie).

## Podgląd

Aby zobaczyć, jak workflow wyglądał w poprzedniej wersji, należy kliknąć **Podgląd** obok opcji Przywróć.

Otwiera się canvas tylko do odczytu, przedstawiający węzły i krawędzie tej wersji. Można przesuwać i powiększać widok, aby zapoznać się z układem; w tym widoku nie można wprowadzać żadnych zmian.

## Przywracanie

Aby przywrócić poprzednią wersję:

1. Wybierz wersję, którą chcesz przywrócić
2. Kliknij **Przywróć**
3. Potwierdź operację
4. Bieżący workflow zostanie zastąpiony wybraną wersją; strona zostanie odświeżona

Przywrócenie tworzy nowy stan „bieżący” — w razie potrzeby można przywrócić ponownie.

## Czyszczenie historii

Aby usunąć całą historię wersji, należy kliknąć ikonę kosza w nagłówku okna dialogowego. Tej operacji nie można cofnąć. Bieżący workflow pozostaje; usuwane są wyłącznie poprzednie wersje.

## Kiedy tworzone są wersje

Wersje są tworzone wyłącznie podczas **zapisu** (Ctrl/Cmd+S lub przycisk Zapisz). Niezapisane zmiany nie są przechowywane w Historii do momentu zapisu.

Edycje umiejętności agenta są uwzględniane w tych migawkach. Aby przeglądać lub przywrócić pojedynczą umiejętność bez przywracania całego workflow, należy użyć przycisku **Historia** na karcie tej umiejętności w panelu właściwości węzła Agent. Zobacz [Węzeł Agent](../nodes/agent-node.md#skill-history).

## Powiązane

- [Historia wykonań](./execution-history.md) – Przeszłe uruchomienia i Bring to Canvas
- [Struktura workflow](./workflow-structure.md) – Format węzłów i krawędzi
- [Karta Workflows](../tabs/workflows-tab.md) – Tworzenie workflow i zarządzanie nimi
