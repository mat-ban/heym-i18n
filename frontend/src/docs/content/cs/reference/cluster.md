# Rozložení zátěže

Nasměrujte druhou instanci Heymu na stejnou databázi PostgreSQL a připojí se jako worker. Běh workflow na pozadí se pak mezi instancemi rozděluje podle procent, která nastavíte, takže stroj obsluhující UI a API není zároveň jediným strojem, který spouští všechny workflow.

Instance spolu nikdy nekomunikují. Práci přenáší Postgres, takže worker nepotřebuje žádný otevřený port, žádný certifikát ani žádnou cestu zpět k hlavní instanci — pouze přístup k databázi.

## Role

Jedna instance je **main**, určená proměnnou prostředí. Obsluhuje UI, API, MCP a chat portál a vlastní úložiště souborů a nainstalované pluginy. Každá další instance je **worker**: dosáhne pouze na databázi a spouští běhy na pozadí.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

Role main je oddělená od volby leadera. Heym již volí jednoho leadera napříč clusterem, který vlastní cron, vyhodnocování výstrah a obnovu po pádu; pokud main spadne, vedení se během několika sekund přesune na workera a plánované běhy se dál spouštějí. Role main se nepřesouvá, protože úložiště souborů s ní nemůže cestovat.

## Co může opustit hlavní instanci

Umístění se rozhoduje podle uzlů workflow před spuštěním běhu. Běh zůstává na main, když některý jeho uzel — včetně uzlů uvnitř podřízených workflow, které volá — sahá na něco, co existuje jen na jednom stroji:

| Uzel | Proč zůstává na main |
|---|---|
| Codex, OpenCode Go | Pracovní prostor coding-agenta zůstává na lokálním disku, aby v něm mohl navazující běh pokračovat |
| Agent s připojeným skillem | Kód skillu čte a zapisuje do Heym Drive |
| Drive, Converter, Google Drive | Čtou a zapisují generované soubory |
| Trigger File Upload | Nahrání přistane na disku main |
| Send Email | Firemní SMTP relaye obvykle povolují jednu zdrojovou adresu |
| Uzly pluginů | Plugin je nainstalovaný na disku jedné instance |

**Vše ostatní se distribuuje** — včetně uzlu Code, Playwright a Python nástrojů Agenta. Každá instance spouští stejný image s vlastním Docker socketem, takže sandbox není důvodem držet běh na main, a to jsou uzly s nejvyšší spotřebou CPU v produktu.

Workflow, jehož podřízené workflow je vybráno výrazem, nelze předem prozkoumat, a proto zůstává na main.

## Volba procent

Váhy jsou celá čísla nastavená v **Settings → Instances**. Jsou to **podíly z těch instancí, které aktuálně mohou přijmout práci**, nikoli procenta ze 100: scheduler dělí vlastním součtem tohoto poolu.

Tento rozdíl se projeví, jakmile jedna instance vypadne. Při `Main 41, Worker A 26, Worker B 33` ponechá vypnutí Worker B pool o velikosti 67, takže Main skutečně dostane 41/67 = **61 %** a Worker A 26/67 = **39 %**. Panel zobrazuje efektivní rozdělení pod tabulkou právě z tohoto důvodu a uložení není nikdy blokováno proto, že čísla nedávají 100 — odmítnuto je pouze rozdělení, v němž žádná povolená instance nemá váhu.

Dvě další věci lze snadno pochopit špatně.

**Procento není podíl na výkonu stroje.** Pokrývá pouze běhy, které procházejí frontou. Obsluha UI a API, streamování běhů editoru a portálu a zpracování nahrávaných souborů jsou práce main a nic z toho se nepočítá. Main dělá více, než říká jeho číslo.

**Procento main je strop, nikoli podlaha.** Běhy, které mohou běžet pouze na main, se účtují proti jeho kvótě, takže jakmile je tato kvóta vyčerpána, zbývající distribuovatelné běhy připadnou workerům. Nastavit číslo main nízko je bezpečné — práce, která tam musí běžet, tam stále poběží. Nastavit ho vysoko vyhladoví workery.

Takže při silném main a menším workeru začněte blíže 60/40 než surovému poměru strojů a poté porovnejte skutečné doby běhů na kartě Traces a upravte.

Váhy se renormalizují napříč instancemi, které jsou aktuálně live a povolené. Při `main=70, A=15, B=15`, pokud A přejde offline, rozdělení se změní na 70/85 a 15/85 mezi main a B, a vrátí se na 70/15/15, když se A vrátí.

