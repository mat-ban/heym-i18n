# Kontekstuaalinen esittely

**Kontekstuaalinen esittely** on kevyt sovelluksen sisäinen opas, joka selittää nykyisen sivun sisällön välittömästi ilman täydellistä dokumentaatiovirtaa.

## Toiminnallisuus

- Näyttää lyhyen yhteenvedon nykyisestä sivusta
- Pitää ensimmäisen kerroksen tiiviinä, jotta tieto ei ylitä
- Mahdollistaa lisätietojen näyttämisen vain tarvittaessa
- Tarjoaa linkit täydelliseen dokumentaatiosivustoon syvempää lukemista varten

## Näkyvyys

Versiossa 1 esittely on saatavilla Heymin pääkäyttöliittymän sisällä:

- Ohjausnäkymän välilehdet
- [Arvioinnit](../tabs/evals-tab.md)
- [Dokumentaatio](../getting-started/introduction.md)
- Workflow-editorin canvas-alue

Julkisilla sivuilla, kuten kirjautumisessa, rekisteröinnissä, chat-portaalissa ja HITL-arvioinneissa, esittelyä ei näytetä.

## Käyttö

### Työpöytäversio

- Kiinteä **Sivun opas** -käynnistin näkyy näytön oikeassa reunassa
- Esittely avautuu oikealle sivuun vetolaatikoksi
- Se pysyy oletusarvoisesti suljettuna
- Kertaluonteinen esittely auttaa havaitsemaan opasominaisuuden olemassaolon pakottamatta sitä auki

### Mobiiliversio

- Sama sisältö on saatavilla kelluvasta **Sivun opas** -painikkeesta
- Se avautuu alareunan ponnahduspaneelina oikean reunan sijaan

## Sisältömalli

Jokainen esittelykohde käyttää rakenteellista määrittelyä täysin räätälöidyn komponentin sijaan.

- **Otsikko** – Sivun sisältö
- **Yhteenveto** – Yksi lyhyt selitys
- **Luettelomerkinnät** – Muutaman skannattavan vihjeen
- **Kohokohdat** – Pienet kortit keskeisille arvoille tai käyttötavoille
- **Lisätiedot** – Tiivistetyt osiot ylimääräiselle kontekstille
- **Toiminnot** – Yleensä yksi tai kaksi linkkiä, useimmiten täydelliseen dokumentaatioon

Tämä pitää järjestelmän joustavana välttäen samalla pitkät, sekavat ohjauspaneelit.

## Kontekstitietoisuus

Esittely muuttuu nykyisen käyttöliittymäalueen mukaan.

- Ohjausnäkymän välilehdillä on omat yhteenvetonsa
- Editori viittaa [Canvas-ominaisuuksiin](./canvas-features.md)
- Dokumentaatiosivu käyttää yleistä dokumentaatioyhteenvetoa ja mahdollisuuksien mukaan viittaa jo avaamaasi artikkeliin

## Pysyvyys

Esittely tallentaa pienen määrän henkilökohtaisia käyttöliittymätietoja selaimen tallennustilaan:

- Oliko paneeli tai ponnahduspaneeli viimeksi auki
- Mitkä sivukontekstit ovat jo näyttäneet esittelyn
- Viimeksi laajennettu lisätieto-osio kunkin kontekstin osalta

## Tarkoitus

Tavoitteena on tehdä Heymistä helpompi oppia lisäämättä raskasta käyttöliittymäkerrosta.

- Lyhyt, aina lähellä oleva ohjaus orientoitumiseen
- Selkeä polku syvempään dokumentaatioon
- Vähäinen häiriö kokeneille käyttäjille

## Liittyvät

- [Workflowt-välilehti](../tabs/workflows-tab.md) – Ohjausnäkymän pääalue
- [Arvioinnit-välilehti](../tabs/evals-tab.md) – Arviointityönkulut
- [Canvas-ominaisuudet](./canvas-features.md) – Editorin toiminta ja virheenkorjaus
- [Pikavetolaatikko](./quick-drawer.md) – Toinen kiinteä oikean reunan apupinta
