# Tábla

A **Tábla** fül egy ügynökalapú kanban tábla. A munka oszlopokon halad keresztül, és minden
oszlop képes Heym workflow-kat futtatni. Egy kártya nem csupán egy feladat — ez egy tartós,
ügynökalapú feladat, amely kontextust, beszélgetési előzményeket, végrehajtási állapotot, kimeneteket
és workflow-futtatásokat hordoz.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Táblák és oszlopok

- Annyi táblát hozhat létre, amennyire szüksége van. Egy új tábla az alapértelmezett
  oszlopokkal indul: **Backlog → Planning → Development → Done**.
- Minden táblához szükséges egy **Ügynökalapú Kanban Modell** (egy hitelesítési adat és egy modell). Ez
  kötelező — az Új tábla párbeszédablak nem hoz létre táblát enélkül, és egy olyan tábla,
  amelynek nincs ilyenje, letiltott műveletekkel marad —, mert ez a modell az, amely minden
  kártyát leképez az általa futtatott workflow-k bemeneteire, és a kimenetüket visszaalakítja
  olvasható szöveggé.
- A tábla fejlécében lévő fogaskerék ikon nyitja meg a tábla beállításait: név, leírás
  (a fejléc alatt jelenik meg) és az Ügynökalapú Kanban Modell.
- Az oszlopok teljesen szerkeszthetők: hozzáadhat, átnevezhet, átszínezhet, átrendezhet vagy törölhet
  oszlopokat az oszlopbeállításokból (egy oszlopnak üresnek kell lennie a törlés előtt).
- A kártyák prioritás szerint rendeződnek függőlegesen — húzással rendezheti át őket.
- Kártyát a [Chat fülről](./chat-tab.md) is létrehozhat természetes nyelvű
  kéréssel. A Chat szükség esetén megkéri, hogy válasszon táblát, és mindig a kiválasztott
  tábla első oszlopához adja hozzá a kártyát.

## Tábla megosztása

A tábla beállításai lehetővé teszik a tábla megosztását **felhasználókkal** (e-mail cím szerint) és **csapatokkal**,
`read` vagy `write` jogosultsággal:

- **read** — a tábla és kártyái láthatók, de semmi sem módosítható: nincs új
  kártya, nincs áthelyezés, nincs hozzászólás, nincs futtatás.
- **write** — a tábla teljes használata: kártyák, áthelyezések, hozzászólások és futtatások.
- Csak a **tulajdonos** látja a fogaskerék és törlés gombokat, és csak a tulajdonos módosíthatja
  a tábla beállításait, az Ügynökalapú Kanban Modelljét vagy a megosztásait.

A megosztott táblán a láncok mindig a **tulajdonos** hitelesítési adataival és Ügynökalapú Kanban
Modelljével futnak, így a közreműködőknek soha nem kell sajátot biztosítaniuk.

## Kártyamellékletek

Nyisson meg egy kártyát, és használja a **Fájl csatolása** lehetőséget fájlok hozzáadásához — ejtse őket a mezőre, vagy válassza ki
őket a gombbal, és ugyanabból a listából távolítsa el őket. A mellékletek a
[Drive](./drive-tab.md) szolgáltatásban tárolódnak.

Minden futtatás **a workflow-k indulása előtt feloldja a mellékleteket**, típus szerint:

- A **dokumentumokat** (pdf, markdown, csv, json, text) szöveggé alakítja ki, fájlonként legfeljebb 20 000
  karakterrel, a melléklet `text` mezőjében.
- A **képeket** egy `url` formájában adja át, amelyet a vision útvonal közvetlenül betölt (egy LLM csomópont kép
  bemenete változatlanul elfogadja).
- **Minden mást** egyszerű hivatkozásként ad át (`name`, `url`, `mime_type`).

A workflow-k a `$input.card.attachments` útvonalon olvassák be őket (és mindig a `$input.board.attachments`
útvonalon, függetlenül attól, hogy a leképező mit képezett le). Az Ügynökalapú Kanban Modell látja a kinyert szöveget és a kép
URL-eket is, így egy mellékletet közvetlenül abba a mezőbe képezhet le, amelyet egy workflow elvár.

## Oszlop workflow-láncok

Minden oszlop konfigurálható egy **workflow-k rendezett listájával** (a lánccal).
Amikor egy kártya olyan oszlopba kerül, amelynek van lánca:

1. A lánc automatikusan elindul a háttérben — maga az áthelyezés soha nem vár.
2. A workflow-k **sorban** futnak. Minden workflow kimenete hozzáfűződik a kártya
   kontextusához, mielőtt a következő elindul.