**Instance, která se vrátí, nemá nárok na běhy, které zmeškala.** Čas strávený ve stavu Offline, Disabled nebo na neodpovídající verzi se jí nepočítá, takže worker, který stráví noc nedostupný, se znovu připojí na aktuální pozici poolu a rozdělení od jeho prvního běhu opět ukazuje 70/30 — neabsorbuje všechny běhy, dokud se nedohoní. Worker, který byl dostupný celou dobu, se stále dohání, což je to, co dělá z procenta main strop.

### Nová instance se připojuje na nule

Instance, které nikdy nebyla přidělena váha, začíná na 0, což by ji nechalo Live, Enabled a nepřijímající nic. **Give new instances a share automatically** — ve výchozím stavu zapnuto, pod tabulkou instancí — to řeší: při dalším průchodu leadera dostane nováček rovný podíl poolu a stávající váhy se úměrně zmenší se zachováním vzájemných poměrů, takže záměrné 70/30 se i poté čte zhruba jako 70/30. Součet zůstává přesně 100.

Toto proběhne **jednou za instanci**. Automatický průchod i vaše vlastní úprava označí instanci jako nakonfigurovanou, takže instance, kterou nastavíte sami, se nikdy nezmění za vašimi zády — včetně té, kterou jste záměrně nastavili na 0. Toto nastavení vypněte, pokud raději chcete, aby každý nový stroj čekal na vás.

Účastní se pouze povolené, live a kompatibilní instance. Přidělit podíl stroji, který nemůže nic spouštět, by tento podíl uvízl.
### Kdy procenta nepomohou

Panel nastavení uvádí, kolik z běhů za posledních 24 hodin bylo možné spustit pouze na main. Pokud je toto číslo vysoké — zátěž silně závislá na Codexu nebo Drive — budou workeři nečinně sedět, ať váhy říkají cokoli, a řešením je větší instance main, nikoli jejich větší počet.

## Dimenzování PostgreSQL pro cluster

Počet připojení roste s počtem instancí, nejen s počtem uživatelů. Každá instance spouští několik procesů uvicorn a každý proces drží fond připojení plus čtyři připojení `LISTEN` (zrušení, probuzení fronty, výsledky běhů, chat streamy). Otevřené chat streamy sdílejí jedno chat připojení, takže nepřidávají databázová připojení. Cluster se třemi instancemi při výchozím `max_connections = 100` narazí na limit a Heym se pak nedokáže připojit ke své vlastní databázi.

Počítejte přibližně s `instances x processes x (async pool + sync pool + 4)` a nastavte `max_connections` nad touto hodnotou.

Zmenšete fondy, místo abyste pouze zvyšovali strop. Jedno nasazení má výchozí hodnoty 10+20 async a 5+10 sync připojení na proces, což je pro jeden stroj štědré a pro cluster až příliš mnoho:

| Proměnná | Jedna instance | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Ukázkový compose soubor nastavuje tyto hodnoty a `max_connections = 300`. Tím se u clusteru se dvěma instancemi sníží strop ze 768 připojení na 192, přičemž tři instance zůstávají pod 300.

## Požadavky, které za Vás cluster nemůže vynutit

**Každá instance musí používat stejný `SECRET_KEY` a `ENCRYPTION_KEY`.** Worker s odlišným `ENCRYPTION_KEY` nedokáže dešifrovat přihlašovací údaje a každý běh, který je používá, selže s chybou, jež nepojmenuje nic užitečného. Heym při každém heartbeatu porovnává digest obou klíčů spolu s verzí aplikace a revizí databáze a označí neodpovídající instanci jako **Mismatch**, takže nedostane žádnou práci. Zátěž se do té doby vrací na main.

To také určuje pořadí upgradu. Upgrade main jako první označí každého workera za nekompatibilního; práce se vrátí na main a každý worker se znovu připojí, jakmile je upgradován. Pomalejší, viditelné a vratné.

**Nasměrujte ingress pouze na instanci main.** Rozkládání uživatelského provozu round-robinem mezi instancemi by odeslalo nahrání souboru na jeden stroj a jeho stažení na jiný. Nic v kódu tomu nezabraňuje, protože worker spouští stejný image a odpoví na jakýkoli požadavek, který obdrží.

**Každá instance potřebuje `FRONTEND_URL` nastavenou na stejnou veřejnou adresu.** Běh, který se pozastaví kvůli lidské kontrole, vytváří svůj odkaz pro kontrolu na instanci, která jej vykonala, nikoli na main, a totéž platí pro následné odkazy Codexu a pro URL ke stažení generovaných souborů. Worker bez této hodnoty sestavuje tyto odkazy proti své vlastní lokální adrese a ten, kdo některý obdrží, jej nedokáže otevřít.

**Worker instance mají odlišnou odchozí IP.** Každé API, které povoluje zdrojové adresy, uvidí tu novou. Send Email běží na main právě z tohoto důvodu; pro uzel HTTP buď přidělte clusteru jednu NAT egress adresu, nebo povolte každou instanci.

