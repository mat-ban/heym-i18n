# Zavihek Workflows

Zavihek **Workflows** je privzeti pogled nadzorne plošče. Prikazuje seznam vaših workflow-ov, strukturo map in vam omogoča ustvarjanje, urejanje ter organizacijo workflow-ov.

<video src="/features/showcase/workflows.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/workflows.webm">▶ Oglejte si predstavitev Workflows</a></p>

## Začnite Chat

Nad seznamom workflow-ov se nahaja klepetalnica, ki vas pozdravi po imenu in vpraša, kaj želite avtomatizirati. Vnesite prompt, po želji pripnite datoteko in izberite poverilnico ter model, ki ju želite uporabiti. Obe spustni meniji sta iskalni in se začenjata z vašimi [privzetimi nastavitvami AI](../reference/user-settings.md).

Pošiljanje ustvari nov pogovor in ga odpre v [zavihku Chat](./chat-tab.md), kjer se odgovor prenaša. Podprte priponke so besedilne datoteke, slike in PDF-ji, ena na sporočilo, enako kot pri sestavljalniku klepeta.

Če še nimate LLM poverilnice, se v polju prikaže povezava do [zavihka Poverilnice](./credentials-tab.md) in pošiljanje ostane onemogočeno.

Kliknite **x**, da skrijete polje. Ob tem se ob naslovu Workflows prikaže gumb **Ask AI**, ki ga ponovno prikaže. Izbira se zapomni v vašem brskalniku.

## Seznam Workflow-ov

Seznam je prikazan v dveh delih: workflow-i in mape na levi, predogled izbranega workflow-a na desni.

