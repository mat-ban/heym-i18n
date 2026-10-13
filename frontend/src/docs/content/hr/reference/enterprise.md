# Enterprise

Komercijalne licence, profesionalna podrška i usluge implementacije za Heym platformu.

## Pregled

Heym je besplatan za korištenje i samostalno hostanje pod svojom licencom dostupnom izvoru. Za organizacije koje trebaju komercijalne licence, pomoć pri implementaciji u produkciji ili posvećenu podršku, Enterprise plan pruža praktične usluge tima Heym.

| Usluga | Opis |
|--------|------|
| **Podrška za produkcijske agente** | Pregledi arhitekture, smjernice za dizajn agenata i workflow-a te praktična pomoć pri uvođenju agenata u produkciju |
| **Obuka alata** | Uvodne sesije i obuka za Vaš tim koja pokriva uređivač workflow-a, AI čvorove, agente i integracije |
| **Heym Q&A** | Izravan pristup inženjerskom timu Heym za pitanja o platformi, najbolje prakse i rješavanje problema |
| **Kubernetes implementacija** | Pomoć pri postavkama s više radnih čvorova, sidecar kontejnerima, strategijama skaliranja i konfiguraciji klastera |
| **Savjetovanje o rješenjima** | Prilagođeni dizajn rješenja za Vaš specifični slučaj korištenja, uključujući planiranje integracija i preporuke za arhitekturu |
| **Prioritetna podrška i SLA** | Jamčeni vremenski okviri odgovora i prioritetno rješavanje problema |
| **Prilagođeni razvoj** | Razvoj značajki i modifikacije prilagođene zahtjevima Vaše organizacije |

## Heym Work

[Heym Work](./heym-work.md) je sučelje za poslovne timove koje radi povrh platforme Heym. Korisnici opišu zadatak, odgovore na nekoliko pitanja i dobiju testirani workflow, rade sa stranica izrađenih za njih i odgovaraju na preglede, uz jedinstvenu prijavu (SSO), uloge Owner, Editor i Viewer te ime uz svako pokretanje. Radi uz vaš Heym s vlastitom licencom; povežite ga u **Settings → Heym Work**. Saznajte više i zatražite probnu verziju na [heym.run/enterprise](https://heym.run/enterprise).

## Podrška za produkcijske agente

Tim Heym pomaže Vam u dizajniranju, izgradnji i osnaživanju agenata i workflow-a za Vaše poslovne procese. To uključuje pregled Vaših zahtjeva, preporučivanje konfiguracija čvorova i osiguranje da Vaši workflows slijede najbolje prakse za pouzdanost, promatranje i upravljanje.

Podrška pokriva sve tipove čvorova uključujući [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) i [Cron](../nodes/cron-node.md) triggere — kao i napredne obrasce poput [multi-agent orchestration](./agent-architecture.md), [Human-in-the-Loop](./human-in-the-loop.md) kontrolne točke i [parallel execution](./parallel-execution.md) preko grana.

## Obuka alata

Praktične sesije obuke prilagođene razini vještina Vašeg tima i slučajevima korištenja:

- Uređivač workflow-a i [canvas značajke](./canvas-features.md)
- AI čvorovi: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Arhitektura agenata](./agent-architecture.md) i multi-agent orchestration
- Upravljanje [vjerodajnicama](./credentials.md) i [integracije trećih strana](./integrations.md)
- [Triggere](./triggers.md), [webhookove](./webhooks.md) i raspoređivanje s [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) i [globalne varijable](./global-variables.md)
- [Timovi](./teams.md) suradnja i [dijeljenje vjerodajnica](./credentials-sharing.md)
- [Portal](./portal.md) implementacija za korisničke chat sučelja
- [Izvršavanja](../tabs/traces-tab.md) i [Evaluacije](../tabs/evs-tab.md) za promatranje AI workflow-a

## Kubernetes implementacija

Standardni [Vodič za pokretanje i implementaciju](../getting-started/running-and-deployment.md) pokriva Docker Compose za produkcijske postavke na jednom poslužitelju. Enterprise korisnici dobivaju pomoć pri produkcijskim Kubernetes implementacijama za visoku dostupnost i horizontalno skaliranje:

- **Više radnih čvorova** — Distribucija Heym backend radnika preko više Kubernetes čvorova za redundanciju i ravnotežu opterećenja
- **Sidecar kontejneri** — Konfiguriranje sidecar obrazaca za prikupljanje logova, praćenje agenata, servisne mreže (Istio, Linkerd) i injekciju tajni (Vault)
- **Planiranje resursa** — CPU i memorijski zahtjevi/ograničenja, budžeti za prekid podova i politike horizontalnog automatskog skaliranja podova
- **Mrežno povezivanje** — Konfiguracija ulaznog kontrolera, TLS terminacija i interna komunikacija između backend, frontend i baza podataka podova
- **Trajna pohrana** — Provisionsiranje volumena baze podataka i vektorskih spremišta s odgovarajućim StorageClass i strategijama sigurnosne kopije
- **Praćenje** — Integracija s Prometheusom, Grafanom ili Vašim postojećim sustavom promatranja za metrike kontejnera, logove i upozorenja

## Savjetovanje o rješenjima

Svaka organizacija pokreće agente protiv različitih sustava i ograničenja. Tim Heym pruža savjetovanje kako bi Vam pomogao:

- Procijeniti odgovara li Heym Vašem specifičnom slučaju korištenja
- Dizajnirati end-to-end arhitekture agenata i workflow-a
- Planirati integracije s Vašom postojećom infrastrukturom i uslugama trećih strana
- Rješavati složene workflows i rješavati probleme u produkciji
- Migrirati postojeće workflows iz alata kao što su n8n, Zapier ili Make.com

## Kontakt

Obratite se timu za enterprise na **enterprise@heym.run** za upite o licencama, cijenama ili za zakazivanje uvodnog poziva.

## Povezano

- [Pokretanje i implementacija](../getting-started/running-and-deployment.md) — Produkcijska implementacija s Docker Compose
- [Sigurnost](./security.md) — Prakse i konfiguracija sigurnosti platforme
- [Paralelno izvršavanje](./parallel-execution.md) — Model izvršavanja s više radnika
- [Timovi](./teams.md) — Suradnja tima i dijeljenje resursa
- [Cjeloviti skup značajki](./features.md) — Potpuni pregled mogućnosti Heym-a
- [Heym Work](./heym-work.md): sučelje za poslovne timove i kako ga povezati
