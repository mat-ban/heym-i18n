# Drive

Vahekaart Drive pakub keskset kohta kõigi oskuste poolt loodud failide vaatamiseks, haldamiseks ja jagamiseks.

## Drive'ile juurdepääs

Liikuge armatuurlauas vahekaardile **Drive**. Kõik teie workflow' oskuste poolt loodud failid kuvatakse siin, sorteerituna loomiskuupäeva järgi.

## Failide loend

Failide loend kuvab:

- **Nimi** – algne failinimi koos tüübipõhise ikooniga
- **Tüüp** – faili MIME-tüüp (nt pdf, csv, docx)
- **Suurus** – inimloetav faili suurus
- **Allikas** – sõlme silt, mis faili lõi
- **Kuupäev** – faili loomise aeg
- **Toimingud** – allalaadimise, jagamise ja kustutamise nupud

## Hulgitoimingud

Igal teile kuuluval failil on rea alguses märkeruut. Meeskonna kaudu teiega jagatud failid on kirjutuskaitstud ega ole valitavad. Valige mitu faili (Shift-klõps valib järjestikuse vahemiku; päise märkeruut valib terve lehe), et kuvada loendi kohal hulgitoimingute riba, seejärel klõpsake **Bulk actions**, et avada dialoog, mis rakendab sama seadet igale valitud failile:

- **Share all with my teams** / **Remove team sharing** – lülitab meeskonnaga jagamise kõigile valitud failidele korraga
- **Create share link for each file** – loob jagamislingi igale valitud failile, kasutades sama aegumise, parooli ja maksimaalsete allalaadimiste väärtusi

Dialoog teatab, mitmele failile see rakendus; failid, mis teile ei kuulu, jäetakse vahele. Loendi allosas olev ridade-arvu valija (25 / 50 / 100 / **All**) võimaldab laadida ühele lehele rohkem faile, et saaksite valida kogu oma Drive'i ulatuses.

## Failide jagamine

Klõpsake ikoonil **Share**, et avada jagamise dialoog. Saate luua faili kohta mitu jagamislinki erinevate seadistustega ning soovi korral jagada faili oma praeguste meeskondadega.

### Avalik link (tokenipõhine)

Looge jagamislink ilma paroolita. Igaüks, kellel on link, saab faili alla laadida.

### Parooliga kaitstud link (Basic Auth)

Määrake jagamise loomisel parool. Allalaadimise URL kasutab HTTP Basic Authentication'it – brauserid küsivad lingi avamisel kasutajanime (`file`) ja parooli.

### Lingi valikud

- **Expires (hours)** – soovi korral määrake aegumisaeg
- **Max downloads** – soovi korral piirake allalaadimiste arvu
- Mõlemat saab kombineerida maksimaalse kontrolli saavutamiseks

### Jagamine minu meeskondadega

Lubage **Share with my teams**, et anda kirjutuskaitstud juurdepääs kõigile meeskondadele, kuhu te praegu kuulute. Meeskonnaliikmed saavad faili Drive'is näha ja alla laadida ning kasutada lugemisele suunatud Drive node'i toiminguid, kuid ainult faili omanik saab faili kustutada, avalikke linke luua või tühistada ning muuta parooli/TTL-i/allalaadimiste limiite.

Seade on failipõhine. Kui liitute hiljem mõne teise meeskonnaga või loote selle, lülitage jagamine uuesti sisse või käivitage Drive node'i toiming `shareWithMyTeams`, et see meeskond lisada. Kasutage `unshareWithMyTeams`, et eemaldada faililt meeskonnajagamised workflow's.

### Jagamiste haldamine

Jagamise dialoog kuvab kõiki olemasolevaid jagamislinke koos:
- Praeguse allalaadimiste arvuga
- Aegumise olekuga
- Sellega, kas Basic Auth on lubatud
- Kopeerimise ja tühistamise nuppudega

## Faililingid Chat'is ja Portal'is

Kui oskus loob workflow' käivitamise ajal faile Portal'i chat'i või Quick Drawer'i kaudu, kuvatakse vastuses automaatselt allalaadimislingid. Kasutajad saavad klõpsata, et otse alla laadida.

## Salvestusruum

Loodud failid salvestatakse serveri failisüsteemi kausta `data/files/`. Dockeri juurutustes on see püsivuse tagamiseks ühendatud mahuna (volume).

## Failide haldamine workflow'de kaudu

[Drive node](../nodes/drive-node.md) võimaldab hallata Drive'i faile programmiliselt workflow' sees. Kasutage seda, et:

- **Loetleda** oma faile ja tagastada metaandmeid nagu failinimi, MIME-tüüp, suurus, allikas ja allalaadimise URL
- **Kustutada** fail pärast selle kasutajale kohaletoimetamist
- **Jagada või lõpetada jagamine oma meeskondadega**, et meeskonnaliikmed saaksid seda lugeda ja alla laadida ainult seni, kuni meeskonnajagamine kehtib
- **Määrata parool** allalaadimislingile
- **Määrata TTL**, et link aeguks N tunni pärast
- **Määrata maksimaalne allalaadimiste arv**

Faili teise vormingusse teisendamine on [Converter node'i](../nodes/converter-node.md) ülesanne, kasutades `conversion: "fileConvert"`. See loeb Drive'i faili ja salvestab teisendatud tulemuse uue failina.

Viidake failile selle ID järgi oskuse väljundist: `$agentLabel._generated_files[0].id`

Konfiguratsiooni üksikasjade kohta vaadake [Drive node'i dokumentatsiooni](../nodes/drive-node.md).

## Drive'i failide lugemine oskustest

Agendi oskused saavad Drive'ist lugemise lubada oskuse kaardi seadega **Enable Drive files**. Kui see on lubatud, sisaldab oskuse runtime'i loodud abifaili `heym_drive.py`. Oskuse kood saab importida abifunktsioone nagu `read_drive_text`, `read_drive_file`, `read_drive_base64`, `get_drive_file`, `get_drive_file_path` ja `list_drive_files`.

Drive'ist lugemine on piiratud failidega, mis on workflow' tegijale kättesaadavad: omatud failid ja failid, mis on tegijaga meeskondade kaudu jagatud. Kasutage täpseks otsinguks faili ID-d või täpset failinime, kui kasutaja viitab failile nime järgi. Failinime otsing tagastab uusima kättesaadava faili selle nimega; `list_drive_files(filename="...")` tagastab kõik vasted.

## Seotud

- [Drive Node](../nodes/drive-node.md) – workflow' toimingud (loetlemine, hankimine, kustutamine, parool, TTL, maksimaalsed allalaadimised, meeskonnaga jagamine)
- [Drive Tab](../tabs/drive-tab.md) – failide sirvimine armatuurlauas
- [File Generation](./file-generation.md) – kuidas `_generated_files` ja allalaadimise URL-id tekivad

## Puhastamine
Aegunud jagamise tokenid puhastatakse automaatselt iga päev. Failid ise püsivad seni, kuni need kustutatakse käsitsi Drive'i vahekaardi kaudu. Kasutage **Clear All**, et kustutada ühe toiminguga kõik failid ja nende jagamislingid.
