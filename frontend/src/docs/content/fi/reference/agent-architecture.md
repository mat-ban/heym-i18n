# Agenttien arkkitehtuuri

[Agenttisolmu](../nodes/agent-node.md) tukee ala-agenteja, ala-workflowja, canvas-solmun työkaluja, orkestraattorimallia, taitoja, MCP-yhteyksiä, työkutsuja, valinnaista [pysyvää muistia](./agent-persistent-memory.md) (canvas-solmukohtaisesti, jaettavissa muille agenteille) sekä valinnaista [ihmisen tarkistusta](./human-in-the-loop.md). Tämä sivu kuvaa arkkitehtuurin.

## Ala-agentit

Ala-agentit ovat agenttisolmuja, joita orkestraattori voi kutsua `call_sub_agent` -työkalun avulla.

- **Orkestraattori**: `isOrchestrator: true`, `subAgentLabels: ["researchAgent", "summarizerAgent"]`
- **Ala-agentit**: Käyttävät `$input.text` -kenttää User Message -viestissään, jotta ne saavat orkestraattorin promtin
- **Työkalu**: `call_sub_agent` parametreilla `sub_agent_label` (enum) ja `prompt`
- **Syvyysraja**: Enintään 5 sisäkkäistä ala-agentin kutsua

### Suorituskulku

1. Orkestraattori päättää kutsua ala-agentin
2. `_execute_sub_agent_tool` etsii kohdeagentin tunnisteen perusteella
3. Luo `synthetic_inputs = {"input": {"text": prompt}}`
4. Suorittaa `_execute_agent_node` ala-agentille
5. Tulos palautetaan orkestraattorille

### Rinnakkaiset ala-agentit

Kun orkestraattori palauttaa useita `call_sub_agent` -työkutsuja yhdellä vuorolla, ne suoritetaan **rinnakkain**. Esimerkiksi jos käyttäjä kysyy "Parisista" ja orkestraattori kutsuu sekä `distanceAgent` että `foodAgent` -agentteja, molemmat ajetaan samanaikaisesti eikä peräkkäin.

- **Etuna**: Kokonaisaika on suunnilleen hitaimman ala-agentin aika, ei kaikkien yhteenlaskettu aika.
- **Vihje**: Kannusta orkestraattoria kutsumaan useita ala-agenteja yhdellä vuorolla, kun tehtävä sitä vaatii.

## Ala-workflowt

Kun `subWorkflowIds` on määritetty, agentti voi kutsua muita workflowja `call_sub_workflow` -työkalun avulla.

- **Asetus**: `subWorkflowIds: ["workflow-uuid-1", "workflow-uuid-2"]`
- **Työkalu**: `call_sub_workflow` parametreilla `workflow_id` (enum) ja `inputs` (objekti)
- **Syvyysraja**: Enintään 5 sisäkkäistä ala-workflown kutsua

### Suorituskulku

1. Agentti päättää kutsua ala-workflown
2. `_execute_sub_workflow_tool` hakee workflown `workflow_cache` -muistista
3. Luo `enriched_inputs = {"headers": {}, "query": {}, "body": inputs}`
4. Suorittaa `WorkflowExecutor.execute()` ala-workflowlle
5. Tulos palautetaan agentille

Ala-workflowt eivät voi versiossa 1 keskeytyä ihmisen tarkistusta varten. Jos sisäkkäinen ala-workflow yrittää siirtyä odottamaan tarkistusta, suoritus epäonnistuu keskeytymisen sijaan.

## Canvas-solmun työkalut

Canvas-solmun työkalut ovat workflow-solmuja, jotka on kytketty agenttiin `tool-input` -kahvan kautta. Agentin alustuksen aikana `_build_node_tool_schemas` skannaa nämä yhteydet ja lisää yhden OpenAI-yhteensopivan työkalun skeeman jokaiselle kytketylle solmulle.

- **Työkalun lähde**: `_source: "node_tool"`
- **Työkalun nimi**: johdettu kytketyn solmun tunnisteesta, kaksoiskappaleille lisätään päätteitä
- **Työkalun parametrit**: rakennettu solmun `agentProvidedFields` -kentistä
- **Kiinteät kentät**: kaikki solmun kentät, joita ei ole listattu `agentProvidedFields` -kentässä, säilyvät solmun asetuksissa

### Suorituskulku

1. Agentti päättää kutsua kytkettyä solmun työkalua
2. `_execute_node_tool` kopioi solmun tiedot
3. Agentin tarjoamat argumentit yhdistetään määritettyihin solmukenttiin
4. `execute_node` suorittaa solmun kerran haarasuunnittelu pois käytöstä
5. Alkuperäiset solmutiedot palautetaan
6. Solmun tulos palautetaan agentille työkalun tuloksena

Työkalujen solmut jätetään pois normaalista workflown suunnittelusta, jotta ne eivät suoritu kahdesti. Ne toimivat vain agentin työkkutsujen kautta.

