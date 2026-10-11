# Vozlišče Agenta

Vozlišče **AI Agent** je LLM vozlišče z možnostjo klicanja orodij. Izvaja lahko Python orodja, kliče povezana platnena vozlišča kot orodja, se povezuje na MCP strežnike, uporablja spretnosti, po želji deluje kot orkestrator, ki delegira na druga vozlišča agentov, kliče druge workflowe kot orodja in se ustavi za [človeški pregled](../reference/human-in-the-loop.md).

## Pregled

| Lastnost | Vrednost |
|----------|-------|
| Vhodi | 1 |
| Izhodi | 1, poleg tega neobvezni `review`, kadar je omogočen HITL |
| Izhod | `$nodeLabel.text`, `$nodeLabel.fieldName` (kadar je omogočen JSON izhod) ali čakajoči HITL payload med čakanjem na pregled |

## Osrednji parametri

### Poverilnice in model

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `credentialId` | UUID | LLM poverilnica (API ključ) iz Nastavitev |
| `model` | string | Ime modela (npr. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (neobvezno) | Nadomestna poverilnica, kadar primarna odpove |
| `fallbackModel` | string (neobvezno) | Nadomestni model, kadar primarni odpove |

Poverilnice dodajte v zavihku [Poverilnice](../tabs/credentials-tab.md). Seznam modelov se naloži iz izbrane poverilnice. Če primarna poverilnica ali model vrne napako, vozlišče samodejno poskusi znova z nadomestno poverilnico in modelom, preden odpove.

### Prompts

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `systemInstruction` | string | Sistemski prompt za AI. Podpira [izraze](../reference/expression-dsl.md). |
| `userMessage` | string | Uporabniško sporočilo/prompt. Privzeto: `$input.text` |
| `jsonOutputEnabled` | boolean | Strukturiran JSON izhod |
| `jsonOutputSchema` | string | JSON Schema za strukturiran izhod |
| `extraBodyEnabled` | boolean | Pošlji parametre zahtevka, specifične za ponudnika (privzeto: `false`) |
| `extraBody` | string | Objekt JSON, združen v vsako API zahtevo, ki jo agent izvede |

Uporabite `$input.text`, `$nodeName.field` in drugo sintakso [Expression DSL](../reference/expression-dsl.md).

### Modeli za sklepanje (o1, o3)

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `temperature` | number | 0,0–2,0 (privzeto: 0,7), za standardne modele |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Globina sklepanja za modele za sklepanje |

Pri uporabi modela za sklepanje (npr. o1, o3) uporabniški vmesnik prikaže **Reasoning Effort** namesto Temperature. Pri standardnih modelih **Temperature** nadzoruje ustvarjalnost.

**Primer JSON izhoda:** Kadar potrebujete strukturirane podatke od agenta (npr. klasifikacijo, izluščanje), omogočite JSON izhod in priskrbite shemo. Agent vrne JSON, ki ustreza shemi; do polj dostopate po imenu na izhodu vozlišča:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Nadaljnja vozlišča lahko uporabijo `$agentLabel.status`, `$agentLabel.reason` itd. Enako vedenje kot JSON izhod [vozlišča LLM](../nodes/llm-node.md).

## Človeški pregled (HITL)

HITL uporabite, kadar agent morda potrebuje odobritev v določenih trenutkih pred pomembnimi dejanji.

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Agentu doda kontrolne točke za človeški pregled |
| `hitlSummary` | string | Smernice za odobritev, ki agentu povedo, kdaj je potreben človeški pregled |

Kadar je HITL omogočen, agent prejme orodje `request_human_review`. S sistemskim promptom in
tem poljem smernic pojasnite, kateri klici orodij, podagenti, podworkflowi, MCP dejanja, spretnosti
ali stranski učinki zahtevajo odobritev. Agent lahko to orodje pokliče le, kadar je potrebno, tudi večkrat
v enem izvajanju.

Povzetek, namenjen pregledovalcu, na javni strani se ustvari iz agentove zahteve za pregled
med izvajanjem. Če agent povzetka ne poda izrecno, ga Heym izpelje iz Markdown
telesa pregleda.

Pri MCP orodjih Heym od modela zahteva, da vaša pisna HITL navodila interpretira kot enega od treh
obsegov: `always`, `once` ali `never`. To pomeni, da se prosto oblikovano besedilo, kot je "za vsak klic", "samo
enkrat" ali "nikoli ne vprašaj", normalizira, preden se uporabi omejevanje med izvajanjem.

Vsaka HITL kontrolna točka ustvari enkratno javno povezavo za pregled na `/review/{token}`. Pregledovalec lahko:

- **Accept** izvirno Markdown besedilo pregleda
- **Edit & Continue** z spremenjenim Markdown
- **Refuse** in nadaljuje s `text: ""`

Kadar je HITL omogočen, vozlišče na platnu izpostavi tudi izhodni ročaj `review`. To vejo povežite s Slack, e-pošto ali drugimi vozlišči za obveščanje, če želite razširjati URL pregleda in povzetek takoj, ko se izvajanje ustavi.

Izvajanje preide v stanje `pending`, dokler se pregledovalec ne odzove. Besedilo pregleda je eno samo Markdown telo, čakajoči payload pa vključuje tudi besedilo povezave za deljenje za zunanjo predajo. Vozlišča na veji `review` se zaženejo takoj, ko je ustavitvena točka ustvarjena; običajna izhodna pot se nadaljuje šele po odobritvi. Po odobritvi Heym nadaljuje iz shranjene slike izvajanja in agent nadaljuje z odobrenim kontekstom. Če tudi kasnejši korak potrebuje odobritev, lahko agent ustvari novo HITL kontrolno točko. Glejte [Human-in-the-Loop](../reference/human-in-the-loop.md) za obliko payloada, vedenje URL-ja pregleda in semantiko nadaljevanja.

HITL je na voljo samo za izhod agenta v besedilnem načinu. V v1 ga ni mogoče kombinirati z `jsonOutputEnabled`.
## Način orkestratorja

Ko je omogočen, lahko agent dodeljuje naloge drugim agent vozliščem v workflowu. Če je **način orkestratorja onemogočen**, agent **ne more ustvarjati povezav agent→agent** na platnu.

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Ko je `true`, agent prejme orodje `call_sub_agent` |
| `subAgentLabels` | string[] | Oznake agent vozlišč, ki jih ta orkestrator lahko pokliče |

**Podagenti** morajo v svojem User Message uporabiti `$input.text`, da prejmejo prompt orkestratorja.

Ko orkestrator pokliče več podagentov v enem obratu, se ti izvedejo vzporedno. Za podrobnosti glejte [Agent Architecture](../reference/agent-architecture.md).

## Pod-workflowi

Ko je konfigurirano, agent prejme orodje `call_sub_workflow` za izvajanje drugih workflowov.

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | ID-ji workflowov, ki jih ta agent lahko pokliče kot orodja |

Workflowe izberite v razdelku Sub-Workflows v konfiguraciji agenta. Agent jih bo poklical z `workflow_id` in `inputs` (objekt, ki ustreza vhodnim poljem ciljnega workflowa). Največja globina: 5 ugnezdenih klicev pod-workflowov.

## Orodja vozlišč na platnu

Podprto workflow vozlišče lahko povežete z ročajem **tools** agenta, da lahko agent to vozlišče pokliče med izvajanjem. To spremeni obstoječa dejanja in transformacije na platnu v klicljiva orodja brez pisanja Pythona.

Orodja vozlišč na platnu uporabite, ko želite, da se agent odloči, kdaj bo zagnal konfigurirano vozlišče, hkrati pa ohranite poverilnice, statična polja in nastavitve, specifične za workflow, v UI vozlišča.

### Polja, ki jih zagotovi agent

Polja na povezanem orodnem vozlišču lahko označite z ikono bota. Označena polja postanejo obvezni parametri orodja, ki jih mora agent zagotoviti, ko pokliče vozlišče. Neoznačena polja ostanejo nespremenjena in se berejo iz konfiguracije vozlišča.

Na primer:

- Povežite Slack vozlišče z agentom kot orodje
- Poverilnico ohranite nespremenjeno v Slack vozlišču
- Označite `message` kot polje, ki ga zagotovi agent
- Agent prejme Slack orodje, kjer med izvajanjem zagotovi samo sporočilo

Če vozlišče ni povezano z agentom kot orodje, je ikona bota skrita in vozlišče se obnaša kot običajen korak workflowa.

### Vedenje med izvajanjem

Ko agent pokliče orodje vozlišča na platnu, Heym začasno združi argumente, ki jih zagotovi agent, v podatke tega vozlišča, izvede vozlišče, vrne izhod vozlišča agentu in nato obnovi prvotno konfiguracijo vozlišča. Orodna vozlišča se ne izvajajo kot običajni koraki workflowa prek običajnega razporejanja; izvedejo se le, ko jih agent pokliče.

Orodja vozlišč na platnu so uporabna z integracijskimi vozlišči, kot so Slack, Telegram, HTTP, Send Email, in vozlišči za oblikovanje podatkov, kot je [Set](./set-node.md). Trigger vozlišč, vozlišč za nadzor pretoka in zaključnih preslikovalnikov izhoda ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) ni mogoče uporabiti kot orodja agenta.

