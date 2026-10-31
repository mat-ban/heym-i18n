# Zavihek Analitika

Zavihek **Analitika** prikazuje metrike in trende izvajanja vaših workflows. Spremljajte uporabo, zmogljivost in identificirajte ozka grla.

<video src="/features/showcase/analytics.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/analytics.webm">▶ Oglejte si predstavitev analitike</a></p>

## Povzetek Statistika

- **Skupno število izvajanj** – Število zagonov workflow v izbranem obdobju
- **Stopnja uspešnosti** – Delež uspešnih zagonov
- **Povprečna trajanje** – Povprečni čas izvajanja
- **Prihranjen čas** – Skupni ocenjeni prihranek časa: minute prihranjene na zagon za vsak workflow × število uspešnih zagonov, seštevanje čez izbrano obdobje
- **Trendi** – Kazalniki navzgor/navzdol v primerjavi s prejšnjim obdobjem

## Časovno Obdobje

- **1h**, **3h**, **6h** – Zadnja 1 ura, 3 ure ali 6 ur. Analitika se beleži po urah, zato te možnosti upoštevajo začetno uro okna v celoti: Zadnja ura ob 15:20 pokriva čas od 14:00 do zdaj
- **24h** – Zadnjih 24 ur
- **7d** – Zadnjih 7 dni
- **30d** – Zadnjih 30 dni
- **Vse** – Celotna razpoložljiva zgodovina

## Filter Workflow

- Filtrirajte metrike po specifičnem workflow
- **Vsi workflows** – Agregacija čez vse workflows

## Tabele

Dve tabeli prikazujeta uporabo workflow: **Najbolj Uporabljeni** (širša) in **Najbolj Neuspešni**.

- **Prihranjen Čas** – Najbolj Uporabljeni prikazuje skupni prihranek časa vsakega workflow (minute prihranjene na zagon × uspešni zagon). **Ni Nastavljeno** pomeni, da ocena manjka; kliknite to, da odprete to polje na workflow.
- **Razvrstljive stolpce** – Kliknite glavo stolpca, da razvrstite po tem stolpcu. Kliknite znova, da preklopite med naraščajočim/upočasnjujočim. Kazalniki puščic prikazujejo smer razvrščanja.
- **Mobilne oznake** – Na majhnih zaslonih so oznake stolpcev skrajšane (npr. "Izvajanja" → "Zagoni", "Uspeh" → "OK", "Napaka" → "Err"), da tabele ustrezajo brez horizontalnega pomikanja.

## Grafi

- **Obseg Izvajanja Čez Čas** – Črtni graf z izvajanji na časovnem intervalu
- **Stopnja Uspeha proti Napaki** – Območje graf, ki primerja zdrave in neuspešne zagon
- **Povprečna Latenca Čez Čas** – Črtni graf, ki prikazuje spremembe časa odziva
- **Povlecite za izbiro** – Kliknite in povlecite na katerem koli grafikonu, da se osredotočite na prilagojeno časovno obdobje. Izbira mora zajemati vsaj dve točki na grafikonu; preprost klik ne izbere ničesar
- **Način izbire** – Izbrane vrednosti osvežijo povzetke, grafe in tabele workflow brez spreminjanja osnovne prednastavitve
- **Počisti Izbiro** – Vrnite se na prednastavljeno časovno okno, ko končate z raziskovanjem

## Vrste vozlišč

Pod percentili latence trije grafikoni prikazujejo, kam gre čas in kje se pojavljajo napake vozlišč, razvrščeni po vrsti vozlišča (Agent, HTTP Request, Code itd.) v vseh prikazanih workflowih:

- **Časovno najzahtevnejša vozlišča** – 10 vrst vozlišč z največjim skupnim časom izvajanja, prikazanih kot povprečno trajanje na klic. Ura brez klicev določene vrste v orodnem namigu prikaže **Brez klicev**.
- **Vrste vozlišč z največ napakami** – 10 vrst vozlišč z največjim številom napak (napaka ali timeout), vsaka z lastnim številom napak na časovni interval.
- **Najpogosteje klicane vrste vozlišč** – 10 vrst vozlišč, ki so se izvajala najpogosteje, vsaka z lastnim številom klicev na časovni interval. Preskočena vozlišča se ne štejejo.

Z miško se pomaknite nad grafikon, da vidite vrsto vozlišča tik ob kazalcu. Vrsta vozlišča, ki je premajhna, da bi bila vidna poleg največje na grafikonu (manj kot 1 % njene vrednosti), se izključi iz tega grafikona in njegove legende. Grafikoni upoštevajo filter workflowa, časovni razpon in kateri koli razpon, izbran s potegom. Analitika vozlišč se beleži za zagone od različice, ki jo je uvedla; zaključen zagon se prikaže v približno eni minuti. Starejši zagoni se ne upoštevajo.

## Samodejno Osveževanje

- Omogočite samodejno osveževanje, da ohranite metrike posodobljene brez ročnega osveževanja

## Sorodno

- [Zavihek Workflows](./workflows-tab.md) – Workflows, ki se merijo
- [Zavihek Izvajanja](./traces-tab.md) – Podrobna inspekcija sledi
- [Zavihek Dnevniki](./logs-tab.md) – Dnevniški zapisi izvajanja za odpravljanje napak
- [Kontekstualna Predstavitev](../reference/contextual-showcase.md) – Kompaktni vodnik po straneh nadzorne plošče

Ko graf prikazuje trend, o katerem želite biti obveščeni namesto da bi ga spremljali, ga spremenite v [opozorilo](./alerts-tab.md): število napak, trajanje zagonov, stroški LLM in število izvajanj lahko vsi dobijo prag čez časovno okno.
