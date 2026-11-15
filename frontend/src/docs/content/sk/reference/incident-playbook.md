# Heym Incident Playbook (L0)

Tento playbook použite na potvrdenie incidentu Heym, posúdenie vplyvu na používateľov, voľbu závažnosti (severity) a vyhľadanie správneho postupu obnovy a príslušného vlastníka.

Podrobné postupy: [Heym Runbook (L1)](./operations-runbook.md)

Posledná kontrola: 2026-11-10. Rozsah: self-hosted Heym, samostatná inštancia alebo cluster, na Docker Compose alebo Kubernetes.

## Odovzdanie nasadenia (Deployment handover)

Pred použitím týchto dokumentov v pohotovosti (on-call) vyplňte túto tabuľku pre každé prostredie. Názvy, adresy URL, kapacitné ciele a ciele obnovy sú špecifické pre konkrétne nasadenie. Príklady z repozitára nepredstavujú produkčný inventár.

| Položka | Hodnota v nasadení |
| --- | --- |
| Prostredie a verejná URL adresa Heym | `<environment>`, `<public-url>` |
| Pohotovosť platformy a zástupca | `<rotation-or-contact>`, `<backup-contact>` |
| Kanál incidentu a sledovanie incidentov | `<channel>`, `<tracker-url>` |
| Pohotovosť databázy a identifikátor databázy | `<contact>`, `<database-id>` |
| Vlastníci infraštruktúry, siete a úložiska | `<contacts>` |
| Vlastník vydania a systém nasadenia | `<contact>`, `<deployment-url>` |
| Ovládací panel chýb aplikácie, latencie a dostupnosti | `<dashboard-url>` |
| Ovládací panel CPU, pamäte, disku a reštartov hostiteľa či podu | `<dashboard-url>` |
| Ovládací panel pripojení, zámkov, disku a replikácie PostgreSQL | `<dashboard-url>` |
| Protokoly a voliteľný backend trasovania OTel | `<logs-url>`, `<trace-url-or-disabled>` |
| Projekt/súbory Compose alebo kontext/namespace Kubernetes | `<exact-target>` |
| Umiestnenie inštancií main, workerov, databázy a úložiska | `<services-or-deployments>`, `<storage-ids>` |
| Schválený skúšobný (smoke) workflow a očakávaný výsledok | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Postup zálohovania databázy a súborov, posledný test obnovy | `<procedure-url>`, `<test-date>` |
| Ciele času obnovy (RTO) a bodu obnovy (RPO) | `<RTO>`, `<RPO>` |

Kontakty a odkazy na ovládacie panely uchovávajte v zabezpečenej prevádzkovej kópii nasadenia. Dôkazy by mali obsahovať identifikátory, časové pečiatky, počty a očistené chyby namiesto prihlasovacích údajov alebo payloadov workflow.

## Inventár platformy

| Komponent | Zodpovednosť | Dôsledok pri incidente |
| --- | --- | --- |
| Frontend a hlavný backend (main) | UI, API, MCP, Portal, interaktívne vykonávanie | Verejnú trasu a hlavný proces kontrolujte oddelene |
| PostgreSQL | Stav aplikácie, register vykonávaní, front behov, súbežné sloty, koordinácia a oznámenia | Výpadok databázy môže zastaviť vybavovanie požiadaviek aj vykonávanie na pozadí |
| Inštancie workerov, ak je povolený režim cluster | Spôsobilé behy na pozadí čakajúce vo fronte | Zdravé workery nenahrádzajú verejné endpointy inštancie main |
| Zvolený proces lídra (leader) | Cron, vyhodnocovanie výstrah, koordinácia na pozadí | Kompatibilný worker sa môže stať lídrom; to nemení jeho rolu na main |
| Trvalé úložisko inštancie main | Súbory Drive, nainštalované pluginy a pracovné priestory kódovacích agentov | Úložisko obnovujte spoločne s main; smerovanie ingressu na worker ho neobnoví |
| Backend sandboxu na každej vykonávacej inštancii | Kontajnery Docker alebo pody Kubernetes na izolované vykonávanie | Zlyhanie backendu sandboxu môže ovplyvniť vybrané uzly, kým UI funguje |
| Závislosti workflow | Poskytovatelia modelov, servery MCP, externé API, dátové úložiská a správové služby | Zistite, či zlyháva jedna závislosť, alebo celá platforma |
| Voliteľný kolektor OTel | Exportované spany workflow, uzlov a nástrojov Agenta | Samotná absencia exportovaných trasovaní nedokazuje zlyhanie behu |

Integrovaný front behov Heym používa PostgreSQL. Redis, RabbitMQ a vektorové úložiská môžu byť závislosťami workflow; nie sú to povinné služby pre vstavaný front.

`GET /api/health` hlási iba stav procesu a verziu. Netestuje PostgreSQL, front, voľbu lídra, kapacitu sandboxov ani synchronizáciu credentials. Kladná odpoveď je čiastková kontrola, nie záruka celkovej prevádzkyschopnosti.

## Prvých päť minút

