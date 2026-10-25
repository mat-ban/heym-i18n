# Značajke Platna

Uređivač workflow-a pruža nekoliko značajki za otklanjanje pogrešaka, testiranje i organiziranje čvorova: **Pokreni do čvora**, **AI na čvoru**, **Podaci Pin**, **Izvršni dnevnici**, **Omogući/Onemogući** i **Izvuci u pod-workflow**.

<video src="/features/showcase/editor.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/editor.webm">▶ Pogledajte demo uređivača</a></p>

## Pokreni do čvora

Pređite mišem preko bilo kojeg čvora osim ljepljive bilješke i kliknite **Pokreni** ispod njega. Heym izvršava taj čvor i njegove uzvodne ovisnosti, ostavljajući nizvodne čvorove i nepovezane grane netaknutima. Ovo koristi testni način rada platna, uključujući pinovane izlaze i normalne uvjete grane workflow-a.

Ako odabrani put ima ulazna polja, desna **Pokreni** ploča se otvara i fokusira prvo polje. Unesite vrijednosti, a zatim kliknite **Pokreni do _naziv čvora_** ili pritisnite **Ctrl+Enter** (Cmd+Enter na macOS-u). Opći način rada tijela fokusira uređivač JSON tijela. Putovi bez ulaznih polja izvršavaju se odmah bez otvaranja ploče. Pinovani Input čvorovi ponovo koriste svoj pinovani izlaz bez traženja ulaza.

Ploča zadržava odabrani cilj za sljedeća izvršavanja. Odaberite **Pokreni cijeli workflow** kako biste očistili cilj. Gumbi za pokretanje su onemogućeni dok je izvršavanje aktivno. Cilj unutar petlje zaustavlja izvršavanje kada se taj čvor prvi put dosegne; odabir čvora nakon petlje izvršava cijelu uzvodnu petlju.

## AI na čvoru

