# Agent Node

**AI Agent** node on LLM node, millel on tööriistade kutsumise võimekus. See suudab käivitada Pythoni tööriistu, kutsuda ühendatud lõuendi node'sid tööriistadena, ühenduda MCP-serveritega, kasutada oskusi, valikuliselt tegutseda orkestraatorina, kes delegeerib teistele agent node'dele, kutsuda teisi workflow'sid tööriistadena ning peatuda [inimhindamiseks](../reference/human-in-the-loop.md).

## Ülevaade

| Omadus | Väärtus |
|----------|-------|
| Sisendid | 1 |
| Väljundid | 1, pluss valikuline `review`, kui HITL on lubatud |
| Väljund | `$nodeLabel.text`, `$nodeLabel.fieldName` (kui JSON-väljund on lubatud) või ootel HITL payload, kuni oodatakse hindamist |

## Põhiparameetrid

### Mandaat ja mudel

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `credentialId` | UUID | LLM-i mandaat (API-võti) jaotisest Settings |
| `model` | string | Mudeli nimi (nt `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (valikuline) | Varumandaat, kui esmane ebaõnnestub |
| `fallbackModel` | string (valikuline) | Varumudel, kui esmane ebaõnnestub |

Lisage mandaadid jaotises [Mandaadid](../tabs/credentials-tab.md). Mudelite loend laaditakse valitud mandaadist. Kui esmane mandaat või mudel tagastab vea, proovib node automaatselt uuesti varumandaadi ja varumudeliga enne ebaõnnestumist.

### Promptid

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `systemInstruction` | string | AI süsteemne prompt. Toetab [avaldised](../reference/expression-dsl.md). |
| `userMessage` | string | Kasutaja sõnum/prompt. Vaikeväärtus: `$input.text` |
| `jsonOutputEnabled` | boolean | Struktureeritud JSON-väljund |
| `jsonOutputSchema` | string | JSON Schema struktureeritud väljundi jaoks |
| `extraBodyEnabled` | boolean | Saada teenusepakkuja-spetsiifilised päringuparameetrid (vaikeväärtus: `false`) |
| `extraBody` | string | JSON-objekt, mis liidetakse igasse API-päringusse, mille agent teeb |

Kasutage `$input.text`, `$nodeName.field` ja muud [Expression DSL](../reference/expression-dsl.md) süntaksit.

### Arutlusmudelid (o1, o3)

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (vaikeväärtus: 0.7), standardsete mudelite jaoks |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Arutlussügavus arutlusmudelite jaoks |

Arutlusmudeli (nt o1, o3) kasutamisel kuvab UI **Reasoning Effort** temperatuuri asemel. Standardsete mudelite puhul juhib **Temperature** loovust.

**JSON-väljundi näide:** Kui vajate agendilt struktureeritud andmeid (nt klassifitseerimine, eraldamine), lubage JSON-väljund ja esitage skeem. Agent tagastab skeemile vastava JSON-i; pääsete väljadele ligi nime järgi node'i väljundis:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Edasised node'id saavad kasutada `$agentLabel.status`, `$agentLabel.reason` jne. Sama käitumine nagu [LLM node](../nodes/llm-node.md) JSON-väljundil.

## Inimhindamine (HITL)

Kasutage HITL-i, kui agent võib vajada kinnitust konkreetsetel hetkedel enne olulisi toiminguid.

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Lisab agendile inimhindamise kontrollpunktid |
| `hitlSummary` | string | Kinnitamise juhised, mis ütlevad agendile, millal on inimhindamine vajalik |

Kui HITL on lubatud, saab agent tööriista `request_human_review`. Kasutage süsteemset prompti ja
seda juhiste välja, et selgitada, millised tööriistakutsed, sub-agendid, sub-workflow'd, MCP-toimingud, oskused
või kõrvalmõjud nõuavad kinnitust. Agent saab seda tööriista kutsuda ainult siis, kui vaja, sealhulgas mitu
korda ühe käivituse jooksul.

Hindajale suunatud kokkuvõte avalikul lehel genereeritakse agendi hindamistaotlusest
käitusajal. Kui agent ei esita kokkuvõtet selgesõnaliselt, tuletab Heym selle Markdown-vormingus
hindamise sisust.

MCP-tööriistade puhul palub Heym mudelil tõlgendada teie kirjalikke HITL-juhiseid ühena kolmest
ulatusest: `always`, `once` või `never`. See tähendab, et vabas vormis sõnastus nagu "iga kutse kohta", "ainult
üks kord" või "ära kunagi küsi" normaliseeritakse enne käitusaegse värava rakendamist.

Iga HITL-kontrollpunkt loob ühekordse avaliku hindamislingi aadressil `/review/{token}`. Hindaja saab:

- **Accept** algse Markdown-vormingus hindamisteksti
- **Edit & Continue** muudetud Markdowniga
- **Refuse** ja jätkata väärtusega `text: ""`

Kui HITL on lubatud, paljastab node lõuendil ka `review` väljundkäepideme. Ühendage see haru Slacki, e-posti või muude teavituste node'idega, kui soovite edastada hindamis-URL-i ja kokkuvõtte kohe, kui käivitus peatub.

Käivitus läheb olekusse `pending`, kuni hindaja vastab. Hindamistekst on üks Markdown-vormingus sisu ja ootel payload sisaldab ka jagatava lingi teksti väliseks üleandmiseks. `review` harul olevad node'id käivituvad kohe, kui paus luuakse; tavaline väljundtee jätkub alles pärast kinnitamist. Pärast kinnitamist jätkab Heym salvestatud käivituse hetktõmmisest ja agent jätkab kinnitatud kontekstiga. Kui hilisem samm vajab samuti kinnitust, saab agent luua teise HITL-kontrollpunkti. Vaadake [Human-in-the-Loop](../reference/human-in-the-loop.md) payload'i kuju, hindamis-URL-i käitumise ja jätkamise semantika kohta.

HITL on saadaval ainult tekstirežiimis agendi väljundi jaoks. V1-s ei saa seda kombineerida `jsonOutputEnabled`-iga.
## Orkestraatori režiim

Kui see on lubatud, saab agent delegeerida ülesandeid workflow' teistele agent-sõlmedele. Kui **orkestraatori režiim on keelatud**, ei saa agent **lõuendil luua agent→agent ühendusi**.

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Kui `true`, saab agent tööriista `call_sub_agent` |
| `subAgentLabels` | string[] | Selle orkestraatori poolt kutsutavate agent-sõlmede sildid |

**Alamagentide** kasutajateates peab olema kasutatud `$input.text`, et nad saaksid kätte orkestraatori prompti.

Kui orkestraator kutsub ühe käigu jooksul mitut alamagenti, käivituvad need paralleelselt. Üksikasju vt [Agendi arhitektuur](../reference/agent-architecture.md).

## Alam-workflow'd

Kui see on konfigureeritud, saab agent tööriista `call_sub_workflow` teiste workflow'de käivitamiseks.

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | Nende workflow'de ID-d, mida see agent saab tööriistadena kutsuda |

Valige workflow'd agendi konfiguratsiooni jaotises Alam-workflow'd. Agent kutsub neid parameetritega `workflow_id` ja `inputs` (objekt, mis vastab sihtworkflow' sisendväljadele). Maksimaalne sügavus: 5 pesastatud alam-workflow' kutset.

## Lõuendi sõlme tööriistad

Saate ühendada toetatud workflow' sõlme agendi **tööriistade** käepideme külge, et agent saaks seda sõlme käitusajal kutsuda. See muudab olemasolevad lõuendi toimingud ja teisendused kutsutavateks tööriistadeks ilma Pythonit kirjutamata.

Kasutage lõuendi sõlme tööriistu, kui soovite, et agent otsustaks, millal konfigureeritud sõlme käivitada, säilitades samal ajal mandaadid, staatilised väljad ja workflow'-spetsiifilised seaded sõlme kasutajaliideses.

### Agendi poolt esitatavad väljad

Ühendatud tööriista sõlme välju saab märgistada boti ikooniga. Märgistatud väljadest saavad nõutud tööriista parameetrid, mille agent peab sõlme kutsumisel esitama. Märgistamata väljad jäävad fikseerituks ja loetakse sõlme konfiguratsioonist.

Näiteks:

- Ühendage Slacki sõlm agendiga tööriistana
- Hoidke mandaat Slacki sõlmes fikseerituna
- Märgistage `message` agendi poolt esitatavaks
- Agent saab Slacki tööriista, kus ta esitab käitusajal ainult sõnumi

Kui sõlm ei ole agendiga tööriistana ühendatud, on boti ikoon peidetud ja sõlm käitub nagu tavaline workflow' samm.

### Käitumine käitusajal

Kui agent kutsub lõuendi sõlme tööriista, ühendab Heym ajutiselt agendi esitatud argumendid selle sõlme andmetega, käivitab sõlme, tagastab sõlme väljundi agendile ja seejärel taastab algse sõlme konfiguratsiooni. Tööriista sõlmed ei käivitu tavaliste workflow' sammudena tavalise ajastamise kaudu; need käivituvad ainult siis, kui agent neid kutsub.

Lõuendi sõlme tööriistad on kasulikud integratsioonisõlmedega nagu Slack, Telegram, HTTP, Send Email ja andmeid kujundavate sõlmedega nagu [Set](./set-node.md). Trigger-sõlmi, juhtimisvoo sõlmi ja lõpliku väljundi mappereid ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) ei saa agendi tööriistadena kasutada.

## Pythoni tööriistad

Määratlege kohandatud tööriistad, mida agent saab kutsuda. Igal tööriistal on:

| Väli | Tüüp | Kirjeldus |
|-------|------|-------------|
| `name` | string | Tööriista nimi (nt `count_characters`) |
| `description` | string | LLM-i jaoks mõeldud kirjeldus |
| `parameters` | JSON Schema | OpenAI funktsioonikutsumise skeem (objekti formaat) |
| `code` | string | Pythoni funktsiooni kood |

**Parameters** peab olema JSON-objekt, mitte string:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Näidistööriist:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Pythoni tööriistad käivituvad vaikimisi mitteusaldusväärse koodina karastatud, isoleeritud Docker-konteineris (võrk puudub, Dockeri socket puudub, kirjutuskaitstud failisüsteem, mitte-root). Impordid on piiratud turvaliste standardteegi moodulite lubatud loendiga. Konfiguratsiooni (`HEYM_PYTHON_TOOL_SANDBOX`) kohta vt [Turvalisus → Pythoni tööriista sandbox](../reference/security.md#python-tool-sandbox).

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Maksimaalne sekundite arv tööriista käivitamise kohta (vaikimisi: 30) |
| `requestTimeoutSeconds` | number | Maksimaalne sekundite arv iga mudeli vastuse ootamiseks enne aegumist (vaikimisi: 60). Suurendage seda aeglaste või isemajutatud pakkujate (LiteLLM, vLLM, kohalikud mudelid) ja pikkade mitmeastmeliste käivituste jaoks. |
## MCP-ühendused

Ühendage [Model Context Protocol](https://modelcontextprotocol.io/) serveritega, et avada nende tööriistad agendile.

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Ühenduse tüüp |
| `timeoutSeconds` | number | Selle ühenduse ajalõpp (vaikeväärtus: 30) |
| `label` | string | Valikuline kuvatav nimi |

**stdio** (kohalik protsess):

| Väli | Kirjeldus |
|-------|-------------|
| `command` | Käivitatav käsk (nt `npx`) |
| `args` | JSON-massiiv (nt `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | JSON-objekt keskkonnamuutujatest, mis protsessi süstitakse (nt `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

Enamik API-võtmega stdio-serveritest autendivad end keskkonnamuutujate kaudu, mitte käsurea argumentide kaudu. Määrake `env` ühendusepõhiselt, et iga agendi node saaks kasutada erinevat mandaati ilma hostkeskkonda puutumata.

`env` väärtused toetavad [Expression DSL](../reference/expression-dsl.md), seega saate edastada workflow'i sisendeid mandaatidena, selle asemel et saladusi kõvakodeerida:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Avaldis `$userInput.pat` lahendatakse käitusajal workflow'i sisendandmete põhjal enne MCP-protsessi käivitamist. See võimaldab vastu võtta tokeneid triggerist või sisendsõlmest, selle asemel et neid workflow'i definitsiooni manustada.

Näide — GitHub MCP kõvakodeeritud tokeniga:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Näide — GitHub MCP dünaamilise tokeniga workflow'i sisendist:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Näide — GitHub MCP Heymi GitHubi mandaadiga:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Sisseehitatud GitHubi mandaat on praegu suunatud PAT-põhisele autentimisele. Kui vajate organisatsiooni juurdepääsu, kasutage PAT-i vajalike orgi/repositooriumi õigustega.

Näide — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (kaugserver):

| Väli | Kirjeldus |
|-------|-------------|
| `url` | SSE endpoint'i URL. Toetab avaldisi (nt `$userInput.serverUrl`). |
| `headers` | JSON-objekt autentimise/kohandatud päiste jaoks. Väärtused toetavad avaldisi. |

**Streamable HTTP** (kaugserver):

| Väli | Kirjeldus |
|-------|-------------|
| `url` | MCP endpoint'i URL (nt `https://example.com/mcp`). Toetab avaldisi. |
| `headers` | JSON-objekt autentimise/kohandatud päiste jaoks. Väärtused toetavad avaldisi. |

## Skills

Skills on SKILL.md juhised pluss valikulised Python-failid ja kaasas olevad varad. Need laiendavad agendi süsteemikonteksti ja võivad lisada Python-tööriistu.

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `name` | string | Skill'i nimi |
| `content` | string | SKILL.md sisu (juhised) |
| `timeoutSeconds` | number | Skill'i Pythoni täitmise ajalõpp (vaikeväärtus: 30) |
| `driveFilesEnabled` | boolean | Lubab selle skill'i jaoks käitusaegse `heym_drive` abifunktsiooni (vaikeväärtus: false) |
| `files` | array | Valikulised `{ path, content, encoding, mimeType }` kirjed (nt `.py` skriptid või binaarsed varad, mis on salvestatud base64-na) |

Skille saab lisada, kukutades `.zip` või `.md` faili Skills-alale.
Pärast skill-kaardi laiendamist kukutage mis tahes fail sellele skill'ile, et lisada või asendada kaasas olevat faili, sealhulgas binaarseid varasid nagu PDF-id ja pildid.
Kasutage skill-kaardi allalaadimisnuppu, et eksportida see skill `.zip` arhiivina varundamiseks või taaskasutamiseks teises workflow's.

Lubage skill'il **Drive files** ainult siis, kui selle Pythoni kood peab lugema faile Heym Drive'ist. Lubatud skill'id saavad käitusajal loodud `heym_drive.py` abifunktsiooni ja saavad kutsuda `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` või `read_drive_base64` Drive'i faili id või täpse failinimega. Failinime otsing kasutab uusimat juurdepääsetavat vastet. Keelatud skill'id abifunktsiooni ei saa.

Igal skill-kaardil on neli toimingut pealkirja all oleval real:

| Nupp | Kirjeldus |
|--------|-------------|
| **Edit with AI** | Avab Skill Builderi, et skill'i chat-prompti abil üle vaadata |
| **Download** | Ekspordib skill'i `.zip` arhiivina |
| **Remove** | Kustutab skill'i sellest agendi node'ist |
| **History** | Avab skill'i ajaloo, mis on tuletatud [Edit History](../reference/edit-history.md)-st |
### Skill ajalugu

Skill ajalugu **ei** salvestata eraldi. See tuletatakse workflow ajaloo (Edit History) hetktõmmistest: iga salvestatud workflow versioon sisaldab täielikku agent node'i `skills` massiivi.

Ajaloo dialoogist saate:

- **Eelvaadata** varasemat hetktõmmist (SKILL.md ja failide loend)
- **Muuta** — laadida hetktõmmis skill redaktorisse ilma kogu workflow'd tagasi pööramata
- **AI Fine-tune** — avada Skill Builder, kasutades seda hetktõmmist lähtepunktina
- **Taastada** — taastada ainult see skill varasemast versioonist (teised node'id jäävad muutmata)

Ajalugu järgib sama 7-päevast säilitusaega nagu workflow ajalugu (Edit History). Workflow salvestamine pärast skill muudatusi loob uued ajalookirjed.

Sektsioon Skills sisaldab ka **AI Build**:

- Klõpsake **AI Build**, et luua uus skill chat prompti abil
- Klõpsake olemasoleva skill'i sädemikunupul, et seda AI abil täiendada
- Kukutage failid prompti koostajasse, et need fine-tune kommentaari manustada; need failid salvestatakse ka skill'i komplekti kuuluvate varadena
- Modaalaken edastab assistendi teksti voogesitusena, näidates samal ajal reaalajas `SKILL.md` ja `.py` failide eelvaateid
- **Download ZIP** ekspordib praeguse eelvaate ilma seda node'ile lisamata
- **Save & Add** salvestab genereeritud failid tagasi sama ZIP-i parsimise voo kaudu, mida kasutatakse käsitsi üleslaadimisel

AI-ga redigeerimisel saadab Heym builder'ile ainult tekstilised `.md` ja `.py` skill failid. Binaarsed ja muud mitteredigeeritavad manused säilitatakse ja jagatakse builder'iga tee metaandmetena, et genereeritud Pythoni kood saaks hoida suhtelised failiviited korrektsed.
Valige paremal paneelil manustatud fail ja lubage **Include this file in AI context**, kui AI-l on vaja komplekti kuuluvat mallandit uurida. Teksti-, PDF- ja DOCX-failid ekstraktitakse võimaluse korral prompti konteksti; Heym ei rakenda eraldi Skill Builderi manuse suuruse ülempiiri peale platvormi päringu keha limiidi.

## Extra Body

Mõned pakkujad aktsepteerivad päringu parameetreid, mida standardsed OpenAI-ga ühilduvad väljad
ei kata, näiteks mudeli mõtlemisrežiimi keelamine. Märkige node'i atribuutides **Send extra request body** ja sisestage JSON-objekt.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Vaikimisi keelatud.** Kui märkeruut on välja lülitatud, ei saadeta midagi lisa.
- Rakendatakse **igale** päringule tööriistade kutsumise tsüklis, mitte ainult esimesele voorule, pluss varumudeli katsele. Ei rakendata guardrail kontrollidele, mis kasutavad eraldi mudelit.
- Peab olema JSON **objekt**. Massiiv, skalaar või vigane tekst põhjustab node'i nurjumise veaga
  `Invalid extra body JSON`, mitte ei jäeta vaikselt kõrvale.
- `$` avaldised lahendatakse enne parsimist. Kuna tegemist on tekstilise asendusega, tekitab lahendatud väärtus, mis sisaldab jutumärki või reavahetust, vigase JSON-i ja node nurjub.

Sama väli ja käitumine nagu [LLM node](./llm-node.md) extra body'l.

## Guardrails

Lubage node'i atribuutides **Guardrails**, et blokeerida ohtlikud kasutaja sõnumid enne agenti käivitumist. Täieliku viite leiate jaotisest [Guardrails](../reference/guardrails.md).

## Püsiv mälu (graaf)

Valikuline **agent-node'i põhine** teadmiste graaf, mis on salvestatud andmebaasi. Kui see on lubatud, lisab Heym enne iga käivitust **süsteemijuhisele** meelespeetud olemite ja seoste Markdown-kokkuvõtte (ainult siis, kui graaf ei ole tühi). Pärast **edukat** agendi lõpetamist ekstraktib taustatöö vestlusest uued püsivad faktid ja ühendab need graafiga.

| Parameeter | Tüüp | Kirjeldus |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Lubab selle lõuendi node'i jaoks laadimise + taustal ekstraktimise |

**Sub-agendid** hoiavad **oma** graafi (võtmena nende node'i id), eraldi orkestraatorist.

Kasutage node'il roosat **aju** juhtelementi (kui mälu on sees või mudeli rida on näidatud), et avada graafi redaktor ja valikuline **mälu jagamine** (teiste workflow'de/agentidega). Täielik käitumine, REST-teed ja JSON-ekspordi üksikasjad: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API ja arutluse järjepidevus

Märkeruut **Use Responses API** suunab agendi mudelikutsed läbi
[Responses API](https://platform.openai.com/docs/api-reference/responses) Chat Completionsi asemel. See on vaikimisi välja lülitatud.

See on kõige olulisem arutlusmudelil nagu `gpt-5` või `o` seeria. Responses API tagastab mudeli arutluse iga tööriista kutse kõrval ja agent söödab need arutlusüksused järgmisel voorul tagasi, nii et mudel hoiab oma mõtteahelat mitmeastmelises tööriistatsüklis, selle asemel et seda iga tööriista tulemuse järel uuesti tuletada. Kogu tsükkel töötab samal teel, sealhulgas
[inimülevaatuse](#human-review-hitl) paus ja jätkamine, [konteksti tihendamine](#context-compression)
ja lõplik vastus.

Vestlus ise jääb Heymi. Heym saadab igal voorul täieliku sisendi ja kannab arutluse krüpteeritud blobina, nii et pakkuja poolel ei säilitata kutsungite vahel midagi.
Arutlusüksused vahemikus, mille konteksti tihendamine kokku võtab, jäetakse samuti kõrvale, kuna krüpteeritud blob'i ei saa kokku võtta.

See töötab OpenAI mandaadiga ja kohandatud mandaadiga, mille gateway toetab endpoint'i. Google'i mandaadiga jääb see välja lülitatuks.
## Konteksti kokkusurumine

Kui agent teeb palju tööriistade iteratsioone suurte tulemustega (veebi kraapimine, dokumentide lugemine, alam-workflow'de väljundid), võib kogunenud sõnumiajalugu läheneda mudeli kontekstiakna piirile. Heym surub vestluse ajaloo käivituse keskel automaatselt kokku, et vältida konteksti ületäitumist.

**Kuidas see töötab:**

1. Enne iga tööriista iteratsiooni hindab Heym hetke tokenite arvu (~4 tähemärki tokeni kohta).
2. Kui hinnang ületab **80%** mudeli kontekstiaknast, käivitub kokkusurumine.
3. Sõnumiajalugu jagatakse säilitatavaks ja kokkusurutavaks osaks:
   - **Säilitatav**: süsteemi prompt, esimene kasutaja sõnum, kõige värskem kasutaja sõnum
   - **Kokkusurutav**: kõik vahepealne (assistendi arutluskäigud, tööriistakutsed, tööriistade tulemused)
4. Keskmine osa võetakse kokku, kasutades **sama mudelit ja mandaati** — täiendavat konfiguratsiooni pole vaja.
5. Kokkusurutud kokkuvõte asendab keskmise osa ühe assistendi sõnumina.

**Jälgitavus:**

Kokkusurumise sündmused kuvatakse kirjetena `Context compressed (N messages → summary)`:
- **Debug-paneeli** tööriistakutsute loendis reaalajas käivitamise ajal
- **Käivituste ajaloo** käivituse üksikasjavaates
- **Traces-vahekaardil** kirjena `context.compression`

Kokkusurumine on automaatne ja alati aktiivne Agent-sõlmede puhul. See **ei** rakendu LLM-sõlmedele, Chat-vahekaardile ega AI Assistanti sessioonidele.

## Seotud

- [Miks Heym](../getting-started/why-heym.md) – Kuidas agentid töötavad ja püsivad tootmises juhituna
- [Agendi püsiv mälu](../reference/agent-persistent-memory.md) – Teadmiste graaf iga agent-sõlme kohta, valikuline jagamine, API, redaktor
- [Agendi arhitektuur](../reference/agent-architecture.md) – Alam-agendid, orkestraator, oskused, MCP, tööriistade kutsumine
- [Inimene tsüklis](../reference/human-in-the-loop.md) – Avalikud ülevaatamise lehed, ootel käivitused, kinnitamise/muutmise/keeldumise voog
- [Kaitsepiirded](../reference/guardrails.md) – Blokeeri ebaturvalised sisukategooriad
- [Sõlmede tüübid](../reference/node-types.md) – Ülevaade kõigist sõlmede tüüpidest
- [AI Assistant](../reference/ai-assistant.md) – Chat-liides workflow'de loomiseks loomulikus keeles (erineb Agent-sõlmest)
- [Avaldise DSL](../reference/expression-dsl.md) – Andmetele viitamine promptides
- [Workflow struktuur](../reference/workflow-structure.md) – Sõlmed, servad ja DSL-vorming
- [Kiire algus](../getting-started/quick-start.md) – Põhiline workflow LLM-iga ja avaldistega
- [Mandaatide vahekaart](../tabs/credentials-tab.md) – Lisa API-võtmed agendi jaoks
- [MCP vahekaart](../tabs/mcp-tab.md) – Konfigureeri MCP workflow tööriistade jaoks
