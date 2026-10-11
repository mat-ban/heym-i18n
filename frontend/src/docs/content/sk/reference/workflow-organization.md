# Organizácia workflowov

Heym vám umožňuje organizovať workflowy do priečinkov, vytvárať podpriečinky a plánovať workflowy na vymazanie. Pre prehľad rozhrania si pozrite [kartu Workflowy](../tabs/workflows-tab.md).

## Priečinky a podpriečinky

Priečinky tvoria strom. Každý priečinok má:

- **Názov** – Zobrazovaný názov
- **Nadradený priečinok** – `parent_id` odkazuje na iný priečinok; `null` znamená koreň
- **Workflowy** – Workflowy je možné presúvať do priečinkov prostredníctvom `folder_id`

### API

| Endpoint | Účel |
|----------|---------|
| `GET /folders` | Iba koreňové priečinky |
| `GET /folders/tree` | Celý strom (podriadené položky + workflowy) |
| `GET /folders/{id}` | Jeden priečinok s obsahom |
| `POST /folders` | Vytvorenie priečinka (`parent_id` voliteľné) |
| `PUT /folders/{id}` | Aktualizácia názvu alebo `parent_id` |
| `DELETE /folders/{id}` | Vymazanie priečinka (kaskádové) |
| `PUT /folders/{folder_id}/workflows/{workflow_id}` | Presun workflowu do priečinka |
| `DELETE /folders/workflows/{workflow_id}/folder` | Odstránenie workflowu z priečinka |
| `GET /folders/{id}/export` | Stiahnutie priečinka + všetkých podpriečinkov ako ZIP |

### Štruktúra stromu

Odpoveď stromu obsahuje `children` a `workflows` pre každý priečinok. Zdieľané workflowy sa môžu zobraziť v priečinku prostredníctvom `WorkflowShare.folder_id`.

## Zdieľanie workflowov

V editore workflowu otvorte **Share** a pozvite používateľov e-mailom alebo zdieľajte s [tímom](./teams.md). Každá pozvánka a každé zdieľanie s tímom nesie oprávnenie:

| Oprávnenie | Čo môže spolupracovník robiť |
|------------|------------------------------|
| **Read** | Otvoriť workflow, prezerať ho, zobraziť históriu spustení a spustiť ho. Editor sa otvorí v režime iba na čítanie: Uloženie je zakázané a plátno nie je možné meniť. |
| **Write** | Všetko, čo umožňuje Read, plus úprava plátna, nastavení, dokumentu analýzy a pamäte agenta. |

Oprávnenie sa zobrazuje pri každom zázname v dialógovom okne Share a je možné ho kedykoľvek zmeniť z tohto rozbaľovacieho zoznamu bez odstránenia a opätovného pridania zdieľania. Ak sa používateľ dostane k workflowu viacerými cestami (priame zdieľanie a jeden alebo viac tímov), vyhráva **najvyššie** oprávnenie. Zdieľania, ktoré existovali pred zavedením oprávnení, majú **Write**, a API klienti, ktorí vynechajú `permission`, tiež získajú **Write**.

