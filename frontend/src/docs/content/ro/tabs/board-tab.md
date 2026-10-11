# Board

Fila **Board** este un kanban agentic. Lucrările avansează prin coloane, iar fiecare
coloană poate executa workflow-uri Heym. Un card nu este doar o sarcină — este un job
agentic persistent care păstrează contextul, istoricul conversației, starea execuției,
rezultatele și rulările workflow-urilor.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Board-uri și coloane

- Puteți crea câte board-uri aveți nevoie. Un board nou începe cu coloanele implicite
  **Backlog → Planning → Development → Done**.
- Fiecare board necesită un **Agentic Kanban Model** (o credențială plus un model). Acesta
  este obligatoriu — dialogul New board nu va crea un board fără el, iar un board care nu
  are niciunul își menține acțiunile dezactivate — deoarece modelul este cel care mapează
  fiecare card în input-urile workflow-urilor pe care le rulează și transformă rezultatul
  acestora înapoi în text lizibil.
- Pictograma de setări din antetul board-ului deschide setările board-ului: nume, descriere
  (afișată sub antet) și Agentic Kanban Model.
- Coloanele sunt complet editabile: adăugați, redenumiți, recolorați, reordonați sau
  ștergeți coloane din setările coloanei (o coloană trebuie să fie goală înainte de a putea
  fi ștearsă).
- Cardurile sunt ordonate vertical după prioritate — trageți pentru a reordona.
- Puteți crea, de asemenea, un card din [fila Chat](./chat-tab.md) printr-o cerere în
  limbaj natural. Chat vă solicită să selectați un board atunci când este necesar și
  adaugă întotdeauna cardul în prima coloană a board-ului respectiv.

## Partajarea unui board

Setările board-ului permit de asemenea partajarea board-ului cu **utilizatori** (prin email)
și cu **echipe**, cu permisiunea `read` sau `write`:

- **read** — board-ul și cardurile sale sunt vizibile, dar nimic nu poate fi modificat: fără
  carduri noi, fără mutări, fără comentarii, fără rulări.
- **write** — utilizare completă a board-ului: carduri, mutări, comentarii și rulări.
- Doar **proprietarul** vede pictograma de setări și butoanele de ștergere și doar
  proprietarul poate modifica setările board-ului, Agentic Kanban Model sau partajările
  acestuia.

Lanțurile de pe un board partajat rulează întotdeauna cu credențialele și Agentic Kanban
Model ale **proprietarului**, astfel încât colaboratorii nu au nevoie niciodată de ale lor.

## Atașamentele cardurilor

Deschideți un card și utilizați **Attach file** pentru a adăuga fișiere — plasați-le în casetă
sau selectați-le cu butonul, iar apoi eliminați-le din aceeași listă. Atașamentele sunt
stocate în [Drive](./drive-tab.md).

Fiecare rulare **rezolvă atașamentele înainte de pornirea workflow-urilor**, în funcție de
tip:

- **Documentele** (pdf, markdown, csv, json, text) sunt extrase în text, cu o limită de
  20.000 de caractere per fișier, în câmpul `text` al atașamentului.
- **Imaginile** sunt transmise ca un `url` pe care calea de vision îl încarcă direct (input-ul
  de imagine al unui nod LLM îl acceptă ca atare).
- **Orice altceva** este transmis ca o referință simplă (`name`, `url`, `mime_type`).

Workflow-urile le citesc la `$input.card.attachments` (și întotdeauna la
`$input.board.attachments`, indiferent ce a mapat mapper-ul). Agentic Kanban Model vede de
asemenea textul extras și URL-urile imaginilor, astfel încât poate mapa un atașament direct
în câmpul așteptat de un workflow.

## Lanțurile de workflow-uri ale coloanelor

Fiecare coloană poate fi configurată cu o **listă ordonată de workflow-uri** (lanțul).
Când un card se mută într-o coloană care are un lanț:

1. Lanțul pornește automat în fundal — mutarea în sine nu așteaptă niciodată.
2. Workflow-urile rulează **secvențial**. Rezultatul fiecărui workflow este adăugat la
   contextul cardului înainte de pornirea următorului.
