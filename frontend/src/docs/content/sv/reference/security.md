# Säkerhet

Säkerhetsrutiner och konfiguration för Heym-plattformen.

## Lösenordspolicy

Alla lösenord – vid registrering och vid byte av lösenord – måste uppfylla följande krav:

| Regel | Krav |
|------|-------------|
| Minsta längd | 8 tecken |
| Versaler | Minst en versal (A–Z) |
| Gemener | Minst en gemen (a–z) |
| Siffra | Minst en siffra (0–9) |

Dessa regler tillämpas både i frontend och i backend (Pydantic-validator). En begäran med ett icke-kompatibelt lösenord avvisas med svaret `422 Unprocessable Entity` innan någon databasskrivning sker.

**Exempel på ett giltigt lösenord:** `MyWorkflow7!`

## Sessionshantering

- Access-tokens lagras i **HttpOnly**-cookies, inte i `localStorage`. Detta förhindrar att JavaScript (inklusive XSS-payloads) kan läsa token.
- Refresh-token är begränsad till sökvägen `/api/auth/refresh` och kan inte skickas till andra endpoints.
- Varje anrop till `/api/auth/refresh` **roterar** refresh-token: den gamla token återkallas omedelbart och en ny utfärdas. Återanvändning av en använd refresh-token returnerar `401`.

## Hastighetsbegränsning

Följande endpoints är hastighetsbegränsade per IP:

| Endpoint | Gräns | Banlängd |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 req / 60 s | 15 min |
| `POST /api/auth/register` | 5 req / 60 s | 10 min |
| `POST /register` (OAuth-klienter) | 5 req / 60 s | 10 min |
| Portalinloggning | 3 försök | 24 h |

När `REDIS_URL` är konfigurerad delas hastighetsgränserna mellan alla backend-arbetare. Utan den tillämpas gränserna per arbetsprocess.

## Kryptering av autentiseringsuppgifter

Alla API-nycklar, webhook-URL:er och bearer-tokens som lagras i panelen [Credentials](../tabs/credentials-tab.md) krypteras i vila med AES-256 (Fernet) innan de skrivs till databasen. Nyckeln härleds från miljövariabeln `ENCRYPTION_KEY`. Skripten `run.sh` och `deploy.sh` genererar automatiskt ett starkt värde när det är tomt; applikationen vägrar starta om `ENCRYPTION_KEY` är tom eller lämnad vid en känd platshållare.

## MCP API-nyckel

MCP API-nyckeln används för att autentisera externa MCP-klienter som ansluter till endpointen `/api/mcp/sse`. När SSE-anslutningen upprättas utfärdas en kortlivad (1 timme) sessionstoken som bäddas in i meddelandeendpointens URL istället för den riktiga API-nyckeln, vilket förhindrar att nyckeln visas i serverns åtkomstloggar. Se [MCP-fliken](../tabs/mcp-tab.md) för konfiguration.

## OAuth / PKCE

OAuth 2.0-auktoriseringsservern (som används för MCP-klienter) stöder endast `authorization_code`-bidraget med PKCE (`S256`). Samtyckesformuläret använder HMAC-SHA256 CSRF-tokens giltiga i 10 minuter. Alla värden som visas på samtyckessidan HTML-escapas.

## Execution-tokens

[Execution-tokens](./execution-tokens.md) är begränsade JWT:er för att anropa en workflows execute-endpoint från externa system. Till skillnad från användarsessionstokens är de:

- **Begränsade till en enskild workflow** – en token avvisas för alla andra workflows.
- **Oberoende återkalleliga** – återkallning av en token påverkar inte den utfärdande användarens session.
- **Kort- eller långlivade** – välj en TTL från 60 sekunder till 10 år.

Tokens signeras med samma applikationshemlighet (`SECRET_KEY`) och kontrolleras vid varje begäran: signatur, utgång, `wid`-claim-matchning och återkallningsstatus. Se [Execution Tokens](./execution-tokens.md) för konfiguration och API-referens.

## Innehållssäkerhet

Använd [Guardrails](./guardrails.md) på LLM- och Agent-noder för att blockera osäkra eller policyöverträdande användarmeddelanden innan de når modellen. Guardrails stöder nio innehållskategorier (våld, hatpropaganda, sexuellt innehåll, etc.) med konfigurerbara känslighetsnivåer.

