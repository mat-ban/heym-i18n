# Nodul Agent

Nodul **AI Agent** este un nod LLM cu apelare de instrumente. Acesta poate rula instrumente Python, poate apela noduri conectate din canvas ca instrumente, se poate conecta la servere MCP, poate utiliza abilități, poate acționa opțional ca orchestrator care deleagă către alte noduri agent, poate apela alte workflow-uri ca instrumente și poate întrerupe execuția pentru [revizuire umană](../reference/human-in-the-loop.md).

## Prezentare generală

| Proprietate | Valoare |
|----------|-------|
| Intrări | 1 |
| Ieșiri | 1, plus `review` opțional când HITL este activat |
| Ieșire | `$nodeLabel.text`, `$nodeLabel.fieldName` (când ieșirea JSON este activată) sau un payload HITL în așteptare în timpul revizuirii |

## Parametri de bază

### Acreditări și model

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `credentialId` | UUID | Acreditare LLM (cheie API) din Setări |
| `model` | string | Numele modelului (de ex. `gpt-4o`, `gemini-2.5-flash-lite`) |
| `fallbackCredentialId` | UUID (opțional) | Acreditare de rezervă când cea principală eșuează |
| `fallbackModel` | string (opțional) | Model de rezervă când cel principal eșuează |

Adăugați acreditări în fila [Acreditări](../tabs/credentials-tab.md). Lista de modele este încărcată din acreditarea selectată. Dacă acreditarea sau modelul principal returnează o eroare, nodul reîncearcă automat cu acreditarea și modelul de rezervă înainte de a eșua.

### Prompt-uri

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `systemInstruction` | string | Prompt de sistem pentru AI. Suportă [expresii](../reference/expression-dsl.md). |
| `userMessage` | string | Mesajul/prompt-ul utilizatorului. Implicit: `$input.text` |
| `jsonOutputEnabled` | boolean | Ieșire JSON structurată |
| `jsonOutputSchema` | string | JSON Schema pentru ieșire structurată |
| `extraBodyEnabled` | boolean | Trimite parametri de cerere specifici furnizorului (implicit: `false`) |
| `extraBody` | string | Obiect JSON îmbinat în fiecare cerere API pe care o face agentul |

Utilizați `$input.text`, `$nodeName.field` și alte sintaxe [Expression DSL](../reference/expression-dsl.md).

### Modele de raționament (o1, o3)

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `temperature` | number | 0.0–2.0 (implicit: 0.7), pentru modelele standard |
| `reasoningEffort` | `"low"` \| `"medium"` \| `"high"` | Adâncimea raționamentului pentru modelele de raționament |

Când utilizați un model de raționament (de ex. o1, o3), interfața afișează **Reasoning Effort** în loc de Temperature. Pentru modelele standard, **Temperature** controlează creativitatea.

**Exemplu de ieșire JSON:** Când aveți nevoie de date structurate de la agent (de ex. clasificare, extragere), activați ieșirea JSON și furnizați o schemă. Agentul returnează JSON conform schemei; accesați câmpurile după nume pe ieșirea nodului:

```json
{
  "jsonOutputEnabled": true,
  "jsonOutputSchema": "{ \"type\": \"object\", \"properties\": { \"status\": { \"type\": \"string\", \"enum\": [\"APPROPRIATE\", \"INAPPROPRIATE\"] }, \"reason\": { \"type\": \"string\" } }, \"required\": [\"status\", \"reason\"] }"
}
```

Nodurile din aval pot utiliza `$agentLabel.status`, `$agentLabel.reason` etc. Același comportament ca ieșirea JSON a [nodului LLM](../nodes/llm-node.md).

## Revizuire umană (HITL)

Utilizați HITL când un agent poate avea nevoie de aprobare în momente specifice înainte de acțiuni importante.

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `hitlEnabled` | boolean | Adaugă puncte de verificare pentru revizuire umană la agent |
| `hitlSummary` | string | Instrucțiuni de aprobare care îi spun agentului când este necesară revizuirea umană |

Când HITL este activat, agentul primește un instrument `request_human_review`. Utilizați prompt-ul de sistem și acest câmp de instrucțiuni pentru a explica ce apeluri de instrumente, sub-agenți, sub-workflow-uri, acțiuni MCP, abilități sau efecte secundare necesită aprobare. Agentul poate apela acel instrument doar când este necesar, inclusiv de mai multe ori într-o singură rulare.

