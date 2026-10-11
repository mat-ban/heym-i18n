# Agent mezgls

**AI Agent** mezgls ir LLM mezgls ar rīku izsaukšanu. Tas var palaist Python rīkus, izsaukt pievienotos kanvas mezglus kā rīkus, savienoties ar MCP serveriem, izmantot prasmes, pēc izvēles darboties kā orķestrētājs, kas deleģē citiem agentu mezgliem, izsaukt citus workflow kā rīkus un apturēt darbību [cilvēka pārbaudei](../reference/human-in-the-loop.md).

## Pārskats

| Īpašība | Vērtība |
|----------|-------|
| Ievades | 1 |
| Izvades | 1, kā arī neobligāta `review`, kad HITL ir iespējots |
| Izvade | `$nodeLabel.text`, `$nodeLabel.fieldName` (kad JSON izvade ir iespējota) vai gaidošs HITL payload, kamēr tiek gaidīta pārbaude |

## Pamata parametri

### Akreditācijas dati un modelis

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `credentialId` | UUID | LLM akreditācijas dati (API atslēga) no Iestatījumiem |
| `model` | string | Modeļa nosaukums (piem., `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (neobligāts) | Rezerves akreditācijas dati, ja primārie neizdodas |
| `fallbackModel` | string (neobligāts) | Rezerves modelis, ja primārais neizdodas |

Pievienojiet akreditācijas datus cilnē [Akreditācijas dati](../tabs/credentials-tab.md). Modeļu saraksts tiek ielādēts no atlasītajiem akreditācijas datiem. Ja primārie akreditācijas dati vai modelis atgriež kļūdu, mezgls automātiski mēģina vēlreiz ar rezerves akreditācijas datiem un modeli pirms kļūmes.

### Prompt

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `systemInstruction` | string | Sistēmas prompt AI. Atbalsta [izteiksmes](../reference/expression-dsl.md). |
| `userMessage` | string | Lietotāja ziņojums/prompt. Noklusējums: `$input.text` |
| `jsonOutputEnabled` | boolean | Strukturēta JSON izvade |
| `jsonOutputSchema` | string | JSON Schema strukturētai izvadei |
| `extraBodyEnabled` | boolean | Sūtīt pakalpojumu sniedzējam raksturīgus pieprasījuma parametrus (noklusējums: `false`) |
| `extraBody` | string | JSON objekts, kas tiek apvienots ar katru API pieprasījumu, ko veic agents |

Izmantojiet `$input.text`, `$nodeName.field` un citu [Expression DSL](../reference/expression-dsl.md) sintaksi.

### Spriešanas modeļi (o1, o3)

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (noklusējums: 0.7) standarta modeļiem |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Spriešanas dziļums spriešanas modeļiem |

Izmantojot spriešanas modeli (piem., o1, o3), UI rāda **Reasoning Effort** temperatūras vietā. Standarta modeļiem **Temperature** kontrolē radošumu.

**JSON izvades piemērs:** Kad nepieciešami strukturēti dati no agenta (piem., klasifikācija, ekstrakcija), iespējojiet JSON izvadi un norādiet shēmu. Agents atgriež JSON, kas atbilst shēmai; piekļūstiet laukiem pēc nosaukuma mezgla izvadē:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Lejupstraumes mezgli var izmantot `$agentLabel.status`, `$agentLabel.reason` utt. Tāda pati uzvedība kā [LLM mezgla](../nodes/llm-node.md) JSON izvadei.

## Cilvēka pārbaude (HITL)

Izmantojiet HITL, kad agentam var būt nepieciešams apstiprinājums noteiktos brīžos pirms svarīgām darbībām.

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Pievieno cilvēka pārbaudes kontrolpunktus agentam |
| `hitlSummary` | string | Apstiprināšanas vadlīnijas, kas norāda agentam, kad nepieciešama cilvēka pārbaude |

Kad HITL ir iespējots, agents saņem `request_human_review` rīku. Izmantojiet sistēmas prompt un
šo vadlīniju lauku, lai izskaidrotu, kuri rīku izsaukumi, apakšagenti, apakšworkflow, MCP darbības, prasmes
vai blakusefekti prasa apstiprinājumu. Agents var izsaukt šo rīku tikai tad, kad nepieciešams, tostarp vairākas
reizes vienā izpildē.

Pārbaudītājam redzamais kopsavilkums publiskajā lapā tiek ģenerēts no agenta pārbaudes pieprasījuma
izpildes laikā. Ja agents skaidri nenorāda kopsavilkumu, Heym to atvasina no Markdown
pārbaudes satura.

MCP rīkiem Heym lūdz modelim interpretēt Jūsu rakstītos HITL norādījumus kā vienu no trim
tvērumiem: `always`, `once` vai `never`. Tas nozīmē, ka brīvā formulējuma teksts, piemēram, "for each call", "only
one time" vai "never ask", tiek normalizēts pirms izpildes laika ierobežošanas piemērošanas.

Katrs HITL kontrolpunkts izveido vienreizēju publiskās pārbaudes saiti `/review/{token}`. Pārbaudītājs var:

- **Accept** sākotnējo Markdown pārbaudes tekstu
- **Edit & Continue** ar modificētu Markdown
- **Refuse** un turpināt ar `text: ""`

Kad HITL ir iespējots, mezgls arī atklāj `review` izvades rokturi uz kanvas. Savienojiet šo zaru ar Slack, e-pastu vai citiem paziņojumu mezgliem, ja vēlaties pārraidīt pārbaudes URL un kopsavilkumu, tiklīdz izpilde tiek apturēta.

Izpilde pāriet uz `pending`, līdz pārbaudītājs atbild. Pārbaudes teksts ir viens Markdown saturs, un gaidošais payload arī ietver koplietojama saites tekstu ārējai nodošanai. Mezgli `review` zarā darbojas nekavējoties, kad pauze tiek izveidota; parastais izvades ceļš turpinās tikai pēc apstiprinājuma. Pēc apstiprinājuma Heym atsāk no saglabātā izpildes momentuzņēmuma, un agents turpina ar apstiprināto kontekstu. Ja vēlākam solim arī nepieciešams apstiprinājums, agents var izveidot vēl vienu HITL kontrolpunktu. Skatiet [Human-in-the-Loop](../reference/human-in-the-loop.md) par payload formu, pārbaudes URL uzvedību un atsākšanas semantiku.

HITL ir pieejams tikai agenta teksta režīma izvadei. V1 versijā to nevar apvienot ar `jsonOutputEnabled`.
## Orķestrēšanas režīms

Kad tas ir iespējots, aģents var deleģēt uzdevumus citiem aģentu mezgliem workflow ietvaros. Ja **Orķestrēšanas režīms ir atspējots**, aģents **nevar izveidot aģenta→aģenta savienojumus** kanvā.

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Kad `true`, aģents iegūst `call_sub_agent` rīku |
| `subAgentLabels` | string[] | To aģentu mezglu apzīmējumi, kurus šis orķestrētājs var izsaukt |

**Apakšaģentiem** savā User Message ir jāizmanto `$input.text`, lai tie saņemtu orķestrētāja prompt.

Kad orķestrētājs vienā ciklā izsauc vairākus apakšaģentus, tie izpildās paralēli. Skatiet [Aģenta arhitektūra](../reference/agent-architecture.md), lai uzzinātu sīkāk.

## Apakšworkflow

Kad tas ir konfigurēts, aģents saņem `call_sub_workflow` rīku citu workflow izpildei.

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | To workflow ID, kurus šis aģents var izsaukt kā rīkus |

Izvēlieties workflow sadaļā Sub-Workflows aģenta konfigurācijā. Aģents tos izsauks ar `workflow_id` un `inputs` (objekts, kas atbilst mērķa workflow ievades laukiem). Maksimālais dziļums: 5 ligzdoti apakšworkflow izsaukumi.

## Kanvas mezglu rīki

Varat savienot atbalstītu workflow mezglu ar aģenta **tools** rokturi, lai aģents izpildes laikā varētu izsaukt šo mezglu. Tas pārvērš esošās kanvas darbības un transformācijas izsaucamos rīkos, nerakstot Python kodu.

Izmantojiet kanvas mezglu rīkus, kad vēlaties, lai aģents izlemtu, kad palaist konfigurētu mezglu, vienlaikus saglabājot akreditācijas datus, statiskos laukus un workflow specifiskos iestatījumus mezgla UI.

### Aģenta nodrošinātie lauki

Laukus savienotā rīka mezglā var atzīmēt ar bota ikonu. Atzīmētie lauki kļūst par obligātiem rīka parametriem, kas aģentam ir jānodrošina, izsaucot mezglu. Neatzīmētie lauki paliek fiksēti un tiek nolasīti no mezgla konfigurācijas.

Piemēram:

- Savienojiet Slack mezglu ar aģentu kā rīku
- Saglabājiet akreditācijas datus fiksētus Slack mezglā
- Atzīmējiet `message` kā aģenta nodrošinātu
- Aģents saņem Slack rīku, kurā tas izpildes laikā nodrošina tikai ziņojumu

Ja mezgls nav savienots ar aģentu kā rīks, bota ikona tiek paslēpta un mezgls darbojas kā parasts workflow solis.

### Izpildes laika darbība

Kad aģents izsauc kanvas mezgla rīku, Heym īslaicīgi apvieno aģenta nodrošinātos argumentus ar šī mezgla datiem, izpilda mezglu, atgriež mezgla izvadi aģentam un pēc tam atjauno sākotnējo mezgla konfigurāciju. Rīku mezgli nedarbojas kā parasti workflow soļi normālas plānošanas gaitā; tie darbojas tikai tad, kad aģents tos izsauc.

Kanvas mezglu rīki ir noderīgi ar integrācijas mezgliem, piemēram, Slack, Telegram, HTTP, Send Email, un datu formēšanas mezgliem, piemēram, [Set](./set-node.md). Trigger mezglus, vadības plūsmas mezglus un termināļa izvades kartētājus ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) nevar izmantot kā aģenta rīkus.

## Python rīki

Definējiet pielāgotus rīkus, kurus aģents var izsaukt. Katram rīkam ir:

| Lauks | Tips | Apraksts |
|-------|------|-------------|
| `name` | string | Rīka nosaukums (piem., `count_characters`) |
| `description` | string | Apraksts LLM |
| `parameters` | JSON Schema | OpenAI function-calling shēma (objekta formātā) |
| `code` | string | Python funkcijas kods |

**Parameters** ir jābūt JSON objektam, nevis virknei:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Rīka piemērs:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Python rīki pēc noklusējuma darbojas kā neuzticams kods sacietinātā, izolētā Docker konteinerā (nav tīkla, nav Docker socket, tikai lasāma failu sistēma, nav root). Importi ir ierobežoti ar drošu standarta bibliotēkas moduļu atļauto sarakstu. Skatiet [Drošība → Python rīku sandbox](../reference/security.md#python-tool-sandbox), lai uzzinātu par konfigurāciju (`HEYM_PYTHON_TOOL_SANDBOX`).

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Maksimālais sekunžu skaits uz rīka izpildi (noklusējums: 30) |
| `requestTimeoutSeconds` | number | Maksimālais sekunžu skaits, cik gaidīt katru modeļa atbildi pirms noildzes (noklusējums: 60). Palieliniet to lēniem vai pašmitinātiem pakalpojumu sniedzējiem (LiteLLM, vLLM, lokālie modeļi) un gariem daudzsoļu izpildes gadījumiem. |
## MCP savienojumi

Izveidojiet savienojumu ar [Model Context Protocol](https://modelcontextprotocol.io/) serveriem, lai nodrošinātu to rīku pieejamību aģentam.

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Savienojuma tips |
| `timeoutSeconds` | number | Šī savienojuma noildze (noklusējums: 30) |
| `label` | string | Neobligāts parādāmais nosaukums |

**stdio** (lokāls process):

| Lauks | Apraksts |
|-------|-------------|
| `command` | Palaidamā komanda (piem., `npx`) |
| `args` | JSON masīvs (piem., `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | JSON objekts ar vides mainīgajiem, kas tiek ievadīti procesā (piem., `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

Lielākā daļa stdio serveru ar API atslēgām autentificējas, izmantojot vides mainīgos, nevis komandas argumentus. Iestatiet `env` katram savienojumam atsevišķi, lai katrs aģenta mezgls varētu izmantot citus akreditācijas datus, neietekmējot resursdatora vidi.

`env` vērtības atbalsta [Expression DSL](../reference/expression-dsl.md), tāpēc varat nodot workflow ievades kā akreditācijas datus, nevis iekļaut noslēpumus tieši kodā:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Izteiksme `$userInput.pat` tiek atrisināta izpildes laikā pret workflow ievades datiem pirms MCP procesa palaišanas. Tas ļauj pieņemt token no trigger vai ievades mezgla, nevis iegult tos workflow definīcijā.

Piemērs — GitHub MCP ar iekļautu token:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Piemērs — GitHub MCP ar dinamisku token no workflow ievades:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Piemērs — GitHub MCP ar Heym GitHub akreditācijas datiem:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Iebūvētie GitHub akreditācijas dati pašlaik ir paredzēti PAT autentifikācijai. Ja nepieciešama piekļuve organizācijai, izmantojiet PAT ar nepieciešamajām organizācijas/repozitorija atļaujām.

Piemērs — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (attālināts serveris):

| Lauks | Apraksts |
|-------|-------------|
| `url` | SSE endpoint URL. Atbalsta izteiksmes (piem., `$userInput.serverUrl`). |
| `headers` | JSON objekts autentifikācijas/pielāgotiem headers. Vērtības atbalsta izteiksmes. |

**Streamable HTTP** (attālināts serveris):

| Lauks | Apraksts |
|-------|-------------|
| `url` | MCP endpoint URL (piem., `https://example.com/mcp`). Atbalsta izteiksmes. |
| `headers` | JSON objekts autentifikācijas/pielāgotiem headers. Vērtības atbalsta izteiksmes. |

## Skills

Skills ir SKILL.md instrukcijas kopā ar neobligātiem Python failiem un pievienotiem resursiem. Tie paplašina aģenta sistēmas kontekstu un var pievienot Python rīkus.

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `name` | string | Skill nosaukums |
| `content` | string | SKILL.md saturs (instrukcijas) |
| `timeoutSeconds` | number | Skill Python izpildes noildze (noklusējums: 30) |
| `driveFilesEnabled` | boolean | Iespējo izpildes laika `heym_drive` palīgrīku šim skill (noklusējums: false) |
| `files` | array | Neobligāti `{ path, content, encoding, mimeType }` ieraksti (piem., `.py` skripti vai binārie resursi, kas saglabāti kā base64) |

Skills var pievienot, nometot `.zip` vai `.md` failu uz Skills apgabala.
Pēc skill kartītes izvēršanas nometiet jebkuru failu uz šī skill, lai pievienotu vai aizstātu pievienoto failu, tostarp bināros resursus, piemēram, PDF un attēlus.
Izmantojiet lejupielādes pogu skill kartītē, lai eksportētu šo skill kā `.zip` arhīvu dublējumkopijai vai atkārtotai izmantošanai citā workflow.

Iespējojiet **Drive files** skill tikai tad, ja tā Python kodam ir nepieciešams lasīt failus no Heym Drive. Iespējotie skills izpildes laikā saņem ģenerētu `heym_drive.py` palīgrīku un var izsaukt `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` vai `read_drive_base64` ar Drive faila id vai precīzu faila nosaukumu. Faila nosaukuma meklēšana izmanto jaunāko pieejamo atbilstību. Neiespējotie skills nesaņem palīgrīku.

Katrai skill kartītei ir četras darbības rindā zem virsraksta:

| Poga | Apraksts |
|--------|-------------|
| **Edit with AI** | Atver Skill Builder, lai pārskatītu skill no chat prompt |
| **Download** | Eksportē skill kā `.zip` arhīvu |
| **Remove** | Dzēš skill no šī aģenta mezgla |
| **History** | Atver skill vēsturi, kas iegūta no [Edit History](../reference/edit-history.md) |
### Prasmju vēsture

Prasmju vēsture **netiek** glabāta atsevišķi. Tā tiek atvasināta no workflow Labošanas vēstures momentuzņēmumiem: katra saglabātā workflow versija ietver pilnu aģenta mezgla `skills` masīvu.

Dialoglodziņā Vēsture varat:

- **Priekšskatīt** iepriekšēju momentuzņēmumu (SKILL.md un failu saraksts)
- **Labot** — ielādēt momentuzņēmumu prasmju redaktorā, neatjaunojot visu workflow
- **AI precizēšana** — atvērt Skill Builder ar šo momentuzņēmumu kā sākumpunktu
- **Atjaunot** — atjaunot tikai šo prasmi no iepriekšējas versijas (pārējie mezgli paliek nemainīgi)

Vēsturei tiek piemērots tāds pats 7 dienu glabāšanas periods kā workflow Labošanas vēsturei. Saglabājot workflow pēc prasmju labojumiem, tiek izveidoti jauni vēstures ieraksti.

Sadaļā Prasmes ir pieejama arī **AI Build**:

- Noklikšķiniet uz **AI Build**, lai izveidotu jaunu prasmi no chat prompt
- Noklikšķiniet uz dzirksteles pogas esošai prasmei, lai to pārskatītu ar AI
- Ievelciet failus prompt composer, lai tos pievienotu precizēšanas komentāram; šie faili tiek arī saglabāti kā komplektētie prasmes resursi
- Modālais logs straumē asistenta tekstu, vienlaikus rādot reāllaika `SKILL.md` un `.py` failu priekšskatījumus
- **Lejupielādēt ZIP** eksportē pašreizējo priekšskatījumu, nepievienojot to mezglam
- **Saglabāt un pievienot** saglabā ģenerētos failus atpakaļ, izmantojot to pašu ZIP parsēšanas plūsmu, ko izmanto manuālai augšupielādei

Labojot ar AI, Heym uz builder sūta tikai teksta `.md` un `.py` prasmju failus. Binārie un citi nerediģējami pielikumi tiek saglabāti un koplietoti ar builder kā ceļa metadati, lai ģenerētais Python kods varētu saglabāt pareizas relatīvās failu atsauces.
Labajā panelī atlasiet pievienoto failu un iespējojiet **Include this file in AI context**, kad AI ir jāpārbauda komplektētā veidne. Teksta, PDF un DOCX faili, ja iespējams, tiek izgūti prompt kontekstā; Heym nepiemēro atsevišķu Skill Builder pielikuma izmēra ierobežojumu, kas pārsniegtu platformas pieprasījuma pamatteksta limitu.

## Papildu pamatteksts

Daži nodrošinātāji pieņem pieprasījuma parametrus, ko standarta OpenAI saderīgie lauki
nenosedz, piemēram, modeļa domāšanas režīma atspējošanu. Mezgla
rekvizītos atzīmējiet **Send extra request body** un ievadiet JSON objektu.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Pēc noklusējuma atspējots.** Ja izvēles rūtiņa nav atzīmēta, nekas papildu netiek sūtīts.
- Tiek piemērots **katram** pieprasījumam rīku izsaukšanas cilpā, ne tikai pirmajai kārtai, kā arī
  rezerves modeļa mēģinājumam. Netiek piemērots guardrail pārbaudēm, kas izmanto atsevišķu modeli.
- Jābūt JSON **objektam**. Masīvs, skalārs vai nepareizi formatēts teksts liek mezglam neizdoties ar
  `Invalid extra body JSON`, nevis tiek klusi ignorēts.
- `$` izteiksmes tiek atrisinātas pirms parsēšanas. Tā kā šī ir teksta aizstāšana, atrisināta
  vērtība, kas satur pēdiņas vai jaunu rindu, rada nederīgu JSON un liek mezglam neizdoties.

Tas pats lauks un uzvedība kā [LLM mezgla](./llm-node.md) papildu pamattekstam.

## Guardrails

Mezgla rekvizītos iespējojiet **Guardrails**, lai bloķētu nedrošus lietotāja ziņojumus pirms aģenta palaišanas. Pilnu uzziņu skatiet [Guardrails](../reference/guardrails.md).

## Pastāvīgā atmiņa (grafs)

Neobligāts **katram aģenta mezglam** zināšanu grafs, kas glabājas datubāzē. Kad tas ir iespējots, Heym pirms katras palaišanas **sistēmas instrukcijai** pievieno atcerēto entītiju un attiecību Markdown kopsavilkumu (tikai tad, ja grafs nav tukšs). Pēc **veiksmīgas** aģenta pabeigšanas fona uzdevums izgūst jaunus noturīgus faktus no sarunas un sapludina tos grafā.

| Parametrs | Tips | Apraksts |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Iespējot ielādi + fona izguvi šim kanvas mezglam |

**Apakšaģenti** saglabā **savu** grafu (pēc to mezgla id), atsevišķi no orķestratora.

Izmantojiet rozā **smadzeņu** vadīklu uz mezgla (kad atmiņa ir ieslēgta vai tiek rādīta modeļa rinda), lai atvērtu grafa redaktoru un neobligātu **atmiņas koplietošanu** (citi workflow/aģenti). Pilna uzvedība, REST ceļi un JSON eksporta informācija: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API un spriešanas nepārtrauktība

Izvēles rūtiņa **Use Responses API** novirza aģenta modeļa izsaukumus caur
[Responses API](https://platform.openai.com/docs/api-reference/responses), nevis Chat
Completions. Tā pēc noklusējuma ir izslēgta.

Tā ir vissvarīgākā uz spriešanas modeļa, piemēram, `gpt-5` vai `o` sērijas. Responses API atgriež
modeļa spriešanu līdzās katram rīka izsaukumam, un aģents šos spriešanas vienumus padod atpakaļ
nākamajā kārtā, tāpēc modelis saglabā savu domu ķēdi vairāku soļu rīku cilpā, nevis to no jauna
atvasina pēc katra rīka rezultāta. Visa cilpa darbojas vienā ceļā, ieskaitot
[cilvēka pārskatīšanas](#human-review-hitl) pauzi un atsākšanu, [konteksta saspiešanu](#context-compression)
un galīgo atbildi.

Pati saruna paliek Heym. Heym katrā kārtā sūta pilnu ievadi un pārvadā
spriešanu kā šifrētu blob, tāpēc nodrošinātāja pusē starp izsaukumiem nekas netiek saglabāts.
Spriešanas vienumi posmā, ko konteksta saspiešana apkopo, tiek atmesti kopā ar to, jo
šifrētu blob nevar apkopot.

Tā darbojas ar OpenAI akreditācijas datiem un ar pielāgotiem akreditācijas datiem, kuru gateway atbalsta
endpoint. Ar Google akreditācijas datiem tā paliek atspējota.
## Konteksta saspiešana

Kad aģents veic daudzas rīku iterācijas ar lieliem rezultātiem (tīmekļa skrāpēšana, dokumentu lasīšana, apakšdarbplūsmu izvades), uzkrātā ziņojumu vēsture var pietuvoties modeļa konteksta loga ierobežojumam. Heym automātiski saspiež sarunas vēsturi izpildes laikā, lai novērstu konteksta pārpildīšanu.

**Kā tas darbojas:**

1. Pirms katras rīku iterācijas Heym novērtē pašreizējo tokenu skaitu (~4 rakstzīmes uz vienu tokenu).
2. Ja novērtējums pārsniedz **80%** no modeļa konteksta loga, tiek aktivizēta saspiešana.
3. Ziņojumu vēsture tiek sadalīta saglabātajās un saspiestajās daļās:
   - **Saglabātās**: sistēmas prompt, pirmais lietotāja ziņojums, jaunākais lietotāja ziņojums
   - **Saspiestās**: viss starp tām (asistenta argumentācijas gājieni, rīku izsaukumi, rīku rezultāti)
4. Vidējā daļa tiek apkopota, izmantojot **to pašu modeli un akreditācijas datus** — papildu konfigurācija nav nepieciešama.
5. Saspiestais kopsavilkums aizstāj vidējo daļu kā viens asistenta ziņojums.

**Novērojamība:**

Saspiešanas notikumi parādās kā `Context compressed (N messages → summary)` ieraksti:
- **Debug panel** rīku izsaukumu sarakstā tiešsaistes izpildes laikā
- **Izpildes vēstures** izpildes detaļu skatā
- **Traces cilnē** kā `context.compression` trace ieraksts

Saspiešana ir automātiska un vienmēr aktīva Agent node. Tā **neattiecas** uz LLM node, Chat cilni vai AI Assistant sesijām.

## Saistītie resursi

- [Kāpēc Heym](../getting-started/why-heym.md) – Kā aģenti darbojas un tiek pārvaldīti produkcijā
- [Aģenta pastāvīgā atmiņa](../reference/agent-persistent-memory.md) – Zināšanu grafs katram aģenta node, neobligāta koplietošana, API, redaktors
- [Aģenta arhitektūra](../reference/agent-architecture.md) – Apakšaģenti, orķestrators, prasmes, MCP, rīku izsaukšana
- [Cilvēks ciklā](../reference/human-in-the-loop.md) – Publiskas pārskatīšanas lapas, gaidošas izpildes, apstiprināšanas/rediģēšanas/noraidīšanas plūsma
- [Guardrails](../reference/guardrails.md) – Bloķēt nedrošu satura kategorijas
- [Node tipi](../reference/node-types.md) – Visu node tipu pārskats
- [AI Assistant](../reference/ai-assistant.md) – Chat UI darbplūsmu veidošanai ar dabisko valodu (atšķiras no Agent node)
- [Izteiksmju DSL](../reference/expression-dsl.md) – Datu atsaukšana promptos
- [Darbplūsmas struktūra](../reference/workflow-structure.md) – Node, šķautnes un DSL formāts
- [Ātrā sākšana](../getting-started/quick-start.md) – Pamata darbplūsma ar LLM un izteiksmēm
- [Akreditācijas datu cilne](../tabs/credentials-tab.md) – API atslēgu pievienošana aģentam
- [MCP cilne](../tabs/mcp-tab.md) – MCP konfigurēšana darbplūsmas rīkiem
