# Nadzorna plošča

Zavihek **Nadzorna plošča** je prostor v slogu Grafana, kjer gradite mreže grafičnih pripomočkov. Vsak pripomoček se prikaže iz izhoda svojega skritega Heym workflow-a, tako da lahko vsak podatek, ki ga lahko ustvarite v workflow-u — poizvedbe v bazi podatkov, API klici, RAG iskanja, izhodi LLM — postane graf. Ohranite lahko več nadzornih plošč in vsako delite z ljudmi ali ekipami.

## Nadzorne plošče

Vsakdo začne z eno nadzorno ploščo, ki je ustvarjena ob prvem odprtju zavihka. Uporabite izbirnik nadzorne plošče na vrhu zavihka za preklapljanje med nadzornimi ploščami, in **+** poleg njega za ustvarjanje nove. Izbirnik najprej prikaže vaše lastne nadzorne plošče, nato tiste, ki so z vami deljene, označene z imenom osebe, ki jih je delila.

Zavihek ponovno odpre nadzorno ploščo, ki ste jo nazadnje uporabili, in naslovna vrstica nosi odprto nadzorno ploščo (`?tab=dashboard&dashboard=<id>`), tako da povezava odpre točno to nadzorno ploščo za vsakogar, ki ima dostop do nje.