| Krok | Akcia | Rozhodnutie alebo dôkaz |
| --- | --- | --- |
| 1 | Potvrďte výstrahu a overte prostredie, službu a čas začatia | Zaznamenajte časové pečiatky UTC a najnovšiu zmenu vydania či konfigurácie |
| 2 | Skontrolujte verejné UI a `/api/health`, potom priamy backend main | Verejné zlyhanie pri zdravom priamom backende ukazuje na ťažkosti smerovania alebo frontendu |
| 3 | Overte konektivitu PostgreSQL a tlak na pripojenie | Pred reštartovaním aplikačných služieb smerujte zlyhania databázy do L1 |
| 4 | Skontrolujte stav kontajnerov/podov, CPU, pamäť, úložisko a nedávne chyby | Oddeľte zlyhanie infraštruktúry, zaťaženie a chyby špecifické pre daný workflow |
| 5 | V režime cluster skontrolujte **Nastavenia > Inštancie**, stavy frontov a dôkazy lídra | Identifikujte výpadok main, offline/nekompatibilné workery alebo prácu viazanú na main |
| 6 | Priraďte závažnosť a začnite jedno nápravné opatrenie zo smerovacej tabuľky | Pri P1/P2 okamžite otvorte incident a zapojte príslušného vlastníka |
| 7 | Overte bezpečný beh produkčného workflow a sledujte obnovu | Potvrďte zlepšenie veku frontu, chýb a prostriedkov; stanovte čas ďalšej aktualizácie |

