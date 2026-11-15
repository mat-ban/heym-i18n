# Heym Incident Playbook (L0)

Használja ezt a playbookot a Heym incidens megerősítéséhez, a felhasználói hatás felméréséhez, a súlyosság (severity) kiválasztásához, valamint a megfelelő helyreállítási eljárás és felelős eléréséhez.

Részletes eljárások: [Heym Runbook (L1)](./operations-runbook.md)

Utolsó felülvizsgálat: 2026-11-10. Hatókör: self-hosted Heym, egyetlen példány vagy cluster, Docker Compose vagy Kubernetes környezetben.

## Telepítés átadása (Deployment handover)

Töltse ki ezt a táblázatot minden környezethez, mielőtt ezeket a dokumentumokat készenléti szolgálatban (on-call) használná. A nevek, URL-ek, kapacitási célok és helyreállítási célkitűzések telepítésspecifikusak. A repozitóriumban található példák nem minősülnek éles leltárnak.

| Tétel | Telepítési érték |
| --- | --- |
| Környezet és nyilvános Heym URL | `<environment>`, `<public-url>` |
| Platform készenléti felelős és helyettes | `<rotation-or-contact>`, `<backup-contact>` |
| Incidenscsatorna és incidenskövető | `<channel>`, `<tracker-url>` |
| Adatbázis készenléti felelős és adatbázis-azonosító | `<contact>`, `<database-id>` |
| Infrastruktúra-, hálózat- és tárolófelelősök | `<contacts>` |
| Release-felelős és telepítőrendszer | `<contact>`, `<deployment-url>` |
| Alkalmazáshibák, késleltetés és elérhetőség műszerfala | `<dashboard-url>` |
| Gazdagép vagy pod CPU, memória, lemez és újraindítások műszerfala | `<dashboard-url>` |
| PostgreSQL kapcsolatok, zárolások, lemez és replikáció műszerfala | `<dashboard-url>` |
| Naplók és opcionális OTel nyomkövetési háttérrendszer | `<logs-url>`, `<trace-url-or-disabled>` |
| Compose projekt/fájlok vagy Kubernetes kontextus/névtér | `<exact-target>` |
| A main, a workerek, az adatbázis és a tárolók helye | `<services-or-deployments>`, `<storage-ids>` |
| Jóváhagyott ellenőrző (smoke) workflow és elvárt eredmény | `<workflow-id>`, `<safe-input>`, `<expected-result>` |
| Adatbázis- és fájlmentési eljárás, legutóbbi visszaállítási teszt | `<procedure-url>`, `<test-date>` |
| Helyreállítási idő (RTO) és helyreállítási pont (RPO) célkitűzései | `<RTO>`, `<RPO>` |

A kapcsolatokat és a műszerfal-hivatkozásokat a telepítés korlátozott hozzáférésű működési másolatában tárolja. A bizonyítékoknak azonosítókat, időbélyegeket, számlálókat és anonimizált hibákat kell tartalmazniuk, nem pedig hitelesítő adatokat vagy workflow payloadokat.

## Platformleltár

| Komponens | Felelősség | Incidens következménye |
| --- | --- | --- |
| Frontend és fő háttérrendszer (main) | UI, API, MCP, Portal, interaktív végrehajtás | Külön ellenőrizze a nyilvános útvonalat és a fő folyamatot |
| PostgreSQL | Alkalmazásállapot, végrehajtási nyilvántartás, futási sor, párhuzamossági rések, koordináció és értesítések | Az adatbázis leállása mind a kérések kezelését, mind a háttérbeli végrehajtást leállíthatja |
| Worker példányok, ha a cluster mód engedélyezett | Várakozóban lévő, jogosult háttérfuttatások | Az egészséges workerek nem helyettesítik a main nyilvános végpontjait |
| Választott vezető (leader) folyamat | Cron, riasztásértékelés, háttérkoordináció | Egy kompatibilis worker vezetővé válhat; ez nem változtatja meg a szerepét mainre |
| A main állandó tárolója | Drive fájlok, telepített beépülő modulok és kódoló ágensek munkaterületei | A tárolót a mainnel együtt állítsa helyre; az ingress workerre irányítása nem állítja helyre |
| Sandbox háttérrendszer minden végrehajtó példányon | Docker konténerek vagy Kubernetes podok az izolált végrehajtáshoz | A hibás sandbox háttérrendszer bizonyos csomópontokat érinthet, miközben az UI működik |
| Workflow függőségek | Modell-szolgáltatók, MCP szerverek, külső API-k, adattárak és üzenetküldő szolgáltatások | Határozza meg, hogy egyetlen függőség vagy az egész platform hibásodott-e meg |
| Opcionális OTel gyűjtő | Exportált workflow, csomópont és Agent eszközök spanjei | A hiányzó exportált nyomkövetések önmagukban nem bizonyítják a futás sikertelenségét |