## Přidání workera na jiný stroj

`docker-compose.worker.yml` v kořeni repozitáře spouští workera na jeho vlastním hostiteli. Nemá databázi ani UI: připojuje se k PostgreSQL instance main a bere si svůj podíl běhů na pozadí.

Vyplňte `.env` vedle něj — tag image, hostitele databáze a přihlašovací údaje, oba klíče a id instance — a spusťte jej. Compose odmítne startovat, dokud není nastavena každá povinná hodnota, místo aby naběhl se zástupnou hodnotou, která později selže způsobem, jenž se těžko čte.

Tag image musí odpovídat verzi, kterou spouští main, a oba klíče musí být zkopírovány přesně. Rozdíl v kterémkoli z nich zobrazí workera jako Mismatch a ten nedostane žádnou práci.

## Čtení tabulky Instances

| Sloupec | Význam |
|---|---|
| Name | Upravitelný popisek; otiskuje se na každý běh, který tato instance vykoná |
| Role | `main` nebo `worker`, podle prostředí |
| Status | **Live** s čerstvým heartbeatem, **Offline** po 30 sekundách ticha, **Mismatch**, když se verze, revize databáze nebo klíče liší od main |
| ms | Doba odezvy z dané instance do databáze, měřená samotnou instancí |
| On | Vyřadí workera z rotace, aniž by jej zastavil — běžící spuštění dokončí, žádná nová mu nebudou přidělena. U instance main je uzamčeno na zapnuto: práce se soubory, pluginy a coding agenty na ní běží bez ohledu na přepínač |
| Weight | Jeho podíl na distribuovatelných bězích |

## Limity souběhu v clusteru

[Limit souběhu](./webhooks.md#concurrency-limit-and-queued-runs) workflow se počítá v PostgreSQL, takže platí napříč všemi instancemi a všemi procesy: dvě instance nikdy nespustí více běhů jednoho workflow, než limit dovoluje. Běh, který čekal na volný slot, je při spuštění umístěn podle stejných pravidel jako jakýkoli jiný běh, takže běh vyžadující setrvání na main na něm zůstává. Worker fronty provádějící tyto běhy se nyní spouští při každé instalaci, včetně samostatné instance, kde zpracovává pouze běhy zařazené do fronty vlastní instancí. To znamená, že i samostatná instance udržuje v každém procesu probouzecí spojení `LISTEN`; dimenzujte proto její připojení stejně jako u clusterové instance.

## Historie spuštění

Každé spuštění v historii spuštění uvádí instanci, která je vykonala, a oba dialogy historie lze filtrovat na jednu instanci. Filtr porovnává id instance, zatímco zobrazuje její název, takže přejmenování instance nepřepíše, co uvádějí stará spuštění.

Nic z toho se neobjevuje u instalace s jednou instancí: pole jsou prázdná, žádný popisek se nezobrazuje a žádný filtr se nenabízí.
## Chování při selhání

**Pokud worker zemře během běhu**, jeho heartbeat zastará a stávající recovery sweep leadera znovu spustí dané spuštění na živé instanci. Řádek ve frontě, který si nárokoval, je vyřazen samostatně: jakmile pro něj neexistuje žádné aktivní spuštění a uplyne dvouminutová lhůta, leader řádek označí jako neúspěšný a probudí toho, kdo na výsledek čekal. Samotné stáří nikdy není triggerem, takže legitimně dlouhý běh zůstává nedotčen; a řádek je označen jako neúspěšný namísto opětovného zařazení do fronty, protože recovery už vlastní opětovné spuštění a opětovné zařazení by spustilo stejný workflow dvakrát.

**Pokud main spadne**, cron dál spouští úlohy z workera a distributovatelné běhy se dál vykonávají. Běhy, které vyžadují main, se řadí do fronty a čekají, a vyprázdní se, až se vrátí — ale pouze v rámci okna tolerance misfire (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, ve výchozím nastavení 600 sekund). Cokoli staršího je uzavřeno jako přeskočené, s zaznamenaným důvodem, namísto přehrání hodin nahromaděných úloh najednou.

UI, API, MCP a editor jsou po dobu výpadku mainu nedostupné, protože ingress směřuje tam.

## Související

- [Spouštění a nasazení](../getting-started/running-and-deployment.md) – Nejprve nasaďte jednu instanci; proměnné prostředí a nastavení klíčů najdete tam
- [Nastavení](./user-settings.md) – Záložka Instance a kdo ji může vidět
- [Spuštění](../tabs/traces-tab.md) – Před změnou rozdělení porovnejte skutečné doby běhů mezi instancemi
- [Zabezpečení](./security.md) – Proč musí každá instance sdílet `SECRET_KEY` a `ENCRYPTION_KEY`
