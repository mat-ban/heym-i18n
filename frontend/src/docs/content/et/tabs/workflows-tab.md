# Workflows vahekaart

**Workflows** vahekaart on vaikimisi töölaua vaade. See kuvab teie workflow'de loendit, kaustastruktuuri ning võimaldab workflow'sid luua, muuta ja korraldada.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Vaadake Workflows demo</a></p>

## Alustage Chat'i

Workflow'de loendi kohal on chat-kast, mis tervitab teid nimepidi ja küsib, mida soovite automatiseerida. Sisestage prompt, soovi korral lisage üks fail ning valige soovitud mandaat ja mudel. Mõlemad rippmenüüd on otsitavad ja lähtuvad teie [AI vaikeväärtustest](../reference/user-settings.md).

Saatmine loob uue vestluse ja avab selle [Chat vahekaardil](./chat-tab.md), kus vastus voogab sisse. Toetatud manused on tekstifailid, pildid ja PDF-id, üks sõnumi kohta, samamoodi nagu chat'i koostajas.

Kui teil pole veel LLM mandaati, kuvab kast lingi [Mandaatide vahekaardile](./credentials-tab.md) ja saatmine jääb keelatuks.

Kasti peitmiseks klõpsake **x**. Seejärel ilmub Workflows pealkirja kõrvale nupp **Ask AI**, mis toob selle tagasi. Valik jääb teie brauserisse meelde.

## Workflow'de loend

Loend on kahe paneeliga vaade: workflow'd ja kaustad vasakul, valitud workflow eelvaade paremal.

- Iga rida kuvab workflow ikooni, nime, kirjeldust, viimase muutmise aega ja [oleku silti](#workflow-status)
- Workflow'd võivad olla juurtasemel või kaustades ning kinnitatud workflow'd kuvatakse eraldi **Pinned** grupis ülaosas
- **Klõpsake** real, et see valida ja laadida selle eelvaade paremal
- **Topeltklõpsake** real või vajutage **Enter**, kui see on fookuses, et avada see [redaktoris](../getting-started/quick-start.md)
- Kasutage **Ctrl+klõpsu** (või **Cmd+klõpsu**), et avada uuel vahekaardil
- Igal real on paremal selle muutmise, kopeerimise, kinnitamise ja kustutamise toimingud. Telefonides on need peidetud, et nimi säilitaks täislaiuse; seal **vajutage pikalt** reale, et avada toimingute leht
- Kinnitage sageli kasutatavad workflow'd [Quick Drawer'is](../reference/quick-drawer.md), et saaksite neid kiiresti käivitada Workflows vahekaardilt ja teistelt sisemistelt lehtedelt

## Workflow eelvaade

Workflow valimine täidab loendi kõrval oleva eelvaate paneeli. Ekraanidel, mis on kitsamad kui 1280px, avaneb sama paneel hoopis lehena ekraani alt.

Paneel kuvab:

