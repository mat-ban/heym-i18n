# Drive

Zavihek Drive nudi osrednje mesto za ogled, upravljanje in deljenje vseh datotek, ki jih generirajo veščine.

## Dostop do Drive

Pojdite na zavihek **Drive** v nadzorni plošči. Vse datoteke, ki jih generirajo vaše workflow veščine, se tukaj prikažejo, razvrščene po datumu ustvarjanja.

## Seznam datotek

Seznam datotek prikazuje:

- **Ime** - Izvirno ime datoteke z ikono, specifično za tip
- **Tip** - MIME tip datoteke (npr. pdf, csv, docx)
- **Velikost** - Človeško berljiva velikost datoteke
- **Vir** - Oznaka vozlišča, ki je generirala datoteko
- **Datum** - Kdaj je bila datoteka ustvarjena
- **Dejanja** - Gumbi za prenos, deljenje in brisanje

## Masovna dejanja

Vsaka datoteka, ki jo imate, ima potrditveno polje na začetku svojega vrstice. Datoteke, ki so z vami deljene preko ekipe, so samo za branje in jih ni mogoče izbrati. Izberite več datotek (Shift-klik izbere zaporedje; potrditveno polje v glavi izbere celo stran), da razkrijete vrstico za masovna dejanja nad seznamom, nato kliknite **Masovna dejanja**, da odprete en pogovor, ki uporabi isto nastavitev za vse izbrane datoteke:

- **Deli vse z mojimi ekipami** / **Odstrani deljenje ekipe** — preklopi deljenje ekipe za vse izbrane datoteke hkrati
- **Ustvari povezavo za deljenje za vsako datoteko** — ustvari povezavo za deljenje za vsako izbrano datoteko z istimi vrednostmi za potek, geslo in največje prenose

Pogovor poroča, koliko datotek je bilo obdelanih; datoteke, ki jih ne posedujete, so izpuščene. Izbirnik vrstic na stran (25 / 50 / 100 / **Vse**) na dnu seznama vam omogoča nalaganje več datotek na eni strani, tako da lahko izberete čez celoten Drive.

## Deljenje datotek

Kliknite ikono **Deli**, da odprete pogovor za deljenje. Ustvarite lahko več povezav za deljenje za vsako datoteko z različnimi konfiguracijami in po želji delite datoteko s svojimi trenutnimi ekipami.

### Javni povezava (na osnovi žetona)

Ustvarite povezavo za deljenje brez gesla. Kdor koli ima povezavo, lahko prenese datoteko.

### Povezava z zaščito z geslom (Osnovna avtentikacija)

Nastavite geslo pri ustvarjanju delitve. URL za prenos uporablja HTTP osnovno avtentikacijo - brskalniki bodo pozvali za uporabniško ime (`file`) in geslo, ko se povezava odpre.

### Možnosti povezave

- **Poteka (ure)** - Po želji nastavite čas poteka
- **Največ prenosi** - Po želji omejite število prenosov
- Obe možnosti lahko kombinirate za največjo kontrolo

### Deli z mojimi ekipami

Omogočite **Deli z mojimi ekipami**, da dodelite dostop samo za branje vsem ekipam, katerih član ste trenutno. Člani ekipe lahko vidijo in prenesejo datoteko iz Drive ter uporabljajo operacije vozlišča Drive, usmerjene na branje, vendar lahko datoteko izbriše le njen lastnik, ustvari ali prekliče javne povezave ali spremeni geslo/TTL/omejitve prenosa.

Nastavitev je specifična za datoteko. Če se kasneje pridružite ali ustvarite drugo ekipo, ponovno preklopite deljenje ali izvedite operacijo `shareWithMyTeams` vozlišča Drive, da dodate to ekipo. Uporabite `unshareWithMyTeams`, da odstranite delitve ekipe iz datoteke v workflow.

### Upravljanje delitev

Pogovor za deljenje prikazuje vse obstoječe povezave za deljenje z:
- Trenutnim številom prenosov
- Statusom poteka
- Ali je osnovna avtentikacija omogočena
- Gumbi za kopiranje in preklic

## Povezave do datotek v Chat & Portal

Ko veščina generira datoteke med izvajanjem workflow preko klepeta v Portalu ali Hitrega predala, se povezave za prenos samodejno prikažejo v odgovoru. Uporabniki lahko kliknejo za neposreden prenos.

## Shranjevanje

Generirane datoteke so shranjene na datotečnem sistemu strežnika pod `data/files/`. V namestitvah Docker je to pritrjeno kot volumen za trajnost.

## Upravljanje datotek iz Workflows

[Vozlišče Drive](../nodes/drive-node.md) vam omogoča programatsko upravljanje datotek Drive znotraj workflow. Uporabite ga za:

- **Seznam** vaših datotek in vrnitev metapodatkov, kot so ime datoteke, MIME tip, velikost, vir in URL za prenos
- **Izbriši** datoteko po tem, ko je bila dostavljena uporabniku
- **Deli ali prekliči delitev z vašimi ekipami**, tako da lahko člani ekipe berejo in prenašajo datoteko le, dokler delitev ekipe obstaja
- **Nastavi geslo** na povezavi za prenos
- **Nastavi TTL**, tako da povezava poteče po N urah
- **Nastavi omejitev prenosa**

Pretvorba datoteke v drug format je naloga [Vozlišča Converter](../nodes/converter-node.md) z `conversion: "fileConvert"`. Prebere datoteko Drive in shrani pretvorjen rezultat kot novo.

Referencirajte datoteko po njenem ID-ju iz izhoda veščine: `$agentLabel._generated_files[0].id`

Oglejte si [dokumentacijo vozlišča Drive](../nodes/drive-node.md) za podrobnosti o konfiguraciji.

## Branje datotek Drive iz veščin

Veščine agentov se lahko odločijo za branje datotek Drive z nastavitvijo **Omogoči datoteke Drive** na kartici veščine. Ko je omogočeno, runtime veščine vključuje generiran pomočnik `heym_drive.py`. Koda veščine lahko uvozi pomočnike, kot so `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` in `list_drive_files`.

Branja datotek Drive so omejena na datoteke, dostopne izvajalcu workflow: lastniške datoteke in datoteke, deljene z izvajalcem preko ekip. Uporabite ID datoteke za natančno iskanje ali natančno ime datoteke, ko uporabnik omeni datoteko po imenu. Iskanje po imenu datoteke vrne najnovejšo dostopno datoteko s tem imenom; `list_drive_files(filename="...")` vrne vse ujemajoče se datoteke.

## Sorodno

- [Vozlišče Drive](../nodes/drive-node.md) - Operacije workflow (seznam, pridobi, izbriši, geslo, TTL, največ prenosi, deljenje ekipe)
- [Zavihek Drive](../tabs/drive-tab.md) - Brskanje po datotekah v nadzorni plošči
- [Generiranje datotek](./file-generation.md) - Kako se proizvajajo `_generated_files` in URL-ji za prenos

## Čiščenje
Potekli žetoni za deljenje se samodejno očistijo dnevno. Same datoteke obstajajo, dokler jih ne izbrišete ročno preko zavihka Drive. Uporabite **Izbriši vse**, da izbrišete vse datoteke in njihove povezave za deljenje v eni akciji.