Akcie vyhradené vlastníkovi nikdy nezávisia od oprávnenia: vymazanie workflowu, vrátenie alebo vymazanie verzií, vymazanie histórie, správa zdieľaní a [nastavenia vyhradené vlastníkovi](#nastavenia-vyhradené-vlastníkovi) nižšie zostávajú vlastníkovi aj pri spolupracovníkoch s **Write**. Spolupracovník s **Read**, ktorý odošle úpravu prostredníctvom API (`PUT /api/workflows/{id}`, poznámka analýzy, pamäť agenta, vymazanie vyrovnávacej pamäte) alebo prostredníctvom AI asistenta, dostane `403` s hlásením `You have read-only access to this workflow`.

Zdieľanie workflowu poskytuje prístup k plátnu, histórii spustení a dokumentu analýzy. **Nezdieľa** automaticky:

- **Prihlasovacie údaje** odkazované uzlami vo workflowe
- **Podworkflowy** volané uzlami [Execute](../nodes/execute-node.md) alebo agentmi

Príjemcovia potrebujú tieto prihlasovacie údaje a podriadené workflowy zdieľané samostatne (rovnakí používatelia alebo tímy). Prihlasovacie údaje zdieľajte z [karty Prihlasovacie údaje](../tabs/credentials-tab.md); pozrite si [Zdieľanie prihlasovacích údajov](./credentials-sharing.md). Každý podworkflow zdieľajte z dialógového okna zdieľania jeho vlastného editora.

### Nastavenia vyhradené vlastníkovi

Celá konfigurácia **Run with cURL** zostáva po zdieľaní vlastníkovi. Spolupracovníci stále otvárajú dialógové okno a kopírujú vygenerovaný príkaz, ale ovládacie prvky sú iba na čítanie.

Zmena ktoréhokoľvek z týchto nastavení zo strany ne-vlastníka je zamietnutá s `403`:

- **Authentication** (`auth_type`) a **Header Key** (`auth_header_key`)
- Režim **Request Body** (`webhook_body_mode`) a **Request Method** (`http_method`)
- **Response Cache** (`cache_ttl_seconds`) a **Rate Limit** (`rate_limit_requests`, `rate_limit_window_seconds`)
- **SSE Streaming** (`sse_enabled`, `sse_node_config`)

**Header Value** (`auth_header_value`) sa správa odlišne: je pred spolupracovníkmi úplne skrytá a zápis spolupracovníka je ignorovaný namiesto zamietnutia. Editor vykresľuje pole maskované, takže `403` by tam narušil bežné uloženie namiesto signalizácie útoku.

Dôvodom, prečo je blok vyhradený vlastníkovi, je autentifikácia: `Anonymous` umožňuje nespracovaným volajúcim spustiť workflow a spustenie bez prihláseného volajúceho vyhodnocuje prihlasovacie údaje a globálne premenné ako **vlastník**, nie ako volajúci. Zvyšok bloku je publikovaný kontrakt požiadavky a vlastníkove ovládanie nákladov, takže sa presúva spolu s ním.

**On error, run workflow** (`error_workflow_id`) v paneli **Properties** na úrovni workflowu je vyhradený vlastníkovi z rovnakého dôvodu: [error workflow](./features.md#error-workflow) sa spúšťa s prihlasovacími údajmi a globálnymi premennými zlyhaného spustenia, ktoré pri spusteniach vyvolaných triggerom a anonymných spusteniach patria vlastníkovi. Spolupracovníci vidia nastavenie iba na čítanie a pridanie, nahradenie alebo vymazanie zo strany ne-vlastníka je zamietnuté s `403`.

Úprava plátna, názvu a popisu nie je ovplyvnená.

### Spúšťacie tokeny

Spolupracovník môže vytvoriť spúšťací token pre workflow, ktorý je s ním zdieľaný. Spustenie sa pripisuje **tomu, kto token vytvoril**, takže používa prihlasovacie údaje a globálne premenné tohto používateľa, nie vlastníka. Iba skutočne anonymné volanie — `auth_type: anonymous` bez volajúceho — sa spúšťa v kontexte vlastníka.

## Naplánované na vymazanie

Workflowy je možné naplánovať na vymazanie namiesto okamžitého odstránenia.

- **Pole**: `scheduled_for_deletion` (nullable datetime)
- **Správanie**: Po nastavení sa workflow presunie do `folder_id = null` a zobrazí sa v sekcii „Scheduled for Deletion".
### API

| Endpoint | Účel |
|----------|---------|
| `PUT /workflows/{id}/schedule-deletion` | Nastaví `scheduled_for_deletion`, vymaže `folder_id` |
| `DELETE /workflows/{id}/schedule-deletion` | Vymaže `scheduled_for_deletion` (obnovenie) |

### UI

- **Presunutie do koša potiahnutím** – Presuňte workflowy do oblasti „Naplánované na vymazanie" a naplánujte ich vymazanie
- **Obnoviť** – Odstráni z plánu vymazania
- **Vymazať okamžite** – Ikona koša pre trvalé odstránenie

### Logika čistenia

Cron job sa spúšťa denne o **23:59** (v nakonfigurovanom časovom pásme). Workflow sa vymaže len vtedy, keď:

- **Všetky vstupné uzly** (uzly bez prichádzajúcich hrán, s výnimkou sticky/errorHandler) majú `active === false`

Ak je niektorý vstupný uzol stále aktívny, workflow zostane až do ďalšieho spustenia.

## Dashboard UI

- **Riadky priečinkov** – Nový priečinok, rekurzívny strom priečinkov s rozbalením/zbalením. Každý priečinok nesie
  voliteľný popis pod svojím názvom a odznak s počtom workflowov, ktoré obsahuje, vrátane
  podpriečinkov.
- **Akcie priečinka** – Nový podpriečinok, Premenovať, Zmeniť ikonu, Stiahnuť ako ZIP a Vymazať sa nachádzajú priamo
  na každom riadku priečinka; kontextové menu po kliknutí pravým tlačidlom ponúka rovnakú sadu a telefóny zobrazujú jediné
  tlačidlo menu.
- **Hlavná oblasť** – Koreňové workflowy (bez priečinka, nenaplánované) a Naplánované na vymazanie
- **Náhľad presunu do priečinka** – Potiahnutie workflowu zvýrazní presný priečinok alebo podpriečinok a
  zobrazí jeho úplnú cestu v náhľade veľkosti karty. Zbalený priečinok sa po krátkom podržaní rozbalí.
- **Stabilná spätná väzba pri presune** – Zdrojová karta používa drag ghost a aktívny cieľ presunu zostáva
  vybraný počas posúvania alebo prechodu cez ovládacie prvky v tom istom priečinku.
- **Kontrola cieľa** – Aktuálny priečinok sa zobrazuje ako **Already in Folder** a neprijme
  nadbytočné presunutie.
- **Ďalšie zóny presunu** – Koreň a „Naplánované na vymazanie" sa zvýraznia, keď môžu prijať
  presúvaný workflow.
- **Presun ZIP** – Presuňte ZIP súbor do oblasti workflowov a importujte štruktúru priečinkov na koreňovej úrovni

## Súvisiace

- [Karta Workflows](../tabs/workflows-tab.md) – Vytváranie a správa workflowov
- [Zdieľanie prihlasovacích údajov](./credentials-sharing.md) – Zdieľanie prihlasovacích údajov so spolupracovníkmi na workflowe
- [Tímy](./teams.md) – Zdieľanie workflowov a prihlasovacích údajov s tímami
- [Základné koncepty](../getting-started/core-concepts.md) – Workflowy, uzly a spúšťanie
- [Štruktúra workflowu](./workflow-structure.md) – JSON formát pre workflowy
- [Triggers](./triggers.md) – Vstupné uzly a vstupné body
