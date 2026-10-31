# Zavihek Chat

Zavihek **Chat** nudi neposreden vmesnik za klepet z LLM. Uporabite ga za testiranje modelov, postavljanje vprašanj, izvajanje obstoječih workflows ali ustvarjanje novega workflowa iz naravno jezikovne zahteve.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Oglejte si demo Chat</a></p>

## Nastavitev

1. Izberite [poverenje](./credentials-tab.md) (API ključ za OpenAI, Google itd.)
2. Izberite model iz spustnega menija (modeli se naložijo iz izbranega poverjenja)
3. Začnite tipkati, da pošljete sporočila

Klepet lahko začnete tudi iz klepetalnega okna na [zavihku Workflows](./workflows-tab.md). To pošlje vaše prvo sporočilo in odpre novo pogovor tukaj z odgovorom, ki se že pretaka.

## Značilnosti

- **Kontekst globalnih spremenljivk** – Vaše [Globalne spremenljivke](../reference/global-variables.md) so na voljo LLM, tako da lahko vprašate ali se sklicujete na shranjene vrednosti
- **Kontekst predlog delovnega prostora** – Skupne predloge workflow in vozlišč v vašem delovnem prostoru so vključene kot kontekst, tako da lahko Chat odgovori na vprašanja o razpoložljivih predlogah
- **Dolgotrajni agent** – Chat nadaljuje z delom v ozadju, tudi če se brskalnik zapre, tako da se lahko vrnete z druge naprave in nadaljujete isti pogovor
- **Ustvarjanje workflowa** – Prosite Chat, da ustvari ali nastavi workflow, in uporablja isti motor Workflow AI Builder kot pomočnik za urejevalnik za generiranje in shranjevanje workflowa
- **Ustvarjanje nalog Kanban** – Naravno prosite, da dodate nalogo ali ustvarite kartico. Chat jo doda v prvo stolpec zahtevanega odbora; ko imate več odborov in ne poimenujete enega, Chat prikaže izbiro odbora pred ustvarjanjem kartice
- **Čakajoči nadaljevanja** – Pošljite več sporočil, medtem ko se odgovor pretaka. Čakajoča sporočila so ohranjena, jih je mogoče urediti ali izbrisati, preden se začnejo, in se izvajajo v vrstnem redu po aktivnem odgovoru
- **Načrtovanje premorov** – Ko Chat potrebuje podrobnosti o načrtovanju, postavi pojasnjevalna vprašanja in ustavi čakajoča nadaljevanja, dokler ne odgovorite. Po končanju odgovora o načrtovanju se čakajoča sporočila nadaljujejo
- **Poverilnice** – Ko workflow, ki ga Chat ustvari ali ureja, potrebuje poverilnico, Chat vpraša, katero uporabiti, ponudi možnost ustvarjanja nove v pogovoru ali vam omogoči, da nadaljujete brez nje. Prav tako lahko prosite Chat, da ustvari poverilnico ali posodobi eno, ki jo imate; odpre obrazec za poverilnico v pogovoru. Model vidi ime in vrsto poverilnice, nikoli pa njenih vrednosti, tako za poverilnice v vaši lasti kot tiste, deljene z vami. Vozlišča LLM in Agent, ki jih doda Chat, se izvajajo s poverilnico in modelom, izbranima za chat, vključno z deljenimi poverilnicami; ko Chat ureja workflow, obstoječa vozlišča LLM in Agent ohranijo svojo poverilnico in model. Oglejte si [AI Assistant › Poverilnice](../reference/ai-assistant.md#credentials)
- **Dashboards** – Vprašajte, katere [dashboards](./dashboard-tab.md) imate, kaj je na eni izmed njih ali na kateri nadzorni plošči je workflow. Prosite Chat, da doda nov gradnik na dashboard (tja postavi prazen gradnik, nato zgradi in preizkusi njegov workflow), postavi obstoječi workflow na dashboard kot gradnik, preimenuje ali izbriše gradnik ali uredi postavitev nadzorne plošče. Heym Work prikazuje te nadzorne plošče kot svoje strani. Glejte [Dashboard › Iz klepeta in MCP](./dashboard-tab.md#iz-klepeta-in-mcp)
- **Podatkovne tabele** – Ko workflow, ki ga Chat ustvari ali uredi, shranjuje zapise, Chat vpraša, katero [podatkovno tabelo](./datatable-tab.md) uporabiti, ali ponudi ustvarjanje nove s potrebnimi stolpci. Prav tako lahko pregleduje vrstice, dodaja ali odstranjuje stolpce ter neposredno vstavlja, posodablja ali briše vrstice v tabelah, katerih lastnik ste ali jih lahko urejate. Navedite ime tabele ali povezavo DataTable. Odstranitev stolpcev in brisanje vseh vrstic zahtevata potrditev; dodajanje stolpcev ohrani obstoječe podatke. Glejte [AI asistent › Podatkovne tabele](../reference/ai-assistant.md#data-tables)
- **Pretakanje odgovorov** – Oglejte si izhod modela, medtem ko se pretaka
- **Prekini odgovor** – Prekinite trenutni odgovor, ki se pretaka, kadarkoli; prekinitev prav tako izbriše čakajoča sporočila za ta pogovor
- **Markdown oblikovanje** – Odgovori podpirajo markdown oblikovanje, vključno z vgrajenimi slikami
- **Prikaz slik** – Slike, vključene v odgovore (npr. iz generiranja slik LLM), se prikažejo inline; kliknite katero koli sliko, da jo prikažete v celozaslonskem načinu. Pritisnite **Esc** ali gumb za nazaj (mobilno), da zaprete celozaslonski pogled
- **Kopiraj sporočila** – Kopirajte katero koli sporočilo v odložišče
- **Počisti klepet** – Začnite nov pogovor
- **Vnos z glasom** – Uporabite gumb mikrofona za pretvorbo govora v besedilo (podprto v brskalniku). Ko snemanje preneha, lahko Heym rahlo očisti transkript, preden ga pošljete
- **Načrtovani workflows** – Vprašajte, kdaj se izvajajo cron workflows (danes, ta teden, ta mesec ali po meri določen časovni okvir). Pomočnik uporablja iste podatke o urniku kot [Načrtovani](./scheduled-tab.md) zavihek in lahko omeji rezultate na workflows, ki jih imate, ali vključuje tiste, ki so deljeni z vami
- **Zgodovina izvajanja workflowa** – Vprašajte o enem workflowu ("kolikokrat se je dnevno poročilo izvedlo?", "ali je spodletelo?", "kdaj se je nazadnje izvedlo?"). Chat poišče workflow po njegovem ID-ju in odgovori na podlagi števila izvajanj, razčlenitve stanja, prvega in zadnjega časa izvajanja ter povprečnega trajanja. Vprašajte, zakaj je izvajanje spodletelo ali kaj je vrnilo, in Chat nato odpre to posamezno izvajanje, da prebere njegove vnose, izhode in napake po vozliščih
- **Kje izvajanja ne uspejo in zakaj so počasna** – Vprašajte, kje vaši workflowi ne uspejo ali zakaj so počasni, in Chat bo navedel workflowe, ki so se največkrat izvajali, največkrat spodleteli in so najpočasnejši, ter tipe vozlišč, ki vzamejo največ časa (povprečje na klic in skupaj), največkrat spodletijo in se največkrat izvajajo – enake številke kot v zavihku [Analytics](./analytics-tab.md). Tipi vozlišč se štejejo za izvajanja od izdaje, ki je uvedla analitiko vozlišč. Vprašajte za zadnjo uro, 3 ali 6 ur, 24 ur, 7 ali 30 dni ali ves čas; urna okna se začnejo ob polni uri, zato »zadnja ura« ob 15:20 zajema obdobje od 14:00 do zdaj.
- **Trenutni status izvajanja** – Vprašajte, kaj se trenutno izvaja, in Chat odgovori s številom, imeni workflowov, koliko časa se vsako izvajanje izvaja, na katerem vozlišču je in povezavo neposredno do trenutnega izvajanja
## Uporaba Chata iz MCP odjemalca

Chat motor je mogoče doseči tudi izven brskalnika. Omogočite **Heym Chat Orodje** na [MCP / A2A zavihku](./mcp-tab.md) in MCP odjemalci — Claude, Cursor in vse druge, ki govorijo MCP — dobijo enotno orodje `heym_chat`, ki deluje s tem istim motorjem in vsemi njegovimi zmožnostmi.

Te pogovore najdete v zgodovini tega zavihka, označene z ikono vtiča v seznamu pogovorov. Odprite enega, da preberete, kaj je odjemalec vprašal, vidite kartice orodij, ki jih je sprožil, in nadaljujete nit sami. Odgovarjanje na vprašanje za pojasnilo deluje enako, ne glede na to, ali se je krog začel tukaj ali iz MCP odjemalca.

Preko MCP Chat ne navaja, ne izbira in ne ustvarja poverilnic. Workflows, ki jih ustvari, pustijo polja za poverilnice prazna, odgovor pa imenuje vozlišča, ki potrebujejo poverilnico, da jih lahko nastavite v urejevalniku.

Podatkovne tabele delujejo tudi prek MCP: Chat lahko neposredno ureja stolpce in vrstice, ustvarja tabele ter jih vključi v workflowe. Vprašanja o tabelah in potrditve brisanja prispejo kot besedilo v rezultatu; odgovorite z istim `conversation_id`.

## Omejitev konteksta

Chat ohranja do 25 nedavnih sporočil v kontekstu. Starejša sporočila se odstranijo, da ostanejo znotraj omejitev modela.

## Ustvarjanje Workflows

Ko prosite Chat, da ustvari, zgradi, generira ali nastavi workflow, ustvari nov shranjen workflow z generiranim imenom in opisom. Odgovor vključuje predogled platna v načinu samo za branje, ki prikazuje ustvarjena vozlišča in robove, ter povezavo **Odpri workflow**, ki odpre urejevalnik workflow v novem zavihku brskalnika. Uporabite gumb **Zaženi** na predogledni kartici, ko želite izvesti workflow.

Slednje povratne informacije v istem chatu urejajo ta workflow namesto da bi ustvarile novega. Na primer, po tem, ko Chat ustvari workflow, lahko rečete "dodaj korak odobritve", "spremeni format izhoda" ali "şöyle yap" in Chat posodobi shranjeni workflow ter osveži predogled.

To je najbolje za zahteve, kjer želite, da se delo opravi kot ponovno uporabna avtomatizacija, ne le kot enkratni odgovor.

## Ustvarjanje Kanban nalog

Prosite Chat v običajnem jeziku, na primer, "Dodaj nalogo z imenom Popravi napako pri prijavi" ali "Ustvari novo kartico Posodobi dokumentacijo na zagonu." V isto zahtevo lahko vključite opis. Chat vedno ustvari kartico v prvem stolpcu izbranega odbora.

Če ima vaše delovno okolje več odborov in ne navedete enega, Chat ustavi z izbiro odbora. Izberite odbor, da dokončate ustvarjanje kartice. Ni potrebna nobena ukazna ali posebna oblika sporočila.

## Vprašanje, kaj se izvaja

Vprašajte v običajnem jeziku — "kaj se izvaja?", "kolikšno število workflows je trenutno aktivnih?", "na katerem vozlišču je nočno poročilo?" — in Chat poroča o trenutnem stanju:

- **Koliko** izvajanj je v teku, razdeljenih na izvajanje in čakanje na človeški pregled
- **Kateri workflows** jim pripadajo, po imenu
- **Kako dolgo** vsako izvajanje poteka (na primer `1m 35s`, `3h 25m`)
- **Katero vozlišče** se trenutno izvaja, po oznaki na platnu, plus zadnje vozlišče, ki je končalo
- **Povezava** do vsakega aktivnega izvajanja, ki odpre platno s ponovnim predvajanjem tega izvajanja

Izvajanja, ki so ustavljena za [Človeka v zanki](../reference/human-in-the-loop.md) ali pregled Codex, se poročajo kot čakajoča na vas, ne kot izvajajoča. To so isti podatki kot oznaka aktivnih izvajanj v glavi, tako da Chat in oznaka nikoli ne nasprotujeta. Za izvajanja, ki so se že končala, vprašajte za nedavna izvajanja — to prebere [Zgodovina izvajanj](../reference/execution-history.md).

## Vprašanja o izvajanju

Izberite izvajanje Workflowa v [Execution History](../reference/execution-history.md#ask-ai), v urejevalniku ali v All History, in kliknite **Vprašaj AI** poleg naslova pogovornega okna. Chat odpre nov pogovor z dvema čipoma nad vnosnim poljem:

- **Workflow:** ime Workflowa
- **Execution:** prve znake identifikatorja izbranega izvajanja

Odstranite čip z njegovim **×**, da ga izpustite. Nato postavite vprašanje, na primer „zakaj je to izvajanje trajalo tako dolgo?“, „kaj je tukaj spodletelo?“ ali „ali lahko to popravite?“. Preostali čipi so priloženi temu sporočilu s polnimi identifikatorji, tako da Chat neposredno prebere vhode, izhode in sled po vozliščih izvajanja, namesto da bi iskal Workflow. Za popravek Workflowa Chat shrani, preizkusi in preveri spremembo, kot je opisano v [Ustvarjanje workflowov](#ustvarjanje-workflowov).

Poslano sporočilo prikazuje čipe pod vašim vprašanjem. Pripadajo samo temu sporočilu; nadaljnja vprašanja v istem pogovoru ohranijo kontekst iz zgodovine.

## Vprašanje o Opozorilih

Chat lahko odgovori na vprašanja o [opozorilih](./alerts-tab.md), ki ste jih definirali:

- **Kaj obstaja** — "katera opozorila imam?", "ali obstaja opozorilo za workflow računa?", "katera opozorila se trenutno sprožajo?"
- **Kako je eno nastavljeno** — "kakšna je meja za opozorilo o stroških?", "kako je to konfigurirano?"
- **Zakaj in kdaj se je sprožilo** — "zakaj se je sprožilo opozorilo o stroških?", "kdaj se je to nazadnje sprožilo?"

Za vprašanje "zakaj se je sprožilo" Chat prebere zapis sprožitve in citira dejansko opazovano vrednost, mejo in natančno okno, ki je bilo ocenjeno, plus podrobnosti, ki so prispevale: id-ji neuspešnih izvajanj in sporočila o napakah za opozorila o napakah, poraba po modelu za opozorila o stroških ali razčlenitev vira sprožitve za opozorila o številu izvajanj. Poroča, kaj je bilo resnično, ko se je opozorilo sprožilo, namesto da bi ponovno izračunalo okno, ker je okno minilo in svež izračun lahko da drugačen odgovor.

## Pravila uporabnika

[Pravila uporabnika](../reference/user-settings.md) (konfigurirana v nastavitvah) so samodejno vstavljena v vsak pogovor Chat kot sistemske instrukcije. Nastavite jih enkrat, da uporabite trajne nastavitve za vse zahteve chata.

## Delo z Evals

Chat lahko ustvarja, spreminja in izvaja zbirke v [Evals](./evals-tab.md), tako zbirke pozivov kot zbirke agentov:

- **Zbirka pozivov**: »ustvari zbirko pozivov za moj poziv za odgovor podpore z 8 testnimi primeri in primerjaj gpt-4o z gpt-4.1-mini«. Chat sestavi testne primere s pričakovanimi odgovori, izbere metodo ocenjevanja in shrani zbirko.
  - Pred ustvarjanjem zbirke določi, katere poverilnice LLM in modele uporabiti. Pri natanko eni poverilnici LLM uporabi to in to navede; sicer vpraša.
  - Za ocenjevanje LLM-as-Judge vpraša tudi, ali naj ločeni sodnik oceni odgovore.
- **Zbirka agenta**: »preveri, ali moj podporni agent vedno išče po dokumentaciji in nikoli ne pošilja e-pošte«. Chat poišče agenta in shrani preverjanja orodij ter pragove. Na zahtevo izvede workflow, pri čemer za vsak zagon ustvari drugačen vnos.
  - Zagoni zbirk agentov so dejanski zagoni workflowa, zato se njihovi stranski učinki zgodijo. Chat pove, koliko zagonov začne.
- **Baseline**: Chat lahko z izhodiščem agenta dela na tri načine:
  - Poroča o njem iz zadnjih zagonov agenta.
  - Zgradi ga iz zagonov, ki jih sam sproži (»zaženi ga 5-krat in to uporabi kot baseline«).
  - Shrani številke, ki mu jih posredujete (»nastavi baseline na 3 sekunde p95 in 0,01 $ na zagon«).
- **Zagoni**: Chat čaka do ene minute na zagon, nato pa poroča o rezultatu:
  - Za zbirko pozivov: število uspešnih preizkusov vsakega modela in primere, ki niso uspeli.
  - Za zbirko agenta: stopnjo uspešnosti, neuspešna preverjanja in odstopanje od izhodišča.
  - Daljši zagon se nadaljuje v Evals; prosite Chat, da ga znova preveri.

Ko Chat ustvari ali spremeni zbirko, odgovor prikaže kartico z imenom zbirke, njeno vrsto in gumbom **Odpri v Evals**, podobno kartici shranjenega workflowa. Prek MCP rezultat `heym_chat` navaja povezavo vsake zbirke, shranjene v tem klicu.

Enako deluje iz odjemalca MCP prek `heym_chat` (glejte [Uporaba Chata iz odjemalca MCP](#uporaba-chata-iz-odjemalca-mcp)). Orodja za evalvacijo ostanejo znotraj `heym_chat`; odjemalci MCP jih ne vidijo kot ločena orodja.

AI asistent v urejevalniku ne ustvarja zbirk.

## Sorodne

- [MCP / A2A Zavihek](./mcp-tab.md) – Izpostavite ta motor strankam MCP kot orodje `heym_chat`
- [Nastavitve](../reference/user-settings.md) – Nastavite uporabniška pravila, ki se uporabljajo za vse zahteve za klepet
- [Zavihek Poverilnice](./credentials-tab.md) – Dodajte in upravljajte API ključe
- [Zavihek Spremenljivke](./global-variables-tab.md) – Globalne spremenljivke, dostopne za Chat
- [Vrste Vozlišč](../reference/node-types.md) – LLM in Agent vozlišča za workflows
- [Agent Vozlišče](../nodes/agent-node.md) – AI Agent z klicem orodij
- [AI Pomočnik](../reference/ai-assistant.md) – Pomočnik za urejanje, podprt z istim DSL za gradnjo workflows
- [Zgodovina Izvajanja](../reference/execution-history.md) – Ogled preteklih izvajanj (gumb Zgodovina v glavi)
- [Zavihek Urniki](./scheduled-tab.md) – Koledar prihajajočih cron izvajanj (iste podatke lahko Chat povzame)
- [Zavihek Opozorila](./alerts-tab.md) – Opozorila o mejah, ki jih lahko Chat prikaže in razloži
- [Kontekstualna Predstavitev](../reference/contextual-showcase.md) – Kompaktna usmeritev v aplikaciji za to stran
- [Glas Klepeta (TTS & STT)](../reference/chat-voice.md) – Preberite sporočila na glas in govorite brez rok z ElevenLabs

## Klici orodij in velikost konteksta

Vsakič, ko pomočnik pokliče orodje (izvaja workflow, navaja izvajanja, gradi nov workflow), se v pogovoru prikaže zložljiva kartica. Kartica se samodejno razširi, medtem ko orodje deluje, in prikazuje natančne argumente. Ko orodje konča, se kartica skrči v enovrstični povzetek s pretečenim časom. Kliknite katero koli kartico, da ponovno razširite argumente in povzetek odgovora.

Majhna oznaka v obliki obroča pod vnosom prikazuje trenutno uporabo konteksta kot odstotek okna modela (npr. `12% · ~9.2k`). Z miško preletite oznako, da si ogledate razčlenitev: sistemski prompt, AGENTS.md, blok workflows, uporabniška pravila, zgodovina in vaš osnutek vnosa. Ko uporaba preseže 80%, obroč postane jantarne barve; pri 95% postane rdeč.

Če se uporaba približa meji, Heym samodejno stisne starejša sporočila v kratek povzetek z uporabo istega mehanizma, ki ga uporabljajo agent vozlišča. Kartica "Kontekst stisnjen" se prikaže v vrstici, da pokaže, kaj se je zgodilo.
