# Taulukko

**Taulukko**-välilehti on agenttinen Kanban-taulu. Työt liikkuvat sarakkeiden läpi, ja jokainen
sarakkeessa voidaan suorittaa Heym-workfloweja. Kortti ei ole pelkkä tehtävä – se on pysyvä
agenttinen työ, joka sisältää kontekstia, keskusteluhistoriaa, suoritustilaa, tulosteita
ja workflow-suorituksia.

<video src="/features/showcase/board.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/board.webm">▶ Katso Taulukko-esittely</a></p>
-->

## Taulukot ja sarakkeet

- Voit luota niin monta taulukkoa kuin tarvitset. Uusi taulukko alkaa oletussarakkeilla
  **Backlog → Suunnittelu → Kehitys → Valmis**.
- Jokainen taulukko vaatii **Agenttisen Kanban -mallin** (tunnistetiedot sekä malli). Se on
  pakollinen – uuden taulukon luontidialogi ei luo taulukkoa ilman sitä, ja taulukko,
  jossa sitä ei ole, pitää toimintonsa pois käytöstä – koska malli kartoittaa jokaisen
  kortin workflowien syötteiksi ja muuntaa niiden tulokset takaisin luettavaksi tekstiksi.
- Taulukon otsikon hammasrataskuvake avaa taulukon asetukset: nimi, kuvaus
  (näkyy otsikon alla) ja Agenttinen Kanban -malli.
- Sarakkeet ovat täysin muokattavissa: lisää, nimeä uudelleen, vaihda väriä, järjestä uudelleen tai poista ne sarakkeen asetuksista (sarakkeen on oltava tyhjä ennen poistamista).
- Kortit järjestetään pystysuunnassa prioriteetin mukaan – raahaa järjestääksesi uudelleen.
- Voit myös luoda kortin [Keskustelu-välilehdeltä](./chat-tab.md) luonnollisen kielen pyynnöllä. Keskustelu pyytää valitsemaan taulukon tarvittaessa ja lisää aina kortin kyseisen taulukon ensimmäiseen sarakkeeseen.

## Taulukon jakaminen

Taulukon asetuksissa voit myös jakaa taulukon **käyttäjien** (sähköpostin perusteella) ja **tiimien** kanssa,
`luku` tai `kirjoitus` -oikeuksin:

- **luku** – taulukko ja sen kortit ovat näkyvissä, mutta mitään ei voi muuttaa: ei uusia
  kortteja, ei siirtoja, ei kommentteja, ei suorituksia.
- **kirjoitus** – täysi taulukon käyttö: kortit, siirrot, kommentit ja suoritukset.
- Vain **omistaja** näkee hammasratas- ja poistopainikkeet, ja vain omistaja voi muuttaa
  taulukon asetuksia, sen Agenttista Kanban -mallia tai jakoja.

Jaetulla taulukolla ketjut suoritetaan aina **omistajan** tunnistetiedoilla ja Agenttisella Kanban
-mallilla, joten yhteistyökumppanit eivät koskaan tarvitse omiaan.

## Kortin liitteet

Avaa kortti ja käytä **Liitä tiedosto** -toimintoa lisätäksesi siihen tiedostoja – pudota ne laatikkoon tai valitse ne
painikkeella, ja poista ne samasta listasta. Liitteet tallennetaan
[Driveen](./drive-tab.md).

Jokainen suoritus **käsittelee liitteet ennen workflowien alkamista**, tyypin mukaan:

- **Asiakirjat** (pdf, markdown, csv, json, teksti) puretaan tekstiksi, rajoitettu 20 000
  merkkiin tiedostoa kohden, liitteen `text`-kentässä.
- **Kuvat** annetaan `url`-osoitteena, jonka näköpolku lataa suoraan (LLM-solmun kuvan
  syöte hyväksyy sen sellaisenaan).
- **Kaikki muu** välitetään pelkkänä viitteenä (`name`, `url`, `mime_type`).

Workflowt lukevat ne kohdasta `$input.card.attachments` (ja aina myös `$input.board.attachments`,
riippumatta siitä, mitä mapperi on kartoittanut). Agenttinen Kanban -malli näkee puretun tekstin ja kuvien
URL-osoitteet myös, joten se voi kartoittaa liitteen suoraan workflowin odottamaan kenttään.

## Sarakkeen workflow-ketjut

Jokainen sarake voidaan määrittää **järjestetyllä workflow-luettelolla** (ketju).
Kun kortti siirtyy sarakkeeseen, jossa on ketju:

1. Ketju käynnistyy automaattisesti taustalla – itse siirto ei koskaan odota.
2. Workflowt suoritetaan **peräkkäin**. Jokaisen workflown tuloste lisätään kortin
   kontekstiin ennen seuraavan alkamista.
