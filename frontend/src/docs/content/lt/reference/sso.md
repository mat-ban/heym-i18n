# Vieno prisijungimo sistema

Heym gali autentifikuoti žmones prieš bet kurį išorinį **OpenID Connect** tiekėją. Administratorius įveda leidėjo URL skiltyje **Nustatymai → SSO**, o Heym perskaito visus kitus galinius taškus iš to tiekėjo atradimo dokumento.

Nė vienas tiekėjas nėra įrašytas kodo lygyje. Keycloak, Okta, Entra ID, Auth0, Google ir bet kuris kitas OIDC tiekėjas jungiasi per tuos pačius laukus, nes vienintelis dalykas, kurį Heym žino, yra leidėjas.

Slaptažodžio prisijungimas ir SSO veikia šalia. Slaptažodžio prisijungimas gali būti išjungtas, kai SSO yra patvirtintas.

## Prieš pradedant

SSO nustatymai yra taikomi visai instancijai, todėl tik instancijos administratoriai gali juos keisti. Administratoriai yra nurodyti aplinkos kintamajame, o ne saugomi duomenų bazėje:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Tuščia reikšmė suteikia prieigą niekam. Po pakeitimo reikia perkrauti backend'ą. Šiame sąraše esantys vartotojai taip pat mato **SSO** skirtuką Nustatymuose ir išlaiko slaptažodžio prieigą net kai slaptažodžio prisijungimas yra išjungtas — žr. [Slaptažodžio prisijungimo išjungimas](#disabling-password-sign-in).

## Registruojant Heym su Jūsų tiekėju

Jūsų tapatybės tiekėjo sistemoje sukurkite **konfidencialų klientą** (taip pat vadinamą programos registracija) su:

| Nustatymas | Reikšmė |
|------------|---------|
| Protokolas | OpenID Connect |
| Leidimo tipas | Authorization Code with PKCE |
| Kliento autentifikavimas | Įjungta — Heym naudoja kliento slaptažodį |
| Peradresavimo URI | Tiksliai ta pati reikšmė, kuri rodoma Heym SSO skirtuke |
| Apimtys | `openid email profile` |

Heym apskaičiuoja peradresavimo URI iš `FRONTEND_URL` ir rodo jį tik skaitymui nustatymų formoje su kopijavimo mygtuku. Jis visada baigiasi `/api/auth/sso/callback`. Kopijuokite jį, o ne rašykite — nesutampantis peradresavimo URI yra dažniausia konfigūracijos klaida, o tiekėjai ją atmeta be paaiškinimo.

