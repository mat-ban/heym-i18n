# Agenttisolmu

**AI Agent** -solmu on LLM-solmu, jossa on työkutsuntoiminto. Se voi suorittaa Python-työkaluja, kutsua liitettyjä canvas-solmuja työkaluina, yhdistää MCP-palvelimiin, käyttää taitoja, toimia valinnaisesti orkestroijana, joka delegoi tehtäviä muille agenttisolmuille, kutsua muita workflowteja työkaluina sekä keskeyttää toimintaa [ihmisen tarkastusta varten](../reference/human-in-the-loop.md).

## Yleiskatsaus

| Ominaisuus | Arvo |
|----------|-------|
| Syötteet | 1 |
| Tulosteet | 1, plus valinnainen `review`, kun HITL on käytössä |
| Tuloste | `$nodeLabel.text`, `$nodeLabel.fieldName` (kun JSON-tuloste on käytössä) tai odottava HITL-payload tarkastuksen aikana |

## Perusparametrit

### Tunnistetiedot ja malli

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `credentialId` | UUID | LLM-tunnistetiedot (API-avain) Asetuksista |
| `model` | merkkijono | Mallin nimi (esim. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (valinnainen) | Varatunnistetiedot, kun ensisijainen epäonnistuu |
| `fallbackModel` | merkkijono (valinnainen) | Varamalli, kun ensisijainen epäonnistuu |

Lisää tunnistetiedot [Tunnistetiedot](../tabs/credentials-tab.md) -välilehdessä. Malliluettelo ladataan valitusta tunnistetiedoista. Jos ensisijainen tunnistetieto tai malli palauttaa virheen, solmu yrittää automaattisesti varatunnistetiedoilla ja -mallilla ennen virhettä.

### Promptit

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `systemInstruction` | merkkijono | Järjestelmäprompti tekoälylle. Tukee [lausekkeita](../reference/expression-dsl.md). |
| `userMessage` | merkkijono | Käyttäjän viesti/promptti. Oletus: `$input.text` |
| `jsonOutputEnabled` | totuusarvo | Rakenteellinen JSON-tuloste |
| `jsonOutputSchema` | merkkijono | JSON-skeema rakenteelliselle tulosteelle |
| `extraBodyEnabled` | totuusarvo | Lähetä palveluntarjoajakohtaiset pyyntöparametrit (oletus: `false`) |
| `extraBody` | merkkijono | JSON-objekti, joka yhdistetään jokaiseen agentin tekemään API-pyyntöön |

Käytä `$input.text`, `$nodeName.field` ja muita [Expression DSL](../reference/expression-dsl.md) -syntakseja.

### Päättelymallit (o1, o3)

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `temperature` | numero | 0.0–2.0 (oletus: 0.7), vakio malleille |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Päättelysyvyys päättelymalleille |

Kun käytössä on päättelymalli (esim. o1, o3), käyttöliittymässä näkyy **Reasoning Effort** lämpötilan sijaan. Vakiomalleilla **Temperature** ohjaa luovuutta.

**JSON-tulosteesimerkki:** Kun tarvitset agentilta rakenteellista dataa (esim. luokittelu, poiminta), ota JSON-tuloste käyttöön ja anna skeema. Agentti palauttaa skeeman mukaisen JSONin; käytä kenttiä nimellä solmun tulosteessa:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Alasvirtasolmut voivat käyttää `$agentLabel.status`, `$agentLabel.reason` jne. Samanlainen toiminta kuin [LLM-solmun](../nodes/llm-node.md) JSON-tulosteessa.

## Ihmisen tarkastus (HITL)

Käytä HITL:ää, kun agentti saattaa tarvita hyväksyntää tärkeiden toimien yhteydessä.

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `hitlEnabled` | totuusarvo | Lisää agenttiin ihmisen tarkastuspisteet |
| `hitlSummary` | merkkijono | Hyväksyntäohjeet, jotka kertovat agentille, milloin tarkastus tarvitaan |

Kun HITL on käytössä, agentti saa käyttöönsä `request_human_review` -työkalun. Käytä järjestelmäpromptia ja tätä ohjekenttää selittämään, mitkä työkutsut, alaagentit, alaworkflowt, MCP-toiminnot, taidot tai sivuvaikutukset vaativat hyväksynnän. Agentti voi kutsua kyseistä työkalua vain tarvittaessa, mukaan lukien useita kertoja yhdessä suorituksessa.

Tarkastajalle näytettävä yhteenveto julkisella sivulla luodaan agentin tarkastuspyynnöstä ajonaikaisesti. Jos agentti ei anna yhteenvetoa erikseen, Heym johtaa sen Markdown-tarkastustekstistä.

MCP-työkaluille Heym pyytää mallia tulkitsemaan kirjoitetut HITL-ohjeet joko kolmen laajuuden mukaisesti: `always`, `once` tai `never`. Tämä tarkoittaa, että vapaamuotoiset sanamuodot kuten "jokaiselle kutsulle", "vain kerran" tai "älä koskaan kysy" normalisoidaan ennen suoritusaikaista rajoitusta.

Jokainen HITL-tarkastuspiste luo kertakäyttöisen julkisen tarkastuslinkin osoitteeseen `/review/{token}`. Tarkastaja voi:

- **Hyväksyä** alkuperäisen Markdown-tarkastustekstin
- **Muokata ja jatkaa** muokattua Markdownia
- **Kieltäytyä** ja jatkaa `text: ""` -arvolla

Kun HITL on käytössä, solmu näyttää myös `review` -tulostekahvan canvasilla. Yhdistä tämä haara Slackiin, sähköpostiin tai muihin ilmoitussolmuihin, jos haluat lähettää tarkastus-URLin ja yhteenvedon heti, kun suoritus keskeytyy.

Suoritus siirtyy `pending` -tilaan, kunnes tarkastaja vastaa. Tarkastusteksti on yksi Markdown-osa, ja odottava payload sisältää myös jaettavan linkkitekstin ulkoista siirtoa varten. `review` -haaran solmut suoritetaan välittömästi, kun keskeytys luodaan; normaali tulostepolku jatkuu vasta hyväksynnän jälkeen. Hyväksynnän jälkeen Heym jatkaa tallennetusta suoritushetkestä ja agentti jatkaa hyväksytyn kontekstin mukaisesti. Jos myöhemmässä vaiheessa tarvitaan uusi hyväksyntä, agentti voi luoda uuden HITL-tarkastuspisteen. Katso [Human-in-the-Loop](../reference/human-in-the-loop.md) lisätietoja payloadin muodosta, tarkastus-URLin käyttäytymisestä ja jatkamisen semantiikasta.

HITL on saatavilla vain tekstitilassa oleville agenttitulosteille. Versiossa 1 sitä ei voi yhdistää `jsonOutputEnabled` -ominaisuuteen.
## Orchestrator-tila

Kun tila on käytössä, agentti voi delegoida tehtäviä muille workflown agenttisolmuille. Jos **Orchestrator-tila on pois käytöstä**, agentti **ei voi luoda agentti→agentti -yhteyksiä** canvaksessa.

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Kun arvo on `true`, agentti saa käyttöönsä `call_sub_agent` -työkalun |
| `subAgentLabels` | string[] | Agenttisolmujen tunnisteet, joita tämä orchestrator voi kutsua |

**Ala-agenttien** on käytettävä `$input.text` -muuttujaa User Message -kentässään vastatakseen orchestratorin prompteihin.

Kun orchestrator kutsuu useita ala-agentteja yhdellä kierroksella, ne suoritetaan rinnakkain. Lisätietoja on kohdassa [Agenttien arkkitehtuuri](../reference/agent-architecture.md).

## Ala-workflowt

Kun ominaisuus on määritetty, agentti saa käyttöönsä `call_sub_workflow` -työkalun muiden workflowjen suorittamiseen.

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | Workflowjen tunnisteet, joita tämä agentti voi kutsua työkaluina |

Valitse workflowt agentin asetuksista Sub-Workflows -osiosta. Agentti kutsuu niitä `workflow_id` - ja `inputs` -parametreilla (objekti, joka vastaa kohdeworkflown syötekenttiä). Enimmäissyvyys: 5 sisäkkäistä ala-workflow-kutsua.

## Canvas-solmutyökalut

Voit yhdistää tuetun workflow-solmun agentin **työkaluihin**, jolloin agentti voi kutsua kyseistä solmua ajonaikaisesti. Tämä muuttaa olemassa olevat canvas-toiminnot ja -muunnokset kutsuttaviksi työkaluiksi ilman Python-koodin kirjoittamista.

Käytä canvas-solmutyökaluja, kun haluat agentin päättävän milloin suorittaa määritetyn solmun, säilyttäen samalla tunnistetiedot, staattiset kentät ja workflowkohtaiset asetukset solmun käyttöliittymässä.

### Agentin tarjoamat kentät

Työkalusolmun kenttiin voidaan merkitä bottikuvake. Merkityistä kentistä tulee pakollisia työkaluparametreja, jotka agentin on toimitettava solmua kutsuttaessa. Merkitsemättömät kentät pysyvät kiinteinä ja luetaan solmun asetuksista.

Esimerkki:

- Yhdistä Slack-solmu agenttiin työkaluna
- Pidä tunnistetiedot kiinteinä Slack-solmussa
- Merkitse `message` agentin tarjoamaksi kentäksi
- Agentti saa Slack-työkalun, jossa se toimittaa vain viestin ajonaikaisesti

Jos solmua ei ole yhdistetty agenttiin työkaluna, bottikuvake piilotetaan ja solmu toimii normaalina workflow-vaiheena.

### Ajonaikainen toiminta

Kun agentti kutsuu canvas-solmutyökalua, Heym yhdistää väliaikaisesti agentin tarjoamat argumentit solmun tietoihin, suorittaa solmun, palauttaa solmun tuloksen agentille ja palauttaa sitten solmun alkuperäiset asetukset. Työkalusolmut eivät suoritu säännöllisinä workflow-vaiheina aikataulutuksen kautta; ne suoritetaan vain kun agentti kutsuu niitä.

Canvas-solmutyökalut ovat hyödyllisiä integraatiosolmujen (kuten Slack, Telegram, HTTP, Send Email) ja datan muokkaamiseen tarkoitettujen solmujen (kuten [Set](./set-node.md)) kanssa. Käynnistyssolmuja, ohjausvirtasolmuja ja lopputulosten muokkaimia ([JSON-muokkain](./json-output-mapper-node.md), [HTML-muokkain](./html-output-mapper-node.md)) ei voi käyttää agentin työkaluina.

## Python-työkalut

Määritä mukautettuja työkaluja, joita agentti voi kutsua. Jokaisella työkalulla on:

| Kenttä | Tyyppi | Kuvaus |
|-------|------|-------------|
| `name` | string | Työkalun nimi (esim. `count_characters`) |
| `description` | string | Kuvaus LLM:lle |
| `parameters` | JSON Schema | OpenAI-funktiokutsujen skeema (objektimuoto) |
| `code` | string | Python-funktiokoodi |

**Parametrien** on oltava JSON-objekti, ei merkkijono:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Laskettava teksti" }
  },
  "required": ["text"]
}
```

**Esimerkkityökalu:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Hiekkalaatikko.** Python-työkalut suoritetaan oletusarvoisesti luottamattomana koodina eristetyssä, turvallistetussa Docker-säiliössä (ei verkkoyhteyttä, ei Docker-socketia, vain luku -tiedostojärjestelmä, ei pääkäyttäjän oikeuksia). Tuontirajoitukset koskevat vain turvallisten standardikirjastojen moduuleja. Katso lisätietoja kohdasta [Turvallisuus → Python-työkalujen hiekkalaatikko](../reference/security.md#python-tool-sandbox) (`HEYM_PYTHON_TOOL_SANDBOX`).

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Enimmäisaika työkalun suoritukselle sekunteina (oletus: 30) |
| `requestTimeoutSeconds` | number | Enimmäisaika odottaa mallin vastausta sekunteina ennen aikakatkaisua (oletus: 60). Kasvata arvoa hitaiden tai itse isännöityjen palveluntarjoajien (LiteLLM, vLLM, paikalliset mallit) ja pitkien monivaiheisten suoritusten yhteydessä. |
## MCP-yhteydet

Yhdistä [Model Context Protocol](https://modelcontextprotocol.io/) -palvelimiin tarjotaksesi niiden työkalut agentille.

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Yhteyden tyyppi |
| `timeoutSeconds` | numero | Yhteyden aikakatkaisu (oletus: 30) |
| `label` | merkkijono | Valinnainen näyttönimi |

**stdio** (paikallinen prosessi):

| Kenttä | Kuvaus |
|-------|-------------|
| `command` | Suoritettava komento (esim. `npx`) |
| `args` | JSON-taulukko (esim. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | JSON-objekti ympäristömuuttujista, jotka syötetään prosessiin (esim. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

Useimmat API-avaimilla varustetut stdio-palvelimet todentavat käyttäjän ympäristömuuttujien kautta komentoriviargumenttien sijaan. Aseta `env` yhteyttä kohti, jotta jokainen agenttisolmu voi käyttää eri tunnistetietoja muuttamatta isäntäympäristöä.

`env`-arvot tukevat [Expression DSL](../reference/expression-dsl.md) -syntaksia, joten voit välittää workflow-syötteitä tunnistetietoina kovakoodattujen salaisuuksien sijaan:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Lauseke `$userInput.pat` ratkaistaan runtime-ajassa workflown syöttötietojen perusteella ennen MCP-prosessin käynnistystä. Tämä mahdollistaa tokenien vastaanottamisen triggeristä tai syötesolmusta niiden upottamisen sijaan workflow-määrittelyyn.

Esimerkki — GitHub MCP kovakoodatulla tokenilla:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Esimerkki — GitHub MCP dynaamisella tokenilla workflow-syötteestä:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Esimerkki — GitHub MCP Heymin GitHub-tunnistetiedoilla:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Sisäänrakennettu GitHub-tunnistetieto tukee tällä hetkellä PAT-pohjaista todennusta. Jos organisaation käyttöoikeuksia tarvitaan, käytä PAT-tokenia, jolla on vaaditut org/repository-oikeudet.

Esimerkki — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (etäpalvelin):

| Kenttä | Kuvaus |
|-------|-------------|
| `url` | SSE-endpointin URL. Tukee lausekkeita (esim. `$userInput.serverUrl`). |
| `headers` | JSON-objekti todennus-/mukautettuja otsikoita varten. Arvot tukevat lausekkeita. |

**Streamable HTTP** (etäpalvelin):

| Kenttä | Kuvaus |
|-------|-------------|
| `url` | MCP-endpointin URL (esim. `https://example.com/mcp`). Tukee lausekkeita. |
| `headers` | JSON-objekti todennus-/mukautettuja otsikoita varten. Arvot tukevat lausekkeita. |

