# AI Asistent

**AI Asistent** je klepetalna plošča, ki se odpre iz Debug plošče in se nahaja v spodnjem desnem kotu urejevalnika. Povlecite glavo, da jo premaknete, in povlecite rob ali kot, da spremenite njeno širino ali višino. Ne bo se zmanjšala pod 360×480 slikovnih pik. Položaj in velikost se zapomnita v tem brskalniku. **Ponastavitev položaja in velikosti** v glavi vrne ploščo nazaj v spodnji desni kot. Uporabite naravni jezik za ustvarjanje ali spreminjanje workflows—opишите, kaj želite, in AI generira vozlišča in robove, ki se uporabijo na platnu.

Za vprašanja o dokumentaciji izven urejevalnika uporabite [Klepetajte z Heym](./chat-with-heym.md). Ta površina je optimizirana za pomoč pri izdelku, ki je zavedna o straneh, namesto za generiranje workflows.

## Odprtje Plošče

1. Odprite workflow v urejevalniku
2. Poiščite **Debug ploščo** na dnu (območje rezultatov izvajanja)
3. Kliknite gumb **AI** (ikona iskrice) v orodni vrstici plošče
4. Plošča AI Asistenta se odpre v spodnjem desnem kotu. Povlecite njeno glavo, da jo premaknete, ali povlecite rob ali kot, da spremenite njeno širino in višino.

Pritisnite `Ctrl + I` / `Cmd + I` kjerkoli v urejevalniku, da odprete ali zaprete ploščo — bližnjica deluje tudi, ko je fokus na besedilnem vnosu. Oglejte si [Bližnjice na tipkovnici](./keyboard-shortcuts.md).

