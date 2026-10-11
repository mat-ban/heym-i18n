# Beveiliging

Beveiligingspraktijken en configuratie voor het Heym-platform.

## Wachtwoordbeleid

Alle wachtwoorden — bij registratie en bij het wijzigen van uw wachtwoord — moeten aan de volgende vereisten voldoen:

| Regel | Vereiste |
|------|-------------|
| Minimale lengte | 8 tekens |
| Hoofdletters | Ten minste één hoofdletter (A–Z) |
| Kleine letters | Ten minste één kleine letter (a–z) |
| Cijfer | Ten minste één cijfer (0–9) |

Deze regels worden zowel op de frontend als op de backend (Pydantic-validator) afgedwongen. Een verzoek met een niet-conform wachtwoord wordt geweigerd met een `422 Unprocessable Entity`-respons voordat enige databasewrite plaatsvindt.

**Voorbeeld van een geldig wachtwoord:** `MyWorkflow7!`

## Sessiebeheer

- Access tokens worden opgeslagen in **HttpOnly**-cookies, niet in `localStorage`. Dit voorkomt dat JavaScript (inclusief XSS-payloads) het token kan uitlezen.
- Het refresh token is beperkt tot het pad `/api/auth/refresh` en kan niet naar andere endpoints worden verzonden.
- Elke aanroep van `/api/auth/refresh` **roteert** het refresh token: het oude token wordt onmiddellijk ingetrokken en er wordt een nieuw token uitgegeven. Het opnieuw gebruiken van een reeds gebruikt refresh token levert een `401` op.

## Rate Limiting

De volgende endpoints zijn per IP aan rate limiting onderworpen:

| Endpoint | Limiet | Banduur |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 req / 60 s | 15 min |
| `POST /api/auth/register` | 5 req / 60 s | 10 min |
| `POST /register` (OAuth-clients) | 5 req / 60 s | 10 min |
| Portal-login | 3 pogingen | 24 u |

Wanneer `REDIS_URL` is geconfigureerd, worden rate limits gedeeld over alle backend-workers. Zonder deze configuratie gelden de limieten per worker-proces.

## Versleuteling van inloggegevens

Alle API-sleutels, webhook-URL's en bearer tokens die in het paneel [Inloggegevens](../tabs/credentials-tab.md) worden opgeslagen, worden at rest versleuteld met AES-256 (Fernet) voordat ze naar de database worden geschreven. De sleutel wordt afgeleid van de omgevingsvariabele `ENCRYPTION_KEY`. De scripts `run.sh` en `deploy.sh` genereren automatisch een sterke waarde wanneer deze leeg is; de applicatie weigert te starten als `ENCRYPTION_KEY` leeg is of op een bekende placeholder staat.

## MCP API-sleutel

De MCP API-sleutel wordt gebruikt om externe MCP-clients te authenticeren die verbinding maken met het endpoint `/api/mcp/sse`. Wanneer de SSE-verbinding tot stand is gebracht, wordt een kortlevend sessietoken (1 uur) uitgegeven en ingebed in de URL van het message-endpoint in plaats van de werkelijke API-sleutel, zodat de sleutel niet in server access logs verschijnt. Zie [MCP-tab](../tabs/mcp-tab.md) voor de configuratie.

## OAuth / PKCE

De OAuth 2.0-autorisatieserver (gebruikt voor MCP-clients) ondersteunt uitsluitend de `authorization_code`-grant met PKCE (`S256`). Het consent-formulier gebruikt HMAC-SHA256 CSRF-tokens die 10 minuten geldig zijn. Alle waarden die op de consent-pagina worden weergegeven, zijn HTML-escaped.

## Execution tokens

[Execution tokens](./execution-tokens.md) zijn gescopeerde JWT's voor het aanroepen van het execute-endpoint van een workflow vanuit externe systemen. In tegenstelling tot gebruiker-sessietokens zijn ze:

- **Beperkt tot één workflow** — een token wordt geweigerd voor elke andere workflow.
- **Onafhankelijk intrekbaar** — het intrekken van een token heeft geen invloed op de sessie van de uitgevende gebruiker.
- **Kort- of langlevend** — kies een TTL van 60 seconden tot 10 jaar.

Tokens worden ondertekend met hetzelfde applicatiegeheim (`SECRET_KEY`) en bij elk verzoek gecontroleerd: signature, expiry, overeenkomst van de `wid`-claim en intrekkingsstatus. Zie [Execution Tokens](./execution-tokens.md) voor de configuratie en API-referentie.

## Inhoudsveiligheid

Gebruik [Guardrails](./guardrails.md) op LLM- en Agent-knooppunten om onveilige of beleidsschendende gebruikersberichten te blokkeren voordat ze het model bereiken. Guardrails ondersteunen negen inhoudscategorieën (geweld, haatzaaiende uitlatingen, seksuele inhoud, enz.) met configureerbare gevoeligheidsniveaus.