## Taidot

Taidot ovat SKILL.md-ohjeita sekä valinnaisia Python-tiedostoja ja liitettyjä resursseja. Ne laajentavat agentin järjestelmäkontekstia ja voivat lisätä Python-työkaluja.

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `name` | merkkijono | Taidon nimi |
| `content` | merkkijono | SKILL.md-sisältö (ohjeet) |
| `timeoutSeconds` | numero | Taidon Python-suorituksen aikakatkaisu (oletus: 30) |
| `driveFilesEnabled` | totuusarvo | Mahdollistaa runtime-apuvälineen `heym_drive` tälle taidolle (oletus: false) |
| `files` | taulukko | Valinnaisia `{ path, content, encoding, mimeType }` -merkintöjä (esim. `.py`-skriptejä tai base64-muodossa tallennettuja binaariresursseja) |

Taitoja voidaan lisätä pudottamalla `.zip`- tai `.md`-tiedosto Taidot-alueelle.
Taitokortin avaamisen jälkeen voit liittää tai korvata tiedoston pudottamalla sen kyseisen taidon päälle, mukaan lukien binaariresurssit kuten PDF-tiedostot ja kuvat.
Käytä taitokortin latauspainiketta viedäksesi taidon `.zip`-arkistona varmuuskopiointia tai uudelleenkäyttöä varten toisessa workflowssa.