Rezumatul destinat revizorului de pe pagina publică este generat din cererea de revizuire a agentului la momentul rulării. Dacă agentul nu furnizează un rezumat în mod explicit, Heym derivă unul din corpul de revizuire Markdown.

Pentru instrumentele MCP, Heym cere modelului să interpreteze instrucțiunile HITL scrise ca unul dintre trei domenii de aplicare: `always`, `once` sau `never`. Aceasta înseamnă că formulări libere precum „pentru fiecare apel", „doar o dată" sau „nu întreba niciodată" sunt normalizate înainte de aplicarea blocării la momentul rulării.

Fiecare punct de verificare HITL creează un link public de revizuire de unică folosință la `/review/{token}`. Un revizor poate:

- **Accept** textul original de revizuire Markdown
- **Edit & Continue** cu Markdown modificat
- **Refuse** și continua cu `text: ""`

Când HITL este activat, nodul expune și un handle de ieșire `review` pe canvas. Conectați acea ramură la Slack, e-mail sau alte noduri de notificare dacă doriți să difuzați URL-ul de revizuire și rezumatul imediat ce rularea se întrerupe.

Execuția trece în starea `pending` până când un revizor răspunde. Textul de revizuire este un singur corp Markdown, iar payload-ul în așteptare include și text de link partajabil pentru transfer extern. Nodurile de pe ramura `review` rulează imediat când este creată pauza; calea normală de ieșire continuă doar după aprobare. După aprobare, Heym reia din instantaneul de execuție stocat și agentul continuă cu contextul aprobat. Dacă un pas ulterior necesită și el aprobare, agentul poate crea un alt punct de verificare HITL. Consultați [Human-in-the-Loop](../reference/human-in-the-loop.md) pentru forma payload-ului, comportamentul URL-ului de revizuire și semantica reluării.

HITL este disponibil doar pentru ieșirea agentului în mod text. În v1 nu poate fi combinat cu `jsonOutputEnabled`.
## Modul Orchestrator

Când este activat, agentul poate delega sarcini către alte noduri de agent din workflow. Dacă **modul Orchestrator este dezactivat**, agentul **nu poate crea conexiuni agent→agent** în canvas.

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `isOrchestrator` | boolean | Când este `true`, agentul primește un instrument `call_sub_agent` |
| `subAgentLabels` | string[] | Etichetele nodurilor de agent pe care le poate apela acest orchestrator |

**Sub-agenții** trebuie să utilizeze `$input.text` în mesajul lor de utilizator pentru a primi prompt-ul orchestratorului.

Când orchestratorul apelează mai mulți sub-agenți într-o singură rundă, aceștia se execută în paralel. Consultați [Arhitectura agentului](../reference/agent-architecture.md) pentru detalii.

## Sub-Workflow-uri

Când este configurat, agentul primește un instrument `call_sub_workflow` pentru a executa alte workflow-uri.

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `subWorkflowIds` | string[] | ID-urile workflow-urilor pe care acest agent le poate apela ca instrumente |

Selectați workflow-urile în secțiunea Sub-Workflows din configurația agentului. Agentul le va apela cu `workflow_id` și `inputs` (obiect care corespunde câmpurilor de intrare ale workflow-ului țintă). Adâncime maximă: 5 apeluri imbricate de sub-workflow.

## Instrumente de tip nod din Canvas

Puteți conecta un nod de workflow acceptat la mânerul **tools** al unui agent, astfel încât agentul să poată apela acel nod la runtime. Aceasta transformă acțiunile și transformările existente din canvas în instrumente apelabile, fără a scrie cod Python.

Utilizați instrumentele de tip nod din canvas atunci când doriți ca agentul să decidă când să ruleze un nod configurat, păstrând în același timp acreditările, câmpurile statice și setările specifice workflow-ului în interfața nodului.

### Câmpuri furnizate de agent

Câmpurile de pe un nod instrument conectat pot fi marcate cu pictograma bot. Câmpurile marcate devin parametri obligatorii ai instrumentului, pe care agentul trebuie să îi furnizeze atunci când apelează nodul. Câmpurile nemarcate rămân fixe și sunt citite din configurația nodului.

De exemplu:

- Conectați un nod Slack la un agent ca instrument
- Păstrați acreditarea fixă în nodul Slack
- Marcați `message` ca furnizat de agent
- Agentul primește un instrument Slack în care furnizează doar mesajul la runtime