Gumb za nastavitve (samo za lastnike) preimenuje nadzorno ploščo, določi, katere zapise sprejema kot [stran s podrobnostmi](#detail-pages), upravlja deljenje in jo izbriše. Izbris nadzorne plošče odstrani njene pripomočke in njihove workflow-e. Vedno obdržite vsaj eno svojo nadzorno ploščo, zato zadnje ni mogoče izbrisati.

## Pripomočki

Pripomoček je en sam graf na mreži. Podprti tipi grafov:

- **Stolpični** (navpični ali vodoravni)
- **Črta**
- **Območje** (izpolnjen trend, podpira več serij)
- **Pita**
- **Tabela** (z možnostjo drsenja; kliknite na glavo stolpca za naraščajoče razvrščanje in znova kliknite za padajoče. En stolpec se lahko prikaže kot [čipi stanja](../nodes/chart-output-node.md#status-chips), en stolpec lahko vsebuje [gumbe povezave](../nodes/chart-output-node.md#link-buttons), ki odprejo URL v novem zavihku, vrstice pa lahko odprejo [stran s podrobnostmi](#strani-s-podrobnostmi))
- **Številčni** (en sam KPI vrednost z neobvezno enoto)
- **Merilnik** (ena vrednost v razponu min–max, npr. odstotek)
- **Razpršeni** (X/Y točke za korelacijske grafe)
- **Delež** (en stolpec razdeljen na dele z odstotkovno legendo, npr. razčlenitev po jeziku)
- **Gantt** (datumi opravil, dokončanje in odvisnosti)
- **Entity relationships (DB)** (tabele, polja, ključi PK/FK in povezave)
- **Stolpčni merilnik** (ena vodoravna merilna enota na vrstico z rdeče→zelena gradientom in vrednostjo, npr. prosti prostor na disku)
- **Besedilo** (sporočilo v markdown formatu, npr. statusna opomba kot "Zadnje izvajanje ob 19:47"; podpira [interaktivne potrditvene okvirčke](../nodes/chart-output-node.md#interactive-task-lists), ko je markdown statičen, in [izrecne številčne sezname](../nodes/chart-output-node.md#numbered-lists) za prilagojeno ali padajoče številčenje)
- **HITL** (vaši čakajoči človeški pregledi. Glava prikazuje `1/n čakajočih`. Ime workflow-a odpre to izvajanje na platnu. **Odobri**, **Zahtevaj spremembe** in **Zavrni** ga rešijo. Ikona zgodovine poleg naslova pripomočka odpre to izvajanje v pogovornem oknu zgodovine na tej strani. Pripomoček ne uporablja zgornjih vrstic, in vsakdo vidi svojo lastno vrsto. Namesto tega lahko prikazuje preglede enega samega Workflowa za vsakogar, ki lahko ta Workflow odpre; glejte [Gradniki HITL](#gradniki-hitl))

Poleg grafikonov pripomoček **Run a workflow** zažene enega od vaših workflowov z nadzorne plošče: na odloženi datoteki, s svojimi vnosnimi polji ali z gumbom Run; glejte [Pripomočki za zagon](#run-widgets).

Vsak pripomoček naloži svoje podatke asinhrono, ko odprete zavihek, tako da stran ostane odzivna, medtem ko se grafi napolnijo.

## Dodajanje pripomočka

1. Kliknite **Dodaj pripomoček**, mu dajte naslov in izberite tip grafa. Pod izbirnikom dialog prikaže primer tega tipa grafa s primeri podatkov in imeni vrstic, ki jih pričakuje, tako da lahko primerjate tipe, preden karkoli zgradite.
2. Pripomoček se odpre v urejevalniku workflow-ov z začetnim grafom: vozliščem [Set](../nodes/set-node.md), ki proizvaja vrstice, povezanimi z vozliščem [Chart Output](../nodes/chart-output-node.md). Zamenjajte vozlišče Set z katerim koli virom podatkov. Pripomoček **HITL** je samo vozlišče Chart Output; bere vaše čakajoče preglede in ne potrebuje vira podatkov.
3. Zgradite workflow, tako da vozlišče, ki napaja **Chart Output**, proizvaja tabelo vrstic, nato konfigurirajte preslikavo polj vozlišča Chart Output (polje oznake, polje vrednosti itd.).
4. Shranite, vrnite se na zavihek Nadzorna plošča in pripomoček se prikaže.

Za pripomoček **Run a workflow** namesto tega izberite workflow, ki ga izvaja; izbirnik pove, kako bo pripomoček zagnal vsakega izmed njih. Pripomoček se doda neposredno v mrežo; novega workflowa ni treba graditi.

Dvakrat kliknite na pripomoček (ali uporabite njegov gumb za urejanje), da kadar koli ponovno odprete njegov workflow. Uporabite **Kopiraj pripomoček** v naslovu pripomočka za podvojitev tako pripomočka kot njegovega celotnega workflow-a. Kopija je postavljena pod izvirnik in označena z **(Kopija)**, tako da jo lahko neodvisno uredite.

## Gradniki HITL

Nov gradnik HITL prikazuje vsak pregled, ki čaka v vaši lastni čakalni vrsti. Če želite prikazati le preglede enega Workflowa, odprite **Nastavitve** gradnika:

1. Pri **Workflow** izberite Workflow. Seznam vsebuje Workflowe, ki jih lahko odprete – vaše lastne ali deljene z vami ali vašo ekipo –, ki imajo korak, ki čaka na osebo: Agent s človeškim pregledom ali Slack korak odobritve, gumbov ali obrazca. Ikona poleg odpre ta Workflow v novem zavihku.
2. Če ima Workflow natanko en tak korak, je samodejno izbran. Če jih ima več, jih **Select agent** navede po imenu vozlišča, pri čemer je **All agents** na prvem mestu; koraki Slack so označeni z **(Slack)**.
3. Shranite. Števec `1/n pending` v glavi šteje le te preglede. Izberite **Vsi workflowi**, da znova prikažete svojo lastno čakalno vrsto.

Enaka izbira je na voljo na platnu v lastnostih vozlišča Chart Output. **Izboljšaj z AI** jo lahko nastavi („prikaži le odobritve računov“), prav tako pa opis novega gradnika, ki imenuje Workflow. Vsaka sprememba je urejanje Workflowa, zato se pojavi v Edit History.

- **Kdo vidi preglede.** Gradnik, filtriran po Workflowu, prikazuje preglede tega Workflowa vsem, ki lahko odprejo ta Workflow, in ti uporabniki lahko prek gradnika odobrijo, zahtevajo spremembe ali zavrnejo, enako kot bi lahko izvedli Workflow. Nefiltriran gradnik vsakomur prikazuje njegovo lastno čakalno vrsto.
- **Kdo vidi gradnik.** Kdor ne more odpreti izbranega Workflowa, gradnika sploh ne vidi, niti na nadzorni plošči, ki je deljena z njim. Ko lastnik nadzorne plošče izgubi dostop do Workflowa ali je ta izbrisan, lastnik vidi „You no longer have access to the workflow this widget shows“ in lahko v **Nastavitvah** izbere drugega.
- **Samo dostopne izbire.** Workflow, ki ga ne morete odpreti, je zavrnjen ob shranjevanju gradnika, bodisi prek nastavitev, platna ali AI.

## Strani s podrobnostmi

Tabelarični pripomoček lahko poveže svoje vrstice z drugo nadzorno ploščo, ki nato deluje kot stran s podrobnostmi: ena nadzorna plošča, ki služi vsaki stranki, računu ali zahtevku (ticketu).

1. Odprite **Settings** tabelaričnega pripomočka in pod **Row link** izberite nadzorno ploščo.
2. Vnesite **Record column**, stolpec, katerega vrednost identificira vrstico (na primer `id`), in po želji **Label column**, ki jo poimenuje (na primer `name`).
3. Shranite. Klik na vrstico (ali fokusiranje nanjo in pritisk tipke Enter) odpre povezano nadzorno ploščo z `?record=<value>&label=<name>`.

Na nadzorni plošči s podrobnostmi vsak workflow pripomočka prebere vrednost kot `$page.record` (glejte [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), stran pa nad mrežo prikaže `Dashboard / <label>` z gumbom za počistitev zapisa. Gumb Nazaj vrne v tabelo, iz katere ste prišli.

- **Kdo jo lahko odpre.** Vrstice so klikljive samo za gledalce, ki lahko odprejo povezano nadzorno ploščo. Ostali vidijo isto tabelo brez povezav.
- **Format zapisa.** Zapis izvira iz URL-ja, zato nadzorna plošča s podrobnostmi odloča, kaj sprejme. V njenih nastavitvah je **Detail page records** eno od naslednjega: ID-ji (črke, števke, `-`, `_` in `.`, do 128 znakov; privzeto), številke, UUID-ji ali e-poštni naslovi. Vsaka druga vrednost je zavrnjena, preden se pripomoček zažene, in pripomočki prikažejo "This page does not accept that record".
- **Še vedno se izvaja kot lastnik.** Pripomočki se tudi na strani s podrobnostmi izvajajo kot lastnik nadzorne plošče. Ustvarjalci naj posredujejo `$page.record` samo tam, kjer ga vozlišče ustrezno ubeži (escape), nikoli neposredno v besedilo poizvedbe.
- **Predpomnjenje.** Vsak pripomoček predpomni svoj grafikon glede na zapis, za enako časovno obdobje (TTL) kot pripomoček, in hrani 50 nazadnje uporabljenih zapisov.

## Pripomočki za zagon

Pripomoček **Run a workflow** zažene enega od vaših workflowov in prikaže rezultat: stanje, čas izvajanja in izhode. Kaj prikaže, je odvisno od tega, kaj workflow sprejme:

- **Datoteko.** Za workflow, ki se začne z vozliščem [File Upload Trigger](../nodes/file-upload-trigger-node.md), povlecite datoteko nanj (ali kliknite za izbiro) in pripomoček jo naloži prek enkratne povezave za nalaganje tega triggerja. Pripomoček prikaže vrste in velikost datotek, ki jih trigger sprejema, ter zavrne druge pred nalaganjem. Ko se workflow začne tudi z vozliščem Text Input, pripomoček prikaže njegova polja poleg območja za odlaganje: izberite datoteko, izpolnite polja in **Run** pošlje oboje. Vrednosti potujejo s povezavo za nalaganje, ki jo ustvari pripomoček, tako da jih deljena povezava za nalaganje ne more nastaviti.
- **Vnosna polja.** Za workflow, ki se začne z vozliščem Text Input, pripomoček prikaže njegova polja s privzetimi vrednostmi; **Run** zažene workflow z vašimi vrednostmi. Vrednosti za polja, ki jih workflow nima, se zavržejo.
- **Nič.** Workflow brez vhodov dobi gumb **Run**.

Gumb **Wrap** pri rezultatu prelomi dolge vrstice izhoda znotraj okvira; izklopite ga za branje postavitve JSON izhoda.

- Vsakdo, ki lahko odpre nadzorno ploščo, lahko zažene pripomoček, prav tako kot lahko vsakdo osveži grafikon. Dostop do workflowa pripada lastniku nadzorne plošče: dodajanje pripomočka zahteva workflow, ki ga lahko zaženete tako vi kot lastnik, sam zagon pa uporablja poverilnice lastnika workflowa, kot vsaka povezava za nalaganje.
- Rezultat ostane na vašem zaslonu, dokler ne zapustite strani; drugi gledalci ne vidijo vaših datotek, vrednosti ali rezultatov. Zagon se pojavi v zgodovini izvajanja s triggerjem `dashboard`.
- Deljenje nadzorne plošče nikoli ne podeli dostopa do samega workflowa. **Edit workflow** ga odpre za osebe, ki že imajo dostop, **Fine-tune with AI** pa ni na voljo.
- Zagoni z datotekami se izvajajo na glavni instanci, kjer so shranjene naložene datoteke, kot vsak zagon File Upload Triggerja.

## Generiranje pripomočka z AI

Kliknite **AI**, opišite metriko, ki jo želite (na primer, "stopnja uspešnosti workflow-a v zadnjih 30 dneh kot stolpični graf"), in izberite poverilnico LLM in model. Heym ustvari popoln workflow pripomočka, ki se konča z vozliščem Chart Output in ga doda v mrežo. Oglejte si [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) za primerne pozive za vsak tip grafa.

Gradnik dobi kratek naslov iz ene ali dveh besed v jeziku vaše zahteve, na primer „Odprti primeri“. Naslov nikoli ne vsebuje identifikatorja podatkovne tabele; če model poimenuje gradnik s celim stavkom, Heym obdrži njegove prve besede.

API za gradnike lahko ustvari tudi **kartico števca** brez AI: gradnik `text` nad podatkovno tabelo (`data_table_id`) s `count_column` in `count_value` prikazuje, koliko vrstic ima to vrednost; naslov gradnika navede vrednost. Heym Work strani, ustvarjene iz podatkovne tabele, uvede z eno kartico števca na posamezno stanje.

Uporabite gumb **Natančno prilagodi z AI** pripomočka za revizijo obstoječega pripomočka z novim navodilom. Vsaka natančna prilagoditev AI posname prejšnji workflow v **Zgodovini urejanja** pripomočka, tako da lahko pregledate ali vrnete spremembe iz urejevalnika workflow-ov.

## Iz Chat in MCP

[Chat](./chat-tab.md) in odjemalci MCP prek orodja [`heym_chat`](./mcp-tab.md) lahko berejo vaše nadzorne plošče, vanje dodajajo pripomočke, jih preimenujejo ali brišejo ter uredijo postavitev nadzorne plošče. Heym Work prikazuje vsako nadzorno ploščo kot stran, zato isti odgovori pokrivajo tudi njene strani.

- **Katere nadzorne plošče obstajajo in kaj je na njih.** Vprašajte "katere nadzorne plošče imam?", "kaj je na plošči Prodaja?" ali "na kateri nadzorni plošči je workflow prihodkov?". Chat navede vaše lastne nadzorne plošče in tiste, ki so deljene z vami, z vašimi pravicami dostopa in povezavo do vsake, ter vsak pripomoček na njih: naslov, vrsto grafikona in pripadajoči workflow. [Pripomoček HITL](#hitl-widgets), filtriran po workflowu, ki ga ne morete odpreti, ostane skrit, tako kot na sami nadzorni plošči.
- **Nov pripomoček.** Zahtevajte "dodaj grafikon odprtih primerov po stanju na ploščo Prodaja". Chat najprej postavi prazen pripomoček na nadzorno ploščo, nato napiše lasten workflow pripomočka, izvede preskusne zagone in odpravlja napake, dokler zagon ne uspe, na enak način, kot [ustvarja workflowe](./chat-tab.md#ustvarjanje-workflowov). Noben ločen workflow ne ostane zadaj in vsako shranjevanje se pojavi v Edit History pripomočka. Naslov in vrsta grafikona pripomočka sledita temu, kar Chat shrani.
- **Obstoječi workflow.** Zahtevajte "postavi workflow prihodkov na ploščo Prodaja". Workflow, ki se konča z vozliščem Chart Output, postane grafični pripomoček z lastno kopijo workflowa, zato poznejše spremembe pripomočka nikoli ne vplivajo na izvirnik. Workflow z vozliščem trigger ali input ne more postati grafični pripomoček. Vsak drug workflow postane [pripomoček za zagon](#run-widgets), ki prav tako potrebuje workflow, ki ga lastnik nadzorne plošče lahko zažene.
- **Preimenovanje ali brisanje pripomočka.** Zahtevajte "preimenuj pripomoček Prihodki v Prodaja" ali "izbriši pripomoček Odprti primeri". Workflow grafičnega pripomočka prevzame tudi novo ime; workflow pripomočka za zagon ohrani svoje. Z brisanjem grafičnega pripomočka se izbriše tudi njegov workflow, tako kot to stori gumb za brisanje pripomočka; workflow pripomočka za zagon ostane. Chat izbriše samo pripomoček, ki ste ga izrecno zahtevali, in najprej vpraša za pojasnilo, če se vaše besede ujemajo z več možnostmi.
- **Urejanje postavitve.** Zahtevajte "uredi ploščo Prodaja" ali "dodaj te tri pripomočke in uredi". Chat razporedi vidne pripomočke po njihovem vrstnem redu, tako kot to stori gumb **Uredi**: naključne vrstice po dva ali tri, tako da ponovna zahteva ponudi drugačno razporeditev. Zahtevajte določeno število na vrstico ("tri na vrstico"), da dobite vrstice te velikosti. To uredi nadzorno ploščo v Heym; Heym Work ohrani svojo lastno ureditev strani, ki jo spreminja lasten gumb **Uredi** na strani.

Novi pripomočki gredo pod obstoječe pripomočke nadzorne plošče in se, tako kot vsak pripomoček, izvajajo v kontekstu lastnika nadzorne plošče. Dodajanje, preimenovanje, brisanje in urejanje zahtevajo pravico za pisanje na nadzorni plošči. Izdelava novega pripomočka zahteva klepet, ki lahko gradi workflowe: zavihek Chat, Heym Work Chat za urednike in `heym_chat`.

## Urejanje postavitve

Preklopite na **Uredi**, da vstopite v način urejanja, kjer lahko povlečete pripomočke in jih spremenite na mreži s 12 stolpci. Spremembe postavitve se shranijo samodejno. Naslove pripomočkov je mogoče urejati neposredno iz naslova pripomočka.

## Predpomnjenje in osvežitev

Vsak pripomoček predpomni svoje zadnje izračunane podatke na strežniku za nastavljivo časovno obdobje (TTL). Medtem ko je predpomnilnik svež, ponovni odpiranje nadzorne plošče služi shranjenemu rezultatu namesto ponovnega izvajanja workflow-a. Predpomnilnik se nadomesti na mestu vsakič, ko se podatki ponovno izračunajo (en predpomnilnik na pripomoček, plus eden na zapis na [strani s podrobnostmi](#detail-pages)), in se samodejno invalidira, ko uredite workflow pripomočka.

Uporabite gumb **Osveži** pripomočka (ali **Osveži** v orodni vrstici), da obidete predpomnilnik in takoj ponovno izračunate.
## Deljenje

Lastniki delijo nadzorno ploščo iz svojih nastavitev, z individualnimi uporabniki (po elektronski pošti) ali s katero koli [ekipo](teams-tab.md), kateri pripadajo. Vsako deljenje je **Branje** ali **Pisanje**; ko ima nekdo tako osebno kot ekipno deljenje, velja močnejše.

| Dejanje | Lastnik | Pisanje | Branje |
|---------|:------:|:-------:|:------:|
| Ogled pripomočkov, osveževanje, uporaba samodejnega osveževanja | ✓ | ✓ | ✓ |
| Odpiranje strani s podrobnostmi, zaganjanje pripomočkov za zagon | ✓ | ✓ | ✓ |
| Dodajanje, kloniranje, brisanje, preimenovanje in spreminjanje velikosti pripomočkov; AI generiranje in fino nastavljanje; označevanje postavk na kontrolnem seznamu | ✓ | ✓ | |
| Odprtje delovnega toka pripomočka v urejevalniku | ✓ | ✓ | |
| Preimenovanje ali brisanje nadzorne plošče, nastavitev formata zapisa, upravljanje deljenja | ✓ | | |

**Pripomočki vedno delujejo kot lastnik nadzorne plošče.** Kdor koli gleda, pripomoček uporablja lastnikove poverilnice in globalne spremenljivke, njegovi izvajanja pa se pojavijo v zgodovini izvajanja in sledi lastnika. Tako sodelavci vidijo iste podatke brez dostopa do računov, ki so za njimi, in vsak gledalec deli enega shranjenega rezultata na pripomočku. Pripomočki, ki jih doda ali klonira sodelavec s pravicami pisanja, prav tako pripadajo lastniku.

Zaradi tega **Pisanje** nosi enako zaupanje kot deljenje delovnega toka za urejanje: sodelavec s pravicami pisanja lahko spremeni, kaj se izvaja z vašimi poverilnicami. Dajte ga le ljudem, ki bi jim dovolili urejanje vaših delovnih tokov. Testno izvajanje, ki ga sodelavec začne iz urejevalnika delovnega toka, uporablja njihove lastne poverilnice, kot pri katerem koli skupnem delovnem toku; le nadzorna plošča sama deluje kot lastnik. **Branje** ne daje dostopa do delovnih tokov pripomočkov, in gledalci samo za branje prejemajo samo grafikon, ne pa podrobnosti o izvajanju za vsakim vozliščem.

Odstranitev deljenja ali znižanje pravic z pisanja na branje začne veljati takoj.

## Sorodno

- [Vhodni vozlišče za grafikon](../nodes/chart-output-node.md)
- [Zavihek analitika](analytics-tab.md) — vgrajene metrike izvajanja (različne od uporabniško zgrajenih nadzornih plošč)

## Urniki in diagrami zbirk podatkov

Izberite **Gantt** v Dodaj pripomoček za prikaz opravil skozi čas s povezavami dokončanja in odvisnosti, ali **Entity relationships (DB)** za preslikavo tabel, polj in njihovih relacij. Obe vrsti uporabljata [vozlišče Chart Output](../nodes/chart-output-node.md#gantt-schedules) in sta na voljo tudi na straneh Heym Work. Ko Work predlaga pripomočke za urnik ali shemo zbirke podatkov, izriše predoglede na podlagi predlaganih opravil ali entitet.
