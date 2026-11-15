# Heym Incident Playbook (L0)

Kasutage seda käsiraamatut (playbook) Heymi intsidendi kinnitamiseks, kasutajamõju hindamiseks, raskusastme (severity) valimiseks ning õige taastamisprotseduuri ja vastutava omanikuni jõudmiseks.

Üksikasjalikud protseduurid: [Heym Runbook (L1)](./operations-runbook.md)

Viimati üle vaadatud: 2026-11-10. Ulatus: isemajutatud (self-hosted) Heym, üksik eksemplar või cluster, Docker Compose'is või Kuberneteses.

## Paigalduse üleandmine (Deployment handover)

Täitke see tabel iga keskkonna jaoks enne nende dokumentide kasutamist valves olles (on-call). Nimed, URL-id, mahueesmärgid ja taastamiseesmärgid on paigaldusspetsiifilised. Repositooriumi näited ei kujuta endast tootmisinventari.

| Element | Väärtus paigalduses |
| --- | --- |
| Keskkond ja avalik Heymi URL | `<environment>`, `<public-url>` |
| Platvormi valve ja asendaja | `<rotation-or-contact>`, `<backup-contact>` |
| Intsidendi kanal ja intsidendihaldur | `<channel>`, `<tracker-url>` |
| Andmebaasi valve ja andmebaasi identifikaator | `<contact>`, `<database-id>` |
| Infrastruktuuri, võrgu ja salvestusruumi omanikud | `<contacts>` |
| Versiooni väljalaske omanik ja paigaldussüsteem | `<contact>`, `<deployment-url>` |
| Rakenduse vigade, latentsuse ja saadavuse armatuurlaud | `<dashboard-url>` |
| Hosti või podi CPU, mälu, ketta ja taaskäivituste armatuurlaud | `<dashboard-url>` |
| PostgreSQL-i ühenduste, lukkude, ketta ja replikatsiooni armatuurlaud | `<dashboard-url>` |
| Logid ja valikuline OTel jälituse taustaprogramm | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose'i projekt/failid või Kubernetese kontekst/nimeruum | `<exact-target>` |
| Maini, workerite, andmebaasi ja salvestusruumi asukohad | `<services-or-deployments>`, `<storage-ids>` |
| Heakskiidetud kontroll-workflow (smoke) ja oodatav tulemus | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Andmebaasi ja failide varundusprotseduur, viimane taastamistest | `<procedure-url>`, `<test-date>` |
| Taasteaja eesmärk (RTO) ja taastepunkti eesmärk (RPO) | `<RTO>`, `<RPO>` |

Hoidke kontakte ja armatuurlaua linke paigalduse piiratud juurdepääsuga operatiivses koopias. Tõendid peaksid sisaldama ID-sid, ajatempleid, loendureid ja puhastatud veateateid, mitte credentials-andmeid ega workflow payload-e.

## Platvormi inventar

| Komponent | Vastutus | Mõju intsidendi korral |
| --- | --- | --- |
| Frontend ja peamine backend (main) | UI, API, MCP, Portal, interaktiivne käitus | Kontrollige avalikku marsruuti ja peamist protsessi eraldi |
| PostgreSQL | Rakenduse olek, käituste register, käitusjärjekord, samaaegsuse pesad, koordineerimine ja teated | Andmebaasi rike võib peatada nii päringute töötlemise kui ka taustal käitamise |
| Worker-eksemplarid, kui cluster-režiim on lubatud | Järjekorras olevad nõuetele vastavad taustakäitused | Terved workerid ei asenda main-eksemplari avalikke endpointe |
| Valitud juhtprotsess (leader) | Cron, häirete hindamine, taustakoordineerimine | Ühilduv worker võib saada juhiks; see ei muuda tema rolli mainiks |
| Main-eksemplari püsiv salvestusruum | Drive'i failid, paigaldatud pistikprogrammid ja koodiagentide tööruumid | Taastage salvestusruum koos mainiga; ingressi suunamine workerile ei taasta seda |
| Sandboxi taustaprogramm igal käitaval eksemplaril | Dockeri konteinerid või Kubernetese podid isoleeritud käituseks | Tõrkuv sandboxi taustaprogramm võib mõjutada valitud sõlmi, samal ajal kui UI töötab |
| Workflow sõltuvused | Mudelipakkujad, MCP serverid, välised API-d, andmehoidlad ja sõnumiteenused | Tehke kindlaks, kas tõrgub üksik sõltuvus või kogu platvorm |
| Valikuline OTel koguja | Eksporditud workflow, sõlmede ja Agent-tööriistade vahemikud (spans) | Eksporditud jälituste puudumine üksi ei tõesta käituse ebaõnnestumist |

