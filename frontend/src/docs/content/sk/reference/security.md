# Zabezpečenie

Bezpečnostné postupy a konfigurácia pre platformu Heym.

## Politika hesiel

Všetky heslá – pri registrácii aj pri zmene hesla – musia spĺňať tieto požiadavky:

| Pravidlo | Požiadavka |
|------|-------------|
| Minimálna dĺžka | 8 znakov |
| Veľké písmená | Aspoň jedno veľké písmeno (A–Z) |
| Malé písmená | Aspoň jedno malé písmeno (a–z) |
| Číslica | Aspoň jedno číslo (0–9) |

Tieto pravidlá sa vynucujú na frontende aj backende (validátor Pydantic). Požiadavka s nevyhovujúcim heslom je zamietnutá s odpoveďou `422 Unprocessable Entity` ešte pred akýmkoľvek zápisom do databázy.

**Príklad platného hesla:** `MyWorkflow7!`

## Správa relácií

- Prístupové tokeny sú uložené v **HttpOnly** cookies, nie v `localStorage`. Tým sa zabraňuje JavaScriptu (vrátane XSS payloadov) čítať token.
- Refresh token je obmedzený na cestu `/api/auth/refresh` a nemožno ho odoslať na iné endpointy.
- Každé volanie `/api/auth/refresh` **rotuje** refresh token: starý token je okamžite zneplatnený a je vydaný nový. Opätovné použitie už použitého refresh tokenu vráti `401`.

## Obmedzenie rýchlosti (Rate Limiting)

Nasledujúce endpointy majú obmedzenú rýchlosť na základe IP:

| Endpoint | Limit | Trvanie zákazu |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 pož. / 60 s | 15 min |
| `POST /api/auth/register` | 5 pož. / 60 s | 10 min |
| `POST /register` (OAuth klienti) | 5 pož. / 60 s | 10 min |
| Prihlásenie do portálu | 3 pokusy | 24 h |

Ak je nakonfigurovaná premenná `REDIS_URL`, limity rýchlosti sú zdieľané medzi všetkými backendovými workermi. Bez nej platia limity pre každý worker proces samostatne.

## Šifrovanie prihlasovacích údajov

Všetky API kľúče, webhook URL a bearer tokeny uložené v paneli [Prihlasovacie údaje](../tabs/credentials-tab.md) sú pri uložení šifrované pomocou AES-256 (Fernet) pred zápisom do databázy. Kľúč je odvodený z premennej prostredia `ENCRYPTION_KEY`. Skripty `run.sh` a `deploy.sh` automaticky vygenerujú silnú hodnotu, ak je prázdna; aplikácia odmietne štart, ak je `ENCRYPTION_KEY` prázdny alebo ponechaný na známej zástupnej hodnote.

## MCP API kľúč

MCP API kľúč sa používa na autentifikáciu externých MCP klientov pripájajúcich sa k endpointu `/api/mcp/sse`. Pri nadviazaní SSE spojenia je vydaný krátkodobý (1-hodinový) session token, ktorý je vložený do URL adresy endpointu správy namiesto skutočného API kľúča, čím sa zabraňuje tomu, aby sa kľúč objavil v prístupových logoch servera. Nastavenie nájdete v [MCP Tab](../tabs/mcp-tab.md).

## OAuth / PKCE

Autorizačný server OAuth 2.0 (používaný pre MCP klientov) podporuje iba grant `authorization_code` s PKCE (`S256`). Súhlasný formulár používa CSRF tokeny HMAC-SHA256 platné 10 minút. Všetky hodnoty zobrazené na súhlasnej stránke sú HTML-escaped.

## Execution tokeny

[Execution tokeny](./execution-tokens.md) sú scoped JWT na volanie execute endpointu workflowu z externých systémov. Na rozdiel od session tokenov používateľa sú:

- **Obmedzené na jeden workflow** — token je zamietnutý pre akýkoľvek iný workflow.
- **Nezávisle odvolateľné** — odvolanie tokenu nemá žiadny vplyv na reláciu používateľa, ktorý ho vydal.
- **Krátkodobé alebo dlhodobé** — vyberte TTL od 60 sekúnd do 10 rokov.

Tokeny sú podpísané rovnakým aplikačným tajomstvom (`SECRET_KEY`) a kontrolujú sa pri každej požiadavke: podpis, expirácia, zhoda claimu `wid` a stav odvolania. Nastavenie a API referenciu nájdete v [Execution Tokens](./execution-tokens.md).

## Bezpečnosť obsahu

Použite [Guardrails](./guardrails.md) na uzloch LLM a Agent na blokovanie nebezpečných alebo pravidlá porušujúcich používateľských správ predtým, než sa dostanú k modelu. Guardrails podporujú deväť kategórií obsahu (násilie, nenávistné prejavy, sexuálny obsah atď.) s konfigurovateľnými úrovňami citlivosti.

## Sandbox pre Python nástroje

