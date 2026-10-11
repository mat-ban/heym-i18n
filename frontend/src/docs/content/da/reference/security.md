# Sikkerhed

Sikkerhedspraksis og konfiguration for Heym-platformen.

## Adgangskodepolitik

Alle adgangskoder – ved registrering og ved ændring af adgangskode – skal opfylde følgende krav:

| Regel | Krav |
|------|-------------|
| Minimumslængde | 8 tegn |
| Store bogstaver | Mindst ét stort bogstav (A–Z) |
| Små bogstaver | Mindst ét lille bogstav (a–z) |
| Tal | Mindst ét tal (0–9) |

Disse regler håndhæves både på frontend og backend (Pydantic validator). En forespørgsel med en ikke-kompatibel adgangskode afvises med en `422 Unprocessable Entity`-respons før enhver databaseskrivning finder sted.

**Eksempel på en gyldig adgangskode:** `MyWorkflow7!`

## Sessionhåndtering

- Adgangstokens gemmes i **HttpOnly**-cookies, ikke `localStorage`. Dette forhindrer JavaScript (inklusive XSS-payloads) i at læse tokenet.
- Refresh-tokenet er begrænset til stien `/api/auth/refresh` og kan ikke sendes til andre endpoints.
- Hver `/api/auth/refresh`-kald **roterer** refresh-tokenet: det gamle token tilbagekaldes øjeblikkeligt og et nyt udstedes. Gentagelse af et brugt refresh-token returnerer `401`.

## Hastighedsbegrænsning

Følgende endpoints er hastighedsbegrænset pr. IP:

| Endpoint | Grænse | Udelukkelsesvarighed |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 foresp. / 60 s | 15 min |
| `POST /api/auth/register` | 5 foresp. / 60 s | 10 min |
| `POST /register` (OAuth-klienter) | 5 foresp. / 60 s | 10 min |
| Portal-login | 3 forsøg | 24 t |

Når `REDIS_URL` er konfigureret, deles hastighedsbegrænsninger på tværs af alle backend-workers. Uden det gælder begrænsninger pr. worker-proces.

## Kryptering af legitimationsoplysninger

Alle API-nøgler, webhook-URL'er og bearer-tokens gemt i panelet [Legitimationsoplysninger](../tabs/credentials-tab.md) krypteres på disk ved brug af AES-256 (Fernet) før de skrives til databasen. Nøglen afledes af miljøvariablen `ENCRYPTION_KEY`. Scriptene `run.sh` og `deploy.sh` genererer automatisk en stærk værdi, når den er tom; applikationen nægter at starte, hvis `ENCRYPTION_KEY` er tom eller efterladt som en kendt pladsholder.

## MCP API-nøgle

MCP API-nøglen bruges til at autentificere eksterne MCP-klienter, der forbinder til endpointet `/api/mcp/sse`. Når SSE-forbindelsen etableres, udstedes et kortvarigt (1 times) sessionstoken og indlejres i message endpoint-URL'en i stedet for den rigtige API-nøgle, hvilket forhindrer nøglen i at optræde i serveradgangslogs. Se [MCP-panelet](../tabs/mcp-tab.md) for opsætning.

## OAuth / PKCE

OAuth 2.0-godkendelsesserveren (brugt til MCP-klienter) understøtter kun `authorization_code`-grant med PKCE (`S256`). Samtykkeformularen bruger HMAC-SHA256 CSRF-tokens, der er gyldige i 10 minutter. Alle værdier vist på samtykkesiden er HTML-escaped.

## Eksekveringstokens

[Eksekveringstokens](./execution-tokens.md) er scopede JWTs til at kalde et workflows eksekverings-endpoint fra eksterne systemer. I modsætning til brugersessionstokens er de:

- **Single-workflow-scoped** – et token afvises for ethvert andet workflow.
- **Uafhængigt tilbagekaldelige** – tilbagekaldelse af et token har ingen effekt på den udstedende brugers session.
- **Kort- eller langvarige** – vælg en TTL fra 60 sekunder til 10 år.

Tokens signeres med den samme applikationshemmelighed (`SECRET_KEY`) og kontrolleres ved hver forespørgsel: signatur, udløb, `wid`-claim-match og tilbagekaldelsesstatus. Se [Eksekveringstokens](./execution-tokens.md) for opsætning og API-reference.

## Indholdssikkerhed

