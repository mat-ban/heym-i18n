# Egyszeri bejelentkezés

A Heym bármely külső **OpenID Connect** szolgáltatóval képes hitelesíteni a felhasználókat. Az adminisztrátor a **Beállítások → SSO** menüpontban megadja az issuer URL-t, a Heym pedig az összes többi endpointot a szolgáltató discovery dokumentumából olvassa be.

Egyetlen szolgáltató sincs beégetve. A Keycloak, az Okta, az Entra ID, az Auth0, a Google és bármely más OIDC szolgáltató ugyanazokon a mezőkön keresztül kapcsolódik, mivel a Heym számára az egyetlen ismert adat az issuer.

A jelszavas bejelentkezés és az SSO egymás mellett működik. A jelszavas bejelentkezés kikapcsolható, miután az SSO ellenőrzése megtörtént.

## Mielőtt elkezdi

Az SSO beállításai a teljes példányra érvényesek, ezért azokat kizárólag a példány adminisztrátorai módosíthatják. Az adminisztrátorokat egy környezeti változó jelöli ki, nem az adatbázisban tárolódnak:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Az üres érték senkinek sem ad jogosultságot. A módosítás után indítsa újra a backendet. Az ezen a listán szereplő fiókok a Beállítások menüben is látják az **SSO** lapot, és akkor is megtartják a jelszavas hozzáférést, ha a jelszavas bejelentkezés le van tiltva — lásd: [A jelszavas bejelentkezés letiltása](#a-jelszavas-bejelentkezes-letiltasa).

## A Heym regisztrálása a szolgáltatónál

Az identitásszolgáltatójánál hozzon létre egy **bizalmas klienst** (más néven alkalmazásregisztrációt) az alábbi beállításokkal:

| Beállítás | Érték |
|---------|-------|
| Protokoll | OpenID Connect |
| Grant típus | Authorization Code with PKCE |
| Klienshitelesítés | Be — a Heym kliens titkot használ |
| Redirect URI | A Heym SSO lapján megjelenő pontos érték |
| Scope-ok | `openid email profile` |

A Heym a `FRONTEND_URL` alapján számítja ki a redirect URI-t, és csak olvasható módon, másolás gombbal együtt jeleníti meg a beállítási űrlapon. Mindig `/api/auth/sso/callback` végződéssel zárul. Másolja ki a beírás helyett — a nem egyező redirect URI a leggyakoribb beállítási hiba, és a szolgáltatók magyarázat nélkül elutasítják.

A szolgáltatónak ellenőrzött e-mail-címet kell visszaadnia. Lásd: [Fiókhozzárendelés](#fiokhozzarendeles).

## A Heym konfigurálása

Nyissa meg a **Beállítások → SSO** menüpontot. A lap csak a `HEYM_ADMIN_EMAILS` listán szereplő fiókok számára jelenik meg.

| Mező | Mit tesz |
|-------|--------------|
| **Egyszeri bejelentkezés engedélyezése** | Megjeleníti a bejelentkezési gombot a bejelentkező képernyőn. |
| **Issuer URL** | A szolgáltató alap URL-je, például `https://idp.example.com/realms/your-realm`. A Heym hozzáfűzi a `/.well-known/openid-configuration` végződést, és onnan olvassa be a többit. |
| **Client ID** | A szolgáltatótól kapott kliensazonosító. |
| **Client secret** | Titkosítva tárolódik. Hagyja üresen a mezőt a tárolt érték megtartásához — a Heym soha nem adja vissza a nála lévő titkot. |
| **Redirect URI** | Csak olvasható. Másolja ezt a szolgáltató engedélyezési listájába. |
| **Scope-ok** | Alapértelmezésben `openid email profile`. |
| **Bejelentkezési gomb felirata** | A bejelentkező képernyőn megjelenő gomb szövege, például „Bejelentkezés Okta-val". |
| **Fiók létrehozása az első bejelentkezéskor** | Hogy az ismeretlen felhasználók automatikusan kapnak-e Heym fiókot. |
| **Engedélyezett e-mail-domainek** | Vesszővel elválasztva. Az üres érték bármely, a szolgáltató által hitelesített domaint engedélyezi. |
| **Jelszavas bejelentkezés letiltása** | A teljes példányon kikapcsolja a jelszavas hitelesítést. |

### Először tesztelje a kapcsolatot

A **Kapcsolat tesztelése** lekéri a discovery dokumentumot és a szolgáltató aláíró kulcsait, majd jelenti a megtalált token endpointot. Futtathatja olyan issuer esetében is, amelyet beírt, de még nem mentett el, így egy hibás URL egy kattintásba kerül a mentés helyett.

A teszt csak akkor *rögzít* sikeres eredményt, ha a tesztelt issuer megegyezik a már tárolttal. A piszkozatteszt megmutatja, hogy az URL feloldható-e; nem jogosít fel egy nem mentett konfigurációra. Az issuer, a client ID, a scope-ok vagy a titok módosítása ugyanezen okból törli a rögzített eredményt.

## Hogyan működik a bejelentkezés

1. Valaki a bejelentkező képernyőn a bejelentkezési gombra kattint.
2. A Heym átirányítja a szolgáltatóhoz egy `state`, egy `nonce` és egy PKCE kihívás kíséretében.
3. A felhasználó hitelesít a szolgáltatónál.
4. A szolgáltató visszairányítja a Heym callback végpontjára egy engedélyezési kóddal.
5. A Heym a kódot tokenekre cseréli, és a szolgáltató közzétett kulcsaival ellenőrzi az ID tokent, ellenőrizve az aláírást, a közönséget, az issuert, a lejáratot és a nonce-t.
6. A Heym feloldja a fiókot, és kiadja a saját munkamenetét, pontosan úgy, ahogy a jelszavas bejelentkezés teszi.

A 6. lépés utáni minden változatlan: ugyanazok a munkamenet-sütik, ugyanazok a token élettartamok, ugyanazok az engedélyek.

## Fiókhozzárendelés

A Heym az alábbi sorrendben oldja fel a fiókot:

1. **`(issuer, subject)`** — az identitás, amelyet a szolgáltató egy korábbi bejelentkezéskor igazolt. Ez mérvadó, és túléli a szolgáltatónál történő e-mail-változást.
2. **Ellenőrzött e-mail** — egy meglévő Heym fiók az adott címmel igénybevételre kerül, és a szolgáltató subject értéke onnantól rögzítésre kerül rajta.
3. **Új fiók** — létrejön, ha a **Fiók létrehozása az első bejelentkezéskor** be van kapcsolva, és a domain engedélyezett.

Egy e-mail csak akkor számít ellenőrzöttnek, ha az ID token tartalmazza az `email_verified: true` értéket. Ha ez az állítás `false`, vagy hiányzik, a bejelentkezés elutasításra kerül. Egy meglévő fiók igénybevétele — vagy új létrehozása — olyan cím alapján, amelyet a szolgáltató nem igazol, fiókátvételi útvonal, ezért a Heym nem teszi ezt. Az olyan szolgáltatót, amely soha nem bocsát ki `email_verified` értéket, erre konfigurálni kell.

Az így létrehozott fiókoknak nincs jelszavuk. Kizárólag a szolgáltatón keresztül jelentkeznek be.
## Jelszavas bejelentkezés letiltása

A **Jelszavas bejelentkezés letiltása** kapcsoló mindaddig nem elérhető, amíg három feltétel nem teljesül:

1. Az SSO engedélyezve van.
2. Egy kapcsolatteszt sikeresen lefutott, így egy hibás issuer nem zárhatja be maga mögött az ajtót.
3. A `HEYM_ADMIN_EMAILS` listában szereplő fiókok közül legalább egynek ténylegesen van jelszava.

Amikor be van kapcsolva, a jelszavas hitelesítés mindhárom felületen elutasításra kerül, amely jelszót állít ki vagy fogad el: a bejelentkezési űrlapon, a **regisztrációnál** és az MCP OAuth hozzájárulási oldalon. A regisztráció azért számít, mert jelszót állít ki; ha nyitva maradna, a beállítást bárki megkerülhetné, aki eléri a `/register` végpontot.

A `HEYM_ADMIN_EMAILS` listában szereplő fiókok mindhárom esetben mentesülnek. Aki a környezeti fájlt szerkeszteni tudja, az már amúgy is helyre tudja állítani az instance-t, ezért ez a garancia a kódban él, nem az üzemeltető emlékezetében.

### Miért létezik a harmadik feltétel

Egy adminisztrátornak, akinek a Heym-fiókját *SSO-n keresztül* hozták létre, egyáltalán nincs jelszava. A mentesség átengedné a kapun, de nincs mivel bejelentkeznie — így az instance-nek nem lenne visszaútja, ha a szolgáltató elérhetetlenné válna. A Heym megtagadja, hogy ilyen állapotba kerüljön, és ezt közli is.

Ha ezzel az üzenettel találkozik, jelentkezzen be SSO-val, és regisztráljon egy jelszavas fiókot valamelyik adminisztrátori címén (a regisztráció pontosan ezért marad nyitva az adminisztrátori címek számára), vagy adjon hozzá egy már jelszóval rendelkező címet a `HEYM_ADMIN_EMAILS` listához.

### Helyreállítás, amikor a szolgáltató elérhetetlen

Elsőbbségi sorrendben:

1. **Jelentkezzen be egy break-glass adminisztrátori jelszóval.** A bejelentkezési képernyő elrejti a jelszavas űrlapot, amikor a jelszavas bejelentkezés ki van kapcsolva, ezért kattintson az SSO gomb alatti **Sign in with a password instead** elemre a megjelenítéséhez. Az űrlap nem jelent megkerülést: a `HEYM_ADMIN_EMAILS` listán kívüli összes cím továbbra is elutasításra kerül, és erről tájékoztatást kap.
2. **Adja hozzá magát a `HEYM_ADMIN_EMAILS` listához** a környezeti fájlban, és indítsa újra a backendet. Egy már jelszóval rendelkező fiók ezután be tud jelentkezni.
3. **Nyissa meg újra közvetlenül az adatbázisban a jelszavas bejelentkezést**, ha egyetlen adminisztrátornak sincs jelszava:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Újraindítás nem szükséges; a beállítás kérésenként kerül beolvasásra.

A Portal végfelhasználóit ez nem érinti. Ők egy külön könyvtárral szemben hitelesítenek — lásd [Portal](./portal.md).

## Bejelentkezési hibák

Egy sikertelen bejelentkezés egy olvasható üzenettel tér vissza a bejelentkezési képernyőre. A Heym soha nem jeleníti meg a szolgáltató nyers hibaüzenetét.

| Üzenet | Ok |
|---------|-------|
| That sign-in attempt expired | A kísérlet tíz percnél tovább tartott, vagy a böngésző eldobta a tranzakciós cookie-t. Próbálja újra. |
| Could not reach the identity provider | A discovery vagy a token exchange sikertelen volt. Ellenőrizze az issuer URL-t, és azt, hogy a szolgáltató elérhető-e a backend felől. |
| The provider's response could not be verified | Az ID token megbukott az aláírás-, audience-, issuer-, lejárati vagy nonce-ellenőrzésen. Általában client ID eltérés. |
| The provider did not return an email address | Az `email` scope hiányzik, vagy a szolgáltató nem adja ki a claimet. |
| Your email address is not verified | A szolgáltató `email_verified: false` értéket küldött, vagy elhagyta a claimet. |
| Your email domain is not allowed | A cím kívül esik az **Allowed email domains** hatókörén. |
| No Heym account exists for you | A **Create an account on first sign-in** ki van kapcsolva, és egyetlen fiók sem egyezik. Egy adminisztrátornak létre kell hoznia egyet. |
| Single sign-on is not configured | Az SSO le van tiltva, vagy hiányzik az issuer, a client ID vagy a secret. |

## Biztonsági megjegyzések

- **A client secret nyugalmi állapotban titkosított**, és semmilyen endpoint nem adja vissza. A beállítási űrlap csak azt jelzi, hogy van-e tárolva.
- **A PKCE verifier soha nem hagyja el a Heymet.** Egy rövid élettartamú `HttpOnly` cookie-ban tárolódik, nem a `state` paraméterben, amely nyíltan oda-vissza utazik a szolgáltatón keresztül.
- **Kizárólag aszimmetrikus aláírások kerülnek elfogadásra.** A `none` és a szimmetrikus algoritmusok elutasításra kerülnek, függetlenül attól, hogy a szolgáltató mit hirdet.
- **A bejelentkezés utáni cél validálásra kerül** mint azonos eredetű útvonal, így a callback nem használható nyílt átirányításként.
- **Minden bejelentkezés naplózásra kerül.** A sikerek, a hibák és az elutasítások `auth.sso_login` sorokként jelennek meg, a konfigurációs változások pedig `sso_settings.update` néven — lásd [Audit Logging](./audit.md).

## Mi nem támogatott

- **SAML.** Az OIDC az egyetlen protokoll.
- **Több egyidejű szolgáltató.** Egy instance egy szolgáltatóhoz kapcsolódik.
- **Csoport- vagy szerepkör-leképezés** a szolgáltatói claimekből.
- **Egyszeri kijelentkezés.** A Heymből való kijelentkezés nem jelentkezteti ki Önt a szolgáltatóból.
