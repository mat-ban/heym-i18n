# Single Sign-On

Heym poate autentifica utilizatorii prin orice furnizor extern **OpenID Connect**. Un administrator introduce un URL de issuer în **Settings → SSO**, iar Heym citește toate celelalte endpoint-uri din documentul de discovery al furnizorului respectiv.

Niciun furnizor nu este hardcodat. Keycloak, Okta, Entra ID, Auth0, Google și orice alt furnizor OIDC se conectează prin aceleași câmpuri, deoarece singurul lucru comunicat către Heym este issuer-ul.

Autentificarea prin parolă și SSO funcționează în paralel. Autentificarea prin parolă poate fi dezactivată după ce SSO este verificat.

## Înainte de a începe

Setările SSO se aplică la nivel de instanță, astfel încât doar administratorii de instanță le pot modifica. Administratorii sunt desemnați printr-o variabilă de mediu, nu stocați în baza de date:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

O valoare goală nu acordă drepturi nimănui. Reporniți backend-ul după modificare. Conturile din această listă văd de asemenea fila **SSO** în Settings și păstrează accesul prin parolă chiar și atunci când autentificarea prin parolă este dezactivată — consultați [Dezactivarea autentificării prin parolă](#disabling-password-sign-in).

## Înregistrarea Heym la furnizorul dumneavoastră

În furnizorul dumneavoastră de identitate, creați un **client confidențial** (numit și app registration) cu:

| Setare | Valoare |
|---------|-------|
| Protocol | OpenID Connect |
| Tip de grant | Authorization Code with PKCE |
| Autentificare client | Activată — Heym utilizează un client secret |
| Redirect URI | Valoarea exactă afișată în fila SSO din Heym |
| Scopes | `openid email profile` |

Heym calculează redirect URI din `FRONTEND_URL` și îl afișează read-only în formularul de setări, cu un buton de copiere. Se termină întotdeauna cu `/api/auth/sso/callback`. Copiați-l în loc să îl tastați — un redirect URI care nu corespunde este cea mai frecventă cauză de eșec la configurare, iar furnizorii îl resping fără explicații.

Furnizorul dumneavoastră trebuie să returneze o adresă de email verificată. Consultați [Maparea conturilor](#account-mapping).

## Configurarea Heym

Deschideți **Settings → SSO**. Fila apare doar pentru conturile din `HEYM_ADMIN_EMAILS`.

| Câmp | Ce face |
|-------|--------------|
| **Enable single sign-on** | Afișează butonul de autentificare pe ecranul de login. |
| **Issuer URL** | URL-ul de bază al furnizorului, de exemplu `https://idp.example.com/realms/your-realm`. Heym adaugă `/.well-known/openid-configuration` și citește restul de acolo. |
| **Client ID** | Identificatorul clientului de la furnizorul dumneavoastră. |
| **Client secret** | Stocat criptat. Lăsați câmpul gol pentru a păstra valoarea stocată — Heym nu returnează niciodată un secret pe care îl deține. |
| **Redirect URI** | Read-only. Copiați această valoare în lista de permisiuni a furnizorului dumneavoastră. |
| **Scopes** | `openid email profile` în mod implicit. |
| **Sign-in button label** | Textul de pe butonul ecranului de login, de exemplu "Sign in with Okta". |
| **Create an account on first sign-in** | Dacă persoanele necunoscute primesc automat un cont Heym. |
| **Allowed email domains** | Separate prin virgulă. Gol permite orice domeniu pe care furnizorul îl autentifică. |
| **Disable password sign-in** | Dezactivează autentificarea prin parolă la nivel de instanță. |

### Testați mai întâi conexiunea

**Test connection** preia documentul de discovery și cheile de semnare ale furnizorului, apoi raportează endpoint-ul de token găsit. Îl puteți rula pe un issuer pe care l-ați tastat dar nu l-ați salvat încă, astfel încât un URL greșit costă un clic în loc de o salvare.

Un test *înregistrează* un rezultat de succes doar atunci când issuer-ul testat este cel deja stocat. Un test pe o ciornă vă spune dacă URL-ul se rezolvă; nu validează o configurație care nu este salvată. Modificarea issuer-ului, client ID-ului, scopes-urilor sau secretului șterge rezultatul înregistrat din același motiv.

## Cum funcționează autentificarea

1. Cineva face clic pe butonul de autentificare de pe ecranul de login.
2. Heym îl redirecționează către furnizor cu un `state`, un `nonce` și o provocare PKCE.
3. Se autentifică la furnizor.
4. Furnizorul redirecționează înapoi către callback-ul Heym cu un cod de autorizare.
5. Heym schimbă codul pe token-uri și verifică ID token-ul față de cheile publicate ale furnizorului, verificând semnătura, audience, issuer, expirarea și nonce-ul.
6. Heym rezolvă contul și emite propria sesiune, exact cum face o autentificare prin parolă.

Tot ce urmează după pasul 6 rămâne neschimbat: aceleași cookie-uri de sesiune, aceleași durate de viață ale token-urilor, aceleași permisiuni.

## Maparea conturilor

Heym rezolvă un cont în această ordine:

1. **`(issuer, subject)`** — identitatea pe care furnizorul a afirmat-o la o autentificare anterioară. Aceasta este autoritativă și supraviețuiește unei schimbări de email la furnizor.
2. **Email verificat** — un cont Heym existent cu acea adresă este revendicat, iar subject-ul furnizorului este înregistrat pe el de atunci înainte.
3. **Un cont nou** — creat dacă **Create an account on first sign-in** este activat și domeniul este permis.

Un email contează ca verificat doar atunci când ID token-ul conține `email_verified: true`. Dacă acel claim este `false` sau lipsește, autentificarea este refuzată. Revendicarea unui cont existent — sau crearea unuia nou — pe baza unei adrese pe care furnizorul nu o garantează este o cale de preluare a contului, astfel încât Heym nu face acest lucru. Un furnizor care nu emite niciodată `email_verified` trebuie configurat să o facă.

Conturile create astfel nu au parolă. Se autentifică exclusiv prin furnizor.
## Dezactivarea autentificării prin parolă

Comutatorul **Disable password sign-in** rămâne indisponibil până când trei condiții sunt îndeplinite:

1. SSO este activat.
2. Un test de conexiune a trecut, astfel încât un issuer greșit să nu poată încuia ușa în urma sa.
3. Cel puțin un cont din `HEYM_ADMIN_EMAILS` are efectiv o parolă.

Când este activat, autentificarea prin parolă este refuzată pe toate cele trei suprafețe care emit sau acceptă una: formularul de autentificare, **înregistrarea** și pagina de consimțământ MCP OAuth. Înregistrarea contează deoarece emite o parolă; lăsarea ei deschisă ar face setarea ocolibilă de oricine poate accesa `/register`.

Conturile listate în `HEYM_ADMIN_EMAILS` sunt exceptate de la toate cele trei. Oricine poate edita fișierul de mediu poate deja recupera instanța, astfel încât această garanție există în cod, nu în memoria unui operator.

### De ce există a treia condiție

Un administrator al cărui cont Heym a fost creat *prin* SSO nu are nicio parolă. Exceptarea i-ar permite să treacă de poartă, dar nu are cu ce să se autentifice — astfel încât instanța nu ar avea nicio cale de întoarcere dacă providerul ar cădea. Heym refuză să intre în această stare și o comunică.

Dacă întâmpinați acel mesaj, autentificați-vă prin SSO și înregistrați un cont cu parolă pe una dintre adresele dumneavoastră de administrator (înregistrarea este încă deschisă pentru adresele de administrator exact din acest motiv), sau adăugați o adresă care are deja o parolă în `HEYM_ADMIN_EMAILS`.

### Recuperarea când providerul este indisponibil

În ordinea preferinței:

1. **Autentificați-vă cu o parolă de administrator de urgență.** Ecranul de autentificare ascunde formularul de parolă când autentificarea prin parolă este dezactivată, așa că faceți clic pe **Sign in with a password instead** sub butonul SSO pentru a-l afișa. Formularul nu este o ocolire: fiecare adresă din afara `HEYM_ADMIN_EMAILS` este în continuare refuzată, cu explicarea motivului.
2. **Adăugați-vă în `HEYM_ADMIN_EMAILS`** în fișierul de mediu și reporniți backend-ul. Un cont care are deja o parolă se poate apoi autentifica.
3. **Redeschideți autentificarea prin parolă direct în baza de date**, dacă niciun administrator nu are deloc o parolă:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Nu este necesară repornirea; setarea este citită la fiecare cerere.

Utilizatorii finali ai Portalului nu sunt afectați. Aceștia se autentifică printr-un director separat — consultați [Portal](./portal.md).

## Erori de autentificare

O autentificare eșuată revine la ecranul de autentificare cu un mesaj lizibil. Heym nu afișează niciodată textul brut al erorii providerului.

| Mesaj | Cauză |
|---------|-------|
| That sign-in attempt expired | Tentativa a durat mai mult de zece minute sau browserul a pierdut cookie-ul de tranzacție. Încercați din nou. |
| Could not reach the identity provider | Discovery sau schimbul de token a eșuat. Verificați URL-ul issuer-ului și faptul că providerul este accesibil din backend. |
| The provider's response could not be verified | ID token-ul a eșuat validarea semnăturii, audienței, issuer-ului, expirării sau nonce-ului. De obicei, o nepotrivire a client ID-ului. |
| The provider did not return an email address | Scope-ul `email` lipsește sau providerul nu eliberează claim-ul. |
| Your email address is not verified | Providerul a trimis `email_verified: false` sau a omis claim-ul. |
| Your email domain is not allowed | Adresa este în afara **Allowed email domains**. |
| No Heym account exists for you | **Create an account on first sign-in** este dezactivat și niciun cont nu corespunde. Un administrator trebuie să creeze unul. |
| Single sign-on is not configured | SSO este dezactivat sau issuer-ul, client ID-ul sau secretul lipsesc. |

## Note de securitate

- **Client secret-ul este criptat în repaus** și nu este returnat niciodată de vreun endpoint. Formularul de setări raportează doar dacă unul este stocat.
- **PKCE verifier nu părăsește niciodată Heym.** Acesta este păstrat într-un cookie `HttpOnly` de scurtă durată, mai degrabă decât în parametrul `state`, care face un round-trip prin provider la vedere.
- **Sunt acceptate doar semnături asimetrice.** `none` și algoritmii simetrici sunt respinși indiferent de ceea ce anunță providerul.
- **Destinația post-autentificare este validată** ca o cale same-origin, astfel încât callback-ul să nu poată fi folosit ca open redirect.
- **Fiecare autentificare este auditată.** Succesele, eșecurile și refuzurile apar ca linii `auth.sso_login`, iar modificările de configurare ca `sso_settings.update` — consultați [Audit Logging](./audit.md).

## Ce nu este acceptat

- **SAML.** OIDC este singurul protocol.
- **Mai mulți provideri simultan.** O instanță se conectează la un singur provider.
- **Maparea grupurilor sau rolurilor** din claim-urile providerului.
- **Single logout.** Deconectarea din Heym nu vă deconectează din provider.