A Heym beépített futási sora PostgreSQL-t használ. A Redis, a RabbitMQ és a vektortárak workflow függőségek lehetnek; nem kötelező szolgáltatások a beépített sorhoz.

A `GET /api/health` kizárólag a folyamat állapotát és verzióját jelenti. Nem teszteli a PostgreSQL-t, a sort, a vezetőválasztást, a sandbox-kapacitást vagy a credentials szinkronizálását. A sikeres válasz egyetlen ellenőrzés, nem garancia a teljes működőképességre.

## Az első öt perc

| Lépés | Művelet | Döntés vagy bizonyíték |
| --- | --- | --- |
| 1 | Nyugtázza a riasztást, és ellenőrizze a környezetet, a szolgáltatást és a kezdési időt | Rögzítse az UTC időbélyegeket és a legutóbbi release/konfigurációs változást |
| 2 | Ellenőrizze a nyilvános UI-t és a `/api/health` végpontot, majd a közvetlen main háttérrendszert | A nyilvános hiba működő közvetlen háttérrendszer mellett útválasztási vagy frontend hibára utal |
| 3 | Ellenőrizze a PostgreSQL kapcsolatot és a kapcsolati terhelést | Az alkalmazásszolgáltatások újraindítása előtt irányítsa az adatbázishibákat az L1 szintre |
| 4 | Ellenőrizze a konténerek/podok állapotát, a CPU-t, a memóriát, a lemezt és a friss hibákat | Különböztesse meg az infrastruktúra hibáját, a túlterhelést és a workflow-specifikus hibát |
| 5 | Cluster módban ellenőrizze a **Beállítások > Példányok** menüt, a sorok állapotát és a vezetői bizonyítékokat | Azonosítsa a main leállását, az offline/eltérő workereket vagy a csak a mainhez kötött munkát |
| 6 | Rendeljen hozzá súlyosságot, és indítson el egy intézkedést az útválasztási táblázatból | P1/P2 esetén azonnal nyisson incidenst, és vonja be az illetékes felelőst |
| 7 | Ellenőrizzen egy biztonságos termelési módú workflow futást, és kísérje figyelemmel a helyreállást | Erősítse meg a sor korának, a hibáknak és az erőforrásoknak a javulását; tűzze ki a következő frissítés idejét |

