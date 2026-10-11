# Biztonság

A Heym platform biztonsági gyakorlatai és konfigurációja.

## Jelszóházirend

Minden jelszónak — a regisztráció során és a jelszó módosításakor is — meg kell felelnie az alábbi követelményeknek:

| Szabály | Követelmény |
|------|-------------|
| Minimális hossz | 8 karakter |
| Nagybetű | Legalább egy nagybetű (A–Z) |
| Kisbetű | Legalább egy kisbetű (a–z) |
| Számjegy | Legalább egy szám (0–9) |

Ezeket a szabályokat a frontend és a backend (Pydantic validator) egyaránt érvényesíti. A nem megfelelő jelszót tartalmazó kérést a rendszer `422 Unprocessable Entity` válasszal utasítja el, mielőtt bármilyen adatbázis-írás megtörténne.

**Példa érvényes jelszóra:** `MyWorkflow7!`

## Munkamenet-kezelés

- Az access tokenek **HttpOnly** cookie-kban tárolódnak, nem `localStorage`-ban. Ez megakadályozza, hogy a JavaScript (beleértve az XSS payloadokat is) hozzáférjen a tokenhez.
- A refresh token hatóköre a `/api/auth/refresh` útvonalra korlátozódik, és nem küldhető el más endpointokra.
- Minden `/api/auth/refresh` hívás **rotálja** a refresh tokent: a régi token azonnal visszavonásra kerül, és egy új kerül kiadásra. Egy már felhasznált refresh token újbóli elküldése `401` választ eredményez.

## Kéréskorlátozás (Rate Limiting)

Az alábbi endpointok IP-címenként kéréskorlátozás alá esnek:

| Endpoint | Korlát | Tiltás időtartama |
|----------|-------|--------------|
| `POST /api/auth/login` | 10 kérés / 60 s | 15 perc |
| `POST /api/auth/register` | 5 kérés / 60 s | 10 perc |
| `POST /register` (OAuth kliensek) | 5 kérés / 60 s | 10 perc |
| Portal bejelentkezés | 3 kísérlet | 24 óra |

Ha a `REDIS_URL` konfigurálva van, a kéréskorlátok az összes backend worker között megosztottak. Enélkül a korlátok worker folyamatonként érvényesek.

## Hitelesítési adatok titkosítása

Minden API-kulcs, webhook URL és bearer token, amely a [Hitelesítési adatok](../tabs/credentials-tab.md) panelen tárolódik, AES-256 (Fernet) titkosítással védett a tárolás során, mielőtt az adatbázisba íródna. A kulcs az `ENCRYPTION_KEY` környezeti változóból származik. A `run.sh` és `deploy.sh` szkriptek automatikusan erős értéket generálnak, ha az üres; az alkalmazás megtagadja az indulást, ha az `ENCRYPTION_KEY` üres vagy egy ismert placeholder értéken maradt.

## MCP API-kulcs

Az MCP API-kulcs a `/api/mcp/sse` endpointra csatlakozó külső MCP kliensek hitelesítésére szolgál. Az SSE kapcsolat létrejöttekor egy rövid élettartamú (1 órás) munkamenet-token kerül kiadásra, amely a valódi API-kulcs helyett a message endpoint URL-be ágyazódik, megakadályozva, hogy a kulcs megjelenjen a szerver hozzáférési naplóiban. A beállításról lásd az [MCP fület](../tabs/mcp-tab.md).

## OAuth / PKCE

Az OAuth 2.0 engedélyezési szerver (amelyet MCP kliensek használnak) kizárólag az `authorization_code` grant típust támogatja PKCE-vel (`S256`). A hozzájárulási űrlap HMAC-SHA256 CSRF tokeneket használ, amelyek 10 percig érvényesek. A hozzájárulási oldalon megjelenített összes érték HTML-escape-elt.

## Execution tokenek

Az [execution tokenek](./execution-tokens.md) olyan hatókörrel rendelkező JWT-k, amelyek egy workflow execute endpointjának külső rendszerekből történő meghívására szolgálnak. A felhasználói munkamenet-tokenekkel ellentétben ezek:

- **Egyetlen workflow-ra korlátozottak** — a token bármely más workflow esetében elutasításra kerül.
- **Önállóan visszavonhatók** — egy token visszavonása nincs hatással a kibocsátó felhasználó munkamenetére.
- **Rövid vagy hosszú élettartamúak** — a TTL 60 másodperctől 10 évig választható.

A tokenek ugyanazzal az alkalmazás-titokkal (`SECRET_KEY`) kerülnek aláírásra, és minden kérésnél ellenőrzésre kerülnek: aláírás, lejárat, `wid` claim egyezés és visszavonási állapot. A beállításról és az API-referenciáról lásd az [Execution Tokens](./execution-tokens.md) oldalt.

## Tartalombiztonság

Használjon [Guardrails](./guardrails.md) szabályokat az LLM és Agent csomópontokon, hogy blokkolja a nem biztonságos vagy a szabályzatot sértő felhasználói üzeneteket, mielőtt azok elérnék a modellt. A Guardrails kilenc tartalomkategóriát támogat (erőszak, gyűlöletbeszéd, szexuális tartalom stb.), konfigurálható érzékenységi szintekkel.

## Python eszköz sandbox

Az [Agent csomóponton](../nodes/agent-node.md) található felhasználó által definiált Python eszközök nem megbízható kódot futtatnak. Alapértelmezés szerint a Heym minden eszközt egy megerősített, eldobható Docker konténerben futtat, a következő jellemzőkkel:

- nincs hálózati hozzáférés,
- csak olvasható gyökér fájlrendszer egy kis `tmpfs` munkakönyvtárral,
- nem root felhasználó, minden Linux capability elvéve és `no-new-privileges` beállítva,
- szigorú CPU-, memória- és PID-korlátok, valamint
- **nincs Docker socket** csatolva, így az eszköz nem érheti el a gazdagép Docker daemonját.

A végrehajtási backendet a `HEYM_PYTHON_TOOL_SANDBOX` környezeti változó vezérli:

| Érték | Viselkedés |
|-------|----------|
| `auto` (alapértelmezett) | Futtatás a megerősített Docker konténerben. Ha a Docker nem elérhető, a végrehajtás **fail closed** módon viselkedik — nem futtat csendben nem megbízható kódot operációs rendszer szintű izoláció nélkül. |
| `docker` | Ugyanaz, mint az `auto`, de soha nem esik vissza más módra. |
| `subprocess` | Futtatás egy helyi, folyamaton belüli subprocessben, amelyet egy import allowlist véd. Ez **nem biztonsági határvonal**, és kizárólag megbízható kódhoz vagy helyi fejlesztéshez használható. A `run.sh` ezt választja natív fejlesztéshez. |

Állítsa be a `HEYM_PYTHON_TOOL_IMAGE` változót a sandbox image rögzítéséhez; ha üres, a Heym automatikusan felismeri a futó backend image-et. A folyamaton belüli korlátozások (egy import allowlist, valamint attribútum- és introspekciós szűrés) védelemként rétegződnek, de a valódi izolációs határvonal a konténer — tartsa meg az alapértelmezett `auto` (vagy `docker`) módot többfelhasználós és éles környezetekben.
## Skill Sandbox

Az [Agent csomóponthoz](../nodes/agent-node.md) csatolt Python skillek szintén nem megbízható kódot futtatnak — egy skill szó szerint érkezhet egy megosztott workflow-ból vagy egy `everyone` láthatóságú sablonból —, ezért a skillek ugyanazon a `HEYM_PYTHON_TOOL_SANDBOX` kapcsolón keresztül futnak, mint a Python eszközök, és ugyanúgy fail closed módon viselkednek. A skill konténer ugyanúgy meg van erősítve (non-root, minden capability eltávolítva, `no-new-privileges`, írásvédett root fájlrendszer, CPU/memória/PID limitek, és **nincs Docker socket**), két szándékos eltéréssel, mert a skilleknek jogszerűen szükségük van rájuk:

- **A hálózati kimenő forgalom engedélyezett** (a skillek API-kat hívnak és saját függőségeket telepítenek `uv` segítségével), és
- **egy írható workspace van csatolva**, hogy a skillek kimeneti fájlokat generálhassanak és Heym Drive fájlokat olvashassanak.

A workspace a Codex runner által használt ugyanazon elnevezett Docker volume-on (`heym-codex-workspaces`, `/app/data/codex-workspaces` pontra csatolva) keresztül osztozik az eldobható testvérkonténerrel. A testvérbe csak az adott futtatás saját alkönyvtára van csatolva — futtatásonkénti `volume-subpath` segítségével —, így egy skill soha nem látja egy másik futtatás vagy a Codex workspace-adatait. A Docker Compose stack mindig csatolja ezt a volume-ot; az egykonténeres `docker run` esetén a `-v heym-codex-workspaces:/app/data/codex-workspaces` kapcsolót a Python skillekhez éppúgy meg kell adni, mint a Codexhez. Ha a volume hiányzik `auto`/`docker` módban, a skill végrehajtása **fail closed** módon meghiúsul, ahelyett hogy a backendben futna. Mivel a futtatásonkénti subpath csatolásokhoz **Docker Engine 25.0 vagy újabb** szükséges, a régebbi engine-ek esetében vagy frissíteni kell, vagy a megbízható skilleket `HEYM_PYTHON_TOOL_SANDBOX=subprocess` beállítással kell futtatni.

Csak nem titkos, hordozható környezeti változók (proxy- és CA-bundle beállítások, locale) kerülnek továbbításra a konténerbe; az adatbázis URL-ek, a `SECRET_KEY`/`ENCRYPTION_KEY`, a szolgáltatói API kulcsok és az OAuth titkok egy allowlist segítségével vissza vannak tartva. A skill fájlútvonalak ellenőrzésre kerülnek, hogy a workspace-en belül maradjanak, és a kimeneti könyvtárba telepített symlinkek (beleértve a `_hitl_request.json` sentinelt) soha nem kerülnek követésre. Szükség esetén írja felül az alapértékeket a `HEYM_SKILL_IMAGE`, `HEYM_SKILL_NETWORK`, `HEYM_SKILL_MEMORY`, `HEYM_SKILL_CPUS`, `HEYM_SKILL_PIDS` és `HEYM_SKILL_USER` változókkal.

Az eszközökhöz hasonlóan a `subprocess` mód a skillt a backend folyamatában futtatja, és **nem jelent biztonsági határt** — kizárólag megbízható egyfelhasználós vagy helyi fejlesztési környezetben használja (`run.sh` ezt választja natív fejlesztéshez).

## Code Node Sandbox

A [Code csomópont](../nodes/code-node.md) tetszőleges felhasználói Python kódot futtat tetszőleges harmadik féltől származó függőségekkel együtt, ezért ez a három sandbox közül a legszigorúbb, és az egyetlen, amelynek **nincs menekülési útvonala**: nem olvas semmilyen sandbox-mód változót, nincs `subprocess` módja, és fail closed módon viselkedik, ha nem érhető el Docker daemon. Soha nem esik vissza arra, hogy a felhasználói kódot a backend folyamatában futtassa.

A végrehajtás egy vagy két eldobható konténerben történik, mindkettő ugyanúgy meg van erősítve, mint az eszköz- és skill sandboxok (non-root, minden capability eltávolítva, `no-new-privileges`, írásvédett root fájlrendszer, CPU/memória/PID limitek, és **nincs Docker socket**):

- Üres `requirements.txt` esetén egy **`--network none` beállítású egyetlen konténer** futtatja a kódot. A runner a konténer stdin payloadjában érkezik, így semmi sincs csatolva.
- Függőségek esetén egy első konténer hálózati hozzáféréssel telepíti azokat egy futtatásonkénti `.deps` könyvtárba, majd egy második konténer ezt az alkönyvtárat **írásvédetten** csatolja és futtatja a kódot. A végrehajtó konténernek nincs hálózata, kivéve ha a csomópont `codeAllowNetwork` opciója be van kapcsolva.

