# Jedinstvena prijava (Single Sign-On)

Heym može autentificirati korisnike putem bilo kojeg vanjskog **OpenID Connect** pružatelja. Administrator unosi URL izdavača pod **Postavke → SSO**, a Heym čita svaki drugi endpoint iz dokumenta otkrivanja tog pružatelja.

Nijedan pružatelj nije hardkodiran. Keycloak, Okta, Entra ID, Auth0, Google i bilo koji drugi OIDC pružatelj povezuju se kroz ista polja, jer je jedina informacija koju Heym prima URL izdavača.

Prijava putem lozinke i SSO rade paralelno. Prijava putem lozinke može se isključiti nakon što se SSO potvrdi.

## Prije nego što počnete

Postavke SSO-a su globalne za instancu, tako da ih mogu mijenjati samo administratori instance. Administratori su navedeni putem varijable okruženja, a ne pohranjuju se u bazi podataka:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Prazna vrijednost ne dodjeljuje nikome. Ponovno pokrenite backend nakon promjene. Računi na ovom popisu također vide karticu **SSO** u Postavkama i zadržavaju pristup putem lozinke čak i kada je prijava putem lozinke onemogućena — pogledajte [Onemogućavanje prijave putem lozinke](#disabling-password-sign-in).

## Registracija Heyma s Vašim pružateljem

U svom pružatelju identiteta, kreirajte **povjerljivog klijenta** (također nazvanog registracija aplikacije) s:

| Postavka | Vrijednost |
|----------|------------|
| Protokol | OpenID Connect |
| Tip odobrenja | Authorization Code with PKCE |
| Autentifikacija klijenta | Uključeno — Heym koristi tajnu klijenta |
| URI za preusmjeravanje | Točna vrijednost prikazana na SSO kartici Heyma |
| Opseg | `openid email profile` |

Heym izračunava URI za preusmjeravanje iz `FRONTEND_URL` i prikazuje ga samo za čitanje u obrascu postavki s gumbom za kopiranje. Uvijek završava s `/api/auth/sso/callback`. Kopirajte ga umjesto da ga upisujete — neusklađen URI za preusmjeravanje je najčešći razlog za neuspjeh u postavljanju, a pružatelji ga odbacuju bez objašnjenja.

Vaš pružatelj mora vratiti verificiranu adresu e-pošte. Pogledajte [Mapiranje računa](#account-mapping).

## Konfiguracija Heyma

Otvorite **Postavke → SSO**. Kartica se pojavljuje samo za račune u `HEYM_ADMIN_EMAILS`.

| Polje | Što radi |
|-------|----------|
| **Omogući jedinstvenu prijavu** | Prikazuje gumb za prijavu na ekranu za prijavu. |
| **URL izdavača** | Osnovni URL pružatelja, na primjer `https://idp.example.com/realms/your-realm`. Heym dodaje `/.well-known/openid-configuration` i čita ostatak odatle. |
| **ID klijenta** | Identifikator klijenta od Vašeg pružatelja. |
| **Tajna klijenta** | Pohranjuje se šifrirano. Ostavite polje prazno kako biste zadržali pohranjenu vrijednost — Heym nikada ne vraća tajnu koju drži. |
| **URI za preusmjeravanje** | Samo za čitanje. Kopirajte ovo u dopuštenu listu Vašeg pružatelja. |
| **Opsezi** | `openid email profile` prema zadanim postavkama. |
| **Oznaka gumba za prijavu** | Tekst na gumbu na ekranu za prijavu, na primjer "Prijavite se s Okta". |
| **Kreiraj račun pri prvoj prijavi** | Hoće li nepoznate osobe automatski dobiti Heym račun. |
| **Dopuštene domene e-pošte** | Odvojene zarezima. Prazno dopušta bilo koju domenu koju pružatelj autentificira. |
| **Onemogući prijavu putem lozinke** | Isključuje autentifikaciju putem lozinke globalno za instancu. |

### Prvo testirajte vezu

**Testiraj vezu** dohvaća dokument otkrivanja i potpisne ključeve pružatelja, a zatim izvještava o endpointu tokena koji je pronašao. Možete ga pokrenuti na izdavaču koji ste unijeli, ali još niste spremili, tako da pogrešan URL košta samo jedan klik umjesto spremanja.

Test samo *bilježi* prolazni rezultat kada je testirani izdavač onaj koji je već pohranjen. Nacrt testa vam govori hoće li se URL riješiti; ne odobrava konfiguraciju koja nije spremljena. Promjena izdavača, ID-a klijenta, opsega ili tajne briše pohranjeni rezultat iz istog razloga.

## Kako funkcionira prijava

1. Netko klikne gumb za prijavu na ekranu za prijavu.
2. Heym preusmjerava korisnika na pružatelja s `state`, `nonce` i PKCE izazovom.
3. Korisnik se autentificira kod pružatelja.
4. Pružatelj se preusmjerava natrag na Heymov callback s autorizacijskim kodom.
5. Heym razmjenjuje kod za tokene i verificira ID token naspram objavljenih ključeva pružatelja, provjeravajući potpis, publiku, izdavača, isteka i nonce.
6. Heym rješava račun i izdaje vlastitu sesiju, točno kao što to radi prijava putem lozinke.

Sve što slijedi nakon koraka 6 ostaje nepromijenjeno: isti kolačići sesije, isti životni vijek tokena, iste dozvole.

## Mapiranje računa

Heym rješava račun u ovom redoslijedu:

1. **`(issuer, subject)`** — identitet koji je pružatelj potvrdio pri prethodnoj prijavi. Ovo je autoritativno i opstaje čak i nakon promjene e-pošte kod pružatelja.
2. **Verificirana e-pošta** — postojeći Heym račun s tom adresom se preuzima, a subjekt pružatelja se od tada bilježi na njemu.
3. **Novi račun** — kreira se ako je **Kreiraj račun pri prvoj prijavi** uključen i domena je dopuštena.

E-pošta se smatra verificiranom samo kada ID token nosi `email_verified: true`. Ako je ta tvrdnja `false` ili nedostaje, prijava se odbija. Preuzimanje postojećeg računa — ili kreiranje novog — na temelju adrese koju pružatelj ne može potvrditi je put do preuzimanja računa, stoga Heym to ne radi. Pružatelj koji nikada ne emitira `email_verified` mora biti konfiguriran da to učini.

Računi kreirani na ovaj način nemaju lozinku. Prijavljuju se isključivo putem pružatelja.
## Onemogućavanje prijave putem lozinke

Prekidač **Onemogući prijavu putem lozinke** ostaje nedostupan dok ne budu ispunjena tri uvjeta:

1. SSO je omogućen.
2. Test veze je prošao, tako da pogrešan izdavač ne može zaključati vrata iza sebe.
3. Najmanje jedan račun u `HEYM_ADMIN_EMAILS` zapravo ima lozinku.

Kada je uključen, autentifikacija putem lozinke se odbija na sva tri sučelja koja mintaju ili prihvaćaju jednu: obrazac za prijavu, **registraciju** i MCP OAuth stranicu za pristanak. Registracija se računa jer izdaje lozinku; ostavljanje otvorenim omogućilo bi zaobilaženje postavke svakome tko može pristupiti `/register`.

Računi navedeni u `HEYM_ADMIN_EMAILS` izuzeti su od sva tri uvjeta. Tko god može uređivati datoteku okruženja već može oporaviti instancu, tako da ovo jamstvo postoji u kodu, a ne u memoriji operatera.

### Zašto postoji treći uvjet

Administrator čiji je Heym račun kreiran *putem* SSO-a nema lozinku. Izuzetak bi im omogućio prolazak kroz vrata, ali nemaju ništa s čime bi se prijavili — tako da instanca ne bi imala povratak ako bi pružatelj usluga pao. Heym odbija ući u to stanje i to jasno naglašava.

Ako primite tu poruku, prijavite se putem SSO-a i registrirajte račun s lozinkom na jednoj od svojih administratorskih adresa (registracija je još uvijek otvorena za administratorske adrese upravo iz tog razloga), ili dodajte adresu koja već ima lozinku u `HEYM_ADMIN_EMAILS`.

### Oporavak kada je pružatelj usluga nedostupan

Po redoslijedu preferencije:

1. **Prijavite se s lozinkom za hitne slučajeve.** Ekran za prijavu skriva obrazac za lozinku kada je prijava putem lozinke isključena, stoga kliknite **Prijavite se s lozinkom umjesto toga** ispod SSO gumba kako biste ga otkrili. Obrazac nije zaobilaženje: svaka adresa izvan `HEYM_ADMIN_EMAILS` i dalje se odbija, uz objašnjenje.
2. **Dodajte se u `HEYM_ADMIN_EMAILS`** u datoteci okruženja i ponovno pokrenite backend. Račun koji već ima lozinku tada se može prijaviti.
3. **Ponovno otvorite prijavu putem lozinke izravno u bazi podataka**, ako nijedan administrator uopće nema lozinku:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Ponovno pokretanje nije potrebno; postavka se čita po zahtjevu.

Krajnji korisnici portala nisu pogođeni. Oni se autentificiraju protiv odvojene direktorije — pogledajte [Portal](./portal.md).

## Pogreške pri prijavi

Neuspješna prijava vraća se na ekran za prijavu s čitljivom porukom. Heym nikada ne prikazuje sirovi tekst pogreške pružatelja usluga.

| Poruka | Uzrok |
|--------|-------|
| Taj pokušaj prijave je istekao | Pokušaj je trajao duže od deset minuta, ili je preglednik izgubio transakcijski kolačić. Pokušajte ponovo. |
| Nije moguće doći do pružatelja identiteta | Otkriće ili razmjena tokena nije uspjela. Provjerite URL izdavača i da je pružatelj dostupan iz backenda. |
| Odgovor pružatelja nije mogao biti verificiran | ID token nije prošao provjeru potpisa, publike, izdavača, isteka ili nonce. Obično se radi o neskladu klijentskog ID-a. |
| Pružatelj nije vratio adresu e-pošte | Nedostaje `email` opseg, ili pružatelj ne objavljuje tu tvrdnju. |
| Vaša adresa e-pošte nije verificirana | Pružatelj je poslao `email_verified: false`, ili je izostavio tvrdnju. |
| Vaša domena e-pošte nije dopuštena | Adresa je izvan **Dopuštenih domena e-pošte**. |
| Ne postoji Heym račun za Vas | **Kreirajte račun pri prvoj prijavi** je isključeno i nijedan račun ne odgovara. Administrator ga mora kreirati. |
| Jedinstvena prijava nije konfigurirana | SSO je onemogućen, ili nedostaju izdavač, klijentski ID ili tajna. |

## Napomene o sigurnosti

- **Klijentska tajna je šifrirana u mirovanju** i nikada se ne vraća putem bilo kojeg endpointa. Obrazac za postavke izvještava samo o tome je li jedna pohranjena.
- **PKCE verifier nikada ne napušta Heym.** Drži se u kratkotrajnom `HttpOnly` kolačiću umjesto u `state` parametru, koji se vraća kroz pružatelja na jasan način.
- **Prihvaćaju se samo asimetrični potpisi.** `none` i simetrični algoritmi se odbacuju bez obzira na to što pružatelj oglašava.
- **Odredište nakon prijave se verificira** kao putanja iste domene, tako da se povratni poziv ne može koristiti kao otvoreni preusmjerivač.
- **Svaka prijava se bilježi.** Uspjesi, neuspjesi i odbijanja pojavljuju se kao `auth.sso_login` linije, a promjene konfiguracije kao `sso_settings.update` — pogledajte [Audit Logging](./audit.md).

## Što nije podržano

- **SAML.** OIDC je jedini protokol.
- **Više istovremenih pružatelja.** Jedna instanca povezuje se s jednim pružateljem.
- **Mapiranje grupa ili uloga** iz tvrdnji pružatelja.
- **Jedinstveno odjavljivanje.** Odjavljivanje iz Heyma ne odjavljuje Vas iz pružatelja.