- Vsaka vrstica prikazuje ikono workflow-a, ime, opis, kdaj je bil nazadnje posodobljen, in [statusno oznako](#workflow-status)
- Workflow-i so lahko v korenu ali znotraj map, pripeti workflow-i pa se prikažejo v svoji skupini **Pinned** na vrhu
- **Kliknite** vrstico, da jo izberete in naložite njen predogled na desni
- **Dvakrat kliknite** vrstico ali pritisnite **Enter**, ko je osredotočena, da jo odprete v [urejevalniku](../getting-started/quick-start.md)
- Uporabite **Ctrl+klik** (ali **Cmd+klik**), da odprete v novem zavihku
- Vsaka vrstica vsebuje dejanja za urejanje, kopiranje, pripenjanje in brisanje na desni. Na telefonih so ta dejanja skrita, da ime ohrani polno širino; **dolgo pritisnite** vrstico tam, da odprete seznam dejanj
- Pripnite pogosto uporabljene workflow-e v [Hitrem predalu](../reference/quick-drawer.md), da jih lahko hitro zaženete iz zavihka Workflows in drugih notranjih strani

## Predogled Workflow-a

Izbira workflow-a napolni predogledno ploščo ob seznamu. Na zaslonih, širših od 1280px, se ista plošča odpre kot list iz spodnjega dela zaslona.

Plošča prikazuje:

- Ime workflow-a, kdo ga je ustvaril in kdaj, ter kdaj je bil nazadnje urejen
- **Odpri Workflow** – odpre workflow v urejevalniku
- **Zaženi zdaj** – odpre workflow v [Hitrem predalu](../reference/quick-drawer.md), kjer izpolnite njegove vnose in začnete zagon, ne da bi zapustili seznam
- **Opis** – opis workflow-a
- **Konfiguracija Triggerja** – urnik za cron workflow ali trigger, ki posluša za dogodek. Workflow-i, ki se aktivirajo preko HTTP, prikazujejo gumb **Copy cURL** namesto surovega endpoint-a in avtentikacijskega besedila: kopira celotno zahtevo z ustreznim URL-jem, glavo, mestom za avtentikacijo in telesom, zgrajenim iz vhodnih polj workflow-a. Ko workflow objavi [portal](../reference/portal.md), se tukaj prikaže tudi njegov javni povezava za klepet
- **Podrobnosti zadnjega zagona** – izid in trajanje najnovejšega zagona ali opomba, da workflow še nikoli ni bil zagnan
- **Koraki workflow-a in pod-agenti** – vozlišča v vrstnem redu izvajanja, vsako z njegovim modelom, operacijo ali urnikom ter piko, ki prikazuje, ali je aktivno. Izbira koraka odpre to vozlišče v urejevalniku z že odprto ploščo lastnosti

Plošča ostane pritrjena ob seznamu, medtem ko se pomikate, tako da ostane berljiva v dolgem seznamu workflow-ov.
## Upravljanje Instanc

Računi, navedeni v `HEYM_ADMIN_EMAILS`, lahko na instanci naštejejo, odprejo, uredijo, pregledajo zgodovino izvajanja in izbrišejo kateri koli workflow brez prenosa lastništva ali deljenja. Nastavitev je seznam e-poštnih naslovov, ločenih z vejicami, ki se ujema brez upoštevanja velikosti črk. Prazn seznam ne daje dostopa nikomur. Po spremembi je potrebno ponovno zagnati backend.

Administratorji vidijo e-poštni naslov lastnika v seznamu workflow in lahko iščejo po tem naslovu. Izberite workflow, da odprete **Upravljanje instanc** v njegovem predogledu:

1. **Pauziraj sprožilce** je prikazano le za workflow, ki vsebuje Cron vozlišče. Onemogoči Cron in druge avtomatske sprožilce workflow preko običajnega shranjevanja različice. Obstoječi procesi se lahko zaključijo. Ročni, API, portal in klici pod-workflow ostanejo na voljo; ta ukrep ni zaklepanje izvajanja celotnega workflow.
2. Gumb se spremeni v **Nadaljuj sprožilce**, medtem ko je workflow pauziran, vključno po ponovnem nalaganju strani. Nadaljuj ponovno omogoči sprožilce, ki jih je pauziral administrator, in pusti sprožilce, ki so bili že onemogočeni, nespremenjene. Za starejše pauzirane workflow brez shranjenega stanja pauze administratorja, Nadaljuj omogoči njihove avtomatske sprožilce.
3. Uporabite dejanje **Izbriši workflow** v vrstici workflow, ko so se procesi umirili. Izbris vrne konflikt, medtem ko so procesi v teku, v čakalni vrsti ali čakajo na pregled. Načrtovani izbris uporablja enako preverjanje.

Pauzirajte sprožilce in pustite, da se obstoječi procesi zaključijo, preden izbrišete. Sprožilec, ki je bil že poslan, ko je bil pauziran, se lahko še vedno zaključi. Uporabite izbris, ko workflow ne sme več biti klican.

Skrivnosti in nastavitve overjanja za webhook, ki so namenjene samo lastniku, ohranjajo svoje obstoječe zaščite. Upravljanje ne prenese lastništva ali deli zapisov poverilnic lastnika. Administrativni ukrepi pauze, nadaljevanja, brisanja in načrtovanja se pojavijo v [revizijskem sledilcu](../reference/audit.md) z delujočim administratorjem in lastnikom workflow.

## Status Workflow

Vsaka vrstica nosi oznako statusa, ki izhaja iz sprožilnih vozlišč workflow, njegovega trenutnega stanja izvajanja in — za workflow brez sprožilnega vozlišča — kako je bilo njegovo zadnje izvajanje začeto:

| Status | Pomen |
| --- | --- |
| **V teku** | Workflow ima trenutno izvajanje v teku |
| **Načrtovano** | Ima aktiven [cron](../nodes/cron-node.md) sprožilec |
| **Posluša** | Ima aktiven sprožilec dogodkov, kot je Slack, Telegram, IMAP ali WebSocket sprožilec |
| **Pauzirano** | Ima sprožilna vozlišča, vendar so vsa onemogočena |
| **API** | Nima sprožilnih vozlišč in je bilo zadnjič zagnano z HTTP klicem na svoj izvršni endpoint |
| **SubWorker** | Nima sprožilnih vozlišč in je bilo zadnjič zagnano kot pod-workflow s strani nadrejenega workflow |
| **Portal** | Nima sprožilnih vozlišč in je bilo zadnjič zagnano iz svojega [portala](../reference/portal.md) |
| **WEB** | Nima sprožilnih vozlišč in je njegov edini terminal [HTML output mapper](../nodes/html-output-mapper-node.md), tako da klic vrne prikazano spletno stran |
| **Ročno** | Nima sprožilnih vozlišč in nikoli ni bilo zagnano, ali pa je bilo njegovo zadnje izvajanje iz drugega vira |
| **Odstrani načrtovano** | Je [načrtovano za izbris](../reference/workflow-organization.md) |

Oznake API, SubWorker in Portal preberejo enega najnovejših vnosov v [zgodovini izvajanja](./logs-tab.md) workflow, tako da workflow, ki je klican na dva načina, pokaže tistega, ki je prišel zadnji. **WEB** se odloči iz grafa, zato ima prednost pred temi tremi: workflow, ki služi strani, prebere WEB, tudi ko je bil klican preko HTTP. Sprožilna vozlišča vedno prevladajo nad vsemi njimi: cron workflow, ki ga nekdo tudi kliče preko HTTP, ostane **Načrtovano**.

Uporabite spustni meni **Status** poleg iskalnega polja, da prikažete le en status. Spustni meni navaja, koliko workflow trenutno ustreza vsakemu. Filter statusa se razteza tudi v mape: mape z ujemanjem se samodejno razširijo, mape brez ujemanja pa so skrite, dokler ne počistite filtra.

## Aktivni Workflows

Na namizju krožna oznaka v zgornji orodni vrstici prikazuje, koliko workflow trenutno teče, in se samodejno osveži vsakih 10 sekund. Kliknite oznako, ki ni ničelna, da odprete seznam aktivnih workflow, ki prikazuje do štiri vrstice, preden se začne pomikanje. Izberite ime workflow, da povežete urejevalnik s trenutnim videnjem izvajanja. Oznaka nič je informativna in je ne morete odpreti, oznaka pa je skrita na mobilnih zaslonih.

## Iskanje

Uporabite iskalno polje workflow poleg **Status**, ali pritisnite **Ctrl+F** (ali **Cmd+F**), da filtrirate workflow po naslovu ali opisu. Ujemajoči workflow znotraj map so prikazani z razširjenimi vejami svojih map. Pritisnite **Escape**, da počistite iskanje.
## Mape

- Organizirajte workflows v [mape in podmape](../reference/workflow-organization.md).
- Ustvarite mape s pomočjo gumba **Nova mapa**, vsaki dodelite ime in opcijski opis, ki se prikaže pod imenom v seznamu.
- Vsaka vrstica mape prikazuje, koliko workflows vsebuje, vključno s podmapami, poleg dejanj za novo-podmapo, preimenovanje, spremembo ikone, prenos kot ZIP in izbris. Na telefonih vrstica prikazuje samo en gumb menija.
- Povlecite workflow nad mapo ali podmapo, da vidite predogled cilja v velikosti kartice. 
  Osvetljen predogled prikazuje celotno pot do mape, preden spustite, in lebdeča podmapa se kratko razširi, da lahko dosežete gnezdene mape.
- Povlecite workflows med mapami ali na koren. Povlečena kartica ostane vidna kot duh, aktivna destinacija pa ostaja osvetljena med pomikanjem.
- Spustitev workflow nazaj v trenutno mapo je onemogočena in označena kot **Že v mapi**.
- Preimenujte mapo ali spremenite njen opis preko dejanja preimenovanja ali kontekstnega menija z desnim klikom.

## Ustvarjanje Workflows

1. Kliknite **Nov Workflow**.
2. Vnesite ime in opcijski opis.
3. Workflow se odpre v urejevalniku.

## Uvoz

Povlecite in spustite datoteko JSON workflow na območje workflow, da ustvarite nov workflow. Uvoženi vozli in robovi se uporabijo za ustvarjanje workflow; ime prihaja iz polja `name` v JSON ali iz imena datoteke. Oglejte si [Prenos in uvoz](../reference/download-import.md) za format JSON in možnosti uvoza.

## Deljenje

Odprite workflow v urejevalniku in kliknite **Deli**, da povabite uporabnike po elektronski pošti ali delite s [timom](./teams-tab.md). Izberite **Branje** (ogled in izvajanje) ali **Pisanje** (tudi urejanje) za vsakega uporabnika ali tim, in to spremenite kasneje iz spustnega menija poleg vnosa. Poverilnice in pod-workflows se ne delijo samodejno; delite jih ločeno z istimi uporabniki ali timi. Oglejte si [Organizacija Workflow](../reference/workflow-organization.md#sharing-workflows) in [Deljenje Poverilnic](../reference/credentials-sharing.md).

## Urejanje in brisanje

- **Uredi** – Spremenite ime in opis workflow iz dejanja za urejanje v vrstici.
- **Izbriši** – Workflows so [načrtovani za izbris](../reference/workflow-organization.md); premaknejo se v območje za smeti pred trajnim odstranjevanjem.

## Hkratna Urejanja

Shranjevanje pošlje revizijo, na kateri temeljijo vaše spremembe, in strežnik zavrne pisanje, če se je workflow v tem času spremenil — na primer, ker ga je soigralec shranil ali ste pustili isti workflow odprt v drugem zavihku. Heym nato prikaže dialog **Zaznan zastarel workflow** z dvema možnostma:

- **Prekliči** – Održi vaše neshranjene spremembe v urejevalniku, da jih lahko naložite v drugem zavihku in jih uskladite.
- **Prepiši** – Shrani kljub temu, da nadomesti različico druge osebe.

**Zagon** workflow najprej shrani, tako da gre skozi isto preverjanje. Če se je workflow spremenil, se zagon ustavi na dialogu namesto da bi tiho prepisal: **Prepiši in zaženi** shrani vašo različico in začne zagon, **Prekliči zagon** opusti oboje in pusti vaše spremembe nedotaknjene.

Preverjanje je del samega zahtevka za shranjevanje, zato ne stane dodatnega kroga in ni okna, v katerem bi lahko shranjevanje ušlo mimo njega. Vaše lastne spremembe iz drugih delov aplikacije — preimenovanje, sprememba nastavitev, preklop na plošči lastnosti — nikoli ne štejejo kot konflikt.

## Ukazna Paleta

Pritisnite **Ctrl+K** (ali **Cmd+K**), da odprete ukazno paleto. Lahko:
- Iščete workflows po imenu.
- Preskočite na katerikoli [zavihek nadzorne plošče](./credentials-tab.md).
- Odprete nedavne workflows.

## Sorodno

- [Hitra začetna stran](../getting-started/quick-start.md) – Zgradite svoj prvi workflow.
- [Organizacija Workflow](../reference/workflow-organization.md) – Mape, podmape in načrtovani izbris.
- [Struktura Workflow](../reference/workflow-structure.md) – JSON format za workflows.
- [Prenos in uvoz](../reference/download-import.md) – Izvoz in uvoz workflows kot JSON.
- [Portal](../reference/portal.md) – Izpostavite workflows kot javne chat UI.
- [Tabla](./board-tab.md) – Zaženi workflows iz kanban kartic preko verig stolpcev.
- [Osnovni koncepti](../getting-started/core-concepts.md) – Workflows, vozli in izvajanje.
- [Zgodovina izvajanja](../reference/execution-history.md) – Ogled preteklih zagonov in prinesite na Platno.
- [Hitra predal](../reference/quick-drawer.md) – Pripnite in zaženite workflows iz nadzorne plošče, dokumentov in drugih strani, ki niso urejevalnik.
- [Kontekstualna predstavitev](../reference/contextual-showcase.md) – Kratek vodnik po straneh nadzorne plošče.
