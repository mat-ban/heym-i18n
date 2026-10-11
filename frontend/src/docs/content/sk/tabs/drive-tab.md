# Karta Drive

Karta Drive zobrazuje všetky súbory vygenerované skillmi naprieč vašimi workflowmi.

<video src="/features/showcase/drive.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/drive.webm">▶ Pozrieť demo Drive</a></p>

## Prehľad

Súbory vygenerované skillmi (PDF, DOCX, CSV, obrázky atď.) sa automaticky ukladajú a zobrazujú na karte Drive. Pri každom súbore sa zobrazuje jeho názov, typ, veľkosť, zdrojový uzol, dátum vytvorenia a stav zdieľania s tímom.

## Funkcie

- **Vyhľadávanie** – Filtrovanie súborov podľa názvu, typu alebo zdrojového uzla
- **Kopírovať ID súboru** – Skopíruje UUID súboru do schránky, pripravené na vloženie do uzla [Drive](../nodes/drive-node.md) alebo [Converter](../nodes/converter-node.md)
- **Stiahnuť** – Autentifikované stiahnutie pre vaše súbory a súbory, ktoré s vami boli zdieľané prostredníctvom tímov
- **Zdieľať** – Vytvorenie zdieľateľných odkazov na stiahnutie s voliteľnou ochranou heslom a expiráciou alebo zdieľanie súboru v režime len na čítanie s vašimi aktuálnymi tímami
- **Odstrániť** – Odstránenie súborov a ich odkazov na zdieľanie
- **Vymazať všetko** – Odstránenie všetkých súborov a ich odkazov na zdieľanie po potvrdení
- **Hromadné akcie** – Výber viacerých súborov pomocou zaškrtávacích políčok (Shift-kliknutím vyberiete rozsah) a aplikovanie rovnakej akcie na všetky naraz
- **Stránkovanie** – Prechádzanie rozsiahlych kolekcií súborov s voličom počtu riadkov na stránku (25 / 50 / 100 / Všetky)

## Hromadné akcie

Súbory, ktoré vlastníte, zobrazujú zaškrtávacie políčko na začiatku svojho riadka (súbory, ktoré s vami boli zdieľané prostredníctvom tímu, sú len na čítanie a nie je možné ich vybrať). Vyberte niekoľko riadkov – alebo použite zaškrtávacie políčko v hlavičke na výber celej stránky a **Shift-kliknutím** vyberte rozsah – a potom použite panel hromadných akcií, ktorý sa zobrazí nad zoznamom:

- **Stiahnuť ZIP** zabalí každý vybraný súbor do jedného archívu ZIP a stiahne ho
- **Hromadné akcie** otvorí jeden dialóg na aplikovanie jedného nastavenia na každý vybraný súbor:
  - **Zdieľať všetko s mojimi tímami** / **Odstrániť zdieľanie s tímom** jedným kliknutím
  - **Vytvoriť odkaz na zdieľanie pre každý súbor** s rovnakým heslom, expiráciou a nastaveniami maximálneho počtu stiahnutí
- **Odstrániť** odstráni každý vybraný súbor a jeho odkazy na zdieľanie po potvrdení
- **Zrušiť výber** zruší výber všetkého

Dialóg uvádza, na koľko súborov bolo nastavenie aplikované (súbory, ktoré nevlastníte, sa preskočia). Pomocou možnosti **Všetky** vo voliči počtu riadkov na stránku načítate všetky súbory na jednej stránke a vyberiete naprieč celým vaším Drive. Písaním do vyhľadávacieho poľa sa volič počtu riadkov na stránku automaticky prepne na **Všetky**, aby vyhľadávanie pokrylo každý súbor, nielen aktuálnu stránku; vymazaním vyhľadávania sa obnoví váš predchádzajúci výber.

## Zdieľanie

Vytvárajte odkazy na zdieľanie s:
- **Bez autentifikácie** – Verejná URL na stiahnutie založená na token
- **Basic Auth** – Odkaz chránený heslom (používateľské meno: `file`)
- **Expirácia** – Voliteľná časová expirácia
- **Limity sťahovania** – Voliteľný maximálny počet stiahnutí

Zapnite **Zdieľať s mojimi tímami** pri súbore, aby bol viditeľný pre všetky tímy, ktorých ste aktuálne členom. Zdieľaní členovia tímu získajú prístup len na čítanie; akcie správy zostávajú vyhradené vlastníkovi.

## Prístup skillov agenta

Skilly na uzle Agent môžu povoliť čítanie súborov Drive. Keď je pre skill zapnutá možnosť **Povoliť súbory Drive**, jeho Python kód môže čítať prístupné súbory Drive podľa ID súboru alebo presného názvu súboru prostredníctvom vygenerovaného pomocníka `heym_drive.py`. Toto nastavenie je predvolene vypnuté.

Úplné podrobnosti nájdete v [referencii Drive](../reference/drive.md).

## Súvisiace

- [Uzol Drive](../nodes/drive-node.md) – Zoznam súborov, získanie metadát, zdieľanie s tímami alebo zmena obmedzení zdieľania z workflowu
- [Generovanie súborov](../reference/file-generation.md) – Ako skilly generujú súbory
- [Referencia Drive](../reference/drive.md) – Odkazy na zdieľanie, tokeny a čistenie
- [Portál](../reference/portal.md) – Odkazy na súbory v odpovediach chatu portálu