Používateľom definované Python nástroje na [uzle Agent](../nodes/agent-node.md) spúšťajú nedôveryhodný kód. Štandardne Heym spúšťa každý nástroj v zabezpečenom, jednorazovom Docker kontajneri s:

- žiadnym prístupom k sieti,
- root filesystémom iba na čítanie s malým `tmpfs` pracovným adresárom,
- používateľom bez root oprávnení so všetkými odstránenými Linux capabilities a `no-new-privileges`,
- prísnymi limitmi CPU, pamäte a PID a
- **žiadnym pripojeným Docker socketom**, takže nástroj nemôže dosiahnuť hostiteľský Docker daemon.

Backend vykonávania je riadený premennou prostredia `HEYM_PYTHON_TOOL_SANDBOX`:

| Hodnota | Správanie |
|-------|----------|
| `auto` (predvolené) | Spustenie v zabezpečenom Docker kontajneri. Ak Docker nie je dostupný, vykonávanie **zlyhá bezpečne (fail closed)** — nespustí nedôveryhodný kód potichu bez izolácie OS. |
| `docker` | Rovnaké ako `auto`, ale nikdy neprepadá na záložnú možnosť. |
| `subprocess` | Spustenie v lokálnom in-process subprocesse chránenom allowlistom importov. Toto **nie je bezpečnostná hranica** a je určené iba pre dôveryhodný kód alebo lokálny vývoj. `run.sh` ho vyberá pre natívny vývoj. |

Nastavte `HEYM_PYTHON_TOOL_IMAGE` na pripnutie sandbox image; ak je prázdny, Heym automaticky deteguje bežiaci backend image. In-process obmedzenia (allowlist importov plus filtrovanie atribútov a introspekcie) sa aplikujú ako obrana do hĺbky, ale kontajner je skutočnou izolačnou hranicou — pre multi-user a produkčné nasadenia ponechajte predvolený režim `auto` (alebo `docker`).
## Sandbox pre schopnosti

Python schopnosti pripojené k [uzlu Agent](../nodes/agent-node.md) tiež spúšťajú nedôveryhodný kód — schopnosť môže prísť v nezmenenej podobe v zdieľanom workflow alebo v šablóne s viditeľnosťou `everyone` — preto schopnosti prechádzajú **rovnakým** prepínačom `HEYM_PYTHON_TOOL_SANDBOX` ako Python nástroje a pri zlyhaní sa rovnako uzavrú. Kontajner pre schopnosti je zabezpečený identicky (non-root, všetky oprávnenia odstránené, `no-new-privileges`, koreňový súborový systém len na čítanie, limity CPU/pamäte/PID a **žiadny Docker socket**), s dvomi zámernými rozdielmi, pretože schopnosti ich legitímne potrebujú:

- **Sieťový výstup je povolený** (schopnosti volajú API a inštalujú si vlastné závislosti cez `uv`) a
- **je pripojený zapisovateľný pracovný priestor**, aby schopnosti mohli generovať výstupné súbory a čítať súbory z Heym Drive.

Pracovný priestor je zdieľaný s dočasným súrodeným kontajnerom prostredníctvom rovnakého pomenovaného Docker volume, ktorý používa Codex runner (`heym-codex-workspaces`, pripojený na `/app/data/codex-workspaces`). Do súrodeného kontajnera je pripojený iba vlastný podadresár tohto spustenia — prostredníctvom `volume-subpath` pre konkrétne spustenie — takže jedna schopnosť nikdy nevidí dáta pracovného priestoru iného spustenia ani Codexu. Docker Compose stack vždy pripája tento volume; jednokontajnerový `docker run` musí obsahovať `-v heym-codex-workspaces:/app/data/codex-workspaces` pre Python schopnosti rovnako ako pre Codex. Ak volume v režime `auto`/`docker` chýba, spustenie schopnosti **zlyhá uzavretím**, namiesto spustenia v backendu. Keďže pripojenia podcesty pre konkrétne spustenie vyžadujú **Docker Engine 25.0 alebo novší**, staršie enginy by mali buď aktualizovať, alebo spúšťať dôveryhodné schopnosti s `HEYM_PYTHON_TOOL_SANDBOX=subprocess`.

Do kontajnera sa prenášajú iba nesecitlivé, prenosné premenné prostredia (nastavenia proxy a CA-bundle, locale); databázové URL, `SECRET_KEY`/`ENCRYPTION_KEY`, API kľúče poskytovateľov a OAuth tajomstvá sú zadržané pomocou allowlistu. Cesty k súborom schopností sú validované tak, aby zostali v rámci pracovného priestoru, a symbolické odkazy umiestnené vo výstupnom adresári (vrátane sentinelu `_hitl_request.json`) sa nikdy nenásledujú. Predvolené hodnoty môžete podľa potreby prepísať pomocou `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` a `HEYM_SKILL_USER`.

Rovnako ako pri nástrojoch, režim `subprocess` spúšťa schopnosť v procese backendu a **nie je bezpečnostnou hranicou** — používajte ho iba pre dôveryhodné jednoužívateľské alebo lokálne vývojové prostredie (`run.sh` ho vyberá pre natívny vývoj).

