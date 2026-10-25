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
- **Poverilnice** – Ko workflow, ki ga Chat ustvari ali ureja, potrebuje poverilnico, Chat vpraša, katero uporabiti, ponudi možnost ustvarjanja nove v pogovoru ali vam omogoči, da nadaljujete brez nje. Prav tako lahko prosite Chat, da ustvari poverilnico ali posodobi eno, ki jo imate; odpre obrazec za poverilnico v pogovoru. Model vidi ime in vrsto poverilnice, nikoli pa njenih vrednosti. Oglejte si [AI Assistant › Poverilnice](../reference/ai-assistant.md#credentials)
- **Podatkovne tabele** – Ko workflow, ki ga Chat ustvari ali ureja, shranjuje zapise, Chat vpraša, katero [podatkovno tabelo](./datatable-tab.md) uporabiti ali ponudi možnost ustvarjanja nove s stolpci, ki jih workflow potrebuje. Lahko tudi našteje vaše tabele in njihove stolpce. Nikoli ne bere ali piše vrstic. Oglejte si [AI Assistant › Podatkovne tabele](../reference/ai-assistant.md#data-tables)
- **Pretakanje odgovorov** – Oglejte si izhod modela, medtem ko se pretaka
- **Prekini odgovor** – Prekinite trenutni odgovor, ki se pretaka, kadarkoli; prekinitev prav tako izbriše čakajoča sporočila za ta pogovor
- **Markdown oblikovanje** – Odgovori podpirajo markdown oblikovanje, vključno z vgrajenimi slikami
- **Prikaz slik** – Slike, vključene v odgovore (npr. iz generiranja slik LLM), se prikažejo inline; kliknite katero koli sliko, da jo prikažete v celozaslonskem načinu. Pritisnite **Esc** ali gumb za nazaj (mobilno), da zaprete celozaslonski pogled
- **Kopiraj sporočila** – Kopirajte katero koli sporočilo v odložišče
- **Počisti klepet** – Začnite nov pogovor
- **Vnos z glasom** – Uporabite gumb mikrofona za pretvorbo govora v besedilo (podprto v brskalniku). Ko snemanje preneha, lahko Heym rahlo očisti transkript, preden ga pošljete
- **Načrtovani workflows** – Vprašajte, kdaj se izvajajo cron workflows (danes, ta teden, ta mesec ali po meri določen časovni okvir). Pomočnik uporablja iste podatke o urniku kot [Načrtovani](./scheduled-tab.md) zavihek in lahko omeji rezultate na workflows, ki jih imate, ali vključuje tiste, ki so deljeni z vami
- **Zgodovina izvajanja workflowa** – Vprašajte o enem workflowu ("kolikokrat se je dnevno poročilo izvedlo?", "ali je spodletelo?", "kdaj se je nazadnje izvedlo?"). Chat poišče workflow po njegovem ID-ju in odgovori na podlagi števila izvajanj, razčlenitve stanja, prvega in zadnjega časa izvajanja ter povprečnega trajanja. Vprašajte, zakaj je izvajanje spodletelo ali kaj je vrnilo, in Chat nato odpre to posamezno izvajanje, da prebere njegove vnose, izhode in napake po vozliščih
- **Trenutni status izvajanja** – Vprašajte, kaj se trenutno izvaja, in Chat odgovori s številom, imeni workflowov, koliko časa se vsako izvajanje izvaja, na katerem vozlišču je in povezavo neposredno do trenutnega izvajanja
## Uporaba Chata iz MCP odjemalca

Chat motor je mogoče doseči tudi izven brskalnika. Omogočite **Heym Chat Orodje** na [MCP zavihku](./mcp-tab.md) in MCP odjemalci — Claude, Cursor in vse druge, ki govorijo MCP — dobijo enotno orodje `heym_chat`, ki deluje s tem istim motorjem in vsemi njegovimi zmožnostmi.

Te pogovore najdete v zgodovini tega zavihka, označene z ikono vtiča v seznamu pogovorov. Odprite enega, da preberete, kaj je odjemalec vprašal, vidite kartice orodij, ki jih je sprožil, in nadaljujete nit sami. Odgovarjanje na vprašanje za pojasnilo deluje enako, ne glede na to, ali se je krog začel tukaj ali iz MCP odjemalca.

Preko MCP Chat ne navaja, ne izbira in ne ustvarja poverilnic. Workflows, ki jih ustvari, pustijo polja za poverilnice prazna, odgovor pa imenuje vozlišča, ki potrebujejo poverilnico, da jih lahko nastavite v urejevalniku.

Podatkovne tabele delujejo tudi preko MCP: Chat navaja vaše tabele, ustvarja nove in jih povezuje v workflows, ki jih gradi. Njegovo vprašanje o tabeli prispe kot besedilo v rezultatu, zato nanj odgovorite z istim `conversation_id`.

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
## Sorodne

- [MCP Zavihek](./mcp-tab.md) – Izpostavite ta motor strankam MCP kot orodje `heym_chat`
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