Jūsų tiekėjas turi grąžinti patvirtintą el. pašto adresą. Žr. [Paskyros žemėlapis](#account-mapping).

## Heym konfigūravimas

Atidarykite **Nustatymai → SSO**. Šis skirtukas pasirodo tik tiems vartotojams, kurie yra `HEYM_ADMIN_EMAILS`.

| Laukas | Ką jis daro |
|--------|-------------|
| **Įjungti vieno prisijungimo sistemą** | Rodo prisijungimo mygtuką prisijungimo ekrane. |
| **Leidėjo URL** | Tiekėjo pagrindinis URL, pavyzdžiui, `https://idp.example.com/realms/your-realm`. Heym pridės `/.well-known/openid-configuration` ir perskaitys likusius duomenis iš ten. |
| **Kliento ID** | Kliento identifikatorius iš Jūsų tiekėjo. |
| **Kliento slaptažodis** | Saugojamas užšifruotas. Palikite lauką tuščią, kad išlaikytumėte saugomą reikšmę — Heym niekada negrąžina slaptažodžio, kurį turi. |
| **Peradresavimo URI** | Tik skaitymui. Kopijuokite tai į Jūsų tiekėjo leidimų sąrašą. |
| **Apimtys** | Pagal numatytuosius nustatymus `openid email profile`. |
| **Prisijungimo mygtuko etiketė** | Tekstas prisijungimo ekrano mygtuke, pavyzdžiui, "Prisijungti su Okta". |
| **Sukurti paskyrą pirmo prisijungimo metu** | Ar nepažįstami žmonės automatiškai gauna Heym paskyrą. |
| **Leidžiami el. pašto domenai** | Kableliais atskirti. Tuščia leidžia bet kurį domeną, kurį tiekėjas autentifikuoja. |
| **Išjungti slaptažodžio prisijungimą** | Išjungia slaptažodžio autentifikavimą visoje instancijoje. |

### Pirmiausia išbandykite ryšį

**Išbandyti ryšį** gauna atradimo dokumentą ir tiekėjo pasirašymo raktus, tada praneša apie rastą token galinį tašką. Jį galite paleisti su leidėju, kurį įvedėte, bet dar neišsaugojote, todėl neteisingas URL kainuoja tik paspaudimą, o ne išsaugojimą.

Testas tik *įrašo* teigiamą rezultatą, kai išbandytas leidėjas yra tas, kuris jau yra saugomas. Juodraščio testas parodo, ar URL yra pasiekiamas; jis nesuteikia teisės konfigūracijai, kuri nėra išsaugota. Leidėjo, kliento ID, apimčių ar slaptažodžio keitimas išvalo įrašytą rezultatą dėl tos pačios priežasties.

## Kaip veikia prisijungimas

1. Kas nors paspaudžia prisijungimo mygtuką prisijungimo ekrane.
2. Heym peradresuoja juos į tiekėją su `state`, `nonce` ir PKCE iššūkiu.
3. Jie autentifikuojasi su tiekėju.
4. Tiekėjas peradresuoja atgal į Heym callback su autorizacijos kodu.
5. Heym keičia kodą į token'us ir patvirtina ID token prieš tiekėjo paskelbtus raktus, tikrindamas parašą, auditoriją, leidėją, galiojimo laiką ir nonce.
6. Heym nustato paskyrą ir išduoda savo sesiją, lygiai taip pat kaip ir slaptažodžio prisijungimo atveju.

Viskas, kas vyksta po 6 žingsnio, lieka nepakitę: tos pačios sesijos slapukai, tos pačios token'ų galiojimo trukmės, tos pačios teisės.

## Paskyros žemėlapis

Heym nustato paskyrą šia tvarka:

1. **`(leidėjas, subjektas)`** — tapatybė, kurią tiekėjas patvirtino ankstesnio prisijungimo metu. Tai yra autoritetinga ir išlieka net ir pakeitus el. paštą tiekėjo pusėje.
2. **Patvirtintas el. paštas** — esama Heym paskyra su tuo adresu yra pripažinta, o tiekėjo subjektas nuo to laiko yra įrašomas į ją.
3. **Nauja paskyra** — sukurta, jei **Sukurti paskyrą pirmo prisijungimo metu** yra įjungta ir domenas yra leidžiamas.

El. paštas laikomas patvirtintu tik tada, kai ID token turi `email_verified: true`. Jei ši teiginys yra `false` arba trūksta, prisijungimas yra atmetamas. Esamos paskyros pripažinimas — arba naujos sukūrimas — remiantis adresu, kurio tiekėjas nepatvirtina, yra paskyros perėmimo kelias, todėl Heym to nedaro. Tiekėjas, kuris niekada neišleidžia `email_verified`, turi būti sukonfigūruotas tai daryti.

Tokiu būdu sukurtos paskyros neturi slaptažodžio. Jos prisijungia tik per tiekėją.
## Slaptiško prisijungimo išjungimas

**Išjungti slaptiško prisijungimo** jungiklis lieka nepasiekiamas, kol nebus įvykdyti trys dalykai:

1. SSO yra įjungtas.
2. Ryšio testas buvo sėkmingas, todėl neteisingas leidėjas negali užrakinti durų už savęs.
3. Bent vienas paskyros adresas `HEYM_ADMIN_EMAILS` iš tikrųjų turi slaptažodį.

Kai jis yra įjungtas, slaptažodžio autentifikavimas yra atmetamas visose trijose vietose, kuriose jis gali būti naudojamas: prisijungimo formoje, **registracijoje** ir MCP OAuth sutikimo puslapyje. Registracija yra svarbi, nes ji išduoda slaptažodį; palikimas atviru leistų bet kam, kas gali pasiekti `/register`, apeiti šią nuostatą.

Paskyros, nurodytos `HEYM_ADMIN_EMAILS`, yra atleistos nuo visų trijų. Kas gali redaguoti aplinkos failą, jau gali atkurti instanciją, todėl ši garantija egzistuoja kode, o ne operatoriaus atmintyje.

### Kodėl egzistuoja trečiasis reikalavimas

Administratorius, kurio Heym paskyra buvo sukurta *per* SSO, neturi slaptažodžio. Atleidimas leistų jiems praeiti pro vartus, tačiau jie neturi su kuo prisijungti — todėl instancija neturėtų kelio atgal, jei paslaugų teikėjas sugriūtų. Heym atsisako patekti į tokią būseną ir tai nurodo.

Jei matote šį pranešimą, prisijunkite per SSO ir užregistruokite slaptažodžio paskyrą viename iš savo administracinių adresų (registracija vis dar atvira administraciniams adresams būtent dėl šios priežasties) arba pridėkite adresą, kuris jau turi slaptažodį, prie `HEYM_ADMIN_EMAILS`.

### Atkūrimas, kai paslaugų teikėjas neveikia

Pagal pageidavimą:

1. **Prisijunkite su administraciniu slaptažodžiu.** Prisijungimo ekranas slepia slaptažodžio formą, kai slaptiško prisijungimo funkcija yra išjungta, todėl spustelėkite **Prisijunkite su slaptažodžiu** po SSO mygtuku, kad ją atskleistumėte. Forma nėra apeitis: kiekvienas adresas už `HEYM_ADMIN_EMAILS` vis tiek bus atmetamas ir informuojamas kodėl.
2. **Pridėkite save prie `HEYM_ADMIN_EMAILS`** aplinkos faile ir perkraukite backend'ą. Paskyra, kuri jau turi slaptažodį, gali prisijungti.
3. **Atidarykite slaptišką prisijungimą tiesiogiai duomenų bazėje**, jei nė vienas administratorius neturi slaptažodžio:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Perkrauti nereikia; nustatymas skaitomas kiekvieno užklausos metu.

Portalų galutiniai vartotojai nėra paveikti. Jie autentifikuojasi prieš atskirą katalogą — žr. [Portal](./portal.md).

## Prisijungimo klaidos

Nepavykęs prisijungimas grąžina į prisijungimo ekraną su aiškiu pranešimu. Heym niekada nerodo paslaugų teikėjo žaliųjų klaidų tekstų.

| Pranešimas | Priežastis |
|------------|------------|
| Tas prisijungimo bandymas pasibaigė | Bandymas užtruko ilgiau nei dešimt minučių, arba naršyklė prarado transakcijos slapuką. Bandykite dar kartą. |
| Nepavyko pasiekti tapatybės teikėjo | Atrankos arba žetono keitimas nepavyko. Patikrinkite leidėjo URL ir ar teikėjas yra pasiekiamas iš backend'o. |
| Teikėjo atsakymo negalima patvirtinti | ID žetonas nepavyko pasirašymo, auditorijos, leidėjo, galiojimo laiko ar nonce patikrinimo. Paprastai tai yra kliento ID nesutapimas. |
| Teikėjas negrąžino el. pašto adreso | `email` sritis trūksta, arba teikėjas neskelbia šios informacijos. |
| Jūsų el. pašto adresas nėra patvirtintas | Teikėjas išsiuntė `email_verified: false`, arba praleido šią informaciją. |
| Jūsų el. pašto domenas nėra leidžiamas | Adresas yra už **Leidžiamų el. pašto domenų** ribų. |
| Jums nėra sukurtos Heym paskyros | **Sukurkite paskyrą pirmo prisijungimo metu** yra išjungta ir nėra atitinkančios paskyros. Administratorius turi ją sukurti. |
| Vieningo prisijungimo konfigūracija nėra | SSO yra išjungtas, arba leidėjas, kliento ID, arba slaptažodis trūksta. |

## Saugumo pastabos

- **Kliento slaptažodis yra užšifruotas ramybėje** ir niekada nėra grąžinamas iš jokio endpoint'o. Nustatymų forma praneša tik apie tai, ar jis yra saugomas.
- **PKCE patvirtinimas niekada nepalieka Heym.** Jis laikomas trumpalaikiame `HttpOnly` slapuke, o ne `state` parametre, kuris keliauja per teikėją atviru būdu.
- **Priimamos tik asimetrinės parašai.** `none` ir simetriniai algoritmai yra atmetami, nepriklausomai nuo to, ką teikėjas skelbia.
- **Po prisijungimo paskirties vieta yra patvirtinta** kaip tos pačios kilmės kelias, todėl atgalinis ryšys negali būti naudojamas kaip atviras nukreipimas.
- **Kiekvienas prisijungimas yra audituojamas.** Sėkmės, nesėkmės ir atmetimai pasirodo kaip `auth.sso_login` eilutės, o konfigūracijos pakeitimai kaip `sso_settings.update` — žr. [Audito žurnalas](./audit.md).

## Kas nėra palaikoma

- **SAML.** OIDC yra vienintelis protokolas.
- **Daugelis vienu metu veikiančių teikėjų.** Viena instancija jungiasi prie vieno teikėjo.
- **Grupės ar vaidmenų žemėlapiai** iš teikėjo pretenzijų.
- **Vieningas atsijungimas.** Atsijungimas iš Heym nereiškia atsijungimo iš teikėjo.
