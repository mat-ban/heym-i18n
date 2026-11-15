# Heym Incident Playbook (L0)

Naudokite šį vadovą (playbook), kad patvirtintumėte Heym incidentą, įvertintumėte poveikį naudotojams, pasirinktumėte sunkumo lygį (severity) bei pasiektumėte tinkamą atkūrimo procedūrą ir atsakingą savininką.

Išsamios procedūros: [Heym Runbook (L1)](./operations-runbook.md)

Paskutinį kartą peržiūrėta: 2026-11-10. Apimtis: savarankiškai priglobtas (self-hosted) Heym, atskiras egzempliorius arba cluster, Docker Compose arba Kubernetes platformoje.

## Diegimo perdavimas (Deployment handover)

Prieš naudodami šiuos dokumentus budėjimo metu (on-call), užpildykite šią lentelę kiekvienai aplinkai. Pavadinimai, URL, pajėgumų tikslai ir atkūrimo tikslai priklauso nuo konkretaus diegimo. Repozitorijos pavyzdžiai nėra gamybinis inventorius.

| Elementas | Reikšmė diegime |
| --- | --- |
| Aplinka ir viešasis Heym URL | `<environment>`, `<public-url>` |
| Platformos budėtojas ir pavaduotojas | `<rotation-or-contact>`, `<backup-contact>` |
| Incidento kanalas ir incidentų sekiklis | `<channel>`, `<tracker-url>` |
| Duomenų bazės budėtojas ir duomenų bazės identifikatorius | `<contact>`, `<database-id>` |
| Infrastruktūros, tinklo ir saugyklos savininkai | `<contacts>` |
| Laidos savininkas ir diegimo sistema | `<contact>`, `<deployment-url>` |
| Programos klaidų, delsos ir pasiekiamumo prietaisų skydelis | `<dashboard-url>` |
| Pagrindinio kompiuterio ar podo CPU, atminties, disko ir paleidimų iš naujo skydelis | `<dashboard-url>` |
| PostgreSQL ryšių, užraktų, disko ir replikacijos prietaisų skydelis | `<dashboard-url>` |
| Žurnalai ir pasirenkama OTel sekimo vidinė sistema | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose projektas/failai arba Kubernetes kontekstas/vardų erdvė | `<exact-target>` |
| Main, workerių, duomenų bazės ir saugyklos vietos | `<services-or-deployments>`, `<storage-ids>` |
| Patvirtintas bandomasis (smoke) workflow ir laukiamas rezultatas | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Duomenų bazės ir failų atsarginių kopijų kūrimo procedūra, paskutinis atkūrimo testas | `<procedure-url>`, `<test-date>` |
| Atkūrimo laiko tikslas (RTO) ir atkūrimo taško tikslas (RPO) | `<RTO>`, `<RPO>` |

Kontaktus ir prietaisų skydelių nuorodas laikykite diegimo apribotos prieigos operatyvinėje kopijoje. Įrodymuose turi būti ID, laiko žymos, skaitikliai ir išvalytos klaidos, o ne credentials ar workflow payload duomenys.

## Platformos inventorius

| Komponentas | Atsakomybė | Poveikis incidento metu |
| --- | --- | --- |
| Priekinė dalis ir pagrindinė vidinė sistema (main) | UI, API, MCP, Portal, interaktyvus vykdymas | Viešąjį maršrutą ir pagrindinį procesą tikrinkite atskirai |
| PostgreSQL | Programos būsena, vykdymo registras, vykdymo eilė, lygiagretumo lizdai, koordinavimas ir pranešimai | Duomenų bazės triktis gali sustabdyti ir užklausų apdorojimą, ir vykdymą fone |
| Worker egzemplioriai, kai įjungtas cluster režimas | Eilėje laukiantys reikalavimus atitinkantys foniniai vykdymai | Veikiantys workeriai nepakeičia main egzemplioriaus viešųjų endpointų |
| Išrinktas lyderio (leader) procesas | Cron, įspėjimų vertinimas, foninis koordinavimas | Suderinamas workeris gali tapti lyderiu; tai nekeičia jo vaidmens į main |
| Main egzemplioriaus nuolatinė saugykla | Drive failai, įdiegti papildiniai ir kodavimo agentų darbo sritys | Atkurkite saugyklą kartu su main; ingress nukreipimas į workerį jos neatkuria |
| Sandbox vidinė sistema kiekviename vykdymo egzemplioriuje | Docker konteineriai arba Kubernetes podai izoliuotam vykdymui | Sugedusi sandbox vidinė sistema gali paveikti pasirinktus mazgus, kol UI veikia |
| Workflow priklausomybės | Modelių teikėjai, MCP serveriai, išorinės API, duomenų saugyklos ir pranešimų siuntimo paslaugos | Nustatykite, ar sugenda viena priklausomybė, ar visa platforma |
| Pasirenkamas OTel rinkiklis | Eksportuoti workflow, mazgų ir Agent įrankių intervalai (spans) | Vien eksportuotų pėdsakų trūkumas neįrodo vykdymo nesėkmės |