3. Jos workflow epäonnistuu, ketju pysähtyy: jäljellä olevat lenkit ohitetaan ja
   kortti muuttuu **punaisaksi**.
4. Kun jokainen lenkki onnistuu, kortti muuttuu **vihreäksi**. Kun ketju on käynnissä,
   kortti vilkkuu **keltaisena**; ihmisten arviointia odottava suoritus näyttää staattisen keltaisen
   tilan.

Suoritukset tallennetaan [Suoritushistoriaan](../reference/execution-history.md) `board`-laukaisulähteenä,
ja jokainen kortti pitää omassa suoritusluettelossaan workflowkohtaisia
tulosteita ja virheitä. Avaa kortti workflown suorituksen aikana ja valitse suorituksen vierestä
**Avaa live** liittääksesi editorin kyseiseen suoritukseen. Sama canvas-animaatio, inkrementaaliset
Debug-lokit ja lopullinen tulos ilmestyvät ilman toisen suorituksen käynnistämistä.
## Mitä workflowt vastaanottavat

Workflown syötteenä välitetään standardi payload. Lue se tavallisilla
[lausekkeilla](../reference/expression-dsl.md) kuten `$input.card.title`:

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

- `comments` — kaikki kortin kommentit, vanhimmasta uusimpaan.
- `history` — täysi aktiviteettihistoria (kommentit, siirrot, tulokset), rajoitettu
  viimeisimpiin 200 tapahtumaan.
- `previous_outputs` — aiemmista suorituksista saadut tulokset (edellisistä sarakkeista ja
  jatkokierroksista).
- `chain.previous_workflow_outputs` — nykyisen ketjun aiemmista linkeistä saatavat tulokset.
- Jatkokierroksilla `move` on `null` ja `rerun` on `true`.

## Suunnittelusilmukka (jatkokierrokset)

Yleinen käytäntö on sijoittaa suunnittelutyönkulku **toiseen sarakkeeseen** (oletuksena
nimetty Planning — nimeämisellä ei ole merkitystä; sijainnilla on). Tämä workflow täydentää
korttia ja esittää jatkokysymyksiä:

1. Siirrä kortti toiseen sarakkeeseen — workflow kirjoittaa täydennetyn suunnitelman ja
   kysymyksensä kortin tulokseksi.
2. Vastaa kortin kommenttiketjuun. Vastaus vapauttaa kortin: se siirtyy seuraavaan sarakkeeseen,
   joka ottaa sen vastaan vastauksen kontekstissa. Toisen sarakkeen ketjua ei suoriteta uudelleen.
3. Jos haluat parantaa suunnitelmaa paikallaan, paina **Run follow-up round**. Sama ketju
   suoritetaan uudelleen kaikella kertyneellä kontekstilla, minkä jälkeen kortti odottaa
   kyseisessä sarakkeessa, kunnes lisäät kommentin sen vapauttamiseksi.

Suunnitteluportti on sijaintipohjainen, ei nimeämispohjainen: vasemmanpuoleisin sarake ja sen
heti oikealla puolella oleva sarake eivät koskaan siirry eteenpäin itsestään — ne suorittavat
ketjunsa ja odottavat siellä käyttäjän toimia (kommentti vapauttaa toisen sarakkeen). Kolmannesta
sarakkeesta eteenpäin onnistunut ketju siirtää kortin oikealle itsestään, aina viimeiseen sarakkeeseen
asti. Oletusarvoisen "Planning"-nimikkeen uudelleennimeäminen tai poistaminen ei muuta portin
sijaintia. Kortilla voi olla vain yksi aktiivinen suoritus kerrallaan.

## Ihmisen osallistuminen ja Codex-kysymykset

Jos ketjutyönkulku keskeytyy — [Human-in-the-Loop](../reference/human-in-the-loop.md) -solmussa,
agentin HITL-työkalussa tai koska [Codex](../nodes/codex-node.md) -solmu tarvitsee lisätietoja —
suoritus säilytetään odottavana ja kortti näyttää keltaisen odotustilan. Jokaisella keskeytyksellä
on oma vastausalueensa: HITL:lle tarkistuslinkki, Codexille jatkokysymysnäyttö.

Kun vastaat, ketju jatkuu itsestään: keskeytetty workflow päättyy, sen tulos tallentuu kortille,
sarakkeen ketjun loppuosa suoritetaan ja kortti siirtyy eteenpäin kuten tavallisesti. Jos jatketun
suorituksen epäonnistuu, kortti muuttuu punaiseksi ja jäljellä olevat linkit ohitetaan.

## Aiheeseen liittyvää

- [Workflowt](./workflows-tab.md)
- [Suoritushistoria](../reference/execution-history.md)
- [Lauseke-DSL](../reference/expression-dsl.md)
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
