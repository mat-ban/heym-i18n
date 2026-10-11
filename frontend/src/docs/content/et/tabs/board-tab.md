# Tahvel

Vahekaart **Tahvel** on agentne kanban-tahvel. Töö liigub veergude kaupa ja iga
veerg saab käivitada Heymi workflow'sid. Kaart ei ole lihtsalt ülesanne — see on püsiv
agentne töö, mis kannab endas konteksti, vestlusajalugu, käivituse olekut, väljundeid
ja workflow'de käivitusi.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Tahvlid ja veerud

- Võite luua nii palju tahvleid, kui vajate. Uus tahvel algab vaikeveergudega
  **Backlog → Planning → Development → Done**.
- Igal tahvlil peab olema **Agentic Kanban Model** (mandaat koos mudeliga). See on
  kohustuslik — uue tahvli dialoog ei loo tahvlit ilma selleta ja tahvel, millel seda
  pole, hoiab oma toimingud keelatud — sest just mudel vastendab iga kaardi
  käivitatavate workflow'de sisenditeks ja muudab nende väljundi tagasi
  loetavaks tekstiks.
- Hammasratta ikoon tahvli päises avab tahvli seaded: nimi, kirjeldus
  (kuvatakse päise all) ja Agentic Kanban Model.
- Veerud on täielikult muudetavad: lisage, nimetage ümber, muutke värvi, järjestage ümber või kustutage neid
  veeru seadetest (veerg peab olema tühi, enne kui selle saab kustutada).
- Kaardid on järjestatud vertikaalselt prioriteedi järgi — lohistage ümberjärjestamiseks.
- Kaardi saab luua ka [Chati vahekaardilt](./chat-tab.md) loomulikus keeles
  esitatud taotlusega. Chat palub vajadusel valida tahvli ja lisab kaardi alati selle
  tahvli esimesse veergu.

## Tahvli jagamine

Tahvli seaded võimaldavad tahvlit jagada ka **kasutajatega** (e-posti järgi) ja **tiimidega**,
kas `read` või `write` õigusega:

- **read** — tahvel ja selle kaardid on nähtavad, kuid midagi ei saa muuta: ei uusi
  kaarte, ei liigutamist, ei kommentaare, ei käivitusi.
- **write** — tahvli täielik kasutamine: kaardid, liigutamised, kommentaarid ja käivitused.
- Ainult **omanik** näeb hammasratta ja kustutamise nuppe ning ainult omanik saab muuta
  tahvli seadeid, selle Agentic Kanban Modelit või jagamisi.

Jagatud tahvli ahelad käivitatakse alati **omaniku** mandaatide ja Agentic Kanban
Modeliga, seega kaastöötajad ei vaja kunagi omaenda omi.

## Kaardi manused

Avage kaart ja kasutage **Attach file**, et lisada sellele faile — kukutage need kasti või valige need
nupuga ning eemaldage need samast loendist. Manused salvestatakse
[Drive'i](./drive-tab.md).

Iga käivitus **lahendab manused enne workflow'de algust**, tüübi järgi:

- **Dokumendid** (pdf, markdown, csv, json, text) ekstraktitakse tekstiks, ülempiiriga 20 000
  tähemärki faili kohta, manuse `text` väljal.
- **Pildid** antakse üle `url`-ina, mille vision-tee otse laeb (LLM node'i pildi
  sisend võtab selle vastu muutmata kujul).
- **Kõik muu** edastatakse lihtsa viitena (`name`, `url`, `mime_type`).

Workflow'd loevad neid aadressil `$input.card.attachments` (ja alati aadressil `$input.board.attachments`,
olenemata sellest, mida vastendaja vastendas). Agentic Kanban Model näeb ekstraktitud teksti ja piltide
URL-e samuti, seega saab see manuse vastendada otse väljale, mida workflow ootab.

## Veeru workflow'de ahelad

Iga veeru saab konfigureerida **järjestatud workflow'de loendiga** (ahel).
Kui kaart liigub veergu, millel on ahel:

1. Ahel käivitub automaatselt taustal — liigutamine ise ei oota kunagi.
2. Workflow'd käivitatakse **järjestikku**. Iga workflow väljund lisatakse kaardi
   kontekstile enne, kui järgmine algab.