Ota **Drive-tiedostot** käyttöön taidossa vain, jos sen Python-koodi tarvitsee lukea tiedostoja Heym Drivesta. Käytössä olevat taidot saavat runtime-ajassa luodun `heym_drive.py`-apuvälineen ja voivat kutsua `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` tai `read_drive_base64` -funktioita Drive-tiedoston tunnisteen tai tarkan tiedostonimen kanssa. Tiedostonimihakuja käytetään uusimman saatavilla olevan tiedoston kanssa. Poissa käytöstä olevat taidot eivät saa apuvälinettä.

Jokaisessa taitokortissa on neljä toimintoa otsikon alapuolella:

| Painike | Kuvaus |
|--------|-------------|
| **Muokkaa tekoälyllä** | Avaa Skill Builderin taiton muokkaamiseen chat-promptin avulla |
| **Lataa** | Vie taido `.zip`-arkistona |
| **Poista** | Poistaa taidon tästä agenttisolmusta |
| **Historia** | Avaa taidon historian, joka perustuu [Muokkaushistoriaan](../reference/edit-history.md) |
### Taitohistoria

Taitohistoriaa ei tallenneta erikseen. Se johdetaan workflowin muokkaushistorian tilannekuvista: jokainen tallennettu workflow-versio sisältää agenttisolmun `skills`-taulukon kokonaisuudessaan.

