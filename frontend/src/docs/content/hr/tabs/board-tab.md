# Odbor

Tab **Odbor** predstavlja agentnu kanban ploču. Rad se kreće kroz stupce, a svaki stupac može izvršavati Heym workflows. Kartica nije samo zadatak — to je trajni agentni posao koji nosi kontekst, povijest razgovora, stanje izvršavanja, izlaze i pokretanja workflows-a.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Pogledajte demo Odbora</a></p>
-->

## Odbori i stupci

- Možete kreirati onoliko odbora koliko vam je potrebno. Novi odbor započinje s zadanim stupcima **Backlog → Planiranje → Razvoj → Završeno**.
- Svakom odboru potrebna je **Agentna Kanban Mreža** (vjerodajnica plus model). To je obavezno — dijalog za novi odbor neće stvoriti odbor bez jednog, a odbor koji ga nema zadržava onemogućene akcije — jer je model taj koji mapira svaku karticu u ulaze workflows-a koje pokreće i pretvara njihove izlaze natrag u čitljiv tekst.
- Ikona zupčanika u zaglavlju odbora otvara postavke odbora: naziv, opis (prikazan ispod zaglavlja) i Agentnu Kanban Mrežu.
- Stupci su potpuno uređivi: dodajte, preimenujte, promijenite boju, promijenite redoslijed ili ih izbrišite iz postavki stupca (stupac mora biti prazan prije nego što ga možete izbrisati).
- Kartice su poredane vertikalno prema prioritetu — povucite za promjenu redoslijeda.
- Također možete stvoriti karticu iz [Chat taba](./chat-tab.md) s zahtjevom na prirodnom jeziku. Chat vas traži da odaberete odbor kada je to potrebno i uvijek dodaje karticu u prvi stupac tog odbora.

## Dijeljenje odbora

Postavke odbora također dijele odbor s **korisnicima** (prema e-pošti) i s **timovima**, s `read` ili `write` dozvolama:

- **read** — odbor i njegove kartice su vidljive, ali ništa se ne može promijeniti: nema novih kartica, nema premještanja, nema komentara, nema pokretanja.
- **write** — potpuna upotreba odbora: kartice, premještanja, komentari i pokretanja.
- Samo **vlasnik** vidi ikone zupčanika i gumbe za brisanje, a samo vlasnik može promijeniti postavke odbora, njegovu Agentnu Kanban Mrežu ili dijeljenja.

Lanci na dijeljenom odboru uvijek se izvršavaju s vjerodajnicama i Agentnom Kanban Mrežom **vlasnika**, tako da suradnici nikada ne trebaju svoje.

## Prilozi karticama

Otvorite karticu i upotrijebite **Priloži datoteku** za dodavanje datoteka — ispustite ih u okvir ili ih odaberite gumbom, a uklonite ih iz iste liste. Prilozi se pohranjuju u [Drive](./drive-tab.md).

Svako pokretanje **razrješava priloge prije nego što workflows započnu**, prema vrsti:

- **Dokumenti** (pdf, markdown, csv, json, tekst) se izvode u tekst, ograničeno na 20,000 znakova po datoteci, u `text` polju priloga.
- **Slike** se predaju kao `url` koji vizualni put učitava izravno (ulaz slike LLM čvora prihvaća ga takvog kakav jest).
- **Sve ostalo** se prosljeđuje kao obična referenca (`name`, `url`, `mime_type`).

Workflows ih čitaju na `$input.card.attachments` (i uvijek na `$input.board.attachments`, bez obzira na to kako je mapper mapirao). Agentna Kanban Mreža također vidi izdvojeni tekst i URL-ove slika, tako da može mapirati prilog izravno u polje koje workflow očekuje.

## Lanci workflows-a stupca

Svaki stupac može biti konfiguriran s **uređenim popisom workflows-a** (lanac). Kada kartica pređe u stupac koji ima lanac:

1. Lanac se automatski pokreće u pozadini — samo premještanje nikada ne čeka.
2. Workflows se izvršavaju **sekvencijalno**. Izlaz svakog workflows-a se dodaje u kontekst kartice prije nego što sljedeći započne.
3. Ako neki workflow ne uspije, lanac se zaustavlja: preostali linkovi se preskoče, a kartica postaje **crvena**.
4. Kada svaki link uspije, kartica postaje **zelena**. Dok se lanac izvršava, kartica pulsira **žutom**; pokretanje pauzirano za ljudsku reviziju prikazuje statičko žuto stanje.

Pokretanja se bilježe u [Povijesti izvršavanja](../reference/execution-history.md) s `board` izvorom okidača, a svaka kartica zadržava svoju vlastitu listu pokretanja s izlazima i pogreškama po workflows-u. Otvorite karticu dok se workflow izvršava i odaberite **Otvorite uživo** pored pokretanja kako biste povezali uređivač s tom točno tom izvršenjem. Ista animacija platna, inkrementalni Debug logovi i konačni rezultat pojavljuju se bez pokretanja drugog pokretanja.
## Što primaju workflows

Lanac prosljeđuje standardni payload kao ulaz za workflow. Pročitajte ga pomoću normalnih
[izraza](../reference/expression-dsl.md) kao što je `$input.card.title`:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Napišite e-mail za lansiranje",
    "content": "Nacrtajte e-mail za lansiranje beta verzije",
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

- `comments` — svaki komentar na kartici, od najstarijeg prema najnovijem.
- `history` — cjelokupna vremenska linija aktivnosti (komentari, premještaji, izlazi), ograničena na najnovijih 200 unosa.
- `previous_outputs` — izlazi iz ranijih završenih izvršavanja (prethodni stupci i naknadni krugovi).
- `chain.previous_workflow_outputs` — izlazi ranijih veza u *trenutnom* lancu.
- U naknadnim krugovima `move` je `null` i `rerun` je `true`.

## Petlja planiranja (naknadni krugovi)

Uobičajeni obrazac je postaviti workflow planiranja u **drugi stupac** (po defaultu nazvan Planning — naziv nije bitan; slot jest). Taj workflow obogaćuje karticu i postavlja dodatna pitanja:

1. Premjestite karticu u drugi stupac — workflow zapisuje obogaćeni plan i svoja pitanja natrag na karticu kao izlaz.
2. Odgovorite u komentarskoj niti kartice. Odgovor oslobađa karticu: ona prelazi u sljedeći stupac, koji je preuzima s odgovorom u kontekstu. Lanac drugog stupca se ne pokreće ponovno.
3. Da biste poboljšali plan na mjestu, pritisnite **Pokreni naknadni krug**. Isti lanac se ponovno pokreće sa svim akumuliranim kontekstom, a zatim kartica čeka u tom stupcu dok ne dodate komentar za oslobađanje.

Planerska vrata su pozicijska, a ne temeljena na nazivu: lijevi stupac i stupac odmah desno od njega nikada se ne pomiču sami — pokreću svoj lanac i čekaju vas (komentar oslobađa drugi stupac). Od trećeg stupca nadalje, uspješan lanac samostalno pomiče karticu udesno, sve do posljednjeg stupca. Preimenovanje ili uklanjanje zadane oznake "Planning" ne mijenja koji slot je vrata. Kartica može imati samo jedno aktivno izvršavanje u isto vrijeme.

## Čovjek u petlji i Codex pitanja

Ako lanac workflowa pauzira — na [Human-in-the-Loop](../reference/human-in-the-loop.md)
čvoru, na HITL alatu agenta, ili zato što čvor [Codex](../nodes/codex-node.md) treba
više informacija — izvršavanje se čuva kao neodređeno i kartica prikazuje narančasto stanje čekanja. Svaka pauza zadržava svoju vlastitu površinu odgovora: HITL pregledna poveznica za HITL, Codex ekran za naknadna pitanja za Codex.

Jednom kada odgovorite, lanac se nastavlja sam: pauzirani workflow završava, njegov izlaz dolazi na karticu, ostatak lanca tog stupca se pokreće, a kartica napreduje kao i obično. Ako se nastavljeno izvršavanje ne uspije, kartica postaje crvena i preostale veze se preskoče.

## Povezano

- [Workflows](./workflows-tab.md)
- [Povijest izvršavanja](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