A függőségek `uv` segítségével telepítésre kerülnek, `pip`-pel újrapróbálásra, és futtatások között soha nem kerülnek gyorsítótárazásra. Amikor a backend konténerben fut, a futtatásonkénti könyvtár ugyanazon a `heym-codex-workspaces` volume-on található, amelyet a skill sandbox használ, futtatásonkénti `volume-subpath` segítségével csatolva, így egy futtatás soha nem látja egy másik fájljait; ez a forma **Docker Engine 25.0 vagy újabb** verziót igényel. Egy natív backend (`./run.sh`) esetében nincs ilyen volume, és nincs is rá szükség — a futtatásonkénti könyvtár egy helyi ideiglenes útvonal, amely közvetlenül a testvérbe van bind-mountolva. Mindkét esetben a könyvtár minden végrehajtás után törlésre kerül, az eredménytől függetlenül.

Csak nem titkos, hordozható környezeti változók kerülnek továbbításra a konténerekbe — proxy-beállítások, CA bundle-ök és locale, amelyekre a függőségtelepítésnek szüksége van ahhoz, hogy vállalati proxy mögül elérje a PyPI-t. Az adatbázis URL-ek, a `SECRET_KEY`/`ENCRYPTION_KEY`, a szolgáltatói API kulcsok és az OAuth titkok egy allowlist segítségével vissza vannak tartva, így egy új backend titok alapértelmezés szerint kimarad, ahelyett hogy kiszivárogna, amíg valaki frissíti a denylistet. A backend `HOME` változója soha nem írja felül a sandbox saját írható útvonalát.

A **Format** gomb ugyanezt a sandboxot használja. A Ruff elemzi és átírja a forráskódot ahelyett hogy végrehajtaná, de a backend hoston való futtatása egy nem megbízható fájlnak olyan folyamatot adna, amely örökli a backend teljes környezetét, ezért saját eldobható `--network none` konténert kap ugyanazokkal a limitekkel és ugyanazzal az allowlistelt környezettel. Docker nélkül fail closed módon viselkedik, ahelyett hogy a hoston formázna.

A sandbox limitek konstansok, nem környezeti változók — 512 MB memória, egy CPU, 256 folyamat, 120 másodperces telepítési időtúllépés és 60 másodperces végrehajtási időtúllépés. A image a meglévő `HEYM_PYTHON_TOOL_IMAGE` / `HEYM_CODEX_DOCKER_IMAGE` láncból kerül feloldásra; a csomópont nem vezet be saját konfigurációt.
## Kapcsolódó témák

- [Futtatás és telepítés](../getting-started/running-and-deployment.md) – A `SECRET_KEY`, `ENCRYPTION_KEY`, `ALLOW_REGISTER` és `HEYM_PYTHON_TOOL_SANDBOX` beállítása indításkor
- [Code csomópont](../nodes/code-node.md) – Sandboxolt Python-végrehajtás saját függőségekkel
- [Agent csomópont](../nodes/agent-node.md) – Egyedi Python-eszközök, amelyek a sandboxban futnak
- [Execution Tokenek](./execution-tokens.md) – Hatókörrel rendelkező JWT-k a workflow-k külső rendszerekből történő meghívásához
- [Guardrails](./guardrails.md) – Nem biztonságos tartalom blokkolása az LLM és Agent csomópontokban
- [Beállítások](./user-settings.md) – Jelszó módosítása
- [Hitelesítési adatok lap](../tabs/credentials-tab.md) – API-kulcsok kezelése
- [MCP lap](../tabs/mcp-tab.md) – MCP API-kulcs és OAuth kliensek
- [Portál](./portal.md) – Nyilvános chat portál hozzáférés-vezérlése
