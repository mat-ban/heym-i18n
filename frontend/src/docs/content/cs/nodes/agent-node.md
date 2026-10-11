# Uzel Agenta

Uzel **AI Agent** je LLM uzel s voláním nástrojů. Dokáže spouštět Python nástroje, volat připojené uzly canvasu jako nástroje, připojovat se k MCP serverům, používat dovednosti, volitelně fungovat jako orchestrátor, který deleguje úlohy na další uzly agentů, volat další workflow jako nástroje a pozastavit se pro [lidskou kontrolu](../reference/human-in-the-loop.md).

## Přehled

| Vlastnost | Hodnota |
|----------|-------|
| Vstupy | 1 |
| Výstupy | 1, plus volitelný `review`, když je povoleno HITL |
| Výstup | `$nodeLabel.text`, `$nodeLabel.fieldName` (když je povolen JSON výstup), nebo čekající HITL payload během čekání na kontrolu |

## Základní parametry

### Přihlašovací údaje a model

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `credentialId` | UUID | Přihlašovací údaje LLM (API klíč) z Nastavení |
| `model` | string | Název modelu (např. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (volitelné) | Záložní přihlašovací údaje pro případ selhání primárních |
| `fallbackModel` | string (volitelné) | Záložní model pro případ selhání primárního |

Přihlašovací údaje přidejte na kartě [Přihlašovací údaje](../tabs/credentials-tab.md). Seznam modelů se načítá z vybraných přihlašovacích údajů. Pokud primární přihlašovací údaje nebo model vrátí chybu, uzel automaticky zopakuje pokus se záložními přihlašovacími údaji a modelem, než selže.

### Prompty

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `systemInstruction` | string | Systémový prompt pro AI. Podporuje [výrazy](../reference/expression-dsl.md). |
| `userMessage` | string | Uživatelská zpráva/prompt. Výchozí: `$input.text` |
| `jsonOutputEnabled` | boolean | Strukturovaný JSON výstup |
| `jsonOutputSchema` | string | JSON Schema pro strukturovaný výstup |
| `extraBodyEnabled` | boolean | Odesílat parametry požadavku specifické pro poskytovatele (výchozí: `false`) |
| `extraBody` | string | JSON objekt sloučený do každého API požadavku, který agent provede |

Používejte `$input.text`, `$nodeName.field` a další syntaxi [Expression DSL](../reference/expression-dsl.md).

### Reasoning modely (o1, o3)

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (výchozí: 0.7), pro standardní modely |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Hloubka uvažování pro reasoning modely |

Při použití reasoning modelu (např. o1, o3) zobrazuje UI místo Temperature položku **Reasoning Effort**. U standardních modelů ovládá **Temperature** kreativitu.

**Příklad JSON výstupu:** Když potřebujete od agenta strukturovaná data (např. klasifikaci, extrakci), povolte JSON výstup a poskytněte schéma. Agent vrátí JSON odpovídající schématu; k polím přistupujte podle názvu na výstupu uzlu:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Následné uzly mohou používat `$agentLabel.status`, `$agentLabel.reason` atd. Stejné chování jako JSON výstup u [uzlu LLM](../nodes/llm-node.md).

## Lidská kontrola (HITL)

HITL použijte, když agent může potřebovat schválení v konkrétních okamžicích před důležitými akcemi.

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Přidá do agenta kontrolní body pro lidskou kontrolu |
| `hitlSummary` | string | Pokyny pro schválení, které agentovi říkají, kdy je potřeba lidská kontrola |

Když je HITL povoleno, agent obdrží nástroj `request_human_review`. Pomocí systémového promptu a tohoto pole s pokyny vysvětlete, které volání nástrojů, sub-agenti, sub-workflow, MCP akce, dovednosti nebo vedlejší efekty vyžadují schválení. Agent může tento nástroj zavolat pouze v případě potřeby, a to i vícekrát během jednoho spuštění.

Souhrn pro kontrolora na veřejné stránce se generuje z požadavku agenta na kontrolu za běhu. Pokud agent souhrn výslovně neposkytne, Heym jej odvodí z Markdown těla kontroly.

U MCP nástrojů Heym žádá model, aby interpretoval Vaše písemné HITL pokyny jako jeden ze tří rozsahů: `always`, `once` nebo `never`. To znamená, že volné formulace jako „pro každé volání", „pouze jednou" nebo „nikdy se neptej" jsou normalizovány před tím, než je aplikováno běhové řízení.

Každý HITL kontrolní bod vytváří jednorázový veřejný odkaz na kontrolu na `/review/{token}`. Kontrolor může:

- **Přijmout** původní Markdown text kontroly
- **Upravit a pokračovat** s upraveným Markdownem
- **Odmítnout** a pokračovat s `text: ""`

Když je HITL povoleno, uzel také vystavuje výstupní handle `review` na canvasu. Připojte tuto větev k Slacku, e-mailu nebo jiným oznamovacím uzlům, pokud chcete vysílat URL kontroly a souhrn ihned, jakmile se spuštění pozastaví.

Spuštění přejde do stavu `pending`, dokud kontrolor neodpoví. Text kontroly je jediné Markdown tělo a čekající payload také obsahuje text sdíleného odkazu pro externí předání. Uzly na větvi `review` se spustí okamžitě, když je pozastavení vytvořeno; normální výstupní cesta pokračuje až po schválení. Po schválení Heym obnoví běh z uloženého snapshotu spuštění a agent pokračuje se schváleným kontextem. Pokud i pozdější krok vyžaduje schválení, agent může vytvořit další HITL kontrolní bod. Podrobnosti o tvaru payloadu, chování URL kontroly a sémantice obnovení naleznete v [Human-in-the-Loop](../reference/human-in-the-loop.md).

HITL je dostupné pouze pro výstup agenta v textovém režimu. Ve v1 jej nelze kombinovat s `jsonOutputEnabled`.
## Režim Orchestrator

Je-li povolen, agent může delegovat úlohy na další agentní uzly ve workflow. Pokud je **režim Orchestrator zakázán**, agent **nemůže v canvasu vytvářet propojení agent→agent**.

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Je-li `true`, agent získá nástroj `call_sub_agent` |
| `subAgentLabels` | string[] | Štítky agentních uzlů, které může tento orchestrator volat |

**Sub-agenti** musí ve své User Message používat `$input.text`, aby obdrželi prompt od orchestratoru.

Když orchestrator zavolá více sub-agentů v rámci jednoho tahu, spustí se paralelně. Podrobnosti naleznete v části [Architektura agenta](../reference/agent-architecture.md).

## Sub-Workflows

Je-li nakonfigurováno, agent získá nástroj `call_sub_workflow` pro spouštění dalších workflow.

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | ID workflow, která může tento agent volat jako nástroje |

Workflow vyberte v sekci Sub-Workflows v konfiguraci agenta. Agent je bude volat s `workflow_id` a `inputs` (objekt odpovídající vstupním polím cílového workflow). Maximální hloubka: 5 vnořených volání sub-workflow.

## Nástroje z uzlů canvasu

Podporovaný uzel workflow můžete připojit k handle **tools** agenta, aby mohl agent tento uzel za běhu volat. Tím se stávající akce a transformace v canvasu změní na volatitelné nástroje bez psaní Pythonu.

Nástroje z uzlů canvasu použijte, když chcete, aby agent rozhodl, kdy spustit nakonfigurovaný uzel, a zároveň aby přihlašovací údaje, statická pole a nastavení specifická pro workflow zůstaly v UI uzlu.

### Pole poskytovaná agentem

Pole na připojeném uzlu nástroje lze označit ikonou robota. Označená pole se stanou povinnými parametry nástroje, které musí agent při volání uzlu poskytnout. Neoznačená pole zůstávají pevně daná a čtou se z konfigurace uzlu.

Například:

- Připojte uzel Slack k agentovi jako nástroj
- Ponechte přihlašovací údaje pevně v uzlu Slack
- Označte `message` jako poskytované agentem
- Agent získá nástroj Slack, kde za běhu dodá pouze zprávu

Pokud uzel není připojen k agentovi jako nástroj, ikona robota se skryje a uzel se chová jako běžný krok workflow.

### Chování za běhu

Když agent zavolá nástroj z uzlu canvasu, Heym dočasně sloučí argumenty poskytnuté agentem do dat tohoto uzlu, spustí uzel, vrátí výstup uzlu agentovi a poté obnoví původní konfiguraci uzlu. Uzly nástrojů se nespouštějí jako běžné kroky workflow prostřednictvím normálního plánování; spouštějí se pouze tehdy, když je agent zavolá.

Nástroje z uzlů canvasu jsou užitečné s integračními uzly, jako jsou Slack, Telegram, HTTP, Send Email, a s uzly pro úpravu dat, jako je [Set](./set-node.md). Trigger uzly, uzly pro řízení toku a mapovače terminálového výstupu ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) nelze použít jako nástroje agenta.