Historia-valikosta käyttäjä voi:

- **Esikatsella** aiempaa tilannekuvaa (SKILL.md ja tiedostoluettelo)
- **Muokata** — ladata tilannekuvan taitojen editoriin ilman, että koko workflow palautetaan aiempaan versioon
- **Hienosäätää tekoälyllä** — avata Skill Builder -työkalun kyseisellä tilannekuvalla lähtökohtana
- **Palauttaa** — palauttaa vain tämän taidon aiempaan versioon (muut solmut pysyvät muuttumattomina)

Historia noudattaa samaa 7 päivän säilytysaikaa kuin workflowin muokkaushistoria. Workflowin tallennus taitojen muokkauksen jälkeen luo uusia historiamerkintöjä.

Taitojen osiossa on myös **AI Build** -toiminto:

- Klikkaamalla **AI Build** käyttäjä voi luoda uuden taidon chat-promptista
- Klikkaamalla olemassa olevan taidon kipinänappulaa käyttäjä voi muokata sitä tekoälyllä
- Pudottamalla tiedostoja prompt-kompositioon käyttäjä voi liittää ne hienosäätökommenttiin; nämä tiedostot tallennetaan myös niputetuiksi taitoresursseiksi
- Modaali näyttää assistentin tekstiä reaaliajassa samalla kun esittelee `SKILL.md` ja `.py` -tiedostojen live-esikatselua
- **Lataa ZIP** vie nykyisen esikatselun ilman, että se lisätään solmuun
- **Tallenna ja lisää** tallentaa generoidut tiedostot saman ZIP-jäsennysprosessin kautta, jota käytetään manuaalisissa latauksissa

