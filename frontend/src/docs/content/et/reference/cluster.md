# Koormuse jaotamine

Suunake teine Heymi instants samale PostgreSQL andmebaasile ja see liitub worker'ina. Taustaprotsessis toimuvad workflow'de käivitused jaotatakse seejärel instantside vahel teie määratud protsendi alusel, nii et masin, mis teenindab kasutajaliidest ja API-t, ei ole enam ainus masin, mis kõiki workflow'sid käitab.

Instantsid ei suhtle omavahel kunagi. Postgres kannab tööd, seega worker ei vaja avatud porti, sertifikaati ega marsruuti tagasi põhi-instantsi — ainult juurdepääsu andmebaasile.

## Rollid

Üks instants on **main**, mis on kinnitatud keskkonnamuutuja abil. See teenindab kasutajaliidest, API-t, MCP-d ja chat-portaali ning haldab failide salvestusruumi ja paigaldatud pluginad. Iga teine instants on **worker**: see pääseb ligi ainult andmebaasile ja täidab taustaprotsessis toimuvaid käivitusi.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

Main-roll on eraldiseisev leader-valimisest. Heym valib juba üle cluster'i ühe leader'i, kes haldab cron'i, teavituste hindamist ja kokkujooksmisest taastumist; kui main maas käib, liigub juhtimine mõne sekundi jooksul worker'ile ja ajastatud käivitused jätkavad toimumist. Main-roll ei liigu, sest failide salvestusruum ei saa sellega kaasa liikuda.

## Mis võib main-instantsist lahkuda

Paigutus otsustatakse workflow' node'ide põhjal enne käivituse algust. Käivitus jääb main'ile, kui mõni selle node — sealhulgas node'id alam-workflow'des, mida see kutsub — puudutab midagi, mis eksisteerib ainult ühel masinal:

| Node | Miks see jääb main'ile |
|---|---|
| Codex, OpenCode Go | Kodeerimisagendi tööruum jääb kohalikule kettale, et järeltegevus saaks selles jätkata |
| Agent, millele on lisatud skill | Skill'i kood loeb ja kirjutab Heym Drive'i |
| Drive, Converter, Google Drive | Need loevad ja kirjutavad genereeritud faile |
| File Upload trigger | Üleslaaditud fail maandub main'i kettale |
| Send Email | Ettevõtte SMTP-relay'd lubavad tavaliselt ühe lähteaadressi |
| Plugin node'id | Plugin on paigaldatud ühe instantsi kettale |

**Kõik muu jaotatakse** — sealhulgas Code node, Playwright ja Agent Python tools. Iga instants käitab sama image'it oma Docker socket'iga, seega sandbox ei ole põhjus käivituse main'il hoidmiseks ja need ongi toote kõige CPU-nõudlikumad node'id.

Workflow'd, mille alam-workflow valitakse avaldise abil, ei saa ette kontrollida, seega see jääb main'ile.

## Protsentide valimine

Kaalud on täisarvud, mis määratakse jaotises **Settings → Instances**. Need on **osakaalud nendest instantsidest, mis praegu saavad tööd vastu võtta**, mitte protsendid 100-st: planeerija jagab selle grupi enda kogusummaga.

See erinevus ilmneb kohe, kui üks instants välja langeb. Kui `Main 41, Worker A 26, Worker B 33`, siis Worker B väljalülitamisel jääb gruppi 67, seega Main saab tegelikult 41/67 = **61%** ja Worker A 26/67 = **39%**. Paneel kuvab tegeliku jaotuse tabeli all just sel põhjusel ja salvestamist ei blokeerita kunagi seetõttu, et numbrid ei liitu 100-ni — tagasi lükatakse ainult jaotus, kus ühelgi lubatud instantsil pole kaalu.

Veel kaks asja on kergesti valesti mõistetavad.

