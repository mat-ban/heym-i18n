# Tabla

Zavihek **Tabla** je agentna kanban tabla. Delo se premika skozi stolpce, vsak stolpec pa lahko izvaja Heym workflows. Kartica ni le naloga — je trajna agentna naloga, ki nosi kontekst, zgodovino pogovorov, stanje izvajanja, izhode in izvajanja workflowov.

<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>

## Table in stolpci

- Ustvarite lahko toliko tabel, kolikor jih potrebujete. Nova tabla se začne z privzetimi stolpci **Backlog → Načrtovanje → Razvoj → Končano**.
- Vsaka tabla potrebuje **Agentni Kanban Model** (poverenje plus model). To je obvezno — pogovorno okno za novo tablo ne bo ustvarilo tabele brez njega, tabla, ki ga nima, pa ohranja onemogočene svoje akcije — ker je model tisti, ki preslika vsako kartico v vhodne podatke workflowov, ki jih izvaja, in njihove izhode pretvori nazaj v berljivo besedilo.
- Ikona zobnika v glavi tabele odpre nastavitve tabele: ime, opis (prikazan pod glavo) in Agentni Kanban Model.
- Stolpci so popolnoma urejivi: dodajte, preimenujte, spremenite barvo, preuredite ali izbrišite jih iz nastavitev stolpca (stolpec mora biti prazen, preden ga lahko izbrišete).
- Kartice so razporejene navpično po prioriteti — povlecite za preureditev.
- Kartico lahko ustvarite tudi iz [zavihka Chat](./chat-tab.md) z naravno jezikovno zahtevo. Chat vas prosi, da izberete tablo, ko je to potrebno, in vedno doda kartico v prvi stolpec te tabele.

## Deljenje tabele

Nastavitve tabele prav tako delijo tablo z **uporabniki** (po e-pošti) in **skupinami**, z dovoljenjem `branje` ali `pisanje`:

- **branje** — tabla in njene kartice so vidne, vendar se nič ne more spremeniti: nobene nove kartice, nobenih premikov, nobenih komentarjev, nobenih izvajanj.
- **pisanje** — polna uporaba tabele: kartice, premiki, komentarji in izvajanja.
- Le **lastnik** vidi gumba za zobnik in izbris, in le lastnik lahko spremeni nastavitve tabele, njen Agentni Kanban Model ali njeno deljenje.

Verige na skupni tabeli vedno tečejo z **lastnikovimi** poverjenji in Agentnim Kanban Modelom, tako da sodelavci nikoli ne potrebujejo svojih.

## Priponke kartic

Odprite kartico in uporabite **Pripni datoteko** za dodajanje datotek nanjo — spustite jih v polje ali jih izberite s gumbom, in jih odstranite iz istega seznama. Priponke so shranjene v [Drive](./drive-tab.md).

Vsako izvajanje **rešuje priponke pred začetkom workflowov**, po vrsti:

- **Dokumenti** (pdf, markdown, csv, json, text) se izvlečejo v besedilo, omejeno na 20.000 znakov na datoteko, v `text` polju priponke.
- **Slike** se predajo kot `url`, ki ga pot vizije naloži neposredno (vhod slike vozlišča LLM ga sprejme takšnega, kot je).
- **Vse drugo** se prenese kot navadna referenca (`name`, `url`, `mime_type`).

Workflows jih berejo na `$input.card.attachments` (in vedno na `$input.board.attachments`, ne glede na to, kako je mapper preslikal). Agentni Kanban Model vidi tudi izvlečeno besedilo in URL-je slik, tako da lahko priponko neposredno preslika v polje, ki ga workflow pričakuje.

## Verige workflowov stolpcev

Vsak stolpec je mogoče konfigurirati z **urejenim seznamom workflowov** (veriga). Ko kartica preide v stolpec, ki ima verigo:

1. Veriga se samodejno začne v ozadju — premik sam ne čaka.
2. Workflows tečejo **zaporedno**. Izhod vsakega workflowa se doda v kontekst kartice, preden se začne naslednji.
3. Če workflow ne uspe, se veriga ustavi: preostali povezavi se preskočijo in kartica postane **rdeča**.
4. Ko vsak povezava uspe, kartica postane **zelena**. Medtem ko veriga teče, kartica utripa **ambar**; izvajanje, ki je ustavljeno za človeški pregled, prikazuje statično ambar stanje.

Izvajanja so zabeležena v [Zgodovini izvajanja](../reference/execution-history.md) z `board` sprožilnim virom, vsaka kartica pa ohranja svoj seznam izvajanj z izhodi in napakami za vsak workflow. Odprite kartico, medtem ko se workflow izvaja, in izberite **Odpri v živo** poleg izvajanja, da povežete urejevalnik s točno to izvršitvijo. Enaka animacija platna, inkrementalni dnevniški zapisi Debug in končni rezultat se prikažejo brez začetka drugega izvajanja.
## Kaj prejmejo workflows