## Python nástroje

Definujte vlastní nástroje, které může agent volat. Každý nástroj má:

| Pole | Typ | Popis |
|-------|------|-------------|
| `name` | string | Název nástroje (např. `count_characters`) |
| `description` | string | Popis pro LLM |
| `parameters` | JSON Schema | Schéma pro OpenAI function-calling (formát objektu) |
| `code` | string | Kód funkce v Pythonu |

**Parameters** musí být objekt JSON, nikoli řetězec:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Příklad nástroje:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Python nástroje se ve výchozím nastavení spouštějí jako nedůvěryhodný kód v izolovaném Docker kontejneru se zvýšeným zabezpečením (žádná síť, žádný Docker socket, souborový systém pouze pro čtení, bez root oprávnění). Importy jsou omezeny na allowlist bezpečných modulů standardní knihovny. Konfiguraci (`HEYM_PYTHON_TOOL_SANDBOX`) naleznete v části [Zabezpečení → Python Tool Sandbox](../reference/security.md#python-tool-sandbox).

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Maximální počet sekund na jedno spuštění nástroje (výchozí: 30) |
| `requestTimeoutSeconds` | number | Maximální počet sekund čekání na odpověď každého modelu před vypršením časového limitu (výchozí: 60). Zvyšte ji pro pomalé nebo self-hostované poskytovatele (LiteLLM, vLLM, lokální modely) a dlouhé vícestupňové běhy. |
## MCP Connections

Připojte se k serverům [Model Context Protocol](https://modelcontextprotocol.io/) a zpřístupněte jejich nástroje agentovi.

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Typ připojení |
| `timeoutSeconds` | number | Časový limit pro toto připojení (výchozí: 30) |
| `label` | string | Volitelný zobrazovaný název |

**stdio** (lokální proces):

| Pole | Popis |
|-------|-------------|
| `command` | Příkaz ke spuštění (např. `npx`) |
| `args` | JSON pole (např. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | JSON objekt proměnných prostředí injektovaných do procesu (např. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

Většina stdio serverů s API klíčem se autentizuje prostřednictvím proměnných prostředí namísto argumentů příkazu. Nastavte `env` pro každé připojení zvlášť, aby mohl každý uzel agenta používat jiné přihlašovací údaje bez zásahu do prostředí hostitele.

Hodnoty `env` podporují [Expression DSL](../reference/expression-dsl.md), takže můžete předávat vstupy workflow jako přihlašovací údaje namísto pevného kódování tajných klíčů:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Výraz `$userInput.pat` je vyhodnocen za běhu proti vstupním datům workflow před spuštěním MCP procesu. To vám umožňuje přijímat tokeny z triggeru nebo vstupního uzlu namísto jejich vkládání do definice workflow.

Příklad — GitHub MCP s pevně zakódovaným tokenem:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Příklad — GitHub MCP s dynamickým tokenem ze vstupu workflow:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Příklad — GitHub MCP s přihlašovacími údaji Heym GitHub:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Vestavěné přihlašovací údaje GitHub v současnosti cílí na autentizaci pomocí PAT. Pokud potřebujete přístup k organizaci, použijte PAT s požadovanými oprávněními pro organizaci/repozitář.

Příklad — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (vzdálený server):

| Pole | Popis |
|-------|-------------|
| `url` | URL SSE endpointu. Podporuje výrazy (např. `$userInput.serverUrl`). |
| `headers` | JSON objekt pro autentizaci/vlastní hlavičky. Hodnoty podporují výrazy. |

**Streamable HTTP** (vzdálený server):

| Pole | Popis |
|-------|-------------|
| `url` | URL MCP endpointu (např. `https://example.com/mcp`). Podporuje výrazy. |
| `headers` | JSON objekt pro autentizaci/vlastní hlavičky. Hodnoty podporují výrazy. |

## Skills

Skills jsou instrukce SKILL.md plus volitelné Python soubory a přibalené assety. Rozšiřují systémový kontext agenta a mohou přidávat Python nástroje.

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `name` | string | Název skillu |
| `content` | string | Obsah SKILL.md (instrukce) |
| `timeoutSeconds` | number | Časový limit pro spuštění Pythonu skillu (výchozí: 30) |
| `driveFilesEnabled` | boolean | Povolí runtime pomocník `heym_drive` pro tento skill (výchozí: false) |
| `files` | array | Volitelné položky `{ path, content, encoding, mimeType }` (např. `.py` skripty nebo binární assety uložené jako base64) |

Skills lze přidat přetažením souboru `.zip` nebo `.md` do oblasti Skills.
Po rozbalení karty skillu přetáhněte libovolný soubor na tento skill pro připojení nebo nahrazení přibaleného souboru, včetně binárních assetů, jako jsou PDF a obrázky.
Pomocí tlačítka pro stažení na kartě skillu exportujte tento skill jako archiv `.zip` pro zálohu nebo opětovné použití v jiném workflow.

Povolte **Drive files** u skillu pouze tehdy, když jeho Python kód potřebuje číst soubory z Heym Drive. Povolené skills obdrží za běhu vygenerovaného pomocníka `heym_drive.py` a mohou volat `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` nebo `read_drive_base64` s ID souboru Drive nebo přesným názvem souboru. Vyhledávání podle názvu souboru používá nejnovější dostupnou shodu. Zakázané skills pomocníka neobdrží.

Každá karta skillu má čtyři akce v řádku pod názvem:

| Tlačítko | Popis |
|--------|-------------|
| **Edit with AI** | Otevře Skill Builder pro revizi skillu z chat promptu |
| **Download** | Exportuje skill jako archiv `.zip` |
| **Remove** | Smaže skill z tohoto uzlu agenta |
| **History** | Otevře historii skillu odvozenou z [Edit History](../reference/edit-history.md) |
### Historie dovedností

Historie dovedností se **neukládá** samostatně. Je odvozena ze snímků historie úprav workflow: každá uložená verze workflow obsahuje úplné pole `skills` uzlu agenta.

V dialogu Historie můžete:

- **Zobrazit náhled** minulého snímku (SKILL.md a seznam souborů)
- **Upravit** — načíst snímek do editoru dovedností bez vrácení celého workflow
- **AI Fine-tune** — otevřít Skill Builder s tímto snímkem jako výchozím bodem
- **Vrátit** — obnovit pouze tuto dovednost z minulé verze (ostatní uzly zůstanou beze změny)

Historie se řídí stejnou 7denní retencí jako historie úprav workflow. Uložení workflow po úpravách dovedností vytváří nové záznamy historie.

Sekce Dovednosti také obsahuje **AI Build**:

- Kliknutím na **AI Build** vytvoříte novou dovednost z chatového promptu
- Kliknutím na tlačítko s jiskřičkou u existující dovednosti ji upravíte pomocí AI
- Přetažením souborů do pole pro sestavení promptu je připojíte ke komentáři pro fine-tune; tyto soubory se také uloží jako přiložené prostředky dovednosti
- Modální okno streamuje text asistenta a zároveň zobrazuje živé náhledy souborů `SKILL.md` a `.py`
- **Download ZIP** exportuje aktuální náhled bez přidání do uzlu
- **Save & Add** uloží vygenerované soubory zpět prostřednictvím stejného procesu zpracování ZIP, jaký se používá při ručním nahrávání

Při úpravách pomocí AI odesílá Heym do builderu pouze textové soubory dovedností `.md` a `.py`. Binární a další needitovatelné přílohy jsou zachovány a sdíleny s builderem jako metadata cest, aby generovaný kód Python mohl zachovat správné relativní odkazy na soubory.
Vyberte přiložený soubor v pravém panelu a povolte **Include this file in AI context**, pokud AI potřebuje prozkoumat přiloženou šablonu. Textové soubory, PDF a DOCX se podle možností extrahují do kontextu promptu; Heym neuplatňuje žádný samostatný limit velikosti příloh Skill Builderu nad rámec limitu těla požadavku platformy.

## Extra Body

Někteří poskytovatelé přijímají parametry požadavku, které standardní pole kompatibilní s OpenAI
nepokrývají, například vypnutí režimu přemýšlení modelu. Zaškrtněte **Send extra request body** ve
vlastnostech uzlu a zadejte objekt JSON.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Ve výchozím stavu zakázáno.** Při vypnutém zaškrtávacím poli se nic navíc neodesílá.
- Aplikuje se na **každý** požadavek ve smyčce volání nástrojů, nejen na první tah, a také na
  pokus o záložní model. Neaplikuje se na kontroly guardrails, které používají samostatný model.
- Musí se jednat o **objekt** JSON. Pole, skalár nebo chybně formátovaný text způsobí selhání uzlu s
  chybou `Invalid extra body JSON`, místo aby byl tiše zahozen.
- Výrazy `$` se vyhodnocují před parsováním. Protože se jedná o textovou substituci, vyhodnocená
  hodnota obsahující dvojitou uvozovku nebo znak nového řádku vytvoří neplatný JSON a způsobí selhání uzlu.

Stejné pole a chování jako extra body u [uzlu LLM](./llm-node.md).

## Guardrails

Povolte **Guardrails** ve vlastnostech uzlu, abyste zablokovali nebezpečné zprávy uživatele před spuštěním agenta. Úplnou referenci naleznete v části [Guardrails](../reference/guardrails.md).

## Persistentní paměť (graf)

Volitelný znalostní graf **pro každý uzel agenta** uložený v databázi. Je-li povolen, Heym před každým spuštěním připojí k **systémové instrukci** souhrn zapamatovaných entit a vztahů ve formátu Markdown (pouze pokud je graf neprázdný). Po **úspěšném** dokončení agenta úloha na pozadí extrahuje z konverzace nová trvalá fakta a sloučí je do grafu.

| Parametr | Typ | Popis |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Povolit načítání + extrakci na pozadí pro tento uzel canvasu |

**Sub-agenti** mají **vlastní** graf (klíčovaný podle ID svého uzlu), oddělený od orchestrátoru.

Pomocí růžového ovládacího prvku **brain** na uzlu (je-li paměť zapnutá nebo je zobrazen řádek modelu) otevřete editor grafu a volitelné **sdílení paměti** (jiné workflow/agenti). Úplné chování, cesty REST a podrobnosti exportu JSON: [Persistentní paměť agenta](../reference/agent-persistent-memory.md).

## Responses API a kontinuita uvažování

Zaškrtávací pole **Use Responses API** směruje volání modelu agenta přes
[Responses API](https://platform.openai.com/docs/api-reference/responses) namísto Chat
Completions. Ve výchozím stavu je vypnuté.

Nejvíce záleží u modelu pro uvažování, jako je `gpt-5` nebo série `o`. Responses API vrací
uvažování modelu spolu s každým voláním nástroje a agent tato položky uvažování předává zpět v
následujícím tahu, takže model si zachovává řetězec myšlenek napříč vícestupňovou smyčkou nástrojů,
místo aby jej znovu odvozoval po každém výsledku nástroje. Celá smyčka běží na stejné cestě, včetně
pozastavení a obnovení [lidského posouzení](#human-review-hitl), [komprese kontextu](#context-compression)
a konečné odpovědi.

Konverzace samotná zůstává v Heymu. Heym odesílá úplný vstup při každém tahu a přenáší
uvažování jako šifrovaný blob, takže na straně poskytovatele není mezi voláními nic uchováváno.
Položky uvažování uvnitř rozsahu, který komprese kontextu shrnuje, jsou zahozeny spolu s ním, protože
šifrovaný blob nelze shrnout.

Funguje s přihlašovacími údaji OpenAI a s vlastními přihlašovacími údaji, jejichž brána podporuje
endpoint. S přihlašovacími údaji Google zůstává zakázáno.
## Komprese kontextu

Když agent provádí mnoho iterací nástrojů s rozsáhlými výsledky (web scraping, čtení dokumentů, výstupy podřízených workflow), může nahromaděná historie zpráv dosáhnout limitu kontextového okna modelu. Heym automaticky komprimuje historii konverzace v průběhu běhu, aby zabránil přetečení kontextu.

**Jak to funguje:**

1. Před každou iterací nástroje Heym odhadne aktuální počet tokenů (~4 znaky na token).
2. Pokud odhad překročí **80 %** kontextového okna modelu, spustí se komprese.
3. Historie zpráv se rozdělí na zachovanou a komprimovanou část:
   - **Zachovaná**: systémový prompt, první uživatelská zpráva, nejnovější uživatelská zpráva
   - **Komprimovaná**: vše mezi tím (kola uvažování asistenta, volání nástrojů, výsledky nástrojů)
4. Prostřední část se shrne pomocí **stejného modelu a přihlašovacích údajů** — není potřeba žádná další konfigurace.
5. Komprimované shrnutí nahradí prostřední část jako jediná zpráva asistenta.

**Pozorovatelnost:**

Události komprese se zobrazují jako záznamy `Context compressed (N messages → summary)` v:
- Seznamu volání nástrojů v **panel Debug** během živého spuštění
- Zobrazení detailu běhu v **Historie spuštění**
- Na kartě **Traces** jako záznam trace `context.compression`

Komprese je automatická a vždy aktivní pro uzly Agent. **Nevztahuje se** na uzly LLM, kartu Chat ani relace AI Assistant.

## Související

- [Proč Heym](../getting-started/why-heym.md) – Jak agenti běží a zůstávají řízeni v produkci
- [Trvalá paměť agenta](../reference/agent-persistent-memory.md) – Znalostní graf pro každý uzel agenta, volitelné sdílení, API, editor
- [Architektura agenta](../reference/agent-architecture.md) – Podřízení agenti, orchestrátor, dovednosti, MCP, volání nástrojů
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Veřejné stránky pro kontrolu, čekající spuštění, tok schválení/úpravy/odmítnutí
- [Guardrails](../reference/guardrails.md) – Blokování kategorií nebezpečného obsahu
- [Typy uzlů](../reference/node-types.md) – Přehled všech typů uzlů
- [AI Assistant](../reference/ai-assistant.md) – Chat UI pro tvorbu workflow přirozeným jazykem (odlišné od uzlu Agent)
- [Expression DSL](../reference/expression-dsl.md) – Odkazování na data v promptech
- [Struktura workflow](../reference/workflow-structure.md) – Uzly, hrany a formát DSL
- [Rychlý start](../getting-started/quick-start.md) – Základní workflow s LLM a výrazy
- [Karta Přihlašovací údaje](../tabs/credentials-tab.md) – Přidání API klíčů pro agenta
- [Karta MCP](../tabs/mcp-tab.md) – Konfigurace MCP pro nástroje workflow