3. Dacă un workflow eșuează, lanțul se oprește: verigile rămase sunt omise, iar cardul
   devine **roșu**.
4. Când fiecare verigă reușește, cardul devine **verde**. În timp ce lanțul rulează, cardul
   pulsează în **chihlimbar**; o rulare întreruptă pentru revizuire umană afișează o stare
   statică chihlimbar.

Rulările sunt înregistrate în [Execution History](../reference/execution-history.md) cu sursa
de trigger `board`, iar fiecare card își păstrează propria listă de rulări cu rezultatele și
erorile per workflow. Deschideți un card în timp ce un workflow rulează și alegeți **Open
live** lângă rulare pentru a atașa editorul la acea execuție exactă. Aceeași animație a
canvas-ului, jurnalele Debug incrementale și rezultatul final apar fără a porni o a doua
rulare.
## Ce primesc workflow-urile

Lanțul transmite un payload standard ca intrare a workflow-ului. Citirea acestuia se face cu
[expresii](../reference/expression-dsl.md) obișnuite, precum `$input.card.title`:

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

- `comments` — fiecare comentariu de pe card, cel mai vechi primul.
- `history` — cronologia completă a activității (comentarii, mutări, output-uri), limitată la
  cele mai recente 200 de intrări.
- `previous_outputs` — output-urile din rulările anterioare finalizate (coloanele anterioare și
  rundele de follow-up).
- `chain.previous_workflow_outputs` — output-urile verigilor anterioare din lanțul *curent*.
- În rundele de follow-up, `move` este `null`, iar `rerun` este `true`.

## Bucla de planificare (runde de follow-up)

Un tipar frecvent este plasarea unui workflow de planificare pe **a doua coloană** (implicit
denumită Planning — numele nu contează; poziția contează). Acel workflow îmbogățește cardul și
adresează întrebări de follow-up:

1. Mutați un card în a doua coloană — workflow-ul scrie un plan îmbogățit și întrebările sale
   înapoi pe card, ca output.
2. Răspundeți în firul de comentarii al cardului. Răspunsul eliberează cardul: acesta avansează
   în coloana următoare, care îl preia cu răspunsul în context. Lanțul celei de-a doua coloane
   nu este rulat din nou.
3. Pentru a îmbunătăți planul pe loc, apăsați **Run follow-up round**. Același lanț rulează din
   nou cu tot contextul acumulat, apoi cardul așteaptă în acea coloană până când adăugați un
   comentariu pentru a-l elibera.

Poarta de planificare este pozițională, nu bazată pe nume: coloana cea mai din stânga și coloana
imediat din dreapta acesteia nu avansează niciodată singure — ele își rulează lanțul și așteaptă
acolo pentru dumneavoastră (un comentariu eliberează a doua coloană). Începând cu a treia
coloană, un lanț reușit avansează cardul spre dreapta de la sine, până la ultima coloană.
Redenumirea sau eliminarea etichetei implicite „Planning" nu schimbă care poziție este poarta.
Un card poate avea o singură rulare activă la un moment dat.

## Human-in-the-loop și întrebări Codex

Dacă un workflow din lanț se oprește — la un nod
[Human-in-the-Loop](../reference/human-in-the-loop.md), la un instrument HITL al unui agent sau
deoarece un nod [Codex](../nodes/codex-node.md) necesită mai multe informații — rularea este
persistată ca în așteptare, iar cardul afișează starea de așteptare chihlimbarie. Fiecare pauză
își păstrează propria suprafață de răspuns: un link de revizuire HITL pentru HITL, ecranul de
follow-up Codex pentru Codex.

După ce răspundeți, lanțul se reia de la sine: workflow-ul întrerupt se finalizează, output-ul
său ajunge pe card, restul lanțului acelei coloane rulează, iar cardul avansează ca de obicei.
Dacă rularea reluată eșuează, cardul devine roșu, iar verigile rămase sunt omise.

## Resurse conexe

- [Workflows](./workflows-tab.md)
- [Execution History](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
