# Töölaud

Vahekaart **Töölaud** on Grafana-stiilis ala, kus saate koostada diagrammi vidinate ruudustikke. Iga vidin renderdatakse selle enda peidetud Heymi workflow väljundi põhjal, seega iga andmed, mida saate workflow's luua — andmebaasipäringud, API-kutsed, RAG-otsingud, LLM-i väljund — võivad saada diagrammiks. Võite pidada mitut töölauda ja jagada igaüht neist inimestega või meeskondadega.

## Töölauad

Igaüks alustab ühe töölauaga, mis luuakse vahekaardi esmakordsel avamisel. Kasutage vahekaardi ülaosas olevat töölaua valijat töölaudade vahel vahetamiseks ja selle kõrval olevat **+** uue loomiseks. Valija loetleb esmalt teie enda töölauad, seejärel need, mis on teiega jagatud, märgistatuna nende jagaja nimega.

Vahekaart avab uuesti viimati kasutatud töölaua ja aadressiriba kannab avatud töölauda (`?tab=dashboard&dashboard=<id>`), seega link avab täpselt selle töölaua kõigile, kellel on sellele juurdepääs.

Seadete nupp (ainult omanikele) nimetab töölaua ümber, määrab, milliseid kirjeid see [üksikasjade lehena](#detail-pages) aktsepteerib, haldab jagamist ja kustutab selle. Töölaua kustutamine eemaldab selle vidinad ja nende workflow'd. Teil on alati vähemalt üks oma töölaud, seega viimast ei saa kustutada.

## Vidinad

Vidin on üksik diagramm ruudustikul. Toetatud diagrammitüübid:

- **Tulp** (vertikaalne või horisontaalne)
- **Joon**
- **Ala** (täidetud trend, toetab mitut seeriat)
- **Ring**
- **Tabel** (keritav; ühte veergu saab kuvada [olekukiipidena](../nodes/chart-output-node.md#status-chips) ja read võivad avada [üksikasjade lehe](#detail-pages))
- **Numbriline** (üks KPI väärtus valikulise ühikuga)
- **Mõõdik** (üks väärtus min–max vahemiku suhtes, nt protsent)
- **Hajuvus** (X/Y punktid korrelatsiooni graafikute jaoks)
- **Proportsioon** (üks tulp jagatud osadeks protsendilise legendiga, nt keelte jaotus)
- **Tulpmõõdik** (üks horisontaalne mõõdik rea kohta punasest roheliseks gradiendiga ja väärtusega, nt vaba kettaruum)
- **Tekst** (markdown-sõnum, nt olekumärkus nagu "Viimane käivitus 19:47"; toetab [interaktiivseid märkeruute](../nodes/chart-output-node.md#interactive-task-lists), kui markdown on staatiline, ja [selgesõnalisi nummerdatud loendeid](../nodes/chart-output-node.md#numbered-lists) kohandatud või kahaneva nummerduse jaoks)
- **HITL** (teie ootel inimülevaatused. Päis näitab `1/n pending`. Workflow nimi avab selle käivituse lõuendil. **Kinnita**, **Taotle muudatusi** ja **Lükka tagasi** lahendavad selle. Vidinа pealkirja kõrval olev ajaloo ikoon avab selle käivituse selle lehe ajaloo dialoogis. Vidin ei kasuta ülemvoo ridu ja iga inimene näeb oma järjekorda)

Lisaks diagrammidele käivitab vidin **Run a workflow** ühe teie workflow'dest otse töölaualt: lohistatud failiga, sisestusväljadega või nupuga Run; vt [Käivitusvidinad](#run-widgets).

Iga vidin laadib oma andmed asünkroonselt vahekaardi avamisel, seega leht püsib reageeriv, kuni diagrammid täituvad.

## Vidinа lisamine

1. Klõpsake **Lisa vidin**, andke sellele pealkiri ja valige diagrammitüüp. Valija all joonistab dialoog selle diagrammitüübi näidise näidisandmetega ja nimetab read, mida see ootab, seega saate tüüpe võrrelda enne millegi loomist.
2. Vidin avaneb workflow redaktoris algse graafiga: [Set](../nodes/set-node.md) sõlm, mis loob read, ühendatud [Chart Output](../nodes/chart-output-node.md) sõlmega. Asendage Set sõlm mis tahes andmeallikaga. **HITL** vidin on ainult Chart Output sõlm; see loeb teie ootel ülevaatusi ega vaja andmeallikat.
3. Koostage workflow nii, et **Chart Output**-i toitev sõlm loob ridade massiivi, seejärel konfigureerige Chart Output sõlme väljade vastendamine (sildi väli, väärtuse väli jne).
4. Salvestage, naaske töölaua vahekaardile ja vidin renderdatakse.

Vidina **Run a workflow** puhul valige hoopis käivitatav workflow; valija näitab, kuidas vidin igaüht neist käivitab. Vidin lisatakse otse ruudustikule; uut workflow'd pole vaja ehitada.

Topeltklõpsake vidinat (või kasutage selle muutmise nuppu), et selle workflow igal ajal uuesti avada. Kasutage vidinа päises **Klooni vidin**, et dubleerida nii vidin kui ka selle täielik workflow. Koopia paigutatakse originaali alla ja märgistatakse **(Copy)**, et saaksite seda iseseisvalt muuta.

## Üksikasjade lehed

Tabelividin saab siduda oma read teise töölauaga, mis toimib seejärel üksikasjade lehena: üks töölaud, mis teenindab iga klienti, arvet või piletit.

1. Avage tabelividina **Settings** ja valige jaotises **Row link** soovitud töölaud.
2. Sisestage **Record column**, veerg, mille väärtus tuvastab rea (näiteks `id`), ja valikuliselt **Label column**, mis annab sellele nime (näiteks `name`).
3. Salvestage. Real klõpsamine (või selle fookustamine ja sisestusklahvi Enter vajutamine) avab lingitud töölaua parameetritega `?record=<value>&label=<name>`.

Üksikasjade töölaual loeb iga vidina workflow väärtust kui `$page.record` (vt [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), ning leht kuvab ruudustiku kohal `Dashboard / <label>` koos nupuga kirje tühjendamiseks. Tagasi viib tagasi tabelisse, kust tulite.

- **Kes saab seda avada.** Read on klõpsatavad ainult vaatajatele, kes saavad lingitud töölaua avada. Teised näevad sama tabelit ilma linkideta.
- **Kirje vorming.** Kirje pärineb URL-ist, seega otsustab üksikasjade töölaud, mida see aktsepteerib. Selle seadetes on **Detail page records** üks järgmistest: ID-d (tähed, numbrid, `-`, `_` ja `.`, kuni 128 tähemärki; vaikimisi), arvud, UUID-d või e-posti aadressid. Mis tahes muu väärtus lükatakse tagasi enne vidina käivitamist ja vidinad kuvavad teate "This page does not accept that record".
- **Endiselt omaniku käivitus.** Vidinad käivitatakse ka üksikasjade lehel töölaua omanikuna. Ehitajad peaksid edastama `$page.record` ainult sinna, kus sõlm seda varjestab (escape), mitte kunagi otse päringuteksti.
- **Vahemällu salvestamine.** Iga vidin salvestab oma diagrammi kirje kaupa vahemällu sama elueaga (TTL) kui vidin ise ja säilitab 50 viimati kasutatud kirjet.

## Käivitusvidinad

Vidin **Run a workflow** käivitab ühe teie workflow'dest ja näitab tulemust: olekut, käivitusaega ja väljundeid. See, mida kuvatakse, sõltub sellest, mida workflow sisendiks võtab:

- **Fail.** Workflow puhul, mis algab sõlmega [File Upload Trigger](../nodes/file-upload-trigger-node.md), lohistage fail sellele (või klõpsake faili valimiseks) ja vidin laadib selle üles triggeri ühekordse üleslaadimislingi kaudu. Vidin näitab triggeri aktsepteeritavaid failitüüpe ja suurust ning keeldub teistest enne üleslaadimist. Kui workflow algab ka sõlmega Text Input, kuvab vidin selle väljad lohistamisala kõrval: valige fail, täitke väljad ja **Run** saadab mõlemad. Väärtused liiguvad koos vidina loodud üleslaadimislingiga, nii et jagatud üleslaadimislink ei saa neid määrata.
- **Sisestusväljad.** Workflow puhul, mis algab sõlmega Text Input, kuvab vidin selle väljad koos vaikeväärtustega; **Run** käivitab workflow teie väärtustega. Väärtused väljadele, mida workflow'l pole, jäetakse kõrvale.
- **Mitte midagi.** Ilma sisenditeta workflow saab nupu **Run**.

Tulemuse nupp **Wrap** murrab pikad väljundread kasti sees; lülitage see välja, et lugeda väljundi JSON-paigutust.

- Igaüks, kes saab töölaua avada, saab vidinat käivitada, täpselt nagu igaüks saab diagrammi värskendada. Juurdepääs workflow'le kuulub töölaua omanikule: vidina lisamiseks on vaja workflow'd, mida nii teie kui ka omanik saate käivitada, ning käivitus ise kasutab workflow omaniku mandaate nagu iga üleslaadimislink.
- Tulemus jääb teie ekraanile seni, kuni lahkute lehelt; teised vaatajad ei näe teie faile, väärtusi ega tulemusi. Käivitus ilmub täitmisajaloos triggeriga `dashboard`.
- Töölaua jagamine ei anna kunagi juurdepääsu workflow'le endale. **Edit workflow** avab selle inimestele, kellel on juba juurdepääs, ja valikut **Fine-tune with AI** ei pakuta.
- Failikäivitused toimuvad põhieksemplaris, kus üleslaaditud faile hoitakse, nagu iga File Upload Triggeri käivitus.

## Vidinа genereerimine AI-ga

Klõpsake **AI**, kirjeldage soovitud mõõdikut (näiteks "workflow õnnestumise määr viimase 30 päeva jooksul tulpdiagrammina") ja valige LLM-i mandaat ja mudel. Heym genereerib täieliku vidinа workflow, mis lõpeb Chart Output sõlmega, ja lisab selle ruudustikku. Vaadake [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) näidispromptide kohta iga diagrammitüübi jaoks.

Kasutage vidinа nuppu **Peenhäälesta AI-ga**, et olemasolevat vidinat uue juhisega muuta. Iga AI peenhäälestus salvestab eelmise workflow vidinа **Muudatuste ajalukku**, seega saate workflow redaktorist muudatusi üle vaadata või tagasi pöörata.

## Paigutuse muutmine

Lülitage **Muuda**, et siseneda muutmisrežiimi, kus saate vidinaid lohistada ja neid 12-veerulises ruudustikus suurust muuta. Paigutuse muudatused salvestatakse automaatselt. Vidinа pealkirjad on redigeeritavad reas vidinа päisest.

## Vahemällu salvestamine ja värskendamine

Iga vidin salvestab oma viimati arvutatud andmed serveris vahemällu konfigureeritava eluea (TTL) jooksul. Kuni vahemälu on värske, teenindab töölaua uuesti avamine salvestatud tulemust workflow uuesti käivitamise asemel. Vahemälu asendatakse kohapeal iga kord, kui andmed ümber arvutatakse (üks vahemälu vidinа kohta, pluss üks kirje kohta [üksikasjade lehel](#detail-pages)), ja see tühistatakse automaatselt, kui muudate vidinа workflow'd.

Kasutage vidinа nuppu **Värskenda** (või tööriistariba **Värskenda**), et vahemälu vahele jätta ja kohe ümber arvutada.
## Jagamine

Omanikud jagavad armatuurlauda selle seadetest, kas üksikutele kasutajatele (e-posti järgi) või mis tahes [tiimile](teams-tab.md), kuhu nad kuuluvad. Iga jagamine on **Read** või **Write**; kui kellelgi on nii isiklik kui ka tiimi jagamine, kehtib tugevam neist.

| Toiming | Omanik | Write | Read |
|--------|:-----:|:-----:|:----:|
| Vidinatega tutvumine, nende värskendamine, automaatse värskendamise kasutamine | ✓ | ✓ | ✓ |
| Üksikasjade lehtede avamine, käivitusvidinate käivitamine | ✓ | ✓ | ✓ |
| Vidinate lisamine, kloonimine, kustutamine, ümbernimetamine ja suuruse muutmine; AI genereerimine ja peenhäälestamine; kontrollnimekirja üksuste märkimine | ✓ | ✓ | |
| Vidina workflow avamine redaktoris | ✓ | ✓ | |
| Armatuurlaua ümbernimetamine või kustutamine, kirjevormingu määramine, jagamise haldamine | ✓ | | |

**Vidinad töötavad alati armatuurlaua omanikuna.** Olenemata sellest, kes vaatab, kasutab vidin omaniku mandaate ja globaalseid muutujaid ning selle käivitused ilmuvad omaniku käivituste ajalukku ja jälgedesse. Seetõttu näevad tiimikaaslased samu andmeid ilma juurdepääsuta nende taga olevatele kontodele ning iga vaataja jagab iga vidina kohta üht vahemällu salvestatud tulemust. Vidinad, mille write-õigusega kaastöötaja lisab või kloonib, kuuluvad samuti omanikule.

Seetõttu kannab **Write** sama usaldust nagu workflow' jagamine redigeerimiseks: write-õigusega kaastöötaja saab muuta seda, mis töötab Teie mandaatidega. Andke see ainult inimestele, kellel lubaksite oma workflow'sid redigeerida. Testkäivitus, mille kaastöötaja käivitab workflow redaktorist, kasutab nende endi mandaate, nagu iga jagatud workflow puhul; ainult armatuurlaud ise töötab omanikuna. **Read** ei anna juurdepääsu vidina workflow'dele ning kirjutuskaitsega vaatajad saavad diagrammi enda, kuid mitte selle taga olevaid sõlmede kaupa käivituse üksikasju.

Jagamise eemaldamine või selle alandamine write'ilt read'ile jõustub kohe.

## Seotud

- [Chart Output node](../nodes/chart-output-node.md)
- [Analytics tab](analytics-tab.md) — sisseehitatud käivituste mõõdikud (erinevad kasutaja loodud armatuurlaudades)
