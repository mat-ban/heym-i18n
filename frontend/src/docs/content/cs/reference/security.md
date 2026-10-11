# Zabezpečení

Bezpečnostní postupy a konfigurace pro platformu Heym.

## Zásady hesel

Všechna hesla – při registraci i při změně hesla – musí splňovat tyto požadavky:

| Pravidlo | Požadavek |
|------|-------------|
| Minimální délka | 8 znaků |
| Velká písmena | Alespoň jedno velké písmeno (A–Z) |
| Malá písmena | Alespoň jedno malé písmeno (a–z) |
| Číslice | Alespoň jedno číslo (0–9) |

Tato pravidla jsou vynucována jak na frontendu, tak na backendu (validátor Pydantic). Požadavek s nevyhovujícím heslem je odmítnut s odpovědí `422 Unprocessable Entity` ještě před zápisem do databáze.

**Příklad platného hesla:** `MyWorkflow7!`

## Správa relací

- Přístupové tokeny jsou uloženy v **HttpOnly** cookies, nikoli v `localStorage`. Tím je zabráněno tomu, aby JavaScript (včetně XSS payloadů) mohl token přečíst.
- Refresh token je omezen na cestu `/api/auth/refresh` a nelze jej odeslat na jiné endpointy.
- Každé volání `/api/auth/refresh` **rotuje** refresh token: starý token je okamžitě zneplatněn a je vydán nový. Opětovné použití již použitého refresh tokenu vrací `401`.

## Omezení rychlosti

Následující endpointy mají omezenou rychlost podle IP adresy:

| Endpoint | Limit | Doba zablokování |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 požadavků / 60 s | 15 min |
| `POST /api/auth/register` | 5 požadavků / 60 s | 10 min |
| `POST /register` (OAuth klienti) | 5 požadavků / 60 s | 10 min |
| Přihlášení do portálu | 3 pokusy | 24 h |

Pokud je nakonfigurována proměnná `REDIS_URL`, jsou limity rychlosti sdíleny mezi všemi backendovými workery. Bez ní platí limity pro každý proces workeru zvlášť.

## Šifrování přihlašovacích údajů

Všechny API klíče, webhook URL a bearer tokeny uložené v panelu [Credentials](../tabs/credentials-tab.md) jsou před zápisem do databáze šifrovány v klidovém stavu pomocí AES-256 (Fernet). Klíč je odvozen z proměnné prostředí `ENCRYPTION_KEY`. Skripty `run.sh` a `deploy.sh` automaticky vygenerují silnou hodnotu, pokud je prázdná; aplikace odmítne spuštění, pokud je `ENCRYPTION_KEY` prázdný nebo ponechán na známé zástupné hodnotě.

## MCP API klíč

MCP API klíč se používá k autentizaci externích MCP klientů připojujících se k endpointu `/api/mcp/sse`. Po navázání SSE spojení je vydán krátkodobý (1 hodina) session token, který je vložen do URL endpointu pro zprávy místo skutečného API klíče, čímž se zabrání tomu, aby se klíč objevil v přístupových logech serveru. Nastavení naleznete v [MCP Tab](../tabs/mcp-tab.md).

## OAuth / PKCE

Autorizační server OAuth 2.0 (používaný pro MCP klienty) podporuje pouze grant `authorization_code` s PKCE (`S256`). Souhlasný formulář používá CSRF tokeny HMAC-SHA256 platné 10 minut. Všechny hodnoty zobrazené na stránce souhlasu jsou HTML-escapovány.

## Execution tokeny

[Execution tokeny](./execution-tokens.md) jsou omezené JWT pro volání execute endpointu workflow z externích systémů. Na rozdíl od tokenů uživatelských relací jsou:

- **Omezené na jedno workflow** – token je odmítnut pro jakékoli jiné workflow.
- **Nezávisle odvolatelné** – odvolání tokenu nemá žádný vliv na relaci uživatele, který jej vydal.
- **Krátkodobé nebo dlouhodobé** – zvolte TTL od 60 sekund do 10 let.

Tokeny jsou podepisovány stejným aplikačním tajemstvím (`SECRET_KEY`) a kontrolovány při každém požadavku: podpis, platnost, shoda claimu `wid` a stav odvolání. Nastavení a API referenci naleznete v [Execution Tokens](./execution-tokens.md).

## Bezpečnost obsahu

Použijte [Guardrails](./guardrails.md) na uzlech LLM a Agent pro zablokování nebezpečných nebo zásady porušujících uživatelských zpráv ještě předtím, než se dostanou k modelu. Guardrails podporují devět kategorií obsahu (násilí, nenávistné projevy, sexuální obsah atd.) s konfigurovatelnými úrovněmi citlivosti.

