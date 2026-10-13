# Enterprise

Kaubanduslik litsentsimine, professionaalne tugi ja juurutusteenused Heymi platvormile.

## Ülevaade

Heym on tasuta kasutada ja ise majutada oma lähtekoodi-availku litsentsi alusel. Organisatsioonidele, kes vajavad kaubanduslikku litsentsimist, tootmistasemel juurutusabi või pühendatud tuge, pakub Enterprise plaan käed-külge teenuseid Heymi meeskonnalt.

| Teenus | Kirjeldus |
|---------|-------------|
| **Tootmisagentide tugi** | Arhitektuuri ülevaatused, agentide ja workflow'de disaini juhendamine ning käed-külge abi agentide tootmisse viimisel |
| **Tööriistade koolitus** | Onboarding-kohtumised ja koolitused teie meeskonnale, mis hõlmavad workflow redaktorit, AI sõlmi, agente ja integratsioone |
| **Heym Q&A** | Otsene juurdepääs Heymi insenerimeeskonnale platvormi küsimuste, parimate tavade ja tõrkeotsingu jaoks |
| **Kubernetes juurutus** | Abi mitme worker-node'i seadistuste, sidecar konteinerite, skaleerimisstrateegiate ja cluster konfiguratsiooni puhul |
| **Lahenduste konsultatsioon** | Kohandatud lahenduse disain teie konkreetse kasutusjuhtumi jaoks, sealhulgas integratsiooni planeerimine ja arhitektuuri soovitused |
| **Prioriteetne tugi ja SLA** | Garanteeritud reageerimisajad ja prioriteetne probleemide lahendamine |
| **Kohandatud arendus** | Funktsioonide arendus ja muudatused, mis on kohandatud teie organisatsiooni nõuetele |

## Heym Work

[Heym Work](./heym-work.md) on ärimeeskondadele mõeldud liides, mis töötab Heymi peal. Inimesed kirjeldavad ülesannet, vastavad mõnele küsimusele ja saavad testitud workflow, töötavad nende jaoks loodud lehtedel ning vastavad ülevaatustele – ühekordse sisselogimise (SSO), Owner, Editor ja Viewer rollide ning nimega igal käivitusel. See töötab teie Heymi kõrval oma litsentsiga; ühendage see jaotises **Settings → Heym Work**. Lisateavet ja prooviversiooni taotlemist leiate aadressilt [heym.run/enterprise](https://heym.run/enterprise).

## Tootmisagentide tugi

Heymi meeskond aitab teil kavandada, ehitada ja tugevdada agente ja workflow'sid teie äriprotsesside jaoks. See hõlmab teie nõuete ülevaatamist, sõlmede konfiguratsioonide soovitamist ja veendumist, et teie workflow'd järgivad parimaid tavasid usaldusväärsuse, jälgitavuse ja halduse osas.

Tugi katab kõiki sõlmetüüpe, sealhulgas [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) ja [Cron](../nodes/cron-node.md) triggerid — samuti täiustatud mustreid nagu [mitme-agendi orkestreerimine](./agent-architecture.md), [Human-in-the-Loop](./human-in-the-loop.md) kontrollpunktid ja [paralleelne täitmine](./parallel-execution.md) harude lõikes.

## Tööriistade koolitus

Praktilised koolituskohtumised, mis on kohandatud teie meeskonna oskuste tasemele ja kasutusjuhtumitele:

- Workflow redaktor ja [lõuendi funktsioonid](./canvas-features.md)
- AI-toega sõlmed: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Agendi arhitektuur](./agent-architecture.md) ja mitme-agendi orkestreerimine
- [Mandaatide](./credentials.md) haldamine ja [kolmandate osapoolte integratsioonid](./integrations.md)
- [Triggerid](./triggers.md), [webhookid](./webhooks.md) ja ajastamine [Croniga](../nodes/cron-node.md)
- [Avaldise DSL](./expression-dsl.md) ja [globaalsed muutujad](./global-variables.md)
- [Meeskondade](./teams.md) koostöö ja [mandaatide jagamine](./credentials-sharing.md)
- [Portaali](./portal.md) juurutus kliendisuunaliste chat-liideste jaoks
- [Käivitused](../tabs/traces-tab.md) ja [Hindamised](../tabs/evals-tab.md) AI workflow'de jälgitavuse jaoks

## Kubernetes juurutus

Standardne [Käivitamise ja juurutamise](../getting-started/running-and-deployment.md) juhend katab Docker Compose'i ühe serveri tootmisseadistuste jaoks. Enterprise kliendid saavad abi tootmistasemel Kubernetes juurutuste puhul kõrge kättesaadavuse ja horisontaalse skaleerimise jaoks:

- **Mitu worker-node'i** — Heymi backend worker'ite jaotamine mitme Kubernetes node'i vahel koondamise ja koormuse tasakaalustamise jaoks
- **Sidecar konteinerid** — Sidecar mustrite konfigureerimine logide kogumiseks, monitooringu agentideks, teenusevõrkudeks (Istio, Linkerd) ja saladuste süstimiseks (Vault)
- **Ressursside planeerimine** — CPU ja mälu päringud/limiidid, pod disruption eelarved ja horisontaalse pod autoscaleerimise poliitikad
- **Võrgustik** — Ingress kontrolleri konfiguratsioon, TLS lõpetamine ja sisemine teenuse suhtlus backend'i, frontend'i ja andmebaasi pod'ide vahel
- **Püsiv salvestusruum** — Andmebaasi ja vektorhoidla mahu ettevalmistamine sobiva StorageClass'i ja varundusstrateegiatega
- **Monitooring** — Integratsioon Prometheus'e, Grafana või teie olemasoleva jälgitavuse stack'iga konteineri mõõdikute, logide ja teavituste jaoks

## Lahenduste konsultatsioon

Iga organisatsioon käitab agente erinevate süsteemide ja piirangute vastu. Heymi meeskond pakub konsultatsiooni, et aidata teil:

- Hinnata, kas Heym sobib teie konkreetse kasutusjuhtumi jaoks
- Kavandada otsast-otsani agentide ja workflow'de arhitektuure
- Planeerida integratsioone teie olemasoleva taristu ja kolmandate osapoolte teenustega
- Siluda keerulisi workflow'sid ja lahendada tootmisprobleeme
- Migreerida olemasolevaid workflow'sid tööriistadest nagu n8n, Zapier või Make.com

## Kontakt

Võtke ühendust enterprise meeskonnaga aadressil **enterprise@heym.run** litsentsimise küsimuste, hindade või sissejuhatava kõne planeerimiseks.

## Seotud

- [Käivitamine ja juurutamine](../getting-started/running-and-deployment.md) — Tootmisse juurutamine Docker Compose'iga
- [Turvalisus](./security.md) — Platvormi turvatavad ja konfiguratsioon
- [Paralleelne täitmine](./parallel-execution.md) — Mitme worker'i täitmismudel
- [Meeskonnad](./teams.md) — Meeskonna koostöö ja ressursside jagamine
- [Täielik funktsioonide komplekt](./features.md) — Heymi võimaluste täielik ülevaade
- [Heym Work](./heym-work.md): ärimeeskondade liides ja selle ühendamine