- Workflow nime, selle looja ja loomise aja ning viimase muutmise aja
- **Open Workflow** – avab workflow redaktoris
- **Run Now** – avab workflow [Quick Drawer'is](../reference/quick-drawer.md), kus täidate selle sisendid ja käivitate käivituse loendist lahkumata
- **Description** – workflow kirjeldus
- **Trigger Configuration** – cron workflow ajakava või sündmuspõhise workflow kuulav trigger. Workflow'd, mida kutsutakse üle HTTP, kuvavad toores endpoint'i ja autentimise teksti asemel nuppu **Copy cURL**: see kopeerib täieliku päringu õige URL-i, päistega, autentimise kohatäitjaga ja workflow sisendväljadest koostatud kehaga. Kui workflow avaldab [portaali](../reference/portal.md), kuvatakse siin ka selle avalik chat-link
- **Last Run Details** – viimase käivituse tulemus ja kestus või märkus, et workflow'd pole kunagi käivitatud
- **Workflow Steps & Sub-agents** – sõlmed täitmise järjekorras, igaüks koos oma mudeli, toimingu või ajakavaga ning punktiga, mis näitab, kas see on aktiivne. Sammul klõpsamine avab selle sõlme redaktoris, kus selle atribuutide paneel on juba avatud

Paneel jääb loendi kõrvale kinnitatuks ka siis, kui kerite, nii et see jääb pika workflow'de loendi puhul loetavaks.
## Instance'i haldamine

Kontod, mis on loetletud `HEYM_ADMIN_EMAILS` keskkonnamuutujas, saavad loetleda, avada, muuta, uurida käivituste ajalugu ja kustutada mis tahes workflow'd instance'is ilma jagamise või omandiõiguse üleandmiseta. See säte on komadega eraldatud e-posti aadresside loend, mida võrreldakse tõstutundetult. Tühi loend ei anna kellelegi seda juurdepääsu. Pärast muutmist taaskäivitage backend.

Administraatorid näevad workflow'de loendis omaniku e-posti aadressi ja saavad selle aadressi järgi otsida. Workflow avamiseks valige see ja avage eelvaates **Instance administration**:

1. **Pause triggers** kuvatakse ainult workflow'de puhul, mis sisaldavad Cron node'i. See lülitab välja workflow' Cron- ja muud automaatsed trigger node'id tavalise versioonitud salvestuse kaudu. Olemasolevad käivitused saavad lõpuni joosta. Käsitsi-, API-, portal- ja alam-workflow'de kutsed jäävad kättesaadavaks; see toiming ei ole workflow-ülene käivituste lukk.
2. Nupp muutub peatamise ajal **Resume triggers**-iks, sealhulgas pärast lehe uuesti laadimist. Resume lubab uuesti need triggerid, mille administraator peatas, ja jätab juba varem keelatud triggerid muutmata. Vanemate peatatud workflow'de puhul, millel puudub salvestatud administraatori peatamise olek, lubab Resume nende automaatsed triggerid.
3. Kasutage workflow' rea toimingut **Delete workflow**, kui käivitused on lõppenud. Kustutamine tagastab konflikti, kui töös, järjekorras või ülevaatamisel ootavaid töid on veel alles. Ajastatud kustutamine rakendab sama kontrolli.

Peatage triggerid ja laske olemasolevatel käivitustel enne kustutamist lõpuni joosta. Trigger, mis oli peatamise hetkeks juba saadetud, võib siiski lõpuni joosta. Kasutage kustutamist, kui workflow ei tohi enam olla kutsutav.

Ainult omanikule kuuluvad webhooki saladused ja autentimissätted säilitavad oma senised kaitsed. Haldamine ei anna üle omandiõigust ega jaga omaniku mandaatide kirjeid. Administraatori peatamise, jätkamise, kustutamise ja ajastamise toimingud kuvatakse [audit trail'is](../reference/audit.md) koos tegutseva administraatori ja workflow' omanikuga.

## Workflow' staatus

Igal real on staatuse märgis, mis tuletatakse workflow' trigger node'idest, selle reaalajas käivituse olekust
ja — workflow'de puhul, millel puudub trigger node — sellest, kuidas selle viimane käivitus algatati:

| Staatus | Tähendus |
| --- | --- |
| **Running** | Workflow'l on parasjagu käimas käivitus |
| **Scheduled** | Sellel on aktiivne [cron](../nodes/cron-node.md) trigger |
| **Listening** | Sellel on aktiivne sündmuse trigger, näiteks Slacki, Telegrami, IMAP-i või WebSocketi trigger |
| **Paused** | Sellel on trigger node'id, kuid igaüks neist on deaktiveeritud |
| **API** | Sellel puuduvad trigger node'id ja viimati käivitati seda HTTP-kutsega selle execute endpoint'ile |
| **SubWorker** | Sellel puuduvad trigger node'id ja viimati käivitati seda alam-workflow'na ülem-workflow' poolt |
| **Portal** | Sellel puuduvad trigger node'id ja viimati käivitati seda selle [portalist](../reference/portal.md) |
| **WEB** | Sellel puuduvad trigger node'id ja selle ainus terminal on [HTML output mapper](../nodes/html-output-mapper-node.md), seega selle kutsumine tagastab renderdatud veebilehe |
| **Manual** | Sellel puuduvad trigger node'id ja seda ei ole kunagi käivitatud või selle viimane käivitus tuli mujalt |
| **Remove Scheduled** | See on [kustutamiseks ajastatud](../reference/workflow-organization.md) |

API, SubWorker ja Portal märgised loevad workflow' [käivituste ajaloo](./logs-tab.md) kõige viimast kirjet, seega workflow, mida kutsutakse kahel viisil, näitab seda, mis tuli viimasena. **WEB** otsustatakse seevastu graafi põhjal, seega on sellel nende kolme ees prioriteet: lehte teenindav workflow loetakse WEB-iks ka pärast seda, kui seda on HTTP kaudu kutsutud. Trigger node'id võidavad alati kõigi nende ees: cron-workflow, mida keegi ka HTTP kaudu kutsub, jääb **Scheduled**.

Kasutage otsinguvälja kõrval olevat rippmenüüd **Status**, et näidata ainult ühte staatust. Rippmenüü loetleb, kui mitu workflow'd vastavad parasjagu igale staatusele. Staatuse filter ulatub ka kaustade sisse: vastetega kaustad laiendatakse automaatselt ja vasteteta kaustad peidetakse, kuni filtri tühjendate.

## Aktiivsed workflow'd

Töölaual näitab ülemise tööriistariba ümmargune märgis, kui mitu workflow'd on parasjagu
töös, ja värskendub automaatselt iga 10 sekundi järel. Klõpsake nullist erineval märgisel, et avada aktiivsete
workflow'de loend, mis kuvab enne kerimist kuni neli rida. Valige workflow' nimi, et siduda
redaktor selle käivituse reaalajas vaatega. Nullmärgis on informatiivne ja seda ei saa avada ning
märgis on mobiiliekraanidel peidetud.

## Otsing

Kasutage workflow' otsinguvälja **Status** kõrval või vajutage **Ctrl+F** (või **Cmd+F**), et filtreerida workflow'sid pealkirja või kirjelduse järgi. Kaustades olevad vastavad workflow'd kuvatakse koos nende kaustaharude laiendamisega. Otsingu tühjendamiseks vajutage **Escape**.
## Kaustad

- Korraldage workflow'd [kaustadesse ja alamkaustadesse](../reference/workflow-organization.md)
- Looge kaustu nupuga **Uus kaust**, andes igale nime ja valikulise kirjelduse, mis kuvatakse loendis selle nime all
- Iga kausta rida näitab, kui palju workflow'sid see sisaldab (arvestades alamkaustu), ning selle uue alamkausta, ümbernimetamise, ikooni muutmise, ZIP-failina allalaadimise ja kustutamise toiminguid. Telefonides kuvatakse rea asemel üks menüünupp
- Lohistage workflow üle kausta või alamkausta, et näha kaardisuurust sihtkoha eelvaadet.
  Esiletõstetud eelvaade näitab enne kukutamist täielikku kaustateed ning hõljumine kokkuvolditud
  kausta kohal avab selle lühidalt, et pääseda ligi pesastatud kaustadele.
- Lohistage workflow'sid kaustade vahel või juurkausta. Lohistatav kaart jääb nähtavale kummitusena
  ning aktiivne sihtkoht jääb kerimise ajal esiletõstetuks.
- Workflow'i tagasilohistamine selle praegusesse kausta on keelatud ja tähistatud kui **Juba kaustas**.
- Nimetage kaust ümber või muutke selle kirjeldust ümbernimetamise toimingu või paremklõpsu kontekstimenüü kaudu

## Workflow'de loomine

1. Klõpsake **Uus workflow**
2. Sisestage nimi ja valikuline kirjeldus
3. Workflow avaneb redaktoris

## Import

Lohistage JSON-workflow-fail workflow-alale, et luua uus workflow. Imporditud sõlmi ja servi kasutatakse workflow loomiseks; nimi pärineb JSON-faili väljalt `name` või failinimest. JSON-vormingu ja impordivalikute kohta vt [Allalaadimine ja import](../reference/download-import.md).

## Jagamine

Avage workflow redaktoris ja klõpsake **Jaga**, et kutsuda kasutajaid e-posti teel või jagada [tiimiga](./teams-tab.md). Valige iga kasutaja või tiimi jaoks **Read** (vaatamine ja käivitamine) või **Write** (ka redigeerimine) ning muutke seda hiljem kirje kõrval olevast rippmenüüst. Mandaate ja alam-workflow'sid ei jagata automaatselt; jagage neid eraldi samade kasutajate või tiimidega. Vt [Workflow'de korraldamine](../reference/workflow-organization.md#sharing-workflows) ja [Mandaatide jagamine](../reference/credentials-sharing.md).

## Redigeerimine ja kustutamine

- **Muuda** – Muutke workflow nime ja kirjeldust rea muutmistoimingu kaudu
- **Kustuta** – Workflow'd [planeeritakse kustutamiseks](../reference/workflow-organization.md); need liiguvad prügikasti enne jäädavat eemaldamist

## Samaaegsed muudatused

Salvestamine saadab redaktsiooni, millel teie muudatused põhinevad, ja server lükkab kirjutamise tagasi, kui workflow on vahepeal muutunud — näiteks seetõttu, et tiimikaaslane salvestas selle või jätsite sama workflow teise vahekaardi kaudu avatuks. Seejärel kuvab Heym dialoogi **Tuvastatud aegunud workflow**, milles on kaks valikut:

- **Tühista** – Säilitab teie salvestamata muudatused redaktoris, et saaksite teises vahekaardis uuesti laadida ja need ühitada
- **Alista** – Salvestab ikkagi, asendades teise isiku versiooni

Workflow **käivitamine** salvestab selle esmalt, seega läbib see sama kontrolli. Kui workflow on teie all muutunud, peatub käivitamine dialoogil, selle asemel et vaikselt üle kirjutada: **Alista ja käivita** salvestab teie versiooni ja alustab käivitust, **Tühista käivitamine** loobub mõlemast ja jätab teie muudatused puutumata.

Kontroll on osa salvestamispäringust endast, seega ei nõua see täiendavat edasi-tagasi liiklust ja puudub aken, mille kaudu saaks salvestamine sellest mööda libiseda. Teie enda muudatused rakenduse mujalt — ümbernimetamine, seadete muutmine, atribuudipaneeli lüliti — ei loeta kunagi konfliktiks.

## Käsukäsk

Vajutage **Ctrl+K** (või **Cmd+K**), et avada käsukäsk. Saate:
- Otsida workflow'sid nime järgi
- Hüpata mis tahes [töölaua vahekaardile](./credentials-tab.md)
- Avada hiljutisi workflow'sid

## Seotud

- [Kiire algus](../getting-started/quick-start.md) – Looge oma esimene workflow
- [Workflow'de korraldamine](../reference/workflow-organization.md) – Kaustad, alamkaustad ja planeeritud kustutamine
- [Workflow struktuur](../reference/workflow-structure.md) – Workflow'de JSON-vorming
- [Allalaadimine ja import](../reference/download-import.md) – Workflow'de eksportimine ja importimine JSON-ina
- [Portal](../reference/portal.md) – Avaldage workflow'd avalike chat-liidestena
- [Tahvel](./board-tab.md) – Käivitage workflow'sid kanban-kaartidelt veeruahelate kaudu
- [Põhikontseptsioonid](../getting-started/core-concepts.md) – Workflow'd, sõlmed ja käivitamine
- [Käivituste ajalugu](../reference/execution-history.md) – Vaadake varasemaid käivitusi ja funktsiooni Bring to Canvas
- [Kiirsahtel](../reference/quick-drawer.md) – Kinnitage ja käivitage workflow'sid töölaualt, dokumentatsioonist ja muudelt mitteredaktori lehtedelt
- [Kontekstipõhine tutvustus](../reference/contextual-showcase.md) – Lühike lehejuhend töölaua vaadete jaoks
