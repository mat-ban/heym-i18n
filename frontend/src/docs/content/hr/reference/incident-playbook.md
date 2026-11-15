# Heym Incident Playbook (L0)

Koristite ovaj playbook za potvrdu Heym incidenta, procjenu utjecaja na korisnike, odabir razine ozbiljnosti (severity) te pronalaženje odgovarajućeg postupka oporavka i mjerodavnog vlasnika.

Detaljni postupci: [Heym Runbook (L1)](./operations-runbook.md)

Posljednja provjera: 2026-11-10. Opseg: self-hosted Heym, pojedinačna instanca ili cluster, na Docker Compose ili Kubernetesu.

## Primopredaja implementacije (Deployment handover)

Ispunite ovu tablicu za svako okruženje prije korištenja ovih dokumenata tijekom dežurstva (on-call). Nazivi, URL-ovi, ciljevi kapaciteta i ciljevi oporavka specifični su za pojedinu implementaciju. Primjeri iz repozitorija ne predstavljaju produkcijski inventar.

| Stavka | Vrijednost u implementaciji |
| --- | --- |
| Okruženje i javni Heym URL | `<environment>`, `<public-url>` |
| Dežurni za platformu i zamjena | `<rotation-or-contact>`, `<backup-contact>` |
| Kanal incidenta i sustav praćenja incidenta | `<channel>`, `<tracker-url>` |
| Dežurni za bazu podataka i identifikator baze | `<contact>`, `<database-id>` |
| Vlasnici infrastrukture, mreže i pohrane | `<contacts>` |
| Vlasnik izdanja i sustav implementacije | `<contact>`, `<deployment-url>` |
| Nadzorna ploča pogrešaka aplikacije, latencije i dostupnosti | `<dashboard-url>` |
| Nadzorna ploča procesora, memorije, diska i ponovnih pokretanja poslužitelja ili poda | `<dashboard-url>` |
| Nadzorna ploča veza, zaključavanja, diska i replikacije PostgreSQL-a | `<dashboard-url>` |
| Zapisnici i opcijski pozadinski sustav OTel praćenja | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose projekt/datoteke ili Kubernetes kontekst/namespace | `<exact-target>` |
| Lokacije main instance, workera, baze podataka i pohrane | `<services-or-deployments>`, `<storage-ids>` |
| Odobreni testni (smoke) workflow i očekivani rezultat | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Postupak sigurnosnog kopiranja baze i datoteka, zadnji test vraćanja | `<procedure-url>`, `<test-date>` |
| Ciljevi vremena oporavka (RTO) i točke oporavka (RPO) | `<RTO>`, `<RPO>` |

Čuvajte kontakte i poveznice na nadzorne ploče u zaštićenoj operativnoj kopiji implementacije. Dokazi trebaju sadržavati identifikatore, vremenske oznake, brojače i pročišćene pogreške umjesto vjerodajnica ili payloadova workflowa.

## Inventar platforme

| Komponenta | Odgovornost | Implikacija kod incidenta |
| --- | --- | --- |
| Frontend i glavni backend (main) | UI, API, MCP, Portal, interaktivno izvođenje | Zasebno provjerite javnu rutu i glavni proces |
| PostgreSQL | Stanje aplikacije, registar izvođenja, red čekanja, utori za istodobnost, koordinacija i obavijesti | Prekid baze podataka može zaustaviti i obradu zahtjeva i izvođenje u pozadini |
| Instance workera, kada je omogućen način cluster | Prihvatljiva pozadinska izvođenja u redu čekanja | Zdravi workeri ne zamjenjuju javne endpointe main instance |
| Izabrani proces vođe (leader) | Cron, procjena upozorenja, pozadinska koordinacija | Kompatibilni worker može postati vođa; to ne mijenja njegovu ulogu u main |
| Trajna pohrana main instance | Drive datoteke, instalirani dodaci i radni prostori agenata za kodiranje | Obnovite pohranu zajedno s main instancom; usmjeravanje ingressa na workera je ne obnavlja |
| Pozadinski sustav sandboxa na svakoj instanci izvođenja | Docker spremnici ili Kubernetes podovi za izolirano izvođenje | Neispravan pozadinski sustav sandboxa može utjecati na odabrane čvorove dok UI radi |
| Ovisnosti workflowa | Pružatelji modela, MCP poslužitelji, vanjski API-ji, spremišta podataka i usluge razmjene poruka | Utvrdite zakazuje li pojedinačna ovisnost ili cijela platforma |
| Opcijski OTel sakupljač | Izvezeni rasponi (spans) workflowa, čvorova i alata Agenta | Sam nedostatak izvezenih praćenja ne dokazuje neuspjeh izvođenja |