## Python-tool-sandbox

Door gebruikers gedefinieerde Python-tools op het [Agent-knooppunt](../nodes/agent-node.md) voeren niet-vertrouwde code uit. Standaard voert Heym elke tool uit in een gehardende, wegwerpbare Docker-container met:

- geen netwerktoegang,
- een read-only root-bestandssysteem met een kleine `tmpfs`-werkmap,
- een non-root gebruiker waarbij alle Linux-capabilities zijn ingetrokken en `no-new-privileges` is ingesteld,
- strikte CPU-, geheugen- en PID-limieten, en
- **geen Docker-socket** gemount, zodat een tool de Docker-daemon van de host niet kan bereiken.

De uitvoeringsbackend wordt bepaald door de omgevingsvariabele `HEYM_PYTHON_TOOL_SANDBOX`:

| Waarde | Gedrag |
|-------|----------|
| `auto` (standaard) | Uitvoeren in de gehardende Docker-container. Als Docker niet beschikbaar is, **faalt de uitvoering gesloten** — er wordt niet stilzwijgend niet-vertrouwde code uitgevoerd zonder OS-isolatie. |
| `docker` | Hetzelfde als `auto`, maar zonder fallback. |
| `subprocess` | Uitvoeren in een lokaal in-process subproces dat wordt beschermd door een import-allowlist. Dit is **geen beveiligingsgrens** en is uitsluitend bedoeld voor vertrouwde code of lokale ontwikkeling. `run.sh` selecteert deze modus voor native ontwikkeling. |

Stel `HEYM_PYTHON_TOOL_IMAGE` in om de sandbox-image vast te pinnen; wanneer deze leeg is, detecteert Heym automatisch de actieve backend-image. De in-process beperkingen (een import-allowlist plus filtering van attributen en introspectie) worden toegepast als defense in depth, maar de container is de werkelijke isolatiegrens — behoud de standaardmodus `auto` (of `docker`) voor multiuser- en productie-implementaties.

## Skill-sandbox

Python-skills die aan een [Agent-knooppunt](../nodes/agent-node.md) zijn gekoppeld, voeren eveneens niet-vertrouwde code uit — een skill kan ongewijzigd meekomen in een gedeelde workflow of een template met zichtbaarheid `everyone` — waardoor skills via **dezelfde** schakelaar `HEYM_PYTHON_TOOL_SANDBOX` lopen als Python-tools en op dezelfde manier fail-closed reageren. De skill-container is identiek gehard (non-root, alle capabilities ingetrokken, `no-new-privileges`, een read-only root-bestandssysteem, CPU-/geheugen-/PID-limieten en **geen Docker-socket**), met twee bewuste verschillen omdat skills deze legitiem nodig hebben:

- **Netwerk-egress is toegestaan** (skills roepen API's aan en installeren hun eigen afhankelijkheden via `uv`), en
- **een beschrijfbare workspace wordt gemount**, zodat skills uitvoerbestanden kunnen genereren en Heym Drive-bestanden kunnen lezen.

De workspace wordt gedeeld met de tijdelijke zustercontainer via hetzelfde benoemde Docker-volume dat de Codex-runner gebruikt (`heym-codex-workspaces`, gemount op `/app/data/codex-workspaces`). Alleen de eigen submap van deze run wordt in de zustercontainer gemount — via een `volume-subpath` per run — zodat de ene skill nooit de workspace-gegevens van een andere run of van Codex ziet. De Docker Compose-stack mount dit volume altijd; de single-container `docker run` moet `-v heym-codex-workspaces:/app/data/codex-workspaces` opnemen voor zowel Python-skills als Codex. Als het volume ontbreekt in de modus `auto`/`docker`, **faalt** de skill-uitvoering **closed** in plaats van in de backend te draaien. Omdat subpath-mounts per run **Docker Engine 25.0 of nieuwer** vereisen, dienen oudere engines te upgraden of vertrouwde skills uit te voeren met `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Alleen niet-geheime, overdraagbare omgevingsvariabelen (proxy- en CA-bundle-instellingen, locale) worden naar de container doorgegeven; database-URL's, `SECRET_KEY`/`ENCRYPTION_KEY`, provider-API-sleutels en OAuth-secrets worden tegengehouden door een allowlist. Skill-bestandspaden worden gevalideerd zodat ze binnen de workspace blijven, en symlinks die in de uitvoermap zijn geplaatst (inclusief de sentinel `_hitl_request.json`) worden nooit gevolgd. Overschrijf de standaardwaarden indien nodig met `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` en `HEYM_SKILL_USER`.

Net als bij tools draait de modus `subprocess` de skill in het backend-proces en is deze **geen beveiligingsgrens** — gebruik deze uitsluitend voor vertrouwde single-user- of lokale ontwikkeling (`run.sh` selecteert deze voor native ontwikkeling).

## Code-knooppunt-sandbox

Het [Code-knooppunt](../nodes/code-node.md) voert willekeurige Python van de gebruiker uit, samen met willekeurige afhankelijkheden van derden, waardoor het de strengste van de drie sandboxes is en de enige **zonder ontsnappingsroute**: het leest geen enkele sandbox-modusvariabele, heeft geen `subprocess`-modus en faalt closed wanneer geen Docker-daemon bereikbaar is. Het valt nooit terug op het uitvoeren van gebruikerscode in het backend-proces.

De uitvoering bestaat uit één of twee tijdelijke containers, beide gehard zoals de tool- en skill-sandboxes (non-root, alle capabilities ingetrokken, `no-new-privileges`, een read-only root-bestandssysteem, CPU-/geheugen-/PID-limieten en **geen Docker-socket**):

- Met een lege `requirements.txt` draait een **enkele container met `--network none`** de code. De runner komt binnen via de stdin-payload van de container, dus er wordt helemaal niets gemount.
- Met afhankelijkheden installeert een eerste container deze met netwerktoegang in een `.deps`-map per run, en een tweede container mount die subboom **read-only** en voert de code uit. De uitvoeringscontainer heeft geen netwerk, tenzij de optie `codeAllowNetwork` van het knooppunt is ingeschakeld.

Afhankelijkheden worden geïnstalleerd met `uv`, opnieuw geprobeerd met `pip` en nooit tussen runs gecachet. Wanneer de backend in een container draait, bevindt de map per run zich op hetzelfde `heym-codex-workspaces`-volume dat de skill-sandbox gebruikt, gemount via een `volume-subpath` per run, zodat de ene run nooit de bestanden van een andere ziet; die vorm vereist **Docker Engine 25.0 of nieuwer**. Een native backend (`./run.sh`) heeft een dergelijk volume niet en heeft het ook niet nodig — de map per run is een lokaal tijdelijk pad dat rechtstreeks in de zustercontainer wordt bind-gemount. In beide gevallen wordt de map na elke uitvoering verwijderd, ongeacht de uitkomst.

Alleen niet-geheime, overdraagbare omgevingsvariabelen worden naar de containers doorgegeven — proxy-instellingen, CA-bundles en locale, die de afhankelijkheidsinstallatie nodig heeft om PyPI achter een bedrijfsproxy te bereiken. Database-URL's, `SECRET_KEY`/`ENCRYPTION_KEY`, provider-API-sleutels en OAuth-secrets worden tegengehouden door een allowlist, zodat een nieuw backend-secret standaard wordt weggelaten in plaats van te lekken totdat iemand een denylist bijwerkt. De `HOME` van de backend overschrijft nooit het eigen beschrijfbare pad van de sandbox.

De knop **Format** gebruikt dezelfde sandbox. Ruff parseert en herschrijft de broncode in plaats van deze uit te voeren, maar het draaien op de backend-host zou een niet-vertrouwd bestand een proces geven dat de volledige omgeving van de backend erft; daarom krijgt het een eigen tijdelijke `--network none`-container met dezelfde limieten en dezelfde allowlist-omgeving. Het faalt closed zonder Docker in plaats van op de host te formatteren.

Sandbox-limieten zijn constanten in plaats van omgevingsvariabelen — 512 MB geheugen, één CPU, 256 processen, een installatietime-out van 120 seconden en een uitvoeringstime-out van 60 seconden. De image wordt bepaald via de bestaande keten `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`; het knooppunt introduceert geen eigen configuratie.

## Gerelateerd

- [Uitvoeren & Deployment](../getting-started/running-and-deployment.md) – Configureer `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` en `HEYM_PYTHON_TOOL_SANDBOX` bij het opstarten
- [Code-knooppunt](../nodes/code-node.md) – Sandboxed Python-uitvoering met eigen afhankelijkheden
- [Agent-knooppunt](../nodes/agent-node.md) – Aangepaste Python-tools die in de sandbox worden uitgevoerd
- [Uitvoeringstokens](./execution-tokens.md) – Afgebakende JWT's voor het aanroepen van workflows vanuit externe systemen
- [Guardrails](./guardrails.md) – Blokkeer onveilige inhoud in LLM- en Agent-knooppunten
- [Instellingen](./user-settings.md) – Wijzig uw wachtwoord
- [Tabblad Referenties](../tabs/credentials-tab.md) – Beheer API-sleutels
- [Tabblad MCP](../tabs/mcp-tab.md) – MCP API-sleutel en OAuth-clients
- [Portaal](./portal.md) – Toegangsbeheer voor het openbare chatportaal