## Python-verktygssandbox

Användardefinierade Python-verktyg på [Agent-noden](../nodes/agent-node.md) kör ej betrodd kod. Som standard kör Heym varje verktyg i en härdad, tillfällig Docker-container med:

- ingen nätverksåtkomst,
- ett skrivskyddat rotfilsystem med en liten `tmpfs`-arbetskatalog,
- en icke-root-användare med alla Linux-capabilities borttagna och `no-new-privileges`,
- strikta CPU-, minnes- och PID-gränser, och
- **ingen Docker-socket** monterad, så ett verktyg kan inte nå värdens Docker-daemon.

Körningsbackend styrs av miljövariabeln `HEYM_PYTHON_TOOL_SANDBOX`:

| Värde | Beteende |
|-------|----------|
| `auto` (standard) | Kör i den härdade Docker-containern. Om Docker inte är tillgängligt **misslyckas körningen stängt** – den kör inte tyst ej betrodd kod utan OS-isolering. |
| `docker` | Samma som `auto`, men faller aldrig tillbaka. |
| `subprocess` | Kör i en lokal processintern subprocess skyddad av en import-allowlist. Detta är **inte en säkerhetsgräns** och är endast avsett för betrodd kod eller lokal utveckling. `run.sh` väljer detta för inbyggd utveckling. |

Ange `HEYM_PYTHON_TOOL_IMAGE` för att fästa sandbox-avbildningen; när den är tom identifierar Heym automatiskt den körande backend-avbildningen. De processinterna begränsningarna (en import-allowlist plus filtrering av attribut och introspektion) tillämpas som försvar på djupet, men containern är den verkliga isoleringsgränsen – behåll standardläget `auto` (eller `docker`) för fleranvändar- och produktionsdistributioner.
## Skill Sandbox

Python-skills som är kopplade till en [Agent-nod](../nodes/agent-node.md) kör även ej betrodd kod — en skill kan anlända ordagrant inuti ett delat workflow eller en mall med `everyone`-synlighet — så skills körs genom **samma** `HEYM_PYTHON_TOOL_SANDBOX`-växel som Python-verktyg och misslyckas stängt på samma sätt. Skill-containern är härdad på identiskt sätt (icke-root, alla capabilities borttagna, `no-new-privileges`, skrivskyddat rotfilsystem, CPU-/minnes-/PID-gränser och **ingen Docker-socket**), med två avsiktliga skillnader eftersom skills legitimt behöver dem:

- **Nätverksutgång är tillåten** (skills anropar API:er och installerar sina egna beroenden via `uv`), och
- **en skrivbar arbetsyta är monterad** så att skills kan generera utdatafiler och läsa Heym Drive-filer.