Heym integruota vykdymo eilė naudoja PostgreSQL. Redis, RabbitMQ ir vektorinės saugyklos gali būti workflow priklausomybės; jos nėra privalomos paslaugos integruotai eilei.

`GET /api/health` praneša tik apie proceso būklę ir versiją. Ji netikrina PostgreSQL, eilės, lyderio rinkimų, sandbox pajėgumo ar credentials sinchronizavimo. Teigiamas atsakymas yra vienas patikrinimas, o ne visiško pasirengimo garantija.

## Pirmosios penkios minutės

| Žingsnis | Veiksmas | Sprendimas arba įrodymas |
| --- | --- | --- |
| 1 | Patvirtinkite įspėjimą ir patikrinkite aplinką, paslaugą bei pradžios laiką | Užregistruokite UTC laiko žymas ir naujausią laidos/konfigūracijos pakeitimą |
| 2 | Patikrinkite viešąjį UI ir `/api/health`, tada tiesioginę main vidinę sistemą | Vieša triktis veikiant tiesioginei sistemai rodo maršruto parinkimo arba UI problemas |
| 3 | Patikrinkite PostgreSQL ryšį ir ryšių apkrovą | Prieš paleisdami programų paslaugas iš naujo, nukreipkite duomenų bazės triktis į L1 |
| 4 | Patikrinkite konteinerių/podų būseną, CPU, atmintį, saugyklą ir naujausias klaidas | Atskirkite infrastruktūros gedimą, perkrovą ir konkretaus workflow klaidas |
| 5 | Cluster režimu patikrinkite **Nustatymai > Egzemplioriai**, eilių būsenas ir lyderio duomenis | Nustatykite main praradimą, neprisijungusius/nesuderinamus workerius ar main skirtus darbus |
| 6 | Priskirkite sunkumo lygį ir pradėkite vieną švelninimo veiksmą iš maršruto parinkimo lentelės | P1/P2 atveju nedelsdami atidarykite incidentą ir įtraukite atitinkamą savininką |
| 7 | Patikrinkite saugų gamybinio režimo workflow vykdymą ir stebėkite atsigavimą | Patvirtinkite, kad eilės amžius, klaidos ir ištekliai gerėja; nustatykite kito atnaujinimo laiką |

