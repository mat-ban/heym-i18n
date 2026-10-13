# Nadzorna ploča

Zavičajna kartica **Nadzorna ploča** je prostor u stilu Grafane gdje gradite mreže widgeta s grafikonima. Svaki widget se prikazuje iz izlaza vlastitog skrivenog Heym workflow-a, tako da svi podaci koje možete proizvesti u workflow-u — upiti prema bazi podataka, API pozivi, RAG pretraživanja, LLM izlazi — mogu postati grafikon. Možete zadržati nekoliko nadzornih ploča i dijeliti svaku s osobama ili timovima.

## Nadzorne ploče

Svi započinju s jednom nadzornom pločom, koja se stvara prvi put kada otvorite karticu. Koristite odabir nadzorne ploče na vrhu kartice za prebacivanje između nadzornih ploča, a **+** pored njega za stvaranje nove. Odabir prvo prikazuje vaše vlastite nadzorne ploče, a zatim one koje su s vama dijeljene, označene imenom osobe koja ih je podijelila.

Kartica ponovno otvara nadzornu ploču koju ste posljednji put koristili, a adresa u adresnoj traci nosi otvorenu nadzornu ploču (`?tab=dashboard&dashboard=<id>`), tako da poveznica otvara tu točnu nadzornu ploču za svakoga tko ima pristup.