Tekoälyllä muokatessa Heym lähettää vain tekstimuotoiset `.md` ja `.py` -taitotiedostot rakentajalle. Binääri- ja muut ei-muokattavat liitteet säilytetään ja jaetaan rakentajalle polkumetatietona, jotta generoitu Python-koodi voi pitää suhteelliset tiedostoviitteet oikeina. Valitse oikean paneelin liitetiedosto ja ota käyttöön **Sisällytä tämä tiedosto tekoälyn kontekstiin**, kun tekoälyn tarvitsee tarkastaa niputettua mallipohjaa. Teksti-, PDF- ja DOCX-tiedostot puretaan prompt-kontekstiin, kun mahdollista; Heym ei aseta erillistä Skill Builder -liitetiedostojen koko rajaa, joka ylittäisi alustan pyynnön runkorajan.

## Lisäpyynnön runko

Jotkin palveluntarjoajat hyväksyvät pyyntöparametreja, joita standardi OpenAI-yhteensopivat kentät eivät kata, kuten mallin ajattelutilan poistaminen käytöstä. Valitse solmun ominaisuuksista **Lähetä lisäpyynnön runko** ja syötä JSON-objekti.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Oletusarvoisesti pois käytöstä.** Valintaruutu pois päältä, mitään ylimääräistä ei lähetetä.
- Käytetään **jokaiseen** pyyntöön työkalukutsusilmukassa, ei vain ensimmäisellä kierroksella, sekä varamallin yrityksessä. Ei käytetä suojauksissa, jotka käyttävät erillistä mallia.
- On oltava JSON-**objekti**. Taulukko, skalaari tai virheellinen teksti epäonnistuttaa solmun `Invalid extra body JSON` -virheellä sen sijaan, että se hylättäisiin hiljaisesti.
- `$`-lausekkeet ratkaistaan ennen jäsennystä. Koska kyseessä on tekstikorvaus, kaksois- tai rivinvaihtomerkkiä sisältävä ratkaistu arvo tuottaa virheellisen JSON:n ja epäonnistuttaa solmun.