Heymov ugrađeni red čekanja izvođenja koristi PostgreSQL. Redis, RabbitMQ i vektorska spremišta mogu biti ovisnosti workflowa; nisu obavezne usluge za ugrađeni red čekanja.

`GET /api/health` izvještava samo o stanju procesa i verziji. Ne testira PostgreSQL, red čekanja, izbor vođe, kapacitet sandboxa niti sinkronizaciju credentials. Pozitivan odgovor je pojedinačna provjera, a ne jamstvo potpune operativne spremnosti.

## Prvih pet minuta

| Korak | Radnja | Odluka ili dokaz |
| --- | --- | --- |
| 1 | Potvrdite upozorenje i provjerite okruženje, uslugu i vrijeme početka | Zabilježite vremenske oznake UTC i najnoviju promjenu izdanja/konfiguracije |
| 2 | Provjerite javni UI i `/api/health`, zatim izravni main backend | Javni kvar uz zdrav izravni backend ukazuje na probleme s usmjeravanjem ili frontendom |
| 3 | Provjerite povezivost PostgreSQL-a i opterećenje vezama | Usmjerite kvarove baze podataka na L1 prije ponovnog pokretanja aplikacijskih usluga |
| 4 | Provjerite stanje spremnika/podova, CPU, memoriju, disk i nedavne pogreške | Razdvojite kvar infrastrukture, preopterećenje i pogreške specifične za workflow |
| 5 | U načinu cluster provjerite **Postavke > Instance**, stanja redova i dokaze vođe | Prepoznajte gubitak main instance, offline/neusklađene workere ili rad vezan isključivo uz main |
| 6 | Dodijelite razinu ozbiljnosti i pokrenite jednu mjeru ublažavanja iz tablice usmjeravanja | Za P1/P2 odmah otvorite incident i uključite mjerodavnog vlasnika |
| 7 | Provjerite izvođenje sigurnog produkcijskog workflowa i pratite oporavak | Potvrdite poboljšanje starosti reda, pogrešaka i resursa; odredite vrijeme sljedećeg ažuriranja |

