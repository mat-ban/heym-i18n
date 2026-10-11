# Single Sign-On

Heym kan autentificere brugere mod enhver ekstern **OpenID Connect**-udbyder. En administrator indtaster en issuer URL under **Indstillinger → SSO**, og Heym læser alle andre endpoints fra udbyderens discovery-dokument.

Ingen udbyder er hardkodet. Keycloak, Okta, Entra ID, Auth0, Google og alle andre OIDC-udbydere forbindes gennem de samme felter, da det eneste Heym får at vide er issuer.

Password-login og SSO fungerer side om side. Password-login kan deaktiveres, når SSO er verificeret.

## Før start

SSO-indstillinger gælder for hele instansen, så kun instance-administratorer kan ændre dem. Administratorer angives via en miljøvariabel, ikke i databasen:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

En tom værdi giver ingen administratorrettigheder. Backend skal genstartes efter ændring. Konti på denne liste kan også se **SSO**-fanen i Indstillinger og beholder password-adgang, selv når password-login er deaktiveret — se [Deaktivering af password-login](#deaktivering-af-password-login).

## Registrering af Heym hos udbyder

I identitetsudbyderen oprettes en **confidential client** (også kaldet en app-registrering) med:

| Indstilling | Værdi |
|---------|-------|
| Protokol | OpenID Connect |
| Grant type | Authorization Code with PKCE |
| Client authentication | Tændt — Heym bruger en client secret |
| Redirect URI | Den præcise værdi vist i Heyms SSO-fane |
| Scopes | `openid email profile` |

Heym beregner redirect URI'en fra `FRONTEND_URL` og viser den skrivebeskyttet i indstillingsformularen med en kopieringsknap. Den ender altid på `/api/auth/sso/callback`. Kopier den snarere end at indtaste den manuelt — en forkert redirect URI er den hyppigste fejlkilde, og udbydere afviser den uden forklaring.

Udbyderen skal returnere en verificeret email-adresse. Se [Kontotilknytning](#kontotilknytning).

## Konfiguration af Heym

Åbn **Indstillinger → SSO**. Fanen vises kun for konti i `HEYM_ADMIN_EMAILS`.

| Felt | Funktionalitet |
|-------|--------------|
| **Aktivér single sign-on** | Viser login-knappen på login-skærmen. |
| **Issuer URL** | Udbyderens basis-URL, f.eks. `https://idp.example.com/realms/your-realm`. Heym tilføjer `/.well-known/openid-configuration` og læser resten derfra. |
| **Client ID** | Client-identifikatoren fra udbyderen. |
| **Client secret** | Lagres krypteret. Lad feltet være tomt for at beholde den gemte værdi — Heym viser aldrig en lagret secret. |
| **Redirect URI** | Skrivebeskyttet. Kopier denne til udbyderens tilladelsesliste. |
| **Scopes** | Som standard `openid email profile`. |
| **Login-knap tekst** | Teksten på login-knappen, f.eks. "Log ind med Okta". |
| **Opret konto ved første login** | Om ukendte brugere automatisk får en Heym-konto. |
| **Tilladte email-domæner** | Kommasepareret. Tomt tillader alle domæner, som udbyderen autentificerer. |
| **Deaktiver password-login** | Slår password-autentifikation fra for hele instansen. |

### Test forbindelsen først

**Test forbindelse** henter discovery-dokumentet og udbyderens signeringsnøgler, hvorefter den rapporterer det fundne token-endpoint. Det er muligt at teste en issuer, der er indtastet men ikke gemt endnu, så en forkert URL kun koster et klik i stedet for en gemning.

En test *registrerer* kun et bestået resultat, når den testede issuer er den samme som den gemte. En kladde-test viser kun, om URL'en kan løses; den godkender ikke en ikke-gemt konfiguration. Ændring af issuer, client ID, scopes eller secret nulstiller det registrerede resultat af samme grund.

## Sådan fungerer login

1. Brugeren klikker på login-knappen på login-skærmen.
2. Heym omdirigerer til udbyderen med en `state`, en `nonce` og en PKCE-udfordring.
3. Brugeren autentificerer sig hos udbyderen.
4. Udbyderen omdirigerer tilbage til Heyms callback med en autorisationskode.
5. Heym indbytter koden til tokens og verificerer ID-tokenet mod udbyderens offentliggjorte nøgler, hvor signaturen, audience, issuer, udløbstid og nonce tjekkes.
6. Heym løser kontoen og udsteder sin egen session, nøjagtigt som ved password-login.

Alt efter trin 6 forbliver uændret: samme session-cookies, samme token-levetider, samme tilladelser.

## Kontotilknytning

Heym løser en konto i denne rækkefølge:

1. **`(issuer, subject)`** — den identitet, udbyderen har bekræftet ved tidligere login. Dette er autoritativt og overlever en email-ændring hos udbyderen.
2. **Verificeret email** — en eksisterende Heym-konto med denne adresse overtages, og udbyderens subject registreres på den herefter.
3. **Ny konto** — oprettes, hvis **Opret konto ved første login** er aktiveret og domænet er tilladt.

En email tæller kun som verificeret, når ID-tokenet indeholder `email_verified: true`. Hvis denne claim er `false` eller mangler, afvises login. Overtagelse af en eksisterende konto — eller oprettelse af en ny — på baggrund af en adresse, som udbyderen ikke kan garantere, vil være en sikkerhedsrisiko, så Heym tillader det ikke. En udbyder, der aldrig sender `email_verified`, skal konfigureres til at gøre det.

Konti oprettet på denne måde har ikke noget password. De kan kun logge ind gennem udbyderen.
## Deaktivering af password-login

**Deaktiver password-login**-funktionen forbliver utilgængelig, indtil tre betingelser er opfyldt:

1. SSO er aktiveret.
2. En forbindelsestest er bestået, så en forkert udsteder ikke kan låse døren bag sig selv.
3. Mindst én konto i `HEYM_ADMIN_EMAILS` faktisk har et password.

Når funktionen er aktiveret, afvises password-godkendelse på alle tre overflader, der udsteder eller accepterer et: login-formularen, **registrering**, og MCP OAuth-samtykkesiden. Registrering tæller med, fordi den udsteder et password; hvis den forblev åben, ville indstillingen kunne omgås af alle, der har adgang til `/register`.

Konti angivet i `HEYM_ADMIN_EMAILS` er undtaget fra alle tre. Den, der kan redigere miljøfilen, kan allerede gendanne instansen, så denne garanti ligger i koden snarere end i en operatørs hukommelse.

### Begrundelse for den tredje betingelse

En administrator, hvis Heym-konto blev oprettet *via* SSO, har slet ikke noget password. Undtagelsen ville lade dem passere, men der er intet at logge ind med - så instansen ville have ingen vej tilbage, hvis udbyderen gik ned. Heym nægter at indtræde i denne tilstand og giver besked herom.

Hvis denne besked modtages, skal der logges ind via SSO og oprettes en password-konto på en af admin-adresserne (registrering forbliver åben for admin-adresser netop af denne grund), eller der skal tilføjes en adresse, der allerede har et password, til `HEYM_ADMIN_EMAILS`.

### Gendannelse, når udbyderen er nede

I rækkefølge af præference:

1. **Log ind med et nød-admin-password.** Login-skærmen skjuler password-formularen, når password-login er deaktiveret, så klik på **Log ind med password i stedet** under SSO-knappen for at få den vist. Formularen er ikke en omgåelse: alle adresser uden for `HEYM_ADMIN_EMAILS` afvises stadig, og får besked om hvorfor.
2. **Tilføj sig selv til `HEYM_ADMIN_EMAILS`** i miljøfilen og genstart backend'en. En konto, der allerede har et password, kan derefter logge ind.
3. **Genåbn password-login direkte i databasen**, hvis ingen admin har et password overhovedet:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Ingen genstart er nødvendig; indstillingen læses pr. anmodning.

Portal-slutbrugere er upåvirkede. De godkendes mod en separat mappe - se [Portal](./portal.md).

## Login-fejl

En mislykket login returnerer til login-skærmen med en læsbar besked. Heym viser aldrig udbyderens rå fejltekst.

| Besked | Årsag |
|---------|-------|
| Login-forsøget udløb | Forsøget tog længere end ti minutter, eller browseren mistede transaktionscookien. Prøv igen. |
| Kunne ikke nå identitetsudbyderen | Discovery eller token-udveksling mislykkedes. Tjek issuer-URL'en og at udbyderen kan nås fra backend'en. |
| Udbyderens svar kunne ikke verificeres | ID-tokenen fejlede signatur-, audience-, issuer-, udløbs- eller nonce-validering. Typisk en client ID-inkongruens. |
| Udbyderen returnerede ikke en e-mail-adresse | `email`-scope mangler, eller udbyderen frigiver ikke claim'et. |
| E-mail-adressen er ikke verificeret | Udbyderen sendte `email_verified: false`, eller udelod claim'et. |
| E-mail-domænet er ikke tilladt | Adressen er uden for **Tilladte e-mail-domæner**. |
| Der findes ingen Heym-konto til brugeren | **Opret konto ved første login** er deaktiveret, og ingen konto matcher. En administrator skal oprette en. |
| Single sign-on er ikke konfigureret | SSO er deaktiveret, eller issuer, client ID eller secret mangler. |

## Sikkerhedsnoter

- **Client secret er krypteret i hvile** og returneres aldrig af noget endpoint. Indstillingsformularen rapporterer kun, om en er gemt.
- **PKCE-verifikatoren forlader aldrig Heym.** Den opbevares i en kortvarig `HttpOnly` cookie snarere end i `state`-parameteren, som rundturer gennem udbyderen i klartekst.
- **Kun asymmetriske signaturer accepteres.** `none` og symmetriske algoritmer afvises uanset hvad udbyderen reklamerer med.
- **Post-login-destinationen valideres** som en same-origin-sti, så callback'en ikke kan bruges som en åben omdirigering.
- **Hvert login audits.** Successer, fejl og afvisninger vises som `auth.sso_login`-linjer, og konfigurationsændringer som `sso_settings.update` - se [Audit Logging](./audit.md).

## Hvad der ikke understøttes

- **SAML.** OIDC er den eneste protokol.
- **Flere samtidige udbydere.** En instans forbinder til én udbyder.
- **Gruppe- eller rollemapping** fra provider-claims.
- **Single logout.** Logout fra Heym logger ikke ud af udbyderen.
