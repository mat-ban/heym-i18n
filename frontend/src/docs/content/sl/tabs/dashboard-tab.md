# Nadzorna plošča

Zavihek **Nadzorna plošča** je prostor v slogu Grafana, kjer gradite mreže grafičnih pripomočkov. Vsak pripomoček se prikaže iz izhoda svojega skritega Heym workflow-a, tako da lahko vsak podatek, ki ga lahko ustvarite v workflow-u — poizvedbe v bazi podatkov, API klici, RAG iskanja, izhodi LLM — postane graf. Ohranite lahko več nadzornih plošč in vsako delite z ljudmi ali ekipami.

## Nadzorne plošče

Vsakdo začne z eno nadzorno ploščo, ki je ustvarjena ob prvem odprtju zavihka. Uporabite izbirnik nadzorne plošče na vrhu zavihka za preklapljanje med nadzornimi ploščami, in **+** poleg njega za ustvarjanje nove. Izbirnik najprej prikaže vaše lastne nadzorne plošče, nato tiste, ki so z vami deljene, označene z imenom osebe, ki jih je delila.

Zavihek ponovno odpre nadzorno ploščo, ki ste jo nazadnje uporabili, in naslovna vrstica nosi odprto nadzorno ploščo (`?tab=dashboard&dashboard=<id>`), tako da povezava odpre točno to nadzorno ploščo za vsakogar, ki ima dostop do nje.

Gumb za nastavitve (samo za lastnike) preimenuje nadzorno ploščo, upravlja deljenje in jo izbriše. Izbris nadzorne plošče odstrani njene pripomočke in njihove workflow-e. Vedno obdržite vsaj eno svojo nadzorno ploščo, zato zadnje ni mogoče izbrisati.

## Pripomočki

Pripomoček je en sam graf na mreži. Podprti tipi grafov:

- **Stolpični** (navpični ali vodoravni)
- **Črta**
- **Območje** (izpolnjen trend, podpira več serij)
- **Pita**
- **Tabela** (pomična)
- **Številčni** (en sam KPI vrednost z neobvezno enoto)
- **Merilnik** (ena vrednost v razponu min–max, npr. odstotek)
- **Razpršeni** (X/Y točke za korelacijske grafe)
- **Delež** (en stolpec razdeljen na dele z odstotkovno legendo, npr. razčlenitev po jeziku)
- **Stolpčni merilnik** (ena vodoravna merilna enota na vrstico z rdeče→zelena gradientom in vrednostjo, npr. prosti prostor na disku)
- **Besedilo** (sporočilo v markdown formatu, npr. statusna opomba kot "Zadnje izvajanje ob 19:47"; podpira [interaktivne potrditvene okvirčke](../nodes/chart-output-node.md#interactive-task-lists), ko je markdown statičen, in [izrecne številčne sezname](../nodes/chart-output-node.md#numbered-lists) za prilagojeno ali padajoče številčenje)
- **HITL** (vaši čakajoči človeški pregledi. Glava prikazuje `1/n čakajočih`. Ime workflow-a odpre to izvajanje na platnu. **Odobri**, **Zahtevaj spremembe** in **Zavrni** ga rešijo. Ikona zgodovine poleg naslova pripomočka odpre to izvajanje v pogovornem oknu zgodovine na tej strani. Pripomoček ne uporablja zgornjih vrstic, in vsakdo vidi svojo lastno vrsto)

Vsak pripomoček naloži svoje podatke asinhrono, ko odprete zavihek, tako da stran ostane odzivna, medtem ko se grafi napolnijo.

## Dodajanje pripomočka

1. Kliknite **Dodaj pripomoček**, mu dajte naslov in izberite tip grafa. Pod izbirnikom dialog prikaže primer tega tipa grafa s primeri podatkov in imeni vrstic, ki jih pričakuje, tako da lahko primerjate tipe, preden karkoli zgradite.
2. Pripomoček se odpre v urejevalniku workflow-ov z začetnim grafom: vozliščem [Set](../nodes/set-node.md), ki proizvaja vrstice, povezanimi z vozliščem [Chart Output](../nodes/chart-output-node.md). Zamenjajte vozlišče Set z katerim koli virom podatkov. Pripomoček **HITL** je samo vozlišče Chart Output; bere vaše čakajoče preglede in ne potrebuje vira podatkov.
3. Zgradite workflow, tako da vozlišče, ki napaja **Chart Output**, proizvaja tabelo vrstic, nato konfigurirajte preslikavo polj vozlišča Chart Output (polje oznake, polje vrednosti itd.).
4. Shranite, vrnite se na zavihek Nadzorna plošča in pripomoček se prikaže.

Dvakrat kliknite na pripomoček (ali uporabite njegov gumb za urejanje), da kadar koli ponovno odprete njegov workflow. Uporabite **Kopiraj pripomoček** v naslovu pripomočka za podvojitev tako pripomočka kot njegovega celotnega workflow-a. Kopija je postavljena pod izvirnik in označena z **(Kopija)**, tako da jo lahko neodvisno uredite.

## Generiranje pripomočka z AI

Kliknite **AI**, opišite metriko, ki jo želite (na primer, "stopnja uspešnosti workflow-a v zadnjih 30 dneh kot stolpični graf"), in izberite poverilnico LLM in model. Heym ustvari popoln workflow pripomočka, ki se konča z vozliščem Chart Output in ga doda v mrežo. Oglejte si [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) za primerne pozive za vsak tip grafa.

Uporabite gumb **Natančno prilagodi z AI** pripomočka za revizijo obstoječega pripomočka z novim navodilom. Vsaka natančna prilagoditev AI posname prejšnji workflow v **Zgodovini urejanja** pripomočka, tako da lahko pregledate ali vrnete spremembe iz urejevalnika workflow-ov.

## Urejanje postavitve

Preklopite na **Uredi**, da vstopite v način urejanja, kjer lahko povlečete pripomočke in jih spremenite na mreži s 12 stolpci. Spremembe postavitve se shranijo samodejno. Naslove pripomočkov je mogoče urejati neposredno iz naslova pripomočka.

## Predpomnjenje in osvežitev

Vsak pripomoček predpomni svoje zadnje izračunane podatke na strežniku za nastavljivo časovno obdobje (TTL). Medtem ko je predpomnilnik svež, ponovni odpiranje nadzorne plošče služi shranjenemu rezultatu namesto ponovnega izvajanja workflow-a. Predpomnilnik se nadomesti na mestu vsakič, ko se podatki ponovno izračunajo (en predpomnilnik na pripomoček), in se samodejno invalidira, ko uredite workflow pripomočka.

Uporabite gumb **Osveži** pripomočka (ali **Osveži** v orodni vrstici), da obidete predpomnilnik in takoj ponovno izračunate.
## Deljenje

Lastniki delijo nadzorno ploščo iz svojih nastavitev, z individualnimi uporabniki (po elektronski pošti) ali s katero koli [ekipo](teams-tab.md), kateri pripadajo. Vsako deljenje je **Branje** ali **Pisanje**; ko ima nekdo tako osebno kot ekipno deljenje, velja močnejše.

| Dejanje | Lastnik | Pisanje | Branje |
|---------|:------:|:-------:|:------:|
| Ogled pripomočkov, osveževanje, uporaba samodejnega osveževanja | ✓ | ✓ | ✓ |
| Dodajanje, kloniranje, brisanje, preimenovanje in spreminjanje velikosti pripomočkov; AI generiranje in fino nastavljanje; označevanje postavk na kontrolnem seznamu | ✓ | ✓ | |
| Odprtje delovnega toka pripomočka v urejevalniku | ✓ | ✓ | |
| Preimenovanje ali brisanje nadzorne plošče, upravljanje deljenja | ✓ | | |

**Pripomočki vedno delujejo kot lastnik nadzorne plošče.** Kdor koli gleda, pripomoček uporablja lastnikove poverilnice in globalne spremenljivke, njegovi izvajanja pa se pojavijo v zgodovini izvajanja in sledi lastnika. Tako sodelavci vidijo iste podatke brez dostopa do računov, ki so za njimi, in vsak gledalec deli enega shranjenega rezultata na pripomočku. Pripomočki, ki jih doda ali klonira sodelavec s pravicami pisanja, prav tako pripadajo lastniku.

Zaradi tega **Pisanje** nosi enako zaupanje kot deljenje delovnega toka za urejanje: sodelavec s pravicami pisanja lahko spremeni, kaj se izvaja z vašimi poverilnicami. Dajte ga le ljudem, ki bi jim dovolili urejanje vaših delovnih tokov. Testno izvajanje, ki ga sodelavec začne iz urejevalnika delovnega toka, uporablja njihove lastne poverilnice, kot pri katerem koli skupnem delovnem toku; le nadzorna plošča sama deluje kot lastnik. **Branje** ne daje dostopa do delovnih tokov pripomočkov, in gledalci samo za branje prejemajo samo grafikon, ne pa podrobnosti o izvajanju za vsakim vozliščem.

Odstranitev deljenja ali znižanje pravic z pisanja na branje začne veljati takoj.

## Sorodno

- [Vhodni vozlišče za grafikon](../nodes/chart-output-node.md)
- [Zavihek analitika](analytics-tab.md) — vgrajene metrike izvajanja (različne od uporabniško zgrajenih nadzornih plošč)
