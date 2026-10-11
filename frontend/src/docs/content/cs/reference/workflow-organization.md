# Organizace workflow

Heym vám umožňuje organizovat workflow do složek, vytvářet podsložky a plánovat workflow ke smazání. Přehled uživatelského rozhraní naleznete v části [Záložka Workflows](../tabs/workflows-tab.md).

## Složky a podsložky

Složky tvoří strom. Každá složka má:

- **Název** – Zobrazovaný název
- **Nadřazená složka** – `parent_id` odkazuje na jinou složku; `null` znamená kořen
- **Workflow** – Workflow lze přesouvat do složek pomocí `folder_id`

### API

| Endpoint | Účel |
|----------|---------|
| `GET /folders` | Pouze kořenové složky |
| `GET /folders/tree` | Celý strom (potomci + workflow) |
| `GET /folders/{id}` | Jednotlivá složka s obsahem |
| `POST /folders` | Vytvoření složky (`parent_id` volitelné) |
| `PUT /folders/{id}` | Aktualizace názvu nebo `parent_id` |
| `DELETE /folders/{id}` | Smazání složky (kaskádové) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Přesunutí workflow do složky |
| `DELETE /folders/workflows/{workflow_id}/folder` | Odebrání workflow ze složky |
| `GET /folders/{id}/export` | Stažení složky + všech podsložek jako ZIP |

### Struktura stromu

Odpověď stromu obsahuje pro každou složku `children` a `workflows`. Sdílená workflow se mohou ve složce objevit prostřednictvím `WorkflowShare.folder_id`.

## Sdílení workflow

Otevřete **Share** v editoru workflow a pozvěte uživatele e-mailem nebo sdílejte s [týmem](./teams.md). Každá pozvánka a každé sdílení s týmem nese oprávnění:

| Oprávnění | Co může spolupracovník dělat |
|------------|------------------------------|
| **Read** | Otevřít workflow, prohlédnout si jej, zobrazit historii spuštění a spustit jej. Editor se otevře v režimu pouze pro čtení: Uložení je zakázáno a canvas nelze měnit. |
| **Write** | Vše, co umožňuje Read, plus úprava canvasu, nastavení, analytického dokumentu a paměti agenta. |

Oprávnění se zobrazuje u každé položky v dialogu Share a lze jej kdykoli změnit z tohoto rozbalovacího seznamu, aniž by bylo nutné sdílení odebrat a znovu přidat. Pokud se uživatel dostane k workflow několika cestami (přímé sdílení a jeden nebo více týmů), vyhrává **nejvyšší** oprávnění. Sdílení, která existovala před zavedením oprávnění, mají **Write**, a API klienti, kteří vynechají `permission`, rovněž získají **Write**.

Akce vyhrazené vlastníkovi nikdy nezávisí na oprávnění: smazání workflow, vrácení nebo vymazání verzí, vymazání historie, správa sdílení a níže uvedená [nastavení vyhrazená vlastníkovi](#owner-only-settings) zůstávají vlastníkovi i pro spolupracovníky s **Write**. Spolupracovník s **Read**, který odešle úpravu prostřednictvím API (`PUT /api/workflows/{id}`, analytická poznámka, paměť agenta, vymazání cache) nebo prostřednictvím AI Assistant, obdrží `403` s `You have read-only access to this workflow`.

Sdílení workflow poskytuje přístup k canvasu, historii spuštění a analytickému dokumentu. **Nezahrnuje** automaticky sdílení:

- **Přihlašovacích údajů** odkazovaných uzly ve workflow
- **Dílčích workflow** volaných uzly [Execute](../nodes/execute-node.md) nebo agenty

Příjemci potřebují tyto přihlašovací údaje a dílčí workflow sdílené samostatně (se stejnými uživateli nebo týmy). Přihlašovací údaje sdílejte ze [záložky Přihlašovací údaje](../tabs/credentials-tab.md); viz [Sdílení přihlašovacích údajů](./credentials-sharing.md). Každé dílčí workflow sdílejte z dialogu sdílení v jeho vlastním editoru.

### Nastavení vyhrazená vlastníkovi

Celá konfigurace **Run with cURL** zůstává po sdílení vlastníkovi. Spolupracovníci stále otevírají dialog a kopírují vygenerovaný příkaz, ale ovládací prvky jsou pouze pro čtení.

Změna kterékoli z těchto položek ze strany jiné osoby než vlastníka je odmítnuta s `403`:

- **Authentication** (`auth_type`) a **Header Key** (`auth_header_key`)
- Režim **Request Body** (`webhook_body_mode`) a **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) a **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) se chová odlišně: je před spolupracovníky zcela skryta a zápis spolupracovníka je ignorován, nikoli odmítnut. Editor vykresluje toto pole maskované, takže `403` by zde narušilo běžné uložení, místo aby signalizovalo útok.