## Python orodja

Določite orodja po meri, ki jih agent lahko pokliče. Vsako orodje ima:

| Polje | Tip | Opis |
|-------|------|-------------|
| `name` | string | Ime orodja (npr. `count_characters`) |
| `description` | string | Opis za LLM |
| `parameters` | JSON Schema | Shema za klic funkcij OpenAI (format objekta) |
| `code` | string | Koda funkcije Python |

**Parameters** mora biti objekt JSON, ne niz:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Primer orodja:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Python orodja se privzeto izvajajo kot nezaupanja vredna koda v utrjenem, izoliranem Docker vsebniku (brez omrežja, brez Docker socketa, samo za branje datotečnega sistema, brez skrbniških pravic). Uvozi so omejeni na seznam dovoljenih varnih modulov standardne knjižnice. Za konfiguracijo (`HEYM_PYTHON_TOOL_SANDBOX`) glejte [Security → Python Tool Sandbox](../reference/security.md#python-tool-sandbox).

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Največje število sekund na izvajanje orodja (privzeto: 30) |
| `requestTimeoutSeconds` | number | Največje število sekund čakanja na vsak odgovor modela pred potekom časa (privzeto: 60). Povečajte za počasne ali samostojno gostovane ponudnike (LiteLLM, vLLM, lokalni modeli) in dolge večstopenjske izvedbe. |
## MCP Connections

Povežite se z strežniki [Model Context Protocol](https://modelcontextprotocol.io/), da njihova orodja izpostavite agentu.

| Parameter | Type | Description |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Vrsta povezave |
| `timeoutSeconds` | number | Časovna omejitev za to povezavo (privzeto: 30) |
| `label` | string | Neobvezno prikazno ime |

**stdio** (lokalni proces):

| Field | Description |
|-------|-------------|
| `command` | Ukaz za zagon (npr. `npx`) |
| `args` | JSON array (npr. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | JSON object okoljskih spremenljivk, ki se vbrizgajo v proces (npr. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

Večina stdio strežnikov, ki uporabljajo API-ključe, se overja prek okoljskih spremenljivk in ne prek argumentov ukaza. Nastavite `env` za vsako povezavo posebej, tako da lahko vsako vozlišče agenta uporabi drugačno poverilnico, ne da bi pri tem posegali v okolje gostitelja.

Vrednosti `env` podpirajo [Expression DSL](../reference/expression-dsl.md), zato lahko poverilnice posredujete kot vhode workflowa, namesto da bi skrivnosti vnašali neposredno v kodo:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Izraz `$userInput.pat` se ob izvajanju razreši glede na vhodne podatke workflowa, preden se MCP proces zažene. Tako lahko sprejmete tokene iz triggerja ali vhodnega vozlišča, namesto da bi jih vgradili v definicijo workflowa.

Primer — GitHub MCP z neposredno vnesenim tokenom:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Primer — GitHub MCP z dinamičnim tokenom iz vhoda workflowa:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Primer — GitHub MCP s poverilnico Heym GitHub:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Vgrajena poverilnica GitHub trenutno podpira overjanje na osnovi PAT. Če potrebujete dostop do organizacije, uporabite PAT z zahtevanimi dovoljenji za organizacijo/repozitorij.

Primer — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (oddaljeni strežnik):

| Field | Description |
|-------|-------------|
| `url` | URL endpointa SSE. Podpira izraze (npr. `$userInput.serverUrl`). |
| `headers` | JSON object za overjanje/glave po meri. Vrednosti podpirajo izraze. |

**Streamable HTTP** (oddaljeni strežnik):

| Field | Description |
|-------|-------------|
| `url` | URL endpointa MCP (npr. `https://example.com/mcp`). Podpira izraze. |
| `headers` | JSON object za overjanje/glave po meri. Vrednosti podpirajo izraze. |

## Skills

Skills so navodila SKILL.md skupaj z neobveznimi datotekami Python in priloženimi sredstvi. Razširjajo sistemski kontekst agenta in lahko dodajo orodja Python.

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | Ime skill |
| `content` | string | Vsebina SKILL.md (navodila) |
| `timeoutSeconds` | number | Časovna omejitev za izvajanje Python v skill (privzeto: 30) |
| `driveFilesEnabled` | boolean | Omogoči pomočnika `heym_drive` ob izvajanju za ta skill (privzeto: false) |
| `files` | array | Neobvezni vnosi `{ path, content, encoding, mimeType }` (npr. skripte `.py` ali binarna sredstva, shranjena kot base64) |

Skills lahko dodate tako, da spustite datoteko `.zip` ali `.md` na območje Skills.
Ko razširite kartico skill, spustite poljubno datoteko na ta skill, da priložite ali zamenjate priloženo datoteko, vključno z binarnimi sredstvi, kot so PDF-ji in slike.
Uporabite gumb za prenos na kartici skill, da ta skill izvozite kot arhiv `.zip` za varnostno kopijo ali ponovno uporabo v drugem workflowu.

Omogočite **Drive files** pri skill samo, kadar njegova koda Python potrebuje branje datotek iz Heym Drive. Omogočeni skills ob izvajanju prejmejo ustvarjenega pomočnika `heym_drive.py` in lahko kličejo `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` ali `read_drive_base64` z ID-jem datoteke Drive ali natančnim imenom datoteke. Iskanje po imenu datoteke uporabi najnovejše dostopno ujemanje. Onemogočeni skills pomočnika ne prejmejo.

Vsaka kartica skill ima štiri dejanja v vrstici pod naslovom:

| Button | Description |
|--------|-------------|
| **Edit with AI** | Odpre Skill Builder za popravljanje skill iz chat prompta |
| **Download** | Izvozi skill kot arhiv `.zip` |
| **Remove** | Izbriše skill iz tega vozlišča agenta |
| **History** | Odpre zgodovino skill, izpeljano iz [Edit History](../reference/edit-history.md) |
### Zgodovina spretnosti

Zgodovina spretnosti se **ne** shranjuje ločeno. Izpeljana je iz posnetkov Zgodovine urejanja workflowa: vsaka shranjena različica workflowa vključuje celoten `skills` array agentovega vozlišča.

V pogovornem oknu Zgodovina lahko:

- **Predogled** preteklega posnetka (SKILL.md in seznam datotek)
- **Uredi** — naložite posnetek v urejevalnik spretnosti, ne da bi povrnili celoten workflow
- **AI Fine-tune** — odprete Skill Builder s tem posnetkom kot izhodiščem
- **Povrni** — povrnete samo to spretnost iz pretekle različice (druga vozlišča ostanejo nespremenjena)

Zgodovina sledi enaki 7-dnevni hrambi kot Zgodovina urejanja workflowa. Shranjevanje workflowa po urejanju spretnosti ustvari nove vnose v zgodovini.

Razdelek Spretnosti vključuje tudi **AI Build**:

- Kliknite **AI Build**, da ustvarite novo spretnost iz chat prompta
- Kliknite gumb iskrice na obstoječi spretnosti, da jo izboljšate z AI
- Spustite datoteke v sestavljalnik prompta, da jih priložite komentarju za fino nastavitev; te datoteke se shranijo tudi kot priložena sredstva spretnosti
- Modalno okno pretaka besedilo pomočnika, medtem ko prikazuje predoglede datotek `SKILL.md` in `.py` v živo
- **Download ZIP** izvozi trenutni predogled, ne da bi ga dodal v vozlišče
- **Save & Add** shrani ustvarjene datoteke nazaj skozi enak postopek razčlenjevanja ZIP, kot se uporablja pri ročnih nalaganjih

Pri urejanju z AI Heym pošlje graditelju samo besedilne datoteke spretnosti `.md` in `.py`. Binarne in druge neurejljive priloge se ohranijo in delijo z graditeljem kot metapodatki poti, tako da lahko ustvarjena koda Python ohrani pravilne relativne sklice na datoteke.
Izberite priloženo datoteko na desni plošči in omogočite **Include this file in AI context**, ko mora AI pregledati priloženo predlogo. Datoteke Text, PDF in DOCX se, kadar je mogoče, izluščijo v kontekst prompta; Heym ne uveljavlja ločene omejitve velikosti prilog Skill Builderja prek omejitve telesa zahteve platforme.

## Extra Body

Nekateri ponudniki sprejemajo parametre zahteve, ki jih standardna polja, združljiva z OpenAI, ne
pokrivajo, na primer onemogočanje načina razmišljanja modela. Označite **Send extra request body** v
lastnostih vozlišča in vnesite objekt JSON.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Privzeto onemogočeno.** Ko je potrditveno polje izklopljeno, se nič dodatnega ne pošlje.
- Uporabljeno za **vsako** zahtevo v zanki klicev orodij, ne le za prvi krog, poleg
  poskusa nadomestnega modela. Ni uporabljeno za preverjanja guardrails, ki uporabljajo ločen model.
- Mora biti **objekt** JSON. Array, skalar ali nepravilno oblikovano besedilo povzroči napako vozlišča z
  `Invalid extra body JSON`, namesto da bi bilo tiho izpuščeno.
- Izrazi `$` se razrešijo pred razčlenjevanjem. Ker gre za besedilno zamenjavo, razrešena
  vrednost, ki vsebuje dvojni narekovaj ali novo vrstico, ustvari neveljaven JSON in povzroči napako vozlišča.

Enako polje in vedenje kot pri extra body [vozlišča LLM](./llm-node.md).

## Guardrails

Omogočite **Guardrails** v lastnostih vozlišča, da blokirate nevarne uporabniške sporočila, preden se agent zažene. Glejte [Guardrails](../reference/guardrails.md) za celotno referenco.

## Trajni spomin (graf)

Neobvezni **per-agent-node** graf znanja, shranjen v podatkovni bazi. Ko je omogočen, Heym pred vsakim zagonom doda povzetek Markdown zapomnjenih entitet in razmerij k **sistemskim navodilom** (samo če graf ni prazen). Po **uspešnem** zaključku agenta opravilo v ozadju izlušči nova trajna dejstva iz pogovora in jih združi v graf.

| Parameter | Tip | Opis |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Omogoči nalaganje + izluščanje v ozadju za to vozlišče platna |

**Podagenti** ohranijo **svoj** graf (ključen po id-ju njihovega vozlišča), ločen od orkestratorja.

Uporabite rožnati kontrolnik **brain** na vozlišču (ko je spomin vklopljen ali je vrstica modela prikazana), da odprete urejevalnik grafa in neobvezno **deljenje spomina** (drugi workflowi/agenti). Celotno vedenje, poti REST in podrobnosti izvoza JSON: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API in kontinuiteta razmišljanja

Potrditveno polje **Use Responses API** usmeri klice modela agenta skozi
[Responses API](https://platform.openai.com/docs/api-reference/responses) namesto Chat
Completions. Privzeto je izklopljeno.

Najbolj je pomembno pri modelu razmišljanja, kot je `gpt-5` ali serija `o`. Responses API vrne
razmišljanje modela ob vsakem klicu orodja, agent pa te elemente razmišljanja posreduje nazaj v
naslednjem krogu, tako da model ohrani svojo verigo misli skozi večkoračno zanko orodij, namesto da
bi jo znova izpeljal po vsakem rezultatu orodja. Celotna zanka teče po isti poti, vključno s
[človeškim pregledom](#human-review-hitl) za pavzo in nadaljevanje, [stiskanjem konteksta](#context-compression)
in končnim odgovorom.

Pogovor sam ostane v Heymu. Heym pošlje celoten vnos ob vsakem krogu in prenaša
razmišljanje kot šifriran blob, tako da se na strani ponudnika med klici ne zadrži nič.
Elementi razmišljanja znotraj razpona, ki ga stiskanje konteksta povzame, se izpustijo skupaj z njim, saj
šifriranega bloba ni mogoče povzeti.

Deluje s poverilnico OpenAI in s poverilnico po meri, katere prehod podpira
endpoint. S poverilnico Google ostane onemogočeno.
## Stiskanje konteksta

Ko agent izvede veliko iteracij orodij z obsežnimi rezultati (praskanje spleta, branje dokumentov, izhodi pod-workflowov), se nakopičena zgodovina sporočil lahko približa omejitvi kontekstnega okna modela. Heym samodejno stisne zgodovino pogovora med izvajanjem, da prepreči prekoračitev konteksta.

**Kako deluje:**

1. Pred vsako iteracijo orodja Heym oceni trenutno število žetonov (~4 znaki na žeton).
2. Če ocena preseže **80 %** kontekstnega okna modela, se sproži stiskanje.
3. Zgodovina sporočil se razdeli na ohranjene in stisnjene dele:
   - **Ohranjeno**: sistemski prompt, prvo uporabniško sporočilo, najnovejše uporabniško sporočilo
   - **Stisnjeno**: vse vmes (krogi sklepanja asistenta, klici orodij, rezultati orodij)
4. Vmesni del se povzame z uporabo **istega modela in poverilnice** — dodatna konfiguracija ni potrebna.
5. Stisnjen povzetek nadomesti vmesni del kot eno samo sporočilo asistenta.

**Opazljivost:**

Dogodki stiskanja se prikažejo kot vnosi `Context compressed (N messages → summary)` v:
- Seznamu klicev orodij v **plošči za odpravljanje napak** med izvajanjem v živo
- Pogledu podrobnosti izvajanja v **zgodovini izvajanj**
- Zavihku **Traces** kot vnos sledi `context.compression`

Stiskanje je samodejno in vedno aktivno za vozlišča Agent. Ne velja za vozlišča LLM, zavihka Chat ali seje AI Assistant.

## Povezane vsebine

- [Why Heym](../getting-started/why-heym.md) – Kako agenti delujejo in ostajajo nadzorovani v produkciji
- [Agent Persistent Memory](../reference/agent-persistent-memory.md) – Graf znanja na vozlišče agenta, neobvezno deljenje, API, urejevalnik
- [Agent Architecture](../reference/agent-architecture.md) – Pod-agenti, orkestrator, veščine, MCP, klicanje orodij
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Javne strani za pregled, čakajoča izvajanja, potek odobritve/urejanja/zavrnitve
- [Guardrails](../reference/guardrails.md) – Blokiranje nevarnih kategorij vsebine
- [Node Types](../reference/node-types.md) – Pregled vseh vrst vozlišč
- [AI Assistant](../reference/ai-assistant.md) – Chat UI za gradnjo workflowov z naravnim jezikom (razlikuje se od vozlišča Agent)
- [Expression DSL](../reference/expression-dsl.md) – Sklicevanje na podatke v promptih
- [Workflow Structure](../reference/workflow-structure.md) – Vozlišča, povezave in format DSL
- [Quick Start](../getting-started/quick-start.md) – Osnovni workflow z LLM in izrazi
- [Credentials Tab](../tabs/credentials-tab.md) – Dodajanje API ključev za agenta
- [MCP Tab](../tabs/mcp-tab.md) – Konfiguracija MCP za orodja workflowa
