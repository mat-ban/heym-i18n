# Wprowadzenie

**Buduj systemy agentowe. Uruchamiaj je z pewnością.**

Heym to infrastruktura do uruchamiania i zarządzania agentami AI w środowisku produkcyjnym. Orkiestruj agentów, automatyzuj procesy biznesowe, analizuj każde wykonanie i zachowaj kontrolę po stronie człowieka. Wdrażaj Heym na własnej infrastrukturze.

W Heym workflow definiuje sposób, w jaki agenci, deterministyczne kroki, narzędzia i dane współpracują ze sobą. Środowisko uruchomieniowe wykonuje ten graf, rejestruje każde uruchomienie i wstrzymuje się do przeglądu przez człowieka w miejscach, w których zostanie to zdefiniowane. Wizualny canvas służy do budowania i analizowania workflow, a te same workflow można uruchamiać również z poziomu API, harmonogramów, triggerów zdarzeń, klientów MCP oraz czatów Portal. Odwiedź [heym.run](https://heym.run), aby zapoznać się ze stroną produktu, oraz [Dlaczego Heym](./why-heym.md), aby poznać zakres obsługi przez Heym na każdym etapie cyklu życia agenta.

## Co można zrobić

- **Budować** – Komponuj agentów i deterministyczne kroki na [canvasie](../reference/canvas-features.md) w zakładce [Workflows](../tabs/workflows-tab.md), opisuj je [Asystentowi AI](../reference/ai-assistant.md) lub rozpocznij od [Szablonów](../tabs/templates-tab.md)
- **Orkiestrować** – Koordynuj węzły [Agent](../nodes/agent-node.md), [LLM](../nodes/llm-node.md) i [RAG](../nodes/rag-node.md), [podagentów](../reference/agent-architecture.md), narzędzia MCP oraz [integracje](../reference/integrations.md), takie jak HTTP, Slack i poczta e-mail, z [równoległym wykonywaniem](../reference/parallel-execution.md) tam, gdzie pozwalają na to zależności
- **Uruchamiać** – Uruchamiaj workflow z poziomu [webhooków](../reference/webhooks.md), harmonogramów [Cron](../nodes/cron-node.md) i [triggerów](../reference/triggers.md) zdarzeń, z ponowieniami na poziomie węzła, [obsługą błędów](../nodes/error-handler-node.md) i [dystrybucją obciążenia](../reference/cluster.md) między instancjami
- **Obserwować** – Analizuj [historię wykonań](../reference/execution-history.md), [ślady LLM](../tabs/traces-tab.md) wraz z kosztami tokenów, [analitykę](../tabs/analytics-tab.md) i [alerty](../tabs/alerts-tab.md) oraz eksportuj ślady [OpenTelemetry](../reference/opentelemetry.md)
- **Ewaluować** – Testuj prompty i modele względem oczekiwanych wyników w zakładce [Ewaluacja](../tabs/evals-tab.md)
- **Kontrolować** – Wstrzymuj agentów do [przeglądu przez człowieka](../reference/human-in-the-loop.md), blokuj niebezpieczne treści za pomocą [guardrails](../reference/guardrails.md) i zarządzaj dostępem za pomocą [danych logowania](../tabs/credentials-tab.md), [zespołów](../reference/teams.md), [logowania jednokrotnego](../reference/sso.md) oraz [dziennika audytu](../reference/audit.md)
- **Udostępniać** – Udostępniaj workflow przez REST i [strumieniowanie SSE](../reference/sse-streaming.md), jako narzędzia [MCP](../tabs/mcp-tab.md) oraz jako interfejsy czatu [Portal](../reference/portal.md) dla użytkowników końcowych; używaj zakładki [Chat](../tabs/chat-tab.md) do bezpośredniego testowania modeli
- **Rozmawiać z Heym** – Zadawaj pytania o produkcie z uwzględnieniem kontekstu strony w oknie [Chat with Heym](../reference/chat-with-heym.md) w dokumentacji

## Kluczowe pojęcia

- **Workflows** – Graf skierowany złożony z węzłów i krawędzi. Zarządzaj nimi w zakładce [Workflows](../tabs/workflows-tab.md). Zobacz [Struktura workflow](../reference/workflow-structure.md).
- **Węzły** – Jednostki przetwarzania ([Wejście](../nodes/input-node.md), [LLM](../nodes/llm-node.md), [Warunek](../nodes/condition-node.md) itp.). Zobacz [Typy węzłów](../reference/node-types.md).
- **Krawędzie** – Połączenia definiujące przepływ wykonania
- **Dane logowania** – Klucze API i sekrety przechowywane w zakładce [Dane logowania](../tabs/credentials-tab.md), przywoływane przez węzły.
- **Zmienne** – Trwałe dane klucz-wartość w zakładce [Zmienne](../tabs/global-variables-tab.md), dostępne przez `$global.variableName`. Zobacz [Zmienne globalne](../reference/global-variables.md).
- **Wyrażenia** – Odwołania do danych z wcześniejszych etapów za pomocą `$input` i `$nodeName.field`. Zobacz [Expression DSL](../reference/expression-dsl.md).

## Powiązane

- [Dlaczego Heym](./why-heym.md) – Zakres obsługi przez Heym na każdym etapie cyklu życia agenta
- [Szybki start](./quick-start.md) – Zbuduj pierwszy workflow
- [Uruchamianie i wdrażanie](./running-and-deployment.md) – Uruchom lokalnie za pomocą `run.sh` lub wdróż za pomocą `deploy.sh`
- [Asystent AI](../reference/ai-assistant.md) – Twórz workflow za pomocą języka naturalnego
- [Chat with Heym](../reference/chat-with-heym.md) – Zadawaj pytania uzupełniające podczas czytania dokumentacji
- [Kluczowe pojęcia](./core-concepts.md) – Workflow, węzły i przepływ wykonania
- [Zakładka Workflows](../tabs/workflows-tab.md) – Zarządzaj workflow i folderami
- [Zakładka Dane logowania](../tabs/credentials-tab.md) – Dodawaj klucze API dla węzłów