Za delo na posameznem vozlišču se z miško postavite nanj na canvasu in kliknite **AI** nad njim. Plošča se odpre osredotočena na to vozlišče. Glejte [Spreminjanje posameznega vozlišča](#changing-one-node).

## Zapiranje Plošče

Kliknite gumb **X**, pritisnite `Ctrl + I` / `Cmd + I`, ali preklopite gumb **AI** v orodni vrstici Debug plošče. Glava premika ploščo; je ne zapre.

## Konfiguracija

Pred pošiljanjem sporočil izberite:

| Nastavitev | Opis |
|------------|------|
| **Poverilnica** | LLM poverilnica (API ključ) iz [Poverilnic](../tabs/credentials-tab.md) |
| **Model** | Ime modela (npr. `gpt-4o`, `gemini-2.5-flash`) |

Dodajte poverilnice v [Zavihek Poverilnice](../tabs/credentials-tab.md). Seznam modelov se naloži iz izbrane poverilnice.

## Način Agenta proti Načinu Vprašanja

Plošča ima dva načina, ki ju preklapljate s čipom **Agent / Vprašaj** v glavi plošče.

| Način | Privzeto | Obnašanje |
|-------|----------|-----------|
| **Agent** | ✓ | Gradi in spreminja platno. AI generira blok workflow JSON, ki se samodejno uporabi na platnu, ko je odgovor končan. |
| **Vprašaj** | | Odgovarja le na vprašanja. Platno nikoli ni dotaknjeno. Uporabite to za vprašanja o vašem workflow, funkcijah Heym ali za nasvete brez sprožitve posodobitve platna. |

Načine lahko preklapljate kadarkoli. Spreminjanje načina ne izbriše pogovora.

V načinu Agenta omogoča polje **YOLO način** pod poljem za sporočila, da asistent izvede in popravi, kar gradi. Oglejte si [YOLO način](#yolo-mode).

## Uporaba Klepeta

- Vnesite svojo zahtevo v vnosno polje (npr. "Ustvarite workflow, ki vzame uporabniški vnos in ga pošlje LLM")
- Pritisnite **Enter**, da pošljete (Shift+Enter za novo vrstico)
- AI pretaka svoj odgovor. V **Agent** načinu, če odgovor vključuje workflow v \`\`\`json bloku kode, se samodejno analizira in uporabi na platnu. V **Vprašaj** načinu platno nikoli ni spremenjeno.
- Uporabite **Počisti**, da ponastavite pogovor
- Premaknite kurzor nad sporočilo in kliknite ikono za kopiranje, da kopirate besedilo, ki ga prikazuje, vključno z morebitnim workflow JSON
- Povlecite črto nad poljem za sporočila, da povečate višino polja. Vhodno območje se lahko razširi do 60% plošče, ob ponovnem nalaganju strani pa se vrne na privzeto višino.

## Samodejna Uporaba Workflow

Ko odgovor AI vsebuje veljaven workflow JSON blok (z `nodes` in po potrebi `edges`) v \`\`\`json bloku kode, Heym:

1. Analizira JSON iz odgovora
2. Zamenja trenutno platno z novimi vozlišči in robovi
3. Uredi postavitev vozlišč
4. Označi workflow kot neshranjen

Če analiza ne uspe, se prikaže gumb **Poskusi znova**, da se ponovno generira odgovor.

## Spreminjanje posameznega vozlišča

Postavite se z miško nad vozlišče na canvasu in kliknite **AI** nad njim. Plošča se odpre v načinu Agent, osredotočena na to vozlišče, in prikaže, katero vozlišče spreminja:

| Vozlišče ima... | Plošča prikazuje |
|---|---|
| Brez rezultata v trenutnem zagonu | **Modifying Node:** v strnjeni vrstici z ikono in imenom vozlišča. Pomočnik ureja samo iz konfiguracije vozlišča; najprej zaženite vozlišče, če mora videti izhod |
| Rezultat v trenutnem zagonu | **Modifying Node: (Has Node Output)** nad samim vozliščem: ikona, ime in vrsta, zadnji status in trajanje ter napaka, če je spodletelo. Pomočnik vidi ta izhod in napako pri urejanju vozlišča |

Postavite se z miško nad oznako, da vidite, v katerem stanju je plošča.

Ne glede na stanje plošče pomočnik prebere tudi stran z dokumentacijo vozlišča pod ikono knjige v glavi vozlišča. Uporablja jo za razumevanje možnosti vozlišča in odgovarjanje na vprašanja o njih.

Pod sporočili tri možnosti začnejo zahtevo:

| Možnost | Kaj počne |
|---|---|
| **Change this node as ...** | Izpolni polje za sporočilo s *Spremeni to vozlišče v*, da dokončate stavek |
| **Fix error in this node ...** | Izpolni *Odpravi napako v tem vozlišču.* Pomočnik prebere napako tega vozlišča iz zadnjega zagona |
| **Other** | Osredotoči prazno polje za sporočilo |

Uredite besedilo in pritisnite **Send**. Pomočnik vrne samo to vozlišče in Heym ga posodobi na mestu: vozlišče ohrani svoj id, vrsto in ime, tako da izrazi, kot je `$checkLinkedIn.result` v drugih vozliščih, delujejo naprej. Druga vozlišča, povezave in postavitev se ne spremenijo, **Undo** pa obnovi prejšnjo konfiguracijo.

Če zahteva ne ustreza vozlišču, na primer zahteva drugo vrsto vozlišča ali novo vozlišče, pomočnik namesto urejanja pove, kaj bi bilo treba spremeniti. Zaprite fokus vozlišča z **X** na kartici vozlišča, da znova uredite celoten workflow. Zaprtje plošče prav tako počisti fokus.

[Način YOLO](#yolo-mode) deluje z osredotočenim vozliščem: pomočnik spremeni vozlišče, zažene workflow in popravlja vozlišče, dokler zagon ne uspe. V načinu **Ask** fokus pomočniku sporoča, o katerem vozlišču sprašujete, canvas pa ostane nespremenjen.

## YOLO Način

**YOLO način** omogoča asistentu, da preizkusi, kar gradi. Označite polje **YOLO način** pod poljem za sporočila, nato pošljite svojo zahtevo. Polje se prikaže le v načinu Agenta. Privzeto je izklopljeno in se ob ponovnem nalaganju strani ponastavi na izklopljeno. Premaknite kurzor nad ikono informacij poleg njega za kratek povzetek.

Ko je YOLO način vklopljen, asistent ne preneha po tem, ko uporabi workflow:

1. Uporabi workflow na platnu.
2. Pred prvim izvajanjem zahteva testne vnose. Kartica prikazuje vhodna polja workflow, napolnjena z vrednostmi, ki jih predlaga asistent. Uredite jih in pritisnite **Zaženi**. Kasnejša izvajanja ponovno uporabijo te vrednosti. Kartica se ponovno prikaže, ko se vhodna polja spremenijo ali asistent potrebuje drugačne testne podatke.
3. Izvede workflow na platnu natanko tako, kot gumb **Zaženi**: neshranjene spremembe se najprej shranijo, vozlišča zasvetijo, in izvajanje se prikaže v Debug plošči in [Zgodovina Izvajanja](./execution-history.md).
4. Prebere rezultat. Če je izvajanje naredilo, kar ste zahtevali, se konča z **Potrjeno** in kratkim povzetkom. Če ne, popravi workflow in ga ponovno izvede.

Izvede največ **5 izvajanj** na sporočilo. Pritisnite **Ustavi** kadarkoli, da končate zanko in ustavite izvajanje v teku.

Vsak odgovor prikazuje svoje korake, ko se zgodijo:
- `Uporaba sprememb na platnu`;
- `Izvajanje workflow · poskus 2/5`, z vrstico `Izvaja <node>` za vsako vozlišče;
- končna presoja.

Po vsakem izvajanju se prikaže kratka vrstica, kot je *Rezultat poskusa 1 poslan · napaka v 1.2s*, ki kaže, da je rezultat vrnjen asistentu.
### Zagon drugih workflows

V YOLO načinu lahko asistent prav tako izvaja vaše druge workflows, ko potrebuje njihov rezultat. Na primer, lahko preveri, kaj workflow vrne, preden ga pokliče iz [Execute](../nodes/execute-node.md) vozlišča. Ti zagon se prikažejo kot `Running workflow "<name>"...` koraki in so zabeleženi v Zgodovini izvajanja z izvorom sprožilca `ai_assistant`. Workflow, ki ga urejate, se vedno testira na platnu.

### Ko se zgodaj ustavi

| Situacija | Kaj se zgodi |
|---|---|
| Asistent potrebuje odločitev, informacije, poverilnico ali podatkovno tabelo | Postavi vprašanje s standardno kartico. Odgovoritev nadaljuje zanko. |
| Zagon čaka na [človeški pregled](./human-in-the-loop.md) | Zanka se ustavi. Odobrite pregled, nato pošljite sporočilo. |
| Workflow čaka na nalaganje datoteke | Zanka se ustavi. YOLO način ne more testirati zagonov, sproženih z nalaganjem. |
| Novša različica workflow je bila shranjena drugje | Zanka se ustavi. Rešite konflikt shranjevanja, nato pošljite sporočilo. |

> **Zagoni so resnični.** E-pošta, sporočila in API klici v workflow se dejansko pošljejo ob vsakem poskusu, in DataTable vozlišča zapisujejo prave vrstice. Vsak zagon shrani workflow, tako da prejšnje različice ostanejo v [Zgodovini urejanja](./edit-history.md).

## Vnos glasu

Na podprtih brskalnikih gumb **Voice** omogoča pretvorbo govora v besedilo. Kliknite za začetek snemanja, ponovno kliknite za ustavitev. Prepisano besedilo se pošlje AI za popravilo slovnice, preden ga pošljete.

## Agent Node vs AI Assistant

| | Agent Node | AI Assistant |
|---|------------|---------------|
| **Namen** | LLM vozlišče znotraj workflow; deluje med izvajanjem | Chat UI za gradnjo workflows z naravnim jezikom |
| **Lokacija** | Vozlišče na platnu | Debug panel → lebdeča plošča |
| **Kdaj** | Med izvajanjem | Med urejanjem |

Oglejte si [Agent Node](../nodes/agent-node.md) za workflow vozlišče, ki izvaja LLM klice z orodji in MCP.

## Kako deluje (AI Builder DSL)

AI Assistant deluje na osnovi **workflow DSL** (jezik specifičen za domeno), ki opisuje vozlišča, robove in izraze. Ko pošljete sporočilo:

1. Vaše sporočilo skupaj z [Uporabniškimi pravili](./user-settings.md) in trenutnim workflow (če obstaja) se pošlje v backend.
2. Backend ustvari **sistem prompt**, ki vključuje:
   - Celoten workflow DSL (tipi vozlišč, sintaksa izrazov, pravila, primeri)
   - Vaša Uporabniška pravila dodana kot "Uporabniška prilagojena pravila"
   - Trenutni workflow JSON, ko urejate obstoječi workflow
   - Seznam razpoložljivih workflows, če uporabljate Execute vozlišče
   - Imena, tipe in id-je poverilnic, ki si jih lastite ali so bile deljene z vami (nikoli njihovih vrednosti)
   - Imena, id-je, opise in stolpce podatkovnih tabel, ki jih lahko uporabite (nikoli njihovih vrstic)
3. Model vrne en sam workflow JSON blok (z `nodes` in `edges`). Frontend ga analizira in uporabi na platnu.

### Poverilnice

Ko workflow potrebuje poverilnico, asistent vpraša, preden jo ustvari. Če imate poverilnice ustreznega tipa, jih prikaže skupaj z **Ustvari novo poverilnico**; če jih nimate, vpraša, ali želite ustvariti eno. Vsako vprašanje vam prav tako omogoča, da nadaljujete brez poverilnice.

Izbira za ustvarjanje odpre obrazec za poverilnico v panelu, prednastavljen na pravi tip in predlagano ime. Vrednosti gredo neposredno v Heym; asistent se nauči le ime in tip. OAuth poverilnice (Google Sheets, Google Drive, BigQuery, Linear, Notion) se povežejo v pojavnem oknu, in povezava do strani za avtorizacijo se prikaže v primeru, da je pojavna okna blokirana. Ko je poverilnica shranjena, kartica prikaže njeno ime in gumb za ustvarjanje se izklopi; pritisnite **Pošlji odgovore** in asistent doda novo poverilnico na vozlišče.

Lahko tudi zahtevate poverilnico samostojno ("ustvari GitHub poverilnico") ali prosite za spremembo ene, ki jo imate ("posodobi mojo poverilnico za tabelo", "ponovno poveži moje Google Sheets"). Asistent odgovori z isto kartico: ustvarjanje odpre prazen obrazec, posodabljanje odpre obrazec na tisti poverilnici z njenimi skrivnostmi zamaskiranimi.

Asistent daje prednost namenskem vozlišču. Ko nobeno vozlišče ne pokriva operacije, kot je dodajanje zavihka v Google Sheet, uporabi HTTP zahtevo in zapiše vrstico glave za izbrano poverilnico. Oglejte si [HTTP › Avtentikacija s poverilnicami](../nodes/http-node.md#authenticating-with-credentials).

Pojasnjevalna vprašanja, ki jih workflow lahko izvede brez, označujejo **Neobvezno** v njihovem vhodu in jih je mogoče preskočiti.

DSL uveljavlja camelCase oznake, enotna pravila izrazov in polja specifična za vozlišča. Če je vrednost polja en sam `$expr`, backend ohrani naravni tip; če vrednost meša prozo z `$refs`, je rezultat niz. Pravilo enega `$` še vedno velja: noben `$` znotraj oklepajev. [Nastavitve](./user-settings.md) Uporabniška pravila so vstavljena v ta sistem prompt, tako da se vaše nastavitve uporabljajo za vsak AI-generiran workflow.

Če trenutni workflow vsebuje Agent veščine, AI Assistant vključuje le `SKILL.md` vsake veščine v tem kontekstu workflow. Priložene `.py` datoteke in binarni viri veščin so odstranjeni pred zahtevo, tako da graditelj ostane znotraj omejitev modela, tudi ko veščine vsebujejo velike implementacije.
### Podatkovne tabele

Ko workflow shranjuje, shranjuje ali išče zapise in niste poimenovali druge shrambe, asistent uporablja [DataTable](../nodes/datatable-node.md) vozlišče. Če poimenujete eno od svojih tabel in ima stolpce, ki jih workflow potrebuje, asistent to tabelo uporabi. V nasprotnem primeru vpraša, katero tabelo naj uporabi. Kartica prikazuje tabele, ki ustrezajo, vsaka z opisom in tipi stolpcev, poleg tega pa tudi **Ustvari novo tabelo** s predlaganim imenom in stolpci. Tabele, ki so deljene z vami, so prav tako ponujene; ena, ki jo lahko le berete, je ponujena samo za branje.

Izberite novo tabelo in pritisnite **Potrdi odgovore**: kartica ustvari tabelo, asistent pa doda njen id na vozlišče in uporabi njene točne imenske stolpce. Prav tako lahko zahtevate tabelo samostojno, na primer "ustvari tabelo za moje potencialne stranke".

Asistent vidi imena tabel, opise in stolpce, nikoli pa vrstic. Nikoli ne spremeni stolpcev obstoječe tabele: če tabeli manjka stolpec, ki ga workflow potrebuje, imenuje stolpec in ponudi novo tabelo namesto tega. Dodajte stolpce na [zavihek DataTable](../tabs/datatable-tab.md).

## Sorodno

- [Zakaj Heym](../getting-started/why-heym.md) – Gradnja v naravnem jeziku kot prvi korak življenjskega cikla agenta
- [Hiter začetek](../getting-started/quick-start.md) – Zgradite svoj prvi workflow
- [Nastavitve](./user-settings.md) – Pravila uporabnika, vključena v sistemski poziv AI asistenta
- [Chat with Heym](./chat-with-heym.md) – Asistent, ki je seznanjen s stranjo, znotraj dokumentacijske področja
- [Osnovni koncepti](../getting-started/core-concepts.md) – Workflows, vozlišča in potek izvajanja
- [Agent Node](../nodes/agent-node.md) – LLM vozlišče z orodji in MCP
- [Zavihek Poverilnice](../tabs/credentials-tab.md) – Dodajte API ključe za AI asistenta
- [Struktura Workflow](./workflow-structure.md) – JSON format za workflows
