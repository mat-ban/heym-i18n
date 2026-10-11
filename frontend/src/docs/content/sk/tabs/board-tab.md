# Board

Karta **Board** je agentický kanban board. Práca postupuje cez stĺpce a každý
stĺpec môže spúšťať workflowy Heym. Karta nie je len úloha — je to trvalá
agentická úloha, ktorá nesie kontext, históriu konverzácie, stav spustenia, výstupy
a spustenia workflowov.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Boardy a stĺpce

- Môžete vytvoriť toľko boardov, koľko potrebujete. Nový board začína s predvolenými
  stĺpcami **Backlog → Planning → Development → Done**.
- Každý board potrebuje **Agentic Kanban Model** (prihlasovacie údaje a model). Je
  povinný — dialógové okno Nový board bez neho board nevytvorí a board,
  ktorý žiadny nemá, má svoje akcie zakázané — pretože práve model mapuje každú
  kartu do vstupov workflowov, ktoré spúšťa, a premieňa ich výstup späť na
  čitateľný text.
- Ikona ozubeného kolieska v hlavičke boardu otvára nastavenia boardu: názov, popis
  (zobrazený pod hlavičkou) a Agentic Kanban Model.
- Stĺpce sú plne upraviteľné: pridávajte, premenúvajte, prefarbujte, presúvajte alebo odstraňujte ich v
  nastaveniach stĺpca (stĺpec musí byť prázdny, aby sa dal odstrániť).
- Karty sú zoradené vertikálne podľa priority — potiahnutím ich preusporiadate.
- Kartu môžete vytvoriť aj z [karty Chat](./chat-tab.md) pomocou požiadavky
  v prirodzenom jazyku. Chat vás v prípade potreby vyzve na výber boardu a kartu vždy pridá do
  prvého stĺpca daného boardu.

## Zdieľanie boardu

Nastavenia boardu tiež umožňujú zdieľať board s **používateľmi** (podľa e-mailu) a s
**tímami**, s oprávnením `read` alebo `write`:

- **read** — board a jeho karty sú viditeľné, ale nič sa nedá meniť: žiadne nové
  karty, žiadne presuny, žiadne komentáre, žiadne spustenia.
- **write** — plné používanie boardu: karty, presuny, komentáre a spustenia.
- Iba **vlastník** vidí ozubené koliesko a tlačidlá na odstránenie a iba vlastník môže meniť
  nastavenia boardu, jeho Agentic Kanban Model alebo jeho zdieľania.

Reťazce na zdieľanom boarde vždy bežia s **vlastníkovými** prihlasovacími údajmi a Agentic Kanban
Modelom, takže spolupracovníci nikdy nepotrebujú svoje vlastné.

## Prílohy kariet

Otvorte kartu a pomocou **Attach file** k nej pridajte súbory — presuňte ich na pole alebo ich vyberte
tlačidlom a odstráňte ich z rovnakého zoznamu. Prílohy sú uložené v
[Drive](./drive-tab.md).

Každé spustenie **vyrieši prílohy pred spustením workflowov**, podľa typu:

- **Dokumenty** (pdf, markdown, csv, json, text) sa extrahujú na text, s limitom 20 000
  znakov na súbor, do poľa `text` prílohy.
- **Obrázky** sa odovzdajú ako `url`, ktoré vizuálna cesta načíta priamo (obrazový
  vstup uzla LLM ho akceptuje tak, ako je).
- **Čokoľvek iné** sa odovzdá ako obyčajná referencia (`name`, `url`, `mime_type`).

Workflowy ich čítajú na `$input.card.attachments` (a vždy na `$input.board.attachments`,
nech už mapper namapoval čokoľvek). Agentic Kanban Model vidí extrahovaný text aj URL
obrázkov, takže môže namapovať prílohu priamo do poľa, ktoré workflow očakáva.

## Reťazce workflowov stĺpcov

Každý stĺpec sa dá nakonfigurovať s **usporiadaným zoznamom workflowov** (reťazec).
Keď sa karta presunie do stĺpca, ktorý má reťazec:

1. Reťazec sa spustí automaticky na pozadí — samotný presun nikdy nečaká.
2. Workflowy bežia **sekvenčne**. Výstup každého workflowu sa pripojí ku kontextu karty
   predtým, než sa spustí ďalší.
