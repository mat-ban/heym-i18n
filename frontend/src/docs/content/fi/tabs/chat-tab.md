# Keskustelu-välilehti

**Keskustelu**-välilehti tarjoaa suoran LLM-keskustelukäyttöliittymän. Käytä sitä mallien testaamiseen, kysymysten esittämiseen, olemassa olevien workflowjen suorittamiseen tai uuden workflown luomiseen luonnollisen kielen pyynnöstä.

<video src="/features/showcase/chat.webm" controls playsinline muted preload="metadata" style="width:100%;border-radius:12px;margin:16px 0"></video>
<p class="github-video-link"><a href="../../../../public/features/showcase/chat.webm">▶ Katso Keskustelu-esittely</a></p>

## Asetukset

1. Valitse [tunnistetiedot](./credentials-tab.md) (API-avain OpenAIta, Googlea jne. varten)
2. Valitse pudotusvalikosta malli (mallit ladataan valituista tunnistetiedoista)
3. Aloita viestien lähettäminen kirjoittamalla

Keskustelun voi aloittaa myös [Workflowt-välilehden](./workflows-tab.md) chat-ruudusta. Se lähettää ensimmäisen viestisi ja avaa uuden keskustelun tänne, jossa vastaus on jo virtaamassa.

## Ominaisuudet

