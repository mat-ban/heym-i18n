# Single Sign-On

Heym kan personen authenticeren tegen elke externe **OpenID Connect**-provider. Een beheerder voert een issuer-URL in onder **Instellingen → SSO**, en Heym leest elk ander endpoint uit het discovery-document van die provider.

Geen enkele provider is hardcoded. Keycloak, Okta, Entra ID, Auth0, Google en elke andere OIDC-provider verbinden via dezelfde velden, omdat het enige dat Heym wordt meegedeeld de issuer is.

Aanmelden met wachtwoord en SSO werken naast elkaar. Aanmelden met wachtwoord kan worden uitgeschakeld zodra SSO is geverifieerd.

## Voordat u begint

SSO-instellingen gelden voor de gehele instantie, dus alleen beheerders van de instantie mogen deze wijzigen. Beheerders worden aangewezen via een omgevingsvariabele, niet opgeslagen in de database:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Een lege waarde verleent niemand toegang. Herstart de backend na het wijzigen. Accounts op deze lijst zien ook het tabblad **SSO** in Instellingen, en behouden toegang met wachtwoord zelfs wanneer aanmelden met wachtwoord is uitgeschakeld — zie [Aanmelden met wachtwoord uitschakelen](#aanmelden-met-wachtwoord-uitschakelen).

## Heym registreren bij uw provider

Maak in uw identity provider een **confidential client** aan (ook wel app-registratie genoemd) met:

| Instelling | Waarde |
|---------|-------|
| Protocol | OpenID Connect |
| Grant type | Authorization Code with PKCE |
| Client-authenticatie | Aan — Heym gebruikt een client secret |
| Redirect URI | De exacte waarde die wordt getoond in het SSO-tabblad van Heym |
| Scopes | `openid email profile` |

Heym berekent de redirect URI op basis van `FRONTEND_URL` en toont deze alleen-lezen in het instellingenformulier met een kopieerknop. Deze eindigt altijd op `/api/auth/sso/callback`. Kopieer deze in plaats van deze te typen — een niet-overeenkomende redirect URI is de meest voorkomende configuratiefout, en providers weigeren deze zonder uitleg.

Uw provider moet een geverifieerd e-mailadres retourneren. Zie [Accounttoewijzing](#accounttoewijzing).

## Heym configureren

Open **Instellingen → SSO**. Het tabblad verschijnt alleen voor accounts in `HEYM_ADMIN_EMAILS`.

| Veld | Wat het doet |
|-------|--------------|
| **Single sign-on inschakelen** | Toont de aanmeldknop op het inlogscherm. |
| **Issuer-URL** | De basis-URL van de provider, bijvoorbeeld `https://idp.example.com/realms/your-realm`. Heym voegt `/.well-known/openid-configuration` toe en leest de rest daaruit. |
| **Client-ID** | De client-identifier van uw provider. |
| **Client secret** | Versleuteld opgeslagen. Laat het veld leeg om de opgeslagen waarde te behouden — Heym retourneert nooit een secret die het bezit. |
| **Redirect URI** | Alleen-lezen. Kopieer deze naar de allowlist van uw provider. |
| **Scopes** | Standaard `openid email profile`. |
| **Label van aanmeldknop** | De tekst op de knop van het inlogscherm, bijvoorbeeld "Aanmelden met Okta". |
| **Een account aanmaken bij eerste aanmelding** | Of onbekende personen automatisch een Heym-account krijgen. |
| **Toegestane e-maildomeinen** | Door komma's gescheiden. Leeg staat elk domein toe dat de provider authenticeert. |
| **Aanmelden met wachtwoord uitschakelen** | Schakelt wachtwoordauthenticatie voor de gehele instantie uit. |

### Test eerst de verbinding

**Verbinding testen** haalt het discovery-document en de signing keys van de provider op, en rapporteert vervolgens het gevonden token-endpoint. U kunt dit uitvoeren op een issuer die u hebt getypt maar nog niet hebt opgeslagen, zodat een verkeerde URL een klik kost in plaats van een opslagactie.

Een test *registreert* alleen een geslaagd resultaat wanneer de geteste issuer de reeds opgeslagen issuer is. Een concepttest vertelt u of de URL resolveert; deze staat geen configuratie toe die niet is opgeslagen. Het wijzigen van de issuer, client-ID, scopes of secret wist het geregistreerde resultaat om dezelfde reden.

## Hoe aanmelden werkt

1. Iemand klikt op de aanmeldknop op het inlogscherm.
2. Heym verwijst deze door naar de provider met een `state`, een `nonce` en een PKCE-challenge.
3. Deze authenticeert bij de provider.
4. De provider verwijst terug naar de callback van Heym met een authorization code.
5. Heym wisselt de code in voor tokens en verifieert het ID-token tegen de gepubliceerde keys van de provider, waarbij de signature, audience, issuer, vervaldatum en nonce worden gecontroleerd.
6. Heym resolveert het account en geeft zijn eigen sessie uit, precies zoals bij aanmelden met wachtwoord.

Alles na stap 6 blijft ongewijzigd: dezelfde sessiecookies, dezelfde token-levensduur, dezelfde machtigingen.

## Accounttoewijzing

Heym resolveert een account in deze volgorde:

1. **`(issuer, subject)`** — de identiteit die de provider bij een eerdere aanmelding heeft beweerd. Dit is gezaghebbend en overleeft een e-mailwijziging bij de provider.
2. **Geverifieerd e-mailadres** — een bestaand Heym-account met dat adres wordt geclaimd, en het subject van de provider wordt vanaf dan daarop vastgelegd.
3. **Een nieuw account** — aangemaakt als **Een account aanmaken bij eerste aanmelding** is ingeschakeld en het domein is toegestaan.

Een e-mailadres geldt alleen als geverifieerd wanneer het ID-token `email_verified: true` bevat. Als die claim `false` is of ontbreekt, wordt de aanmelding geweigerd. Het claimen van een bestaand account — of het aanmaken van een nieuw account — op basis van een adres waarvoor de provider niet instaat, is een pad voor accountovername, dus Heym doet dit niet. Een provider die nooit `email_verified` uitzendt, moet worden geconfigureerd om dit wel te doen.

Accounts die op deze manier worden aangemaakt, hebben geen wachtwoord. Zij melden zich uitsluitend aan via de provider.

## Wachtwoordaanmelding uitschakelen

De schakelaar **Wachtwoordaanmelding uitschakelen** blijft niet beschikbaar totdat aan drie voorwaarden is voldaan:

1. SSO is ingeschakeld.
2. Een verbindingstest is geslaagd, zodat een verkeerde issuer de deur niet achter zichzelf kan vergrendelen.
3. Ten minste één account in `HEYM_ADMIN_EMAILS` daadwerkelijk een wachtwoord heeft.

Wanneer de schakelaar is ingeschakeld, wordt wachtwoordauthenticatie geweigerd op alle drie de oppervlakken die een wachtwoord aanmaken of accepteren: het aanmeldformulier, **registratie** en de MCP OAuth-toestemmingspagina. Registratie telt mee omdat het een wachtwoord uitgeeft; als dit open zou blijven, zou de instelling omzeild kunnen worden door iedereen die `/register` kan bereiken.

Accounts die in `HEYM_ADMIN_EMAILS` zijn vermeld, zijn van alle drie uitgezonderd. Wie het omgevingsbestand kan bewerken, kan de instantie toch al herstellen, dus deze garantie leeft in code in plaats van in het geheugen van een beheerder.

### Waarom de derde voorwaarde bestaat

Een beheerder wiens Heym-account *via* SSO is aangemaakt, heeft helemaal geen wachtwoord. De uitzondering zou hen voorbij de poort laten, maar er is niets waarmee zij kunnen aanmelden — dus de instantie zou geen weg terug hebben als de provider uitviel. Heym weigert die toestand te betreden en meldt dit ook.

Als u die melding tegenkomt, meld u dan aan via SSO en registreer een wachtwoordaccount op een van uw beheerdersadressen (registratie staat om precies deze reden nog open voor beheerdersadressen), of voeg een adres dat al een wachtwoord heeft toe aan `HEYM_ADMIN_EMAILS`.

### Herstellen wanneer de provider uitvalt

In volgorde van voorkeur:

1. **Meld u aan met een nood-wachtwoord voor beheerders.** Het aanmeldscherm verbergt het wachtwoordformulier wanneer wachtwoordaanmelding is uitgeschakeld, dus klik op **In plaats daarvan aanmelden met een wachtwoord** onder de SSO-knop om het weer te geven. Het formulier is geen omzeiling: elk adres buiten `HEYM_ADMIN_EMAILS` wordt nog steeds geweigerd, met vermelding van de reden.
2. **Voeg uzelf toe aan `HEYM_ADMIN_EMAILS`** in het omgevingsbestand en herstart de backend. Een account dat al een wachtwoord heeft, kan zich dan aanmelden.
3. **Schakel wachtwoordaanmelding rechtstreeks in de database weer in**, als geen enkele beheerder een wachtwoord heeft:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Er is geen herstart nodig; de instelling wordt per verzoek gelezen.

Eindgebruikers van het portaal worden niet beïnvloed. Zij authenticeren tegen een aparte directory — zie [Portaal](./portal.md).

## Aanmeldingsfouten

Een mislukte aanmelding keert terug naar het aanmeldscherm met een leesbare melding. Heym toont nooit de ruwe fouttekst van de provider.

| Melding | Oorzaak |
|---------|-------|
| Die aanmeldpoging is verlopen | De poging duurde langer dan tien minuten, of de browser heeft de transactiecookie laten vallen. Probeer het opnieuw. |
| Kon de identiteitsprovider niet bereiken | Discovery of de tokenuitwisseling is mislukt. Controleer de issuer-URL en of de provider bereikbaar is vanaf de backend. |
| Het antwoord van de provider kon niet worden geverifieerd | Het ID-token is niet geslaagd voor de validatie van handtekening, audience, issuer, vervaldatum of nonce. Meestal een verkeerde client-ID. |
| De provider heeft geen e-mailadres geretourneerd | De scope `email` ontbreekt, of de provider geeft de claim niet vrij. |
| Uw e-mailadres is niet geverifieerd | De provider stuurde `email_verified: false`, of liet de claim weg. |
| Uw e-maildomein is niet toegestaan | Het adres valt buiten **Toegestane e-maildomeinen**. |
| Er bestaat geen Heym-account voor u | **Een account aanmaken bij de eerste aanmelding** staat uit en er komt geen account overeen. Een beheerder moet er een aanmaken. |
| Single sign-on is niet geconfigureerd | SSO is uitgeschakeld, of de issuer, client-ID of het secret ontbreekt. |

## Beveiligingsopmerkingen

- **Het client-secret wordt versleuteld opgeslagen** en wordt door geen enkel endpoint geretourneerd. Het instellingenformulier meldt alleen of er een is opgeslagen.
- **De PKCE-verifier verlaat Heym nooit.** Deze wordt bewaard in een kortlevende `HttpOnly`-cookie in plaats van in de `state`-parameter, die in het volle zicht via de provider heen en weer gaat.
- **Alleen asymmetrische handtekeningen worden geaccepteerd.** `none` en symmetrische algoritmen worden geweigerd, ongeacht wat de provider adverteert.
- **De bestemming na aanmelding wordt gevalideerd** als een same-origin-pad, zodat de callback niet als open redirect kan worden gebruikt.
- **Elke aanmelding wordt geauditeerd.** Successen, mislukkingen en weigeringen verschijnen als `auth.sso_login`-regels, en configuratiewijzigingen als `sso_settings.update` — zie [Auditlogging](./audit.md).

## Wat niet wordt ondersteund

- **SAML.** OIDC is het enige protocol.
- **Meerdere gelijktijdige providers.** Eén instantie verbindt met één provider.
- **Groeps- of roltoewijzing** op basis van providerclaims.
- **Single logout.** Afmelden bij Heym meldt u niet af bij de provider.