## Sandbox pro Python nástroje

Uživatelem definované Python nástroje na [uzlu Agent](../nodes/agent-node.md) spouštějí nedůvěryhodný kód. Ve výchozím nastavení Heym spouští každý nástroj uvnitř zabezpečeného, jednorázového Docker kontejneru s:

- žádným přístupem k síti,
- souborovým systémem pouze pro čtení s malým pracovním adresářem `tmpfs`,
- uživatelem bez oprávnění root se všemi odstraněnými Linux capabilities a `no-new-privileges`,
- přísnými limity CPU, paměti a PID a
- **žádným připojeným Docker socketem**, takže nástroj nemůže dosáhnout na hostitelský Docker daemon.

Backend provádění je řízen proměnnou prostředí `HEYM_PYTHON_TOOL_SANDBOX`:

| Hodnota | Chování |
|-------|----------|
| `auto` (výchozí) | Spustit v zabezpečeném Docker kontejneru. Pokud Docker není dostupný, provádění **selže bezpečně** – nespustí tiše nedůvěryhodný kód bez izolace OS. |
| `docker` | Stejné jako `auto`, ale nikdy nepoužije fallback. |
| `subprocess` | Spustit v lokálním podprocesu v rámci procesu chráněném allowlistem importů. Toto **není bezpečnostní hranice** a je určeno pouze pro důvěryhodný kód nebo lokální vývoj. `run.sh` jej volí pro nativní vývoj. |

Nastavte `HEYM_PYTHON_TOOL_IMAGE` pro připnutí image sandboxu; pokud je prázdná, Heym automaticky detekuje běžící backendovou image. Omezení v rámci procesu (allowlist importů plus filtrování atributů a introspekce) jsou aplikována jako obrana do hloubky, ale skutečnou izolační hranicí je kontejner – pro víceuživatelská a produkční nasazení ponechte výchozí režim `auto` (nebo `docker`).
## Sandbox pro skilly

Python skilly připojené k [uzlu Agent](../nodes/agent-node.md) také spouštějí nedůvěryhodný kód — skill může dorazit v nezměněné podobě uvnitř sdíleného workflow nebo šablony s viditelností `everyone` — proto skilly procházejí **stejným** přepínačem `HEYM_PYTHON_TOOL_SANDBOX` jako Python nástroje a při selhání se chovají stejně (fail closed). Kontejner pro skilly je zabezpečen identicky (ne-root, všechna oprávnění odebrána, `no-new-privileges`, root filesystem pouze pro čtení, limity CPU/paměti/PID a **žádný Docker socket**), se dvěma záměrnými odchylkami, protože je skilly legitimně potřebují:

- **Síťový výstup je povolen** (skilly volají API a instalují si vlastní závislosti přes `uv`) a
- **je připojen zapisovatelný workspace**, aby skilly mohly generovat výstupní soubory a číst soubory z Heym Drive.

