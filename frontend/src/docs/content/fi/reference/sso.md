# Yhden kirjautumisen järjestelmä (SSO)

Heym voi todentaa käyttäjät minkä tahansa ulkoisen **OpenID Connect** -palvelun kautta. Järjestelmänvalvoja syöttää tunnistuspalvelun URL-osoitteen **Asetukset → SSO** -välilehdellä, minkä jälkeen Heym lukee muut päätepisteet palveluntarjoajan discovery-dokumentista.

Mikään tietty palveluntarjoaja ei ole kovakoodattu. Keycloak, Okta, Entra ID, Auth0, Google ja muut OIDC-yhteensopivat palvelut yhdistetään samoilla kentillä, koska Heymille kerrotaan ainoastaan tunnistuspalvelun perusosoite.

Salasanalla kirjautuminen ja SSO toimivat rinnakkain. Salasanakirjautuminen voidaan poistaa käytöstä, kun SSO on varmistettu toimivaksi.

## Ennen aloittamista

SSO-asetukset koskevat koko Heym-instanssia, joten vain instanssin ylläpitäjät voivat muuttaa niitä. Ylläpitäjät määritellään ympäristömuuttujan avulla, eikä heitä tallenneta tietokantaan:

```
HEYM_ADMIN_EMAILS=admin@example.com,ops@example.com
```