Dacă nodul nu este conectat la un agent ca instrument, pictograma bot este ascunsă, iar nodul se comportă ca un pas normal de workflow.

### Comportament la runtime

Când agentul apelează un instrument de tip nod din canvas, Heym îmbină temporar argumentele furnizate de agent în datele acelui nod, execută nodul, returnează rezultatul nodului agentului, apoi restaurează configurația originală a nodului. Nodurile instrument nu rulează ca pași obișnuiți de workflow prin programare normală; ele rulează doar atunci când agentul le apelează.

Instrumentele de tip nod din canvas sunt utile cu noduri de integrare precum Slack, Telegram, HTTP, Send Email și noduri de modelare a datelor precum [Set](./set-node.md). Nodurile Trigger, nodurile de control al fluxului și mapatoarele de ieșire terminală ([JSON output mapper](./json-output-mapper-node.md), [HTML output mapper](./html-output-mapper-node.md)) nu pot fi utilizate ca instrumente ale agentului.

## Instrumente Python

Definiți instrumente personalizate pe care agentul le poate apela. Fiecare instrument are:

| Câmp | Tip | Descriere |
|-------|------|-------------|
| `name` | string | Numele instrumentului (de ex. `count_characters`) |
| `description` | string | Descrierea pentru LLM |
| `parameters` | JSON Schema | Schema de apelare a funcțiilor OpenAI (format obiect) |
| `code` | string | Codul funcției Python |

**Parameters** trebuie să fie un obiect JSON, nu un șir de caractere:

```json
{
  "type": "object",
  "properties": {
    "text": { "type": "string", "description": "Text to count" }
  },
  "required": ["text"]
}
```

**Exemplu de instrument:**

```python
def count_characters(text: str) -> int:
    return len(text)
```

> **Sandbox.** Instrumentele Python rulează ca cod neîncrezut într-un container Docker izolat și securizat în mod implicit (fără rețea, fără socket Docker, sistem de fișiere read-only, non-root). Importurile sunt limitate la o listă de module sigure din biblioteca standard. Consultați [Securitate → Sandbox pentru instrumente Python](../reference/security.md#python-tool-sandbox) pentru configurare (`HEYM_PYTHON_TOOL_SANDBOX`).

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `toolTimeoutSeconds` | number | Numărul maxim de secunde per execuție a instrumentului (implicit: 30) |
| `requestTimeoutSeconds` | number | Numărul maxim de secunde de așteptare pentru fiecare răspuns al modelului înainte de expirare (implicit: 60). Măriți-l pentru furnizori lenți sau găzduiți local (LiteLLM, vLLM, modele locale) și pentru rulări lungi cu mai mulți pași. |
## Conexiuni MCP

Conectați-vă la servere [Model Context Protocol](https://modelcontextprotocol.io/) pentru a expune instrumentele acestora agentului.

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `transport` | `"stdio"` \| `"sse"` \| `"streamable_http"` | Tipul conexiunii |
| `timeoutSeconds` | number | Timeout pentru această conexiune (implicit: 30) |
| `label` | string | Nume de afișare opțional |

**stdio** (proces local):

| Câmp | Descriere |
|-------|-------------|
| `command` | Comanda de executat (de ex. `npx`) |
| `args` | Array JSON (de ex. `["-y", "@modelcontextprotocol/server-filesystem", "--path", "/tmp"]`) |
| `env` | Obiect JSON cu variabile de mediu injectate în proces (de ex. `{"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_..."}`) |

Majoritatea serverelor stdio care utilizează chei API se autentifică prin variabile de mediu, nu prin argumente de comandă. Setați `env` pentru fiecare conexiune în parte, astfel încât fiecare nod de agent să poată utiliza o acreditare diferită fără a modifica mediul gazdă.

Valorile `env` acceptă [Expression DSL](../reference/expression-dsl.md), astfel încât puteți transmite intrări din workflow ca acreditări în loc să codificați manual secretele:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Expresia `$userInput.pat` este rezolvată la runtime pe baza datelor de intrare ale workflow-ului înainte ca procesul MCP să pornească. Astfel, puteți accepta token-uri dintr-un trigger sau dintr-un nod de intrare, în loc să le încorporați în definiția workflow-ului.

Exemplu — GitHub MCP cu token codificat manual:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx" }
}
```

Exemplu — GitHub MCP cu token dinamic din intrarea workflow-ului:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$userInput.pat" }
}
```

Exemplu — GitHub MCP cu o acreditare GitHub Heym:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-github"],
  "env": { "GITHUB_PERSONAL_ACCESS_TOKEN": "$credentials.MyGitHubToken" }
}
```

Acreditarea GitHub integrată vizează în prezent autentificarea bazată pe PAT. Dacă aveți nevoie de acces la nivel de organizație, utilizați un PAT cu permisiunile necesare pentru organizație/repository.

Exemplu — Slack MCP:

```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-slack"],
  "env": { "SLACK_BOT_TOKEN": "xoxb-...", "SLACK_TEAM_ID": "T0123456" }
}
```

**SSE** (server remote):

| Câmp | Descriere |
|-------|-------------|
| `url` | URL-ul endpoint-ului SSE. Acceptă expresii (de ex. `$userInput.serverUrl`). |
| `headers` | Obiect JSON pentru autentificare/headere personalizate. Valorile acceptă expresii. |

**Streamable HTTP** (server remote):

| Câmp | Descriere |
|-------|-------------|
| `url` | URL-ul endpoint-ului MCP (de ex. `https://example.com/mcp`). Acceptă expresii. |
| `headers` | Obiect JSON pentru autentificare/headere personalizate. Valorile acceptă expresii. |

