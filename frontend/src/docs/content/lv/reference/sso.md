# Vienotā Akreditācija

Heym var autentificēt personas pret jebkuru ārēju **OpenID Connect** pakalpojumu sniedzēju. Administrators ievada izsniedzēja URL sadaļā **Iestatījumi → SSO**, un Heym nolasa visus pārējos galapunktus no šī pakalpojumu sniedzēja atklāšanas dokumenta.

Nav neviena pakalpojumu sniedzēja, kas būtu iepriekš definēts. Keycloak, Okta, Entra ID, Auth0, Google un jebkurš cits OIDC pakalpojumu sniedzējs savienojas caur tiem pašiem laukiem, jo vienīgais, ko Heym zina, ir izsniedzējs.

Paroles autentifikācija un SSO darbojas blakus. Paroles autentifikāciju var izslēgt, kad SSO ir apstiprināts.

## Pirms Sākat

SSO iestatījumi ir instancei specifiski, tāpēc tikai instance administratoriem ir tiesības tos mainīt. Administratorus nosaka ar vides mainīgo, nevis glabā datubāzē:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Tukša vērtība nepiešķir nevienam. Pēc izmaiņu veikšanas restartējiet aizmugurējo daļu. Konti šajā sarakstā arī redz **SSO** cilni iestatījumos un saglabā paroles piekļuvi pat tad, kad paroles autentifikācija ir atspējota — skatiet [Paroles autentifikācijas atspējošana](#disabling-password-sign-in).

## Heym Reģistrēšana Jūsu Pakalpojumu Sniedzējā

Jūsu identitātes pakalpojumu sniedzējā izveidojiet **konfidenciālu klientu** (tāpat sauktu par lietotnes reģistrāciju) ar:

| Iestatījums | Vērtība |
|-------------|---------|
| Protokols | OpenID Connect |
| Piešķiršanas veids | Autorizācijas kods ar PKCE |
| Klienta autentifikācija | Ieslēgta — Heym izmanto klienta slepeno kodu |
| Pāradresācijas URI | Precīza vērtība, kas parādīta Heym SSO cilnē |
| Scopes | `openid email profile` |

Heym aprēķina pāradresācijas URI no `FRONTEND_URL` un parāda to tikai lasāmā formā iestatījumu veidlapā ar kopēšanas pogu. Tam vienmēr jābeidzas ar `/api/auth/sso/callback`. Kopējiet to, nevis rakstiet — nepareiza pāradresācijas URI ir visizplatītākā konfigurācijas kļūda, un pakalpojumu sniedzēji to noraida bez paskaidrojuma.

Jūsu pakalpojumu sniedzējam jāatgriež pārbaudīta e-pasta adrese. Skatiet [Kontu kartēšana](#account-mapping).

## Heym Konfigurēšana

Atveriet **Iestatījumi → SSO**. Cilne parādās tikai kontiem, kas ir `HEYM_ADMIN_EMAILS`.

| Lauks | Ko tas dara |
|-------|-------------|
| **Iespējot vienoto akreditāciju** | Parāda pieteikšanās pogu pieteikšanās ekrānā. |
| **Izsniedzēja URL** | Pakalpojumu sniedzēja pamat URL, piemēram, `https://idp.example.com/realms/your-realm`. Heym pievieno `/.well-known/openid-configuration` un nolasa pārējo no turienes. |
| **Klienta ID** | Klienta identifikators no jūsu pakalpojumu sniedzēja. |
| **Klienta slepenais kods** | Glabāms šifrētā veidā. Atstājiet lauku tukšu, lai saglabātu esošo vērtību — Heym nekad neatgriež slepeno kodu, ko tas glabā. |
| **Pāradresācijas URI** | Tikai lasāmā formā. Kopējiet to savā pakalpojumu sniedzēja atļauju sarakstā. |
| **Scopes** | Noklusējuma vērtība `openid email profile`. |
| **Pieteikšanās pogas etiķete** | Teksts pieteikšanās ekrāna pogai, piemēram, "Pieteikties ar Okta". |
| **Izveidot kontu pirmajā pieteikšanās reizē** | Vai nezināmas personas automātiski iegūst Heym kontu. |
| **Atļautās e-pasta domēni** | Atsevišķi ar komatu. Tukšs ļauj jebkuru domēnu, ko pakalpojumu sniedzējs autentificē. |
| **Atspējot paroles autentifikāciju** | Izslēdz paroles autentifikāciju visā instancei. |

### Pirmkārt, pārbaudiet savienojumu

**Pārbaudīt savienojumu** iegūst atklāšanas dokumentu un pakalpojumu sniedzēja paraksta atslēgas, pēc tam ziņo par atrasto token galapunktu. To var palaist uz izsniedzēja, kuru esat ierakstījis, bet vēl neesat saglabājis, tāpēc nepareiza URL izmaksā tikai klikšķi, nevis saglabāšanu.

Tests tikai *ieraksta* sekmīgu rezultātu, kad pārbaudītais izsniedzējs ir jau saglabāts. Projekta tests informē, vai URL tiek atrisināts; tas neapstiprina konfigurāciju, kas nav saglabāta. Izmainot izsniedzēju, klienta ID, scopes vai slepeno kodu, tiek notīrīts ierakstītais rezultāts tā paša iemesla dēļ.

## Kā Darbojas Pieteikšanās

1. Kāds noklikšķina uz pieteikšanās pogas pieteikšanās ekrānā.
2. Heym pāradresē viņus uz pakalpojumu sniedzēju ar `state`, `nonce` un PKCE izaicinājumu.
3. Viņi autentificējas ar pakalpojumu sniedzēju.
4. Pakalpojumu sniedzējs pāradresē atpakaļ uz Heym callback ar autorizācijas kodu.
5. Heym apmaina kodu pret token un pārbauda ID token pret pakalpojumu sniedzēja publicētajām atslēgām, pārbaudot parakstu, auditoriju, izsniedzēju, derīguma termiņu un nonce.
6. Heym atrisina kontu un izsniedz savu sesiju, tieši tāpat kā paroles pieteikšanās gadījumā.

Viss, kas notiek pēc 6. soļa, paliek nemainīgs: tās pašas sesijas sīkdatnes, tie paši token derīguma termiņi, tās pašas atļaujas.

## Kontu Kartēšana

Heym atrisina kontu šādā secībā:

1. **`(issuer, subject)`** — identitāte, ko pakalpojumu sniedzējs apstiprināja iepriekšējā pieteikšanās reizē. Tas ir autoritatīvs un izdzīvo e-pasta maiņu pie pakalpojumu sniedzēja.
2. **Pārbaudīts e-pasts** — esošais Heym konts ar šo adresi tiek pieprasīts, un pakalpojumu sniedzēja subjekts tiek reģistrēts uz tā no šī brīža.
3. **Jauns konts** — tiek izveidots, ja **Izveidot kontu pirmajā pieteikšanās reizē** ir ieslēgts un domēns ir atļauts.

E-pasts tiek uzskatīts par pārbaudītu tikai tad, kad ID token satur `email_verified: true`. Ja šis apgalvojums ir `false` vai trūkst, pieteikšanās tiek atteikta. Esoša konta pieprasīšana — vai jauna izveidošana — balstoties uz adresi, kuru pakalpojumu sniedzējs neapstiprina, ir konta pārņemšanas ceļš, tāpēc Heym to nedara. Pakalpojumu sniedzējam, kas nekad neizdod `email_verified`, jābūt konfigurētam, lai to darītu.

Šādā veidā izveidotajiem kontiem nav paroles. Tie pieteicas tikai caur pakalpojumu sniedzēju.
## Paroles pieteikšanās atslēgšana

**Atslēgt paroles pieteikšanos** slēdzis paliek nepieejams, līdz ir izpildīti trīs nosacījumi:

1. SSO ir iespējots.
2. Savienojuma tests ir izturēts, lai nepareizs izsniedzējs nevarētu aizslēgt durvis aiz sevis.
3. Vismaz vienam kontam `HEYM_ADMIN_EMAILS` patiešām ir parole.

Kad tas ir ieslēgts, paroles autentifikācija tiek atteikta visās trijās virsmās, kas izsniedz vai pieņem to: pieteikšanās forma, **reģistrācija** un MCP OAuth piekrišanas lapa. Reģistrācija tiek ņemta vērā, jo tā izsniedz paroli; atstājot to atvērtu, iestatījums varētu tikt apiet, ja kāds var piekļūt `/register`.

Konta, kas uzskaitīti `HEYM_ADMIN_EMAILS`, ir atbrīvoti no visiem trim nosacījumiem. Ikviens, kurš var rediģēt vides failu, jau var atjaunot instanci, tāpēc šis garantija pastāv kodā, nevis operatora atmiņā.

### Kāpēc pastāv trešais nosacījums

Administrators, kura Heym konts tika izveidots *caur* SSO, vispār nav paroles. Atbrīvojums ļautu viņiem iziet cauri vārtiem, bet viņiem nav ar ko pieteikties — tāpēc instancei nebūtu atgriešanās iespēju, ja pakalpojumu sniedzējs neizdotos. Heym atsakās ieiet šajā stāvoklī un to norāda.

Ja saņemat šo ziņojumu, piesakieties caur SSO un reģistrējiet paroli kādā no savām administratora adresēm (reģistrācija joprojām ir atvērta administratora adresēm tieši šī iemesla dēļ) vai pievienojiet adresi, kurai jau ir parole, `HEYM_ADMIN_EMAILS`.

### Atjaunošana, kad pakalpojumu sniedzējs ir neaktīvs

Pēc izvēles secības:

1. **Piesakieties ar break-glass administratora paroli.** Pieteikšanās ekrāns slēpj paroles formu, kad paroles pieteikšanās ir izslēgta, tāpēc noklikšķiniet uz **Pieteikties ar paroli** zem SSO pogas, lai to atklātu. Forma nav apietšana: katra adrese ārpus `HEYM_ADMIN_EMAILS` joprojām tiek atteikta un informēta par iemeslu.
2. **Pievienojiet sevi `HEYM_ADMIN_EMAILS`** vides failā un restartējiet aizmuguri. Konts, kuram jau ir parole, varēs pieteikties.
3. **Tieši atveriet paroles pieteikšanos datubāzē**, ja nevienam administratoram nav paroles vispār:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Restartēšana nav nepieciešama; iestatījums tiek lasīts katras pieprasījuma laikā.

Portāla gala lietotāji netiek ietekmēti. Viņi autentificējas pret atsevišķu katalogu — skatiet [Portal](./portal.md).

## Pieteikšanās kļūdas

Neizdevusies pieteikšanās atgriež pieteikšanās ekrānā ar saprotamu ziņojumu. Heym nekad nerāda pakalpojumu sniedzēja neapstrādāto kļūdas tekstu.

| Ziņojums | Iemesls |
|----------|---------|
| Šis pieteikšanās mēģinājums ir beidzies | Mēģinājums ilga ilgāk par desmit minūtēm, vai pārlūkprogramma zaudēja transakcijas sīkdatni. Mēģiniet vēlreiz. |
| Neizdevās sasniegt identitātes pakalpojumu sniedzēju | Atklāšana vai token apmaiņa neizdevās. Pārbaudiet izsniedzēja URL un to, vai pakalpojumu sniedzējs ir sasniedzams no aizmugures. |
| Pakalpojumu sniedzēja atbilde nevarēja tikt pārbaudīta | ID token neizturēja paraksta, auditorijas, izsniedzēja, derīguma termiņa vai nonce validāciju. Parasti klienta ID nesakritība. |
| Pakalpojumu sniedzējs neatgrieza e-pasta adresi | `email` apjoms ir trūkstošs vai pakalpojumu sniedzējs neatbrīvo prasību. |
| Jūsu e-pasta adrese nav apstiprināta | Pakalpojumu sniedzējs nosūtīja `email_verified: false`, vai izlaida prasību. |
| Jūsu e-pasta domēns nav atļauts | Adrese ir ārpus **Atļautajiem e-pasta domēniem**. |
| Jums nav Heym konta | **Izveidot kontu pirmajā pieteikšanās reizē** ir izslēgts un nav neviena atbilstoša konta. Administratoram jāizveido viens. |
| Vienotā pieteikšanās nav konfigurēta | SSO ir atslēgts, vai izsniedzējs, klienta ID vai slepenais ir trūkstošs. |

## Drošības piezīmes

- **Klienta slepenais ir šifrēts atmiņā** un nekad netiek atgriezts no neviena galapunkta. Iestatījumu forma ziņo tikai par to, vai viens ir saglabāts.
- **PKCE verifikators nekad neatstāj Heym.** Tas tiek turēts īslaicīgā `HttpOnly` sīkdatnē, nevis `state` parametrā, kas ceļo caur pakalpojumu sniedzēju redzamā veidā.
- **Tiek pieņemti tikai asimetriskie paraksti.** `none` un simetriskās algoritmi tiek noraidīti neatkarīgi no tā, ko pakalpojumu sniedzējs reklamē.
- **Pēc pieteikšanās galamērķis tiek validēts** kā vienas izcelsmes ceļš, tāpēc atgriešanās nevar tikt izmantota kā atvērta pāradresācija.
- **Katrs pieteikšanās gadījums tiek auditēts.** Veiksmīgi, neveiksmīgi un atteikumi parādās kā `auth.sso_login` rindas, un konfigurācijas izmaiņas kā `sso_settings.update` — skatiet [Audit Logging](./audit.md).

## Kas nav atbalstīts

- **SAML.** OIDC ir vienīgais protokols.
- **Vairāki vienlaicīgi pakalpojumu sniedzēji.** Viena instance savienojas ar vienu pakalpojumu sniedzēju.
- **Grupu vai lomu kartēšana** no pakalpojumu sniedzēja prasībām.
- **Vienotā izrakstīšanās.** Izrakstīšanās no Heym nenozīmē izrakstīšanos no pakalpojumu sniedzēja.