Heymi sisseehitatud käitusjärjekord kasutab PostgreSQL-i. Redis, RabbitMQ ja vektorhoidlad võivad olla workflow sõltuvused; need ei ole sisseehitatud järjekorra jaoks kohustuslikud teenused.

`GET /api/health` teatab ainult protsessi tervisest ja versioonist. See ei testi PostgreSQL-i, järjekorda, juhi valimist, sandboxi mahtu ega credentials-andmete sünkroonimist. Positiivne vastus on üksik kontroll, mitte täieliku töövalmiduse garantii.

## Esimesed viis minutit

| Samm | Tegevus | Otsus või tõend |
| --- | --- | --- |
| 1 | Kinnitage häire ning kontrollige keskkonda, teenust ja algusaega | Salvestage UTC ajatemplid ja viimane versiooni-/konfiguratsioonimuudatus |
| 2 | Kontrollige avalikku UI-d ja `/api/health`, seejärel otsest main-backendit | Avalik tõrge terve otsese backendi korral viitab marsruutimise või frontendi probleemidele |
| 3 | Kontrollige PostgreSQL-i ühenduvust ja ühenduste koormust | Suunake andmebaasitõrked L1 tasemele enne rakendusteenuste taaskäivitamist |
| 4 | Kontrollige konteinerite/podide olekut, CPU-d, mälu, salvestusruumi ja hiljutisi vigu | Eristage infrastruktuuri tõrget, ülekoormust ja workflow-spetsiifilisi vigu |
| 5 | Cluster-režiimis kontrollige **Seaded > Eksemplarid**, järjekordade olekuid ja juhi tõendeid | Tuvastage maini kadu, offline/ühildumatud workerid või ainult mainile määratud tööd |
| 6 | Määrake raskusaste ja alustage ühte leevendavat meedet marsruutimistabelist | P1/P2 puhul avage koheselt intsident ja kaasake asjaomane omanik |
| 7 | Kontrollige ohutut tootmisrežiimi workflow käitust ja jälgige taastumist | Kinnitage järjekorra vanuse, vigade ja ressursside paranemist; määrake järgmise värskenduse aeg |

