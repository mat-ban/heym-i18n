# Rozdeľovanie záťaže

Nasmerujte druhú inštanciu Heym na tú istú databázu PostgreSQL a pripojí sa ako worker. Beh workflowov na pozadí sa potom rozdeľuje medzi inštancie podľa percenta, ktoré nastavíte, takže stroj obsluhujúci UI a API nie je zároveň jediným strojom, ktorý spúšťa všetky workflowy.

Inštancie spolu nikdy nekomunikujú. Prácu prenáša Postgres, takže worker nepotrebuje otvorený port, certifikát ani cestu späť k hlavnej inštancii — iba prístup k databáze.

## Roly

Jedna inštancia je **main**, určená premennou prostredia. Obsluhuje UI, API, MCP a chat portál a vlastní úložisko súborov a nainštalované pluginy. Každá ďalšia inštancia je **worker**: dosiahne iba na databázu a vykonáva behy na pozadí.

```
HEYM_CLUSTER_ENABLED=true
HEYM_INSTANCE_ROLE=main       # or: worker
HEYM_INSTANCE_NAME=EU Main    # display label, editable later from Settings
HEYM_INSTANCE_ID=eu-main      # optional; derived from the name when empty
```

Rola main je oddelená od voľby lídra. Heym už volí jedného lídra naprieč clusterom, ktorý vlastní cron, vyhodnocovanie upozornení a obnovu po páde; ak main spadne, vedenie sa v priebehu niekoľkých sekúnd presunie na workera a plánované behy sa naďalej spúšťajú. Rola main sa nepresúva, pretože úložisko súborov sa s ňou presunúť nemôže.

## Čo môže opustiť hlavnú inštanciu

Umiestnenie sa rozhoduje podľa uzlov workflowu pred spustením behu. Beh zostáva na main, keď sa niektorý uzol v ňom — vrátane uzlov v pod-workflowoch, ktoré volá — dotýka niečoho, čo existuje iba na jednom stroji:

| Uzol | Prečo zostáva na main |
|---|---|
| Codex, OpenCode Go | Pracovný priestor kódovacieho agenta zostáva na lokálnom disku, aby v ňom mohol nadväzujúci beh pokračovať |
| Agent s pripojenou skill | Kód skillu číta a zapisuje do Heym Drive |
| Drive, Converter, Google Drive | Čítajú a zapisujú generované súbory |
| File Upload trigger | Nahraný súbor pristane na disku main |
| Send Email | Firemné SMTP relaye zvyčajne povoľujú jednu zdrojovú adresu |
| Plugin uzly | Plugin je nainštalovaný na disku jednej inštancie |

**Všetko ostatné sa distribuuje** — vrátane uzla Code, Playwright a Agent Python nástrojov. Každá inštancia spúšťa ten istý image s vlastným Docker socketom, takže sandbox nie je dôvodom ponechať beh na main, a práve to sú uzly s najvyššími nárokmi na CPU v produkte.

Workflow, ktorého pod-workflow sa vyberá výrazom, nie je možné vopred preskúmať, takže zostáva na main.

## Výber percent

Váhy sú celé čísla nastavené v **Settings → Instances**. Sú to **podiely tých inštancií, ktoré práve teraz môžu prijímať prácu**, nie percentá zo 100: plánovač delí vlastným súčtom daného poolu.

Tento rozdiel sa prejaví hneď, ako jedna inštancia vypadne. Pri `Main 41, Worker A 26, Worker B 33` ponechá vypnutie Worker B pool so súčtom 67, takže Main skutočne dostane 41/67 = **61 %** a Worker A 26/67 = **39 %**. Panel zobrazuje efektívne rozdelenie pod tabuľkou práve z tohto dôvodu a uloženie nie je nikdy zablokované preto, že čísla nedávajú 100 — odmietnuté je iba rozdelenie, v ktorom žiadna povolená inštancia nemá váhu.

Dve ďalšie veci sa dajú ľahko pochopiť nesprávne.

