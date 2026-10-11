# Zakładka Teams

Zakładka **Teams** umożliwia tworzenie i zarządzanie zespołami w celu udostępniania workflows, danych logowania, zmiennych, magazynów wektorowych oraz plików Drive grupom użytkowników.

<video src="/features/showcase/teams.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/teams.webm">▶ Obejrzyj demonstrację Teams</a></p>

## Tworzenie zespołu

1. Kliknij **New Team**
2. Wprowadź nazwę i opcjonalny opis
3. Kliknij **Create**

Twórca zespołu staje się automatycznie jego pierwszym członkiem.

## Zarządzanie członkami

- **Dodawanie członka** – Wprowadź adres e-mail użytkownika w oknie szczegółów zespołu i kliknij **Add**
- **Usuwanie członka** – Kliknij X obok członka (twórca nie może zostać usunięty)
- **Edycja zespołu** – Twórcy mogą edytować nazwę i opis
- **Usuwanie zespołu** – Twórcy mogą usunąć zespół; wszystkie udostępnienia zespołu zostaną usunięte
- **Udostępnione zasoby** – Okno szczegółów zespołu wyświetla workflows, dane logowania, zmienne, magazyny wektorowe, pliki Drive, szablony workflow oraz szablony węzłów udostępnione zespołowi. Kliknij workflow, aby otworzyć go w edytorze; przełącz na odpowiednią zakładkę, aby wyświetlić pozostałe zasoby.

## Udostępnianie zespołom

Zasoby można udostępniać zespołom z następujących miejsc:

- **Workflows** – Okno udostępniania w edytorze workflow
- **Szablony workflow** – Okno udostępniania podczas tworzenia/edycji szablonu workflow (widoczność: Specific users)
- **Szablony węzłów** – Okno udostępniania podczas tworzenia/edycji szablonu węzła (widoczność: Specific users)
- **Dane logowania** – Okno udostępniania w zakładce Credentials
- **Zmienne** – Okno udostępniania w zakładce Variables
- **Magazyny wektorowe** – Okno udostępniania w zakładce Vectors
- **Dashboardy** – Ustawienia dashboardu w zakładce Dashboard (odczyt lub zapis)
- **Pliki Drive** – Okno udostępniania w zakładce Drive lub operacje węzła Drive `shareWithMyTeams` / `unshareWithMyTeams`

Udostępnienie zespołowi zapewnia dostęp wszystkim jego członkom. Szczegóły znajdują się w sekcji [Teams](../reference/teams.md).

Podczas udostępniania workflow zespołowi należy również udostępnić temu samemu zespołowi dane logowania i podrzędne workflows, od których ten workflow zależy. Sam dostęp do workflow nie przyznaje dostępu do danych logowania ani podrzędnych workflows.

## Integracja z Chat

Asystent AI w [zakładce Chat](./chat-tab.md) może wyświetlić listę zespołów. Wpisz „my teams", aby zobaczyć, do których zespołów należysz.

## Powiązane

- [Teams](../reference/teams.md) – Dokumentacja zespołów i model udostępniania
- [Credentials Sharing](../reference/credentials-sharing.md) – Udostępnianie danych logowania użytkownikom i zespołom
- [Workflow Organization](../reference/workflow-organization.md) – Foldery i udostępnianie
- [Contextual Showcase](../reference/contextual-showcase.md) – Zwięzły przewodnik po powierzchniach dashboardu