Kui versiooniväljalase langeb kokku tõrkega, uurige jaotist [Vigane paigaldus või konfiguratsiooni regressioon](./operations-runbook.md#bad-deployment-or-configuration-regression). Kontrollige skeemi ühilduvust enne tagasipööramist (rollback).

## Raskusaste ja reageerimine

Need on esialgsed reageerimiseesmärgid. Rakendage paigalduse intsidendipoliitikat ja ärimõju, kui need on rangemad.

| Raskusaste | Näited | Reageerimine |
| --- | --- | --- |
| P1 | Main pole kättesaadav ühelegi kasutajale; andmebaas pole kättesaadav või kirjutamised ebaõnnestuvad; ulatuslik käitustõrge; kriitiline sisend pole kättesaadav kõigis workflowdes | Kohene leevendamine, intsidendikaart, platvormi ja sõltuvuste valve |
| P2 | Kasvav mahajäämus järjekorras; workerite mahu kaotus; ähvardav ühenduste ammendumine; üks workflow halvendab jagatud mahtu; korduvad OOM-krahhid | Alustage leevendamist koheselt, piiramise eesmärk 15 minuti jooksul, intsidendikaart |
| P3 | Isoleeritud workflow või pakkuja tõrge; piiratud mõju terve platvormi mahu juures | Workflow või komponendi omanik, jälgitav tegevus ja valvekanne |
| P4 | Informatiivne signaal, oodatav mahutrend, kontrollitud valehäire | Teadmiseks võtmine, dokumenteerimine ja vajadusel seire kohandamine |

## Signaalide suunamine L1 tasemele

Kasutage neid suhtelisi ankruid häirelinkide konfigureerimisel. Kui seireteenus nõuab absoluutset URL-i, lisage prefiksina oma majutatud operatiivse koopia asukoht.

| Signaal | Alustage siit |
| --- | --- |
| UI/API pole kättesaadav, avalikud 5xx vead, protsessi tervisekontrolli ebaõnnestumine | [UI või API maas](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL kättesaamatu, ühendus tagasi lükatud, kirjutamisviga | [Andmebaas maas](./operations-runbook.md#postgresql-down-or-not-writable) |
| Liiga palju kliente, basseini ajalõpp, lukkude ootamine, aktiivsete ühenduste hüpe | [Andmebaasi ühendused ja lukud](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Vajalik backend'i või workerite kontrollitud taaskäivitamine | [Teenuse taaskäivitamine](./operations-runbook.md#controlled-service-restart) |
| Käituste arvu, kogukestuse, tokenite, CPU või mälu hüpe | [Kõige ressursimahukamad workflowd](./operations-runbook.md#most-resource-consuming-workflows) |
| Kasvav järjekord, ootavad või näiliselt kinni jäänud käitused | [Järjekorra mahajäämus (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Eksemplar offline või sobimatu, jõudeolev worker, ajastaja või jaotuse probleem | [Cluster-režiimi kontrollid](./operations-runbook.md#cluster-mode-checks) |
| Main kaotatud, samal ajal kui workerid jäävad terveks | [Main-eksemplar pole kättesaadav](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhooki vead, MCP/Portali tõrked, SSE voogedastuse katkestused | [Ingressi ja käituse endpointid](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, ketas täis, Persistent Volume'i tõrge | [Konteineri, podi või salvestusruumi probleem](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Agent/LLM/MCP pakkuja vead, kood 429, credentials-tõrge | [Mudeli või integratsiooni tõrge](./operations-runbook.md#model-credential-or-integration-failure) |
| Sandboxi tõrked Code, Playwright, skill või koodiagendi puhul | [Sandboxi tõrge](./operations-runbook.md#sandbox-failure) |
| Taastamine ei suuda eesmärke täita; andmebaas või failid kadunud | [Taastamine ja katastroofidele reageerimine](./operations-runbook.md#recovery-and-disaster-response) |

## Eskaleerimine

| Tuvastus | Kaasata | Esitada |
| --- | --- | --- |
| Mõjutatud on mitu liidest või workflowd | Platvormi valve ja intsidendijuht | Keskkond, ulatus, algusaeg, leevendusmeetmed, järgmine uuendus |
| Andmebaas pole kättesaadav, küllastunud, lukustatud või ketas täis | Andmebaasi valve | Andmebaasi ID, ühenduste arv, blokeerivad PID-d, puhastatud vead, ketta olek |
| Podi/sõlme rike, salvestusruumi ühendamine, sandboxi maht | Infrastruktuuri/salvestusruumi omanik | Kontekst, nimeruum, töökoormus, podi sündmused, ressursside surve |
| Avalik marsruut ebaõnnestub, samal ajal kui otsene backend töötab | Võrgu/ingressi omanik | Mõjutatud marsruudid, olekukoodid, latentsus, võrdlus backendiga |
| Üksik workflow domineerib koormuses või tõrgub isoleeritult | Vastavad workflow omanik | Workflow/käituse ID-d, triggeri allikas, sagedus, ajaaken, ajutised piirangud |
| Korreleeritud paigalduse või konfiguratsiooni muudatus | Versiooni väljalaske omanik | Töötava tõmmise räsi (digest), paigalduse aeg, skeemi redaktsioon, viimane teadaolev hea versioon |
| Pakkuja kvoot, autentimine või saadavus | Credential- või integratsiooniomanik | Pakkuja, mudel/teenus, olekukood, päringu ID ohutuse korral; ilma saladusteta |

Kui P1/P2 taseme mõju püsib pärast esimest leevendusmeedet, eskaleerige viivitamatult juba kogutud tõenditega. Ärge oodake täielikku algpõhjuste analüüsi.

## Oodatav käitumine rikete korral

| Rike | Mis saab jätkuda | Esimene tegevus |
| --- | --- | --- |
| PostgreSQL pole kättesaadav | Staatiline frontend võib endiselt laadida | Taastage andmebaasi tee; ärge taaskäivitage iga rakenduseksemplari |
| Main pole kättesaadav, workerid terved | Sobivad taustatööd ja ajastamine võivad jätkuda, kui ühilduv worker juhib | Taastage main koos püsiva salvestusruumiga; avalikud UI/API/MCP/Portal jäävad kättesaamatuks |
| Worker pole kättesaadav | Teised sobivad eksemplarid võtavad järjekorras olevad tööd üle nende ümbermääramisel | Enne liikluse taastamist kontrollige paigutust, varumahtu ja taastumist |
| Katkestatud käitus | Sobivad taastatavad käitused võivad uuesti käivituda algusest, üks kord | Enne käsitsi kordamist kontrollige automaatset taastumist ja väliseid kõrvalmõjusid |
| Ainult mainile määratud tööde ülekoormus | Workerid võivad jääda jõude | Vähendage probleemset sisendit või suurendage maini mahtu; kaalumuutused ei liiguta seotud töid |
| Sisemine häiresüsteem pole kättesaadav | Väline tööaja/andmebaasi/infrastruktuuri seire võib jätkata tööd | Kasutage Heymi-välist seiret; Heymi häired sõltuvad samast andmebaasist ja ajastajast |
| Sandbox või pakkuja pole kättesaadav | Ilma selle sõltuvuseta workflowd võivad töötada | Isoleerige mõjutatud workflowd ja parandage sõltuvus |

## Taastamine ja intsidendi sulgemine

1. Kontrollige avalikku juurdepääsu, andmebaasi juurdepääsu, eksemplaride kavandatud sobivust ja ohutut tootmisrežiimi kontroll-workflowd (smoke). Test redaktoris ei tõesta tööde saatmist workeritele.
2. Jälgige vähemalt 10 minutit stabiilset vigade taset, latentsust, ressursikasutust ja järjekorra vanuse vähenemist. Jälgige ka järgmist oodatavat kriitilist ajakava või kokkulepitud samaväärset kontrolli.
3. Kooskõlastage ebaõnnestunud, taastatud, vahelejäänud, aegunud ja ootel käitused workflow omanikega. Enne mis tahes toimingu uuesti esitamist kontrollige väliseid kõrvalmõjusid.
4. Tühistage järk-järgult ajutised triggerite pausid, piirangud ja workerite kaalud. Määrake igale järelejäänud piirangule omanik ja aegumisaeg.
5. Uuendage intsidenti mõju, UTC ajajoone, tegevuste, tõendite ja allesjäänud riskidega. Määrake P1/P2 puhul algpõhjuste ülevaatus (post-mortem) ja uuendage mõlemat dokumenti, kui protseduur puudus.

## Seotud operatiivsed viited

- [L1 käskude seadistamine ja kontrollid](./operations-runbook.md#command-setup)
- [Käitamine ja paigaldamine](../getting-started/running-and-deployment.md)
- [Koormuse jaotamine](./cluster.md)
- [Paigaldus Kuberneteses](../getting-started/kubernetes.md)
- [Turvalisus ja võtmete rotatsioon](./security.md)
