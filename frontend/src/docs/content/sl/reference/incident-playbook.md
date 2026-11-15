# Heym Incident Playbook (L0)

Uporabite ta playbook za potrditev incidenta v Heymu, oceno vpliva na uporabnike, izbiro resnosti (severity) ter doseganje ustreznega postopka obnove in pristojnega lastnika.

Podrobni postopki: [Heym Runbook (L1)](./operations-runbook.md)

Zadnji pregled: 2026-11-10. Obseg: self-hosted Heym, posamezna instanca ali cluster, na Docker Compose ali Kubernetesu.

## Predaja namestitve (Deployment handover)

Pred uporabo teh dokumentov med dežurstvom (on-call) izpolnite to tabelo za vsako okolje. Imena, URL-ji, ciljne zmogljivosti in cilji obnove so specifični za posamezno namestitev. Primeri v repozitoriju ne predstavljajo produkcijskega inventarja.

| Postavka | Vrednost v namestitvi |
| --- | --- |
| Okolje in javni URL Heyma | `<environment>`, `<public-url>` |
| Dežurni za platformo in namestnik | `<rotation-or-contact>`, `<backup-contact>` |
| Kanal incidenta in sledilnik incidentov | `<channel>`, `<tracker-url>` |
| Dežurni za bazo podatkov in identifikator baze | `<contact>`, `<database-id>` |
| Lastniki infrastrukture, omrežja in shrambe | `<contacts>` |
| Lastnik izdaje in sistem nameščanja | `<contact>`, `<deployment-url>` |
| Nadzorna plošča za napake aplikacije, zakasnitev in razpoložljivost | `<dashboard-url>` |
| Nadzorna plošča za procesor, pomnilnik, disk in ponovne zagone gostitelja ali poda | `<dashboard-url>` |
| Nadzorna plošča za povezave, zaklepe, disk in replikacijo PostgreSQL | `<dashboard-url>` |
| Dnevniki in opcijski zaledni sistem za sledenje OTel | `<logs-url>`, `<trace-url-or-disabled>` |
| Projekt/datoteke Compose ali kontekst/namespace Kubernetesa | `<exact-target>` |
| Lokacije main, workerjev, baze podatkov in shrambe | `<services-or-deployments>`, `<storage-ids>` |
| Odobren preizkusni (smoke) workflow in pričakovani rezultat | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Postopek varnostnega kopiranja baze in datotek, zadnji preizkus obnovitve | `<procedure-url>`, `<test-date>` |
| Cilji časa obnovitve (RTO) in točke obnovitve (RPO) | `<RTO>`, `<RPO>` |

Stike in povezave do nadzornih plošč hranite v zaščiteni operativni kopiji namestitve. Dokazila morajo vsebovati identifikatorje, časovne žige, števce in prečiščene napake namesto poverilnic ali payloadov workflowa.

## Inventar platforme

| Komponenta | Odgovornost | Vpliv pri incidentu |
| --- | --- | --- |
| Frontend in glavno zaledje (main) | UI, API, MCP, Portal, interaktivno izvajanje | Ločeno preverite javno pot in glavni proces |
| PostgreSQL | Stanje aplikacije, register izvajanj, čakalna vrsta izvajanj, reže za sočasnost, koordinacija in obvestila | Izpad baze podatkov lahko ustavi tako obdelavo zahtev kot izvajanje v ozadju |
| Instance workerjev, ko je omogočen način cluster | Upravičena izvajanja v ozadju, ki čakajo v vrsti | Brezhibni workerji ne nadomeščajo javnih endpointov instance main |
| Izvoljeni proces vodje (leader) | Cron, vrednotenje opozoril, koordinacija v ozadju | Združljiv worker lahko postane vodja; to ne spremeni njegove vloge v main |
| Trajna shramba instance main | Datoteke Drive, nameščeni vtičniki in delovni prostori agentov za kodiranje | Shrambo obnovite skupaj z main; usmerjanje ingressa na workerja je ne obnovi |
| Zaledje sandboxa na vsaki izvajalni instanci | Vsebniki Docker ali podi Kubernetesa za izolirano izvajanje | Okvarjeno zaledje sandboxa lahko vpliva na izbrana vozlišča, medtem ko UI deluje |
| Odvisnosti workflowa | Ponudniki modelov, strežniki MCP, zunanji API-ji, shrambe podatkov in storitve sporočanja | Ugotovite, ali odpoveduje posamezna odvisnost ali celotna platforma |
| Izbirni zbiralnik OTel | Izvoženi razponi (spans) workflowa, vozlišč in orodij Agenta | Samo pomanjkanje izvoženih sledi ne dokazuje neuspeha izvajanja |