- **Globaalit muuttujat kontekstina** – [Globaalit muuttujat](../reference/global-variables.md) ovat saatavilla LLM:lle, joten voit kysyä niistä tai viitata tallennettuihin arvoihin
- **Työtilan mallipohjat kontekstina** – Työtilan jaettujen workflowjen ja solmujen mallipohjat sisältyvät kontekstiin, joten Keskustelu voi vastata saatavilla olevista malleista
- **Pitkäkestoinen agentti** – Keskustelu jatkaa toimintaansa taustalla, vaikka selain suljettaisiin, joten voit palata toiselta laitteelta ja jatkaa samaa keskustelua
- **Workflown luominen** – Pyydä Keskustelua luomaan tai määrittelemään workflow, ja se käyttää samaa Workflow AI Builder -moottoria kuin editoriavustaja workflown luomiseen ja tallentamiseen
- **Kanban-tehtävien luominen** – Pyydä luonnollisella kielellä lisäämään tehtävä tai luomaan kortti. Keskustelu lisää sen pyydetyn taulun ensimmäiseen sarakkeeseen; kun tauluja on useita etkä nimeä yhtä, Keskustelu esittää taulunvalitsimen ennen kortin luomista
- **Jonotetut jatkokysymykset** – Lähetä lisää viestejä, kun vastaus on vielä virtaamassa. Jonotetut viestit säilyvät, niitä voi muokata tai poistaa ennen kuin ne alkavat, ja ne suoritetaan järjestyksessä aktiivisen vastauksen jälkeen
- **Suunnittelutauot** – Kun Keskustelu tarvitsee suunnittelutietoja, se esittää selvennyskysymyksiä ja keskeyttää jonotetut jatkokysymykset, kunnes vastaat. Kun suunnitteluvastaus on valmis, jonotetut viestit jatkavat
- **Tunnistetiedot** – Kun Keskustelun luoma tai muokkaama workflow tarvitsee tunnistetiedot, Keskustelu kysyy mitä käyttää, tarjoaa uuden luomista keskustelussa tai antaa jatkaa ilman. Voit myös pyytää Keskustelua luomaan tunnistetiedot tai päivittämään omistamiasi; se avaa tunnistetietolomakkeen keskusteluun. Malli näkee tunnistetietojen nimen ja tyypin, ei koskaan arvoja, sekä omistamillesi että kanssasi jaetuille tunnistetiedoille. Keskustelun lisäämät LLM- ja Agent-solmut suoritetaan keskusteluun valitulla tunnistetiedolla ja mallilla, mukaan lukien jaetut tunnistetiedot; kun Keskustelu muokkaa workflow'ta, sen olemassa olevat LLM- ja Agent-solmut säilyttävät tunnistetietonsa ja mallinsa. Katso [AI-avustaja › Tunnistetiedot](../reference/ai-assistant.md#credentials)
- **Datataulukot** – Kun Keskustelun luoma tai muokkaama workflow tallentaa tietueita, Keskustelu kysyy mitä [datataulukkoa](./datatable-tab.md) käyttää tai tarjoaa uuden luomista workflown tarvitsemilla sarakkeilla. Se voi myös listata taulukot ja niiden sarakkeet. Se ei koskaan lue tai kirjoita rivejä. Katso [AI-avustaja › Datataulukot](../reference/ai-assistant.md#data-tables)
- **Virtaavat vastaukset** – Näe mallin tuloste virtaamassa reaaliajassa
- **Vastauksen keskeytys** – Keskeytä virtaava vastaus milloin tahansa; keskeyttäminen tyhjentää myös kyseisen keskustelun jonotetut viestit
- **Markdown-muotoilu** – Vastaukset tukevat Markdown-muotoilua, mukaan lukien upotetut kuvat
- **Kuvien näyttäminen** – Vastauksiin upotetut kuvat (esim. LLM:n luomat kuvat) näkyvät sisällä; napsauta mitä tahansa kuvaa nähdäksesi sen kokonäytöllä. Paina **Esc** tai paluunäppäintä (mobiili) sulkeaksesi kokonäytön näkymän
- **Viestien kopiointi** – Kopioi mikä tahansa viesti leikepöydälle
- **Keskustelun tyhjennys** – Aloita uusi keskustelu
- **Äänisyöte** – Käytä mikrofoni-painiketta puheentunnistukseen (selaimen tukema). Kun tallennus pysähtyy, Heym voi siistiä tekstin hieman ennen lähettämistä
- **Aikataulutetut workflowt** – Kysy milloin cron-workflowt suoritetaan (tänään, tällä viikolla, tässä kuussa tai mukautetulla aikavälillä). Avustaja käyttää samaa aikataulutietoa kuin [Aikataulutetut](./scheduled-tab.md) -välilehti ja voi rajoittaa tulokset omistamiisi workflowihin tai sisältää jaetut
- **Workflown suoritushistoria** – Kysy yhdestä workflowsta ("kuinka monta kertaa päivittäinen raportti suoritettiin?", "epäonnistuiko se?", "milloin se viimeksi suoritettiin?"). Keskustelu etsii workflown ID:llä ja vastaa sen suoritusmäärästä, tilajakaumasta, ensimmäisestä ja viimeisestä suoritusajasta sekä keskimääräisestä kestosta. Kysy miksi suoritus epäonnistui tai mitä se palautti, ja Keskustelu avaa kyseisen suorituksen lukeakseen sen syötteet, tulosteet ja solmukohtaiset virheet
- **Live-suoritustila** – Kysy mitä parhaillaan suoritetaan, ja Keskustelu vastaa määrällä, workflowjen nimillä, kunkin suorituksen kestolla, millä solmulla se on ja linkillä suoraan live-suoritukseen
## Chatin käyttö MCP-asiakasohjelmasta

Chat-moottoriin voi ottaa yhteyttä myös selaimen ulkopuolelta. Ota **Heym Chat -työkalu** käyttöön [MCP-välilehdessä](./mcp-tab.md), jolloin MCP-asiakasohjelmat – kuten Claude, Cursor ja muut MCP-yhteensopivat ohjelmat – saavat käyttöönsä `heym_chat`-työkalun, joka käyttää samaa moottoria kaikine ominaisuuksineen.

Näistä keskusteluista näkyy historia Chat-välilehdessä, ja ne on merkitty pistokekuvakkeella keskustelulistassa. Avaa keskustelu nähdäksesi, mitä asiakasohjelma kysyi, mitä työkortteja se laukaisi, ja jatka keskustelua itse. Kysymyksiin vastaaminen toimii samalla tavalla, riippumatta siitä alkoiko vuoro Chat-välilehdessä vai MCP-asiakasohjelmasta.

MCP-yhteyden kautta Chat ei näytä, valitse tai luo tunnistetietoja. Sen luomien workflowjen tunnistetietokentät jäävät tyhjiksi, ja vastauksessa kerrotaan, mitkä solmut vaativat tunnistetiedon, jotta voit asettaa ne editorissa.

Myös datataulukot toimivat MCP-yhteyden yli: Chat listaa taulukot, luo uusia ja yhdistää ne workflowhin. Taulukkoon liittyvät kysymykset tulevat vastauksessa tekstinä, joten vastaa niihin käyttämällä samaa `conversation_id`-tunnistetta.

## Kontekstirajoitus

Chat säilyttää kontekstissa enintään 25 viimeisintä viestiä. Vanhemmat viestit typistetään pysyäkseen mallin rajoissa.

## Workflowjen luominen

Kun pyydät Chattia luomaan, rakentamaan, generoimaan tai määrittelemään workflown, se luo uuden tallennetun workflown automaattisesti generoidulla nimellä ja kuvauksella. Vastaus sisältää vain luettavan esikatselun generoiduista solmuista ja yhteyksistä sekä **Avaa workflow** -linkin, joka avaa workflow-editorin uuteen selainvälilehteen. Käytä esikatselukortin **Suorita** -painiketta, kun haluat ajaa workflown.

Seuraavat palautteet samassa keskustelussa muokkaavat tätä workflowa uuden luomisen sijaan. Esimerkiksi workflown luomisen jälkeen voit sanoa "lisää hyväksyntävaihe", "muuta tulostusmuotoa" tai "şöyle yap", ja Chat päivittää tallennetun workflown ja päivittää esikatselun.

Tämä toiminto sopii parhaiten pyyntöihin, joissa haluat työn tehtäväksi uudelleenkäytettävänä automaationa, ei vain kertaluonteisena vastauksena.

## Kanban-tehtävien luominen

Pyydä Chattia luomaan tehtävä arkikielellä, esimerkiksi "Lisää tehtävä nimeltä Korjaa kirjautumisbugi" tai
"Luo uusi kortti Päivitä dokumentaatio Launch-taululle." Voit sisällyttää kuvauksen samaan pyyntöön. Chat luo aina kortin valitun taulun ensimmäiseen sarakkeeseen.

Jos työtilassasi on useita tauluja etkä määritä yhtä, Chat keskeyttää toiminnon ja näyttää taulunvalitsimen. Valitse taulu tehtävän luomisen viimeistelemiseksi. Kauttaviivaa tai erityistä viestimuotoa ei vaadita.

## Kysely käynnissä olevista toiminnoista

Kysy arkikielellä – "mitä on käynnissä?", "kuinka monta workflowta on aktiivisena juuri nyt?",
"missä solmussa yöraportti on?" – ja Chat raportoi tilanteen reaaliajassa:

- **Kuinka monta** suoritusta on käynnissä, jaoteltuna käynnissä oleviin ja ihmisen arviointia odottaviin
- **Mihin workflowhin** ne kuuluvat nimen perusteella
- **Kuinka kauan** kukin suoritus on kestänyt (esimerkiksi `1m 35s`, `3h 25m`)
- **Missä solmussa** suoritus on parhaillaan, sen canvas-merkinnän perusteella, sekä viimeksi valmistunut solmu
- **Linkki** jokaiseen käynnissä olevaan suoritukseen, joka avaa canvasin kyseisen suorituksen toistamiseksi

[Human-in-the-Loop](../reference/human-in-the-loop.md) - tai Codex-arviointia odottavat suoritukset merkitään odottaviksi, ei käynnissä oleviksi. Tämä on sama tieto kuin otsikon aktiivisten suoritusten merkinnässä, joten Chat ja merkintä eivät koskaan eroa toisistaan. Valmiista suorituksista voi kysyä viimeaikaisia suorituksia – tämä lukee [Suoritushistoriaa](../reference/execution-history.md).

## Kysely suorituksesta

Valitse Workflow-suoritus [Execution History](../reference/execution-history.md#ask-ai) -ikkunassa editorista tai All History -näkymästä ja napsauta **Kysy AI:lta** -painiketta valintaikkunan otsikon vieressä. Chat avaa uuden keskustelun kahdella sirulla viestikentän yläpuolella:

- **Workflow:** Workflowin nimi
- **Execution:** valitun suoritustunnisteen ensimmäiset merkit

Poista siru sen **×**-painikkeella, jos haluat jättää sen pois. Esitä sitten kysymys, esimerkiksi ”miksi tämä suoritus kesti niin kauan?”, ”mikä tässä epäonnistui?” tai ”voitko korjata tämän?”. Jäljelle jäävät sirut liitetään tähän viestiin täydellisillä tunnisteilla, jolloin Chat lukee suorituksen syötteet, tulosteet ja solmukohtaisen jäljityksen suoraan Workflowin etsimisen sijaan. Workflowin korjaamiseksi Chat tallentaa, testaa ja vahvistaa muutoksen kohdassa [Workflow-luominen](#workflow-luominen) kuvatulla tavalla.

Lähetetty viesti näyttää sirut kysymyksen alla. Ne kuuluvat vain kyseiseen viestiin; saman keskustelun jatkokysymykset säilyttävät historian kontekstin.

## Kysely hälytyksistä

Chat voi vastata määriteltyihin [hälytyksiin](./alerts-tab.md) liittyviin kysymyksiin:

- **Mitä on olemassa** – "mitä hälytyksiä minulla on?", "onko laskutusworkflowssa hälytystä?",
  "mitkä hälytykset ovat aktiivisia juuri nyt?"
- **Miten jokin on määritelty** – "mikä on kustannushälytyksen kynnysarvo?", "miten tämä on asetettu?"
- **Miksi ja milloin se laukesi** – "miksi kustannushälytys laukesi?", "milloin tämä laukesi viimeksi?"

"miksi se laukesi" -kysymyksessä Chat lukee hälytystiedot ja kertoo todetun arvon, kynnysarvon ja tarkastetun ikkunan, sekä lisätiedot:
epäonnistuneiden suoritusten tunnukset ja virheviestit virhehälytyksissä, mallikohtaiset kustannukset kustannushälytyksissä tai
laukaisulähteen jakauma suoritusmäärähälytyksissä. Se raportoi tilanteen hälytyksen laukeamishetkellä, ei laske sitä uudelleen, koska ikkuna on jo mennyt ja uusi laskelma voi antaa eri tuloksen.

## Käyttäjän säännöt

[Käyttäjän säännöt](../reference/user-settings.md) (asetuksista määriteltävät) lisätään automaattisesti jokaiseen Chat-keskusteluun järjestelmätason ohjeina. Aseta ne kerran soveltaaksesi pysyviä mieltymyksiä kaikkiin chat-pyyntöihin.
## Liittyvät

- [MCP-välilehti](./mcp-tab.md) – Näytä tämä moottori MCP-asiakkaille `heym_chat` -työkaluna
- [Asetukset](../reference/user-settings.md) – Määritä käyttäjäsäännöt, jotka koskevat kaikkia keskustelupyyntöjä
- [Tunnistetiedot-välilehti](./credentials-tab.md) – Lisää ja hallinnoi API-avaimia
- [Muuttujat-välilehti](./global-variables-tab.md) – Keskustelussa käytettävissä olevat globaalit muuttujat
- [Solmutyypit](../reference/node-types.md) – LLM- ja agenttisolmut workfloweille
- [Agenttisolmu](../nodes/agent-node.md) – Tekoälyagentti työkutsuntoiminnoilla
- [Tekoälyavustaja](../reference/ai-assistant.md) – Editoriavustaja, joka käyttää samaa workflow-rakentajan DSL:ää
- [Suoritushistoria](../reference/execution-history.md) – Näytä aiemmat suoritukset (Historia-painike otsikkopalkissa)
- [Aikataulut-välilehti](./scheduled-tab.md) – Tulevien cron-suoritusten kalenteri (sama data, jonka keskustelu voi tiivistää)
- [Hälytykset-välilehti](./alerts-tab.md) – Kynnyshälytykset, joita keskustelu voi listata ja selittää
- [Kontekstuaalinen esittely](../reference/contextual-showcase.md) – Tiivisti sovelluksen sisäinen orientaatio tälle sivulle
- [Keskustelun ääni (TTS & STT)](../reference/chat-voice.md) – Lue viestit ääneen ja keskustele kädet vapaana ElevenLabsin avulla

## Työkutsut ja kontekstin koko

Joka kerta, kun avustaja käyttää työkalua (workflown suorittaminen, suoritusten listaaminen, uuden workflown rakentaminen), keskusteluun ilmestyy taittuva kortti. Kortti avautuu automaattisesti työkalun suorituksen aikana näyttäen tarkat argumentit. Kun työkalu on valmis, kortti sulkeutuu yhden rivin yhteenvetoon, jossa on kulunut aika. Klikkaa mitä tahansa korttia avataksesi argumentit ja vastauksen yhteenvedon uudelleen.

Syöttökentän alla oleva pieni rengasmerkki näyttää nykyisen kontekstin käytön prosentteina mallin ikkunasta (esim. `12% · ~9.2k`). Vie hiiri merkin päälle nähdäksesi erittelyn: järjestelmän kehote, AGENTS.md, workflowt-lohko, käyttäjäsäännöt, historia ja luonnoksesi. Kun käyttö ylittää 80 %, rengas muuttuu keltaiseksi; 95 %:n kohdalla se muuttuu punaiseksi.

Jos käyttö lähestyy rajaa, Heym tiivistää automaattisesti vanhemmat viestit lyhyeksi yhteenvedoksi käyttäen samaa mekanismia, jota agenttisolmut käyttävät. "Konteksti tiivistetty" -kortti ilmestyy keskusteluun näyttämään, mitä tapahtui.
