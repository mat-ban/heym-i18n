# Enotno prijavljanje

Heym lahko overi uporabnike proti kateremukoli zunanjemu **OpenID Connect** ponudniku. Administrator vnese URL izdajatelja pod **Nastavitve → SSO**, Heym pa prebere vse druge končne točke iz dokumenta za odkrivanje tega ponudnika.

Noben ponudnik ni trdno zakodiran. Keycloak, Okta, Entra ID, Auth0, Google in kateri koli drug OIDC ponudnik se povezujejo preko istih polj, ker je edina informacija, ki jo Heym prejme, izdajatelj.

Prijava s geslom in SSO delujeta vzporedno. Prijava s geslom se lahko izklopi, ko je SSO potrjen.

## Preden začnete

Nastavitve SSO so široke za celotno instanco, zato jih lahko spreminjajo le skrbniki instance. Skrbniki so določeni z okoljsko spremenljivko, ne shranjujejo se v bazo podatkov:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Prazna vrednost ne podeli nobenih pravic. Po spremembi je potrebno ponovno zagnati backend. Računi na tem seznamu prav tako vidijo zavihek **SSO** v Nastavitvah in ohranijo dostop s geslom, tudi ko je prijava s geslom onemogočena — glejte [Onemogočanje prijave s geslom](#disabling-password-sign-in).

## Registracija Heym pri vašem ponudniku

V vašem ponudniku identitete ustvarite **zaupnega odjemalca** (tudi imenovan registracija aplikacije) z:

| Nastavitev | Vrednost |
|------------|----------|
| Protokol | OpenID Connect |
| Tip dodelitve | Avtorizacijska koda s PKCE |
| Avtentikacija odjemalca | Vklopljena — Heym uporablja skrivnost odjemalca |
| Preusmeritveni URI | Natančna vrednost, prikazana v zavihku SSO v Heymu |
| Obsegi | `openid email profile` |

Heym izračuna preusmeritveni URI iz `FRONTEND_URL` in ga prikaže kot samo za branje v obrazcu za nastavitve z gumbom za kopiranje. Vedno se konča z `/api/auth/sso/callback`. Kopirajte ga namesto da bi ga vpisovali — napačen preusmeritveni URI je najpogostejša napaka pri nastavitvah, ponudniki pa ga zavrnejo brez razlage.

Vaš ponudnik mora vrniti preverjen naslov elektronske pošte. Glejte [Zemljevid računov](#account-mapping).

## Konfiguracija Heym

Odprite **Nastavitve → SSO**. Zavihek se prikaže le za račune v `HEYM_ADMIN_EMAILS`.

| Polje | Kaj počne |
|-------|-----------|
| **Omogoči enotno prijavljanje** | Prikaže gumb za prijavo na prijavnem zaslonu. |
| **URL izdajatelja** | Osnovni URL ponudnika, na primer `https://idp.example.com/realms/your-realm`. Heym doda `/.well-known/openid-configuration` in prebere ostalo od tam. |
| **ID odjemalca** | Identifikator odjemalca iz vašega ponudnika. |
| **Skrivnost odjemalca** | Shranjena šifrirana. Pustite polje prazno, da obdržite shranjeno vrednost — Heym nikoli ne vrne skrivnosti, ki jo ima. |
| **Preusmeritveni URI** | Samo za branje. Kopirajte to v dovolilnico vašega ponudnika. |
| **Obsegi** | Privzeto `openid email profile`. |
| **Besedilo oznake gumba za prijavo** | Besedilo na gumbu na prijavnem zaslonu, na primer "Prijavite se z Okta". |
| **Ustvari račun ob prvi prijavi** | Ali neznane osebe samodejno dobijo Heym račun. |
| **Dovoljeni domenski naslovi elektronske pošte** | Ločeni z vejico. Prazno dovoljuje kateri koli domen, ki ga ponudnik overi. |
| **Onemogoči prijavo s geslom** | Izklopi avtentikacijo s geslom za celotno instanco. |

### Najprej preizkusite povezavo

**Preizkus povezave** pridobi dokument za odkrivanje in podpisne ključe ponudnika, nato poroča o končni točki žetona, ki jo je našel. To lahko izvedete na izdajatelju, ki ste ga vnesli, vendar še niste shranili, tako da napačen URL stane le en klik namesto shranjevanja.

Preizkus le *zabeleži* uspešen rezultat, ko je preizkušeni izdajatelj že shranjen. Osnutek preizkusa vam pove, ali se URL razreši; ne dovoljuje konfiguracije, ki ni shranjena. Sprememba izdajatelja, ID-ja odjemalca, obsegov ali skrivnosti izbriše zabeležen rezultat iz istega razloga.

## Kako deluje prijava

1. Nekdo klikne gumb za prijavo na prijavnem zaslonu.
2. Heym jih preusmeri k ponudniku z `state`, `nonce` in PKCE izzivom.
3. Uporabnik se overi pri ponudniku.
4. Ponudnik se preusmeri nazaj na Heymov povratni klic z avtorizacijsko kodo.
5. Heym zamenja kodo za žetone in preveri ID žeton proti objavljenim ključem ponudnika, preverja podpis, občinstvo, izdajatelja, potek in nonce.
6. Heym razreši račun in izda svojo sejo, natanko tako kot pri prijavi s geslom.

Vse, kar sledi koraku 6, ostane nespremenjeno: enaki piškotki seje, enake življenjske dobe žetonov, enake pravice.

## Zemljevid računov

Heym razreši račun v tem vrstnem redu:

1. **`(issuer, subject)`** — identiteta, ki jo je ponudnik potrdil pri prejšnji prijavi. To je avtoritativno in preživi spremembo elektronskega naslova pri ponudniku.
2. **Preverjen elektronski naslov** — obstoječi Heym račun s to naslovom je prevzet, in subjekt ponudnika se od takrat naprej zabeleži na njem.
3. **Nov račun** — ustvarjen, če je **Ustvari račun ob prvi prijavi** vklopljen in je domena dovoljena.

Elektronski naslov se šteje za preverjenega le, ko ID žeton nosi `email_verified: true`. Če je ta trditev `false` ali manjkajoča, je prijava zavrnjena. Prevzem obstoječega računa — ali ustvarjanje novega — na podlagi naslova, za katerega ponudnik ne jamči, je pot do prevzema računa, zato Heym tega ne stori. Ponudnik, ki nikoli ne odda `email_verified`, je potrebno konfigurirati, da to stori.

Računi, ustvarjeni na ta način, nimajo gesla. Prijavljajo se le preko ponudnika.
## Onemogočanje prijave s geslom

Stikalo **Onemogoči prijavo s geslom** ostane nedostopno, dokler niso izpolnjeni trije pogoji:

1. SSO je omogočen.
2. Test povezave je bil uspešen, tako da napačen izdajatelj ne more zakleniti vrat za seboj.
3. Vsaj en račun v `HEYM_ADMIN_EMAILS` dejansko ima geslo.

Ko je stikalo vklopljeno, je avtentikacija s geslom zavrnjena na vseh treh površinah, ki mintajo ali sprejemajo prijavo: na obrazcu za prijavo, **registraciji** in na strani za soglasje MCP OAuth. Registracija šteje, ker izda geslo; pustiti jo odprto bi pomenilo, da bi lahko nastavitev obšli vsi, ki lahko dostopajo do `/register`.

Računi, navedeni v `HEYM_ADMIN_EMAILS`, so izvzeti iz vseh treh pogojev. Kdor lahko ureja okoljsko datoteko, lahko že obnovi instanco, zato ta garancija živi v kodi in ne v spominu operaterja.

### Zakaj obstaja tretji pogoj

Administrator, katerega Heym račun je bil ustvarjen *prek* SSO, nima nobenega gesla. Izvzeto bi jim omogočilo prehod skozi vrata, vendar nimajo ničesar, s čimer bi se lahko prijavili — zato instanca ne bi imela poti nazaj, če bi ponudnik prenehal delovati. Heym zavrača vstop v to stanje in to tudi sporoča.

Če naletite na to sporočilo, se prijavite prek SSO in registrirajte račun z geslom na eni od vaših administratorskih naslovov (registracija je še vedno odprta za administratorske naslove ravno iz tega razloga) ali dodajte naslov, ki že ima geslo, v `HEYM_ADMIN_EMAILS`.

### Obnova, ko je ponudnik nedostopen

Po vrstnem redu prednosti:

1. **Prijavite se z geslom za nujne primere.** Prijavni zaslon skrije obrazec za geslo, ko je prijava s geslom izklopljena, zato kliknite **Prijavite se z geslom namesto tega** pod gumbom SSO, da ga prikažete. Obrazec ni obvoz: vsak naslov zunaj `HEYM_ADMIN_EMAILS` je še vedno zavrnjen in obveščen o razlogu.
2. **Dodajte se v `HEYM_ADMIN_EMAILS`** v okoljski datoteki in ponovno zaženite backend. Račun, ki že ima geslo, se lahko nato prijavi.
3. **Neposredno ponovno odprite prijavo s geslom v bazi podatkov**, če noben administrator nima gesla:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Ponovni zagon ni potreben; nastavitev se prebere ob vsakem zahtevku.

Končni uporabniki portala niso prizadeti. Avtenticirajo se proti ločeni imenik — glejte [Portal](./portal.md).

## Napake pri prijavi

Neuspešna prijava se vrne na prijavni zaslon z berljivim sporočilom. Heym nikoli ne prikaže surovega besedila napake ponudnika.

| Sporočilo | Razlog |
|-----------|--------|
| Poskus prijave je potekel | Poskus je trajal dlje kot deset minut, ali je brskalnik izgubil transakcijsko piškotko. Poskusite znova. |
| Ni bilo mogoče doseči ponudnika identitete | Odkritje ali izmenjava žetonov sta spodletela. Preverite URL izdajatelja in to, da je ponudnik dosegljiv iz backend-a. |
| Odgovora ponudnika ni bilo mogoče preveriti | ID žeton je spodletel pri preverjanju podpisa, občinstva, izdajatelja, poteka ali nonce. Običajno gre za neusklajenost ID-jev strank. |
| Ponudnik ni vrnil e-poštnega naslova | Manjka obseg `email`, ali ponudnik ne sprosti zahtevka. |
| Vaš e-poštni naslov ni potrjen | Ponudnik je poslal `email_verified: false`, ali je zahtevek izpuščen. |
| Vaša domena e-pošte ni dovoljena | Naslov je zunaj **Dovoljenih domen e-pošte**. |
| Za vas ne obstaja Heym račun | **Ustvarite račun ob prvi prijavi** je izklopljen in noben račun ne ustreza. Administrator ga mora ustvariti. |
| Enotna prijava ni konfigurirana | SSO je onemogočen, ali manjkajo izdajatelj, ID stranke ali skrivnost. |

## Varnostne opombe

- **Klientna skrivnost je šifrirana v mirovanju** in nikoli ni vrnjena z nobenega končnega točke. Obrazec za nastavitve poroča le o tem, ali je ena shranjena.
- **PKCE preveritelj nikoli ne zapusti Heym-a.** Shranjen je v kratkotrajni `HttpOnly` piškotku namesto v parametru `state`, ki se v celoti vrne skozi ponudnika na očeh.
- **Sprejemajo se le asimetrični podpisi.** `none` in simetrični algoritmi so zavrnjeni ne glede na to, kaj ponudnik oglašuje.
- **Ciljna destinacija po prijavi je preverjena** kot pot istega izvora, tako da se povratni klic ne more uporabiti kot odprti preusmeritev.
- **Vsaka prijava je audirana.** Uspehi, neuspehi in zavrnitve se pojavijo kot `auth.sso_login` vrstice, spremembe konfiguracije pa kot `sso_settings.update` — glejte [Revizijsko beleženje](./audit.md).

## Kaj ni podprto

- **SAML.** OIDC je edini protokol.
- **Več hkratnih ponudnikov.** Ena instanca se povezuje z enim ponudnikom.
- **Mapping skupin ali vlog** iz zahtevkov ponudnika.
- **Enotno odjavljanje.** Odjava iz Heym-a vas ne odjavi iz ponudnika.
