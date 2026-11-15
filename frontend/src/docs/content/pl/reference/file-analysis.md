# Analiza plików

Analiza plików umożliwia Chatowi, [węzłowi Agent](../nodes/agent-node.md) oraz [węzłowi Code](../nodes/code-node.md) otwieranie i analizowanie dużych plików z [Drive](./drive.md) w odizolowanym środowisku Python sandbox. Pliki PDF, arkusze kalkulacyjne, CSV, DOCX i JSON są najpierw sprawdzane, a następnie odczytywane selektywnie, dzięki czemu 200-stronicowa umowa lub skoroszyt z milionem wierszy nigdy nie musi w całości mieścić się w kontekście modelu.

## Jak to działa

Każde wywołanie działa w nowym kontenerze bez dostępu do sieci. Wymagane pliki są kopiowane w trybie tylko do odczytu, kod jest wykonywany, a kontener natychmiast usuwany. Niewielki folder roboczy jest zachowywany między wywołaniami tej samej sesji, co pozwala kolejnemu krokowi kontynuować pracę na wynikach zapisanych przez krok poprzedni.

| Ścieżka | Zawartość |
|------|--------|
| `/input` | Pliki Drive tej sesji, tylko do odczytu |
| `/work` | Przestrzeń robocza zachowywana w trakcie sesji, np. `/work/sales.pkl` |
| `/work/out` | Pliki zapisane tutaj trafiają do Drive po zakończeniu wywołania i są zwracane jako linki |

W sandboxie preinstalowane są biblioteki pandas, openpyxl, xlrd, pdfplumber, pypdf, python-docx oraz langdetect, a także silnik OCR Tesseract wykorzystywany przez [węzeł Konwerter](../nodes/converter-node.md).

## Narzędzia

Model współpracuje z trzema narzędziami, a także czwartym w Chacie:

| Narzędzie | Funkcja |
|------|----------|
| `list_files` | Wyświetla listę plików Drive, które możesz otworzyć: nazwa, typ, rozmiar, data |
| `inspect_file` | Zwraca typ, metadane i strukturę pliku wraz z krótką próbką |
| `run_python` | Wykonuje kod Python na wskazanych plikach i zwraca dane wyjściowe z konsoli |
| `clear_workspace` | Tylko Chat: usuwa folder roboczy konwersacji |

`inspect_file` odczytuje wyłącznie informacje niezbędne do przygotowania podsumowania:

| Typ | Podsumowanie |
|-----|-----------------|
| PDF | Liczba stron, tytuł i autor, możliwość wyodrębnienia tekstu, język, wymiary stron, tekst i tabele pierwszej strony. Zeskanowane pliki PDF są czytane za pomocą OCR (do 5 stron) |
| XLSX / XLS | Arkusze z liczbą wierszy i kolumn, wiersze nagłówkowe, typy, `read_hint` dla pandas, nazwane zakresy, pierwsze wiersze |
| CSV / TSV | Kodowanie, separator, liczba wierszy, kolumny z typami, pierwsze wiersze |
| DOCX | Struktura nagłówków, tabele, liczba słów i znaków, autor i data |
| JSON | Typ główny, klucze, długość tablicy, głębokość zagnieżdżenia, przykładowe rekordy |

Wewnątrz `run_python` otwórz plik za pomocą modułu `heym_files`:

```python
import heym_files
import pandas as pd

df = pd.read_excel(heym_files.path("q3.xlsx"), sheet_name="Summary", usecols=["Region", "Amount"])
print(df.groupby("Region").Amount.sum())
df.to_csv(f"{heym_files.out_dir()}/by-region.csv", index=False)
```

## W Chacie

Załączaj pliki PDF, arkusze kalkulacyjne, DOCX, CSV lub JSON, obrazy (PNG, JPG, GIF, WebP) lub pliki tekstowe w [karcie Chat](../tabs/chat-tab.md), w Chacie Heym Work lub za pośrednictwem narzędzia MCP `heym_chat`. Jedna wiadomość może zawierać do 10 plików. Każdy plik jest zapisywany w Twoim Drive; w wiadomości umieszczane są tylko jego nazwa i ID. Chat bada plik, czyta fragment potrzebny do odpowiedzi i odpowiada tabelami lub wyciągami.

## W workflow

Uruchomienie otwiera wyłącznie własne pliki: te przesłane przez [węzeł Trigger Uploadu Pliku](../nodes/file-upload-trigger-node.md), te zapisane przez węzły w Drive oraz te pobrane przez [węzeł Drive](../nodes/drive-node.md) w kroku **Get** w tym samym uruchomieniu.

- **Węzeł Agent**: gdy dane wejściowe lub wiadomość agenta zawierają plik, agent automatycznie otrzymuje powyższe narzędzia dla tych plików.
- **Węzeł Code**: ustaw opcję **Files** na wyrażenie takie jak `$Upload.file.id`. Pliki zostaną zamontowane i wyświetlone w parametrze `params.files`.

## Limity

| Limit | Wartość |
|-----------|------|
| Pamięć na wywołanie | 2 GB |
| Czas na wywołanie | 120 sekund |
| Folder roboczy na sesję | 2 GB |
| Pliki wyjściowe na wywołanie | 20, do 100 MB każdy |
| Tekst z konsoli zwracany do modelu | 20 000 znaków |
| Pliki na wywołanie | 20 |

## Bezpieczeństwo

- Sandbox nie ma dostępu do sieci ani ustawień i sekretów Heym oraz działa jako nieuprzywilejowany użytkownik.
- Pliki są przetwarzane wyłącznie wewnątrz sandboxa.
- W Chacie dostęp jest zgodny z uprawnieniami Drive: otwierasz pliki własne oraz udostępnione Twoim zespołom.
- Otwarcie pliku w Chacie jest odnotowywane w dzienniku audytu.
- Zawartość plików jest traktowana ściśle jako dane; instrukcje wewnątrz nich nie są wykonywane.

## Wymagania

Analiza plików wymaga backendu sandbox na instancji Heym (Docker lub [Kubernetes](../getting-started/running-and-deployment.md#kubernetes)).

## Powiązane

- [Drive](./drive.md)
- [Węzeł Code](../nodes/code-node.md)
- [Węzeł Agent](../nodes/agent-node.md)
- [Karta Chat](../tabs/chat-tab.md)