Sama kenttä ja toiminta kuin [LLM-solmun](./llm-node.md) lisäpyynnön rungossa.

## Suojaukset

Ota käyttöön **Suojaukset** solmun ominaisuuksissa estääksesi turvattomat käyttäjäviestit ennen agentin suorittamista. Katso täysi viite [Suojaukset](../reference/guardrails.md).

## Pysyvä muisti (graafi)

Valinnainen **agenttisolmukohtainen** tietograafi, joka tallennetaan tietokantaan. Kun käytössä, Heym lisää muistettujen entiteettien ja suhteiden Markdown-yhteenvedon **järjestelmäohjeeseen** ennen jokaista suoritusta (vain jos graafi ei ole tyhjä). **Onnistuneen** agentin suorituksen jälkeen taustatyö erottaa uusia kestäviä faktoja keskustelusta ja yhdistää ne graafiin.

| Parametri | Tyyppi | Kuvaus |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Ota käyttöön lataus + taustapoiminta tälle canvas-solmulle |

**Ala-agentit** pitävät **omat** graafinsa (solmun tunnisteen mukaan), erillään orkestroijasta.

Käytä solmun pinkkiä **aivo**-ohjainta (kun muisti on päällä tai mallirivi näkyy) avataksesi graafieditorin ja valinnaisen **muistin jakamisen** (muut workflowt/agentit). Täysi toiminta, REST-polut ja JSON-viennin tiedot: [Agentin pysyvä muisti](../reference/agent-persistent-memory.md).

## Responses API ja päättelyn jatkuvuus

