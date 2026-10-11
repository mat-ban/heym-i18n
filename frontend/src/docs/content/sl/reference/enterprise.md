# Podjetje

Komercialne licence, profesionalna podpora in storitve uvajanja za platformo Heym.

## Pregled

Heym je brezplačen za uporabo in samostojno gostovanje pod licenco, ki omogoča dostop do izvorne kode. Za organizacije, ki potrebujejo komercialne licence, pomoč pri uvajanju v produkcijo ali namensko podporo, načrt Enterprise nudi praktične storitve ekipe Heym.

| Storitev | Opis |
|----------|------|
| **Podpora za produkcijske agente** | Pregledi arhitekture, usmeritve pri oblikovanju agentov in workflow-ov ter praktična pomoč pri uvajanju agentov v produkcijo |
| **Usposabljanje orodij** | Uvodne seje in usposabljanje za vašo ekipo, ki pokrivajo urejevalnik workflow-ov, AI vozlišča, agente in integracije |
| **Heym Q&A** | Neposreden dostop do inženirske ekipe Heym za vprašanja o platformi, najboljših praksah in odpravljanje težav |
| **Uvajanje Kubernetes** | Pomoč pri nastavitvah z več delovnimi vozlišči, stranskih kontejnerjih, strategijah skaliranja in konfiguraciji grozdov |
| **Konzultacije za rešitve** | Oblikovanje prilagojenih rešitev za vaš specifičen primer uporabe, vključno s načrtovanjem integracij in priporočili za arhitekturo |
| **Prednostna podpora in SLA** | Zagotovljeni časi odziva in prednostna rešitev težav |
| **Prilagojeni razvoj** | Razvoj funkcij in prilagoditve, prilagojene potrebam vaše organizacije |

## Podpora za produkcijske agente

Ekipa Heym vam pomaga pri oblikovanju, gradnji in utrjevanju agentov in workflow-ov za vaše poslovne procese. To vključuje pregled vaših zahtev, priporočanje konfiguracij vozlišč in zagotavljanje, da vaši workflow-i sledijo najboljšim praksam za zanesljivost, opazovanje in upravljanje.

Podpora pokriva vse vrste vozlišč, vključno z [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) in [Cron](../nodes/cron-node.md) sprožilci — ter napredne vzorce, kot so [orchestracija več agentov](./agent-architecture.md), [človeški v zanki](./human-in-the-loop.md) kontrolne točke in [paralelno izvajanje](./parallel-execution.md) čez veje.

## Usposabljanje orodij

Praktične seje usposabljanja, prilagojene znanju in primerom uporabe vaše ekipe:

- Urejevalnik workflow-ov in [funkcije platna](./canvas-features.md)
- AI-podprta vozlišča: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Arhitektura agentov](./agent-architecture.md) in orchestracija več agentov
- Upravljanje [poverenj](./credentials.md) in [integracije tretjih oseb](./integrations.md)
- [Sprožilci](./triggers.md), [webhook-i](./webhooks.md) in načrtovanje s [Cron](../nodes/cron-node.md)
- [Izrazni DSL](./expression-dsl.md) in [globalne spremenljivke](./global-variables.md)
- Sodelovanje [timov](./teams.md) in [deljenje poverjenj](./credentials-sharing.md)
- [Portal](./portal.md) za uvajanje vmesnikov za klepet s strankami
- [Izvajanja](../tabs/traces-tab.md) in [vrednotenja](../tabs/evvals-tab.md) za opazovanje AI workflow-ov

## Uvajanje Kubernetes

Standardni [vodnik za izvajanje in uvajanje](../getting-started/running-and-deployment.md) pokriva Docker Compose za enostavne produkcijske nastavitve. Stranke v okviru načrta Enterprise prejmejo pomoč pri produkcijskih uvajanju Kubernetes za visoko razpoložljivost in horizontalno skaliranje:

- **Več delovnih vozlišč** — Porazdelitev delavcev Heym backend-a po več Kubernetes vozliščih za redundanco in uravnoteženje obremenitve
- **Stranski kontejnerji** — Konfiguracija stranskih vzorcev za zbiranje dnevnikov, nadzor agentov, storitvene mreže (Istio, Linkerd) in injiciranje skrivnosti (Vault)
- **Načrtovanje virov** — Zahteve/omejitve CPU in pomnilnika, proračuni za motnje podov in politike horizontalnega samodejnega skaliranja podov
- **Mreženje** — Konfiguracija kontrolerja za dostop, TLS prekinitev in notranja komunikacija med backend, frontend in podatkovnimi podi
- **Trajna shranjevanje** — Dodeljevanje volumnov za baze podatkov in vektorske shrambe z ustrezno StorageClass in strategijami varnostnega kopiranja
- **Nadzor** — Integracija s Prometheusom, Grafano ali vašo obstoječo infrastrukturo za opazovanje za metrike kontejnerjev, dnevnike in opozorila

## Konzultacije za rešitve

Vsaka organizacija izvaja agente proti različnim sistemom in omejitvam. Ekipa Heym nudi svetovanje, da vam pomaga:

- Oceniti, ali Heym ustreza vašemu specifičnemu primeru uporabe
- Oblikovati arhitekture agentov in workflow-ov od začetka do konca
- Načrtovati integracije z vašo obstoječo infrastrukturo in storitvami tretjih oseb
- Odpravljati zapletene workflow-e in reševati težave v produkciji
- Migrirati obstoječe workflow-e iz orodij, kot so n8n, Zapier ali Make.com

## Kontakt

Dosežite ekipo za podjetja na **enterprise@heym.run** za povpraševanja o licencah, cenah ali za načrtovanje uvodnega klica.

## Sorodno

- [Izvajanje in uvajanje](../getting-started/running-and-deployment.md) — Produkcijsko uvajanje z Docker Compose
- [Varnost](./security.md) — Prakse in konfiguracija varnosti platforme
- [Paralelno izvajanje](./parallel-execution.md) — Model izvajanja z več delavci
- [Tim](./teams.md) — Sodelovanje in deljenje virov
- [Celoten nabor funkcij](./features.md) — Popoln pregled zmožnosti Heym
