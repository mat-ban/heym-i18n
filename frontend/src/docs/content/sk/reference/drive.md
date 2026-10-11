# Drive

Karta Drive poskytuje centrálne miesto na zobrazenie, správu a zdieľanie všetkých súborov generovaných skillmi.

## Prístup k Drive

Prejdite na kartu **Drive** v dashboarde. Všetky súbory generované skillmi vášho workflow sa zobrazia tu, zoradené podľa dátumu vytvorenia.

## Zoznam súborov

Zoznam súborov zobrazuje:

- **Name** – Pôvodný názov súboru s ikonou špecifickou pre daný typ
- **Type** – MIME typ súboru (napr. pdf, csv, docx)
- **Size** – Veľkosť súboru v čitateľnom formáte
- **Source** – Označenie uzla, ktorý súbor vygeneroval
- **Date** – Kedy bol súbor vytvorený
- **Actions** – Tlačidlá na stiahnutie, zdieľanie a vymazanie

## Hromadné akcie

Každý súbor, ktorý vlastníte, má na začiatku riadku zaškrtávacie pole. Súbory zdieľané s vami prostredníctvom tímu sú iba na čítanie a nie je možné ich vybrať. Vyberte viacero súborov (Shift-klik vyberie súvislý rozsah; zaškrtávacie pole v hlavičke vyberie celú stránku) na zobrazenie panela hromadných akcií nad zoznamom, potom kliknite na **Bulk actions** na otvorenie dialógu, ktorý aplikuje rovnaké nastavenie na každý vybraný súbor:

- **Share all with my teams** / **Remove team sharing** — prepína zdieľanie s tímom pre všetky vybrané súbory naraz
- **Create share link for each file** — vytvorí share link pre každý vybraný súbor s rovnakými hodnotami expirácie, hesla a maximálneho počtu stiahnutí

Dialóg zobrazuje, na koľko súborov bolo nastavenie aplikované; súbory, ktoré nevlastníte, sú preskočené. Selektor počtu riadkov na stránku (25 / 50 / 100 / **All**) v spodnej časti zoznamu vám umožňuje načítať viac súborov na jednej stránke, aby ste mohli vyberať naprieč celým Drive.

## Zdieľanie súborov

Kliknutím na ikonu **Share** otvoríte dialóg zdieľania. Pre každý súbor môžete vytvoriť viacero share linkov s rôznymi konfiguráciami a voliteľne súbor zdieľať s vašimi aktuálnymi tímami.

### Verejný link (na báze tokenu)

Vytvorte share link bez hesla. Ktokoľvek s linkom môže súbor stiahnuť.

### Link chránený heslom (Basic Auth)

Pri vytváraní share linku nastavte heslo. URL na stiahnutie používa HTTP Basic Authentication – prehliadače pri otvorení linku vyžiadajú používateľské meno (`file`) a heslo.

### Možnosti linku

- **Expires (hours)** – Voliteľne nastavte čas expirácie
- **Max downloads** – Voliteľne obmedzte počet stiahnutí
- Obe možnosti je možné kombinovať pre maximálnu kontrolu

### Zdieľať s mojimi tímami

Zapnite **Share with my teams** na udelenie prístupu iba na čítanie pre všetky tímy, ktorých ste aktuálne členom. Členovia tímu môžu súbor vidieť a stiahnuť z Drive a používať operácie uzla Drive orientované na čítanie, ale iba vlastník súboru môže súbor vymazať, vytvárať alebo odvolávať verejné linky, či meniť heslo/TTL/limity sťahovania.

Nastavenie je špecifické pre daný súbor. Ak sa neskôr pripojíte k inému tímu alebo ho vytvoríte, znova prepnite zdieľanie alebo spustite operáciu `shareWithMyTeams` uzla Drive na pridanie tohto tímu. Použite `unshareWithMyTeams` na odstránenie zdieľania s tímom zo súboru v rámci workflow.

### Správa share linkov

Dialóg zdieľania zobrazuje všetky existujúce share linky s:
- Aktuálnym počtom stiahnutí
- Stavom expirácie
- Informáciou, či je zapnutá Basic Auth
- Tlačidlami na kopírovanie a odvolanie

## Odkazy na súbory v Chat & Portal

Keď skill vygeneruje súbory počas spustenia workflow prostredníctvom Portal chat alebo Quick Drawer, odkazy na stiahnutie sa automaticky zobrazia v odpovedi. Používatelia môžu kliknúť a stiahnuť priamo.

## Úložisko

Vygenerované súbory sú uložené v súborovom systéme servera v `data/files/`. V Docker nasadeniach je toto pripojené ako volume pre perzistenciu.

## Správa súborov z workflowov

[Uzol Drive](../nodes/drive-node.md) vám umožňuje spravovať súbory v Drive programovo z prostredia workflow. Použite ho na:

- **List** – vypíše vaše súbory a vráti metadata ako názov súboru, MIME typ, veľkosť, zdroj a URL na stiahnutie
- **Delete** – vymaže súbor po jeho doručení používateľovi
- **Share or unshare with your teams** – zdieľa alebo zruší zdieľanie s vašimi tímami, aby členovia tímu mohli súbor čítať a sťahovať iba pokiaľ zdieľanie s tímom existuje
- **Set a password** – nastaví heslo na linku na stiahnutie
- **Set a TTL** – nastaví expiráciu linku po N hodinách
- **Set a max downloads** – nastaví limit maximálneho počtu stiahnutí

Konverzia súboru do iného formátu je úlohou [uzla Converter](../nodes/converter-node.md) s `conversion: "fileConvert"`. Načíta súbor z Drive a uloží konvertovaný výsledok ako nový súbor.

Na súbor odkazujte pomocou jeho ID z výstupu skillu: `$agentLabel._generated_files[0].id`

Podrobnosti o konfigurácii nájdete v [dokumentácii uzla Drive](../nodes/drive-node.md).

## Čítanie súborov z Drive zo skillov

Agent skilly môžu povoliť čítanie z Drive pomocou nastavenia **Enable Drive files** na karte skillu. Po zapnutí runtime skillu zahrnie vygenerovaného pomocníka `heym_drive.py`. Kód skillu môže importovať pomocníkov ako `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` a `list_drive_files`.

Čítanie z Drive je obmedzené na súbory prístupné pre aktéra workflow: vlastnené súbory a súbory zdieľané s aktérom prostredníctvom tímov. Pre presné vyhľadanie použite ID súboru, alebo presný názov súboru, keď používateľ odkazuje na súbor podľa názvu. Vyhľadávanie podľa názvu vráti najnovší prístupný súbor s daným názvom; `list_drive_files(filename="...")` vráti všetky zhody.

## Súvisiace

- [Uzol Drive](../nodes/drive-node.md) – Operácie workflow (list, get, delete, password, TTL, max downloads, zdieľanie s tímom)
- [Karta Drive](../tabs/drive-tab.md) – Prehliadanie súborov v dashboarde
- [Generovanie súborov](./file-generation.md) – Ako vznikajú `_generated_files` a URL na stiahnutie

## Čistenie
Expirované share tokeny sa automaticky čistia denne. Súbory samotné pretrvávajú, kým nie sú manuálne vymazané prostredníctvom karty Drive. Použite **Clear All** na vymazanie všetkých súborov a ich share linkov jednou akciou.
