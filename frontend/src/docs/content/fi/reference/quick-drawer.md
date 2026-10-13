# Pikavalikko

**Pikavalikko** on oikeassa reunassa sijaitseva nopean suorituksen paneeli workfloweille. Se näkyy kirjautuneen käyttäjän sivuilla, kuten kojelaudan [Workflowt-välilehdellä](../tabs/workflows-tab.md), Docsissa ja Arvioinneissa.

## Käyttö

- Klikkaa näytön oikean reunan kiinnitettyä **Quick / Workflows** -käynnistintä
- Kun [Kontekstuaalinen esittely](./contextual-showcase.md) on myös saatavilla, sen **Sivun opas** -käynnistin sijaitsee Pikaworkflowt-käynnistimen yläpuolella
- Valikko avautuu oikealta ja siirtää nykyisen sivun hieman vasemmalle lievällä skaalauksella
- Mobiililaitteilla Pikavalikko on piilotettu
- Valikkoa ei näytetä workflow-editorissa, kirjautumis-/rekisteröintisivuilla, portaalissa tai HITL-arviointisivuilla

## Workflow-haku

Käytä valikon yläosassa olevaa hakukenttä workflowjen etsimiseen seuraavien perusteella:

- Workflown nimi
- Workflown kuvaus

Haku ei ole kirjainkokoriippuvainen ja päivittää listan välittömästi.

## Kiinnitetyt workflowt

Kiinnitä workflowt pitääksesi ne valikon yläosassa.

- Kiinnitetyt workflowt näkyvät omana osiona täyden listan yläpuolella
- Uudet kiinnitykset lisätään listan alkuun
- Kiinnitysjärjestys säilyy selaimen tallennustilassa uudelleenlatausten välillä

## Workflowjen suorittaminen

Valitse workflow avataksesi sen syöttölomakkeen.

- Syötekentät näytetään pystysuorassa järjestyksessä valikossa
- Klikkaa **Suorita workflow** aloittaaksesi valitun workflown suorituksen
- Klikkaa **Pysäytä workflow** keskeyttääksesi käynnissä olevan suorituksen valikosta
- Workflowt ilman syötekenttiä voidaan silti suorittaa suoraan
- Workflow, joka alkaa [File Upload Trigger](../nodes/file-upload-trigger-node.md) -solmulla, näyttää lomakkeen sijaan pudotusalueen: pudota tiedosto siihen tai valitse tiedosto napsauttamalla. Alue näyttää triggerin hyväksymät tiedostotyypit ja enimmäiskoon sekä hylkää muut tiedostot ennen lähetystä. **Run Workflow** pysyy poissa käytöstä, kunnes tiedosto on valittu.

Valikko käyttää samaa workflow-suoritusrajapintaa kuin muut Heymin suorituspinnat, joten tulokset ja suorituskäyttäytyminen pysyvät yhtenäisinä.

Suorituksen pysäyttäminen valikosta keskeyttää myös taustalla olevan suorituksen, mukaan lukien kaikki kyseisen workflown suorituksen aikana käynnissä olevat Playwright-selaintyöt.

## Edistyminen ja tulokset

Suorituksen aloittamisen jälkeen valikko näyttää:

- Suoritettavien solmujen edistymisen reaaliaikaisesti
- Lopullisen tilan: `success`, `error` tai `pending`
- Lopulliset tulokset tiiviissä JSON-paneelissa
- Historiamerkinnät, joissa on tunniste `Quick Drawer`

`pending` tarkoittaa, että workflow odottaa myöhempää toimintoa, kuten ihmisen arviointia.

Tiedostosuoritus kulkee triggerin kertakäyttöisen latauslinkin kautta: paneeli pyytää workflow'lta linkin, lataa tiedoston siihen ja näyttää tuloksen latauksen valmistuttua. Tiedostosuorituksissa näytetään lopullinen tila ja tulosteet mutta ei vaiheittaista edistymistä, ja ne merkitään historiassa myös `Quick Drawer` -tunnisteella. Valittu tiedosto tyhjennetään jokaisen suorituksen jälkeen, koska yksi linkki vastaanottaa vain yhden tiedoston.

## Selaintallennus

Pikavalikko tallentaa henkilökohtaiset asetukset `localStorageen`:

- Kiinnitettyjen workflowjen tunnisteet
- Viimeksi valittu workflow

Tässä versiossa valikko **ei** tallenna syötearvoja.

## Laajuus

Pikavalikko on tarkoituksella kevyt suorituspinta.

- Sisältyy: haku, kiinnitys, valinta, syöttö (mukaan lukien tiedosto), suoritus, edistyminen, tulos
- Ei sisälly: workflowjen luominen, muokkaaminen, kansioiden hallinta ja canvas-toiminnot

## Liittyvät

- [Workflowt-välilehti](../tabs/workflows-tab.md) – Pääworkflowlista, kansiot ja hallinta
- [Pika-aloitus](../getting-started/quick-start.md) – Rakenna ja suorita ensimmäinen workflowsi
- [Suoritushistoria](./execution-history.md) – Tarkastele aiemmin suoritettuja workflowja
- [Webhookit](./webhooks.md) – Käynnistä workflowt HTTP:n yli
- [Kontekstuaalinen esittely](./contextual-showcase.md) – Sivukohtainen opasraide, joka täydentää Pikavalikkoa