Heymova vgrajena čakalna vrsta izvajanj uporablja PostgreSQL. Redis, RabbitMQ in vektorske shrambe so lahko odvisnosti workflowa; niso obvezne storitve za vgrajeno čakalno vrsto.

`GET /api/health` poroča le o stanju procesa in različici. Ne preizkuša PostgreSQL, čakalne vrste, izvolitve vodje, zmogljivosti sandboxa ali sinhronizacije credentials. Pozitiven odgovor je posamezno preverjanje, ne pa zagotovilo popolne operativne pripravljenosti.

## Prvih pet minut

| Korak | Dejanje | Odločitev ali dokazilo |
| --- | --- | --- |
| 1 | Potrdite opozorilo ter preverite okolje, storitev in čas začetka | Zabeležite časovne žige UTC in najnovejšo spremembo izdaje/konfiguracije |
| 2 | Preverite javni UI in `/api/health`, nato neposredno glavno zaledje (main) | Javni izpad ob delujočem neposrednem zaledju nakazuje težave z usmerjanjem ali frontendom |
| 3 | Preverite povezljivost PostgreSQL in obremenitev povezav | Pred ponovnim zagonom aplikacijskih storitev usmerite napake baze podatkov na L1 |
| 4 | Preverite stanje vsebnikov/podov, procesor, pomnilnik, disk in nedavne napake | Razmejite napako infrastrukture, preobremenitev in napake, specifične za workflow |
| 5 | V načinu cluster preverite **Nastavitve > Instance**, stanja vrst in dokazila vodje | Prepoznajte izgubo main, nedelujoče/neskladne workerje ali opravila, vezana izključno na main |
| 6 | Določite resnost in sprožite en blažilni ukrep iz tabele usmerjanja | Pri P1/P2 takoj odprite incident in vključite ustreznega lastnika |
| 7 | Preverite varno izvajanje produkcijskega workflowa in spremljajte okrevanje | Potrdite izboljšanje starosti vrste, napak in virov; določite čas naslednje posodobitve |

