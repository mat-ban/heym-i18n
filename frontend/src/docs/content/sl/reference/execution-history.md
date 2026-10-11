# Zgodovina izvajanja

Zgodovina izvajanja beleži izvajanja workflow-ov: vhodne podatke, izhodne podatke, rezultate vozlišč, stanje in vir sprožilca. Uporabite jo za spremljanje aktivnega produkcijskega izvajanja, pregled preteklih izvajanj, odpravljanje napak ali ponovni zagon z istimi vhodnimi podatki preko **Prinesi na Platno**.

## Pregled

Vsako izvajanje shranjuje:

| Polje | Opis |
|-------|-------------|
| **Vhodni podatki** | Telo zahteve ali vhodni podatki za izvajanje (npr. `text` za Vhodno vozlišče) |
| **Izhodni podatki** | Izhodni podatki na ravni workflow-a |
| **Rezultati vozlišč** | Izhodni podatki, stanje in čas izvajanja za vsako vozlišče |
| **Stanje** | `success`, `error`, `pending`, `skipped` ali `failed` (glejte [Obnova po zrušitvi](#crash-recovery)) |
| **vir_sprožilca** | Kako je bilo izvajanje sproženo (glejte [Sprožilci](./triggers.md)) |

## Dostop do zgodovine

| Lokacija | Obseg |
|----------|-------|
| **Orodna vrstica** urejevalnika | Le trenutni workflow |
| **Glava** pogleda Docs | Le trenutni workflow |
| **Glava** nadzorne plošče (zavihek Chat) | Vsi workflow-i + izvajanja chat/assistant |
| **Glava** pogleda Vrednotenja | Vsi workflow-i + izvajanja chat/assistant |

Kliknite gumb **Zgodovina** (ikona ure), da odprete pogovorno okno.

## Zgodovina po workflow-u proti Vse zgodovine

- **Po workflow-u** (Urejevalnik, Docs): Prikazuje izvajanja za workflow, ki ga imate odprtega. Uporabite **Počisti zgodovino**, da odstranite izvajanja samo za ta workflow.
- **Vsa zgodovina** (Nadzorna plošča, Vrednotenja): Prikazuje izvajanja v vseh workflow-ih in sejah chat/assistant. Pokritost ustreza dostopu do workflow-ov: workflow-i, ki jih imate, workflow-i, ki so bili neposredno deljeni z vami, in workflow-i, ki so bili deljeni s skupino, kateri pripadate. Uporabite **Počisti vse zgodovine**, da odstranite vse zapise, ki jih imate. Zgodovina za deljene workflow-e bo ohranjena.

## Prinesi na Platno

**Prinesi na Platno** naloži vhodne podatke in izhodne podatke iz izbranega izvajanja v trenutni workflow.

### Kaj naloži

- **Vhodni podatki** → Plošča vhodnih podatkov (npr. `text` za Vhodno vozlišče ali prilagojena polja)
- **Rezultati vozlišč** → Plošča rezultatov izvajanja prikazuje pretekle izhode za vsako vozlišče
- **Rezultat izvajanja** → Stanje, izhodi in čas izvajanja iz izvajanja

### Obnašanje glede na kontekst

- **V Urejevalniku** (zgodovina po workflow-u): Takoj se uporabi za odprti workflow in zapre pogovorno okno.
- **Iz Vse zgodovine** (Nadzorna plošča/Vrednotenja): Navigira do urejevalnika workflow-a, nato pa uporabi podatke, ko se urejevalnik naloži. Na voljo le za izvajanja workflow-ov — ne za izvajanja chat/assistant.

### Globoka povezava za izvajanje

Odprtje workflow-a na `/workflows/{workflowId}/{executionId}` samodejno prinese to izvajanje na platno — enako kot izbira izvajanja in izbira **Prinesi na Platno**. To omogoča deljenje specifičnega preteklega izvajanja kot URL. Če izvajanja ni mogoče najti (napačen ali izbrisan id), se urejevalnik vrne na nalaganje navadnega workflow-a.

### Uporabniški primeri

- Ponovno izvajanje workflow-a z istimi vhodnimi podatki
- Odpravljanje napak pri neuspelem izvajanju z pregledom vhodnih podatkov in izhodov vozlišč
- Primerjava izhodov med izvajanjami

## Poudarki izvajanja

Po aktivnem izvajanju — ali po **Prinesi na Platno** — se v **zgornjem desnem kotu Platna** prikaže zapiralni **Poudarki izvajanja** pojavna okna. To je hiter način za ogled *kaj je vsako vozlišče proizvedlo*, navedeno od zgoraj navzdol v vrstnem redu izvajanja. Zaprite ga z **✕**; ponovno se odpre ob naslednjem izvajanju.

### Kaj je prikazano

| Zapis | Vir | Samodejno? |
|--------|--------|-------|
| **Vhod** | Vhodni parametri izvajanja (vhodni/sprožilec vozlišče) | Da |
| **Izhod** | Rezultat izhodnega vozlišča — ali, če ga ni, sporočilo zadnjega vozlišča | Da |
| **Agent / LLM** | Izhod vsakega vozlišča agenta ali LLM | Da |
| **Izhod** | Vsako drugo vozlišče z omogočeno **Poudarjanje izhoda vozlišča** | Po izbiri |

Vozlišča, ki so že samodejno poudarjena (vhod / izhod / zadnje / agent / llm), se nikoli ne prikažejo dvakrat, tudi če omogočite preklop.

### Vsak zapis

- Prikazuje `Vozlišče — sporočilo…` s prvimi **250 znaki**; kliknite vrstico, da jo razširite in prikažete **celotno sporočilo kot Markdown**, z gumbom **Kopiraj**.
- Vozlišče, ki se je izvajalo večkrat (npr. znotraj zanke), prikazuje `Vozlišče (N)` z izbirnikom `‹ i / N ›` — izberite, katero izvajanje želite ogledati; izbirnik vsakega vozlišča je neodvisen.

### Poudarjanje izhoda vozlišča

Vsako vozlišče **razen Agenta in LLM** ima potrditveno polje **Poudarjanje izhoda vozlišča** v svojem panelu lastnosti (privzeto izklopljeno). Omogočite ga, da dodate izhod tega vozlišča v pojavna okna. Na platnu se na poudarjenih vozliščih prikaže majhna ✦ oznaka. V [workflow DSL](./expression-dsl.md) je to polje podatkov vozlišča `"highlight": true` (privzeto `false`).

### Na nadzornih ploščah

Kartice pripomočkov na nadzorni plošči, ki so izvajale workflow, prikazujejo ✦ gumb **Poudarki izvajanja** v glavi kartice; kliknite ga, da odprete isto pojavna okna za izvajanje tega pripomočka, z izhodom pripomočka kot prominentnim zapisom.
## Zagon Izvajanj

Oba pogovorna okna zgodovine prikazujeta **trenutno potekajoča izvajanja** na vrhu seznama, pred preteklimi zagonami.

- Prikazani so indikator vrtenja in oznaka **Poteka**, skupaj s časom začetka.
- Kliknite **Odpri v živo**, da povežete urejevalnik s tem natančnim zagonom, ne da bi ga ponovno zagnali.
- Platno najprej obnovi vozlišča, ki so že zaključena, nato pa prejme dogodke `node_start`, `node_complete` in končne dogodke izvajanja preko SSE.
- Trenutno vozlišče utripa na platnu, spodnja vozlišča ohranjajo svojo animacijo v čakanju, in panel za odpravljanje napak dodaja vsak rezultat, ko prispe — prav tako kot zagon, ki se je začel iz urejevalnika.
- Kliknite **Prekliči**, da takoj ustavite izvajanje.
- Preklic iz katerega koli pogovornega okna (Urejevalnik ali Nadzorna plošča) prav tako zapre aktivni SSE tok v katerem koli odprtem zavihku platna za ta workflow, tako da se stanje urejevalnika čisto ponastavi.
- Po preklicu se tekoči vnos na naslednjem osveževanju izbriše; pritisnite **Osveži**, da seznam posodobite ročno.
- Če prekličete zagon, ki je že končan, je zahteva brez učinka.

Živa povezava je `/workflows/{workflowId}/{executionId}`. Opazovalec je samo za branje: zapustitev urejevalnika samo prekine to zavihko brskalnika in nikoli ne ustavi workflow. Aktivne slike se delijo preko PostgreSQL, tako da odpiranje zagona še vedno deluje, ko zahteva za sprožitev in urejevalnik prispejo na različne delavce v ozadju.

## Obnova po zrušitvi

Če se strežnik znova zažene (namestitev, ponovni zagon kontejnerja ali zrušitev), medtem ko workflow poteka, se delavec tega zagona ustavi sredi izvajanja. Heym samodejno obnovi ta prekinjena izvajanja, namesto da bi jih pustil zagozdena kot **Poteka**.

- Ob naslednjem zagonu proces izbranega vodje zazna osirotele zagon — takoj za prijazno ponovno zagon, ali v približno 60 sekundah za hudo zrušitev (ko srčni utripi jasno prenehajo).
- Obnovljena izvajanja se **ponovno izvedejo od začetka z istimi vnosi** (ne nadaljujejo se od tam, kjer so obstala), z uporabo trenutne definicije workflow. Ob zaključku zabeležijo normalen končni vnos (npr. `uspeh`), tako da zgodovina prikazuje zagon kot zaključen.
- Zagon se poskusi **ponovno izvesti enkrat**. Če je poskus obnove prav tako prekinjen — ali je bil workflow od takrat izbrisan — se vnos zabeleži kot `neuspešen`.
- To deluje enako v okviru enega kontejnerja in večdelavskih namestitev; le vodja izvaja obnovo, tako da se zagon nikoli ne obnovi dvakrat s strani različnih delavcev.

### Preklop za samodejno obnovo

Panel **Zapis izvajanja** (run) v urejevalniku ima potrditveno polje **Samodejna obnova**, **privzeto vklopljeno** za vsak workflow.

- **Vklopljeno**: prekinjena izvajanja tega workflow se ponovno izvedejo, kot je opisano zgoraj.
- **Izklopljeno**: prekinjena izvajanja se ne ponovno izvedejo in se zabeležijo s statusom `preskočeno`.

> Zagon pod-workflow se ne obnavlja neodvisno — ponovno ga vodi njegov obnovljen nadrejeni zagon. Sprožilci s svojo ponovnim dostavljanjem (RabbitMQ, načrtovano/cron, IMAP) lahko prav tako ponovno dostavijo ob ponovnem zagonu, tako da lahko obnovljen zagon občasno izvede dvakrat.

## Čakanje na človeški pregled

Zagoni, ki se ustavijo za odobritev [Človek-v-zanki](./human-in-the-loop.md), se takoj zabeležijo v zgodovini s statusom `čaka`.

- Vozlišče agenta v čakanju shranjuje pregledno vsebino, ki vključuje `reviewUrl`, `draftText` in `expiresAt`.
- Vsa vozlišča, povezana z agentovim `review` ročajem, lahko prav tako delujejo, preden človek odgovori, in njihovi rezultati vozlišč se shranijo v istem vnosu zgodovine v čakanju.
- Pogovorna okna zgodovine prikazujejo povezavo za pregled, tako da jo lahko lastniki kopirajo ali odprejo.
- Pogovorna okna zgodovine in panel za odpravljanje napak v urejevalniku prikazujejo končno človeško odločitev po ponovnem zagonu.
- Ko recenzent sprejme, spremeni ali zavrne osnutek, se isti vnos zgodovine posodobi s končnim rezultatom izvajanja.
- Če se isti zagon ustavi za HITL več kot enkrat, vnos zgodovine ostane enak, medtem ko vsak kontrolni točki dobi svojo enkratno povezavo za pregled.

To je še posebej koristno za zagon portalov in dolgotrajne workflows, ki lahko čakajo ure ali dni, preden nadaljujejo.

## Kopiraj

Uporabite **Kopiraj** poleg Vnosov ali Izhodov, da kopirate JSON v odložišče.

## Počisti zgodovino

- **Za vsak workflow**: V pogovornem oknu zgodovine Urejevalnika kliknite **Počisti zgodovino**, da odstranite zagon za trenutni workflow.
- **Vsa zgodovina**: V pogovornem oknu zgodovine Nadzorne plošče/Vrednotenja kliknite **Počisti vse zgodovino**, da odstranite vse zapise izvajanja, ki jih imate. Zagoni iz skupnih workflow se ohranijo. Te akcije ni mogoče razveljaviti.

## Podrobnosti časovnice izvajanja

Ko je odprt **Zapis izvajanja** v urejevalniku, kliknite gumb s časovnikom, da prikažete časovnico izvajanja. Izberite razpon, da odprete vgrajen inšpektor podrobnosti, ki prevzame območje vrstic. Prikazuje status izbrane faze, trajanje, število poskusov, informacije o ponovnem poskusu, napake, ID sledi in kompakten predogled izhoda. Izhodi objektov in tabel se uporabljajo z istim `JsonTree` pregledovalnikom kot preostali panel za odpravljanje napak; skalarne vrednosti uporabljajo predogled besedila. Ko faza izhodov slike (screenshot-i Playwright, generirane slike, datoteke slik), se prikažejo kot sličice nad izhodom, JSON pa prikazuje kratek nadomestni znak namesto surovega base64. Kliknite sličico, da jo odprete v svetlobni škatli; pušči ali tipki ←/→ preklapljata med vsako sliko v zagonu, s števcem, kot je `2 / 5`. Uporabite **Odpri sled** za LLM in Agent faze, ko je ID sledi na voljo.
## Podrobnosti o mobilnem vozlišču

Na telefonu urejevalnik prikaže drevo workflow v celozaslonskem načinu namesto prostornega platna. Tapnite vozlišče drevesa z zabeleženim rezultatom, da odprete njegovo izvajanje kot podrobnosti v celozaslonskem načinu. Pogled ponuja ločene zavihke **Vhodni podatki**, **Izhodni podatki** in **Napake**. Zavihek izhoda prikazuje zabeležen rezultat in ponuja možnost **Kopiraj izhod**; zavihek vhodnih podatkov prikazuje konfiguracijo izbranega vozlišča, zavihek napak pa prikazuje zabeleženo napako, ko je vozlišče spodletelo. Uporabite **Nazaj na workflow** ali gumb za zapiranje, da se vrnete na drevo.

Pogovorna okna zgodovine platna in nadzorne plošče ohranjajo svoje kontrolnike izvajanja v eni vrstici in postavljajo razpoložljive filtre oznak in primerkov v odzivno mrežo. Njihovi meniji filtrov uporabljajo enak vgrajen izbirnik, tako da ima izbrana kljukica dosledno razdaljo in osnovno črto z vsakim oznakami možnosti.

## Sorodno

- [Triggers](./triggers.md) – Kako se začenjajo workflows; zgodovina beleži `trigger_source` (vključno z `board` za izvajanja, ki so se začela z premiki kartic [Board](../tabs/board-tab.md) in nadaljevanji)
- [Human-in-the-Loop](./human-in-the-loop.md) – URL-ji v čakanju na pregled in obnašanje nadaljevanja
- [Edit History](./edit-history.md) – Različice za nadzor različic pri shranjevanju workflow (vrni, razlika)
- [Quick Start](../getting-started/quick-start.md) – Ustvarite in zaženite svoj prvi workflow
- [Workflows Tab](../tabs/workflows-tab.md) – Ustvarite in upravljajte workflows
