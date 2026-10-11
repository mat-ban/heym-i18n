# Single Sign-On

Heym może uwierzytelniać użytkowników za pomocą dowolnego zewnętrznego dostawcy **OpenID Connect**. Administrator wprowadza adres URL wystawcy w sekcji **Settings → SSO**, a Heym odczytuje wszystkie pozostałe endpointy z dokumentu odkrywania (discovery document) tego dostawcy.

Żaden dostawca nie jest zaszyty na stałe. Keycloak, Okta, Entra ID, Auth0, Google oraz każdy inny dostawca OIDC łączy się przez te same pola, ponieważ jedyną informacją przekazywaną do Heym jest adres wystawcy.

Logowanie hasłem i SSO działają równolegle. Logowanie hasłem można wyłączyć po zweryfikowaniu SSO.

## Zanim rozpoczniesz

Ustawienia SSO obowiązują w całej instancji, dlatego mogą je zmieniać wyłącznie administratorzy instancji. Administratorzy są wskazywani przez zmienną środowiskową, a nie przechowywani w bazie danych:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Pusta wartość nie przyznaje uprawnień nikomu. Po zmianie należy ponownie uruchomić backend. Konta z tej listy widzą również zakładkę **SSO** w Settings i zachowują dostęp hasłem nawet wtedy, gdy logowanie hasłem jest wyłączone — zobacz [Wyłączanie logowania hasłem](#disabling-password-sign-in).

## Rejestrowanie Heym u dostawcy

U swojego dostawcy tożsamości należy utworzyć **confidential client** (nazywany również rejestracją aplikacji) z następującymi ustawieniami:

| Ustawienie | Wartość |
|---------|-------|
| Protokół | OpenID Connect |
| Typ grantu | Authorization Code with PKCE |
| Uwierzytelnianie klienta | Włączone — Heym używa client secret |
| Redirect URI | Dokładna wartość wyświetlana w zakładce SSO w Heym |
| Scopes | `openid email profile` |

Heym wylicza redirect URI na podstawie `FRONTEND_URL` i wyświetla go w formularzu ustawień w trybie tylko do odczytu z przyciskiem kopiowania. Zawsze kończy się on ciągiem `/api/auth/sso/callback`. Należy go skopiować, a nie wpisywać ręcznie — niedopasowany redirect URI to najczęstsza przyczyna niepowodzenia konfiguracji, a dostawcy odrzucają go bez wyjaśnienia.

Dostawca musi zwracać zweryfikowany adres e-mail. Zobacz [Mapowanie kont](#account-mapping).

## Konfigurowanie Heym

Należy otworzyć **Settings → SSO**. Zakładka pojawia się wyłącznie dla kont z listy `HEYM_ADMIN_EMAILS`.

| Pole | Działanie |
|-------|--------------|
| **Enable single sign-on** | Wyświetla przycisk logowania na ekranie logowania. |
| **Issuer URL** | Bazowy adres URL dostawcy, na przykład `https://idp.example.com/realms/your-realm`. Heym dopisuje `/.well-known/openid-configuration` i odczytuje resztę z tego dokumentu. |
| **Client ID** | Identyfikator klienta od dostawcy. |
| **Client secret** | Przechowywany w formie zaszyfrowanej. Pozostawienie pola pustego zachowuje zapisaną wartość — Heym nigdy nie zwraca przechowywanego sekretu. |
| **Redirect URI** | Tylko do odczytu. Należy skopiować tę wartość do listy dozwolonych adresów u dostawcy. |
| **Scopes** | Domyślnie `openid email profile`. |
| **Sign-in button label** | Tekst na przycisku ekranu logowania, na przykład „Sign in with Okta". |
| **Create an account on first sign-in** | Czy nieznane osoby otrzymują konto Heym automatycznie. |
| **Allowed email domains** | Oddzielone przecinkami. Pusta wartość zezwala na dowolną domenę uwierzytelnianą przez dostawcę. |
| **Disable password sign-in** | Wyłącza uwierzytelnianie hasłem w całej instancji. |

### Najpierw przetestuj połączenie

**Test connection** pobiera dokument odkrywania oraz klucze podpisujące dostawcy, a następnie zwraca informację o znalezionym token endpoint. Test można uruchomić dla wystawcy, który został wpisany, ale jeszcze nie zapisany, dzięki czemu błędny adres URL kosztuje jedno kliknięcie, a nie zapis.

Test *rejestruje* wynik pozytywny tylko wtedy, gdy testowany wystawca jest tym już zapisanym. Test wersji roboczej informuje, czy adres URL się rozwiązuje; nie upoważnia do korzystania z konfiguracji, która nie została zapisana. Zmiana wystawcy, client ID, scopes lub sekretu kasuje zarejestrowany wynik z tego samego powodu.

## Jak działa logowanie

1. Użytkownik klika przycisk logowania na ekranie logowania.
2. Heym przekierowuje go do dostawcy z parametrami `state`, `nonce` oraz wyzwaniem PKCE.
3. Użytkownik uwierzytelnia się u dostawcy.
4. Dostawca przekierowuje z powrotem do callbacku Heym z kodem autoryzacyjnym.
5. Heym wymienia kod na tokeny i weryfikuje ID token względem opublikowanych kluczy dostawcy, sprawdzając podpis, audience, wystawcę, termin ważności oraz nonce.
6. Heym identyfikuje konto i wystawia własną sesję, dokładnie tak samo jak przy logowaniu hasłem.

Wszystko po kroku 6 pozostaje bez zmian: te same pliki cookie sesji, te same czasy życia tokenów, te same uprawnienia.

## Mapowanie kont

Heym identyfikuje konto w następującej kolejności:

1. **`(issuer, subject)`** — tożsamość potwierdzona przez dostawcę przy poprzednim logowaniu. Jest ona wiążąca i przetrwa zmianę adresu e-mail u dostawcy.
2. **Zweryfikowany adres e-mail** — istniejące konto Heym o tym adresie zostaje przypisane, a subject dostawcy jest od tego momentu na nim zapisywany.
3. **Nowe konto** — tworzone, jeśli opcja **Create an account on first sign-in** jest włączona, a domena jest dozwolona.

Adres e-mail uznaje się za zweryfikowany tylko wtedy, gdy ID token zawiera `email_verified: true`. Jeśli to zastrzeżenie ma wartość `false` lub go brakuje, logowanie zostaje odrzucone. Przypisanie istniejącego konta — lub utworzenie nowego — na podstawie adresu, którego dostawca nie poświadcza, stanowi ścieżkę przejęcia konta, dlatego Heym tego nie robi. Dostawcę, który nigdy nie emituje `email_verified`, należy skonfigurować tak, aby to robił.

Konta utworzone w ten sposób nie mają hasła. Logują się wyłącznie przez dostawcę.
## Wyłączanie logowania hasłem

Przełącznik **Disable password sign-in** pozostaje niedostępny, dopóki nie zostaną spełnione trzy warunki:

1. SSO jest włączone.
2. Test połączenia zakończył się powodzeniem, aby błędny issuer nie mógł zamknąć drzwi za sobą.
3. Co najmniej jedno konto w `HEYM_ADMIN_EMAILS` faktycznie posiada hasło.

Gdy przełącznik jest włączony, uwierzytelnianie hasłem jest odrzucane na wszystkich trzech powierzchniach, które je tworzą lub akceptują: formularzu logowania, **rejestracji** oraz stronie zgody MCP OAuth. Rejestracja jest uwzględniana, ponieważ wystawia hasło; pozostawienie jej otwartej umożliwiłoby obejście ustawienia przez każdego, kto ma dostęp do `/register`.

Konta wymienione w `HEYM_ADMIN_EMAILS` są zwolnione z wszystkich trzech ograniczeń. Kto może edytować plik środowiskowy, ten i tak może odzyskać instancję, dlatego ta gwarancja jest zapisana w kodzie, a nie w pamięci operatora.

### Dlaczego istnieje trzeci warunek

Administrator, którego konto Heym zostało utworzone *poprzez* SSO, nie posiada żadnego hasła. Zwolnienie pozwoliłoby mu przejść przez bramę, ale nie miałby się czym zalogować — instancja nie miałaby więc drogi powrotu, gdyby dostawca przestał działać. Heym odmawia wejścia w taki stan i informuje o tym.

W przypadku napotkania tego komunikatu należy zalogować się przez SSO i zarejestrować konto z hasłem na jednym ze swoich adresów administracyjnych (rejestracja pozostaje otwarta dla adresów administracyjnych właśnie z tego powodu) albo dodać adres, który już posiada hasło, do `HEYM_ADMIN_EMAILS`.

### Odzyskiwanie dostępu, gdy dostawca nie działa

W kolejności preferencji:

1. **Zaloguj się za pomocą awaryjnego hasła administratora.** Ekran logowania ukrywa formularz hasła, gdy logowanie hasłem jest wyłączone, dlatego należy kliknąć **Sign in with a password instead** pod przyciskiem SSO, aby go odsłonić. Formularz nie stanowi obejścia: każdy adres spoza `HEYM_ADMIN_EMAILS` jest nadal odrzucany, wraz z informacją o przyczynie.
2. **Dodaj siebie do `HEYM_ADMIN_EMAILS`** w pliku środowiskowym i uruchom ponownie backend. Konto, które już posiada hasło, może się wówczas zalogować.
3. **Ponownie włącz logowanie hasłem bezpośrednio w bazie danych**, jeśli żaden administrator nie posiada hasła:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Ponowne uruchomienie nie jest wymagane; ustawienie jest odczytywane przy każdym żądaniu.

Użytkownicy końcowi Portalu nie są objęci tymi zmianami. Uwierzytelniają się względem odrębnego katalogu — zobacz [Portal](./portal.md).

## Błędy logowania

Nieudane logowanie powraca do ekranu logowania z czytelnym komunikatem. Heym nigdy nie wyświetla surowego tekstu błędu dostawcy.

| Komunikat | Przyczyna |
|---------|-------|
| That sign-in attempt expired | Próba trwała dłużej niż dziesięć minut lub przeglądarka odrzuciła cookie transakcji. Należy spróbować ponownie. |
| Could not reach the identity provider | Wykrywanie lub wymiana tokenu nie powiodły się. Należy sprawdzić adres URL issuera oraz to, czy dostawca jest osiągalny z backendu. |
| The provider's response could not be verified | Token ID nie przeszedł walidacji podpisu, odbiorcy, issuera, terminu ważności lub nonce. Zazwyczaj niezgodność client ID. |
| The provider did not return an email address | Brak zakresu `email` lub dostawca nie udostępnia tego oświadczenia. |
| Your email address is not verified | Dostawca przesłał `email_verified: false` lub pominął to oświadczenie. |
| Your email domain is not allowed | Adres znajduje się poza **Allowed email domains**. |
| No Heym account exists for you | Opcja **Create an account on first sign-in** jest wyłączona i żadne konto nie pasuje. Administrator musi utworzyć konto. |
| Single sign-on is not configured | SSO jest wyłączone lub brakuje issuera, client ID bądź sekretu. |

## Uwagi dotyczące bezpieczeństwa

- **Sekret klienta jest szyfrowany w spoczynku** i nigdy nie jest zwracany przez żaden endpoint. Formularz ustawień informuje jedynie, czy sekret jest przechowywany.
- **Weryfikator PKCE nigdy nie opuszcza Heym.** Jest przechowywany w krótkotrwałym cookie `HttpOnly`, a nie w parametrze `state`, który przechodzi przez dostawcę w widocznej postaci.
- **Akceptowane są wyłącznie podpisy asymetryczne.** Algorytmy `none` oraz symetryczne są odrzucane niezależnie od tego, co reklamuje dostawca.
- **Docelowy adres po zalogowaniu jest walidowany** jako ścieżka w obrębie tego samego origin, dzięki czemu callback nie może zostać wykorzystany jako otwarte przekierowanie.
- **Każde logowanie jest audytowane.** Sukcesy, niepowodzenia i odmowy pojawiają się jako wpisy `auth.sso_login`, a zmiany konfiguracji jako `sso_settings.update` — zobacz [Audit Logging](./audit.md).

## Co nie jest obsługiwane

- **SAML.** OIDC to jedyny protokół.
- **Wiele jednoczesnych dostawców.** Jedna instancja łączy się z jednym dostawcą.
- **Mapowanie grup lub ról** na podstawie oświadczeń dostawcy.
- **Pojedyncze wylogowanie.** Wylogowanie z Heym nie powoduje wylogowania z dostawcy.