**Protsent ei ole osa masina võimsusest.** See katab ainult käivitusi, mis läbivad järjekorra. Kasutajaliidese ja API teenindamine, redaktori ja portaali käivituste voogedastus ning failide üleslaadimise käsitlemine on kõik main'i töö ega lähe arvesse. Main teeb rohkem, kui selle number näitab.

**Main'i protsent on ülempiir, mitte alampiir.** Käivitused, mida saab täita ainult main'il, arvestatakse selle kvoodi arvelt, seega kui see kvoot on ära kasutatud, langevad ülejäänud jaotatavad käivitused worker'itele. Main'i numbri madalale seadmine on ohutu — töö, mis peab seal toimuma, toimub ikkagi. Kõrgele seadmine jätab worker'id tühjalt seisma.

Seega tugeva main'i ja väiksema worker'i puhul alustage pigem 60/40 kui masinate toore suhte järgi, seejärel võrrelge tegelikke käivituse kestusi vahekaardil Traces ja kohandage.

Kaalud normaliseeritakse ümber nende instantside vahel, mis on praegu aktiivsed ja lubatud. Kui `main=70, A=15, B=15` ja A läheb võrgust välja, muutub jaotus 70/85 ja 15/85 main'i ja B vahel ning taastub 70/15/15, kui A naaseb.

**Instants, mis naaseb, ei ole võlgu käivitusi, millest ilma jäi.** Offline, Disabled või sobimatu versiooni olekus veedetud aega ei arvestata selle kahjuks, seega worker, mis veedab öö kättesaamatuna, liitub uuesti grupi praegusel positsioonil ja jaotus näitab selle esimesest käivitusest alates taas 70/30 — see ei neela kõiki käivitusi, kuni on järele jõudnud. Worker, mis oli kogu aeg kättesaadav, jõuab ikkagi järele, mis teebki main'i protsendist ülempiiri.

### Uus instants liitub nulliga

Instants, millele pole kunagi kaalu antud, algab 0-st, mis jätaks selle Live, Enabled olekusse, kuid ilma midagi vastu võtmata. **Give new instances a share automatically** — vaikimisi sees, instantside tabeli all — lahendab selle: leader'i järgmisel ringil antakse uustulnukale võrdne osa grupist ja olemasolevad kaalud skaleeritakse alla, säilitades nende omavahelised suhted, nii et tahtlik 70/30 loeb ka pärast seda ligikaudu 70/30-na. Kogusumma jääb täpselt 100-ks.

See käivitub **üks kord instantsi kohta**. Nii automaatne ring kui ka teie enda muudatus märgivad instantsi konfigureerituks, seega instantsi, mille te ise määrasite, ei muudeta kunagi teie selja taga — sealhulgas ühtegi, mille te tahtlikult 0-ks seadsite. Lülitage see säte välja, kui eelistate, et iga uus masin ootaks teid.

Osalevad ainult lubatud, aktiivsed ja ühilduvad instantsid. Osakaalu andmine masinale, mis ei saa midagi täita, jätaks selle osa kasutult seisma.
### Kui protsendid ei aita

Seadete paneel näitab, kui palju viimase 24 tunni käivitustest said toimuda ainult main-instantsil. Kui see arv on suur — Codexi- või Drive'i-mahukas töökoormus —, jäävad workerid jõudeolekusse olenemata sellest, mida kaalud ütlevad, ning lahenduseks on suurem main-instants, mitte nende arvu suurendamine.

## PostgreSQL-i dimensioneerimine klastri jaoks

Ühenduste arv skaleerub instantside, mitte ainult kasutajate järgi. Iga instants käitab mitut uvicorn-protsessi ja iga protsess hoiab ühenduste pooli ning nelja `LISTEN`-ühendust (tühistamine, järjekorra äratused, käivituste tulemused, chat-wood). Avatud chat-wood jagavad üht chat-ühendust, seega need ei lisa andmebaasiühendusi. Kolme instantsiga klaster vaikimisi `max_connections = 100` juures ammendab ühendused ja Heym ei suuda seejärel omaenda andmebaasi jõuda.

