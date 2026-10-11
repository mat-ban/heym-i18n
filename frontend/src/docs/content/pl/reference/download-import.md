# Pobieranie i import

Eksportuj Workflows lub całe foldery jako pliki albo importuj je metodą przeciągnij i upuść. Funkcja przydatna do tworzenia kopii zapasowych, udostępniania oraz migracji Workflows między instancjami.

## Pobieranie Workflow (JSON)

**Lokalizacja:** Pasek narzędzi edytora → przycisk **Download** (widoczny na dużych ekranach)

**Zakres eksportu:**
- `nodes` – Wszystkie węzły na canvasie
- `edges` – Wszystkie połączenia między węzłami

**Nazwa pliku:** `{workflow-name}.json` (na podstawie nazwy Workflow)

**Format:** Schemat JSON opisano w sekcji [Struktura Workflow](./workflow-structure.md).

## Pobieranie folderu (ZIP)

**Lokalizacja:** Dashboard → zakładka Workflows → menu trzech kropek folderu → **Download as ZIP**

**Zakres eksportu:**
- Wszystkie Workflows w folderze oraz we wszystkich podfolderach, rekurencyjnie
- Hierarchia folderów zachowana jako katalogi wewnątrz pliku ZIP

**Struktura ZIP:**
```
FolderName/
  workflow1.json
  workflow2.json
  SubFolder/
    workflow3.json
    DeepSub/
      workflow4.json
```

Każdy plik `.json` zawiera `{ name, nodes, edges }`.

## Import

### Z Dashboardu (zakładka Workflows)

1. Przejdź do zakładki [Workflows](../tabs/workflows-tab.md)
2. Przeciągnij plik **JSON** lub **ZIP** na obszar Workflows

**Plik JSON:** Tworzony jest nowy Workflow. Nazwa Workflow pochodzi z pola `name` w pliku JSON lub z nazwy pliku, jeśli pole `name` jest nieobecne.

**Plik ZIP:** Cała struktura folderów jest odtwarzana na poziomie głównym. Każdy plik `.json` wewnątrz archiwum ZIP staje się Workflow umieszczonym w odpowiadającym mu folderze. Dane logowania oraz odwołania między Workflows, które nie istnieją w bieżącej instancji, są automatycznie czyszczone. Jeśli import części Workflows się nie powiedzie, wyświetlane jest podsumowanie z liczbą udanych operacji.

### Z canvasa (edytor)

1. Otwórz Workflow w edytorze
2. Przeciągnij plik JSON na canvas
3. Jeśli canvas zawiera już węzły lub krawędzie, wyświetlane jest okno potwierdzenia z pytaniem, czy zastąpić bieżący Workflow
4. Zaimportowane węzły i krawędzie zastępują bieżący Workflow lub są z nim scalane

## Formaty plików

### JSON (pojedynczy Workflow)

```json
{
  "nodes": [...],
  "edges": [...],
  "name": "Optional workflow name"
}
```

- `nodes` – Wymagane; tablica obiektów węzłów
- `edges` – Opcjonalne; tablica obiektów krawędzi (domyślnie `[]`)
- `name` – Opcjonalne; używane podczas tworzenia nowego Workflow w ramach importu z Dashboardu

### ZIP (folder)

Archiwum ZIP, w którym struktura katalogów odzwierciedla hierarchię folderów. Każdy plik to JSON Workflow (patrz powyżej). Nazwy folderów i Workflows pochodzą odpowiednio z nazw katalogów i plików.

Formaty węzłów i krawędzi opisano w sekcji [Struktura Workflow](./workflow-structure.md).

## Zastosowania

- **Kopia zapasowa** – Pobierz Workflows lub całe foldery przed istotnymi zmianami
- **Udostępnianie** – Eksportuj i udostępniaj pliki JSON członkom zespołu
- **Migracja** – Przenoś Workflows lub struktury folderów między instancjami Heym
- **Kontrola wersji** – Przechowuj JSON Workflows w repozytorium Git razem z kodem

## Powiązane

- [Struktura Workflow](./workflow-structure.md) – Format JSON dla węzłów i krawędzi
- [Zakładka Workflows](../tabs/workflows-tab.md) – Tworzenie Workflows i import metodą przeciągnij i upuść
- [Organizacja Workflows](./workflow-organization.md) – Foldery i podfoldery
- [Funkcje canvasa](./canvas-features.md) – Funkcje edytora, w tym import na canvas
