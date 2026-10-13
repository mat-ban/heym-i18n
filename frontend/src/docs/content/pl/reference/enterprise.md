# Enterprise

Komercyjne licencjonowanie, profesjonalne wsparcie i usługi wdrożeniowe dla platformy Heym.

## Przegląd

Heym jest dostępny bezpłatnie i można go hostować samodzielnie na podstawie licencji source-available. Dla organizacji, które potrzebują komercyjnego licencjonowania, wsparcia wdrożeniowego klasy produkcyjnej lub dedykowanego wsparcia, plan Enterprise zapewnia usługi świadczone bezpośrednio przez zespół Heym.

| Usługa | Opis |
|---------|-------------|
| **Wsparcie produkcyjne agentów** | Przeglądy architektury, doradztwo w zakresie projektowania agentów i workflow oraz praktyczna pomoc we wdrażaniu agentów na produkcję |
| **Szkolenia z narzędzi** | Sesje wdrożeniowe i szkolenia dla zespołu obejmujące edytor workflow, węzły AI, agentów i integracje |
| **Heym Q&A** | Bezpośredni dostęp do zespołu inżynierów Heym w zakresie pytań dotyczących platformy, najlepszych praktyk i rozwiązywania problemów |
| **Wdrożenie Kubernetes** | Pomoc w konfiguracji wielu węzłów worker, kontenerów sidecar, strategii skalowania i konfiguracji klastra |
| **Doradztwo rozwiązaniowe** | Projektowanie niestandardowych rozwiązań dla konkretnego przypadku użycia, w tym planowanie integracji i rekomendacje architektoniczne |
| **Wsparcie priorytetowe i SLA** | Gwarantowane czasy reakcji i priorytetowe rozwiązywanie problemów |
| **Dedykowany rozwój** | Rozwój funkcji i modyfikacje dostosowane do wymagań organizacji |

## Heym Work

[Heym Work](./heym-work.md) to interfejs dla zespołów biznesowych działający na bazie Heym. Użytkownicy opisują zadanie, odpowiadają na kilka pytań i otrzymują przetestowany workflow, pracują na stronach stworzonych specjalnie dla nich oraz odpowiadają na przeglądy — z logowaniem jednokrotnym (SSO), rolami Owner, Editor i Viewer oraz imieniem przypisanym do każdego uruchomienia. Działa obok Twojej instancji Heym na własnej licencji; połącz go w **Settings → Heym Work**. Dowiedz się więcej i poproś o wersję próbną na [heym.run/enterprise](https://heym.run/enterprise).

## Wsparcie produkcyjne agentów

Zespół Heym pomaga projektować, budować i wzmacniać agentów oraz workflow dla procesów biznesowych. Obejmuje to analizę wymagań, rekomendacje konfiguracji węzłów oraz zapewnienie, że workflow są zgodne z najlepszymi praktykami w zakresie niezawodności, obserwowalności i zarządzania.

Wsparcie obejmuje wszystkie typy węzłów, w tym [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) oraz triggery [Cron](../nodes/cron-node.md) — a także zaawansowane wzorce, takie jak [orkiestracja wieloagentowa](./agent-architecture.md), punkty kontrolne [Human-in-the-Loop](./human-in-the-loop.md) i [wykonanie równoległe](./parallel-execution.md) między gałęziami.

## Szkolenia z narzędzi

Praktyczne sesje szkoleniowe dostosowane do poziomu umiejętności i przypadków użycia zespołu:

- Edytor workflow i [funkcje canvas](./canvas-features.md)
- Węzły oparte na AI: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Architektura agentów](./agent-architecture.md) i orkiestracja wieloagentowa
- Zarządzanie [danymi logowania](./credentials.md) i [integracje zewnętrzne](./integrations.md)
- [Triggery](./triggers.md), [webhooki](./webhooks.md) i harmonogramowanie za pomocą [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) i [zmienne globalne](./global-variables.md)
- Współpraca w [zespołach](./teams.md) i [udostępnianie danych logowania](./credentials-sharing.md)
- Wdrożenie [Portal](./portal.md) dla interfejsów chat dla klientów
- [Wykonania](../tabs/traces-tab.md) i [Ewaluacja](../tabs/evals-tab.md) dla obserwowalności workflow AI

## Wdrożenie Kubernetes

Standardowy przewodnik [Uruchamianie i wdrażanie](../getting-started/running-and-deployment.md) obejmuje Docker Compose dla konfiguracji produkcyjnych na pojedynczym serwerze. Klienci Enterprise otrzymują pomoc w produkcyjnych wdrożeniach Kubernetes dla wysokiej dostępności i skalowania poziomego:

- **Wiele węzłów worker** — Rozmieszczenie workerów backendu Heym na wielu węzłach Kubernetes dla redundancji i równoważenia obciążenia
- **Kontenery sidecar** — Konfiguracja wzorców sidecar dla zbierania logów, agentów monitorujących, service mesh (Istio, Linkerd) i wstrzykiwania sekretów (Vault)
- **Planowanie zasobów** — Żądania i limity CPU oraz pamięci, budżety zakłóceń podów i polityki automatycznego skalowania podów w poziomie
- **Sieć** — Konfiguracja kontrolera Ingress, terminacja TLS i komunikacja wewnętrzna między podami backendu, frontendu i bazy danych
- **Trwały magazyn** — Udostępnianie wolumenów bazy danych i magazynu wektorowego z odpowiednim StorageClass i strategiami tworzenia kopii zapasowych
- **Monitorowanie** — Integracja z Prometheus, Grafana lub istniejącym stosem obserwowalności dla metryk kontenerów, logów i alertów

## Doradztwo rozwiązaniowe

Każda organizacja uruchamia agentów w oparciu o różne systemy i ograniczenia. Zespół Heym świadczy doradztwo, które pomaga:

- Ocenić, czy Heym pasuje do konkretnego przypadku użycia
- Projektować kompleksowe architektury agentów i workflow
- Planować integracje z istniejącą infrastrukturą i usługami zewnętrznymi
- Debugować złożone workflow i rozwiązywać problemy produkcyjne
- Migrować istniejące workflow z narzędzi takich jak n8n, Zapier lub Make.com

## Kontakt

Z zespołem enterprise można skontaktować się pod adresem **enterprise@heym.run** w sprawie zapytań licencyjnych, cen lub ustalenia rozmowy wprowadzającej.

## Powiązane

- [Uruchamianie i wdrażanie](../getting-started/running-and-deployment.md) — Wdrożenie produkcyjne z Docker Compose
- [Bezpieczeństwo](./security.md) — Praktyki i konfiguracja bezpieczeństwa platformy
- [Wykonanie równoległe](./parallel-execution.md) — Model wykonania z wieloma workerami
- [Zespoły](./teams.md) — Współpraca zespołowa i udostępnianie zasobów
- [Pełny zestaw funkcji](./features.md) — Kompletny przegląd możliwości Heym
- [Heym Work](./heym-work.md): interfejs dla zespołów biznesowych i sposób jego połączenia
