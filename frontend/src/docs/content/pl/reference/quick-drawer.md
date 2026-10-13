# Szybki Panel

**Szybki Panel** to wysuwany z prawej strony panel szybkiego uruchamiania workflow. Pojawia się na uwierzytelnionych stronach, takich jak zakładka [Workflows](../tabs/workflows-tab.md) na pulpicie, Docs oraz Ewaluacja.

## Dostęp

- Kliknij stały przycisk **Quick / Workflows** na środku prawej krawędzi ekranu
- Gdy dostępny jest również [Contextual Showcase](./contextual-showcase.md), jego przycisk **Page Guide** znajduje się powyżej Quick Workflows
- Panel otwiera się z prawej strony i przesuwa bieżącą stronę w lewo z subtelnym przeskalowaniem
- Na urządzeniach mobilnych Szybki Panel jest ukryty
- Panel nie jest wyświetlany w edytorze workflow, na stronach logowania/rejestracji, portalu ani przeglądu HITL

## Wyszukiwanie Workflow

Użyj pola filtra w górnej części panelu, aby wyszukiwać workflow według:

- Nazwy workflow
- Opisu workflow

Wyszukiwanie nie rozróżnia wielkości liter i natychmiast aktualizuje listę.

## Przypięte Workflow

Przypnij workflow, aby utrzymać je na górze panelu.

- Przypięte workflow pojawiają się w osobnej sekcji powyżej pełnej listy
- Nowe przypięcia są dodawane na górze
- Kolejność przypięć jest zachowywana między przeładowaniami w pamięci przeglądarki

## Uruchamianie Workflow

Wybierz workflow, aby otworzyć jego formularz wejściowy.

- Pola wejściowe są wyświetlane pionowo w kolejności panelu
- Kliknij **Run Workflow**, aby uruchomić wybrany workflow
- Kliknij **Stop Workflow**, aby anulować trwające wykonanie z panelu
- Workflow bez pól wejściowych można nadal uruchomić bezpośrednio
- Workflow rozpoczynający się od węzła [File Upload Trigger](../nodes/file-upload-trigger-node.md) wyświetla zamiast tego strefę upuszczania: upuść na nią plik lub kliknij, aby go wybrać. Strefa wyświetla akceptowane przez trigger typy i rozmiar plików oraz odrzuca inne pliki przed przesłaniem. Przycisk **Run Workflow** pozostaje nieaktywny do momentu wybrania pliku.

Panel korzysta z tego samego API wykonywania workflow co inne powierzchnie uruchamiania w Heym, dzięki czemu wyniki i zachowanie w czasie działania pozostają spójne.

Zatrzymanie uruchomienia z panelu anuluje również aktywne wykonanie po stronie backendu, w tym wszelkie zadania przeglądarki Playwright będące w toku dla danego uruchomienia workflow.

## Postęp i Wyniki

Po rozpoczęciu uruchomienia panel wyświetla:

- Strumieniowy postęp kroków dla węzłów w miarę ich rozpoczynania i kończenia
- Status końcowy: `success`, `error` lub `pending`
- Wyniki końcowe w kompaktowym panelu JSON
- Wpisy w Historii oznaczone tagiem `Quick Drawer`

`pending` oznacza, że workflow oczekuje na późniejsze działanie, takie jak przegląd przez człowieka.

Uruchomienie z plikiem odbywa się za pośrednictwem jednorazowego linku przesyłania z triggera: panel prosi workflow o link, przesyła pod niego plik i wyświetla wynik po zakończeniu przesyłania. Uruchomienia z plikiem pokazują status końcowy i dane wyjściowe, ale bez postępu krok po kroku, a w historii są również oznaczane tagiem `Quick Drawer`. Wybrany plik jest czyszczony po każdym uruchomieniu, ponieważ jeden link przyjmuje jeden plik.

## Pamięć Przeglądarki

Szybki Panel przechowuje preferencje osobiste w `localStorage`:

- ID przypiętych workflow
- Ostatnio wybrany workflow

Panel **nie** zachowuje wartości wejściowych w tej wersji.

## Zakres

Szybki Panel jest celowo lekką powierzchnią wykonywania.

- Zawiera: wyszukiwanie, przypinanie, wybór, dane wejściowe (w tym plik), uruchamianie, postęp, wynik
- Nie zawiera: tworzenia workflow, edycji, zarządzania folderami ani działań na canvasie

## Powiązane

- [Zakładka Workflows](../tabs/workflows-tab.md) – Główna lista workflow, foldery i zarządzanie
- [Szybki Start](../getting-started/quick-start.md) – Zbuduj i uruchom swój pierwszy workflow
- [Historia Wykonań](./execution-history.md) – Przeglądaj przeszłe uruchomienia
- [Webhooks](./webhooks.md) – Wyzwalaj workflow przez HTTP
- [Contextual Showcase](./contextual-showcase.md) – Pasek wskazówek na poziomie strony, który uzupełnia Szybki Panel