Jei laida sutampa su triktimi, peržiūrėkite [Klaidingas diegimas arba konfigūracijos regresija](./operations-runbook.md#bad-deployment-or-configuration-regression). Prieš atšaukimą patikrinkite schemos suderinamumą.

## Sunkumas ir atsakas

Tai yra pradiniai reagavimo tikslai. Taikykite diegimo incidentų politiką ir poveikį verslui, jei jie griežtesni.

| Sunkumas | Pavyzdžiai | Atsakas |
| --- | --- | --- |
| P1 | Main nepasiekiamas visiems naudotojams; duomenų bazė nepasiekiama arba nepavyksta įrašyti; masinė vykdymo nesėkmė; kritinis įvesties srautas nepasiekiamas visuose workflow | Neatidėliotinas švelninimas, incidento įrašas, platformos ir priklausomybių budėjimas |
| P2 | Augantis vėlavimas eilėje; prarasti workerio pajėgumai; gresiantis ryšių išsekimas; vienas workflow blogina bendrą pajėgumą; pasikartojančios OOM avarijos | Nedelsiant pradėti švelninimą, siekti lokalizavimo per 15 minučių, incidento įrašas |
| P3 | Izoliuota workflow arba teikėjo triktis; ribotas poveikis esant geram platformos pajėgumui | Workflow arba komponento savininkas, stebimas tolesnis veiksmas ir budėjimo pastaba |
| P4 | Informacinis signalas, laukiama pajėgumo tendencija, patvirtintas klaidingas aliarmas | Priimti žiniai, dokumentuoti ir prireikus suderinti stebėjimą |

## Signalų nukreipimas į L1

Konfigūruodami įspėjimų nuorodas, naudokite šiuos santykinius inkarus. Kai stebėjimo paslaugai reikalingas absoliutus URL, kaip priešdėlį nurodykite priglobtos operatyvinės kopijos vietą.

| Signalas | Pradėkite čia |
| --- | --- |
| UI/API nepasiekiamas, viešos 5xx klaidos, proceso būklės patikrinimo nesėkmė | [UI arba API neveikia](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL nepasiekiamas, ryšys atmestas, įrašymo klaida | [Duomenų bazė neveikia](./operations-runbook.md#postgresql-down-or-not-writable) |
| Per daug klientų, telkinio skirtasis laikas, laukimas užraktų, aktyvių ryšių šuolis | [Duomenų bazės ryšiai ir užraktai](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Reikalingas kontroliuojamas vidinės sistemos arba workerio paleidimas iš naujo | [Paslaugos paleidimas iš naujo](./operations-runbook.md#controlled-service-restart) |
| Vykdymų skaičiaus, bendros trukmės, žetonų, CPU ar atminties šuolis | [Daugiausiai išteklių vartojantys workflow](./operations-runbook.md#most-resource-consuming-workflows) |
| Auganti eilė, laukiantys arba atrodantys užstrigę vykdymai | [Eilės atsilikimas (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Egzempliorius neprisijungęs arba nesuderinamas, neveikiantis workeris, planavimo ar paskirstymo problema | [Cluster režimo patikrinimai](./operations-runbook.md#cluster-mode-checks) |
| Prarastas main, kol workeriai lieka veikiantys | [Main egzempliorius nepasiekiamas](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhook klaidos, MCP/Portal triktys, SSE srautinio perdavimo nutrūkimai | [Ingress ir vykdymo endpointai](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, pilnas diskas, Persistent Volume triktis | [Konteinerio, podo ar saugyklos problema](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Agent/LLM/MCP teikėjo klaidos, kodas 429, credentials triktis | [Modelio arba integracijos triktis](./operations-runbook.md#model-credential-or-integration-failure) |
| Sandbox triktys Code, Playwright, skill ar kodavimo agentui | [Sandbox triktis](./operations-runbook.md#sandbox-failure) |
| Atkūrimas negali pasiekti tikslų; prarasta duomenų bazė ar failai | [Atkūrimas ir reagavimas į nelaimes](./operations-runbook.md#recovery-and-disaster-response) |

## Eskalavimas

| Išvada | Įtraukti | Pateikti |
| --- | --- | --- |
| Paveiktos kelios sąsajos arba workflow | Platformos budėtojas ir incidento vadovas | Aplinka, apimtis, pradžios laikas, švelninimo veiksmai, kitas atnaujinimas |
| Duomenų bazė nepasiekiama, prisotinta, užrakinta arba baigėsi diskas | Duomenų bazės budėtojas | DB ID, ryšių skaičius, blokuojantys PID, išvalytos klaidos, disko būsena |
| Podo/mazgo triktis, saugyklos prijungimas, sandbox pajėgumas | Infrastruktūros/saugyklos savininkas | Kontekstas, vardų erdvė, darbo krūvis, podo įvykiai, išteklių spaudimas |
| Viešasis maršrutas nepavyksta, kai tiesioginė vidinė sistema veikia | Tinklo/ingress savininkas | Paveikti maršrutai, būsenos kodai, delsa, palyginimas su backend |
| Vienas workflow dominuoja apkrovoje arba sugenda izoliuotai | Atitinkamo workflow savininkas | Workflow/vykdymo ID, trigger šaltinis, dažnis, laiko langas, laikini apribojimai |
| Koreliuojantis diegimo arba konfigūracijos pakeitimas | Laidos savininkas | Veikiančio atvaizdo santrauka (digest), diegimo laikas, schemos versija, paskutinė žinoma gera laida |
| Teikėjo kvota, autentifikavimas arba pasiekiamumas | Credential arba integracijos savininkas | Teikėjas, modelis/paslauga, būsenos kodas, užklausos ID, jei saugu; be paslapčių |

Jei P1/P2 lygio poveikis išlieka po pirmosios švelninimo priemonės, nedelsdami eskaluokite su jau surinktais įrodymais. Nelaukite išsamios pagrindinių priežasčių analizės.

## Laukiamas elgesys gedimų metu

| Triktis | Kas gali tęstis | Pirmasis veiksmas |
| --- | --- | --- |
| PostgreSQL nepasiekiamas | Statinė priekinė dalis vis tiek gali įsikelti | Atkurkite duomenų bazės kelią; neperkraukite kiekvieno programos egzemplioriaus |
| Main nepasiekiamas, workeriai veikia | Tinkami foniniai darbai ir planavimas gali tęstis, jei vadovauja suderinamas workeris | Atkurkite main su jo nuolatine saugykla; viešieji UI/API/MCP/Portal lieka nepasiekiami |
| Workeris nepasiekiamas | Kiti tinkami egzemplioriai perima darbus eilėje jų perskirstymo metu | Prieš atkurdami srautą patikrinkite išdėstymą, rezervinį pajėgumą ir atsigavimą |
| Nutrauktas vykdymas | Tinkami atkuriami vykdymai gali būti paleisti iš naujo nuo pradžių vieną kartą | Prieš pakartotinį paleidimą rankiniu būdu patikrinkite automatinį atkūrimą ir išorinius šalutinius poveikius |
| Tik main skirtų darbų perkrova | Workeriai gali likti nenaudojami | Sumažinkite probleminį srautą arba padidinkite main pajėgumą; svorio pakeitimai neperkelia pririštų darbų |
| Vidinė įspėjimų sistema nepasiekiama | Išorinė veikimo laiko/DB/infrastruktūros stebėsena gali veikti toliau | Naudokite stebėjimą už Heym ribų; Heym įspėjimai priklauso nuo tos pačios DB ir planuoklio |
| Sandbox arba teikėjas nepasiekiamas | Workflow be šios priklausomybės gali veikti | Izoliuokite paveiktus workflow ir ištaisykite priklausomybę |

## Atkūrimas ir incidento užbaigimas

1. Patikrinkite viešąją prieigą, prieigą prie duomenų bazės, numatytą egzempliorių tinkamumą ir saugų bandomąjį (smoke) workflow gamybiniu režimu. Testas redaktoriuje neįrodo siuntimo workeriams.
2. Stebėkite bent 10 minučių stabilius klaidų rodiklius, delsą, išteklių naudojimą ir mažėjantį eilės amžių. Taip pat stebėkite kitą numatytą kritinį tvarkaraštį arba sutartą lygiavertį patikrinimą.
3. Suderinkite nepavykusius, atkurtus, praleistus, pasibaigusius ir laukiančius vykdymus su workflow savininkais. Prieš pakartotinai atlikdami bet kokį veiksmą patikrinkite išorinius šalutinius poveikius.
4. Palaipsniui panaikinkite laikinas triggerių pauzes, ribas ir workerių svorius. Kiekvienam likusiam apribojimui priskirkite savininką ir galiojimo laiką.
5. Atnaujinkite incidentą nurodydami poveikį, UTC laiko juostą, veiksmus, įrodymus ir likusias rizikas. Priskirkite pagrindinių priežasčių peržiūrą (post-mortem) P1/P2 atvejams ir atnaujinkite abu dokumentus, jei trūko procedūros.

## Susijusios operatyvinės nuorodos

- [L1 komandų nustatymas ir patikrinimai](./operations-runbook.md#command-setup)
- [Veikimas ir diegimas](../getting-started/running-and-deployment.md)
- [Apkrovos paskirstymas](./cluster.md)
- [Diegimas Kubernetes platformoje](../getting-started/kubernetes.md)
- [Saugumas ir raktų rotacija](./security.md)