Ako se izdanje podudara s kvarom, pregledajte [Neispravna implementacija ili regresija konfiguracije](./operations-runbook.md#bad-deployment-or-configuration-regression). Provjerite kompatibilnost sheme prije vraćanja unatrag (rollback).

## Ozbiljnost i odgovor

Ovo su početni ciljevi odgovora. Primijenite pravila o incidentima i poslovni utjecaj konkretne implementacije ako su stroži.

| Ozbiljnost | Primjeri | Odgovor |
| --- | --- | --- |
| P1 | Main nedostupan svim korisnicima; baza podataka nedostupna ili upisi ne uspijevaju; masovni neuspjeh izvođenja; kritični unos nedostupan kroz sve workflowe | Trenutno ublažavanje, evidencija incidenta, dežurstvo za platformu i ovisnosti |
| P2 | Rastući zastoj u redu čekanja; gubitak kapaciteta workera; približavanje iscrpljenju veza; jedan workflow narušava zajednički kapacitet; ponavljana rušenja zbog OOM-a | Odmah započeti ublažavanje, cilj obuzdavanja unutar 15 minuta, evidencija incidenta |
| P3 | Izolirani kvar workflowa ili pružatelja usluge; ograničen utjecaj uz očuvan kapacitet platforme | Vlasnik workflowa ili komponente, evidentirano praćenje i bilješka dežurstva |
| P4 | Informativni signal, očekivani trend kapaciteta, provjereni lažni alarm | Primiti na znanje, dokumentirati i po potrebi prilagoditi praćenje |

## Usmjeravanje signala na L1

Koristite ova relativna sidra pri konfiguriranju poveznica upozorenja. Gdje usluga praćenja zahtijeva apsolutni URL, dodajte prefiks lokacije vaše hostirane operativne kopije.

| Signal | Počnite ovdje |
| --- | --- |
| UI/API nedostupan, javne pogreške 5xx, neuspjeh provjere stanja procesa | [UI ili API nije u funkciji](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL nedostupan, veza odbijena, pogreška pri upisu | [Baza podataka nije u funkciji](./operations-runbook.md#postgresql-down-or-not-writable) |
| Previše klijenata, istek vremena za pool, čekanje na zaključavanja, skok aktivnih veza | [Veze i zaključavanja baze podataka](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| Potrebno kontrolirano ponovno pokretanje backenda ili workera | [Ponovno pokretanje usluge](./operations-runbook.md#controlled-service-restart) |
| Skok u broju izvođenja, ukupnom trajanju, tokenima, CPU-u ili memoriji | [Workflowi koji troše najviše resursa](./operations-runbook.md#most-resource-consuming-workflows) |
| Rastući red čekanja, izvođenja na čekanju ili naizgled zaglavljena | [Zaostatak u redu čekanja (backlog)](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Instanca offline ili neusklađena, worker neaktivan, problem s raspoređivanjem ili distribucijom | [Provjere načina cluster](./operations-runbook.md#cluster-mode-checks) |
| Gubitak main instance dok workeri ostaju zdravi | [Glavna instanca nedostupna](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Pogreške Webhooka, kvarovi MCP/Portala, prekidi SSE strujanja | [Endpointi ingressa i izvođenja](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, pun disk, kvar trajnog volumena | [Problem sa spremnikom, podom ili pohranom](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Pogreške pružatelja Agenta/LLM/MCP-a, kod 429, neuspjeh credentials | [Kvar modela ili integracije](./operations-runbook.md#model-credential-or-integration-failure) |
| Kvarovi sandboxa za Code, Playwright, skill ili agenta za kodiranje | [Kvar sandboxa](./operations-runbook.md#sandbox-failure) |
| Oporavak ne može postići ciljeve; izgubljena baza podataka ili datoteke | [Oporavak i odgovor na katastrofe](./operations-runbook.md#recovery-and-disaster-response) |

## Eskalacija

| Nalaz | Uključiti | Pružiti |
| --- | --- | --- |
| Zahvaćeno više sučelja ili workflowa | Dežurni za platformu i voditelj incidenta | Okruženje, opseg, vrijeme početka, mjere ublažavanja, sljedeće ažuriranje |
| Baza podataka nedostupna, zasićena, zaključana ili nema prostora na disku | Dežurni za bazu podataka | ID baze, broj veza, blokirajući PID-ovi, pročišćene pogreške, stanje pohrane |
| Kvar poda/čvora, povezivanje pohrane, kapacitet sandboxa | Vlasnik infrastrukture/pohrane | Kontext, namespace, radno opterećenje, događaji poda, pritisak na resurse |
| Javna ruta ne uspijeva dok izravni backend radi | Vlasnik mreže/ingressa | Zahvaćene rute, statusni kodovi, latencija, usporedba s backendom |
| Jedan workflow dominira opterećenjem ili zakazuje izolirano | Vlasnik dotičnog workflowa | ID-ovi workflowa/izvođenja, izvor triggera, brzina, vremenski prozor, privremena ograničenja |
| Povezana promjena implementacije ili konfiguracije | Vlasnik izdanja | Sažetak (digest) aktivne slike, vrijeme uvođenja, revizija sheme, zadnje ispravno izdanje |
| Kvota, provjera autentičnosti ili dostupnost pružatelja usluge | Vlasnik credentiala ili integracije | Pružatelj, model/usluga, statusni kod, ID zahtjeva ako je sigurno; bez tajnih vrijednosti |

Ako utjecaj razine P1/P2 potraje nakon prve mjere ublažavanja, odmah eskalirajte s već prikupljenim dokazima. Nemojte čekati potpunu analizu temeljnog uzroka.

## Očekivano ponašanje u slučaju kvara

| Kvar | Što može nastaviti s radom | Prva radnja |
| --- | --- | --- |
| PostgreSQL nedostupan | Statički frontend se još uvijek može učitati | Obnovite putanju do baze podataka; nemojte ponovno pokretati svaku instancu aplikacije |
| Main nedostupan, workeri zdravi | Prihvatljivi pozadinski poslovi i raspoređivanje mogu se nastaviti ako kompatibilni worker preuzme vodstvo | Obnovite main s njegovom trajnom pohranom; javni UI/API/MCP/Portal ostaju nedostupni |
| Worker nedostupan | Druge prihvatljive instance preuzimaju zadatke iz reda čekanja prilikom njihove preraspodjele | Provjerite raspodjelu, rezervni kapacitet i oporavak prije ponovnog uvođenja prometa |
| Prekinuto izvođenje | Prihvatljiva izvođenja koja se mogu oporaviti mogu se ponovno pokrenuti od početka, jednom | Provjerite automatski oporavak i vanjske nuspojave prije ručnog ponavljanja |
| Preopterećenje poslom namijenjenim isključivo main instanci | Workeri mogu ostati neaktivni | Smanjite problematični unos ili povećajte kapacitet main instance; promjene težina ne premještaju fiksirani rad |
| Interni sustav upozoravanja nedostupan | Vanjsko praćenje dostupnosti/baze/infrastrukture može nastaviti raditi | Koristite praćenje izvan Heyma; upozorenja Heyma ovise o istoj bazi i raspoređivaču |
| Sandbox ili pružatelj nedostupan | Workflowi bez te ovisnosti mogu raditi | Izolirajte zahvaćene workflowe i popravite ovisnost |

## Oporavak i zatvaranje incidenta

1. Provjerite javni pristup, pristup bazi podataka, predviđenu prihvatljivost instanci i siguran testni (smoke) workflow u produkcijskom načinu rada. Test u uređivaču ne dokazuje prosljeđivanje workerima.
2. Pratite najmanje 10 minuta stabilnost pogrešaka, latencije, korištenja resursa i smanjenje starosti reda čekanja. Također pratite sljedeći očekivani kritični raspored ili dogovorenu istovjetnu provjeru.
3. Uskladite neuspjela, oporavljena, preskočena, istekla i izvođenja na čekanju s vlasnicima workflowa. Provjerite vanjske nuspojave prije ponovnog pokretanja bilo kojeg zadatka.
4. Postupno ukinite privremene pauze triggera, ograničenja i težine workera. Dodijelite vlasnika i vrijeme isteka svakom preostalom ograničenju.
5. Ažurirajte incident s podacima o utjecaju, UTC vremenskom crtom, radnjama, dokazima i preostalim rizicima. Dodijelite pregled temeljnog uzroka (post-mortem) za P1/P2 i ažurirajte oba dokumenta ako je neki postupak nedostajao.

## Povezane operativne reference

- [Postavljanje naredbi L1 i provjere](./operations-runbook.md#command-setup)
- [Rad i implementacija](../getting-started/running-and-deployment.md)
- [Raspodjela opterećenja](./cluster.md)
- [Implementacija na Kubernetesu](../getting-started/kubernetes.md)
- [Sigurnost i rotacija ključeva](./security.md)
