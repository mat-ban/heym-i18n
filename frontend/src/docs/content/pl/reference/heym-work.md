# Heym Work

**Heym Work** to dodatkowy interfejs dla zespołów biznesowych, zbudowany na bazie Heym. Użytkownicy opisują zadanie własnymi słowami, odpowiadają na kilka pytań i otrzymują workflow utworzony oraz przetestowany przez Heym. Pracują na stronach stworzonych specjalnie dla nich, odpowiadają na prośby o weryfikację i widzą każde wykonanie oznaczone nazwiskiem wykonawcy. Heym wykonuje wszystkie zadania w tle.

Heym Work działa jako osobny kontener obok Heym, na oddzielnej licencji od zespołu Heym. Więcej informacji oraz możliwość zamówienia wersji próbnej znajduje się pod adresem [heym.run/enterprise](https://heym.run/enterprise). Krótki dwuminutowy przewodnik wideo jest dostępny jako [film o Heym Work](https://youtu.be/5Z2gGo6bcpU).

## Co zyskują zespoły biznesowe

| Obszar | Działanie |
|--------|-----------|
| **Chat** | Opisywanie zadań tekstem lub głosem. Heym pyta o potrzebne informacje, tworzy workflow, testuje go i oznacza jako Zweryfikowany. |
| **Flows** | Redaktorzy budują flow z opcji zamiast na canvasie: co go uruchamia, opcjonalny szkic AI oraz akcje w Slacku, Google Sheets i poczcie e-mail. Odpowiedzi ze Slacka wznawiają uruchomienie, a zatwierdzenia oczekują również w Aktywności. Zobacz [Flows](#flows). |
| **Strony** | Przypięte strony z widżetami: liczby, wykresy, tabele ze wskaźnikami statusu, strefy upuszczania plików i zatwierdzenia. Wiersz tabeli może otwierać własną stronę szczegółów. |
| **Zatwierdzenia** | Weryfikacje z kroków [Human-in-the-Loop](./human-in-the-loop.md) oczekują w sekcji Aktywność oraz na stronach, z opcjami Zatwierdź, Poproś o zmiany i Odrzuć. |
| **Aktywność** | Każde wykonanie z informacją o osobie, która je uruchomiła, oraz instancji realizującej. |
| **Role** | Właściciel, Edytor i Przeglądający. Logowanie odbywa się przez mechanizm [Single Sign-On](./sso.md) skonfigurowany w Heym. |
| **Wersje branżowe** | Wersje dla prawa, edukacji, finansów, logistyki, energetyki i e-commerce zawierają gotowe strony, przykładowe dane i dedykowane workflow dla danej branży. |

## Flows

**Flows** znajduje się w menu Heym Work dla Redaktorów i Właścicieli. Flow składa się z wyborów zamiast węzłów, a Heym Work zapisuje go jako zwykły workflow Heym za pośrednictwem Heym API w imieniu osoby, która go utworzyła. Zasady dostępu, historia edycji i synchronizacja triggerów Heym obowiązują tak samo jak w edytorze, a każde uruchomienie pojawia się w Aktywności jak każde inne.

| Część | Wybory |
|---|---|
| **Co go uruchamia** | Na żądanie, według harmonogramu, na wiadomość Slack, po zmianie karty Google Sheets (dodanie, zmiana lub usunięcie wierszy) lub po nadejściu e-maila do skrzynki. Triggery arkuszy i poczty sprawdzają co 1, 5, 15 lub 60 minut. |
| **Szkic AI** (opcjonalny) | Model i instrukcje przekształcają to, co uruchomiło flow, w tekst dla kolejnych kroków. Flow, który nie zaczyna się od arkusza ani e-maila, może najpierw odczytać ostatnie wiadomości Slack z kanału lub wątku. |
| **Co dzieje się dalej** | Akcje w kolejności w dowolnym z trzech narzędzi, niezależnie od tego, co uruchomiło flow. **Slack:** wiadomość na kanale, wiadomość bezpośrednia, formularz, wiadomość z przyciskami, zatwierdzenie, odpowiedź w wątku, aktualizacja wiadomości i ostateczny wynik. **Google Sheets:** dodaj wiersz lub zaktualizuj zmieniony wiersz. **E-mail:** wyślij e-mail. |

- **Odpowiedzi kontynuują uruchomienie.** Zatwierdzenie, przyciski lub formularz wstrzymują uruchomienie do momentu uzyskania odpowiedzi w Slacku. Zatwierdzenie oczekuje również w Aktywności, a decyzja w dowolnym miejscu usuwa przyciski z wiadomości Slack. Kolejne kroki Slack pozostają w wątku pierwszej wiadomości.
- **Jedna karta Połączeń.** Każdy flow pokazuje obszar roboczy Slack, konto Google Sheets i skrzynki pocztowe, z których odczytuje i wysyła. Są to poświadczenia Heym: **Slack Bot** (token bota, `xoxb-…`), **Google Sheets**, **IMAP** oraz **SMTP**; brakujące poświadczenie można dodać bezpośrednio z poziomu flow.
- **Jedna aplikacja Slack dla każdego flow.** W aplikacji Slack ustaw adres URL żądania interaktywności na `https://<twój Heym>/api/slack/interactions/<id poświadczenia>` oraz adres URL żądania subskrypcji zdarzeń na `https://<twój Heym>/api/slack/events/<id poświadczenia>`. Heym Work wyświetla oba dla wybranego połączenia. Wszystkie flow korzystające z tych poświadczeń współdzielą je.
- **Triggery Slack wybierają, czego słuchają:** wiadomości na kanałach i w wiadomościach bezpośrednich, bezpośrednie wiadomości do bota, wzmianki o bocie lub wiadomości na pojedynczym kanale. Własne wpisy bota nigdy nie uruchamiają flow.
- **Wymagania.** Flows wymagają wersji Heym 0.0.131 lub nowszej.

Kroki budowane przez flow to te same węzły, których można używać na canvasie: [Slack](../nodes/slack-node.md), [Slack Trigger](../nodes/slack-trigger-node.md), [Google Sheets](../nodes/google-sheets-node.md), [Google Sheets Trigger](../nodes/google-sheets-trigger-node.md), [IMAP Trigger](../nodes/imap-trigger-node.md), [Send Email](../nodes/send-email-node.md) oraz [Cron](../nodes/cron-node.md).

## Podłączanie Heym Work

Pełny proces instalacji — od pierwszego polecenia do strony głównej — przedstawia [film instalacyjny](https://youtu.be/zXGfg1HPSLk).

Połączenie konfiguruje się w sekcji **Ustawienia → Heym Work**. Ta zakładka jest widoczna wyłącznie dla administratorów instancji wymienionych w zmiennej `HEYM_ADMIN_EMAILS`.

| Pole | Działanie |
|------|-----------|
| **Adres Heym Work** | Adres URL, pod którym działa Heym Work, na przykład `https://work.example.com`. Następuje tam przekierowanie po zalogowaniu. Należy kliknąć **Zapisz**. |
| **Klucz integracji** | Przycisk **Wygeneruj klucz** tworzy klucz używany przez Heym Work do każdego żądania skierowanego do Heym. Jest on wyświetlany tylko raz, wraz z przyciskiem kopiowania. Heym przechowuje wyłącznie jego skrót. |
| **Włącz Heym Work** | Aktywuje połączenie. Wymaga uprzedniego podania adresu oraz klucza. |
| **Wydania branżowe i zespołowe** | Wydania dla branży prawniczej, edukacji, finansów, logistyki, energii i e-commerce, a także wydania IT, sprzedaży, marketingu i HR dla zespołów firmowych otwierają się ze stronami, przykładowymi danymi i workflowami dla tej pracy. |

Następnie należy otworzyć adres Heym Work i ukończyć konfigurację:

1. **Licencja**: wprowadzić klucz licencyjny otrzymany od zespołu Heym.
2. **Heym**: wprowadzić adres Heym oraz klucz integracji.
3. **Właściciel**: zalogować się kontem wskazanym jako Właściciel Heym Work.

Otwiera się strona główna, gotowa do pracy zespołu.

### Rotacja klucza

Opcja **Zmień klucz** zastępuje klucz integracji. Heym Work przestaje działać do momentu podania nowego klucza w jego ustawieniach, a wszyscy zalogowani użytkownicy Heym Work zostają wylogowani. Należy z niej skorzystać w przypadku podejrzenia wycieku klucza lub odejścia osoby, która miała do niego dostęp.

### Odłączanie Heym Work

Wyłączenie przełącznika **Włącz Heym Work** przerywa połączenie. Heym Work prosi wówczas ponownie o podanie klucza Heym. Heym nieprzerwanie wykonuje wszystkie workflow, harmonogramy i webhooki w obu przypadkach.

## Model bezpieczeństwa

- **Każda zmiana przechodzi przez Heym.** Heym Work odczytuje prezentowane dane z bazy danych Heym i przesyła każde działanie zabezpieczonym kluczem kanałem do Heym, gdzie Heym stosuje własne reguły uprawnień. Heym Work przechowuje własne dane w odrębnym schemacie `heym_work`.
- **Klucz jest szyfrowany w spoczynku w postaci skrótu.** Heym porównuje skrót nadesłanego klucza i nigdy nie zapisuje samego klucza w postaci jawnej.
- **Uwierzytelnianie pozostaje w Heym.** Użytkownicy logują się za pośrednictwem Heym, korzystając z dostawcy tożsamości, gdy [SSO](./sso.md) jest aktywne.
- **Wszystkie modyfikacje są rejestrowane.** Zapisanie konfiguracji oraz rotacja klucza zapisują wpisy `work_integration.update` i `work_integration.key_rotate` w [dzienniku audytu](./audit.md).

## Licencjonowanie

Heym Work wymaga własnego klucza licencyjnego, wydawanego przez zespół Heym. Każdego dnia Heym Work przesyła do heym.run swój identyfikator licencji, identyfikator instalacji, liczbę aktywnych użytkowników w ostatnich 30 dniach, łączną liczbę członków, liczbę uruchomień w ostatnich 24 godzinach oraz wersje Heym i Heym Work. Zawartość workflow, dane wejściowe, wyniki i poświadczenia pozostają na lokalnych serwerach.

Jeśli codzienna synchronizacja zawiedzie przez 30 dni, rozpoczyna się 14-dniowy okres prolongaty, po którym interfejs Heym Work poprosi Właściciela o podanie klucza. Wersja próbna działa do ostatniego wyznaczonego dnia i wznawia działanie po przedłużeniu przez zespół Heym (obowiązuje jedna wersja próbna na instalację). Sam Heym działa bez zakłóceń przez cały ten czas. W środowiskach sieciowych bez dostępu do Internetu stosuje się licencję offline udostępnianą pod adresem enterprise@heym.run.

## Wideo

Wszystkie materiały wideo dotyczące Heym Work znajdują się na [liście odtwarzania Heym Work](https://www.youtube.com/playlist?list=PLBLCDjFQgoPQ).

## Powiązane tematy

- [Enterprise](./enterprise.md): Licencjonowanie komercyjne i wsparcie
- [Single Sign-On](./sso.md): Mechanizm logowania używany przez Heym Work
- [Human-in-the-Loop](./human-in-the-loop.md): Weryfikacje wyświetlane w Heym Work
- [Dziennik audytu](./audit.md): Wpisy rejestrowane podczas modyfikacji połączenia
- [Ustawienia](./user-settings.md): Miejsce, w którym znajduje się zakładka Heym Work
