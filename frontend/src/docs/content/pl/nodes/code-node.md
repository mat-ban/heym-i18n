# Kod

Węzeł **Kod** uruchamia napisany przez użytkownika kod Python wraz z własnym plikiem `requirements.txt` i zwraca dane w formacie JSON. Każde wykonanie otrzymuje zupełnie nowy kontener, który jest niszczony po zakończeniu działania, dzięki czemu jedno wykonanie nigdy nie widzi ani nie wpływa na inne.

## Przegląd

| Właściwość | Wartość |
|----------|-------|
| Wejścia | 1 |
| Wyjścia | 1 |
| Wyjście | `$nodeLabel.result` (cokolwiek zwróciła funkcja `main`) oraz `$nodeLabel.logs` i `$nodeLabel.install` |

## Parametry

| Parametr | Typ | Opis |
|-----------|------|-------------|
| `label` | string | Identyfikator węzła (camelCase) |
| `codeSource` | string | Kod źródłowy Python. Musi definiować funkcję `main(params)` i zwracać wartość możliwą do serializacji do JSON |
| `codeParameters` | expression | Obiekt JSON wiążący dane workflow z kodem. Wyrażenia są rozwiązywane przed uruchomieniem kodu |
| `codeRequirements` | string | Zawartość `requirements.txt`, jeden pakiet w wierszu. Pusty pomija instalację |
| `codeAllowNetwork` | boolean | Czy sam kod może uzyskiwać dostęp do sieci (domyślnie `false`) |

## Funkcja `main`

Kod musi definiować funkcję `main` najwyższego poziomu przyjmującą jeden argument:

```python
def main(params):
    name = params.name
    return {"message": f"Hello, {name}!", "length": len(name)}
```

Instrukcje na poziomie modułu są wykonywane, ale tylko to, co zwróci funkcja `main`, staje się wyjściem węzła.

Edytor wyświetla numery wierszy, a przycisk rozwijania obok **Format** otwiera większy edytor, który zamyka się klawiszem `Esc` — zmiany są stosowane w trakcie pisania, więc nie ma nic do zapisania. Przycisk **Format** przeformatowuje kod za pomocą Ruffa, zachowując komentarze. Naprawia również uszkodzenia wcięć, które zwykle powstają przy wklejaniu: jednolicie wcięty blok, tabulatory pomieszane ze spacjami oraz wiersz przesunięty o jedną lub dwie spacje względem swojego bloku są poprawiane, a nie odrzucane. Rzeczywisty błąd składni jest zgłaszany wraz z numerem wiersza i kolumny. Formatowanie odbywa się w tym samym izolowanym kontenerze, w którym działa węzeł — bez sieci, bez środowiska backendu — więc wymaga Dockera tak samo jak wykonanie.

## Odczytywanie parametrów

`params` obsługuje notację kropkową, również przez zagnieżdżone obiekty i listy:

```python
def main(params):
    city = params.user.address.city
    first_order = params.orders[0].id
    return {"city": city, "first_order": first_order}
```

- `params["my key"]` odczytuje klucze, które nie są prawidłowymi identyfikatorami Python
- `params.get("maybe")` zwraca `None` zamiast zgłaszać błąd, gdy klucz jest nieobecny
- `params.to_dict()` zwraca zwykły słownik
- Odczyt klucza, który nigdy nie został podany, zgłasza błąd z nazwą klucza i listą dostępnych kluczy

## Wyjście

```json
{
  "result": { "message": "Hello, Heym!", "length": 4 },
  "logs": "",
  "install": { "ok": true, "tool": "none", "log": "" }
}
```

- `result` — wartość zwrócona przez funkcję `main`. Kolejne węzły odczytują `$nodeLabel.result.message`
- `logs` — wszystko, co kod wysłał do `print`, przechwycone osobno, aby nigdy nie uszkodziło wyniku
- `install` — które narzędzie zainstalowało zależności (`uv`, `pip` lub `none`) oraz jego dane wyjściowe

## Zależności

Pakiety należy wymienić w `requirements.txt` dokładnie tak, jak lokalnie:

```
requests==2.32.3
feedparser
```

Pakiety są instalowane za pomocą `uv` do katalogu tymczasowego przed uruchomieniem kodu; jeśli `uv` nie poradzi sobie z pakietem, Heym ponawia próbę z `pip`. Nic nie jest buforowane między uruchomieniami, więc ciężkie zależności dodają kilka sekund do każdego wykonania. Pozostawienie pustego pliku `requirements.txt` całkowicie pomija krok instalacji i jest zauważalnie szybsze.

Pakiety, które nie dostarczają wheel i wymagają kompilatora C, nie zainstalują się. Przyczyna pojawia się w `install.log`.

## Sieć

| Faza | Sieć |
|-------|---------|
| Instalowanie zależności | Zawsze włączona — pip i uv muszą mieć dostęp do PyPI |
| Uruchamianie kodu | Domyślnie wyłączona. `codeAllowNetwork` włącza ją |

Przy wyłączonym `codeAllowNetwork` wywołanie wychodzące, takie jak `requests.get(...)`, kończy się błędem połączenia. Jest to zamierzone ustawienie domyślne: większość węzłów Kod przekształca dane, które pobrał już inny węzeł. Zaleca się pobieranie danych za pomocą węzła **HTTP** i przekazywanie treści przez `codeParameters`.

## Sandbox i limity

Kod działa jako użytkownik niebędący rootem w kontenerze z usuniętymi wszystkimi uprawnieniami Linux, ustawionym `no-new-privileges` oraz systemem plików głównych tylko do odczytu. Nie otrzymuje gniazda Docker ani żadnych sekretów czy zmiennych środowiskowych backendu.

| Limit | Wartość |
|-------|-------|
| Pamięć | 512 MB |
| Procesory | 1 |
| Procesy | 256 |
| Limit czasu instalacji zależności | 120 sekund |
| Limit czasu wykonania | 60 sekund |

Są to stałe właściwości sandboxa, a nie konfiguracja.

> **Docker jest wymagany.** W przeciwieństwie do narzędzi Agent Python i umiejętności, węzeł Kod nie ma trybu lokalnego ani zmiennej środowiskowej, która go złagodzi. Bez osiągalnego demona Docker węzeł kończy się czytelnym błędem, zamiast uruchamiać kod w procesie backendu. W przypadku natywnego rozwoju przez `./run.sh` należy uruchomić Docker przed użyciem tego węzła. Zobacz [Bezpieczeństwo → Sandbox węzła Kod](../reference/security.md#code-node-sandbox).

## Użyj innego węzła, gdy pasuje

| Cel | Użyj |
|-------------|-----|
| Analiza lub budowa CSV, TSV, XML albo OCR pliku | [Konwerter](converter-node.md) |
| Wywołanie API HTTP | [HTTP](http-node.md) |
| Mapowanie lub zmiana nazw pól | [Set](set-node.md) |
| Uruchomienie innego workflow | [Execute](execute-node.md) |

Po węzeł **Kod** należy sięgnąć, gdy logika rzeczywiście nie pasuje do powyższych — niestandardowa matematyka, dedykowane parsowanie lub algorytm.
## Przykład

Ocena wierszy wygenerowanych przez węzeł nadrzędny:

```python
def main(params):
    rows = params.rows
    total = sum(r.amount * r.weight for r in rows)
    return {"total": round(total, 2), "count": len(rows)}
```

Gdy `codeParameters` ma wartość `{ "rows": "$fetchRows.result" }`, węzły podrzędne odczytują `$scoreRows.result.total`.
