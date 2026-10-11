# Töölaud

Vahekaart **Töölaud** on Grafana-stiilis ala, kus saate koostada diagrammi vidinate ruudustikke. Iga vidin renderdatakse selle enda peidetud Heymi workflow väljundi põhjal, seega iga andmed, mida saate workflow's luua — andmebaasipäringud, API-kutsed, RAG-otsingud, LLM-i väljund — võivad saada diagrammiks. Võite pidada mitut töölauda ja jagada igaüht neist inimestega või meeskondadega.

## Töölauad

Igaüks alustab ühe töölauaga, mis luuakse vahekaardi esmakordsel avamisel. Kasutage vahekaardi ülaosas olevat töölaua valijat töölaudade vahel vahetamiseks ja selle kõrval olevat **+** uue loomiseks. Valija loetleb esmalt teie enda töölauad, seejärel need, mis on teiega jagatud, märgistatuna nende jagaja nimega.

Vahekaart avab uuesti viimati kasutatud töölaua ja aadressiriba kannab avatud töölauda (`?tab=dashboard&dashboard=<id>`), seega link avab täpselt selle töölaua kõigile, kellel on sellele juurdepääs.

Seadete nupp (ainult omanikele) nimetab töölaua ümber, haldab jagamist ja kustutab selle. Töölaua kustutamine eemaldab selle vidinad ja nende workflow'd. Teil on alati vähemalt üks oma töölaud, seega viimast ei saa kustutada.

## Vidinad

Vidin on üksik diagramm ruudustikul. Toetatud diagrammitüübid:

- **Tulp** (vertikaalne või horisontaalne)
- **Joon**
- **Ala** (täidetud trend, toetab mitut seeriat)
- **Ring**
- **Tabel** (keritav)
- **Numbriline** (üks KPI väärtus valikulise ühikuga)
- **Mõõdik** (üks väärtus min–max vahemiku suhtes, nt protsent)
- **Hajuvus** (X/Y punktid korrelatsiooni graafikute jaoks)
- **Proportsioon** (üks tulp jagatud osadeks protsendilise legendiga, nt keelte jaotus)
- **Tulpmõõdik** (üks horisontaalne mõõdik rea kohta punasest roheliseks gradiendiga ja väärtusega, nt vaba kettaruum)
- **Tekst** (markdown-sõnum, nt olekumärkus nagu "Viimane käivitus 19:47"; toetab [interaktiivseid märkeruute](../nodes/chart-output-node.md#interactive-task-lists), kui markdown on staatiline, ja [selgesõnalisi nummerdatud loendeid](../nodes/chart-output-node.md#numbered-lists) kohandatud või kahaneva nummerduse jaoks)
- **HITL** (teie ootel inimülevaatused. Päis näitab `1/n pending`. Workflow nimi avab selle käivituse lõuendil. **Kinnita**, **Taotle muudatusi** ja **Lükka tagasi** lahendavad selle. Vidinа pealkirja kõrval olev ajaloo ikoon avab selle käivituse selle lehe ajaloo dialoogis. Vidin ei kasuta ülemvoo ridu ja iga inimene näeb oma järjekorda)

Iga vidin laadib oma andmed asünkroonselt vahekaardi avamisel, seega leht püsib reageeriv, kuni diagrammid täituvad.

## Vidinа lisamine

1. Klõpsake **Lisa vidin**, andke sellele pealkiri ja valige diagrammitüüp. Valija all joonistab dialoog selle diagrammitüübi näidise näidisandmetega ja nimetab read, mida see ootab, seega saate tüüpe võrrelda enne millegi loomist.
2. Vidin avaneb workflow redaktoris algse graafiga: [Set](../nodes/set-node.md) sõlm, mis loob read, ühendatud [Chart Output](../nodes/chart-output-node.md) sõlmega. Asendage Set sõlm mis tahes andmeallikaga. **HITL** vidin on ainult Chart Output sõlm; see loeb teie ootel ülevaatusi ega vaja andmeallikat.
3. Koostage workflow nii, et **Chart Output**-i toitev sõlm loob ridade massiivi, seejärel konfigureerige Chart Output sõlme väljade vastendamine (sildi väli, väärtuse väli jne).
4. Salvestage, naaske töölaua vahekaardile ja vidin renderdatakse.

Topeltklõpsake vidinat (või kasutage selle muutmise nuppu), et selle workflow igal ajal uuesti avada. Kasutage vidinа päises **Klooni vidin**, et dubleerida nii vidin kui ka selle täielik workflow. Koopia paigutatakse originaali alla ja märgistatakse **(Copy)**, et saaksite seda iseseisvalt muuta.

## Vidinа genereerimine AI-ga

Klõpsake **AI**, kirjeldage soovitud mõõdikut (näiteks "workflow õnnestumise määr viimase 30 päeva jooksul tulpdiagrammina") ja valige LLM-i mandaat ja mudel. Heym genereerib täieliku vidinа workflow, mis lõpeb Chart Output sõlmega, ja lisab selle ruudustikku. Vaadake [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) näidispromptide kohta iga diagrammitüübi jaoks.

Kasutage vidinа nuppu **Peenhäälesta AI-ga**, et olemasolevat vidinat uue juhisega muuta. Iga AI peenhäälestus salvestab eelmise workflow vidinа **Muudatuste ajalukku**, seega saate workflow redaktorist muudatusi üle vaadata või tagasi pöörata.

## Paigutuse muutmine

Lülitage **Muuda**, et siseneda muutmisrežiimi, kus saate vidinaid lohistada ja neid 12-veerulises ruudustikus suurust muuta. Paigutuse muudatused salvestatakse automaatselt. Vidinа pealkirjad on redigeeritavad reas vidinа päisest.

## Vahemällu salvestamine ja värskendamine

Iga vidin salvestab oma viimati arvutatud andmed serveris vahemällu konfigureeritava eluea (TTL) jooksul. Kuni vahemälu on värske, teenindab töölaua uuesti avamine salvestatud tulemust workflow uuesti käivitamise asemel. Vahemälu asendatakse kohapeal iga kord, kui andmed ümber arvutatakse (üks vahemälu vidinа kohta), ja see tühistatakse automaatselt, kui muudate vidinа workflow'd.

Kasutage vidinа nuppu **Värskenda** (või tööriistariba **Värskenda**), et vahemälu vahele jätta ja kohe ümber arvutada.
## Jagamine

Omanikud jagavad armatuurlauda selle seadetest, kas üksikutele kasutajatele (e-posti järgi) või mis tahes [tiimile](teams-tab.md), kuhu nad kuuluvad. Iga jagamine on **Read** või **Write**; kui kellelgi on nii isiklik kui ka tiimi jagamine, kehtib tugevam neist.

| Toiming | Omanik | Write | Read |
|--------|:-----:|:-----:|:----:|
| Vidinatega tutvumine, nende värskendamine, automaatse värskendamise kasutamine | ✓ | ✓ | ✓ |
| Vidinate lisamine, kloonimine, kustutamine, ümbernimetamine ja suuruse muutmine; AI genereerimine ja peenhäälestamine; kontrollnimekirja üksuste märkimine | ✓ | ✓ | |
| Vidina workflow avamine redaktoris | ✓ | ✓ | |
| Armatuurlaua ümbernimetamine või kustutamine, jagamise haldamine | ✓ | | |

**Vidinad töötavad alati armatuurlaua omanikuna.** Olenemata sellest, kes vaatab, kasutab vidin omaniku mandaate ja globaalseid muutujaid ning selle käivitused ilmuvad omaniku käivituste ajalukku ja jälgedesse. Seetõttu näevad tiimikaaslased samu andmeid ilma juurdepääsuta nende taga olevatele kontodele ning iga vaataja jagab iga vidina kohta üht vahemällu salvestatud tulemust. Vidinad, mille write-õigusega kaastöötaja lisab või kloonib, kuuluvad samuti omanikule.

Seetõttu kannab **Write** sama usaldust nagu workflow' jagamine redigeerimiseks: write-õigusega kaastöötaja saab muuta seda, mis töötab Teie mandaatidega. Andke see ainult inimestele, kellel lubaksite oma workflow'sid redigeerida. Testkäivitus, mille kaastöötaja käivitab workflow redaktorist, kasutab nende endi mandaate, nagu iga jagatud workflow puhul; ainult armatuurlaud ise töötab omanikuna. **Read** ei anna juurdepääsu vidina workflow'dele ning kirjutuskaitsega vaatajad saavad diagrammi enda, kuid mitte selle taga olevaid sõlmede kaupa käivituse üksikasju.

Jagamise eemaldamine või selle alandamine write'ilt read'ile jõustub kohe.

## Seotud

- [Chart Output node](../nodes/chart-output-node.md)
- [Analytics tab](analytics-tab.md) — sisseehitatud käivituste mõõdikud (erinevad kasutaja loodud armatuurlaudades)
