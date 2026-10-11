# Enterprise

Kommerzielle Lizenzierung, professioneller Support und Deployment-Services für die Heym-Plattform.

## Überblick

Heym ist kostenlos nutzbar und kann unter seiner quelloffenen Lizenz selbst gehostet werden. Für Organisationen, die kommerzielle Lizenzierung, Deployment-Unterstützung in Produktionsqualität oder dedizierten Support benötigen, bietet der Enterprise-Plan praktische Services vom Heym-Team.

| Service | Beschreibung |
|---------|-------------|
| **Production Agent Support** | Architektur-Reviews, Beratung zu Agenten- und Workflow-Design sowie praktische Hilfe bei der Überführung von Agenten in die Produktion |
| **Tool Training** | Onboarding-Sitzungen und Schulungen für Ihr Team zu Workflow-Editor, AI-Knoten, Agenten und Integrationen |
| **Heym Q&A** | Direkter Zugang zum Heym-Engineering-Team für Plattformfragen, Best Practices und Fehlerbehebung |
| **Kubernetes Deployment** | Unterstützung bei Multi-Worker-Node-Setups, Sidecar-Containern, Skalierungsstrategien und Cluster-Konfiguration |
| **Solution Consulting** | Individuelles Lösungsdesign für Ihren spezifischen Anwendungsfall, einschließlich Integrationsplanung und Architekturempfehlungen |
| **Priority Support & SLA** | Garantierte Antwortzeiten und vorrangige Problembehebung |
| **Custom Development** | Feature-Entwicklung und Anpassungen, zugeschnitten auf die Anforderungen Ihrer Organisation |

## Production Agent Support

Das Heym-Team hilft Ihnen, Agenten und Workflows für Ihre Geschäftsprozesse zu entwerfen, zu erstellen und zu härten. Dies umfasst die Überprüfung Ihrer Anforderungen, die Empfehlung von Knoten-Konfigurationen und die Sicherstellung, dass Ihre Workflows Best Practices für Zuverlässigkeit, Observability und Governance befolgen.

Der Support deckt alle Knoten-Typen ab, einschließlich [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) und [Cron](../nodes/cron-node.md) Triggern — sowie fortgeschrittene Muster wie [Multi-Agent-Orchestrierung](./agent-architecture.md), [Human-in-the-Loop](./human-in-the-loop.md) Checkpoints und [parallele Ausführung](./parallel-execution.md) über Branches hinweg.

## Tool Training

Praktische Schulungssitzungen, zugeschnitten auf das Kompetenzniveau und die Anwendungsfälle Ihres Teams:

- Workflow-Editor und [Canvas-Funktionen](./canvas-features.md)
- KI-gestützte Knoten: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Agent-Architektur](./agent-architecture.md) und Multi-Agent-Orchestrierung
- [Anmeldedaten](./credentials.md)-Verwaltung und [Drittanbieter-Integrationen](./integrations.md)
- [Trigger](./triggers.md), [Webhooks](./webhooks.md) und Zeitplanung mit [Cron](../nodes/cron-node.md)
- [Ausdrucks-DSL](./expression-dsl.md) und [globale Variablen](./global-variables.md)
- [Teams](./teams.md)-Zusammenarbeit und [Credentials-Sharing](./credentials-sharing.md)
- [Portal](./portal.md)-Deployment für kundenorientierte Chat-Oberflächen
- [Traces](../tabs/traces-tab.md) und [Evals](../tabs/evals-tab.md) für die Observability von KI-Workflows

## Kubernetes Deployment

Der Standard-Leitfaden [Betrieb & Deployment](../getting-started/running-and-deployment.md) behandelt Docker Compose für Single-Server-Produktions-Setups. Enterprise-Kunden erhalten Unterstützung bei Kubernetes-Produktions-Deployments für Hochverfügbarkeit und horizontale Skalierung:

- **Mehrere Worker-Nodes** — Verteilung der Heym-Backend-Worker über mehrere Kubernetes-Nodes für Redundanz und Lastverteilung
- **Sidecar-Container** — Konfiguration von Sidecar-Mustern für Log-Sammlung, Monitoring-Agenten, Service Meshes (Istio, Linkerd) und Secret-Injection (Vault)
- **Ressourcenplanung** — CPU- und Speicher-Requests/Limits, Pod Disruption Budgets und Richtlinien für horizontales Pod-Autoscaling
- **Networking** — Ingress-Controller-Konfiguration, TLS-Terminierung und interne Service-Kommunikation zwischen Backend-, Frontend- und Datenbank-Pods
- **Persistenter Speicher** — Volume-Bereitstellung für Datenbank und Vektorspeicher mit geeigneter StorageClass und Backup-Strategien
- **Monitoring** — Integration mit Prometheus, Grafana oder Ihrem bestehenden Observability-Stack für Container-Metriken, Logs und Warnungen

## Solution Consulting

Jede Organisation betreibt Agenten gegen unterschiedliche Systeme und unter verschiedenen Rahmenbedingungen. Das Heym-Team bietet Beratung, um Ihnen zu helfen:

- Zu bewerten, ob Heym zu Ihrem spezifischen Anwendungsfall passt
- End-to-End-Agenten- und Workflow-Architekturen zu entwerfen
- Integrationen mit Ihrer bestehenden Infrastruktur und Drittanbieter-Services zu planen
- Komplexe Workflows zu debuggen und Produktionsprobleme zu beheben
- Bestehende Workflows aus Tools wie n8n, Zapier oder Make.com zu migrieren

## Kontakt

Erreichen Sie das Enterprise-Team unter **enterprise@heym.run** für Lizenzanfragen, Preisgestaltung oder um ein Einführungsgespräch zu vereinbaren.

## Verwandte Themen

- [Betrieb & Deployment](../getting-started/running-and-deployment.md) — Produktions-Deployment mit Docker Compose
- [Security](./security.md) — Sicherheitspraktiken und -konfiguration der Plattform
- [Parallele Ausführung](./parallel-execution.md) — Multi-Worker-Ausführungsmodell
- [Teams](./teams.md) — Team-Zusammenarbeit und Ressourcen-Sharing
- [Vollständiger Funktionsumfang](./features.md) — Vollständige Übersicht der Heym-Funktionen