**Percento nie je podiel výkonu stroja.** Pokrýva iba behy, ktoré prechádzajú cez front. Obsluha UI a API, streamovanie behov editora a portálu a spracovanie nahrávaných súborov sú všetko prácou main a nič z toho sa nezapočítava. Main robí viac, než hovorí jeho číslo.

**Percento main je strop, nie podlaha.** Behy, ktoré môžu bežať iba na main, sa odpočítavajú z jeho kvóty, takže keď sa táto kvóta vyčerpá, zostávajúce distributovateľné behy pripadnú workerom. Nastaviť číslo main nízko je bezpečné — práca, ktorá tam musí bežať, tam stále beží. Nastaviť ho vysoko vyhladuje workerov.

Takže pri silnom main a menšom workerovi začnite bližšie k 60/40 než k surovému pomeru strojov a potom porovnajte skutočné trvania behov v karte Spustenia a upravte.

Váhy sa renormalizujú naprieč inštanciami, ktoré sú práve teraz live a povolené. Pri `main=70, A=15, B=15`, ak A prejde offline, rozdelenie sa zmení na 70/85 a 15/85 medzi main a B a vráti sa na 70/15/15, keď sa A vráti.

**Inštancii, ktorá sa vráti, sa nedlhujú behy, ktoré zmeškala.** Čas strávený v stave Offline, Disabled alebo na nezhodnej verzii sa jej nezapočítava, takže worker, ktorý strávi noc nedostupný, sa znovu pripojí na aktuálnu pozíciu poolu a rozdelenie od jeho prvého behu opäť ukazuje 70/30 — nepohltí všetky behy, kým dobehne. Worker, ktorý bol dostupný celý čas, stále dobieha, a práve to robí z percenta main strop.

### Nová inštancia sa pripája s nulou

Inštancia, ktorej nikdy nebola pridelená váha, začína na 0, čo by znamenalo, že je Live, Enabled a nedostáva nič. **Give new instances a share automatically** — predvolene zapnuté, pod tabuľkou inštancií — to rieši: pri ďalšom priechode lídra dostane nováčik rovnaký podiel z poolu a existujúce váhy sa úmerne zmenšia so zachovaním vzájomných pomerov, takže zámerné 70/30 sa aj potom číta približne ako 70/30. Súčet zostáva presne 100.

Toto sa spustí **raz na inštanciu**. Automatický priechod aj vaša vlastná úprava označia inštanciu ako nakonfigurovanú, takže inštancia, ktorú nastavíte sami, sa nikdy nezmení za vaším chrbtom — vrátane tej, ktorú zámerne nastavíte na 0. Vypnite toto nastavenie, ak radšej chcete, aby každý nový stroj čakal na vás.

Zúčastňujú sa iba povolené, live a kompatibilné inštancie. Prideliť podiel stroju, ktorý nedokáže nič vykonať, by tento podiel uviazol.
### Keď percentá nepomôžu

Panel nastavení uvádza, koľko z behov za posledných 24 hodín sa dalo vykonať iba na main. Ak je to číslo vysoké — záťaž s prevahou Codex alebo Drive — workery budú nečinne sedieť bez ohľadu na to, čo hovoria váhy, a riešením je väčšia inštancia main, nie viac ich.

## Dimenzovanie PostgreSQL pre cluster

Počet pripojení rastie s počtom inštancií, nielen s počtom používateľov. Každá inštancia spúšťa niekoľko procesov uvicorn a každý proces drží connection pool plus štyri `LISTEN` pripojenia (cancellation, queue wake-ups, run results, chat streams). Otvorené chat streams zdieľajú jedno chat pripojenie, takže nepridávajú databázové pripojenia. Cluster s tromi inštanciami pri predvolenom `max_connections = 100` sa vyčerpá a Heym sa potom nedokáže pripojiť k vlastnej databáze.

Počítajte približne s `instances x processes x (async pool + sync pool + 4)` a nastavte `max_connections` nad túto hodnotu.

Radšej zmenšite pooly, než by ste iba zvyšovali strop. Jedno nasadenie má predvolene 10+20 async a 5+10 sync pripojení na proces, čo je pre jeden stroj veľkorysé a pre cluster až príliš veľa:

| Premenná | Jedna inštancia | Cluster |
|---|---|---|
| `HEYM_DB_POOL_SIZE` | 10 | 3 |
| `HEYM_DB_MAX_OVERFLOW` | 20 | 5 |
| `HEYM_DB_SYNC_POOL_SIZE` | 5 | 2 |
| `HEYM_DB_SYNC_MAX_OVERFLOW` | 10 | 3 |

Príkladný compose súbor nastavuje tieto hodnoty a `max_connections = 300`. Tým sa cluster s dvomi inštanciami dostane zo stropu 768 pripojení na 192, pričom tri inštancie zostávajú pod 300.

## Požiadavky, ktoré cluster nedokáže vynútiť za Vás

**Každá inštancia musí používať rovnaký `SECRET_KEY` a `ENCRYPTION_KEY`.** Worker s odlišným `ENCRYPTION_KEY` nedokáže dešifrovať prihlasovacie údaje a každý beh, ktorý ich používa, by zlyhal s chybou, ktorá neuvádza nič užitočné. Heym pri každom heartbeat porovnáva digest oboch kľúčov spolu s verziou aplikácie a revíziou databázy a označí nezhodnú inštanciu ako **Mismatch**, takže nedostane žiadnu prácu. Záťaž sa dovtedy presúva späť na main, kým to neopravíte.

To zároveň určuje poradie upgrade. Upgrade main ako prvého označí každý worker za nekompatibilný; práca sa vráti na main a každý worker sa znovu pripojí, keď sa upgraduje. Pomalšie, viditeľné a reverzibilné.

**Ingress smerujte iba na inštanciu main.** Rozdeľovanie používateľskej prevádzky medzi inštancie pomocou round-robin by poslalo nahrávanie súboru na jeden stroj a jeho stiahnutie na iný. Nič v kóde tomu nezabraňuje, pretože worker spúšťa rovnaký image a odpovie na akúkoľvek požiadavku, ktorú dostane.

**Každá inštancia potrebuje `FRONTEND_URL` nastavenú na rovnakú verejnú adresu.** Beh, ktorý sa pozastaví kvôli ľudskému posúdeniu, vytvára svoj odkaz na posúdenie na inštancii, ktorá ho vykonala, nie na main, a to isté platí pre odkazy na nadväzujúce kroky Codex a pre URL na stiahnutie vygenerovaných súborov. Worker bez nej vytvára tieto odkazy voči svojej vlastnej lokálnej adrese a ten, kto jeden dostane, ho nedokáže otvoriť.

**Worker inštancie majú odlišnú odchádzajúcu IP.** Každé API, ktoré povoľuje zdrojové adresy, uvidí tú novú. Send Email beží na main presne z tohto dôvodu; pre uzol HTTP buď dajte clusteru jednu NAT egress adresu, alebo povoľte každú inštanciu.

## Pridanie workera na inom stroji

`docker-compose.worker.yml` v koreni repozitára spúšťa workera na jeho vlastnom hostiteľovi. Nemá databázu ani UI: pripája sa k PostgreSQL inštancie main a preberá svoj podiel behov na pozadí.

Vyplňte `.env` vedľa neho — image tag, hostiteľa databázy a prihlasovacie údaje, oba kľúče a id inštancie — a spustite ho. Compose odmietne štart, kým nie sú nastavené všetky povinné hodnoty, namiesto toho, aby naštartoval so zástupnou hodnotou, ktorá neskôr zlyhá spôsobom, ktorý sa ťažko číta.

Image tag musí byť verzia, ktorú spúšťa main, a oba kľúče musia byť skopírované presne. Rozdiel v ktoromkoľvek z nich zobrazí workera ako Mismatch a nedostane žiadnu prácu.

## Čítanie tabuľky Instances

