# Įmonė

Komercinė licencija, profesionali parama ir diegimo paslaugos Heym platformai.

## Apžvalga

Heym yra nemokama naudoti ir gali būti savarankiškai talpinama pagal savo šaltinio licenciją. Organizacijoms, kurioms reikalinga komercinė licencija, gamybos lygio diegimo pagalba ar specializuota parama, Įmonių planas siūlo praktines paslaugas iš Heym komandos.

| Paslauga | Aprašymas |
|----------|-----------|
| **Gamybos agentų parama** | Architektūros apžvalgos, agentų ir workflow dizaino gairės, bei praktinė pagalba diegiant agentus |
| **Įrankių mokymai** | Įvadiniai užsiėmimai ir mokymai Jūsų komandai, apimantys workflow redaktorių, AI mazgus, agentus ir integracijas |
| **Heym Q&A** | Tiesioginis prieigos prie Heym inžinierių komandos užtikrinimas platformos klausimams, geriausioms praktikoms ir trikčių šalinimui |
| **Kubernetes diegimas** | Pagalba su daugiadarbiniais mazgų nustatymais, šoninėmis konteinerių konfigūracijomis, mastelio didinimo strategijomis ir klasterio konfigūracija |
| **Sprendimų konsultacijos** | Individualių sprendimų dizainas Jūsų specifiniam atvejui, įskaitant integracijos planavimą ir architektūros rekomendacijas |
| **Prioritetinė parama ir SLA** | Garantijos dėl atsakymo laikų ir prioritetinio problemų sprendimo |
| **Individualus vystymas** | Funkcijų kūrimas ir modifikacijos, pritaikytos Jūsų organizacijos reikalavimams |

## Gamybos agentų parama

Heym komanda padeda Jums kurti, statyti ir stiprinti agentus bei workflows Jūsų verslo procesams. Tai apima Jūsų reikalavimų peržiūrą, mazgų konfigūracijų rekomendacijas ir užtikrinimą, kad Jūsų workflows atitiktų geriausias praktikas patikimumui, stebimumui ir valdymui.

Parama apima visų tipų mazgus, įskaitant [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [HTTP](../nodes/http-node.md) ir [Cron](../nodes/cron-node.md) triggerius — taip pat pažangius modelius, tokius kaip [multi-agent orchestration](./agent-architecture.md), [Human-in-the-Loop](./human-in-the-loop.md) kontrolės taškai ir [parallel execution](./parallel-execution.md) per šakas.

## Įrankių mokymai

Praktiniai mokymai, pritaikyti Jūsų komandos įgūdžių lygiui ir naudojimo atvejams:

- Workflow redaktorius ir [drobės funkcijos](./canvas-features.md)
- AI varomi mazgai: [LLM](../nodes/llm-node.md), [Agent](../nodes/agent-node.md), [RAG](../nodes/rag-node.md)
- [Agentų architektūra](./agent-architecture.md) ir multi-agent orchestration
- [Kredencialų](./credentials.md) valdymas ir [trečiųjų šalių integracijos](./integrations.md)
- [Triggeriai](./triggers.md), [webhook'ai](./webhooks.md) ir planavimas su [Cron](../nodes/cron-node.md)
- [Expression DSL](./expression-dsl.md) ir [globalūs kintamieji](./global-variables.md)
- [Komandų](./teams.md) bendradarbiavimas ir [kredencialų dalijimasis](./credentials-sharing.md)
- [Portalas](./portal.md) diegimas klientams skirtoms pokalbių sąsajoms
- [Vykdymai](../tabs/traces-tab.md) ir [Vertinimai](../tabs/evs-tab.md) AI workflow stebimumui

## Kubernetes diegimas

Standartinis [Veikimo ir diegimo](../getting-started/running-and-deployment.md) vadovas apima Docker Compose vieno serverio gamybos nustatymams. Įmonių klientai gauna pagalbą su gamybos Kubernetes diegimais, užtikrinančiais didelį prieinamumą ir horizontalų mastelio didinimą:

- **Daugiadarbiniai mazgai** — Heym backend darbuotojų paskirstymas per kelis Kubernetes mazgus, siekiant užtikrinti atsargines kopijas ir apkrovos balansavimą
- **Šoninės konteinerių konfigūracijos** — Šoninių modelių konfigūravimas žurnalų rinkimui, stebėjimo agentams, paslaugų tinklams (Istio, Linkerd) ir slaptažodžių injekcijai (Vault)
- **Išteklių planavimas** — CPU ir atminties užklausos/limitai, podų sutrikimų biudžetai ir horizontalios podų automatinio mastelio didinimo politikos
- **Tinklavimas** — Ingress kontrolerio konfigūracija, TLS nutraukimas ir vidinė paslaugų komunikacija tarp backend, frontend ir duomenų bazės podų
- **Nuolatinis saugojimas** — Duomenų bazės ir vektorių saugyklos tūrio suteikimas su tinkama StorageClass ir atsarginių kopijų strategijomis
- **Stebėjimas** — Integracija su Prometheus, Grafana arba Jūsų esama stebėjimo sistema konteinerių metrikoms, žurnalams ir įspėjimams

## Sprendimų konsultacijos

Kiekviena organizacija vykdo agentus prieš skirtingas sistemas ir apribojimus. Heym komanda teikia konsultacijas, kad padėtų Jums:

- Įvertinti, ar Heym atitinka Jūsų specifinį atvejį
- Kurti end-to-end agentų ir workflow architektūras
- Planuoti integracijas su Jūsų esama infrastruktūra ir trečiųjų šalių paslaugomis
- Išspręsti sudėtingus workflows ir gamybos problemas
- Migracija esamų workflows iš tokių įrankių kaip n8n, Zapier ar Make.com

## Kontaktai

Susisiekite su įmonių komanda adresu **enterprise@heym.run** dėl licencijų užklausų, kainodaros ar norėdami suplanuoti įvadinį pokalbį.

## Susiję

- [Veikimas ir diegimas](../getting-started/running-and-deployment.md) — Gamybos diegimas su Docker Compose
- [Saugumas](./security.md) — Platformos saugumo praktikos ir konfigūracija
- [Paralelinis vykdymas](./parallel-execution.md) — Multi-worker vykdymo modelis
- [Komandos](./teams.md) — Komandų bendradarbiavimas ir išteklių dalijimasis
- [Visas funkcijų rinkinys](./features.md) — Išsami Heym galimybių apžvalga