Ak sa vydanie časovo zhoduje so zlyhaním, preskúmajte [Chybné nasadenie alebo regresia konfigurácie](./operations-runbook.md#bad-deployment-or-configuration-regression). Pred vrátením zmien skontrolujte kompatibilitu schémy.

## Závažnosť a reakcia

Toto sú východiskové ciele odozvy. Ak sú prísnejšie, uplatnite zásady incidentov a obchodné dosahy daného nasadenia.

| Závažnosť | Príklady | Reakcia |
| --- | --- | --- |
| P1 | Main nedostupný všetkým používateľom; databáza nedostupná alebo zlyhávajú zápisy; rozsiahle zlyhanie vykonávania; kritický príjem nedostupný naprieč workflow | Okamžitá náprava, záznam incidentu, pohotovosť platformy a závislostí |
| P2 | Rastúce oneskorenie vo fronte; strata kapacity workerov; blížiace sa vyčerpanie pripojení; jeden workflow degraduje zdieľanú kapacitu; opakované pády OOM | Okamžite začať nápravu, cieľ izolácie do 15 minút, záznam incidentu |
| P3 | Izolované zlyhanie workflow alebo poskytovateľa; obmedzený dosah pri zdravej celkovej kapacite platformy | Vlastník workflow či komponentu, sledované následné kroky a poznámka v pohotovosti |
| P4 | Informačný signál, očakávaný trend kapacity, overený falošný poplach | Vziať na vedomie, zdokumentovať a v prípade potreby upraviť monitorovanie |

## Smerovanie signálov do L1

Pri konfigurácii odkazov na výstrahy použite tieto relatívne kotvy. Ak monitorovacia služba vyžaduje absolútnu URL, vložte pred ňu umiestnenie svojej hostovanej prevádzkovej kópie.

| Signál | Začnite tu |
| --- | --- |
| Nedostupné UI/API, verejné chyby 5xx, zlyhanie kontroly stavu procesu | [Výpadok UI alebo API](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL nedostupný, pripojenie odmietnuté, zlyhanie zápisu | [Výpadok databázy](./operations-runbook.md#postgresql-down-or-not-writable) |
| Príliš veľa klientov, vypršanie limitu fondu, čakanie na zámky, špička aktívnych pripojení | [Pripojenia a zámky databázy](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Vyžadovaný riadený reštart backendu či workerov | [Reštart služby](./operations-runbook.md#controlled-service-restart) |
| Špička v počte behov, celkovom trvaní, tokenoch, CPU alebo pamäti | [Najnáročnejšie workflow na zdroje](./operations-runbook.md#most-resource-consuming-workflows) |
| Rastúci front, čakajúce alebo zdanlivo uviaznuté behy | [Oneskorenie vo fronte (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Inštancia offline alebo nekompatibilná, nečinný worker, problém s plánovačom či distribúciou | [Kontroly režimu cluster](./operations-runbook.md#cluster-mode-checks) |
| Výpadok inštancie main, kým workery zostávajú v poriadku | [Inštancia main nedostupná](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Chyby Webhookov, zlyhania MCP/Portalu, odpojenia streamovania SSE | [Endpointy ingressu a vykonávania](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, plný disk, zlyhanie Persistent Volume | [Problém s kontajnerom, podom alebo úložiskom](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Chyby poskytovateľa Agenta/LLM/MCP, kód 429, zlyhanie credentials | [Zlyhanie modelu alebo integrácie](./operations-runbook.md#model-credential-or-integration-failure) |
| Zlyhanie sandboxu pri Code, Playwright, skill alebo kódovacom agentovi | [Zlyhanie sandboxu](./operations-runbook.md#sandbox-failure) |
| Obnova nemôže splniť ciele; strata databázy alebo súborov | [Obnova a reakcia na havárie](./operations-runbook.md#recovery-and-disaster-response) |

## Eskalácia

| Zistenie | Zapojiť | Poskytnúť |
| --- | --- | --- |
| Zasiahnutých viacero rozhraní alebo workflow | Pohotovosť platformy a vedúci incidentu | Prostredie, rozsah, čas začatia, nápravné opatrenia, ďalšia aktualizácia |
| Databáza nedostupná, nasýtená, uzamknutá alebo došiel disk | Pohotovosť databázy | ID databázy, počty pripojení, blokujúce PID, očistené chyby, stav úložiska |
| Zlyhanie podu/uzla, pripojenie úložiska, kapacita sandboxov | Vlastník infraštruktúry/úložiska | Kontext, namespace, pracovná záťaž, udalosti podu, tlak na zdroje |
| Verejná trasa zlyháva, kým priamy backend funguje | Vlastník siete/ingressu | Dotknuté trasy, stavové kódy, latencia, porovnanie s backendom |
| Jediný workflow dominuje záťaži alebo zlyháva izolovane | Vlastník daného workflow | ID workflow/behu, zdroj triggeru, frekvencia, časové okno, dočasné limity |
| Súvisiaca zmena nasadenia alebo konfigurácie | Vlastník vydania | Digest bežiaceho obrazu, čas nasadenia, revízia schémy, posledné známe funkčné vydanie |
| Kvóta, overovanie alebo dostupnosť poskytovateľa | Vlastník credentialu alebo integrácie | Poskytovateľ, model/služba, stavový kód, ID požiadavky ak je bezpečné; žiadne tajné hodnoty |

Ak dosah úrovne P1/P2 pretrváva aj po prvom nápravnom opatrení, okamžite eskalujte s už zhromaždenými dôkazmi. Nečakajte na kompletnú analýzu koreňovej príčiny.

## Očakávané správanie pri zlyhaní

| Zlyhanie | Čo môže pokračovať | Prvý krok |
| --- | --- | --- |
| PostgreSQL nedostupný | Statický frontend sa môže stále načítavať | Obnovte cestu k databáze; nereštartujte každú inštanciu aplikácie |
| Main nedostupný, workery v poriadku | Spôsobilá práca na pozadí a plánovanie môžu pokračovať, ak vedie kompatibilný worker | Obnovte main s trvalým úložiskom; verejné UI/API/MCP/Portal zostávajú nedostupné |
| Worker nedostupný | Ostatné spôsobilé inštancie prevezmú prácu vo fronte po jej prerozdelení | Pred pridaním prevádzky overte umiestnenie, rezervnú kapacitu a zotavenie |
| Prerušený beh | Spôsobilé obnoviteľné behy sa môžu reštartovať od začiatku, a to iba raz | Pred ručným opakovaním skontrolujte automatickú obnovu a externé vedľajšie účinky |
| Preťaženie prácou určenou výhradne pre main | Workery môžu zostať nečinné | Znížte problematický príjem alebo zvýšte kapacitu main; zmeny váh nepresunú viazanú prácu |
| Interný varovný systém nedostupný | Externé monitorovanie dostupnosti/DB/infraštruktúry môže stále fungovať | Použite monitorovanie mimo Heym; výstrahy Heym závisia od rovnakej DB a plánovača |
| Sandbox alebo poskytovateľ nedostupný | Workflow bez tejto závislosti môžu fungovať | Izolujte dotknuté workflow a opravte závislosť |

## Obnova a uzavretie incidentu

1. Overte verejný prístup, prístup k databáze, zamýšľanú spôsobilosť inštancií a bezpečný skúšobný (smoke) workflow v produkčnom režime. Test v editore nedokazuje odosielanie na workery.
2. Sledujte aspoň 10 minút stabilnú chybovosť, latenciu, využitie prostriedkov a klesajúci vek frontu. Sledujte aj ďalší očakávaný kritický plán alebo dohodnutú rovnocennú skúšku.
3. Vyriešte neúspešné, obnovené, preskočené, vypršané a čakajúce behy s vlastníkmi workflow. Pred akýmkoľvek opakovaním preverte vonkajšie vedľajšie účinky.
4. Postupne obnovte dočasné pozastavenia triggerov, limity a váhy workerov. Každému zostávajúcemu obmedzeniu priraďte vlastníka a čas vypršania.
5. Aktualizujte incident s uvedením dosahu, časovej osi UTC, akcií, dôkazov a pretrvávajúcich rizík. Pri P1/P2 zadajte preskúmanie koreňových príčin (post-mortem) a aktualizujte oba dokumenty, ak niektorý postup chýbal.

## Súvisiace prevádzkové referencie

- [Nastavenie príkazov L1 a kontroly](./operations-runbook.md#command-setup)
- [Prevádzka a nasadenie](../getting-started/running-and-deployment.md)
- [Rozloženie záťaže](./cluster.md)
- [Nasadenie na Kubernetes](../getting-started/kubernetes.md)
- [Zabezpečenie a rotácia kľúčov](./security.md)