## Skills

Skills reprezintă instrucțiuni SKILL.md plus fișiere Python opționale și resurse incluse. Acestea extind contextul de sistem al agentului și pot adăuga instrumente Python.

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `name` | string | Numele skill-ului |
| `content` | string | Conținutul SKILL.md (instrucțiuni) |
| `timeoutSeconds` | number | Timeout pentru execuția Python a skill-ului (implicit: 30) |
| `driveFilesEnabled` | boolean | Activează helper-ul `heym_drive` la runtime pentru acest skill (implicit: false) |
| `files` | array | Intrări opționale `{ path, content, encoding, mimeType }` (de ex. scripturi `.py` sau resurse binare stocate ca base64) |

Skill-urile pot fi adăugate prin glisarea unui fișier `.zip` sau `.md` în zona Skills.
După extinderea unui card de skill, glisați orice fișier pe acel skill pentru a atașa sau înlocui un fișier inclus, inclusiv resurse binare precum PDF-uri și imagini.
Utilizați butonul de descărcare de pe un card de skill pentru a exporta skill-ul ca arhivă `.zip` pentru backup sau reutilizare în alt workflow.

Activați **Drive files** pentru un skill doar atunci când codul Python al acestuia trebuie să citească fișiere din Heym Drive. Skill-urile activate primesc la runtime un helper generat `heym_drive.py` și pot apela `list_drive_files`, `get_drive_file`, `get_drive_file_path`, `read_drive_file`, `read_drive_text` sau `read_drive_base64` cu un id de fișier Drive sau cu numele exact al fișierului. Căutarea după nume de fișier utilizează cea mai recentă potrivire accesibilă. Skill-urile dezactivate nu primesc helper-ul.

Fiecare card de skill are patru acțiuni pe rândul de sub titlu:

| Buton | Descriere |
|--------|-------------|
| **Edit with AI** | Deschide Skill Builder pentru a revizui skill-ul pornind de la un prompt în Chat |
| **Download** | Exportă skill-ul ca arhivă `.zip` |
| **Remove** | Șterge skill-ul din acest nod de agent |
| **History** | Deschide istoricul skill-ului derivat din [Edit History](../reference/edit-history.md) |
### Istoric abilități

Istoricul abilităților **nu** este stocat separat. Acesta este derivat din instantaneele Istoricului de editare al workflow-ului: fiecare versiune salvată a workflow-ului include matricea completă `skills` a nodului agent.

Din dialogul Istoric puteți:

- **Previzualiza** un instantaneu anterior (SKILL.md și lista de fișiere)
- **Edita** — încărcați un instantaneu în editorul de abilități fără a reveni întregul workflow
- **AI Fine-tune** — deschideți Skill Builder cu acel instantaneu ca punct de plecare
- **Reveni** — restaurați doar această abilitate dintr-o versiune anterioară (celelalte noduri rămân neschimbate)