3. Ak workflow zlyhá, reťazec sa zastaví: zostávajúce články sa preskočia a
   karta sčervenie.
4. Keď každý článok uspeje, karta sa sfarbí **nazeleno**. Kým reťazec beží,
   karta pulzuje **jantárovo**; spustenie pozastavené na ľudskú kontrolu zobrazuje statický jantárový
   stav.

Spustenia sa zaznamenávajú v [Execution History](../reference/execution-history.md) so
zdrojom triggera `board` a každá karta si vedie vlastný zoznam spustení s výstupmi
a chybami jednotlivých workflowov. Otvorte kartu počas behu workflowu a vyberte **Open live** vedľa
spustenia, čím pripojíte editor k presne tomuto spusteniu. Zobrazí sa rovnaká animácia plátna, prírastkové
Debug logy a konečný výsledok bez spustenia druhého behu.
## Čo workflowy dostávajú

Reťaz odovzdáva štandardný payload ako vstup workflowu. Prečítajte ho pomocou bežných
[expressions](../reference/expression-dsl.md), ako napríklad `$input.card.title`:

```json
{
  "triggered_by": "board",
  "rerun": false,
  "card": {
    "id": "…",
    "title": "Write launch email",
    "content": "Draft the launch email for the beta",
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

- `comments` — všetky komentáre na karte, od najstaršieho.
- `history` — kompletná časová os aktivity (komentáre, presuny, výstupy), obmedzená na
  najnovších 200 záznamov.
- `previous_outputs` — výstupy z predchádzajúcich dokončených spustení (predchádzajúce stĺpce a
  následné kolá).
- `chain.previous_workflow_outputs` — výstupy predchádzajúcich článkov v *aktuálnej*
  reťazi.
- V následných kolách je `move` nastavené na `null` a `rerun` je `true`.

## Plánovacia slučka (následné kolá)

Bežným vzorom je umiestniť plánovací workflow do **druhého stĺpca** (predvolene
nazvaného Planning — na názve nezáleží; záleží na pozícii). Tento workflow obohacuje
kartu a kladie následné otázky:

1. Presuňte kartu do druhého stĺpca — workflow zapíše obohatený plán a svoje
   otázky späť na kartu ako výstup.
2. Odpovedzte vo vlákne komentárov karty. Odpoveď uvoľní kartu: tá sa presunie do
   ďalšieho stĺpca, ktorý ju prevezme s odpoveďou v kontexte. Reťaz druhého stĺpca sa už
   znovu nespustí.
3. Ak chcete namiesto toho vylepšiť plán priamo na mieste, stlačte **Run follow-up round**. Spustí sa
   tá istá reťaz s celým nahromadeným kontextom a karta potom čaká v tomto stĺpci,
   kým nepridáte komentár, ktorý ju uvoľní.

Plánovacia brána je pozicionálna, nie založená na názve: najľavejší stĺpec a stĺpec
bezprostredne napravo od neho sa nikdy neposúvajú samy — spustia svoju reťaz a čakajú
tam na vás (komentár uvoľní druhý stĺpec). Od tretieho stĺpca ďalej úspešná reťaz posúva
kartu doprava sama, až po posledný stĺpec. Premenovanie alebo odstránenie predvoleného
označenia „Planning" nemení to, ktorá pozícia je bránou. Karta môže mať súčasne iba jedno aktívne spustenie.

## Human-in-the-loop a otázky Codex

Ak sa workflow v reťazi pozastaví — na uzle [Human-in-the-Loop](../reference/human-in-the-loop.md),
na HITL nástroji agenta alebo preto, že uzol [Codex](../nodes/codex-node.md) potrebuje
viac informácií — spustenie sa uloží ako čakajúce a karta zobrazuje jantárový stav
čakania. Každé pozastavenie si zachováva vlastnú plochu na odpoveď: odkaz na HITL kontrolu pre HITL,
obrazovku následného kroku Codex pre Codex.

Po odpovedi sa reťaz sama obnoví: pozastavený workflow sa dokončí, jeho výstup
sa uloží na kartu, zvyšok reťaze daného stĺpca sa spustí a karta sa posunie ako obvykle.
Ak obnovené spustenie zlyhá, karta sčervenie a zostávajúce články sa preskočia.

## Súvisiace

- [Workflows](./workflows-tab.md)
- [Execution History](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