Ha egy release egybeesik a hibával, vizsgálja meg a [Hibás telepítés vagy konfigurációs regresszió](./operations-runbook.md#bad-deployment-or-configuration-regression) részt. Visszaállítás előtt ellenőrizze a séma kompatibilitását.

## Súlyosság és reakció

Ezek kiindulási válaszcélok. Alkalmazza a telepítés incidenskezelési irányelveit és üzleti hatását, amennyiben azok szigorúbbak.

| Súlyosság | Példák | Reakció |
| --- | --- | --- |
| P1 | A main minden felhasználó számára elérhetetlen; az adatbázis nem elérhető vagy az írás sikertelen; kiterjedt végrehajtási hiba; kritikus bemenet nem érhető el a workflow-kban | Azonnali elhárítás, incidensnapló, platform és függőségi készenlét bevonása |
| P2 | Növekvő várakozási sor; elveszett workerkapacitás; fenyegető kapcsolatkimerülés; egy workflow rontja a megosztott kapacitást; ismételt OOM leállások | Azonnali intézkedés megkezdése, elszigetelés 15 percen belül, incidensnapló |
| P3 | Elszigetelt workflow vagy szolgáltatói hiba; korlátozott hatás egészséges platformkapacitás mellett | Workflow- vagy komponensfelelős, nyomon követett intézkedés és készenléti feljegyzés |
| P4 | Tájékoztató jellegű jelzés, várható kapacitástrend, ellenőrzött téves riasztás | Nyugtázás, dokumentálás és szükség esetén a felügyelet finomhangolása |

## Jelek átirányítása az L1 szintre

Használja ezeket a relatív horgonyokat a riasztási hivatkozások konfigurálásakor. Ha egy felügyeleti szolgáltatás abszolút URL-t igényel, illessze elé a tárolt működési másolat helyét.

| Jel | Kezdje itt |
| --- | --- |
| UI/API nem elérhető, nyilvános 5xx hibák, a folyamat állapotellenőrzése sikertelen | [UI vagy API leállt](./operations-runbook.md#ui-or-api-down) |
| PostgreSQL nem érhető el, kapcsolat elutasítva, írási hiba | [Adatbázis leállt](./operations-runbook.md#postgresql-down-or-not-writable) |
| Túl sok kliens, készlet időtúllépés, várakozás zárolásokra, aktív kapcsolatok kiugrása | [Adatbázis-kapcsolatok és zárolások](./operations-runbook.md#active-db-connections-pool-saturation-and-locks) |
| A háttérrendszer vagy a workerek ellenőrzött újraindítása szükséges | [Szolgáltatás újraindítása](./operations-runbook.md#controlled-service-restart) |
| Végrehajtások számának, időtartamának, tokenjeinek, CPU- vagy memóriahasználatának kiugrása | [A legtöbb erőforrást fogyasztó workflow-k](./operations-runbook.md#most-resource-consuming-workflows) |
| Növekvő várakozási sor, várakozó vagy látszólag elakadt futások | [Várakozási sor torlódása](./operations-runbook.md#queue-backlog-or-apparently-stuck-runs) |
| Offline vagy eltérő verziójú példány, inaktív worker, ütemezési vagy elosztási probléma | [Cluster mód ellenőrzése](./operations-runbook.md#cluster-mode-checks) |
| A main leállt, miközben a workerek működőképesek maradnak | [Main példány nem érhető el](./operations-runbook.md#main-instance-unavailable-while-workers-are-live) |
| Webhook hibák, MCP/Portal hibák, SSE kapcsolat megszakadása | [Ingress és végrehajtási végpontok](./operations-runbook.md#webhook-mcp-portal-or-streaming-failures) |
| OOM, CrashLoop, Pending, megtelt lemez, perzisztens kötet hiba | [Konténer, pod vagy tároló probléma](./operations-runbook.md#container-pod-oom-or-storage-issue) |
| Agent/LLM/MCP szolgáltatói hibák, 429 kód, hitelesítő adat hiba | [Modell- vagy integrációs hiba](./operations-runbook.md#model-credential-or-integration-failure) |
| Sandbox hibák Code, Playwright, skill vagy kódoló ágens esetén | [Sandbox hiba](./operations-runbook.md#sandbox-failure) |
| A helyreállítás nem tudja teljesíteni a célokat; elveszett adatbázis vagy fájlok | [Helyreállítás és katasztrófaelhárítás](./operations-runbook.md#recovery-and-disaster-response) |

## Eszkaláció

| Megállapítás | Bevonandó | Megadandó adatok |
| --- | --- | --- |
| Több felület vagy workflow érintett | Platform készenlét és incidensvezető | Környezet, hatókör, kezdési idő, intézkedések, következő frissítés ideje |
| Az adatbázis nem elérhető, telített, zárolt vagy betelt a lemez | Adatbázis készenlét | Adatbázis ID, kapcsolatok száma, blokkoló PID-k, szűrt hibák, tároló állapota |
| Pod/csomópont hiba, tárolócsatolás, sandbox-kapacitás | Infrastruktúra/tároló felelőse | Kontextus, névtér, munkaterhelés, pod-események, erőforrás-nyomás |
| A nyilvános útvonal meghiúsul, míg a közvetlen backend működik | Hálózat/ingress felelőse | Érintett útvonalak, állapotkódok, késleltetés, összehasonlítás a backenddel |
| Egyetlen workflow uralja a terhelést vagy hibásodik meg elszigetelten | Workflow tulajdonosa | Workflow/futási ID-k, trigger forrása, gyakoriság, időablak, ideiglenes korlátok |
| Összefüggő telepítési vagy konfigurációs változás | Release-felelős | Futó képfájl azonosítója (digest), bevezetési idő, sémaváltozat, legutóbbi jó kiadás |
| Szolgáltatói kvóta, hitelesítés vagy elérhetőség | Credential vagy integráció felelőse | Szolgáltató, modell/szolgáltatás, állapotkód, kérésazonosító; titkos értékek nélkül |

Ha a P1/P2 hatás az első beavatkozás után is fennáll, azonnal eszkaláljon a már összegyűjtött bizonyítékokkal. Ne várja meg a teljes kiváltó ok elemzését.

## Várható viselkedés meghibásodás esetén

| Meghibásodás | Mi folytatódhat | Első lépés |
| --- | --- | --- |
| PostgreSQL nem érhető el | A statikus frontend még betöltődhet | Állítsa helyre az adatbázis elérési útját; ne indítsa újra az összes alkalmazáspéldányt |
| Main nem érhető el, workerek épek | A jogosult háttérmunka és az ütemezés folytatódhat, ha egy kompatibilis worker vezet | Állítsa helyre a maint az állandó tárolójával; a nyilvános UI/API/MCP/Portal nem elérhető marad |
| Worker nem érhető el | Más jogosult példányok átveszik a sorban álló munkát az újrakiosztáskor | Ellenőrizze az elhelyezést, a tartalékkapacitást és a helyreállást a forgalom visszairányítása előtt |
| Megszakadt futás | A jogosult helyreállítható futások egyszer az elejétől újraindulhatnak | Kézi újrajátszás előtt ellenőrizze az automatikus helyreállítást és a külső mellékhatásokat |
| Csak a mainhez kötött munkák túlterhelése | A workerek inaktívak maradhatnak | Csökkentse a terhelő bemenetet vagy növelje a main kapacitását; a súlyozás nem mozgatja a rögzített munkát |
| Belső riasztás nem érhető el | A külső üzemidő/adatbázis/infrastruktúra felügyelet továbbra is működhet | Használjon a Heymen kívüli felügyeletet; a Heym riasztásai ugyanattól a DB-től és ütemezőtől függenek |
| Sandbox vagy szolgáltató nem érhető el | Az adott függőség nélküli workflow-k működhetnek | Különítse el az érintett workflow-kat, és javítsa a függőséget |

## Helyreállítás és incidens lezárása

1. Ellenőrizze a nyilvános hozzáférést, az adatbázis-hozzáférést, a tervezett példányok jogosultságát és egy biztonságos, éles módú ellenőrző (smoke) workflow-t. A szerkesztőben végzett teszt nem igazolja a workerekhez való eljuttatást.
2. Figyelje legalább 10 percig a hibák, a késleltetés és az erőforrás-felhasználás stabilitását, valamint a várakozási sor korának csökkenését. Figyelje a következő várható kritikus ütemezést vagy egy megállapodás szerinti egyenértékű tesztet is.
3. Egyeztesse a sikertelen, helyreállított, kihagyott, lejárt és függőben lévő futásokat a workflow-tulajdonosokkal. Bármilyen újrafuttatás előtt ellenőrizze a külső mellékhatásokat.
4. Fokozatosan állítsa vissza az ideiglenes trigger-szüneteket, korlátokat és worker-súlyozásokat. Minden fennmaradó korlátozáshoz rendeljen felelőst és lejárati időt.
5. Frissítse az incidenst a hatással, az UTC idővonallal, az intézkedésekkel, a bizonyítékokkal és a fennmaradó kockázatokkal. Rendeljen el kiváltó ok elemzést (post-mortem) a P1/P2 esetekhez, és frissítse mindkét dokumentumot, ha hiányzott egy eljárás.

## Kapcsolódó üzemeltetési dokumentumok

- [L1 parancsbeállítások és ellenőrzések](./operations-runbook.md#command-setup)
- [Futtatás és telepítés](../getting-started/running-and-deployment.md)
- [Terheléselosztás](./cluster.md)
- [Kubernetes telepítés](../getting-started/kubernetes.md)
- [Biztonság és kulcsrotáció](./security.md)