## Ihmisen tarkistus

Kun `hitlEnabled` on asetettu agentille, agentti saa käyttöönsä `request_human_review` -työkalun, jolla se voi pyytää hyväksyntää tarkistuspisteissä.

1. Järjestelmän prompt ja solmun HITL-ohjeet kertovat agentille, mitkä toimenpiteet vaativat hyväksynnän
2. Kun agentti saapuu yhteen näistä vaiheista, se kutsuu `request_human_review` -työkalua
3. Heym tallentaa workflown suoritushetken tilan ja luo julkisen tarkistuspyynnön
4. Solmun tulos merkitään `pending` -tilaan ja siihen lisätään tarkistusosoite
5. Agentin `review` -tuloskahva suunnitellaan välittömästi, jotta ilmoitushaarat voivat toimia odottavan payloadin kanssa
6. Pääsuoritus keskeytyy, kunnes tarkistaja vastaa
7. Kun vastaus on `accept`, `edit` tai `refuse`, suoritin rakennetaan uudelleen tallennetusta tilasta
8. Keskeytetty agentti jatkaa hyväksytyn tarkistuksen kontekstissa tai lopettaa välittömästi `refuse` -tilanteessa
9. Alaspäin suuntautuvat solmut jatkavat palautetun agentin jälkeen ilman `review` -haaran uudelleensuoritusta
10. Jos myöhempi toimenpide vaatii myös hyväksynnän, agentti voi luoda uuden HITL-tarkistuspisteen samassa suorituksessa

Tarkistajalle näytettävä yhteenveto luodaan tarkistuspyynnöstä itsestään, joten solmukenttä voi keskittyä hyväksyntäkäytäntöihin ja ajankohtiin.

Tämä mahdollistaa agenttien workflowjen odotuksen ulkoiselle hyväksynnälle säilyttäen samalla keskusteluhistorian, suoritettujen solmujen tulokset, silmukkatilan ja muun suorituskontekstin.

## Orkestraattorin työkalunsuoritin

Mukautettu työkalunsuoritin reitittää:

- **Ala-agenttien kutsut** (`_source == "sub_agent"`) → `_execute_sub_agent_tool`
- **Ala-workflowjen kutsut** (`_source == "sub_workflow"`) → `_execute_sub_workflow_tool`
- **Canvas-solmun työkalut** (`_source == "node_tool"`) → `_execute_node_tool`
- **Ihmisen tarkistus** (`_source == "hitl"`) → luo odottavan HITL-tarkistuspisteen
- **Muut työkalut** → `_unified_tool_executor` (Python, MCP, taitotyökalut)

Sitä käytetään, kun HITL on käytössä, kun `isOrchestrator` ja `subAgentLabels` on asetettu tai kun `subWorkflowIds` on määritetty.
## Taidot

Taidot laajentavat agentin järjestelmäkontekstia ja voivat lisätä Python-työkaluja.

- **Muoto**: `AgentSkill` = `{ id, name, content, files?, timeoutSeconds? }`
- **Sisältö**: Liitetään järjestelmäohjeistuksen alkuun (yhdessä `---`-merkillä)
- **Python-työkalut**: Jokaiselle taidolle, jossa on `.py`-tiedostoja, lisätään `skill_{skill_name}`-työkalu
- **Suoritus**: `skill_python_executor.py` suorittaa skriptejä `uv run python` -komennolla väliaikaisessa hakemistossa; argumentit JSON-muodossa stdinissä, tulos JSON-muodossa stdoutissa

Taitoja voidaan lisätä pudottamalla `.zip`- tai `.md`-tiedosto [Agenttisolmun](../nodes/agent-node.md) määrityksen Taidot-alueelle.

## MCP-asiakas

MCP (Model Context Protocol) -asiakas yhdistää ulkoisiin työkalujen palvelimiin.

- **Kuljetusprotokollat**: `stdio` (komento + argumentit) tai `sse` (url + otsakkeet)
- **Listaa työkalut**: `list_mcp_tools` → `ClientSession.list_tools()` → muunnetaan OpenAI-funktiomuotoon `_source: "mcp"` -kentällä
- **Suorita**: `execute_mcp_tool` → `ClientSession.call_tool()` → tulos `_extract_tool_result` -funktion kautta

MCP-yhteyksiä voidaan määrittää [MCP-välilehdellä](../tabs/mcp-tab.md) tai agenttisolmun `mcpConnections`-kohdassa.

## Työkalukutsut

LLM-palvelu suorittaa `execute_with_tools` -silmukan:

1. **Kontekstin pakkaus tarkistus** – ennen jokaista iteraatiota arvioidaan tokenien käyttö ja pakataan tarvittaessa (katso alla)
2. Kutsutaan mallia `tools`- ja `tool_choice: "auto"`-parametreilla
3. Jos `tool_calls` löytyy: jokaiselle kutsulle suoritetaan `tool_executor(tool_def, name, args, timeout)`
4. Lisätään työkalun tulos viestilistaan, toistetaan
5. Lopetetaan, kun työkalukutsuja ei enää ole tai `max_tool_iterations` saavutetaan