Veriga posreduje standardni payload kot vhod za workflow. Preberite ga z običajnimi
[izrazi](../reference/expression-dsl.md), kot je `$input.card.title`:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Napišite e-pošto za zagon",
    "content": "Naredite osnutek e-pošte za zagon beta različice",
    "metadata": { "attachments": [{ "name": "brief", "url": "…" }] },
    "comments": [{ "author": "user", "content": "…", "created_at": "…" }],
    "history": [{ "kind": "event", "content": "…", "created_at": "…" }],
    "previous_outputs": [{ "workflow_name": "…", "output": {}, "finished_at": "…" }]
  },
  "board": { "id": "…", "name": "…" },
  "move": { "from_column": "Backlog", "to_column": "Planning" },
  "chain": { "position": 0, "length": 2, "previous_workflow_outputs": [] }
}
```

- `comments` — vsak komentar na kartici, najstarejši najprej.
- `history` — celotna časovnica aktivnosti (komentarji, premiki, izhodi), omejena na
  najnovejših 200 vnosov.
- `previous_outputs` — izhodi iz prejšnjih zaključenih zagonov (prejšnje kolone in
  nadaljnji krogi).
- `chain.previous_workflow_outputs` — izhodi prejšnjih povezav v *trenutni*
  verigi.
- Pri nadaljnjih krogih je `move` `null` in `rerun` je `true`.

## Načrtovalna zanka (nadaljnji krogi)

Pogost vzorec je, da se načrtovalni workflow postavi v **drugo kolono** (privzeto
imenovano Načrtovanje — ime ni pomembno; pomembna je pozicija). Ta workflow obogati
kartico in postavi nadaljnja vprašanja:

1. Premaknite kartico v drugo kolono — workflow zapiše obogaten načrt in njegova
   vprašanja nazaj na kartico kot izhod.
2. Odgovorite v komentarjih na kartici. Odgovor sprosti kartico: premakne se v
   naslednjo kolono, ki jo prevzame z odgovorom v kontekstu. Veriga druge kolone se
   ne izvede ponovno.
3. Če želite izboljšati načrt na mestu, pritisnite **Izvedi nadaljnji krog**. Enaka
   veriga se ponovno izvede z vsemi zbranimi konteksti, nato kartica čaka v tej koloni,
   dokler ne dodate komentarja, da jo sprostite.

Načrtovalna vrata so pozicijska, ne imensko določena: najleva kolona in kolona
takoj desno od nje se nikoli ne premikata sami — izvajata svojo verigo in tam
čakata na vas (komentar sprosti drugo kolono). Od tretje kolone naprej uspešna
veriga samodejno premakne kartico desno, vse do zadnje kolone. Preimenovanje ali
odstranitev privzetega imena "Načrtovanje" ne spremeni, katera pozicija je vrata. 
Kartica lahko ima le en aktiven zagon hkrati.

## Človek v zanki in vprašanja Codex

Če veriga workflow ustavi — na [Human-in-the-Loop](../reference/human-in-the-loop.md)
vozlišču, na orodju HITL agenta ali ker vozlišče [Codex](../nodes/codex-node.md) potrebuje
več informacij — se zagon ohrani kot čakajoč in kartica pokaže rumeno čakajoče
stanje. Vsaka pausa ima svojo površino za odgovore: povezava za pregled HITL za HITL,
zaslon za nadaljevanje Codex za Codex.

Ko odgovorite, se veriga nadaljuje sama: ustavljen workflow se zaključi, njegov izhod
pride na kartico, preostala veriga te kolone se izvede in kartica napreduje kot
običajno. Če se nadaljevanje neuspešno zaključi, kartica postane rdeča in preostale
povezave se preskočijo.

## Sorodno

- [Workflows](./workflows-tab.md)
- [Zgodovina izvajanja](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)

- **Advance cards automatically** in the board settings is on by default. Turn it off for
  a plain team task board: cards then stay in the column people put them in, and column
  workflows still run when a card enters their column.
- You can also manage the board from the [Chat tab](./chat-tab.md) or any MCP client; see
  [From Chat and MCP](#from-chat-and-mcp).

## Card details

Card details open in a wide dialog on desktop and fit the viewport on phones.
Use **Preview** beside **Description** to view Markdown formatting, including unsaved
edits. Choose **Edit** to return to the source text, then **Save description** to keep
your changes. Label chips use brighter text in dark mode; hover over a shortened label
to read its full name.

Open a card to set its **Details**:

- **Assignee** — anyone who can open the board: its owner, and the people and team
  members it is shared with.
- **Priority** — Urgent, High, Medium or Low.
- **Due date** — the card shows it as a chip, amber when it is due today and red when it
  is overdue.
- **Labels** — up to ten short labels, such as a client or a project.

Column workflows receive these fields in the card's `metadata` (`assignee_user_id`,
`priority`, `due_date`, `labels`).

If someone else changes the card while you edit it, saving shows a notice and loads their
version instead of overwriting it. An open board checks for changes made elsewhere (by a
teammate, in Heym Work, from Chat or MCP) every few seconds and redraws.

Moving a card that waits for a review asks first: the move cancels that review. A move
never approves a review; reviews are approved only from the review itself.

## From Chat and MCP

The [Chat tab](./chat-tab.md), Heym Work's chat, and any MCP client through `heym_chat`
can manage boards in plain language, with the same permissions as the Board tab:

- list boards, read a board's columns and cards, and list cards across boards filtered by
  assignee ("my tasks"), column, priority, due date (overdue, today, this week), label or
  review state;
- create a board (Chat turns off automatic advancing for a plain task board), rename it or
  change its settings, and delete it after you confirm its name (owner only). A board Chat
  creates uses the chat's credential and model as its Agentic Kanban Model; ask Chat to
  give its model to one of your boards that has none, such as a board made before this;
- add, rename, reorder and delete columns;
- add, edit, assign, move, reorder and delete cards;
- comment on a card, as you. A comment on a card waiting at the planning step answers its
  agent's questions, and the card moves on, as in the card's own comment box. A comment
  never approves a review.
