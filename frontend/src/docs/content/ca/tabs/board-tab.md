# Tauler

La pestanya **Tauler** és un tauler kanban agentic. El treball avança per columnes, i cada
columna pot executar workflows de Heym. Una targeta no és només una tasca — és un treball
agentic persistent que transporta context, historial de conversa, estat d'execució, sortides
i execucions de workflows.

<!-- TODO(board-demo): enable when board.webm is recorded
<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Watch Board demo</a></p>
-->

## Taulers i columnes

- Podeu crear tants taulers com necessiteu. Un tauler nou comença amb les columnes
  predeterminades **Backlog → Planning → Development → Done**.
- Cada tauler necessita un **Agentic Kanban Model** (una credencial més un model). És
  obligatori — el diàleg de tauler nou no crearà un tauler sense un, i un tauler
  que no en tingui manté les seves accions desactivades — perquè és el model que mapeja cada
  targeta als inputs dels workflows que executa i converteix la seva sortida de nou en
  text llegible.
- La icona d'engranatge a la capçalera del tauler obre la configuració del tauler: nom, descripció
  (mostrada sota la capçalera) i l'Agentic Kanban Model.
- Les columnes són completament editables: afegiu, canvieu el nom, canvieu el color, reordeneu o suprimiu-les des de la
  configuració de columna (una columna ha d'estar buida abans de poder suprimir-la).
- Les targetes s'ordenen verticalment per prioritat — arrossegueu per reordenar.
- També podeu crear una targeta des de la [pestanya de Xat](./chat-tab.md) amb una sol·licitud
  en llenguatge natural. El Xat us demana seleccionar un tauler quan cal i sempre afegeix la targeta a la primera columna
  d'aquell tauler.

## Compartir un tauler

La configuració del tauler també comparteix el tauler amb **usuaris** (per correu electrònic) i amb **equips**, amb
permís `read` o `write`:

- **read** — el tauler i les seves targetes són visibles, però no es pot canviar res: ni targetes
  noves, ni moviments, ni comentaris, ni execucions.
- **write** — ús complet del tauler: targetes, moviments, comentaris i execucions.
- Només el **propietari** veu els botons d'engranatge i d'eliminació, i només el propietari pot canviar la
  configuració del tauler, el seu Agentic Kanban Model o les seves comparticions.

Les cadenes en un tauler compartit sempre s'executen amb les credencials i l'Agentic Kanban
Model del **propietari**, de manera que els col·laboradors mai no necessiten les seves pròpies.

## Adjuncions de targeta

Obriu una targeta i utilitzeu **Adjuntar fitxer** per afegir-hi fitxers — deixeu-los anar a la caixa o trieu-los
amb el botó, i elimineu-los de la mateixa llista. Les adjuncions s'emmagatzemen a
[Drive](./drive-tab.md).

Cada execució **resol les adjuncions abans que comencin els workflows**, per tipus:

- **Documents** (pdf, markdown, csv, json, text) s'extreuen a text, limitat a 20.000
  caràcters per fitxer, al camp `text` de l'adjunció.
- **Imatges** es lliuren com una `url` que la ruta de visió carrega directament (l'entrada d'imatge d'un node LLM
  l'accepta tal qual).
- **Qualsevol altra cosa** es passa com una referència simple (`name`, `url`, `mime_type`).

Els workflows les llegeixen a `$input.card.attachments` (i sempre a `$input.board.attachments`,
sigui el que sigui que hagi mapejat el mapper). L'Agentic Kanban Model també veu el text extret i les URL
d'imatge, de manera que pot mapejar una adjunció directament al camp que un workflow espera.

## Cadenes de workflows de columna

Cada columna es pot configurar amb una **llista ordenada de workflows** (la cadena).
Quan una targeta es mou a una columna que té una cadena:

1. La cadena s'inicia automàticament en segon pla — el moviment mateix mai no espera.
2. Els workflows s'executen **seqüencialment**. La sortida de cada workflow s'adjunta al context de la targeta
   abans que comenci el següent.
3. Si un workflow falla, la cadena s'atura: els enllaços restants se salten i la
   targeta es torna **vermella**.
4. Quan tots els enllaços tenen èxit, la targeta es torna **verda**. Mentre la cadena s'està executant
   la targeta polsa en **ambre**; una execució pausada per a revisió humana mostra un estat ambre
   estàtic.

Les execucions es registren a [Execution History](../reference/execution-history.md) amb
l'origen de trigger `board`, i cada targeta manté la seva pròpia llista d'execucions amb sortides i errors
per workflow. Obriu una targeta mentre s'executa un workflow i trieu **Obrir en directe** al costat
de l'execució per adjuntar l'editor a aquella execució exacta. La mateixa animació de canvas, els registres de Debug
incrementals i el resultat final apareixen sense iniciar una segona execució.
## Què reben els workflows

La cadena passa un payload estàndard com a entrada del workflow. Llegiu-lo amb
[expressions](../reference/expression-dsl.md) normals com ara `$input.card.title`:

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

- `comments` — tots els comentaris de la targeta, del més antic al més recent.
- `history` — la cronologia completa d'activitat (comentaris, moviments, sortides),
  limitada a les 200 entrades més recents.
- `previous_outputs` — sortides d'execucions anteriors completades (columnes
  prèvies i rondes de seguiment).
- `chain.previous_workflow_outputs` — sortides dels enllaços anteriors de la
  cadena *actual*.
- En les rondes de seguiment, `move` és `null` i `rerun` és `true`.

## El bucle de planificació (rondes de seguiment)

Un patró habitual és situar un workflow de planificació a la **segona columna** (per
defecte anomenada Planning — el nom no importa; la posició sí). Aquest workflow enriqueix
la targeta i planteja preguntes de seguiment:

1. Moveu una targeta a la segona columna — el workflow escriu un pla enriquit i les
   seves preguntes a la targeta com a sortida.
2. Responeu al fil de comentaris de la targeta. La resposta allibera la targeta: passa
   a la columna següent, que la recull amb la resposta en context. La cadena de la
   segona columna no es torna a executar.
3. Per millorar el pla in situ, premeu **Run follow-up round**. La mateixa cadena
   s'executa de nou amb tot el context acumulat, i després la targeta espera en aquella
   columna fins que afegiu un comentari per alliberar-la.

La porta de planificació és posicional, no basada en el nom: la columna més a l'esquerra
i la columna immediatament a la seva dreta mai no avancen per si soles — executen la
seva cadena i esperen allà per vosaltres (un comentari allibera la segona columna). A
partir de la tercera columna, una cadena completada amb èxit avança la targeta cap a la
dreta per si sola, fins a l'última columna. Canviar el nom o eliminar l'etiqueta
"Planning" per defecte no altera quina posició és la porta. Una targeta només pot tenir
una execució activa alhora.

## Human-in-the-Loop i preguntes de Codex

Si un workflow de la cadena es pausa — en un node
[Human-in-the-Loop](../reference/human-in-the-loop.md), en una eina HITL d'un agent, o
perquè un node [Codex](../nodes/codex-node.md) necessita més informació — l'execució es
desa com a pendent i la targeta mostra l'estat pendent ambre. Cada pausa conserva la
seva pròpia superfície de resposta: un enllaç de revisió HITL per a HITL, la pantalla de
seguiment de Codex per a Codex.

Un cop responeu, la cadena es reprèn per si sola: el workflow pausat finalitza, la seva
sortida arriba a la targeta, la resta de la cadena d'aquella columna s'executa i la
targeta avança com de costum. Si l'execució represa falla, la targeta es torna vermella
i s'ometen els enllaços restants.

## Relacionat

- [Workflows](./workflows-tab.md)
- [Execution History](../reference/execution-history.md)
- [Expression DSL](../reference/expression-dsl.md)
- [Human-in-the-Loop](../reference/human-in-the-loop.md)
