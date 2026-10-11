# Kartica Drive

Kartica Drive prikazuje sve datoteke generirane vještinama unutar Vaših workflows.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Pogledajte demo Drive-a</a></p>

## Pregled

Datoteke generirane vještinama (PDF, DOCX, CSV, slike itd.) automatski se pohranjuju i prikazuju na kartici Drive. Svaka datoteka prikazuje svoje ime, tip, veličinu, izvorni čvor, datum kreiranja i stanje dijeljenja s timom.

## Značajke

- **Pretraživanje** - Filtrirajte datoteke prema imenu, tipu ili izvoru čvora
- **Kopiraj ID datoteke** - Kopirajte UUID datoteke u međuspremnik, spreman za lijepljenje u [Drive](../nodes/drive-node.md) ili [Converter](../nodes/converter-node.md) čvor
- **Preuzmi** - Autorizirano preuzimanje Vaših datoteka i datoteka koje su s Vama dijeljene putem timova
- **Dijeli** - Kreirajte linkove za preuzimanje s mogućom zaštitom lozinkom i istekom, ili dijelite datoteku samo za čitanje s Vašim trenutnim timovima
- **Izbriši** - Uklonite datoteke i njihove linkove za dijeljenje
- **Obriši sve** - Izbrišite svaku datoteku i njihove linkove za dijeljenje nakon potvrde
- **Masovne radnje** - Odaberite više datoteka pomoću potvrdnih okvira (Shift-klik za raspon) i primijenite istu radnju na sve njih odjednom
- **Paginacija** - Pregledavajte velike kolekcije datoteka, s odabira broja redaka po stranici (25 / 50 / 100 / Sve)

## Masovne Radnje

Datoteke koje posjedujete prikazuju potvrdni okvir na početku svog reda (datoteke koje su s Vama dijeljene putem tima su samo za čitanje i nisu odabirne). Odaberite nekoliko redova — ili koristite potvrdni okvir u zaglavlju za odabir cijele stranice, i **Shift-klik** za odabir raspona — zatim koristite traku masovnih radnji koja se pojavljuje iznad popisa:

- **Preuzmi ZIP** spaja svaku odabranu datoteku u jedan ZIP arhiv i preuzima je
- **Masovne radnje** otvara jedan dijalog za primjenu jedne postavke na svaku odabranu datoteku:
  - **Dijeli sve s mojim timovima** / **Ukloni dijeljenje s timom** jednim klikom
  - **Kreiraj link za dijeljenje za svaku datoteku** koristeći istu lozinku, isteka i maksimalne preuzimanja
- **Izbriši** uklanja svaku odabranu datoteku i njezine linkove za dijeljenje nakon potvrde
- **Očisti odabir** poništava sve odabire

Dijalog izvještava koliko je datoteka primijenjeno (datoteke koje ne posjedujete se preskoče). Koristite opciju **Sve** u odabiru broja redaka po stranici kako biste učitali svaku datoteku na jednoj stranici i odabrali kroz cijeli Vaš Drive. Upisivanje u pretraživač automatski mijenja odabir broja redaka po stranici na **Sve** kako bi pretraživanje obuhvatilo svaku datoteku, a ne samo trenutnu stranicu; brisanje pretraživanja vraća Vaš prethodni odabir.

## Dijeljenje

Kreirajte linkove za dijeljenje s:
- **Bez autentifikacije** - Javni URL za preuzimanje temeljen na tokenu
- **Osnovna autentifikacija** - Link zaštićen lozinkom (korisničko ime: `file`)
- **Istek** - Opcionalno vremensko istekanje
- **Ograničenja preuzimanja** - Opcionalni maksimalni broj preuzimanja

Omogućite **Dijeli s mojim timovima** na datoteci kako biste je učinili vidljivom svim timovima kojima trenutno pripadate. Članovi tima koji su podijelili dobivaju pristup samo za čitanje; upravljačke radnje ostaju samo za vlasnika.

## Pristup Vještinama Agenta

Vještine na Agent čvoru mogu se odlučiti za čitanje datoteka iz Drive-a. Kada je **Omogući datoteke iz Drive-a** uključeno za vještinu, njezin Python kod može čitati dostupne datoteke iz Drive-a prema ID-u datoteke ili točnom imenu datoteke putem generiranog `heym_drive.py` pomoćnog alata. Ova postavka je prema zadanim postavkama isključena.

Pogledajte [Drive referencu](../reference/drive.md) za sve detalje.

## Povezano

- [Drive Node](../nodes/drive-node.md) - Popis datoteka, preuzimanje metapodataka, dijeljenje s timovima ili promjena ograničenja dijeljenja iz workflow-a
- [Generiranje datoteka](../reference/file-generation.md) - Kako vještine generiraju datoteke
- [Drive referenca](../reference/drive.md) - Linkovi za dijeljenje, tokeni i čišćenje
- [Portal](../reference/portal.md) - Linkovi na datoteke u odgovorima na chat u portalu