Če izdaja časovno sovpada z napako, preučite [Napačna namestitev ali regresija konfiguracije](./operations-runbook.md#bad-deployment-or-configuration-regression). Pred razveljavitvijo sprememb preverite združljivost sheme.

## Resnost in odziv

To so izhodiščni cilji odziva. Uveljavite pravilnik o incidentih in poslovni vpliv posamezne namestitve, če sta strožja.

| Resnost | Primeri | Odziv |
| --- | --- | --- |
| P1 | Main ni na voljo vsem uporabnikom; baza podatkov ni na voljo ali zapisi ne uspejo; obsežen neuspeh izvajanja; kritični vnos ni na voljo v vseh workflowih | Takojšnje blaženje, evidenca incidenta, dežurstvo za platformo in odvisnosti |
| P2 | Naraščajoč zaostanek v čakalni vrsti; izguba zmogljivosti workerjev; bližajoče se izčrpanje povezav; en workflow poslabšuje skupno zmogljivost; ponavljajoči se zruški OOM | Takojšen začetek blaženja, cilj obvladovanja v 15 minutah, evidenca incidenta |
| P3 | Izolirana napaka workflowa ali ponudnika; omejen vpliv ob ohranjeni zmogljivosti platforme | Lastnik workflowa ali komponente, evidentirano nadaljnje ukrepanje in zaznamek dežurnega |
| P4 | Informativni signal, pričakovan trend zmogljivosti, preverjen lažni alarm | Seznanitev, dokumentiranje in po potrebi prilagoditev nadzora |

## Usmerjanje signalov na L1

Pri konfiguriranju povezav opozoril uporabite ta relativna sidra. Če nadzorna storitev zahteva absolutni URL, kot predpono dodajte lokacijo svoje gostovane operativne kopije.

| Signal | Začnite tukaj |
| --- | --- |
| UI/API ni na voljo, javne napake 5xx, neuspeh preverjanja stanja procesa | [Izpad UI ali API-ja](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL nedosegljiv, povezava zavrnjena, napaka pri pisanju | [Izpad baze podatkov](./operations-runbook.md#postgresql-down-or-not-writable) |
| Preveč odjemalcev, časovna omejitev sklada, čakanje na zaklepe, skok aktivnih povezav | [Povezave in zaklepi baze podatkov](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Zahtevan nadzorovan ponovni zagon zaledja ali workerjev | [Ponovni zagon storitve](./operations-runbook.md#controlled-service-restart) |
| Skok v številu izvajanj, skupnem trajanju, žetonih, procesorju ali pomnilniku | [Workflowi z največjo porabo virov](./operations-runbook.md#most-resource-consuming-workflows) |
| Naraščajoča čakalna vrsta, izvajanja na čakanju ali navidezno zataknjena | [Zaostanek v čakalni vrsti (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instanca brez povezave ali neskladna, nedejaven worker, težava z razporejevalnikom ali distribucijo | [Preverjanja načina cluster](./operations-runbook.md#cluster-mode-checks) |
| Izguba main, medtem ko workerji ostajajo brezhibni | [Glavna instanca ni na voljo](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Napake Webhookov, okvare MCP/Portala, prekinitve pretakanja SSE | [Endpointi ingressa in izvajanja](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, poln disk, odpoved trajnega nosilca | [Težava z vsebnikom, podom ali shrambo](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Napake ponudnika Agenta/LLM/MCP, koda 429, neuspeh credentials | [Napaka modela ali integracije](./operations-runbook.md#model-credential-or-integration-failure) |
| Napake sandboxa pri Code, Playwright, skill ali agentu za kodiranje | [Napaka sandboxa](./operations-runbook.md#sandbox-failure) |
| Obnova ne more doseči ciljev; izgubljena baza podatkov ali datoteke | [Obnova in odziv na nesreče](./operations-runbook.md#recovery-and-disaster-response) |

## Eskalacija

| Ugotovitev | Vključiti | Predložiti |
| --- | --- | --- |
| Prizadetih več vmesnikov ali workflowov | Dežurni za platformo in vodja incidenta | Okolje, obseg, čas začetka, ukrepi blaženja, naslednja posodobitev |
| Baza podatkov ni na voljo, nasičena, zaklenjena ali zmanjkalo diska | Dežurni za bazo podatkov | ID baze, število povezav, blokirajoči PID-ji, prečiščene napake, stanje diska |
| Okvara poda/vozlišča, pripenjanje shrambe, zmogljivost sandboxa | Lastnik infrastrukture/shrambe | Kontext, namespace, delovna obremenitev, dogodki poda, pritisk na vire |
| Javna pot odpove, medtem ko neposredno zaledje deluje | Lastnik omrežja/ingressa | Prizadete poti, statusne kode, zakasnitev, primerjava z zaledjem |
| En sam workflow prevladuje pri obremenitvi ali odpove izolirano | Lastnik dotičnega workflowa | ID-ji workflowa/izvajanja, vir triggerja, hitrost, časovno okno, začasne omejitve |
| Povezana sprememba namestitve ali konfiguracije | Lastnik izdaje | Zgoščena vrednost (digest) aktivne slike, čas namestitve, revizija sheme, zadnja dobra izdaja |
| Kvota, preverjanje pristnosti ali razpoložljivost ponudnika | Lastnik credentiala ali integracije | Ponudnik, model/storitev, statusna koda, ID zahteve, če je varno; brez skrivnih vrednosti |

Če vpliv ravni P1/P2 po prvem blažilnem ukrepu ne popusti, takoj stopnjujte težavo z že zbranimi dokazi. Ne čakajte na popolno analizo temeljnega vzroka.

## Pričakovano vedenje ob izpadih

| Napaka | Kaj lahko nadaljuje z delovanjem | Prvo dejanje |
| --- | --- | --- |
| PostgreSQL ni na voljo | Statični frontend se lahko še vedno naloži | Obnovite pot do baze podatkov; ne zaganjajte znova vsake instance aplikacije |
| Main ni na voljo, workerji brezhibni | Upravičena opravila v ozadju in razporejanje se lahko nadaljujejo, če vodi združljiv worker | Obnovite main z njegovo trajno shrambo; javni UI/API/MCP/Portal ostajajo nedostopni |
| Worker ni na voljo | Druge upravičene instance prevzamejo opravila v čakalni vrsti ob njihovi prerazporeditvi | Pred ponovno uvedbo prometa preverite razporeditev, rezervno zmogljivost in okrevanje |
| Prekinjeno izvajanje | Upravičena obnovljiva izvajanja se lahko znova zaženejo od začetka, enkrat | Pred ročnim ponavljanjem preverite samodejno obnovitev in zunanje stranske učinke |
| Preobremenitev z opravili, vezanimi izključno na main | Workerji lahko ostanejo nedejavni | Zmanjšajte sporni vnos ali povečajte zmogljivost main; spremembe uteži ne premaknejo vezanega dela |
| Notranje opozarjanje ni na voljo | Zunanji nadzor razpoložljivosti/baze/infrastrukture lahko še naprej deluje | Uporabite nadzor zunaj Heyma; Heymova opozorila so odvisna od iste baze in razporejevalnika |
| Sandbox ali ponudnik ni na voljo | Workflowi brez te odvisnosti lahko delujejo | Izolirajte prizadete workflowe in popravite odvisnost |

## Obnova in zaključek incidenta

1. Preverite javni dostop, dostop do baze podatkov, predvideno upravičenost instanc in varen preizkusni (smoke) workflow v produkcijskem načinu. Preizkus v urejevalniku ne dokazuje razpošiljanja na workerje.
2. Vsaj 10 minut opazujte stabilnost napak, zakasnitve, porabe virov in zmanjševanje starosti čakalne vrste. Spremljajte tudi naslednji pričakovani kritični urnik ali dogovorjen enakovreden preizkus.
3. Z lastniki workflowov uskladite neuspela, obnovljena, preskočena, potekla in čakajoča izvajanja. Pred ponovnim zagonom katerega koli postopka preverite zunanje stranske učinke.
4. Postopoma odpravite začasne premore triggerjev, omejitve in uteži workerjev. Vsaki preostali omejitvi dodelite lastnika in čas veljavnosti.
5. Incident posodobite z vplivom, časovnico UTC, ukrepi, dokazili in odprtimi tveganji. Za P1/P2 določite pregled temeljnega vzroka (post-mortem) in posodobite oba dokumenta, če je kateri koli postopek manjkal.

## Povezane operativne reference

- [Nastavitev ukazov L1 in preverjanja](./operations-runbook.md#command-setup)
- [Delovanje in namestitev](../getting-started/running-and-deployment.md)
- [Porazdelitev obremenitve](./cluster.md)
- [Namestitev na Kubernetesu](../getting-started/kubernetes.md)
- [Varnost in menjava ključev](./security.md)
