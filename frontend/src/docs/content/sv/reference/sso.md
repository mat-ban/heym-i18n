# Single Sign-On

Heym kan autentisera personer mot valfri extern **OpenID Connect**-provider. En administratör anger en issuer-URL under **Settings → SSO**, och Heym läser alla övriga endpoints från den providerns discovery-dokument.

Ingen provider är hårdkodad. Keycloak, Okta, Entra ID, Auth0, Google och alla andra OIDC-providrar ansluter genom samma fält, eftersom det enda Heym får veta är issuer.

Inloggning med lösenord och SSO fungerar sida vid sida. Inloggning med lösenord kan stängas av när SSO har verifierats.

## Innan arbetet påbörjas

SSO-inställningar gäller för hela instansen, så endast instansadministratörer får ändra dem. Administratörer anges via en miljövariabel, inte i databasen:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Ett tomt värde ger ingen behörighet. Starta om backend efter ändringen. Konton i denna lista ser även fliken **SSO** i Settings och behåller lösenordsåtkomst även när inloggning med lösenord är avstängd — se [Disabling Password Sign-In](#disabling-password-sign-in).

## Registrera Heym hos providern

Skapa en **confidential client** (även kallad app registration) hos identitetsprovidern med:

| Inställning | Värde |
|---------|-------|
| Protokoll | OpenID Connect |
| Grant type | Authorization Code with PKCE |
| Client authentication | På — Heym använder en client secret |
| Redirect URI | Det exakta värde som visas i Heyms SSO-flik |
| Scopes | `openid email profile` |

Heym beräknar redirect URI från `FRONTEND_URL` och visar den skrivskyddat i inställningsformuläret med en kopieringsknapp. Den slutar alltid på `/api/auth/sso/callback`. Kopiera den i stället för att skriva in den — en felaktig redirect URI är det vanligaste konfigurationsfelet, och providers avvisar den utan förklaring.

Providern måste returnera en verifierad e-postadress. Se [Account Mapping](#account-mapping).

## Konfigurera Heym

Öppna **Settings → SSO**. Fliken visas endast för konton i `HEYM_ADMIN_EMAILS`.

| Fält | Vad det gör |
|-------|--------------|
| **Enable single sign-on** | Visar inloggningsknappen på inloggningsskärmen. |
| **Issuer URL** | Providerns bas-URL, till exempel `https://idp.example.com/realms/your-realm`. Heym lägger till `/.well-known/openid-configuration` och läser resten därifrån. |
| **Client ID** | Klientidentifieraren från providern. |
| **Client secret** | Lagras krypterat. Lämna fältet tomt för att behålla det lagrade värdet — Heym returnerar aldrig en secret som innehas. |
| **Redirect URI** | Skrivskyddad. Kopiera detta till providerns allowlist. |
| **Scopes** | `openid email profile` som standard. |
| **Sign-in button label** | Texten på inloggningsskärmens knapp, till exempel "Sign in with Okta". |
| **Create an account on first sign-in** | Huruvida okända personer automatiskt får ett Heym-konto. |
| **Allowed email domains** | Kommaseparerade. Tomt tillåter alla domäner som providern autentiserar. |
| **Disable password sign-in** | Stänger av lösenordsautentisering för hela instansen. |

### Testa anslutningen först

**Test connection** hämtar discovery-dokumentet och providerns signeringsnycklar och rapporterar sedan den token-endpoint som hittades. Det går att köra på en issuer som har angetts men ännu inte sparats, så en felaktig URL kostar ett klick i stället för en sparad konfiguration.

Ett test *registrerar* endast ett godkänt resultat när den testade issuern är den som redan är lagrad. Ett test av ett utkast anger huruvida URL:en kan lösas upp; det ger inte tillstånd för en konfiguration som inte är sparad. Ändring av issuer, client ID, scopes eller secret rensar det registrerade resultatet av samma anledning.

## Hur inloggning fungerar

1. Någon klickar på inloggningsknappen på inloggningsskärmen.
2. Heym omdirigerar till providern med en `state`, en `nonce` och en PKCE-utmaning.
3. Personen autentiserar sig hos providern.
4. Providern omdirigerar tillbaka till Heyms callback med en auktoriseringskod.
5. Heym byter koden mot tokens och verifierar ID-token mot providerns publicerade nycklar, och kontrollerar signaturen, audience, issuer, utgång och nonce.
6. Heym matchar kontot och utfärdar en egen session, precis som vid inloggning med lösenord.

Allt efter steg 6 är oförändrat: samma sessionscookies, samma token-livstider, samma behörigheter.

## Account Mapping

Heym matchar ett konto i denna ordning:

1. **`(issuer, subject)`** — identiteten som providern angav vid en tidigare inloggning. Denna är auktoritativ och överlever en e-poständring hos providern.
2. **Verifierad e-post** — ett befintligt Heym-konto med den adressen tas över, och providerns subject registreras på det från och med då.
3. **Ett nytt konto** — skapas om **Create an account on first sign-in** är på och domänen är tillåten.

En e-postadress räknas som verifierad endast när ID-token innehåller `email_verified: true`. Om detta claim är `false` eller saknas avvisas inloggningen. Att ta över ett befintligt konto — eller skapa ett nytt — med stöd av en adress som providern inte går i god för är en väg för account takeover, så Heym gör inte det. En provider som aldrig utfärdar `email_verified` behöver konfigureras att göra det.

Konton som skapas på detta sätt har inget lösenord. De loggar in endast via providern.
## Inaktivera lösenordsinloggning

Reglaget **Inaktivera lösenordsinloggning** förblir otillgängligt tills tre villkor är uppfyllda:

1. SSO är aktiverat.
2. Ett anslutningstest har godkänts, så att en felaktig issuer inte kan låsa dörren bakom sig.
3. Minst ett konto i `HEYM_ADMIN_EMAILS` har faktiskt ett lösenord.

När reglaget är på nekas lösenordsautentisering på alla tre ytor som utfärdar eller accepterar ett sådant: inloggningsformuläret, **registreringen** och MCP OAuth-samtyckssidan. Registreringen räknas eftersom den utfärdar ett lösenord; att lämna den öppen skulle göra inställningen kringgåelig för vem som helst som kan nå `/register`.

Konton som listas i `HEYM_ADMIN_EMAILS` är undantagna från alla tre. Den som kan redigera miljöfilen kan redan återställa instansen, så denna garanti finns i koden snarare än i en operatörs minne.

### Varför det tredje villkoret finns

En administratör vars Heym-konto skapades *genom* SSO har inget lösenord alls. Undantaget skulle släppa igenom dem genom grinden, men det finns inget för dem att logga in med — så instansen skulle inte ha någon väg tillbaka om leverantören gick ner. Heym vägrar att hamna i det tillståndet och säger det.

Om det meddelandet visas, logga in via SSO och registrera ett lösenordskonto på en administratörsadress (registreringen är fortfarande öppen för administratörsadresser av just denna anledning), eller lägg till en adress som redan har ett lösenord i `HEYM_ADMIN_EMAILS`.

### Återställning när leverantören är nere

I prioritetsordning:

1. **Logga in med ett nödlösenord för administratör.** Inloggningsskärmen döljer lösenordsformuläret när lösenordsinloggning är avstängd, så klicka på **Logga in med ett lösenord i stället** under SSO-knappen för att visa det. Formuläret är inte en kringgång: varje adress utanför `HEYM_ADMIN_EMAILS` nekas fortfarande, och får veta varför.
2. **Lägg till administratörsadressen i `HEYM_ADMIN_EMAILS`** i miljöfilen och starta om backend. Ett konto som redan har ett lösenord kan då logga in.
3. **Öppna lösenordsinloggning direkt i databasen**, om ingen administratör har ett lösenord alls:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Ingen omstart krävs; inställningen läses per begäran.

Portalanvändare påverkas inte. De autentiserar mot en separat katalog — se [Portal](./portal.md).

## Inloggningsfel

En misslyckad inloggning återvänder till inloggningsskärmen med ett läsbart meddelande. Heym visar aldrig leverantörens råa feltext.

| Meddelande | Orsak |
|---------|-------|
| That sign-in attempt expired | Försöket tog längre tid än tio minuter, eller så tappade webbläsaren transaktionscookien. Försök igen. |
| Could not reach the identity provider | Discovery eller tokenutbytet misslyckades. Kontrollera issuer-URL:en och att leverantören är nåbar från backend. |
| The provider's response could not be verified | ID-token misslyckades med validering av signatur, audience, issuer, utgång eller nonce. Vanligtvis en felaktig client ID. |
| The provider did not return an email address | Scopet `email` saknas, eller så släpper leverantören inte claimen. |
| Your email address is not verified | Leverantören skickade `email_verified: false`, eller utelämnade claimen. |
| Your email domain is not allowed | Adressen ligger utanför **Tillåtna e-postdomäner**. |
| No Heym account exists for you | **Skapa ett konto vid första inloggningen** är av och inget konto matchar. En administratör måste skapa ett. |
| Single sign-on is not configured | SSO är inaktiverat, eller så saknas issuer, client ID eller secret. |

## Säkerhetsanmärkningar

- **Client secret är krypterad i vila** och returneras aldrig av någon endpoint. Inställningsformuläret rapporterar endast huruvida en sådan är lagrad.
- **PKCE-verifieraren lämnar aldrig Heym.** Den hålls i en kortlivad `HttpOnly`-cookie i stället för i `state`-parametern, som passerar genom leverantören i öppen vy.
- **Endast asymmetriska signaturer accepteras.** `none` och symmetriska algoritmer avvisas oavsett vad leverantören annonserar.
- **Målet efter inloggning valideras** som en same-origin-sökväg, så callbacken kan inte användas som en öppen omdirigering.
- **Varje inloggning granskas.** Lyckade, misslyckade och nekade försök visas som `auth.sso_login`-rader, och konfigurationsändringar som `sso_settings.update` — se [Audit Logging](./audit.md).

## Vad som inte stöds

- **SAML.** OIDC är det enda protokollet.
- **Flera samtidiga leverantörer.** En instans ansluter till en leverantör.
- **Grupp- eller rollmappning** från leverantörens claims.
- **Single logout.** Att logga ut från Heym loggar inte ut användarsessionen från leverantören.