Brug [Guardrails](./guardrails.md) på LLM- og Agent-noder til at blokere usikre eller politik-krænkende brugermeddelelser, før de når modellen. Guardrails understøtter ni indholdskategorier (vold, hadefuld tale, seksuelt indhold osv.) med konfigurerbare følsomhedsniveauer.

## Python Tool Sandbox

Brugerdefinerede Python-værktøjer på [Agent-noden](../nodes/agent-node.md) eksekverer upålidelig kode. Som standard kører Heym hvert værktøj i en forstærket, engangs-Docker-container med:

- ingen netværksadgang,
- et skrivebeskyttet root-filsystem med et lille `tmpfs`-arbejdsbibliotek,
- en ikke-root-bruger med alle Linux-capabilities droppet og `no-new-privileges`,
- strenge CPU-, hukommelses- og PID-begrænsninger, og
- **ingen Docker-socket** monteret, så et værktøj ikke kan nå hostens Docker-daemon.

Eksekverings-backend styres af miljøvariablen `HEYM_PYTHON_TOOL_SANDBOX`:

| Værdi | Adfærd |
|-------|----------|
| `auto` (standard) | Kør i den forstærkede Docker-container. Hvis Docker ikke er tilgængelig, **fejler eksekveringen lukket** – den kører ikke upålidelig kode uden OS-isolation i stilhed. |
| `docker` | Samme som `auto`, men falder aldrig tilbage. |
| `subprocess` | Kør i en lokal in-proces subproces beskyttet af en import-whitelist. Dette er **ikke en sikkerhedsbarriere** og er kun beregnet til pålidelig kode eller lokal udvikling. `run.sh` vælger dette til native dev. |

Sæt `HEYM_PYTHON_TOOL_IMAGE` for at fastgøre sandbox-billedet; når det er tomt, detekterer Heym automatisk det kørende backend-billede. De in-proces-begrænsninger (en import-whitelist plus attribut- og introspektionsfiltrering) anvendes som defense in depth, men containeren er den rigtige isolationsbarriere – behold standardtilstanden `auto` (eller `docker`) til multi-user- og produktionsinstallationer.
## Skill Sandbox

Python-skills, der er tilknyttet en [Agent node](../nodes/agent-node.md), kører også ikke-pålidelig kode - en skill kan ankomme ordret i et delt workflow eller en skabelon med synlighed 'everyone' - så skills kører gennem den **samme** `HEYM_PYTHON_TOOL_SANDBOX`-switch som Python-værktøjer og fejler på samme lukkede måde. Skill-containeren er hærdede identisk (non-root, alle kapabiliteter fjernet, `no-new-privileges`, read-only root-filsystem, CPU/hukommelse/PID-begrænsninger, og **ingen Docker-socket**), med to bevidste forskelle, da skills legitimt har brug for dem:

- **Netværksadgang tillades** (skills kalder API'er og installerer deres egne afhængigheder via `uv`), og
- **et skrivbart workspace monteres**, så skills kan generere outputfiler og læse Heym Drive-filer.

Workspace'et deles med den engangs-container gennem det samme navngivne Docker-volume, som Codex-runneren bruger (`heym-codex-workspaces`, monteret på `/app/data/codex-workspaces`). Kun denne kørsels egen undermappe monteres ind i containeren - via en per-run `volume-subpath` - så en skill aldrig ser en anden kørsels eller Codex's workspace-data. Docker Compose-stakken monterer altid dette volume; den enkelte container `docker run` skal inkludere `-v heym-codex-workspaces:/app/data/codex-workspaces` for Python-skills samt Codex. Hvis volumen mangler i `auto`/`docker`-tilstand, **fejler skill-udførelsen lukket** i stedet for at køre i backend'en. Da per-run subpath-montering kræver **Docker Engine 25.0 eller nyere**, bør ældre engines enten opgradere eller køre pålidelige skills med `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Kun ikke-hemmelige, portable miljøvariabler (proxy- og CA-bundle-indstillinger, locale) videresendes til containeren; database-URL'er, `SECRET_KEY`/`ENCRYPTION_KEY`, provider-API-nøgler og OAuth-hemmeligheder tilbageholdes via en tilladelsesliste. Skill-filstier valideres for at forblive i workspace'et, og symlinks i outputmappen (inklusive `_hitl_request.json`-sentinel) følges aldrig. Standardindstillingerne kan tilsidesættes med `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` og `HEYM_SKILL_USER` hvis nødvendigt.

Som med værktøjer kører `subprocess`-tilstanden skill'en i backend-processen og er **ikke en sikkerhedsgrænse** - brug den kun til pålidelig single-user eller lokal udvikling (`run.sh` vælger den til native dev).

## Code Node Sandbox

[Code node](../nodes/code-node.md) kører vilkårlig bruger-Python sammen med vilkårlige tredjepartsafhængigheder, så den er den strengeste af de tre sandkasser og den eneste **uden flugtvej**: den læser ingen sandkasse-tilstandsvariabel, har ingen `subprocess`-tilstand og fejler lukket, når ingen Docker-daemon er tilgængelig. Den falder aldrig tilbage til at køre brugerkode i backend-processen.

Udførelsen er en eller to engangs-containere, begge hærdede som tool- og skill-sandkasserne (non-root, alle kapabiliteter fjernet, `no-new-privileges`, read-only root-filsystem, CPU/hukommelse/PID-begrænsninger, og **ingen Docker-socket**):

- Med en tom `requirements.txt` kører koden i en **enkelt container med `--network none`**. Runneren ankommer i containeren's stdin-payload, så intet monteres overhovedet.
- Med afhængigheder installerer en første container dem med netværksadgang i en per-run `.deps`-mappe, og en anden container monterer den undermappe **read-only** og kører koden. Udførelsescontaineren har ikke netværk, medmindre node'ens `codeAllowNetwork`-option er slået til.

Afhængigheder installeres med `uv`, genprøves med `pip` og caches aldrig mellem kørsler. Når backend'en kører i en container, ligger per-run-mappen på det samme `heym-codex-workspaces`-volume, som skill-sandkassen bruger, monteret gennem en per-run `volume-subpath`, så en kørsel aldrig ser en andens filer; denne form kræver **Docker Engine 25.0 eller nyere**. En native backend (`./run.sh`) har ikke sådan et volume og har ikke brug for et - dens per-run-mappe er en lokal midlertidig sti, der bind-mountes direkte ind i containeren. Uanset hvad slettes mappen efter hver udførelse uanset resultat.

Kun ikke-hemmelige, portable miljøvariabler videresendes til containerne - proxy-indstillinger, CA-bundles og locale, som afhængighedsinstallationen har brug for for at nå PyPI bag en virksomhedsproxy. Database-URL'er, `SECRET_KEY`/`ENCRYPTION_KEY`, provider-API-nøgler og OAuth-hemmeligheder tilbageholdes via en tilladelsesliste, så en ny backend-hemmelighed droppes som standard i stedet for at lækkes, indtil nogen opdaterer en afvisningsliste. Backend'ens `HOME` tilsidesætter aldrig sandkassens egen skrivbare sti.

**Format**-knappen bruger den samme sandkasse. Ruff parser og omskriver kilden i stedet for at eksekvere den, men at køre den på backend-værten ville give en ikke-pålidelig fil en proces, der arver hele backend'ens miljø, så den får sin egen engangs-container med `--network none` med de samme begrænsninger og samme tilladelsesliste for miljøet. Den fejler lukket uden Docker i stedet for at formatere på værten.

Sandkassebegrænsninger er konstanter snarere end miljøvariabler - 512 MB hukommelse, én CPU, 256 processer, en 120-sekunders installations-timeout og en 60-sekunders udførelsestimeout. Image'et løses fra den eksisterende `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`-kæde; noden introducerer ingen egen konfiguration.
## Relateret

- [Kørsel & Deployment](../getting-started/running-and-deployment.md) – Konfiguration af `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` og `HEYM_PYTHON_TOOL_SANDBOX` ved opstart
- [Code Node](../nodes/code-node.md) – Sandboxed Python-udførelse med egne afhængigheder
- [Agent Node](../nodes/agent-node.md) – Brugerdefinerede Python-værktøjer, der kører i sandkassen
- [Execution Tokens](./execution-tokens.md) – Scopede JWTs til kald af workflows fra eksterne systemer
- [Guardrails](./guardrails.md) – Bloker usikker indhold i LLM- og Agent-noder
- [Indstillinger](./user-settings.md) – Ændring af adgangskode
- [Legitimationsoplysninger-fanen](../tabs/credentials-tab.md) – Håndtering af API-nøgler
- [MCP-fanen](../tabs/mcp-tab.md) – MCP API-nøgle og OAuth-klienter
- [Portal](./portal.md) – Kontrol af adgang til offentlig chatportal