**Käytä Responses API** -valintaruutu ohjaa agentin mallikutsut [Responses API](https://platform.openai.com/docs/api-reference/responses):n kautta Chat Completions -sijaan. Se on oletusarvoisesti pois päältä.

Se on merkittävintä päättelymalleille, kuten `gpt-5` tai `o` -sarja. Responses API palauttaa mallin päättelyn jokaisen työkalukutsun yhteydessä, ja agentti syöttää nämä päättelyt seuraavalle kierrokselle, joten malli säilyttää ajatusketjunsa monivaiheisessa työkalusilmukassa sen sijaan, että se johdettaisiin uudelleen jokaisen työkalutuloksen jälkeen. Koko silmukka suoritetaan samalla polulla, mukaan lukien [ihmisten tarkastus](#human-review-hitl) keskeytys ja jatkaminen, [kontekstin tiivistäminen](#context-compression) ja lopullinen vastaus.

Itse keskustelu pysyy Heymissä. Heym lähettää täyden syötteen jokaisella kierroksella ja kuljettaa päättelyn salattuna blobina, joten mitään ei säilytetä palveluntarjoajan puolella kutsujen välillä. Kontekstin tiivistämän aikavälin sisällä olevat päättelyt hylätään sen mukana, koska salattua blobia ei voi tiivistää.

Se toimii OpenAI-tunnistetiedoilla ja mukautetulla tunnistetiedoilla, jonka yhdyskäytävä tukee päätepistettä. Google-tunnistetiedoilla se pysyy pois käytöstä.
## Kontekstin Pakkaus

Kun agentti suorittaa useita työkaluiteraatioita suurilla tuloksilla (verkkosivujen kaappaus, asiakirjojen lukeminen, alityönkulkujen tulosteet), kertynyt viestihistoria voi lähestyä mallin konteksti-ikkunan rajaa. Heym pakkaa automaattisesti keskusteluhistorian suorituksen aikana estääkseen kontekstin ylivuodon.

**Toimintaperiaate:**

1. Ennen jokaista työkaluiteraatiota Heym arvioi nykyisen token-määrän (~4 merkkiä per token).
2. Jos arvio ylittää mallin konteksti-ikkunan **80 %**, pakkaus käynnistyy.
3. Viestihistoria jaetaan säilytettäviin ja pakkautuviin osiin:
   - **Säilytetyt**: järjestelmän aloitusviesti, ensimmäinen käyttäjäviesti, viimeisin käyttäjäviesti
   - **Pakattavat**: kaikki siltä väliltä (avustajan päättelykierrokset, työkutsukset, työkalutulokset)
4. Keskimmäinen osio tiivistetään käyttäen **samaa mallia ja tunnistetietoja** – ei tarvita lisäkonfiguraatiota.
5. Tiivistetty yhteenveto korvaa keskiosan yhdellä avustajaviestillä.

**Seurattavuus:**

Pakkausilmoitukset näkyvät muodossa `Konteksti pakattu (N viestiä → yhteenveto)` seuraavissa:
- **Virheenetsintäpaneelin** työkutsulistassa suorituksen aikana
- **Suoritushistorian** yksityiskohtanäkymässä
- **Jälkikäynti-välilehdessä** `context.compression`-merkintänä

Pakkaus on automaattinen ja aina käytössä Agent-solmuissa. Se **ei** koske LLM-solmuja, Keskustelu-välilehteä tai tekoälyavustajan istuntoja.

## Aiheeseen Liittyvää

- [Miksi Heym](../getting-started/why-heym.md) – Kuinka agentit toimivat ja pysyvät hallinnassa tuotantoympäristössä
- [Agentin Pysyvä Muisti](../reference/agent-persistent-memory.md) – Tietämysgraafi per agenttisolmu, valinnainen jakaminen, API, editori
- [Agenttien Arkkitehtuuri](../reference/agent-architecture.md) – Alagentit, orkestroija, taidot, MCP, työkalukutsut
- [Ihmisen Mukana Silmukassa](../reference/human-in-the-loop.md) – Julkiset arviointisivut, odottavat suoritukset, hyväksy/muokkaa/hylkää -työnkulku
- [Suojaukset](../reference/guardrails.md) – Estä vaarallisen sisällön kategoriat
- [Solmutyypit](../reference/node-types.md) – Yleiskatsaus kaikista solmutyypeistä
- [Tekoälyavustaja](../reference/ai-assistant.md) – Keskustelukäyttöliittymä työnkulkujen rakentamiseen luonnollisella kielellä (erillinen Agent-solmusta)
- [Lausekkeiden DSL](../reference/expression-dsl.md) – Viittaaminen dataan aloitusviesteissä
- [Työnkulun Rakenne](../reference/workflow-structure.md) – Solmut, yhteydet ja DSL-muoto
- [Pika-aloitus](../getting-started/quick-start.md) – Perustyönkulku LLM:llä ja lausekkeilla
- [Tunnistetiedot-välilehti](../tabs/credentials-tab.md) – Lisää API-avaimet agentille
- [MCP-välilehti](../tabs/mcp-tab.md) – Määritä MCP työnkulun työkaluille
