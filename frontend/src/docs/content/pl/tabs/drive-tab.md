# Karta Drive

Karta Drive wyświetla wszystkie pliki wygenerowane przez skille w obrębie Workflow.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Obejrzyj demonstrację Drive</a></p>

## Przegląd

Pliki generowane przez skille (PDF, DOCX, CSV, obrazy itp.) są automatycznie przechowywane i wyświetlane na karcie Drive. Każdy plik prezentuje nazwę, typ, rozmiar, węzeł źródłowy, datę utworzenia oraz stan udostępniania zespołowego.

## Funkcje

- **Wyszukiwanie** — filtrowanie plików według nazwy, typu lub węzła źródłowego
- **Kopiowanie ID pliku** — skopiowanie UUID pliku do schowka, gotowego do wklejenia w węźle [Drive](../nodes/drive-node.md) lub [Converter](../nodes/converter-node.md)
- **Pobieranie** — uwierzytelnione pobieranie plików własnych oraz plików udostępnionych przez zespoły
- **Udostępnianie** — tworzenie linków do pobrania z opcjonalną ochroną hasłem i terminem ważności lub udostępnianie pliku w trybie tylko do odczytu bieżącym zespołom
- **Usuwanie** — usuwanie plików wraz z ich linkami udostępniania
- **Wyczyść wszystko** — usunięcie wszystkich plików wraz z ich linkami udostępniania po potwierdzeniu
- **Operacje zbiorcze** — zaznaczanie wielu plików za pomocą pól wyboru (Shift-klik dla zakresu) i zastosowanie tej samej operacji do wszystkich jednocześnie
- **Paginacja** — przeglądanie dużych kolekcji plików z selektorem liczby wierszy na stronę (25 / 50 / 100 / Wszystkie)

## Operacje zbiorcze

Pliki będące własnością użytkownika wyświetlają pole wyboru na początku wiersza (pliki udostępnione przez zespół są tylko do odczytu i nie można ich zaznaczać). Należy zaznaczyć kilka wierszy — lub użyć pola wyboru w nagłówku, aby zaznaczyć całą stronę, a następnie **Shift-klik**, aby zaznaczyć zakres — i skorzystać z paska operacji zbiorczych, który pojawia się nad listą:

- **Pobierz ZIP** pakuje każdy zaznaczony plik do jednego archiwum ZIP i pobiera je
- **Operacje zbiorcze** otwiera jedno okno dialogowe umożliwiające zastosowanie jednego ustawienia do każdego zaznaczonego pliku:
  - **Udostępnij wszystkie moim zespołom** / **Usuń udostępnianie zespołowe** jednym kliknięciem
  - **Utwórz link udostępniania dla każdego pliku** z tymi samymi ustawieniami hasła, terminu ważności i limitu pobrań
- **Usuń** usuwa każdy zaznaczony plik wraz z jego linkami udostępniania po potwierdzeniu
- **Wyczyść zaznaczenie** odznacza wszystko

Okno dialogowe informuje, do ilu plików zastosowano operację (pliki niebędące własnością użytkownika są pomijane). Opcja **Wszystkie** w selektorze liczby wierszy na stronę pozwala załadować wszystkie pliki na jednej stronie i zaznaczać w obrębie całego Drive. Wpisanie tekstu w polu wyszukiwania automatycznie przełącza selektor liczby wierszy na stronę na **Wszystkie**, aby wyszukiwanie objęło każdy plik, a nie tylko bieżącą stronę; wyczyszczenie wyszukiwania przywraca poprzednie ustawienie.

## Udostępnianie

Tworzenie linków udostępniania z następującymi opcjami:
- **Bez uwierzytelniania** — publiczny URL do pobrania oparty na tokenie
- **Basic Auth** — link chroniony hasłem (nazwa użytkownika: `file`)
- **Termin ważności** — opcjonalny termin ważności
- **Limity pobrań** — opcjonalny maksymalny limit pobrań

Włączenie opcji **Udostępnij moim zespołom** dla pliku czyni go widocznym dla wszystkich zespołów, do których użytkownik aktualnie należy. Udostępnionym członkom zespołu przysługuje dostęp tylko do odczytu; operacje zarządzania pozostają zastrzeżone dla właściciela.

## Dostęp dla skilli agenta

Skille w węźle Agent mogą zostać uprawnione do odczytu plików Drive. Gdy opcja **Włącz pliki Drive** jest włączona dla danego skilla, jego kod Python może odczytywać dostępne pliki Drive według identyfikatora pliku lub dokładnej nazwy pliku za pośrednictwem wygenerowanego pomocnika `heym_drive.py`. Ustawienie jest domyślnie wyłączone.

Pełne szczegóły znajdują się w [Dokumentacji Drive](../reference/drive.md).

## Powiązane

- [Węzeł Drive](../nodes/drive-node.md) — wyświetlanie plików, pobieranie metadanych, udostępnianie zespołom lub zmiana ograniczeń udostępniania z poziomu Workflow
- [Generowanie plików](../reference/file-generation.md) — sposób generowania plików przez skille
- [Dokumentacja Drive](../reference/drive.md) — linki udostępniania, tokeny i czyszczenie
- [Portal](../reference/portal.md) — linki do plików w odpowiedziach Chat portalu