### Työkalun reititys

`_unified_tool_executor` reitittää `_source`-kentän perusteella:

| Lähde | Käsittelijä |
|--------|---------|
| `mcp` | `execute_mcp_tool` |
| `skill` | `execute_skill_python` |
| (oletus) | `execute_tool` (Python-koodityökalut) |

Työkalut käyttävät OpenAI-funktiokutsujen muotoa: `name`, `description`, `parameters` (JSON-skeema).

## Kontekstin pakkaus

Estääkseen kontekstin ylivuodon pitkäkestoisissa agenteissa, Heym pakkaa automaattisesti kertyneen `messages`-listan ennen jokaista työkalukutsua.

### Algoritmi

1. **Arvioi tokenit**: `total_chars / 4` kaikkien viestien yli (nopea, tokenisoijaa ei tarvita)
2. **Kynnystarkistus**: jos `estimated_tokens < context_limit × 0.80`, ohita pakkaus
3. **Kontekstiraja**: yritä `client.models.retrieve(model).context_window`; jos ei saatavilla, käytä sisäänrakennettua taulukkoa (`gpt-4o` → 128K, `claude-3-5-sonnet` → 200K, `gemini-2.0-flash` → 1M, jne.); oletus 128K
4. **Ankkuriviestit säilytetään aina**:
   - Ensimmäinen `system`-viesti (agentin identiteetti ja ohjeet)
   - Ensimmäinen `user`-viesti (alkuperäinen tehtävä)
   - Viimeisin `user`-viesti (uusin ohje)
5. **Tiivistä keskiosa**: kaikki ensimmäisen ja viimeisen käyttäjäviestin välissä oleva serialisoidaan ja lähetetään samalle mallille tiivistyspyynnöllä
6. **Rakenne uudelleen**: `[system, first_user, assistant(summary), last_user]`

Pakkaus ohitetaan, jos erillisiä käyttäjäviestejä on alle 2 (ei keskiosaa tiivistettäväksi) tai jos LLM-tiivistyskutsu epäonnistuu (turvallinen palautus: palauta alkuperäiset viestit).

### Havainnointi

Jokainen pakkauskirjaus tallennetaan seuraavasti:
- `_context_compression`-merkintä `tool_calls_collected`-kentässä → näkyy Suoritushistorian yksityiskohdissa
- `on_tool_call` -tapahtuma `phase: "compression"` -kentällä → renderöityy Debug-paneelissa muodossa `Konteksti pakattu (N viestiä → tiivistelmä)`
- `context.compression` -LLM-jälki → näkyy Jäljet-välilehdessä ennen/jälkeen tokeniarviot

Agenttien työkalukutsut tuottavat myös rikkaampaa havainnointia:

- Kutsukohtaiset elinkaarikentät `tool_calls`-kentässä: `tool_call_id`, `status` (`success` / `error` / `pending` / `timeout` / `cancelled`), `started_at`, `finished_at`, `elapsed_ms`
- Yhteenveto `tool_metrics` -kentässä agentin tuloksessa (lukumäärät statuksen mukaan sekä kokonais-/enimmäiskesto); `_context_compression` -merkinnät jätetään pois laskuista
- Valinnainen OpenTelemetry-lapsijänne `heym.agent.tool.execute` (katso [OpenTelemetry-jäljitys](./opentelemetry.md))
- Pysyvässä LLM-jäljityksessä / suoritushistoriassa säilytetyt `tool_calls` -payloadit redaktoidaan ja kooltaan rajoitetaan; live-HITL-jatkotila säilyttää alkuperäiset vastaamista varten

## Aiheeseen liittyvät

- [Miksi Heym](../getting-started/why-heym.md) – Monen agentin orkestrointi agentin elinkaaren yli
- [Agenttisolmu](../nodes/agent-node.md) – Määritys ja parametrit
- [Agentin pysyvä muisti](./agent-persistent-memory.md) – Tietämysgraafi agenttisolmua ja vertaisjakelua varten
- [Ihmisen osallistuminen](./human-in-the-loop.md) – Tarkistuslinkit, odottavat payloadit ja jatkaminen
- [OpenTelemetry-jäljitys](./opentelemetry.md) – Workflow-, solmu- ja agenttityökalujäljet
- [Solmutyypit](./node-types.md) – Agentti- ja siihen liittyvät solmut
- [Rinnakkaissuoritus](./parallel-execution.md) – DAG-pohjainen ja alaagenttien rinnakkaissuoritus
- [MCP-välilehti](../tabs/mcp-tab.md) – MCP-yhteyksien määritys
- [Lausekkeiden DSL](./expression-dsl.md) – `$input.text` alaagenteille