Gumb za postavke (samo za vlasnike) preimenuje nadzornu ploču, postavlja koje zapise prihvaća kao [stranica s pojedinostima](#detail-pages), upravlja dijeljenjem i briše je. Brisanje nadzorne ploče uklanja njezine widgete i njihove workflow-e. Uvijek zadržavate barem jednu vlastitu nadzornu ploču, tako da se posljednja ne može izbrisati.

## Widgeti

Widget je jedan grafikon na mreži. Podržani tipovi grafikona:

- **Bar** (vertikalni ili horizontalni)
- **Line**
- **Area** (ispunjeni trend, podržava više serija)
- **Pie**
- **Table** (pomicanje; jedan stupac može se prikazati kao [oznake statusa](../nodes/chart-output-node.md#status-chips), a redci mogu otvoriti [stranicu s pojedinostima](#detail-pages))
- **Numeric** (jedna KPI vrijednost s opcionalnom jedinicom)
- **Gauge** (jedna vrijednost u odnosu na min–max raspon, npr. postotak)
- **Scatter** (X/Y točke za korelacijske grafikone)
- **Proportion** (jedna traka podijeljena na dijelove s postotnom legendom, npr. raspodjela jezika)
- **Bar gauge** (jedan horizontalni mjerač po redu s crvenom→zelenom gradijentom i vrijednošću, npr. slobodni prostor na disku)
- **Text** (markdown poruka, npr. statusna napomena poput "Posljednje izvršavanje u 19:47"; podržava [interaktivne potvrdne okvire](../nodes/chart-output-node.md#interactive-task-lists) kada je markdown statičan, i [izričite numerirane popise](../nodes/chart-output-node.md#numbered-lists) za prilagođeno ili silazno numeriranje)
- **HITL** (vaši neodgovoreni ljudski pregledi. Naslov prikazuje `1/n pending`. Ime workflow-a otvara tu izvedbu na platnu. **Odobri**, **Zatraži promjene** i **Odbij** rješavaju to. Ikona povijesti pored naslova widgeta otvara tu izvedbu u dijalogu povijesti na ovoj stranici. Widget ne koristi uzvodne redove, a svaka osoba vidi svoju vlastitu čekajuću listu)

Osim grafikona, widget **Run a workflow** pokreće jedan od vaših workflowa s nadzorne ploče: na ispuštenoj datoteci, sa svojim poljima za unos ili pomoću gumba Run; pogledajte [Widgeti za pokretanje](#run-widgets).

Svaki widget učitava svoje podatke asinkrono kada otvorite karticu, tako da stranica ostaje responzivna dok se grafikoni popunjavaju.

## Dodavanje widgeta

1. Kliknite **Dodaj widget**, dajte mu naslov i odaberite tip grafikona. Ispod odabira, dijalog prikazuje primjer tog tipa grafikona s uzorkom podataka i imenuje redove koje očekuje, tako da možete usporediti tipove prije nego što izradite bilo što.
2. Widget se otvara u uređivaču workflow-a s početnim grafom: [Set](../nodes/set-node.md) čvor koji proizvodi redove, povezan s [Chart Output](../nodes/chart-output-node.md) čvorom. Zamijenite Set čvor s bilo kojim izvorom podataka. **HITL** widget je samo Chart Output čvor; čita vaše neodgovorene preglede i ne treba izvor podataka.
3. Izradite workflow tako da čvor koji napaja **Chart Output** proizvodi niz redova, a zatim konfigurirajte mapiranje polja Chart Output čvora (polje oznake, polje vrijednosti itd.).
4. Spremite, vratite se na karticu Nadzorna ploča, i widget se prikazuje.

Za widget **Run a workflow** umjesto toga odaberite workflow koji on pokreće; izbornik navodi kako će widget pokrenuti svaki od njih. Widget se dodaje izravno u mrežu; nema novog workflowa za izgradnju.

Dvaput kliknite na widget (ili koristite njegov gumb za uređivanje) kako biste ponovno otvorili njegov workflow u bilo kojem trenutku. Koristite **Kloniraj widget** u zaglavlju widgeta za dupliciranje i widgeta i njegovog kompletnog workflow-a. Kopija se postavlja ispod originala i označena je s **(Kopija)** kako biste je mogli neovisno uređivati.

## Stranice s pojedinostima

Tablični widget može povezati svoje retke s drugom nadzornom pločom, koja tada radi kao stranica s pojedinostima: jedna nadzorna ploča koja služi svakom kupcu, računu ili zahtjevu (ticketu).

1. Otvorite **Settings** tabličnog widgeta i odaberite nadzornu ploču pod **Row link**.
2. Unesite **Record column**, stupac čija vrijednost identificira redak (na primjer `id`), i opcionalno **Label column** koji ga imenuje (na primjer `name`).
3. Spremite. Klikom na redak (ili fokusiranjem i pritiskom na Enter) otvara se povezana nadzorna ploča s `?record=<value>&label=<name>`.

Na nadzornoj ploči s pojedinostima svaki workflow widgeta čita vrijednost kao `$page.record` (pogledajte [Chart Output](../nodes/chart-output-node.md#detail-pages-pagerecord)), a stranica prikazuje `Dashboard / <label>` iznad mreže s gumbom za brisanje zapisa. Natrag vraća na tablicu s koje ste došli.

- **Tko je može otvoriti.** Redci su klikabilni samo za gledatelje koji mogu otvoriti povezanu nadzornu ploču. Ostali vide istu tablicu bez poveznica.
- **Format zapisa.** Zapis dolazi iz URL-a, pa nadzorna ploča s pojedinostima odlučuje što prihvaća. U njezinim postavkama **Detail page records** je jedno od sljedećeg: ID-ovi (slova, znamenke, `-`, `_` i `.`, do 128 znakova; zadano), brojevi, UUID-ovi ili adrese e-pošte. Svaka druga vrijednost odbija se prije pokretanja widgeta, a widgeti prikazuju "This page does not accept that record".
- **I dalje se izvršava kao vlasnik.** Widgeti se i na stranici s pojedinostima izvršavaju kao vlasnik nadzorne ploče. Graditelji bi trebali prosljeđivati `$page.record` samo tamo gdje ga čvor escapa, nikada izravno u tekst upita.
- **Keširanje.** Svaki widget kešira svoj grafikon po zapisu, za isto vrijeme trajanja (TTL) kao i sam widget, te čuva 50 najčešće korištenih zapisa.

## Widgeti za pokretanje

Widget **Run a workflow** pokreće jedan od vaših workflowa i prikazuje rezultat: status, vrijeme izvođenja i izlaze. Što prikazuje ovisi o tome što workflow prima:

- **Datoteka.** Za workflow koji počinje čvorom [File Upload Trigger](../nodes/file-upload-trigger-node.md), ispustite datoteku na njega (ili kliknite za odabir) i widget je prenosi putem jednokratne poveznice za prijenos tog triggera. Widget prikazuje vrste i veličinu datoteka koje trigger prihvaća te odbija ostale prije prijenosa. Kada workflow također počinje čvorom Text Input, widget prikazuje njegova polja pokraj zone za ispuštanje: odaberite datoteku, ispunite polja i **Run** šalje oboje. Vrijednosti putuju s poveznicom za prijenos koju widget generira, tako da ih dijeljena poveznica za prijenos ne može postaviti.
- **Polja za unos.** Za workflow koji počinje čvorom Text Input, widget prikazuje njegova polja sa zadanim vrijednostima; **Run** pokreće workflow s vašim vrijednostima. Vrijednosti za polja koja workflow nema se odbacuju.
- **Ništa.** Workflow bez ulaza dobiva gumb **Run**.

Gumb **Wrap** u rezultatu prelama duge retke izlaza unutar okvira; isključite ga za čitanje JSON rasporeda izlaza.

- Svatko tko može otvoriti nadzornu ploču može pokrenuti widget, baš kao što svatko može osvježiti grafikon. Pristup workflowu pripada vlasniku nadzorne ploče: dodavanje widgeta zahtijeva workflow koji i vi i vlasnik možete pokrenuti, a samo izvođenje koristi vjerodajnice vlasnika workflowa, kao i svaka poveznica za prijenos.
- Rezultat ostaje na vašem zaslonu dok ne napustite stranicu; drugi gledatelji ne vide vaše datoteke, vrijednosti ni rezultate. Izvođenje se pojavljuje u povijesti izvršavanja s triggerom `dashboard`.
- Dijeljenje nadzorne ploče nikada ne daje pristup samom workflowu. **Edit workflow** ga otvara osobama koje već imaju pristup, a **Fine-tune with AI** se ne nudi.
- Izvođenja s datotekama izvršavaju se na glavnoj instanci, gdje se pohranjuju prenesene datoteke, kao i svako izvođenje File Upload Triggera.

## Generiranje widgeta s AI

Kliknite **AI**, opišite metrik koji želite (na primjer, "stopa uspješnosti workflow-a u posljednjih 30 dana kao bar grafikon"), i odaberite LLM vjerodajnicu i model. Heym generira potpuni workflow widgeta koji završava u Chart Output čvoru i dodaje ga u mrežu. Pogledajte [Chart Output](../nodes/chart-output-node.md#example-ai-prompts) za primjere upita po tipu grafikona.

Koristite gumb **Fino podešavanje s AI** widgeta za reviziju postojećeg widgeta s novom instrukcijom. Svako AI fino podešavanje snima prethodni workflow u **Povijesti uređivanja** widgeta, tako da možete pregledati ili vratiti promjene iz uređivača workflow-a.

## Uređivanje izgleda

Prebacite se na **Uredi** kako biste ušli u način uređivanja, gdje možete povlačiti widgete i mijenjati njihovu veličinu na mreži od 12 kolona. Promjene izgleda se automatski spremaju. Naslovi widgeta su uređivi izravno iz zaglavlja widgeta.

## Keširanje i osvježavanje

Svaki widget kešira svoje posljednje izračunate podatke na poslužitelju za konfigurabilno vrijeme trajanja (TTL). Dok je keš svjež, ponovno otvaranje nadzorne ploče poslužuje pohranjeni rezultat umjesto ponovnog pokretanja workflow-a. Keš se zamjenjuje na mjestu svaki put kada se podaci ponovno izračunavaju (jedan keš po widgetu, plus jedan po zapisu na [stranici s pojedinostima](#detail-pages)), a automatski se poništava kada uređujete workflow widgeta.

Koristite gumb **Osvježi** widgeta (ili **Osvježi** u alatnoj traci) kako biste zaobišli keš i odmah ponovno izračunali.
## Dijeljenje

Vlasnici dijele nadzornu ploču iz svojih postavki, s pojedinačnim korisnicima (prema e-pošti) ili s bilo kojim [timom](teams-tab.md) kojem pripadaju. Svako dijeljenje je **Čitanje** ili **Pisanje**; kada netko ima i osobno i timsko dijeljenje, primjenjuje se jače.

| Akcija | Vlasnik | Pisanje | Čitanje |
|--------|:-------:|:-------:|:-------:|
| Pregledavanje widgeta, osvježavanje, korištenje automatskog osvježavanja | ✓ | ✓ | ✓ |
| Otvaranje stranica s pojedinostima, pokretanje widgeta za pokretanje | ✓ | ✓ | ✓ |
| Dodavanje, kloniranje, brisanje, preimenovanje i promjena veličine widgeta; AI generiranje i fino podešavanje; označavanje stavki na popisu | ✓ | ✓ | |
| Otvaranje workflowa widgeta u uređivaču | ✓ | ✓ | |
| Preimenovanje ili brisanje nadzorne ploče, postavljanje formata zapisa, upravljanje dijeljenjem | ✓ | | |

**Widgeti uvijek rade kao vlasnik nadzorne ploče.** Tko god da gleda, widget koristi vjerodajnice vlasnika i globalne varijable, a njegovi radovi pojavljuju se u povijesti izvršavanja i tragovima vlasnika. Članovi tima stoga vide iste podatke bez pristupa računima iza njih, a svaki gledatelj dijeli jedan predmemorirani rezultat po widgetu. Widgeti koje dodaje ili klonira suradnik s pravima pisanja također pripadaju vlasniku.

Zbog toga **Pisanje** nosi istu razinu povjerenja kao dijeljenje workflowa za uređivanje: suradnik s pristupom za pisanje može promijeniti što se izvršava s Vašim vjerodajnicama. Dajte to samo osobama kojima biste dopustili uređivanje Vaših workflowa. Testno izvršavanje koje suradnik pokrene iz uređivača workflowa koristi njihove vlastite vjerodajnice, kao i svaki dijeljeni workflow; samo nadzorna ploča sama radi kao vlasnik. **Čitanje** ne daje pristup workflowima widgeta, a gledatelji s pravima samo za čitanje primaju sam grafikon, ali ne i detalje izvršavanja po čvorovima iza njega.

Uklanjanje dijeljenja ili smanjenje s pisanja na čitanje odmah stupa na snagu.

## Povezano

- [Chart Output node](../nodes/chart-output-node.md)
- [Analytics tab](analytics-tab.md) — ugrađene metrike izvršavanja (različite od korisnički izgrađenih nadzornih ploča)
