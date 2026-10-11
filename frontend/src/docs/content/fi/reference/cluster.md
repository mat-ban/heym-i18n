# Kuormanjako

Ohjaa toinen Heym-instanssi samaan PostgreSQL-tietokantaan, ja se liittyy työntekijäksi (worker). Taustalla suoritettavat workflowt jaetaan sitten instanssien kesken asettamallesi prosenttiosuudella, jolloin käyttöliittymää ja API:a tarjoava kone ei ole ainoa, joka suorittaa kaikki workflowt.

Instanssit eivät koskaan kommunikoi keskenään. Postgres hoitaa työnjaon, joten työntekijäinstanssi ei tarvitse avointa porttia, sertifikaattia eikä reittiä takaisin pääinstanssiin — vain tietokantayhteyden.

## Roolit

Yksi instanssi on **pääinstanssi** (main), joka määritetään ympäristömuuttujalla. Se tarjoaa käyttöliittymän, API:n, MCP:n ja chat-portaalin sekä hallinnoi tiedostovarastoa ja asennettuja laajennuksia. Kaikki muut instanssit ovat **työntekijöitä** (workers): ne käyttävät vain tietokantaa ja suorittavat taustalla ajettavia workflowja.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # tai: worker
HEYM_INSTANCE_NAME=EU Main    # näyttönimi, muokattavissa myöhemmin Asetuksista
HEYM_INSTANCE_ID=eu-main      # valinnainen; johdetaan nimestä, jos tyhjä
```

Päärooli eroaa johtajan valinnasta (leader election). Heym valitsee johtajan koko klusterin kesken, joka vastaa cron-ajoista, hälytysten arvioinnista ja kaatumien jälkeisestä palautumisesta; jos pääinstanssi kaatuu, johtajuus siirtyy työntekijälle muutamassa sekunnissa, ja aikataulutetut suoritukset jatkavat. Päärooli ei siirry, koska tiedostovarasto ei voi siirtyä sen mukana.

## Mitä voi jättää pääinstanssin ulkopuolelle

Sijoitus päätetään workflown solmuista ennen suorituksen alkamista. Suoritus pysyy pääinstanssilla, jos jokin sen solmuista — mukaan lukien alityönkulkujen solmut — koskee jotain, mikä on olemassa vain yhdellä koneella:

| Solmu | Miksi se pysyy pääinstanssilla |
|---|---|
| Codex, OpenCode Go | Koodausagentin työtila säilyy paikallisella levyllä, jotta jatkaminen on mahdollista |
| Agentti, johon on liitetty taito | Taitokoodi lukee ja kirjoittaa Heym Driveen |
| Drive, Converter, Google Drive | Ne lukevat ja kirjoittavat luotuja tiedostoja |
| File Upload -käynnistin | Lähetetty tiedosto tallentuu pääinstanssin levylle |
| Send Email | Yritysten SMTP-välittimet usein sallivat vain yhden lähdeosoitteen |
| Laajennussolmut | Laajennus on asennettu yhden instanssin levylle |

**Kaikki muu jaetaan** — mukaan lukien Code-solmu, Playwright ja Agent Python -työkalut. Jokainen instanssi suorittaa saman kuvan omalla Docker-socketillaan, joten sandbox ei ole syy pitää suoritusta pääinstanssilla, ja nämä ovat tuotteen suorituskyvyltä vaativimmat solmut.

Workflow, jonka alityönkulku valitaan lausekkeella, ei ole tarkistettavissa etukäteen, joten se pysyy pääinstanssilla.

## Prosenttiosuuksien valinta

Painotukset ovat kokonaislukuja, jotka asetetaan **Asetukset → Instanssit** -kohdassa. Ne ovat **käytettävissä olevien instanssien osuuksia**, ei prosentteja sadasta: ajastaja jakaa kyseisen poolin omalla kokonaissummalla.

Ero näkyy heti, kun yksi instanssi poistuu käytöstä. Kun asetukset ovat `Main 41, Worker A 26, Worker B 33` ja Worker B sammutetaan, pooliksi jää 67, jolloin Main saa 41/67 = **61%** ja Worker A 26/67 = **39%**. Paneeli näyttää tehollisen jaon taulukon alla juuri tätä varten, ja tallennusta ei koskaan estetä, vaikka luvut eivät yhteenlaskettuna olisi 100 — vain jako, jossa yksikään käytössä oleva instanssi ei saa painoa, hylätään.

Kaksi asiaa on helppo ymmärtää väärin.

**Prosenttiosuus ei ole osuus koneen tehosta.** Se kattaa vain jonon kautta menevät suoritukset. Käyttöliittymän ja API:n tarjoaminen, editorin ja portal-suoritusten suoritus sekä tiedostojen lähettäminen ovat kaikki pääinstanssin työtä, eikä niistä lasketa. Pääinstanssi tekee enemmän kuin sen numero antaa ymmärtää.

**Pääinstanssin prosenttiosuus on katto, ei lattia.** Vain pääinstanssilla suoritettavat workflowt vähentävät sen kiintiötä, joten kun kiintiö on täynnä, jaettavat suoritukset menevät työntekijöille. Pienellä pääinstanssin numerolla ei ole vaaraa — sinne kuuluvat työt suoritetaan silti. Liian suuri numero näännyttää työntekijät.

Jos pääinstanssi on tehokas ja työntekijä pienempi, aloita lähempänä 60/40 kuin koneiden raakaosuutta, vertaa sitten todellisia suoritusaikoja Suoritukset-välilehdellä ja säädä tarvittaessa.

Painotukset normalisoidaan uudelleen käytössä olevien ja yhteensopivien instanssien kesken. Kun asetukset ovat `main=70, A=15, B=15` ja A poistuu käytöstä, jako muuttuu 70/85 ja 15/85 pääinstanssin ja B:n välillä ja palaa 70/15/15, kun A palaa.

**Palannut instanssi ei saa korvauksia menetetyistä suorituksista.** Aika, joka kuluu Poissa, Pois käytöstä tai yhteensopimattomalla versiolla, ei lasketa sen osuuteen, joten yön yli poissa ollut työntekijä liittyy takaisin poolin nykyiseen tilaan ja jako on taas 70/30 sen ensimmäisestä suorituksesta lähtien — se ei ime kaikkia suorituksia, kunnes on saanut osuutensa. Työntekijä, joka oli koko ajan käytettävissä, saa kuitenkin kiinni, mikä tekee pääinstanssin prosenttiosuudesta katteen.

### Uusi instanssi liittyy nollalla

Instanssi, jolle ei ole koskaan annettu painoa, aloittaa nollalla, mikä jättäisi sen Käytössä, Käytössä- tilaan, mutta vastaanottamatta mitään. **Anna uusille instansseille osuus automaattisesti** — oletuksena päällä, instanssitaulukon alla — korjaa tämän: johtajan seuraavalla käynnistyksellä uusi instanssi saa yhtä suuren osuuden poolista, ja olemassa olevat painotukset skaalataan alaspäin säilyttäen suhteet keskenään, joten tarkoituksellinen 70/30 näkyy edelleen suunnilleen 70/30. Kokonaissumma pysyy tarkalleen 100.

Tämä suoritetaan **kerran instanssia kohti**. Sekä automaattinen jako että oma muokkaus merkitsevät instanssin konfiguroiduksi, joten itse asettamaasi instanssia ei koskaan muuteta tietämättäsi — mukaan lukien tarkoituksella nollaksi asetettu instanssi. Sammuta asetus, jos haluat jokaisen uuden koneen odottavan sinua.

Vain käytössä, käytettävissä ja yhteensopivat instanssit osallistuvat. Osuuden antaminen koneelle, joka ei voi suorittaa mitään, jättäisi sen osuuden käyttämättä.
### Kun prosentit eivät auta

Asetusnäkymä näyttää, kuinka suuri osa viimeisen 24 tunnin suorituksista pystyi käyttämään vain pääinstanssia. Jos luku on korkea – esimerkiksi Codex- tai Drive-painotteisessa työkuormassa – työntekijäinstanssit jäävät tyhjilleen painoarvoista riippumatta, ja ratkaisu on isompi pääinstanssi lisäinstanssien sijaan.

## PostgreSQL:n skaalaus klusterille

Yhteyksien määrä kasvaa instanssien, ei vain käyttäjien mukaan. Jokainen instanssi käynnistää useita uvicorn-prosesseja, ja jokainen prosessi pitää yhteydenvaraajaa sekä neljää `LISTEN`-yhteyttä (peruutukset, jonon herätykset, suoritustulokset, chat-virrat). Avoimet chat-virrat jakavat yhden chat-yhteyden, joten ne eivät lisää tietokantayhteyksiä. Kolmen instanssin klusteri oletusarvoisella `max_connections = 100` -asetuksella käyttää yhteydet loppuun, ja Heym ei enää pääse omaan tietokantaansa.

Arvioi karkeasti `instanssit × prosessit × (async-varaaja + sync-varaaja + 4)` ja aseta `max_connections` tämän yläpuolelle.

Pienennä varaajien kokoa sen sijaan, että vain nostaisit kattoa. Yksittäisen käyttöönoton oletusarvot ovat 10+20 async- ja 5+10 sync-yhteyttä prosessia kohden, mikä on runsas yhdelle koneelle ja liikaa klusterille:

| Muuttuja | Yksittäinen instanssi | Klusteri |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Esimerkkitiedosto `compose.yml` asettaa nämä ja `max_connections = 300`. Tämä laskee kahden instanssin klusterin yhteyksien katon 768:sta 192:een, ja kolmen instanssin klusteri pysyy alle 300:n.

## Klusterin ulkopuoliset vaatimukset

**Jokaisen instanssin on käytettävä samaa `SECRET_KEY`- ja `ENCRYPTION_KEY`-arvoa.** Työntekijäinstanssi, jolla on eri `ENCRYPTION_KEY`, ei pura salattuja tunnistetietoja, ja jokainen tunnistetietoja käyttävä suoritus epäonnistuu kertomatta hyödyllistä tietoa. Heym vertaa molempien avainten tiivistettä jokaisella sydämenlyönnillä, samoin kuin sovellusversion ja tietokantarevision, ja merkitsee epäyhdenmukaisen instanssin tilaan **Mismatch**, jolloin se ei saa lainkaan työtä. Kuorma siirtyy pääinstanssille, kunnes vika korjataan.

Tämä määrittää myös päivitysjärjestyksen. Pääinstanssin päivitys ensin merkitsee kaikki työntekijäinstanssit yhteensopimattomiksi; työ palaa pääinstanssille, ja jokainen työntekijäinstanssi liittyy takaisin sitä mukaa kuin se päivitetään. Hitaampaa, näkyvää ja peruutettavaa.

**Ohjaa saapuvan liikenteen vain pääinstanssille.** Pyöreäjakautuminen käyttäjäliikenteessä lähettäisi tiedostonlähetyksen yhteen koneeseen ja sen latauksen toiseen. Koodissa ei ole estettä tälle, koska työntekijäinstanssi käyttää samaa kuvaa ja vastaa kaikkiin saamiinsa pyyntöihin.

**Jokaisella instanssilla on oltava sama julkinen `FRONTEND_URL`-arvo.** Suoritus, joka keskeytyy ihmisen tarkastusta varten, luo tarkastuslinkin suorittaneelle instanssille, ei pääinstanssille. Sama koskee Codex-seuraamuslinkkejä ja luotujen tiedostojen latausosoitteita. Työntekijäinstanssi, jolta `FRONTEND_URL` puuttuu, rakentaa nämä linkit oman paikallisen osoitteensa pohjalta, eikä niitä voi avata.

**Työntekijäinstansseilla on eri lähtevä IP-osoite.** Kaikki API:t, jotka rajoittavat lähdeosoitteita, näkevät uuden osoitteen. Sähköpostin lähetys suoritetaan pääinstanssilla juuri tästä syystä; HTTP-solmua varten joko anna klusterille yksi NAT-lähtöosoite tai salli jokainen instanssi.

## Työntekijäinstanssin lisääminen toiselle koneelle

Repositoryn juuressa oleva `docker-compose.worker.yml` käynnistää työntekijäinstanssin omalle isännälleen. Siinä ei ole tietokantaa eikä käyttöliittymää: se yhdistää pääinstanssin PostgreSQL:ään ja ottaa osansa taustalla suoritettavista töistä.

Täytä sen viereen `.env`-tiedosto – kuvan tunniste, tietokannan isäntä ja tunnistetiedot, molemmat avaimet ja instanssin tunniste – ja käynnistä se. Compose kieltäytyy käynnistymästä, ennen kuin jokainen vaadittu arvo on asetettu, sen sijaan että käynnistyisi paikkamerkin kanssa, joka epäonnistuu myöhemmin vaikeasti luettavalla tavalla.

Kuvan tunnisteen on oltava sama versio kuin pääinstanssilla, ja molempien avainten on oltava täsmälleen samat. Ero jommassa kummassa näyttää työntekijäinstanssin tilana **Mismatch**, eikä se saa työtä.

## Instanssitaulun lukeminen

| Sarake | Merkitys |
|---|---|
| Nimi | Muokattava nimi; se leimataan jokaiselle tämän instanssin suorittamalle työlle |
| Rooli | `main` tai `worker`, ympäristöstä |
| Tila | **Live** tuoreen sydämenlyönnin kanssa, **Offline** 30 sekunnin hiljaisuuden jälkeen, **Mismatch**, kun versio, tietokantarevisio tai avaimet poikkeavat pääinstanssin vastaavista |
| ms | Kierrosaika instanssilta tietokantaan, mitattuna instanssilla itsellään |
| Päällä | Poista työntekijäinstanssi kierrosta pysäyttämättä sitä – käynnissä olevat suoritukset saavat päätökseen, uusia ei määrätä. Pääinstanssilla lukittu päälle: tiedostot, liitännäiset ja koodausagenttien työt suoritetaan siellä riippumatta asetuksesta |
| Paino | Sen osuus jaettavista suorituksista |

## Suoritushistoria

Jokainen suoritushistorian suoritus nimeää sen suorittaneen instanssin, ja molemmat historian valintaikkulat voivat suodattaa yhteen instanssiin. Suodatin vastaa instanssin tunnistetta näyttäen sen nimen, joten instanssin uudelleennimeäminen ei muuta vanhojen suoritusten tekstiä.

Tästä ei näy mitään yksittäisessä käyttöönotossa: kentät ovat tyhjiä, nimeä ei näytetä, eikä suodatinta tarjota.
## Virhetilanteiden toiminta

**Jos worker-prosessi katkeaa kesken suorituksen**, sen sydämenlyönti (heartbeat) vanhenee ja johtavan instanssin (leader) olemassa oleva palautusmekanismi suorittaa workflow:n uudelleen aktiivisella instanssilla. Prosessin varaama jonotusrivi merkitään erikseen vanhentuneeksi: kun aktiivista suoritusta ei ole ja kaksi minuuttia on kulunut, leader merkitsee rivin epäonnistuneeksi ja herättää tulosta odottaneen osapuolen. Pelkkä aika ei koskaan laukaise toimintoa, joten pitkäkestoinen suoritus saa jatkua rauhassa; ja rivi merkitään epäonnistuneeksi sen sijaan että se laitetaan uudelleen jonoon, koska palautusmekanismi on jo vastuussa uudelleensuorituksesta ja uudelleenjonotus suorittaisi saman workflow:n kahdesti.

**Jos pääinstanssi (main) kaatuu**, cron-jaksolliset suoritukset jatkavat worker-instansseilta ja jaettavat suoritukset (distributable runs) jatkavat normaalisti. Pääinstanssia vaativat suoritukset jonottavat ja odottavat sen paluuta – mutta vain määritetyn sietoaikajan sisällä (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, oletusarvoisesti 600 sekuntia). Vanhemmat suoritukset merkitään ohitetuiksi (skipped) syyn kera, sen sijaan että tuntien takana oleva työmäärä suoritettaisiin kerralla.

Käyttöliittymä, API, MCP ja editori ovat käyttökelvottomia pääinstanssin ollessa alhaalla, koska ne ovat sen hallinnassa.

## Liittyvät aiheet

- [Suorittaminen & käyttöönotto](../getting-started/running-and-deployment.md) – Ota ensin käyttöön yksi instanssi; ympäristömuuttujat ja avainasetukset löytyvät sieltä
- [Asetukset](./user-settings.md) – Instanssien välilehti ja sen näkyvyys
- [Suoritusjäljet](../tabs/traces-tab.md) – Vertaile todellisia suoritusaikoja instanssien välillä ennen jakoasetusten muuttamista
- [Turvallisuus](./security.md) – Miksi jokaisen instanssin on jaettava `SECRET_KEY` ja `ENCRYPTION_KEY`
