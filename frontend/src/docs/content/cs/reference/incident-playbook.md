# Heym Incident Playbook (L0)

Tento playbook použijte k potvrzení incidentu Heym, posouzení dopadu na uživatele, volbě závažnosti (severity) a vyhledání správného postupu obnovy a příslušného vlastníka.

Podrobné postupy: [Heym Runbook (L1)](./operations-runbook.md)

Poslední kontrola: 2026-11-10. Rozsah: self-hosted Heym, samostatná instance nebo cluster, na Docker Compose nebo Kubernetes.

## Předání nasazení (Deployment handover)

Před použitím těchto dokumentů v pohotovosti (on-call) vyplňte tuto tabulku pro každé prostředí. Názvy, adresy URL, kapacitní cíle a cíle obnovy jsou specifické pro konkrétní nasazení. Příklady z repozitáře nepředstavují produkční inventář.

| Položka | Hodnota v nasazení |
| --- | --- |
| Prostředí a veřejná URL adresa Heym | `<environment>`, `<public-url>` |
| Pohotovost platformy a zástupce | `<rotation-or-contact>`, `<backup-contact>` |
| Kanál incidentu a sledování incidentů | `<channel>`, `<tracker-url>` |
| Pohotovost databáze a identifikátor databáze | `<contact>`, `<database-id>` |
| Vlastníci infrastruktury, sítě a úložiště | `<contacts>` |
| Vlastník vydání a systém nasazení | `<contact>`, `<deployment-url>` |
| Ovládací panel chyb aplikace, latence a dostupnosti | `<dashboard-url>` |
| Ovládací panel CPU, paměti, disku a restartů hostitele či podu | `<dashboard-url>` |
| Ovládací panel připojení, zámků, disku a replikace PostgreSQL | `<dashboard-url>` |
| Protokoly a volitelný backend trasování OTel | `<logs-url>`, `<trace-url-or-disabled>` |
| Projekt/soubory Compose nebo kontext/namespace Kubernetes | `<exact-target>` |
| Umístění instancí main, workerů, databáze a úložiště | `<services-or-deployments>`, `<storage-ids>` |
| Schválený zkušební (smoke) workflow a očekávaný výsledek | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Postup zálohování databáze a souborů, poslední test obnovy | `<procedure-url>`, `<test-date>` |
| Cíle doby obnovy (RTO) a bodu obnovy (RPO) | `<RTO>`, `<RPO>` |

Kontakty a odkazy na ovládací panely uchovávejte v zabezpečené provozní kopii nasazení. Důkazy by měly obsahovat identifikátory, časová razítka, počty a očištěné chyby namísto přihlašovacích údajů nebo payloadů workflow.

## Inventář platformy

| Komponenta | Odpovědnost | Důsledek při incidentu |
| --- | --- | --- |
| Frontend a hlavní backend (main) | UI, API, MCP, Portal, interaktivní provádění | Veřejnou trasu a hlavní proces kontrolujte odděleně |
| PostgreSQL | Stav aplikace, registr provádění, fronta běhů, souběžné sloty, koordinace a oznámení | Výpadek databáze může zastavit jak vyřizování požadavků, tak provádění na pozadí |
| Instance workerů, je-li povolen režim cluster | Způsobilé běhy na pozadí čekající ve frontě | Zdravé workery nenahrazují veřejné endpointy instance main |
| Zvolený proces lídra (leader) | Cron, vyhodnocování výstrah, koordinace na pozadí | Kompatibilní worker se může stát lídrem; to nemění jeho roli na main |
| Trvalé úložiště instance main | Soubory Drive, nainstalované pluginy a pracovní prostory kódovacích agentů | Úložiště obnovujte společně s main; směrování ingressu na worker jej neobnoví |
| Backend sandboxu na každé prováděcí instanci | Kontejnery Docker nebo pody Kubernetes pro izolované provádění | Selhání backendu sandboxu může ovlivnit vybrané uzly, zatímco UI funguje |
| Závislosti workflow | Poskytovatelé modelů, servery MCP, externí API, datová úložiště a zprávové služby | Zjistěte, zda selhává jedna závislost, nebo celá platforma |
| Volitelný kolektor OTel | Exportované spany workflow, uzlů a nástrojů Agenta | Samotná absence exportovaných trasování nedokazuje selhání běhu |

Integrovaná fronta běhů Heym používá PostgreSQL. Redis, RabbitMQ a vektorová úložiště mohou být závislostmi workflow; nejsou to povinné služby pro vestavěnou frontu.

`GET /api/health` hlásí pouze stav procesu a verzi. Netestuje PostgreSQL, frontu, volbu lídra, kapacitu sandboxů ani synchronizaci credentials. Kladná odpověď je dílčí kontrola, nikoli záruka celkové provozuschopnosti.

