# Human-in-the-Loop

Human-in-the-loop (HITL) mahdollistaa [Agent-solmun](../nodes/agent-node.md) pyytää hyväksyntää tietyissä vaiheissa, odottaa ihmisen päätöstä ja jatkaa workflown suorittamista samasta tilannevedoksesta.

## Toiminta

- Lisää nimenomaisia hyväksyntäpisteitä agentille ilman erillisen hyväksyntäworkflown rakentamista
- Luo kertakäyttöisen julkisen tarkastusosoitteen polkuun `/review/{token}`
- Mahdollistaa tarkastajan valita `Hyväksy`, `Muokkaa ja jatka` tai `Hylkää`
- Merkitsee suorituksen tilaksi `pending`, kunnes päätös saapuu
- Jatkaa keskeytettyä suoritusta ja antaa agentin jatkaa hyväksynnän jälkeen
- Tukee useita peräkkäisiä HITL-tarkastuspisteitä samassa agentin suorituksessa

## Agentin määritys

Ota HITL käyttöön agentin ominaisuuspanelissa.

| Asetus | Kuvaus |
|---------|-------------|
| `hitlEnabled` | Ottaa ihmisen tarkastuksen käyttöön tälle agentille |
| `hitlSummary` | Hyväksyntäohjeet tilanteille, joissa agentin tulisi pyytää ihmisen tarkastusta |

HITL lisää agentiin `request_human_review` -työkalun. Käytä järjestelmän kehotetta ja `hitlSummary`-ohjeita kertoaksesi agentille, mitkä toimet vaativat hyväksynnän. Kun agenti päättää, että tarkastuspiste vaatii tarkastuksen, se lähettää yhden Markdown-muotoisen tarkastustekstin ihmiselle. Tarkastajalle näytettävä yhteenveto luodaan agentin pyynnöstä ajonaikaisesti; jos agenti jättää sen pois, Heym johtaa sen Markdown-sisällöstä. Versiossa 1 HITL tukee vain tekstitila-agentin tulosteita, joten sitä ei voi yhdistää `jsonOutputEnabled`-asetukseen.

MCP-työkaluille Heym pyytää mallia tulkitsemaan kirjoitetut HITL-ohjeet johonkin kolmesta hyväksyntäalueesta:

- `always` lauseille kuten "aina", "jokaisella" tai "joka kerta"
- `once` lauseille kuten "kerran" tai "vain yhden kerran"
- `never` lauseille kuten "ei koskaan", "älä kysy" tai "jo hyväksytty"

Tämä tulkinta ohjaa, pysähtyvätkö toistuvat MCP-kutsut uudelleen, pysyvätkö hyväksyttyinä kerran vai ohittaako ne ihmisen tarkastuksen kokonaan.

Kun HITL on käytössä, agentti paljastaa myös toisen canvas-tulostekahvan, joka on merkitty `review`. Käytä tätä haaraa lähettääksesi odottavan tarkastusosoitteen ja yhteenvedon Slackiin, sähköpostiin, lokitukseen tai mihin tahansa muuhun ilmoitusworkflowhin, kun pääsuoritus odottaa ihmistä.

## Tarkastusprosessi

1. Agentti saavuttaa hyväksyntää vaativan vaiheen ja kutsuu `request_human_review`
2. Heym luo julkisen tarkastuspyynnön ja palauttaa tarkastusosoitteen
3. Kaikki agentin `review`-kahvaan kytketyt solmut suoritetaan välittömästi odottavan HITL-payloadin kanssa
4. Workflown suoritus siirtyy tilaan `pending`
5. Tarkastaja avaa `/review/{token}` ilman kirjautumista
6. Tarkastaja valitsee yhden toiminnon:
   - `Hyväksy` jatkaa alkuperäisellä Markdown-sisällöllä
   - `Muokkaa ja jatka` jatkaa muokatulla Markdown-sisällöllä
   - `Hylkää` jatkaa `decision: "refused"` -asetuksella ja ohittaa lisäagenttitoiminnot
7. Heym jatkaa workflown suorittamista tallennetusta tilannevedoksesta ja antaa agentin jatkaa hyväksytyllä Markdown-kontekstilla
8. Jos myöhempi vaihe vaatii myös hyväksynnän, agentti voi kutsua HITL:n uudelleen ja luoda toisen odottavan tarkastuspisteen

Tarkastuslinkit vanhenevat 168 tunnin jälkeen, jos kukaan ei vastaa.

## Julkinen tarkastussivu

Julkinen tarkastussivu näyttää:

- Workflown nimen ja agentin tunnisteen
- Automaattisesti luodun yhteenvedon agentin tarkastuspyynnöstä
- Markdown-tarkastustekstin ensin pääsisältönä
- Muokkauslaatikon, joka avautuu vasta, kun tarkastaja klikkaa `Muokkaa`
- Live-Markdown-esikatselun muokkauksen aikana
- Toimintopainikkeet `Hyväksy`, `Muokkaa ja jatka` ja `Hylkää`

Kun päätös on lähetetty, token lukitaan eikä sitä voi käyttää uudelleen.

## Tulosteet ja suoritustila

Odottaessaan tarkastusta agentin tuloste sisältää odottavan payloadin:

```json
{
  "decision": null,
  "summary": "Review the customer-ready reply before it is sent.",
  "draftText": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "reviewUrl": "https://example.com/review/abc123",
  "requestId": "uuid",
  "expiresAt": "2026-03-29T10:00:00Z",
  "shareMarkdown": "Review the customer-ready reply before it is sent.\n\n[Open review page](https://example.com/review/abc123)"
}
```

Kun tarkastaja vastaa ja workflow jatkuu, lopullinen agentin tuloste sisältää päätösmetadatan:

```json
{
  "text": "Final agent output after approval and execution",
  "decision": "accepted",
  "summary": "Review the customer-ready reply before it is sent.",
  "originalDraft": "# Goal\n...\n\n# Planned Tool Calls / Actions\n- ...",
  "requestId": "uuid"
}
```

Käytä `$agentLabel.decision` -muuttujaa alaspäin suuntautuvissa solmuissa haarautuaksesi hyväksyttyihin, muokattuihin tai hylättyihin tuloksiin.

## Canvasin tarkastushaara

`review`-tulostekahva on käytettävissä vain, kun `hitlEnabled` on otettu käyttöön agentille.

- Se suoritetaan ennen ihmisen päätöstä
- Se vastaanottaa odottavan HITL-payloadin, mukaan lukien `summary`, `draftText`, `reviewUrl`, `shareText` ja `shareMarkdown`
- Se on tarkoitettu ilmoitus- tai siirtovaiheisiin, kuten Slack, sähköposti tai tarkastusloki
- Se suoritetaan kerran jokaiselle HITL-tarkastuspisteelle
- Se ei suorita uudelleen tarkastajan vastauksen jälkeen; vain normaali agentin tulostepolku jatkuu jatkossa
## Missä Sitä Näkyy

- [Suoritushistoria](./execution-history.md) näyttää `pending`-tilassa olevat suoritukset välittömästi ja tallentaa tarkistus-URL:n solmujen tuloksiin
- [Portal](./portal.md) -keskustelun vastaukset näyttävät ihmisen tarkistuslinkin tyhjän vastauksen sijaan
- Virheenetsintäpaneeli ja historiadialogit näyttävät lopullisen HITL-päätöksen ja tarkistetun tekstin
- Tarkistustuloksen käsittely voi ilmoittaa ulkoisille kanaville, vaikka workflow olisi käynnistetty cronilla, curlilla tai portal-liikenteellä
- Useat HITL-tarkistuspisteet käyttävät samaa suoritushistoriaa luoden uuden kertakäyttöisen tarkistuslinkin jokaiselle keskeytykselle

## Nykyiset Rajoitukset

- HITL on saatavilla vain Agent-solmuissa
- HITL käyttää agentin tekstitulostusta eikä tue JSON-tulostusta versiossa 1
- Keskeytetty suoritus jatkuu tallennetusta workflow-nopeutuksesta, ei viimeisimmästä muokatusta workflow-versiosta
- Sisäkkäiset alityönkulut eivät voi siirtyä pending-HITL-tilaan versiossa 1; pyydä tarkistusta ylemmältä agentilta ennen niiden kutsumista

## Liittyvät Aiheet

- [Agent-solmu](../nodes/agent-node.md) - HITL:n määrittäminen agentille
- [Agenttien arkkitehtuuri](./agent-architecture.md) - Kuinka agentit, työkalut, alaagentit ja HITL toimivat yhdessä
- [Suoritushistoria](./execution-history.md) - Pending- ja jatketun suorituksen tarkastelu
- [Board](../tabs/board-tab.md) - Board-ketjun suoritukset pysäyttävät kortin pending (keltaiseen) tilaan HITL:n yhteydessä
- [Portal](./portal.md) - Julkiset keskustelut ja HITL-tarkistuslinkit