Arbetsytan delas med den tillfälliga syskoncontainern genom samma namngivna Docker-volym som Codex-runnern använder (`heym-codex-workspaces`, monterad vid `/app/data/codex-workspaces`). Endast denna körnings egen underkatalog monteras in i syskonet — via en per-körning `volume-subpath` — så en skill ser aldrig en annan körnings eller Codex arbetsytedata. Docker Compose-stacken monterar alltid denna volym; den enskilda containern `docker run` måste inkludera `-v heym-codex-workspaces:/app/data/codex-workspaces` för Python-skills såväl som Codex. Om volymen saknas i `auto`/`docker`-läge **misslyckas skill-körning stängt** snarare än att köras i backend. Eftersom per-körning subpath-monteringar kräver **Docker Engine 25.0 eller nyare**, bör äldre motorer antingen uppgradera eller köra betrodda skills med `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Endast icke-hemliga, portabla miljövariabler (proxy- och CA-bundle-inställningar, locale) vidarebefordras in i containern; databas-URL:er, `SECRET_KEY`/`ENCRYPTION_KEY`, leverantörs-API-nycklar och OAuth-hemligheter undanhålls av en allowlist. Skill-filsökvägar valideras för att stanna inom arbetsytan, och symlänkar planterade i utdatakatalogen (inklusive `_hitl_request.json`-sentinel) följs aldrig. Åsidosätt standardvärdena med `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` och `HEYM_SKILL_USER` vid behov.

Liksom med verktyg kör `subprocess`-läge skillen i backend-processen och är **inte en säkerhetsgräns** — använd det endast för betrodd enanvändar- eller lokal utveckling (`run.sh` väljer det för native dev).

## Code Node Sandbox

[Code-noden](../nodes/code-node.md) kör godtycklig användar-Python tillsammans med godtyckliga tredjepartsberoenden, så den är den strängaste av de tre sandboxarna och den enda med **ingen undanflyktsväg**: den läser ingen sandbox-lägesvariabel, har inget `subprocess`-läge och misslyckas stängt när ingen Docker-daemon är nåbar. Den faller aldrig tillbaka på att köra användarkod i backend-processen.

Körning är en eller två tillfälliga containrar, båda härdade som verktygs- och skill-sandboxarna (icke-root, alla capabilities borttagna, `no-new-privileges`, skrivskyddat rotfilsystem, CPU-/minnes-/PID-gränser och **ingen Docker-socket**):

- Med en tom `requirements.txt` kör en **enskild container med `--network none`** koden. Runnern anländer i containerns stdin-payload, så inget monteras alls.
- Med beroenden installerar en första container dem med nätverksåtkomst i en per-körning `.deps`-katalog, och en andra container monterar den delträdet **skrivskyddat** och kör koden. Körningscontainern har inget nätverk om inte nodens `codeAllowNetwork`-alternativ är aktiverat.

Beroenden installeras med `uv`, görs om med `pip` och cachas aldrig mellan körningar. När backend körs i en container ligger per-körning-katalogen på samma `heym-codex-workspaces`-volym som skill-sandboxen använder, monterad genom en per-körning `volume-subpath` så en körning aldrig ser en annans filer; den formen kräver **Docker Engine 25.0 eller nyare**. En native backend (`./run.sh`) har ingen sådan volym och behöver ingen — dess per-körning-katalog är en lokal temporär sökväg som bind-monteras direkt in i syskonet. Oavsett vilket raderas katalogen efter varje körning oavsett utfall.

Endast icke-hemliga, portabla miljövariabler vidarebefordras in i containrarna — proxy-inställningar, CA-bundles och locale, vilket beroendeinstallation behöver för att nå PyPI bakom en företagsproxy. Databas-URL:er, `SECRET_KEY`/`ENCRYPTION_KEY`, leverantörs-API-nycklar och OAuth-hemligheter undanhålls av en allowlist, så en ny backend-hemlighet släpps igenom som standard snarare än läcker tills någon uppdaterar en denylist. Backendens `HOME` åsidosätter aldrig sandboxens egen skrivbara sökväg.

**Format**-knappen använder samma sandbox. Ruff parsar och skriver om källkoden snarare än att köra den, men att köra den på backend-värden skulle ge en ej betrodd fil en process som ärver backendens hela miljö, så den får sin egen tillfälliga `--network none`-container med samma gränser och samma allowlistade miljö. Den misslyckas stängt utan Docker snarare än att formatera på värden.

Sandbox-gränser är konstanter snarare än miljövariabler — 512 MB minne, en CPU, 256 processer, en 120-sekunders installationstimeout och en 60-sekunders körningstimeout. Imagen löses från den befintliga `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`-kedjan; noden introducerar ingen egen konfiguration.
## Relaterat

- [Körning & Distribution](../getting-started/running-and-deployment.md) – Konfigurera `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` och `HEYM_PYTHON_TOOL_SANDBOX` vid start
- [Code Node](../nodes/code-node.md) – Sandboxad Python-körning med egna beroenden
- [Agent Node](../nodes/agent-node.md) – Anpassade Python-verktyg som körs i sandboxen
- [Execution Tokens](./execution-tokens.md) – Avgränsade JWT:er för att anropa Workflows från externa system
- [Guardrails](./guardrails.md) – Blockera osäkert innehåll i LLM- och Agent-noder
- [Inställningar](./user-settings.md) – Ändra lösenord
- [Credentials-fliken](../tabs/credentials-tab.md) – Hantera API-nycklar
- [MCP-fliken](../tabs/mcp-tab.md) – MCP API-nyckel och OAuth-klienter
- [Portal](./portal.md) – Åtkomstkontroll för publik chattportal
