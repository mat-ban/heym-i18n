# Tworzenie pluginów

Pluginy Heym to zaufane pakiety zip instalowane przez operatora. Pakiet może
dodawać jeden lub więcej niestandardowych węzłów akcji lub triggerów bez
modyfikowania głównej aplikacji.

## Struktura pakietu

Pakiet zip pluginu musi zawierać plik `plugin.json` w katalogu głównym pakietu
oraz plik wejściowy Python wskazany w polu `entry` (domyślnie `handler.py`).

```text
acme-crm-plugin.zip
|-- plugin.json
|-- handler.py
|-- README.md
|-- icon.svg
`-- assets/
    `-- publisher.svg
```

Plik `README.md` jest opcjonalny i jest udostępniany jako strona dokumentacji
pluginu. Aby ustawić domyślną ikonę węzła, należy umieścić plik `icon.svg` w
katalogu głównym pakietu lub wskazać ścieżkę `icon` dla konkretnego węzła w
pliku `plugin.json`.

## Manifest

Gdy jeden pakiet udostępnia kilka węzłów, należy użyć manifestu `plugin.json`
obsługującego wiele węzłów:

```json
{
  "id": "acme-crm",
  "name": "Acme CRM",
  "version": "1.0.0",
  "description": "Internal CRM actions and triggers",
  "entry": "handler.py",
  "dependencies": ["requests>=2.32.0"],
  "nodes": [
    {
      "key": "createContact",
      "name": "Create Contact",
      "kind": "action",
      "function": "create_contact",
      "description": "Create a CRM contact",
      "icon": "assets/publisher.svg",
      "dslHint": "Use this when the workflow needs to create an Acme CRM contact.",
      "fields": [
        {
          "key": "email",
          "label": "Email",
          "type": "string",
          "required": true
        },
        {
          "key": "sendWelcome",
          "label": "Send welcome email",
          "type": "boolean",
          "default": false
        }
      ]
    },
    {
      "key": "contactCreated",
      "name": "Contact Created",
      "kind": "trigger",
      "function": "contact_created",
      "description": "Start when a contact event arrives"
    }
  ]
}
```

Obsługiwane są również starsze manifesty jednodęzłowe: należy pominąć pole
`nodes` i podać pola najwyższego poziomu `kind`, `fields`, `dslHint` oraz
`docSlug`.

## Pola manifestu

| Pole | Uwagi |
|-------|-------|
| `id` | Identyfikator pakietu zapisany małymi literami, zawierający litery, cyfry i myślniki. |
| `name` | Czytelna dla człowieka nazwa pakietu. |
| `version` | Wersja pakietu używana do wyświetlania i buforowania handlerów. |
| `description` | Krótki opis wyświetlany w interfejsie oraz w kontekście asystenta. |
| `entry` | Ścieżka do pliku handlera Python wewnątrz pakietu zip; domyślnie `handler.py`. |
| `dependencies` | Opcjonalne wymagania pip instalowane za pomocą `uv pip install`. |
| `nodes` | Niestandardowe węzły udostępniane przez ten pakiet. |

Każdy węzeł wymaga unikalnego pola `key`, nazwy `name` oraz pola `kind` o
wartości `action` lub `trigger`. Jeśli pole `function` zostanie pominięte,
akcje wywołują funkcję `run`, a triggery funkcję `trigger`.

Obsługiwane typy pól to `string`, `number`, `boolean` oraz `select`. Pola typu
select korzystają z tablicy `options` zawierającej obiekty
`{ "label": "...", "value": "..." }`. Dla pól wymaganych należy ustawić
`required`, a dla danych maskowanych `secret`. Manifest przyjmuje również
metadane pól `default`, `dynamic` oraz `expression`; są one przechowywane wraz
z manifestem, jednak węzły pluginów odczytują obecnie zapisaną konfigurację
węzła w czasie działania, zamiast automatycznie uzupełniać brakującą
konfigurację na podstawie wartości domyślnych.

Pola tekstowe inne niż sekretne są renderowane z użyciem interfejsu wprowadzania
wyrażeń. W czasie działania każda zapisana wartość konfiguracji tekstowej
rozpoczynająca się od znaku `$` jest rozwiązywana przed wywołaniem handlera.

## Funkcje handlerów

Handlery akcji otrzymują dane wejściowe workflow, rozwiązaną konfigurację oraz
niewielki kontekst:

```python
def create_contact(inputs, config, ctx):
    email = config["email"]
    return {
        "email": email,
        "nodeId": ctx["node_id"],
    }
```

Handlery triggerów otrzymują rozwiązaną konfigurację oraz kontekst:

```python
def contact_created(config, ctx):
    return {
        "event": "contact.created",
        "nodeLabel": ctx["node_label"],
    }
```

Aby udostępnić nazwane pola wyjściowe, należy zwrócić słownik. Jeśli handler
zwróci inny typ, Heym opakuje go jako `{ "value": result }`.

## Instalacja i środowisko uruchomieniowe

Pluginy są domyślnie wyłączone. Operatorzy włączają je za pomocą zmiennej
`HEYM_PLUGINS_ENABLED=true` i ograniczają zarządzanie nimi za pomocą zmiennej
`HEYM_PLUGIN_ADMIN_EMAILS`. Pliki zainstalowanych pluginów znajdują się w
katalogu `HEYM_PLUGINS_DIR` i w środowiskach kontenerowych powinny być montowane
w sposób trwały.

Kod pluginu to zaufany, instalowany przez operatora kod Python uruchamiany w
tym samym procesie co backend. Ma on dostęp do sieci oraz zainstalowanych
bibliotek, dlatego należy instalować wyłącznie pakiety, które są akceptowalne do
uruchamiania z takim samym poziomem zaufania jak sam Heym.