## Prvních pět minut

| Krok | Akce | Rozhodnutí nebo důkaz |
| --- | --- | --- |
| 1 | Potvrďte výstrahu a ověřte prostředí, službu a čas zahájení | Zaznamenejte časová razítka UTC a nejnovější změnu vydání či konfigurace |
| 2 | Zkontrolujte veřejné UI a `/api/health`, poté přímý backend main | Veřejné selhání při zdravém přímém backendu ukazuje na potíže směrování nebo frontendu |
| 3 | Ověřte konektivitu PostgreSQL a tlak na připojení | Před restartováním aplikačních služeb směrujte selhání databáze do L1 |
| 4 | Zkontrolujte stav kontejnerů/podů, CPU, paměť, úložiště a nedávné chyby | Oddělte selhání infrastruktury, zatížení a chyby specifické pro daný workflow |
| 5 | V režimu cluster zkontrolujte **Nastavení > Instance**, stavy front a důkazy lídra | Identifikujte výpadek main, offline/nekompatibilní workery nebo práci vázanou na main |
| 6 | Přiřaďte závažnost a zahajte jedno nápravné opatření ze směrovací tabulky | U P1/P2 okamžitě otevřete incident a zapojte příslušného vlastníka |
| 7 | Ověřte bezpečný běh produkčního workflow a sledujte obnovu | Potvrďte zlepšení stáří fronty, chyb a prostředků; stanovte čas další aktualizace |