Tyhjä arvo ei myönnä ylläpitäjän oikeuksia kenellekään. Backend on käynnistettävä uudelleen muutoksen jälkeen. Tällä listalla olevat käyttäjät näkevät myös **SSO**-välilehden Asetuksissa ja säilyttävät salasanakirjautumisen, vaikka se olisi muilta käyttökiellossa — katso [Salasanakirjautumisen poistaminen käytöstä](#salasanakirjautumisen-poistaminen-käytöstä).

## Heymin rekisteröinti palveluntarjoajalle

Luo tunnistuspalveluntarjoajallasi **luottamuksellinen asiakassovellus** (tunnetaan myös nimellä sovellusrekisteröinti) seuraavin asetuksin:

| Asetus | Arvo |
|---------|-------|
| Protokolla | OpenID Connect |
| Myöntötyyppi | Authorization Code with PKCE |
| Asiakkaan todennus | Käytössä — Heym käyttää asiakassalaisuutta |
| Uudelleenohjaus-URI | Tarkka arvo, joka näkyy Heymin SSO-välilehdellä |
| Oikeudet | `openid email profile` |

Heym laskee uudelleenohjaus-URLin `FRONTEND_URL`-muuttujan perusteella ja näyttää sen asetuslomakkeessa vain luettavana kopiointipainikkeella. Osoite päättyy aina `/api/auth/sso/callback`. Kopioi se sen sijaan että kirjoittaisit sen — virheellinen uudelleenohjaus-URI on yleisin konfigurointivirhe, ja palveluntarjoajat hylkäävät sen ilman selitystä.

Palveluntarjoajan on palautettava vahvistettu sähköpostiosoite. Katso [Käyttäjätilin yhdistäminen](#käyttäjätilin-yhdistäminen).

## Heymin konfigurointi

Avaa **Asetukset → SSO**. Välilehti näkyy vain `HEYM_ADMIN_EMAILS`-listalla oleville tileille.

| Kenttä | Toiminto |
|-------|--------------|
| **Ota yhden kirjautumisen järjestelmä käyttöön** | Näyttää kirjautumispainikkeen kirjautumisnäytöllä. |
| **Tunnistuspalvelun URL** | Palveluntarjoajan perusosoite, esimerkiksi `https://idp.example.com/realms/your-realm`. Heym lisää päätteeksi `/.well-known/openid-configuration` ja lukee muut tiedot sieltä. |
| **Asiakastunnus** | Asiakkaan tunniste palveluntarjoajalta. |
| **Asiakassalaisuus** | Tallennetaan salattuna. Jätä kenttä tyhjäksi säilyttääksesi tallennetun arvon — Heym ei koskaan paljasta tallennettua salaisuutta. |
| **Uudelleenohjaus-URI** | Vain luettavissa. Kopioi tämä palveluntarjoajan sallittujen listalle. |
| **Oikeudet** | Oletusarvoisesti `openid email profile`. |
| **Kirjautumispainikkeen teksti** | Kirjautumisnäytön painikkeen teksti, esimerkiksi "Kirjaudu Okta-tunnuksilla". |
| **Luo tili ensimmäisellä kirjautumiskerralla** | Määrittää, saavatko tuntemattomat käyttäjät Heym-tilin automaattisesti. |
| **Sallitut sähköpostiverkkotunnukset** | Pilkuin eroteltuina. Tyhjä arvo sallii minkä tahansa palveluntarjoajan todentaman verkkotunnuksen. |
| **Poista salasanakirjautuminen käytöstä** | Poistaa salasanatodennuksen käytöstä koko instanssissa. |

### Testaa yhteys ensin

**Testaa yhteys** hakee discovery-dokumentin ja palveluntarjoajan allekirjoitusavaimet, jonka jälkeen se raportoi löydetyn token-päätepisteen. Testin voi suorittaa kirjoittamallaan tunnistusosoitteella ennen tallennusta, joten virheellinen URL maksaa vain yhden napsautuksen tallennuksen sijaan.

Testi *tallentaa* läpäisevän tuloksen vain, jos testattu tunnistusosoite on jo tallennettu. Luonnosvaiheen testi kertoo vain, ratkaiseeko URL-osoite; se ei hyväksy konfiguraatiota, joka ei ole tallennettu. Tunnistusosoitteen, asiakastunnuksen, oikeuksien tai salaisuuden muuttaminen tyhjentää tallennetun tuloksen samasta syystä.

## Kirjautumisen toimintaperiaate

1. Käyttäjä napsauttaa kirjautumispainiketta kirjautumisnäytöllä.
2. Heym ohjaa hänet tunnistuspalveluntarjoajalle mukanaan `state`, `nonce` ja PKCE-haaste.
3. Käyttäjä todentaa itsensä palveluntarjoajalla.
4. Palveluntarjoaja ohjaa takaisin Heymin callback-osoitteeseen valtuutuskoodin kanssa.
5. Heym vaihtaa koodin tokeneiksi ja vahvistaa ID-tokenin palveluntarjoajan julkaisemia avaimia vastaan, tarkistaen allekirjoituksen, kohdeyleisön, tunnistuspalvelun, vanhentumisajan ja nonce-arvon.
6. Heym selvittää käyttäjätilin ja myöntää oman istuntonsa, aivan kuten salasanakirjautumisessa.

Kaikki vaiheesta 6 eteenpäin pysyy muuttumattomana: samat istuntokeksit, samat tokenien elinajat, samat käyttöoikeudet.

## Käyttäjätilin yhdistäminen

Heym selvittää käyttäjätilin seuraavassa järjestyksessä:

1. **`(tunnistuspalvelu, subjekti)`** — tunnistuspalvelun aiemmalla kirjautumiskerralla vahvistama identiteetti. Tämä on auktoritatiivinen ja säilyy, vaikka sähköpostiosoite muuttuisi palveluntarjoajalla.
2. **Vahvistettu sähköpostiosoite** — olemassa oleva Heym-tili kyseisellä osoitteella yhdistetään, ja palveluntarjoajan subjekti tallennetaan siitä lähtien.
3. **Uusi tili** — luodaan, jos **Luo tili ensimmäisellä kirjautumiskerralla** on käytössä ja verkkotunnus on sallittu.

Sähköpostiosoite lasketaan vahvistetuksi vain, kun ID-token sisältää `email_verified: true`. Jos vaatimus on `false` tai puuttuu, kirjautuminen evätään. Olemassa olevan tilin yhdistäminen — tai uuden luominen — sähköpostiosoitteen perusteella, jota palveluntarjoaja ei takaa, olisi tilin kaappausreitti, joten Heym ei tee sitä. Palveluntarjoaja, joka ei koskaan lähetä `email_verified`-vaatimusta, on konfiguroitava tekemään niin.

Tällä tavalla luoduilla tileillä ei ole salasanaa. Ne kirjautuvat vain tunnistuspalveluntarjoajan kautta.
## Salasanakirjautumisen poistaminen käytöstä

**Poista salasanakirjautuminen käytöstä** -kytkin pysyy pois käytöstä, kunnes kolme ehtoa täyttyvät:

1. SSO on käytössä.
2. Yhteystesti on läpäisty, joten väärä tunnistuspalvelu ei voi lukita ovea itsensä takana.
3. Vähintään yhdellä `HEYM_ADMIN_EMAILS` -listalla olevalla tilillä on todella salasana.

Kun kytkin on päällä, salasanatodennus hylätään kaikilla kolmella käyttöliittymällä, jotka luovat tai hyväksyvät sen: kirjautumislomake, **rekisteröinti** ja MCP OAuth -hyväksyntäsivu. Rekisteröinti lasketaan mukaan, koska se luo salasanan; jos se jätettäisiin auki, asetus voitaisiin ohittaa kenellä tahansa, joka pääsee käsiksi osoitteeseen `/register`.

`HEYM_ADMIN_EMAILS` -listalla olevat tilit ovat vapautettuja kaikista kolmesta rajoituksesta. Joka voi muokata ympäristötiedostoa, voi jo palauttaa instanssin, joten tämä takuu on toteutettu koodissa eikä operaattorin muistissa.

### Miksi kolmas ehto on olemassa

Hallintokäyttäjällä, jonka Heym-tili on luotu *SSO:n kautta*, ei ole salasanaa ollenkaan. Poikkeus antaisi heidän päästä portin läpi, mutta heillä ei olisi mitään, millä kirjautua sisään – joten instanssilla ei olisi paluutietä, jos tunnistuspalvelu lakkaisi toimimasta. Heym kieltäytyy siirtymästä tähän tilaan ja ilmoittaa siitä.

Jos saat tämän viestin, kirjaudu sisään SSO:n kautta ja luo salasanatili jollekin hallintokäyttäjän sähköpostiosoitteistasi (rekisteröinti on edelleen avoinna hallintokäyttäjien osoitteille juuri tätä varten), tai lisää osoite, jolla on jo salasana, `HEYM_ADMIN_EMAILS` -listalle.

### Toipuminen, kun tunnistuspalvelu ei toimi

Suositusjärjestyksessä:

1. **Kirjaudu sisään hätätilasalasanalla.** Kirjautumisnäyttö piilottaa salasanalomakkeen, kun salasanakirjautuminen on pois käytöstä, joten napsauta SSO-painikkeen alla olevaa **Kirjaudu sisään salasanalla** -linkkiä näyttääksesi sen. Lomake ei ole kiertotie: kaikki `HEYM_ADMIN_EMAILS` -listan ulkopuoliset osoitteet hylätään edelleen, ja niille kerrotaan syy.
2. **Lisää itsesi `HEYM_ADMIN_EMAILS` -listalle** ympäristötiedostossa ja käynnistä taustajärjestelmä uudelleen. Tili, jolla on jo salasana, voi sitten kirjautua sisään.
3. **Avaa salasanakirjautuminen suoraan tietokannassa**, jos yksikään hallintokäyttäjä ei ole salasanaa:

   ```sql
   UPDATE sso_settings SET password_login_disabled = false;
   ```

   Uudelleenkäynnistystä ei tarvita; asetus luetaan pyynnön yhteydessä.

Portaalin loppukäyttäjiin tämä ei vaikuta. He todentavat erillistä hakemistoa vastaan – katso [Portal](./portal.md).

## Kirjautumisvirheet

Epäonnistunut kirjautuminen palauttaa kirjautumisnäyttöön luettavalla viestillä. Heym ei koskaan näytä tunnistuspalvelun raakaa virhetekstiä.

| Viesti | Syy |
|---------|-------|
| Kirjautumisyritys vanhentui | Yritys kesti yli kymmenen minuuttia tai selain hylkäsi evästeen. Yritä uudelleen. |
| Tunnistuspalveluun ei saatu yhteyttä | Löytäminen tai tunnuksen vaihto epäonnistui. Tarkista tunnistuspalvelun URL ja että taustajärjestelmä pääsee siihen käsiksi. |
| Tunnistuspalvelun vastausta ei voitu varmistaa | ID-tunnuksen allekirjoitus, kohdeyleisö, tunnistuspalvelu, vanhentuminen tai nonce-vahvistus epäonnistui. Yleensä asiakastunnuksen epäsuhta. |
| Tunnistuspalvelu ei palauttanut sähköpostiosoitetta | `email` -alue puuttuu tai tunnistuspalvelu ei vapauta vaatimusta. |
| Sähköpostiosoitteesi ei ole vahvistettu | Tunnistuspalvelu lähetti `email_verified: false` tai jätti vaatimuksen pois. |
| Sähköpostialueesi ei ole sallittu | Osoite ei ole **Sallitut sähköpostialueet** -listalla. |
| Heym-tiliäsi ei ole olemassa | **Luo tili ensimmäisellä kirjautumisella** on pois käytöstä eikä vastaavaa tiliä löydy. Hallintokäyttäjän on luotava se. |
| Yksittäinen kirjautuminen ei ole määritetty | SSO on pois käytöstä tai tunnistuspalvelu, asiakastunnus tai salaisuus puuttuu. |

## Turvallisuushuomautukset

- **Asiakassalaisuus on salattu levyllä** eikä sitä koskaan palauteta minkään päätepisteen kautta. Asetuslomake raportoi vain, onko salaisuus tallennettuna.
- **PKCE-vahvistin ei koskaan poistu Heymistä.** Se säilytetään lyhytikäisessä `HttpOnly` -evästeessä `state` -parametrin sijaan, joka kulkee tunnistuspalvelun kautta selväkielisenä.
- **Vain epäsymmetriset allekirjoitukset hyväksytään.** `none` ja symmetriset algoritmit hylätään riippumatta siitä, mitä tunnistuspalvelu mainostaa.
- **Kirjautumisen jälkeinen kohde vahvistetaan** saman alkuperän poluksi, joten takaisinkutsua ei voi käyttää avoimena uudelleenohjauksena.
- **Jokainen kirjautuminen auditoidaan.** Onnistumiset, epäonnistumiset ja hylkäykset näkyvät `auth.sso_login` -riveinä ja asetusmuutokset `sso_settings.update` -riveinä – katso [Auditointiloki](./audit.md).

## Mitä ei tueta

- **SAML.** OIDC on ainoa protokolla.
- **Useita samanaikaisia tunnistuspalveluita.** Yksi instanssi yhdistyy yhteen tunnistuspalveluun.
- **Ryhmä- tai roolimäärityksiä** tunnistuspalvelun vaatimuksista.
- **Yksittäistä uloskirjautumista.** Heymistä kirjautuminen ulos ei kirjaa sinua ulos tunnistuspalvelusta.
