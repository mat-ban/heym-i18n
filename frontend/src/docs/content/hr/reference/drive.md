# Drive

Zaslon **Drive** pruža središnje mjesto za pregled, upravljanje i dijeljenje svih datoteka generiranih od strane vještina.

## Pristup Driveu

Navigirajte do kartice **Drive** na nadzornoj ploči. Sve datoteke generirane vašim workflow vještinama pojavljuju se ovdje, sortirane prema datumu kreiranja.

## Popis Datoteka

Popis datoteka prikazuje:

- **Ime** - Izvorno ime datoteke s ikonom specifičnom za tip
- **Tip** - MIME tip datoteke (npr., pdf, csv, docx)
- **Veličina** - Veličina datoteke u ljudski čitljivom formatu
- **Izvor** - Oznaka čvora koja je generirala datoteku
- **Datum** - Kada je datoteka kreirana
- **Radnje** - Gumbi za preuzimanje, dijeljenje i brisanje

## Masovne Radnje

Svaka datoteka koju posjedujete ima okvir za odabir na početku svog reda. Datoteke koje su s vama dijeljene putem tima su samo za čitanje i ne mogu se odabrati. Odaberite više datoteka (Shift-klik odabire kontinuirani raspon; okvir za odabir u zaglavlju odabire cijelu stranicu) kako biste otkrili traku za masovne radnje iznad popisa, a zatim kliknite **Masovne radnje** da otvorite jedan dijalog koji primjenjuje istu postavku na svaku odabranu datoteku:

- **Dijeli sve s mojim timovima** / **Ukloni dijeljenje s timom** — prebacuje dijeljenje s timom za sve odabrane datoteke odjednom
- **Kreiraj poveznicu za dijeljenje za svaku datoteku** — kreira poveznicu za dijeljenje za svaku odabranu datoteku koristeći iste vrijednosti za isteka, lozinku i maksimalne preuzimanja

Dijalog izvještava koliko je datoteka obuhvaćeno; datoteke koje ne posjedujete se preskoče. Odabir redaka po stranici (25 / 50 / 100 / **Sve**) na dnu popisa omogućuje vam učitavanje više datoteka na jednoj stranici kako biste mogli odabrati kroz cijeli Drive.

## Dijeljenje Datoteka

Kliknite ikonu **Dijeli** da otvorite dijalog za dijeljenje. Možete kreirati više poveznica za dijeljenje po datoteci s različitim konfiguracijama i opcionalno podijeliti datoteku s vašim trenutnim timovima.

### Javni Link (temeljen na Tokenu)

Kreirajte poveznicu za dijeljenje bez lozinke. Svako tko ima poveznicu može preuzeti datoteku.

### Poveznica zaštićena Lozinkom (Osnovna Autentifikacija)

Postavite lozinku prilikom kreiranja dijeljenja. URL za preuzimanje koristi HTTP osnovnu autentifikaciju - preglednici će tražiti korisničko ime (`file`) i lozinku kada se poveznica otvori.

### Opcije Poveznice

- **Ističe (sati)** - Opcionalno postavite vrijeme isteka
- **Maksimalna preuzimanja** - Opcionalno ograničite broj preuzimanja
- Obje opcije se mogu kombinirati za maksimalnu kontrolu

### Dijeli s Mojim Timovima

Omogućite **Dijeli s mojim timovima** kako biste omogućili pristup samo za čitanje svim timovima kojima trenutno pripadate. Članovi tima mogu vidjeti i preuzeti datoteku iz Drivea i koristiti operacije čvora Drive usmjerene na čitanje, ali samo vlasnik datoteke može izbrisati datoteku, kreirati ili opozvati javne poveznice, ili promijeniti lozinku/TTL/ograničenja preuzimanja.

Postavka je specifična za datoteku. Ako se pridružite ili kreirate drugi tim kasnije, ponovno prebacite dijeljenje ili pokrenite operaciju `shareWithMyTeams` čvora Drive kako biste dodali taj tim. Koristite `unshareWithMyTeams` za uklanjanje dijeljenja tima iz datoteke u workflowu.

### Upravljanje Dijeljenjima

Dijalog za dijeljenje prikazuje sve postojeće poveznice za dijeljenje s:
- Trenutnim brojem preuzimanja
- Statusom isteka
- Da li je osnovna autentifikacija omogućena
- Gumbima za kopiranje i opoziv

## Poveznice na Datoteke u Chatu i Portalu

Kada vještina generira datoteke tijekom izvršavanja workflowa putem chat-a Portala ili Quick Drawer-a, poveznice za preuzimanje automatski se pojavljuju u odgovoru. Korisnici mogu kliknuti za izravno preuzimanje.

## Pohrana

Generirane datoteke pohranjuju se na datotečnom sustavu poslužitelja pod `data/files/`. U Docker implementacijama, ovo se montira kao volumen za trajnost.

## Upravljanje Datotekama iz Workflows

[Drive čvor](../nodes/drive-node.md) omogućuje vam programatsko upravljanje datotekama Drive iz workflowa. Koristite ga za:

- **Popis** vaših datoteka i vraćanje metapodataka kao što su ime datoteke, MIME tip, veličina, izvor i URL za preuzimanje
- **Brisanje** datoteke nakon što je isporučena korisniku
- **Dijeljenje ili uklanjanje dijeljenja s vašim timovima** kako bi članovi tima mogli čitati i preuzimati datoteku samo dok dijeljenje tima postoji
- **Postavljanje lozinke** na poveznicu za preuzimanje
- **Postavljanje TTL-a** tako da poveznica ističe nakon N sati
- **Postavljanje ograničenja maksimalnih preuzimanja**

Pretvaranje datoteke u drugi format je posao [Converter čvora](../nodes/converter-node.md), s `conversion: "fileConvert"`. Čita datoteku iz Drivea i pohranjuje konvertirani rezultat kao novu.

Referencirajte datoteku prema njenom ID-u iz izlaza vještine: `$agentLabel._generated_files[0].id`

Pogledajte [dokumentaciju Drive čvora](../nodes/drive-node.md) za detalje o konfiguraciji.

## Čitanje Datoteka iz Drivea iz Vještina

Vještine agenata mogu se uključiti u čitanje Drivea s postavkom **Omogući Drive datoteke** na kartici vještine. Kada je omogućeno, runtime vještine uključuje generirani `heym_drive.py` pomoćni alat. Kod vještine može uvesti pomoćne alate kao što su `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path`, i `list_drive_files`.

Čitanja iz Drivea su ograničena na datoteke dostupne izvođaču workflowa: posjedovane datoteke i datoteke dijeljene s izvođačem putem timova. Koristite ID datoteke za točno pretraživanje, ili točno ime datoteke kada korisnik upućuje na datoteku po imenu. Pretraživanje po imenu datoteke vraća najnoviju dostupnu datoteku s tim imenom; `list_drive_files(filename="...")` vraća sve podudarnosti.

## Povezano

- [Drive Čvor](../nodes/drive-node.md) - Operacije workflowa (popis, preuzmi, izbriši, lozinka, TTL, maksimalna preuzimanja, dijeljenje tima)
- [Drive Kartica](../tabs/drive-tab.md) - Pregled datoteka na nadzornoj ploči
- [Generiranje Datoteka](./file-generation.md) - Kako se proizvode `_generated_files` i URL-ovi za preuzimanje

## Čišćenje
Istekli tokeni za dijeljenje automatski se čiste svakodnevno. Same datoteke opstaju dok se ručno ne izbrišu putem kartice Drive. Koristite **Obriši Sve** za brisanje svake datoteke i njihovih poveznica za dijeljenje u jednoj radnji.