| Stĺpec | Význam |
|---|---|
| Name | Upraviteľný štítok; je opečiatkovaný na každý beh, ktorý táto inštancia vykoná |
| Role | `main` alebo `worker`, z prostredia |
| Status | **Live** s čerstvým heartbeatom, **Offline** po 30 sekundách ticha, **Mismatch**, keď sa verzia, revízia databázy alebo kľúče líšia od main |
| ms | Round trip z tejto inštancie do databázy, meraný samotnou inštanciou |
| On | Vyradí workera z rotácie bez toho, aby ste ho zastavili — spustené spustenia dokončí, žiadne nové sa mu nepriradia. Pre inštanciu main je uzamknutý: práca so súbormi, pluginmi a coding-agentmi beží tam bez ohľadu na to, čo hovorí prepínač |
| Weight | Jeho podiel na distribúcii behov |

## Limity súbehu v clusteri

[Limit súbehu](./webhooks.md#concurrency-limit-and-queued-runs) workflow sa počíta v PostgreSQL, takže platí naprieč všetkými inštanciami a procesmi: dve inštancie nikdy nespustia viac behov jedného workflow, než povoľuje limit. Beh, ktorý čakal na slot, je pri štarte umiestnený podľa rovnakých pravidiel ako akýkoľvek iný beh, takže beh vyžadujúci zotrvanie na main na nej zostáva. Worker frontu vykonávajúci tieto behy sa teraz spúšťa pri každej inštalácii vrátane samostatnej inštancie, kde spracováva iba behy zaradené do frontu vlastnou inštanciou. To znamená, že aj samostatná inštancia udržiava v každom procese prebúdzacie spojenie `LISTEN`; dimenzujte preto jej spojenia rovnako ako pri clusterovej inštancii.

## História spustení

Každé spustenie v histórii spustení uvádza inštanciu, ktorá ho vykonala, a oba dialógy histórie dokážu filtrovať na jednu inštanciu. Filter sa zhoduje podľa id inštancie, pričom zobrazuje jej názov, takže premenovanie inštancie neprepíše to, čo hovoria staré spustenia.

Nič z toho sa nezobrazuje pri inštalácii s jednou inštanciou: polia sú prázdne, nezobrazuje sa žiadny štítok a neponúka sa žiadny filter.
## Správanie pri zlyhaní

**Ak počas behu zlyhá worker**, jeho heartbeat zostarne a existujúci recovery sweep leadera znovu spustí dané spustenie na živom instance. Riadok vo fronte, ktorý si nárokoval, sa ukončí samostatne: keď preň neexistuje žiadne aktívne spustenie a uplynie dvojminútová ochranná lehota, leader označí riadok ako zlyhaný a prebudí toho, kto čakal na výsledok. Samotný vek nikdy nie je triggerom, takže legitímne dlhý beh zostáva nedotknutý; a riadok sa označí ako zlyhaný namiesto opätovného zaradenia do frontu, pretože recovery už vlastní opätovné spustenie a opätovné zaradenie by spustilo ten istý workflow dvakrát.

**Ak vypadne main**, cron naďalej spúšťa z workera a distribovateľné behy sa naďalej vykonávajú. Behy, ktoré potrebujú main, sa zaraďujú do frontu a čakajú, a vyprázdnia sa, keď sa vráti — ale iba v rámci okna tolerancie zmeškania (`HEYM_CRON_MISFIRE_GRACE_SECONDS`, predvolene 600 sekúnd). Čokoľvek staršie sa uzavrie ako preskočené, s zaznamenaným dôvodom, namiesto prehratia hodín nahromadených úloh naraz.

UI, API, MCP a editor sú počas výpadku main nedostupné, pretože ingress smeruje tam.

## Súvisiace

- [Spúšťanie a nasadenie](../getting-started/running-and-deployment.md) – Najprv nasaďte jednu instanciu; environment variables a nastavenie kľúčov sa nachádzajú tam
- [Nastavenia](./user-settings.md) – Karta Instances a kto ju vidí
- [Spustenia](../tabs/traces-tab.md) – Porovnajte skutočné trvanie behov medzi instanciami pred zmenou rozdelenia
- [Zabezpečenie](./security.md) – Prečo musí každá instancia zdieľať `SECRET_KEY` a `ENCRYPTION_KEY`
