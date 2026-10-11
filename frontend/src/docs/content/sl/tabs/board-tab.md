# Tabla

Zavihek **Tabla** je agentna kanban tabla. Delo se premika skozi stolpce, vsak stolpec pa lahko izvaja Heym workflows. Kartica ni le naloga — je trajna agentna naloga, ki nosi kontekst, zgodovino pogovorov, stanje izvajanja, izhode in izvajanja workflowov.

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