Důvodem, proč je tento blok vyhrazen vlastníkovi, je autentizace: `Anonymous` umožňuje neautentizovaným volajícím spustit workflow a spuštění bez přihlášeného volajícího řeší přihlašovací údaje a globální proměnné jako **vlastník**, nikoli jako volající. Zbytek bloku představuje publikovaný kontrakt požadavku a nákladové kontroly vlastníka, proto se přesouvá spolu s ním.

**On error, run workflow** (`error_workflow_id`) v panelu **Properties** na úrovni workflow je vyhrazeno vlastníkovi ze stejného důvodu: [error workflow](./features.md#error-workflow) se spouští s přihlašovacími údaji a globálními proměnnými neúspěšného spuštění, které u triggerovaných a anonymních spuštění patří vlastníkovi. Spolupracovníci vidí toto nastavení pouze pro čtení a přidání, nahrazení nebo vymazání ze strany jiné osoby než vlastníka je odmítnuto s `403`.

Úprava canvasu, názvu a popisu není ovlivněna.

### Spouštěcí tokeny

Spolupracovník může vytvořit spouštěcí token pro workflow, které je s ním sdíleno. Spuštění je připsáno **tomu, kdo token vytvořil**, takže používá přihlašovací údaje a globální proměnné tohoto uživatele, nikoli vlastníka. Pouze skutečně anonymní volání — `auth_type: anonymous` bez volajícího — se spouští v kontextu vlastníka.

## Plánováno ke smazání

Workflow lze naplánovat ke smazání, místo aby byla okamžitě odstraněna.

- **Pole**: `scheduled_for_deletion` (nullable datetime)
- **Chování**: Je-li nastaveno, workflow se přesune do `folder_id = null` a objeví se v sekci „Scheduled for Deletion".
### API

| Endpoint | Účel |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Nastaví `scheduled_for_deletion`, vymaže `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Vymaže `scheduled_for_deletion` (obnovení) |

### UI

- **Přetažení do koše** – Přetáhněte workflow do oblasti „Naplánováno ke smazání" a naplánujte jeho smazání
- **Obnovit** – Odebere z plánu smazání
- **Smazat okamžitě** – Ikona koše pro trvalé odstranění

### Logika čištění

Cron úloha se spouští denně v **23:59** (v nakonfigurovaném časovém pásmu). Workflow je smazáno pouze tehdy, když:

- **Všechny vstupní uzly** (uzly bez příchozích hran, s výjimkou sticky/errorHandler) mají `active === false`

Pokud je některý vstupní uzel stále aktivní, workflow zůstává až do dalšího spuštění.

## Dashboard UI

- **Řádky složek** – Nová složka, rekurzivní strom složek s rozbalením/sbalením. Každá složka nese
  volitelný popis pod svým názvem a odznak s počtem workflow, které obsahuje, včetně podsložek.
- **Akce složek** – Nová podsložka, Přejmenovat, Změnit ikonu, Stáhnout jako ZIP a Smazat jsou
  umístěny přímo na každém řádku složky; kontextová nabídka po kliknutí pravým tlačítkem nabízí
  stejnou sadu a na telefonech se zobrazuje jediné tlačítko nabídky.
- **Hlavní oblast** – Kořenové workflow (bez složky, nenaplánované) a Naplánováno ke smazání
- **Náhled při přetažení do složky** – Při přetažení workflow se zvýrazní přesná složka nebo
  podsložka a v náhledu o velikosti karty se zobrazí její úplná cesta. Sbalená složka se po krátkém
  podržení rozbalí.
- **Stabilní zpětná vazba při přetahování** – Zdrojová karta používá drag ghost a aktivní cíl
  přetažení zůstává vybrán při posouvání nebo přecházení přes ovládací prvky ve stejné složce.
- **Kontrola cíle** – Aktuální složka je zobrazena jako **Již ve složce** a nepřijme nadbytečné
  přesunutí.
- **Další zóny přetažení** – Kořen a „Naplánováno ke smazání" se zvýrazní, když mohou přijmout
  přetahované workflow.
- **Přetažení ZIP** – Přetáhněte soubor ZIP do oblasti workflow a importujte strukturu složek na
  kořenové úrovni

## Související

- [Záložka Workflows](../tabs/workflows-tab.md) – Vytváření a správa workflow
- [Sdílení přihlašovacích údajů](./credentials-sharing.md) – Sdílení přihlašovacích údajů se spolupracovníky na workflow
- [Týmy](./teams.md) – Sdílení workflow a přihlašovacích údajů s týmy
- [Základní koncepty](../getting-started/core-concepts.md) – Workflow, uzly a spuštění
- [Struktura workflow](./workflow-structure.md) – Formát JSON pro workflow
- [Triggers](./triggers.md) – Vstupní uzly a vstupní body
