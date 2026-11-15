# Heym Incident Playbook (L0)

Izmantojiet šo rokasgrāmatu (playbook), lai apstiprinātu Heym incidentu, novērtētu ietekmi uz lietotājiem, izvēlētos nopietnības līmeni (severity) un piekļūtu pareizajai atjaunošanas procedūrai un atbildīgajam īpašniekam.

Detalizētas procedūras: [Heym Runbook (L1)](./operations-runbook.md)

Pēdējo reizi pārskatīts: 2026-11-10. Darbības joma: self-hosted Heym, viena instance vai cluster, uz Docker Compose vai Kubernetes.

## Izvietošanas nodošana (Deployment handover)

Aizpildiet šo tabulu katrai videi pirms šo dokumentu izmantošanas dežūras laikā (on-call). Nosaukumi, URL, kapacitātes mērķi un atjaunošanas mērķi ir specifiski konkrētajai izvietošanai. Repozitorija piemēri neveido ražošanas inventāru.

| Vienums | Vērtība izvietošanā |
| --- | --- |
| Vide un publiskais Heym URL | `<environment>`, `<public-url>` |
| Platformas dežurants un aizstājējs | `<rotation-or-contact>`, `<backup-contact>` |
| Incidentu kanāls un incidentu izsekotājs | `<channel>`, `<tracker-url>` |
| Datubāzes dežurants un datubāzes identifikators | `<contact>`, `<database-id>` |
| Infrastruktūras, tīkla un krātuves īpašnieki | `<contacts>` |
| Laidiena īpašnieks un izvietošanas sistēma | `<contact>`, `<deployment-url>` |
| Lietojumprogrammas kļūdu, latentuma un pieejamības informācijas panelis | `<dashboard-url>` |
| Resursdatora vai poda CPU, atmiņas, diska un restartu informācijas panelis | `<dashboard-url>` |
| PostgreSQL savienojumu, bloķēšanu, diska un replikācijas informācijas panelis | `<dashboard-url>` |
| Žurnāli un izvēles OTel izsekošanas aizmugursistēma | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose projekts/faili vai Kubernetes konteksts/vārdtelpa | `<exact-target>` |
| Main, workeru, datubāzes un krātuves atrašanās vietas | `<services-or-deployments>`, `<storage-ids>` |
| Apstiprināts pārbaudes (smoke) workflow un paredzamais rezultāts | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Datubāzes un failu dublēšanas procedūra, pēdējais atjaunošanas tests | `<procedure-url>`, `<test-date>` |
| Atkopšanas laika mērķis (RTO) un atkopšanas punkta mērķis (RPO) | `<RTO>`, `<RPO>` |

Glabājiet kontaktus un informācijas paneļu saites izvietošanas ierobežotas piekļuves operatīvajā kopijā. Pierādījumos jāiekļauj ID, laika zīmogi, skaitītāji un attīrītas kļūdas, nevis credentials vai workflow payload dati.

## Platformas inventārs

| Komponents | Atbildība | Ietekme incidenta gadījumā |
| --- | --- | --- |
| Priekšgals un galvenā aizmugursistēma (main) | UI, API, MCP, Portal, interaktīva izpilde | Pārbaudiet publisko maršrutu un galveno procesu atsevišķi |
| PostgreSQL | Lietojumprogrammas stāvoklis, izpildes reģistrs, izpildes rinda, vienlaicības sloti, koordinācija un paziņojumi | Datubāzes pārtraukums var apturēt gan pieprasījumu apstrādi, gan fona izpildi |
| Worker instances, ja ir iespējots cluster režīms | Rindā esošās atbilstošās fona izpildes | Veseli workeri neaizstāj main instances publiskos endpointus |
| Ievēlētais vadītāja (leader) process | Cron, brīdinājumu novērtēšana, fona koordinācija | Saderīgs worker var kļūt par vadītāju; tas nemaina tā lomu uz main |
| Main instances pastāvīgā krātuve | Drive faili, instalētie spraudņi un kodēšanas aģentu darba vietas | Atjaunojiet krātuvi kopā ar main; ingress novirzīšana uz worker to neatjauno |
| Sandbox aizmugursistēma katrā izpildes instancē | Docker konteineri vai Kubernetes podi izolētai izpildei | Bojāta sandbox aizmugursistēma var ietekmēt atlasītos mezglus, kamēr UI darbojas |
| Workflow atkarības | Modeļu nodrošinātāji, MCP serveri, ārējie API, datu krātuves un ziņojumapmaiņas pakalpojumi | Nosakiet, vai kļūme radusies vienā atkarībā vai visā platformā |
| Izvēles OTel savācējs | Eksportētie workflow, mezglu un Agent rīku diapazoni (spans) | Eksportēto izsekojumu trūkums pats par sevi nepierāda izpildes neveiksmi |

