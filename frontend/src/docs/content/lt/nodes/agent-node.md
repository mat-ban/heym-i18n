# Agent Node

**AI Agent** mazgas yra LLM mazgas su įrankių iškvietimu. Jis gali vykdyti Python įrankius, iškviesti prijungtus drobės mazgus kaip įrankius, prisijungti prie MCP serverių, naudoti įgūdžius, pasirinktinai veikti kaip orkestratorius, deleguojantis užduotis kitiems agentų mazgams, iškviesti kitus workflow kaip įrankius ir pristabdyti [žmogaus peržiūrai](../reference/human-in-the-loop.md).

## Apžvalga

| Savybė | Reikšmė |
|----------|-------|
| Įvestys | 1 |
| Išvestys | 1, papildomai `review`, kai įjungta HITL |
| Išvestis | `$nodeLabel.text`, `$nodeLabel.fieldName` (kai įjungta JSON išvestis) arba laukiantis HITL payload, kol laukiama peržiūros |

## Pagrindiniai parametrai

### Kredencialai ir modelis

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `credentialId` | UUID | LLM kredencialai (API raktas) iš Nustatymų |
| `model` | string | Modelio pavadinimas (pvz., `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (pasirinktinai) | Atsarginiai kredencialai, kai pirminiai nepavyksta |
| `fallbackModel` | string (pasirinktinai) | Atsarginis modelis, kai pirminis nepavyksta |

Pridėkite kredencialus skirtuke [Kredencialai](../tabs/credentials-tab.md). Modelių sąrašas įkeliamas iš pasirinktų kredencialų. Jei pirminiai kredencialai ar modelis grąžina klaidą, mazgas automatiškai bando iš naujo su atsarginiais kredencialais ir modeliu prieš tai, kai nepavyksta.

### Prompt

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `systemInstruction` | string | Sistemos prompt AI. Palaiko [išraiškas](../reference/expression-dsl.md). |
| `userMessage` | string | Vartotojo žinutė/prompt. Numatytoji: `$input.text` |
| `jsonOutputEnabled` | boolean | Struktūrizuota JSON išvestis |
| `jsonOutputSchema` | string | JSON Schema struktūrizuotai išvesčiai |
| `extraBodyEnabled` | boolean | Siųsti tiekėjui specifinius užklausos parametrus (numatytoji: `false`) |
| `extraBody` | string | JSON objektas, sujungiamas į kiekvieną API užklausą, kurią atlieka agentas |

Naudokite `$input.text`, `$nodeName.field` ir kitą [Expression DSL](../reference/expression-dsl.md) sintaksę.

### Reasoning modeliai (o1, o3)

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (numatytoji: 0.7), standartiniams modeliams |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Reasoning gylis reasoning modeliams |

Naudojant reasoning modelį (pvz., o1, o3), vartotojo sąsaja rodo **Reasoning Effort** vietoj Temperature. Standartiniams modeliams **Temperature** kontroliuoja kūrybiškumą.

**JSON išvesties pavyzdys:** Kai reikia struktūrizuotų duomenų iš agento (pvz., klasifikavimo, išgavimo), įjunkite JSON išvestį ir pateikite schemą. Agentas grąžina JSON, atitinkantį schemą; pasiekite laukus pagal pavadinimą mazgo išvestyje:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Tolimesni mazgai gali naudoti `$agentLabel.status`, `$agentLabel.reason` ir kt. Toks pat elgesys kaip [LLM mazgo](../nodes/llm-node.md) JSON išvesties.

## Žmogaus peržiūra (HITL)

Naudokite HITL, kai agentui gali prireikti patvirtinimo tam tikrais momentais prieš svarbius veiksmus.

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Prideda žmogaus peržiūros kontrolinius taškus agentui |
| `hitlSummary` | string | Patvirtinimo gairės, nurodančios agentui, kada reikia žmogaus peržiūros |

Kai HITL įjungta, agentas gauna `request_human_review` įrankį. Naudokite sistemos prompt ir
šį gairių lauką, kad paaiškintumėte, kurie įrankių iškvietimai, sub-agentai, sub-workflow, MCP veiksmai, įgūdžiai
ar šalutiniai poveikiai reikalauja patvirtinimo. Agentas gali iškviesti tą įrankį tik tada, kai reikia, įskaitant kelis
kartus per vieną vykdymą.

Peržiūrėtojui skirta suvestinė viešame puslapyje generuojama iš agento peržiūros užklausos
vykdymo metu. Jei agentas aiškiai nepateikia suvestinės, Heym išveda ją iš Markdown
peržiūros turinio.

MCP įrankiams Heym prašo modelio interpretuoti jūsų parašytas HITL instrukcijas kaip vieną iš trijų
apimčių: `always`, `once` arba `never`. Tai reiškia, kad laisvos formuluotės, tokios kaip "for each call", "only
one time" arba "never ask", yra normalizuojamos prieš taikant vykdymo metu galiojančius apribojimus.

Kiekvienas HITL kontrolinis taškas sukuria vienkartinę viešą peržiūros nuorodą adresu `/review/{token}`. Peržiūrėtojas gali:

- **Priimti** originalų Markdown peržiūros tekstą
- **Redaguoti ir tęsti** su pakeistu Markdown
- **Atsisakyti** ir tęsti su `text: ""`

Kai HITL įjungta, mazgas taip pat atskleidžia `review` išvesties rankeną drobėje. Prijunkite tą šaką prie Slack, el. pašto ar kitų pranešimų mazgų, jei norite transliuoti peržiūros URL ir suvestinę iškart, kai vykdymas pristabdomas.

Vykdymas pereina į `pending` būseną, kol peržiūrėtojas atsako. Peržiūros tekstas yra vienas Markdown turinys, o laukiantis payload taip pat apima bendrinamos nuorodos tekstą išoriniam perdavimui. Mazgai `review` šakoje vykdomi iškart, kai sukuriamas pristabdymas; įprastas išvesties kelias tęsiamas tik po patvirtinimo. Po patvirtinimo Heym atnaujina vykdymą iš išsaugoto vykdymo momentinės kopijos ir agentas tęsia su patvirtintu kontekstu. Jei vėlesnis žingsnis taip pat reikalauja patvirtinimo, agentas gali sukurti kitą HITL kontrolinį tašką. Žr. [Human-in-the-Loop](../reference/human-in-the-loop.md) dėl payload struktūros, peržiūros URL elgesio ir atnaujinimo semantikos.

HITL galima naudoti tik tekstinio režimo agento išvesčiai. V1 versijoje jo negalima derinti su `jsonOutputEnabled`.
## Orchestrator režimas

Kai įjungtas, agentas gali deleguoti užduotis kitiems agentų mazgams workflow'e. Jei **Orchestrator režimas išjungtas**, agentas **negali kurti agentas→agentas ryšių** drobėje.

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Kai `true`, agentas gauna `call_sub_agent` įrankį |
| `subAgentLabels` | string[] | Agentų mazgų, kuriuos šis orchestratorius gali iškviesti, žymos |

**Sub-agentai** savo User Message turi naudoti `$input.text`, kad gautų orchestratoriaus prompt.

Kai orchestratorius vieno ciklo metu iškviečia kelis sub-agentus, jie vykdomi lygiagrečiai. Daugiau informacijos rasite [Agent Architecture](../reference/agent-architecture.md).

## Sub-Workflows

Kai sukonfigūruota, agentas gauna `call_sub_workflow` įrankį kitiems workflow'ams vykdyti.

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | Workflow'ų, kuriuos šis agentas gali iškviesti kaip įrankius, ID |

Pasirinkite workflow'us agento konfigūracijos skiltyje Sub-Workflows. Agentas juos iškvies su `workflow_id` ir `inputs` (objektas, atitinkantis tikslinio workflow'o įvesties laukus). Maksimalus gylis: 5 įdėtieji sub-workflow iškvietimai.

## Drobės mazgų įrankiai

Galite prijungti palaikomą workflow mazgą prie agento **tools** rankenos, kad agentas galėtų iškviesti tą mazgą vykdymo metu. Tai paverčia esamus drobės veiksmus ir transformacijas iškviečiamais įrankiais nerašant Python kodo.

Naudokite drobės mazgų įrankius, kai norite, kad agentas nuspręstų, kada paleisti sukonfigūruotą mazgą, išlaikant kredencialus, statinius laukus ir workflow'ui būdingus nustatymus mazgo UI.

### Agento pateikiami laukai

Prijungto įrankio mazgo laukai gali būti pažymėti boto piktograma. Pažymėti laukai tampa privalomais įrankio parametrais, kuriuos agentas turi pateikti kviesdamas mazgą. Nepažymėti laukai lieka fiksuoti ir nuskaitomi iš mazgo konfigūracijos.

Pavyzdžiui:

- Prijunkite Slack mazgą prie agento kaip įrankį
- Palikite kredencialą fiksuotą Slack mazge
- Pažymėkite `message` kaip agento pateikiamą
- Agentas gauna Slack įrankį, kuriame vykdymo metu pateikia tik pranešimą

Jei mazgas nėra prijungtas prie agento kaip įrankis, boto piktograma yra paslėpta, o mazgas veikia kaip įprastas workflow žingsnis.

### Vykdymo metu elgsena

Kai agentas iškviečia drobės mazgo įrankį, Heym laikinai sujungia agento pateiktus argumentus į to mazgo duomenis, įvykdo mazgą, grąžina mazgo išvestį agentui, tada atkuria pradinę mazgo konfigūraciją. Įrankių mazgai nevykdomi kaip įprasti workflow žingsniai per įprastą planavimą; jie vykdomi tik tada, kai agentas juos iškviečia.

Drobės mazgų įrankiai yra naudingi su integracijų mazgais, tokiais kaip Slack, Telegram, HTTP, Send Email, ir duomenų formavimo mazgais, tokiais kaip [Set](./set-node.md). Trigger mazgai, valdymo srauto mazgai ir galutinės išvesties mapintuvai ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) negali būti naudojami kaip agento įrankiai.

## Python įrankiai

Apibrėžkite pasirinktinius įrankius, kuriuos agentas gali iškviesti. Kiekvienas įrankis turi:

| Laukas | Tipas | Aprašymas |
|-------|------|-------------|
| `name` | string | Įrankio pavadinimas (pvz., `count_characters`) |
| `description` | string | Aprašymas LLM |
| `parameters` | JSON Schema | OpenAI function-calling schema (objekto formatas) |
| `code` | string | Python funkcijos kodas |

**Parameters** turi būti JSON objektas, ne string:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Įrankio pavyzdys:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Python įrankiai pagal numatytuosius nustatymus vykdomi kaip nepatikimas kodas sustiprintame, izoliuotame Docker konteineryje (be tinklo, be Docker socket, tik skaitomas failų sistema, ne root). Importai apriboti saugių standartinės bibliotekos modulių allowlist'u. Konfigūraciją (`HEYM_PYTHON_TOOL_SANDBOX`) rasite [Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox).

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Maksimalus sekundžių skaičius vieno įrankio vykdymui (numatytoji: 30) |
| `requestTimeoutSeconds` | number | Maksimalus sekundžių skaičius laukti kiekvieno modelio atsakymo prieš baigiantis laikui (numatytoji: 60). Padidinkite jį lėtiems ar savarankiškai talpinamiems teikėjams (LiteLLM, vLLM, vietiniai modeliai) ir ilgiems daugiapakopiams vykdymams. |
## MCP ryšiai

Prisijunkite prie [Model Context Protocol](https://modelcontextprotocol.io/) serverių, kad jų įrankiai būtų prieinami agentui.

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Ryšio tipas |
| `timeoutSeconds` | number | Šio ryšio skirtasis laikas (numatytoji reikšmė: 30) |
| `label` | string | Pasirenkamas rodomasis pavadinimas |

**stdio** (vietinis procesas):

| Laukas | Aprašymas |
|-------|-------------|
| `command` | Vykdoma komanda (pvz., `npx`) |
| `args` | JSON masyvas (pvz., `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | JSON objektas su aplinkos kintamaisiais, įterpiamais į procesą (pvz., `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

Dauguma stdio serverių, naudojančių API raktus, autentifikuojasi per aplinkos kintamuosius, o ne per komandos argumentus. Nustatykite `env` kiekvienam ryšiui atskirai, kad kiekvienas agento mazgas galėtų naudoti skirtingą kredencialą, neliesdamas pagrindinės aplinkos.

`env` reikšmės palaiko [Expression DSL](../reference/expression-dsl.md), todėl galite perduoti workflow įvestis kaip kredencialus, o ne užkoduoti paslaptis tiesiogiai:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Išraiška `$userInput.pat` išsprendžiama vykdymo metu pagal workflow įvesties duomenis prieš paleidžiant MCP procesą. Tai leidžia priimti tokenus iš trigger arba įvesties mazgo, o ne įterpti juos į workflow apibrėžtį.

Pavyzdys — GitHub MCP su tiesiogiai užkoduotu tokenu:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Pavyzdys — GitHub MCP su dinaminiu tokenu iš workflow įvesties:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Pavyzdys — GitHub MCP su Heym GitHub kredencialu:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Integruotas GitHub kredencialas šiuo metu skirtas autentifikacijai per PAT. Jei reikia prieigos prie organizacijos, naudokite PAT su reikiamomis organizacijos/repozitorijos teisėmis.

Pavyzdys — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (nuotolinis serveris):

| Laukas | Aprašymas |
|-------|-------------|
| `url` | SSE endpoint URL. Palaiko išraiškas (pvz., `$userInput.serverUrl`). |
| `headers` | JSON objektas autentifikacijos / pasirinktinėms antraštėms. Reikšmės palaiko išraiškas. |

**Streamable HTTP** (nuotolinis serveris):

| Laukas | Aprašymas |
|-------|-------------|
| `url` | MCP endpoint URL (pvz., `https://example.com/mcp`). Palaiko išraiškas. |
| `headers` | JSON objektas autentifikacijos / pasirinktinėms antraštėms. Reikšmės palaiko išraiškas. |

## Skills

Skills yra SKILL.md instrukcijos bei pasirenkami Python failai ir pridėti ištekliai. Jie praplečia agento sistemos kontekstą ir gali pridėti Python įrankių.

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `name` | string | Skill pavadinimas |
| `content` | string | SKILL.md turinys (instrukcijos) |
| `timeoutSeconds` | number | Skill Python vykdymo skirtasis laikas (numatytoji reikšmė: 30) |
| `driveFilesEnabled` | boolean | Įjungia vykdymo metu prieinamą `heym_drive` pagalbininką šiam skill (numatytoji reikšmė: false) |
| `files` | array | Pasirenkami `{ path, content, encoding, mimeType }` įrašai (pvz., `.py` scenarijai arba dvejetainiai ištekliai, saugomi kaip base64) |

Skills galima pridėti nutempiant `.zip` arba `.md` failą į Skills sritį.
Išskleidus skill kortelę, nutempkite bet kurį failą ant to skill, kad pridėtumėte arba pakeistumėte pridėtą failą, įskaitant dvejetainius išteklius, tokius kaip PDF ir vaizdai.
Naudokite skill kortelės atsisiuntimo mygtuką, kad eksportuotumėte tą skill kaip `.zip` archyvą atsarginėms kopijoms ar pakartotiniam naudojimui kitame workflow.

Įjunkite **Drive files** skill tik tada, kai jo Python kodui reikia skaityti failus iš Heym Drive. Įjungti skills vykdymo metu gauna sugeneruotą `heym_drive.py` pagalbininką ir gali iškviesti `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` arba `read_drive_base64` su Drive failo id arba tiksliu failo pavadinimu. Failo pavadinimo paieška naudoja naujausią pasiekiamą atitikmenį. Išjungti skills pagalbininko negauna.

Kiekviena skill kortelė turi keturis veiksmus eilutėje po pavadinimo:

| Mygtukas | Aprašymas |
|--------|-------------|
| **Edit with AI** | Atidaro Skill Builder, kad būtų galima peržiūrėti skill pagal chat prompt |
| **Download** | Eksportuoja skill kaip `.zip` archyvą |
| **Remove** | Ištrina skill iš šio agento mazgo |
| **History** | Atidaro skill istoriją, gautą iš [Edit History](../reference/edit-history.md) |
### Įgūdžių istorija

Įgūdžių istorija **nėra** saugoma atskirai. Ji išvedama iš workflow Istorijos momentinių kopijų (snapshot): kiekviena išsaugota workflow versija apima visą agento mazgo `skills` masyvą.

Istorijos dialoge galite:

- **Peržiūrėti** ankstesnę momentinę kopiją (SKILL.md ir failų sąrašą)
- **Redaguoti** — įkelti momentinę kopiją į įgūdžių redaktorių neatkuriant viso workflow
- **AI Fine-tune** — atidaryti Skill Builder su ta momentine kopija kaip pradiniu tašku
- **Grąžinti** — atkurti tik šį įgūdį iš ankstesnės versijos (kiti mazgai lieka tokie, kokie yra)

Istorijai taikomas tas pats 7 dienų saugojimo terminas kaip ir workflow Istorijai. Išsaugojus workflow po įgūdžių pakeitimų, sukuriami nauji istorijos įrašai.

Įgūdžių skiltyje taip pat yra **AI Build**:

- Spustelėkite **AI Build**, kad sukurtumėte naują įgūdį iš chat prompt
- Spustelėkite kibirkšties mygtuką prie esamo įgūdžio, kad jį patobulintumėte su AI
- Įmeskite failus į prompt kompozitorių, kad juos pridėtumėte prie fine-tune komentaro; tie failai taip pat išsaugomi kaip pridėti įgūdžių ištekliai
- Modalinis langas transliuoja asistento tekstą, tuo pačiu metu rodydamas tiesiogines `SKILL.md` ir `.py` failų peržiūras
- **Download ZIP** eksportuoja dabartinę peržiūrą nepridedant jos prie mazgo
- **Save & Add** išsaugo sugeneruotus failus per tą patį ZIP analizavimo srautą, kuris naudojamas rankiniam įkėlimui

Redaguojant su AI, Heym siunčia tik tekstinius `.md` ir `.py` įgūdžių failus į builder. Dvejetainiai ir kiti neredaguojami priedai išsaugomi ir bendrinami su builder kaip kelio metaduomenys, kad sugeneruotas Python kodas galėtų išlaikyti teisingas santykines failų nuorodas.
Dešiniajame skydelyje pasirinkite pridėtą failą ir įjunkite **Include this file in AI context**, kai AI reikia patikrinti pridėtą šabloną. Teksto, PDF ir DOCX failai, kai įmanoma, išgaunami į prompt kontekstą; Heym netaiko atskiro Skill Builder priedų dydžio apribojimo, išskyrus platformos užklausos kūno limitą.

## Papildomas užklausos kūnas (Extra Body)

Kai kurie teikėjai priima užklausos parametrus, kurių standartiniai OpenAI suderinami laukai
nepadengia, pavyzdžiui, modelio mąstymo režimo išjungimą. Mazgo savybėse pažymėkite **Send extra request body** ir įveskite JSON objektą.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Pagal numatytuosius nustatymus išjungta.** Kai žymimasis laukelis nepažymėtas, nieko papildomo nesiunčiama.
- Taikoma **kiekvienai** užklausai įrankių iškvietimo cikle, ne tik pirmam ėjimui, taip pat
  atsarginio modelio bandymui. Netaikoma guardrail patikroms, kurios naudoja atskirą modelį.
- Turi būti JSON **objektas**. Masyvas, skaliarinė reikšmė ar netaisyklingas tekstas sugadina mazgą su
  `Invalid extra body JSON`, o ne tyliai atmetamas.
- `$` išraiškos išsprendžiamos prieš analizavimą. Kadangi tai tekstinė pakeitimo operacija, išspręsta
  reikšmė, turinti dvigubą kabutę ar naują eilutę, sukuria netaisyklingą JSON ir sugadina mazgą.

Tas pats laukas ir elgsena kaip [LLM mazgo](./llm-node.md) papildomas užklausos kūnas.

## Guardrails

Mazgo savybėse įjunkite **Guardrails**, kad užblokuotumėte nesaugius vartotojo pranešimus prieš paleidžiant agentą. Visą nuorodą rasite [Guardrails](../reference/guardrails.md).

## Nuolatinė atmintis (grafas)

Pasirenkamas **kiekvienam agento mazgui** žinių grafas, saugomas duomenų bazėje. Kai įjungta, Heym prieš kiekvieną paleidimą prideda Markdown santrauką apie įsimintus objektus ir ryšius prie **sistemos instrukcijos** (tik jei grafas nėra tuščias). Po **sėkmingo** agento užbaigimo foninė užduotis išgauna naujus ilgalaikius faktus iš pokalbio ir sujungia juos į grafą.

| Parametras | Tipas | Aprašymas |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Įjungti įkėlimą + foninį išgavimą šiam drobės mazgui |

**Sub-agentai** išlaiko **savo** grafą (susietą su jų mazgo id), atskirą nuo orkestratoriaus.

Naudokite rožinį **smegenų** valdiklį ant mazgo (kai atmintis įjungta arba rodoma modelio eilutė), kad atidarytumėte grafų redaktorių ir pasirenkamą **atminties bendrinimą** (kiti workflow/agentai). Visas elgesys, REST keliai ir JSON eksporto informacija: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API ir samprotavimo tęstinumas

**Use Responses API** žymimasis laukelis nukreipia agento modelio iškvietimus per
[Responses API](https://platform.openai.com/docs/api-reference/responses), o ne Chat
Completions. Jis išjungtas pagal numatytuosius nustatymus.

Jis svarbiausias samprotaujančiame modelyje, tokiame kaip `gpt-5` ar `o` serija. Responses API grąžina
modelio samprotavimą kartu su kiekvienu įrankio iškvietimu, o agentas tuos samprotavimo elementus perduoda atgal
kitame ėjime, todėl modelis išlaiko savo minčių grandinę per kelių žingsnių įrankių ciklą, o ne
iš naujo ją išveda po kiekvieno įrankio rezultato. Visas ciklas veikia tuo pačiu keliu, įskaitant
[žmogaus peržiūros](#human-review-hitl) pauzę ir tęsimą, [konteksto suspaudimą](#context-compression),
ir galutinį atsakymą.

Pats pokalbis lieka Heym. Heym siunčia visą įvestį kiekvieną ėjimą ir perduoda
samprotavimą kaip užšifruotą blob, todėl nieko neišsaugoma teikėjo pusėje tarp iškvietimų.
Samprotavimo elementai intervale, kurį apibendrina konteksto suspaudimas, atmetami kartu su juo, nes
užšifruoto blob negalima apibendrinti.

Jis veikia su OpenAI kredencialu ir su pasirinktiniu kredencialu, kurio gateway palaiko
endpoint. Su Google kredencialu jis lieka išjungtas.
## Konteksto suspaudimas

Kai agentas atlieka daug įrankių iteracijų su dideliais rezultatais (web scraping, dokumentų skaitymas, sub-workflow išvestys), sukaupta pranešimų istorija gali priartėti prie modelio konteksto lango ribos. Heym automatiškai suspaudžia pokalbio istoriją vykdymo metu, kad būtų išvengta konteksto perpildymo.

**Kaip tai veikia:**

1. Prieš kiekvieną įrankių iteraciją Heym įvertina esamą token skaičių (~4 simboliai vienam token).
2. Jei įvertis viršija **80%** modelio konteksto lango, suaktyvinamas suspaudimas.
3. Pranešimų istorija padalijama į išsaugomas ir suspaudžiamas dalis:
   - **Išsaugoma**: system prompt, pirmasis vartotojo pranešimas, naujausias vartotojo pranešimas
   - **Suspaudžiama**: viskas tarp jų (assistant samprotavimo ėjimai, įrankių iškvietimai, įrankių rezultatai)
4. Vidurinė dalis apibendrinama naudojant **tą patį modelį ir kredencialą** — papildoma konfigūracija nereikalinga.
5. Suspausta santrauka pakeičia vidurinę dalį kaip vienas assistant pranešimas.

**Stebimumas:**

Suspaudimo įvykiai rodomi kaip `Context compressed (N messages → summary)` įrašai:
- **Debug panel** įrankių iškvietimų sąraše tiesioginio vykdymo metu
- **Execution history** vykdymo detalių rodinyje
- **Traces tab** kaip `context.compression` trace įrašas

Suspaudimas yra automatinis ir visada aktyvus Agent mazgams. Jis **netaikomas** LLM mazgams, Chat tab ar AI Assistant sesijoms.

## Susiję

- [Why Heym](../getting-started/why-heym.md) – Kaip agentai veikia ir išlieka valdomi produkcinėje aplinkoje
- [Agent Persistent Memory](../reference/agent-persistent-memory.md) – Žinių grafas kiekvienam agent mazgui, pasirenkamas bendrinimas, API, redaktorius
- [Agent Architecture](../reference/agent-architecture.md) – Sub-agentai, orkestratorius, įgūdžiai, MCP, įrankių iškvietimas
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Vieši peržiūros puslapiai, laukiantys vykdymai, patvirtinimo/redagavimo/atmetimo eiga
- [Guardrails](../reference/guardrails.md) – Nesaugaus turinio kategorijų blokavimas
- [Node Types](../reference/node-types.md) – Visų mazgų tipų apžvalga
- [AI Assistant](../reference/ai-assistant.md) – Chat UI, skirtas kurti workflow naudojant natūralią kalbą (skiriasi nuo Agent mazgo)
- [Expression DSL](../reference/expression-dsl.md) – Duomenų nurodymas promptuose
- [Workflow Structure](../reference/workflow-structure.md) – Mazgai, briaunos ir DSL formatas
- [Quick Start](../getting-started/quick-start.md) – Pagrindinis workflow su LLM ir išraiškomis
- [Credentials Tab](../tabs/credentials-tab.md) – API raktų pridėjimas agentui
- [MCP Tab](../tabs/mcp-tab.md) – MCP konfigūravimas workflow įrankiams
