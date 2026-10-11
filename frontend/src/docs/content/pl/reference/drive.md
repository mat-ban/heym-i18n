# Drive

Zakładka Drive stanowi centralne miejsce do przeglądania, zarządzania i udostępniania wszystkich plików generowanych przez skille.

## Dostęp do Drive

Należy przejść do zakładki **Drive** w panelu głównym. Wszystkie pliki wygenerowane przez skille workflow pojawiają się tutaj, posortowane według daty utworzenia.

## Lista plików

Lista plików zawiera:

- **Name** — oryginalna nazwa pliku z ikoną właściwą dla typu
- **Type** — typ MIME pliku (np. pdf, csv, docx)
- **Size** — rozmiar pliku w czytelnym formacie
- **Source** — etykieta węzła, który wygenerował plik
- **Date** — data utworzenia pliku
- **Actions** — przyciski pobierania, udostępniania i usuwania

## Akcje zbiorcze

Każdy plik będący własnością użytkownika ma pole wyboru na początku wiersza. Pliki udostępnione przez zespół są tylko do odczytu i nie można ich zaznaczyć. Należy zaznaczyć wiele plików (Shift-klik zaznacza ciągły zakres; pole wyboru w nagłówku zaznacza całą stronę), aby wyświetlić pasek akcji zbiorczych nad listą, a następnie kliknąć **Bulk actions**, aby otworzyć jedno okno dialogowe stosujące to samo ustawienie do każdego zaznaczonego pliku:

- **Share all with my teams** / **Remove team sharing** — przełącza udostępnianie zespołowe dla wszystkich zaznaczonych plików jednocześnie
- **Create share link for each file** — tworzy link udostępniania dla każdego zaznaczonego pliku z tymi samymi wartościami wygaśnięcia, hasła i maksymalnej liczby pobrań

Okno dialogowe informuje, do ilu plików zastosowano ustawienie; pliki niebędące własnością użytkownika są pomijane. Selektor liczby wierszy na stronę (25 / 50 / 100 / **All**) na dole listy pozwala wczytać więcej plików na jednej stronie, co umożliwia zaznaczanie w całym Drive.

## Udostępnianie plików

Należy kliknąć ikonę **Share**, aby otworzyć okno dialogowe udostępniania. Można utworzyć wiele linków udostępniania dla jednego pliku z różnymi konfiguracjami oraz opcjonalnie udostępnić plik bieżącym zespołom.

### Link publiczny (oparty na Token)

Należy utworzyć link udostępniania bez hasła. Każda osoba posiadająca link może pobrać plik.

### Link chroniony hasłem (Basic Auth)

Należy ustawić hasło podczas tworzenia udostępnienia. Adres URL pobierania wykorzystuje HTTP Basic Authentication — przeglądarki wyświetlą monit o nazwę użytkownika (`file`) i hasło przy otwarciu linku.

### Opcje linku

- **Expires (hours)** — opcjonalne ustawienie czasu wygaśnięcia
- **Max downloads** — opcjonalne ograniczenie liczby pobrań
- Oba parametry można łączyć w celu uzyskania maksymalnej kontroli

### Udostępnianie zespołom

Należy włączyć **Share with my teams**, aby przyznać dostęp tylko do odczytu wszystkim zespołom, do których użytkownik obecnie należy. Członkowie zespołu mogą wyświetlać i pobierać plik z Drive oraz korzystać z operacji odczytu węzła Drive, ale tylko właściciel pliku może usuwać plik, tworzyć lub unieważniać linki publiczne bądź zmieniać hasło/TTL/limity pobrań.

Ustawienie jest przypisane do konkretnego pliku. W przypadku późniejszego dołączenia do innego zespołu lub utworzenia nowego należy ponownie przełączyć udostępnianie albo uruchomić operację `shareWithMyTeams` węzła Drive, aby dodać ten zespół. Operacja `unshareWithMyTeams` służy do usunięcia udostępnień zespołowych z pliku w ramach workflow.

### Zarządzanie udostępnieniami

Okno dialogowe udostępniania wyświetla wszystkie istniejące linki udostępniania wraz z:
- Bieżącą liczbą pobrań
- Statusem wygaśnięcia
- Informacją, czy Basic Auth jest włączone
- Przyciskami kopiowania i unieważniania

## Linki do plików w Chat i Portalu

Gdy skill generuje pliki podczas wykonania workflow przez chat Portalu lub Quick Drawer, linki do pobierania pojawiają się automatycznie w odpowiedzi. Użytkownicy mogą kliknąć, aby pobrać plik bezpośrednio.

## Przechowywanie

Wygenerowane pliki są przechowywane w systemie plików serwera w katalogu `data/files/`. W środowiskach Docker jest on montowany jako wolumen w celu zapewnienia trwałości.

## Zarządzanie plikami z poziomu workflow

[Węzeł Drive](../nodes/drive-node.md) umożliwia programowe zarządzanie plikami Drive z poziomu workflow. Służy do:

- **List** — wyświetlania plików i zwracania metadanych, takich jak nazwa pliku, typ MIME, rozmiar, źródło i adres URL pobierania
- **Delete** — usuwania pliku po dostarczeniu go użytkownikowi
- **Share or unshare with your teams** — udostępniania lub cofania udostępnienia zespołom, aby członkowie zespołu mogli odczytywać i pobierać plik tylko przez czas istnienia udostępnienia zespołowego
- **Set a password** — ustawiania hasła na linku pobierania
- **Set a TTL** — ustawiania wygaśnięcia linku po N godzinach
- **Set a max downloads** — ustawiania limitu maksymalnej liczby pobrań

Konwersja pliku do innego formatu należy do zadań [węzła Converter](../nodes/converter-node.md), z parametrem `conversion: "fileConvert"`. Odczytuje on plik Drive i zapisuje przekonwertowany wynik jako nowy plik.

Plik należy wskazać przez jego ID z danych wyjściowych skilla: `$agentLabel._generated_files[0].id`

Szczegóły konfiguracji znajdują się w [dokumentacji węzła Drive](../nodes/drive-node.md).

## Odczyt plików Drive przez skille

Skille agenta mogą włączyć odczyt z Drive za pomocą ustawienia **Enable Drive files** na karcie skilla. Po włączeniu środowisko uruchomieniowe skilla zawiera wygenerowany pomocnik `heym_drive.py`. Kod skilla może importować funkcje pomocnicze, takie jak `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` oraz `list_drive_files`.

Odczyt z Drive jest ograniczony do plików dostępnych dla podmiotu wykonującego workflow: plików będących jego własnością oraz plików udostępnionych mu przez zespoły. Należy użyć ID pliku do dokładnego wyszukania lub dokładnej nazwy pliku, gdy użytkownik odnosi się do pliku po nazwie. Wyszukiwanie po nazwie zwraca najnowszy dostępny plik o tej nazwie; `list_drive_files(filename="...")` zwraca wszystkie dopasowania.

## Powiązane

- [Węzeł Drive](../nodes/drive-node.md) — operacje workflow (list, get, delete, password, TTL, max downloads, udostępnianie zespołowe)
- [Zakładka Drive](../tabs/drive-tab.md) — przeglądanie plików w panelu głównym
- [Generowanie plików](./file-generation.md) — sposób tworzenia `_generated_files` i adresów URL pobierania

## Czyszczenie
Wygasłe tokeny udostępniania są automatycznie czyszczone codziennie. Same pliki pozostają do momentu ręcznego usunięcia przez zakładkę Drive. Funkcja **Clear All** pozwala usunąć wszystkie pliki wraz z ich linkami udostępniania w jednej operacji.
