# Ühekordne sisselogimine

Heym saab autentida inimesi mis tahes välise **OpenID Connect** pakkuja vastu. Administraator sisestab väljaandja URL-i jaotises **Settings → SSO** ning Heym loeb kõik ülejäänud endpointid selle pakkuja avastusdokumendist.

Ükski pakkuja ei ole kõvakodeeritud. Keycloak, Okta, Entra ID, Auth0, Google ja mis tahes muu OIDC-pakkuja ühendatakse samade väljade kaudu, sest ainus, mida Heymile öeldakse, on väljaandja.

Parooliga sisselogimine ja SSO töötavad kõrvuti. Parooliga sisselogimise saab välja lülitada, kui SSO on kinnitatud.

## Enne alustamist

SSO-seaded kehtivad kogu instantsile, seega saavad neid muuta ainult instantsi administraatorid. Administraatorid määratakse keskkonnamuutuja kaudu, mitte ei salvestata andmebaasi:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Tühi väärtus ei anna kellelegi õigusi. Pärast muutmist taaskäivitage backend. Selles nimekirjas olevad kontod näevad ka jaotise **SSO** vahekaarti Settings all ning säilitavad parooli juurdepääsu ka siis, kui parooliga sisselogimine on välja lülitatud — vt [Parooliga sisselogimise väljalülitamine](#parooliga-sisselogimise-väljalülitamine).

## Heymi registreerimine teie pakkuja juures

Looge oma identiteedipakkuja juures **konfidentsiaalne klient** (nimetatakse ka rakenduse registreerimiseks) järgmiste seadetega:

| Säte | Väärtus |
|---------|-------|
| Protokoll | OpenID Connect |
| Grant-tüüp | Authorization Code with PKCE |
| Kliendi autentimine | Sees — Heym kasutab kliendi saladust |
| Redirect URI | Täpne väärtus, mis on näidatud Heymi SSO vahekaardil |
| Skoodid | `openid email profile` |

Heym arvutab redirect URI väärtusest `FRONTEND_URL` ja näitab seda seadete vormis ainult lugemiseks koos kopeerimisnupuga. See lõpeb alati aadressiga `/api/auth/sso/callback`. Kopeerige see, mitte ärge trükkige käsitsi — sobimatu redirect URI on kõige levinum seadistamise tõrge ning pakkujad lükkavad selle tagasi ilma selgituseta.

Teie pakkuja peab tagastama kinnitatud e-posti aadressi. Vt [Konto vastendamine](#konto-vastendamine).

## Heymi konfigureerimine

Avage **Settings → SSO**. Vahekaart kuvatakse ainult kontodele, mis on loetletud muutujas `HEYM_ADMIN_EMAILS`.

| Väli | Mida see teeb |
|-------|--------------|
| **Enable single sign-on** | Kuvab sisselogimise nupu sisselogimisekraanil. |
| **Issuer URL** | Pakkuja baas-URL, näiteks `https://idp.example.com/realms/your-realm`. Heym lisab sellele `/.well-known/openid-configuration` ja loeb ülejäänu sealt. |
| **Client ID** | Kliendi identifikaator teie pakkuja juurest. |
| **Client secret** | Salvestatakse krüpteeritult. Jätke väli tühjaks, et säilitada salvestatud väärtus — Heym ei tagasta kunagi saladust, mida ta hoiab. |
| **Redirect URI** | Ainult lugemiseks. Kopeerige see oma pakkuja lubatud loendisse. |
| **Scopes** | Vaikimisi `openid email profile`. |
| **Sign-in button label** | Tekst sisselogimisekraani nupul, näiteks "Sign in with Okta". |
| **Create an account on first sign-in** | Kas tundmatud inimesed saavad Heymi konto automaatselt. |
| **Allowed email domains** | Komadega eraldatud. Tühi lubab mis tahes domeeni, mille pakkuja autendib. |
| **Disable password sign-in** | Lülitab parooli autentimise välja kogu instantsi ulatuses. |

### Testige esmalt ühendust

**Test connection** toob avastusdokumendi ja pakkuja allkirjastamisvõtmed ning teavitab seejärel leitud token endpointist. Saate seda käivitada väljaandjal, mille olete sisestanud, kuid pole veel salvestanud, seega vale URL maksab ühe klõpsu, mitte salvestamise.

Test *salvestab* läbitud tulemuse ainult siis, kui testitud väljaandja on juba salvestatud. Mustandi test ütleb teile, kas URL laheneb; see ei anna alust salvestamata konfiguratsioonile. Väljaandja, kliendi ID, skoodide või saladuse muutmine tühistab salvestatud tulemuse samal põhjusel.

## Kuidas sisselogimine töötab

1. Keegi klõpsab sisselogimisekraanil sisselogimise nuppu.
2. Heym suunab ta pakkuja juurde koos `state`, `nonce` ja PKCE väljakutsega.
3. Ta autendib end pakkuja juures.
4. Pakkuja suunab tagasi Heymi callback-ile koos autoriseerimiskoodiga.
5. Heym vahetab koodi tokenite vastu ja kinnitab ID tokeni pakkuja avaldatud võtmete vastu, kontrollides allkirja, audience'i, väljaandjat, aegumist ja nonce'i.
6. Heym tuvastab konto ja väljastab oma sessiooni, täpselt nagu parooliga sisselogimisel.

Kõik alates 6. sammust edasi on muutumatu: samad sessiooniküpsised, samad tokenite eluead, samad õigused.

## Konto vastendamine

Heym tuvastab konto järgmises järjekorras:

1. **`(issuer, subject)`** — identiteet, mille pakkuja kinnitas eelmisel sisselogimisel. See on autoriteetne ja püsib ka e-posti muutumisel pakkuja juures.
2. **Kinnitatud e-post** — olemasolev Heymi konto selle aadressiga võetakse üle ning pakkuja subject salvestatakse sellele edaspidi.
3. **Uus konto** — luuakse, kui **Create an account on first sign-in** on sees ja domeen on lubatud.

E-post loetakse kinnitatuks ainult siis, kui ID token sisaldab `email_verified: true`. Kui see väide on `false` või puudub, keeldutakse sisselogimisest. Olemasoleva konto ülevõtmine — või uue loomine — aadressi alusel, mille eest pakkuja ei vastuta, on konto ülevõtmise tee, seega Heym ei tee seda. Pakkuja, mis ei väljasta kunagi `email_verified`, tuleb seadistada seda tegema.

Sel viisil loodud kontodel pole parooli. Nad logivad sisse ainult pakkuja kaudu.
## Parooliga sisselogimise keelamine

Lüliti **Keela parooliga sisselogimine** jääb kättesaamatuks, kuni on täidetud kolm tingimust:

1. SSO on lubatud.
2. Ühenduse test on läbitud, et vale issuer ei saaks ust enda taga lukustada.
3. Vähemalt ühel kontol `HEYM_ADMIN_EMAILS` nimekirjas on tegelikult parool.

Kui see on sisse lülitatud, keeldutakse parooli autentimisest kõigil kolmel pinnal, mis parooli väljastavad või vastu võtavad: sisselogimisvormil, **registreerimisel** ja MCP OAuth nõusoleku lehel. Registreerimine läheb arvesse, sest see väljastab parooli; selle avatuks jätmine muudaks seade möödahiilitavaks igaühele, kes pääseb ligi aadressile `/register`.

Kontod, mis on loetletud `HEYM_ADMIN_EMAILS` nimekirjas, on kõigist kolmest erandiks. Kes suudab muuta keskkonnafaili, suudab niikuinii instantsi taastada, seega see garantii elab koodis, mitte operaatori mälus.

### Miks kolmas tingimus eksisteerib

Administraatoril, kelle Heymi konto loodi *SSO kaudu*, ei ole üldse parooli. Erand lubaks tal väravast mööda pääseda, kuid tal pole millegagi sisse logida — seega instantsil ei oleks mingit teed tagasi, kui teenusepakkuja maas on. Heym keeldub sellesse olekusse sattumast ja ütleb seda ka välja.

Kui näete seda teadet, logige sisse SSO kaudu ja registreerige parooliga konto ühel oma admin-aadressil (registreerimine on admin-aadressidele avatud just sel põhjusel) või lisage aadress, millel on juba parool, nimekirja `HEYM_ADMIN_EMAILS`.

### Taastamine, kui teenusepakkuja on maas

Eelistuste järjekorras:

1. **Logige sisse hädaolukorra admin-parooliga.** Sisselogimisekraan peidab paroolivormi, kui parooliga sisselogimine on välja lülitatud, seega klõpsake SSO nupu all oleval lingil **Logi sisse parooliga**, et see esile tuua. Vorm ei ole möödahiilimine: iga aadress väljaspool `HEYM_ADMIN_EMAILS` nimekirja lükatakse endiselt tagasi ja talle öeldakse põhjus.
2. **Lisage end nimekirja `HEYM_ADMIN_EMAILS`** keskkonnafailis ja taaskäivitage backend. Konto, millel on juba parool, saab seejärel sisse logida.
3. **Avage parooliga sisselogimine otse andmebaasis**, kui ühelgi adminil pole üldse parooli:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Taaskäivitust pole vaja; seadet loetakse iga päringu kohta.

Portaali lõppkasutajad on mõjutamata. Nad autentivad eraldi kataloogi vastu — vt [Portaal](./portal.md).

## Sisselogimise vead

Ebaõnnestunud sisselogimine naaseb sisselogimisekraanile loetava teatega. Heym ei kuva kunagi teenusepakkuja töötlemata veateksti.

| Teade | Põhjus |
|---------|-------|
| See sisselogimiskatse aegus | Katse võttis kauem kui kümme minutit või brauser kaotas tehingu küpsise. Proovige uuesti. |
| Identiteedipakkujani ei õnnestunud jõuda | Discovery või tokeni vahetus ebaõnnestus. Kontrollige issuer URL-i ja seda, et teenusepakkuja oleks backendist kättesaadav. |
| Teenusepakkuja vastust ei õnnestunud kinnitada | ID token ei läbinud allkirja, audience'i, issueri, aegumise ega nonce'i valideerimist. Tavaliselt client ID mittevastavus. |
| Teenusepakkuja ei tagastanud e-posti aadressi | Ulatus `email` on puudu või teenusepakkuja ei väljasta väidet. |
| Teie e-posti aadress ei ole kinnitatud | Teenusepakkuja saatis `email_verified: false` või jättis väite välja. |
| Teie e-posti domeen ei ole lubatud | Aadress on väljaspool **Lubatud e-posti domeene**. |
| Teie jaoks ei ole Heymi kontot | **Loo konto esimesel sisselogimisel** on väljas ja ükski konto ei vasta. Administraator peab selle looma. |
| Ühekordne sisselogimine ei ole konfigureeritud | SSO on keelatud või issuer, client ID või secret on puudu. |

## Turvamärkused

- **Client secret on salvestatud krüpteeritult** ega tagastata kunagi ühegi endpointi poolt. Seadete vorm teatab ainult, kas üks on salvestatud.
- **PKCE verifier ei lahku kunagi Heymist.** Seda hoitakse lühiajalises `HttpOnly` küpsises, mitte parameetris `state`, mis käib teenusepakkuja kaudu ringi avalikult nähtavana.
- **Aktsepteeritakse ainult asümmeetrilisi allkirju.** `none` ja sümmeetrilised algoritmid lükatakse tagasi sõltumata sellest, mida teenusepakkuja reklaamib.
- **Sisselogimisjärgne sihtkoht valideeritakse** sama päritolu teena, seega callback'i ei saa kasutada avatud ümbersuunamisena.
- **Iga sisselogimine on auditeeritud.** Õnnestumised, ebaõnnestumised ja keeldumised ilmuvad ridadena `auth.sso_login` ning konfiguratsioonimuudatused ridadena `sso_settings.update` — vt [Auditlogimine](./audit.md).

## Mida ei toetata

- **SAML.** OIDC on ainus protokoll.
- **Mitu samaaegset teenusepakkujat.** Üks instants ühendub ühe teenusepakkujaga.
- **Grupi või rolli kaardistamine** teenusepakkuja väidetest.
- **Ühekordne väljalogimine.** Heymist väljalogimine ei logi teid välja teenusepakkujast.