## Sandbox pre uzol Code

[Uzol Code](../nodes/code-node.md) spúšťa ľubovoľný používateľský Python spolu s ľubovoľnými závislosťami tretích strán, takže je najprísnejším z troch sandboxov a jediným, ktorý **nemá únikovú cestu**: nečíta žiadnu premennú režimu sandboxu, nemá režim `subprocess` a pri zlyhaní sa uzavrie, keď nie je dostupný žiadny Docker daemon. Nikdy sa nevráti k spúšťaniu používateľského kódu v procese backendu.

Spustenie predstavuje jeden alebo dva dočasné kontajnery, oba zabezpečené ako sandboxy pre nástroje a schopnosti (non-root, všetky oprávnenia odstránené, `no-new-privileges`, koreňový súborový systém len na čítanie, limity CPU/pamäte/PID a **žiadny Docker socket**):

- S prázdnym `requirements.txt` spúšťa kód **jeden kontajner s `--network none`**. Runner prichádza v stdin payload-e kontajnera, takže nie je pripojené vôbec nič.
- So závislosťami prvý kontajner nainštaluje závislosti so sieťovým prístupom do adresára `.deps` pre konkrétne spustenie a druhý kontajner pripojí tento podstrom **len na čítanie** a spustí kód. Vykonávací kontajner nemá sieť, pokiaľ nie je zapnutá možnosť `codeAllowNetwork` uzla.

Závislosti sa inštalujú pomocou `uv`, opakujú sa s `pip` a nikdy sa neukladajú do medzipamäte medzi spusteniami. Keď backend beží v kontajneri, adresár pre konkrétne spustenie sa nachádza na rovnakom volume `heym-codex-workspaces`, ktorý používa sandbox pre schopnosti, pripojenom prostredníctvom `volume-subpath` pre konkrétne spustenie, takže jedno spustenie nikdy nevidí súbory iného; táto forma vyžaduje **Docker Engine 25.0 alebo novší**. Natívny backend (`./run.sh`) takýto volume nemá a ani ho nepotrebuje — jeho adresár pre konkrétne spustenie je lokálna dočasná cesta bind-mountovaná priamo do súrodeného kontajnera. V oboch prípadoch sa adresár po každom spustení vymaže bez ohľadu na výsledok.

Do kontajnerov sa prenášajú iba nesecitlivé, prenosné premenné prostredia — nastavenia proxy, CA balíky a locale, ktoré inštalácia závislostí potrebuje na dosiahnutie PyPI za podnikovou proxy. Databázové URL, `SECRET_KEY`/`ENCRYPTION_KEY`, API kľúče poskytovateľov a OAuth tajomstvá sú zadržané pomocou allowlistu, takže nové tajomstvo backendu sa predvolene vynechá, namiesto toho, aby uniklo, kým niekto aktualizuje denylist. `HOME` backendu nikdy neprepíše vlastnú zapisovateľnú cestu sandboxu.

Tlačidlo **Format** používa rovnaký sandbox. Ruff parsuje a prepisuje zdrojový kód namiesto jeho spúšťania, ale jeho spustenie na hostiteľovi backendu by odovzdalo nedôveryhodnému súboru proces, ktorý dedí celé prostredie backendu, preto dostane vlastný dočasný kontajner `--network none` s rovnakými limitmi a rovnakým allowlistovaným prostredím. Pri zlyhaní sa uzavrie bez Dockeru, namiesto formátovania na hostiteľovi.

Limity sandboxu sú konštanty, nie premenné prostredia — 512 MB pamäte, jedno CPU, 256 procesov, 120-sekundový časový limit inštalácie a 60-sekundový časový limit spustenia. Image sa vyhodnocuje z existujúceho reťazca `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE`; uzol nezavádza žiadnu vlastnú konfiguráciu.
## Súvisiace

- [Spúšťanie a nasadenie](../getting-started/running-and-deployment.md) – Konfigurácia `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` a `HEYM_PYTHON_TOOL_SANDBOX` pri štarte
- [Uzol Kód](../nodes/code-node.md) – Spúšťanie Pythonu v sandboxe s vlastnými závislosťami
- [Uzol Agenta](../nodes/agent-node.md) – Vlastné Python nástroje, ktoré bežia v sandboxe
- [Spúšťacie tokeny](./execution-tokens.md) – Obmedzené JWT na volanie workflowov z externých systémov
- [Guardrails](./guardrails.md) – Blokovanie nebezpečného obsahu v uzloch LLM a Agenta
- [Nastavenia](./user-settings.md) – Zmena hesla
- [Karta Prihlasovacie údaje](../tabs/credentials-tab.md) – Správa API kľúčov
- [Karta MCP](../tabs/mcp-tab.md) – MCP API kľúč a OAuth klienti
- [Portál](./portal.md) – Riadenie prístupu k verejnému chat portálu