Workspace je sdílen s dočasným sourozeneckým kontejnerem prostřednictvím stejného pojmenovaného Docker volume, který používá Codex runner (`heym-codex-workspaces`, připojený na `/app/data/codex-workspaces`). Do sourozeneckého kontejneru je připojen pouze podadresář tohoto konkrétního běhu — pomocí `volume-subpath` pro daný běh — takže jeden skill nikdy nevidí data workspace jiného běhu ani Codexu. Docker Compose stack tento volume připojuje vždy; při spuštění jednoho kontejneru přes `docker run` je nutné uvést `-v heym-codex-workspaces:/app/data/codex-workspaces` jak pro Python skilly, tak pro Codex. Pokud volume v režimu `auto`/`docker` chybí, spuštění skillu **selže (fail closed)**, místo aby běželo v backendu. Protože připojení podcest pro jednotlivé běhy vyžadují **Docker Engine 25.0 nebo novější**, starší engine by měly buď upgradovat, nebo spouštět důvěryhodné skilly s `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Do kontejneru se předávají pouze ne-tajné, přenositelné proměnné prostředí (nastavení proxy a CA-bundle, locale); databázové URL, `SECRET_KEY`/`ENCRYPTION_KEY`, API klíče poskytovatelů a OAuth tajemství jsou zadržena pomocí allowlistu. Cesty k souborům skillů jsou validovány tak, aby zůstaly uvnitř workspace, a symbolické odkazy umístěné ve výstupním adresáři (včetně sentinelu `_hitl_request.json`) se nikdy nenásledují. Výchozí hodnoty lze v případě potřeby přepsat pomocí `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` a `HEYM_SKILL_USER`.

Stejně jako u nástrojů platí, že režim `subprocess` spouští skill v procesu backendu a **není bezpečnostní hranicí** — používejte jej pouze pro důvěryhodné jednouživatelské nebo lokální vývojové prostředí (`run.sh` jej volí pro nativní vývoj).

## Sandbox pro uzel Code

[Uzel Code](../nodes/code-node.md) spouští libovolný uživatelský Python spolu s libovolnými závislostmi třetích stran, takže je nejpřísnější ze všech tří sandboxů a jediný, který **nemá žádnou únikovou cestu**: nečte žádnou proměnnou režimu sandboxu, nemá režim `subprocess` a při nedostupnosti Docker daemonu selže (fail closed). Nikdy nespadne zpět na spouštění uživatelského kódu v procesu backendu.

Spuštění probíhá v jednom nebo dvou dočasných kontejnerech, oba zabezpečené stejně jako sandboxy pro nástroje a skilly (ne-root, všechna oprávnění odebrána, `no-new-privileges`, root filesystem pouze pro čtení, limity CPU/paměti/PID a **žádný Docker socket**):

- Při prázdném `requirements.txt` spouští kód **jeden kontejner s `--network none`**. Runner přichází v stdin payloadu kontejneru, takže není připojeno vůbec nic.
- Při závislostech je první kontejner nainstaluje se síťovým přístupem do adresáře `.deps` pro daný běh a druhý kontejner připojí tento podstrom **pouze pro čtení** a spustí kód. Spouštěcí kontejner nemá síť, pokud není zapnuta volba `codeAllowNetwork` daného uzlu.

Závislosti se instalují přes `uv`, s opakováním přes `pip`, a nikdy se mezi běhy nekešují. Když backend běží v kontejneru, adresář pro daný běh žije na stejném volume `heym-codex-workspaces`, který používá sandbox pro skilly, připojeném přes `volume-subpath` pro daný běh, takže jeden běh nikdy nevidí soubory jiného; tato forma vyžaduje **Docker Engine 25.0 nebo novější**. Nativní backend (`./run.sh`) takový volume nemá a nepotřebuje jej — jeho adresář pro daný běh je lokální dočasná cesta bind-mountovaná přímo do sourozeneckého kontejneru. V obou případech se adresář po každém spuštění smaže bez ohledu na výsledek.

Do kontejnerů se předávají pouze ne-tajné, přenositelné proměnné prostředí — nastavení proxy, CA bundle a locale, které instalace závislostí potřebuje pro přístup k PyPI za podnikovým proxy. Databázové URL, `SECRET_KEY`/`ENCRYPTION_KEY`, API klíče poskytovatelů a OAuth tajemství jsou zadržena pomocí allowlistu, takže nové tajemství backendu je ve výchozím stavu vynecháno, místo aby uniklo, dokud někdo neaktualizuje denylist. Proměnná `HOME` backendu nikdy nepřepíše vlastní zapisovatelnou cestu sandboxu.

Tlačítko **Format** používá stejný sandbox. Ruff zdrojový kód parsuje a přepisuje, nikoli spouští, ale jeho spuštění na hostiteli backendu by nedůvěryhodnému souboru předalo proces, který dědí celé prostředí backendu, proto dostává vlastní dočasný kontejner s `--network none` se stejnými limity a stejným allowlistovaným prostředím. Bez Dockeru selže (fail closed), místo aby formátoval na hostiteli.

Limity sandboxu jsou konstanty, nikoli proměnné prostředí — 512 MB paměti, jedno CPU, 256 procesů, 120sekundový timeout instalace a 60sekundový timeout spuštění. Image se řeší z existujícího řetězce `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`; uzel sám o sobě nezavádí žádnou vlastní konfiguraci.
## Související

- [Spouštění a nasazení](../getting-started/running-and-deployment.md) – Konfigurace `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` a `HEYM_PYTHON_TOOL_SANDBOX` při spuštění
- [Uzel Code](../nodes/code-node.md) – Spouštění Pythonu v sandboxu s vlastními závislostmi
- [Uzel Agent](../nodes/agent-node.md) – Vlastní Python nástroje spouštěné v sandboxu
- [Execution Tokens](./execution-tokens.md) – Scoped JWT pro volání workflow z externích systémů
- [Guardrails](./guardrails.md) – Blokování nebezpečného obsahu v uzlech LLM a Agent
- [Nastavení](./user-settings.md) – Změna hesla
- [Záložka Credentials](../tabs/credentials-tab.md) – Správa API klíčů
- [Záložka MCP](../tabs/mcp-tab.md) – MCP API klíč a OAuth klienti
- [Portál](./portal.md) – Řízení přístupu k veřejnému chat portálu