3. Kui workflow nurjub, peatub ahel: ülejäänud lülid jäetakse vahele ja
   kaart muutub **punaseks**.
4. Kui iga lüli õnnestub, muutub kaart **roheliseks**. Ahela töötamise ajal
   pulseerib kaart **merevaigukollaselt**; inimülevaatuseks peatatud käivitus kuvab staatilist merevaigukollast
   olekut.

Käivitused salvestatakse [Execution History's](../reference/execution-history.md)
`board` triggeri allikaga ning iga kaart hoiab oma käivituste loendit workflow-põhiste
väljundite ja vigadega. Avage kaart workflow töötamise ajal ja valige **Open live** käivituse kõrval,
et kinnitada redaktor täpselt sellele käivitusele. Sama lõuendi animatsioon, kasvavad
Debug-logid ja lõpptulemus ilmuvad ilma teist käivitust alustamata.
## Mida workflow'd vastu võtavad

Ahel edastab workflow sisendina standardse payload'i. Seda saab lugeda tavaliste
[avaldiste](../reference/expression-dsl.md) abil, näiteks `$input.card.title`:

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

- `comments` — kõik kaardil olevad kommentaarid, vanimast alates.
- `history` — täielik tegevuste ajatelg (kommentaarid, liigutamised, väljundid), piiratud
  viimase 200 kirjega.
- `previous_outputs` — varasemate lõpetatud käivituste väljundid (eelmised veerud ja
  järelvoorud).
- `chain.previous_workflow_outputs` — *praeguse* ahela varasemate lülide väljundid.
- Järelvoorudes on `move` väärtusega `null` ja `rerun` väärtusega `true`.

## Planeerimistsükkel (järelvoorud)

Levinud muster on paigutada planeerimise workflow **teise veergu** (vaikimisi nimega
Planning — nimi ei loe; loeb pesa). See workflow rikastab kaarti ja esitab
järelküsimusi:

1. Liigutage kaart teise veergu — workflow kirjutab rikastatud plaani ja oma
   küsimused kaardile väljundina tagasi.
2. Vastake kaardi kommentaaride lõimes. Vastus vabastab kaardi: see liigub edasi
   järgmisesse veergu, mis võtab selle vastu kontekstis oleva vastusega. Teise veeru
   ahelat uuesti ei käivitata.
3. Plaani kohapeal täiustamiseks vajutage **Run follow-up round**. Sama ahel
   käivitub uuesti kogu kogunenud kontekstiga, seejärel ootab kaart selles veerus,
   kuni lisate vabastamiseks kommentaari.

Planeerimisvärav on positsiooniline, mitte nimel põhinev: kõige vasakpoolsem veerg ja
sellest vahetult paremal olev veerg ei liigu kunagi ise edasi — need käivitavad oma
ahela ja ootavad seal teid (kommentaar vabastab teise veeru). Alates kolmandast veerust
viib edukas ahel kaardi iseseisvalt paremale, kuni viimase veeruni välja. Vaikimisi
sildi "Planning" ümbernimetamine või eemaldamine ei muuda seda, milline pesa on
värav. Kaardil saab korraga aktiivne olla ainult üks käivitus.

## Inimene-tsüklis ja Codexi küsimused

Kui ahela workflow peatub — [Human-in-the-Loop](../reference/human-in-the-loop.md)
sõlmel, agendi HITL-tööriistal või seetõttu, et [Codex](../nodes/codex-node.md) sõlm
vajab lisateavet —, salvestatakse käivitus ootelolevana ja kaart kuvab kollast
ooteoleku olekut. Igal pausil on oma vastusepind: HITL-i jaoks HITL-i ülevaatamise
link, Codexi jaoks Codexi järelküsimuste ekraan.

Kui vastate, jätkub ahel iseseisvalt: peatatud workflow lõpetab töö, selle väljund
jõuab kaardile, ülejäänud selle veeru ahel käivitub ja kaart liigub edasi nagu
tavaliselt. Kui jätkatud käivitus ebaõnnestub, muutub kaart punaseks ja ülejäänud
lülid jäetakse vahele.

## Seotud

- [Workflows](./workflows-tab.md)
- [Käivituste ajalugu](../reference/execution-history.md)
- [Avaldise DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
