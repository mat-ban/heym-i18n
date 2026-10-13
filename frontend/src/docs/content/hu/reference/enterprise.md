# Enterprise

Kereskedelmi licencelés, professzionális támogatás és telepítési szolgáltatások a Heym platformhoz.

## Áttekintés

A Heym szabadon használható és saját maga telepíthető a source-available licence alatt. Azon szervezetek számára, amelyek kereskedelmi licencelést, éles környezetre szabott telepítési támogatást vagy dedikált támogatást igényelnek, az Enterprise csomag kézzelfogható szolgáltatásokat nyújt a Heym csapatától.

| Szolgáltatás | Leírás |
|---------|-------------|
| **Production Agent Support** | Architektúra-áttekintések, ügynök- és workflow-tervezési útmutatás, valamint kézzelfogható segítség az ügynökök éles környezetbe vitele során |
| **Tool Training** | Onboarding foglalkozások és képzések az Ön csapata számára, amelyek lefedik a workflow-szerkesztőt, az AI csomópontokat, az ügynököket és az integrációkat |
| **Heym Q&A** | Közvetlen hozzáférés a Heym mérnöki csapatához platformkérdések, bevált gyakorlatok és hibaelhárítás céljából |
| **Kubernetes Deployment** | Segítségnyújtás több worker-node telepítéséhez, sidecar konténerekhez, skálázási stratégiákhoz és cluster-konfigurációhoz |
| **Solution Consulting** | Egyedi megoldástervezés az Ön konkrét felhasználási esetéhez, beleértve az integrációs tervezést és az architektúra-javaslatokat |
| **Priority Support & SLA** | Garantált válaszidők és prioritásos hibamegoldás |
| **Custom Development** | Az Ön szervezetének igényeihez szabott funkciófejlesztés és módosítások |

## Heym Work

A [Heym Work](./heym-work.md) a Heym felett futó, üzleti csapatoknak készült felület. A felhasználók leírnak egy feladatot, válaszolnak néhány kérdésre, és kapnak egy tesztelt workflow-t, a számukra készített oldalakon dolgoznak, és válaszolnak a jóváhagyásokra — egyszeri bejelentkezéssel (SSO), Owner, Editor és Viewer szerepkörökkel, valamint minden futtatásnál névvel ellátva. Saját licenccel a Heym mellett fut; csatlakoztassa a **Settings → Heym Work** menüpontban. Tudjon meg többet és kérjen próbaverziót a [heym.run/enterprise](https://heym.run/enterprise) oldalon.

## Production Agent Support

A Heym csapata segít Önnek ügynökök és workflow-k tervezésében, felépítésében és megerősítésében az Ön üzleti folyamataihoz. Ez magában foglalja az Ön követelményeinek áttekintését, a csomópont-konfigurációk javaslását, valamint annak biztosítását, hogy workflow-jai kövessék a megbízhatóság, a megfigyelhetőség és az irányítás bevált gyakorlatait.

A támogatás kiterjed minden csomóponttípusra, beleértve az [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) és [Cron](../nodes/cron-node.md) triggereket — valamint olyan fejlett mintákra, mint a [multi-agent orchestration](./agent-architecture.md), a [Human-in-the-Loop](./human-in-the-loop.md) ellenőrzési pontok és az ágak közötti [parallel execution](./parallel-execution.md).

## Tool Training

Az Ön csapatának készségszintjéhez és felhasználási eseteihez igazított gyakorlati képzések:

- Workflow-szerkesztő és [canvas funkciók](./canvas-features.md)
- AI-vezérelt csomópontok: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Agent architecture](./agent-architecture.md) és multi-agent orchestration
- [Credentials](./credentials.md) kezelés és [third-party integrations](./integrations.md)
- [Triggers](./triggers.md), [webhooks](./webhooks.md) és ütemezés [Cron](../nodes/cron-node.md) segítségével
- [Expression DSL](./expression-dsl.md) és [global variables](./global-variables.md)
- [Teams](./teams.md) együttműködés és [credentials sharing](./credentials-sharing.md)
- [Portal](./portal.md) telepítés ügyfélkapcsolati chat felületekhez
- [Traces](../tabs/traces-tab.md) és [Evals](../tabs/evals-tab.md) az AI workflow-k megfigyelhetőségéhez

## Kubernetes Deployment

A szabványos [Running & Deployment](../getting-started/running-and-deployment.md) útmutató a Docker Compose-t ismerteti egy szerveres éles környezetekhez. Az Enterprise ügyfelek segítséget kapnak éles Kubernetes telepítésekhez a magas rendelkezésre állás és a horizontális skálázás érdekében:

- **Több worker-node** — A Heym backend workerek elosztása több Kubernetes node között a redundancia és a terheléselosztás érdekében
- **Sidecar konténerek** — Sidecar minták konfigurálása loggyűjtéshez, monitoring ügynökökhöz, service mesh-ekhez (Istio, Linkerd) és secret-injektáláshoz (Vault)
- **Erőforrás-tervezés** — CPU- és memória-kérések/limitek, pod disruption budgetek és horizontális pod autoscaling szabályzatok
- **Hálózat** — Ingress controller konfiguráció, TLS termination és belső szolgáltatáskommunikáció a backend, a frontend és az adatbázis podok között
- **Perzisztens tárolás** — Adatbázis- és vektortároló-kötetek kiosztása megfelelő StorageClass-szal és biztonsági mentési stratégiákkal
- **Monitoring** — Integráció a Prometheus-szal, Grafana-val vagy az Ön meglévő megfigyelhetőségi stackjével a konténer-metrikák, logok és riasztások számára

## Solution Consulting

Minden szervezet más rendszerekkel és megkötésekkel szemben futtat ügynököket. A Heym csapata tanácsadást nyújt, hogy segítsen Önnek:

- Értékelni, hogy a Heym illik-e az Ön konkrét felhasználási esetéhez
- Végponttól végpontig terjedő ügynök- és workflow-architektúrákat tervezni
- Integrációkat tervezni az Ön meglévő infrastruktúrájával és harmadik féltől származó szolgáltatásaival
- Összetett workflow-kat hibakeresni és éles környezeti problémákat megoldani
- Meglévő workflow-kat migrálni olyan eszközökről, mint az n8n, a Zapier vagy a Make.com

## Kapcsolat

Az enterprise csapatot a **enterprise@heym.run** címen érheti el licencelési kérdésekkel, árazással kapcsolatban, vagy bemutatkozó hívás egyeztetéséhez.

## Kapcsolódó

- [Running & Deployment](../getting-started/running-and-deployment.md) — Éles telepítés Docker Compose-szal
- [Security](./security.md) — Platform biztonsági gyakorlatok és konfiguráció
- [Parallel Execution](./parallel-execution.md) — Több workeres végrehajtási modell
- [Teams](./teams.md) — Csapatmunka és erőforrás-megosztás
- [Full Feature Set](./features.md) — A Heym képességeinek teljes áttekintése
- [Heym Work](./heym-work.md): az üzleti csapatoknak készült felület és csatlakoztatásának módja
