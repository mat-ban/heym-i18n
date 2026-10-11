# Zespoły

Zespoły umożliwiają jednoczesne udostępnianie workflow, danych logowania, zmiennych globalnych, magazynów wektorowych oraz plików Drive grupie użytkowników.

## Przegląd

- **Zespół** – Nazwana grupa z twórcą i członkami
- **Twórca** – Zawsze członek; może edytować zespół, usuwać zespół, dodawać członków
- **Członek** – Może dodawać i usuwać innych członków (z wyjątkiem twórcy); ma dostęp do zasobów udostępnionych zespołowi

## Tworzenie i zarządzanie zespołami

Zespoły tworzy się z poziomu [zakładki Teams](../tabs/teams-tab.md). Członków dodaje się za pomocą adresu e-mail; muszą posiadać konto. Twórca nie może zostać usunięty. Usunięcie zespołu usuwa wszystkie udostępnienia zespołowe.

## Model udostępniania

Zasoby można udostępniać:

1. **Pojedynczym użytkownikom** – Za pomocą adresu e-mail (udostępnienie użytkownik–użytkownik)
2. **Zespołom** – Poprzez wybór zespołu (udostępnienie zespołowe)

Oba modele się sumują. Użytkownik uzyskuje dostęp, jeśli:

- Zasób został mu udostępniony bezpośrednio (udostępnienie użytkownikowi), lub
- Jest członkiem zespołu, któremu udostępniono zasób

## Co można udostępniać zespołom

| Zasób | Miejsce udostępniania |
|----------|----------------|
| Workflows | Okno udostępniania w edytorze workflow |
| Szablony workflow | Okno udostępniania podczas tworzenia/edycji szablonu workflow |
| Szablony węzłów | Okno udostępniania podczas tworzenia/edycji szablonu węzła |
| Dane logowania | Okno udostępniania w zakładce Credentials |
| Zmienne globalne | Okno udostępniania w zakładce Variables |
| Magazyny wektorowe | Okno udostępniania w zakładce Vectors |
| Pliki Drive | Okno udostępniania w zakładce Drive lub operacje `shareWithMyTeams` / `unshareWithMyTeams` węzła Drive |

W przypadku szablonów, gdy widoczność ustawiona jest na **Specific users**, można również wybierać zespoły. Wszyscy członkowie wybranych zespołów uzyskują dostęp do szablonu.
Udostępnienia zespołowe plików Drive są tylko do odczytu dla członków zespołu; właściciel pliku zachowuje uprawnienia zarządzania.

## Endpointy API

- `GET /api/teams` – Lista zespołów, do których należy użytkownik
- `GET /api/teams/{id}` – Szczegóły zespołu wraz z członkami
- `GET /api/teams/{id}/shared-entities` – Zwraca encje udostępnione zespołowi (workflows, dane logowania, zmienne globalne, magazyny wektorowe, pliki, szablony workflow, szablony węzłów)
- `POST /api/teams` – Utwórz zespół
- `PATCH /api/teams/{id}` – Zaktualizuj zespół
- `DELETE /api/teams/{id}` – Usuń zespół (tylko twórca)
- `POST /api/teams/{id}/members` – Dodaj członka (body: `{ "email": "..." }`)
- `DELETE /api/teams/{id}/members/{user_id}` – Usuń członka

Udostępnienia zespołowe dla poszczególnych zasobów:

- `GET/POST/DELETE /api/workflows/{id}/team-shares` – body żądania POST przyjmuje `permission` (`read` lub `write`, domyślnie `write`); ponowne przesłanie istniejącego zespołu aktualizuje jego uprawnienie
- `GET/POST/DELETE /api/credentials/{id}/team-shares`
- `GET/POST/DELETE /api/global-variables/{id}/team-shares`
- `GET/POST/DELETE /api/vector-stores/{id}/team-shares`
- `PATCH /api/files/{id}/team-sharing`

## Powiązane

- [Zakładka Teams](../tabs/teams-tab.md) – Tworzenie i zarządzanie zespołami
- [Zakładka Templates](../tabs/templates-tab.md) – Udostępnianie szablonów workflow i węzłów zespołom
- [Udostępnianie danych logowania](./credentials-sharing.md) – Udostępnianie danych logowania użytkownikom i zespołom
- [Organizacja workflow](./workflow-organization.md) – Foldery i udostępnianie workflow
