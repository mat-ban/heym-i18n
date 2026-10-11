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
- **Povlecite za izbiro** – Kliknite in povlecite na katerem koli grafu, da osredotočite prilagojeno časovno obdobje
- **Način izbire** – Izbrane vrednosti osvežijo povzetke, grafe in tabele workflow brez spreminjanja osnovne prednastavitve
- **Počisti Izbiro** – Vrnite se na prednastavljeno časovno okno, ko končate z raziskovanjem

## Samodejno Osveževanje

- Omogočite samodejno osveževanje, da ohranite metrike posodobljene brez ročnega osveževanja

## Sorodno

- [Zavihek Workflows](./workflows-tab.md) – Workflows, ki se merijo
- [Zavihek Izvajanja](./traces-tab.md) – Podrobna inspekcija sledi
- [Zavihek Dnevniki](./logs-tab.md) – Dnevniški zapisi izvajanja za odpravljanje napak
- [Kontekstualna Predstavitev](../reference/contextual-showcase.md) – Kompaktni vodnik po straneh nadzorne plošče

Ko graf prikazuje trend, o katerem želite biti obveščeni namesto da bi ga spremljali, ga spremenite v [opozorilo](./alerts-tab.md): število napak, trajanje zagonov, stroški LLM in število izvajanj lahko vsi dobijo prag čez časovno okno.