Istoricul respectă aceeași retenție de 7 zile ca Istoricul de editare al workflow-ului. Salvarea workflow-ului după editarea abilităților creează intrări noi în istoric.

Secțiunea Abilități include de asemenea **AI Build**:

- Faceți clic pe **AI Build** pentru a crea o abilitate nouă dintr-un prompt de chat
- Faceți clic pe butonul sparkle de pe o abilitate existentă pentru a o revizui cu AI
- Trageți fișiere în compozitorul de prompt pentru a le atașa la comentariul de fine-tune; acele fișiere sunt de asemenea salvate ca active de abilitate incluse
- Modalul transmite textul asistentului în timp ce afișează previzualizări live ale fișierelor `SKILL.md` și `.py`
- **Download ZIP** exportă previzualizarea curentă fără a o adăuga la nod
- **Save & Add** salvează fișierele generate înapoi prin același flux de parsare ZIP folosit de încărcările manuale

La editarea cu AI, Heym trimite doar fișiere de abilitate text `.md` și `.py` către builder. Atașamentele binare și alte atașamente needitabile sunt păstrate și partajate cu builder-ul ca metadate de cale, astfel încât codul Python generat să poată menține referințele relative de fișiere corecte.
Selectați un fișier atașat în panoul din dreapta și activați **Include this file in AI context** când AI-ul trebuie să inspecteze un șablon inclus. Fișierele text, PDF și DOCX sunt extrase în contextul promptului atunci când este posibil; Heym nu aplică o limită separată de dimensiune a atașamentelor pentru Skill Builder dincolo de limita corpului cererii platformei.

## Extra Body

Unii furnizori acceptă parametri de cerere pe care câmpurile standard compatibile cu OpenAI nu le acoperă, cum ar fi dezactivarea modului de gândire al unui model. Bifați **Send extra request body** în proprietățile nodului și introduceți un obiect JSON.

```json
{
  "extraBodyEnabled": true,
  "extraBody": "{ \"thinking\": { \"type\": \"disabled\" } }"
}
```

- **Dezactivat implicit.** Cu caseta de selectare debifată, nu se trimite nimic suplimentar.
- Aplicat la **fiecare** cerere din bucla de apelare a instrumentelor, nu doar la prima rundă, plus încercarea modelului de rezervă. Nu se aplică verificărilor guardrail, care folosesc un model separat.
- Trebuie să fie un **obiect** JSON. O matrice, un scalar sau text malformat cauzează eșecul nodului cu `Invalid extra body JSON` în loc să fie eliminat silențios.
- Expresiile `$` sunt rezolvate înainte de parsare. Deoarece aceasta este o substituție textuală, o valoare rezolvată care conține un ghilimel dublu sau o linie nouă produce JSON invalid și cauzează eșecul nodului.

Același câmp și comportament ca extra body-ul [nodului LLM](./llm-node.md).

## Guardrails

Activați **Guardrails** în proprietățile nodului pentru a bloca mesajele utilizatorilor nesigure înainte ca agentul să ruleze. Consultați [Guardrails](../reference/guardrails.md) pentru referința completă.

## Memorie persistentă (graf)

Graf de cunoștințe opțional **per-nod-agent** stocat în baza de date. Când este activat, Heym adaugă un rezumat Markdown al entităților și relațiilor memorate la **instrucțiunea de sistem** înainte de fiecare rulare (doar dacă graful nu este gol). După o finalizare **cu succes** a agentului, un job în fundal extrage fapte durabile noi din conversație și le îmbină în graf.

| Parametru | Tip | Descriere |
|-----------|------|-------------|
| `persistentMemoryEnabled` | boolean | Activează încărcarea + extragerea în fundal pentru acest nod canvas |

**Sub-agenții** păstrează propriul **lor** graf (indexat după id-ul nodului lor), separat de orchestrator.

Folosiți controlul roz **brain** de pe nod (când memoria este activată sau rândul modelului este afișat) pentru a deschide editorul de graf și **partajarea opțională a memoriei** (alte workflow-uri/agenți). Comportament complet, căi REST și detalii de export JSON: [Agent Persistent Memory](../reference/agent-persistent-memory.md).

## Responses API și continuitatea raționamentului