Arvestage ligikaudu `instantsid x protsessid x (async pool + sync pool + 4)` ja määrake `max_connections` sellest suuremaks.

Pigem vähendage poole kui tõstke ainult ülempiiri. Üksikjuurutus kasutab vaikimisi 10+20 async- ja 5+10 sync-ühendust protsessi kohta, mis on ühe masina jaoks helde ja klastri jaoks kõvasti liiga palju:

| Muutuja | Üksikinstants | Klaster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Näidise compose-fail määrab need ja `max_connections = 300`. See viib kahe instantsiga klastri 768-ühenduselisest ülempiirist 192-ni, kolm instantsi jäävad endiselt alla 300.

## Nõuded, mida klaster ei saa teie eest tagada

**Iga instants peab kasutama sama `SECRET_KEY` ja `ENCRYPTION_KEY`.** Worker, millel on erinev `ENCRYPTION_KEY`, ei suuda mandaate dekrüpteerida ja iga mandaate kasutav käivitus nurjuks veaga, mis ei nimeta midagi kasulikku. Heym võrdleb mõlema võtme digest'i igal südamelöögil, koos rakenduse versiooni ja andmebaasi revisjoniga, ning märgib mittevastava instantsi olekusse **Mismatch**, nii et see ei saa üldse tööd. Koormus langeb tagasi main-instantsile, kuni selle parandate.

See määratleb ka uuendamise järjekorra. Main-instantsi esimesena uuendamine märgib kõik workerid ühildumatuks; töö naaseb main-instantsile ja iga worker liitub uuesti, kui see on uuendatud. Aeglasem, nähtav ja pööratav.

**Suunake sissetulev liiklus ainult main-instantsile.** Kasutajaliikluse round-robin'iga jaotamine instantside vahel saadaks faili üleslaadimise ühele masinale ja selle allalaadimise teisele. Miski koodis ei takista seda, sest worker käitab sama image'it ja vastab igale saabuvale päringule.

**Iga instants vajab `FRONTEND_URL`-i, mis on seatud samale avalikule aadressile.** Käivitus, mis peatub inimülevaatuse ootuses, loob oma ülevaatelingu instantsil, mis selle täitis, mitte main-instantsil, ja sama kehtib Codexi järelmeeldetuletuslinkide ning genereeritud failide allalaadimise URL-ide kohta. Worker, millel see puudub, koostab need lingid oma kohaliku aadressi põhjal ja see, kes lingi saab, ei saa seda avada.

**Worker-instantsidel on erinev väljuv IP.** Iga API, mis lubab lähteaadresse, näeb uut. Send Email töötab main-instantsil täpselt sel põhjusel; HTTP node'i puhul andke klastrile kas üks NAT-i väljumisaadress või lubage iga instants.

## Workeri lisamine teisele masinale

`docker-compose.worker.yml` hoidla juurkaustas käitab workerit selle enda hostil. Sellel pole andmebaasi ega UI-d: see jõuab main-instantsi PostgreSQL-ini ja võtab oma osa taustakäivitustest.

Täitke selle kõrval `.env` — image'i tag, andmebaasi host ja mandaadid, mõlemad võtmed ja instantsi id — ning käivitage see. Compose keeldub käivitumast, kuni iga nõutud väärtus on seatud, selle asemel et tulla üles kohatäitega, mis hiljem nurjub raskesti loetaval viisil.

Image'i tag peab olema versioon, mida main käitab, ja mõlemad võtmed tuleb täpselt kopeerida. Erinevus kummaski näitab workerit olekus Mismatch ja see ei saa tööd.

## Instantside tabeli lugemine