Prijeđite mišem preko bilo kojeg čvora osim ljepljive bilješke i kliknite **AI** iznad njega. [AI Assistant](./ai-assistant.md) otvara se na tom čvoru i nudi **Change this node as ...**, **Fix error in this node ...** i **Other**. U načinu Agent pomoćnik mijenja samo taj čvor; drugi čvorovi, veze i izgled ostaju nepromijenjeni. Pogledajte [AI Assistant › Izmjena jednog čvora](./ai-assistant.md#changing-one-node).

Gumb je skriven na workflowima koje možete samo pregledavati.

## Podaci Pin

Podaci Pin omogućuju vam da pinujete izlaz čvora iz posljednjeg izvršavanja kako biste mogli testirati nizvodne čvorove bez ponovnog izvršavanja pinovanog čvora.

### Gdje ga pronaći

- **Panel svojstava** – Odaberite čvor i pomaknite se do odjeljka **Pinovani podaci**
- **Oznaka čvora** – Ikona pin-a pojavljuje se na čvoru kada su podaci pinovani

### Radnje

| Radnja | Opis |
|--------|-------------|
| **Pin** | Pinira izlaz posljednjeg izvršavanja čvora (dostupno nakon izvršavanja) |
| **Očisti** | Uklanja pinirane podatke |
| **Uredi** | Uredite pinirani JSON izravno; kliknite Spremi za primjenu |

### Ponašanje u testnom načinu rada

Kada se workflow izvršava u testnom načinu rada, čvorovi s `pinnedData` preskoče izvršavanje i koriste pinirani izlaz umjesto toga. Koristite ovo za:

- Testiranje nizvodne logike bez pozivanja vanjskih API-ja
- Otklanjanje pogrešaka u izrazima koji se odnose na izlaz čvora
- Iteriranje na promptima ili uvjetima s fiksnim uzorkom podataka

Dovršavanje izraza u uređivaču koristi pinirane podatke kada su dostupni za predlaganje polja.

## Izvršni dnevnici

**Debug panel** (donja ladica) prikazuje dnevnike izvršavanja u stvarnom vremenu tijekom izvršavanja workflow-a. Također možete otvoriti aktivno izvršavanje produkcije iz dijaloga Povijest ili kartice Odbora. Uređivač se povezuje na SSE stream tog izvršavanja, obnavlja rezultate završenih čvorova i nastavlja prikazivati animacije čvorova i dnevnike dok novi čvorovi započinju i završavaju.

### Što prikazuje

- **Rezultati čvora** – Status po čvoru (`uspjeh`, `pogreška`, `preskočeno`, `izvršava se`), vrijeme izvršavanja i izlaz
- **Završni izlazi** – Agregirani izlazi iz [Output](../nodes/output-node.md) čvorova
- **Napredak agenta** – Za [Agent](../nodes/agent-node.md) čvorove, korak po korak pozivi alata i razlozi

### Radnje

- **Kopiraj kao JSON** – Kopira cijeli dnevnik izvršavanja u međuspremnik
- **Otvorite u JSON uređivaču** – Otvara dnevnik u JSON Hero ili JSON Editor Online za inspekciju
- **Preuzmi generirane datoteke** – Ako je vještina proizvela preuzimajuće datoteke (`_generated_files`), pojavljuje se gumb za preuzimanje. Preuzimanje jedne datoteke ide izravno; više datoteka otvara prozor za odabir.

### Razlikovanje od kartice Dnevnici

Debug panel prikazuje dnevnike **izvršavanja workflow-a** (rezultati čvorova, izlazi). [Kartica Dnevnici](../tabs/logs-tab.md) prikazuje dnevnike **Docker kontejnera** (backend, frontend, baza podataka). <!-- pragma: allowlist secret -->

## Omogući / Onemogući

Možete onemogućiti čvorove tako da se preskoče tijekom izvršavanja. Onemogućeni čvorovi prikazuju oznaku "isključeno" i pojavljuju se zamagljeno.

### Kako prebaciti

| Metoda | Opis |
|--------|-------------|
| **Panel svojstava** | Odaberite čvor → Ikona napajanja (gore desno) |
| **Kontextualni izbornik** | Desni klik na čvor(ove) → Onemogući ili Omogući |
| **Tipkovnica** | Odaberite čvor(ove) → pritisnite **D** (vidi [Prečaci na tipkovnici](./keyboard-shortcuts.md)) |

### Višestruki odabir

Kada su odabrani višestruki čvorovi, Omogući/Onemogući primjenjuje se na sve njih. Kontextualni izbornik prikazuje "Omogući" ako je bilo koji odabrani čvor onemogućen, "Onemogući" ako su svi omogućeni.

### Ponašanje tijekom izvršavanja

Čvorovi s `active: false` se preskoče. Nizvodni čvorovi ne primaju podatke od preskočenih čvorova. Koristite ovo za privremeno isključivanje čvorova bez brisanja.

Da biste uključili ili isključili čvor iznutra workflow-a umjesto ručno, koristite [Onemogući čvor](../nodes/disable-node.md) i [Omogući čvor](../nodes/enable-node.md).
## Graf memorije agenta

[Agent](../nodes/agent-node.md) čvorovi s **[trajnom memorijom](./agent-persistent-memory.md)** omogućenom prikazuju ružičastu **kontrolu mozga** na čvoru. Kliknite na nju kako biste otvorili uređivač grafova memorije: entiteti se prikazuju kao animirani, graf usmjeren silom grupiran prema tipu entiteta, s pretraživim izbornicima Izvor/Cilj za dodavanje odnosa i panelom veza za skakanje između povezanih entiteta. Isti dijalog uključuje **Dijeli memoriju s drugim agentima** (workflow → agent → čitanje ili čitanje/pisanje) za [dijeljenje memorije između agenata](./agent-persistent-memory.md#sharing-with-other-agents). Dok je dijalog otvoren, poništavanje/ponovno izvršavanje na glavnom platnu se odgađa kako bi uređivanje grafa zadržalo svoju vlastitu povijest.

**Filtriranje grafa.** U gornjem lijevom kutu platna nalazi se kontrola pretraživanja, svedena na gumb prečaca dok ga ne kliknete ili ne pritisnete **Ctrl/Cmd+F**. Podudara se s imenom entiteta, njegovim tipom i svakim ključem i vrijednošću atributa, kao i tipom odnosa (`parent_of`) i njegovim svojstvima; podudarajući odnos donosi oba svoja entiteta sa sobom. Svi pojmovi odvojeni razmakom moraju se podudarati. Podudarajući entitet donosi cijelu svoju okolinu sa sobom — svaki odnos u kojem sudjeluje i entitet s druge strane svakog — tako da podudaranje nikada ne ostaje kao nepovezana točka. Podudarajući odnos donosi samo dva entiteta koja spaja i tu staje, budući da je pretraživanje tipa odnosa pitanje o tom odnosu, a ne o svemu čemu su njegovi krajevi priključeni. Sve ostalo je potpuno skriveno — ne izblijedjelo — na platnu i u popisu **Sve veze**, a oznaka prikazuje koliko ukupnih entiteta je ostalo. **✕** unutar okvira prvo briše upit, a zatim zatvara okvir pri drugom pritisku. Escape se ponaša na isti način, iznutra prema van: briše upit, zatim zatvara okvir za pretraživanje, zatim napušta prošireni prikaz platna, i zatvara dijalog tek kada nijedno od toga nije otvoreno. Brisanje vraća puni graf sa svim entitetima na njihova prethodna mjesta.

**Postavljanje entiteta ručno.** Povlačenje entiteta učvršćuje ga na mjestu gdje ga ispustite, tako da se automatski raspored prilagođava ostatku grafa oko njega umjesto da ga vraća. Povlačenje entiteta koji ste odabrali pomiče njegove izravno povezane entitete zajedno s njim, zadržavajući oblik klastera; povlačenje bilo kojeg drugog entiteta pomiče samo taj entitet. **Uređen raspored** (gumb čarobnjaka) oslobađa svaki učvršćeni entitet i ponovno pokreće automatski raspored.

## Izdvoji u pod-workflow

Pretvorite odabrane čvorove u ponovo upotrebljiv pod-workflow i zamijenite ih s [Execute](../nodes/execute-node.md) čvorom.

### Kako koristiti

1. Odaberite jedan ili više čvorova na platnu
2. Desni klik → **Izdvoji u pod-workflow**
3. Unesite naziv (i opcionalni opis) za novi workflow
4. Kliknite **Izdvoji**

### Što se događa

- Novi workflow se stvara s odabranim čvorovima
- Vanjski ulazi (veze izvan odabira) postaju [Input](../nodes/input-node.md) polja pod-workflowa
- Vanjski izlazi (veze do čvorova izvan odabira) mapiraju se na [Output](../nodes/output-node.md) pod-workflowa
- Odabrani čvorovi zamjenjuju se jednim [Execute](../nodes/execute-node.md) čvorom koji poziva novi workflow
- Mappings ulaza/izlaza se automatski čuvaju

### Primjeri korištenja

- Ponovno upotrijebite niz čvorova u više workflows
- P pojednostavite složeni workflow grupiranjem povezanih logika
- Kreirajte modularne, testabilne pod-workflows

## Pokreni s cURL

Gumb **cURL** u alatnoj traci uređivača (gore desno) otvara dijalog za izradu i kopiranje cURL naredbe za aktiviranje workflowa putem API-ja.

- Odaberite način tijela zahtjeva workflowa (`Defined` ili `Generic`)
- Postavite tip autentifikacije (Anonimno, JWT ili Header Auth)
- Konfigurirajte predmemoriju odgovora i ograničenje brzine
- Uključite SSE streaming i prilagodite poruke za početak po čvoru
- Uredite tijelo zahtjeva
- U Generic modu, panel za pokretanje platna koristi isto sirovo JSON tijelo kao cURL dijalog
- Kliknite **Kopiraj cURL** kako biste kopirali naredbu spremnu za pokretanje

Pogledajte [Webhooks](./webhooks.md#run-with-curl-dialog) za potpune detalje dijaloga i [SSE Streaming](./sse-streaming.md) za protokol događaja.

## Povezano

- [Prečaci na tipkovnici](./keyboard-shortcuts.md) – Svi prečaci za platno i uređivač
- [Trajna memorija agenta](./agent-persistent-memory.md) – Ponašanje grafova memorije i API
- [Execute Node](../nodes/execute-node.md) – Poziva pod-workflows
- [Expression DSL](./expression-dsl.md) – Reference i učvršćeni podaci
- [Struktura workflowa](./workflow-structure.md) – Format čvora i veze
- [Preuzimanje i uvoz](./download-import.md) – Izvoz i uvoz workflows kao JSON
- [Tipovi čvorova](./node-types.md) – Svi tipovi čvorova
- [Zapisnici](../tabs/logs-tab.md) – Zapisnici Docker kontejnera
- [Povijest izvršenja](./execution-history.md) – Prošli radovi
- [Predlošci](../tabs/templates-tab.md) – Spremite i ponovo upotrijebite workflows i čvorove
- [Kontekstualna izložba](./contextual-showcase.md) – Kompaktni vodič dostupan u uređivaču

- [Suradnja na Platnu](./canvas-collaboration.md): Live editing on a shared draft with pointers, following, and voice.