3. Ha egy workflow meghiúsul, a lánc leáll: a fennmaradó láncszemek kimaradnak, és a
   kártya **pirosra** vált.
4. Amikor minden láncszem sikeres, a kártya **zöldre** vált. Amíg a lánc fut,
   a kártya **borostyánsárgán** pulzál; az emberi felülvizsgálatra szüneteltetett futtatás statikus borostyánsárga
   állapotot mutat.

A futtatások az [Execution History](../reference/execution-history.md) oldalon kerülnek rögzítésre a
`board` trigger forrással, és minden kártya saját futtatási listát vezet workflow-nkénti
kimenetekkel és hibákkal. Nyisson meg egy kártyát, miközben egy workflow fut, és válassza az **Open live** lehetőséget a
futtatás mellett, hogy a szerkesztőt ehhez a konkrét végrehajtáshoz csatolja. Ugyanaz a vászon-animáció, a növekményes
Debug naplók és a végső eredmény jelenik meg anélkül, hogy egy második futtatás indulna.
## Mit kapnak a workflow-k

A lánc egy szabványos payloadot ad át a workflow bemeneteként. Ez normál
[kifejezésekkel](../reference/expression-dsl.md) olvasható ki, például `$input.card.title`:

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

- `comments` — a kártya összes hozzászólása, a legrégebbitől kezdve.
- `history` — a teljes aktivitási idővonal (hozzászólások, mozgatások, kimenetek), a
  legutóbbi 200 bejegyzésre korlátozva.
- `previous_outputs` — a korábbi befejezett futtatások kimenetei (korábbi oszlopok és
  utólagos fordulók).
- `chain.previous_workflow_outputs` — az *aktuális* lánc korábbi elemeinek kimenetei.
- Utólagos fordulók esetén a `move` értéke `null`, a `rerun` pedig `true`.

## A tervezési ciklus (utólagos fordulók)

Gyakori minta, hogy egy tervezési workflow-t a **második oszlopba** helyezünk (alapértelmezés
szerint Planning a neve — a név nem számít; a hely számít). Ez a workflow gazdagítja a
kártyát, és utólagos kérdéseket tesz fel:

1. Mozgasson egy kártyát a második oszlopba — a workflow egy gazdagított tervet és annak
   kérdéseit írja vissza a kártyára kimenetként.
2. Válaszoljon a kártya hozzászólásfolyamában. A válasz elengedi a kártyát: továbbhalad a
   következő oszlopba, amely a választ kontextusban felvéve dolgozza fel. A második oszlop
   lánca nem fut le újra.
3. Ha inkább helyben szeretné javítani a tervet, nyomja meg a **Run follow-up round**
   gombot. Ugyanaz a lánc fut le újra az összes felhalmozott kontextussal, majd a kártya
   abban az oszlopban várakozik, amíg Ön egy hozzászólással el nem engedi.

A tervezési kapu pozicionális, nem névalapú: a bal szélső oszlop és a közvetlenül tőle
jobbra lévő oszlop soha nem halad tovább magától — lefuttatják a láncukat, és ott várnak
Önre (a második oszlopot egy hozzászólás engedi el). A harmadik oszloptól kezdve egy
sikeres lánc magától jobbra mozgatja a kártyát, egészen az utolsó oszlopig. Az
alapértelmezett „Planning" címke átnevezése vagy eltávolítása nem változtatja meg, hogy
melyik hely a kapu. Egy kártyához egyszerre csak egy aktív futtatás tartozhat.

## Human-in-the-Loop és Codex kérdések

Ha egy lánc workflow szünetel — egy [Human-in-the-Loop](../reference/human-in-the-loop.md)
csomóponton, egy ügynök HITL eszközén, vagy mert egy [Codex](../nodes/codex-node.md)
csomópontnak további információra van szüksége —, a futtatás függőben lévőként marad
meg, és a kártya a borostyánsárga függőben lévő állapotot mutatja. Minden szüneteltetés
megtartja a saját válaszfelületét: HITL esetén egy HITL felülvizsgálati hivatkozást,
Codex esetén a Codex utólagos képernyőt.

Amint Ön válaszol, a lánc magától folytatódik: a szüneteltetett workflow befejeződik, a
kimenete a kártyára kerül, az adott oszlop láncának többi része lefut, és a kártya a
szokásos módon továbbhalad. Ha a folytatott futtatás meghiúsul, a kártya pirosra vált, és
a fennmaradó elemek kimaradnak.

## Kapcsolódó témák

- [Workflows](./workflows-tab.md)
- [Execution History](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