O casetă de selectare **Use Responses API** direcționează apelurile modelului agentului prin
[Responses API](https://platform.openai.com/docs/api-reference/responses) în loc de Chat
Completions. Este dezactivată implicit.

Contează cel mai mult pe un model de raționament precum `gpt-5` sau seria `o`. Responses API returnează
raționamentul modelului alături de fiecare apel de instrument, iar agentul alimentează acele elemente de raționament înapoi
la următoarea rundă, astfel încât modelul își păstrează lanțul de gândire de-a lungul unei bucle de instrumente cu mai mulți pași
în loc să îl re-derive după fiecare rezultat de instrument. Întreaga buclă rulează pe aceeași cale, inclusiv
pauza și reluarea [revizuirii umane](#human-review-hitl), [compresia contextului](#context-compression),
și răspunsul final.

Conversația în sine rămâne în Heym. Heym trimite intrarea completă la fiecare rundă și transportă
raționamentul ca un blob criptat, astfel încât nimic nu este reținut de partea furnizorului între apeluri.
Elementele de raționament dintr-un interval pe care compresia contextului îl rezumă sunt eliminate împreună cu acesta, deoarece
un blob criptat nu poate fi rezumat.

Funcționează cu o acreditare OpenAI și cu o acreditare personalizată al cărei gateway acceptă
endpoint-ul. Cu o acreditare Google rămâne dezactivată.
## Compresia Contextului

Când un agent rulează numeroase iterații de unelte cu rezultate mari (web scraping, citiri de documente, ieșiri de sub-workflow-uri), istoricul acumulat de mesaje se poate apropia de limita ferestrei de context a modelului. Heym comprimă automat istoricul conversației în timpul rulării pentru a preveni depășirea contextului.

**Cum funcționează:**

1. Înainte de fiecare iterație de unealtă, Heym estimează numărul curent de tokeni (~4 caractere per token).
2. Dacă estimarea depășește **80%** din fereastra de context a modelului, compresia este declanșată.
3. Istoricul mesajelor este împărțit în secțiuni păstrate și comprimate:
   - **Păstrate**: prompt-ul de sistem, primul mesaj al utilizatorului, cel mai recent mesaj al utilizatorului
   - **Comprimate**: tot ce se află între ele (ture de raționament ale asistentului, apeluri de unelte, rezultate ale uneltelor)
4. Secțiunea din mijloc este rezumată folosind **același model și aceeași acreditare** — nu este necesară configurare suplimentară.
5. Rezumatul comprimat înlocuiește secțiunea din mijloc ca un singur mesaj al asistentului.

**Observabilitate:**

Evenimentele de compresie apar ca intrări `Context compressed (N messages → summary)` în:
- Lista de apeluri de unelte din **Panoul de depanare** în timpul execuției live
- Vizualizarea detaliilor rulării din **Istoricul execuțiilor**
- **Fila Traces** ca intrare de trace `context.compression`

Compresia este automată și întotdeauna activă pentru nodurile Agent. Aceasta **nu** se aplică nodurilor LLM, filei Chat sau sesiunilor Asistentului AI.

## Resurse conexe

- [De ce Heym](../getting-started/why-heym.md) – Cum rulează agenții și rămân guvernați în producție
- [Memoria persistentă a agentului](../reference/agent-persistent-memory.md) – Graf de cunoștințe per nod de agent, partajare opțională, API, editor
- [Arhitectura agentului](../reference/agent-architecture.md) – Sub-agenți, orchestrator, competențe, MCP, apelarea uneltelor
- [Human-in-the-Loop](../reference/human-in-the-loop.md) – Pagini publice de revizuire, execuții în așteptare, flux de aprobare/editare/refuz
- [Guardrails](../reference/guardrails.md) – Blocați categoriile de conținut nesigur
- [Tipuri de noduri](../reference/node-types.md) – Prezentare generală a tuturor tipurilor de noduri
- [Asistentul AI](../reference/ai-assistant.md) – Interfață Chat pentru construirea workflow-urilor cu limbaj natural (distinctă de nodul Agent)
- [Expression DSL](../reference/expression-dsl.md) – Referirea datelor în prompt-uri
- [Structura workflow-ului](../reference/workflow-structure.md) – Noduri, muchii și formatul DSL
- [Pornire rapidă](../getting-started/quick-start.md) – Workflow de bază cu LLM și expresii
- [Fila Acreditări](../tabs/credentials-tab.md) – Adăugați chei API pentru agent
- [Fila MCP](../tabs/mcp-tab.md) – Configurați MCP pentru unelte de workflow