Heym iebūvētā izpildes rinda izmanto PostgreSQL. Redis, RabbitMQ un vektoru krātuves var būt workflow atkarības; tie nav obligāti pakalpojumi iebūvētajai rindai.

`GET /api/health` ziņo tikai par procesa veselību un versiju. Tas nepārbauda PostgreSQL, rindu, vadītāja vēlēšanas, sandbox ietilpību vai credentials sinhronizāciju. Pozitīva atbilde ir viena pārbaude, nevis pilnīgas gatavības garantija.

## Pirmās piecas minūtes

| Solis | Darbība | Lēmums vai pierādījums |
| --- | --- | --- |
| 1 | Apstipriniet brīdinājumu un pārbaudiet vidi, pakalpojumu un sākuma laiku | Reģistrējiet UTC laika zīmogus un jaunākās laidiena/konfigurācijas izmaiņas |
| 2 | Pārbaudiet publisko UI un `/api/health`, pēc tam tiešo main aizmugursistēmu | Publiska kļūme ar veselu tiešo aizmugursistēmu norāda uz maršrutēšanas vai UI problēmām |
| 3 | Pārbaudiet PostgreSQL savienojamību un savienojumu noslodzi | Novirziet datubāzes kļūmes uz L1 pirms lietojumprogrammu pakalpojumu restartēšanas |
| 4 | Pārbaudiet konteineru/podu stāvokli, CPU, atmiņu, krātuvi un nesenās kļūdas | Nošķiriet infrastruktūras kļūmi, pārslodzi un workflow specifiskās kļūdas |
| 5 | Cluster režīmā pārbaudiet **Iestatījumi > Instances**, rindu stāvokļus un vadītāja datus | Identificējiet main zudumu, bezsaistes/nesaderīgus workerus vai darbus, kas piesaistīti main |
| 6 | Piešķiriet nopietnības līmeni un sāciet vienu mazināšanas darbību no tabulas | P1/P2 gadījumā nekavējoties atveriet incidentu un iesaistiet attiecīgo īpašnieku |
| 7 | Pārbaudiet drošu ražošanas režīma workflow izpildi un novērojiet atkopšanos | Apstipriniet rindas vecuma, kļūdu un resursu uzlabošanos; iestatiet nākamo atjaunināšanas laiku |