| Veerg | Tähendus |
|---|---|
| Name | Muudetav silt; see tembeldatakse igale käivitusele, mille see instants täidab |
| Role | `main` või `worker`, keskkonnast |
| Status | **Live** värske südamelöögiga, **Offline** pärast 30 sekundit vaikust, **Mismatch**, kui versioon, andmebaasi revisjon või võtmed erinevad main-instantsi omadest |
| ms | Edasi-tagasi reis sellest instantsist andmebaasi, mõõdetuna instantsi enda poolt |
| On | Võtke worker rotatsioonist välja ilma seda peatamata — töötavad käivitused lõpetatakse, uusi ei määrata. Main-instantsi jaoks lukustatud sisse: faili-, plugin- ja kodeerimisagendi töö toimub seal olenemata lüliti asendist |
| Weight | Selle osa jaotatavatest käivitustest |

## Paralleelsuse limiidid klastris

Workflow [paralleelsuse limiit](./webhooks.md#concurrency-limit-and-queued-runs) loendatakse PostgreSQL-is, seega kehtib see kõigis instantsides ja protsessides: kaks instantsi ei käivita kunagi ühe workflow kohta rohkem käivitusi kui limiit lubab. Pesa oodanud käivitus paigutatakse käivitumisel samade reeglite järgi nagu mis tahes muu käivitus, seega peab käivitus, mis peab jääma main-instantsi, jääma sinna edasi. Neid käivitusi teostav järjekorra worker käivitub nüüd igal installimisel, sealhulgas üksikul instantsil, kus see võtab ainult oma instantsi järjekorda seatud käivitused. See tähendab, et üksik instants hoiab samuti igas protsessis järjekorra äratamise `LISTEN` ühendust; planeerige selle ühendused samamoodi nagu klastri instantsi puhul.

## Käivituste ajalugu

Iga käivitus täitmise ajaloos nimetab instantsi, mis selle täitis, ja mõlemad ajaloo dialoogid saavad filtreerida ühele instantsile. Filter vastab instantsi id-le, näidates selle nime, seega instantsi ümbernimetamine ei kirjuta ümber seda, mida vanad käivitused ütlevad.

Miski sellest ei ilmne üksikinstantsilisele paigaldusele: väljad on tühjad, silti ei näidata ja filtrit ei pakuta.
## Tõrke käitumine

**Kui worker sureb keset käivitust**, muutub selle heartbeat aegunuks ja leader'i olemasolev taastamise ülevaatus käivitab käivituse uuesti elusal instantsil. Järjekorra rida, mille see oli hõivanud, lõpetatakse eraldi: kui selle jaoks ei eksisteeri enam ühtegi aktiivset käivitust ja kaheminutiline armuaeg on möödunud, märgib leader rea ebaõnnestunuks ja äratab kõik, kes tulemust ootasid. Ainuüksi vanus ei ole kunagi triggeriks, seega õiguspäraselt pikk käivitus jäetakse puutumata; ning rida märgitakse pigem ebaõnnestunuks kui uuesti järjekorda panduks, sest taastamine juba haldab korduskäivitust ja uuesti järjekorda panek käivitaks sama workflow kaks korda.

**Kui main läheb maha**, jätkab cron worker'ist käivitumist ja distribueeritavad käivitused jätkavad töötamist. Käivitused, mis vajavad main'i, lähevad järjekorda ja ootavad ning tühjendatakse, kui see naaseb — kuid ainult möödalaskmise armuaja akna sees (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, vaikimisi 600 sekundit). Kõik vanem suletakse vahelejäetuna, põhjus kirja pandud, selle asemel et korraga tunde tagantjärele mängida.

UI, API, MCP ja redaktor on main'i maasoleku ajal kättesaamatud, sest ingress osutab sinna.

## Seotud

- [Käivitamine ja juurutamine](../getting-started/running-and-deployment.md) – Juurutage esmalt üksik instants; keskkonnamuutujad ja võtmete seadistamine asuvad seal
- [Seaded](./user-settings.md) – Instantside vahekaart ja kes seda näeb
- [Käivitused](../tabs/traces-tab.md) – Võrrelge tegelikke käivituse kestusi instantside vahel enne jaotuse muutmist
- [Turvalisus](./security.md) – Miks peab iga instants jagama `SECRET_KEY` ja `ENCRYPTION_KEY`