Pokud se vydání časově shoduje se selháním, prozkoumejte [Chybné nasazení nebo regrese konfigurace](./operations-runbook.md#bad-deployment-or-configuration-regression). Před vrácením změn zkontrolujte kompatibilitu schématu.

## Závažnost a reakce

Toto jsou výchozí cíle odezvy. Pokud jsou přísnější, uplatněte zásady incidentů a obchodní dopady daného nasazení.

| Závažnost | Příklady | Reakce |
| --- | --- | --- |
| P1 | Main nedostupný všem uživatelům; databáze nedostupná nebo selhávají zápisy; rozsáhlé selhání provádění; kritický příjem nedostupný napříč workflow | Okamžitá náprava, záznam incidentu, pohotovost platformy a závislostí |
| P2 | Rostoucí zpoždění ve frontě; ztráta kapacity workerů; blížící se vyčerpání připojení; jeden workflow degraduje sdílenou kapacitu; opakované pády OOM | Okamžitě zahájit nápravu, cíl izolace do 15 minut, záznam incidentu |
| P3 | Izolované selhání workflow nebo poskytovatele; omezený dopad při zdravé celkové kapacitě platformy | Vlastník workflow či komponenty, sledované následné kroky a poznámka v pohotovosti |
| P4 | Informační signál, očekávaný trend kapacity, ověřený falešný poplach | Vzít na vědomí, zdokumentovat a v případě potřeby upravit monitorování |

## Směrování signálů do L1

Při konfiguraci odkazů na výstrahy použijte tyto relativní kotvy. Pokud monitorovací služba vyžaduje absolutní URL, vložte před ni umístění své hostované provozní kopie.

| Signál | Začněte zde |
| --- | --- |
| Nedostupné UI/API, veřejné chyby 5xx, selhání kontroly stavu procesu | [Výpadek UI nebo API](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL nedostupný, připojení odmítnuto, selhání zápisu | [Výpadek databáze](./operations-runbook.md#postgresql-down-or-not-writable) |
| Příliš mnoho klientů, vypršení limitu fondu, čekání na zámky, špička aktivních připojení | [Připojení a zámky databáze](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Vyžadován řízený restart backendu či workerů | [Restart služby](./operations-runbook.md#controlled-service-restart) |
| Špička v počtu běhů, celkové době trvání, tokenech, CPU nebo paměti | [Nejnáročnější workflow na zdroje](./operations-runbook.md#most-resource-consuming-workflows) |
| Rostoucí fronta, čekající nebo zdánlivě uvízlé běhy | [Zpoždění ve frontě (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instance offline nebo nekompatibilní, nečinný worker, problém s plánovačem či distribucí | [Kontroly režimu cluster](./operations-runbook.md#cluster-mode-checks) |
| Výpadek instance main, zatímco workery zůstávají v pořádku | [Instance main nedostupná](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Chyby Webhooků, selhání MCP/Portalu, odpojení streamování SSE | [Endpointy ingressu a provádění](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, plný disk, selhání Persistent Volume | [Problém s kontejnerem, podem nebo úložištěm](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Chyby poskytovatele Agenta/LLM/MCP, kód 429, selhání credentials | [Selhání modelu nebo integrace](./operations-runbook.md#model-credential-or-integration-failure) |
| Selhání sandboxu u Code, Playwright, skill nebo kódovacího agenta | [Selhání sandboxu](./operations-runbook.md#sandbox-failure) |
| Obnova nemůže splnit cíle; ztráta databáze nebo souborů | [Obnova a reakce na havárie](./operations-runbook.md#recovery-and-disaster-response) |

## Eskalace

| Zjištění | Zapojit | Poskytnout |
| --- | --- | --- |
| Zasaženo více rozhraní nebo workflow | Pohotovost platformy a vedoucí incidentu | Prostředí, rozsah, čas zahájení, nápravná opatření, další aktualizace |
| Databáze nedostupná, nasycená, uzamčená nebo došel disk | Pohotovost databáze | ID databáze, počty připojení, blokující PID, očištěné chyby, stav úložiště |
| Selhání podu/uzlu, připojení úložiště, kapacita sandboxů | Vlastník infrastruktury/úložiště | Kontext, namespace, pracovní zátěž, události podu, tlak na zdroje |
| Veřejná trasa selhává, zatímco přímý backend funguje | Vlastník sítě/ingressu | Dotčené trasy, stavové kódy, latence, porovnání s backendem |
| Jediný workflow dominuje zátěži nebo selhává izolovaně | Vlastník daného workflow | ID workflow/běhu, zdroj triggeru, frekvence, časové okno, dočasné limity |
| Související změna nasazení nebo konfigurace | Vlastník vydání | Digest běžícího obrazu, čas nasazení, revize schématu, poslední známé funkční vydání |
| Kvóta, ověřování nebo dostupnost poskytovatele | Vlastník credentialu nebo integrace | Poskytovatel, model/služba, stavový kód, ID požadavku pokud je bezpečné; žádné tajné hodnoty |

Pokud dopad úrovně P1/P2 přetrvává i po prvním nápravném opatření, okamžitě eskalujte s již shromážděnými důkazy. Nečekejte na kompletní analýzu kořenové příčiny.

## Očekávané chování při selhání

| Selhání | Co může pokračovat | První krok |
| --- | --- | --- |
| PostgreSQL nedostupný | Statický frontend se může stále načítat | Obnovte cestu k databázi; nerestartujte každou instanci aplikace |
| Main nedostupný, workery v pořádku | Způsobilá práce na pozadí a plánování mohou pokračovat, pokud vede kompatibilní worker | Obnovte main s trvalým úložištěm; veřejné UI/API/MCP/Portal zůstávají nedostupné |
| Worker nedostupný | Ostatní způsobilé instance převezmou práci ve frontě po jejím přerozdělení | Před přidáním provozu ověřte umístění, rezervní kapacitu a zotavení |
| Přerušený běh | Způsobilé obnovitelné běhy se mohou restartovat od začátku, a to pouze jednou | Před ručním opakováním zkontrolujte automatickou obnovu a externí vedlejší účinky |
| Přetížení prací určenou výhradně pro main | Workery mohou zůstat nečinné | Snižte problematický příjem nebo zvyšte kapacitu main; změny vah nepřesunou vázanou práci |
| Interní varovný systém nedostupný | Externí monitorování dostupnosti/DB/infrastruktury může stále fungovat | Použijte monitorování mimo Heym; výstrahy Heym závisejí na stejné DB a plánovači |
| Sandbox nebo poskytovatel nedostupný | Workflow bez této závislosti mohou fungovat | Izolujte dotčené workflow a opravte závislost |

## Obnova a uzavření incidentu

1. Ověřte veřejný přístup, přístup k databázi, zamýšlenou způsobilost instancí a bezpečný zkušební (smoke) workflow v produkčním režimu. Test v editoru neprokazuje odesílání na workery.
2. Sledujte alespoň 10 minut stabilní chybovost, latenci, využití prostředků a klesající stáří fronty. Sledujte také další očekávaný kritický plán nebo dohodnutou rovnocennou zkoušku.
3. Vyřešte neúspěšné, obnovené, přeskočené, vypršené a čekající běhy s vlastníky workflow. Před jakýmkoli opakováním prověřte vnější vedlejší účinky.
4. Postupně obnovte dočasná pozastavení triggerů, limity a váhy workerů. Každému zbývajícímu omezení přiřaďte vlastníka a čas vypršení.
5. Aktualizujte incident s uvedením dopadu, časové osy UTC, akcí, důkazů a přetrvávajících rizik. U P1/P2 zadejte přezkum kořenových příčin (post-mortem) a aktualizujte oba dokumenty, pokud některý postup chyběl.

## Související provozní reference

- [Nastavení příkazů L1 a kontroly](./operations-runbook.md#command-setup)
- [Provoz a nasazení](../getting-started/running-and-deployment.md)
- [Rozložení zátěže](./cluster.md)
- [Nasazení na Kubernetes](../getting-started/kubernetes.md)
- [Zabezpečení a rotace klíčů](./security.md)