Ja laidiens sakrīt ar kļūmi, pārbaudiet [Kļūdaina izvietošana vai konfigurācijas regresija](./operations-runbook.md#bad-deployment-or-configuration-regression). Pirms atcelšanas pārbaudiet shēmas saderību.

## Nopietnība un reakcija

Šie ir sākotnējie reakcijas mērķi. Piemērojiet izvietošanas incidentu politiku un ietekmi uz uzņēmējdarbību, ja tā ir stingrāka.

| Nopietnība | Piemēri | Reakcija |
| --- | --- | --- |
| P1 | Main nav pieejams nevienam lietotājam; datubāze nav pieejama vai ierakstīšana neizdodas; plaša izpildes kļūme; kritiskā ievade nav pieejama visos workflowos | Tūlītēja seku mazināšana, incidenta ieraksts, platformas un atkarību dežūra |
| P2 | Pieaugoša aizkave rindā; workeru kapacitātes zudums; draudošs savienojumu izsīkums; viens workflow pasliktina kopīgo kapacitāti; atkārtotas OOM avārijas | Nekavējoties sākt seku mazināšanu, mērķis lokalizēt 15 minūtēs, incidenta ieraksts |
| P3 | Izolēta workflow vai nodrošinātāja kļūme; ierobežota ietekme ar veselu platformas kapacitāti | Workflow vai komponenta īpašnieks, izsekota pēcdarbība un dežūras piezīme |
| P4 | Informatīvs signāls, paredzama kapacitātes tendence, pārbaudīts viltus trauksmes signāls | Pieņemt zināšanai, dokumentēt un vajadzības gadījumā pielāgot uzraudzību |

## Signālu maršrutēšana uz L1

Konfigurējot brīdinājumu saites, izmantojiet šos relatīvos enkurus. Ja uzraudzības pakalpojumam nepieciešams absolūts URL, kā prefiksu pievienojiet mitinātās operatīvās kopijas atrašanās vietu.

| Signāls | Sāciet šeit |
| --- | --- |
| UI/API nav pieejams, publiskas 5xx kļūdas, procesa veselības pārbaudes kļūme | [UI vai API nedarbojas](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL nav sasniedzams, savienojums noraidīts, rakstīšanas kļūme | [Datubāze nedarbojas](./operations-runbook.md#postgresql-down-or-not-writable) |
| Pārāk daudz klientu, pūla noildze, bloķēšanas gaidīšana, aktīvo savienojumu pieaugums | [Datubāzes savienojumi un bloķēšanas](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Nepieciešama kontrolēta aizmugursistēmas vai workeru restartēšana | [Pakalpojuma restartēšana](./operations-runbook.md#controlled-service-restart) |
| Izpildes skaita, kopējā ilguma, marķieru, CPU vai atmiņas kāpums | [Visvairāk resursus patērējošie workflowi](./operations-runbook.md#most-resource-consuming-workflows) |
| Pieaugoša rinda, izpildes gaida vai šķietami iestrēgušas | [Rindas uzkrājums (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instance bezsaistē vai nesaderīga, dīkstāves workeris, plānotāja vai sadales problēma | [Cluster režīma pārbaudes](./operations-runbook.md#cluster-mode-checks) |
| Main zaudēts, kamēr workeri paliek veseli | [Main instance nav pieejama](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhook kļūdas, MCP/Portal kļūmes, SSE straumēšanas pārtraukumi | [Ingress un izpildes endpointi](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, pilns disks, Persistent Volume kļūme | [Konteinera, poda vai krātuves problēma](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Agent/LLM/MCP nodrošinātāja kļūdas, kods 429, credentials kļūme | [Modeļa vai integrācijas kļūme](./operations-runbook.md#model-credential-or-integration-failure) |
| Sandbox kļūmes Code, Playwright, skill vai kodēšanas aģentam | [Sandbox kļūme](./operations-runbook.md#sandbox-failure) |
| Atkopšana nevar sasniegt mērķus; zaudēta datubāze vai faili | [Atkopšana un reaģēšana uz katastrofām](./operations-runbook.md#recovery-and-disaster-response) |

## Eskalācija

| Secinājums | Iesaistīt | Sniegt |
| --- | --- | --- |
| Ietekmētas vairākas saskarnes vai workflowi | Platformas dežura un incidenta vadītājs | Vide, tvērums, sākuma laiks, seku mazināšana, nākamais atjauninājums |
| Datubāze nav pieejama, piesātināta, bloķēta vai beidzies disks | Datubāzes dežura | Datubāzes ID, savienojumu skaits, bloķējošie PID, attīrītas kļūdas, diska stāvoklis |
| Poda/mezgla kļūme, krātuves pievienošana, sandbox kapacitāte | Infrastruktūras/krātuves īpašnieks | Konteksts, vārdtelpa, darba slodze, poda notikumi, resursu spiediens |
| Publiskais maršruts neizdodas, kamēr tiešā aizmugursistēma darbojas | Tīkla/ingress īpašnieks | Ietekmētie maršruti, statusa kodi, latentums, salīdzinājums ar backend |
| Viens workflow dominē slodzē vai neizdodas izolēti | Attiecīgā workflow īpašnieks | Workflow/izpildes ID, trigger avots, ātrums, laika logs, pagaidu ierobežojumi |
| Korelētas izvietošanas vai konfigurācijas izmaiņas | Laidiena īpašnieks | Darbojošā attēla kopsavilkums (digest), ieviešanas laiks, shēmas versija, pēdējais zināmais labais laidiens |
| Nodrošinātāja kvota, autentifikācija vai pieejamība | Credential vai integrācijas īpašnieks | Nodrošinātājs, modelis/pakalpojums, statusa kods, pieprasījuma ID, ja drošs; bez noslēpumiem |

Ja P1/P2 līmeņa ietekme saglabājas pēc pirmā mazināšanas pasākuma, nekavējoties eskalējiet ar jau savāktajiem pierādījumiem. Negaidiet pilnīgu pamatcēloņu analīzi.

## Paredzamā uzvedība kļūmju gadījumā

| Kļūme | Kas var turpināties | Pirmā darbība |
| --- | --- | --- |
| PostgreSQL nav pieejams | Statiskais priekšgals joprojām var ielādēties | Atjaunojiet datubāzes ceļu; nepārstartējiet katru lietojumprogrammas instanci |
| Main nav pieejams, workeri veseli | Atbilstošie fona darbi un plānošana var turpināties, ja vada saderīgs workeris | Atjaunojiet main ar tā pastāvīgo krātuvi; publiskie UI/API/MCP/Portal paliek nepieejami |
| Workeris nav pieejams | Citas atbilstošās instances pārņem rindā esošos darbus to pārdales laikā | Pirms satiksmes atjaunošanas pārbaudiet izvietojumu, rezerves kapacitāti un atkopšanos |
| Pārtraukta izpilde | Atbilstošās atkopjamās izpildes var restartēties no sākuma, vienu reizi | Pirms manuālas atkārtošanas pārbaudiet automātisko atkopšanu un ārējās blakusparādības |
| Tikai main paredzēto darbu pārslodze | Workeri var palikt dīkstāvē | Samaziniet problemātisko ievadi vai palieliniet main kapacitāti; svara izmaiņas nepārvieto piesaistīto darbu |
| Iekšējā trauksmes sistēma nav pieejama | Ārējā darbspējas laika/datubāzes/infrastruktūras uzraudzība var turpināt darboties | Izmantojiet uzraudzību ārpus Heym; Heym brīdinājumi ir atkarīgi no tās pašas datubāzes un plānotāja |
| Sandbox vai nodrošinātājs nav pieejams | Workflowi bez šīs atkarības var darboties | Izolējiet ietekmētos workflowus un novērsiet atkarību |

## Atkopšana un incidenta slēgšana

1. Pārbaudiet publisko piekļuvi, piekļuvi datubāzei, instanču paredzēto atbilstību un drošu pārbaudes (smoke) workflow ražošanas režīmā. Pārbaude redaktorā nepierāda nosūtīšanu workeriem.
2. Novērojiet vismaz 10 minūtes stabilu kļūdu līmeni, latentumu, resursu izmantošanu un rindas vecuma samazināšanos. Novērojiet arī nākamo gaidāmo kritisko grafiku vai saskaņotu līdzvērtīgu pārbaudi.
3. Saskaņojiet neveiksmīgās, atgūtās, izlaistās, beigušās un gaidošās izpildes ar workflow īpašniekiem. Pirms atkārtotas darbības pārbaudiet ārējās blakusparādības.
4. Pakāpeniski atceliet pagaidu trigger pauzes, ierobežojumus un workeru svarus. Katram atlikušajam ierobežojumam piešķiriet īpašnieku un derīguma termiņu.
5. Atjauniniet incidentu ar ietekmi, UTC laika skalu, darbībām, pierādījumiem un atlikušajiem riskiem. Piešķiriet pamatcēloņu pārskatīšanu (post-mortem) P1/P2 un atjauniniet abus dokumentus, ja trūka kādas procedūras.

## Saistītās operatīvās atsauces

- [L1 komandu iestatīšana un pārbaudes](./operations-runbook.md#command-setup)
- [Darbība un izvietošana](../getting-started/running-and-deployment.md)
- [Slodzes sadale](./cluster.md)
- [Izvietošana operētājsistēmā Kubernetes](../getting-started/kubernetes.md)
- [Drošība un atslēgu rotācija](./security.md)
